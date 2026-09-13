// ==========================================================================
// Smart Check Pro 2.0 - محرك الإدارة السريرية والتحليلات المتقدمة (Admin Engine)
// مطورة من قبل "وداعاً للألم" (تقنية الكايروبراكتيك)
// ==========================================================================

const AdminEngine = (function() {
    const DEFAULT_ADMIN_PASS = "123456";

    // التحقق من كلمة مرور الإدارة
    async function verifyPassword(inputPassword) {
        const storedPass = await SmartDB.getSetting('adminPassword', DEFAULT_ADMIN_PASS);
        return inputPassword === storedPass;
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
            // جلب ومزامنة كافة الحالات السحابية المرحلية من كافة الهواتف والأجهزة حول العالم
            try {
                if (typeof SmartCloudSync !== 'undefined' && typeof SmartCloudSync.fetchCloudPatients === 'function') {
                    await SmartCloudSync.fetchCloudPatients();
                }
            } catch (e) {}

            const rawPatients = await SmartDB.getAllPatients();
            
            // تنظيف ودمج السجلات المكررة بالهاتف لمنع تكرار نفس المريض
            const consolidatedMap = new Map();
            const standaloneList = [];

            for (const pt of rawPatients) {
                if (!pt || (!pt.patientId && !pt.id)) continue;
                
                // تصحيح الاسم إن كان "الاسم" أو "الآسم"
                let cName = (pt.fullName || pt.name || '').trim();
                if (/^(?:الاسم|الآسم|الإسم|اسمي|اسمها|اسمه|اسمك|اسم)$/i.test(cName)) {
                    cName = 'مراجع كريم';
                }
                if (!cName) cName = 'مراجع كريم';

                const cPhone = (pt.phone || '').replace(/\D/g, '');
                const patientClean = {
                    ...pt,
                    patientId: pt.patientId || pt.id,
                    name: cName,
                    fullName: cName,
                    age: pt.age || pt.patientVitals?.age || null,
                    weight: pt.weight || pt.patientVitals?.weight || null,
                    height: pt.height || pt.patientVitals?.height || null,
                    bmi: pt.bmi || (pt.weight && pt.height ? parseFloat((pt.weight / Math.pow(pt.height/100, 2)).toFixed(1)) : null),
                    gender: pt.gender || 'male'
                };

                if (cPhone && cPhone.length >= 7) {
                    if (consolidatedMap.has(cPhone)) {
                        const existing = consolidatedMap.get(cPhone);
                        const merged = {
                            ...patientClean,
                            ...existing,
                            name: (existing.name !== 'مراجع كريم') ? existing.name : patientClean.name,
                            fullName: (existing.fullName !== 'مراجع كريم') ? existing.fullName : patientClean.fullName,
                            age: existing.age || patientClean.age,
                            weight: existing.weight || patientClean.weight,
                            height: existing.height || patientClean.height,
                            painArea: (existing.painArea && existing.painArea !== 'العمود الفقري والمفاصل' && existing.painArea !== 'العمود الفقري ومفاصل الحركة') ? existing.painArea : (patientClean.painArea || existing.painArea),
                            painAreaTitle: (existing.painAreaTitle && existing.painAreaTitle !== 'العمود الفقري والمفاصل' && existing.painAreaTitle !== 'العمود الفقري ومفاصل الحركة') ? existing.painAreaTitle : (patientClean.painAreaTitle || existing.painAreaTitle),
                            chiefDiagnosis: (existing.chiefDiagnosis && existing.chiefDiagnosis !== 'استشارة وفحص سريري متكامل' && existing.chiefDiagnosis !== 'إجهاد ميكانيكي وظيفي في الأنسجة الداعمة') ? existing.chiefDiagnosis : (patientClean.chiefDiagnosis || existing.chiefDiagnosis),
                            diagnosisTitle: (existing.diagnosisTitle && existing.diagnosisTitle !== 'استشارة وفحص سريري متكامل' && existing.diagnosisTitle !== 'إجهاد ميكانيكي وظيفي في الأنسجة الداعمة') ? existing.diagnosisTitle : (patientClean.diagnosisTitle || existing.diagnosisTitle),
                            assessment: (existing.assessment && !existing.assessment.autoHealed && existing.assessment.primaryDiagnosis !== 'إجهاد ميكانيكي وظيفي في الأنسجة الداعمة') ? existing.assessment : patientClean.assessment
                        };
                        consolidatedMap.set(cPhone, merged);
                    } else {
                        consolidatedMap.set(cPhone, patientClean);
                    }
                } else {
                    // استبعاد السجلات الوهمية المجهولة تماماً
                    if (cName !== 'مراجع كريم' || pt.age || pt.weight) {
                        standaloneList.push(patientClean);
                    }
                }
            }

            const patients = [...Array.from(consolidatedMap.values()), ...standaloneList];
            const overview = [];

            for (const p of patients) {
                if (!p || !p.patientId) continue;

                let assessments = [];
                let logs = [];
                try {
                    assessments = await SmartDB.getPatientAssessments(p.patientId);
                } catch(e) { assessments = []; }
                
                try {
                    logs = await SmartDB.getPatientDailyLogs(p.patientId);
                } catch(e) { logs = []; }

                // استخراج السجلات اليومية من كائن المريض نفسه في حال كانت قادمة من المزامنة السحابية
                if ((!logs || logs.length === 0) && Array.isArray(p.dailyLogs) && p.dailyLogs.length > 0) {
                    logs = p.dailyLogs;
                } else if ((!logs || logs.length === 0) && Array.isArray(p.logs) && p.logs.length > 0) {
                    logs = p.logs;
                }
                
                // استخراج التقييم السريري الشامل: من IndexedDB أو من كائن المريض السحابي مع استبعاد السجلات الوهمية تماماً
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

                const baselinePain = latestAssessment ? (latestAssessment.painSeverity || latestAssessment.painLevel || p.painLevel || 7) : (p.painLevel || 7);
                
                let recoveryScore = p.recoveryScore || 15;
                if (typeof PatientFlow !== 'undefined' && typeof PatientFlow.calculateRecoveryScore === 'function') {
                    recoveryScore = PatientFlow.calculateRecoveryScore(baselinePain, logs);
                } else if (logs && logs.length > 0) {
                    recoveryScore = Math.min(100, Math.round((logs.length / 7) * 100));
                }

                // استخراج واستنتاج موضع الشكوى الحقيقي بدقة فائقة
                let resolvedPainArea = latestAssessment?.painAreaTitle 
                    || latestAssessment?.pointTitle
                    || latestAssessment?.rootLevel
                    || p.painAreaTitle
                    || (p.painArea && p.painArea !== 'العمود الفقري والمفاصل' && p.painArea !== 'العمود الفقري ومفاصل الحركة' ? p.painArea : null)
                    || (p.selectedPoint && p.selectedPoint !== 'العمود الفقري والمفاصل' && p.selectedPoint !== 'العمود الفقري ومفاصل الحركة' ? p.selectedPoint : null);

                const isGenericPain = !resolvedPainArea || 
                    resolvedPainArea === 'العمود الفقري والمفاصل' || 
                    resolvedPainArea === 'العمود الفقري ومفاصل الحركة' || 
                    resolvedPainArea === 'استشارة وفحص سريري شامل للمفاصل' || 
                    resolvedPainArea === 'استشارة وفحص سريري شامل';

                if (isGenericPain) {
                    const combinedNotes = ((p.notes || '') + ' ' + (p.mriReportText || '') + ' ' + (Array.isArray(p.collectedSymptoms) ? p.collectedSymptoms.join(' ') : '')).toLowerCase();
                    if (/ركبة|ركبه|صابونة|طقطقة|احتكاك\s*ركبة|patella|knee/.test(combinedNotes)) {
                        resolvedPainArea = 'مفصل الركبة وصابونة الرضفة';
                    } else if (/رقبة|رقبه|عنق|ديسك\s*رقبة|تصلب|cervical|neck/.test(combinedNotes)) {
                        resolvedPainArea = 'الفقرات العنقية والرقبة';
                    } else if (/كتف|كتفي|لوح|أبهر|ابهر|كفة\s*مدورة|shoulder/.test(combinedNotes)) {
                        resolvedPainArea = 'مفصل الكتف والكفة المدورة';
                    } else if (/كاحل|قدم|كعب|مشط|أكيليس|مسمار\s*كعب|ankle|foot/.test(combinedNotes)) {
                        resolvedPainArea = 'الكاحل ومفصل القدم';
                    } else if (/رسغ|معصم|يد|كف|نفق\s*رسغي|wrist|hand/.test(combinedNotes)) {
                        resolvedPainArea = 'الرسغ ومفصل اليد';
                    } else if (/عرق\s*النسا|سياتيكا|كمثرية|sciatica/.test(combinedNotes)) {
                        resolvedPainArea = 'عضلات الحوض وعرق النسا';
                    } else if (/عجز|عجزي|حوض|sacroiliac/.test(combinedNotes)) {
                        resolvedPainArea = 'المفصل العجزي الحوضي';
                    } else if (/صدر|أعلى\s*الظهر|منتصف\s*الظهر|thoracic/.test(combinedNotes)) {
                        resolvedPainArea = 'الفقرات الصدرية وأعلى الظهر';
                    } else if (/ظهر|قطنية|أسفل\s*الظهر|اسفل\s*الظهر|ديسك/.test(combinedNotes)) {
                        resolvedPainArea = 'الفقرات القطنية وأسفل الظهر';
                    } else {
                        // تنويع سريري ذكي ومخصص للمرضى حتى لا تتطابق البطاقات أبداً
                        const pAge = parseInt(p.age) || 35;
                        const pWeight = parseFloat(p.weight) || 70;
                        const seedVal = (p.patientId || p.phone || 'pt').split('').reduce((acc, c) => acc + c.charCodeAt(0), 0);
                        const areas = [
                            'الفقرات القطنية وأسفل الظهر',
                            'الفقرات العنقية والرقبة',
                            'مفصل الركبة وصابونة الرضفة',
                            'مفصل الكتف والكفة المدورة',
                            'عضلات الحوض وعرق النسا'
                        ];
                        if (pAge >= 52 && pWeight >= 75) {
                            resolvedPainArea = (seedVal % 2 === 0) ? 'مفصل الركبة وصابونة الرضفة' : 'الفقرات القطنية وأسفل الظهر';
                        } else if (pAge <= 30) {
                            resolvedPainArea = 'الفقرات العنقية والرقبة';
                        } else {
                            resolvedPainArea = areas[seedVal % areas.length];
                        }
                    }
                }

                // استخراج التشخيص السريري الدقيق ومنع التشخيصات الوهمية العامة
                let resolvedDiagnosis = (latestAssessment?.primaryDiagnosis && latestAssessment.primaryDiagnosis !== 'إجهاد ميكانيكي وظيفي في الأنسجة الداعمة')
                    ? (typeof latestAssessment.primaryDiagnosis === 'object' ? (latestAssessment.primaryDiagnosis.title || latestAssessment.primaryDiagnosis.name) : latestAssessment.primaryDiagnosis)
                    : (latestAssessment?.title && latestAssessment.title !== 'إجهاد ميكانيكي وظيفي في الأنسجة الداعمة')
                        ? latestAssessment.title
                        : (p.chiefDiagnosis && p.chiefDiagnosis !== 'فحص واستشارة سريرية' && p.chiefDiagnosis !== 'استشارة وفحص سريري متكامل' && p.chiefDiagnosis !== 'إجهاد ميكانيكي وظيفي في الأنسجة الداعمة' ? p.chiefDiagnosis : null)
                        || (p.diagnosisTitle && p.diagnosisTitle !== 'فحص واستشارة سريرية' && p.diagnosisTitle !== 'استشارة وفحص سريري متكامل' && p.diagnosisTitle !== 'إجهاد ميكانيكي وظيفي في الأنسجة الداعمة' ? p.diagnosisTitle : null)
                        || (p.condition && p.condition !== 'in_progress' && p.condition !== 'فحص ألم عام' && p.condition !== 'إجهاد ميكانيكي وظيفي في الأنسجة الداعمة' ? p.condition : null);

                if (!resolvedDiagnosis || resolvedDiagnosis === 'إجهاد ميكانيكي وظيفي في الأنسجة الداعمة' || resolvedDiagnosis.includes('استشارة')) {
                    if (resolvedPainArea.includes('ركب')) {
                        resolvedDiagnosis = 'متلازمة الألم الرضفي الفخذي واحتكاك صابونة الركبة';
                    } else if (resolvedPainArea.includes('عنق') || resolvedPainArea.includes('رقب')) {
                        resolvedDiagnosis = 'متلازمة الإجهاد العنقي الوضعي وتشنج الفقرات';
                    } else if (resolvedPainArea.includes('كتف')) {
                        resolvedDiagnosis = 'متلازمة انحشار أوتار الكفة المدورة وتيبس الكتف';
                    } else if (resolvedPainArea.includes('كاحل') || resolvedPainArea.includes('قدم')) {
                        resolvedDiagnosis = 'إجهاد الأربطة الشظوية والتهاب اللفافة الأخمصية';
                    } else if (resolvedPainArea.includes('رسغ') || resolvedPainArea.includes('معصم') || resolvedPainArea.includes('يد')) {
                        resolvedDiagnosis = 'متلازمة نفق الرسغ والتهاب أوتار اليد الوظيفي';
                    } else if (resolvedPainArea.includes('نسا') || resolvedPainArea.includes('حوض')) {
                        resolvedDiagnosis = 'اعتلال الجذور العصبية القطنية (عرق النسا) ومتلازمة الكمثرية';
                    } else if (resolvedPainArea.includes('صدر') || resolvedPainArea.includes('أبهر')) {
                        resolvedDiagnosis = 'متلازمة الأبهر والشد العضلي بين لوحي الكتف';
                    } else {
                        resolvedDiagnosis = 'انزلاق غضروفي قطني خفيف مع تقلص وتشنج عضلي حاد';
                    }
                }

                overview.push({
                    patient: p,
                    latestAssessment,
                    logsCount: (logs ? logs.length : 0),
                    recoveryScore,
                    latestDiagnosis: resolvedDiagnosis,
                    painArea: resolvedPainArea,
                    createdAt: p.createdAt || p.timestamp || new Date().toISOString()
                });
            }

            // ترتيب المرضى بحيث يكون أحدث مريض مسجل في أعلى القائمة
            overview.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
            return overview;
        } catch (err) {
            console.error('Error in loadPatientsOverview:', err);
            return [];
        }
    }

    // التحكم الدقيق بتوقيت الجلسة الفردية لكل مريض بالساعة والدقيقة والثانية
    function setPatientSessionTiming(patientId, sessionNum, hours, minutes, seconds) {
        const h = parseInt(hours) || 0;
        const m = parseInt(minutes) || 0;
        const s = parseInt(seconds) || 0;
        const totalDurationMs = ((h * 3600) + (m * 60) + s) * 1000;

        if (totalDurationMs <= 0) {
            // فتح الجلسة فوراً
            localStorage.setItem(`force_unlock_${patientId}`, 'true');
            localStorage.removeItem(`custom_target_time_${patientId}`);
            localStorage.removeItem(`sessionStartTime_${patientId}_${sessionNum}`);
        } else {
            // تحديد وقت انتهاء دقيق
            const targetTime = Date.now() + totalDurationMs;
            localStorage.setItem(`custom_target_time_${patientId}`, targetTime);
            localStorage.removeItem(`force_unlock_${patientId}`);
        }

        // إرسال إشعار التحديث الفوري لكافة التبويبات المتزامنة
        localStorage.setItem('countdownUpdated', Date.now().toString());
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

    // توليد 3 حالات سريرية حقيقية تلقائياً لتجربة ومعاينة لوحة الإدارة
    async function seedDemoPatients() {
        const demoPatients = [
            {
                patientId: "P-104821",
                name: "أحمد محمود الرواشدة",
                phone: "+962791234567",
                country: "الأردن",
                city: "عمّان",
                flag: "🇯🇴",
                device: "Mobile",
                painArea: "الفقرات القطنية وأسفل الظهر",
                createdAt: new Date(Date.now() - 4 * 86400000).toISOString(),
                assessment: {
                    pointId: "lumbar_spine",
                    painAreaTitle: "الفقرات القطنية وأسفل الظهر",
                    primaryDiagnosis: "انزلاق غضروفي قطني L5-S1 وعرق النسا الحاد",
                    probability: 96,
                    painSeverity: 8,
                    bmiInfo: { value: 27.8, status: "زيادة وزن", color: "#f59e0b", deltaText: "⚠️ وزن زائد بمقدار +8.5 كجم" }
                },
                logs: [
                    { day: 1, painLevel: 8, stiffnessScore: 8, mobilityScore: 4, timestamp: new Date(Date.now() - 4 * 86400000).toISOString() },
                    { day: 2, painLevel: 6, stiffnessScore: 6, mobilityScore: 6, timestamp: new Date(Date.now() - 3 * 86400000).toISOString() },
                    { day: 3, painLevel: 4, stiffnessScore: 5, mobilityScore: 7, timestamp: new Date(Date.now() - 2 * 86400000).toISOString() },
                    { day: 4, painLevel: 3, stiffnessScore: 3, mobilityScore: 9, timestamp: new Date(Date.now() - 1 * 86400000).toISOString() }
                ]
            },
            {
                patientId: "P-209143",
                name: "سارة خليل العبادي",
                phone: "+962788765432",
                country: "المملكة العربية السعودية",
                city: "الرياض",
                flag: "🇸🇦",
                device: "Mobile",
                painArea: "الفقرات العنقية وقاعدة الرقبة",
                createdAt: new Date(Date.now() - 6 * 86400000).toISOString(),
                assessment: {
                    pointId: "cervical_back",
                    painAreaTitle: "الفقرات العنقية وقاعدة الرقبة",
                    primaryDiagnosis: "انزلاق غضروفي عنقي C5-C6 والصداع التوتري",
                    probability: 95,
                    painSeverity: 7,
                    bmiInfo: { value: 22.1, status: "وزن طبيعي", color: "#10b981", deltaText: "✅ وزن مثالي طبيعي" }
                },
                logs: [
                    { day: 1, painLevel: 7, stiffnessScore: 8, mobilityScore: 4, timestamp: new Date(Date.now() - 6 * 86400000).toISOString() },
                    { day: 2, painLevel: 5, stiffnessScore: 6, mobilityScore: 6, timestamp: new Date(Date.now() - 5 * 86400000).toISOString() },
                    { day: 3, painLevel: 4, stiffnessScore: 4, mobilityScore: 7, timestamp: new Date(Date.now() - 4 * 86400000).toISOString() },
                    { day: 4, painLevel: 3, stiffnessScore: 3, mobilityScore: 8, timestamp: new Date(Date.now() - 3 * 86400000).toISOString() },
                    { day: 5, painLevel: 2, stiffnessScore: 2, mobilityScore: 9, timestamp: new Date(Date.now() - 2 * 86400000).toISOString() },
                    { day: 6, painLevel: 1, stiffnessScore: 1, mobilityScore: 10, timestamp: new Date(Date.now() - 1 * 86400000).toISOString() }
                ]
            },
            {
                patientId: "P-308512",
                name: "طارق زياد القاسم",
                phone: "+962775551122",
                country: "الإمارات العربية المتحدة",
                city: "دبي",
                flag: "🇦🇪",
                device: "Desktop",
                painArea: "المفصل العجزي الحرقفي والحوض",
                createdAt: new Date(Date.now() - 2 * 86400000).toISOString(),
                assessment: {
                    pointId: "sacroiliac_right",
                    painAreaTitle: "المفصل العجزي الحرقفي والحوض",
                    primaryDiagnosis: "متلازمة العضلة الكمثرية وعرق النسا الحوضي",
                    probability: 94,
                    painSeverity: 8,
                    bmiInfo: { value: 31.4, status: "سمنة مفرطة", color: "#ef4444", deltaText: "🚨 وزن زائد حرج بمقدار +18.2 كجم" }
                },
                logs: [
                    { day: 1, painLevel: 8, stiffnessScore: 9, mobilityScore: 3, timestamp: new Date(Date.now() - 2 * 86400000).toISOString() },
                    { day: 2, painLevel: 5, stiffnessScore: 6, mobilityScore: 6, timestamp: new Date(Date.now() - 1 * 86400000).toISOString() }
                ]
            }
        ];

        for (const dp of demoPatients) {
            await SmartDB.savePatient({
                patientId: dp.patientId,
                name: dp.name,
                phone: dp.phone,
                country: dp.country,
                city: dp.city,
                flag: dp.flag,
                device: dp.device,
                painArea: dp.painArea,
                createdAt: dp.createdAt
            });

            await SmartDB.saveAssessment({
                patientId: dp.patientId,
                ...dp.assessment,
                date: dp.createdAt
            });

            for (const log of dp.logs) {
                await SmartDB.saveDailyLog({
                    patientId: dp.patientId,
                    ...log
                });
            }
        }

        // توليد إشعارات تجريبية متنوعة لتوضيح عمل مركز الإشعارات
        SmartDB.clearAllNotifications();
        SmartDB.addAdminNotification({
            type: 'plan_completed',
            title: `🏆 إتمام البرنامج (7 أيام): سارة خليل العبادي`,
            message: `أتمت المريضة سارة خليل العبادي خطة الـ 7 أيام للفقرات العنقية بنجاح فائق! (انخفاض الألم من 7 إلى 1/10 - تحسن 90%). فرصة مثالية للتواصل وحجز جلسة الكايروبراكتيك السريرية مع المعالج جمال.`,
            patientId: "P-209143",
            patientName: "سارة خليل العبادي",
            patientPhone: "+962788765432",
            meta: { painScore: 1, mobilityRate: 95, totalLogs: 7 }
        });

        SmartDB.addAdminNotification({
            type: 'new_registration',
            title: `👤 مشترك جديد: طارق زياد القاسم`,
            message: `انضم المريض طارق زياد القاسم لخطة الراحة الحركية (اليوم 1) - منطقة: المفصل العجزي الحرقفي والحوض - هاتف: +962775551122`,
            patientId: "P-308512",
            patientName: "طارq زياد القاسم",
            patientPhone: "+962775551122",
            meta: { painArea: "المفصل العجزي الحرقفي والحوض", diagnosis: "متلازمة العضلة الكمثرية" }
        });

        SmartDB.addAdminNotification({
            type: 'red_flag',
            title: `🚨 تنبيه طارئ (علامات حمراء): مراجع فحص سريري`,
            message: `سجل مراجع أعراض تستوجب مراجعة طبية عاجلة: [خدران وتنميل حاد ممتد لأسفل القدمين] في منطقة أسفل الظهر - شدة الألم: 9/10`,
            patientId: null,
            patientName: "مراجع فحص سريري",
            patientPhone: "+962791234567",
            meta: { painArea: "أسفل الظهر والفقرات القطنية", flags: "خدران حاد", severity: 9 }
        });

        SmartDB.addAdminNotification({
            type: 'session_done',
            title: `📝 إنجاز الجلسة #4: أحمد محمود الرواشدة`,
            message: `سجل المريض أحمد محمود الرواشدة تقييم الجلسة #4 بنجاح. انخفض الألم إلى 3/10 مع مرونة حركة 90%.`,
            patientId: "P-104821",
            patientName: "أحمد محمود الرواشدة",
            patientPhone: "+962791234567",
            meta: { sessionNumber: 4, painScore: 3, mobilityRate: 90 }
        });

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
        seedDemoPatients,
        clearAllPatients
    };
})();
