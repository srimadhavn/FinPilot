# 🚀 FinPilot - AI-Powered Investment Advisory Platform

<div align="center">
  <img src="https://img.shields.io/badge/Next.js-15.2.4-black?style=for-the-badge&logo=next.js" alt="Next.js" />
  <img src="https://img.shields.io/badge/Python-3.11-blue?style=for-the-badge&logo=python" alt="Python" />
  <img src="https://img.shields.io/badge/FastAPI-Latest-green?style=for-the-badge&logo=fastapi" alt="FastAPI" />
  <img src="https://img.shields.io/badge/AI-Gemini-purple?style=for-the-badge&logo=google" alt="Gemini AI" />
  <img src="https://img.shields.io/badge/TypeScript-5.0-blue?style=for-the-badge&logo=typescript" alt="TypeScript" />
</div>

<div align="center">
  <h3>🎯 Revolutionizing Personal Finance with AI-Driven Investment Strategies</h3>
  <p><em>Your Personal Financial Advisor, Powered by Advanced AI</em></p>
</div>

---

## 🌟 **What is FinPilot?**

FinPilot is a cutting-edge, AI-powered investment advisory platform that democratizes financial planning by providing personalized investment strategies tailored to individual goals, risk tolerance, and financial profiles. Built with modern technologies and powered by Google's Gemini AI, FinPilot transforms complex financial decisions into simple, actionable investment plans.

### 🎪 **Live Demo**
- **Frontend**: [http://localhost:3000](http://localhost:3000)
- **Backend API**: [http://localhost:8000](http://localhost:8000)
- **API Documentation**: [http://localhost:8000/docs](http://localhost:8000/docs)

---

## ✨ **Key Features**

### 🤖 **AI-Powered Investment Analysis**
- **Smart Profiling**: Conversational AI that extracts investment preferences through natural language
- **Risk Assessment**: Advanced algorithms analyze risk tolerance and investment goals
- **Personalized Recommendations**: Tailored investment strategies based on individual profiles
- **Real-time Optimization**: Continuous plan adjustments based on market conditions

### 💡 **Intelligent User Experience**
- **Conversational Interface**: Chat-based profile building with natural language processing
- **Visual Plan Generation**: Beautiful, interactive investment plan visualizations
- **Goal-Based Planning**: Investment strategies aligned with specific financial objectives
- **Progress Tracking**: Real-time portfolio performance monitoring

### 🔧 **Technical Excellence**
- **Modern Architecture**: Microservices-based design with React frontend and FastAPI backend
- **API-First Design**: RESTful APIs with comprehensive documentation
- **Type Safety**: Full TypeScript implementation for robust development
- **Responsive Design**: Mobile-first approach with Tailwind CSS

---

## 🏗️ **Architecture Overview**

```
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│                 │    │                 │    │                 │
│   Frontend      │◄──►│   Backend       │◄──►│   AI Services   │
│   (Next.js)     │    │   (FastAPI)     │    │   (Gemini)      │
│                 │    │                 │    │                 │
└─────────────────┘    └─────────────────┘    └─────────────────┘
│                 │    │                 │    │                 │
│ • React 19      │    │ • FastAPI       │    │ • Gemini AI     │
│ • TypeScript    │    │ • Python 3.11   │    │ • NLP           │
│ • Tailwind CSS  │    │ • Pydantic      │    │ • Analysis      │
│ • ShadCN UI     │    │ • Uvicorn       │    │ • Optimization  │
└─────────────────┘    └─────────────────┘    └─────────────────┘
```

---

## 🚀 **Quick Start**

### Prerequisites
- **Node.js** 18+ and **pnpm**
- **Python** 3.11+
- **Google Gemini API Key**

### 1. Clone the Repository
```bash
git clone https://github.com/srimadhavn/FinPilot.git
cd FinPilot
```

### 2. Backend Setup
```bash
cd backend
pip install -r requirements.txt
echo "GEMINI_API_KEY=your_api_key_here" > .env
python main.py
```

### 3. Frontend Setup
```bash
cd frontend
pnpm install
pnpm dev
```

### 4. Access the Application
- 🌐 **Frontend**: http://localhost:3000
- 🔌 **Backend**: http://localhost:8000
- 📚 **API Docs**: http://localhost:8000/docs

---

## 🎯 **User Journey**

### 1. **Smart Profiling** 🧠
Users engage in a conversational experience where AI extracts:
- Monthly investment capacity
- Risk tolerance preferences
- Financial goals (retirement, house, emergency fund)
- Investment experience level

### 2. **AI Analysis** 🔍
Advanced algorithms process user data to:
- Analyze risk-return profiles
- Match investment strategies to goals
- Optimize portfolio allocation
- Generate personalized recommendations

### 3. **Plan Generation** 📊
AI creates comprehensive investment plans featuring:
- Diversified investment options
- Risk-adjusted returns
- Timeline projections
- Actionable recommendations

### 4. **Continuous Optimization** 🔄
Plans adapt based on:
- Market conditions
- User feedback
- Performance tracking
- Goal progression

---

## 🛠️ **Technology Stack**

### **Frontend**
- **Framework**: Next.js 15.2.4 with App Router
- **Language**: TypeScript 5.0
- **Styling**: Tailwind CSS with ShadCN UI
- **State Management**: React Hooks & Context
- **HTTP Client**: Fetch API with error handling

### **Backend**
- **Framework**: FastAPI with async/await
- **Language**: Python 3.11
- **API Documentation**: Swagger/OpenAPI
- **Data Validation**: Pydantic models
- **Server**: Uvicorn ASGI server

### **AI & Intelligence**
- **Primary AI**: Google Gemini API
- **NLP Processing**: Custom text analysis
- **Pattern Recognition**: Regex-based extraction
- **Optimization**: Algorithm-based portfolio balancing

## 🤝 **Contributing**

We welcome contributions! Please see our [Contributing Guidelines](CONTRIBUTING.md) for details.

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 🙏 **Acknowledgments**

- **Google Gemini AI** for providing powerful language models
- **Vercel** for Next.js framework and deployment platform
- **FastAPI** community for excellent Python web framework
- **ShadCN** for beautiful UI components
- **Tailwind CSS** for utility-first styling

---

## 📞 **Support & Contact**

- **GitHub Issues**: [Report bugs or request features](https://github.com/srimadhavn/FinPilot/issues)
- **Documentation**: [Full API Documentation](http://localhost:8000/docs)

---
