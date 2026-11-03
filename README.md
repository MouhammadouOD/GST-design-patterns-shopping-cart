# Design Patterns — Shopping Cart (Procedural → Module Pattern)

GoMyCode checkpoint — *Design Patterns*.

A shopping cart implemented twice: procedural (Part 1), then refactored with the **Module Pattern** (Part 2), to compare the two approaches directly on the same behavior.

## Project structure

| File | Role |
|---|---|
| `procedural/cart.js` | Part 1 — procedural style: module-scoped `cart` array, plain functions |
| `refactored/cartModule.js` | Part 2 — Module Pattern: `items` lives inside an IIFE closure, only the functions are exposed |
| `tests.js` | 8 tests covering both implementations and what actually differs between them |
| `REFLECTION.md` | 270-word reflection on the refactor (brief's Part 2 deliverable) |

## How to run

```bash
npm test
```

## Résultats

```
8/8 tests passent
```
Exécution réelle vérifiée le 03/11/2026. Deux tests de mutation effectués :
1. En cassant le partage de closure (`addItem` redéclarait `items` en local) → le test "même comportement" échoue bien (total reste à 0 au lieu de 9), confirmant que les tests exercent réellement le mécanisme du Module Pattern et pas juste le fait que Node met les modules en cache.
2. Les autres tests (encapsulation de `items`, comportement identique aux deux implémentations) ont été vérifiés manuellement comme discriminants avant d'être conservés.

## Choix d'implémentation

Pattern retenu : **Module Pattern** via IIFE (closure classique), plutôt que Factory. `items` n'est accessible par aucun nom depuis l'extérieur du fichier — seules les fonctions `addItem`/`removeItem`/`clearCart`/`viewCart` sont exposées. Comme `module.exports` est l'objet déjà construit par l'IIFE, et que Node met les modules en cache, le module se comporte de fait comme un singleton — mais le vrai test de ce checkpoint porte sur le partage de closure entre les méthodes exposées, pas sur le cache de Node (voir `tests.js` et `REFLECTION.md`).
