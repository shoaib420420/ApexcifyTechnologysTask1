# Multivendor E-commerce Platform

A comprehensive multi-vendor e-commerce solution featuring a customer storefront, vendor dashboard, and admin panel.

## 📋 Table of Contents
- [Project Overview](#project-overview)
- [Tech Stack](#tech-stack)
- [Features](#features)
- [Project Structure](#project-structure)
- [Prerequisites](#prerequisites)
- [Installation & Setup](#installation--setup)
- [API Endpoints](#api-endpoints)
- [Configuration](#configuration)
- [License](#license)

## Project Overview
This project is a full-stack e-commerce application designed to support multiple vendors. It includes a backend server built with Node.js and Express, connected to a MongoDB database. The frontend is a responsive web application built with HTML, CSS, and vanilla JavaScript.

> [!NOTE]
> The project currently uses a **Mock Authentication Middleware** for development purposes.

## Tech Stack
- **Frontend**: HTML5, CSS3, JavaScript (Vanilla)
- **Backend**: Node.js, Express.js
- **Database**: MongoDB (Mongoose ODM)
- **Image Storage**: Cloudinary
- **Real-time**: Socket.io

## Features
- **Customer Portal**: Browse products, add to cart, and checkout.
- **Vendor Dashboard**: manage products and settings.
- **Admin Dashboard**: Oversee platform activity, disputes, and users.
- **Shopping Cart**: Fully functional cart management.
- **Order System**: Order placement and tracking.
- **Search & Filter**: Find products by category.

## Project Structure
```
/
├── Backend/            # Node.js/Express Server
│   ├── server.js       # Entry point
│   ├── *Routes.js      # API Route definitions
│   ├── *Model.js       # Mongoose Models
│   └── ...
├── Frontend/           # Static Web Assets
│   ├── index.html      # Main landing page
│   ├── style.css       # Global styles
│   ├── script.js       # Global scripts
│   ├── Admin/          # Admin dashboard pages
│   ├── Vendor/         # Vendor dashboard pages
│   └── Customer/       # Customer pages
├── images/             # Static image assets
└── ...
```

## Prerequisites
- [Node.js](https://nodejs.org/) (v14 or higher)
- [MongoDB](https://www.mongodb.com/try/download/community) (Local or Atlas URI)

## Installation & Setup

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd <project-folder>
   ```

2. **Install Backend Dependencies**
   Navigate to the root directory (where `package.json` is located) and install dependencies.
   ```bash
   npm install
   ```

3. **Configure Environment Variables**
   Create a `.env` file in the `Backend` directory (or root, depending on setup) with the following variables:
   ```env
   MONGO_URI=mongodb://127.0.0.1:27017/task1DB
   PORT=3000
   CLOUDINARY_CLOUD_NAME=your_cloud_name
   CLOUDINARY_API_KEY=your_api_key
   CLOUDINARY_API_SECRET=your_api_secret
   ```

4. **Start the Backend Server**
   ```bash
   npm start
   # OR
   node Backend/server.js
   ```
   The server will start on `http://localhost:3000`.

5. **Run the Frontend**
   Since the frontend is static HTML/JS, you can simply open `Frontend/index.html` in your browser.
   
   *Alternatively*, the backend is configured to serve static files from the `Frontend` directory. You can access the app at `http://localhost:3000`.

## API Endpoints
The backend provides the following RESTful API routes:

- **Products**: `/api/products` (GET, POST, PUT, DELETE)
- **Cart**: `/api/cart` (GET, POST, DELETE)
- **Checkout**: `/api/checkout` (POST)
- **Categories**: `/api/categories`
- **Admin**: `/api/admin`
- **Settings**: `/api/settings`
- **Disputes**: `/api/disputes`

## Configuration
- **Database Connection**: Configured in `Backend/server.js` or `Backend/database.js`.
- **Static Files**: `Backend/server.js` serves the `Frontend` folder statically.

## License
This project is licensed under the ISC License.
