// Simple PriceBite Application - Working Version
console.log('🚀 PriceBite Simple App Starting...');

// App data
const app = {
    currentPage: 'home',
    selectedCategory: null,
    selectedRestaurant: null,
    excelData: null,
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
        logo.onclick = function() {
            console.log('🏠 Logo clicked');
            showPage('home');
        };
        logo.style.cursor = 'pointer';
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
    html += '</tr></thead><tbody>';
    
    menuData.forEach(item => {
        html += '<tr>';
        html += `<td>${item.ItemName || ''}</td>`;
        html += `<td>${item.Category || ''}</td>`;
        html += `<td class="price-cell price-swiggy">${item.Swiggy ? '₹' + item.Swiggy : '-'}</td>`;
        html += `<td class="price-cell price-zomato">${item.Zomato ? '₹' + item.Zomato : '-'}</td>`;
        html += `<td class="price-cell price-own-app">${item.Own_App ? '₹' + item.Own_App : '-'}</td>`;
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

console.log('📱 PriceBite Simple App Loaded!');
