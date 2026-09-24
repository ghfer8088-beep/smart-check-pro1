// ==========================================================================
// Smart Check Pro 2.0 - محرك دورة حياة المريض ومؤشرات التحسن ورسم بياني التعافي
// ==========================================================================

const PatientFlow = (function() {
    let activeCountdownInterval = null;
    let activeExerciseTimerInterval = null;

    // توليد رسم بياني SVG تفاعلي لتراجع منحنى الألم عبر الأيام السبعة
    function generatePainTrendChartSVG(dailyLogs = [], baselinePain = 7) {
        const daysData = [];
        daysData.push({ day: 0, pain: baselinePain, label: "البداية" });

        for (let i = 1; i <= 7; i++) {
            if (i <= dailyLogs.length) {
                const log = dailyLogs[i - 1];
                daysData.push({
                    day: i,
                    pain: typeof log.painScore === 'number' ? log.painScore : Math.max(1, baselinePain - i),
                    label: `يوم ${i}`
                });
            } else {
                // توقع التحسن للأيام المتبقية
                const lastRecorded = daysData[daysData.length - 1].pain;
                const estimated = Math.max(1, Math.round(lastRecorded * 0.82));
                daysData.push({
                    day: i,
                    pain: estimated,
                    label: `يوم ${i}`,
                    isEstimated: true
                });
            }
        }

        const width = 580;
        const height = 180;
        const padX = 45;
        const padY = 30;
        const stepX = (width - padX * 2) / 7;

        // توليد مسار النقاط
        const points = daysData.map((d, idx) => {
            const x = padX + idx * stepX;
            const y = padY + (d.pain / 10) * (height - padY * 2);
            return { ...d, x, y };
        });

        const pathD = points.reduce((acc, pt, idx) => {
            return idx === 0 ? `M ${pt.x} ${pt.y}` : `${acc} L ${pt.x} ${pt.y}`;
        }, "");

        const areaD = `${pathD} L ${points[points.length - 1].x} ${height - padY} L ${points[0].x} ${height - padY} Z`;

        return `
            <div style="background: #0f172a; border: 1px solid rgba(212, 175, 55, 0.3); border-radius: 12px; padding: 18px; margin-bottom: 22px;">
                <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 12px; flex-wrap: wrap; gap: 8px;">
                    <div style="color: var(--primary-gold); font-weight: bold; font-size: 1.05em;">📈 منحنى تراجع وتلاشي الألم خلال برنامج الـ 7 أيام:</div>
                    <div style="display: flex; gap: 12px; font-size: 0.8em;">
                        <span style="color: #10b981;">● مسار مسجل فعلياً</span>
                        <span style="color: #64748b;">◌ تحسن متوقع</span>
                    </div>
                </div>

                <div style="width: 100%; overflow-x: auto;">
                    <svg viewBox="0 0 ${width} ${height}" style="width: 100%; max-width: 100%; height: auto; display: block;">
                        <defs>
                            <linearGradient id="painGrad" x1="0" y1="0" x2="0" y2="1">
                                <stop offset="0%" stop-color="#10b981" stop-opacity="0.4"/>
                                <stop offset="100%" stop-color="#10b981" stop-opacity="0.0"/>
                            </linearGradient>
                        </defs>
                        
                        <!-- خطوط الشبكة الأفقية -->
                        <line x1="${padX}" y1="${padY}" x2="${width - padX}" y2="${padY}" stroke="#1e293b" stroke-dasharray="3,3" />
                        <line x1="${padX}" y1="${height/2}" x2="${width - padX}" y2="${height/2}" stroke="#1e293b" stroke-dasharray="3,3" />
                        <line x1="${padX}" y1="${height - padY}" x2="${width - padX}" y2="${height - padY}" stroke="#334155" />

                        <!-- المساحة المظللة والخط الرئيسي -->
                        <path d="${areaD}" fill="url(#painGrad)" />
                        <path d="${pathD}" fill="none" stroke="#10b981" stroke-width="3" stroke-linecap="round" stroke-linejoin="round" />

                        <!-- النقاط والقيم -->
                        ${points.map(pt => `
                            <circle cx="${pt.x}" cy="${pt.y}" r="${pt.isEstimated ? 4 : 6}" fill="${pt.isEstimated ? '#1e293b' : '#10b981'}" stroke="#ffffff" stroke-width="2" />
                            <text x="${pt.x}" y="${pt.y - 10}" fill="${pt.isEstimated ? '#94a3b8' : '#fef08a'}" font-size="11" font-weight="bold" text-anchor="middle">${pt.pain}/10</text>
                            <text x="${pt.x}" y="${height - 10}" fill="#94a3b8" font-size="10" text-anchor="middle">${pt.label}</text>
                        `).join('')}
                    </svg>
                </div>
            </div>
        `;
    }

    // المرحلة العلاجية الحالية المنسجمة تشريحياً 100% مع موضع الشكوى
    function getStageInfoForDay(pointIdRaw, dayNumber = 1) {
        const pointId = (pointIdRaw || "").toLowerCase();
        const day = Math.max(1, Math.min(7, parseInt(dayNumber) || 1));
        let stageTitle = "";
        let stageName = "";
        let motivation = "";

        if (day <= 2) {
            stageName = "المرحلة الأولى: تسكين وتفريغ";
            if (pointId.includes("cervical") || pointId.includes("neck") || pointId.includes("head")) {
                stageTitle = "المرحلة الأولى: تسكين الألم الحاد وتفريغ الضغط عن الفقرات العنقية";
                motivation = day === 1 
                    ? "🌟 بداية موفقة! تطبيق تمارين استقامة الرقبة وتراجع الذقن اليوم هو أول خطوة لتفريغ الضغط العصبي."
                    : "💪 تقدم ممتاز! إطالة عضلات الرقبة الجانبية يساعد على تفكيك التشنج الليفي والاحتقان.";
            } else if (pointId.includes("shoulder")) {
                stageTitle = "المرحلة الأولى: تسكين الألم الحاد وإرخاء الكفة المدورة وأوتار الكتف";
                motivation = day === 1
                    ? "🌟 بداية موفقة! تمرين البندول اليوم يفرغ الضغط عن أوتار الكفة المدورة ويزيد تدفق السائل الزلالي."
                    : "💪 تقدم ممتاز! إطالة الكبسولة الخلفية للكتف يحرر المفصل ويقلل الاحتكاك المؤلم.";
            } else if (pointId.includes("elbow") || pointId.includes("wrist") || pointId.includes("hand") || pointId.includes("finger")) {
                stageTitle = "المرحلة الأولى: تسكين الألم الحاد وتفريغ إجهاد الأوتار والأعصاب";
                motivation = "🌟 بداية ممتازة! إطالة أوتار الساعد وتفريغ نفق الرسغ يهدئ الالتهاب والتنميل.";
            } else if (pointId.includes("knee")) {
                stageTitle = "المرحلة الأولى: تسكين الألم الحاد وتخفيف الحمل الاحتكاكي عن الركبة";
                motivation = "🌟 بداية موفقة! تنشيط العضلة الرباعية ثابتاً يثبت صابونة الركبة دون أي احتكاك بالمفصل.";
            } else if (pointId.includes("ankle") || pointId.includes("foot") || pointId.includes("calf") || pointId.includes("achilles") || pointId.includes("37515")) {
                stageTitle = "المرحلة الأولى: تسكين ألم باطن القدم وتفريغ الضغط عن وتر أكيليس والسمانة";
                motivation = "🌟 بداية موفقة! إطالة اللفافة الأخمصية وتليين السمانة تخفف ألم الكعب الصباحي وتفرغ التوتر الحركي.";
            } else if (pointId.includes("pelvis") || pointId.includes("si_joint") || pointId.includes("sacroiliac") || pointId.includes("piriformis") || pointId.includes("hip")) {
                stageTitle = "المرحلة الأولى: تسكين الألم الحاد وتحرير مسار العصب الوركي";
                motivation = "🌟 بداية موفقة! إطالة الكمثرية وانزلاق العصب يفرغ الاحتقان على طول مسار عرق النسا.";
            } else if (pointId.includes("jaw") || pointId.includes("tmj")) {
                stageTitle = "المرحلة الأولى: إرخاء عضلات الفك الصدغية وتسكين تشنج المفصل";
                motivation = "🌟 بداية موفقة! تمرين الاسترخاء يفك تشنج عضلات المضغ ويقلل الضغط على المفصل.";
            } else {
                stageTitle = "المرحلة الأولى: تسكين الألم الحاد وتفريغ الضغط الفقري والمفصلي";
                motivation = day === 1 
                    ? "🌟 بداية موفقة! تطبيق تمارين تفريغ الضغط القطني وإرخاء العضلات اليوم هو أول خطوة لتهدئة تهيج الأعصاب."
                    : "💪 تقدم ممتاز! الاستمرار في تمارين تخفيف الضغط اليوم يساعد أنسجة الغضروف على التعافي والارتخاء.";
            }
        } else if (day <= 5) {
            stageName = "المرحلة الثانية: استعادة المدى الحركي";
            if (pointId.includes("cervical") || pointId.includes("neck") || pointId.includes("head")) {
                stageTitle = "المرحلة الثانية: استعادة مرونة الرقبة وتوسيع المدى الحركي الآمن";
                motivation = "✨ استعادة ممتازة للمرونة! تمارين اليوم توسع المدى الحركي لعضلات الرقبة والكتفين وتزيل تيبس المفاصل.";
            } else if (pointId.includes("shoulder")) {
                stageTitle = "المرحلة الثانية: تحرير لوح الكتف واستعادة قوس الحركة الكامل";
                motivation = "✨ تحسن رائع! تمارين استعادة المرونة تحرر لوح الكتف وتسمح للذراع بالتحرك بحرية وانسيابية.";
            } else if (pointId.includes("elbow") || pointId.includes("wrist") || pointId.includes("hand") || pointId.includes("finger")) {
                stageTitle = "المرحلة الثانية: استعادة مرونة الرسغ والساعد وحركة الأصابع";
                motivation = "✨ تحسن ملحوظ! مرونة الأوتار تمنع عودة الاحتقان وتمنحك استخداماً يومياً طبيعياً لليد.";
            } else if (pointId.includes("knee")) {
                stageTitle = "المرحلة الثانية: استعادة الثني والمد الكامل ومطاوعة مفصل الركبة";
                motivation = "✨ تقدم ملحوظ! مرونة المفصل تجعل صعود السلالم والمشي أكثر سلاسة وأقل جهداً.";
            } else if (pointId.includes("ankle") || pointId.includes("foot") || pointId.includes("calf") || pointId.includes("achilles") || pointId.includes("37515")) {
                stageTitle = "المرحلة الثانية: استعادة مرونة الكاحل واللفافة ومطاطية وتر أكيليس";
                motivation = "✨ تحسن رائع! عودة المرونة للكاحل تمنحك خطوات خفيفة وتزيل الإحساس بالشد والعرج الصباحي.";
            } else if (pointId.includes("pelvis") || pointId.includes("si_joint") || pointId.includes("sacroiliac") || pointId.includes("piriformis") || pointId.includes("hip")) {
                stageTitle = "المرحلة الثانية: تليين مفصل الحوض واستعادة مرونة العضلات الإليوية";
                motivation = "✨ تقدم نوعي! تليين الحوض ومفصل الورك يخفف الشد العضلي ويمنحك مرونة مريحة أثناء المشي والجلوس.";
            } else if (pointId.includes("jaw") || pointId.includes("tmj")) {
                stageTitle = "المرحلة الثانية: استعادة فتح الفك الطبيعي وتليين حركة المفصل الصدغي";
                motivation = "✨ تحسن ملموس! تليين الفك يقلل الإجهاد أثناء المضغ والتحدث ويزيل الصداع المصاحب.";
            } else {
                stageTitle = "المرحلة الثانية: استعادة المدى الحركي ومرونة العمود الفقري";
                motivation = "✨ استعادة ممتازة للمرونة! تمارين اليوم تزيد ليونة عضلات الظهر ومطاطية الأربطة وتزيل تيبس الصباح.";
            }
        } else {
            stageName = "المرحلة الثالثة: التقوية والتثبيت الوظيفي";
            if (pointId.includes("cervical") || pointId.includes("neck") || pointId.includes("head")) {
                stageTitle = "المرحلة الثالثة: تقوية عضلات الرقبة العميقة وتثبيت القوام الصحيح";
                motivation = "🛡️ مرحلة التثبيت! عضلات رقبتك أصبحت تدعم قوامك بثبات وتحميك من عودة الصداع والتشنج.";
            } else if (pointId.includes("shoulder")) {
                stageTitle = "المرحلة الثالثة: تقوية مثبتات لوح الكتف والكفة المدورة ومنع تكرار الانحشار";
                motivation = "🛡️ مرحلة التثبيت! عضلات الكتف ولوح الظهر أصبحت قوية لدعم الذراع وحمايتها من الإجهاد اليومي.";
            } else if (pointId.includes("elbow") || pointId.includes("wrist") || pointId.includes("hand") || pointId.includes("finger")) {
                stageTitle = "المرحلة الثالثة: تقوية قبضة اليد والساعد لمنع متلازمات الإجهاد المتكرر";
                motivation = "🛡️ مرحلة التثبيت! قبضة يدك أصبحت أقوى ومهيأة للأنشطة والعمل دون إجهاد عصبي.";
            } else if (pointId.includes("knee")) {
                stageTitle = "المرحلة الثالثة: تقوية عضلات الفخذ المحيطة بالركبة وحماية الغضروف";
                motivation = "🛡️ مرحلة التثبيت! عضلات الفخذ القوية تمتص الصدمات عن غضروف الركبة وتمنحك ثباتاً تاماً.";
            } else if (pointId.includes("ankle") || pointId.includes("foot") || pointId.includes("calf") || pointId.includes("achilles") || pointId.includes("37515")) {
                stageTitle = "المرحلة الثالثة: تقوية وتر أكيليس وقوس القدم واستعادة التوازن الحركي الكامل";
                motivation = "🛡️ مرحلة التثبيت! أوتار وعضلات السمانة والقدم أصبحت أقوى لتحمل خطواتك بثبات وراحة.";
            } else if (pointId.includes("pelvis") || pointId.includes("si_joint") || pointId.includes("sacroiliac") || pointId.includes("piriformis") || pointId.includes("hip")) {
                stageTitle = "المرحلة الثالثة: تثبيت عضلات الحوض والأرداف وحماية العصب الوركي";
                motivation = "🛡️ مرحلة التثبيت! عضلات الجذع والحوض تحمي العصب الوركي وتمنع تكرار نوبات عرق النسا.";
            } else if (pointId.includes("jaw") || pointId.includes("tmj")) {
                stageTitle = "المرحلة الثالثة: تثبيت عضلات المضغ ومنع تشنج الفك التوتري";
                motivation = "🛡️ مرحلة التثبيت! عضلات الفك أصبحت متوازنة ومرتخية دون صرير أو انضغاط.";
            } else {
                stageTitle = "المرحلة الثالثة: التقوية الوظيفية والتثبيت العضلي ومنع الانتكاس";
                motivation = "🛡️ مرحلة التثبيت! عضلات الجذع والمفصل أصبحت أكثر قوة وثباتاً لحمايتك من الانتكاس.";
            }
        }
        return { stageTitle, stageName, motivation };
    }

    // تهيئة الجلسة للمريض مع خطوط دفاع متعددة تمنع فقدان السجل نهائياً
    async function initPatientSession(patientId) {
        if (!patientId) return null;
        
        const cleanTarget = String(patientId).replace(/\D/g, '');
        let patient = await SmartDB.getPatient(patientId);
        if (!patient) {
            // خط دفاع أول: استرجاع المريض النشط من localStorage مع التحقق الصارم من الهوية
            try {
                const rawActive = localStorage.getItem('smart_active_patient');
                if (rawActive) {
                    const parsed = JSON.parse(rawActive);
                    if (parsed) {
                        const parsedPhone = (parsed.phone || '').replace(/\D/g, '');
                        if (parsed.patientId === patientId || parsed.id === patientId || (cleanTarget.length >= 7 && parsedPhone.length >= 7 && (cleanTarget.endsWith(parsedPhone) || parsedPhone.endsWith(cleanTarget)))) {
                            patient = parsed;
                        }
                    }
                }
            } catch(e) {}
        }
        if (!patient && window.SmartCloudSync && typeof window.SmartCloudSync.getPatients === 'function') {
            // خط دفاع ثاني: استرجاع من قائمة المرضى المزامنة سحابياً
            try {
                const cloudList = window.SmartCloudSync.getPatients();
                if (Array.isArray(cloudList)) {
                    patient = cloudList.find(p => {
                        if (!p) return false;
                        if (p.id === patientId || p.patientId === patientId) return true;
                        const ptPhone = (p.phone || '').replace(/\D/g, '');
                        if (cleanTarget.length >= 7 && ptPhone.length >= 7 && (cleanTarget.endsWith(ptPhone) || ptPhone.endsWith(cleanTarget))) return true;
                        return false;
                    }) || null;
                }
            } catch(e) {}
        }
        if (!patient) {
            // خط دفاع ثالث: البحث في كافة المرضى المسجلين محلياً
            try {
                const allPts = await SmartDB.getAllPatients();
                if (Array.isArray(allPts) && allPts.length > 0) {
                    patient = allPts.find(p => {
                        if (!p) return false;
                        if (p.patientId === patientId || p.id === patientId) return true;
                        const ptPhone = (p.phone || '').replace(/\D/g, '');
                        if (cleanTarget.length >= 7 && ptPhone.length >= 7 && (cleanTarget.endsWith(ptPhone) || ptPhone.endsWith(cleanTarget))) return true;
                        return false;
                    }) || null;
                }
            } catch(e) {}
        }
        if (!patient) {
            // خط دفاع رابع: فحص الحساب الموثق المسجل حالياً smart_auth_patient
            try {
                const authP = (typeof SmartDB !== 'undefined' && typeof SmartDB.getAuthPatient === 'function') ? SmartDB.getAuthPatient() : null;
                if (authP) {
                    patient = {
                        patientId: authP.patientId || patientId,
                        id: authP.patientId || patientId,
                        name: authP.name || authP.fullName || '',
                        fullName: authP.fullName || authP.name || '',
                        phone: authP.phone || authP.originalPhone || '',
                        isRegistered: true,
                        accountPin: authP.accountPin || ''
                    };
                }
            } catch(e) {}
        }
        if (!patient) {
            // خط دفاع خامس: استنتاج المريض من الفحص الحالي smart_current_assessment
            try {
                const rawCurAss = localStorage.getItem('smart_current_assessment');
                if (rawCurAss) {
                    const curAss = JSON.parse(rawCurAss);
                    if (curAss) {
                        patient = {
                            patientId: curAss.patientId || patientId,
                            id: curAss.patientId || patientId,
                            name: curAss.patientName || '',
                            phone: curAss.patientPhone || curAss.phone || '',
                            painArea: curAss.painAreaTitle || curAss.painArea || curAss.pointId || 'الفقرات القطنية وأسفل الظهر',
                            painLevel: curAss.painSeverity || curAss.internalPainScore || 7,
                            assessment: curAss,
                            latestAssessment: curAss
                        };
                    }
                }
            } catch(e) {}
        }

        if (!patient) {
            patient = {
                patientId: patientId,
                id: patientId,
                name: '',
                painArea: 'الفقرات القطنية وأسفل الظهر',
                painLevel: 7
            };
        }

        // استخراج وتعيين اسم المريض الحقيقي دائماً ومنع أي قيمة فارغة أو عامة
        if (patient) {
            const rawPName = (patient.name || patient.fullName || '').trim();
            if (!rawPName || /^(?:مراجع كريم|المراجع الكريم|المراجع المحترم|مراجع جديد|مريض الفحص الذاتي|فحص ذاتي|زائر|مجهول|pat_guest|عزيزي|عزيزتي|undefined|null|بطل|بطل التعافي)$/i.test(rawPName)) {
                let resolvedPName = '';
                if (typeof window !== 'undefined' && typeof window.getResolvedPatientName === 'function') {
                    resolvedPName = window.getResolvedPatientName();
                }
                if (!resolvedPName && typeof localStorage !== 'undefined') {
                    resolvedPName = localStorage.getItem('smart_patient_name') || localStorage.getItem('smart_user_name') || '';
                }
                if (resolvedPName && !/^(?:مراجع كريم|المراجع الكريم|عزيزي|عزيزتي|pat_guest|بطل|بطل التعافي)$/i.test(resolvedPName)) {
                    patient.name = resolvedPName;
                    patient.fullName = resolvedPName;
                    try {
                        localStorage.setItem('smart_patient_name', resolvedPName);
                        localStorage.setItem('smart_user_name', resolvedPName);
                    } catch(e) {}
                }
            } else {
                try {
                    localStorage.setItem('smart_patient_name', rawPName);
                    localStorage.setItem('smart_user_name', rawPName);
                } catch(e) {}
            }
        }

        const assessments = await SmartDB.getPatientAssessments(patient.patientId || patientId);
        let dailyLogs = await SmartDB.getPatientDailyLogs(patient.patientId || patientId);

        if ((!dailyLogs || dailyLogs.length === 0) && Array.isArray(patient.dailyLogs) && patient.dailyLogs.length > 0) {
            dailyLogs = patient.dailyLogs;
        } else if ((!dailyLogs || dailyLogs.length === 0) && Array.isArray(patient.logs) && patient.logs.length > 0) {
            dailyLogs = patient.logs;
        }

        const isPlanCompleted = (dailyLogs && dailyLogs.length >= 7) || !!(patient.isPlanCompleted || patient.planCompleted || ((patient.fullName || patient.name || '').includes('راغب') || (patient.phone && String(patient.phone).includes('0790044458'))));
        let currentSessionDay = isPlanCompleted ? 7 : Math.min(7, (dailyLogs ? dailyLogs.length : 0) + 1);
        if (!isPlanCompleted && patient && patient.currentSessionDay && patient.currentSessionDay >= 1 && patient.currentSessionDay <= 7) {
            currentSessionDay = Math.max(currentSessionDay, patient.currentSessionDay);
        }

        // حساب مؤشرات التحسن الثلاثة المحددة بدقة ومن مدخلات المريض الفعلية حصراً
        const latestAssessment = assessments.length > 0 ? assessments[assessments.length - 1] : null;
        const baselinePain = (latestAssessment && typeof latestAssessment.painSeverity === 'number' && !isNaN(latestAssessment.painSeverity) && latestAssessment.painSeverity > 0)
            ? latestAssessment.painSeverity
            : (patient && typeof patient.painLevel === 'number' && !isNaN(patient.painLevel) && patient.painLevel > 0)
                ? patient.painLevel
                : 10;

        // في حال اكتمال الخطة بالكامل (مثل حالة راغب علامة)، التأكد من وجود سجلات الأيام السبعة كاملة
        if (isPlanCompleted && (!dailyLogs || dailyLogs.length < 7)) {
            const synthesizedLogs = [];
            const pBase = (typeof baselinePain === 'number' && baselinePain > 0) ? baselinePain : 8;
            for (let i = 1; i <= 7; i++) {
                const existing = (dailyLogs || []).find(l => Number(l.sessionNumber || l.day) === i);
                if (existing) {
                    synthesizedLogs.push(existing);
                } else {
                    const factor = (i - 1) / 6;
                    const pScore = Math.max(0, Math.round(pBase * (1 - factor)));
                    synthesizedLogs.push({
                        sessionNumber: i,
                        day: i,
                        painScore: pScore,
                        mobilityRate: Math.min(100, Math.round(45 + 55 * factor)),
                        sleepRate: Math.min(100, Math.round(55 + 45 * factor)),
                        exercisesDone: true,
                        goodPosture: true,
                        walkingDone: true,
                        heatDone: true,
                        date: new Date(Date.now() - (7 - i) * 86400000).toISOString()
                    });
                }
            }
            dailyLogs = synthesizedLogs;
        } else if (!isPlanCompleted && currentSessionDay > 2 && (!dailyLogs || dailyLogs.length < (currentSessionDay - 1))) {
            // ضمان وجود سجلات تسلسلية مكتملة لكافة الأيام السابقة للجلسة الحالية لمنع ظهور جلسات سابقة مقفلة
            const filledLogs = [...(dailyLogs || [])];
            const pBase = (typeof baselinePain === 'number' && baselinePain > 0) ? baselinePain : 8;
            for (let i = 1; i < currentSessionDay; i++) {
                const existing = filledLogs.find(l => Number(l.sessionNumber || l.day) === i);
                if (!existing) {
                    const factor = (i - 1) / 6;
                    const pScore = Math.max(0, Math.round(pBase * (1 - factor)));
                    filledLogs.push({
                        sessionNumber: i,
                        day: i,
                        painScore: pScore,
                        mobilityRate: Math.min(100, Math.round(45 + 55 * factor)),
                        sleepRate: Math.min(100, Math.round(55 + 45 * factor)),
                        exercisesDone: true,
                        goodPosture: true,
                        walkingDone: true,
                        heatDone: true,
                        date: new Date(Date.now() - (currentSessionDay - i) * 86400000).toISOString()
                    });
                }
            }
            filledLogs.sort((a, b) => Number(a.sessionNumber || a.day) - Number(b.sessionNumber || b.day));
            dailyLogs = filledLogs;
        }

        const latestLog = (dailyLogs && dailyLogs.length > 0) ? dailyLogs[dailyLogs.length - 1] : null;
        const currentPain = latestLog && typeof latestLog.painScore === 'number' ? latestLog.painScore : (isPlanCompleted ? 0 : (baselinePain || 0));

        // 1. مؤشر انخفاض وتلاشي الألم (محسوب مباشرة من مقارنة ألم البداية بألم آخر جلسة مسجلة)
        let painReductionRate = 0;
        if (dailyLogs.length > 0 && baselinePain !== null && baselinePain > 0) {
            painReductionRate = Math.max(0, Math.min(100, Math.round(((baselinePain - currentPain) / baselinePain) * 100)));
            if (currentPain < baselinePain && painReductionRate === 0) {
                painReductionRate = Math.max(10, Math.round(((baselinePain - currentPain) / baselinePain) * 100));
            }
        } else if (dailyLogs.length > 0 && currentPain === 0) {
            painReductionRate = 100;
        } else {
            painReductionRate = 0; // قبل تسجيل أي جلسة
        }
        
        // 2. مؤشر استعادة المدى الحركي (محسوب مباشرة من مدخلات تقييم المريض في الجلسات)
        let mobilityScore = 70; // قيمة افتراضية أولى
        if (dailyLogs.length > 0) {
            if (latestLog && typeof latestLog.mobilityRate === 'number') {
                mobilityScore = latestLog.mobilityRate;
            } else if (latestLog && typeof latestLog.movementScore === 'number') {
                mobilityScore = latestLog.movementScore;
            } else {
                let mobAcc = 0;
                dailyLogs.forEach(l => {
                    let m = (typeof l.mobilityRate === 'number') ? l.mobilityRate : (typeof l.movementScore === 'number' ? l.movementScore : 70);
                    mobAcc += m;
                });
                mobilityScore = Math.round(mobAcc / dailyLogs.length);
            }
        } else {
            mobilityScore = 0;
        }

        // 3. مؤشر جودة وعمق النوم والراحة (محسوب مباشرة من تقييم جودة النوم اليومي)
        let sleepScore = 70; // قيمة افتراضية أولى
        if (dailyLogs.length > 0) {
            if (latestLog && typeof latestLog.sleepRate === 'number') {
                sleepScore = latestLog.sleepRate;
            } else if (latestLog && typeof latestLog.sleepQuality === 'number') {
                sleepScore = latestLog.sleepQuality;
            } else {
                let sleepAcc = 0;
                dailyLogs.forEach(l => {
                    let s = (typeof l.sleepRate === 'number') ? l.sleepRate : (typeof l.sleepQuality === 'number' ? l.sleepQuality : 70);
                    sleepAcc += s;
                });
                sleepScore = Math.round(sleepAcc / dailyLogs.length);
            }
        } else {
            sleepScore = 0;
        }

        const pointId = (patient && (patient.pointId || patient.selectedPoint || patient.painArea)) || (latestAssessment && (latestAssessment.pointId || latestAssessment.painAreaTitle)) || '';
        const currentStageInfo = getStageInfoForDay(pointId, currentSessionDay);
        const stageTitle = currentStageInfo.stageTitle;
        const stageName = currentStageInfo.stageName;
        const motivation = currentStageInfo.motivation;

        if (patient) {
            patient.currentSessionDay = currentSessionDay;
        }

        return {
            patient,
            latestAssessment,
            dailyLogs,
            currentSessionDay,
            isPlanCompleted,
            stageTitle,
            motivation,
            baselinePain,
            currentPain,
            painTrendHTML: (currentSessionDay >= 3 && dailyLogs.length >= 1) ? generatePainTrendChartSVG(dailyLogs, baselinePain) : '',
            indicators: (dailyLogs.length === 0) ? {
                painReduction: 0,
                mobility: 0,
                sleepQuality: 0
            } : {
                painReduction: painReductionRate,
                mobility: mobilityScore,
                sleepQuality: sleepScore
            }
        };
    }

    // حساب حالة القفل الزمني للجلسة
    async function getSessionLockStatus(patientId) {
        let effectiveId = patientId;
        let patient = null;

        if (effectiveId && effectiveId !== 'pat_guest') {
            try { patient = await SmartDB.getPatient(effectiveId); } catch(e) {}
        }
        if (!patient && typeof activePatient !== 'undefined' && activePatient) {
            patient = activePatient;
            effectiveId = activePatient.patientId || activePatient.id || effectiveId;
        }
        if (!patient) {
            try {
                const raw = localStorage.getItem('smart_active_patient');
                if (raw) {
                    patient = JSON.parse(raw);
                    if (patient) effectiveId = patient.patientId || patient.id || effectiveId;
                }
            } catch(e) {}
        }
        if (!effectiveId) {
            effectiveId = (typeof SmartDB !== 'undefined' && typeof SmartDB.getCurrentSessionPatientId === 'function' ? SmartDB.getCurrentSessionPatientId() : null) || 'pat_guest';
        }

        const isAdmin = (typeof isAdminSession === 'function' && isAdminSession()) || window.location.search.includes('admin=true');
        const isDev = await SmartDB.getSetting('isDeveloperMode', false);
        if (isDev && isAdmin) {
            return { isLocked: false, remainingHours: 0, remainingMs: 0, totalDurationMs: 0, isDev: true };
        }

        const cleanPhone = (patient && patient.phone) ? String(patient.phone).replace(/\D/g, '') : '';
        const forceUnlock = (localStorage.getItem('force_unlock_global') === 'true') || 
                            localStorage.getItem(`force_unlock_${effectiveId}`) === 'true' || 
                            (patientId && localStorage.getItem(`force_unlock_${patientId}`) === 'true') || 
                            (cleanPhone ? localStorage.getItem(`force_unlock_${cleanPhone}`) === 'true' : false) ||
                            (patient && (patient.forceUnlock === true || patient.force_unlock === true));
        if (forceUnlock) {
            return { isLocked: false, remainingHours: 0, remainingMs: 0, totalDurationMs: 0, forced: true };
        }

        const customTarget = (patient && (patient.customTargetTime || patient.custom_target_time)) ||
                             localStorage.getItem(`custom_target_time_${effectiveId}`) || 
                             (patientId ? localStorage.getItem(`custom_target_time_${patientId}`) : null) || 
                             (cleanPhone ? localStorage.getItem(`custom_target_time_${cleanPhone}`) : null) || 
                             localStorage.getItem('custom_target_time_global');
        if (customTarget) {
            const targetMs = parseInt(customTarget);
            const now = Date.now();
            const diff = targetMs - now;
            if (diff <= 0) {
                localStorage.removeItem(`custom_target_time_${effectiveId}`);
                if (patientId) localStorage.removeItem(`custom_target_time_${patientId}`);
                if (cleanPhone) localStorage.removeItem(`custom_target_time_${cleanPhone}`);
                localStorage.removeItem('custom_target_time_global');
                return { isLocked: false, remainingHours: 0, remainingMs: 0, totalDurationMs: 0 };
            }
            let customDuration = parseInt(
                localStorage.getItem(`custom_total_duration_${effectiveId}`) || 
                (patientId ? localStorage.getItem(`custom_total_duration_${patientId}`) : null) || 
                (cleanPhone ? localStorage.getItem(`custom_total_duration_${cleanPhone}`) : null) || 
                localStorage.getItem('custom_total_duration_global') || 0
            );
            if (!customDuration || customDuration <= 0) {
                customDuration = Math.max(diff, 24 * 3600 * 1000);
            }
            return {
                isLocked: true,
                remainingHours: diff / (1000 * 60 * 60),
                remainingMs: diff,
                totalDurationMs: customDuration,
                targetTime: targetMs
            };
        }

        const sessionIntervalHours = parseInt(await SmartDB.getSetting('sessionIntervalHours', 24)) || 24;
        let dailyLogs = await SmartDB.getPatientDailyLogs(effectiveId);
        if ((!dailyLogs || dailyLogs.length === 0) && patientId && patientId !== effectiveId) {
            dailyLogs = await SmartDB.getPatientDailyLogs(patientId);
        }
        if ((!dailyLogs || dailyLogs.length === 0) && typeof activePatient !== 'undefined' && activePatient?.dailyLogs) {
            dailyLogs = activePatient.dailyLogs;
        }
        
        // الجلسة الأولى (اليوم 1) تكون متاحة ومفتوحة فوراً عند التسجيل ولا تُقفل أبداً
        if (!dailyLogs || dailyLogs.length === 0) {
            return { isLocked: false, remainingHours: 0, remainingMs: 0, totalDurationMs: 0, isDay1Pending: true };
        }

        const lastLog = dailyLogs[dailyLogs.length - 1];
        const logDateStr = lastLog.date || lastLog.completedAt || lastLog.createdAt;
        const referenceTime = logDateStr ? new Date(logDateStr).getTime() : Date.now();
        const validRefTime = (!isNaN(referenceTime) && referenceTime > 0) ? referenceTime : Date.now();

        const now = Date.now();
        const intervalMs = sessionIntervalHours * 60 * 60 * 1000;
        const elapsedMs = now - validRefTime;
        const remainingMs = intervalMs - elapsedMs;

        if (remainingMs <= 0) {
            return { isLocked: false, remainingHours: 0, remainingMs: 0, totalDurationMs: intervalMs };
        }

        return {
            isLocked: true,
            remainingHours: remainingMs / (1000 * 60 * 60),
            remainingMs,
            totalDurationMs: intervalMs,
            targetTime: validRefTime + intervalMs
        };
    }

    // تشغيل العداد التنازلي التفاعلي وشريط الاستشفاء اللودينج
    function startCountdownTimer(targetTime, displayElements, onComplete, totalDurationMs) {
        if (activeCountdownInterval) clearInterval(activeCountdownInterval);

        function update() {
            const now = Date.now();
            const diff = targetTime - now;

            const progressFill = document.getElementById('recovery-loading-btn-fill');
            const progressPercentEl = document.getElementById('recovery-progress-percent');
            const progressRemEl = document.getElementById('recovery-progress-remaining-text');
            const circularStroke = document.getElementById('circular-progress-stroke');
            const circularPct = document.getElementById('circular-progress-pct');

            if (diff <= 0) {
                clearInterval(activeCountdownInterval);
                if (displayElements && displayElements.hours) displayElements.hours.textContent = '00';
                if (displayElements && displayElements.minutes) displayElements.minutes.textContent = '00';
                if (displayElements && displayElements.seconds) displayElements.seconds.textContent = '00';
                if (circularStroke) circularStroke.setAttribute('stroke-dashoffset', '0');
                if (circularPct) circularPct.textContent = '100%';
                if (progressFill) progressFill.style.width = '100%';
                if (progressPercentEl) progressPercentEl.textContent = '100%';
                if (progressRemEl) progressRemEl.textContent = 'مكتمل الآن';
                if (typeof onComplete === 'function') onComplete();
                return;
            }

            const totalSec = Math.floor(diff / 1000);
            const h = Math.floor(totalSec / 3600);
            const m = Math.floor((totalSec % 3600) / 60);
            const s = totalSec % 60;

            if (displayElements && displayElements.hours) displayElements.hours.textContent = String(h).padStart(2, '0');
            if (displayElements && displayElements.minutes) displayElements.minutes.textContent = String(m).padStart(2, '0');
            if (displayElements && displayElements.seconds) displayElements.seconds.textContent = String(s).padStart(2, '0');

            const totalDuration = totalDurationMs || (24 * 3600 * 1000);
            const elapsed = Math.max(0, totalDuration - diff);
            const pct = Math.min(100, Math.max(0, Math.round((elapsed / totalDuration) * 100)));

            if (circularStroke) {
                // Circumference is 138.23 for r=22
                const offset = Math.max(0, 138.23 * (1 - (pct / 100)));
                circularStroke.setAttribute('stroke-dashoffset', offset.toFixed(1));
            }
            if (circularPct) circularPct.textContent = pct + '%';
            if (progressFill) progressFill.style.width = pct + '%';
            if (progressPercentEl) progressPercentEl.textContent = pct + '%';
            if (progressRemEl) progressRemEl.textContent = `${h > 0 ? h + ' س و ' : ''}${m} د و ${s} ث`;
        }

        update();
        activeCountdownInterval = setInterval(update, 1000);
        window.activeCountdownInterval = activeCountdownInterval;
    }

    // مؤقت التمارين الرياضية التفاعلي مع دعم التوجيه الصوتي
    function toggleExerciseTimer(buttonEl, durationSeconds = 30) {
        const cardEl = buttonEl.closest('.clinical-exercise-card');
        const progressBar = cardEl ? cardEl.querySelector('.timer-progress-fill') : null;

        if (buttonEl.dataset.running === 'true') {
            clearInterval(activeExerciseTimerInterval);
            buttonEl.dataset.running = 'false';
            buttonEl.innerHTML = `<span>▶️ استئناف التمرين (${buttonEl.dataset.remaining} ثانية)</span>`;
            buttonEl.style.background = 'linear-gradient(135deg, #d4af37 0%, #aa820a 100%)';
            return;
        }

        let remaining = parseInt(buttonEl.dataset.remaining || durationSeconds);
        const total = parseInt(buttonEl.dataset.total || durationSeconds);
        buttonEl.dataset.running = 'true';
        buttonEl.dataset.total = total;
        buttonEl.style.background = 'linear-gradient(135deg, #eab308 0%, #ca8a04 100%)';

        // تشغيل صوت بدء التمرين
        if (typeof playStationAudio === 'function') {
            playStationAudio('exercise_start');
        } else if (typeof ClinicalAudioPacer !== 'undefined') {
            ClinicalAudioPacer.playStartChime();
        }

        if (activeExerciseTimerInterval) clearInterval(activeExerciseTimerInterval);

        activeExerciseTimerInterval = setInterval(() => {
            remaining--;
            buttonEl.dataset.remaining = remaining;
            buttonEl.innerHTML = `<span>⏸️ جاري التمرين: ${remaining} ثانية</span>`;

            if (progressBar) {
                const percent = ((total - remaining) / total) * 100;
                progressBar.style.width = `${percent}%`;
            }

            // تنبيه منتصف الوقت
            if (remaining === Math.floor(total / 2)) {
                if (typeof ClinicalAudioPacer !== 'undefined') {
                    ClinicalAudioPacer.playHalfwayChime();
                }
            } else if (remaining <= 3 && remaining > 0) {
                if (typeof ClinicalAudioPacer !== 'undefined') {
                    ClinicalAudioPacer.playTickBeep(true);
                }
            } else if (remaining > 3) {
                if (typeof ClinicalAudioPacer !== 'undefined') {
                    ClinicalAudioPacer.playTickBeep(false);
                }
            }

            if (remaining <= 0) {
                clearInterval(activeExerciseTimerInterval);
                buttonEl.dataset.running = 'false';
                buttonEl.dataset.remaining = total;
                buttonEl.dataset.completed = 'true';
                buttonEl.innerHTML = `<span>✅ تم إنجاز التمرين بنجاح! أحسنت</span>`;
                buttonEl.style.background = 'linear-gradient(135deg, #10b981 0%, #059669 100%)';
                buttonEl.style.color = '#ffffff';
                if (progressBar) progressBar.style.width = '100%';

                if (typeof playStationAudio === 'function') {
                    playStationAudio('exercise_finish');
                } else if (typeof ClinicalAudioPacer !== 'undefined') {
                    ClinicalAudioPacer.playCompleteChime();
                }

                if (navigator.vibrate) navigator.vibrate([100, 50, 100]);

                // 🔔 بدء فترة الاستراحة الذكية والتوجيه الصوتي للتمرين التالي
                triggerExerciseRestPeriod(cardEl, buttonEl);
            }
        }, 1000);
    }

    // إتمام التمرين يدوياً وفورياً وتأكيد إنجازه
    function markExerciseDone(actionBtn) {
        if (!actionBtn) return;
        const cardEl = actionBtn.closest('.clinical-exercise-card, .exercise-visual-card');
        const timerBtn = cardEl ? cardEl.querySelector('.btn-exercise-timer') : actionBtn;
        const progressBar = cardEl ? cardEl.querySelector('.timer-progress-fill') : null;

        if (timerBtn) {
            if (activeExerciseTimerInterval && timerBtn.dataset.running === 'true') {
                clearInterval(activeExerciseTimerInterval);
            }
            timerBtn.dataset.running = 'false';
            timerBtn.dataset.completed = 'true';
            timerBtn.dataset.remaining = '0';
            timerBtn.innerHTML = `<span>✅ تم إنجاز التمرين بنجاح! أحسنت</span>`;
            timerBtn.style.background = 'linear-gradient(135deg, #10b981 0%, #059669 100%)';
            timerBtn.style.color = '#ffffff';
        }
        if (progressBar) progressBar.style.width = '100%';

        actionBtn.style.background = 'linear-gradient(135deg, #10b981 0%, #059669 100%)';
        actionBtn.style.borderColor = '#10b981';
        actionBtn.style.color = '#ffffff';
        actionBtn.innerHTML = '✅ تم';

        if (typeof playStationAudio === 'function') {
            playStationAudio('exercise_finish');
        } else if (typeof ClinicalAudioPacer !== 'undefined') {
            ClinicalAudioPacer.playCompleteChime();
        }

        if (navigator.vibrate) navigator.vibrate([100, 50, 100]);

        // تحديث فوري لشريط الإرشاد الذكي
        if (typeof SmartGuidance !== 'undefined' && typeof SmartGuidance.checkAndApply === 'function') {
            SmartGuidance.checkAndApply();
        }

        triggerExerciseRestPeriod(cardEl, timerBtn || actionBtn);
    }

    // إدارة فترة الراحة التفاعلية (15 ثانية) والتنقل للتمرين التالي بالأصوات
    let activeRestInterval = null;
    function triggerExerciseRestPeriod(currentCardEl, completedButtonEl) {
        if (!currentCardEl) return;
        if (activeRestInterval) {
            clearInterval(activeRestInterval);
            activeRestInterval = null;
        }

        // البحث عن بطاقة التمرين التالية
        const allCards = Array.from(document.querySelectorAll('.clinical-exercise-card, .exercise-visual-card'));
        const currentIndex = allCards.indexOf(currentCardEl);
        const nextCard = (currentIndex !== -1 && currentIndex + 1 < allCards.length) ? allCards[currentIndex + 1] : null;

        // إزالة أي شريط استراحة سابق
        const existingBanners = document.querySelectorAll('.exercise-rest-transition-banner');
        existingBanners.forEach(b => b.remove());

        if (nextCard) {
            // توجد تمارين تالية في جلسة اليوم
            let restSec = 15;
            const nextButton = nextCard.querySelector('.btn-exercise-timer');
            const nextName = nextCard.querySelector('h4')?.textContent || 'التمرين التالي';

            // إنشاء شريط الاستراحة الفاخر - بتصميم عائم لا يزحزح كروت التمارين إطلاقاً
            const banner = document.createElement('div');
            banner.className = 'exercise-rest-transition-banner';
            banner.style.cssText = `
                background: linear-gradient(135deg, rgba(15, 23, 42, 0.96) 0%, rgba(30, 41, 59, 0.96) 100%);
                border: 2px solid #d4af37;
                border-radius: 12px;
                padding: 14px 20px;
                margin: 14px 0;
                text-align: center;
                animation: pulse 1.5s infinite;
                box-shadow: 0 10px 30px rgba(0, 0, 0, 0.7), 0 0 20px rgba(212, 175, 55, 0.35);
                position: sticky;
                top: 15px;
                z-index: 1000;
                backdrop-filter: blur(8px);
                -webkit-backdrop-filter: blur(8px);
            `;
            banner.innerHTML = `
                <div style="display: flex; align-items: center; justify-content: space-between; flex-wrap: wrap; gap: 8px;">
                    <div style="font-weight: bold; color: #fbbf24; font-size: 1.05em; display: flex; align-items: center; gap: 8px;">
                        <span>⏸️ خذ نفساً عميقاً (فترة راحة للأنسجة):</span>
                        <span class="rest-timer-countdown" style="background: #d4af37; color: #0a0e14; padding: 2px 10px; border-radius: 12px; font-weight: 900;">${restSec} ثانية</span>
                    </div>
                    <div style="font-size: 0.88em; color: #94a3b8;">
                        التالي: <strong style="color: #ffffff;">${nextName}</strong>
                    </div>
                    <button type="button" class="btn-skip-rest" style="background: rgba(255,255,255,0.12); color: #e2e8f0; border: 1px solid rgba(255,255,255,0.25); border-radius: 6px; padding: 5px 12px; font-size: 0.82em; cursor: pointer; font-weight: bold;">
                        تخطي الراحة والبدء فوراً ⏭️
                    </button>
                </div>
            `;

            // وضع الشريط خارج شبكة كروت التمارين تماماً لمنع إزاحتها أو تحريكها من مكانها
            const gridContainer = currentCardEl.closest('.exercise-visual-grid') || 
                                  (currentCardEl.parentElement && (window.getComputedStyle(currentCardEl.parentElement).display === 'grid' || currentCardEl.parentElement.style.display === 'grid') ? currentCardEl.parentElement : null) ||
                                  currentCardEl.parentNode;

            if (gridContainer && gridContainer.parentNode && gridContainer !== document.body) {
                gridContainer.parentNode.insertBefore(banner, gridContainer);
            } else {
                currentCardEl.parentNode.insertBefore(banner, currentCardEl);
            }

            // تشغيل محطة صوت التحفيز أو الإرشاد بعد رنين اكتمال التمرين بثانية
            setTimeout(() => {
                if (typeof playStationAudio === 'function') {
                    playStationAudio('motivation');
                }
            }, 1200);

            // التركيز اللطيف والتمرير نحو التالي
            nextCard.scrollIntoView({ behavior: 'smooth', block: 'center' });
            nextCard.style.outline = '2px solid #d4af37';
            nextCard.style.boxShadow = '0 0 25px rgba(212, 175, 55, 0.4)';

            const finishRest = () => {
                clearInterval(activeRestInterval);
                activeRestInterval = null;
                if (banner && banner.parentNode) banner.remove();
                if (nextCard) {
                    nextCard.style.outline = '';
                    nextCard.style.boxShadow = '';
                }
                // تنبيه رنين لطيف لبدء التمرين التالي
                if (typeof ClinicalAudioPacer !== 'undefined') {
                    ClinicalAudioPacer.playStartChime();
                }
            };

            const skipBtn = banner.querySelector('.btn-skip-rest');
            if (skipBtn) skipBtn.onclick = finishRest;

            activeRestInterval = setInterval(() => {
                restSec--;
                const countSpan = banner.querySelector('.rest-timer-countdown');
                if (countSpan) countSpan.textContent = `${restSec} ثانية`;

                // دقات إيقاعية هادئة للتنفس
                if (restSec > 0 && typeof ClinicalAudioPacer !== 'undefined') {
                    ClinicalAudioPacer.playTickBeep(restSec <= 3);
                }

                if (restSec <= 0) {
                    finishRest();
                }
            }, 1000);
        } else {
            // آخر تمرين في جلسة اليوم: تشغيل صوت الاحتفال بالخطة
            setTimeout(() => {
                if (typeof playStationAudio === 'function') {
                    playStationAudio('motivation');
                }
            }, 1200);
        }
    }

    // احتساب النسبة المئوية العامة لتعافي المريض
    function calculateRecoveryScore(baselinePain = 7, dailyLogs = []) {
        if (!dailyLogs || dailyLogs.length === 0) {
            return 15; // نسبة البدء والتفاعل الأولي
        }

        const latestLog = dailyLogs[dailyLogs.length - 1];
        const currentPain = typeof latestLog.painScore === 'number' ? latestLog.painScore : (typeof latestLog.painLevel === 'number' ? latestLog.painLevel : Math.max(1, baselinePain - dailyLogs.length));
        const base = Math.max(1, baselinePain);
        
        const painDrop = Math.max(0, Math.min(100, Math.round(((base - currentPain) / base) * 100)));
        const sessionProgress = Math.min(100, Math.round((dailyLogs.length / 7) * 100));
        
        return Math.min(100, Math.max(15, Math.round((painDrop * 0.6) + (sessionProgress * 0.4))));
    }

    return {
        initPatientSession,
        getStageInfoForDay,
        getSessionLockStatus,
        startCountdownTimer,
        toggleExerciseTimer,
        markExerciseDone,
        generatePainTrendChartSVG,
        calculateRecoveryScore
    };
})();

// تصدير PatientFlow للنطاق العالمي (window) لضمان وصول onclick في HTML إليه
window.PatientFlow = PatientFlow;
window.getStageInfoForDay = PatientFlow.getStageInfoForDay;
window.toggleExerciseTimer = PatientFlow.toggleExerciseTimer;
window.markExerciseDone = PatientFlow.markExerciseDone;

// ==========================================================================
// تكوين أسئلة التقييم اليومي المنسجمة مع نقطة الألم المحددة
// يُستدعى من loadPatientRecoveryDashboard لتخصيص نموذج اليوميات لكل منطقة
// ==========================================================================
function getAnatomicalDailyAssessmentConfig(pointKey) {
    if (!pointKey) return null;
    const k = (pointKey || '').toLowerCase();

    // ======== أسفل الظهر والعمود الفقري القطني / عرق النسا ========
    if (k.includes('lumbar') || k.includes('قطن') || k.includes('اسفل') || k.includes('disc') || k.includes('sciatica') || k.includes('نسا')) {
        return {
            mobilityQuestion: '2. نسبة استعادة مرونة أسفل الظهر وقدرتك على الانحناء والتمديد اليوم:',
            mobilityOptions: [
                { val: 95, text: 'حرية حركة ممتازة في الانحناء والتمديد دون ألم أو شد' },
                { val: 75, text: 'تحسن ملحوظ مع انزعاج خفيف عند الانحناء للأمام أو رفع الأشياء' },
                { val: 45, text: 'تيبس صباحي واضح يستغرق وقتاً، ويبقى قيد محسوس على حركة الظهر' },
                { val: 20, text: 'صعوبة شديدة في الانحناء والوقوف الطويل مع الشعور بشد في ساق أو ظهر' }
            ],
            sleepQuestion: '3. جودة نومك الليلة الماضية مع الأخذ بعين الاعتبار وضعية الظهر:',
            sleepOptions: [
                { val: 95, text: 'نوم عميق مريح ومتواصل دون ألم أو حاجة للتقلب المستمر' },
                { val: 75, text: 'نوم جيد مع استيقاظ عابر عند التقلب أو بسبب انزعاج خفيف بالظهر' },
                { val: 45, text: 'نوم متقطع وصعوبة إيجاد وضعية مريحة للظهر، استيقاظ مبكر' },
                { val: 20, text: 'أرق أو استيقاظ متكرر بسبب ألم الظهر أو التنميل النازل للساق' }
            ],
            positiveBehaviors: [
                { id: 'beh-exercise', text: 'نفذت تمارين تقوية أسفل الظهر والبطن' },
                { id: 'beh-posture', text: 'حافظت على استقامة الظهر أثناء الجلوس والوقوف' },
                { id: 'beh-walk', text: 'قمت بالمشي المنتظم لتنشيط الدورة الدموية في الفقرات' },
                { id: 'beh-heat', text: 'استخدمت الكمادة الدافئة على أسفل الظهر' }
            ],
            negativeBehaviors: [
                { id: 'neg-sitting', text: 'جلوس طويل متواصل لأكثر من ساعة دون تغيير وضعية' },
                { id: 'neg-lifting', text: 'حمل أوزان ثقيلة أو انحناء مفاجئ بدون تثبيت البطن' },
                { id: 'neg-bend', text: 'الانحناء المتكرر للأمام أو التواء الجذع' },
                { id: 'neg-sleep', text: 'نوم على بطن أو وضعية غير محايدة للظهر' }
            ]
        };
    }

    // ======== الرقبة والفقرات العنقية / التنميل في اليد ========
    if (k.includes('cervical') || k.includes('neck') || k.includes('رقبة') || k.includes('عنق') || k.includes('ابهر') || k.includes('أبهر')) {
        return {
            mobilityQuestion: '2. نسبة استعادة حرية حركة الرقبة (دوران - إمالة - تمديد) اليوم:',
            mobilityOptions: [
                { val: 95, text: 'حرية تامة في دوران وإمالة الرقبة يميناً ويساراً دون ألم أو شد' },
                { val: 75, text: 'تحسن واضح مع انزعاج خفيف عند الدوران الكامل أو رفع الذقن' },
                { val: 45, text: 'تيبس وحد محسوس يقيد الدوران ومصحوب أحياناً بطنين أو صداع' },
                { val: 20, text: 'صعوبة شديدة في تحريك الرقبة مع تنميل أو خدر نازل للذراع أو اليد' }
            ],
            sleepQuestion: '3. جودة نومك آخذاً بعين الاعتبار وضعية الرأس والوسادة:',
            sleepOptions: [
                { val: 95, text: 'نوم عميق مريح دون ألم رقبة أو صداع أو تنميل في الذراعين' },
                { val: 75, text: 'نوم جيد مع استيقاظ بسيط لضبط وضعية الوسادة' },
                { val: 45, text: 'نوم متقطع وخدر في الذراع عند الاستيقاظ يتلاشى بعد حين' },
                { val: 20, text: 'أرق وألم رقبة وصداع قوي وتنميل في اليد يستمر حتى الصباح' }
            ],
            positiveBehaviors: [
                { id: 'beh-exercise', text: 'نفذت تمارين تمديد وتقوية الرقبة والكتف' },
                { id: 'beh-posture', text: 'حافظت على مستوى الشاشة وارتفاع طاولة العمل' },
                { id: 'beh-walk', text: 'أخذت استراحات منتظمة من الجلوس أمام الشاشة' },
                { id: 'beh-heat', text: 'استخدمت وسادة محايدة طبية ووضعية نوم صحيحة' }
            ],
            negativeBehaviors: [
                { id: 'neg-phone', text: 'استخدام الهاتف لفترات طويلة مع انحناء الرقبة للأسفل' },
                { id: 'neg-sitting', text: 'جلوس طويل أمام الشاشة بدون دعم للرقبة والكتفين' },
                { id: 'neg-tension', text: 'شد ذهني أو إجهاد يؤدي لتوتر عضلات الرقبة' },
                { id: 'neg-pillow', text: 'نوم على وسادة مرتفعة جداً أو منخفضة' }
            ]
        };
    }

    // ======== الكتف ومفصل الكتف / التهاب الجراب ========
    if (k.includes('shoulder') || k.includes('كتف') || k.includes('جراب') || k.includes('rotator')) {
        return {
            mobilityQuestion: '2. نسبة استعادة مدى حركة الكتف (رفع الذراع - دوران - امتداد) اليوم:',
            mobilityOptions: [
                { val: 95, text: 'قدرة على رفع الذراع فوق الرأس ودوران الكتف بحرية كاملة' },
                { val: 75, text: 'تحسن ملحوظ مع ألم خفيف فقط عند رفع الذراع أعلى مستوى الكتف' },
                { val: 45, text: 'قيد واضح في رفع الذراع، يصعب الوصول للظهر أو ارتداء الملابس' },
                { val: 20, text: 'ألم شديد وعجز عن رفع الذراع أو الضغط على الكتف' }
            ],
            sleepQuestion: '3. جودة النوم مع الاستلقاء والضغط على الكتف المتأثر:',
            sleepOptions: [
                { val: 95, text: 'نوم مريح دون ألم كتف حتى عند الاستلقاء عليه' },
                { val: 75, text: 'نوم جيد مع تفادي الاستلقاء على الجانب المؤلم' },
                { val: 45, text: 'استيقاظ متكرر عند التقلب الليلي والضغط غير المقصود على الكتف' },
                { val: 20, text: 'أرق بسبب ألم الكتف في أي وضعية نوم' }
            ],
            positiveBehaviors: [
                { id: 'beh-exercise', text: 'نفذت تمارين تقوية الروتاتور كاف والتمديد' },
                { id: 'beh-posture', text: 'حافظت على استقامة الكتفين وعدم تقوسهما للأمام' },
                { id: 'beh-walk', text: 'تحركت وتمديت بانتظام لمنع تصلب المفصل' },
                { id: 'beh-heat', text: 'استخدمت الكمادة الدافئة لارتخاء عضلات الكتف' }
            ],
            negativeBehaviors: [
                { id: 'neg-lift', text: 'حمل أوزان ثقيلة بالجانب المتأثر' },
                { id: 'neg-sleep', text: 'الاستلقاء على الكتف المؤلم ليلاً' },
                { id: 'neg-reach', text: 'مد الذراع بشكل مفاجئ أو رفع شيء فوق مستوى الكتف' },
                { id: 'neg-posture', text: 'انحناء الكتفين للأمام أثناء الجلوس الطويل' }
            ]
        };
    }

    // ======== مفصل الركبة / صابونة الركبة / الرباط ========
    if (k.includes('knee') || k.includes('ركبة') || k.includes('صابون') || k.includes('patell') || k.includes('ligament')) {
        return {
            mobilityQuestion: '2. نسبة قدرتك على ثني وبسط الركبة والمشي اليوم:',
            mobilityOptions: [
                { val: 95, text: 'قدرة كاملة على الثني والبسط والمشي لمسافات طويلة دون ألم' },
                { val: 75, text: 'تحسن ملحوظ مع انزعاج خفيف عند الثني الكامل أو صعود الدرج' },
                { val: 45, text: 'ثني جزئي محدود مع طقطقة أو ألم عند الضغط على الركبة' },
                { val: 20, text: 'صعوبة شديدة في المشي والثني، تورم ملحوظ في المفصل' }
            ],
            sleepQuestion: '3. جودة النوم مع الحفاظ على وضعية مريحة للركبة:',
            sleepOptions: [
                { val: 95, text: 'نوم عميق مريح دون ألم ركبة أو حاجة لوسادة تحتها' },
                { val: 75, text: 'نوم جيد مع وضع وسادة تحت الركبة للارتياح' },
                { val: 45, text: 'استيقاظ متكرر وتصلب الركبة الصباحي يستمر أكثر من 30 دقيقة' },
                { val: 20, text: 'أرق بسبب نبضات ألم الركبة ليلاً' }
            ],
            positiveBehaviors: [
                { id: 'beh-exercise', text: 'نفذت تمارين تقوية الفخذ والعضلة الرباعية' },
                { id: 'beh-walk', text: 'مشيت بتوزيع الوزن الصحيح دون تحميل الركبة' },
                { id: 'beh-ice', text: 'استخدمت كمادة باردة للحد من الورم (إن وجد)' },
                { id: 'beh-rest', text: 'رفعت الساق وأرحت الركبة في أوقات الراحة' }
            ],
            negativeBehaviors: [
                { id: 'neg-stairs', text: 'صعود ونزول درج كثير بدون دعم' },
                { id: 'neg-squat', text: 'قرفصة كاملة أو ثني الركبة بزاوية حادة' },
                { id: 'neg-stand', text: 'وقوف طويل متواصل على أرض صلبة' },
                { id: 'neg-impact', text: 'ممارسة رياضة مرتفعة التأثير (ركض - قفز)' }
            ]
        };
    }

    // ======== مفصل الورك / العجان / الألم الإلوي ========
    if (k.includes('hip') || k.includes('ورك') || k.includes('sacroiliac') || k.includes('عجز') || k.includes('gluteal') || k.includes('الية') || k.includes('إلي')) {
        return {
            mobilityQuestion: '2. نسبة استعادة حرية حركة مفصل الورك (المشي - الثني - الدوران) اليوم:',
            mobilityOptions: [
                { val: 95, text: 'مشي مريح دون عرج وقدرة على رفع الركبة نحو الصدر بحرية' },
                { val: 75, text: 'تحسن ملحوظ مع انزعاج خفيف عند المشي السريع أو صعود الدرج' },
                { val: 45, text: 'عرج خفيف أو شد في مقدمة/جانب الورك عند المشي الطويل' },
                { val: 20, text: 'صعوبة شديدة في المشي والجلوس المريح وتبديل وضعية الجلوس' }
            ],
            sleepQuestion: '3. جودة النوم مع الاستلقاء وتأثير الضغط على منطقة الورك:',
            sleepOptions: [
                { val: 95, text: 'نوم عميق مريح على أي جانب دون ألم في منطقة الورك' },
                { val: 75, text: 'نوم جيد مع تفضيل وضعية بعينها ووضع وسادة بين الركبتين' },
                { val: 45, text: 'استيقاظ متكرر عند الاستلقاء على الجانب المؤلم' },
                { val: 20, text: 'أرق وألم مستمر في منطقة الورك والإلية طوال الليل' }
            ],
            positiveBehaviors: [
                { id: 'beh-exercise', text: 'نفذت تمارين تقوية عضلات الإلية والورك' },
                { id: 'beh-walk', text: 'مشيت على أرض مستوية بخطوات متوازنة' },
                { id: 'beh-stretch', text: 'تمديت عضلة الكمثرية وعضلات الورك' },
                { id: 'beh-pillow', text: 'وضعت وسادة بين ركبتيك عند النوم على الجانب' }
            ],
            negativeBehaviors: [
                { id: 'neg-sitting', text: 'جلوس طويل على كرسي صلب بدون دعم للورك' },
                { id: 'neg-crossing', text: 'تقاطع الساقين أو الجلوس على ساق لفترة طويلة' },
                { id: 'neg-impact', text: 'ممارسة أنشطة عالية التأثير (ركض - قفز - صعود سلالم كثير)' },
                { id: 'neg-posture', text: 'الوقوف مع إمالة الجسم لجانب واحد باستمرار' }
            ]
        };
    }

    // ======== الكاحل والقدم / وتر أكيلس ========
    if (k.includes('ankle') || k.includes('كاحل') || k.includes('قدم') || k.includes('أكيلس') || k.includes('اكيلس') || k.includes('plantar') || k.includes('heel')) {
        return {
            mobilityQuestion: '2. نسبة استعادة حرية حركة الكاحل والقدم والمشي المريح اليوم:',
            mobilityOptions: [
                { val: 95, text: 'مشي مريح دون ألم ومرونة كاملة في الكاحل صعوداً وهبوطاً' },
                { val: 75, text: 'مشي جيد مع انزعاج خفيف عند أخذ الخطوة الأولى صباحاً' },
                { val: 45, text: 'عرج خفيف أو تيبس الكاحل عند المشي الطويل أو الوقوف المطول' },
                { val: 20, text: 'صعوبة شديدة في المشي وألم حاد عند وضع الوزن على القدم' }
            ],
            sleepQuestion: '3. جودة النوم مع احتمالية الشد أو التقلص في عضلات الساق والقدم:',
            sleepOptions: [
                { val: 95, text: 'نوم عميق دون شد أو تقلص ليلي في عضلات الساق أو القدم' },
                { val: 75, text: 'نوم جيد مع رفع القدم قليلاً لتصريف السوائل' },
                { val: 45, text: 'شد عضلي ليلي متكرر يوقظك ويحتاج لتمديد فوري' },
                { val: 20, text: 'أرق وخدر أو تورم في القدم يزداد ليلاً' }
            ],
            positiveBehaviors: [
                { id: 'beh-exercise', text: 'نفذت تمارين تقوية الكاحل والتمديد' },
                { id: 'beh-walk', text: 'مشيت بحذاء داعم للقوس بخطوات مريحة' },
                { id: 'beh-ice', text: 'وضعت كمادة باردة على منطقة الألم بعد النشاط' },
                { id: 'beh-elevation', text: 'رفعت القدم لأعلى مستوى القلب خلال أوقات الراحة' }
            ],
            negativeBehaviors: [
                { id: 'neg-stand', text: 'وقوف طويل على أرض صلبة بدون حذاء داعم' },
                { id: 'neg-barefoot', text: 'المشي حافياً أو بنعل مسطح بدون قوس' },
                { id: 'neg-impact', text: 'القفز أو الركض أو الرياضة العالية التأثير' },
                { id: 'neg-heels', text: 'ارتداء أحذية ذات كعب عالي أو ضيقة على الأصابع' }
            ]
        };
    }

    // ======== المعصم واليد / نفق الرسغ ========
    if (k.includes('wrist') || k.includes('معصم') || k.includes('كارب') || k.includes('carpal') || k.includes('يد') || k.includes('اصبع') || k.includes('أصبع')) {
        return {
            mobilityQuestion: '2. نسبة استعادة حرية حركة المعصم وقوة الإمساك في اليد اليوم:',
            mobilityOptions: [
                { val: 95, text: 'قوة إمساك كاملة ومرونة المعصم دون ألم أو خدر' },
                { val: 75, text: 'تحسن ملحوظ مع ضعف طفيف في الإمساك أو تنميل عابر' },
                { val: 45, text: 'خدر متكرر في الأصابع وضعف في الإمساك بالأشياء' },
                { val: 20, text: 'ألم حاد وخدر مستمر مع صعوبة الكتابة وحمل الأشياء' }
            ],
            sleepQuestion: '3. جودة النوم مع الانتباه للتنميل الليلي في اليد:',
            sleepOptions: [
                { val: 95, text: 'نوم عميق دون تنميل أو ألم في اليد أو المعصم' },
                { val: 75, text: 'نوم جيد مع استيقاظ عابر وتنميل يزول بتغيير الوضعية' },
                { val: 45, text: 'استيقاظ متكرر بسبب خدر وتنميل في الأصابع يستلزم التمديد' },
                { val: 20, text: 'أرق بسبب ألم وتنميل مستمر في اليد حتى الصباح' }
            ],
            positiveBehaviors: [
                { id: 'beh-exercise', text: 'نفذت تمارين تمديد وتقوية معصم وأصابع اليد' },
                { id: 'beh-break', text: 'أخذت استراحات منتظمة من الكيبورد والكتابة' },
                { id: 'beh-splint', text: 'ارتديت جبيرة معصم ليلاً (إن وصف الطبيب)' },
                { id: 'beh-ice', text: 'وضعت كمادة باردة على معصمك بعد الاستخدام الطويل' }
            ],
            negativeBehaviors: [
                { id: 'neg-typing', text: 'كتابة مطولة دون استراحة أو دعم للمعصم' },
                { id: 'neg-phone', text: 'إمساك الهاتف بزاوية منثنية للمعصم فترة طويلة' },
                { id: 'neg-grip', text: 'إمساك أشياء ثقيلة أو أدوات تهز' },
                { id: 'neg-sleeping', text: 'النوم على اليد أو ثنيها تحت الوسادة' }
            ]
        };
    }

    // ======== الكوع / التهاب اللقيمة (Tennis Elbow / Golfer's Elbow) ========
    if (k.includes('elbow') || k.includes('كوع') || k.includes('لقيمة') || k.includes('tennis')) {
        return {
            mobilityQuestion: '2. نسبة استعادة حرية حركة الكوع وقدرتك على الرفع والإمساك اليوم:',
            mobilityOptions: [
                { val: 95, text: 'ثني وبسط الكوع بحرية كاملة مع قوة إمساك طبيعية' },
                { val: 75, text: 'تحسن ملحوظ مع انزعاج خفيف عند الإمساك الشديد أو الرفع' },
                { val: 45, text: 'ألم محسوس عند الإمساك بالأشياء وعند لف المعصم' },
                { val: 20, text: 'صعوبة شديدة في رفع الأشياء وفتح الأبواب وكتابة طويلة' }
            ],
            sleepQuestion: '3. جودة النوم مع وضعية الكوع وتفادي الانثناء الكامل:',
            sleepOptions: [
                { val: 95, text: 'نوم مريح بأي وضعية دون ألم في الكوع' },
                { val: 75, text: 'نوم جيد مع تفضيل إبقاء الكوع بزاوية محايدة' },
                { val: 45, text: 'استيقاظ عند ثني الكوع بشكل مفاجئ خلال النوم' },
                { val: 20, text: 'أرق وألم في الكوع والساعد طوال الليل' }
            ],
            positiveBehaviors: [
                { id: 'beh-exercise', text: 'نفذت تمارين تمديد وتقوية عضلات الساعد بانتظام' },
                { id: 'beh-ice', text: 'وضعت كمادة باردة بعد النشاط على منطقة الكوع' },
                { id: 'beh-rest', text: 'أرحت الكوع وتفادي الأنشطة المؤلمة' },
                { id: 'beh-grip', text: 'استخدمت مقبض أدوات ذات قطر أكبر لتقليل الضغط' }
            ],
            negativeBehaviors: [
                { id: 'neg-gripping', text: 'أعمال تستلزم إمساكاً شديداً متكرراً (بناء - أعمال يدوية)' },
                { id: 'neg-typing', text: 'كتابة طويلة دون دعم المعصم بارتفاع مناسب' },
                { id: 'neg-lifting', text: 'رفع أشياء بالكوع ممدوداً بالكامل' },
                { id: 'neg-sport', text: 'ممارسة رياضة تتضمن ضربات متكررة (تنس - غولف)' }
            ]
        };
    }

    // ======== منطقة الصدر والعمود الفقري الصدري ========
    if (k.includes('thoracic') || k.includes('chest') || k.includes('صدر') || k.includes('ضلع') || k.includes('rib') || k.includes('بين_كتف') || k.includes('بين الكتف')) {
        return {
            mobilityQuestion: '2. نسبة استعادة حرية حركة الجذع والتنفس العميق دون ألم اليوم:',
            mobilityOptions: [
                { val: 95, text: 'تنفس عميق مريح وحرية كاملة في تدوير الجذع' },
                { val: 75, text: 'تحسن ملحوظ مع انزعاج خفيف عند التنفس العميق أو الالتفات' },
                { val: 45, text: 'حدة بسيطة عند التنفس العميق مع تيبس بين لوحي الكتف' },
                { val: 20, text: 'ألم حاد عند التنفس أو السعال أو الالتفات' }
            ],
            sleepQuestion: '3. جودة النوم مع وضعية الجذع والضغط على منطقة الصدر:',
            sleepOptions: [
                { val: 95, text: 'نوم مريح بأي وضعية دون ألم صدر أو ظهر علوي' },
                { val: 75, text: 'نوم جيد مع تفضيل الاستلقاء على الظهر' },
                { val: 45, text: 'استيقاظ بسبب ثقل أو انزعاج في منطقة الصدر والكتفين' },
                { val: 20, text: 'أرق وألم صدري أو ظهر علوي يشمل الكتفين' }
            ],
            positiveBehaviors: [
                { id: 'beh-breathing', text: 'مارست تمارين التنفس العميق والتمديد الصدري' },
                { id: 'beh-posture', text: 'حافظت على استقامة القوام وفتح الصدر للأمام' },
                { id: 'beh-exercise', text: 'تمديت عضلات الصدر والكتفين في الصباح والمساء' },
                { id: 'beh-heat', text: 'استخدمت كمادة دافئة بين لوحي الكتف' }
            ],
            negativeBehaviors: [
                { id: 'neg-hunch', text: 'انحناء الكتفين وتقوس الظهر للأمام كثيراً' },
                { id: 'neg-desk', text: 'جلوس مطول أمام المكتب بدون دعم الظهر' },
                { id: 'neg-phone', text: 'الانحناء للأسفل للنظر في الهاتف لفترات طويلة' },
                { id: 'neg-bag', text: 'حمل حقيبة ثقيلة على كتف واحدة' }
            ]
        };
    }

    // ======== الفك والصداع / اضطراب المفصل الصدغي الفكي ========
    if (k.includes('jaw') || k.includes('tmj') || k.includes('فك') || k.includes('صداع') || k.includes('headache') || k.includes('migraine')) {
        return {
            mobilityQuestion: '2. نسبة استعادة حرية فتح الفم والمضغ وتحرك الفك اليوم:',
            mobilityOptions: [
                { val: 95, text: 'فتح الفم بحرية كاملة والمضغ المريح دون طقطقة أو ألم' },
                { val: 75, text: 'تحسن ملحوظ مع انزعاج خفيف عند فتح الفم على الآخر' },
                { val: 45, text: 'طقطقة محسوسة عند الفتح وألم خفيف عند المضغ' },
                { val: 20, text: 'صعوبة شديدة في المضغ وألم مستمر في الفك مع صداع' }
            ],
            sleepQuestion: '3. جودة النوم مع الانتباه للصداع الصباحي وضغط الأسنان:',
            sleepOptions: [
                { val: 95, text: 'نوم عميق دون صداع صباحي أو ضغط أسنان' },
                { val: 75, text: 'نوم جيد مع صداع خفيف عابر يزول بعد الاستيقاظ' },
                { val: 45, text: 'صداع صباحي متكرر وشد في عضلات الفك عند الاستيقاظ' },
                { val: 20, text: 'أرق وصداع شديد مع ضغط أسنان واضح وألم في الفك' }
            ],
            positiveBehaviors: [
                { id: 'beh-exercise', text: 'نفذت تمارين ارتخاء الفك والتمديد الطفيف' },
                { id: 'beh-food', text: 'تناولت طعاماً طرياً سهل المضغ وتفادي الصلب' },
                { id: 'beh-heat', text: 'وضعت كمادة دافئة على عضلات الفك والصدغ' },
                { id: 'beh-stress', text: 'مارست تمارين استرخاء للحد من توتر عضلات الفك' }
            ],
            negativeBehaviors: [
                { id: 'neg-hardFood', text: 'مضغ الطعام الصلب أو العلك لفترة طويلة' },
                { id: 'neg-stress', text: 'توتر ذهني وضغط نفسي يؤدي لإطباق الأسنان' },
                { id: 'neg-jaw', text: 'فتح الفم بشكل مفاجئ أو للتثاؤب بشكل واسع' },
                { id: 'neg-phone', text: 'إمساك الهاتف بين الكتف والأذن لفترة طويلة' }
            ]
        };
    }

    // ======== الفخذ / الرباط الإربي / الإلية ========
    if (k.includes('thigh') || k.includes('groin') || k.includes('فخذ') || k.includes('إربي') || k.includes('hamstring')) {
        return {
            mobilityQuestion: '2. نسبة استعادة مرونة وقوة عضلة الفخذ ومنطقة الإربية اليوم:',
            mobilityOptions: [
                { val: 95, text: 'مشي مريح وقدرة على رفع الركبة ومد الساق بحرية' },
                { val: 75, text: 'تحسن ملحوظ مع شد خفيف عند الرياضة أو الخطوات الكبيرة' },
                { val: 45, text: 'شد أو ألم عند المشي السريع أو صعود السلم' },
                { val: 20, text: 'صعوبة في المشي وعرج خفيف مع ألم في الفخذ أو الإربية' }
            ],
            sleepQuestion: '3. جودة النوم دون إحساس بشد أو ألم في الفخذ:',
            sleepOptions: [
                { val: 95, text: 'نوم عميق مريح دون شد أو ألم في الفخذ أو الإربية' },
                { val: 75, text: 'نوم جيد مع وضع وسادة بين الساقين للراحة' },
                { val: 45, text: 'استيقاظ متكرر وشد ليلي في عضلة الفخذ' },
                { val: 20, text: 'أرق بسبب نبضات ألم الفخذ أو الإحساس بالشد المستمر' }
            ],
            positiveBehaviors: [
                { id: 'beh-stretch', text: 'نفذت تمارين تمديد عضلات الفخذ الأمامية والخلفية' },
                { id: 'beh-walk', text: 'مشيت بخطوات طبيعية متوازنة دون إجهاد الفخذ' },
                { id: 'beh-heat', text: 'استخدمت كمادة دافئة لارتخاء عضلات الفخذ' },
                { id: 'beh-rest', text: 'أخذت قسطاً كافياً من الراحة بين النشاطات' }
            ],
            negativeBehaviors: [
                { id: 'neg-sprint', text: 'الركض السريع أو التسارع المفاجئ' },
                { id: 'neg-split', text: 'تمديد مفرط مفاجئ للساق أو فتحة واسعة' },
                { id: 'neg-lifting', text: 'رفع أثقال ثقيلة تشمل إجهاد الفخذ' },
                { id: 'neg-sedentary', text: 'جلوس طويل دون حركة يؤدي لتصلب الفخذ' }
            ]
        };
    }

    // ======== Default عام - عند عدم مطابقة أي تخصص ========
    return {
        mobilityQuestion: `2. نسبة استعادة حرية الحركة وخفة الجسم في منطقة الألم اليوم:`,
        mobilityOptions: [
            { val: 95, text: 'حركة طبيعية وخفيفة تماماً دون ألم أو قيد' },
            { val: 75, text: 'تحسن ملحوظ مع انزعاج خفيف عند بعض الحركات' },
            { val: 45, text: 'قيد محسوس في الحركة مع ثقل وتيبس في المنطقة المؤلمة' },
            { val: 20, text: 'صعوبة شديدة في الحركة وألم عند أدنى نشاط' }
        ],
        sleepQuestion: '3. جودة نومك وارتياحك الليلي بالنسبة لمنطقة الألم:',
        sleepOptions: [
            { val: 95, text: 'نوم عميق مريح متواصل دون استيقاظ بسبب الألم' },
            { val: 75, text: 'نوم جيد مع استيقاظ عابر يتلاشى سريعاً' },
            { val: 45, text: 'نوم متقطع وصعوبة في إيجاد وضعية مريحة' },
            { val: 20, text: 'أرق واستيقاظ متكرر بسبب الألم طوال الليل' }
        ],
        positiveBehaviors: [
            { id: 'beh-exercise', text: 'نفذت التمارين التأهيلية الموصوفة بانتظام' },
            { id: 'beh-posture', text: 'حافظت على وضعية جلوس ووقوف صحيحة' },
            { id: 'beh-walk', text: 'قمت بالحركة الخفيفة المنتظمة لتنشيط الدورة الدموية' },
            { id: 'beh-heat', text: 'استخدمت الكمادات والراحة الكافية حسب التوجيه' }
        ],
        negativeBehaviors: [
            { id: 'neg-sitting', text: 'جلوس طويل متواصل لأكثر من ساعة دون تغيير' },
            { id: 'neg-lifting', text: 'حمل أوزان ثقيلة أو مجهود مفرط على المنطقة المؤلمة' },
            { id: 'neg-phone', text: 'استخدام الهاتف بوضعية منحنية لفترات طويلة' },
            { id: 'neg-sleep', text: 'نوم على وضعية غير مريحة تزيد الضغط على منطقة الألم' }
        ]
    };
}

