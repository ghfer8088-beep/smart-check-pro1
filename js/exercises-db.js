// ==========================================================================
// Smart Check Pro 2.0 - قاعدة بيانات ومحرك وصف التمارين العلاجية المعتمدة
// مركز وداعاً للألم - رسومات توضيحية طبية مطابقة بنسبة 100%
// ==========================================================================

const EXERCISE_IMAGES = {
    // 1. الرقبة والرأس والفك
    chin_tuck: "assets/exercises/custom_cerv_1.jpg",
    neck_lateral_stretch: "assets/exercises/custom_cerv_2.jpg",
    neck_flexion_stretch: "assets/exercises/custom_cerv_2.jpg",
    trapezius_shrug: "assets/exercises/custom_cerv_3.jpg",
    tmj_release: "assets/exercises/tmj_jaw_relief.svg",

    // 2. الكوع والساعد
    tennis_elbow_stretch: "assets/exercises/custom_el_1.jpg",
    golfer_elbow_stretch: "assets/exercises/custom_el_2.jpg",
    forearm_rotation: "assets/exercises/custom_el_3.jpg",

    // 3. الرسغ واليد ونفق الرسغ
    wrist_flexor: "assets/exercises/custom_wr_1.jpg",
    wrist_extensor: "assets/exercises/custom_el_1.jpg",
    finger_extensions: "assets/exercises/custom_wr_2.jpg",
    wrist_curls: "assets/exercises/custom_wr_3.jpg",

    // 4. الكتف ولوح الكتف والصدر
    shoulder_pendulum: "assets/exercises/custom_sh_1.jpg",
    shoulder_cross_stretch: "assets/exercises/custom_sh_2.jpg",
    shoulder_wall_slide: "assets/exercises/custom_sh_4.jpg",
    doorway_chest_stretch: "assets/exercises/custom_th_3.jpg",

    // 5. أسفل الظهر والعمود الفقري
    cat_cow: "assets/exercises/custom_lu_2.jpg",
    child_pose: "assets/exercises/custom_lu_3.jpg",
    press_up_cobra: "assets/exercises/custom_lu_1.jpg",
    glute_bridge: "assets/exercises/custom_lu_4.jpg",
    bird_dog: "assets/exercises/custom_lu_5.jpg",
    lower_trunk_rotation: "assets/exercises/custom_th_1.jpg",
    pelvic_tilt: "assets/exercises/custom_lu_6.jpg",

    // 6. الحوض وعرق النسا والعضلة الكمثرية
    piriformis_figure4: "assets/exercises/custom_si_1.jpg",
    buttocks_stretch: "assets/exercises/custom_si_3.jpg",
    seated_piriformis: "assets/exercises/custom_si_1.jpg",
    pigeon_pose: "assets/exercises/custom_si_1.jpg",
    sciatic_glide: "assets/exercises/custom_si_2.jpg",
    slump_floss: "assets/exercises/custom_si_4.jpg",
    clamshell: "assets/exercises/custom_si_5.jpg",
    hip_flexor: "assets/exercises/custom_si_1.jpg",

    // 7. مفصل الركبة والفخذ
    quad_set: "assets/exercises/custom_kn_1.jpg",
    straight_leg_raise: "assets/exercises/custom_kn_3.jpg",
    terminal_knee_ext: "assets/exercises/custom_kn_2.jpg",
    chair_squat: "assets/exercises/custom_kn_2.jpg",
    knee_to_chest: "assets/exercises/custom_kn_4.jpg",
    hamstring_stretch: "assets/exercises/custom_kn_5.jpg",
    stork_balance: "assets/exercises/custom_kn_3.jpg",

    // 8. الكاحل والقدم ووتر أكيليس
    ankle_bends: "assets/exercises/custom_ank_3.jpg",
    ankle_rotation: "assets/exercises/custom_ank_4.jpg",
    heel_raise_two: "assets/exercises/custom_ank_2.jpg",
    heel_raise_one: "assets/exercises/custom_ank_2.jpg",
    slant_board: "assets/exercises/custom_ank_1.jpg"
};

// خريطة ملفات الصور المخصصة الثابتة المستخرجة على السيرفر لكل تمرين
const EXERCISE_CUSTOM_FILE_MAP = {
    cerv_1: "assets/exercises/custom_cerv_1.jpg",
    cerv_2: "assets/exercises/custom_cerv_2.jpg",
    cerv_3: "assets/exercises/custom_cerv_3.jpg",
    lu_1: "assets/exercises/custom_lu_1.jpg",
    lu_2: "assets/exercises/custom_lu_2.jpg",
    lu_3: "assets/exercises/custom_lu_3.jpg",
    lu_4: "assets/exercises/custom_lu_4.jpg",
    lu_5: "assets/exercises/custom_lu_5.jpg",
    lu_6: "assets/exercises/custom_lu_6.jpg",
    si_1: "assets/exercises/custom_si_1.jpg",
    si_2: "assets/exercises/custom_si_2.jpg",
    si_3: "assets/exercises/custom_si_3.jpg",
    si_4: "assets/exercises/custom_si_4.jpg",
    si_5: "assets/exercises/custom_si_5.jpg",
    sh_1: "assets/exercises/custom_sh_1.jpg",
    sh_2: "assets/exercises/custom_sh_2.jpg",
    sh_3: "assets/exercises/custom_sh_3.jpg",
    sh_4: "assets/exercises/custom_sh_4.jpg",
    th_1: "assets/exercises/custom_th_1.jpg",
    th_2: "assets/exercises/custom_th_2.jpg",
    th_3: "assets/exercises/custom_th_3.jpg",
    kn_1: "assets/exercises/custom_kn_1.jpg",
    kn_2: "assets/exercises/custom_kn_2.jpg",
    kn_3: "assets/exercises/custom_kn_3.jpg",
    kn_4: "assets/exercises/custom_kn_4.jpg",
    kn_5: "assets/exercises/custom_kn_5.jpg",
    ank_1: "assets/exercises/custom_ank_1.jpg",
    ank_2: "assets/exercises/custom_ank_2.jpg",
    ank_3: "assets/exercises/custom_ank_3.jpg",
    ank_4: "assets/exercises/custom_ank_4.jpg",
    el_1: "assets/exercises/custom_el_1.jpg",
    el_2: "assets/exercises/custom_el_2.jpg",
    el_3: "assets/exercises/custom_el_3.jpg",
    wr_1: "assets/exercises/custom_wr_1.jpg",
    wr_2: "assets/exercises/custom_wr_2.jpg",
    wr_3: "assets/exercises/custom_wr_3.jpg",
    ch_1: "assets/exercises/custom_ch_1.jpg",
    ch_2: "assets/exercises/custom_ch_2.jpg",
    ch_3: "assets/exercises/custom_ch_3.jpg"
};

// توليد بطاقة عرض الصورة التوضيحية الطبية المطابقة مع محرك التكييف التلقائي وحماية كاملة
function generateExerciseIllustration(visualType, exerciseId = null, extraData = {}) {
    const customData = (typeof ExerciseImageStudio !== 'undefined' && typeof ExerciseImageStudio.getImage === 'function') 
        ? ExerciseImageStudio.getImage(visualType, exerciseId) 
        : null;
    const isCustom = !!customData;
    const safeExId = exerciseId || visualType || '';
    
    // أولوية اختيار مسار الصورة:
    // 1. صورة مخصصة بالمتصفح
    // 2. ملف الصورة المخصص المحفوظ في assets/exercises/custom_<id>.jpg
    // 3. مسار EXERCISE_IMAGES
    let rawUrl = "assets/exercises/cat_cow.jpg";
    if (isCustom && customData.url) {
        rawUrl = customData.url;
    } else if (safeExId && EXERCISE_CUSTOM_FILE_MAP[safeExId]) {
        rawUrl = EXERCISE_CUSTOM_FILE_MAP[safeExId];
    } else if (visualType && EXERCISE_IMAGES[visualType]) {
        rawUrl = EXERCISE_IMAGES[visualType];
    }

    const imgUrl = (rawUrl || '').trim();
    const fitMode = (isCustom && customData.fitMode) ? customData.fitMode : 'cover';
    const objectFitStyle = fitMode === 'cover' ? 'cover' : 'contain';
    const exTitle = (extraData && extraData.name) ? extraData.name.replace(/"/g, '&quot;') : '';

    return `
        <div class="exercise-illustration-frame" data-visual-type="${visualType || ''}" data-exercise-id="${safeExId}" style="position: relative; width: 100%; aspect-ratio: 1 / 1; max-height: 260px; border-radius: 12px; overflow: hidden; background: #ffffff; border: 1.5px solid rgba(212, 175, 55, 0.4); box-shadow: 0 4px 18px rgba(0,0,0,0.3); margin: 0 auto 14px auto; display: flex; align-items: center; justify-content: center;">
            <img src="${imgUrl}" alt="رسم التمرين الطبي" loading="lazy" class="exercise-illustration-img"
                 onerror="if (!this.dataset.fallbackApplied) { this.dataset.fallbackApplied = 'true'; this.src = 'assets/exercises/cat_cow.jpg'; } else { this.style.display = 'none'; }"
                 style="width: 100%; height: 100%; object-fit: ${objectFitStyle}; display: block;">

            ${(typeof isUserAdmin === 'function' && isUserAdmin()) ? `
            <!-- زر تخصيص وتغيير الصورة وتكييفها تلقائياً خاص بالأدمن فقط -->
            <button type="button" onclick="event.stopPropagation(); if (typeof ExerciseImageStudio !== 'undefined') ExerciseImageStudio.openModal('${safeExId}', '${visualType || ''}', '${exTitle}');"
                    title="إضافة أو تغيير وتكييف صورة هذا التمرين تلقائياً"
                    class="btn-customize-exercise-img no-print"
                    style="position: absolute; bottom: 8px; left: 8px; background: rgba(15, 23, 42, 0.88); color: #cbd5e1; border: 1px solid rgba(212, 175, 55, 0.5); border-radius: 6px; padding: 4px 9px; font-size: 0.76em; cursor: pointer; display: flex; align-items: center; gap: 4px; z-index: 3; transition: all 0.2s;">
                📷 <span>تغيير الصورة</span>
            </button>
            ` : ''}
        </div>
    `;
}

// توليد دليل التكنيك السريري السليم والخطأ الشائع القابل للطي (Dos & Don'ts Toggle)
function getExerciseFormGuideHTML(ex = {}) {
    const tips = typeof getExerciseFormTips === 'function' ? getExerciseFormTips(ex) : {
        correct: "حافظ على استقامة العمود الفقري وتنفس بعمق وهدوء دون أي ارتداد عنيف.",
        mistake: "حبس النفس أثناء التمرين أو التحميل المفاجئ بالقوة."
    };

    return `
        <div class="exercise-form-guide" style="margin: 10px 0 12px 0;">
            <button type="button" onclick="toggleExerciseFormTip(this)" style="width: 100%; background: rgba(212, 175, 55, 0.08); border: 1px dashed var(--primary-gold); color: var(--primary-gold); font-size: 0.82em; font-weight: bold; padding: 7px 12px; border-radius: 6px; cursor: pointer; display: flex; align-items: center; justify-content: space-between; transition: all 0.2s;">
                <span style="display: flex; align-items: center; gap: 6px;">🎯 التكنيك السريري السليم vs أخطاء شائعة</span>
                <span class="toggle-icon" style="font-size: 0.8em; color: var(--primary-gold);">▼</span>
            </button>
            <div class="form-tip-content" style="display: none; background: #060a10; border: 1px solid #1e293b; border-radius: 8px; padding: 12px; margin-top: 6px; font-size: 0.82em; line-height: 1.6; text-align: right;">
                <div style="color: #10b981; margin-bottom: 8px; background: rgba(16, 185, 129, 0.08); padding: 8px 10px; border-radius: 6px; border-right: 3px solid #10b981;">
                    <strong style="color: #6ee7b7;">✅ الطريقة السريرية الصحيحة:</strong><br>${tips.correct}
                </div>
                <div style="color: #ef4444; background: rgba(239, 68, 68, 0.08); padding: 8px 10px; border-radius: 6px; border-right: 3px solid #ef4444;">
                    <strong style="color: #fca5a5;">❌ تجنب هذا الخطأ الشائع:</strong><br>${tips.mistake}
                </div>
            </div>
        </div>
    `;
}

function toggleExerciseFormTip(buttonEl) {
    const parent = buttonEl.closest('.exercise-form-guide');
    if (!parent) return;
    const content = parent.querySelector('.form-tip-content');
    const icon = buttonEl.querySelector('.toggle-icon');
    if (!content) return;
    if (content.style.display === 'none' || !content.style.display) {
        content.style.display = 'block';
        if (icon) icon.textContent = '▲';
        buttonEl.style.background = 'rgba(212, 175, 55, 0.18)';
    } else {
        content.style.display = 'none';
        if (icon) icon.textContent = '▼';
        buttonEl.style.background = 'rgba(212, 175, 55, 0.08)';
    }
}

// دالة موحدة لتطبيع موضع الألم التشريحي ودعم الأسماء والمصطلحات العربية والإنجليزية بدقة تامة
function normalizeAnatomicalRegionKey(pointId = '') {
    if (!pointId) return 'lumbar';
    const s = String(pointId).toLowerCase().trim();

    // 1. حالات الرسغ واليد والأصابع ونفق الرسغ
    if (/(?:معصم|رسغ|نفق\s*رسغ|كف|أصابع|اصابع|إبهام|ابهام|يد|wrist|carpal|hand|finger)/i.test(s)) {
        return 'wrist';
    }
    // 2. حالات الكوع والساعد
    if (/(?:كوع|مرفق|ساعد|elbow)/i.test(s)) {
        return 'elbow';
    }
    // 3. حالات الكتف والكفة المدورة ولوح الكتف
    if (/(?:كتف|كفة\s*مدورة|لوح\s*الكتف|rotator|scapula|shoulder)/i.test(s) && !/(?:عنق|رقب|صدر)/i.test(s)) {
        return 'shoulder';
    }
    // 4. حالات الرقبة والفقرات العنقية والصداع
    if (/(?:رقب|عنق|صداع|رأس|cervical|neck|head)/i.test(s)) {
        return 'cervical';
    }
    // 5. حالات أعلى الظهر والفقرات الصدرية والأبهر وعضلة شبه المنحرفة
    if (/(?:أبهر|ابهر|شبه\s*منحرف|trapezius|صدر|بين\s*الكتفين|thoracic|chest|rib|sternum)/i.test(s)) {
        return 'thoracic';
    }
    // 6. حالات مفصل الفك الصدغي
    if (/(?:فك|صدغ|أسنان|صرير|jaw|tmj)/i.test(s)) {
        return 'jaw';
    }
    // 7. حالات الركبة والفخذ والصابونة
    if (/(?:ركب|صابون|فخذ|غضروف\s*الركبة|knee|patella|hamstring)/i.test(s)) {
        return 'knee';
    }
    // 8. حالات الكاحل والقدم وباطن القدم ووتر أكيليس والسمانة
    if (/(?:كاحل|قدم|كعب|أخمص|اخمص|لفافة|أكيليس|اكيليس|سمان|ankle|achilles|foot|plantar|heel|calf|37515)/i.test(s)) {
        return 'ankle';
    }
    // 9. حالات الحوض والمفصل العجزي وعرق النسا والكمثرية
    if (/(?:عرق\s*النسا|عرق\s*نسا|كمثر|عجز|عصعص|حوض|ورِك|ورك|ألي|الي|sacroiliac|piriformis|pelvis|hip|gluteal|sciatica)/i.test(s)) {
        return 'si_joint';
    }
    // 10. حالات أسفل الظهر والفقرات القطنية
    if (/(?:قطن|أسفل\s*الظهر|اسفل\s*الظهر|lumbar|lower_back|l4|l5|s1|disc|ديسك)/i.test(s)) {
        return 'lumbar';
    }

    return s;
}
if (typeof window !== 'undefined') {
    window.normalizeAnatomicalRegionKey = normalizeAnatomicalRegionKey;
}

// دالة جلب إعدادات الأسئلة الحركية والسلوكية ونوعية النوم المخصصة لكل موضع ألم
function getAnatomicalDailyAssessmentConfig(pointId = '') {
    const norm = normalizeAnatomicalRegionKey(pointId);
    let pId = (pointId || "").toLowerCase();
    if (norm) {
        pId = `${pId} ${norm}`;
    }

    if (pId.includes('cervical') || pId.includes('neck') || pId.includes('head') || pId.includes('trapezius')) {
        return {
            mobilityQuestion: "2. كيف تصف حركة الرقبة والرأس والكتفين اليوم؟",
            mobilityOptions: [
                { val: 95, text: "التفاف كامل وسلس للرأس يميناً ويساراً دون شد أو صداع (95%)" },
                { val: 75, text: "تحسن في حركة الرقبة مع شد طفيف عند أقصى الالتفاف أو رفع الرأس (75%)" },
                { val: 45, text: "صعوبة وتيبس في الالتفاف أثناء القيادة أو النظر للجانب (45%)" },
                { val: 20, text: "تصلب وتيبس شديد يمنع تحريك الرأس وصداع ممتد (20%)" }
            ],
            sleepQuestion: "3. كيف كانت راحة الرقبة ونومك الليلة الماضية؟",
            sleepOptions: [
                { val: 95, text: "نوم عميق دون استيقاظ من خدر الذراعين أو تشنج الرقبة (95%)" },
                { val: 75, text: "نوم جيد مع انزعاج خفيف عند تغيير وضعية الوسادة (75%)" },
                { val: 45, text: "استيقاظ متكرر وتيبس بالرقبة والكتف في الصباح (45%)" },
                { val: 20, text: "أرق شديد بسبب ألم الرقبة أو صداع خلف الرأس (20%)" }
            ],
            positiveBehaviors: [
                { id: "beh-exercise", text: "نفذت تمارين استقامة واستطالة الرقبة والأبهر" },
                { id: "beh-posture", text: "حافظت على مستوى الشاشة أمام العينين وتجنبت حني الرأس" },
                { id: "beh-pillow", text: "استخدمت وسادة طبية بارتفاع مريح يدعم منحنى العنق" },
                { id: "beh-heat", text: "استخدمت كمادات دافئة لتليين عضلات الرقبة والكتفين" }
            ],
            negativeBehaviors: [
                { id: "neg-phone", text: "انحناء طويل للرقبة أثناء التحديق بالهاتف (Text-Neck)" },
                { id: "neg-pillow", text: "نوم على وسادة مرتفعة جداً أو وسائد متعددة" },
                { id: "neg-cold", text: "التعرض لتيار هواء بارد ومباشر على الرقبة" },
                { id: "neg-shoulder", text: "حمل حقيبة ثقيلة على كتف واحد لفترة طويلة" }
            ]
        };
    } else if (pId.includes('shoulder') || pId.includes('scapula') || pId.includes('elbow') || pId.includes('wrist')) {
        return {
            mobilityQuestion: "2. كيف تصف حركة الذراع والكتف واستخدام اليد اليوم؟",
            mobilityOptions: [
                { val: 95, text: "رفع الذراع فوق الرأس وتمشيط الشعر بحرية تامة وبلا ألم (95%)" },
                { val: 75, text: "تحسن ملحوظ مع انزعاج طفيف عند مد اليد خلف الظهر (75%)" },
                { val: 45, text: "صعوبة في ارتداء الملابس أو رفع الذراع للأعلى (45%)" },
                { val: 20, text: "تجمد حركي شديد وألم حاد عند أي حركة للكتف والذراع (20%)" }
            ],
            sleepQuestion: "3. كيف كانت راحة الكتف والذراع أثناء النوم؟",
            sleepOptions: [
                { val: 95, text: "نوم عميق ومريح دون ألم في الكتف أو تنميل بالأصابع (95%)" },
                { val: 75, text: "نوم جيد مع تجنب النوم المباشر على الجانب المصاب (75%)" },
                { val: 45, text: "استيقاظ عند الانقلاب على الكتف أو خدر متقطع باليد (45%)" },
                { val: 20, text: "ألم ليلي نابض يمنع النوم على الكتف المصاب تماماً (20%)" }
            ],
            positiveBehaviors: [
                { id: "beh-exercise", text: "أديت تمارين البندول وتليين محفظة الكتف بانتظام" },
                { id: "beh-rest", text: "دعمت الذراع بوسادة مريحة أثناء الجلوس والقراءة" },
                { id: "beh-posture", text: "حافظت على إرجاع الكتفين للخلف واستقامة الصدر" },
                { id: "beh-heat", text: "استخدمت الكمادات المهدئة للكتف قبل النوم" }
            ],
            negativeBehaviors: [
                { id: "neg-sleep_side", text: "النوم المباشر على مفصل الكتف المصاب" },
                { id: "neg-overhead", text: "رفع أوزان أو مد الذراع لأعلى بشكل مفاجئ" },
                { id: "neg-bag", text: "حمل أكياس أو حقائب ثقيلة بنفس اليد المصابة" },
                { id: "neg-mouse", text: "استخدام الماوس أو الهاتف بوضعية يد معلقة بلا سند" }
            ]
        };
    } else if (pId.includes('knee') || pId.includes('ankle') || pId.includes('foot') || pId.includes('achilles') || pId.includes('calf') || pId.includes('37515')) {
        return {
            mobilityQuestion: "2. كيف تصف حركة الركبة والقدم وقدرتك على المشي اليوم؟",
            mobilityOptions: [
                { val: 95, text: "مشي مريح وصعود الدرج والسجود في الصلاة بسلاسة (95%)" },
                { val: 75, text: "تحسن في المشي مع ثقل خفيف عند نزول الدرج أو الوقوف الطويل (75%)" },
                { val: 45, text: "صعوبة في ثني المفصل بالكامل أو طقطقة وألم عند المشي (45%)" },
                { val: 20, text: "عجز عن الضغط على المفصل وصعوبة بالغة في الوقوف والمشي (20%)" }
            ],
            sleepQuestion: "3. كيف كانت راحة الساقين والمفاصل أثناء النوم؟",
            sleepOptions: [
                { val: 95, text: "نوم عميق دون تقلصات بالسمانة أو نبض في المفصل (95%)" },
                { val: 75, text: "نوم جيد مع راحة تامة عند وضع وسادة خفيفة بين الركبتين (75%)" },
                { val: 45, text: "استيقاظ بسبب تيبس المفصل أو حرقان في الكعب/القدم (45%)" },
                { val: 20, text: "ألم ليلي مستمر وتيبس شديد عند محاولة النهوض (20%)" }
            ],
            positiveBehaviors: [
                { id: "beh-exercise", text: "التزمت بتمارين تقوية الفخذ وإطالة وتر الكعب" },
                { id: "beh-shoes", text: "ارتديت حذاءً طبياً ممتصاً للصدمات وداعماً للقدم" },
                { id: "beh-rest", text: "أخذت فترات راحة وتجنبت الوقوف المتواصل الطويل" },
                { id: "beh-ice_heat", text: "استخدمت الكمادات المناسبة بعد المشي" }
            ],
            negativeBehaviors: [
                { id: "neg-squat", text: "جلوس القرفصاء أو ثني الركبة الحاد بزاوية ضيقة" },
                { id: "neg-flat_shoes", text: "المشي حافي القدمين على أرضيات صلبة أو بحذاء غير مريح" },
                { id: "neg-standing", text: "وقوف طويل متواصل لأكثر من 45 دقيقة دون راحة" },
                { id: "neg-stairs", text: "صعود ونزول الدرج بسرعة ودون الاستناد" }
            ]
        };
    } else {
        // أسفل الظهر وعرق النسا والحوض (الافتراضي للظهر)
        return {
            mobilityQuestion: "2. كيف تصف حركة ظهرك وقدرتك على الانحناء والمشي اليوم؟",
            mobilityOptions: [
                { val: 95, text: "سجود كامل في الصلاة وانحناء مريح لربط الحذاء دون ألم (95%)" },
                { val: 75, text: "تحسن كبير في المشي والوقوف مع شد خفيف بأسفل الظهر (75%)" },
                { val: 45, text: "صعوبة في الوقوف بعد الجلوس وتيبس يستغرق وقتاً ليلين (45%)" },
                { val: 20, text: "ألم حاد يمنع الانحناء والجلوس مع خدر في الساق (20%)" }
            ],
            sleepQuestion: "3. كيف كانت راحة ظهرك وعمق نومك الليلة الماضية؟",
            sleepOptions: [
                { val: 95, text: "نوم عميق ومريح دون استيقاظ من نوبات ألم الظهر أو عرق النسا (95%)" },
                { val: 75, text: "نوم جيد مع راحة تامة عند وضع وسادة تحت أو بين الركبتين (75%)" },
                { val: 45, text: "استيقاظ متكرر عند التقلب وصعوبة بإيجاد وضعية مسكنة (45%)" },
                { val: 20, text: "أرق شديد بسبب نغزات كهربائية أو خدر مستمر بالساق (20%)" }
            ],
            positiveBehaviors: [
                { id: "beh-exercise", text: "نفذت تمارين تمديد الفقرات وإطالة عرق النسا بانتظام" },
                { id: "beh-posture", text: "حافظت على استقامة الظهر واستخدمت دعامة لأسفل الظهر" },
                { id: "beh-walk", text: "قمت بالمشي الخفيف لتغذية الديسك وتنشيط التروية" },
                { id: "beh-heat", text: "استخدمت الكمادات الدافئة لتفكيك تشنج العضلات الشوكية" }
            ],
            negativeBehaviors: [
                { id: "neg-sitting", text: "جلوس متواصل لأكثر من ساعة دون حركة وتمدد" },
                { id: "neg-lifting", text: "انحناء من الخصر لحمل وزن بدلاً من ثني الركبتين" },
                { id: "neg-stomach_sleep", text: "النوم على البطن مما يزيد قوس الظهر والضغط على الديسك" },
                { id: "neg-soft_seat", text: "الجلوس على مقاعد لينة جداً أو مترهلة تدفع الحوض للخلف" }
            ]
        };
    }
}

// فهرس التمارين المصنفة حسب المنطقة لخدمة مكتبة التمارين
const MASTER_EXERCISES_CATALOG = {
    // 1. الرقبة والرأس
    cervical: [
        {
            id: "cerv_1",
            name: "تمرين تراجع الذقن واستقامة الفقرات العنقية",
            scientificName: "Chin Tuck & Cervical Retraction",
            visualType: "chin_tuck",
            description: "تفريغ الضغط الغضروفي عن جذور الأعصاب العنقية وإعادة الرأس لمركزه الميكانيكي الطبيعي.",
            instructions: "1. اجلس بظهر مستقيم واجعل نظرك للأمام مباشرة.\n2. اسحب ذقنك ورأسك أفقياً للخلف لصنع ذقن مزدوج.\n3. اثبت 5 ثوانٍ ثم استرخِ. كرر 10 مرات.",
            reps: "10 تكرارات",
            sets: "3 جولات",
            duration: "دقيقة ونصف",
            durationSec: 90
        },
        {
            id: "cerv_2",
            name: "إطالة الرقبة الجانبية والعضلة شبه المنحرفة",
            scientificName: "Lateral Cervical Stretch",
            visualType: "neck_lateral_stretch",
            description: "فك التشنج الليفي والتصاقات عضلات الرقبة الجانبية والصداع التوتري.",
            instructions: "1. أمل رأسك بلطف نحو كتفك الأيمن مع بقاء الكتفين مسترخيين.\n2. ضع يدك اليمنى برفق فوق رأسك لتثبيت الإطالة.\n3. اثبت 20 ثانية ثم كرر للجهة المقابلة.",
            reps: "3 مرات لكل جانب",
            sets: "3 جولات",
            duration: "دقيقتان",
            durationSec: 120
        },
        {
            id: "cerv_3",
            name: "تمرين رفع وهز الكتفين لتنشيط التروية الدموية",
            scientificName: "Trapezius Shoulder Shrugs",
            visualType: "trapezius_shrug",
            description: "تنشيط التدفق الدموي وفك العقد العضلية بين الرقبة وأعلى الكتف.",
            instructions: "1. ارفع كتفيك للأعلى نحو أذنيك واثبت ثانيتين.\n2. أنزلهما ببطء واسترخِ تماماً. كرر 12 مرة.",
            reps: "12 تكراراً",
            sets: "3 جولات",
            duration: "دقيقة ونصف",
            durationSec: 90
        }
    ],

    // 2. أسفل الظهر والديسك
    lumbar: [
        {
            id: "lu_1",
            name: "تمرين تمديد الفقرات القطنية ودفع الديسك للمركز (ماكنزي)",
            scientificName: "McKenzie Lumbar Extension / Press-Up",
            visualType: "press_up_cobra",
            description: "تفريغ الضغط عن جذر العصب المضغوط وإعادة توجيه نواة الغضروف للمركز.",
            instructions: "1. استلقِ على بطنك وضع كفيك تحت كتفيك.\n2. ادفع بذراعيك لرفع صدرك للأعلى مع إبقاء حوضك مسترخياً على الأرض.\n3. اثبت ثانيتين ثم اخفض صدرك ببطء. كرر 10 مرات.",
            reps: "10 تكرارات",
            sets: "3 جولات",
            duration: "دقيقتان",
            durationSec: 120
        },
        {
            id: "lu_2",
            name: "تمرين القطة والبقرة لتليين العمود الفقري",
            scientificName: "Cat-Cow Spine Mobilization",
            visualType: "cat_cow",
            description: "استعادة تدفق السائل المغذي للغضاريف وتليين مفاصل الظهر المتصلبة.",
            instructions: "1. اتخذ وضعية الارتكاز على اليدين والركبتين.\n2. مع الشهيق: أنزل بطنك وارفع صدرك.\n3. مع الزفير: قوس ظهرك للأعلى واسحب سرتك للداخل. كرر 10 مرات.",
            reps: "10 تكرارات",
            sets: "3 جولات",
            duration: "دقيقتان",
            durationSec: 120
        },
        {
            id: "lu_3",
            name: "وضعية الطفل لتفريغ ضغط الديسك والمفاصل",
            scientificName: "Child's Pose Lumbar Decompression",
            visualType: "child_pose",
            description: "تفريغ فوري للضغط الانضغاطي بين الفقرات L4-L5 و L5-S1.",
            instructions: "1. اركع على الأرض مع مباعدة الركبتين.\n2. اخفض حوضك نحو كعبيك ومد ذراعيك للأمام مع إنزال الصدر للأسفل.\n3. اثبت 30 ثانية مع تنفس هادئ.",
            reps: "3 مرات",
            sets: "جولتان",
            duration: "دقيقتان",
            durationSec: 120
        },
        {
            id: "lu_4",
            name: "تمرين الجسر الحوضي لبناء ثبات الظهر (Glute Bridge)",
            scientificName: "Glute Bridge Core Stability",
            visualType: "glute_bridge",
            description: "تقوية عضلات الأرداف وأسفل الظهر لدعم العمود الفقري.",
            instructions: "1. استلقِ على ظهرك واثنِ ركبتيك.\n2. ارفع حوضك للأعلى حتى يشكل جسمك خطاً مستقيماً.\n3. اثبت 3 ثوانٍ مع شد الأرداف ثم انزل ببطء. كرر 10 مرات.",
            reps: "10 تكرارات",
            sets: "3 جولات",
            duration: "دقيقتان",
            durationSec: 120
        },
        {
            id: "lu_5",
            name: "تمرين الطائر الكلب لبناء ثبات الجذع (Bird-Dog)",
            scientificName: "Bird-Dog Core Stability",
            visualType: "bird_dog",
            description: "تقوية العضلات العميقة المثبتة للعمود الفقري لمنع تكرار آلام الظهر.",
            instructions: "1. من وضعية الطاولة، مد ذراعك اليمنى للأمام وساقك اليسرى للخلف في خط مستقيم.\n2. اثبت 3 ثوانٍ مع الحفاظ على ثبات الحوض. كرر للجهة الأخرى.",
            reps: "10 تكرارات",
            sets: "3 جولات",
            duration: "دقيقتان",
            durationSec: 120
        },
        {
            id: "lu_6",
            name: "تمرين إمالة الحوض لتخفيف ضغط الفقرات القطنية (Pelvic Tilt)",
            scientificName: "Posterior Pelvic Tilt Decompression",
            visualType: "pelvic_tilt",
            description: "تسطيح قوس أسفل الظهر وتفريغ الضغط عن مفاصل الفقرات الخلفية وتنشيط عضلات البطن العميقة.",
            instructions: "1. استلقِ على ظهرك مع ثني الركبتين ووضع القدمين منبسطتين على الأرض.\n2. شد عضلات بطنك بلطف واضغط أسفل ظهرك باتجاه الأرض لإلغاء القوس الطبيعي.\n3. اثبت 5 ثوانٍ مع التنفس الطبيعي ثم استرخِ. كرر 10 مرات.",
            reps: "10 تكرارات",
            sets: "3 جولات",
            duration: "دقيقة ونصف",
            durationSec: 90
        }
    ],

    // 3. عرق النسا والحوض والمفصل العجزي
    si_joint: [
        {
            id: "si_1",
            name: "إطالة العضلة الكمثرية ومسار عرق النسا (شكل 4)",
            scientificName: "Figure-4 Piriformis & Sciatic Release",
            visualType: "piriformis_figure4",
            description: "تحرير العصب الوركي من انضغاط العضلة الكمثرية وموازنة مفاصل الحوض.",
            instructions: "1. استلقِ على ظهرك وضع كاحل الرجل المصابة فوق ركبة الرجل الأخرى.\n2. اسحب فخذك السليم نحو صدرك حتى تشعر بإطالة في منتصف الأرداف.\n3. اثبت 25 ثانية وكرر 3 مرات.",
            reps: "3 مرات لكل جهة",
            sets: "3 جولات",
            duration: "دقيقتان",
            durationSec: 120
        },
        {
            id: "si_2",
            name: "تمرين انزلاق العصب الوركي على الكرسي (Sciatic Glide)",
            scientificName: "Seated Sciatic Nerve Glide",
            visualType: "sciatic_glide",
            description: "تليين مسار العصب الوركي وتفريغ الالتصاقات على طول الساق والفخذ.",
            instructions: "1. اجلس على كرسي بظهر مستقيم.\n2. افرد ركبة الساق المصابة مع رفع مشط القدم للأعلى وإرجاع الرأس للخلف معاً.\n3. اخفض القدم واثنِ الرأس للأمام. كرر 10 مرات.",
            reps: "10 تكرارات",
            sets: "3 جولات",
            duration: "دقيقتان",
            durationSec: 120
        },
        {
            id: "si_3",
            name: "إطالة عضلات الأرداف العميقة المستلقية",
            scientificName: "Supine Buttocks Stretch",
            visualType: "buttocks_stretch",
            description: "فك الالتصاقات العضلية حول المفصل العجزي الحوضي.",
            instructions: "1. استلقِ على ظهرك واسحب ركبتك المصابة بيدك نحو الكتف المعاكس.\n2. اثبت 20 ثانية وكرر 3 مرات.",
            reps: "3 مرات",
            sets: "جولتان",
            duration: "دقيقتان",
            durationSec: 120
        },
        {
            id: "si_4",
            name: "تمرين تحرير المسار العصبي (Slump Nerve Floss)",
            scientificName: "Slump Neural Flossing",
            visualType: "slump_floss",
            description: "تحرير العصب وتسكين لسعات التنميل في الفخذ وبطة الساق.",
            instructions: "1. اجلس بظهر منحني قليلاً مع تقويس الرقبة لأسفل.\n2. افرد ساقك ومد مشط قدمك للأعلى بالتزامن مع رفع الرأس.\n3. كرر 8 مرات بسلاسة.",
            reps: "8 تكرارات",
            sets: "جولتان",
            duration: "دقيقة ونصف",
            durationSec: 90
        },
        {
            id: "si_5",
            name: "تمرين الصدفة لتقوية عضلات الحوض والورك (Clamshell)",
            scientificName: "Clamshell Hip Abductor Strengthening",
            visualType: "clamshell",
            description: "تقوية العضلة الألوية الوسطى وتثبيت حزام الحوض وتخفيف الحمل عن المفصل العجزي الحوضي.",
            instructions: "1. استلقِ على جنبك السليم مع ثني الركبتين بزاوية 45 درجة وإبقاء الكعبين متلامسين.\n2. ارفع الركبة العلوية للأعلى ببطء دون تحريك الحوض أو لفه للخلف.\n3. اثبت ثانيتين في القمة ثم أنزل ببطء. كرر 10 مرات لكل جهة.",
            reps: "10 تكرارات لكل جهة",
            sets: "3 جولات",
            duration: "دقيقتان",
            durationSec: 120
        }
    ],

    // 4. مفصل الكتف والكفة المدورة
    shoulder: [
        {
            id: "sh_1",
            name: "تمرين بندول كودمان لتفريغ ضغط الكتف (Codman Pendulum)",
            scientificName: "Codman Pendulum Decompression",
            visualType: "shoulder_pendulum",
            description: "تفريغ الضغط عن أوتار الكفة المدورة وزيادة تدفق السائل الزلالي داخل المفصل.",
            instructions: "1. انحنِ للأمام واستند بيدك السليمة على طاولة.\n2. دع الذراع المصابة تتدلى بحرية لأسفل كالبندول تماماً.\n3. حرك جذعك بلطف لتدور الذراع في دوائر صغيرة دون تشغيل عضلات الكتف.\n4. كرر لمدة دقيقة باتجاه عقارب الساعة ثم عكسها.",
            reps: "دقيقة كاملة",
            sets: "جولتان",
            duration: "دقيقتان",
            durationSec: 120
        },
        {
            id: "sh_2",
            name: "تمرين إطالة الكبسولة الخلفية للكتف عبر الصدر (Cross-Body Stretch)",
            scientificName: "Posterior Shoulder Capsule Stretch",
            visualType: "shoulder_cross_stretch", // ✅ صورة مطابقة لإطالة الكتف
            description: "إطالة الكبسولة المفصلية الخلفية للكتف وتخفيف احتكاك الأوتار العلوية واستعادة حرية حركة الذراع.",
            instructions: "1. قف أو اجلس بظهر مستقيم.\n2. اسحب ذراعك المصابة أفقياً عبر صدرك بيدك الأخرى برفق حتى تشعر بإطالة في ظهر الكتف.\n3. اثبت 25 ثانية مع تنفس هادئ. كرر 3 مرات.",
            reps: "3 مرات لكل جهة",
            sets: "3 جولات",
            duration: "دقيقتان",
            durationSec: 120
        },
        {
            id: "sh_3",
            name: "تمرين الشد الثابت للكفة المدورة وتثبيت الكتف (Isometric Rotator Cuff)",
            scientificName: "Isometric Rotator Cuff Activation",
            visualType: "forearm_rotation",
            description: "تنشيط وتثبيت عضلات الكفة المدورة بدون احتكاك بالمفصل لحماية أوتار الكتف من التمزق.",
            instructions: "1. اثنِ كوعك بزاوية 90 درجة وثبته بجانب خصرك.\n2. اضغط بظهر يدك برفق ضد جدار ثابت لمدة 6 ثوانٍ دون تحريك مفصل الكتف.\n3. استرخِ وكرر 10 مرات.",
            reps: "10 تكرارات",
            sets: "3 جولات",
            duration: "دقيقة ونصف",
            durationSec: 90
        },
        {
            id: "sh_4",
            name: "تمرين انزلاق الذراعين على الحائط لثبات لوح الكتف (Scapular Wall Slide)",
            scientificName: "Scapular Wall Slides",
            visualType: "shoulder_wall_slide",
            description: "إعادة التنسيق الحركي بين لوح الكتف ومفصل العضد لتمكين رفع الذراع فوق الرأس دون انضغاط.",
            instructions: "1. قف بمواجهة الحائط وضع ساعديك عليه.\n2. انزلق ببطء بذراعيك للأعلى مع الحفاظ على استقامة الظهر.\n3. اثبت ثانيتين ثم انزل ببطء. كرر 10 مرات.",
            reps: "10 تكرارات",
            sets: "3 جولات",
            duration: "دقيقتان",
            durationSec: 120
        }
    ],

    // 5. مفصل الكوع والساعد
    elbow: [
        {
            id: "el_1",
            name: "إطالة أوتار الكوع الخارجية (مرفق التنس)",
            scientificName: "Wrist Extensor Eccentric Stretch",
            visualType: "tennis_elbow_stretch",
            description: "فك تشنج أوتار الكوع الخارجية وتخفيف التهاب البروز العظمي (Tennis Elbow).",
            instructions: "1. مد ذراعك للأمام مع توجيه راحة اليد لأسفل واستقامة الكوع.\n2. اثنِ معصمك للأسفل واضغط برفق باليد الأخرى حتى تشعر بإطالة على ظهر الساعد والكوع.\n3. اثبت 25 ثانية وكرر 3 مرات.",
            reps: "3 مرات لكل جهة",
            sets: "3 جولات",
            duration: "دقيقة ونصف",
            durationSec: 90
        },
        {
            id: "el_2",
            name: "إطالة أوتار الكوع والرسغ الداخلية (مرفق الجولف)",
            scientificName: "Wrist Flexor Stretch",
            visualType: "golfer_elbow_stretch",
            description: "تسكين ألم الكوع الداخلي وتحرير الضغط عن الأوتار القابضة.",
            instructions: "1. مد ذراعك للأمام مع توجيه راحة اليد للأعلى.\n2. اثنِ المعصم للخلف باليد الأخرى برفق.\n3. اثبت 20 ثانية وكرر 3 مرات.",
            reps: "3 مرات",
            sets: "جولتان",
            duration: "دقيقة ونصف",
            durationSec: 90
        },
        {
            id: "el_3",
            name: "تمرين تدوير الساعد (Pronation & Supination)",
            scientificName: "Forearm Rotation Mobilization",
            visualType: "forearm_rotation",
            description: "استعادة حركة دوران الكوع والساعد دون احتكاك أو طقطقة مؤلمة.",
            instructions: "1. اثنِ كوعك بزاوية 90 درجة وثبته بجانب خصرك.\n2. أدر راحة يدك للأعلى بالكامل، ثم أدرها للأسفل بالكامل ببطء.\n3. كرر 12 مرة متتالية.",
            reps: "12 تكراراً",
            sets: "3 جولات",
            duration: "دقيقة ونصف",
            durationSec: 90
        }
    ],

    // 6. مفصل الرسغ واليد ونفق الرسغ
    wrist: [
        {
            id: "wr_1",
            name: "إطالة أوتار الرسغ وتفريغ النفق الرسغي",
            scientificName: "Wrist Flexor & Carpal Tunnel Stretch",
            visualType: "wrist_flexor",
            description: "تفريغ الضغط عن العصب الأوسط وتسكين التنميل في كف اليد والأصابع.",
            instructions: "1. مد ذراعك للأمام مع استقامة الكوع وجعل راحة يدك للأمام.\n2. بيدك الأخرى اسحب أصابعك بلطف للخلف حتى تشعر بإطالة في بطن الساعد والرسغ.\n3. اثبت 20 ثانية وكرر 3 مرات.",
            reps: "3 تكرارات لكل يد",
            sets: "3 جولات",
            duration: "دقيقة ونصف",
            durationSec: 90
        },
        {
            id: "wr_2",
            name: "تمرين تمديد وبسط الأصابع وتفريغ الاحتقان",
            scientificName: "Finger Extensions & Tendon Gliding",
            visualType: "finger_extensions",
            description: "تحرير أوتار الأصابع واستعادة المرونة ومنع التصاقات الأنسجة في الكف.",
            instructions: "1. ابدأ بقبضة يد مغلقة برفق.\n2. باعد بين أصابعك وافردها لأقصى مدى ممكن لمدة 5 ثوانٍ.\n3. ضم الأصابع ببطء وكرر 10 مرات متتالية.",
            reps: "10 تكرارات",
            sets: "3 جولات",
            duration: "دقيقة",
            durationSec: 60
        },
        {
            id: "wr_3",
            name: "تمرين ثني وتدوير الرسغ لتقوية الأوتار",
            scientificName: "Wrist Curls & Mobilization",
            visualType: "wrist_curls",
            description: "بناء الثبات المفصلي للرسغ وحماية الأوتار من الإجهاد المتكرر.",
            instructions: "1. أسند ساعدك على طاولة مع تدلي معصمك فوق الحافة.\n2. ارفع يدك لأعلى ببطء ثم اخفضها لأسفل بأقصى مدى مريح.\n3. كرر 12 تكراراً.",
            reps: "12 تكراراً",
            sets: "جولتان",
            duration: "دقيقة ونصف",
            durationSec: 90
        }
    ],

    // 7. مفصل الركبة والفخذ
    knee: [
        {
            id: "kn_1",
            name: "تمرين الشد الثابت للعضلة الرباعية (Quad Set)",
            scientificName: "Isometric Quadriceps Set",
            visualType: "quad_set",
            description: "تنشيط العضلة الفخذية وتثبيت صابونة الركبة بدون أي احتكاك بالمفصل.",
            instructions: "1. اجلس مع فرد ساقك للأمام وضع منشفة صغيرة تحت ركبتك.\n2. اضغط بظهر ركبتك لأسفل ضد المنشفة مع شد عضلات الفخذ وسحب مشط القدم نحوك.\n3. اثبت 6 ثوانٍ ثم استرخِ. كرر 12 مرة.",
            reps: "12 تكراراً",
            sets: "3 جولات",
            duration: "دقيقتان",
            durationSec: 120
        },
        {
            id: "kn_2",
            name: "تمرين فرد الركبة النهائي لتصحيح المسار (TKE)",
            scientificName: "Terminal Knee Extension",
            visualType: "terminal_knee_ext",
            description: "تقوية ألياف العضلة المتسعة الإنسية VMO المسؤولة عن توجيه صابونة الركبة.",
            instructions: "1. استلقِ وضع أسطوانة أو منشفة ملفوفة كبيرة تحت ركبتك.\n2. ارفع كعبك عن الأرض حتى تستقيم ركبتك بالكامل في الهواء.\n3. اثبت 5 ثوانٍ مع شد الفخذ ثم أنزل الكعب ببطء.",
            reps: "10 تكرارات",
            sets: "3 جولات",
            duration: "دقيقتان",
            durationSec: 120
        },
        {
            id: "kn_3",
            name: "تمرين رفع الساق المستقيمة لبناء القوة",
            scientificName: "Straight Leg Raise (SLR)",
            visualType: "straight_leg_raise",
            description: "تقوية العضلات المحيطة بالركبة بدون تحميل ضغط انضغاطي على الغضاريف.",
            instructions: "1. استلقِ على ظهرك مع ثني رجل وفرد الرجل المصابة.\n2. ارفع الساق المستقيمة لمستوى ركبة الساق الأخرى (حوالي 30 سم).\n3. اثبت ثانيتين ثم اخفضها ببطء شديد.",
            reps: "10 تكرارات",
            sets: "3 جولات",
            duration: "دقيقتان",
            durationSec: 120
        },
        {
            id: "kn_4",
            name: "تمرين سحب الركبة للصدر لتليين المفصل",
            scientificName: "Knee-To-Chest Mobilization",
            visualType: "knee_to_chest",
            description: "تليين مفاصل الركبة والحوض وتخفيف الضغط المفصلي.",
            instructions: "1. استلقِ على ظهرك واسحب ركبتك المصابة برفق نحو صدرك بيديك.\n2. اثبت 20 ثانية وكرر 3 مرات.",
            reps: "3 مرات",
            sets: "3 جولات",
            duration: "دقيقتان",
            durationSec: 120
        },
        {
            id: "kn_5",
            name: "إطالة عضلات الفخذ الخلفية (Hamstring Stretch)",
            scientificName: "Supine Hamstring Flexibility Stretch",
            visualType: "hamstring_stretch",
            description: "تقليل الشد على الركبة وأسفل الظهر واستعادة مرونة العضلات الخلفية للفخذ.",
            instructions: "1. استلقِ على ظهرك واستخدم حزاماً أو منشفة حول باطن قدمك.\n2. ارفع ساقك المصابة مستقيمة للأعلى برفق حتى تشعر بإطالة مريحة خلف الفخذ.\n3. اثبت 25 ثانية مع تنفس هادئ. كرر 3 مرات لكل ساق.",
            reps: "3 مرات لكل ساق",
            sets: "جولتان",
            duration: "دقيقتان",
            durationSec: 120
        }
    ],

    // 8. الكاحل ومفصل القدم ووتر أكيليس
    ankle: [
        {
            id: "ank_1",
            name: "إطالة اللفافة الأخمصية وعضلة السمانة على لوح مائل/حائط",
            scientificName: "Slant Board / Wall Plantar Stretch",
            visualType: "slant_board",
            description: "تسكين ألم مسمار الكعب الحاد والخطوات الأولى صباحاً وتليين وتر العرقوب.",
            instructions: "1. قف بمواجهة حائط وضع مشط قدمك المصابة للأعلى ضد الحائط مع بقاء الكعب على الأرض.\n2. انحنِ بجسمك للأمام مع استقامة الركبة حتى تشعر بإطالة في باطن القدم والسمانة.\n3. اثبت 25 ثانية وكرر 3 مرات.",
            reps: "3 مرات لكل قدم",
            sets: "3 جولات",
            duration: "دقيقتان",
            durationSec: 120
        },
        {
            id: "ank_2",
            name: "تمرين رفع الكعبين لتقوية وتر أكيليس والسمانة",
            scientificName: "Double Leg Heel Raises",
            visualType: "heel_raise_two",
            description: "تقوية عضلات السمانة ووتر العرقوب وحماية قوس القدم من الانهيار.",
            instructions: "1. قف باستقامة مع الاستناد بيديك على كرسي أو حائط للتوازن.\n2. ارفع كعبيك للأعلى والوقوف على أطراف أصابعك لأقصى ارتفاع.\n3. اثبت ثانيتين ثم اخفض كعبيك ببطء شديد.",
            reps: "12 تكراراً",
            sets: "3 جولات",
            duration: "دقيقتان",
            durationSec: 120
        },
        {
            id: "ank_3",
            name: "تمرين ثني وبسط الكاحل لتنشيط الدورة الدموية",
            scientificName: "Ankle Pumps & Bends",
            visualType: "ankle_bends",
            description: "تليين مفصل الكاحل ومنع التورم والانتفاخ وتنشيط التروية الدموية.",
            instructions: "1. اجلس مع فرد ساقيك للأمام.\n2. اسحب مشط قدمك نحوك لأقصى مدى واثبت ثانيتين.\n3. ادفع مشط قدمك للأمام واثبت ثانيتين. كرر 15 مرة.",
            reps: "15 تكراراً",
            sets: "3 جولات",
            duration: "دقيقة ونصف",
            durationSec: 90
        },
        {
            id: "ank_4",
            name: "تمرين تدوير الكاحل ورسم الدوائر",
            scientificName: "Ankle Circles & Rotation",
            visualType: "ankle_rotation",
            description: "استعادة المدى الحركي الكامل في جميع اتجاهات مفصل الكاحل.",
            instructions: "1. ارفع قدمك عن الأرض قليلاً.\n2. قم بتدوير مشط قدمك في دوائر واسعة وبطيئة باتجاه عقارب الساعة ثم عكسها.",
            reps: "10 دوائر بكل اتجاه",
            sets: "جولتان",
            duration: "دقيقة ونصف",
            durationSec: 90
        }
    ],

    // 9. أعلى الظهر ولوح الكتف وعضلات الأبهر (Thoracic, Scapula & Rhomboids)
    thoracic_scapula: [
        {
            id: "th_1",
            name: "تمرين تدوير الجذع وفتح الفقرات الصدرية (Open-Book)",
            scientificName: "Thoracic Open-Book Mobility",
            visualType: "lower_trunk_rotation",
            description: "فك تيبس الفقرات الصدرية وتوسيع مدى حركة القفص الصدري وتسكين ألم ما بين الكتفين.",
            instructions: "1. استلقِ على جنبك واثنِ ركبتيك بزاوية 90 درجة ومد ذراعيك للأمام معاً.\n2. افتح ذراعك العلوية لأقصى مدى للخلف مع تتبع يدك بنظرك حتى يلامس كتفك الأرض.\n3. اثبت ثانيتين ثم أعد إغلاق الذراع ببطء. كرر 10 مرات لكل جهة.",
            reps: "10 تكرارات لكل جهة",
            sets: "3 جولات",
            duration: "دقيقتان",
            durationSec: 120
        },
        {
            id: "th_2",
            name: "تمرين ضم لوحي الكتف وفك عقد الأبهر (Scapular Retraction)",
            scientificName: "Rhomboid & Scapular Squeeze",
            visualType: "trapezius_shrug",
            description: "تنشيط العضلات المعينية العميقة وتفكيك العقد العضلية التشنجية بين العمود الفقري واللوح.",
            instructions: "1. قف أو اجلس بظهر مستقيم واثنِ كوعيك بجانب خصرك.\n2. اسحب لوحي كتفيك للخلف وللأسفل معاً كأنك تعصر ليمونة بينهما.\n3. اثبت 5 ثوانٍ مع التنفس ثم استرخِ. كرر 12 مرة.",
            reps: "12 تكراراً",
            sets: "3 جولات",
            duration: "دقيقة ونصف",
            durationSec: 90
        },
        {
            id: "th_3",
            name: "تمرين إطالة الصدر على المدخل لتحرير لوح الكتف (Doorway Stretch)",
            scientificName: "Pectoral & Anterior Shoulder Stretch",
            visualType: "doorway_chest_stretch",
            description: "تحرير الشد الأمامي للكتف الذي يسحب لوح الكتف للأمام ويسبب تشنج الأبهر المزمن.",
            instructions: "1. قف في مدخل باب وضع ساعديك على جانبي الباب بمستوى الكتف.\n2. خطوة خفيفة للأمام بصدرك حتى تشعر بإطالة مريحة في عضلات الصدر والكتف الأمامي.\n3. اثبت 25 ثانية مع تنفس عميق.",
            reps: "3 مرات",
            sets: "جولتان",
            duration: "دقيقتان",
            durationSec: 120
        }
    ],

    // 10. القفص الصدري والأضلاع (Ribs & Sternum)
    chest_ribs: [
        {
            id: "ch_1",
            name: "تمرين فتح الصدر والتمدد على المدخل",
            scientificName: "Doorway Chest Expansion",
            visualType: "doorway_chest_stretch",
            description: "توسيع القفص الصدري وتفريغ الضغط عن المفاصل الغضروفية الضلعية (Costochondral).",
            instructions: "1. ضع ساعديك على إطار الباب واخطُ خطوة للأمام بصدرك.\n2. خذ شهيقاً عميقاً لملء الرئتين واثبت 20 ثانية.\n3. ازفر ببطء وكرر 3 مرات.",
            reps: "3 تكرارات",
            sets: "جولتان",
            duration: "دقيقة ونصف",
            durationSec: 90
        },
        {
            id: "ch_2",
            name: "تمرين تدوير الجذع لتليين القفص الصدري",
            scientificName: "Thoracic & Ribcage Mobilization",
            visualType: "lower_trunk_rotation",
            description: "استعادة مرونة الأضلاع وتسكين النغزات التنفسية الميكانيكية.",
            instructions: "1. استلقِ على ظهرك واثنِ ركبتيك.\n2. أسقط ركبتيك بلطف نحو اليمين واثبت 5 ثوانٍ، ثم لليسار.\n3. كرر 10 مرات بسلاسة.",
            reps: "10 تكرارات",
            sets: "جولتان",
            duration: "دقيقتان",
            durationSec: 120
        },
        {
            id: "ch_3",
            name: "وضعية فتح وتمديد القفص الصدري والتنفس الحجابي",
            scientificName: "Diaphragmatic Rib Expansion",
            visualType: "doorway_chest_stretch",
            description: "استرخاء عضلات التنفس الثانوية وتوسيع مرونة القفص الصدري.",
            instructions: "1. قف باستقامة مع وضع يديك على أضلاعك السفلية.\n2. خذ شهيقاً بطيئاً وعميقاً من الأنف حتى يتسع القفص الصدري.\n3. ازفر ببطء من الفم واسترخِ تماماً. كرر 5 مرات.",
            reps: "5 تكرارات",
            sets: "جولتان",
            duration: "دقيقة ونصف",
            durationSec: 90
        }
    ],

    // 11. مفصل الفك الصدغي (TMJ & Jaw)
    jaw: [
        {
            id: "jaw_1",
            name: "تمرين استرخاء ومقاومة الفك الصدغي (TMJ Isometric & Relaxation)",
            scientificName: "TMJ Isometric & Controlled Opening",
            visualType: "tmj_release",
            description: "إعادة ضبط التوازن العضلي لمفصل الفك وتخفيف الشد عن المفصل الصدغي الصدغي.",
            instructions: "1. ضع إبهامك بلطف تحت ذقنك.\n2. افتح فمك ببطء مع ممارسة مقاومة خفيفة جداً بإبهامك لأعلى.\n3. اثبت 3 ثوانٍ ثم اغلق فمك باسترخاء. كرر 8 مرات.",
            reps: "8 تكرارات",
            sets: "3 جولات",
            duration: "دقيقة ونصف",
            durationSec: 90
        },
        {
            id: "jaw_2",
            name: "تمرين فتح الفك مع تثبيت اللسان (Rocabado 6x6 TMJ)",
            scientificName: "Rocabado TMJ Tongue-Roof Opening",
            visualType: "tmj_release",
            description: "منع الانحراف المفصلي والطقطقة أثناء فتح وإغلاق الفم.",
            instructions: "1. الصق طرف لسانك في سقف حلقك خلف الأسنان العلوية مباشرة.\n2. حافظ على ملامسة اللسان وافتح فمك ببطء للمدى المريح دون صوت طقطقة.\n3. كرر 6 مرات متتالية.",
            reps: "6 تكرارات",
            sets: "3 جولات",
            duration: "دقيقة ونصف",
            durationSec: 90
        },
        {
            id: "jaw_3",
            name: "تمرين تدليك وإرخاء العضلة الماضغة والصدغية (Masseter Release)",
            scientificName: "Masseter & Temporalis Myofascial Release",
            visualType: "tmj_release",
            description: "فك التشنج المزمن في عضلات المضغ والصداع الصدغي الناتج عن صرير الأسنان.",
            instructions: "1. ضع أصابعك على زاوية الفك السفلية والصدغين.\n2. قم بتدليك دائري لطيف وبطيء مع ترك الفك مرتخياً والأسنان متباعدة.\n3. استمر لمدة دقيقة مع التنفس الهادئ.",
            reps: "دقيقة كاملة",
            sets: "جولتان",
            duration: "دقيقتان",
            durationSec: 120
        }
    ]
};

// الدالة الذكية لوصف التمارين الطبية المخصصة للحالة السريرية والتدرج عبر الأيام السبعة
function prescribePathologyExercises({ pointId, primaryDiagnosisKey, answers = {}, userNotes = "", dayNumber = 1 }) {
    let pId = (pointId || "").toLowerCase();
    const q1 = (answers.q1 || "").toLowerCase();
    const q2 = (answers.q2 || "").toLowerCase();
    const q4 = (answers.q4 || "").toLowerCase();
    const notes = (userNotes || "").toLowerCase();
    const diagKey = (primaryDiagnosisKey || "").toLowerCase();
    const day = parseInt(dayNumber) || 1;

    // تطبيع تشريحي ذكي وشامل لدعم الأسماء والمصطلحات العربية والإنجليزية ومفاتيح النقاط
    const norm = normalizeAnatomicalRegionKey(pointId || primaryDiagnosisKey || userNotes);
    if (norm) {
        pId = `${pId} ${norm}`;
    }

    // تحديد المرحلة السريرية:
    // المرحلة 1 (اليوم 1-2): تسكين حاد وتفريغ الضغط الميكانيكي/المفصلي
    // المرحلة 2 (اليوم 3-5): استعادة المدى الحركي وتليين المفاصل والأوتار
    // المرحلة 3 (اليوم 6-7): الثبات الوظيفي وتقوية العضلات الداعمة لمنع الانتكاس
    const isPhase1 = day <= 2;
    const isPhase2 = day >= 3 && day <= 5;
    const isPhase3 = day >= 6;

    // 1. حالات الرقبة والفقرات العنقية والرأس
    if (pId.includes("cervical") || pId.includes("neck") || pId.includes("head")) {
        if (isPhase1) {
            return [
                MASTER_EXERCISES_CATALOG.cervical[0], // تراجع الذقن واستقامة الفقرات
                MASTER_EXERCISES_CATALOG.cervical[1], // إطالة الرقبة الجانبية
                MASTER_EXERCISES_CATALOG.cervical[2]  // رفع وهز الكتفين
            ];
        } else if (isPhase2) {
            return [
                MASTER_EXERCISES_CATALOG.cervical[0], // تراجع الذقن
                MASTER_EXERCISES_CATALOG.thoracic_scapula[1], // تمرين ضم لوحي الكتف
                MASTER_EXERCISES_CATALOG.thoracic_scapula[2]  // إطالة الصدر على المدخل
            ];
        } else {
            return [
                MASTER_EXERCISES_CATALOG.cervical[0], // تراجع الذقن
                MASTER_EXERCISES_CATALOG.thoracic_scapula[1], // ضم لوحي الكتف
                MASTER_EXERCISES_CATALOG.cervical[1]  // إطالة جانبية للحفاظ على المرونة
            ];
        }
    }

    // 2. حالات أعلى الظهر ولوح الكتف وعضلات الأبهر
    if (pId.includes("trapezius") || pId.includes("scapula") || pId.includes("thoracic")) {
        if (isPhase1) {
            return [
                MASTER_EXERCISES_CATALOG.thoracic_scapula[0], // تدوير الجذع وفتح الفقرات الصدرية Open-Book
                MASTER_EXERCISES_CATALOG.thoracic_scapula[1], // ضم لوحي الكتف وفك عقد الأبهر
                MASTER_EXERCISES_CATALOG.thoracic_scapula[2]  // إطالة الصدر على المدخل
            ];
        } else if (isPhase2) {
            return [
                MASTER_EXERCISES_CATALOG.thoracic_scapula[1], // ضم لوحي الكتف
                MASTER_EXERCISES_CATALOG.thoracic_scapula[0], // Open-Book
                MASTER_EXERCISES_CATALOG.cervical[2]          // رفع وهز الكتفين
            ];
        } else {
            return [
                MASTER_EXERCISES_CATALOG.thoracic_scapula[1], // ضم لوحي الكتف
                MASTER_EXERCISES_CATALOG.thoracic_scapula[2], // إطالة الصدر
                MASTER_EXERCISES_CATALOG.thoracic_scapula[0]  // Open-Book
            ];
        }
    }

    // 3. حالات القفص الصدري وعظم القص
    if (pId.includes("chest") || pId.includes("sternum") || pId.includes("rib")) {
        if (isPhase1) {
            return [
                MASTER_EXERCISES_CATALOG.chest_ribs[0], // فتح وتمديد القفص الصدري
                MASTER_EXERCISES_CATALOG.chest_ribs[1], // تدوير الجذع
                MASTER_EXERCISES_CATALOG.chest_ribs[2]  // التنفس الحجابي
            ];
        } else if (isPhase2) {
            return [
                MASTER_EXERCISES_CATALOG.chest_ribs[1], // تدوير الجذع
                MASTER_EXERCISES_CATALOG.chest_ribs[0], // فتح وتمديد الصدر
                MASTER_EXERCISES_CATALOG.thoracic_scapula[1] // ضم لوحي الكتف
            ];
        } else {
            return [
                MASTER_EXERCISES_CATALOG.chest_ribs[0], // فتح وتمديد الصدر
                MASTER_EXERCISES_CATALOG.chest_ribs[1], // تدوير الجذع
                MASTER_EXERCISES_CATALOG.thoracic_scapula[1] // ضم لوحي الكتف
            ];
        }
    }

    // 4. حالات مفصل الكتف والكفة المدورة (Rotator Cuff & Shoulder)
    if (pId.includes("shoulder")) {
        if (isPhase1) {
            return [
                MASTER_EXERCISES_CATALOG.shoulder[0],         // بندول كودمان لتفريغ ضغط الكتف
                MASTER_EXERCISES_CATALOG.shoulder[1],         // إطالة الكبسولة الخلفية للكتف عبر الصدر
                MASTER_EXERCISES_CATALOG.thoracic_scapula[2]  // إطالة الصدر والكتف الأمامي على المدخل
            ];
        } else if (isPhase2) {
            return [
                MASTER_EXERCISES_CATALOG.shoulder[0],         // بندول كودمان
                MASTER_EXERCISES_CATALOG.thoracic_scapula[1], // ضم لوحي الكتف لتصحيح ميكانيكا الكتف
                MASTER_EXERCISES_CATALOG.shoulder[2]          // الشد الثابت للكفة المدورة Isometric
            ];
        } else {
            return [
                MASTER_EXERCISES_CATALOG.shoulder[3],         // انزلاق الذراعين على الحائط لثبات لوح الكتف
                MASTER_EXERCISES_CATALOG.thoracic_scapula[1], // ضم لوحي الكتف
                MASTER_EXERCISES_CATALOG.shoulder[2]          // تثبيت الكفة المدورة
            ];
        }
    }

    // 5. حالات الكوع والساعد
    if (pId.includes("elbow")) {
        if (isPhase1) {
            return [
                MASTER_EXERCISES_CATALOG.elbow[0], // إطالة أوتار الكوع الخارجية (مرفق التنس)
                MASTER_EXERCISES_CATALOG.elbow[1], // إطالة أوتار الكوع الداخلية (مرفق الجولف)
                MASTER_EXERCISES_CATALOG.elbow[2]  // تدوير الساعد
            ];
        } else if (isPhase2) {
            return [
                MASTER_EXERCISES_CATALOG.wrist[0], // إطالة أوتار الرسغ والنفق الرسغي
                MASTER_EXERCISES_CATALOG.elbow[2], // تدوير الساعد
                MASTER_EXERCISES_CATALOG.elbow[0]  // إطالة خارجية
            ];
        } else {
            return [
                MASTER_EXERCISES_CATALOG.wrist[2], // ثني وتدوير الرسغ لتقوية الأوتار
                MASTER_EXERCISES_CATALOG.elbow[0], // إطالة خارجية
                MASTER_EXERCISES_CATALOG.elbow[2]  // تدوير الساعد
            ];
        }
    }

    // 6. حالات الرسغ واليد ونفق الرسغ
    if (pId.includes("wrist") || pId.includes("hand") || pId.includes("finger") || pId.includes("رسغ") || pId.includes("معصم") || pId.includes("نفق") || pId.includes("كف") || pId.includes("أصابع")) {
        if (isPhase1) {
            return [
                MASTER_EXERCISES_CATALOG.wrist[0], // إطالة أوتار الرسغ والنفق الرسغي
                MASTER_EXERCISES_CATALOG.wrist[1], // تمديد وبسط الأصابع
                MASTER_EXERCISES_CATALOG.elbow[2]  // تدوير الساعد
            ];
        } else if (isPhase2) {
            return [
                MASTER_EXERCISES_CATALOG.wrist[2], // ثني وتدوير الرسغ
                MASTER_EXERCISES_CATALOG.wrist[0], // إطالة الرسغ
                MASTER_EXERCISES_CATALOG.wrist[1]  // بسط الأصابع
            ];
        } else {
            return [
                MASTER_EXERCISES_CATALOG.wrist[2], // تقوية الرسغ
                MASTER_EXERCISES_CATALOG.elbow[2], // تدوير الساعد
                MASTER_EXERCISES_CATALOG.wrist[0]  // تمديد النفق الرسغي
            ];
        }
    }

    // 7. حالات أسفل الظهر والفقرات القطنية
    if (pId.includes("lumbar") || pId.includes("lower_back") || pId.includes("l4_l5") || pId.includes("l5_s1")) {
        const isDisc = q1.includes("disc") || q1.includes("radicular") || diagKey.includes("disc") || notes.includes("ديسك") || notes.includes("غضروف") || notes.includes("عرق النسا") || notes.includes("تنميل") || q4.includes("sharp");
        const isFacet = q1.includes("facet") || q1.includes("stenosis") || diagKey.includes("facet") || notes.includes("انزلاق فقاري") || notes.includes("احتكاك") || notes.includes("مفاصل") || notes.includes("تضيق");

        if (isDisc) {
            if (isPhase1) {
                return [
                    MASTER_EXERCISES_CATALOG.lumbar[0], // ماكنزي (تمديد الفقرات ودفع الديسك للمركز)
                    MASTER_EXERCISES_CATALOG.lumbar[2], // وضعية الطفل للتفريغ
                    MASTER_EXERCISES_CATALOG.si_joint[1]  // انزلاق العصب الوركي
                ];
            } else if (isPhase2) {
                return [
                    MASTER_EXERCISES_CATALOG.lumbar[1],   // القطة والبقرة
                    MASTER_EXERCISES_CATALOG.si_joint[0], // شكل 4 لإطالة الكمثرية
                    MASTER_EXERCISES_CATALOG.lumbar[0]    // ماكنزي
                ];
            } else {
                return [
                    MASTER_EXERCISES_CATALOG.lumbar[3],   // الجسر الحوضي لبناء الثبات
                    MASTER_EXERCISES_CATALOG.lumbar[4],   // الطائر الكلب لبناء ثبات الجذع
                    MASTER_EXERCISES_CATALOG.lumbar[0]    // ماكنزي للصيانة
                ];
            }
        } else if (isFacet) {
            if (isPhase1) {
                return [
                    MASTER_EXERCISES_CATALOG.lumbar[5], // تمرين إمالة الحوض لتسطيح وتفريغ الفاسيت (Pelvic Tilt)
                    MASTER_EXERCISES_CATALOG.lumbar[2], // وضعية الطفل
                    MASTER_EXERCISES_CATALOG.lumbar[1]  // القطة والبقرة
                ];
            } else if (isPhase2) {
                return [
                    MASTER_EXERCISES_CATALOG.knee[3],   // سحب الركبة للصدر
                    MASTER_EXERCISES_CATALOG.si_joint[0], // شكل 4
                    MASTER_EXERCISES_CATALOG.lumbar[3]  // الجسر الحوضي
                ];
            } else {
                return [
                    MASTER_EXERCISES_CATALOG.lumbar[3], // الجسر الحوضي
                    MASTER_EXERCISES_CATALOG.lumbar[4], // الطائر الكلب
                    MASTER_EXERCISES_CATALOG.lumbar[5]  // إمالة الحوض للحفاظ على استقامة الفقرات
                ];
            }
        } else {
            // إجهاد ميكانيكي عام
            if (isPhase1) {
                return [
                    MASTER_EXERCISES_CATALOG.lumbar[1], // القطة والبقرة
                    MASTER_EXERCISES_CATALOG.lumbar[2], // وضعية الطفل
                    MASTER_EXERCISES_CATALOG.lumbar[0]  // تمديد الفقرات
                ];
            } else if (isPhase2) {
                return [
                    MASTER_EXERCISES_CATALOG.lumbar[1], // القطة والبقرة
                    MASTER_EXERCISES_CATALOG.si_joint[0], // شكل 4
                    MASTER_EXERCISES_CATALOG.lumbar[3]  // الجسر الحوضي
                ];
            } else {
                return [
                    MASTER_EXERCISES_CATALOG.lumbar[3], // الجسر الحوضي
                    MASTER_EXERCISES_CATALOG.lumbar[4], // الطائر الكلب
                    MASTER_EXERCISES_CATALOG.lumbar[1]  // القطة والبقرة
                ];
            }
        }
    }

    // 8. حالات الحوض وعرق النسا والعضلة الكمثرية والورك
    if (pId.includes("sacroiliac") || pId.includes("gluteal") || pId.includes("piriformis") || pId.includes("pelvis") || pId.includes("hip")) {
        if (isPhase1) {
            return [
                MASTER_EXERCISES_CATALOG.si_joint[0], // شكل 4 لإطالة العضلة الكمثرية
                MASTER_EXERCISES_CATALOG.si_joint[1], // انزلاق العصب الوركي
                MASTER_EXERCISES_CATALOG.si_joint[2]  // إطالة الأرداف العميقة
            ];
        } else if (isPhase2) {
            return [
                MASTER_EXERCISES_CATALOG.si_joint[2], // إطالة الأرداف العميقة
                MASTER_EXERCISES_CATALOG.si_joint[3], // تحرير المسار العصبي Slump
                MASTER_EXERCISES_CATALOG.si_joint[0]  // شكل 4
            ];
        } else {
            return [
                MASTER_EXERCISES_CATALOG.lumbar[3],   // الجسر الحوضي لثبات الحوض
                MASTER_EXERCISES_CATALOG.si_joint[4], // تمرين الصدفة لتقوية العضلات الألوية والحوض (Clamshell)
                MASTER_EXERCISES_CATALOG.si_joint[0]  // شكل 4
            ];
        }
    }

    // 9. حالات الركبة والفخذ (Knee & Patella)
    if (pId.includes("knee") || pId.includes("hamstring") || pId.includes("patella")) {
        if (isPhase1) {
            return [
                MASTER_EXERCISES_CATALOG.knee[0], // الشد الثابت للعضلة الرباعية Quad Set
                MASTER_EXERCISES_CATALOG.knee[1], // فرد الركبة النهائي TKE
                MASTER_EXERCISES_CATALOG.knee[2]  // رفع الساق المستقيمة SLR
            ];
        } else if (isPhase2) {
            return [
                MASTER_EXERCISES_CATALOG.knee[1], // فرد الركبة النهائي TKE
                MASTER_EXERCISES_CATALOG.knee[4], // إطالة أوتار الفخذ الخلفية (Hamstring Stretch)
                MASTER_EXERCISES_CATALOG.knee[2]  // SLR
            ];
        } else {
            return [
                MASTER_EXERCISES_CATALOG.knee[1], // TKE
                MASTER_EXERCISES_CATALOG.knee[4], // إطالة الفخذ الخلفية
                MASTER_EXERCISES_CATALOG.knee[0]  // Quad Set
            ];
        }
    }

    // 10. حالات الكاحل والقدم ووتر أكيليس والسمانة (اليمنى واليسرى)
    if (pId.includes("ankle") || pId.includes("achilles") || pId.includes("calf") || pId.includes("37515") || pId.includes("foot") || pId.includes("plantar")) {
        const isPureAnkle = pId.includes("ankle") && !pId.includes("plantar") && !pId.includes("heel");
        if (isPureAnkle) {
            if (isPhase1) {
                return [
                    MASTER_EXERCISES_CATALOG.ankle[2], // ثني وبسط الكاحل لتنشيط الدورة الدموية
                    MASTER_EXERCISES_CATALOG.ankle[3], // تدوير الكاحل واستعادة المدى الحركي
                    MASTER_EXERCISES_CATALOG.ankle[1]  // تقوية وتر أكيليس وثبات مفصل الكاحل
                ];
            } else if (isPhase2) {
                return [
                    MASTER_EXERCISES_CATALOG.ankle[2], // ثني وبسط الكاحل
                    MASTER_EXERCISES_CATALOG.ankle[1], // رفع الكعبين لتقوية الثبات
                    MASTER_EXERCISES_CATALOG.ankle[3]  // تدوير الكاحل
                ];
            } else {
                return [
                    MASTER_EXERCISES_CATALOG.ankle[1], // رفع الكعبين
                    MASTER_EXERCISES_CATALOG.ankle[2], // ثني وبسط الكاحل
                    MASTER_EXERCISES_CATALOG.ankle[3]  // تدوير الكاحل
                ];
            }
        }
        if (isPhase1) {
            return [
                MASTER_EXERCISES_CATALOG.ankle[0], // إطالة اللفافة على الحائط
                MASTER_EXERCISES_CATALOG.ankle[2], // ثني وبسط الكاحل
                MASTER_EXERCISES_CATALOG.ankle[3]  // تدوير الكاحل
            ];
        } else if (isPhase2) {
            return [
                MASTER_EXERCISES_CATALOG.ankle[1], // رفع الكعبين لتقوية أكيليس
                MASTER_EXERCISES_CATALOG.ankle[0], // إطالة اللفافة
                MASTER_EXERCISES_CATALOG.ankle[2]  // ثني وبسط الكاحل
            ];
        } else {
            return [
                MASTER_EXERCISES_CATALOG.ankle[1], // رفع الكعبين
                MASTER_EXERCISES_CATALOG.ankle[0], // إطالة اللفافة
                MASTER_EXERCISES_CATALOG.ankle[3]  // تدوير الكاحل
            ];
        }
    }

    // 11. حالات الفك الصدغي (TMJ & Jaw)
    if (pId.includes("jaw") || pId.includes("tmj")) {
        if (isPhase1) {
            return [
                MASTER_EXERCISES_CATALOG.jaw[0], // استرخاء ومقاومة الفك الصدغي
                MASTER_EXERCISES_CATALOG.jaw[1], // فتح الفك مع تثبيت اللسان Rocabado
                MASTER_EXERCISES_CATALOG.jaw[2]  // تدليك وإرخاء العضلة الماضغة
            ];
        } else if (isPhase2) {
            return [
                MASTER_EXERCISES_CATALOG.jaw[1], // Rocabado
                MASTER_EXERCISES_CATALOG.jaw[0], // استرخاء ومقاومة الفك
                MASTER_EXERCISES_CATALOG.cervical[0] // تراجع الذقن لاستقامة الرقبة والفك
            ];
        } else {
            return [
                MASTER_EXERCISES_CATALOG.jaw[1], // Rocabado
                MASTER_EXERCISES_CATALOG.cervical[0], // تراجع الذقن
                MASTER_EXERCISES_CATALOG.jaw[2]  // تدليك العضلة الماضغة
            ];
        }
    }

    // الافتراضي
    return MASTER_EXERCISES_CATALOG.lumbar.slice(0, 3);
}

// دالة جلب التمارين للمريض مع مراعاة اليوم
function getExercisesForPoint(pointId, dayNumber = 1, options = {}) {
    return prescribePathologyExercises({
        pointId,
        primaryDiagnosisKey: options.primaryDiagnosisKey,
        answers: options.answers,
        userNotes: options.userNotes,
        dayNumber
    });
}

function getExercisesForSession(regionKey = 'lumbar', dayNumber = 1, options = {}) {
    return getExercisesForPoint(regionKey, dayNumber, options);
}

// دالة التوجيه السريري: الطريقة الصحيحة مقابل الخطأ الشائع لكل تمرين (Dos & Don'ts)
function getExerciseFormTips(ex = {}) {
    if (ex.correctForm && ex.commonMistake) {
        return { correct: ex.correctForm, mistake: ex.commonMistake };
    }

    const vt = (ex.visualType || ex.id || "").toLowerCase();
    const nm = (ex.name || "").toLowerCase();

    if (vt.includes('wrist') || vt.includes('finger') || nm.includes('رسغ') || nm.includes('نفق') || nm.includes('أصابع') || nm.includes('كف')) {
        return {
            correct: "حافظ على استقامة الكوع واسحب الأصابع بلطف للخلف حتى تشعر بإطالة مريحة في باطن الساعد والرسغ دون إحداث ألم حاد أو تنميل.",
            mistake: "السحب العنيف للمفصل بقوة زائدة، أو ثني الكوع أثناء أداء الإطالة مما يقلل فاعليتها."
        };
    }
    if (vt.includes('chin_tuck') || nm.includes('ذقن')) {
        return {
            correct: "اسحب الذقن أفقياً للخلف بمحاذاة الحنجرة (صنع ذقن مزدوج) مع إبقاء النظر للأمام مباشرة دون خفض الرأس للأسفل.",
            mistake: "ثني الرقبة لأسفل نحو الصدر بدلاً من السحب الأفقي، أو حبس التنفس أثناء مدة الثبات."
        };
    }
    if (vt.includes('neck_lateral') || nm.includes('جانبية')) {
        return {
            correct: "أنزل الأذن نحو الكتف برفق مع استرخاء الكتف المعاكس واستخدام ثقل اليد فقط دون شد أو ضغط عنيف على الجمجمة.",
            mistake: "رفع الكتف المقابل للأعلى لملاقاة الرأس، أو تدوير الوجه نحو الأرض أثناء الإطالة."
        };
    }
    if (vt.includes('shrug') || nm.includes('هز الكتفين')) {
        return {
            correct: "ارفع الكتفين بشكل مستقيم نحو الأذنين واثبت ثانيتين ثم أنزلهما ببطء وتحكم كامل لتنشيط الدورة الدموية.",
            mistake: "تدوير الكتفين للأمام بعنف أو استخدام حركة ارتدادية سريعة بدلاً من التحكم العضلي."
        };
    }
    if (vt.includes('cobra') || vt.includes('press_up') || nm.includes('ماكنزي') || nm.includes('تمديد الفقرات')) {
        return {
            correct: "حافظ على استرخاء عضلات الحوض والأرداف تماماً فوق الأرض، وادفع بالذراعين فقط لتقويس الظهر ودفع الغضروف للمركز.",
            mistake: "رفع الحوض أو الفخذين عن الأرض، مما يلغي أثر تفريغ الضغط الهيدروليكي عن الفقرات القطنية."
        };
    }
    if (vt.includes('cat_cow') || nm.includes('القطة والبقرة')) {
        return {
            correct: "تزامن الحركة مع التنفس بهدوء: شهيق عميق مع تقويس الظهر لأسفل، وزفير مع رفع الظهر للأعلى وسحب السرة للداخل.",
            mistake: "السرعة المفرطة أو ارتداد الرقبة بعنف للأعلى والأسفل بدلاً من التموج المفصلي السلس."
        };
    }
    if (vt.includes('child_pose') || nm.includes('الطفل')) {
        return {
            correct: "باعد بين الركبتين واجلس بالحوض كاملاً فوق الكعبين مع تمديد اليدين للأمام والتنفس ببطء وعمق من البطن.",
            mistake: "رفع الحوض في الهواء بعيداً عن الكعبين أو تشنج عضلات الرقبة والكتفين أثناء الإطالة."
        };
    }
    if (vt.includes('glute_bridge') || nm.includes('الجسر')) {
        return {
            correct: "اضغط من خلال الكعبين واقبض عضلات المؤخرة بقوة عند القمة حتى يستقيم الجسم من الركبة للكتف في خط واحد.",
            mistake: "التقويس المفرط لأسفل الظهر بدلاً من تشغيل عضلات الأرداف، مما يسبب إجهاداً عكسياً للفقرات."
        };
    }
    if (vt.includes('bird_dog') || nm.includes('الطائر الكلب')) {
        return {
            correct: "حافظ على ثبات الجذع والحوض كطاولة مستوية دون أي دوران جانبي، ومد الطرفين للأمام والخلف في خط أفقي مستقيم.",
            mistake: "رفع اليد أو الساق لأعلى من مستوى الجذع أو تقويس أسفل الظهر لتعويض ضعف عضلات التوازن."
        };
    }
    if (vt.includes('pelvic_tilt') || nm.includes('إمالة الحوض')) {
        return {
            correct: "اقبض عضلات البطن السفلية لتسطيح أسفل الظهر تماماً مع الأرض وإلغاء القوس القطني مع استمرار التنفس بانتظام.",
            mistake: "رفع الحوض بالكامل للأعلى مثل الجسر أو حبس النفس أثناء تثبيت الوضعية."
        };
    }
    if (vt.includes('figure4') || vt.includes('piriformis') || nm.includes('الكمثرية')) {
        return {
            correct: "استلقِ بارتياح واسحب الفخذ السليم نحو الصدر حتى تشعر بإطالة عميقة في منتصف الأرداف ومسار العصب الوركي.",
            mistake: "رفع الرأس أو الكتفين عن الأرض، أو التواء مفصل الركبة المصابة بزاوية حادة مؤلمة."
        };
    }
    if (vt.includes('sciatic_glide') || vt.includes('slump') || nm.includes('انزلاق العصب')) {
        return {
            correct: "تناغم عصبي دقيق: عند فرد الركبة ورفع مشط القدم، أرجع الرأس للخلف لتخفيف شد العصب دون توليد صعقات كهربائية.",
            mistake: "ثني الرأس للأمام أثناء فرد الركبة، فهذا يضاعف شد العصب الملتهب ويزيد التنميل والألم."
        };
    }
    if (vt.includes('pendulum') || nm.includes('البندول')) {
        return {
            correct: "دع الذراع تتدلى مسترخية تماماً كبندول الساعة دون أي مجهود عضلي بالكتف، واجعل دوران الجذع هو المحرك للحركة.",
            mistake: "تشغيل عضلات الكتف لتدوير الذراع بنشاط، مما يمنع تفريغ الضغط وتسكين محفظة المفصل بالجاذبية."
        };
    }
    if (vt.includes('shoulder_cross') || nm.includes('كبسولة الكتف')) {
        return {
            correct: "اسحب الذراع برفق عبر الصدر مع تثبيت الكتف منخفضاً وبعيداً عن الأذن لتمديد محفظة الكتف الخلفية بأمان.",
            mistake: "رفع الكتف للأعلى باتجاه الأذن أو التواء الجذع بكامله مع اتجاه سحب الذراع."
        };
    }
    if (vt.includes('tmj') || nm.includes('الفك')) {
        return {
            correct: "ثبت طرف اللسان على سقف الحلق خلف الأسنان الأمامية وافتح الفك ببطء وتحكم دون أي صوت طقطقة أو انحراف جانبي.",
            mistake: "فتح الفم لأقصى مدى ممكن بقوة أو الضغط العنيف على الأسنان أثناء وجود التهاب بالمفصل الصدغي."
        };
    }
    if (vt.includes('quad_set') || nm.includes('الرباعية')) {
        return {
            correct: "اضغط بالركبة لأسفل نحو الأرض واقبض عضلات الفخذ الأمامية بقوة لمدة 5 ثوانٍ كاملة لتثبيت الصابونة.",
            mistake: "رفع الكعب عن الأرض أو الاعتماد على شد عضلات أسفل الظهر بدلاً من عضلات الفخذ."
        };
    }
    if (vt.includes('straight_leg') || nm.includes('رفع الساق المستقيمة')) {
        return {
            correct: "قفل مفصل الركبة مستقيماً بزاوية 180 درجة وارفع الساق ببطء حتى مستوى الفخذ الأخرى مع ثبات الحوض والظهر.",
            mistake: "ثني الركبة أثناء الرفع أو تقويس أسفل الظهر لتعويض ضعف عضلات الفخذ."
        };
    }
    if (vt.includes('ankle') || vt.includes('plantar') || nm.includes('الكاحل') || nm.includes('اللفافة')) {
        return {
            correct: "اسحب مشط القدم والأصابع نحوك بثبات حتى تشعر باستطالة باطن القدم ووتر أكيليس لمدة 20 ثانية.",
            mistake: "الحركات السريعة المرتدة بدلاً من الإطالة الثابتة المتحكم بها."
        };
    }

    // افتراضي عام ذكي
    return {
        correct: "حافظ على استقامة وتوازن العمود الفقري وتنفس بعمق وهدوء دون أي ارتداد عنيف، واثبت دائماً في المدى الحركي المريح.",
        mistake: "حبس النفس أثناء التمرين، أو محاولة الوصول لأقصى مدى بالقوة مما يؤدي لتشنج العضلات المجاورة."
    };
}

