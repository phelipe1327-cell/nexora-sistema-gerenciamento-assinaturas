export const SubscriptionStatus = {
  Active: 1,
  Cancelled: 2,
} as const;

export type SubscriptionStatus =
  (typeof SubscriptionStatus)[keyof typeof SubscriptionStatus];

export interface SystemUser {
  id: string;
  name: string;
  email: string;
}

export interface LoginResponse {
  token: string;
  user: SystemUser;
}

export interface ApiErrorResponse {
  error?: string;
}

export interface Plan {
  id: string;
  name: string;
  price: number;
  maxDependents: number;
}

export interface Subscription {
  id: string;
  userId: string;
  planId: string;
  status: SubscriptionStatus;
  startDate: string;
  renewalDate: string;
}

export interface Dependent {
  id: string;
  subscriptionId: string;
  userId?: string | null;
  name: string;
}
