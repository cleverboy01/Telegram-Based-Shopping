require('dotenv').config();
const TelegramBot = require('node-telegram-bot-api');
const db = require('./database');
const bcrypt = require('bcryptjs');

const BOT_TOKEN = process.env.BOT_TOKEN;
const MAIN_ADMIN_CHAT_ID = parseInt(process.env.MAIN_ADMIN_CHAT_ID);

if (!BOT_TOKEN || !MAIN_ADMIN_CHAT_ID) {
  console.error('❌ BOT_TOKEN or MAIN_ADMIN_CHAT_ID not set in .env');
  process.exit(1);
}

const bot = new TelegramBot(BOT_TOKEN, { polling: true });

const userStates = new Map();

function setState(chatId, state, data = {}) {
  userStates.set(chatId, { state, data, timestamp: Date.now() });
}

function getState(chatId) {
  return userStates.get(chatId) || null;
}

function clearState(chatId) {
  userStates.delete(chatId);
}

function isAdmin(chatId) {
  const admin = db.prepare('SELECT * FROM admins WHERE chat_id = ?').get(chatId);
  return !!admin;
}

function isMainAdmin(chatId) {
  return chatId === MAIN_ADMIN_CHAT_ID;
}

const mainMenu = {
  reply_markup: {
    keyboard: [
      ['📊 آمار فروش', '👥 مشتریان'],
      ['📦 محصولات', '🛒 سفارشات'],
      ['👨‍💼 ادمین‌ها', '⚙️ تنظیمات'],
    ],
    resize_keyboard: true
  }
};

bot.onText(/\/start/, (msg) => {
  const chatId = msg.chat.id;
  
  if (!isAdmin(chatId)) {
    bot.sendMessage(chatId, 
      '❌ شما دسترسی ندارید!\n\n' +
      'فقط ادمین‌های تایید شده می‌توانند از این بات استفاده کنند.\n\n' +
      `Chat ID شما: ${chatId}`
    );
    return;
  }
  
  clearState(chatId);
  bot.sendMessage(chatId, 
    '👋 سلام! به پنل مدیریت فروشگاه خوش آمدید.\n\nیکی از گزینه‌های زیر را انتخاب کنید:', 
    mainMenu
  );
});

bot.onText(/📊 آمار فروش/, (msg) => {
  const chatId = msg.chat.id;
  if (!isAdmin(chatId)) return;
  
  try {
    const stats = {
      orders: db.prepare('SELECT COUNT(*) as count FROM orders').get().count,
      revenue: db.prepare('SELECT SUM(total) as total FROM orders').get().total || 0,
      products: db.prepare('SELECT COUNT(*) as count FROM products').get().count,
      todayOrders: db.prepare(`
        SELECT COUNT(*) as count FROM orders 
        WHERE date(created_at) = date('now')
      `).get().count,
    };
    
    const message = `
📊 آمار فروشگاه:

🛒 کل سفارشات: ${stats.orders}
📦 سفارشات امروز: ${stats.todayOrders}
💰 مجموع فروش: ${stats.revenue.toLocaleString('fa-IR')} تومان
📦 تعداد محصولات: ${stats.products}
    `;
    
    bot.sendMessage(chatId, message);
  } catch (error) {
    bot.sendMessage(chatId, `❌ خطا: ${error.message}`);
  }
});

bot.onText(/📦 محصولات/, (msg) => {
  const chatId = msg.chat.id;
  if (!isAdmin(chatId)) return;
  
  const keyboard = {
    reply_markup: {
      inline_keyboard: [
        [{ text: '➕ افزودن محصول', callback_data: 'add_product' }],
        [{ text: '📋 لیست محصولات', callback_data: 'list_products' }],
        [{ text: '🗑️ حذف محصول', callback_data: 'delete_product' }],
      ]
    }
  };
  
  bot.sendMessage(chatId, 'مدیریت محصولات:', keyboard);
});

bot.onText(/🛒 سفارشات/, (msg) => {
  const chatId = msg.chat.id;
  if (!isAdmin(chatId)) return;
  
  try {
    const orders = db.prepare('SELECT * FROM orders ORDER BY created_at DESC LIMIT 10').all();
    
    if (orders.length === 0) {
      bot.sendMessage(chatId, '❌ هیچ سفارشی یافت نشد!');
      return;
    }
    
    let text = '🛒 لیست سفارشات (10 سفارش اخیر):\n\n';
    orders.forEach((o, i) => {
      text += `${i + 1}. سفارش #${o.order_number}\n`;
      text += `   👤 ${o.customer_name}\n`;
      text += `   💰 ${o.total.toLocaleString('fa-IR')} تومان\n`;
      text += `   📊 ${getStatusLabel(o.status)}\n\n`;
    });
    
    bot.sendMessage(chatId, text);
  } catch (error) {
    bot.sendMessage(chatId, `❌ خطا: ${error.message}`);
  }
});

bot.onText(/👨‍💼 ادمین‌ها/, (msg) => {
  const chatId = msg.chat.id;
  
  if (!isMainAdmin(chatId)) {
    bot.sendMessage(chatId, '❌ فقط ادمین اصلی می‌تواند ادمین‌ها را مدیریت کند!');
    return;
  }
  
  const keyboard = {
    reply_markup: {
      inline_keyboard: [
        [{ text: '➕ افزودن ادمین', callback_data: 'add_admin' }],
        [{ text: '📋 لیست ادمین‌ها', callback_data: 'list_admins' }],
      ]
    }
  };
  
  bot.sendMessage(chatId, 'مدیریت ادمین‌ها:', keyboard);
});

bot.on('callback_query', async (query) => {
  const chatId = query.message.chat.id;
  
  if (query.data === 'list_products') {
    try {
      const products = db.prepare('SELECT * FROM products ORDER BY created_at DESC LIMIT 15').all();
      
      if (products.length === 0) {
        bot.sendMessage(chatId, '❌ هیچ محصولی یافت نشد!\n\nبرای افزودن محصول، دکمه "➕ افزودن محصول" را بزنید.');
        return;
      }
      
      let text = '📦 لیست محصولات:\n\n';
      products.forEach((p, i) => {
        text += `${i + 1}. ${p.name}\n`;
        text += `   💰 ${p.price.toLocaleString('fa-IR')} تومان`;
        if (p.discount_price) {
          text += ` (تخفیف: ${p.discount_price.toLocaleString('fa-IR')})`;
        }
        text += `\n   📦 موجودی: ${p.stock}\n`;
        text += `   🏷️ ${p.category || 'بدون دسته‌بندی'}\n`;
        text += `   📊 ${p.status === 'published' ? '✅ منتشر شده' : '❌ پیش‌نویس'}\n\n`;
      });
      
      bot.sendMessage(chatId, text);
    } catch (error) {
      bot.sendMessage(chatId, `❌ خطا: ${error.message}`);
    }
  }
  
  if (query.data === 'add_product') {
    clearState(chatId);
    setState(chatId, 'awaiting_product_name');
    bot.sendMessage(chatId, 
      '📝 نام محصول را وارد کنید:\n\n' +
      'مثال: لپ‌تاپ ایسوس VivoBook\n\n' +
      '(برای انصراف /cancel را بزنید)'
    );
  }
  
  if (query.data === 'delete_product') {
    bot.sendMessage(chatId, 
      '🗑️ برای حذف محصول:\n\n' +
      '/deleteproduct ID_محصول\n\n' +
      'ابتدا با گزینه "📋 لیست محصولات" شناسه محصول را پیدا کنید.'
    );
  }
  
  if (query.data === 'list_admins') {
    const admins = db.prepare('SELECT * FROM admins').all();
    
    let text = '👨‍💼 لیست ادمین‌ها:\n\n';
    admins.forEach((admin, i) => {
      text += `${i + 1}. ${admin.username}`;
      if (admin.is_main_admin) text += ' ⭐ ادمین اصلی';
      text += `\n   Chat ID: ${admin.chat_id}\n`;
      text += `   تاریخ: ${new Date(admin.created_at).toLocaleDateString('fa-IR')}\n\n`;
    });
    
    bot.sendMessage(chatId, text);
  }
  
  if (query.data === 'add_admin') {
    bot.sendMessage(chatId, 
      '➕ برای افزودن ادمین جدید:\n\n' +
      '/addadmin CHAT_ID username password\n\n' +
      'مثال:\n/addadmin 123456789 ali ali123\n\n' +
      '⚠️ ابتدا فرد مورد نظر باید به ربات پیام /start بفرستد و Chat ID خود را دریافت کند.'
    );
  }
  
  await bot.answerCallbackQuery(query.id);
});

bot.on('message', (msg) => {
  const chatId = msg.chat.id;
  const text = msg.text;
  
  if (!isAdmin(chatId)) return;
  if (!text) return;
  if (text.startsWith('/')) return; // Skip commands
  
  const state = getState(chatId);
  if (!state) return;
  
  try {
    switch (state.state) {
      case 'awaiting_product_name':
        setState(chatId, 'awaiting_product_price', { ...state.data, name: text });
        bot.sendMessage(chatId, 
          '💰 قیمت محصول را وارد کنید (به تومان):\n\n' +
          'مثال: 25000000 یا 25,000,000'
        );
        break;
        
      case 'awaiting_product_price':
        const price = parseInt(text.replace(/,/g, ''));
        if (isNaN(price) || price <= 0) {
          bot.sendMessage(chatId, '❌ قیمت نامعتبر است. لطفاً عدد صحیح وارد کنید.');
          return;
        }
        setState(chatId, 'awaiting_product_stock', { ...state.data, price });
        bot.sendMessage(chatId, '📦 تعداد موجودی را وارد کنید:\n\nمثال: 10');
        break;
        
      case 'awaiting_product_stock':
        const stock = parseInt(text);
        if (isNaN(stock) || stock < 0) {
          bot.sendMessage(chatId, '❌ تعداد نامعتبر است. لطفاً عدد صحیح وارد کنید.');
          return;
        }
        setState(chatId, 'awaiting_product_category', { ...state.data, stock });
        bot.sendMessage(chatId, 
          '🏷️ دسته‌بندی محصول را وارد کنید:\n\n' +
          'مثال: لوازم الکترونیکی، موبایل و تبلت، لوازم خانگی'
        );
        break;
        
      case 'awaiting_product_category':
        setState(chatId, 'awaiting_product_description', { ...state.data, category: text });
        bot.sendMessage(chatId, 
          '📄 توضیحات محصول را وارد کنید:\n\n' +
          '(یا /skip برای رد کردن)'
        );
        break;
        
      case 'awaiting_product_description':
        const description = text === '/skip' ? '' : text;
        setState(chatId, 'awaiting_product_image', { ...state.data, description });
        bot.sendMessage(chatId, 
          '🖼️ لینک تصویر محصول را وارد کنید:\n\n' +
          'مثال: https://example.com/image.jpg\n\n' +
          '(یا /skip برای استفاده از تصویر پیش‌فرض)'
        );
        break;
        
      case 'awaiting_product_image':
        const productData = state.data;
        const imageUrl = text === '/skip' ? 'https://via.placeholder.com/600x400?text=No+Image' : text;
        
        const productId = Date.now().toString();
        const slug = productData.name
          .toLowerCase()
          .replace(/\s+/g, '-')
          .replace(/[^\w\-آ-ی]+/g, '')
          .substring(0, 100);
        
        db.prepare(`
          INSERT INTO products (
            id, sku, name, slug, description, category, 
            price, stock, images, main_image, status
          ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
        `).run(
          productId,
          `SKU-${productId}`,
          productData.name,
          slug,
          productData.description || '',
          productData.category,
          productData.price,
          productData.stock,
          JSON.stringify([imageUrl]),
          imageUrl,
          'published'
        );
        
        clearState(chatId);
        
        bot.sendMessage(chatId, 
          `✅ محصول با موفقیت اضافه شد!\n\n` +
          `📝 نام: ${productData.name}\n` +
          `💰 قیمت: ${productData.price.toLocaleString('fa-IR')} تومان\n` +
          `📦 موجودی: ${productData.stock}\n` +
          `🏷️ دسته‌بندی: ${productData.category}\n\n` +
          `محصول در سایت فروشگاه قابل مشاهده است.`,
          mainMenu
        );
        break;
    }
  } catch (error) {
    bot.sendMessage(chatId, `❌ خطا در ذخیره محصول: ${error.message}`);
    clearState(chatId);
  }
});

bot.onText(/\/cancel/, (msg) => {
  const chatId = msg.chat.id;
  clearState(chatId);
  bot.sendMessage(chatId, '❌ عملیات لغو شد.', mainMenu);
});

bot.onText(/\/addadmin (\d+) (\w+) (.+)/, async (msg, match) => {
  const chatId = msg.chat.id;
  
  if (!isMainAdmin(chatId)) {
    bot.sendMessage(chatId, '❌ فقط ادمین اصلی می‌تواند ادمین اضافه کند!');
    return;
  }
  
  const newChatId = parseInt(match[1]);
  const username = match[2];
  const password = match[3];
  
  try {
    const passwordHash = await bcrypt.hash(password, 10);
    
    db.prepare(`
      INSERT INTO admins (chat_id, username, password_hash, created_by)
      VALUES (?, ?, ?, ?)
    `).run(newChatId, username, passwordHash, chatId);
    
    bot.sendMessage(chatId, `✅ ادمین ${username} با موفقیت اضافه شد!`);
    
    bot.sendMessage(newChatId, 
      `🎉 شما به عنوان ادمین فروشگاه اضافه شدید!\n\n` +
      `👤 یوزرنیم: ${username}\n` +
      `🔐 رمز عبور: ${password}\n\n` +
      `دستور /start را بزنید تا شروع کنید.`
    ).catch(() => {
      bot.sendMessage(chatId, '⚠️ ادمین اضافه شد اما پیام به او ارسال نشد. احتمالاً ربات را start نکرده است.');
    });
    
  } catch (error) {
    if (error.message.includes('UNIQUE constraint')) {
      bot.sendMessage(chatId, '❌ این Chat ID یا یوزرنیم قبلاً ثبت شده است!');
    } else {
      bot.sendMessage(chatId, `❌ خطا: ${error.message}`);
    }
  }
});

function getStatusLabel(status) {
  const labels = {
    pending: '⏳ در انتظار',
    paid: '✅ پرداخت شده',
    preparing: '📦 در حال آماده‌سازی',
    shipped: '🚚 ارسال شده',
    delivered: '✅ تحویل داده شده',
    cancelled: '❌ لغو شده',
  };
  return labels[status] || status;
}

bot.on('polling_error', (error) => {
  console.error('❌ Polling error:', error.message);
});
console.log(`📡 Main Admin Chat ID: ${MAIN_ADMIN_CHAT_ID}`);
