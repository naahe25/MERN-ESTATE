# HomeSphere 🏠

A modern, full-stack real estate application built with the MERN stack (MongoDB, Express, React, Node.js) and enhanced with Vite, Tailwind CSS, Redux, and Firebase authentication.

## Getting Started:

**Live-Deployed-link:** https://homesphere-mwim.onrender.com

---

## Installation & Setup Steps (Follow in Order)

### 1. Vite Client Setup

```bash
npm create vite@latest client
cd client
npm install
```

### 2. TailwindCSS Setup

```bash
npm install tailwindcss @tailwindcss/vite
npm install -D tailwindcss postcss autoprefixer
```

### 3. React Plugin (if missing)

```bash
npm install @vitejs/plugin-react
```

### 4. Tailwind Config (optional for v3, skip for v4)

```bash
npx tailwindcss init -p
```

### 5. For Different Page Routes (Inside Client folder)

```bash
npm run build
npm i react-router-dom
npm i react-icons
npm i mongoose
npm install @reduxjs/toolkit react-redux
npm i redux-persist
npm install firebase
```

### 6. Installing (Mern-estate folder)

```bash
npm i express
npm i nodemon
npm i mongoose
npm i mongodb
npm i dotenv
npm i bcryptjs
npm i jsonwebtoken
```

### 7. Run Development Server

```bash
npm run dev
```

---

## Tech Stack

### Frontend
- **Vite** - Next generation frontend tooling
- **React** - UI library
- **Tailwind CSS** - Utility-first CSS framework
- **React Router DOM** - Client-side routing
- **Redux Toolkit** - State management
- **Redux Persist** - State persistence
- **React Icons** - Icon library
- **Firebase** - Authentication & backend services

### Backend
- **Node.js** - Runtime environment
- **Express.js** - Web framework
- **MongoDB** - NoSQL database
- **Mongoose** - MongoDB object modeling
- **BCryptJS** - Password hashing
- **JWT** - JSON Web Tokens for authentication
- **Dotenv** - Environment variable management
- **Nodemon** - Development server auto-reload

---

## Project Structure

```
HomeSphere/
├── client/                    # Frontend application (Vite + React)
│   ├── src/
│   │   ├── components/       # React components
│   │   ├── pages/            # Page components
│   │   ├── redux/            # Redux store & slices
│   │   ├── App.jsx
│   │   └── main.jsx
│   ├── vite.config.js        # Vite configuration
│   ├── tailwind.config.js    # Tailwind CSS configuration
│   └── package.json
│
├── api/                       # Backend application (Mern-estate folder)
│   ├── models/               # Mongoose schemas
│   ├── routes/               # API routes
│   ├── controllers/          # Route controllers
│   ├── middleware/           # Custom middleware
│   ├── .env                  # Environment variables
│   ├── server.js             # Entry point
│   └── package.json
│
└── README.md                  # This file
```

---

## Environment Configuration

Create a `.env` file in your backend folder with the following variables:

```env
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret_key
FIREBASE_API_KEY=your_firebase_api_key
FIREBASE_AUTH_DOMAIN=your_firebase_auth_domain
FIREBASE_PROJECT_ID=your_firebase_project_id
NODE_ENV=development
PORT=3000
```

---

## Features

✨ **User Authentication**
- Secure JWT-based authentication
- Firebase integration for modern auth flows
- Password hashing with BCryptJS

🏘️ **Property Management**
- Create, read, update, and delete property listings
- MongoDB-powered data persistence
- Real-time data updates with Redux

🎨 **Modern UI/UX**
- Responsive design with Tailwind CSS
- Icon library integration with React Icons
- Smooth routing and navigation with React Router

📱 **State Management**
- Redux Toolkit for predictable state management
- Redux Persist for localStorage persistence
- Seamless async operations with Redux middleware

🔐 **Security**
- Secure API endpoints with JWT authentication
- Password encryption with BCryptJS
- Environment variable protection with Dotenv

⚡ **Performance**
- Fast development server with Vite
- Optimized production builds
- Efficient module loading

---

## Getting Started Quick Guide

1. Clone the repository:
```bash
git clone https://github.com/naahe25/HomeSphere.git
cd HomeSphere
```

2. Follow the installation steps listed above in **serial order (Steps 1-7)**

3. Configure environment variables in `.env` file

4. Start the development server:
```bash
npm run dev
```

5. Open your browser and navigate to `http://localhost:5173`

---

## Available Scripts

| Command | Description |
|---------|-------------|
| `npm run dev` | Start development server with hot module reload |
| `npm run build` | Build optimized production bundle |
| `npm run preview` | Preview production build locally |
| `npm run lint` | Run ESLint (if configured) |

---

## API Endpoints

Your backend provides endpoints for:
- **Authentication** - Login, register, logout, token refresh
- **Properties** - Create, read, update, delete listings
- **Users** - Profile management, user data
- **Search** - Search and filter properties by location, price, etc.

---

## Contributing

Contributions are welcome! Please follow these steps:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

---

## Troubleshooting

**Issue: Port already in use**
- Change the port in your `.env` file

**Issue: MongoDB connection error**
- Verify your `MONGO_URI` in `.env` file

**Issue: Firebase authentication not working**
- Check Firebase credentials in `.env` file

---

## Support

For questions or issues, please open an issue on the [GitHub repository](https://github.com/naahe25/HomeSphere).

---

## License

This project is licensed under the MIT License - see the LICENSE file for details.

---

**Built with ❤️ by MD Naahe Uddin Laskar**

**Happy Coding! 🚀**
