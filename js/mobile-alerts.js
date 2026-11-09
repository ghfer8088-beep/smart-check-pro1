/**
 * SmartMobileAlerts (v30.67)
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
                title: '❤️ مبادرة الرعاية الإنسانية (مجاني)',
                shortBadge: 'رعاية إنسانية ❤️',
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

    const SENT_ALERTS_KEY = 'smart_sent_push_alerts_v2';
    const _inFlightKeys = new Set();
    const DEDUPE_TTL_MS = 15 * 1000; // 15 ثانية لمنع النقر المزدوج المتتالي فقط والسماح بالتجربة وإعادة الطلب فوراً

    // التحقق الصارم ومنع تكرار الإشعار عبر التخزين الدائم (localStorage) وقفل التزامن اللحظي
    function isDuplicateAlert(key) {
        if (!key) return false;
        if (_inFlightKeys.has(key)) {
            console.log('[MobileAlerts] Alert in-flight locked, skipping duplicate:', key);
            return true;
        }

        try {
            let alerts = {};
            try {
                const raw = (typeof localStorage !== 'undefined') ? localStorage.getItem(SENT_ALERTS_KEY) : null;
                if (raw) alerts = JSON.parse(raw);
            } catch(e) {}

            const now = Date.now();
            const lastSent = alerts[key];

            // إذا أُرسل إشعار لنفس المريض والطلب قبل أقل من 15 ثانية، يتم منعه منعاً للنقر المزدوج
            if (lastSent && (now - lastSent) < DEDUPE_TTL_MS) {
                console.log(`[MobileAlerts] Duplicate alert suppressed (already sent ${(now - lastSent) / 1000}s ago):`, key);
                return true;
            }

            // قفل لحظي لمدة 10 ثوانٍ لمنع النقر المتعدد أو التزامن المزدوج
            _inFlightKeys.add(key);
            setTimeout(() => _inFlightKeys.delete(key), 10000);

            // تسجيل وقت الإرسال وحفظه في التخزين الدائم
            alerts[key] = now;

            // تنظيف السجلات القديمة أكثر من ساعة واحدة
            Object.keys(alerts).forEach(k => {
                if (now - alerts[k] > 60 * 60 * 1000) delete alerts[k];
            });

            if (typeof localStorage !== 'undefined') {
                localStorage.setItem(SENT_ALERTS_KEY, JSON.stringify(alerts));
            }
            return false;
        } catch(e) {
            return false;
        }
    }

    // إرسال تنبيه Push لهاتف الطبيب عبر كافة القنوات المعتمدة لضمان الوصول 100%
    async function sendPushToPhone(alertData) {
        if (!alertData) return { success: false, reason: 'empty_data' };
        const cfg = getConfig();
        if (!cfg.enabled) return { success: false, reason: 'disabled' };

        const title = alertData.title || '🔔 مشترك جديد بانتظار الكود';
        const message = alertData.message || '';
        const priority = alertData.priority || 5; // 5 = Urgent (صوت واهتزاز عالي)
        const tags = alertData.tags || ['bell', 'busts_in_silhouette', 'key'];
        const clickUrl = alertData.click || 'https://smartchecktools.com/admin.html';
        const actions = alertData.actions || [
            { action: 'view', label: '🖥️ لوحة الإدارة', url: clickUrl }
        ];

        // قائمة القنوات المعتمدة لضمان وصول الإشعار مهما كانت قناة الهاتف المشترك بها
        const targetTopics = Array.from(new Set([
            cfg.topic,
            DEFAULT_TOPIC,
            'smartcheckpro_updates'
        ].filter(Boolean)));

        targetTopics.forEach(topic => {
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
                    console.log(`[MobileAlerts] Push notification delivered via NTFY [${topic}]:`, res?.id || 'OK');
                }).catch(err => {
                    console.warn(`[MobileAlerts] Push error [${topic}]:`, err);
                });
            } catch(e) {}
        });

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

        return { success: true, topics: targetTopics };
    }

    // إرسال تنبيه مشترك جديد يطلب كود التفعيل (دفع باقة أو إعفاء إنساني فقط!)
    function notifyUnlockRequest(data) {
        if (!data) return null;
        const subName = (data.name || data.subscriberName || 'مشترك جديد').trim();
        const subPhone = (data.phone || data.subscriberPhone || '').trim();
        const painArea = data.painArea || 'فحص واستشارة سريرية';
        const rawReqType = String(data.requestType || data.paymentType || '').toLowerCase();
        const pkgSize = data.packageSize || 1;

        // فلترة صارمة: الإشعار يرسل فقط وفقط عند الدفع أو الإعفاء الإنساني
        const isHumanitarian = (rawReqType.includes('human') || rawReqType.includes('waiver') || rawReqType.includes('free'));
        const isPaid = (rawReqType.includes('paid') || rawReqType.includes('orange') || rawReqType.includes('wallet') || rawReqType.includes('payment'));

        if (!isHumanitarian && !isPaid) {
            console.log('[MobileAlerts] Ignored non-payment/non-humanitarian request:', rawReqType);
            return null;
        }

        // بناء مفتاح التمييز الصارم لمنع التكرار (رقم هاتف المريض أو اسمه + نوع الطلب)
        const cleanPhoneDigits = subPhone.replace(/\D/g, '').slice(-9);
        const patientIdentity = cleanPhoneDigits || subName.toLowerCase().replace(/\s+/g, '_');
        const dedupeKey = `req_${patientIdentity}_${isHumanitarian ? 'humanitarian' : 'paid'}`;

        if (isDuplicateAlert(dedupeKey)) {
            console.log('[MobileAlerts] Push notification already sent for this request, skipped:', dedupeKey);
            return null;
        }

        // 1. تحديد الباقة
        const pkgInfo = formatPackageInfo(rawReqType, pkgSize);

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
            ? `❤️ طلب مبادرة الرعاية الإنسانية: ${subName}`
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

    // إشعارات الإدارة الداخلية الأخرى (تم إلغاء إرسالها للهاتف نهائياً لأن المطلوب فقط عند الدفع أو الإعفاء الإنساني)
    function notifyAdminNotification(notif) {
        // معطل بالكامل لمنع أي إشعارات متكررة أو غير ضرورية على هاتف الطبيب
        return null;
    }

    // إرسال تنبيه تسجيل مشترك جديد (معطل بالكامل بناء على رغبة الطبيب لعدم الإزعاج)
    function notifyNewSubscriber(data) {
        // معطل بالكامل: الإشعار يرسل فقط عند طلب كود باقة أو إعفاء إنساني
        return null;
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
