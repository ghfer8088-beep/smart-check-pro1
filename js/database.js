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

            localStorage.setItem('smart_patient_' + mergedPatient.patientId, JSON.stringify(mergedPatient));
            const allPts = JSON.parse(localStorage.getItem('smart_all_patients') || '[]');
            const idx = allPts.findIndex(p => p.patientId === mergedPatient.patientId || (mergedPatient.phone && p.phone && p.phone === mergedPatient.phone));
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
                    dbList.forEach(p => map.set(p.patientId, p));
                    lsPatients.forEach(p => {
                        if (!map.has(p.patientId)) {
                            map.set(p.patientId, p);
                        } else {
                            // دمج الحقول المفقودة
                            map.set(p.patientId, { ...p, ...map.get(p.patientId) });
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
                                    // إذا كان السجل موجوداً ولكن تنقصه بيانات كالعمر أو الوزن أو موضع الشكوى، ندمجها فوراً
                                    const existing = map.get(pId);
                                    map.set(pId, {
                                        ...fullCloudPatient,
                                        ...existing,
                                        age: existing.age || fullCloudPatient.age,
                                        weight: existing.weight || fullCloudPatient.weight,
                                        height: existing.height || fullCloudPatient.height,
                                        bmi: existing.bmi || fullCloudPatient.bmi,
                                        painArea: existing.painArea || fullCloudPatient.painArea,
                                        painAreaTitle: existing.painAreaTitle || fullCloudPatient.painAreaTitle,
                                        chiefDiagnosis: existing.chiefDiagnosis || fullCloudPatient.chiefDiagnosis,
                                        diagnosisTitle: existing.diagnosisTitle || fullCloudPatient.diagnosisTitle,
                                        assessment: existing.assessment || fullCloudPatient.assessment
                                    });
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

    // تطهير وحذف أي تقييمات وهمية مكررة أو تالفة
    async function purgeDummyAssessments() {
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
                                    a.painLocation !== 'العمود الفقري ومفاصل الحركة'
                                );
                                if (clean.length !== arr.length) {
                                    localStorage.setItem(k, JSON.stringify(clean));
                                }
                            }
                        }
                    } catch(e) {}
                }
            }
        } catch(e) {}

        try {
            // 2. تنظيف IndexedDB
            const db = await openDB();
            return new Promise((resolve) => {
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
                            val.painLocation === 'العمود الفقري ومفاصل الحركة'
                        )) {
                            cursor.delete();
                        }
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

    // دوال المتابعة اليومية
    async function saveDailyLog(log) {
        if (!log) return null;
        if (!log.logId) {
            log.logId = 'log_' + (log.patientId || 'pt') + '_' + (log.sessionNumber || 1) + '_' + Date.now();
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

        try {
            const db = await openDB();
            return new Promise((resolve) => {
                const tx = db.transaction('dailyLogs', 'readonly');
                const index = tx.objectStore('dailyLogs').index('patientId');
                const req = index.getAll(patientId);
                req.onsuccess = () => {
                    const dbLogs = req.result || [];
                    const mergedMap = new Map();
                    lsLogs.forEach(l => {
                        const key = (typeof l.sessionNumber === 'number') ? `sess_${l.sessionNumber}` : (l.logId || `date_${l.date}`);
                        mergedMap.set(key, l);
                    });
                    dbLogs.forEach(l => {
                        const key = (typeof l.sessionNumber === 'number') ? `sess_${l.sessionNumber}` : (l.logId || `date_${l.date}`);
                        mergedMap.set(key, { ...(mergedMap.get(key) || {}), ...l });
                    });
                    const mergedLogs = Array.from(mergedMap.values());
                    mergedLogs.sort((a, b) => (a.sessionNumber || 0) - (b.sessionNumber || 0));
                    resolve(mergedLogs);
                };
                req.onerror = () => {
                    lsLogs.sort((a, b) => (a.sessionNumber || 0) - (b.sessionNumber || 0));
                    resolve(lsLogs);
                };
            });
        } catch(e) {
            lsLogs.sort((a, b) => (a.sessionNumber || 0) - (b.sessionNumber || 0));
            return lsLogs;
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
