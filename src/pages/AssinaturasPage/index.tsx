import { useMemo, useState } from "react";
import { MdOutlineSubscriptions } from "react-icons/md";
import Layout from "../../components/Layout";
import {
  addDependent,
  addSubscription,
  cancelSubscription,
  deleteSubscription,
  getApiErrorMessage,
  removeDependent,
  updateSubscription,
} from "../../api/subscriptionService";
import { useCatalogData } from "../../hooks/useCatalogData";
import { SubscriptionStatus, type Subscription } from "../../types/subscription";
import "../../styles/catalog.css";

const currencyFormatter = new Intl.NumberFormat("pt-BR", { style: "currency", currency: "BRL" });
const dateFormatter = new Intl.DateTimeFormat("pt-BR", { timeZone: "UTC" });
const fixedPlanNames = new Set(["solo", "duo", "família"]);

type FormMode = "create" | "edit" | null;

function toDateInputValue(date: string) {
  return date.slice(0, 10);
}

export default function AssinaturasPage() {
  const { subscriptions, plans, users, dependents, loading, error, refresh } = useCatalogData();
  const [formMode, setFormMode] = useState<FormMode>(null);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [userId, setUserId] = useState("");
  const [planId, setPlanId] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [dependentUserId, setDependentUserId] = useState("");
  const [newDependentUserIds, setNewDependentUserIds] = useState<string[]>([]);
  const [formError, setFormError] = useState("");
  const [saving, setSaving] = useState(false);

  const fixedPlans = useMemo(
    () => plans.filter((plan) => fixedPlanNames.has(plan.name.toLocaleLowerCase("pt-BR"))),
    [plans],
  );
  const editingSubscription = subscriptions.find((subscription) => subscription.id === editingId);
  const linkedDependents = dependents.filter((dependent) => dependent.subscriptionId === editingId);
  const activeSubscriptionIds = new Set(
    subscriptions.filter((subscription) => subscription.status === SubscriptionStatus.Active).map((subscription) => subscription.id),
  );
  const unavailableUserIds = new Set([
    ...subscriptions.filter((subscription) => subscription.status === SubscriptionStatus.Active).map((subscription) => subscription.userId),
    ...dependents.filter((dependent) => dependent.userId && activeSubscriptionIds.has(dependent.subscriptionId)).map((dependent) => dependent.userId as string),
  ]);
  const eligibleUsers = users.filter((user) => !unavailableUserIds.has(user.id));
  const availableDependentUsers = eligibleUsers.filter(
    (user) => user.id !== userId,
  );
  const selectedPlan = plans.find((plan) => plan.id === planId);
  const dependentLimit = selectedPlan?.maxDependents ?? 0;
  const hasExcessDependents = linkedDependents.length > dependentLimit;
  const activeCount = subscriptions.filter((item) => item.status === SubscriptionStatus.Active).length;

  function resetForm() {
    setFormMode(null);
    setEditingId(null);
    setUserId("");
    setPlanId("");
    setStartDate("");
    setEndDate("");
    setDependentUserId("");
    setNewDependentUserIds([]);
    setFormError("");
  }

  function openCreateForm() {
    setFormMode("create");
    setEditingId(null);
    setUserId("");
    setPlanId("");
    setStartDate("");
    setEndDate("");
    setDependentUserId("");
    setNewDependentUserIds([]);
    setFormError("");
  }

  function openEditForm(subscription: Subscription) {
    setFormMode("edit");
    setEditingId(subscription.id);
    setUserId(subscription.userId);
    setPlanId(subscription.planId);
    setStartDate(toDateInputValue(subscription.startDate));
    setEndDate(toDateInputValue(subscription.renewalDate));
    setDependentUserId("");
    setNewDependentUserIds([]);
    setFormError("");
  }

  async function handleSave(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!userId) return;
    setSaving(true);
    setFormError("");
    try {
      const startDateIso = new Date(startDate).toISOString();
      const endDateIso = new Date(endDate).toISOString();
      if (formMode === "create") {
        await addSubscription(userId, planId, startDateIso, endDateIso, newDependentUserIds.filter(Boolean));
      } else if (editingId) {
        await updateSubscription(editingId, planId, startDateIso, endDateIso);
      }
      resetForm();
      await refresh();
    } catch (requestError) {
      setFormError(getApiErrorMessage(requestError, "Não foi possível salvar a assinatura."));
    } finally {
      setSaving(false);
    }
  }

  async function handleAddDependent(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!editingId || !dependentUserId) return;
    setSaving(true);
    setFormError("");
    try {
      await addDependent(editingId, dependentUserId);
      setDependentUserId("");
      await refresh();
    } catch (requestError) {
      setFormError(getApiErrorMessage(requestError, "Não foi possível vincular o dependente."));
    } finally {
      setSaving(false);
    }
  }

  async function handleRemoveDependent(id: string) {
    if (!window.confirm("Deseja remover este dependente da assinatura?")) return;
    setSaving(true);
    setFormError("");
    try {
      await removeDependent(id);
      await refresh();
    } catch (requestError) {
      setFormError(getApiErrorMessage(requestError, "Não foi possível remover o dependente."));
    } finally {
      setSaving(false);
    }
  }

  async function handleCancelSubscription() {
    if (!editingId || !window.confirm("Deseja cancelar esta assinatura?")) return;
    setSaving(true);
    setFormError("");
    try {
      await cancelSubscription(editingId);
      resetForm();
      await refresh();
    } catch (requestError) {
      setFormError(getApiErrorMessage(requestError, "Não foi possível cancelar a assinatura."));
    } finally {
      setSaving(false);
    }
  }

  async function handleDeleteSubscription(id: string) {
    if (!window.confirm("Deseja excluir esta assinatura e seus dependentes?")) return;
    setSaving(true);
    setFormError("");
    try {
      await deleteSubscription(id);
      if (editingId === id) resetForm();
      await refresh();
    } catch (requestError) {
      setFormError(getApiErrorMessage(requestError, "Não foi possível excluir a assinatura."));
    } finally {
      setSaving(false);
    }
  }

  return (
    <Layout title="Assinaturas" icon={MdOutlineSubscriptions}>
      <section className="catalog-page">
        <header className="catalog-heading">
          <div>
            <h2>Assinaturas cadastradas</h2>
            <p>Acompanhe responsáveis, períodos e vínculos ativos.</p>
          </div>
          <button type="button" className="primary-action" onClick={openCreateForm}>Nova assinatura</button>
        </header>

        {formMode && (
          <section className="subscription-editor" aria-labelledby="subscription-form-title">
            <div className="editor-heading">
              <h3 id="subscription-form-title">{formMode === "create" ? "Nova assinatura" : "Editar assinatura"}</h3>
              <div className="editor-actions">
                {formMode === "edit" && editingSubscription?.status === SubscriptionStatus.Active && <button type="button" className="danger-action" onClick={() => void handleCancelSubscription()} disabled={saving}>{saving ? "Cancelando..." : "Cancelar assinatura"}</button>}
                <button type="button" className="secondary-action" onClick={resetForm} disabled={saving}>Fechar</button>
              </div>
            </div>
            <form className="catalog-form" onSubmit={handleSave}>
              <label>Responsável<select value={userId} onChange={(event) => { const nextUserId = event.target.value; setUserId(nextUserId); setNewDependentUserIds((current) => current.map((id) => id === nextUserId ? "" : id)); }} required disabled={formMode === "edit"}><option value="" disabled>Selecione o responsável</option>{(formMode === "edit" ? users : eligibleUsers).map((user) => <option key={user.id} value={user.id}>{user.name} — {user.email}</option>)}</select></label>
              <label>Plano<select value={planId} onChange={(event) => { const nextPlanId = event.target.value; const nextLimit = plans.find((plan) => plan.id === nextPlanId)?.maxDependents ?? 0; setPlanId(nextPlanId); setNewDependentUserIds((current) => current.slice(0, nextLimit)); }} required><option value="" disabled>Selecione o plano</option>{fixedPlans.map((plan) => <option key={plan.id} value={plan.id}>{plan.name} — {currencyFormatter.format(plan.price)}</option>)}</select></label>
              <label>Data de início<input value={startDate} onChange={(event) => setStartDate(event.target.value)} type="date" required /></label>
              <label>Data de término<input value={endDate} onChange={(event) => setEndDate(event.target.value)} type="date" min={startDate || undefined} required /></label>
              {formMode === "create" && Array.from({ length: dependentLimit }, (_, index) => <label key={index}>Dependente {index + 1} (opcional)<select value={newDependentUserIds[index] ?? ""} onChange={(event) => { const selectedUserId = event.target.value; setNewDependentUserIds((current) => { const next = Array.from({ length: dependentLimit }, (_, itemIndex) => current[itemIndex] ?? ""); next[index] = selectedUserId; return next; }); }}><option value="">Sem dependente</option>{eligibleUsers.filter((user) => user.id !== userId && (!newDependentUserIds.includes(user.id) || newDependentUserIds[index] === user.id)).map((user) => <option key={user.id} value={user.id}>{user.name} — {user.email}</option>)}</select></label>)}
              <button type="submit" className="primary-action" disabled={saving || hasExcessDependents}>{saving ? "Salvando..." : "Salvar assinatura"}</button>
            </form>

            {formMode === "edit" && editingSubscription && (
              <div className="dependent-editor">
                <div>
                  <h3>Dependentes</h3>
                  <p>{selectedPlan?.name ?? "Plano"}: {linkedDependents.length} de {dependentLimit} dependentes vinculados.</p>
                </div>
                {linkedDependents.length > 0 && <ul className="dependent-list">{linkedDependents.map((dependent) => { const dependentUser = users.find((user) => user.id === dependent.userId); return <li key={dependent.id}><span>{dependentUser ? `${dependentUser.name} — ${dependentUser.email}` : dependent.name}</span><button type="button" className="danger-action" onClick={() => void handleRemoveDependent(dependent.id)} disabled={saving}>Excluir dependente</button></li>; })}</ul>}
                {dependentLimit === 0 ? <p className="catalog-feedback">O plano Solo não permite dependentes.</p> : editingSubscription.status !== SubscriptionStatus.Active ? <p className="catalog-feedback">Não é possível adicionar dependentes a uma assinatura cancelada.</p> : linkedDependents.length < dependentLimit && availableDependentUsers.length > 0 && <form className="dependent-form" onSubmit={handleAddDependent}><select value={dependentUserId} onChange={(event) => setDependentUserId(event.target.value)} aria-label="Usuário dependente" required><option value="" disabled>Selecione um usuário</option>{availableDependentUsers.map((user) => <option key={user.id} value={user.id}>{user.name} — {user.email}</option>)}</select><button type="submit" className="primary-action" disabled={saving}>Vincular dependente</button></form>}
                {hasExcessDependents && <p className="catalog-feedback error" role="alert">Remova dependentes antes de salvar este plano.</p>}
              </div>
            )}
          </section>
        )}

        {formError && <p className="catalog-feedback error" role="alert">{formError}</p>}
        {error && <p className="catalog-feedback error" role="alert">{error}</p>}
        {loading && <p className="catalog-feedback">Carregando dados da API...</p>}

        <div className="summary-grid">
          <article><span>Total</span><strong>{subscriptions.length}</strong></article>
          <article><span>Ativas</span><strong>{activeCount}</strong></article>
          <article><span>Canceladas</span><strong>{subscriptions.length - activeCount}</strong></article>
        </div>

        <div className="table-card">
          <table className="data-table">
            <thead><tr><th>Usuário</th><th>Plano</th><th>Valor</th><th>Início</th><th>Término</th><th>Dependentes</th><th>Status</th><th>Ações</th></tr></thead>
            <tbody>
              {!loading && subscriptions.length === 0 && <tr><td colSpan={8}><div className="empty-state"><strong>Nenhuma assinatura cadastrada</strong><span>Crie a primeira assinatura para começar.</span></div></td></tr>}
              {subscriptions.map((subscription) => {
                const user = users.find((item) => item.id === subscription.userId);
                const plan = plans.find((item) => item.id === subscription.planId);
                const dependentCount = dependents.filter((item) => item.subscriptionId === subscription.id).length;
                const isActive = subscription.status === SubscriptionStatus.Active;
                return <tr key={subscription.id}><td><strong>{user?.name ?? "Usuário não encontrado"}</strong><small>{user?.email}</small></td><td>{plan?.name ?? "Plano não encontrado"}</td><td>{plan ? currencyFormatter.format(plan.price) : "—"}</td><td>{dateFormatter.format(new Date(subscription.startDate))}</td><td>{dateFormatter.format(new Date(subscription.renewalDate))}</td><td>{dependentCount} de {plan?.maxDependents ?? 0}</td><td><span className={`status-pill ${isActive ? "active" : "cancelled"}`}>{isActive ? "Ativa" : "Cancelada"}</span></td><td><div className="row-actions"><button type="button" className="secondary-action" onClick={() => openEditForm(subscription)}>Editar</button><button type="button" className="danger-action" onClick={() => void handleDeleteSubscription(subscription.id)} disabled={saving}>Excluir</button></div></td></tr>;
              })}
            </tbody>
          </table>
        </div>
      </section>
    </Layout>
  );
}
