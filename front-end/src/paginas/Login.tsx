import type { FormEvent } from 'react';
import { Link, useLocation } from 'react-router-dom';
import Alerta from '../componentes/Alerta';
import Campo from '../componentes/Campo';

type RecadoDoCadastro = { cadastroOk?: boolean } | null;

export default function Login() {
  const recado = useLocation().state as RecadoDoCadastro;

  function aoEnviar(evento: FormEvent<HTMLFormElement>) {
    evento.preventDefault();
  }

  return (
    <div className="container my-5" style={{ maxWidth: '460px' }}>
      <div className="section-title text-center mb-4">
        <h1 className="fw-bold">ENTRAR</h1>
      </div>

      {recado?.cadastroOk && (
        <Alerta tipo="sucesso">Cadastro realizado! Agora é só entrar com o seu e-mail e senha.</Alerta>
      )}

      <form className="card shadow-sm border-0 p-4" onSubmit={aoEnviar}>
        <Campo id="login-email" rotulo="E-mail" tipo="email" valor="" aoMudar={() => undefined} desabilitado />
        <Campo id="login-senha" rotulo="Senha" tipo="password" valor="" aoMudar={() => undefined} desabilitado />
        <button type="submit" className="btn btn-danger w-100" disabled>Entrar</button>
        <p className="text-center text-muted small mt-3 mb-0">O login será ativado na próxima etapa.</p>
      </form>

      <p className="text-center small mt-3">
        Ainda não tem conta? <Link to="/cadastro">Cadastre-se</Link>
      </p>
    </div>
  );
}
