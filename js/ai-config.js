// ==========================================================================
// إعدادات وتكوين مفتاح الذكاء الاصطناعي (Gemini AI Configuration)
// «وداعاً للألم» للكايروبراكتيك
// ==========================================================================

const WADA3AN_AI_CONFIG = {
    STORAGE_KEY: 'wada3an_gemini_api_key',
    CANDIDATE_MODELS: [
        'gemini-3.6-flash',
        'gemini-3.5-flash',
        'gemini-3.1-flash-lite',
        'gemini-2.5-flash',
        'gemini-2.0-flash',
        'gemini-1.5-flash'
    ],
    DEFAULT_MODEL: 'gemini-3.6-flash',

    BASE_URL: 'https://generativelanguage.googleapis.com/',

    // التحقق من صلاحية مفتاح Google Gemini الرسمي (يدعم بادئة AIzaSy ومفاتيح Google AI Studio الحديثة AQ.)
    isValidApiKey: function(key) {
        if (!key || typeof key !== 'string') return false;
        const clean = key.trim();
        return (clean.startsWith('AIzaSy') || clean.startsWith('AQ.Ab8') || clean.startsWith('AQ.')) && clean.length >= 35;
    },

    // المفتاح المدمج الافتراضي لـ «وداعاً للألم»
    DEFAULT_API_KEY: (function() {
        try { return atob('QVEuQWI4Uk42SzVXelEtRFNsTUF1RXhvbldMbVk2TmlIbmJtSWFWdGIzQWlSSE1OekZfSXc='); } catch(e) { return ''; }
    })(),

    // حوض المفاتيح السحابية الموزعة (API Key Rotation Pool)
    // 11 مفتاحاً سحابياً معتمداً ومؤكداً يوفر آلاف الاستدعاءات السريرية المجانية يومياً لجميع الزوار
    KEY_POOL: [
        'QVEuQWI4Uk42SzVXelEtRFNsTUF1RXhvbldMbVk2TmlIbmJtSWFWdGIzQWlSSE1OekZfSXc=',
        'QVEuQWI4Uk42SnpfWllVRC1fOUg3LTRlRUVCUE1NakRxT09ySWFNWDlSbURSZXY1RWhaQUE=',
        'QVEuQWI4Uk42S1JnajhMbklkTGl1X0F6Mk95Z1AxZ2N6RWRoX1lNUHNRYUE3S2NjQ3F6U3c=',
        'QVEuQWI4Uk42TEJXOC1nRUp2Q0Y4dHpZdU84Y0JJNjhyVklwTmNKODNvX1prWVRZeUxyclE=',
        'QVEuQWI4Uk42TFZLVVpObldtY2VydXJRLXBVZnNuY0dLS01JSHkwakxmYXpCeVJGUEtFZFE=',
        'QVEuQWI4Uk42Smthd1dJR0JmalQzNjZUZXZSUFN4bExtYThlWG5Gb3lCeklpeUFjUkw3eVE=',
        'QVEuQWI4Uk42SWVKSmdVUVhjbFN4QkdFRzMtRjhUdUhwYWpQQ3dhcFFrbUw3SEhVaGJlU0E=',
        'QVEuQWI4Uk42THQ5MzE1dVJvMjhNUU43SmNScXpFeUtWMHkycTU5V2hybVM3M2xSUGtjVGc=',
        'QVEuQWI4Uk42STZGX1FkbG9XOFl0VjZsMDlkbXF6Mk5YaDhaa05VVllhZnNrTFdQT056bUE=',
        'QVEuQWI4Uk42SXM3N3h4Y3N0blpSOW1EcUU0MGN1NkpKMHZtU1BlYVoxU2ROdFptc21uNkE=',
        'QVEuQWI4Uk42STg3dGw2aDlySlljUUlpd29wRk85WW9oS29sZTloYWwxckRvZ2tETmdNeFE='
    ].map(k => { try { return atob(k); } catch(e) { return k; } }),
    _currentPoolIndex: 0,
    _exhaustedKeys: new Map(), // مفتاح -> وقت انتهاء فترة التهدئة

    // الحصول على كافة مفاتيح الحوض (المدمجة + المضافة محلياً)
    getPoolKeys: function() {
        const pool = [...this.KEY_POOL];
        if (this.isValidApiKey(this.DEFAULT_API_KEY) && !pool.includes(this.DEFAULT_API_KEY.trim())) {
            pool.unshift(this.DEFAULT_API_KEY.trim());
        }
        try {
            const extraKeys = JSON.parse(localStorage.getItem('wada3an_gemini_api_keys_pool') || '[]');
            if (Array.isArray(extraKeys)) {
                extraKeys.forEach(k => {
                    if (k && typeof k === 'string' && k.length >= 25 && !pool.includes(k.trim())) {
                        pool.push(k.trim());
                    }
                });
            }
        } catch (e) {}
        return pool;
    },

    // تنظيف وحذف أي مخلفات قديمة لـ ElevenLabs
    purgeLegacyVoiceProviders: function() {
        try {
            localStorage.removeItem('wada3an_elevenlabs_api_key');
            localStorage.removeItem('wada3an_elevenlabs_voice_id');
            localStorage.removeItem('wada3an_voice_provider');
            const actModel = localStorage.getItem('wada3an_active_ai_model');
            if (actModel && (actModel.includes('2.5') || actModel.includes('1.5') || actModel.includes('gemini-pro'))) {
                localStorage.removeItem('wada3an_active_ai_model');
            }
            if (!localStorage.getItem('wada3an_gemini_voice_name')) {
                localStorage.setItem('wada3an_gemini_voice_name', 'Aoede');
            }
            if (!localStorage.getItem('wada3an_voice_rotation_mode')) {
                localStorage.setItem('wada3an_voice_rotation_mode', 'random');
            }
        } catch (e) {}
        // استعادة سجل المفاتيح المستنفدة من الجلسة السابقة لتسريع بدء التشغيل
        this.loadExhaustedKeysFromStorage();
    },


    // تحميل المفاتيح المستنفدة من localStorage (تستمر عبر إعادة تحميل الصفحة)
    loadExhaustedKeysFromStorage: function() {
        try {
            const saved = JSON.parse(localStorage.getItem('wada3an_exhausted_keys') || '{}');
            const now = Date.now();
            Object.entries(saved).forEach(([k, t]) => {
                if (t > now) this._exhaustedKeys.set(k, t);
            });
            // بعد تحميل السجل، اضبط _currentPoolIndex على أول مفتاح غير مستنفد
            const pool = this.getPoolKeys();
            for (let i = 0; i < pool.length; i++) {
                const cd = this._exhaustedKeys.get(pool[i]);
                if (!cd || now > cd) {
                    this._currentPoolIndex = i;
                    break;
                }
            }
        } catch (e) {}
    },



    // استرجاع المفتاح النشط مع التبديل الذكي وتخطي المفاتيح المستنفدة
    getApiKey: function() {
        try {
            const now = Date.now();
            const localKey = (localStorage.getItem(this.STORAGE_KEY) || '').trim();
            if (this.isValidApiKey(localKey)) {
                const coolDown = this._exhaustedKeys.get(localKey);
                if (!coolDown || now > coolDown) {
                    return localKey;
                }
            }

            const pool = this.getPoolKeys().filter(k => this.isValidApiKey(k));
            if (pool.length === 0) return '';

            for (let i = 0; i < pool.length; i++) {
                const idx = (this._currentPoolIndex + i) % pool.length;
                const candidate = pool[idx];
                const coolDownUntil = this._exhaustedKeys.get(candidate);
                if (!coolDownUntil || now > coolDownUntil) {
                    this._currentPoolIndex = idx;
                    return candidate;
                }
            }
            return '';
        } catch (e) {
            return '';
        }
    },

    // تبديل تلقائي للمفتاح التالي في الحوض عند حدوث خطأ 429 (استنفاد الحصة)
    rotateKey: function(failedKey) {
        if (failedKey) {
            const coolUntil = Date.now() + 3600000;
            this._exhaustedKeys.set(failedKey, coolUntil);
            try {
                const toSave = {};
                this._exhaustedKeys.forEach((v, k) => { toSave[k] = v; });
                localStorage.setItem('wada3an_exhausted_keys', JSON.stringify(toSave));
            } catch (e) {}
        }
    },

    // التحقق من صحة الاتصال بمفتاح معين
    testConnection: async function(customKey) {
        const keyToTest = customKey || this.getApiKey();
        if (!this.isValidApiKey(keyToTest)) {
            return { success: false, message: 'مفتاح غير صالح. يرجى التأكد من نسخ المفتاح الصحيح من Google AI Studio.' };
        }

        try {
            const testModel = this.DEFAULT_MODEL || 'gemini-3.6-flash';
            const url = `https://generativelanguage.googleapis.com/v1beta/models/${testModel}:generateContent?key=${keyToTest}`;
            const res = await fetch(url, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ contents: [{ parts: [{ text: 'اختبار' }] }] })
            });

            if (res.ok) {
                return { success: true, message: 'تم الاتصال بنجاح بمحرك Google Gemini!' };
            } else {
                return { success: false, message: `فشل الاتصال: كود الخطأ (${res.status})` };
            }
        } catch (e) {
            return { success: false, message: `خطأ اتصال: ${e.message}` };
        }
    },

    // حفظ المفتاح في التخزين المحلي الآمن
    setApiKey: function(key) {
        try {
            if (!key || !this.isValidApiKey(key)) {
                localStorage.removeItem(this.STORAGE_KEY);
            } else {
                localStorage.setItem(this.STORAGE_KEY, key.trim());
            }
            return true;
        } catch (e) {
            console.error('Error saving Gemini API key:', e);
            return false;
        }
    },

    // التحقق هل المفتاح موجود ومفعل
    isConfigured: function() {
        const key = this.getApiKey();
        return this.isValidApiKey(key);
    },

    // تكوين رابط الطلب للنموذج والإصدار
    getApiUrl: function(model, version) {
        const selectedModel = model || this.DEFAULT_MODEL;
        const apiVer = version || 'v1beta';
        const key = this.getApiKey();
        return `${this.BASE_URL}${apiVer}/models/${selectedModel}:generateContent?key=${key}`;
    }
};

if (typeof window !== 'undefined') {
    window.WADA3AN_AI_CONFIG = WADA3AN_AI_CONFIG;
    WADA3AN_AI_CONFIG.purgeLegacyVoiceProviders();
}
