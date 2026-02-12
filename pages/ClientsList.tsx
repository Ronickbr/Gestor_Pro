
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Client } from '../types';
import { quotesService } from '../services/database';
import { Avatar } from '../components/ui/Avatar';

const ClientsList: React.FC = () => {
  const navigate = useNavigate();
  const [clients, setClients] = useState<Client[]>([]);
  const [search, setSearch] = useState('');

  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadClients();
  }, []);

  const loadClients = async () => {
    try {
      const data = await quotesService.fetchClients();
      setClients(data);
    } catch (error) {
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  const filtered = clients.filter(c =>
    c.name.toLowerCase().includes(search.toLowerCase()) ||
    (c.document && c.document.includes(search))
  );

  return (
    <div className="flex flex-col h-screen w-full md:max-w-7xl mx-auto bg-background-light dark:bg-background-dark">
      <header className="sticky top-0 z-50 bg-white dark:bg-surface-dark p-4 border-b dark:border-white/5">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <h2 className="text-xl font-black md:mb-0 mb-4">Base de Clientes</h2>
          <div className="relative flex items-center bg-slate-100 dark:bg-background-dark rounded-xl h-11 px-3 w-full md:w-96">
            <span className="material-symbols-outlined text-slate-400">search</span>
            <input
              className="bg-transparent border-none focus:ring-0 flex-1 px-2 text-sm text-slate-900 dark:text-white"
              placeholder="Buscar por nome ou CPF/CNPJ..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
          <button
            onClick={() => navigate('/new-client')}
            className="hidden md:flex items-center gap-2 bg-primary text-white px-4 py-2 rounded-xl font-bold shadow-lg shadow-primary/20 hover:bg-primary/90 transition-all"
          >
            <span className="material-symbols-outlined text-sm">person_add</span>
            Adicionar Cliente
          </button>
        </div>
      </header>

      <main className="flex-1 p-4 overflow-y-auto pb-32">
        {isLoading ? (
          <div className="flex flex-col items-center justify-center py-20 text-slate-400">
            <span className="material-symbols-outlined animate-spin text-4xl mb-2">sync</span>
            <p className="text-sm font-medium animate-pulse">Carregando...</p>
          </div>
        ) : filtered.length === 0 ? (
          <div className="text-center py-20 text-slate-400 col-span-full">
            <span className="material-symbols-outlined text-5xl mb-2">person_off</span>
            <p className="text-sm font-bold">Nenhum cliente cadastrado.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {filtered.map(client => (
              <div
                key={client.id}
                onClick={() => navigate(`/edit-client/${client.id}`)}
                className="bg-white dark:bg-surface-dark p-4 rounded-2xl flex items-center gap-4 shadow-sm active:scale-[0.98] transition-transform cursor-pointer hover:shadow-md border dark:border-white/5"
              >
                <Avatar src={client.avatar} name={client.name} size="size-12" />
                <div className="flex-1 min-w-0">
                  <p className="font-bold text-slate-900 dark:text-white truncate">{client.name}</p>
                  <p className="text-[10px] text-slate-500 font-medium">{client.document}</p>
                </div>
                <span className="material-symbols-outlined text-slate-300">chevron_right</span>
              </div>
            ))}
          </div>
        )}
      </main>

      <button
        onClick={() => navigate('/new-client')}
        className="fixed bottom-28 right-4 size-14 rounded-full bg-primary text-white shadow-xl shadow-primary/30 flex items-center justify-center active:scale-90 transition-transform z-50 md:hidden"
      >
        <span className="material-symbols-outlined text-3xl">person_add</span>
      </button>
    </div>
  );
};

export default ClientsList;
