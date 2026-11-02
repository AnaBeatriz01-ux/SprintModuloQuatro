import type { Request, Response } from 'express';
import type { DadosDeUsuario, ServicoUsuario } from '@logica/servicos';

export class ControladorDeUsuarios {
  constructor(private readonly servico: ServicoUsuario) {}

  cadastrar = async (req: Request, res: Response): Promise<void> => {
    const usuario = await this.servico.cadastrar(req.body as DadosDeUsuario);
    res.status(201).json(usuario.paraJSON());
  };
}
