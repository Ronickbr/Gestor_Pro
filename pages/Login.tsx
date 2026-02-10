import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-hot-toast';
import { supabase } from '../lib/supabase';

const Login: React.FC = () => {
    const navigate = useNavigate();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [isRegistering, setIsRegistering] = useState(false);
    const [isResetting, setIsResetting] = useState(false);
    const [companyName, setCompanyName] = useState('');

    const handleReset = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);
        try {
            const { error } = await supabase.auth.resetPasswordForEmail(email, {
                redirectTo: window.location.origin,
            });
            if (error) throw error;
            toast.success('Instruções enviadas para o seu e-mail!');
            setIsResetting(false);
        } catch (error: any) {
            toast.error(error.message || 'Erro ao enviar e-mail de recuperação.');
        } finally {
            setIsLoading(false);
        }
    };

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);

        try {
            if (isRegistering) {
                // Sign Up
                const { error } = await supabase.auth.signUp({
                    email,
                    password,
                    options: {
                        data: {
                            company_name: companyName || 'Minha Empresa'
                        }
                    }
                });

                if (error) throw error;
                toast.success('Conta criada com sucesso! Faça login para continuar.');
                setIsRegistering(false);
            } else {
                // Sign In
                const { data, error } = await supabase.auth.signInWithPassword({
                    email,
                    password,
                });

                if (error) throw error;

                if (data.session) {
                    localStorage.setItem('gestor_pro_auth', 'true');
                    navigate('/dashboard');
                }
            }
        } catch (error: any) {
            toast.error(error.message || 'Erro ao processar a solicitação.');
        } finally {
            setIsLoading(false);
        }
    };

    const toggleMode = () => {
        setIsRegistering(!isRegistering);
        setIsResetting(false);
        setEmail('');
        setPassword('');
        setCompanyName('');
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-slate-900 overflow-hidden relative p-4">
            {/* Dynamic Background */}
            <div className="absolute inset-0 z-0">
                <div className="absolute top-[-10%] left-[-10%] size-[500px] bg-primary/20 rounded-full blur-[120px] animate-pulse"></div>
                <div className="absolute bottom-[-10%] right-[-10%] size-[500px] bg-orange-500/10 rounded-full blur-[120px] animate-pulse delay-1000"></div>
                <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-5"></div>
            </div>

            <div className="w-full max-w-sm z-10 relative">
                {/* Glass Card */}
                <div className="bg-white/10 backdrop-blur-xl border border-white/20 rounded-3xl p-8 shadow-2xl shadow-black/50 animate-in fade-in zoom-in duration-500">

                    {/* Header Section */}
                    <div className="flex flex-col items-center mb-8 text-center">
                        <div className="mb-6 relative group">
                            <div className="absolute inset-0 bg-white/20 rounded-full blur-xl group-hover:blur-2xl transition-all duration-500"></div>
                            {/* Logo from public folder (user needs to add valid logo file) */}
                            <img
                                src="https://i.imgur.com/6i2hhmf.png"
                                onError={(e) => {
                                    e.currentTarget.onerror = null;
                                    e.currentTarget.style.display = 'none';
                                    e.currentTarget.nextElementSibling?.classList.remove('hidden');
                                }}
                                className="size-28 object-contain relative z-10 drop-shadow-lg transform hover:scale-105 transition-transform duration-300"
                                alt="Gestor Pro"
                            />
                            {/* Fallback if image not present */}
                            <div className="hidden size-24 bg-gradient-to-br from-primary to-orange-500 rounded-2xl flex flex-col items-center justify-center text-white shadow-lg relative z-10">
                                <span className="material-symbols-outlined text-4xl mb-1">handyman</span>
                                <span className="text-[10px] font-black tracking-tighter leading-none">GESTOR</span>
                                <span className="text-[8px] font-bold tracking-widest opacity-80">PRO</span>
                            </div>
                        </div>

                        <h1 className="text-2xl font-black text-white tracking-tight">
                            {isResetting ? 'Recuperar Senha' : (isRegistering ? 'Criar Nova Conta' : 'Acessar Sistema')}
                        </h1>
                        <p className="text-sm text-slate-300 mt-2 leading-relaxed">
                            {isResetting 
                                ? 'Informe seu e-mail para receber as instruções de recuperação.'
                                : (isRegistering
                                    ? 'Junte-se a milhares de profissionais e transforme seus orçamentos.'
                                    : 'Gerencie seus contratos e orçamentos com inteligência e praticidade.')}
                        </p>
                    </div>

                    <form onSubmit={isResetting ? handleReset : handleLogin} className="space-y-5">
                        {isRegistering && !isResetting && (
                            <InputGroup icon="business" label="Nome da Empresa">
                                <input
                                    type="text"
                                    required
                                    value={companyName}
                                    onChange={(e) => setCompanyName(e.target.value)}
                                    className="w-full bg-slate-900/50 border border-white/10 rounded-xl pl-10 pr-4 py-3.5 text-sm text-white placeholder-slate-500 focus:ring-2 focus:ring-primary focus:border-transparent outline-none transition-all"
                                    placeholder="Ex: Sua Empresa Ltda"
                                />
                            </InputGroup>
                        )}

                        <InputGroup icon="mail" label="Seu E-mail">
                            <input
                                type="email"
                                required
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                className="w-full bg-slate-900/50 border border-white/10 rounded-xl pl-10 pr-4 py-3.5 text-sm text-white placeholder-slate-500 focus:ring-2 focus:ring-primary focus:border-transparent outline-none transition-all"
                                placeholder="nome@exemplo.com"
                            />
                        </InputGroup>

                        {!isResetting && (
                            <InputGroup icon="lock" label="Sua Senha">
                                <input
                                    type="password"
                                    required
                                    minLength={6}
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    className="w-full bg-slate-900/50 border border-white/10 rounded-xl pl-10 pr-4 py-3.5 text-sm text-white placeholder-slate-500 focus:ring-2 focus:ring-primary focus:border-transparent outline-none transition-all"
                                    placeholder="••••••••"
                                />
                            </InputGroup>
                        )}

                        {!isRegistering && !isResetting && (
                            <div className="flex justify-end">
                                <button 
                                    type="button" 
                                    onClick={() => setIsResetting(true)}
                                    className="text-xs font-bold text-slate-400 hover:text-white transition-colors"
                                >
                                    Esqueceu a senha?
                                </button>
                            </div>
                        )}

                        <button
                            type="submit"
                            disabled={isLoading}
                            className="w-full relative group overflow-hidden bg-gradient-to-r from-primary to-blue-600 text-white font-bold py-4 rounded-xl shadow-lg shadow-primary/20 hover:shadow-primary/40 active:scale-[0.98] transition-all"
                        >
                            <div className="absolute inset-0 bg-white/20 translate-y-full group-hover:translate-y-0 transition-transform duration-300"></div>
                            <div className="relative flex items-center justify-center gap-2">
                                {isLoading ? (
                                    <span className="material-symbols-outlined animate-spin">sync</span>
                                ) : (
                                    <span className="material-symbols-outlined">
                                        {isResetting ? 'send' : (isRegistering ? 'person_add' : 'login')}
                                    </span>
                                )}
                                <span>
                                    {isLoading 
                                        ? 'Aguarde...' 
                                        : (isResetting 
                                            ? 'Enviar Link de Recuperação' 
                                            : (isRegistering ? 'Criar Conta Grátis' : 'Entrar na Plataforma'))}
                                </span>
                            </div>
                        </button>
                    </form>

                    {/* Footer toggle */}
                    <div className="mt-8 pt-6 border-t border-white/10 text-center">
                        <p className="text-xs text-slate-400 mb-2">
                            {isResetting 
                                ? 'Lembrou sua senha?' 
                                : (isRegistering ? 'Já possui cadastro?' : 'Novo por aqui?')}
                        </p>
                        <button
                            onClick={isResetting ? () => setIsResetting(false) : toggleMode}
                            className="text-sm font-black text-white hover:text-primary transition-colors tracking-wide uppercase"
                        >
                            {isResetting 
                                ? 'Voltar para Login' 
                                : (isRegistering ? 'Fazer Login' : 'Criar conta agora')}
                        </button>
                    </div>
                </div>

                {/* Bottom copyright */}
                <p className="text-center text-[10px] text-slate-600 mt-8 font-medium">
                    &copy; 2024 Gestor Pro • Tecnologia em Serviços
                </p>
            </div>
        </div>
    );
};

const InputGroup = ({ icon, label, children }: any) => (
    <div className="space-y-1.5">
        <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest ml-1">{label}</label>
        <div className="relative group">
            <span className="material-symbols-outlined absolute left-3 top-3.5 text-slate-500 text-lg group-focus-within:text-primary transition-colors">{icon}</span>
            {children}
        </div>
    </div>
);

export default Login;
