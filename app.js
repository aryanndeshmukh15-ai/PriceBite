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
        { "name": "Fried Rice", "emoji": "🍚", "id": "friedrice" },
        { "name": "Chicken", "emoji": "🍗", "id": "chicken" },
        { "name": "Taco", "emoji": "🌮", "id": "taco" },
        { "name": "Biryani", "emoji": "🍛", "id": "biryani" },
        { "name": "Shawarma", "emoji": "🥙", "id": "shawarma" },
        { "name": "Momos", "emoji": "🥟", "id": "momos" },
        { "name": "Pasta", "emoji": "🍝", "id": "pasta" }
    ],
    restaurants: {
        "pizza": [
            { "name": "Domino's", "icon": "dominos_logo.png", "id": "dominos", "sheetName": "Domino's", "isImage": true },
            { "name": "Pizza Hut", "icon": "pizzahut_logo.png", "id": "pizzahut", "sheetName": "Pizza Hut", "isImage": true }
        ],
        "burger": [
            { "name": "McDonald's", "icon": "mcdonalds_logo.png", "id": "mcdonalds", "sheetName": "McDonald's", "isImage": true },
            { "name": "Burger King", "icon": "burgerking_logo.png", "id": "burgerking", "sheetName": "Burger King", "isImage": true }
        ],
        "chicken": [
            { "name": "KFC", "icon": "kfc_logo.png", "id": "kfc", "sheetName": "KFC", "isImage": true }
        ],
        "taco": [
            { "name": "Taco Bell", "icon": "tacobell_logo.png", "id": "tacobell", "sheetName": "Taco Bell", "isImage": true }
        ],
        "biryani": [
            { "name": "Behrouz Biryani", "icon": "behrouz_logo.png", "id": "behrouz", "sheetName": "Behrouz Biryani", "isImage": true }
        ],
        "shawarma": [
            { "name": "Shawarma Zone", "icon": "shawarma_logo.jpg", "id": "shawarmazone", "sheetName": "Shawarma Zone", "isImage": true }
        ],
        "momos": [
            { "name": "Wow! Momo", "icon": "wowmomo_logo.jpg", "id": "wowmomo", "sheetName": "Wow! Momo", "isImage": true }
        ],
        "pasta": [],
        "friedrice": [
            { "name": "Golden Wok Restaurant", "icon": "golden wok image.webp", "id": "goldenwok", "sheetName": "Golden Wok", "isImage": true },
            { "name": "Koliwada", "icon": "Koliwada-Chicken-1024x665.jpg", "id": "koliwada", "sheetName": "Koliwada", "isImage": true }
        ]
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
    
    // Setup search functionality
    setupSearch();
    
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
            
            const checkoutUrl = checkoutBtn.getAttribute('data-checkout-url');
            const platform = checkoutBtn.getAttribute('data-platform');
            
            if (checkoutUrl && checkoutUrl !== '#') {
                const itemsList = app.cart.map(item => `${item.quantity}x ${item.name}`).join(', ');
                const confirmMessage = `You will be redirected to ${platform} to complete your order.\n\nItems in your cart: ${itemsList}\n\nNote: You'll need to manually add these items on ${platform} as we cannot automatically transfer your cart.\n\nContinue?`;
                
                if (confirm(confirmMessage)) {
                    console.log(`🔗 Redirecting to ${platform}: ${checkoutUrl}`);
                    
                    // Create a summary popup before redirect
                    showCartSummaryBeforeRedirect(platform);
                    
                    // Redirect after a short delay
                    setTimeout(() => {
                        window.open(checkoutUrl, '_blank');
                    }, 2000);
                }
            } else {
                alert('Please add items to cart to checkout! 🛒');
            }
        };
    }
}

function showPage(pageName) {
    console.log('📄 Showing page:', pageName);

    // Clear restaurant menu if leaving restaurant-related pages
    if (pageName !== 'restaurants' && app.selectedRestaurant) {
        console.log('🧹 Clearing restaurant menu as user is navigating away');
        clearRestaurantMenu();
    }

    // Hide restaurant data section for non-restaurant pages
    if (pageName !== 'restaurants') {
        const restaurantDataSection = document.getElementById('restaurant-data-section');
        if (restaurantDataSection) {
            restaurantDataSection.classList.add('hidden');
        }
    }

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

    // Clear any existing restaurant menu when switching categories
    if (app.selectedRestaurant) {
        console.log('🧹 Clearing previous restaurant menu when switching categories');
        clearRestaurantMenu();
    }

    // Hide restaurant data section when switching categories
    const restaurantDataSection = document.getElementById('restaurant-data-section');
    if (restaurantDataSection) {
        restaurantDataSection.classList.add('hidden');
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

    restaurants.forEach(r => {
        const item = document.createElement('div');
        item.className = 'restaurant-item';

        // Check if it's an image or emoji
        if (r.isImage) {
            item.innerHTML = `<div class="restaurant-icon"><img src="${r.icon}" alt="${r.name}" class="restaurant-logo"></div><h3 class="restaurant-name">${r.name}</h3>`;
        } else {
            item.innerHTML = `<span class="restaurant-icon">${r.icon}</span><h3 class="restaurant-name">${r.name}</h3>`;
        }

        item.style.cursor = 'pointer';

        item.onclick = function() {
            console.log('🏪 Restaurant selected:', r.name);
            selectRestaurant(r);
        };

        restaurantsGrid.appendChild(item);
    });

    console.log(`✅ Generated ${restaurants.length} restaurant items`);
}

function clearRestaurantMenu() {
    console.log('🧹 Clearing restaurant menu...');

    const restaurantTableContainer = document.getElementById('restaurant-table-container');
    const excelUploadSection = document.getElementById('excel-upload-section');
    const restaurantDataSection = document.getElementById('restaurant-data-section');
    const restaurantDataTitle = document.getElementById('restaurant-data-title');

    if (restaurantTableContainer) {
        restaurantTableContainer.innerHTML = '';
    }

    if (excelUploadSection) {
        excelUploadSection.style.display = 'none';
    }

    if (restaurantDataSection) {
        restaurantDataSection.classList.add('hidden');
    }

    if (restaurantDataTitle) {
        restaurantDataTitle.textContent = '';
    }

    // Reset selected restaurant
    app.selectedRestaurant = null;

    console.log('✅ Restaurant menu cleared');
}

function selectRestaurant(restaurant) {
    console.log('🏪 Selecting restaurant:', restaurant.name);

    // Clear any existing menu first
    clearRestaurantMenu();

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
        const availableSheets = Object.keys(app.excelData);
        
        // Special handling for KFC
        if (restaurant.name === 'KFC') {
            // Try different possible sheet names for KFC
            const possibleKfcSheets = [
                'KFC',
                'KFC Menu',
                'KFC_Price_List',
                'KFC Prices',
                'KFC_2025',
                ...availableSheets.filter(sheet => sheet.toLowerCase().includes('kfc'))
            ];
            
            for (const sheetName of possibleKfcSheets) {
                if (app.excelData[sheetName]) {
                    console.log(`✅ Found KFC data in sheet: ${sheetName}`);
                    menuData = app.excelData[sheetName];
                    break;
                }
            }
        }
        
        // If KFC not found yet or it's another restaurant, try normal matching
        if (!menuData) {
            // 1. Try exact match with sheetName
            if (app.excelData[restaurant.sheetName]) {
                console.log(`✅ Found exact match for sheet: ${restaurant.sheetName}`);
                menuData = app.excelData[restaurant.sheetName];
            }
            // 2. Try matching with restaurant name (case insensitive)
            else {
                const normalizedRestaurantName = restaurant.name.toLowerCase().replace(/[^a-z0-9]/g, '');
                
                // Try different matching patterns
                const matchingSheet = availableSheets.find(sheet => {
                    const normalizedSheet = sheet.toLowerCase().replace(/[^a-z0-9]/g, '');
                    
                    // Check for direct inclusion
                    if (normalizedSheet.includes(normalizedRestaurantName) || 
                        normalizedRestaurantName.includes(normalizedSheet)) {
                        return true;
                    }
                    
                    // Check for common abbreviations
                    const commonAbbr = {
                        'kfc': 'kentucky',
                        'bk': 'burgerking',
                        'mcd': 'mcdonalds',
                        'pizzahut': 'pizza hut',
                        'tacobell': 'taco bell',
                        'behrouz': 'behrouz biryani',
                        'shawarmazone': 'shawarma zone',
                        'wowmomo': 'wow momo'
                    };
                    
                    // Check if either name matches common abbreviations
                    for (const [abbr, full] of Object.entries(commonAbbr)) {
                        if ((normalizedSheet.includes(abbr) && normalizedRestaurantName.includes(full)) ||
                            (normalizedSheet.includes(full) && normalizedRestaurantName.includes(abbr))) {
                            return true;
                        }
                    }
                    
                    return false;
                });
                
                if (matchingSheet) {
                    console.log(`✅ Found matching sheet: ${matchingSheet} for ${restaurant.name}`);
                    menuData = app.excelData[matchingSheet];
                } else {
                    console.log('Available sheets:', availableSheets);
                    console.log(`Could not find matching sheet for: ${restaurant.name} (tried: ${restaurant.sheetName})`);
                    
                    // As a last resort, try to find any sheet that might contain the data
                    const partialMatch = availableSheets.find(sheet => 
                        sheet.toLowerCase().includes(restaurant.name.toLowerCase()) ||
                        restaurant.name.toLowerCase().includes(sheet.toLowerCase())
                    );
                    
                    if (partialMatch) {
                        console.log(`⚠️ Using partial match for ${restaurant.name}: ${partialMatch}`);
                        menuData = app.excelData[partialMatch];
                    }
                }
            }
        }
        
        if (menuData && menuData.length > 0) {
            console.log('📊 Excel data found for:', restaurant.name, '- Items:', menuData.length);
            if (excelUploadSection) excelUploadSection.style.display = 'none';
            renderRestaurantMenu(menuData);
        } else {
            console.log('❌ No matching data found for:', restaurant.name);
            if (excelUploadSection) excelUploadSection.style.display = 'none';
            if (restaurantTableContainer) {
                restaurantTableContainer.innerHTML = `
                    <div style="padding: 20px; text-align: center; color: #666;">
                        <p>No menu data available for ${restaurant.name}</p>
                    </div>
                `;
            }
        }
    } else {
        console.log('📁 No Excel data, hiding upload section');
        if (excelUploadSection) excelUploadSection.style.display = 'none';
        if (restaurantTableContainer) {
            restaurantTableContainer.innerHTML = `
                <div style="padding: 20px; text-align: center; color: #666;">
                    <p>No menu data available for ${restaurant.name}</p>
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
    
    const restaurantName = app.selectedRestaurant ? app.selectedRestaurant.name : 'Restaurant';
    const hideOwnApp = (restaurantName === 'Golden Wok Restaurant' || restaurantName === 'Koliwada');
    
    let html = '<div class="table-container"><table class="menu-table"><thead><tr>';
    html += '<th>Item Name</th>';
    html += '<th>Category</th>';
    html += '<th class="price-header">Price on Swiggy</th>';
    html += '<th class="price-header">Price on Zomato</th>';
    if (!hideOwnApp) {
        html += `<th class="price-header">Price on ${restaurantName} App</th>`;
    }
    html += '<th class="cart-header">Add to Cart</th>';
    html += '</tr></thead><tbody>';
    
    menuData.forEach((item, index) => {
        html += '<tr>';
        html += `<td>${item.ItemName || ''}</td>`;
        html += `<td>${item.Category || ''}</td>`;
        html += `<td class="price-cell price-swiggy">${item.Swiggy ? '₹' + item.Swiggy : '-'}</td>`;
        html += `<td class="price-cell price-zomato">${item.Zomato ? '₹' + item.Zomato : '-'}</td>`;
        if (!hideOwnApp) {
            html += `<td class="price-cell price-own-app">${item.Own_App ? '₹' + item.Own_App : '-'}</td>`;
        }
        html += `<td class="cart-cell">
            <button class="add-to-cart-btn" onclick="addToCart('${item.ItemName}', '${item.Category}', ${item.Swiggy || 0}, ${item.Zomato || 0}, ${hideOwnApp ? 0 : (item.Own_App || 0)})" 
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

async function autoLoadExcelFile() {
    console.log('🔄 Loading restaurant data from embedded data...');
    
    try {
        // Try to load embedded data first
        if (typeof EMBEDDED_RESTAURANT_DATA !== 'undefined') {
            app.excelData = EMBEDDED_RESTAURANT_DATA;
            console.log('✅ Loaded embedded restaurant data');
            console.log('📊 Available restaurants:', Object.keys(app.excelData));
            
            // If a restaurant is already selected, refresh its menu
            if (app.selectedRestaurant) {
                console.log('🔄 Refreshing current restaurant menu...');
                selectRestaurant(app.selectedRestaurant);
            }
            
            return true;
        } else {
            throw new Error('Embedded restaurant data not found');
        }
    } catch (error) {
        console.error('❌ Error loading embedded data:', error);
        showErrorMessage('Failed to load restaurant data. Please refresh the page.');
        return false;
    }
}

function processExcelFile(arrayBuffer) {
    try {
        console.log('📊 Processing Excel file...');
        const workbook = XLSX.read(arrayBuffer, { type: 'array' });
        
        if (!app.excelData) app.excelData = {};
        
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
    
    const restaurantName = app.selectedRestaurant ? app.selectedRestaurant.name : 'Unknown';
    
    // Check if cart has items from a different restaurant
    if (app.cart.length > 0 && app.cart[0].restaurant !== restaurantName) {
        const currentRestaurant = app.cart[0].restaurant;
        const confirmMessage = `Your cart contains items from ${currentRestaurant}.\n\nYou can only order from one restaurant at a time.\n\nDo you want to clear your cart and add items from ${restaurantName}?`;
        
        if (confirm(confirmMessage)) {
            // Clear cart and add new item
            app.cart = [];
            console.log('🗑️ Cart cleared for new restaurant');
        } else {
            // User cancelled, don't add item
            console.log('❌ User cancelled adding item from different restaurant');
            return;
        }
    }
    
    const cartItem = {
        id: Date.now() + Math.random(), // Unique ID
        name: itemName,
        category: category,
        restaurant: restaurantName,
        prices: {
            swiggy: swiggyPrice,
            zomato: zomatoPrice,
            ownApp: ownAppPrice
        },
        quantity: 1,
        addedAt: new Date()
    };
    
    // Check if the EXACT same item already exists in cart (same name, restaurant, and prices)
    const existingItem = app.cart.find(item => 
        item.name === itemName && 
        item.restaurant === cartItem.restaurant &&
        item.prices.swiggy === cartItem.prices.swiggy &&
        item.prices.zomato === cartItem.prices.zomato &&
        item.prices.ownApp === cartItem.prices.ownApp
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
        
        if (totalItems === 0) {
            cartBtn.textContent = `🛒 Cart`;
        } else {
            const restaurantName = app.cart[0].restaurant;
            cartBtn.textContent = `🛒 Cart (${totalItems}) - ${restaurantName}`;
        }
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
                        <strong>${item.restaurant} App</strong><br>
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
    
    // Update own app label with restaurant name
    const ownAppLabel = document.getElementById('own-app-label');
    if (ownAppLabel && app.cart.length > 0) {
        const restaurantName = app.cart[0].restaurant;
        ownAppLabel.textContent = `Best Price (${restaurantName} App):`;
    }
    
    // Update checkout button with cheapest option
    updateCheckoutButton(totalSwiggy, totalZomato, totalOwnApp);
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

function updateCheckoutButton(totalSwiggy, totalZomato, totalOwnApp) {
    const checkoutBtn = document.getElementById('checkout-btn');
    if (!checkoutBtn || app.cart.length === 0) return;
    
    const restaurantName = app.cart[0].restaurant;
    const restaurantAppName = `${restaurantName} App`;
    
    // Find the cheapest option
    const prices = [
        { platform: 'Swiggy', total: totalSwiggy, url: 'https://www.swiggy.com' },
        { platform: 'Zomato', total: totalZomato, url: 'https://www.zomato.com' },
        { platform: restaurantAppName, total: totalOwnApp, url: getCheapestRestaurantUrl() }
    ];
    
    // Filter out zero prices and find minimum
    const validPrices = prices.filter(p => p.total > 0);
    
    if (validPrices.length === 0) {
        checkoutBtn.textContent = '🛒 Proceed to Checkout';
        return;
    }
    
    const cheapest = validPrices.reduce((min, current) => 
        current.total < min.total ? current : min
    );
    
    // Update button text and store URL for click handler
    checkoutBtn.textContent = `🛒 Order on ${cheapest.platform} (₹${cheapest.total})`;
    checkoutBtn.setAttribute('data-checkout-url', cheapest.url);
    checkoutBtn.setAttribute('data-platform', cheapest.platform);
    
    console.log(`💰 Cheapest option: ${cheapest.platform} at ₹${cheapest.total}`);
}

function getCheapestRestaurantUrl() {
    if (app.cart.length === 0) return '#';
    
    const restaurant = app.cart[0].restaurant;
    
    // Restaurant app URLs (you can customize these)
    const restaurantUrls = {
        "McDonald's": "https://www.mcdelivery.co.in",
        "Burger King": "https://www.burgerking.in",
        "KFC": "https://online.kfc.co.in",
        "Domino's": "https://www.dominos.co.in",
        "Pizza Hut": "https://www.pizzahut.co.in",
        "Taco Bell": "https://www.tacobell.co.in",
        "Wow! Momo": "https://www.wowmomo.in",
        "Shawarma Zone": "https://www.shawarmazone.in",
        "Behrouz Biryani": "https://www.behrouz.in"
    };
    
    return restaurantUrls[restaurant] || '#';
}

// Search functionality
function setupSearch() {
    console.log('🔍 Setting up search functionality...');
    
    const searchInput = document.querySelector('.search-input');
    const searchBtn = document.querySelector('.search-btn');
    
    if (searchInput && searchBtn) {
        // Search button click
        searchBtn.onclick = function() {
            performSearch();
        };
        
        // Enter key press
        searchInput.addEventListener('keypress', function(e) {
            if (e.key === 'Enter') {
                performSearch();
            }
        });
        
        // Real-time search as user types (with debounce)
        let searchTimeout;
        searchInput.addEventListener('input', function() {
            clearTimeout(searchTimeout);
            searchTimeout = setTimeout(() => {
                if (searchInput.value.trim().length >= 2) {
                    performSearch();
                }
            }, 300); // Wait 300ms after user stops typing
        });
        
        console.log('✅ Search functionality setup complete');
    } else {
        console.error('❌ Search elements not found');
    }
}

function performSearch() {
    const searchInput = document.querySelector('.search-input');
    const query = searchInput.value.trim().toLowerCase();
    
    console.log('🔍 Performing search for:', query);
    
    if (!query) {
        showPage('home');
        return;
    }
    
    if (query.length < 2) {
        showErrorMessage('Please enter at least 2 characters to search');
        return;
    }
    
    // Search across all restaurant data
    const searchResults = searchItems(query);
    
    if (searchResults.length === 0) {
        showSearchResults([], query);
    } else {
        showSearchResults(searchResults, query);
    }
}

function searchItems(query) {
    const results = [];
    
    if (!app.excelData) {
        console.log('❌ No data available for search');
        return results;
    }
    
    // Search across all restaurants
    Object.entries(app.excelData).forEach(([restaurantName, items]) => {
        items.forEach(item => {
            // Search in item name and category
            const itemName = (item.ItemName || '').toLowerCase();
            const category = (item.Category || '').toLowerCase();
            
            if (itemName.includes(query) || category.includes(query)) {
                results.push({
                    ...item,
                    restaurant: restaurantName,
                    matchType: itemName.includes(query) ? 'name' : 'category'
                });
            }
        });
    });
    
    // Sort results by relevance (exact matches first, then partial matches)
    results.sort((a, b) => {
        const aName = (a.ItemName || '').toLowerCase();
        const bName = (b.ItemName || '').toLowerCase();
        
        // Exact matches first
        if (aName === query && bName !== query) return -1;
        if (bName === query && aName !== query) return 1;
        
        // Then matches at the beginning
        if (aName.startsWith(query) && !bName.startsWith(query)) return -1;
        if (bName.startsWith(query) && !aName.startsWith(query)) return 1;
        
        // Then alphabetical
        return aName.localeCompare(bName);
    });
    
    console.log(`🔍 Found ${results.length} search results`);
    return results;
}

function showSearchResults(results, query) {
    console.log('📄 Showing search results page');
    
    // Create search results page if it doesn't exist
    let searchPage = document.getElementById('search-results-page');
    if (!searchPage) {
        createSearchResultsPage();
        searchPage = document.getElementById('search-results-page');
    }
    
    // Update search results content
    const searchTitle = document.getElementById('search-results-title');
    const searchResultsContainer = document.getElementById('search-results-container');
    
    if (results.length === 0) {
        searchTitle.textContent = `No results found for "${query}"`;
        searchResultsContainer.innerHTML = `
            <div class="no-results">
                <div class="no-results-icon">🔍</div>
                <h3>No items found</h3>
                <p>Try searching for:</p>
                <ul>
                    <li>Pizza, Burger, Margherita</li>
                    <li>McAloo, Cheese, Paneer</li>
                    <li>Veg Pizza, Burger, Side</li>
                </ul>
                <button onclick="document.querySelector('.search-input').value=''; showPage('home')" class="back-to-home-btn">
                    🏠 Back to Home
                </button>
            </div>
        `;
    } else {
        searchTitle.textContent = `Found ${results.length} results for "${query}"`;
        renderSearchResults(results);
    }
    
    showPage('search-results');
}

function createSearchResultsPage() {
    const main = document.querySelector('main');
    const searchPageHTML = `
        <section id="search-results-page" class="page hidden">
            <div class="container">
                <div class="page-header">
                    <button id="back-from-search" class="back-btn">← Back</button>
                    <h2 id="search-results-title">Search Results</h2>
                </div>
                <div id="search-results-container"></div>
            </div>
        </section>
    `;
    
    main.insertAdjacentHTML('beforeend', searchPageHTML);
    
    // Setup back button
    const backFromSearchBtn = document.getElementById('back-from-search');
    if (backFromSearchBtn) {
        backFromSearchBtn.onclick = function() {
            showPage('home');
        };
    }
}

function renderSearchResults(results) {
    const container = document.getElementById('search-results-container');
    
    let html = '<div class="search-results-table"><table class="menu-table"><thead><tr>';
    html += '<th>Item Name</th>';
    html += '<th>Restaurant</th>';
    html += '<th>Category</th>';
    html += '<th class="price-header">Price on Swiggy</th>';
    html += '<th class="price-header">Price on Zomato</th>';
    html += '<th class="price-header">Price on Restaurant App</th>';
    html += '<th class="cart-header">Add to Cart</th>';
    html += '</tr></thead><tbody>';
    
    results.forEach((item, index) => {
        html += '<tr>';
        html += `<td><strong>${item.ItemName || ''}</strong></td>`;
        html += `<td><span class="restaurant-badge">${item.restaurant}</span></td>`;
        html += `<td>${item.Category || ''}</td>`;
        html += `<td class="price-cell price-swiggy">${item.Swiggy ? '₹' + item.Swiggy : '-'}</td>`;
        html += `<td class="price-cell price-zomato">${item.Zomato ? '₹' + item.Zomato : '-'}</td>`;
        html += `<td class="price-cell price-own-app">${item.Own_App ? '₹' + item.Own_App : '-'}</td>`;
        html += `<td class="cart-cell">
            <button class="add-to-cart-btn" onclick="addToCartFromSearch('${item.ItemName}', '${item.Category}', '${item.restaurant}', ${item.Swiggy || 0}, ${item.Zomato || 0}, ${item.Own_App || 0})" 
                    style="background: #e74c3c; color: white; border: none; padding: 8px 12px; border-radius: 4px; cursor: pointer; font-size: 12px;">
                🛒 Add to Cart
            </button>
        </td>`;
        html += '</tr>';
    });
    
    html += '</tbody></table></div>';
    container.innerHTML = html;
}

function addToCartFromSearch(itemName, category, restaurant, swiggyPrice, zomatoPrice, ownAppPrice) {
    console.log('🛒 Adding to cart from search:', itemName);
    
    // Check if cart has items from a different restaurant
    if (app.cart.length > 0 && app.cart[0].restaurant !== restaurant) {
        const currentRestaurant = app.cart[0].restaurant;
        const confirmMessage = `Your cart contains items from ${currentRestaurant}.\n\nYou can only order from one restaurant at a time.\n\nDo you want to clear your cart and add items from ${restaurant}?`;
        
        if (confirm(confirmMessage)) {
            // Clear cart and add new item
            app.cart = [];
            console.log('🗑️ Cart cleared for new restaurant');
        } else {
            // User cancelled, don't add item
            console.log('❌ User cancelled adding item from different restaurant');
            return;
        }
    }
    
    const cartItem = {
        id: Date.now() + Math.random(),
        name: itemName,
        category: category,
        restaurant: restaurant,
        prices: {
            swiggy: swiggyPrice,
            zomato: zomatoPrice,
            ownApp: ownAppPrice
        },
        quantity: 1,
        addedAt: new Date()
    };
    
    // Check if the EXACT same item already exists in cart (same name, restaurant, and prices)
    const existingItem = app.cart.find(item => 
        item.name === itemName && 
        item.restaurant === restaurant &&
        item.prices.swiggy === cartItem.prices.swiggy &&
        item.prices.zomato === cartItem.prices.zomato &&
        item.prices.ownApp === cartItem.prices.ownApp
    );
    
    if (existingItem) {
        existingItem.quantity += 1;
        showSuccessMessage(`${itemName} quantity updated in cart (${existingItem.quantity})`);
    } else {
        app.cart.push(cartItem);
        showSuccessMessage(`${itemName} from ${restaurant} added to cart!`);
    }
    
    updateCartCounter();
    console.log('🛒 Cart updated from search');
}

function showCartSummaryBeforeRedirect(platform) {
    // Create overlay
    const overlay = document.createElement('div');
    overlay.style.cssText = `
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background: rgba(0,0,0,0.8);
        z-index: 10000;
        display: flex;
        justify-content: center;
        align-items: center;
    `;
    
    // Create popup
    const popup = document.createElement('div');
    popup.style.cssText = `
        background: white;
        padding: 2rem;
        border-radius: 10px;
        max-width: 500px;
        width: 90%;
        text-align: center;
        box-shadow: 0 10px 30px rgba(0,0,0,0.3);
    `;
    
    let popupHTML = `
        <h3 style="color: #2c3e50; margin-bottom: 1rem;">🛒 Cart Summary for ${platform}</h3>
        <p style="color: #7f8c8d; margin-bottom: 1.5rem;">Please add these items manually on ${platform}:</p>
        <div style="background: #f8f9fa; padding: 1rem; border-radius: 5px; margin-bottom: 1.5rem;">
    `;
    
    app.cart.forEach(item => {
        const price = platform.includes('Swiggy') ? item.prices.swiggy : 
                     platform.includes('Zomato') ? item.prices.zomato : 
                     item.prices.ownApp;
        
        popupHTML += `
            <div style="display: flex; justify-content: space-between; padding: 0.5rem 0; border-bottom: 1px solid #eee;">
                <span><strong>${item.quantity}x</strong> ${item.name}</span>
                <span style="color: #e74c3c;"><strong>₹${price || 0}</strong></span>
            </div>
        `;
    });
    
    const totalPrice = app.cart.reduce((sum, item) => {
        const price = platform.includes('Swiggy') ? item.prices.swiggy : 
                     platform.includes('Zomato') ? item.prices.zomato : 
                     item.prices.ownApp;
        return sum + (price || 0) * item.quantity;
    }, 0);
    
    popupHTML += `
        </div>
        <div style="font-size: 1.2rem; font-weight: bold; color: #2c3e50; margin-bottom: 1rem;">
            Total: ₹${totalPrice}
        </div>
        <p style="color: #e74c3c; font-size: 0.9rem; margin-bottom: 1rem;">
            ⚠️ Cart items cannot be automatically transferred. You'll need to search and add these items manually on ${platform}.
        </p>
        <div style="color: #6c757d; font-size: 0.8rem;">
            Redirecting in <span id="countdown">2</span> seconds...
        </div>
    `;
    
    popup.innerHTML = popupHTML;
    overlay.appendChild(popup);
    document.body.appendChild(overlay);
    
    // Countdown timer
    let seconds = 2;
    const countdownEl = document.getElementById('countdown');
    const timer = setInterval(() => {
        seconds--;
        if (countdownEl) countdownEl.textContent = seconds;
        if (seconds <= 0) {
            clearInterval(timer);
            document.body.removeChild(overlay);
        }
    }, 1000);
    
    // Allow clicking to close
    overlay.onclick = function(e) {
        if (e.target === overlay) {
            clearInterval(timer);
            document.body.removeChild(overlay);
        }
    };
}

// Wait for XLSX to be available
function waitForXLSX() {
    return new Promise((resolve) => {
        const checkXLSX = () => {
            if (typeof XLSX !== 'undefined') {
                console.log('✅ XLSX is available');
                resolve();
            } else {
                console.log('⏳ Waiting for XLSX to load...');
                setTimeout(checkXLSX, 100);
            }
        };
        checkXLSX();
    });
}

// Initialize the app when both DOM and XLSX are ready
async function initializeApp() {
    console.log('🚀 Initializing PriceBite App...');
    
    try {
        // Wait for XLSX to be available
        await waitForXLSX();
        
        // Setup navigation and other UI components
        setupNavigation();
        setupSearch();
        
        // Load the Excel data
        const success = await autoLoadExcelFile();
        if (success) {
            console.log('✅ App initialization complete');
        } else {
            console.error('❌ App initialization failed - could not load restaurant data');
            showErrorMessage('Failed to load restaurant data. Please check the console for details.');
        }
    } catch (error) {
        console.error('❌ Error initializing app:', error);
        showErrorMessage('Failed to initialize the application. Please refresh the page.');
    }
}

// Start the app when the DOM is ready
document.addEventListener('DOMContentLoaded', initializeApp);

console.log('📱 PriceBite Simple App Loaded!');
