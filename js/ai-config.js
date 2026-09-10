// ==========================================================================
// إعدادات وتكوين مفتاح الذكاء الاصطناعي (Gemini AI Configuration)
// «وداعاً للألم» للكايروبراكتيك
// ==========================================================================

const WADA3AN_AI_CONFIG = {
    STORAGE_KEY: 'wada3an_gemini_api_key',
    CANDIDATE_MODELS: [
        'gemini-2.5-flash',
        'gemini-2.5-flash-lite',
        'gemini-3.5-flash',
        'gemini-flash-latest'
    ],
    DEFAULT_MODEL: 'gemini-2.5-flash',
    BASE_URL: 'https://generativelanguage.googleapis.com/',

    // المفتاح المدمج الافتراضي لـ «وداعاً للألم»
    DEFAULT_API_KEY: (function() {
        try { return atob('QVEuQWI4Uk42SzVXelEtRFNsTUF1RXhvbldMbVk2TmlIbmJtSWFWdGIzQWlSSE1OekZfSXc='); } catch(e) { return ''; }
    })(),

    // حوض المفاتيح المجانية الموزعة (API Key Rotation Pool)
    // 11 مفتاحاً سحابياً معتمداً توفر أكثر من 16,500 استدعاء سريري مجاني يومياً وملايين الحروف للأبد
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
            if (!localStorage.getItem('wada3an_gemini_voice_name')) {
                localStorage.setItem('wada3an_gemini_voice_name', 'Aoede');
            }
            if (!localStorage.getItem('wada3an_voice_rotation_mode')) {
                localStorage.setItem('wada3an_voice_rotation_mode', 'random');
            }
        } catch (e) {}
    },

    // استرجاع المفتاح النشط مع التبديل الذكي وتخطي المفاتيح المستنفدة
    getApiKey: function() {
        try {
            const now = Date.now();
            const localKey = (localStorage.getItem(this.STORAGE_KEY) || '').trim();
            // إذا خصص المعالج مفتاحاً ثابتاً خاصاً في الإعدادات ولم تنفد حصته
            if (localKey && localKey.length >= 25 && !localKey.startsWith('...')) {
                const coolDown = this._exhaustedKeys.get(localKey);
                if (!coolDown || now > coolDown) {
                    return localKey;
                }
            }

            const pool = this.getPoolKeys();
            if (pool.length === 0) return this.DEFAULT_API_KEY || '';

            // فحص المفاتيح في الحوض بدءاً من المؤشر الحالي
            for (let i = 0; i < pool.length; i++) {
                const idx = (this._currentPoolIndex + i) % pool.length;
                const candidate = pool[idx];
                const coolDownUntil = this._exhaustedKeys.get(candidate);
                if (!coolDownUntil || now > coolDownUntil) {
                    this._currentPoolIndex = idx;
                    return candidate;
                }
            }

            // في حال كانت كل المفاتيح تحت التهدئة، اختيار المفتاح ذي أقرب وقت انتهاء
            let bestCandidate = pool[0];
            let earliestCooldown = Infinity;
            for (let i = 0; i < pool.length; i++) {
                const cd = this._exhaustedKeys.get(pool[i]) || 0;
                if (cd < earliestCooldown) {
                    earliestCooldown = cd;
                    bestCandidate = pool[i];
                    this._currentPoolIndex = i;
                }
            }
            return bestCandidate;
        } catch (e) {
            console.error('Error reading Gemini API key:', e);
            return this.DEFAULT_API_KEY || '';
        }
    },

    // تبديل تلقائي للمفتاح التالي في الحوض عند حدوث خطأ 429 (استنفاد الحصة)
    rotateKey: function(failedKey) {
        if (failedKey) {
            // فترة تهدئة ذكية دقيقة واحدة (60 ثانية) لتجدد حصة الطلبات في الدقيقة (RPM)
            this._exhaustedKeys.set(failedKey, Date.now() + 60000);
            console.warn(`🔄 [حوض المفاتيح]: تم تحويل المفتاح المستنفد لفترة راحة قصيرة والتبديل للمفتاح التالي.`);
        }
        const pool = this.getPoolKeys();
        if (pool.length > 0) {
            this._currentPoolIndex = (this._currentPoolIndex + 1) % pool.length;
            return pool[this._currentPoolIndex];
        }
        return this.getApiKey();
    },

    // إضافة مفتاح مجاني جديد لحوض التدوير
    addKeyToPool: function(newKey) {
        if (!newKey || newKey.length < 25) return false;
        try {
            const extraKeys = JSON.parse(localStorage.getItem('wada3an_gemini_api_keys_pool') || '[]');
            const cleanKey = newKey.trim();
            if (!extraKeys.includes(cleanKey) && !this.KEY_POOL.includes(cleanKey)) {
                extraKeys.push(cleanKey);
                localStorage.setItem('wada3an_gemini_api_keys_pool', JSON.stringify(extraKeys));
            }
            return true;
        } catch (e) {
            return false;
        }
    },

    // حفظ المفتاح في التخزين المحلي الآمن
    setApiKey: function(key) {
        try {
            if (!key || key.startsWith('...') || key.trim().length < 20) {
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
        return Boolean(key && key.length >= 25 && !key.startsWith('...'));
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
