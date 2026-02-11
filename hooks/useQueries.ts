
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { quotesService, profileService } from '../services/database';
import { Quote, QuoteStatus, QuoteStatusLabels, Client } from '../types';
import toast from 'react-hot-toast';

// --- QUOTES ---

export function useQuotes() {
  return useQuery({
    queryKey: ['quotes'],
    queryFn: () => quotesService.fetchQuotes(),
  });
}

export function useQuote(id: string) {
  return useQuery({
    queryKey: ['quote', id],
    queryFn: () => quotesService.getQuote(id),
    enabled: !!id,
  });
}

export function useCreateQuote() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (quote: Omit<Quote, 'id'>) => quotesService.createQuote(quote),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['quotes'] });
      toast.success('Orçamento criado com sucesso!');
    },
    onError: (error: any) => {
      console.error('Erro ao criar orçamento:', error);
      toast.error('Erro ao criar orçamento.');
    }
  });
}

export function useUpdateQuote() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (quote: Quote) => quotesService.updateQuote(quote),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['quotes'] });
      queryClient.invalidateQueries({ queryKey: ['quote', variables.id] });
      toast.success('Orçamento atualizado!');
    },
    onError: (error: any) => {
      console.error('Erro ao atualizar orçamento:', error);
      toast.error('Erro ao atualizar orçamento.');
    }
  });
}

export function useUpdateQuoteStatus() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ id, status, quote }: { id: string; status: QuoteStatus; quote: Quote }) => {
      // Create updated quote object
      const updatedQuote = { ...quote, status };
      return quotesService.updateQuote(updatedQuote);
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['quotes'] });
      queryClient.invalidateQueries({ queryKey: ['quote', variables.id] });
      toast.success(`Status atualizado para ${QuoteStatusLabels[variables.status]}`);
    },
    onError: () => {
      toast.error('Erro ao atualizar status.');
    }
  });
}

export function useDeleteQuote() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => quotesService.deleteQuote(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['quotes'] });
      toast.success('Orçamento excluído.');
    },
    onError: () => {
      toast.error('Erro ao excluir orçamento.');
    }
  });
}

// --- CLIENTS ---

export function useClients() {
  return useQuery({
    queryKey: ['clients'],
    queryFn: () => quotesService.fetchClients(),
  });
}

export function useClient(id: string) {
  return useQuery({
    queryKey: ['client', id],
    queryFn: () => quotesService.getClient(id),
    enabled: !!id,
  });
}

export function useCreateClient() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (client: Omit<Client, 'id'>) => quotesService.createClient(client),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['clients'] });
      toast.success('Cliente cadastrado!');
    },
  });
}

export function useUpdateClient() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (client: Client) => quotesService.updateClient(client),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['clients'] });
      queryClient.invalidateQueries({ queryKey: ['client', variables.id] });
      toast.success('Cliente atualizado!');
    },
  });
}

// --- PROFILE ---

export function useProfile() {
  return useQuery({
    queryKey: ['profile'],
    queryFn: () => profileService.getProfile(),
  });
}

export function useUpdateProfile() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (updates: any) => profileService.updateProfile(updates),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['profile'] });
      toast.success('Perfil atualizado!');
    },
  });
}
