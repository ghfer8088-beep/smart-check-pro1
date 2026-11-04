/**
 * ============================================================================
 * 💬 محرك الإرسال الآلي المباشر عبر واتساب (SmartWhatsAppDispatcher v30.53)
 * «وداعاً للألم» للكايروبراكتيك - Smart Check Pro 2.0
 * 
 * يتيح إرسال كود التفعيل والتقارير الطبية والرسائل الترحيبية لموبايل العميل مباشرة
 * وبشكل آلي 24/7 دون الحاجة لفتح تطبيق واتساب على جهاز المعالج.
 * يدعم: UltraMsg (مسح QR Code) • Green-API • Custom Webhook / Cloud API
 * ============================================================================
 */

(function(window) {
    'use strict';

    const STORAGE_KEY = 'smart_whatsapp_api_config';
    const DISPATCH_LOG_KEY = 'smart_whatsapp_dispatch_logs';

    const DEFAULT_CONFIG = {
        enabled: false,
        provider: 'ultramsg', // ultramsg | green-api | custom
        instanceId: '',
        token: '',
        customUrl: '',
        senderPhone: '0795651388',
        autoSendOnApproval: true,
        autoSendOnInstantRequest: false,
        messageTemplate: `مرحباً بك {name} 🌸\nيسر عيادة «وداعاً للألم» للكايروبراكتيك إعلامك باعتماد اشتراكك بنجاح.\n\n🔑 كود التفعيل المعتمد الخاص بك هو:\n*{code}*\n\nيمكنك إدخال هذا الكود فوراً في الأداة لفتح تقريرك السريري الشامل وخطة تمارين الـ 7 أيام:\n{link}\n\nنتمنى لك دوام الصحة والعافية! ✨`
    };

    function getConfig() {
        try {
            const raw = localStorage.getItem(STORAGE_KEY);
            if (raw) {
                const parsed = JSON.parse(raw);
                return Object.assign({}, DEFAULT_CONFIG, parsed);
            }
        } catch (e) {
            console.warn('SmartWhatsApp getConfig warning:', e);
        }
        return Object.assign({}, DEFAULT_CONFIG);
    }

    function saveConfig(newConfig) {
        try {
            const merged = Object.assign({}, getConfig(), newConfig, { updatedAt: Date.now() });
            localStorage.setItem(STORAGE_KEY, JSON.stringify(merged));
            if (typeof SmartCloudSync !== 'undefined' && typeof SmartCloudSync.broadcastData === 'function') {
                SmartCloudSync.broadcastData('whatsapp_config_update', merged);
            }
            return merged;
        } catch (e) {
            console.error('SmartWhatsApp saveConfig error:', e);
            return null;
        }
    }

    /**
     * تحويل رقم الهاتف إلى صيغة دولية صالحة لإرسال واتساب (E.164 بدون علامة +)
     */
    function normalizePhone(phone) {
        if (!phone) return '';
        let cleaned = String(phone).replace(/[^\d]/g, '');
        // الأرقام الأردنية: 079XXXXXXX أو 078XXXXXXX أو 077XXXXXXX
        if (cleaned.startsWith('07') && cleaned.length === 10) {
            cleaned = '962' + cleaned.substring(1);
        } else if (cleaned.startsWith('7') && cleaned.length === 9) {
            cleaned = '962' + cleaned;
        } else if (cleaned.startsWith('00')) {
            cleaned = cleaned.substring(2);
        } else if (cleaned.startsWith('05') && cleaned.length === 10) {
            // أرقام السعودية: 05XXXXXXXX -> 9665XXXXXXXX
            cleaned = '966' + cleaned.substring(1);
        }
        return cleaned;
    }

    /**
     * تجهيز نص الرسالة باستبدال المتغيرات
     */
    function prepareMessage(template, params = {}) {
        let text = template || getConfig().messageTemplate;
        const name = params.name || 'المراجع المحترم';
        const code = params.code || '------';
        const plan = params.plan || 'باقة الاستشارة وخطة الـ 7 أيام';
        const phone = params.phone || '';
        const link = params.link || (window.location.origin + window.location.pathname.replace(/\/admin\.html$/i, '/index.html'));

        text = text.replace(/\{name\}/g, name);
        text = text.replace(/\{code\}/g, code);
        text = text.replace(/\{plan\}/g, plan);
        text = text.replace(/\{phone\}/g, phone);
        text = text.replace(/\{link\}/g, link);
        return text;
    }

    function logDispatch(entry) {
        try {
            const raw = localStorage.getItem(DISPATCH_LOG_KEY);
            const logs = raw ? JSON.parse(raw) : [];
            logs.unshift(Object.assign({ timestamp: new Date().toISOString() }, entry));
            if (logs.length > 50) logs.length = 50;
            localStorage.setItem(DISPATCH_LOG_KEY, JSON.stringify(logs));
        } catch (e) {}
    }

    function getDispatchLogs() {
        try {
            const raw = localStorage.getItem(DISPATCH_LOG_KEY);
            return raw ? JSON.parse(raw) : [];
        } catch (e) {
            return [];
        }
    }

    /**
     * الإرسال الآلي الفوري عبر مزود الخدمة المختار (UltraMsg / Green-API / Custom)
     */
    async function sendAutomatedWhatsApp(options = {}) {
        const cfg = getConfig();
        const rawPhone = options.phone || options.subscriberPhone || '';
        const phone = normalizePhone(rawPhone);
        const name = options.name || options.subscriberName || 'المراجع المحترم';
        const code = options.code || options.unlockPin || '';
        const plan = options.plan || options.planType || 'خطة التأهيل';

        if (!cfg.enabled && !options.force) {
            return {
                success: false,
                skipped: true,
                error: 'بوابة الواتساب الآلي غير مفعلة في الإعدادات.'
            };
        }

        if (!phone) {
            return {
                success: false,
                error: 'رقم هاتف المراجع غير صالح أو فارغ.'
            };
        }

        if (!cfg.instanceId || !cfg.token) {
            if (cfg.provider !== 'custom') {
                return {
                    success: false,
                    error: 'يرجى إدخال معرف النسخة (Instance ID) ورمز الوصول (Token) في إعدادات الواتساب.'
                };
            }
        }

        const messageBody = options.customText || prepareMessage(cfg.messageTemplate, {
            name,
            code,
            plan,
            phone: rawPhone,
            link: options.link
        });

        try {
            let response = null;
            let resultData = null;

            // 1. UltraMsg Provider
            if (cfg.provider === 'ultramsg') {
                const endpoint = `https://api.ultramsg.com/${encodeURIComponent(cfg.instanceId.trim())}/messages/chat`;
                const bodyParams = new URLSearchParams();
                bodyParams.append('token', cfg.token.trim());
                bodyParams.append('to', phone);
                bodyParams.append('body', messageBody);
                bodyParams.append('priority', '10');

                response = await fetch(endpoint, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
                    body: bodyParams
                });
                resultData = await response.json().catch(() => ({}));

                if (response.ok && (resultData.sent === 'true' || resultData.sent === true || resultData.id)) {
                    logDispatch({ phone, name, code, status: 'success', provider: 'ultramsg', messageId: resultData.id });
                    return { success: true, provider: 'ultramsg', result: resultData };
                } else {
                    const errMsg = resultData.message || resultData.error || 'فشل إرسال الرسالة من UltraMsg';
                    logDispatch({ phone, name, code, status: 'failed', provider: 'ultramsg', error: errMsg });
                    return { success: false, provider: 'ultramsg', error: errMsg, details: resultData };
                }
            }

            // 2. Green-API Provider
            else if (cfg.provider === 'green-api') {
                const endpoint = `https://api.green-api.com/waInstance${encodeURIComponent(cfg.instanceId.trim())}/sendMessage/${encodeURIComponent(cfg.token.trim())}`;
                const payload = {
                    chatId: `${phone}@c.us`,
                    message: messageBody
                };

                response = await fetch(endpoint, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(payload)
                });
                resultData = await response.json().catch(() => ({}));

                if (response.ok && resultData.idMessage) {
                    logDispatch({ phone, name, code, status: 'success', provider: 'green-api', messageId: resultData.idMessage });
                    return { success: true, provider: 'green-api', result: resultData };
                } else {
                    const errMsg = resultData.message || 'فشل إرسال الرسالة من Green-API';
                    logDispatch({ phone, name, code, status: 'failed', provider: 'green-api', error: errMsg });
                    return { success: false, provider: 'green-api', error: errMsg, details: resultData };
                }
            }

            // 3. Custom Webhook / Cloud API
            else if (cfg.provider === 'custom') {
                if (!cfg.customUrl) {
                    return { success: false, error: 'رابط الـ Webhook المخصص غير محدد.' };
                }
                const payload = {
                    to: phone,
                    rawPhone,
                    name,
                    code,
                    plan,
                    message: messageBody
                };

                response = await fetch(cfg.customUrl, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        ...(cfg.token ? { 'Authorization': 'Bearer ' + cfg.token.trim() } : {})
                    },
                    body: JSON.stringify(payload)
                });
                resultData = await response.json().catch(() => ({}));

                if (response.ok) {
                    logDispatch({ phone, name, code, status: 'success', provider: 'custom' });
                    return { success: true, provider: 'custom', result: resultData };
                } else {
                    logDispatch({ phone, name, code, status: 'failed', provider: 'custom', error: response.statusText });
                    return { success: false, provider: 'custom', error: response.statusText, details: resultData };
                }
            }

            return { success: false, error: 'مزود الخدمة غير معروف.' };
        } catch (networkErr) {
            console.error('SmartWhatsApp network error:', networkErr);
            logDispatch({ phone, name, code, status: 'failed', error: networkErr.message });
            return {
                success: false,
                error: 'تعذر الاتصال بخادم الواتساب: ' + networkErr.message
            };
        }
    }

    /**
     * تجربة إرسال رسالة اختبارية إلى رقم هاتف محدد للتأكد من سلامة الربط
     */
    async function testConnection(testPhone) {
        const cfg = getConfig();
        if (!testPhone) {
            return { success: false, error: 'يرجى إدخال رقم هاتف لإجراء الاختبار.' };
        }
        const testText = `🧪 *رسالة اختبارية من عيادة «وداعاً للألم» للكايروبراكتيك* ✨\n\nنظام الربط الآلي عبر الواتساب (${cfg.provider.toUpperCase()}) يعمل الآن بنجاح وكفاءة تامة 100%!\nالتاريخ: ${new Date().toLocaleString('ar-JO')}`;
        
        return await sendAutomatedWhatsApp({
            phone: testPhone,
            name: 'فحص المنظومة',
            customText: testText,
            force: true
        });
    }

    // تصدير الواجهة البرمجية للكائن العام
    window.SmartWhatsApp = {
        getConfig,
        saveConfig,
        normalizePhone,
        prepareMessage,
        sendAutomatedWhatsApp,
        testConnection,
        getDispatchLogs
    };

})(typeof window !== 'undefined' ? window : this);
