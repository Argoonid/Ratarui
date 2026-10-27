import { defineConfig, loadEnv } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '')

  return {
    // В проде пути пойдут от /Ratarui/, а локально — от корня
    base: mode === 'production' ? '/Ratarui/' : '/',
    plugins: [
      react(),
      tailwindcss(),
      {
        name: 'local-api-handler',
        configureServer(server) {
          server.middlewares.use('/api/book', async (req, res) => {
            if (req.method !== 'POST') {
              res.statusCode = 405;
              res.end('Method Not Allowed');
              return;
            }

            let body = '';
            req.on('data', chunk => { body += chunk; });
            req.on('end', async () => {
              try {
                const payload = JSON.parse(body);
                const { 
                  table, 
                  guests, 
                  totalPrice, 
                  name, 
                  phone, 
                  hotel, 
                  pairing, 
                  contactMethod, 
                  audioVote 
                } = payload;

                const text = 
                  `🎬 <b>ТЕСТОВАЯ БРОНЬ (Local Dev)</b>\n` +
                  `━━━━━━━━━━━━━━━━━━━━\n` +
                  `🪑 <b>Стол:</b> #${table}\n` +
                  `👥 <b>Гости:</b> ${guests} персона(-ы)\n` +
                  `💵 <b>Депозит:</b> $${totalPrice}\n` +
                  `🍷 <b>Пейринг:</b> ${pairing || 'Не указан'}\n` +
                  `🗣 <b>Голос за дубляж:</b> ${audioVote ? audioVote.toUpperCase() : '—'}\n` +
                  `👤 <b>Имя:</b> ${name}\n` +
                  `📞 <b>Связь:</b> ${phone} (${contactMethod || 'direct'})\n` +
                  `🏨 <b>Отель:</b> ${hotel || '—'}`;

                if (env.TELEGRAM_BOT_TOKEN && env.TELEGRAM_CHAT_ID) {
                  await fetch(`https://api.telegram.org/bot${env.TELEGRAM_BOT_TOKEN}/sendMessage`, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                      chat_id: env.TELEGRAM_CHAT_ID,
                      text,
                      parse_mode: 'HTML'
                    })
                  });
                }

                res.statusCode = 200;
                res.setHeader('Content-Type', 'application/json');
                res.end(JSON.stringify({ success: true }));
              } catch (e) {
                res.statusCode = 500;
                res.end(JSON.stringify({ error: e.message }));
              }
            });
          });
        }
      }
    ],
    server: {
      host: '127.0.0.1',
      port: 5173,
    },
  }
})