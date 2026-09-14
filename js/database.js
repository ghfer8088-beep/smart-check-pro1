// ==========================================================================
// Smart Check Pro 2.0 - طبقة قاعدة البيانات الموحدة (IndexedDB Engine)
// ==========================================================================

const SmartDB = (function() {
    const DB_NAME = 'SmartCheckPro2_DB';
    const DB_VERSION = 1;
    let dbInstance = null;

    // فتح وتهيئة قاعدة البيانات
    function openDB() {
        return new Promise((resolve, reject) => {
            if (dbInstance) return resolve(dbInstance);

            const req = indexedDB.open(DB_NAME, DB_VERSION);

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
                dbInstance = e.target.result;
                try { purgeDummyAssessments(); } catch(err) {}
                resolve(dbInstance);
            };

            req.onerror = (e) => {
                console.error('IndexedDB Error:', e);
                reject(e);
            };
        });
    }

    // دوال إدارة المرضى
    async function savePatient(patient, options = {}) {
        if (!patient) return null;

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

            // تنظيف الاسم إن كان كلمة محظورة مثل 'الاسم' أو 'الآسم'
            if (mergedPatient.name === 'الاسم' || mergedPatient.name === 'الآسم' || mergedPatient.name === 'الإسم') {
                if (mergedPatient.fullName && mergedPatient.fullName !== mergedPatient.name) {
                    mergedPatient.name = mergedPatient.fullName;
                } else {
                    mergedPatient.name = 'مراجع كريم';
                }
            }

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

            localStorage.setItem('smart_patient_' + mergedPatient.patientId, JSON.stringify(mergedPatient));
            const allPts = JSON.parse(localStorage.getItem('smart_all_patients') || '[]');
            const idx = allPts.findIndex(p => p.patientId === mergedPatient.patientId);
            if (idx >= 0) allPts[idx] = { ...allPts[idx], ...mergedPatient };
            else allPts.unshift(mergedPatient);
            localStorage.setItem('smart_all_patients', JSON.stringify(allPts));
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
            return new Promise((resolve) => {
                const tx = db.transaction('patients', 'readonly');
                const store = tx.objectStore('patients');
                const req = store.get(patientId);
                req.onsuccess = () => resolve(req.result || lsPatient);
                req.onerror = () => resolve(lsPatient);
            });
        } catch(e) {
            return lsPatient;
        }
    }

    async function getAllPatients() {
        let lsPatients = [];
        try {
            lsPatients = JSON.parse(localStorage.getItem('smart_all_patients') || '[]');
        } catch(e) {}

        try {
            const db = await openDB();
            return new Promise((resolve) => {
                const tx = db.transaction('patients', 'readonly');
                const store = tx.objectStore('patients');
                const req = store.getAll();
                req.onsuccess = () => {
                    const dbList = req.result || [];
                    const map = new Map();
                    dbList.forEach(p => {
                        const k = p.patientId || p.id;
                        if (k) map.set(k, p);
                    });
                    const isGen = (str) => !str || str === 'العمود الفقري ومفاصل الحركة' || str === 'العمود الفقري والمفاصل' || str === 'استشارة وفحص سريري شامل';
                    lsPatients.forEach(p => {
                        const pId = p.patientId || p.id;
                        if (!pId) return;
                        if (!map.has(pId)) {
                            map.set(pId, p);
                        } else {
                            const existing = map.get(pId);
                            // إذا كان السجل يمثل فحصاً مختلفاً (موضع ألم مختلف أو تشخيص مختلف أو تاريخ فحص منفصل)، نحفظه كفحص مستقل ولا ندمجه قسراً!
                            const isDistinctTest = (
                                (!isGen(p.painArea) && !isGen(existing.painArea) && p.painArea !== existing.painArea) ||
                                (p.chiefDiagnosis && existing.chiefDiagnosis && p.chiefDiagnosis !== existing.chiefDiagnosis && p.chiefDiagnosis !== 'إجهاد ميكانيكي وظيفي في الأنسجة الداعمة' && existing.chiefDiagnosis !== 'إجهاد ميكانيكي وظيفي في الأنسجة الداعمة') ||
                                (p.createdAt && existing.createdAt && Math.abs(new Date(p.createdAt) - new Date(existing.createdAt)) > 300000)
                            );
                            if (isDistinctTest) {
                                const subKey = pId + '_test2';
                                map.set(subKey, { ...p, patientId: subKey, id: subKey });
                            } else {
                                map.set(pId, {
                                    ...existing,
                                    ...p,
                                    painArea: !isGen(p.painArea) ? p.painArea : (!isGen(existing.painArea) ? existing.painArea : p.painArea),
                                    painAreaTitle: !isGen(p.painAreaTitle) ? p.painAreaTitle : (!isGen(existing.painAreaTitle) ? existing.painAreaTitle : p.painAreaTitle),
                                    selectedPoint: !isGen(p.selectedPoint) ? p.selectedPoint : (!isGen(existing.selectedPoint) ? existing.selectedPoint : p.selectedPoint),
                                    chiefDiagnosis: (p.chiefDiagnosis && p.chiefDiagnosis !== 'إجهاد ميكانيكي وظيفي في الأنسجة الداعمة') ? p.chiefDiagnosis : (existing.chiefDiagnosis || p.chiefDiagnosis),
                                    diagnosisTitle: (p.diagnosisTitle && p.diagnosisTitle !== 'إجهاد ميكانيكي وظيفي في الأنسجة الداعمة') ? p.diagnosisTitle : (existing.diagnosisTitle || p.diagnosisTitle),
                                    assessment: (p.assessment && !p.assessment.autoHealed) ? p.assessment : (existing.assessment || p.assessment)
                                });
                            }
                        }
                    });

                    // دمج الحالات السحابية المرحلية من المزامنة العالمية بكامل بياناتها السريرية (العمر، الوزن، الطول، موضع الألم، التشخيص)
                    try {
                        if (typeof SmartCloudSync !== 'undefined' && typeof SmartCloudSync.getPatients === 'function') {
                            const cloudList = SmartCloudSync.getPatients();
                            cloudList.forEach(cp => {
                                const pId = cp.patientId || cp.id;
                                if (!pId) return;

                                // تصحيح الاسم إن كان "الاسم" أو "الآسم"
                                let cleanName = cp.fullName || cp.name || 'مراجع جديد';
                                if (cleanName === 'الاسم' || cleanName === 'الآسم' || cleanName === 'الإسم') {
                                    cleanName = 'مراجع كريم';
                                }

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
                                    device: cp.device || 'Mobile',
                                    deviceIcon: cp.deviceIcon || '📱',
                                    createdAt: cp.timestamp || cp.createdAt || new Date().toISOString()
                                };

                                if (!map.has(pId)) {
                                    map.set(pId, fullCloudPatient);
                                } else {
                                    const existing = map.get(pId);
                                    // إذا كان السجل السحابي يمثل فحصاً مختلفاً، نحفظه كسجل مستقل تماماً
                                    const isDistinctCloud = (
                                        (!isGen(fullCloudPatient.painArea) && !isGen(existing.painArea) && fullCloudPatient.painArea !== existing.painArea) ||
                                        (fullCloudPatient.chiefDiagnosis && existing.chiefDiagnosis && fullCloudPatient.chiefDiagnosis !== existing.chiefDiagnosis && fullCloudPatient.chiefDiagnosis !== 'إجهاد ميكانيكي وظيفي في الأنسجة الداعمة' && existing.chiefDiagnosis !== 'إجهاد ميكانيكي وظيفي في الأنسجة الداعمة') ||
                                        (fullCloudPatient.createdAt && existing.createdAt && Math.abs(new Date(fullCloudPatient.createdAt) - new Date(existing.createdAt)) > 300000)
                                    );

                                    if (isDistinctCloud) {
                                        const subKey = pId + '_cloud_test';
                                        map.set(subKey, { ...fullCloudPatient, patientId: subKey, id: subKey });
                                    } else {
                                        const mergedLogsCount = Math.max(existing.logsCount || 0, fullCloudPatient.logsCount || 0);
                                        const mergedRecoveryScore = Math.max(existing.recoveryScore || 0, fullCloudPatient.recoveryScore || 0);
                                        const mergedDailyLogs = (Array.isArray(fullCloudPatient.dailyLogs) && fullCloudPatient.dailyLogs.length > (existing.dailyLogs?.length || 0)) ? fullCloudPatient.dailyLogs : (existing.dailyLogs || fullCloudPatient.dailyLogs || []);

                                        map.set(pId, {
                                            ...existing,
                                            ...fullCloudPatient,
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
                                }
                            });
                        }
                    } catch(e) {}

                    resolve(Array.from(map.values()));
                };
                req.onerror = () => resolve(lsPatients);
            });
        } catch(e) {
            return lsPatients;
        }
    }

    async function deletePatient(patientId) {
        try {
            localStorage.removeItem('smart_patient_' + patientId);
            localStorage.removeItem('smart_daily_logs_' + patientId);
            localStorage.removeItem('smart_assessments_' + patientId);
            const allPts = JSON.parse(localStorage.getItem('smart_all_patients') || '[]');
            localStorage.setItem('smart_all_patients', JSON.stringify(allPts.filter(p => p.patientId !== patientId)));

            // إزالة المريض أيضاً من السجلات السحابية المتزامنة لضمان عدم عودته نهائياً
            try {
                const cloudPts = JSON.parse(localStorage.getItem('smart_cloud_synced_patients') || '[]');
                const filteredCloud = cloudPts.filter(cp => (cp.patientId || cp.id) !== patientId);
                localStorage.setItem('smart_cloud_synced_patients', JSON.stringify(filteredCloud));
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
            return new Promise((resolve) => {
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
            });
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
        if (!log) return null;
        if (!log.logId) {
            log.logId = 'log_' + (log.patientId || 'pt') + '_' + (log.sessionNumber || 1) + '_' + Date.now();
        }

        // ☁️ ترحيل سحابي فوري للجلسة المنجزة لكافة الأجهزة (موبايل + لابتوب)
        if (!options.skipCloudSync && typeof window.SmartCloudSync !== 'undefined' && typeof window.SmartCloudSync.dispatchSessionLog === 'function') {
            try {
                window.SmartCloudSync.dispatchSessionLog(log);
            } catch (e) {}
        }

        // حفظ متزامن وفوري في LocalStorage
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
                localStorage.setItem(lsKey, JSON.stringify(existing));

                // تحديث إحصائيات المريض الحقيقية تلقائياً لمنع أي تضارب أو أرقام وهمية
                try {
                    const pt = await getPatient(log.patientId);
                    if (pt) {
                        pt.logsCount = existing.length;
                        pt.completedSessions = Math.max(pt.completedSessions || 0, log.sessionNumber || 0, existing.length);
                        pt.recoveryScore = Math.min(100, Math.round((existing.length / 7) * 100));
                        pt.lastSessionDate = log.date || new Date().toISOString();
                        pt.dailyLogs = existing;
                        pt.logs = existing;
                        await savePatient(pt, { skipCloudSync: options.skipCloudSync });
                    }
                } catch (ptErr) {}
            }
        } catch(e) {
            console.warn('LocalStorage saveDailyLog warning:', e);
        }

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

        try {
            const db = await openDB();
            return new Promise((resolve) => {
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
                req.onerror = () => {
                    const fallbackMap = new Map();
                    cloudLogs.forEach(l => { if (l && l.sessionNumber) fallbackMap.set(l.sessionNumber, l); });
                    lsLogs.forEach(l => { if (l && l.sessionNumber) fallbackMap.set(l.sessionNumber, l); });
                    const res = Array.from(fallbackMap.values());
                    res.sort((a, b) => (a.sessionNumber || 0) - (b.sessionNumber || 0));
                    resolve(res);
                };
            });
        } catch(e) {
            const fallbackMap = new Map();
            cloudLogs.forEach(l => { if (l && l.sessionNumber) fallbackMap.set(l.sessionNumber, l); });
            lsLogs.forEach(l => { if (l && l.sessionNumber) fallbackMap.set(l.sessionNumber, l); });
            const res = Array.from(fallbackMap.values());
            res.sort((a, b) => (a.sessionNumber || 0) - (b.sessionNumber || 0));
            return res;
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
            const list = JSON.parse(localStorage.getItem('smart_admin_notifications') || '[]');
            const newNotif = {
                id: 'N-' + Date.now() + '-' + Math.floor(Math.random() * 1000),
                type: notif.type || 'info', // 'new_registration', 'plan_completed', 'red_flag', 'session_done'
                title: notif.title || 'إشعار جديد',
                message: notif.message || '',
                patientId: notif.patientId || null,
                patientName: notif.patientName || '',
                patientPhone: notif.patientPhone || '',
                meta: notif.meta || {},
                time: new Date().toISOString(),
                read: false
            };
            list.unshift(newNotif);
            if (list.length > 100) list.length = 100;
            localStorage.setItem('smart_admin_notifications', JSON.stringify(list));
            localStorage.setItem('smart_last_notif_time', Date.now().toString());
            return newNotif;
        } catch (e) {
            console.error('Error adding admin notification:', e);
            return null;
        }
    }

    function getAdminNotifications() {
        try {
            return JSON.parse(localStorage.getItem('smart_admin_notifications') || '[]');
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
        purgeDummyAssessments
    };
})();
