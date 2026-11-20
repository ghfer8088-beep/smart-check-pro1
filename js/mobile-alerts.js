/**
 * SmartMobileAlerts (v30.70)
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

        if (typeof window !== 'undefined' && typeof window.generateUserBoundCode === 'function') {
            return window.generateUserBoundCode(phoneOrName, t, 0);
        }

        // توليد الكود وفق الخوارزمية المعتمدة المتطابقة 100% مع js/app.js و admin.html
        let rawS = String(phoneOrName || '').trim();
        let sDigits = rawS.replace(/\D/g, '');
        let seed = (sDigits.length >= 7 && !/[A-Za-z\u0600-\u06FF]/.test(rawS))
            ? ('P' + sDigits.slice(-7))
            : ('N' + rawS.replace(/[\u064B-\u0652\u0640]/g, '').replace(/[أإآ]/g, 'ا').replace(/ى/g, 'ي').replace(/ة/g, 'ه').replace(/\s+/g, ' ').toLowerCase());
        if (!seed) seed = 'Pwada3an';
        let hash = 5381;
        const str = seed + '#0';
        for (let i = 0; i < str.length; i++) {
            hash = ((hash * 33) ^ str.charCodeAt(i)) & 0x7fffffff;
        }
        const basePin = String(1000 + (hash % 9000));
        if (t === 10) return '10' + basePin;
        if (t === 5) return '5' + basePin;
        return basePin;
    }

    // صياغة رسالة الواتساب الاحترافية الجاهزة للإرسال (مختصرة وخالية من الرموز الثقيلة لتفادي تضخم رابط FCM 4KB)
    function buildWhatsAppReadyMessage({ name, code, packageTitle, shortBadge }) {
        const rawBadge = shortBadge || packageTitle || 'التشخيص الذكي';
        const cleanBadge = String(rawBadge).replace(/[\u{1F300}-\u{1FAFF}\u2600-\u27BF\uFE0F]/gu, '').trim();
        return `مرحبا ${name || 'المراجع'}، عيادة وداعا للألم\n` +
               `تم تفعيل: ${cleanBadge}\n` +
               `كود التفعيل: *${code}*`;
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

        return `https://wa.me/${digits}?text=${encodeURIComponent(text)}`;
    }

    const SENT_ALERTS_KEY = 'smart_sent_push_alerts_v2';
    const _inFlightKeys = new Set();
    const DEDUPE_TTL_MS = 5 * 1000; // 5 ثوانٍ لمنع النقر المزدوج المتتالي فقط

    // حساب حجم النص بالبايت (UTF-8) لضمان بقاء الإشعار ضمن حدود Firebase FCM/APNs
    function getUtf8ByteLength(str) {
        try {
            if (typeof TextEncoder !== 'undefined') {
                return new TextEncoder().encode(str).length;
            }
        } catch(e) {}
        return unescape(encodeURIComponent(str)).length;
    }

    function fitPayloadUnderLimit(payloadObj, maxBytes = 1400) {
        const clone = { ...payloadObj };
        if (getUtf8ByteLength(JSON.stringify(clone)) <= maxBytes) return clone;

        // تقليص نص الرسالة تدريجياً بالحفاظ على الحروف الكاملة
        if (clone.message) {
            const chars = Array.from(String(clone.message));
            while (chars.length > 40 && getUtf8ByteLength(JSON.stringify(clone)) > maxBytes) {
                chars.pop();
                clone.message = chars.join('') + '…';
            }
        }
        // إزالة الأزرار فقط كحل أخير إذا استمر تجاوز الحد الأقصى
        if (getUtf8ByteLength(JSON.stringify(clone)) > maxBytes && clone.actions) {
            delete clone.actions;
        }
        return clone;
    }

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

    // إرسال طلب نشر مفرد إلى ntfy.sh بصيغة نصية خفيفة لتفادي CORS Preflight وإعادة المحاولة عند التعثر
    async function publishNtfyPayload(payloadObj, allowRetry = true) {
        const bodyStr = JSON.stringify(fitPayloadUnderLimit(payloadObj, 1400));
        try {
            const resp = await fetch('https://ntfy.sh', {
                method: 'POST',
                mode: 'cors',
                credentials: 'omit',
                keepalive: true,
                headers: { 'Content-Type': 'text/plain; charset=utf-8' },
                body: bodyStr
            });
            if (!resp.ok) {
                throw new Error('HTTP ' + resp.status);
            }
            const res = await resp.json().catch(() => ({}));
            console.log(`[MobileAlerts] Push notification delivered via NTFY [${payloadObj.topic}]:`, res?.id || 'OK');
            return { ok: true, id: res?.id || 'OK' };
        } catch (err) {
            console.warn(`[MobileAlerts] Push error [${payloadObj.topic}]:`, err);
            if (allowRetry) {
                await new Promise(resolve => setTimeout(resolve, 2500));
                return publishNtfyPayload(payloadObj, false);
            }
            return { ok: false, error: err?.message || 'network_error' };
        }
    }

    // إرسال تنبيه Push لهاتف الطبيب عبر كافة القنوات المعتمدة دون تزامن متصادم وبحجم آمن لـ FCM/APNs
    async function sendPushToPhone(alertData) {
        if (!alertData) return { success: false, reason: 'empty_data' };
        const cfg = getConfig();
        if (!cfg.enabled) return { success: false, reason: 'disabled' };

        const title = alertData.title || '🔔 مشترك جديد بانتظار الكود';
        const message = alertData.message || '';
        const priority = alertData.priority || 5; // 5 = Urgent (صوت واهتزاز عالي)
        const tags = alertData.tags || ['bell', 'busts_in_silhouette', 'key'];
        const clickUrl = alertData.click || 'https://smartchecktools.com/admin.html';
        const actions = (Array.isArray(alertData.actions) && alertData.actions.length > 0)
            ? alertData.actions
            : undefined;

        // قائمة القنوات المعتمدة لضمان وصول الإشعار مع تباعد زمني 1.5 ثانية لتجنب حظر التزامن في ntfy/FCM
        const targetTopics = Array.from(new Set([
            cfg.topic,
            DEFAULT_TOPIC,
            'smartcheckpro_updates'
        ].filter(Boolean)));

        const basePayload = {
            title: title,
            message: message,
            priority: priority,
            tags: tags,
            click: clickUrl
        };
        if (actions) basePayload.actions = actions;

        // إرسال فوري للقناة الأساسية عند 0ms
        const primaryTopic = targetTopics[0];
        const primaryPromise = primaryTopic
            ? publishNtfyPayload({ ...basePayload, topic: primaryTopic }, true)
            : Promise.resolve({ ok: false });

        // تأخير القنوات الاحتياطية بمقدار 1500ms لكل قناة لمنع تداخل طلبات FCM في نفس اللحظة
        targetTopics.slice(1).forEach((topic, idx) => {
            setTimeout(() => {
                publishNtfyPayload({ ...basePayload, topic: topic }, true).catch(() => {});
            }, (idx + 1) * 1500);
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

        const primaryRes = await primaryPromise;
        return { success: !!primaryRes?.ok, topics: targetTopics };
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

        // بناء مفتاح التمييز الصارم لمنع التكرار (رقم هاتف المريض أو اسمه + نوع الطلب + الباقة + المرجع)
        const cleanPhoneDigits = subPhone.replace(/\D/g, '').slice(-9);
        const patientIdentity = cleanPhoneDigits || subName.toLowerCase().replace(/\s+/g, '_');
        const refClean = String(data.transferRef || '').trim().toUpperCase();
        const dedupeKey = `req_${patientIdentity}_${isHumanitarian ? 'humanitarian' : ('paid_' + pkgSize + '_' + refClean)}`;

        if (isDuplicateAlert(dedupeKey)) {
            console.log('[MobileAlerts] Push notification already sent for this request, skipped:', dedupeKey);
            return null;
        }

        // 1. تحديد الباقة
        const pkgInfo = formatPackageInfo(rawReqType, pkgSize);

        // 2. توليد الكود المطابق تماماً للباقة
        const finalCode = getMatchedCode(subPhone || subName, pkgInfo.tier, data.pin || data.unlockPin);

        // 3. بناء نص الواتساب الجاهز المختصر
        const readyWhatsAppMsg = buildWhatsAppReadyMessage({
            name: subName,
            code: finalCode,
            packageTitle: pkgInfo.title,
            shortBadge: pkgInfo.shortBadge
        });

        // 4. بناء رابط الواتساب المباشر
        const waLink = buildWhatsAppUrl(subPhone, readyWhatsAppMsg);

        // 5. صياغة العنوان ونص الإشعار
        const alertTitle = pkgInfo.isHumanitarian 
            ? `❤️ طلب مبادرة الرعاية الإنسانية: ${subName}`
            : `💳 طلب كود [${pkgInfo.shortBadge}]: ${subName}`;

        const refLine = refClean ? `🔖 الحوالة: ${refClean}\n` : '';
        const alertMessage = 
            `👤 المشترك: ${subName}\n` +
            `📱 الهاتف: ${subPhone || 'غير مسجل'}\n` +
            `📦 الباقة: ${pkgInfo.shortBadge}\n` +
            `🩺 الشكوى: ${painArea}\n` +
            refLine +
            `🔑 كود التفعيل: ${finalCode}`;

        const actions = [];
        if (waLink) {
            actions.push({ action: 'view', label: '💬 إرسال الكود بالواتساب', url: waLink });
        }

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
            shortBadge: 'باقة 5 💼'
        });
        const waLink = buildWhatsAppUrl(testPhone, readyMsg);

        return sendPushToPhone({
            title: '💳 طلب كود [باقة 5 💼]: مراجع تجريبي',
            message: '👤 المشترك: أحمد الخالد (فحص تجريبي)\n' +
                     '📱 الهاتف: ' + testPhone + '\n' +
                     '📦 الباقة: باقة 5 💼 (10 د.أ)\n' +
                     '🩺 الشكوى: الفقرات القطنية وأسفل الظهر\n' +
                     '🔑 كود التفعيل: 53035',
            priority: 5,
            tags: ['bell', 'moneybag', 'key', 'test_tube'],
            click: 'https://smartchecktools.com/admin.html',
            actions: waLink ? [
                { action: 'view', label: '💬 إرسال الكود بالواتساب', url: waLink }
            ] : []
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
