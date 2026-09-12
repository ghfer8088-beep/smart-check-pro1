/**
 * =================================================================================
 * 🌍 SMART CHECK PRO - GEOLOCATION & VISITOR INTELLIGENCE TRACKER
 * محرك التتبع الجغرافي الذكي - كشف الدولة والمدينة ونوع الجهاز
 * =================================================================================
 */

(function () {
    'use strict';

    // مخزن محلي للبيانات الجغرافية لتجنب تكرار استهلاك الـ API في نفس الجلسة
    const GEO_CACHE_KEY = 'smart_geo_visitor_info';
    const VISITOR_ID_KEY = 'smart_unique_visitor_id';

    // توليد أو استرجاع معرّف فريد ومجهول للزائر
    function getOrCreateVisitorId() {
        let vid = localStorage.getItem(VISITOR_ID_KEY);
        if (!vid) {
            vid = 'vis_' + Date.now().toString(36) + '_' + Math.random().toString(36).substr(2, 6);
            localStorage.setItem(VISITOR_ID_KEY, vid);
        }
        return vid;
    }

    // كشف نوع الجهاز بدقة (موبايل، تابلت، كمبيوتر)
    function detectDeviceType() {
        const ua = navigator.userAgent || '';
        if (/(tablet|ipad|playbook|silk)|(android(?!.*mobi))/i.test(ua)) {
            return { type: 'Tablet', icon: '📟', label: 'جهاز لوحي (تابلت)' };
        }
        if (/Mobile|iP(hone|od)|Android|BlackBerry|IEMobile|Kindle|Silk-Accelerated|(hpw|web)OS|Opera M(obi|ini)/i.test(ua)) {
            return { type: 'Mobile', icon: '📱', label: 'هاتف محمول' };
        }
        return { type: 'Desktop', icon: '💻', label: 'كمبيوتر مكتبي' };
    }

    // تحويل كود الدولة إلى إيموجي علم الدولة (مثلاً SA -> 🇸🇦)
    function getCountryFlag(countryCode) {
        if (!countryCode || countryCode.length !== 2) return '🌐';
        const codePoints = countryCode
            .toUpperCase()
            .split('')
            .map(char => 127397 + char.charCodeAt(0));
        return String.fromCodePoint(...codePoints);
    }

    // تعريب أسماء الدول والمدن الشائعة
    const ARABIC_COUNTRIES = {
        'SA': 'المملكة العربية السعودية',
        'JO': 'الأردن',
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
        'SE': 'السويد'
    };

    // جلب معلومات الدولة والمدينة عبر مزودات مجانية فائقة السرعة مع آليات بديلة (Fallbacks)
    async function fetchGeoLocation() {
        // 1. التحقق من الكاش في الجلسة أولاً
        try {
            const cached = sessionStorage.getItem(GEO_CACHE_KEY);
            if (cached) {
                return JSON.parse(cached);
            }
        } catch (e) {}

        const visitorId = getOrCreateVisitorId();
        const device = detectDeviceType();

        let geoData = {
            visitorId: visitorId,
            ip: '',
            country: 'غير محدد',
            countryCode: '',
            flag: '🌐',
            city: 'غير محدد',
            region: '',
            device: device.type,
            deviceIcon: device.icon,
            deviceLabel: device.label,
            timestamp: new Date().toISOString()
        };

        // المزود الأول: ipwho.is (سريع، مجاني، يدعم اللغة العربية)
        try {
            const controller = new AbortController();
            const timeoutId = setTimeout(() => controller.abort(), 3500);

            const res = await fetch('https://ipwho.is/?lang=ar', { signal: controller.signal });
            clearTimeout(timeoutId);

            if (res.ok) {
                const data = await res.json();
                if (data && data.success !== false) {
                    geoData.ip = data.ip || '';
                    geoData.countryCode = data.country_code || '';
                    geoData.country = data.country || ARABIC_COUNTRIES[data.country_code] || data.country_code || 'غير محدد';
                    geoData.city = data.city || 'غير محدد';
                    geoData.region = data.region || '';
                    geoData.flag = (data.flag && data.flag.emoji) ? data.flag.emoji : getCountryFlag(data.country_code);
                    
                    try {
                        sessionStorage.setItem(GEO_CACHE_KEY, JSON.stringify(geoData));
                    } catch (e) {}
                    return geoData;
                }
            }
        } catch (err) {
            // مزود بديل: freeipapi.com
            try {
                const altController = new AbortController();
                const altTimeout = setTimeout(() => altController.abort(), 3000);
                const altRes = await fetch('https://freeipapi.com/api/json', { signal: altController.signal });
                clearTimeout(altTimeout);
                if (altRes.ok) {
                    const altData = await altRes.json();
                    if (altData && altData.countryCode) {
                        geoData.ip = altData.ipAddress || '';
                        geoData.countryCode = altData.countryCode || '';
                        geoData.country = ARABIC_COUNTRIES[altData.countryCode] || altData.countryName || 'غير محدد';
                        geoData.city = altData.cityName || 'غير محدد';
                        geoData.region = altData.regionName || '';
                        geoData.flag = getCountryFlag(altData.countryCode);
                        
                        try {
                            sessionStorage.setItem(GEO_CACHE_KEY, JSON.stringify(geoData));
                        } catch (e) {}
                        return geoData;
                    }
                }
            } catch (altErr) {}
        }

        return geoData;
    }

    // تسجيل وحفظ الزيارة الجغرافية محلياً وسحابياً
    async function trackCurrentVisit() {
        try {
            const info = await fetchGeoLocation();
            
            // حفظ سجل الزيارات في التخزين المحلي كقاعدة بيانات فورية
            const VISITS_HISTORY_KEY = 'smart_geo_visits_history';
            let history = [];
            try {
                const raw = localStorage.getItem(VISITS_HISTORY_KEY);
                if (raw) history = JSON.parse(raw);
            } catch (e) {}

            // إضافة الزيارة مع تفادي التكرار المفرط لنفس الجلسة
            const now = new Date();
            const lastVisit = history[history.length - 1];
            const isRecent = lastVisit && (now.getTime() - new Date(lastVisit.timestamp).getTime()) < 60000;

            if (!isRecent) {
                history.push({
                    visitorId: info.visitorId,
                    country: info.country,
                    countryCode: info.countryCode,
                    flag: info.flag,
                    city: info.city,
                    device: info.device,
                    deviceIcon: info.deviceIcon,
                    timestamp: now.toISOString(),
                    page: window.location.pathname
                });

                // الاحتفاظ بآخر 500 زيارة للحفاظ على الأداء والسرعة
                if (history.length > 500) history = history.slice(-500);
                try {
                    localStorage.setItem(VISITS_HISTORY_KEY, JSON.stringify(history));
                } catch (e) {}
            }

            return info;
        } catch (e) {
            return null;
        }
    }

    // تصدير واجهة المحرك الجغرافي للاستخدام الشامل
    window.SmartGeoTracker = {
        getVisitorInfo: fetchGeoLocation,
        trackVisit: trackCurrentVisit,
        getDeviceType: detectDeviceType,
        getCountryFlag: getCountryFlag
    };

    // التشغيل التلقائي عند تحميل الصفحة
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', () => {
            trackCurrentVisit();
        });
    } else {
        trackCurrentVisit();
    }

})();
