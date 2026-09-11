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
        const baselinePain = (latestAssessment && typeof latestAssessment.painSeverity === 'number' && !isNaN(latestAssessment.painSeverity) && latestAssessment.painSeverity > 0)
            ? latestAssessment.painSeverity
            : (patient && typeof patient.painLevel === 'number' && !isNaN(patient.painLevel) && patient.painLevel > 0)
                ? patient.painLevel
                : 10;
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

