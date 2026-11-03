/**
 * Part 1 — Procedural programming.
 * Cart data lives in a plain module-scoped variable (the closest Node
 * equivalent to a global in a browser script) and every function reaches
 * into it directly — no encapsulation, no namespace.
 */
let cart = [];

function addItem(name, quantity, price) {
  cart.push({ name, quantity, price });
}

function removeItem(name) {
  cart = cart.filter((item) => item.name !== name);
}

function clearCart() {
  cart = [];
}

function getTotal() {
  return cart.reduce((sum, item) => sum + item.quantity * item.price, 0);
}

function viewCart() {
  cart.forEach((item) => {
    console.log(`${item.name} (x${item.quantity}) - ${(item.quantity * item.price).toFixed(2)} TND`);
  });
  console.log(`Total: ${getTotal().toFixed(2)} TND`);
  return { items: [...cart], total: getTotal() };
}

module.exports = { addItem, removeItem, clearCart, viewCart };
