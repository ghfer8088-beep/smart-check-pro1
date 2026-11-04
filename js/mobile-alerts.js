/**
 * SmartMobileAlerts (v30.55)
 * =========================================================================
 * منظومة إشعارات الموبايل الفورية الخاصة بالطبيب / الإدارة
 * ترسل تنبيهاً فورياً مع رنة واهتزاز إلى هاتف الطبيب لكل مشترك جديد أو طلب كود
 * 
 * القنوات المدعومة:
 * 1. تطبيق NTFY للهواتف الذكية (Android / iOS) - مجاني وفوري 100% ويعمل بدون فتح اللوحة.
 * 2. إشعارات واتساب لهاتف الطبيب (عبر المحرك الآلي إن وجد).
 * 3. إشعارات المتصفح الأصلية (Web Push).
 * =========================================================================
 */
const SmartMobileAlerts = (function() {
    'use strict';

    const DEFAULT_TOPIC = 'wada3an_doctor_phone_alerts';
    const DEFAULT_DOCTOR_PHONE = '0795651388';

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

    // إرسال تنبيه Push لهاتف الطبيب
    async function sendPushToPhone(alertData) {
        if (!alertData) return { success: false, reason: 'empty_data' };
        const cfg = getConfig();
        if (!cfg.enabled) return { success: false, reason: 'disabled' };

        const topic = cfg.topic || DEFAULT_TOPIC;
        const title = alertData.title || '🔔 مشترك جديد بانتظار الكود';
        const message = alertData.message || '';
        const priority = alertData.priority || 4; // 4 = High, 5 = Urgent
        const tags = alertData.tags || ['bell', 'busts_in_silhouette', 'key'];
        const clickUrl = alertData.click || 'https://smartchecktools.com/admin.html';
        const actions = alertData.actions || [
            { action: 'view', label: '🖥️ لوحة الإدارة', url: clickUrl }
        ];

        // 1. الإرسال السحابي المباشر لهاتف الطبيب عبر تطبيق NTFY
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
                console.log('[MobileAlerts] Push notification delivered to phone via NTFY:', res?.id || 'OK');
            }).catch(err => {
                console.warn('[MobileAlerts] Push error:', err);
            });
        } catch(e) {}

        // 2. إرسال تنبيه واتساب لهاتف الطبيب إن كان مفعلاً
        if (typeof SmartWhatsApp !== 'undefined' && cfg.doctorPhone) {
            try {
                const waCfg = SmartWhatsApp.getConfig();
                if (waCfg && waCfg.enabled && waCfg.provider !== 'one_click_link') {
                    SmartWhatsApp.sendAutomatedWhatsApp({
                        phone: cfg.doctorPhone,
                        name: 'د. جمال',
                        code: alertData.pin || '',
                        customMessage: `🔔 تنبيه سريري جديد:\n${title}\n\n${message}\n\nلوحة الإدارة: https://smartchecktools.com/admin.html`
                    }).catch(() => {});
                }
            } catch(e) {}
        }

        // 3. إشعار المتصفح الأصلي (Native Web Notification)
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

    // إرسال تنبيه مشترك جديد يطلب كود التفعيل
    function notifyUnlockRequest(data) {
        const subName = data.name || data.subscriberName || 'مشترك جديد';
        const subPhone = data.phone || data.subscriberPhone || '';
        const painArea = data.painArea || 'فحص واستشارة';
        const reqType = (data.requestType === 'humanitarian' || (data.status && data.status.includes('إعفاء'))) ? '🌿 طلب إعفاء إنساني' : '💳 حوالة أورانج موني';
        const pin = data.pin || data.unlockPin || '';

        const cleanPhDigits = subPhone.replace(/\D/g, '');
        const waLink = cleanPhDigits ? `https://wa.me/962${cleanPhDigits.slice(-9)}?text=${encodeURIComponent(`مرحباً أخي/أختي ${subName}، كود التفعيل المعتمد لفتح التقرير الطبي هو: ${pin}`)}` : '';

        const actions = [
            { action: 'view', label: '🖥️ لوحة الإدارة', url: 'https://smartchecktools.com/admin.html' }
        ];
        if (waLink) {
            actions.push({ action: 'view', label: '💬 إرسال الكود بالواتساب', url: waLink });
        }

        return sendPushToPhone({
            title: `🔔 مشترك جديد بانتظار الكود: ${subName}`,
            message: `👤 المشترك: ${subName}\n📱 الهاتف: ${subPhone || 'غير مسجل'}\n🩺 موضع الشكوى: ${painArea}\n💳 المعاملة: ${reqType}\n🔑 كود التفعيل: ${pin}`,
            priority: 5, // Urgent (صوت واهتزاز فوري)
            tags: ['bell', 'warning', 'key', 'moneybag'],
            click: 'https://smartchecktools.com/admin.html',
            pin: pin,
            actions: actions
        });
    }

    // إرسال تنبيه تسجيل مشترك جديد
    function notifyNewSubscriber(data) {
        const name = data.name || data.fullName || 'مشترك جديد';
        const phone = data.phone || '';
        const painArea = data.painArea || data.painAreaTitle || 'فحص واستشارة';
        const pin = data.pin || data.unlockPin || '';

        const cleanPhDigits = phone.replace(/\D/g, '');
        const waLink = cleanPhDigits ? `https://wa.me/962${cleanPhDigits.slice(-9)}` : '';
        const actions = [
            { action: 'view', label: '🖥️ لوحة الإدارة', url: 'https://smartchecktools.com/admin.html' }
        ];
        if (waLink) {
            actions.push({ action: 'view', label: '💬 محادثة واتساب', url: waLink });
        }

        return sendPushToPhone({
            title: `🌟 مشترك جديد بالعيادة: ${name}`,
            message: `👤 الاسم: ${name}\n📱 الهاتف: ${phone || 'بدون هاتف'}\n🩺 موضع الشكوى: ${painArea}\n🔑 كود التفعيل: ${pin || '—'}`,
            priority: 4,
            tags: ['sparkles', 'busts_in_silhouette'],
            click: 'https://smartchecktools.com/admin.html',
            pin: pin,
            actions: actions
        });
    }

    // فحص واختبار وصول الإشعار لهاتف الطبيب
    function sendTestAlert() {
        return sendPushToPhone({
            title: '🔔 اختبار إشعارات الهاتف - وداعاً للألم',
            message: '✅ تهانينا دكتور! نظام التنبيهات متصل بهاتفك بنجاح 100%.\nستصلك رنة واهتزاز فوري عند تسجيل أي مشترك جديد أو طلب كود.',
            priority: 5,
            tags: ['white_check_mark', 'tada', 'bell'],
            click: 'https://smartchecktools.com/admin.html'
        });
    }

    return {
        getConfig,
        saveConfig,
        sendPushToPhone,
        notifyUnlockRequest,
        notifyNewSubscriber,
        sendTestAlert,
        DEFAULT_TOPIC,
        DEFAULT_DOCTOR_PHONE
    };
})();

if (typeof window !== 'undefined') {
    window.SmartMobileAlerts = SmartMobileAlerts;
}
