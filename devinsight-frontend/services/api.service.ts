import axios from "axios";

const API = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:4000",
  headers: {
    "Content-Type": "application/json",
  },
});

API.interceptors.request.use((config) => {
  if (typeof window !== "undefined") {
    const token = localStorage.getItem("token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
  }
  return config;
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

export const askRepo = (question: string, repoUrl: string, selectedFile?: string) => {
  const allStructuresStr = localStorage.getItem("allRepoStructures") || "{}";
  let allStructures = {};
  try { allStructures = JSON.parse(allStructuresStr); } catch(e) {}

  let structure = {};
  if (allStructures[repoUrl]) {
    structure = allStructures[repoUrl].structure || allStructures[repoUrl];
  } else {
    const structureRaw = localStorage.getItem("repoStructure");
    if (structureRaw) {
      const parsed = JSON.parse(structureRaw);
      structure = parsed.structure || parsed;
    }
  }
  return API.post("/repo/ask", { question, repoUrl, selectedFile, structure });
};

export const getRepoHistory = () => 
  API.get("/repo/history");

export const getChatHistory = (repoUrl: string, filePath?: string) => {
  const url = `/repo/chat/${encodeURIComponent(repoUrl)}`;
  return filePath ? API.get(`${url}?filePath=${encodeURIComponent(filePath)}`) : API.get(url);
};

/* -------------------------
 DEBUG ASSISTANT
--------------------------*/

export const debugError = (error: string) => API.post("/debug", { error });

/* -------------------------
 FILE EXPLANATION & BROWSER
--------------------------*/

export const getFileTree = (repoPath: string) =>
  API.get("/file/tree", { params: { repoPath } });

export const getFileContent = (filePath: string) =>
  API.get("/file/content", { params: { filePath } });

export const explainFile = (code: string) =>
  API.post("/file/explain", { code });

/* -------------------------
 CODE PARSER
--------------------------*/

export const analyzeParser = (repoPath: string) =>
  API.post("/parser/analyze", { repoPath });

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
