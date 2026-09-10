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
        const db = await openDB();
        return new Promise((resolve, reject) => {
            const tx = db.transaction('patients', 'readwrite');
            const store = tx.objectStore('patients');
            const req = store.put(patient);
            req.onsuccess = () => resolve(patient);
            req.onerror = (e) => reject(e);
        });
    }

    async function getPatient(patientId) {
        const db = await openDB();
        return new Promise((resolve, reject) => {
            const tx = db.transaction('patients', 'readonly');
            const store = tx.objectStore('patients');
            const req = store.get(patientId);
            req.onsuccess = () => resolve(req.result || null);
            req.onerror = (e) => reject(e);
        });
    }

    async function getAllPatients() {
        const db = await openDB();
        return new Promise((resolve, reject) => {
            const tx = db.transaction('patients', 'readonly');
            const store = tx.objectStore('patients');
            const req = store.getAll();
            req.onsuccess = () => resolve(req.result || []);
            req.onerror = (e) => reject(e);
        });
    }

    async function deletePatient(patientId) {
        const db = await openDB();
        return new Promise((resolve, reject) => {
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
            tx.onerror = (e) => reject(e);
        });
    }

    // دوال التقييمات
    async function saveAssessment(assessment) {
        const db = await openDB();
        return new Promise((resolve, reject) => {
            const tx = db.transaction('assessments', 'readwrite');
            const store = tx.objectStore('assessments');
            const req = store.put(assessment);
            req.onsuccess = () => resolve(req.result);
            req.onerror = (e) => reject(e);
        });
    }

    async function getPatientAssessments(patientId) {
        const db = await openDB();
        return new Promise((resolve, reject) => {
            const tx = db.transaction('assessments', 'readonly');
            const index = tx.objectStore('assessments').index('patientId');
            const req = index.getAll(patientId);
            req.onsuccess = () => resolve(req.result || []);
            req.onerror = (e) => reject(e);
        });
    }

    // دوال المتابعة اليومية
    async function saveDailyLog(log) {
        const db = await openDB();
        return new Promise((resolve, reject) => {
            const tx = db.transaction('dailyLogs', 'readwrite');
            const store = tx.objectStore('dailyLogs');
            const req = store.put(log);
            req.onsuccess = () => resolve(req.result);
            req.onerror = (e) => reject(e);
        });
    }

    async function getPatientDailyLogs(patientId) {
        const db = await openDB();
        return new Promise((resolve, reject) => {
            const tx = db.transaction('dailyLogs', 'readonly');
            const index = tx.objectStore('dailyLogs').index('patientId');
            const req = index.getAll(patientId);
            req.onsuccess = () => {
                const logs = req.result || [];
                logs.sort((a, b) => (a.sessionNumber || 0) - (b.sessionNumber || 0));
                resolve(logs);
            };
            req.onerror = (e) => reject(e);
        });
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

    return {
        openDB,
        savePatient,
        getPatient,
        getPatientById: getPatient,
        getAllPatients,
        deletePatient,
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
        deleteNotification,
        markAllNotificationsAsRead,
        clearAllNotifications
    };
})();
