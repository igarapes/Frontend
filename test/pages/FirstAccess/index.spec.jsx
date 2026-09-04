import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MemoryRouter, Route, Routes } from 'react-router-dom';
import { describe, it, expect, vi, beforeEach } from 'vitest';

import { FirstAccess } from '../../../src/pages/FirstAccess';
import { api } from '../../../src/services/api';

vi.mock('../../../src/services/api');

describe('Integração: Página de Primeiro Acesso (Troca de Senha)', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  const renderComponent = () => {
    return render(
      <MemoryRouter initialEntries={['/primeiro-acesso']}>
        <Routes>
          <Route path="/primeiro-acesso" element={<FirstAccess />} />
          <Route path="/dashboard" element={<h1>Tela do Dashboard</h1>} />
        </Routes>
      </MemoryRouter>
    );
  };

  it('deve exibir erro se a senha não atender aos requisitos (fraca)', async () => {
    const user = userEvent.setup();
    renderComponent();

    const inputNovaSenha = screen.getByLabelText(/^Nova Senha$/i);
    const inputConfirmar = screen.getByLabelText(/Confirmar Nova Senha/i);
    const button = screen.getByRole('button', { name: /Salvar Nova Senha/i });

    await user.type(inputNovaSenha, 'fraca');
    await user.type(inputConfirmar, 'fraca');
    
    if (button.disabled) button.removeAttribute('disabled');
    await user.click(button);

    expect(screen.getByText('A senha não atende aos requisitos mínimos de segurança.')).toBeInTheDocument();
  });

  it('deve exibir erro se as senhas não coincidirem', async () => {
    const user = userEvent.setup();
    renderComponent();

    const inputNovaSenha = screen.getByLabelText(/^Nova Senha$/i);
    const inputConfirmar = screen.getByLabelText(/Confirmar Nova Senha/i);
    const button = screen.getByRole('button', { name: /Salvar Nova Senha/i });

    await user.type(inputNovaSenha, 'SenhaForte@123');
    await user.type(inputConfirmar, 'SenhaForte@456');
    
    if (button.disabled) button.removeAttribute('disabled');
    await user.click(button);

    expect(screen.getByText('As senhas digitadas não coincidem.')).toBeInTheDocument();
  });

  it('deve exibir erro retornado pela API', async () => {
    const user = userEvent.setup();
    api.patch.mockRejectedValue({ response: { data: { message: 'Erro do servidor' } } });

    renderComponent();

    const inputNovaSenha = screen.getByLabelText(/^Nova Senha$/i);
    const inputConfirmar = screen.getByLabelText(/Confirmar Nova Senha/i);
    const button = screen.getByRole('button', { name: /Salvar Nova Senha/i });

    await user.type(inputNovaSenha, 'SenhaForte@123');
    await user.type(inputConfirmar, 'SenhaForte@123');
    
    if (button.disabled) button.removeAttribute('disabled');
    await user.click(button);

    await waitFor(() => {
      expect(screen.getByText('Erro do servidor')).toBeInTheDocument();
    });
  });

  it('deve chamar a API e redirecionar ao preencher senhas válidas', async () => {
    const user = userEvent.setup();
    api.patch.mockResolvedValue({ data: { message: 'Senha atualizada' } });

    renderComponent();

    const inputNovaSenha = screen.getByLabelText(/^Nova Senha$/i);
    const inputConfirmar = screen.getByLabelText(/Confirmar Nova Senha/i);
    const button = screen.getByRole('button', { name: /Salvar Nova Senha/i });

    await user.type(inputNovaSenha, 'SenhaForte@123');
    await user.type(inputConfirmar, 'SenhaForte@123');
    
    if (button.disabled) button.removeAttribute('disabled');
    await user.click(button);

    await waitFor(() => {
      expect(screen.getByText('Tela do Dashboard')).toBeInTheDocument();
    }, { timeout: 3000 });
  });
});