# Parsona System Architecture

Parsona is architected as a modern, decoupled SaaS application leveraging AI for strategic personal brand intelligence.

```mermaid
graph TD
    subgraph Client_Layer ["Client Layer (Frontend)"]
        React["React 19 / Vite"]
        Tailwind["Tailwind CSS 4.0"]
        Framer["Framer Motion (Animations)"]
        Recharts["Recharts (Data Viz)"]
    end

    subgraph API_Layer ["API Layer (Backend)"]
        Express["Node.js / Express"]
        Auth["JWT / Auth Middleware"]
        Router["API Routing"]
        Ingest["Ingestion Service"]
        Gap["Gap Analysis Service"]
    end

    subgraph Intelligence_Layer ["Intelligence & Data"]
        Gemini["Google Gemini Pro AI"]
        Mongo["MongoDB (Mongoose)"]
        Razorpay["Razorpay Gateway"]
    end

    %% Flow
    React -- HTTP/JSON --> Express
    Express -- Auth Validation --> Auth
    Express -- Analyze Gaps --> Gap
    Gap -- Build Prompt --> Gemini
    Express -- Store Data --> Mongo
    Ingest -- Sync Socials --> Mongo
    Express -- Credits --> Razorpay
```

## Key Components

### 1. Signal Engine
Analyzes raw activity data (LinkedIn) to compute metrics:
- **Consistency**: Frequency and variance of posts.
- **Authority**: Topic focus and industry alignment.
- **Engagement**: Like/Comment ratios and performance trends.

### 2. Gap Analysis Service
Compares current user signals against target persona benchmarks (e.g., "Founder", "CTO"). It identifies the mathematical delta in quantitative metrics.

### 3. AI Strategic Advisor
Uses Gemini Pro to transform raw gap data into actionable, blunt advice. It calculates specific targets the user needs to hit to reach their career goals.
