import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-hot-toast';
import { supabase } from '../lib/supabase';

const UpdatePassword: React.FC = () => {
    const navigate = useNavigate();
    const [password, setPassword] = useState('');
    const [isLoading, setIsLoading] = useState(false);

    useEffect(() => {
        const checkSession = async () => {
            const { data: { session } } = await supabase.auth.getSession();
            if (!session) {
                // Se não houver sessão, redirecionar para login
                // Mas pode ser que o token ainda esteja sendo processado
                // Vamos dar um pequeno delay ou verificar o hash
                navigate('/login');
            }
        };
        checkSession();
    }, [navigate]);

    const handleUpdatePassword = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);

        try {
            const { error } = await supabase.auth.updateUser({
                password: password
            });

            if (error) throw error;

            toast.success('Senha atualizada com sucesso!');
            navigate('/dashboard');
        } catch (error: any) {
            toast.error(error.message || 'Erro ao atualizar senha.');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-slate-900 p-4">
            <div className="w-full max-w-sm bg-slate-800 rounded-xl p-8 shadow-2xl border border-white/10">
                <h1 className="text-2xl font-bold text-white mb-6 text-center">Definir Nova Senha</h1>
                <form onSubmit={handleUpdatePassword} className="space-y-6">
                    <div>
                        <label className="block text-sm font-medium text-slate-400 mb-2">Nova Senha</label>
                        <input
                            type="password"
                            required
                            minLength={6}
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            className="w-full bg-slate-900 border border-slate-700 rounded-lg px-4 py-3 text-white focus:ring-2 focus:ring-primary focus:border-transparent outline-none transition-all"
                            placeholder="••••••••"
                        />
                    </div>
                    <button
                        type="submit"
                        disabled={isLoading}
                        className="w-full bg-primary hover:bg-primary/90 text-white font-bold py-3 rounded-lg transition-colors flex items-center justify-center gap-2"
                    >
                        {isLoading ? 'Atualizando...' : 'Atualizar Senha'}
                    </button>
                </form>
            </div>
        </div>
    );
};

export default UpdatePassword;
