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

    // تهيئة الجلسة للمريض
    async function initPatientSession(patientId) {
        if (!patientId) return null;
        
        const patient = await SmartDB.getPatient(patientId);
        if (!patient) return null;

        const assessments = await SmartDB.getPatientAssessments(patientId);
        const dailyLogs = await SmartDB.getPatientDailyLogs(patientId);
        const currentSessionDay = Math.min(7, dailyLogs.length + 1);
        const isPlanCompleted = dailyLogs.length >= 7;

        // حساب مؤشرات التحسن الثلاثة المحددة بدقة ومن مدخلات المريض الفعلية حصراً
        const latestAssessment = assessments.length > 0 ? assessments[assessments.length - 1] : null;
        const baselinePain = (latestAssessment && typeof latestAssessment.painSeverity === 'number' && !isNaN(latestAssessment.painSeverity))
            ? latestAssessment.painSeverity
            : (patient && typeof patient.painLevel === 'number' && !isNaN(patient.painLevel))
                ? patient.painLevel
                : null;
        const latestLog = dailyLogs.length > 0 ? dailyLogs[dailyLogs.length - 1] : null;
        const currentPain = latestLog && typeof latestLog.painScore === 'number' ? latestLog.painScore : (baselinePain || 0);

        // 1. مؤشر انخفاض وتلاشي الألم (محسوب مباشرة من مقارنة ألم اليوم الأول بألم آخر جلسة)
        let painReductionRate = 0;
        if (dailyLogs.length > 0 && baselinePain !== null && baselinePain > 0) {
            painReductionRate = Math.max(0, Math.min(100, Math.round(((baselinePain - currentPain) / baselinePain) * 100)));
        } else if (dailyLogs.length > 0 && currentPain === 0) {
            painReductionRate = 100;
        } else {
            painReductionRate = 0; // بداية البرنامج قبل أي جلسة
        }
        
        // 2. مؤشر تحسن المدى الحركي (محسوب مباشرة من تقييم المريض الحركي المسجل في الجلسة اليومية)
        let mobilityScore = 0; // 0 قبل تسجيل أي جلسة
        if (dailyLogs.length > 0) {
            if (latestLog && typeof latestLog.mobilityRate === 'number') {
                mobilityScore = latestLog.mobilityRate;
            } else {
                // متوسط الحساب الحركي من مدخلات الجلسات
                let mobAcc = 0;
                dailyLogs.forEach(l => {
                    let dayMob = 50;
                    if (l.exercisesDone) dayMob += 20;
                    if (l.walkingDone) dayMob += 15;
                    if (l.goodPosture) dayMob += 10;
                    mobAcc += Math.min(100, dayMob);
                });
                mobilityScore = Math.round(mobAcc / dailyLogs.length);
            }
        }

        // 3. مؤشر جودة وعمق النوم والراحة (محسوب مباشرة من تقييم جودة النوم اليومي)
        let sleepScore = 0; // 0 قبل تسجيل أي جلسة
        if (dailyLogs.length > 0) {
            if (latestLog && typeof latestLog.sleepRate === 'number') {
                sleepScore = latestLog.sleepRate;
            } else {
                let sleepAcc = 0;
                dailyLogs.forEach(l => {
                    let s = 50;
                    if (l.painScore <= 3) s += 30;
                    else if (l.painScore <= 5) s += 15;
                    if (l.heatDone) s += 10;
                    sleepAcc += Math.min(100, s);
                });
                sleepScore = Math.round(sleepAcc / dailyLogs.length);
            }
        }

        // المرحلة العلاجية الحالية المنسجمة تشريحياً 100% مع موضع الشكوى
        const pointId = (latestAssessment?.pointKey || latestAssessment?.pointId || "").toLowerCase();
        let stageTitle = "";
        let motivation = "";

        if (currentSessionDay <= 2) {
            if (pointId.includes("cervical") || pointId.includes("neck") || pointId.includes("head")) {
                stageTitle = "المرحلة الأولى: تسكين الألم الحاد وتفريغ الضغط عن الفقرات العنقية";
                motivation = currentSessionDay === 1 
                    ? "🌟 بداية موفقة! تطبيق تمارين استقامة الرقبة وتراجع الذقن اليوم هو أول خطوة لتفريغ الضغط العصبي."
                    : "💪 تقدم ممتاز! إطالة عضلات الرقبة الجانبية يساعد على تفكيك التشنج الليفي والاحتقان.";
            } else if (pointId.includes("shoulder")) {
                stageTitle = "المرحلة الأولى: تسكين الألم الحاد وإرخاء الكفة المدورة وأوتار الكتف";
                motivation = currentSessionDay === 1
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
                stageTitle = "المرحلة الأولى: تسكين الألم الحاد وتفريغ الضغط الغضروفي والعصبي";
                motivation = currentSessionDay === 1
                    ? "🌟 بداية موفقة! تطبيق تمارين تفريغ الضغط اليوم هو أول خطوة لاستعادة التوازن الميكانيكي لفقراتك."
                    : "💪 تقدم ممتاز! التزامك باليوم الثاني يساعد على تخفيف الاحتقان العصبي المحيط بالفقرات.";
            }
        } else if (currentSessionDay >= 3 && currentSessionDay <= 5) {
            if (pointId.includes("cervical") || pointId.includes("neck") || pointId.includes("head")) {
                stageTitle = "المرحلة الثانية: استعادة مرونة الرقبة وتليين المفاصل الصدرية";
                motivation = "✨ رائع جداً! بدأنا مرحلة تليين الأنسجة واستعادة المدى الحركي الطبيعي للرقبة والكتفين.";
            } else if (pointId.includes("shoulder")) {
                stageTitle = "المرحلة الثانية: استعادة المدى الحركي وتليين الكفة المدورة للكتف";
                motivation = "✨ أداء رائع! ضم لوحي الكتف وتنشيط الكفة المدورة يعيد سلاسة رفع الذراع للأعلى.";
            } else if (pointId.includes("elbow") || pointId.includes("wrist") || pointId.includes("hand")) {
                stageTitle = "المرحلة الثانية: استعادة مرونة وحركة الساعد والمعصم";
                motivation = "✨ ممتاز! دوران الساعد وإطالة المعصم يمنع تصلب الأوتار ويعيد قوة القبضة.";
            } else if (pointId.includes("knee")) {
                stageTitle = "المرحلة الثانية: تليين صابونة الركبة واستعادة ثني وفرد المفصل";
                motivation = "✨ إنجاز رائع! فرد الركبة النهائي TKE يوجه الصابونة لمسارها الصحيح ويمنع الطقطقة.";
            } else if (pointId.includes("ankle") || pointId.includes("foot") || pointId.includes("calf") || pointId.includes("achilles") || pointId.includes("37515")) {
                stageTitle = "المرحلة الثانية: استعادة مرونة الكاحل وتليين وتر أكيليس والسمانة";
                motivation = "✨ رائع جداً! رفع الكعبين وتليين الكاحل والسمانة يعزز مرونة المشي وامتصاص الصدمات.";
            } else if (pointId.includes("pelvis") || pointId.includes("si_joint") || pointId.includes("sacroiliac") || pointId.includes("piriformis") || pointId.includes("hip")) {
                stageTitle = "المرحلة الثانية: فك التصاقات العضلة الكمثرية وتليين الحوض";
                motivation = "✨ تقدم ممتاز! تحرير المسار العصبي يضاعف مرونة عضلات الحوض والأرداف.";
            } else if (pointId.includes("jaw") || pointId.includes("tmj")) {
                stageTitle = "المرحلة الثانية: موازنة حركة فتح وإغلاق الفك دون طقطقة";
                motivation = "✨ تقدم ملحوظ! تمرين تثبيت اللسان يدرب مفصل الفك على الفتح بخط مستقيم ومتوازن.";
            } else {
                stageTitle = "المرحلة الثانية: تليين المفاصل واستعادة المدى الحركي وتحرير المخارج";
                motivation = "✨ رائع جداً! بدأنا مرحلة تليين الأنسجة واستعادة المدى الحركي وتوسيع مخارج الأعصاب.";
            }
        } else {
            if (pointId.includes("cervical") || pointId.includes("neck") || pointId.includes("head")) {
                stageTitle = "المرحلة الثالثة: تقوية العضلات العميقة وتصحيح استقامة الرأس والكتفين";
                motivation = "🛡️ مرحلة التثبيت والحماية! تقوية العضلات العميقة تحمي رقبتك من الانتكاس وإجهاد الشاشات.";
            } else if (pointId.includes("shoulder")) {
                stageTitle = "المرحلة الثالثة: تقوية عضلات التثبيت واستقرار لوح ومفصل الكتف";
                motivation = "🛡️ مرحلة التثبيت! انزلاق الذراعين على الحائط وثبات لوح الكتف يمنعان عودة آلام الكتف نهائياً.";
            } else if (pointId.includes("elbow") || pointId.includes("wrist") || pointId.includes("hand")) {
                stageTitle = "المرحلة الثالثة: تقوية الأوتار القابضة والباسطة لمنع تكرار الإجهاد";
                motivation = "🛡️ مرحلة التقوية! الأوتار أصبحت أكثر قدرة على تحمل مهام العمل والاستخدام اليومي.";
            } else if (pointId.includes("knee")) {
                stageTitle = "المرحلة الثالثة: تقوية العضلة الرباعية وتثبيت الركبة لمنع الانتكاس";
                motivation = "🛡️ مرحلة التثبيت! عضلات الفك المحيطة بالركبة أصبحت دعامة قوية تحمي الغضاريف والمفصل.";
            } else if (pointId.includes("ankle") || pointId.includes("foot") || pointId.includes("calf") || pointId.includes("achilles") || pointId.includes("37515")) {
                stageTitle = "المرحلة الثالثة: تقوية عضلات السمانة وحماية وتر أكيليس وقوس القدم";
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
            painTrendHTML: generatePainTrendChartSVG(dailyLogs, baselinePain),
            indicators: {
                painReduction: painReductionRate,
                mobility: mobilityScore,
                sleepQuality: sleepScore
            }
        };
    }

    // حساب حالة القفل الزمني للجلسة
    async function getSessionLockStatus(patientId) {
        const patient = await SmartDB.getPatient(patientId);
        if (!patient) return { isLocked: false, remainingHours: 0, remainingMs: 0 };

        const isDev = await SmartDB.getSetting('isDeveloperMode', false);
        if (isDev) {
            return { isLocked: false, remainingHours: 0, remainingMs: 0, isDev: true };
        }

        const forceUnlock = localStorage.getItem(`force_unlock_${patientId}`);
        if (forceUnlock === 'true') {
            return { isLocked: false, remainingHours: 0, remainingMs: 0, forced: true };
        }

        const customTarget = localStorage.getItem(`custom_target_time_${patientId}`);
        if (customTarget) {
            const targetMs = parseInt(customTarget);
            const now = Date.now();
            const diff = targetMs - now;
            if (diff <= 0) {
                localStorage.removeItem(`custom_target_time_${patientId}`);
                return { isLocked: false, remainingHours: 0, remainingMs: 0 };
            }
            return {
                isLocked: true,
                remainingHours: diff / (1000 * 60 * 60),
                remainingMs: diff,
                targetTime: targetMs
            };
        }

        const sessionIntervalHours = parseInt(await SmartDB.getSetting('sessionIntervalHours', 24)) || 24;
        const dailyLogs = await SmartDB.getPatientDailyLogs(patientId);
        
        // الجلسة الأولى (اليوم 1) تكون متاحة ومفتوحة فوراً عند التسجيل ولا تُقفل أبداً
        if (dailyLogs.length === 0) {
            return { isLocked: false, remainingHours: 0, remainingMs: 0 };
        }

        const lastLog = dailyLogs[dailyLogs.length - 1];
        const referenceTime = new Date(lastLog.date || new Date()).getTime();

        const now = Date.now();
        const intervalMs = sessionIntervalHours * 60 * 60 * 1000;
        const elapsedMs = now - referenceTime;
        const remainingMs = intervalMs - elapsedMs;

        if (remainingMs <= 0) {
            return { isLocked: false, remainingHours: 0, remainingMs: 0 };
        }

        return {
            isLocked: true,
            remainingHours: remainingMs / (1000 * 60 * 60),
            remainingMs,
            targetTime: referenceTime + intervalMs
        };
    }

    // تشغيل العداد التنازلي التفاعلي
    function startCountdownTimer(targetTime, displayElements, onComplete) {
        if (activeCountdownInterval) clearInterval(activeCountdownInterval);

        function update() {
            const now = Date.now();
            const diff = targetTime - now;

            if (diff <= 0) {
                clearInterval(activeCountdownInterval);
                if (displayElements.hours) displayElements.hours.textContent = '00';
                if (displayElements.minutes) displayElements.minutes.textContent = '00';
                if (displayElements.seconds) displayElements.seconds.textContent = '00';
                if (typeof onComplete === 'function') onComplete();
                return;
            }

            const totalSec = Math.floor(diff / 1000);
            const h = Math.floor(totalSec / 3600);
            const m = Math.floor((totalSec % 3600) / 60);
            const s = totalSec % 60;

            if (displayElements.hours) displayElements.hours.textContent = String(h).padStart(2, '0');
            if (displayElements.minutes) displayElements.minutes.textContent = String(m).padStart(2, '0');
            if (displayElements.seconds) displayElements.seconds.textContent = String(s).padStart(2, '0');
        }

        update();
        activeCountdownInterval = setInterval(update, 1000);
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
        if (typeof ClinicalAudioPacer !== 'undefined') {
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
                buttonEl.innerHTML = `<span>✅ تم إنجاز التمرين بنجاح! أحسنت</span>`;
                buttonEl.style.background = 'linear-gradient(135deg, #10b981 0%, #059669 100%)';
                buttonEl.style.color = '#ffffff';
                if (progressBar) progressBar.style.width = '100%';

                if (typeof ClinicalAudioPacer !== 'undefined') {
                    ClinicalAudioPacer.playCompleteChime();
                }

                if (navigator.vibrate) navigator.vibrate([100, 50, 100]);
            }
        }, 1000);
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
        getSessionLockStatus,
        startCountdownTimer,
        toggleExerciseTimer,
        generatePainTrendChartSVG,
        calculateRecoveryScore
    };
})();
