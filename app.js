// Simple PriceBite Application - Working Version
console.log('🚀 PriceBite Simple App Starting...');

// App data
const app = {
    currentPage: 'home',
    selectedCategory: null,
    selectedRestaurant: null,
    excelData: null,
    cart: [],
    foodCategories: [
        { "name": "Pizza", "emoji": "🍕", "id": "pizza" },
        { "name": "Burger", "emoji": "🍔", "id": "burger" },
        { "name": "Taco", "emoji": "🌮", "id": "taco" },
        { "name": "Biryani", "emoji": "🍛", "id": "biryani" },
        { "name": "Shawarma", "emoji": "🥙", "id": "shawarma" },
        { "name": "Momos", "emoji": "🥟", "id": "momos" },
        { "name": "Pasta", "emoji": "🍝", "id": "pasta" },
        { "name": "Sandwich", "emoji": "🥪", "id": "sandwich" },
        { "name": "Noodles", "emoji": "🍜", "id": "noodles" }
    ],
    restaurants: {
        "pizza": [
            { "name": "Domino's", "icon": "🍕", "id": "dominos", "sheetName": "Domino's" },
            { "name": "Pizza Hut", "icon": "🍕", "id": "pizzahut", "sheetName": "Pizza Hut" }
        ],
        "burger": [
            { "name": "McDonald's", "icon": "🍔", "id": "mcdonalds", "sheetName": "McDonald's" },
            { "name": "Burger King", "icon": "🍔", "id": "burgerking", "sheetName": "Burger King" }
        ],
        "taco": [],
        "biryani": [],
        "shawarma": [],
        "momos": [],
        "pasta": [],
        "sandwich": [],
        "noodles": []
    }
};

// Wait for DOM to load
document.addEventListener('DOMContentLoaded', function() {
    console.log('✅ DOM loaded, initializing app...');
    
    // Setup navigation immediately
    setupNavigation();
    
    // Generate food items
    generateFoodItems();
    
    // Setup Excel upload
    setupExcelUpload();
    
    // Load embedded data
    loadEmbeddedData();
    
    console.log('✅ App initialized successfully');
});

function setupNavigation() {
    console.log('🧭 Setting up navigation...');
    
    // Compare Now button
    const compareBtn = document.getElementById('compare-now-btn');
    if (compareBtn) {
        console.log('✅ Compare button found');
        compareBtn.onclick = function() {
            console.log('🔘 Compare Now clicked!');
            showPage('compare');
        };
    } else {
        console.error('❌ Compare button not found');
    }
    
    // Back to Home button
    const backToHomeBtn = document.getElementById('back-to-home');
    if (backToHomeBtn) {
        backToHomeBtn.onclick = function() {
            console.log('🔙 Back to Home clicked');
            showPage('home');
        };
    }
    
    // Back to Categories button
    const backToCategoriesBtn = document.getElementById('back-to-categories');
    if (backToCategoriesBtn) {
        backToCategoriesBtn.onclick = function() {
            console.log('🔙 Back to Categories clicked');
            showPage('compare');
        };
    }
    
    // Logo click
    const logo = document.querySelector('.logo h1');
    if (logo) {
        logo.addEventListener('click', () => {
            console.log('🏠 Logo clicked');
            showPage('home');
        });
        logo.style.cursor = 'pointer';
    }
    
    // Cart button
    const cartBtn = document.querySelector('.cart-btn');
    if (cartBtn) {
        cartBtn.onclick = function() {
            console.log('🛒 Cart button clicked');
            viewCart();
        };
        cartBtn.style.cursor = 'pointer';
        console.log('✅ Cart button setup');
    }
    
    // Cart page navigation
    const backToMenuBtn = document.getElementById('back-to-menu');
    if (backToMenuBtn) {
        backToMenuBtn.onclick = function() {
            console.log('🔙 Back to menu clicked');
            if (app.selectedRestaurant) {
                showPage('restaurants');
            } else {
                showPage('compare');
            }
        };
    }
    
    const continueShoppingBtn = document.getElementById('continue-shopping');
    if (continueShoppingBtn) {
        continueShoppingBtn.onclick = function() {
            console.log('🛍️ Continue shopping clicked');
            showPage('compare');
        };
    }
    
    const clearCartBtn = document.getElementById('clear-cart-btn');
    if (clearCartBtn) {
        clearCartBtn.onclick = function() {
            console.log('🗑️ Clear cart clicked');
            if (confirm('Are you sure you want to clear your cart?')) {
                clearCart();
            }
        };
    }
    
    const checkoutBtn = document.getElementById('checkout-btn');
    if (checkoutBtn) {
        checkoutBtn.onclick = function() {
            console.log('🛒 Checkout clicked');
            alert('Checkout functionality coming soon! 🚀');
        };
    }
}

function showPage(pageName) {
    console.log('📄 Showing page:', pageName);
    
    // Hide all pages
    const pages = document.querySelectorAll('.page');
    pages.forEach(page => {
        page.classList.add('hidden');
    });
    
    // Show selected page
    const targetPage = document.getElementById(pageName + '-page');
    if (targetPage) {
        targetPage.classList.remove('hidden');
        console.log('✅ Page shown:', pageName);
    } else {
        console.error('❌ Page not found:', pageName);
    }
}

function generateFoodItems() {
    console.log('🍕 Generating food items...');
    
    const foodGrid = document.getElementById('food-grid');
    if (!foodGrid) {
        console.error('❌ Food grid not found');
        return;
    }
    
    foodGrid.innerHTML = '';
    
    app.foodCategories.forEach(food => {
        const div = document.createElement('div');
        div.className = 'food-item';
        div.innerHTML = `<span class="food-emoji">${food.emoji}</span><h3 class="food-name">${food.name}</h3>`;
        div.style.cursor = 'pointer';
        
        div.onclick = function() {
            console.log('🍽️ Food category selected:', food.name);
            selectFoodCategory(food.id, food.name);
        };
        
        foodGrid.appendChild(div);
    });
    
    console.log('✅ Food items generated');
}

function selectFoodCategory(categoryId, categoryName) {
    console.log('🍽️ Selecting category:', categoryName);
    
    app.selectedCategory = categoryId;
    
    const restaurantsTitle = document.getElementById('restaurants-title');
    if (restaurantsTitle) {
        restaurantsTitle.textContent = `${categoryName} Restaurants`;
    }
    
    generateRestaurantItems(categoryId);
    showPage('restaurants');
}

function generateRestaurantItems(categoryId) {
    console.log('🏪 Generating restaurant items for:', categoryId);
    
    const restaurantsGrid = document.getElementById('restaurants-grid');
    if (!restaurantsGrid) {
        console.error('❌ Restaurants grid not found');
        return;
    }
    
    restaurantsGrid.innerHTML = '';
    const restaurants = app.restaurants[categoryId] || [];
    
    restaurants.forEach(restaurant => {
        const item = document.createElement('div');
        item.className = 'restaurant-item';
        item.innerHTML = `<span class="restaurant-icon">${restaurant.icon}</span><h3 class="restaurant-name">${restaurant.name}</h3>`;
        item.style.cursor = 'pointer';
        
        item.onclick = function() {
            console.log('🏪 Restaurant selected:', restaurant.name);
            selectRestaurant(restaurant);
        };
        
        restaurantsGrid.appendChild(item);
    });
    
    console.log(`✅ Generated ${restaurants.length} restaurant items`);
}

function selectRestaurant(restaurant) {
    console.log('🏪 Selecting restaurant:', restaurant.name);
    
    app.selectedRestaurant = restaurant;
    
    const restaurantDataSection = document.getElementById('restaurant-data-section');
    const restaurantDataTitle = document.getElementById('restaurant-data-title');
    const excelUploadSection = document.getElementById('excel-upload-section');
    const restaurantTableContainer = document.getElementById('restaurant-table-container');
    
    if (restaurantDataSection) {
        restaurantDataSection.classList.remove('hidden');
    }
    
    if (restaurantDataTitle) {
        restaurantDataTitle.textContent = `${restaurant.name} Menu`;
    }
    
    // Check if we have Excel data
    if (app.excelData) {
        console.log('📊 Available sheets:', Object.keys(app.excelData));
        console.log('🔍 Looking for sheet:', restaurant.sheetName);
        
        // Try to find matching data
        let menuData = null;
        
        // First try exact match
        if (app.excelData[restaurant.sheetName]) {
            menuData = app.excelData[restaurant.sheetName];
        }
        // Try partial match
        else {
            const availableSheets = Object.keys(app.excelData);
            const matchingSheet = availableSheets.find(sheet => 
                sheet.toLowerCase().includes(restaurant.name.toLowerCase()) ||
                restaurant.name.toLowerCase().includes(sheet.toLowerCase())
            );
            
            if (matchingSheet) {
                console.log(`✅ Found matching sheet: ${matchingSheet} for ${restaurant.name}`);
                menuData = app.excelData[matchingSheet];
            }
        }
        
        if (menuData && menuData.length > 0) {
            console.log('📊 Excel data found for:', restaurant.name, '- Items:', menuData.length);
            if (excelUploadSection) excelUploadSection.style.display = 'none';
            renderRestaurantMenu(menuData);
        } else {
            console.log('❌ No matching data found for:', restaurant.name);
            if (excelUploadSection) excelUploadSection.style.display = 'block';
            if (restaurantTableContainer) {
                restaurantTableContainer.innerHTML = `
                    <div style="padding: 20px; text-align: center; color: #666;">
                        <p>No menu data found for ${restaurant.name}</p>
                        <p>Available sheets: ${Object.keys(app.excelData).join(', ')}</p>
                        <button onclick="document.getElementById('excel-file-input').click()" 
                                style="padding: 10px 20px; background: #e74c3c; color: white; border: none; border-radius: 5px; cursor: pointer; margin: 10px;">
                            📁 Re-upload Excel File
                        </button>
                        <button onclick="console.log('Debug - App data:', app.excelData)" 
                                style="padding: 10px 20px; background: #007bff; color: white; border: none; border-radius: 5px; cursor: pointer; margin: 10px;">
                            🔍 Debug Data
                        </button>
                    </div>
                `;
            }
        }
    } else {
        console.log('📁 No Excel data, showing upload section');
        if (excelUploadSection) excelUploadSection.style.display = 'block';
        if (restaurantTableContainer) {
            restaurantTableContainer.innerHTML = `
                <div style="padding: 20px; text-align: center; color: #666;">
                    <p>Please upload restaurants.xlsx to view ${restaurant.name} menu with price comparison</p>
                </div>
            `;
        }
    }
}

function setupExcelUpload() {
    console.log('📁 Setting up Excel upload...');
    
    const fileInput = document.getElementById('excel-file-input');
    if (!fileInput) {
        console.error('❌ File input not found');
        return;
    }
    
    fileInput.onchange = function(event) {
        const file = event.target.files[0];
        if (!file) return;
        
        console.log('📁 File selected:', file.name);
        
        const reader = new FileReader();
        reader.onload = function(e) {
            try {
                processExcelFile(e.target.result);
                
                // Show success message
                const workbook = XLSX.read(e.target.result, { type: 'array' });
                showSuccessMessage(`Excel file loaded successfully! Found ${workbook.SheetNames.length} sheets.`);
                
                // If a restaurant is selected, reload its data
                if (app.selectedRestaurant) {
                    selectRestaurant(app.selectedRestaurant);
                }
                
            } catch (error) {
                console.error('❌ Excel processing failed:', error);
                showErrorMessage('Error processing Excel file: ' + error.message);
            }
        };
        
        reader.readAsArrayBuffer(file);
    };
    
    console.log('✅ Excel upload setup complete');
}

function renderRestaurantMenu(menuData) {
    console.log('📊 Rendering menu with', menuData.length, 'items');
    
    const container = document.getElementById('restaurant-table-container');
    if (!container) return;
    
    if (!menuData || menuData.length === 0) {
        container.innerHTML = '<p>No menu data available.</p>';
        return;
    }
    
    let html = '<div class="table-container"><table class="menu-table"><thead><tr>';
    html += '<th>Item Name</th>';
    html += '<th>Category</th>';
    html += '<th class="price-header">Price on Swiggy</th>';
    html += '<th class="price-header">Price on Zomato</th>';
    html += '<th class="price-header">Price on Own App</th>';
    html += '<th class="cart-header">Add to Cart</th>';
    html += '</tr></thead><tbody>';
    
    menuData.forEach((item, index) => {
        html += '<tr>';
        html += `<td>${item.ItemName || ''}</td>`;
        html += `<td>${item.Category || ''}</td>`;
        html += `<td class="price-cell price-swiggy">${item.Swiggy ? '₹' + item.Swiggy : '-'}</td>`;
        html += `<td class="price-cell price-zomato">${item.Zomato ? '₹' + item.Zomato : '-'}</td>`;
        html += `<td class="price-cell price-own-app">${item.Own_App ? '₹' + item.Own_App : '-'}</td>`;
        html += `<td class="cart-cell">
            <button class="add-to-cart-btn" onclick="addToCart('${item.ItemName}', '${item.Category}', ${item.Swiggy || 0}, ${item.Zomato || 0}, ${item.Own_App || 0})" 
                    style="background: #e74c3c; color: white; border: none; padding: 8px 12px; border-radius: 4px; cursor: pointer; font-size: 12px;">
                🛒 Add to Cart
            </button>
        </td>`;
        html += '</tr>';
    });
    
    html += '</tbody></table></div>';
    container.innerHTML = html;
    
    console.log('✅ Menu rendered successfully');
}

function showSuccessMessage(message) {
    const container = document.getElementById('restaurant-table-container');
    if (container) {
        const msgDiv = document.createElement('div');
        msgDiv.className = 'success-message';
        msgDiv.textContent = message;
        container.insertAdjacentElement('beforebegin', msgDiv);
        
        setTimeout(() => {
            if (msgDiv.parentNode) {
                msgDiv.parentNode.removeChild(msgDiv);
            }
        }, 3000);
    }
}

function showErrorMessage(message) {
    const container = document.getElementById('restaurant-table-container');
    if (container) {
        const msgDiv = document.createElement('div');
        msgDiv.className = 'error-message';
        msgDiv.textContent = message;
        container.insertAdjacentElement('beforebegin', msgDiv);
        
        setTimeout(() => {
            if (msgDiv.parentNode) {
                msgDiv.parentNode.removeChild(msgDiv);
            }
        }, 5000);
    }
}

function loadEmbeddedData() {
    console.log('📊 Loading embedded restaurant data...');
    
    if (typeof EMBEDDED_RESTAURANT_DATA !== 'undefined') {
        app.excelData = EMBEDDED_RESTAURANT_DATA;
        console.log('✅ Embedded data loaded successfully!');
        console.log('📊 Available restaurants:', Object.keys(app.excelData));
        
        Object.entries(app.excelData).forEach(([restaurant, items]) => {
            console.log(`   ${restaurant}: ${items.length} items`);
        });
    } else {
        console.error('❌ Embedded data not found');
    }
}

function autoLoadExcelFile() {
    console.log('🔄 Auto-loading restaurants.xlsx...');
    
    fetch('./restaurants.xlsx')
        .then(response => {
            if (!response.ok) {
                throw new Error('File not found');
            }
            return response.arrayBuffer();
        })
        .then(arrayBuffer => {
            console.log('✅ Excel file fetched successfully');
            processExcelFile(arrayBuffer);
        })
        .catch(error => {
            console.log('❌ Auto-load failed:', error.message);
            console.log('File will need to be uploaded manually');
        });
}

function processExcelFile(arrayBuffer) {
    try {
        console.log('📊 Processing Excel file...');
        const workbook = XLSX.read(arrayBuffer, { type: 'array' });
        
        app.excelData = {};
        
        workbook.SheetNames.forEach(sheetName => {
            const worksheet = workbook.Sheets[sheetName];
            const data = XLSX.utils.sheet_to_json(worksheet, { defval: '' });
            
            // Process data
            const processedData = data.map(row => {
                const processedRow = {};
                
                Object.keys(row).forEach(key => {
                    const lowerKey = key.toLowerCase().trim();
                    
                    if (lowerKey === 'name') {
                        processedRow.ItemName = row[key];
                    } else if (lowerKey === 'item type' || lowerKey === 'type' || lowerKey === 'item_type') {
                        processedRow.Category = row[key];
                    } else if (lowerKey.includes('swiggy')) {
                        processedRow.Swiggy = parseFloat(row[key]) || null;
                    } else if (lowerKey.includes('zomato')) {
                        processedRow.Zomato = parseFloat(row[key]) || null;
                    } else if (lowerKey.includes('mcdelivery') || lowerKey.includes('domino') || 
                              lowerKey.includes('pizzahut') || lowerKey.includes('burger') ||
                              lowerKey.includes('app') || lowerKey.includes('own')) {
                        processedRow.Own_App = parseFloat(row[key]) || null;
                    }
                });
                
                return processedRow;
            }).filter(row => row.ItemName);
            
            app.excelData[sheetName] = processedData;
            console.log(`✅ Processed ${processedData.length} items for ${sheetName}`);
        });
        
        console.log('🎉 Excel data loaded automatically!');
        console.log('📊 Available sheets:', Object.keys(app.excelData));
        
    } catch (error) {
        console.error('❌ Excel processing failed:', error);
    }
}

// Cart functionality
function addToCart(itemName, category, swiggyPrice, zomatoPrice, ownAppPrice) {
    console.log('🛒 Adding to cart:', itemName);
    
    const cartItem = {
        id: Date.now() + Math.random(), // Unique ID
        name: itemName,
        category: category,
        restaurant: app.selectedRestaurant ? app.selectedRestaurant.name : 'Unknown',
        prices: {
            swiggy: swiggyPrice,
            zomato: zomatoPrice,
            ownApp: ownAppPrice
        },
        quantity: 1,
        addedAt: new Date()
    };
    
    // Check if item already exists in cart
    const existingItem = app.cart.find(item => 
        item.name === itemName && item.restaurant === cartItem.restaurant
    );
    
    if (existingItem) {
        existingItem.quantity += 1;
        showSuccessMessage(`${itemName} quantity updated in cart (${existingItem.quantity})`);
    } else {
        app.cart.push(cartItem);
        showSuccessMessage(`${itemName} added to cart!`);
    }
    
    updateCartCounter();
    console.log('🛒 Cart updated:', app.cart.length, 'items');
}

function updateCartCounter() {
    const cartBtn = document.querySelector('.cart-btn');
    if (cartBtn) {
        const totalItems = app.cart.reduce((sum, item) => sum + item.quantity, 0);
        cartBtn.textContent = `🛒 Cart (${totalItems})`;
    }
}

function viewCart() {
    console.log('🛒 Viewing cart');
    showPage('cart');
    renderCartPage();
}

function renderCartPage() {
    const cartItemsContainer = document.getElementById('cart-items-container');
    const cartSummary = document.getElementById('cart-summary');
    const emptyCart = document.getElementById('empty-cart');
    
    if (app.cart.length === 0) {
        // Show empty cart
        cartItemsContainer.innerHTML = '';
        cartSummary.classList.add('hidden');
        emptyCart.classList.remove('hidden');
        return;
    }
    
    // Hide empty cart, show summary
    emptyCart.classList.add('hidden');
    cartSummary.classList.remove('hidden');
    
    // Render cart items
    let cartHTML = '';
    let totalSwiggy = 0, totalZomato = 0, totalOwnApp = 0, totalItems = 0;
    
    app.cart.forEach((item, index) => {
        totalItems += item.quantity;
        totalSwiggy += (item.prices.swiggy || 0) * item.quantity;
        totalZomato += (item.prices.zomato || 0) * item.quantity;
        totalOwnApp += (item.prices.ownApp || 0) * item.quantity;
        
        cartHTML += `
            <div class="cart-item">
                <div class="cart-item-header">
                    <div>
                        <h3 class="cart-item-name">${item.name}</h3>
                        <p class="cart-item-restaurant">📍 ${item.restaurant}</p>
                        <span class="cart-item-category">${item.category}</span>
                    </div>
                </div>
                
                <div class="cart-item-details">
                    <div class="price-option price-swiggy">
                        <strong>Swiggy</strong><br>
                        ₹${item.prices.swiggy || 0}
                    </div>
                    <div class="price-option price-zomato">
                        <strong>Zomato</strong><br>
                        ₹${item.prices.zomato || 0}
                    </div>
                    <div class="price-option price-own-app">
                        <strong>Own App</strong><br>
                        ₹${item.prices.ownApp || 0}
                    </div>
                    
                    <div class="quantity-controls">
                        <button class="quantity-btn" onclick="updateQuantity(${index}, -1)">-</button>
                        <span class="quantity-display">${item.quantity}</span>
                        <button class="quantity-btn" onclick="updateQuantity(${index}, 1)">+</button>
                        <button class="remove-item-btn" onclick="removeFromCart(${index})">🗑️ Remove</button>
                    </div>
                </div>
            </div>
        `;
    });
    
    cartItemsContainer.innerHTML = cartHTML;
    
    // Update summary
    document.getElementById('total-items').textContent = totalItems;
    document.getElementById('total-swiggy').textContent = `₹${totalSwiggy}`;
    document.getElementById('total-zomato').textContent = `₹${totalZomato}`;
    document.getElementById('total-own-app').textContent = `₹${totalOwnApp}`;
}

function updateQuantity(index, change) {
    if (app.cart[index]) {
        app.cart[index].quantity += change;
        
        if (app.cart[index].quantity <= 0) {
            app.cart.splice(index, 1);
        }
        
        updateCartCounter();
        renderCartPage();
        console.log('🛒 Quantity updated');
    }
}

function removeFromCart(index) {
    if (app.cart[index]) {
        const itemName = app.cart[index].name;
        app.cart.splice(index, 1);
        updateCartCounter();
        renderCartPage();
        showSuccessMessage(`${itemName} removed from cart`);
        console.log('🛒 Item removed from cart');
    }
}

function clearCart() {
    app.cart = [];
    updateCartCounter();
    renderCartPage();
    showSuccessMessage('Cart cleared');
    console.log('🛒 Cart cleared');
}

console.log('📱 PriceBite Simple App Loaded!');
