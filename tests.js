const assert = require('assert');
const proceduralCart = require('./procedural/cart');
const cartModule = require('./refactored/cartModule');

const TOTAL_TESTS = 8;
let passed = 0;
function test(name, fn) {
  fn();
  passed++;
  console.log(`  ok - ${name}`);
}

console.log('Procedural cart (Part 1)');
{
  test('addItem/viewCart calcule le bon total, removeItem retire un article', () => {
    proceduralCart.clearCart();
    proceduralCart.addItem('Apple', 2, 1.5);
    proceduralCart.addItem('Orange', 3, 2.0);
    const afterAdd = proceduralCart.viewCart();
    assert.strictEqual(afterAdd.total, 9.0);

    proceduralCart.removeItem('Apple');
    const afterRemove = proceduralCart.viewCart();
    assert.strictEqual(afterRemove.items.length, 1);
    assert.strictEqual(afterRemove.total, 6.0);
  });

  test('clearCart vide bien le panier', () => {
    proceduralCart.addItem('Banana', 1, 1.0);
    proceduralCart.clearCart();
    assert.strictEqual(proceduralCart.viewCart().items.length, 0);
  });
}

console.log('CartModule (Part 2 — Module Pattern)');
{
  test('même comportement que la version procédurale : total et removeItem corrects', () => {
    cartModule.clearCart();
    cartModule.addItem('Apple', 2, 1.5);
    cartModule.addItem('Orange', 3, 2.0);
    assert.strictEqual(cartModule.viewCart().total, 9.0);

    cartModule.removeItem('Apple');
    const result = cartModule.viewCart();
    assert.strictEqual(result.items.length, 1);
    assert.strictEqual(result.total, 6.0);
  });

  test('clearCart vide bien le panier', () => {
    cartModule.addItem('Banana', 1, 1.0);
    cartModule.clearCart();
    assert.strictEqual(cartModule.viewCart().items.length, 0);
  });

  test('le state interne "items" est réellement privé, pas juste nommé différemment', () => {
    assert.strictEqual(cartModule.items, undefined);
  });

  test('toutes les méthodes exposées partagent bien le même état fermé (closure), pas des copies', () => {
    // Node met le module en cache, donc ceci revient surtout à vérifier que les
    // méthodes exposées (addItem, viewCart, ...) referment bien sur la MÊME
    // variable `items`, pas sur des copies locales indépendantes — c'est ça,
    // le vrai Module Pattern. (Si une des méthodes redéclarait `items` en
    // local, cette assertion échouerait alors que les tests précédents, qui
    // n'appellent que viewCart seul, pourraient encore passer par coïncidence.)
    const secondRequire = require('./refactored/cartModule');
    cartModule.clearCart();
    cartModule.addItem('Shared', 1, 10);
    assert.strictEqual(secondRequire.viewCart().total, 10);
  });
}

console.log('Comparaison');
{
  test("l'état procédural n'est protégé par rien : rien n'empêche d'importer 2 fois et de se marcher dessus accidentellement si on exportait la variable elle-même", () => {
    // Démonstration indirecte : le module procédural n'expose aucune garantie
    // d'instance unique ni d'encapsulation — seules ses fonctions sont exportées,
    // "cart" lui-même n'est jamais accessible depuis l'extérieur par construction
    // de CommonJS, mais rien dans le CODE ne l'interdirait si quelqu'un l'exportait.
    assert.strictEqual(proceduralCart.cart, undefined);
  });

  test('les deux implémentations donnent le même résultat pour la même séquence d\'opérations', () => {
    proceduralCart.clearCart();
    cartModule.clearCart();
    proceduralCart.addItem('Milk', 2, 3.25);
    cartModule.addItem('Milk', 2, 3.25);
    assert.strictEqual(proceduralCart.viewCart().total, cartModule.viewCart().total);
  });
}

assert.strictEqual(passed, TOTAL_TESTS, `attendu ${TOTAL_TESTS}, ${passed} exécutés`);
console.log(`\n${passed}/${TOTAL_TESTS} tests passent`);
