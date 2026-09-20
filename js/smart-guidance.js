/**
 * Smart Check Pro 2.0 - محرك اليد الإرشادية الذكية والتمرير التلقائي لكبار السن
 * Smart Guidance & Auto-Focus System v29.12
 * يرافق المريض في جميع المراحل (المجسم، الأسئلة، البيانات، التقرير، الجلسات)
 * مع إعادة توجيه النقرات (Click-Forwarding) والمؤشرات التفاعلية لأشرطة المسار
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
    let lastActionTime = Date.now();
    let currentGuidanceState = null;

    const IDLE_DELAY_MS = 5000; // 5 ثوانٍ من عدم التفاعل لتفعيل التوجيه والتمرير التلقائي

    // تهيئة المحرك الإرشادي
    function init() {
        if (typeof window === 'undefined') return;
        createBeaconDOM();
        attachEventListeners();
        
        // بدء المراقبة للخطوة الحالية فور تحميل الصفحة
        setTimeout(() => {
            const savedStep = parseInt(localStorage.getItem('smart_current_step') || '1', 10);
            updateStep(savedStep);
        }, 800);
    }

    // إنشاء عنصر اليد الإرشادية في DOM
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
        // الفقاعة في الأعلى، واليد المشيرة في الأسفل مباشرة فوق الزر
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

        // إعادة توجيه النقرة تلقائياً للزر المستهدف في حال نقر المريض على اليد أو الفقاعة
        beaconEl.addEventListener('click', (e) => {
            if (e.target.closest('.guidance-dismiss-btn')) return;
            if (currentTargetEl && typeof currentTargetEl.click === 'function') {
                try {
                    currentTargetEl.click();
                    hideBeaconForInteraction();
                } catch (err) {
                    console.warn('Guidance forward click error:', err);
                }
            }
        });
    }

    // ربط مستمعات الأحداث للتفاعل والتمرير
    function attachEventListeners() {
        const userActivityEvents = ['touchstart', 'mousedown', 'keydown', 'input'];
        userActivityEvents.forEach(evt => {
            window.addEventListener(evt, () => {
                lastActionTime = Date.now();
                hideBeaconForInteraction();
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
        }, 250);
    }

    function dismissTemporarily(e) {
        if (e) e.stopPropagation();
        hideBeaconForInteraction();
        isDismissedByUser = true;
        setTimeout(() => { isDismissedByUser = false; }, 120000);
    }

    function pointTo(target, text, options = {}) {
        if (isDismissedByUser) return;
        isTemporarilyHidden = false;

        const el = (typeof target === 'string') ? document.querySelector(target) : target;
        if (!el) return;

        currentTargetEl = el;
        currentGuidanceState = { target, text, options };

        document.querySelectorAll('.guidance-target-highlight').forEach(x => {
            x.classList.remove('guidance-target-highlight');
        });

        el.classList.add('guidance-target-highlight');

        const bubbleEl = document.getElementById('guidance-bubble');
        const textEl = document.getElementById('guidance-bubble-text');
        const iconEl = document.getElementById('guidance-hand-icon');

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
        }, options.autoScroll ? 350 : 50);
    }

    function scrollElementIntoViewIfNeeded(el) {
        if (!el) return;
        const rect = el.getBoundingClientRect();
        const isInViewport = (
            rect.top >= 70 &&
            rect.bottom <= (window.innerHeight || document.documentElement.clientHeight) - 70
        );

        if (!isInViewport) {
            el.scrollIntoView({ behavior: 'smooth', block: 'center' });
        }
    }

    // حساب إحداثيات موضع اليد الإرشادية بالنسبة للعنصر (رأس الإصبع 2-4px فوق الزر مباشرة)
    function positionBeaconAt(el, options = {}) {
        if (!beaconEl || !el) return;
        const rect = el.getBoundingClientRect();
        const scrollY = window.pageYOffset || document.documentElement.scrollTop;
        const scrollX = window.pageXOffset || document.documentElement.scrollLeft;

        const placement = options.placement || 'top';
        let top = 0;
        let left = 0;

        if (placement === 'top') {
            top = rect.top + scrollY - 2;
            left = rect.left + scrollX + (rect.width / 2);
        } else if (placement === 'bottom') {
            top = rect.bottom + scrollY + 40;
            left = rect.left + scrollX + (rect.width / 2);
        } else {
            top = rect.top + scrollY - 10;
            left = rect.left + scrollX + (rect.width / 2);
        }

        const maxLeft = (window.innerWidth || 360) - 150;
        left = Math.max(140, Math.min(left, maxLeft));
        top = Math.max(10, top);

        beaconEl.style.top = `${Math.round(top)}px`;
        beaconEl.style.left = `${Math.round(left)}px`;
    }

    // تحديث أشرطة مسار المرحلة
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
    // منطق التوجيه الذكي المخصص لكل خطوة من خطوات النظام
    // =========================================================================

    function updateStep(stepNum) {
        currentStep = stepNum;
        isDismissedByUser = false;
        isTemporarilyHidden = false;
        if (step3NudgeTimer) clearTimeout(step3NudgeTimer);
        resetIdleTimer();

        setTimeout(() => {
            triggerCurrentStepGuidance(false);
        }, 500);
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
    // الخطوة 1: المجسم واختيار موضع الألم
    // -------------------------------------------------------------------------
    function guideStep1(autoScroll = false) {
        const hasPoint = typeof window.currentSelectedPoint !== 'undefined' && window.currentSelectedPoint;
        const nextBtn = document.getElementById('btn-goto-step2');

        if (hasPoint && nextBtn) {
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
        const anatomyViewport = document.querySelector('.skeleton-viewport') || document.querySelector('.anatomy-card');
        if (anatomyViewport) {
            triggerHotspotsSynchronizedPulse();
            pointTo(anatomyViewport, 'انقر على موضع ألمك من النقاط المضيئة على المجسم 👇', {
                handIcon: '👇',
                placement: 'top',
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
            }, 250);
        }
    }

    // -------------------------------------------------------------------------
    // الخطوة 2: الاستشارة السريرية وحوار الذكاء الاصطناعي
    // -------------------------------------------------------------------------
    function guideStep2(autoScroll = false) {
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

        // 2. فحص زر الانتقال المباشر للتقرير الطبي (عند انتهاء الفحص)
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

        // 3. أثناء الحوار السريري: توجيه لحقل الكتابة أو زر الإرسال
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
                    autoScroll: autoScroll
                });
            }
            return;
        }

        // 4. نمط الفحص السريع بالخيارات إن كان مفصولاً
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

    // يد إرشادية بدون نص تشير إلى مؤشر تحضير الطبيب للإجابة
    function guideAiTyping(typingEl) {
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
        hideBeaconForInteraction();
    }

    // -------------------------------------------------------------------------
    // الخطوة 3: التقرير الطبي الشامل وتفعيل الخطة
    // -------------------------------------------------------------------------
    function guideStep3(autoScroll = false) {
        const activateBtn = document.getElementById('btn-activate-plan-royal') || document.querySelector('.btn-plan-royal-card');
        const reportHeader = document.querySelector('#clinical-report-container .report-master-card, #clinical-report-container h2, #clinical-report-container .royal-report-header, #clinical-report-container');

        updateStageFlowBanner(3, 1);

        // توجيه المريض أولاً إلى أعلى التقرير لقراءة التشخيص
        if (reportHeader) {
            pointTo(reportHeader, 'هنا ملخص تقريرك الطبي وتشخيصك المعتمد 🩺 استعرض نتائج فحصك', {
                handIcon: '👇',
                placement: 'top',
                autoScroll: false
            });
        }

        // بعد مهلة 8 ثوانٍ لإتاحة الفرصة للمريض للاطلاع على التشخيص، نوجهه لزر تفعيل الخطة واليوم الأول
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
        }, 8000);
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
    // الخطوة 4: الجلسة الأولى (مستقلة)
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

        // إن لم يتوفر مؤقت، وجه لزر التوثيق
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
    // الخطوة 5: متابعة الجلسات (2 إلى 7)
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
    // الخطوة 6: وثيقة التعافي والإنهاء
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
