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
    const CLOUD_VISITS_ENDPOINT = 'https://ntfy.sh/wada3an_smart_check_visits_2026';
    const CLOUD_TIMING_ENDPOINT = 'https://ntfy.sh/wada3an_smart_check_timing_sync_2026';
    const CLOUD_MASTER_HUB_ENDPOINT = 'https://api.restful-api.dev/objects/ff808181a067127101a096bcda64034f';

    // إنشاء قناة بث لحظية للمتصفحات (Cross-Tab / Cross-Window Live Broadcast)
    let syncBroadcastChannel = null;
    try {
        if ('BroadcastChannel' in window) {
            syncBroadcastChannel = new BroadcastChannel(CLOUD_CHANNEL_NAME);
        }
    } catch (e) {}

    // =========================================================================
    // 🛰️ شبكة البث السحابي اللحظي العالمي المباشر (MQTT Realtime Bus)
    // =========================================================================
    const MQTT_BROKER_URL = 'wss://broker.emqx.io:8084/mqtt';
    const MQTT_TOPICS = {
        SNAPSHOT: 'wada3an/clinic/snapshot',
        PATIENTS: 'wada3an/clinic/patients',
        TIMING: 'wada3an/clinic/timing',
        SESSIONS: 'wada3an/clinic/sessions',
        VISITS: 'wada3an/clinic/visits',
        SYNC_REQ: 'wada3an/clinic/sync_req'
    };

    let mqttClient = null;
    let mqttConnected = false;
    const MASTER_HUB_CIRCUIT_KEY = 'smart_master_hub_circuit_blocked';
    function isMasterHubAllowed() {
        try {
            const blockedUntil = parseInt(localStorage.getItem(MASTER_HUB_CIRCUIT_KEY) || '0', 10);
            return Date.now() > blockedUntil;
        } catch(e) { return true; }
    }

    function recordMasterHubFailure(status) {
        try {
            localStorage.setItem(MASTER_HUB_CIRCUIT_KEY, (Date.now() + 24 * 60 * 60 * 1000).toString());
        } catch(e) {}
        console.warn(`[CloudSync] Master Hub failure (${status}). Circuit open for 24h; relying on MQTT & NTFY.`);
    }

    function resetMasterHubCircuit() {
        try { localStorage.removeItem(MASTER_HUB_CIRCUIT_KEY); } catch(e) {}
    }

    // تنظيف استباقي لقائمة المحذوفات من أي رموز عامة مثل 'pat' أو 'pat_notif' لمنع حجب المرضى الجدد
    (function sanitizeDeletedPatientIds() {
        try {
            const raw = localStorage.getItem('smart_deleted_patient_ids');
            if (raw) {
                const list = JSON.parse(raw);
                if (Array.isArray(list)) {
                    const cleaned = list.filter(id => id && id !== 'pat' && id !== 'pat_notif' && id !== 'null' && id !== 'undefined' && String(id).trim().length > 3);
                    if (cleaned.length !== list.length) {
                        localStorage.setItem('smart_deleted_patient_ids', JSON.stringify(cleaned));
                    }
                }
            }
        } catch(e) {}
    })();

    // تطهير فوري من أي زيارات وهمية مسبقة (vis_seed_) لضمان مصداقية ودقة سجل الزوار 100%
    (function sanitizeFakeSeedVisits() {
        try {
            const raw = localStorage.getItem('smart_geo_visits_history');
            if (raw) {
                const list = JSON.parse(raw);
                if (Array.isArray(list)) {
                    const cleaned = list.filter(v => v && v.visitorId && !String(v.visitorId).startsWith('vis_seed_') && (!v.page || (!v.page.includes('admin') && !v.page.includes('calibrator'))));
                    if (cleaned.length !== list.length) {
                        localStorage.setItem('smart_geo_visits_history', JSON.stringify(cleaned));
                    }
                }
            }
        } catch(e) {}
    })();

    // التحقق الصارم من قائمة المحذوفات لمنع إعادة استيراد أي مريض محذوف
    function isDeletedPatient(patientId) {
        if (!patientId) return false;
        try {
            const strId = String(patientId).trim();
            if (!strId || strId === 'pat' || strId === 'pat_notif' || strId === 'null' || strId === 'undefined') return false;
            const delList = JSON.parse(localStorage.getItem('smart_deleted_patient_ids') || '[]');
            if (!Array.isArray(delList) || delList.length === 0) return false;
            if (delList.includes(strId)) return true;

            const baseId = strId.replace(/(_notif_.*|_test\d*|_cloud_test.*|_\d{10,})$/, '');
            if (baseId && baseId !== 'pat' && baseId !== 'pat_notif' && baseId.length > 5 && delList.includes(baseId)) {
                return true;
            }
            return false;
        } catch(e) {
            return false;
        }
    }

    // تعريب وتوحيد أسماء وأعلام الدول لمنع ازدواجية الإحصائيات (الأردن / Jordan، السعودية / Saudi Arabia)
    function normalizeCountryInfo(countryRaw, codeRaw, flagRaw) {
        let raw = String(countryRaw || '').trim();
        let code = String(codeRaw || '').trim().toUpperCase();
        let flag = flagRaw || '';

        if (/jordan|أردن|الاردن|الأردن|عمّان|عمان.*أردن/i.test(raw) || code === 'JO') {
            return { name: 'الأردن', flag: '🇯🇴', code: 'JO' };
        }
        if (/saudi|السعودية|المملكة العربية السعودية|الرياض|جدة|مكة/i.test(raw) || code === 'SA') {
            return { name: 'المملكة العربية السعودية', flag: '🇸🇦', code: 'SA' };
        }
        if (/palestine|فلسطين|القدس|غزة|ضفة|رام الله|الخليل/i.test(raw) || code === 'PS') {
            return { name: 'فلسطين', flag: '🇵🇸', code: 'PS' };
        }
        if (/emirates|uae|الإمارات|الامارات|دبي|أبوظبي|ابوظبي|الشارقة/i.test(raw) || code === 'AE') {
            return { name: 'الإمارات العربية المتحدة', flag: '🇦🇪', code: 'AE' };
        }
        if (/egypt|مصر|القاهرة|الإسكندرية|الاسكندرية/i.test(raw) || code === 'EG') {
            return { name: 'مصر', flag: '🇪🇬', code: 'EG' };
        }
        if (/iraq|العراق|بغداد|أربيل|اربيل|البصرة/i.test(raw) || code === 'IQ') {
            return { name: 'العراق', flag: '🇮🇶', code: 'IQ' };
        }
        if (/syria|سوريا|سورية|دمشق|حلب/i.test(raw) || code === 'SY') {
            return { name: 'سوريا', flag: '🇸🇾', code: 'SY' };
        }
        if (/lebanon|لبنان|بيروت/i.test(raw) || code === 'LB') {
            return { name: 'لبنان', flag: '🇱🇧', code: 'LB' };
        }
        if (/kuwait|الكويت/i.test(raw) || code === 'KW') {
            return { name: 'الكويت', flag: '🇰🇼', code: 'KW' };
        }
        if (/qatar|قطر|الدوحة/i.test(raw) || code === 'QA') {
            return { name: 'قطر', flag: '🇶🇦', code: 'QA' };
        }
        if (/bahrain|البحرين|المنامة/i.test(raw) || code === 'BH') {
            return { name: 'البحرين', flag: '🇧🇭', code: 'BH' };
        }
        if (/oman|عمان|سلطنة عمان|مسقط/i.test(raw) && !/عمان.*أردن/i.test(raw) && code === 'OM') {
            return { name: 'سلطنة عمان', flag: '🇴🇲', code: 'OM' };
        }
        if (/yemen|اليمن|صنعاء|عدن/i.test(raw) || code === 'YE') {
            return { name: 'اليمن', flag: '🇾🇪', code: 'YE' };
        }
        if (/algeria|الجزائر/i.test(raw) || code === 'DZ') {
            return { name: 'الجزائر', flag: '🇩🇿', code: 'DZ' };
        }
        if (/morocco|المغرب|الرباط|كازابلانكا/i.test(raw) || code === 'MA') {
            return { name: 'المغرب', flag: '🇲🇦', code: 'MA' };
        }
        if (/tunisia|تونس/i.test(raw) || code === 'TN') {
            return { name: 'تونس', flag: '🇹🇳', code: 'TN' };
        }
        if (/libya|ليبيا|طرابلس/i.test(raw) || code === 'LY') {
            return { name: 'ليبيا', flag: '🇱🇾', code: 'LY' };
        }
        if (/sudan|السودان|الخرطوم/i.test(raw) || code === 'SD') {
            return { name: 'السودان', flag: '🇸🇩', code: 'SD' };
        }
        if (/germany|deutschland|ألمانيا|المانيا|برلين|فرانكفورت/i.test(raw) || code === 'DE') {
            return { name: 'ألمانيا', flag: '🇩🇪', code: 'DE' };
        }
        if (/turkey|türkiye|تركيا|إسطنبول|اسطنبول|أنقرة/i.test(raw) || code === 'TR') {
            return { name: 'تركيا', flag: '🇹🇷', code: 'TR' };
        }
        if (/united states|usa|america|الولايات المتحدة|امريكا|أمريكا/i.test(raw) || code === 'US') {
            return { name: 'الولايات المتحدة', flag: '🇺🇸', code: 'US' };
        }
        if (/united kingdom|uk|britain|england|بريطانيا|المملكة المتحدة|لندن/i.test(raw) || code === 'GB' || code === 'UK') {
            return { name: 'المملكة المتحدة', flag: '🇬🇧', code: 'GB' };
        }
        if (/canada|كندا|تورونتو/i.test(raw) || code === 'CA') {
            return { name: 'كندا', flag: '🇨🇦', code: 'CA' };
        }
        if (/sweden|السويد|ستوكهولم/i.test(raw) || code === 'SE') {
            return { name: 'السويد', flag: '🇸🇪', code: 'SE' };
        }
        if (/france|فرنسا|باريس/i.test(raw) || code === 'FR') {
            return { name: 'فرنسا', flag: '🇫🇷', code: 'FR' };
        }
        if (/china|الصين|بكين|شنغهاي|zhengzhou/i.test(raw) || code === 'CN') {
            return { name: 'الصين', flag: '🇨🇳', code: 'CN' };
        }

        if (code === 'JO' || flag === '🇯🇴') return { name: 'الأردن', flag: '🇯🇴', code: 'JO' };
        if (code === 'SA' || flag === '🇸🇦') return { name: 'المملكة العربية السعودية', flag: '🇸🇦', code: 'SA' };
        if (code === 'PS' || flag === '🇵🇸') return { name: 'فلسطين', flag: '🇵🇸', code: 'PS' };
        if (code === 'AE' || flag === '🇦🇪') return { name: 'الإمارات العربية المتحدة', flag: '🇦🇪', code: 'AE' };

        if (!raw || raw === 'غير محدد' || raw === 'دولي' || raw === 'Unknown') {
            return { name: 'الأردن', flag: '🇯🇴', code: 'JO' };
        }

        return { name: raw, flag: flag || '🌐', code: code || 'GL' };
    }

    // تفريغ أي زيارات معلقة تم تخزينها أثناء تحميل السكربتات
    function flushPendingCloudVisits() {
        try {
            const raw = localStorage.getItem('smart_pending_cloud_visits');
            if (raw) {
                const list = JSON.parse(raw);
                if (Array.isArray(list) && list.length > 0) {
                    list.forEach(v => dispatchVisitToCloud(v));
                    localStorage.removeItem('smart_pending_cloud_visits');
                }
            }
        } catch(e) {}
    }

    function updateMqttStatusBadge(connected) {
        try {
            const badge = document.getElementById('mqtt-live-badge');
            if (badge) {
                if (connected) {
                    badge.style.background = 'rgba(16, 185, 129, 0.18)';
                    badge.style.borderColor = '#10b981';
                    badge.style.color = '#6ee7b7';
                    badge.innerHTML = '🟢 بث سحابي لحظي نشط';
                    badge.title = 'متصل بخادم البث اللحظي العالمي (EMQX) - المزامنة فورية 100% بين الموبايل واللابتوب';
                } else {
                    badge.style.background = 'rgba(245, 158, 11, 0.18)';
                    badge.style.borderColor = '#f59e0b';
                    badge.style.color = '#fcd34d';
                    badge.innerHTML = '🟡 جاري الاتصال بالبث السحابي...';
                    badge.title = 'جاري إعادة الاتصال بخادم البث السحابي اللحظي';
                }
            }
        } catch(e) {}
    }

    function initMqttBus() {
        const mqttLib = window.mqtt || (typeof mqtt !== 'undefined' ? mqtt : null);
        if (!mqttLib || typeof mqttLib.connect !== 'function') {
            setTimeout(initMqttBus, 600);
            return;
        }
        if (mqttClient) return;

        try {
            const isMob = /Mobi|Android|iPhone/i.test(navigator.userAgent);
            const clientId = `smart_${isMob ? 'mobile' : 'pc'}_${Math.random().toString(16).slice(2, 8)}_${Date.now()}`;
            
            mqttClient = mqttLib.connect(MQTT_BROKER_URL, {
                clientId: clientId,
                clean: true,
                connectTimeout: 3000,    // ✅ v29.19: تقليص من 8000 إلى 3000 لمنع التجميد
                reconnectPeriod: 8000,   // ✅ v29.19: تمديد من 4000 إلى 8000 لتقليل محاولات الاتصال المتكررة
                keepalive: 30
            });

            mqttClient.on('connect', () => {
                mqttConnected = true;
                console.log('🟢 [CloudSync] Connected to Realtime MQTT Bus:', clientId);
                updateMqttStatusBadge(true);

                mqttClient.subscribe([
                    MQTT_TOPICS.SNAPSHOT,
                    MQTT_TOPICS.PATIENTS,
                    MQTT_TOPICS.TIMING,
                    MQTT_TOPICS.SESSIONS,
                    MQTT_TOPICS.VISITS,
                    MQTT_TOPICS.SYNC_REQ
                ], { qos: 1 }, (err) => {
                    if (err) console.warn('[CloudSync] MQTT Subscribe error:', err);
                });

                // طلب مزامنة فورية من أي جهاز نشط
                mqttPublish(MQTT_TOPICS.SYNC_REQ, {
                    sender: clientId,
                    device: isMob ? 'mobile' : 'pc',
                    requestedAt: Date.now()
                });
            });

            mqttClient.on('message', (topic, payloadBuffer) => {
                try {
                    const messageStr = payloadBuffer.toString();
                    if (!messageStr || !messageStr.trim().startsWith('{')) return;
                    const data = JSON.parse(messageStr);
                    handleIncomingMqttMessage(topic, data, clientId);
                } catch (e) {
                    console.error('[CloudSync] Error parsing MQTT message:', e);
                }
            });

            mqttClient.on('error', (err) => {
                console.warn('[CloudSync] MQTT error:', err?.message || err);
                mqttConnected = false;
                updateMqttStatusBadge(false);
            });

            mqttClient.on('close', () => {
                mqttConnected = false;
                updateMqttStatusBadge(false);
            });

        } catch (e) {
            console.error('[CloudSync] Could not initialize MQTT:', e);
        }
    }

    function mqttPublish(topic, obj, options = {}) {
        if (!mqttClient || !mqttConnected) return false;
        try {
            const raw = JSON.stringify(obj);
            mqttClient.publish(topic, raw, { qos: 1, retain: !!options.retain, ...options }, (err) => {
                if (err) console.warn(`[CloudSync] Publish to ${topic} error:`, err);
            });
            return true;
        } catch(e) {
            return false;
        }
    }

    let lastReceivedSnapshotTime = 0;

    async function handleIncomingMqttMessage(topic, data, myClientId) {
        if (!data) return;
        if (data.sender === myClientId) return;

        // 1. حزمة المزامنة الكاملة
        if (topic === MQTT_TOPICS.SNAPSHOT) {
            const snap = data.snapshot || data;
            const snapTime = data.timestamp || (snap.exportedAt ? new Date(snap.exportedAt).getTime() : 0);
            if (snap && (snap.patients || snap.allPatients) && snapTime >= lastReceivedSnapshotTime) {
                lastReceivedSnapshotTime = snapTime;
                console.log('📦 [CloudSync] Received fresh snapshot via MQTT');
                await importFullClinicSnapshot(snap);
                triggerAppUIRefresh();
            }
            return;
        }

        // 2. تحديث التوقيت المباشر
        if (topic === MQTT_TOPICS.TIMING) {
            console.log('⏱️ [CloudSync] Received timing update via MQTT:', data);
            applyTimingUpdateLocally(data);
            return;
        }

        // 2.5 معالجة حذف المريض فورياً في حال وروده
        if (data.type === 'PATIENT_DELETED' || topic === 'wada3an/clinic/deleted') {
            const delIds = data.allIds || [data.patientId];
            try {
                const curDel = JSON.parse(localStorage.getItem('smart_deleted_patient_ids') || '[]');
                const mergedDel = Array.from(new Set([...curDel, ...delIds]));
                localStorage.setItem('smart_deleted_patient_ids', JSON.stringify(mergedDel));
            } catch(e) {}
            const cList = getCloudSyncedPatients().filter(x => {
                const xId = x.patientId || x.id;
                return !delIds.includes(xId);
            });
            saveCloudSyncedPatients(cList);
            triggerAppUIRefresh();
            return;
        }

        // 3. مريض جديد أو محدث أو محذوف
        if (topic === MQTT_TOPICS.PATIENTS || topic.includes('deleted')) {
            if (data && (data.type === 'PATIENT_DELETED' || topic.includes('deleted'))) {
                const delId = data.patientId || data.id;
                const allIds = Array.isArray(data.allIds) ? data.allIds : [delId];
                allIds.forEach(id => {
                    if (id) {
                        try {
                            const cur = JSON.parse(localStorage.getItem('smart_deleted_patient_ids') || '[]');
                            if (!cur.includes(id)) {
                                cur.push(id);
                                localStorage.setItem('smart_deleted_patient_ids', JSON.stringify(cur));
                            }
                        } catch(e) {}
                    }
                });
                const cList = getCloudSyncedPatients().filter(p => !allIds.includes(p.patientId) && !allIds.includes(p.id));
                saveCloudSyncedPatients(cList);
                triggerAppUIRefresh();
                return;
            }

            const pt = data.patient || data;
            if (pt && (pt.patientId || pt.id || pt.phone)) {
                const pIdToCheck = pt.patientId || pt.id;
                if (isDeletedPatient(pIdToCheck)) return;

                const normalized = normalizeCloudPatientRecord(pt);
                if (normalized && !isDeletedPatient(normalized.id)) {
                    const cList = getCloudSyncedPatients();
                    const pIdx = cList.findIndex(x => normalized.id && (x.id === normalized.id || x.patientId === normalized.id));
                    const isNewPatient = pIdx < 0; // ✅ v29.19: تحديد إذا كان مريض جديد
                    if (pIdx >= 0) cList[pIdx] = Object.assign({}, cList[pIdx], normalized);
                    else cList.unshift(normalized);
                    saveCloudSyncedPatients(cList);

                    if (window.SmartDB && typeof window.SmartDB.savePatient === 'function') {
                        await window.SmartDB.savePatient(normalized, { skipCloudSync: true });
                    }

                    // ✅ إنشاء إشعار تلقائي عند وصول مريض جديد من السحابة (فقط إن كان مريضاً حقيقياً وليس زائر مجهول)
                    const pNameNorm = (normalized.fullName || normalized.name || '').trim();
                    const pPhoneNorm = (normalized.phone || '').replace(/\D/g, '');
                    const isAnonSync = !pNameNorm || /^(?:مراجع كريم|المراجع الكريم|مراجع محترم|المراجع المحترم|مراجع جديد|مريض الفحص الذاتي|فحص ذاتي|زائر|مجهول|pat_guest|undefined|null)$/i.test(pNameNorm);

                    if (isNewPatient && (!isAnonSync || pPhoneNorm.length >= 7) && window.SmartDB && typeof window.SmartDB.addAdminNotification === 'function') {
                        try {
                            const displayName = !isAnonSync ? pNameNorm : `مراجع (${pPhoneNorm.slice(-4)})`;
                            window.SmartDB.addAdminNotification({
                                type: 'new_registration',
                                title: `👤 مراجع جديد: ${displayName}`,
                                message: `وصل ملف طبي جديد عبر المزامنة السحابية — موضع الشكوى: ${normalized.painArea || normalized.painAreaTitle || 'غير محدد'}`,
                                patientId: normalized.patientId || normalized.id,
                                patientName: displayName,
                                patientPhone: normalized.phone || ''
                            });
                        } catch(e) {}
                    }

                    triggerAppUIRefresh();
                }
            }
            return;
        }

        // 4. جلسة علاجية منجزة
        if (topic === MQTT_TOPICS.SESSIONS) {
            const log = data.log || data;
            if (log && log.patientId && log.sessionNumber) {
                if (window.SmartDB && typeof window.SmartDB.saveDailyLog === 'function') {
                    await window.SmartDB.saveDailyLog(log, { skipCloudSync: true });
                }
                const lsKey = 'smart_daily_logs_' + log.patientId;
                const existing = JSON.parse(localStorage.getItem(lsKey) || '[]');
                const lIdx = existing.findIndex(l => l.sessionNumber === log.sessionNumber);
                if (lIdx >= 0) existing[lIdx] = { ...existing[lIdx], ...log };
                else existing.push(log);
                existing.sort((a, b) => (a.sessionNumber || 0) - (b.sessionNumber || 0));
                localStorage.setItem(lsKey, JSON.stringify(existing));

                try {
                    const ptList = getCloudSyncedPatients();
                    const pItem = ptList.find(x => x.id === log.patientId || x.patientId === log.patientId);
                    if (pItem) {
                        pItem.logsCount = existing.length;
                        pItem.completedSessions = existing.length;
                        pItem.recoveryScore = Math.min(100, Math.round((existing.length / 7) * 100));
                        saveCloudSyncedPatients(ptList);
                    }
                    if (window.SmartDB && typeof window.SmartDB.getPatient === 'function') {
                        const dbPt = await window.SmartDB.getPatient(log.patientId);
                        if (dbPt) {
                            dbPt.logsCount = existing.length;
                            dbPt.completedSessions = existing.length;
                            dbPt.recoveryScore = Math.min(100, Math.round((existing.length / 7) * 100));
                            await window.SmartDB.savePatient(dbPt, { skipCloudSync: true });
                        }
                    }
                } catch(e) {}

                triggerAppUIRefresh();
            }
            return;
        }

        // 5. زيارة جديدة
        if (topic === MQTT_TOPICS.VISITS) {
            const v = data.visit || data;
            if (v && v.visitorId) {
                const VISITS_KEY = 'smart_geo_visits_history';
                let localVisits = [];
                try { localVisits = JSON.parse(localStorage.getItem(VISITS_KEY) || '[]'); } catch(e) {}
                const isDuplicate = localVisits.some(x => {
                    if (v.visitId && x.visitId && x.visitId === v.visitId) return true;
                    return x.visitorId === v.visitorId && Math.abs(new Date(x.timestamp || 0).getTime() - new Date(v.timestamp || 0).getTime()) < 120000;
                });
                if (!isDuplicate) {
                    localVisits.push(v);
                    if (localVisits.length > 1000) localVisits = localVisits.slice(-1000);
                    localStorage.setItem(VISITS_KEY, JSON.stringify(localVisits));
                    if (typeof window.renderGeoAnalytics === 'function') {
                        window.renderGeoAnalytics();
                    }
                }
            }
            return;
        }

        // 6. طلب المزامنة
        if (topic === MQTT_TOPICS.SYNC_REQ) {
            const currentPatients = getCloudSyncedPatients();
            if (currentPatients && currentPatients.length > 0) {
                broadcastFullClinicSnapshot();
            }
            return;
        }
    }

    // ✅ v29.22: retry queue — يضمن تشغيل loadAdminData حتى لو وصل MQTT قبل تجهيز الصفحة
    function triggerAppUIRefresh(retryCount) {
        try {
            const maxRetries = typeof retryCount === 'number' ? retryCount : 3;
            if (typeof window.loadAdminData === 'function') {
                window.loadAdminData(false);
            } else if (maxRetries > 0) {
                setTimeout(() => triggerAppUIRefresh(maxRetries - 1), 600);
            }
            if (typeof window.renderGeoAnalytics === 'function') {
                window.renderGeoAnalytics();
            }
            if (typeof window.loadNotificationsData === 'function') {
                window.loadNotificationsData(true);
            }
        } catch(e) {}
    }

    // تشغيل الاتصال اللحظي تلقائياً عند تحميل السكربت
    if (typeof window !== 'undefined') {
        if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', initMqttBus);
        } else {
            setTimeout(initMqttBus, 100);
        }
    }

    // استرجاع كافة المرضى السحابيين - كل مريض يظهر مرة واحدة لكن بجميع جلساته محفوظة
    function getCloudSyncedPatients() {
        try {
            const raw = localStorage.getItem(CLOUD_PATIENTS_KEY);
            if (raw) {
                const parsed = JSON.parse(raw);
                if (Array.isArray(parsed)) {
                    // الحفاظ على كافة السجلات والتشخيصات - كل فحص سريري هو سجل مستقل
                    const list = [];
                    const seenIds = new Set();

                    for (const pt of parsed) {
                        if (!pt) continue;

                        const uniqueId = pt.patientId || pt.id || (pt.createdAt ? 'pat_' + pt.createdAt : null);
                        if (uniqueId && isDeletedPatient(uniqueId)) continue;
                        if (uniqueId && seenIds.has(uniqueId)) {
                            const idx = list.findIndex(x => (x.patientId === uniqueId || x.id === uniqueId));
                            if (idx >= 0) {
                                const existing = list[idx];
                                const isDiff = (existing.painArea && pt.painArea && existing.painArea !== pt.painArea) ||
                                               (existing.chiefDiagnosis && pt.chiefDiagnosis && existing.chiefDiagnosis !== pt.chiefDiagnosis) ||
                                               (existing.selectedPoint && pt.selectedPoint && existing.selectedPoint !== pt.selectedPoint) ||
                                               (existing.timestamp && pt.timestamp && Math.abs(new Date(existing.timestamp) - new Date(pt.timestamp)) > 120000);
                                if (isDiff) {
                                    const altId = uniqueId + '_test2';
                                    pt.id = altId;
                                    pt.patientId = altId;
                                    seenIds.add(altId);
                                } else {
                                    list[idx] = { ...list[idx], ...pt };
                                    continue;
                                }
                            } else {
                                continue;
                            }
                        } else if (uniqueId) {
                            seenIds.add(uniqueId);
                        }

                        // تصحيح الاسم
                        let pName = (pt.fullName || pt.name || '').trim();
                        const cleanPh = (pt.phone || '').replace(/\D/g, '');
                        if (/^(?:الاسم|الآسم|الإسم)$/.test(pName)) pName = (cleanPh.length >= 7 ? `مراجع (${cleanPh.slice(-4)})` : '');
                        if (!pName && cleanPh.length >= 7) pName = `مراجع (${cleanPh.slice(-4)})`;

                        // احتساب BMI
                        const w = parseFloat(pt.weight), h = parseFloat(pt.height);
                        let bmi = pt.bmi || (w > 0 && h > 0 ? parseFloat((w / Math.pow(h/100,2)).toFixed(1)) : '');

                        const cleanedPt = {
                            ...pt,
                            patientId: uniqueId || ('pat_' + Date.now().toString(36) + '_' + Math.random().toString(36).substr(2, 5)),
                            id: uniqueId || pt.id,
                            name: pName,
                            fullName: pName,
                            bmi: bmi
                        };

                        list.push(cleanedPt);
                    }

                    return list;
                }
            }
        } catch (e) {}
        return [];
    }

    // دمج مصفوفات الجلسات اليومية من مصادر متعددة مع إزالة التكرار الفعلي فقط
    function mergeLogs(...arrays) {
        const map = new Map();
        for (const arr of arrays) {
            if (!Array.isArray(arr)) continue;
            for (const log of arr) {
                if (!log) continue;
                // مفتاح فريد: رقم الجلسة + التاريخ - لمنع نفس الجلسة من الظهور مرتين فقط
                const key = `${log.sessionNumber || ''}_${log.date || log.timestamp || ''}`;
                if (!map.has(key)) map.set(key, log);
                else map.set(key, { ...map.get(key), ...log }); // دمج حقول الجلسة
            }
        }
        return Array.from(map.values()).sort((a, b) => (a.sessionNumber || 0) - (b.sessionNumber || 0));
    }

    // دمج تقييمات المرضى من مصادر متعددة مع الحفاظ على كل تقييم فريد
    function mergeAssessments(...items) {
        const list = [];
        for (const item of items) {
            if (!item) continue;
            if (Array.isArray(item)) list.push(...item);
            else if (typeof item === 'object') list.push(item);
        }
        // إزالة التكرار الحقيقي فقط (نفس التاريخ ونفس التشخيص)
        const seen = new Set();
        return list.filter(a => {
            if (!a) return false;
            const k = `${a.timestamp || a.date || ''}_${a.primaryDiagnosis || a.title || ''}`;
            if (seen.has(k)) return false;
            seen.add(k);
            return true;
        });
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

    // تحديث بيانات التوقيت للمريض محلياً وتحديث الواجهة فوراً
    function applyTimingUpdateLocally(data) {
        if (!data) return;
        const patientId = data.patientId || data.id;
        if (!patientId) return;
        const patients = getCloudSyncedPatients();
        const idx = patients.findIndex(p => p.id === patientId || p.patientId === patientId);
        if (idx < 0) return;

        const patient = patients[idx];
        // دمج حقول التوقيت
        const timingFields = ['sessionNumber','painScore','mobilityRate','sleepRate','date','timestamp'];
        timingFields.forEach(f => {
            if (data[f] !== undefined) patient[f] = data[f];
        });

        // تحديث سجل اليوم إن وجد رقم جلسة
        if (data.sessionNumber) {
            const lsKey = 'smart_daily_logs_' + patientId;
            const existing = JSON.parse(localStorage.getItem(lsKey) || '[]');
            const logIdx = existing.findIndex(l => l.sessionNumber === data.sessionNumber);
            const logUpdate = {
                patientId,
                sessionNumber: data.sessionNumber,
                painScore: data.painScore,
                mobilityRate: data.mobilityRate,
                sleepRate: data.sleepRate,
                date: data.date || new Date().toISOString()
            };
            if (logIdx >= 0) existing[logIdx] = { ...existing[logIdx], ...logUpdate };
            else existing.push(logUpdate);
            existing.sort((a, b) => (a.sessionNumber || 0) - (b.sessionNumber || 0));
            localStorage.setItem(lsKey, JSON.stringify(existing));
        }

        // حفظ المريض المحدث
        patients[idx] = patient;
        saveCloudSyncedPatients(patients);

        // مزامنة مع SmartDB إن كان متاحاً
        if (window.SmartDB && typeof window.SmartDB.savePatient === 'function') {
            try { window.SmartDB.savePatient(patient, { skipCloudSync: true }); } catch(e) {}
        }

        // تحديث الواجهة
        triggerAppUIRefresh();
    }

    // إدارة طابور الترحيل السحابي المعلق (Offline & Mobile Dispatch Queue)
    function enqueuePendingCloudPatient(patient) {
        try {
            const raw = localStorage.getItem('smart_pending_cloud_sync');
            let q = raw ? JSON.parse(raw) : [];
            if (!Array.isArray(q)) q = [];
            const pId = patient.id || patient.patientId;
            const idx = q.findIndex(x => (x.id === pId || x.patientId === pId));
            if (idx >= 0) q[idx] = { ...q[idx], ...patient, queuedAt: Date.now() };
            else q.push({ ...patient, queuedAt: Date.now() });
            localStorage.setItem('smart_pending_cloud_sync', JSON.stringify(q));
        } catch(e) {}
    }

    function dequeuePendingCloudPatient(pId) {
        if (!pId) return;
        try {
            const raw = localStorage.getItem('smart_pending_cloud_sync');
            if (!raw) return;
            let q = JSON.parse(raw);
            if (Array.isArray(q)) {
                q = q.filter(x => x.id !== pId && x.patientId !== pId);
                localStorage.setItem('smart_pending_cloud_sync', JSON.stringify(q));
            }
        } catch(e) {}
    }

    async function flushPendingCloudSyncQueue() {
        try {
            const raw = localStorage.getItem('smart_pending_cloud_sync');
            if (!raw) return;
            const q = JSON.parse(raw);
            if (!Array.isArray(q) || q.length === 0) return;

            for (const pt of q) {
                const rawBody = JSON.stringify(pt);
                try {
                    const r = await fetch(CLOUD_SYNC_ENDPOINT, {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json' },
                        body: rawBody,
                        keepalive: true
                    });
                    if (r && r.ok) {
                        dequeuePendingCloudPatient(pt.id || pt.patientId);
                    }
                } catch(err) {}
            }
        } catch(e) {}
    }

    if (typeof window !== 'undefined') {
        window.addEventListener('online', flushPendingCloudSyncQueue);
        setInterval(flushPendingCloudSyncQueue, 6000);
    }

    // دالة ترحيل مريض جديد سحابياً من أي مكان في العالم
    async function dispatchPatientToCloud(patientRecord) {
        if (!patientRecord) return null;

        // تنظيف الاسم والتحقق الصارم من عدم ترحيل كلمة "الاسم" كاسم شخصي للمريض
        let rawName = patientRecord.name || patientRecord.fullName || '';
        let cleanName = rawName.trim();
        const ptPhoneClean = (patientRecord.phone ? String(patientRecord.phone).replace(/\D/g, '') : '');
        if (/^(?:الاسم|الآسم|الإسم|اسمي|اسمها|اسمه|اسمك|اسم)$/i.test(cleanName)) {
            cleanName = (patientRecord.fullName && !/^(?:الاسم|الآسم|الإسم|اسمي|اسمها|اسمه|اسمك|اسم)$/i.test(patientRecord.fullName)) 
                ? patientRecord.fullName 
                : (ptPhoneClean.length >= 7 ? `مراجع (${ptPhoneClean.slice(-4)})` : '');
        }
        if (!cleanName && ptPhoneClean.length >= 7) cleanName = `مراجع (${ptPhoneClean.slice(-4)})`;

        // جلب البيانات الجغرافية للزائر (الدولة، المدينة، الجهاز)
        let geoInfo = null;
        try {
            if (window.SmartGeoTracker && typeof window.SmartGeoTracker.getVisitorInfo === 'function') {
                geoInfo = await window.SmartGeoTracker.getVisitorInfo();
            }
        } catch (e) {}

        const patientId = patientRecord.id || patientRecord.patientId || ('pat_' + (patientRecord.phone ? String(patientRecord.phone).replace(/\D/g, '') : Date.now().toString(36)) + '_' + Math.random().toString(36).substr(2, 5));
        
        // احتساب مؤشر كتلة الجسم BMI بدقة إن توفر الطول والوزن
        const w = parseFloat(patientRecord.weight);
        const h = parseFloat(patientRecord.height);
        let calculatedBmi = patientRecord.bmi;
        if (!calculatedBmi && w > 0 && h > 0) {
            calculatedBmi = parseFloat((w / Math.pow(h / 100, 2)).toFixed(1));
        }

        // استخراج موضع الألم بدقة ومنع الفراغ أو الفرض القسري للعمود الفقري
        const resolvedPain = patientRecord.painAreaTitle 
            || patientRecord.painArea 
            || patientRecord.selectedPoint 
            || patientRecord.condition 
            || 'استشارة وفحص سريري شامل';

        // استخراج سجلات الجلسات اليومية للمريض إن وجدت لترحيلها مع الملف السحابي
        let existingLogs = [];
        if (Array.isArray(patientRecord.dailyLogs) && patientRecord.dailyLogs.length > 0) {
            existingLogs = patientRecord.dailyLogs;
        } else if (Array.isArray(patientRecord.logs) && patientRecord.logs.length > 0) {
            existingLogs = patientRecord.logs;
        } else {
            try {
                existingLogs = JSON.parse(localStorage.getItem('smart_daily_logs_' + patientId) || '[]');
            } catch (e) {}
        }

        const enhancedRecord = {
            ...patientRecord,
            id: patientId,
            patientId: patientId,
            name: cleanName,
            fullName: patientRecord.fullName && !/^(?:الاسم|الآسم|الإسم|اسمي|اسمها|اسمه|اسمك|اسم)$/i.test(patientRecord.fullName) ? patientRecord.fullName : cleanName,
            phone: patientRecord.phone || '',
            age: patientRecord.age || '',
            gender: patientRecord.gender || 'male',
            height: patientRecord.height || '',
            weight: patientRecord.weight || '',
            bmi: calculatedBmi || '',
            painArea: resolvedPain,
            painAreaTitle: resolvedPain,
            selectedPoint: patientRecord.selectedPoint || resolvedPain,
            chiefDiagnosis: patientRecord.chiefDiagnosis || patientRecord.diagnosisTitle || patientRecord.condition || 'تشخيص سريري متكامل',
            diagnosisTitle: patientRecord.diagnosisTitle || patientRecord.chiefDiagnosis || 'تشخيص سريري متكامل',
            severityLevel: patientRecord.severityLevel || patientRecord.painLevel || '',
            vitalsSummary: patientRecord.vitalsSummary || '',
            clinicalQuestions: patientRecord.clinicalQuestions || {},
            mriReportText: patientRecord.mriReportText || '',
            treatmentPlan: patientRecord.treatmentPlan || '',
            assessment: patientRecord.assessment || patientRecord.latestAssessment || null,
            latestAssessment: patientRecord.latestAssessment || patientRecord.assessment || null,
            notes: patientRecord.notes || '',
            collectedSymptoms: patientRecord.collectedSymptoms || [],
            dailyLogs: existingLogs,
            logs: existingLogs,
            // معلومات التوزيع الجغرافي العالمية
            country: (geoInfo && geoInfo.country) ? geoInfo.country : (patientRecord.country || 'غير محدد'),
            countryCode: (geoInfo && geoInfo.countryCode) ? geoInfo.countryCode : (patientRecord.countryCode || ''),
            city: (geoInfo && geoInfo.city) ? geoInfo.city : (patientRecord.city || 'غير محدد'),
            flag: (geoInfo && geoInfo.flag) ? geoInfo.flag : (patientRecord.flag || '🌐'),
            device: patientRecord.device || ((geoInfo && geoInfo.device) ? geoInfo.device : ((typeof window !== 'undefined' && window.innerWidth >= 992) ? 'Desktop' : 'Mobile')),
            deviceIcon: patientRecord.deviceIcon || ((geoInfo && geoInfo.deviceIcon) ? geoInfo.deviceIcon : ((typeof window !== 'undefined' && window.innerWidth >= 992) ? '💻' : '📱')),
            timestamp: patientRecord.timestamp || patientRecord.createdAt || new Date().toISOString(),
            status: patientRecord.status || 'new',
            sourceDomain: window.location.hostname || 'smartchecktools.com'
        };

        // 1. التخزين في قاعدة البيانات الموحدة
        const currentPatients = getCloudSyncedPatients();
        const existingIdx = currentPatients.findIndex(p => (p.id && (p.id === enhancedRecord.id || p.patientId === enhancedRecord.id)));

        if (existingIdx >= 0) {
            const existing = currentPatients[existingIdx];
            const isDiff = (existing.painArea && enhancedRecord.painArea && existing.painArea !== enhancedRecord.painArea) ||
                           (existing.chiefDiagnosis && enhancedRecord.chiefDiagnosis && existing.chiefDiagnosis !== enhancedRecord.chiefDiagnosis) ||
                           (existing.timestamp && enhancedRecord.timestamp && Math.abs(new Date(existing.timestamp) - new Date(enhancedRecord.timestamp)) > 300000);
            if (isDiff) {
                enhancedRecord.id = enhancedRecord.id + '_' + Date.now().toString(36);
                enhancedRecord.patientId = enhancedRecord.id;
                currentPatients.unshift(enhancedRecord);
            } else {
                // تحديث سجل موجود مع الحفاظ على الجلسات الأكثر اكتمالاً
                const prevLogs = currentPatients[existingIdx].dailyLogs || [];
                const mergedLogs = [...prevLogs];
                for (const el of existingLogs) {
                    const mlIdx = mergedLogs.findIndex(m => m.sessionNumber === el.sessionNumber);
                    if (mlIdx >= 0) mergedLogs[mlIdx] = { ...mergedLogs[mlIdx], ...el };
                    else mergedLogs.push(el);
                }
                enhancedRecord.dailyLogs = mergedLogs;
                enhancedRecord.logs = mergedLogs;
                currentPatients[existingIdx] = Object.assign({}, currentPatients[existingIdx], enhancedRecord);
            }
        } else {
            // إضافة مريض جديد كفحص مستقل
            currentPatients.unshift(enhancedRecord);
        }

        saveCloudSyncedPatients(currentPatients);

        // 2. مزامنة فورية مع SmartDB محلياً
        try {
            if (window.SmartDB && typeof window.SmartDB.savePatient === 'function') {
                await window.SmartDB.savePatient(enhancedRecord, { skipCloudSync: true });
            }
            localStorage.setItem('smart_last_notif_time', Date.now().toString());
            localStorage.setItem('smart_last_cloud_sync_time', Date.now().toString());
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

        // 3.4. حفظ في طابور الترحيل لضمان عدم ضياع أي سجل في حالة انقطاع اتصال الهاتف أو إغلاق المتصفح
        enqueuePendingCloudPatient(enhancedRecord);

        // 3.5. بث فوري مباشر عبر شبكة MQTT لجميع الأجهزة واللابتوبات
        mqttPublish(MQTT_TOPICS.PATIENTS, { patient: enhancedRecord, timestamp: Date.now() }, { qos: 1 });
        // ✅ v29.20: تحديث اللقطة السحابية المحتفظ بها (Retained Snapshot) فوراً لضمان وصول المريض للابتوب في أي وقت
        setTimeout(() => { broadcastFullClinicSnapshot(); }, 100);

        // 4. ترحيل حقيقي سحابي فوري للسحابة المركزية العالمية (Master Cloud Hub) إن كانت متاحة
        if (isMasterHubAllowed()) {
            try {
                fetch(CLOUD_MASTER_HUB_ENDPOINT, { cache: 'no-store', keepalive: true })
                    .then(r => {
                        if (!r.ok) { recordMasterHubFailure(r.status); return null; }
                        return r.json();
                    })
                    .then(masterObj => {
                        if (!masterObj) return;
                        const currentCloudList = (masterObj && masterObj.data && Array.isArray(masterObj.data.patients)) ? masterObj.data.patients : [];
                        const pIdx = currentCloudList.findIndex(p => p.id && (p.id === enhancedRecord.id || p.patientId === enhancedRecord.id));
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
                            }),
                            keepalive: true
                        });
                    })
                    .catch(() => {});
            } catch (e) {}
        }

        // 5. ترحيل إضافي مقتضب عبر جسر ntfy لضمان التكرار والموثوقية وبقاء الرسالة قطعياً دون حد الـ 4KB
        try {
            const compactForCloud = {
                id: enhancedRecord.id,
                patientId: enhancedRecord.patientId,
                name: enhancedRecord.name,
                fullName: enhancedRecord.fullName,
                phone: enhancedRecord.phone,
                age: enhancedRecord.age,
                weight: enhancedRecord.weight,
                height: enhancedRecord.height,
                bmi: enhancedRecord.bmi,
                gender: enhancedRecord.gender,
                painArea: enhancedRecord.painArea,
                painAreaTitle: enhancedRecord.painAreaTitle,
                selectedPoint: enhancedRecord.selectedPoint,
                chiefDiagnosis: enhancedRecord.chiefDiagnosis,
                diagnosisTitle: enhancedRecord.diagnosisTitle,
                severityLevel: enhancedRecord.severityLevel,
                notes: (enhancedRecord.notes || '').slice(0, 300),
                country: enhancedRecord.country,
                countryCode: enhancedRecord.countryCode,
                city: enhancedRecord.city,
                flag: enhancedRecord.flag,
                device: enhancedRecord.device,
                deviceIcon: enhancedRecord.deviceIcon,
                createdAt: enhancedRecord.createdAt,
                timestamp: enhancedRecord.timestamp,
                status: enhancedRecord.status || 'new',
                logsCount: enhancedRecord.logsCount || 0,
                completedSessions: enhancedRecord.completedSessions || 0,
                recoveryScore: enhancedRecord.recoveryScore || 0
            };
            if (enhancedRecord.assessment && typeof enhancedRecord.assessment === 'object') {
                compactForCloud.assessment = {
                    primaryDiagnosis: enhancedRecord.assessment.primaryDiagnosis?.title || enhancedRecord.assessment.primaryDiagnosis || enhancedRecord.chiefDiagnosis,
                    painLocation: enhancedRecord.assessment.painLocation || enhancedRecord.painArea,
                    urgencyLevel: enhancedRecord.assessment.urgencyLevel || 'routine',
                    date: enhancedRecord.assessment.date || enhancedRecord.createdAt
                };
            }
            const rawBody = JSON.stringify(compactForCloud);
            if (typeof navigator !== 'undefined' && typeof navigator.sendBeacon === 'function') {
                try {
                    const blob = new Blob([rawBody], { type: 'application/json' });
                    navigator.sendBeacon(CLOUD_SYNC_ENDPOINT, blob);
                } catch(eBeacon) {}
            }

            fetch(CLOUD_SYNC_ENDPOINT, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: rawBody,
                keepalive: true
            }).then(() => {
                dequeuePendingCloudPatient(enhancedRecord.id || enhancedRecord.patientId);
            }).catch(() => {});

            fetch('https://ntfy.sh', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    topic: 'wada3an_smart_check_clinic_sync_2026',
                    message: rawBody,
                    title: 'New Patient Record'
                }),
                keepalive: true
            }).catch(() => {});
        } catch (e) {}

        return enhancedRecord;
    }

    // ترحيل جلسة منجزة وتحديث يومي سحابياً لكافة الأجهزة (موبايل + لابتوب)
    async function dispatchSessionLogToCloud(logEntry) {
        if (!logEntry || !logEntry.patientId) return null;
        const now = Date.now();
        const pId = logEntry.patientId;
        const sNum = logEntry.sessionNumber || 1;

        const payload = {
            type: 'session_log_update',
            patientId: pId,
            sessionNumber: sNum,
            painScore: logEntry.painScore ?? 7,
            mobilityRate: logEntry.mobilityRate ?? 70,
            sleepRate: logEntry.sleepRate ?? 70,
            date: logEntry.date || new Date().toISOString(),
            timestamp: now,
            log: logEntry
        };

        // 1. تحديث محلي فوري في smart_cloud_synced_patients
        try {
            const patients = getCloudSyncedPatients();
            const pIdx = patients.findIndex(p => p.id === pId || p.patientId === pId);
            if (pIdx >= 0) {
                patients[pIdx].dailyLogs = patients[pIdx].dailyLogs || [];
                const lIdx = patients[pIdx].dailyLogs.findIndex(l => l.sessionNumber === sNum);
                if (lIdx >= 0) {
                    patients[pIdx].dailyLogs[lIdx] = { ...patients[pIdx].dailyLogs[lIdx], ...logEntry };
                } else {
                    patients[pIdx].dailyLogs.push(logEntry);
                }
                patients[pIdx].dailyLogs.sort((a, b) => (a.sessionNumber || 0) - (b.sessionNumber || 0));
                patients[pIdx].logsCount = patients[pIdx].dailyLogs.length;
                patients[pIdx].completedSessions = patients[pIdx].dailyLogs.length;
                patients[pIdx].recoveryScore = Math.min(100, Math.round((patients[pIdx].dailyLogs.length / 7) * 100));
                saveCloudSyncedPatients(patients);
            }
        } catch(e) {}

        // 2. بث عبر BroadcastChannel للمتصفحات المفتوحة محلياً
        if (syncBroadcastChannel) {
            try {
                syncBroadcastChannel.postMessage(payload);
            } catch(e) {}
        }

        // 2.5. بث فوري مباشر عبر شبكة MQTT لجميع الأجهزة واللابتوبات
        mqttPublish(MQTT_TOPICS.SESSIONS, payload, { qos: 1 });
        // ✅ v29.20: تحديث اللقطة السحابية المحتفظ بها (Retained Snapshot) فوراً لتوحيد جلسات المريض
        setTimeout(() => { broadcastFullClinicSnapshot(); }, 100);

        // 3. بث سحابي عبر NTFY لكافة الأجهزة حول العالم
        const jsonStr = JSON.stringify(payload);
        try {
            fetch(CLOUD_SYNC_ENDPOINT, {
                method: 'POST',
                body: jsonStr
            }).catch(() => {});

            fetch('https://ntfy.sh', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    topic: 'wada3an_smart_check_clinic_sync_2026',
                    message: jsonStr,
                    title: `Session ${sNum} Completed`
                })
            }).catch(() => {});
        } catch(e) {}

        return payload;
    }

    // استخراج كافة سجلات الجلسات اليومية لمريض من الذاكرة السحابية
    function getPatientLogs(patientId) {
        if (!patientId) return [];
        try {
            const lsKey = 'smart_daily_logs_' + patientId;
            const local = JSON.parse(localStorage.getItem(lsKey) || '[]');
            const map = new Map();
            local.forEach(l => {
                if (l && l.sessionNumber) map.set(l.sessionNumber, l);
            });

            const pts = getCloudSyncedPatients();
            const cleanTarget = String(patientId).replace(/\D/g, '');
            const pt = pts.find(p => p.id === patientId || p.patientId === patientId || (cleanTarget && p.phone && String(p.phone).replace(/\D/g, '') === cleanTarget));
            if (pt && Array.isArray(pt.dailyLogs)) {
                pt.dailyLogs.forEach(l => {
                    if (l && l.sessionNumber && !map.has(l.sessionNumber)) {
                        map.set(l.sessionNumber, l);
                    }
                });
            }

            const res = Array.from(map.values());
            res.sort((a, b) => (a.sessionNumber || 0) - (b.sessionNumber || 0));
            return res;
        } catch(e) {
            return [];
        }
    }

    // تصدير حزمة مزامنة كاملة فورية لكافة بيانات المنظومة (مرضى + جلسات + زيارات)
    function exportFullClinicSnapshot() {
        try {
            const patients = getCloudSyncedPatients();
            const visits = JSON.parse(localStorage.getItem('smart_geo_visits_history') || '[]');
            const allLocalPatients = JSON.parse(localStorage.getItem('smart_all_patients') || '[]');
            
            const logsMap = {};
            for (const p of [...patients, ...allLocalPatients]) {
                const pId = p.patientId || p.id;
                if (!pId || logsMap[pId]) continue;
                const pLogs = getPatientLogs(pId);
                if (pLogs.length > 0) {
                    logsMap[pId] = pLogs;
                }
            }

            return {
                version: '2026.2',
                exportedAt: new Date().toISOString(),
                patients: patients,
                allPatients: allLocalPatients,
                dailyLogsMap: logsMap,
                visits: visits
            };
        } catch(e) {
            return null;
        }
    }

    // استيراد وتطبيق حزمة مزامنة كاملة فوراً وتوحيد البيانات 100% بين الموبايل واللابتوب
    async function importFullClinicSnapshot(snapshot) {
        if (!snapshot) return false;
        try {
            // 1. استيراد المرضى من كافة مصفوفات الحزمة
            const importedPatients = [
                ...(Array.isArray(snapshot.patients) ? snapshot.patients : []),
                ...(Array.isArray(snapshot.allPatients) ? snapshot.allPatients : [])
            ];
            if (importedPatients.length > 0) {
                const currentList = getCloudSyncedPatients();
                for (const pt of importedPatients) {
                    if (!pt) continue;
                    const pIdRaw = pt.id || pt.patientId;
                    if (isDeletedPatient(pIdRaw)) continue;

                    const normalized = normalizeCloudPatientRecord(pt);
                    if (!normalized || isDeletedPatient(normalized.id)) continue;
                    const pId = normalized.id;
                    const idx = currentList.findIndex(x => pId && (x.id === pId || x.patientId === pId));
                    if (idx >= 0) {
                        const existing = currentList[idx];
                        const isDiff = (existing.painArea && normalized.painArea && existing.painArea !== normalized.painArea) ||
                                       (existing.chiefDiagnosis && normalized.chiefDiagnosis && existing.chiefDiagnosis !== normalized.chiefDiagnosis) ||
                                       (existing.timestamp && normalized.timestamp && Math.abs(new Date(existing.timestamp) - new Date(normalized.timestamp)) > 300000);
                        if (isDiff) {
                            normalized.id = pId + '_' + (normalized.timestamp ? Date.parse(normalized.timestamp) : Date.now());
                            normalized.patientId = normalized.id;
                            currentList.unshift(normalized);
                        } else {
                            currentList[idx] = { ...currentList[idx], ...normalized };
                        }
                    } else {
                        currentList.unshift(normalized);
                    }
                    if (window.SmartDB && typeof window.SmartDB.savePatient === 'function') {
                        window.SmartDB.savePatient(normalized, { skipCloudSync: true }).catch(() => {});
                    }
                    const rawAss = pt.assessment || pt.latestAssessment;
                    if (rawAss && window.SmartDB && typeof window.SmartDB.saveAssessment === 'function') {
                        try {
                            window.SmartDB.saveAssessment({
                                patientId: normalized.id || pId,
                                ...rawAss
                            }).catch(() => {});
                        } catch(e) {}
                    }
                }
                saveCloudSyncedPatients(currentList);
                try {
                    const existingAll = JSON.parse(localStorage.getItem('smart_all_patients') || '[]');
                    for (const pItem of currentList) {
                        const pId = pItem.id || pItem.patientId;
                        if (pId && !existingAll.some(x => (x.id === pId || x.patientId === pId))) {
                            existingAll.unshift(pItem);
                        }
                    }
                    localStorage.setItem('smart_all_patients', JSON.stringify(existingAll));
                } catch(e) {}
            }

            // 2. استيراد سجلات الجلسات اليومية
            if (snapshot.dailyLogsMap && typeof snapshot.dailyLogsMap === 'object') {
                // ✅ v29.19: تحويل الحفظ من تسلسلي إلى متوازٍ (Promise.all) لمنع تجميد 3 دقائق
                const logsEntries = Object.entries(snapshot.dailyLogsMap);
                await Promise.all(logsEntries.map(async ([pId, logs]) => {
                    if (!pId || !Array.isArray(logs)) return;
                    const lsKey = 'smart_daily_logs_' + pId;
                    const existing = JSON.parse(localStorage.getItem(lsKey) || '[]');
                    const dbSavePromises = [];
                    for (const l of logs) {
                        if (!l || !l.sessionNumber) continue;
                        const idx = existing.findIndex(x => x.sessionNumber === l.sessionNumber);
                        if (idx >= 0) existing[idx] = { ...existing[idx], ...l };
                        else existing.push(l);
                        if (window.SmartDB && typeof window.SmartDB.saveDailyLog === 'function') {
                            dbSavePromises.push(window.SmartDB.saveDailyLog(l, { skipCloudSync: true }).catch(() => {}));
                        }
                    }
                    existing.sort((a, b) => (a.sessionNumber || 0) - (b.sessionNumber || 0));
                    try {
                        localStorage.setItem(lsKey, JSON.stringify(existing));
                    } catch(qErr) {
                        // في حال امتلاء الذاكرة المؤقتة، يعتمد النظام كلياً على IndexedDB
                    }
                    // حفظ IndexedDB بالتوازي الكامل لمنع أي تعليق
                    if (dbSavePromises.length > 0) {
                        await Promise.all(dbSavePromises);
                    }
                    // تحديث فوري لإحصائيات المريض في القائمة السحابية
                    try {
                        const cList = getCloudSyncedPatients();
                        const pFound = cList.find(x => x.id === pId || x.patientId === pId);
                        if (pFound) {
                            pFound.logsCount = existing.length;
                            pFound.completedSessions = existing.length;
                            pFound.recoveryScore = Math.min(100, Math.round((existing.length / 7) * 100));
                            saveCloudSyncedPatients(cList);
                        }
                    } catch(e) {}
                }));
            }

            // 3. استيراد الزيارات الحقيقية فقط
            if (Array.isArray(snapshot.visits) && snapshot.visits.length > 0) {
                const VISITS_KEY = 'smart_geo_visits_history';
                let localVisits = [];
                try { localVisits = JSON.parse(localStorage.getItem(VISITS_KEY) || '[]'); } catch(e) {}
                for (const v of snapshot.visits) {
                    if (!v || !v.visitorId || String(v.visitorId).startsWith('vis_seed_')) continue;
                    const isDup = localVisits.some(lv => {
                        if (v.visitId && lv.visitId && lv.visitId === v.visitId) return true;
                        return lv.visitorId === v.visitorId && Math.abs(new Date(lv.timestamp || 0).getTime() - new Date(v.timestamp || 0).getTime()) < 120000;
                    });
                    if (!isDup) {
                        localVisits.push(v);
                    }
                }
                if (localVisits.length > 100) localVisits = localVisits.slice(-100);
                try {
                    localStorage.setItem(VISITS_KEY, JSON.stringify(localVisits));
                } catch(qErr) {
                    try { localStorage.setItem(VISITS_KEY, JSON.stringify(localVisits.slice(-25))); } catch(e) {}
                }
            }

            try { localStorage.setItem('smart_last_cloud_sync_time', Date.now().toString()); } catch(e) {}
            if (syncBroadcastChannel) {
                syncBroadcastChannel.postMessage({ type: 'FULL_SNAPSHOT_IMPORTED', timestamp: Date.now() });
            }
            return true;
        } catch(e) {
            console.error('Error importing clinic snapshot:', e);
            return false;
        }
    }

    // بث حزمة المزامنة الكاملة سحابياً لكافة الأجهزة
    async function broadcastFullClinicSnapshot() {
        const snapshot = exportFullClinicSnapshot();
        if (!snapshot) return false;
        const payload = {
            type: 'clinic_full_snapshot',
            snapshot: snapshot,
            timestamp: Date.now()
        };

        // 1. بث عبر شبكة MQTT مع الاحتفاظ بالحزمة للمتصلين لاحقاً (retain: true)
        mqttPublish(MQTT_TOPICS.SNAPSHOT, payload, { retain: true, qos: 1 });

        // 2. بث عبر BroadcastChannel للمتصفحات المفتوحة محلياً
        try {
            if (syncBroadcastChannel) {
                syncBroadcastChannel.postMessage(payload);
            }
        } catch(e) {}

        // 3. إرسال إشعار خفيف إلى NTFY دون إغراقه بحزم ضخمة تسبب تجاوز الحجم
        try {
            fetch('https://ntfy.sh', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    topic: 'wada3an_smart_check_clinic_sync_2026',
                    message: `تم تحديث حزمة العيادة سحابياً (${(snapshot.patients || []).length} مراجع)`,
                    title: 'Clinic Snapshot Updated'
                })
            }).catch(() => {});
        } catch(e) {}

        // 4. تحديث Master Hub إن كانت متاحة
        if (isMasterHubAllowed()) {
            try {
                fetch(CLOUD_MASTER_HUB_ENDPOINT, {
                    method: 'PUT',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                        name: 'SmartCheck_Global_Clinic_Master_Hub',
                        data: {
                            patients: snapshot.patients,
                            visits: snapshot.visits,
                            exportedAt: snapshot.exportedAt
                        }
                    })
                }).then(res => {
                    if (!res.ok) recordMasterHubFailure(res.status);
                }).catch(() => {});
            } catch(e) {}
        }

        return true;
    }

    // ترحيل زيارة متصفح جديدة سحابياً لكافة الأجهزة
    function dispatchVisitToCloud(visitRecord) {
        if (!visitRecord) return;
        try {
            // 1. بث فوري عبر MQTT
            mqttPublish(MQTT_TOPICS.VISITS, { visit: visitRecord, timestamp: Date.now() }, { qos: 1 });

            // 2. بث عبر BroadcastChannel
            try {
                if (syncBroadcastChannel) {
                    syncBroadcastChannel.postMessage({ type: 'VISIT_RECORDED', visit: visitRecord });
                }
            } catch(e) {}

            const rawBody = JSON.stringify(visitRecord);
            fetch(CLOUD_VISITS_ENDPOINT, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: rawBody
            }).catch(() => {});

            fetch('https://ntfy.sh', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    topic: 'wada3an_smart_check_visits_2026',
                    message: rawBody,
                    title: 'Visit Log'
                })
            }).catch(() => {});
        } catch (e) {}
    }

    // جلب كافة الزيارات المسجلة سحابياً من كافة الهواتف والكمبيوترات حول العالم (مع مهلة أمان قصوى 4 ثوانٍ)
    async function fetchCloudVisits() {
        try {
            const controller = new AbortController();
            const timeoutId = setTimeout(() => controller.abort(), 4000);
            const resp = await fetch(`${CLOUD_VISITS_ENDPOINT}/json?poll=1&since=all`, {
                cache: 'no-store',
                signal: controller.signal
            });
            clearTimeout(timeoutId);
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
                            if (String(v.visitorId).startsWith('vis_seed_')) continue;
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
                // ✅ v29.22: تحديث واجهة الزوار فوراً بعد حفظ الزيارات الجديدة
                if (typeof window.renderGeoAnalytics === 'function') {
                    window.renderGeoAnalytics();
                }
            }
        } catch(e) {}
    }

    // دالة توحيد وتدقيق السجل السحابي ومنع القيم الفارغة وتصحيح موضع الألم والتشخيص
    function normalizeCloudPatientRecord(pt) {
        if (!pt) return null;
        const pId = pt.patientId || pt.id || ('pat_' + Date.now().toString(36) + '_' + Math.random().toString(36).substr(2, 5));
        let pName = (pt.fullName || pt.name || '').trim();
        const pPh = (pt.phone || '').replace(/\D/g, '');
        if (/^(?:الاسم|الآسم|الإسم|اسمي|اسمها|اسمه|اسمك|اسم)$/i.test(pName)) {
            pName = pPh.length >= 7 ? `مراجع (${pPh.slice(-4)})` : '';
        }
        if (!pName && pPh.length >= 7) pName = `مراجع (${pPh.slice(-4)})`;

        const pPhone = pt.phone || '';
        
        // احتساب مؤشر كتلة الجسم BMI بدقة
        const w = parseFloat(pt.weight);
        const h = parseFloat(pt.height);
        let bmi = pt.bmi;
        if (!bmi && w > 0 && h > 0) {
            bmi = parseFloat((w / Math.pow(h / 100, 2)).toFixed(1));
        }

        // استخراج واستنتاج موضع الشكوى الحقيقي بذكاء إن كان فارغاً أو مفروضاً خطأً
        let resolvedPain = pt.painArea || pt.painAreaTitle || pt.selectedPoint || '';
        if (!resolvedPain || resolvedPain === 'العمود الفقري والمفاصل' || resolvedPain === 'العمود الفقري ومفاصل الحركة') {
            const textToSearch = ((pt.notes || '') + ' ' + (pt.mriReportText || '') + ' ' + (Array.isArray(pt.collectedSymptoms) ? pt.collectedSymptoms.join(' ') : '')).toLowerCase();
            if (/ظهر|قطنية|أسفل\s*الظهر|اسفل\s*الظهر|ديسك|غضروف/.test(textToSearch)) {
                resolvedPain = 'الفقرات القطنية وأسفل الظهر';
            } else if (/عرق\s*النسا|سياتيكا|كمثرية|sciatica/.test(textToSearch)) {
                resolvedPain = 'عضلات الأرداف ومسار عرق النسا';
            } else if (/عجز|عجزي|حوض|sacroiliac/.test(textToSearch)) {
                resolvedPain = 'المفصل العجزي الحوضي';
            } else if (/رقبة|رقبه|عنق|ديسك\s*رقبة|تصلب\s*رقبة|cervical|neck/.test(textToSearch)) {
                resolvedPain = 'الفقرات العنقية (الرقبة الخلفية)';
            } else if (/صدرية|بين\s*الكتفين|أعلى\s*الظهر|اعلى\s*الظهر|thoracic|أبهر|ابهر/.test(textToSearch)) {
                resolvedPain = 'الفقرات الصدرية وأعلى الظهر (منطقة الأبهر)';
            } else if (/ركبة|ركبه|صابونة|طقطقة\s*ركبة|احتكاك\s*ركبة|patella|knee/.test(textToSearch)) {
                resolvedPain = 'مفصل الركبة والصابونة';
            } else if (/كتف|كتفي|لوح\s*الكتف|كفة\s*مدورة|shoulder/.test(textToSearch)) {
                resolvedPain = 'مفصل الكتف والكفة المدورة';
            } else if (/كاحل|قدم|كعب|مشط|أكيليس|مسمار\s*كعب|ankle|foot/.test(textToSearch)) {
                resolvedPain = 'الكاحل ومفصل القدم';
            } else if (/(?:^|\s|[،.؟!,])(?:معصم|معصمي|المعصم|رسغ|رسغي|الرسغ|نفق\s*رسغي|نفق\s*الرسغ|كف\s*اليد|راحة\s*اليد|أصابع\s*اليد|اصابع\s*اليد|إبهام|ابهام|wrist|carpal)(?:$|\s|[،.؟!,])/i.test(textToSearch)) {
                resolvedPain = 'الرسغ ومفصل اليد';
            } else {
                // ✅ v29.22: لا نولّد موضع ألم وهمي — نبقي الحقل فارغاً ليعكس البيانات الحقيقية فقط
                resolvedPain = pt.painArea || pt.painAreaTitle || pt.selectedPoint || '';
            }
        }

        let resolvedDiag = pt.diagnosisTitle || pt.chiefDiagnosis || pt.condition || '';
        if (!resolvedDiag || resolvedDiag === 'فحص واستشارة سريرية' || resolvedDiag === 'استشارة وفحص سريري متكامل' || resolvedDiag === 'إجهاد ميكانيكي وظيفي في الأنسجة الداعمة') {
            if (resolvedPain.includes('ركبة')) {
                resolvedDiag = 'خشونة واحتكاك مفصل الركبة وإجهاد الصابونة';
            } else if (resolvedPain.includes('عنق') || resolvedPain.includes('رقب')) {
                resolvedDiag = 'تشنج عضلي عنقي وإجهاد الفقرات العنقية';
            } else if (resolvedPain.includes('كتف')) {
                resolvedDiag = 'متلازمة انحشار أوتار الكفة المدورة للكتف';
            } else if (resolvedPain.includes('كاحل') || resolvedPain.includes('قدم')) {
                resolvedDiag = 'إجهاد أربطة الكاحل والتهاب اللفافة الأخمصية';
            } else if (resolvedPain.includes('رسغ') || resolvedPain.includes('يد')) {
                resolvedDiag = 'متلازمة نفق الرسغ والتهاب أوتار اليد';
            } else if (resolvedPain.includes('عرق النسا') || resolvedPain.includes('سياتيكا')) {
                resolvedDiag = 'اعتلال الجذور العصبية القطنية (عرق النسا)';
            } else if (resolvedPain.includes('صدرية') || resolvedPain.includes('أبهر')) {
                resolvedDiag = 'متلازمة الأبهر والشد العضلي بين لوحي الكتف';
            } else {
                resolvedDiag = 'انزلاق غضروفي قطني خفيف وإجهاد عضلات أسفل الظهر';
            }
        }

        return {
            ...pt,
            id: pId,
            patientId: pId,
            name: pName,
            fullName: pName,
            phone: pPhone,
            age: pt.age || null,
            weight: pt.weight || null,
            height: pt.height || null,
            bmi: bmi || '',
            gender: pt.gender || 'male',
            painArea: resolvedPain,
            painAreaTitle: resolvedPain,
            selectedPoint: pt.selectedPoint || resolvedPain,
            chiefDiagnosis: resolvedDiag,
            diagnosisTitle: resolvedDiag,
            country: pt.country || 'دولي',
            city: (pt.city && pt.city !== 'غير محدد') ? pt.city : '',
            flag: pt.flag || '🌐',
            device: pt.device || 'Mobile',
            deviceIcon: pt.deviceIcon || '📱',
            createdAt: pt.createdAt || pt.timestamp || new Date().toISOString(),
            lastUpdated: new Date().toISOString()
        };
    }

    // جلب كافة المرضى المرحلين من السحابة بالتوازي الفوري لتقليل زمن الاستجابة وضمان جلب كافة السجلات
    // جلب كافة المرضى المرحلين من السحابة بالتوازي الفوري لتقليل زمن الاستجابة وضمان جلب كافة السجلات
    async function fetchCloudPatients() {
        const currentList = getCloudSyncedPatients();
        let changed = false;

        // ✅ v29.20: إطلاق طلب مزامنة فوري عبر MQTT لطلب اللقطة من أي جهاز نشط (الموبايل)
        try {
            if (mqttClient && mqttConnected) {
                mqttPublish(MQTT_TOPICS.SYNC_REQ, {
                    sender: 'admin_fetch_' + Date.now(),
                    device: 'admin',
                    requestedAt: Date.now()
                });
            }
        } catch(e) {}

        // تشغيل قناتي السحابة (Master Hub و NTFY) بالتوازي الفوري
        const tasks = [];

        // 1. القناة الأساسية السريعة (Master Cloud Hub) إن كانت متاحة
        if (isMasterHubAllowed()) {
            tasks.push((async () => {
                try {
                    const controller = new AbortController();
                    const timeoutId = setTimeout(() => controller.abort(), 1800);
                    const hubResp = await fetch(CLOUD_MASTER_HUB_ENDPOINT, { cache: 'no-store', signal: controller.signal });
                    clearTimeout(timeoutId);
                    if (hubResp.ok) {
                        const hubData = await hubResp.json();
                        if (hubData && hubData.error) {
                            recordMasterHubFailure(429);
                        } else if (hubData && hubData.data && Array.isArray(hubData.data.patients)) {
                            return { type: 'hub', patients: hubData.data.patients };
                        }
                    } else {
                        recordMasterHubFailure(hubResp.status);
                    }
                } catch(errHub) {}
                return null;
            })());
        }

        // 2. القناة الثانوية المضاعفة (Secondary ntfy Relay) — جلب الجديد فقط منذ آخر استطلاع ناجح
        tasks.push((async () => {
            try {
                // ✅ v29.30: جلب 'all' دائماً لضمان تحميل أي مريض تم تسجيله أو تحديثه سحابياً وعدم تفويته
                const sinceParam = 'all';
                const controller2 = new AbortController();
                const timeoutId2 = setTimeout(() => controller2.abort(), 8000);
                const pollUrl = `${CLOUD_SYNC_ENDPOINT}/json?poll=1&since=${sinceParam}`;
                const resp = await fetch(pollUrl, { cache: 'no-store', signal: controller2.signal });
                clearTimeout(timeoutId2);
                if (resp.ok) {
                    // حفظ الـ timestamp الحالي كنقطة بداية للاستطلاع التالي
                    localStorage.setItem('smart_ntfy_last_fetch_ts', Date.now().toString());
                    const text = await resp.text();
                    return { type: 'ntfy', text: text };
                }
            } catch(errNtfy) {}
            return null;
        })());

        const taskResults = await Promise.allSettled(tasks);

        for (const res of taskResults) {
            if (res.status !== 'fulfilled' || !res.value) continue;
            const itemVal = res.value;

            // معالجة بيانات Master Hub
            if (itemVal.type === 'hub' && Array.isArray(itemVal.patients)) {
                for (const pt of itemVal.patients) {
                    if (!pt) continue;
                    const pIdRaw = pt.id || pt.patientId;
                    if (isDeletedPatient(pIdRaw)) continue;

                    const normalized = normalizeCloudPatientRecord(pt);
                    if (!normalized || isDeletedPatient(normalized.id)) continue;

                    const pId = normalized.id;
                    const idx = currentList.findIndex(x => pId && (x.id === pId || x.patientId === pId));
                    if (idx >= 0) {
                        const existing = currentList[idx];
                        const existingDaily = existing.dailyLogs || [];
                        const incomingDaily = normalized.dailyLogs || normalized.logs || [];
                        const mergedDaily = [...existingDaily];
                        for (const idl of incomingDaily) {
                            if (!idl || !idl.sessionNumber) continue;
                            const mIdx = mergedDaily.findIndex(m => m.sessionNumber === idl.sessionNumber);
                            if (mIdx >= 0) mergedDaily[mIdx] = { ...mergedDaily[mIdx], ...idl };
                            else mergedDaily.push(idl);
                        }
                        normalized.dailyLogs = mergedDaily;
                        normalized.logs = mergedDaily;
                        currentList[idx] = {
                            ...existing,
                            ...normalized,
                            createdAt: existing.createdAt || normalized.createdAt || existing.timestamp || normalized.timestamp,
                            logsCount: (mergedDaily.length > 0) ? mergedDaily.length : Math.min(7, Math.max(existing.logsCount || 0, normalized.logsCount || 0)),
                            completedSessions: (mergedDaily.length > 0) ? mergedDaily.length : Math.min(7, Math.max(existing.completedSessions || 0, normalized.completedSessions || 0)),
                            recoveryScore: Math.max(existing.recoveryScore || 0, normalized.recoveryScore || 0)
                        };
                    } else {
                        currentList.unshift(normalized);
                        changed = true;
                    }

                    try {
                        if (window.SmartDB && typeof window.SmartDB.savePatient === 'function') {
                            window.SmartDB.savePatient(normalized, { skipCloudSync: true });
                        }
                        const rawAss = pt.assessment || pt.latestAssessment;
                        if (rawAss && window.SmartDB && typeof window.SmartDB.saveAssessment === 'function') {
                            window.SmartDB.saveAssessment({ patientId: pId, ...rawAss });
                        }
                    } catch(e) {}
                }
            }

            // معالجة بيانات NTFY Relay
            if (itemVal.type === 'ntfy' && itemVal.text) {
                const lines = itemVal.text.trim().split('\n');

                const processPatientRecord = (pt) => {
                    if (!pt) return;
                    if (pt.type === 'session_log_update' || (pt.log && pt.log.sessionNumber)) {
                        const logData = pt.log || pt;
                        if (logData && logData.patientId && logData.sessionNumber) {
                            if (isDeletedPatient(logData.patientId)) return;
                            try {
                                if (window.SmartDB && typeof window.SmartDB.saveDailyLog === 'function') {
                                    window.SmartDB.saveDailyLog(logData, { skipCloudSync: true }).catch(() => {});
                                }
                                const lsKey = 'smart_daily_logs_' + logData.patientId;
                                const existing = JSON.parse(localStorage.getItem(lsKey) || '[]');
                                const lIdx = existing.findIndex(l => l.sessionNumber === logData.sessionNumber);
                                if (lIdx >= 0) existing[lIdx] = { ...existing[lIdx], ...logData };
                                else existing.push(logData);
                                existing.sort((a, b) => (a.sessionNumber || 0) - (b.sessionNumber || 0));
                                localStorage.setItem(lsKey, JSON.stringify(existing));

                                const targetP = currentList.find(x => x.id === logData.patientId || x.patientId === logData.patientId);
                                if (targetP) {
                                    targetP.dailyLogs = targetP.dailyLogs || [];
                                    const plIdx = targetP.dailyLogs.findIndex(l => l.sessionNumber === logData.sessionNumber);
                                    if (plIdx >= 0) targetP.dailyLogs[plIdx] = { ...targetP.dailyLogs[plIdx], ...logData };
                                    else targetP.dailyLogs.push(logData);
                                    targetP.dailyLogs.sort((a, b) => (a.sessionNumber || 0) - (b.sessionNumber || 0));
                                    changed = true;
                                }
                            } catch(e) {}
                        }
                        return;
                    }

                    if (pt.id || pt.patientId || pt.phone || pt.fullName || pt.name) {
                        const pIdRaw = pt.id || pt.patientId;
                        if (isDeletedPatient(pIdRaw)) return;

                        const normalized = normalizeCloudPatientRecord(pt);
                        if (!normalized || isDeletedPatient(normalized.id)) return;

                        const pId = normalized.id;
                        const idx = currentList.findIndex(x => pId && (x.id === pId || x.patientId === pId));
                        if (idx >= 0) {
                            const existing = currentList[idx];
                            const existingDaily = existing.dailyLogs || [];
                            const incomingDaily = normalized.dailyLogs || normalized.logs || [];
                            const mergedDaily = [...existingDaily];
                            for (const idl of incomingDaily) {
                                if (!idl || !idl.sessionNumber) continue;
                                const mIdx = mergedDaily.findIndex(m => m.sessionNumber === idl.sessionNumber);
                                if (mIdx >= 0) mergedDaily[mIdx] = { ...mergedDaily[mIdx], ...idl };
                                else mergedDaily.push(idl);
                            }
                            normalized.dailyLogs = mergedDaily;
                            normalized.logs = mergedDaily;
                            currentList[idx] = {
                                ...existing,
                                ...normalized,
                                createdAt: existing.createdAt || normalized.createdAt || existing.timestamp || normalized.timestamp,
                                logsCount: (mergedDaily.length > 0) ? mergedDaily.length : Math.min(7, Math.max(existing.logsCount || 0, normalized.logsCount || 0)),
                                completedSessions: (mergedDaily.length > 0) ? mergedDaily.length : Math.min(7, Math.max(existing.completedSessions || 0, normalized.completedSessions || 0)),
                                recoveryScore: Math.max(existing.recoveryScore || 0, normalized.recoveryScore || 0)
                            };
                        } else {
                            currentList.unshift(normalized);
                            changed = true;
                        }

                        try {
                            if (window.SmartDB && typeof window.SmartDB.savePatient === 'function') {
                                window.SmartDB.savePatient(normalized, { skipCloudSync: true }).catch(() => {});
                            }
                            const rawAss = pt.assessment || pt.latestAssessment;
                            if (rawAss && window.SmartDB && typeof window.SmartDB.saveAssessment === 'function') {
                                window.SmartDB.saveAssessment({ patientId: pId, ...rawAss }).catch(() => {});
                            }
                            const allPtLogs = normalized.dailyLogs || normalized.logs || [];
                            if (allPtLogs.length > 0) {
                                const lsKey = 'smart_daily_logs_' + pId;
                                const existing = JSON.parse(localStorage.getItem(lsKey) || '[]');
                                for (const dl of allPtLogs) {
                                    if (!dl || !dl.sessionNumber) continue;
                                    const dlIdx = existing.findIndex(x => x.sessionNumber === dl.sessionNumber);
                                    if (dlIdx >= 0) existing[dlIdx] = { ...existing[dlIdx], ...dl };
                                    else existing.push(dl);
                                    if (window.SmartDB && typeof window.SmartDB.saveDailyLog === 'function') {
                                        window.SmartDB.saveDailyLog(dl, { skipCloudSync: true }).catch(() => {});
                                    }
                                }
                                existing.sort((a, b) => (a.sessionNumber || 0) - (b.sessionNumber || 0));
                                localStorage.setItem(lsKey, JSON.stringify(existing));
                            }
                        } catch(e) {}
                    }
                };

                let latestAttachmentItem = null;
                let latestInlineSnapshot = null;

                for (const line of lines) {
                    if (!line.trim()) continue;
                    try {
                        const item = JSON.parse(line);
                        if (item.event !== 'message') continue;

                        // 1. رسائل فورية نصية مدمجة
                        let pt = null;
                        if (item.message && item.message.trim().startsWith('{')) {
                            try { pt = JSON.parse(item.message); } catch(e) {}
                        }
                        if (pt) {
                            if (pt.type === 'clinic_full_snapshot' && pt.snapshot) {
                                latestInlineSnapshot = pt.snapshot;
                            } else {
                                processPatientRecord(pt);
                            }
                            continue;
                        }

                        // 2. تتبع أحدث ملف مرفق زمني (Full Snapshot) لتنزيله مرة واحدة فقط
                        if (item.attachment && item.attachment.url) {
                            if (!latestAttachmentItem || (item.time || 0) >= (latestAttachmentItem.time || 0)) {
                                latestAttachmentItem = item;
                            }
                        }
                    } catch(e) {}
                }

                // استيراد أحدث حزمة سحابية مدمجة لمرة واحدة فقط لتوفير الوقت ومنع التعليق
                if (latestInlineSnapshot) {
                    await importFullClinicSnapshot(latestInlineSnapshot);
                    changed = true;
                } else if (latestAttachmentItem && latestAttachmentItem.attachment && latestAttachmentItem.attachment.url) {
                    const attUrl = latestAttachmentItem.attachment.url;
                    const lastImportedUrl = localStorage.getItem('smart_last_imported_att_url');
                    // ✅ v29.24: إذا كانت القائمة المحلية فارغة، نقوم بالاستيراد حتماً حتى لو كان الرابط مسجلاً مسبقاً
                    const needsImport = (attUrl !== lastImportedUrl) || (getCloudSyncedPatients().length === 0);
                    if (needsImport) {
                        try {
                            const attController = new AbortController();
                            const attTimer = setTimeout(() => attController.abort(), 15000);
                            const attResp = await fetch(attUrl, { signal: attController.signal });
                            clearTimeout(attTimer);
                            if (attResp.ok) {
                                const attJson = await attResp.json();
                                if (attJson) {
                                    if (attJson.type === 'clinic_full_snapshot' && attJson.snapshot) {
                                        await importFullClinicSnapshot(attJson.snapshot);
                                        changed = true;
                                    } else if (Array.isArray(attJson.patients) || Array.isArray(attJson.allPatients)) {
                                        await importFullClinicSnapshot(attJson);
                                        changed = true;
                                    } else {
                                        processPatientRecord(attJson);
                                        changed = true;
                                    }
                                    localStorage.setItem('smart_last_imported_att_url', attUrl);
                                }
                            }
                        } catch(errAtt) {
                            console.warn('Snapshot attachment fetch warning:', errAtt);
                        }
                    }
                }
            }
        }

        // ✅ v29.24: إذا لم نجد أي مرضى محلياً بعد السحابة (بسبب حدود ntfy أو Master Hub)، نسترجع فوراً النسخة الاحتياطية الثابتة المدمجة بالعيادة
        if (getCloudSyncedPatients().length === 0) {
            try {
                const staticResp = await fetch('./data/clinic_backup_snapshot.json', { cache: 'no-cache' });
                if (staticResp.ok) {
                    const staticJson = await staticResp.json();
                    const snap = (staticJson && staticJson.snapshot) ? staticJson.snapshot : staticJson;
                    if (snap && (Array.isArray(snap.patients) || Array.isArray(snap.allPatients))) {
                        await importFullClinicSnapshot(snap);
                        changed = true;
                    }
                }
            } catch(eStatic) {
                console.warn('Fallback static snapshot fetch warning:', eStatic);
            }
        }

        // ✅ v29.24: إذا تم استيراد حزمة، نعيد قراءة القائمة الحديثة ولا نعيد حفظ القائمة القديمة
        if (changed) {
            currentList = getCloudSyncedPatients();
        } else {
            saveCloudSyncedPatients(currentList);
        }

        if (changed) {
            triggerAppUIRefresh();
        }
        return getCloudSyncedPatients();
    }

    // إنشاء اتصال لحظي دائم (Server-Sent Events) لتلقي أي مريض جديد فوراً دون إعادة تحميل الصفحة
    let cloudEventSource = null;
    function initCloudListener(callback) {
        if (typeof EventSource === 'undefined') return;
        if (cloudEventSource) return;

        try {
            cloudEventSource = new EventSource(`${CLOUD_SYNC_ENDPOINT}/sse`);
            cloudEventSource.onmessage = async (event) => {
                try {
                    const data = JSON.parse(event.data);
                    if (data.event === 'message') {
                        let pt = null;
                        if (data.attachment && data.attachment.url) {
                            try {
                                const attResp = await fetch(data.attachment.url);
                                if (attResp.ok) pt = await attResp.json();
                            } catch(e) {}
                        }
                        if (!pt && data.message && data.message.trim().startsWith('{')) {
                            try {
                                pt = JSON.parse(data.message);
                            } catch(e) {}
                        }
                        if (pt) {
                            if (pt.type === 'clinic_full_snapshot' && pt.snapshot) {
                                await importFullClinicSnapshot(pt.snapshot);
                                if (typeof callback === 'function') callback(null);
                                return;
                            }
                            if (pt.type === 'session_log_update' || (pt.log && pt.log.sessionNumber)) {
                                const logData = pt.log || pt;
                                if (logData && logData.patientId && logData.sessionNumber) {
                                    if (window.SmartDB && typeof window.SmartDB.saveDailyLog === 'function') {
                                        await window.SmartDB.saveDailyLog(logData, { skipCloudSync: true });
                                    }
                                    const lsKey = 'smart_daily_logs_' + logData.patientId;
                                    const existing = JSON.parse(localStorage.getItem(lsKey) || '[]');
                                    const lIdx = existing.findIndex(l => l.sessionNumber === logData.sessionNumber);
                                    if (lIdx >= 0) existing[lIdx] = { ...existing[lIdx], ...logData };
                                    else existing.push(logData);
                                    existing.sort((a, b) => (a.sessionNumber || 0) - (b.sessionNumber || 0));
                                    localStorage.setItem(lsKey, JSON.stringify(existing));
                                    if (typeof callback === 'function') callback(logData);
                                }
                                return;
                            }
                            if (pt.id || pt.patientId || pt.phone || pt.fullName || pt.name) {
                                const normalized = normalizeCloudPatientRecord(pt);
                                if (normalized) {
                                    const cList = getCloudSyncedPatients();
                                    const pIdx = cList.findIndex(x => normalized.id && (x.id === normalized.id || x.patientId === normalized.id));
                                    if (pIdx >= 0) cList[pIdx] = Object.assign({}, cList[pIdx], normalized);
                                    else cList.unshift(normalized);
                                    saveCloudSyncedPatients(cList);

                                    if (window.SmartDB && typeof window.SmartDB.savePatient === 'function') {
                                        window.SmartDB.savePatient(normalized, { skipCloudSync: true });
                                    }
                                    if (typeof callback === 'function') callback(normalized);
                                }
                            }
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

        // استبعاد أي زيارات لصفحات الإدارة واستبعاد أي سجلات وهمية سابقة (vis_seed_) لضمان مصداقية الأرقام 100%
        visitsHistory = (Array.isArray(visitsHistory) ? visitsHistory : []).filter(v => {
            if (!v || !v.visitorId) return false;
            if (String(v.visitorId).startsWith('vis_seed_')) return false;
            if (v.page && (v.page.includes('admin') || v.page.includes('calibrator'))) return false;
            return true;
        });

        // دمج زيارات المراجعين الفعليين المتاحين سحابياً ومحلياً
        const candidatePatients = [
            ...getCloudSyncedPatients(),
            ...JSON.parse(localStorage.getItem('smart_all_patients') || '[]')
        ];
        const seenIds = new Set(visitsHistory.map(v => v.visitorId));

        for (const p of candidatePatients) {
            if (!p) continue;
            const pId = p.patientId || p.id || p.phone;
            if (!pId || seenIds.has('vis_' + pId)) continue;
            seenIds.add('vis_' + pId);
            let pCountry = (p.country && p.country !== 'غير محدد') ? p.country : '';
            let pFlag = p.flag || '🌐';
            let pCity = (p.city && p.city !== 'غير محدد') ? p.city : '';

            if (!pCountry) {
                const ph = (p.phone || '').replace(/\D/g, '');
                if (ph.startsWith('962') || ph.startsWith('07')) { pCountry = 'الأردن'; pFlag = '🇯🇴'; pCity = pCity || 'عمّان'; }
                else if (ph.startsWith('966') || ph.startsWith('05')) { pCountry = 'المملكة العربية السعودية'; pFlag = '🇸🇦'; pCity = pCity || 'الرياض'; }
                else if (ph.startsWith('49')) { pCountry = 'ألمانيا'; pFlag = '🇩🇪'; pCity = pCity || 'فرانكفورت'; }
                else if (ph.startsWith('970') || ph.startsWith('972')) { pCountry = 'فلسطين'; pFlag = '🇵🇸'; pCity = pCity || 'القدس'; }
                else if (ph.startsWith('971')) { pCountry = 'الإمارات'; pFlag = '🇦🇪'; pCity = pCity || 'دبي'; }
                else if (ph.startsWith('964')) { pCountry = 'العراق'; pFlag = '🇮🇶'; pCity = pCity || 'بغداد'; }
                else if (ph.startsWith('20')) { pCountry = 'مصر'; pFlag = '🇪🇬'; pCity = pCity || 'القاهرة'; }
                else if (ph.startsWith('965')) { pCountry = 'الكويت'; pFlag = '🇰🇼'; pCity = pCity || 'الكويت'; }
                else if (ph.startsWith('974')) { pCountry = 'قطر'; pFlag = '🇶🇦'; pCity = pCity || 'الدوحة'; }
                else if (ph.startsWith('968')) { pCountry = 'سلطنة عمان'; pFlag = '🇴🇲'; pCity = pCity || 'مسقط'; }
                else if (ph.startsWith('973')) { pCountry = 'البحرين'; pFlag = '🇧🇭'; pCity = pCity || 'المنامة'; }
                else { pCountry = 'دولي'; pFlag = '🌐'; pCity = pCity || 'غير محدد'; }
            }

            visitsHistory.unshift({
                visitorId: 'vis_' + pId,
                country: pCountry,
                countryCode: p.countryCode || (pFlag === '🇯🇴' ? 'JO' : (pFlag === '🇩🇪' ? 'DE' : (pFlag === '🇸🇦' ? 'SA' : '🌐'))),
                city: pCity || 'غير محدد',
                flag: pFlag,
                device: p.device || 'Mobile',
                deviceIcon: p.deviceIcon || (p.device === 'Desktop' ? '💻' : '📱'),
                timestamp: p.createdAt || p.timestamp || new Date().toISOString(),
                page: '/'
            });
        }

        const countryMap = {};
        const totalVisits = visitsHistory.length;
        let mobileCount = 0;
        let desktopCount = 0;
        let tabletCount = 0;
        let lastVisit = null;

        visitsHistory.forEach((v, idx) => {
            const norm = normalizeCountryInfo(v.country, v.countryCode, v.flag);
            const cName = norm.name;
            const flag = norm.flag;
            const code = norm.code;
            const key = cName;

            v.country = cName;
            v.flag = flag;
            v.countryCode = code;

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

            const cityName = (v.city && v.city !== 'غير محدد' && v.city !== '—') ? v.city : 'غير محدد';
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
                    city: city,
                    count: count,
                    percentage: c.count > 0 ? Math.round((count / c.count) * 100) : 0
                }))
                .sort((a, b) => b.count - a.count);
            // توفير صيغة مصفوفة متوافقة مع واجهة الإدارة
            c.cities = c.citiesList;
            c.totalVisits = c.count;
            if (c.recentVisits.length > 50) c.recentVisits = c.recentVisits.slice(0, 50);
            return c;
        }).sort((a, b) => b.count - a.count);

        const totalDevices = mobileCount + desktopCount + tabletCount;
        const mobilePct = totalDevices > 0 ? Math.round((mobileCount / totalDevices) * 100) : 0;
        const desktopPct = totalDevices > 0 ? Math.round((desktopCount / totalDevices) * 100) : 0;
        const tabletPct = totalDevices > 0 ? Math.round((tabletCount / totalDevices) * 100) : 0;

        return {
            totalVisits: totalVisits,
            totalCountries: sortedCountries.length,
            uniqueCountriesCount: sortedCountries.length,
            mobileCount: mobileCount,
            desktopCount: desktopCount,
            tabletCount: tabletCount,
            mobilePct: mobilePct,
            mobilePercentage: mobilePct,
            desktopPct: desktopPct,
            desktopPercentage: desktopPct,
            tabletPct: tabletPct,
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

    // =========================================================================
    // ⏱️ مزامنة توقيت الجلسات وقفل/فتح الجلسات السحابي بين الإدارة وهواتف المرضى
    // =========================================================================
    let timingEventSource = null;
    let lastAppliedTimingTimestamp = parseInt(localStorage.getItem('smart_last_timing_sync_ts') || '0') || 0;

    // بث تحديث التوقيت من لوحة الإدارة إلى هاتف المريض سحابياً عبر كافة القنوات الموثوقة
    function dispatchTimingUpdateToCloud(timingData) {
        if (!timingData) return;
        const now = Date.now();
        const payload = {
            type: 'session_timing_update',
            ...timingData,
            timestamp: new Date().toISOString(),
            updatedAt: now
        };

        // 1. بث فوري عبر شبكة MQTT لجميع الهواتف واللابتوبات
        mqttPublish(MQTT_TOPICS.TIMING, payload, { qos: 1 });

        // 2. بث عبر BroadcastChannel لجميع التبويبات المفتوحة محلياً
        try {
            if (syncBroadcastChannel) {
                syncBroadcastChannel.postMessage(payload);
            }
        } catch(e) {}

        const rawJson = JSON.stringify(payload);

        // 3. إرسال إلى NTFY (قناة التوقيت) كنص خام مباشر
        try {
            fetch(CLOUD_TIMING_ENDPOINT, {
                method: 'POST',
                body: rawJson
            }).catch(() => {});
        } catch (e) {}

        // 4. إرسال إلى NTFY بصيغة JSON القياسية الرسمية
        try {
            fetch('https://ntfy.sh', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    topic: 'wada3an_smart_check_timing_sync_2026',
                    message: rawJson,
                    title: 'Timing Update'
                })
            }).catch(() => {});
        } catch (e) {}

        // 5. إرسال إلى NTFY القناة المركزية
        try {
            fetch(CLOUD_SYNC_ENDPOINT, {
                method: 'POST',
                body: rawJson
            }).catch(() => {});
        } catch (e) {}

        // 6. حفظ التحديث اللحظي في السحابة المركزية العالمية (Master Cloud Hub) إن كانت متاحة
        if (isMasterHubAllowed()) {
            try {
                fetch(CLOUD_MASTER_HUB_ENDPOINT, { cache: 'no-store' })
                    .then(r => {
                        if (!r.ok) { recordMasterHubFailure(r.status); return null; }
                        return r.json();
                    })
                    .then(masterObj => {
                        if (!masterObj) return;
                        const currentData = (masterObj && masterObj.data) ? masterObj.data : {};
                        currentData.latestTimingUpdate = payload;
                        currentData.lastTimingTimestamp = now;
                        return fetch(CLOUD_MASTER_HUB_ENDPOINT, {
                            method: 'PUT',
                            headers: { 'Content-Type': 'application/json' },
                            body: JSON.stringify({
                                name: 'SmartCheck_Global_Clinic_Master_Hub',
                                data: currentData
                            })
                        });
                    }).catch(() => {});
            } catch(e) {}
        }
    }

    // تحديث مباشر وفوري لعناصر الساعة وأزرار القفل في الصفحة المعروضة حالياً
    function updateLiveClockDomElements(update) {
        try {
            const elHours = document.getElementById('countdown-hours');
            const elMins = document.getElementById('countdown-mins');
            const elSecs = document.getElementById('countdown-secs');
            const wrapper = document.getElementById('session-completion-control-wrapper');

            if (update.forceUnlock) {
                if (elHours) elHours.textContent = '00';
                if (elMins) elMins.textContent = '00';
                if (elSecs) elSecs.textContent = '00';

                // إيقاف أي مؤقت نشط
                if (window.activeCountdownInterval) {
                    clearInterval(window.activeCountdownInterval);
                    window.activeCountdownInterval = null;
                }

                // إيقاف دورة الاستعلام عند اكتمال الفتح
                if (window.step5TimingPollInterval) {
                    clearInterval(window.step5TimingPollInterval);
                    window.step5TimingPollInterval = null;
                }

                // تحديث حاوية الزر إلى الحالة النشطة المفتوحة وإزالة أنيميشن الإطار النابض
                if (wrapper) {
                    wrapper.className = '';
                    wrapper.style.border = 'none';
                    wrapper.style.boxShadow = 'none';
                    wrapper.style.background = 'transparent';
                    wrapper.style.padding = '0';
                    const currentDay = update.sessionNum || (window.activePatient && window.activePatient.currentSessionDay) || 2;
                    const pId = update.patientId || (window.activePatient && (window.activePatient.patientId || window.activePatient.id)) || localStorage.getItem('smart_current_patient_id') || '';
                    wrapper.innerHTML = `
                        <div style="text-align: center; margin-top: 25px;">
                            <div style="text-align: center; margin-bottom: 14px;">
                                <span style="font-size: 1.5em; font-weight: 900; color: #d4af37; text-shadow: 0 0 16px rgba(212, 175, 55, 0.6), 0 2px 4px rgba(0,0,0,0.8); letter-spacing: 0.8px; display: inline-block;">الجلسة التالية</span>
                            </div>
                            <div style="background: rgba(16, 185, 129, 0.15); border: 1.5px solid #10b981; border-radius: 12px; padding: 12px; margin-bottom: 14px; color: #6ee7b7; font-weight: bold; font-size: 0.95em;">
                                🔓 تم فتح الجلسة لك الآن من قبل المعالج! يمكنك حفظ التقييم ومتابعة الخطة 🚀
                            </div>
                            <button type="button" onclick="openSessionAssessmentModal('${pId}', ${currentDay})" class="royal-clinical-next-btn active-unlocked" style="width: 100%; max-width: 620px; margin: 0 auto; background: linear-gradient(180deg, #10b981 0%, #059669 50%, #047857 51%, #065f46 100%) !important; color: #ffffff !important; border: 2px solid #6ee7b7 !important; border-radius: 50px !important; padding: 10px 24px 10px 14px !important; font-size: 1.15em !important; font-weight: 900 !important; letter-spacing: 0.5px; cursor: pointer; display: flex !important; align-items: center !important; justify-content: space-between !important; gap: 14px !important; box-shadow: 0 8px 25px rgba(16, 185, 129, 0.55), inset 0 2px 4px rgba(255, 255, 255, 0.7), 0 2px 4px rgba(0, 0, 0, 0.3) !important; transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1); position: relative; overflow: hidden; text-shadow: 0 1px 3px rgba(0, 0, 0, 0.8) !important; box-sizing: border-box;">
                                <!-- Left Glossy Orb Icon Circle -->
                                <div style="width: 46px; height: 46px; border-radius: 50%; background: linear-gradient(180deg, rgba(255, 255, 255, 0.5) 0%, rgba(255, 255, 255, 0.1) 45%, rgba(0, 0, 0, 0.25) 50%, rgba(0, 0, 0, 0.4) 100%), linear-gradient(135deg, #10b981 0%, #047857 100%); border: 2.5px solid #ffffff; box-shadow: 0 4px 10px rgba(0, 0, 0, 0.4), inset 0 2px 4px rgba(255, 255, 255, 0.8); display: flex; align-items: center; justify-content: center; flex-shrink: 0;">
                                    <svg width="22" height="22" viewBox="0 0 24 24" fill="#ffffff" style="margin-left: 2px; filter: drop-shadow(0 1px 2px rgba(0,0,0,0.5));"><polygon points="6,4 20,12 6,20"/></svg>
                                </div>
                                <!-- Main Text -->
                                <span style="flex-grow: 1; text-align: center; font-size: 1.08em; font-weight: 900; color: #ffffff !important; text-shadow: 0 2px 4px rgba(0, 0, 0, 0.7) !important;">
                                    حفظ تسجيل الجلسة (#${currentDay}) وتوثيق التقييم والانتقال للجلسة التالية 🚀
                                </span>
                                <!-- Right Arrow Chevron -->
                                <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#ffffff" stroke-width="3" stroke-linecap="round" stroke-linejoin="round" style="flex-shrink: 0; filter: drop-shadow(0 1px 2px rgba(0,0,0,0.6));"><polyline points="15 18 9 12 15 6"/></svg>
                            </button>
                        </div>
                    `;
                }
            } else if (update.targetTime && update.targetTime > Date.now()) {
                const totalDur = update.totalDurationMs || (update.targetTime - Date.now());
                const currentDay = update.sessionNum || (window.activePatient && window.activePatient.currentSessionDay) || 2;
                const pId = update.patientId || (window.activePatient && (window.activePatient.patientId || window.activePatient.id)) || localStorage.getItem('smart_current_patient_id') || '';

                if (wrapper && !wrapper.querySelector('.royal-clinical-lock-btn')) {
                    wrapper.className = '';
                    wrapper.style.border = 'none';
                    wrapper.style.boxShadow = 'none';
                    wrapper.style.background = 'transparent';
                    wrapper.style.padding = '0';
                    wrapper.innerHTML = `
                        <div style="text-align: center; margin-top: 25px;">
                            <div style="text-align: center; margin-bottom: 14px;">
                                <span style="font-size: 1.5em; font-weight: 900; color: #d4af37; text-shadow: 0 0 16px rgba(212, 175, 55, 0.6), 0 2px 4px rgba(0,0,0,0.8); letter-spacing: 0.8px; display: inline-block;">الجلسة التالية</span>
                            </div>
                            <div class="royal-clinical-lock-btn">
                                <div style="display: flex; align-items: center; gap: 12px; text-align: right; flex-grow: 1;">
                                    <div style="width: 44px; height: 44px; border-radius: 50%; background: linear-gradient(180deg, rgba(255, 255, 255, 0.4) 0%, rgba(255, 255, 255, 0.05) 45%, rgba(0, 0, 0, 0.3) 50%, rgba(0, 0, 0, 0.5) 100%), linear-gradient(135deg, #d4af37 0%, #aa820a 100%); border: 2px solid #fef08a; box-shadow: 0 4px 10px rgba(0, 0, 0, 0.5), inset 0 2px 4px rgba(255, 255, 255, 0.6); display: flex; align-items: center; justify-content: center; flex-shrink: 0;">
                                        <span style="font-size: 1.25em; filter: drop-shadow(0 2px 3px rgba(0,0,0,0.5));">🔒</span>
                                    </div>
                                    <div>
                                        <div style="color: #ffffff; font-weight: 800; font-size: 1em; line-height: 1.35; text-shadow: 0 1px 3px rgba(0,0,0,0.8);">
                                            سيتم تفعيل الزر بعد انتهاء الوقت
                                        </div>
                                        <div style="color: #94a3b8; font-size: 0.82em; margin-top: 3px; display: flex; align-items: center; gap: 6px;">
                                            <span>⏳ متبقي:</span>
                                            <strong id="recovery-progress-remaining-text" style="color: #38bdf8; font-family: monospace; font-size: 1.05em;">...</strong>
                                        </div>
                                    </div>
                                </div>
                                <div class="circular-progress-ring-wrap" title="نسبة اكتمال فترة استشفاء الأنسجة">
                                    <svg width="54" height="54" viewBox="0 0 54 54">
                                        <defs>
                                            <linearGradient id="circular-gauge-grad" x1="0%" y1="0%" x2="100%" y2="100%">
                                                <stop offset="0%" stop-color="#38bdf8" />
                                                <stop offset="50%" stop-color="#10b981" />
                                                <stop offset="100%" stop-color="#f59e0b" />
                                            </linearGradient>
                                        </defs>
                                        <circle cx="27" cy="27" r="22" fill="transparent" stroke="rgba(255, 255, 255, 0.12)" stroke-width="4.5" />
                                        <circle id="circular-progress-stroke" cx="27" cy="27" r="22" fill="transparent" stroke="url(#circular-gauge-grad)" stroke-width="4.5" stroke-linecap="round" stroke-dasharray="138.23" stroke-dashoffset="138.23" />
                                    </svg>
                                    <div style="position: absolute; display: flex; flex-direction: column; align-items: center; justify-content: center; pointer-events: none;">
                                        <span id="circular-progress-pct" style="font-size: 0.72em; font-weight: 900; color: #38bdf8; font-family: monospace; line-height: 1;">0%</span>
                                        <span style="font-size: 0.48em; color: #94a3b8; letter-spacing: 0.5px; text-transform: uppercase; margin-top: 1px;">Loading</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    `;
                }

                if (window.PatientFlow && typeof window.PatientFlow.startCountdownTimer === 'function') {
                    window.PatientFlow.startCountdownTimer(update.targetTime, {
                        hours: elHours,
                        minutes: elMins,
                        seconds: elSecs
                    }, () => {
                        if (typeof window.loadPatientRecoveryDashboard === 'function') {
                            window.loadPatientRecoveryDashboard(update.patientId);
                        }
                    }, totalDur);
                }
            }
        } catch(e) {}
    }

    // تطبيق التحديث على هاتف المريض وتحديث العداد والشاشة فوراً
    function applyTimingUpdateLocally(update) {
        if (!update) return false;
        if (update.type !== 'session_timing_update' && update.forceUnlock === undefined && update.targetTime === undefined) {
            return false;
        }

        const targetPid = update.patientId || '';
        const targetPhone = (update.patientPhone || '').replace(/\D/g, '');
        const targetName = (update.patientName || '').trim();

        // استخراج معرف ورقم المريض الحالي على هذا الجهاز
        let currentPid = (window.SmartDB && typeof window.SmartDB.getCurrentSessionPatientId === 'function') 
            ? window.SmartDB.getCurrentSessionPatientId() 
            : localStorage.getItem('smart_current_patient_id');

        let currentPhone = localStorage.getItem('smart_patient_phone') || '';
        let currentName = '';

        if (window.activePatient) {
            if (!currentPid) currentPid = window.activePatient.patientId || window.activePatient.id;
            if (!currentPhone) currentPhone = window.activePatient.phone || '';
            currentName = (window.activePatient.name || window.activePatient.fullName || '').trim();
        }

        const cleanCurrentPhone = String(currentPhone).replace(/\D/g, '');

        let isMatch = false;

        // إذا تم تفعيل خيار البث العام لجميع الأجهزة النشطة أو إذا كان زر العداد معروضاً على الشاشة حالياً
        const isClockOnScreen = !!document.getElementById('session-completion-control-wrapper') || !!document.getElementById('countdown-hours');
        if (update.broadcastToAll || update.global || isClockOnScreen) {
            isMatch = true;
        }

        // 1. تطابق مباشر بالمعرف
        if (!isMatch && targetPid && currentPid && (targetPid === currentPid)) {
            isMatch = true;
        }
        // 2. تطابق رقمي بالمعرف
        else if (!isMatch && targetPid && currentPid) {
            const c1 = String(targetPid).replace(/\D/g, '');
            const c2 = String(currentPid).replace(/\D/g, '');
            if (c1 && c2 && (c1 === c2 || (c1.length >= 7 && c2.length >= 7 && (c1.includes(c2) || c2.includes(c1))))) {
                isMatch = true;
            }
        }

        // 3. تطابق برقم الهاتف (مقارنة آخر 7 أرقام لتجاوز مفتاح الدولة)
        if (!isMatch && targetPhone && cleanCurrentPhone) {
            if (targetPhone === cleanCurrentPhone) {
                isMatch = true;
            } else if (targetPhone.length >= 7 && cleanCurrentPhone.length >= 7) {
                if (targetPhone.slice(-7) === cleanCurrentPhone.slice(-7)) {
                    isMatch = true;
                }
            }
        }

        // 4. تطابق باسم المريض
        if (!isMatch && targetName && currentName && targetName === currentName) {
            isMatch = true;
        }

        // إذا لم يكن هناك تطابق
        if (!isMatch) {
            return false;
        }

        // تسجيل أحدث طابع زمني وبصمة التحديث لتفادي المعالجة المكررة
        const updTimestamp = update.updatedAt || Date.now();
        lastAppliedTimingTimestamp = Math.max(lastAppliedTimingTimestamp, updTimestamp);
        try { 
            localStorage.setItem('smart_last_timing_sync_ts', String(lastAppliedTimingTimestamp));
            const sig = `${update.patientId || 'all'}_${update.sessionNum || 2}_${update.forceUnlock ? 'unlocked' : (update.targetTime || 0)}_${update.totalDurationMs || 0}`;
            localStorage.setItem('smart_last_applied_timing_sig', sig);
        } catch(e) {}

        const pKey = currentPid || targetPid;
        const keysToUpdate = new Set();
        if (pKey) keysToUpdate.add(pKey);
        if (targetPid) keysToUpdate.add(targetPid);
        if (cleanCurrentPhone) keysToUpdate.add(cleanCurrentPhone);
        if (targetPhone) keysToUpdate.add(targetPhone);
        keysToUpdate.add('global');

        const now = Date.now();
        for (const key of keysToUpdate) {
            if (update.forceUnlock) {
                localStorage.setItem(`force_unlock_${key}`, 'true');
                localStorage.removeItem(`custom_target_time_${key}`);
                localStorage.removeItem(`custom_total_duration_${key}`);
                localStorage.removeItem(`sessionStartTime_${key}_${update.sessionNum || 1}`);
                localStorage.removeItem(`sessionStartTime_${key}_${update.sessionNum || 2}`);
            } else if (update.targetTime && update.targetTime > now) {
                localStorage.setItem(`custom_target_time_${key}`, String(update.targetTime));
                if (update.totalDurationMs) {
                    localStorage.setItem(`custom_total_duration_${key}`, String(update.totalDurationMs));
                }
                localStorage.removeItem(`force_unlock_${key}`);
            }
        }

        // إطلاق إشعار التحديث المحلي لعداد الثواني
        localStorage.setItem('countdownUpdated', String(now));

        // إطلاق حدث في الـ DOM
        try {
            window.dispatchEvent(new CustomEvent('smart_countdown_updated', { detail: update }));
        } catch(e) {}

        // تحديث عناصر الساعة وأزرار القفل في الصفحة فوراً
        updateLiveClockDomElements(update);

        // إعادة تنشيط لوحة المريض بالكامل
        if (typeof window.loadPatientRecoveryDashboard === 'function') {
            window.loadPatientRecoveryDashboard(pKey);
        } else if (typeof loadPatientRecoveryDashboard === 'function') {
            loadPatientRecoveryDashboard(pKey);
        }

        if (typeof window.updatePatientCountdown === 'function') {
            window.updatePatientCountdown();
        }

        if (typeof window.showToast === 'function') {
            if (update.forceUnlock) {
                window.showToast('🔓 قام المعالج بفتح الجلسة لك الآن بنجاح!', 'success');
            } else {
                window.showToast('⏱️ قام المعالج بتعديل توقيت جلستك!', 'info');
            }
        }

        return true;
    }

    // جلب التعديلات السحابية للتوقيت مع حماية صارمة من التراكم والتأخير
    let isFetchingTiming = false;
    let lastTimingFetchTime = 0;
    async function fetchRemoteTimingUpdates() {
        if (isFetchingTiming) return;
        if (Date.now() - lastTimingFetchTime < 15000) return; // منع التكرار المتتالي في أقل من 15 ثانية
        isFetchingTiming = true;
        lastTimingFetchTime = Date.now();

        const candidateUpdates = [];

        try {
            // 1. جلب من قناة التوقيت المخصصة عبر NTFY مع حماية AbortController سريعة (2 ثانية)
            try {
                const controller = new AbortController();
                const timeoutId = setTimeout(() => controller.abort(), 2000);
                const resp = await fetch(`${CLOUD_TIMING_ENDPOINT}/json?poll=1&since=all`, {
                    cache: 'no-store',
                    signal: controller.signal
                });
                clearTimeout(timeoutId);
                if (resp.ok) {
                    const text = await resp.text();
                    if (text) {
                        const lines = text.trim().split('\n');
                        for (const line of lines) {
                            if (!line.trim()) continue;
                            try {
                                const item = JSON.parse(line);
                                if (item.event === 'message' && item.message) {
                                    let parsed = null;
                                    try { parsed = JSON.parse(item.message); } catch(e) { parsed = item.message; }
                                    if (parsed && (parsed.type === 'session_timing_update' || parsed.forceUnlock !== undefined || parsed.targetTime !== undefined)) {
                                        candidateUpdates.push(parsed);
                                    }
                                }
                            } catch(e) {}
                        }
                    }
                }
            } catch(e) {}

            // 2. جلب أيضاً من القناة المركزية للعيادة كاحتياطي دائم بمهلة قصوى 2 ثانية
            try {
                const controller2 = new AbortController();
                const timeoutId2 = setTimeout(() => controller2.abort(), 2000);
                const resp2 = await fetch(`${CLOUD_SYNC_ENDPOINT}/json?poll=1&since=all`, {
                    cache: 'no-store',
                    signal: controller2.signal
                });
                clearTimeout(timeoutId2);
                if (resp2.ok) {
                    const text2 = await resp2.text();
                    if (text2) {
                        const lines2 = text2.trim().split('\n');
                        for (const line of lines2) {
                            if (!line.trim()) continue;
                            try {
                                const item = JSON.parse(line);
                                if (item.event === 'message' && item.message) {
                                    let parsed = null;
                                    try { parsed = JSON.parse(item.message); } catch(e) { parsed = item.message; }
                                    if (parsed && (parsed.type === 'session_timing_update' || parsed.forceUnlock !== undefined || parsed.targetTime !== undefined)) {
                                        candidateUpdates.push(parsed);
                                    }
                                }
                            } catch(e) {}
                        }
                    }
                }
            } catch(e) {}

            // 3. جلب من السحابة المركزية العالمية Master Cloud Hub إن كانت متاحة
            if (isMasterHubAllowed()) {
                try {
                    const controller3 = new AbortController();
                    const timeoutId3 = setTimeout(() => controller3.abort(), 1800);
                    const resp3 = await fetch(CLOUD_MASTER_HUB_ENDPOINT, {
                        cache: 'no-store',
                        signal: controller3.signal
                    });
                    clearTimeout(timeoutId3);
                    if (resp3.ok) {
                        const masterObj = await resp3.json();
                        if (masterObj && masterObj.data && masterObj.data.latestTimingUpdate) {
                            candidateUpdates.push(masterObj.data.latestTimingUpdate);
                        }
                    }
                } catch(e) {}
            }
        } finally {
            isFetchingTiming = false;
        }

        // فرز كافة التحديثات وتطبيق الأحدث
        if (candidateUpdates.length > 0) {
            candidateUpdates.sort((a, b) => (a.updatedAt || 0) - (b.updatedAt || 0));
            const latest = candidateUpdates[candidateUpdates.length - 1];
            if (latest) {
                const updateSig = `${latest.patientId || 'all'}_${latest.sessionNum || 2}_${latest.forceUnlock ? 'unlocked' : (latest.targetTime || 0)}_${latest.totalDurationMs || 0}`;
                const lastAppliedSig = localStorage.getItem('smart_last_applied_timing_sig');
                const updTime = latest.updatedAt || Date.now();
                if (updateSig !== lastAppliedSig || updTime > lastAppliedTimingTimestamp) {
                    applyTimingUpdateLocally(latest);
                }
            }
        }
    }

    // الاستماع اللحظي الدائم (SSE) على هاتف المريض
    function initTimingListener() {
        if (typeof EventSource === 'undefined') return;
        if (timingEventSource) return;

        try {
            timingEventSource = new EventSource(`${CLOUD_TIMING_ENDPOINT}/sse`);
            timingEventSource.onmessage = (event) => {
                try {
                    const data = JSON.parse(event.data);
                    if (data.event === 'message' && data.message) {
                        let parsed = null;
                        try { parsed = JSON.parse(data.message); } catch(e) { parsed = data.message; }
                        if (parsed && (parsed.type === 'session_timing_update' || parsed.forceUnlock !== undefined || parsed.targetTime !== undefined)) {
                            const updateSig = `${parsed.patientId || 'all'}_${parsed.sessionNum || 2}_${parsed.forceUnlock ? 'unlocked' : (parsed.targetTime || 0)}_${parsed.totalDurationMs || 0}`;
                            const lastAppliedSig = localStorage.getItem('smart_last_applied_timing_sig');
                            const updTime = parsed.updatedAt || Date.now();
                            if (updateSig !== lastAppliedSig || updTime > lastAppliedTimingTimestamp) {
                                applyTimingUpdateLocally(parsed);
                            }
                        }
                    }
                } catch(e) {}
            };
            timingEventSource.onerror = () => {};
        } catch (e) {}

        // الاستماع عبر BroadcastChannel للمتصفحات المفتوحة محلياً
        try {
            if (syncBroadcastChannel) {
                syncBroadcastChannel.addEventListener('message', (event) => {
                    if (event.data && event.data.type === 'session_timing_update') {
                        const updateSig = `${event.data.patientId || 'all'}_${event.data.sessionNum || 2}_${event.data.forceUnlock ? 'unlocked' : (event.data.targetTime || 0)}_${event.data.totalDurationMs || 0}`;
                        const lastAppliedSig = localStorage.getItem('smart_last_applied_timing_sig');
                        const updTime = event.data.updatedAt || Date.now();
                        if (updateSig !== lastAppliedSig || updTime > lastAppliedTimingTimestamp) {
                            applyTimingUpdateLocally(event.data);
                        }
                    }
                });
            }
        } catch(e) {}
    }

    // تصدير واجهة الترحيل السحابي
    window.SmartCloudSync = {
        dispatchPatient: dispatchPatientToCloud,
        dispatchSessionLog: dispatchSessionLogToCloud,
        getPatientLogs: getPatientLogs,
        exportSnapshot: exportFullClinicSnapshot,
        importSnapshot: importFullClinicSnapshot,
        broadcastSnapshot: broadcastFullClinicSnapshot,
        getPatients: getCloudSyncedPatients,
        fetchCloudPatients: fetchCloudPatients,
        initCloudListener: initCloudListener,
        subscribe: subscribeToPatientUpdates,
        dispatchVisit: dispatchVisitToCloud,
        fetchCloudVisits: fetchCloudVisits,
        getAnalytics: getGeoAnalyticsSummary,
        getDetailedAnalytics: getDetailedVisitorStats,
        getDetailedVisitorStats: getDetailedVisitorStats,
        clearVisits: clearVisitsHistory,
        exportVisits: exportVisitsJSON,
        dispatchTimingUpdate: dispatchTimingUpdateToCloud,
        applyTimingUpdate: applyTimingUpdateLocally,
        fetchRemoteTimingUpdates: fetchRemoteTimingUpdates,
        initTimingListener: initTimingListener,
        isMqttConnected: () => mqttConnected,
        initMqttBus: initMqttBus,
        resetCircuit: resetMasterHubCircuit,
        normalizeCountryInfo: normalizeCountryInfo,
        isDeletedPatient: isDeletedPatient,
        broadcastPatientDeletion: function(patientId, allIds) {
            try {
                const ids = Array.isArray(allIds) ? allIds : [patientId];
                const curDeleted = JSON.parse(localStorage.getItem('smart_deleted_patient_ids') || '[]');
                const updated = Array.from(new Set([...curDeleted, ...ids]));
                localStorage.setItem('smart_deleted_patient_ids', JSON.stringify(updated));

                const cList = getCloudSyncedPatients().filter(p => !ids.includes(p.patientId) && !ids.includes(p.id));
                saveCloudSyncedPatients(cList);

                mqttPublish(MQTT_TOPICS.PATIENTS, {
                    type: 'PATIENT_DELETED',
                    patientId: patientId,
                    allIds: ids,
                    timestamp: Date.now()
                }, { qos: 1 });
            } catch(e) {
                console.warn('[CloudSync] broadcastPatientDeletion error:', e);
            }
        },
        flushPendingVisits: flushPendingCloudVisits,
        // مزامنة كاملة قسرية فائقة السرعة: جلب كل شيء من جميع المصادر بالتوازي ثم بث snapshot للأجهزة الأخرى
        forceFullSync: async function() {
            try {
                if (mqttClient && mqttConnected) {
                    mqttPublish(MQTT_TOPICS.SYNC_REQ, {
                        sender: 'admin_force_' + Date.now(),
                        device: 'admin',
                        requestedAt: Date.now()
                    });
                }
            } catch(e) {}

            await Promise.all([fetchCloudPatients(), fetchCloudVisits()]); // جلب بالتوازي السريع
            await new Promise(r => setTimeout(r, 800)); // نافذة استقبال لرد MQTT
            await broadcastFullClinicSnapshot(); // بث للأجهزة الأخرى
            return getCloudSyncedPatients().length;
        }
    };

    // تفريغ أي زيارات معلقة تم جمعها قبل اكتمال تحميل السكربت
    try {
        if (typeof window !== 'undefined') {
            setTimeout(flushPendingCloudVisits, 1000);
            setTimeout(flushPendingCloudVisits, 3500);
        }
    } catch(e) {}

})();
