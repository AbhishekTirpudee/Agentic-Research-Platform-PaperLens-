🛡️ Secure Agentic Research Platform (PaperLens)
A production-grade, secure AI orchestration platform. PaperLens utilizes LangGraph to construct deterministic state machines for academic research, ensuring AI agents operate within strict boundaries without hallucination loops.

🚀 Tech Stack & Architecture
Frontend: React.js (Vite), Single Page Application (SPA).
Backend: Node.js, Express.js.
AI Orchestration: @langchain/langgraph (State Machine Routing).
AI Telemetry: LangSmith (Output Integrity & Audit Trails).
Security: helmet (HTTP headers), strict cors, Regex Payload Sanitization.
☁️ AWS Cloud Security Deployment Blueprint
This application is designed for a Zero-Trust AWS Cloud environment:

Edge Defense (AWS WAF & CloudFront): Traffic is routed through an Application Load Balancer (ALB) protected by AWS WAF. Managed rule sets instantly drop OWASP Top 10 exploits (e.g., XSS) before reaching the compute layer.
Network Isolation (Amazon VPC): The Express backend runs on AWS Fargate inside a Private Subnet with no public IP, rendering it completely inaccessible from the public internet.
Secrets Governance (AWS Secrets Manager): LangSmith and Foundation Model API keys are never stored in the environment permanently; they are injected dynamically at runtime via IAM Task Roles.
💡 Architecture & Security FAQ
Q: Why use LangGraph instead of standard LangChain?

Standard AI chains are linear and prone to infinite execution loops if the LLM becomes confused. By using LangGraph, I built a deterministic state machine. The user input is explicitly routed from a Classification Node to a Research Node via predefined edges. This guarantees predictable API usage and prevents the AI from deviating from its assigned task.

Q: How do you protect the LLM from Prompt Injection?

Defense in depth. Before a payload is ever passed to the LangGraph execution environment, it is intercepted by a custom Node.js middleware layer. Using Regex, the AppSec layer scans for jailbreak patterns (e.g., "ignore previous instructions"). If detected, the request is dropped with a 400 Bad Request instantly.

Q: Why is LangSmith integrated into this project?

In enterprise environments, LLM calls cannot be a "black box." LangSmith provides full telemetry. It logs the exact inputs, the latency of each LangGraph node, and the final output, creating an immutable audit trail for compliance and debugging.

💻 Local Setup
Clone the repository.
Install dependencies: cd frontend && npm install and cd backend && npm install.
Create a .env file in the backend directory with your LANGCHAIN_API_KEY and set LANGCHAIN_TRACING_V2="true".
Run both servers concurrently:
Backend: npm start (Runs on port 5000)
