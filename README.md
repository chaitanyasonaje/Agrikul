# 🌾 **Agrikul – Smart Agricultural Management Platform**

Agrikul is a **next-generation B2B agricultural platform** that bridges the gap between **farmers and buyers** by offering AI-powered tools, real-time insights, and a seamless marketplace experience. Built with modern web technologies and designed for scalability, Agrikul empowers farmers to make **informed decisions, eliminate middlemen, and access fair pricing.**

---

## 📬 Contact

* **Email:** [chaitanyasonaje0205@gmail.com](mailto:chaitanyasonaje0205@gmail.com)
* **Phone:** +91 80100 83340

---

## 🧠 Tech Stack

### 🚀 Frontend

* **Framework:** Next.js 15 (App Router)
* **Language:** TypeScript
* **Styling:** TailwindCSS + Custom Neomorphic UI
* **State Management:** React Context API
* **Theming:** Dark Mode with soft shadows and neumorphism

### 🛠️ Backend

* **API Routes:** Next.js + Express
* **WebSockets:** Socket.io (real-time features)
* **Database:** MongoDB (via Mongoose)
* **Authentication:** NextAuth.js
* **ML Integration:** Python-based AI for crop recommendation

### ⚙️ DevOps & Tools

* **Build Tool:** Next.js CLI
* **Package Manager:** npm
* **Version Control:** Git (GitHub)

---

## 🌟 Core Features

### 🔐 1. User Authentication & Roles

* Secure login/signup
* Role-based access: **Farmers, Buyers, Admins**
* Profile editing and verification

### 📊 2. Dashboard & Analytics

* Visual sales and performance metrics
* ₹-formatted analytics (INR)
* User activity tracking
* Export options (CSV, PDF)

### 🌱 3. AI Crop Recommendations

* ML-driven suggestions based on:

  * Soil conditions
  * Weather patterns
  * Historical yield data
* Seasonal guidance

### 🛒 4. Marketplace

* Product listing with images, filters & search
* Direct purchase options (B2B focus)
* Ratings & reviews (planned)

### 🌤 5. Real-Time Weather Insights

* Location-based forecasts
* Farming advisories
* Weather alerts & crop risk factors

### 💬 6. Messaging System

* Real-time chat between farmers & buyers
* Notifications & chat history
* Secure conversation encryption

### 📦 7. Order & Transaction Management

* Live order tracking
* Purchase history with invoices
* Role-specific dashboards

### ⚙️ 8. Advanced Settings Panel

* 🔒 Security & Privacy
* 🔔 Notification preferences
* 💳 Payment methods
* ⌨️ API access tokens

### 💳 9. Secure Payments System

* Stripe integration ]
* Multiple payment methods
* Digital receipts and transaction logs

### 📍 10. Nearby Farmers Locator

* Geolocation-based map interface
* Connect with nearby verified producers
* Distance and crop filters

---

## 🧾 Project Structure

```
agrikul/
├── server.js                    # Express server with Socket.io
├── public/                      # Static assets (images/icons)
├── api/                         # ML model integration
│   └── crop_recommendation_model.pkl
├── src/
│   ├── app/                     # App Router pages
│   │   ├── api/                 # API endpoints
│   │   ├── dashboard/           # All main dashboard features
│   │   │   ├── chatbot/         # AI Chatbot interface
│   │   │   ├── crop-recommendations/
│   │   │   ├── market-prices/
│   │   │   ├── messages/
│   │   │   ├── nearby-farmers/
│   │   │   ├── orders/
│   │   │   ├── payments/
│   │   │   ├── products/
│   │   │   ├── profile/
│   │   │   ├── settings/
│   │   │   └── weather/
│   │   └── marketplace/         # Marketplace landing
│   ├── components/              # UI & Functional components
│   ├── lib/                     # Utilities and helpers
│   ├── models/                  # Mongoose models (User, Product, Chat, etc.)
│   └── providers/               # Global context providers
├── tailwind.config.js
├── tsconfig.json
├── next.config.js
└── package.json
```

---

## 🚀 Getting Started

### ✅ Prerequisites

* Node.js (v18+)
* MongoDB instance (local/cloud)

### 🛠️ Setup

1. **Clone the repository**

```bash
git clone https://github.com/chaitanyasonaje/agrikul.git
cd agrikul
```

2. **Install dependencies**

```bash
npm install
```

3. **Configure environment**

```bash
cp .env.example .env.local
# Add MongoDB URI, API keys, etc.
```

4. **Start the server**

```bash
npm run dev
```

5. **Visit**: [http://localhost:3000](http://localhost:3000)

---

## ✨ UI/UX Highlights

* **Custom Neomorphic UI**: A modern aesthetic using soft shadows, dark backgrounds, and 3D-style elements.
* **Mobile-Responsive Design**: Fully optimized for mobile-first users (PWA-ready).
* **Accessible & Intuitive**: WAI-ARIA compliant and keyboard-friendly navigation.

---

## 🔮 Future Enhancements

* 📱 **Mobile App (React Native)**
* 📈 **Advanced Predictive Analytics**
* 🧠 **Improved AI for Pest & Disease Forecasting**
* 🔗 **Blockchain Integration for Supply Chain Traceability**
* 🛍️ **Expanded Marketplace with Wholesale Auctions**

---

## 👨‍💻 Author

**Chaitanya Sonaje**
*B.Tech AIML | Full Stack Developer | AI & Web Enthusiast*

