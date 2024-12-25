document.addEventListener('DOMContentLoaded', () => {
    const cartKey = 'cartItems';
    const searchBar = document.getElementById('searchBar');
    const searchButton = document.querySelector('.search-btn');
    const items = document.querySelectorAll('#items-container .item');
    const cartContainer = document.getElementById('cart-items');
    const cartTotal = document.querySelector('#cart-total h3');

    // Helper functions for cart data management
    const getCartItems = () => JSON.parse(localStorage.getItem(cartKey)) || [];
    const saveCartItems = (items) => localStorage.setItem(cartKey, JSON.stringify(items));

    // Search functionality
    const handleSearch = () => {
        const query = searchBar.value.toLowerCase();
        items.forEach(item => {
            const name = item.querySelector('h3').textContent.toLowerCase();
            const description = item.querySelector('.img-det').textContent.toLowerCase();
            item.style.display = name.includes(query) || description.includes(query) ? 'block' : 'none';
        });
    };

    // Add item to cart
    const addToCart = (button) => {
        const item = button.closest('.item');
        const name = item.querySelector('h3').textContent;
        const price = item.querySelector('.price').childNodes[0].textContent.trim();
        const image = item.querySelector('img').src;
        const cartItems = getCartItems();

        const existingItem = cartItems.find(cartItem => cartItem.name === name);
        if (existingItem) existingItem.quantity++;
        else cartItems.push({ name, price, image, quantity: 1 });

        saveCartItems(cartItems);
        alert(`${name} has been added to the cart!`);
    };

    // Populate cart with items
    const populateCart = () => {
        const cartItems = getCartItems();
        let totalPrice = 0;

        cartItems.forEach(item => {
            const cartItem = document.createElement('div');
            cartItem.classList.add('cart-item');
            cartItem.innerHTML = `
                <img src="${item.image}" alt="${item.name}" width="200">
                <div>
                    <h3>${item.name}</h3>
                    <p>Price: ${item.price}</p>
                    <p>Quantity: ${item.quantity}</p>
                </div>
                <button class="remove-from-cart">Remove from Cart</button>
            `;
            cartContainer.appendChild(cartItem);
            totalPrice += parseFloat(item.price.replace('$', '')) * item.quantity;
        });
        cartTotal.textContent = `Total Price: $${totalPrice.toFixed(2)}`;
    };

    // Handle removing item from cart
    const handleRemoveFromCart = (button) => {
        const itemName = button.closest('.cart-item').querySelector('h3').textContent;
        const updatedCart = getCartItems().filter(item => item.name !== itemName);
        saveCartItems(updatedCart);
        button.closest('.cart-item').remove();
        location.reload(); // Reload to recalculate total and refresh DOM
    };

    // Event Listeners
    searchButton?.addEventListener('click', handleSearch);

    document.querySelectorAll('.add-to-cart-button').forEach(button =>
        button.addEventListener('click', () => addToCart(button))
    );

    if (cartContainer) {
        populateCart();
        cartContainer.addEventListener('click', event => {
            if (event.target.classList.contains('remove-from-cart')) handleRemoveFromCart(event.target);
        });
    }
});

// Store item data in localStorage
const storeItemData = (name, description, price, imageSrc) => {
    const itemData = { name, description, price, imageSrc };
    localStorage.setItem('selectedItem', JSON.stringify(itemData));
};

// Load item data from localStorage and display it on the page
window.onload = () => {
    const itemData = JSON.parse(localStorage.getItem('selectedItem'));
    if (itemData) {
        document.getElementById('item-name').textContent = itemData.name;
        document.getElementById('item-description').textContent = itemData.description;
        document.getElementById('item-price').textContent = itemData.price;
        document.getElementById('item-image').src = itemData.imageSrc;
    }
};
