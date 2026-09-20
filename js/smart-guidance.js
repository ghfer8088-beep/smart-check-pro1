/**
 * Smart Check Pro 2.0 - منظومة التوجيه السريري الذهبي والشريط الثابت للمرضى وكبار السن
 * Sticky Clinical Guidance & Action Bar Architecture v29.15
 * 
 * يحل محل اليد العائمة المعرضة للأخطاء بشريط سفلي ثابت فاخر وواضح تماماً:
 * 1. في متناول إبهام المريض دائماً دون الحاجة للتمرير أو البحث عن الأزرار
 * 2. يوضح الخطوة الحالية والمطلوب فعله بنصوص صريحة وألوان طبية واضحة
 * 3. يحفظ اختيارات المريض لنقاط الألم دون أي إعادة تعيين أو وميض عشوائي
 * 4. يربط المراحل من 1 إلى 6 بسلاسة مطلقة
 */

const SmartGuidance = (function() {
    'use strict';

    let barEl = null;
    let currentStep = 1;
    let isAiAnalyzing = false;
    let currentPoint = null;

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

        setTimeout(() => {
            const savedStep = parseInt(localStorage.getItem('smart_current_step') || '1', 10);
            updateStep(savedStep);
        }, 300);
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
            <div class="sticky-guidance-container">
                <div class="sticky-guidance-info" id="sticky-guidance-info">
                    <span class="sticky-guidance-icon" id="sticky-guidance-icon">🎯</span>
                    <div class="sticky-guidance-texts">
                        <div class="sticky-guidance-sub" id="sticky-guidance-sub">المرحلة 1 من 6: تحديد موضع الشكوى والألم</div>
                        <div class="sticky-guidance-main" id="sticky-guidance-main">انقر على مكان ألمك من النقاط الحمراء المضيئة على المجسم</div>
                    </div>
                </div>
                <button type="button" id="sticky-guidance-action-btn" class="sticky-guidance-action-btn state-pending" onclick="SmartGuidance.onActionButtonClick()">
                    <span id="sticky-btn-icon">👆</span>
                    <span id="sticky-btn-text">اختر نقطة الألم أولاً</span>
                    <span class="sticky-btn-arrow">➔</span>
                </button>
            </div>
        `;
        document.body.appendChild(barEl);
    }

    function updateStep(stepNum) {
        currentStep = stepNum;
        isAiAnalyzing = false;

        // مزامنة أشرطة المسار السريري
        updateStageFlowBanner(stepNum, 1);

        // تحديث محتوى الشريط حسب المرحلة
        switch (stepNum) {
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
            updateStageFlowBanner(1, 2);
            if (iconEl) iconEl.textContent = '✅';
            if (subEl) subEl.textContent = 'ممتاز! تم تحديد موضع الشكوى بنجاح';
            if (mainEl) mainEl.innerHTML = `موضع الألم المختار: <strong style="color: #fef08a;">${point.title}</strong>`;

            btn.className = 'sticky-guidance-action-btn state-ready';
            if (btnIcon) btnIcon.textContent = '🩺';
            if (btnText) btnText.textContent = 'اضغط هنا لمتابعة الفحص السريري';
        } else {
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

        // صوت تأكيد لطيف وسلس
        if (typeof showToast === 'function') {
            showToast(`🎯 تم تحديد: ${point.title}.. اضغط على زر المتابعة بالأسفل لنبدأ فحصك`, 'success', 4000);
        }
    }

    // -------------------------------------------------------------------------
    // المرحلة 2: الاستشارة السريرية
    // -------------------------------------------------------------------------
    function renderStep2Bar() {
        const iconEl = document.getElementById('sticky-guidance-icon');
        const subEl = document.getElementById('sticky-guidance-sub');
        const mainEl = document.getElementById('sticky-guidance-main');
        const btn = document.getElementById('sticky-guidance-action-btn');
        const btnIcon = document.getElementById('sticky-btn-icon');
        const btnText = document.getElementById('sticky-btn-text');

        if (!btn) return;

        if (isAiAnalyzing) {
            updateStageFlowBanner(2, 2);
            if (iconEl) iconEl.textContent = '⏳';
            if (subEl) subEl.textContent = 'د. سارة تراجع إجابتك بدقة';
            if (mainEl) mainEl.textContent = 'جاري تحليل الأعراض السريرية وتسجيل الرد الطبي... لحظات قليلة';

            btn.className = 'sticky-guidance-action-btn state-pending';
            if (btnIcon) btnIcon.textContent = '⚙️';
            if (btnText) btnText.textContent = 'د. سارة تحضر الرد...';
        } else {
            updateStageFlowBanner(2, 2);
            if (iconEl) iconEl.textContent = '💬';
            if (subEl) subEl.textContent = 'المرحلة 2 من 6: الاستشارة السريرية الذكية';
            if (mainEl) mainEl.textContent = 'تفضل بالرد على سؤال د. سارة (صوتياً أو كتابةً) لتقييم حالتك';

            btn.className = 'sticky-guidance-action-btn state-ready';
            if (btnIcon) btnIcon.textContent = '✍️';
            if (btnText) btnText.textContent = 'إرسال الرد / التحدث للطبيبة';
        }
    }

    function guideAiTyping(typingEl) {
        isAiAnalyzing = true;
        if (currentStep === 2) {
            renderStep2Bar();
        }
    }

    function hideAiTyping() {
        isAiAnalyzing = false;
        if (currentStep === 2) {
            renderStep2Bar();
        }
    }

    // -------------------------------------------------------------------------
    // المرحلة 3: التقرير والتشخيص
    // -------------------------------------------------------------------------
    function renderStep3Bar() {
        updateStageFlowBanner(3, 1);
        const iconEl = document.getElementById('sticky-guidance-icon');
        const subEl = document.getElementById('sticky-guidance-sub');
        const mainEl = document.getElementById('sticky-guidance-main');
        const btn = document.getElementById('sticky-guidance-action-btn');
        const btnIcon = document.getElementById('sticky-btn-icon');
        const btnText = document.getElementById('sticky-btn-text');

        if (!btn) return;

        const reportCard = document.querySelector('#clinical-report-container .report-master-card');

        if (!reportCard) {
            if (iconEl) iconEl.textContent = '⏳';
            if (subEl) subEl.textContent = 'المرحلة 3 من 6: إعداد التقرير الطبي';
            if (mainEl) mainEl.textContent = 'جاري صياغة تقريرك وتشخيصك السريري المعتمد...';

            btn.className = 'sticky-guidance-action-btn state-pending';
            if (btnIcon) btnIcon.textContent = '⏳';
            if (btnText) btnText.textContent = 'جاري إعداد التقرير...';
        } else {
            if (iconEl) iconEl.textContent = '🩺';
            if (subEl) subEl.textContent = 'المرحلة 3 من 6: تشخيصك الطبي جاهز ومكتمل';
            if (mainEl) mainEl.textContent = 'استعرض تقريرك الطبي ثم اضغط لتفعيل خطتك وبدء اليوم الأول';

            btn.className = 'sticky-guidance-action-btn state-ready';
            if (btnIcon) btnIcon.textContent = '🚀';
            if (btnText) btnText.textContent = 'تفعيل خطة التعافي وبدء اليوم الأول مجاناً';
        }
    }

    function onReportRendered(data) {
        if (currentStep === 3) {
            renderStep3Bar();
        }
    }

    // -------------------------------------------------------------------------
    // المرحلة 4: تمارين اليوم الأول
    // -------------------------------------------------------------------------
    function renderStep4Bar() {
        updateStageFlowBanner(4, 1);
        const iconEl = document.getElementById('sticky-guidance-icon');
        const subEl = document.getElementById('sticky-guidance-sub');
        const mainEl = document.getElementById('sticky-guidance-main');
        const btn = document.getElementById('sticky-guidance-action-btn');
        const btnIcon = document.getElementById('sticky-btn-icon');
        const btnText = document.getElementById('sticky-btn-text');

        if (!btn) return;

        if (iconEl) iconEl.textContent = '🏃';
        if (subEl) subEl.textContent = 'المرحلة 4 من 6: تمارين اليوم الأول المخصصة';
        if (mainEl) mainEl.textContent = 'أدِّ التمارين الموضحة مع التوجيه الصوتي، ثم وثق جلستك لبدء الاستشفاء';

        btn.className = 'sticky-guidance-action-btn state-ready';
        if (btnIcon) btnIcon.textContent = '✅';
        if (btnText) btnText.textContent = 'توثيق إنجاز الجلسة الأولى وبدء الاستشفاء (24 س)';
    }

    // -------------------------------------------------------------------------
    // المرحلة 5: متابعة الجلسات (2 إلى 7)
    // -------------------------------------------------------------------------
    function renderStep5Bar() {
        const iconEl = document.getElementById('sticky-guidance-icon');
        const subEl = document.getElementById('sticky-guidance-sub');
        const mainEl = document.getElementById('sticky-guidance-main');
        const btn = document.getElementById('sticky-guidance-action-btn');
        const btnIcon = document.getElementById('sticky-btn-icon');
        const btnText = document.getElementById('sticky-btn-text');

        if (!btn) return;

        if (iconEl) iconEl.textContent = '📅';
        if (subEl) subEl.textContent = 'المرحلة 5 من 6: خطة التعافي الحركي (7 أيام)';
        if (mainEl) mainEl.textContent = 'حافظ على انتظامك اليومي في أداء التمارين لترميم الغضاريف والمفاصل';

        btn.className = 'sticky-guidance-action-btn state-ready';
        if (btnIcon) btnIcon.textContent = '▶️';
        if (btnText) btnText.textContent = 'بدء تمارين الجلسة الحالية';
    }

    // -------------------------------------------------------------------------
    // المرحلة 6: وثيقة التعافي والإنهاء
    // -------------------------------------------------------------------------
    function renderStep6Bar() {
        const iconEl = document.getElementById('sticky-guidance-icon');
        const subEl = document.getElementById('sticky-guidance-sub');
        const mainEl = document.getElementById('sticky-guidance-main');
        const btn = document.getElementById('sticky-guidance-action-btn');
        const btnIcon = document.getElementById('sticky-btn-icon');
        const btnText = document.getElementById('sticky-btn-text');

        if (!btn) return;

        if (iconEl) iconEl.textContent = '🏆';
        if (subEl) subEl.textContent = 'المرحلة 6 من 6: إتمام برنامج التعافي بنجاح';
        if (mainEl) mainEl.textContent = 'مبارك إتمامك البرنامج! يمكنك الآن تحميل وثيقة التعافي المعتمدة';

        btn.className = 'sticky-guidance-action-btn state-ready';
        if (btnIcon) btnIcon.textContent = '📜';
        if (btnText) btnText.textContent = 'تحميل وثيقة التعافي الرسمية';
    }

    // -------------------------------------------------------------------------
    // معالج النقر الموحد للزر السفلي الذكي (Unified Bottom Action Handler)
    // -------------------------------------------------------------------------
    function onActionButtonClick() {
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
                    // لم يختر نقطة بعد: توجيه بصري سلس ومريح للمجسم
                    const viewport = document.querySelector('.skeleton-viewport') || document.querySelector('.anatomy-card');
                    if (viewport) {
                        viewport.scrollIntoView({ behavior: 'smooth', block: 'center' });
                    }
                    if (typeof showToast === 'function') {
                        showToast('يا غالي، تفضل أولاً بالنقر على مكان وجعك على المجسم 🎯', 'warning', 3500);
                    }
                    // وميض لافت خفيف لكافة النقاط لتسهيل الرؤية على المسن
                    document.querySelectorAll('.anatomy-hotspot').forEach(p => {
                        p.classList.add('guidance-pulse-all');
                    });
                    setTimeout(() => {
                        document.querySelectorAll('.anatomy-hotspot').forEach(p => {
                            p.classList.remove('guidance-pulse-all');
                        });
                    }, 4000);
                }
                break;
            }
            case 2: {
                // في الشات: تركيز حقل الإدخال أو زر الإرسال
                const chatInput = document.getElementById('ai-chat-input');
                if (chatInput && !chatInput.disabled) {
                    chatInput.scrollIntoView({ behavior: 'smooth', block: 'center' });
                    chatInput.focus();
                } else {
                    const messagesBox = document.getElementById('ai-chat-messages-box');
                    if (messagesBox) messagesBox.scrollTop = messagesBox.scrollHeight;
                }
                break;
            }
            case 3: {
                // تفعيل الخطة المجانية وبدء اليوم الأول فوراً
                const btnRoyal = document.getElementById('btn-activate-plan-royal');
                if (btnRoyal && typeof activateRecoveryPlanInstantly === 'function') {
                    activateRecoveryPlanInstantly();
                } else if (typeof goToStep === 'function') {
                    goToStep(4);
                }
                break;
            }
            case 4: {
                // توثيق تمارين اليوم الأول
                const completeBtn = document.querySelector('#step-section-4 button[onclick*="openSessionAssessmentModal"]') || document.getElementById('btn-complete-day1-session');
                if (completeBtn) {
                    completeBtn.click();
                } else if (typeof openSessionAssessmentModal === 'function') {
                    openSessionAssessmentModal(1);
                }
                break;
            }
            case 5: {
                const activeDayBtn = document.querySelector('.btn-start-current-day, .day-session-active-btn, .btn-pacer-trigger');
                if (activeDayBtn) {
                    activeDayBtn.click();
                }
                break;
            }
            case 6: {
                const certBtn = document.querySelector('.btn-download-cert, .btn-whatsapp-consult-cert');
                if (certBtn) {
                    certBtn.click();
                }
                break;
            }
            default:
                break;
        }
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

    function guideDuaaModal() {
        const shareBtn = document.getElementById('btn-royal-share-duaa') || document.querySelector('.btn-royal-modal-action');
        if (shareBtn) {
            shareBtn.classList.add('guidance-target-highlight');
            shareBtn.scrollIntoView({ behavior: 'smooth', block: 'center' });
        }
    }

    // دوال توافقية للأكواد السابقة لضمان عدم حدوث أي خطأ استدعاء
    function pointTo() {}
    function triggerHotspotsSynchronizedPulse() {}
    function removeHotspotsSynchronizedPulse() {}
    function dismissTemporarily() {}

    return {
        init: init,
        updateStep: updateStep,
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
