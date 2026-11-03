/**
 * Part 2 — Module Pattern (+ Singleton as a side effect of Node's module cache).
 * `items` lives inside the IIFE's closure: nothing outside this file can
 * reach it directly, only through the functions this module chooses to
 * expose. Because the IIFE runs once and `module.exports` is the resulting
 * object, every `require('./cartModule')` call returns the exact same
 * instance — the module is its own Singleton for free.
 */
const CartModule = (function createCartModule() {
  let items = [];

  function addItem(name, quantity, price) {
    items.push({ name, quantity, price });
  }

  function removeItem(name) {
    items = items.filter((item) => item.name !== name);
  }

  function clearCart() {
    items = [];
  }

  function getTotal() {
    return items.reduce((sum, item) => sum + item.quantity * item.price, 0);
  }

  function viewCart() {
    items.forEach((item) => {
      console.log(`${item.name} (x${item.quantity}) - ${(item.quantity * item.price).toFixed(2)} TND`);
    });
    console.log(`Total: ${getTotal().toFixed(2)} TND`);
    return { items: [...items], total: getTotal() };
  }

  return { addItem, removeItem, clearCart, viewCart };
})();

module.exports = CartModule;
