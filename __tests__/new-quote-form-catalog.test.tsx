import * as React from 'react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, within, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MemoryRouter, Routes, Route } from 'react-router-dom';
import NewQuoteForm from '../pages/NewQuoteForm';

vi.mock('react-hot-toast', () => {
  return {
    default: {
      success: vi.fn(),
      error: vi.fn(),
    },
  };
});

vi.mock('../services/contractGenerator', () => {
  return {
    generateContractText: vi.fn().mockResolvedValue('contract'),
  };
});

const mocks = vi.hoisted(() => {
  return {
    profileService: {
      getProfile: vi.fn(),
      updateProfile: vi.fn(),
    },
    clientsService: {
      fetchClients: vi.fn(),
    },
    quotesService: {
      fetchQuotes: vi.fn(),
      createQuote: vi.fn(),
      updateQuote: vi.fn(),
    },
  };
});

vi.mock('../services/database', () => mocks);

const renderPage = async () => {
  render(
    <MemoryRouter initialEntries={['/new-quote/form']}>
      <Routes>
        <Route path="/new-quote/form" element={<NewQuoteForm />} />
      </Routes>
    </MemoryRouter>,
  );

  await waitFor(() => expect(mocks.clientsService.fetchClients).toHaveBeenCalled());
  await waitFor(() => expect(mocks.profileService.getProfile).toHaveBeenCalled());
};

describe('NewQuoteForm catalog flow', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mocks.clientsService.fetchClients.mockResolvedValue([
      { id: 'c1', name: 'Cliente', address: '', phone: '', avatar: '', document: '' },
    ]);
    mocks.profileService.getProfile.mockResolvedValue({
      id: 'u1',
      name: 'User',
      email: 'u@x.com',
      materialCatalog: [],
      contractTemplates: [],
      subscriptionStatus: 'trial',
      companyName: '',
      phone: '',
      address: '',
      document: '',
    });
    mocks.profileService.updateProfile.mockResolvedValue(undefined);
    mocks.quotesService.createQuote.mockResolvedValue({ id: 'q1' });
    mocks.quotesService.updateQuote.mockResolvedValue(undefined);
    mocks.quotesService.fetchQuotes.mockResolvedValue([]);
  });

  it('updates catalog in real time after creating a new item from the quote screen and persists on save', async () => {
    const user = userEvent.setup();
    await renderPage();

    const serviceNameInput = screen.getByPlaceholderText(/buscar serviço no catálogo/i);
    await user.type(serviceNameInput, 'Mão de obra');
    const servicePriceInput = screen.getAllByPlaceholderText('0,00')[0];
    await user.clear(servicePriceInput);
    await user.type(servicePriceInput, '100');

    await user.click(screen.getByRole('button', { name: /\+ adicionar produto/i }));
    const catalogBtnsAfterAdd = screen.getAllByRole('button', { name: /catálogo/i });
    await user.click(catalogBtnsAfterAdd[catalogBtnsAfterAdd.length - 1]);

    await user.click(screen.getByRole('button', { name: /criar novo/i }));

    await user.type(screen.getByPlaceholderText('Ex: Instalação'), 'Lampada LED 9W');
    await user.type(screen.getByPlaceholderText('Ex: Elétrica'), 'Elétrica');
    await user.type(screen.getByPlaceholderText('Ex: un / m / h'), 'un');

    const priceInputs = screen.getAllByPlaceholderText('0,00');
    const [unitPriceInput, costInput] = priceInputs.slice(-2);
    await user.type(unitPriceInput, '10');
    await user.type(costInput, '5');

    await user.click(screen.getByRole('button', { name: /criar e selecionar/i }));

    await waitFor(() => expect(screen.queryByRole('button', { name: /criar e selecionar/i })).not.toBeInTheDocument());
    await waitFor(() => expect(screen.getByPlaceholderText(/buscar ou digitar produto/i)).toHaveValue('Lampada LED 9W'));

    const catalogButtons = screen.getAllByRole('button', { name: /catálogo/i });
    await user.click(catalogButtons[catalogButtons.length - 1]);

    await user.type(screen.getByPlaceholderText(/buscar por nome/i), 'Lampada');
    expect(await screen.findByText('Lampada LED 9W')).toBeInTheDocument();

    await user.click(screen.getByRole('button', { name: /fechar/i }));

    await user.click(screen.getByRole('button', { name: /finalizar e gerar contrato/i }));

    await waitFor(() => expect(mocks.profileService.updateProfile).toHaveBeenCalled());
    const updateArg = mocks.profileService.updateProfile.mock.calls[0][0];
    expect(updateArg.materialCatalog).toBeTruthy();
    expect(updateArg.materialCatalog[0]).toMatchObject({
      name: 'Lampada LED 9W',
      status: 'active',
    });
    expect(updateArg.materialCatalog[0].code).toMatch(/^PRD-\d{6}$/);
    expect(mocks.quotesService.createQuote).toHaveBeenCalled();
  });

  it('does not allow creating new catalog items when user is not authorized', async () => {
    const user = userEvent.setup();
    mocks.profileService.getProfile.mockResolvedValueOnce({
      id: 'u1',
      name: 'User',
      email: 'u@x.com',
      materialCatalog: [],
      contractTemplates: [],
      subscriptionStatus: 'expired',
      companyName: '',
      phone: '',
      address: '',
      document: '',
    });

    await renderPage();

    await user.click(screen.getByRole('button', { name: /\+ adicionar produto/i }));
    const catalogButtons = screen.getAllByRole('button', { name: /catálogo/i });
    await user.click(catalogButtons[catalogButtons.length - 1]);

    expect(screen.queryByRole('button', { name: /criar novo/i })).not.toBeInTheDocument();
  });
});
