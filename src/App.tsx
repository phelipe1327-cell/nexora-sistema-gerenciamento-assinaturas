import { BrowserRouter, Routes, Route } from "react-router-dom";
import LoginPage from "./pages/LoginPage";
import AssinaturasPage from "./pages/AssinaturasPage/index";
import PlanosPage from "./pages/PlanosPage";
import UsuariosPage from "./pages/UsuariosPage";
import NotFoundPage from "./pages/NotFoundPage";
import ProtectedRoute from "./components/ProtectedRoute";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<LoginPage />} />
        <Route element={<ProtectedRoute />}>
          <Route path="/assinaturas" element={<AssinaturasPage />} />
          <Route path="/planos" element={<PlanosPage />} />
          <Route path="/usuarios" element={<UsuariosPage />} />
        </Route>
        <Route path="*" element={<NotFoundPage />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
