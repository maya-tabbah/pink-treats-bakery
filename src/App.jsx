import React, { useState, useEffect } from 'react';
import './App.css';
import logo from './assets/images/Vanilla-Pink-Cupcake.png';
import heroImage from './assets/images/pinkbakery.jpeg';

const API_URL = 'https://pink-treats-bakery.onrender.com/api';

const getSessionId = () => {
    let sessionId = localStorage.getItem('cartSessionId');
    if (!sessionId) {
        sessionId = 'session_' + Math.random().toString(36).substr(2, 9);
        localStorage.setItem('cartSessionId', sessionId);
    }
    return sessionId;
};

function App() {
    const [cart, setCart] = useState([]);
    const [menuData, setMenuData] = useState({});
    const [isCartOpen, setIsCartOpen] = useState(false);
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const [buttonStates, setButtonStates] = useState({});
    const [loading, setLoading] = useState(true);
    const [sessionId] = useState(getSessionId());

    useEffect(() => {
        const loadData = async () => {
            await fetchMenu();
            try {
                const response = await fetch(`${API_URL}/cart/${sessionId}`);
                const data = await response.json();
                setCart(data.items || []);
            } catch (error) {
                console.error('Error fetching cart:', error);
            }
        };
        loadData();
    }, [sessionId]);

    const fetchMenu = async () => {
        try {
            const response = await fetch(`${API_URL}/menu`);
            const data = await response.json();
            setMenuData(data);
            setLoading(false);
        } catch (error) {
            console.error('Error fetching menu:', error);
            setLoading(false);
        }
    };


    const addToCart = async (name, price) => {
        try {
            const response = await fetch(`${API_URL}/cart/${sessionId}/add`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ name, price })
            });
            const data = await response.json();
            setCart(data.items);
            setButtonStates(prev => ({ ...prev, [name]: true }));
            setTimeout(() => setButtonStates(prev => ({ ...prev, [name]: false })), 1000);
        } catch (error) {
            console.error('Error adding to cart:', error);
        }
    };

    const updateQuantity = async (index, delta) => {
        const item = cart[index];
        const newQuantity = item.quantity + delta;
        try {
            const response = await fetch(`${API_URL}/cart/${sessionId}/update`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ name: item.name, quantity: newQuantity })
            });
            const data = await response.json();
            setCart(data.items);
        } catch (error) {
            console.error('Error updating cart:', error);
        }
    };

    const removeItem = async (index) => {
        const item = cart[index];
        try {
            const response = await fetch(`${API_URL}/cart/${sessionId}/remove/${encodeURIComponent(item.name)}`, {
                method: 'DELETE'
            });
            const data = await response.json();
            setCart(data.items || []);
        } catch (error) {
            console.error('Error removing item:', error);
        }
    };

    const clearCart = async () => {
        if (window.confirm('Are you sure you want to clear your cart?')) {
            try {
                await fetch(`${API_URL}/cart/${sessionId}/clear`, { method: 'DELETE' });
                setCart([]);
            } catch (error) {
                console.error('Error clearing cart:', error);
            }
        }
    };

    const checkout = async () => {
        if (cart.length === 0) {
            alert('Your cart is empty!');
            return;
        }
        try {
            const response = await fetch(`${API_URL}/orders`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ items: cart, total: cartTotal, customerName: 'Guest', customerEmail: '' })
            });
            if (response.ok) {
                alert(`Thank you for your order!\nTotal: $${cartTotal.toFixed(2)}\n\nYour delicious treats will be ready soon! 🧁`);
                await fetch(`${API_URL}/cart/${sessionId}/clear`, { method: 'DELETE' });
                setCart([]);
                setIsCartOpen(false);
            }
        } catch (error) {
            console.error('Error placing order:', error);
            alert('Error placing order. Please try again.');
        }
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        alert('Message sent! We will get back to you soon.');
        e.target.reset();
    };

    const cartCount = cart.reduce((sum, item) => sum + item.quantity, 0);
    const cartTotal = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
    const closeMenu = () => setIsMenuOpen(false);

    if (loading) return <div className="loading">Loading...</div>;

    return (
        <>
            <header id="home">
                <div className="logo-container">
                    <img src={logo} alt="Logo" className="logo" />
                    <h1 className="logo-name">Pink Treats Bakery</h1>
                </div>
                <nav>
                    <div className={`hamburger ${isMenuOpen ? 'active' : ''}`} onClick={() => setIsMenuOpen(!isMenuOpen)}>
                        <span></span><span></span><span></span>
                    </div>
                    <ul className={`nav-links ${isMenuOpen ? 'active' : ''}`}>
                        <li><a href="#home" onClick={closeMenu}>Home</a></li>
                        <li><a href="#menu" onClick={closeMenu}>Menu</a></li>
                        <li><a href="#about" onClick={closeMenu}>About</a></li>
                        <li><a href="#contact" onClick={closeMenu}>Contact</a></li>
                        <li><a href="#cart" className="cart-link" onClick={(e) => { e.preventDefault(); setIsCartOpen(true); closeMenu(); }}>🛒 Cart (<span>{cartCount}</span>)</a></li>
                    </ul>
                </nav>
            </header>

            <div className="image-box">
                <img src={heroImage} alt="Cupcake" className="full-width" />
                <div className="image-text">Homemade Pink Treats that are Freshly Baked Every Day!</div>
            </div>

            {isCartOpen && (
                <div className="cart-modal" style={{ display: 'block' }} onClick={(e) => e.target.className.includes('cart-modal') && setIsCartOpen(false)}>
                    <div className="cart-content">
                        <span className="close-cart" onClick={() => setIsCartOpen(false)}>&times;</span>
                        <h2>Your Shopping Cart</h2>
                        <div id="cartItems">
                            {cart.length === 0 ? (
                                <div className="empty-cart">Your cart is empty</div>
                            ) : (
                                cart.map((item, index) => (
                                    <div key={index} className="cart-item">
                                        <div className="cart-item-info">
                                            <div className="cart-item-name">{item.name}</div>
                                            <div className="cart-item-price">${item.price.toFixed(2)} each</div>
                                        </div>
                                        <div className="cart-item-quantity">
                                            <button className="qty-btn" onClick={() => updateQuantity(index, -1)}>-</button>
                                            <span>{item.quantity}</span>
                                            <button className="qty-btn" onClick={() => updateQuantity(index, 1)}>+</button>
                                        </div>
                                        <button className="remove-item" onClick={() => removeItem(index)}>Remove</button>
                                    </div>
                                ))
                            )}
                        </div>
                        <div className="cart-footer">
                            <div className="cart-total"><strong>Total: $<span>{cartTotal.toFixed(2)}</span></strong></div>
                            <div className="cart-actions">
                                <button className="clear-btn" onClick={clearCart}>Clear Cart</button>
                                <button className="checkout-btn" onClick={checkout}>Checkout</button>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            <section className="menu" id="menu">
                <h2 className="menu-title">Menu</h2>
                {Object.entries(menuData).map(([category, items]) => (
                    <React.Fragment key={category}>
                        <h2>{category}</h2>
                        <ul className="menu-items">
                            {items.map((item) => (
                                <li key={item._id || item.name}>
                                    <span className="item-name">{item.name}</span>
                                    <span className="item-price">${item.price.toFixed(2)}</span>
                                    <button className="add-to-cart" style={buttonStates[item.name] ? { background: '#4caf50' } : {}} onClick={() => addToCart(item.name, item.price)}>
                                        {buttonStates[item.name] ? 'Added!' : 'Add to Cart'}
                                    </button>
                                </li>
                            ))}
                        </ul>
                    </React.Fragment>
                ))}
            </section>

            <section className="our-story" id="about">
                <h2>Our Story</h2>
                <p>At Pink Treats Bakery, every cupcake, cookie, and cake is baked with a sprinkle of love and a whole lot of pink. Family-owned and inspired by generations of home baking, we have created a cozy space where sweetness meets tradition. From fluffy pastel pastries to our signature pink velvet cupcakes, everything is made fresh each morning in small batches. Step inside and you will find not just desserts, but a celebration of family, flavor, and fun all wrapped up in a pink.</p>
            </section>

            <section className="contact" id="contact">
                <h2>Contact Us</h2>
                <form onSubmit={handleSubmit}>
                    <input type="text" placeholder="Your Name" required />
                    <input type="email" placeholder="Your Email" required />
                    <textarea placeholder="Your Message" rows="5" required></textarea>
                    <button type="submit">Send Message</button>
                </form>
                <div className="map-container">
                    <iframe src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3021.856284223774!2d-73.9217340845932!3d40.76479887932674!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x89c259a60e83f9d1%3A0x4472997ff7c2f013!2sAstoria%2C%20NY!5e0!3m2!1sen!2sus!4v1706750400000!5m2!1sen!2sus" width="100%" height="300" style={{ border: 0 }} allowFullScreen="" loading="lazy" referrerPolicy="no-referrer-when-downgrade" title="Location Map"></iframe>
                </div>
            </section>

            <footer>
                <p>Follow us for sweet updates!</p>
                <div className="social-icons">
                    <button className="social" onClick={() => {}}>Facebook</button>
                    <button className="social" onClick={() => {}}>Instagram</button>
                    <button className="social" onClick={() => {}}>Pinterest</button>
                </div>
                <p>&copy; 2025 Pink Treats Bakery. All rights reserved.</p>
            </footer>
        </>
    );
}

export default App;