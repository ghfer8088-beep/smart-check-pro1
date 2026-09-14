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
            let rawPatients = await SmartDB.getAllPatients();
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

            // الحفاظ على كافة السجلات والتشخيصات بدون أي دمج بالهاتف
            const patientsMap = new Map();

            // 1. إضافة كافة السجلات من rawPatients - كل فحص سريري هو سجل مستقل بذاته
            for (const pt of rawPatients) {
                if (!pt) continue;
                const pId = pt.patientId || pt.id;
                if (!pId) continue;
                
                let cName = (pt.fullName || pt.name || '').trim();
                if (/^(?:الاسم|الآسم|الإسم|اسمي|اسمها|اسمه|اسمك|اسم)$/i.test(cName)) {
                    cName = 'مراجع كريم';
                }
                if (!cName) cName = 'مراجع كريم';

                const patientClean = {
                    ...pt,
                    patientId: pId,
                    id: pId,
                    name: cName,
                    fullName: cName,
                    age: pt.age || pt.patientVitals?.age || null,
                    weight: pt.weight || pt.patientVitals?.weight || null,
                    height: pt.height || pt.patientVitals?.height || null,
                    bmi: pt.bmi || (pt.weight && pt.height ? parseFloat((pt.weight / Math.pow(pt.height/100, 2)).toFixed(1)) : null),
                    gender: pt.gender || 'male'
                };

                // إذا تكرر نفس الـ patientId تماماً (نفس الفحص من مصدرين محلي وسحابي)، ندمج حقوله ما لم يكن فحصاً سريرياً مستقلاً
                if (patientsMap.has(pId)) {
                    const existing = patientsMap.get(pId);
                    const isDistinctTest = (existing.painArea && patientClean.painArea && existing.painArea !== patientClean.painArea) ||
                                           (existing.chiefDiagnosis && patientClean.chiefDiagnosis && existing.chiefDiagnosis !== patientClean.chiefDiagnosis) ||
                                           (existing.selectedPoint && patientClean.selectedPoint && existing.selectedPoint !== patientClean.selectedPoint) ||
                                           (existing.createdAt && patientClean.createdAt && Math.abs(new Date(existing.createdAt) - new Date(patientClean.createdAt)) > 120000) ||
                                           (existing.timestamp && patientClean.timestamp && Math.abs(new Date(existing.timestamp) - new Date(patientClean.timestamp)) > 120000);
                    if (isDistinctTest) {
                        const subId = pId + '_test2';
                        patientClean.patientId = subId;
                        patientClean.id = subId;
                        patientsMap.set(subId, patientClean);
                    } else {
                        patientsMap.set(pId, { ...existing, ...patientClean });
                    }
                } else {
                    patientsMap.set(pId, patientClean);
                }
            }

            // 2. فحص الإشعارات السريرية لاستعادة أي تشخيص تم تسجيله وفُقد سجله
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

                    if (nName && nName !== 'مراجع جديد' && nName !== 'مراجع كريم') {
                        let painArea = (notif.meta && notif.meta.painArea) || '';
                        if (!painArea && notif.message) {
                            const pMatch = notif.message.match(/لموضع\s*\((.*?)\)/i) || notif.message.match(/منطقة:\s*(.*?)(?:-|$)/i);
                            if (pMatch) painArea = pMatch[1].trim();
                        }
                        let chiefDiag = (notif.meta && notif.meta.diagnosis) || '';
                        if (!chiefDiag && notif.message) {
                            const dMatch = notif.message.match(/التشخيص:\s*\[(.*?)\]/i);
                            if (dMatch) chiefDiag = dMatch[1].trim();
                        }

                        let phoneVal = notif.patientPhone || '';
                        if (!phoneVal && notif.message) {
                            const phoneMatch = notif.message.match(/(?:هاتف|رقم|phone|tel)?[:\s]*\(?([0-9+]{8,15})\)?/i) || notif.message.match(/(07[789]\d{7})/);
                            if (phoneMatch) phoneVal = phoneMatch[1].trim();
                        }

                        // التحقق هل هذا الفحص بالتحديد موجود مسبقاً في الخريطة أم أنه فحص جديد ومستقل لنفس المراجع
                        let alreadyPresent = false;
                        for (const existingPt of patientsMap.values()) {
                            const samePerson = (notif.patientId && (existingPt.patientId === notif.patientId || existingPt.id === notif.patientId)) ||
                                               (phoneVal && existingPt.phone && String(phoneVal).replace(/\D/g, '') === String(existingPt.phone).replace(/\D/g, '')) ||
                                               (existingPt.name && existingPt.name.trim() === nName.trim());
                            if (samePerson) {
                                const sameDiag = !chiefDiag || (existingPt.chiefDiagnosis && existingPt.chiefDiagnosis.includes(chiefDiag)) || (existingPt.diagnosisTitle && existingPt.diagnosisTitle.includes(chiefDiag));
                                const samePain = !painArea || (existingPt.painArea && existingPt.painArea.includes(painArea)) || (existingPt.painAreaTitle && existingPt.painAreaTitle.includes(painArea));
                                const timeDiff = Math.abs(new Date(existingPt.createdAt || existingPt.timestamp || 0) - new Date(notif.time || 0));
                                if (sameDiag && samePain && timeDiff < 600000) {
                                    alreadyPresent = true;
                                    break;
                                }
                            }
                        }

                        if (!alreadyPresent) {
                            const nId = (notif.patientId || 'pat_' + Date.now().toString(36)) + '_notif_' + (notif.id || notif.time || Math.random().toString(36).substr(2, 5));
                            
                            // استنتاج الدولة والمدينة وعلم الدولة فورياً من رقم الهاتف
                            let geoFromPhone = null;
                            if (typeof SmartGeoTracker !== 'undefined' && typeof SmartGeoTracker.inferCountryFromPhone === 'function') {
                                geoFromPhone = SmartGeoTracker.inferCountryFromPhone(phoneVal);
                            }
                            if (!geoFromPhone && typeof SmartGeoTracker !== 'undefined' && typeof SmartGeoTracker.inferCountryFromTimezone === 'function') {
                                geoFromPhone = SmartGeoTracker.inferCountryFromTimezone();
                            }

                            // استخراج عدد الجلسات المنفذة إن كان الإشعار لإتمام جلسة
                            let completedSess = 0;
                            let recoveredLogs = [];
                            if (notif.type === 'session_done' || (notif.message && notif.message.includes('الجلسة'))) {
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

                            const recoveredPatient = {
                                patientId: nId,
                                id: nId,
                                name: nName,
                                fullName: nName,
                                phone: phoneVal || '',
                                painArea: painArea || 'فحص واستشارة سريرية',
                                painAreaTitle: painArea || 'فحص واستشارة سريرية',
                                chiefDiagnosis: chiefDiag || 'تشخيص سريري متكامل',
                                diagnosisTitle: chiefDiag || 'تشخيص سريري متكامل',
                                country: geoFromPhone ? geoFromPhone.country : 'الأردن',
                                countryCode: geoFromPhone ? geoFromPhone.countryCode : 'JO',
                                city: geoFromPhone ? geoFromPhone.city : 'عمّان',
                                flag: geoFromPhone ? geoFromPhone.flag : '🇯🇴',
                                device: 'Mobile',
                                completedSessions: completedSess,
                                logsCount: completedSess,
                                createdAt: notif.time || new Date().toISOString()
                            };

                            patientsMap.set(nId, recoveredPatient);

                            // حفظ السجل المستعاد في التخزين المحلي لضمان استمراريته وعدم فقدانه مجدداً
                            try {
                                if (typeof SmartDB !== 'undefined' && typeof SmartDB.savePatient === 'function') {
                                    SmartDB.savePatient(recoveredPatient);
                                }
                            } catch(e) {}
                        }
                    }
                }
            }

            const patients = Array.from(patientsMap.values());
            const overview = [];

            for (const p of patients) {
                if (!p || !p.patientId) continue;

                // تدقيق وضمان الدولة والمدينة لكل مريض
                if (!p.country || p.country === 'غير محدد' || p.country === 'دولي') {
                    let inferred = null;
                    if (p.phone && typeof SmartGeoTracker !== 'undefined' && typeof SmartGeoTracker.inferCountryFromPhone === 'function') {
                        inferred = SmartGeoTracker.inferCountryFromPhone(p.phone);
                    }
                    if (!inferred && typeof SmartGeoTracker !== 'undefined' && typeof SmartGeoTracker.inferCountryFromTimezone === 'function') {
                        inferred = SmartGeoTracker.inferCountryFromTimezone();
                    }
                    if (inferred) {
                        p.country = inferred.country;
                        p.countryCode = inferred.countryCode;
                        p.city = inferred.city;
                        p.flag = inferred.flag;
                    }
                }

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
                
                // استخراج التقييم السريري الحقيقي مع استبعاد التقييمات الوهمية
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

                // شدة الألم الأساسية - من بيانات حقيقية فقط، لا قيم افتراضية
                const baselinePain = latestAssessment
                    ? (latestAssessment.painSeverity || latestAssessment.painLevel || p.painLevel || null)
                    : (p.painLevel || null);
                
                // نسبة التعافي - محسوبة من الجلسات الحقيقية فقط، لا قيمة افتراضية
                let recoveryScore = null;
                if (logs && logs.length > 0) {
                    if (typeof PatientFlow !== 'undefined' && typeof PatientFlow.calculateRecoveryScore === 'function' && baselinePain) {
                        recoveryScore = PatientFlow.calculateRecoveryScore(baselinePain, logs);
                    } else {
                        recoveryScore = Math.min(100, Math.round((logs.length / 7) * 100));
                    }
                } else if (p.recoveryScore && p.recoveryScore > 0) {
                    recoveryScore = p.recoveryScore; // من بيانات المريض المحفوظة
                }

                if (validAssessments.length > 1) {
                    for (let aIdx = 0; aIdx < validAssessments.length; aIdx++) {
                        const ass = validAssessments[aIdx];
                        const subPatient = {
                            ...p,
                            patientId: aIdx === 0 ? p.patientId : `${p.patientId}_test${aIdx + 1}`,
                            id: aIdx === 0 ? (p.id || p.patientId) : `${p.patientId}_test${aIdx + 1}`
                        };

                        const assPain = ass.painAreaTitle || ass.pointTitle || ass.rootLevel || ass.painLocation || p.painArea;
                        const rawAssDiag = ass.primaryDiagnosis || ass.title || p.chiefDiagnosis;
                        const cleanAssDiag = (typeof rawAssDiag === 'object' && rawAssDiag !== null) ? (rawAssDiag.title || rawAssDiag.name) : String(rawAssDiag || '');

                        const rPain = normalizeTitle(assPain || p.painArea || 'الفقرات القطنية وأسفل الظهر');
                        let rDiag = cleanAssDiag || p.chiefDiagnosis || 'تشخيص سريري متكامل';

                        subPatient.painArea = rPain;
                        subPatient.painAreaTitle = rPain;
                        subPatient.chiefDiagnosis = rDiag;
                        subPatient.diagnosisTitle = rDiag;

                        const bPain = ass.painSeverity || ass.painLevel || (aIdx === validAssessments.length - 1 ? p.painLevel : null);
                        const isLatest = aIdx === validAssessments.length - 1;

                        const effLogs = Math.max(
                            (logs ? logs.length : 0),
                            p.logsCount || 0,
                            p.completedSessions || 0,
                            (Array.isArray(p.dailyLogs) ? p.dailyLogs.length : 0),
                            (Array.isArray(p.logs) ? p.logs.length : 0)
                        );
                        const effRecovery = effLogs > 0
                            ? Math.max(recoveryScore || 0, p.recoveryScore || 0, Math.min(100, Math.round((effLogs / 7) * 100)))
                            : (recoveryScore || p.recoveryScore || null);

                        overview.push({
                            patient: subPatient,
                            latestAssessment: ass,
                            logsCount: isLatest ? effLogs : 0,
                            recoveryScore: isLatest ? effRecovery : null,
                            baselinePain: bPain,
                            latestDiagnosis: rDiag,
                            painArea: rPain,
                            createdAt: ass.date || ass.timestamp || p.createdAt || p.timestamp || new Date().toISOString()
                        });
                    }
                    continue;
                }


                // استخراج موضع الشكوى الحقيقي بدقة متعددة المصادر (إشعارات، تقييم، اختيار المريض، أعراض)
                let resolvedPainArea = '';
                let matchingNotif = null;

                // 1. فحص الإشعارات السريرية المرتبطة بالمريض
                if (adminNotifs && adminNotifs.length > 0) {
                    const pDigits = (p.phone || '').replace(/\D/g, '');
                    matchingNotif = adminNotifs.find(n => {
                        const nDigits = (n.patientPhone || '').replace(/\D/g, '');
                        return (n.patientId && (n.patientId === p.patientId || n.patientId === p.id)) ||
                               (pDigits && nDigits && pDigits === nDigits) ||
                               (p.name && p.name !== 'مراجع كريم' && n.patientName && n.patientName.trim() === p.name.trim());
                    });
                    if (matchingNotif) {
                        if (matchingNotif.meta && matchingNotif.meta.painArea && !isGenericPain(matchingNotif.meta.painArea)) {
                            resolvedPainArea = normalizeTitle(matchingNotif.meta.painArea);
                        } else {
                            const msgMatch = (matchingNotif.message || '').match(/لموضع\s*\((.*?)\)/i) || (matchingNotif.message || '').match(/شكوى سريرية في:\s*(.*?)(?:$|\n|\.)/i);
                            if (msgMatch && msgMatch[1] && !isGenericPain(msgMatch[1])) {
                                resolvedPainArea = normalizeTitle(msgMatch[1]);
                            }
                        }
                    }
                }

                // 2. فحص التقييم السريري المسجل
                if (!resolvedPainArea) {
                    const assPain = latestAssessment?.painAreaTitle || latestAssessment?.pointTitle || latestAssessment?.rootLevel || latestAssessment?.painLocation;
                    if (assPain && !isGenericPain(assPain)) {
                        resolvedPainArea = normalizeTitle(assPain);
                    }
                }

                // 3. فحص الخيارات المسجلة في ملف المريض
                if (!resolvedPainArea) {
                    const directPain = p.painAreaTitle || p.painArea || p.selectedPoint || p.condition;
                    if (directPain && !isGenericPain(directPain)) {
                        resolvedPainArea = normalizeTitle(directPain);
                    }
                }

                // 4. فحص الملاحظات والأعراض والمصطلحات السريرية — لا استنتاج بالاسم ولا توليد عشوائي
                if (!resolvedPainArea) {
                    const textSearch = `${p.notes || ''} ${p.mriReportText || ''} ${(Array.isArray(p.collectedSymptoms) ? p.collectedSymptoms.join(' ') : '')} ${p.primaryComplaint || ''} ${p.complaint || ''}`.toLowerCase();
                    if (/ركب|ركبه|knee|patella|صابون|رضف/.test(textSearch)) resolvedPainArea = 'مفصل الركبة وصابونة الرضفة';
                    else if (/كتف|shoulder|كفة|كفه/.test(textSearch)) resolvedPainArea = 'مفصل الكتف والكفة المدورة';
                    else if (/عنق|رقب|رقبه|neck|cervical/.test(textSearch)) resolvedPainArea = 'الفقرات العنقية والرقبة';
                    else if (/كاحل|قدم|كعب|عقب|ankle|foot|أخمص|مسمار/.test(textSearch)) resolvedPainArea = 'مفصل الكاحل واللفافة الأخمصية';
                    else if (/معصم|يد|رسغ|wrist|hand/.test(textSearch)) resolvedPainArea = 'مفصل الرسغ ونفق الرسغ';
                    else if (/حوض|عرق\s*النسا|نسا|سياتيكا|كمثرية|sciatica/.test(textSearch)) resolvedPainArea = 'عضلات الحوض وعرق النسا';
                    else if (/صدر|أعلى\s*الظهر|منتصف\s*الظهر|thoracic|أبهر|ابهر/.test(textSearch)) resolvedPainArea = 'الفقرات الصدرية وأعلى الظهر (الأبهر)';
                    else if (/ظهر|قطن|قطنية|lumbar|دسك|غضروف/.test(textSearch)) resolvedPainArea = 'الفقرات القطنية وأسفل الظهر';
                }
                // إذا لم تُوجد بيانات حقيقية → لا توليد عشوائي، نترك الحقل فارغاً أو "لم يُحدد بعد"
                if (!resolvedPainArea) resolvedPainArea = '';

                // استخراج التشخيص السريري الحقيقي الموثق للمريض
                let resolvedDiagnosis = '';

                // 1. من الإشعار السريري
                if (matchingNotif) {
                    const diagMatch = (matchingNotif.message || '').match(/التشخيص:\s*\[(.*?)\]/i);
                    if (diagMatch && diagMatch[1] && !isGenericDiag(diagMatch[1])) {
                        resolvedDiagnosis = diagMatch[1].trim();
                    }
                }

                // 2. من التقييم السريري المسجل
                if (!resolvedDiagnosis && latestAssessment) {
                    const assDiag = latestAssessment.primaryDiagnosis;
                    const cleanAssDiag = (typeof assDiag === 'object' && assDiag !== null) ? (assDiag.title || assDiag.name) : assDiag;
                    if (cleanAssDiag && !isGenericDiag(cleanAssDiag)) {
                        resolvedDiagnosis = cleanAssDiag.trim();
                    } else if (latestAssessment.title && !isGenericDiag(latestAssessment.title)) {
                        resolvedDiagnosis = latestAssessment.title.trim();
                    }
                }

                // 3. من ملف المريض
                if (!resolvedDiagnosis) {
                    const ptDiag = p.chiefDiagnosis || p.diagnosisTitle;
                    if (ptDiag && !isGenericDiag(ptDiag)) {
                        resolvedDiagnosis = ptDiag.trim();
                    }
                }

                // 4. إذا لم يُوجد تشخيص حقيقي → لا توليد تلقائي، نترك فارغاً
                // (لا نعرض تشخيصاً وهمياً أفضل من عدم التشخيص)
                if (!resolvedDiagnosis) resolvedDiagnosis = '';

                p.painArea = resolvedPainArea;
                p.painAreaTitle = resolvedPainArea;
                p.chiefDiagnosis = resolvedDiagnosis;
                p.diagnosisTitle = resolvedDiagnosis;

                const effectiveLogsCount = Math.max(
                    (logs ? logs.length : 0),
                    p.logsCount || 0,
                    p.completedSessions || 0,
                    (Array.isArray(p.dailyLogs) ? p.dailyLogs.length : 0),
                    (Array.isArray(p.logs) ? p.logs.length : 0)
                );
                // نسبة التعافي: من بيانات حقيقية فقط - لا قيمة افتراضية
                const effectiveRecoveryScore = effectiveLogsCount > 0
                    ? Math.max(recoveryScore || 0, p.recoveryScore || 0, Math.min(100, Math.round((effectiveLogsCount / 7) * 100)))
                    : (recoveryScore || p.recoveryScore || null);

                overview.push({
                    patient: p,
                    latestAssessment,
                    logsCount: effectiveLogsCount,
                    recoveryScore: effectiveRecoveryScore,
                    baselinePain: baselinePain,   // شدة الألم الحقيقية من المريض
                    latestDiagnosis: resolvedDiagnosis,
                    painArea: resolvedPainArea,
                    createdAt: p.createdAt || p.timestamp || new Date().toISOString()
                });
            }



            overview.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
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
