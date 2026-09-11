// ============================================
// نظام التخزين المحلي - IndexedDB مع Fallback
// ============================================

const DB_NAME = 'SmartCheckProDB';
const DB_VERSION = 1;
const STORES = {
    patients: 'patients',
    assessments: 'assessments',
    dailyLogs: 'dailyLogs',
    recoveryProgress: 'recoveryProgress'
};

// التحقق من دعم IndexedDB
let indexedDBSupported = true;
try {
    if (!window.indexedDB) {
        indexedDBSupported = false;
        console.warn('⚠️ IndexedDB غير مدعوم - استخدام localStorage كـ fallback');
    }
} catch (e) {
    indexedDBSupported = false;
    console.warn('⚠️ IndexedDB غير مدعوم - استخدام localStorage كـ fallback:', e);
}

// فتح قاعدة البيانات
function openDatabase() {
    if (!indexedDBSupported) {
        return Promise.reject(new Error('IndexedDB غير مدعوم'));
    }
    
    return new Promise((resolve, reject) => {
        const request = indexedDB.open(DB_NAME, DB_VERSION);
        
        request.onerror = () => {
            console.error('❌ فشل فتح IndexedDB - استخدام localStorage كـ fallback');
            reject(request.error);
        };
        request.onsuccess = () => resolve(request.result);
        
        request.onupgradeneeded = (event) => {
            const db = event.target.result;
            
            // إنشاء store للمرضى
            if (!db.objectStoreNames.contains(STORES.patients)) {
                const patientStore = db.createObjectStore(STORES.patients, { keyPath: 'patientId' });
                patientStore.createIndex('phone', 'phone', { unique: true });
                patientStore.createIndex('createdAt', 'createdAt');
            }
            
            // إنشاء store للتقييمات
            if (!db.objectStoreNames.contains(STORES.assessments)) {
                const assessmentStore = db.createObjectStore(STORES.assessments, { keyPath: 'assessmentId' });
                assessmentStore.createIndex('patientId', 'patientId');
                assessmentStore.createIndex('createdAt', 'createdAt');
            }
            
            // إنشاء store للسجلات اليومية
            if (!db.objectStoreNames.contains(STORES.dailyLogs)) {
                const logStore = db.createObjectStore(STORES.dailyLogs, { keyPath: 'logId' });
                logStore.createIndex('patientId', 'patientId');
                logStore.createIndex('date', 'date');
            }
            
            // إنشاء store لتقدم التعافي
            if (!db.objectStoreNames.contains(STORES.recoveryProgress)) {
                const progressStore = db.createObjectStore(STORES.recoveryProgress, { keyPath: 'patientId' });
                progressStore.createIndex('lastUpdated', 'lastUpdated');
            }
        };
    });
}

// دوال Fallback لـ localStorage
const LS_PREFIX = 'smartcheck_';

function lsGet(storeName, key) {
    try {
        const data = localStorage.getItem(`${LS_PREFIX}${storeName}_${key}`);
        return data ? JSON.parse(data) : null;
    } catch (e) {
        console.error('❌ خطأ في قراءة localStorage:', e);
        return null;
    }
}

function lsSet(storeName, key, data) {
    try {
        localStorage.setItem(`${LS_PREFIX}${storeName}_${key}`, JSON.stringify(data));
        return true;
    } catch (e) {
        console.error('❌ خطأ في كتابة localStorage:', e);
        return false;
    }
}

function lsGetAll(storeName) {
    try {
        const result = [];
        const prefix = `${LS_PREFIX}${storeName}_`;
        for (let i = 0; i < localStorage.length; i++) {
            const key = localStorage.key(i);
            if (key && key.startsWith(prefix)) {
                const data = localStorage.getItem(key);
                if (data) {
                    try {
                        result.push(JSON.parse(data));
                    } catch (e) {
                        console.error('❌ خطأ في تحليل البيانات:', e);
                    }
                }
            }
        }
        return result;
    } catch (e) {
        console.error('❌ خطأ في قراءة جميع البيانات من localStorage:', e);
        return [];
    }
}

function lsDelete(storeName, key) {
    try {
        localStorage.removeItem(`${LS_PREFIX}${storeName}_${key}`);
        return true;
    } catch (e) {
        console.error('❌ خطأ في حذف من localStorage:', e);
        return false;
    }
}

// إضافة بيانات إلى store
async function addData(storeName, data) {
    try {
        const db = await openDatabase();
        return new Promise((resolve, reject) => {
            const transaction = db.transaction(storeName, 'readwrite');
            const store = transaction.objectStore(storeName);
            const request = store.add(data);
            
            request.onsuccess = () => resolve(request.result);
            request.onerror = () => reject(request.error);
        });
    } catch (error) {
        console.warn('⚠️ استخدام localStorage fallback لإضافة البيانات');
        const key = data.patientId || data.assessmentId || data.logId || data.patientId || Date.now().toString();
        return lsSet(storeName, key, data) ? key : Promise.reject(error);
    }
}

// تحديث بيانات في store
async function updateData(storeName, data) {
    try {
        const db = await openDatabase();
        return new Promise((resolve, reject) => {
            const transaction = db.transaction(storeName, 'readwrite');
            const store = transaction.objectStore(storeName);
            const request = store.put(data);
            
            request.onsuccess = () => resolve(request.result);
            request.onerror = () => reject(request.error);
        });
    } catch (error) {
        console.warn('⚠️ استخدام localStorage fallback لتحديث البيانات');
        const key = data.patientId || data.assessmentId || data.logId || data.patientId || Date.now().toString();
        return lsSet(storeName, key, data) ? key : Promise.reject(error);
    }
}

// الحصول على بيانات من store
async function getData(storeName, key) {
    try {
        const db = await openDatabase();
        return new Promise((resolve, reject) => {
            const transaction = db.transaction(storeName, 'readonly');
            const store = transaction.objectStore(storeName);
            const request = store.get(key);
            
            request.onsuccess = () => resolve(request.result);
            request.onerror = () => reject(request.error);
        });
    } catch (error) {
        console.warn('⚠️ استخدام localStorage fallback للحصول على البيانات');
        return lsGet(storeName, key);
    }
}

// الحصول على جميع البيانات من store
async function getAllData(storeName) {
    try {
        const db = await openDatabase();
        return new Promise((resolve, reject) => {
            const transaction = db.transaction(storeName, 'readonly');
            const store = transaction.objectStore(storeName);
            const request = store.getAll();
            
            request.onsuccess = () => resolve(request.result);
            request.onerror = () => reject(request.error);
        });
    } catch (error) {
        console.warn('⚠️ استخدام localStorage fallback للحصول على جميع البيانات');
        return lsGetAll(storeName);
    }
}

// الحصول على بيانات باستخدام index
async function getDataByIndex(storeName, indexName, value) {
    const db = await openDatabase();
    return new Promise((resolve, reject) => {
        const transaction = db.transaction(storeName, 'readonly');
        const store = transaction.objectStore(storeName);
        const index = store.index(indexName);
        const request = index.getAll(value);
        
        request.onsuccess = () => resolve(request.result);
        request.onerror = () => reject(request.error);
    });
}

// حذف بيانات من store
async function deleteData(storeName, key) {
    try {
        const db = await openDatabase();
        return new Promise((resolve, reject) => {
            const transaction = db.transaction(storeName, 'readwrite');
            const store = transaction.objectStore(storeName);
            const request = store.delete(key);
            
            transaction.oncomplete = () => resolve(request.result);
            transaction.onerror = () => reject(transaction.error);
        });
    } catch (error) {
        console.warn('⚠️ استخدام localStorage fallback لحذف البيانات');
        return lsDelete(storeName, key) ? Promise.resolve() : Promise.reject(error);
    }
}

// ============================================
// نظام إدارة المرضى
// ============================================

// إنشاء ملف مريض جديد
async function createPatientProfile(patientId, name = '', age = null, gender = null, weight = null, height = null, countryCode = 'jo') {
    let finalGender = gender;
    if (!finalGender && typeof detectArabicGender === 'function' && name) {
        finalGender = detectArabicGender(name);
    }
    const patient = {
        patientId: patientId,
        name: name,
        phone: patientId.split('_')[1], // استخراج رقم الهاتف من المعرف
        countryCode: countryCode,
        age: age,
        gender: finalGender || 'male',
        weight: weight,
        height: height,
        acceptedRecoveryPlan: false,
        acceptedPlanDate: null,
        createdAt: new Date().toISOString(),
        lastVisit: new Date().toISOString()
    };
    
    await addData(STORES.patients, patient);
    return patient;
}

// الحصول على ملف مريض
async function getPatientProfile(patientId) {
    return await getData(STORES.patients, patientId);
}

// الحصول على مريض باستخدام رقم الهاتف
async function getPatientByPhone(phoneNumber) {
    const patients = await getDataByIndex(STORES.patients, 'phone', phoneNumber);
    return patients.length > 0 ? patients[0] : null;
}

// تحديث ملف مريض
async function updatePatientProfile(patientId, updates) {
    const patient = await getPatientProfile(patientId);
    if (patient) {
        const updatedPatient = { ...patient, ...updates, lastVisit: new Date().toISOString() };
        console.log('💾 تحديث بيانات المريض:', updatedPatient);
        await updateData(STORES.patients, updatedPatient);
        console.log('✅ تم تحديث بيانات المريض بنجاح');
        return updatedPatient;
    }
    console.log('❌ لم يتم العثور على المريض للتحديث:', patientId);
    return null;
}

// ============================================
// نظام إدارة التقييمات
// ============================================

// إنشاء تقييم جديد
async function createAssessment(patientId, assessmentData) {
    const assessmentId = `ass_${Date.now()}`;
    
    const assessment = {
        assessmentId: assessmentId,
        patientId: patientId,
        painArea: assessmentData.painArea,
        painScore: assessmentData.painScore,
        clinicalFeatures: assessmentData.clinicalFeatures || [],
        diagnoses: assessmentData.diagnoses || [],
        treatmentGoals: assessmentData.treatmentGoals || [],
        recoveryPlan: assessmentData.recoveryPlan || [],
        createdAt: new Date().toISOString()
    };
    
    await addData(STORES.assessments, assessment);
    return assessment;
}

// حفظ تقييم (اسم مستعار لـ createAssessment)
async function saveAssessment(patientId, assessmentData) {
    return await createAssessment(patientId, assessmentData);
}

// الحصول على تقييمات مريض
async function getPatientAssessments(patientId) {
    return await getDataByIndex(STORES.assessments, 'patientId', patientId);
}

// الحصول على آخر تقييم للمريض
async function getLatestAssessment(patientId) {
    const assessments = await getPatientAssessments(patientId);
    if (assessments.length > 0) {
        return assessments.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))[0];
    }
    return null;
}

// ============================================
// نظام السجلات اليومية
// ============================================

// إنشاء سجل يومي
async function createDailyLog(patientId, logData) {
    const logId = `log_${Date.now()}`;
    const today = new Date().toISOString().split('T')[0];
    

    const log = {
        logId: logId,
        patientId: patientId,
        date: today,
        painScore: logData.painScore || 0,
        movementScore: logData.movementScore || 0,
        painRadiation: logData.painRadiation || false,
        exerciseCompleted: logData.exerciseCompleted || false,
        walkingMinutes: logData.walkingMinutes || 0,
        sleepQuality: logData.sleepQuality || 0,
        notes: logData.notes || '',
        createdAt: new Date().toISOString()
    };
    
    await addData(STORES.dailyLogs, log);
    return log;
}

// حفظ سجل يومي (اسم مستعار لـ createDailyLog)
async function saveDailyLog(patientId, logData) {
    return await createDailyLog(patientId, logData);
}

// الحصول على سجلات مريض
async function getPatientDailyLogs(patientId) {
    return await getDataByIndex(STORES.dailyLogs, 'patientId', patientId);
}

// الحصول على سجل يومي محدد
async function getDailyLog(patientId, date) {
    const logs = await getPatientDailyLogs(patientId);
    return logs.find(log => log.date === date) || null;
}

// تحديث سجل يومي
async function updateDailyLog(logId, updates) {
    const log = await getData(STORES.dailyLogs, logId);
    if (log) {
        const updatedLog = { ...log, ...updates };
        await updateData(STORES.dailyLogs, updatedLog);
        return updatedLog;
    }
    return null;
}

// ============================================
// نظام تقدم التعافي
// ============================================

// إنشاء أو تحديث تقدم التعافي
async function updateRecoveryProgress(patientId, progressData) {
    const progress = {
        patientId: patientId,
        recoveryScore: progressData.recoveryScore || 0,
        painTrend: progressData.painTrend || 'stable',
        movementTrend: progressData.movementTrend || 'stable',
        exerciseCompliance: progressData.exerciseCompliance || 0,
        daysSinceStart: progressData.daysSinceStart || 0,
        estimatedRecoveryDays: progressData.estimatedRecoveryDays || 30,
        lastUpdated: new Date().toISOString()
    };
    
    await updateData(STORES.recoveryProgress, progress);
    return progress;
}

// الحصول على تقدم التعافي
async function getRecoveryProgress(patientId) {
    return await getData(STORES.recoveryProgress, patientId);
}

// حساب مؤشر التعافي
async function calculateRecoveryScore(patientId) {
    const logs = await getPatientDailyLogs(patientId);
    
    if (logs.length === 0) return 0;
    
    // حساب تحسن الألم
    const firstPainScore = logs[0].painScore;
    const lastPainScore = logs[logs.length - 1].painScore;
    const painImprovement = firstPainScore - lastPainScore;
    const painScore = Math.min(100, Math.max(0, (painImprovement / firstPainScore) * 100));
    
    // حساب الالتزام بالتمارين
    const exerciseCompliance = (logs.filter(log => log.exerciseCompleted).length / logs.length) * 100;
    
    // حساب تحسن الحركة
    const movementImprovement = logs[logs.length - 1].movementScore - logs[0].movementScore;
    const movementScore = Math.min(100, Math.max(0, (movementImprovement / 10) * 100));
    
    // حساب النتيجة النهائية
    const recoveryScore = (painScore * 0.4) + (exerciseCompliance * 0.3) + (movementScore * 0.3);
    
    return Math.round(recoveryScore);
}

// ============================================
// نظام المصادقة المحلي
// ============================================

// قواعد أرقام الهواتف حسب الدولة
const phoneRules = {
    'jo': { pattern: /^07[789]\d{7}$/, length: 10, name: 'الأردن' },
    'sa': { pattern: /^05\d{8}$/, length: 10, name: 'السعودية' },
    'ae': { pattern: /^05\d{8}$/, length: 10, name: 'الإمارات' },
    'eg': { pattern: /^01[0125]\d{8}$/, length: 11, name: 'مصر' },
    'kw': { pattern: /^[569]\d{7}$/, length: 8, name: 'الكويت' },
    'qa': { pattern: /^3[0-9]{7}$/, length: 8, name: 'قطر' },
    'bh': { pattern: /^3[0-9]{7}$/, length: 8, name: 'البحرين' },
    'om': { pattern: /^9\d{7}$/, length: 8, name: 'عمان' },
    'iq': { pattern: /^07[0-9]{8}$/, length: 11, name: 'العراق' },
    'sy': { pattern: /^09\d{8}$/, length: 10, name: 'سوريا' },
    'lb': { pattern: /^0[13-9]\d{7}$/, length: 9, name: 'لبنان' },
    'ps': { pattern: /^05[69]\d{7}$/, length: 10, name: 'فلسطين' }
};

// التحقق من رقم الهاتف
function validatePhoneNumber(phoneNumber, countryCode) {
    const rule = phoneRules[countryCode];
    if (!rule) {
        return { valid: false, message: 'الدولة غير مدعومة' };
    }
    
    if (phoneNumber.length !== rule.length) {
        return { valid: false, message: `رقم الهاتف يجب أن يكون ${rule.length} أرقام في ${rule.name}` };
    }
    
    if (!rule.pattern.test(phoneNumber)) {
        return { valid: false, message: `رقم الهاتف غير صحيح لـ ${rule.name}` };
    }
    
    return { valid: true, message: 'رقم الهاتف صحيح' };
}

// تسجيل الدخول
async function login(phoneNumber, countryCode = 'jo') {
    // التحقق من رقم الهاتف
    const validation = validatePhoneNumber(phoneNumber, countryCode);
    if (!validation.valid) {
        throw new Error(validation.message);
    }
    
    // إنشاء معرف فريد للمريض (دولة + هاتف)
    const patientId = `${countryCode}_${phoneNumber}`;
    
    let patient = await getPatientProfile(patientId);
    
    if (!patient) {
        // لا يتم إنشاء ملف جديد تلقائياً - يتم إنشاؤه فقط بعد التشخيص
        console.log('⚠️ لم يتم العثور على مريض - سيتم إنشاؤه بعد التشخيص');
        // لا نحفظ الجلسة إذا لم يكن المريض موجوداً
        return null;
    } else {
        // تحديث آخر زيارة
        await updatePatientProfile(patient.patientId, { lastVisit: new Date().toISOString() });
        console.log('✅ تم العثور على مريض موجود:', patient);
        
        // حفظ الجلسة فقط إذا كان المريض موجوداً
        localStorage.setItem('currentPatientId', patient.patientId);
        localStorage.setItem('currentPatientPhone', phoneNumber);
        localStorage.setItem('currentPatientCountry', countryCode);
        console.log('💾 تم حفظ الجلسة. currentPatientId:', patient.patientId);
        
        return patient;
    }
}

// التحقق من الجلسة
async function getCurrentPatient() {
    const patientId = localStorage.getItem('currentPatientId');
    if (patientId) {
        return await getPatientProfile(patientId);
    }
    return null;
}

// تسجيل الخروج
function logout() {
    localStorage.removeItem('currentPatientId');
    localStorage.removeItem('currentPatientPhone');
}

// تنسيق التاريخ
function formatDate(dateString) {
    if (!dateString) return 'غير محدد';
    const date = new Date(dateString);
    return date.toLocaleDateString('ar-SA', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
    });
}

// الحصول على تقييمات المريض
async function getPatientAssessments(patientId) {
    try {
        const db = await openDatabase();
        return new Promise((resolve, reject) => {
            const transaction = db.transaction(['assessments'], 'readonly');
            const store = transaction.objectStore('assessments');
            const index = store.index('patientId');
            const request = index.getAll(patientId);
            
            request.onsuccess = () => resolve(request.result);
            request.onerror = () => reject(request.error);
        });
    } catch (error) {
        console.error('❌ خطأ في الحصول على تقييمات المريض:', error);
        return [];
    }
}

// الحصول على السجلات اليومية للمريض
async function getPatientDailyLogs(patientId) {
    try {
        const db = await openDatabase();
        return new Promise((resolve, reject) => {
            const transaction = db.transaction(['dailyLogs'], 'readonly');
            const store = transaction.objectStore('dailyLogs');
            const index = store.index('patientId');
            const request = index.getAll(patientId);
            
            request.onsuccess = () => resolve(request.result);
            request.onerror = () => reject(request.error);
        });
    } catch (error) {
        console.error('❌ خطأ في الحصول على السجلات اليومية للمريض:', error);
        return [];
    }
}

// ============================================
// نظام التصدير والاستيراد
// ============================================

// تصدير جميع بيانات المريض
async function exportPatientData(patientId) {
    const data = {
        patientProfile: await getPatientProfile(patientId),
        assessments: await getPatientAssessments(patientId),
        dailyLogs: await getPatientDailyLogs(patientId),
        recoveryProgress: await getRecoveryProgress(patientId),
        exportDate: new Date().toISOString(),
        version: '1.0'
    };
    
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `smart-check-${patientId}-${Date.now()}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    
    return data;
}

// استيراد بيانات المريض
async function importPatientData(file) {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = async (e) => {
            try {
                const data = JSON.parse(e.target.result);
                
                // استيراد ملف المريض
                if (data.patientProfile) {
                    await updateData(STORES.patients, data.patientProfile);
                }
                
                // استيراد التقييمات
                if (data.assessments && Array.isArray(data.assessments)) {
                    for (const assessment of data.assessments) {
                        await updateData(STORES.assessments, assessment);
                    }
                }
                
                // استيراد السجلات اليومية
                if (data.dailyLogs && Array.isArray(data.dailyLogs)) {
                    for (const log of data.dailyLogs) {
                        await updateData(STORES.dailyLogs, log);
                    }
                }
                
                // استيراد تقدم التعافي
                if (data.recoveryProgress) {
                    await updateData(STORES.recoveryProgress, data.recoveryProgress);
                }
                
                resolve(data);
            } catch (error) {
                reject(error);
            }
        };
        reader.onerror = () => reject(reader.error);
        reader.readAsText(file);
    });
}

// ============================================
// وظائف مساعدة
// ============================================

// توليد معرف فريد
function generateId(prefix = '') {
    return `${prefix}${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
}

// تنسيق التاريخ
function formatDate(dateString) {
    const date = new Date(dateString);
    return date.toLocaleDateString('ar-SA', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
    });
}

// حساب عدد الأيام بين تاريخين
function daysBetween(date1, date2) {
    const oneDay = 24 * 60 * 60 * 1000;
    const firstDate = new Date(date1);
    const secondDate = new Date(date2);
    return Math.round(Math.abs((firstDate - secondDate) / oneDay));
}

// ============================================
// نظام النسخ الاحتياطي التلقائي
// ============================================

// تصدير جميع البيانات كـ JSON
async function exportAllData() {
    try {
        const patients = await getAllData(STORES.patients);
        const assessments = await getAllData(STORES.assessments);
        const dailyLogs = await getAllData(STORES.dailyLogs);
        const recoveryProgress = await getAllData(STORES.recoveryProgress);
        
        const backupData = {
            version: DB_VERSION,
            exportDate: new Date().toISOString(),
            patients: patients,
            assessments: assessments,
            dailyLogs: dailyLogs,
            recoveryProgress: recoveryProgress
        };
        
        return JSON.stringify(backupData, null, 2);
    } catch (error) {
        console.error('❌ خطأ في تصدير البيانات:', error);
        return null;
    }
}

// حفظ النسخة الاحتياطية في localStorage
async function saveBackupToLocalStorage() {
    try {
        const backupData = await exportAllData();
        if (backupData) {
            localStorage.setItem('smartcheck_backup', backupData);
            localStorage.setItem('smartcheck_backup_date', new Date().toISOString());
            console.log('✅ تم حفظ النسخة الاحتياطية في localStorage');
            return true;
        }
        return false;
    } catch (error) {
        console.error('❌ خطأ في حفظ النسخة الاحتياطية:', error);
        return false;
    }
}

// استعادة النسخة الاحتياطية من localStorage
async function restoreBackupFromLocalStorage() {
    try {
        const backupData = localStorage.getItem('smartcheck_backup');
        if (!backupData) {
            console.warn('⚠️ لا توجد نسخة احتياطية محفوظة');
            return false;
        }
        
        const parsed = JSON.parse(backupData);
        console.log('📦 استعادة النسخة الاحتياطية من:', parsed.exportDate);
        
        // استعادة البيانات
        for (const patient of parsed.patients || []) {
            await updateData(STORES.patients, patient);
        }
        for (const assessment of parsed.assessments || []) {
            await updateData(STORES.assessments, assessment);
        }
        for (const log of parsed.dailyLogs || []) {
            await updateData(STORES.dailyLogs, log);
        }
        for (const progress of parsed.recoveryProgress || []) {
            await updateData(STORES.recoveryProgress, progress);
        }
        
        console.log('✅ تم استعادة النسخة الاحتياطية بنجاح');
        return true;
    } catch (error) {
        console.error('❌ خطأ في استعادة النسخة الاحتياطية:', error);
        return false;
    }
}

// التحقق من الحاجة إلى نسخ احتياطي تلقائي
async function checkAndAutoBackup() {
    try {
        const lastBackupDate = localStorage.getItem('smartcheck_backup_date');
        const now = new Date();
        
        if (!lastBackupDate) {
            // لا توجد نسخة احتياطية سابقة - إنشاء واحدة
            return await saveBackupToLocalStorage();
        }
        
        const lastBackup = new Date(lastBackupDate);
        const hoursSinceBackup = (now - lastBackup) / (1000 * 60 * 60);
        
        // إنشاء نسخة احتياطية كل 24 ساعة
        if (hoursSinceBackup >= 24) {
            console.log('🔄 مرت 24 ساعة - إنشاء نسخة احتياطية جديدة');
            return await saveBackupToLocalStorage();
        }
        
        return false;
    } catch (error) {
        console.error('❌ خطأ في التحقق من النسخ الاحتياطي:', error);
        return false;
    }
}

// تحميل النسخة الاحتياطية كملف
function downloadBackupFile() {
    exportAllData().then(backupData => {
        if (backupData) {
            const blob = new Blob([backupData], { type: 'application/json' });
            const url = URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = `smartcheck_backup_${new Date().toISOString().split('T')[0]}.json`;
            document.body.appendChild(a);
            a.click();
            document.body.removeChild(a);
            URL.revokeObjectURL(url);
            console.log('✅ تم تحميل النسخة الاحتياطية');
        }
    });
}

// ============================================
// نظام الإشعارات للمتابعة اليومية
// ============================================

// طلب إذن الإشعارات
async function requestNotificationPermission() {
    if (!('Notification' in window)) {
        console.warn('⚠️ المتصفح لا يدعم الإشعارات');
        return false;
    }
    
    if (Notification.permission === 'granted') {
        return true;
    }
    
    if (Notification.permission !== 'denied') {
        const permission = await Notification.requestPermission();
        return permission === 'granted';
    }
    
    return false;
}

// إرسال إشعار للمتابعة اليومية
function sendDailyReminderNotification(patientName) {
    if (Notification.permission !== 'granted') {
        console.warn('⚠️ إذن الإشعارات غير ممنوح');
        return;
    }
    
    const notification = new Notification('🏥 تذكير بالمتابعة اليومية', {
        body: `مرحباً ${patientName || 'عزيزي المريض'}، حان وقت إدخال بيانات المتابعة اليومية لتتبع تقدمك في خطة التعافي.`,
        icon: '/assets/logo.png',
        badge: '/assets/logo.png',
        dir: 'rtl',
        lang: 'ar',
        requireInteraction: true,
        tag: 'daily-reminder'
    });
    
    notification.onclick = function() {
        window.focus();
        notification.close();
    };
    
    console.log('✅ تم إرسال إشعار التذكير');
}

// جدولة إشعار يومي
function scheduleDailyReminder(patientName, reminderTime = '09:00') {
    // حفظ وقت التذكير في localStorage
    localStorage.setItem('smartcheck_reminder_time', reminderTime);
    localStorage.setItem('smartcheck_reminder_enabled', 'true');
    
    // التحقق من الحاجة إلى إرسال إشعار
    const checkReminder = () => {
        const now = new Date();
        const currentTime = now.toTimeString().slice(0, 5); // HH:MM
        const lastReminderDate = localStorage.getItem('smartcheck_last_reminder_date');
        const today = now.toISOString().split('T')[0];
        
        // إرسال الإشعار إذا كان الوقت المناسب ولم يتم الإرسال اليوم
        if (currentTime === reminderTime && lastReminderDate !== today) {
            sendDailyReminderNotification(patientName);
            localStorage.setItem('smartcheck_last_reminder_date', today);
        }
    };
    
    // التحقق كل دقيقة
    setInterval(checkReminder, 60000);
    console.log('✅ تم جدولة إشعار يومي الساعة:', reminderTime);
}

// إيقاف الإشعارات اليومية
function stopDailyReminder() {
    localStorage.setItem('smartcheck_reminder_enabled', 'false');
    console.log('✅ تم إيقاف الإشعارات اليومية');
}

// التحقق من تفعيل الإشعارات
function isReminderEnabled() {
    return localStorage.getItem('smartcheck_reminder_enabled') === 'true';
}

// حذف ملف مريض وجميع بياناته المرتبطة
async function deletePatientProfile(patientId) {
    try {
        // حذف جميع السجلات اليومية للمريض
        const dailyLogs = await getAllData(STORES.dailyLogs);
        let deletedLogs = 0;
        for (const log of dailyLogs) {
            if (log.patientId === patientId) {
                try {
                    await deleteData(STORES.dailyLogs, log.logId);
                    deletedLogs++;
                } catch (err) {
                    console.error('خطأ في حذف سجل يومي:', err);
                }
            }
        }
        
        // حذف جميع التقييمات للمريض
        const assessments = await getAllData(STORES.assessments);
        let deletedAssessments = 0;
        for (const assessment of assessments) {
            if (assessment.patientId === patientId) {
                try {
                    await deleteData(STORES.assessments, assessment.assessmentId);
                    deletedAssessments++;
                } catch (err) {
                    console.error('خطأ في حذف تقييم:', err);
                }
            }
        }
        
        // حذف ملف المريض
        try {
            await deleteData(STORES.patients, patientId);
        } catch (err) {
            console.error('خطأ في حذف ملف المريض:', err);
            throw err;
        }
        
        // حذف تقدم التعافي إذا وجد
        try {
            await deleteData(STORES.recoveryProgress, patientId);
        } catch (err) {
            // تجاهل الخطأ إذا لم يوجد تقدم
            console.log('لا يوجد تقدم تعافي للحذف');
        }
        
        console.log(`تم حذف ${deletedLogs} سجل يومي و ${deletedAssessments} تقييم`);
        return true;
    } catch (error) {
        console.error('❌ خطأ في حذف ملف المريض:', error);
        throw error;
    }
}

// تصدير الوظائف للاستخدام في الملفات الأخرى
window.SmartCheckDB = {
    openDatabase,
    createPatientProfile,
    getPatientProfile,
    getPatientByPhone,
    updatePatientProfile,
    createAssessment,
    saveAssessment,
    getPatientAssessments,
    getLatestAssessment,
    createDailyLog,
    saveDailyLog,
    getPatientDailyLogs,
    getDailyLog,
    updateDailyLog,
    updateRecoveryProgress,
    getRecoveryProgress,
    calculateRecoveryScore,
    login,
    getCurrentPatient,
    logout,
    deletePatientProfile,
    exportPatientData,
    importPatientData,
    getAllData,
    formatDate,
    daysBetween
};
