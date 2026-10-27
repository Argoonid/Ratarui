export const handler = async (event) => {
  if (event.httpMethod !== 'POST') {
    return {
      statusCode: 405,
      body: JSON.stringify({ error: 'Method Not Allowed' })
    };
  }

  const token = process.env.TELEGRAM_BOT_TOKEN;
  const chatId = process.env.TELEGRAM_CHAT_ID;

  if (!token || !chatId) {
    return {
      statusCode: 500,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ error: 'Telegram secrets missing in Netlify configuration' })
    };
  }

  try {
    const payload = JSON.parse(event.body || '{}');
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
      photoBase64 
    } = payload;

    const caption = 
      `🎫 <b>НОВАЯ БРОНЬ: ЛИСТ ОЖИДАНИЯ «РАТАТУЙ»</b>\n` +
      `━━━━━━━━━━━━━━━━━━━━\n` +
      `🪑 <b>Столик:</b> #${table}\n` +
      `👥 <b>Гости:</b> ${guests} персона(-ы)\n` +
      `💵 <b>Депозит:</b> $${totalPrice}\n` +
      `🍷 <b>Пейринг:</b> ${pairing || 'Французский винный сет'}\n` +
      `🗣 <b>Голос за дубляж:</b> ${audioVote ? audioVote.toUpperCase() : '—'}\n` +
      `👤 <b>Гость:</b> ${name}\n` +
      `📞 <b>Связь:</b> ${phone} (${contactMethod || 'direct'})\n` +
      `🏨 <b>Отель:</b> ${hotel || 'Не указан'}\n` +
      `⏳ <i>Формирование группы: уведомить о дате сеанса</i>`;

    // Если клиент передал отрендеренный билет — отправляем фотокарточкой
    if (photoBase64 && photoBase64.startsWith('data:image')) {
      const cleanBase64 = photoBase64.replace(/^data:image\/\w+;base64,/, '');
      const buffer = Buffer.from(cleanBase64, 'base64');
      const blob = new Blob([buffer], { type: 'image/png' });

      const form = new FormData();
      form.append('chat_id', chatId);
      form.append('photo', blob, `golden-ticket-${table}.png`);
      form.append('caption', caption);
      form.append('parse_mode', 'HTML');

      const tgRes = await fetch(`https://api.telegram.org/bot${token}/sendPhoto`, {
        method: 'POST',
        body: form
      });

      if (tgRes.ok) {
        return {
          statusCode: 200,
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ success: true, mode: 'photo' })
        };
      }
      
      console.warn('sendPhoto failed, falling back to sendMessage');
    }

    // Резервный текстовый канал
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

    return {
      statusCode: textRes.ok ? 200 : 502,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(textRes.ok ? { success: true, mode: 'text' } : { error: textData.description })
    };

  } catch (err) {
    return {
      statusCode: 500,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ error: err.message })
    };
  }
};