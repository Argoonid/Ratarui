export default async (req) => {
  if (req.method !== 'POST') {
    return new Response('Method Not Allowed', { status: 405 });
  }

  try {
    const payload = await req.json();
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

    const token = process.env.TELEGRAM_BOT_TOKEN;
    const chatId = process.env.TELEGRAM_CHAT_ID;

    if (!token || !chatId) {
      return new Response(JSON.stringify({ error: 'Server env variables missing' }), {
        status: 500,
        headers: { 'Content-Type': 'application/json' }
      });
    }

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

    if (!tgRes.ok) {
      const tgErr = await tgRes.text();
      return new Response(JSON.stringify({ error: tgErr }), { status: 502 });
    }

    return new Response(JSON.stringify({ success: true }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' }
    });
  } catch (err) {
    return new Response(JSON.stringify({ error: err.message }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
  }
};