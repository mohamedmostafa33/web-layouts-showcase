// Function to add items to cart in local storage
function addToCart(item) {
    let cart = JSON.parse(localStorage.getItem("cart")) || [];

    // Check if item already exists in cart
    let existingItem = cart.find(cartItem => cartItem.name === item.name);
    if (existingItem) {
        existingItem.quantity += 1;  // Increase quantity if item is already in the cart
    } else {
        cart.push(item);  // Otherwise, add a new item
    }

    localStorage.setItem("cart", JSON.stringify(cart));  // Save the updated cart
}

// Example: Add item to cart when a button is clicked
function setupCartButtons() {
    document.querySelectorAll(".add-to-cart-button").forEach(button => {
        button.addEventListener("click", function(event) {
            event.preventDefault();

            // Retrieve item details from the button's parent elements
            let item = {
                name: this.closest('.img-details').querySelector('h3').innerText,
                price: parseFloat(this.closest('.img-details').querySelector('p').innerText.split(": $")[1]),
                quantity: 1,
            };

            // Add the item to cart
            addToCart(item);

            alert(item.name + " added to cart!");
        });
    });
}

// Function to update the cart display
function updateCart() {
    let cart = JSON.parse(localStorage.getItem("cart")) || [];
    const cartContainer = document.getElementById("cart-items");
    const cartTotal = document.getElementById("cart-total");

    // Clear existing cart items
    cartContainer.innerHTML = '';

    // Add items dynamically
    let total = 0;
    cart.forEach(item => {
        let cartItem = document.createElement("div");
        cartItem.classList.add("cart-item");
        cartItem.innerHTML = `
            <img src="static/media/${item.name.replace(/\s+/g, '-').toLowerCase()}.jpg" alt="${item.name}" width="200">
            <div>
                <h3>${item.name}</h3>
                <p>Price: $${item.price.toFixed(2)}</p>
                <p>Quantity: ${item.quantity}</p>
            </div>
            <button onclick="removeFromCart('${item.name}')">Remove from Cart</button>
        `;
        cartContainer.appendChild(cartItem);
        total += item.price * item.quantity;
    });

    // Update the total price
    cartTotal.innerHTML = `<h3>Total Price: $${total.toFixed(2)}</h3>`;
}

// Function to remove an item from cart
function removeFromCart(itemName) {
    let cart = JSON.parse(localStorage.getItem("cart")) || [];
    cart = cart.filter(item => item.name !== itemName);  // Remove item by name
    localStorage.setItem("cart", JSON.stringify(cart));  // Save the updated cart
    updateCart();  // Re-render the cart
}

// Combined initialization on page load
window.onload = function() {
    setupCartButtons(); // Setup cart buttons
    updateCart();       // Populate the cart on page load
};
