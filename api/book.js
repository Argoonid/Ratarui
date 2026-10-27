export default async function handler(req, res) {
  // Отсекаем все методы кроме POST
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { table, guests, totalPrice, name, phone, hotel, timestamp } = req.body || {};

  // Валидация входных данных
  if (!table || !name || !phone) {
    return res.status(400).json({ error: 'Missing required booking fields' });
  }

  const botToken = process.env.TELEGRAM_BOT_TOKEN;
  const chatId = process.env.TELEGRAM_CHAT_ID;

  if (!botToken || !chatId) {
    console.error('Telegram credentials not configured in environment');
    return res.status(500).json({ error: 'Server configuration error' });
  }

  // Форматирование сообщения для Telegram
  const message = [
    // В сообщении телеграма:
`🎫 <b>ВЫПУЩЕН ИМЕННОЙ VIP-БИЛЕТ</b>\n` +
`━━━━━━━━━━━━━━━━━━━━\n` +
`🎟 <b>Номер:</b> № 0815${String(table).padStart(2, '0')}\n` +
`👤 <b>Гость:</b> ${name}\n` +
`🪑 <b>Столик:</b> #${table} (${guests} персоны)\n` +
`🍷 <b>Пейринг:</b> ${pairing}\n` +
`🏨 <b>Отель:</b> ${hotel || 'Уточняется'}\n` +
`📞 <b>Связь:</b> ${phone} (${contactMethod})\n` +
`━━━━━━━━━━━━━━━━━━━━\n` +
`⚜️ <i>Статус: Сургуч наложен (Гюсто / Эго)</i>`
  ].join('\n');

  try {
    const telegramRes = await fetch(`https://api.telegram.org/bot${botToken}/sendMessage`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        chat_id: chatId,
        text: message,
        parse_mode: 'HTML'
      })
    });

    const data = await telegramRes.json();

    if (!data.ok) {
      console.error('Telegram API error:', data);
      return res.status(502).json({ error: 'Failed to deliver message to Telegram' });
    }

    return res.status(200).json({ success: true });
  } catch (err) {
    console.error('Internal webhook error:', err);
    return res.status(500).json({ error: 'Internal server error' });
  }
}