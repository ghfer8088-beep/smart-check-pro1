/**
 * Smart Check Pro 2.0 - منظومة التوجيه السريري الذهبي والشريط الثابت للمرضى وكبار السن
 * Sticky Clinical Guidance & Action Bar Architecture v29.16
 * 
 * الميزات المتقدمة المحققة:
 * 1. شريط سريري ثابت أسفل الشاشة بمحاذاة إبهام اليد لا يتأثر بالتمرير ولا يغطي أي أزرار (z-index: 2000090).
 * 2. توجيه تسلسلي ديناميكي في كل خطوة يتغير بالتوالي مع إنجاز المهام، التمارين، والتعليمات.
 * 3. معالجة ذكية فورية لصفحة التقرير (التركيز على التقرير عند ظهوره، واختفاء حالة التحضير فوراً).
 * 4. رصد وتوجيه فوري عند ظهور نافذة الصدقة الجارية والدعاء (royal-duaa-modal) مع زر التأمين بالأسفل.
 * 5. توجيه خطوة بخطوة للتمارين (تعليمات -> تشغيل المؤقت -> توثيق الجلسة) لمنع التخطي العشوائي.
 */

const SmartGuidance = (function() {
    'use strict';

    let barEl = null;
    let currentStep = 1;
    let isAiAnalyzing = false;
    let currentPoint = null;
    let hasExercisedInSession = false;
    let liveWatcherInterval = null;
    let activeSubState = 'default';

    function init() {
        if (typeof window === 'undefined') return;
        createStickyBarDOM();

        // استرجاع النقطة المحفوظة إن وجدت
        try {
            const savedPointStr = localStorage.getItem('smart_current_point');
            if (savedPointStr) {
                currentPoint = JSON.parse(savedPointStr);
            }
        } catch (e) {}

        // يتم تحديد حالة إتمام التمارين ديناميكياً وبشكل موضوعي من واقع DOM التمارين الحقيقي

        setTimeout(() => {
            const savedStep = parseInt(localStorage.getItem('smart_current_step') || '1', 10);
            updateStep(savedStep);
        }, 250);

        // ✅ v29.19: رفع مؤقت المراقب من 350ms إلى 500ms لتوفير الموارد
        if (!liveWatcherInterval) {
            liveWatcherInterval = setInterval(checkLiveGuidanceState, 500);
        }
    }

    function createStickyBarDOM() {
        if (document.getElementById('sticky-patient-guidance-bar')) {
            barEl = document.getElementById('sticky-patient-guidance-bar');
            return;
        }

        barEl = document.createElement('div');
        barEl.id = 'sticky-patient-guidance-bar';
        barEl.className = 'sticky-patient-guidance-bar';
        barEl.setAttribute('role', 'region');
        barEl.setAttribute('aria-label', 'شريط التوجيه الطبي الذكي');

        barEl.innerHTML = `
            <div class="sticky-guidance-container" id="sticky-guidance-container">
                <div class="sticky-guidance-info" id="sticky-guidance-info">
                    <span class="sticky-guidance-icon" id="sticky-guidance-icon">🎯</span>
                    <div class="sticky-guidance-texts">
                        <div class="sticky-guidance-sub" id="sticky-guidance-sub">المرحلة 1 من 6: تحديد موضع الشكوى والألم</div>
                        <div class="sticky-guidance-main" id="sticky-guidance-main">انقر على مكان ألمك من النقاط الحمراء المضيئة على المجسم</div>
                    </div>
                </div>
                <button type="button" id="sticky-guidance-action-btn" class="sticky-guidance-action-btn state-pending" onclick="SmartGuidance.onActionButtonClick(event)">
                    <span id="sticky-btn-icon">👆</span>
                    <span id="sticky-btn-text">اختر نقطة الألم أولاً</span>
                    <span class="sticky-btn-arrow">➔</span>
                </button>
            </div>
        `;
        document.body.appendChild(barEl);

        // إتاحة النقر على أي مكان بالشريط السفلي لتنفيذ الإجراء الإرشادي بسلاسة لكبار السن
        barEl.addEventListener('click', function(e) {
            if (e.target && (e.target.id === 'sticky-guidance-action-btn' || e.target.closest('#sticky-guidance-action-btn'))) {
                return; // معالج بواسطة زر الأكشن نفسه
            }
            onActionButtonClick(e);
        });
    }

    function updateStep(stepNum) {
        currentStep = stepNum;
        isAiAnalyzing = false;
        hasExercisedInSession = false;

        // ✅ v29.19: إيقاف المراقب بعد إتمام المرحلة 6 لتوفير الموارد
        if (stepNum >= 6 && liveWatcherInterval) {
            // تأخير قصير ثم إيقاف المراقب بعد عرض شريط المرحلة 6
            setTimeout(() => {
                if (currentStep >= 6) {
                    clearInterval(liveWatcherInterval);
                    liveWatcherInterval = null;
                }
            }, 3000);
        }

        // مزامنة أشرطة المسار السريري العلوية
        updateStageFlowBanner(stepNum, 1);

        // تطبيق توجيه المرحلة الحالية
        checkLiveGuidanceState();
    }

    // -------------------------------------------------------------------------
    // مراقب الحالة الحية (Live Guidance State Watcher)
    // يفحص النوافذ المنبثقة وحالة التقرير ومؤقتات التمارين لمواكبة المستخدم لحظة بلحظة
    // -------------------------------------------------------------------------
    function checkLiveGuidanceState() {
        if (!barEl) barEl = document.getElementById('sticky-patient-guidance-bar');
        if (!barEl) return;

        // 1. فحص نافذة الصدقة الجارية والدعاء (royal-duaa-modal)
        const duaaModal = document.getElementById('royal-duaa-modal');
        if (duaaModal && duaaModal.style.display !== 'none' && window.getComputedStyle(duaaModal).display !== 'none') {
            barEl.style.transform = '';
            barEl.style.opacity = '';
            barEl.style.pointerEvents = '';
            renderDuaaModalBar();
            return;
        }

        // 2. فحص نافذة تقييم الجلسة الشامل (session-assessment-modal)
        const assessModal = document.getElementById('session-assessment-modal');
        if (assessModal && assessModal.style.display !== 'none' && window.getComputedStyle(assessModal).display !== 'none') {
            barEl.style.transform = '';
            barEl.style.opacity = '';
            barEl.style.pointerEvents = '';
            renderAssessmentModalBar();
            return;
        }

        // 3. فحص نافذة إدخال الهاتف الإلزامية
        const phoneModal = document.getElementById('phone-intake-modal');
        if (phoneModal && phoneModal.style.display !== 'none' && window.getComputedStyle(phoneModal).display !== 'none') {
            barEl.style.transform = '';
            barEl.style.opacity = '';
            barEl.style.pointerEvents = '';
            renderPhoneModalBar();
            return;
        }

        // 4. النوافذ الكاملة الأخرى المستقلة التي تتطلب إخفاء مؤقتاً لشريط التوجيه (مثل الفيديو، أو مكتبة التمارين، إلخ)
        const fullscreenModal = Array.from(document.querySelectorAll('#welcome-tour-modal, #disclaimer-modal, #completion-certificate-modal, #in-app-video-player-modal, #exercise-library-modal, #chiropractic-explainer-modal, #mri-consultation-modal, #video-success-stories-modal, #patient-login-modal, #patient-portal-modal, #auto-update-overlay')).find(m => {
            return m && m.style.display && m.style.display !== 'none' && window.getComputedStyle(m).display !== 'none';
        });

        if (fullscreenModal) {
            barEl.style.transform = 'translateY(150%)';
            barEl.style.opacity = '0';
            barEl.style.pointerEvents = 'none';
            return;
        } else {
            barEl.style.transform = '';
            barEl.style.opacity = '';
            barEl.style.pointerEvents = '';
        }

        // 5. توجيه المرحلة حسب رقم الخطوة الفعلي
        switch (currentStep) {
            case 1:
                renderStep1Bar();
                break;
            case 2:
                renderStep2Bar();
                break;
            case 3:
                renderStep3Bar();
                break;
            case 4:
                renderStep4Bar();
                break;
            case 5:
                renderStep5Bar();
                break;
            case 6:
                renderStep6Bar();
                break;
            default:
                renderStep1Bar();
                break;
        }
    }

    // -------------------------------------------------------------------------
    // المرحلة 1: المجسم وتحديد الألم
    // -------------------------------------------------------------------------
    function renderStep1Bar() {
        const point = currentPoint || (typeof window.currentSelectedPoint !== 'undefined' ? window.currentSelectedPoint : null);

        // التحقق وضمان رسم النقاط على المجسم فوراً
        if (document.querySelectorAll('.anatomy-hotspot').length === 0 && typeof switchAnatomyView === 'function') {
            const activeView = document.getElementById('btn-view-back')?.classList.contains('active') ? 'back' : 'front';
            switchAnatomyView(activeView);
        }

        const iconEl = document.getElementById('sticky-guidance-icon');
        const subEl = document.getElementById('sticky-guidance-sub');
        const mainEl = document.getElementById('sticky-guidance-main');
        const btn = document.getElementById('sticky-guidance-action-btn');
        const btnIcon = document.getElementById('sticky-btn-icon');
        const btnText = document.getElementById('sticky-btn-text');

        if (!btn) return;

        if (point && point.title) {
            activeSubState = 'step1_point_selected';
            updateStageFlowBanner(1, 2);
            if (iconEl) iconEl.textContent = '✅';
            if (subEl) subEl.textContent = 'ممتاز! تم تحديد موضع الشكوى بنجاح';
            if (mainEl) mainEl.innerHTML = `موضع الألم المختار: <strong style="color: #fef08a;">${point.title}</strong>`;

            btn.className = 'sticky-guidance-action-btn state-ready';
            if (btnIcon) btnIcon.textContent = '🩺';
            if (btnText) btnText.textContent = 'اضغط هنا لبدء الاستشارة السريرية';
        } else {
            activeSubState = 'step1_pending';
            updateStageFlowBanner(1, 1);
            if (iconEl) iconEl.textContent = '🎯';
            if (subEl) subEl.textContent = 'المرحلة 1 من 6: تحديد موضع الشكوى والألم';
            if (mainEl) mainEl.textContent = 'المس النقطة الحمراء على المجسم التي تشعر بالألم فيها';

            btn.className = 'sticky-guidance-action-btn state-pending';
            if (btnIcon) btnIcon.textContent = '👆';
            if (btnText) btnText.textContent = 'المس نقطة ألمك على المجسم';
        }
    }

    function onPointSelected(point) {
        currentPoint = point;
        renderStep1Bar();

        if (typeof showToast === 'function') {
            showToast(`🎯 تم تحديد: ${point.title}.. اضغط على زر المتابعة بالأسفل لنبدأ استشارتك`, 'success', 4000);
        }
    }

    // -------------------------------------------------------------------------
    // المرحلة 2: الاستشارة السريرية الذكية
    // -------------------------------------------------------------------------
    function renderStep2Bar() {
        const iconEl = document.getElementById('sticky-guidance-icon');
        const subEl = document.getElementById('sticky-guidance-sub');
        const mainEl = document.getElementById('sticky-guidance-main');
        const btn = document.getElementById('sticky-guidance-action-btn');
        const btnIcon = document.getElementById('sticky-btn-icon');
        const btnText = document.getElementById('sticky-btn-text');

        if (!btn) return;

        const isDialogueConcluding = window._isDialogueConcluding 
            || (typeof clinicalDialogueState !== 'undefined' && clinicalDialogueState && (clinicalDialogueState.step === 'completed' || clinicalDialogueState.step === 'ask_phone_success'));

        const btnRunDiag = document.getElementById('btn-run-diagnosis');
        const rapidFormContainer = document.getElementById('rapid-form-intake-container');
        const isRapidFormVisible = rapidFormContainer && rapidFormContainer.style.display !== 'none' && window.getComputedStyle(rapidFormContainer).display !== 'none';
        const isDiagBtnReady = btnRunDiag && btnRunDiag.offsetParent !== null && isRapidFormVisible;

        if (isDialogueConcluding) {
            activeSubState = 'step2_concluding';
            updateStageFlowBanner(2, 3);
            if (iconEl) iconEl.textContent = '⏳';
            if (subEl) subEl.textContent = 'المرحلة 2 من 6: اكتمال الاستشارة السريرية';
            if (mainEl) mainEl.textContent = 'د. سارة تُنهي التوصيات الختامية.. جاري تجهيز تقريرك الطبي والتشخيص السريري';

            btn.className = 'sticky-guidance-action-btn state-pending';
            if (btnIcon) btnIcon.textContent = '⏳';
            if (btnText) btnText.textContent = 'جاري تحضير التقرير...';
        } else if (isAiAnalyzing) {
            activeSubState = 'step2_analyzing';
            updateStageFlowBanner(2, 2);
            if (iconEl) iconEl.textContent = '⏳';
            if (subEl) subEl.textContent = 'د. سارة تدرس إجابتك وتستكمل التشخيص';
            if (mainEl) mainEl.textContent = 'جاري تحليل الأعراض السريرية وتسجيل الرد الطبي... لحظات قليلة';

            btn.className = 'sticky-guidance-action-btn state-pending';
            if (btnIcon) btnIcon.textContent = '⚙️';
            if (btnText) btnText.textContent = 'د. سارة تحضر الرد...';
        } else if (isDiagBtnReady) {
            activeSubState = 'step2_ready_diagnosis';
            updateStageFlowBanner(2, 3);
            if (iconEl) iconEl.textContent = '🩺';
            if (subEl) subEl.textContent = 'اكتملت أسئلة الفحص السريري بنجاح';
            if (mainEl) mainEl.textContent = 'اضغط أدناه لمعالجة بياناتك وإصدار تقريرك الطبي وخطة التعافي';

            btn.className = 'sticky-guidance-action-btn state-ready';
            if (btnIcon) btnIcon.textContent = '📊';
            if (btnText) btnText.textContent = 'استخراج التقرير الطبي والتشخيص ❯';
        } else {
            activeSubState = 'step2_user_turn';
            updateStageFlowBanner(2, 2);
            if (iconEl) iconEl.textContent = '💬';
            if (subEl) subEl.textContent = 'المرحلة 2 من 6: الاستشارة السريرية الذكية';
            if (mainEl) mainEl.textContent = 'تفضل بالرد على سؤال د. سارة (صوتياً أو كتابةً) لتقييم حالتك بدقة';

            btn.className = 'sticky-guidance-action-btn state-ready';
            if (btnIcon) btnIcon.textContent = '✍️';
            if (btnText) btnText.textContent = 'إرسال الرد / التحدث للطبيبة';
        }
    }

    function guideAiTyping() {
        isAiAnalyzing = true;
        if (currentStep === 2) renderStep2Bar();
    }

    function hideAiTyping() {
        isAiAnalyzing = false;
        if (currentStep === 2) renderStep2Bar();
    }

    // -------------------------------------------------------------------------
    // المرحلة 3: التقرير والتشخيص السريري
    // -------------------------------------------------------------------------
    function renderStep3Bar() {
        const iconEl = document.getElementById('sticky-guidance-icon');
        const subEl = document.getElementById('sticky-guidance-sub');
        const mainEl = document.getElementById('sticky-guidance-main');
        const btn = document.getElementById('sticky-guidance-action-btn');
        const btnIcon = document.getElementById('sticky-btn-icon');
        const btnText = document.getElementById('sticky-btn-text');

        if (!btn) return;

        const hasReport = !!document.querySelector('#clinical-report-container .clinical-report-printable');
        const loadingModal = document.getElementById('royal-report-loading-modal');
        const isLoadingModalVisible = loadingModal && loadingModal.style.display !== 'none' && window.getComputedStyle(loadingModal).display !== 'none';

        if (!hasReport || isLoadingModalVisible) {
            // حالة التحضير: الشاشة مركزة على مكان إصدار التقرير والانتظار
            activeSubState = 'step3_loading';
            updateStageFlowBanner(3, 1);
            if (iconEl) iconEl.textContent = '⏳';
            if (subEl) subEl.textContent = 'المرحلة 3 من 6: إعداد التقرير الطبي والتشخيص';
            if (mainEl) mainEl.textContent = 'يقوم النظام بتحليل الأعراض وصياغة التفسير البيوميكانيكي المعتمد...';

            btn.className = 'sticky-guidance-action-btn state-pending';
            if (btnIcon) btnIcon.textContent = '⏳';
            if (btnText) btnText.textContent = 'جاري إعداد التقرير...';
        } else {
            // حالة ظهور التقرير: اختفاء حالة الإعداد فوراً والتوجيه لتفعيل الخطة بعد القراءة
            activeSubState = 'step3_ready';
            updateStageFlowBanner(3, 2);
            if (iconEl) iconEl.textContent = '📋';
            if (subEl) subEl.textContent = 'المرحلة 3 من 6: تشخيصك الطبي جاهز ومكتمل';
            if (mainEl) mainEl.textContent = 'بعد قراءة كافة البيانات يرجى الضغط على زر تفعيل الخطة المجانية';

            btn.className = 'sticky-guidance-action-btn state-ready';
            if (btnIcon) btnIcon.textContent = '🚀';
            if (btnText) btnText.textContent = 'تفعيل الخطة المجانية وبدء اليوم الأول ❯';
        }
    }

    function onReportRendered() {
        currentStep = 3;
        renderStep3Bar();

        // التمرير السلس الهادئ إلى بداية التقرير الطبي ليقرأه المريض
        setTimeout(() => {
            const reportEl = document.getElementById('clinical-report-container');
            if (reportEl) {
                reportEl.scrollIntoView({ behavior: 'smooth', block: 'start' });
            }
        }, 150);
    }

    // -------------------------------------------------------------------------
    // نافذة الصدقة الجارية والدعاء (royal-duaa-modal)
    // -------------------------------------------------------------------------
    function renderDuaaModalBar() {
        if (!barEl) barEl = document.getElementById('sticky-patient-guidance-bar');
        if (barEl) {
            barEl.style.transform = '';
            barEl.style.opacity = '';
            barEl.style.pointerEvents = '';
        }
        activeSubState = 'duaa_modal';
        const iconEl = document.getElementById('sticky-guidance-icon');
        const subEl = document.getElementById('sticky-guidance-sub');
        const mainEl = document.getElementById('sticky-guidance-main');
        const btn = document.getElementById('sticky-guidance-action-btn');
        const btnIcon = document.getElementById('sticky-btn-icon');
        const btnText = document.getElementById('sticky-btn-text');

        if (!btn) return;

        if (iconEl) iconEl.textContent = '🤲';
        if (subEl) subEl.textContent = 'رسالة الصدقة الجارية وإهداء الخطة المجانية';
        if (mainEl) mainEl.textContent = 'نسألكم خالص الدعاء بالرحمة لوالد المعالج، ثم اضغط على زر التأمين والمتابعة الأخضر';

        btn.className = 'sticky-guidance-action-btn state-ready';
        if (btnIcon) btnIcon.textContent = '🤲';
        if (btnText) btnText.textContent = 'آمين.. قبول الصدقة وبدء اليوم الأول ❯';

        // تسليط الضوء على زر التأمين داخل النافذة نفسها
        const confirmBtn = document.getElementById('btn-confirm-duaa');
        if (confirmBtn) {
            confirmBtn.classList.add('guidance-target-highlight');
        }
    }

    function guideDuaaModal() {
        renderDuaaModalBar();
    }

    function onDuaaModalClosed() {
        activeSubState = 'default';
        const confirmBtn = document.getElementById('btn-confirm-duaa');
        if (confirmBtn) {
            confirmBtn.classList.remove('guidance-target-highlight');
        }
        updateStep(4);
    }

    // -------------------------------------------------------------------------
    // نافذة تقييم الجلسة (session-assessment-modal)
    // -------------------------------------------------------------------------
    function renderAssessmentModalBar() {
        if (!barEl) barEl = document.getElementById('sticky-patient-guidance-bar');
        if (barEl) {
            barEl.style.transform = '';
            barEl.style.opacity = '';
            barEl.style.pointerEvents = '';
        }
        activeSubState = 'assessment_modal';
        const iconEl = document.getElementById('sticky-guidance-icon');
        const subEl = document.getElementById('sticky-guidance-sub');
        const mainEl = document.getElementById('sticky-guidance-main');
        const btn = document.getElementById('sticky-guidance-action-btn');
        const btnIcon = document.getElementById('sticky-btn-icon');
        const btnText = document.getElementById('sticky-btn-text');

        if (!btn) return;

        if (iconEl) iconEl.textContent = '📝';
        if (subEl) subEl.textContent = 'توثيق التقييم الحركي والاستشفاء';
        if (mainEl) mainEl.textContent = 'حدّد مستوى الألم والعادات الإيجابية اليوم، ثم اضغط زر الاعتماد بالأسفل';

        btn.className = 'sticky-guidance-action-btn state-ready';
        if (btnIcon) btnIcon.textContent = '💾';
        if (btnText) btnText.textContent = 'اعتماد التقييم والانتقال للجلسة التالية ❯';
    }

    function guideAssessmentModal() {
        renderAssessmentModalBar();
    }

    function onAssessmentModalClosed() {
        activeSubState = 'default';
        checkLiveGuidanceState();
    }

    // -------------------------------------------------------------------------
    // نافذة إدخال الهاتف (phone-intake-modal)
    // -------------------------------------------------------------------------
    function renderPhoneModalBar() {
        if (!barEl) barEl = document.getElementById('sticky-patient-guidance-bar');
        if (barEl) {
            barEl.style.transform = '';
            barEl.style.opacity = '';
            barEl.style.pointerEvents = '';
        }
        activeSubState = 'phone_modal';
        const iconEl = document.getElementById('sticky-guidance-icon');
        const subEl = document.getElementById('sticky-guidance-sub');
        const mainEl = document.getElementById('sticky-guidance-main');
        const btn = document.getElementById('sticky-guidance-action-btn');
        const btnIcon = document.getElementById('sticky-btn-icon');
        const btnText = document.getElementById('sticky-btn-text');

        if (!btn) return;

        if (iconEl) iconEl.textContent = '📱';
        if (subEl) subEl.textContent = 'ربط وحفظ ملفك الطبي السريري';
        if (mainEl) mainEl.textContent = 'يرجى تزويدنا برقم هاتفك لحفظ ملفك واستخراج التقرير الطبي وخطة التعافي';

        btn.className = 'sticky-guidance-action-btn state-ready';
        if (btnIcon) btnIcon.textContent = '📱';
        if (btnText) btnText.textContent = 'تأكيد رقم الهاتف والمتابعة ❯';
    }

    // فحص دقيق وموضوعي لحالة تمارين المرحلة الرابعة من واقع عناصر DOM الحقيقية
    function getStep4ExerciseProgress() {
        const cards = Array.from(document.querySelectorAll('#step-section-4 .clinical-exercise-card'));
        const total = cards.length;
        
        let completedCount = 0;
        let runningCount = 0;
        let nextUncompleted = null;
        let nextUncompletedIndex = -1;

        cards.forEach((card, idx) => {
            const btn = card.querySelector('button.btn-exercise-timer');
            const isCompleted = btn && (btn.dataset.completed === 'true' || btn.style.background.includes('10b981') || btn.innerHTML.includes('تم إنجاز') || btn.innerHTML.includes('بنجاح'));
            const isRunning = btn && btn.dataset.running === 'true';

            if (isRunning) runningCount++;
            if (isCompleted) {
                completedCount++;
            } else if (nextUncompleted === null) {
                nextUncompleted = card;
                nextUncompletedIndex = idx;
            }
        });

        const allDone = (total > 0 && completedCount >= total);

        return {
            total,
            completedCount,
            runningCount,
            nextUncompleted,
            nextUncompletedIndex,
            allDone
        };
    }

    // -------------------------------------------------------------------------
    // المرحلة 4: تمارين اليوم الأول (تسلسلي: تعليمات -> مؤقت -> توثيق)
    // -------------------------------------------------------------------------
    function renderStep4Bar() {
        const iconEl = document.getElementById('sticky-guidance-icon');
        const subEl = document.getElementById('sticky-guidance-sub');
        const mainEl = document.getElementById('sticky-guidance-main');
        const btn = document.getElementById('sticky-guidance-action-btn');
        const btnIcon = document.getElementById('sticky-btn-icon');
        const btnText = document.getElementById('sticky-btn-text');

        if (!btn) return;

        const progress = getStep4ExerciseProgress();

        if (progress.runningCount > 0) {
            // مؤقت تمرين يعمل حالياً
            activeSubState = 'step4_exercising';
            updateStageFlowBanner(4, 1);
            if (iconEl) iconEl.textContent = '⏱️';
            if (subEl) subEl.textContent = 'المرحلة 4: مؤقت التمرين الحركي يعمل الآن...';
            if (mainEl) mainEl.textContent = 'تنفس بعمق مع كل حركة.. استمر حتى اكتمال المؤقت بالتكنيك السليم';

            btn.className = 'sticky-guidance-action-btn state-pending';
            if (btnIcon) btnIcon.textContent = '⏱️';
            if (btnText) btnText.textContent = 'مؤقت التمرين يعمل الآن...';
        } else if (progress.allDone) {
            // الشرط 6: بعد إتمام التمارين يتحول زر الإرشاد إلى "تم تفعيل زر توثيق الجلسة"
            activeSubState = 'step4_done';
            updateStageFlowBanner(4, 2);
            if (iconEl) iconEl.textContent = '🎉';
            if (subEl) subEl.textContent = 'المرحلة 4 (خطوة 2 من 2): توثيق الجلسة وبدء الاستشفاء';
            if (mainEl) mainEl.textContent = '🎉 تم إنجاز كافة التمارين بنجاح! تم تفعيل زر توثيق الجلسة وبدء الاستشفاء (24 س)';

            btn.className = 'sticky-guidance-action-btn state-ready';
            if (btnIcon) btnIcon.textContent = '✅';
            if (btnText) btnText.textContent = 'تم تفعيل زر توثيق الجلسة - اضغط هنا للتوثيق ❯';
        } else {
            // الشرط 4 & 5: لم تكتمل التمارين بعد -> عرض الشرط السريري الواضح وزر بدء التمرين غير المنجز بالتوالي
            activeSubState = 'step4_initial';
            updateStageFlowBanner(4, 1);
            if (iconEl) iconEl.textContent = '⚠️';
            const exNum = progress.nextUncompletedIndex >= 0 ? (progress.nextUncompletedIndex + 1) : 1;
            
            if (subEl) subEl.textContent = `المرحلة 4 (خطوة 1 من 2): أداء التمارين المقررة (أنجزت ${progress.completedCount} من ${progress.total || 3})`;
            // الشرط 4 نصاً:
            if (mainEl) mainEl.textContent = '⚠️ لا يمكنك الانتقال لتوثيق الجلسة إلا بعد إتمامك لكافة التمارين المقترحة أدناه';

            btn.className = 'sticky-guidance-action-btn state-gold';
            if (btnIcon) btnIcon.textContent = '⏱️';
            // الشرط 5:
            if (btnText) btnText.textContent = `بدء التمرين #${exNum} ❯`;
        }
    }

    // -------------------------------------------------------------------------
    // المرحلة 5: متابعة الجلسات (2 إلى 7) - تسلسلي ومتحكم بالمؤقت
    // -------------------------------------------------------------------------
    function renderStep5Bar() {
        const iconEl = document.getElementById('sticky-guidance-icon');
        const subEl = document.getElementById('sticky-guidance-sub');
        const mainEl = document.getElementById('sticky-guidance-main');
        const btn = document.getElementById('sticky-guidance-action-btn');
        const btnIcon = document.getElementById('sticky-btn-icon');
        const btnText = document.getElementById('sticky-btn-text');

        if (!btn) return;

        const isRunning = !!document.querySelector('#step-section-5 button.btn-exercise-timer[data-running="true"]');
        const unlockedRecordBtn = document.querySelector('.royal-clinical-next-btn.active-unlocked, #step-section-5 button.active-unlocked, #session-completion-control-wrapper button[onclick*="openSessionAssessmentModal"]');
        const lockBtn = document.querySelector('.royal-clinical-lock-btn, #step-section-5 .royal-clinical-lock-btn');
        const countdownEl = document.getElementById('countdown-hours');
        const isLocked = !unlockedRecordBtn && (!!lockBtn || (!!countdownEl && countdownEl.offsetParent !== null) || !!document.getElementById('recovery-progress-remaining-text'));

        // ✅ v30.02: استخراج رقم الجلسة الحالية لعرضه بدقة في الشريط
        let sessionLabel = '';
        try {
            const sessNumEl = document.getElementById('current-session-number') || document.querySelector('[data-session-number]');
            const sessNumRaw = sessNumEl ? (sessNumEl.textContent || sessNumEl.getAttribute('data-session-number') || '') : '';
            let sessNum = parseInt(sessNumRaw, 10);
            if (isNaN(sessNum) || sessNum <= 0) {
                sessNum = (window.activePatient && window.activePatient.currentSessionDay) || 2;
            }
            if (sessNum > 0) sessionLabel = ` (جلسة ${sessNum} من 7)`;
        } catch(e) {}

        if (isLocked) {
            // الجلسة في فترة استشفاء الـ 24 ساعة
            activeSubState = 'step5_locked';
            if (iconEl) iconEl.textContent = '⏳';
            if (subEl) subEl.textContent = `المرحلة 5${sessionLabel}: فترة استشفاء حيوي جارية للأنسجة`;
            if (mainEl) mainEl.textContent = 'أنسجة مفاصلك في طور الاستشفاء.. التزم بإرشادات الراحة حتى انتهاء العداد';

            btn.className = 'sticky-guidance-action-btn state-pending';
            if (btnIcon) btnIcon.textContent = '🔒';
            if (btnText) btnText.textContent = 'الجلسة القادمة تتفعل بعد انتهاء الوقت';
        } else if (isRunning) {
            activeSubState = 'step5_exercising';
            if (iconEl) iconEl.textContent = '⏱️';
            if (subEl) subEl.textContent = `المرحلة 5${sessionLabel}: جاري أداء التمرين الحركي`;
            if (mainEl) mainEl.textContent = 'تنفس بانتظام وهدوء مع كل حركة.. لا تضغط على المفصل بقوة';

            btn.className = 'sticky-guidance-action-btn state-pending';
            if (btnIcon) btnIcon.textContent = '⏱️';
            if (btnText) btnText.textContent = 'مؤقت التمرين يعمل الآن...';
        } else {
            // ✅ v30.02: الجلسة مفتوحة ومتاحة للتوثيق والتسجيل (مفتوحة طبيعياً أو معدلة من الإدارة أو منتهية العداد)
            activeSubState = 'step5_ready_record';
            if (iconEl) iconEl.textContent = '🚀';
            if (subEl) subEl.textContent = `المرحلة 5${sessionLabel}: الجلسة مفتوحة وجاهزة للتسجيل والتقييم`;
            if (mainEl) mainEl.textContent = 'جلسة اليوم مفتوحة! اضغط لحفظ تسجيل الجلسة وتوثيق التقييم والانتقال للتالية';

            btn.className = 'sticky-guidance-action-btn state-ready';
            if (btnIcon) btnIcon.textContent = '🚀';
            if (btnText) btnText.textContent = 'حفظ تسجيل الجلسة وتوثيق التقييم ❯';
        }
    }

    // -------------------------------------------------------------------------
    // المرحلة 6: وثيقة التعافي والإنهاء
    // -------------------------------------------------------------------------
    function renderStep6Bar() {
        activeSubState = 'step6_ready';
        const iconEl = document.getElementById('sticky-guidance-icon');
        const subEl = document.getElementById('sticky-guidance-sub');
        const mainEl = document.getElementById('sticky-guidance-main');
        const btn = document.getElementById('sticky-guidance-action-btn');
        const btnIcon = document.getElementById('sticky-btn-icon');
        const btnText = document.getElementById('sticky-btn-text');

        if (!btn) return;

        if (iconEl) iconEl.textContent = '🏆';
        if (subEl) subEl.textContent = 'المرحلة 6 من 6: إتمام برنامج التعافي بنجاح';
        if (mainEl) mainEl.textContent = 'ألف مبارك إتمامك البرنامج بالكامل! حمّل وثيقتك الرسمية المعتمدة';

        btn.className = 'sticky-guidance-action-btn state-gold';
        if (btnIcon) btnIcon.textContent = '📜';
        if (btnText) btnText.textContent = 'تحميل وثيقة التعافي الرسمية (PDF) ❯';
    }

    // -------------------------------------------------------------------------
    // معالج النقر الموحد الذكي (Unified Action Handler)
    // يتصرف بدقة متناهية حسب الحالة الدقيقة التي يعيشها المستخدم على الشاشة
    // -------------------------------------------------------------------------
    function onActionButtonClick(e) {
        if (e && typeof e.stopPropagation === 'function') {
            e.stopPropagation();
        }

        // 1. إذا كانت نافذة الصدقة والدعاء مفتوحة
        const duaaModal = document.getElementById('royal-duaa-modal');
        if (duaaModal && duaaModal.style.display !== 'none' && window.getComputedStyle(duaaModal).display !== 'none') {
            duaaModal.style.display = 'none';
            if (typeof window.confirmRoyalDuaaAndProceed === 'function') {
                window.confirmRoyalDuaaAndProceed();
            } else if (typeof window.activateRecoveryPlanInstantly === 'function') {
                window.activateRecoveryPlanInstantly();
            } else if (typeof goToStep === 'function') {
                goToStep(4);
            }
            return;
        }

        // 2. إذا كانت نافذة تقييم الجلسة مفتوحة
        const assessModal = document.getElementById('session-assessment-modal');
        if (assessModal && assessModal.style.display !== 'none' && window.getComputedStyle(assessModal).display !== 'none') {
            const submitBtn = assessModal.querySelector('button[onclick*="submitComprehensiveDailyLog"]');
            if (submitBtn) {
                submitBtn.click();
            } else {
                const closeBtn = assessModal.querySelector('button[onclick*="closeSessionAssessmentModal"]');
                if (closeBtn) closeBtn.click();
            }
            return;
        }

        // 3. إذا كانت نافذة الهاتف مفتوحة
        const phoneModal = document.getElementById('phone-intake-modal');
        if (phoneModal && phoneModal.style.display !== 'none' && window.getComputedStyle(phoneModal).display !== 'none') {
            const submitPhoneBtn = phoneModal.querySelector('button[onclick*="submitMandatoryPhoneGate"]');
            if (submitPhoneBtn) submitPhoneBtn.click();
            return;
        }

        // 4. التصرف حسب الخطوة السريرية الحالية
        switch (currentStep) {
            case 1: {
                const point = currentPoint || (typeof window.currentSelectedPoint !== 'undefined' ? window.currentSelectedPoint : null);
                if (point && point.title) {
                    if (typeof window.handleStep1ProceedClick === 'function') {
                        window.handleStep1ProceedClick();
                    } else if (typeof goToStep === 'function') {
                        goToStep(2);
                    }
                } else {
                    const viewport = document.querySelector('.skeleton-viewport') || document.querySelector('.anatomy-card');
                    if (viewport) {
                        viewport.scrollIntoView({ behavior: 'smooth', block: 'center' });
                    }
                    if (typeof showToast === 'function') {
                        showToast('يا غالي، تفضل أولاً بالنقر على مكان وجعك على المجسم 🎯', 'warning', 3500);
                    }
                    document.querySelectorAll('.anatomy-hotspot').forEach(p => {
                        p.classList.add('guidance-pulse-all');
                    });
                    setTimeout(() => {
                        document.querySelectorAll('.anatomy-hotspot').forEach(p => {
                            p.classList.remove('guidance-pulse-all');
                        });
                    }, 3500);
                }
                break;
            }

            case 2: {
                if (activeSubState === 'step2_concluding') {
                    if (typeof window.doDirectTransitionToReport === 'function') {
                        window.doDirectTransitionToReport();
                    } else if (typeof window.doDirectTransitionToSpecializedReport === 'function') {
                        window.doDirectTransitionToSpecializedReport();
                    } else if (typeof finishChatIntakeAndGenerateReport === 'function') {
                        finishChatIntakeAndGenerateReport();
                    }
                } else if (activeSubState === 'step2_ready_diagnosis') {
                    if (typeof runDiagnosticAnalysisWithCheck === 'function') {
                        runDiagnosticAnalysisWithCheck();
                    } else if (typeof runDiagnosticAnalysis === 'function') {
                        runDiagnosticAnalysis();
                    }
                } else {
                    const chatInput = document.getElementById('ai-chat-input');
                    if (chatInput && !chatInput.disabled) {
                        chatInput.scrollIntoView({ behavior: 'smooth', block: 'center' });
                        chatInput.focus();
                    } else {
                        const micBtn = document.getElementById('btn-voice-record-pulse') || document.querySelector('.voice-record-btn');
                        if (micBtn) micBtn.click();
                    }
                }
                break;
            }

            case 3: {
                // التقرير الطبي: تفعيل الخطة المجانية فوراً وبدء اليوم الأول بدون أي تعطيل أو شروط
                if (typeof window.activateRecoveryPlanInstantly === 'function') {
                    window.activateRecoveryPlanInstantly();
                } else if (typeof activateRecoveryPlanInstantly === 'function') {
                    activateRecoveryPlanInstantly();
                } else {
                    const btnRoyal = document.getElementById('btn-activate-plan-royal');
                    if (btnRoyal) {
                        btnRoyal.click();
                    } else if (typeof goToStep === 'function') {
                        goToStep(4);
                    }
                }
                break;
            }

            case 4: {
                const patientId = (typeof activePatient !== 'undefined' && activePatient?.patientId) || (typeof SmartDB !== 'undefined' && SmartDB.getCurrentSessionPatientId ? SmartDB.getCurrentSessionPatientId() : null) || 'pat_guest';
                const progress = getStep4ExerciseProgress();

                if (progress.allDone || activeSubState === 'step4_done') {
                    // أتم التمارين -> فتح نافذة التوثيق
                    if (typeof handleStep4CompletionClick === 'function') {
                        handleStep4CompletionClick(patientId);
                    } else {
                        const completeBtn = document.querySelector('#step-section-4 button[onclick*="handleStep4CompletionClick"]') || document.getElementById('btn-complete-day1-session') || document.querySelector('#step-section-4 button[onclick*="openSessionAssessmentModal"]');
                        if (completeBtn) {
                            completeBtn.click();
                        } else if (typeof openSessionAssessmentModal === 'function') {
                            openSessionAssessmentModal(patientId, 1);
                        }
                    }
                } else if (progress.runningCount > 0 || activeSubState === 'step4_exercising') {
                    // تمرين يعمل -> التمرير للتمرين الجاري
                    const activeEx = document.querySelector('#step-section-4 button.btn-exercise-timer[data-running="true"]')?.closest('.clinical-exercise-card');
                    if (activeEx) activeEx.scrollIntoView({ behavior: 'smooth', block: 'center' });
                } else {
                    // التحقق من ظهور قسم المرحلة 4 أولاً
                    const step4Sec = document.getElementById('step-section-4');
                    if (step4Sec && (step4Sec.style.display === 'none' || window.getComputedStyle(step4Sec).display === 'none')) {
                        if (typeof goToStep === 'function') goToStep(4);
                    }

                    // الشرط 5: الانتقال للتمرين الذي لم ينجز بالتوالي وبدء تشغيله
                    const targetCard = progress.nextUncompleted || document.querySelector('#step-section-4 .clinical-exercise-card');
                    if (targetCard) {
                        targetCard.scrollIntoView({ behavior: 'smooth', block: 'center' });
                        targetCard.style.outline = '3px solid #eab308';
                        targetCard.style.boxShadow = '0 0 25px rgba(234, 179, 8, 0.7)';
                        setTimeout(() => {
                            targetCard.style.outline = '';
                            targetCard.style.boxShadow = '';
                        }, 2500);

                        // تأخير بسيط للسماح بانتهاء الانتقال السلس قبل بدء المؤقت
                        setTimeout(() => {
                            const timerBtn = targetCard.querySelector('.btn-exercise-timer');
                            if (timerBtn && timerBtn.dataset.running !== 'true' && timerBtn.dataset.completed !== 'true') {
                                timerBtn.click();
                            }
                        }, 650);
                    }
                    const exNum = progress.nextUncompletedIndex >= 0 ? (progress.nextUncompletedIndex + 1) : 1;
                    if (typeof showToast === 'function') {
                        showToast(`⏱️ جاري بدء التمرين #${exNum} بالتوالي.. التزم بالتكنيك السليم 🌿`, 'info', 3500);
                    }
                }
                break;
            }

            case 5: {
                const patientId = (typeof activePatient !== 'undefined' && activePatient?.patientId) || 
                                  (typeof SmartDB !== 'undefined' && SmartDB.getCurrentSessionPatientId ? SmartDB.getCurrentSessionPatientId() : null) || 
                                  localStorage.getItem('smart_current_patient_id') || 'P-GUEST';

                const activeDayBtn = document.querySelector('.royal-clinical-next-btn.active-unlocked, #step-section-5 button.active-unlocked, #session-completion-control-wrapper button[onclick*="openSessionAssessmentModal"]');

                if (activeSubState === 'step5_locked') {
                    const clock = document.getElementById('countdown-hours') || document.querySelector('.royal-clinical-lock-btn');
                    if (clock) clock.scrollIntoView({ behavior: 'smooth', block: 'center' });
                    if (typeof showToast === 'function') {
                        showToast('⏳ أنسجة مفاصلك في فترة استشفاء وترميم.. العداد جارٍ ومتبقي لحين فتح الجلسة', 'warning', 4000);
                    }
                } else if (activeSubState === 'step5_exercising') {
                    const activeEx = document.querySelector('#step-section-5 button.btn-exercise-timer[data-running="true"]')?.closest('.clinical-exercise-card');
                    if (activeEx) activeEx.scrollIntoView({ behavior: 'smooth', block: 'center' });
                } else if (activeSubState === 'step5_ready_record' || activeDayBtn) {
                    // ✅ v30.02: عند فتح الجلسة (طبيعياً أو من الإدارة) يتم فوراً فتح نافذة تسجيل وتقييم الجلسة دون أي تشويش
                    if (activeDayBtn) {
                        activeDayBtn.click();
                    } else if (typeof openSessionAssessmentModal === 'function') {
                        const currentDay = (window.activePatient && window.activePatient.currentSessionDay) || 
                                          (typeof SmartDB !== 'undefined' && SmartDB.getCurrentPatient ? SmartDB.getCurrentPatient()?.currentSessionDay : null) || 2;
                        openSessionAssessmentModal(patientId, currentDay);
                    }
                } else {
                    const firstEx = document.querySelector('#step-section-5 .clinical-exercise-card');
                    if (firstEx) {
                        firstEx.scrollIntoView({ behavior: 'smooth', block: 'center' });
                        const timerBtn = firstEx.querySelector('.btn-exercise-timer');
                        if (timerBtn && timerBtn.dataset.running !== 'true') {
                            timerBtn.click();
                        }
                    }
                }
                break;
            }

            case 6: {
                const certBtn = document.querySelector('.btn-download-cert, .btn-whatsapp-consult-cert, #btn-download-certificate');
                if (certBtn) {
                    certBtn.click();
                } else {
                    window.print();
                }
                break;
            }

            default:
                break;
        }
    }

    function updateStageFlowBanner(stepNum, subStep) {
        // ✅ v29.19: بحث أوسع عند غياب العنصر بالـ ID المباشر
        let banner = document.getElementById(`stage-flow-banner-${stepNum}`);
        if (!banner) {
            // محاولة البحث بـ class أو أي selector بديل
            banner = document.querySelector(`.stage-flow-banner[data-step="${stepNum}"]`) ||
                     document.querySelector(`[data-stage-banner="${stepNum}"]`);
        }
        if (!banner) return; // لا يوجد banner لهذه المرحلة — تجاهل بأمان
        const steps = banner.querySelectorAll('.stage-flow-step');
        if (!steps || steps.length === 0) return;
        steps.forEach((st, idx) => {
            const stepIndex = idx + 1;
            st.classList.remove('active', 'completed');
            if (stepIndex < subStep) {
                st.classList.add('completed');
            } else if (stepIndex === subStep) {
                st.classList.add('active');
            }
        });
    }

    // دوال توافقية للأكواد السابقة لضمان عدم حدوث أي خطأ استدعاء
    function pointTo() {}
    function triggerHotspotsSynchronizedPulse() {}
    function removeHotspotsSynchronizedPulse() {}
    function dismissTemporarily() {}

    return {
        init: init,
        updateStep: updateStep,
        checkLiveGuidanceState: checkLiveGuidanceState,
        onPointSelected: onPointSelected,
        guideStep1: renderStep1Bar,
        guideStep2: renderStep2Bar,
        guideStep3: renderStep3Bar,
        guideStep4: renderStep4Bar,
        guideStep5: renderStep5Bar,
        guideStep6: renderStep6Bar,
        guideAiTyping: guideAiTyping,
        hideAiTyping: hideAiTyping,
        guideDuaaModal: guideDuaaModal,
        onDuaaModalClosed: onDuaaModalClosed,
        guideAssessmentModal: guideAssessmentModal,
        onAssessmentModalClosed: onAssessmentModalClosed,
        onReportRendered: onReportRendered,
        onActionButtonClick: onActionButtonClick,
        updateStageFlowBanner: updateStageFlowBanner,
        pointTo: pointTo,
        triggerHotspotsSynchronizedPulse: triggerHotspotsSynchronizedPulse,
        removeHotspotsSynchronizedPulse: removeHotspotsSynchronizedPulse,
        dismissTemporarily: dismissTemporarily
    };
})();

if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', SmartGuidance.init);
} else {
    SmartGuidance.init();
}

window.SmartGuidance = SmartGuidance;
