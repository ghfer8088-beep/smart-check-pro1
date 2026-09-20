/**
 * Smart Check Pro 2.0 - منظومة البالون التفاعلي الذكي والتوجيه السلس لكبار السن
 * Smart Guidance Balloon & Spotlight Architecture v29.13
 * يرافق المريض في جميع المراحل (المجسم، الاستشارة، التقرير، الجلسات)
 * بتصميم زجاجي عائم (Floating Glassmorphism) لا يحجب النصوص أو التسميات
 * مع قفل دقيق للتحليل الطبي في الشات وهندسة متسلسلة لمرحلة التقرير
 */

const SmartGuidance = (function() {
    'use strict';

    let beaconEl = null;
    let currentTargetEl = null;
    let idleTimer = null;
    let step3NudgeTimer = null;
    let currentStep = 1;
    let isDismissedByUser = false;
    let isTemporarilyHidden = false;
    let isAiAnalyzing = false;
    let lastActionTime = Date.now();
    let currentGuidanceState = null;

    const IDLE_DELAY_MS = 5000; // 5 ثوانٍ من عدم التفاعل لتفعيل التوجيه التلقائي

    function init() {
        if (typeof window === 'undefined') return;
        createBeaconDOM();
        attachEventListeners();

        setTimeout(() => {
            const savedStep = parseInt(localStorage.getItem('smart_current_step') || '1', 10);
            updateStep(savedStep);
        }, 800);
    }

    function createBeaconDOM() {
        if (document.getElementById('smart-guidance-beacon')) {
            beaconEl = document.getElementById('smart-guidance-beacon');
            return;
        }

        beaconEl = document.createElement('div');
        beaconEl.id = 'smart-guidance-beacon';
        beaconEl.className = 'smart-guidance-beacon';
        beaconEl.setAttribute('role', 'tooltip');
        beaconEl.setAttribute('aria-live', 'polite');
        // تصميم البالون الزجاجي العائم الخفيف فوق اليد المشيرة
        beaconEl.innerHTML = `
            <div class="guidance-beacon-wrapper">
                <div class="guidance-bubble" id="guidance-bubble">
                    <span id="guidance-bubble-text" class="guidance-bubble-text">اضغط هنا للمتابعة</span>
                    <button type="button" class="guidance-dismiss-btn" title="إخفاء مؤقت" onclick="SmartGuidance.dismissTemporarily(event)">&times;</button>
                </div>
                <div class="guidance-hand-anim" id="guidance-hand-icon">👇</div>
            </div>
        `;
        document.body.appendChild(beaconEl);

        // إعادة توجيه النقرة تلقائياً للزر أو الحقل المستهدف (Click-Forwarding)
        beaconEl.addEventListener('click', (e) => {
            if (e.target.closest('.guidance-dismiss-btn')) return;
            if (currentTargetEl) {
                try {
                    if (typeof currentTargetEl.focus === 'function' && (currentTargetEl.tagName === 'INPUT' || currentTargetEl.tagName === 'TEXTAREA')) {
                        currentTargetEl.focus();
                    } else if (typeof currentTargetEl.click === 'function') {
                        currentTargetEl.click();
                    }
                    hideBeaconForInteraction();
                } catch (err) {
                    console.warn('Guidance forward click notice:', err);
                }
            }
        });
    }

    function attachEventListeners() {
        const userActivityEvents = ['touchstart', 'mousedown', 'keydown', 'input'];
        userActivityEvents.forEach(evt => {
            window.addEventListener(evt, () => {
                lastActionTime = Date.now();
                // أثناء تحليل الذكاء الاصطناعي لا نخفي اليد المشيرة للتحليل عند اللمس
                if (!isAiAnalyzing) {
                    hideBeaconForInteraction();
                }
                resetIdleTimer();
            }, { passive: true });
        });

        window.addEventListener('scroll', () => {
            lastActionTime = Date.now();
            resetIdleTimer();
            if (beaconEl && beaconEl.style.display !== 'none' && currentTargetEl) {
                positionBeaconAt(currentTargetEl, currentGuidanceState?.options || {});
            }
        }, { passive: true });

        window.addEventListener('resize', () => {
            if (currentTargetEl && beaconEl && beaconEl.style.display !== 'none') {
                positionBeaconAt(currentTargetEl, currentGuidanceState?.options || {});
            }
        }, { passive: true });
    }

    function resetIdleTimer() {
        if (idleTimer) clearTimeout(idleTimer);
        idleTimer = setTimeout(() => {
            onUserIdleTimeout();
        }, IDLE_DELAY_MS);
    }

    function onUserIdleTimeout() {
        if (isDismissedByUser) return;
        // إذا كان الطبيب يحلل الإجابة في الشات، يبقى التركيز حصراً على مؤشر التحليل
        if (isAiAnalyzing) {
            const typingEl = document.getElementById('ai-typing-indicator') || document.getElementById('ai-audio-typing-indicator');
            if (typingEl) {
                guideAiTyping(typingEl);
                return;
            }
        }
        isTemporarilyHidden = false;
        triggerCurrentStepGuidance(true);
    }

    function hideBeaconForInteraction() {
        if (!beaconEl || beaconEl.style.display === 'none') return;
        beaconEl.classList.add('guidance-fade-out');
        isTemporarilyHidden = true;
        setTimeout(() => {
            if (isTemporarilyHidden && beaconEl) {
                beaconEl.style.display = 'none';
                beaconEl.classList.remove('guidance-fade-out');
            }
        }, 220);
    }

    function dismissTemporarily(e) {
        if (e) e.stopPropagation();
        hideBeaconForInteraction();
        isDismissedByUser = true;
        setTimeout(() => { isDismissedByUser = false; }, 90000);
    }

    function pointTo(target, text, options = {}) {
        if (isDismissedByUser) return;
        isTemporarilyHidden = false;

        const el = (typeof target === 'string') ? document.querySelector(target) : target;
        if (!el || el.offsetParent === null) return;

        currentTargetEl = el;
        currentGuidanceState = { target, text, options };

        // إزالة هالة التمييز السابقة وإضافتها للعنصر المستهدف الحالي
        document.querySelectorAll('.guidance-target-highlight').forEach(x => {
            x.classList.remove('guidance-target-highlight');
        });
        if (!options.noTargetHighlight) {
            el.classList.add('guidance-target-highlight');
        }

        const bubbleEl = document.getElementById('guidance-bubble');
        const textEl = document.getElementById('guidance-bubble-text');
        const iconEl = document.getElementById('guidance-hand-icon');

        // دعم وضع اليد الصامتة بدون بالون نصي (مثل مؤشر تحليل الطبيب في الشات)
        if (options.noBubble || !text) {
            if (bubbleEl) bubbleEl.style.display = 'none';
        } else {
            if (bubbleEl) bubbleEl.style.display = 'inline-flex';
            if (textEl) textEl.textContent = text;
        }

        if (iconEl) iconEl.textContent = options.handIcon || '👇';

        if (options.autoScroll) {
            scrollElementIntoViewIfNeeded(el);
        }

        setTimeout(() => {
            positionBeaconAt(el, options);
            if (beaconEl) {
                beaconEl.style.display = 'flex';
                beaconEl.classList.remove('guidance-fade-out');
                beaconEl.classList.add('guidance-fade-in');
            }
        }, options.autoScroll ? 300 : 40);
    }

    function scrollElementIntoViewIfNeeded(el) {
        if (!el) return;
        const rect = el.getBoundingClientRect();
        const isInViewport = (
            rect.top >= 80 &&
            rect.bottom <= (window.innerHeight || document.documentElement.clientHeight) - 80
        );

        if (!isInViewport) {
            el.scrollIntoView({ behavior: 'smooth', block: 'center' });
        }
    }

    // حساب إحداثيات موضع البالون التفاعلي واليد دون حجب التسميات أو النصوص المجاورة
    function positionBeaconAt(el, options = {}) {
        if (!beaconEl || !el) return;
        const rect = el.getBoundingClientRect();
        const scrollY = window.pageYOffset || document.documentElement.scrollTop;
        const scrollX = window.pageXOffset || document.documentElement.scrollLeft;

        const placement = options.placement || 'top';
        let top = 0;
        let left = 0;

        if (placement === 'top') {
            // رأس إصبع اليد يلامس الحافة العلوية للهدف بفارق 2 بكسل
            top = rect.top + scrollY - 2;
            left = rect.left + scrollX + (rect.width / 2);
        } else if (placement === 'bottom') {
            top = rect.bottom + scrollY + 45;
            left = rect.left + scrollX + (rect.width / 2);
        } else {
            top = rect.top + scrollY - 6;
            left = rect.left + scrollX + (rect.width / 2);
        }

        // إزاحة ذكية إذا كان الحقل مدخلاً نصياً لتفادي تغطية عنوان الحقل (Label)
        if (options.labelAvoidance && (el.tagName === 'INPUT' || el.tagName === 'TEXTAREA')) {
            // توجيه البالون ليكون مرتكناً بجانب الحقل أو بأعلى زاويته الجانبية
            left = rect.left + scrollX + Math.min(rect.width * 0.75, rect.width - 40);
        }

        const maxLeft = (window.innerWidth || 360) - 140;
        left = Math.max(130, Math.min(left, maxLeft));
        top = Math.max(10, top);

        beaconEl.style.top = `${Math.round(top)}px`;
        beaconEl.style.left = `${Math.round(left)}px`;
    }

    function updateStageFlowBanner(stepNum, subStep) {
        const banner = document.getElementById(`stage-flow-banner-${stepNum}`);
        if (!banner) return;
        const steps = banner.querySelectorAll('.stage-flow-step');
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

    // =========================================================================
    // التوجيه السريري المتسلسل الذكي لكل مرحلة من المراحل
    // =========================================================================

    function updateStep(stepNum) {
        currentStep = stepNum;
        isDismissedByUser = false;
        isTemporarilyHidden = false;
        isAiAnalyzing = false;
        if (step3NudgeTimer) clearTimeout(step3NudgeTimer);
        resetIdleTimer();

        setTimeout(() => {
            triggerCurrentStepGuidance(false);
        }, 450);
    }

    function triggerCurrentStepGuidance(isAutoScrollNudge = false) {
        if (isDismissedByUser) return;

        switch (currentStep) {
            case 1:
                guideStep1(isAutoScrollNudge);
                break;
            case 2:
                guideStep2(isAutoScrollNudge);
                break;
            case 3:
                guideStep3(isAutoScrollNudge);
                break;
            case 4:
                guideStep4(isAutoScrollNudge);
                break;
            case 5:
                guideStep5(isAutoScrollNudge);
                break;
            case 6:
                guideStep6(isAutoScrollNudge);
                break;
            default:
                break;
        }
    }

    // -------------------------------------------------------------------------
    // المرحلة 1: المجسم وتحديد موضع الألم
    // -------------------------------------------------------------------------
    function guideStep1(autoScroll = false) {
        const hasPoint = typeof window.currentSelectedPoint !== 'undefined' && window.currentSelectedPoint;
        const nextBtn = document.getElementById('btn-goto-step2');

        if (hasPoint && nextBtn && nextBtn.offsetParent !== null) {
            removeHotspotsSynchronizedPulse();
            updateStageFlowBanner(1, 2);
            pointTo(nextBtn, 'ممتاز! اضغط هنا الآن لمتابعة الفحص السريري 👇', {
                handIcon: '👇',
                placement: 'top',
                autoScroll: autoScroll
            });
            return;
        }

        updateStageFlowBanner(1, 1);
        // التحقق وضمان رسم النقاط على المجسم فوراً إن لم تكن مرسومة
        if (document.querySelectorAll('.anatomy-hotspot').length === 0 && typeof switchAnatomyView === 'function') {
            const activeView = document.getElementById('btn-view-back')?.classList.contains('active') ? 'back' : 'front';
            switchAnatomyView(activeView);
        }

        const anatomyViewport = document.querySelector('.skeleton-viewport') || document.querySelector('.anatomy-card');
        if (anatomyViewport) {
            triggerHotspotsSynchronizedPulse();
            pointTo(anatomyViewport, 'انقر على موضع ألمك من النقاط المضيئة على المجسم 👇', {
                handIcon: '👇',
                placement: 'top',
                noTargetHighlight: true,
                autoScroll: autoScroll
            });
        }
    }

    function triggerHotspotsSynchronizedPulse() {
        document.querySelectorAll('.anatomy-hotspot').forEach(p => {
            p.classList.add('guidance-pulse-all');
        });
    }

    function removeHotspotsSynchronizedPulse() {
        document.querySelectorAll('.anatomy-hotspot').forEach(p => {
            p.classList.remove('guidance-pulse-all');
        });
    }

    function onPointSelected(point) {
        removeHotspotsSynchronizedPulse();
        updateStageFlowBanner(1, 2);
        const nextBtn = document.getElementById('btn-goto-step2');
        if (nextBtn) {
            setTimeout(() => {
                pointTo(nextBtn, 'ممتاز! اضغط هنا الآن لمتابعة الفحص السريري 👇', {
                    handIcon: '👇',
                    placement: 'top',
                    autoScroll: true
                });
            }, 200);
        }
    }

    // -------------------------------------------------------------------------
    // المرحلة 2: الاستشارة السريرية وحوار الذكاء الاصطناعي
    // -------------------------------------------------------------------------
    function guideStep2(autoScroll = false) {
        // إذا كان الطبيب يحلل الإجابة حالياً: قفل اليد حصراً على مؤشر التحليل داخل الشات
        const typingEl = document.getElementById('ai-typing-indicator') || document.getElementById('ai-audio-typing-indicator');
        if (isAiAnalyzing || (typingEl && typingEl.offsetParent !== null)) {
            if (typingEl) {
                isAiAnalyzing = true;
                pointTo(typingEl, '', {
                    handIcon: '👇',
                    placement: 'top',
                    noBubble: true,
                    autoScroll: false
                });
            }
            return;
        }

        // 1. فحص بطاقة المؤشرات الحيوية الملكية في بداية الشات
        const vitalsCard = document.getElementById('royal-chat-vitals-card');
        if (vitalsCard && vitalsCard.offsetParent !== null) {
            updateStageFlowBanner(2, 1);
            const nameIn = document.getElementById('chat-vitals-name');
            const submitVitalsBtn = vitalsCard.querySelector('button[onclick*="submitChatRoyalVitals"]');
            if (nameIn && !nameIn.value.trim()) {
                pointTo(nameIn, 'تفضل بكتابة اسمك الكريم هنا 👤', {
                    handIcon: '👇',
                    placement: 'top',
                    labelAvoidance: true,
                    autoScroll: autoScroll
                });
                return;
            } else if (submitVitalsBtn) {
                pointTo(submitVitalsBtn, 'اضغط هنا لاعتماد مؤشراتك وبدء الحوار الطبي 👇', {
                    handIcon: '👇',
                    placement: 'top',
                    autoScroll: autoScroll
                });
                return;
            }
        }

        // 2. فحص زر الانتقال المباشر للتقرير الطبي (عند انتهاء الفحص السريري)
        const directReportBtn = document.querySelector('#chat-direct-report-button-box button');
        if (directReportBtn && directReportBtn.offsetParent !== null) {
            updateStageFlowBanner(2, 3);
            pointTo(directReportBtn, 'اضغط هنا لمشاهدة تقريرك الطبي وتشخيصك المعتمد 📄', {
                handIcon: '👇',
                placement: 'top',
                autoScroll: true
            });
            return;
        }

        // 3. أثناء الحوار السريري: توجيه لطيف دون إزعاج
        const chatInput = document.getElementById('ai-chat-input');
        const sendBtn = document.getElementById('ai-chat-send-btn');
        if (chatInput && chatInput.offsetParent !== null && !chatInput.disabled) {
            updateStageFlowBanner(2, 2);
            if (chatInput.value.trim() && sendBtn) {
                pointTo(sendBtn, 'اضغط هنا لإرسال إجابتك للطبيب 👇', {
                    handIcon: '👇',
                    placement: 'top',
                    autoScroll: autoScroll
                });
            } else {
                pointTo(chatInput, 'أجب الطبيب هنا أو استخدم التسجيل الصوتي 🎙️', {
                    handIcon: '👇',
                    placement: 'top',
                    labelAvoidance: true,
                    autoScroll: autoScroll
                });
            }
            return;
        }

        // 4. نمط الفحص السريع بالخيارات
        const nextQBtn = document.getElementById('btn-next-clinical-q');
        const firstOption = document.querySelector('#step-section-2 .q-option-card, #step-section-2 .diagnostic-card');
        if (nextQBtn && nextQBtn.offsetParent !== null && !nextQBtn.disabled) {
            pointTo(nextQBtn, 'اضغط هنا للانتقال للسؤال التالي 👇', {
                handIcon: '👇',
                placement: 'top',
                autoScroll: autoScroll
            });
        } else if (firstOption && firstOption.offsetParent !== null) {
            pointTo(firstOption, 'اختر الإجابة المناسبة لحالتك هنا 👇', {
                handIcon: '👇',
                placement: 'top',
                autoScroll: autoScroll
            });
        }
    }

    // يد إرشادية بدون نص تشير حصراً إلى مؤشر تحضير الطبيب للرد
    function guideAiTyping(typingEl) {
        isAiAnalyzing = true;
        if (!typingEl) typingEl = document.getElementById('ai-typing-indicator') || document.getElementById('ai-audio-typing-indicator');
        if (!typingEl) return;
        pointTo(typingEl, '', {
            handIcon: '👇',
            placement: 'top',
            noBubble: true,
            autoScroll: false
        });
    }

    function hideAiTyping() {
        isAiAnalyzing = false;
        hideBeaconForInteraction();
    }

    // -------------------------------------------------------------------------
    // المرحلة 3: التقرير الطبي والتشخيص (تسلسل ذكي من 3 خطوات)
    // -------------------------------------------------------------------------
    function guideStep3(autoScroll = false) {
        if (step3NudgeTimer) clearTimeout(step3NudgeTimer);
        updateStageFlowBanner(3, 1);

        // هل التقرير لا يزال قيد الإعداد والتحضير؟
        const loadingCard = document.querySelector('#clinical-report-container h3, #clinical-report-container .loading-report-box');
        const reportMasterCard = document.querySelector('#clinical-report-container .report-master-card');

        if (loadingCard && !reportMasterCard) {
            // توجيه اليد والبالون إلى مساحة تحضير التقرير
            pointTo(loadingCard, '⏳ تقريرك الطبي وتشخيصك قيد التحضير هنا في هذه المساحة... لحظات قليلة', {
                handIcon: '👇',
                placement: 'top',
                autoScroll: false
            });
            return;
        }

        // إذا كان التقرير قد فُتح بالفعل، نوجه المريض لبطاقة التشخيص
        focusOnReportDiagnosis();
    }

    // تركيز الإرشاد على بطاقة التشخيص الطبي المعتمد عند صدور التقرير
    function onReportRendered(data) {
        if (currentStep !== 3) return;
        setTimeout(() => {
            focusOnReportDiagnosis();
        }, 200);
    }

    function focusOnReportDiagnosis() {
        updateStageFlowBanner(3, 1);
        const diagnosisBadge = document.querySelector('#clinical-report-container .report-master-card, #clinical-report-container h2, #clinical-report-container .report-diagnosis-badge, #clinical-report-container');
        const activateBtn = document.getElementById('btn-activate-plan-royal') || document.querySelector('.btn-plan-royal-card');

        if (diagnosisBadge) {
            pointTo(diagnosisBadge, '🩺 هذا هو تشخيص حالتك وخلاصة فحصك السريري.. تفضل بقراءته بعناية', {
                handIcon: '👇',
                placement: 'top',
                autoScroll: true
            });
        }

        // منح المريض مهلة كافية (10 ثوانٍ) لقراءة التشخيص ثم توجيهه لزر تفعيل الخطة المجانية
        if (step3NudgeTimer) clearTimeout(step3NudgeTimer);
        step3NudgeTimer = setTimeout(() => {
            if (currentStep === 3 && activateBtn && activateBtn.offsetParent !== null) {
                updateStageFlowBanner(3, 2);
                pointTo(activateBtn, 'اضغط هنا لبدء تمارين اليوم الأول وتفعيل خطتك المجانية 👇', {
                    handIcon: '👇',
                    placement: 'top',
                    autoScroll: true
                });
            }
        }, 10000);
    }

    // توجيه زر نافذة الدعاء والصدقة الجارية
    function guideDuaaModal() {
        const duaaBtn = document.getElementById('btn-confirm-duaa');
        if (duaaBtn && duaaBtn.offsetParent !== null) {
            pointTo(duaaBtn, 'اضغط هنا لبدء تمارينك بالدعاء والبركة 🤲', {
                handIcon: '👇',
                placement: 'top',
                autoScroll: true
            });
        }
    }

    // -------------------------------------------------------------------------
    // المرحلة 4: تمارين اليوم الأول (مستقلة)
    // -------------------------------------------------------------------------
    function guideStep4(autoScroll = false) {
        const completeBtn = document.querySelector('#step-section-4 button[onclick*="openSessionAssessmentModal"]') || document.getElementById('btn-complete-day1-session');
        const firstTimerBtn = document.querySelector('#step-section-4 .btn-exercise-timer');

        // إذا كانت التمارين قد بدأت أو جاهزة للإتمام
        if (completeBtn && completeBtn.offsetParent !== null && completeBtn.classList.contains('ready-to-complete')) {
            updateStageFlowBanner(4, 2);
            pointTo(completeBtn, 'اضغط هنا لتوثيق إنجاز تمارين اليوم الأول وبدء فترة الاستشفاء ✅', {
                handIcon: '👇',
                placement: 'top',
                autoScroll: autoScroll
            });
            return;
        }

        // التوجيه للبدء بمؤقت التمرين الأول
        if (firstTimerBtn && firstTimerBtn.offsetParent !== null) {
            updateStageFlowBanner(4, 1);
            pointTo(firstTimerBtn, 'اضغط هنا لبدء مؤقت تمرينك الأول والتوجيه الصوتي ⏱️', {
                handIcon: '👇',
                placement: 'top',
                autoScroll: autoScroll
            });
            return;
        }

        if (completeBtn && completeBtn.offsetParent !== null) {
            updateStageFlowBanner(4, 2);
            pointTo(completeBtn, 'اضغط هنا لتوثيق إنجاز تمارين اليوم الأول وبدء الاستشفاء ✅', {
                handIcon: '👇',
                placement: 'top',
                autoScroll: autoScroll
            });
        }
    }

    // -------------------------------------------------------------------------
    // المرحلة 5: متابعة الجلسات (2 إلى 7)
    // -------------------------------------------------------------------------
    function guideStep5(autoScroll = false) {
        const activeDayBtn = document.querySelector('.btn-start-current-day, .day-session-active-btn, .btn-pacer-trigger');
        if (activeDayBtn && activeDayBtn.offsetParent !== null) {
            pointTo(activeDayBtn, 'اضغط هنا لمتابعة جلسة اليوم المقررة 🎯', {
                handIcon: '👇',
                placement: 'top',
                autoScroll: autoScroll
            });
        }
    }

    // -------------------------------------------------------------------------
    // المرحلة 6: وثيقة التعافي والإنهاء
    // -------------------------------------------------------------------------
    function guideStep6(autoScroll = false) {
        const certBtn = document.querySelector('.btn-download-cert, .btn-whatsapp-consult-cert');
        if (certBtn && certBtn.offsetParent !== null) {
            pointTo(certBtn, 'مبارك تعافيك! اضغط هنا لتحميل وثيقتك الرسمية 📜', {
                handIcon: '👇',
                placement: 'top',
                autoScroll: autoScroll
            });
        }
    }

    return {
        init: init,
        updateStep: updateStep,
        onPointSelected: onPointSelected,
        pointTo: pointTo,
        dismissTemporarily: dismissTemporarily,
        guideAiTyping: guideAiTyping,
        hideAiTyping: hideAiTyping,
        guideDuaaModal: guideDuaaModal,
        onReportRendered: onReportRendered,
        updateStageFlowBanner: updateStageFlowBanner,
        refreshCurrentGuidance: () => triggerCurrentStepGuidance(true)
    };
})();

if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', SmartGuidance.init);
} else {
    SmartGuidance.init();
}

window.SmartGuidance = SmartGuidance;
