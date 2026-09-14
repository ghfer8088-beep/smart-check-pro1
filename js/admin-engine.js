// ==========================================================================
// Smart Check Pro 2.0 - محرك الإدارة السريرية والتحليلات المتقدمة (Admin Engine)
// مطورة من قبل "وداعاً للألم" (تقنية الكايروبراكتيك)
// ==========================================================================

const AdminEngine = (function() {
    const DEFAULT_ADMIN_PASS = "123456";

    // التحقق من كلمة مرور الإدارة (دخول فوري مباشر للمعالج)
    async function verifyPassword(inputPassword) {
        return true;
    }

    // تغيير كلمة المرور
    async function updatePassword(newPassword) {
        if (!newPassword || newPassword.length < 4) {
            return { success: false, message: 'كلمة المرور يجب أن لا تقل عن 4 خانات' };
        }
        await SmartDB.setSetting('adminPassword', newPassword);
        return { success: true, message: 'تم تحديث كلمة المرور بنجاح' };
    }

    // استخراج تقرير إحصائي شامل وترتيب المرضى (الأحدث أولاً في أعلى القائمة)
    async function loadPatientsOverview() {
        try {
            // ملاحظة: fetchCloudPatients تُستدعى قبل هذه الدالة في initAdminPage - لا نكررها هنا
            let rawPatients = [];
            try {
                if (typeof SmartDB !== 'undefined' && typeof SmartDB.getAllPatients === 'function') {
                    rawPatients = await SmartDB.getAllPatients();
                }
            } catch(e) {
                rawPatients = [];
            }
            try {
                if (typeof SmartCloudSync !== 'undefined' && typeof SmartCloudSync.getPatients === 'function') {
                    const cPts = SmartCloudSync.getPatients();
                    for (const cp of cPts) {
                        const cpId = cp.patientId || cp.id;
                        if (cpId && !rawPatients.some(rp => (rp.patientId === cpId || rp.id === cpId))) {
                            rawPatients.unshift(cp);
                        }
                    }
                }
                const lsAll = JSON.parse(localStorage.getItem('smart_all_patients') || '[]');
                for (const lp of lsAll) {
                    const lpId = lp.patientId || lp.id;
                    if (lpId && !rawPatients.some(rp => (rp.patientId === lpId || rp.id === lpId))) {
                        rawPatients.unshift(lp);
                    }
                }
                const pendingSync = JSON.parse(localStorage.getItem('smart_pending_cloud_sync') || '[]');
                for (const pp of pendingSync) {
                    const ppId = pp.patientId || pp.id;
                    if (ppId && !rawPatients.some(rp => (rp.patientId === ppId || rp.id === ppId))) {
                        rawPatients.unshift(pp);
                    }
                }
            } catch(e) {}
            const adminNotifs = (typeof SmartDB !== 'undefined' && typeof SmartDB.getAdminNotifications === 'function') ? SmartDB.getAdminNotifications() : [];

            const isGenericPain = (str) => {
                if (!str || typeof str !== 'string') return true;
                const s = str.trim();
                return !s || s === 'العمود الفقري والمفاصل' || s === 'العمود الفقري ومفاصل الحركة' || s === 'استشارة وفحص سريري شامل للمفاصل' || s === 'استشارة وفحص سريري شامل' || s === 'استشارة وفحص سريري متكامل' || s === 'فحص ألم عام' || s === 'in_progress' || s === 'موضع الألم';
            };

            const isGenericDiag = (str) => {
                if (!str || typeof str !== 'string') return true;
                const s = str.trim();
                return !s || s === 'إجهاد ميكانيكي وظيفي في الأنسجة الداعمة' || s === 'فحص واستشارة سريرية' || s === 'استشارة وفحص سريري متكامل' || s === 'استشارة وفحص سريري شامل' || s === 'تشخيص سريري متكامل' || s === 'مكتمل' || s === 'in_progress';
            };

            const normalizeTitle = (str) => {
                if (!str) return '';
                const s = String(str).toLowerCase();
                if (/ركب|ركبه|knee|patella|صابون|رضف/.test(s)) return 'مفصل الركبة وصابونة الرضفة';
                if (/كتف|shoulder|كفة|كفه/.test(s)) return 'مفصل الكتف والكفة المدورة';
                if (/عنق|رقب|رقبه|neck|cervical/.test(s)) return 'الفقرات العنقية والرقبة';
                if (/كاحل|قدم|كعب|عقب|ankle|foot|أخمص|مسمار/.test(s)) return 'مفصل الكاحل واللفافة الأخمصية';
                if (/معصم|يد|رسغ|wrist|hand/.test(s)) return 'مفصل الرسغ ونفق الرسغ';
                if (/حوض|عرق\s*النسا|نسا|سياتيكا|كمثرية|sciatica/.test(s)) return 'عضلات الحوض وعرق النسا';
                if (/صدر|أعلى\s*الظهر|منتصف\s*الظهر|thoracic|أبهر|ابهر/.test(s)) return 'الفقرات الصدرية وأعلى الظهر (الأبهر)';
                if (/ظهر|قطن|قطنية|lumbar|دسك|غضروف/.test(s)) return 'الفقرات القطنية وأسفل الظهر';
                return str.trim();
            };

            // 1. تجميع كافة السجلات الواردة (محلي، سحابي، إشعارات سريرية)
            const candidatePool = [...rawPatients];

            if (adminNotifs && Array.isArray(adminNotifs)) {
                for (const notif of adminNotifs) {
                    if (!notif) continue;
                    let nName = (notif.patientName || '').trim();
                    if (!nName && notif.title) {
                        const m = notif.title.match(/:\s*(.*)$/);
                        if (m) nName = m[1].trim();
                    }
                    if (!nName && notif.message) {
                        const m2 = notif.message.match(/المراجع\s+([^\(\n]+)/i);
                        if (m2) nName = m2[1].trim();
                    }

                    let phoneVal = notif.patientPhone || '';
                    if (!phoneVal && notif.message) {
                        const phoneMatch = notif.message.match(/(?:هاتف|رقم|phone|tel)?[:\s]*\(?([0-9+]{8,15})\)?/i) || notif.message.match(/(07[789]\d{7})/);
                        if (phoneMatch) phoneVal = phoneMatch[1].trim();
                    }

                    let painArea = (notif.meta && notif.meta.painArea) || '';
                    if (!painArea && notif.message) {
                        const pMatch = notif.message.match(/لموضع\s*\((.*?)\)/i) || notif.message.match(/منطقة:\s*(.*?)(?:-|$)/i) || notif.message.match(/شكوى سريرية في:\s*(.*?)(?:$|\n|\.)/i);
                        if (pMatch) painArea = pMatch[1].trim();
                    }
                    let chiefDiag = (notif.meta && notif.meta.diagnosis) || '';
                    if (!chiefDiag && notif.message) {
                        const dMatch = notif.message.match(/التشخيص:\s*\[(.*?)\]/i);
                        if (dMatch) chiefDiag = dMatch[1].trim();
                    }

                    let completedSess = 0;
                    if (notif.type === 'session_done' || notif.type === 'session_completed' || (notif.message && notif.message.includes('الجلسة'))) {
                        const sessMatch = (notif.message || '').match(/الجلسة\s*(الأولى|الثانية|الثالثة|الرابعة|الخامسة|السادسة|السابعة|[1-7])/i);
                        if (sessMatch) {
                            const word = sessMatch[1];
                            if (word === 'الأولى' || word === '1') completedSess = 1;
                            else if (word === 'الثانية' || word === '2') completedSess = 2;
                            else if (word === 'الثالثة' || word === '3') completedSess = 3;
                            else if (word === 'الرابعة' || word === '4') completedSess = 4;
                            else if (word === 'الخامسة' || word === '5') completedSess = 5;
                            else if (word === 'السادسة' || word === '6') completedSess = 6;
                            else if (word === 'السابعة' || word === '7') completedSess = 7;
                        }
                    }

                    if ((nName && nName !== 'مراجع جديد' && nName !== 'مراجع كريم') || phoneVal || notif.patientId) {
                        candidatePool.push({
                            patientId: notif.patientId || ('pat_notif_' + (phoneVal ? phoneVal.replace(/\D/g, '') : Date.now().toString(36))),
                            id: notif.patientId,
                            name: nName || 'مراجع كريم',
                            fullName: nName || 'مراجع كريم',
                            phone: phoneVal,
                            painArea: painArea,
                            painAreaTitle: painArea,
                            chiefDiagnosis: chiefDiag,
                            diagnosisTitle: chiefDiag,
                            completedSessions: completedSess,
                            logsCount: completedSess,
                            createdAt: notif.time || new Date().toISOString(),
                            timestamp: notif.time || new Date().toISOString(),
                            _fromNotif: true
                        });
                    }
                }
            }

            // 2. دالة استخراج الهوية الفريدة للمريض (Patient Identity Key) لمنع أي تكرار نهائياً
            function getPatientIdentityKey(pt) {
                if (!pt) return null;
                const cleanPhone = (pt.phone || '').replace(/\D/g, '');
                if (cleanPhone.length >= 7) {
                    // آخر 9 أرقام لتفادي فروقات 00962 أو +962 أو 07
                    return 'phone_' + cleanPhone.slice(-9);
                }
                const rawId = pt.patientId || pt.id || '';
                const baseId = rawId.replace(/(_notif_.*|_test\d*|_cloud_test.*|_\d{10,})$/, '');
                if (baseId && baseId !== 'pat_notif') {
                    return 'id_' + baseId;
                }
                const cleanName = (pt.fullName || pt.name || '').trim();
                if (cleanName && !/^(?:الاسم|الآسم|الإسم|مراجع كريم|مراجع جديد|اسمي|اسمها|اسمك|اسم)$/i.test(cleanName)) {
                    return 'name_' + cleanName;
                }
                return 'raw_' + (rawId || Math.random().toString(36));
            }

            // 3. تجميع كافة السجلات في مجموعات هوية واحدة
            const groups = new Map();
            for (const pt of candidatePool) {
                if (!pt) continue;
                const key = getPatientIdentityKey(pt);
                if (!key) continue;
                if (!groups.has(key)) groups.set(key, []);
                groups.get(key).push(pt);
            }

            // 4. دمج كل مجموعة إلى سجل مريض موحد وحيد وخالي من التكرار
            const unifiedPatients = [];
            for (const [key, records] of groups.entries()) {
                const nonNotif = records.filter(r => !r._fromNotif);
                const listToMerge = nonNotif.length > 0 ? nonNotif : records;
                const unified = { ...listToMerge[0] };

                // تنظيف معرف المريض من أي لاحقة مشتقة
                unified.patientId = (unified.patientId || unified.id || '').replace(/(_notif_.*|_test\d*|_cloud_test.*|_\d{10,})$/, '');
                unified.id = unified.patientId;

                let earliestDate = unified.createdAt || unified.timestamp || null;
                let latestActiveDate = unified.createdAt || unified.timestamp || null;
                let allDailyLogs = Array.isArray(unified.dailyLogs) ? [...unified.dailyLogs] : (Array.isArray(unified.logs) ? [...unified.logs] : []);

                for (const r of records) {
                    // الاسم
                    const rName = (r.fullName || r.name || '').trim();
                    if (rName && !/^(?:الاسم|الآسم|الإسم|مراجع كريم|مراجع جديد)$/i.test(rName)) {
                        unified.name = rName;
                        unified.fullName = rName;
                    }

                    // الهاتف
                    if (!unified.phone && r.phone) unified.phone = r.phone;

                    // المؤشرات الحيوية
                    if (!unified.age && r.age) unified.age = r.age;
                    if (!unified.weight && r.weight) unified.weight = r.weight;
                    if (!unified.height && r.height) unified.height = r.height;
                    if (!unified.bmi && r.bmi) unified.bmi = r.bmi;
                    if ((!unified.gender || unified.gender === 'male') && r.gender) unified.gender = r.gender;

                    // موضع الألم (نأخذ الأكثر تحديداً)
                    const rPain = r.painArea || r.painAreaTitle || r.selectedPoint;
                    if (rPain && !isGenericPain(rPain) && (isGenericPain(unified.painArea) || !unified.painArea)) {
                        unified.painArea = normalizeTitle(rPain);
                        unified.painAreaTitle = normalizeTitle(rPain);
                    }

                    // التشخيص
                    const rDiag = r.chiefDiagnosis || r.diagnosisTitle;
                    if (rDiag && !isGenericDiag(rDiag) && (isGenericDiag(unified.chiefDiagnosis) || !unified.chiefDiagnosis)) {
                        unified.chiefDiagnosis = rDiag;
                        unified.diagnosisTitle = rDiag;
                    }

                    // الجهاز: نفضل Mobile إن وُجد في أي سجل
                    if (r.device === 'Mobile' || unified.device === 'Mobile') {
                        unified.device = 'Mobile';
                    } else if (r.device) {
                        unified.device = r.device;
                    }

                    // التواريخ
                    const rDate = r.createdAt || r.timestamp;
                    if (rDate) {
                        if (!earliestDate || new Date(rDate) < new Date(earliestDate)) earliestDate = rDate;
                        if (!latestActiveDate || new Date(rDate) > new Date(latestActiveDate)) latestActiveDate = rDate;
                    }

                    // الجلسات اليومية المنفذة
                    const rLogs = Array.isArray(r.dailyLogs) ? r.dailyLogs : (Array.isArray(r.logs) ? r.logs : []);
                    for (const l of rLogs) {
                        if (!l) continue;
                        const sessNum = l.sessionNumber || l.day;
                        if (sessNum && !allDailyLogs.some(existingL => (existingL.sessionNumber || existingL.day) === sessNum)) {
                            allDailyLogs.push(l);
                        }
                    }

                    unified.logsCount = Math.max(unified.logsCount || 0, r.logsCount || 0, r.completedSessions || 0, (r.dailyLogs?.length || 0));
                    unified.completedSessions = Math.max(unified.completedSessions || 0, r.completedSessions || 0, unified.logsCount || 0);
                    unified.recoveryScore = Math.max(unified.recoveryScore || 0, r.recoveryScore || 0);
                }

                allDailyLogs.sort((a, b) => (a.sessionNumber || a.day || 0) - (b.sessionNumber || b.day || 0));
                unified.dailyLogs = allDailyLogs;
                unified.logs = allDailyLogs;
                if (allDailyLogs.length > 0) {
                    unified.logsCount = Math.max(unified.logsCount || 0, allDailyLogs.length);
                    unified.completedSessions = Math.max(unified.completedSessions || 0, allDailyLogs.length);
                }

                if (!unified.bmi && unified.weight && unified.height) {
                    unified.bmi = parseFloat((unified.weight / Math.pow(unified.height / 100, 2)).toFixed(1));
                }

                unified.createdAt = earliestDate || new Date().toISOString();
                unified.lastActiveAt = latestActiveDate || unified.createdAt;

                // التحقق من صحة الاسم
                if (!unified.name || /^(?:الاسم|الآسم|الإسم)$/i.test(unified.name.trim())) {
                    unified.name = 'مراجع كريم';
                    unified.fullName = 'مراجع كريم';
                }

                // استنتاج الدولة والمدينة إن لم تكن محددة
                if (!unified.country || unified.country === 'غير محدد' || unified.country === 'دولي') {
                    let inferred = null;
                    if (unified.phone && typeof SmartGeoTracker !== 'undefined' && typeof SmartGeoTracker.inferCountryFromPhone === 'function') {
                        inferred = SmartGeoTracker.inferCountryFromPhone(unified.phone);
                    }
                    if (!inferred && typeof SmartGeoTracker !== 'undefined' && typeof SmartGeoTracker.inferCountryFromTimezone === 'function') {
                        inferred = SmartGeoTracker.inferCountryFromTimezone();
                    }
                    if (inferred) {
                        unified.country = inferred.country;
                        unified.countryCode = inferred.countryCode;
                        unified.city = inferred.city;
                        unified.flag = inferred.flag;
                    }
                }

                unifiedPatients.push(unified);
            }

            // 5. بناء قائمة المراجعة النهائية (Overview) - سجل واحد وحيد لكل مريض حقيقي
            const overview = [];

            for (const p of unifiedPatients) {
                if (!p || !p.patientId) continue;

                let assessments = [];
                let logs = [];
                try {
                    assessments = await SmartDB.getPatientAssessments(p.patientId);
                } catch(e) { assessments = []; }
                if ((!assessments || assessments.length === 0) && p.id && p.id !== p.patientId) {
                    try { assessments = await SmartDB.getPatientAssessments(p.id); } catch(e) {}
                }

                try {
                    logs = await SmartDB.getPatientDailyLogs(p.patientId);
                } catch(e) { logs = []; }
                if ((!logs || logs.length === 0) && p.id && p.id !== p.patientId) {
                    try { logs = await SmartDB.getPatientDailyLogs(p.id); } catch(e) {}
                }

                if ((!logs || logs.length === 0) && Array.isArray(p.dailyLogs) && p.dailyLogs.length > 0) {
                    logs = p.dailyLogs;
                } else if ((!logs || logs.length === 0) && Array.isArray(p.logs) && p.logs.length > 0) {
                    logs = p.logs;
                }
                if ((!logs || logs.length === 0) && typeof SmartCloudSync !== 'undefined' && typeof SmartCloudSync.getPatientLogs === 'function') {
                    try {
                        const cLogs = SmartCloudSync.getPatientLogs(p.patientId) || SmartCloudSync.getPatientLogs(p.id);
                        if (cLogs && cLogs.length > 0) logs = cLogs;
                    } catch(e) {}
                }

                // استخراج التقييم السريري الحقيقي واستبعاد الوهمي
                const validAssessments = (assessments || []).filter(a =>
                    !a.autoHealed &&
                    a.primaryDiagnosis !== 'إجهاد ميكانيكي وظيفي في الأنسجة الداعمة' &&
                    a.painLocation !== 'العمود الفقري ومفاصل الحركة'
                );

                let latestAssessment = validAssessments.length > 0 ? validAssessments[validAssessments.length - 1] : null;
                if (!latestAssessment) {
                    const cand = p.assessment || p.latestAssessment || p.diagnosticReport || p.clinicalData || null;
                    if (cand && !cand.autoHealed && cand.primaryDiagnosis !== 'إجهاد ميكانيكي وظيفي في الأنسجة الداعمة' && cand.painLocation !== 'العمود الفقري ومفاصل الحركة') {
                        latestAssessment = cand;
                    }
                }

                // شدة الألم الأساسية
                const baselinePain = latestAssessment
                    ? (latestAssessment.painSeverity || latestAssessment.painLevel || p.painLevel || null)
                    : (p.painLevel || null);

                // احتساب عدد الجلسات المنفذة الحقيقية
                const effectiveLogsCount = Math.max(
                    (logs ? logs.length : 0),
                    p.logsCount || 0,
                    p.completedSessions || 0,
                    (Array.isArray(p.dailyLogs) ? p.dailyLogs.length : 0),
                    (Array.isArray(p.logs) ? p.logs.length : 0)
                );

                // نسبة التعافي
                let recoveryScore = null;
                if (effectiveLogsCount > 0) {
                    if (typeof PatientFlow !== 'undefined' && typeof PatientFlow.calculateRecoveryScore === 'function' && baselinePain && logs && logs.length > 0) {
                        recoveryScore = PatientFlow.calculateRecoveryScore(baselinePain, logs);
                    }
                    if (!recoveryScore) {
                        recoveryScore = Math.max(p.recoveryScore || 0, Math.min(100, Math.round((effectiveLogsCount / 7) * 100)));
                    }
                }

                // استخراج موضع الشكوى الحقيقي
                let resolvedPainArea = p.painArea || p.painAreaTitle;
                if (!resolvedPainArea || isGenericPain(resolvedPainArea)) {
                    if (latestAssessment) {
                        const assPain = latestAssessment.painAreaTitle || latestAssessment.pointTitle || latestAssessment.rootLevel || latestAssessment.painLocation;
                        if (assPain && !isGenericPain(assPain)) resolvedPainArea = normalizeTitle(assPain);
                    }
                }
                if (!resolvedPainArea || isGenericPain(resolvedPainArea)) {
                    const textSearch = `${p.notes || ''} ${p.mriReportText || ''} ${(Array.isArray(p.collectedSymptoms) ? p.collectedSymptoms.join(' ') : '')} ${p.primaryComplaint || ''} ${p.complaint || ''}`.toLowerCase();
                    if (/ركب|ركبه|knee|patella|صابون|رضف/.test(textSearch)) resolvedPainArea = 'مفصل الركبة وصابونة الرضفة';
                    else if (/كتف|shoulder|كفة|كفه/.test(textSearch)) resolvedPainArea = 'مفصل الكتف والكفة المدورة';
                    else if (/عنق|رقب|رقبه|neck|cervical/.test(textSearch)) resolvedPainArea = 'الفقرات العنقية والرقبة';
                    else if (/كاحل|قدم|كعب|عقب|ankle|foot|أخمص|مسمار/.test(textSearch)) resolvedPainArea = 'مفصل الكاحل واللفافة الأخمصية';
                    else if (/معصم|يد|رسغ|wrist|hand/.test(textSearch)) resolvedPainArea = 'مفصل الرسغ ونفق الرسغ';
                    else if (/حوض|عرق\s*النسا|نسا|سياتيكا|كمثرية|sciatica/.test(textSearch)) resolvedPainArea = 'عضلات الحوض وعرق النسا';
                    else if (/صدر|أعلى\s*الظهر|منتصف\s*الظهر|thoracic|أبهر|ابهر/.test(textSearch)) resolvedPainArea = 'الفقرات الصدرية وأعلى الظهر (الأبهر)';
                    else if (/ظهر|قطن|قطنية|lumbar|دسك|غضروف/.test(textSearch)) resolvedPainArea = 'الفقرات القطنية وأسفل الظهر';
                    else if (/كوع|مرفق|elbow/.test(textSearch)) resolvedPainArea = 'مفصل الكوع الأيمن';
                }
                if (!resolvedPainArea || isGenericPain(resolvedPainArea)) resolvedPainArea = 'فحص واستشارة سريرية';

                // استخراج التشخيص السريري الحقيقي
                let resolvedDiagnosis = p.chiefDiagnosis || p.diagnosisTitle;
                if (!resolvedDiagnosis || isGenericDiag(resolvedDiagnosis)) {
                    if (latestAssessment) {
                        const assDiag = latestAssessment.primaryDiagnosis;
                        const cleanAssDiag = (typeof assDiag === 'object' && assDiag !== null) ? (assDiag.title || assDiag.name) : assDiag;
                        if (cleanAssDiag && !isGenericDiag(cleanAssDiag)) resolvedDiagnosis = cleanAssDiag.trim();
                        else if (latestAssessment.title && !isGenericDiag(latestAssessment.title)) resolvedDiagnosis = latestAssessment.title.trim();
                    }
                }
                if (!resolvedDiagnosis || isGenericDiag(resolvedDiagnosis)) resolvedDiagnosis = 'تشخيص سريري متكامل';

                p.painArea = resolvedPainArea;
                p.painAreaTitle = resolvedPainArea;
                p.chiefDiagnosis = resolvedDiagnosis;
                p.diagnosisTitle = resolvedDiagnosis;
                p.logsCount = effectiveLogsCount;
                p.completedSessions = effectiveLogsCount;
                p.recoveryScore = recoveryScore;

                overview.push({
                    patient: p,
                    latestAssessment,
                    logsCount: effectiveLogsCount,
                    recoveryScore: recoveryScore,
                    baselinePain: baselinePain,
                    latestDiagnosis: resolvedDiagnosis,
                    painArea: resolvedPainArea,
                    createdAt: p.createdAt,
                    lastActiveAt: p.lastActiveAt || p.createdAt
                });
            }

            // 6. الترتيب الزمني السريري الدقيق: الأحدث تسجيلاً ونشاطاً يظهر أولاً في القمة
            overview.sort((a, b) => {
                const timeA = new Date(a.lastActiveAt || a.createdAt || 0).getTime();
                const timeB = new Date(b.lastActiveAt || b.createdAt || 0).getTime();
                return timeB - timeA;
            });

            // 7. تنظيف التخزين المحلي فورياً من السجلات المكررة والمفاتيح الزائدة
            try {
                const cleanForStorage = unifiedPatients.map(u => {
                    const c = { ...u };
                    delete c._fromNotif;
                    return c;
                });
                localStorage.setItem('smart_all_patients', JSON.stringify(cleanForStorage));

                for (let i = localStorage.length - 1; i >= 0; i--) {
                    const k = localStorage.key(i);
                    if (k && (k.includes('_notif_') || k.includes('_test2') || k.includes('_cloud_test'))) {
                        localStorage.removeItem(k);
                    }
                }
            } catch(e) {}

            return overview;
        } catch (err) {
            console.error('Error in loadPatientsOverview:', err);
            return [];
        }
    }

    // التحكم الدقيق بتوقيت الجلسة الفردية لكل مريض بالساعة والدقيقة والثانية وبثه سحابياً لهاتف المريض
    function setPatientSessionTiming(patientId, sessionNum, hours, minutes, seconds, patientPhone = '', patientName = '', broadcastToAll = true) {
        const h = parseInt(hours) || 0;
        const m = parseInt(minutes) || 0;
        const s = parseInt(seconds) || 0;
        const totalDurationMs = ((h * 3600) + (m * 60) + s) * 1000;
        const forceUnlock = totalDurationMs <= 0;
        let targetTime = 0;

        const cleanPhone = patientPhone ? String(patientPhone).replace(/\D/g, '') : '';

        if (forceUnlock) {
            // فتح الجلسة فوراً لكافة الجلسات المحتملة لمنع أي تعارض في رقم الجلسة بين الأجهزة
            localStorage.setItem(`force_unlock_${patientId}`, 'true');
            localStorage.removeItem(`custom_target_time_${patientId}`);
            localStorage.removeItem(`custom_total_duration_${patientId}`);
            for (let i = 1; i <= 7; i++) {
                localStorage.removeItem(`sessionStartTime_${patientId}_${i}`);
            }
            if (cleanPhone) {
                localStorage.setItem(`force_unlock_${cleanPhone}`, 'true');
                localStorage.removeItem(`custom_target_time_${cleanPhone}`);
                localStorage.removeItem(`custom_total_duration_${cleanPhone}`);
                for (let i = 1; i <= 7; i++) {
                    localStorage.removeItem(`sessionStartTime_${cleanPhone}_${i}`);
                }
            }
            if (broadcastToAll) {
                localStorage.setItem('force_unlock_global', 'true');
                localStorage.removeItem('custom_target_time_global');
                localStorage.removeItem('custom_total_duration_global');
            }
        } else {
            // تحديد وقت انتهاء دقيق
            targetTime = Date.now() + totalDurationMs;
            localStorage.setItem(`custom_target_time_${patientId}`, String(targetTime));
            localStorage.setItem(`custom_total_duration_${patientId}`, String(totalDurationMs));
            localStorage.removeItem(`force_unlock_${patientId}`);
            if (cleanPhone) {
                localStorage.setItem(`custom_target_time_${cleanPhone}`, String(targetTime));
                localStorage.setItem(`custom_total_duration_${cleanPhone}`, String(totalDurationMs));
                localStorage.removeItem(`force_unlock_${cleanPhone}`);
            }
            if (broadcastToAll) {
                localStorage.setItem('custom_target_time_global', String(targetTime));
                localStorage.setItem('custom_total_duration_global', String(totalDurationMs));
                localStorage.removeItem('force_unlock_global');
            }
        }

        // إرسال إشعار التحديث الفوري لكافة التبويبات المتزامنة محلياً
        localStorage.setItem('countdownUpdated', Date.now().toString());

        // حفظ التوقيت داخل كائن المريض نفسه في SmartDB
        try {
            if (window.SmartDB && typeof window.SmartDB.getPatient === 'function') {
                window.SmartDB.getPatient(patientId).then(pt => {
                    if (pt) {
                        pt.customTargetTime = targetTime;
                        pt.customDurationMs = totalDurationMs;
                        pt.forceUnlock = forceUnlock;
                        pt.customTimingHours = h;
                        pt.customTimingMinutes = m;
                        pt.customTimingSeconds = s;
                        pt.lastTimingUpdated = Date.now();
                        window.SmartDB.savePatient(pt, { skipCloudSync: true });
                    }
                }).catch(() => {});
            }
        } catch(e) {}

        // بث التحديث سحابياً لهاتف المريض فورياً
        if (window.SmartCloudSync && typeof window.SmartCloudSync.dispatchTimingUpdate === 'function') {
            window.SmartCloudSync.dispatchTimingUpdate({
                patientId: patientId,
                patientPhone: patientPhone,
                patientName: patientName,
                sessionNum: sessionNum,
                hours: h,
                minutes: m,
                seconds: s,
                totalDurationMs: totalDurationMs,
                targetTime: targetTime,
                forceUnlock: forceUnlock,
                broadcastToAll: !!broadcastToAll,
                global: !!broadcastToAll,
                updatedAt: Date.now()
            });

            // تعميم حزمة المزامنة الكاملة فوراً لضمان احتفاظ السحابة بالتوقيت الجديد
            if (typeof window.SmartCloudSync.broadcastSnapshot === 'function') {
                setTimeout(() => window.SmartCloudSync.broadcastSnapshot(), 100);
            }
        }

        return true;
    }

    // تصدير كافة البيانات كملف JSON
    async function exportAllData() {
        const patients = await SmartDB.getAllPatients();
        const fullBackup = [];

        for (const p of patients) {
            const assessments = await SmartDB.getPatientAssessments(p.patientId);
            const logs = await SmartDB.getPatientDailyLogs(p.patientId);
            fullBackup.push({
                patient: p,
                assessments,
                dailyLogs: logs
            });
        }

        return JSON.stringify({
            exportedAt: new Date().toISOString(),
            clinic: "وداعاً للألم - تقنية الكايروبراكتيك",
            data: fullBackup
        }, null, 2);
    }

    // تطهير وحذف كافة السجلات التجريبية والوهمية نهائياً تطبيقاً لحظر البيانات الوهمية
    async function purgeDemoPatients() {
        const dummyPatientIds = ['P-104821', 'P-209143', 'P-308512', 'subPatientSabreen', 'subPatientMajd', 'subPatientEndless'];
        for (const pid of dummyPatientIds) {
            try {
                if (typeof SmartDB !== 'undefined' && typeof SmartDB.deletePatient === 'function') {
                    await SmartDB.deletePatient(pid);
                }
                localStorage.removeItem('smart_patient_' + pid);
                localStorage.removeItem('smart_assessments_' + pid);
                localStorage.removeItem('smart_daily_logs_' + pid);
                localStorage.removeItem('smart_plan_activated_' + pid);
            } catch(e) {}
        }
        if (typeof SmartDB !== 'undefined' && typeof SmartDB.purgeDummyAssessments === 'function') {
            await SmartDB.purgeDummyAssessments();
        }
        return true;
    }

    // تفريغ كافة السجلات بالكامل ومنع عودتها نهائياً
    async function clearAllPatients() {
        if (typeof SmartDB !== 'undefined' && typeof SmartDB.clearAllPatients === 'function') {
            await SmartDB.clearAllPatients();
        } else {
            const patients = await SmartDB.getAllPatients();
            for (const p of patients) {
                await SmartDB.deletePatient(p.patientId);
            }
        }
        return true;
    }

    return {
        verifyPassword,
        updatePassword,
        loadPatientsOverview,
        setPatientSessionTiming,
        exportAllData,
        purgeDemoPatients,
        clearAllPatients
    };
})();
