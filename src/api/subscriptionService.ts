import axios from "axios";
import api from "./axios";
import type { ApiErrorResponse, Dependent, LoginResponse, Plan, Subscription, SystemUser } from "../types/subscription";

export function getApiErrorMessage(error: unknown, fallback: string) {
  if (axios.isAxiosError<ApiErrorResponse>(error)) {
    const responseData = error.response?.data;
    if (typeof responseData === "string") return responseData;
    return responseData?.error ?? fallback;
  }
  return fallback;
}

export async function login(loginValue: string, password: string) {
  const { data } = await api.post<LoginResponse>("/users/login", {
    login: loginValue,
    password,
  });
  return data;
}

export async function getSubscriptions(): Promise<Subscription[]> {
  const { data } = await api.get<Subscription[]>("/subscriptions");
  return data;
}

export async function getPlans(): Promise<Plan[]> {
  const { data } = await api.get<Plan[]>("/plans");
  return data;
}

export async function getSystemUsers(): Promise<SystemUser[]> {
  const { data } = await api.get<SystemUser[]>("/users");
  return data;
}

export async function getDependents(): Promise<Dependent[]> {
  const { data } = await api.get<Dependent[]>("/dependents");
  return data;
}

export async function addSystemUser(name: string, email: string) {
  const { data } = await api.post<SystemUser>("/users", { name, email });
  return data;
}

export async function addSubscription(userId: string, planId: string, startDate: string, renewalDate: string, dependentUserIds: string[] = []) {
  const { data } = await api.post<Subscription>("/subscriptions", {
    userId,
    planId,
    startDate,
    renewalDate,
    dependentUserIds,
  });
  return data;
}

export async function updateSubscription(id: string, planId: string, startDate: string, renewalDate: string) {
  const { data } = await api.put<Subscription>(`/subscriptions/${id}`, {
    planId,
    startDate,
    renewalDate,
  });
  return data;
}

export async function cancelSubscription(id: string) {
  const { data } = await api.patch<Subscription>(`/subscriptions/${id}/cancel`);
  return data;
}

export async function addDependent(subscriptionId: string, userId: string) {
  const { data } = await api.post<Dependent>("/dependents", { subscriptionId, userId });
  return data;
}

export async function deleteSubscription(id: string) {
  await api.delete(`/subscriptions/${id}`);
}

export async function deleteSystemUser(id: string) {
  await api.delete(`/users/${id}`);
}

export async function updateDependent(id: string, name: string) {
  const { data } = await api.put<Dependent>(`/dependents/${id}`, { name });
  return data;
}

export async function removeDependent(id: string) {
  await api.delete(`/dependents/${id}`);
}
