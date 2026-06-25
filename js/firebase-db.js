// Firebase Firestore Database Operations
// بديل لـ IndexedDB باستخدام Firestore

// ============================================
// نظام التشفير للبيانات الحساسة
// ============================================

const EncryptionUtils = {
    // مفتاح التشفير (في التطبيق الحقيقي، يجب توليده بشكل آمن)
    encryptionKey: null,
    
    // تهيئة مفتاح التشفير
    async initEncryptionKey() {
        if (this.encryptionKey) return this.encryptionKey;
        
        try {
            // محاولة استرجاع المفتاح من localStorage
            const storedKey = localStorage.getItem('encryptionKey');
            if (storedKey) {
                this.encryptionKey = await this.importKey(storedKey);
                return this.encryptionKey;
            }
            
            // توليد مفتاح جديد
            this.encryptionKey = await this.generateKey();
            const exportedKey = await this.exportKey(this.encryptionKey);
            localStorage.setItem('encryptionKey', exportedKey);
            
            return this.encryptionKey;
        } catch (error) {
            console.error('❌ Error initializing encryption key:', error);
            return null;
        }
    },
    
    // توليد مفتاح تشفير
    async generateKey() {
        return await crypto.subtle.generateKey(
            { name: 'AES-GCM', length: 256 },
            true,
            ['encrypt', 'decrypt']
        );
    },
    
    // تصدير المفتاح
    async exportKey(key) {
        const exported = await crypto.subtle.exportKey('jwk', key);
        return JSON.stringify(exported);
    },
    
    // استيراد المفتاح
    async importKey(jwkString) {
        const jwk = JSON.parse(jwkString);
        return await crypto.subtle.importKey(
            'jwk',
            jwk,
            { name: 'AES-GCM' },
            true,
            ['encrypt', 'decrypt']
        );
    },
    
    // تشفير النص
    async encrypt(text) {
        if (!text) return '';
        
        try {
            const key = await this.initEncryptionKey();
            if (!key) return text;
            
            const encoder = new TextEncoder();
            const data = encoder.encode(text);
            
            const iv = crypto.getRandomValues(new Uint8Array(12));
            const encrypted = await crypto.subtle.encrypt(
                { name: 'AES-GCM', iv },
                key,
                data
            );
            
            // دمج IV والبيانات المشفرة
            const combined = new Uint8Array(iv.length + encrypted.byteLength);
            combined.set(iv);
            combined.set(new Uint8Array(encrypted), iv.length);
            
            // تحويل إلى Base64
            return btoa(String.fromCharCode(...combined));
        } catch (error) {
            console.error('❌ Error encrypting data:', error);
            return text;
        }
    },
    
    // فك تشفير النص
    async decrypt(encryptedText) {
        if (!encryptedText) return '';
        
        try {
            const key = await this.initEncryptionKey();
            if (!key) return encryptedText;
            
            // تحويل من Base64
            const combined = Uint8Array.from(atob(encryptedText), c => c.charCodeAt(0));
            
            // استخراج IV والبيانات
            const iv = combined.slice(0, 12);
            const data = combined.slice(12);
            
            const decrypted = await crypto.subtle.decrypt(
                { name: 'AES-GCM', iv },
                key,
                data
            );
            
            const decoder = new TextDecoder();
            return decoder.decode(decrypted);
        } catch (error) {
            console.error('❌ Error decrypting data:', error);
            return encryptedText;
        }
    },
    
    // تشفير كائن
    async encryptObject(obj) {
        const encrypted = {};
        for (const [key, value] of Object.entries(obj)) {
            if (typeof value === 'string') {
                encrypted[key] = await this.encrypt(value);
            } else {
                encrypted[key] = value;
            }
        }
        return encrypted;
    },
    
    // فك تشفير كائن
    async decryptObject(obj) {
        const decrypted = {};
        for (const [key, value] of Object.entries(obj)) {
            if (typeof value === 'string') {
                decrypted[key] = await this.decrypt(value);
            } else {
                decrypted[key] = value;
            }
        }
        return decrypted;
    }
};

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

const SmartCheckDB = {
    // إنشاء مريض جديد
    async createPatient(patientData) {
        try {
            // تشفير البيانات الحساسة
            const encryptedData = await EncryptionUtils.encryptObject({
                name: patientData.name,
                phone: patientData.phone
            });
            
            const patientWithEncryption = {
                ...patientData,
                name: encryptedData.name,
                phone: encryptedData.phone
            };
            
            // استخدام المعرف المخصص إذا وجد
            if (patientData.patientId) {
                await db.collection('patients').doc(patientData.patientId).set({
                    ...patientWithEncryption,
                    createdAt: firebase.firestore.FieldValue.serverTimestamp(),
                    updatedAt: firebase.firestore.FieldValue.serverTimestamp()
                });
                console.log('✅ Patient created with ID:', patientData.patientId);
                return patientData;
            } else {
                // إنشاء معرف تلقائي إذا لم يوجد معرف
                const patientRef = await db.collection('patients').add({
                    ...patientWithEncryption,
                    createdAt: firebase.firestore.FieldValue.serverTimestamp(),
                    updatedAt: firebase.firestore.FieldValue.serverTimestamp()
                });
                console.log('✅ Patient created with ID:', patientRef.id);
                return { patientId: patientRef.id, ...patientData };
            }
        } catch (error) {
            console.error('❌ Error creating patient:', error);
            throw error;
        }
    },

    // الحصول على مريض بالمعرف
    async getPatient(patientId) {
        try {
            const doc = await db.collection('patients').doc(patientId).get();
            if (doc.exists) {
                const patientData = { patientId: doc.id, ...doc.data() };
                
                // فك تشفير البيانات الحساسة
                const decryptedData = await EncryptionUtils.decryptObject({
                    name: patientData.name,
                    phone: patientData.phone
                });
                
                return { ...patientData, ...decryptedData };
            }
            return null;
        } catch (error) {
            console.error('❌ Error getting patient:', error);
            throw error;
        }
    },

    // الحصول على ملف مريض (بديل لـ getPatient)
    async getPatientProfile(patientId) {
        return await this.getPatient(patientId);
    },

    // الحصول على مريض برقم الهاتف
    async getPatientByPhone(phone) {
        try {
            if (!phone) {
                console.error('❌ phone is undefined in getPatientByPhone');
                return null;
            }
            
            const snapshot = await db.collection('patients')
                .where('phone', '==', phone)
                .limit(1)
                .get();
            
            if (!snapshot.empty) {
                const doc = snapshot.docs[0];
                const patientData = { patientId: doc.id, ...doc.data() };
                
                // فك تشفير البيانات الحساسة
                const decryptedData = await EncryptionUtils.decryptObject({
                    name: patientData.name,
                    phone: patientData.phone
                });
                
                return { ...patientData, ...decryptedData };
            }
            return null;
        } catch (error) {
            console.error('❌ Error getting patient by phone:', error);
            throw error;
        }
    },

    // تحديث بيانات المريض
    async updatePatient(patientId, updateData) {
        try {
            await db.collection('patients').doc(patientId).set({
                ...updateData,
                updatedAt: firebase.firestore.FieldValue.serverTimestamp()
            }, { merge: true });
            console.log('✅ Patient updated:', patientId);
            return true;
        } catch (error) {
            console.error('❌ Error updating patient:', error);
            throw error;
        }
    },

    // حفظ التشخيص
    async saveAssessment(assessmentData) {
        try {
            const assessmentRef = await db.collection('assessments').add({
                ...assessmentData,
                createdAt: firebase.firestore.FieldValue.serverTimestamp()
            });
            console.log('✅ Assessment saved with ID:', assessmentRef.id);
            return { assessmentId: assessmentRef.id, ...assessmentData };
        } catch (error) {
            console.error('❌ Error saving assessment:', error);
            throw error;
        }
    },

    // الحصول على جميع تشخيصات المريض
    async getPatientAssessments(patientId) {
        try {
            if (!patientId) {
                console.error('❌ patientId is undefined in getPatientAssessments');
                return [];
            }
            
            const snapshot = await db.collection('assessments')
                .where('patientId', '==', patientId)
                .get();
            
            const assessments = [];
            snapshot.forEach(doc => {
                assessments.push({ assessmentId: doc.id, ...doc.data() });
            });
            
            // ترتيب حسب createdAt في الكود بدلاً من orderBy
            assessments.sort((a, b) => {
                const dateA = a.createdAt ? new Date(a.createdAt) : new Date(0);
                const dateB = b.createdAt ? new Date(b.createdAt) : new Date(0);
                return dateB - dateA;
            });
            
            return assessments;
        } catch (error) {
            console.error('❌ Error getting patient assessments:', error);
            throw error;
        }
    },

    // الحصول على آخر تشخيص للمريض
    async getLatestAssessment(patientId) {
        try {
            const assessments = await this.getPatientAssessments(patientId);
            return assessments.length > 0 ? assessments[0] : null;
        } catch (error) {
            console.error('❌ Error getting latest assessment:', error);
            throw error;
        }
    },

    // حفظ السجل اليومي
    async saveDailyLog(logData) {
        try {
            const logRef = await db.collection('dailyLogs').add({
                ...logData,
                createdAt: firebase.firestore.FieldValue.serverTimestamp()
            });
            console.log('✅ Daily log saved with ID:', logRef.id);
            return { logId: logRef.id, ...logData };
        } catch (error) {
            console.error('❌ Error saving daily log:', error);
            throw error;
        }
    },

    // الحصول على جميع السجلات اليومية للمريض
    async getPatientDailyLogs(patientId) {
        try {
            if (!patientId) {
                console.error('❌ patientId is undefined in getPatientDailyLogs');
                return [];
            }
            
            const snapshot = await db.collection('dailyLogs')
                .where('patientId', '==', patientId)
                .get();
            
            const logs = [];
            snapshot.forEach(doc => {
                logs.push({ logId: doc.id, ...doc.data() });
            });
            
            // ترتيب حسب date في الكود بدلاً من orderBy
            logs.sort((a, b) => {
                const dateA = a.date || '';
                const dateB = b.date || '';
                return dateB.localeCompare(dateA);
            });
            
            return logs;
        } catch (error) {
            console.error('❌ Error getting patient daily logs:', error);
            throw error;
        }
    },

    // الحصول على آخر سجل يومي
    async getLatestDailyLog(patientId) {
        try {
            const logs = await this.getPatientDailyLogs(patientId);
            return logs.length > 0 ? logs[0] : null;
        } catch (error) {
            console.error('❌ Error getting latest daily log:', error);
            throw error;
        }
    },

    // الحصول على سجل يومي محدد حسب التاريخ
    async getDailyLog(patientId, date) {
        try {
            const logs = await this.getPatientDailyLogs(patientId);
            return logs.find(log => log.date === date) || null;
        } catch (error) {
            console.error('❌ Error getting daily log:', error);
            throw error;
        }
    },

    // تحديث تقدم التعافي
    async updateRecoveryProgress(patientId, progressData) {
        try {
            await db.collection('patients').doc(patientId).update({
                recoveryProgress: progressData,
                lastProgressUpdate: new Date().toISOString()
            });
            console.log('✅ Recovery progress updated:', patientId);
        } catch (error) {
            console.error('❌ Error updating recovery progress:', error);
            throw error;
        }
    },

    // الحصول على جميع المرضى (للإدارة)
    async getAllPatients() {
        try {
            const snapshot = await db.collection('patients')
                .orderBy('createdAt', 'desc')
                .get();
            
            const patients = [];
            snapshot.forEach(doc => {
                patients.push({ patientId: doc.id, ...doc.data() });
            });
            return patients;
        } catch (error) {
            console.error('❌ Error getting all patients:', error);
            throw error;
        }
    },

    // حذف مريض
    async deletePatient(patientId) {
        try {
            if (!patientId) {
                console.error('❌ patientId is undefined in deletePatient');
                return;
            }
            
            // حذف المريض
            await db.collection('patients').doc(patientId).delete();
            
            // حذف جميع التشخيصات
            const assessmentsSnapshot = await db.collection('assessments')
                .where('patientId', '==', patientId)
                .get();
            
            const batch = db.batch();
            assessmentsSnapshot.forEach(doc => {
                batch.delete(doc.ref);
            });
            await batch.commit();
            
            // حذف جميع السجلات اليومية
            const logsSnapshot = await db.collection('dailyLogs')
                .where('patientId', '==', patientId)
                .get();
            
            const batch2 = db.batch();
            logsSnapshot.forEach(doc => {
                batch2.delete(doc.ref);
            });
            await batch2.commit();
            
            console.log('✅ Patient deleted:', patientId);
            return true;
        } catch (error) {
            console.error('❌ Error deleting patient:', error);
            throw error;
        }
    },

    // الحصول على المريض الحالي من localStorage
    async getCurrentPatient() {
        const patientId = localStorage.getItem('currentPatientId');
        if (patientId) {
            return await this.getPatient(patientId);
        }
        return null;
    },

    // تحديث ملف المريض
    async updatePatientProfile(patientId, profileData) {
        return await this.updatePatient(patientId, profileData);
    },

    // الحصول على تقدم التعافي
    async getRecoveryProgress(patientId) {
        try {
            const logs = await this.getPatientDailyLogs(patientId);
            if (logs.length === 0) return null;

            const firstLog = logs[logs.length - 1];
            const lastLog = logs[0];
            
            const improvement = firstLog.pain_score - lastLog.pain_score;
            const percentage = (improvement / firstLog.pain_score) * 100;
            
            return {
                totalLogs: logs.length,
                firstPainScore: firstLog.pain_score,
                lastPainScore: lastLog.pain_score,
                improvement: improvement,
                percentage: Math.max(0, Math.min(100, percentage))
            };
        } catch (error) {
            console.error('❌ Error getting recovery progress:', error);
            return null;
        }
    },

    // تسجيل الدخول
    async login(phoneNumber, countryCode = 'jo', name = '') {
        try {
            // التحقق من رقم الهاتف
            const validation = validatePhoneNumber(phoneNumber, countryCode);
            if (!validation.valid) {
                throw new Error(validation.message);
            }
            
            const cleanedPhone = phoneNumber.replace(/[\s\-\(\)]/g, '');
            const patientId = `${countryCode}_${cleanedPhone}`;
            
            let patient = await this.getPatientByPhone(cleanedPhone);
            
            if (!patient) {
                // إنشاء مريض جديد
                patient = await this.createPatient({
                    patientId: patientId,
                    phone: cleanedPhone,
                    countryCode: countryCode,
                    name: name || '',
                    createdAt: new Date().toISOString(),
                    lastVisit: new Date().toISOString()
                });
                console.log('🆕 تم إنشاء مريض جديد:', patient);
            } else {
                // تحديث آخر زيارة والاسم إذا تم توفيره
                const updateData = { lastVisit: new Date().toISOString() };
                if (name) {
                    updateData.name = name;
                }
                await this.updatePatient(patient.patientId, updateData);
                console.log('✅ تم العثور على مريض موجود:', patient);
            }
            
            // حفظ الجلسة
            localStorage.setItem('currentPatientId', patient.patientId);
            localStorage.setItem('currentPatientPhone', cleanedPhone);
            localStorage.setItem('currentPatientCountry', countryCode);
            
            return patient;
        } catch (error) {
            console.error('❌ Error in login:', error);
            throw error;
        }
    },

    // تسجيل الخروج
    logout() {
        localStorage.removeItem('currentPatientId');
        localStorage.removeItem('currentPatientPhone');
        localStorage.removeItem('currentPatientCountry');
    },

    // تنسيق التاريخ
    formatDate(dateString) {
        if (!dateString) return 'غير محدد';
        const date = new Date(dateString);
        return date.toLocaleDateString('ar-SA', {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
    },

    // حساب مؤشر التعافي
    async calculateRecoveryScore(patientId) {
        try {
            const logs = await this.getPatientDailyLogs(patientId);
            
            if (logs.length === 0) return 0;
            
            // حساب تحسن الألم
            const firstPainScore = logs[logs.length - 1].pain_score;
            const lastPainScore = logs[0].pain_score;
            const painImprovement = firstPainScore - lastPainScore;
            const painScore = Math.min(100, Math.max(0, (painImprovement / firstPainScore) * 100));
            
            // حساب الالتزام بالتمارين
            const exerciseCompliance = (logs.filter(log => log.exercise_completed).length / logs.length) * 100;
            
            // حساب تحسن الحركة
            const movementImprovement = logs[0].movement_score - logs[logs.length - 1].movement_score;
            const movementScore = Math.min(100, Math.max(0, (movementImprovement / 10) * 100));
            
            // حساب النتيجة النهائية
            const recoveryScore = (painScore * 0.4) + (exerciseCompliance * 0.3) + (movementScore * 0.3);
            
            return Math.round(recoveryScore);
        } catch (error) {
            console.error('❌ Error calculating recovery score:', error);
            return 0;
        }
    },

    // الحصول على جميع البيانات (للإدارة)
    async getAllData(collectionName) {
        try {
            const snapshot = await db.collection(collectionName).get();
            const data = [];
            snapshot.forEach(doc => {
                data.push({ id: doc.id, ...doc.data() });
            });
            return data;
        } catch (error) {
            console.error('❌ Error getting all data:', error);
            return [];
        }
    },

    // استعلام محسّن: الحصول على المرضى الذين وافقوا على خطة التعافي
    async getPatientsWithRecoveryPlan() {
        try {
            const snapshot = await db.collection('patients')
                .where('acceptedRecoveryPlan', '==', true)
                .get();
            const data = [];
            snapshot.forEach(doc => {
                data.push({ id: doc.id, ...doc.data() });
            });
            return data;
        } catch (error) {
            console.error('❌ Error getting patients with recovery plan:', error);
            return [];
        }
    },

    // استعلام محسّن: البحث عن المرضى بالاسم أو الهاتف
    async searchPatients(searchTerm) {
        try {
            const snapshot = await db.collection('patients').get();
            const data = [];
            snapshot.forEach(doc => {
                const patient = { id: doc.id, ...doc.data() };
                const name = (patient.name || '').toLowerCase();
                const phone = (patient.phone || '').toLowerCase();
                if (name.includes(searchTerm.toLowerCase()) || phone.includes(searchTerm.toLowerCase())) {
                    data.push(patient);
                }
            });
            return data;
        } catch (error) {
            console.error('❌ Error searching patients:', error);
            return [];
        }
    },

    // استعلام محسّن: الحصول على المرضى الذين زاروا مؤخراً
    async getRecentPatients(days = 7) {
        try {
            const cutoffDate = new Date();
            cutoffDate.setDate(cutoffDate.getDate() - days);
            
            const snapshot = await db.collection('patients')
                .where('lastVisit', '>=', cutoffDate.toISOString())
                .orderBy('lastVisit', 'desc')
                .get();
            const data = [];
            snapshot.forEach(doc => {
                data.push({ id: doc.id, ...doc.data() });
            });
            return data;
        } catch (error) {
            console.error('❌ Error getting recent patients:', error);
            return [];
        }
    }
};

console.log('✅ Firebase DB initialized');
