import axios, { AxiosInstance } from "axios";

const BASE_URL = (import.meta as any)?.env?.VITE_API_URL || "http://localhost:3000";
const TOKEN_KEY = "auth_token";

// Helper to get token for the interceptor
const getAuthToken = () => localStorage.getItem(TOKEN_KEY);

const api: AxiosInstance = axios.create({
  baseURL: BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

// Request Interceptor: Attach JWT to every request
api.interceptors.request.use((config) => {
  const token = getAuthToken();
  if (token && config.headers) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// --- Types (As per your screenshot) ---
export type IdResponse = { id: string };
export type SigninResponse = { id: string; token: string };

export type WorkflowNode = {
  nodeId: string;
  data: { kind: "ACTION" | "TRIGGER"; metadata: any };
  credentials?: any;
  id: string;
  position: { x: number; y: number };
  type: string;
};

export type WorkflowEdge = {
  id: string;
  source: string;
  target: string;
};

export type Workflow = {
  _id: string;
  userId: string;
  nodes: WorkflowNode[];
  edges: WorkflowEdge[];
};

export type Execution = {
  [x: string]: any;

  status: "PENDING" | "SUCCESS" | "FAILURE";
  startTime: Date,
  endTime: Date,

}




// --- Auth Helpers ---
export function setAuthToken(token: string | null) {
  if (token) localStorage.setItem(TOKEN_KEY, token);
  else localStorage.removeItem(TOKEN_KEY);
}

// --- API Methods ---

/**
 * Register a new user
 */
export async function apiSignup(body: { username: string; password: string }): Promise<IdResponse> {
  const res = await api.post<IdResponse>("/signup", body);
  return res.data;
}

/**
 * Sign in and save the token
 */
export async function apiSignin(body: { username: string; password: string }): Promise<SigninResponse> {
  const res = await api.post<SigninResponse>("/signin", body);
  setAuthToken(res.data.token); // Save to localStorage
  return res.data;
}



/**
 * Create a new workflow
 */
export async function apiCreateWorkflow(body: { nodes: any[]; edges: any[] }): Promise<IdResponse> {
  const res = await api.post<IdResponse>("/workflow", body);
  return res.data;
}

/**
 * Update an existing workflow
 */
export async function apiUpdateWorkflow(workflowId: string, body: any): Promise<IdResponse> {
  const res = await api.put<IdResponse>(`/workflow/${workflowId}`, body);
  return res.data;
}

/**
 * Get a specific workflow by ID
 */
export async function apiGetWorkflow(workflowId: string): Promise<Workflow> {
  const res = await api.get<Workflow>(`/workflow/${workflowId}`);
  return res.data;
}

/**
 * List all workflows for the current user
 */
export async function apiListWorkflows(): Promise<Workflow[]> {
  const res = await api.get<Workflow[]>("/workflows");
  return res.data;
}

/**
 * Get execution history for a workflow
 */
export async function apiGetExecutions(workflowId: string): Promise<any[]> {
  const res = await api.get<Execution[]>(`/workflow/executions/${workflowId}`);
  return res.data;
}