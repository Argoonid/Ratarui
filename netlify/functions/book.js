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
    console.error('Missing ENV variables in Netlify Function!');
    return {
      statusCode: 500,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ 
        error: 'Netlify ENV variables missing. Check TELEGRAM_BOT_TOKEN and TELEGRAM_CHAT_ID in Site settings.' 
      })
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
      audioVote 
    } = payload;

    const text = 
      `🎬 <b>НОВАЯ БРОНЬ: КИНО-УЖИН «РАТАТУЙ»</b>\n` +
      `━━━━━━━━━━━━━━━━━━━━\n` +
      `🪑 <b>Стол:</b> #${table}\n` +
      `👥 <b>Гости:</b> ${guests} персона(-ы)\n` +
      `💵 <b>Депозит:</b> $${totalPrice}\n` +
      `🍷 <b>Пейринг:</b> ${pairing || 'Не указан'}\n` +
      `🗣 <b>Голос за дубляж:</b> ${audioVote ? audioVote.toUpperCase() : '—'}\n` +
      `👤 <b>Гость:</b> ${name}\n` +
      `📞 <b>Связь:</b> ${phone} (${contactMethod || 'direct'})\n` +
      `🏨 <b>Отель:</b> ${hotel || '—'}`;

    const tgRes = await fetch(`https://api.telegram.org/bot${token}/sendMessage`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        chat_id: chatId,
        text,
        parse_mode: 'HTML'
      })
    });

    const tgData = await tgRes.json();

    if (!tgRes.ok) {
      console.error('Telegram API rejected request:', tgData);
      return {
        statusCode: 502,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ error: tgData.description || 'Telegram API Error' })
      };
    }

    return {
      statusCode: 200,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ success: true })
    };
  } catch (err) {
    console.error('Function execution crash:', err);
    return {
      statusCode: 500,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ error: err.message })
    };
  }
};