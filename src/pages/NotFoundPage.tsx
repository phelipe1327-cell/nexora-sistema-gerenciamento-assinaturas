import { Link } from "react-router-dom";

export default function NotFoundPage() {
  return (
    <main style={{ padding: "2rem", textAlign: "center" }}>
      <h1>Página não encontrada</h1>
      <p>O endereço informado não existe.</p>
      <Link to="/assinaturas">Voltar para assinaturas</Link>
    </main>
  );
}
