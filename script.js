// Hamburger menu functionality
const hamburger = document.getElementById('hamburger');
const navLinks = document.getElementById('navLinks');

hamburger.addEventListener('click', () => {
    hamburger.classList.toggle('active');
    navLinks.classList.toggle('active');
});

// Close menu when clicking on a link
document.querySelectorAll('.nav-links a').forEach(link => {
    link.addEventListener('click', () => {
        hamburger.classList.remove('active');
        navLinks.classList.remove('active');
    });
});

// Shopping Cart Functionality
let cart = [];

// Get DOM elements
const cartModal = document.getElementById('cartModal');
const cartIcon = document.getElementById('cartIcon');
const closeCart = document.querySelector('.close-cart');
const cartCount = document.getElementById('cartCount');
const cartItems = document.getElementById('cartItems');
const cartTotal = document.getElementById('cartTotal');
const clearCartBtn = document.getElementById('clearCart');
const checkoutBtn = document.querySelector('.checkout-btn');

// Open cart modal
cartIcon.addEventListener('click', (e) => {
    e.preventDefault();
    cartModal.style.display = 'block';
    updateCartDisplay();
});

// Close cart modal
closeCart.addEventListener('click', () => {
    cartModal.style.display = 'none';
});

// Close modal when clicking outside
window.addEventListener('click', (e) => {
    if (e.target === cartModal) {
        cartModal.style.display = 'none';
    }
});

// Add to cart functionality
const addToCartButtons = document.querySelectorAll('.add-to-cart');

addToCartButtons.forEach(button => {
    button.addEventListener('click', () => {
        const name = button.getAttribute('data-name');
        const price = parseFloat(button.getAttribute('data-price'));

        addToCart(name, price);

        // Visual feedback
        button.textContent = 'Added!';
        button.style.background = '#4caf50';

        setTimeout(() => {
            button.textContent = 'Add to Cart';
            button.style.background = '#ff4da6';
        }, 1000);
    });
});

// Add item to cart
function addToCart(name, price) {
    const existingItem = cart.find(item => item.name === name);

    if (existingItem) {
        existingItem.quantity++;
    } else {
        cart.push({
            name: name,
            price: price,
            quantity: 1
        });
    }

    updateCartCount();
    updateCartDisplay();
}

// Update cart count in nav
function updateCartCount() {
    const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
    cartCount.textContent = totalItems;
}

// Update cart display
function updateCartDisplay() {
    if (cart.length === 0) {
        cartItems.innerHTML = '<div class="empty-cart">Your cart is empty</div>';
        cartTotal.textContent = '0.00';
        return;
    }

    cartItems.innerHTML = '';

    cart.forEach((item, index) => {
        const cartItem = document.createElement('div');
        cartItem.className = 'cart-item';

        cartItem.innerHTML = `
            <div class="cart-item-info">
                <div class="cart-item-name">${item.name}</div>
                <div class="cart-item-price">$${item.price.toFixed(2)} each</div>
            </div>
            <div class="cart-item-quantity">
                <button class="qty-btn decrease" data-index="${index}">-</button>
                <span>${item.quantity}</span>
                <button class="qty-btn increase" data-index="${index}">+</button>
            </div>
            <button class="remove-item" data-index="${index}">Remove</button>
        `;

        cartItems.appendChild(cartItem);
    });

    // Add event listeners for quantity buttons
    document.querySelectorAll('.increase').forEach(btn => {
        btn.addEventListener('click', () => {
            const index = parseInt(btn.getAttribute('data-index'));
            cart[index].quantity++;
            updateCartCount();
            updateCartDisplay();
        });
    });

    document.querySelectorAll('.decrease').forEach(btn => {
        btn.addEventListener('click', () => {
            const index = parseInt(btn.getAttribute('data-index'));
            if (cart[index].quantity > 1) {
                cart[index].quantity--;
            } else {
                cart.splice(index, 1);
            }
            updateCartCount();
            updateCartDisplay();
        });
    });

    // Add event listeners for remove buttons
    document.querySelectorAll('.remove-item').forEach(btn => {
        btn.addEventListener('click', () => {
            const index = parseInt(btn.getAttribute('data-index'));
            cart.splice(index, 1);
            updateCartCount();
            updateCartDisplay();
        });
    });

    // Calculate and update total
    const total = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    cartTotal.textContent = total.toFixed(2);
}

// Clear cart
clearCartBtn.addEventListener('click', () => {
    if (confirm('Are you sure you want to clear your cart?')) {
        cart = [];
        updateCartCount();
        updateCartDisplay();
    }
});

// Checkout
checkoutBtn.addEventListener('click', () => {
    if (cart.length === 0) {
        alert('Your cart is empty!');
        return;
    }

    const total = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    alert(`Thank you for your order!\nTotal: $${total.toFixed(2)}\n\nYour delicious treats will be ready soon! 🧁`);

    cart = [];
    updateCartCount();
    updateCartDisplay();
    cartModal.style.display = 'none';
});