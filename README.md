<div align="center">

# 💊 PharmaLens

### *AI-Powered Decision Support for Pharmaceutical Excellence*

[![React](https://img.shields.io/badge/React-18.3-61DAFB?style=for-the-badge&logo=react&logoColor=white)](https://react.dev/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.0-3178C6?style=for-the-badge&logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-3.4-06B6D4?style=for-the-badge&logo=tailwindcss&logoColor=white)](https://tailwindcss.com/)
[![Vite](https://img.shields.io/badge/Vite-5.0-646CFF?style=for-the-badge&logo=vite&logoColor=white)](https://vitejs.dev/)
[![Supabase](https://img.shields.io/badge/Supabase-Cloud-3FCF8E?style=for-the-badge&logo=supabase&logoColor=white)](https://supabase.com/)

<br/>

[🌐 Live Demo](https://pharmaceutical-assistant.lovable.app) • [📖 Documentation](#-features) • [🚀 Quick Start](#-quick-start)

<br/>

<img src="https://img.shields.io/badge/Status-Active-success?style=flat-square" alt="Status"/>
<img src="https://img.shields.io/badge/License-MIT-blue?style=flat-square" alt="License"/>
<img src="https://img.shields.io/badge/PRs-Welcome-brightgreen?style=flat-square" alt="PRs Welcome"/>

</div>

---

## 🎯 Overview

**PharmaLens** is a cutting-edge multi-agent AI decision support platform designed for pharmaceutical teams across the entire drug development lifecycle. It leverages intelligent agents to monitor, summarize, compare, and alert on healthcare information—enabling faster, smarter business and research decisions.

> ⚠️ **Important**: PharmaLens does NOT handle patient data and does NOT provide medical advice. It focuses exclusively on business intelligence and research support.

---

## ✨ Features

<table>
<tr>
<td width="50%">

### 🤖 Multi-Agent AI System
- **Orchestrator Agent** - Coordinates all agents
- **Research Intelligence** - Monitors publications & trends
- **Clinical Trial Analysis** - Compares trials & endpoints
- **Regulatory/GMP Agent** - Compliance Q&A & alerts

</td>
<td width="50%">

### 📊 Comprehensive Dashboard
- Real-time summary cards
- Agent status monitoring
- Alerts & insights feed
- Performance metrics

</td>
</tr>
<tr>
<td width="50%">

### 🔬 Research Intelligence
- Publication monitoring
- Trend analysis
- AI-powered summaries
- Keyword tracking

</td>
<td width="50%">

### 🧪 Clinical Trial Comparison
- Side-by-side analysis
- Phase/objective tracking
- Endpoint comparison
- Risk assessment

</td>
</tr>
<tr>
<td width="50%">

### 📋 Regulatory Assistant
- Interactive Q&A chat
- Compliance checklists
- Regulatory updates
- Agency monitoring

</td>
<td width="50%">

### 📈 Aggregated Insights
- Executive summaries
- Strategic recommendations
- Market trends
- Cross-domain intelligence

</td>
</tr>
</table>

---

## 🛠️ Tech Stack

<div align="center">

| Category | Technologies |
|----------|-------------|
| **Frontend** | ![React](https://img.shields.io/badge/-React-61DAFB?style=flat-square&logo=react&logoColor=black) ![TypeScript](https://img.shields.io/badge/-TypeScript-3178C6?style=flat-square&logo=typescript&logoColor=white) ![Vite](https://img.shields.io/badge/-Vite-646CFF?style=flat-square&logo=vite&logoColor=white) |
| **Styling** | ![Tailwind CSS](https://img.shields.io/badge/-Tailwind_CSS-06B6D4?style=flat-square&logo=tailwindcss&logoColor=white) ![shadcn/ui](https://img.shields.io/badge/-shadcn/ui-000000?style=flat-square&logo=shadcnui&logoColor=white) |
| **Backend** | ![Supabase](https://img.shields.io/badge/-Supabase-3FCF8E?style=flat-square&logo=supabase&logoColor=white) ![PostgreSQL](https://img.shields.io/badge/-PostgreSQL-4169E1?style=flat-square&logo=postgresql&logoColor=white) |
| **State** | ![TanStack Query](https://img.shields.io/badge/-TanStack_Query-FF4154?style=flat-square&logo=reactquery&logoColor=white) ![React Router](https://img.shields.io/badge/-React_Router-CA4245?style=flat-square&logo=reactrouter&logoColor=white) |
| **Charts** | ![Recharts](https://img.shields.io/badge/-Recharts-22B5BF?style=flat-square&logo=recharts&logoColor=white) |
| **Forms** | ![React Hook Form](https://img.shields.io/badge/-React_Hook_Form-EC5990?style=flat-square&logo=reacthookform&logoColor=white) ![Zod](https://img.shields.io/badge/-Zod-3E67B1?style=flat-square&logo=zod&logoColor=white) |

</div>

---

## 🚀 Quick Start

### Prerequisites

- **Node.js** 18+ 
- **npm** or **bun**

### Installation

```bash
# Clone the repository
git clone https://github.com/your-username/pharmalens.git

# Navigate to project directory
cd pharmalens

# Install dependencies
npm install

# Start development server
npm run dev
```

### Environment Variables

Create a `.env` file in the root directory:

```env
VITE_SUPABASE_URL=your_supabase_url
VITE_SUPABASE_PUBLISHABLE_KEY=your_anon_key
```

---

## 📁 Project Structure

```
pharmalens/
├── 📂 src/
│   ├── 📂 components/
│   │   ├── 📂 agents/          # Agent-specific components
│   │   ├── 📂 layout/          # Header, Navigation, Modals
│   │   ├── 📂 regulatory/      # Chat & compliance components
│   │   └── 📂 ui/              # shadcn/ui components
│   ├── 📂 hooks/               # Custom React hooks
│   ├── 📂 pages/               # Route pages
│   │   ├── 🏠 Landing.tsx      # Welcome & value proposition
│   │   ├── 📊 Dashboard.tsx    # Main overview
│   │   ├── 🔬 Research.tsx     # Publication intelligence
│   │   ├── 🧪 Trials.tsx       # Clinical trial comparison
│   │   ├── 📋 Regulatory.tsx   # Compliance assistant
│   │   └── 📈 Insights.tsx     # Aggregated intelligence
│   ├── 📂 integrations/        # Supabase client & types
│   └── 📂 data/                # Default/mock data
├── 📂 supabase/
│   └── 📂 functions/           # Edge functions
│       ├── aggregate-insights/
│       ├── compare-trials/
│       ├── fetch-research/
│       ├── fetch-trials/
│       └── regulatory-chat/
└── 📂 public/                  # Static assets
```

---

## 🎨 Design System

PharmaLens uses a carefully crafted design system with semantic color tokens:

| Token | Purpose |
|-------|---------|
| `--primary` | Brand actions & highlights |
| `--secondary` | Supporting elements |
| `--accent` | Call-to-action elements |
| `--muted` | Subdued backgrounds |
| `--destructive` | Error states |

**Theme Support**: Light & Dark modes with automatic system preference detection.

---

## 🔐 Authentication

PharmaLens supports:

- ✅ **Email/Password** authentication
- ✅ **Demo Mode** for quick exploration
- ✅ **Role-based access** (Admin, User roles)

---

## 📡 API & Edge Functions

| Function | Description |
|----------|-------------|
| `regulatory-chat` | AI-powered regulatory Q&A |
| `fetch-research` | Research publication fetching |
| `fetch-trials` | Clinical trial data retrieval |
| `compare-trials` | AI trial comparison analysis |
| `aggregate-insights` | Cross-domain insight aggregation |

---

## 🤝 Contributing

Contributions are welcome! Please follow these steps:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

---

## 📄 License

This project is licensed under the **MIT License** - see the [LICENSE](LICENSE) file for details.

---

## 🙏 Acknowledgments

- [shadcn/ui](https://ui.shadcn.com/) for the beautiful component library
- [Lucide Icons](https://lucide.dev/) for the icon set
- [Tailwind CSS](https://tailwindcss.com/) for the utility-first CSS framework

---

<div align="center">

**Built with ❤️ by the PharmaLens Team**

[![Made with Lovable](https://img.shields.io/badge/Made%20with-Lovable-FF69B4?style=for-the-badge)](https://lovable.dev)

</div>
