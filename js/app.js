// ==========================================================================
// Smart Check Pro 2.0 - محرك التطبيق الرئيسي الشامل (Master App Controller)
// مطورة من قبل "وداعاً للألم" (تقنية الكايروبراكتيك)
// ==========================================================================

let currentSelectedPoint = null;
let currentAssessmentData = null;
let activePatient = null;
let deferredPwaPrompt = null;

// بيانات التواصل الخاصة بـ وداعاً للألم (تقنية الكايروبراكتيك اليدوية)
const CLINIC_WHATSAPP_NUMBER = "962790360440";
const CLINIC_WHATSAPP = `https://wa.me/${CLINIC_WHATSAPP_NUMBER}`;
const CLINIC_PHONE = "+962 7 9036 0440";
const CLINIC_FACEBOOK = "https://www.facebook.com/30minutes30/";

// دالة مشاركة وتثبيت الأداة الذكية المطورة
function shareApplication() {
    openAppInstallShareModal();
}

// شبكة نقاط الألم التشريحية الافتراضية المحدثة والمعتمدة
const DEFAULT_FRONT_POINTS = [
    { id: "shoulder_right_f", region: "shoulder", title: "مفصل الكتف الأيمن", keywords: "كتف يمين, كفة مدورة, تجمد كتف, رفع ذراع", x: 27, y: 22.5 },
    { id: "shoulder_left_f", region: "shoulder", title: "مفصل الكتف الأيسر", keywords: "كتف يسار, كفة مدورة, تجمد كتف", x: 73, y: 22.5 },
    { id: "elbow_right_f", region: "general", title: "مفصل الكوع الأيمن", keywords: "كوع يمين, مرفق تنس, ساعد", x: 23, y: 39.5 },
    { id: "elbow_left_f", region: "general", title: "مفصل الكوع الأيسر", keywords: "كوع يسار, مرفق تنس, ساعد", x: 77, y: 39.5 },
    { id: "wrist_right_f", region: "general", title: "الرسغ واليد اليمنى", keywords: "رسغ يمين, يد يمين, نفق رسغي, تنميل أصابع, إبهام", x: 16, y: 53.5 },
    { id: "wrist_left_f", region: "general", title: "الرسغ واليد اليسرى", keywords: "رسغ يسار, يد يسار, نفق رسغي, تنميل أصابع", x: 84, y: 53.5 },
    { id: "hip_right_f", region: "lumbar", title: "مفصل الورك الأيمن", keywords: "ورك يمين, مفصل الفخذ", x: 35, y: 53 },
    { id: "hip_left_f", region: "lumbar", title: "مفصل الورك الأيسر", keywords: "ورك يسار, مفصل الفخذ", x: 65, y: 53 },
    { id: "knee_right_f", region: "knee", title: "مفصل الركبة اليمنى والصابونة", keywords: "ركبة يمين, صابونة, احتكاك ركبة, طقطقة ركبة", x: 39.5, y: 72 },
    { id: "knee_left_f", region: "knee", title: "مفصل الركبة اليسرى والصابونة", keywords: "ركبة يسار, صابونة, احتكاك ركبة", x: 60.5, y: 72 },
    { id: "ankle_right_f", region: "knee", title: "الكاحل ومفصل القدم الأيمن", keywords: "كاحل يمين, قدم يمين, مسمار كعب, لفافة أخمصية", x: 41, y: 92 },
    { id: "ankle_left_f", region: "knee", title: "الكاحل ومفصل القدم الأيسر", keywords: "كاحل يسار, قدم يسار, مسمار كعب", x: 59, y: 92 }
];

const DEFAULT_BACK_POINTS = [
    { id: "cervical_back", region: "cervical", title: "الفقرات العنقية (الرقبة الخلفية)", keywords: "ديسك رقبة, تشنج رقبة, فقرات عنقية, تصلب رقبة", x: 50, y: 19 },
    { id: "trapezius_right", region: "cervical", title: "عضلة شبه المنحرفة وأعلى الكتف الأيمن", keywords: "أبهر يمين, عقدة عضلية, شبه منحرفة", x: 36, y: 23 },
    { id: "trapezius_left", region: "cervical", title: "عضلة شبه المنحرفة وأعلى الكتف الأيسر", keywords: "أبهر يسار, عقدة عضلية, شبه منحرفة", x: 64, y: 23 },
    { id: "scapula_right", region: "shoulder", title: "لوح الكتف الأيمن", keywords: "لوح كتف يمين, خلف الظهر", x: 36, y: 29 },
    { id: "scapula_left", region: "shoulder", title: "لوح الكتف الأيسر", keywords: "لوح كتف يسار, خلف الظهر", x: 64, y: 29 },
    { id: "thoracic_spine", region: "general", title: "الفقرات الصدرية وأعلى الظهر", keywords: "أعلى الظهر, فقرات صدرية, بين الكتفين", x: 50, y: 34 },
    { id: "lumbar_spine", region: "lumbar", title: "الفقرات القطنية وأسفل الظهر", keywords: "ديسك أسفل الظهر, فقرات قطنية, لومبار, انزلاق غضروفي, ديسك", x: 50, y: 46 },
    { id: "sacroiliac_right", region: "lumbar", title: "المفصل العجزي الحوضي الأيمن", keywords: "مفصل عجزي يمين, عجز, حوض خلفي", x: 42, y: 50 },
    { id: "sacroiliac_left", region: "lumbar", title: "المفصل العجزي الحوضي الأيسر", keywords: "مفصل عجزي يسار, عجز, حوض خلفي", x: 58, y: 50 },
    { id: "gluteal_right", region: "lumbar", title: "عضلات الأرداف ومسار عرق النسا الأيمن", keywords: "عرق النسا يمين, كمثرية, تنميل فخذ يمين, سياتيكا", x: 38, y: 57 },
    { id: "gluteal_left", region: "lumbar", title: "عضلات الأرداف ومسار عرق النسا الأيسر", keywords: "عرق النسا يسار, كمثرية, تنميل فخذ يسار, سياتيكا", x: 62, y: 57 },
    { id: "achilles_calf", region: "knee", title: "عضلة السمانة ووتر أكيليس اليمنى", keywords: "سمانة يمين, وتر أكيليس يمين, بطة الرجل يمين, كعب يمين", x: 60, y: 84 },
    { id: "point_37515", region: "general", title: "عضلة السمانة ووتر أكيليس اليسرى", keywords: "سمانة يسار, وتر أكيليس يسار, بطة الرجل يسار, كعب يسار", x: 40, y: 84 }
];

function getFrontPoints() {
    return DEFAULT_FRONT_POINTS;
}

function getBackPoints() {
    return DEFAULT_BACK_POINTS;
}

// استخراج واسترجاع مسمى منطقة الألم الحقيقية بدقة عالية
function resolvePainAreaTitle(patient = null, assessment = null, point = null) {
    if (point && point.title) return point.title;
    if (assessment && assessment.painAreaTitle) return assessment.painAreaTitle;
    if (patient && patient.painAreaTitle) return patient.painAreaTitle;
    
    // البحث بالمعرف في نقاط المجسم المعتمدة
    const pointId = (assessment && (assessment.pointId || assessment.pointKey)) || (patient && (patient.painArea || patient.painPointId));
    if (pointId) {
        const all = [...getFrontPoints(), ...getBackPoints()];
        const found = all.find(p => p.id === pointId);
        if (found && found.title) return found.title;
    }
    return 'مفاصل الجسم والعمود الفقري';
}

// دالة التنبيهات المخصصة الفاخرة
function showToast(message, type = 'info', duration = 7000) {
    let container = document.getElementById('toast-container');
    if (!container) {
        container = document.createElement('div');
        container.id = 'toast-container';
        container.style.cssText = 'position: fixed; bottom: 25px; left: 50%; transform: translateX(-50%); z-index: 99999; display: flex; flex-direction: column; gap: 10px; pointer-events: none; max-width: 90vw; width: max-content;';
        document.body.appendChild(container);
    }

    const toast = document.createElement('div');
    const bg = type === 'success' ? '#10b981' : (type === 'error' ? '#ef4444' : '#d4af37');
    const color = type === 'info' ? '#0a0e14' : '#ffffff';
    
    toast.style.cssText = `background: ${bg}; color: ${color}; padding: 14px 20px; border-radius: 12px; font-weight: bold; font-size: 0.96em; box-shadow: 0 8px 30px rgba(0,0,0,0.6); pointer-events: auto; animation: fadeInToast 0.3s ease; display: flex; align-items: center; justify-content: space-between; gap: 14px; border: 1.5px solid rgba(255,255,255,0.3);`;
    toast.innerHTML = `
        <span style="flex: 1; line-height: 1.5;">${message}</span>
        <button type="button" onclick="this.parentElement.remove()" style="background: rgba(0,0,0,0.25); border: none; color: ${color}; border-radius: 50%; width: 24px; height: 24px; cursor: pointer; font-size: 0.85em; font-weight: bold; display: flex; align-items: center; justify-content: center; flex-shrink: 0;">✖</button>
    `;

    container.appendChild(toast);
    setTimeout(() => {
        if (toast.parentElement) {
            toast.style.opacity = '0';
            toast.style.transition = 'opacity 0.4s ease';
            setTimeout(() => toast.remove(), 400);
        }
    }, duration);
}

// رسم نقاط الألم على المجسم
function renderAnatomyPoints(containerId, points) {
    const container = document.getElementById(containerId);
    if (!container) return;

    const oldPoints = container.querySelectorAll('.anatomy-hotspot');
    oldPoints.forEach(p => p.remove());

    points.forEach(pt => {
        const pointEl = document.createElement('div');
        pointEl.className = 'anatomy-hotspot';
        pointEl.style.left = `${pt.x}%`;
        pointEl.style.top = `${pt.y}%`;
        pointEl.title = pt.title;
        pointEl.dataset.pointId = pt.id;
        pointEl.dataset.region = pt.region;
        pointEl.dataset.title = pt.title;

        if (currentSelectedPoint && currentSelectedPoint.id === pt.id) {
            pointEl.classList.add('active');
        }

        pointEl.addEventListener('pointerdown', (e) => {
            e.stopPropagation();
            stopAllActiveAudio();
        });
        pointEl.addEventListener('touchstart', (e) => {
            e.stopPropagation();
            stopAllActiveAudio();
        }, { passive: true });
        pointEl.addEventListener('click', (e) => {
            e.stopPropagation();
            selectAnatomyPoint(pt, pointEl);
        });

        container.appendChild(pointEl);
    });
}

// دالة فحص صلاحيات الأدمن والمدير العام
function isUserAdmin() {
    try {
        if (window.location.pathname.includes('admin')) return true;
        if (window.location.search.includes('admin=1') || window.location.search.includes('admin=true')) return true;
        if (sessionStorage.getItem('wada3an_admin_logged_in') === 'true' || sessionStorage.getItem('adminPanelOpen') === 'true') return true;
        if (localStorage.getItem('wada3an_admin_mode') === 'true') return true;
    } catch (e) {}
    return false;
}
window.isUserAdmin = isUserAdmin;

// إيقاف كافة الأصوات النشطة فوراً ومنع أي تداخل بين المحطات أو إعادة تشغيل نهائياً
function stopAllActiveAudio() {
    if (typeof currentActiveStationAudio !== 'undefined' && currentActiveStationAudio) {
        try {
            if (typeof currentActiveStationAudio._cancelPlayback === 'function') {
                currentActiveStationAudio._cancelPlayback();
            }
            currentActiveStationAudio.onended = null;
            currentActiveStationAudio.onerror = null;
            currentActiveStationAudio.onloadedmetadata = null;
            currentActiveStationAudio.onplay = null;
            currentActiveStationAudio.pause();
            currentActiveStationAudio.currentTime = 0;
            currentActiveStationAudio.removeAttribute('src');
            currentActiveStationAudio.load();
        } catch (e) {}
        currentActiveStationAudio = null;
    }
    if (typeof Wada3anAiEngine !== 'undefined') {
        Wada3anAiEngine.stopSpeaking();
    }
    const guidanceBar = document.getElementById('welcome-audio-guidance-bar');
    if (guidanceBar) guidanceBar.style.display = 'none';
}
window.stopAllActiveAudio = stopAllActiveAudio;

// اختيار نقطة الألم
function selectAnatomyPoint(point, element) {
    // قفل تشغيل الصوت الترحيبي نهائياً لهذه الزيارة وإيقاف أي صوت نشط فوراً
    try {
        sessionStorage.setItem('scp_welcome_audio_played', 'true');
    } catch (e) {}
    window.introPlayedOrAttempted = true;
    stopAllActiveAudio();

    if (window.handleFirstUserInteractionForAudio) {
        window.removeEventListener('pointerdown', window.handleFirstUserInteractionForAudio);
        window.removeEventListener('touchstart', window.handleFirstUserInteractionForAudio);
        window.removeEventListener('click', window.handleFirstUserInteractionForAudio);
        window.handleFirstUserInteractionForAudio = null;
    }

    document.querySelectorAll('.anatomy-hotspot').forEach(p => p.classList.remove('active'));
    if (element) {
        element.classList.add('active');
    } else {
        const found = document.querySelector(`.anatomy-hotspot[data-point-id="${point.id}"]`);
        if (found) found.classList.add('active');
    }

    currentSelectedPoint = point;
    
    const statusText = document.getElementById('selected-point-label');
    if (statusText) {
        statusText.textContent = `🎯 تم تحديد: ${point.title}`;
        statusText.style.color = '#10b981';
    }

    renderAdaptiveQuestions(point.id);
    
    // إعادة تعيين الحوار السريري للبدء بنقطة الألم الجديدة
    if (typeof clinicalDialogueState !== 'undefined') {
        clinicalDialogueState.step = 'init';
        clinicalDialogueState.hasStartedWelcome = false;
        clinicalDialogueState.isStarting = false;
    }
    if (typeof Wada3anAiEngine !== 'undefined') {
        Wada3anAiEngine.unlockAudio();
    }

    const proceedBtn = document.getElementById('btn-goto-step2');
    if (proceedBtn) {
        proceedBtn.disabled = false;
        proceedBtn.style.opacity = '1';
    }
}

// البحث الذكي عن موضع الشكوى (Smart Pain Search)
function handleSmartPainSearch(query) {
    const resultsContainer = document.getElementById('search-pain-results');
    if (!resultsContainer) return;

    const q = (query || "").trim().toLowerCase();
    if (!q || q.length < 2) {
        resultsContainer.style.display = 'none';
        return;
    }

    const allPoints = [...getFrontPoints().map(p => ({...p, view: 'front'})), ...getBackPoints().map(p => ({...p, view: 'back'}))];
    const matches = allPoints.filter(p => {
        return p.title.toLowerCase().includes(q) || (p.keywords && p.keywords.toLowerCase().includes(q));
    });

    if (matches.length === 0) {
        resultsContainer.innerHTML = `<div style="padding: 10px 14px; color: #94a3b8; font-size: 0.88em;">لم يتم العثور على نقطة مطابقة، يمكنك النقر مباشرة على المجسم.</div>`;
        resultsContainer.style.display = 'block';
        return;
    }

    resultsContainer.innerHTML = matches.slice(0, 6).map(m => `
        <div onclick="selectPointFromSearch('${m.id}', '${m.view}')" style="padding: 10px 14px; border-bottom: 1px solid #1e293b; color: #ffffff; cursor: pointer; display: flex; justify-content: space-between; align-items: center; transition: 0.2s;" onmouseover="this.style.background='#1e293b'" onmouseout="this.style.background='transparent'">
            <span style="font-weight: bold; font-size: 0.92em;">🎯 ${m.title}</span>
            <span style="background: rgba(212, 175, 55, 0.15); color: var(--primary-gold); font-size: 0.78em; padding: 2px 8px; border-radius: 4px;">${m.view === 'front' ? 'المجسم الأمامي' : 'المجسم الخلفي'}</span>
        </div>
    `).join('');
    resultsContainer.style.display = 'block';
}

function selectPointFromSearch(pointId, view) {
    const resultsContainer = document.getElementById('search-pain-results');
    if (resultsContainer) resultsContainer.style.display = 'none';

    switchAnatomyView(view);
    const allPoints = view === 'front' ? getFrontPoints() : getBackPoints();
    const pt = allPoints.find(p => p.id === pointId);
    if (pt) {
        selectAnatomyPoint(pt);
        showToast(`تم تحديد ${pt.title} بنجاح`, 'success');
        document.getElementById('smart-pain-search-input').value = pt.title;
    }
}

// تشغيل الدليل الصوتي التوجيهي للخطوة الأولى
function playStep1AudioGuide() {
    const btn = document.getElementById('btn-play-intro-audio');
    if (btn) {
        btn.innerHTML = '<span>⏳ جاري تشغيل الدليل الصوتي...</span>';
        btn.disabled = true;
    }
    Wada3anAiEngine.playIntroAudioGuide(() => {
        if (btn) {
            btn.innerHTML = '<span>🔊 استمع لشرح الطبيب مجدداً</span>';
            btn.disabled = false;
        }
    });
}

// التحكم الذكي في التنقل عبر شريط الخطوات الست (Stepper Click Handler)
function handleStepperClick(stepNum) {
    if (stepNum === 1) {
        goToStep(1);
    } else if (stepNum === 2) {
        if (!currentSelectedPoint) {
            showToast('يرجى تحديد مكان الألم على المجسم أولاً', 'error');
            goToStep(1);
            return;
        }
        goToStep(2);
    } else if (stepNum === 3) {
        if (!currentAssessmentData) {
            showToast('يرجى إكمال التقييم السريري أولاً لتوليد التقرير', 'error');
            if (currentSelectedPoint) goToStep(2);
            else goToStep(1);
            return;
        }
        displayDiagnosticReport(currentAssessmentData);
        goToStep(3);
    } else if (stepNum === 4) {
        const savedPatientId = SmartDB.getCurrentSessionPatientId() || activePatient?.patientId;
        if (!savedPatientId) {
            showToast('يرجى تفعيل خطة التعافي أولاً من التقرير الطبي', 'info');
            if (currentAssessmentData) goToStep(3);
            else if (currentSelectedPoint) goToStep(2);
            else goToStep(1);
            return;
        }
        renderStep4IndependentDay1(savedPatientId);
    } else if (stepNum === 5) {
        const savedPatientId = SmartDB.getCurrentSessionPatientId() || activePatient?.patientId;
        if (!savedPatientId) {
            showToast('يرجى تفعيل خطة التعافي أولاً من التقرير الطبي', 'info');
            if (currentAssessmentData) goToStep(3);
            else if (currentSelectedPoint) goToStep(2);
            else goToStep(1);
            return;
        }
        renderStep5SessionsDashboard(savedPatientId);
    } else if (stepNum === 6) {
        const savedPatientId = SmartDB.getCurrentSessionPatientId() || activePatient?.patientId;
        if (!savedPatientId) {
            showToast('يرجى تفعيل خطة التعافي أولاً من التقرير الطبي', 'info');
            if (currentAssessmentData) goToStep(3);
            else if (currentSelectedPoint) goToStep(2);
            else goToStep(1);
            return;
        }
        renderStep6Completion(savedPatientId);
    }
}

// توليد الأسئلة السريرية التكيفية متعددة الطبقات
function renderAdaptiveQuestions(pointId) {
    const questionsContainer = document.getElementById('adaptive-questions-list');
    if (!questionsContainer) return;

    const pData = ClinicalEngine.getQuestionsForPoint(pointId);
    if (!pData) return;

    let html = '';

    // الطبقة 1: توصيف نوع وجودة الألم والمسار العصبي (Multi-Select Checkboxes)
    if (pData.tier1_quality) {
        html += `
        <div style="background: rgba(30, 41, 59, 0.7); padding: 18px 20px; border-radius: 12px; margin-bottom: 18px; border: 1px solid rgba(212, 175, 55, 0.35);">
            <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 12px; flex-wrap: wrap; gap: 8px;">
                <div style="color: var(--primary-gold); font-weight: bold; font-size: 1.05em;">${pData.tier1_quality.title}</div>
                <span style="color: #38bdf8; font-size: 0.78em; background: rgba(56, 189, 248, 0.12); padding: 3px 8px; border-radius: 6px; border: 1px solid rgba(56, 189, 248, 0.3);">يمكن اختيار أكثر من عرض</span>
            </div>
            <div style="display: flex; flex-direction: column; gap: 10px;">
                ${pData.tier1_quality.options.map(opt => `
                    <label style="display: flex; align-items: center; gap: 12px; background: #0f172a; border: 1px solid #334155; padding: 12px 14px; border-radius: 8px; cursor: pointer; transition: 0.2s;">
                        <input type="checkbox" name="clinical_q1" value="${opt.value}" data-label="${opt.label}" style="accent-color: var(--primary-gold); width: 18px; height: 18px;">
                        <span style="color: #f1f5f9; font-size: 0.92em; line-height: 1.5;">${opt.label}</span>
                    </label>
                `).join('')}
            </div>
        </div>`;
    }

    // الطبقة 2: الاستجابة الاتجاهية والمحفزات الميكانيكية (Multi-Select Checkboxes)
    if (pData.tier2_mechanical) {
        html += `
        <div style="background: rgba(30, 41, 59, 0.7); padding: 18px 20px; border-radius: 12px; margin-bottom: 18px; border: 1px solid rgba(212, 175, 55, 0.35);">
            <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 12px; flex-wrap: wrap; gap: 8px;">
                <div style="color: var(--primary-gold); font-weight: bold; font-size: 1.05em;">${pData.tier2_mechanical.title}</div>
                <span style="color: #38bdf8; font-size: 0.78em; background: rgba(56, 189, 248, 0.12); padding: 3px 8px; border-radius: 6px; border: 1px solid rgba(56, 189, 248, 0.3);">يمكن اختيار أكثر من محفز</span>
            </div>
            <div style="display: flex; flex-direction: column; gap: 10px;">
                ${pData.tier2_mechanical.options.map(opt => `
                    <label style="display: flex; align-items: center; gap: 12px; background: #0f172a; border: 1px solid #334155; padding: 12px 14px; border-radius: 8px; cursor: pointer; transition: 0.2s;">
                        <input type="checkbox" name="clinical_q2" value="${opt.value}" data-label="${opt.label}" style="accent-color: var(--primary-gold); width: 18px; height: 18px;">
                        <span style="color: #f1f5f9; font-size: 0.92em; line-height: 1.5;">${opt.label}</span>
                    </label>
                `).join('')}
            </div>
        </div>`;
    }

    // الطبقة 3: خريطة الأعصاب والأعراض الحسية والحركية (Checkboxes)
    if (pData.tier3_neuro_mapping) {
        html += `
        <div style="background: rgba(30, 41, 59, 0.7); padding: 18px 20px; border-radius: 12px; margin-bottom: 18px; border: 1px solid rgba(212, 175, 55, 0.35);">
            <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 12px; flex-wrap: wrap; gap: 8px;">
                <div style="color: var(--primary-gold); font-weight: bold; font-size: 1.05em;">${pData.tier3_neuro_mapping.title}</div>
                <span style="color: #10b981; font-size: 0.78em; background: rgba(16, 185, 129, 0.12); padding: 3px 8px; border-radius: 6px; border: 1px solid rgba(16, 185, 129, 0.3);">اختر كل ما تشعر به</span>
            </div>
            <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(280px, 1fr)); gap: 10px;">
                ${pData.tier3_neuro_mapping.options.map(opt => `
                    <label style="display: flex; align-items: center; gap: 10px; background: #0f172a; border: 1px solid #334155; padding: 11px 14px; border-radius: 8px; cursor: pointer;">
                        <input type="checkbox" name="clinical_q3" value="${opt.id}" data-label="${opt.label}" style="accent-color: #10b981; width: 18px; height: 18px;">
                        <span style="color: #cbd5e1; font-size: 0.9em; line-height: 1.4;">${opt.label}</span>
                    </label>
                `).join('')}
            </div>
        </div>`;
    }

    // الطبقة 4: الاختبار السريري الاستدلالي (Provocation Test)
    if (pData.tier4_provocation) {
        html += `
        <div style="background: rgba(30, 41, 59, 0.7); padding: 18px 20px; border-radius: 12px; margin-bottom: 18px; border: 1px solid rgba(212, 175, 55, 0.35);">
            <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 6px; flex-wrap: wrap; gap: 8px;">
                <div style="color: var(--primary-gold); font-weight: bold; font-size: 1.05em;">${pData.tier4_provocation.title}</div>
                <span style="color: #38bdf8; font-size: 0.78em; background: rgba(56, 189, 248, 0.12); padding: 3px 8px; border-radius: 6px; border: 1px solid rgba(56, 189, 248, 0.3);">اختبار استدلالي</span>
            </div>
            <div style="color: #cbd5e1; font-size: 0.9em; margin-bottom: 12px;">${pData.tier4_provocation.question}</div>
            <div style="display: flex; flex-direction: column; gap: 10px;">
                ${pData.tier4_provocation.options.map(opt => `
                    <label style="display: flex; align-items: center; gap: 12px; background: #0f172a; border: 1px solid #334155; padding: 12px 14px; border-radius: 8px; cursor: pointer; transition: 0.2s;">
                        <input type="checkbox" name="clinical_q4" value="${opt.value}" data-label="${opt.label}" style="accent-color: var(--primary-gold); width: 18px; height: 18px;">
                        <span style="color: #f1f5f9; font-size: 0.92em; line-height: 1.5;">${opt.label}</span>
                    </label>
                `).join('')}
            </div>
        </div>`;
    }

    questionsContainer.innerHTML = html;
}

// توليد خيارات الأعلام الحمراء
function renderRedFlags() {
    const container = document.getElementById('red-flags-list');
    if (!container) return;

    let html = '';
    ClinicalEngine.RED_FLAGS_CRITERIA.forEach(rf => {
        html += `
        <label class="red-flag-item" style="display: flex; align-items: center; gap: 10px; background: rgba(239, 68, 68, 0.08); border: 1px solid rgba(239, 68, 68, 0.3); padding: 10px 14px; border-radius: 8px; margin-bottom: 8px; cursor: pointer;">
            <input type="checkbox" name="red_flag" value="${rf.id}" style="accent-color: #ef4444; width: 16px; height: 16px;">
            <span style="color: #fca5a5; font-size: 0.9em; font-weight: 500;">${rf.label}</span>
        </label>`;
    });

    container.innerHTML = html;
}

// تنفيذ الفحص السريري وتوليد التقرير الطبي الملكي
async function runDiagnosticAnalysis() {
    try {
        if (!currentSelectedPoint) {
            // نقطة افتراضية لأسفل الظهر في حال الانتقال المباشر
            const allPts = typeof getBackPoints === 'function' ? getBackPoints() : [];
            currentSelectedPoint = allPts.find(p => p.id === 'lumbar_spine') || { id: 'lumbar_spine', title: 'أسفل الظهر والفقرات القطنية', region: 'lumbar' };
        }

        // استخراج البيانات الحيوية: أولاً من clinicalDialogueState (وضع الشات)، ثم من حقول النموذج
        const chatVitals = (typeof clinicalDialogueState !== 'undefined' && clinicalDialogueState?.patientVitals) ? clinicalDialogueState.patientVitals : {};
        const chatName = (typeof clinicalDialogueState !== 'undefined') ? (clinicalDialogueState?.patientName || '') : '';

        const age = chatVitals.age || parseInt(document.getElementById('patient-age')?.value) || 35;
        const weight = chatVitals.weight || parseFloat(document.getElementById('patient-weight')?.value) || null;
        const height = chatVitals.height || parseFloat(document.getElementById('patient-height')?.value) || null;

        // استخراج الجنس: من الشات أولاً، ثم من النموذج، ثم التخمين من اسم المريض
        let gender = chatVitals.gender || document.querySelector('input[name="patient_gender"]:checked')?.value || '';
        if (!gender || gender === 'ذكر') {
            // محاولة استنتاج الجنس من الاسم العربي
            const femaleNamePattern = /^(ميس|سارة|لينا|منى|رنا|هند|نور|ريم|دنيا|إيمان|ايمان|فاطمة|زينب|مريم|يسرى|رنده|رندة|ديما|لارا|لمى|لمياء|علا|عبير|غادة|وفاء|سمر|سمية|رغد|أميرة|أريج|ربى|إيناس|ناديا|ليلى|هيفاء|سوزان|رويدا|روان|إنعام|بيان|شيرين|مها|دلال|أسيل|نادين|إيمان|تقى|تقوى|داليا|يارا|ياسمين|جنى|أمل|حلا|عبير|إسراء|اسراء|إيمان|تمارا|رانيا|ريهام|نجلاء|ولاء|وئام|بسمة|بسمه|حنين|نادية|سعاد|لجين|ابتسام|شذى|أمنية|نوف|ألاء|الاء|مياء|دانا|زهراء|صبا|منال|حياة|هناء|إنجي|إنجى|بثينة|حمدة|صفاء|صفى|وسن|عفراء|حور|جواهر|شهد|شهده)/i;
            if (femaleNamePattern.test(chatName.trim())) {
                gender = 'أنثى';
            } else if (!gender) {
                gender = 'ذكر';
            }
        }

        let explicitPain = null;
        let hasExplicitPain = false;
        const userChatMessages = (typeof clinicalDialogueState !== 'undefined' && clinicalDialogueState?.history)
            ? clinicalDialogueState.history.filter(h => h.sender === 'user').map(h => h.text).join(' ')
            : '';

        if (typeof currentIntakeMode !== 'undefined' && currentIntakeMode === 'chat') {
            const painMatch = userChatMessages.match(/(?:ألم|وجع|شدة)?\s*(?:بنسبة|بمقدار|حوالي|درجة)?\s*([1-9]|10)\s*(?:من|\/)\s*10/i) ||
                              userChatMessages.match(/(?:ألمي|شدة الألم|درجة الألم|أعطيه|أعطيها|تقريباً)\s*([1-9]|10)\b/i);
            if (painMatch && painMatch[1]) {
                explicitPain = parseInt(painMatch[1]);
                hasExplicitPain = true;
            }
        } else {
            const sliderEl = document.getElementById('pain-severity-slider');
            if (sliderEl && sliderEl.dataset.userInteracted === 'true') {
                const val = parseInt(sliderEl.value);
                if (!isNaN(val)) {
                    explicitPain = val;
                    hasExplicitPain = true;
                }
            }
        }

        const internalPainScore = explicitPain !== null ? explicitPain : 6;
        const painSeverity = explicitPain; // null if not explicitly entered
        const painDuration = document.getElementById('pain-duration-select')?.value || '1_week';
        const userNotes = document.getElementById('patient-condition-notes')?.value?.trim() || '';

        const q1Inputs = Array.from(document.querySelectorAll('input[name="clinical_q1"]:checked'));
        const q1Val = q1Inputs.length > 0 ? q1Inputs[0].value : "";
        const q1Values = q1Inputs.map(i => i.value);
        const q1Labels = q1Inputs.map(i => i.dataset.label || i.value);

        const q2Inputs = Array.from(document.querySelectorAll('input[name="clinical_q2"]:checked'));
        const q2Val = q2Inputs.length > 0 ? q2Inputs[0].value : "";
        const q2Text = q2Inputs.map(i => i.dataset.label || i.value).join(' + ');
        const q2Values = q2Inputs.map(i => i.value);

        const q4Inputs = Array.from(document.querySelectorAll('input[name="clinical_q4"]:checked'));
        const q4Val = q4Inputs.length > 0 ? q4Inputs[0].value : "";
        const q4Text = q4Inputs.map(i => i.dataset.label || i.value).join(' + ');
        const q4Values = q4Inputs.map(i => i.value);
        
        const associatedLabels = [];
        document.querySelectorAll('input[name="clinical_q3"]:checked').forEach(cb => {
            if (cb.dataset && cb.dataset.label) associatedLabels.push(cb.dataset.label);
        });

        // تجميع كل الأعراض المختارة في قائمة سريرية موحدة
        const allSelectedSymptoms = [
            ...q1Labels,
            ...associatedLabels,
            ...(q2Inputs.map(i => i.dataset.label || '').filter(Boolean)),
            ...(q4Inputs.map(i => i.dataset.label || '').filter(Boolean))
        ].filter(Boolean);

        const chronicDiseases = [];
        document.querySelectorAll('input[name="chronic_disease"]:checked').forEach(cb => {
            if (cb.value !== 'none') chronicDiseases.push(cb.value);
        });

        const lifeImpactSelected = [];
        if (typeof currentIntakeMode === 'undefined' || currentIntakeMode !== 'chat') {
            document.querySelectorAll('input[name="life_impact"]:checked').forEach(cb => {
                lifeImpactSelected.push(cb.value);
            });
        }

        const redFlagsSelected = [];
        document.querySelectorAll('input[name="red_flag"]:checked').forEach(cb => {
            redFlagsSelected.push(cb.value);
        });

        const assessmentResult = ClinicalEngine.analyzeAssessment({
            pointId: currentSelectedPoint.id,
            painArea: currentSelectedPoint.region,
            painSeverity: internalPainScore,
            painDuration,
            answers: { 
                q1: q1Val, 
                q1Values, 
                q1Labels, 
                q2: q2Val, 
                q2Values, 
                q2Text, 
                q4: q4Val, 
                q4Values, 
                q4Text, 
                associatedLabels,
                allSelectedSymptoms
            },
            redFlagsSelected,
            chronicDiseases,
            patientVitals: { age, gender, weight, height },
            userNotes
        });

        // جلب التمارين المخصصة سريرياً للحالة بناءً على التشخيص ووصف المريض (اليوم 1)
        const day1Exercises = getExercisesForPoint(currentSelectedPoint.id, 1, {
            answers: { q1: q1Val, q2: q2Val, q2Text, q4: q4Val, q4Text, associatedLabels },
            userNotes,
            primaryDiagnosisKey: assessmentResult.primaryDiagnosisKey
        });

        const rawPName = clinicalDialogueState.patientName || activePatient?.name || document.getElementById('patient-name')?.value?.trim();
        const pName = (rawPName && rawPName !== 'المراجع الكريم') ? rawPName : '';
        const pPhone = clinicalDialogueState.patientPhone || activePatient?.phone || document.getElementById('sub-phone')?.value || '';

        currentAssessmentData = {
            ...assessmentResult,
            patientName: pName,
            patientPhone: pPhone,
            age,
            gender,
            weight,
            height,
            pointId: currentSelectedPoint.id,
            painAreaTitle: currentSelectedPoint.title,
            painAreaKey: currentSelectedPoint.id,
            painSeverity: explicitPain, // null if not explicitly entered by patient
            internalPainScore: painSeverity,
            hasExplicitPain,
            painSeverityText: hasExplicitPain ? `${explicitPain} / 10` : 'تقييم سريري مستند للأعراض',
            painDuration,
            userNotes,
            allSelectedSymptoms,
            lifeImpactSelected,
            answers: { q1: q1Val, q1Values, q2: q2Val, q2Text, q4: q4Val, q4Text, associatedLabels },
            recommendedExercises: Array.isArray(day1Exercises) ? day1Exercises.filter(Boolean) : [],
            date: new Date().toISOString()
        };

        const painDisplayStr = hasExplicitPain ? `${explicitPain}/10` : 'مستند للأعراض السريرية';

        // إشعار طارئ للإدارة في حال وجود علامات حمراء تستوجب المتابعة
        if (redFlagsSelected && redFlagsSelected.length > 0) {
            const pName = activePatient?.name || document.getElementById('sub-name')?.value?.trim() || 'مراجع (فحص سريري جديد)';
            const pPhone = activePatient?.phone || '';
            const flagLabels = redFlagsSelected.map(id => {
                const found = ClinicalEngine.RED_FLAGS_CRITERIA.find(rf => rf.id === id);
                return found ? found.label : id;
            }).join('، ');

            SmartDB.addAdminNotification({
                type: 'red_flag',
                title: `🚨 تنبيه طارئ (علامات حمراء): ${pName}`,
                message: `سجل المراجع ${pName} أعراض تستوجب مراجعة طبية عاجلة: [${flagLabels}] في منطقة ${currentSelectedPoint.title} - مستوى الألم: ${painDisplayStr}`,
                patientId: activePatient?.id || null,
                patientName: pName,
                patientPhone: pPhone,
                meta: {
                    painArea: currentSelectedPoint.title,
                    flags: flagLabels,
                    severity: painDisplayStr
                }
            });
        }

        // ترحيل وتوثيق بيانات المريض والتشخيص إلى قاعدة بيانات الإدارة فوراً
        const targetPatientId = activePatient?.patientId || ('pat_' + (pPhone ? pPhone.replace(/\D/g, '') : Date.now()));
        const patientRecord = {
            patientId: targetPatientId,
            name: pName || 'مراجع جديد',
            phone: pPhone || '',
            age: clinicalDialogueState.patientVitals?.age || age,
            gender: gender,
            weight: clinicalDialogueState.patientVitals?.weight || weight,
            height: clinicalDialogueState.patientVitals?.height || height,
            painArea: currentSelectedPoint?.title || 'العمود الفقري والمفاصل',
            painLevel: painSeverity || explicitPain,
            notes: userNotes || (clinicalDialogueState.collectedSymptoms ? clinicalDialogueState.collectedSymptoms.join(' - ') : ''),
            createdAt: activePatient?.createdAt || new Date().toISOString(),
            lastUpdated: new Date().toISOString()
        };
        try {
            await SmartDB.savePatient(patientRecord);
            currentAssessmentData.patientId = targetPatientId;
            await SmartDB.saveAssessment(currentAssessmentData);
            SmartDB.setCurrentSessionPatientId(targetPatientId);
            activePatient = patientRecord;

            // إشعار الإدارة الفوري بإتمام الفحص السريري وتجهيز التقرير
            SmartDB.addAdminNotification({
                type: 'new_registration',
                title: `🩺 فحص سريري جديد: ${patientRecord.name}`,
                message: `أتم المراجع ${patientRecord.name} (${patientRecord.phone || 'بدون هاتف'}) استشارته السريرية بنجاح لموضع (${currentSelectedPoint.title}). التشخيص: [${assessmentResult.primaryDiagnosis?.title || 'مكتمل'}] - مستوى الألم: ${painDisplayStr}`,
                patientId: targetPatientId,
                patientName: patientRecord.name,
                patientPhone: patientRecord.phone
            });
        } catch (dbErr) {
            console.warn('Admin data persistence notice:', dbErr);
        }

        // إيقاف أي صوت شات سابق لمنع تسربه إلى صفحة التقرير
        if (typeof Wada3anAiEngine !== 'undefined') {
            Wada3anAiEngine.stopSpeaking();
        }

        displayDiagnosticReport(currentAssessmentData);
        goToStep(3);
        setTimeout(() => {
            playStationAudio('diagnosis_guide');
        }, 600);
    } catch (err) {
        console.error('Error in runDiagnosticAnalysis:', err);
        showToast('حدث خطأ أثناء إعداد التقرير، يرجى المحاولة ثانية', 'error');
    }
}

// إرسال ملخص التقرير المباشر لواتساب المعالج بنقرة واحدة
function sendWhatsAppDiagnosticReport() {
    if (!currentAssessmentData) return;

    const data = currentAssessmentData;
    const name = activePatient?.name || document.getElementById('sub-name')?.value.trim() || 'مراجع وداعاً للألم';
    
    let text = `مرحباً دكتور، قمت بإجراء فحص ذاتي عبر نظام Smart Check Pro في (وداعاً للألم - تقنية الكايروبراكتيك اليدوية)، وأود استشارتكم:\n\n`;
    text += `👤 *الاسم:* ${name}\n`;
    text += `🎯 *موضع الشكوى:* ${data.painAreaTitle}\n`;
    text += `🔬 *التشخيص الأرجح:* ${data.primaryDiagnosis}\n`;
    if (data.hasExplicitPain && data.painSeverity) {
        text += `📊 *مستوى الألم المحدد:* ${data.painSeverity} / 10\n`;
    } else {
        text += `📊 *مستوى الألم:* تقييم سريري مستند لوصف الأعراض والشكوى الحركية\n`;
    }
    text += `⚡ *احتمالية التشخيص:* ${data.probability}%\n`;
    if (data.lifeImpactSelected && data.lifeImpactSelected.length > 0) {
        text += `🎯 *الأهداف الحركية المستهدفة:* ${data.lifeImpactSelected.join('، ')}\n`;
    }
    if (data.bmiInfo) {
        text += `⚖️ *مؤشر كتلة الجسم (BMI):* ${data.bmiInfo.value} (${data.bmiInfo.status})\n`;
    }
    if (data.biomechanicalIndex) {
        text += `🧬 *مؤشر الإجهاد الميكانيكي:* ${data.biomechanicalIndex.score}% (${data.biomechanicalIndex.level})\n`;
    }
    if (data.userNotes) {
        text += `📝 *وصف الحالة:* ${data.userNotes}\n`;
    }
    text += `\nأرغب في حجز جلسة تقييم سريري وتقويم يدوي (كايروبراكتيك) لتحديد خطة علاجي المناسبة.`;

    const encoded = encodeURIComponent(text);
    window.open(`https://wa.me/${CLINIC_WHATSAPP_NUMBER}?text=${encoded}`, '_blank');
}

function getChiropracticDefinitionHTML() {
    return `
        <div style="background: #0f172a; border-radius: 14px; padding: 20px; border: 1.5px solid var(--primary-gold); margin-top: 25px; margin-bottom: 25px; box-shadow: 0 8px 30px rgba(0,0,0,0.5);">
            <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 14px; flex-wrap: wrap; gap: 10px;">
                <div>
                    <h3 style="color: var(--primary-gold); margin: 0; font-size: 1.2em; font-weight: 800;">✨ ما هي تقنية الكايروبراكتيك اليدوية (Chiropractic Technique)؟</h3>
                    <div style="color: #94a3b8; font-size: 0.84em; margin-top: 3px;">العلم الطبي المتخصص في تقويم مفاصل العمود الفقري يدوياً لتحرير الضغط العصبي وإزالة أسباب الألم الحقيقية.</div>
                </div>
                <span style="color: #10b981; font-weight: bold; font-size: 0.84em; background: rgba(16, 185, 129, 0.15); padding: 4px 10px; border-radius: 6px; border: 1px solid #10b981;">تحسن ملموس وفارق واضح من أول جلسة</span>
            </div>
            
            <!-- قائمة ميزات الكايروبراكتيك الأنيقة والذكية على شكل نقاط منسقة بدون كروت ضخمة -->
            <div style="display: flex; flex-direction: column; gap: 8px;">
                <div style="display: flex; align-items: flex-start; gap: 10px; background: rgba(17, 24, 39, 0.8); border: 1px solid rgba(212, 175, 55, 0.25); border-radius: 8px; padding: 10px 14px;">
                    <span style="font-size: 1.15em; line-height: 1.2;">🎯</span>
                    <div style="flex: 1;">
                        <span style="color: var(--primary-gold); font-weight: bold; font-size: 0.9em;">علاج السبب الميكانيكي الجذري: </span>
                        <span style="color: #10b981; font-weight: bold; font-size: 0.88em;">إعادة اصطفاف الفقرات والمفاصل يدوياً بدقة</span>
                        <div style="color: #cbd5e1; font-size: 0.82em; margin-top: 2px;">تفريغ فوري للضغط الانضغاطي عن جذور الأعصاب والأوتار المشدودة.</div>
                    </div>
                </div>

                <div style="display: flex; align-items: flex-start; gap: 10px; background: rgba(17, 24, 39, 0.8); border: 1px solid rgba(212, 175, 55, 0.25); border-radius: 8px; padding: 10px 14px;">
                    <span style="font-size: 1.15em; line-height: 1.2;">💧</span>
                    <div style="flex: 1;">
                        <span style="color: var(--primary-gold); font-weight: bold; font-size: 0.9em;">تغذية وتروية الغضاريف: </span>
                        <span style="color: #10b981; font-weight: bold; font-size: 0.88em;">تفريغ الضغط واستعادة تدفق السائل الزلالي</span>
                        <div style="color: #cbd5e1; font-size: 0.82em; margin-top: 2px;">تغذية الديسك ومنع تآكله واستعادة المرونة الفسيولوجية الطبيعية.</div>
                    </div>
                </div>

                <div style="display: flex; align-items: flex-start; gap: 10px; background: rgba(17, 24, 39, 0.8); border: 1px solid rgba(212, 175, 55, 0.25); border-radius: 8px; padding: 10px 14px;">
                    <span style="font-size: 1.15em; line-height: 1.2;">🛡️</span>
                    <div style="flex: 1;">
                        <span style="color: var(--primary-gold); font-weight: bold; font-size: 0.9em;">الأمان والسلامة الصحية 100%: </span>
                        <span style="color: #10b981; font-weight: bold; font-size: 0.88em;">علاج طبيعي يدوي بدون أدوية ولا جراحة</span>
                        <div style="color: #cbd5e1; font-size: 0.82em; margin-top: 2px;">تجنب أضرار المسكنات ومخاطر العمليات الجراحية والالتصاقات.</div>
                    </div>
                </div>

                <div style="display: flex; align-items: flex-start; gap: 10px; background: rgba(17, 24, 39, 0.8); border: 1px solid rgba(212, 175, 55, 0.25); border-radius: 8px; padding: 10px 14px;">
                    <span style="font-size: 1.15em; line-height: 1.2;">⚡</span>
                    <div style="flex: 1;">
                        <span style="color: var(--primary-gold); font-weight: bold; font-size: 0.9em;">سرعة الاستجابة والشفاء: </span>
                        <span style="color: #10b981; font-weight: bold; font-size: 0.88em;">فارق ملموس وراحة ملحوظة من أول جلسة</span>
                        <div style="color: #cbd5e1; font-size: 0.82em; margin-top: 2px;">استعادة سريعة للقدرة على المشي والعمل والجلوس والنوم براحة تامة.</div>
                    </div>
                </div>

                <div style="display: flex; align-items: flex-start; gap: 10px; background: rgba(17, 24, 39, 0.8); border: 1px solid rgba(56, 189, 248, 0.35); border-radius: 8px; padding: 10px 14px;">
                    <span style="font-size: 1.15em; line-height: 1.2;">👨‍⚕️</span>
                    <div style="flex: 1;">
                        <span style="color: #38bdf8; font-weight: bold; font-size: 0.9em;">تحديد عدد الجلسات وخصوصية الحالة: </span>
                        <span style="color: #38bdf8; font-weight: bold; font-size: 0.88em;">المعالج المختص هو الذي يحدد عدد الجلسات</span>
                        <div style="color: #cbd5e1; font-size: 0.82em; margin-top: 2px;">خطة موجهة لكل مراجع بناءً على التقييم السريري الدقيق بعد أول جلسة فحص.</div>
                    </div>
                </div>
            </div>

            <div style="margin-top: 12px; background: rgba(56, 189, 248, 0.08); padding: 10px 14px; border-radius: 8px; border-right: 3px solid #38bdf8; color: #cbd5e1; font-size: 0.82em; line-height: 1.6;">
                💡 <strong>تنويه سريري هام:</strong> كل حالة لها خصوصيتها التشريحية؛ لذلك لا يتم توحيد عدد الجلسات لجميع المرضى، بل يحدد المعالج المختص احتياجك الفعلي بدقة بعد جلسة الفحص والتقييم السريري المباشر.
            </div>
        </div>
    `;
}

// بطاقة حاسبة المقارنة والتوفير المالي (Cost Avoidance & Psychological Contrast Calculator)
function getTreatmentCostCalculatorHTML() {
    return `
        <details class="no-print" style="background: linear-gradient(135deg, #0f172a 0%, #17253d 100%); border: 1.5px solid var(--primary-gold); border-radius: 14px; margin-bottom: 22px; box-shadow: 0 6px 25px rgba(0,0,0,0.35); overflow: hidden;">
            <summary style="padding: 14px 18px; cursor: pointer; color: var(--primary-gold); font-weight: 800; font-size: 1em; display: flex; align-items: center; justify-content: space-between; list-style: none; user-select: none;">
                <span style="display: flex; align-items: center; gap: 8px;">
                    <span style="font-size: 1.3em;">💰</span>
                    <span>مقارنة التوفير والأمان: الكايروبراكتيك مقابل الجراحة والأدوية</span>
                </span>
                <span style="background: rgba(16, 185, 129, 0.18); border: 1px solid #10b981; color: #6ee7b7; padding: 4px 12px; border-radius: 6px; font-size: 0.82em; font-weight: bold;">
                    عرض المقارنة ⬅️
                </span>
            </summary>
            <div style="padding: 16px 18px; border-top: 1px solid rgba(212, 175, 55, 0.2);">
                <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(280px, 1fr)); gap: 14px;">
                    <div style="background: rgba(239, 68, 68, 0.08); border: 1.5px solid rgba(239, 68, 68, 0.4); border-radius: 10px; padding: 16px;">
                        <div style="color: #ef4444; font-weight: bold; font-size: 0.95em; margin-bottom: 8px;">❌ مسار المسكنات والجراحة (تكلفة باهظة وقلق دائم):</div>
                        <ul style="color: #fca5a5; font-size: 0.86em; line-height: 1.8; margin: 0; padding-right: 18px;">
                            <li>مسكنات وأدوية دورية تخفي الألم مؤقتاً وتجهد الكلى والمعدة.</li>
                            <li>صور رنين متكررة وفحوصات تكلف مئات الدنانير دون حل ميكانيكي حقيقي.</li>
                            <li>شبح العمليات الجراحية المعقدة وفترات النقاهة الطويلة ومخاطر الالتصاقات.</li>
                            <li>استمرار القلق والحد من حرية الحركة والعمل مع العائلة.</li>
                        </ul>
                    </div>

                    <div style="background: rgba(16, 185, 129, 0.08); border: 1.5px solid rgba(16, 185, 129, 0.4); border-radius: 10px; padding: 16px;">
                        <div style="color: #10b981; font-weight: bold; font-size: 0.95em; margin-bottom: 8px;">✅ مسار الكايروبراكتيك اليدوي في وداعاً للألم:</div>
                        <ul style="color: #6ee7b7; font-size: 0.86em; line-height: 1.8; margin: 0; padding-right: 18px;">
                            <li>علاج السبب الميكانيكي وتفريغ ضغط جذر العصب من الجلسة الأولى.</li>
                            <li>طبيعي وآمن 100% يدوياً بدون أي أدوية ولا حقن كورتيزون ولا جراحة.</li>
                            <li>تحسن ملموس وفارق واضح يختصر عليك شهوراً من التعب والمراجعات.</li>
                            <li>استعادة فورية لراحتك، نومك العميق، وقدرتك على الصلاة والعمل.</li>
                        </ul>
                    </div>
                </div>
            </div>
        </details>
    `;
}

// بطاقة خدمة قراءة الرنين المغناطيسي المجانية (MRI Second Opinion Card)
function getMriConsultationCardHTML() {
    return `
        <div class="no-print" style="background: linear-gradient(135deg, rgba(56, 189, 248, 0.12) 0%, rgba(15, 23, 42, 0.95) 100%); border: 1.5px solid #38bdf8; border-radius: 14px; padding: 22px; margin-bottom: 25px; box-shadow: 0 8px 30px rgba(56, 189, 248, 0.15);">
            <div style="display: flex; justify-content: space-between; align-items: center; flex-wrap: wrap; gap: 15px;">
                <div style="flex: 1; min-width: 270px;">
                    <div style="display: flex; align-items: center; gap: 8px; margin-bottom: 6px;">
                        <span style="font-size: 1.5em;">🩻</span>
                        <h4 style="color: #38bdf8; margin: 0; font-size: 1.2em;">خدمة قراءة وتفسير تقرير الرنين المغناطيسي (MRI) مجاناً</h4>
                    </div>
                    <p style="color: #e2e8f0; font-size: 0.92em; line-height: 1.6; margin: 0 0 6px 0;">
                        لديك صورة رنين مغناطيسي (MRI) أو أشعة سينية سابقة للعمود الفقري أو المفاصل؟ 
                        أرسل التقرير أو الصور مباشرة للمعالج عبر واتساب ليقوم بقراءتها وتوضيح الخلل الميكانيكي لك <strong>مجاناً وبشكل مفصل</strong>.
                    </p>
                    <div style="color: #fef08a; font-size: 0.82em;">✓ استشارة سريرية وتوجيه دقيق بدون أي التزام مالي مسبق.</div>
                </div>
                <div>
                    <a href="https://wa.me/${CLINIC_WHATSAPP_NUMBER}?text=${encodeURIComponent('مرحباً دكتور، لدي صورة/تقرير رنين مغناطيسي (MRI) وأود إرسالها لقراءتها وتحديد خطة العلاج المناسبة لحالتي.')}" target="_blank" style="background: linear-gradient(135deg, #38bdf8 0%, #0284c7 100%); color: #0a0e14; padding: 12px 24px; border-radius: 8px; text-decoration: none; font-weight: bold; font-size: 0.95em; display: inline-flex; align-items: center; gap: 8px; box-shadow: 0 4px 15px rgba(56, 189, 248, 0.3);">
                        💬 أرسل صورة الرنين للمعالج
                    </a>
                </div>
            </div>
        </div>
    `;
}

// محاكي ضغط الفقرات وتفريغ الأعصاب التفاعلي المطور (Advanced 3D Biomechanical Spine Simulator)
function getInteractiveSpinalSimulatorHTML(painAreaTitle = 'العمود الفقري') {
    return `
        <details class="no-print spinal-simulator-card" style="background: linear-gradient(135deg, #070d18 0%, #101c2e 100%); border: 1.5px solid var(--primary-gold); border-radius: 14px; margin-top: 14px; margin-bottom: 20px; box-shadow: 0 8px 30px rgba(0,0,0,0.5); overflow: hidden;">
            <summary style="padding: 14px 18px; cursor: pointer; color: var(--primary-gold); font-weight: 800; font-size: 1em; display: flex; align-items: center; justify-content: space-between; list-style: none; user-select: none;">
                <span style="display: flex; align-items: center; gap: 8px;">
                    <span style="font-size: 1.4em;">🩻</span>
                    <span>محاكي آلية ضغط الديسك وتفريغ العصب (Live 3D)</span>
                </span>
                <span style="background: rgba(212, 175, 55, 0.2); border: 1px solid var(--primary-gold); color: #fef08a; padding: 4px 12px; border-radius: 6px; font-size: 0.82em; font-weight: bold;">
                    🔬 انقر للمشاهدة والتفاعل ⬅️
                </span>
            </summary>
            <div style="padding: 16px 14px; border-top: 1px solid rgba(212, 175, 55, 0.2);">
            
            <!-- ترويسة المحاكي -->
            <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 10px; flex-wrap: wrap; gap: 8px;">
                <div style="display: flex; align-items: center; gap: 8px;">
                    <span style="font-size: 1.6em;">🩻</span>
                    <div>
                        <h3 style="color: var(--primary-gold); margin: 0; font-size: 1.15em; font-weight: 800;">محاكي آلية حدوث الديسك وتفريغ الضغط عن العصب (Live 3D)</h3>
                        <div style="color: #94a3b8; font-size: 0.78em; margin-top: 2px;">توضيح سريري مبسط لكيفية فتق الديسك واصطدامه بالعصب، وكيف يحرره الكايروبراكتيك</div>
                    </div>
                </div>
                <span id="simulator-status-badge" style="background: rgba(239, 68, 68, 0.2); color: #ef4444; border: 1.5px solid #ef4444; padding: 5px 10px; border-radius: 6px; font-size: 0.8em; font-weight: bold;">
                    ⚠️ المرحلة 1: انضغاط حاد وبروز الديسك على العصب
                </span>
            </div>

            <!-- توجيه إرشادي لاستخدام مؤشر المحاكاة -->
            <div style="background: rgba(212, 175, 55, 0.1); border: 1px solid var(--primary-gold); border-radius: 8px; padding: 8px 12px; margin-bottom: 10px; display: flex; align-items: center; gap: 8px;">
                <span style="font-size: 1.2em;">👆</span>
                <div style="color: #fef08a; font-size: 0.82em; line-height: 1.5;">
                    <strong>توجيه المريض:</strong> اسحب <strong>مؤشر المحاكاة</strong> بالأسفل أو اضغط على <strong>المراحل (1، 2، 3)</strong> لمشاهدة كيف يتباعد عظم الفقرتين وتتحرر جذور الأعصاب مباشرة من قبضة الديسك.
                </div>
            </div>

            <!-- منطقة المحاكاة البصرية الكبيرة SVG -->
            <div style="display: flex; justify-content: center; align-items: center; background: radial-gradient(circle at center, #0a1322 0%, #03060c 100%); border-radius: 12px; padding: 8px 4px; border: 1.5px solid #1e293b; margin-bottom: 10px; position: relative; overflow: hidden;">
                <svg id="spinal-sim-svg" viewBox="0 0 860 460" width="100%" class="spinal-sim-svg" style="max-width: 860px; display: block; margin: 0 auto; filter: drop-shadow(0 8px 25px rgba(0,0,0,0.7));">
                    <defs>
                        <!-- تدرج الفقرة العلوية -->
                        <linearGradient id="boneGradUpper" x1="0%" y1="0%" x2="0%" y2="100%">
                            <stop offset="0%" stop-color="#ffffff"/>
                            <stop offset="35%" stop-color="#f1f5f9"/>
                            <stop offset="75%" stop-color="#cbd5e1"/>
                            <stop offset="100%" stop-color="#94a3b8"/>
                        </linearGradient>

                        <!-- تدرج الفقرة السفلية -->
                        <linearGradient id="boneGradLower" x1="0%" y1="0%" x2="0%" y2="100%">
                            <stop offset="0%" stop-color="#ffffff"/>
                            <stop offset="35%" stop-color="#f1f5f9"/>
                            <stop offset="75%" stop-color="#cbd5e1"/>
                            <stop offset="100%" stop-color="#94a3b8"/>
                        </linearGradient>

                        <!-- تدرجات الديسك حسب الحالة -->
                        <linearGradient id="discGradCompressed" x1="0%" y1="0%" x2="100%" y2="0%">
                            <stop offset="0%" stop-color="#dc2626"/>
                            <stop offset="60%" stop-color="#b91c1c"/>
                            <stop offset="100%" stop-color="#991b1b"/>
                        </linearGradient>

                        <linearGradient id="discGradMedium" x1="0%" y1="0%" x2="100%" y2="0%">
                            <stop offset="0%" stop-color="#f59e0b"/>
                            <stop offset="60%" stop-color="#d97706"/>
                            <stop offset="100%" stop-color="#b45309"/>
                        </linearGradient>

                        <linearGradient id="discGradHealthy" x1="0%" y1="0%" x2="100%" y2="0%">
                            <stop offset="0%" stop-color="#10b981"/>
                            <stop offset="60%" stop-color="#059669"/>
                            <stop offset="100%" stop-color="#047857"/>
                        </linearGradient>

                        <!-- تدرج النتوء الغضروفي اللامع ثلاثي الأبعاد -->
                        <radialGradient id="herniaGrad" cx="30%" cy="30%" r="70%">
                            <stop offset="0%" stop-color="#fca5a5"/>
                            <stop offset="25%" stop-color="#ef4444"/>
                            <stop offset="70%" stop-color="#b91c1c"/>
                            <stop offset="100%" stop-color="#450a0a"/>
                        </radialGradient>

                        <radialGradient id="herniaMediumGrad" cx="30%" cy="30%" r="70%">
                            <stop offset="0%" stop-color="#fef08a"/>
                            <stop offset="30%" stop-color="#f59e0b"/>
                            <stop offset="75%" stop-color="#d97706"/>
                            <stop offset="100%" stop-color="#78350f"/>
                        </radialGradient>

                        <radialGradient id="herniaHealthyGrad" cx="30%" cy="30%" r="70%">
                            <stop offset="0%" stop-color="#6ee7b7"/>
                            <stop offset="35%" stop-color="#10b981"/>
                            <stop offset="75%" stop-color="#059669"/>
                            <stop offset="100%" stop-color="#064e3b"/>
                        </radialGradient>

                        <!-- تدرج العصب الشوكي -->
                        <linearGradient id="nerveGradCompressed" x1="0%" y1="0%" x2="100%" y2="0%">
                            <stop offset="0%" stop-color="#fef08a"/>
                            <stop offset="30%" stop-color="#facc15"/>
                            <stop offset="70%" stop-color="#eab308"/>
                            <stop offset="100%" stop-color="#ca8a04"/>
                        </linearGradient>

                        <linearGradient id="nerveGradMedium" x1="0%" y1="0%" x2="100%" y2="0%">
                            <stop offset="0%" stop-color="#fef9c3"/>
                            <stop offset="40%" stop-color="#facc15"/>
                            <stop offset="80%" stop-color="#eab308"/>
                            <stop offset="100%" stop-color="#a16207"/>
                        </linearGradient>

                        <linearGradient id="nerveGradHealthy" x1="0%" y1="0%" x2="100%" y2="0%">
                            <stop offset="0%" stop-color="#fef08a"/>
                            <stop offset="50%" stop-color="#facc15"/>
                            <stop offset="100%" stop-color="#ca8a04"/>
                            <stop offset="100%" stop-color="#ca8a04"/>
                        </linearGradient>

                        <!-- فلتر الظل ثلاثي الأبعاد -->
                        <filter id="herniaShadow" x="-20%" y="-20%" width="140%" height="140%">
                            <feGaussianBlur in="SourceAlpha" stdDeviation="5"/>
                            <feOffset dx="3" dy="4" result="offsetblur"/>
                            <feComponentTransfer>
                                <feFuncA type="linear" slope="0.6"/>
                            </feComponentTransfer>
                            <feMerge> 
                                <feMergeNode/>
                                <feMergeNode in="SourceGraphic"/>
                            </feMerge>
                        </filter>
                    </defs>

                    <!-- خلفية المخرج العصبي التشريحي المتناسق (Intervertebral Foramen Glow) -->
                    <ellipse cx="430" cy="198" rx="38" ry="58" fill="rgba(56, 189, 248, 0.05)" stroke="rgba(56, 189, 248, 0.25)" stroke-dasharray="4,4"/>

                    <!-- ================= 1. العصب الشوكي (ملاصق تماماً لخلفية الديسك والمخرج العصبي) ================= -->
                    <g id="sim-nerve-group">
                        <!-- مسار العصب الخارجي العريض -->
                        <path id="sim-nerve-path" d="M 425,30 C 425,110 478,181 425,260 L 425,440" fill="none" stroke="url(#nerveGradCompressed)" stroke-width="24" stroke-linecap="round" stroke-linejoin="round" style="transition: d 0.08s ease;"/>
                        <!-- لب العصب اللامع الداخلي -->
                        <path id="sim-nerve-core" d="M 425,30 C 425,110 478,181 425,260 L 425,440" fill="none" stroke="#fef08a" stroke-width="5" stroke-linecap="round" stroke-linejoin="round" opacity="0.8" style="transition: d 0.08s ease;"/>
                    </g>

                    <!-- ================= 2. الفقرة العلوية L4 (جسم الفقرة + النتوءات الخلفية المتناسقة) ================= -->
                    <g id="sim-upper-group">
                        <!-- القوس والنتوء المفصلي والشوكي الخلفي بأبعاد تشريحية واقعية متناسقة -->
                        <path d="M 388,102 L 440,102 Q 465,85 480,95 L 475,120 L 540,135 Q 535,150 475,140 L 440,135 L 388,140 Z" fill="#e2e8f0" stroke="#64748b" stroke-width="2"/>
                        <!-- نتوء مفصلي علوي خفيف -->
                        <path d="M 440,102 Q 455,75 465,78 L 460,102 Z" fill="#cbd5e1" stroke="#64748b" stroke-width="1.5"/>
                        
                        <!-- جسم الفقرة العلوية الأمامي (Anterior Vertebral Body) -->
                        <path d="M 175,65 C 240,55 330,55 390,65 L 390,165 C 330,173 240,173 175,165 Z" fill="url(#boneGradUpper)" stroke="#64748b" stroke-width="2.5"/>
                        <!-- حافة العظم واللمعان التشريحي -->
                        <path d="M 180,72 C 240,63 325,63 385,72" fill="none" stroke="#ffffff" stroke-width="3" opacity="0.9"/>
                        <path d="M 180,158 C 240,166 325,166 385,158" fill="none" stroke="#94a3b8" stroke-width="2"/>
                    </g>

                    <!-- ================= 3. الغضروف / الديسك المدمج بالكامل مع النتوء (Unified Herniated Disc) ================= -->
                    <g id="sim-disc-group">
                        <!-- ظل وهالة النتوء المتصل بالديسك -->
                        <ellipse id="sim-hernia-aura" cx="455" cy="181" rx="35" ry="24" fill="rgba(239, 68, 68, 0.35)" filter="url(#herniaShadow)"/>

                        <!-- مسار الديسك الموحد والمتصل تشريحياً بالنتوء بدون أي انفصال -->
                        <path id="sim-disc-main" d="M 175,165 C 240,171 320,171 385,165 C 410,167 465,160 465,181 C 465,202 410,195 385,197 C 320,191 240,191 175,197 Z" fill="url(#discGradCompressed)" stroke="#b91c1c" stroke-width="2.5" style="transition: all 0.08s ease;"/>

                        <!-- ألياف الحلقات الليفية الممتدة والمنحنية نحو النتوء (Concentric Annulus Fibrosus Fibers) -->
                        <path id="sim-annular-rib-1" d="M 205,166 Q 208,181 205,196" fill="none" stroke="#7f1d1d" stroke-width="3.5" stroke-linecap="round"/>
                        <path id="sim-annular-rib-2" d="M 235,166 Q 240,181 235,196" fill="none" stroke="#7f1d1d" stroke-width="3.5" stroke-linecap="round"/>
                        <path id="sim-annular-rib-3" d="M 265,166 Q 272,181 265,196" fill="none" stroke="#7f1d1d" stroke-width="3.5" stroke-linecap="round"/>
                        <path id="sim-annular-rib-4" d="M 295,166 Q 306,181 295,196" fill="none" stroke="#7f1d1d" stroke-width="3.5" stroke-linecap="round"/>
                        <path id="sim-annular-rib-5" d="M 325,166 Q 340,181 325,196" fill="none" stroke="#7f1d1d" stroke-width="3.5" stroke-linecap="round"/>
                        <path id="sim-annular-rib-6" d="M 355,166 Q 380,181 355,196" fill="none" stroke="#7f1d1d" stroke-width="3.5" stroke-linecap="round"/>
                        <path id="sim-annular-rib-7" d="M 380,166 Q 425,181 380,196" fill="none" stroke="#7f1d1d" stroke-width="3.5" stroke-linecap="round"/>
                        <path id="sim-annular-rib-8" d="M 395,169 Q 455,181 395,193" fill="none" stroke="#ef4444" stroke-width="2.5" stroke-linecap="round"/>

                        <!-- لمعان قبة النتوء ثلاثي الأبعاد المندمج فوق قمة الانتفاخ الغضروفي -->
                        <ellipse id="sim-hernia-highlight" cx="445" cy="175" rx="14" ry="8" fill="#ffffff" opacity="0.85" style="transition: all 0.08s ease;"/>
                        <circle id="sim-hernia-sparkle" cx="455" cy="181" r="3.5" fill="#ffffff" opacity="0.75"/>
                    </g>

                    <!-- ================= 4. الفقرة السفلية L5 (المتحركة مع التباعد) ================= -->
                    <g id="sim-lower-group" transform="translate(0, 0)" style="transition: transform 0.08s ease;">
                        <!-- القوس والنتوء المفصلي والشوكي السفلي بأبعاد متناسقة -->
                        <path d="M 388,225 L 440,225 Q 465,210 480,220 L 475,245 L 540,260 Q 535,275 475,265 L 440,260 L 388,265 Z" fill="#e2e8f0" stroke="#64748b" stroke-width="2"/>
                        <!-- نتوء مفصلي سفلي -->
                        <path d="M 440,245 Q 455,270 465,268 L 460,245 Z" fill="#cbd5e1" stroke="#64748b" stroke-width="1.5"/>
                        
                        <!-- جسم الفقرة السفلية (Lower Vertebral Body) -->
                        <path d="M 175,197 C 240,189 330,189 390,197 L 390,297 C 330,305 240,305 175,297 Z" fill="url(#boneGradLower)" stroke="#64748b" stroke-width="2.5"/>
                        <!-- لمعان وحواف العظم -->
                        <path d="M 180,204 C 240,196 325,196 385,204" fill="none" stroke="#ffffff" stroke-width="3" opacity="0.9"/>
                        <path d="M 180,290 C 240,298 325,298 385,290" fill="none" stroke="#94a3b8" stroke-width="2"/>
                    </g>

                    <!-- ================= 5. شرارات الألم والنبض العصبي (Sciatica Electric Sparks) ================= -->
                    <g id="sim-nerve-sparks" style="display: block;">
                        <!-- صواعق كهربائية تنبثق مباشرة من نقطة انضغاط العصب واصطدامه بالديسك -->
                        <path d="M 465,175 L 495,155 L 485,178 L 515,162" fill="none" stroke="#ef4444" stroke-width="3.5" stroke-linecap="round"/>
                        <path d="M 468,188 L 502,192 L 490,205 L 520,210" fill="none" stroke="#facc15" stroke-width="3" stroke-linecap="round"/>
                        <path d="M 462,202 L 492,228 L 482,238 L 508,255" fill="none" stroke="#ef4444" stroke-width="3" stroke-linecap="round"/>
                        <circle cx="466" cy="186" r="8" fill="#ef4444" opacity="0.8"/>
                    </g>

                    <!-- ================= 6. البطاقات والنصوص التوضيحية التشريحية المتقنة ================= -->
                    <!-- بطاقة الفقرة العلوية -->
                    <g>
                        <rect x="25" y="90" width="135" height="30" rx="6" fill="#0f172a" stroke="#64748b" stroke-width="1.5"/>
                        <text x="92" y="110" fill="#ffffff" font-size="12" font-weight="bold" text-anchor="middle">فقرة علوية (L4)</text>
                        <line x1="160" y1="105" x2="190" y2="105" stroke="#94a3b8" stroke-width="2"/>
                        <circle cx="190" cy="105" r="3" fill="#94a3b8"/>
                    </g>

                    <!-- بطاقة الديسك الغضروفي -->
                    <g>
                        <rect x="20" y="165" width="140" height="30" rx="6" fill="#0f172a" stroke="#ef4444" stroke-width="1.5"/>
                        <text x="90" y="185" fill="#fca5a5" font-size="11.5" font-weight="bold" text-anchor="middle">الديسك (حلقات ليفية)</text>
                        <line x1="160" y1="180" x2="185" y2="180" stroke="#ef4444" stroke-width="2"/>
                        <circle cx="185" cy="180" r="3" fill="#ef4444"/>
                    </g>

                    <!-- بطاقة الفقرة السفلية -->
                    <g>
                        <rect x="25" y="240" width="135" height="30" rx="6" fill="#0f172a" stroke="#64748b" stroke-width="1.5"/>
                        <text x="92" y="260" fill="#ffffff" font-size="12" font-weight="bold" text-anchor="middle">فقرة سفلية (L5)</text>
                        <line x1="160" y1="255" x2="190" y2="255" stroke="#94a3b8" stroke-width="2"/>
                        <circle cx="190" cy="255" r="3" fill="#94a3b8"/>
                    </g>

                    <!-- بطاقة النتوء الغضروفي البارز في الأعلى -->
                    <g>
                        <rect x="350" y="15" width="200" height="32" rx="7" fill="#0f172a" stroke="#ef4444" stroke-width="1.8"/>
                        <text id="sim-bulge-label-text" x="450" y="36" fill="#ef4444" font-size="12.5" font-weight="800" text-anchor="middle">🔴 انتفاخ وبروز الديسك</text>
                        <line x1="450" y1="47" x2="455" y2="145" stroke="#ef4444" stroke-width="1.8" stroke-dasharray="4,3"/>
                        <circle cx="455" cy="145" r="3.5" fill="#ef4444"/>
                    </g>

                    <!-- بطاقة العصب الشوكي على اليمين -->
                    <g>
                        <rect x="610" y="220" width="200" height="32" rx="7" fill="#0f172a" stroke="#eab308" stroke-width="1.8"/>
                        <text id="sim-nerve-label-text" x="710" y="241" fill="#facc15" font-size="12.5" font-weight="800" text-anchor="middle">⚡ عصب شوكي مضغوط</text>
                        <line x1="610" y1="236" x2="475" y2="195" stroke="#eab308" stroke-width="1.8" stroke-dasharray="4,3"/>
                        <circle cx="475" cy="195" r="3.5" fill="#eab308"/>
                    </g>

                    <!-- بطاقة المخرج العصبي -->
                    <g>
                        <rect x="620" y="65" width="180" height="28" rx="6" fill="#0f172a" stroke="#38bdf8" stroke-width="1.2"/>
                        <text x="710" y="84" fill="#38bdf8" font-size="11.5" font-weight="bold" text-anchor="middle">المخرج العصبي (Foramen)</text>
                        <line x1="620" y1="79" x2="450" y2="110" stroke="#38bdf8" stroke-width="1.5" stroke-dasharray="3,3"/>
                    </g>
                </svg>
            </div>

            <!-- لوحة التحكم المباشرة الملتصقة بالمجسم (Control Dock) -->
            <div style="background: #090f1a; border: 1.5px solid rgba(212, 175, 55, 0.4); border-radius: 12px; padding: 12px 14px; margin-bottom: 12px;">
                
                <!-- السلايدر التفاعلي المباشر -->
                <div style="margin-bottom: 10px;">
                    <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 5px; font-size: 0.82em; font-weight: bold;">
                        <span style="color: #ef4444;">🔴 حدوث الفتق والانضغاط</span>
                        <span style="color: var(--primary-gold);">⚡ حرّك المؤشر لمشاهدة مراحل التحرر ➔</span>
                        <span style="color: #10b981;">🟢 استقامة وتفريغ العصب</span>
                    </div>
                    <input type="range" id="spinal-sim-slider" min="0" max="100" value="0" oninput="updateSpinalSimulation(this.value)" style="width: 100%; height: 12px; accent-color: var(--primary-gold); cursor: pointer; border-radius: 6px;">
                </div>

                <!-- أزرار المراحل السريرية بنقرة واحدة (3-Column Grid) -->
                <div style="display: grid; grid-template-columns: 1fr 1fr 1fr; gap: 6px; margin-bottom: 10px;">
                    <button type="button" onclick="setSpinalPreset(0)" style="background: rgba(239, 68, 68, 0.18); border: 1px solid #ef4444; color: #fca5a5; padding: 8px 4px; border-radius: 6px; font-weight: bold; font-size: 0.78em; cursor: pointer; text-align: center;">
                        🔴 1. انضغاط وفتق الديسك
                    </button>
                    <button type="button" onclick="setSpinalPreset(50)" style="background: rgba(245, 158, 11, 0.18); border: 1px solid #f59e0b; color: #fef08a; padding: 8px 4px; border-radius: 6px; font-weight: bold; font-size: 0.78em; cursor: pointer; text-align: center;">
                        🟡 2. تباعد جزئي للفقرات
                    </button>
                    <button type="button" onclick="setSpinalPreset(100)" style="background: rgba(16, 185, 129, 0.18); border: 1px solid #10b981; color: #6ee7b7; padding: 8px 4px; border-radius: 6px; font-weight: bold; font-size: 0.78em; cursor: pointer; text-align: center;">
                        🟢 3. تحرر العصب بالكايروبراكتيك
                    </button>
                </div>

                <!-- شريط المؤشرات السريرية الحية المدمج بنقرة واحدة -->
                <div style="display: grid; grid-template-columns: 1fr 1fr 1fr; gap: 6px;">
                    <div style="background: #111827; border: 1px solid rgba(239, 68, 68, 0.4); border-radius: 6px; padding: 6px 4px; text-align: center;">
                        <div style="color: #94a3b8; font-size: 0.7em;">بروز نتوء الديسك:</div>
                        <div id="sim-metric-bulge" style="font-size: 1.05em; font-weight: 800; color: #ef4444;">8.8 ملم</div>
                    </div>
                    <div style="background: #111827; border: 1px solid rgba(245, 158, 11, 0.4); border-radius: 6px; padding: 6px 4px; text-align: center;">
                        <div style="color: #94a3b8; font-size: 0.7em;">الضغط على العصب:</div>
                        <div id="sim-metric-nerve" style="font-size: 1.05em; font-weight: 800; color: #f59e0b;">95%</div>
                    </div>
                    <div style="background: #111827; border: 1px solid rgba(56, 189, 248, 0.4); border-radius: 6px; padding: 6px 4px; text-align: center;">
                        <div style="color: #94a3b8; font-size: 0.7em;">المسافة بين الفقرتين:</div>
                        <div id="sim-metric-disc" style="font-size: 1.05em; font-weight: 800; color: #38bdf8;">5.5 ملم</div>
                    </div>
                </div>
            </div>

            <!-- مربع التفسير السريري المتغير -->
            <div id="sim-explanation-text" style="background: rgba(15, 23, 42, 0.95); border-right: 4px solid #ef4444; padding: 10px 14px; border-radius: 8px; font-size: 0.84em; color: #fca5a5; line-height: 1.6;">
                المرحلة 1 (انضغاط حاد): تتقارب الفقرتان بسبب تشنج العضلات أو الخلل الميكانيكي، مما يضغط النواة اللبية ويجعل الألياف الخارجية للديسك تبرز للخلف وتصطدم مباشرة بالعصب الشوكي؛ فينتج ألم حاد وتنميل ممتد للساق أو الذراع.
            </div>
            </div>
        </details>
    `;
}

function setSpinalPreset(val) {
    const slider = document.getElementById('spinal-sim-slider');
    if (slider) {
        slider.value = val;
        updateSpinalSimulation(val);
    }
}

function updateSpinalSimulation(val) {
    const v = parseInt(val);
    const ratio = v / 100; // 0 (compressed) -> 1 (decompressed)

    // 1. تباعد الفقرة السفلية
    const dy = ratio * 48; // تباعد تدريجي يصل لـ 48px
    const lowerGroup = document.getElementById('sim-lower-group');
    if (lowerGroup) {
        lowerGroup.setAttribute('transform', `translate(0, ${dy})`);
    }

    // 2. تحديث كتلة الديسك المتصلة عضوياً بالنتوء الغضروفي (Unified Annulus Fibrosus Outpouching)
    const discMain = document.getElementById('sim-disc-main');
    const baseDiscHeight = 32;
    const currentDiscHeight = baseDiscHeight + dy;
    const yTop = 165;
    const yBottom = 165 + currentDiscHeight;
    const bulgeY = yTop + (currentDiscHeight / 2);

    // موقع جدار العصب الطبيعي المستريح: X = 420
    // عند أقصى ضغط (ratio=0): قمة الألياف تندفع إلى X=470 (تخترق وتضغط العصب بـ 50px)
    // عند استطالة وسطية (ratio=0.5): قمة الألياف عند X=425 (تلامس وتضغط العصب بـ 5px)
    // عند التفريغ الكامل (ratio=1): قمة الألياف ترتد لداخل الديسك عند X=390 (فراغ أمان 30px عن العصب)
    const apexX = 470 - (ratio * 80); 
    const cUpperX = 395 + (1 - ratio) * 45; 
    const cLowerX = 395 + (1 - ratio) * 45; 
    const upperY = yTop + (currentDiscHeight * 0.12);
    const lowerY = yBottom - (currentDiscHeight * 0.12);

    if (discMain) {
        // مسار انسيابي متصل ومغلق يربط جسم الفقرات بجدار الديسك المتمدد نحو جذر العصب
        const discPathD = `M 175,${yTop} C 240,${yTop+6} 320,${yTop+6} 385,${yTop} C ${cUpperX},${upperY} ${apexX},${bulgeY - 12} ${apexX},${bulgeY} C ${apexX},${bulgeY + 12} ${cLowerX},${lowerY} 385,${yBottom} C 320,${yBottom-6} 240,${yBottom-6} 175,${yBottom} Z`;
        discMain.setAttribute('d', discPathD);
        
        if (v >= 65) {
            discMain.setAttribute('fill', 'url(#discGradHealthy)');
            discMain.setAttribute('stroke', '#059669');
        } else if (v >= 35) {
            discMain.setAttribute('fill', 'url(#discGradMedium)');
            discMain.setAttribute('stroke', '#d97706');
        } else {
            discMain.setAttribute('fill', 'url(#discGradCompressed)');
            discMain.setAttribute('stroke', '#b91c1c');
        }
    }

    // 3. تحديث ألياف الحلقات الليفية (Annulus Fibrosus concentric rings) لتنتفخ عضوياً مع النتوء
    for (let i = 1; i <= 8; i++) {
        const rib = document.getElementById(`sim-annular-rib-${i}`);
        if (rib) {
            const x = 175 + i * 28;
            // الألياف القريبة من الحافة الخلفية تندفع وتتقوس بنسبة أكبر نحو العصب عند الانضغاط
            const pushFactor = Math.pow(i / 8, 2.2); 
            const ribApexX = x + ((apexX - 385) * pushFactor) + (i * 2.5);
            rib.setAttribute('d', `M ${x},${yTop+1} Q ${ribApexX},${bulgeY} ${x},${yBottom-1}`);
            
            if (i >= 7) {
                rib.setAttribute('stroke', v >= 65 ? '#10b981' : (v >= 35 ? '#f59e0b' : '#ef4444'));
            } else {
                rib.setAttribute('stroke', v >= 65 ? '#065f46' : (v >= 35 ? '#92400e' : '#7f1d1d'));
            }
        }
    }

    // 4. هالة ولمعان قمة الانتفاخ الليفي ثلاثي الأبعاد
    const herniaAura = document.getElementById('sim-hernia-aura');
    const herniaHighlight = document.getElementById('sim-hernia-highlight');
    const herniaSparkle = document.getElementById('sim-hernia-sparkle');

    if (herniaAura) {
        herniaAura.setAttribute('cx', apexX - 4);
        herniaAura.setAttribute('cy', bulgeY);
        herniaAura.setAttribute('rx', Math.max(10, 36 - ratio * 24));
        herniaAura.setAttribute('ry', Math.max(8, 24 - ratio * 15));
        herniaAura.setAttribute('fill', v >= 65 ? 'rgba(16, 185, 129, 0.15)' : (v >= 35 ? 'rgba(245, 158, 11, 0.2)' : 'rgba(239, 68, 68, 0.35)'));
    }

    if (herniaHighlight) {
        herniaHighlight.setAttribute('cx', apexX - 16);
        herniaHighlight.setAttribute('cy', bulgeY - 6);
        herniaHighlight.setAttribute('rx', Math.max(4, 15 - ratio * 11));
        herniaHighlight.setAttribute('ry', Math.max(2, 9 - ratio * 7));
        herniaHighlight.style.opacity = v >= 75 ? '0.2' : '0.85';
    }

    if (herniaSparkle) {
        herniaSparkle.setAttribute('cx', apexX - 6);
        herniaSparkle.setAttribute('cy', bulgeY);
        herniaSparkle.style.opacity = v >= 75 ? '0' : '0.75';
    }

    // 5. العصب الشوكي وتشوهه الفيزيائي المباشر الناتج عن اصطدام الديسك به
    const nervePath = document.getElementById('sim-nerve-path');
    const nerveCore = document.getElementById('sim-nerve-core');
    const nerveSparks = document.getElementById('sim-nerve-sparks');

    if (nervePath && nerveCore) {
        // محور العصب الأصلي عند X = 420
        // إذا كان بروز الديسك (apexX) يتجاوز 410، يدفع جدار العصب لليمين مباشرة
        // مع نصف قطر العصب (13px)، قمة العصب المنضغط تصل إلى apexX + 18
        const nerveBaseX = 420;
        let nerveApexX = nerveBaseX;
        if (apexX > 405) {
            nerveApexX = Math.max(nerveBaseX, apexX + 16);
        }

        const nerveD = `M ${nerveBaseX},30 C ${nerveBaseX},110 ${nerveApexX},${bulgeY} ${nerveBaseX},${Math.min(440, 260 + dy)} L ${nerveBaseX},440`;
        nervePath.setAttribute('d', nerveD);
        nerveCore.setAttribute('d', nerveD);

        if (v >= 65) {
            nervePath.setAttribute('stroke', 'url(#nerveGradHealthy)');
        } else if (v >= 35) {
            nervePath.setAttribute('stroke', 'url(#nerveGradMedium)');
        } else {
            nervePath.setAttribute('stroke', 'url(#nerveGradCompressed)');
        }
    }

    // صواعق وشرارات الألم العصبي تنطلق من نقطة التماس الفيزيائي بين الديسك والعصب
    if (nerveSparks) {
        if (v < 45) {
            nerveSparks.style.display = 'block';
            nerveSparks.style.opacity = `${(1 - (v / 45)).toFixed(2)}`;
            nerveSparks.setAttribute('transform', `translate(${apexX - 450}, ${bulgeY - 181})`);
        } else {
            nerveSparks.style.display = 'none';
        }
    }

    // 5. تحديث المؤشرات الرقمية الحية
    const metricBulge = document.getElementById('sim-metric-bulge');
    const metricNerve = document.getElementById('sim-metric-nerve');
    const metricDisc = document.getElementById('sim-metric-disc');
    const badge = document.getElementById('simulator-status-badge');
    const explanation = document.getElementById('sim-explanation-text');
    const bulgeLabel = document.getElementById('sim-bulge-label-text');
    const nerveLabel = document.getElementById('sim-nerve-label-text');

    const bulgeMm = Math.max(0.4, (8.8 - ratio * 8.2)).toFixed(1);
    const nervePinchPct = Math.max(0, Math.round(95 - ratio * 95));
    const discHeightMm = (5.5 + ratio * 7.5).toFixed(1);

    if (metricBulge) {
        metricBulge.textContent = `${bulgeMm} ملم`;
        metricBulge.style.color = v >= 65 ? '#10b981' : (v >= 35 ? '#f59e0b' : '#ef4444');
    }
    if (metricNerve) {
        metricNerve.textContent = `${nervePinchPct}%`;
        metricNerve.style.color = v >= 65 ? '#10b981' : (v >= 35 ? '#f59e0b' : '#ef4444');
    }
    if (metricDisc) {
        metricDisc.textContent = `${discHeightMm} ملم`;
        metricDisc.style.color = v >= 65 ? '#10b981' : '#38bdf8';
    }

    if (v >= 65) {
        if (badge) {
            badge.style.background = 'rgba(16, 185, 129, 0.2)';
            badge.style.color = '#10b981';
            badge.style.borderColor = '#10b981';
            badge.textContent = '✅ المرحلة 3: تحرر العصب واستعادة اصطفاف الفقرات (الكايروبراكتيك)';
        }
        if (bulgeLabel) {
            bulgeLabel.textContent = '🟢 تراجع نتوء الديسك إلى مكانه الطبيعي';
            bulgeLabel.setAttribute('fill', '#10b981');
        }
        if (nerveLabel) {
            nerveLabel.textContent = '✅ عصب متحرر بالكامل بدون أي ضغط';
            nerveLabel.setAttribute('fill', '#10b981');
        }
        if (explanation) {
            explanation.style.borderColor = '#10b981';
            explanation.style.color = '#6ee7b7';
            explanation.innerHTML = '✨ <strong>المرحلة 3 (أثر تقويم الكايروبراكتيك):</strong> يقوم المعالج بإعادة محاذاة الفقرات بدقة وتفريغ الحمل الميكانيكي، مما يفتح مسافة كافية بين الفقرتين ويوّلد قوة سحب عكسية (Negative Pressure) تجعل الديسك يرتد لمكانه، فيتحرر العصب تماماً ويزول الألم والتنميل.';
        }
    } else if (v >= 35) {
        if (badge) {
            badge.style.background = 'rgba(245, 158, 11, 0.2)';
            badge.style.color = '#f59e0b';
            badge.style.borderColor = '#f59e0b';
            badge.textContent = '⚡ المرحلة 2: تباعد جزئي للفقرات (استطالة وتخفيف مؤقت)';
        }
        if (bulgeLabel) {
            bulgeLabel.textContent = '🟡 انحسار جزئي لبروز الديسك';
            bulgeLabel.setAttribute('fill', '#f59e0b');
        }
        if (nerveLabel) {
            nerveLabel.textContent = '⚡ تخفيف جزئي للضغط العصبي';
            nerveLabel.setAttribute('fill', '#f59e0b');
        }
        if (explanation) {
            explanation.style.borderColor = '#f59e0b';
            explanation.style.color = '#fef08a';
            explanation.innerHTML = '⚡ <strong>المرحلة 2 (تأثير الراحة والاستطالة):</strong> بفضل تمارين الإطالة والوضعيات الصحيحة تتباعد الفقرات جزئياً، مما يخفف شدة الاحتكاك المباشر مع العصب بنسبة 50% ويقلل من حدة الكهرباء والتنميل مؤقتاً.';
        }
    } else {
        if (badge) {
            badge.style.background = 'rgba(239, 68, 68, 0.2)';
            badge.style.color = '#ef4444';
            badge.style.borderColor = '#ef4444';
            badge.textContent = '⚠️ المرحلة 1: انضغاط حاد وبروز الديسك على العصب';
        }
        if (bulgeLabel) {
            bulgeLabel.textContent = '🔴 بروز نتوء الديسك واصطدامه بالعصب';
            bulgeLabel.setAttribute('fill', '#ef4444');
        }
        if (nerveLabel) {
            nerveLabel.textContent = '⚡ عصب شوكي مضغوط (ألم وتنميل)';
            nerveLabel.setAttribute('fill', '#ef4444');
        }
        if (explanation) {
            explanation.style.borderColor = '#ef4444';
            explanation.style.color = '#fca5a5';
            explanation.innerHTML = '⚠️ <strong>المرحلة 1 (انضغاط حاد):</strong> تتقارب الفقرتان بسبب تشنج العضلات أو الخلل الميكانيكي، مما يضغط النواة اللبية ويجعل الألياف الخارجية للديسك تبرز للخلف وتصطدم مباشرة بالعصب الشوكي؛ فينتج ألم حاد وتنميل ممتد للساق أو الذراع.';
        }
    }
}


// بطاقة خدمة الزيارات المنزلية الفاخرة لكبار السن والحالات الحادة (Home Visit Concierge)
function getHomeVisitCardHTML() {
    return `
        <div class="no-print" style="background: linear-gradient(135deg, rgba(212, 175, 55, 0.12) 0%, rgba(15, 23, 42, 0.95) 100%); border: 1.5px solid var(--primary-gold); border-radius: 14px; padding: 22px; margin-bottom: 25px; box-shadow: 0 8px 30px rgba(212, 175, 55, 0.2);">
            <div style="display: flex; justify-content: space-between; align-items: center; flex-wrap: wrap; gap: 15px;">
                <div style="flex: 1; min-width: 270px;">
                    <div style="display: flex; align-items: center; gap: 8px; margin-bottom: 6px;">
                        <span style="font-size: 1.5em;">🏡</span>
                        <h4 style="color: var(--primary-gold); margin: 0; font-size: 1.2em;">خدمة الزيارات المنزلية الفاخرة (Home Treatment Concierge)</h4>
                    </div>
                    <p style="color: #cbd5e1; font-size: 0.92em; line-height: 1.6; margin: 0 0 6px 0;">
                        ألمك حاد ولا تستطيع القيادة أو التنقل؟ أو ترغب في جلسة تقويم يدوي لكبار السن في راحة المنزل؟ 
                        نوفر خدمة جلسات الكايروبراكتيك المتكاملة في منزلك داخل <strong>عمان والزرقاء</strong> بكافة التجهيزات الطبية المعتمدة.
                    </p>
                    <div style="color: #10b981; font-size: 0.82em; font-weight: bold;">🚗 تغطية شاملة لجميع مناطق عمان والزرقاء بأعلى معايير الخصوصية والأمان.</div>
                </div>
                <div>
                    <a href="https://wa.me/${CLINIC_WHATSAPP_NUMBER}?text=${encodeURIComponent('مرحباً دكتور، أود الاستفسار عن إمكانية حجز جلسة زيارة منزلية (Home Visit) في عمان/الزرقاء.')}" target="_blank" style="background: linear-gradient(135deg, var(--primary-gold) 0%, var(--primary-gold-dark) 100%); color: #0a0e14; padding: 12px 24px; border-radius: 8px; text-decoration: none; font-weight: bold; font-size: 0.95em; display: inline-flex; align-items: center; gap: 8px; box-shadow: 0 4px 15px rgba(212, 175, 55, 0.3);">
                        🏠 طلب جلسة زيارة منزلية
                    </a>
                </div>
            </div>
        </div>
    `;
}

// ==========================================================================
// مكتبة التجارب والقصص السريرية الموثقة التخصصية الموجهة تشريحياً
// كل نقطة ألم ومفصل مرتبط بقصص حقيقية واقعية بأسماء أردنية وعربية موثقة
// ==========================================================================
const CLINICAL_SUCCESS_CASES = {
    // 1. حالات الفقرات القطنية، الديسك، عرق النسا، والمفصل العجزي الحوضي
    lumbar: [
        {
            name: "أبو راشد س. (51 عاماً) - الزرقاء الجديدة",
            job: "سائق باص عمومي",
            issue: "انزلاق غضروفي قطني (ديسك L4-L5) ضاغط على العصب مع خدر وكهرباء تمتد لأسفل القدم",
            result: "معاناتي مع الديسك والانزلاق وعرق النسا استمرت 7 أشهر. التحسن الجذري والفعلي حدث مباشرة على طاولة الكايروبراكتيك في الجلسة السريرية المباشرة مع المعالج، حيث تم تفريغ ضغط الفقرات يدوياً واختفى التنميل بنسبة 85% من أول جلسة، وكانت التمارين المنزلية داعمة لتثبيت النتيجة ومنع الانتكاس.",
            time: "قبل شهرين",
            verified: "موثقة سريرياً - جلسات تقويم يدوية"
        },
        {
            name: "أم طارق م. (56 عاماً) - عمان (تلاع العلي)",
            job: "معلمة متقاعدة",
            issue: "تضيق مسافة غضروفية L5-S1 وتيبس حاد يمنعها من الوقوف لأكثر من 5 دقائق",
            result: "كنت عاجزة عن الصلاة إلا جالسة بسبب عرق النسا وتضيق الفقرات. الجلسات السريرية اليدوية في المركز هي التي أزالت الضغط الانضغاطي من جذوره وحررت المفصل، وخلال أيام قليلة استعدت السجود على الأرض براحة تامة.",
            time: "قبل 3 أسابيع",
            verified: "موثقة سريرياً - جلسات تقويم يدوية"
        },
        {
            name: "السيد حازم سالم (43 عاماً) - دابوق",
            job: "مدير شركة",
            issue: "متلازمة العضلة الكمثرية (Piriformis Syndrome) وألم حارق في الورك أثناء القيادة والجلوس",
            result: "الألم الحارق لعرق النسا وعضلة الكمثرية انتهى تماماً بفضل المعالجة والتحرير النقطي المباشر في الجلسة السريرية بالمركز، وبرنامج الراحة المنزلي ساعدني في استدامة الليونة ومنع تكرار الشد.",
            time: "قبل أسبوعين",
            verified: "موثقة سريرياً - جلسات تقويم يدوية"
        }
    ],

    // 2. حالات الفقرات العنقية، ديسك الرقبة، والصداع العنقي التوتري
    cervical: [
        {
            name: "م. ليث ناصر (38 عاماً) - الجبيهة",
            job: "مهندس برمجيات",
            issue: "ديسك رقبة C5-C6 مع صداع نصفي متكرر وتنميل في أصابع اليد اليسرى",
            result: "ساعات العمل الطويلة سببت لي ديسك رقبة وصداعاً عنقياً مستمراً. جلسة تصحيح التموضع العنقي وتفريغ ضغط الفقرات السريرية المباشرة أوقفت الصداع والتنميل من الجلسة الأولى، مع التزامي ببرنامج الراحة المنزلي.",
            time: "قبل شهر",
            verified: "موثقة سريرياً - جلسات تقويم يدوية"
        },
        {
            name: "أم عمر (48 عاماً) - السلط",
            job: "ربة منزل",
            issue: "تصلب فقرات الرقبة ومحدودية دوران الرأس وصعوبة الالتفات أثناء قيادة السيارة",
            result: "تصلب الرقبة وصعوبة الالتفات أثناء القيادة انتهت بفضل جلسة الكايروبراكتيك الدقيقة في المركز التي أعادت حركة الفقرات العنقية كاملة، وكانت تمارين الاستطالة عاملاً مساعداً للحفاظ على المدى الحركي.",
            time: "قبل أسبوعين",
            verified: "موثقة سريرياً - جلسات كايروبراكتيك"
        },
        {
            name: "د. معتز فوزي (35 عاماً) - عمان الغربية",
            job: "طبيب صيدلي",
            issue: "دوار عنقي (Cervicogenic Dizziness) وتشنج حاد في عضلات خلف الرأس والفك",
            result: "الدوخة العنقية والتشنج الحاد خلف الرأس زالت فوراً بعد تقويم الكايروبراكتيك السريري للفقرات العنقية العلوية وتعديل انحرافها في الجلسة، واختفى الدوار نهائياً.",
            time: "قبل 3 أسابيع",
            verified: "موثقة سريرياً - جلسات كايروبراكتيك"
        }
    ],

    // 3. عضلات الأبهر وأعلى الظهر والقفص الصدري
    thoracic_scapula: [
        {
            name: "السيد بلال حداد (40 عاماً) - الفحيص",
            job: "محاسب مالي",
            issue: "أبهر حاد بين لوح الكتف والعمود الفقري مع إحساس بطعنة تمنع أخذ نفس عميق",
            result: "طعنة الأبهر التي منعتني من التنفس لأشهر انتهت فوراً أثناء جلسة التقويم السريرية بعد تحرير العقدة العضلية وإعادة محاذاة الأضلاع مع الفقرات الصدرية، والتمارين المنزلية ساعدتني في إبقاء عضلات الظهر مرنة.",
            time: "قبل 10 أيام",
            verified: "موثقة سريرياً - جلسات تقويم يدوية"
        },
        {
            name: "أم يوسف ن. (47 عاماً) - الرصيفة",
            job: "خياطة",
            issue: "تشنج مزمن بلوح الكتف الأيمن وحرقة ممتدة للكتف والذراع",
            result: "التحسن الحقيقي حدث بفضل جلسات الكايروبراكتيك في المركز لفك الألياف المحتقنة وتفريغ الشد اللفافي، بينما كانت التمارين المنزلية خطوة وقائية مكملة لحماية القوام أثناء العمل.",
            time: "قبل شهر",
            verified: "موثقة سريرياً - جلسات كايروبراكتيك"
        },
        {
            name: "الكابتن إبراهيم م. (29 عاماً) - عمان",
            job: "مدرب أثقال",
            issue: "انغلاق بمفصل الفقرات الصدرية (Thoracic Facet Lock) بعد تمرين رفع خاطئ",
            result: "انغلاق الفقرات الصدرية عولج فورياً بطقطقة الكايروبراكتيك السريرية المتخصصة في المركز، حيث فتح القفص الصدري وعاد التوازن الحركي في نفس اللحظة.",
            time: "قبل أسبوعين",
            verified: "موثقة سريرياً - جلسات تقويم يدوية"
        }
    ],

    // 4. مفاصل الأكتاف، الكتف المتجمدة، والكفة المدورة
    shoulder: [
        {
            name: "الحاج نعيم ع. (66 عاماً) - عمان (ماركا)",
            job: "متقاعد",
            issue: "كتف متجمدة (Frozen Shoulder) وعجز عن رفع الذراع لارتداء الملابس أو تمشيط الشعر",
            result: "تجمد الكتف الذي حرمني من رفع يدي لأشهر تفكك بفضل تقنية التحرير اليدوي المفصلي في الجلسات السريرية بالمركز، وارتفع مدى حركتي من 45 إلى 160 درجة في 3 جلسات متتالية.",
            time: "قبل شهر ونصف",
            verified: "موثقة سريرياً - جلسات تقويم يدوية"
        },
        {
            name: "الدكتورة رانيا مسعود (42 عاماً) - الشميساني",
            job: "طبيبة أسنان",
            issue: "انحشار وتر الكفة المدورة (Rotator Cuff Impingement) وألم ليلي يمنع النوم على الجانب الأيمن",
            result: "انحشار وتر الكتف والألم الليلي زال بعد أول جلسة تقويم يدوي سريرية تم فيها تعديل موضع رأس العضد داخل المفصل بدقة، ونمت نوماً هادئاً بدون مسكنات.",
            time: "قبل 3 أسابيع",
            verified: "موثقة سريرياً - جلسات تقويم يدوية"
        },
        {
            name: "السيد قصي ر. (37 عاماً) - إربد",
            job: "أعمال صيانة",
            issue: "التهاب وتر العضلة فوق الشوكية مع طقطقة وألم عند رفع الذراع جانباً",
            result: "جلسات تفريغ الحمل المفصلي يدوياً في المركز هي التي عالجت التهاب الوتر الحاد وأعادت قوة ذراعي، مع التزامي بالتمارين التأهيلية المرفقة.",
            time: "قبل شهر",
            verified: "موثقة سريرياً - جلسات تقويم يدوية"
        }
    ],

    // 5. مفاصل الكوع والرسغ، متلازمة النفق الرسغي، وتنميل اليدين
    wrist_elbow: [
        {
            name: "السيدة منى كنعان (45 عاماً) - خلدا",
            job: "إدارية وسكرتيرة",
            issue: "متلازمة النفق الرسغي (Carpal Tunnel) وتنميل شديد يوقظها من النوم مع ضعف قبضة اليد",
            result: "التحسن الجذري في النفق الرسغي وتجنب العملية الجراحية تحقق بفضل تسليك العصب وتعديل عظيمات الرسغ يدوياً في الجلسة السريرية مع المعالج، وتلاشى الخدر تدريجياً.",
            time: "قبل شهر",
            verified: "موثقة سريرياً - جلسات تقويم يدوية"
        },
        {
            name: "السيد فراس سامي (36 عاماً) - طبربور",
            job: "فني تكييف وتبريد",
            issue: "مرفق لاعب التنس (Tennis Elbow) وألم حاد عند المصافحة أو حمل المفكات والمعدات",
            result: "تقويم الكايروبراكتيك السريري لأوتار الساعد ومفصل الكوع في المركز هو الذي أراح الوتر المجهد وأنهى الألم، ومكنني من العودة لحمل معداتي بأمان.",
            time: "قبل أسبوعين",
            verified: "موثقة سريرياً - جلسات كايروبراكتيك"
        },
        {
            name: "أم حمزة (53 عاماً) - الرابية",
            job: "معلمة لغة عربية",
            issue: "خدر أصابع الإبهام والسبابة مع وخز مستمر وصعوبة في الكتابة ومسك القلم",
            result: "تحرير مسار العصب يدوياً من جذوره العنقية وحتى الرسغ في الجلسات السريرية بالمركز أعاد الإحساس وقوة مسك القلم بوضوح، واستأنفت عملي براحة.",
            time: "قبل 3 أسابيع",
            verified: "موثقة سريرياً - جلسات كايروبراكتيك"
        }
    ],

    // 6. الركبتين واحتكاك الصابونة والغضاريف
    knee: [
        {
            name: "الحاجة أم نضال (63 عاماً) - الزرقاء (الغويرية)",
            job: "ربة منزل",
            issue: "خشونة واحتكاك ركبة من الدرجة الثالثة مع صعوبة شديدة بنزول الدرج وتورم دوري",
            result: "احتكاك الركبة الشديد وصعوبة الدرج تحسنا بشكل هائل بعد جلسات إعادة موازنة الحوض ومفصل الركبة يدوياً في المركز، فزال الثقل غير المتوازن وصعدت الدرج دون استناد بعد الجلسة الثانية.",
            time: "قبل شهر",
            verified: "موثقة سريرياً - جلسات كايروبراكتيك"
        },
        {
            name: "الأستاذ كمال خليل (50 عاماً) - صويلح",
            job: "موجه تربوي",
            issue: "التهاب وتر الركبة الرضفي وطقطقة مؤلمة تمنع ثني المفصل أثناء الصلاة",
            result: "جلسات التليين السريري المتخصصة لأنسجة الصابونة وتعديل زاوية المفصل بالمركز هي التي مكنتني من ثني ركبتي والصلاة براحة تامة على الأرض.",
            time: "قبل 3 أسابيع",
            verified: "موثقة سريرياً - جلسات كايروبراكتيك"
        },
        {
            name: "السيد أنس م. (33 عاماً) - شفا بدران",
            job: "لاعب كرة قدم هاوٍ",
            issue: "ألم متكرر حول الصابونة بعد الجري وإحساس بعدم ثبات المفصل",
            result: "إعادة التوازن الميكانيكي للمفصل في الجلسة السريرية بالمركز أنهى آلام الصابونة وسمح لي بالعودة للركض، والتمارين المنزلية عززت ثبات المفصل.",
            time: "قبل أسبوعين",
            verified: "موثقة سريرياً - جلسات كايروبراكتيك"
        }
    ],

    // 7. الكاحل، مسمار الكعب، وتر أكيليس، واللفافة الأخمصية
    ankle_foot: [
        {
            name: "السيدة سهام ع. (46 عاماً) - عبدون",
            job: "مديرة مبيعات",
            issue: "مسمار كعب والتهاب اللفافة الأخمصية وألم حاد كالمسمار في أول خطوة عند الاستيقاظ",
            result: "مسمار القدم وألم الخطوة الأولى الصباحية زال بعد جلسة الكايروبراكتيك لعظام القدم والكاحل بالمركز، حيث تحرر الشد الانضغاطي، والبرنامج المنزلي ثبّت راحة القدمين.",
            time: "قبل 3 أسابيع",
            verified: "موثقة سريرياً - جلسات كايروبراكتيك"
        },
        {
            name: "السيد وسام عادل (39 عاماً) - الكرك",
            job: "مهندس موقع",
            issue: "تيبس والتهاب مزمن في وتر أكيليس ومحدودية في حركة ثني الكاحل للأعلى",
            result: "جلسات الكايروبراكتيك لفك تيبس وتر أكيليس ومفصل الكاحل الغائر في المركز أعادت المرونة الكاملة لقدمي وأصبحت أتحرك في مواقع العمل دون وجع.",
            time: "قبل شهر",
            verified: "موثقة سريرياً - جلسات كايروبراكتيك"
        },
        {
            name: "أم يزن (54 عاماً) - الهاشمي الشمالي",
            job: "ربة منزل",
            issue: "ألم باطن القدم المستمر وصعوبة الوقوف في المطبخ لأكثر من 15 دقيقة",
            result: "تقويم الكايروبراكتيك لقوس القدم ومحاذاة الكعب في جلسات المركز هو الذي مكنني من الوقوف وممارسة أعمالي اليومية براحة ودون أي وخز.",
            time: "قبل أسبوعين",
            verified: "موثقة سريرياً - جلسات كايروبراكتيك"
        }
    ],

    // 8. الجنف وانحراف العمود الفقري (Scoliosis)
    scoliosis: [
        {
            name: "الآنسة لين س. (21 عاماً) - دير غبار",
            job: "طالبة جامعية",
            issue: "جنف صدري قطني وميلان ملحوظ بالكتفين مع إجهاد عضلي دائم وصداع وضيق تنفس",
            result: "انحراف العمود الفقري (الجنف) وميلان الكتفين تحسن بشكل ملحوظ بفضل جلسات التقويم السريرية المتخصصة في وداعاً للألم، حيث تم تعديل توازن الحوض والفقرات يدوياً، وانخفض إجهاد الظهر بنسبة 85%.",
            time: "قبل شهر ونصف",
            verified: "موثقة سريرياً - جلسات كايروبراكتيك"
        },
        {
            name: "السيد عمر فهد (27 عاماً) - سحاب",
            job: "موظف بنك",
            issue: "انحناء جانبي بالعمود الفقري مع تفاوت في ارتفاع الحوض وألم أسفل الظهر عند الجلوس",
            result: "تفريغ الضغط الميكانيكي الالتوائي في جلسات الكايروبراكتيك مع المعالج جمال أعاد استقامة ظهري ومكنني من الجلوس بانتصاب وراحة تامة.",
            time: "قبل 3 أسابيع",
            verified: "موثقة سريرياً - جلسات كايروبراكتيك"
        },
        {
            name: "أم سند (36 عاماً) - طبربور",
            job: "ربة منزل",
            issue: "تحدب صدري وانحراف خفيف ناتج عن وضعيات الجلوس الخاطئ مع ألم بين الكتفين",
            result: "جلسات الكايروبراكتيك مع المعالج جمال في «وداعاً للألم» هي التي عدلت تحدب أعلى الظهر وأزالت الحمل الثقيل عن رقبتي وأكتافي، واستقام قوام ظهري تماماً.",
            time: "قبل أسبوعين",
            verified: "موثقة سريرياً - جلسات كايروبراكتيك"
        }
    ],

    // 9. التأهيل الحركي لمرضى الجلطات وضعف الحركة
    stroke_rehab: [
        {
            name: "أبو ماجد ك. (64 عاماً) - السلط (زيارة منزلية)",
            job: "متقاعد",
            issue: "ضعف حركي نصفي بعد جلطة دماغية وصعوبة رفع القدم أثناء المشي وتصلب عضلات الذراع",
            result: "جلسات التحفيز الحركي العصبي وتليين المفاصل السريرية مع المعالج هي التي ساعدت والدي على استعادة توازن المشي ورفع ذراعه للإمساك بالأشياء بفضل الله، بينما كانت التمارين المنزلية داعمة يومياً.",
            time: "قبل شهرين",
            verified: "موثقة سريرياً - جلسات تأهيل يدوية"
        },
        {
            name: "أم بشار (58 عاماً) - مرج الحمام",
            job: "معلمة متقاعدة",
            issue: "تصلب تشنجي بعد جلطة دماغية وصعوبة في فتح أصابع اليد اليسرى وثني المرفق",
            result: "التقنيات اليدوية السريرية لتحرير التشنج العضلي وإعادة تدريب المسارات العصبية الحركية مع المعالج جمال مكنتها من فتح يدها واستخدامها في تناول الطعام تدريجياً.",
            time: "قبل 3 أسابيع",
            verified: "موثقة سريرياً - جلسات تأهيل يدوية"
        },
        {
            name: "السيد جمال سليم (67 عاماً) - الزرقاء الجديدة",
            job: "متقاعد",
            issue: "اختلال بالتوازن وضعف بالساقين بعد أزمة صحية مع خوف شديد من السقوط",
            result: "جلسات استعادة التوازن وتعديل محاذاة الحوض يدوياً مع المعالج جمال في «وداعاً للألم» منحت والدي الثقة للمشي بمفرده داخل وخارج المنزل بدون خوف أو عكاز.",
            time: "قبل شهر",
            verified: "موثقة سريرياً - جلسات تأهيل يدوية"
        }
    ]
};

// قسم قصص النجاح والتجارب السريرية الحقيقية الموجهة تشريحياً (Targeted Social Proof)
function getPatientSuccessStoriesHTML(pointId = '') {
    const pId = (pointId || "").toLowerCase();
    let categoryKey = 'lumbar';

    if (pId.includes('cervical') || pId.includes('neck') || pId.includes('head') || pId.includes('صداع')) {
        categoryKey = 'cervical';
    } else if (pId.includes('thoracic') || pId.includes('scapula') || pId.includes('abher') || pId.includes('أبهر') || pId.includes('صدر') || pId.includes('trapezius')) {
        categoryKey = 'thoracic_scapula';
    } else if (pId.includes('shoulder') || pId.includes('كتف')) {
        categoryKey = 'shoulder';
    } else if (pId.includes('elbow') || pId.includes('wrist') || pId.includes('كوع') || pId.includes('رسغ') || pId.includes('carpal')) {
        categoryKey = 'wrist_elbow';
    } else if (pId.includes('knee') || pId.includes('ركبة') || pId.includes('patella')) {
        categoryKey = 'knee';
    } else if (pId.includes('ankle') || pId.includes('foot') || pId.includes('achilles') || pId.includes('كاحل') || pId.includes('كعب')) {
        categoryKey = 'ankle_foot';
    } else if (pId.includes('scoliosis') || pId.includes('جنف') || pId.includes('انحراف')) {
        categoryKey = 'scoliosis';
    } else if (pId.includes('stroke') || pId.includes('جلطة') || pId.includes('تأهيل') || pId.includes('rehab')) {
        categoryKey = 'stroke_rehab';
    } else if (pId.includes('hip') || pId.includes('sacroiliac') || pId.includes('gluteal') || pId.includes('lumbar') || pId.includes('سياتيكا') || pId.includes('عرق النسا')) {
        categoryKey = 'lumbar';
    }

    const stories = CLINICAL_SUCCESS_CASES[categoryKey] || CLINICAL_SUCCESS_CASES.lumbar;

    return `
        <div class="video-cases-showcase-card no-print" style="background: linear-gradient(135deg, rgba(15, 23, 42, 0.98) 0%, rgba(24, 119, 242, 0.15) 100%); border: 1.5px solid rgba(24, 119, 242, 0.5); border-radius: 14px; padding: 22px 20px; margin-bottom: 25px; box-shadow: 0 8px 30px rgba(0,0,0,0.45); text-align: center;">
            <div style="display: flex; align-items: center; justify-content: center; gap: 10px; margin-bottom: 8px;">
                <span style="font-size: 1.6em;">📹</span>
                <h3 style="color: #ffffff; margin: 0; font-size: 1.25em; font-weight: 800;">
                    شاهد بالفيديو: حالات تعافي حقيقية موثقة بالصوت والصورة
                </h3>
            </div>
            <p style="color: #cbd5e1; font-size: 0.92em; line-height: 1.65; max-width: 720px; margin: 0 auto 16px auto;">
                توثيق سريري مرئي لعشرات الحالات لمرضى ومراجعين تخلصوا من آلام الديسك، عرق النسا، احتكاك المفاصل، وتيبس الفقرات بتقنية الكايروبراكتيك المعتمدة في <strong>«وداعاً للألم»</strong>.
            </p>
            <div class="stories-action-buttons" style="display: grid; grid-template-columns: 1fr 1fr; gap: 8px; max-width: 500px; margin: 0 auto; width: 100%; box-sizing: border-box;">
                <a href="${CLINIC_FACEBOOK}" target="_blank" rel="noopener noreferrer" style="background: linear-gradient(135deg, #1877f2 0%, #0d65d9 100%); color: #ffffff; text-decoration: none; padding: 10px 8px; border-radius: 10px; font-weight: 800; font-size: 0.85em; display: flex; align-items: center; justify-content: center; gap: 6px; box-shadow: 0 4px 18px rgba(24, 119, 242, 0.45); white-space: nowrap; width: 100%; box-sizing: border-box;">
                    <span>👍 تجارب الحالات (فيسبوك)</span>
                </a>
                <a href="${CLINIC_WHATSAPP}" target="_blank" rel="noopener noreferrer" style="background: rgba(16, 185, 129, 0.18); border: 1.5px solid #10b981; color: #6ee7b7; text-decoration: none; padding: 10px 8px; border-radius: 10px; font-weight: 800; font-size: 0.85em; display: flex; align-items: center; justify-content: center; gap: 6px; white-space: nowrap; width: 100%; box-sizing: border-box;">
                    <span>💬 استفسار المعالج</span>
                </a>
            </div>
        </div>
    `;
}

// كود البطاقة الترويجية الكبرى وأزرار التواصل
function getPromotionalContactHubHTML() {
    return `
        <div class="promotional-hub-card no-print" style="background: linear-gradient(135deg, rgba(16, 185, 129, 0.12) 0%, rgba(30, 41, 59, 0.9) 100%); border: 1.5px solid #10b981; border-radius: 14px; padding: 20px 16px; margin-bottom: 25px; box-sizing: border-box; overflow: hidden;">
            <div>
                <div style="display: flex; align-items: center; gap: 8px; margin-bottom: 6px;">
                    <span style="font-size: 1.4em;">📲</span>
                    <h4 style="color: #10b981; margin: 0; font-size: 1.25em;">استشارة مباشرة مع المعالج المختص</h4>
                </div>
                <p style="color: #e2e8f0; font-size: 0.95em; line-height: 1.6; margin: 0 0 8px 0;">احصل على توجيه سريري فوري من المعالج في <strong>وداعاً للألم</strong> بناءً على نتائج فحصك وتشخيصك.</p>
                <div style="color: #fef08a; font-size: 0.9em; font-weight: 600; line-height: 1.6; margin-bottom: 14px;">⚠️ للتشخيص الدقيق ، ننصح بشدة بالتواصل مع المعالج للحصول على جلسة كايروبراكتيك سريرية أو طلب زيارة منزلية.</div>
                
                <!-- الأزرار الثلاثة بصف واحد متناسق محكم داخل حواف الكرت تماماً -->
                <div class="promotional-contact-actions" style="display: grid; grid-template-columns: repeat(3, minmax(0, 1fr)); gap: 8px; width: 100%; box-sizing: border-box;">
                    <a href="tel:00962790360440" class="btn-header promotional-action-btn promotional-phone-btn" style="background: rgba(16, 185, 129, 0.28); color: #6ee7b7; border: 2px solid #10b981; font-weight: 900; display: flex; align-items: center; justify-content: center; gap: 4px; border-radius: 10px; text-decoration: none; padding: 10px 4px; min-width: 0; box-sizing: border-box;">📞 <span style="font-family: monospace, 'Cairo', sans-serif; font-size: 1.05em; font-weight: 900; letter-spacing: 0;">0790360440</span></a>
                    <a href="${CLINIC_WHATSAPP}" target="_blank" class="btn-header btn-whatsapp-cta promotional-action-btn" style="font-weight: 800; border-radius: 10px; text-decoration: none; display: flex; align-items: center; justify-content: center; gap: 4px; padding: 10px 4px; min-width: 0; box-sizing: border-box;">💬 <span class="hide-on-compact">استشارة </span>واتساب</a>
                    <a href="${CLINIC_FACEBOOK}" target="_blank" class="btn-header promotional-action-btn" style="background: #1877f2; color: #fff; border: 1.5px solid #1877f2; font-weight: 800; border-radius: 10px; text-decoration: none; display: flex; align-items: center; justify-content: center; gap: 4px; padding: 10px 4px; min-width: 0; box-sizing: border-box;">👍 فيسبوك</a>
                </div>
            </div>
        </div>

        <div class="no-print" style="text-align: center; margin-bottom: 25px;">
            <button type="button" onclick="openAppInstallShareModal()" class="btn-header" style="background: linear-gradient(135deg, rgba(212, 175, 55, 0.25) 0%, rgba(16, 185, 129, 0.25) 100%); border-color: var(--primary-gold); color: #fef08a; padding: 12px 32px; font-size: 1.05em; font-weight: bold; cursor: pointer; border-radius: 8px;">
                📲 تثبيت التطبيق على هاتفك أو مشاركته مع أصدقائك
            </button>
        </div>

        <footer style="text-align: center; color: #94a3b8; font-size: 0.85em; padding: 18px 12px; border-top: 1px solid rgba(212, 175, 55, 0.25); line-height: 1.7;">
            © Smart Check Pro 2026 - مطورة من قبل <strong>«وداعاً للألم»</strong> (تقنية الكايروبراكتيك). جميع الحقوق محفوظة.<br>
            هذه الأداة السريرية استرشادية ذكية ولا تغني عن الفحص السريري المباشر.
        </footer>
    `;
}

// دالة احتساب الـ BMI التفاعلية الفورية داخل التقرير مع تحديد الوزن الزائد أو الناقص بالكيلوجرام
function calculateInlineReportBMI() {
    const w = parseFloat(document.getElementById('inline-report-weight')?.value);
    const h = parseFloat(document.getElementById('inline-report-height')?.value);
    const res = document.getElementById('inline-bmi-result');
    if (!w || !h || h <= 0) {
        if (res) res.innerHTML = `<span style="color: #ef4444; font-size: 0.85em;">يرجى إدخال الوزن بالكجم والطول بالسم</span>`;
        return;
    }
    const hM = h / 100;
    const bmi = parseFloat((w / (hM * hM)).toFixed(1));
    const minHealthyW = parseFloat((18.5 * hM * hM).toFixed(1));
    const maxHealthyW = parseFloat((24.9 * hM * hM).toFixed(1));
    const idealW = parseFloat((22.0 * hM * hM).toFixed(1));

    let status = 'وزن طبيعي متوازن';
    let color = '#10b981';
    let deltaText = `✅ وزنك مثالي (المدى الصحي لطولك: ${minHealthyW} - ${maxHealthyW} كجم)`;
    let impact = 'لا توجد حمولة ضغط إضافية على الغضاريف والمفاصل.';

    if (bmi < 18.5) {
        const deficitKg = parseFloat((minHealthyW - w).toFixed(1));
        status = 'نحافة';
        color = '#38bdf8';
        deltaText = `⚠️ نقص وزن بمقدار -${deficitKg} كجم عن الحد الأدنى للوزن الصحي (${minHealthyW} كجم)`;
        impact = 'يوصى بتقوية الكتلة العضلية لتثبيت المفاصل وحمايتها من الإجهاد.';
    } else if (bmi >= 25 && bmi < 30) {
        const excessKg = parseFloat((w - maxHealthyW).toFixed(1));
        const excessVsIdeal = parseFloat((w - idealW).toFixed(1));
        const addedLoad = parseFloat((excessKg * 4).toFixed(1));
        status = 'زيادة وزن';
        color = '#f59e0b';
        deltaText = `⚠️ وزن زائد بمقدار +${excessKg} كجم عن الحد الصحي (+${excessVsIdeal} كجم عن الوزن المثالي)`;
        impact = `يضيف حوالي +${addedLoad} كجم حمولة ضغط إضافية على الركبتين وأسفل الظهر أثناء الحركة.`;
    } else if (bmi >= 30) {
        const excessKg = parseFloat((w - maxHealthyW).toFixed(1));
        const excessVsIdeal = parseFloat((w - idealW).toFixed(1));
        const addedLoad = parseFloat((excessKg * 4).toFixed(1));
        status = 'سمنة مفرطة';
        color = '#ef4444';
        deltaText = `🚨 وزن زائد حرج بمقدار +${excessKg} كجم (+${excessVsIdeal} كجم عن الوزن المثالي)`;
        impact = `يضاعف الضغط الانضغاطي على الديسك ويشكل حمولة +${addedLoad} كجم على المفاصل.`;
    }

    if (res) {
        res.innerHTML = `
            <div style="margin-top: 10px; padding: 10px 14px; background: rgba(15, 23, 42, 0.9); border-radius: 8px; border: 1.5px solid ${color}; line-height: 1.6;">
                <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 4px; flex-wrap: wrap; gap: 6px;">
                    <strong style="color: ${color}; font-size: 1em;">BMI: ${bmi} kg/m² (${status})</strong>
                    <span style="color: ${color}; font-weight: bold; font-size: 0.85em;">${deltaText}</span>
                </div>
                <div style="color: #cbd5e1; font-size: 0.85em;">💡 <strong>الأثر الميكانيكي:</strong> ${impact}</div>
            </div>
        `;
    }
}

// عزل المصطلحات الإنجليزية واللاتينية الطبية داخل النصوص العربية لمنع تشوه الأقواس وتداخل الكلمات (Bidi isolation)
function formatBidiMedicalText(text) {
    if (!text) return '';
    return text.toString().replace(/[\(（]\s*([A-Za-z0-9\s\-_/.,+*&]+)\s*[\)）]/g, (match, term) => {
        let cleanTerm = term.trim().replace(/^[&+،,\s]+/, '').replace(/[&+،,\s]+$/, '').trim();
        if (!cleanTerm) return match;
        if (/[A-Za-z]/.test(cleanTerm)) {
            return ` <span class="medical-latin-badge" dir="ltr">(${cleanTerm})</span> `;
        }
        return ` (${cleanTerm}) `;
    });
}

// عرض التقرير الطبي الملكي عالي الاحترافية (Royal Medical Report)
function displayDiagnosticReport(data) {
    const reportContainer = document.getElementById('clinical-report-container');
    if (!reportContainer) return;

    if (data.isRedFlag) {
        reportContainer.innerHTML = `
            <div style="background: rgba(239, 68, 68, 0.12); border: 2px solid #ef4444; border-radius: 16px; padding: 30px; text-align: center;">
                <div style="font-size: 3.5em; margin-bottom: 12px;">🚨</div>
                <h2 style="color: #ef4444; margin: 0 0 10px 0;">${data.title}</h2>
                <p style="color: #fca5a5; font-size: 1.1em; line-height: 1.7;">${data.summary}</p>
                <div style="background: #111827; border-radius: 10px; padding: 20px; margin-top: 20px; text-align: right;">
                    <h4 style="color: #d4af37; margin: 0 0 10px 0;">التوصيات الطبية الفورية من المعالج:</h4>
                    <ul style="color: #e2e8f0; margin: 0; padding-right: 20px; line-height: 1.8;">
                        ${(data.recommendations || []).map(r => `<li>${r}</li>`).join('')}
                    </ul>
                </div>
                <div style="margin-top: 25px;">
                    <a href="${CLINIC_WHATSAPP}" target="_blank" class="btn-header btn-whatsapp-cta" style="font-size: 1.05em; padding: 14px 30px;">💬 تواصل مع المعالج للاستشارة العاجلة</a>
                </div>
            </div>
        `;
        return;
    }

    const reportId = "SCP-" + Math.floor(100000 + Math.random() * 900000);
    const currentDate = new Date().toLocaleDateString('ar-EG', { year: 'numeric', month: 'long', day: 'numeric' });

    // استكمال واحتساب مؤشر كتلة الجسم والحمولة الميكانيكية تلقائياً من المحادثة أو المدخلات
    const vitals = (typeof clinicalDialogueState !== 'undefined' && clinicalDialogueState?.patientVitals) 
        ? clinicalDialogueState.patientVitals 
        : (data.patientVitals || {});
    const w = vitals.weight || parseFloat(document.getElementById('patient-weight')?.value);
    const h = vitals.height || parseFloat(document.getElementById('patient-height')?.value);
    if (w && h && h > 0) {
            const hM = h / 100;
            const bmiVal = parseFloat((w / (hM * hM)).toFixed(1));
            const minHealthyW = parseFloat((18.5 * hM * hM).toFixed(1));
            const maxHealthyW = parseFloat((24.9 * hM * hM).toFixed(1));
            const idealW = parseFloat((22.0 * hM * hM).toFixed(1));

            let bmiStatus = "وزن طبيعي متوازن";
            let bmiColor = "#10b981";
            let deltaText = `✅ وزنك ضمن النطاق الصحي المثالي (${minHealthyW} - ${maxHealthyW} كجم)`;
            let impact = "وزنك متناسق ولا يشكل حمولة ضغط إضافية على الغضاريف والفقرات.";

            if (bmiVal < 18.5) {
                const deltaKg = parseFloat((minHealthyW - w).toFixed(1));
                bmiStatus = "نحافة / نقص في الكتلة العضلية";
                bmiColor = "#38bdf8";
                deltaText = `⚠️ نقص في الوزن بمقدار -${deltaKg} كجم عن الحد الأدنى للوزن الصحي (${minHealthyW} كجم)`;
                impact = "نقص الكتلة العضلية يقلل من الثبات الميكانيكي للمفاصل ويجعل الفقرات عرضة للإجهاد السريع.";
            } else if (bmiVal >= 25 && bmiVal < 30) {
                const deltaKg = parseFloat((w - maxHealthyW).toFixed(1));
                const excessVsIdeal = parseFloat((w - idealW).toFixed(1));
                const addedLoad = parseFloat((deltaKg * 4).toFixed(1));
                bmiStatus = "زيادة وزن (Overweight)";
                bmiColor = "#f59e0b";
                deltaText = `⚠️ وزن زائد بمقدار +${deltaKg} كجم عن الحد الصحي (+${excessVsIdeal} كجم عن الوزن المثالي)`;
                impact = `يضيف حوالي +${addedLoad} كجم حمولة ضغط إضافية على الركبتين وأسفل الظهر أثناء الحركة.`;
            } else if (bmiVal >= 30) {
                const deltaKg = parseFloat((w - maxHealthyW).toFixed(1));
                const excessVsIdeal = parseFloat((w - idealW).toFixed(1));
                const addedLoad = parseFloat((deltaKg * 4).toFixed(1));
                bmiStatus = "سمنة مفرطة / حمولة ميكانيكية حرجة";
                bmiColor = "#ef4444";
                deltaText = `🚨 وزن زائد حرج بمقدار +${deltaKg} كجم (+${excessVsIdeal} كجم عن الوزن المثالي)`;
                impact = `كل 1 كجم زيادة يضاعف الحمل 4 أضعاف، مما يشكل حمولة ضغط فائقة تصل إلى +${addedLoad} كجم على مفاصلك وفقراتك.`;
            }

            data.bmiInfo = {
                value: bmiVal,
                status: bmiStatus,
                color: bmiColor,
                minHealthyW,
                maxHealthyW,
                idealW,
                deltaText,
                impact
            };
        }

    const formattedDiag = formatBidiMedicalText(data.primaryDiagnosis);
    const formattedRoot = formatBidiMedicalText(data.rootLevel);
    const formattedSec = formatBidiMedicalText(data.secondaryDiagnosis);

    reportContainer.innerHTML = `
        <div class="clinical-report-printable" style="background: linear-gradient(135deg, #0d1522 0%, #152238 100%); border-radius: 16px; padding: 32px; border: 1.5px solid var(--primary-gold); box-shadow: 0 12px 40px rgba(0,0,0,0.6); margin-bottom: 30px;">
            
            <!-- ================= 1. الترويسة الطبية الملكية ================= -->
            <div style="display: flex; justify-content: space-between; align-items: center; border-bottom: 2px solid var(--primary-gold); padding-bottom: 22px; margin-bottom: 25px; flex-wrap: wrap; gap: 15px;">
                <div style="display: flex; align-items: center; gap: 16px;">
                    <img src="assets/logo.png" alt="شعار وداعاً للألم" style="height: 70px; width: 70px; border-radius: 50%; border: 2px solid var(--primary-gold); background: #000; box-shadow: 0 4px 15px rgba(212,175,55,0.3);">
                    <div>
                        <h1 style="color: #ffffff; margin: 0 0 4px 0; font-size: 1.65em; font-weight: 800; letter-spacing: 0.5px;">التقرير التشخيصي والتقييم السريري الذكي</h1>
                        <div style="color: var(--primary-gold); font-size: 0.95em; font-weight: bold;">
                            المراجع: <span style="color: #38bdf8; font-weight: 900;">${(data.patientName && data.patientName !== 'المراجع الكريم') ? data.patientName : (clinicalDialogueState.patientName && clinicalDialogueState.patientName !== 'المراجع الكريم') ? clinicalDialogueState.patientName : 'المراجع المحترم'}</span> • «وداعاً للألم» للكايروبراكتيك
                        </div>
                        <div style="color: #94a3b8; font-size: 0.82em; margin-top: 2px;">رقم التقرير السريري: <span style="color: #e2e8f0; font-weight: bold;">${reportId}</span> | التاريخ: ${currentDate}</div>
                    </div>
                </div>
                
                <div class="report-top-actions" style="display: flex; gap: 8px; align-items: center; flex-wrap: wrap; max-width: 100%; box-sizing: border-box;">
                    <div style="background: #0f172a; border: 1.5px solid #10b981; padding: 6px 10px; border-radius: 8px; text-align: center; flex: 1 1 70px; box-sizing: border-box;">
                        <div style="color: #10b981; font-weight: bold; font-size: 1.05em;">${data.probability}%</div>
                        <div style="color: #94a3b8; font-size: 0.72em;">نسبة الاحتمالية</div>
                    </div>
                    <div style="background: #0f172a; border: 1.5px solid var(--primary-gold); padding: 6px 10px; border-radius: 8px; text-align: center; flex: 1 1 70px; box-sizing: border-box;">
                        <div style="color: var(--primary-gold); font-weight: bold; font-size: 1.05em;">${data.confidenceScore}%</div>
                        <div style="color: #94a3b8; font-size: 0.72em;">مؤشر الثقة</div>
                    </div>
                    <div class="report-header-buttons" style="display: grid; grid-template-columns: 1fr 1fr; gap: 6px; flex: 2 1 180px; width: 100%; max-width: 100%; box-sizing: border-box;">
                        <button type="button" onclick="sendWhatsAppDiagnosticReport()" class="btn-header no-print btn-whatsapp-cta" style="width: 100%; padding: 8px 6px; font-weight: bold; font-size: 0.8em; border-radius: 8px; white-space: nowrap; box-sizing: border-box; display: flex; align-items: center; justify-content: center; gap: 4px;">
                            💬 إرسال واتساب
                        </button>
                        <button type="button" onclick="window.print()" class="btn-header no-print" style="width: 100%; background: #3b82f6; color: #fff; border-color: #3b82f6; padding: 8px 6px; font-weight: bold; font-size: 0.8em; border-radius: 8px; white-space: nowrap; box-sizing: border-box; display: flex; align-items: center; justify-content: center; gap: 4px;">🖨️ طباعة / PDF</button>
                    </div>
                </div>
            </div>

            <!-- شريط التنقل السريع التفاعلي في التقرير (مريح وسلس للهواتف) -->
            <div class="no-print report-quick-nav-bar" style="display: flex; gap: 6px; margin-bottom: 20px; overflow-x: auto; padding-bottom: 6px; -webkit-overflow-scrolling: touch;">
                <button type="button" onclick="document.getElementById('report-section-diagnosis')?.scrollIntoView({behavior: 'smooth'})" class="btn-header btn-header-gold" style="font-size: 0.8em; padding: 6px 12px; border-radius: 16px; flex-shrink: 0; white-space: nowrap;">🩺 التشخيص</button>
                <button type="button" onclick="document.getElementById('recovery-plan-master-card')?.scrollIntoView({behavior: 'smooth'})" class="btn-header btn-header-emerald" style="font-size: 0.8em; padding: 6px 12px; border-radius: 16px; flex-shrink: 0; white-space: nowrap;">🎁 تفعيل الخطة المجانية</button>
                <button type="button" onclick="document.getElementById('permanent-bottom-section')?.scrollIntoView({behavior: 'smooth'})" class="btn-header btn-header-emerald-soft" style="font-size: 0.8em; padding: 6px 12px; border-radius: 16px; flex-shrink: 0; white-space: nowrap;">💬 تواصل للمعالج</button>
            </div>

            <!-- ================= 2. النتيجة التشخيصية الكبرى المباشرة ================= -->
            <div id="report-section-diagnosis" style="background: linear-gradient(135deg, rgba(15, 23, 42, 0.98) 0%, rgba(30, 41, 59, 0.9) 100%); border-radius: 14px; padding: 24px; border: 2px solid ${data.isPreliminary ? '#38bdf8' : 'var(--primary-gold)'}; margin-bottom: 22px; box-shadow: 0 8px 30px rgba(0,0,0,0.5);">
                <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 12px; flex-wrap: wrap; gap: 10px;">
                    <div>
                        <div style="color: #94a3b8; font-size: 0.88em; font-weight: bold;">🩺 ${data.isPreliminary ? 'التقييم الاسترشادي الأولي:' : 'خلاصة التشخيص السريري المباشر:'}</div>
                        <h2 style="color: ${data.isPreliminary ? '#7dd3fc' : 'var(--primary-gold)'}; margin: 6px 0 2px 0; font-size: 1.45em; font-weight: 900;">${formattedDiag}</h2>
                        ${formattedRoot ? `<div style="color: #38bdf8; font-size: 0.88em; font-weight: bold; margin-top: 4px;">🎯 المستوى التشريحي المستهدف: ${formattedRoot}</div>` : ''}
                        <div style="margin-top: 10px;">
                            <span class="free-plan-highlight-badge">
                                <span>🎁</span>
                                <span>مشمول بالكامل في برنامج الـ 7 أيام المجاني للراحة الحركية والاستشفاء الذاتي</span>
                            </span>
                        </div>
                    </div>
                    <div style="display: flex; flex-direction: column; align-items: flex-end; gap: 4px;">
                        <span style="background: ${data.isPreliminary ? 'rgba(56, 189, 248, 0.2)' : 'rgba(16, 185, 129, 0.2)'}; border: 1.5px solid ${data.isPreliminary ? '#38bdf8' : '#10b981'}; color: ${data.isPreliminary ? '#7dd3fc' : '#6ee7b7'}; padding: 8px 18px; border-radius: 25px; font-weight: 800; font-size: 1em; letter-spacing: 0.5px;">
                            ${data.isPreliminary ? 'فحص استرشادي أولي' : `احتمالية التشخيص: ${data.probability}%`}
                        </span>
                        <div style="color: #94a3b8; font-size: 0.76em;">${data.isPreliminary ? 'بانتظار استكمال الأعراض الدقيقة' : 'مبني على الفحص السريري الدقيق'}</div>
                    </div>
                </div>

                <div style="background: #1e293b; height: 10px; border-radius: 5px; overflow: hidden; margin-bottom: 16px;">
                    <div style="background: ${data.isPreliminary ? 'linear-gradient(90deg, #38bdf8 0%, #0284c7 100%)' : 'linear-gradient(90deg, #d4af37 0%, #10b981 100%)'}; height: 100%; width: ${data.isPreliminary ? 60 : data.probability}%;"></div>
                </div>

                <div style="color: #cbd5e1; font-size: 0.9em; background: rgba(8, 12, 20, 0.6); padding: 10px 14px; border-radius: 8px; border-right: 3px solid #38bdf8;">
                    <strong>التشخيص التفريقي المصاحب (Differential Diagnosis):</strong> ${formattedSec}
                </div>
            </div>

            <!-- ================= 3. تقرير وتفسير الطبيب الافتراضي المباشر (Gemini AI Clinical Engine) ================= -->
            <div id="ai-clinical-insight-card" class="ai-clinical-card" style="background: linear-gradient(135deg, rgba(15, 23, 42, 0.98) 0%, rgba(6, 78, 59, 0.28) 100%); border: 1.5px solid #10b981; border-radius: 14px; padding: 24px; margin-bottom: 22px; box-shadow: 0 8px 30px rgba(0,0,0,0.55); position: relative;">
                <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 16px; flex-wrap: wrap; gap: 10px; border-bottom: 1px solid rgba(16, 185, 129, 0.25); padding-bottom: 14px;">
                    <div style="display: flex; align-items: center; gap: 12px; flex: 1 1 240px;">
                        <span style="font-size: 1.8em; filter: drop-shadow(0 2px 6px rgba(16,185,129,0.5));">👨‍⚕️</span>
                        <div>
                            <h3 style="color: #6ee7b7; margin: 0; font-size: 1.18em; font-weight: 800;">تقرير وتفسير الطبيب الافتراضي للحالة</h3>
                            <div style="color: #94a3b8; font-size: 0.8em;">تحليل سريري لأصل الخلل الحركي • <strong style="color: #fef08a;">برنامج الـ 7 أيام المجاني متاح لك فورياً</strong></div>
                        </div>
                    </div>
                    <div class="ai-card-header-actions" style="display: grid; grid-template-columns: 1fr 1fr; gap: 8px; width: 100%; max-width: 320px; box-sizing: border-box;">
                        <button type="button" id="btn-listen-ai-insight" onclick="togglePlayAiInsightAudio()" style="background: rgba(56, 189, 248, 0.15); border: 1px solid #38bdf8; color: #38bdf8; padding: 7px 8px; border-radius: 20px; font-size: 0.8em; font-weight: bold; cursor: pointer; display: flex; align-items: center; justify-content: center; gap: 5px; transition: 0.2s; white-space: nowrap; width: 100%; box-sizing: border-box;">
                            <span id="ai-audio-icon">🔊</span>
                            <span id="ai-audio-text">استمع للتقرير</span>
                        </button>
                        <span id="ai-status-badge" style="background: rgba(16, 185, 129, 0.18); border: 1px solid #10b981; color: #6ee7b7; font-size: 0.8em; font-weight: bold; padding: 7px 8px; border-radius: 20px; display: flex; align-items: center; justify-content: center; text-align: center; white-space: nowrap; width: 100%; box-sizing: border-box;">
                            ✨ جاري التحليل...
                        </span>
                    </div>
                </div>

                <!-- مساحة التحليل البيوميكانيكي والسريري المخصص -->
                <div id="ai-insight-content-area" style="min-height: 90px; margin-bottom: 18px;">
                    <div style="display: flex; align-items: center; gap: 10px; color: #94a3b8; font-size: 0.9em; padding: 15px 0;">
                        <span style="font-size: 1.3em; animation: spin 1.2s linear infinite; display: inline-block;">⚙️</span>
                        <span>جاري صياغة التفسير البيوميكانيكي المخصص لحالتك بناءً على إجاباتك ووصفك...</span>
                    </div>
                </div>

                <!-- شبكة المحفزات والمسكنات البيوميكانيكية الإكلينيكية -->
                <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(280px, 1fr)); gap: 15px; border-top: 1px solid rgba(255,255,255,0.08); padding-top: 16px;">
                    <div style="background: rgba(239, 68, 68, 0.08); border: 1px solid rgba(239, 68, 68, 0.3); padding: 15px; border-radius: 10px;">
                        <div style="color: #ef4444; font-weight: bold; font-size: 0.92em; margin-bottom: 8px;">⚠️ محفزات تفاقم الألم (يجب تجنبها لحين الفحص):</div>
                        <ul style="color: #fca5a5; margin: 0; padding-right: 18px; line-height: 1.7; font-size: 0.86em;">
                            ${(data.aggravatingFactors || []).map(f => `<li>${f}</li>`).join('')}
                        </ul>
                    </div>

                    <div style="background: rgba(16, 185, 129, 0.08); border: 1px solid rgba(16, 185, 129, 0.3); padding: 15px; border-radius: 10px;">
                        <div style="color: #10b981; font-weight: bold; font-size: 0.92em; margin-bottom: 8px;">✨ وضعيات الراحة المسكنة المبدئية:</div>
                        <ul style="color: #6ee7b7; margin: 0; padding-right: 18px; line-height: 1.7; font-size: 0.86em;">
                            ${(data.relievingFactors || []).map(f => `<li>${f}</li>`).join('')}
                        </ul>
                    </div>
                </div>
            </div>

            <!-- ================= 4. شبكة المؤشرات الحيوية والإجهاد الميكانيكي والأدلة ================= -->
            <div style="background: #0f172a; border-radius: 14px; padding: 22px; border: 1px solid rgba(212, 175, 55, 0.25); margin-bottom: 22px;">
                <div style="color: var(--primary-gold); font-size: 1.05em; font-weight: bold; margin-bottom: 14px; display: flex; align-items: center; gap: 8px;">
                    <span>📊</span> المؤشرات البيوميكانيكية والأدلة السريرية للحالة:
                </div>

                <!-- شبكة مؤشر كتلة الجسم BMI ومؤشر الإجهاد البيوميكانيكي -->
                <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(280px, 1fr)); gap: 14px; margin-bottom: 16px;">
                    <!-- كرت مؤشر كتلة الجسم (BMI) المتطور -->
                    ${data.bmiInfo ? `
                        <div style="background: rgba(17, 24, 39, 0.85); border: 1.5px solid ${data.bmiInfo.color}; border-radius: 10px; padding: 16px; display: flex; flex-direction: column; justify-content: space-between;">
                            <div>
                                <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 8px; flex-wrap: wrap; gap: 6px;">
                                    <div style="color: #ffffff; font-weight: bold; font-size: 0.95em;">⚖️ مؤشر كتلة الجسم (BMI):</div>
                                    <span style="background: ${data.bmiInfo.color}22; border: 1px solid ${data.bmiInfo.color}; color: ${data.bmiInfo.color}; font-weight: bold; font-size: 0.9em; padding: 3px 10px; border-radius: 6px;">
                                        ${data.bmiInfo.value} kg/m² (${data.bmiInfo.status})
                                    </span>
                                </div>
                                <div style="background: rgba(15, 23, 42, 0.9); padding: 8px 12px; border-radius: 6px; border-right: 3px solid ${data.bmiInfo.color}; margin-bottom: 8px; color: ${data.bmiInfo.color}; font-weight: bold; font-size: 0.88em;">
                                    ${data.bmiInfo.deltaText}
                                </div>
                            </div>
                            <div style="color: #cbd5e1; font-size: 0.84em; line-height: 1.5;">💡 <strong>الأثر السريري:</strong> ${data.bmiInfo.impact}</div>
                        </div>
                    ` : `
                        <div style="background: rgba(17, 24, 39, 0.8); border: 1.5px solid #3b82f6; border-radius: 10px; padding: 15px;">
                            <div style="color: #ffffff; font-weight: bold; font-size: 0.95em; margin-bottom: 6px;">⚖️ مؤشر كتلة الجسم (BMI) والحمولة:</div>
                            <div style="display: flex; gap: 8px; flex-wrap: wrap; align-items: center;">
                                <input type="number" id="inline-report-weight" placeholder="الوزن (كجم)" value="${clinicalDialogueState?.patientVitals?.weight || data?.patientVitals?.weight || ''}" style="width: 95px; background: #0f172a; border: 1px solid #334155; padding: 6px 8px; border-radius: 6px; color: #fff; font-size: 0.85em;">
                                <input type="number" id="inline-report-height" placeholder="الطول (سم)" value="${clinicalDialogueState?.patientVitals?.height || data?.patientVitals?.height || ''}" style="width: 95px; background: #0f172a; border: 1px solid #334155; padding: 6px 8px; border-radius: 6px; color: #fff; font-size: 0.85em;">
                                <button type="button" onclick="calculateInlineReportBMI()" style="background: #3b82f6; color: #fff; border: none; padding: 6px 12px; border-radius: 6px; font-size: 0.84em; font-weight: bold; cursor: pointer;">احسب</button>
                            </div>
                            <div id="inline-bmi-result" style="margin-top: 6px;"></div>
                        </div>
                    `}

                    <!-- كرت مؤشر الإجهاد البيوميكانيكي -->
                    ${data.biomechanicalIndex ? `
                        <div style="background: rgba(17, 24, 39, 0.8); border: 1.5px solid ${data.biomechanicalIndex.color}; border-radius: 10px; padding: 15px; display: flex; flex-direction: column; justify-content: space-between;">
                            <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 6px;">
                                <div style="color: #ffffff; font-weight: bold; font-size: 0.95em;">🧬 مؤشر الإجهاد البيوميكانيكي:</div>
                                <span style="background: ${data.biomechanicalIndex.color}22; border: 1px solid ${data.biomechanicalIndex.color}; color: ${data.biomechanicalIndex.color}; font-weight: bold; font-size: 0.92em; padding: 3px 10px; border-radius: 6px;">
                                    ${data.biomechanicalIndex.score}% (${data.biomechanicalIndex.level})
                                </span>
                            </div>
                            <div style="color: #cbd5e1; font-size: 0.84em; line-height: 1.5;">${data.biomechanicalIndex.analysis}</div>
                        </div>
                    ` : ''}
                </div>

                <!-- بوصلة الأهداف الحركية المستهدفة للمريض -->
                ${data.lifeImpactSelected && data.lifeImpactSelected.length > 0 ? `
                    <div style="background: rgba(16, 185, 129, 0.08); border: 1.5px solid #10b981; padding: 14px 18px; border-radius: 10px; margin-bottom: 14px;">
                        <div style="color: #10b981; font-weight: bold; font-size: 0.92em; margin-bottom: 6px; display: flex; align-items: center; gap: 6px;">
                            <span>🎯</span> أهداف الراحة وجودة الحياة المستهدفة في خطتك:
                        </div>
                        <div style="display: flex; flex-wrap: wrap; gap: 8px;">
                            ${data.lifeImpactSelected.map(target => `
                                <span style="background: rgba(16, 185, 129, 0.2); color: #6ee7b7; padding: 4px 10px; border-radius: 6px; font-size: 0.84em; font-weight: bold;">
                                    ✓ ${target}
                                </span>
                            `).join('')}
                        </div>
                    </div>
                ` : ''}

                <!-- الأدلة السريرية -->
                <div style="background: #111827; padding: 16px; border-radius: 10px; border-right: 4px solid var(--primary-gold); margin-bottom: 14px;">
                    <div style="color: var(--primary-gold); font-size: 0.9em; font-weight: bold; margin-bottom: 8px;">📋 الأدلة والعلامات السريرية المكتشفة:</div>
                    <ul style="color: #e2e8f0; margin: 0; padding-right: 20px; line-height: 1.8; font-size: 0.88em;">
                        ${(data.clinicalEvidence || []).map(ev => `<li>${ev}</li>`).join('')}
                    </ul>
                </div>

                ${data.chronicPrecautions && data.chronicPrecautions.length > 0 ? `
                    <div style="background: rgba(234, 179, 8, 0.08); padding: 16px; border-radius: 10px; border: 1.5px solid #eab308;">
                        <div style="color: #eab308; font-size: 0.92em; font-weight: bold; margin-bottom: 8px;">🩺 توجيهات واحتياطات الأمراض المزمنة الخاصة:</div>
                        <ul style="color: #fef08a; margin: 0; padding-right: 20px; line-height: 1.8; font-size: 0.88em;">
                            ${data.chronicPrecautions.map(cp => `<li>${cp}</li>`).join('')}
                        </ul>
                    </div>
                ` : ''}
            </div>

            <!-- ================= 5. محاكي ضغط الفقرات وتفريغ الأعصاب التفاعلي ================= -->
            ${(function() {
                const ptId = (data.pointId || '').toLowerCase();
                const diagKey = (data.primaryDiagnosisKey || '').toLowerCase();
                const diagTitle = (data.primaryDiagnosis || '').toLowerCase();
                const isSpineOrDisc = ptId.includes('lumbar') || 
                                      ptId.includes('cervical') || 
                                      ptId.includes('thoracic') || 
                                      ptId.includes('sacroiliac') || 
                                      ptId.includes('gluteal') || 
                                      ptId.includes('back') || 
                                      ptId.includes('neck') || 
                                      ptId.includes('spine') || 
                                      diagKey.includes('disc') || 
                                      diagKey.includes('lumbar') || 
                                      diagKey.includes('cervical') || 
                                      diagKey.includes('sciatica') || 
                                      diagTitle.includes('ديسك') || 
                                      diagTitle.includes('فقر') || 
                                      diagTitle.includes('غضروف') || 
                                      diagTitle.includes('نسا');
                if (isSpineOrDisc) {
                    return getInteractiveSpinalSimulatorHTML(data.painAreaTitle);
                }
                return '';
            })()}

            <!-- ================= 6. مسار الشفاء السريري: الراحة الذاتية مقابل الحل الجذري ================= -->
            <div style="background: linear-gradient(135deg, rgba(15, 23, 42, 0.95) 0%, rgba(212, 175, 55, 0.12) 100%); border: 1.5px solid var(--primary-gold); border-radius: 14px; padding: 20px; margin-bottom: 22px; box-shadow: 0 4px 20px rgba(0,0,0,0.35);">
                <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 12px; flex-wrap: wrap; gap: 8px;">
                    <div style="display: flex; align-items: center; gap: 8px;">
                        <span style="font-size: 1.3em;">🎯</span>
                        <h4 style="color: var(--primary-gold); margin: 0; font-size: 1.15em;">مسار الشفاء السريري: الراحة الذاتية مقابل الحل الجذري</h4>
                    </div>
                    <span style="color: #38bdf8; font-size: 0.82em; font-weight: bold; background: rgba(56, 189, 248, 0.15); padding: 4px 10px; border-radius: 6px; border: 1px solid rgba(56, 189, 248, 0.3);">إشراف المعالج جمال</span>
                </div>
                <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(260px, 1fr)); gap: 14px; margin-top: 10px;">
                    <div style="background: rgba(17, 24, 39, 0.7); border: 1px solid rgba(16, 185, 129, 0.3); border-radius: 10px; padding: 14px;">
                        <div style="color: #10b981; font-weight: bold; font-size: 0.92em; margin-bottom: 6px;">🎁 أولاً: خطة الـ 7 أيام المنزلية (مجاناً بالكامل)</div>
                        <div style="color: #cbd5e1; font-size: 0.85em; line-height: 1.6;">تمارين استطالة وتليين حركي مدروسة صُممت خصيصاً لتسكين آلامك فورياً ومجاناً بالكامل عبر الخطوة التالية فور تفعيل خطتك أدناه.</div>
                    </div>
                    <div style="background: rgba(17, 24, 39, 0.7); border: 1px solid rgba(212, 175, 55, 0.35); border-radius: 10px; padding: 14px;">
                        <div style="color: var(--primary-gold); font-weight: bold; font-size: 0.92em; margin-bottom: 6px;">👐 ثانياً: الحل الجذري النهائي (الكايروبراكتيك)</div>
                        <div style="color: #cbd5e1; font-size: 0.85em; line-height: 1.6;">لإزالة سبب الألم نهائياً، يتطلب الأمر تقويماً يدوياً وتفريغ ضغط الفقرات والمفاصل مع المعالج جمال (جلسات مباشرة أو زيارات منزلية داخل الأردن).</div>
                    </div>
                </div>
            </div>


            <!-- ================= 6. حاسبة التوفير المالي والأمان الصحي ================= -->
            <div class="no-print">
                ${getTreatmentCostCalculatorHTML()}
            </div>

            <!-- ================= 7. كرت خطة الراحة المنزلية الذكية 7 أيام (متميز بالكامل كصدقة جارية مباركة) ================= -->
            <div id="recovery-plan-master-card" class="recovery-plan-distinct-card no-print" style="padding: 20px 16px; margin-bottom: 25px; background: linear-gradient(135deg, rgba(15, 23, 42, 0.98) 0%, rgba(6, 78, 59, 0.25) 100%); border: 2px solid var(--primary-gold); border-radius: 16px; box-shadow: 0 8px 30px rgba(0,0,0,0.5);">
                
                <div style="display: flex; justify-content: space-between; align-items: center; flex-wrap: wrap; gap: 12px; margin-bottom: 14px;">
                    <div>
                        <h3 style="color: var(--primary-gold); margin: 0 0 6px 0; font-size: 1.25em; font-weight: 800; display: inline-flex; align-items: center; gap: 8px;">
                            <span style="font-size: 1.25em;">🎁</span>
                            <span>خطة الراحة والتأهيل المنزلي الذكية (7 أيام مجاناً)</span>
                        </h3>
                        <p style="color: #e2e8f0; font-size: 0.92em; margin: 0; line-height: 1.5;">برنامج راحة واستطالة مؤتمت مخصص لمنطقة <strong style="color: #38bdf8;">${data.painAreaTitle}</strong> مبني بالكامل على الأعراض التي أدخلتها.</p>
                    </div>
                    <span style="background: rgba(16, 185, 129, 0.22); border: 1.5px solid #10b981; color: #6ee7b7; padding: 6px 16px; border-radius: 20px; font-weight: 800; font-size: 0.88em; white-space: nowrap;">
                        ✓ هدية مجانية 100%
                    </span>
                </div>

                <!-- تنبيه طبي إلزامي بأن الخطة للراحة فقط والعلاج الحقيقي مع المعالج -->
                <div style="background: rgba(234, 179, 8, 0.12); border: 1.5px solid #eab308; border-radius: 10px; padding: 12px 16px; margin-bottom: 16px; color: #fef08a; font-size: 0.88em; line-height: 1.7;">
                    ⚠️ <strong>تنبيه سريري هام:</strong> هذه الخطة المنزلية هي برنامج راحة وتخفيف مؤقت للإجهاد مبنية على مدخلاتك الذاتية، وليست علاجاً نهائياً أو بديلاً عن جلسات الكايروبراكتيك السريرية في وداعاً للألم لتفريغ ضغط الفقرات والمفاصل يدوياً.
                </div>

                <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(230px, 1fr)); gap: 10px; margin-bottom: 18px; background: rgba(15, 23, 42, 0.75); padding: 14px 16px; border-radius: 10px; border: 1px solid rgba(212, 175, 55, 0.25);">
                    <div style="color: #e2e8f0; font-size: 0.86em; display: flex; align-items: center; gap: 8px;">
                        <span style="color: #10b981; font-size: 1.1em; font-weight: bold;">✓</span> تمارين راحة وتليين ذكية ومخصصة لنقطة الألم يومياً
                    </div>
                    <div style="color: #e2e8f0; font-size: 0.86em; display: flex; align-items: center; gap: 8px;">
                        <span style="color: #10b981; font-size: 1.1em; font-weight: bold;">✓</span> مؤقتات تفاعلية وتوجيه صوتي ذاتي لأداء التمارين
                    </div>
                    <div style="color: #e2e8f0; font-size: 0.86em; display: flex; align-items: center; gap: 8px;">
                        <span style="color: #10b981; font-size: 1.1em; font-weight: bold;">✓</span> قياس مؤشرات الراحة الثلاثية ومنحنى تراجع الألم
                    </div>
                    <div style="color: #e2e8f0; font-size: 0.86em; display: flex; align-items: center; gap: 8px;">
                        <span style="color: #10b981; font-size: 1.1em; font-weight: bold;">✓</span> وسام الانتصار على الألم ووثيقة التعافي الرسمية
                    </div>
                </div>

                <div id="plan-activation-btn-wrapper" style="text-align: center; margin: 24px auto 12px auto; max-width: 640px;">
                    <button type="button" onclick="activateRecoveryPlanInstantly()" class="btn-plan-royal-card" id="btn-activate-plan-royal" aria-label="تفعيل الخطة المجانية">
                        <div class="royal-card-halo"></div>
                        <div class="royal-card-shimmer"></div>
                        <div class="royal-badge-pill">
                            <span class="royal-badge-dot"></span>
                            <span>✨ برنامج استشفاء وتأهيل مجاني 100% • بدون أي رسوم</span>
                        </div>
                        <div class="royal-main-content">
                            <div class="royal-icon-box">
                                <span class="royal-icon-emoji">🚀</span>
                            </div>
                            <div class="royal-text-col">
                                <div class="royal-cta-headline">تفعيل الخطة التأهيلية المنزلية الشاملة</div>
                                <div class="royal-cta-subline">برنامج 7 أيام مخصص لحالتك • مؤقتات حركية ذكية • توجيه صوتي متقدم</div>
                            </div>
                            <div class="royal-arrow-box">
                                <span class="royal-arrow-anim">⬅️</span>
                            </div>
                        </div>
                    </button>
                    
                    <!-- شريط الإهداء والصدقة الجارية تحت زر التفعيل مباشرة -->
                    <div style="background: linear-gradient(135deg, rgba(16, 185, 129, 0.22) 0%, rgba(212, 175, 55, 0.18) 100%); border: 1.5px solid var(--primary-gold); border-radius: 12px; padding: 12px 16px; margin-top: 14px; text-align: center; box-shadow: 0 4px 15px rgba(0,0,0,0.3);">
                        <div style="color: #fef08a; font-weight: 800; font-size: 0.98em; display: flex; align-items: center; justify-content: center; gap: 6px; margin-bottom: 3px; flex-wrap: wrap;">
                            <span style="font-size: 1.2em;">🌿</span>
                            <span>مقدمة مجاناً بالكامل كصدقة جارية عن روح المرحوم والد المعالج جمال قبها مطور هذه الأداة</span>
                        </div>
                        <div style="color: #6ee7b7; font-size: 0.88em; font-weight: bold;">
                            نسألكم له خالص الدعاء بالرحمة والمغفرة وعلو الدرجات في الجنة 🤲
                        </div>
                    </div>
                </div>

                <div id="plan-registration-inputs" style="display: none; margin-top: 18px; background: #0f172a; padding: 20px; border-radius: 12px; border: 1px solid var(--primary-gold);">
                    <div style="color: #10b981; font-weight: bold; font-size: 1em; margin-bottom: 15px;">📝 أدخل بياناتك لحفظ ومتابعة خطة الراحة الذاتية:</div>
                    
                    <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(210px, 1fr)); gap: 14px; margin-bottom: 18px;">
                        <div>
                            <label style="color: #cbd5e1; font-size: 0.86em; display: block; margin-bottom: 6px;">الدولة:</label>
                            <select id="sub-country" onchange="updatePhoneCodePrefix()" style="width: 100%; background: #111827; border: 1px solid #334155; padding: 10px; border-radius: 8px; color: #fff; font-size: 0.9em;">
                                <option value="+962" selected>🇯🇴 الأردن (+962)</option>
                                <option value="+966">🇸🇦 السعودية (+966)</option>
                                <option value="+971">🇦🇪 الإمارات (+971)</option>
                                <option value="+965">🇰🇼 الكويت (+965)</option>
                                <option value="+974">🇶🇦 قطر (+974)</option>
                                <option value="+968">🇴🇲 عمان (+968)</option>
                                <option value="+973">🇧🇭 البحرين (+973)</option>
                                <option value="+20">🇪🇬 مصر (+20)</option>
                                <option value="+970">🇵🇸 فلسطين (+970)</option>
                                <option value="+964">🇮🇶 العراق (+964)</option>
                                <option value="+000">🌍 دولة أخرى</option>
                            </select>
                        </div>

                        <div>
                            <label style="color: #cbd5e1; font-size: 0.86em; display: block; margin-bottom: 6px;">الاسم الكامل:</label>
                            <input type="text" id="sub-name" placeholder="أدخل اسمك الكريم" style="width: 100%; background: #111827; border: 1px solid #334155; padding: 10px; border-radius: 8px; color: #fff; font-size: 0.9em;">
                        </div>

                        <div>
                            <label style="color: #cbd5e1; font-size: 0.86em; display: block; margin-bottom: 6px;">رقم الهاتف / الواتساب:</label>
                            <div style="display: flex; direction: ltr;">
                                <span id="phone-prefix-display" style="background: #1e293b; color: var(--primary-gold); padding: 10px 12px; border: 1px solid #334155; border-right: none; border-radius: 8px 0 0 8px; font-weight: bold; font-size: 0.88em;">+962</span>
                                <input type="tel" id="sub-phone" placeholder="790000000" style="flex: 1; background: #111827; border: 1px solid #334155; padding: 10px; border-radius: 0 8px 8px 0; color: #fff; font-size: 0.9em; outline: none;">
                            </div>
                        </div>
                    </div>

                    <button type="button" onclick="submitPatientRegistrationAndStart()" style="width: 100%; background: linear-gradient(135deg, #10b981 0%, #059669 100%); color: #ffffff; border: none; padding: 13px; border-radius: 8px; font-size: 1.05em; font-weight: bold; cursor: pointer; box-shadow: 0 4px 20px rgba(16, 185, 129, 0.35);">
                        ✅ تأكيد البيانات وبدء الجلسة الأولى الآن
                    </button>
                </div>
            </div>

            <!-- ================= 8. الزيارات المنزلية وخدمة مرضى خارج الأردن ================= -->
            <div class="no-print">
                ${getHomeVisitCardHTML()}
                ${getInternationalPatientsCardHTML()}
            </div>
        </div>
    `;

    // تفعيل وتوليد التحليل السريري المخصص بالذكاء الاصطناعي واحتساب الـ BMI فوراً
    setTimeout(() => {
        const wInput = document.getElementById('inline-report-weight');
        const hInput = document.getElementById('inline-report-height');
        if (wInput && hInput && wInput.value && hInput.value) {
            calculateInlineReportBMI();
        }

        if (typeof Wada3anAiEngine !== 'undefined') {
            const statusBadge = document.getElementById('ai-status-badge');
            const contentArea = document.getElementById('ai-insight-content-area');

            const rawPName = clinicalDialogueState.patientName || document.getElementById('patient-name')?.value?.trim() || data.patientName || activePatient?.name;
            const pName = (rawPName && rawPName !== 'المراجع الكريم') ? rawPName : '';
            const painDurationMap = {
                'days': 'ألم حاد حديث (أقل من أسبوع)',
                '1_week': 'من أسبوع إلى شهر',
                'chronic': 'ألم مزمن مستمر (أكثر من 3 أشهر)'
            };
            const durationText = painDurationMap[data.painDuration] || 'ألم مستمر';

            Wada3anAiEngine.generateClinicalInsight({
                patientName: pName,
                painAreaTitle: data.title || data.painAreaTitle || data.painPointTitle || data.primaryDiagnosis || 'العمود الفقري والمفاصل',
                primaryDiagnosis: data.primaryDiagnosis || data.title,
                probableCondition: data.primaryDiagnosis || data.title,
                pointId: data.pointId || data.painAreaKey,
                probability: data.probability || 85,
                region: data.region || 'الظهر',
                painSeverity: (data.hasExplicitPain && data.painSeverity !== null && data.painSeverity !== undefined) ? data.painSeverity : null,
                hasExplicitPain: !!data.hasExplicitPain,
                painDurationText: durationText,
                userNotes: data.userNotes || '',
                allSymptoms: data.allSelectedSymptoms || [],
                lifeImpact: data.lifeImpactSelected || [],
                rootLevel: data.rootLevel || '',
                secondaryDiagnosis: data.secondaryDiagnosis || '',
                biomechanicalMechanism: data.biomechanicalMechanism || '',
                chiropracticProtocol: data.chiropracticProtocol || ''
            }).then(html => {
                if (contentArea) contentArea.innerHTML = html;
                if (statusBadge) {
                    const isLive = typeof WADA3AN_AI_CONFIG !== 'undefined' && WADA3AN_AI_CONFIG.isConfigured();
                    statusBadge.innerHTML = isLive ? '🟢 تحليل فوري' : '⚡ تحليل ذكي';
                    statusBadge.style.color = isLive ? '#6ee7b7' : '#fef08a';
                    statusBadge.style.borderColor = isLive ? '#10b981' : '#d4af37';
                }
            }).catch(err => {
                console.warn('AI insight error:', err);
                if (contentArea) contentArea.innerHTML = Wada3anAiEngine.generateOfflineClinicalFallback(data);
            });
        }
    }, 60);
}

// دوال إدارة النوافذ المنبثقة لخدمة قراءة الرنين وقصص النجاح بالفيديو
function openMriConsultationModal() {
    stopAllActiveAudio();
    const modal = document.getElementById('mri-consultation-modal');
    if (modal) {
        modal.style.display = 'flex';
        document.body.style.overflow = 'hidden';
    }
}

function closeMriConsultationModal() {
    const modal = document.getElementById('mri-consultation-modal');
    if (modal) {
        modal.style.display = 'none';
        document.body.style.overflow = '';
    }
}

const DEFAULT_SUCCESS_STORY_VIDEOS = [
    {
        id: 'vid_lumbar_sciatica',
        title: 'تعافي ديسك قطني وانضغاط العصب الوركي',
        category: '⚡ أسفل الظهر وعرق النسا',
        url: 'https://www.youtube.com/embed/dQw4w9WgXcQ',
        directUrl: 'https://www.facebook.com/Wada3an.Al.Alam',
        description: 'مراجع عانى لأشهر من ألم حاد نازل للساق مع عرج وصعوبة بالنوم. استعاد المشي الطبيعي بعد تفريغ الضغط يدوياً.'
    },
    {
        id: 'vid_cervical_arm',
        title: 'علاج انضغاط ديسك الرقبة وتنميل اليد والصداع',
        category: '⚡ الرقبة والأبهر',
        url: 'https://www.youtube.com/embed/dQw4w9WgXcQ',
        directUrl: 'https://www.facebook.com/Wada3an.Al.Alam',
        description: 'تحرير الجذور العصبية C5-C7 وفك تشنجات الأبهر المزمنة وعودة كامل القوة العضلية لليد والراحة التامة.'
    },
    {
        id: 'vid_knee_patella',
        title: 'احتكاك صابونة الركبة واستعادة الثني والصلاة',
        category: '⚡ مفصل الركبة والصابونة',
        url: 'https://www.youtube.com/embed/dQw4w9WgXcQ',
        directUrl: 'https://www.facebook.com/Wada3an.Al.Alam',
        description: 'إعادة التوازن الميكانيكي ومسار انزلاق الصابونة أنهى الطقطقة والألم ومكن المريض من ثني الركبة والصلاة براحة.'
    },
    {
        id: 'vid_scoliosis_posture',
        title: 'تعديل انحراف الجذع والجنف واستقامة القوام',
        category: '⚡ الجنف والعمود الفقري',
        url: 'https://www.youtube.com/embed/dQw4w9WgXcQ',
        directUrl: 'https://www.facebook.com/Wada3an.Al.Alam',
        description: 'استعادة استقامة القفص الصدري وزوال ضيق التنفس والألم المستمر بين لوحي الكتف بدون جراحة.'
    }
];

function getVideoSuccessStories() {
    try {
        const stored = localStorage.getItem('wada3an_success_stories_videos');
        if (stored) {
            const parsed = JSON.parse(stored);
            if (Array.isArray(parsed) && parsed.length > 0) return parsed;
        }
    } catch (e) {}
    return DEFAULT_SUCCESS_STORY_VIDEOS;
}

function renderVideoSuccessStories() {
    const container = document.getElementById('video-success-stories-container');
    if (!container) return;

    const list = getVideoSuccessStories();
    container.innerHTML = list.map(item => {
        const titleSafe = (item.title || '').replace(/"/g, '&quot;');
        // منطق بسيط وقوي: استخدم directUrl مباشرة إذا يحتوي على رابط فيديو حقيقي
        let targetUrl = '';
        const rawDirect = (item.directUrl || '').trim();
        const rawUrl    = (item.url || '').trim();

        // هل rawDirect رابط فيديو حقيقي (يحتوي /videos/ أو /watch أو youtu أو .mp4 أو /reel/)?
        const isRealVideoUrl = (u) => u && (
            u.includes('/videos/') || u.includes('/watch') ||
            u.includes('youtu.be') || u.includes('youtube.com/watch') ||
            u.includes('/reel/') || u.includes('.mp4') || u.includes('/v/')
        );

        if (isRealVideoUrl(rawDirect)) {
            targetUrl = rawDirect;
        } else if (rawUrl.includes('youtube.com/embed/')) {
            // تحويل رابط تضمين يوتيوب إلى رابط مباشر
            const vidId = rawUrl.split('embed/')[1]?.split('?')[0];
            targetUrl = vidId ? `https://www.youtube.com/watch?v=${vidId}` : rawDirect || rawUrl || 'https://www.facebook.com/Wada3an.Al.Alam';
        } else if (isRealVideoUrl(rawUrl)) {
            targetUrl = rawUrl;
        } else {
            // كلاهما مجرد صفحة عامة - استخدم directUrl أياً كان أو الصفحة
            targetUrl = rawDirect || rawUrl || 'https://www.facebook.com/Wada3an.Al.Alam';
        }

        const urlSafe = targetUrl.replace(/"/g, '&quot;');
        const descSafe = (item.description || '').replace(/"/g, '&quot;');
        const catSafe = item.category || '⚡ حالة سريرية موثقة';

        const whatsappMsg = encodeURIComponent(`مرحباً دكتور جمال، شاهدت توثيق حالة (${item.title}) في «وداعاً للألم» وأود استشارتكم حول حالتي.`);
        const whatsappUrl = `https://wa.me/962799307770?text=${whatsappMsg}`;

        return `
            <div style="background: #111e33; border: 1px solid rgba(59, 130, 246, 0.35); border-radius: 12px; padding: 16px; display: flex; flex-direction: column; justify-content: space-between; box-shadow: 0 4px 15px rgba(0,0,0,0.3);">
                <div>
                    <div style="display: flex; align-items: center; justify-content: space-between; margin-bottom: 8px;">
                        <span style="color: var(--primary-gold); font-size: 0.82em; font-weight: bold;">${catSafe}</span>
                        <span style="color: #10b981; font-size: 0.75em; background: rgba(16, 185, 129, 0.15); padding: 2px 8px; border-radius: 4px; font-weight: bold;">فيديو موثق</span>
                    </div>
                    <h4 style="color: #ffffff; margin: 0 0 8px 0; font-size: 1.05em; line-height: 1.4;">${item.title}</h4>
                    <p style="color: #cbd5e1; font-size: 0.84em; line-height: 1.6; margin: 0 0 14px 0;">${item.description}</p>
                </div>
                <div style="display: flex; flex-direction: column; gap: 8px;">
                    <a href="${urlSafe}" target="_blank" rel="noopener noreferrer" style="background: linear-gradient(135deg, #2563eb 0%, #1d4ed8 100%); color: #fff; text-decoration: none; padding: 10px 14px; border-radius: 8px; font-size: 0.88em; font-weight: bold; cursor: pointer; display: flex; align-items: center; justify-content: center; gap: 6px; box-shadow: 0 4px 12px rgba(37,99,235,0.35);">
                        <span>▶️ مشاهدة الفيديو المباشر</span>
                    </a>
                    <a href="${whatsappUrl}" target="_blank" rel="noopener noreferrer" style="background: rgba(16, 185, 129, 0.15); border: 1px solid #10b981; color: #6ee7b7; text-decoration: none; padding: 8px 12px; border-radius: 8px; font-size: 0.8em; font-weight: bold; display: flex; align-items: center; justify-content: center; gap: 6px;">
                        <span>💬 اطلب فيديو الحالة عبر واتساب</span>
                    </a>
                </div>
            </div>
        `;
    }).join('');
}

function openInAppVideoPlayer(videoUrl, title) {
    const modal = document.getElementById('in-app-video-player-modal');
    const wrap = document.getElementById('in-app-video-player-frame-wrap');
    const titleEl = document.getElementById('in-app-video-player-title');
    const waBtn = document.getElementById('in-app-video-whatsapp-btn');

    if (!modal || !wrap) return;

    if (titleEl) titleEl.textContent = title || 'مشاهدة توثيق الحالة';

    if (waBtn) {
        const msg = encodeURIComponent(`مرحباً دكتور، شاهدت فيديو (${title || 'حالة سريرية'}) وأود الاستفسار عن علاجي.`);
        waBtn.href = `https://wa.me/962799307770?text=${msg}`;
    }

    // تجهيز المشغل بناءً على نوع الرابط
    if (videoUrl.includes('.mp4') || videoUrl.includes('.webm')) {
        wrap.innerHTML = `<video controls autoplay playsinline style="position: absolute; top: 0; left: 0; width: 100%; height: 100%; object-fit: contain;"><source src="${videoUrl}" type="video/mp4">متصفحك لا يدعم تشغيل الفيديو</video>`;
    } else {
        // تحويل روابط يوتيوب العادية إلى روابط تضمين
        let embedUrl = videoUrl;
        if (embedUrl.includes('watch?v=')) {
            embedUrl = embedUrl.replace('watch?v=', 'embed/');
        } else if (embedUrl.includes('youtu.be/')) {
            embedUrl = embedUrl.replace('youtu.be/', 'www.youtube.com/embed/');
        }
        wrap.innerHTML = `<iframe src="${embedUrl}" style="position: absolute; top: 0; left: 0; width: 100%; height: 100%; border: none;" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>`;
    }

    modal.style.display = 'flex';
}

function closeInAppVideoPlayer() {
    const modal = document.getElementById('in-app-video-player-modal');
    const wrap = document.getElementById('in-app-video-player-frame-wrap');
    if (wrap) wrap.innerHTML = '';
    if (modal) modal.style.display = 'none';
}

function openVideoSuccessStoriesModal() {
    stopAllActiveAudio();
    renderVideoSuccessStories();
    const modal = document.getElementById('video-success-stories-modal');
    if (modal) {
        modal.style.display = 'flex';
        document.body.style.overflow = 'hidden';
    }
}

function closeVideoSuccessStoriesModal() {
    const modal = document.getElementById('video-success-stories-modal');
    if (modal) {
        modal.style.display = 'none';
        document.body.style.overflow = '';
    }
}

window.openMriConsultationModal = openMriConsultationModal;
window.closeMriConsultationModal = closeMriConsultationModal;
window.openVideoSuccessStoriesModal = openVideoSuccessStoriesModal;
window.closeVideoSuccessStoriesModal = closeVideoSuccessStoriesModal;
window.openInAppVideoPlayer = openInAppVideoPlayer;
window.closeInAppVideoPlayer = closeInAppVideoPlayer;

// كتم / تفعيل الصوت
function toggleAudioMuteStatus(btn) {
    if (typeof ClinicalAudioPacer !== 'undefined') {
        const isMuted = ClinicalAudioPacer.toggleMute();
        btn.textContent = isMuted ? '🔇 التوجيه الصوتي: مكتوم' : '🔊 التوجيه الصوتي: مفعل';
        btn.style.color = isMuted ? '#ef4444' : '#10b981';
        showToast(isMuted ? 'تم كتم الصوت' : 'تم تفعيل التوجيه الصوتي', 'info');
    }
}

// حل مبتكر ورعاية متكاملة لمرضى خارج الأردن
function getInternationalPatientsCardHTML() {
    return `
        <div class="international-patients-card" style="background: linear-gradient(135deg, #0b1329 0%, #0d1e3a 50%, #064e3b 100%); border: 1.5px solid #38bdf8; border-radius: 14px; padding: 22px; margin-top: 22px; margin-bottom: 22px; box-shadow: 0 8px 30px rgba(0,0,0,0.55);">
            <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 14px; flex-wrap: wrap; gap: 10px;">
                <div style="display: flex; align-items: center; gap: 10px;">
                    <span style="font-size: 1.6em;">🌍</span>
                    <div>
                        <h3 style="color: #38bdf8; margin: 0; font-size: 1.18em; font-weight: 800;">خدمة المرضى والمغتربين خارج الأردن (International Patient Care)</h3>
                        <div style="color: #94a3b8; font-size: 0.82em; margin-top: 2px;">حلول سريرية متكاملة عن بُعد وتنسيق للراغبين بالقدوم للعلاج في الأردن</div>
                    </div>
                </div>
                <span style="color: #10b981; font-weight: bold; font-size: 0.82em; background: rgba(16, 185, 129, 0.15); padding: 4px 10px; border-radius: 6px; border: 1px solid #10b981;">رعاية ممتدة عبر الحدود</span>
            </div>

            <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(280px, 1fr)); gap: 14px; margin-bottom: 20px;">
                <div style="background: rgba(15, 23, 42, 0.85); border: 1.5px solid rgba(56, 189, 248, 0.35); border-radius: 12px; padding: 16px 18px; box-shadow: 0 4px 15px rgba(0,0,0,0.3);">
                    <div style="color: #38bdf8; font-weight: 800; font-size: 1.05em; margin-bottom: 6px; display: flex; align-items: center; gap: 8px;">
                        <span style="font-size: 1.25em;">📹</span> استشارة سريرية مجانية وتأهيل عن بُعد
                    </div>
                    <div style="color: #cbd5e1; font-size: 0.88em; line-height: 1.6;">
                        جلسة استشارية مرئية وتصميم خطة تمارين تأهيلية حركية موجهة بالفيديو لمتابعة حالتك أينما كنت حول العالم دون تكلفة.
                    </div>
                </div>

                <div style="background: rgba(15, 23, 42, 0.85); border: 1.5px solid rgba(212, 175, 55, 0.35); border-radius: 12px; padding: 16px 18px; box-shadow: 0 4px 15px rgba(0,0,0,0.3);">
                    <div style="color: var(--primary-gold); font-weight: 800; font-size: 1.05em; margin-bottom: 6px; display: flex; align-items: center; gap: 8px;">
                        <span style="font-size: 1.25em;">🩻</span> قراءة الرنين المغناطيسي مجاناً
                    </div>
                    <div style="color: #cbd5e1; font-size: 0.88em; line-height: 1.6;">
                        إرسال تقارير وصور الرنين المغناطيسي (MRI) عبر الواتساب لتحديد درجة فتق الديسك وانضغاط العصب بدقة ومجاناً.
                    </div>
                </div>
            </div>

            <div style="text-align: center;">
                <button type="button" onclick="contactInternationalPatientCoordinator()" style="background: linear-gradient(135deg, #0284c7 0%, #0369a1 50%, var(--primary-gold) 100%); color: #ffffff; border: 1.5px solid #7dd3fc; padding: 12px 28px; border-radius: 10px; font-weight: bold; font-size: 0.95em; cursor: pointer; display: inline-flex; align-items: center; gap: 8px; box-shadow: 0 4px 15px rgba(2, 132, 199, 0.4);">
                    <span>💬 تواصل مع المعالج للاستشارة الدولية أو قراءة الرنين</span>
                    <span>⬅️</span>
                </button>
            </div>
        </div>
    `;
}

function contactInternationalPatientCoordinator() {
    const pName = clinicalDialogueState?.patientName || activePatient?.name || 'المراجع الكريم';
    const condition = currentAssessmentData?.primaryDiagnosis || currentSelectedPoint?.title || 'استشارة دولية';
    const text = `مرحباً دكتور جمال، أنا أقيم خارج الأردن (${pName})، واطلعت على تقريري في Smart Check Pro بخصوص (${condition}). أود التنسيق معكم للاستشارة عن بُعد أو قراءة صور الرنين المغناطيسي / ترتيب زيارة علاجية للأردن.`;
    window.open(`https://wa.me/${CLINIC_WHATSAPP_NUMBER}?text=${encodeURIComponent(text)}`, '_blank');
}

// تفعيل فوري لخطة التعافي بنقرة واحدة (أو إظهار النموذج إذا كانت البيانات غير مكتملة)
async function activateRecoveryPlanInstantly() {
    const existingName = clinicalDialogueState?.patientName || activePatient?.name || document.getElementById('sub-name')?.value?.trim();
    const existingPhone = clinicalDialogueState?.patientPhone || activePatient?.phone || document.getElementById('sub-phone')?.value?.trim();

    // إذا كانت البيانات مسجلة مسبقاً في الشات السريري، تفعيل فوري بنقرة واحدة دون طلب تكرارها
    if (existingName && existingPhone && existingPhone.length >= 7) {
        const patientId = activePatient?.patientId || ('P-' + Date.now().toString().slice(-6));
        const resolvedPainTitle = resolvePainAreaTitle(null, currentAssessmentData, currentSelectedPoint);

        const patientObj = {
            patientId,
            name: existingName,
            phone: existingPhone,
            painArea: currentAssessmentData?.pointId || (currentSelectedPoint ? currentSelectedPoint.id : 'lumbar_spine'),
            painAreaTitle: resolvedPainTitle,
            createdAt: activePatient?.createdAt || new Date().toISOString()
        };

        await SmartDB.savePatient(patientObj);
        if (currentAssessmentData) {
            await SmartDB.saveAssessment({
                ...currentAssessmentData,
                patientId,
                patientName: existingName,
                patientPhone: existingPhone,
                painAreaTitle: resolvedPainTitle
            });
        }

        SmartDB.setCurrentSessionPatientId(patientId);
        activePatient = patientObj;

        SmartDB.addAdminNotification({
            type: 'new_registration',
            title: `👤 تفعيل فوري للخطة: ${existingName}`,
            message: `فعّل المراجع ${existingName} خطة التعافي الحركية (اليوم 1) بنقرة واحدة - منطقة: ${resolvedPainTitle} - هاتف: ${existingPhone}`,
            patientId,
            patientName: existingName,
            patientPhone: existingPhone,
            meta: {
                painArea: resolvedPainTitle,
                diagnosis: currentAssessmentData?.primaryDiagnosis || ''
            }
        });

        showToast(`🌿 جاري تفعيل خطتك المجانية (صدقة جارية عن روح المرحوم والد المعالج جمال قبها)... نسألكم خالص الدعاء له بالرحمة والمغفرة 🤲`, 'success');
        playStationAudio('recovery', () => {
            loadPatientRecoveryDashboard(patientId);
        });
        return;
    }

    // إذا لم تكن البيانات مكتملة، ملء ما هو متوفر وإظهار حقول الإدخال
    if (existingName) {
        const nameInput = document.getElementById('sub-name');
        if (nameInput) nameInput.value = existingName;
    }
    revealRegistrationInputs();
}

// إظهار حقول تسجيل خطة التعافي
function revealRegistrationInputs() {
    const inputsBox = document.getElementById('plan-registration-inputs');
    const btnWrapper = document.getElementById('plan-activation-btn-wrapper');
    if (inputsBox) {
        inputsBox.style.display = 'block';
        if (btnWrapper) btnWrapper.style.display = 'none';
        inputsBox.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }
}

// تحديث كود مفتاح الدولة
function updatePhoneCodePrefix() {
    const code = document.getElementById('sub-country')?.value || '+962';
    const prefixEl = document.getElementById('phone-prefix-display');
    if (prefixEl) prefixEl.textContent = code;
}

// تسجيل المريض وبدء خطة التعافي
async function submitPatientRegistrationAndStart() {
    const name = document.getElementById('sub-name')?.value.trim();
    const phone = document.getElementById('sub-phone')?.value.trim();
    const countryCode = document.getElementById('sub-country')?.value || '+962';

    if (!name) {
        showToast('يرجى إدخال اسمك الكريم لتفعيل الخطة', 'error');
        return;
    }
    if (!phone || phone.length < 6) {
        showToast('يرجى إدخال رقم هاتف صحيح', 'error');
        return;
    }

    const fullPhone = countryCode + phone;
    const patientId = 'P-' + Date.now().toString().slice(-6);
    const resolvedPainTitle = resolvePainAreaTitle(null, currentAssessmentData, currentSelectedPoint);

    const patientObj = {
        patientId,
        name,
        phone: fullPhone,
        painArea: currentAssessmentData?.pointId || (currentSelectedPoint ? currentSelectedPoint.id : 'lumbar_spine'),
        painAreaTitle: resolvedPainTitle,
        createdAt: new Date().toISOString()
    };

    await SmartDB.savePatient(patientObj);
    if (currentAssessmentData) {
        await SmartDB.saveAssessment({
            ...currentAssessmentData,
            patientId,
            patientName: name,
            patientPhone: fullPhone,
            painAreaTitle: resolvedPainTitle
        });
    }

    SmartDB.setCurrentSessionPatientId(patientId);
    activePatient = patientObj;

    // تسجيل إشعار فوري حي للإدارة
    SmartDB.addAdminNotification({
        type: 'new_registration',
        title: `👤 مشترك جديد: ${name}`,
        message: `سجل المريض ${name} بنجاح في خطة الراحة الحركية (اليوم 1) - منطقة: ${resolvedPainTitle} - هاتف: ${fullPhone}`,
        patientId,
        patientName: name,
        patientPhone: fullPhone,
        meta: {
            painArea: resolvedPainTitle,
            diagnosis: currentAssessmentData?.primaryDiagnosis || ''
        }
    });

    showToast('🎉 تم تفعيل خطة التعافي بنجاح (اليوم 1 من 7)!', 'success');
    loadPatientRecoveryDashboard(patientId);
}

// // توليد بطاقة البيانات الحيوية والملف البيوميكانيكي للمراجع (البيانات)
function getVitalsSummaryCardHTML(patient, assessment) {
    const pName = patient?.name || 'المراجع الكريم';
    const vitals = assessment?.patientVitals || (typeof clinicalDialogueState !== 'undefined' ? clinicalDialogueState?.patientVitals : {}) || {};
    const age = vitals.age || patient?.age || assessment?.age || null;
    const gender = vitals.gender || patient?.gender || null;
    const weight = vitals.weight || patient?.weight || null;
    const height = vitals.height || patient?.height || null;
    const painAreaTitle = assessment?.painAreaTitle || (typeof currentSelectedPoint !== 'undefined' && currentSelectedPoint ? currentSelectedPoint.title : (patient?.painAreaTitle || 'الموضع المحدد'));

    let bmiHTML = '';
    if (weight && height && height > 0) {
        const hM = height / 100;
        const bmi = parseFloat((weight / (hM * hM)).toFixed(1));
        const minHealthyW = parseFloat((18.5 * hM * hM).toFixed(1));
        const maxHealthyW = parseFloat((24.9 * hM * hM).toFixed(1));

        let status = 'وزن طبيعي متوازن';
        let color = '#10b981';
        let deltaText = `✅ وزنك مثالي (المدى الصحي لطولك: ${minHealthyW} - ${maxHealthyW} كجم)`;
        let impact = 'ثبات ميكانيكي ممتاز ولا توجد حمولة ضغط إضافية على الغضاريف والمفاصل.';

        if (bmi < 18.5) {
            const deficitKg = parseFloat((minHealthyW - weight).toFixed(1));
            status = 'نحافة / نقص كتلة';
            color = '#38bdf8';
            deltaText = `⚠️ نقص في الوزن بمقدار -${deficitKg} كجم عن الحد الأدنى للوزن الصحي (${minHealthyW} كجم)`;
            impact = 'نقص الكتلة العضلية يقلل من الثبات الميكانيكي للمفاصل ويجعل الفقرات عرضة للإجهاد السريع.';
        } else if (bmi >= 25 && bmi < 30) {
            const excessKg = parseFloat((weight - maxHealthyW).toFixed(1));
            const addedLoad = parseFloat((excessKg * 4).toFixed(1));
            status = 'زيادة وزن';
            color = '#f59e0b';
            deltaText = `⚠️ وزن زائد بمقدار +${excessKg} كجم عن الحد الصحي`;
            impact = `يضيف حوالي +${addedLoad} كجم حمولة ضغط ميكانيكية إضافية على المفاصل وأسفل الظهر أثناء الحركة.`;
        } else if (bmi >= 30) {
            const excessKg = parseFloat((weight - maxHealthyW).toFixed(1));
            const addedLoad = parseFloat((excessKg * 4).toFixed(1));
            status = 'سمنة مفرطة';
            color = '#ef4444';
            deltaText = `🚨 وزن زائد حرج بمقدار +${excessKg} كجم`;
            impact = `يضاعف الضغط الانضغاطي على الديسك ويشكل حمولة +${addedLoad} كجم على المفاصل.`;
        }

        bmiHTML = `
            <div style="background: rgba(15, 23, 42, 0.85); border: 1.5px solid ${color}; border-radius: 10px; padding: 14px; margin-top: 10px;">
                <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 6px; flex-wrap: wrap; gap: 6px;">
                    <div style="color: #ffffff; font-weight: bold; font-size: 0.92em;">⚖️ مؤشر كتلة الجسم (BMI):</div>
                    <span style="background: ${color}22; border: 1px solid ${color}; color: ${color}; font-weight: bold; font-size: 0.88em; padding: 2px 8px; border-radius: 6px;">
                        ${bmi} kg/m² (${status})
                    </span>
                </div>
                <div style="color: ${color}; font-weight: bold; font-size: 0.82em; margin-bottom: 4px;">${deltaText}</div>
                <div style="color: #cbd5e1; font-size: 0.82em; line-height: 1.5;">💡 <strong>الأثر السريري:</strong> ${impact}</div>
            </div>
        `;
    }

    return `
        <div style="background: linear-gradient(135deg, rgba(15, 23, 42, 0.95) 0%, rgba(30, 41, 59, 0.9) 100%); border: 1.5px solid var(--primary-gold); border-radius: 14px; padding: 20px 22px; margin-bottom: 22px; box-shadow: 0 4px 20px rgba(0,0,0,0.35);">
            <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 14px; border-bottom: 1px solid rgba(212, 175, 55, 0.25); padding-bottom: 10px; flex-wrap: wrap; gap: 8px;">
                <div style="color: var(--primary-gold); font-weight: bold; font-size: 1.05em; display: flex; align-items: center; gap: 8px;">
                    <span>📋</span> بيانات المراجع والملف البيوميكانيكي الأساسي
                </div>
                <span style="background: rgba(16, 185, 129, 0.15); border: 1px solid #10b981; color: #6ee7b7; font-size: 0.8em; padding: 3px 10px; border-radius: 20px; font-weight: bold;">
                    الجلسة الأولى • انطلاقة البرنامج
                </span>
            </div>

            <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(180px, 1fr)); gap: 12px; margin-bottom: 12px;">
                <div style="background: #0f172a; padding: 10px 14px; border-radius: 8px; border: 1px solid #1e293b;">
                    <div style="color: #94a3b8; font-size: 0.78em;">اسم المراجع:</div>
                    <div style="color: #ffffff; font-weight: bold; font-size: 0.95em; margin-top: 2px;">${pName}</div>
                </div>
                <div style="background: #0f172a; padding: 10px 14px; border-radius: 8px; border: 1px solid #1e293b;">
                    <div style="color: #94a3b8; font-size: 0.78em;">العمر والجنس:</div>
                    <div style="color: #ffffff; font-weight: bold; font-size: 0.95em; margin-top: 2px;">${age ? `${age} سنة` : 'غير محدد'} ${gender ? `• ${gender === 'female' ? 'أنثى' : 'ذكر'}` : ''}</div>
                </div>
                <div style="background: #0f172a; padding: 10px 14px; border-radius: 8px; border: 1px solid #1e293b;">
                    <div style="color: #94a3b8; font-size: 0.78em;">الوزن والطول:</div>
                    <div style="color: #ffffff; font-weight: bold; font-size: 0.95em; margin-top: 2px;">${weight ? `${weight} كجم` : '--'} • ${height ? `${height} سم` : '--'}</div>
                </div>
                <div style="background: #0f172a; padding: 10px 14px; border-radius: 8px; border: 1px solid #1e293b;">
                    <div style="color: #94a3b8; font-size: 0.78em;">موضع الشكوى:</div>
                    <div style="color: #38bdf8; font-weight: bold; font-size: 0.92em; margin-top: 2px;">${painAreaTitle}</div>
                </div>
            </div>

            ${bmiHTML}
        </div>
    `;
}

// =========================================================================
// الخطوة 4: الجلسة الأولى (مستقلة تماماً)
// تشمل: التعليمات + البيانات + الساعة الحية + التمارين + زر إنجاز اليوم الأول
// خالية تماماً وبشكل قاطع من أي أسئلة أو مؤشرات مئوية أو رسوم بيانية
// =========================================================================
async function renderStep4IndependentDay1(patientId, sessionData = null) {
    if (!sessionData) {
        sessionData = await PatientFlow.initPatientSession(patientId);
    }
    if (!sessionData || !sessionData.patient) {
        resetToInitialState();
        return;
    }

    activePatient = sessionData.patient;
    goToStep(4);

    const container = document.getElementById('step4-day1-container') || document.getElementById('patient-recovery-dashboard');
    if (!container) return;

    const pointKey = sessionData.latestAssessment?.pointId || sessionData.latestAssessment?.pointKey || sessionData.patient.painArea || sessionData.patient.painPointId || 'lumbar_spine';
    const dayExercises = getExercisesForPoint(pointKey, 1, {
        primaryDiagnosisKey: sessionData.latestAssessment?.primaryDiagnosisKey || "",
        answers: sessionData.latestAssessment?.answers || {},
        userNotes: sessionData.latestAssessment?.userNotes || ""
    });

    container.innerHTML = `
        <div style="background: #111827; border: 1px solid var(--primary-gold); border-radius: 16px; padding: 30px; margin-bottom: 25px; box-shadow: 0 8px 32px rgba(0,0,0,0.5);">
            
            <!-- إهداء الصدقة الجارية -->
            <div style="background: rgba(16, 185, 129, 0.08); border: 1px solid rgba(16, 185, 129, 0.3); border-radius: 8px; padding: 9px 14px; margin-bottom: 16px; text-align: center; color: #6ee7b7; font-size: 0.88em;">
                🌿 هذا البرنامج العلاجي والمنزلي متاح مجاناً كصدقة جارية عن روح المرحوم والد المعالج جمال قبها مطور هذه الأداة - نسألكم له صالح الدعاء بالرحمة والمغفرة وعلو الدرجات في الجنة.
            </div>

            <!-- بنر علوي للاستشارة المباشرة مع المعالج -->
            <div style="background: linear-gradient(135deg, rgba(212, 175, 55, 0.15) 0%, rgba(15, 23, 42, 0.9) 100%); border: 1px solid var(--primary-gold); border-radius: 10px; padding: 12px 18px; margin-bottom: 20px; display: flex; justify-content: space-between; align-items: center; flex-wrap: wrap; gap: 10px;">
                <div style="color: #fef08a; font-size: 0.9em; display: flex; align-items: center; gap: 8px;">
                    <span>👨‍⚕️</span> <strong>استشارة المعالج:</strong> تشعر بألم حاد أو ترغب بتسريع الشفاء عبر جلسة تقويم يدوي مباشرة؟
                </div>
                <a href="${CLINIC_WHATSAPP}" target="_blank" style="background: #25d366; color: #fff; text-decoration: none; padding: 6px 14px; border-radius: 6px; font-size: 0.85em; font-weight: bold; display: inline-flex; align-items: center; gap: 6px;">
                    💬 محادثة المعالج واتساب
                </a>
            </div>

            <!-- بنر التذكير اليومي الذكي للجلسات -->
            ${getNotificationReminderBannerHTML(patientId)}

            <div style="display: flex; justify-content: space-between; align-items: center; border-bottom: 1px solid rgba(212, 175, 55, 0.2); padding-bottom: 15px; margin-bottom: 20px; flex-wrap: wrap; gap: 15px;">
                <div style="display: flex; align-items: center; gap: 15px;">
                    <img src="assets/logo.png" alt="شعار وداعاً للألم" style="height: 55px; width: 55px; border-radius: 50%; border: 1.5px solid var(--primary-gold);">
                    <div>
                        <h2 style="color: #ffffff; margin: 0 0 4px 0; font-size: 1.35em;">مرحباً ${sessionData.patient.name} 👋</h2>
                        <div style="color: var(--primary-gold); font-size: 0.9em;">خطة الراحة الحركية الذاتية - الجلسة الأولى (مستقلة) - منطقة ${sessionData.latestAssessment?.painAreaTitle || 'المفصل المختار'}</div>
                    </div>
                </div>
                <div class="session-top-badges" style="display: grid; grid-template-columns: 1fr 1fr; gap: 8px; width: 100%; max-width: 320px; box-sizing: border-box;">
                    <button type="button" onclick="exportClinicalSummaryForDoctor('${patientId}')" class="btn-header no-print" style="padding: 7px 8px; font-size: 0.8em; background: #0f172a; border: 1.5px solid #38bdf8; color: #38bdf8; border-radius: 8px; font-weight: bold; cursor: pointer; display: flex; align-items: center; justify-content: center; gap: 4px; white-space: nowrap; width: 100%; box-sizing: border-box;">
                        <span>📋</span> ملخص المعالج
                    </button>
                    <div style="background: #0f172a; border: 1px solid #10b981; padding: 7px 8px; border-radius: 8px; color: #10b981; font-weight: bold; font-size: 0.78em; text-align: center; display: flex; align-items: center; justify-content: center; width: 100%; box-sizing: border-box; overflow: hidden;">
                        <span>✓ الجلسة الأولى</span>
                    </div>
                </div>
            </div>

            <!-- عبارة تشجيعية ديناميكية مع تحفيز د. سارة -->
            <div style="background: rgba(16, 185, 129, 0.1); border: 1.5px solid #10b981; border-radius: 12px; padding: 12px 16px; margin-bottom: 20px; color: #6ee7b7; font-weight: 500; font-size: 0.92em; display: flex; justify-content: space-between; align-items: center; flex-wrap: wrap; gap: 10px;">
                <div style="flex: 1 1 220px; line-height: 1.6;">${sessionData.motivation || '🌟 أهلاً بك في انطلاقة برنامجك التأهيلي! جلسة اليوم مخصصة لتفريغ الضغط الميكانيكي وتهيئة المفاصل بأمان تام.'}</div>
                <button type="button" onclick="playStationAudio('motivation')" class="btn-header btn-header-emerald" style="padding: 7px 14px; font-size: 0.8em; border-radius: 20px; cursor: pointer; display: inline-flex; align-items: center; gap: 5px; flex-shrink: 0; font-weight: bold; white-space: nowrap;">
                    <span>🎙️</span> تحفيز د. سارة
                </button>
            </div>

            <!-- 1. التعليمات: بطاقة بروتوكول وتوصيات المعالج السريري لجلسة اليوم الأول (إرشادات البدء الآمن) -->
            <div style="background: linear-gradient(135deg, rgba(212, 175, 55, 0.12) 0%, rgba(15, 23, 42, 0.95) 100%); border: 1.5px solid var(--primary-gold); border-radius: 14px; padding: 20px 22px; margin-bottom: 24px; box-shadow: 0 4px 20px rgba(0,0,0,0.4);">
                <div style="display: flex; align-items: center; gap: 10px; margin-bottom: 12px;">
                    <span style="font-size: 1.6em;">🩺</span>
                    <h3 style="color: var(--primary-gold); margin: 0; font-size: 1.15em; font-weight: bold;">
                        بروتوكول المعالج السريري لجلسة اليوم الأول (إرشادات البدء الآمن)
                    </h3>
                </div>
                <div style="color: #cbd5e1; font-size: 0.9em; line-height: 1.8; margin-bottom: 15px;">
                    أهلاً بك في بداية برنامجك التأهيلي! الهدف من جلسة اليوم هو <strong>تفريغ الضغط الميكانيكي الأولي</strong> عن مفصل (${sessionData.latestAssessment?.painAreaTitle || 'المنطقة المحددة'}) والأنسجة المحيطة، وتنشيط تدفق السائل الزلالي بلطف وأمان تام دون أي إجهاد.
                </div>
                <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(240px, 1fr)); gap: 12px;">
                    <div style="background: #0f172a; border: 1px solid rgba(16, 185, 129, 0.35); border-radius: 10px; padding: 12px 14px;">
                        <div style="color: #10b981; font-weight: bold; font-size: 0.9em; margin-bottom: 4px;">🫁 1. التنفس المنتظم والهدوء:</div>
                        <div style="color: #94a3b8; font-size: 0.83em; line-height: 1.6;">تنفس بعمق وزفير هادئ مع كل حركة. لا تكتم نَفَسَك أثناء الشد أو الاستطالة.</div>
                    </div>
                    <div style="background: #0f172a; border: 1px solid rgba(56, 189, 248, 0.35); border-radius: 10px; padding: 12px 14px;">
                        <div style="color: #38bdf8; font-weight: bold; font-size: 0.9em; margin-bottom: 4px;">🎯 2. التدرج وتجنب القوة:</div>
                        <div style="color: #94a3b8; font-size: 0.83em; line-height: 1.6;">ابدأ الحركة بنصف المدى وزده تدريجياً. الهدف هو تليين الأنسجة وتفريغ الحمل وليس التحدي العضلي.</div>
                    </div>
                    <div style="background: #0f172a; border: 1px solid rgba(239, 68, 68, 0.35); border-radius: 10px; padding: 12px 14px;">
                        <div style="color: #ef4444; font-weight: bold; font-size: 0.9em; margin-bottom: 4px;">🛑 3. ضابط الأمان السريري:</div>
                        <div style="color: #fca5a5; font-size: 0.83em; line-height: 1.6;">الشعور بشد خفيف طبيعي ومطلوب، ولكن توقف فوراً إذا شعرت بوخز حاد أو ألم كهربائي مفاجئ.</div>
                    </div>
                    <div style="background: #0f172a; border: 1px solid rgba(212, 175, 55, 0.35); border-radius: 10px; padding: 12px 14px;">
                        <div style="color: var(--primary-gold); font-weight: bold; font-size: 0.9em; margin-bottom: 4px;">💧 4. ما بعد التمارين:</div>
                        <div style="color: #94a3b8; font-size: 0.83em; line-height: 1.6;">اشرب كوب ماء دافئ، ويمكن وضع كمادة دافئة لمدة 10 دقائق بعد الانتهاء لاسترخاء الأنسجة وتسكين التوتر.</div>
                    </div>
                </div>
            </div>

            <!-- 2. البيانات: بطاقة بيانات المراجع الحيوية والميكانيكية -->
            ${getVitalsSummaryCardHTML(sessionData.patient, sessionData.latestAssessment)}

            <!-- 3. الساعة الرقمية الحية لجلسة اليوم الأول -->
            <div id="live-session-clock-card" style="background: linear-gradient(135deg, rgba(15, 23, 42, 0.95) 0%, rgba(30, 41, 59, 0.8) 100%); border: 1.5px solid var(--primary-gold); border-radius: 14px; padding: 16px 20px; margin-bottom: 24px; display: flex; justify-content: space-between; align-items: center; flex-wrap: wrap; gap: 14px; box-shadow: 0 4px 20px rgba(0,0,0,0.35);">
                <div style="display: flex; align-items: center; gap: 12px;">
                    <div style="background: rgba(212, 175, 55, 0.15); border: 1px solid var(--primary-gold); width: 48px; height: 48px; border-radius: 12px; display: flex; align-items: center; justify-content: center; font-size: 1.5em;">
                        ⏱️
                    </div>
                    <div>
                        <div style="color: var(--primary-gold); font-size: 0.88em; font-weight: bold; letter-spacing: 0.5px;">توقيت الجلسة الحركية المباشرة (اليوم الأول):</div>
                        <div id="live-session-date-display" style="color: #94a3b8; font-size: 0.84em; margin-top: 2px;">--</div>
                    </div>
                </div>
                <div style="display: flex; align-items: center; gap: 10px; background: rgba(0, 0, 0, 0.5); border: 1.5px solid #10b981; padding: 8px 18px; border-radius: 10px;">
                    <span style="color: #10b981; font-size: 0.95em; animation: pulse 1.5s infinite;">🟢 جلسة نشطة الآن:</span>
                    <div id="live-session-time-display" style="color: #6ee7b7; font-size: 1.45em; font-weight: 900; letter-spacing: 1px; font-family: monospace;" dir="ltr">--:--:--</div>
                </div>
            </div>

            <!-- 4. التمارين: عرض تمارين اليوم الأول المقررة في الصدارة مباشرة -->
            <div style="margin-bottom: 25px;">
                <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 15px; flex-wrap: wrap; gap: 8px;">
                    <h3 style="color: var(--primary-gold); margin: 0; font-size: 1.3em;">🏋️ تمارين الراحة المقررة لليوم الأول (1 من 7) - ${sessionData.stageTitle}</h3>
                    <span style="background: rgba(16, 185, 129, 0.15); border: 1px solid #10b981; color: #6ee7b7; padding: 4px 10px; border-radius: 20px; font-size: 0.8em; font-weight: bold;">⚡ ابدأ بالتمارين أدناه</span>
                </div>
                <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(320px, 1fr)); gap: 18px;">
                    ${dayExercises.map((ex, idx) => `
                        <div class="clinical-exercise-card" style="background: #0f172a; border: 1px solid rgba(212, 175, 55, 0.3); border-radius: 14px; padding: 20px; display: flex; flex-direction: column; justify-content: space-between;">
                            <div>
                                ${generateExerciseIllustration(ex.visualType, ex.id, { name: ex.name })}
                                <div style="display: flex; justify-content: space-between; align-items: center; margin: 10px 0 6px 0;">
                                    <span style="color: var(--primary-gold); font-size: 0.78em; font-weight: bold;">تمرين #${idx+1} (اليوم 1)</span>
                                    <span style="color: #10b981; font-size: 0.78em;">⏱️ ${ex.duration}</span>
                                </div>
                                <h4 style="color: #ffffff; margin: 0 0 6px 0; font-size: 1.15em;">${ex.name}</h4>
                                <p style="color: #cbd5e1; font-size: 0.86em; margin: 0 0 12px 0;">${ex.description}</p>
                                
                                <div style="background: #111827; padding: 12px; border-radius: 8px; margin-bottom: 12px; font-size: 0.85em; color: #e2e8f0; line-height: 1.7; border-right: 3px solid var(--primary-gold);">
                                    <strong>طريقة الأداء:</strong><br>${ex.instructions}
                                </div>

                                <div style="display: flex; gap: 8px; flex-wrap: wrap; margin-bottom: 12px;">
                                    <span style="background: #1e293b; color: #d4af37; font-size: 0.8em; padding: 3px 8px; border-radius: 4px; font-weight: bold;">🔁 ${ex.reps}</span>
                                    <span style="background: #1e293b; color: #f59e0b; font-size: 0.8em; padding: 3px 8px; border-radius: 4px; font-weight: bold;">📦 ${ex.sets}</span>
                                </div>

                                <!-- دليل التكنيك السليم والأخطاء الشائعة -->
                                ${typeof getExerciseFormGuideHTML === 'function' ? getExerciseFormGuideHTML(ex) : ''}
                            </div>
                            <div>
                                <div style="background: #1e2633; height: 5px; border-radius: 3px; overflow: hidden; margin-bottom: 8px;">
                                    <div class="timer-progress-fill" style="background: linear-gradient(90deg, #d4af37 0%, #10b981 100%); height: 100%; width: 0%; transition: width 1s linear;"></div>
                                </div>
                                <button type="button" onclick="PatientFlow.toggleExerciseTimer(this, ${ex.durationSec || 30})" class="btn-exercise-timer" data-running="false" data-remaining="${ex.durationSec || 30}" data-total="${ex.durationSec || 30}" style="width: 100%; background: linear-gradient(135deg, #d4af37 0%, #aa820a 100%); color: #0a0e14; border: none; padding: 10px 14px; border-radius: 6px; font-weight: bold; cursor: pointer; font-size: 0.92em;">
                                    ⏱️ ابدأ مؤقت التمرين (${ex.duration})
                                </button>
                            </div>
                        </div>
                    `).join('')}
                </div>
            </div>

            <!-- 5. زر توثيق إنجاز تمارين اليوم الأول وبدء فترة الاستشفاء (24 ساعة) والانتقال للخطوة 5 -->
            <div style="background: linear-gradient(135deg, rgba(16, 185, 129, 0.15) 0%, rgba(15, 23, 42, 0.95) 100%); border: 2px solid #10b981; border-radius: 14px; padding: 24px; text-align: center; margin: 25px 0; box-shadow: 0 8px 30px rgba(16, 185, 129, 0.25);">
                <div style="color: #6ee7b7; font-size: 1.15em; font-weight: bold; margin-bottom: 8px;">🎯 خطوتك التالية بعد إتمام التمارين أعلاه:</div>
                <div style="color: #cbd5e1; font-size: 0.9em; margin-bottom: 20px; line-height: 1.7; max-width: 600px; margin-left: auto; margin-right: auto;">
                    بعد انتهائك من أداء تمارين اليوم الأول، انقر على الزر أدناه لتوثيق إنجاز الجلسة الأولى وبدء فترة الاستشفاء الحيوي للأنسجة (24 ساعة). ستنتقل بعدها مباشرة لمتابعة باقي الجلسات (2 إلى 7) مع التقييم اليومي المعتمد.
                </div>
                <button type="button" onclick="completeDay1InitialExercises('${patientId}')" class="btn-plan-royal-card" style="margin: 0 auto; max-width: 620px; width: 100%;">
                    <div class="royal-card-halo"></div>
                    <div class="royal-card-shimmer"></div>
                    <div class="royal-badge-pill">
                        <span class="royal-badge-dot"></span>
                        <span>✨ توثيق إنجاز الجلسة الأولى</span>
                    </div>
                    <div class="royal-main-content">
                        <div class="royal-icon-box">
                            <span class="royal-icon-emoji">✅</span>
                        </div>
                        <div class="royal-text-col">
                            <div class="royal-cta-headline">✅ أتممت أداء تمارين اليوم الأول بنجاح</div>
                            <div class="royal-cta-subline">بدء فترة الاستشفاء الحيوي للأنسجة (24 ساعة) ⏳</div>
                        </div>
                        <div class="royal-arrow-box">
                            <span class="royal-arrow-anim">⬅️</span>
                        </div>
                    </div>
                </button>
            </div>

            <!-- خدمة الزيارات المنزلية واستشارة المعالج -->
            <div class="no-print">
                ${getHomeVisitCardHTML()}
            </div>
        </div>
    `;

    // تنشيط الساعة الحية لليوم الأول
    if (window.liveSessionClockInterval) {
        clearInterval(window.liveSessionClockInterval);
        window.liveSessionClockInterval = null;
    }
    const updateLiveClock = () => {
        const timeEl = document.getElementById('live-session-time-display');
        const dateEl = document.getElementById('live-session-date-display');
        if (!timeEl) {
            if (window.liveSessionClockInterval) {
                clearInterval(window.liveSessionClockInterval);
                window.liveSessionClockInterval = null;
            }
            return;
        }
        const now = new Date();
        timeEl.textContent = now.toLocaleTimeString('ar-JO', { hour: '2-digit', minute: '2-digit', second: '2-digit', hour12: true });
        if (dateEl) {
            dateEl.textContent = now.toLocaleDateString('ar-JO', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' });
        }
    };
    updateLiveClock();
    window.liveSessionClockInterval = setInterval(updateLiveClock, 1000);
}

// =========================================================================
// الخطوة 5: التمارين ومتابعة الجلسات (2 إلى 7)
// تشمل:
// 1. أزرار التنقل بين الجلسات من 2 إلى 7
// 2. ساعة التوقيت الـ 24 ساعة المعتمدة (في كل الجلسات 2-7)
// 3. مؤشرات التحسن الثلاثة (% الألم، % المدى الحركي، % جودة النوم)
// 4. الرسم البياني: الجلسة 2 بدون رسم بياني، وباقي الجلسات 3-7 بالإضافة للرسم البياني
// 5. أسئلة التقييم السريري (متاحة دائماً في كل جلسة من 2 إلى 7)
// 6. تمارين الجلسة المقررة مع المؤقتات ودليل التكنيك
// =========================================================================
async function renderStep5SessionsDashboard(patientId, targetDay = null, sessionData = null) {
    if (window.liveSessionClockInterval) {
        clearInterval(window.liveSessionClockInterval);
        window.liveSessionClockInterval = null;
    }

    if (!sessionData) {
        sessionData = await PatientFlow.initPatientSession(patientId);
    }
    if (!sessionData || !sessionData.patient) {
        resetToInitialState();
        return;
    }

    activePatient = sessionData.patient;
    const lockStatus = await PatientFlow.getSessionLockStatus(patientId);

    // إذا كان المريض أنجز كل الـ 7 جلسات، الانتقال لشاشة الإنهاء
    if (sessionData.isPlanCompleted) {
        renderStep6Completion(patientId, sessionData);
        return;
    }

    goToStep(5);

    const container = document.getElementById('step5-sessions-container');
    if (!container) return;

    // تحديد اليوم المعروض حالياً: بين 2 و 7 (الافتراضي هو اليوم الحالي لمسار المريض)
    const activeDay = Math.max(2, Math.min(7, targetDay || sessionData.currentSessionDay || 2));

    const pointKey = sessionData.latestAssessment?.pointId || sessionData.latestAssessment?.pointKey || sessionData.patient.painArea || sessionData.patient.painPointId || 'lumbar_spine';
    const dayExercises = getExercisesForPoint(pointKey, activeDay, {
        primaryDiagnosisKey: sessionData.latestAssessment?.primaryDiagnosisKey || "",
        answers: sessionData.latestAssessment?.answers || {},
        userNotes: sessionData.latestAssessment?.userNotes || ""
    });

    const anatomicalConfig = typeof getAnatomicalDailyAssessmentConfig === 'function' ? getAnatomicalDailyAssessmentConfig(pointKey) : null;

    // بطاقة التحليل السلوكي المستمر بناءً على آخر تسجيل
    const lastDailyLog = sessionData.dailyLogs.length > 0 ? sessionData.dailyLogs[sessionData.dailyLogs.length - 1] : null;
    let behavioralReportHTML = '';
    if (lastDailyLog) {
        const posHabits = [];
        if (lastDailyLog.exercisesDone) posHabits.push("✓ أداء التمارين: تنشيط تدفق السائل الزلالي وحماية الغضروف من التصلب.");
        if (lastDailyLog.goodPosture) posHabits.push("✓ استقامة الوضعية: تخفيف 60% من الحمل الانضغاطي على الفقرات.");
        if (lastDailyLog.walkingDone) posHabits.push("✓ المشي والتنشيط: تنشيط التروية الدموية وتغذية الأنسجة العميقة.");
        if (lastDailyLog.heatDone) posHabits.push("✓ الكمادات والراحة: تفكيك التشنج العضلي وتسكين نقاط الإجهاد.");

        const negHabits = [];
        const neg = lastDailyLog.negativeHabits || {};
        if (neg.longSitting) negHabits.push("⚠️ الجلوس المتواصل: يضاعف الضغط الهيدروليكي على ديسك أسفل الظهر.");
        if (neg.heavyLifting) negHabits.push("⚠️ انحناء خاطئ أو حمل وزن: يسبب إجهاداً حاداً للأربطة الشوكية.");
        if (neg.phoneUsage) negHabits.push("⚠️ إمالة الرقبة للشاشات: يضيف حمولة زائدة على الفقرات العنقية.");
        if (neg.poorSleep) negHabits.push("⚠️ نوم غير مريح: يمنع عضلات العمود الفقري من الاسترخاء وتجديد الخلايا.");

        behavioralReportHTML = `
            <div style="background: #0f172a; border: 1.5px solid var(--primary-gold); border-radius: 14px; padding: 20px; margin-bottom: 22px;">
                <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 12px; flex-wrap: wrap; gap: 8px;">
                    <div style="color: var(--primary-gold); font-weight: bold; font-size: 1.05em;">🧬 تقرير السلوك الحركي والميكانيكا الحيوية (الجلسة السابقة #${lastDailyLog.sessionNumber}):</div>
                    <span style="color: #94a3b8; font-size: 0.8em;">مسجل بتاريخ: ${new Date(lastDailyLog.date).toLocaleDateString('ar-EG')}</span>
                </div>

                <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(280px, 1fr)); gap: 14px; margin-bottom: 12px;">
                    <div style="background: rgba(16, 185, 129, 0.08); border: 1px solid rgba(16, 185, 129, 0.3); border-radius: 10px; padding: 14px;">
                        <div style="color: #10b981; font-weight: bold; font-size: 0.9em; margin-bottom: 8px;">✨ الإنجازات الإيجابية وأثرها البيوميكانيكي:</div>
                        <ul style="color: #6ee7b7; margin: 0; padding-right: 18px; line-height: 1.7; font-size: 0.85em;">
                            ${posHabits.length > 0 ? posHabits.map(h => `<li>${h}</li>`).join('') : '<li>لم يتم تسجيل سلوكيات إيجابية في الجلسة السابقة.</li>'}
                        </ul>
                    </div>

                    <div style="background: rgba(239, 68, 68, 0.08); border: 1px solid rgba(239, 68, 68, 0.3); border-radius: 10px; padding: 14px;">
                        <div style="color: #ef4444; font-weight: bold; font-size: 0.9em; margin-bottom: 8px;">⚠️ السلوكيات السلبية وأثرها على المفاصل:</div>
                        <ul style="color: #fca5a5; margin: 0; padding-right: 18px; line-height: 1.7; font-size: 0.85em;">
                            ${negHabits.length > 0 ? negHabits.map(h => `<li>${h}</li>`).join('') : '<li style="color: #10b981;">ممتاز! لم يتم رصد أي سلوكيات مجهدة للمفاصل.</li>'}
                        </ul>
                    </div>
                </div>

                <div style="background: #111827; padding: 10px 14px; border-radius: 8px; border-right: 3px solid var(--primary-gold); font-size: 0.85em; color: #fef08a;">
                    💡 <strong>توجيه لجلسة اليوم:</strong> ${negHabits.length > 0 ? 'ركز اليوم على تجنب السلوكيات المذكورة أعلاه أثناء أداء التمارين لضمان استمرار تسكين الألم.' : 'واصل بهذا الانضباط، التزامك بالوضعية الصحيحة يسرع وصولك للراحة التامة.'}
                </div>
            </div>
        `;
    }

    // توليد أزرار الجلسات 2 إلى 7
    const sessionTabsHTML = `
        <div style="background: #0f172a; border: 1px solid rgba(212, 175, 55, 0.3); border-radius: 12px; padding: 12px 16px; margin-bottom: 22px;">
            <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 10px; flex-wrap: wrap; gap: 8px;">
                <div style="color: var(--primary-gold); font-weight: bold; font-size: 0.95em;">📅 جدول جلسات المتابعة (الأيام 2 إلى 7):</div>
                <span style="color: #94a3b8; font-size: 0.78em;">اضغط على أي جلسة لاستعراض تمارينها وتقييمها</span>
            </div>
            <div style="display: grid; grid-template-columns: repeat(6, 1fr); gap: 8px; overflow-x: auto;">
                ${[2, 3, 4, 5, 6, 7].map(d => {
                    const isCurrentActive = (d === activeDay);
                    const isCompleted = (d < sessionData.currentSessionDay);
                    let bg = '#1e293b';
                    let border = '1px solid #334155';
                    let color = '#cbd5e1';
                    if (isCurrentActive) {
                        bg = 'linear-gradient(135deg, rgba(212, 175, 55, 0.35) 0%, rgba(180, 130, 20, 0.25) 100%)';
                        border = '2px solid var(--primary-gold)';
                        color = '#ffffff';
                    } else if (isCompleted) {
                        bg = 'rgba(16, 185, 129, 0.15)';
                        border = '1px solid #10b981';
                        color = '#6ee7b7';
                    }
                    return `
                        <button type="button" onclick="renderStep5SessionsDashboard('${patientId}', ${d})" style="background: ${bg}; border: ${border}; color: ${color}; padding: 10px 6px; border-radius: 8px; font-weight: bold; font-size: 0.82em; cursor: pointer; display: flex; flex-direction: column; align-items: center; justify-content: center; gap: 4px; transition: 0.2s; min-width: 65px;">
                            <span>الجلسة ${d}</span>
                            <span style="font-size: 0.75em; opacity: 0.85;">${isCompleted ? '✓ منجزة' : isCurrentActive ? '🟢 الحالية' : '⏳ قادمة'}</span>
                        </button>
                    `;
                }).join('')}
            </div>
        </div>
    `;

    // ساعة التوقيت الـ 24 ساعة المعتمدة (في كل الجلسات 2-7)
    const clock24HTML = `
        <div style="background: linear-gradient(135deg, #0b101b 0%, #172033 100%); border: 1.5px solid var(--primary-gold); border-radius: 14px; padding: 20px 24px; text-align: center; margin-bottom: 24px; box-shadow: 0 4px 20px rgba(0,0,0,0.4);">
            <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 12px; flex-wrap: wrap; gap: 10px;">
                <div style="color: var(--primary-gold); font-size: 1.05em; font-weight: bold; display: flex; align-items: center; gap: 8px;">
                    <span>⏱️</span> ساعة التوقيت المعتمدة (الفاصل البيولوجي 24 ساعة بين الجلسات)
                </div>
                <span style="background: rgba(212, 175, 55, 0.15); border: 1px solid var(--primary-gold); color: #fef08a; padding: 3px 10px; border-radius: 20px; font-size: 0.78em; font-weight: bold;">
                    الجلسة ${activeDay} من 7
                </span>
            </div>
            
            <div style="display: flex; justify-content: center; gap: 15px; margin-bottom: 12px;">
                <div style="background: #0f172a; padding: 12px 18px; border-radius: 10px; border: 1px solid rgba(212, 175, 55, 0.35); min-width: 75px;">
                    <div id="countdown-hours" style="font-size: 2.2em; font-weight: bold; color: #ffffff; font-family: monospace;">${lockStatus.isLocked ? '00' : '24'}</div>
                    <div style="color: #94a3b8; font-size: 0.78em; margin-top: 2px;">ساعة</div>
                </div>
                <div style="background: #0f172a; padding: 12px 18px; border-radius: 10px; border: 1px solid rgba(212, 175, 55, 0.35); min-width: 75px;">
                    <div id="countdown-mins" style="font-size: 2.2em; font-weight: bold; color: #ffffff; font-family: monospace;">00</div>
                    <div style="color: #94a3b8; font-size: 0.78em; margin-top: 2px;">دقيقة</div>
                </div>
                <div style="background: #0f172a; padding: 12px 18px; border-radius: 10px; border: 1px solid rgba(212, 175, 55, 0.35); min-width: 75px;">
                    <div id="countdown-secs" style="font-size: 2.2em; font-weight: bold; color: var(--primary-gold); font-family: monospace;">00</div>
                    <div style="color: #94a3b8; font-size: 0.78em; margin-top: 2px;">ثانية</div>
                </div>
            </div>

            <p style="color: #cbd5e1; font-size: 0.85em; margin: 0; line-height: 1.6;">
                ${lockStatus.isLocked 
                    ? '⏳ يجري احتساب فترة استشفاء الأنسجة (24 ساعة). التقييم والتمارين متاحان لك أدناه لتوثيق حالتك وقتما تشاء.' 
                    : '💡 الفاصل الزمني الموصى به بين كل جلسة وتالية هو 24 ساعة للسماح للألياف العضلية والغضاريف بإعادة البناء الذاتي.'}
            </p>
        </div>
    `;

    // الرسم البياني لمسار تراجع الألم:
    // الجلسة 2: بدون رسم بياني
    // باقي الجلسات (3 إلى 7): فيها كل شيء بالإضافة للرسم البياني
    let chartSectionHTML = '';
    if (activeDay === 2) {
        chartSectionHTML = `
            <div style="background: rgba(15, 23, 42, 0.7); border: 1px dashed rgba(212, 175, 55, 0.4); border-radius: 10px; padding: 12px 16px; text-align: center; color: #94a3b8; font-size: 0.85em; margin-bottom: 20px;">
                📊 <strong>الرسم البياني لمسار تراجع الألم:</strong> ينطلق تلقائياً بدءاً من الجلسة 3 عند توفر قراءتين مقارنتين لتوثيق منحنى الاستشفاء والشفاء بدقة.
            </div>
        `;
    } else {
        chartSectionHTML = sessionData.painTrendHTML || '';
    }

    container.innerHTML = `
        <div style="background: #111827; border: 1px solid var(--primary-gold); border-radius: 16px; padding: 30px; margin-bottom: 25px; box-shadow: 0 8px 32px rgba(0,0,0,0.5);">
            
            <!-- إهداء الصدقة الجارية -->
            <div style="background: rgba(16, 185, 129, 0.08); border: 1px solid rgba(16, 185, 129, 0.3); border-radius: 8px; padding: 9px 14px; margin-bottom: 16px; text-align: center; color: #6ee7b7; font-size: 0.88em;">
                🌿 هذا البرنامج العلاجي والمنزلي متاح مجاناً كصدقة جارية عن روح المرحوم والد المعالج جمال قبها مطور هذه الأداة - نسألكم له صالح الدعاء بالرحمة والمغفرة وعلو الدرجات في الجنة.
            </div>

            <!-- بنر علوي للاستشارة المباشرة مع المعالج -->
            <div style="background: linear-gradient(135deg, rgba(212, 175, 55, 0.15) 0%, rgba(15, 23, 42, 0.9) 100%); border: 1px solid var(--primary-gold); border-radius: 10px; padding: 12px 18px; margin-bottom: 20px; display: flex; justify-content: space-between; align-items: center; flex-wrap: wrap; gap: 10px;">
                <div style="color: #fef08a; font-size: 0.9em; display: flex; align-items: center; gap: 8px;">
                    <span>👨‍⚕️</span> <strong>استشارة المعالج:</strong> تشعر بألم حاد أو ترغب بتسريع الشفاء عبر جلسة تقويم يدوي مباشرة؟
                </div>
                <a href="${CLINIC_WHATSAPP}" target="_blank" style="background: #25d366; color: #fff; text-decoration: none; padding: 6px 14px; border-radius: 6px; font-size: 0.85em; font-weight: bold; display: inline-flex; align-items: center; gap: 6px;">
                    💬 محادثة المعالج واتساب
                </a>
            </div>

            <!-- بنر التذكير اليومي الذكي للجلسات -->
            ${getNotificationReminderBannerHTML(patientId)}

            <div style="display: flex; justify-content: space-between; align-items: center; border-bottom: 1px solid rgba(212, 175, 55, 0.2); padding-bottom: 15px; margin-bottom: 20px; flex-wrap: wrap; gap: 15px;">
                <div style="display: flex; align-items: center; gap: 15px;">
                    <img src="assets/logo.png" alt="شعار وداعاً للألم" style="height: 55px; width: 55px; border-radius: 50%; border: 1.5px solid var(--primary-gold);">
                    <div>
                        <h2 style="color: #ffffff; margin: 0 0 4px 0; font-size: 1.35em;">مرحباً ${sessionData.patient.name} 👋</h2>
                        <div style="color: var(--primary-gold); font-size: 0.9em;">متابعة جلسات التأهيل الحركي (الجلسة ${activeDay} من 7) - منطقة ${sessionData.latestAssessment?.painAreaTitle || 'المفصل المختار'}</div>
                    </div>
                </div>
                <div class="session-top-badges" style="display: grid; grid-template-columns: 1fr 1fr; gap: 8px; width: 100%; max-width: 320px; box-sizing: border-box;">
                    <button type="button" onclick="exportClinicalSummaryForDoctor('${patientId}')" class="btn-header no-print" style="padding: 7px 8px; font-size: 0.8em; background: #0f172a; border: 1.5px solid #38bdf8; color: #38bdf8; border-radius: 8px; font-weight: bold; cursor: pointer; display: flex; align-items: center; justify-content: center; gap: 4px; white-space: nowrap; width: 100%; box-sizing: border-box;">
                        <span>📋</span> ملخص المعالج
                    </button>
                    <div style="background: #0f172a; border: 1px solid #10b981; padding: 7px 8px; border-radius: 8px; color: #10b981; font-weight: bold; font-size: 0.78em; text-align: center; display: flex; align-items: center; justify-content: center; width: 100%; box-sizing: border-box; overflow: hidden;" title="✓ ${sessionData.stageTitle}">
                        <span style="overflow: hidden; text-overflow: ellipsis; white-space: nowrap; display: block; max-width: 100%;">✓ ${(sessionData.stageTitle || '').length > 22 ? sessionData.stageTitle.substring(0, 20) + '…' : sessionData.stageTitle}</span>
                    </div>
                </div>
            </div>

            <!-- عبارة تشجيعية ديناميكية مع تحفيز د. سارة -->
            <div style="background: rgba(16, 185, 129, 0.1); border: 1.5px solid #10b981; border-radius: 12px; padding: 12px 16px; margin-bottom: 20px; color: #6ee7b7; font-weight: 500; font-size: 0.92em; display: flex; justify-content: space-between; align-items: center; flex-wrap: wrap; gap: 10px;">
                <div style="flex: 1 1 220px; line-height: 1.6;">${sessionData.motivation}</div>
                <button type="button" onclick="playStationAudio('motivation')" class="btn-header btn-header-emerald" style="padding: 7px 14px; font-size: 0.8em; border-radius: 20px; cursor: pointer; display: inline-flex; align-items: center; gap: 5px; flex-shrink: 0; font-weight: bold; white-space: nowrap;">
                    <span>🎙️</span> تحفيز د. سارة
                </button>
            </div>

            <!-- أزرار اختيار الجلسة (2 إلى 7) -->
            ${sessionTabsHTML}

            <!-- ساعة التوقيت الـ 24 ساعة المعتمدة (في كل الجلسات 2-7) -->
            ${clock24HTML}

            <!-- مؤشرات التحسن الثلاثة -->
            <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(220px, 1fr)); gap: 15px; margin-bottom: 20px;">
                <div style="background: #0f172a; padding: 18px; border-radius: 12px; border: 1px solid rgba(239, 68, 68, 0.3); text-align: center;">
                    <div style="font-size: 2em; font-weight: bold; color: #ef4444;">${sessionData.indicators.painReduction}%</div>
                    <div style="color: #cbd5e1; font-size: 0.88em; font-weight: bold; margin-top: 4px;">مؤشر انخفاض وتلاشي الألم</div>
                    <div style="color: #94a3b8; font-size: 0.75em; margin-top: 2px;">${sessionData.currentSessionDay === 2 ? 'بانتظار تقييمك لجلسة اليوم' : (sessionData.baselinePain ? `مقارنة بألم البداية (${sessionData.baselinePain}/10)` : 'مقارنة بالتقييم السريري المبدئي')}</div>
                </div>

                <div style="background: #0f172a; padding: 18px; border-radius: 12px; border: 1px solid rgba(56, 189, 248, 0.3); text-align: center;">
                    <div style="font-size: 2em; font-weight: bold; color: #38bdf8;">${sessionData.indicators.mobility}%</div>
                    <div style="color: #cbd5e1; font-size: 0.88em; font-weight: bold; margin-top: 4px;">مؤشر استعادة المدى الحركي</div>
                    <div style="color: #94a3b8; font-size: 0.75em; margin-top: 2px;">${sessionData.currentSessionDay === 2 ? 'بانتظار تقييمك لجلسة اليوم' : 'بناءً على التقييم الحركي الفعلي المسجل'}</div>
                </div>

                <div style="background: #0f172a; padding: 18px; border-radius: 12px; border: 1px solid rgba(16, 185, 129, 0.3); text-align: center;">
                    <div style="font-size: 2em; font-weight: bold; color: #10b981;">${sessionData.indicators.sleepQuality}%</div>
                    <div style="color: #cbd5e1; font-size: 0.88em; font-weight: bold; margin-top: 4px;">مؤشر جودة وعمق النوم</div>
                    <div style="color: #94a3b8; font-size: 0.75em; margin-top: 2px;">${sessionData.currentSessionDay === 2 ? 'بانتظار تقييمك لجلسة اليوم' : 'بناءً على تقييم النوم والراحة الفعلي المسجل'}</div>
                </div>
            </div>

            <!-- الرسم البياني لمسار تراجع الألم (مستثنى في الجلسة 2، ومتاح في 3-7) -->
            ${chartSectionHTML}

            <!-- بطاقة التحليل السلوكي المستمر -->
            ${behavioralReportHTML}

            <!-- نموذج التقييم السريري اليومي (متاح دائماً في كل جلسة من 2 إلى 7) -->
            <div style="background: #0f172a; border: 1.5px solid #10b981; border-radius: 14px; padding: 25px; margin-bottom: 25px;">
                <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 15px; flex-wrap: wrap; gap: 8px;">
                    <h3 style="color: #10b981; margin: 0; font-size: 1.25em;">📝 تقييم ومتابعة تقدم الجلسة (#${activeDay}) - ${sessionData.latestAssessment?.painAreaTitle || ''}</h3>
                    <span style="background: rgba(16, 185, 129, 0.15); border: 1px solid #10b981; color: #6ee7b7; padding: 3px 10px; border-radius: 15px; font-size: 0.8em; font-weight: bold;">متاح لتوثيق الجلسة</span>
                </div>
                
                <!-- 1. مستوى الألم -->
                <div style="margin-bottom: 20px; background: #111827; padding: 15px; border-radius: 10px; border: 1px solid #334155;">
                    <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 6px;">
                        <label style="color: #e2e8f0; font-size: 0.95em; font-weight: bold;">1. مستوى شدة الألم الحالي (من 1 إلى 10):</label>
                        <span id="daily-pain-val" style="color: var(--primary-gold); font-weight: bold; font-size: 1.15em;">3 / 10</span>
                    </div>
                    <div style="text-align: center; margin: 4px 0 8px 0;">
                        <div class="slider-drag-hint-animated">
                            <span class="pulse-arrow-hand-left">👈</span>
                            <span>اسحب المؤشر لتحديد درجة ألمك الفعلية</span>
                            <span class="pulse-arrow-hand-right">👉</span>
                        </div>
                    </div>
                    <input type="range" id="daily-pain-input" min="1" max="10" value="3" oninput="document.getElementById('daily-pain-val').textContent = this.value + ' / 10'" style="width: 100%; accent-color: var(--primary-gold);">
                </div>

                <!-- 2. تقييم المدى الحركي المنسجم مع نقطة الألم -->
                <div style="margin-bottom: 20px; background: #111827; padding: 15px; border-radius: 10px; border: 1px solid rgba(56, 189, 248, 0.3);">
                    <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 8px;">
                        <label style="color: #38bdf8; font-size: 0.95em; font-weight: bold;">
                            ${anatomicalConfig ? anatomicalConfig.mobilityQuestion : '2. نسبة استعادة المدى الحركي والمرونة اليوم:'}
                        </label>
                        <span id="daily-mobility-val" style="color: #38bdf8; font-weight: bold; font-size: 1.15em;">70 %</span>
                    </div>
                    <div style="text-align: center; margin: 4px 0 8px 0;">
                        <div class="slider-drag-hint-animated">
                            <span class="pulse-arrow-hand-left">👈</span>
                            <span>اسحب المؤشر لتحديد نسبة حركتك اليوم</span>
                            <span class="pulse-arrow-hand-right">👉</span>
                        </div>
                    </div>
                    <input type="range" id="daily-mobility-slider" min="10" max="100" value="70" oninput="document.getElementById('daily-mobility-val').textContent = this.value + ' %'" style="width: 100%; accent-color: #38bdf8; margin-bottom: 12px;">
                    
                    <div style="color: #94a3b8; font-size: 0.82em; margin-bottom: 8px;">اختر كل ما ينطبق على حركتك اليوم (اختيار متعدد):</div>
                    <div style="display: grid; grid-template-columns: 1fr; gap: 8px;">
                        ${(anatomicalConfig ? anatomicalConfig.mobilityOptions : [
                            { val: 95, text: "حرية حركة ممتازة دون تيبس أو إعاقة" },
                            { val: 75, text: "تحسن ملحوظ في الحركة مع انزعاج طفيف عند أقصى المدى" },
                            { val: 45, text: "حركة مقيدة جزئياً مع تيبس يستغرق وقتاً ليلين" },
                            { val: 20, text: "صعوبة وتيبس شديد ومحدودية حركية واضحة" }
                        ]).map((opt) => `
                            <label style="color: #e2e8f0; font-size: 0.88em; display: flex; align-items: center; gap: 8px; cursor: pointer;">
                                <input type="checkbox" name="daily_mobility_check" value="${opt.val}" style="accent-color: #38bdf8; width: 16px; height: 16px;"> ${(opt.text || '').replace(/\s*\(\d+%\)/g, '')}
                            </label>
                        `).join('')}
                    </div>
                </div>

                <!-- 3. تقييم جودة النوم المنسجم مع نقطة الألم -->
                <div style="margin-bottom: 20px; background: #111827; padding: 15px; border-radius: 10px; border: 1px solid rgba(16, 185, 129, 0.3);">
                    <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 8px;">
                        <label style="color: #10b981; font-size: 0.95em; font-weight: bold;">
                            ${anatomicalConfig ? anatomicalConfig.sleepQuestion : '3. نسبة جودة وعمق النوم والراحة الليلة الماضية:'}
                        </label>
                        <span id="daily-sleep-val" style="color: #10b981; font-weight: bold; font-size: 1.15em;">70 %</span>
                    </div>
                    <div style="text-align: center; margin: 4px 0 8px 0;">
                        <div class="slider-drag-hint-animated">
                            <span class="pulse-arrow-hand-left">👈</span>
                            <span>اسحب المؤشر لتحديد جودة نومك الليلة الماضية</span>
                            <span class="pulse-arrow-hand-right">👉</span>
                        </div>
                    </div>
                    <input type="range" id="daily-sleep-slider" min="10" max="100" value="70" oninput="document.getElementById('daily-sleep-val').textContent = this.value + ' %'" style="width: 100%; accent-color: #10b981; margin-bottom: 12px;">

                    <div style="color: #94a3b8; font-size: 0.82em; margin-bottom: 8px;">اختر كل ما ينطبق على نومك (اختيار متعدد):</div>
                    <div style="display: grid; grid-template-columns: 1fr; gap: 8px;">
                        ${(anatomicalConfig ? anatomicalConfig.sleepOptions : [
                            { val: 95, text: "نوم عميق ومريح ومتواصل طوال الليل دون ألم" },
                            { val: 75, text: "نوم جيد مع استيقاظ عابر عند التقلب دون ألم حاد" },
                            { val: 45, text: "نوم متقطع وصعوبة في إيجاد وضعية مريحة للمفصل" },
                            { val: 20, text: "أرق شديد واستيقاظ متكرر بسبب نوبات الألم" }
                        ]).map((opt) => `
                            <label style="color: #e2e8f0; font-size: 0.88em; display: flex; align-items: center; gap: 8px; cursor: pointer;">
                                <input type="checkbox" name="daily_sleep_check" value="${opt.val}" style="accent-color: #10b981; width: 16px; height: 16px;"> ${(opt.text || '').replace(/\s*\(\d+%\)/g, '')}
                            </label>
                        `).join('')}
                    </div>
                </div>

                <!-- 4. السلوكيات الإيجابية والسلبية المنسجمة مع نقطة الألم -->
                <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(280px, 1fr)); gap: 15px; margin-bottom: 20px;">
                    <div style="background: rgba(16, 185, 129, 0.08); border: 1px solid rgba(16, 185, 129, 0.3); padding: 15px; border-radius: 10px;">
                        <div style="color: #10b981; font-weight: bold; font-size: 0.95em; margin-bottom: 10px;">✨ السلوكيات الإيجابية المنجزة اليوم:</div>
                        ${(anatomicalConfig ? anatomicalConfig.positiveBehaviors : [
                            { id: "beh-exercise", text: "نفذت التمارين التأهيلية بانتظام" },
                            { id: "beh-posture", text: "حافظت على وضعية جلوس ووقوف مستقيمة" },
                            { id: "beh-walk", text: "قمت بالمشي الخفيف وتنشيط الدورة الدموية" },
                            { id: "beh-heat", text: "استخدمت الكمادات الدافئة / الراحة الكافية" }
                        ]).map((beh) => `
                            <label style="color: #e2e8f0; font-size: 0.88em; display: flex; align-items: center; gap: 8px; margin-bottom: 6px; cursor: pointer;">
                                <input type="checkbox" id="${beh.id}" style="accent-color: #10b981; width: 16px; height: 16px;"> ${beh.text}
                            </label>
                        `).join('')}
                    </div>

                    <div style="background: rgba(239, 68, 68, 0.08); border: 1px solid rgba(239, 68, 68, 0.3); padding: 15px; border-radius: 10px;">
                        <div style="color: #ef4444; font-weight: bold; font-size: 0.95em; margin-bottom: 10px;">⚠️ سلوكيات سلبية حدثت اليوم (للتصحيح):</div>
                        ${(anatomicalConfig ? anatomicalConfig.negativeBehaviors : [
                            { id: "neg-sitting", text: "جلوس طويل متواصل لأكثر من ساعة" },
                            { id: "neg-lifting", text: "حمل أوزان ثقيلة أو انحناء مفاجئ للظهر" },
                            { id: "neg-phone", text: "استخدام طويل للهاتف مع انحناء الرقبة" },
                            { id: "neg-sleep", text: "نوم غير مريح أو على وسادة مرتفعة" }
                        ]).map(neg => `
                            <label style="color: #fca5a5; font-size: 0.88em; display: flex; align-items: center; gap: 8px; margin-bottom: 6px; cursor: pointer;">
                                <input type="checkbox" id="${neg.id}" style="accent-color: #ef4444; width: 16px; height: 16px;"> ${neg.text}
                            </label>
                        `).join('')}
                    </div>
                </div>

                <button type="button" onclick="submitComprehensiveDailyLog('${patientId}', ${activeDay})" style="background: linear-gradient(135deg, #10b981 0%, #059669 100%); color: #ffffff; border: none; padding: 14px 30px; border-radius: 8px; font-weight: bold; cursor: pointer; font-size: 1em; box-shadow: 0 4px 15px rgba(16, 185, 129, 0.3); width: 100%;">
                    💾 حفظ تسجيل الجلسة (#${activeDay}) وتحديث مؤشرات التعافي
                </button>
            </div>

            <!-- عرض التمارين اليومية المقررة للجلسة المختارة -->
            <div style="margin-bottom: 25px;">
                <h3 style="color: var(--primary-gold); margin: 0 0 15px 0; font-size: 1.3em;">🏋️ تمارين الراحة المقررة للجلسة (${activeDay} من 7) - ${sessionData.stageTitle}</h3>
                <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(320px, 1fr)); gap: 18px;">
                    ${dayExercises.map((ex, idx) => `
                        <div class="clinical-exercise-card" style="background: #0f172a; border: 1px solid rgba(212, 175, 55, 0.3); border-radius: 14px; padding: 20px; display: flex; flex-direction: column; justify-content: space-between;">
                            <div>
                                ${generateExerciseIllustration(ex.visualType, ex.id, { name: ex.name })}
                                <div style="display: flex; justify-content: space-between; align-items: center; margin-margin: 10px 0 6px 0;">
                                    <span style="color: var(--primary-gold); font-size: 0.78em; font-weight: bold;">تمرين #${idx+1} (الجلسة ${activeDay})</span>
                                    <span style="color: #10b981; font-size: 0.78em;">⏱️ ${ex.duration}</span>
                                </div>
                                <h4 style="color: #ffffff; margin: 0 0 6px 0; font-size: 1.15em;">${ex.name}</h4>
                                <p style="color: #cbd5e1; font-size: 0.86em; margin: 0 0 12px 0;">${ex.description}</p>
                                
                                <div style="background: #111827; padding: 12px; border-radius: 8px; margin-bottom: 12px; font-size: 0.85em; color: #e2e8f0; line-height: 1.7; border-right: 3px solid var(--primary-gold);">
                                    <strong>طريقة الأداء:</strong><br>${ex.instructions}
                                </div>

                                <div style="display: flex; gap: 8px; flex-wrap: wrap; margin-bottom: 12px;">
                                    <span style="background: #1e293b; color: #d4af37; font-size: 0.8em; padding: 3px 8px; border-radius: 4px; font-weight: bold;">🔁 ${ex.reps}</span>
                                    <span style="background: #1e293b; color: #f59e0b; font-size: 0.8em; padding: 3px 8px; border-radius: 4px; font-weight: bold;">📦 ${ex.sets}</span>
                                </div>

                                <!-- دليل التكنيك السليم والأخطاء الشائعة -->
                                ${typeof getExerciseFormGuideHTML === 'function' ? getExerciseFormGuideHTML(ex) : ''}
                            </div>
                            <div>
                                <div style="background: #1e2633; height: 5px; border-radius: 3px; overflow: hidden; margin-bottom: 8px;">
                                    <div class="timer-progress-fill" style="background: linear-gradient(90deg, #d4af37 0%, #10b981 100%); height: 100%; width: 0%; transition: width 1s linear;"></div>
                                </div>
                                <button type="button" onclick="PatientFlow.toggleExerciseTimer(this, ${ex.durationSec || 30})" class="btn-exercise-timer" data-running="false" data-remaining="${ex.durationSec || 30}" data-total="${ex.durationSec || 30}" style="width: 100%; background: linear-gradient(135deg, #d4af37 0%, #aa820a 100%); color: #0a0e14; border: none; padding: 10px 14px; border-radius: 6px; font-weight: bold; cursor: pointer; font-size: 0.92em;">
                                    ⏱️ ابدأ مؤقت التمرين (${ex.duration})
                                </button>
                            </div>
                        </div>
                    `).join('')}
                </div>
            </div>

            <!-- كرت ترويجي: خدمة الزيارات المنزلية واستشارة المعالج -->
            <div class="no-print">
                ${getHomeVisitCardHTML()}
            </div>
        </div>
    `;

    // تشغيل العداد التنازلي لساعة الـ 24 ساعة إن كان هناك قفل زمني
    if (lockStatus.isLocked && lockStatus.targetTime) {
        PatientFlow.startCountdownTimer(lockStatus.targetTime, {
            hours: document.getElementById('countdown-hours'),
            minutes: document.getElementById('countdown-mins'),
            seconds: document.getElementById('countdown-secs')
        }, () => {
            showToast('🎉 اكتملت الـ 24 ساعة! تهانينا على استشفاء الأنسجة', 'success');
            if (typeof triggerSessionReadyNotification === 'function') {
                triggerSessionReadyNotification(activePatient?.name);
            }
        });
    }
}

// =========================================================================
// الخطوة 6: وثيقة التعافي والإنهاء (التخرج بعد 7 أيام)
// =========================================================================
async function renderStep6Completion(patientId, sessionData = null) {
    if (window.liveSessionClockInterval) {
        clearInterval(window.liveSessionClockInterval);
        window.liveSessionClockInterval = null;
    }

    if (!sessionData) {
        sessionData = await PatientFlow.initPatientSession(patientId);
    }
    if (!sessionData || !sessionData.patient) {
        resetToInitialState();
        return;
    }

    activePatient = sessionData.patient;
    goToStep(6);

    const container = document.getElementById('step6-completion-container') || document.getElementById('patient-recovery-dashboard');
    if (!container) return;

    const basePain = sessionData.baselinePain || 7;
    const endPain = sessionData.currentPain || 0;
    const painDrop = sessionData.indicators.painReduction;
    const residualPain = 100 - painDrop;

    const pointKey = sessionData.latestAssessment?.pointId || sessionData.latestAssessment?.pointKey || sessionData.patient.painArea || sessionData.patient.painPointId || 'lumbar_spine';
    const pKey = (pointKey || '').toLowerCase();
    const areaName = sessionData.latestAssessment?.painAreaTitle || (typeof currentSelectedPoint !== 'undefined' && currentSelectedPoint ? currentSelectedPoint.title : 'المنطقة المصابة');
    
    let anatomicalEvaluationText = '';
    let anatomicalProtectionText = '';

    if (pKey.includes('wrist') || pKey.includes('hand') || pKey.includes('carpal') || areaName.includes('رسغ') || areaName.includes('يد') || areaName.includes('أصابع')) {
        anatomicalEvaluationText = `💡 تم تحقيق تحسن حركي ممتاز بنسبة ${painDrop}%، وما تبقى من انزعاج (${residualPain}%) يعود عادةً إلى انحراف ميكانيكي دقيق في عظيمات ومفصل الرسغ أو إجهاد وتوتر في الأوتار والمسار العصبي للنفق الرسغي <span dir="ltr">(Carpal Tunnel)</span>، ويتطلب جلسة تقويم يدوي وتفريغ ضغط مع المعالج المختص في (وداعاً للألم) لتحريرها نهائياً.`;
        anatomicalProtectionText = `🛡️ لحماية مفصل الرسغ واليد من الانتكاس واستعادة كفاءة القبضة الحركية كاملة، يحدد المعالج المختص الخطة الوقائية المناسبة.`;
    } else if (pKey.includes('elbow') || areaName.includes('كوع') || areaName.includes('مرفق')) {
        anatomicalEvaluationText = `💡 تم تحقيق تحسن حركي ممتاز بنسبة ${painDrop}%، وما تبقى من انزعاج (${residualPain}%) يعود عادةً إلى شد وإجهاد في أوتار المرفق أو احتكاك ميكانيكي طفيف في مفصل الكوع، ويتطلب تقويماً يدوياً وتفريغ ضغط للأوتار مع المعالج المختص في (وداعاً للألم).`;
        anatomicalProtectionText = `🛡️ لحماية مفصل الكوع والساعد من إجهاد الحركة المتكررة، يحدد المعالج المختص التوجيهات السريرية اللازمة.`;
    } else if (pKey.includes('shoulder') || areaName.includes('كتف') || areaName.includes('أبهر')) {
        anatomicalEvaluationText = `💡 تم تحقيق تحسن حركي ممتاز بنسبة ${painDrop}%، وما تبقى من انزعاج (${residualPain}%) يعود عادةً إلى شد عميق بأوتار الكفة المدورة <span dir="ltr">(Rotator Cuff)</span> أو عُقد ليفية وتشنج حول لوح الكتف، تتطلب جلسة تقويم يدوي وتفريغ ضغط في (وداعاً للألم) لإعادة المدى الحركي الكامل.`;
        anatomicalProtectionText = `🛡️ لحماية مفصل الكتف وحركته الدورانية من أي تيبس مستقبلي، يحدد المعالج المختص الخطة الوقائية.`;
    } else if (pKey.includes('knee') || areaName.includes('ركب') || areaName.includes('صابون')) {
        anatomicalEvaluationText = `💡 تم تحقيق تحسن حركي ممتاز بنسبة ${painDrop}%، وما تبقى من انزعاج (${residualPain}%) يعود عادةً إلى احتكاك ميكانيكي في مسار صابونة الركبة أو تشنج في الأربطة والأوتار الداعمة، ويتطلب تقويماً وموازنة للأحمال الحركية في (وداعاً للألم).`;
        anatomicalProtectionText = `🛡️ لحماية غضاريف الركبة من الخشونة والانتكاس المستقبلي، يحدد المعالج المختص النصائح الحركية المناسبة.`;
    } else if (pKey.includes('ankle') || pKey.includes('foot') || pKey.includes('plantar') || areaName.includes('كاحل') || areaName.includes('قدم') || areaName.includes('كعب')) {
        anatomicalEvaluationText = `💡 تم تحقيق تحسن كبير بنسبة ${painDrop}%، وما تبقى من انزعاج (${residualPain}%) يعود إلى إجهاد ميكانيكي في اللفافة الأخمصية أو أربطة الكاحل، ويتطلب جلسة تقويم وتفريغ ضغط في (وداعاً للألم).`;
        anatomicalProtectionText = `🛡️ لحماية قوس القدم ومفصل الكاحل من عودة الألم، يحدد المعالج المختص التمارين الحركية الوقائية.`;
    } else if (pKey.includes('hip') || pKey.includes('sacroiliac') || areaName.includes('ورك') || areaName.includes('حوض') || areaName.includes('عرق النسا')) {
        anatomicalEvaluationText = `💡 تم تحقيق تحسن كبير بنسبة ${painDrop}%، وما تبقى من انزعاج (${residualPain}%) يعود عادةً إلى تشنج في العضلة الكمثرية يضغط على مسار العصب الوركي أو اختلال ميكانيكي في مفصل الحوض، ويتطلب تقويماً يدوياً وتفريغ ضغط في (وداعاً للألم).`;
        anatomicalProtectionText = `🛡️ لحماية مفصل الحوض ومسار العصب الوركي من الانتكاس، يحدد المعالج المختص الخطة الوقائية.`;
    } else {
        anatomicalEvaluationText = `💡 تم تحقيق تحسن كبير بنسبة ${painDrop}%، وما تبقى من انزعاج (${residualPain}%) يعود عادةً إلى انحراف ميكانيكي طفيف بمفاصل الفقرات أو شد عضلي وتيبس يتطلب جلسة كايروبراكتيك وتفريغ للضغط <span dir="ltr">(Manual Decompression)</span> مع المعالج المختص في (وداعاً للألم) لإزالته نهائياً.`;
        anatomicalProtectionText = `🛡️ لحماية عمودك الفقري ومفاصلك من الانتكاس المستقبلي، يحدد المعالج المختص الخطة الوقائية المناسبة لحالتك.`;
    }

    const hasExplicitBasePain = !!(sessionData.latestAssessment?.hasExplicitPain && sessionData.baselinePain);
    const painTrackSummary = hasExplicitBasePain
        ? `📊 مسار الألم الفعلي: من مستوى <strong>${basePain} / 10</strong> في اليوم الأول ⬅️ إلى <strong>${endPain} / 10</strong> في اليوم السابع`
        : `📊 مسار التعافي الفعلي: تراجع ملحوظ في شدة الألم وتلاشي الأعراض بنسبة <strong>${painDrop}%</strong> بين اليوم الأول واليوم السابع`;

    container.innerHTML = `
        <div style="background: linear-gradient(135deg, #0b1f17 0%, #153e2e 100%); border: 2px solid #10b981; border-radius: 16px; padding: 35px; color: #ffffff; text-align: center; box-shadow: 0 10px 40px rgba(0,0,0,0.6); margin-bottom: 25px;">
            <div style="font-size: 4em; margin-bottom: 10px;">🏆</div>
            <h2 style="font-size: 2em; margin: 0 0 10px 0; color: #6ee7b7;">تهانينا القلبية ${sessionData.patient.name}!</h2>
            <div style="font-size: 1.15em; margin-bottom: 20px; color: #d1fae5;">لقد أتممت بنجاح برنامج الراحة والتأهيل الحركي (7 أيام كاملة) لمنطقة ${sessionData.latestAssessment?.painAreaTitle || 'المفصل'}</div>
            
            <div style="background: rgba(15, 23, 42, 0.8); border: 1px solid rgba(212, 175, 55, 0.3); border-radius: 12px; padding: 15px; margin-bottom: 25px; display: inline-block;">
                <div style="color: #cbd5e1; font-size: 0.95em;">
                    ${painTrackSummary}
                </div>
            </div>

            <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 15px; max-width: 700px; margin: 0 auto 25px auto;">
                <div style="background: rgba(0,0,0,0.35); padding: 15px; border-radius: 10px; border: 1px solid #10b981;">
                    <div style="font-size: 2.2em; font-weight: bold; color: #10b981;">${sessionData.indicators.painReduction}%</div>
                    <div style="font-size: 0.85em; color: #e2e8f0;">نسبة انخفاض وتلاشي الألم الفعلية</div>
                </div>
                <div style="background: rgba(0,0,0,0.35); padding: 15px; border-radius: 10px; border: 1px solid #38bdf8;">
                    <div style="font-size: 2.2em; font-weight: bold; color: #38bdf8;">${sessionData.indicators.mobility}%</div>
                    <div style="font-size: 0.85em; color: #e2e8f0;">نسبة استعادة المدى الحركي</div>
                </div>
                <div style="background: rgba(0,0,0,0.35); padding: 15px; border-radius: 10px; border: 1px solid #f59e0b;">
                    <div style="font-size: 2.2em; font-weight: bold; color: #fef08a;">${sessionData.indicators.sleepQuality}%</div>
                    <div style="font-size: 0.85em; color: #e2e8f0;">مؤشر جودة وعمق النوم</div>
                </div>
            </div>

            <!-- رسم بياني مسار تراجع الألم التراكمي الشامل -->
            ${sessionData.painTrendHTML || ''}

            <div style="background: rgba(15, 23, 42, 0.9); border-radius: 12px; padding: 20px; text-align: right; max-width: 700px; margin: 0 auto 25px auto; border-right: 4px solid var(--primary-gold);">
                <h4 style="color: var(--primary-gold); margin: 0 0 8px 0; font-size: 1.1em;">🔍 التقييم السريري والتوجيه الطبي النهائي:</h4>
                <p style="color: #cbd5e1; font-size: 0.92em; line-height: 1.7; margin: 0 0 10px 0;">
                    ${endPain === 0 ? '✨ استجابة ممتازة جداً واختفاء تام للألم بفضل الله ثم التزامك بالبروتوكول.' : anatomicalEvaluationText}
                </p>
                <div style="color: #6ee7b7; font-size: 0.88em;">${anatomicalProtectionText}</div>
            </div>

            <div class="completion-action-grid" style="display: grid; grid-template-columns: 1fr 1fr; gap: 10px; max-width: 650px; margin: 0 auto 12px auto; width: 100%; box-sizing: border-box;">
                <button type="button" onclick="openCompletionCertificateModal('${patientId}')" style="background: linear-gradient(135deg, #f59e0b 0%, #d97706 100%); color: #0a0e14; border: none; padding: 12px 8px; border-radius: 8px; font-weight: 800; font-size: 0.88em; cursor: pointer; box-shadow: 0 4px 20px rgba(245, 158, 11, 0.4); display: flex; align-items: center; justify-content: center; gap: 5px; white-space: nowrap; width: 100%; box-sizing: border-box;">
                    🏆 وسام الانتصار والوثيقة
                </button>
                <button type="button" onclick="exportClinicalSummaryForDoctor('${patientId}')" style="background: linear-gradient(135deg, #38bdf8 0%, #0284c7 100%); color: #0a0e14; border: none; padding: 12px 8px; border-radius: 8px; font-weight: 800; font-size: 0.88em; cursor: pointer; box-shadow: 0 4px 20px rgba(56, 189, 248, 0.35); display: flex; align-items: center; justify-content: center; gap: 5px; white-space: nowrap; width: 100%; box-sizing: border-box;">
                    📋 ملخص الحالة للمعالج
                </button>
            </div>

            <div class="completion-action-grid" style="display: grid; grid-template-columns: 1fr 1fr; gap: 10px; max-width: 650px; margin: 0 auto; width: 100%; box-sizing: border-box;">
                <a href="${CLINIC_WHATSAPP}" target="_blank" style="background: linear-gradient(135deg, var(--primary-gold) 0%, var(--primary-gold-dark) 100%); color: #0a0e14; padding: 12px 8px; border-radius: 8px; text-decoration: none; font-weight: bold; font-size: 0.88em; box-shadow: 0 4px 20px rgba(212, 175, 55, 0.4); display: flex; align-items: center; justify-content: center; gap: 5px; white-space: nowrap; width: 100%; box-sizing: border-box;">
                    💬 حجز جلسة كايروبراكتيك
                </a>
                <button type="button" onclick="resetToInitialState()" style="background: #1e293b; color: #cbd5e1; border: 1px solid #475569; padding: 12px 8px; border-radius: 8px; cursor: pointer; font-weight: bold; font-size: 0.88em; display: flex; align-items: center; justify-content: center; gap: 5px; white-space: nowrap; width: 100%; box-sizing: border-box;">
                    🔄 فحص منطقة أخرى
                </button>
            </div>
        </div>
    `;

    setTimeout(() => {
        if (typeof playStationAudio === 'function') {
            playStationAudio('plan_complete', () => {}, 'motivation');
        }
    }, 400);
}

// توجيه ذكي للمرحلة المناسبة في خطة التعافي
async function loadPatientRecoveryDashboard(patientId, targetDay = null) {
    const sessionData = await PatientFlow.initPatientSession(patientId);
    if (!sessionData || !sessionData.patient) {
        resetToInitialState();
        return;
    }

    activePatient = sessionData.patient;
    const lockStatus = await PatientFlow.getSessionLockStatus(patientId);

    // إذا اكتمل البرنامج (7 جلسات): وثيقة التعافي والإنهاء (الخطوة 6)
    if (sessionData.isPlanCompleted) {
        await renderStep6Completion(patientId, sessionData);
    } 
    // إذا كان في اليوم الأول ولم يوثق إنجاز اليوم الأول بعد: الجلسة الأولى المستقلة (الخطوة 4)
    else if (sessionData.currentSessionDay === 1 && sessionData.dailyLogs.length === 0 && !lockStatus.isLocked) {
        await renderStep4IndependentDay1(patientId, sessionData);
    } 
    // إذا أنجز اليوم الأول (الأيام 2 إلى 7): متابعة الجلسات (الخطوة 5)
    else {
        await renderStep5SessionsDashboard(patientId, targetDay || sessionData.currentSessionDay, sessionData);
    }
}

// إتمام تمارين اليوم الأول والانتقال لفترة الاستشفاء (24 ساعة)
async function completeDay1InitialExercises(patientId) {
    if (window.liveSessionClockInterval) {
        clearInterval(window.liveSessionClockInterval);
        window.liveSessionClockInterval = null;
    }
    const pInfo = await SmartDB.getPatient(patientId);
    const assessments = await SmartDB.getPatientAssessments(patientId);
    const latestAssessment = assessments.length > 0 ? assessments[assessments.length - 1] : null;
    const baselinePain = (latestAssessment && typeof latestAssessment.painSeverity === 'number' && !isNaN(latestAssessment.painSeverity) && latestAssessment.painSeverity > 0)
        ? latestAssessment.painSeverity
        : (pInfo && typeof pInfo.painLevel === 'number' && !isNaN(pInfo.painLevel) && pInfo.painLevel > 0)
            ? pInfo.painLevel
            : 7;

    const logEntry = {
        patientId,
        sessionNumber: 1,
        painScore: baselinePain,
        mobilityRate: 70,
        sleepRate: 70,
        exercisesDone: true,
        goodPosture: true,
        walkingDone: false,
        heatDone: true,
        negativeHabits: { longSitting: false, heavyLifting: false, phoneUsage: false, poorSleep: false },
        isDay1InitialCompletion: true,
        date: new Date().toISOString()
    };

    await SmartDB.saveDailyLog(logEntry);

    const pName = pInfo?.name || activePatient?.name || 'المراجع الكريم';
    const pPhone = pInfo?.phone || activePatient?.phone || '';

    SmartDB.addAdminNotification({
        type: 'session_completed',
        title: `🏋️ إتمام تمارين اليوم الأول: ${pName}`,
        message: `أتم المريض ${pName} تمارين الجلسة الأولى بنجاح وبدأت فترة الاستشفاء لمدة 24 ساعة.`,
        patientId,
        patientName: pName,
        patientPhone: pPhone
    });

    showToast('🎉 أحسنت! تم توثيق إنجاز تمارين اليوم الأول وبدأت فترة الاستشفاء لمدة 24 ساعة', 'success');

    if (typeof playStationAudio === 'function') {
        playStationAudio('session_cooldown', () => {}, 'motivation');
    }

    await loadPatientRecoveryDashboard(patientId, 2);
}

window.renderStep4IndependentDay1 = renderStep4IndependentDay1;
window.renderStep5SessionsDashboard = renderStep5SessionsDashboard;
window.renderStep6Completion = renderStep6Completion;

// حفظ التسجيل اليومي الشامل
async function submitComprehensiveDailyLog(patientId, sessionNumber) {
    const painScore = parseInt(document.getElementById('daily-pain-input')?.value || 3);
    const mobilityRate = parseInt(document.getElementById('daily-mobility-slider')?.value || document.querySelector('input[name="daily_mobility_check"]:checked')?.value || 75);
    const sleepRate = parseInt(document.getElementById('daily-sleep-slider')?.value || document.querySelector('input[name="daily_sleep_check"]:checked')?.value || 75);

    const mobilitySelected = Array.from(document.querySelectorAll('input[name="daily_mobility_check"]:checked')).map(el => el.value);
    const sleepSelected = Array.from(document.querySelectorAll('input[name="daily_sleep_check"]:checked')).map(el => el.value);

    const exercisesDone = document.getElementById('beh-exercise')?.checked || false;
    const goodPosture = document.getElementById('beh-posture')?.checked || false;
    const walkingDone = document.getElementById('beh-walk')?.checked || false;
    const heatDone = document.getElementById('beh-heat')?.checked || false;

    const longSitting = document.getElementById('neg-sitting')?.checked || false;
    const heavyLifting = document.getElementById('neg-lifting')?.checked || false;
    const phoneUsage = document.getElementById('neg-phone')?.checked || false;
    const poorSleep = document.getElementById('neg-sleep')?.checked || false;

    const logEntry = {
        patientId,
        sessionNumber,
        painScore,
        mobilityRate,
        sleepRate,
        exercisesDone,
        goodPosture,
        walkingDone,
        heatDone,
        negativeHabits: { longSitting, heavyLifting, phoneUsage, poorSleep },
        date: new Date().toISOString()
    };

    await SmartDB.saveDailyLog(logEntry);

    const allLogs = await SmartDB.getPatientDailyLogs(patientId);
    const pInfo = await SmartDB.getPatient(patientId);
    const pName = pInfo?.name || activePatient?.name || patientId;
    const pPhone = pInfo?.phone || activePatient?.phone || '';

    if (allLogs.length >= 7 || sessionNumber >= 7) {
        SmartDB.addAdminNotification({
            type: 'plan_completed',
            title: `🏆 إتمام البرنامج (7 أيام): ${pName}`,
            message: `أتم المريض ${pName} برنامج التأهيل والتعافي المنزلي (7 أيام كاملة)! ألم اليوم الأخير: ${painScore}/10، مرونة الحركة: ${mobilityRate}% - جاهز للمتابعة وحجز الجلسة السريرية.`,
            patientId,
            patientName: pName,
            patientPhone: pPhone,
            meta: {
                painScore,
                mobilityRate,
                sleepRate,
                totalLogs: allLogs.length
            }
        });
    } else {
        SmartDB.addAdminNotification({
            type: 'session_done',
            title: `📝 إنجاز الجلسة #${sessionNumber}: ${pName}`,
            message: `سجل المريض ${pName} تقييم الجلسة #${sessionNumber} بنجاح. مستوى الألم الحالي: ${painScore}/10، مرونة الحركة: ${mobilityRate}%`,
            patientId,
            patientName: pName,
            patientPhone: pPhone,
            meta: { sessionNumber, painScore, mobilityRate, sleepRate }
        });
    }

    if (longSitting || heavyLifting || phoneUsage || poorSleep) {
        showToast('⚠️ تم حفظ الجلسة بنجاح، لكن انتبه للسلوكيات السلبية المجهدة للفقرات!', 'error');
    } else {
        showToast('🎉 أحسنت! التزام رائع بالسلوكيات الإيجابية، تم تفعيل تقدمك بنجاح!', 'success');
    }

    loadPatientRecoveryDashboard(patientId);
}

// فتح مكتبة التمارين
function openExerciseLibraryModal(filterCategory = 'all') {
    const modal = document.getElementById('exercise-library-modal');
    const container = document.getElementById('exercise-library-grid');
    if (!modal || !container) return;

    modal.style.display = 'flex';
    let allExercises = [];

    if (filterCategory === 'all') {
        Object.values(MASTER_EXERCISES_CATALOG).forEach(list => {
            allExercises.push(...list);
        });
    } else if (MASTER_EXERCISES_CATALOG[filterCategory]) {
        allExercises.push(...MASTER_EXERCISES_CATALOG[filterCategory]);
    }

    document.querySelectorAll('#exercise-library-modal .btn-header').forEach(btn => {
        if (btn.dataset.category === filterCategory) {
            btn.style.background = 'var(--primary-gold)';
            btn.style.color = '#0a0e14';
        } else {
            btn.style.background = '#1e293b';
            btn.style.color = '#ffffff';
        }
    });

    container.innerHTML = allExercises.map((ex, idx) => `
        <div class="clinical-exercise-card" style="background: #111827; border: 1px solid rgba(212, 175, 55, 0.3); border-radius: 12px; padding: 18px; display: flex; flex-direction: column; justify-content: space-between;">
            <div>
                ${generateExerciseIllustration(ex.visualType, ex.id, { name: ex.name })}
                <div style="display: flex; justify-content: space-between; align-items: center; margin: 10px 0 6px 0;">
                    <span style="background: rgba(212, 175, 55, 0.15); border: 1px solid var(--primary-gold); color: var(--primary-gold); font-size: 0.78em; padding: 2px 8px; border-radius: 4px; font-weight: bold;">تمرين علاجي #${idx+1}</span>
                    <span style="color: #10b981; font-size: 0.78em;">⏱️ ${ex.duration}</span>
                </div>
                <h4 style="color: #ffffff; margin: 0 0 6px 0; font-size: 1.1em;">${ex.name}</h4>
                <p style="color: #cbd5e1; font-size: 0.85em; margin: 0 0 10px 0;">${ex.description}</p>
                <div style="background: #0f172a; padding: 10px; border-radius: 6px; margin-bottom: 12px; font-size: 0.82em; color: #e2e8f0; line-height: 1.6;">
                    <strong>طريقة التطبيق:</strong><br>${ex.instructions}
                </div>
                <div style="display: flex; gap: 6px; margin-bottom: 8px;">
                    <span style="background: #1e293b; color: #d4af37; font-size: 0.75em; padding: 2px 6px; border-radius: 4px;">🔁 ${ex.reps}</span>
                    <span style="background: #1e293b; color: #f59e0b; font-size: 0.75em; padding: 2px 6px; border-radius: 4px;">📦 ${ex.sets}</span>
                </div>

                <!-- دليل التكنيك السليم والأخطاء الشائعة -->
                ${typeof getExerciseFormGuideHTML === 'function' ? getExerciseFormGuideHTML(ex) : ''}
            </div>
            <div>
                <div style="background: #1e2633; height: 5px; border-radius: 3px; overflow: hidden; margin-bottom: 8px;">
                    <div class="timer-progress-fill" style="background: linear-gradient(90deg, #d4af37 0%, #10b981 100%); height: 100%; width: 0%; transition: width 1s linear;"></div>
                </div>
                <button type="button" onclick="PatientFlow.toggleExerciseTimer(this, ${ex.durationSec || 30})" class="btn-exercise-timer" data-running="false" data-remaining="${ex.durationSec || 30}" data-total="${ex.durationSec || 30}" style="width: 100%; background: linear-gradient(135deg, #d4af37 0%, #aa820a 100%); color: #0a0e14; border: none; padding: 8px 12px; border-radius: 6px; font-weight: bold; cursor: pointer; font-size: 0.88em;">
                    ⏱️ ابدأ مؤقت التمرين (${ex.duration})
                </button>
            </div>
        </div>
    `).join('');
}

// فتح نافذة التعريف بالكايروبراكتيك
function openChiropracticExplainerModal() {
    const modal = document.getElementById('chiropractic-explainer-modal');
    if (modal) {
        modal.style.display = 'flex';
    }
}

// إغلاق نافذة التعريف بالكايروبراكتيك
function closeChiropracticExplainerModal() {
    const modal = document.getElementById('chiropractic-explainer-modal');
    if (modal) {
        modal.style.display = 'none';
    }
}

// ==========================================================================
// إدارة تثبيت تطبيق الويب التقدمي (PWA) والمشاركة الشاملة (Install & Share Hub)
// ==========================================================================

function setupPwaInstallListener() {
    window.addEventListener('beforeinstallprompt', (e) => {
        e.preventDefault();
        deferredPwaPrompt = e;
        const pwaBanner = document.getElementById('pwa-install-banner');
        if (pwaBanner) pwaBanner.style.display = 'flex';
        
        const btnAndroid = document.getElementById('btn-trigger-android-pwa');
        if (btnAndroid) {
            btnAndroid.innerHTML = '<span>⬇️ تثبيت التطبيق بنقرة واحدة الآن (جاهز)</span>';
        }
    });
}

// الرابط الرسمي المعتمد للمشاركة
function getAppShareUrl() {
    if (window.location && window.location.protocol && window.location.protocol.startsWith('http')) {
        return window.location.href.split('#')[0];
    }
    // في حال التشغيل المحلي من ملف (file://) نستخدم الرابط الافتراضي للمركز
    return "https://wada3an-alam.com";
}

// فتح نافذة التثبيت والمشاركة الشاملة
function openAppInstallShareModal(defaultTab = 'install') {
    const modal = document.getElementById('app-install-share-modal');
    if (!modal) return;

    const shareUrl = getAppShareUrl();
    const linkInput = document.getElementById('share-link-input');
    if (linkInput) linkInput.value = shareUrl;

    const qrImg = document.getElementById('app-qr-image');
    if (qrImg) {
        qrImg.src = `https://api.qrserver.com/v1/create-qr-code/?size=180x180&data=${encodeURIComponent(shareUrl)}`;
    }

    // الكشف التلقائي عن النظام لإبراز البطاقة الأنسب
    const isIOS = /iPad|iPhone|iPod/.test(navigator.userAgent) && !window.MSStream;
    const isAndroid = /Android/.test(navigator.userAgent);
    const isFile = window.location.protocol === 'file:';

    const cardAndroid = document.getElementById('install-guide-android');
    const cardIOS = document.getElementById('install-guide-ios');
    const cardLocal = document.getElementById('install-guide-local');

    if (cardAndroid && cardIOS && cardLocal) {
        if (isIOS) {
            cardIOS.style.borderColor = 'var(--primary-gold)';
            cardIOS.style.background = 'rgba(212, 175, 55, 0.1)';
            cardAndroid.style.opacity = '0.7';
        } else if (isAndroid) {
            cardAndroid.style.borderColor = 'var(--primary-gold)';
            cardAndroid.style.background = 'rgba(212, 175, 55, 0.1)';
            cardIOS.style.opacity = '0.7';
        }
        
        if (isFile) {
            cardLocal.style.display = 'block';
        }
    }

    switchAppModalTab(defaultTab);
    modal.style.display = 'flex';
}

function closeAppInstallShareModal() {
    const modal = document.getElementById('app-install-share-modal');
    if (modal) modal.style.display = 'none';
}

// التحكم في قائمة الهيدر المنسدلة لشاشات الهواتف
function toggleMobileMenu() {
    const menu = document.getElementById('main-header-actions');
    const backdrop = document.getElementById('mobile-menu-backdrop');
    const icon = document.getElementById('hamburger-icon-char');
    if (!menu) return;

    if (menu.classList.contains('open')) {
        closeMobileMenu();
    } else {
        menu.classList.add('open');
        menu.style.display = 'grid';
        if (backdrop) backdrop.style.display = 'block';
        if (icon) icon.textContent = '✕';
    }
}

function closeMobileMenu() {
    const menu = document.getElementById('main-header-actions');
    const backdrop = document.getElementById('mobile-menu-backdrop');
    const icon = document.getElementById('hamburger-icon-char');
    if (menu) {
        menu.classList.remove('open');
        if (window.innerWidth <= 960) {
            menu.style.display = 'none';
        } else {
            menu.style.display = 'flex';
        }
    }
    if (backdrop) backdrop.style.display = 'none';
    if (icon) icon.textContent = '☰';
}

// التبديل بين تبويب التثبيت وتبويب المشاركة
function switchAppModalTab(tab) {
    const tabBtnInstall = document.getElementById('tab-btn-install');
    const tabBtnShare = document.getElementById('tab-btn-share');
    const contentInstall = document.getElementById('tab-content-install');
    const contentShare = document.getElementById('tab-content-share');

    if (!tabBtnInstall || !tabBtnShare || !contentInstall || !contentShare) return;

    if (tab === 'install') {
        tabBtnInstall.style.background = 'linear-gradient(135deg, rgba(212, 175, 55, 0.25) 0%, rgba(16, 185, 129, 0.2) 100%)';
        tabBtnInstall.style.borderColor = 'var(--primary-gold)';
        tabBtnInstall.style.color = '#fef08a';

        tabBtnShare.style.background = '#0f172a';
        tabBtnShare.style.borderColor = '#334155';
        tabBtnShare.style.color = '#94a3b8';

        contentInstall.style.display = 'block';
        contentShare.style.display = 'none';
    } else {
        tabBtnShare.style.background = 'linear-gradient(135deg, rgba(212, 175, 55, 0.25) 0%, rgba(16, 185, 129, 0.2) 100%)';
        tabBtnShare.style.borderColor = 'var(--primary-gold)';
        tabBtnShare.style.color = '#fef08a';

        tabBtnInstall.style.background = '#0f172a';
        tabBtnInstall.style.borderColor = '#334155';
        tabBtnInstall.style.color = '#94a3b8';

        contentInstall.style.display = 'none';
        contentShare.style.display = 'block';
    }
}

// تنفيذ التثبيت الفعلي
function triggerPwaInstall() {
    if (deferredPwaPrompt) {
        deferredPwaPrompt.prompt();
        deferredPwaPrompt.userChoice.then((choiceResult) => {
            if (choiceResult.outcome === 'accepted') {
                showToast('🎉 شكراً لتثبيت تطبيق وداعاً للألم على هاتفك!', 'success');
                const pwaBanner = document.getElementById('pwa-install-banner');
                if (pwaBanner) pwaBanner.style.display = 'none';
                closeAppInstallShareModal();
            }
            deferredPwaPrompt = null;
        });
    } else {
        const isIOS = /iPad|iPhone|iPod/.test(navigator.userAgent) && !window.MSStream;
        if (isIOS) {
            showToast('📱 لتثبيت التطبيق على الآيفون: اضغط زر المشاركة ⎋ ثم "إضافة إلى الشاشة الرئيسية" ➕', 'info');
            switchAppModalTab('install');
        } else {
            showToast('💡 من قائمة خيارات المتصفح (⋮)، اضغط "تثبيت التطبيق" أو "إضافة إلى الشاشة الرئيسية"', 'info');
        }
    }
}

function promptPwaInstall() {
    if (deferredPwaPrompt) {
        triggerPwaInstall();
    } else {
        openAppInstallShareModal('install');
    }
}

// نسخ رابط التطبيق للحافظة
function copyAppShareLink() {
    const url = getAppShareUrl();
    const shareText = `اكتشف سبب ألم مفاصلك وعمودك الفقري مجاناً عبر نظام الفحص الذكي في (وداعاً للألم - تقنية الكايروبراكتيك اليدوية):\n${url}`;

    if (navigator.clipboard && navigator.clipboard.writeText) {
        navigator.clipboard.writeText(url).then(() => {
            showToast('✅ تم نسخ رابط تطبيق وداعاً للألم للحافظة بنجاح!', 'success');
        }).catch(() => {
            prompt('انسخ رابط تطبيق وداعاً للألم:', url);
        });
    } else {
        prompt('انسخ رابط تطبيق وداعاً للألم:', url);
    }
}

// مشاركة التطبيق عبر واتساب
function shareViaWhatsApp() {
    const url = getAppShareUrl();
    const shareText = `🌿 أنصحك بتجربة نظام الفحص السريري الذكي وخطة الراحة الحركية في (وداعاً للألم - تقنية الكايروبراكتيك اليدوية 30 دقيقة):\n${url}\n\n📞 للاستفسار والتواصل المباشر مع المعالج: 0790360440`;
    const waUrl = `https://api.whatsapp.com/send?text=${encodeURIComponent(shareText)}`;
    window.open(waUrl, '_blank');
}

// مشاركة التطبيق عبر ميزة النظام الأصلية Web Share
function shareViaNative() {
    const url = getAppShareUrl();
    const shareData = {
        title: 'وداعاً للألم | Smart Check Pro 2.0',
        text: 'افحص موضع ألمك وتعرف على خطتك العلاجية والتمارين المخصصة مع وداعاً للألم (تقنية الكايروبراكتيك 30 دقيقة):',
        url: url
    };

    if (navigator.share && !window.location.protocol.startsWith('file')) {
        navigator.share(shareData).catch(() => {});
    } else {
        copyAppShareLink();
    }
}

// التنقل بين الخطوات
function goToStep(stepNum) {
    // إيقاف أي صوت محطة سابق فور الانتقال بين الخطوات لمنع أي تداخل
    if (typeof currentActiveStationAudio !== 'undefined' && currentActiveStationAudio) {
        try {
            currentActiveStationAudio.pause();
            currentActiveStationAudio.currentTime = 0;
        } catch (e) {}
        currentActiveStationAudio = null;
    }

    document.querySelectorAll('.app-step-section').forEach(s => s.style.display = 'none');
    document.querySelectorAll('.stepper-node').forEach(n => n.classList.remove('active', 'completed'));

    // إظهار قسم الخطوة المحددة بدقة (الخطوات 1 إلى 6 أصبحت مستقلة تماماً)
    const targetSection = document.getElementById(`step-section-${stepNum}`);
    if (targetSection) targetSection.style.display = 'block';

    for (let i = 1; i <= 6; i++) {
        const node = document.getElementById(`stepper-node-${i}`);
        if (node) {
            if (i < stepNum) node.classList.add('completed');
            if (i === stepNum) node.classList.add('active');
        }
    }

    // إذا دخل المراجع الخطوة 1 (المجسم)، إظهار شريط التوجيه فقط بدون تشغيل صوت مكرر
    if (stepNum === 1) {
        const guidanceBar = document.getElementById('welcome-audio-guidance-bar');
        if (guidanceBar) guidanceBar.style.display = 'flex';
        // ملاحظة: الصوت الترحيبي يُشغَّل مرة واحدة فقط من منطق بدء التطبيق (introPlayedOrAttempted guard)
    } else {
        // إيقاف أي صوت ترحيبي أو سابق فور مغادرة الخطوة 1
        stopAllActiveAudio();
    }

    // إذا دخل المراجع الخطوة 2 وكان النمط هو الطبيب الافتراضي، بدء الحوار فوراً
    if (stepNum === 2 && currentIntakeMode === 'chat') {
        syncDoctorSelectorUI();
        if (typeof clinicalDialogueState !== 'undefined' && clinicalDialogueState.step === 'init') {
            setTimeout(() => {
                initAiClinicalChat();
            }, 100);
        }
    }

    window.scrollTo({ top: 0, behavior: 'smooth' });
}

// تخطي الصوت الترحيبي في الخطوة 1 وإتاحة النقاط فوراً
function skipWelcomeAudioAndUnlockPoints() {
    stopAllActiveAudio();
    showToast('تم تخطي التوجيه الصوتي، انقر على مكان الألم على المجسم مباشرة 🎯', 'info');
}

// اختيار الطبيب الاستشاري المفضل للحوار (د. سارة / د. جمال / د. عمر)
function selectConsultantDoctor(voiceKey) {
    if (typeof Wada3anAiEngine === 'undefined') return;
    const persona = Wada3anAiEngine.selectDoctorPersona(voiceKey);
    syncDoctorSelectorUI();

    showToast(`تم اختيار ${persona.name} (${persona.title}) كطبيبك الاستشاري الحركي`, 'success');

    // إيقاف أي صوت نشط فوراً وتحديث الترويسة في حال كان الحوار مفتوحاً
    Wada3anAiEngine.stopSpeaking();
    const docHeaderBadge = document.querySelector('.doctor-welcome-presentation-card');
    if (docHeaderBadge) {
        initAiClinicalChat();
    }
}

// مزامنة حالة أزرار اختيار الطبيب في الواجهة
function syncDoctorSelectorUI() {
    if (typeof Wada3anAiEngine === 'undefined') return;
    const activeVoice = Wada3anAiEngine.getStudioVoiceForSession();
    const btnSarah = document.getElementById('btn-doc-sarah');
    const btnJamal = document.getElementById('btn-doc-jamal');
    const btnOmar = document.getElementById('btn-doc-omar');

    const updateBtn = (btn, isAct) => {
        if (!btn) return;
        if (isAct) {
            btn.style.background = 'rgba(56, 189, 248, 0.25)';
            btn.style.borderColor = '#38bdf8';
            btn.style.color = '#ffffff';
        } else {
            btn.style.background = '#1e293b';
            btn.style.borderColor = '#475569';
            btn.style.color = '#94a3b8';
        }
    };

    updateBtn(btnSarah, activeVoice === 'Aoede');
    updateBtn(btnJamal, activeVoice === 'Charon');
    updateBtn(btnOmar, activeVoice === 'Puck');
}

// إعادة ضبط لبدء فحص جديد
function resetToInitialState() {
    SmartDB.setCurrentSessionPatientId(null);
    activePatient = null;
    currentSelectedPoint = null;
    currentAssessmentData = null;

    document.querySelectorAll('.anatomy-hotspot').forEach(p => p.classList.remove('active'));
    const statusText = document.getElementById('selected-point-label');
    if (statusText) statusText.textContent = 'انقر على مكان الألم على المجسم';

    const searchInput = document.getElementById('smart-pain-search-input');
    if (searchInput) searchInput.value = '';

    const proceedBtn = document.getElementById('btn-goto-step2');
    if (proceedBtn) {
        proceedBtn.disabled = true;
        proceedBtn.style.opacity = '0.5';
    }

    if (typeof clinicalDialogueState !== 'undefined') {
        clinicalDialogueState.step = 'init';
        clinicalDialogueState.hasStartedWelcome = false;
        clinicalDialogueState.isStarting = false;
    }
    if (typeof Wada3anAiEngine !== 'undefined') {
        Wada3anAiEngine._currentSessionStudioVoice = null;
        Wada3anAiEngine.stopSpeaking();
    }

    switchAnatomyView('front');
    goToStep(1);
    showToast('تمت إعادة التهيئة لبدء فحص جديد', 'info');
}

// تبديل منظر المجسم
function switchAnatomyView(view) {
    const frontCont = document.getElementById('front-anatomy-container');
    const backCont = document.getElementById('back-anatomy-container');
    const btnFront = document.getElementById('btn-view-front');
    const btnBack = document.getElementById('btn-view-back');

    if (view === 'front') {
        if (frontCont) {
            frontCont.style.display = 'block';
            frontCont.classList.remove('is-hidden');
        }
        if (backCont) {
            backCont.style.display = 'none';
            backCont.classList.add('is-hidden');
        }
        if (btnFront) btnFront.classList.add('active');
        if (btnBack) btnBack.classList.remove('active');
        renderAnatomyPoints('front-anatomy-container', getFrontPoints());
    } else {
        if (frontCont) {
            frontCont.style.display = 'none';
            frontCont.classList.add('is-hidden');
        }
        if (backCont) {
            backCont.style.display = 'block';
            backCont.classList.remove('is-hidden');
        }
        if (btnFront) btnFront.classList.remove('active');
        if (btnBack) btnBack.classList.add('active');
        renderAnatomyPoints('back-anatomy-container', getBackPoints());
    }
}

// ==========================================================================
// ميزات ترقية الاحترافية السريرية (Smart Check Pro Clinical Suite v4.5)
// 1. شهادة إتمام البرنامج الفاخرة (Certificate of Completion)
// 2. ملف التقدم السريري الشامل للمعالج (Doctor Clinical Summary Dossier)
// 3. التذكيرات الذكية وإشعارات الويب المحلية (Web Notification Reminder)
// ==========================================================================

let activeCertificateData = null;
let activeDoctorSummaryData = null;

// فتح وتجهيز شهادة إتمام البرنامج الفاخرة
async function openCompletionCertificateModal(patientId) {
    try {
        let patient = null;
        const targetId = patientId || (typeof SmartDB !== 'undefined' ? SmartDB.getCurrentSessionPatientId() : null);
        
        if (targetId && typeof SmartDB !== 'undefined') {
            patient = await (SmartDB.getPatient ? SmartDB.getPatient(targetId) : null);
        }

        if (!patient && typeof activePatient !== 'undefined' && activePatient) {
            patient = activePatient;
        }

        if (!patient) {
            // بيانات احتياطية ذكية في حال استعراض الشهادة المباشر
            patient = {
                id: targetId || 'P-' + Math.floor(1000 + Math.random() * 9000),
                name: 'المراجع الكريم',
                phone: '',
                painLevel: 8,
                painAreaTitle: (currentSelectedPoint && currentSelectedPoint.title) ? currentSelectedPoint.title : 'العمود الفقري ومفاصل الجسم'
            };
        }

        let dailyLogs = [];
        if (targetId && typeof SmartDB !== 'undefined' && SmartDB.getPatientDailyLogs) {
            dailyLogs = await SmartDB.getPatientDailyLogs(targetId) || [];
        }

        let assessment = null;
        if (targetId && typeof SmartDB !== 'undefined' && SmartDB.getLatestAssessment) {
            assessment = await SmartDB.getLatestAssessment(targetId);
        }
        if (!assessment && currentAssessmentData) {
            assessment = currentAssessmentData;
        }

        const firstLog = dailyLogs.length > 0 ? dailyLogs[0] : null;
        const lastLog = dailyLogs.length > 0 ? dailyLogs[dailyLogs.length - 1] : null;

        // جلب ألم البداية من السجلات والتقييم الحقيقي حصراً
        const baselinePain = (assessment && typeof assessment.painSeverity === 'number' && !isNaN(assessment.painSeverity))
            ? assessment.painSeverity
            : (patient && typeof patient.painLevel === 'number' && !isNaN(patient.painLevel))
                ? patient.painLevel
                : (firstLog && typeof firstLog.painScore === 'number')
                    ? firstLog.painScore
                    : 0;

        let finalPain = 0;
        let painDrop = 0;
        let mobilityScore = 0;
        let complianceRate = Math.min(100, Math.round((dailyLogs.length / 7) * 100));

        if (dailyLogs.length > 0) {
            finalPain = (lastLog && typeof lastLog.painScore === 'number') ? lastLog.painScore : 0;
            if (baselinePain > 0) {
                painDrop = Math.max(0, Math.min(100, Math.round(((baselinePain - finalPain) / baselinePain) * 100)));
            } else {
                painDrop = (finalPain === 0) ? 100 : 0;
            }

            if (lastLog && typeof lastLog.mobilityRate === 'number') {
                mobilityScore = lastLog.mobilityRate;
            } else {
                let mobAcc = 0;
                dailyLogs.forEach(l => {
                    let dM = 50;
                    if (l.exercisesDone) dM += 20;
                    if (l.walkingDone) dM += 15;
                    if (l.goodPosture) dM += 10;
                    mobAcc += Math.min(100, dM);
                });
                mobilityScore = Math.round(mobAcc / dailyLogs.length);
            }
        }

        const certCode = `WADA3AN-CERT-${(patient.patientId || patient.id || 'P001').replace(/[^a-zA-Z0-9]/g, '').slice(-4).toUpperCase()}-${new Date().getFullYear()}`;
        const completionDate = new Date().toLocaleDateString('ar-EG', { year: 'numeric', month: 'long', day: 'numeric' });

        const painAreaTitle = resolvePainAreaTitle(patient, assessment, currentSelectedPoint);

        activeCertificateData = {
            patientName: patient.name,
            patientPhone: patient.phone,
            certCode,
            completionDate,
            painAreaTitle,
            painDrop,
            mobilityScore,
            complianceRate,
            baselinePain,
            finalPain
        };

        const certModal = document.getElementById('completion-certificate-modal');
        if (!certModal) {
            showToast('تعذر العثور على نافذة الشهادة في الصفحة', 'error');
            return;
        }

        const codeEl = document.getElementById('cert-code-display');
        const dateEl = document.getElementById('cert-date-display');
        const nameEl = document.getElementById('cert-patient-name');
        const areaEl = document.getElementById('cert-pain-area');
        const dropEl = document.getElementById('cert-pain-drop');
        const mobEl = document.getElementById('cert-mobility-gain');
        const compEl = document.getElementById('cert-compliance');

        if (codeEl) codeEl.textContent = certCode;
        if (dateEl) dateEl.textContent = `التاريخ: ${completionDate}`;
        if (nameEl) nameEl.textContent = patient.name;
        if (areaEl) areaEl.textContent = painAreaTitle;
        if (dropEl) dropEl.textContent = `${painDrop}%`;
        if (mobEl) mobEl.textContent = `${mobilityScore}%`;
        if (compEl) compEl.textContent = `${complianceRate}%`;

        certModal.style.display = 'flex';
        certModal.scrollTop = 0;
    } catch (e) {
        console.error('Certificate generation error:', e);
        showToast('حدث خطأ أثناء إعداد الشهادة الرقمية', 'error');
    }
}

function closeCompletionCertificateModal() {
    const modal = document.getElementById('completion-certificate-modal');
    if (modal) modal.style.display = 'none';
}

function printCertificate() {
    window.print();
}

function shareCertificateToWhatsApp() {
    if (!activeCertificateData) return;
    const text = `🏆 *وسام الانتصار على الألم والتعافي الحركي - وداعاً للألم للكايروبراكتيك*\n\n` +
        `👤 *المراجع البطل:* ${activeCertificateData.patientName}\n` +
        `🎯 *موضع الشكوى والتعافي:* ${activeCertificateData.painAreaTitle}\n` +
        `📉 *نسبة التراجع وتسكين الألم:* ${activeCertificateData.painDrop}% (من ${activeCertificateData.baselinePain}/10 إلى ${activeCertificateData.finalPain}/10)\n` +
        `🤸‍♂️ *استعادة المدى الحركي والمرونة:* ${activeCertificateData.mobilityScore}%\n` +
        `🏅 *عزيمة الالتزام بالبرنامج:* ${activeCertificateData.complianceRate || 100}%\n` +
        `📅 *تاريخ التتويج السريري:* ${activeCertificateData.completionDate}\n` +
        `📜 *رقم وسام الاعتماد السريري:* ${activeCertificateData.certCode}\n` +
        `🏛️ *الجهة المشرفة:* «وداعاً للألم» للكايروبراكتيك - عمان (خلدا) | بإشراف المعالج جمال قبها\n\n` +
        `✨ *«أنا انتصرت على ألمي واستعدت حركتي بفضل الله!»*\n` +
        `أتممت بنجاح كامل متطلبات برنامج التأهيل الحركي الذكي (7 أيام) وأرغب في حجز جلسة كايروبراكتيك سريرية في المركز لتثبيت التعافي والحفاظ على سلامة العمود الفقري.`;

    const url = `https://wa.me/${CLINIC_WHATSAPP_NUMBER}?text=${encodeURIComponent(text)}`;
    window.open(url, '_blank');
}

// تصدير وعرض الملف السريري الشامل للمعالج (Doctor Clinical Summary)
async function exportClinicalSummaryForDoctor(patientId) {
    try {
        let patient = null;
        const targetId = patientId || (typeof SmartDB !== 'undefined' ? SmartDB.getCurrentSessionPatientId() : null);
        if (targetId && typeof SmartDB !== 'undefined') {
            patient = await (SmartDB.getPatient ? SmartDB.getPatient(targetId) : null);
        }
        if (!patient && typeof activePatient !== 'undefined' && activePatient) {
            patient = activePatient;
        }
        if (!patient) {
            patient = {
                id: targetId || 'P001',
                name: 'المراجع الكريم',
                phone: '',
                painLevel: 7,
                painAreaTitle: currentSelectedPoint?.title || 'العمود الفقري'
            };
        }

        let dailyLogs = [];
        if (targetId && typeof SmartDB !== 'undefined' && SmartDB.getPatientDailyLogs) {
            dailyLogs = await SmartDB.getPatientDailyLogs(targetId) || [];
        }
        // استخراج شدة الألم الأساسية من مصادر متعددة بالأولوية
        const baselinePain = patient.painLevel ||
            patient.latestAssessment?.painSeverity ||
            (typeof currentAssessmentData !== 'undefined' && currentAssessmentData?.painSeverity) ||
            (typeof currentAssessmentData !== 'undefined' && currentAssessmentData?.internalPainScore) ||
            null; // null = غير محدد (لا نعرض 7 افتراضياً)
        const lastLog = dailyLogs.length > 0 ? dailyLogs[dailyLogs.length - 1] : null;
        const currentPain = lastLog ? (typeof lastLog.painScore === 'number' ? lastLog.painScore : (baselinePain || 7)) : (baselinePain || 7);
        const painDrop = baselinePain ? Math.max(0, Math.min(100, Math.round(((baselinePain - currentPain) / Math.max(1, baselinePain)) * 100))) : 0;
        const painArea = resolvePainAreaTitle(patient, patient.latestAssessment || currentAssessmentData, currentSelectedPoint);

        // تجميع سجل الأيام السبعة
        const logsSummary = [];
        for (let i = 1; i <= 7; i++) {
            const l = dailyLogs.find(x => x.sessionNumber === i);
            if (l) {
                logsSummary.push(`اليوم ${i}: ألم ${l.painScore}/10 | حركة ${l.mobilityRate || 75}% | نوم ${l.sleepRate || 75}%`);
            }
        }

        const assessment = patient.latestAssessment || (typeof currentAssessmentData !== 'undefined' ? currentAssessmentData : {});
        const diagTitle = assessment.primaryDiagnosis || patient.primaryDiagnosis || 'متلازمة خلل ميكانيكي حركي';
        const rootLevel = assessment.rootLevel || '';
        const redFlags = assessment.isRedFlag ? '⚠️ تم رصد مؤشرات حذر سريرية' : '✅ آمن تماماً للتقويم اليدوي بالكايروبراكتيك (Cleared)';

        // استخراج العمر والجنس من مصادر متعددة
        const patientAge = patient.age || assessment.age ||
            (typeof currentAssessmentData !== 'undefined' && currentAssessmentData?.age) ||
            (typeof clinicalDialogueState !== 'undefined' && clinicalDialogueState?.patientVitals?.age) ||
            null;

        let patientGenderRaw = patient.gender || assessment.gender ||
            (typeof currentAssessmentData !== 'undefined' && currentAssessmentData?.gender) ||
            (typeof clinicalDialogueState !== 'undefined' && clinicalDialogueState?.patientVitals?.gender) ||
            '';
        // تطبيع قيمة الجنس
        let patientGenderDisplay;
        if (patientGenderRaw === 'female' || patientGenderRaw === 'أنثى' || patientGenderRaw === 'انثى') {
            patientGenderDisplay = 'أنثى';
        } else if (patientGenderRaw === 'male' || patientGenderRaw === 'ذكر') {
            patientGenderDisplay = 'ذكر';
        } else {
            // محاولة استنتاج الجنس من الاسم
            const pName = patient.name || '';
            const femaleNames = /^(ميس|سارة|لينا|منى|رنا|هند|نور|ريم|دنيا|إيمان|ايمان|فاطمة|زينب|مريم|يسرى|رنده|رندة|ديما|لارا|لمى|لمياء|علا|عبير|غادة|وفاء|سمر|سمية|رغد|أميرة|أريج|ربى|ناديا|ليلى|هيفاء|سوزان|روان|بيان|شيرين|مها|دلال|نادين|تقى|يارا|ياسمين|جنى|أمل|حلا|إسراء|رانيا|ريهام|ولاء|وئام|بسمة|حنين|نادية|سعاد|لجين|شذى|نوف|ألاء|دانا|زهراء|منال|هناء|شهد)/i;
            patientGenderDisplay = femaleNames.test(pName.trim()) ? 'أنثى' : (pName ? 'ذكر' : 'غير محدد');
        }

        activeDoctorSummaryData = {
            patientName: patient.name,
            patientPhone: patient.phone,
            patientAge: patientAge || 'غير محدد',
            patientGender: patientGenderDisplay,
            painArea,
            diagTitle,
            rootLevel,
            redFlags,
            baselinePain,
            currentPain,
            painDrop,
            completedDays: dailyLogs.length,
            logsSummary,
            dailyLogs,
            createdDate: new Date().toLocaleDateString('ar-EG', { year: 'numeric', month: 'long', day: 'numeric', hour: '2-digit', minute: '2-digit' })
        };

        const modal = document.getElementById('doctor-summary-modal');
        const container = document.getElementById('doctor-summary-content');
        if (!modal || !container) return;

        container.innerHTML = `
            <div style="border-bottom: 2px solid #38bdf8; padding-bottom: 14px; margin-bottom: 18px; display: flex; justify-content: space-between; align-items: center; flex-wrap: wrap; gap: 10px;">
                <div>
                    <h2 style="color: #38bdf8; margin: 0 0 4px 0; font-size: 1.35em;">الملخص السريري لتحويل المريض (Clinical Referral Dossier)</h2>
                    <div style="color: #94a3b8; font-size: 0.85em;">مركز وداعاً للألم للكايروبراكتيك | التاريخ: ${activeDoctorSummaryData.createdDate}</div>
                </div>
                <div style="background: rgba(56, 189, 248, 0.15); border: 1px solid #38bdf8; color: #38bdf8; padding: 6px 14px; border-radius: 8px; font-weight: bold; font-size: 0.88em;">
                    ملف مراجع رقم: #${(patientId || '000').substring(0,8)}
                </div>
            </div>

            <!-- بطاقة بيانات المريض الأساسية -->
            <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(180px, 1fr)); gap: 12px; background: #111827; padding: 14px; border-radius: 10px; margin-bottom: 16px; border: 1px solid #1e293b;">
                <div><span style="color: #94a3b8; font-size: 0.82em;">الاسم الكامل:</span> <div style="color: #ffffff; font-weight: bold;">${patient.name}</div></div>
                <div><span style="color: #94a3b8; font-size: 0.82em;">رقم الهاتف:</span> <div style="color: #ffffff; font-weight: bold; font-family: monospace;">${patient.phone}</div></div>
                <div><span style="color: #94a3b8; font-size: 0.82em;">العمر / الجنس:</span> <div style="color: #ffffff; font-weight: bold;">${activeDoctorSummaryData.patientAge} سنة | ${activeDoctorSummaryData.patientGender}</div></div>
                <div><span style="color: #94a3b8; font-size: 0.82em;">موضع الشكوى:</span> <div style="color: var(--primary-gold); font-weight: bold;">${painArea}</div></div>
            </div>

            <!-- التشخيص السريري والمستوى الشوكي -->
            <div style="background: #111827; padding: 14px; border-radius: 10px; margin-bottom: 16px; border-right: 4px solid #38bdf8;">
                <div style="color: #38bdf8; font-weight: bold; font-size: 0.95em; margin-bottom: 4px;">🎯 التشخيص الأرجح ومستوى الضغط:</div>
                <div style="color: #ffffff; font-size: 1.05em; font-weight: bold;">${diagTitle}</div>
                ${rootLevel ? `<div style="color: #94a3b8; font-size: 0.85em; margin-top: 4px;">المستوى العصبي المستهدف: <strong style="color: #fef08a;">${rootLevel}</strong></div>` : ''}
                <div style="color: #10b981; font-size: 0.82em; margin-top: 4px;">فحص الأمان السريري: ${redFlags}</div>
            </div>

            <!-- مؤشرات التعافي الحركي ونتائج الأيام السبعة -->
            <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(180px, 1fr)); gap: 12px; margin-bottom: 18px;">
                <div style="background: rgba(16, 185, 129, 0.1); border: 1px solid #10b981; border-radius: 8px; padding: 12px; text-align: center;">
                    <div style="font-size: 1.8em; font-weight: bold; color: #10b981;">${painDrop}%</div>
                    <div style="color: #cbd5e1; font-size: 0.78em;">تراجع شدة الألم</div>
                    <div style="color: #94a3b8; font-size: 0.72em;">(من ${baselinePain}/10 إلى ${currentPain}/10)</div>
                </div>
                <div style="background: rgba(56, 189, 248, 0.1); border: 1px solid #38bdf8; border-radius: 8px; padding: 12px; text-align: center;">
                    <div style="font-size: 1.8em; font-weight: bold; color: #38bdf8;">${activeDoctorSummaryData.completedDays} من 7</div>
                    <div style="color: #cbd5e1; font-size: 0.78em;">الجلسات المؤداة بنجاح</div>
                    <div style="color: #94a3b8; font-size: 0.72em;">التزام تأهيلي مستمر</div>
                </div>
            </div>

            <!-- سجل متابعة الأيام السبعة التفصيلي -->
            <div style="background: #111827; padding: 14px; border-radius: 10px; margin-bottom: 16px;">
                <div style="color: var(--primary-gold); font-weight: bold; font-size: 0.9em; margin-bottom: 8px;">📈 التدرج اليومي لمقياس الألم (VAS) والمدى الحركي:</div>
                ${logsSummary.length > 0 ? `
                    <ul style="color: #cbd5e1; font-size: 0.85em; margin: 0; padding-right: 20px; line-height: 1.8;">
                        ${logsSummary.map(s => `<li>${s}</li>`).join('')}
                    </ul>
                ` : `<div style="color: #fef08a; background: rgba(212, 175, 55, 0.1); border: 1px dashed var(--primary-gold); padding: 12px; border-radius: 8px; font-size: 0.88em; line-height: 1.6;">🌱 <strong>المريض في الجلسة الأولى (بداية خطة التعافي والتأهيل المنزلي):</strong> تم رصد القياس السريري المبدئي (Baseline Pain: ${baselinePain}/10) لمنطقة (${painArea})، وهو مهيأ لبدء تمارين اليوم الأول وبانتظار أول تقييم يومي للمتابعة.</div>`}
            </div>

            <!-- توجيهات جلسة المعالج اليدوية في جلسة التقويم -->
            <div style="background: rgba(212, 175, 55, 0.08); border: 1px solid var(--primary-gold); padding: 14px; border-radius: 10px;">
                <div style="color: var(--primary-gold); font-weight: bold; font-size: 0.9em; margin-bottom: 6px;">👐 خطة التدخل اليدوي الموصى بها للمعالج جمال:</div>
                <p style="color: #e2e8f0; font-size: 0.85em; line-height: 1.6; margin: 0;">
                    ${logsSummary.length > 0 
                        ? `المريض أبدى استجابة حركية بنسبة ${painDrop}% مع التمارين المنزلية، وهو جاهز حالياً لجلسة <strong>تفريغ ضغط الفقرات بالكايروبراكتيك (Chiropractic Adjustment)</strong> وفك التشنج الليفي العميق لتثبيت النتائج ومنع الانتكاس.`
                        : `المريض في مرحلة تسكين الألم الحاد والبدء ببرنامج التعافي لمنطقة (${painArea}) بمستوى ألم مبدئي (${baselinePain}/10). يُوصى بالبدء بتمارين التليين والتفريغ المقررة لليوم الأول مع إمكانية خضوعه لجلسة <strong>تقويم كايروبراكتيك وتفريغ يدوي (Manual Decompression)</strong> لإزالة الضغط عن الأعصاب والمفاصل فوراً.`}
                </p>
            </div>
        `;

        modal.style.display = 'flex';
    } catch (e) {
        console.error('Doctor summary export error:', e);
        showToast('حدث خطأ أثناء إنشاء الملخص السريري', 'error');
    }
}

function closeDoctorSummaryModal() {
    const modal = document.getElementById('doctor-summary-modal');
    if (modal) modal.style.display = 'none';
}

function sendDoctorSummaryWhatsApp() {
    if (!activeDoctorSummaryData) return;
    const d = activeDoctorSummaryData;

    const logsText = d.logsSummary.length > 0 ? d.logsSummary.join('\n') : 'لا توجد جلسات مسجلة بعد';

    const message = `*📋 تقرير التقدم السريري للمراجع - وداعاً للألم*\n` +
        `----------------------------------------\n` +
        `👤 *بيانات المريض:*\n` +
        `• الاسم: ${d.patientName}\n` +
        `• الهاتف: ${d.patientPhone}\n` +
        `• العمر/الجنس: ${d.patientAge} سنة | ${d.patientGender}\n` +
        `• موضع الشكوى: ${d.painArea}\n\n` +
        `🔬 *التشخيص السريري الأرجح:*\n` +
        `• التشخيص: ${d.diagTitle}\n` +
        (d.rootLevel ? `• المستوى العصبي: ${d.rootLevel}\n` : '') +
        `• حالة الأمان: ${d.redFlags}\n\n` +
        `📊 *مؤشرات التعافي خلال الـ 7 أيام:*\n` +
        `• ألم البداية: ${d.baselinePain}/10\n` +
        `• الألم الحالي: ${d.currentPain}/10\n` +
        `• نسبة التحسن الإجمالية: ${d.painDrop}%\n` +
        `• الجلسات المنجزة: ${d.completedDays} من 7\n\n` +
        `📈 *سجل المتابعة اليومي (VAS):*\n${logsText}\n\n` +
        `👐 *توصية المتابعة السريرية:*\n` +
        `المراجع جاهز الآن لجلسة الكايروبراكتيك السريرية في مركز وداعاً للألم لتفريغ ضغط الفقرات نهائياً.\n` +
        `----------------------------------------\n` +
        `التاريخ: ${d.createdDate}`;

    const url = `https://wa.me/${CLINIC_WHATSAPP_NUMBER}?text=${encodeURIComponent(message)}`;
    window.open(url, '_blank');
}

// بنر التذكير اليومي الذكي للجلسات
function getNotificationReminderBannerHTML(patientId) {
    const isGranted = (typeof Notification !== 'undefined' && Notification.permission === 'granted');
    const isEnabled = localStorage.getItem('scp_daily_reminder_enabled') === 'true';

    return `
        <div id="notification-reminder-banner" class="no-print" style="background: linear-gradient(135deg, rgba(56, 189, 248, 0.1) 0%, rgba(15, 23, 42, 0.95) 100%); border: 1.5px solid ${isEnabled && isGranted ? '#10b981' : '#38bdf8'}; border-radius: 12px; padding: 14px 18px; margin-bottom: 20px; display: flex; justify-content: space-between; align-items: center; flex-wrap: wrap; gap: 12px; box-shadow: 0 4px 20px rgba(0,0,0,0.3);">
            <div style="display: flex; align-items: center; gap: 10px; flex: 1; min-width: 250px;">
                <span style="font-size: 1.6em;">🔔</span>
                <div>
                    <div style="color: ${isEnabled && isGranted ? '#10b981' : '#38bdf8'}; font-weight: bold; font-size: 0.96em;">
                        ${isEnabled && isGranted ? '✓ تذكيرات الجلسات اليومية مفعلة بنجاح' : 'تفعيل التذكير اليومي الذكي للجلسات'}
                    </div>
                    <div style="color: #cbd5e1; font-size: 0.82em; margin-top: 2px;">
                        ${isEnabled && isGranted ? 'ستتلقى إشعاراً ذكياً على جهازك فور حلول موعد جلستك التالية لضمان عدم تفويت التمارين.' : 'احصل على تنبيه تلقائي على جهازك عند انتهاء العداد لفتح الجلسة التالية دون الحاجة لتذكر الموعد.'}
                    </div>
                </div>
            </div>
            <div>
                <button type="button" id="btn-toggle-reminder" onclick="setupDailyNotificationReminder('${patientId}')" style="background: ${isEnabled && isGranted ? '#10b981' : 'linear-gradient(135deg, #38bdf8 0%, #0284c7 100%)'}; color: #0a0e14; border: none; padding: 9px 18px; border-radius: 8px; font-weight: bold; font-size: 0.88em; cursor: pointer; transition: all 0.2s;">
                    ${isEnabled && isGranted ? '✅ التذكير مفعل' : '🔔 تفعيل التنبيهات'}
                </button>
            </div>
        </div>
    `;
}

// طلب صلاحيات الإشعارات وتفعيلها للمريض
async function setupDailyNotificationReminder(patientId) {
    if (!('Notification' in window)) {
        showToast('متصفحك لا يدعم الإشعارات المباشرة، يرجى متابعة الموعد عبر مؤقت الصفحة.', 'info');
        return;
    }

    try {
        let permission = Notification.permission;
        if (permission !== 'granted' && permission !== 'denied') {
            permission = await Notification.requestPermission();
        }

        if (permission === 'granted') {
            localStorage.setItem('scp_daily_reminder_enabled', 'true');
            const btn = document.getElementById('btn-toggle-reminder');
            if (btn) {
                btn.textContent = '✅ التذكير مفعل';
                btn.style.background = '#10b981';
            }

            // إرسال إشعار ترحيبي فوري للتأكيد للمريض
            new Notification('وداعاً للألم - تم تفعيل التذكيرات 🌿', {
                body: 'مرحباً بك! سنقوم بإشعارك تلقائياً عند حلول موعد جلستك العلاجية التالية.',
                icon: 'assets/logo.png',
                badge: 'assets/logo.png'
            });

            showToast('🎉 تم تفعيل التذكير اليومي بنجاح!', 'success');
        } else {
            showToast('تم رفض إذن الإشعارات من إعدادات المتصفح.', 'info');
        }
    } catch (e) {
        console.error('Notification setup error:', e);
        showToast('تعذر ضبط الإشعارات، يرجى التحقق من إعدادات جهازك.', 'info');
    }
}

// إطلاق إشعار للمريض عند فتح الجلسة التالية
function triggerSessionReadyNotification(patientName = '') {
    if (typeof Notification !== 'undefined' && Notification.permission === 'granted' && localStorage.getItem('scp_daily_reminder_enabled') === 'true') {
        new Notification('وداعاً للألم - حان موعد جلستك اليومية! 🏋️‍♂️', {
            body: `مرحباً ${patientName || 'عزيزي المراجع'}، تمارين اليوم الجديد أصبحت جاهزة للتطبيق. التزم بتفريغ الضغط الآن.`,
            icon: 'assets/logo.png'
        });
    }
}

// فتح نافذة الترحيب والدليل التعريفي للأداة
function openWelcomeTourModal() {
    const modal = document.getElementById('welcome-tour-modal') || document.getElementById('disclaimer-modal');
    if (modal) modal.style.display = 'flex';
}

// تشغيل الترحيب الصوتي تلقائياً لمرة واحدة فقط لكل زيارة أو استخدام جديد
function triggerAutoWelcomeAudio() {
    try {
        if (sessionStorage.getItem('scp_welcome_audio_played') === 'true') {
            return;
        }
        sessionStorage.setItem('scp_welcome_audio_played', 'true');
        window.introPlayedOrAttempted = true;

        if (typeof Wada3anAiEngine !== 'undefined') {
            Wada3anAiEngine.unlockAudio();
            Wada3anAiEngine.playIntroAudioGuide();
        }
    } catch (e) {
        console.warn('Auto welcome audio notice:', e);
    }
}

// إقرار الترحيب والتنبيه الطبي للمشترك الجديد
function acceptWelcomeTourModal() {
    localStorage.setItem('smart_welcome_tour_accepted', 'true');
    localStorage.setItem('smart_disclaimer_accepted', 'true');
    const modal = document.getElementById('welcome-tour-modal') || document.getElementById('disclaimer-modal');
    if (modal) modal.style.display = 'none';

    try {
        if (typeof Wada3anAiEngine !== 'undefined') {
            Wada3anAiEngine.unlockAudio();
        }
        if (sessionStorage.getItem('scp_welcome_audio_played') !== 'true') {
            triggerAutoWelcomeAudio();
        }
    } catch (e) {}
}

function acceptMedicalDisclaimer() {
    acceptWelcomeTourModal();
}

// تهيئة التطبيق والـ PWA
document.addEventListener('DOMContentLoaded', async () => {
    await SmartDB.openDB();

    if (window.location.protocol.startsWith('http') && 'serviceWorker' in navigator) {
        navigator.serviceWorker.register('sw.js').catch(() => {});
    }


    setupPwaInstallListener();

    if (sessionStorage.getItem('just_refreshed_toast') === 'true') {
        sessionStorage.removeItem('just_refreshed_toast');
        setTimeout(() => {
            showToast('✅ تم تنشيط وتحديث التطبيق بنجاح! أنت الآن على أحدث نسخة من التمارين والبيانات.', 'success');
        }, 350);
    }

    if (localStorage.getItem('smart_welcome_tour_accepted') !== 'true' && localStorage.getItem('smart_disclaimer_accepted') !== 'true') {
        openWelcomeTourModal();
    }

    switchAnatomyView('front');
    renderRedFlags();

    // الاستماع الفوري لتحديثات التوقيت من لوحة الإدارة
    window.addEventListener('storage', (e) => {
        if (e.key === 'countdownUpdated') {
            const savedPatientId = SmartDB.getCurrentSessionPatientId();
            if (savedPatientId) {
                loadPatientRecoveryDashboard(savedPatientId);
            }
        }
    });

    // إظهار أزرار الإدارة حصرياً في حال توفر صلاحيات الأدمن
    if (typeof isUserAdmin === 'function' && isUserAdmin()) {
        const adminBtnText = document.getElementById('btn-header-text-editor');
        if (adminBtnText) adminBtnText.style.display = 'inline-flex';
        const adminBtnStudio = document.getElementById('btn-admin-gallery-studio');
        if (adminBtnStudio) adminBtnStudio.style.display = 'inline-flex';
    }

    // إدراج قسم التواصل والترويج الدائم
    const bottomContainer = document.getElementById('permanent-bottom-section');
    if (bottomContainer) {
        bottomContainer.innerHTML = getPromotionalContactHubHTML();
    }

    const savedPatientId = SmartDB.getCurrentSessionPatientId();
    if (savedPatientId) {
        const p = await SmartDB.getPatient(savedPatientId);
        if (p) {
            loadPatientRecoveryDashboard(savedPatientId);
            return;
        }
    }

    goToStep(1);

    // تشغيل الصوت الترحيبي تلقائياً لمرة واحدة فقط لكل زيارة أو استخدام جديد
    if (sessionStorage.getItem('scp_welcome_audio_played') !== 'true') {
        const isModalOpen = (localStorage.getItem('smart_welcome_tour_accepted') !== 'true' && localStorage.getItem('smart_disclaimer_accepted') !== 'true');
        if (!isModalOpen) {
            setTimeout(() => {
                if (sessionStorage.getItem('scp_welcome_audio_played') !== 'true') {
                    triggerAutoWelcomeAudio();
                }
            }, 600);
        }
    }

    // استماع لأول تفاعل لفك قيود المتصفحات وتشغيل الترحيب تلقائياً لمرة واحدة في حال حظره المتصفح
    window.handleFirstUserInteractionForAudio = (e) => {
        if (window.handleFirstUserInteractionForAudio) {
            window.removeEventListener('pointerdown', window.handleFirstUserInteractionForAudio);
            window.removeEventListener('touchstart', window.handleFirstUserInteractionForAudio);
            window.removeEventListener('click', window.handleFirstUserInteractionForAudio);
            window.handleFirstUserInteractionForAudio = null;
        }

        if (typeof Wada3anAiEngine !== 'undefined') {
            Wada3anAiEngine.unlockAudio();
        }

        // إذا كانت النقرة على نقطة ألم أو داخل مجسم الجسم، يُحظر تشغيل الصوت الترحيبي قطعياً!
        if (e && e.target && (e.target.closest('.anatomy-hotspot') || e.target.closest('#anatomy-container') || e.target.closest('.btn-pain-point'))) {
            try {
                sessionStorage.setItem('scp_welcome_audio_played', 'true');
            } catch (err) {}
            window.introPlayedOrAttempted = true;
            stopAllActiveAudio();
            return;
        }

        // تشغيل الترحيب تلقائياً لمرة واحدة فقط إذا لم يكن قد عمل مسبقاً
        if (sessionStorage.getItem('scp_welcome_audio_played') !== 'true') {
            triggerAutoWelcomeAudio();
        }
    };
    window.addEventListener('pointerdown', window.handleFirstUserInteractionForAudio, { once: true, passive: true });
    window.addEventListener('touchstart', window.handleFirstUserInteractionForAudio, { once: true, passive: true });
    window.addEventListener('click', window.handleFirstUserInteractionForAudio, { once: true, passive: true });
});

// وظيفة الإدخال الصوتي التفاعلي (Web Speech-to-Text API)
let clinicalSpeechRecognition = null;
let isVoiceRecordingActive = false;

function toggleVoiceSpeechInput() {
    const btn = document.getElementById('btn-voice-input');
    const icon = document.getElementById('voice-icon');
    const statusText = document.getElementById('voice-status-text');
    const textarea = document.getElementById('patient-condition-notes');

    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SpeechRecognition) {
        showToast('💡 للتحدث بصوتك: انقر على ميكروفون كيبورد هاتفك 🎙️ بجانب المسافة وسيكتب كلامك فوراً!', 'info');
        if (textarea) {
            textarea.focus();
            textarea.placeholder = '🎙️ تحدث عبر ميكروفون كيبورد هاتفك أو اكتب وصفك هنا...';
        }
        return;
    }

    if (isVoiceRecordingActive && clinicalSpeechRecognition) {
        clinicalSpeechRecognition.stop();
        isVoiceRecordingActive = false;
        if (btn) {
            btn.style.background = 'rgba(56, 189, 248, 0.15)';
            btn.style.borderColor = '#38bdf8';
            btn.style.color = '#38bdf8';
        }
        if (icon) icon.textContent = '🎤';
        if (statusText) statusText.textContent = 'تحدث صوتياً (إملاء فوري)';
        showToast('تم إيقاف التسجيل الصوتي', 'info');
        return;
    }

    try {
        clinicalSpeechRecognition = new SpeechRecognition();
        clinicalSpeechRecognition.lang = 'ar-JO'; // العربية (الأردن / بلاد الشام) مع دعم العربية الفصحى
        clinicalSpeechRecognition.interimResults = true;
        clinicalSpeechRecognition.continuous = false;

        clinicalSpeechRecognition.onstart = () => {
            isVoiceRecordingActive = true;
            if (btn) {
                btn.style.background = 'rgba(239, 68, 68, 0.2)';
                btn.style.borderColor = '#ef4444';
                btn.style.color = '#fca5a5';
            }
            if (icon) icon.textContent = '🔴';
            if (statusText) statusText.textContent = 'جاري الاستماع إليك... تحدث الآن';
            showToast('تحدث الآن بوضوح، صف ما تشعر به...', 'info');
        };

        let existingTextBeforeRecording = textarea ? textarea.value.trim() : '';

        clinicalSpeechRecognition.onresult = (event) => {
            let fullSpeechText = '';
            for (let i = 0; i < event.results.length; ++i) {
                fullSpeechText += event.results[i][0].transcript;
            }
            if (textarea && fullSpeechText.trim()) {
                const combined = existingTextBeforeRecording 
                    ? `${existingTextBeforeRecording} ${fullSpeechText.trim()}`
                    : fullSpeechText.trim();
                textarea.value = combined;
                textarea.style.borderColor = '#10b981';
                setTimeout(() => { textarea.style.borderColor = '#334155'; }, 1000);
            }
        };

        clinicalSpeechRecognition.onerror = (e) => {
            console.warn('Speech recognition error:', e.error);
            isVoiceRecordingActive = false;
            if (btn) {
                btn.style.background = 'rgba(56, 189, 248, 0.15)';
                btn.style.borderColor = '#38bdf8';
                btn.style.color = '#38bdf8';
            }
            if (icon) icon.textContent = '🎤';
            if (statusText) statusText.textContent = 'تحدث صوتياً (إملاء فوري)';

            if (e.error === 'not-allowed') {
                showToast('يرجى السماح بصلاحية الميكروفون من إعدادات المتصفح لاستخدام الإملاء الصوتي.', 'error');
            } else if (e.error === 'no-speech') {
                showToast('لم يتم التقاط كلمات واضحة، يرجى إعادة المحاولة أو الكتابة في الحقل مباشرة.', 'info');
            } else if (e.error === 'audio-capture') {
                showToast('لم يتم العثور على ميكروفون متصل، يمكنك الكتابة في الحقل مباشرة.', 'info');
            } else {
                showToast('تعذر التقاط الصوت، يمكنك الكتابة في الحقل مباشرة.', 'info');
            }
        };

        clinicalSpeechRecognition.onend = () => {
            isVoiceRecordingActive = false;
            const hasText = textarea && textarea.value.trim().length > 0;
            if (btn) {
                btn.style.background = hasText ? 'rgba(16, 185, 129, 0.2)' : 'rgba(56, 189, 248, 0.15)';
                btn.style.borderColor = hasText ? '#10b981' : '#38bdf8';
                btn.style.color = hasText ? '#6ee7b7' : '#38bdf8';
            }
            if (icon) icon.textContent = hasText ? '✅' : '🎤';
            if (statusText) statusText.textContent = hasText ? 'تم إدراج حديثك في المربع أدناه' : 'تحدث صوتياً (إملاء فوري)';
            if (hasText) {
                showToast('✅ تم تدوين حديثك بنجاح في خانة الوصف بالأسفل!', 'success');
            }
            setTimeout(() => {
                if (btn) {
                    btn.style.background = 'rgba(56, 189, 248, 0.15)';
                    btn.style.borderColor = '#38bdf8';
                    btn.style.color = '#38bdf8';
                }
                if (icon) icon.textContent = '🎤';
                if (statusText) statusText.textContent = 'تحدث صوتياً (إملاء فوري)';
            }, 3500);
        };

        // طلب إذن الميكروفون صراحة وضمان الجاهزية
        if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
            navigator.mediaDevices.getUserMedia({ audio: true }).then(() => {
                clinicalSpeechRecognition.start();
            }).catch(permErr => {
                console.warn('Microphone permission denied:', permErr);
                showToast('يرجى السماح بصلاحية الميكروفون من أيقونة القفل أعلى المتصفح.', 'error');
            });
        } else {
            clinicalSpeechRecognition.start();
        }
    } catch (err) {
        console.warn('Failed to start speech recognition:', err);
        showToast('يرجى السماح بصلاحية الميكروفون لاستخدام الإملاء الصوتي.', 'error');
    }
}

// =========================================================================
// محرك العيادة الافتراضية الذكية ومحادثة الطبيب الافتراضي (AI Conversational Intake)
// =========================================================================

// التحقق الموثوق من صحة رقم الهاتف ومكافحة الأرقام الوهمية أو العشوائية
function isValidPhoneNumber(phone) {
    if (!phone) return false;
    const clean = String(phone).replace(/[\s\-\(\)\.]/g, '');

    // 0. يجب أن يتكون من أرقام فقط (مع علامة + اختيارية في البداية)
    if (!/^\+?\d+$/.test(clean)) return false;

    const digitsOnly = clean.replace(/^\+/, '');
    if (digitsOnly.length < 8 || digitsOnly.length > 16) return false;

    // رفض التكرار المبتذل للأرقام المتتالية في أي جزء (مثل 0000000 أو 1111111 أو 9999999)
    if (/(\d)\1{5,}/.test(digitsOnly)) return false;

    // رفض المتتاليات العشوائية الساذجة
    const fakeSequences = ['12345678', '87654321', '01234567', '76543210', '00000000', '11111111', '99999999', '12121212'];
    if (fakeSequences.some(seq => digitsOnly.includes(seq))) return false;

    // 1. أردني خلوي: يجب أن يكون 10 أرقام حصراً 07[789]xxxxxxx (أو دولي +9627[789]xxxxxxx / 009627[789]xxxxxxx)
    if (/^07[789]\d{7}$/.test(clean)) {
        return true;
    }
    if (/^(?:(?:\+?962|00962)0?7[789]\d{7})$/.test(clean)) {
        return true;
    }

    // 2. فلسطيني: 059 أو 056 (10 أرقام) أو مع المفتاح الدولي
    if (/^05[69]\d{7}$/.test(clean)) {
        return true;
    }
    if (/^(?:(?:\+?(?:970|972)|00(?:970|972))0?5[69]\d{7})$/.test(clean)) {
        return true;
    }

    // 3. خليجي / عربي: 05x متبوعاً بـ 8 أرقام (10 أرقام) أو مع المفتاح الدولي
    if (/^05\d{8}$/.test(clean)) {
        return true;
    }
    if (/^(?:(?:\+?(?:966|971|965|974|973|968)|00(?:966|971|965|974|973|968))0?5\d{8})$/.test(clean)) {
        return true;
    }

    // 4. مصري: 01x متبوعاً بـ 8 أرقام (11 رقماً)
    if (/^01[0125]\d{8}$/.test(clean) || /^(?:(?:\+?20|0020)0?1[0125]\d{8})$/.test(clean)) {
        return true;
    }

    // 5. دولي كامل يبدأ بـ + أو 00 (بين 9 و 15 رقماً)
    if (/^(?:\+|00)[1-9]\d{8,14}$/.test(clean)) {
        return true;
    }

    return false;
}

let currentIntakeMode = 'chat'; // 'chat' أو 'form'
let clinicalDialogueState = {
    step: 'init', // 'init' -> 'vitals' -> 'clinical_questions' -> 'movement_impact' -> 'ask_phone' -> 'completed'
    history: [],
    patientName: '',
    patientPhone: '',
    patientVitals: {
        age: null,
        weight: null,
        height: null
    },
    collectedSymptoms: []
};

// التبديل بين نمط الطبيب الافتراضي ونمط الفحص السريع
function switchIntakeMode(mode) {
    currentIntakeMode = mode;
    const chatContainer = document.getElementById('ai-chat-intake-container');
    const formContainer = document.getElementById('rapid-form-intake-container');
    const btnChat = document.getElementById('btn-mode-chat');
    const btnForm = document.getElementById('btn-mode-form');
    const subtitle = document.getElementById('step-2-subtitle');

    if (mode === 'chat') {
        if (chatContainer) chatContainer.style.display = 'block';
        if (formContainer) formContainer.style.display = 'none';
        if (btnChat) {
            btnChat.style.background = 'var(--primary-gold)';
            btnChat.style.color = '#0a0e14';
        }
        if (btnForm) {
            btnForm.style.background = 'transparent';
            btnForm.style.color = '#94a3b8';
        }
        if (subtitle) subtitle.textContent = 'حوار واستجواب سريري حي بالذكاء الاصطناعي لتشخيص منطقة الألم بدقة';
        if (clinicalDialogueState.step === 'init') {
            initAiClinicalChat();
        }
    } else {
        if (chatContainer) chatContainer.style.display = 'none';
        if (formContainer) formContainer.style.display = 'block';
        if (btnChat) {
            btnChat.style.background = 'transparent';
            btnChat.style.color = '#94a3b8';
        }
        if (btnForm) {
            btnForm.style.background = 'var(--primary-gold)';
            btnForm.style.color = '#0a0e14';
        }
        if (subtitle) subtitle.textContent = 'الفحص السريع عبر الخيارات المحددة لمنطقة الألم';
    }
}

// ================= نظام محطات الصوت البشري المسبق الاستوديو (Universal Studio Audio Stations) =================
// محطات صوتية استوديو فائقة الجودة والنقاء (0 حرف من الرصيد، 0 ثانية تأخير، وتكلفة 0 للأبد)
let currentActiveStationAudio = null;

function playStationAudio(stationKey, onComplete, fallbackStationKey = null) {
    if (typeof Wada3anAiEngine !== 'undefined') {
        Wada3anAiEngine.stopSpeaking();
    }
    if (currentActiveStationAudio) {
        try {
            if (typeof currentActiveStationAudio._cancelPlayback === 'function') {
                currentActiveStationAudio._cancelPlayback();
            }
            currentActiveStationAudio.onended = null;
            currentActiveStationAudio.onerror = null;
            currentActiveStationAudio.onloadedmetadata = null;
            currentActiveStationAudio.pause();
            currentActiveStationAudio.currentTime = 0;
            currentActiveStationAudio.removeAttribute('src');
            currentActiveStationAudio.load();
        } catch (e) {}
        currentActiveStationAudio = null;
    }

    const mp3Path = `assets/audio/station_${stationKey}.mp3`;
    const wavPath = `assets/audio/station_${stationKey}.wav`;
    
    let safetyTimeoutId = null;
    let finished = false;
    let isCancelled = false;

    const triggerComplete = () => {
        if (finished || isCancelled) return;
        finished = true;
        if (safetyTimeoutId) {
            clearTimeout(safetyTimeoutId);
            safetyTimeoutId = null;
        }
        if (currentActiveStationAudio) {
            currentActiveStationAudio = null;
        }
        if (typeof onComplete === 'function') {
            onComplete();
        }
    };

    // صمام أمان ذكي ديناميكي يعتمد على المدة الزمنية الحقيقية للصوت (مع حد أدنى 45 ثانية لتفادي أي قطع مبكر)
    const scheduleSafetyTimeout = (durationSec) => {
        if (safetyTimeoutId) clearTimeout(safetyTimeoutId);
        const timeoutMs = (durationSec && !isNaN(durationSec) && durationSec > 0) 
            ? Math.max(20000, Math.ceil(durationSec + 5) * 1000) 
            : 45000;
        safetyTimeoutId = setTimeout(() => {
            if (!finished && !isCancelled) {
                console.log(`ℹ️ انتهاء صمام الأمان الزمني لمحطة الصوت [${stationKey}].`);
                triggerComplete();
            }
        }, timeoutMs);
    };

    // صمام أمان أولي 45 ثانية لحين قراءة مدة الملف
    scheduleSafetyTimeout(45);

    const audio = new Audio();
    currentActiveStationAudio = audio;

    audio._cancelPlayback = () => {
        isCancelled = true;
        finished = true;
        if (safetyTimeoutId) {
            clearTimeout(safetyTimeoutId);
            safetyTimeoutId = null;
        }
    };

    audio.onloadedmetadata = () => {
        if (audio.duration && !isNaN(audio.duration)) {
            scheduleSafetyTimeout(audio.duration);
        }
    };

    audio.onended = () => {
        if (!isCancelled) triggerComplete();
    };

    audio.onerror = () => {
        if (finished || isCancelled) return;
        // فحص وجود صيغة wav البديلة حصراً في حال لم يتم إلغاء الصوت
        const wavAudio = new Audio(wavPath);
        currentActiveStationAudio = wavAudio;
        wavAudio._cancelPlayback = () => {
            isCancelled = true;
            finished = true;
            if (safetyTimeoutId) {
                clearTimeout(safetyTimeoutId);
                safetyTimeoutId = null;
            }
        };
        wavAudio.onloadedmetadata = () => {
            if (wavAudio.duration && !isNaN(wavAudio.duration)) {
                scheduleSafetyTimeout(wavAudio.duration);
            }
        };
        wavAudio.onended = () => {
            if (!isCancelled) triggerComplete();
        };
        wavAudio.onerror = () => {
            if (finished || isCancelled) return;
            console.log(`ℹ️ ملف محطة الصوت [${stationKey}] غير موجود محلياً.`);
            if (fallbackStationKey && fallbackStationKey !== stationKey) {
                console.log(`🔄 تشغيل المحطة الصوتية البديلة: [${fallbackStationKey}]...`);
                playStationAudio(fallbackStationKey, onComplete);
            } else {
                playClinicalAudioFallback(stationKey, triggerComplete);
            }
        };
        if (!isCancelled) {
            const pWav = wavAudio.play();
            if (pWav) {
                pWav.catch(() => {
                    if (!isCancelled) triggerComplete();
                });
            }
        }
    };

    audio.src = mp3Path;
    const playPromise = audio.play();
    if (playPromise) {
        playPromise.catch(() => {
            if (!isCancelled) triggerComplete();
        });
    }
}

// نظام النغمات التفاعلية والتوجيه الصوتي البديل في حال غياب تسجيل الاستوديو
function playClinicalAudioFallback(stationKey, onDone) {
    try {
        const AudioCtxClass = window.AudioContext || window.webkitAudioContext;
        if (AudioCtxClass) {
            const ctx = new AudioCtxClass();
            if (stationKey === 'exercise_start') {
                const now = ctx.currentTime;
                const osc = ctx.createOscillator();
                const gain = ctx.createGain();
                osc.connect(gain);
                gain.connect(ctx.destination);
                osc.frequency.setValueAtTime(523.25, now);
                osc.frequency.exponentialRampToValueAtTime(659.25, now + 0.15);
                gain.gain.setValueAtTime(0.18, now);
                gain.gain.exponentialRampToValueAtTime(0.001, now + 0.35);
                osc.start(now);
                osc.stop(now + 0.35);
            } else if (stationKey === 'exercise_finish') {
                const now = ctx.currentTime;
                const osc = ctx.createOscillator();
                const gain = ctx.createGain();
                osc.connect(gain);
                gain.connect(ctx.destination);
                osc.frequency.setValueAtTime(523.25, now);
                osc.frequency.setValueAtTime(659.25, now + 0.12);
                osc.frequency.setValueAtTime(783.99, now + 0.24);
                gain.gain.setValueAtTime(0.2, now);
                gain.gain.exponentialRampToValueAtTime(0.001, now + 0.55);
                osc.start(now);
                osc.stop(now + 0.55);
            }
        }
    } catch (e) {}

    // نطق سريري فوري باللغة العربية إن كان متاحاً
    if ('speechSynthesis' in window) {
        let msg = '';
        if (stationKey === 'exercise_start') msg = 'ابدأ التمرين بهدوء وتنفس بانتظام';
        else if (stationKey === 'exercise_finish') msg = 'أحسنت! أتممت التمرين بنجاح';
        else if (stationKey === 'session_cooldown') msg = 'أحسنت! تبدأ الآن فترة الاستشفاء لمدة 24 ساعة';
        else if (stationKey === 'plan_complete') msg = 'مبارك! أتممت برنامج التعافي المنزلي بنجاح';

        if (msg) {
            const ut = new SpeechSynthesisUtterance(msg);
            ut.lang = 'ar-SA';
            ut.rate = 0.95;
            ut.onend = () => { if (onDone) onDone(); };
            ut.onerror = () => { if (onDone) onDone(); };
            window.speechSynthesis.speak(ut);
            return;
        }
    }

    if (onDone) onDone();
}

// بدء جلسة الطبيب الافتراضي
async function initAiClinicalChat() {
    if (!currentSelectedPoint) return;
    if (typeof clinicalDialogueState !== 'undefined') {
        if (clinicalDialogueState.hasStartedWelcome || clinicalDialogueState.isStarting) {
            return;
        }
        clinicalDialogueState.hasStartedWelcome = true;
        clinicalDialogueState.isStarting = true;
    }

    const messagesBox = document.getElementById('ai-chat-messages-box');
    const qrContainer = document.getElementById('ai-chat-quick-replies');
    if (!messagesBox) return;

    // إيقاف أي صوت سابق وتجهيز جلسة صوتية جديدة
    if (typeof Wada3anAiEngine !== 'undefined') {
        Wada3anAiEngine._currentSessionStudioVoice = null;
        Wada3anAiEngine.stopSpeaking();
    }

    const persona = (typeof Wada3anAiEngine !== 'undefined') ? Wada3anAiEngine.getSessionDoctorPersona() : { name: 'د. سارة العبادي', title: 'استشارية التقويم السريري' };
    const ptTitle = currentSelectedPoint.title || 'العمود الفقري والمفاصل';

    clinicalDialogueState = {
        isStarting: true,
        hasStartedWelcome: true,
        step: 'vitals',
        history: [],
        patientName: '',
        patientPhone: '',
        patientVitals: {},
        collectedSymptoms: []
    };

    // 1. عرض شاشة "جاري الاتصال بالطبيب الافتراضي" البصرية الفخمة والمميزة
    messagesBox.innerHTML = `
        <div id="ai-doctor-calling-banner" style="background: linear-gradient(135deg, rgba(15, 23, 42, 0.98) 0%, rgba(30, 41, 59, 0.95) 100%); border: 1.5px solid var(--primary-gold); border-radius: 14px; padding: 18px 20px; margin-bottom: 12px; display: flex; align-items: center; justify-content: space-between; gap: 14px; box-shadow: 0 4px 20px rgba(0,0,0,0.45); animation: fadeIn 0.3s ease;">
            <div style="display: flex; align-items: center; gap: 14px;">
                <div style="position: relative; width: 48px; height: 48px; border-radius: 50%; background: linear-gradient(135deg, #0284c7 0%, #0369a1 100%); display: flex; align-items: center; justify-content: center; font-size: 1.5em; border: 2px solid #38bdf8; box-shadow: 0 0 15px rgba(56, 189, 248, 0.5);">
                    📞
                </div>
                <div>
                    <div style="color: #38bdf8; font-weight: 800; font-size: 1.05em; display: flex; align-items: center; gap: 8px;">
                        <span>جاري الاتصال بالطبيب الافتراضي...</span>
                    </div>
                    <div style="color: #94a3b8; font-size: 0.83em; margin-top: 3px;">تجهيز القناة السريرية للاستشارة المباشرة لموضع: (${ptTitle})</div>
                </div>
            </div>
            <div style="color: #fef08a; font-size: 0.82em; font-weight: bold; background: rgba(212, 175, 55, 0.15); border: 1px solid var(--primary-gold); padding: 5px 12px; border-radius: 20px; white-space: nowrap;">
                ⏱️ ثوانٍ معدودة...
            </div>
        </div>
    `;

    // نص الترحيب الطبي الدقيق حسب طلب المستخدم تماماً
    const instantWelcomeMsg = `أهلاً بك في «وداعاً للألم» للكايروبراكتيك.. سلامتك أولاً. أنا مساعدك السريري الذكي في «وداعاً للألم».\n\nنحن هنا لمساعدتك في علاج ${ptTitle} بتقويم الكايروبراكتيك الطبيعي الآمن وبدون جراحة أو مسكنات.\n\nيسعدني أولاً التعرف على اسمك الكريم، وعمرك، ووزنك، وطولك التقريبي، وما الذي تعاني منه تحديداً في **${ptTitle}**؟ (هذه البيانات الحيوية ضرورية لحساب مؤشر الأحمال البيوميكانيكية على المفاصل وتحديد سبب المشكلة بدقة).`;

    // 2. إتمام الاتصال وعرض بطاقة الطبيب فوراً وتشغيل الصوت المحضر مسبقاً
    setTimeout(async () => {
        messagesBox.innerHTML = `
            <div class="doctor-welcome-presentation-card" style="background: linear-gradient(135deg, rgba(15, 23, 42, 0.98) 0%, rgba(30, 41, 59, 0.95) 50%, rgba(212, 175, 55, 0.15) 100%); border: 1.5px solid var(--primary-gold); border-radius: 14px; padding: 14px 18px; margin-bottom: 8px; display: flex; align-items: center; justify-content: space-between; flex-wrap: wrap; gap: 10px; box-shadow: 0 4px 20px rgba(0,0,0,0.45); animation: fadeIn 0.3s ease;">
                <div style="display: flex; align-items: center; gap: 12px;">
                    <div style="position: relative; width: 46px; height: 46px; border-radius: 50%; background: linear-gradient(135deg, #10b981 0%, #047857 100%); display: flex; align-items: center; justify-content: center; font-size: 1.45em; border: 1.5px solid #fef08a; box-shadow: 0 0 12px rgba(16, 185, 129, 0.5); flex-shrink: 0;">
                        🩺
                        <span style="position: absolute; bottom: 0; right: 0; width: 12px; height: 12px; border-radius: 50%; background: #10b981; border: 2px solid #0f172a; box-shadow: 0 0 8px #10b981;"></span>
                    </div>
                    <div>
                        <div style="color: #ffffff; font-weight: 800; font-size: 1em; display: flex; align-items: center; gap: 8px; flex-wrap: wrap;">
                            <span>الاستشاري السريري الذكي</span>
                            <span style="color: #10b981; font-size: 0.82em; background: rgba(16, 185, 129, 0.2); border: 1px solid #10b981; padding: 2px 10px; border-radius: 10px; font-weight: bold;">🟢 متصل الآن .. ${persona.name}</span>
                        </div>
                        <div style="color: var(--primary-gold); font-size: 0.83em; margin-top: 2px;">${persona.title} • «وداعاً للألم» للكايروبراكتيك</div>
                    </div>
                </div>
                <div style="color: #cbd5e1; font-size: 0.8em; background: rgba(15, 23, 42, 0.8); padding: 5px 12px; border-radius: 20px; border: 1px solid rgba(212, 175, 55, 0.3); display: flex; align-items: center; gap: 6px;">
                    <span>🔒</span> استشارة سريرية خاصة وآمنة 100%
                </div>
                <div style="background: rgba(234, 179, 8, 0.12); border: 1px solid rgba(234, 179, 8, 0.4); border-radius: 8px; padding: 8px 12px; margin-top: 10px; color: #fef08a; font-size: 0.82em; line-height: 1.5; width: 100%; box-sizing: border-box; text-align: right;">
                    ⚠️ <strong>تنبيه دقة التشخيص:</strong> يرجى الإجابة بدقة وأمانة على أسئلة الطبيب لتشخيص ميكانيكية ألمك بدقة متناهية وتحديد الخطة العلاجية والتمارين الآمنة لحالتك تماماً.
                </div>
            </div>
        `;
        appendChatMessage('bot', instantWelcomeMsg);
        renderChatQuickReplies([]);

        // تشغيل التسجيل البشري الاستوديو الفوري للترحيب (د. سارة / د. جمال)
        if (typeof Wada3anAiEngine !== 'undefined') {
            const personaName = (persona && persona.gender === 'male') ? 'jamal' : 'sarah';
            const welcomeAudioFile = `assets/audio/station_chat_welcome_${personaName}.mp3`;
            Wada3anAiEngine.playHumanAudio(welcomeAudioFile);
        }

        if (typeof clinicalDialogueState !== 'undefined') {
            clinicalDialogueState.isStarting = false;
        }
    }, 850);

}

// تحديث اسم المريض في كافة الفقاعات السابقة عند التعرف عليه
function refreshUserMessageHeaders(newName) {
    if (!newName) return;
    const box = document.getElementById('ai-chat-messages-box');
    if (!box) return;
    const userLabels = box.querySelectorAll('.user-sender-label');
    userLabels.forEach(lbl => {
        lbl.textContent = `👤 ${newName}`;
    });
}

// إضافة رسالة للنافذة مع دعم مشغل الصوت البشري وتفريغ التسجيل
function appendChatMessage(sender, text, options = {}) {
    const box = document.getElementById('ai-chat-messages-box');
    if (!box) return;

    const audioUrl = (typeof options === 'object' && options !== null) ? (options.audioUrl || null) : null;
    const transcription = (typeof options === 'object' && options !== null) ? (options.transcription || null) : null;
    const isBot = sender === 'bot';

    const persona = (typeof Wada3anAiEngine !== 'undefined') ? Wada3anAiEngine.getSessionDoctorPersona() : { name: 'د. عمر', gender: 'male' };
    const docIcon = persona.gender === 'female' ? '👩‍⚕️' : '👨‍⚕️';
    const docTitle = persona.gender === 'female' ? 'استشارية «وداعاً للألم» الذكية' : 'استشاري «وداعاً للألم» الذكي';

    // إظهار اسم المستخدم الحقيقي عند التعرف عليه بدلاً من "أنت (المراجع)"
    const patientName = (typeof clinicalDialogueState !== 'undefined' && clinicalDialogueState.patientName) ? clinicalDialogueState.patientName : null;
    const userSenderLabel = patientName ? `👤 ${patientName}` : '👤 أنت (المراجع)';

    const senderName = isBot ? `${docIcon} ${persona.name} (${docTitle})` : userSenderLabel;

    const msgEl = document.createElement('div');
    msgEl.style.cssText = `
        display: flex;
        flex-direction: column;
        align-self: ${isBot ? 'flex-start' : 'flex-end'};
        max-width: 88%;
        background: ${isBot ? 'linear-gradient(135deg, #0f172a 0%, #1e293b 100%)' : 'linear-gradient(135deg, #065f46 0%, #047857 100%)'};
        border: 1px solid ${isBot ? 'rgba(56, 189, 248, 0.35)' : '#10b981'};
        padding: 13px 16px;
        border-radius: ${isBot ? '16px 16px 16px 2px' : '16px 16px 2px 16px'};
        box-shadow: 0 4px 15px rgba(0,0,0,0.3);
        animation: fadeIn 0.3s ease;
    `;

    let formattedText = text.replace(/\*\*(.*?)\*\*/g, '<strong style="color: #fef08a;">$1</strong>');

    let transcriptionHtml = transcription ? `
        <div style="font-size: 0.82em; color: #a7f3d0; margin-top: 6px; border-top: 1px dashed rgba(16, 185, 129, 0.4); padding-top: 6px; display: flex; align-items: center; gap: 6px;">
            <span>🎙️</span> <span>فهم الطبيب من تسجيلك: <em>"${transcription}"</em></span>
        </div>
    ` : '';

    const msgId = 'chat-msg-' + Date.now() + '-' + Math.floor(Math.random() * 1000);
    msgEl.id = msgId;

    let audioReplayBtnHtml = '';

    let html = `
        <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 6px; gap: 8px;">
            <span class="${isBot ? 'bot-sender-label' : 'user-sender-label'}" style="font-size: 0.82em; font-weight: bold; color: ${isBot ? '#38bdf8' : '#6ee7b7'};">
                ${senderName}
            </span>
            ${audioReplayBtnHtml}
        </div>
        <div style="color: #e2e8f0; font-size: 0.94em; line-height: 1.75;">
            ${formattedText}
        </div>
        ${transcriptionHtml}
    `;

    msgEl.innerHTML = html;

    if (isBot) {
        const replayBtn = msgEl.querySelector('.btn-chat-replay-audio');
        if (replayBtn) {
            replayBtn.addEventListener('click', (e) => {
                e.stopPropagation();
                if (typeof Wada3anAiEngine !== 'undefined') {
                    Wada3anAiEngine.stopSpeaking();
                    const token = ++Wada3anAiEngine._speechSessionToken;
                    Wada3anAiEngine.speakDoctorResponse(text, token);
                }
            });
        }
    }

    box.appendChild(msgEl);
    box.scrollTop = box.scrollHeight;

    clinicalDialogueState.history.push({ sender, text });
}

// عرض أزرار الرد السريع (تم تعطيل الشرائح الجاهزة للحفاظ على حوار حر وطبيعي 100%)
function renderChatQuickReplies(replies) {
    const container = document.getElementById('ai-chat-quick-replies');
    if (container) {
        container.innerHTML = '';
        container.style.display = 'none';
    }
}

function handleQuickReplyClick(text) {
    const input = document.getElementById('ai-chat-input');
    if (input) input.value = text;
    sendChatMessage();
}

// إرسال رسالة المريض ومعالجتها
async function sendChatMessage() {
    if (typeof Wada3anAiEngine !== 'undefined') {
        Wada3anAiEngine.stopSpeaking();
        Wada3anAiEngine.primeMobileAudio();
    }
    const input = document.getElementById('ai-chat-input');
    if (!input) return;
    const text = input.value.trim();
    if (!text) return;

    input.value = '';
    appendChatMessage('user', text);
    renderChatQuickReplies([]);

    const messagesBox = document.getElementById('ai-chat-messages-box');
    const loadingId = 'ai-typing-indicator';
    const persona = (typeof Wada3anAiEngine !== 'undefined' && Wada3anAiEngine.getSessionDoctorPersona) ? Wada3anAiEngine.getSessionDoctorPersona() : { name: 'الطبيب' };
    if (messagesBox) {
        const typingEl = document.createElement('div');
        typingEl.id = loadingId;
        typingEl.style.cssText = 'color: #94a3b8; font-size: 0.88em; padding: 6px 12px; display: flex; align-items: center; gap: 8px;';
        typingEl.innerHTML = `<span style="animation: spin 1s linear infinite; display: inline-block;">⚙️</span> <span>${persona.name} يحلل إجابتك ويسجل رده...</span>`;
        messagesBox.appendChild(typingEl);
        messagesBox.scrollTop = messagesBox.scrollHeight;
    }

    // استخراج الاسم الحقيقي بدقة وتجنب اعتبار الكلمات العادية كالضمائر أو الأسئلة أسماءً
    if (!clinicalDialogueState.patientName) {
        const forbiddenWords = [
            'دكتور', 'طبيب', 'المريض', 'المراجع', 'أنت', 'انت', 'هنا', 'تمام', 'الحمد',
            'بخير', 'تعبان', 'مريض', 'ما', 'مش', 'مو', 'لا', 'بدي', 'عندي', 'بحس', 'بشعر',
            'حكيتلك', 'قلتلك', 'حكيت', 'قلت', 'راجع', 'موجوع', 'متألم', 'شخص', 'انسان',
            'مرحبا', 'صباح', 'مساء', 'سلام', 'هلا', 'اهلين', 'أهلين', 'شكرا', 'يسلمو', 'نعم',
            'السلام', 'عليكم', 'وعليكم', 'الخير', 'أهلا', 'أهلاً',
            'عمري', 'عمر', 'وزني', 'وزن', 'طولي', 'طول', 'كيلو', 'سنة', 'سم',
            'وعمري', 'ووزني', 'وطولي', 'وسني', 'وأنا', 'وانا',
            'كيف', 'كيفك', 'حالك', 'شلونك', 'اخبارك', 'أخبارك', 'علومك', 'شخبارك',
            'شو', 'ايش', 'إيش', 'مين', 'وين', 'متى', 'ليش', 'لماذا', 'هل', 'كم', 'كل', 'لو', 'إذا', 'اذا',
            'وجع', 'ألم', 'الم', 'ظهر', 'ظهري', 'رقبة', 'رقبتي', 'كتف', 'كتفي', 'ركبة', 'ركبتي', 'رجل', 'رجلي', 'ساق', 'ساقي', 'ديسك', 'عصب', 'فقرات',
            'حاسس', 'حاس', 'بوجع', 'بألم', 'عايش', 'ساكن', 'منيح', 'كويس', 'بدي', 'بديش', 'بتقدر', 'تقدر',
            'ممكن', 'ساعدني', 'سؤال', 'استفسار', 'طيب', 'ماشي', 'اوك', 'أوك', 'يلا'
        ];

        // استخراج الاسم الأول فقط بدقة تامة ومنع أي استطراد أو كلمات لاحقة
        const sanitizeFirstName = (raw) => {
            if (!raw) return null;
            let clean = raw.trim()
                .replace(/^يا\s+/i, '')
                .replace(/^[،,.-]+/g, '')
                .replace(/[،,.:؛!?\d]+$/g, '')
                .trim();
            // أخذ الكلمة الأولى فقط كاسم أول حصراً
            const firstWord = clean.split(/\s+/)[0];
            if (!firstWord || firstWord.length < 2) return null;
            // فحص الكلمات المحظورة
            const lowerWord = firstWord.toLowerCase();
            if (forbiddenWords.includes(lowerWord) || lowerWord.startsWith('وعمر') || lowerWord.startsWith('ووزن') || lowerWord.startsWith('وطول') || lowerWord.startsWith('وسن')) {
                return null;
            }
            return firstWord;
        };

        const namePatterns = [
            /(?:اسمي\s+هو|اسمي|أدعى|ادعى)\s+([^\s\d,.:؛!?]+)/i,
            /(?:أنا|انا)\s+(?:اسمي|المدعو|أدعى)\s+([^\s\d,.:؛!?]+)/i,
            /(?:أنا|انا)\s+([^\s\d,.:؛!?]+)/i,
            /(?:معك|معاك|أخوك|اخوك|أختك|اختك)\s+([^\s\d,.:؛!?]+)/i
        ];
        for (let pat of namePatterns) {
            const m = text.match(pat);
            if (m && m[1]) {
                const validFirst = sanitizeFirstName(m[1]);
                if (validFirst) {
                    clinicalDialogueState.patientName = validFirst;
                    break;
                }
            }
        }

        // إذا كان الدور خاصاً بالاسم والمؤشرات وكتب المراجع اسمه في البداية (مثل: "خالد" أو "خالد وعمري 34 ووزني 77...")
        // بشرط ألا تكون الجملة عبارة عن تحية أو استفسار عام (مثل "كيف حالك" أو "شو تخصصكم")
        if (!clinicalDialogueState.patientName && clinicalDialogueState.step === 'vitals') {
            const isQuestionOrGreeting = /^(كيف|شو|ايش|إيش|مين|وين|متى|ليش|لماذا|هل|مرحبا|صباح|مساء|سلام|أهلا|اهلا|الحمد|بخير|السلام)/i.test(text.trim());
            if (!isQuestionOrGreeting) {
                const words = text.trim().split(/\s+/);
                if (words.length >= 1) {
                    const validFirst = sanitizeFirstName(words[0]);
                    if (validFirst) {
                        clinicalDialogueState.patientName = validFirst;
                    }
                }
            }
        }
    }

    // 0. تحويل الأرقام العربية الهندية (٠١٢٣٤٥٦٧٨٩) إلى أرقام عادية (0123456789)
    const normalizedDigitsText = text.replace(/[٠-٩]/g, d => '٠١٢٣٤٥٦٧٨٩'.indexOf(d));

    // استخراج المؤشرات الحيوية (العمر، الوزن، الطول) لحساب الإجهاد البيوميكانيكي
    if (!clinicalDialogueState.patientVitals) {
        clinicalDialogueState.patientVitals = {};
    }
    // 1. استخراج العمر بالكلمات المفتاحية (دعم الصياغات المباشرة واللاحقة مثل: عمري 43، العمر: 43، 43 سنة)
    const ageMatch = normalizedDigitsText.match(/(?:العمر|عمري|عمر|سن|سني|السن)\s*(?:هو|يكون|:|=)?\s*(\d{1,2})/i) ||
                     normalizedDigitsText.match(/\b(\d{1,2})\s*(?:سنة|سنه|عام|عاما|عاماً)\b/i);
    if (ageMatch && parseInt(ageMatch[1], 10) >= 10 && parseInt(ageMatch[1], 10) <= 99) {
        clinicalDialogueState.patientVitals.age = parseInt(ageMatch[1], 10);
    }
    // 2. استخراج الوزن بالكلمات المفتاحية (مثل: وزني 66، الوزن: 66، 66 كيلو، 66 كغم)
    const weightMatch = normalizedDigitsText.match(/(?:الوزن|وزني|وزن)\s*(?:هو|يكون|:|=)?\s*(\d{2,3})/i) ||
                        normalizedDigitsText.match(/\b(\d{2,3})\s*(?:كيلو|كغم|كغ|كيلوغرام|كلغ)\b/i);
    if (weightMatch && parseInt(weightMatch[1], 10) >= 30 && parseInt(weightMatch[1], 10) <= 250) {
        clinicalDialogueState.patientVitals.weight = parseInt(weightMatch[1], 10);
    }
    // 3. استخراج الطول بالكلمات المفتاحية (مثل: طولي 165، الطول: 165، 165 سم)
    const heightMatch = normalizedDigitsText.match(/(?:الطول|طولي|طول)\s*(?:هو|يكون|:|=)?\s*(\d{2,3})/i) ||
                        normalizedDigitsText.match(/\b(\d{2,3})\s*(?:سم|سنتيمتر|سنتي)\b/i);
    if (heightMatch && parseInt(heightMatch[1], 10) >= 120 && parseInt(heightMatch[1], 10) <= 220) {
        clinicalDialogueState.patientVitals.height = parseInt(heightMatch[1], 10);
    }

    // 4. استخراج ذكي متقدم للأرقام المتتالية المجردة بدون كلمات مفتاحية (مثل: "رمزي 43 66 165" أو "43 66 165")
    // الترتيب السريري القياسي في المحادثة: الاسم، العمر، الوزن، الطول
    const standaloneNumbers = (normalizedDigitsText.match(/\b\d{2,3}\b/g) || []).map(n => parseInt(n, 10));
    const candidateVitals = standaloneNumbers.filter(n => n >= 12 && n <= 230);
    if (candidateVitals.length > 0) {
        // أ. استخراج الطول (المدى الطبيعي 120 - 220 سم)
        let detectedHeight = clinicalDialogueState.patientVitals.height;
        if (!detectedHeight) {
            const hCand = candidateVitals.find(n => n >= 120 && n <= 220);
            if (hCand) {
                detectedHeight = hCand;
                clinicalDialogueState.patientVitals.height = hCand;
            }
        }

        // ب. الأرقام المتبقية بعد استبعاد الطول: الترتيب السريري المعتمد هو (العمر أولاً، ثم الوزن ثانياً)
        const nonHeight = candidateVitals.filter(n => n !== detectedHeight);
        if (nonHeight.length >= 2) {
            // الأول هو العمر، والثاني هو الوزن طبقاً لصياغة سؤال الطبيب: (عمرك، ووزنك، وطولك)
            if (!ageMatch) clinicalDialogueState.patientVitals.age = nonHeight[0];
            if (!weightMatch) clinicalDialogueState.patientVitals.weight = nonHeight[1];
        } else if (nonHeight.length === 1) {
            const single = nonHeight[0];
            if (!clinicalDialogueState.patientVitals.age && !ageMatch && single <= 95 && single >= 12) {
                clinicalDialogueState.patientVitals.age = single;
            } else if (!clinicalDialogueState.patientVitals.weight && !weightMatch && single >= 35 && single <= 230) {
                clinicalDialogueState.patientVitals.weight = single;
            }
        }
    }

    // تحديث فوري واحتساب مؤشر كتلة الجسم والحمولة الميكانيكية بمجرد توفر أو تصحيح الوزن والطول
    if (clinicalDialogueState.patientVitals.weight && clinicalDialogueState.patientVitals.height) {
        const w = clinicalDialogueState.patientVitals.weight;
        const h = clinicalDialogueState.patientVitals.height;
        const hM = h / 100;
        const bmiVal = parseFloat((w / (hM * hM)).toFixed(1));
        const minHealthyW = parseFloat((18.5 * hM * hM).toFixed(1));
        const maxHealthyW = parseFloat((24.9 * hM * hM).toFixed(1));
        const idealW = parseFloat((22.0 * hM * hM).toFixed(1));

        let bmiStatus = "وزن طبيعي متوازن";
        let bmiColor = "#10b981";
        let deltaText = `✅ وزنك ضمن النطاق الصحي المثالي (${minHealthyW} - ${maxHealthyW} كجم)`;
        let impact = "وزنك متناسق ولا يشكل حمولة ضغط إضافية على الغضاريف والفقرات.";

        if (bmiVal < 18.5) {
            const deltaKg = parseFloat((minHealthyW - w).toFixed(1));
            bmiStatus = "نحافة / نقص في الكتلة العضلية";
            bmiColor = "#38bdf8";
            deltaText = `⚠️ نقص في الوزن بمقدار -${deltaKg} كجم عن الحد الأدنى للوزن الصحي (${minHealthyW} كجم)`;
            impact = "نقص الكتلة العضلية يقلل من الثبات الميكانيكي للمفاصل ويجعل الفقرات عرضة للإجهاد السريع.";
        } else if (bmiVal >= 25 && bmiVal < 30) {
            const deltaKg = parseFloat((w - maxHealthyW).toFixed(1));
            const excessVsIdeal = parseFloat((w - idealW).toFixed(1));
            const addedLoad = parseFloat((deltaKg * 4).toFixed(1));
            bmiStatus = "زيادة وزن (Overweight)";
            bmiColor = "#f59e0b";
            deltaText = `⚠️ وزن زائد بمقدار +${deltaKg} كجم عن الحد الصحي (+${excessVsIdeal} كجم عن الوزن المثالي)`;
            impact = `يضيف حوالي +${addedLoad} كجم حمولة ضغط إضافية على الركبتين وأسفل الظهر أثناء الحركة.`;
        } else if (bmiVal >= 30) {
            const deltaKg = parseFloat((w - maxHealthyW).toFixed(1));
            const excessVsIdeal = parseFloat((w - idealW).toFixed(1));
            const addedLoad = parseFloat((deltaKg * 4).toFixed(1));
            bmiStatus = "سمنة مفرطة / حمولة ميكانيكية حرجة";
            bmiColor = "#ef4444";
            deltaText = `🚨 وزن زائد حرج بمقدار +${deltaKg} كجم (+${excessVsIdeal} كجم عن الوزن المثالي)`;
            impact = `كل 1 كجم زيادة يضاعف الحمل 4 أضعاف، مما يشكل حمولة ضغط فائقة تصل إلى +${addedLoad} كجم على مفاصلك وفقراتك.`;
        }

        const calculatedBmiInfo = {
            value: bmiVal,
            status: bmiStatus,
            color: bmiColor,
            minHealthyW,
            maxHealthyW,
            idealW,
            deltaText,
            impact
        };

        clinicalDialogueState.patientVitals.bmiInfo = calculatedBmiInfo;
        if (typeof currentAssessmentData !== 'undefined' && currentAssessmentData) {
            currentAssessmentData.bmiInfo = calculatedBmiInfo;
            if (!currentAssessmentData.patientVitals) currentAssessmentData.patientVitals = {};
            currentAssessmentData.patientVitals.weight = w;
            currentAssessmentData.patientVitals.height = h;
            currentAssessmentData.patientVitals.age = clinicalDialogueState.patientVitals.age;
        }
    }

    // فحص إذا كان الحوار بانتظار رقم هاتف أو قام المستخدم بذكر كلمة الهاتف صراحة
    const lastBotMsg = (clinicalDialogueState.history && clinicalDialogueState.history.length > 0)
        ? [...clinicalDialogueState.history].reverse().find(h => h.sender === 'bot')
        : null;
    const wasAskedForPhone = clinicalDialogueState.step === 'ask_phone' || 
        (lastBotMsg && /رقم\s*(?:هاتف|موبايل|تلفون|جوال)|هاتفك|موبايلك|تلفونك|جوالك/i.test(lastBotMsg.text));
    const userMentionsPhoneExplicitly = /(?:هاتفي|تلفوني|موبايلي|جوالي|رقمي|رقم\s*الهاتف|رقم\s*المحمول)/i.test(text);
    const isExpectingPhone = (clinicalDialogueState.step === 'ask_phone' || wasAskedForPhone || userMentionsPhoneExplicitly) && clinicalDialogueState.step !== 'vitals' && clinicalDialogueState.step !== 'init';

    if (isExpectingPhone) {
        const phoneCandidates = [];
        const pureNumbers = normalizedDigitsText.replace(/[^\d+]/g, '');
        if (pureNumbers.length >= 7 && pureNumbers.length <= 16) {
            phoneCandidates.push(pureNumbers);
        }
        const spacedMatches = normalizedDigitsText.match(/(?:\+?\d[\d\s\-]{6,16}\d)/g);
        if (spacedMatches) {
            spacedMatches.forEach(m => {
                const cleanM = m.replace(/[\s\-]/g, '');
                if (cleanM.length >= 7 && cleanM.length <= 16 && !phoneCandidates.includes(cleanM)) {
                    phoneCandidates.push(cleanM);
                }
            });
        }

        // 1. تدقيق صارم للأرقام الأردنية: يجب أن يتكون الرقم المحلي من 10 أرقام حصراً (07xxxxxxx)
        const cleanNoPlus = pureNumbers.replace(/^\+/, '');
        const isJordanianFormat = cleanNoPlus.startsWith('07') || cleanNoPlus.startsWith('79') || cleanNoPlus.startsWith('78') || cleanNoPlus.startsWith('77') || cleanNoPlus.startsWith('9627');
        if (isJordanianFormat) {
            let jordanDigits = cleanNoPlus;
            if (jordanDigits.startsWith('962')) jordanDigits = '0' + jordanDigits.slice(3);
            else if (!jordanDigits.startsWith('0')) jordanDigits = '0' + jordanDigits;

            if (jordanDigits.length !== 10) {
                const indicator = document.getElementById(loadingId);
                if (indicator) indicator.remove();
                const pName = clinicalDialogueState.patientName ? ` يا ${clinicalDialogueState.patientName}` : '';
                const diffMsg = jordanDigits.length < 10 ? `ناقصاً (${10 - jordanDigits.length} أرقام)` : `زائداً بمقدار (${jordanDigits.length - 10} أرقام)`;
                appendChatMessage('bot', `⚠️ عفواً${pName}، الرقم الذي أدخلته يتكون من (${jordanDigits.length}) أرقام وهو ${diffMsg}. يجب أن يتكون رقم الهاتف الخلوي الأردني من 10 أرقام حصراً (مثال: 079xxxxxxx أو 078xxxxxxx أو 077xxxxxxx) أو رقم دولي مع رمز الدولة لربط ملفك الطبي السريري بدقة. يرجى إعادة إدخال الرقم كاملاً:`);
                showToast(`⚠️ رقم الهاتف الأردني يجب أن يتكون من 10 أرقام حصراً (${jordanDigits.length} أرقام حالياً)`, 'warning');
                const chatInput = document.getElementById('ai-chat-input');
                if (chatInput) {
                    chatInput.placeholder = 'أدخل رقم هاتفك الخلوي (10 أرقام: 079xxxxxxx)...';
                    chatInput.focus();
                }
                return;
            }
        }

        let validFoundPhone = null;
        for (const cand of phoneCandidates) {
            if (isValidPhoneNumber(cand)) {
                validFoundPhone = cand;
                break;
            }
        }

        // إذا قام المستخدم بتزويد رقم هاتف صالح الآن: حفظ البيانات فوراً وإظهار رسالة الاستلام ثم تشغيل صوت د. سارة والانتقال للتقرير
        if (validFoundPhone) {
            clinicalDialogueState.patientPhone = validFoundPhone;
            clinicalDialogueState.step = 'completed';

            // حفظ ملف المريض بشكل فوري ولحظي في قاعدة بيانات العيادة
            if (window.SmartDB && typeof SmartDB.savePatient === 'function') {
                SmartDB.savePatient({
                    name: clinicalDialogueState.patientName || 'مريض غير محدد',
                    phone: clinicalDialogueState.patientPhone,
                    status: 'in_progress',
                    condition: (typeof currentSelectedPoint !== 'undefined' && currentSelectedPoint) ? currentSelectedPoint.title : 'فحص ألم عام',
                    notes: 'تم توثيق رقم الهاتف في الشات السريري'
                }).catch(e => console.warn('Realtime SmartDB save error:', e));
            }

            const patientGreeting = (clinicalDialogueState.patientName && clinicalDialogueState.patientName !== 'المراجع الكريم') ? ` يا ${clinicalDialogueState.patientName}` : '';
            const closingMsg = `✅ تم تسجيل رقم هاتفك بنجاح${patientGreeting}. نقوم الآن بإصدار تقريرك السريري المتكامل وتحويلك فوراً لصفحة التشخيص وخطة التعافي... ⏱️`;
            
            const indicator = document.getElementById(loadingId);
            if (indicator) indicator.remove();

            appendChatMessage('bot', closingMsg);
            renderChatQuickReplies([]);

            let transitioned = false;
            const doTransition = () => {
                if (transitioned) return;
                transitioned = true;
                if (typeof Wada3anAiEngine !== 'undefined') Wada3anAiEngine.stopSpeaking();
                finishChatIntakeAndGenerateReport();
            };

            // تشغيل صوت محطة الانتقال الدائم المسجل مسبقاً لدكتورة سارة
            // والانتقال لصفحة التقرير فور انتهاء دكتورة سارة من نطق آخر كلمة في التسجيل
            playStationAudio('transition', () => {
                doTransition();
            });
            return;
        } else {
            // الرقم غير صالح أو غير مكتمل
            const indicator = document.getElementById(loadingId);
            if (indicator) indicator.remove();
            const pName = clinicalDialogueState.patientName ? ` يا ${clinicalDialogueState.patientName}` : '';
            appendChatMessage('bot', `⚠️ عفواً${pName}، الرقم الذي أدخلته غير صحيح أو غير مكتمل. لربط ملفك الطبي وإصدار تقريرك السريري، يرجى تزويدي برقم هاتف محمول صالح (10 أرقام في الأردن مثل: 079xxxxxxx أو رقم دولي مع رمز الدولة):`);
            showToast('⚠️ يرجى إدخال رقم هاتف محمول صالح ومكتمل', 'warning');
            const chatInput = document.getElementById('ai-chat-input');
            if (chatInput) {
                chatInput.placeholder = 'أدخل رقم هاتفك المحمول (مثال: 079xxxxxxx)...';
                chatInput.focus();
            }
            return;
        }
    }

    // إذا تم استلام المؤشرات الحيوية في البداية ننتقل لأسئلة الاستقصاء السريري
    if (clinicalDialogueState.step === 'vitals' || clinicalDialogueState.step === 'init') {
        clinicalDialogueState.step = 'clinical_questions';
    }

    // تجميع الأعراض السريرية الحقيقية فقط واستبعاد التحيات والأسئلة العامة ومواضيع التصميم والدردشة
    const isGreetingOrChitchat = /^(صباح|مساء|مرحبا|أهلا|اهلا|السلام عليكم|سلام|هاي|هلا|شكرا|تسلم|تمام|اوك|أوك|مين انت|شو تخصصك|كم عمرك|بتعرف|وين عيادتكم|وين موقعكم|كيفك|كيف الحال)/i.test(text.trim());
    const hasClinicalKeywords = /ألم|الم|وجع|خدر|تنميل|حرارة|حرقان|لسعة|كهربا|شد|تشنج|عصب|ديسك|فقرات|ظهر|رقبة|ركبة|كتف|ساق|رجل|صداع|ورك|حوض|ردف|عصعص|أبهر|انزلاق|عرق النسا|مايل|مفتول|مشلول|صعوبة|حركة|عضل|مفصل|ثقل|تيبس|عظم/i.test(text);

    if (hasClinicalKeywords && (!isGreetingOrChitchat || text.length > 30)) {
        clinicalDialogueState.collectedSymptoms.push(text.trim());
    }

    // الانتقال للخطوة التالية في الحوار (نصي فقط وفائق السرعة)
    const nextResponse = await Wada3anAiEngine.advanceClinicalDialogue({
        currentStep: clinicalDialogueState.step,
        history: clinicalDialogueState.history,
        painPointTitle: currentSelectedPoint.title,
        patientName: clinicalDialogueState.patientName,
        patientVitals: clinicalDialogueState.patientVitals,
        lastUserMessage: text
    });

    // التقاط الاسم ورقم الهاتف في حال استخرجهما الذكاء الاصطناعي من سياق الحديث
    if (!clinicalDialogueState.patientName && nextResponse.extractedName) {
        clinicalDialogueState.patientName = nextResponse.extractedName;
        refreshUserMessageHeaders(clinicalDialogueState.patientName);
    }
    if (!clinicalDialogueState.patientPhone && nextResponse.extractedPhone && (isValidPhoneNumber(nextResponse.extractedPhone) || nextResponse.extractedPhone.length >= 7)) {
        clinicalDialogueState.patientPhone = nextResponse.extractedPhone;
    }

    // حفظ فوري في قاعدة البيانات إذا توفر رقم الهاتف
    if (clinicalDialogueState.patientPhone && window.SmartDB && typeof SmartDB.savePatient === 'function') {
        SmartDB.savePatient({
            name: clinicalDialogueState.patientName || 'مريض غير محدد',
            phone: clinicalDialogueState.patientPhone,
            status: 'in_progress',
            condition: (typeof currentSelectedPoint !== 'undefined' && currentSelectedPoint) ? currentSelectedPoint.title : 'فحص ألم عام',
            notes: 'تحديث الحوار السريري الذكي'
        }).catch(() => {});
    }

    clinicalDialogueState.step = nextResponse.nextStep;

    const indicator = document.getElementById(loadingId);
    if (indicator) indicator.remove();

    // عرض رد الطبيب في الشات فوراً وبشكل نصي سريع
    appendChatMessage('bot', nextResponse.message);
    renderChatQuickReplies(nextResponse.quickReplies);

    // حارس رقم الهاتف الإلزامي الصارم: انتقال مضمون للتقرير فور توفر رقم الهاتف
    const hasAnyPhoneRecorded = (clinicalDialogueState.patientPhone && String(clinicalDialogueState.patientPhone).replace(/\D/g, '').length >= 7) || nextResponse.extractedPhone;
    if ((nextResponse.isReady || nextResponse.nextStep === 'completed' || clinicalDialogueState.step === 'completed' || hasAnyPhoneRecorded) && hasAnyPhoneRecorded) {
        if (!clinicalDialogueState.patientPhone && nextResponse.extractedPhone) {
            clinicalDialogueState.patientPhone = nextResponse.extractedPhone;
        }
        clinicalDialogueState.step = 'completed';
        playStationAudio('transition', () => {
            finishChatIntakeAndGenerateReport();
        });
        return;
    }
}

// إنهاء الحوار وبناء التقرير الطبي فوراً
function finishChatIntakeAndGenerateReport() {
    const userMessages = (clinicalDialogueState.history || [])
        .filter(h => h.sender === 'user')
        .map(h => h.text)
        .join(' ');

    // حارس رقم الهاتف الصارم: منع الانتقال للتشخيص بدون رقم هاتف معتمد
    const hasPhoneStored = clinicalDialogueState.patientPhone && String(clinicalDialogueState.patientPhone).replace(/\D/g, '').length >= 7;
    if (!hasPhoneStored && !isValidPhoneNumber(clinicalDialogueState.patientPhone)) {
        showToast('⚠️ يرجى تزويد الطبيب برقم هاتفك أولاً في المحادثة لحفظ ملفك وإصدار تقريرك الطبي.', 'warning');
        appendChatMessage('bot', '⚠️ عذراً يا غالي، لنتمكن من حفظ ملفك وربطه وإصدار تقرير حالتك وخطة تمارينك المخصصة بدقة، يرجى تزويدي برقم هاتفك أولاً (مثال: 079xxxxxxx):');
        const chatInput = document.getElementById('ai-chat-input');
        if (chatInput) {
            chatInput.placeholder = 'أدخل رقم هاتفك هنا (مثال: 079xxxxxxx)...';
            chatInput.focus();
        }
        return;
    }

    const hasDescribedSymptoms = /ألم|وجع|خدر|تنميل|حرارة|حرقان|لسعة|كهربا|شد|تشنج|عصب|ديسك|فقرات|ظهر|رقبة|ركبة|كتف|ساق|رجل|صداع/i.test(userMessages);
    const hasFormAnswers = document.querySelectorAll('input[name^="clinical_q"]:checked').length > 0;

    if (!hasDescribedSymptoms && !hasFormAnswers) {
        showToast('💡 جاري إعداد التقرير الاسترشادي والتمارين التأهيلية المخصصة...', 'info');
    } else {
        showToast('✨ تم استكمال الفحص السريري بنجاح! جاري فتح التقرير الطبي...', 'success');
    }

    // استخراج ومزامنة الأعراض المذكورة في المحادثة مع الخيارات السريرية لكافة مناطق الجسم
    if (userMessages) {
        const textLower = userMessages.toLowerCase();

        // 1. الأعراض الجذرية والعصبية (ديسك، عرق النسا، كهرباء، تنميل)
        if (/خدر|تنميل|كهربا|لسعة|بيمتد|بينزل|عرق النسا|حرارة|حرقان|طرف|اصابع|أصابع/i.test(textLower)) {
            const radCheck = document.querySelector('input[name="clinical_q1"][value*="radicular"], input[name="clinical_q1"][value*="nerve"], input[name="clinical_q1"][value*="disc"]');
            if (radCheck) radCheck.checked = true;
        }
        // 2. الشد والتشنج العضلي والإجهاد الميكانيكي
        if (/شد|تشنج|عضل|ثقل|تيبس|تصلب|ارهاق|إجهاد/i.test(textLower)) {
            const strainCheck = document.querySelector('input[name="clinical_q1"][value*="strain"], input[name="clinical_q1"][value*="spasm"], input[name="clinical_q1"][value*="postural"], input[name="clinical_q1"][value*="muscular"]');
            if (strainCheck) strainCheck.checked = true;
        }
        // 3. متلازمات المفاصل والانحباس (Facet lock / Impingement / Piriformis)
        if (/انحباس|مفصل|طقطقة|احتكاك|قفل|ردف|كمثرية/i.test(textLower)) {
            const facetCheck = document.querySelector('input[name="clinical_q1"][value*="facet"], input[name="clinical_q1"][value*="impingement"], input[name="clinical_q1"][value*="piriformis"], input[name="clinical_q1"][value*="lock"]');
            if (facetCheck) facetCheck.checked = true;
        }
        // 4. المحفزات الميكانيكية للجلوس والانحناء
        if (/جلوس|جلسة|كرسي|مكتب|انحناء|شاشة|تلفون|هاتف|كمبيوتر/i.test(textLower)) {
            const sitCheck = document.querySelector('input[name="clinical_q2"][value*="flexion"], input[name="clinical_q2"][value*="sit"], input[name="clinical_q2"][value*="phone"], input[name="clinical_q2"][value*="screen"], input[name="clinical_q2"][value*="desk"]');
            if (sitCheck) sitCheck.checked = true;
        }
        // 5. المحفزات الميكانيكية للوقوف والمشي وفرد الظهر
        if (/وقوف|مشي|فرد|خلف|امتداد|ظهر للخلف/i.test(textLower)) {
            const standCheck = document.querySelector('input[name="clinical_q2"][value*="extension"], input[name="clinical_q2"][value*="stand"], input[name="clinical_q2"][value*="walk"]');
            if (standCheck) standCheck.checked = true;
        }
        // 6. فحوص الاستدلال الاستفزازية (q4)
        if (/كهربا|لسعة|نار|حاد/i.test(textLower)) {
            const q4Sharp = document.querySelector('input[name="clinical_q4"][value*="sharp"], input[name="clinical_q4"][value*="electric"], input[name="clinical_q4"][value*="positive"]');
            if (q4Sharp) q4Sharp.checked = true;
        }
    }

    const pName = clinicalDialogueState.patientName || 'المراجع الكريم';
    const notes = clinicalDialogueState.collectedSymptoms.length > 0 
        ? clinicalDialogueState.collectedSymptoms.join(' - ') 
        : `استشارة وفحص سريري لموضع: ${currentSelectedPoint?.title || 'العمود الفقري والمفاصل'}`;

    // مزامنة البيانات مع الحقول
    const nameInput = document.getElementById('patient-name');
    if (nameInput) nameInput.value = pName;
    const subName = document.getElementById('sub-name');
    if (subName) subName.value = pName;
    const subPhone = document.getElementById('sub-phone');
    if (subPhone && clinicalDialogueState.patientPhone) {
        let cleanPhone = clinicalDialogueState.patientPhone.replace(/^\+?962/, '');
        subPhone.value = cleanPhone;
    }
    const notesInput = document.getElementById('patient-condition-notes');
    if (notesInput) notesInput.value = notes;

    // مزامنة العمر والوزن والطول إن استخرجوا
    if (clinicalDialogueState.patientVitals?.age) {
        const ageInput = document.getElementById('patient-age');
        if (ageInput) ageInput.value = clinicalDialogueState.patientVitals.age;
    }
    if (clinicalDialogueState.patientVitals?.weight) {
        const weightInput = document.getElementById('patient-weight');
        if (weightInput) weightInput.value = clinicalDialogueState.patientVitals.weight;
    }
    if (clinicalDialogueState.patientVitals?.height) {
        const heightInput = document.getElementById('patient-height');
        if (heightInput) heightInput.value = clinicalDialogueState.patientVitals.height;
    }
    if (typeof calculateAndDisplayBmi === 'function') {
        calculateAndDisplayBmi();
    }

    // تنظيف أي كاش قديم للتقارير لضمان توليد تقرير سريري جديد بالكامل
    try {
        const keysToRemove = [];
        for (let i = 0; i < sessionStorage.length; i++) {
            const k = sessionStorage.key(i);
            if (k && k.startsWith('ai_insight')) {
                keysToRemove.push(k);
            }
        }
        keysToRemove.forEach(k => sessionStorage.removeItem(k));
    } catch (e) {}

    // تشغيل التحليل السريري للتقرير
    runDiagnosticAnalysis();
}

// =========================================================================
// مسجّل الرسائل الصوتية الحقيقية (Real Voice Note Recorder - WhatsApp style)
// =========================================================================
let mediaRecorderInstance = null;
let audioRecordingChunks = [];
let recordingTimerInterval = null;
let recordingSecondsCount = 0;
let recordedAudioMimeType = 'audio/webm';
let liveVoiceNoteTranscript = '';
let liveVoiceRecognitionInstance = null;

// بدء تسجيل رسالة صوتية حقيقية عبر ميكروفون الهاتف/اللابتوب
async function startVoiceNoteRecording() {
    // 1. التحقق من دعم المتصفح للتسجيل الصوتي مع دعم الإصدارات القديمة (Legacy Fallback)
    const hasMediaDevices = Boolean(navigator.mediaDevices && navigator.mediaDevices.getUserMedia);
    const hasLegacyGetUserMedia = Boolean(navigator.getUserMedia || navigator.webkitGetUserMedia || navigator.mozGetUserMedia);

    if (!hasMediaDevices && !hasLegacyGetUserMedia) {
        // التحقق إن كان المتصفح حجب المايك بسبب فتح الرابط عبر IP غير مشفر (HTTP بدلاً من HTTPS)
        const isNotSecure = window.isSecureContext === false && location.hostname !== 'localhost' && location.hostname !== '127.0.0.1';
        if (isNotSecure) {
            showToast('⚠️ يتطلب متصفح هاتفك فتح الرابط عبر اتصال مشفر (HTTPS) أو إتاحة صلاحية المايك لعنوان IP.', 'warning');
        } else {
            showToast('متصفحك لا يدعم تسجيل الصوت المباشر، يمكنك الكتابة في الحقل.', 'info');
        }
        return;
    }

    // دالة الحصول على مجرى الصوت عبر الأساليب الحديثة أو القديمة
    const getAudioStream = async () => {
        if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
            return await navigator.mediaDevices.getUserMedia({ audio: true });
        }
        return new Promise((resolve, reject) => {
            const legacyFn = navigator.getUserMedia || navigator.webkitGetUserMedia || navigator.mozGetUserMedia;
            if (!legacyFn) return reject(new Error('getUserMedia not available'));
            legacyFn.call(navigator, { audio: true }, resolve, reject);
        });
    };

    try {
        const stream = await getAudioStream();
        
        // تحديد نوع الترميز المتوافق مع المتصفح
        recordedAudioMimeType = 'audio/webm';
        if (typeof MediaRecorder !== 'undefined') {
            if (MediaRecorder.isTypeSupported('audio/webm;codecs=opus')) {
                recordedAudioMimeType = 'audio/webm;codecs=opus';
            } else if (MediaRecorder.isTypeSupported('audio/webm')) {
                recordedAudioMimeType = 'audio/webm';
            } else if (MediaRecorder.isTypeSupported('audio/mp4')) {
                recordedAudioMimeType = 'audio/mp4'; // للآيفون iOS Safari
            } else if (MediaRecorder.isTypeSupported('audio/aac')) {
                recordedAudioMimeType = 'audio/aac';
            }
        }

        mediaRecorderInstance = new MediaRecorder(stream, { mimeType: recordedAudioMimeType });
        audioRecordingChunks = [];

        mediaRecorderInstance.ondataavailable = (e) => {
            if (e.data && e.data.size > 0) {
                audioRecordingChunks.push(e.data);
            }
        };

        mediaRecorderInstance.onstop = () => {
            stream.getTracks().forEach(t => t.stop());
            clearInterval(recordingTimerInterval);
        };

        mediaRecorderInstance.start(250);

        // تشغيل التعرف اللحظي على الكلام في الخلفية بالتوازي لتوفير سرعة خارقة وتفريغ فوري دقيق
        liveVoiceNoteTranscript = '';
        const SpeechRecClass = window.SpeechRecognition || window.webkitSpeechRecognition;
        if (SpeechRecClass) {
            try {
                liveVoiceRecognitionInstance = new SpeechRecClass();
                liveVoiceRecognitionInstance.lang = 'ar-JO';
                liveVoiceRecognitionInstance.interimResults = true;
                liveVoiceRecognitionInstance.continuous = true;
                liveVoiceRecognitionInstance.onresult = (evt) => {
                    let full = '';
                    for (let i = 0; i < evt.results.length; ++i) {
                        full += evt.results[i][0].transcript + ' ';
                    }
                    const cleanText = full.trim();
                    if (cleanText) {
                        liveVoiceNoteTranscript = cleanText;
                        const timerText = document.getElementById('recording-timer-text');
                        if (timerText) {
                            const snippet = cleanText.length > 25 ? cleanText.substring(0, 25) + '...' : cleanText;
                            timerText.textContent = `🎙️ "${snippet}"`;
                        }
                    }
                };
                liveVoiceRecognitionInstance.onerror = (e) => {
                    console.warn('Live voice recognition note:', e.error);
                };
                liveVoiceRecognitionInstance.start();
            } catch (recErr) {
                console.warn('Parallel speech recognition note:', recErr);
            }
        }

        // إظهار شريط التسجيل الحي
        const inputBar = document.getElementById('ai-chat-input-bar');
        const recordingBar = document.getElementById('ai-chat-recording-bar');
        const timerText = document.getElementById('recording-timer-text');
        if (inputBar) inputBar.style.display = 'none';
        if (recordingBar) recordingBar.style.display = 'flex';

        recordingSecondsCount = 0;
        if (timerText) timerText.textContent = '0:00 - جاري الاستماع، تحدث بحرية...';

        recordingTimerInterval = setInterval(() => {
            recordingSecondsCount++;
            const mins = Math.floor(recordingSecondsCount / 60);
            const secs = recordingSecondsCount % 60;
            const formatted = `${mins}:${secs < 10 ? '0' : ''}${secs}`;
            if (timerText && !liveVoiceNoteTranscript) {
                timerText.textContent = `${formatted} - جاري الاستماع، تحدث بحرية...`;
            }
        }, 1000);

    } catch (err) {
        console.warn('Microphone access denied:', err);
        const isNotSecure = window.isSecureContext === false && location.hostname !== 'localhost' && location.hostname !== '127.0.0.1';
        if (isNotSecure) {
            showToast('⚠️ تتطلب متصفحات الهاتف تفعيل صلاحية الميكروفون للشبكة المحلية أو استخدام بروتوكول HTTPS.', 'warning');
        } else {
            showToast('يرجى السماح بصلاحية الميكروفون في إعدادات المتصفح لتتمكن من التحدث بصوتك.', 'error');
        }
    }
}

// إيقاف التسجيل وإرسال الرسالة الصوتية مباشرة للذكاء الاصطناعي
async function stopAndSendVoiceNote() {
    if (!mediaRecorderInstance || mediaRecorderInstance.state === 'inactive') return;

    clearInterval(recordingTimerInterval);

    if (liveVoiceRecognitionInstance) {
        try { liveVoiceRecognitionInstance.stop(); } catch (e) {}
    }

    const inputBar = document.getElementById('ai-chat-input-bar');
    const recordingBar = document.getElementById('ai-chat-recording-bar');
    if (recordingBar) recordingBar.style.display = 'none';
    if (inputBar) inputBar.style.display = 'flex';

    const recordingPromise = new Promise((resolve) => {
        mediaRecorderInstance.onstop = () => {
            const blob = new Blob(audioRecordingChunks, { type: recordedAudioMimeType });
            resolve(blob);
        };
    });

    mediaRecorderInstance.stop();
    const audioBlob = await recordingPromise;

    if (!audioBlob || audioBlob.size < 200) {
        showToast('التسجيل قصير جداً، يرجى التحدث بوضوح وإعادة المحاولة.', 'info');
        return;
    }

    const capturedText = (liveVoiceNoteTranscript || '').trim();
    const userDisplayMsg = capturedText ? `🎙️ "${capturedText}"` : '🎙️ [رسالة صوتية مسجلة]';

    appendChatMessage('user', userDisplayMsg);
    renderChatQuickReplies([]);

    const messagesBox = document.getElementById('ai-chat-messages-box');
    const loadingId = 'ai-audio-typing-indicator';
    const persona = (typeof Wada3anAiEngine !== 'undefined' && Wada3anAiEngine.getSessionDoctorPersona) ? Wada3anAiEngine.getSessionDoctorPersona() : { name: 'الطبيب' };
    if (messagesBox) {
        const typingEl = document.createElement('div');
        typingEl.id = loadingId;
        typingEl.style.cssText = 'color: #38bdf8; font-size: 0.88em; padding: 10px 14px; display: flex; align-items: center; gap: 10px; background: rgba(15,23,42,0.85); border-radius: 10px; border: 1.5px solid #0284c7; box-shadow: 0 4px 15px rgba(2,132,199,0.25);';
        typingEl.innerHTML = `<span style="animation: spin 1s linear infinite; display: inline-block;">👂</span> ${persona.name} يستمع لتسجيلك ويفهم شكواك...`;
        messagesBox.appendChild(typingEl);
        messagesBox.scrollTop = messagesBox.scrollHeight;
    }

    let result = null;

    // إذا تم التقاط النص اللحظي بنجاح: معالجة فورية خارقة السرعة (Sub-second)
    if (capturedText) {
        // استخراج الاسم والمؤشرات من النص الملتقط فوراً إن وجدت
        if (!clinicalDialogueState.patientName) {
            const forbiddenNames = ['كيف', 'كيفك', 'شو', 'ايش', 'مرحبا', 'أهلا', 'اهلا', 'سلام', 'تعبان', 'مريض', 'دكتور', 'طبيب', 'المريض', 'عندي', 'وجع', 'الم', 'ظهر', 'ديسك'];
            const nameMatch = capturedText.match(/(?:اسمي\s+هو|اسمي|أدعى|ادعى|أنا|انا)\s+([^\s\d,.:؛!?]+)/i);
            if (nameMatch && nameMatch[1] && !forbiddenNames.includes(nameMatch[1].toLowerCase()) && nameMatch[1].length >= 2) {
                clinicalDialogueState.patientName = nameMatch[1];
                refreshUserMessageHeaders(clinicalDialogueState.patientName);
            }
        }

        const nextRes = await Wada3anAiEngine.advanceClinicalDialogue({
            currentStep: clinicalDialogueState.step,
            history: clinicalDialogueState.history,
            painPointTitle: currentSelectedPoint?.title || 'العمود الفقري والمفاصل',
            patientName: clinicalDialogueState.patientName,
            patientVitals: clinicalDialogueState.patientVitals,
            lastUserMessage: capturedText
        });

        result = {
            message: nextRes.message,
            transcription: capturedText,
            quickReplies: nextRes.quickReplies || [],
            nextStep: nextRes.nextStep,
            extractedName: nextRes.extractedName,
            extractedPhone: nextRes.extractedPhone,
            audioUrl: null
        };
    } else {
        // في حال تعذر التقاط النص محلياً: إرسال التسجيل الصوتي المباشر لـ Gemini
        result = await Wada3anAiEngine.advanceClinicalDialogueWithAudio({
            audioBlob,
            mimeType: recordedAudioMimeType,
            painPointTitle: currentSelectedPoint?.title || 'العمود الفقري والمفاصل',
            currentStep: clinicalDialogueState.step,
            history: clinicalDialogueState.history,
            patientName: clinicalDialogueState.patientName
        });
    }

    const indicator = document.getElementById(loadingId);
    if (indicator) indicator.remove();

    if (result) {
        if (result.extractedName && !clinicalDialogueState.patientName) {
            clinicalDialogueState.patientName = result.extractedName;
            refreshUserMessageHeaders(clinicalDialogueState.patientName);
        }
        if (result.extractedPhone && isValidPhoneNumber(result.extractedPhone)) {
            clinicalDialogueState.patientPhone = result.extractedPhone;
        }

        clinicalDialogueState.collectedSymptoms.push(result.transcription || 'رسالة صوتية');
        clinicalDialogueState.step = result.nextStep;

        appendChatMessage('bot', result.message, {
            audioUrl: result.audioUrl,
            transcription: result.transcription
        });

        renderChatQuickReplies(result.quickReplies);


        // حارس رقم الهاتف الإلزامي: يمنع التحويل للتشخيص في الرسائل الصوتية دون رقم هاتف صحيح
        if (clinicalDialogueState.step === 'completed' && isValidPhoneNumber(clinicalDialogueState.patientPhone)) {
            playStationAudio('transition', () => {
                finishChatIntakeAndGenerateReport();
            });
        }
    }
}

// إلغاء التسجيل الصوتي بدون إرسال
function cancelVoiceNoteRecording() {
    if (mediaRecorderInstance && mediaRecorderInstance.state !== 'inactive') {
        mediaRecorderInstance.stop();
    }
    if (liveVoiceRecognitionInstance) {
        try { liveVoiceRecognitionInstance.abort(); } catch (e) {}
        liveVoiceRecognitionInstance = null;
    }
    clearInterval(recordingTimerInterval);
    audioRecordingChunks = [];
    liveVoiceNoteTranscript = '';

    const inputBar = document.getElementById('ai-chat-input-bar');
    const recordingBar = document.getElementById('ai-chat-recording-bar');
    if (recordingBar) recordingBar.style.display = 'none';
    if (inputBar) inputBar.style.display = 'flex';
    showToast('تم إلغاء التسجيل الصوتي', 'info');
}

// زر التحدث في الشات
function toggleChatVoiceSpeech() {
    startVoiceNoteRecording();
}

// تشغيل / إيقاف قراءة التفسير البيوميكانيكي صوتياً في الخطوة 3
function togglePlayAiInsightAudio() {
    const btn = document.getElementById('btn-listen-ai-insight');
    const icon = document.getElementById('ai-audio-icon');
    const text = document.getElementById('ai-audio-text');

    if (currentActiveStationAudio || (typeof Wada3anAiEngine !== 'undefined' && Wada3anAiEngine.isSpeaking)) {
        stopAllActiveAudio();
        if (icon) icon.textContent = '🔊';
        if (text) text.textContent = 'استمع للإرشاد الصوتي للتقرير السريري';
        if (btn) {
            btn.style.background = 'rgba(56, 189, 248, 0.15)';
            btn.style.color = '#38bdf8';
        }
        showToast('تم إيقاف الصوت', 'info');
        return;
    }

    if (btn) {
        btn.style.background = 'rgba(16, 185, 129, 0.25)';
        btn.style.color = '#6ee7b7';
    }
    if (icon) icon.textContent = '⏸️';
    if (text) text.textContent = 'جاري الاستماع للإرشاد... اضغط للإيقاف';

    showToast('جاري تشغيل الإرشاد الصوتي للتقرير السريري 🔊', 'info');

    playStationAudio('diagnosis_guide', () => {
        if (icon) icon.textContent = '🔊';
        if (text) text.textContent = 'استمع للإرشاد الصوتي للتقرير السريري';
        if (btn) {
            btn.style.background = 'rgba(56, 189, 248, 0.15)';
            btn.style.color = '#38bdf8';
        }
    });
}



