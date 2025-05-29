/**
 * OceanAid360 Cart Functionality
 * JavaScript file for handling shopping cart interactions
 */

document.addEventListener('DOMContentLoaded', function() {
    // Initialize cart functionality if on a page with products
    if (document.querySelector('.merchandise-item')) {
        initCartFunctionality();
    }

    // Load and display cart count from localStorage on all pages
    updateCartCountDisplay();
});

/**
 * Initializes all cart-related functionality
 */
function initCartFunctionality() {
    // Product color selectors functionality
    initColorSelectors();
    
    // Cart popup interaction
    initCartPopup();
    
    // Add to cart button handling
    initAddToCartButtons();
    
    // Quantity controls
    initQuantityControls();
    
    // Remove item functionality
    initRemoveItemButton();
}

/**
 * Initialize the cart popup functionality
 */
function initCartPopup() {
    const cartPopup = document.getElementById('cart-popup');
    const closePopupBtn = document.querySelector('.close-popup');
    
    if (cartPopup && closePopupBtn) {
        // Close popup when the close button is clicked
        closePopupBtn.addEventListener('click', function() {
            cartPopup.classList.remove('active');
        });
        
        // Close popup when clicking outside of it
        document.addEventListener('click', function(e) {
            if (cartPopup.classList.contains('active') && 
                !e.target.closest('.cart-popup-content') && 
                !e.target.closest('.add-to-cart-btn')) {
                cartPopup.classList.remove('active');
            }
        });
        
        // Close popup when ESC key is pressed
        document.addEventListener('keydown', function(e) {
            if (e.key === 'Escape' && cartPopup.classList.contains('active')) {
                cartPopup.classList.remove('active');
            }
        });
    }
}

/**
 * Initialize the color selectors for products
 */
function initColorSelectors() {
    const tshirtColorSelect = document.getElementById('gtr-shirt-color');
    const tankColorSelect = document.getElementById('gtr-tank-color');
    
    if (tshirtColorSelect) {
        tshirtColorSelect.addEventListener('change', function() {
            const selectedColor = this.value;
            const tshirtImages = this.closest('.merchandise-item').querySelector('.product-images');
            const mainImage = tshirtImages.querySelector('.product-image');
            const altImage = tshirtImages.querySelector('.product-image-alt');
            
            if (selectedColor === 'blue-steel') {
                mainImage.src = 'images/gtr-tshirt-blue.jpg';
                mainImage.alt = 'The GTR T-Shirt in Blue Steel';
            } else if (selectedColor === 'army-green') {
                mainImage.src = 'images/gtr-tshirt-green.jpg';
                mainImage.alt = 'The GTR T-Shirt in Army Green';
                altImage.src = 'images/gtr-tshirt-blue.jpg';
                altImage.alt = 'The GTR T-Shirt in Blue Steel';
            }
        });
    }
    
    if (tankColorSelect) {
        tankColorSelect.addEventListener('change', function() {
            const selectedColor = this.value;
            const tankImages = this.closest('.merchandise-item').querySelector('.product-images');
            const mainImage = tankImages.querySelector('.product-image');
            const altImage = tankImages.querySelector('.product-image-alt');
            
            if (selectedColor === 'merlot') {
                mainImage.src = 'images/gtr-tank-merlot.jpg';
                mainImage.alt = 'The GTR Tank Top in Merlot';
            } else if (selectedColor === 'seafoam') {
                mainImage.src = 'images/gtr-tank-seafoam.jpg';
                mainImage.alt = 'The GTR Tank Top in Seafoam';
                altImage.src = 'images/gtr-tank-merlot.jpg';
                altImage.alt = 'The GTR Tank Top in Merlot';
            }
        });
    }
}

/**
 * Initialize the "Add to Cart" buttons functionality
 */
function initAddToCartButtons() {
    const addToCartButtons = document.querySelectorAll('.add-to-cart-btn');
    const cartPopup = document.getElementById('cart-popup');
    
    if (!addToCartButtons.length || !cartPopup) return;
    
    // Visual feedback elements
    const cartItemName = document.getElementById('cart-item-name');
    const cartItemPrice = document.getElementById('cart-item-price');
    const cartItemSize = document.getElementById('cart-item-size').querySelector('span');
    const cartItemImage = document.getElementById('cart-item-image');
    
    // Default values
    let itemPrice = 25.00;
    let quantity = 1;
    
    addToCartButtons.forEach(button => {
        button.addEventListener('click', function() {
            const productType = this.dataset.product;
            const productContainer = this.closest('.merchandise-item');
            const productName = productContainer.querySelector('h3').textContent;
            const sizeSelect = productContainer.querySelector('[id$="-size"]');
            const colorSelect = productContainer.querySelector('[id$="-color"]');
            
            // Validate size selection
            if (!sizeSelect.value) {
                alert('Please select a size.');
                return;
            }
            
            // Validate color selection
            if (!colorSelect.value) {
                alert('Please select a color.');
                return;
            }
            
            // Reset quantity to 1 for new additions
            quantity = 1;
            const quantityInput = document.querySelector('.quantity-input');
            if (quantityInput) {
                quantityInput.value = quantity;
            }
            
            // Update cart popup content
            if (cartItemName) cartItemName.textContent = productName;
            if (cartItemPrice) cartItemPrice.textContent = `$${itemPrice.toFixed(2)}`;
            if (cartItemSize) cartItemSize.textContent = sizeSelect.options[sizeSelect.selectedIndex].text;
            
            // Set product image based on selection
            if (cartItemImage) {
                if (productType === 'tshirt') {
                    if (colorSelect.value === 'blue-steel') {
                        cartItemImage.src = 'images/gtr-tshirt-blue.jpg';
                    } else {
                        cartItemImage.src = 'images/gtr-tshirt-green.jpg';
                    }
                } else if (productType === 'tanktop') {
                    if (colorSelect.value === 'merlot') {
                        cartItemImage.src = 'images/gtr-tank-merlot.jpg';
                    } else {
                        cartItemImage.src = 'images/gtr-tank-seafoam.jpg';
                    }
                }
            }
            
            // Update subtotals
            updateSubtotals(itemPrice, quantity);
            
            // Store cart data in localStorage
            const cartItem = {
                name: productName,
                price: itemPrice,
                size: sizeSelect.options[sizeSelect.selectedIndex].text,
                color: colorSelect.options[colorSelect.selectedIndex].text,
                quantity: quantity,
                image: cartItemImage ? cartItemImage.src : '',
                productType: productType
            };
            storeCartData(cartItem);
            
            // Update cart count display
            updateCartCountDisplay();
            
            // Show cart popup
            cartPopup.classList.add('active');
        });
    });
}

/**
 * Initialize quantity controls in the cart popup
 */
function initQuantityControls() {
    const plusBtn = document.querySelector('.plus');
    const minusBtn = document.querySelector('.minus');
    const quantityInput = document.querySelector('.quantity-input');
    
    if (!plusBtn || !minusBtn || !quantityInput) return;
    
    let quantity = parseInt(quantityInput.value) || 1;
    const itemPrice = 25.00; // Default price
    
    plusBtn.addEventListener('click', function() {
        quantity++;
        quantityInput.value = quantity;
        updateSubtotals(itemPrice, quantity);
        updateCartItemQuantity(quantity);
    });
    
    minusBtn.addEventListener('click', function() {
        if (quantity > 1) {
            quantity--;
            quantityInput.value = quantity;
            updateSubtotals(itemPrice, quantity);
            updateCartItemQuantity(quantity);
        }
    });
}

/**
 * Initialize the remove item button functionality
 */
function initRemoveItemButton() {
    const removeItemBtn = document.querySelector('.remove-item');
    const cartPopup = document.getElementById('cart-popup');
    
    if (!removeItemBtn || !cartPopup) return;
    
    removeItemBtn.addEventListener('click', function() {
        // Clear item from localStorage
        localStorage.removeItem('cartItems');
        
        // Reset quantity
        const quantityInput = document.querySelector('.quantity-input');
        if (quantityInput) {
            quantityInput.value = 1;
        }
        
        // Update subtotals to zero
        updateSubtotals(0, 0);
        
        // Update cart count display
        updateCartCountDisplay();
        
        // Close popup after short delay
        setTimeout(() => {
            cartPopup.classList.remove('active');
        }, 500);
    });
}

/**
 * Update cart item quantity in localStorage
 */
function updateCartItemQuantity(newQuantity) {
    if (localStorage.getItem('cartItems')) {
        const cartItems = JSON.parse(localStorage.getItem('cartItems'));
        if (cartItems.length > 0) {
            cartItems[cartItems.length - 1].quantity = newQuantity;
            localStorage.setItem('cartItems', JSON.stringify(cartItems));
        }
    }
}

/**
 * Update cart subtotals in the cart popup
 */
function updateSubtotals(price, quantity) {
    const cartItemSubtotal = document.getElementById('cart-item-subtotal');
    const cartSubtotal = document.getElementById('cart-subtotal');
    
    if (cartItemSubtotal && cartSubtotal) {
        const subtotal = price * quantity;
        cartItemSubtotal.textContent = `$${subtotal.toFixed(2)}`;
        cartSubtotal.textContent = `$${subtotal.toFixed(2)}`;
    }
}

/**
 * Store cart data in localStorage
 */
function storeCartData(item) {
    let cartItems = [];
    
    // Check if there are existing items
    if (localStorage.getItem('cartItems')) {
        cartItems = JSON.parse(localStorage.getItem('cartItems'));
        
        // Check if item already exists, update quantity if so
        const existingItemIndex = cartItems.findIndex(cartItem => 
            cartItem.name === item.name && 
            cartItem.size === item.size && 
            cartItem.color === item.color
        );
        
        if (existingItemIndex !== -1) {
            cartItems[existingItemIndex].quantity = item.quantity;
        } else {
            cartItems.push(item);
        }
    } else {
        cartItems.push(item);
    }
    
    localStorage.setItem('cartItems', JSON.stringify(cartItems));
}

/**
 * Update cart count display across the site
 */
function updateCartCountDisplay() {
    const cartCountElements = document.querySelectorAll('.cart-count');
    const cartItemCountDisplay = document.getElementById('cart-count');
    
    let cartCount = 0;
    
    // Calculate total items in cart
    if (localStorage.getItem('cartItems')) {
        const cartItems = JSON.parse(localStorage.getItem('cartItems'));
        cartCount = cartItems.reduce((total, item) => total + item.quantity, 0);
    }
    
    // Update all cart count displays
    cartCountElements.forEach(element => {
        element.textContent = cartCount;
    });
    
    // Update the count in the popup header if it exists
    if (cartItemCountDisplay) {
        cartItemCountDisplay.textContent = `(${cartCount} item${cartCount !== 1 ? 's' : ''})`;
    }
}
