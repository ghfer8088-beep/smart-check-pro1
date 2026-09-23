/**
 * =================================================================================
 * 🌍 SMART CHECK PRO - GEOLOCATION & VISITOR INTELLIGENCE TRACKER (v30.0)
 * محرك التتبع الذكي لرصد الزوار، الحضور اللحظي، ومسار الفحص السريري
 * =================================================================================
 */

(function () {
    'use strict';

    const GEO_CACHE_KEY = 'smart_geo_visitor_info';
    const VISITOR_ID_KEY = 'smart_unique_visitor_id';
    const SESSION_ID_KEY = 'smart_unique_session_id';
    const VISITS_HISTORY_KEY = 'smart_geo_visits_history';
    const PAIN_POINTS_ANALYTICS_KEY = 'smart_analytics_pain_points';
    const PRESENCE_CHANNEL_NAME = 'smart_presence_broadcast_channel';

    // 1. توليد أو استرجاع معرّف الزائر الثابت للجهاز
    function getOrCreateVisitorId() {
        let vid = null;
        try { vid = localStorage.getItem(VISITOR_ID_KEY); } catch(e) {}
        if (!vid) {
            vid = 'vis_' + Date.now().toString(36) + '_' + Math.random().toString(36).substr(2, 6);
            try { localStorage.setItem(VISITOR_ID_KEY, vid); } catch(e) {}
        }
        return vid;
    }

    // 2. توليد أو استرجاع معرّف الجلسة الحالية (لكل تبويب/زيارة)
    function getOrCreateSessionId() {
        let sid = null;
        try { sid = sessionStorage.getItem(SESSION_ID_KEY); } catch(e) {}
        if (!sid) {
            sid = 'sess_' + Date.now().toString(36) + '_' + Math.random().toString(36).substr(2, 5);
            try { sessionStorage.setItem(SESSION_ID_KEY, sid); } catch(e) {}
        }
        return sid;
    }

    // 3. التحقق مما إذا كان التطبيق مثبتاً كـ PWA
    function checkIsPwa() {
        try {
            const isStandalone = (window.matchMedia && window.matchMedia('(display-mode: standalone)').matches);
            const isNavStandalone = (window.navigator && window.navigator.standalone === true);
            const isLocalFlag = (localStorage.getItem('smart_pwa_installed') === 'true');
            return Boolean(isStandalone || isNavStandalone || isLocalFlag);
        } catch(e) {
            return false;
        }
    }

    // 4. كشف نوع الجهاز بدقة متناهية (كمبيوتر محمول ولابتوب، هاتف، تابلت)
    function detectDeviceType() {
        const ua = (typeof navigator !== 'undefined' && navigator.userAgent) ? navigator.userAgent : '';
        const width = (typeof window !== 'undefined' && window.innerWidth) ? window.innerWidth : 1024;
        
        // أجهزة الكمبيوتر والمكتبي واللابتوب (حتى مع شاشات اللمس)
        const isDesktopOS = /Windows NT|Macintosh|Mac OS X|Linux x86_64|CrOS/i.test(ua);
        const hasExplicitMobile = /Mobile|iP(hone|od)|Android.*Mobile|BlackBerry|IEMobile|Opera M(obi|ini)/i.test(ua);
        
        if (isDesktopOS && !hasExplicitMobile) {
            return { type: 'Desktop', icon: '💻', label: 'كمبيوتر محمول / مكتبي' };
        }

        // أجهزة الآيباد والتابلت
        const isIPadOS = (typeof navigator !== 'undefined' && navigator.platform === 'MacIntel' && navigator.maxTouchPoints > 1);
        if (/(tablet|ipad|playbook|silk)|(android(?!.*mobi))/i.test(ua) || isIPadOS) {
            return { type: 'Tablet', icon: '📟', label: 'جهاز لوحي (تابلت)' };
        }

        // الهواتف الذكية المحمولة
        if (hasExplicitMobile || /Android|iPhone|iPod|BlackBerry|IEMobile|Opera Mini/i.test(ua)) {
            return { type: 'Mobile', icon: '📱', label: 'هاتف محمول' };
        }

        // شاشات كبيرة بدون إشارة هاتف تعامل كلابتوب/كمبيوتر
        if (width >= 992) {
            return { type: 'Desktop', icon: '💻', label: 'كمبيوتر محمول / مكتبي' };
        }

        return { type: 'Mobile', icon: '📱', label: 'هاتف محمول' };
    }

    // 5. تحويل رمز الدولة إلى إيموجي العلم
    function getCountryFlag(countryCode) {
        if (!countryCode || countryCode.length !== 2) return '🌐';
        try {
            const codePoints = countryCode
                .toUpperCase()
                .split('')
                .map(char => 127397 + char.charCodeAt(0));
            return String.fromCodePoint(...codePoints);
        } catch(e) {
            return '🌐';
        }
    }

    // قاموس تعريب أسماء الدول
    const ARABIC_COUNTRIES = {
        'JO': 'الأردن',
        'SA': 'المملكة العربية السعودية',
        'AE': 'الإمارات العربية المتحدة',
        'EG': 'مصر',
        'KW': 'الكويت',
        'QA': 'قطر',
        'BH': 'البحرين',
        'OM': 'سلطنة عمان',
        'IQ': 'العراق',
        'PS': 'فلسطين',
        'LB': 'لبنان',
        'SY': 'سوريا',
        'YE': 'اليمن',
        'DZ': 'الجزائر',
        'MA': 'المغرب',
        'TN': 'تونس',
        'LY': 'ليبيا',
        'SD': 'السودان',
        'TR': 'تركيا',
        'US': 'الولايات المتحدة',
        'GB': 'المملكة المتحدة',
        'DE': 'ألمانيا',
        'FR': 'فرنسا',
        'CA': 'كندا',
        'SE': 'السويد',
        'CN': 'الصين'
    };

    // استنتاج فوري للموقع من التوقيت المحلي (0ms Fallback)
    function inferCountryFromTimezone() {
        try {
            const tz = Intl.DateTimeFormat().resolvedOptions().timeZone || '';
            const t = tz.toLowerCase();
            if (t.includes('amman') || t.includes('jordan')) return { country: 'الأردن', countryCode: 'JO', flag: '🇯🇴', city: 'عمّان' };
            if (t.includes('riyadh')) return { country: 'المملكة العربية السعودية', countryCode: 'SA', flag: '🇸🇦', city: 'الرياض' };
            if (t.includes('dubai')) return { country: 'الإمارات العربية المتحدة', countryCode: 'AE', flag: '🇦🇪', city: 'دبي' };
            if (t.includes('cairo')) return { country: 'مصر', countryCode: 'EG', flag: '🇪🇬', city: 'القاهرة' };
            if (t.includes('baghdad')) return { country: 'العراق', countryCode: 'IQ', flag: '🇮🇶', city: 'بغداد' };
            if (t.includes('jerusalem') || t.includes('gaza') || t.includes('hebron')) return { country: 'فلسطين', countryCode: 'PS', flag: '🇵🇸', city: 'القدس' };
            if (t.includes('kuwait')) return { country: 'الكويت', countryCode: 'KW', flag: '🇰🇼', city: 'الكويت' };
            if (t.includes('qatar')) return { country: 'قطر', countryCode: 'QA', flag: '🇶🇦', city: 'الدوحة' };
            if (t.includes('bahrain')) return { country: 'البحرين', countryCode: 'BH', flag: '🇧🇭', city: 'المنامة' };
            if (t.includes('muscat')) return { country: 'سلطنة عمان', countryCode: 'OM', flag: '🇴🇲', city: 'مسقط' };
            if (t.includes('berlin')) return { country: 'ألمانيا', countryCode: 'DE', flag: '🇩🇪', city: 'برلين' };
            if (t.includes('london')) return { country: 'المملكة المتحدة', countryCode: 'GB', flag: '🇬🇧', city: 'لندن' };
            return { country: 'الأردن', countryCode: 'JO', flag: '🇯🇴', city: 'عمّان' };
        } catch (e) {
            return { country: 'الأردن', countryCode: 'JO', flag: '🇯🇴', city: 'عمّان' };
        }
    }

    function inferCountryFromPhone(phone) {
        if (!phone) return null;
        let clean = phone.replace(/\D/g, '');
        if (clean.startsWith('00')) clean = clean.slice(2);
        if (clean.startsWith('962') || clean.startsWith('07')) return { country: 'الأردن', countryCode: 'JO', flag: '🇯🇴', city: 'عمّان' };
        if (clean.startsWith('966') || clean.startsWith('05')) return { country: 'المملكة العربية السعودية', countryCode: 'SA', flag: '🇸🇦', city: 'الرياض' };
        if (clean.startsWith('971')) return { country: 'الإمارات العربية المتحدة', countryCode: 'AE', flag: '🇦🇪', city: 'دبي' };
        if (clean.startsWith('44')) return { country: 'المملكة المتحدة', countryCode: 'GB', flag: '🇬🇧', city: 'لندن' };
        if (clean.startsWith('49')) return { country: 'ألمانيا', countryCode: 'DE', flag: '🇩🇪', city: 'فرانكفورت' };
        if (clean.startsWith('970') || clean.startsWith('972')) return { country: 'فلسطين', countryCode: 'PS', flag: '🇵🇸', city: 'القدس' };
        if (clean.startsWith('964')) return { country: 'العراق', countryCode: 'IQ', flag: '🇮🇶', city: 'بغداد' };
        if (clean.startsWith('20') || (clean.startsWith('01') && clean.length === 11)) return { country: 'مصر', countryCode: 'EG', flag: '🇪🇬', city: 'القاهرة' };
        if (clean.startsWith('965')) return { country: 'الكويت', countryCode: 'KW', flag: '🇰🇼', city: 'الكويت' };
        if (clean.startsWith('974')) return { country: 'قطر', countryCode: 'QA', flag: '🇶🇦', city: 'الدوحة' };
        if (clean.startsWith('968')) return { country: 'سلطنة عمان', countryCode: 'OM', flag: '🇴🇲', city: 'مسقط' };
        if (clean.startsWith('973')) return { country: 'البحرين', countryCode: 'BH', flag: '🇧🇭', city: 'المنامة' };
        if (clean.startsWith('961')) return { country: 'لبنان', countryCode: 'LB', flag: '🇱🇧', city: 'بيروت' };
        if (clean.startsWith('963')) return { country: 'سوريا', countryCode: 'SY', flag: '🇸🇾', city: 'دمشق' };
        return null;
    }

    // جلب الموقع الجغرافي بدقة وسرعة مع التخزين المؤقت
    async function fetchGeoLocation() {
        try {
            const cached = sessionStorage.getItem(GEO_CACHE_KEY);
            if (cached) {
                const parsed = JSON.parse(cached);
                if (parsed && parsed.country && parsed.country !== 'غير محدد') {
                    return parsed;
                }
            }
        } catch (e) {}

        const visitorId = getOrCreateVisitorId();
        const device = detectDeviceType();
        const tzInfo = inferCountryFromTimezone();

        let geoData = {
            visitorId: visitorId,
            ip: '',
            country: tzInfo ? tzInfo.country : 'الأردن',
            countryCode: tzInfo ? tzInfo.countryCode : 'JO',
            flag: tzInfo ? tzInfo.flag : '🇯🇴',
            city: tzInfo ? tzInfo.city : 'عمّان',
            region: '',
            device: device.type,
            deviceIcon: device.icon,
            deviceLabel: device.label,
            isPwa: checkIsPwa(),
            timestamp: new Date().toISOString()
        };

        try {
            const controller = new AbortController();
            const timeoutId = setTimeout(() => controller.abort(), 2500);
            const res = await fetch('https://ipwho.is/?lang=ar', { signal: controller.signal });
            clearTimeout(timeoutId);

            if (res.ok) {
                const data = await res.json();
                if (data && data.success !== false) {
                    geoData.ip = data.ip || '';
                    geoData.countryCode = data.country_code || '';
                    geoData.country = data.country || ARABIC_COUNTRIES[data.country_code] || data.country_code || geoData.country;
                    geoData.city = data.city || geoData.city;
                    geoData.region = data.region || '';
                    geoData.flag = (data.flag && data.flag.emoji) ? data.flag.emoji : getCountryFlag(data.country_code);
                    try { sessionStorage.setItem(GEO_CACHE_KEY, JSON.stringify(geoData)); } catch (e) {}
                    return geoData;
                }
            }
        } catch (err) {
            try {
                const altRes = await fetch('https://api.country.is/');
                if (altRes.ok) {
                    const altData = await altRes.json();
                    if (altData && altData.country) {
                        const cCode = altData.country;
                        geoData.countryCode = cCode;
                        geoData.country = ARABIC_COUNTRIES[cCode] || cCode;
                        geoData.flag = getCountryFlag(cCode);
                        geoData.ip = altData.ip || '';
                        try { sessionStorage.setItem(GEO_CACHE_KEY, JSON.stringify(geoData)); } catch (e) {}
                        return geoData;
                    }
                }
            } catch (altErr) {}
        }

        try { sessionStorage.setItem(GEO_CACHE_KEY, JSON.stringify(geoData)); } catch (e) {}
        return geoData;
    }

    // =========================================================================
    // 🧠 حالة الجلسة السلوكية الحالية وتتبع المسار السريري (Behavioral Session)
    // =========================================================================
    let presenceBroadcastChannel = null;
    try {
        if ('BroadcastChannel' in window) {
            presenceBroadcastChannel = new BroadcastChannel(PRESENCE_CHANNEL_NAME);
        }
    } catch(e) {}

    const sessionState = {
        visitorId: getOrCreateVisitorId(),
        sessionId: getOrCreateSessionId(),
        currentStage: 'صفحة البداية والاستقبال',
        selectedPointId: null,
        selectedPointTitle: null,
        selectedRegion: null,
        reachedReport: false,
        startTime: Date.now(),
        lastActiveTime: Date.now(),
        journey: [
            { stage: 'LANDING', title: 'دخول الأداة الرئيسية', timestamp: Date.now() }
        ]
    };

    // بث نبضة الحضور والتواجد اللحظي
    async function sendPresenceHeartbeat(isLeaving = false) {
        try {
            // لا نبث الحضور من صفحات الإدارة أو المعايرة
            const path = window.location.pathname || '';
            if (path.includes('admin') || path.includes('calibrator')) return;

            const geo = await fetchGeoLocation();
            const device = detectDeviceType();
            const isPwa = checkIsPwa();

            const payload = {
                type: isLeaving ? 'PRESENCE_LEAVE' : 'PRESENCE_PING',
                visitorId: sessionState.visitorId,
                sessionId: sessionState.sessionId,
                device: device.type,
                deviceIcon: device.icon,
                deviceLabel: device.label,
                country: geo.country || 'الأردن',
                countryCode: geo.countryCode || 'JO',
                flag: geo.flag || '🇯🇴',
                city: geo.city || 'عمّان',
                currentStage: sessionState.currentStage,
                painPointTitle: sessionState.selectedPointTitle || '—',
                painPointId: sessionState.selectedPointId || null,
                reachedReport: sessionState.reachedReport,
                isPwa: isPwa,
                timestamp: Date.now()
            };

            // 1. بث عبر BroadcastChannel اللحظي
            if (presenceBroadcastChannel) {
                try { presenceBroadcastChannel.postMessage(payload); } catch(pe) {}
            }

            // 2. بث عبر السحابة اللحظية (SmartCloudSync / MQTT)
            if (window.SmartCloudSync && typeof window.SmartCloudSync.dispatchPresence === 'function') {
                window.SmartCloudSync.dispatchPresence(payload);
            }
        } catch(e) {}
    }

    // توثيق وتحديث مرحلة الزائر السريرية داخل الأداة
    function trackStage(stageKey, stageTitle, meta = {}) {
        try {
            sessionState.currentStage = stageTitle || stageKey;
            sessionState.lastActiveTime = Date.now();
            sessionState.journey.push({
                stage: stageKey,
                title: stageTitle,
                meta: meta,
                timestamp: Date.now()
            });

            if (stageKey === 'DIAGNOSIS_REACHED' || stageKey === 'REPORT_VIEW') {
                sessionState.reachedReport = true;
            }

            // تحديث السجل الدائم في تاريخ الزيارات
            updateLocalVisitSessionRecord();

            // إرسال نبضة فورية بالحالة الجديدة
            sendPresenceHeartbeat(false);
        } catch(e) {}
    }

    // رصد وتوثيق اختيار نقطة ألم تشريحية محددة
    function trackPainPointSelection(point) {
        if (!point) return;
        try {
            sessionState.selectedPointId = point.id;
            sessionState.selectedPointTitle = point.title || point.name || point.id;
            sessionState.selectedRegion = point.region || point.category || 'عام';
            
            trackStage('PAIN_POINT_SELECTED', `تحديد نقطة: ${sessionState.selectedPointTitle}`, {
                pointId: point.id,
                title: sessionState.selectedPointTitle,
                region: sessionState.selectedRegion
            });

            // تسجيل وإحصاء شعبية نقطة الألم (Common Pain Points Counter)
            recordPainPointAnalytics(point);
        } catch(e) {}
    }

    // إحصاء وتجميع نقاط الألم الأكثر شيوعاً وبحثاً
    function recordPainPointAnalytics(point) {
        if (!point || !point.id) return;
        try {
            let stats = {};
            try {
                const raw = localStorage.getItem(PAIN_POINTS_ANALYTICS_KEY);
                if (raw) stats = JSON.parse(raw);
            } catch(e) {}

            const pId = point.id;
            if (!stats[pId]) {
                stats[pId] = {
                    id: pId,
                    title: point.title || point.name || pId,
                    region: point.region || 'العمود الفقري والمفاصل',
                    count: 0,
                    lastSelected: new Date().toISOString()
                };
            }

            stats[pId].count = (stats[pId].count || 0) + 1;
            stats[pId].lastSelected = new Date().toISOString();
            if (point.title && point.title.length > stats[pId].title.length) {
                stats[pId].title = point.title;
            }

            localStorage.setItem(PAIN_POINTS_ANALYTICS_KEY, JSON.stringify(stats));

            // بث تحديث نقطة الألم سحابياً إن أمكن
            if (window.SmartCloudSync && typeof window.SmartCloudSync.dispatchPainPointStat === 'function') {
                window.SmartCloudSync.dispatchPainPointStat(stats[pId]);
            }
        } catch(e) {}
    }

    // استرجاع قائمة نقاط الألم الأكثر شيوعاً مرتبة تنازلياً
    function getTopCommonPainPoints() {
        try {
            let stats = {};
            const raw = localStorage.getItem(PAIN_POINTS_ANALYTICS_KEY);
            if (raw) stats = JSON.parse(raw);

            const list = Object.values(stats);
            list.sort((a, b) => (b.count || 0) - (a.count || 0));
            return list;
        } catch(e) {
            return [];
        }
    }

    // تحديث سجل الزيارة محلياً بكافة التطورات السلوكية
    function updateLocalVisitSessionRecord() {
        try {
            let history = [];
            try {
                const raw = localStorage.getItem(VISITS_HISTORY_KEY);
                if (raw) history = JSON.parse(raw);
            } catch(e) {}

            const sId = sessionState.sessionId;
            const idx = history.findIndex(v => v.sessionId === sId || (v.visitorId === sessionState.visitorId && (Date.now() - new Date(v.timestamp).getTime()) < 3600000));
            
            const updatedData = {
                currentStage: sessionState.currentStage,
                selectedPointId: sessionState.selectedPointId,
                selectedPointTitle: sessionState.selectedPointTitle,
                reachedReport: sessionState.reachedReport,
                journey: sessionState.journey,
                lastActiveTime: new Date(sessionState.lastActiveTime).toISOString()
            };

            if (idx !== -1) {
                history[idx] = { ...history[idx], ...updatedData };
            }

            localStorage.setItem(VISITS_HISTORY_KEY, JSON.stringify(history.slice(-500)));
        } catch(e) {}
    }

    // تسجيل وحفظ الزيارة الكاملة في سجل الزيارات
    async function trackCurrentVisit() {
        try {
            if (window.location.pathname.includes('admin') || window.location.pathname.includes('calibrator')) {
                return null;
            }

            const info = await fetchGeoLocation();
            const device = detectDeviceType();
            const now = new Date();

            let history = [];
            try {
                const raw = localStorage.getItem(VISITS_HISTORY_KEY);
                if (raw) history = JSON.parse(raw);
            } catch (e) {}

            const sId = sessionState.sessionId;
            const existingIndex = history.findIndex(v => v.sessionId === sId);

            const visitItem = {
                visitId: 'vis_' + (info.visitorId || 'v') + '_' + now.getTime().toString(36),
                visitorId: info.visitorId,
                sessionId: sId,
                country: info.country,
                countryCode: info.countryCode,
                flag: info.flag,
                city: info.city,
                device: device.type,
                deviceIcon: device.icon,
                deviceLabel: device.label,
                isPwa: checkIsPwa(),
                currentStage: sessionState.currentStage,
                selectedPointTitle: sessionState.selectedPointTitle || '—',
                reachedReport: sessionState.reachedReport,
                journey: sessionState.journey,
                timestamp: now.toISOString(),
                page: window.location.pathname
            };

            if (existingIndex === -1) {
                history.push(visitItem);
                if (history.length > 500) history = history.slice(-500);
                try { 
                    localStorage.setItem(VISITS_HISTORY_KEY, JSON.stringify(history)); 
                    const curVisits = parseInt(localStorage.getItem('smart_cumulative_total_visits') || '0', 10);
                    localStorage.setItem('smart_cumulative_total_visits', String((curVisits || 480) + 1));
                } catch (e) {}

                // ترحيل الزيارة سحابياً
                if (window.SmartCloudSync && typeof window.SmartCloudSync.dispatchVisit === 'function') {
                    window.SmartCloudSync.dispatchVisit(visitItem);
                }
            }

            // إرسال نبضة الحضور الأولى
            sendPresenceHeartbeat(false);

            return info;
        } catch (e) {
            return null;
        }
    }

    // =========================================================================
    // ⏱️ دورة نبضات الحضور المنتظمة ورصد المغادرة (Life Cycle Listeners)
    // =========================================================================
    let presenceHeartbeatInterval = null;
    function startPresenceHeartbeatLoop() {
        if (window.location.pathname.includes('admin') || window.location.pathname.includes('calibrator')) {
            return;
        }

        // نبضة حضور فورية
        sendPresenceHeartbeat(false);

        // نبضة دورية كل 15 ثانية
        if (presenceHeartbeatInterval) clearInterval(presenceHeartbeatInterval);
        presenceHeartbeatInterval = setInterval(() => {
            sendPresenceHeartbeat(false);
        }, 15000);

        // الاستجابة لحالة ظهور الصفحة أو خفائها
        document.addEventListener('visibilitychange', () => {
            if (document.visibilityState === 'visible') {
                sendPresenceHeartbeat(false);
            }
        });

        // رصد إغلاق الصفحة أو التنقل
        window.addEventListener('beforeunload', () => {
            sendPresenceHeartbeat(true);
        });
        window.addEventListener('pagehide', () => {
            sendPresenceHeartbeat(true);
        });

        // رصد تثبيت تطبيق الـ PWA
        window.addEventListener('appinstalled', () => {
            try { localStorage.setItem('smart_pwa_installed', 'true'); } catch(e) {}
            trackStage('PWA_INSTALLED', 'قام بتثبيت تطبيق الويب (PWA) على جهازه');
        });
    }

    // تصدير واجهة المحرك الذكية للاستخدام الشامل
    window.SmartVisitorTracker = window.SmartGeoTracker = {
        getVisitorInfo: fetchGeoLocation,
        trackVisit: trackCurrentVisit,
        trackStage: trackStage,
        trackPainPoint: trackPainPointSelection,
        trackDiagnosisReached: function(point, diagnosis) {
            trackStage('DIAGNOSIS_REACHED', `استعراض التقرير الطبي (${point?.title || 'تشخيص سريري'})`, {
                pointTitle: point?.title,
                diagnosisName: diagnosis?.diagnosisTitle || diagnosis?.primaryDiagnosis
            });
        },
        trackPwaInstalled: function() {
            try { localStorage.setItem('smart_pwa_installed', 'true'); } catch(e) {}
            trackStage('PWA_INSTALLED', 'تثبيت تطبيق الويب على الجهاز');
        },
        sendPresencePing: () => sendPresenceHeartbeat(false),
        getDeviceType: detectDeviceType,
        isPwaInstalled: checkIsPwa,
        getCountryFlag: getCountryFlag,
        inferCountryFromPhone: inferCountryFromPhone,
        inferCountryFromTimezone: inferCountryFromTimezone,
        getCommonPainPoints: getTopCommonPainPoints
    };

    // التشغيل التلقائي
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', () => {
            trackCurrentVisit();
            startPresenceHeartbeatLoop();
        });
    } else {
        trackCurrentVisit();
        startPresenceHeartbeatLoop();
    }

})();
