import { apiGet, apiPost, apiPostFormData } from "./api";

function issuerToken() {
  return localStorage.getItem("token") || "";
}

export async function getIssuerProjects() {
  return apiGet("/issuer/projects", issuerToken());
}

export async function createIssuerProject(data: Record<string, unknown>) {
  return apiPost("/issuer/projects", data, issuerToken());
}

export async function submitMilestoneProof(milestoneId: number, proof_url: string) {
  return apiPost(`/issuer/milestones/${milestoneId}/submit`, { proof_url }, issuerToken());
}

export async function uploadProjectDocument(
  projectId: number,
  payload: { file_url: string; filename: string; doc_type: string; description?: string }
) {
  return apiPost(`/issuer/projects/${projectId}/documents`, payload, issuerToken());
}

export async function postProjectUpdate(
  projectId: number,
  data: {
    description: string;
    media_type?: string;
    media_url?: string;
    latitude?: number;
    longitude?: number;
  }
) {
  return apiPost(`/issuer/projects/${projectId}/updates`, data, issuerToken());
}
