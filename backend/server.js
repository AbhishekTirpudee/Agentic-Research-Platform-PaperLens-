import express from 'express';
import helmet from 'helmet';
import cors from 'cors';
import 'dotenv/config'; 
import { StateGraph, Annotation } from "@langchain/langgraph";

const app = express();

// 1. APPSEC MIDDLEWARE
app.use(helmet()); // Secures HTTP headers
app.use(cors({ origin: 'http://localhost:5173' })); // Prevents unauthorized domain access
app.use(express.json({ limit: '10kb' })); // Prevents massive payload DoS attacks

// 2. INPUT SANITIZATION
function isInputSafe(query) {
    if (!query || typeof query !== 'string' || query.length > 200) return false;
    // Block prompt injections trying to hijack the agent
    const injectionPattern = /(system_prompt|ignore previous instructions|override node)/i;
    return !injectionPattern.test(query);
}

// 3. LANGGRAPH ARCHITECTURE
const GraphState = Annotation.Root({
    query: Annotation(),
    routingTag: Annotation(),
    agentOutput: Annotation(),
});

const classificationNode = async (state) => {
    const currentQuery = state.query.toLowerCase();
    const tag = (currentQuery.includes("crypto") || currentQuery.includes("security")) 
        ? "security" : "general";
    return { routingTag: tag }; 
};

const researchNode = async (state) => {
    const tag = state.routingTag;
    const output = tag === "security" 
        ? `[Security Router] Analyzed Cloud Sec/Crypto papers for: "${state.query}"` 
        : `[General Router] Compiled academic literature for: "${state.query}"`;
    return { agentOutput: output }; 
};

// Compile deterministic workflow
const workflow = new StateGraph(GraphState)
    .addNode("classifier", classificationNode)
    .addNode("researcher", researchNode)
    .addEdge("__start__", "classifier")
    .addEdge("classifier", "researcher")
    .addEdge("researcher", "__end__");

const graph = workflow.compile();

// 4. SECURE API ENDPOINT
app.post('/api/research', async (req, res) => {
    const { query } = req.body;

    if (!isInputSafe(query)) {
        return res.status(400).json({ error: 'Unsafe or malicious research payload blocked.' });
    }

    try {
        // Triggers LangGraph execution. LangSmith tracks this automatically via .env!
        const finalState = await graph.invoke({ query: query });
        res.json({ status: "Success", data: finalState.agentOutput });
    } catch (error) {
        res.status(500).json({ error: "Graph runtime error." });
    }
});

app.listen(5000, () => console.log('PaperLens Secure Backend running on port 5000'));