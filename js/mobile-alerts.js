/**
 * SmartMobileAlerts (v30.56)
 * =========================================================================
 * منظومة إشعارات الموبايل الفورية الخاصة بالطبيب / الإدارة
 * ترسل تنبيهاً فورياً مع رنة واهتزاز إلى هاتف الطبيب لكل مشترك جديد أو طلب كود
 * 
 * الميزات:
 * 1. توضيح نوع الباقة بدقة في عنوان ونص الإشعار (باقة 5، باقة 10، باقة 1، أو لوجه الله).
 * 2. الكود الواصل بالإشعار يطابق الباقة المختارة 100% (مثال: باقة 5 يبدأ الكود بـ 5).
 * 3. زر محادثة واتساب بالإشعار يحتوي على رسالة جاهزة ومصاغة باحترافية بالكود واسم المريض والباقة،
 *    بحيث يفتح الطبيب الواتساب ويضغط (إرسال) مباشرة دون الحاجة لكتابة أي شيء.
 * =========================================================================
 */
const SmartMobileAlerts = (function() {
    'use strict';

    const DEFAULT_TOPIC = 'wada3an_doctor_phone_alerts';
    const DEFAULT_DOCTOR_PHONE = '0795651388';
    const _recentAlertsMap = new Map();

    function getConfig() {
        return {
            enabled: localStorage.getItem('smart_mobile_alerts_enabled') !== 'false',
            topic: (localStorage.getItem('smart_mobile_alerts_topic') || DEFAULT_TOPIC).trim(),
            doctorPhone: (localStorage.getItem('smart_doctor_phone') || DEFAULT_DOCTOR_PHONE).trim(),
            notifyOnNewSubscriber: localStorage.getItem('smart_alert_on_new_sub') !== 'false',
            notifyOnUnlockRequest: localStorage.getItem('smart_alert_on_unlock_req') !== 'false'
        };
    }

    function saveConfig(cfg) {
        if (!cfg) return;
        if (cfg.enabled !== undefined) localStorage.setItem('smart_mobile_alerts_enabled', String(cfg.enabled));
        if (cfg.topic) localStorage.setItem('smart_mobile_alerts_topic', cfg.topic.trim());
        if (cfg.doctorPhone) localStorage.setItem('smart_doctor_phone', cfg.doctorPhone.trim());
        if (cfg.notifyOnNewSubscriber !== undefined) localStorage.setItem('smart_alert_on_new_sub', String(cfg.notifyOnNewSubscriber));
        if (cfg.notifyOnUnlockRequest !== undefined) localStorage.setItem('smart_alert_on_unlock_req', String(cfg.notifyOnUnlockRequest));
    }

    // استخراج معلومات الباقة بدقة تامة
    function formatPackageInfo(reqType, pkgSize) {
        const strType = String(reqType || '').toLowerCase();
        const isHum = strType.includes('hum') || strType.includes('إعفاء') || strType.includes('waiver') || strType.includes('free');
        if (isHum) {
            return {
                title: '🌿 إعفاء إنساني (لوجه الله تعالى - مجاني)',
                shortBadge: 'لوجه الله 🌿',
                tier: 1,
                price: 'مجاني',
                isHumanitarian: true
            };
        }

        const size = Number(pkgSize) || 1;
        if (size === 10 || strType.includes('10')) {
            return {
                title: '👑 باقة 10 تشخيصات (15 د.أ - توفير 50%)',
                shortBadge: 'باقة 10 👑',
                tier: 10,
                price: '15 د.أ',
                isHumanitarian: false
            };
        }
        if (size === 5 || strType.includes('5')) {
            return {
                title: '💼 باقة 5 تشخيصات (10 د.أ - توفير 33%)',
                shortBadge: 'باقة 5 💼',
                tier: 5,
                price: '10 د.أ',
                isHumanitarian: false
            };
        }
        return {
            title: '⭐ باقة تشخيص واحد (3 د.أ)',
            shortBadge: 'تشخيص واحد ⭐',
            tier: 1,
            price: '3 د.أ',
            isHumanitarian: false
        };
    }

    // توليد أو تصحيح كود التفعيل ليتطابق حتماً مع نوع الباقة المختارة
    function getMatchedCode(phoneOrName, tier, existingPin) {
        const t = Number(tier) || 1;
        // إذا كان هناك كود ممرر بالفعل ويتطابق مع بادئة الباقة
        if (existingPin && typeof existingPin === 'string') {
            const clean = existingPin.trim();
            if (t === 10 && clean.startsWith('10') && clean.length >= 6) return clean;
            if (t === 5 && clean.startsWith('5') && clean.length >= 5) return clean;
            if (t === 1 && !clean.startsWith('5') && !clean.startsWith('10') && clean.length === 4) return clean;
        }

        // توليد الكود وفق الخوارزمية المعتمدة
        const seed = String(phoneOrName || '').replace(/[^a-zA-Z0-9\u0621-\u064A]/g, '').toLowerCase();
        let hash = 5381;
        const str = (seed || 'wada3an') + '#0';
        for (let i = 0; i < str.length; i++) {
            hash = ((hash * 33) ^ str.charCodeAt(i)) & 0x7fffffff;
        }
        const basePin = String(1000 + (hash % 9000));
        if (t === 10) return '10' + basePin;
        if (t === 5) return '5' + basePin;
        return basePin;
    }

    // صياغة رسالة الواتساب الاحترافية الجاهزة للإرسال
    function buildWhatsAppReadyMessage({ name, code, packageTitle, painArea }) {
        return `مرحباً بك أخي/أختي ${name || 'المراجع الكريم'} 🌸
عيادة «وداعاً للألم» للكايروبراكتيك ترحب بك.

تم اعتماد طلبك وتفعيل اشتراكك بنجاح ✅
📦 نوع الاشتراك: ${packageTitle}
🩺 موضع الشكوى: ${painArea || 'فحص واستشارة سريرية'}

🔑 كود التفعيل المعتمد الخاص بك هو:
👉 *${code}* 👈

طريقة الاستخدام:
1. افتح صفحة التقرير الطبي.
2. اختر تبويب (لدي كود تفعيل معتمد).
3. أدخل رقم هاتفك والكود أعلاه واضغط (تفعيل وفتح التقرير).

نسأل الله لك الشفاء العاجل ودوام العافية 🤲
— د. جمال (عيادة وداعاً للألم)`;
    }

    // تنسيق رابط الواتساب العالمي لفتح التطبيق بالرسالة الجاهزة
    function buildWhatsAppUrl(phone, text) {
        if (!phone) return '';
        let digits = String(phone).replace(/\D/g, '');
        if (!digits) return '';

        // صياغة الرقم الدولي للأردن
        if (digits.startsWith('07') && digits.length >= 10) {
            digits = '962' + digits.substring(1);
        } else if (digits.startsWith('7') && digits.length === 9) {
            digits = '962' + digits;
        } else if (digits.startsWith('00')) {
            digits = digits.substring(2);
        }

        return `https://api.whatsapp.com/send?phone=${digits}&text=${encodeURIComponent(text)}`;
    }

    // منع تكرار نفس التنبيه في نفس الـ 5 ثوانٍ
    function isDuplicate(key) {
        if (!key) return false;
        const now = Date.now();
        const prev = _recentAlertsMap.get(key) || 0;
        if (now - prev < 5000) return true;
        _recentAlertsMap.set(key, now);
        return false;
    }

    // إرسال تنبيه Push لهاتف الطبيب
    async function sendPushToPhone(alertData) {
        if (!alertData) return { success: false, reason: 'empty_data' };
        const cfg = getConfig();
        if (!cfg.enabled) return { success: false, reason: 'disabled' };

        const topic = cfg.topic || DEFAULT_TOPIC;
        const title = alertData.title || '🔔 مشترك جديد بانتظار الكود';
        const message = alertData.message || '';
        const priority = alertData.priority || 5; // 5 = Urgent (صوت واهتزاز عالي)
        const tags = alertData.tags || ['bell', 'busts_in_silhouette', 'key'];
        const clickUrl = alertData.click || 'https://smartchecktools.com/admin.html';
        const actions = alertData.actions || [
            { action: 'view', label: '🖥️ لوحة الإدارة', url: clickUrl }
        ];

        try {
            fetch('https://ntfy.sh', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    topic: topic,
                    title: title,
                    message: message,
                    priority: priority,
                    tags: tags,
                    click: clickUrl,
                    actions: actions
                })
            }).then(r => r.json()).then(res => {
                console.log('[MobileAlerts] Push notification delivered via NTFY:', res?.id || 'OK');
            }).catch(err => {
                console.warn('[MobileAlerts] Push error:', err);
            });
        } catch(e) {}

        // إشعار المتصفح الأصلي (Native Web Notification)
        try {
            if (typeof window !== 'undefined' && 'Notification' in window && Notification.permission === 'granted') {
                new Notification(title, {
                    body: message,
                    icon: 'assets/logo.png',
                    badge: 'assets/logo.png'
                });
            }
        } catch(e) {}

        return { success: true, topic };
    }

    // إرسال تنبيه مشترك جديد يطلب كود التفعيل مع تحديد الباقة والرسالة الجاهزة
    function notifyUnlockRequest(data) {
        if (!data) return;
        const subName = data.name || data.subscriberName || 'مشترك جديد';
        const subPhone = data.phone || data.subscriberPhone || '';
        const painArea = data.painArea || 'فحص واستشارة سريرية';
        const reqType = data.requestType || data.paymentType || '';
        const pkgSize = data.packageSize || 1;

        const dedupeKey = `req_${subPhone}_${reqType}_${pkgSize}`;
        if (isDuplicate(dedupeKey)) return;

        // 1. تحديد الباقة
        const pkgInfo = formatPackageInfo(reqType, pkgSize);

        // 2. توليد الكود المطابق تماماً للباقة
        const finalCode = getMatchedCode(subPhone || subName, pkgInfo.tier, data.pin || data.unlockPin);

        // 3. بناء نص الواتساب الجاهز
        const readyWhatsAppMsg = buildWhatsAppReadyMessage({
            name: subName,
            code: finalCode,
            packageTitle: pkgInfo.title,
            painArea: painArea
        });

        // 4. بناء رابط الواتساب المباشر
        const waLink = buildWhatsAppUrl(subPhone, readyWhatsAppMsg);

        // 5. صياغة العنوان ونص الإشعار
        const alertTitle = pkgInfo.isHumanitarian 
            ? `🌿 طلب إعفاء لوجه الله: ${subName}`
            : `💳 طلب كود [${pkgInfo.shortBadge}]: ${subName}`;

        const alertMessage = 
            `👤 المشترك: ${subName}\n` +
            `📱 الهاتف: ${subPhone || 'غير مسجل'}\n` +
            `📦 الباقة: ${pkgInfo.title}\n` +
            `🩺 موضع الشكوى: ${painArea}\n` +
            `🔑 كود التفعيل: ${finalCode}\n` +
            `👉 اضغط الزر بالأسفل لمراسلة العميل بالواتساب فوراً`;

        const actions = [];
        if (waLink) {
            actions.push({ action: 'view', label: '💬 إرسال الكود بالواتساب', url: waLink });
        }
        actions.push({ action: 'view', label: '🖥️ لوحة الإدارة', url: 'https://smartchecktools.com/admin.html' });

        return sendPushToPhone({
            title: alertTitle,
            message: alertMessage,
            priority: 5,
            tags: pkgInfo.isHumanitarian ? ['seedling', 'hands', 'key'] : ['bell', 'moneybag', 'key'],
            click: 'https://smartchecktools.com/admin.html',
            pin: finalCode,
            actions: actions
        });
    }

    // إرسال تنبيه من كائن الإشعار الداخلي (SmartDB.addAdminNotification)
    function notifyAdminNotification(notif) {
        if (!notif) return;
        if (notif.type === 'payment_received' || notif.type === 'humanitarian_request') {
            notifyUnlockRequest({
                name: notif.patientName,
                phone: notif.patientPhone,
                painArea: notif.meta?.painArea || 'فحص سريري',
                requestType: notif.type === 'humanitarian_request' ? 'humanitarian' : (notif.meta?.paymentType || 'paid_orange_wallet'),
                packageSize: notif.meta?.packageSize || 1,
                pin: notif.meta?.unlockPin || notif.meta?.unlockCode || ''
            });
        } else if (notif.type === 'new_registration') {
            notifyNewSubscriber({
                name: notif.patientName,
                phone: notif.patientPhone,
                painArea: notif.meta?.painArea || 'تسجيل حساب جديد',
                pin: notif.meta?.unlockPin || ''
            });
        }
    }

    // إرسال تنبيه تسجيل مشترك جديد
    function notifyNewSubscriber(data) {
        if (!data) return;
        const name = data.name || data.fullName || 'مشترك جديد';
        const phone = data.phone || '';
        const painArea = data.painArea || data.painAreaTitle || 'فحص واستشارة سريرية';

        const dedupeKey = `reg_${phone}_${name}`;
        if (isDuplicate(dedupeKey)) return;

        const cleanCode = getMatchedCode(phone || name, 1, data.pin);
        const readyWhatsAppMsg = `مرحباً بك أخي/أختي ${name} 🌸\nيسعدنا تسجيلك في عيادة «وداعاً للألم» للكايروبراكتيك.\nنحن بخدمتك دائماً لتقييم حالتك ومتابعة خطتك العلاجية.\n— د. جمال`;
        const waLink = buildWhatsAppUrl(phone, readyWhatsAppMsg);

        const actions = [];
        if (waLink) {
            actions.push({ action: 'view', label: '💬 محادثة واتساب', url: waLink });
        }
        actions.push({ action: 'view', label: '🖥️ لوحة الإدارة', url: 'https://smartchecktools.com/admin.html' });

        return sendPushToPhone({
            title: `🌟 مشترك جديد بالعيادة: ${name}`,
            message: `👤 الاسم: ${name}\n📱 الهاتف: ${phone || 'بدون هاتف'}\n🩺 موضع الشكوى: ${painArea}\n🔑 كود المراجع: ${cleanCode}`,
            priority: 4,
            tags: ['sparkles', 'busts_in_silhouette'],
            click: 'https://smartchecktools.com/admin.html',
            pin: cleanCode,
            actions: actions
        });
    }

    // فحص واختبار وصول الإشعار لهاتف الطبيب مع رسالة واتساب جاهزة ونموذج باقة 5
    function sendTestAlert() {
        const testPhone = getConfig().doctorPhone || '0795651388';
        const readyMsg = buildWhatsAppReadyMessage({
            name: 'أحمد الخالد (تجربة)',
            code: '53035',
            packageTitle: '💼 باقة 5 تشخيصات (10 د.أ)',
            painArea: 'الفقرات القطنية وأسفل الظهر'
        });
        const waLink = buildWhatsAppUrl(testPhone, readyMsg);

        return sendPushToPhone({
            title: '💳 طلب كود [باقة 5 💼]: مراجع تجريبي',
            message: '👤 المشترك: أحمد الخالد (فحص تجريبي)\n' +
                     '📱 الهاتف: ' + testPhone + '\n' +
                     '📦 الباقة: 💼 باقة 5 تشخيصات (10 د.أ)\n' +
                     '🩺 موضع الشكوى: الفقرات القطنية وأسفل الظهر\n' +
                     '🔑 كود التفعيل: 53035\n' +
                     '👉 اضغط (إرسال الكود بالواتساب) لتجربة الرسالة الجاهزة!',
            priority: 5,
            tags: ['bell', 'moneybag', 'key', 'test_tube'],
            click: 'https://smartchecktools.com/admin.html',
            actions: [
                { action: 'view', label: '💬 إرسال الكود بالواتساب', url: waLink },
                { action: 'view', label: '🖥️ لوحة الإدارة', url: 'https://smartchecktools.com/admin.html' }
            ]
        });
    }

    return {
        getConfig,
        saveConfig,
        formatPackageInfo,
        getMatchedCode,
        buildWhatsAppReadyMessage,
        buildWhatsAppUrl,
        sendPushToPhone,
        notifyUnlockRequest,
        notifyAdminNotification,
        notifyNewSubscriber,
        sendTestAlert,
        DEFAULT_TOPIC,
        DEFAULT_DOCTOR_PHONE
    };
})();

if (typeof window !== 'undefined') {
    window.SmartMobileAlerts = SmartMobileAlerts;
}
if (typeof module !== 'undefined' && module.exports) {
    module.exports = SmartMobileAlerts;
}
