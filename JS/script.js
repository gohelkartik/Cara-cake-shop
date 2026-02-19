const bar = document.getElementById('bar');
const nav = document.getElementById('navbar');
const closeBtn = document.getElementById('close');

if (bar) {
    bar.addEventListener('click', () => {
        nav.classList.add('active');
    });
}

if (closeBtn) {
    closeBtn.addEventListener('click', () => {
        nav.classList.remove('active');
    });
}

let cart = JSON.parse(localStorage.getItem('cart')) || [];

function saveCart() {
    localStorage.setItem('cart', JSON.stringify(cart));
    updateCartIconCount();
}

function updateCartIconCount() {
    const cartCountElement = document.getElementById('lg-bag-count');
    if (cartCountElement) {
        const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
        if (totalItems > 0) {
            cartCountElement.innerText = totalItems;
            cartCountElement.style.display = 'inline-block';
        } else {
            cartCountElement.style.display = 'none';
        }
    }
}

function addToCart(product) {
    const existingItem = cart.find(item => item.id === product.id && item.size === product.size);
    
    if (existingItem) {
        existingItem.quantity += product.quantity;
    } else {
        cart.push(product);
    }
    
    saveCart();
    alert(`${product.name} added to cart!`);
}


// --- Logic for Multiple Products Page (index.html, shop.html) ---

document.addEventListener('DOMContentLoaded', () => {
    updateCartIconCount();
    
    const productContainers = document.querySelectorAll('.pro-container .pro');

    productContainers.forEach(container => {
        const cartButton = container.querySelector('.add-to-cart-btn');
        if (cartButton) {
            cartButton.addEventListener('click', (e) => {
                e.preventDefault();
                e.stopPropagation();

                const productImg = container.querySelector('img');
                
                const productId = productImg.getAttribute('data-id');
                const productName = productImg.getAttribute('data-name');
                const productPrice = parseFloat(productImg.getAttribute('data-price'));
                const productImgSrc = productImg.src;

                const product = {
                    id: productId,
                    name: productName,
                    price: productPrice,
                    img: productImgSrc,
                    quantity: 1,
                    size: 'N/A' // Default size for quick add
                };

                addToCart(product);
            });
        }
    });
});

// --- Logic for Single Product Page (sproduct.html) ---

document.addEventListener('DOMContentLoaded', () => {
    const sproductButton = document.querySelector('.single-pro-details .add-to-cart-btn');

    if (sproductButton) {
        sproductButton.addEventListener('click', () => {
            const productId = sproductButton.getAttribute('data-id');
            const productName = document.querySelector('.single-pro-details h4').innerText;
            const productPriceText = document.querySelector('.single-pro-details h2').innerText;
            const productPrice = parseFloat(productPriceText.replace('$', ''));
            const productImgSrc = document.getElementById('MainImg').src;
            const quantityInput = document.getElementById('quantity-input');
            const sizeSelect = document.getElementById('size-select');
            
            const quantity = parseInt(quantityInput.value);
            const size = sizeSelect.value;

            if (size === 'Select Size') {
                alert('Please select a size.');
                return;
            }

            if (quantity < 1 || isNaN(quantity)) {
                alert('Please enter a valid quantity.');
                return;
            }

            const product = {
                id: productId,
                name: productName,
                price: productPrice,
                img: productImgSrc,
                quantity: quantity,
                size: size
            };

            addToCart(product);
        });
    }
});


// --- Logic for Cart Page (cart.html) ---

function renderCart() {
    const tableBody = document.getElementById('cart-table-body');
    if (!tableBody) return; // Stop if not on cart page

    tableBody.innerHTML = ''; 

    if (cart.length === 0) {
        tableBody.innerHTML = '<tr><td colspan="6" style="text-align: center; padding: 20px;">Your cart is empty.</td></tr>';
        calculateCartTotals();
        return;
    }

    cart.forEach(item => {
        const newRow = tableBody.insertRow();
        newRow.innerHTML = `
            <td><a href="#" class="remove-item" data-id="${item.id}" data-size="${item.size}"><i class="fa-solid fa-times-circle"></i></a></td>
            <td><img src="${item.img}" alt="${item.name}"></td>
            <td>${item.name} (${item.size})</td>
            <td>$${item.price.toFixed(2)}</td>
            <td><input type="number" value="${item.quantity}" min="1" class="item-quantity" data-id="${item.id}" data-size="${item.size}"></td>
            <td>$${(item.price * item.quantity).toFixed(2)}</td>
        `;
    });

    addCartEventListeners();
    calculateCartTotals();
}

function addCartEventListeners() {
    // Remove item listeners
    document.querySelectorAll('.remove-item').forEach(button => {
        button.addEventListener('click', (e) => {
            e.preventDefault();
            const id = e.currentTarget.getAttribute('data-id');
            const size = e.currentTarget.getAttribute('data-size');
            removeItem(id, size);
        });
    });

    // Quantity change listeners
    document.querySelectorAll('.item-quantity').forEach(input => {
        input.addEventListener('change', (e) => {
            const id = e.target.getAttribute('data-id');
            const size = e.target.getAttribute('data-size');
            let newQuantity = parseInt(e.target.value);

            if (newQuantity < 1 || isNaN(newQuantity)) {
                newQuantity = 1; 
                e.target.value = 1; 
            }
            
            updateQuantity(id, size, newQuantity);
        });
    });
}

function removeItem(id, size) {
    cart = cart.filter(item => !(item.id === id && item.size === size));
    saveCart();
    renderCart();
}

function updateQuantity(id, size, newQuantity) {
    const itemIndex = cart.findIndex(item => item.id === id && item.size === size);
    if (itemIndex > -1) {
        cart[itemIndex].quantity = newQuantity;
        saveCart();
        renderCart(); 
    }
}

function calculateCartTotals() {
    let subtotal = 0;
    const shipping = 50.00; // Fixed shipping for simplicity

    cart.forEach(item => {
        subtotal += item.price * item.quantity;
    });

    const total = subtotal + shipping;

    const subtotalElement = document.getElementById('subtotal-price');
    const totalElement = document.getElementById('total-price');

    if (subtotalElement && totalElement) {
        subtotalElement.innerText = `$${subtotal.toFixed(2)}`;
        totalElement.innerText = `$${total.toFixed(2)}`;
    }
}


// Initialize cart on cart page load
if (document.getElementById('cart-table-body')) {
    document.addEventListener('DOMContentLoaded', renderCart);
}

// Global initialization for cart icon count
document.addEventListener('DOMContentLoaded', updateCartIconCount);