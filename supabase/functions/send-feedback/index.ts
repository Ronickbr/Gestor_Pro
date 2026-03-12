/// <reference lib="deno.ns" />
import "jsr:@supabase/functions-js/edge-runtime.d.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.39.7';

const corsHeaders = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

Deno.serve(async (req: Request) => {
    if (req.method === 'OPTIONS') {
        return new Response('ok', { headers: corsHeaders });
    }

    try {
        const supabaseClient = createClient(
            Deno.env.get('SUPABASE_URL') ?? '',
            Deno.env.get('SUPABASE_ANON_KEY') ?? '',
            { global: { headers: { Authorization: req.headers.get('Authorization')! } } }
        );

        const { ratings, comments, nps, general, improvements, email, userId } = await req.json();

        // 1. Salvar no banco de dados
        const { error: dbError } = await supabaseClient
            .from('feedbacks')
            .insert({
                user_id: userId,
                email,
                nps,
                general,
                improvements,
                ratings,
                comments
            });

        if (dbError) throw dbError;

        // 2. Enviar e-mail via Resend
        const RESEND_API_KEY = Deno.env.get('RESEND_API_KEY');

        if (RESEND_API_KEY) {
            const res = await fetch('https://api.resend.com/emails', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${RESEND_API_KEY}`,
                },
                body: JSON.stringify({
                    from: 'Gestor Pro <onboarding@resend.dev>',
                    to: ['kmkz.clan@gmail.com'],
                    subject: 'Novo Feedback Recebido - Gestor Pro',
                    html: `
            <h1>Novo Feedback</h1>
            <p><strong>Data/Hora:</strong> ${new Date().toLocaleString('pt-BR')}</p>
            <p><strong>E-mail do Usuário:</strong> ${email || 'Não informado'}</p>
            <p><strong>NPS:</strong> ${nps}</p>
            <hr />
            <h3>Respostas Detalhadas:</h3>
            <ul>
              ${Object.entries(ratings).map(([key, value]) => `<li><strong>${key}:</strong> Nota ${value} - ${comments[key] || ''}</li>`).join('')}
            </ul>
            <p><strong>Geral:</strong> ${general}</p>
            <p><strong>Melhorias:</strong> ${improvements}</p>
          `,
                }),
            });

            if (!res.ok) {
                const errorText = await res.text();
                console.error('Erro ao enviar e-mail via Resend:', errorText);
            }
        } else {
            console.warn('RESEND_API_KEY não configurada. E-mail não enviado, mas feedback salvo no banco.');
        }

        return new Response(JSON.stringify({ success: true }), {
            headers: { ...corsHeaders, 'Content-Type': 'application/json' },
            status: 200,
        });
    } catch (error: any) {
        return new Response(JSON.stringify({ error: error.message }), {
            headers: { ...corsHeaders, 'Content-Type': 'application/json' },
            status: 400,
        });
    }
});
