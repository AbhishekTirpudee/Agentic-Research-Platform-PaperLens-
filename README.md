# 🛡️ Secure Agentic Research Platform (PaperLens)

A production-grade, secure AI orchestration platform. PaperLens utilizes **LangGraph** to construct deterministic state machines for academic research, ensuring AI agents operate within strict boundaries without hallucination loops.

## 🚀 Tech Stack & Architecture
* **Frontend:** React.js (Vite), Single Page Application (SPA).
* **Backend:** Node.js, Express.js.
* **AI Orchestration:** `@langchain/langgraph` (State Machine Routing).
* **AI Telemetry:** `LangSmith` (Output Integrity & Audit Trails).
* **Security:** `helmet` (HTTP headers), strict `cors`, Regex Payload Sanitization.

## ☁️ AWS Cloud Security Deployment Blueprint
This application is designed for a **Zero-Trust AWS Cloud** environment:
1. **Edge Defense (AWS WAF):** Traffic is routed through an Application Load Balancer (ALB) protected by AWS WAF. Managed rule sets instantly drop OWASP Top 10 exploits (e.g., XSS) before reaching the compute layer.
2. **Network Isolation (Amazon VPC):** The Express backend runs on AWS Fargate inside a **Private Subnet** with no public IP, rendering it completely inaccessible from the public internet.
3. **Secrets Governance (AWS Secrets Manager):** LangSmith and Foundation Model API keys are never stored in the environment permanently; they are injected dynamically at runtime via IAM Task Roles.

---

## 💻 Local Setup
1. Clone the repository.
2. Install dependencies: `cd frontend && npm install` and `cd backend && npm install`.
3. Create a `.env` file in the `backend` directory with your `LANGCHAIN_API_KEY` and set `LANGCHAIN_TRACING_V2="true"`.
4. Run both servers concurrently:
   * Backend: `npm start` (Runs on port 5000)
   * Frontend: `npm run dev` (Runs on port 5173)
