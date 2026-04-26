import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-hot-toast';
import { supabase } from '../lib/supabase';
import { Button } from '../components/ui/Button';
import { Field } from '../components/ui/Field';
import { Input } from '../components/ui/Input';

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
                        emailRedirectTo: window.location.origin,
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
        <div className="min-h-screen flex items-center justify-center overflow-hidden relative p-4 bg-background-light dark:bg-slate-900">
            <div className="absolute inset-0 z-0">
                <div className="absolute top-[-10%] left-[-10%] size-[520px] bg-primary/15 rounded-full blur-[120px]"></div>
                <div className="absolute bottom-[-10%] right-[-10%] size-[520px] bg-purple-500/10 rounded-full blur-[120px]"></div>
            </div>

            <div className="w-full max-w-sm z-10 relative">
                <div className="bg-white/80 dark:bg-white/10 backdrop-blur-xl border border-slate-200/70 dark:border-white/15 rounded-3xl p-8 shadow-2xl shadow-black/10 dark:shadow-black/50">
                    <div className="flex flex-col items-center mb-8 text-center">
                        <div className="mb-6 relative">
                            <div className="absolute inset-0 bg-primary/10 rounded-2xl blur-xl"></div>
                            <div className="relative size-16 rounded-2xl bg-white shadow-lg flex items-center justify-center dark:bg-white/10">
                                <img src="/pwa-icon.svg" className="size-10 object-contain" alt="Gestor Pro" />
                            </div>
                        </div>

                        <h1 className="text-2xl font-black text-slate-900 dark:text-white tracking-tight">
                            {isResetting ? 'Recuperar senha' : isRegistering ? 'Criar nova conta' : 'Acessar sistema'}
                        </h1>
                        <p className="text-sm text-slate-600 dark:text-slate-300 mt-2 leading-relaxed">
                            {isResetting
                                ? 'Informe seu e-mail para receber as instruções de recuperação.'
                                : isRegistering
                                    ? 'Crie propostas profissionais e feche mais contratos com agilidade.'
                                    : 'Gerencie contratos e orçamentos com praticidade e aparência profissional.'}
                        </p>
                    </div>

                    <form onSubmit={isResetting ? handleReset : handleLogin} className="space-y-5">
                        {isRegistering && !isResetting ? (
                            <Field label="Nome da empresa" htmlFor="companyName">
                                <Input
                                    id="companyName"
                                    type="text"
                                    required
                                    value={companyName}
                                    onChange={(e) => setCompanyName(e.target.value)}
                                    startIcon="business"
                                    placeholder="Ex: Sua Empresa Ltda"
                                    autoComplete="organization"
                                />
                            </Field>
                        ) : null}

                        <Field label="Seu e-mail" htmlFor="email">
                            <Input
                                id="email"
                                type="email"
                                required
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                startIcon="mail"
                                placeholder="nome@exemplo.com"
                                autoComplete="email"
                                inputMode="email"
                            />
                        </Field>

                        {!isResetting ? (
                            <Field label="Sua senha" htmlFor="password">
                                <Input
                                    id="password"
                                    type="password"
                                    required
                                    minLength={6}
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    startIcon="lock"
                                    placeholder="••••••••"
                                    autoComplete={isRegistering ? 'new-password' : 'current-password'}
                                />
                            </Field>
                        ) : null}

                        {!isRegistering && !isResetting ? (
                            <div className="flex justify-end">
                                <button
                                    type="button"
                                    onClick={() => setIsResetting(true)}
                                    className="text-xs font-bold text-slate-600 hover:text-slate-900 dark:text-slate-300 dark:hover:text-white transition-colors focus-ring rounded-lg px-2 py-1"
                                >
                                    Esqueceu a senha?
                                </button>
                            </div>
                        ) : null}

                        <Button
                            type="submit"
                            loading={isLoading}
                            className={`w-full ${!isRegistering && !isResetting ? 'text-black' : ''}`}
                        >
                            {!isLoading ? (
                                <span className="material-symbols-outlined">
                                    {isResetting ? 'send' : isRegistering ? 'person_add' : 'login'}
                                </span>
                            ) : null}
                            {isResetting
                                ? 'Enviar link de recuperação'
                                : isRegistering
                                    ? 'Criar conta grátis'
                                    : 'Entrar na plataforma'}
                        </Button>
                    </form>

                    <div className="mt-8 pt-6 border-t border-slate-200/70 dark:border-white/10 text-center">
                        <p className="text-xs text-slate-500 dark:text-slate-400 mb-2">
                            {isResetting ? 'Lembrou sua senha?' : isRegistering ? 'Já possui cadastro?' : 'Novo por aqui?'}
                        </p>
                        <button
                            onClick={isResetting ? () => setIsResetting(false) : toggleMode}
                            className="text-sm font-black text-slate-900 dark:text-white hover:text-primary transition-colors tracking-wide uppercase focus-ring rounded-lg px-3 py-2"
                        >
                            {isResetting ? 'Voltar para login' : isRegistering ? 'Fazer login' : 'Criar conta agora'}
                        </button>
                    </div>
                </div>

                <p className="text-center text-[10px] text-slate-500 mt-8 font-medium dark:text-slate-600">
                    &copy; 2024 Gestor Pro • Tecnologia em Serviços
                </p>
            </div>
        </div>
    );
};

export default Login;
