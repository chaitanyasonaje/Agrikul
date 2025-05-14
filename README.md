# Agrikul - Agricultural Management Platform

Agrikul is a comprehensive agricultural platform designed to connect farmers with buyers, provide crop recommendations, weather insights, and tools for managing agricultural businesses. The platform aims to eliminate middlemen, ensure fair prices for farmers, and provide data-driven farming assistance.

## Contact Information
- Email: chaitanyasonaje0205@gmail.com
- Phone: 8010083340

## Tech Stack

### Frontend
- **Framework**: Next.js 15 with App Router
- **Language**: TypeScript
- **Styling**: TailwindCSS with custom neomorphic UI components
- **State Management**: React Context API
- **UI Components**: Custom components with neomorphic dark theme

### Backend
- **API Routes**: Next.js API routes
- **Server**: Custom Express server with Socket.io
- **Database**: MongoDB with Mongoose
- **Authentication**: NextAuth.js
- **ML Model**: Python-based crop recommendation model

### DevOps
- **Build Tool**: Next.js build system
- **Package Manager**: npm
- **Version Control**: Git

## Features

1. **User Authentication**
   - Secure login/signup system
   - Role-based access control (Farmers, Buyers, Admins)
   - Profile management

2. **Dashboard Analytics**
   - Sales metrics and visualizations
   - Performance indicators with Indian Rupee (₹) currency format
   - User activity tracking
   - Raw data exports

3. **Crop Recommendations**
   - AI-powered crop suggestions based on soil conditions
   - Historical data analysis
   - Seasonal recommendations

4. **Marketplace**
   - Product listings with detailed information
   - Search and filtering capabilities
   - Direct purchasing options

5. **Real-time Weather Information**
   - Location-based weather updates
   - Weather forecasts for farming decisions
   - Weather alerts

6. **Messaging System**
   - Real-time chat between farmers and buyers
   - Conversation management
   - Message notifications

7. **Order Management**
   - Order tracking
   - Transaction history
   - Payment processing

8. **Settings Module**
   - Security & Privacy settings (🔒)
   - Notification preferences (🔔)
   - Payment Methods management (💳)
   - API Access configuration (⌨️)

9. **Payments System**
   - Secure payment processing
   - Multiple payment methods
   - Transaction history

10. **Nearby Farmers Locator**
    - Geolocation-based farmer discovery
    - Connect with local producers

## Project Structure

```
agrikul/
├── .next/                  # Next.js build output
├── .vscode/                # VS Code configuration
├── api/                    # External API integrations
│   └── crop_recommendation_model.pkl  # ML model for crop recommendations
├── node_modules/           # Dependencies
├── public/                 # Static files
│   ├── icons/              # UI icons
│   └── images/             # Static images
├── server.js               # Custom Express server with Socket.io
├── src/
│   ├── app/                # Next.js App Router pages
│   │   ├── api/            # API routes
│   │   ├── auth/           # Authentication pages
│   │   ├── dashboard/      # Dashboard pages and features
│   │   │   ├── chatbot/    # AI chatbot interface
│   │   │   ├── crop-recommendations/  # Crop recommendation system
│   │   │   ├── market-prices/  # Market price information
│   │   │   ├── messages/   # Messaging system
│   │   │   ├── nearby-farmers/  # Farmer location service
│   │   │   ├── orders/     # Order management
│   │   │   ├── payments/   # Payment processing
│   │   │   ├── products/   # Product management
│   │   │   ├── profile/    # User profile management
│   │   │   ├── settings/   # User settings
│   │   │   └── weather/    # Weather information
│   │   ├── marketplace/    # Product marketplace
│   │   ├── globals.css     # Global styles
│   │   ├── layout.tsx      # Root layout
│   │   └── page.tsx        # Home page
│   ├── components/         # Reusable UI components
│   │   ├── analytics/      # Analytics components
│   │   ├── cards/          # Card components
│   │   ├── dashboard/      # Dashboard components
│   │   ├── forms/          # Form components
│   │   ├── layout/         # Layout components
│   │   ├── marketplace/    # Marketplace components
│   │   ├── settings/       # Settings components
│   │   └── ui/             # UI components
│   ├── lib/                # Utility functions
│   │   ├── actions/        # Server actions
│   │   ├── auth/           # Authentication utilities
│   │   ├── db/             # Database utilities
│   │   └── utils/          # Helper functions
│   ├── models/             # MongoDB models
│   │   ├── Chat.ts         # Chat model
│   │   ├── Conversation.ts # Conversation model
│   │   ├── Message.ts      # Message model
│   │   ├── Order.ts        # Order model
│   │   ├── Product.ts      # Product model
│   │   ├── Transaction.ts  # Transaction model
│   │   └── User.ts         # User model
│   └── providers/          # Context providers
├── tailwind.config.js      # Tailwind CSS configuration
├── tsconfig.json           # TypeScript configuration
├── next.config.js          # Next.js configuration
└── package.json            # Project dependencies and scripts
```

## Getting Started

### Prerequisites
- Node.js 18.x or higher
- MongoDB database (local or cloud-based)

### Installation

1. Clone the repository
   ```bash
   git clone https://github.com/yourusername/agrikul.git
   cd agrikul
   ```

2. Install dependencies
   ```bash
   npm install
   ```

3. Set up environment variables
   Create a `.env.local` file with necessary configuration variables.

4. Run the development server
   ```bash
   npm run dev
   ```

5. Open [http://localhost:3000](http://localhost:3000) in your browser

## Key Features Implementation

### Dashboard Analytics
The platform provides comprehensive analytics with performance metrics, sales data, and user activity tracking. All monetary values are displayed in Indian Rupees (₹).

### Neomorphic UI Design
Agrikul features a custom dark theme with neomorphic elements and gradient accents, providing a modern and intuitive user experience.

### Settings Module
The settings section includes Security & Privacy (🔒), Notifications (🔔), Payment Methods (💳), and API Access (⌨️) with intuitive forms and controls.

### MongoDB Integration
The application uses MongoDB for data storage with Mongoose models for structured data management.

## Future Enhancements
- Mobile application
- Advanced analytics and reporting
- Enhanced AI-powered recommendations
- Blockchain-based supply chain tracking
- Expanded marketplace features

---

Made by Chaitanya Sonaje
