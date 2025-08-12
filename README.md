# 📈 Vietnamese Stock Market Platform

<div align="center">

![Vietnam Stock Market](https://img.shields.io/badge/Market-Vietnam-red?style=for-the-badge)
![License](https://img.shields.io/badge/License-MIT-blue?style=for-the-badge)
![React](https://img.shields.io/badge/React-20232A?style=for-the-badge&logo=react&logoColor=61DAFB)
![Node.js](https://img.shields.io/badge/Node.js-43853D?style=for-the-badge&logo=node.js&logoColor=white)
![PostgreSQL](https://img.shields.io/badge/PostgreSQL-316192?style=for-the-badge&logo=postgresql&logoColor=white)

*A professional, full-stack web application for tracking Vietnamese stock market data with real-time insights and portfolio management.*

[🚀 Demo](#demo) • [📚 Documentation](#documentation) • [🛠️ Installation](#installation) • [🤝 Contributing](#contributing)

</div>

## 🌟 Features

### 📊 **Market Data & Analytics**
- **Real-time Stock Prices** - Live updates for Vietnamese stocks (VN-Index, HNX-Index, UpCom)
- **Interactive Charts** - Advanced Chart.js visualizations with technical indicators
- **Market Indices** - Track major Vietnamese exchanges (HSX, HNX, UpCom)
- **Global Markets** - International indices, forex rates (USD/VND), and cryptocurrency prices

### 🔍 **Smart Search & Discovery**
- **Intelligent Stock Search** - Fast symbol and company name lookup
- **Advanced Filtering** - Filter by sector, market cap, volume, and performance
- **Market Insights** - Daily analysis and key market indicators
- **Exchange Listings** - Browse stocks by exchange with detailed metrics

### 👤 **Portfolio Management**
- **Custom Watchlists** - Create and manage multiple portfolios
- **Price Alerts** - Email notifications for target prices
- **Performance Tracking** - Portfolio analytics and P&L tracking
- **Secure Authentication** - JWT-based user management

### 📱 **User Experience**
- **Responsive Design** - Optimized for desktop, tablet, and mobile
- **Real-time Updates** - WebSocket integration for live data
- **Offline Support** - Cached data for improved performance
- **Intuitive Interface** - Clean, modern UI/UX design

## 🛠️ Technology Stack

<table>
<tr>
<td>

**Frontend**
- ⚛️ React 18
- 📊 Chart.js
- 🎨 CSS3 & Responsive Design
- 🔄 Axios for API calls
- 🚀 Modern ES6+ JavaScript

</td>
<td>

**Backend**
- 🟢 Node.js & Express.js
- 🐘 PostgreSQL Database
- 🔐 JWT Authentication
- 🛡️ Security Middleware
- 📡 RESTful API Architecture

</td>
</tr>
<tr>
<td>

**External APIs**
- 📈 EODHD (Stock Data)
- 💱 Exchange Rate APIs
- 🪙 Cryptocurrency APIs
- 📊 Market Data Providers

</td>
<td>

**DevOps & Security**
- 🔒 HTTPS/SSL
- 🛡️ Input Sanitization
- 🔐 Environment Variables
- 📝 Error Logging
- ⚡ Caching Strategies

</td>
</tr>
</table>

## 🚀 Quick Start

### Prerequisites

Ensure you have the following installed:
- **Node.js** (v16.0.0 or later)
- **npm** or **yarn**
- **PostgreSQL** (v12.0 or later)
- **Git**

### Installation

1. **Clone the Repository**
   ```bash
   git clone https://github.com/your-username/vietnamese-stock-market.git
   cd vietnamese-stock-market
   ```

2. **Backend Setup**
   ```bash
   cd backend
   npm install
   ```

3. **Frontend Setup**
   ```bash
   cd ../frontend
   npm install
   ```

4. **Environment Configuration**
   
   Create `.env` file in the backend directory:
   ```env
   # Database Configuration
   DB_HOST=localhost
   DB_PORT=5432
   DB_NAME=stock_market
   DB_USER=your_username
   DB_PASSWORD=your_password
   
   # API Keys
   EODHD_API_KEY=your_eodhd_api_key
   JWT_SECRET=your_jwt_secret_key
   
   # Server Configuration
   PORT=5000
   NODE_ENV=development
   ```

5. **Database Setup**
   ```bash
   cd backend
   npm run db:migrate
   npm run db:seed
   ```

6. **Start the Application**
   
   **Backend Server:**
   ```bash
   cd backend
   npm run dev
   ```
   
   **Frontend Development Server:**
   ```bash
   cd frontend
   npm start
   ```

7. **Access the Application**
   - Frontend: http://localhost:3000
   - Backend API: http://localhost:5000

## 📁 Project Structure

```
vietnamese-stock-market/
├── 📁 frontend/                 # React Application
│   ├── 📁 public/
│   ├── 📁 src/
│   │   ├── 📁 components/       # Reusable UI Components
│   │   ├── 📁 pages/           # Page Components
│   │   ├── 📁 services/        # API Service Layer
│   │   ├── 📁 hooks/           # Custom React Hooks
│   │   ├── 📁 utils/           # Utility Functions
│   │   └── 📁 styles/          # CSS Styles
│   └── 📄 package.json
├── 📁 backend/                  # Node.js/Express Server
│   ├── 📁 config/              # Configuration Files
│   ├── 📁 controllers/         # API Controllers
│   ├── 📁 models/              # Database Models
│   ├── 📁 routes/              # API Routes
│   ├── 📁 services/            # Business Logic
│   ├── 📁 middleware/          # Custom Middleware
│   ├── 📁 utils/               # Helper Functions
│   └── 📄 package.json
├── 📁 docs/                    # Documentation
├── 📄 README.md
├── 📄 .gitignore
└── 📄 LICENSE
```

## 🔧 Available Scripts

### Frontend
```bash
npm start          # Start development server
npm run build      # Build for production
npm test           # Run test suite
npm run lint       # Lint code
```

### Backend
```bash
npm run dev        # Start development server with nodemon
npm start          # Start production server
npm test           # Run test suite
npm run db:migrate # Run database migrations
npm run db:seed    # Seed database with sample data
```

## 🚀 Deployment

### Production Build
```bash
# Build frontend for production
cd frontend
npm run build

# Start backend in production mode
cd ../backend
npm start
```

### Docker Deployment
```bash
# Build and run with Docker Compose
docker-compose up --build
```

## 🤝 Contributing

We welcome contributions! Please see our [Contributing Guidelines](CONTRIBUTING.md) for details.

1. **Fork the repository**
2. **Create a feature branch** (`git checkout -b feature/amazing-feature`)
3. **Commit your changes** (`git commit -m 'Add amazing feature'`)
4. **Push to the branch** (`git push origin feature/amazing-feature`)
5. **Open a Pull Request**

## 📝 API Documentation

### Stock Endpoints
```
GET    /api/stocks/:symbol           # Get stock details
GET    /api/stocks/:symbol/history   # Get historical data
GET    /api/stocks/search/:query     # Search stocks
```

### Market Endpoints
```
GET    /api/market/global           # Global market data
GET    /api/market/insights         # Market insights
GET    /api/market/exchanges        # Exchange listings
```

### User Endpoints
```
POST   /api/auth/register          # User registration
POST   /api/auth/login             # User login
GET    /api/watchlists             # Get user watchlists
POST   /api/watchlists             # Create watchlist
```

## 🛡️ Security Features

- 🔐 **JWT Authentication** - Secure user sessions
- 🛡️ **Input Validation** - SQL injection prevention
- 🔒 **HTTPS Enforcement** - Encrypted data transmission
- 🚫 **Rate Limiting** - API abuse protection
- 🔐 **Environment Variables** - Sensitive data protection

## 📊 Performance Optimizations

- ⚡ **Caching Strategy** - Redis for frequently accessed data
- 🗜️ **Data Compression** - Gzip compression for API responses
- 📱 **Lazy Loading** - Component-based code splitting
- 🔄 **API Optimization** - Efficient database queries

## 🐛 Known Issues & Roadmap

- [ ] Real-time WebSocket implementation
- [ ] Mobile app development
- [ ] Advanced technical analysis tools
- [ ] Multi-language support
- [ ] Dark mode theme

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 👨‍💻 Author

**Laza**
- GitHub: [@laza](https://github.com/laza)
- Email: laza@example.com

## 🙏 Acknowledgments

- Vietnamese stock exchanges for market data
- EODHD for reliable API services
- Open source community for amazing tools and libraries
- Contributors who helped improve this project

---

<div align="center">

**⭐ Star this repository if you find it helpful!**

Made with ❤️ for the Vietnamese investment community

</div>
