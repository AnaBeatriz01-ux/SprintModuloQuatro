import { Navigate, Route, Routes } from 'react-router-dom';
import LayoutSite from './componentes/LayoutSite';
import Cadastro from './paginas/Cadastro';
import Estatisticas from './paginas/Estatisticas';
import Login from './paginas/Login';

export default function App() {
  return (
    <Routes>
      <Route element={<LayoutSite />}>
        <Route path="/cadastro" element={<Cadastro />} />
        <Route path="/login" element={<Login />} />
        <Route path="/estatisticas" element={<Estatisticas />} />
      </Route>

      <Route path="*" element={<Navigate to="/cadastro" replace />} />
    </Routes>
  );
}
