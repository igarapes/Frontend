import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MemoryRouter, Route, Routes } from 'react-router-dom';
import { describe, it, expect, vi, beforeEach } from 'vitest';

import { Login } from '../../../src/pages/Login';
import { api } from '../../../src/services/api';

vi.mock('../../../src/services/api');

describe('Integração: Página de Login', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    sessionStorage.clear();
  });

  const renderComponent = () => {
    return render(
      <MemoryRouter initialEntries={['/login']}>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/primeiro-acesso" element={<h1>Tela de Primeiro Acesso</h1>} />
          <Route path="/dashboard" element={<h1>Tela do Dashboard</h1>} />
        </Routes>
      </MemoryRouter>
    );
  };

  const generateFakeToken = (payload) => {
    const base64Payload = btoa(JSON.stringify(payload));
    return `header.${base64Payload}.signature`;
  };

  it('deve realizar login e redirecionar para primeiro acesso', async () => {
    const user = userEvent.setup();
    const fakeToken = generateFakeToken({ primeiro_acesso: true });
    api.post.mockResolvedValue({ data: { token: fakeToken } });

    renderComponent();

    await user.type(screen.getByLabelText(/cpf ou email/i), 'novo@usuario.com');
    await user.type(screen.getByLabelText(/senha/i), 'Senha123!');
    await user.click(screen.getByRole('button', { name: /entrar/i }));

    await waitFor(() => {
      expect(screen.getByText('Tela de Primeiro Acesso')).toBeInTheDocument();
    });
  });

  it('deve realizar login e redirecionar para o dashboard', async () => {
    const user = userEvent.setup();
    const fakeToken = generateFakeToken({ primeiro_acesso: false });
    api.post.mockResolvedValue({ data: { token: fakeToken } });

    renderComponent();

    await user.type(screen.getByLabelText(/cpf ou email/i), 'antigo@usuario.com');
    await user.type(screen.getByLabelText(/senha/i), 'Senha123!');
    await user.click(screen.getByRole('button', { name: /entrar/i }));

    await waitFor(() => {
      expect(screen.getByText('Tela do Dashboard')).toBeInTheDocument();
    });
  });

  it('deve exibir mensagem de erro ao falhar o login', async () => {
    const user = userEvent.setup();
    api.post.mockRejectedValue(new Error('Erro na API'));

    renderComponent();

    await user.type(screen.getByLabelText(/cpf ou email/i), 'teste@teste.com');
    await user.type(screen.getByLabelText(/senha/i), 'Senha123!');
    await user.click(screen.getByRole('button', { name: /entrar/i }));

    await waitFor(() => {
      expect(screen.getByText('Credenciais inválidas. Verifique seus dados e tente novamente.')).toBeInTheDocument();
    });
  });
});