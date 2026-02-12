import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../lib/supabase';

const LandingPage: React.FC = () => {
    const navigate = useNavigate();

    useEffect(() => {
        const checkSession = async () => {
            const { data: { session } } = await supabase.auth.getSession();
            if (session) {
                navigate('/dashboard');
            }
        };
        checkSession();
    }, [navigate]);

    const scrollToSection = (id: string) => {
        const element = document.getElementById(id);
        if (element) {
            element.scrollIntoView({ behavior: 'smooth' });
        }
    };

    return (
        <div className="min-h-screen bg-slate-900 text-white font-sans selection:bg-primary selection:text-white overflow-x-hidden">
            {/* Navbar */}
            <nav className="fixed top-0 w-full z-50 bg-slate-900/80 backdrop-blur-md border-b border-white/5">
                <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <img src="https://i.imgur.com/6i2hhmf.png" className="size-10 object-contain rounded-xl shadow-lg shadow-primary/20" alt="Logo" />
                        <span className="font-black text-xl tracking-tight">Gestor<span className="text-primary">Pro</span></span>
                    </div>
                    <div className="hidden md:flex items-center gap-8 text-sm font-medium text-slate-300">
                        <button onClick={() => scrollToSection('features')} className="hover:text-white transition-colors">Funcionalidades</button>
                        <button onClick={() => scrollToSection('benefits')} className="hover:text-white transition-colors">Benefícios</button>
                        <button onClick={() => scrollToSection('pricing')} className="hover:text-white transition-colors">Planos</button>
                    </div>
                    <div className="flex items-center gap-4">
                        <button
                            onClick={() => navigate('/login')}
                            className="text-sm font-bold text-white hover:text-primary transition-colors"
                        >
                            Entrar
                        </button>
                        <button
                            onClick={() => navigate('/login')}
                            className="bg-white text-slate-900 px-5 py-2.5 rounded-full text-sm font-black hover:bg-slate-200 transition-colors"
                        >
                            Começar Grátis
                        </button>
                    </div>
                </div>
            </nav>

            {/* Hero Section */}
            <section className="relative pt-32 pb-20 md:pt-48 md:pb-32 px-6 overflow-hidden">
                <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[1000px] h-[500px] bg-primary/20 blur-[120px] rounded-full -z-10 pointer-events-none"></div>
                <div className="max-w-5xl mx-auto text-center">
                    <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/5 border border-white/10 text-xs font-bold text-primary mb-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
                        <span className="relative flex h-2 w-2">
                            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75"></span>
                            <span className="relative inline-flex rounded-full h-2 w-2 bg-primary"></span>
                        </span>
                        Nova Versão com IA Disponível
                    </div>
                    <h1 className="text-5xl md:text-7xl font-black tracking-tight mb-8 leading-tight animate-in fade-in slide-in-from-bottom-8 duration-700 delay-100">
                        Transforme Orçamentos em <br />
                        <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary via-purple-500 to-pink-500">Contratos Fechados</span>
                    </h1>
                    <p className="text-lg md:text-xl text-slate-400 mb-10 max-w-2xl mx-auto leading-relaxed animate-in fade-in slide-in-from-bottom-8 duration-700 delay-200">
                        A ferramenta definitiva para prestadores de serviços. Crie propostas profissionais, gere contratos blindados com IA e receba via Pix em segundos.
                    </p>
                    <div className="flex flex-col md:flex-row items-center justify-center gap-4 animate-in fade-in slide-in-from-bottom-8 duration-700 delay-300">
                        <button
                            onClick={() => navigate('/login')}
                            className="w-full md:w-auto h-14 px-8 rounded-full bg-primary text-white font-bold text-lg hover:bg-primary/90 transition-all hover:scale-105 shadow-xl shadow-primary/25 flex items-center justify-center gap-2"
                        >
                            Criar Orçamento Agora <span className="material-symbols-outlined">arrow_forward</span>
                        </button>
                        <button
                            onClick={() => document.getElementById('features')?.scrollIntoView({ behavior: 'smooth' })}
                            className="w-full md:w-auto h-14 px-8 rounded-full bg-white/5 text-white border border-white/10 font-bold text-lg hover:bg-white/10 transition-all flex items-center justify-center gap-2"
                        >
                            <span className="material-symbols-outlined">play_circle</span> Ver Demonstração
                        </button>
                    </div>
                </div>
            </section>

            {/* App Preview / Mockup */}
            <section className="relative px-6 pb-32">
                <div className="max-w-6xl mx-auto">
                    <div className="relative rounded-3xl border border-white/10 bg-slate-800/50 backdrop-blur-xl p-2 md:p-4 shadow-2xl shadow-black/50 overflow-hidden group">
                        <div className="absolute inset-0 bg-gradient-to-b from-primary/5 to-transparent pointer-events-none"></div>
                        {/* Mockup Content Construction */}
                        <div className="bg-slate-900 rounded-2xl overflow-hidden border border-white/5 aspect-[16/9] md:aspect-[21/9] relative flex">
                            {/* Sidebar Mock */}
                            <div className="w-64 bg-slate-900 border-r border-white/5 hidden md:flex flex-col p-4 gap-4">
                                <div className="flex items-center gap-3 mb-6">
                                    <div className="size-8 bg-primary rounded-lg"></div>
                                    <div className="h-4 w-24 bg-slate-800 rounded"></div>
                                </div>
                                {[1, 2, 3, 4].map(i => (
                                    <div key={i} className={`h-10 rounded-lg w-full flex items-center px-4 gap-3 ${i === 1 ? 'bg-primary/10 border border-primary/20' : ''}`}>
                                        <div className={`size-5 rounded ${i === 1 ? 'bg-primary' : 'bg-slate-800'}`}></div>
                                        <div className={`h-3 w-20 rounded ${i === 1 ? 'bg-primary/50' : 'bg-slate-800'}`}></div>
                                    </div>
                                ))}
                            </div>
                            {/* Main Content Mock */}
                            <div className="flex-1 p-8 bg-slate-950/50">
                                <div className="flex justify-between items-end mb-8">
                                    <div>
                                        <div className="h-8 w-64 bg-slate-800 rounded-lg mb-3"></div>
                                        <div className="h-4 w-96 bg-slate-800/50 rounded-lg"></div>
                                    </div>
                                    <div className="h-10 w-32 bg-primary rounded-xl"></div>
                                </div>
                                <div className="grid grid-cols-3 gap-6">
                                    {[1, 2, 3].map(i => (
                                        <div key={i} className="bg-slate-900 border border-white/5 rounded-2xl p-6">
                                            <div className="flex justify-between mb-4">
                                                <div className="size-10 bg-slate-800 rounded-full"></div>
                                                <div className="h-6 w-16 bg-emerald-500/20 rounded-full"></div>
                                            </div>
                                            <div className="h-4 w-3/4 bg-slate-800 rounded mb-2"></div>
                                            <div className="h-8 w-1/2 bg-slate-700 rounded"></div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Features Grid */}
            <section id="features" className="py-24 px-6 bg-slate-900 relative">
                <div className="max-w-7xl mx-auto">
                    <div className="text-center mb-20">
                        <h2 className="text-3xl md:text-5xl font-black mb-6">Tudo que você precisa para <br /><span className="text-primary">parecer gigante</span></h2>
                        <p className="text-slate-400 max-w-2xl mx-auto text-lg">
                            Software completo desenvolvido para eletricistas, encanadores, técnicos de TI, maridos de aluguel e empreendedores.
                        </p>
                    </div>

                    <div className="grid md:grid-cols-3 gap-8">
                        <FeatureCard
                            icon="description"
                            title="Orçamentos em PDF"
                            desc="Gere documentos profissionais prontos para envio. Seu cliente recebe um link exclusivo ou PDF direto no WhatsApp."
                        />
                        <FeatureCard
                            icon="auto_awesome"
                            title="IA Contratual"
                            desc="Esqueça o 'juridiquês'. Nossa IA transforma sua proposta simples em um contrato seguro e completo automaticamente."
                        />
                        <FeatureCard
                            icon="ink_pen"
                            title="Assinatura Digital"
                            desc="Colha a assinatura do cliente na tela do celular. Com validade jurídica e proteção para ambos os lados."
                        />
                        <FeatureCard
                            icon="payments"
                            title="Gestão Financeira"
                            desc="Acompanhe o que entrou, o que falta receber e visualize seus ganhos mensais em gráficos intuitivos."
                        />
                        <FeatureCard
                            icon="verified_user"
                            title="Segurança Total"
                            desc="Seus dados e de seus clientes protegidos. Backups automáticos e acesso seguro."
                        />
                        <FeatureCard
                            icon="group"
                            title="Base de Clientes"
                            desc="Histórico completo de cada cliente. Saiba exatamente o que foi feito e fidelize com pós-venda."
                        />
                    </div>
                </div>
            </section>

            {/* Benefits Section */}
            <section id="benefits" className="py-24 px-6 bg-slate-950 border-y border-white/5">
                <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center gap-16">
                    <div className="flex-1 space-y-8">
                        <h2 className="text-3xl md:text-5xl font-black leading-tight">
                            Passe confiança antes mesmo de <span className="text-emerald-500">apertar o primeiro parafuso.</span>
                        </h2>
                        <div className="space-y-6">
                            <BenefitItem text="Elimine a informalidade do 'boca a boca'." />
                            <BenefitItem text="Garanta o recebimento com contratos claros." />
                            <BenefitItem text="Economize 10h por semana em burocracia." />
                            <BenefitItem text="Aumente sua taxa de aprovação em 40%." />
                        </div>
                        <button
                            onClick={() => navigate('/login')}
                            className="mt-8 px-8 py-4 bg-emerald-600 hover:bg-emerald-500 text-white font-bold rounded-xl transition-colors flex items-center gap-3"
                        >
                            Quero Profissionalizar Meu Negócio <span className="material-symbols-outlined">arrow_forward</span>
                        </button>
                    </div>
                    <div className="flex-1 relative">
                        <div className="absolute inset-0 bg-emerald-500/20 blur-[100px] rounded-full"></div>
                        <div className="relative bg-slate-900 border border-white/10 rounded-2xl p-8 rotate-3 hover:rotate-0 transition-transform duration-500">
                            <div className="flex items-center gap-4 mb-6 border-b border-white/10 pb-6">
                                <div className="size-12 rounded-full bg-slate-800"></div>
                                <div>
                                    <div className="h-4 w-32 bg-slate-800 rounded mb-2"></div>
                                    <div className="h-3 w-20 bg-slate-800/50 rounded"></div>
                                </div>
                            </div>
                            <div className="space-y-3">
                                <div className="h-4 w-full bg-slate-800 rounded"></div>
                                <div className="h-4 w-5/6 bg-slate-800 rounded"></div>
                                <div className="h-4 w-4/6 bg-slate-800 rounded"></div>
                            </div>
                            <div className="mt-8 flex justify-between items-center bg-white/5 p-4 rounded-xl">
                                <span className="text-sm font-bold text-slate-400">Total do Serviço</span>
                                <span className="text-xl font-black text-emerald-500">R$ 2.500,00</span>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Pricing */}
            <section id="pricing" className="py-24 px-6 bg-slate-900">
                <div className="max-w-5xl mx-auto text-center">
                    <h2 className="text-3xl md:text-5xl font-black mb-16">Investimento que se paga <br />ao fechar o <span className="text-primary">primeiro serviço</span></h2>

                    <div className="grid md:grid-cols-3 gap-6 items-center max-w-6xl mx-auto">
                        {/* Monthly Plan */}
                        <div className="bg-slate-950 rounded-3xl p-6 border border-white/5 hover:border-white/10 transition-colors">
                            <h3 className="text-xl font-bold text-slate-400 mb-2">Mensal</h3>
                            <div className="flex items-baseline justify-center gap-1 mb-2">
                                <span className="text-sm text-slate-400">R$</span>
                                <span className="text-4xl font-black text-white">59</span>
                                <span className="text-slate-400">,90</span>
                            </div>
                            <p className="text-sm text-slate-500 mb-6">Cobrado mensalmente</p>
                            <ul className="space-y-4 text-left mb-8 text-slate-400 text-sm">
                                <li className="flex items-center gap-2"><span className="material-symbols-outlined text-emerald-500 text-lg">check</span> Orçamentos Ilimitados</li>
                                <li className="flex items-center gap-2"><span className="material-symbols-outlined text-emerald-500 text-lg">check</span> Contratos com IA</li>
                                <li className="flex items-center gap-2"><span className="material-symbols-outlined text-emerald-500 text-lg">check</span> Assinatura Digital</li>
                            </ul>
                            <button onClick={() => navigate('/login')} className="w-full py-3 rounded-xl border border-white/10 font-bold hover:bg-white/5 transition-colors text-sm">
                                Escolher Mensal
                            </button>
                        </div>

                        {/* Semiannual Plan */}
                        <div className="bg-slate-950 rounded-3xl p-6 border border-white/5 hover:border-white/10 transition-colors relative overflow-hidden">
                             <div className="absolute top-0 right-0 bg-emerald-500/10 text-emerald-500 text-[10px] font-bold px-3 py-1 rounded-bl-xl">
                                -15% OFF
                            </div>
                            <h3 className="text-xl font-bold text-white mb-2">Semestral</h3>
                            <div className="flex items-baseline justify-center gap-1 mb-2">
                                <span className="text-sm text-slate-400">R$</span>
                                <span className="text-4xl font-black text-white">55</span>
                                <span className="text-slate-400">,00</span>
                            </div>
                            <p className="text-sm text-slate-500 mb-6">Equivalente mensal</p>
                            <ul className="space-y-4 text-left mb-8 text-slate-300 text-sm">
                                <li className="flex items-center gap-2"><span className="material-symbols-outlined text-emerald-500 text-lg">check</span> <strong>Tudo do Mensal</strong></li>
                                <li className="flex items-center gap-2"><span className="material-symbols-outlined text-emerald-500 text-lg">check</span> Economize R$ 60/ano</li>
                                <li className="flex items-center gap-2"><span className="material-symbols-outlined text-emerald-500 text-lg">check</span> Prioridade no Suporte</li>
                            </ul>
                            <button onClick={() => navigate('/login')} className="w-full py-3 rounded-xl bg-white/5 text-white border border-white/10 font-bold hover:bg-white/10 transition-colors text-sm">
                                Escolher Semestral
                            </button>
                        </div>

                        {/* Annual Plan */}
                        <div className="bg-gradient-to-br from-primary/10 to-purple-600/10 rounded-3xl p-8 border-2 border-primary relative transform md:scale-110 shadow-2xl shadow-primary/20 z-10">
                            <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-primary text-white px-4 py-1 rounded-full text-xs font-black tracking-widest uppercase whitespace-nowrap">Melhor Valor</div>
                            <h3 className="text-xl font-bold text-primary mb-2">Anual</h3>
                            <div className="flex items-baseline justify-center gap-1 mb-2">
                                <span className="text-sm text-slate-400">R$</span>
                                <span className="text-5xl font-black">49</span>
                                <span className="text-slate-400">,90</span>
                            </div>
                            <p className="text-sm text-slate-400 mb-6">Equivalente mensal</p>
                            <ul className="space-y-4 text-left mb-8 text-slate-300 text-sm">
                                <li className="flex items-center gap-2"><span className="material-symbols-outlined text-primary text-lg">check_circle</span> <strong>Tudo do Semestral</strong></li>
                                <li className="flex items-center gap-2"><span className="material-symbols-outlined text-primary text-lg">check_circle</span> <strong>Economize R$ 120/ano</strong></li>
                                <li className="flex items-center gap-2"><span className="material-symbols-outlined text-primary text-lg">check_circle</span> 1 Mês Grátis (13º mês)</li>
                                <li className="flex items-center gap-2"><span className="material-symbols-outlined text-primary text-lg">check_circle</span> Acesso Antecipado a News</li>
                            </ul>
                            <button onClick={() => navigate('/login')} className="w-full py-4 rounded-xl bg-primary text-white font-bold hover:bg-primary/90 transition-colors shadow-lg shadow-primary/25">
                                Garantir Oferta Anual
                            </button>
                            <p className="text-[10px] text-slate-500 mt-4">Parcelamento em até 12x no cartão.</p>
                        </div>
                    </div>
                </div>
            </section>

            {/* CTA Footer */}
            <footer className="py-24 px-6 bg-slate-950 text-center relative overflow-hidden">
                <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-5"></div>
                <div className="relative z-10 max-w-4xl mx-auto">
                    <h2 className="text-4xl md:text-6xl font-black mb-8 tracking-tight">Pronto para subir de nível?</h2>
                    <p className="text-xl text-slate-400 mb-10">Junte-se a milhares de profissionais que estão fechando mais contratos todos os dias.</p>
                    <button
                        onClick={() => navigate('/login')}
                        className="px-10 py-5 bg-white text-slate-900 rounded-full font-black text-xl hover:bg-slate-200 transition-colors shadow-xl"
                    >
                        Acessar Sistema Agora
                    </button>

                    <div className="mt-20 pt-10 border-t border-white/5 flex flex-col md:flex-row items-center justify-between text-slate-500 text-sm">
                        <p>&copy; 2026 Gestor Pro. Todos os direitos reservados.</p>
                        <div className="flex gap-6 mt-4 md:mt-0">
                            <button onClick={() => navigate('/terms')} className="hover:text-white transition-colors">Termos de Uso</button>
                            <button onClick={() => navigate('/privacy')} className="hover:text-white transition-colors">Privacidade</button>
                            <button onClick={() => navigate('/contact')} className="hover:text-white transition-colors">Contato</button>
                        </div>
                    </div>
                </div>
            </footer>
        </div>
    );
};

const FeatureCard = ({ icon, title, desc }: any) => (
    <div className="bg-slate-800/50 p-8 rounded-3xl border border-white/5 hover:bg-slate-800 hover:border-white/10 transition-colors group">
        <div className="size-14 rounded-2xl bg-white/5 flex items-center justify-center text-primary mb-6 group-hover:scale-110 transition-transform duration-300">
            <span className="material-symbols-outlined text-3xl">{icon}</span>
        </div>
        <h3 className="text-xl font-bold mb-3">{title}</h3>
        <p className="text-slate-400 leading-relaxed text-sm">{desc}</p>
    </div>
);

const BenefitItem = ({ text }: any) => (
    <div className="flex items-center gap-4">
        <div className="size-6 rounded-full bg-emerald-500/20 text-emerald-500 flex items-center justify-center">
            <span className="material-symbols-outlined text-sm font-bold">check</span>
        </div>
        <p className="text-lg font-medium text-slate-300">{text}</p>
    </div>
);

export default LandingPage;
