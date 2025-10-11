// PriceBite Application JavaScript with Integrated Restaurant Data

const app = {
    currentPage: 'home',
    selectedCategory: null,
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
            { "name": "Domino's", "icon": "🍕", "id": "dominos" },
            { "name": "Pizza Hut", "icon": "🍕", "id": "pizzahut" }
        ],
        "burger": [
            { "name": "McDonald's", "icon": "🍔", "id": "mcdonalds" },
            { "name": "Burger King", "icon": "🍔", "id": "burgerking" }
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

const elements = {
    homePage: null,
    comparePage: null,
    restaurantsPage: null,
    compareBtn: null,
    backToHomeBtn: null,
    backToCategoriesBtn: null,
    foodGrid: null,
    restaurantsGrid: null,
    restaurantsTitle: null,
    logo: null,
    searchInput: null,
    cartBtn: null,
    restaurantDataSection: null,
    restaurantTableContainer: null,
    restaurantDataTitle: null,
    xlsxUpload: null
};

document.addEventListener('DOMContentLoaded', init);

function init() {
    cacheElements();
    setupEventListeners();
    generateFoodItems();
    showPage('home');
}

function cacheElements() {
    elements.homePage = document.getElementById('home-page');
    elements.comparePage = document.getElementById('compare-page');
    elements.restaurantsPage = document.getElementById('restaurants-page');
    elements.compareBtn = document.getElementById('compare-now-btn');
    elements.backToHomeBtn = document.getElementById('back-to-home');
    elements.backToCategoriesBtn = document.getElementById('back-to-categories');
    elements.foodGrid = document.getElementById('food-grid');
    elements.restaurantsGrid = document.getElementById('restaurants-grid');
    elements.restaurantsTitle = document.getElementById('restaurants-title');
    elements.logo = document.querySelector('.logo h1');
    elements.restaurantDataSection = document.getElementById('restaurant-data-section');
    elements.restaurantTableContainer = document.getElementById('restaurant-table-container');
    elements.restaurantDataTitle = document.getElementById('restaurant-data-title');
    elements.xlsxUpload = document.getElementById('xlsxUpload');
}

function setupEventListeners() {
    if (elements.compareBtn) elements.compareBtn.addEventListener('click', () => showPage('compare'));
    if (elements.backToHomeBtn) elements.backToHomeBtn.addEventListener('click', () => showPage('home'));
    if (elements.backToCategoriesBtn) elements.backToCategoriesBtn.addEventListener('click', () => showPage('compare'));
    if (elements.logo) elements.logo.addEventListener('click', () => showPage('home'));
    setupSearch();
}

function showPage(pageName) {
    document.querySelectorAll('.page').forEach(p => p.classList.add('hidden'));
    elements[`${pageName}Page`]?.classList.remove('hidden');
}

function generateFoodItems() {
    elements.foodGrid.innerHTML = '';
    app.foodCategories.forEach(food => {
        const div = document.createElement('div');
        div.className = 'food-item';
        div.innerHTML = `<span class="food-emoji">${food.emoji}</span><h3 class="food-name">${food.name}</h3>`;
        div.tabIndex = 0;
        div.addEventListener('click', () => selectFoodCategory(food.id, food.name));
        div.addEventListener('keypress', e => { if (e.key === 'Enter' || e.key === ' ') div.click(); });
        elements.foodGrid.appendChild(div);
    });
}

function selectFoodCategory(categoryId, categoryName) {
    app.selectedCategory = categoryId;
    elements.restaurantsTitle.textContent = `${categoryName} Restaurants`;
    generateRestaurantItems(categoryId);
    showPage('restaurants');
}

function generateRestaurantItems(categoryId) {
    elements.restaurantsGrid.innerHTML = '';
    const restaurants = app.restaurants[categoryId] || [];
    restaurants.forEach(r => {
        const item = document.createElement('div');
        item.className = 'restaurant-item';
        item.innerHTML = `<span class="restaurant-icon">${r.icon}</span><h3 class="restaurant-name">${r.name}</h3>`;
        item.tabIndex = 0;
        item.addEventListener('click', () => selectRestaurant(r));
        elements.restaurantsGrid.appendChild(item);
    });
}

function selectRestaurant(restaurant) {
    elements.restaurantDataSection.classList.remove('hidden');
    elements.restaurantDataTitle.textContent = `${restaurant.name} Menu`;
    loadRestaurantData(restaurant.name);
}

function loadRestaurantData(restaurantName) {
    elements.restaurantTableContainer.innerHTML = '<div class="loading">⏳ Loading menu...</div>';
    
    // Get data from integrated restaurant data
    const menuData = getRestaurantData(restaurantName);
    
    if (menuData && menuData.length > 0) {
        renderTable(menuData);
    } else {
        elements.restaurantTableContainer.innerHTML = `
            <div class="no-data">
                <p>No menu data available for ${restaurantName}</p>
                <p>Menu data will be added soon!</p>
            </div>
        `;
    }
}

// Search functionality
function setupSearch() {
    const searchInput = document.querySelector('.search-input');
    const searchBtn = document.querySelector('.search-btn');
    
    if (searchInput && searchBtn) {
        searchBtn.addEventListener('click', performSearch);
        searchInput.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') performSearch();
        });
    }
}

function performSearch() {
    const searchInput = document.querySelector('.search-input');
    const query = searchInput.value.trim();
    
    if (!query) return;
    
    const results = searchItems(query);
    showSearchResults(results, query);
}

function showSearchResults(results, query) {
    elements.restaurantDataSection.classList.remove('hidden');
    elements.restaurantDataTitle.textContent = `Search Results for "${query}"`;
    
    if (results.length > 0) {
        renderTable(results);
    } else {
        elements.restaurantTableContainer.innerHTML = `
            <div class="no-data">
                <p>No items found for "${query}"</p>
                <p>Try searching for pizza, burger, or other food items</p>
            </div>
        `;
    }
    
    showPage('restaurants');
}

function renderTable(data) {
    if (!data || data.length === 0) {
        elements.restaurantTableContainer.innerHTML = '<p>No data available.</p>';
        return;
    }
    
    // Define the order of columns we want to display
    const columnOrder = ['RestaurantName', 'Category', 'ItemName', 'Price', 'Size / Variant', 'AdditionalInfo'];
    const headers = columnOrder.filter(col => data.some(row => row[col] !== undefined));
    
    let html = '<div class="table-container"><table class="menu-table"><thead><tr>';
    headers.forEach(h => {
        const displayName = h === 'Size / Variant' ? 'Size/Variant' : h.replace(/([A-Z])/g, ' $1').trim();
        html += `<th tabindex="0">${displayName}</th>`;
    });
    html += '</tr></thead><tbody>';
    
    data.forEach(row => {
        html += '<tr>';
        headers.forEach(h => {
            let value = row[h] || '';
            if (h === 'Price' && value) {
                value = `₹${value}`;
            }
            html += `<td tabindex="0">${value}</td>`;
        });
        html += '</tr>';
    });
    html += '</tbody></table></div>';
    elements.restaurantTableContainer.innerHTML = html;
}

console.log('📱 PriceBite with integrated restaurant data loaded!');
