# PriceBite - Food Price Comparison Web App

A modern web application that helps users compare food prices across multiple restaurants including McDonald's, Burger King, Pizza Hut, and Domino's.

## Features

- 🍕 **Multi-Restaurant Comparison** - Compare prices across 4 major food chains
- 🔍 **Smart Search** - Search for food items across all restaurants
- 📱 **Responsive Design** - Works perfectly on desktop and mobile devices
- ⚡ **No File Uploads** - All restaurant data integrated directly into the app
- 🎨 **Modern UI** - Clean, intuitive interface with smooth animations
- 💰 **Price Display** - Clear pricing in Indian Rupees (₹)

## Restaurants Included

- **McDonald's** - Burgers, Fries, Beverages
- **Burger King** - Burgers, Fries, Beverages  
- **Pizza Hut** - Pizzas, Sides, Beverages
- **Domino's** - Pizzas, Sides, Beverages

## Technologies Used

- **HTML5** - Semantic markup
- **CSS3** - Modern styling with Flexbox/Grid
- **JavaScript (ES6+)** - Interactive functionality
- **Responsive Design** - Mobile-first approach

## Getting Started

### Prerequisites

- A modern web browser (Chrome, Firefox, Safari, Edge)
- Optional: Local web server for development

### Installation

1. Clone the repository:
```bash
git clone https://github.com/YOUR_USERNAME/pricebite-food-comparison.git
cd pricebite-food-comparison
```

2. Open the application:
   - **Option 1**: Open `HTML.html` directly in your browser
   - **Option 2**: Use a local server:
     ```bash
     # Using Python
     python -m http.server 8000
     
     # Using Node.js
     npx serve .
     
     # Using PHP
     php -S localhost:8000
     ```

3. Navigate to `http://localhost:8000` in your browser

## Usage

1. **Browse Categories**: Click "Compare Now!" and select a food category (Pizza or Burger)
2. **Select Restaurant**: Choose from available restaurants
3. **View Menu**: See detailed menu with prices, sizes, and descriptions
4. **Search**: Use the search bar to find specific items across all restaurants

## Project Structure

```
├── HTML.html              # Main HTML file
├── app.js                 # Main application logic
├── restaurant_data.js     # Integrated restaurant menu data
├── style.css             # Styling and responsive design
├── merge_restaurants.js   # Data processing script (Node.js)
├── merge_restaurants.py   # Data processing script (Python)
└── README.md             # Project documentation
```

## Data Structure

Each menu item includes:
- **RestaurantName** - Restaurant identifier
- **Category** - Food category (Burgers, Pizza, etc.)
- **ItemName** - Name of the food item
- **Price** - Price in Indian Rupees
- **Size/Variant** - Size or variant information
- **AdditionalInfo** - Item description and details

## Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/new-feature`)
3. Commit your changes (`git commit -am 'Add new feature'`)
4. Push to the branch (`git push origin feature/new-feature`)
5. Create a Pull Request

## Future Enhancements

- [ ] Add more restaurants (KFC, Subway, etc.)
- [ ] Implement price tracking over time
- [ ] Add user reviews and ratings
- [ ] Include nutritional information
- [ ] Add location-based pricing
- [ ] Implement favorites system

## License

This project is open source and available under the [MIT License](LICENSE).

## Contact

For questions or suggestions, please open an issue on GitHub.

---

**Made with ❤️ for food lovers who want the best deals!**
