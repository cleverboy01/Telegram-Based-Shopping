# 🛍️ Telegram-Based Shopping

A full-stack e-commerce platform with **Telegram Bot integration** for seamless product management, user authentication, and real-time notifications. Manage your entire shop directly through Telegram!

[![TypeScript](https://img.shields.ps://img.://img.shields.io/badge/Node.js

***

## ✨ Features

### 🔐 Authentication & Authorization
- **Telegram OAuth**: Secure user authentication via Telegram
- **Role-based Access Control**: Admin and regular user permissions
- **Session Management**: Secure token-based authentication

### 📦 Product Management
- **Admin Dashboard**: Full CRUD operations for products
- **Telegram Bot Admin Panel**: Manage products directly from Telegram
- **Category Management**: Organize products by categories
- **Inventory Tracking**: Real-time stock management
- **Image Upload**: Product photos with preview

### 🛒 Shopping Experience
- **Product Catalog**: Browse products with filters and search
- **Shopping Cart**: Add, update, and remove items
- **Wishlist**: Save favorite products
- **Responsive Design**: Optimized for mobile and desktop

### 📱 Telegram Integration
- **Bot Commands**: Manage shop via Telegram bot
- **Real-time Notifications**: Order updates and alerts
- **Admin Control**: Complete shop management from Telegram
- **User Interactions**: Browse and purchase through bot

### 🌐 Multi-language Support
- **Persian (Farsi)**: Full RTL support
- **English**: Complete translation
- **Easy Extension**: i18n ready for more languages

***

## 🚀 Getting Started

### Prerequisites

- **Node.js** (v18 or higher)
- **npm** or **yarn**
- **Telegram Bot Token** (from [@BotFather](https://t.me/BotFather))
- **Your Telegram Chat ID** (from [@userinfobot](https://t.me/userinfobot))

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/cleverboy01/Telegram-Based-Shopping.git
   cd Telegram-Based-Shopping
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   
   Create a `.env` file in the root directory:
   ```env
   VITE_API_URL=http://localhost:3000/api
   BOT_TOKEN=your_telegram_bot_token_here
   MAIN_ADMIN_CHAT_ID=your_telegram_chat_id_here
   ```

4. **Start both frontend and backend**
   ```bash
   npm run dev:all
   ```

   Or start them separately:
   ```bash
   # Terminal 1 - Start backend & bot
   npm run server
   
   # Terminal 2 - Start frontend
   npm run dev
   ```

The app will be available at `http://localhost:5173`

***

## 🤖 Telegram Bot Setup

### Getting Your Bot Token

1. Open Telegram and search for [@BotFather](https://t.me/BotFather)
2. Send `/newbot` and follow the instructions
3. Copy the bot token provided
4. Paste it in your `.env` file as `BOT_TOKEN`

### Getting Your Chat ID

1. Start a chat with [@userinfobot](https://t.me/userinfobot)
2. The bot will send you your Chat ID
3. Copy it and paste in `.env` as `MAIN_ADMIN_CHAT_ID`

### Bot Commands (Admin)

- `/start` - Initialize the bot
- `/addproduct` - Add a new product
- `/listproducts` - View all products
- `/deleteproduct` - Remove a product
- `/orders` - View pending orders
- `/stats` - View shop statistics

### Bot Commands (Users)

- `/start` - Browse products
- `/shop` - View product catalog
- `/cart` - View shopping cart
- `/orders` - View order history
- `/help` - Get help

***

## 📂 Project Structure

```
Telegram-Based-Shopping/
├── src/                    # Frontend source code
│   ├── components/         # React components
│   ├── pages/             # Page components
│   ├── contexts/          # React contexts
│   ├── services/          # API services
│   └── types/             # TypeScript types
├── backend/               # Backend API
│   ├── bot.js            # Telegram bot
│   ├── server.js         # Express server
│   └── database.js       # Database operations
├── public/               # Static assets
└── README.md            # This file
```

***

## 💻 Usage

### For Admins

1. **Web Dashboard**
   - Login with admin credentials
   - Access `/admin` route
   - Manage products, categories, and orders

2. **Telegram Bot**
   - Send commands to your bot
   - Add products with images
   - Monitor orders in real-time
   - View analytics

### For Users

1. **Web Interface**
   - Browse product catalog
   - Add items to cart
   - Checkout and place orders
   - Track order status

2. **Telegram Bot**
   - Browse products
   - Add to cart
   - Complete purchases
   - Receive order updates

***

## 🛠️ Tech Stack

### Frontend
- **React 18** - UI framework
- **TypeScript** - Type safety
- **Vite** - Build tool
- **TailwindCSS** - Styling
- **React Router** - Navigation
- **Zustand** - State management

### Backend
- **Node.js** - Runtime
- **Express** - Web framework
- **SQLite** - Database
- **node-telegram-bot-api** - Telegram integration
- **bcrypt** - Password hashing
- **JWT** - Authentication

***

## 👤 Author

**Mohammad Reza Kazemi**

- GitHub: [@cleverboy01](https://github.com/cleverboy01)
- Portfolio: [my-portfolio-8y5.pages.dev](https://my-portfolio-8y5.pages.dev/)
- Email: mkazemi.contact@gmail.com

***

## 🙏 Acknowledgments

- [Telegram Bot API](https://core.telegram.org/bots/api)
- [React](https://reactjs.org/)
- [Vite](https://vitejs.dev/)
- [TailwindCSS](https://tailwindcss.com/)

***

## 📞 Support

If you have any questions or need help, feel free to:
- Open an issue on GitHub
- Contact via Telegram Bot
- Email: mkazemi.contact@gmail.com

***

⭐ **If you find this project useful, please consider giving it a star!**
