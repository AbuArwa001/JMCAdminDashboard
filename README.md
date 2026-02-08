# JMC Admin Dashboard

![Project Status](https://img.shields.io/badge/status-active-success.svg)
![Next.js](https://img.shields.io/badge/Next.js-14-black)
![TypeScript](https://img.shields.io/badge/TypeScript-5.0-blue)
![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-3.4-38B2AC)

## 📖 Overview

The **JMC Admin Dashboard** is a comprehensive, modern administrative interface designed for the Jamia Mosque Committee (JMC). It serves as the central hub for managing the organization's digital operations, providing powerful tools for donation tracking, member management, and real-time analytics.

Built with performance and scalability in mind, this application leverages the power of **Next.js 14** (App Router) and **Firebase** to deliver a seamless, reactive user experience.

## ✨ Key Features

- **📊 Real-time Analytics**: Interactive charts and data visualization using `recharts` to monitor donation trends and user engagement.
- **🔐 Robust Authentication**: Secure role-based access control (RBAC) implemented with `next-auth` and `firebase-admin`.
- **👥 Member Management**: efficient tools to view, search, and manage community members and staff.
- **💰 Donation Tracking**: Detailed transaction logs and financial reporting dashboards.
- **📂 Data Export**: Native support for exporting reports to Excel (`xlsx`) for offline analysis.
- **🎨 Modern UI/UX**: A polished, responsive interface built with `Tailwind CSS`, `Framer Motion` animations, and `Sonner` notifications.

## 🛠️ Tech Stack

- **Framework**: [Next.js 14](https://nextjs.org/) (App Router)
- **Language**: [TypeScript](https://www.typescriptlang.org/)
- **Styling**: [Tailwind CSS](https://tailwindcss.com/) & [Clsx](https://github.com/lukeed/clsx)
- **Authentication**: [NextAuth.js](https://next-auth.js.org/) & [Firebase Auth](https://firebase.google.com/)
- **Backend/Database Integration**: [Firebase Admin SDK](https://firebase.google.com/docs/admin/setup)
- **State Management & Forms**: React Hook Form
- **UI Components**: Lucide React Icons
- **HTTP Client**: Axios

## 🚀 Getting Started

Follow these steps to set up the project locally.

### Prerequisites

- Node.js (v18 or higher recommended)
- npm or yarn

### Installation

1.  **Clone the repository**

    ```bash
    git clone https://github.com/AbuArwa001/JMCAdminDashboard.git
    cd JMCAdminDashboard
    ```

2.  **Install dependencies**

    ```bash
    npm install
    # or
    yarn install
    ```

3.  **Environment Configuration**
    Create a `.env.local` file in the root directory and configure the following variables:

    ```env
    # NextAuth Provider Secrets
    AUTH_SECRET=your_auth_secret

    # Firebase Service Account Config
    FIREBASE_PROJECT_ID=your_project_id
    FIREBASE_CLIENT_EMAIL=your_client_email
    FIREBASE_PRIVATE_KEY=your_private_key

    # Public API Keys
    NEXT_PUBLIC_API_URL=http://localhost:8000
    ```

4.  **Run the Development Server**
    ```bash
    npm run dev
    ```
    Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

## 📂 Project Structure

```bash
├── app/                # Next.js App Router pages and layouts
├── components/         # Reusable UI components
├── lib/                # Utility functions and library configurations
├── hooks/              # Custom React hooks
├── public/             # Static assets
└── types/              # TypeScript type definitions
```

## 🤝 Contributing

Contributions are welcome! Please follow these steps:

1.  Fork the repository.
2.  Create your feature branch (`git checkout -b feature/AmazingFeature`).
3.  Commit your changes (`git commit -m 'Add some AmazingFeature'`).
4.  Push to the branch (`git push origin feature/AmazingFeature`).
5.  Open a Pull Request.

## 📄 License

This project is proprietary software. All rights reserved by **Jamia Mosque Committee**.
