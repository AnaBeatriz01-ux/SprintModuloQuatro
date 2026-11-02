import { Link, NavLink } from 'react-router-dom';

const LINKS_DO_MENU = [
  { para: '/cadastro', texto: 'Cadastro' },
  { para: '/estatisticas', texto: 'Estatísticas' },
  { para: '/login', texto: 'Entrar' },
];

export default function Nav() {
  return (
    <nav className="navbar navbar-expand bg-light shadow-sm border-bottom border-danger-subtle">
      <div className="container">
        <Link className="navbar-brand fw-bold text-danger fs-4" to="/cadastro">
          <i className="bi bi-heart-fill me-1"></i> Heartbeasties
        </Link>

        <ul className="navbar-nav fw-semibold">
          {LINKS_DO_MENU.map((link) => (
            <li className="nav-item" key={link.para}>
              <NavLink to={link.para}
                       className={({ isActive }) => `nav-link text-secondary ${isActive ? 'active fw-bold' : ''}`}>
                {link.texto}
              </NavLink>
            </li>
          ))}
        </ul>
      </div>
    </nav>
  );
}
