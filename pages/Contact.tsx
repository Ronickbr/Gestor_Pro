import React from 'react';
import { SimplePublicLayout } from '../components/SimplePublicLayout';

const Contact: React.FC = () => {
    return (
        <SimplePublicLayout>
            <div className="text-center mb-16">
                <h1 className="text-4xl font-black mb-4">Fale Conosco</h1>
                <p className="text-slate-400 text-lg">Estamos aqui para ajudar você a crescer seu negócio.</p>
            </div>
            
            <div className="grid md:grid-cols-2 gap-12">
                <div className="bg-slate-800/50 p-8 rounded-3xl border border-white/5">
                    <h2 className="text-2xl font-bold mb-6">Entre em contato</h2>
                    <div className="space-y-6">
                        <div className="flex items-start gap-4">
                            <div className="size-10 rounded-lg bg-primary/10 text-primary flex items-center justify-center shrink-0">
                                <span className="material-symbols-outlined">mail</span>
                            </div>
                            <div>
                                <h3 className="font-bold text-white">E-mail</h3>
                                <p className="text-slate-400">suporte@gestorpro.com.br</p>
                            </div>
                        </div>
                        
                        <div className="flex items-start gap-4">
                            <div className="size-10 rounded-lg bg-primary/10 text-primary flex items-center justify-center shrink-0">
                                <span className="material-symbols-outlined">chat</span>
                            </div>
                            <div>
                                <h3 className="font-bold text-white">WhatsApp</h3>
                                <p className="text-slate-400">(11) 99999-9999</p>
                                <p className="text-xs text-slate-500 mt-1">Seg a Sex, 9h às 18h</p>
                            </div>
                        </div>

                        <div className="flex items-start gap-4">
                            <div className="size-10 rounded-lg bg-primary/10 text-primary flex items-center justify-center shrink-0">
                                <span className="material-symbols-outlined">help</span>
                            </div>
                            <div>
                                <h3 className="font-bold text-white">Central de Ajuda</h3>
                                <p className="text-slate-400">Acesse nossos tutoriais e FAQ</p>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="bg-slate-800/50 p-8 rounded-3xl border border-white/5">
                    <form className="space-y-4" onSubmit={(e) => e.preventDefault()}>
                        <div>
                            <label className="block text-sm font-medium text-slate-300 mb-1">Nome</label>
                            <input type="text" className="w-full bg-slate-900 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-primary transition-colors" placeholder="Seu nome" />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-slate-300 mb-1">E-mail</label>
                            <input type="email" className="w-full bg-slate-900 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-primary transition-colors" placeholder="seu@email.com" />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-slate-300 mb-1">Mensagem</label>
                            <textarea className="w-full bg-slate-900 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-primary transition-colors h-32 resize-none" placeholder="Como podemos ajudar?"></textarea>
                        </div>
                        <button className="w-full bg-primary text-white font-bold py-3 rounded-xl hover:bg-primary/90 transition-colors">
                            Enviar Mensagem
                        </button>
                    </form>
                </div>
            </div>
        </SimplePublicLayout>
    );
};

export default Contact;
