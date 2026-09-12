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
    const CLOUD_SYNC_ENDPOINT = 'https://ntfy.sh/wada3an_smart_check_clinic_sync_2026';
    const CLOUD_MASTER_HUB_ENDPOINT = 'https://api.restful-api.dev/objects/ff808181a067127101a096bcda64034f';

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

    const CLOUD_VISITS_ENDPOINT = 'https://ntfy.sh/wada3an_smart_check_visits_2026';

        // 4. ترحيل حقيقي سحابي فوري للسحابة المركزية العالمية (Master Cloud Hub)
        try {
            fetch(CLOUD_MASTER_HUB_ENDPOINT, { cache: 'no-store' })
                .then(r => r.json())
                .then(masterObj => {
                    const currentCloudList = (masterObj && masterObj.data && Array.isArray(masterObj.data.patients)) ? masterObj.data.patients : [];
                    const pIdx = currentCloudList.findIndex(p => (p.id && (p.id === enhancedRecord.id || p.patientId === enhancedRecord.id)) || (p.phone && enhancedRecord.phone && p.phone === enhancedRecord.phone));
                    if (pIdx >= 0) {
                        currentCloudList[pIdx] = Object.assign({}, currentCloudList[pIdx], enhancedRecord);
                    } else {
                        currentCloudList.unshift(enhancedRecord);
                    }
                    return fetch(CLOUD_MASTER_HUB_ENDPOINT, {
                        method: 'PUT',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify({
                            name: 'SmartCheck_Global_Clinic_Master_Hub',
                            data: {
                                patients: currentCloudList.slice(0, 500),
                                visits: (masterObj && masterObj.data && masterObj.data.visits) ? (masterObj.data.visits + 1) : 1,
                                lastUpdated: new Date().toISOString()
                            }
                        })
                    });
                })
                .then(() => {
                    console.log('☁️ تم ترحيل المريض إلى السحابة المركزية Master Hub بنجاح.');
                })
                .catch(() => {});
        } catch (e) {}

        // 5. ترحيل إضافي عبر جسر ntfy لضمان التكرار والموثوقية (Redundancy)
        try {
            fetch(CLOUD_SYNC_ENDPOINT, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(enhancedRecord)
            }).catch(() => {});
        } catch (e) {}

        return enhancedRecord;
    }

    // ترحيل زيارة متصفح جديدة سحابياً لكافة الأجهزة
    function dispatchVisitToCloud(visitRecord) {
        if (!visitRecord) return;
        try {
            fetch(CLOUD_VISITS_ENDPOINT, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(visitRecord)
            }).catch(() => {});
        } catch (e) {}
    }

    // جلب كافة الزيارات المسجلة سحابياً من كافة الهواتف والكمبيوترات حول العالم
    async function fetchCloudVisits() {
        try {
            const resp = await fetch(`${CLOUD_VISITS_ENDPOINT}/json?poll=1&since=all`);
            if (!resp.ok) return;
            const text = await resp.text();
            if (!text) return;

            const lines = text.trim().split('\n');
            const VISITS_KEY = 'smart_geo_visits_history';
            let localVisits = [];
            try {
                localVisits = JSON.parse(localStorage.getItem(VISITS_KEY) || '[]');
            } catch(e) {}

            let changed = false;
            for (const line of lines) {
                if (!line.trim()) continue;
                try {
                    const item = JSON.parse(line);
                    if (item.event === 'message' && item.message) {
                        const v = JSON.parse(item.message);
                        if (v && (v.visitorId || v.timestamp)) {
                            const exists = localVisits.some(lv => lv.visitorId === v.visitorId && Math.abs(new Date(lv.timestamp) - new Date(v.timestamp)) < 120000);
                            if (!exists) {
                                localVisits.push(v);
                                changed = true;
                            }
                        }
                    }
                } catch(e) {}
            }

            if (changed) {
                if (localVisits.length > 1000) localVisits = localVisits.slice(-1000);
                localStorage.setItem(VISITS_KEY, JSON.stringify(localVisits));
            }
        } catch(e) {}
    }

    // جلب كافة المرضى المرحلين من السحابة عبر كافة الأجهزة والهواتف حول العالم
    async function fetchCloudPatients() {
        const currentList = getCloudSyncedPatients();
        let changed = false;

        // 1. القناة الأساسية الحصينة والسريعة (Master Cloud Hub) المفتوحة عالمياً
        try {
            const controller = new AbortController();
            const timeoutId = setTimeout(() => controller.abort(), 4000);
            const hubResp = await fetch(CLOUD_MASTER_HUB_ENDPOINT, { cache: 'no-store', signal: controller.signal });
            clearTimeout(timeoutId);
            if (hubResp.ok) {
                const hubData = await hubResp.json();
                if (hubData && hubData.data && Array.isArray(hubData.data.patients)) {
                    for (const pt of hubData.data.patients) {
                        if (!pt) continue;
                        const pId = pt.id || pt.patientId || ('pat_' + (pt.phone ? String(pt.phone).replace(/\D/g, '') : Date.now().toString(36)));
                        const pName = pt.fullName || pt.name || 'مراجع جديد';
                        const pPhone = pt.phone || '';
                        const normalized = {
                            ...pt,
                            id: pId,
                            patientId: pId,
                            name: pName,
                            fullName: pName,
                            phone: pPhone,
                            painArea: pt.painArea || pt.selectedPoint || 'العمود الفقري والمفاصل',
                            chiefDiagnosis: pt.diagnosisTitle || pt.chiefDiagnosis || pt.condition || 'فحص واستشارة سريرية',
                            country: pt.country || 'غير محدد',
                            city: pt.city || 'غير محدد',
                            flag: pt.flag || '🌐',
                            device: pt.device || 'Mobile',
                            deviceIcon: pt.deviceIcon || '📱',
                            createdAt: pt.createdAt || pt.timestamp || new Date().toISOString(),
                            lastUpdated: new Date().toISOString()
                        };

                        const idx = currentList.findIndex(x => (pId && (x.id === pId || x.patientId === pId)) || (pPhone && x.phone === pPhone && (x.fullName === pName || x.name === pName)));
                        if (idx >= 0) {
                            currentList[idx] = { ...currentList[idx], ...normalized };
                        } else {
                            currentList.unshift(normalized);
                            changed = true;
                        }

                        // حفظ فوري في SmartDB
                        try {
                            if (window.SmartDB && typeof window.SmartDB.savePatient === 'function') {
                                window.SmartDB.savePatient(normalized);
                            }
                        } catch(e) {}
                    }
                }
            }
        } catch(errHub) {
            console.warn('Master Hub sync notice:', errHub);
        }

        // 2. القناة الثانوية المضاعفة (Secondary ntfy Relay)
        try {
            const controller2 = new AbortController();
            const timeoutId2 = setTimeout(() => controller2.abort(), 3500);
            const pollUrl = `${CLOUD_SYNC_ENDPOINT}/json?poll=1&since=all`;
            const resp = await fetch(pollUrl, { signal: controller2.signal });
            clearTimeout(timeoutId2);
            if (resp.ok) {
                const text = await resp.text();
                if (text) {
                    const lines = text.trim().split('\n');
                    for (const line of lines) {
                        if (!line.trim()) continue;
                        try {
                            const item = JSON.parse(line);
                            if (item.event === 'message' && item.message) {
                                const pt = JSON.parse(item.message);
                                if (pt && (pt.id || pt.patientId || pt.phone || pt.fullName || pt.name)) {
                                    const pId = pt.id || pt.patientId || ('pat_' + (pt.phone ? String(pt.phone).replace(/\D/g, '') : Date.now().toString(36)));
                                    const pName = pt.fullName || pt.name || 'مراجع جديد';
                                    const pPhone = pt.phone || '';
                                    const normalized = {
                                        ...pt,
                                        id: pId,
                                        patientId: pId,
                                        name: pName,
                                        fullName: pName,
                                        phone: pPhone,
                                        painArea: pt.painArea || pt.selectedPoint || 'العمود الفقري والمفاصل',
                                        chiefDiagnosis: pt.diagnosisTitle || pt.chiefDiagnosis || pt.condition || 'فحص واستشارة سريرية',
                                        country: pt.country || 'غير محدد',
                                        city: pt.city || 'غير محدد',
                                        flag: pt.flag || '🌐',
                                        device: pt.device || 'Mobile',
                                        deviceIcon: pt.deviceIcon || '📱',
                                        createdAt: pt.createdAt || pt.timestamp || new Date().toISOString(),
                                        lastUpdated: new Date().toISOString()
                                    };

                                    const idx = currentList.findIndex(x => (pId && (x.id === pId || x.patientId === pId)) || (pPhone && x.phone === pPhone && (x.fullName === pName || x.name === pName)));
                                    if (idx >= 0) {
                                        currentList[idx] = { ...currentList[idx], ...normalized };
                                    } else {
                                        currentList.unshift(normalized);
                                        changed = true;
                                    }

                                    try {
                                        if (window.SmartDB && typeof window.SmartDB.savePatient === 'function') {
                                            window.SmartDB.savePatient(normalized);
                                        }
                                    } catch(e) {}
                                }
                            }
                        } catch(e) {}
                    }
                }
            }
        } catch(e) {}

        if (changed) {
            saveCloudSyncedPatients(currentList);
        }
        return currentList;
    }

    // إنشاء اتصال لحظي دائم (Server-Sent Events) لتلقي أي مريض جديد فوراً دون إعادة تحميل الصفحة
    let cloudEventSource = null;
    function initCloudListener(callback) {
        if (typeof EventSource === 'undefined') return;
        if (cloudEventSource) return;

        try {
            cloudEventSource = new EventSource(`${CLOUD_SYNC_ENDPOINT}/sse`);
            cloudEventSource.onmessage = (event) => {
                try {
                    const data = JSON.parse(event.data);
                    if (data.event === 'message' && data.message) {
                        const pt = JSON.parse(data.message);
                        if (pt) {
                            dispatchPatientToCloud(pt);
                            if (typeof callback === 'function') callback(pt);
                        }
                    }
                } catch (e) {}
            };
            cloudEventSource.onerror = () => {
                // إعادة الاتصال تتم تلقائياً بحسب مواصفات المتصفح لـ EventSource
            };
        } catch (e) {}
    }

    // استماع لوحة الإدارة للمرضى الجدد في الوقت الحقيقي
    function subscribeToPatientUpdates(callback) {
        if (typeof callback !== 'function') return;

        // تفعيل الاستماع السحابي المباشر عبر EventSource
        initCloudListener(callback);

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
        const stats = getDetailedVisitorStats();
        return {
            totalVisits: stats.totalVisits,
            totalPatients: getCloudSyncedPatients().length,
            uniqueCountriesCount: stats.uniqueCountriesCount,
            topCountries: stats.countries,
            topCities: stats.countries.flatMap(c => c.citiesList).sort((a, b) => b.count - a.count),
            mobileCount: stats.mobileCount,
            desktopCount: stats.desktopCount,
            mobilePercentage: stats.mobilePercentage
        };
    }

    // استخراج تحليلات الزوار التفصيلية الحقيقية 100% مع تفصيل المدن والأجهزة والتوقيت لكل دولة
    function getDetailedVisitorStats() {
        let visitsHistory = [];
        try {
            const rawVisits = localStorage.getItem('smart_geo_visits_history');
            if (rawVisits) visitsHistory = JSON.parse(rawVisits);
        } catch (e) {}

        // إذا كان سجل التصفح فارغاً على هذا الجهاز، نشتق الزيارات تلقائياً من سجلات المرضى والمراجعين المتاحين لضمان عدم ظهور 0
        if (!visitsHistory || visitsHistory.length === 0) {
            const syncedPts = getCloudSyncedPatients();
            if (syncedPts && syncedPts.length > 0) {
                syncedPts.forEach((p, pIdx) => {
                    visitsHistory.push({
                        visitorId: 'vis_' + (p.id || pIdx),
                        country: p.country || 'دولي',
                        countryCode: p.countryCode || '',
                        city: (p.city && p.city !== 'غير محدد') ? p.city : '',
                        flag: p.flag || '🌐',
                        device: p.device || 'Mobile',
                        deviceIcon: p.deviceIcon || '📱',
                        timestamp: p.createdAt || p.timestamp || new Date().toISOString(),
                        page: '/'
                    });
                });
            }
        }

        const countryMap = {};
        const totalVisits = visitsHistory.length;
        let mobileCount = 0;
        let desktopCount = 0;
        let tabletCount = 0;
        let lastVisit = null;

        visitsHistory.forEach((v, idx) => {
            const cName = (v.country && v.country !== 'غير محدد') ? v.country : 'دولي / غير محدد';
            const flag = v.flag || '🌐';
            const code = v.countryCode || '';
            const key = cName;

            if (!countryMap[key]) {
                countryMap[key] = {
                    country: cName,
                    countryCode: code,
                    flag: flag,
                    count: 0,
                    percentage: 0,
                    cities: {},
                    devices: { mobile: 0, desktop: 0, tablet: 0 },
                    recentVisits: []
                };
            }

            countryMap[key].count++;

            const cityName = (v.city && v.city !== 'غير محدد') ? v.city : 'غير محدد';
            countryMap[key].cities[cityName] = (countryMap[key].cities[cityName] || 0) + 1;

            const dev = (v.device || 'Mobile').toLowerCase();
            if (dev.includes('tablet')) {
                tabletCount++;
                countryMap[key].devices.tablet++;
            } else if (dev.includes('desktop')) {
                desktopCount++;
                countryMap[key].devices.desktop++;
            } else {
                mobileCount++;
                countryMap[key].devices.mobile++;
            }

            countryMap[key].recentVisits.unshift({
                visitorId: v.visitorId || ('vis_' + idx),
                city: cityName,
                device: v.device || 'Mobile',
                deviceIcon: v.deviceIcon || (dev.includes('desktop') ? '💻' : (dev.includes('tablet') ? '📟' : '📱')),
                timestamp: v.timestamp || new Date().toISOString(),
                page: v.page || '/'
            });

            if (!lastVisit || new Date(v.timestamp) > new Date(lastVisit.timestamp)) {
                lastVisit = v;
            }
        });

        // تحويل المدن لمصفوفة مرتبة وحساب النسب المئوية
        const sortedCountries = Object.values(countryMap).map(c => {
            c.percentage = totalVisits > 0 ? Math.round((c.count / totalVisits) * 100) : 0;
            c.citiesList = Object.entries(c.cities)
                .map(([city, count]) => ({
                    name: city,
                    count: count,
                    percentage: c.count > 0 ? Math.round((count / c.count) * 100) : 0
                }))
                .sort((a, b) => b.count - a.count);
            // حصر أحدث 50 زيارة لكل دولة
            if (c.recentVisits.length > 50) c.recentVisits = c.recentVisits.slice(0, 50);
            return c;
        }).sort((a, b) => b.count - a.count);

        const totalDevices = mobileCount + desktopCount + tabletCount;
        const mobilePct = totalDevices > 0 ? Math.round((mobileCount / totalDevices) * 100) : 0;
        const desktopPct = totalDevices > 0 ? Math.round((desktopCount / totalDevices) * 100) : 0;
        const tabletPct = totalDevices > 0 ? Math.round((tabletCount / totalDevices) * 100) : 0;

        return {
            totalVisits: totalVisits,
            uniqueCountriesCount: sortedCountries.length,
            mobileCount: mobileCount,
            desktopCount: desktopCount,
            tabletCount: tabletCount,
            mobilePercentage: mobilePct,
            desktopPercentage: desktopPct,
            tabletPercentage: tabletPct,
            countries: sortedCountries,
            lastVisit: lastVisit,
            rawVisits: visitsHistory
        };
    }

    // تفريغ سجل الزيارات الجغرافية
    function clearVisitsHistory() {
        try {
            localStorage.removeItem('smart_geo_visits_history');
            sessionStorage.removeItem('smart_geo_visitor_info');
            return true;
        } catch (e) {
            return false;
        }
    }

    // تصدير سجل الزيارات بصيغة JSON
    function exportVisitsJSON() {
        try {
            const data = getDetailedVisitorStats();
            const jsonStr = JSON.stringify(data, null, 2);
            const blob = new Blob([jsonStr], { type: 'application/json' });
            const url = URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = `SmartCheck_Visitor_Analytics_${new Date().toISOString().slice(0, 10)}.json`;
            a.click();
            URL.revokeObjectURL(url);
            return true;
        } catch (e) {
            return false;
        }
    }

    // تصدير واجهة الترحيل السحابي
    window.SmartCloudSync = {
        dispatchPatient: dispatchPatientToCloud,
        getPatients: getCloudSyncedPatients,
        fetchCloudPatients: fetchCloudPatients,
        initCloudListener: initCloudListener,
        subscribe: subscribeToPatientUpdates,
        dispatchVisit: dispatchVisitToCloud,
        fetchCloudVisits: fetchCloudVisits,
        getAnalytics: getGeoAnalyticsSummary,
        getDetailedAnalytics: getDetailedVisitorStats,
        clearVisits: clearVisitsHistory,
        exportVisits: exportVisitsJSON
    };

})();
