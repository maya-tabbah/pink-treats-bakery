import { useState } from "react";

export default function App() {
    const [cart, setCart] = useState([]);

    const addToCart = (name, price) => {
        setCart((prev) => {
            const existing = prev.find((item) => item.name === name);
            if (existing) {
                return prev.map((item) =>
                    item.name === name ? { ...item, quantity: item.quantity + 1 } : item
                );
            }
            return [...prev, { name, price, quantity: 1 }];
        });
    };

    const updateQty = (index, delta) => {
        setCart((prev) => {
            const updated = [...prev];
            updated[index].quantity += delta;
            if (updated[index].quantity <= 0) updated.splice(index, 1);
            return updated;
        });
    };

    const clearCart = () => setCart([]);

    const total = cart.reduce((sum, i) => sum + i.price * i.quantity, 0);

    const menu = {
        Cupcakes: [
            { name: "Pink Velvet Cupcake", price: 3.5 },
            { name: "Strawberry Swirl Cupcake", price: 3.0 },
            { name: "Cherry Blossom Cupcake", price: 3.25 },
        ],
        Cakes: [
            { name: "Rose Buttercream Cake", price: 25 },
            { name: "Strawberry Shortcake", price: 22 },
            { name: "Pink Confetti Celebration Cake", price: 28 },
        ],
        Cookies: [
            { name: "Frosted Sugar Cookies", price: 1.5 },
            { name: "Pink Macarons", price: 2 },
            { name: "Raspberry Thumbprint Cookies", price: 1.75 },
        ],
    };

    return (
        <div className="min-h-screen bg-pink-50 text-gray-800 font-serif">
            {/* Header */}
            <header className="bg-pink-300 text-white px-6 py-4 flex justify-between items-center sticky top-0 shadow">
                <h1 className="text-3xl font-bold">Pink Treats Bakery</h1>
                <button
                    className="font-bold text-lg"
                    onClick={() => document.getElementById("cartModal").showModal()}
                >
                    🛒 Cart ({cart.reduce((s, i) => s + i.quantity, 0)})
                </button>
            </header>

            {/* Hero */}
            <div className="relative">
                <img
                    src="pinkbakery.jpeg"
                    className="w-full h-80 object-cover"
                />
                <div className="absolute top-10 left-1/2 -translate-x-1/2 text-4xl text-white font-bold drop-shadow-xl text-center">
                    Homemade Pink Treats Fresh Daily!
                </div>
            </div>

            {/* Menu */}
            <section className="max-w-3xl mx-auto mt-10 p-6 bg-white shadow rounded-xl">
                <h2 className="text-3xl text-pink-500 font-bold text-center mb-6">Menu</h2>

                {Object.entries(menu).map(([category, items]) => (
                    <div key={category} className="mb-6">
                        <h3 className="text-2xl text-pink-400 font-semibold mb-3">{category}</h3>
                        <ul className="space-y-4">
                            {items.map((item) => (
                                <li
                                    key={item.name}
                                    className="flex justify-between items-center border-b pb-2"
                                >
                                    <span>{item.name}</span>
                                    <span className="font-bold text-pink-500">
                    ${item.price.toFixed(2)}
                  </span>
                                    <button
                                        className="bg-pink-400 text-white px-4 py-1 rounded hover:bg-pink-500"
                                        onClick={() => addToCart(item.name, item.price)}
                                    >
                                        Add
                                    </button>
                                </li>
                            ))}
                        </ul>
                    </div>
                ))}
            </section>

            {/* Cart Modal */}
            <dialog id="cartModal" className="rounded-xl p-6 w-96">
                <h2 className="text-2xl text-pink-500 font-bold mb-4 text-center">Cart</h2>

                {cart.length === 0 ? (
                    <p className="text-center text-gray-500 py-10">Your cart is empty</p>
                ) : (
                    <div className="space-y-4 max-h-64 overflow-auto">
                        {cart.map((item, index) => (
                            <div className="flex justify-between items-center" key={index}>
                                <div>
                                    <div className="font-bold">{item.name}</div>
                                    <div className="text-pink-500 text-sm">
                                        ${item.price.toFixed(2)} each
                                    </div>
                                </div>
                                <div className="flex items-center gap-2">
                                    <button
                                        className="bg-pink-300 px-2 rounded"
                                        onClick={() => updateQty(index, -1)}
                                    >
                                        -
                                    </button>
                                    <span>{item.quantity}</span>
                                    <button
                                        className="bg-pink-300 px-2 rounded"
                                        onClick={() => updateQty(index, +1)}
                                    >
                                        +
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                )}

                <div className="text-center mt-4 text-xl font-bold text-pink-500">
                    Total: ${total.toFixed(2)}
                </div>

                <div className="flex justify-center gap-3 mt-4">
                    <button
                        className="bg-gray-200 px-4 py-2 rounded"
                        onClick={clearCart}
                    >
                        Clear
                    </button>
                    <button
                        className="bg-pink-500 text-white px-4 py-2 rounded"
                        onClick={() => {
                            if (cart.length === 0) return;
                            alert(`Thank you! Total: $${total.toFixed(2)}`);
                            clearCart();
                            document.getElementById("cartModal").close();
                        }}
                    >
                        Checkout
                    </button>
                </div>

                <form method="dialog" className="text-center mt-3">
                    <button className="underline">Close</button>
                </form>
            </dialog>
        </div>
    );
}
