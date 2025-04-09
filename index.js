require('dotenv').config();
const venom = require('venom-bot');
const axios = require('axios');

const openaiKey = process.env.OPENAI_API_KEY;

venom
  .create()
  .then((client) => start(client))
  .catch((err) => console.error('Erro ao iniciar o Venom:', err));

function start(client) {
  client.onMessage(async (message) => {
    if (message.body && !message.isGroupMsg) {
      try {
        const response = await axios.post(
          'https://api.openai.com/v1/chat/completions',
          {
            model: 'gpt-3.5-turbo',
            messages: [{ role: 'user', content: message.body }],
          },
          {
            headers: {
              'Content-Type': 'application/json',
              Authorization: `Bearer ${openaiKey}`,
            },
          }
        );

        const resposta = response.data.choices[0].message.content.trim();
        client.sendText(message.from, resposta);
      } catch (err) {
        console.error('Erro ao conversar com o ChatGPT:', err);
        client.sendText(message.from, 'Erro ao obter resposta da IA.');
      }
    }
  });
}

