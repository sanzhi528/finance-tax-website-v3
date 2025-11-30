// 数据库连接和操作模块
// 在实际生产环境中，这里应该连接真实的数据库
// 当前使用模拟数据作为演示

class Database {
    constructor() {
        this.data = require('./data.json');
        this.users = this.data.users || [];
        this.services = this.data.services || [];
        this.consultations = this.data.consultations || [];
        this.orders = this.data.orders || [];
        this.articles = this.data.articles || [];
        this.faqs = this.data.faqs || [];
        this.settings = this.data.settings || [];
        this.admins = this.data.admins || [];
        
        // 初始化ID计数器
        this.idCounters = {
            users: Math.max(...this.users.map(u => u.id), 0),
            services: Math.max(...this.services.map(s => s.id), 0),
            consultations: Math.max(...this.consultations.map(c => c.id), 0),
            orders: Math.max(...this.orders.map(o => o.id), 0),
            articles: Math.max(...this.articles.map(a => a.id), 0),
            faqs: Math.max(...this.faqs.map(f => f.id), 0)
        };
    }

    // 用户相关操作
    getUserById(id) {
        return this.users.find(user => user.id === parseInt(id));
    }

    getUserByEmail(email) {
        return this.users.find(user => user.email === email);
    }

    getUserByUsername(username) {
        return this.users.find(user => user.username === username);
    }

    createUser(userData) {
        const newUser = {
            id: ++this.idCounters.users,
            ...userData,
            registration_date: new Date().toISOString(),
            status: 'active',
            is_vip: false
        };
        this.users.push(newUser);
        this.saveData();
        return newUser;
    }

    updateUser(id, userData) {
        const index = this.users.findIndex(user => user.id === parseInt(id));
        if (index !== -1) {
            this.users[index] = { ...this.users[index], ...userData };
            this.saveData();
            return this.users[index];
        }
        return null;
    }

    deleteUser(id) {
        const index = this.users.findIndex(user => user.id === parseInt(id));
        if (index !== -1) {
            this.users.splice(index, 1);
            this.saveData();
            return true;
        }
        return false;
    }

    // 服务相关操作
    getAllServices() {
        return this.services.filter(service => service.is_active);
    }

    getServiceById(id) {
        return this.services.find(service => service.id === parseInt(id));
    }

    getServicesByCategory(categoryId) {
        return this.services.filter(service => 
            service.category_id === parseInt(categoryId) && service.is_active
        );
    }

    // 咨询相关操作
    getAllConsultations() {
        return this.consultations;
    }

    getConsultationById(id) {
        return this.consultations.find(consultation => consultation.id === parseInt(id));
    }

    getConsultationsByUser(userId) {
        return this.consultations.filter(consultation => 
            consultation.user_id === parseInt(userId)
        );
    }

    createConsultation(consultationData) {
        const service = this.getServiceById(consultationData.service_id);
        const newConsultation = {
            id: ++this.idCounters.consultations,
            ...consultationData,
            service_name: service ? service.name : '未知服务',
            status: 'pending',
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString()
        };
        this.consultations.push(newConsultation);
        this.saveData();
        return newConsultation;
    }

    updateConsultation(id, consultationData) {
        const index = this.consultations.findIndex(consultation => 
            consultation.id === parseInt(id)
        );
        if (index !== -1) {
            this.consultations[index] = { 
                ...this.consultations[index], 
                ...consultationData,
                updated_at: new Date().toISOString()
            };
            this.saveData();
            return this.consultations[index];
        }
        return null;
    }

    deleteConsultation(id) {
        const index = this.consultations.findIndex(consultation => 
            consultation.id === parseInt(id)
        );
        if (index !== -1) {
            this.consultations.splice(index, 1);
            this.saveData();
            return true;
        }
        return false;
    }

    // 订单相关操作
    getAllOrders() {
        return this.orders;
    }

    getOrderById(id) {
        return this.orders.find(order => order.id === parseInt(id));
    }

    getOrdersByUser(userId) {
        return this.orders.filter(order => order.user_id === parseInt(userId));
    }

    createOrder(orderData) {
        const service = this.getServiceById(orderData.service_id);
        const newOrder = {
            id: ++this.idCounters.orders,
            ...orderData,
            order_number: 'ORD' + new Date().getTime() + Math.random().toString(36).substr(2, 6),
            service_name: service ? service.name : '未知服务',
            service_price: service ? service.base_price : 0,
            total_amount: service ? service.base_price * (orderData.quantity || 1) : 0,
            status: 'pending',
            payment_status: 'pending',
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString()
        };
        this.orders.push(newOrder);
        this.saveData();
        return newOrder;
    }

    updateOrder(id, orderData) {
        const index = this.orders.findIndex(order => order.id === parseInt(id));
        if (index !== -1) {
            this.orders[index] = { 
                ...this.orders[index], 
                ...orderData,
                updated_at: new Date().toISOString()
            };
            this.saveData();
            return this.orders[index];
        }
        return null;
    }

    // 文章相关操作
    getAllArticles() {
        return this.articles.filter(article => article.status === 'published');
    }

    getArticleById(id) {
        return this.articles.find(article => article.id === parseInt(id));
    }

    getArticlesByCategory(category) {
        return this.articles.filter(article => 
            article.category === category && article.status === 'published'
        );
    }

    createArticle(articleData) {
        const newArticle = {
            id: ++this.idCounters.articles,
            ...articleData,
            status: 'draft',
            view_count: 0,
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString()
        };
        this.articles.push(newArticle);
        this.saveData();
        return newArticle;
    }

    updateArticle(id, articleData) {
        const index = this.articles.findIndex(article => article.id === parseInt(id));
        if (index !== -1) {
            this.articles[index] = { 
                ...this.articles[index], 
                ...articleData,
                updated_at: new Date().toISOString()
            };
            this.saveData();
            return this.articles[index];
        }
        return null;
    }

    deleteArticle(id) {
        const index = this.articles.findIndex(article => article.id === parseInt(id));
        if (index !== -1) {
            this.articles.splice(index, 1);
            this.saveData();
            return true;
        }
        return false;
    }

    // 常见问题相关操作
    getAllFaqs() {
        return this.faqs.filter(faq => faq.is_active);
    }

    getFaqById(id) {
        return this.faqs.find(faq => faq.id === parseInt(id));
    }

    createFaq(faqData) {
        const newFaq = {
            id: ++this.idCounters.faqs,
            ...faqData,
            is_active: true,
            view_count: 0,
            helpful_count: 0,
            not_helpful_count: 0,
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString()
        };
        this.faqs.push(newFaq);
        this.saveData();
        return newFaq;
    }

    updateFaq(id, faqData) {
        const index = this.faqs.findIndex(faq => faq.id === parseInt(id));
        if (index !== -1) {
            this.faqs[index] = { 
                ...this.faqs[index], 
                ...faqData,
                updated_at: new Date().toISOString()
            };
            this.saveData();
            return this.faqs[index];
        }
        return null;
    }

    deleteFaq(id) {
        const index = this.faqs.findIndex(faq => faq.id === parseInt(id));
        if (index !== -1) {
            this.faqs.splice(index, 1);
            this.saveData();
            return true;
        }
        return false;
    }

    // 系统设置相关操作
    getSetting(key) {
        const setting = this.settings.find(s => s.setting_key === key);
        return setting ? setting.setting_value : null;
    }

    getAllSettings() {
        return this.settings;
    }

    updateSetting(key, value) {
        const index = this.settings.findIndex(s => s.setting_key === key);
        if (index !== -1) {
            this.settings[index].setting_value = value;
        } else {
            this.settings.push({
                setting_key: key,
                setting_value: value,
                setting_type: 'string',
                is_public: false
            });
        }
        this.saveData();
    }

    // 管理员相关操作
    getAdminByUsername(username) {
        return this.admins.find(admin => admin.username === username);
    }

    // 保存数据到文件（模拟数据库持久化）
    saveData() {
        // 在实际生产环境中，这里应该保存到真实数据库
        // 当前使用文件存储作为演示
        const fs = require('fs');
        const path = require('path');
        
        const dataToSave = {
            users: this.users,
            services: this.services,
            consultations: this.consultations,
            orders: this.orders,
            articles: this.articles,
            faqs: this.faqs,
            settings: this.settings,
            admins: this.admins
        };
        
        try {
            fs.writeFileSync(
                path.join(__dirname, 'data.json'),
                JSON.stringify(dataToSave, null, 2)
            );
        } catch (error) {
            console.error('保存数据失败:', error);
        }
    }

    // 统计数据
    getDashboardStats() {
        const today = new Date().toISOString().split('T')[0];
        
        return {
            total_users: this.users.length,
            total_services: this.services.length,
            total_consultations: this.consultations.length,
            total_orders: this.orders.length,
            pending_consultations: this.consultations.filter(c => c.status === 'pending').length,
            pending_orders: this.orders.filter(o => o.status === 'pending').length,
            today_consultations: this.consultations.filter(c => 
                c.created_at.startsWith(today)
            ).length,
            today_orders: this.orders.filter(o => 
                o.created_at.startsWith(today)
            ).length
        };
    }
}

module.exports = Database;