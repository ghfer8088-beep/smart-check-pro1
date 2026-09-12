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
                resolve(dbInstance);
            };

            req.onerror = (e) => {
                console.error('IndexedDB Error:', e);
                reject(e);
            };
        });
    }

    // دوال إدارة المرضى
    async function savePatient(patient) {
        if (!patient) return null;
        try {
            if (patient.patientId) {
                localStorage.setItem('smart_patient_' + patient.patientId, JSON.stringify(patient));
                const allPts = JSON.parse(localStorage.getItem('smart_all_patients') || '[]');
                const idx = allPts.findIndex(p => p.patientId === patient.patientId);
                if (idx >= 0) allPts[idx] = { ...allPts[idx], ...patient };
                else allPts.push(patient);
                localStorage.setItem('smart_all_patients', JSON.stringify(allPts));
            }
        } catch(e) {}

        // ☁️ ترحيل المريض سحابياً فورياً عبر جسر المزامنة العالمي مع كشف الدولة والمدينة
        try {
            if (typeof SmartCloudSync !== 'undefined' && typeof SmartCloudSync.dispatchPatient === 'function') {
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
                        if (!map.has(p.patientId)) map.set(p.patientId, p);
                    });

                    // دمج الحالات السحابية المرحلية من المزامنة العالمية
                    try {
                        if (typeof SmartCloudSync !== 'undefined' && typeof SmartCloudSync.getPatients === 'function') {
                            const cloudList = SmartCloudSync.getPatients();
                            cloudList.forEach(cp => {
                                const pId = cp.patientId || cp.id;
                                if (pId && !map.has(pId)) {
                                    map.set(pId, {
                                        patientId: pId,
                                        name: cp.fullName || cp.name,
                                        phone: cp.phone,
                                        age: cp.age,
                                        gender: cp.gender,
                                        country: cp.country,
                                        city: cp.city,
                                        flag: cp.flag,
                                        device: cp.device,
                                        chiefDiagnosis: cp.diagnosisTitle,
                                        createdAt: cp.timestamp
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

    async function getPatientAssessments(patientId) {
        let lsAssessments = [];
        try {
            if (patientId) {
                const lsKey = 'smart_assessments_' + patientId;
                lsAssessments = JSON.parse(localStorage.getItem(lsKey) || '[]');
            }
        } catch(e) {}

        try {
            const db = await openDB();
            return new Promise((resolve) => {
                const tx = db.transaction('assessments', 'readonly');
                const index = tx.objectStore('assessments').index('patientId');
                const req = index.getAll(patientId);
                req.onsuccess = () => {
                    const dbAssessments = req.result || [];
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
        clearAllNotifications
    };
})();
