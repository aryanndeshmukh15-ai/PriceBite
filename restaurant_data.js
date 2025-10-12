// Integrated Restaurant Menu Data
// This file contains all restaurant menu data directly embedded in the application
// All restaurant menu data has been cleared - no items will be displayed

const RESTAURANT_DATA = {
  // Empty - no restaurant data will be shown
};

// Category mapping for food types
const CATEGORY_MAPPING = {
  "pizza": ["Pizza Hut", "Domino's"],
  "burger": ["McDonald's", "Burger King"],
  "taco": [],
  "biryani": [],
  "shawarma": [],
  "momos": [],
  "pasta": [],
  "sandwich": [],
  "noodles": []
};

// Function to get restaurants by category
function getRestaurantsByCategory(category) {
  return CATEGORY_MAPPING[category] || [];
}

// Function to get all items for a specific restaurant
function getRestaurantData(restaurantName) {
  return RESTAURANT_DATA[restaurantName] || [];
}

// Function to search for items across all restaurants
function searchItems(query) {
  const results = [];
  const searchTerm = query.toLowerCase();
  
  Object.values(RESTAURANT_DATA).forEach(restaurantItems => {
    if (Array.isArray(restaurantItems)) {
      restaurantItems.forEach(item => {
        if (item.ItemName && item.ItemName.toLowerCase().includes(searchTerm)) {
          results.push(item);
        }
      });
    }
  });
  
  return results;
}

// Function to compare prices for similar items across restaurants
function compareItemPrices(itemName) {
  const results = [];
  const searchTerm = itemName.toLowerCase();
  
  Object.entries(RESTAURANT_DATA).forEach(([restaurantName, items]) => {
    if (Array.isArray(items)) {
      items.forEach(item => {
        if (item.ItemName && item.ItemName.toLowerCase().includes(searchTerm)) {
          results.push({
            ...item,
            RestaurantName: restaurantName
          });
        }
      });
    }
  });
  
  return results.sort((a, b) => (a.Price || 0) - (b.Price || 0));
}

// Export functions for use in other files
if (typeof module !== 'undefined' && module.exports) {
  module.exports = {
    RESTAURANT_DATA,
    CATEGORY_MAPPING,
    getRestaurantsByCategory,
    getRestaurantData,
    searchItems,
    compareItemPrices
  };
}
