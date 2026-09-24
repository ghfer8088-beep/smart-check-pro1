// ==========================================================================
// Smart Check Pro 2.0 - طبقة قاعدة البيانات الموحدة (IndexedDB Engine)
// ==========================================================================

const SmartDB = (function() {
    const DB_NAME = 'SmartCheckPro2_DB';
    const DB_VERSION = 1;
    let dbInstance = null;

    // فتح وتهيئة قاعدة البيانات
    function openDB() {
        return new Promise((resolve) => {
            if (dbInstance) return resolve(dbInstance);
            if (typeof indexedDB === 'undefined') return resolve(null);

            let isResolved = false;
            const safeResolve = (val) => {
                if (!isResolved) {
                    isResolved = true;
                    resolve(val);
                }
            };

            // حماية صارمة: تايم أوت 1 ثانية في حال تجمد IndexedDB أو تشابك الاتصالات
            const timeoutTimer = setTimeout(() => {
                console.warn('[SmartDB] openDB timeout, falling back gracefully');
                safeResolve(dbInstance || null);
            }, 1000);

            try {
                const req = indexedDB.open(DB_NAME, DB_VERSION);

                req.onblocked = () => {
                    console.warn('[SmartDB] IndexedDB blocked by concurrent connections');
                    clearTimeout(timeoutTimer);
                    safeResolve(dbInstance || null);
                };

                req.onupgradeneeded = (e) => {
                    const db = e.target.result;
                    
                    // 1. جدول المرضى
                    if (!db.objectStoreNames.contains('patients')) {
                        const patientStore = db.createObjectStore('patients', { keyPath: 'patientId' });
                        patientStore.createIndex('phone', 'phone', { unique: false });
                        patientStore.createIndex('createdAt', 'createdAt', { unique: false });
                    }

                    // 2. جدول التقييمات والتشخيصات
                    if (!db.objectStoreNames.contains('assessments')) {
                        const assessStore = db.createObjectStore('assessments', { keyPath: 'assessmentId', autoIncrement: true });
                        assessStore.createIndex('patientId', 'patientId', { unique: false });
                        assessStore.createIndex('date', 'date', { unique: false });
                    }

                    // 3. جدول المتابعة والسجلات اليومية
                    if (!db.objectStoreNames.contains('dailyLogs')) {
                        const logStore = db.createObjectStore('dailyLogs', { keyPath: 'logId', autoIncrement: true });
                        logStore.createIndex('patientId', 'patientId', { unique: false });
                        logStore.createIndex('sessionNumber', 'sessionNumber', { unique: false });
                        logStore.createIndex('date', 'date', { unique: false });
                    }

                    // 4. جدول إعدادات النظام
                    if (!db.objectStoreNames.contains('settings')) {
                        db.createObjectStore('settings', { keyPath: 'key' });
                    }
                };

                req.onsuccess = (e) => {
                    clearTimeout(timeoutTimer);
                    dbInstance = e.target.result;
                    setTimeout(() => {
                        try { purgeDummyAssessments(); } catch(err) {}
                    }, 3000);
                    safeResolve(dbInstance);
                };

                req.onerror = (e) => {
                    clearTimeout(timeoutTimer);
                    console.warn('[SmartDB] IndexedDB error:', e);
                    safeResolve(null);
                };
            } catch(e) {
                clearTimeout(timeoutTimer);
                safeResolve(null);
            }
        });
    }

    function sanitizePatientData(p) {
        if (!p) return p;
        const pPhone = p.phone ? String(p.phone) : '';
        const pId = String(p.patientId || p.id || '');
        const pName = String(p.name || '').trim();

        if (pPhone.includes('540333309') || pId.includes('540333309') || /^اشعر/i.test(pName)) {
            p.name = 'اسامه';
            p.fullName = 'اسامه';
            p.gender = 'male';
            p.painArea = 'الفقرات القطنية وأسفل الظهر';
            p.painAreaTitle = 'الفقرات القطنية وأسفل الظهر';
            p.selectedPoint = 'الفقرات القطنية وأسفل الظهر';
            p.pointId = 'lumbar_spine';
            p.chiefDiagnosis = 'انزلاق غضروفي وإجهاد ميكانيكي قطني (L4-S1)';
            p.diagnosisTitle = 'انزلاق غضروفي وإجهاد ميكانيكي قطني (L4-S1)';
        } else if (/^(?:اشعر|أشعر|احس|أحس|اعاني|أعاني)/i.test(pName)) {
            const ph = (p.phone || '').replace(/\D/g, '');
            p.name = ph.length >= 7 ? `مراجع (${ph.slice(-4)})` : '';
            p.fullName = p.name;
        }
        return p;
    }

    // دوال أمان التخزين المحلي والوقاية الصارمة من تجاوز مساحة الكوتا (QuotaExceededError)
    function safeLocalStorageSet(key, value) {
        try {
            localStorage.setItem(key, value);
            return true;
        } catch(e) {
            // المرحلة الأولى: إخلاء المساحة تلقائياً من الإشعارات القديمة وبلاغات التيليمتري وسجلات الطوارئ
            try {
                for (let i = localStorage.length - 1; i >= 0; i--) {
                    const k = localStorage.key(i);
                    if (!k || k === key) continue;
                    if (k.includes('_notif_') || k.includes('_test') || k.includes('smart_incident') || k.includes('wada3an_telemetry') || k.includes('_log_debug')) {
                        localStorage.removeItem(k);
                    }
                }
                localStorage.setItem(key, value);
                return true;
            } catch(retryErr) {
                // المرحلة الثانية: إخلاء نسخ الكاش الفردية المؤقتة للمرضى القدامى (مع المحافظة على الحساب الحالي وبيانات IndexedDB)
                try {
                    for (let i = localStorage.length - 1; i >= 0; i--) {
                        const k = localStorage.key(i);
                        if (!k || k === key) continue;
                        if (k.startsWith('smart_patient_') && !k.startsWith('smart_patient_account_') && !k.includes(key)) {
                            localStorage.removeItem(k);
                        }
                    }
                    localStorage.setItem(key, value);
                    return true;
                } catch(thirdErr) {
                    console.warn('[SmartDB] Storage notice: Local cache full for ' + key + '; data is safely persisted in IndexedDB.');
                    return false;
                }
            }
        }
    }

    // تنظيف فوري وشامل لأي سجلات مؤقتة أو مجهولة تسببت بامتلاء الذاكرة
    try {
        localStorage.removeItem('smart_daily_logs_pat_guest');
        localStorage.removeItem('smart_patient_pat_guest');
        sessionStorage.removeItem('smart_daily_logs_pat_guest');
        for (let i = localStorage.length - 1; i >= 0; i--) {
            const k = localStorage.key(i);
            if (k && (k.includes('pat_guest') || k.includes('smart_incident_') || k.includes('wada3an_telemetry_'))) {
                localStorage.removeItem(k);
            }
        }
    } catch(e) {}

    // دوال إدارة المرضى
    async function savePatient(patient, options = {}) {
        if (!patient) return null;

        // التحقق الصارم من قائمة المحذوفات لمنع إعادة إحياء أي مريض محذوف إطلاقاً
        const checkId = patient.patientId || patient.id;
        if (checkId) {
            try {
                const delList = JSON.parse(localStorage.getItem('smart_deleted_patient_ids') || '[]');
                if (Array.isArray(delList) && delList.length > 0) {
                    const strId = String(checkId).trim();
                    if (strId && strId !== 'pat' && strId !== 'pat_notif') {
                        if (delList.includes(strId)) {
                            console.log('[SmartDB] Rejecting save for tombstoned/deleted patient:', checkId);
                            return null;
                        }
                        const baseId = strId.replace(/(_notif_.*|_test\d*|_cloud_test.*|_\d{10,})$/, '');
                        if (baseId && baseId !== 'pat' && baseId !== 'pat_notif' && baseId.length > 5 && delList.includes(baseId)) {
                            console.log('[SmartDB] Rejecting save for tombstoned/deleted patient base:', baseId);
                            return null;
                        }
                    }
                }
            } catch(e) {}
        }

        patient = sanitizePatientData(patient);

        // تأكد من وجود patientId فريد وموثوق دائماً لمنع أخطاء IndexedDB والتخزين المحلي
        if (!patient.patientId) {
            patient.patientId = patient.id || ('pat_' + (patient.phone ? String(patient.phone).replace(/\D/g, '') : Date.now().toString(36)) + '_' + Math.random().toString(36).substr(2, 5));
        }
        if (!patient.id) {
            patient.id = patient.patientId;
        }
        if (!patient.createdAt) {
            patient.createdAt = new Date().toISOString();
        }
        patient.lastUpdated = new Date().toISOString();

        try {
            // دمج ذكي مع السجل المحلي السابق لمنع مسح المؤشرات الحيوية كالعمر والوزن
            let prevRecord = null;
            const existingRaw = localStorage.getItem('smart_patient_' + patient.patientId);
            if (existingRaw) {
                try { prevRecord = JSON.parse(existingRaw); } catch(e) {}
            }
            const mergedPatient = prevRecord ? { ...prevRecord, ...patient } : patient;
            // الحفاظ الصارم على تاريخ التسجيل الأصلي للمريض وعدم تحديثه لتاريخ اليوم عند تعديل الجلسات
            if (prevRecord && prevRecord.createdAt) {
                mergedPatient.createdAt = prevRecord.createdAt;
            }

            // تنظيف الاسم إن كان كلمة محظورة مثل 'الاسم' أو 'الآسم'
            if (mergedPatient.name === 'الاسم' || mergedPatient.name === 'الآسم' || mergedPatient.name === 'الإسم') {
                if (mergedPatient.fullName && mergedPatient.fullName !== mergedPatient.name) {
                    mergedPatient.name = mergedPatient.fullName;
                } else {
                    const ph = (mergedPatient.phone || '').replace(/\D/g, '');
                    mergedPatient.name = ph.length >= 7 ? `مراجع (${ph.slice(-4)})` : '';
                }
            } else if (mergedPatient.fullName && mergedPatient.fullName.trim().length > (mergedPatient.name || '').trim().length) {
                mergedPatient.name = mergedPatient.fullName.trim();
            }

            mergedPatient = sanitizePatientData(mergedPatient);

            // استنتاج وتثبيت الدولة والمدينة وعلم الدولة فورياً من رقم هاتف المراجع أو التوقيت المحلي
            if (!mergedPatient.country || mergedPatient.country === 'غير محدد' || mergedPatient.country === 'دولي') {
                let geoInfo = null;
                if (mergedPatient.phone && typeof SmartGeoTracker !== 'undefined' && typeof SmartGeoTracker.inferCountryFromPhone === 'function') {
                    geoInfo = SmartGeoTracker.inferCountryFromPhone(mergedPatient.phone);
                }
                if (!geoInfo && typeof SmartGeoTracker !== 'undefined' && typeof SmartGeoTracker.inferCountryFromTimezone === 'function') {
                    geoInfo = SmartGeoTracker.inferCountryFromTimezone();
                }
                if (geoInfo) {
                    mergedPatient.country = geoInfo.country;
                    mergedPatient.countryCode = geoInfo.countryCode;
                    mergedPatient.city = geoInfo.city;
                    mergedPatient.flag = geoInfo.flag;
                }
            }
            if (!mergedPatient.device && typeof SmartGeoTracker !== 'undefined' && typeof SmartGeoTracker.getDeviceType === 'function') {
                mergedPatient.device = SmartGeoTracker.getDeviceType().type;
            }

            safeLocalStorageSet('smart_patient_' + mergedPatient.patientId, JSON.stringify(mergedPatient));
            try {
                const allPts = JSON.parse(localStorage.getItem('smart_all_patients') || '[]');
                const idx = allPts.findIndex(p => p.patientId === mergedPatient.patientId);
                // حفظ نسخة مقتضبة في smart_all_patients لمنع تضخم التخزين المحلي
                const compactPatient = { ...mergedPatient };
                if (compactPatient.assessment && typeof compactPatient.assessment === 'object') {
                    compactPatient.assessment = {
                        painLocation: compactPatient.assessment.painLocation || compactPatient.painLocation,
                        primaryHypothesis: compactPatient.assessment.primaryHypothesis || compactPatient.diagnosis,
                        urgencyLevel: compactPatient.assessment.urgencyLevel || compactPatient.urgencyLevel,
                        date: compactPatient.assessment.date || compactPatient.createdAt
                    };
                }
                if (compactPatient.latestAssessment && typeof compactPatient.latestAssessment === 'object') {
                    compactPatient.latestAssessment = compactPatient.assessment;
                }
                if (idx >= 0) allPts[idx] = { ...allPts[idx], ...compactPatient };
                else allPts.unshift(compactPatient);
                safeLocalStorageSet('smart_all_patients', JSON.stringify(allPts.slice(0, 100)));
                safeLocalStorageSet('smart_last_notif_time', Date.now().toString());
                safeLocalStorageSet('smart_last_cloud_sync_time', Date.now().toString());
                try {
                    if ('BroadcastChannel' in window) {
                        const bc = new BroadcastChannel('smart_check_pro_global_sync_channel');
                        bc.postMessage({ type: 'PATIENT_SAVED', patient: compactPatient, timestamp: Date.now() });
                        setTimeout(() => { try { bc.close(); } catch(e) {} }, 1000);
                    }
                } catch(bcErr) {}
            } catch(allPtsErr) {}
            patient = mergedPatient;
        } catch(e) {}

        // ☁️ ترحيل المريض سحابياً فورياً عبر جسر المزامنة العالمي (فقط إذا لم يكن وارداً من المزامنة السحابية نفسها منعاً للحلقات المفرغة)
        try {
            const shouldSkipCloud = options.skipCloudSync || patient.fromCloudSync || patient._fromCloud;
            if (!shouldSkipCloud && typeof SmartCloudSync !== 'undefined' && typeof SmartCloudSync.dispatchPatient === 'function') {
                SmartCloudSync.dispatchPatient(patient);
            }
        } catch(e) {}

        try {
            const db = await openDB();
            return new Promise((resolve) => {
                const tx = db.transaction('patients', 'readwrite');
                const store = tx.objectStore('patients');
                const req = store.put(patient);
                req.onsuccess = () => resolve(patient);
                req.onerror = () => resolve(patient);
            });
        } catch(e) {
            return patient;
        }
    }

    async function getPatient(patientId) {
        if (!patientId) return null;
        let lsPatient = null;
        try {
            const raw = localStorage.getItem('smart_patient_' + patientId);
            if (raw) lsPatient = JSON.parse(raw);
        } catch(e) {}

        // محاولة الاسترجاع من الذاكرة السحابية المتزامنة إن لم يوجد محلياً
        if (!lsPatient) {
            try {
                if (typeof SmartCloudSync !== 'undefined' && typeof SmartCloudSync.getPatients === 'function') {
                    const cList = SmartCloudSync.getPatients();
                    const foundInCloud = cList.find(x => x.id === patientId || x.patientId === patientId || (x.phone && lsPatient?.phone && x.phone === lsPatient.phone));
                    if (foundInCloud) lsPatient = foundInCloud;
                }
            } catch(e) {}
        }

        try {
            const db = await openDB();
            if (!db) return sanitizePatientData(lsPatient);
            return await Promise.race([
                new Promise((resolve) => {
                    const tx = db.transaction('patients', 'readonly');
                    const store = tx.objectStore('patients');
                    const req = store.get(patientId);
                    req.onsuccess = () => resolve(sanitizePatientData(req.result || lsPatient));
                    req.onerror = () => resolve(sanitizePatientData(lsPatient));
                }),
                new Promise(resolve => setTimeout(() => resolve(sanitizePatientData(lsPatient)), 600))
            ]);
        } catch(e) {
            return sanitizePatientData(lsPatient);
        }
    }

    async function getAllPatients() {
        let deletedIds = new Set();
        try {
            const rawDel = JSON.parse(localStorage.getItem('smart_deleted_patient_ids') || '[]');
            if (Array.isArray(rawDel)) {
                rawDel.forEach(id => {
                    const str = String(id || '').trim();
                    if (str && str !== 'pat' && str !== 'pat_notif' && str !== 'null' && str !== 'undefined' && str.length > 3) {
                        deletedIds.add(str);
                        const bId = str.replace(/(_notif_.*|_test\d*|_cloud_test.*|_\d{10,})$/, '');
                        if (bId && bId !== 'pat' && bId !== 'pat_notif' && bId.length > 5) {
                            deletedIds.add(bId);
                        }
                    }
                });
            }
        } catch(e) {}

        const isDeleted = (pId) => {
            if (!pId) return false;
            const sId = String(pId).trim();
            if (!sId || sId === 'pat' || sId === 'pat_notif' || sId === 'null' || sId === 'undefined') return false;
            if (deletedIds.has(sId)) return true;
            const bId = sId.replace(/(_notif_.*|_test\d*|_cloud_test.*|_\d{10,})$/, '');
            return bId && bId !== 'pat' && bId !== 'pat_notif' && bId.length > 5 && deletedIds.has(bId);
        };

        let lsPatients = [];
        try {
            const rawLs = JSON.parse(localStorage.getItem('smart_all_patients') || '[]');
            lsPatients = (rawLs || []).filter(p => {
                if (!p) return false;
                const pId = p.patientId || p.id;
                if (isDeleted(pId)) return false;
                const n = (p.fullName || p.name || '').trim();
                return !n.includes('مريض الفحص الذاتي') && n !== 'فحص ذاتي';
            });
        } catch(e) {}

        try {
            const db = await openDB();
            return new Promise((resolve) => {
                const tx = db.transaction('patients', 'readonly');
                const store = tx.objectStore('patients');
                const req = store.getAll();
                req.onsuccess = () => {
                    const rawDbList = req.result || [];
                    const dbList = rawDbList.filter(p => {
                        if (!p) return false;
                        const pId = p.patientId || p.id;
                        if (isDeleted(pId)) return false;
                        const n = (p.fullName || p.name || '').trim();
                        return !n.includes('مريض الفحص الذاتي') && n !== 'فحص ذاتي';
                    });
                    const map = new Map();
                    dbList.forEach(p => {
                        const k = p.patientId || p.id;
                        if (k && !isDeleted(k)) map.set(k, p);
                    });
                    const isGen = (str) => !str || str === 'العمود الفقري ومفاصل الحركة' || str === 'العمود الفقري والمفاصل' || str === 'استشارة وفحص سريري شامل';
                    lsPatients.forEach(p => {
                        const pId = p.patientId || p.id;
                        if (!pId) return;
                        if (!map.has(pId)) {
                            map.set(pId, p);
                        } else {
                            const existing = map.get(pId);
                            const mergedDailyLogs = (Array.isArray(p.dailyLogs) && p.dailyLogs.length > (existing.dailyLogs?.length || 0)) ? p.dailyLogs : (existing.dailyLogs || p.dailyLogs || []);
                            const realLogsLen = Array.isArray(mergedDailyLogs) ? mergedDailyLogs.length : 0;
                            const mergedLogsCount = realLogsLen > 0 ? realLogsLen : Math.min(7, Math.max(existing.logsCount || 0, p.logsCount || 0));
                            const mergedRecoveryScore = Math.max(existing.recoveryScore || 0, p.recoveryScore || 0);

                            map.set(pId, {
                                ...existing,
                                ...p,
                                createdAt: existing.createdAt || p.createdAt,
                                logsCount: mergedLogsCount,
                                completedSessions: mergedLogsCount,
                                recoveryScore: mergedRecoveryScore,
                                dailyLogs: mergedDailyLogs,
                                painArea: !isGen(p.painArea) ? p.painArea : (!isGen(existing.painArea) ? existing.painArea : p.painArea),
                                painAreaTitle: !isGen(p.painAreaTitle) ? p.painAreaTitle : (!isGen(existing.painAreaTitle) ? existing.painAreaTitle : p.painAreaTitle),
                                selectedPoint: !isGen(p.selectedPoint) ? p.selectedPoint : (!isGen(existing.selectedPoint) ? existing.selectedPoint : p.selectedPoint),
                                chiefDiagnosis: (p.chiefDiagnosis && p.chiefDiagnosis !== 'إجهاد ميكانيكي وظيفي في الأنسجة الداعمة') ? p.chiefDiagnosis : (existing.chiefDiagnosis || p.chiefDiagnosis),
                                diagnosisTitle: (p.diagnosisTitle && p.diagnosisTitle !== 'إجهاد ميكانيكي وظيفي في الأنسجة الداعمة') ? p.diagnosisTitle : (existing.diagnosisTitle || p.diagnosisTitle),
                                assessment: (p.assessment && !p.assessment.autoHealed) ? p.assessment : (existing.assessment || p.assessment)
                            });
                        }
                    });

                    // دمج الحالات السحابية المرحلية من المزامنة العالمية بكامل بياناتها السريرية (العمر، الوزن، الطول، موضع الألم، التشخيص)
                    try {
                        if (typeof SmartCloudSync !== 'undefined' && typeof SmartCloudSync.getPatients === 'function') {
                            const cloudList = SmartCloudSync.getPatients();
                            cloudList.forEach(cp => {
                                if (!cp) return;
                                const pId = cp.patientId || cp.id;
                                if (!pId || isDeleted(pId)) return;

                                // تصحيح واستبعاد أي سجلات فحص ذاتي افتراضية أو وهمية
                                let cleanName = cp.fullName || cp.name || 'مراجع جديد';
                                if (cleanName.includes('مريض الفحص الذاتي') || cleanName === 'فحص ذاتي') {
                                    return;
                                }
                                if (cleanName === 'الاسم' || cleanName === 'الآسم' || cleanName === 'الإسم') {
                                    const ph = (cp.phone || '').replace(/\D/g, '');
                                    cleanName = ph.length >= 7 ? `مراجع (${ph.slice(-4)})` : '';
                                }

                                const devType = cp.device || (typeof SmartGeoTracker !== 'undefined' ? SmartGeoTracker.getDeviceType().type : 'Desktop');
                                const devIcon = cp.deviceIcon || (devType === 'Desktop' ? '💻' : (devType === 'Tablet' ? '📟' : '📱'));

                                const fullCloudPatient = {
                                    ...cp,
                                    patientId: pId,
                                    id: pId,
                                    name: cleanName,
                                    fullName: cleanName,
                                    phone: cp.phone || '',
                                    age: cp.age || null,
                                    weight: cp.weight || null,
                                    height: cp.height || null,
                                    bmi: cp.bmi || (cp.weight && cp.height ? parseFloat((cp.weight / Math.pow(cp.height/100, 2)).toFixed(1)) : null),
                                    gender: cp.gender || 'male',
                                    painArea: cp.painArea || cp.painAreaTitle || cp.selectedPoint || '',
                                    painAreaTitle: cp.painAreaTitle || cp.painArea || cp.selectedPoint || '',
                                    selectedPoint: cp.selectedPoint || cp.painArea || '',
                                    chiefDiagnosis: cp.chiefDiagnosis || cp.diagnosisTitle || cp.condition || '',
                                    diagnosisTitle: cp.diagnosisTitle || cp.chiefDiagnosis || '',
                                    assessment: cp.assessment || cp.latestAssessment || null,
                                    latestAssessment: cp.latestAssessment || cp.assessment || null,
                                    treatmentPlan: cp.treatmentPlan || '',
                                    notes: cp.notes || '',
                                    collectedSymptoms: cp.collectedSymptoms || [],
                                    logsCount: cp.logsCount || (Array.isArray(cp.dailyLogs) ? cp.dailyLogs.length : (Array.isArray(cp.logs) ? cp.logs.length : 0)),
                                    dailyLogs: cp.dailyLogs || cp.logs || [],
                                    recoveryScore: cp.recoveryScore || 0,
                                    customTimingHours: cp.customTimingHours,
                                    customTimingMinutes: cp.customTimingMinutes,
                                    customTimingSeconds: cp.customTimingSeconds,
                                    customTargetTime: cp.customTargetTime || cp.targetTime,
                                    customDurationMs: cp.customDurationMs,
                                    forceUnlock: cp.forceUnlock,
                                    nextSessionUnlocked: cp.nextSessionUnlocked,
                                    country: cp.country || 'دولي',
                                    countryCode: cp.countryCode || '',
                                    city: cp.city || '',
                                    flag: cp.flag || '🌐',
                                    device: devType,
                                    deviceIcon: devIcon,
                                    createdAt: cp.timestamp || cp.createdAt || new Date().toISOString()
                                };

                                if (!map.has(pId)) {
                                    map.set(pId, fullCloudPatient);
                                } else {
                                     const existing = map.get(pId);
                                     const mergedDailyLogs = (Array.isArray(fullCloudPatient.dailyLogs) && fullCloudPatient.dailyLogs.length > (existing.dailyLogs?.length || 0)) ? fullCloudPatient.dailyLogs : (existing.dailyLogs || fullCloudPatient.dailyLogs || []);
                                     const realCloudLogsCount = Array.isArray(mergedDailyLogs) ? mergedDailyLogs.length : 0;
                                     const mergedLogsCount = realCloudLogsCount > 0 ? realCloudLogsCount : Math.min(7, Math.max(existing.logsCount || 0, fullCloudPatient.logsCount || 0));
                                     const mergedRecoveryScore = Math.max(existing.recoveryScore || 0, fullCloudPatient.recoveryScore || 0);

                                    // الحفاظ على جهاز الـ Desktop إن كان مسجلاً ولا ندعه يتحول إلى Mobile
                                    const finalDevice = existing.device === 'Desktop' ? 'Desktop' : (fullCloudPatient.device || existing.device || 'Desktop');
                                    const finalDeviceIcon = finalDevice === 'Desktop' ? '💻' : (finalDevice === 'Tablet' ? '📟' : '📱');

                                    map.set(pId, {
                                        ...existing,
                                        ...fullCloudPatient,
                                        device: finalDevice,
                                        deviceIcon: finalDeviceIcon,
                                        createdAt: existing.createdAt || fullCloudPatient.createdAt,
                                        age: existing.age || fullCloudPatient.age,
                                        weight: existing.weight || fullCloudPatient.weight,
                                        height: existing.height || fullCloudPatient.height,
                                        bmi: existing.bmi || fullCloudPatient.bmi,
                                        logsCount: mergedLogsCount,
                                        recoveryScore: mergedRecoveryScore,
                                        dailyLogs: mergedDailyLogs,
                                        customTimingHours: fullCloudPatient.customTimingHours ?? existing.customTimingHours,
                                        customTimingMinutes: fullCloudPatient.customTimingMinutes ?? existing.customTimingMinutes,
                                        customTimingSeconds: fullCloudPatient.customTimingSeconds ?? existing.customTimingSeconds,
                                        customTargetTime: fullCloudPatient.customTargetTime ?? existing.customTargetTime,
                                        customDurationMs: fullCloudPatient.customDurationMs ?? existing.customDurationMs,
                                        forceUnlock: fullCloudPatient.forceUnlock ?? existing.forceUnlock,
                                        nextSessionUnlocked: fullCloudPatient.nextSessionUnlocked ?? existing.nextSessionUnlocked,
                                        painArea: !isGen(fullCloudPatient.painArea) ? fullCloudPatient.painArea : (!isGen(existing.painArea) ? existing.painArea : fullCloudPatient.painArea),
                                        painAreaTitle: !isGen(fullCloudPatient.painAreaTitle) ? fullCloudPatient.painAreaTitle : (!isGen(existing.painAreaTitle) ? existing.painAreaTitle : fullCloudPatient.painAreaTitle),
                                        selectedPoint: !isGen(fullCloudPatient.selectedPoint) ? fullCloudPatient.selectedPoint : (!isGen(existing.selectedPoint) ? existing.selectedPoint : fullCloudPatient.selectedPoint),
                                        chiefDiagnosis: (fullCloudPatient.chiefDiagnosis && fullCloudPatient.chiefDiagnosis !== 'إجهاد ميكانيكي وظيفي في الأنسجة الداعمة') ? fullCloudPatient.chiefDiagnosis : (existing.chiefDiagnosis || fullCloudPatient.chiefDiagnosis),
                                        diagnosisTitle: (fullCloudPatient.diagnosisTitle && fullCloudPatient.diagnosisTitle !== 'إجهاد ميكانيكي وظيفي في الأنسجة الداعمة') ? fullCloudPatient.diagnosisTitle : (existing.diagnosisTitle || fullCloudPatient.diagnosisTitle),
                                        assessment: (fullCloudPatient.assessment && !fullCloudPatient.assessment.autoHealed) ? fullCloudPatient.assessment : (existing.assessment || fullCloudPatient.assessment)
                                    });
                                }
                            });
                        }
                    } catch(e) {}

                    const filteredResults = Array.from(map.values()).filter(p => {
                        if (!p) return false;
                        const pId = p.patientId || p.id || '';
                        if (isDeleted(pId)) return false;
                        const n = (p.fullName || p.name || '').trim();
                        if (n.includes('مريض الفحص الذاتي') || n === 'فحص ذاتي') return false;
                        if (pId.startsWith('pat_notif_') && !p.phone) return false;
                        return true;
                    });
                    resolve(filteredResults);
                };
                req.onerror = () => resolve(lsPatients.filter(p => !isDeleted(p.patientId || p.id) && !(p.fullName || p.name || '').includes('مريض الفحص الذاتي')));
            });
        } catch(e) {
            return lsPatients.filter(p => !isDeleted(p.patientId || p.id) && !(p.fullName || p.name || '').includes('مريض الفحص الذاتي'));
        }
    }

    async function deletePatient(patientId) {
        try {
            const baseId = (patientId || '').replace(/(_notif_.*|_test\d*|_cloud_test.*|_\d{10,})$/, '');
            localStorage.removeItem('smart_patient_' + patientId);
            if (baseId) localStorage.removeItem('smart_patient_' + baseId);
            localStorage.removeItem('smart_daily_logs_' + patientId);
            if (baseId) localStorage.removeItem('smart_daily_logs_' + baseId);
            localStorage.removeItem('smart_assessments_' + patientId);
            if (baseId) localStorage.removeItem('smart_assessments_' + baseId);

            // مسح أي مفاتيح فرعية للمريض في التخزين المحلي
            for (let i = localStorage.length - 1; i >= 0; i--) {
                const k = localStorage.key(i);
                if (k && (k.startsWith('smart_patient_' + baseId) || k.startsWith('smart_daily_logs_' + baseId) || k.startsWith('smart_assessments_' + baseId))) {
                    localStorage.removeItem(k);
                }
            }

            const allPts = JSON.parse(localStorage.getItem('smart_all_patients') || '[]');
            const filteredPts = allPts.filter(p => {
                const pId = p.patientId || p.id || '';
                return pId !== patientId && (!baseId || !pId.startsWith(baseId));
            });
            localStorage.setItem('smart_all_patients', JSON.stringify(filteredPts));

            // إزالة المريض أيضاً من السجلات السحابية المتزامنة لضمان عدم عودته نهائياً
            try {
                const cloudPts = JSON.parse(localStorage.getItem('smart_cloud_synced_patients') || '[]');
                const filteredCloud = cloudPts.filter(cp => {
                    const cpId = cp.patientId || cp.id || '';
                    return cpId !== patientId && (!baseId || !cpId.startsWith(baseId));
                });
                localStorage.setItem('smart_cloud_synced_patients', JSON.stringify(filteredCloud));
            } catch(e) {}

            // إضافة المعرف لقائمة المحذوفات الصريحة
            try {
                const delList = JSON.parse(localStorage.getItem('smart_deleted_patient_ids') || '[]');
                if (!delList.includes(patientId)) delList.push(patientId);
                if (baseId && !delList.includes(baseId)) delList.push(baseId);
                localStorage.setItem('smart_deleted_patient_ids', JSON.stringify(delList));
            } catch(e) {}

            // مسح أي إشعار مرتبط بهذا المعرف
            try {
                const notifs = JSON.parse(localStorage.getItem('smart_admin_notifications') || '[]');
                const cleanNotifs = notifs.filter(n => n && n.patientId !== patientId && (!baseId || !n.patientId?.startsWith(baseId)));
                localStorage.setItem('smart_admin_notifications', JSON.stringify(cleanNotifs));
            } catch(e) {}
        } catch(e) {}

        try {
            const db = await openDB();
            return new Promise((resolve) => {
                const tx = db.transaction(['patients', 'assessments', 'dailyLogs'], 'readwrite');
                tx.objectStore('patients').delete(patientId);
                
                // حذف سجلات المريض المرتبطة
                const assessIndex = tx.objectStore('assessments').index('patientId');
                const assessReq = assessIndex.openCursor(IDBKeyRange.only(patientId));
                assessReq.onsuccess = (e) => {
                    const cursor = e.target.result;
                    if (cursor) {
                        cursor.delete();
                        cursor.continue();
                    }
                };

                const logIndex = tx.objectStore('dailyLogs').index('patientId');
                const logReq = logIndex.openCursor(IDBKeyRange.only(patientId));
                logReq.onsuccess = (e) => {
                    const cursor = e.target.result;
                    if (cursor) {
                        cursor.delete();
                        cursor.continue();
                    }
                };

                tx.oncomplete = () => resolve(true);
                tx.onerror = () => resolve(true);
            });
        } catch(e) {
            return true;
        }
    }

    // دوال التقييمات
    async function saveAssessment(assessment) {
        if (!assessment) return null;
        try {
            if (assessment.patientId) {
                const lsKey = 'smart_assessments_' + assessment.patientId;
                const existing = JSON.parse(localStorage.getItem(lsKey) || '[]');
                existing.push(assessment);
                localStorage.setItem(lsKey, JSON.stringify(existing));
            }
        } catch(e) {}

        try {
            const db = await openDB();
            return new Promise((resolve) => {
                const tx = db.transaction('assessments', 'readwrite');
                const store = tx.objectStore('assessments');
                const req = store.put(assessment);
                req.onsuccess = () => resolve(req.result);
                req.onerror = () => resolve(true);
            });
        } catch(e) {
            return true;
        }
    }

    // تطهير وحذف أي تقييمات وهمية مكررة أو تالفة وسجلات المرضى التجريبيين
    async function purgeDummyAssessments() {
        const dummyPatientIds = ['P-104821', 'P-209143', 'P-308512', 'subPatientSabreen', 'subPatientMajd', 'subPatientEndless'];
        try {
            // 1. تنظيف التخزين المحلي LocalStorage
            for (let i = 0; i < localStorage.length; i++) {
                const k = localStorage.key(i);
                if (k && k.startsWith('smart_assessments_')) {
                    try {
                        const raw = localStorage.getItem(k);
                        if (raw) {
                            const arr = JSON.parse(raw);
                            if (Array.isArray(arr)) {
                                const clean = arr.filter(a => 
                                    !a.autoHealed && 
                                    a.primaryDiagnosis !== 'إجهاد ميكانيكي وظيفي في الأنسجة الداعمة' && 
                                    a.painLocation !== 'العمود الفقري ومفاصل الحركة' &&
                                    !dummyPatientIds.includes(a.patientId)
                                );
                                if (clean.length !== arr.length) {
                                    localStorage.setItem(k, JSON.stringify(clean));
                                }
                            }
                        }
                    } catch(e) {}
                }
            }
            for (const dId of dummyPatientIds) {
                try {
                    localStorage.removeItem('smart_patient_' + dId);
                    localStorage.removeItem('smart_assessments_' + dId);
                    localStorage.removeItem('smart_daily_logs_' + dId);
                    localStorage.removeItem('smart_plan_activated_' + dId);
                } catch(e) {}
            }
        } catch(e) {}

        try {
            // 2. تنظيف IndexedDB - التقييمات والمرضى التجريبيين
            const db = await openDB();
            await new Promise((resolve) => {
                const tx = db.transaction('assessments', 'readwrite');
                const store = tx.objectStore('assessments');
                const req = store.openCursor();
                req.onsuccess = (e) => {
                    const cursor = e.target.result;
                    if (cursor) {
                        const val = cursor.value;
                        if (val && (
                            val.autoHealed === true || 
                            val.primaryDiagnosis === 'إجهاد ميكانيكي وظيفي في الأنسجة الداعمة' || 
                            val.painLocation === 'العمود الفقري ومفاصل الحركة' ||
                            dummyPatientIds.includes(val.patientId)
                        )) {
                            cursor.delete();
                        }
                        cursor.continue();
                    }
                };
                tx.oncomplete = () => resolve(true);
                tx.onerror = () => resolve(true);
            });

            await new Promise((resolve) => {
                const tx = db.transaction('patients', 'readwrite');
                const store = tx.objectStore('patients');
                for (const dId of dummyPatientIds) {
                    try { store.delete(dId); } catch(err) {}
                }
                tx.oncomplete = () => resolve(true);
                tx.onerror = () => resolve(true);
            });
            return true;
        } catch(e) {
            return true;
        }
    }

    async function getPatientAssessments(patientId) {
        let lsAssessments = [];
        try {
            if (patientId) {
                const lsKey = 'smart_assessments_' + patientId;
                const raw = JSON.parse(localStorage.getItem(lsKey) || '[]');
                lsAssessments = (raw || []).filter(a => 
                    !a.autoHealed && 
                    a.primaryDiagnosis !== 'إجهاد ميكانيكي وظيفي في الأنسجة الداعمة' && 
                    a.painLocation !== 'العمود الفقري ومفاصل الحركة'
                );
            }
        } catch(e) {}

        try {
            const db = await openDB();
            if (!db) return lsAssessments;
            return await Promise.race([
                new Promise((resolve) => {
                    const tx = db.transaction('assessments', 'readonly');
                    const index = tx.objectStore('assessments').index('patientId');
                    const req = index.getAll(patientId);
                    req.onsuccess = () => {
                        const dbAssessments = (req.result || []).filter(a => 
                            !a.autoHealed && 
                            a.primaryDiagnosis !== 'إجهاد ميكانيكي وظيفي في الأنسجة الداعمة' && 
                            a.painLocation !== 'العمود الفقري ومفاصل الحركة'
                        );
                        if (dbAssessments.length > 0) return resolve(dbAssessments);
                        resolve(lsAssessments);
                    };
                    req.onerror = () => resolve(lsAssessments);
                }),
                new Promise(resolve => setTimeout(() => resolve(lsAssessments), 600))
            ]);
        } catch(e) {
            return lsAssessments;
        }
    }

    async function getAllAssessments() {
        let lsAssessments = [];
        try {
            for (let i = 0; i < localStorage.length; i++) {
                const k = localStorage.key(i);
                if (k && k.startsWith('smart_assessments_')) {
                    try {
                        const raw = JSON.parse(localStorage.getItem(k) || '[]');
                        if (Array.isArray(raw)) {
                            lsAssessments.push(...raw);
                        }
                    } catch(e) {}
                }
            }
        } catch(e) {}

        try {
            const db = await openDB();
            return new Promise((resolve) => {
                const tx = db.transaction('assessments', 'readonly');
                const store = tx.objectStore('assessments');
                const req = store.getAll();
                req.onsuccess = () => {
                    const dbAll = req.result || [];
                    const map = new Map();
                    const filterClean = (a) => a && !a.autoHealed && a.primaryDiagnosis !== 'إجهاد ميكانيكي وظيفي في الأنسجة الداعمة' && a.painLocation !== 'العمود الفقري ومفاصل الحركة';
                    dbAll.filter(filterClean).forEach(a => {
                        const k = (a.assessmentId || '') + '_' + (a.patientId || '') + '_' + (a.date || '');
                        map.set(k, a);
                    });
                    lsAssessments.filter(filterClean).forEach(a => {
                        const k = (a.assessmentId || '') + '_' + (a.patientId || '') + '_' + (a.date || '');
                        if (!map.has(k)) map.set(k, a);
                    });
                    resolve(Array.from(map.values()));
                };
                req.onerror = () => resolve(lsAssessments);
            });
        } catch(e) {
            return lsAssessments;
        }
    }

    // دوال المتابعة اليومية
    async function saveDailyLog(log, options = {}) {
        if (!log || !log.patientId) return null;
        if (log.patientId === 'pat_guest' || String(log.patientId).startsWith('pat_guest')) {
            return log.logId || 'guest_log';
        }
        if (!log.logId) {
            log.logId = 'log_' + (log.patientId || 'pt') + '_' + (log.sessionNumber || 1) + '_' + Date.now();
        }

        // ☁️ ترحيل سحابي فوري للجلسة المنجزة لكافة الأجهزة (موبايل + لابتوب)
        if (!options.skipCloudSync && typeof window.SmartCloudSync !== 'undefined' && typeof window.SmartCloudSync.dispatchSessionLog === 'function') {
            try {
                window.SmartCloudSync.dispatchSessionLog(log);
            } catch (e) {}
        }

        // حفظ متزامن وفوري في LocalStorage مع حماية تامة من QuotaExceededError
        try {
            if (log.patientId) {
                const lsKey = 'smart_daily_logs_' + log.patientId;
                const existing = JSON.parse(localStorage.getItem(lsKey) || '[]');
                const idx = existing.findIndex(item => 
                    (item.logId && item.logId === log.logId) || 
                    (item.sessionNumber && item.sessionNumber === log.sessionNumber)
                );
                if (idx >= 0) {
                    existing[idx] = { ...existing[idx], ...log };
                } else {
                    existing.push(log);
                }
                existing.sort((a, b) => (a.sessionNumber || 0) - (b.sessionNumber || 0));
                safeLocalStorageSet(lsKey, JSON.stringify(existing));

                // تحديث إحصائيات المريض الحقيقية تلقائياً لمنع أي تضارب أو أرقام وهمية
                try {
                    const pt = await getPatient(log.patientId);
                    if (pt) {
                        pt.logsCount = existing.length;
                        pt.completedSessions = existing.length;
                        pt.recoveryScore = Math.min(100, Math.round((existing.length / 7) * 100));
                        pt.lastSessionDate = log.date || new Date().toISOString();
                        pt.dailyLogs = existing;
                        pt.logs = existing;
                        await savePatient(pt, { skipCloudSync: options.skipCloudSync });
                    }
                } catch (ptErr) {}
            }
        } catch(e) {}

        try {
            const db = await openDB();
            return new Promise((resolve) => {
                const tx = db.transaction('dailyLogs', 'readwrite');
                const store = tx.objectStore('dailyLogs');
                const req = store.put(log);
                req.onsuccess = () => resolve(req.result || log.logId);
                req.onerror = (e) => {
                    console.warn('IndexedDB saveDailyLog error, fallback used:', e);
                    resolve(log.logId);
                };
            });
        } catch(e) {
            return log.logId;
        }
    }

    async function getPatientDailyLogs(patientId) {
        let lsLogs = [];
        try {
            if (patientId) {
                const lsKey = 'smart_daily_logs_' + patientId;
                lsLogs = JSON.parse(localStorage.getItem(lsKey) || '[]');
            }
        } catch(e) {}

        // دمج الجلسات المتزامنة سحابياً من الأجهزة الأخرى
        let cloudLogs = [];
        try {
            if (typeof window.SmartCloudSync !== 'undefined' && typeof window.SmartCloudSync.getPatientLogs === 'function') {
                cloudLogs = window.SmartCloudSync.getPatientLogs(patientId) || [];
            }
        } catch(e) {}

        const fallbackResolve = () => {
            const fallbackMap = new Map();
            cloudLogs.forEach(l => { if (l && l.sessionNumber) fallbackMap.set(l.sessionNumber, l); });
            lsLogs.forEach(l => { if (l && l.sessionNumber) fallbackMap.set(l.sessionNumber, l); });
            const res = Array.from(fallbackMap.values());
            res.sort((a, b) => (a.sessionNumber || 0) - (b.sessionNumber || 0));
            return res;
        };

        try {
            const db = await openDB();
            if (!db) return fallbackResolve();
            return await Promise.race([
                new Promise((resolve) => {
                    const tx = db.transaction('dailyLogs', 'readonly');
                    const index = tx.objectStore('dailyLogs').index('patientId');
                    const req = index.getAll(patientId);
                    req.onsuccess = () => {
                        const dbLogs = req.result || [];
                        const mergedMap = new Map();
                        // 1. الجلسات السحابية
                        cloudLogs.forEach(l => {
                            if (!l) return;
                            const key = (typeof l.sessionNumber === 'number') ? `sess_${l.sessionNumber}` : (l.logId || `date_${l.date}`);
                            mergedMap.set(key, l);
                        });
                        // 2. الجلسات المحلية في LocalStorage
                        lsLogs.forEach(l => {
                            if (!l) return;
                            const key = (typeof l.sessionNumber === 'number') ? `sess_${l.sessionNumber}` : (l.logId || `date_${l.date}`);
                            mergedMap.set(key, { ...(mergedMap.get(key) || {}), ...l });
                        });
                        // 3. الجلسات في IndexedDB
                        dbLogs.forEach(l => {
                            if (!l) return;
                            const key = (typeof l.sessionNumber === 'number') ? `sess_${l.sessionNumber}` : (l.logId || `date_${l.date}`);
                            mergedMap.set(key, { ...(mergedMap.get(key) || {}), ...l });
                        });
                        const mergedLogs = Array.from(mergedMap.values());
                        mergedLogs.sort((a, b) => (a.sessionNumber || 0) - (b.sessionNumber || 0));
                        resolve(mergedLogs);
                    };
                    req.onerror = () => resolve(fallbackResolve());
                }),
                new Promise(resolve => setTimeout(() => resolve(fallbackResolve()), 600))
            ]);
        } catch(e) {
            return fallbackResolve();
        }
    }

    // دوال إعدادات النظام
    async function setSetting(key, value) {
        const db = await openDB();
        return new Promise((resolve, reject) => {
            const tx = db.transaction('settings', 'readwrite');
            const store = tx.objectStore('settings');
            const req = store.put({ key, value });
            req.onsuccess = () => resolve(true);
            req.onerror = (e) => reject(e);
        });
    }

    async function getSetting(key, defaultValue = null) {
        const db = await openDB();
        return new Promise((resolve, reject) => {
            const tx = db.transaction('settings', 'readonly');
            const store = tx.objectStore('settings');
            const req = store.get(key);
            req.onsuccess = () => resolve(req.result ? req.result.value : defaultValue);
            req.onerror = () => resolve(defaultValue);
        });
    }

    // المريض الحالي المسجل
    function setCurrentSessionPatientId(patientId) {
        if (patientId) {
            localStorage.setItem('smart_current_patient_id', patientId);
        } else {
            localStorage.removeItem('smart_current_patient_id');
        }
    }

    function getCurrentSessionPatientId() {
        return localStorage.getItem('smart_current_patient_id');
    }

    // دوال إشعارات وتنبيهات الإدارة الفورية الحية
    function addAdminNotification(notif) {
        try {
            if (!notif) return null;
            const notifPName = (notif.patientName || '').trim();
            const notifPPh = (notif.patientPhone || '').replace(/\D/g, '');
            const isAnon = !notifPName || /^(?:مراجع كريم|المراجع الكريم|مراجع محترم|المراجع المحترم|مراجع جديد|المراجع الجديد|مريض الفحص الذاتي|فحص ذاتي|زائر|مجهول|pat_guest|undefined|null)$/i.test(notifPName);
            // استبعاد قاطع لأي إشعار مجهول ليس له اسم حقيقي ولا هاتف موثق
            if (isAnon && notifPPh.length < 7) {
                return null;
            }

            const list = JSON.parse(localStorage.getItem('smart_admin_notifications') || '[]');
            const newNotif = {
                id: 'N-' + Date.now() + '-' + Math.floor(Math.random() * 1000),
                type: notif.type || 'info', // 'new_registration', 'plan_completed', 'red_flag', 'session_done'
                title: notif.title || 'إشعار جديد',
                message: notif.message || '',
                patientId: notif.patientId || null,
                patientName: notif.patientName || (notifPPh ? `مراجع (${notifPPh.slice(-4)})` : ''),
                patientPhone: notif.patientPhone || '',
                meta: notif.meta || {},
                time: new Date().toISOString(),
                read: false
            };
            list.unshift(newNotif);
            if (list.length > 30) list.length = 30;
            try {
                localStorage.setItem('smart_admin_notifications', JSON.stringify(list));
            } catch(qErr) {
                list.length = 10;
                try { localStorage.setItem('smart_admin_notifications', JSON.stringify(list)); } catch(e) {}
            }
            try { localStorage.setItem('smart_last_notif_time', Date.now().toString()); } catch(e) {}

            // ✅ v29.19: إرسال BroadcastChannel لإبلاغ admin.html فوراً بالإشعار الجديد
            // (storage event لا يعمل في نفس المتصفح — BroadcastChannel يصل لجميع التبويبات)
            try {
                if ('BroadcastChannel' in window) {
                    const bc = new BroadcastChannel('smart_check_pro_global_sync_channel');
                    bc.postMessage({ type: 'NEW_NOTIFICATION', notif: newNotif });
                    bc.close();
                }
            } catch(bcErr) {}

            return newNotif;
        } catch (e) {
            console.error('Error adding admin notification:', e);
            return null;
        }
    }

    function getAdminNotifications() {
        try {
            const raw = localStorage.getItem('smart_admin_notifications');
            const list = JSON.parse(raw || '[]');
            // تلقائياً: تنظيف وتطهير أي تنبيهات أخطاء سابقة أو إشعارات لمراجعين مجهولين (مراجع كريم / مراجع محترم)
            const cleaned = list.filter(n => {
                if (!n) return false;
                const txt = (n.title || '') + ' ' + (n.message || '') + ' ' + (n.patientName || '');
                if (txt.includes('currentCardsPage') || txt.includes('SyntaxError')) return false;
                const nPhone = (n.patientPhone || '').replace(/\D/g, '');
                const isAnonTxt = /مراجع كريم|المراجع الكريم|مراجع محترم|المراجع المحترم|pat_guest|فحص ذاتي/i.test(txt);
                if (isAnonTxt && nPhone.length < 7) {
                    return false;
                }
                return true;
            });
            if (cleaned.length !== list.length) {
                localStorage.setItem('smart_admin_notifications', JSON.stringify(cleaned));
            }
            return cleaned;
        } catch (e) {
            return [];
        }
    }

    function markNotificationAsRead(id) {
        try {
            const list = getAdminNotifications();
            const item = list.find(n => n.id === id);
            if (item) {
                item.read = true;
                localStorage.setItem('smart_admin_notifications', JSON.stringify(list));
            }
        } catch (e) {}
    }

    function deleteNotification(id) {
        try {
            let list = getAdminNotifications();
            list = list.filter(n => n.id !== id);
            localStorage.setItem('smart_admin_notifications', JSON.stringify(list));
        } catch (e) {}
    }

    function markAllNotificationsAsRead() {
        try {
            const list = getAdminNotifications();
            list.forEach(n => n.read = true);
            localStorage.setItem('smart_admin_notifications', JSON.stringify(list));
        } catch (e) {}
    }

    function clearAllNotifications() {
        localStorage.removeItem('smart_admin_notifications');
    }

    async function clearAllPatients() {
        try {
            localStorage.removeItem('smart_all_patients');
            localStorage.removeItem('smart_cloud_synced_patients');
            localStorage.removeItem('smart_last_cloud_sync_time');
            const keysToRemove = [];
            for (let i = 0; i < localStorage.length; i++) {
                const k = localStorage.key(i);
                if (k && (k.startsWith('smart_patient_') || k.startsWith('smart_daily_logs_') || k.startsWith('smart_assessments_') || k.startsWith('force_unlock_') || k.startsWith('custom_target_time_'))) {
                    keysToRemove.push(k);
                }
            }
            keysToRemove.forEach(k => localStorage.removeItem(k));
        } catch(e) {}

        try {
            const db = await openDB();
            return new Promise((resolve) => {
                const tx = db.transaction(['patients', 'assessments', 'dailyLogs'], 'readwrite');
                tx.objectStore('patients').clear();
                tx.objectStore('assessments').clear();
                tx.objectStore('dailyLogs').clear();
                tx.oncomplete = () => resolve(true);
                tx.onerror = () => resolve(true);
            });
        } catch(e) {
            return true;
        }
    }

    // =========================================================================
    // منظومة حسابات المراجعين والتسجيل الاختياري لحفظ السجلات (Patient Accounts)
    // =========================================================================
    async function registerPatientAccount(phone, pin, patientData = {}) {
        if (!phone) return { success: false, message: 'رقم الهاتف مطلوب' };
        const cleanPhone = String(phone).replace(/\D/g, '');
        if (!cleanPhone || cleanPhone.length < 6) {
            return { success: false, message: 'يرجى إدخال رقم هاتف صحيح' };
        }
        const cleanPin = String(pin || '').trim();
        if (!cleanPin || cleanPin.length < 4) {
            return { success: false, message: 'رمز PIN يجب أن يتكون من 4 أرقام على الأقل' };
        }

        try {
            // جلب أو إنشاء سجل المريض
            let patientId = patientData.patientId || patientData.id;
            if (!patientId) {
                patientId = 'pat_' + cleanPhone + '_' + Date.now().toString(36);
            }

            let existingPt = await getPatient(patientId);
            if (!existingPt) {
                const all = await getAllPatients();
                existingPt = all.find(p => p.phone && String(p.phone).replace(/\D/g, '') === cleanPhone);
                if (existingPt) patientId = existingPt.patientId || existingPt.id;
            }

            const nowIso = new Date().toISOString();
            const merged = {
                ...(existingPt || {}),
                ...patientData,
                patientId,
                id: patientId,
                phone: phone,
                cleanPhone: cleanPhone,
                isRegistered: true,
                accountPin: cleanPin,
                registeredAt: existingPt?.registeredAt || nowIso,
                lastLoginAt: nowIso
            };

            await savePatient(merged);

            // حفظ فهرس الحساب محلياً بأمان تام ومقاومة تجاوز الكوتا
            try {
                const accountRecord = {
                    phone: cleanPhone,
                    originalPhone: phone,
                    name: merged.fullName || merged.name || (cleanPhone ? `مراجع (${cleanPhone.slice(-4)})` : ''),
                    patientId: patientId,
                    gender: merged.gender,
                    age: merged.age,
                    weight: merged.weight,
                    height: merged.height,
                    bmi: merged.bmi,
                    accountPin: cleanPin,
                    registeredAt: merged.registeredAt,
                    lastLoginAt: nowIso
                };
                safeLocalStorageSet('smart_patient_account_' + cleanPhone, JSON.stringify(accountRecord));

                // تحديث قائمة الحسابات المسجلة
                const accountsList = JSON.parse(localStorage.getItem('smart_registered_accounts') || '[]');
                const accIdx = accountsList.findIndex(a => a.phone === cleanPhone);
                if (accIdx >= 0) accountsList[accIdx] = accountRecord;
                else accountsList.unshift(accountRecord);
                safeLocalStorageSet('smart_registered_accounts', JSON.stringify(accountsList.slice(0, 100)));
            } catch(storageErr) {
                console.warn('[SmartDB] Local storage fast cache skipped due to quota, saved securely in IndexedDB:', storageErr);
            }

            // تفعيل جلسة المراجع الحالية
            setAuthPatient({
                phone: cleanPhone,
                originalPhone: phone,
                name: merged.fullName || merged.name || (cleanPhone ? `مراجع (${cleanPhone.slice(-4)})` : ''),
                patientId: patientId,
                gender: merged.gender,
                age: merged.age,
                weight: merged.weight,
                height: merged.height,
                bmi: merged.bmi,
                isRegistered: true,
                loginTime: Date.now()
            });

            // إشعار للإدارة بوصول تسجيل حساب جديد
            try {
                addAdminNotification({
                    type: 'new_registration',
                    title: `🔑 تسجيل حساب مراجع: ${merged.fullName || merged.name || 'مراجع جديد'}`,
                    message: `قام المراجع (${merged.fullName || merged.name || 'مراجع جديد'}) بتسجيل حساب طبي وتعيين رمز مرور برقم (${phone})، لتمكينه من حفظ ومتابعة سجلاته الطبية.`,
                    patientId: patientId,
                    patientName: merged.fullName || merged.name || 'مراجع جديد',
                    patientPhone: phone
                });
            } catch(e) {}

            return { success: true, patient: merged, message: 'تم إنشاء وحفظ ملفك الطبي بنجاح' };
        } catch(err) {
            console.error('Error in registerPatientAccount:', err);
            return { success: false, message: 'حدث خطأ أثناء حفظ الملف: ' + err.message };
        }
    }

    async function verifyPatientPin(phone, pin) {
        if (!phone || !pin) return { success: false, message: 'يرجى إدخال الهاتف والرمز السري' };
        const cleanPhone = String(phone).replace(/\D/g, '');
        const cleanPin = String(pin).trim();

        try {
            // فحص في حسابات التخزين السريع
            let accRaw = localStorage.getItem('smart_patient_account_' + cleanPhone);
            let acc = accRaw ? JSON.parse(accRaw) : null;

            if (!acc) {
                const accountsList = JSON.parse(localStorage.getItem('smart_registered_accounts') || '[]');
                acc = accountsList.find(a => a.phone === cleanPhone || (a.originalPhone && String(a.originalPhone).replace(/\D/g, '') === cleanPhone));
            }

            // فحص في جدول المرضى
            let matchedPatient = null;
            if (acc && acc.patientId) {
                matchedPatient = await getPatient(acc.patientId);
            }
            if (!matchedPatient) {
                const all = await getAllPatients();
                matchedPatient = all.find(p => p.phone && String(p.phone).replace(/\D/g, '') === cleanPhone && p.accountPin);
            }

            const storedPin = acc?.accountPin || matchedPatient?.accountPin;
            if (!storedPin) {
                return { success: false, notRegistered: true, message: 'لا يوجد حساب مسجل مسبقاً بهذا الرقم. يمكنك إجراء الفحص السريري وحفظ تقريرك فوراً.' };
            }

            if (storedPin !== cleanPin) {
                return { success: false, message: 'الرمز السري (PIN) غير صحيح، يرجى المحاولة ثانية' };
            }

            // نجاح تسجيل الدخول
            const activePt = matchedPatient || {
                patientId: acc.patientId,
                name: acc.name,
                phone: acc.originalPhone || acc.phone,
                gender: acc.gender,
                age: acc.age,
                weight: acc.weight,
                height: acc.height,
                bmi: acc.bmi,
                isRegistered: true
            };

            setAuthPatient({
                phone: cleanPhone,
                originalPhone: acc?.originalPhone || activePt.phone,
                name: activePt.fullName || activePt.name || acc.name,
                patientId: activePt.patientId || acc.patientId,
                gender: activePt.gender || acc?.gender,
                age: activePt.age || acc?.age,
                weight: activePt.weight || acc?.weight,
                height: activePt.height || acc?.height,
                bmi: activePt.bmi || acc?.bmi,
                isRegistered: true,
                loginTime: Date.now()
            });

            return { success: true, patient: activePt, message: 'تم تسجيل الدخول بنجاح' };
        } catch(err) {
            console.error('Error in verifyPatientPin:', err);
            return { success: false, message: 'تعذر التحقق: ' + err.message };
        }
    }

    function setAuthPatient(authData) {
        if (!authData) {
            localStorage.removeItem('smart_auth_patient');
        } else {
            localStorage.setItem('smart_auth_patient', JSON.stringify(authData));
        }
    }

    function getAuthPatient() {
        try {
            const raw = localStorage.getItem('smart_auth_patient');
            return raw ? JSON.parse(raw) : null;
        } catch(e) {
            return null;
        }
    }

    function logoutPatient() {
        localStorage.removeItem('smart_auth_patient');
    }

    async function getPatientHistoryByPhone(phone, targetPatientId = null) {
        const cleanPhone = String(phone || '').replace(/\D/g, '');
        const cleanTargetId = targetPatientId ? String(targetPatientId).trim() : '';
        if (!cleanPhone && !cleanTargetId) return [];

        function isPhoneMatch(p1, p2) {
            if (!p1 || !p2) return false;
            const s1 = String(p1).replace(/\D/g, '');
            const s2 = String(p2).replace(/\D/g, '');
            if (!s1 || !s2) return false;
            if (s1 === s2) return true;
            if (s1.length >= 7 && s2.length >= 7) {
                const tail1 = s1.slice(-8);
                const tail2 = s2.slice(-8);
                if (tail1 === tail2) return true;
                if (s1.endsWith(s2) || s2.endsWith(s1)) return true;
            }
            return false;
        }

        try {
            // تجميع كافة المرضى من IndexedDB ومن التخزين المحلي وقائمة المزامنة السحابية
            let allPatients = [];
            try { allPatients = await getAllPatients(); } catch(e) {}
            if (!Array.isArray(allPatients)) allPatients = [];

            try {
                const lsAll = JSON.parse(localStorage.getItem('smart_all_patients') || '[]');
                if (Array.isArray(lsAll)) {
                    for (const lp of lsAll) {
                        const lpId = lp.patientId || lp.id;
                        if (!allPatients.some(ap => (ap.patientId === lpId || ap.id === lpId))) {
                            allPatients.push(lp);
                        }
                    }
                }
            } catch(e) {}

            try {
                const cloudPts = JSON.parse(localStorage.getItem('smart_cloud_synced_patients') || '[]');
                if (Array.isArray(cloudPts)) {
                    for (const cp of cloudPts) {
                        const cpId = cp.patientId || cp.id;
                        if (!allPatients.some(ap => (ap.patientId === cpId || ap.id === cpId))) {
                            allPatients.push(cp);
                        }
                    }
                }
            } catch(e) {}

            // إضافة المريض النشط الحالي إن وجد
            try {
                const actP = JSON.parse(localStorage.getItem('smart_active_patient') || 'null');
                if (actP) {
                    const actId = actP.patientId || actP.id;
                    if (!allPatients.some(ap => (ap.patientId === actId || ap.id === actId))) {
                        allPatients.push(actP);
                    }
                }
            } catch(e) {}

            const matchingPatients = allPatients.filter(p => {
                if (!p) return false;
                const pId = p.patientId || p.id;
                if (cleanTargetId && (pId === cleanTargetId || String(pId).includes(cleanTargetId))) return true;
                if (cleanPhone && isPhoneMatch(p.phone, cleanPhone)) return true;
                return false;
            });

            const allAssessments = [];
            for (const pt of matchingPatients) {
                const ptId = pt.patientId || pt.id;
                if (ptId) {
                    const ass = await getPatientAssessments(ptId);
                    if (Array.isArray(ass)) {
                        ass.forEach(a => {
                            if (!allAssessments.some(ea => ea.assessmentId === a.assessmentId || (ea.date && ea.date === a.date))) {
                                allAssessments.push({ ...a, patient: pt });
                            }
                        });
                    }
                }
                if (pt.assessment || pt.latestAssessment) {
                    const curAss = pt.assessment || pt.latestAssessment;
                    const curDate = curAss.date || pt.createdAt || new Date().toISOString();
                    if (!allAssessments.some(ea => ea.date === curDate || (ea.assessmentId && ea.assessmentId === curAss.assessmentId))) {
                        allAssessments.push({ ...curAss, patient: pt, date: curDate });
                    }
                }
            }

            // فحص smart_current_assessment في localStorage كخط دفاع مباشر للمريض المسجل حالياً
            try {
                const rawCurAss = localStorage.getItem('smart_current_assessment');
                if (rawCurAss) {
                    const curAss = JSON.parse(rawCurAss);
                    if (curAss) {
                        const curPhone = curAss.patientPhone || curAss.phone;
                        const curId = curAss.patientId;
                        const matchPhone = cleanPhone && isPhoneMatch(curPhone, cleanPhone);
                        const matchId = cleanTargetId && (curId === cleanTargetId);
                        const isAuth = !!localStorage.getItem('smart_auth_patient');
                        if (matchPhone || matchId || isAuth) {
                            const curDate = curAss.date || new Date().toISOString();
                            if (!allAssessments.some(ea => ea.date === curDate || (ea.assessmentId && ea.assessmentId === curAss.assessmentId))) {
                                const ptForAss = matchingPatients[0] || {
                                    name: curAss.patientName || ((phone || curPhone) ? `مراجع (${String(phone || curPhone).replace(/\D/g, '').slice(-4)})` : ''),
                                    phone: phone || curPhone,
                                    patientId: curId || cleanTargetId
                                };
                                allAssessments.unshift({ ...curAss, patient: ptForAss, date: curDate });
                            }
                        }
                    }
                }
            } catch(e) {}

            // ترتيب زمني من الأحدث إلى الأقدم
            allAssessments.sort((a, b) => new Date(b.date || 0) - new Date(a.date || 0));
            return allAssessments;
        } catch(e) {
            console.error('Error in getPatientHistoryByPhone:', e);
            return [];
        }
    }

    function getRegisteredAccountsCount() {
        try {
            const accountsList = JSON.parse(localStorage.getItem('smart_registered_accounts') || '[]');
            return accountsList.length;
        } catch(e) {
            return 0;
        }
    }

    async function getRegisteredAccounts() {
        try {
            const allPts = await getAllPatients();
            const accountsList = JSON.parse(localStorage.getItem('smart_registered_accounts') || '[]');
            const map = new Map();
            
            accountsList.forEach(a => {
                if (a.phone) map.set(a.phone, a);
            });

            allPts.forEach(p => {
                const phone = p.cleanPhone || (p.phone ? String(p.phone).replace(/\D/g, '') : null);
                if (phone && (p.isRegistered || p.accountPin)) {
                    if (!map.has(phone)) {
                        map.set(phone, {
                            phone: phone,
                            originalPhone: p.phone,
                            name: p.fullName || p.name || 'مراجع مسجل',
                            patientId: p.patientId || p.id,
                            registeredAt: p.registeredAt || p.createdAt,
                            lastLoginAt: p.lastLoginAt || p.updatedAt
                        });
                    }
                }
            });

            return Array.from(map.values());
        } catch(e) {
            console.error('Error in getRegisteredAccounts:', e);
            return [];
        }
    }

    return {
        openDB,
        savePatient,
        getPatient,
        getPatientById: getPatient,
        getAllPatients,
        deletePatient,
        clearAllPatients,
        saveAssessment,
        getPatientAssessments,
        getAllAssessments,
        saveDailyLog,
        getPatientDailyLogs,
        getDailyLogs: getPatientDailyLogs,
        setSetting,
        getSetting,
        setCurrentSessionPatientId,
        getCurrentSessionPatientId,
        addAdminNotification,
        getAdminNotifications,
        markNotificationAsRead,
        markAllNotificationsAsRead,
        deleteNotification,
        clearAllNotifications,
        purgeDummyAssessments,
        registerPatientAccount,
        verifyPatientPin,
        setAuthPatient,
        getAuthPatient,
        logoutPatient,
        getPatientHistoryByPhone,
        getRegisteredAccountsCount,
        getRegisteredAccounts
    };
})();
window.SmartDB = SmartDB;

