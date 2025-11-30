// 主JavaScript文件

// 页面加载完成后执行
document.addEventListener('DOMContentLoaded', function() {
    // 初始化导航菜单
    initNavigation();
    
    // 初始化服务卡片交互
    initServiceCards();
    
    // 初始化表单验证
    initFormValidation();
    
    // 加载公司信息
    loadCompanyInfo();
});

// 导航菜单功能
function initNavigation() {
    const navToggle = document.querySelector('.nav-toggle');
    const navMenu = document.querySelector('.nav-menu');
    
    if (navToggle && navMenu) {
        navToggle.addEventListener('click', function() {
            navMenu.classList.toggle('active');
            navToggle.classList.toggle('active');
        });
    }
    
    // 平滑滚动
    const navLinks = document.querySelectorAll('.nav-menu a[href^="#"]');
    navLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            const targetId = this.getAttribute('href').substring(1);
            const targetElement = document.getElementById(targetId);
            
            if (targetElement) {
                window.scrollTo({
                    top: targetElement.offsetTop - 70,
                    behavior: 'smooth'
                });
                
                // 移动端关闭菜单
                if (window.innerWidth <= 768) {
                    navMenu.classList.remove('active');
                    navToggle.classList.remove('active');
                }
            }
        });
    });
}

// 服务卡片交互
function initServiceCards() {
    const serviceCards = document.querySelectorAll('.service-card');
    
    serviceCards.forEach(card => {
        card.addEventListener('mouseenter', function() {
            this.style.transform = 'translateY(-5px)';
        });
        
        card.addEventListener('mouseleave', function() {
            this.style.transform = 'translateY(0)';
        });
        
        // 点击服务卡片跳转详情
        card.addEventListener('click', function() {
            const serviceType = this.getAttribute('data-service');
            window.location.href = `service-detail.html?type=${serviceType}`;
        });
    });
}

// 表单验证
function initFormValidation() {
    const forms = document.querySelectorAll('form');
    
    forms.forEach(form => {
        form.addEventListener('submit', function(e) {
            if (!validateForm(this)) {
                e.preventDefault();
            }
        });
    });
}

function validateForm(form) {
    let isValid = true;
    const inputs = form.querySelectorAll('input[required], select[required], textarea[required]');
    
    inputs.forEach(input => {
        if (!input.value.trim()) {
            showError(input, '此字段为必填项');
            isValid = false;
        } else {
            clearError(input);
            
            // 邮箱验证
            if (input.type === 'email') {
                if (!isValidEmail(input.value)) {
                    showError(input, '请输入有效的邮箱地址');
                    isValid = false;
                }
            }
            
            // 电话验证
            if (input.type === 'tel') {
                if (!isValidPhone(input.value)) {
                    showError(input, '请输入有效的电话号码');
                    isValid = false;
                }
            }
        }
    });
    
    return isValid;
}

function isValidEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
}

function isValidPhone(phone) {
    const phoneRegex = /^1[3-9]\d{9}$/;
    return phoneRegex.test(phone);
}

function showError(input, message) {
    clearError(input);
    
    const errorDiv = document.createElement('div');
    errorDiv.className = 'error-message';
    errorDiv.style.color = '#e74c3c';
    errorDiv.style.fontSize = '0.9rem';
    errorDiv.style.marginTop = '5px';
    errorDiv.textContent = message;
    
    input.style.borderColor = '#e74c3c';
    input.parentNode.appendChild(errorDiv);
}

function clearError(input) {
    input.style.borderColor = '#ddd';
    const existingError = input.parentNode.querySelector('.error-message');
    if (existingError) {
        existingError.remove();
    }
}

// 加载公司信息
function loadCompanyInfo() {
    // 从localStorage或API加载公司信息
    const companyInfo = getCompanyInfo();
    
    if (companyInfo) {
        // 更新页面上的公司信息
        updateCompanyInfo(companyInfo);
    }
}

function getCompanyInfo() {
    // 这里可以从localStorage或API获取公司信息
    // 暂时使用默认值
    return {
        name: '财务税务代理公司',
        logo: 'images/LOGO图标.jpg',
        intro: '我们是一家专业的财务税务代理公司，拥有多年的行业经验，为客户提供全方位的工商财税服务。',
        phone: '+86-0755-85216839',
        email: '1006993710@qq.com',
        address: '中国广东省深圳市龙岗区龙岗街道龙岗路东森大厦'
    };
}

function updateCompanyInfo(info) {
    const nameElement = document.getElementById('company-name');
    const logoElement = document.getElementById('company-logo');
    const introElement = document.getElementById('company-intro');
    const phoneElement = document.getElementById('company-phone');
    const emailElement = document.getElementById('company-email');
    const addressElement = document.getElementById('company-address');
    
    if (nameElement) nameElement.textContent = info.name;
    if (logoElement) logoElement.src = info.logo;
    if (introElement) introElement.textContent = info.intro;
    if (phoneElement) phoneElement.textContent = info.phone;
    if (emailElement) emailElement.textContent = info.email;
    if (addressElement) addressElement.textContent = info.address;
}

// 服务详情页面功能
function loadServiceDetail() {
    const urlParams = new URLSearchParams(window.location.search);
    const serviceType = urlParams.get('type');
    
    if (serviceType) {
        const serviceData = getServiceData(serviceType);
        if (serviceData) {
            displayServiceDetail(serviceData);
        }
    }
}

function getServiceData(type) {
    const services = {
        business: {
            title: '工商代理服务',
            description: '专业的企业工商注册、变更、注销、转让等一站式服务',
            services: [
                '公司设立注册',
                '公司变更登记',
                '公司注销清算',
                '公司股权转让',
                '营业执照办理',
                '工商年报申报'
            ],
            requirements: [
                '法人身份证复印件',
                '股东身份证复印件',
                '公司章程',
                '经营场所证明',
                '注册资本证明'
            ],
            prices: [
                { service: '公司设立', price: '800-2000元' },
                { service: '公司变更', price: '500-1500元' },
                { service: '公司注销', price: '1000-3000元' },
                { service: '股权转让', price: '800-2000元' }
            ]
        },
        ip: {
            title: '知识产权服务',
            description: '专业的商标、版权、专利等知识产权注册、变更、转让服务',
            services: [
                '商标注册申请',
                '商标变更登记',
                '商标转让办理',
                '版权登记申请',
                '专利申请代理',
                '知识产权维权'
            ],
            requirements: [
                '申请人身份证明',
                '商标图样',
                '商品/服务类别',
                '委托代理协议',
                '相关证明文件'
            ],
            prices: [
                { service: '商标注册', price: '800-1500元' },
                { service: '商标变更', price: '500-800元' },
                { service: '商标转让', price: '800-1200元' },
                { service: '版权登记', price: '500-1000元' }
            ]
        },
        accounting: {
            title: '会计服务',
            description: '专业的会计做账、报税、审计等财税服务',
            services: [
                '一般纳税人记账报税',
                '小规模纳税人记账报税',
                '出口退税申报',
                '个体工商户记账报税',
                '财务审计服务',
                '税务筹划咨询'
            ],
            requirements: [
                '营业执照复印件',
                '税务登记证',
                '银行对账单',
                '发票凭证',
                '财务报表'
            ],
            prices: [
                { service: '小规模纳税人', price: '200-500元/月' },
                { service: '一般纳税人', price: '500-1000元/月' },
                { service: '出口退税', price: '1000-3000元/次' },
                { service: '税务筹划', price: '面议' }
            ]
        },
        banking: {
            title: '银行开户服务',
            description: '专业的银行对公账户开设、社保公积金代申请服务',
            services: [
                '银行对公账户开设',
                '社保开户代申请',
                '公积金开户代申请',
                '银行账户变更',
                '社保公积金代缴',
                '银行信贷咨询'
            ],
            requirements: [
                '营业执照正副本',
                '法人身份证',
                '公司章程',
                '经营场所证明',
                '开户许可证'
            ],
            prices: [
                { service: '银行开户', price: '500-1000元' },
                { service: '社保开户', price: '300-600元' },
                { service: '公积金开户', price: '300-600元' },
                { service: '代缴服务', price: '50-100元/人/月' }
            ]
        }
    };
    
    return services[type];
}

function displayServiceDetail(data) {
    document.title = data.title + ' - 财务税务代理公司';
    
    const header = document.querySelector('.service-header h1');
    const description = document.querySelector('.service-description');
    const servicesList = document.querySelector('.services-list');
    const requirementsList = document.querySelector('.requirements-list');
    const priceTable = document.querySelector('.price-table tbody');
    
    if (header) header.textContent = data.title;
    if (description) description.textContent = data.description;
    
    // 更新服务内容
    if (servicesList) {
        servicesList.innerHTML = '';
        data.services.forEach(service => {
            const li = document.createElement('li');
            li.textContent = service;
            servicesList.appendChild(li);
        });
    }
    
    // 更新所需资料
    if (requirementsList) {
        requirementsList.innerHTML = '';
        data.requirements.forEach(req => {
            const li = document.createElement('li');
            li.textContent = req;
            requirementsList.appendChild(li);
        });
    }
    
    // 更新价格表
    if (priceTable) {
        priceTable.innerHTML = '';
        data.prices.forEach(item => {
            const tr = document.createElement('tr');
            tr.innerHTML = `
                <td>${item.service}</td>
                <td>${item.price}</td>
            `;
            priceTable.appendChild(tr);
        });
    }
}

// 咨询表单提交
function submitConsultForm(formData) {
    // 这里可以发送AJAX请求到后端API
    console.log('提交咨询表单:', formData);
    
    // 显示成功消息
    showMessage('咨询提交成功！我们将尽快与您联系。', 'success');
    
    // 清空表单
    document.querySelector('form').reset();
}

// 显示消息提示
function showMessage(message, type) {
    const messageDiv = document.createElement('div');
    messageDiv.className = `alert alert-${type}`;
    messageDiv.textContent = message;
    
    const container = document.querySelector('.container') || document.body;
    container.insertBefore(messageDiv, container.firstChild);
    
    // 3秒后自动消失
    setTimeout(() => {
        messageDiv.remove();
    }, 3000);
}

// 工具函数：防抖
function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

// 工具函数：节流
function throttle(func, limit) {
    let inThrottle;
    return function() {
        const args = arguments;
        const context = this;
        if (!inThrottle) {
            func.apply(context, args);
            inThrottle = true;
            setTimeout(() => inThrottle = false, limit);
        }
    };
}

// 导出函数供其他脚本使用
window.websiteApp = {
    loadServiceDetail,
    submitConsultForm,
    showMessage,
    debounce,
    throttle
};