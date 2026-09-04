import { useState } from "react";
import { FiUsers } from "react-icons/fi";
import Layout from "../components/Layout";
import { addSystemUser, deleteSystemUser, getApiErrorMessage } from "../api/subscriptionService";
import { useCatalogData } from "../hooks/useCatalogData";
import { SubscriptionStatus } from "../types/subscription";
import "../styles/catalog.css";

export default function UsuariosPage() {
  const { users, subscriptions, loading, error, refresh } = useCatalogData();
  const [showForm, setShowForm] = useState(false);
  const [formError, setFormError] = useState("");
  const [saving, setSaving] = useState(false);

  async function handleCreate(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const formElement = event.currentTarget;
    const form = new FormData(formElement);
    const name = String(form.get("name")).trim();
    const email = String(form.get("email")).trim();

    if (users.some((user) => user.email.toLowerCase() === email.toLowerCase())) {
      setFormError("Este e-mail já está cadastrado.");
      return;
    }

    setSaving(true);
    setFormError("");
    try {
      await addSystemUser(name, email);
      formElement.reset();
      setShowForm(false);
      await refresh();
    } catch (requestError) {
      setFormError(getApiErrorMessage(requestError, "Não foi possível criar o usuário."));
    } finally {
      setSaving(false);
    }
  }

  async function handleDelete(id: string, name: string) {
    if (!window.confirm(`Deseja excluir o usuário ${name}? As assinaturas dele também serão excluídas.`)) return;
    setSaving(true);
    setFormError("");
    try {
      await deleteSystemUser(id);
      await refresh();
    } catch (requestError) {
      setFormError(getApiErrorMessage(requestError, "Não foi possível excluir o usuário."));
    } finally {
      setSaving(false);
    }
  }

  return (
    <Layout title="Usuários" icon={FiUsers}>
      <section className="catalog-page">
        <header className="catalog-heading">
          <div><h2>Pessoas cadastradas</h2><p>Gerencie responsáveis e dependentes da operação.</p></div>
          <button type="button" className="primary-action" onClick={() => setShowForm((visible) => !visible)}>Novo usuário</button>
        </header>

        {showForm && <form className="catalog-form" onSubmit={handleCreate}><input name="name" placeholder="Nome" required /><input name="email" type="email" placeholder="E-mail" required /><button type="submit" className="primary-action" disabled={saving}>{saving ? "Salvando..." : "Salvar"}</button></form>}
        {formError && <p className="catalog-feedback error" role="alert">{formError}</p>}
        {error && <p className="catalog-feedback error" role="alert">{error}</p>}
        {loading && <p className="catalog-feedback">Carregando dados da API...</p>}

        <div className="summary-grid">
          <article><span>Total de usuários</span><strong>{users.length}</strong></article>
          <article><span>Com assinatura ativa</span><strong>{users.filter((user) => subscriptions.some((item) => item.userId === user.id && item.status === SubscriptionStatus.Active)).length}</strong></article>
        </div>

        <div className="table-card">
          <table className="data-table">
            <thead><tr><th>Nome</th><th>E-mail</th><th>Assinaturas</th><th>Assinaturas ativas</th><th>Ações</th></tr></thead>
            <tbody>
              {!loading && users.length === 0 && <tr><td colSpan={5}><div className="empty-state"><strong>Nenhuma pessoa cadastrada</strong><span>Adicione a primeira pessoa para começar.</span></div></td></tr>}
              {users.map((user) => {
                const userSubscriptions = subscriptions.filter((item) => item.userId === user.id);
                const active = userSubscriptions.filter((item) => item.status === SubscriptionStatus.Active).length;
                return <tr key={user.id}><td><strong>{user.name}</strong><small>{user.id}</small></td><td>{user.email}</td><td>{userSubscriptions.length}</td><td>{active}</td><td><button type="button" className="danger-action" onClick={() => void handleDelete(user.id, user.name)} disabled={saving}>Excluir</button></td></tr>;
              })}
            </tbody>
          </table>
        </div>
      </section>
    </Layout>
  );
}
