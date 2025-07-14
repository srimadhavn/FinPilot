# ⚡ FinPilot Frontend - Next.js React Application

<div align="center">
  <img src="https://img.shields.io/badge/Next.js-15.2.4-black?style=for-the-badge&logo=next.js" alt="Next.js" />
  <img src="https://img.shields.io/badge/React-19-blue?style=for-the-badge&logo=react" alt="React" />
  <img src="https://img.shields.io/badge/TypeScript-5.0-blue?style=for-the-badge&logo=typescript" alt="TypeScript" />
  <img src="https://img.shields.io/badge/Tailwind-CSS-38B2AC?style=for-the-badge&logo=tailwind-css" alt="Tailwind CSS" />
  <img src="https://img.shields.io/badge/ShadCN-UI-000000?style=for-the-badge&logo=shadcnui" alt="ShadCN UI" />
</div>

<div align="center">
  <h3>🎨 Modern, Responsive Investment Advisory Interface</h3>
  <p><em>Built with Next.js 15, React 19, TypeScript, and Tailwind CSS</em></p>
</div>

---

## 🌟 **Overview**

The FinPilot frontend is a cutting-edge React application built with Next.js 15 and the App Router. It provides an intuitive, conversational interface for users to interact with AI-powered investment advisory services, featuring modern UI components and seamless user experience.

### 🎯 **Key Features**
- **Conversational UI**: Chat-based investment profiling with natural language processing
- **Modern Design**: Beautiful, responsive interface with Tailwind CSS and ShadCN UI
- **Type-Safe**: Full TypeScript implementation for robust development
- **Performance**: Optimized with Next.js 15 App Router and React 19

---

## 🏗️ **Architecture**

```
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│                 │    │                 │    │                 │
│   Pages/Routes  │◄──►│   Components    │◄──►│   Services      │
│   (App Router)  │    │   (UI/Logic)    │    │   (API Calls)   │
│                 │    │                 │    │                 │
└─────────────────┘    └─────────────────┘    └─────────────────┘
│                 │    │                 │    │                 │
│ • /advisor      │    │ • Chat Interface│    │ • HTTP Client   │
│ • /investment   │    │ • Profile Forms │    │ • Error Handling│
│ • /plan         │    │ • Visualizations│    │ • Type Safety   │
│ • Layout        │    │ • UI Components │    │ • API Integration│
└─────────────────┘    └─────────────────┘    └─────────────────┘
```

---

## 🚀 **Quick Start**

### Prerequisites
- **Node.js 18+**
- **pnpm** (recommended) or **npm**
- **Backend API** running on port 8000

### Installation

1. **Clone and Navigate**
   ```bash
   git clone https://github.com/srimadhavn/FinPilot.git
   cd FinPilot/frontend
   ```

2. **Install Dependencies**
   ```bash
   pnpm install
   # or
   npm install
   ```

3. **Environment Configuration**
   ```bash
   echo "NEXT_PUBLIC_API_URL=http://localhost:8000" > .env.local
   ```

4. **Start Development Server**
   ```bash
   pnpm dev
   # or
   npm run dev
   ```

### 🌐 **Access Points**
- **Application**: http://localhost:3000
- **Advisor Chat**: http://localhost:3000/advisor
- **Investment Plan**: http://localhost:3000/investment-plan

---

## 📁 **Project Structure**

```
frontend/
├── 📁 app/                      # Next.js App Router
│   ├── 📄 layout.tsx           # Root layout component
│   ├── 📄 page.tsx             # Home page
│   ├── 📄 globals.css          # Global styles
│   ├── 📁 advisor/             # Investment advisor chat
│   │   └── 📄 page.tsx         # Chat interface
│   ├── 📁 investment-plan/     # Investment plan viewer
│   │   └── 📄 page.tsx         # Plan visualization
│   └── 📁 api/                 # API route handlers
│       └── 📁 save-profile/    # Profile saving endpoint
├── 📁 components/              # Reusable UI components
│   ├── 📄 theme-provider.tsx   # Theme management
│   └── 📁 ui/                  # ShadCN UI components
├── 📁 lib/                     # Utility functions
│   └── 📄 utils.ts             # Common utilities
├── 📁 hooks/                   # Custom React hooks
├── 📁 public/                  # Static assets
├── 📁 styles/                  # Additional stylesheets
├── 📄 package.json             # Dependencies & scripts
├── 📄 tailwind.config.ts       # Tailwind configuration
├── 📄 next.config.mjs          # Next.js configuration
├── 📄 tsconfig.json            # TypeScript configuration
└── 📄 README.md                # This file
```

---

## 🎨 **Key Pages & Components**

### **Home Page** (`/`)
- **Hero Section**: Compelling introduction to FinPilot
- **Features Overview**: Key platform capabilities
- **Getting Started**: Quick access to advisor chat
- **Modern Design**: Responsive layout with animations

### **Advisor Chat** (`/advisor`)
- **Conversational Interface**: AI-powered investment profiling
- **Real-time Updates**: Live chat with typing indicators
- **Progress Tracking**: Visual progress of profile completion
- **Smart Extraction**: Natural language processing for user inputs

### **Investment Plan** (`/investment-plan`)
- **Visual Analytics**: Interactive charts and graphs
- **Portfolio Breakdown**: Detailed investment allocation
- **Risk Assessment**: Color-coded risk indicators
- **Performance Projections**: Expected returns and timelines

---

## 🧩 **Core Components**

### **Chat Interface**
```tsx
interface ChatMessage {
  id: string
  role: 'user' | 'assistant'
  message: string
  timestamp: Date
}

const ChatInterface: React.FC = () => {
  const [messages, setMessages] = useState<ChatMessage[]>([])
  const [isTyping, setIsTyping] = useState(false)
  // ... chat logic
}
```

### **Profile Progress**
```tsx
interface ProfileProgress {
  completed: number
  total: number
  percentage: number
}

const ProgressIndicator: React.FC<ProfileProgress> = ({
  completed, total, percentage
}) => (
  <div className="flex items-center gap-2">
    <Progress value={percentage} className="flex-1" />
    <span className="text-sm text-muted-foreground">
      {completed}/{total} completed
    </span>
  </div>
)
```

### **Investment Visualization**
```tsx
const InvestmentChart: React.FC<{data: InvestmentData}> = ({ data }) => (
  <ResponsiveContainer width="100%" height={300}>
    <PieChart>
      <Pie
        data={data.options}
        cx="50%"
        cy="50%"
        outerRadius={80}
        fill="#8884d8"
        dataKey="percentage"
      />
      <Tooltip />
      <Legend />
    </PieChart>
  </ResponsiveContainer>
)
```

---

## 🎯 **Features & Functionality**

### **Conversational Investment Profiling**
- **Natural Language Processing**: Users can express investment preferences naturally
- **Smart Extraction**: AI extracts structured data from conversational input
- **Progressive Disclosure**: Questions adapt based on previous responses
- **Real-time Validation**: Instant feedback on user inputs

### **Visual Investment Planning**
- **Interactive Charts**: Pie charts, bar graphs, and progress indicators
- **Risk Visualization**: Color-coded risk levels and breakdown
- **Performance Metrics**: Expected returns, timelines, and projections
- **Responsive Design**: Optimized for all device sizes

### **Modern UI/UX**
- **Dark/Light Theme**: Seamless theme switching
- **Micro-interactions**: Smooth animations and transitions
- **Accessibility**: WCAG compliant with keyboard navigation
- **Mobile-first**: Responsive design for all devices

---

## 🛠️ **Development**

### **Available Scripts**
```bash
# Development server
pnpm dev

# Production build
pnpm build

# Start production server
pnpm start

# Run linter
pnpm lint

# Type checking
pnpm type-check
```

### **Code Quality**
```bash
# ESLint
pnpm lint

# Prettier formatting
pnpm format

# Type checking
pnpm type-check

# Run all checks
pnpm check-all
```

---

## 🎨 **Styling & Design**

### **Tailwind CSS Configuration**
```ts
// tailwind.config.ts
module.exports = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        primary: '#2F4858',
        secondary: '#86BBD8',
        // ... custom colors
      },
    },
  },
  plugins: [require("tailwindcss-animate")],
}
```

### **ShadCN UI Components**
- **Button**: Various styles and sizes
- **Card**: Content containers with shadows
- **Progress**: Progress bars and indicators
- **Dialog**: Modal dialogs and alerts
- **Form**: Input fields and validation

---

## 🔌 **API Integration**

### **HTTP Client**
```ts
const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000'

export const apiClient = {
  async post<T>(endpoint: string, data: any): Promise<T> {
    const response = await fetch(`${API_BASE_URL}${endpoint}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    })
    
    if (!response.ok) {
      throw new Error(`API Error: ${response.status}`)
    }
    
    return response.json()
  }
}
```

### **Type-Safe API Calls**
```ts
interface NextQuestionRequest {
  chatHistory: ChatMessage[]
  currentAnswers: UserAnswers
}

interface NextQuestionResponse {
  message: string
  options: string[] | null
  isComplete: boolean
  updatedAnswers: UserAnswers
}

const getNextQuestion = async (
  request: NextQuestionRequest
): Promise<NextQuestionResponse> => {
  return apiClient.post<NextQuestionResponse>('/api/next-question', request)
}
```

---

## 📱 **Responsive Design**

### **Breakpoints**
- **Mobile**: 320px - 768px
- **Tablet**: 768px - 1024px
- **Desktop**: 1024px+

### **Mobile-First Approach**
```tsx
<div className="
  flex flex-col          // Mobile: stack vertically
  md:flex-row           // Tablet+: side by side
  lg:gap-8              // Desktop: larger gap
  p-4                   // Mobile: small padding
  md:p-6                // Tablet+: medium padding
  lg:p-8                // Desktop: large padding
">
```

---

## 🔧 **Configuration**

### **Environment Variables**
```bash
# .env.local
NEXT_PUBLIC_API_URL=http://localhost:8000
NEXT_PUBLIC_APP_NAME=FinPilot
NODE_ENV=development
```

### **Next.js Configuration**
```js
// next.config.mjs
/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {
    appDir: true,
  },
  images: {
    domains: ['localhost'],
  },
}

export default nextConfig
```

---

## 🎯 **Performance Optimizations**

### **Code Splitting**
- **Dynamic Imports**: Lazy load heavy components
- **Route-based Splitting**: Automatic code splitting per route
- **Component Lazy Loading**: Load components on demand

### **Image Optimization**
```tsx
import Image from 'next/image'

<Image
  src="/hero-image.jpg"
  alt="FinPilot Dashboard"
  width={800}
  height={600}
  priority
  placeholder="blur"
  blurDataURL="data:image/jpeg;base64,..."
/>
```

### **Bundle Analysis**
```bash
# Analyze bundle size
pnpm build
pnpm analyze
```

---

## 🚀 **Deployment**

### **Vercel Deployment**
```bash
# Install Vercel CLI
npm i -g vercel

# Deploy
vercel --prod
```

### **Docker Deployment**
```dockerfile
FROM node:18-alpine AS base
WORKDIR /app
COPY package*.json ./
RUN npm ci --only=production

FROM base AS build
COPY . .
RUN npm run build

FROM base AS runtime
COPY --from=build /app/.next ./.next
COPY --from=build /app/public ./public
EXPOSE 3000
CMD ["npm", "start"]
```

---

## 🧪 **Testing**

### **Unit Testing**
```bash
# Jest & React Testing Library
pnpm test

# With coverage
pnpm test:coverage

# Watch mode
pnpm test:watch
```

### **E2E Testing**
```bash
# Playwright
pnpm test:e2e

# Interactive mode
pnpm test:e2e:ui
```

---

## 🔒 **Security**

### **Input Sanitization**
- **XSS Prevention**: Sanitize user inputs
- **CSRF Protection**: Built-in Next.js protection
- **Content Security Policy**: Configured headers

### **Environment Security**
- **API Key Management**: Environment variables only
- **HTTPS Only**: Production SSL requirements
- **Secure Headers**: Security-focused HTTP headers

---

## 🎨 **Accessibility**

### **WCAG Compliance**
- **Semantic HTML**: Proper heading structure
- **Keyboard Navigation**: Full keyboard accessibility
- **Screen Reader Support**: ARIA labels and descriptions
- **Color Contrast**: WCAG AA compliant colors

### **Accessibility Testing**
```bash
# Axe accessibility testing
pnpm test:a11y

# Lighthouse audits
pnpm audit:lighthouse
```

---

## 🐛 **Troubleshooting**

### **Common Issues**

1. **API Connection Issues**
   ```bash
   # Check backend is running
   curl http://localhost:8000/docs
   ```

2. **Build Errors**
   ```bash
   # Clear Next.js cache
   pnpm clean
   pnpm build
   ```

3. **TypeScript Errors**
   ```bash
   # Check types
   pnpm type-check
   ```

---

## 🤝 **Contributing**

### **Development Workflow**
1. **Fork** the repository
2. **Create** a feature branch
3. **Follow** coding standards
4. **Test** your changes
5. **Submit** a pull request

### **Code Standards**
- **ESLint**: Follow configured rules
- **Prettier**: Consistent code formatting
- **TypeScript**: Full type coverage
- **Components**: Reusable and tested

---

## 📄 **License**

This project is licensed under the MIT License - see the [LICENSE](../LICENSE) file for details.

---

<div align="center">
  <h3>🌟 Built with ❤️ using Next.js and React 🌟</h3>
  <p>Part of the <a href="../README.md">FinPilot</a> ecosystem</p>
</div>
