# SignVerse 🌐✋
> **A Next-Gen 3D Sign Language Interpreter powered by AI.**

![SignVerse Banner](https://img.shields.io/badge/Status-Production%20Ready-success?style=for-the-badge) ![Developer](https://img.shields.io/badge/Developer-Grishma%20Mahorkar-blue?style=for-the-badge) ![Tech](https://img.shields.io/badge/Tech-React%20|%20Three.js%20|%20Gemini%20AI-00F0FF?style=for-the-badge)

**SignVerse** is a cutting-edge web application that translates English text into American Sign Language (ASL) visualizations in real-time. It features a futuristic, procedurally rigged "Laser Hand" avatar capable of precise, multi-directional gestures, powered by Google's Gemini 2.0 Flash AI.

---

## 👨‍💻 Developer
**Developed by: Grishma Mahorkar**
*   **Role**: Lead Developer & Architect
*   **Vision**: To bridge the communication gap between the deaf and hearing communities using immersive 3D technology and generative AI.

---

## 🚀 Key Features

### 1. 🧠 AI-Powered Translation
*   **Engine**: Utilizes **Google Gemini 2.0 Flash** to convert natural language text into precise ASL Glosses.
*   **Context Aware**: Understands nuance, facial expressions, and non-manual signals required for accurate signing.
*   **Dual-Hand Logic**: Generates independent data for Left and Right hands, including handshapes, positions, and movements.

### 2. 🤖 High-Fidelity 3D Avatar ("Laser Hand")
*   **Multi-Directional Precision**: Hands can orient themselves in 360° (Palm In/Out/Up/Down) and point in any direction (Up/Down/Left/Right/Forward).
*   **Procedural Rigging**: Dynamic finger articulation for complex handshapes (e.g., '8', 'C', 'L', 'Fist', 'Point').
*   **Dual-Hand Rendering**: Fully independent control of both hands for complex signs like "FAMILY", "BOOK", or "HATE".
*   **Aesthetic**: Cyber-futuristic "Neon & Glass" visual style.

### 3. ⏯️ Interactive Learning Mode
*   **Step-by-Step Playback**: Users can step through signs one by one to learn the exact movements.
*   **Smart Overlay**: Displays detailed breakdown of Handshape, Movement, and Facial Expression for each step.
*   **Playback Controls**: Play, Pause, Next, Previous, and Auto-Play functionality.

### 4. ⚡ Performance & Stability
*   **Error-Free Codebase**: Rigorously tested core modules for rendering and API integration.
*   **Optimized Build**: Built with Vite for lightning-fast performance and optimized chunking.
*   **Responsive Design**: Fully responsive UI that works across devices.

---

## 🛠️ Technology Stack

*   **Frontend Framework**: React 18 (TypeScript)
*   **Build Tool**: Vite
*   **3D Engine**: Three.js / React Three Fiber / Drei
*   **AI Integration**: Google Generative AI SDK (Gemini 2.0 Flash)
*   **Styling**: CSS Modules (Glassmorphism & Neon effects)
*   **Icons**: Lucide React

---

## 📦 Installation & Setup

1.  **Clone the repository:**
    ```bash
    git clone https://github.com/GRISHM7890/Signverse.git
    cd Signverse
    ```

2.  **Install dependencies:**
    ```bash
    npm install
    ```

3.  **Set up Environment Variables:**
    *   Create a `.env` file (optional, key is currently embedded for demo purposes but should be secured in production).

4.  **Run the development server:**
    ```bash
    npm run dev
    ```

5.  **Build for production:**
    ```bash
    npm run build
    ```

---

## 🛡️ Code Quality
*   **Type Safety**: Full TypeScript implementation for robust and error-free code.
*   **Modular Architecture**: Clean separation of concerns between UI, 3D Components, and AI Services.
*   **Linting**: ESLint configured for code consistency.

---

© 2025 SignVerse. All Rights Reserved.
