// API服务器
// 为前端提供RESTful API接口

const express = require('express');
const cors = require('cors');
const path = require('path');
const Database = require('./db');

const app = express();
const PORT = process.env.PORT || 3000;

// 中间件
app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname, '..')));

// 初始化数据库
const db = new Database();

// 身份验证中间件（简化版）
const authenticate = (req, res, next) => {
    const token = req.headers.authorization;
    if (!token) {
        return res.status(401).json({ error: '未授权访问' });
    }
    // 简化验证，实际应该验证JWT token
    next();
};

// 管理员身份验证
const authenticateAdmin = (req, res, next) => {
    const token = req.headers.authorization;
    if (!token) {
        return res.status(401).json({ error: '需要管理员权限' });
    }
    // 简化验证
    next();
};

// 公共API接口

// 获取所有服务
app.get('/api/services', (req, res) => {
    try {
        const services = db.getAllServices();
        res.json({ success: true, data: services });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
});

// 根据ID获取服务
app.get('/api/services/:id', (req, res) => {
    try {
        const service = db.getServiceById(req.params.id);
        if (!service) {
            return res.status(404).json({ success: false, error: '服务不存在' });
        }
        res.json({ success: true, data: service });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
});

// 获取所有文章
app.get('/api/articles', (req, res) => {
    try {
        const articles = db.getAllArticles();
        res.json({ success: true, data: articles });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
});

// 根据ID获取文章
app.get('/api/articles/:id', (req, res) => {
    try {
        const article = db.getArticleById(req.params.id);
        if (!article) {
            return res.status(404).json({ success: false, error: '文章不存在' });
        }
        res.json({ success: true, data: article });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
});

// 获取所有常见问题
app.get('/api/faqs', (req, res) => {
    try {
        const faqs = db.getAllFaqs();
        res.json({ success: true, data: faqs });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
});

// 获取系统设置
app.get('/api/settings', (req, res) => {
    try {
        const settings = db.getAllSettings();
        const publicSettings = settings.filter(s => s.is_public);
        res.json({ success: true, data: publicSettings });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
});

// 用户注册
app.post('/api/register', (req, res) => {
    try {
        const { username, email, password, phone, company_name } = req.body;
        
        if (!username || !email || !password) {
            return res.status(400).json({ success: false, error: '用户名、邮箱和密码为必填项' });
        }
        
        // 检查用户是否已存在
        if (db.getUserByEmail(email)) {
            return res.status(400).json({ success: false, error: '邮箱已被注册' });
        }
        
        if (db.getUserByUsername(username)) {
            return res.status(400).json({ success: false, error: '用户名已被使用' });
        }
        
        const newUser = db.createUser({
            username,
            email,
            password, // 实际应该加密存储
            phone,
            company_name
        });
        
        res.json({ 
            success: true, 
            message: '注册成功',
            data: { id: newUser.id, username: newUser.username, email: newUser.email }
        });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
});

// 用户登录
app.post('/api/login', (req, res) => {
    try {
        const { username, password } = req.body;
        
        if (!username || !password) {
            return res.status(400).json({ success: false, error: '用户名和密码为必填项' });
        }
        
        const user = db.getUserByUsername(username);
        if (!user || user.password !== password) { // 实际应该验证加密密码
            return res.status(401).json({ success: false, error: '用户名或密码错误' });
        }
        
        // 更新最后登录时间
        db.updateUser(user.id, { last_login: new Date().toISOString() });
        
        res.json({ 
            success: true, 
            message: '登录成功',
            data: { 
                id: user.id, 
                username: user.username, 
                email: user.email,
                is_vip: user.is_vip,
                token: 'mock-jwt-token-' + user.id // 模拟JWT token
            }
        });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
});

// 提交咨询
app.post('/api/consultations', (req, res) => {
    try {
        const { name, phone, email, company_name, service_id, description, budget_range, urgency } = req.body;
        
        if (!name || !phone || !service_id || !description) {
            return res.status(400).json({ success: false, error: '姓名、电话、服务和描述为必填项' });
        }
        
        const consultation = db.createConsultation({
            name,
            phone,
            email,
            company_name,
            service_id,
            description,
            budget_range,
            urgency: urgency || 'medium'
        });
        
        res.json({ 
            success: true, 
            message: '咨询提交成功',
            data: { id: consultation.id }
        });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
});

// 创建订单
app.post('/api/orders', authenticate, (req, res) => {
    try {
        const { service_id, quantity, customer_notes } = req.body;
        const user_id = req.user?.id || 1; // 简化用户ID获取
        
        if (!service_id) {
            return res.status(400).json({ success: false, error: '服务ID为必填项' });
        }
        
        const order = db.createOrder({
            user_id,
            service_id,
            quantity: quantity || 1,
            customer_notes
        });
        
        res.json({ 
            success: true, 
            message: '订单创建成功',
            data: { 
                id: order.id, 
                order_number: order.order_number,
                total_amount: order.total_amount
            }
        });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
});

// 管理员API接口

// 管理员登录
app.post('/api/admin/login', (req, res) => {
    try {
        const { username, password } = req.body;
        
        if (!username || !password) {
            return res.status(400).json({ success: false, error: '用户名和密码为必填项' });
        }
        
        const admin = db.getAdminByUsername(username);
        if (!admin || admin.password !== password) {
            return res.status(401).json({ success: false, error: '用户名或密码错误' });
        }
        
        res.json({ 
            success: true, 
            message: '管理员登录成功',
            data: { 
                id: admin.id, 
                username: admin.username, 
                role: admin.role,
                token: 'mock-admin-token-' + admin.id
            }
        });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
});

// 获取仪表盘统计
app.get('/api/admin/dashboard', authenticateAdmin, (req, res) => {
    try {
        const stats = db.getDashboardStats();
        res.json({ success: true, data: stats });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
});

// 获取所有用户
app.get('/api/admin/users', authenticateAdmin, (req, res) => {
    try {
        const users = db.users;
        res.json({ success: true, data: users });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
});

// 获取所有咨询
app.get('/api/admin/consultations', authenticateAdmin, (req, res) => {
    try {
        const consultations = db.getAllConsultations();
        res.json({ success: true, data: consultations });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
});

// 更新咨询状态
app.put('/api/admin/consultations/:id', authenticateAdmin, (req, res) => {
    try {
        const { status, admin_notes, assigned_admin_id } = req.body;
        
        const consultation = db.updateConsultation(req.params.id, {
            status,
            admin_notes,
            assigned_admin_id
        });
        
        if (!consultation) {
            return res.status(404).json({ success: false, error: '咨询不存在' });
        }
        
        res.json({ success: true, message: '咨询状态更新成功', data: consultation });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
});

// 删除咨询
app.delete('/api/admin/consultations/:id', authenticateAdmin, (req, res) => {
    try {
        const success = db.deleteConsultation(req.params.id);
        if (!success) {
            return res.status(404).json({ success: false, error: '咨询不存在' });
        }
        res.json({ success: true, message: '咨询删除成功' });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
});

// 获取所有订单
app.get('/api/admin/orders', authenticateAdmin, (req, res) => {
    try {
        const orders = db.getAllOrders();
        res.json({ success: true, data: orders });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
});

// 更新订单状态
app.put('/api/admin/orders/:id', authenticateAdmin, (req, res) => {
    try {
        const { status, payment_status, assigned_admin_id } = req.body;
        
        const order = db.updateOrder(req.params.id, {
            status,
            payment_status,
            assigned_admin_id
        });
        
        if (!order) {
            return res.status(404).json({ success: false, error: '订单不存在' });
        }
        
        res.json({ success: true, message: '订单状态更新成功', data: order });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
});

// 创建文章
app.post('/api/admin/articles', authenticateAdmin, (req, res) => {
    try {
        const { title, content, category, excerpt, meta_title, meta_description, tags } = req.body;
        
        if (!title || !content) {
            return res.status(400).json({ success: false, error: '标题和内容为必填项' });
        }
        
        const article = db.createArticle({
            title,
            content,
            category: category || 'news',
            excerpt,
            meta_title,
            meta_description,
            tags: tags || [],
            author_id: 1 // 简化作者ID
        });
        
        res.json({ success: true, message: '文章创建成功', data: article });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
});

// 更新文章
app.put('/api/admin/articles/:id', authenticateAdmin, (req, res) => {
    try {
        const { title, content, category, excerpt, status, meta_title, meta_description, tags } = req.body;
        
        const article = db.updateArticle(req.params.id, {
            title,
            content,
            category,
            excerpt,
            status,
            meta_title,
            meta_description,
            tags
        });
        
        if (!article) {
            return res.status(404).json({ success: false, error: '文章不存在' });
        }
        
        res.json({ success: true, message: '文章更新成功', data: article });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
});

// 删除文章
app.delete('/api/admin/articles/:id', authenticateAdmin, (req, res) => {
    try {
        const success = db.deleteArticle(req.params.id);
        if (!success) {
            return res.status(404).json({ success: false, error: '文章不存在' });
        }
        res.json({ success: true, message: '文章删除成功' });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
});

// 创建常见问题
app.post('/api/admin/faqs', authenticateAdmin, (req, res) => {
    try {
        const { question, answer, category, sort_order } = req.body;
        
        if (!question || !answer) {
            return res.status(400).json({ success: false, error: '问题和答案为必填项' });
        }
        
        const faq = db.createFaq({
            question,
            answer,
            category,
            sort_order: sort_order || 0
        });
        
        res.json({ success: true, message: '常见问题创建成功', data: faq });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
});

// 更新常见问题
app.put('/api/admin/faqs/:id', authenticateAdmin, (req, res) => {
    try {
        const { question, answer, category, sort_order, is_active } = req.body;
        
        const faq = db.updateFaq(req.params.id, {
            question,
            answer,
            category,
            sort_order,
            is_active
        });
        
        if (!faq) {
            return res.status(404).json({ success: false, error: '常见问题不存在' });
        }
        
        res.json({ success: true, message: '常见问题更新成功', data: faq });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
});

// 删除常见问题
app.delete('/api/admin/faqs/:id', authenticateAdmin, (req, res) => {
    try {
        const success = db.deleteFaq(req.params.id);
        if (!success) {
            return res.status(404).json({ success: false, error: '常见问题不存在' });
        }
        res.json({ success: true, message: '常见问题删除成功' });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
});

// 更新系统设置
app.put('/api/admin/settings/:key', authenticateAdmin, (req, res) => {
    try {
        const { value } = req.body;
        
        if (value === undefined) {
            return res.status(400).json({ success: false, error: '设置值为必填项' });
        }
        
        db.updateSetting(req.params.key, value);
        res.json({ success: true, message: '设置更新成功' });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
});

// 错误处理中间件
app.use((error, req, res, next) => {
    console.error('服务器错误:', error);
    res.status(500).json({ success: false, error: '服务器内部错误' });
});

// 404处理
app.use('*', (req, res) => {
    res.status(404).json({ success: false, error: '接口不存在' });
});

// 启动服务器
app.listen(PORT, () => {
    console.log(`API服务器运行在 http://localhost:${PORT}`);
    console.log('前端访问地址: http://localhost:3000/index.html');
    console.log('后台管理地址: http://localhost:3000/admin/login.html');
});

module.exports = app;