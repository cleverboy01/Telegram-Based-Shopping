require('dotenv').config();
const express = require('express');
const cors = require('cors');
const db = require('./database');
const bcrypt = require('bcryptjs');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

app.get('/', (req, res) => {
  res.json({ 
    message: '🚀 Shop Backend API Running!',
    endpoints: {
      login: '/api/login',
      register: '/api/register',
      products: '/api/products',
      orders: '/api/orders',
      stats: '/api/stats'
    }
  });
});

app.post('/api/login', async (req, res) => {
  const { email, password } = req.body;
console.log('🔑 Password received:', password);
console.log('🔑 Password type:', typeof password);

  if (!email || !password) {
    return res.status(400).json({ error: "ایمیل و رمز عبور لازم است" });
  }

  try {
    const user = db.prepare('SELECT * FROM users WHERE email = ?').get(email);

    if (!user) {
return res.status(401).json({ error: "ایمیل یا رمز عبور اشتباه است" });
    }

    const passwordHash = user.password_hash;
console.log('🔑 Password hash from DB:', passwordHash);
if (!passwordHash) {
return res.status(401).json({ error: "رمز عبور برای کاربر تنظیم نشده" });
    }
const validPassword = await bcrypt.compare(password, passwordHash);
console.log('🧪 Testing with hardcoded password "123789"...');
    const testResult = await bcrypt.compare('123789', passwordHash);
if (!validPassword) {
return res.status(401).json({ error: "ایمیل یا رمز عبور اشتباه است" });
    }
res.json({ 
      success: true, 
      user: { 
        id: user.id, 
        email: user.email, 
        role: user.role, 
        name: user.name 
      } 
    });
  } catch (error) {
    console.error('💥 Login error:', error);
    res.status(500).json({ error: error.message });
  }
});

app.post('/api/register', async (req, res) => {
  try {
    const { name, email, mobile, password } = req.body;
if (!name || !email || !mobile || !password) {
      return res.status(400).json({ error: 'تمام فیلدها الزامی هستند' });
    }

    const existingEmail = db.prepare('SELECT * FROM users WHERE email = ?').get(email);
    if (existingEmail) {
      return res.status(400).json({ error: 'کاربری با این ایمیل قبلاً ثبت‌نام کرده است' });
    }

    const existingMobile = db.prepare('SELECT * FROM users WHERE mobile = ?').get(mobile);
    if (existingMobile) {
      return res.status(400).json({ error: 'کاربری با این شماره موبایل قبلاً ثبت‌نام کرده است' });
    }

    const passwordHash = await bcrypt.hash(password, 10);

    const userId = Date.now().toString();
    db.prepare(`
      INSERT INTO users (id, name, email, mobile, password_hash, role, created_at)
      VALUES (?, ?, ?, ?, ?, ?, datetime('now'))
    `).run(userId, name, email, mobile, passwordHash, 'customer');
res.json({
      success: true,
      user: {
        id: userId,
        name,
        email,
        mobile,
        role: 'customer',
        createdAt: new Date().toISOString()
      }
    });

  } catch (error) {
    console.error('❌ Registration error:', error);
    res.status(500).json({ error: 'خطا در ثبت‌نام' });
  }
});

app.get('/api/products', (req, res) => {
  try {
    const products = db.prepare('SELECT * FROM products WHERE status = ?').all('published');
    res.json(products.map(p => ({
      ...p,
      images: JSON.parse(p.images || '[]'),
      features: JSON.parse(p.features || '{}'),
      discountPrice: p.discount_price,
      mainImage: p.main_image
    })));
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.post('/api/products', async (req, res) => {
  try {
    const product = req.body;
    
    const productId = Date.now().toString();
    const slug = product.name
      .toLowerCase()
      .replace(/\s+/g, '-')
      .replace(/[^\w\-آ-ی]+/g, '')
      .substring(0, 100);
    
    db.prepare(`
      INSERT INTO products (
        id, sku, name, slug, description, brand, category, 
        price, discount_price, stock, images, main_image, status
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `).run(
      productId,
      `SKU-${productId}`,
      product.name,
      slug,
      product.description || '',
      product.brand || '',
      product.category || '',
      product.price,
      product.discountPrice || null,
      product.stock,
      JSON.stringify(product.images || []),
      product.mainImage || '',
      'published'
    );

    if (process.env.BOT_TOKEN) {
      const TelegramBot = require('node-telegram-bot-api');
      const bot = new TelegramBot(process.env.BOT_TOKEN);
      
      const message = `
🆕 محصول جدید اضافه شد!

📝 نام: ${product.name}
💰 قیمت: ${product.price.toLocaleString('fa-IR')} تومان
📦 موجودی: ${product.stock}
🏷️ دسته‌بندی: ${product.category || 'نامشخص'}
      `;
      
      const admins = db.prepare('SELECT chat_id FROM admins').all();
      for (const admin of admins) {
        try {
          await bot.sendMessage(admin.chat_id, message);
        } catch (err) {
          console.error(`Failed to send to ${admin.chat_id}:`, err.message);
        }
      }
    }

    res.json({ success: true, productId });
  } catch (error) {
    console.error('Error adding product:', error);
    res.status(500).json({ error: error.message });
  }
});

app.put('/api/products/:id', (req, res) => {
  try {
    const { id } = req.params;
    const product = req.body;
    
    db.prepare(`
      UPDATE products 
      SET name = ?, description = ?, brand = ?, category = ?,
          price = ?, discount_price = ?, stock = ?, main_image = ?,
          updated_at = datetime('now')
      WHERE id = ?
    `).run(
      product.name,
      product.description || '',
      product.brand || '',
      product.category || '',
      product.price,
      product.discountPrice || null,
      product.stock,
      product.mainImage || '',
      id
    );

    res.json({ success: true });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.delete('/api/products/:id', (req, res) => {
  try {
    const { id } = req.params;
    db.prepare('DELETE FROM products WHERE id = ?').run(id);
    res.json({ success: true });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.post('/api/orders', async (req, res) => {
  try {
    const order = req.body;
    
    db.prepare(`
      INSERT INTO orders (
        id, order_number, user_id, customer_name, customer_phone,
        items, subtotal, shipping, discount, total, status,
        payment_method, shipping_method, shipping_address
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `).run(
      order.id,
      order.orderNumber,
      order.userId,
      order.shippingAddress.fullName,
      order.shippingAddress.mobile,
      JSON.stringify(order.items),
      order.subtotal,
      order.shipping,
      order.discount,
      order.total,
      order.status,
      order.paymentMethod,
      order.shippingMethod,
      JSON.stringify(order.shippingAddress)
    );

    const TelegramBot = require('node-telegram-bot-api');
    const bot = new TelegramBot(process.env.BOT_TOKEN);
    
    const message = `
🛒 سفارش جدید!

📝 شماره: ${order.orderNumber}
👤 مشتری: ${order.shippingAddress.fullName}
📞 موبایل: ${order.shippingAddress.mobile}
💰 مبلغ: ${order.total.toLocaleString('fa-IR')} تومان
📦 تعداد محصول: ${order.items.length}
💳 روش پرداخت: ${order.paymentMethod === 'online' ? 'آنلاین' : 'نقدی'}
    `;
    
    const admins = db.prepare('SELECT chat_id FROM admins').all();
    for (const admin of admins) {
      try {
        await bot.sendMessage(admin.chat_id, message);
      } catch (err) {
        console.error(`Failed to send to ${admin.chat_id}:`, err.message);
      }
    }
    
    res.json({ success: true, orderId: order.id });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.get('/api/stats', (req, res) => {
  try {
    const stats = {
      totalOrders: db.prepare('SELECT COUNT(*) as count FROM orders').get().count,
      totalRevenue: db.prepare('SELECT SUM(total) as total FROM orders').get().total || 0,
      totalProducts: db.prepare('SELECT COUNT(*) as count FROM products').get().count,
      totalUsers: db.prepare('SELECT COUNT(*) as count FROM users').get().count,
    };
    res.json(stats);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.listen(PORT, () => {
console.log(`📡 API ready at http://localhost:${PORT}/api`);
});
