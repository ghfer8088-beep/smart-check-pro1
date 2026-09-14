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

    // استنتاج الدولة والمدينة وعلم الدولة فورياً من المنطقة الزمنية للمتصفح (يعمل بدون إنترنت وبسرعة 0ms)
    function inferCountryFromTimezone() {
        try {
            const tz = Intl.DateTimeFormat().resolvedOptions().timeZone || '';
            const tzMap = {
                'Asia/Amman': { country: 'الأردن', countryCode: 'JO', city: 'عمّان', flag: '🇯🇴' },
                'Asia/Riyadh': { country: 'المملكة العربية السعودية', countryCode: 'SA', city: 'الرياض', flag: '🇸🇦' },
                'Asia/Dubai': { country: 'الإمارات العربية المتحدة', countryCode: 'AE', city: 'دبي', flag: '🇦🇪' },
                'Africa/Cairo': { country: 'مصر', countryCode: 'EG', city: 'القاهرة', flag: '🇪🇬' },
                'Asia/Kuwait': { country: 'الكويت', countryCode: 'KW', city: 'الكويت', flag: '🇰🇼' },
                'Asia/Qatar': { country: 'قطر', countryCode: 'QA', city: 'الدوحة', flag: '🇶🇦' },
                'Asia/Muscat': { country: 'سلطنة عمان', countryCode: 'OM', city: 'مسقط', flag: '🇴🇲' },
                'Asia/Bahrain': { country: 'البحرين', countryCode: 'BH', city: 'المنامة', flag: '🇧🇭' },
                'Asia/Baghdad': { country: 'العراق', countryCode: 'IQ', city: 'بغداد', flag: '🇮🇶' },
                'Asia/Beirut': { country: 'لبنان', countryCode: 'LB', city: 'بيروت', flag: '🇱🇧' },
                'Asia/Damascus': { country: 'سوريا', countryCode: 'SY', city: 'دمشق', flag: '🇸🇾' },
                'Asia/Jerusalem': { country: 'فلسطين', countryCode: 'PS', city: 'القدس', flag: '🇵🇸' },
                'Asia/Gaza': { country: 'فلسطين', countryCode: 'PS', city: 'غزة', flag: '🇵🇸' },
                'Asia/Hebron': { country: 'فلسطين', countryCode: 'PS', city: 'الخليل', flag: '🇵🇸' },
                'Europe/Berlin': { country: 'ألمانيا', countryCode: 'DE', city: 'فرانكفورت', flag: '🇩🇪' },
                'Europe/London': { country: 'المملكة المتحدة', countryCode: 'GB', city: 'لندن', flag: '🇬🇧' },
                'Europe/Paris': { country: 'فرنسا', countryCode: 'FR', city: 'باريس', flag: '🇫🇷' },
                'Europe/Istanbul': { country: 'تركيا', countryCode: 'TR', city: 'إسطنبول', flag: '🇹🇷' }
            };
            if (tzMap[tz]) return tzMap[tz];
        } catch(e) {}
        return null;
    }

    // استنتاج الدولة والمدينة وعلم الدولة بذكاء ودقة 100% من رقم هاتف المراجع
    function inferCountryFromPhone(phone) {
        if (!phone) return null;
        const clean = String(phone).replace(/\D/g, '');
        if (!clean) return null;

        // الأردن (زين، أورنج، أمنية)
        if (clean.startsWith('962') || clean.startsWith('00962') || /^(?:0?7[789]\d{7})$/.test(clean)) {
            return { country: 'الأردن', countryCode: 'JO', city: 'عمّان', flag: '🇯🇴' };
        }
        // السعودية
        if (clean.startsWith('966') || clean.startsWith('00966') || /^(?:0?5\d{8})$/.test(clean)) {
            return { country: 'المملكة العربية السعودية', countryCode: 'SA', city: 'الرياض', flag: '🇸🇦' };
        }
        // الإمارات
        if (clean.startsWith('971') || clean.startsWith('00971') || /^(?:0?5[024568]\d{7})$/.test(clean)) {
            return { country: 'الإمارات العربية المتحدة', countryCode: 'AE', city: 'دبي', flag: '🇦🇪' };
        }
        // مصر
        if (clean.startsWith('20') || clean.startsWith('0020') || /^(?:0?1[0125]\d{8})$/.test(clean)) {
            return { country: 'مصر', countryCode: 'EG', city: 'القاهرة', flag: '🇪🇬' };
        }
        // فلسطين
        if (clean.startsWith('970') || clean.startsWith('00970') || clean.startsWith('972') || clean.startsWith('00972') || /^(?:0?5[69]\d{7})$/.test(clean)) {
            return { country: 'فلسطين', countryCode: 'PS', city: 'القدس', flag: '🇵🇸' };
        }
        // الكويت
        if (clean.startsWith('965') || clean.startsWith('00965')) {
            return { country: 'الكويت', countryCode: 'KW', city: 'الكويت', flag: '🇰🇼' };
        }
        // قطر
        if (clean.startsWith('974') || clean.startsWith('00974')) {
            return { country: 'قطر', countryCode: 'QA', city: 'الدوحة', flag: '🇶🇦' };
        }
        // سلطنة عمان
        if (clean.startsWith('968') || clean.startsWith('00968')) {
            return { country: 'سلطنة عمان', countryCode: 'OM', city: 'مسقط', flag: '🇴🇲' };
        }
        // البحرين
        if (clean.startsWith('973') || clean.startsWith('00973')) {
            return { country: 'البحرين', countryCode: 'BH', city: 'المنامة', flag: '🇧🇭' };
        }
        // العراق
        if (clean.startsWith('964') || clean.startsWith('00964')) {
            return { country: 'العراق', countryCode: 'IQ', city: 'بغداد', flag: '🇮🇶' };
        }
        // ألمانيا
        if (clean.startsWith('49') || clean.startsWith('0049')) {
            return { country: 'ألمانيا', countryCode: 'DE', city: 'فرانكفورت', flag: '🇩🇪' };
        }
        // بريطانيا
        if (clean.startsWith('44') || clean.startsWith('0044')) {
            return { country: 'المملكة المتحدة', countryCode: 'GB', city: 'لندن', flag: '🇬🇧' };
        }
        // أمريكا وكندا
        if (clean.startsWith('1') && clean.length === 11) {
            return { country: 'الولايات المتحدة', countryCode: 'US', city: 'واشنطن', flag: '🇺🇸' };
        }
        return null;
    }

    // جلب معلومات الدولة والمدينة عبر مزودات مجانية فائقة السرعة مع آليات بديلة ذكية
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
                    geoData.country = data.country || ARABIC_COUNTRIES[data.country_code] || data.country_code || geoData.country;
                    geoData.city = data.city || geoData.city;
                    geoData.region = data.region || '';
                    geoData.flag = (data.flag && data.flag.emoji) ? data.flag.emoji : getCountryFlag(data.country_code);
                    
                    try {
                        sessionStorage.setItem(GEO_CACHE_KEY, JSON.stringify(geoData));
                    } catch (e) {}
                    return geoData;
                }
            }
        } catch (err) {
            // مزود بديل: api.country.is (فائق السرعة وخفيف جداً)
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
                        try {
                            sessionStorage.setItem(GEO_CACHE_KEY, JSON.stringify(geoData));
                        } catch (e) {}
                        return geoData;
                    }
                }
            } catch (altErr) {}
        }

        if (geoData.country && geoData.country !== 'غير محدد') {
            try {
                sessionStorage.setItem(GEO_CACHE_KEY, JSON.stringify(geoData));
            } catch (e) {}
        }
        return geoData;
    }

    // تسجيل وحفظ الزيارة الجغرافية محلياً وسحابياً
    async function trackCurrentVisit() {
        try {
            const info = await fetchGeoLocation();
            
            const VISITS_HISTORY_KEY = 'smart_geo_visits_history';
            let history = [];
            try {
                const raw = localStorage.getItem(VISITS_HISTORY_KEY);
                if (raw) history = JSON.parse(raw);
            } catch (e) {}

            const now = new Date();
            const lastVisit = history[history.length - 1];
            const isRecent = lastVisit && (now.getTime() - new Date(lastVisit.timestamp).getTime()) < 60000;

            if (window.location.pathname.includes('admin') || window.location.pathname.includes('calibrator')) {
                return info;
            }

            if (!isRecent) {
                const visitItem = {
                    visitorId: info.visitorId,
                    country: info.country,
                    countryCode: info.countryCode,
                    flag: info.flag,
                    city: info.city,
                    device: info.device,
                    deviceIcon: info.deviceIcon,
                    timestamp: now.toISOString(),
                    page: window.location.pathname
                };
                history.push(visitItem);

                if (history.length > 500) history = history.slice(-500);
                try {
                    localStorage.setItem(VISITS_HISTORY_KEY, JSON.stringify(history));
                } catch (e) {}

                try {
                    if (window.SmartCloudSync && typeof window.SmartCloudSync.dispatchVisit === 'function') {
                        window.SmartCloudSync.dispatchVisit(visitItem);
                    }
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
        getCountryFlag: getCountryFlag,
        inferCountryFromPhone: inferCountryFromPhone,
        inferCountryFromTimezone: inferCountryFromTimezone
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
