/**
 * Smart Check Pro 2.0 - محرك اليد الإرشادية الذكية والتمرير التلقائي لكبار السن
 * Smart Guidance & Auto-Focus System
 * يرافق المريض في جميع المراحل (المجسم، الأسئلة، البيانات، التقرير، الجلسات)
 * ويرشده بدقة للأزرار والمواضع المطلوبة مع التمرير التلقائي عند التردد (5 ثوانٍ)
 */

const SmartGuidance = (function() {
    'use strict';

    let beaconEl = null;
    let currentTargetEl = null;
    let idleTimer = null;
    let autoScrollTimer = null;
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
        beaconEl.innerHTML = `
            <div class="guidance-beacon-wrapper">
                <div class="guidance-hand-anim" id="guidance-hand-icon">👇</div>
                <div class="guidance-bubble">
                    <span id="guidance-bubble-text" class="guidance-bubble-text">اضغط هنا للمتابعة</span>
                    <button type="button" class="guidance-dismiss-btn" title="إخفاء مؤقت" onclick="SmartGuidance.dismissTemporarily(event)">&times;</button>
                </div>
            </div>
        `;
        document.body.appendChild(beaconEl);
    }

    // ربط مستمعات الأحداث للتفاعل والتمرير
    function attachEventListeners() {
        // أي نقرة أو كتابة أو لمس تخفي اليد فوراً لمنع حجب الرؤية
        const userActivityEvents = ['touchstart', 'mousedown', 'keydown', 'input'];
        userActivityEvents.forEach(evt => {
            window.addEventListener(evt, () => {
                lastActionTime = Date.now();
                hideBeaconForInteraction();
                resetIdleTimer();
            }, { passive: true });
        });

        // متابعة التمرير اليدوي من المستخدم
        window.addEventListener('scroll', () => {
            lastActionTime = Date.now();
            resetIdleTimer();
            // تحديث موقع اليد إن كانت ظاهرة
            if (beaconEl && beaconEl.style.display !== 'none' && currentTargetEl) {
                positionBeaconAt(currentTargetEl);
            }
        }, { passive: true });

        // إعادة الضبط عند تغيير حجم الشاشة أو تدوير الهاتف
        window.addEventListener('resize', () => {
            if (currentTargetEl && beaconEl && beaconEl.style.display !== 'none') {
                positionBeaconAt(currentTargetEl);
            }
        }, { passive: true });
    }

    // إعادة ضبط مؤقت الانتظار الذكي (5 ثوانٍ)
    function resetIdleTimer() {
        if (idleTimer) clearTimeout(idleTimer);
        idleTimer = setTimeout(() => {
            // إذا كان المريض متوقفاً لأكثر من 5 ثوانٍ، شغل التوجيه المناسب للمرحلة
            onUserIdleTimeout();
        }, IDLE_DELAY_MS);
    }

    // تنفيذ التوجيه والتمرير التلقائي عند مرور 5 ثوانٍ من التردد
    function onUserIdleTimeout() {
        if (isDismissedByUser) return;
        isTemporarilyHidden = false;
        triggerCurrentStepGuidance(true); // true = مع التمرير التلقائي
    }

    // إخفاء اليد مؤقتاً عند بدء المريض بالتفاعل
    function hideBeaconForInteraction() {
        if (!beaconEl || beaconEl.style.display === 'none') return;
        beaconEl.classList.add('guidance-fade-out');
        isTemporarilyHidden = true;
        setTimeout(() => {
            if (isTemporarilyHidden && beaconEl) {
                beaconEl.style.display = 'none';
                beaconEl.classList.remove('guidance-fade-out');
            }
        }, 300);
    }

    // إخفاء اليد يدpipeاً من زر الإغلاق
    function dismissTemporarily(e) {
        if (e) e.stopPropagation();
        hideBeaconForInteraction();
        isDismissedByUser = true;
        // إعادة التفعيل تلقائياً بعد دقيقتين أو عند الانتقال لخطوة جديدة
        setTimeout(() => { isDismissedByUser = false; }, 120000);
    }

    // إظهار وتوجيه اليد لعنصر محدد
    function pointTo(target, text, options = {}) {
        if (isDismissedByUser) return;
        isTemporarilyHidden = false;

        const el = (typeof target === 'string') ? document.querySelector(target) : target;
        if (!el) return;

        currentTargetEl = el;
        currentGuidanceState = { target, text, options };

        // إزالة الهالة السابقة من أي عنصر آخر
        document.querySelectorAll('.guidance-target-highlight').forEach(x => {
            x.classList.remove('guidance-target-highlight');
        });

        // إضافة وميض هالة مضيئة للعنصر المستهدف لتمييزه فوراً
        el.classList.add('guidance-target-highlight');

        // تحديث النص والرمز التعبيري لليد
        const textEl = document.getElementById('guidance-bubble-text');
        const iconEl = document.getElementById('guidance-hand-icon');
        if (textEl) textEl.textContent = text || 'اضغط هنا';
        if (iconEl) iconEl.textContent = options.handIcon || '👇';

        // التمرير التلقائي إن طُلب أو إن كان العنصر خارج الرؤية
        if (options.autoScroll) {
            scrollElementIntoViewIfNeeded(el);
        }

        // تموضع اليد بعد استقرار التمرير
        setTimeout(() => {
            positionBeaconAt(el, options);
            if (beaconEl) {
                beaconEl.style.display = 'flex';
                beaconEl.classList.remove('guidance-fade-out');
                beaconEl.classList.add('guidance-fade-in');
            }
        }, options.autoScroll ? 350 : 50);
    }

    // التمرير السلس الذكي إذا كان العنصر خارج نافذة العرض
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

    // حساب إحداثيات موضع اليد الإرشادية بالنسبة للعنصر
    function positionBeaconAt(el, options = {}) {
        if (!beaconEl || !el) return;
        const rect = el.getBoundingClientRect();
        const scrollY = window.pageYOffset || document.documentElement.scrollTop;
        const scrollX = window.pageXOffset || document.documentElement.scrollLeft;

        const placement = options.placement || 'top'; // top, bottom, center
        let top = 0;
        let left = 0;

        if (placement === 'top') {
            top = rect.top + scrollY - 65;
            left = rect.left + scrollX + (rect.width / 2);
        } else if (placement === 'bottom') {
            top = rect.bottom + scrollY + 12;
            left = rect.left + scrollX + (rect.width / 2);
        } else { // center / floating
            top = rect.top + scrollY - 50;
            left = rect.left + scrollX + (rect.width / 2);
        }

        // ضمان عدم خروج اليد خارج حدود الشاشة في الموبايل
        const maxLeft = (window.innerWidth || 360) - 150;
        left = Math.max(140, Math.min(left, maxLeft));
        top = Math.max(10, top);

        beaconEl.style.top = `${Math.round(top)}px`;
        beaconEl.style.left = `${Math.round(left)}px`;
    }

    // =========================================================================
    // منطق التوجيه الذكي المخصص لكل خطوة من خطوات النظام
    // =========================================================================

    function updateStep(stepNum) {
        currentStep = stepNum;
        isDismissedByUser = false;
        isTemporarilyHidden = false;
        resetIdleTimer();

        // تشغيل التوجيه المبدئي للخطوة الحالية بعد نصف ثانية من ظهورها
        setTimeout(() => {
            triggerCurrentStepGuidance(false);
        }, 600);
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

        // إذا كان المريض قد اختار نقطة ألم بالفعل -> وجهه مباشرة لزر المتابعة الأخضر
        if (hasPoint && nextBtn) {
            removeHotspotsSynchronizedPulse();
            pointTo(nextBtn, 'ممتاز! اضغط هنا الآن لمتابعة الفحص السريري 👇', {
                handIcon: '👇',
                placement: 'top',
                autoScroll: autoScroll
            });
            return;
        }

        // إذا لم يختر نقطة بعد -> وضع اليد فوق المجسم بنعومة مع نبض موحد لكافة النقاط
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

    // نبض موحد لكافة نقاط المجسم ليظهر للجميع أنها قابلة للاختيار
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

    // يتم استدعاء هذه الدالة فور اختيار المريض لأي نقطة ألم
    function onPointSelected(point) {
        removeHotspotsSynchronizedPulse();
        const nextBtn = document.getElementById('btn-goto-step2');
        if (nextBtn) {
            // إظهار اليد فوراً تؤشر للزر الأخضر مع تمرير تلقائي إليه
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
    // الخطوة 2: الاستشارة السريرية وحوار الذكاء الاصطناعي أو الفحص السريع
    // -------------------------------------------------------------------------
    function guideStep2(autoScroll = false) {
        // 1. هل نحن في مرحلة إدخال بيانات المريض (الاسم / الهاتف)؟
        const nameInput = document.getElementById('patient-name') || document.getElementById('chat-patient-name-input');
        const phoneInput = document.getElementById('patient-phone') || document.getElementById('chat-patient-phone-input');
        const reportSubmitBtn = document.getElementById('btn-submit-assessment-final') || document.getElementById('btn-generate-report') || document.querySelector('.btn-submit-report');

        if (nameInput && nameInput.offsetParent !== null && !nameInput.value.trim()) {
            pointTo(nameInput, 'تفضل بكتابة اسمك الكريم هنا ✍️', {
                handIcon: '👇',
                placement: 'top',
                autoScroll: autoScroll
            });
            return;
        }

        if (phoneInput && phoneInput.offsetParent !== null && !phoneInput.value.trim() && nameInput && nameInput.value.trim()) {
            pointTo(phoneInput, 'تفضل بكتابة رقم هاتفك هنا 📱', {
                handIcon: '👇',
                placement: 'top',
                autoScroll: autoScroll
            });
            return;
        }

        if (reportSubmitBtn && reportSubmitBtn.offsetParent !== null && nameInput && nameInput.value.trim() && phoneInput && phoneInput.value.trim()) {
            pointTo(reportSubmitBtn, 'اضغط هنا الآن لإصدار تقريرك الطبي الشامل فوراً 👇', {
                handIcon: '👇',
                placement: 'top',
                autoScroll: autoScroll
            });
            return;
        }

        // 2. هل هناك خيارات إجابة سريعة في المحادثة؟
        const quickOption = document.querySelector('#chat-quick-options button, .chat-quick-reply-btn, .ai-quick-chip');
        if (quickOption && quickOption.offsetParent !== null) {
            pointTo(quickOption, 'اختر الإجابة التي تصف ما تشعر به هنا 👇', {
                handIcon: '👇',
                placement: 'top',
                autoScroll: autoScroll
            });
            return;
        }

        // 3. هل هناك صندوق كتابة للرسالة؟
        const chatInput = document.getElementById('chat-user-input');
        const sendBtn = document.getElementById('btn-send-chat-msg');
        if (chatInput && chatInput.offsetParent !== null) {
            if (chatInput.value.trim() && sendBtn) {
                pointTo(sendBtn, 'اضغط هنا لإرسال إجابتك للطبيب 👇', {
                    handIcon: '👇',
                    placement: 'top',
                    autoScroll: autoScroll
                });
            } else {
                pointTo(chatInput, 'أجب الطبيب الافتراضي هنا أو اختر من الخيارات 👇', {
                    handIcon: '👇',
                    placement: 'top',
                    autoScroll: autoScroll
                });
            }
            return;
        }

        // 4. في نمط الفحص السريع بالخيارات:
        const firstOption = document.querySelector('#step-section-2 .q-option-card, #step-section-2 .diagnostic-card');
        const nextQBtn = document.getElementById('btn-next-clinical-q');
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

    // -------------------------------------------------------------------------
    // الخطوة 3: التقرير الطبي الشامل وتفعيل الخطة
    // -------------------------------------------------------------------------
    function guideStep3(autoScroll = false) {
        const activateBtn = document.getElementById('btn-activate-plan-royal') || document.querySelector('.btn-plan-royal-card');
        const reportHeader = document.querySelector('#clinical-report-container h2, #clinical-report-container .royal-report-header, #clinical-report-container .report-master-card');

        // أولاً: إذا كان التقرير قد فُتح للتو، نلفت نظر المريض لموضع التقرير والتشخيص
        if (!autoScroll && reportHeader) {
            pointTo(reportHeader, 'هنا ملخص تقريرك الطبي وتشخيصك المعتمد 🩺', {
                handIcon: '👇',
                placement: 'top',
                autoScroll: false
            });

            // بعد 4 ثوانٍ نقوم بتوجيهه تلقائياً إلى زر بدء تمارين اليوم الأول بالأسفل
            setTimeout(() => {
                if (currentStep === 3 && activateBtn) {
                    pointTo(activateBtn, 'اضغط هنا لبدء تمارين اليوم الأول وتفعيل خطتك المجانية 👇', {
                        handIcon: '👇',
                        placement: 'top',
                        autoScroll: true
                    });
                }
            }, 4000);
            return;
        }

        // عند مرور 5 ثوانٍ أو طلب تمرير: نوجهه مباشرة لزر تفعيل الخطة واليوم الأول
        if (activateBtn && activateBtn.offsetParent !== null) {
            pointTo(activateBtn, 'اضغط هنا لبدء تمارين اليوم الأول وتفعيل خطتك المجانية 👇', {
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
        const startPacerBtn = document.getElementById('btn-start-pacer') || document.querySelector('.btn-start-exercise-pacer') || document.querySelector('.btn-exercise-audio-play');
        const completeBtn = document.getElementById('btn-complete-day1-session') || document.querySelector('.btn-finish-day1') || document.querySelector('.btn-complete-session');

        // إذا كان المريض قد أنهى التمارين، نوجهه لزر إتمام الجلسة
        if (completeBtn && completeBtn.offsetParent !== null && completeBtn.classList.contains('ready-to-complete')) {
            pointTo(completeBtn, 'اضغط هنا لتوثيق إنجاز جلسة اليوم الأول وحفظ تقدمك ✅', {
                handIcon: '👇',
                placement: 'top',
                autoScroll: autoScroll
            });
            return;
        }

        // التوجيه لزر بدء التمرين الأول مع التوجيه الصوتي
        const firstExerciseCard = document.querySelector('.exercise-action-card, .recovery-exercise-item') || startPacerBtn;
        if (firstExerciseCard && firstExerciseCard.offsetParent !== null) {
            pointTo(firstExerciseCard, 'اضغط هنا لبدء تمرينك الأول مع المؤقت والتوجيه الصوتي 🔊', {
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

    // الواجهة البرمجية العامة للنظام
    return {
        init: init,
        updateStep: updateStep,
        onPointSelected: onPointSelected,
        pointTo: pointTo,
        dismissTemporarily: dismissTemporarily,
        refreshCurrentGuidance: () => triggerCurrentStepGuidance(true)
    };
})();

// تشغيل النظام تلقائياً عند جاهزية الصفحة
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', SmartGuidance.init);
} else {
    SmartGuidance.init();
}

window.SmartGuidance = SmartGuidance;
