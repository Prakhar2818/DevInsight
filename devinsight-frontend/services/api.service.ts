import axios from "axios";

const API = axios.create({
  baseURL: "http://localhost:4000",
  headers: {
    "Content-Type": "application/json",
  },
});

/* -------------------------
 REPOSITORY ANALYSIS
--------------------------*/

export const analyzeRepo = (repoUrl: string) =>
  API.post("/repo/analyze", { repoUrl });

export const repoIntelligence = (repoData: any) =>
  API.post("/repo/intelligence", { 
    repoUrl: repoData.repoUrl, 
    structure: repoData.structure || repoData 
  });

export const askRepo = (question: string, repoUrl: string) =>
  API.post("/repo/ask", { question, repoUrl });

/* -------------------------
 DEBUG ASSISTANT
--------------------------*/

export const debugError = (error: string) => API.post("/debug", { error });

/* -------------------------
 FILE EXPLANATION
--------------------------*/

export const explainFile = (code: string) =>
  API.post("/file/explain", { code });

/* -------------------------
 CODE PARSER
--------------------------*/

export const analyzeParser = (code: string) =>
  API.post("/parser/analyze", { code });

/* -------------------------
 DOCUMENTATION GENERATOR
--------------------------*/

export const generateDocs = (repoUrl: string) =>
  API.post("/docs/generate", { repoUrl });

/* -------------------------
 DIAGRAM GENERATOR
--------------------------*/

export const generateDiagram = (structure: any) =>
  API.post("/diagram/generate", { structure });
