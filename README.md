# HealthMate Frontend - Sehat ka Smart Dost

A modern React frontend for HealthMate, an AI-powered health companion app that helps users manage medical reports, track vitals, and get personalized health insights in both English and Roman Urdu.

## 🚀 Features

- **🔐 Authentication**: Secure login/register with JWT tokens
- **📊 Dashboard**: Health overview with quick stats and recent activity
- **📄 Report Upload**: Drag & drop medical report upload with AI analysis
- **💓 Vitals Tracking**: Manual vitals entry with validation
- **📅 Timeline**: Chronological view of all health data
- **👨‍👩‍👧‍👦 Family Management**: Complete family health management
- **🤖 AI Analysis**: Bilingual summaries (English + Roman Urdu)
- **📱 Responsive Design**: Mobile-friendly with Tailwind CSS
- **🌐 Modern Stack**: React 18, Vite, React Router v6

## 🛠️ Tech Stack

- **Frontend**: React 18 with JavaScript (ES6+)
- **Build Tool**: Vite 4.1.14
- **Styling**: Tailwind CSS 4.1.14
- **Routing**: React Router v6
- **HTTP Client**: Axios with interceptors
- **File Upload**: React Dropzone
- **Icons**: Lucide React
- **State Management**: React Context API

## 📋 Prerequisites

- Node.js 16+ 
- npm or yarn
- HealthMate Backend running on http://localhost:5000

## 🚀 Quick Start

### 1. Clone and Install

```bash
# Navigate to frontend directory
cd frontend

# Install dependencies
npm install
```

### 2. Environment Setup

```bash
# Copy environment template
cp .env.example .env

# Edit .env file with your configuration
VITE_API_URL=http://localhost:5000
VITE_APP_NAME=HealthMate - Sehat ka Smart Dost
VITE_APP_VERSION=1.0.0
VITE_DEBUG=true
```

### 3. Start Development Server

```bash
# Start development server
npm run dev

# The app will be available at http://localhost:3000
```

### 4. Build for Production

```bash
# Build for production
npm run build

# Preview production build
npm run preview
```

## 📁 Project Structure

```
frontend/
├── public/                 # Static assets
├── src/
│   ├── components/         # Reusable components
│   │   ├── Header.jsx     # Navigation header
│   │   ├── Footer.jsx     # App footer
│   │   └── ProtectedRoute.jsx # Route protection
│   ├── contexts/          # React contexts
│   │   └── AuthContext.jsx # Authentication context
│   ├── pages/             # Page components
│   │   ├── Login.jsx      # Login page
│   │   ├── Register.jsx   # Registration page
│   │   ├── Dashboard.jsx  # Main dashboard
│   │   ├── Upload.jsx     # Report upload
│   │   ├── VitalsAdd.jsx  # Add vitals form
│   │   ├── Timeline.jsx   # Health timeline
│   │   ├── ReportViewer.jsx # Report details
│   │   └── Family.jsx     # Family management
│   ├── utils/             # Utility functions
│   │   └── api.js         # API client with axios
│   ├── App.jsx            # Main app component
│   ├── main.jsx           # Entry point
│   └── index.css          # Global styles
├── package.json           # Dependencies and scripts
├── vite.config.js        # Vite configuration
├── tailwind.config.js     # Tailwind CSS config
├── postcss.config.js      # PostCSS config
└── .env.example           # Environment template
```

## 🔧 Configuration

### Environment Variables

| Variable | Description | Default |
|----------|-------------|---------|
| `VITE_API_URL` | Backend API URL | `http://localhost:5000` |
| `VITE_APP_NAME` | Application name | `HealthMate - Sehat ka Smart Dost` |
| `VITE_APP_VERSION` | App version | `1.0.0` |
| `VITE_DEBUG` | Debug mode | `true` |

### Tailwind CSS

The project uses Tailwind CSS 4.1.14 with custom configuration:

- **Primary Colors**: Blue-based color scheme
- **Health Colors**: Green, red, yellow for health indicators
- **Custom Components**: Pre-built button, input, and card styles
- **Responsive Design**: Mobile-first approach

## 🔐 Authentication

The app uses JWT-based authentication with the following flow:

1. **Login/Register**: User credentials sent to backend
2. **Token Storage**: JWT stored in localStorage (development only)
3. **Auto-attach**: Axios interceptor adds token to requests
4. **Auto-redirect**: 401 responses redirect to login
5. **Protected Routes**: Components wrapped with `ProtectedRoute`

### Security Note

⚠️ **Production Warning**: The current implementation stores JWT tokens in localStorage for development convenience. In production, this should be replaced with httpOnly cookies for better security.

## 📡 API Integration

The frontend connects to the HealthMate backend with the following endpoints:

### Authentication
- `POST /api/auth/login` - User login
- `POST /api/auth/register` - User registration
- `GET /api/auth/profile` - Get user profile

### Files & Reports
- `POST /api/files/upload` - Upload medical report
- `GET /api/files/reports` - Get user reports
- `GET /api/files/reports/:id` - Get single report
- `DELETE /api/files/reports/:id` - Delete report

### Vitals
- `POST /api/vitals` - Add vitals entry
- `GET /api/vitals` - Get user vitals
- `GET /api/vitals/stats` - Get vitals statistics

### Timeline & Dashboard
- `GET /api/timeline` - Get health timeline
- `GET /api/timeline/dashboard` - Get dashboard data

### Family Management
- `POST /api/family` - Add family member
- `GET /api/family` - Get family members
- `GET /api/family/overview` - Get family overview

## 🎨 UI Components

### Reusable Components

- **Header**: Navigation with user menu and logout
- **Footer**: App credits and disclaimer
- **ProtectedRoute**: Route protection wrapper

### Page Components

- **Login/Register**: Authentication forms with validation
- **Dashboard**: Health overview with quick actions
- **Upload**: Drag & drop file upload with AI analysis
- **VitalsAdd**: Form for manual vitals entry
- **Timeline**: Chronological health data view
- **ReportViewer**: Detailed report with AI insights
- **Family**: Family member management

## 🌐 Internationalization

The app supports bilingual content:

- **English**: Primary language for UI and content
- **Roman Urdu**: AI analysis summaries and health insights
- **Language Toggle**: Switch between languages in AI results
- **RTL Support**: Urdu text with proper direction and alignment

## 📱 Responsive Design

The frontend is fully responsive with:

- **Mobile-first**: Optimized for mobile devices
- **Breakpoints**: sm, md, lg, xl responsive breakpoints
- **Touch-friendly**: Large touch targets and gestures
- **Progressive Enhancement**: Works on all screen sizes

## 🧪 Development

### Available Scripts

```bash
# Development server with hot reload
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview

# Lint code
npm run lint
```

### Code Style

- **ES6+**: Modern JavaScript features
- **Functional Components**: React hooks for state management
- **Async/Await**: Modern async patterns
- **Error Handling**: Comprehensive error boundaries
- **Loading States**: User-friendly loading indicators

## 🚀 Deployment

### Build Process

```bash
# Install dependencies
npm install

# Build for production
npm run build

# The built files will be in the 'dist' directory
```

### Production Considerations

1. **Environment Variables**: Set production API URL
2. **Security**: Replace localStorage with httpOnly cookies
3. **Performance**: Enable gzip compression
4. **CDN**: Serve static assets from CDN
5. **HTTPS**: Use HTTPS in production

## 🔧 Troubleshooting

### Common Issues

1. **API Connection Failed**
   - Check if backend is running on http://localhost:5000
   - Verify CORS settings in backend
   - Check network connectivity

2. **Authentication Issues**
   - Clear localStorage and try logging in again
   - Check JWT token expiration
   - Verify backend authentication endpoints

3. **File Upload Problems**
   - Check file size limits (10MB max)
   - Verify supported file types (PDF, JPG, PNG, GIF)
   - Check Cloudinary configuration

4. **Build Errors**
   - Clear node_modules and reinstall
   - Check Node.js version compatibility
   - Verify all dependencies are installed

### Debug Mode

Enable debug mode by setting `VITE_DEBUG=true` in your `.env` file to see additional logging information.

## 📚 API Documentation

For detailed API documentation, refer to the backend documentation:

- **Backend README**: `/README.md`
- **API Testing Guide**: `/API_TESTING_GUIDE.md`
- **Family API Guide**: `/FAMILY_API_GUIDE.md`

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## 📄 License

This project is part of the HealthMate - Sehat ka Smart Dost application.

## 🆘 Support

For support and questions:

- **Email**: support@healthmate.com
- **GitHub**: github.com/healthmate
- **Documentation**: Check backend documentation

---

**HealthMate - Sehat ka Smart Dost** 🏥✨
*Your AI-powered health companion for better healthcare management*
