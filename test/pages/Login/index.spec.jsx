import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MemoryRouter, Route, Routes } from 'react-router-dom';
import { describe, it, expect, vi, beforeEach } from 'vitest';

import { Login } from '../../../src/pages/Login';
import * as authService from '../../../src/services/auth';
import { decodeJWT } from '../../../src/utils/jwt';

vi.mock('../../../src/services/auth');
vi.mock('../../../src/utils/jwt');

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

  it('deve realizar login e redirecionar para primeiro acesso se a flag for verdadeira', async () => {
    const user = userEvent.setup();

    vi.mocked(decodeJWT).mockReturnValue({ primeiro_acesso: true });
    authService.loginService.mockResolvedValue({ token: 'fake-token' });

    renderComponent();

    await user.type(screen.getByLabelText(/cpf ou email/i), 'novo@usuario.com');
    await user.type(screen.getByLabelText(/senha/i), 'Senha123!');
    await user.click(screen.getByRole('button', { name: /entrar/i }));

    await waitFor(() => {
      expect(screen.getByText('Tela de Primeiro Acesso')).toBeInTheDocument();
    });
  });

  it('deve realizar login e redirecionar para o dashboard se a flag for falsa', async () => {
    const user = userEvent.setup();

    vi.mocked(decodeJWT).mockReturnValue({ primeiro_acesso: false });
    authService.loginService.mockResolvedValue({ token: 'fake-token' });

    renderComponent();

    await user.type(screen.getByLabelText(/cpf ou email/i), 'antigo@usuario.com');
    await user.type(screen.getByLabelText(/senha/i), 'Senha123!');
    await user.click(screen.getByRole('button', { name: /entrar/i }));

    await waitFor(() => {
      expect(screen.getByText('Tela do Dashboard')).toBeInTheDocument();
    });
  });

  it('deve desabilitar o botão enquanto a requisição estiver carregando', async () => {
    const user = userEvent.setup();
    
    authService.loginService.mockImplementation(() => new Promise(resolve => setTimeout(resolve, 500)));
    vi.mocked(decodeJWT).mockReturnValue({ primeiro_acesso: false });

    renderComponent();

    await user.type(screen.getByLabelText(/cpf ou email/i), 'teste@teste.com');
    await user.type(screen.getByLabelText(/senha/i), 'Senha123!');
    
    const button = screen.getByRole('button', { name: /entrar/i });
    await user.click(button);

    expect(button).toBeDisabled();
  });
});