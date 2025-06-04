# Chatbot-TCC2
Chatbot criado para realização de TCC no curso de Sistemas de Informação.

O código implementado apresenta diversas técnicas:

- Leitura e geração de QR Code: Para autenticação do cliente no WhatsApp Web.

- Leitura e normalização de mensagens: Garantindo que a interação seja processada corretamente, independentemente da forma como o usuário digita.

- Gerenciamento de estado: Utilizando objetos JavaScript para armazenar o contexto da conversa e impedir mensagens duplicadas ou fora de contexto.

- Bloqueio de contatos indesejados: Implementado via leitura de um arquivo bloqueados.json, o que garante segurança e controle.

- Delays programados: Criando uma experiência mais natural na simulação de digitação, aumentando a percepção de personalização no atendimento.

- Menu interativo: Estruturado com opções numéricas, facilitando a escolha do usuário e a navegação.


As interações e funcionalidades foram implementadas com o seguinte fluxo de mensagens:

- Saudações e apresentação do menu.

- Processamento de opções: agendamento, cancelamento, informações de valor e localização.

- Tratamento de dúvidas gerais.

- Gerenciamento de estado para contexto e tempo limite de resposta.


# PARA FUNCIONAR O SISTEMA SIGA OS PASSOS SEGUINTES

- Instalar o visual studio code;
- Criar uma pasta para adicionar esses arquivos dentro dela;
- Baixar o node no link: https://nodejs.org/en/download/;
- Para gerar o qrcode e conectar no whatsapp, digite no terminal "node robo.js";
