import { apiGet, apiPost } from "./api";
import { getToken } from "./auth";

export async function investInProject(project_id: number, amount: number) {
  const token = getToken();
  return apiPost("/investor/invest", { project_id, amount }, token);
}

export async function getPortfolio() {
  const token = getToken();
  return apiGet("/investor/portfolio", token);
}

export async function getInvestorTransactions() {
  const token = getToken();
  return apiGet("/investor/transactions", token);
}

export async function getInvestorLedger() {
  const token = getToken();
  return apiGet("/investor/ledger", token);
}

export async function getInvestorRewards() {
  const token = getToken();
  return apiGet("/investor/rewards", token);
}

export function getCertificateDownloadUrl(projectId: number) {
  // Download using browser window.open with Authorization header workaround
  return `http://localhost:5000/api/investor/certificate/${projectId}`;
}

export async function getProjectTokenValue(projectId: number) {
  return apiGet(`/projects/${projectId}/token-value`);
}

export async function getProjectUpdates(projectId: number) {
  return apiGet(`/projects/${projectId}/updates`);
}
