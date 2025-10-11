// PriceBite Application JavaScript

// Application state
const app = {
    currentPage: 'home',
    selectedCategory: null,
    foodCategories: [
        {"name": "Pizza", "img": "🍕", "id": "pizza"},
        {"name": "Burger", "img": "🍔", "id": "burger"},
        {"name": "Taco", "img": "🌮", "id": "taco"},
        {"name": "Biryani", "img": "🍛", "id": "biryani"},
        {"name": "Shawarma", "img": "🥙", "id": "shawarma"},
        {"name": "Momos", "img": "🥟", "id": "momos"},
        {"name": "Pasta", "img": "🍝", "id": "pasta"},
        {"name": "Sandwich", "img": "🥪", "id": "sandwich"},
        {"name": "Noodles", "img": "🍜", "id": "noodles"}
    ],
    restaurants: {
        "pizza": [
            {"name": "Dominos", "icon": "🍕", "id": "dominos"},
            {"name": "Pizza Hut", "icon": "🍕", "id": "pizzahut"},
            {"name": "La Pinos", "icon": "🍕", "id": "lapinos"},
            {"name": "Ovenstory", "icon": "🍕", "id": "ovenstory"}
        ],
        "burger": [
            {"name": "McDonald's", "icon": "🍔", "id": "mcdonalds"},
            {"name": "Burger King", "icon": "🍔", "id": "burgerking"},
            {"name": "Jumbo King", "icon": "🍔", "id": "jumboking"}
        ],
        "taco": [
            {"name": "Taco Bell", "icon": "🌮", "id": "tacobell"}
        ],
        "biryani": [
            {"name": "Behrouz", "icon": "🍛", "id": "behrouz"}
        ],
        "shawarma": [
            {"name": "Shawarma Zone", "icon": "🥙", "id": "shawarmazone"}
        ],
        "momos": [
            {"name": "Wow Momo", "icon": "🥟", "id": "wowmomo"}
        ],
        "pasta": [
            {"name": "Coming Soon", "icon": "🍝", "id": "comingsoon"}
        ],
        "sandwich": [
            {"name": "Coming Soon", "icon": "🥪", "id": "comingsoon"}
        ],
        "noodles": [
            {"name": "Coming Soon", "icon": "🍜", "id": "comingsoon"}
        ]
    }
};

// --- CART FUNCTIONALITY ---
let cart = [];

// Open Cart Page
document.querySelector(".cart-btn").addEventListener("click", () => {
    showPage("cart-page");
    renderCart();
});

// Back to Restaurants
document.getElementById("back-to-restaurants").addEventListener("click", () => {
    showPage("restaurants-page");
});

// Add to Cart function
function addToCart(item) {
    cart.push(item);
    updateCartIcon();
    alert(item.name + " added to cart!");
}

// Render cart items
function renderCart() {
    const cartContainer = document.getElementById("cart-items");
    cartContainer.innerHTML = "";

    if (cart.length === 0) {
        cartContainer.innerHTML = "<p>Your cart is empty 🛒</p>";
        document.getElementById("cart-total").textContent = "₹0";
        return;
    }

    let total = 0;

    cart.forEach((item, index) => {
        total += item.price;

        const div = document.createElement("div");
        div.classList.add("cart-item");
        div.innerHTML = `
            <span>${item.name}</span>
            <span>₹${item.price}</span>
            <button class="btn btn--secondary remove-btn" data-index="${index}">❌</button>
        `;
        cartContainer.appendChild(div);
    });

    document.getElementById("cart-total").textContent = "₹" + total;

    // Remove buttons
    document.querySelectorAll(".remove-btn").forEach(btn => {
        btn.addEventListener("click", (e) => {
            const i = e.target.dataset.index;
            cart.splice(i, 1);
            renderCart();
            updateCartIcon();
        });
    });
}

// Update cart icon count
function updateCartIcon() {
    const cartText = document.querySelector(".cart-text");
    cartText.textContent = `Cart (${cart.length})`;
}


// DOM Elements
const elements = {
    homePage: null,
    comparePage: null,
    restaurantsPage: null,
    menuPage: null,
    compareBtn: null,
    backToHomeBtn: null,
    backToCategoriesBtn: null,
    backToRestaurantsBtn: null,
    foodGrid: null,
    restaurantsGrid: null,
    restaurantsTitle: null,
    logo: null,
    searchInput: null,
    cartBtn: null
};

// Initialize the application when DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
    init();
});

// Initialize the application
function init() {
    console.log('🚀 Initializing PriceBite application...');
    
    // Cache DOM elements
    cacheElements();
    
    // Set up event listeners
    setupEventListeners();
    
    // Generate food items
    generateFoodItems();
    
    // Show home page initially
    showPage('home');
    
    console.log('✅ PriceBite application initialized successfully!');
}

// Cache all DOM elements
function cacheElements() {
    elements.homePage = document.getElementById('home-page');
    elements.comparePage = document.getElementById('compare-page');
    elements.restaurantsPage = document.getElementById('restaurants-page');
    elements.menuPage = document.getElementById('menu-page');
    elements.compareBtn = document.getElementById('compare-now-btn');
    elements.backToHomeBtn = document.getElementById('back-to-home');
    elements.backToCategoriesBtn = document.getElementById('back-to-categories');
    elements.backToRestaurantsBtn = document.getElementById('back-to-restaurants');
    elements.foodGrid = document.getElementById('food-grid');
    elements.restaurantsGrid = document.getElementById('restaurants-grid');
    elements.restaurantsTitle = document.getElementById('restaurants-title');
    elements.logo = document.querySelector('.logo h1');
    elements.searchInput = document.querySelector('.search-input');
    elements.cartBtn = document.querySelector('.cart-btn');
}

// Set up all event listeners
function setupEventListeners() {
    // Compare Now button
    if (elements.compareBtn) {
        elements.compareBtn.addEventListener('click', function() {
            console.log('🔄 Navigating to food categories...');
            showPage('compare');
        });
    }

    // Back to home button
    if (elements.backToHomeBtn) {
        elements.backToHomeBtn.addEventListener('click', function() {
            console.log('🔄 Navigating back to home...');
            showPage('home');
        });
    }

    // Back to categories button
    if (elements.backToCategoriesBtn) {
        elements.backToCategoriesBtn.addEventListener('click', function() {
            console.log('🔄 Navigating back to categories...');
            showPage('compare');
        });
    }

    // Back to restaurants button
    if (elements.backToRestaurantsBtn) {
        elements.backToRestaurantsBtn.addEventListener('click', function() {
            console.log('🔄 Navigating back to restaurants...');
            showPage('restaurants');
        });
    }

    // Logo click - go to home
    if (elements.logo) {
        elements.logo.addEventListener('click', function() {
            console.log('🏠 Logo clicked - going home...');
            showPage('home');
        });
    }

    // Search functionality
    if (elements.searchInput) {
        elements.searchInput.addEventListener('keypress', function(e) {
            if (e.key === 'Enter') {
                handleSearch();
            }
        });
    }

    // Cart button
    if (elements.cartBtn) {
        elements.cartBtn.addEventListener('click', function() {
            showPage('cart-page');
            renderCart();
        });
    }

    // Search button
    const searchBtn = document.querySelector('.search-btn');
    if (searchBtn) {
        searchBtn.addEventListener('click', handleSearch);
    }
}

// Handle search functionality
function handleSearch() {
    const query = elements.searchInput.value.trim();
    if (query) {
        alert(`🔍 Search functionality coming soon! You searched for: "${query}"`);
        elements.searchInput.value = '';
    }
}

// Show specific page and hide others
function showPage(pageName) {
    console.log(`📄 Showing page: ${pageName}`);
    
    // Hide all pages first
    const pages = document.querySelectorAll('.page');
    pages.forEach(page => {
        page.classList.add('hidden');
    });
    
    // Show the requested page
    switch(pageName) {
        case 'home':
            elements.homePage.classList.remove('hidden');
            app.currentPage = 'home';
            break;
        case 'compare':
            elements.comparePage.classList.remove('hidden');
            app.currentPage = 'compare';
            break;
        case 'restaurants':
            elements.restaurantsPage.classList.remove('hidden');
            app.currentPage = 'restaurants';
            break;
        case 'menu':
            elements.menuPage.classList.remove('hidden');
            app.currentPage = 'menu';
            break;
        case 'cart-page':
            document.getElementById('cart-page').classList.remove('hidden');
            app.currentPage = 'cart-page';
            break;
        default:
            console.warn(`Unknown page: ${pageName}`);
            elements.homePage.classList.remove('hidden');
            app.currentPage = 'home';
    }
    
    // Add fade-in animation
    const activePage = document.querySelector('.page:not(.hidden)');
    if (activePage) {
        activePage.classList.add('fade-in');
        setTimeout(() => {
            activePage.classList.remove('fade-in');
        }, 500);
    }
}

// Generate food category items
function generateFoodItems() {
    if (!elements.foodGrid) {
        console.error('Food grid element not found!');
        return;
    }

    console.log('🍽️ Generating food category items...');
    
    elements.foodGrid.innerHTML = '';
    
    app.foodCategories.forEach(food => {
        const foodItem = createFoodItem(food);
        elements.foodGrid.appendChild(foodItem);
    });
}

// Create individual food item element
function createFoodItem(food) {
    const item = document.createElement('div');
    item.className = 'food-item';
    item.setAttribute('data-category', food.id);
    
    item.innerHTML = `
        <span class="food-img">${food.img}</span>
        <h3 class="food-name">${food.name}</h3>
    `;
    
    // Add click event listener
    item.addEventListener('click', function() {
        console.log(`🍽️ Selected food category: ${food.name}`);
        selectFoodCategory(food.id, food.name);
    });
    
    // Add keyboard navigation
    item.setAttribute('tabindex', '0');
    item.addEventListener('keypress', function(e) {
        if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault();
            item.click();
        }
    });
    
    return item;
}

// Select food category and show restaurants
function selectFoodCategory(categoryId, categoryName) {
    app.selectedCategory = categoryId;
    
    // Update restaurants page title
    elements.restaurantsTitle.textContent = `${categoryName} Restaurants`;
    
    // Generate restaurant items
    generateRestaurantItems(categoryId);
    
    // Show restaurants page
    showPage('restaurants');
}

// Generate restaurant items for selected category
function generateRestaurantItems(categoryId) {
    if (!elements.restaurantsGrid) {
        console.error('Restaurants grid element not found!');
        return;
    }

    console.log(`🏪 Generating restaurants for category: ${categoryId}`);
    
    elements.restaurantsGrid.innerHTML = '';
    
    const restaurants = app.restaurants[categoryId] || [];
    
    if (restaurants.length === 0) {
        const noRestaurants = document.createElement('div');
        noRestaurants.className = 'no-restaurants';
        noRestaurants.innerHTML = '<p>No restaurants available for this category yet.</p>';
        elements.restaurantsGrid.appendChild(noRestaurants);
        return;
    }
    
    restaurants.forEach(restaurant => {
        const restaurantItem = createRestaurantItem(restaurant);
        elements.restaurantsGrid.appendChild(restaurantItem);
    });
}

// Create individual restaurant item element
function createRestaurantItem(restaurant) {
    const item = document.createElement('div');
    item.className = 'restaurant-item';
    
    // Add special class for "Coming Soon" items
    if (restaurant.id === 'comingsoon') {
        item.classList.add('coming-soon');
    }
    
    item.setAttribute('data-restaurant', restaurant.id);
    
    item.innerHTML = `
        <span class="restaurant-icon">${restaurant.icon}</span>
        <h3 class="restaurant-name">${restaurant.name}</h3>
    `;
    
    // Add click event listener
    item.addEventListener('click', function() {
        if (restaurant.id === 'comingsoon') {
            alert('🚧 This restaurant will be available soon!');
        } else {
            console.log(`🏪 Selected restaurant: ${restaurant.name}`);
            selectRestaurant(restaurant);
        }
    });
    
    // Add keyboard navigation
    item.setAttribute('tabindex', '0');
    item.addEventListener('keypress', function(e) {
        if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault();
            item.click();
        }
    });
    
    return item;
}

// Select restaurant (placeholder for future functionality)
function selectRestaurant(restaurant) {
    if (restaurant.id === 'burgerking') {
        loadMenu();
    } else {
        alert(`🏪 You selected ${restaurant.name}!\n\n🔄 Price comparison functionality coming soon!`);
    }
}

// Load menu from CSV
function loadMenu() {
    fetch('../burger_king_price_comparison.csv')
        .then(response => response.text())
        .then(csv => {
            const lines = csv.trim().split('\n').slice(1); // skip header
            const items = lines.map(line => {
                const parts = line.split(',');
                if (parts.length < 5) return null;
                const name = parts[0].trim().replace(/"/g, '');
                const type = parts[1].trim().replace(/"/g, '');
                const prices = [parts[2], parts[3], parts[4]].map(p => p.trim()).filter(p => p && p !== '').map(p => parseFloat(p)).filter(p => !isNaN(p));
                if (!name || prices.length === 0) return null;
                const price = Math.min(...prices);
                return { name, type, price };
            }).filter(Boolean);

            // group by type
            const grouped = items.reduce((acc, item) => {
                if (!acc[item.type]) acc[item.type] = [];
                acc[item.type].push(item);
                return acc;
            }, {});

            // render
            const menuGrid = document.getElementById('menu-grid');
            menuGrid.innerHTML = '';
            Object.keys(grouped).forEach(cat => {
                const section = document.createElement('div');
                section.className = 'menu-category';
                section.innerHTML = `<h3 class="category-title">${cat}</h3><div class="menu-items-grid"></div>`;
                const grid = section.querySelector('.menu-items-grid');
                grouped[cat].forEach(item => {
                    const div = document.createElement('div');
                    div.className = 'menu-item';
                    div.innerHTML = `
                        <h4 class="item-name">${item.name}</h4>
                        <p class="item-price">₹${item.price}</p>
                        <button class="btn btn--primary add-to-cart-btn">Add to Cart</button>
                    `;
                    div.querySelector('.add-to-cart-btn').addEventListener('click', () => addToCart(item));
                    grid.appendChild(div);
                });
                menuGrid.appendChild(section);
            });
            showPage('menu');
        })
        .catch(error => {
            console.error('Error loading menu:', error);
            alert('Failed to load menu. Please try again.');
        });
}

// Utility function to add loading state
function showLoading(element) {
    element.innerHTML = '<div class="loading">⏳ Loading...</div>';
}

// Utility function to handle errors
function handleError(error, context = 'Unknown') {
    console.error(`❌ Error in ${context}:`, error);
    alert(`Sorry, something went wrong. Please try again.`);
}

// Performance optimization - debounce search
function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

// Export for potential module use
window.PriceBite = {
    app,
    elements,
    showPage,
    selectFoodCategory,
    selectRestaurant
};

console.log('📱 PriceBite JavaScript loaded successfully!');
