// leitor de qr code
const qrcode = require('qrcode-terminal');
const { Client, Buttons, List, MessageMedia } = require('whatsapp-web.js');
const fs = require('fs');
const client = new Client();

const delay = ms => new Promise(res => setTimeout(res, ms)); // Função que usamos para criar o delay entre uma ação e outra

let mensagemrecebida = {};
let contatosBloqueados = [];
let contextoUsuario = {}; // Armazena o estado da conversa de cada usuário (ex: se está aguardando dúvida)

// Lista de bloqueados
function carregarBloqueados() {
    try {
        const data = fs.readFileSync('./bloqueados.json', 'utf8');
        contatosBloqueados = JSON.parse(data);
        console.log('Lista de bloqueados carregada:', contatosBloqueados);
    } catch (err) {
        console.error('Erro ao carregar lista de bloqueados:', err);
    }
}

carregarBloqueados();

// Verifica se a lista de contatos foi alterada e faz o reload do arquivo
fs.watchFile('./bloqueados.json', () => {
    console.log('bloqueados.json foi alterado. Recarregando...');
    carregarBloqueados();
});

// serviço de leitura do qr code
client.on('qr', qr => {
    qrcode.generate(qr, {small: true});
    console.log('Escaneie o QR Code com seu WhatsApp.');
});

// apos isso ele diz que foi tudo certo
client.on('ready', () => {
    console.log('Tudo certo! WhatsApp conectado.');
});

client.initialize();

client.on('message', async msg => {

    if (!msg.from.endsWith('@c.us')) {  // Verificar se a mensagem recebida não é de um grupo e se o remetente é um usuário individual.
        return;
    }

    const numeroContato = msg.from.trim();
    const texto = msg.body.trim().toLowerCase(); // Normalização

    if (contatosBloqueados.includes(numeroContato)) { // Verifica se a mensagem recebida é de algum contato na lista de bloqueados, se sim, não segue com o código do chat
        console.log(`Mensagem ignorada de ${numeroContato} - contato bloqueado.`);
        return;
    }

    const opcoesValidas = ['1', '2', '3', '4', '5', 'menu'];

    const chat = await msg.getChat();

    if (!mensagemrecebida[msg.from]) {
        mensagemrecebida[msg.from] = true;

        await chat.sendStateTyping(); // Simulando Digitação
        await delay(2000); //Delay de 2 segundos

        const contact = await msg.getContact(); // Pegando o contato
        const name = contact.pushname || 'amigo(a)'; // Define um valor padrão se for undefined
        await client.sendMessage(msg.from, 'Olá ' + name.split(" ")[0] + '! Sou o assistente virtual do Central da Bola.\n\nPara visualizar nossas opções, digite "menu".');  

        return;
    }

    // Se digitar "menu", volta para o menu principal e reseta o contexto
    if (texto === 'menu') {
        contextoUsuario[msg.from] = null; // Zera o estado de dúvida (se estiver ativo)
        await chat.sendStateTyping(); // Simulando Digitação
        await delay(2000); //Delay de 2 segundos
        await client.sendMessage(msg.from,'MENU:\n\n[1] - Agendar horário\n[2] - Cancelar ou alterar horário\n[3] - Valor do horário\n[4] - Localização\n[5] - Outras perguntas'); 
        return;
    }

    // Se o usuário estiver no modo "aguardando_duvida"
    if (contextoUsuario[msg.from] && contextoUsuario[msg.from].estado === 'aguardando_duvida') {
        const agora = Date.now();
        const expirou = agora - contextoUsuario[msg.from].timestamp > 5 * 60 * 1000; // 5 minutos em ms
    
        if (expirou) {
            // Se passou de 5 minutos, reseta o contexto
            contextoUsuario[msg.from] = null;
        } else {
            // Se ainda estiver no tempo, responde uma vez e silencia depois
            if (!contextoUsuario[msg.from].mensagemRecebida) {
                await chat.sendStateTyping();
                await delay(2000);
                await client.sendMessage(msg.from, 'Obrigado pela sua pergunta! Em breve alguém da equipe irá te responder. Caso queira voltar ao início, digite "menu".');
                contextoUsuario[msg.from].mensagemRecebida = true;
            }
            return;
        }
    }

    if (texto === '1') {
        await chat.sendStateTyping(); // Simulando Digitação
        await delay(2000); //Delay de 2 segundos
        await client.sendMessage(msg.from, 'Para agendar seu horário, acesse o link abaixo.\n\nhttps://calendly.com/centraldabola-esplanada/agendarhorario');

        await chat.sendStateTyping(); // Simulando Digitação
        await delay(2000); //Delay de 2 segundos
        await client.sendMessage(msg.from, 'Após o agendamento do seu horário, você receberá um email com todas as informações. Nesse email terá os links caso precise reagendar ou cancelar seu horário.');

        await chat.sendStateTyping(); // Simulando Digitação
        await delay(2000); //Delay de 2 segundos
        await client.sendMessage(msg.from, 'Para selecionar outra opção desejada, digite "menu".');
        return;
    }

    if (texto === '2') {
        await chat.sendStateTyping(); // Simulando Digitação
        await delay(2000); //Delay de 2 segundos
        await client.sendMessage(msg.from, 'Você pode cancelar ou alterar seu horário agendado no máximo 24 horas antes, caso contrário deverá ser pago o valor integral do horário.\n\n Caso esteja dentro do prazo, acesse o seu email que foi informado no momento do agendamento.');

        await chat.sendStateTyping(); // Simulando Digitação
        await delay(2000); //Delay de 2 segundos
        await client.sendMessage(msg.from, 'Para selecionar outra opção desejada, digite "menu".');
        return;
    }

    if (texto === '3') {
        await chat.sendStateTyping(); // Simulando Digitação
        await delay(2000); //Delay de 2 segundos
        await client.sendMessage(msg.from, '*Valor do horário:* R$180,00.');

        await chat.sendStateTyping(); // Simulando Digitação
        await delay(2000); //Delay de 2 segundos
        await client.sendMessage(msg.from, 'Para selecionar outra opção desejada, digite "menu".');
        return;
    }

    if (texto === '4') {
        await chat.sendStateTyping(); // Simulando Digitação
        await delay(2000); //Delay de 2 segundos
        await client.sendMessage(msg.from, 'Para ver nossa localização, acesse o link abaixo.\n\nhttps://maps.app.goo.gl/qBTWwHprP89EiTk57');

        await chat.sendStateTyping(); // Simulando Digitação
        await delay(2000); //Delay de 2 segundos
        await client.sendMessage(msg.from, 'Para selecionar outra opção desejada, digite "menu".');
        return;
    }

    if (texto === '5') {
        await chat.sendStateTyping(); // Simulando Digitação
        await delay(2000); //Delay de 2 segundos
        await client.sendMessage(msg.from, 'Se você tiver outras dúvidas ou precisar de mais informações, por favor, fale aqui nesse whatsapp que logo responderemos.');

        // Entra no modo de dúvidas livres e marca que ainda não respondeu nenhuma mensagem
        contextoUsuario[msg.from] = {
        estado: 'aguardando_duvida',
        mensagemRecebida: false,
        timestamp: Date.now() // Salva o horário da entrada
        };
        return;
    }

    // Caso a opção seja inválida
    if (!opcoesValidas.includes(texto)) {
        await chat.sendStateTyping();
        await delay(2000); //Delay de 2 segundos
        await client.sendMessage(msg.from, 'Desculpe, não entendi. Por favor, digite "menu" para visualizar as opções.');
        return;
    }
});
