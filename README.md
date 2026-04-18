<div align="center">

# 🧠 SpectrumSense

### AI-Powered Autism Spectrum Disorder (ASD) Awareness & Early Detection Platform

[![React](https://img.shields.io/badge/React-19.x-61DAFB?style=for-the-badge&logo=react&logoColor=black)](https://react.dev/)
[![Node.js](https://img.shields.io/badge/Node.js-Express-339933?style=for-the-badge&logo=node.js&logoColor=white)](https://nodejs.org/)
[![Python](https://img.shields.io/badge/Python-Flask-3776AB?style=for-the-badge&logo=python&logoColor=white)](https://flask.palletsprojects.com/)
[![Scikit-Learn](https://img.shields.io/badge/Scikit--Learn-ML-F7931E?style=for-the-badge&logo=scikit-learn&logoColor=white)](https://scikit-learn.org/)
[![Vite](https://img.shields.io/badge/Vite-Build-646CFF?style=for-the-badge&logo=vite&logoColor=white)](https://vitejs.dev/)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg?style=for-the-badge)](https://opensource.org/licenses/MIT)

> **"Early detection changes lives."**  
> SpectrumSense is a full-stack, AI-powered web platform that uses a trained Machine Learning model to provide  
> a fast, private, and accessible early-screening tool for Autism Spectrum Disorder.

---

</div>

## 📑 Table of Contents

1. [Overview](#-overview)
2. [Introduction](#-introduction)
3. [Why We Built This](#-why-we-built-this)
4. [Problem Statement](#-problem-statement)
5. [Architecture](#-architecture)
6. [Framework & Technology Stack](#-framework--technology-stack)
7. [Dataset](#-dataset)
8. [How to Install](#-how-to-install)
9. [How to Run](#-how-to-run)
10. [Future Enhancements](#-future-enhancements)
11. [Team](#-team)
12. [Credits](#-credits)

---

## 🌟 Overview

**SpectrumSense** is a three-tier web application that combines a modern React frontend, a Node.js/Express REST API backend, and a Python Flask microservice hosting a trained Random Forest machine-learning model. Together, these layers provide:

- 🎯 **ASD Screening Quiz** — A 10-question AQ-10 behavioural assessment.
- 🤖 **ML-Powered Prediction** — Instant probability score for Autism Spectrum Disorder.
- 📊 **Personal Dashboard** — History of past assessments with rich analytics and charts.
- 🔐 **Secure Authentication** — JWT-based registration and login system.
- 🌐 **Awareness Content** — Educational pages explaining ASD, its signs, and next steps.

---

## 📖 Introduction

Autism Spectrum Disorder (ASD) is a complex neurodevelopmental condition that affects communication, behaviour, and social interaction. Globally, 1 in every 100 children is diagnosed with autism — yet the average age of diagnosis remains disturbingly high due to limited access to professional assessment tools.

**SpectrumSense** bridges this gap by:

- Digitising the clinically validated **AQ-10 screening questionnaire**.
- Feeding responses through a **Random Forest Classifier** trained on real-world ASD data.
- Returning a probability-based likelihood score in **under a second**.
- Providing a seamless, mobile-first user experience that requires no medical background to use.

The platform is **not a diagnostic tool** and does not replace a clinical evaluation. It is designed to increase awareness and motivate early professional consultation.

---

## 💡 Why We Built This

| Challenge | Our Solution |
|-----------|-------------|
| ASD diagnosis takes years on average | Instant AI-powered screening in minutes |
| Professional assessment is expensive & inaccessible | Free, open-access web platform |
| Low public awareness of ASD symptoms | Built-in educational content & results explanation |
| Parents have no early warning system | Behavioural quiz with detailed probability report |
| Stigma prevents people from seeking help | Private, anonymous screening with secure accounts |

We built SpectrumSense because we believe that **access to early information should not be a privilege**. A simple screening tool, powered by machine learning, can be the first step toward getting a child or adult the support they deserve.

---

## ❗ Problem Statement

Despite being one of the most prevalent neurodevelopmental disorders worldwide, ASD remains drastically under-diagnosed and diagnosed too late due to:

1. **Lack of awareness** — Most families do not recognise early behavioural signs of ASD.
2. **High cost of clinical assessment** — Neuropsychological evaluations are expensive and often not covered by insurance in developing nations.
3. **Long waiting times** — Referrals to specialists can take months to years.
4. **Geographical barriers** — Rural communities have little to no access to trained specialists.
5. **No scalable digital screening tool** — Existing online tools are outdated, non-interactive, and do not leverage machine learning.

**SpectrumSense** directly addresses all five barriers by providing a scalable, AI-driven, and completely accessible digital screening experience.

---

## 🏗️ Architecture

SpectrumSense follows a **Microservices / Three-Tier Architecture**:

```
┌──────────────────────────────────────────────────────────────────────┐
│                          USER (Browser)                              │
└───────────────────────────────┬──────────────────────────────────────┘
                                │ HTTP / REST
┌───────────────────────────────▼──────────────────────────────────────┐
│              FRONTEND  ·  React 19 + Vite + TailwindCSS              │
│                        (http://localhost:5173)                       │
│                                                                      │
│  Pages: Landing · Auth · Quiz · Dashboard · Results · About          │
└───────────────┬──────────────────────────────────┬───────────────────┘
                │ /api/auth  /api/results           │ /api/predict
                │                                  │
┌───────────────▼──────────────────┐  ┌────────────▼───────────────────┐
│   BACKEND  ·  Node.js + Express  │  │  ML SERVICE  ·  Python + Flask │
│        (http://localhost:3001)   │ │     (http://localhost:5001)     │
│                                  │  │                                │
│  • JWT Authentication            │  │  • Random Forest Classifier    │
│  • Result persistence (JSON)     │  │  • /predict  POST endpoint     │
│  • Proxy predict calls to ML svc │  │  • /health   GET endpoint      │
└──────────────────────────────────┘  └────────────────────────────────┘
```

### Data Flow

```
User fills Quiz → Frontend POSTs answers → Node API → Flask ML Service
                                                             │
                                                             ▼
                                               Random Forest → Probability
                                                             │
User sees Result ← Frontend ← Node API stores  ←────────────┘
```

---

## 🛠️ Framework & Technology Stack

### Frontend (`/client`)

| Technology | Version | Purpose |
|-----------|---------|---------|
| **React** | 19.x | Component-based UI framework |
| **Vite** | 8.x | Ultra-fast build tool & dev server |
| **TailwindCSS** | 4.x | Utility-first CSS framework |
| **React Router DOM** | 7.x | Client-side routing |
| **Recharts** | 3.x | Dashboard analytics charts |
| **GSAP** | 3.x | Animation library |
| **Lucide React** | 1.x | Icon library |
| **React Circular Progressbar** | 2.x | Probability gauge display |
| **React CountUp** | 6.x | Animated number counters |

### Backend (`/server`)

| Technology | Version | Purpose |
|-----------|---------|---------|
| **Node.js** | LTS | JavaScript runtime |
| **Express** | 5.x | REST API framework |
| **jsonwebtoken** | 9.x | JWT-based authentication |
| **bcryptjs** | 3.x | Password hashing |
| **axios** | 1.x | HTTP client (proxy to ML service) |
| **cors** | 2.x | Cross-Origin Resource Sharing |
| **uuid** | 13.x | Unique ID generation |

### ML Service (`/ml-service`)

| Technology | Version | Purpose |
|-----------|---------|---------|
| **Python** | 3.10+ | ML runtime |
| **Flask** | 3.0.3 | Lightweight API server |
| **Flask-CORS** | 4.0.1 | Cross-origin support |
| **Scikit-Learn** | 1.5.2 | Random Forest model training |
| **Pandas** | 2.2.3 | Data manipulation & preprocessing |
| **NumPy** | 1.26.4 | Numerical computing |
| **Joblib** | 1.4.2 | Model serialisation (`model.pkl`) |

---

## 📊 Dataset

### Source
**UCI Machine Learning Repository — Autism Screening Adult Dataset**  
File: `Autism.csv`

### Description

| Property | Detail |
|----------|--------|
| **Instances** | ~700+ adult screening records |
| **Features** | 21 raw columns |
| **Target Variable** | `Class/ASD` → `YES` / `NO` |
| **Feature Type** | Mix of binary (0/1), categorical, and continuous |

### Key Features Used (18 total after encoding)

| Feature | Description |
|---------|-------------|
| `A1_Score` – `A10_Score` | AQ-10 behavioural screening responses (0 or 1) |
| `age` | Age of the individual (clipped to 100) |
| `gender` | Binary encoded: `m=0`, `f=1` |
| `jundice` | Born with jaundice: `yes=1`, `no=0` |
| `austim` | Family member with ASD: `yes=1`, `no=0` |
| `used_app_before` | Used a screening app before |
| `ethnicity` | Label-encoded categorical |
| `relation` | Who completed the test (Self, Parent, etc.) |
| `contry_of_res` | Country of residence — label-encoded |

### Preprocessing Steps
1. Replace `'?'` → `NaN`
2. Fix age outliers (e.g., 383 → median)
3. Fill missing categorical values with mode
4. Binary encode gender, jundice, austim, used_app_before
5. Label-encode ethnicity, relation, country_of_res
6. 80/20 stratified train-test split

### Model Performance
- **Algorithm**: Random Forest Classifier (200 trees, balanced class weights)
- **Test Accuracy**: ~95%+
- **Serialised Model**: `ml-service/model.pkl`

---

## 📦 How to Install

### Prerequisites

Ensure the following are installed on your system:

| Tool | Minimum Version | Download |
|------|----------------|---------|
| **Node.js** | 18.x LTS | [nodejs.org](https://nodejs.org/) |
| **npm** | 9.x | Bundled with Node.js |
| **Python** | 3.10+ | [python.org](https://www.python.org/) |
| **pip** | 23.x | Bundled with Python |
| **Git** | 2.x | [git-scm.com](https://git-scm.com/) |

---

### Step 1 — Clone the Repository

```bash
git clone https://github.com/MohammadSakibAhmad0874/OpenEnv-AgentOps.git
cd OpenEnv-AgentOps
```

---

### Step 2 — Install Frontend Dependencies

```bash
cd client
npm install
cd ..
```

---

### Step 3 — Install Backend Dependencies

```bash
cd server
npm install
cd ..
```

---

### Step 4 — Install ML Service Dependencies

```bash
cd ml-service
pip install -r requirements.txt
cd ..
```

> 💡 **Tip:** Use a Python virtual environment to avoid dependency conflicts:
> ```bash
> cd ml-service
> python -m venv venv
> # Windows:
> venv\Scripts\activate
> # macOS/Linux:
> source venv/bin/activate
> pip install -r requirements.txt
> cd ..
> ```

---

### Step 5 — Train the Machine Learning Model

> ⚠️ **Required before first run!** The `model.pkl` file must exist for predictions to work.

```bash
cd ml-service
python train.py
cd ..
```

Expected output:
```
Loading dataset...
Dataset shape: (704, 21)
Training Random Forest Classifier...
Test Accuracy: 0.9574
Model saved to ml-service/model.pkl
```

---

## 🚀 How to Run

You need **three terminal windows** running simultaneously.

---

### Terminal 1 — ML Service (Python Flask)

```bash
cd ml-service
python app.py
```

✅ Running at: **http://localhost:5001**

---

### Terminal 2 — Backend API (Node.js + Express)

```bash
cd server
node index.js
```

✅ Running at: **http://localhost:3001**

---

### Terminal 3 — Frontend (React + Vite)

```bash
cd client
npm run dev
```

✅ Running at: **http://localhost:5173**

---

### 🪄 One-Command Setup (from root)

You can also use the root-level npm scripts:

```bash
# Install all dependencies at once
npm run setup

# Or install individually
npm run setup:server
npm run setup:client

# Start services
npm run start:ml      # Starts Flask ML service
npm run start:server  # Starts Node.js API
npm run start:client  # Starts React frontend

# Train / re-train the model
npm run train:ml
```

---

### Windows — Quick Launch with `.bat` file

A `start.bat` script is included for Windows users to launch all services at once:

```bash
# Double-click start.bat, or run from PowerShell:
./start.bat
```

---

### API Endpoints Reference

| Service | Method | Endpoint | Description |
|---------|--------|----------|-------------|
| Backend | `GET` | `/api/health` | Server health check |
| Backend | `POST` | `/api/auth/register` | Register new user |
| Backend | `POST` | `/api/auth/login` | Login and get JWT token |
| Backend | `POST` | `/api/predict` | Submit quiz for prediction |
| Backend | `GET` | `/api/results` | Get user's result history |
| ML Service | `GET` | `/health` | ML service + model status |
| ML Service | `POST` | `/predict` | Direct ML prediction (internal) |

---

## 🔮 Future Enhancements

| Enhancement | Description |
|-------------|-------------|
| 🧒 **Child Screening Mode** | Adapt the AQ-10 questionnaire for parent-reported child assessments |
| 📱 **Mobile App (React Native)** | Extend SpectrumSense to iOS and Android via a native app |
| 🗄️ **Database Integration** | Replace JSON file storage with PostgreSQL / MongoDB for scalability |
| 🌍 **Multi-Language Support** | Internationalise the platform for non-English speaking communities |
| 🧬 **Deep Learning Model** | Experiment with ANN/LSTM models for higher accuracy |
| 🏥 **Clinician Dashboard** | Allow healthcare providers to review patient submissions |
| 📧 **Email Notifications** | Send PDF reports and follow-up reminders via email |
| 🔒 **HIPAA / GDPR Compliance** | Enhance data privacy controls for clinical deployments |
| 📈 **Explainable AI (XAI)** | Show which features most influenced the prediction (SHAP values) |
| ☁️ **Cloud Deployment** | Deploy on Google Cloud Run / AWS for public access |

---

## 👥 Team

<div align="center">

| Member | Role |
|--------|------|
| **Ayush Srivastav** | Full-Stack Developer & ML Integration |
| **Aashutosh Singh** | UI/UX Design & Frontend Development |

</div>

---

## 🏆 Credits

<div align="center">

### 🎨 Design Credit

**`ujjainashutosh-design`**

*UI/UX Design, Visual Identity & Frontend Architecture*

---

### 📦 Open-Source Libraries & Datasets

- [UCI ML Repository — Autism Screening Dataset](https://archive.ics.uci.edu/dataset/426/autism+screening+adult)
- [Scikit-Learn](https://scikit-learn.org/) — Machine Learning
- [React](https://react.dev/) — Frontend Framework
- [Flask](https://flask.palletsprojects.com/) — ML Microservice
- [Express.js](https://expressjs.com/) — Backend REST API
- [Recharts](https://recharts.org/) — Data Visualisation
- [GSAP](https://gsap.com/) — Animations
- [Lucide Icons](https://lucide.dev/) — Icon Pack

---

*Built with ❤️ for a more aware and inclusive world.*

> **Disclaimer:** SpectrumSense is a screening tool for awareness purposes only.  
> It is **not a medical diagnosis** and does not replace professional clinical evaluation.  
> If you have concerns about ASD, please consult a qualified healthcare professional.

</div>
