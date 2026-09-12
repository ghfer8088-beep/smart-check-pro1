// ==========================================================================
// إعدادات وتكوين مفتاح الذكاء الاصطناعي (Gemini AI Configuration)
// «وداعاً للألم» للكايروبراكتيك
// ==========================================================================

const WADA3AN_AI_CONFIG = {
    STORAGE_KEY: 'wada3an_gemini_api_key',
    CANDIDATE_MODELS: [
        'gemini-1.5-flash',
        'gemini-2.0-flash',
        'gemini-1.5-pro'
    ],
    DEFAULT_MODEL: 'gemini-1.5-flash',

    BASE_URL: 'https://generativelanguage.googleapis.com/',

    // التحقق من صلاحية مفتاح Google Gemini الرسمي
    isValidApiKey: function(key) {
        if (!key || typeof key !== 'string') return false;
        const clean = key.trim();
        return clean.startsWith('AIzaSy') && clean.length >= 35;
    },

    // المفتاح المدمج الافتراضي
    DEFAULT_API_KEY: '',

    // حوض المفاتيح المضافة محلياً
    KEY_POOL: [],
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
            return { success: false, message: 'مفتاح غير صالح. يجب أن يبدأ المفتاح بـ AIzaSy ويتكون من 39 حرفاً من Google AI Studio.' };
        }

        try {
            const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${keyToTest}`;
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
