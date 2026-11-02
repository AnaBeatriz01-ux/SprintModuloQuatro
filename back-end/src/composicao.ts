import { ServicoRelatorio, ServicoUsuario } from '@logica/servicos';
import { ControladorDeRelatorios, ControladorDeUsuarios } from './controladores';
import { CriptografiaBcrypt } from './infra/CriptografiaBcrypt';
import {
  RepositorioDeCategoriasSequelize, RepositorioDeClientesSequelize, RepositorioDePedidosSequelize,
  RepositorioDeProdutosSequelize, RepositorioDeUsuariosSequelize,
} from './repositorios';

export function montarSistema() {
  const repositorios = {
    usuarios: new RepositorioDeUsuariosSequelize(),
    categorias: new RepositorioDeCategoriasSequelize(),
    produtos: new RepositorioDeProdutosSequelize(),
    clientes: new RepositorioDeClientesSequelize(),
    pedidos: new RepositorioDePedidosSequelize(),
  };

  const servicos = {
    usuarios: new ServicoUsuario(repositorios.usuarios, new CriptografiaBcrypt()),
    relatorio: new ServicoRelatorio(repositorios.pedidos, repositorios.produtos, repositorios.categorias),
  };

  const controladores = {
    usuarios: new ControladorDeUsuarios(servicos.usuarios),
    relatorios: new ControladorDeRelatorios(servicos.relatorio),
  };

  return { repositorios, servicos, controladores };
}
