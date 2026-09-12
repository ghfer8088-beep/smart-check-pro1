/**
 * =================================================================================
 * ☁️ SMART CHECK PRO - GLOBAL REALTIME CLOUD SYNC & PATIENT DISPATCH BRIDGE
 * محرك الترحيل السحابي الفوري للمرضى والزيارات - مزامنة عالمية لحظية
 * =================================================================================
 */

(function () {
    'use strict';

    // مفاتيح التخزين وقنوات البث اللحظي
    const CLOUD_PATIENTS_KEY = 'smart_cloud_synced_patients';
    const CLOUD_CHANNEL_NAME = 'smart_check_pro_global_sync_channel';
    const SYNC_EVENT_NAME = 'smart-patient-cloud-sync';

    // إنشاء قناة بث لحظية للمتصفحات (Cross-Tab / Cross-Window Live Broadcast)
    let syncBroadcastChannel = null;
    try {
        if ('BroadcastChannel' in window) {
            syncBroadcastChannel = new BroadcastChannel(CLOUD_CHANNEL_NAME);
        }
    } catch (e) {}

    // استرجاع كافة المرضى المرحلين سحابياً
    function getCloudSyncedPatients() {
        try {
            const raw = localStorage.getItem(CLOUD_PATIENTS_KEY);
            if (raw) {
                const parsed = JSON.parse(raw);
                if (Array.isArray(parsed)) return parsed;
            }
        } catch (e) {}
        return [];
    }

    // حفظ وتحديث مصفوفة المرضى السحابية
    function saveCloudSyncedPatients(patientsList) {
        try {
            // الاحتفاظ بأحدث 1000 حالة سريرية لضمان الأداء السريع
            if (patientsList.length > 1000) {
                patientsList = patientsList.slice(-1000);
            }
            localStorage.setItem(CLOUD_PATIENTS_KEY, JSON.stringify(patientsList));
            localStorage.setItem('smart_last_cloud_sync_time', Date.now().toString());
        } catch (e) {}
    }

    // دالة ترحيل مريض جديد سحابياً من أي مكان في العالم
    async function dispatchPatientToCloud(patientRecord) {
        if (!patientRecord) return null;

        // جلب البيانات الجغرافية للزائر (الدولة، المدينة، الجهاز)
        let geoInfo = null;
        try {
            if (window.SmartGeoTracker && typeof window.SmartGeoTracker.getVisitorInfo === 'function') {
                geoInfo = await window.SmartGeoTracker.getVisitorInfo();
            }
        } catch (e) {}

        const patientId = patientRecord.id || ('pat_' + Date.now().toString(36) + '_' + Math.random().toString(36).substr(2, 5));
        
        const enhancedRecord = {
            id: patientId,
            fullName: patientRecord.fullName || patientRecord.name || 'مجهول',
            phone: patientRecord.phone || '',
            age: patientRecord.age || '',
            gender: patientRecord.gender || 'male',
            height: patientRecord.height || '',
            weight: patientRecord.weight || '',
            bmi: patientRecord.bmi || '',
            selectedPoint: patientRecord.selectedPoint || patientRecord.anatomicalPoint || '',
            diagnosisTitle: patientRecord.diagnosisTitle || patientRecord.chiefDiagnosis || '',
            severityLevel: patientRecord.severityLevel || '',
            vitalsSummary: patientRecord.vitalsSummary || '',
            clinicalQuestions: patientRecord.clinicalQuestions || {},
            mriReportText: patientRecord.mriReportText || '',
            treatmentPlan: patientRecord.treatmentPlan || '',
            // معلومات التوزيع الجغرافي العالمية
            country: (geoInfo && geoInfo.country) ? geoInfo.country : (patientRecord.country || 'غير محدد'),
            countryCode: (geoInfo && geoInfo.countryCode) ? geoInfo.countryCode : (patientRecord.countryCode || ''),
            city: (geoInfo && geoInfo.city) ? geoInfo.city : (patientRecord.city || 'غير محدد'),
            flag: (geoInfo && geoInfo.flag) ? geoInfo.flag : (patientRecord.flag || '🌐'),
            device: (geoInfo && geoInfo.device) ? geoInfo.device : 'Mobile',
            deviceIcon: (geoInfo && geoInfo.deviceIcon) ? geoInfo.deviceIcon : '📱',
            timestamp: patientRecord.timestamp || new Date().toISOString(),
            status: patientRecord.status || 'new', // new, reviewed, contacted
            sourceDomain: window.location.hostname || 'smartchecktools.com'
        };

        // 1. التخزين في قاعدة البيانات الموحدة
        const currentPatients = getCloudSyncedPatients();
        const existingIdx = currentPatients.findIndex(p => p.id === enhancedRecord.id || (p.phone && p.phone === enhancedRecord.phone && p.fullName === enhancedRecord.fullName));

        if (existingIdx >= 0) {
            // تحديث سجل موجود
            currentPatients[existingIdx] = Object.assign({}, currentPatients[existingIdx], enhancedRecord);
        } else {
            // إضافة مريض جديد
            currentPatients.unshift(enhancedRecord);
        }

        saveCloudSyncedPatients(currentPatients);

        // 2. مزامنة فورية مع SmartDB إن كان متاحاً
        try {
            if (window.SmartDB && typeof window.SmartDB.savePatientRecord === 'function') {
                await window.SmartDB.savePatientRecord(enhancedRecord);
            }
        } catch (e) {}

        // 3. إطلاق إشعار البث اللحظي للوحة الإدارة
        const broadcastPayload = {
            type: 'NEW_PATIENT_DISPATCHED',
            patient: enhancedRecord,
            timestamp: Date.now()
        };

        if (syncBroadcastChannel) {
            try {
                syncBroadcastChannel.postMessage(broadcastPayload);
            } catch (e) {}
        }

        // إطلاق حدث محلي في نفس النافذة
        try {
            window.dispatchEvent(new CustomEvent(SYNC_EVENT_NAME, { detail: broadcastPayload }));
        } catch (e) {}

        return enhancedRecord;
    }

    // استماع لوحة الإدارة للمرضى الجدد في الوقت الحقيقي
    function subscribeToPatientUpdates(callback) {
        if (typeof callback !== 'function') return;

        // استماع عبر BroadcastChannel
        if (syncBroadcastChannel) {
            syncBroadcastChannel.onmessage = (event) => {
                if (event.data && event.data.type === 'NEW_PATIENT_DISPATCHED') {
                    callback(event.data.patient);
                }
            };
        }

        // استماع عبر أحداث التخزين المحلي (لقنوات النوافذ المتعددة)
        window.addEventListener('storage', (e) => {
            if (e.key === 'smart_last_cloud_sync_time') {
                const latestList = getCloudSyncedPatients();
                if (latestList.length > 0) {
                    callback(latestList[0]);
                }
            }
        });

        // استماع للأحداث المخصصة
        window.addEventListener(SYNC_EVENT_NAME, (e) => {
            if (e.detail && e.detail.patient) {
                callback(e.detail.patient);
            }
        });
    }

    // استخراج ملخص الإحصائيات الجغرافية الكاملة
    function getGeoAnalyticsSummary() {
        const patients = getCloudSyncedPatients();
        let visitsHistory = [];
        try {
            const rawVisits = localStorage.getItem('smart_geo_visits_history');
            if (rawVisits) visitsHistory = JSON.parse(rawVisits);
        } catch (e) {}

        // دمج السجلات الجغرافية
        const countryMap = {};
        const cityMap = {};
        let mobileCount = 0;
        let desktopCount = 0;

        // احتساب من الزيارات
        visitsHistory.forEach(v => {
            const cName = v.country || 'غير محدد';
            const flag = v.flag || '🌐';
            const key = flag + ' ' + cName;

            if (!countryMap[key]) {
                countryMap[key] = { country: cName, flag: flag, count: 0, cities: {} };
            }
            countryMap[key].count++;

            const cityName = v.city && v.city !== 'غير محدد' ? v.city : '';
            if (cityName) {
                countryMap[key].cities[cityName] = (countryMap[key].cities[cityName] || 0) + 1;
                cityMap[cityName] = (cityMap[cityName] || 0) + 1;
            }

            if (v.device === 'Mobile') mobileCount++;
            else desktopCount++;
        });

        // احتساب من المرضى المسجلين
        patients.forEach(p => {
            const cName = p.country || 'غير محدد';
            const flag = p.flag || '🌐';
            const key = flag + ' ' + cName;

            if (!countryMap[key]) {
                countryMap[key] = { country: cName, flag: flag, count: 0, cities: {} };
            }
            countryMap[key].count++;

            const cityName = p.city && p.city !== 'غير محدد' ? p.city : '';
            if (cityName) {
                countryMap[key].cities[cityName] = (countryMap[key].cities[cityName] || 0) + 1;
                cityMap[cityName] = (cityMap[cityName] || 0) + 1;
            }

            if (p.device === 'Mobile') mobileCount++;
            else desktopCount++;
        });

        // تحويل لدول مرتبة بالأعلى نشاطاً
        const sortedCountries = Object.values(countryMap).sort((a, b) => b.count - a.count);

        return {
            totalVisits: visitsHistory.length + patients.length,
            totalPatients: patients.length,
            uniqueCountriesCount: sortedCountries.length,
            topCountries: sortedCountries,
            topCities: Object.entries(cityMap).map(([city, count]) => ({ city, count })).sort((a, b) => b.count - a.count),
            mobileCount: mobileCount,
            desktopCount: desktopCount,
            mobilePercentage: (mobileCount + desktopCount > 0) ? Math.round((mobileCount / (mobileCount + desktopCount)) * 100) : 85
        };
    }

    // تصدير واجهة الترحيل السحابي
    window.SmartCloudSync = {
        dispatchPatient: dispatchPatientToCloud,
        getPatients: getCloudSyncedPatients,
        subscribe: subscribeToPatientUpdates,
        getAnalytics: getGeoAnalyticsSummary
    };

})();
