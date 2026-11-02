import { useState } from 'react';
import type { FormEvent } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { cpfEhValido, emailEhValido, formatarCpf, nivelDaSenha } from '@logica/validadores';
import type { NivelDaSenha } from '@logica/validadores';
import { cadastrarUsuario } from '../api/usuarios';
import { ErroDaApi, mensagemDoErro } from '../api/cliente';
import Alerta from '../componentes/Alerta';
import Campo from '../componentes/Campo';

type Campos = 'nome' | 'email' | 'cpf' | 'senha' | 'confirmar';
type Valores = Record<Campos, string>;
type Erros = Partial<Record<Campos, string>>;

const VALORES_INICIAIS: Valores = { nome: '', email: '', cpf: '', senha: '', confirmar: '' };

const FORCA_DA_SENHA: Record<NivelDaSenha, { largura: string; cor: string; texto: string }> = {
  fraca: { largura: '33%', cor: 'bg-danger', texto: 'Senha fraca' },
  media: { largura: '66%', cor: 'bg-warning', texto: 'Senha média' },
  forte: { largura: '100%', cor: 'bg-success', texto: 'Senha forte' },
};

function BarraDeForca({ senha }: { senha: string }) {
  const forca = senha === '' ? null : FORCA_DA_SENHA[nivelDaSenha(senha)];

  return (
    <>
      <div className="progress mt-2" style={{ height: '6px' }}>
        <div className={`progress-bar ${forca ? forca.cor : ''}`} style={{ width: forca ? forca.largura : '0%' }} />
      </div>
      <div className="form-text">
        {forca ? forca.texto : 'Mínimo de 8 caracteres, misturando letras, números e símbolos.'}
      </div>
    </>
  );
}

export default function Cadastro() {
  const navigate = useNavigate();
  const [valores, setValores] = useState<Valores>(VALORES_INICIAIS);
  const [erros, setErros] = useState<Erros>({});
  const [erroGeral, setErroGeral] = useState('');
  const [enviando, setEnviando] = useState(false);

  function mudar(campo: Campos, valor: string) {
    setValores((atual) => ({ ...atual, [campo]: campo === 'cpf' ? formatarCpf(valor) : valor }));
  }

  function validar(): Erros {
    const novosErros: Erros = {};

    if (valores.nome.trim() === '') novosErros.nome = 'O nome é obrigatório.';

    if (valores.email.trim() === '') novosErros.email = 'O e-mail é obrigatório.';
    else if (!emailEhValido(valores.email.trim())) novosErros.email = 'Digite um e-mail válido.';

    if (valores.cpf.trim() === '') novosErros.cpf = 'O CPF é obrigatório.';
    else if (!cpfEhValido(valores.cpf)) novosErros.cpf = 'CPF inválido.';

    if (valores.senha === '') novosErros.senha = 'A senha é obrigatória.';
    else if (nivelDaSenha(valores.senha) === 'fraca') {
      novosErros.senha = 'Senha fraca. Use 8+ caracteres misturando letras, números e símbolos.';
    }

    if (valores.confirmar === '') novosErros.confirmar = 'Confirme a sua senha.';
    else if (valores.confirmar !== valores.senha) novosErros.confirmar = 'As senhas não são iguais.';

    return novosErros;
  }

  function tratarErroDaApi(erro: unknown) {
    const campo = erro instanceof ErroDaApi ? erro.campo : undefined;

    if (campo === 'nome' || campo === 'email' || campo === 'cpf' || campo === 'senha') {
      setErros({ [campo]: mensagemDoErro(erro) });
    } else {
      setErroGeral(mensagemDoErro(erro));
    }
  }

  async function aoEnviar(evento: FormEvent<HTMLFormElement>) {
    evento.preventDefault();
    setErroGeral('');

    const novosErros = validar();
    setErros(novosErros);
    if (Object.keys(novosErros).length > 0) return;

    setEnviando(true);
    try {
      await cadastrarUsuario({
        nome: valores.nome.trim(),
        email: valores.email.trim(),
        cpf: valores.cpf,
        senha: valores.senha,
      });

      navigate('/login', { state: { cadastroOk: true } });
    } catch (e) {
      tratarErroDaApi(e);
      setEnviando(false);
    }
  }

  return (
    <div className="container my-5" style={{ maxWidth: '560px' }}>
      <div className="section-title text-center mb-4">
        <h1 className="fw-bold">CRIE SUA CONTA</h1>
        <p className="text-muted">Preencha tudo abaixo pra entrar na comunidade 💖</p>
      </div>

      {erroGeral && <Alerta tipo="erro">{erroGeral}</Alerta>}

      <form className="card shadow-sm border-0 p-4" onSubmit={aoEnviar} noValidate>
        <Campo id="cad-nome" rotulo="Nome" valor={valores.nome} aoMudar={(v) => mudar('nome', v)}
               erro={erros.nome} autoComplete="name" />
        <Campo id="cad-email" rotulo="E-mail" tipo="email" valor={valores.email} aoMudar={(v) => mudar('email', v)}
               erro={erros.email} autoComplete="email" />
        <Campo id="cad-cpf" rotulo="CPF" valor={valores.cpf} aoMudar={(v) => mudar('cpf', v)}
               erro={erros.cpf} placeholder="000.000.000-00" />
        <Campo id="cad-senha" rotulo="Senha" tipo="password" valor={valores.senha} aoMudar={(v) => mudar('senha', v)}
               erro={erros.senha} autoComplete="new-password">
          <BarraDeForca senha={valores.senha} />
        </Campo>
        <Campo id="cad-confirmar" rotulo="Confirmar senha" tipo="password" valor={valores.confirmar}
               aoMudar={(v) => mudar('confirmar', v)} erro={erros.confirmar} autoComplete="new-password" />

        <button type="submit" className="btn btn-danger w-100 mt-2" disabled={enviando}>
          {enviando ? 'Cadastrando...' : 'Cadastrar'}
        </button>

        <p className="text-center text-muted small mt-3 mb-0">
          Já tem conta? <Link to="/login">Entrar</Link>
        </p>
      </form>
    </div>
  );
}
