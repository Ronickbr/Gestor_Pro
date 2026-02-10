import { Quote, QuoteStatus } from './types';

export const SERVICE_CATEGORIES = [
  {
    id: 'cat1',
    name: 'Instalação de CFTV',
    description: 'Câmeras, DVRs e cabeamento estruturado.',
    icon: 'videocam',
    contractTemplate: `CONTRATO DE PRESTAÇÃO DE SERVIÇOS TÉCNICOS

CONTRATANTE:
{{CLIENTE_NOME}}, inscrito no CPF/CNPJ {{CLIENTE_DOC}}, residente em {{CLIENTE_ENDERECO}}, telefone {{CLIENTE_TELEFONE}}.

CONTRATADO:
{{CONTRATADO_EMPRESA}} ({{CONTRATADO_NOME}}), inscrito no CNPJ/CPF {{CONTRATADO_DOC}}, com sede em {{CONTRATADO_ENDERECO}}, telefone {{CONTRATADO_TELEFONE}}.

DO OBJETO:
O presente contrato tem por objeto a prestação dos serviços de instalação de sistema de CFTV, conforme descrito abaixo:

SERVIÇOS:
{{LISTA_SERVICOS}}

MATERIAIS A SEREM INSTALADOS:
{{LISTA_MATERIAIS}}

VALOR TOTAL: {{VALOR_TOTAL}}

DA GARANTIA:
Fica estabelecida a garantia de {{GARANTIA_MESES}} meses para a mão de obra de instalação. A garantia dos equipamentos segue a política dos fabricantes. O acesso remoto depende de conexão estável de internet provida pelo CONTRATANTE.`
  },
  {
    id: 'cat2',
    name: 'Wi-Fi e Redes',
    description: 'Configuração de roteadores e mesh.',
    icon: 'wifi',
    contractTemplate: `CONTRATO DE SERVIÇOS DE REDE

CONTRATANTE: {{CLIENTE_NOME}} - Doc: {{CLIENTE_DOC}}
CONTRATADO: {{CONTRATADO_EMPRESA}} - Doc: {{CONTRATADO_DOC}}

OBJETO: Otimização da rede lógica e física no endereço {{CLIENTE_ENDERECO}}.

ESCOPO DOS SERVIÇOS:
{{LISTA_SERVICOS}}

EQUIPAMENTOS DE REDE:
{{LISTA_MATERIAIS}}

VALOR ACORDADO: {{VALOR_TOTAL}}

RESPONSABILIDADES:
O CONTRATADO não se responsabiliza por oscilações de sinal causadas por interferências externas ou limitações do provedor de banda larga.
Garantia técnica de {{GARANTIA_MESES}} meses sobre a configuração realizada.`
  },
  {
    id: 'cat3',
    name: 'Sistema de Alarme',
    description: 'Sensores, sirenes e monitoramento.',
    icon: 'shield',
    contractTemplate: `CONTRATO DE INSTALAÇÃO DE ALARME

PARTES:
{{CONTRATADO_EMPRESA}}, doravante CONTRATADA.
{{CLIENTE_NOME}}, doravante CONTRATANTE.

SERVIÇOS CONTRATADOS:
{{LISTA_SERVICOS}}

DISPOSITIVOS DE SEGURANÇA:
{{LISTA_MATERIAIS}}

VALOR GLOBAL: {{VALOR_TOTAL}}

GARANTIA E TESTES:
A garantia é de {{GARANTIA_MESES}} meses. O CONTRATANTE deve realizar testes periódicos no sistema. A responsabilidade da CONTRATADA limita-se ao funcionamento dos dispositivos instalados, não cobrindo violações de perímetro por falha de segurança pública ou privada.`
  },
  {
    id: 'cat4',
    name: 'Suporte de TI',
    description: 'Manutenção e suporte técnico.',
    icon: 'devices',
    contractTemplate: `CONTRATO DE MANUTENÇÃO E SUPORTE

CONTRATANTE: {{CLIENTE_NOME}}
CONTRATADO: {{CONTRATADO_NOME}}

O presente contrato visa a prestação de serviços de suporte técnico descritos a seguir:
{{LISTA_SERVICOS}}
{{LISTA_MATERIAIS}}

Total: {{VALOR_TOTAL}}

BACKUP E DADOS:
O CONTRATADO realizará serviços preventivos e corretivos. Não se responsabiliza por perda de dados caso o CONTRATANTE não possua rotina de backup.

VIGÊNCIA E GARANTIA:
Serviço pontual com garantia de {{GARANTIA_MESES}} meses sobre os procedimentos realizados.`
  }
];


