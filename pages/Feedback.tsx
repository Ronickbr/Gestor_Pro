import React, { useState } from 'react';
import { toast } from 'react-hot-toast';

type TopicKey = 'usability' | 'performance' | 'features' | 'design' | 'support';

const topics: { key: TopicKey; title: string }[] = [
  { key: 'usability', title: 'Usabilidade' },
  { key: 'performance', title: 'Performance' },
  { key: 'features', title: 'Funcionalidades' },
  { key: 'design', title: 'Design' },
  { key: 'support', title: 'Suporte' }
];

const Feedback: React.FC = () => {
  const [ratings, setRatings] = useState<Record<TopicKey, number>>({
    usability: 3,
    performance: 3,
    features: 3,
    design: 3,
    support: 3
  });
  const [comments, setComments] = useState<Record<TopicKey, string>>({
    usability: '',
    performance: '',
    features: '',
    design: '',
    support: ''
  });
  const [nps, setNps] = useState<number>(7);
  const [general, setGeneral] = useState<string>('');
  const [improvements, setImprovements] = useState<string>('');
  const [email, setEmail] = useState<string>('');
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);

  const submit = async () => {
    if (isSubmitting) return;
    setIsSubmitting(true);
    try {
      const payload = {
        ratings,
        comments,
        nps,
        general,
        improvements,
        email,
        createdAt: new Date().toISOString()
      };
      console.log('Feedback enviado:', payload);
      toast.success('Obrigado pelo feedback!');
      setRatings({ usability: 3, performance: 3, features: 3, design: 3, support: 3 });
      setComments({ usability: '', performance: '', features: '', design: '', support: '' });
      setNps(7);
      setGeneral('');
      setImprovements('');
      setEmail('');
    } catch (e) {
      console.error(e);
      toast.error('Não foi possível enviar seu feedback agora.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="flex flex-col h-screen w-full md:max-w-4xl mx-auto bg-background-light dark:bg-background-dark">
      <header className="sticky top-0 z-50 bg-white dark:bg-surface-dark p-4 border-b dark:border-white/5">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-black">Feedback</h2>
          <button
            onClick={submit}
            disabled={isSubmitting}
            className="bg-primary text-white px-4 py-2 rounded-xl font-bold shadow-lg shadow-primary/20 hover:bg-primary/90 transition-all disabled:opacity-60 disabled:cursor-not-allowed"
          >
            Enviar
          </button>
        </div>
      </header>

      <main className="flex-1 p-4 overflow-y-auto pb-24 space-y-6">
        <section className="bg-white dark:bg-surface-dark p-4 rounded-2xl border dark:border-white/5">
          <h3 className="font-bold text-slate-900 dark:text-white mb-1">Avaliação Geral (NPS)</h3>
          <p className="text-sm text-slate-500 mb-4">Qual a probabilidade de você recomendar o GestorPro para alguém?</p>
          <div className="flex items-center gap-3">
            <input
              type="range"
              min={0}
              max={10}
              value={nps}
              onChange={(e) => setNps(Number(e.target.value))}
              className="flex-1"
            />
            <div className="w-12 text-center font-bold">{nps}</div>
          </div>
          <div className="mt-4">
            <textarea
              value={general}
              onChange={(e) => setGeneral(e.target.value)}
              placeholder="Conte mais sobre sua experiência geral."
              className="w-full bg-slate-50 dark:bg-background-dark rounded-xl p-3 text-sm focus:outline-none"
              rows={3}
            />
          </div>
        </section>

        {topics.map((t) => (
          <section key={t.key} className="bg-white dark:bg-surface-dark p-4 rounded-2xl border dark:border-white/5">
            <div className="flex items-center justify-between mb-3">
              <h3 className="font-bold text-slate-900 dark:text-white">{t.title}</h3>
              <div className="flex items-center gap-2">
                {[1, 2, 3, 4, 5].map((v) => (
                  <button
                    key={v}
                    onClick={() => setRatings({ ...ratings, [t.key]: v })}
                    className={`size-9 rounded-lg border text-sm font-bold ${
                      ratings[t.key] === v
                        ? 'bg-primary text-white border-primary'
                        : 'bg-white dark:bg-surface-dark text-slate-600 dark:text-slate-300 border-slate-200 dark:border-white/10'
                    }`}
                    aria-label={`${t.title} nota ${v}`}
                  >
                    {v}
                  </button>
                ))}
              </div>
            </div>
            <textarea
              value={comments[t.key]}
              onChange={(e) => setComments({ ...comments, [t.key]: e.target.value })}
              placeholder={`Deixe comentários sobre ${t.title}.`}
              className="w-full bg-slate-50 dark:bg-background-dark rounded-xl p-3 text-sm focus:outline-none"
              rows={3}
            />
          </section>
        ))}

        <section className="bg-white dark:bg-surface-dark p-4 rounded-2xl border dark:border-white/5">
          <h3 className="font-bold text-slate-900 dark:text-white mb-2">Melhorias e problemas</h3>
          <p className="text-sm text-slate-500 mb-3">
            Descreva que tipos de melhorias você gostaria de ver ou quais partes não estão funcionando bem.
          </p>
          <textarea
            value={improvements}
            onChange={(e) => setImprovements(e.target.value)}
            placeholder="Ex.: Tela de clientes lenta, gostaria de relatórios por período, dúvida em alguma etapa..."
            className="w-full bg-slate-50 dark:bg-background-dark rounded-xl p-3 text-sm focus:outline-none"
            rows={4}
          />
        </section>

        <section className="bg-white dark:bg-surface-dark p-4 rounded-2xl border dark:border-white/5">
          <h3 className="font-bold text-slate-900 dark:text-white mb-2">Contato (opcional)</h3>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Seu e-mail para contato"
            className="w-full bg-slate-50 dark:bg-background-dark rounded-xl p-3 text-sm focus:outline-none"
          />
          <p className="text-[11px] text-slate-500 mt-2">Usaremos apenas para responder sobre seu feedback.</p>
        </section>
      </main>
    </div>
  );
};

export default Feedback;
