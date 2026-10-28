export default {
  async fetch(request, env) {
    const url = new URL(request.url);

    if (url.pathname === '/api/book') {
      if (request.method !== 'POST') {
        return new Response(JSON.stringify({ error: 'Method Not Allowed' }), {
          status: 405,
          headers: { 'Content-Type': 'application/json' }
        });
      }

      const token = env?.TELEGRAM_BOT_TOKEN;
      const chatId = env?.TELEGRAM_CHAT_ID;

      if (!token || !chatId) {
        return new Response(
          JSON.stringify({ error: 'Telegram credentials missing' }), 
          { status: 500, headers: { 'Content-Type': 'application/json' } }
        );
      }

      try {
        const payload = await request.json();
        const { 
          table, 
          guests, 
          totalPrice, 
          name, 
          phone, 
          hotel, 
          pairing, 
          contactMethod, 
          audioVote,
          photoBase64,
          ref // <-- Реферальная метка
        } = payload;

        // Контрастный заголовок при наличии партнера
        const partnerBadge = ref 
          ? `🎯 <b>ПАРТНЕРСКИЙ ЛИД:</b> <code>#${ref.toUpperCase()}</code>\n` +
            `🤝 <b>Источник:</b> <i>Канал партнера / QR-код</i>\n` +
            `────────────────────\n`
          : '';

        const caption = 
          `🎫 <b>НОВАЯ БРОНЬ: «РАТАТУЙ»</b>\n` +
          partnerBadge +
          `🪑 <b>Столик:</b> #${table}\n` +
          `👥 <b>Гости:</b> ${guests} персона(-ы)\n` +
          `💵 <b>Депозит:</b> $${totalPrice}\n` +
          `🍷 <b>Пейринг:</b> ${pairing || 'Французский винный сет'}\n` +
          `🗣 <b>Голос за дубляж:</b> ${audioVote ? audioVote.toUpperCase() : '—'}\n` +
          `👤 <b>Гость:</b> ${name}\n` +
          `📞 <b>Связь:</b> ${phone} (${contactMethod || 'direct'})\n` +
          `🏨 <b>Отель:</b> ${hotel || 'Не указан'}\n` +
          `⏳ <i>Статус: Лист ожидания группы</i>`;

        if (photoBase64 && photoBase64.startsWith('data:image')) {
          const base64Data = photoBase64.split(',')[1];
          const binaryString = atob(base64Data);
          const bytes = new Uint8Array(binaryString.length);
          for (let i = 0; i < binaryString.length; i++) {
            bytes[i] = binaryString.charCodeAt(i);
          }
          const photoFile = new File([bytes], `ticket-${table}.png`, { type: 'image/png' });

          const form = new FormData();
          form.append('chat_id', chatId);
          form.append('photo', photoFile);
          form.append('caption', caption);
          form.append('parse_mode', 'HTML');

          const tgRes = await fetch(`https://api.telegram.org/bot${token}/sendPhoto`, {
            method: 'POST',
            body: form
          });

          if (tgRes.ok) {
            return new Response(JSON.stringify({ success: true, mode: 'photo' }), {
              status: 200,
              headers: { 'Content-Type': 'application/json' }
            });
          }
        }

        const textRes = await fetch(`https://api.telegram.org/bot${token}/sendMessage`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            chat_id: chatId,
            text: caption,
            parse_mode: 'HTML'
          })
        });

        const textData = await textRes.json();
        return new Response(
          JSON.stringify(textRes.ok ? { success: true, mode: 'text' } : { error: textData.description }), 
          { status: textRes.ok ? 200 : 502, headers: { 'Content-Type': 'application/json' } }
        );

      } catch (err) {
        return new Response(JSON.stringify({ error: err.message }), {
          status: 500,
          headers: { 'Content-Type': 'application/json' }
        });
      }
    }

    return env.ASSETS.fetch(request);
  }
};