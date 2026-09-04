import { AiOutlineIdcard } from "react-icons/ai";
import Layout from "../components/Layout";
import { useCatalogData } from "../hooks/useCatalogData";
import { SubscriptionStatus } from "../types/subscription";
import "../styles/catalog.css";

const currencyFormatter = new Intl.NumberFormat("pt-BR", { style: "currency", currency: "BRL" });

export default function PlanosPage() {
  const { plans, subscriptions, loading, error } = useCatalogData();
  const planOrder = new Map([["solo", 0], ["duo", 1], ["família", 2]]);
  const fixedPlans = plans
    .filter((plan) => planOrder.has(plan.name.toLocaleLowerCase("pt-BR")))
    .sort((first, second) => (planOrder.get(first.name.toLocaleLowerCase("pt-BR")) ?? 0) - (planOrder.get(second.name.toLocaleLowerCase("pt-BR")) ?? 0));

  return (
    <Layout title="Planos" icon={AiOutlineIdcard}>
      <section className="catalog-page">
        <header className="catalog-heading">
          <div><h2>Planos disponíveis</h2><p>Compare valores, capacidade e adesão.</p></div>
        </header>

        {error && <p className="catalog-feedback error" role="alert">{error}</p>}
        {loading && <p className="catalog-feedback">Carregando dados da API...</p>}

        <div className="summary-grid">
          <article><span>Total de planos</span><strong>{fixedPlans.length}</strong></article>
          <article><span>Assinaturas ativas</span><strong>{subscriptions.filter((item) => item.status === SubscriptionStatus.Active).length}</strong></article>
        </div>

        <div className="table-card">
          <table className="data-table">
            <thead><tr><th>Plano</th><th>Preço</th><th>Capacidade</th><th>Dependentes permitidos</th><th>Total de assinaturas</th><th>Assinaturas ativas</th></tr></thead>
            <tbody>
              {!loading && fixedPlans.length === 0 && <tr><td colSpan={6}><div className="empty-state"><strong>Nenhum plano encontrado</strong><span>Confira a conexão com a API.</span></div></td></tr>}
              {fixedPlans.map((plan) => {
                const planSubscriptions = subscriptions.filter((item) => item.planId === plan.id);
                const activeSubscriptions = planSubscriptions.filter((item) => item.status === SubscriptionStatus.Active).length;
                return <tr key={plan.id}><td><strong>{plan.name}</strong></td><td>{currencyFormatter.format(plan.price)}</td><td>{plan.maxDependents + 1} {plan.maxDependents === 0 ? "pessoa" : "pessoas"}</td><td>{plan.maxDependents}</td><td>{planSubscriptions.length}</td><td>{activeSubscriptions}</td></tr>;
              })}
            </tbody>
          </table>
        </div>
      </section>
    </Layout>
  );
}
