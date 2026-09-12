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

            const patients = await SmartDB.getAllPatients();
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
                
                // استخراج التقييم السريري الشامل: من IndexedDB أو من كائن المريض السحابي
                let latestAssessment = assessments.length > 0 ? assessments[assessments.length - 1] : null;
                if (!latestAssessment) {
                    latestAssessment = p.assessment || p.latestAssessment || p.diagnosticReport || p.clinicalData || null;
                    // مزامنة التقييم إلى SmartDB محلياً لضمان سرعة الوصول واستقرار التقارير مستقبلاً
                    if (latestAssessment && typeof SmartDB.saveAssessment === 'function') {
                        try {
                            SmartDB.saveAssessment({
                                patientId: p.patientId,
                                ...latestAssessment
                            });
                        } catch (e) {}
                    }
                }

                const baselinePain = latestAssessment ? (latestAssessment.painSeverity || latestAssessment.painLevel || p.painLevel || 7) : (p.painLevel || 7);
                
                let recoveryScore = p.recoveryScore || 15;
                if (typeof PatientFlow !== 'undefined' && typeof PatientFlow.calculateRecoveryScore === 'function') {
                    recoveryScore = PatientFlow.calculateRecoveryScore(baselinePain, logs);
                } else if (logs && logs.length > 0) {
                    recoveryScore = Math.min(100, Math.round((logs.length / 7) * 100));
                }

                // استخراج التشخيص السريري الدقيق ومنع ظهور "غير محدد" نهائياً
                let resolvedDiagnosis = latestAssessment?.primaryDiagnosis 
                    || latestAssessment?.title
                    || p.chiefDiagnosis 
                    || p.diagnosisTitle 
                    || (p.condition && p.condition !== 'in_progress' ? p.condition : null)
                    || (latestAssessment?.painAreaTitle ? `فحص سريري متكامل (${latestAssessment.painAreaTitle})` : null)
                    || (p.painArea ? `فحص سريري متكامل (${p.painArea})` : null)
                    || (p.selectedPoint ? `فحص سريري (${p.selectedPoint})` : null)
                    || 'استشارة وفحص سريري متكامل';

                // استخراج موضع الشكوى الدقيق
                let resolvedPainArea = latestAssessment?.painAreaTitle 
                    || latestAssessment?.painLocation
                    || p.painArea 
                    || p.painAreaTitle
                    || p.selectedPoint 
                    || 'العمود الفقري والمفاصل';

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
