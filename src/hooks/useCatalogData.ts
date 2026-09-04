import { useCallback, useEffect, useState } from "react";
import { getApiErrorMessage, getDependents, getPlans, getSubscriptions, getSystemUsers } from "../api/subscriptionService";
import type { Dependent, Plan, Subscription, SystemUser } from "../types/subscription";

export function useCatalogData() {
  const [subscriptions, setSubscriptions] = useState<Subscription[]>([]);
  const [plans, setPlans] = useState<Plan[]>([]);
  const [users, setUsers] = useState<SystemUser[]>([]);
  const [dependents, setDependents] = useState<Dependent[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const refresh = useCallback(async () => {
    setLoading(true);
    setError("");
    try {
      const [subscriptionsData, plansData, usersData, dependentsData] = await Promise.all([
        getSubscriptions(),
        getPlans(),
        getSystemUsers(),
        getDependents(),
      ]);
      setSubscriptions(subscriptionsData);
      setPlans(plansData);
      setUsers(usersData);
      setDependents(dependentsData);
    } catch (requestError) {
      setError(getApiErrorMessage(requestError, "Não foi possível carregar os dados da API."));
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    queueMicrotask(() => void refresh());
  }, [refresh]);

  return { subscriptions, plans, users, dependents, loading, error, refresh };
}
