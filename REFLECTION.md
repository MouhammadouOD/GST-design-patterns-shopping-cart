# Reflection Report

I built the shopping cart twice: once as plain procedural code with a module-scoped `cart` array and a handful of functions touching it directly, then again using the Module Pattern, where the array lives inside a closure and only `addItem`, `removeItem`, `clearCart` and `viewCart` are exposed.

The main challenge in the refactor was not the logic itself — `addItem`, `removeItem` and the total calculation stayed basically identical. The real work was making sure every function that needed to touch the cart was defined *inside* the same closure, closing over the same `items` variable. I actually caught a mistake here while writing a mutation test: I temporarily made `addItem` declare its own local `items` array by accident, and the total silently stayed at 0 instead of throwing an error. That is the real risk with the Module Pattern — it fails quietly if you break the closure, not loudly.

The pattern improved the code in one concrete way: in the procedural version, nothing stops another file from reaching in and resetting `cart = []` directly if it ever got exported by mistake. In the Module version, `items` is structurally impossible to reach from outside — there is no name to import, only the functions. I proved that with a test asserting `cartModule.items` is `undefined`.

I would reach for a pattern like this over plain procedural code as soon as a module's internal state needs a real guarantee — for example, one shared cart for a whole checkout flow, not five. For a small script, quick CLI tool, or anything no reused twice, procedural code is still fine and faster to write.
