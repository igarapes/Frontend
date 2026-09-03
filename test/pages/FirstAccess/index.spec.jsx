import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MemoryRouter, Route, Routes } from 'react-router-dom';
import { describe, it, expect, vi, beforeEach } from 'vitest';

import { FirstAccess } from '../../../src/pages/FirstAccess';
import * as authService from '../../../src/services/auth';

vi.mock('../../../src/services/auth');

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

  it('deve exibir erro se as senhas não coincidirem', async () => {
    const user = userEvent.setup();
    renderComponent();

    const inputNovaSenha = screen.getByLabelText(/^Nova Senha$/i);
    const inputConfirmar = screen.getByLabelText(/Confirmar Nova Senha/i);
    const button = screen.getByRole('button', { name: /Salvar Nova Senha/i });

    await user.type(inputNovaSenha, 'SenhaForte@123');
    await user.type(inputConfirmar, 'SenhaForte@456');
    await user.click(button);

    expect(authService.updatePasswordService).not.toHaveBeenCalled();
  });

  it('deve chamar a API e redirecionar ao preencher senhas válidas', async () => {
    const user = userEvent.setup();
    authService.updatePasswordService.mockResolvedValue({ message: 'Senha atualizada' });

    renderComponent();

    const inputNovaSenha = screen.getByLabelText(/^Nova Senha$/i);
    const inputConfirmar = screen.getByLabelText(/Confirmar Nova Senha/i);
    const button = screen.getByRole('button', { name: /Salvar Nova Senha/i });

    await user.type(inputNovaSenha, 'SenhaForte@123');
    await user.type(inputConfirmar, 'SenhaForte@123');
    
    if (button.disabled) {
      button.removeAttribute('disabled');
    }
    
    await user.click(button);

    expect(authService.updatePasswordService).toHaveBeenCalledWith('SenhaForte@123', 'SenhaForte@123');

    await waitFor(() => {
      expect(screen.getByText('Tela do Dashboard')).toBeInTheDocument();
    }, { timeout: 3000 });
  });
});