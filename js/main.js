// ============================================
// نظام التمارين الطبية المصورة بدقة عالية والمؤقت التفاعلي
// ============================================

// رسومات توضيحية تشريحية طبية عالية الدقة (High-Fidelity Medical Anatomical SVG)
function getExerciseVisualIcon(title = '') {
    const t = title.toLowerCase();
    
    // 1. تمارين الرقبة والفقرات العنقية (Cervical Spine)
    if (t.includes('عنق') || t.includes('رقب') || t.includes('cervical') || t.includes('ذقن') || t.includes('chin') || t.includes('levator')) {
        return `<div class="exercise-anat-badge" style="width: 100%; height: 140px; background: linear-gradient(180deg, #0b111e 0%, #151f32 100%); border-radius: 10px; display: flex; align-items: center; justify-content: center; position: relative; overflow: hidden; border: 1px solid rgba(212, 175, 55, 0.3); margin-bottom: 12px;">
            <svg viewBox="0 0 240 120" width="100%" height="100%" style="overflow: visible;">
                <!-- شبكة طبية خفيفة في الخلفية -->
                <defs>
                    <pattern id="med-grid" width="20" height="20" patternUnits="userSpaceOnUse">
                        <path d="M 20 0 L 0 0 0 20" fill="none" stroke="rgba(212, 175, 55, 0.05)" stroke-width="1"/>
                    </pattern>
                    <linearGradient id="gold-grad" x1="0%" y1="0%" x2="100%" y2="100%">
                        <stop offset="0%" stop-color="#fef08a"/>
                        <stop offset="50%" stop-color="#d4af37"/>
                        <stop offset="100%" stop-color="#854d0e"/>
                    </linearGradient>
                    <filter id="glow" x="-20%" y="-20%" width="140%" height="140%">
                        <feGaussianBlur stdDeviation="3" result="blur"/>
                        <feComposite in="SourceGraphic" in2="blur" operator="over"/>
                    </filter>
                </defs>
                <rect width="240" height="120" fill="url(#med-grid)"/>

                <!-- تشريح الجمجمة والرقبة (رسم طبي دقيق) -->
                <path d="M 90 28 C 90 12, 115 10, 125 10 C 145 10, 155 22, 155 38 C 155 52, 142 58, 138 64 C 136 68, 138 78, 148 88 C 160 98, 175 102, 185 110 L 65 110 C 75 102, 85 96, 88 88 C 92 78, 92 68, 90 60 C 85 55, 80 45, 90 28 Z" fill="#1e293b" stroke="#475569" stroke-width="2"/>
                
                <!-- خط الفقرات العنقية C1-C7 متوهج بالذهب -->
                <g filter="url(#glow)">
                    <rect x="110" y="48" width="10" height="5" rx="2" fill="#d4af37"/>
                    <rect x="111" y="55" width="11" height="5" rx="2" fill="#d4af37"/>
                    <rect x="112" y="62" width="12" height="5" rx="2" fill="#d4af37"/>
                    <rect x="113" y="69" width="13" height="5" rx="2" fill="#d4af37"/>
                    <rect x="114" y="76" width="14" height="5" rx="2" fill="#d4af37"/>
                    <rect x="115" y="83" width="15" height="5" rx="2" fill="#d4af37"/>
                    <rect x="116" y="90" width="16" height="5" rx="2" fill="#d4af37"/>
                </g>

                <!-- عضلات الرقبة المستهدفة (Trapezius / Levator) باللون الزمردي المتوهج -->
                <path d="M 125 65 C 135 72, 150 80, 168 98 L 155 102 C 140 88, 128 78, 120 70 Z" fill="rgba(16, 185, 129, 0.4)" stroke="#10b981" stroke-width="1.5" stroke-dasharray="3 2"/>

                <!-- أسهم مسار الحركة الميكانيكية الحيوية -->
                <path d="M 65 38 C 65 20, 80 15, 95 18" fill="none" stroke="url(#gold-grad)" stroke-width="2.5" stroke-linecap="round"/>
                <polygon points="98,18 90,13 92,23" fill="#d4af37"/>

                <path d="M 175 38 C 175 20, 160 15, 145 18" fill="none" stroke="url(#gold-grad)" stroke-width="2.5" stroke-linecap="round"/>
                <polygon points="142,18 150,13 148,23" fill="#d4af37"/>

                <!-- بطاقة تشريحية طبية مدمجة -->
                <rect x="10" y="8" width="60" height="18" rx="4" fill="rgba(15, 23, 42, 0.8)" stroke="#d4af37" stroke-width="0.8"/>
                <text x="40" y="20" fill="#d4af37" font-size="9" font-family="sans-serif" font-weight="bold" text-anchor="middle">C1-C7 Axis</text>
            </svg>
        </div>`;
    } 
    
    // 2. تمارين أسفل الظهر والقطنية (Lumbar Spine & Core)
    else if (t.includes('ظهر') || t.includes('قطن') || t.includes('lumbar') || t.includes('جسر') || t.includes('bridge') || t.includes('قطة') || t.includes('cat') || t.includes('تمديد')) {
        return `<div class="exercise-anat-badge" style="width: 100%; height: 140px; background: linear-gradient(180deg, #0b111e 0%, #151f32 100%); border-radius: 10px; display: flex; align-items: center; justify-content: center; position: relative; overflow: hidden; border: 1px solid rgba(212, 175, 55, 0.3); margin-bottom: 12px;">
            <svg viewBox="0 0 240 120" width="100%" height="100%" style="overflow: visible;">
                <defs>
                    <linearGradient id="gold-lumbar" x1="0%" y1="0%" x2="100%" y2="100%">
                        <stop offset="0%" stop-color="#fef08a"/>
                        <stop offset="100%" stop-color="#d4af37"/>
                    </linearGradient>
                </defs>
                
                <!-- أرضية التدريب الطبية -->
                <line x1="20" y1="105" x2="220" y2="105" stroke="#334155" stroke-width="3" stroke-linecap="round"/>

                <!-- مجسم جسم الإنسان في وضعية التمرين الحركي للظهر (Bridge/McKenzie) -->
                <path d="M 40 100 C 45 90, 60 90, 75 98 C 95 75, 125 65, 150 78 C 170 90, 185 85, 195 105 L 180 105 C 170 95, 160 95, 145 88 C 125 78, 105 85, 85 102 Z" fill="#1e293b" stroke="#475569" stroke-width="2"/>
                <circle cx="45" cy="92" r="9" fill="#334155" stroke="#64748b" stroke-width="1.5"/>

                <!-- العمود الفقري القطني L1-L5 مضاء بالذهب -->
                <g filter="url(#glow)">
                    <circle cx="105" cy="78" r="4" fill="#d4af37"/>
                    <circle cx="115" cy="74" r="4.5" fill="#d4af37"/>
                    <circle cx="126" cy="72" r="4.5" fill="#d4af37"/>
                    <circle cx="138" cy="73" r="4.5" fill="#d4af37"/>
                    <circle cx="149" cy="76" r="4" fill="#d4af37"/>
                    <path d="M 105 78 Q 126 70 149 76" fill="none" stroke="#fef08a" stroke-width="2"/>
                </g>

                <!-- أسهم رفع وتخفيف الضغط الغضروفي (Decompression Vectors) -->
                <path d="M 126 95 L 126 50" fill="none" stroke="url(#gold-lumbar)" stroke-width="2.5" stroke-linecap="round"/>
                <polygon points="126,44 121,54 131,54" fill="#d4af37"/>
                
                <!-- منطقة تنشيط العضلات الأساسية (Core/Gluteus Activation) -->
                <ellipse cx="145" cy="85" rx="14" ry="8" fill="rgba(16, 185, 129, 0.3)" stroke="#10b981" stroke-width="1.2" stroke-dasharray="3 2"/>

                <rect x="10" y="8" width="65" height="18" rx="4" fill="rgba(15, 23, 42, 0.8)" stroke="#d4af37" stroke-width="0.8"/>
                <text x="42" y="20" fill="#d4af37" font-size="9" font-family="sans-serif" font-weight="bold" text-anchor="middle">L1-L5 Lumbar</text>
            </svg>
        </div>`;
    }

    // 3. تمارين الكتف والمفصل الأخرمي (Shoulder & Rotator Cuff)
    else if (t.includes('كتف') || t.includes('shoulder') || t.includes('ذراع') || t.includes('بندول') || t.includes('pendulum') || t.includes('دوران')) {
        return `<div class="exercise-anat-badge" style="width: 100%; height: 140px; background: linear-gradient(180deg, #0b111e 0%, #151f32 100%); border-radius: 10px; display: flex; align-items: center; justify-content: center; position: relative; overflow: hidden; border: 1px solid rgba(212, 175, 55, 0.3); margin-bottom: 12px;">
            <svg viewBox="0 0 240 120" width="100%" height="100%" style="overflow: visible;">
                <!-- تشريح عظام الكتف والترقوة والعضد -->
                <!-- الترقوة Clavicle -->
                <path d="M 60 40 Q 100 35 130 45" fill="none" stroke="#64748b" stroke-width="4" stroke-linecap="round"/>
                <!-- لوح الكتف Scapula -->
                <path d="M 115 45 L 140 45 L 120 85 Z" fill="#1e293b" stroke="#475569" stroke-width="2"/>
                <!-- رأس عظم العضد وعظم الذراع Humeral Head -->
                <circle cx="140" cy="52" r="12" fill="#334155" stroke="#64748b" stroke-width="2"/>
                <path d="M 140 60 L 155 105" fill="none" stroke="#475569" stroke-width="8" stroke-linecap="round"/>

                <!-- أوتار الكفة المدورة (Rotator Cuff) متوهجة بالذهب -->
                <path d="M 125 45 Q 140 40 152 52" fill="none" stroke="#d4af37" stroke-width="3.5" filter="url(#glow)"/>
                
                <!-- قوس حركة البندول / الدوران الميكانيكي (Circumduction Arc) -->
                <path d="M 130 100 C 145 112, 170 110, 175 95 C 180 80, 160 75, 148 85" fill="none" stroke="#10b981" stroke-width="2.5" stroke-dasharray="4 3"/>
                <polygon points="130,96 126,104 135,103" fill="#10b981"/>

                <rect x="10" y="8" width="75" height="18" rx="4" fill="rgba(15, 23, 42, 0.8)" stroke="#d4af37" stroke-width="0.8"/>
                <text x="47" y="20" fill="#d4af37" font-size="9" font-family="sans-serif" font-weight="bold" text-anchor="middle">Rotator Cuff</text>
            </svg>
        </div>`;
    }

    // 4. تمارين الركبة والمفاصل السفلية (Knee & Quadriceps)
    else if (t.includes('ركب') || t.includes('knee') || t.includes('ساق') || t.includes('فخذ') || t.includes('قرفصاء') || t.includes('squat')) {
        return `<div class="exercise-anat-badge" style="width: 100%; height: 140px; background: linear-gradient(180deg, #0b111e 0%, #151f32 100%); border-radius: 10px; display: flex; align-items: center; justify-content: center; position: relative; overflow: hidden; border: 1px solid rgba(212, 175, 55, 0.3); margin-bottom: 12px;">
            <svg viewBox="0 0 240 120" width="100%" height="100%" style="overflow: visible;">
                <!-- عظم الفخذ Femur -->
                <path d="M 75 35 L 120 65" stroke="#475569" stroke-width="9" stroke-linecap="round"/>
                <!-- عظم الساق Tibia -->
                <path d="M 120 65 L 175 85" stroke="#475569" stroke-width="8" stroke-linecap="round"/>
                <!-- مفصل الرضفة Patella متوهج بالذهب -->
                <circle cx="122" cy="60" r="8" fill="#d4af37" stroke="#fef08a" stroke-width="2" filter="url(#glow)"/>
                
                <!-- وتر الصابونة والرباط الصليبي -->
                <path d="M 115 48 L 128 75" stroke="#10b981" stroke-width="3" stroke-dasharray="3 2"/>

                <!-- مؤشر زاوية الحركة الآمنة (Range of Motion: 0°-90°) -->
                <path d="M 145 74 A 35 35 0 0 0 110 45" fill="none" stroke="#d4af37" stroke-width="2"/>
                <text x="145" y="55" fill="#d4af37" font-size="10" font-weight="bold">ROM 0°-90°</text>

                <rect x="10" y="8" width="70" height="18" rx="4" fill="rgba(15, 23, 42, 0.8)" stroke="#d4af37" stroke-width="0.8"/>
                <text x="45" y="20" fill="#d4af37" font-size="9" font-family="sans-serif" font-weight="bold" text-anchor="middle">Patellofemoral</text>
            </svg>
        </div>`;
    }

    // 5. تمارين تحريك الأعصاب وانزلاقها (Neurodynamics & Nerve Gliding)
    else if (t.includes('عصب') || t.includes('nerve') || t.includes('انزلاق') || t.includes('glide')) {
        return `<div class="exercise-anat-badge" style="width: 100%; height: 140px; background: linear-gradient(180deg, #0b111e 0%, #151f32 100%); border-radius: 10px; display: flex; align-items: center; justify-content: center; position: relative; overflow: hidden; border: 1px solid rgba(212, 175, 55, 0.3); margin-bottom: 12px;">
            <svg viewBox="0 0 240 120" width="100%" height="100%" style="overflow: visible;">
                <!-- مسار الذراع والطرف العلوي -->
                <path d="M 40 45 Q 90 50 130 55 T 200 60" fill="none" stroke="#334155" stroke-width="12" stroke-linecap="round"/>
                
                <!-- المسار العصبي النبضي (Peripheral Nerve Tract) باللون الذهبي والأزرق الكهربائي -->
                <path d="M 40 45 Q 90 50 130 55 T 200 60" fill="none" stroke="#38bdf8" stroke-width="3" filter="url(#glow)"/>
                <path d="M 40 45 Q 90 50 130 55 T 200 60" fill="none" stroke="#fef08a" stroke-width="1.5" stroke-dasharray="6 4"/>

                <!-- أسهم اتجاه التحرير العصبي (Tension Release) -->
                <path d="M 180 40 L 210 40" fill="none" stroke="#10b981" stroke-width="2.5" stroke-linecap="round"/>
                <polygon points="214,40 205,35 205,45" fill="#10b981"/>

                <rect x="10" y="8" width="78" height="18" rx="4" fill="rgba(15, 23, 42, 0.8)" stroke="#d4af37" stroke-width="0.8"/>
                <text x="49" y="20" fill="#d4af37" font-size="9" font-family="sans-serif" font-weight="bold" text-anchor="middle">Neurodynamic</text>
            </svg>
        </div>`;
    }

    // 6. تمرين علاجي عام ووضعية طبية معتمدة (Postural & General Medical Alignment)
    return `<div class="exercise-anat-badge" style="width: 100%; height: 140px; background: linear-gradient(180deg, #0b111e 0%, #151f32 100%); border-radius: 10px; display: flex; align-items: center; justify-content: center; position: relative; overflow: hidden; border: 1px solid rgba(212, 175, 55, 0.3); margin-bottom: 12px;">
        <svg viewBox="0 0 240 120" width="100%" height="100%" style="overflow: visible;">
            <!-- خط الاستقامة الشاقولي للعمود الفقري (Plumb Line) -->
            <line x1="120" y1="15" x2="120" y2="105" stroke="#d4af37" stroke-width="1.5" stroke-dasharray="4 3"/>
            <!-- منحنيات العمود الفقري التشريحية الصحيحة (S-Curve) -->
            <path d="M 120 25 Q 126 40 120 55 T 120 90" fill="none" stroke="#10b981" stroke-width="3.5" filter="url(#glow)"/>
            <circle cx="120" cy="22" r="8" fill="#334155" stroke="#d4af37" stroke-width="1.5"/>

            <rect x="10" y="8" width="75" height="18" rx="4" fill="rgba(15, 23, 42, 0.8)" stroke="#d4af37" stroke-width="0.8"/>
            <text x="47" y="20" fill="#d4af37" font-size="9" font-family="sans-serif" font-weight="bold" text-anchor="middle">Biomechanics</text>
        </svg>
    </div>`;
}

// مؤقت تفاعلي ذكي لتطبيق التمارين (Smart Clinical Exercise Timer)
let activeExerciseTimer = null;
function toggleExerciseTimer(btn, defaultSeconds = 30) {
    const card = btn.closest('.exercise-visual-card');
    const timerDisplay = card?.querySelector('.timer-sec-count');
    const timerProgress = card?.querySelector('.timer-progress-bar');
    
    if (btn.dataset.running === 'true') {
        // إيقاف مؤقت
        clearInterval(activeExerciseTimer);
        btn.dataset.running = 'false';
        btn.innerHTML = `<span>▶️ استئناف المؤقت (${btn.dataset.remaining} ثانية)</span>`;
        btn.style.background = 'linear-gradient(135deg, #d4af37 0%, #aa820a 100%)';
        btn.style.color = '#0a0e14';
        return;
    }

    let remaining = parseInt(btn.dataset.remaining || defaultSeconds);
    const total = parseInt(btn.dataset.total || defaultSeconds);
    btn.dataset.running = 'true';
    btn.dataset.total = total;
    btn.style.background = 'linear-gradient(135deg, #eab308 0%, #ca8a04 100%)';
    btn.style.color = '#0a0e14';

    if (typeof playStationAudio === 'function') {
        playStationAudio('exercise_start');
    }

    clearInterval(activeExerciseTimer);
    activeExerciseTimer = setInterval(() => {
        remaining--;
        btn.dataset.remaining = remaining;
        if (timerDisplay) timerDisplay.textContent = remaining;
        btn.innerHTML = `<span>⏸️ جاري التمرين: ${remaining} ثانية</span>`;
        
        if (timerProgress) {
            const percent = ((total - remaining) / total) * 100;
            timerProgress.style.width = `${percent}%`;
        }

        if (remaining <= 0) {
            clearInterval(activeExerciseTimer);
            btn.dataset.running = 'false';
            btn.dataset.remaining = total;
            btn.innerHTML = `<span>✅ تم إنجاز التمرين بنجاح!</span>`;
            btn.style.background = 'linear-gradient(135deg, #10b981 0%, #059669 100%)';
            btn.style.color = '#ffffff';
            if (timerProgress) timerProgress.style.width = '100%';
            
            if (typeof playStationAudio === 'function') {
                playStationAudio('exercise_finish');
            } else if (typeof ClinicalAudioPacer !== 'undefined') {
                ClinicalAudioPacer.playCompleteChime();
            }
            if (navigator.vibrate) navigator.vibrate([100, 50, 100]);

            // تشغيل محطة التحفيز / الراحة بين التمارين
            setTimeout(() => {
                if (typeof playStationAudio === 'function') {
                    playStationAudio('motivation');
                }
            }, 1200);
        }
    }, 1000);
}

// تحويل التمارين إلى بطاقات مصورة طبية فاخرة متوافقة تماماً مع ستايل التطبيق
function formatExercisesNew(exercises) {
    if (!exercises) return '';
    
    if (exercises.includes('exercise-visual-card')) {
        return exercises;
    }
    
    const lines = exercises.split('\n');
    let html = '<div class="exercise-visual-grid" style="display: grid; grid-template-columns: repeat(auto-fit, minmax(300px, 1fr)); gap: 20px; margin-top: 18px;">';
    let currentEx = null;
    let items = [];
    
    for (let line of lines) {
        line = line.trim();
        if (!line) continue;
        
        if (line.match(/^[🏋️🛏️🧘🚶🏊❄️🔥🩹💻🚫⚠️]/) || line.includes('**')) {
            if (currentEx) {
                items.push(currentEx);
            }
            currentEx = {
                title: line.replace(/\*\*/g, '').replace(/^[🏋️🛏️🧘🚶🏊❄️🔥🩹💻🚫⚠️]\s*/, '').trim(),
                steps: [],
                details: {},
                why: '',
                warnings: ''
            };
        } else if (currentEx) {
            if (line.includes('لماذا:') || line.includes('الهدف:')) {
                currentEx.why = line.split(':')[1]?.trim() || '';
            } else if (line.includes('التكرارات:') || line.includes('التكرار:')) {
                currentEx.details.reps = line.split(':')[1]?.trim() || '10 مرات';
            } else if (line.includes('الجولات:') || line.includes('المجموعات:')) {
                currentEx.details.sets = line.split(':')[1]?.trim() || '3 جولات';
            } else if (line.includes('المدة:') || line.includes('الوقت:')) {
                currentEx.details.duration = line.split(':')[1]?.trim() || '30 ثانية';
            } else if (line.includes('التوقف عند:') || line.includes('تنبيه:') || line.includes('تحذير:')) {
                currentEx.warnings = line.split(':')[1]?.trim() || line;
            } else if (line.startsWith('-') || line.match(/^\d+\./)) {
                currentEx.steps.push(line.replace(/^[-\d.]\s*/, '').trim());
            } else {
                currentEx.steps.push(line);
            }
        }
    }
    if (currentEx) items.push(currentEx);

    if (items.length === 0) {
        return `<div class="exercise-item"><div class="exercise-desc">${exercises}</div></div>`;
    }

    items.forEach((item, idx) => {
        const anatIllustration = getExerciseVisualIcon(item.title);
        const durationSec = parseInt(item.details.duration) || 30;
        
        html += `
        <div class="exercise-visual-card" style="background: #111827; border: 1px solid rgba(212, 175, 55, 0.35); border-radius: 14px; padding: 18px; position: relative; display: flex; flex-direction: column; justify-content: space-between; box-shadow: 0 8px 24px rgba(0,0,0,0.4);">
            <div>
                <!-- الرسم التشريحي الطبي عالي الدقة -->
                ${anatIllustration}

                <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 8px;">
                    <span style="font-size: 0.78em; background: rgba(212, 175, 55, 0.15); border: 1px solid var(--primary-gold); color: var(--primary-gold); padding: 3px 10px; border-radius: 6px; font-weight: bold;">تمرين علاجي #${idx+1}</span>
                    <span style="font-size: 0.78em; color: #10b981; font-weight: 500;">✓ إشراف علاجي</span>
                </div>

                <h3 style="margin: 6px 0 10px 0; color: #ffffff; font-size: 1.15em; font-weight: 700; line-height: 1.4;">${item.title}</h3>

                ${item.why ? `<div style="font-size: 0.85em; color: #cbd5e1; margin-bottom: 12px; background: rgba(30, 41, 59, 0.7); border-right: 3px solid var(--primary-gold); padding: 8px 12px; border-radius: 6px;">🎯 <strong>الهدف السريري:</strong> ${item.why}</div>` : ''}

                <div style="margin-bottom: 14px;">
                    <div style="font-size: 0.88em; color: var(--primary-gold); font-weight: bold; margin-bottom: 8px;">📋 خطوات الأداء الدقيقة:</div>
                    <ul style="margin: 0; padding-right: 18px; color: #e2e8f0; font-size: 0.88em; line-height: 1.7;">
                        ${item.steps.map(s => `<li>${s}</li>`).join('')}
                    </ul>
                </div>

                <div style="display: flex; gap: 8px; flex-wrap: wrap; margin-bottom: 12px;">
                    <span style="background: #1e2633; border: 1px solid rgba(212, 175, 55, 0.3); color: #d4af37; font-size: 0.82em; padding: 4px 10px; border-radius: 6px; font-weight: 600;">⏱️ ${item.details.duration || '30 ثانية'}</span>
                    <span style="background: #1e2633; border: 1px solid rgba(16, 185, 129, 0.3); color: #10b981; font-size: 0.82em; padding: 4px 10px; border-radius: 6px; font-weight: 600;">🔁 ${item.details.reps || '10 تكرارات'}</span>
                    ${item.details.sets ? `<span style="background: #1e2633; border: 1px solid rgba(245, 158, 11, 0.3); color: #f59e0b; font-size: 0.82em; padding: 4px 10px; border-radius: 6px; font-weight: 600;">📦 ${item.details.sets}</span>` : ''}
                </div>

                ${item.warnings ? `<div style="font-size: 0.8em; color: #fca5a5; background: rgba(239, 68, 68, 0.12); border-right: 3px solid #ef4444; padding: 8px 12px; border-radius: 6px; margin-bottom: 12px;">⚠️ <strong>توقف فوراً:</strong> ${item.warnings}</div>` : ''}
            </div>

            <!-- مؤقت التمرين التفاعلي المتوافق مع ستايل التطبيق -->
            <div style="margin-top: 12px; border-top: 1px solid rgba(212, 175, 55, 0.2); padding-top: 14px;">
                <div style="background: #1e2633; height: 6px; border-radius: 3px; overflow: hidden; margin-bottom: 10px; border: 1px solid rgba(255,255,255,0.05);">
                    <div class="timer-progress-bar" style="background: linear-gradient(90deg, #d4af37 0%, #10b981 100%); height: 100%; width: 0%; transition: width 1s linear;"></div>
                </div>
                <button type="button" onclick="toggleExerciseTimer(this, ${durationSec})" class="btn-exercise-timer" data-running="false" data-remaining="${durationSec}" data-total="${durationSec}" style="width: 100%; background: linear-gradient(135deg, #d4af37 0%, #aa820a 100%); color: #0a0e14; border: none; padding: 10px 14px; border-radius: 8px; font-weight: bold; cursor: pointer; font-size: 0.95em; transition: 0.2s; box-shadow: 0 4px 12px rgba(212, 175, 55, 0.25);">
                    ⏱️ ابدأ مؤقت التمرين (${durationSec} ثانية)
                </button>
            </div>
        </div>`;
    });
    
    html += '</div>';
    return html;
}

// دالة توليد بطاقات مكتبة التمارين المصورة الكاملة المتوافقة مع ستايل التطبيق
function renderExerciseLibraryCards(filterRegion = 'all') {
    const container = document.getElementById('exercise-library-cards');
    if (!container || typeof EXERCISES_DATABASE === 'undefined') return;

    let html = '';
    let count = 0;

    for (const [regionKey, categories] of Object.entries(EXERCISES_DATABASE)) {
        if (filterRegion !== 'all' && regionKey !== filterRegion) continue;

        for (const [catKey, levels] of Object.entries(categories)) {
            for (const [levelKey, exercises] of Object.entries(levels)) {
                if (!Array.isArray(exercises)) continue;

                for (const ex of exercises) {
                    count++;
                    const anatIllustration = getExerciseVisualIcon(ex.name);
                    const durationSec = parseInt(ex.duration) || 30;
                    const levelLabel = levelKey === 'beginner' ? 'مبتدئ' : (levelKey === 'intermediate' ? 'متوسط' : 'متقدم');
                    const levelColor = levelKey === 'beginner' ? '#10b981' : (levelKey === 'intermediate' ? '#f59e0b' : '#ef4444');

                    html += `
                    <div class="exercise-visual-card" style="background: #111827; border: 1px solid rgba(212, 175, 55, 0.35); border-radius: 14px; padding: 18px; display: flex; flex-direction: column; justify-content: space-between; box-shadow: 0 8px 24px rgba(0,0,0,0.4);">
                        <div>
                            <!-- الرسم التشريحي الطبي -->
                            ${anatIllustration}

                            <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 8px;">
                                <span style="font-size: 0.75em; background: ${levelColor}; color: #ffffff; padding: 3px 8px; border-radius: 4px; font-weight: bold;">${levelLabel}</span>
                                <span style="font-size: 0.75em; background: #1e2633; border: 1px solid var(--primary-gold); color: var(--primary-gold); padding: 3px 8px; border-radius: 4px;">${regionKey}</span>
                            </div>

                            <h3 style="margin: 6px 0 6px 0; color: #ffffff; font-size: 1.15em; font-weight: bold;">${ex.name}</h3>
                            ${ex.scientificName ? `<div style="font-size: 0.8em; color: #94a3b8; font-style: italic; margin-bottom: 10px;">${ex.scientificName}</div>` : ''}

                            ${ex.description ? `<p style="font-size: 0.85em; color: #cbd5e1; margin: 0 0 10px 0; line-height: 1.5;">${ex.description}</p>` : ''}

                            ${ex.instructions ? `
                            <div style="margin-bottom: 12px; background: rgba(30, 41, 59, 0.7); border-right: 3px solid var(--primary-gold); padding: 10px 12px; border-radius: 6px;">
                                <div style="font-size: 0.85em; color: var(--primary-gold); font-weight: bold; margin-bottom: 6px;">📋 طريقة التطبيق:</div>
                                <div style="font-size: 0.85em; color: #e2e8f0; white-space: pre-line; line-height: 1.6;">${ex.instructions}</div>
                            </div>` : ''}

                            <div style="display: flex; gap: 8px; flex-wrap: wrap; margin-bottom: 12px;">
                                <span style="background: #1e2633; border: 1px solid rgba(212, 175, 55, 0.3); color: #d4af37; font-size: 0.8em; padding: 4px 8px; border-radius: 4px; font-weight: 600;">⏱️ ${ex.duration || '30 ثانية'}</span>
                                <span style="background: #1e2633; border: 1px solid rgba(16, 185, 129, 0.3); color: #10b981; font-size: 0.8em; padding: 4px 8px; border-radius: 4px; font-weight: 600;">🔁 ${ex.reps || '10 تكرارات'}</span>
                            </div>

                            ${ex.benefits ? `<div style="font-size: 0.82em; color: #10b981; margin-bottom: 6px;">✨ <strong>الفائدة:</strong> ${ex.benefits}</div>` : ''}
                            ${ex.warnings ? `<div style="font-size: 0.8em; color: #fca5a5; background: rgba(239, 68, 68, 0.1); padding: 6px 10px; border-radius: 4px; margin-bottom: 10px;">⚠️ <strong>تحذير:</strong> ${ex.warnings}</div>` : ''}
                        </div>

                        <!-- مؤقت التمرين التفاعلي -->
                        <div style="margin-top: 10px; border-top: 1px solid rgba(212, 175, 55, 0.2); padding-top: 12px;">
                            <div style="background: #1e2633; height: 5px; border-radius: 3px; overflow: hidden; margin-bottom: 8px;">
                                <div class="timer-progress-bar" style="background: linear-gradient(90deg, #d4af37 0%, #10b981 100%); height: 100%; width: 0%; transition: width 1s linear;"></div>
                            </div>
                            <button type="button" onclick="toggleExerciseTimer(this, ${durationSec})" class="btn-exercise-timer" data-running="false" data-remaining="${durationSec}" data-total="${durationSec}" style="width: 100%; background: linear-gradient(135deg, #d4af37 0%, #aa820a 100%); color: #0a0e14; border: none; padding: 8px 12px; border-radius: 6px; font-weight: bold; cursor: pointer; font-size: 0.9em; transition: 0.2s;">
                                ⏱️ ابدأ مؤقت التمرين (${durationSec} ثانية)
                            </button>
                        </div>
                    </div>`;
                }
            }
        }
    }

    if (count === 0) {
        html = '<div style="grid-column: 1/-1; text-align: center; color: #9ca3af; padding: 40px;">لا توجد تمارين متاحة لهذا القسم حالياً.</div>';
    }

    container.innerHTML = html;
}

// تحديث BMI لحظياً
function updateBMIDisplay() {
    const w = parseFloat(document.getElementById('weight').value);
    const h = parseFloat(document.getElementById('height').value);
    const div = document.getElementById('bmi-display');
    if (w && h && h>0) {
        const bmi = calculateBMI(w,h);
        if(bmi) {
            const cat = getBMICategoryAdvanced(bmi,w,h);
            div.style.display='block';
            div.innerHTML = `<span class="bmi-badge ${cat.class}">BMI: ${bmi.toFixed(1)} (${cat.text})</span> ➜ ${cat.desc}`;
        } else div.style.display='none';
    } else div.style.display='none';
}

// تحليل الوصف الحر واستخراج الكلمات المفتاحية
function analyzeFreeDescription() {
    const description = document.getElementById('free-description').value;
    const analysisDiv = document.getElementById('description-analysis');
    
    if (!description.trim()) {
        analysisDiv.style.display = 'none';
        return;
    }
    
    // قاموس الكلمات المفتاحية
    const keywords = {
        'neck': ['رقبة', 'عنق', 'الرقبة', 'العنق'],
        'shoulder': ['كتف', 'كتفين', 'الكتف'],
        'back': ['ظهر', 'الظهر', 'فقرات', 'عمود فقري'],
        'lower_back': ['أسفل الظهر', 'قطني', 'منطقة القطنية'],
        'pain': ['ألم', 'وجع', 'آلام', 'وجع'],
        'radiation': ['يشع', 'يمتد', 'ينتشر', 'انتشار'],
        'numbness': ['تنميل', 'خدر', 'وخز'],
        'weakness': ['ضعف', 'لا أستطيع', 'صعوبة'],
        'stiffness': ['تيبس', 'تصلب', 'صلابة'],
        'clicking': ['طقطقة', 'فرقعة', 'احتكاك'],
        'swelling': ['تورم', 'انتفاخ'],
        'instability': ['يفلت', 'عدم استقرار', 'غير مستقر'],
        'night_pain': ['ليل', 'الليل', 'أثناء النوم'],
        'morning': ['صباح', 'الصباح', 'صباحي'],
        'computer': ['كمبيوتر', 'حاسوب', 'لابتوب'],
        'phone': ['هاتف', 'موبايل', 'جوال'],
        'sitting': ['جلوس', 'جالس', 'أجلس'],
        'standing': ['وقوف', 'واقف', 'أقف'],
        'walking': ['مشياً', 'أمشي', 'المشي'],
        'stairs': ['درج', 'صعود', 'نزول'],
        'running': ['جري', 'أجري'],
        'trauma': ['حادث', 'سقوط', 'إصابة', 'ضربة'],
        'chronic': ['مزمن', 'منذ فترة', 'طويل', 'سنوات'],
        'acute': ['فجأة', 'فجائي', 'حديث', 'منذ أيام'],
        'fever': ['حمى', 'حرارة'],
        'headache': ['صداع', 'رأس'],
        'dizziness': ['دوخة', 'دوار']
    };
    
    const foundKeywords = [];
    const descLower = description.toLowerCase();
    
    for (const [category, words] of Object.entries(keywords)) {
        for (const word of words) {
            if (descLower.includes(word.toLowerCase())) {
                foundKeywords.push({ category, word });
                break;
            }
        }
    }
    
    if (foundKeywords.length > 0) {
        const categories = [...new Set(foundKeywords.map(k => k.category))];
        let analysisText = '<strong>🔍 تحليل الوصف:</strong><br>';
        
        if (categories.includes('neck')) analysisText += '• يشير إلى مشكلة في الرقبة<br>';
        if (categories.includes('shoulder')) analysisText += '• يشير إلى مشكلة في الكتف<br>';
        if (categories.includes('back')) analysisText += '• يشير إلى مشكلة في الظهر<br>';
        if (categories.includes('lower_back')) analysisText += '• يشير إلى مشكلة في أسفل الظهر<br>';
        if (categories.includes('radiation')) analysisText += '• يوجد امتداد للألم (قد يشير لمشكلة عصبية)<br>';
        if (categories.includes('numbness')) analysisText += '• يوجد تنميل (قد يشير لمشكلة عصبية)<br>';
        if (categories.includes('weakness')) analysisText += '• يوجد ضعف (قد يشير لمشكلة عصبية)<br>';
        if (categories.includes('stiffness')) analysisText += '• يوجد تيبس (قد يشير لمشكلة التهابية)<br>';
        if (categories.includes('clicking')) analysisText += '• يوجد طقطقة (قد يشير لمشكلة ميكانيكية)<br>';
        if (categories.includes('swelling')) analysisText += '• يوجد تورم (قد يشير لمشكلة التهابية)<br>';
        if (categories.includes('instability')) analysisText += '• يوجد عدم استقرار (قد يشير لمشكلة ميكانيكية)<br>';
        if (categories.includes('night_pain')) analysisText += '• الألم يزداد ليلاً (قد يشير لمشكلة التهابية)<br>';
        if (categories.includes('morning')) analysisText += '• الأعراض صباحية (قد يشير لمشكلة التهابية)<br>';
        if (categories.includes('computer') || categories.includes('phone')) analysisText += '• مرتبط باستخدام التكنولوجيا (قد يشير لمشكلة وضعية)<br>';
        if (categories.includes('sitting')) analysisText += '• مرتبط بالجلوس (قد يشير لمشكلة وضعية)<br>';
        if (categories.includes('trauma')) analysisText += '• مرتبط بإصابة (قد يشير لمشكلة إصاباتية)<br>';
        if (categories.includes('chronic')) analysisText += '• مشكلة مزمنة (أكثر من شهر)<br>';
        if (categories.includes('acute')) analysisText += '• مشكلة حادة (أقل من أسبوع)<br>';
        if (categories.includes('fever')) analysisText += '• يوجد حمى (علامة خطر - يجب استشارتنا لتأكيد التشخيص)<br>';
        
        analysisDiv.innerHTML = analysisText;
        analysisDiv.style.display = 'block';
    } else {
        analysisDiv.style.display = 'none';
    }
}

async function performDiagnosis() {
    const loader = document.getElementById('loader');
    loader.classList.add('active');
    await new Promise(r=>setTimeout(r,300));
    
    try {
        const age = parseInt(document.getElementById('age').value);
        const gender = document.getElementById('gender').value;
        const weight = parseFloat(document.getElementById('weight').value);
        const height = parseFloat(document.getElementById('height').value);
        const duration = document.getElementById('duration').value;
        const severity = parseInt(document.getElementById('severity').value);
        const redFlags = Array.from(document.querySelectorAll('input[name="redflag"]:checked')).map(cb=>cb.value);
        const chronicDiseases = Array.from(document.querySelectorAll('input[name="chronic"]:checked')).map(cb=>cb.value);
        
        // جمع الملاحظات الشخصية
        const personalNotes = document.getElementById('personal-notes') ? document.getElementById('personal-notes').value.trim() : '';
        
        if(!activeJointId) { showCustomAlert("👆 يرجى اختيار نقطة الألم على المجسم أولاً للبدء في التشخيص", 'warning'); loader.classList.remove('active'); return; }
        if(isNaN(age)||age<1) { showCustomAlert("⚠️ يرجى إدخال عمر صحيح (يجب أن يكون رقماً أكبر من صفر)", 'warning'); loader.classList.remove('active'); return; }
        if(!gender) { showCustomAlert("⚠️ يرجى اختيار الجنس من القائمة المنسدلة", 'warning'); loader.classList.remove('active'); return; }
        
        let answers = {};
        document.querySelectorAll('#dynamic-questions select').forEach(sel=>{ 
            if(sel.value) answers[sel.name]=sel.value; 
        });
        document.querySelectorAll('#dynamic-questions input[type="checkbox"]:checked').forEach(cb=>{ 
            if(!answers[cb.name]) answers[cb.name] = [];
            answers[cb.name].push(cb.value);
        });
        document.querySelectorAll('#dynamic-questions textarea').forEach(txt=>{ 
            if(txt.value.trim()) answers[txt.name]=txt.value.trim(); 
        });
        
        // تسجيل الإجابات للتشخيص
        console.log('📋 الإجابات المجمعة من الأسئلة الديناميكية:', JSON.stringify(answers, null, 2));
        console.log('📊 عدد الأسئلة الموجودة:', document.querySelectorAll('#dynamic-questions select, #dynamic-questions input[type="checkbox"], #dynamic-questions textarea').length);
        console.log('🔍 تفاصيل الأسئلة:', Array.from(document.querySelectorAll('#dynamic-questions select, #dynamic-questions input[type="checkbox"], #dynamic-questions textarea')).map(el => ({ type: el.type, name: el.name, value: el.value, checked: el.checked })));
        
        // إضافة حقول الألم والمدة والشدة للإجابات
        answers.severity = severity;
        answers.duration = duration;
        
        // إعادة تعيين الإجابات للأسئلة المخفية
        document.querySelectorAll('#dynamic-questions .conditional-question[style*="display: none"]').forEach(hiddenQ => {
            const hiddenSelect = hiddenQ.querySelector('select');
            if(hiddenSelect) {
                const fieldName = hiddenSelect.name;
                if(answers[fieldName]) delete answers[fieldName];
            }
        });
        
        let bmi = calculateBMI(weight,height);
        let bmiCat = bmi ? getBMICategoryAdvanced(bmi,weight,height) : null;
        const bmiDiv = document.getElementById('bmi-display');
        if(bmiCat) {
            bmiDiv.style.display='block';
            bmiDiv.innerHTML = `<span class="bmi-badge ${bmiCat.class}">BMI: ${bmi.toFixed(1)} (${bmiCat.text})</span> ➜ ${bmiCat.desc}`;
        } else bmiDiv.style.display='none';
        
        const { scores: diagnosis, confidence, referral, urgentReferral, pattern } = await computeDiagnosis(activeJointId, answers, age, bmi, duration, severity, chronicDiseases, weight, height);
        
        const redWarn = document.getElementById('red-flags-warning');
        if(redFlags.length>0) {
            redWarn.style.display='block';
            document.getElementById('red-flags-text').innerHTML = "🚨 " + redFlags.join(" • ") + " - يرجى التوجه للطوارئ فوراً.";
        } else redWarn.style.display='none';
        
        let dxHtml = "";
        for(let d of diagnosis) if(d.prob>0) dxHtml += `<div><strong>${d.name}</strong> - احتمالية: ${d.prob}%<div style="background:#1e2633; height:6px; margin:5px 0;"><div style="background:#d4af37; width:${d.prob}%; height:6px;"></div></div></div>`;
        document.getElementById('differential-dx').innerHTML = dxHtml;
        
        const detailedReport = generateDetailedReport(diagnosis, activeJointName, answers, age, bmi, gender, '', severity, duration, chronicDiseases, pattern);
        document.getElementById('detailed-assessment').innerHTML = detailedReport;
        
        console.log('Debug - activeJointId:', activeJointId);
        console.log('Debug - diagnosis:', diagnosis);
        const { exercises, warnings } = await getHomeExercisesAndWarnings(diagnosis, activeJointId, pattern, age, bmi, severity, duration);
        
        // تحويل التمارين إلى التنسيق الجديد مع أسماء واضحة
        let formattedExercises = formatExercisesNew(exercises);
        
        document.getElementById('home-exercises').innerHTML = formattedExercises;
        
        let warnHtml = "<ul>";
        warnings.forEach(w=>warnHtml+=`<li style="color: ${w.includes('❌') || w.includes('🚫') || w.includes('🚨') ? '#ef4444' : (w.includes('⚠️') ? '#f59e0b' : '#10b981')}; font-weight: bold;">${w}</li>`);
        warnHtml += "</ul>";
        document.getElementById('warning-list').innerHTML = warnHtml;
        document.getElementById('exercise-warning').innerHTML = "⚠️ هذه الإرشادات مؤقتة وليست بديلاً عن التشخيص السريري.";
        
        let mainDx = diagnosis[0].name, mainProb = diagnosis[0].prob;
        const waPhone = (typeof APP_CONFIG !== 'undefined' && APP_CONFIG.whatsappPhone) ? APP_CONFIG.whatsappPhone : '962790000000';
        let whatsappMsg = `تقرير Smart Check Pro:\n• المنطقة: ${activeJointName}\n• التشخيص المحتمل: ${mainDx} (${mainProb}%)\n• العمر: ${age} سنة\n• BMI: ${bmi?bmi.toFixed(1):'غير مدخل'}\n• شدة الألم: ${severity}/10\n• مدة الألم: ${duration}\n• علامات خطر: ${redFlags.length>0?'نعم':'لا'}\n• مستوى الثقة: ${confidence}%`;
        document.getElementById('whatsapp-consult-btn').href = `https://wa.me/${waPhone}?text=${encodeURIComponent(whatsappMsg)}`;
        
        // إضافة توصية ترويجية للعيادة
        const clinicReferralDiv = document.createElement('div');
        clinicReferralDiv.style.marginTop = '20px';
        clinicReferralDiv.style.padding = '20px';
        clinicReferralDiv.style.background = 'linear-gradient(135deg, #10b981 0%, #059669 100%)';
        clinicReferralDiv.style.color = 'white';
        clinicReferralDiv.style.borderRadius = '12px';
        clinicReferralDiv.style.border = '2px solid #059669';
        clinicReferralDiv.innerHTML = `
            <h3 style="margin: 0 0 10px 0;">🏥 استشارة مجانية مع عيادتنا</h3>
            <p style="margin: 0 0 15px 0;">للحصول على تشخيص دقيق وخطة علاج مخصصة، يرجى استشارتنا لتأكيد التشخيص. الاستشارة على واتساب مجانية!</p>
            <a href="https://wa.me/${waPhone}?text=${encodeURIComponent(whatsappMsg)}" target="_blank" style="display: inline-block; background: white; color: #059669; padding: 10px 20px; border-radius: 8px; text-decoration: none; font-weight: bold;">💬 استشارة مجانية على واتساب</a>
        `;
        document.getElementById('detailed-assessment').appendChild(clinicReferralDiv);
        document.getElementById('confidence-badge').innerHTML = `التشخيص الرئيسي: ${mainDx} (${mainProb}%) | الثقة: ${confidence}%`;
        
        // إضافة تحذير عاجل إذا لزم الأمر
        if(urgentReferral) {
            const urgentDiv = document.createElement('div');
            urgentDiv.style.marginTop='15px'; urgentDiv.style.padding='15px'; urgentDiv.style.backgroundColor='#fee2e2'; urgentDiv.style.color='#991b1b'; urgentDiv.style.borderRadius='8px'; urgentDiv.style.border='2px solid #ef4444';
            urgentDiv.innerHTML = `🚨 ${referral}`;
            document.getElementById('detailed-assessment').appendChild(urgentDiv);
        } else if(referral) {
            const refDiv = document.createElement('div');
            refDiv.style.marginTop='15px'; refDiv.style.padding='10px'; refDiv.style.backgroundColor='#fef3c7'; refDiv.style.color='#92400e'; refDiv.style.borderRadius='8px';
            refDiv.innerHTML = `📌 ${referral}`;
            document.getElementById('detailed-assessment').appendChild(refDiv);
        }
        
        // عرض اسم المريض في التقرير
        const patientNameDisplay = document.getElementById('patient-name-display');
        if (patientNameDisplay) {
            const patient = await SmartCheckDB.getCurrentPatient();
            if (patient && patient.name) {
                patientNameDisplay.textContent = patient.name;
            } else {
                patientNameDisplay.textContent = 'المريض';
            }
        }
        
        document.getElementById('report-section').style.display = "block";
        document.getElementById('report-section').scrollIntoView({ behavior: 'smooth' });
        loader.classList.remove('active');
        document.getElementById('progress-fill').style.width = "100%";
        saveState();
        
        // عرض زر خطة التعافي المجانية في التقرير
        const recoveryPlanCTA = document.getElementById('recovery-plan-cta');
        if (recoveryPlanCTA) {
            recoveryPlanCTA.style.display = 'block';
        }

        // ربط زر بدء خطة التعافي
        const startRecoveryBtn = document.getElementById('start-recovery-plan-btn');
        if (startRecoveryBtn) {
            startRecoveryBtn.addEventListener('click', showRecoveryPlanModal);
        }

        // حفظ بيانات التشخيص في localStorage لاستخدامها لاحقاً
        localStorage.setItem('lastDiagnosis', JSON.stringify(diagnosis));
        localStorage.setItem('lastPattern', pattern);
        localStorage.setItem('lastSeverity', severity);
        localStorage.setItem('lastDuration', duration);

        // حفظ بيانات التقييم في IndexedDB إذا كان مسجلاً
        const currentPatient = await SmartCheckDB.getCurrentPatient();
        if (currentPatient) {
            // حفظ الملاحظات الشخصية مع التقييم
            const assessmentData = {
                diagnosis: diagnosis,
                pattern: pattern,
                severity: severity,
                duration: duration,
                personalNotes: personalNotes,
                timestamp: new Date().toISOString()
            };
            await saveAssessmentToDB(currentPatient.patientId, diagnosis, pattern, severity, duration, personalNotes);
            // لا نظهر المتابعة اليومية هنا - ستظهر فقط بعد حفظ البيانات
        } else {
            // المريض غير مسجل - إنشاء مريض جديد للترحيل إلى الإدارة
            console.log('⚠️ المريض غير مسجل - إنشاء مريض جديد للترحيل');
            const tempPatientId = `temp_${Date.now()}`;
            const tempPatient = await SmartCheckDB.createPatientProfile(
                tempPatientId,
                'غير محدد',
                age,
                gender,
                weight,
                height,
                null
            );
            
            // تحديث بيانات المريض ببيانات التشخيص
            await SmartCheckDB.updatePatientProfile(tempPatientId, {
                acceptedRecoveryPlan: false,
                painArea: activeJointName,
                lastVisit: new Date().toISOString()
            });
            
            // حفظ التقييم للمريض الجديد
            await saveAssessmentToDB(tempPatientId, diagnosis, pattern, severity, duration, personalNotes);
            
            // حفظ معرف المريض المؤقت في localStorage لاستخدامه عند الاشتراك
            localStorage.setItem('tempPatientId', tempPatientId);
            
            console.log('✅ تم إنشاء مريض مؤقت للترحيل:', tempPatientId);
        }
        
        // حفظ الملاحظات الشخصية في localStorage للاستخدام في التقرير
        localStorage.setItem('personalNotes', personalNotes);
    } catch (error) {
        console.error('خطأ في التشخيص:', error);
        loader.classList.remove('active');
        showCustomAlert('😅 حدث خطأ أثناء التشخيص. يرجى التأكد من إدخال جميع البيانات المطلوبة والمحاولة مرة أخرى', 'error');
    }
}

// دالة فتح نافذة خطة التعافي
function showRecoveryPlanModal() {
    // استخدام البيانات الموجودة مباشرة بدلاً من النافذة المنبثقة
    const name = document.getElementById('patient-name')?.value?.trim() || '';
    const phone = document.getElementById('patient-phone')?.value?.trim() || '';
    const countryCode = document.getElementById('patient-country')?.value || 'jo';
    
    // نقل البيانات إلى قسم حفظ البيانات
    document.getElementById('patient-name-save').value = name;
    document.getElementById('patient-phone-save').value = phone;
    document.getElementById('patient-country').value = countryCode;
    
    // إظهار قسم حفظ البيانات مباشرة
    document.getElementById('save-data-section').style.display = 'block';
}

// دالة حفظ البيانات وبدء خطة التعافي
async function savePatientDataAndStartPlan() {
    const name = document.getElementById('patient-name-save').value.trim();
    const phone = document.getElementById('patient-phone-save').value.trim();
    const countryCode = document.getElementById('patient-country').value;
    
    if (!name || !phone) {
        showCustomAlert('⚠️ يرجى إدخال الاسم ورقم الهاتف للمتابعة مع خطة التعافي', 'warning');
        return;
    }
    
    try {
        // تسجيل الدخول وحفظ البيانات
        let patient = await SmartCheckDB.login(phone, countryCode);
        
        // إذا لم يكن المريض موجوداً، قم بإنشائه
        if (!patient) {
            const patientId = `${countryCode}_${phone}`;
            patient = await SmartCheckDB.createPatientProfile(patientId, name, null, null, null, null, countryCode);
            console.log('🆕 تم إنشاء مريض جديد:', patient);
            
            // ترحيل التقييم من المريض المؤقت إذا وجد
            const tempPatientId = localStorage.getItem('tempPatientId');
            if (tempPatientId) {
                console.log('🔄 ترحيل التقييم من المريض المؤقت:', tempPatientId);
                const tempAssessments = await SmartCheckDB.getPatientAssessments(tempPatientId);
                if (tempAssessments.length > 0) {
                    const lastAssessment = tempAssessments[tempAssessments.length - 1];
                    await SmartCheckDB.saveAssessment(patientId, lastAssessment);
                    console.log('✅ تم ترحيل التقييم بنجاح');
                }
                // حذف المريض المؤقت
                await SmartCheckDB.deletePatientProfile(tempPatientId);
                localStorage.removeItem('tempPatientId');
                console.log('🗑️ تم حذف المريض المؤقت');
            }
            
            // تعيين الجلسة يدوياً
            localStorage.setItem('currentPatientId', patient.patientId);
            localStorage.setItem('currentPatientPhone', phone);
            localStorage.setItem('currentPatientCountry', countryCode);
            console.log('💾 تم تعيين الجلسة يدوياً. currentPatientId:', patient.patientId);
        }
        
        // تحديث بيانات المريض
        await SmartCheckDB.updatePatientProfile(patient.patientId, {
            name: name,
            age: document.getElementById('age')?.value || null,
            gender: document.getElementById('gender')?.value || 'male',
            weight: document.getElementById('weight')?.value || null,
            height: document.getElementById('height')?.value || null,
            acceptedRecoveryPlan: true,
            acceptedPlanDate: new Date().toISOString()
        });
        
        // حفظ التقييم الحالي
        const currentPatient = await SmartCheckDB.getCurrentPatient();
        if (currentPatient) {
            // الحصول على التقييمات السابقة للمريض
            const assessments = await SmartCheckDB.getPatientAssessments(currentPatient.patientId);
            
            if (assessments.length > 0) {
                // استخدام آخر تقييم موجود
                console.log('✅ استخدام آخر تقييم موجود:', assessments[assessments.length - 1]);
            } else {
                // إنشاء تقييم جديد إذا لم يكن هناك تقييمات
                const assessmentData = {
                    painArea: activeJointName || 'غير محدد',
                    painScore: document.getElementById('severity')?.value || 5,
                    clinicalFeatures: [],
                    diagnoses: [],
                    treatmentGoals: [],
                    recoveryPlan: []
                };
                await SmartCheckDB.saveAssessment(currentPatient.patientId, assessmentData);
                console.log('✅ تم إنشاء تقييم جديد');
            }
        }
        
        // إظهار رسالة النجاح
        showCustomAlert('✅ تم حفظ بياناتك بنجاح! يمكنك الآن البدء في خطة التعافي', 'success');
        
        // إخفاء قسم حفظ البيانات
        document.getElementById('save-data-section').style.display = 'none';
        
        // حفظ وقت التسجيل كوقت بداية خطة التعافي
        localStorage.setItem('lastDailyLogUpdate', new Date().toISOString());
        console.log('🕐 تم حفظ وقت التسجيل:', localStorage.getItem('lastDailyLogUpdate'));
        
        // تسجيل الدخول تلقائياً وتحميل بيانات المريض
        console.log('🔍 تسجيل الدخول التلقائي وتحميل بيانات المريض...');
        await loadPatientData(patient.patientId);
        
        // إخفاء المجسم والخطوات والأسئلة بعد الاشتراك
        console.log('🔍 إخفاء المجسم والخطوات والأسئلة...');
        const modelContainer = document.querySelector('.model-container');
        if (modelContainer) modelContainer.style.display = 'none';
        
        const stepsIndicator = document.querySelector('.steps-indicator');
        if (stepsIndicator) stepsIndicator.style.display = 'none';
        
        const controlPanel = document.querySelector('.control-panel');
        if (controlPanel) controlPanel.style.display = 'none';
        
        const anatomyWrapper = document.querySelector('.anatomy-wrapper');
        if (anatomyWrapper) anatomyWrapper.style.display = 'none';
        
        const statusBar = document.getElementById('selected-status');
        if (statusBar) statusBar.style.display = 'none';
        
        const dynamicQuestionsDiv = document.getElementById('dynamic-questions');
        if (dynamicQuestionsDiv) dynamicQuestionsDiv.style.display = 'none';
        
        const chronicDiseasesSection = document.querySelector('.chronic-diseases');
        if (chronicDiseasesSection) chronicDiseasesSection.style.display = 'none';
        
        const personalDataSections = document.querySelectorAll('.personal-data-section');
        personalDataSections.forEach(section => {
            section.style.display = 'none';
        });
        
        const redFlagsSection = document.querySelector('.red-flags-section');
        if (redFlagsSection) redFlagsSection.style.display = 'none';
        
        // إخفاء قسم المتابعة اليومية في اليوم الأول (لأن التمارين المنزلية هي المفروض موجودة)
        const dailyTrackingSection = document.getElementById('daily-tracking-section');
        if (dailyTrackingSection) {
            dailyTrackingSection.style.display = 'none';
            console.log('✅ تم إخفاء قسم المتابعة اليومية في اليوم الأول');
        }
        
        // إخفاء قسم السلوكيات حتى اليوم الثاني
        const behaviorsSection = document.getElementById('daily-behaviors-section');
        if (behaviorsSection) {
            behaviorsSection.style.display = 'none';
            console.log('✅ تم إخفاء قسم السلوكيات حتى اليوم الثاني');
        }
        
        console.log('✅ تم إخفاء جميع العناصر غير المرغوبة بعد الاشتراك');
        
        // إضافة class لتوسيط التقرير
        document.body.classList.add('subscribed-user');
        console.log('✅ تم إضافة class subscribed-user لتوسيط التقرير');
        
        // إظهار الساعة الأنيقة للعد التنازلي (24 ساعة)
        const elegantCountdownDiv = document.getElementById('elegant-countdown');
        if (elegantCountdownDiv) {
            elegantCountdownDiv.style.display = 'block';
            console.log('✅ تم إظهار الساعة الأنيقة للعد التنازلي');
            
            // استخدام نفس منطق sessionStartTime مثل باقي الأماكن
            const currentSession = 1;
            const sessionStartTimeKey = `sessionStartTime_${patient.patientId}_${currentSession}`;
            let sessionStartTime = localStorage.getItem(sessionStartTimeKey);
            
            if (!sessionStartTime) {
                sessionStartTime = new Date().toISOString();
                localStorage.setItem(sessionStartTimeKey, sessionStartTime);
                console.log('🆕 تعيين وقت بدء الجلسة 1:', sessionStartTime);
            }
            
            const regDate = new Date(sessionStartTime);
            const sessionInterval = parseInt(localStorage.getItem('sessionInterval')) || 24;
            
            // تعريف دالة تحديث الساعة في نطاق عام
            window.updatePatientCountdown = () => {
                const currentSessionStartTime = localStorage.getItem(sessionStartTimeKey);
                const currentRegDate = currentSessionStartTime ? new Date(currentSessionStartTime) : regDate;
                const currentSessionInterval = parseInt(localStorage.getItem('sessionInterval')) || 24;
                const now = new Date();
                const elapsed = (now - currentRegDate) / (1000 * 60 * 60);
                const remaining = currentSessionInterval - elapsed;
                
                if (remaining <= 0) {
                    elegantCountdownDiv.innerHTML = `
                        <div class="countdown-finished">
                            <h2>✅ انتهت فترة الانتظار</h2>
                            <p>يمكنك الآن البدء في المتابعة اليومية</p>
                            <button onclick="location.reload()">تحديث الصفحة</button>
                        </div>
                    `;
                    return;
                }
                
                const hours = Math.floor(remaining);
                const minutes = Math.floor((remaining - hours) * 60);
                const seconds = Math.floor(((remaining - hours) * 60 - minutes) * 60);
                
                elegantCountdownDiv.innerHTML = `
                    <div style="background: linear-gradient(135deg, #1e2633 0%, #2d3748 100%); padding: 25px; border-radius: 16px; text-align: center; border: 2px solid #d4af37; box-shadow: 0 8px 32px rgba(212, 175, 55, 0.2);">
                        <div style="color: #d4af37; font-size: 1.2em; margin-bottom: 15px; font-weight: bold;">
                            🕐 الوقت المتبقي للجلسة 1
                        </div>
                        <div style="display: flex; justify-content: center; gap: 20px; margin-bottom: 10px;">
                            <div style="background: #0a0e14; padding: 15px 25px; border-radius: 12px; min-width: 80px; border: 1px solid #d4af37;">
                                <div style="font-size: 2.5em; font-weight: bold; color: #fff;">${String(hours).padStart(2, '0')}</div>
                                <div style="color: #9ca3af; font-size: 0.9em;">ساعة</div>
                            </div>
                            <div style="background: #0a0e14; padding: 15px 25px; border-radius: 12px; min-width: 80px; border: 1px solid #d4af37;">
                                <div style="font-size: 2.5em; font-weight: bold; color: #fff;">${String(minutes).padStart(2, '0')}</div>
                                <div style="color: #9ca3af; font-size: 0.9em;">دقيقة</div>
                            </div>
                            <div style="background: #0a0e14; padding: 15px 25px; border-radius: 12px; min-width: 80px; border: 1px solid #d4af37;">
                                <div style="font-size: 2.5em; font-weight: bold; color: #d4af37;">${String(seconds).padStart(2, '0')}</div>
                                <div style="color: #9ca3af; font-size: 0.9em;">ثانية</div>
                            </div>
                        </div>
                        <div style="color: #ffffff; font-size: 1.1em; margin-top: 15px; font-weight: bold; display: flex; align-items: center; justify-content: center; gap: 10px;">
                            ⚠️ سيتم تفعيل المتابعة اليومية تلقائياً عند انتهاء الوقت
                        </div>
                    </div>
                `;
            };
            
            window.updatePatientCountdown();
            setInterval(window.updatePatientCountdown, 1000);
            
            // الاستماع للتغييرات في countdownUpdated من الإدارة
            window.addEventListener('storage', function(e) {
                if (e.key === 'countdownUpdated') {
                    console.log('🔄 تم اكتشاف تغيير في التوقيت من الإدارة - إعادة تحميل الساعة');
                    window.updatePatientCountdown();
                }
            });
            
            // التحقق الدوري من countdownUpdated (للعمل في نفس التبويب)
            let lastUpdateCheck = localStorage.getItem('countdownUpdated');
            setInterval(() => {
                const currentUpdate = localStorage.getItem('countdownUpdated');
                if (currentUpdate !== lastUpdateCheck) {
                    lastUpdateCheck = currentUpdate;
                    console.log('🔄 تم اكتشاف تغيير في التوقيت - إعادة تحميل الساعة');
                    window.updatePatientCountdown();
                }
            }, 1000);
        }
        
    } catch (error) {
        console.error('❌ خطأ في حفظ البيانات:', error);
        showCustomAlert('😅 حدث خطأ في حفظ البيانات. يرجى المحاولة مرة أخرى', 'error');
    }
}

// دالة إغلاق نافذة خطة التعافي
function closeRecoveryPlanModal() {
    document.getElementById('recovery-plan-modal').style.display = 'none';
}

// دالة التحقق من إمكانية الإدخال اليومي (مع تقييد زمني 24 ساعة)
async function checkDailyLogAvailability() {
    const patient = await SmartCheckDB.getCurrentPatient();
    if (!patient) return false;
    
    console.log('🔍 التحقق من إمكانية الإدخال اليومي:', patient.patientId);
    
    const elegantCountdownDiv = document.getElementById('elegant-countdown');
    const dailyTrackingSection = document.getElementById('daily-tracking-section');
    const questionsContainer = document.getElementById('daily-log-form');
    const behaviorsSection = document.getElementById('daily-behaviors-section');
    const saveBtn = document.getElementById('save-daily-log-btn');
    const messageDiv = document.getElementById('daily-tracking-message');
    
    // الحصول على السجلات اليومية
    const logs = await SmartCheckDB.getPatientDailyLogs(patient.patientId);
    console.log('📊 عدد السجلات اليومية:', logs.length);
    
    // اليوم الأول (logs.length === 0)
    if (logs.length === 0) {
        console.log('✅ اليوم الأول - إظهار الساعة والتمارين المنزلية');
        
        // إظهار التمارين المنزلية وتوصيات اليوم الأول
        const reportRecommendationsSection = document.getElementById('report-recommendations-section');
        if (reportRecommendationsSection) {
            reportRecommendationsSection.style.display = 'block';
        }
        
        const homeExercises = document.getElementById('home-exercises');
        if (homeExercises) {
            homeExercises.style.display = 'block';
            console.log('✅ تم إظهار التمارين المنزلية');
        }
        
        // إظهار قسم التقرير (يحتوي على التمارين المنزلية)
        const reportSection = document.getElementById('report-section');
        if (reportSection) {
            reportSection.style.display = 'block';
            console.log('✅ تم إظهار قسم التقرير');
        }
        
        // إخفاء قسم المتابعة اليومية
        if (dailyTrackingSection) {
            dailyTrackingSection.style.display = 'none';
        }
        
        // إخفاء نموذج الأسئلة
        if (questionsContainer) {
            questionsContainer.style.display = 'none';
        }
        
        // إخفاء قسم السلوكيات
        if (behaviorsSection) {
            behaviorsSection.style.display = 'none';
        }
        
        // إخفاء زر الحفظ
        if (saveBtn) {
            saveBtn.style.display = 'none';
        }
        
        // إظهار الساعة
        if (elegantCountdownDiv) {
            const sessionStartTimeKey = `sessionStartTime_${patient.patientId}_1`;
            let sessionStartTime = localStorage.getItem(sessionStartTimeKey);
            
            if (!sessionStartTime) {
                sessionStartTime = patient.createdAt || new Date().toISOString();
                localStorage.setItem(sessionStartTimeKey, sessionStartTime);
                console.log('🆕 تعيين وقت بدء الجلسة 1:', sessionStartTime);
            }
            
            const regDate = new Date(sessionStartTime);
            const now = new Date();
            const sessionInterval = parseInt(localStorage.getItem('sessionInterval')) || 24;
            const elapsed = (now - regDate) / (1000 * 60 * 60);
            const remaining = sessionInterval - elapsed;
            
            console.log('⏰ الوقت المنقضي:', elapsed.toFixed(2), 'ساعة');
            console.log('⏰ الوقت المتبقي:', remaining.toFixed(2), 'ساعة');
            
            // إذا انتهى الوقت، تفعيل المتابعة اليومية
            if (remaining <= 0) {
                console.log('✅ الوقت انتهى - تفعيل المتابعة اليومية');
                elegantCountdownDiv.style.display = 'none';
                
                if (dailyTrackingSection) {
                    dailyTrackingSection.style.display = 'block';
                }
                if (questionsContainer) {
                    questionsContainer.style.display = 'block';
                }
                if (behaviorsSection) {
                    behaviorsSection.style.display = 'block';
                }
                if (saveBtn) {
                    saveBtn.style.display = 'block';
                }
                if (messageDiv) {
                    messageDiv.textContent = '✅ يمكنك الآن إدخال بياناتك اليومية';
                    messageDiv.style.color = '#10b981';
                }
                return true;
            }
            
            // إظهار الساعة
            const updateCountdown = () => {
                const currentSessionStartTime = localStorage.getItem(sessionStartTimeKey);
                const currentRegDate = new Date(currentSessionStartTime);
                const currentNow = new Date();
                const currentElapsed = (currentNow - currentRegDate) / (1000 * 60 * 60);
                const currentRemaining = sessionInterval - currentElapsed;
                const h = Math.max(0, Math.floor(currentRemaining));
                const m = Math.max(0, Math.floor((currentRemaining - h) * 60));
                const s = Math.max(0, Math.floor(((currentRemaining - h) * 60 - m) * 60));
                
                elegantCountdownDiv.innerHTML = `
                    <div style="background: linear-gradient(135deg, #1e2633 0%, #2d3748 100%); padding: 30px; border-radius: 16px; text-align: center; border: 2px solid #d4af37; box-shadow: 0 8px 32px rgba(212, 175, 55, 0.2);">
                        <div style="color: #d4af37; font-size: 1.5em; margin-bottom: 20px; font-weight: bold;">
                            🕐 الوقت المتبقي للجلسة 1
                        </div>
                        <div style="display: flex; justify-content: center; gap: 20px; margin-bottom: 15px;">
                            <div style="background: #0a0e14; padding: 20px 30px; border-radius: 12px; min-width: 90px; border: 1px solid #d4af37;">
                                <div style="font-size: 3em; font-weight: bold; color: #fff;">${String(h).padStart(2, '0')}</div>
                                <div style="color: #9ca3af; font-size: 1.1em;">ساعة</div>
                            </div>
                            <div style="background: #0a0e14; padding: 20px 30px; border-radius: 12px; min-width: 90px; border: 1px solid #d4af37;">
                                <div style="font-size: 3em; font-weight: bold; color: #fff;">${String(m).padStart(2, '0')}</div>
                                <div style="color: #9ca3af; font-size: 1.1em;">دقيقة</div>
                            </div>
                            <div style="background: #0a0e14; padding: 20px 30px; border-radius: 12px; min-width: 90px; border: 1px solid #d4af37;">
                                <div style="font-size: 3em; font-weight: bold; color: #d4af37;">${String(s).padStart(2, '0')}</div>
                                <div style="color: #9ca3af; font-size: 1.1em;">ثانية</div>
                            </div>
                        </div>
                        <div style="color: #ffffff; font-size: 1.3em; margin-top: 20px; font-weight: bold;">
                            ⚠️ سيتم تفعيل المتابعة اليومية تلقائياً عند انتهاء الوقت
                        </div>
                        <div style="color: #9ca3af; font-size: 1.1em; margin-top: 10px;">
                            💡 يرجى الالتزام بالتمارين المنزلية الموضحة أدناه
                        </div>
                    </div>
                `;
                
                if (currentRemaining <= 0) {
                    clearInterval(countdownInterval);
                    elegantCountdownDiv.style.display = 'none';
                    
                    if (dailyTrackingSection) {
                        dailyTrackingSection.style.display = 'block';
                    }
                    if (questionsContainer) {
                        questionsContainer.style.display = 'block';
                    }
                    if (behaviorsSection) {
                        behaviorsSection.style.display = 'block';
                    }
                    if (saveBtn) {
                        saveBtn.style.display = 'block';
                    }
                    if (messageDiv) {
                        messageDiv.textContent = '✅ يمكنك الآن إدخال بياناتك اليومية';
                        messageDiv.style.color = '#10b981';
                    }
                }
            };
            
            updateCountdown();
            elegantCountdownDiv.style.display = 'block';
            const countdownInterval = setInterval(updateCountdown, 1000);
            return true;
        }
    }
    
    // التحقق من مرور وقت الجلسة المحفوظ منذ آخر سجل
    const lastLog = logs.length > 0 ? logs[logs.length - 1] : null;
    if (lastLog) {
        const lastLogDate = new Date(lastLog.date);
        const now = new Date();
        const hoursSinceLastLog = (now - lastLogDate) / (1000 * 60 * 60);
        
        // الحصول على وقت الجلسة المحفوظ (الافتراضي 24 ساعة)
        const sessionInterval = parseInt(localStorage.getItem('sessionInterval')) || 24;
        
        console.log('⏰ الساعات منذ آخر سجل:', hoursSinceLastLog);
        console.log('⏰ وقت الجلسة المحفوظ:', sessionInterval, 'ساعة');
        
        // حساب الجلسة الحالية
        const currentSession = logs.length + 1;
        
        // إعادة تعيين وقت بدء الجلسة لكل جلسة جديدة
        const sessionStartTimeKey = `sessionStartTime_${patient.patientId}_${currentSession}`;
        let sessionStartTime = localStorage.getItem(sessionStartTimeKey);
        
        // إذا لم يكن هناك وقت محفوظ أو كان من جلسة سابقة، قم بتعيين وقت جديد
        if (!sessionStartTime || logs.length === 0) {
            // جلسة جديدة أو اليوم الأول - تعيين وقت البدء
            sessionStartTime = new Date().toISOString();
            localStorage.setItem(sessionStartTimeKey, sessionStartTime);
            console.log('🆕 جلسة جديدة - تعيين وقت البدء:', sessionStartTime);
        }
        
        const sessionStartDate = new Date(sessionStartTime);
        const elapsedSinceSessionStart = (now - sessionStartDate) / (1000 * 60 * 60);
        
        console.log('⏰ الوقت المنقضي منذ بدء الجلسة:', elapsedSinceSessionStart);
        console.log('⏰ وقت الجلسة المطلوب:', sessionInterval);
        console.log('⏰ هل يجب إظهار الساعة؟', elapsedSinceSessionStart < sessionInterval);
        
        if (elapsedSinceSessionStart < sessionInterval) {
            // لم تمر وقت الجلسة بعد - إظهار الساعة
            const hoursRemaining = sessionInterval - elapsedSinceSessionStart;
            const hours = Math.floor(hoursRemaining);
            const minutes = Math.floor((hoursRemaining - hours) * 60);
            const seconds = Math.floor(((hoursRemaining - hours) * 60 - minutes) * 60);
            
            // عرض التمارين اليومية المتجددة قبل إخفاء قسم المتابعة
            const assessments = await SmartCheckDB.getPatientAssessments(patient.patientId);
            const lastAssessment = assessments.length > 0 ? assessments[assessments.length - 1] : null;
            const painArea = lastAssessment ? lastAssessment.painArea : null;
            const diagnoses = lastAssessment ? (lastAssessment.diagnoses || lastAssessment.diagnosis || []) : [];
            const symptoms = lastAssessment ? (lastAssessment.symptoms || []) : [];
            const sessionNumber = logs.length + 1;
            
            // تحديد مرحلة التعافي بناءً على السجلات السابقة
            let recoveryStage = 'beginner';
            // فقط من الجلسة 4 فصاعداً يتم حساب recoveryStage ديناميكياً
            if (logs.length >= 3) {
                const recentLogs = logs.slice(-3);
                const avgPain = recentLogs.reduce((sum, log) => sum + (log.painScore || 0), 0) / recentLogs.length;
                if (avgPain < 3) recoveryStage = 'advanced';
                else if (avgPain < 5) recoveryStage = 'intermediate';
            }
            // في الجلسات 1-3، recoveryStage يظل 'beginner'
            
            // في اليوم الأول، لا تظهر التمارين اليومية - المريض يطبق التمارين المنزلية
            if (logs.length > 0) {
                const dailyExercises = await generateDailyExercises(sessionNumber, painArea, diagnoses, symptoms, recoveryStage);
                const exercisesHtml = displayDailyExercises(dailyExercises);
                
                // إضافة التمارين اليومية قبل قسم المتابعة اليومية
                if (dailyTrackingSection) {
                    const oldDailyExercises = document.getElementById('daily-exercises-container');
                    if (oldDailyExercises) oldDailyExercises.remove();
                    
                    const exercisesContainer = document.createElement('div');
                    exercisesContainer.id = 'daily-exercises-container';
                    exercisesContainer.innerHTML = exercisesHtml;
                    dailyTrackingSection.insertBefore(exercisesContainer, dailyTrackingSection.firstChild);
                    
                    // إظهار قسم المتابعة اليومية فقط لعرض التمارين
                    dailyTrackingSection.style.display = 'block';
                }
            }
            
            // إخفاء نموذج الأسئلة فقط
            if (questionsContainer) {
                questionsContainer.style.display = 'none';
            }

            // إظهار قسم السلوكيات دائماً
            if (behaviorsSection) {
                behaviorsSection.style.display = 'block';
            }
            
            if (messageDiv) {
                messageDiv.innerHTML = `⏰ يجب الانتظار قبل الإدخال التالي`;
                messageDiv.style.color = '#f59e0b';
            }
            
            // إظهار الساعة الأنيقة للجلسة الحالية
            if (elegantCountdownDiv) {
                console.log('🕐 جاري إظهار الساعة الأنيقة للجلسة:', currentSession);
                // الانتقال التلقائي للساعة لتنبيه المستخدم
                elegantCountdownDiv.scrollIntoView({ behavior: 'smooth', block: 'center' });
                const updateCountdown = async () => {
                    const now = new Date();
                    const elapsed = (now - sessionStartDate) / (1000 * 60 * 60);
                    const remaining = sessionInterval - elapsed;
                    const h = Math.floor(remaining);
                    const m = Math.floor((remaining - h) * 60);
                    const s = Math.floor(((remaining - h) * 60 - m) * 60);
                    
                    elegantCountdownDiv.innerHTML = `
                        <div style="background: linear-gradient(135deg, #1e2633 0%, #2d3748 100%); padding: 30px; border-radius: 16px; text-align: center; border: 2px solid #d4af37; box-shadow: 0 8px 32px rgba(212, 175, 55, 0.2);">
                            <div style="color: #d4af37; font-size: 1.5em; margin-bottom: 20px; font-weight: bold;">
                                🕐 الوقت المتبقي للجلسة ${currentSession}
                            </div>
                            <div style="display: flex; justify-content: center; gap: 20px; margin-bottom: 15px;">
                                <div style="background: #0a0e14; padding: 20px 30px; border-radius: 12px; min-width: 90px; border: 1px solid #d4af37;">
                                    <div style="font-size: 3em; font-weight: bold; color: #fff;">${String(h).padStart(2, '0')}</div>
                                    <div style="color: #9ca3af; font-size: 1.1em;">ساعة</div>
                                </div>
                                <div style="background: #0a0e14; padding: 20px 30px; border-radius: 12px; min-width: 90px; border: 1px solid #d4af37;">
                                    <div style="font-size: 3em; font-weight: bold; color: #fff;">${String(m).padStart(2, '0')}</div>
                                    <div style="color: #9ca3af; font-size: 1.1em;">دقيقة</div>
                                </div>
                                <div style="background: #0a0e14; padding: 20px 30px; border-radius: 12px; min-width: 90px; border: 1px solid #d4af37;">
                                    <div style="font-size: 3em; font-weight: bold; color: #d4af37;">${String(s).padStart(2, '0')}</div>
                                    <div style="color: #9ca3af; font-size: 1.1em;">ثانية</div>
                                </div>
                            </div>
                            <div style="color: #ffffff; font-size: 1.3em; margin-top: 20px; font-weight: bold; display: flex; align-items: center; justify-content: center; gap: 10px;">
                                ⚠️ سيتم تفعيل المتابعة اليومية تلقائياً عند انتهاء الوقت
                            </div>
                            <div style="color: #9ca3af; font-size: 1.1em; margin-top: 10px;">
                                💡 يرجى الالتزام بالتمارين اليومية الموضحة أدناه
                            </div>
                        </div>
                    `;
                    
                    // التحقق من انتهاء الوقت وتفعيل المتابعة اليومية تلقائياً
                    if (remaining <= 0) {
                        clearInterval(countdownInterval);
                        elegantCountdownDiv.style.display = 'none';
                        
                        // تفعيل المتابعة اليومية تلقائياً
                        if (dailyTrackingSection) {
                            dailyTrackingSection.style.display = 'block';
                        }
                        
                        // إظهار الأسئلة السلوكية للتقييم بدلاً من نموذج الأسئلة العادية
                        const behavioralAssessmentSection = document.getElementById('behavioral-assessment-section');
                        if (behavioralAssessmentSection) {
                            // تحديث رقم الجلسة
                            const sessionNumberSpan = document.getElementById('assessment-session-number');
                            if (sessionNumberSpan) {
                                sessionNumberSpan.textContent = currentSession;
                            }
                            behavioralAssessmentSection.style.display = 'block';
                        }
                        
                        // إخفاء نموذج الأسئلة العادية والسلوكيات اليومية
                        if (questionsContainer) {
                            questionsContainer.style.display = 'none';
                        }
                        if (behaviorsSection) {
                            behaviorsSection.style.display = 'none';
                        }
                        if (saveBtn) saveBtn.style.display = 'none';
                        if (messageDiv) {
                            messageDiv.textContent = '📋 يرجى الإجابة على أسئلة التقييم للمتابعة للجلسة التالية';
                            messageDiv.style.color = '#f59e0b';
                        }
                        
                        // التمارين اليومية ستظهر بعد الإجابة السلوكية
                    }
                };
                
                updateCountdown();
                elegantCountdownDiv.style.display = 'block';
                const countdownInterval = setInterval(updateCountdown, 1000);
                return true;
            }
        }
    }
    
    // يمكن الإدخال
    if (messageDiv) {
        messageDiv.textContent = '✅ يمكنك إدخال بياناتك اليومية';
        messageDiv.style.color = '#10b981';
    }
    
    if (countdownDiv) {
        countdownDiv.style.display = 'none';
    }
    
    if (elegantCountdownDiv) {
        elegantCountdownDiv.style.display = 'none';
    }
    
    if (questionsContainer) {
        questionsContainer.style.display = 'block';
        questionsContainer.style.opacity = '1';
        questionsContainer.style.pointerEvents = 'auto';
        const inputs = questionsContainer.querySelectorAll('input, select, textarea, button');
        inputs.forEach(input => {
            input.disabled = false;
        });
    }

    if (behaviorsSection) {
        behaviorsSection.style.display = 'block';
    }

    if (saveBtn) saveBtn.style.display = 'block';
    
    // عرض التمارين اليومية المتجددة
    if (patient) {
        const assessments = await SmartCheckDB.getPatientAssessments(patient.patientId);
        const lastAssessment = assessments.length > 0 ? assessments[assessments.length - 1] : null;
        const painArea = lastAssessment ? lastAssessment.painArea : null;
        const diagnoses = lastAssessment ? (lastAssessment.diagnoses || lastAssessment.diagnosis || []) : [];
        const symptoms = lastAssessment ? (lastAssessment.symptoms || []) : [];
        const sessionNumber = logs.length + 1;
        
        // تحديد مرحلة التعافي بناءً على السجلات السابقة
        let recoveryStage = 'beginner';
        // فقط من الجلسة 4 فصاعداً يتم حساب recoveryStage ديناميكياً
        if (logs.length >= 3) {
            const recentLogs = logs.slice(-3);
            const avgPain = recentLogs.reduce((sum, log) => sum + (log.painScore || 0), 0) / recentLogs.length;
            if (avgPain < 3) recoveryStage = 'advanced';
            else if (avgPain < 5) recoveryStage = 'intermediate';
        }
        // في الجلسات 1-3، recoveryStage يظل 'beginner'
        
        // في اليوم الأول، لا تظهر التمارين اليومية - المريض يطبق التمارين المنزلية
        if (logs.length > 0) {
            const dailyExercises = await generateDailyExercises(sessionNumber, painArea, diagnoses, symptoms, recoveryStage);
            const exercisesHtml = displayDailyExercises(dailyExercises);
            
            // إضافة التمارين اليومية قبل قسم المتابعة اليومية
            const dailyTrackingSection = document.getElementById('daily-tracking-section');
            if (dailyTrackingSection) {
                const oldDailyExercises = document.getElementById('daily-exercises-container');
                if (oldDailyExercises) oldDailyExercises.remove();
                
                const exercisesContainer = document.createElement('div');
                exercisesContainer.id = 'daily-exercises-container';
                exercisesContainer.innerHTML = exercisesHtml;
                dailyTrackingSection.insertBefore(exercisesContainer, dailyTrackingSection.firstChild);
            }
        }
    }
    
    return true;
}

// دالة عرض التوصيات الذكية
function displaySmartRecommendations(recommendations) {
    const container = document.getElementById('smart-recommendations');
    if (!container) {
        // إنشاء الحاوية إذا لم تكن موجودة
        const dailyTrackingSection = document.getElementById('daily-tracking-section');
        if (dailyTrackingSection) {
            const newContainer = document.createElement('div');
            newContainer.id = 'smart-recommendations';
            newContainer.className = 'report-block';
            newContainer.style.marginTop = '20px';
            dailyTrackingSection.appendChild(newContainer);
        }
    }
    
    if (!recommendations || recommendations.length === 0) return;
    
    let html = '<h4>💡 توصيات ذكية لك اليوم</h4>';
    
    recommendations.forEach(rec => {
        let bgColor = '#1e2633';
        let borderColor = '#374151';
        
        if (rec.type === 'warning') {
            bgColor = '#2d1f1f';
            borderColor = '#7f1d1d';
        } else if (rec.type === 'success') {
            bgColor = '#1f2d1f';
            borderColor = '#1f7f1d';
        } else if (rec.type === 'caution') {
            bgColor = '#2d2d1f';
            borderColor = '#7f7f1d';
        } else if (rec.type === 'tip') {
            bgColor = '#1f2d2d';
            borderColor = '#1d7f7f';
        }
        
        html += `
            <div style="background: ${bgColor}; padding: 15px; border-radius: 8px; border-right: 3px solid ${borderColor}; margin-bottom: 10px;">
                <h5 style="margin: 0 0 8px 0; color: #e5e7eb;">${rec.title}</h5>
                <p style="margin: 0; color: #9ca3af; font-size: 0.9em;">${rec.message}</p>
            </div>
        `;
    });
    
    const containerElement = document.getElementById('smart-recommendations');
    if (containerElement) {
        containerElement.innerHTML = html;
        containerElement.style.display = 'block';
    }
}

// دالة عرض الكروت الترويجية بين الجلسات
function displayPromotionalCards(sessionNumber) {
    const promotionalSection = document.getElementById('promotional-cards-section');
    const cardsContainer = document.getElementById('promotional-cards');
    
    if (!promotionalSection || !cardsContainer) return;

    // كروت ترويجية متنوعة
    const promotionalCards = [
        {
            title: '🏥 خدمة العلاج المنزلي',
            message: 'المعالج متخصص بالكايروبراكتيك وجاهز لمساعدتك في أي وقت. يتوفر خدمة العلاج المنزلي داخل عمان والزرقاء.',
            action: 'احجز استشارة مجانية',
            link: 'https://wa.me/962790360440',
            color: '#10b981'
        },
        {
            title: '💪 نصائح للتعافي السريع',
            message: 'الالتزام بالتمارين اليومية والسلوكيات الإيجابية هو مفتاح التعافي السريع. استمر في المحاولة!',
            action: '',
            link: '',
            color: '#3b82f6'
        },
        {
            title: '🎯 أهمية الاستمرارية',
            message: 'الاستمرارية في العلاج أهم من شدة التمارين. لا تتخطى أي جلسة للحفاظ على تقدمك.',
            action: '',
            link: '',
            color: '#f59e0b'
        },
        {
            title: '😊 العقلية الإيجابية',
            message: 'العقلية الإيجابية تساعد في التعافي. ثق بنفسك وبقدرة جسمك على الشفاء.',
            action: '',
            link: '',
            color: '#8b5cf6'
        }
    ];

    // اختيار كروت عشوائية بناءً على رقم الجلسة
    const selectedCards = [];
    const startIndex = (sessionNumber - 1) % promotionalCards.length;
    for (let i = 0; i < 2; i++) {
        const index = (startIndex + i) % promotionalCards.length;
        selectedCards.push(promotionalCards[index]);
    }

    let html = '';
    selectedCards.forEach(card => {
        html += `
            <div style="background: linear-gradient(135deg, #1e2633 0%, #2d3748 100%); padding: 20px; border-radius: 12px; border: 2px solid ${card.color}; margin-bottom: 15px;">
                <h5 style="color: ${card.color}; margin: 0 0 10px 0; font-size: 1.2em;">${card.title}</h5>
                <p style="color: #e5e7eb; margin: 0 0 15px 0; font-size: 0.95em; line-height: 1.6;">${card.message}</p>
                ${card.action ? `
                    <a href="${card.link}" target="_blank" style="display: inline-block; background: ${card.color}; color: white; padding: 10px 25px; border-radius: 8px; text-decoration: none; font-weight: bold; font-size: 0.95em;">${card.action}</a>
                ` : ''}
            </div>
        `;
    });

    cardsContainer.innerHTML = html;
    promotionalSection.style.display = 'block';
    console.log('✅ تم عرض الكروت الترويجية للجلسة:', sessionNumber);
}

// دالة حفظ التقييم السلوكي بين الجلسات
async function saveBehavioralAssessment() {
    const patient = await SmartCheckDB.getCurrentPatient();
    if (!patient) {
        showCustomAlert('❌ يجب تسجيل الدخول أولاً', 'error');
        return;
    }

    // جمع البيانات من نموذج التقييم
    const painScore = parseInt(document.getElementById('assessment-pain-score').value);
    const exerciseCompliance = parseInt(document.getElementById('assessment-exercise-compliance').value);
    const notes = document.getElementById('assessment-notes').value;

    // السلوكيات الإيجابية
    const positiveBehaviors = {
        goodPosture: document.getElementById('assessment-good-posture').checked,
        restEnough: document.getElementById('assessment-rest-enough').checked,
        stretching: document.getElementById('assessment-stretching').checked,
        heatTherapy: document.getElementById('assessment-heat-therapy').checked
    };

    // السلوكيات السلبية
    const negativeBehaviors = {
        longSitting: document.getElementById('assessment-long-sitting').checked,
        heavyLifting: document.getElementById('assessment-heavy-lifting').checked,
        phoneUsage: document.getElementById('assessment-phone-usage').checked,
        poorSleep: document.getElementById('assessment-poor-sleep').checked
    };

    // حساب عدد السلوكيات الإيجابية والسلبية
    const positiveCount = Object.values(positiveBehaviors).filter(v => v).length;
    const negativeCount = Object.values(negativeBehaviors).filter(v => v).length;

    // حفظ التقييم في السجل اليومي
    const existingLogs = await SmartCheckDB.getPatientDailyLogs(patient.patientId);
    const sessionNumber = existingLogs.length + 1;

    const assessmentData = {
        sessionNumber: sessionNumber,
        painScore: painScore,
        exerciseCompliance: exerciseCompliance,
        positiveBehaviors: positiveBehaviors,
        negativeBehaviors: negativeBehaviors,
        positiveCount: positiveCount,
        negativeCount: negativeCount,
        notes: notes,
        date: new Date().toISOString(),
        type: 'behavioral-assessment'
    };

    // حفظ التقييم
    await SmartCheckDB.saveDailyLog(patient.patientId, assessmentData);
    console.log('✅ تم حفظ التقييم السلوكي:', assessmentData);

    // إخفاء قسم التقييم
    document.getElementById('behavioral-assessment-section').style.display = 'none';

    // عرض العبارات التشجيعية والتنبيهات
    displayEncouragementMessages(assessmentData);

    // عرض الكروت الترويجية
    displayPromotionalCards(sessionNumber);

    // بدء الجلسة التالية
    await startNextSession(patient.patientId, sessionNumber + 1, assessmentData);

    showCustomAlert('✅ تم حفظ التقييم بنجاح! تم تفعيل الجلسة التالية', 'success');
}

// دالة عرض العبارات التشجيعية والتنبيهات
function displayEncouragementMessages(assessmentData) {
    const encouragementSection = document.getElementById('encouragement-section');
    const messagesContainer = document.getElementById('encouragement-messages');
    
    if (!encouragementSection || !messagesContainer) return;

    let messages = [];

    // عبارات تشجيعية بناءً على مستوى الألم
    if (assessmentData.painScore <= 2) {
        messages.push({
            type: 'success',
            title: '🌟 أداء رائع!',
            message: 'مستوى الألم منخفض جداً! استمر في هذا التقدم الممتاز.'
        });
    } else if (assessmentData.painScore <= 5) {
        messages.push({
            type: 'success',
            title: '👍 تقدم جيد!',
            message: 'مستوى الألم متوسط. حافظ على الالتزام بالتمارين والسلوكيات الإيجابية.'
        });
    } else {
        messages.push({
            type: 'caution',
            title: '💪 لا تستسلم!',
            message: 'مستوى الألم مرتفع. كل خطوة مهمة، استمر في المحاولة.'
        });
    }

    // عبارات تشجيعية بناءً على الالتزام بالتمارين
    if (assessmentData.exerciseCompliance >= 4) {
        messages.push({
            type: 'success',
            title: '💪 التزام ممتاز!',
            message: 'أنت تلتزم بالتمارين بشكل رائع. هذا هو مفتاح التعافي السريع.'
        });
    } else if (assessmentData.exerciseCompliance >= 2) {
        messages.push({
            type: 'tip',
            title: '📈 حاول زيادة الالتزام',
            message: 'التزامك بالتمارين جيد، لكن يمكن تحسينه. كل تمرين مهم.'
        });
    } else {
        messages.push({
            type: 'warning',
            title: '⚠️ الالتزام منخفض',
            message: 'حاول زيادة الالتزام بالتمارين. التمارين ضرورية للتعافي.'
        });
    }

    // تنبيهات للسلوكيات السلبية
    if (assessmentData.negativeCount > 0) {
        let negativeBehaviorsList = [];
        if (assessmentData.negativeBehaviors.longSitting) negativeBehaviorsList.push('جلسة طويلة');
        if (assessmentData.negativeBehaviors.heavyLifting) negativeBehaviorsList.push('جهد بدني');
        if (assessmentData.negativeBehaviors.phoneUsage) negativeBehaviorsList.push('استخدام موبايل طويل');
        if (assessmentData.negativeBehaviors.poorSleep) negativeBehaviorsList.push('نوم سيء');

        messages.push({
            type: 'warning',
            title: '⚠️ انتبه لهذه السلوكيات',
            message: `حاول تجنب: ${negativeBehaviorsList.join('، ')}. هذه السلوكيات قد تؤخر التعافي.`
        });
    }

    // تشجيع للسلوكيات الإيجابية
    if (assessmentData.positiveCount > 0) {
        let positiveBehaviorsList = [];
        if (assessmentData.positiveBehaviors.goodPosture) positiveBehaviorsList.push('وضعية جيدة');
        if (assessmentData.positiveBehaviors.restEnough) positiveBehaviorsList.push('راحة كافية');
        if (assessmentData.positiveBehaviors.stretching) positiveBehaviorsList.push('تمارين إطالة');
        if (assessmentData.positiveBehaviors.heatTherapy) positiveBehaviorsList.push('علاج حراري');

        messages.push({
            type: 'success',
            title: '🎉 سلوكيات إيجابية رائعة',
            message: `أحسنت! قمت بـ: ${positiveBehaviorsList.join('، ')}. استمر في هذا الالتزام.`
        });
    }

    // عرض الرسائل
    let html = '';
    messages.forEach(msg => {
        let bgColor = '#1e2633';
        let borderColor = '#374151';
        
        if (msg.type === 'success') {
            bgColor = '#1f2d1f';
            borderColor = '#1f7f1d';
        } else if (msg.type === 'warning') {
            bgColor = '#2d1f1f';
            borderColor = '#7f1d1d';
        } else if (msg.type === 'caution') {
            bgColor = '#2d2d1f';
            borderColor = '#7f7f1d';
        } else if (msg.type === 'tip') {
            bgColor = '#1f2d2d';
            borderColor = '#1d7f7f';
        }
        
        html += `
            <div style="background: ${bgColor}; padding: 15px; border-radius: 8px; border-right: 3px solid ${borderColor}; margin-bottom: 10px;">
                <h5 style="margin: 0 0 8px 0; color: #e5e7eb;">${msg.title}</h5>
                <p style="margin: 0; color: #9ca3af; font-size: 0.9em;">${msg.message}</p>
            </div>
        `;
    });

    messagesContainer.innerHTML = html;
    encouragementSection.style.display = 'block';
}

// دالة بدء الجلسة التالية
async function startNextSession(patientId, nextSessionNumber, assessmentData) {
    // تعيين وقت بدء الجلسة الجديدة
    const sessionStartTimeKey = `sessionStartTime_${patientId}_${nextSessionNumber}`;
    const sessionStartTime = new Date().toISOString();
    localStorage.setItem(sessionStartTimeKey, sessionStartTime);
    console.log('🆕 بدء الجلسة', nextSessionNumber, ':', sessionStartTime);

    // إخفاء قسم العبارات التشجيعية بعد فترة قصيرة
    setTimeout(() => {
        const encouragementSection = document.getElementById('encouragement-section');
        if (encouragementSection) encouragementSection.style.display = 'none';
    }, 5000);

    // إظهار الساعة للجلسة الجديدة
    const elegantCountdownDiv = document.getElementById('elegant-countdown');
    if (elegantCountdownDiv) {
        elegantCountdownDiv.style.display = 'block';
    }

    // توليد التمارين اليومية بناءً على التقييم السلوكي
    await generateAndDisplayExercisesBasedOnAssessment(patientId, nextSessionNumber, assessmentData);
}

// دالة توليد التمارين بناءً على التقييم السلوكي
async function generateAndDisplayExercisesBasedOnAssessment(patientId, sessionNumber, assessmentData) {
    const assessments = await SmartCheckDB.getPatientAssessments(patientId);
    const lastAssessment = assessments.length > 0 ? assessments[assessments.length - 1] : null;
    const painArea = lastAssessment ? lastAssessment.painArea : null;
    const diagnoses = lastAssessment ? (lastAssessment.diagnoses || lastAssessment.diagnosis || []) : [];
    const symptoms = lastAssessment ? (lastAssessment.symptoms || []) : [];

    // تحديد مرحلة التعافي بناءً على التقييم السلوكي
    let recoveryStage = 'beginner';
    if (assessmentData.painScore <= 2 && assessmentData.exerciseCompliance >= 4) {
        recoveryStage = 'advanced';
    } else if (assessmentData.painScore <= 5 && assessmentData.exerciseCompliance >= 3) {
        recoveryStage = 'intermediate';
    }

    // توليد التمارين بناءً على التقييم
    const dailyExercises = await generateDailyExercises(sessionNumber, painArea, diagnoses, symptoms, recoveryStage);
    const exercisesHtml = displayDailyExercises(dailyExercises);

    // إضافة التمارين اليومية
    const dailyTrackingSection = document.getElementById('daily-tracking-section');
    if (dailyTrackingSection) {
        const oldDailyExercises = document.getElementById('daily-exercises-container');
        if (oldDailyExercises) oldDailyExercises.remove();
        
        const exercisesContainer = document.createElement('div');
        exercisesContainer.id = 'daily-exercises-container';
        exercisesContainer.innerHTML = exercisesHtml;
        dailyTrackingSection.insertBefore(exercisesContainer, dailyTrackingSection.firstChild);
    }

    console.log('✅ تم توليد التمارين للجلسة', sessionNumber, 'بناءً على التقييم:', recoveryStage);
}

// دالة عرض التمارين المتقدمة
function displayProgressiveExercises(exercises) {
    const container = document.getElementById('progressive-exercises');
    if (!container) {
        // إنشاء الحاوية إذا لم تكن موجودة
        const dailyTrackingSection = document.getElementById('daily-tracking-section');
        if (dailyTrackingSection) {
            const newContainer = document.createElement('div');
            newContainer.id = 'progressive-exercises';
            newContainer.className = 'report-block';
            newContainer.style.marginTop = '20px';
            dailyTrackingSection.appendChild(newContainer);
        }
    }
    
    if (!exercises || exercises.length === 0) return;
    
    let html = '<h4>🏋️ تمارين متقدمة لك اليوم</h4>';
    html += '<p style="color: #10b981; font-size: 0.9em; margin-bottom: 15px;">✨ تمارين مخصصة بناءً على تقدمك الحالي</p>';
    
    exercises.forEach((exercise, index) => {
        html += `
            <div style="background: #1e2633; padding: 15px; border-radius: 8px; margin-bottom: 10px; border-right: 3px solid var(--primary-gold);">
                <h5 style="margin: 0 0 8px 0; color: var(--primary-gold);">${index + 1}. ${exercise.name}</h5>
                <p style="margin: 0 0 8px 0; color: #9ca3af; font-size: 0.9em;">${exercise.description}</p>
                <div style="display: flex; gap: 15px; color: #6b7280; font-size: 0.85em;">
                    <span>⏱️ ${exercise.duration}</span>
                    <span>🔄 ${exercise.reps} تكرارات</span>
                </div>
            </div>
        `;
    });
    
    const containerElement = document.getElementById('progressive-exercises');
    if (containerElement) {
        containerElement.innerHTML = html;
        containerElement.style.display = 'block';
    }
}

// دالة عرض مقارنة الأسابيع
async function displayWeekComparison() {
    const patient = await SmartCheckDB.getCurrentPatient();
    if (!patient) return;
    
    const allLogs = await SmartCheckDB.getPatientDailyLogs(patient.patientId);
    if (allLogs.length < 7) return; // نحتاج على الأقل أسبوعين للمقارنة
    
    const today = new Date();
    const oneWeekAgo = new Date(today.getTime() - 7 * 24 * 60 * 60 * 1000);
    const twoWeeksAgo = new Date(today.getTime() - 14 * 24 * 60 * 60 * 1000);
    
    const currentWeekLogs = allLogs.filter(log => new Date(log.date) >= oneWeekAgo);
    const previousWeekLogs = allLogs.filter(log => {
        const logDate = new Date(log.date);
        return logDate >= twoWeeksAgo && logDate < oneWeekAgo;
    });
    
    if (currentWeekLogs.length === 0 || previousWeekLogs.length === 0) return;
    
    const comparison = compareWeeks(currentWeekLogs, previousWeekLogs);
    
    const container = document.getElementById('week-comparison');
    if (!container) {
        const dailyTrackingSection = document.getElementById('daily-tracking-section');
        if (dailyTrackingSection) {
            const newContainer = document.createElement('div');
            newContainer.id = 'week-comparison';
            newContainer.className = 'report-block';
            newContainer.style.marginTop = '20px';
            dailyTrackingSection.appendChild(newContainer);
        }
    }
    
    let html = '<h4>📊 مقارنة الأسبوع الحالي بالأسبوع السابق</h4>';
    
    html += `
        <div style="background: #1e2633; padding: 20px; border-radius: 8px;">
            <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 20px;">
                <div>
                    <h5 style="color: #10b981; margin-bottom: 10px;">الأسبوع الحالي</h5>
                    <p style="color: #9ca3af; font-size: 0.9em;">متوسط الألم: ${comparison.currentWeek.avgPain.toFixed(1)}</p>
                    <p style="color: #9ca3af; font-size: 0.9em;">متوسط الحركة: ${comparison.currentWeek.avgMovement.toFixed(1)}</p>
                    <p style="color: #9ca3af; font-size: 0.9em;">متوسط النوم: ${comparison.currentWeek.avgSleep.toFixed(1)}</p>
                    <p style="color: #9ca3af; font-size: 0.9em;">الالتزام بالتمارين: ${comparison.currentWeek.exerciseCompliance.toFixed(0)}%</p>
                </div>
                <div>
                    <h5 style="color: #f59e0b; margin-bottom: 10px;">الأسبوع السابق</h5>
                    <p style="color: #9ca3af; font-size: 0.9em;">متوسط الألم: ${comparison.previousWeek.avgPain.toFixed(1)}</p>
                    <p style="color: #9ca3af; font-size: 0.9em;">متوسط الحركة: ${comparison.previousWeek.avgMovement.toFixed(1)}</p>
                    <p style="color: #9ca3af; font-size: 0.9em;">متوسط النوم: ${comparison.previousWeek.avgSleep.toFixed(1)}</p>
                    <p style="color: #9ca3af; font-size: 0.9em;">الالتزام بالتمارين: ${comparison.previousWeek.exerciseCompliance.toFixed(0)}%</p>
                </div>
            </div>
            <div style="margin-top: 15px; padding-top: 15px; border-top: 1px solid #374151;">
                <h5 style="color: var(--primary-gold); margin-bottom: 10px;">نسبة التحسن</h5>
                <p style="color: ${comparison.improvement.pain >= 0 ? '#10b981' : '#ef4444'}; font-size: 0.9em;">
                    الألم: ${comparison.improvement.pain >= 0 ? '+' : ''}${comparison.improvement.pain.toFixed(0)}%
                </p>
                <p style="color: ${comparison.improvement.movement >= 0 ? '#10b981' : '#ef4444'}; font-size: 0.9em;">
                    الحركة: ${comparison.improvement.movement >= 0 ? '+' : ''}${comparison.improvement.movement.toFixed(0)}%
                </p>
                <p style="color: ${comparison.improvement.sleep >= 0 ? '#10b981' : '#ef4444'}; font-size: 0.9em;">
                    النوم: ${comparison.improvement.sleep >= 0 ? '+' : ''}${comparison.improvement.sleep.toFixed(0)}%
                </p>
                <p style="color: ${comparison.improvement.exerciseCompliance >= 0 ? '#10b981' : '#ef4444'}; font-size: 0.9em;">
                    الالتزام: ${comparison.improvement.exerciseCompliance >= 0 ? '+' : ''}${comparison.improvement.exerciseCompliance.toFixed(0)}%
                </p>
            </div>
        </div>
    `;
    
    const containerElement = document.getElementById('week-comparison');
    if (containerElement) {
        containerElement.innerHTML = html;
        containerElement.style.display = 'block';
    }
}

// ============================================
// نظام تذكير بالتمارين (إشعارات المتصفح)
// ============================================

// طلب إذن الإشعارات
async function requestNotificationPermission() {
    if (!('Notification' in window)) {
        showCustomAlert('⚠️ متصفحك لا يدعم الإشعارات', 'warning');
        return false;
    }
    
    if (Notification.permission === 'granted') {
        return true;
    }
    
    if (Notification.permission !== 'denied') {
        const permission = await Notification.requestPermission();
        return permission === 'granted';
    }
    
    return false;
}

// إرسال إشعار تذكير
function sendExerciseReminder() {
    if (Notification.permission === 'granted') {
        const notification = new Notification('🏋️ تذكير بالتمارين', {
            body: 'حان وقت التمارين! لا تنسى أداء تمارينك اليومية لتحسين تعافيك.',
            icon: 'data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"><text y=".9em" font-size="90">💪</text></svg>',
            badge: 'data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"><text y=".9em" font-size="90">💪</text></svg>',
            tag: 'exercise-reminder',
            requireInteraction: true
        });
        
        notification.onclick = function() {
            window.focus();
            notification.close();
        };
    }
}

// حفظ وقت التذكير
function saveReminderTime(hour, minute) {
    localStorage.setItem('exerciseReminderHour', hour);
    localStorage.setItem('exerciseReminderMinute', minute);
    localStorage.setItem('exerciseReminderEnabled', 'true');
}

// الحصول على وقت التذكير المحفوظ
function getReminderTime() {
    const hour = localStorage.getItem('exerciseReminderHour');
    const minute = localStorage.getItem('exerciseReminderMinute');
    const enabled = localStorage.getItem('exerciseReminderEnabled') === 'true';
    
    if (hour && minute && enabled) {
        return { hour: parseInt(hour), minute: parseInt(minute), enabled };
    }
    
    return null;
}

// التحقق من وقت التذكير
function checkReminderTime() {
    const reminderTime = getReminderTime();
    if (!reminderTime || !reminderTime.enabled) return;
    
    const now = new Date();
    const currentHour = now.getHours();
    const currentMinute = now.getMinutes();
    
    // التحقق من أننا في نفس الدقيقة
    if (currentHour === reminderTime.hour && currentMinute === reminderTime.minute) {
        const lastReminder = localStorage.getItem('lastReminderTime');
        const nowTime = now.getTime();
        
        // إرسال الإشعار فقط إذا لم يتم إرساله في هذه الدقيقة
        if (!lastReminder || nowTime - parseInt(lastReminder) > 60000) {
            sendExerciseReminder();
            localStorage.setItem('lastReminderTime', nowTime.toString());
        }
    }
}

// إيقاف التذكير
function disableReminder() {
    localStorage.setItem('exerciseReminderEnabled', 'false');
}

// واجهة إعداد التذكير
function showReminderSettings() {
    const reminderTime = getReminderTime();
    const defaultHour = reminderTime ? reminderTime.hour : 9;
    const defaultMinute = reminderTime ? reminderTime.minute : 0;
    const enabled = reminderTime ? reminderTime.enabled : false;
    
    const html = `
        <div id="reminder-settings-modal" style="display: none; position: fixed; top: 0; left: 0; width: 100%; height: 100%; background: rgba(0, 0, 0, 0.8); z-index: 1000; align-items: center; justify-content: center;">
            <div class="modal-content" style="background: #0a0e14; padding: 30px; border-radius: 16px; max-width: 400px; width: 90%; border: 2px solid var(--primary-gold);">
                <h2 style="color: var(--primary-gold); margin: 0 0 20px 0;">⏰ إعداد تذكير التمارين</h2>
                
                <div style="margin-bottom: 20px;">
                    <label class="form-label">تفعيل التذكير</label>
                    <input type="checkbox" id="reminder-enabled" ${enabled ? 'checked' : ''} style="width: 20px; height: 20px;">
                </div>
                
                <div style="margin-bottom: 20px;">
                    <label class="form-label">وقت التذكير</label>
                    <div style="display: flex; gap: 10px;">
                        <select id="reminder-hour" class="input-control" style="flex: 1;">
                            ${Array.from({length: 24}, (_, i) => `<option value="${i}" ${i === defaultHour ? 'selected' : ''}>${i.toString().padStart(2, '0')}:00</option>`).join('')}
                        </select>
                        <select id="reminder-minute" class="input-control" style="flex: 1;">
                            ${Array.from({length: 60}, (_, i) => `<option value="${i}" ${i === defaultMinute ? 'selected' : ''}>${i.toString().padStart(2, '0')}</option>`).join('')}
                        </select>
                    </div>
                </div>
                
                <div style="display: flex; gap: 10px;">
                    <button id="save-reminder-btn" class="btn-submit" style="flex: 1;">💾 حفظ</button>
                    <button id="close-reminder-btn" class="btn-submit" style="background: #6b7280; flex: 1;">إغلاق</button>
                </div>
            </div>
        </div>
    `;
    
    // إضافة النافذة إذا لم تكن موجودة
    if (!document.getElementById('reminder-settings-modal')) {
        document.body.insertAdjacentHTML('beforeend', html);
    } else {
        document.getElementById('reminder-settings-modal').outerHTML = html;
    }
    
    // إظهار النافذة
    document.getElementById('reminder-settings-modal').style.display = 'flex';
    
    // ربط الأحداث
    document.getElementById('save-reminder-btn').onclick = async function() {
        const enabled = document.getElementById('reminder-enabled').checked;
        const hour = parseInt(document.getElementById('reminder-hour').value);
        const minute = parseInt(document.getElementById('reminder-minute').value);
        
        if (enabled) {
            const hasPermission = await requestNotificationPermission();
            if (hasPermission) {
                saveReminderTime(hour, minute);
                showCustomAlert('✅ تم حفظ إعدادات التذكير بنجاح', 'success');
            } else {
                showCustomAlert('⚠️ يرجى السماح بالإشعارات لتفعيل التذكير', 'warning');
            }
        } else {
            disableReminder();
            showCustomAlert('✅ تم إيقاف التذكير', 'success');
        }
        
        document.getElementById('reminder-settings-modal').style.display = 'none';
    };
    
    document.getElementById('close-reminder-btn').onclick = function() {
        document.getElementById('reminder-settings-modal').style.display = 'none';
    };
}

// التحقق من التذكير كل دقيقة
setInterval(checkReminderTime, 60000);

// ============================================
// لوحة التحكم المتقدمة للطبيب
// ============================================

let selectedPatientId = null;

// فتح لوحة التحكم
function openDoctorDashboard() {
    document.getElementById('doctor-dashboard').style.display = 'flex';
    loadDashboardStatistics();
    loadPatientsList();
}

// إغلاق لوحة التحكم
function closeDoctorDashboard() {
    document.getElementById('doctor-dashboard').style.display = 'none';
    selectedPatientId = null;
    document.getElementById('patient-details-section').style.display = 'none';
    document.getElementById('patient-assessments-section').style.display = 'none';
    document.getElementById('patient-logs-section').style.display = 'none';
}

// تحميل الإحصائيات العامة
async function loadDashboardStatistics() {
    try {
        const allPatients = await SmartCheckDB.getAllData('patients');
        const allAssessments = await SmartCheckDB.getAllData('assessments');
        const allDailyLogs = await SmartCheckDB.getAllData('dailyLogs');
        
        const subscribedPatients = allPatients.filter(p => p.acceptedRecoveryPlan);
        
        document.getElementById('total-patients-count').textContent = allPatients.length;
        document.getElementById('total-assessments-count').textContent = allAssessments.length;
        document.getElementById('total-daily-logs-count').textContent = allDailyLogs.length;
        document.getElementById('subscribed-patients-count').textContent = subscribedPatients.length;
    } catch (error) {
        console.error('❌ خطأ في تحميل الإحصائيات:', error);
    }
}

// تحميل قائمة المرضى
async function loadPatientsList(searchTerm = '') {
    try {
        const allPatients = await SmartCheckDB.getAllData('patients');
        const patientsList = document.getElementById('patients-list');
        
        let filteredPatients = allPatients;
        if (searchTerm) {
            const term = searchTerm.toLowerCase();
            filteredPatients = allPatients.filter(p => 
                (p.name && p.name.toLowerCase().includes(term)) ||
                (p.phone && p.phone.includes(term))
            );
        }
        
        if (filteredPatients.length === 0) {
            patientsList.innerHTML = '<p style="color: #6b7280; text-align: center; padding: 20px;">لا يوجد مرضى</p>';
            return;
        }
        
        let html = '<div style="display: grid; gap: 10px;">';
        
        filteredPatients.forEach(patient => {
            const statusBadge = patient.acceptedRecoveryPlan 
                ? '<span style="background: #10b981; padding: 4px 8px; border-radius: 4px; font-size: 0.8em;">مشترك</span>'
                : '<span style="background: #6b7280; padding: 4px 8px; border-radius: 4px; font-size: 0.8em;">غير مشترك</span>';
            
            html += `
                <div class="patient-card" data-patient-id="${patient.patientId}" 
                     style="background: #1e2633; padding: 15px; border-radius: 8px; cursor: pointer; border-right: 3px solid var(--primary-gold); transition: all 0.3s;">
                    <div style="display: flex; justify-content: space-between; align-items: center;">
                        <div>
                            <h5 style="margin: 0 0 5px 0; color: white;">${patient.name || 'غير محدد'}</h5>
                            <p style="margin: 0; color: #9ca3af; font-size: 0.9em;">📱 ${patient.phone}</p>
                            <p style="margin: 0; color: #6b7280; font-size: 0.8em;">📅 ${SmartCheckDB.formatDate(patient.createdAt)}</p>
                        </div>
                        <div>${statusBadge}</div>
                    </div>
                </div>
            `;
        });
        
        html += '</div>';
        patientsList.innerHTML = html;
        
        // إضافة أحداث النقر على بطاقات المرضى
        document.querySelectorAll('.patient-card').forEach(card => {
            card.addEventListener('click', function() {
                selectedPatientId = this.dataset.patientId;
                showPatientDetails(selectedPatientId);
            });
        });
    } catch (error) {
        console.error('❌ خطأ في تحميل قائمة المرضى:', error);
    }
}

// عرض تفاصيل المريض
async function showPatientDetails(patientId) {
    try {
        console.log('🔍 جلب بيانات المريض في لوحة الطبيب:', patientId);
        const patient = await SmartCheckDB.getPatientProfile(patientId);
        console.log('📊 بيانات المريض في لوحة الطبيب:', patient);
        
        if (!patient) return;
        
        const detailsContent = document.getElementById('patient-details-content');
        
        detailsContent.innerHTML = `
            <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 15px;">
                <div style="background: #1e2633; padding: 15px; border-radius: 8px;">
                    <h5 style="color: var(--primary-gold); margin: 0 0 10px 0;">الاسم</h5>
                    <p style="color: white; margin: 0;">${patient.name || 'غير محدد'}</p>
                </div>
                <div style="background: #1e2633; padding: 15px; border-radius: 8px;">
                    <h5 style="color: var(--primary-gold); margin: 0 0 10px 0;">رقم الهاتف</h5>
                    <p style="color: white; margin: 0;">${patient.phone}</p>
                </div>
                <div style="background: #1e2633; padding: 15px; border-radius: 8px;">
                    <h5 style="color: var(--primary-gold); margin: 0 0 10px 0;">العمر</h5>
                    <p style="color: white; margin: 0;">${patient.age || 'غير محدد'}</p>
                </div>
                <div style="background: #1e2633; padding: 15px; border-radius: 8px;">
                    <h5 style="color: var(--primary-gold); margin: 0 0 10px 0;">الجنس</h5>
                    <p style="color: white; margin: 0;">${patient.gender === 'male' ? 'ذكر' : 'أنثى'}</p>
                </div>
                <div style="background: #1e2633; padding: 15px; border-radius: 8px;">
                    <h5 style="color: var(--primary-gold); margin: 0 0 10px 0;">الوزن</h5>
                    <p style="color: white; margin: 0;">${patient.weight || 'غير محدد'} كغ</p>
                </div>
                <div style="background: #1e2633; padding: 15px; border-radius: 8px;">
                    <h5 style="color: var(--primary-gold); margin: 0 0 10px 0;">الطول</h5>
                    <p style="color: white; margin: 0;">${patient.height || 'غير محدد'} سم</p>
                </div>
                <div style="background: #1e2633; padding: 15px; border-radius: 8px;">
                    <h5 style="color: var(--primary-gold); margin: 0 0 10px 0;">تاريخ الإنشاء</h5>
                    <p style="color: white; margin: 0;">${SmartCheckDB.formatDate(patient.createdAt)}</p>
                </div>
                <div style="background: #1e2633; padding: 15px; border-radius: 8px;">
                    <h5 style="color: var(--primary-gold); margin: 0 0 10px 0;">آخر زيارة</h5>
                    <p style="color: white; margin: 0;">${SmartCheckDB.formatDate(patient.lastVisit)}</p>
                </div>
                <div style="background: #1e2633; padding: 15px; border-radius: 8px;">
                    <h5 style="color: var(--primary-gold); margin: 0 0 10px 0;">حالة خطة التعافي</h5>
                    <p style="color: ${patient.acceptedRecoveryPlan ? '#10b981' : '#6b7280'}; margin: 0;">
                        ${patient.acceptedRecoveryPlan ? 'مشترك' : 'غير مشترك'}
                    </p>
                    ${patient.acceptedPlanDate ? `<p style="color: #9ca3af; margin: 5px 0 0 0; font-size: 0.8em;">تاريخ الموافقة: ${SmartCheckDB.formatDate(patient.acceptedPlanDate)}</p>` : ''}
                </div>
            </div>
        `;
        
        document.getElementById('patient-details-section').style.display = 'block';
    } catch (error) {
        console.error('❌ خطأ في عرض تفاصيل المريض:', error);
    }
}

// عرض تقييمات المريض
async function showPatientAssessments(patientId) {
    try {
        const assessments = await SmartCheckDB.getPatientAssessments(patientId);
        const assessmentsContent = document.getElementById('patient-assessments-content');
        
        if (assessments.length === 0) {
            assessmentsContent.innerHTML = '<p style="color: #6b7280; text-align: center; padding: 20px;">لا يوجد تقييمات لهذا المريض</p>';
            return;
        }
        
        let html = '<div style="display: grid; gap: 15px;">';
        
        assessments.forEach(assessment => {
            html += `
                <div style="background: #1e2633; padding: 15px; border-radius: 8px; border-right: 3px solid #3b82f6;">
                    <h5 style="color: #3b82f6; margin: 0 0 10px 0;">منطقة الألم: ${assessment.painArea || 'غير محدد'}</h5>
                    <p style="color: white; margin: 0 0 5px 0;">شدة الألم: ${assessment.painScore || 0}/10</p>
                    <p style="color: #9ca3af; margin: 0 0 5px 0;">التشخيصات: ${(assessment.diagnoses || []).join(', ')}</p>
                    <p style="color: #6b7280; margin: 0; font-size: 0.8em;">التاريخ: ${SmartCheckDB.formatDate(assessment.createdAt)}</p>
                </div>
            `;
        });
        
        html += '</div>';
        assessmentsContent.innerHTML = html;
        document.getElementById('patient-assessments-section').style.display = 'block';
    } catch (error) {
        console.error('❌ خطأ في عرض تقييمات المريض:', error);
    }
}

// عرض السجلات اليومية للمريض
async function showPatientLogs(patientId) {
    try {
        const logs = await SmartCheckDB.getPatientDailyLogs(patientId);
        const logsContent = document.getElementById('patient-logs-content');
        
        if (logs.length === 0) {
            logsContent.innerHTML = '<p style="color: #6b7280; text-align: center; padding: 20px;">لا يوجد سجلات يومية لهذا المريض</p>';
            return;
        }
        
        let html = '<div style="display: grid; gap: 15px;">';
        
        logs.forEach(log => {
            html += `
                <div style="background: #1e2633; padding: 15px; border-radius: 8px; border-right: 3px solid #f59e0b;">
                    <h5 style="color: #f59e0b; margin: 0 0 10px 0;">التاريخ: ${log.date}</h5>
                    <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(150px, 1fr)); gap: 10px;">
                        <p style="color: white; margin: 0;">الألم: ${log.painScore}/10</p>
                        <p style="color: white; margin: 0;">الحركة: ${log.movementScore || 0}/10</p>
                        <p style="color: white; margin: 0;">المشي: ${log.walkingMinutes || 0} دقيقة</p>
                        <p style="color: white; margin: 0;">النوم: ${log.sleepQuality || 0}/10</p>
                    </div>
                    <p style="color: ${log.exerciseCompleted ? '#10b981' : '#ef4444'}; margin: 5px 0 0 0;">
                        ${log.exerciseCompleted ? '✅ تم أداء التمارين' : '❌ لم يتم أداء التمارين'}
                    </p>
                </div>
            `;
        });
        
        html += '</div>';
        logsContent.innerHTML = html;
        document.getElementById('patient-logs-section').style.display = 'block';
    } catch (error) {
        console.error('❌ خطأ في عرض السجلات اليومية:', error);
    }
}

// تصدير بيانات المريض
async function exportPatientData() {
    if (!selectedPatientId) {
        showCustomAlert('⚠️ يرجى اختيار مريض أولاً', 'warning');
        return;
    }
    
    try {
        await SmartCheckDB.exportPatientData(selectedPatientId);
        showCustomAlert('✅ تم تصدير بيانات المريض بنجاح', 'success');
    } catch (error) {
        console.error('❌ خطأ في تصدير بيانات المريض:', error);
        showCustomAlert('❌ حدث خطأ أثناء تصدير البيانات', 'error');
    }
}

// حذف المريض
async function deletePatient() {
    if (!selectedPatientId) {
        showCustomAlert('⚠️ يرجى اختيار مريض أولاً', 'warning');
        return;
    }
    
    if (!confirm('⚠️ هل أنت متأكد من حذف هذا المريض وجميع بياناته؟ هذا الإجراء لا يمكن التراجع عنه.')) {
        return;
    }
    
    try {
        await SmartCheckDB.deletePatientProfile(selectedPatientId);
        showCustomAlert('✅ تم حذف المريض بنجاح', 'success');
        closeDoctorDashboard();
        openDoctorDashboard();
    } catch (error) {
        console.error('❌ خطأ في حذف المريض:', error);
        showCustomAlert('❌ حدث خطأ أثناء حذف المريض', 'error');
    }
}

// دالة تحديث علم الدولة المختار
function updateSelectedCountryFlag() {
    const select = document.getElementById('patient-country');
    const display = document.getElementById('selected-country-flag-display');
    if (select && display) {
        const selectedOption = select.options[select.selectedIndex];
        const flag = selectedOption.getAttribute('data-flag');
        display.textContent = flag || '';
    }
}

// ============================================
// ربط الأحداث بعد تحميل الصفحة - تهيئة موحدة وشاملة
// ============================================
document.addEventListener('DOMContentLoaded', async () => {
    // 1. مزامنة رقم الواتساب والعيادة
    const waPhone = (typeof APP_CONFIG !== 'undefined' && APP_CONFIG.whatsappPhone) ? APP_CONFIG.whatsappPhone : '962790000000';
    const promoWaBtn = document.getElementById('clinic-promo-whatsapp-btn');
    if (promoWaBtn) {
        promoWaBtn.href = `https://wa.me/${waPhone}?text=${encodeURIComponent('مرحباً، أود حجز استشارة بخصوص خطة العلاج.')}`;
    }

    // 2. معالجة مؤشرات الإدخال وأشرطة التمرير
    const severity = document.getElementById('severity');
    if (severity) {
        severity.addEventListener('input', function() { 
            const severityValue = document.getElementById('severity-value');
            if (severityValue) severityValue.innerText = this.value; 
        });
    }

    const dailyPainScore = document.getElementById('daily-pain-score');
    if (dailyPainScore) {
        dailyPainScore.addEventListener('input', function() {
            const el = document.getElementById('daily-pain-value');
            if (el) el.textContent = this.value;
        });
    }
    
    const dailyMovementScore = document.getElementById('daily-movement-score');
    if (dailyMovementScore) {
        dailyMovementScore.addEventListener('input', function() {
            const el = document.getElementById('daily-movement-value');
            if (el) el.textContent = this.value;
        });
    }
    
    const dailySleepQuality = document.getElementById('daily-sleep-quality');
    if (dailySleepQuality) {
        dailySleepQuality.addEventListener('input', function() {
            const el = document.getElementById('daily-sleep-value');
            if (el) el.textContent = this.value;
        });
    }

    const assessmentPainScore = document.getElementById('assessment-pain-score');
    if (assessmentPainScore) {
        assessmentPainScore.addEventListener('input', function() {
            const el = document.getElementById('assessment-pain-value');
            if (el) el.textContent = this.value;
        });
    }

    const weight = document.getElementById('weight');
    if (weight) weight.addEventListener('input', updateBMIDisplay);
    
    const height = document.getElementById('height');
    if (height) height.addEventListener('input', updateBMIDisplay);
    
    const freeDescription = document.getElementById('free-description');
    if (freeDescription) freeDescription.addEventListener('input', analyzeFreeDescription);

    // 3. أزرار الفحص وإعادة التعيين والتنقل
    const diagnoseBtn = document.getElementById('diagnose-btn');
    if (diagnoseBtn) diagnoseBtn.addEventListener('click', performDiagnosis);
    
    const resetBtn = document.getElementById('reset-btn');
    if (resetBtn) resetBtn.addEventListener('click', resetAll);
    
    const shareBtn = document.getElementById('share-btn');
    if (shareBtn) shareBtn.addEventListener('click', () => { 
        if(navigator.share) navigator.share({title:'Smart Check Pro', url: window.location.href}); 
        else alert("📋 يرجى نسخ الرابط يدوياً من المتصفح للمشاركة: " + window.location.href); 
    });
    
    const printPdfBtn = document.getElementById('print-pdf-btn');
    if (printPdfBtn) printPdfBtn.addEventListener('click', printOrSaveAsPDF);

    const btnFront = document.getElementById('btn-front');
    if (btnFront) btnFront.addEventListener('click', () => switchView('front'));
    
    const btnBack = document.getElementById('btn-back');
    if (btnBack) btnBack.addEventListener('click', () => switchView('back'));

    // 4. خطة التعافي وحفظ البيانات اليومية
    const startRecoveryPlanBtn = document.getElementById('start-recovery-plan-btn');
    if (startRecoveryPlanBtn) {
        startRecoveryPlanBtn.addEventListener('click', function() {
            const cta = document.getElementById('recovery-plan-cta');
            if (cta) cta.style.display = 'none';
            const saveSec = document.getElementById('save-data-section');
            if (saveSec) {
                saveSec.style.display = 'block';
                saveSec.scrollIntoView({ behavior: 'smooth' });
            }
        });
    }
    
    const declineRecoveryPlanBtn = document.getElementById('decline-recovery-plan-btn');
    if (declineRecoveryPlanBtn) {
        declineRecoveryPlanBtn.addEventListener('click', function() {
            const cta = document.getElementById('recovery-plan-cta');
            if (cta) cta.style.display = 'none';
            showCustomAlert('شكراً لاستخدامك Smart Check Pro. يمكنك العودة في أي وقت لبدء خطة التعافي.', 'info');
        });
    }

    const startRecoveryBtn = document.getElementById('start-recovery-btn');
    if (startRecoveryBtn) startRecoveryBtn.addEventListener('click', savePatientDataAndStartPlan);

    const savePatientDataBtn = document.getElementById('save-patient-data-main-btn');
    if (savePatientDataBtn) savePatientDataBtn.addEventListener('click', savePatientDataAndStartPlan);

    const cancelRecoveryModalBtn = document.getElementById('cancel-recovery-btn');
    if (cancelRecoveryModalBtn) cancelRecoveryModalBtn.addEventListener('click', closeRecoveryPlanModal);

    const saveDailyLogBtn = document.getElementById('save-daily-log-btn');
    if (saveDailyLogBtn) saveDailyLogBtn.addEventListener('click', saveDailyLog);

    const saveBehavioralAssessmentBtn = document.getElementById('save-behavioral-assessment-btn');
    if (saveBehavioralAssessmentBtn) saveBehavioralAssessmentBtn.addEventListener('click', saveBehavioralAssessment);

    const patientCountry = document.getElementById('patient-country');
    const patientPhoneSave = document.getElementById('patient-phone-save');
    if (patientCountry && patientPhoneSave) {
        patientCountry.addEventListener('change', function() {
            const selectedOption = this.options[this.selectedIndex];
            const prefix = selectedOption.getAttribute('data-prefix');
            patientPhoneSave.placeholder = prefix ? `مثال: ${prefix}1234567` : 'مثال: 0791234567';
        });
    }

    const clearDataBtn = document.getElementById('clear-data-btn');
    if (clearDataBtn) {
        clearDataBtn.addEventListener('click', async function() {
            const isDeveloperMode = localStorage.getItem('isDeveloper') === 'true';
            if (!isDeveloperMode) {
                const clearCount = parseInt(localStorage.getItem('dataClearCount') || '0');
                if (clearCount >= 2) {
                    showCustomAlert('⚠️ لقد قمت بمسح البيانات مرتين بالفعل. لا يمكن مسح البيانات أكثر من ذلك.', 'warning');
                    return;
                }
            }
            if (confirm('هل أنت متأكد من مسح جميع البيانات؟ هذا الإجراء لا يمكن التراجع عنه.')) {
                try {
                    const db = await SmartCheckDB.openDatabase();
                    const transaction = db.transaction(['patients', 'assessments', 'dailyLogs', 'recoveryProgress'], 'readwrite');
                    transaction.objectStore('patients').clear();
                    transaction.objectStore('assessments').clear();
                    transaction.objectStore('dailyLogs').clear();
                    if (transaction.objectStoreNames.contains('recoveryProgress')) {
                        transaction.objectStore('recoveryProgress').clear();
                    }
                    localStorage.removeItem('currentPatientId');
                    localStorage.removeItem('currentPatientPhone');
                    localStorage.removeItem('currentPatientCountry');
                    localStorage.removeItem('lastDailyLogUpdate');
                    localStorage.removeItem('smartProState');
                    if (!isDeveloperMode) {
                        const newCount = parseInt(localStorage.getItem('dataClearCount') || '0') + 1;
                        localStorage.setItem('dataClearCount', newCount.toString());
                    }
                    showCustomAlert('✅ تم مسح جميع البيانات بنجاح', 'success');
                    setTimeout(() => location.reload(), 1000);
                } catch (error) {
                    console.error('❌ خطأ في مسح البيانات:', error);
                    showCustomAlert('حدث خطأ في مسح البيانات', 'error');
                }
            }
        });
    }

    const exportDataBtn = document.getElementById('export-data-btn');
    if (exportDataBtn) exportDataBtn.addEventListener('click', exportData);

    const reminderSettingsBtn = document.getElementById('reminder-settings-btn');
    if (reminderSettingsBtn) reminderSettingsBtn.addEventListener('click', showReminderSettings);

    // 5. حسابات المستخدمين وتسجيل الدخول
    const patientLoginHeaderBtn = document.getElementById('patient-login-header-btn');
    if (patientLoginHeaderBtn) {
        patientLoginHeaderBtn.addEventListener('click', function() {
            document.getElementById('patient-login-modal').style.display = 'flex';
        });
    }

    const patientLoginBtn = document.getElementById('patient-login-btn');
    if (patientLoginBtn) patientLoginBtn.addEventListener('click', patientLogin);

    const loginPhoneInput = document.getElementById('login-phone');
    if (loginPhoneInput) {
        loginPhoneInput.addEventListener('keypress', function(e) {
            if (e.key === 'Enter') patientLogin();
        });
    }

    const patientLoginCancelBtn = document.getElementById('patient-login-cancel-btn');
    if (patientLoginCancelBtn) {
        patientLoginCancelBtn.addEventListener('click', function() {
            document.getElementById('patient-login-modal').style.display = 'none';
        });
    }

    const newDiagnosisBtn = document.getElementById('new-diagnosis-btn');
    if (newDiagnosisBtn) {
        newDiagnosisBtn.addEventListener('click', function() {
            document.getElementById('patient-login-modal').style.display = 'none';
            resetDiagnosticForm();
        });
    }

    const patientLogoutBtn = document.getElementById('patient-logout-btn');
    if (patientLogoutBtn) {
        patientLogoutBtn.addEventListener('click', function() {
            if (confirm('هل تريد تسجيل الخروج؟')) {
                localStorage.removeItem('currentPatientId');
                localStorage.removeItem('isNewDiagnosis');
                document.getElementById('patient-logout-btn').style.display = 'none';
                document.getElementById('patient-login-header-btn').style.display = 'inline-block';
                document.getElementById('daily-tracking-section').style.display = 'none';
                document.getElementById('report-section').style.display = 'none';
                document.getElementById('welcome-box').style.display = 'block';
                document.getElementById('diagnostic-card').style.display = 'none';
                showCustomAlert('تم تسجيل الخروج بنجاح', 'success');
                resetDiagnosticForm();
            }
        });
    }

    // 6. لوحة الإدارة ولوحة الطبيب
    const adminPanelBtn = document.getElementById('admin-panel-btn');
    if (adminPanelBtn) adminPanelBtn.addEventListener('click', openAdminPanel);

    const adminLoginBtn = document.getElementById('admin-login-btn');
    if (adminLoginBtn) adminLoginBtn.addEventListener('click', adminLogin);

    const adminPasswordInput = document.getElementById('admin-password');
    if (adminPasswordInput) {
        adminPasswordInput.addEventListener('keypress', function(e) {
            if (e.key === 'Enter') adminLogin();
        });
    }

    const adminLogoutBtn = document.getElementById('admin-logout-btn');
    if (adminLogoutBtn) adminLogoutBtn.addEventListener('click', adminLogout);

    const doctorDashboardBtn = document.getElementById('doctor-dashboard-btn');
    if (doctorDashboardBtn) doctorDashboardBtn.addEventListener('click', openDoctorDashboard);

    const closeDoctorDashboardBtn = document.getElementById('close-doctor-dashboard');
    if (closeDoctorDashboardBtn) closeDoctorDashboardBtn.addEventListener('click', closeDoctorDashboard);

    const doctorPatientSearch = document.getElementById('doctor-patient-search') || document.getElementById('patient-search');
    if (doctorPatientSearch) {
        doctorPatientSearch.addEventListener('input', function() {
            loadPatientsList(this.value);
        });
    }

    const patientSearchInput = document.getElementById('patient-search');
    if (patientSearchInput) patientSearchInput.addEventListener('input', loadAdminPatientList);

    const viewPatientAssessmentsBtn = document.getElementById('view-patient-assessments-btn');
    if (viewPatientAssessmentsBtn) {
        viewPatientAssessmentsBtn.addEventListener('click', function() {
            if (typeof selectedPatientId !== 'undefined' && selectedPatientId) showPatientAssessments(selectedPatientId);
        });
    }

    const viewPatientLogsBtn = document.getElementById('view-patient-logs-btn');
    if (viewPatientLogsBtn) {
        viewPatientLogsBtn.addEventListener('click', function() {
            if (typeof selectedPatientId !== 'undefined' && selectedPatientId) showPatientLogs(selectedPatientId);
        });
    }

    const exportPatientDataBtn = document.getElementById('export-patient-data-btn');
    if (exportPatientDataBtn) exportPatientDataBtn.addEventListener('click', exportPatientData);

    const deletePatientBtn = document.getElementById('delete-patient-btn');
    if (deletePatientBtn) deletePatientBtn.addEventListener('click', deletePatient);

    const exportPatientsBtn = document.getElementById('export-patients-btn');
    if (exportPatientsBtn) exportPatientsBtn.addEventListener('click', exportPatientsData);

    const changePasswordBtn = document.getElementById('change-password-btn');
    if (changePasswordBtn) {
        changePasswordBtn.addEventListener('click', function() {
            document.getElementById('change-password-modal').style.display = 'flex';
        });
    }

    const savePasswordBtn = document.getElementById('save-password-btn');
    if (savePasswordBtn) savePasswordBtn.addEventListener('click', changeAdminPassword);

    const cancelPasswordBtn = document.getElementById('cancel-password-btn');
    if (cancelPasswordBtn) {
        cancelPasswordBtn.addEventListener('click', function() {
            document.getElementById('change-password-modal').style.display = 'none';
        });
    }

    const addPatientBtn = document.getElementById('add-patient-btn');
    if (addPatientBtn) {
        addPatientBtn.addEventListener('click', function() {
            document.getElementById('add-patient-modal').style.display = 'flex';
        });
    }

    const saveNewPatientBtn = document.getElementById('save-new-patient-btn');
    if (saveNewPatientBtn) saveNewPatientBtn.addEventListener('click', addNewPatient);

    const cancelNewPatientBtn = document.getElementById('cancel-new-patient-btn');
    if (cancelNewPatientBtn) {
        cancelNewPatientBtn.addEventListener('click', function() {
            document.getElementById('add-patient-modal').style.display = 'none';
        });
    }

    const saveSessionIntervalBtn = document.getElementById('save-session-interval-btn');
    if (saveSessionIntervalBtn) {
        saveSessionIntervalBtn.addEventListener('click', function() {
            const interval = document.getElementById('session-interval').value;
            localStorage.setItem('sessionInterval', interval);
            showCustomAlert('✅ تم حفظ وقت الجلسة بنجاح: ' + interval + ' ساعة', 'success');
        });
    }

    const savedSessionInterval = localStorage.getItem('sessionInterval');
    if (savedSessionInterval) {
        const sessionIntervalInput = document.getElementById('session-interval');
        if (sessionIntervalInput) sessionIntervalInput.value = savedSessionInterval;
    }

    const toggleDeveloperModeBtn = document.getElementById('toggle-developer-mode-btn');
    if (toggleDeveloperModeBtn) {
        toggleDeveloperModeBtn.addEventListener('click', function() {
            const isDeveloper = localStorage.getItem('isDeveloper') === 'true';
            localStorage.setItem('isDeveloper', isDeveloper ? 'false' : 'true');
            this.textContent = isDeveloper ? '🔧 وضع المطور' : '🔧 وضع المطور (مفعل)';
            this.style.background = isDeveloper ? '#8b5cf6' : '#10b981';
            showCustomAlert(isDeveloper ? 'تم إيقاف وضع المطور' : 'تم تفعيل وضع المطور - يمكنك الآن تجاوز القفل الزمني', 'info');
        });
    }

    const closeAdminPatientDetailsBtn = document.getElementById('close-patient-details-btn');
    if (closeAdminPatientDetailsBtn) {
        closeAdminPatientDetailsBtn.addEventListener('click', function() {
            const d = document.getElementById('admin-patient-details');
            if (d) d.style.display = 'none';
        });
    }

    const successModalOkBtn = document.getElementById('success-modal-ok-btn');
    if (successModalOkBtn) {
        successModalOkBtn.addEventListener('click', function() {
            document.getElementById('success-modal').style.display = 'none';
        });
    }

    // 6.1. مكتبة التمارين المصورة الكاملة
    const exerciseLibraryBtn = document.getElementById('exercise-library-btn');
    if (exerciseLibraryBtn) {
        exerciseLibraryBtn.addEventListener('click', function() {
            const modal = document.getElementById('exercise-library-modal');
            if (modal) {
                modal.style.display = 'flex';
                renderExerciseLibraryCards('all');
            }
        });
    }

    const closeExerciseLibraryBtn = document.getElementById('close-exercise-library-btn');
    if (closeExerciseLibraryBtn) {
        closeExerciseLibraryBtn.addEventListener('click', function() {
            const modal = document.getElementById('exercise-library-modal');
            if (modal) modal.style.display = 'none';
        });
    }

    const filterBtns = document.querySelectorAll('.lib-filter-btn');
    filterBtns.forEach(btn => {
        btn.addEventListener('click', function() {
            filterBtns.forEach(b => {
                b.classList.remove('active');
                b.style.background = '#1e2633';
                b.style.color = '#d1d5db';
            });
            this.classList.add('active');
            this.style.background = 'var(--primary-gold)';
            this.style.color = '#ffffff';
            const region = this.getAttribute('data-region') || 'all';
            renderExerciseLibraryCards(region);
        });
    });

    // 7. النوافذ الترحيبية ونقاط الجسم
    const welcomeBtn = document.getElementById('welcome-btn');
    if (welcomeBtn) {
        welcomeBtn.addEventListener('click', function() {
            document.getElementById('welcome-modal').style.display = 'none';
            document.getElementById('consent-modal').style.display = 'flex';
        });
    }
    
    const consentModal = document.getElementById('consent-modal');
    const consentBtn = document.getElementById('consent-btn');
    if (localStorage.getItem('smartConsent') === 'true') {
        if (consentModal) consentModal.style.display = 'none';
        const welcomeM = document.getElementById('welcome-modal');
        if (welcomeM) welcomeM.style.display = 'none';
        createPoints(frontPoints, 'front-container');
        createPoints(backPoints, 'back-container');
        loadState();
    } else {
        if (consentModal) consentModal.style.display = 'none';
        const welcomeM = document.getElementById('welcome-modal');
        if (welcomeM) welcomeM.style.display = 'flex';
        if (consentBtn) {
            consentBtn.onclick = () => {
                localStorage.setItem('smartConsent', 'true');
                if (consentModal) consentModal.style.display = 'none';
                createPoints(frontPoints, 'front-container');
                createPoints(backPoints, 'back-container');
                loadState();
            };
        }
    }

    // 8. التحقق من حالة الإدارة المفتوحة
    const adminPanelOpen = sessionStorage.getItem('adminPanelOpen');
    if (adminPanelOpen === 'true') {
        const adminModal = document.getElementById('admin-panel-modal');
        const adminContent = document.getElementById('admin-content');
        if (adminModal && adminContent) {
            adminModal.style.display = 'flex';
            adminContent.style.display = 'block';
            const pwGroup = document.getElementById('admin-password')?.parentElement;
            if (pwGroup) pwGroup.style.display = 'none';
            await loadAdminPatientList();
        }
    }

    // 9. الاستماع لتحديثات الساعة
    window.addEventListener('storage', (e) => {
        if (e.key === 'countdownUpdated') {
            checkDailyLogAvailability();
        }
    });

    // 10. التحقق من المريض الحالي بعد تحميل قاعدة البيانات
    setTimeout(async () => {
        await checkExistingPatient();
    }, 300);
});

// ============================================
// وظائف المتابعة اليومية وحفظ البيانات
// ============================================

// حفظ بيانات التقييم في IndexedDB
async function saveAssessmentToDB(patientId, diagnosis, pattern, severity, duration, personalNotes = '') {
    try {
        // جمع الإجابات من الأسئلة الديناميكية
        const answers = {};
        document.querySelectorAll('.dynamic-question').forEach(q => {
            const questionId = q.dataset.questionId;
            const questionName = q.querySelector('[name]')?.name || q.dataset.questionId;
            let answer;
            
            if (q.querySelector('input[type="radio"]:checked')) {
                answer = q.querySelector('input[type="radio"]:checked').value;
            } else if (q.querySelector('input[type="checkbox"]:checked')) {
                const checkedBoxes = q.querySelectorAll('input[type="checkbox"]:checked');
                answer = Array.from(checkedBoxes).map(cb => cb.value);
            } else if (q.querySelector('select')) {
                answer = q.querySelector('select').value;
            } else if (q.querySelector('input[type="text"]')) {
                answer = q.querySelector('input[type="text"]').value;
            } else if (q.querySelector('textarea')) {
                answer = q.querySelector('textarea').value;
            }
            
            if (answer !== undefined && questionName) {
                answers[questionName] = answer;
            }
        });
        
        const assessmentData = {
            painArea: activeJointName || activeJointId,
            painScore: severity,
            severity: severity,
            duration: duration,
            pattern: pattern,
            clinicalFeatures: pattern ? pattern.features : [],
            diagnoses: diagnosis.map(d => ({
                name: d.name,
                prob: d.prob
            })),
            treatmentGoals: pattern ? pattern.goals : [],
            recoveryPlan: [],
            answers: answers,
            personalNotes: personalNotes,
            chronicDiseases: Array.from(document.querySelectorAll('input[name="chronic"]:checked')).map(cb => cb.value)
        };
        
        console.log('💾 حفظ التقييم:', assessmentData);
        await SmartCheckDB.createAssessment(patientId, assessmentData);
        console.log('✅ تم حفظ التقييم في قاعدة البيانات', assessmentData);
    } catch (error) {
        console.error('❌ خطأ في حفظ التقييم:', error);
    }
}

// تحميل بيانات المتابعة اليومية
async function loadDailyTrackingData(patientId) {
    try {
        const logs = await SmartCheckDB.getPatientDailyLogs(patientId);
        const patient = await SmartCheckDB.getPatientProfile(patientId);

        if (!patient) return;

        // حساب اليوم الحالي بناءً على عدد السجلات (وليس تاريخ التسجيل)
        const currentDay = Math.min(logs.length + 1, 7);

        // تحديث عداد الأيام
        const dayCounter = document.getElementById('day-counter');
        if (dayCounter) {
            dayCounter.textContent = `اليوم ${currentDay} من 7`;
        }

        // إظهار قسم المتابعة اليومية فقط للمشتركين من اليوم الثاني
        if (patient.acceptedRecoveryPlan) {
            if (logs.length === 0) {
                // اليوم الأول: لا تفعل شيئاً - checkDailyLogAvailability سيتولى الأمر
                console.log('✅ اليوم الأول - loadDailyTrackingData لا تفعل شيئاً');
                return;
            } else {
                // من اليوم الثاني: التحقق من وقت الجلسة قبل إظهار قسم المتابعة
                const lastLog = logs[logs.length - 1];
                const lastLogDate = new Date(lastLog.date);
                const now = new Date();
                const hoursSinceLastLog = (now - lastLogDate) / (1000 * 60 * 60);
                const sessionInterval = parseInt(localStorage.getItem('sessionInterval')) || 24;
                
                // التحقق من وقت بدء الجلسة الحالية
                const currentSession = logs.length + 1;
                const sessionStartTimeKey = `sessionStartTime_${patient.patientId}_${currentSession}`;
                let sessionStartTime = localStorage.getItem(sessionStartTimeKey);
                
                if (!sessionStartTime || logs.length === 0) {
                    sessionStartTime = new Date().toISOString();
                    localStorage.setItem(sessionStartTimeKey, sessionStartTime);
                }
                
                const sessionStartDate = new Date(sessionStartTime);
                const elapsedSinceSessionStart = (now - sessionStartDate) / (1000 * 60 * 60);
                
                console.log('🕐 loadDailyTrackingData - الوقت المنقضي منذ بدء الجلسة:', elapsedSinceSessionStart);
                console.log('🕐 loadDailyTrackingData - هل يجب إظهار الساعة؟', elapsedSinceSessionStart < sessionInterval);
                
                if (elapsedSinceSessionStart < sessionInterval) {
                    // لم ينتهِ وقت الجلسة - إظهار الساعة وإخفاء قسم المتابعة
                    console.log('🕐 loadDailyTrackingData - إظهار الساعة وإخفاء قسم المتابعة');
                    document.getElementById('daily-tracking-section').style.display = 'none';
                    
                    // إظهار الساعة
                    const elegantCountdownDiv = document.getElementById('elegant-countdown');
                    if (elegantCountdownDiv) {
                        elegantCountdownDiv.style.display = 'block';
                        console.log('✅ تم إظهار الساعة من loadDailyTrackingData');
                    }
                } else {
                    // انتهى وقت الجلسة - إظهار قسم المتابعة
                    document.getElementById('daily-tracking-section').style.display = 'block';
                    console.log('✅ من اليوم الثاني - إظهار قسم المتابعة اليومية');
                    
                    // إخفاء التمارين المنزلية في جلسات المتابعة اليومية فقط
                    const homeExercises = document.getElementById('home-exercises');
                    if (homeExercises) homeExercises.style.display = 'none';
                    console.log('✅ تم إخفاء التمارين المنزلية في جلسات المتابعة');
                    
                    // إخفاء التقرير الاحترافي في جلسات المتابعة اليومية فقط
                    const reportSection = document.getElementById('report-section');
                    if (reportSection) reportSection.style.display = 'none';
                    console.log('✅ تم إخفاء التقرير الاحترافي في جلسات المتابعة');
                    
                    // الاحتفاظ ببلوك نقطة الألم (الأحمر)
                    const painAreaDisplay = document.getElementById('pain-area-display');
                    if (painAreaDisplay) {
                        painAreaDisplay.style.display = 'block';
                        console.log('✅ تم إبقاء بلوك نقطة الألم');
                    }
                    
                    // إبقاء التمارين اليومية والمتابعة - لا إخفاء
                    console.log('✅ التمارين اليومية والمتابعة ستظهر للمريض');
                    
                    // تحميل مؤشر التعافي
                    const progress = await SmartCheckDB.getRecoveryProgress(patientId);
                    if (progress) {
                        updateRecoveryScoreDisplay(progress);
                    }
                    
                    // تحميل السجلات اليومية
                    displayProgressChart(logs);
                    
                    // التحقق من وجود سجل لليوم
                    const today = new Date().toISOString().split('T')[0];
                    const todayLog = await SmartCheckDB.getDailyLog(patientId, today);
                    if (todayLog) {
                        fillDailyLogForm(todayLog);
                    }
                    
                    // التحقق من إمكانية الإدخال اليومي
                    checkDailyLogAvailability();
                }
            }
        } else {
            // غير مشترك: إخفاء قسم المتابعة اليومية
            document.getElementById('daily-tracking-section').style.display = 'none';
            console.log('✅ المريض غير مشترك - تم إخفاء قسم المتابعة اليومية');
        }
    } catch (error) {
        console.error('❌ خطأ في تحميل بيانات المتابعة:', error);
    }
}

// تحديث عرض مؤشر التعافي
function updateRecoveryScoreDisplay(progress) {
    const recoveryBar = document.getElementById('recovery-bar');
    const recoveryText = document.getElementById('recovery-text');
    const recoveryBadge = document.getElementById('recovery-score-badge');
    
    recoveryBar.style.width = `${progress.recoveryScore}%`;
    recoveryText.textContent = `مؤشر التعافي: ${progress.recoveryScore}% | الأيام منذ البدء: ${progress.daysSinceStart}`;
    recoveryBadge.textContent = `مؤشر التعافي: ${progress.recoveryScore}%`;
    
    // تحديث لون المؤشر
    if (progress.recoveryScore >= 70) {
        recoveryBar.style.backgroundColor = '#10b981';
    } else if (progress.recoveryScore >= 40) {
        recoveryBar.style.backgroundColor = '#f59e0b';
    } else {
        recoveryBar.style.backgroundColor = '#ef4444';
    }
}

// عرض سجل التقدم
function displayProgressChart(logs) {
    const progressData = document.getElementById('progress-data');
    
    if (!progressData) {
        console.error('❌ عنصر progress-data غير موجود');
        return;
    }
    
    if (logs.length === 0) {
        progressData.innerHTML = '<p style="color: #9ca3af; text-align: center; padding: 20px;">لا توجد بيانات سابقة</p>';
        return;
    }
    
    console.log('📊 عرض سجل التقدم - عدد السجلات:', logs.length);
    
    let html = '';
    logs.forEach((log, index) => {
        const date = SmartCheckDB.formatDate(log.date);
        const sessionNumber = index + 1;
        html += `
        <div style="display: flex; justify-content: space-between; align-items: center; padding: 12px 15px; background: #1e2633; border-radius: 8px; margin-bottom: 10px; border-right: 3px solid #d4af37;">
            <div style="flex: 1;">
                <div style="color: #d4af37; font-weight: bold; margin-bottom: 5px;">الجلسة ${sessionNumber} - ${date}</div>
                <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(120px, 1fr)); gap: 8px; font-size: 0.9em; color: #e5e7eb;">
                    <div>🔴 الألم: ${log.painScore}/10</div>
                    <div>🏃 الحركة: ${log.movementScore || 0}/10</div>
                    <div>🚶 المشي: ${log.walkingMinutes || 0} دقيقة</div>
                    <div>😴 النوم: ${log.sleepQuality || 0}/10</div>
                </div>
            </div>
            <div style="text-align: center; margin-right: 15px;">
                <div style="color: ${log.exerciseCompleted ? '#10b981' : '#ef4444'}; font-weight: bold; font-size: 1.1em;">
                    ${log.exerciseCompleted ? '✅' : '❌'}
                </div>
                <div style="font-size: 0.8em; color: #9ca3af;">التمارين</div>
            </div>
        </div>`;
    });
    
    progressData.innerHTML = html;
    console.log('✅ تم عرض سجل التقدم بنجاح');
}

// ملء نموذج السجل اليومي
function fillDailyLogForm(log) {
    document.getElementById('daily-pain-score').value = log.painScore;
    document.getElementById('daily-pain-value').textContent = log.painScore;
    document.getElementById('daily-movement-score').value = log.movementScore;
    document.getElementById('daily-movement-value').textContent = log.movementScore;
    document.getElementById('daily-walking-minutes').value = log.walkingMinutes;
    document.getElementById('daily-sleep-quality').value = log.sleepQuality;
    document.getElementById('daily-sleep-value').textContent = log.sleepQuality;
    document.getElementById('daily-exercise-completed').checked = log.exerciseCompleted;
    document.getElementById('daily-walking-done').checked = log.walkingDone || false;
    document.getElementById('daily-stretching-done').checked = log.stretchingDone || false;
    document.getElementById('daily-heat-therapy').checked = log.heatTherapy || false;
    document.getElementById('daily-good-posture').checked = log.goodPosture || false;
    document.getElementById('daily-pain-radiation').checked = log.painRadiation;
    document.getElementById('daily-rest-enough').checked = log.restEnough || false;
    document.getElementById('daily-long-sitting').checked = log.longSitting || false;
    document.getElementById('daily-excessive-walking').checked = log.excessiveWalking || false;
    document.getElementById('daily-heavy-lifting').checked = log.heavyLifting || false;
    document.getElementById('daily-phone-usage').checked = log.phoneUsage || false;
    document.getElementById('daily-poor-sleep').checked = log.poorSleep || false;
    document.getElementById('daily-notes').value = log.notes;
}

// حفظ السجل اليومي
async function saveDailyLog() {
    try {
        const currentPatient = await SmartCheckDB.getCurrentPatient();
        if (!currentPatient) {
            showCustomAlert('⚠️ يرجى حفظ بياناتك الشخصية أولاً للوصول إلى هذه الميزة', 'warning');
            document.getElementById('save-data-section').style.display = "block";
            document.getElementById('save-data-section').scrollIntoView({ behavior: 'smooth' });
            return;
        }
        
        const logData = {
            painScore: parseInt(document.getElementById('daily-pain-score').value),
            movementScore: parseInt(document.getElementById('daily-movement-score').value),
            walkingMinutes: parseInt(document.getElementById('daily-walking-minutes').value) || 0,
            sleepQuality: parseInt(document.getElementById('daily-sleep-quality').value),
            exerciseCompleted: document.getElementById('daily-exercise-completed').checked,
            walkingDone: document.getElementById('daily-walking-done').checked,
            stretchingDone: document.getElementById('daily-stretching-done').checked,
            heatTherapy: document.getElementById('daily-heat-therapy').checked,
            goodPosture: document.getElementById('daily-good-posture').checked,
            painRadiation: document.getElementById('daily-pain-radiation').checked,
            restEnough: document.getElementById('daily-rest-enough').checked,
            longSitting: document.getElementById('daily-long-sitting').checked,
            excessiveWalking: document.getElementById('daily-excessive-walking').checked,
            heavyLifting: document.getElementById('daily-heavy-lifting').checked,
            phoneUsage: document.getElementById('daily-phone-usage').checked,
            poorSleep: document.getElementById('daily-poor-sleep').checked,
            notes: document.getElementById('daily-notes').value
        };
        
        // التحقق من وجود سجل لليوم
        const today = new Date().toISOString().split('T')[0];
        const existingLog = await SmartCheckDB.getDailyLog(currentPatient.patientId, today);
        
        if (existingLog) {
            await SmartCheckDB.updateDailyLog(existingLog.logId, logData);
        } else {
            await SmartCheckDB.createDailyLog(currentPatient.patientId, logData);
        }
        
        // تحديث مؤشر التعافي
        await updateRecoveryScore(currentPatient.patientId);
        
        // تحديث العرض
        await loadDailyTrackingData(currentPatient.patientId);
        
        // حفظ وقت آخر تحديث
        localStorage.setItem('lastDailyLogUpdate', new Date().toISOString());
        
        // إلغاء البوب المنفصل واستخدام الساعة الأنيقة
        // تفعيل الساعة الأنيقة وإلغاء تفعيل الأسئلة
        await checkDailyLogAvailability();
        
        // إظهار رسائل بناءً على السلوكيات في عنصر HTML ثابت
        let behaviorsHtml = '';
        let encouragementMessage = '';
        
        // التحقق من السلوكيات السلبية
        const negativeBehaviors = [];
        if (logData.longSitting) negativeBehaviors.push('جلست لفترة طويلة');
        if (logData.excessiveWalking) negativeBehaviors.push('مشيت مسافة طويلة');
        if (logData.heavyLifting) negativeBehaviors.push('بذلت جهد بدني متعب');
        if (logData.phoneUsage) negativeBehaviors.push('استخدمت الهاتف لفترة طويلة');
        if (logData.poorSleep) negativeBehaviors.push('نمت بشكل سيء');
        
        // التحقق من السلوكيات الإيجابية
        const positiveBehaviors = [];
        if (logData.exerciseCompleted) positiveBehaviors.push('نفذت التمارين');
        if (logData.walkingDone) positiveBehaviors.push('مشيت لمدة كافية');
        if (logData.stretchingDone) positiveBehaviors.push('قمت بتمارين الإطالة');
        if (logData.heatTherapy) positiveBehaviors.push('استخدمت العلاج الحراري');
        if (logData.goodPosture) positiveBehaviors.push('حافظت على وضعية جيدة');
        if (logData.restEnough) positiveBehaviors.push('حصلت على قسط كافٍ من الراحة');
        
        // إنشاء رسالة تشجيعية بناءً على السلوكيات
        if (positiveBehaviors.length >= 4) {
            encouragementMessage = '🌟 أنت بطلاً! التزامك الممتاز يسرع من تعافيك. استمر في هذا الأداء الرائع!';
        } else if (positiveBehaviors.length >= 2) {
            encouragementMessage = '💪 أداء جيد! أنت تسير في الطريق الصحيح. حافظ على هذا الالتزام!';
        } else if (positiveBehaviors.length >= 1) {
            encouragementMessage = '👍 بداية جيدة! استمر في تحسين سلوكياتك اليومية!';
        } else {
            encouragementMessage = '🤔 حاول الالتزام أكثر بالتمارين والسلوكيات الصحية في اليوم القادم!';
        }
        
        // بناء HTML للسلوكيات
        behaviorsHtml = `
            <div id="behaviors-display" style="background: linear-gradient(135deg, #1e2633 0%, #2d3748 100%); border-radius: 16px; padding: 25px; margin-bottom: 30px; border: 2px solid #10b981; box-shadow: 0 8px 32px rgba(16, 185, 129, 0.2);">
                <div style="text-align: center; margin-bottom: 20px;">
                    <div style="font-size: 2em; margin-bottom: 10px;">📊</div>
                    <h3 style="color: #10b981; margin: 0; font-size: 1.5em;">تحليل سلوكياتك اليومية</h3>
                    <div style="color: #9ca3af; margin-top: 8px;">مراجعة سلوكياتك لتحسين التعافي</div>
                </div>
                
                <div style="background: #0a0e14; border-radius: 12px; padding: 20px; margin-bottom: 15px;">
                    <h4 style="color: #10b981; margin: 0 0 15px 0; font-size: 1.2em;">✅ السلوكيات الإيجابية</h4>
                    ${positiveBehaviors.length > 0 ? positiveBehaviors.map(b => `
                        <div style="background: #1e2633; padding: 12px; border-radius: 8px; margin-bottom: 10px; border-right: 3px solid #10b981;">
                            <div style="color: white; font-weight: bold;">${b}</div>
                        </div>
                    `).join('') : '<div style="color: #9ca3af; text-align: center; padding: 15px;">لا توجد سلوكيات إيجابية مسجلة اليوم</div>'}
                </div>
                
                ${negativeBehaviors.length > 0 ? `
                    <div style="background: #0a0e14; border-radius: 12px; padding: 20px; margin-bottom: 15px;">
                        <h4 style="color: #ef4444; margin: 0 0 15px 0; font-size: 1.2em;">⚠️ السلوكيات التي تحتاج تحسين</h4>
                        ${negativeBehaviors.map(b => `
                            <div style="background: #1e2633; padding: 12px; border-radius: 8px; margin-bottom: 10px; border-right: 3px solid #ef4444;">
                                <div style="color: white; font-weight: bold;">${b}</div>
                            </div>
                        `).join('')}
                    </div>
                ` : ''}
                
                <div style="background: linear-gradient(135deg, #10b981 0%, #059669 100%); border-radius: 12px; padding: 20px; text-align: center;">
                    <div style="color: white; font-size: 1.3em; font-weight: bold;">${encouragementMessage}</div>
                </div>
            </div>
        `;
        
        // إضافة عرض السلوكيات فوق قسم المتابعة اليومية
        const dailyTrackingSection = document.getElementById('daily-tracking-section');
        if (dailyTrackingSection) {
            const oldBehaviorsDisplay = document.getElementById('behaviors-display');
            if (oldBehaviorsDisplay) oldBehaviorsDisplay.remove();

            const behaviorsContainer = document.createElement('div');
            behaviorsContainer.innerHTML = behaviorsHtml;
            dailyTrackingSection.insertBefore(behaviorsContainer, dailyTrackingSection.firstChild);
        }

        // إخفاء قسم السلوكيات بعد الحفظ
        const behaviorsSection = document.getElementById('daily-behaviors-section');
        if (behaviorsSection) {
            behaviorsSection.style.display = 'none';
        }

        showCustomAlert('✅ تم حفظ السجل اليومي بنجاح. يمكنك تحديث البيانات مرة أخرى بعد 24 ساعة.', 'success');
    } catch (error) {
        console.error('❌ خطأ في حفظ السجل اليومي:', error);
        showCustomAlert('😅 حدث خطأ في حفظ السجل اليومي. يرجى المحاولة مرة أخرى', 'error');
    }
}

// تفعيل وضع القفل
function activateLockMode() {
    // التحقق من صلاحيات المطور
    const isDeveloper = localStorage.getItem('isDeveloper') === 'true';
    if (isDeveloper) {
        console.log('🔓 وضع المطور: تجاوز القفل 24 ساعة');
        return;
    }
    
    const lockModal = document.getElementById('lock-modal');
    const dailyTrackingSection = document.getElementById('daily-tracking-section');
    
    // إخفاء قسم المتابعة اليومية
    if (dailyTrackingSection) {
        dailyTrackingSection.style.display = 'none';
    }
    
    // عرض نافذة القفل
    lockModal.style.display = 'flex';
    
    // بدء العد التنازلي
    startCountdown();
}

// بدء العد التنازلي
function startCountdown() {
    const countdownElement = document.getElementById('countdown-timer');
    const lastUpdate = localStorage.getItem('lastDailyLogUpdate');
    
    console.log('🕐 بدء العد التنازلي، آخر تحديث:', lastUpdate);
    
    if (!countdownElement) {
        console.error('❌ عنصر countdown-timer غير موجود');
        return;
    }
    
    if (!lastUpdate) {
        countdownElement.textContent = 'لا يوجد موعد محدد';
        return;
    }
    
    const lastUpdateTime = new Date(lastUpdate);
    const nextUpdateTime = new Date(lastUpdateTime.getTime() + 24 * 60 * 60 * 1000); // 24 ساعة
    
    console.log('🕐 وقت التحديث التالي:', nextUpdateTime);
    
    const updateCountdown = () => {
        const now = new Date();
        const timeLeft = nextUpdateTime - now;
        
        if (timeLeft <= 0) {
            countdownElement.textContent = 'يمكنك الآن تحديث البيانات';
            unlockTool();
            return;
        }
        
        const hours = Math.floor(timeLeft / (1000 * 60 * 60));
        const minutes = Math.floor((timeLeft % (1000 * 60 * 60)) / (1000 * 60));
        const seconds = Math.floor((timeLeft % (1000 * 60)) / 1000);
        
        countdownElement.textContent = `${hours} ساعة ${minutes} دقيقة ${seconds} ثانية`;
    };
    
    updateCountdown();
    const countdownInterval = setInterval(updateCountdown, 1000);
    
    // حفظ interval ID لإيقافه لاحقاً
    localStorage.setItem('countdownInterval', countdownInterval);
    console.log('✅ تم بدء العد التنازلي');
}

// فتح الأداة
function unlockTool() {
    const lockModal = document.getElementById('lock-modal');
    const dailyTrackingSection = document.getElementById('daily-tracking-section');
    
    // إخفاء نافذة القفل
    lockModal.style.display = 'none';
    
    // عرض قسم المتابعة اليومية
    if (dailyTrackingSection) {
        dailyTrackingSection.style.display = 'block';
    }
    
    // إيقاف العد التنازلي
    const countdownInterval = localStorage.getItem('countdownInterval');
    if (countdownInterval) {
        clearInterval(parseInt(countdownInterval));
        localStorage.removeItem('countdownInterval');
    }
}

// عرض قائمة المرضى للتبديل
async function showPatientList() {
    const patientList = document.getElementById('patient-list');
    const switchModal = document.getElementById('switch-patient-modal');
    
    try {
        // الحصول على جميع المرضى
        const allPatients = await SmartCheckDB.getAllData('patients');
        
        if (allPatients.length === 0) {
            patientList.innerHTML = '<p style="color: #9ca3af; text-align: center;">لا يوجد مرضى محفوظين</p>';
        } else {
            let html = '';
            allPatients.forEach(patient => {
                const flag = getCountryFlag(patient.countryCode);
                html += `
                <div class="patient-item" style="padding: 15px; background: #1e2633; border-radius: 8px; margin-bottom: 10px; cursor: pointer; border: 2px solid transparent;" data-patient-id="${patient.patientId}">
                    <div style="display: flex; justify-content: space-between; align-items: center;">
                        <div>
                            <strong>${patient.name || 'بدون اسم'}</strong>
                            <div style="font-size: 0.9em; color: #9ca3af;">${flag} ${patient.phone}</div>
                            <div style="font-size: 0.85em; color: #6b7280;">آخر زيارة: ${SmartCheckDB.formatDate(patient.lastVisit)}</div>
                        </div>
                        <div style="font-size: 1.5em;">👤</div>
                    </div>
                </div>`;
            });
            patientList.innerHTML = html;
            
            // إضافة أحداث النقر على كل حساب
            document.querySelectorAll('.patient-item').forEach(item => {
                item.addEventListener('click', function() {
                    const patientId = this.getAttribute('data-patient-id');
                    switchToPatient(patientId);
                });
            });
        }
        
        switchModal.style.display = 'flex';
    } catch (error) {
        console.error('❌ خطأ في عرض قائمة المرضى:', error);
        showCustomAlert('😅 حدث خطأ في عرض قائمة المرضى. يرجى المحاولة مرة أخرى', 'error');
    }
}

// الحصول على علم الدولة
function getCountryFlag(countryCode) {
    const flags = {
        'jo': '🇯🇴',
        'sa': '🇸🇦',
        'ae': '🇦🇪',
        'eg': '🇪🇬',
        'kw': '🇰🇼',
        'qa': '🇶🇦',
        'bh': '🇧🇭',
        'om': '🇴🇲',
        'iq': '🇮🇶',
        'sy': '🇸🇾',
        'lb': '🇱🇧',
        'ps': '🇵🇸'
    };
    return flags[countryCode] || '🌍';
}

// التبديل إلى حساب آخر
async function switchToPatient(patientId) {
    try {
        // تسجيل الخروج من الحساب الحالي
        SmartCheckDB.logout();
        
        // تحميل بيانات الحساب الجديد
        const patient = await SmartCheckDB.getPatientProfile(patientId);
        
        if (patient) {
            // حفظ الجلسة الجديدة
            localStorage.setItem('currentPatientId', patient.patientId);
            localStorage.setItem('currentPatientPhone', patient.phone);
            localStorage.setItem('currentPatientCountry', patient.countryCode);
            
            // إخفاء نافذة التبديل
            document.getElementById('switch-patient-modal').style.display = 'none';
            
            // إخفاء نافذة القفل
            document.getElementById('lock-modal').style.display = 'none';
            
            // تحميل بيانات المتابعة
            await loadDailyTrackingData(patient.patientId);
            
            // عرض قسم المتابعة اليومية
            document.getElementById('daily-tracking-section').style.display = 'block';
            
            showCustomAlert(`✅ تم التبديل إلى ${patient.name || 'الحساب'} بنجاح`, 'success');
        } else {
            showCustomAlert('⚠️ لم يتم العثور على الحساب المطلوب. يرجى التحقق من البيانات والمحاولة مرة أخرى', 'error');
        }
    } catch (error) {
        console.error('❌ خطأ في التبديل إلى الحساب:', error);
        showCustomAlert('😅 حدث خطأ في التبديل إلى الحساب. يرجى المحاولة مرة أخرى', 'error');
    }
}

// إضافة حساب جديد
function addNewPatient() {
    // إخفاء نافذة التبديل
    document.getElementById('switch-patient-modal').style.display = 'none';
    
    // تسجيل الخروج من الحساب الحالي
    SmartCheckDB.logout();
    
    // إعادة تعيين الصفحة
    resetAll();
    
    // عرض قسم حفظ البيانات
    document.getElementById('save-data-section').style.display = 'block';
    document.getElementById('save-data-section').scrollIntoView({ behavior: 'smooth' });
}

// فتح لوحة الإدارة
function openAdminPanel() {
    const adminModal = document.getElementById('admin-panel-modal');
    if (adminModal) {
        adminModal.style.display = 'flex';
        // حفظ حالة الإدارة في sessionStorage (محلي للتبويب)
        sessionStorage.setItem('adminPanelOpen', 'true');
    }
}

// تسجيل الدخول للوحة الإدارة
async function adminLogin() {
    const password = document.getElementById('admin-password').value;
    
    // كلمة مرور المدير (يمكن تغييرها)
    const DEFAULT_ADMIN_PASSWORD = 'Jamal@1968';
    const savedPassword = localStorage.getItem('adminPassword');
    const ADMIN_PASSWORD = savedPassword || DEFAULT_ADMIN_PASSWORD;
    
    if (password === ADMIN_PASSWORD) {
        document.getElementById('admin-content').style.display = 'block';
        document.getElementById('admin-password').parentElement.style.display = 'none';
        
        // تحميل قائمة المرضى
        await loadAdminPatientList();
    } else {
        showCustomAlert('⚠️ كلمة المرور غير صحيحة. يرجى التحقق والمحاولة مرة أخرى', 'error');
    }
}

// تحديث لوحة الإحصائيات العامة
function updateStatisticsDashboard(patients, assessments, dailyLogs) {
    const totalPatients = document.getElementById('stat-total-patients');
    const recoveryPlans = document.getElementById('stat-recovery-plans');
    const diagnoses = document.getElementById('stat-diagnoses');
    const dailyLogsCount = document.getElementById('stat-daily-logs');
    
    if (totalPatients) totalPatients.textContent = patients.length;
    
    // حساب عدد المرضى الذين وافقوا على خطة التعافي
    const patientsWithRecovery = patients.filter(p => p.name && p.phone && p.countryCode).length;
    if (recoveryPlans) recoveryPlans.textContent = patientsWithRecovery;
    
    // عدد التشخيصات
    if (diagnoses) diagnoses.textContent = assessments.length;
    
    // عدد السجلات اليومية
    if (dailyLogsCount) dailyLogsCount.textContent = dailyLogs.length;
}

// تحميل قائمة المرضى في لوحة الإدارة
async function loadAdminPatientList() {
    const patientList = document.getElementById('admin-patient-list');
    const searchInput = document.getElementById('patient-search');
    const searchTerm = searchInput ? searchInput.value.toLowerCase() : '';
    
    try {
        const allPatients = await SmartCheckDB.getAllData('patients');
        const allAssessments = await SmartCheckDB.getAllData('assessments');
        const allDailyLogs = await SmartCheckDB.getAllData('dailyLogs');
        
        console.log('📊 عدد المرضى الكلي:', allPatients.length);
        console.log('📊 المرضى:', allPatients);
        console.log('📊 عدد التقييمات:', allAssessments.length);
        console.log('📊 عدد السجلات اليومية:', allDailyLogs.length);
        
        // تحديث الإحصائيات العامة
        updateStatisticsDashboard(allPatients, allAssessments, allDailyLogs);
        
        // تصفية المرضى بناءً على البحث
        const filteredPatients = allPatients.filter(patient => {
            const name = (patient.name || '').toLowerCase();
            const phone = (patient.phone || '').toLowerCase();
            return name.includes(searchTerm) || phone.includes(searchTerm);
        });
        
        if (filteredPatients.length === 0) {
            patientList.innerHTML = '<p style="color: #9ca3af; text-align: center;">لا يوجد مرضى مسجلين' + (searchTerm ? ' تطابق البحث' : '') + '</p>';
        } else {
            // فرز المرضى: من وافق على خطة التعافي أولاً
            const sortedPatients = filteredPatients.sort((a, b) => {
                if (a.acceptedRecoveryPlan && !b.acceptedRecoveryPlan) return -1;
                if (!a.acceptedRecoveryPlan && b.acceptedRecoveryPlan) return 1;
                return new Date(b.lastVisit) - new Date(a.lastVisit);
            });
            
            let html = '';
            for (const patient of sortedPatients) {
                const flag = getCountryFlag(patient.countryCode);
                // الشارة تعتمد على acceptedRecoveryPlan لتحديد المرضى المشتركين
                const recoveryPlanBadge = patient.acceptedRecoveryPlan
                    ? '<span style="background: #10b981; color: white; padding: 2px 8px; border-radius: 4px; font-size: 0.8em; margin-right: 5px;">✓ مشترك</span>'
                    : '<span style="background: #6b7280; color: white; padding: 2px 8px; border-radius: 4px; font-size: 0.8em; margin-right: 5px;">غير مشترك</span>';
                
                const genderEmoji = (patient.gender === 'female' || patient.gender === 'أنثى') ? '👩' : '👨';
                
                // الحصول على آخر تشخيص
                let diagnosisInfo = '';
                const assessments = await SmartCheckDB.getPatientAssessments(patient.patientId);
                if (assessments.length > 0) {
                    const lastAssessment = assessments[assessments.length - 1];
                    const diagnoses = lastAssessment.diagnoses || lastAssessment.diagnosis || [];
                    if (diagnoses.length > 0) {
                        diagnosisInfo = `<div style="font-size: 0.8em; color: #d4af37; margin-top: 5px;">التشخيص: ${diagnoses[0].name} (${diagnoses[0].prob}%)</div>`;
                    }
                }
                
                html += `
                <div class="admin-patient-item" style="padding: 15px; background: #1e2633; border-radius: 8px; margin-bottom: 10px; cursor: pointer; border: 2px solid transparent;" data-patient-id="${patient.patientId}">
                    <div style="display: flex; justify-content: space-between; align-items: center;">
                        <div style="flex: 1;">
                            <strong>${patient.name || 'بدون اسم'}</strong> ${recoveryPlanBadge}
                            <div style="font-size: 0.9em; color: #9ca3af;">${flag} ${patient.phone}</div>
                            <div style="font-size: 0.85em; color: #6b7280;">آخر زيارة: ${SmartCheckDB.formatDate(patient.lastVisit)}</div>
                            ${patient.acceptedPlanDate ? `<div style="font-size: 0.8em; color: #10b981;">تاريخ الموافقة: ${SmartCheckDB.formatDate(patient.acceptedPlanDate)}</div>` : ''}
                            ${diagnosisInfo}
                        </div>
                        <div style="display: flex; align-items: center; gap: 10px;">
                            <div style="font-size: 1.5em;">${genderEmoji}</div>
                            <button class="delete-patient-btn" data-patient-id="${patient.patientId}" style="background: #ef4444; color: white; border: none; padding: 5px 10px; border-radius: 4px; cursor: pointer; font-size: 0.8em;">🗑️ حذف</button>
                        </div>
                    </div>
                </div>`;
            }
            patientList.innerHTML = html;
            
            // إضافة أحداث النقر على كل حساب
            document.querySelectorAll('.admin-patient-item').forEach(item => {
                item.addEventListener('click', function(e) {
                    // إذا تم النقر على زر الحذف، لا تفتح التفاصيل
                    if (e.target.classList.contains('delete-patient-btn')) {
                        e.stopPropagation();
                        const patientId = e.target.getAttribute('data-patient-id');
                        deletePatient(patientId);
                        return;
                    }
                    const patientId = this.getAttribute('data-patient-id');
                    showAdminPatientDetails(patientId);
                });
            });
        }
    } catch (error) {
        console.error('❌ خطأ في تحميل قائمة الحسابات:', error);
        showCustomAlert('😅 حدث خطأ في تحميل قائمة الحسابات. يرجى المحاولة مرة أخرى', 'error');
    }
}

// حذف حساب
async function deletePatient(patientId) {
    // التأكيد الأول
    if (!confirm('هل أنت متأكد من حذف هذا الحساب؟')) {
        return;
    }
    
    // التأكيد الثانوي
    const patientName = prompt('للتأكيد، أدخل اسم المريض للمتابعة، أو اضغط إلغاء للتراجع:');
    if (!patientName) {
        return;
    }
    
    // التحقق من تطابق الاسم
    try {
        const patient = await SmartCheckDB.getPatientProfile(patientId);
        if (!patient) {
            showCustomAlert('⚠️ لم يتم العثور على بيانات المريض. قد يكون الحساب قد تم حذفه', 'error');
            return;
        }
        
        if (patientName !== patient.name) {
            showCustomAlert('⚠️ الاسم غير مطابق. تم إلغاء عملية الحذف لحماية البيانات', 'error');
            return;
        }
        
        // تأكيد نهائي
        if (!confirm('⚠️ تحذير نهائي: سيتم حذف جميع البيانات المرتبطة بهذا الحساب بشكل دائم. هل تريد المتابعة؟')) {
            return;
        }
        
        // حذف جميع البيانات المرتبطة بالحساب
        await SmartCheckDB.deletePatientProfile(patientId);
        
        // إعادة تحميل قائمة الحسابات
        await loadAdminPatientList();
        
        // إخفاء قسم التفاصيل
        document.getElementById('admin-patient-details').style.display = 'none';
        
        showCustomAlert('✅ تم حذف الحساب وجميع بياناته بنجاح', 'success');
    } catch (error) {
        console.error('❌ خطأ في حذف الحساب:', error);
        showCustomAlert('😅 حدث خطأ أثناء حذف الحساب. يرجى المحاولة مرة أخرى', 'error');
    }
}

// عرض تفاصيل الحساب في نافذة مستقلة
async function showAdminPatientDetails(patientId) {
    const detailsDiv = document.getElementById('admin-patient-details');
    const infoDiv = document.getElementById('admin-patient-info');
    const logsDiv = document.getElementById('admin-patient-logs');
    
    try {
        console.log('🔍 جلب بيانات المريض:', patientId);
        const patient = await SmartCheckDB.getPatientProfile(patientId);
        const assessments = await SmartCheckDB.getPatientAssessments(patientId);
        const dailyLogs = await SmartCheckDB.getPatientDailyLogs(patientId);
        
        console.log('📊 بيانات المريض:', patient);
        console.log('📋 التقييمات:', assessments);
        console.log('📅 السجلات اليومية:', dailyLogs);
        
        if (patient) {
            const flag = getCountryFlag(patient.countryCode);
            infoDiv.innerHTML = `
                <h3 style="color: var(--primary-gold); margin-bottom: 15px;">👤 المعلومات الشخصية</h3>
                <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 15px;">
                    <div><strong>الاسم:</strong> ${patient.name || 'غير محدد'}</div>
                    <div><strong>الهاتف:</strong> ${flag} ${patient.phone}</div>
                    <div><strong>الدولة:</strong> ${flag} ${patient.countryCode?.toUpperCase() || 'غير محدد'}</div>
                    <div><strong>العمر:</strong> ${patient.age || 'غير محدد'}</div>
                    <div><strong>الجنس:</strong> ${patient.gender === 'male' ? 'ذكر' : 'أنثى'}</div>
                    <div><strong>الوزن:</strong> ${patient.weight || 'غير محدد'} كغم</div>
                    <div><strong>الطول:</strong> ${patient.height || 'غير محدد'} سم</div>
                    <div><strong>تاريخ التسجيل:</strong> ${SmartCheckDB.formatDate(patient.createdAt)}</div>
                    <div><strong>آخر زيارة:</strong> ${SmartCheckDB.formatDate(patient.lastVisit)}</div>
                    <div><strong>خطة التعافي:</strong> ${patient.acceptedRecoveryPlan ? '✓ موافق' : '✗ غير موافق'}</div>
                    ${patient.acceptedPlanDate ? `<div><strong>تاريخ الموافقة:</strong> ${SmartCheckDB.formatDate(patient.acceptedPlanDate)}</div>` : ''}
                </div>
                
                <!-- قسم تعديل التوقيت -->
                <div style="margin-top: 20px; padding: 15px; background: #1e2633; border-radius: 8px; border: 1px solid #d4af37;">
                    <h4 style="color: var(--primary-gold); margin-bottom: 10px;">⏰ تعديل التوقيت</h4>
                    <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 10px; margin-bottom: 10px;">
                        <div>
                            <label style="color: #9ca3af; font-size: 0.9em;">تاريخ التسجيل:</label>
                            <input type="datetime-local" id="edit-createdAt" value="${patient.createdAt ? new Date(patient.createdAt).toISOString().slice(0, 16) : ''}" style="width: 100%; padding: 8px; background: #0a0e14; border: 1px solid #374151; border-radius: 4px; color: white; margin-top: 5px;">
                        </div>
                        <div>
                            <label style="color: #9ca3af; font-size: 0.9em;">آخر زيارة:</label>
                            <input type="datetime-local" id="edit-lastVisit" value="${patient.lastVisit ? new Date(patient.lastVisit).toISOString().slice(0, 16) : ''}" style="width: 100%; padding: 8px; background: #0a0e14; border: 1px solid #374151; border-radius: 4px; color: white; margin-top: 5px;">
                        </div>
                    </div>
                    <button id="save-timing-btn" data-patient-id="${patientId}" style="background: var(--primary-gold); color: white; padding: 8px 16px; border: none; border-radius: 4px; cursor: pointer; font-size: 0.9em;">💾 حفظ التوقيت</button>
                </div>
                
                <!-- قسم ساعة العد التنازلي -->
                <div style="margin-top: 20px; padding: 15px; background: #1e2633; border-radius: 8px; border: 1px solid #10b981;">
                    <h4 style="color: #10b981; margin-bottom: 10px;">⏱️ ساعة العد التنازلي للمريض</h4>
                    <div id="countdown-display-${patientId}" style="font-size: 2em; font-weight: bold; color: white; text-align: center; margin-bottom: 15px; background: #0a0e14; padding: 15px; border-radius: 8px;">
                        --:--:--
                    </div>
                    <div style="display: grid; grid-template-columns: 1fr 1fr 1fr; gap: 10px; margin-bottom: 10px;">
                        <div>
                            <label style="color: #9ca3af; font-size: 0.9em;">الساعات:</label>
                            <input type="number" id="countdown-hours" min="0" max="23" value="0" style="width: 100%; padding: 8px; background: #0a0e14; border: 1px solid #374151; border-radius: 4px; color: white; margin-top: 5px;">
                        </div>
                        <div>
                            <label style="color: #9ca3af; font-size: 0.9em;">الدقائق:</label>
                            <input type="number" id="countdown-minutes" min="0" max="59" value="0" style="width: 100%; padding: 8px; background: #0a0e14; border: 1px solid #374151; border-radius: 4px; color: white; margin-top: 5px;">
                        </div>
                        <div>
                            <label style="color: #9ca3af; font-size: 0.9em;">الثواني:</label>
                            <input type="number" id="countdown-seconds" min="0" max="59" value="0" style="width: 100%; padding: 8px; background: #0a0e14; border: 1px solid #374151; border-radius: 4px; color: white; margin-top: 5px;">
                        </div>
                    </div>
                    <button id="set-countdown-btn" data-patient-id="${patientId}" style="background: #10b981; color: white; padding: 8px 16px; border: none; border-radius: 4px; cursor: pointer; font-size: 0.9em;">⏰ تعديل وقت العد التنازلي</button>
                </div>
            `;
            
            if (assessments.length > 0) {
                let assessmentsHtml = '<h3 style="color: var(--primary-gold); margin-bottom: 15px;">📊 التقييمات السابقة</h3>';
                assessments.forEach(assessment => {
                    const diagnoses = assessment.diagnoses || assessment.diagnosis || [];
                    const diagnosisName = diagnoses.length > 0 ? diagnoses[0].name : 'غير محدد';
                    const diagnosisProb = diagnoses.length > 0 ? diagnoses[0].prob || 0 : 0;
                    
                    // حساب الثقة
                    const confidence = diagnosisProb > 0 ? Math.min(100, diagnosisProb + 15) : 0;
                    
                    assessmentsHtml += `
                    <div style="background: #0a0e14; padding: 20px; border-radius: 8px; margin-bottom: 15px;">
                        <div style="font-size: 0.9em; color: #9ca3af;">${SmartCheckDB.formatDate(assessment.createdAt)}</div>
                        <div style="font-weight: bold; margin: 5px 0; font-size: 1.1em;">منطقة الألم: ${assessment.painArea || 'غير محدد'}</div>
                        
                        <!-- التشخيص الرئيسي -->
                        <div style="background: #1e2633; padding: 15px; border-radius: 6px; margin: 10px 0;">
                            <div style="font-weight: bold; color: var(--primary-gold); margin-bottom: 5px;">التشخيص الرئيسي: ${diagnosisName} (${diagnosisProb}%) | الثقة: ${confidence}%</div>
                        </div>
                        
                        <!-- التشخيص التفاضلي -->
                        <div style="margin: 10px 0;">
                            <div style="font-weight: bold; color: #9ca3af; margin-bottom: 5px;">🔍 التشخيص التفاضلي (نسب الاحتمال)</div>
                            ${diagnoses.map(d => `<div style="font-size: 0.85em; color: #6b7280;">• ${d.name} - احتمالية: ${d.prob}%</div>`).join('')}
                        </div>
                        
                        <!-- معلومات إضافية -->
                        <div style="margin-top: 15px; padding-top: 15px; border-top: 1px solid #1e2633;">
                            <div style="font-size: 0.8em; color: #6b7280;">الشدة: ${assessment.severity || 'غير محدد'}</div>
                            <div style="font-size: 0.8em; color: #6b7280;">المدة: ${assessment.duration || 'غير محدد'}</div>
                            <div style="font-size: 0.8em; color: #6b7280;">النمط: ${assessment.pattern ? JSON.stringify(assessment.pattern) : 'غير محدد'}</div>
                        </div>
                        
                        <!-- الأسئلة التي أجاب عليها -->
                        ${assessment.answers ? `
                        <div style="margin-top: 10px; padding-top: 10px; border-top: 1px solid #1e2633;">
                            <strong style="font-size: 0.8em; color: #9ca3af;">الأسئلة التي أجاب عليها:</strong>
                            <div style="font-size: 0.75em; color: #6b7280; margin-top: 5px;">
                                ${Object.entries(assessment.answers).map(([key, value]) => 
                                    `<div>• ${key}: ${Array.isArray(value) ? value.join(', ') : value}</div>`
                                ).join('')}
                            </div>
                        </div>
                        ` : ''}
                    </div>`;
                });
                infoDiv.innerHTML += assessmentsHtml;
            } else {
                infoDiv.innerHTML += '<p style="color: #9ca3af; margin-top: 20px;">لا توجد تقييمات سابقة</p>';
            }
            
            if (dailyLogs.length > 0) {
                let logsHtml = '<h3 style="color: var(--primary-gold); margin-bottom: 15px;">📅 السجلات اليومية</h3>';
                dailyLogs.forEach(log => {
                    logsHtml += `
                    <div style="background: #0a0e14; padding: 15px; border-radius: 8px; margin-bottom: 10px;">
                        <div style="font-size: 0.9em; color: #9ca3af;">${SmartCheckDB.formatDate(log.date)}</div>
                        <div style="font-weight: bold; margin: 5px 0;">نسبة الألم: ${log.painScore}/10</div>
                        <div style="font-size: 0.85em;">نسبة الحركة: ${log.movementScore}/10</div>
                        <div style="font-size: 0.8em; color: #6b7280;">دقائق المشي: ${log.walkingMinutes || 0}</div>
                        <div style="font-size: 0.8em; color: #6b7280;">جودة النوم: ${log.sleepQuality || 0}/10</div>
                        <div style="font-size: 0.8em; color: #6b7280;">التمارين: ${log.exerciseCompleted ? '✅' : '❌'}</div>
                        <div style="font-size: 0.8em; color: #6b7280;">المشي: ${log.walkingDone ? '✅' : '❌'}</div>
                        <div style="font-size: 0.8em; color: #6b7280;">الإطالة: ${log.stretchingDone ? '✅' : '❌'}</div>
                        <div style="font-size: 0.8em; color: #6b7280;">العلاج الحراري: ${log.heatTherapy ? '✅' : '❌'}</div>
                        <div style="font-size: 0.8em; color: #6b7280;">الوضعية الجيدة: ${log.goodPosture ? '✅' : '❌'}</div>
                        <div style="font-size: 0.8em; color: #6b7280;">انتشار الألم: ${log.painRadiation ? 'نعم' : 'لا'}</div>
                        <div style="font-size: 0.8em; color: #6b7280;">الراحة الكافية: ${log.restEnough ? 'نعم' : 'لا'}</div>
                        <div style="font-size: 0.8em; color: #6b7280;">الجلوس الطويل: ${log.longSitting ? 'نعم' : 'لا'}</div>
                        <div style="font-size: 0.8em; color: #6b7280;">المشي الزائد: ${log.excessiveWalking ? 'نعم' : 'لا'}</div>
                        <div style="font-size: 0.8em; color: #6b7280;">رفع الأشياء الثقيلة: ${log.heavyLifting ? 'نعم' : 'لا'}</div>
                        <div style="font-size: 0.8em; color: #6b7280;">استخدام الهاتف: ${log.phoneUsage ? 'نعم' : 'لا'}</div>
                        <div style="font-size: 0.8em; color: #6b7280;">النوم السيء: ${log.poorSleep ? 'نعم' : 'لا'}</div>
                        ${log.notes ? `<div style="font-size: 0.8em; color: #6b7280; margin-top: 5px;">ملاحظات: ${log.notes}</div>` : ''}
                    </div>`;
                });
                logsDiv.innerHTML = logsHtml;
            } else {
                logsDiv.innerHTML = '<p style="color: #9ca3af;">لا توجد سجلات يومية</p>';
            }
            
            // ربط زر حذف الحساب
            const deleteBtn = document.getElementById('delete-patient-btn');
            if (deleteBtn) {
                deleteBtn.onclick = () => deletePatient(patientId);
            }
            
            // ربط زر حفظ التوقيت
            const saveTimingBtn = document.getElementById('save-timing-btn');
            if (saveTimingBtn) {
                saveTimingBtn.onclick = async () => {
                    const createdAt = document.getElementById('edit-createdAt').value;
                    const lastVisit = document.getElementById('edit-lastVisit').value;
                    
                    if (createdAt || lastVisit) {
                        const updateData = {};
                        if (createdAt) updateData.createdAt = new Date(createdAt).toISOString();
                        if (lastVisit) updateData.lastVisit = new Date(lastVisit).toISOString();
                        
                        await SmartCheckDB.updatePatientProfile(patientId, updateData);
                        showCustomAlert('✅ تم تحديث التوقيت بنجاح', 'success');
                        showAdminPatientDetails(patientId); // إعادة تحميل التفاصيل
                    } else {
                        showCustomAlert('⚠️ يرجى إدخال تاريخ واحد على الأقل', 'warning');
                    }
                };
            }
            
            // ربط زر تعديل وقت العد التنازلي
            const setCountdownBtn = document.getElementById('set-countdown-btn');
            if (setCountdownBtn) {
                setCountdownBtn.onclick = async () => {
                    const hours = parseInt(document.getElementById('countdown-hours').value) || 0;
                    const minutes = parseInt(document.getElementById('countdown-minutes').value) || 0;
                    const seconds = parseInt(document.getElementById('countdown-seconds').value) || 0;
                    
                    const totalSeconds = hours * 3600 + minutes * 60 + seconds;
                    const sessionInterval = parseInt(localStorage.getItem('sessionInterval')) || 24;
                    
                    if (totalSeconds > 0) {
                        // جلب السجلات اليومية للمريض
                        const logs = await SmartCheckDB.getPatientDailyLogs(patientId);
                        const currentSession = logs.length + 1;
                        const now = new Date();
                        
                        // حساب وقت بدء الجلسة الجديد
                        const newSessionStartTime = new Date(now.getTime() - (sessionInterval * 3600 * 1000) + (totalSeconds * 1000));
                        
                        // تحديث sessionStartTimeKey للجلسة الحالية
                        const sessionStartTimeKey = `sessionStartTime_${patientId}_${currentSession}`;
                        localStorage.setItem(sessionStartTimeKey, newSessionStartTime.toISOString());
                        console.log('✅ تم تحديث sessionStartTimeKey للجلسة الحالية:', sessionStartTimeKey, newSessionStartTime.toISOString());
                        
                        // إعادة حساب جميع sessionStartTimeKeys للجلسات السابقة
                        // هذا يضمن أن الجلسات التالية لن تتخبط
                        for (let i = 1; i <= logs.length; i++) {
                            const sessionKey = `sessionStartTime_${patientId}_${i}`;
                            const sessionStart = new Date(newSessionStartTime.getTime() - ((currentSession - i) * sessionInterval * 3600 * 1000));
                            localStorage.setItem(sessionKey, sessionStart.toISOString());
                            console.log(`✅ تم تحديث sessionStartTimeKey للجلسة ${i}:`, sessionKey, sessionStart.toISOString());
                        }
                        
                        if (logs.length > 0) {
                            // تعديل تاريخ آخر سجل يومي
                            const lastLog = logs[logs.length - 1];
                            const newLogDate = new Date(now.getTime() - (sessionInterval * 3600 * 1000) + (totalSeconds * 1000));
                            
                            // تحديث تاريخ آخر سجل
                            await SmartCheckDB.updateDailyLog(lastLog.logId, {
                                date: newLogDate.toISOString()
                            });
                            
                            // تحديث تواريخ جميع السجلات السابقة للحفاظ على التسلسل الزمني
                            for (let i = 0; i < logs.length - 1; i++) {
                                const logDate = new Date(newLogDate.getTime() - ((logs.length - 1 - i) * sessionInterval * 3600 * 1000));
                                await SmartCheckDB.updateDailyLog(logs[i].logId, {
                                    date: logDate.toISOString()
                                });
                            }
                            
                            showCustomAlert('✅ تم تعديل وقت العد التنازلي بنجاح', 'success');
                        } else {
                            // إذا لم يوجد سجلات، تعديل تاريخ التسجيل
                            const newRegistrationDate = new Date(now.getTime() - (sessionInterval * 3600 * 1000) + (totalSeconds * 1000));
                            
                            await SmartCheckDB.updatePatientProfile(patientId, {
                                createdAt: newRegistrationDate.toISOString()
                            });
                            
                            showCustomAlert('✅ تم تعديل وقت العد التنازلي بنجاح', 'success');
                        }
                        
                        // إرسال إشعار لجميع التبويبات لإعادة حساب الساعة
                        localStorage.setItem('countdownUpdated', Date.now().toString());
                        
                        // تحديث الساعة في لوحة الإدارة
                        updateAdminCountdown(patientId, patient);
                    } else {
                        showCustomAlert('⚠️ يرجى إدخال وقت صحيح', 'warning');
                    }
                };
            }
            
            // تحميل وعرض ساعة العد التنازلي للمريض
            updateAdminCountdown(patientId, patient);
            
            detailsDiv.style.display = 'block';
            detailsDiv.scrollIntoView({ behavior: 'smooth' });
        }
    } catch (error) {
        console.error('❌ خطأ في عرض تفاصيل الحساب:', error);
        alert('😅 حدث خطأ في عرض تفاصيل الحساب. يرجى المحاولة مرة أخرى.');
    }
}

// دالة إنشاء تمارين متغيرة لكل يوم
async function generateDailyExercises(sessionNumber, painArea, diagnoses, symptoms = [], recoveryStage = 'beginner') {
    // تحويل نقطة الألم إلى منطقة مناسبة لقاعدة البيانات
    const painAreaMapping = {
        // الفقرات العنقية
        'c1': 'cervical', 'c2': 'cervical', 'c3': 'cervical', 'c4': 'cervical',
        'c5': 'cervical', 'c6': 'cervical', 'c7': 'cervical',
        'neck': 'cervical', 'cervical': 'cervical',
        'الرقبة': 'cervical', 'العنق': 'cervical', 'فقرات العنق': 'cervical',
        
        // الفقرات الصدرية
        't1': 'thoracic', 't2': 'thoracic', 't3': 'thoracic', 't4': 'thoracic',
        't5': 'thoracic', 't6': 'thoracic', 't7': 'thoracic', 't8': 'thoracic',
        't9': 'thoracic', 't10': 'thoracic', 't11': 'thoracic', 't12': 'thoracic',
        'thoracic': 'thoracic', 'upper_back': 'thoracic',
        'الظهر العلوي': 'thoracic', 'فقرات الصدر': 'thoracic', 'الصدر': 'thoracic',
        
        // الفقرات القطنية
        'l1': 'lumbar', 'l2': 'lumbar', 'l3': 'lumbar', 'l4': 'lumbar', 'l5': 'lumbar',
        'lumbar': 'lumbar', 'lower_back': 'lumbar',
        'الظهر السفلي': 'lumbar', 'فقرات القطنية': 'lumbar', 'أسفل الظهر': 'lumbar',
        
        // الكتف
        'shoulder': 'shoulder', 'shoulder_left': 'shoulder', 'shoulder_right': 'shoulder',
        'الكتف': 'shoulder', 'الكتف الأيمن': 'shoulder', 'الكتف الأيسر': 'shoulder',
        'لوح الكتف الأيمن': 'shoulder', 'لوح الكتف الأيسر': 'shoulder', 'لوح الكتف': 'shoulder',
        
        // الورك
        'hip': 'hip', 'hip_left': 'hip', 'hip_right': 'hip',
        'الورك': 'hip', 'الورك الأيمن': 'hip', 'الورك الأيسر': 'hip',
        
        // الركبة
        'knee': 'knee', 'knee_left': 'knee', 'knee_right': 'knee',
        'الركبة': 'knee', 'الركبة اليمنى': 'knee', 'الركبة اليسرى': 'knee',
        
        // الكوع
        'elbow': 'elbow', 'elbow_left': 'elbow', 'elbow_right': 'elbow',
        'الكوع': 'elbow', 'الكوع الأيمن': 'elbow', 'الكوع الأيسر': 'elbow',
        
        // الرسغ
        'wrist': 'wrist', 'wrist_left': 'wrist', 'wrist_right': 'wrist',
        'الرسغ': 'wrist', 'الرسغ الأيمن': 'wrist', 'الرسغ الأيسر': 'wrist',
        
        // الكاحل
        'ankle': 'ankle', 'ankle_left': 'ankle', 'ankle_right': 'ankle',
        'الكاحل': 'ankle', 'الكاحل الأيمن': 'ankle', 'الكاحل الأيسر': 'ankle'
    };
    
    const mappedArea = painAreaMapping[painArea] || 'lumbar';
    
    // الحصول على التمارين من قاعدة البيانات
    const exercises = getExercisesForPatient(mappedArea, symptoms, diagnoses, recoveryStage);
    
    // إذا لم يتم العثور على تمارين، استخدم تمارين عامة
    if (exercises.length === 0) {
        return {
            stretching: [
                { name: 'تمديد العضلات الخلفية', duration: '30 ثانية', reps: '3 مرات', description: 'تمديد عام للعضلات', instructions: 'قم بتمديد العضلات ببطء', warnings: 'لا تفرط في التمدد', benefits: 'يحسن المرونة' }
            ],
            strengthening: [
                { name: 'رفع الساق', duration: '10 ثواني', reps: '10 مرات', description: 'تقوية عامة', instructions: 'ارفع ساقك ببطء', warnings: 'لا ترفع بقوة', benefits: 'يقوي العضلات' }
            ],
            mobility: [
                { name: 'دوران الرقبة', duration: 'دورة كاملة', reps: '5 مرات', description: 'تحسين الحركة', instructions: 'در رأسك ببطء', warnings: 'لا تفرط في الدوران', benefits: 'يحسن الحركة' }
            ],
            relaxation: [
                { name: 'تنفس عميق', duration: '5 دقائق', reps: 'مستمر', description: 'استرخاء عام', instructions: 'تنفس بعمق', warnings: 'لا تحبس أنفاسك', benefits: 'يقلل التوتر' }
            ]
        };
    }
    
    // تقسيم التمارين إلى فئات
    const categorizedExercises = {
        stretching: [],
        strengthening: [],
        mobility: [],
        relaxation: []
    };
    
    // توزيع التمارين على الفئات بناءً على نوعها
    exercises.forEach((exercise, index) => {
        const categoryIndex = index % 4;
        const categories = ['stretching', 'strengthening', 'mobility', 'relaxation'];
        categorizedExercises[categories[categoryIndex]].push(exercise);
    });
    
    // التأكد من وجود تمارين في كل فئة
    if (categorizedExercises.stretching.length === 0) {
        categorizedExercises.stretching.push(exercises[0] || { name: 'تمديد عام', duration: '30 ثانية', reps: '3 مرات', description: 'تمديد عام', instructions: 'تمدد ببطء', warnings: 'لا تفرط', benefits: 'يحسن المرونة' });
    }
    if (categorizedExercises.strengthening.length === 0) {
        categorizedExercises.strengthening.push(exercises[1] || { name: 'تقوية عامة', duration: '10 ثواني', reps: '10 مرات', description: 'تقوية عامة', instructions: 'قوِ ببطء', warnings: 'لا تفرط', benefits: 'يقوي العضلات' });
    }
    if (categorizedExercises.mobility.length === 0) {
        categorizedExercises.mobility.push(exercises[2] || { name: 'حركة عامة', duration: 'دورة كاملة', reps: '5 مرات', description: 'حركة عامة', instructions: 'تحرك ببطء', warnings: 'لا تفرط', benefits: 'يحسن الحركة' });
    }
    if (categorizedExercises.relaxation.length === 0) {
        categorizedExercises.relaxation.push(exercises[3] || { name: 'استرخاء عام', duration: '5 دقائق', reps: 'مستمر', description: 'استرخاء عام', instructions: 'استرخِ', warnings: 'لا تحبس', benefits: 'يقلل التوتر' });
    }
    
    return categorizedExercises;
}

// دالة عرض التمارين اليومية المتجددة بتصميم تشريحي عالي الدقة وفاخر
function displayDailyExercises(dailyExercises) {
    const renderCard = (ex, typeName, typeColor) => {
        const anatIllustration = getExerciseVisualIcon(ex.name);
        const durationSec = parseInt(ex.duration) || 30;
        
        return `
        <div class="exercise-visual-card" style="background: #111827; border: 1px solid rgba(212, 175, 55, 0.35); border-radius: 14px; padding: 18px; display: flex; flex-direction: column; justify-content: space-between; box-shadow: 0 8px 24px rgba(0,0,0,0.4); margin-bottom: 16px;">
            <div>
                <!-- الرسم التشريحي الطبي -->
                ${anatIllustration}

                <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 8px;">
                    <span style="font-size: 0.75em; background: ${typeColor}; color: #ffffff; padding: 3px 8px; border-radius: 4px; font-weight: bold;">${typeName}</span>
                    <span style="font-size: 0.75em; background: rgba(212, 175, 55, 0.15); border: 1px solid var(--primary-gold); color: var(--primary-gold); padding: 3px 8px; border-radius: 4px;">خطة اليوم</span>
                </div>

                <h3 style="margin: 6px 0 6px 0; color: #ffffff; font-size: 1.15em; font-weight: bold;">${ex.name}</h3>
                ${ex.scientificName ? `<div style="font-size: 0.8em; color: #94a3b8; font-style: italic; margin-bottom: 10px;">${ex.scientificName}</div>` : ''}

                ${ex.description ? `<p style="font-size: 0.85em; color: #cbd5e1; margin: 0 0 10px 0; line-height: 1.5;">${ex.description}</p>` : ''}

                ${ex.instructions ? `
                <div style="margin-bottom: 12px; background: rgba(30, 41, 59, 0.7); border-right: 3px solid var(--primary-gold); padding: 10px 12px; border-radius: 6px;">
                    <div style="font-size: 0.85em; color: var(--primary-gold); font-weight: bold; margin-bottom: 6px;">📋 طريقة التطبيق:</div>
                    <div style="font-size: 0.85em; color: #e2e8f0; white-space: pre-line; line-height: 1.6;">${ex.instructions}</div>
                </div>` : ''}

                <div style="display: flex; gap: 8px; flex-wrap: wrap; margin-bottom: 12px;">
                    <span style="background: #1e2633; border: 1px solid rgba(212, 175, 55, 0.3); color: #d4af37; font-size: 0.8em; padding: 4px 8px; border-radius: 4px; font-weight: 600;">⏱️ ${ex.duration || '30 ثانية'}</span>
                    <span style="background: #1e2633; border: 1px solid rgba(16, 185, 129, 0.3); color: #10b981; font-size: 0.8em; padding: 4px 8px; border-radius: 4px; font-weight: 600;">🔁 ${ex.reps || '10 تكرارات'}</span>
                </div>

                ${ex.benefits ? `<div style="font-size: 0.82em; color: #10b981; margin-bottom: 6px;">✨ <strong>الفائدة:</strong> ${ex.benefits}</div>` : ''}
                ${ex.warnings ? `<div style="font-size: 0.8em; color: #fca5a5; background: rgba(239, 68, 68, 0.1); padding: 6px 10px; border-radius: 4px; margin-bottom: 10px;">⚠️ <strong>تحذير:</strong> ${ex.warnings}</div>` : ''}
            </div>

            <!-- مؤقت التمرين التفاعلي -->
            <div style="margin-top: 10px; border-top: 1px solid rgba(212, 175, 55, 0.2); padding-top: 12px;">
                <div style="background: #1e2633; height: 5px; border-radius: 3px; overflow: hidden; margin-bottom: 8px;">
                    <div class="timer-progress-bar" style="background: linear-gradient(90deg, #d4af37 0%, #10b981 100%); height: 100%; width: 0%; transition: width 1s linear;"></div>
                </div>
                <button type="button" onclick="toggleExerciseTimer(this, ${durationSec})" class="btn-exercise-timer" data-running="false" data-remaining="${durationSec}" data-total="${durationSec}" style="width: 100%; background: linear-gradient(135deg, #d4af37 0%, #aa820a 100%); color: #0a0e14; border: none; padding: 8px 12px; border-radius: 6px; font-weight: bold; cursor: pointer; font-size: 0.9em; transition: 0.2s;">
                    ⏱️ ابدأ مؤقت التمرين (${durationSec} ثانية)
                </button>
            </div>
        </div>`;
    };

    let exercisesHtml = `
        <div style="background: linear-gradient(135deg, #1e2633 0%, #2d3748 100%); border-radius: 16px; padding: 25px; margin-bottom: 30px; border: 2px solid var(--primary-gold); box-shadow: 0 8px 32px rgba(212, 175, 55, 0.15);">
            <div style="text-align: center; margin-bottom: 20px;">
                <div style="font-size: 2.2em; margin-bottom: 8px;">🏋️</div>
                <h3 style="color: var(--primary-gold); margin: 0; font-size: 1.5em; font-weight: bold;">التمارين العلاجية المخصصة لليوم</h3>
                <div style="color: #94a3b8; margin-top: 6px;">تمارين متجددة وموجهة سريرياً لتحفيز الشفاء السريع</div>
            </div>
            
            <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(300px, 1fr)); gap: 18px;">
                ${dailyExercises.stretching.map(ex => renderCard(ex, '🧘 تمرين إطالة', '#10b981')).join('')}
                ${dailyExercises.strengthening.map(ex => renderCard(ex, '💪 تمرين تقوية', '#f59e0b')).join('')}
                ${(dailyExercises.mobility || []).map(ex => renderCard(ex, '🔄 تمرين حركة', '#38bdf8')).join('')}
                ${(dailyExercises.relaxation || []).map(ex => renderCard(ex, '😌 تمرين استرخاء', '#8b5cf6')).join('')}
            </div>
        </div>
    `;
    
    return exercisesHtml;
}

// دالة إنشاء تقرير احترافي للمريض

function generateProfessionalReport(patient, diagnoses, painArea, bmi) {
    const bmiValue = bmi ? bmi.toFixed(1) : 'غير محدد';
    const bmiStatus = bmi ? (bmi < 18.5 ? 'نحافة' : bmi < 25 ? 'وزن طبيعي' : bmi < 30 ? 'زيادة وزن' : 'سمنة') : 'غير محدد';
    const bmiColor = bmi ? (bmi < 18.5 ? '#3b82f6' : bmi < 25 ? '#10b981' : bmi < 30 ? '#f59e0b' : '#ef4444') : '#6b7280';
    
    let diagnosesHtml = '';
    if (diagnoses && diagnoses.length > 0) {
        diagnosesHtml = diagnoses.map(d => `
            <div style="background: #1e2633; padding: 15px; border-radius: 8px; margin-bottom: 10px; border-right: 4px solid #d4af37;">
                <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 8px;">
                    <strong style="color: #d4af37; font-size: 1.1em;">${d.name}</strong>
                    <span style="background: #d4af37; color: #0a0e14; padding: 4px 12px; border-radius: 20px; font-weight: bold; font-size: 0.9em;">${d.prob}%</span>
                </div>
                <div style="background: #0a0e14; height: 8px; border-radius: 4px; overflow: hidden;">
                    <div style="background: linear-gradient(90deg, #d4af37 0%, #f59e0b 100%); width: ${d.prob}%; height: 100%;"></div>
                </div>
            </div>
        `).join('');
    } else {
        diagnosesHtml = '<div style="color: #9ca3af; text-align: center; padding: 20px;">لا توجد تشخيصات محفوظة</div>';
    }
    
    const reportHtml = `
        <div id="professional-report" style="background: linear-gradient(135deg, #1e2633 0%, #2d3748 100%); border-radius: 16px; padding: 30px; margin-bottom: 30px; border: 2px solid #d4af37; box-shadow: 0 8px 32px rgba(212, 175, 55, 0.2);">
            <!-- رأس التقرير -->
            <div style="text-align: center; margin-bottom: 30px; padding-bottom: 20px; border-bottom: 2px solid #d4af37;">
                <div style="margin-bottom: 10px;">
                    <img src="assets/logo.png" alt="Smart Check Pro" style="width: 80px; height: auto; border-radius: 8px;">
                </div>
                <h2 style="color: #d4af37; margin: 0; font-size: 1.8em;">تقرير طبي احترافي</h2>
                <div style="color: #9ca3af; margin-top: 8px;">Smart Check Pro - نظام التشخيص الذكي</div>
                <div style="color: #6b7280; font-size: 0.9em; margin-top: 5px;">${new Date().toLocaleDateString('ar-SA', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</div>
            </div>
            
            <!-- معلومات المريض -->
            <div style="background: #0a0e14; border-radius: 12px; padding: 20px; margin-bottom: 25px;">
                <h3 style="color: #d4af37; margin: 0 0 20px 0; font-size: 1.3em; border-bottom: 2px solid #d4af37; padding-bottom: 10px;">👤 معلومات المريض</h3>
                <div style="display: grid; grid-template-columns: repeat(2, 1fr); gap: 15px;">
                    <div>
                        <div style="color: #9ca3af; font-size: 0.9em; margin-bottom: 5px;">الاسم</div>
                        <div style="color: white; font-size: 1.1em; font-weight: bold;">${patient.name || 'غير محدد'}</div>
                    </div>
                    <div>
                        <div style="color: #9ca3af; font-size: 0.9em; margin-bottom: 5px;">العمر</div>
                        <div style="color: white; font-size: 1.1em; font-weight: bold;">${patient.age || 'غير محدد'} سنة</div>
                    </div>
                    <div>
                        <div style="color: #9ca3af; font-size: 0.9em; margin-bottom: 5px;">الجنس</div>
                        <div style="color: white; font-size: 1.1em; font-weight: bold;">${patient.gender === 'male' ? 'ذكر' : 'أنثى'}</div>
                    </div>
                    <div>
                        <div style="color: #9ca3af; font-size: 0.9em; margin-bottom: 5px;">نقطة الألم</div>
                        <div style="color: #ef4444; font-size: 1.1em; font-weight: bold;">${painArea || 'غير محدد'}</div>
                    </div>
                    <div>
                        <div style="color: #9ca3af; font-size: 0.9em; margin-bottom: 5px;">الوزن</div>
                        <div style="color: white; font-size: 1.1em; font-weight: bold;">${patient.weight || 'غير محدد'} كغم</div>
                    </div>
                    <div>
                        <div style="color: #9ca3af; font-size: 0.9em; margin-bottom: 5px;">الطول</div>
                        <div style="color: white; font-size: 1.1em; font-weight: bold;">${patient.height || 'غير محدد'} سم</div>
                    </div>
                </div>
                
                <!-- مؤشر كتلة الجسم -->
                <div style="margin-top: 20px; padding: 15px; background: #1e2633; border-radius: 8px; border: 2px solid ${bmiColor};">
                    <div style="display: flex; justify-content: space-between; align-items: center;">
                        <div>
                            <div style="color: #9ca3af; font-size: 0.9em;">مؤشر كتلة الجسم (BMI)</div>
                            <div style="color: white; font-size: 1.5em; font-weight: bold; margin-top: 5px;">${bmiValue} <span style="font-size: 0.8em; color: ${bmiColor};">kg/m²</span></div>
                        </div>
                        <div style="text-align: right;">
                            <div style="color: ${bmiColor}; font-size: 1.2em; font-weight: bold;">${bmiStatus}</div>
                        </div>
                    </div>
                </div>
            </div>
            
            <!-- التشخيصات -->
            <div style="background: #0a0e14; border-radius: 12px; padding: 20px;">
                <h3 style="color: #d4af37; margin: 0 0 20px 0; font-size: 1.3em; border-bottom: 2px solid #d4af37; padding-bottom: 10px;">🔬 التشخيصات الطبية</h3>
                ${diagnosesHtml}
            </div>
        </div>
    `;
    
    return reportHtml;
}

// دالة تحديث ساعة العد التنازلي في لوحة الإدارة
async function updateAdminCountdown(patientId, patient) {
    const countdownDisplay = document.getElementById(`countdown-display-${patientId}`);
    if (!countdownDisplay) return;
    
    // استخدام نفس منطق صفحة المريض لحساب العد التنازلي
    const sessionInterval = parseInt(localStorage.getItem('sessionInterval')) || 24;
    
    // جلب السجلات اليومية للمريض
    const logs = await SmartCheckDB.getPatientDailyLogs(patientId);
    const currentSession = logs.length + 1;
    
    // استخدام sessionStartTimeKey مثل صفحة المريض
    const sessionStartTimeKey = `sessionStartTime_${patientId}_${currentSession}`;
    let sessionStartTime = localStorage.getItem(sessionStartTimeKey);
    
    const updateCountdown = () => {
        let startDate;
        let sessionText;
        
        // إعادة قراءة sessionStartTime من localStorage للحصول على أحدث قيمة
        sessionStartTime = localStorage.getItem(sessionStartTimeKey);
        
        if (sessionStartTime) {
            // استخدام وقت بدء الجلسة المحفوظ
            startDate = new Date(sessionStartTime);
            sessionText = `الجلسة ${currentSession}`;
        } else {
            // إذا لم يوجد وقت محفوظ، استخدام تاريخ التسجيل
            const registrationDate = patient.createdAt || patient.acceptedPlanDate;
            if (!registrationDate) {
                countdownDisplay.innerHTML = '⚠️ لا يوجد تاريخ تسجيل';
                countdownDisplay.style.color = '#f59e0b';
                return;
            }
            startDate = new Date(registrationDate);
            sessionText = 'الجلسة 1';
        }
        
        const now = new Date();
        const elapsed = (now - startDate) / (1000 * 60 * 60);
        const remaining = sessionInterval - elapsed;
        
        if (remaining <= 0) {
            countdownDisplay.innerHTML = `⏰ انتهى الوقت<br><small>${sessionText}</small>`;
            countdownDisplay.style.color = '#10b981';
            return;
        }
        
        const hours = Math.floor(remaining);
        const minutes = Math.floor((remaining - hours) * 60);
        const seconds = Math.floor(((remaining - hours) * 60 - minutes) * 60);
        
        countdownDisplay.innerHTML = `${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}<br><small>${sessionText}</small>`;
        countdownDisplay.style.color = '#10b981';
    };
    
    updateCountdown();
    const interval = setInterval(updateCountdown, 1000);
    
    // إيقاف التحديث عند إغلاق التفاصيل
    const closeBtn = document.getElementById('close-patient-details-btn');
    if (closeBtn) {
        const originalOnClick = closeBtn.onclick;
        closeBtn.onclick = () => {
            clearInterval(interval);
            if (originalOnClick) originalOnClick();
        };
    }
}

// تسجيل الخروج من لوحة الإدارة
function adminLogout() {
    document.getElementById('admin-content').style.display = 'none';
    document.getElementById('admin-password').parentElement.style.display = 'block';
    document.getElementById('admin-password').value = '';
    document.getElementById('admin-patient-details').style.display = 'none';
    document.getElementById('admin-panel-modal').style.display = 'none';
    // إزالة حالة الإدارة من sessionStorage
    sessionStorage.setItem('adminPanelOpen', 'false');
}

// تغيير كلمة مرور المدير
function changeAdminPassword() {
    const currentPassword = document.getElementById('current-password').value;
    const newPassword = document.getElementById('new-password').value;
    const confirmPassword = document.getElementById('confirm-password').value;
    
    // كلمة مرور المدير الحالية
    const ADMIN_PASSWORD = 'Jamal@1968';
    
    if (currentPassword !== ADMIN_PASSWORD) {
        alert('⚠️ كلمة المرور الحالية غير صحيحة. يرجى التحقق والمحاولة مرة أخرى.');
        return;
    }
    
    if (newPassword.length < 6) {
        alert('⚠️ كلمة المرور الجديدة يجب أن تكون 6 أحرف على الأقل لضمان الأمان.');
        return;
    }
    
    if (newPassword !== confirmPassword) {
        alert('⚠️ كلمة المرور الجديدة غير متطابقة مع التأكيد. يرجى التحقق من الإدخال.');
        return;
    }
    
    // حفظ الباسورد الجديد في localStorage
    localStorage.setItem('adminPassword', newPassword);
    
    // إغلاق النافذة وتنظيف الحقول
    document.getElementById('change-password-modal').style.display = 'none';
    document.getElementById('current-password').value = '';
    document.getElementById('new-password').value = '';
    document.getElementById('confirm-password').value = '';
    
    alert('✅ تم تغيير الباسورد بنجاح');
}

// إضافة حساب جديد
async function addNewPatient() {
    const name = document.getElementById('new-patient-name').value.trim();
    const phone = document.getElementById('new-patient-phone').value.trim();
    const countryCode = document.getElementById('new-patient-country').value;
    
    if (!name) {
        alert('⚠️ يرجى إدخال اسم المريض لإتمام عملية الإضافة');
        return;
    }
    
    if (!phone) {
        alert('⚠️ يرجى إدخال رقم الهاتف لإتمام عملية الإضافة');
        return;
    }
    
    try {
        // تسجيل الدخول أو إنشاء ملف جديد
        const patient = await SmartCheckDB.login(phone, countryCode);
        
        // تحديث الاسم
        await SmartCheckDB.updatePatientProfile(patient.patientId, { name: name });
        
        // إغلاق النافذة وتنظيف الحقول
        document.getElementById('add-patient-modal').style.display = 'none';
        document.getElementById('new-patient-name').value = '';
        document.getElementById('new-patient-phone').value = '';
        
        // إعادة تحميل قائمة الحسابات
        await loadAdminPatientList();
        
        alert('✅ تم إضافة الحساب بنجاح');
    } catch (error) {
        console.error('❌ خطأ في إضافة الحساب:', error);
        alert('😅 حدث خطأ أثناء إضافة الحساب. يرجى المحاولة مرة أخرى.');
    }
}

// تحديث مؤشر التعافي
async function updateRecoveryScore(patientId) {
    try {
        const recoveryScore = await SmartCheckDB.calculateRecoveryScore(patientId);
        const logs = await SmartCheckDB.getPatientDailyLogs(patientId);
        
        // حساب الالتزام بالتمارين
        const exerciseCompliance = logs.length > 0 
            ? (logs.filter(log => log.exerciseCompleted).length / logs.length) * 100 
            : 0;
        
        // حساب اتجاه الألم
        let painTrend = 'stable';
        if (logs.length >= 2) {
            const firstPain = logs[0].painScore;
            const lastPain = logs[logs.length - 1].painScore;
            if (lastPain < firstPain - 1) painTrend = 'decreasing';
            else if (lastPain > firstPain + 1) painTrend = 'increasing';
        }
        
        // حساب اتجاه الحركة
        let movementTrend = 'stable';
        if (logs.length >= 2) {
            const firstMovement = logs[0].movementScore;
            const lastMovement = logs[logs.length - 1].movementScore;
            if (lastMovement > firstMovement + 1) movementTrend = 'improving';
            else if (lastMovement < firstMovement - 1) movementTrend = 'worsening';
        }
        
        // تحديث تقدم التعافي
        await SmartCheckDB.updateRecoveryProgress(patientId, {
            recoveryScore: recoveryScore,
            painTrend: painTrend,
            movementTrend: movementTrend,
            exerciseCompliance: exerciseCompliance,
            daysSinceStart: logs.length,
            estimatedRecoveryDays: 30
        });
    } catch (error) {
        console.error('❌ خطأ في تحديث مؤشر التعافي:', error);
    }
}

// حفظ البيانات (توجيه للدالة الموحدة)
async function savePatientData() {
    return await savePatientDataAndStartPlan();
}

// تصدير البيانات
async function exportData() {
    try {
        const currentPatient = await SmartCheckDB.getCurrentPatient();
        if (!currentPatient) {
            alert('يجب حفظ بياناتك أولاً');
            return;
        }
        
        await SmartCheckDB.exportPatientData(currentPatient.patientId);
        alert('✅ تم تصدير البيانات بنجاح');
    } catch (error) {
        console.error('❌ خطأ في تصدير البيانات:', error);
        alert('حدث خطأ في تصدير البيانات');
    }
}

// تصدير بيانات جميع المرضى (للإدارة)
async function exportPatientsData() {
    try {
        const allPatients = await SmartCheckDB.getAllData('patients');
        
        if (allPatients.length === 0) {
            alert('لا يوجد مرضى لتصدير بياناتهم');
            return;
        }
        
        // إنشاء محتوى CSV
        let csvContent = '\uFEFF'; // BOM للدعم العربي
        csvContent += 'الاسم,رقم الهاتف,الدولة,الجنس,العمر,تاريخ التسجيل,آخر زيارة,خطة التعافي,تاريخ الموافقة\n';
        
        for (const patient of allPatients) {
            const flag = getCountryFlag(patient.countryCode);
            const hasPersonalData = patient.name && patient.phone && patient.countryCode;
            const recoveryStatus = hasPersonalData ? 'نعم' : 'لا';
            const acceptedDate = patient.acceptedPlanDate ? SmartCheckDB.formatDate(patient.acceptedPlanDate) : '-';
            
            csvContent += `"${patient.name || 'بدون اسم'}","${patient.phone || ''}","${flag} ${patient.countryCode || ''}","${patient.gender || ''}","${patient.age || ''}","${SmartCheckDB.formatDate(patient.createdAt)}","${SmartCheckDB.formatDate(patient.lastVisit)}","${recoveryStatus}","${acceptedDate}"\n`;
        }
        
        // إنشاء ملف وتحميله
        const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
        const link = document.createElement('a');
        const url = URL.createObjectURL(blob);
        
        const timestamp = new Date().toISOString().split('T')[0];
        link.setAttribute('href', url);
        link.setAttribute('download', `patients_data_${timestamp}.csv`);
        link.style.visibility = 'hidden';
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        
        alert('✅ تم تصدير بيانات المرضى بنجاح');
    } catch (error) {
        console.error('❌ خطأ في تصدير بيانات المرضى:', error);
        alert('حدث خطأ في تصدير بيانات المرضى');
    }
}

// دالة تسجيل دخول المريض
async function patientLogin() {
    const countryCode = document.getElementById('login-country').value;
    const phone = document.getElementById('login-phone').value.trim();
    
    if (!phone) {
        showCustomAlert('يرجى إدخال رقم الهاتف', 'warning');
        return;
    }
    
    try {
        const patient = await SmartCheckDB.login(phone, countryCode);
        
        if (patient) {
            console.log('✅ تم تسجيل الدخول بنجاح:', patient);
            
            // حفظ المريض الحالي
            localStorage.setItem('currentPatientId', patient.patientId);
            
            // إخفاء نافذة تسجيل الدخول
            document.getElementById('patient-login-modal').style.display = 'none';
            
            // تحديث أزرار الهيدر
            document.getElementById('patient-login-header-btn').style.display = 'none';
            document.getElementById('patient-logout-btn').style.display = 'inline-block';
            
            // إخفاء صندوق الترحيب وإظهار بطاقة التشخيص
            document.getElementById('welcome-box').style.display = 'none';
            document.getElementById('diagnostic-card').style.display = 'block';
            
            // تحميل بيانات المريض
            await loadPatientData(patient.patientId);
            
            // التحقق من وجود خطة تعافي
            if (patient.acceptedRecoveryPlan) {
                // إظهار المتابعة اليومية
                await loadDailyTrackingData(patient.patientId);
                document.getElementById('daily-tracking-section').style.display = 'block';
                document.getElementById('daily-tracking-section').scrollIntoView({ behavior: 'smooth' });
            } else {
                // إظهار رسالة ترحيب
                showCustomAlert(`مرحباً ${patient.name || 'بك'}! يمكنك البدء بتشخيص جديد أو طلب خطة تعافي`, 'info');
            }
        } else {
            showCustomAlert('لم يتم العثور على حساب بهذا الرقم. يرجى التسجيل أولاً', 'error');
        }
    } catch (error) {
        console.error('خطأ في تسجيل الدخول:', error);
        showCustomAlert('حدث خطأ في تسجيل الدخول. يرجى المحاولة مرة أخرى', 'error');
    }
}

// دالة عرض رسالة بستايل الأداة
function showCustomAlert(message, type = 'success') {
    // إزالة أي رسالة موجودة
    const existingAlert = document.querySelector('.custom-alert');
    if (existingAlert) existingAlert.remove();
    
    // إنشاء عنصر الرسالة
    const alertDiv = document.createElement('div');
    alertDiv.className = 'custom-alert';
    
    // تحديد الألوان بناءً على النوع
    let bgColor, borderColor, icon;
    switch(type) {
        case 'success':
            bgColor = 'linear-gradient(135deg, #10b981 0%, #059669 100%)';
            borderColor = '#059669';
            icon = '✅';
            break;
        case 'error':
            bgColor = 'linear-gradient(135deg, #ef4444 0%, #dc2626 100%)';
            borderColor = '#dc2626';
            icon = '❌';
            break;
        case 'warning':
            bgColor = 'linear-gradient(135deg, #f59e0b 0%, #d97706 100%)';
            borderColor = '#d97706';
            icon = '⚠️';
            break;
        case 'info':
            bgColor = 'linear-gradient(135deg, #3b82f6 0%, #1d4ed8 100%)';
            borderColor = '#1d4ed8';
            icon = 'ℹ️';
            break;
        default:
            bgColor = 'linear-gradient(135deg, #1e2633 0%, #2d3748 100%)';
            borderColor = '#d4af37';
            icon = '🔔';
    }
    
    alertDiv.style.cssText = `
        position: fixed;
        top: 20px;
        left: 50%;
        transform: translateX(-50%);
        z-index: 10000;
        background: ${bgColor};
        border: 2px solid ${borderColor};
        border-radius: 12px;
        padding: 20px 30px;
        color: white;
        font-size: 1.1em;
        font-weight: bold;
        box-shadow: 0 8px 32px rgba(0, 0, 0, 0.3);
        display: flex;
        align-items: center;
        gap: 15px;
        animation: slideDown 0.3s ease-out;
        max-width: 90%;
        text-align: center;
    `;
    
    alertDiv.innerHTML = `
        <span style="font-size: 1.5em;">${icon}</span>
        <span>${message}</span>
    `;
    
    // إضافة أنيميشن
    const style = document.createElement('style');
    style.textContent = `
        @keyframes slideDown {
            from {
                opacity: 0;
                transform: translateX(-50%) translateY(-20px);
            }
            to {
                opacity: 1;
                transform: translateX(-50%) translateY(0);
            }
        }
    `;
    document.head.appendChild(style);
    
    // إضافة الرسالة للصفحة
    document.body.appendChild(alertDiv);
    
    // إزالة الرسالة بعد 3 ثواني
    setTimeout(() => {
        alertDiv.style.animation = 'slideDown 0.3s ease-out reverse';
        setTimeout(() => alertDiv.remove(), 300);
    }, 3000);
}

// دالة التحقق من وجود مريض مسجل
async function checkExistingPatient() {
    const currentPatientId = localStorage.getItem('currentPatientId');
    console.log('🔍 التحقق من وجود مريض مسجل. currentPatientId:', currentPatientId);
    
    if (currentPatientId) {
        try {
            // استعادة بيانات المريض
            const patient = await SmartCheckDB.getPatientProfile(currentPatientId);
            if (patient) {
                console.log('✅ تم العثور على مريض مسجل:', patient);
                
                // تحديث أزرار الهيدر
                document.getElementById('patient-login-header-btn').style.display = 'none';
                document.getElementById('patient-logout-btn').style.display = 'inline-block';
                
                // إخفاء صندوق الترحيب وإظهار بطاقة التشخيص
                document.getElementById('welcome-box').style.display = 'none';
                document.getElementById('diagnostic-card').style.display = 'block';
                
                // تحميل بيانات المريض
                await loadPatientData(patient.patientId);
                
                // التحقق من وجود خطة التعافي
                if (patient.acceptedRecoveryPlan) {
                    // checkDailyLogAvailability سيتولى كل شيء (الساعة، التمارين، المتابعة اليومية)
                    await checkDailyLogAvailability();
                    
                    // loadDailyTrackingData سيتولى فقط من اليوم الثاني فصاعداً
                    await loadDailyTrackingData(patient.patientId);
                }
                
                return;
            }
        } catch (error) {
            console.error('❌ خطأ في استعادة بيانات المريض:', error);
        }
    }
    
    // إذا لم يكن هناك مريض مسجل، إعادة تعيين النموذج
    console.log('لا يوجد مريض مسجل - إعادة تعيين النموذج');
    resetDiagnosticForm();
    
    // إزالة الجلسة المحفوظة
    localStorage.removeItem('currentPatientId');
    localStorage.removeItem('isNewDiagnosis');
}

// دالة تحميل بيانات المريض
async function loadPatientData(patientId) {
    try {
        console.log('🔄 بدء تحميل بيانات المريض:', patientId);
        const patient = await SmartCheckDB.getPatientProfile(patientId);
        console.log('📊 بيانات المريض:', patient);
        
        if (patient) {
            // تحميل البيانات الشخصية في النموذج
            if (document.getElementById('age')) document.getElementById('age').value = patient.age || '';
            if (document.getElementById('gender')) document.getElementById('gender').value = patient.gender || 'male';
            if (document.getElementById('weight')) document.getElementById('weight').value = patient.weight || '';
            if (document.getElementById('height')) document.getElementById('height').value = patient.height || '';
            
            console.log('✅ تم تحميل البيانات الشخصية');
            
            // التحقق من خطة التعافي وإخفاء الأزرار إذا كان مشترك
            if (patient.acceptedRecoveryPlan) {
                const diagnoseBtn = document.getElementById('diagnose-btn');
                const resetBtn = document.getElementById('reset-btn');
                const recoveryMessage = document.getElementById('recovery-plan-active-message');
                
                if (diagnoseBtn) diagnoseBtn.style.display = 'none';
                if (resetBtn) resetBtn.style.display = 'none';
                if (recoveryMessage) recoveryMessage.style.display = 'block';
                
                console.log('✅ المريض مشترك في خطة التعافي - تم إخفاء أزرار التشخيص');
                
                // التحقق من عدد السجلات لتحديد ما إذا كان الجلسة 1
                const logs = await SmartCheckDB.getPatientDailyLogs(patientId);
                
                // التمارين المنزلية تبقى ظاهرة في الجلسة 1 (logs.length === 0)
                // من الجلسة 2 فصاعداً (logs.length >= 1) تختفي التمارين المنزلية
                // لا نحتاج لإخفاءها هنا لأن checkDailyLogAvailability ستتعامل معها
                
                // إخفاء المجسم والخطوات والأسئلة للمشتركين
                const modelContainer = document.querySelector('.model-container');
                if (modelContainer) modelContainer.style.display = 'none';
                
                const stepsIndicator = document.querySelector('.steps-indicator');
                if (stepsIndicator) stepsIndicator.style.display = 'none';
                
                const controlPanel = document.querySelector('.control-panel');
                if (controlPanel) controlPanel.style.display = 'none';
                
                const anatomyWrapper = document.querySelector('.anatomy-wrapper');
                if (anatomyWrapper) anatomyWrapper.style.display = 'none';
                
                const statusBar = document.getElementById('selected-status');
                if (statusBar) statusBar.style.display = 'none';
                
                const dynamicQuestionsDiv = document.getElementById('dynamic-questions');
                if (dynamicQuestionsDiv) dynamicQuestionsDiv.style.display = 'none';
                
                const chronicDiseasesSection = document.querySelector('.chronic-diseases');
                if (chronicDiseasesSection) chronicDiseasesSection.style.display = 'none';
                
                const personalDataSections = document.querySelectorAll('.personal-data-section');
                personalDataSections.forEach(section => {
                    section.style.display = 'none';
                });
                
                const redFlagsSection = document.querySelector('.red-flags-section');
                if (redFlagsSection) redFlagsSection.style.display = 'none';
                
                console.log('✅ تم إخفاء المجسم والخطوات والأسئلة للمشتركين');
                
                // إخفاء الجزء السفلي من التقرير للمشتركين (التشخيص التفصيلي)
                const reportDetailedSection = document.getElementById('report-detailed-section');
                if (reportDetailedSection) {
                    reportDetailedSection.style.display = 'none';
                    console.log('✅ تم إخفاء الجزء التفصيلي من التقرير للمشتركين');
                }
                
                // إظهار قسم الإرشادات والتمارين للمشتركين في اليوم الأول فقط
                const reportRecommendationsSection = document.getElementById('report-recommendations-section');
                if (reportRecommendationsSection) {
                    if (logs.length === 0) {
                        reportRecommendationsSection.style.display = 'block';
                        console.log('✅ تم إظهار قسم الإرشادات والتمارين لليوم الأول');
                    } else {
                        reportRecommendationsSection.style.display = 'none';
                        console.log('✅ تم إخفاء قسم الإرشادات والتمارين للأيام التالية');
                    }
                }
                
                // إخفاء البانر الترويجي للمشتركين
                const clinicPromoBanner = document.getElementById('clinic-promo-banner');
                if (clinicPromoBanner) {
                    clinicPromoBanner.style.display = 'none';
                    console.log('✅ تم إخفاء البانر الترويجي للمشتركين');
                }
                
                // إخفاء قسم التقرير للمشتركين من اليوم الثاني فصاعداً
                // checkDailyLogAvailability سيتولى إظهاره في اليوم الأول
                const reportSection = document.getElementById('report-section');
                if (reportSection && logs.length > 0) {
                    reportSection.style.display = 'none';
                    console.log('✅ تم إخفاء قسم التقرير للمشتركين (من اليوم الثاني)');
                }
                
                // إخفاء قسم حفظ البيانات للمشتركين
                const saveDataSection = document.getElementById('save-data-section');
                if (saveDataSection) {
                    saveDataSection.style.display = 'none';
                    console.log('✅ تم إخفاء قسم حفظ البيانات للمشتركين');
                }
                
                // إخفاء كرت خطة التعافي للمشتركين
                const recoveryPlanCTA = document.getElementById('recovery-plan-cta');
                if (recoveryPlanCTA) {
                    recoveryPlanCTA.style.display = 'none';
                    console.log('✅ تم إخفاء كرت خطة التعافي للمشتركين');
                }
                
                // إضافة class لتوسيط التقرير
                document.body.classList.add('subscribed-user');
                console.log('✅ تم إضافة class subscribed-user لتوسيط التقرير');
            }
            
            // تحميل آخر تقييم
            const assessments = await SmartCheckDB.getPatientAssessments(patientId);
            console.log('📋 عدد التقييمات:', assessments.length);
            
            // منطق المستخدم غير المشترك
            if (!patient.acceptedRecoveryPlan) {
                if (assessments.length === 0) {
                    // مستخدم جديد بدون تشخيص: إخفاء التقرير والتمارين
                    console.log('✅ مستخدم جديد بدون تشخيص - إخفاء التقرير والتمارين');
                    const reportSection = document.getElementById('report-section');
                    if (reportSection) reportSection.style.display = 'none';
                    const homeExercises = document.getElementById('home-exercises');
                    if (homeExercises) homeExercises.style.display = 'none';
                    const recoveryPlanCTA = document.getElementById('recovery-plan-cta');
                    if (recoveryPlanCTA) recoveryPlanCTA.style.display = 'none';
                } else {
                    // مستخدم مع تشخيص سابق: إظهار التقرير والتمارين ودعوة الاشتراك
                    console.log('✅ مستخدم مع تشخيص سابق - إظهار التقرير والتمارين');
                    const recoveryPlanCTA = document.getElementById('recovery-plan-cta');
                    if (recoveryPlanCTA) recoveryPlanCTA.style.display = 'block';
                }
            }
            
            if (assessments.length > 0) {
                const lastAssessment = assessments[assessments.length - 1];
                console.log('🔍 آخر تقييم:', lastAssessment);
                
                // تحميل بيانات التشخيص السابق
                const diagnoses = lastAssessment.diagnoses || lastAssessment.diagnosis || [];
                const pattern = lastAssessment.pattern || {};
                const severity = lastAssessment.severity || 5;
                const duration = lastAssessment.duration || 'acute';
                const answers = lastAssessment.answers || {};
                const painArea = lastAssessment.painArea || '';
                const chronicDiseases = lastAssessment.chronicDiseases || [];
                
                console.log('🎯 منطقة الألم:', painArea);
                console.log('❓ الإجابات:', answers);
                console.log('🔬 التشخيصات:', diagnoses);
                console.log('🔬 عدد التشخيصات:', diagnoses.length);
                console.log('🔬 التشخيصات الأولى:', diagnoses[0]);
                
                // إخفاء الأسئلة عند تسجيل الدخول
                console.log('📝 إخفاء الأسئلة عند تسجيل الدخول');
                const dynamicQuestionsDiv = document.getElementById('dynamic-questions');
                if (dynamicQuestionsDiv) {
                    dynamicQuestionsDiv.style.display = 'none';
                    console.log('✅ تم إخفاء الأسئلة الديناميكية');
                }
                
                // إخفاء قسم الأمراض المزمنة
                const chronicDiseasesSection = document.querySelector('.chronic-diseases');
                if (chronicDiseasesSection) {
                    chronicDiseasesSection.style.display = 'none';
                    console.log('✅ تم إخفاء قسم الأمراض المزمنة');
                }
                
                // إخفاء قسم البيانات الشخصية
                const personalDataSections = document.querySelectorAll('.personal-data-section');
                personalDataSections.forEach(section => {
                    section.style.display = 'none';
                });
                console.log('✅ تم إخفاء جميع أقسام البيانات الشخصية');
                
                // إخفاء أسئلة الأمان (العلامات الحمراء)
                const redFlagsSection = document.querySelector('.red-flags-section');
                if (redFlagsSection) {
                    redFlagsSection.style.display = 'none';
                    console.log('✅ تم إخفاء أسئلة الأمان');
                }
                
                // عرض نقطة الألم بشكل جميل
                if (painArea) {
                    const painAreaDisplay = document.getElementById('pain-area-display');
                    if (!painAreaDisplay) {
                        const painAreaDiv = document.createElement('div');
                        painAreaDiv.id = 'pain-area-display';
                        painAreaDiv.style.cssText = `
                            background: linear-gradient(135deg, #ef4444 0%, #dc2626 100%);
                            color: white;
                            padding: 20px;
                            border-radius: 12px;
                            margin-bottom: 20px;
                            border: 2px solid #dc2626;
                            text-align: center;
                            box-shadow: 0 8px 32px rgba(239, 68, 68, 0.3);
                        `;
                        painAreaDiv.innerHTML = `
                            <div style="font-size: 2em; margin-bottom: 10px;">🎯</div>
                            <div style="font-size: 1.2em; font-weight: bold;">نقطة الألم</div>
                            <div style="font-size: 1.5em; margin-top: 10px; font-weight: bold;">${painArea}</div>
                        `;
                        
                        const diagnosticCard = document.getElementById('diagnostic-card');
                        if (diagnosticCard) {
                            diagnosticCard.insertBefore(painAreaDiv, diagnosticCard.firstChild);
                        }
                    }
                    console.log('✅ تم عرض نقطة الألم بشكل جميل');
                }
                
                // عرض التقرير الاحترافي
                const bmi = patient.weight && patient.height ? (patient.weight / ((patient.height / 100) ** 2)) : null;
                const professionalReport = generateProfessionalReport(patient, diagnoses, painArea, bmi);
                
                const diagnosticCard = document.getElementById('diagnostic-card');
                if (diagnosticCard) {
                    // إزالة التقرير القديم إذا وجد
                    const oldReport = document.getElementById('professional-report');
                    if (oldReport) oldReport.remove();
                    
                    // إضافة التقرير الجديد بعد نقطة الألم
                    const painAreaDisplay = document.getElementById('pain-area-display');
                    if (painAreaDisplay) {
                        painAreaDisplay.insertAdjacentHTML('afterend', professionalReport);
                    } else {
                        diagnosticCard.insertAdjacentHTML('afterbegin', professionalReport);
                    }
                }
                console.log('✅ تم عرض التقرير الاحترافي');
                
                // تحميل أسئلة الأمراض المزمنة
                if (chronicDiseases.length > 0) {
                    console.log('📝 تحميل أسئلة الأمراض المزمنة...');
                    chronicDiseases.forEach(disease => {
                        const checkbox = document.querySelector(`input[name="chronic"][value="${disease}"]`);
                        if (checkbox) {
                            checkbox.checked = true;
                            console.log(`✅ تم تحديد المرض المزمن: ${disease}`);
                        }
                    });
                    console.log('✅ تم تحميل أسئلة الأمراض المزمنة');
                }
                
                // عرض التشخيص في قسم التقرير
                if (diagnoses && diagnoses.length > 0) {
                    let dxHtml = "";
                    for(let d of diagnoses) if(d.prob>0) dxHtml += `<div><strong>${d.name}</strong> - احتمالية: ${d.prob}%<div style="background:#1e2633; height:6px; margin:5px 0;"><div style="background:#d4af37; width:${d.prob}%; height:6px;"></div></div></div>`;
                    
                    const differentialDx = document.getElementById('differential-dx');
                    if (differentialDx) differentialDx.innerHTML = dxHtml;
                    
                    // توليد التقرير التفصيلي
                    const bmi = patient.weight && patient.height ? (patient.weight / ((patient.height / 100) ** 2)) : null;
                    const detailedReport = generateDetailedReport(diagnoses, painArea, answers, patient.age, bmi, patient.gender, patient.name, severity, duration, chronicDiseases, pattern);
                    
                    const detailedAssessment = document.getElementById('detailed-assessment');
                    if (detailedAssessment) detailedAssessment.innerHTML = detailedReport;
                    
                    // الحصول على التمارين والتحذيرات
                    console.log('🏋️ جلب التمارين باستخدام التشخيصات:', diagnoses);
                    const { exercises, warnings } = await getHomeExercisesAndWarnings(diagnoses, painArea, pattern, patient.age, bmi, severity, duration);
                    console.log('🏋️ التمارين:', exercises);
                    console.log('⚠️ التحذيرات:', warnings);
                    let formattedExercises = formatExercisesNew(exercises);
                    
                    // التمارين المنزلية تظهر فقط للمشتركين في اليوم الأول أو لغير المشتركين
                    const logs = await SmartCheckDB.getPatientDailyLogs(patientId);
                    const shouldShowHomeExercises = !patient.acceptedRecoveryPlan || logs.length === 0;
                    
                    const homeExercises = document.getElementById('home-exercises');
                    if (homeExercises) {
                        if (shouldShowHomeExercises) {
                            homeExercises.innerHTML = formattedExercises;
                            homeExercises.style.display = 'block';
                        } else {
                            homeExercises.style.display = 'none';
                        }
                    }
                    
                    let warnHtml = "<ul>";
                    warnings.forEach(w => warnHtml += `<li>${w}</li>`);
                    warnHtml += "</ul>";
                    
                    const warningList = document.getElementById('warning-list');
                    if (warningList) warningList.innerHTML = warnHtml;
                    
                    // عرض اسم المريض في التقرير
                    const patientNameDisplay = document.getElementById('patient-name-display');
                    if (patientNameDisplay && patient.name) {
                        patientNameDisplay.textContent = patient.name;
                    }
                    
                    // إظهار قسم التقرير
                    const reportSection = document.getElementById('report-section');
                    if (reportSection) {
                        reportSection.style.display = 'block';
                        reportSection.scrollIntoView({ behavior: 'smooth' });
                    }
                    
                    console.log('✅ تم عرض التشخيص');
                } else {
                    console.log('⚠️ لا توجد تشخيصات محفوظة - استخدام منطقة الألم للتمارين');
                    
                    // عرض التمارين بناءً على منطقة الألم فقط
                    console.log('🏋️ جلب التمارين باستخدام منطقة الألم فقط:', painArea);
                    const { exercises, warnings } = await getHomeExercisesAndWarnings([], painArea, pattern, patient.age, bmi, severity, duration);
                    console.log('🏋️ التمارين:', exercises);
                    console.log('⚠️ التحذيرات:', warnings);
                    let formattedExercises = formatExercisesNew(exercises);
                    
                    // التمارين المنزلية تظهر فقط للمشتركين في اليوم الأول أو لغير المشتركين
                    const logs = await SmartCheckDB.getPatientDailyLogs(patientId);
                    const shouldShowHomeExercises = !patient.acceptedRecoveryPlan || logs.length === 0;
                    
                    const homeExercises = document.getElementById('home-exercises');
                    if (homeExercises) {
                        if (shouldShowHomeExercises) {
                            homeExercises.innerHTML = formattedExercises;
                            homeExercises.style.display = 'block';
                        } else {
                            homeExercises.style.display = 'none';
                        }
                    }
                    
                    let warnHtml = "<ul>";
                    warnings.forEach(w => warnHtml += `<li>${w}</li>`);
                    warnHtml += "</ul>";
                    
                    const warningList = document.getElementById('warning-list');
                    if (warningList) warningList.innerHTML = warnHtml;
                    
                    // عرض اسم المريض في التقرير
                    const patientNameDisplay = document.getElementById('patient-name-display');
                    if (patientNameDisplay && patient.name) {
                        patientNameDisplay.textContent = patient.name;
                    }
                    
                    // إظهار قسم التقرير
                    const reportSection = document.getElementById('report-section');
                    if (reportSection) {
                        reportSection.style.display = 'block';
                        reportSection.scrollIntoView({ behavior: 'smooth' });
                    }
                }
                
                // إضافة العبارة الترويجية للعيادة (تظهر دائماً للمشتركين)
                if (patient.acceptedRecoveryPlan) {
                    const detailedAssessment = document.getElementById('detailed-assessment');
                    if (detailedAssessment) {
                        // إزالة العرض الترويجي القديم إذا وجد
                        const oldReferral = detailedAssessment.querySelector('.clinic-referral');
                        if (oldReferral) oldReferral.remove();
                        
                        // إضافة العرض الترويجي الجديد
                        const clinicReferralDiv = document.createElement('div');
                        clinicReferralDiv.className = 'clinic-referral';
                        clinicReferralDiv.style.marginTop = '20px';
                        clinicReferralDiv.style.padding = '20px';
                        clinicReferralDiv.style.background = 'linear-gradient(135deg, #10b981 0%, #059669 100%)';
                        clinicReferralDiv.style.color = 'white';
                        clinicReferralDiv.style.borderRadius = '12px';
                        clinicReferralDiv.style.border = '2px solid #059669';
                        const waPhoneClinic = (typeof APP_CONFIG !== 'undefined' && APP_CONFIG.whatsappPhone) ? APP_CONFIG.whatsappPhone : '962790000000';
                        clinicReferralDiv.innerHTML = `
                            <h3 style="margin: 0 0 10px 0;">🏥 استشارة مجانية مع عيادتنا</h3>
                            <p style="margin: 0 0 15px 0;">للحصول على تشخيص دقيق وخطة علاج مخصصة، يرجى استشارتنا لتأكيد التشخيص. الاستشارة على واتساب مجانية!</p>
                            <a href="https://wa.me/${waPhoneClinic}" target="_blank" style="display: inline-block; background: white; color: #059669; padding: 10px 20px; border-radius: 8px; text-decoration: none; font-weight: bold;">💬 استشارة مجانية على واتساب</a>
                        `;
                        detailedAssessment.appendChild(clinicReferralDiv);
                        
                        // إظهار قسم التقرير إذا لم يكن ظاهراً
                        const reportSection = document.getElementById('report-section');
                        if (reportSection && reportSection.style.display === 'none') {
                            reportSection.style.display = 'block';
                        }
                    }
                }
                
                // تحميل الإجابات في الأسئلة الديناميكية إذا كانت موجودة
                if (Object.keys(answers).length > 0 && painArea) {
                    console.log('🔄 بدء تحميل الإجابات في الأسئلة');
                    console.log('📋 عدد الإجابات المحفوظة:', Object.keys(answers).length);
                    console.log('📝 تفاصيل الإجابات:', JSON.stringify(answers, null, 2));
                    
                    // تحديد نقطة الألم بناءً على المنطقة المحفوظة
                    const painPoint = document.querySelector(`.pain-point[data-name="${painArea}"]`);
                    if (painPoint) {
                        console.log('✅ تم العثور على نقطة الألم:', painArea);
                        // محاكاة اختيار المنطقة
                        selectRegion(painPoint);
                        
                        // تعبئة الإجابات في الأسئلة
                        setTimeout(() => {
                            console.log('🔄 بدء تعبئة الحقول...');
                            let filledCount = 0;
                            let notFoundCount = 0;
                            
                            Object.entries(answers).forEach(([key, value]) => {
                                console.log(`🔍 البحث عن الحقل: ${key} = ${value}`);
                                
                                if (Array.isArray(value)) {
                                    // للخانات المتعددة (checkboxes)
                                    value.forEach(val => {
                                        const checkbox = document.querySelector(`input[name="${key}"][value="${val}"]`);
                                        if (checkbox) {
                                            checkbox.checked = true;
                                            console.log(`✅ تم تعبئة checkbox: ${key} = ${val}`);
                                            filledCount++;
                                        } else {
                                            console.log(`⚠️ لم يتم العثور على checkbox: ${key} = ${val}`);
                                            notFoundCount++;
                                        }
                                    });
                                } else {
                                    // للخانات الفردية (select, textarea, radio)
                                    // البحث عن جميع الحقول بهذا الاسم
                                    const fields = document.querySelectorAll(`[name="${key}"]`);
                                    if (fields.length > 0) {
                                        if (fields.length === 1) {
                                            // حقل واحد
                                            const field = fields[0];
                                            if (field.tagName === 'SELECT') {
                                                // للقوائم المنسدلة، نبحث عن الخيار المطابق
                                                let optionFound = false;
                                                for (let i = 0; i < field.options.length; i++) {
                                                    if (field.options[i].value === value) {
                                                        field.selectedIndex = i;
                                                        optionFound = true;
                                                        console.log(`✅ تم تعبئة select: ${key} = ${value}`);
                                                        filledCount++;
                                                        break;
                                                    }
                                                }
                                                if (!optionFound) {
                                                    console.log(`⚠️ لم يتم العثور على الخيار في select: ${key} = ${value}`);
                                                    notFoundCount++;
                                                }
                                            } else {
                                                // للحقول الأخرى
                                                field.value = value;
                                                console.log(`✅ تم تعبئة حقل واحد: ${key} = ${value}`);
                                                filledCount++;
                                            }
                                        } else {
                                            // حقول متعددة (مثل radio buttons)
                                            let found = false;
                                            fields.forEach(field => {
                                                if (field.type === 'radio' && field.value === value) {
                                                    field.checked = true;
                                                    found = true;
                                                }
                                            });
                                            if (found) {
                                                console.log(`✅ تم تعبئة radio: ${key} = ${value}`);
                                                filledCount++;
                                            } else {
                                                // محاولة تعيين القيمة للحقل الأول
                                                fields[0].value = value;
                                                console.log(`✅ تم تعبئة أول حقل: ${key} = ${value}`);
                                                filledCount++;
                                            }
                                        }
                                    } else {
                                        console.log(`⚠️ لم يتم العثور على أي حقل: ${key}`);
                                        notFoundCount++;
                                    }
                                }
                            });
                            
                            console.log(`📊 إحصائيات التعبئة: ${filledCount} تم تعبئتها، ${notFoundCount} لم يتم العثور عليها`);
                            
                            // تحديث تقدم الأسئلة
                            updateQuestionsProgress();
                            console.log('✅ تم تحميل الإجابات في الأسئلة');
                        }, 1000); // زيادة الوقت إلى 1000ms للتأكد من تحميل الأسئلة
                    } else {
                        console.log('⚠️ لم يتم العثور على نقطة الألم:', painArea);
                    }
                } else {
                    console.log('⚠️ لا توجد إجابات محفوظة أو منطقة ألم');
                }
            } else {
                console.log('⚠️ لا توجد تقييمات لهذا المريض');
            }
        }
    } catch (error) {
        console.error('❌ خطأ في تحميل بيانات المريض:', error);
    }
}

// دالة إعادة تعيين نموذج التشخيص بالكامل
function resetDiagnosticForm() {
    // إزالة كلاس المستخدم المشترك
    document.body.classList.remove('subscribed-user');

    // إعادة إظهار عناصر المجسم ولوحة التحكم للمستخدم العادي
    const modelContainer = document.querySelector('.model-container');
    if (modelContainer) modelContainer.style.display = 'block';
    
    const stepsIndicator = document.querySelector('.steps-indicator');
    if (stepsIndicator) stepsIndicator.style.display = 'block';
    
    const controlPanel = document.querySelector('.control-panel');
    if (controlPanel) controlPanel.style.display = 'flex';
    
    const anatomyWrapper = document.querySelector('.anatomy-wrapper');
    if (anatomyWrapper) anatomyWrapper.style.display = 'block';
    
    const personalDataSections = document.querySelectorAll('.personal-data-section');
    personalDataSections.forEach(section => {
        section.style.display = 'block';
    });
    
    const redFlagsSection = document.querySelector('.red-flags-section');
    if (redFlagsSection) redFlagsSection.style.display = 'block';
    
    const diagnoseBtn = document.getElementById('diagnose-btn');
    if (diagnoseBtn) diagnoseBtn.style.display = 'block';
    
    const resetBtn = document.getElementById('reset-btn');
    if (resetBtn) resetBtn.style.display = 'block';
    
    const recoveryMessage = document.getElementById('recovery-plan-active-message');
    if (recoveryMessage) recoveryMessage.style.display = 'none';

    // إعادة تعيين جميع الحقول
    const formFields = ['age', 'gender', 'weight', 'height', 'severity', 'pain-score', 'pain-duration', 'pain-pattern', 'free-description'];
    formFields.forEach(fieldId => {
        const field = document.getElementById(fieldId);
        if (field) {
            if (field.type === 'range') field.value = '5';
            else field.value = '';
        }
    });

    const severityValue = document.getElementById('severity-value');
    if (severityValue) severityValue.innerText = '5';
    
    const bmiDiv = document.getElementById('bmi-display');
    if (bmiDiv) bmiDiv.style.display = 'none';
    
    // إعادة تعيين الخيارات المتعددة
    const checkboxes = document.querySelectorAll('input[type="checkbox"]');
    checkboxes.forEach(checkbox => {
        checkbox.checked = false;
    });
    
    // إعادة تعيين الخيارات الراديو
    const radios = document.querySelectorAll('input[type="radio"]');
    radios.forEach(radio => {
        radio.checked = false;
    });
    
    // إعادة تعيين حقول الاختيار
    const selects = document.querySelectorAll('select');
    selects.forEach(select => {
        select.selectedIndex = 0;
    });
    
    // إخفاء نقطة الألم وإعادة تعيين التحديد
    const painPoints = document.querySelectorAll('.pain-point');
    painPoints.forEach(point => {
        point.classList.remove('selected');
        point.style.backgroundColor = '';
    });
    
    // إخفاء قسم الأمراض المزمنة
    const chronicDiseasesSection = document.querySelector('.chronic-diseases');
    if (chronicDiseasesSection) {
        chronicDiseasesSection.style.display = 'none';
    }
    
    // إعادة تعيين رسالة الحالة
    const statusBar = document.getElementById('selected-status');
    if (statusBar) {
        statusBar.style.display = 'block';
        statusBar.textContent = '🔍 اضغط على نقطة الألم لبدء التشخيص';
        statusBar.classList.remove('selected-active');
    }

    const dynamicQuestionsDiv = document.getElementById('dynamic-questions');
    if (dynamicQuestionsDiv) {
        dynamicQuestionsDiv.innerHTML = '';
        dynamicQuestionsDiv.style.display = 'block';
    }
    
    // إخفاء الأقسام غير المطلوبة
    const repSec = document.getElementById('report-section');
    if (repSec) repSec.style.display = 'none';
    
    const dailySec = document.getElementById('daily-tracking-section');
    if (dailySec) dailySec.style.display = 'none';
    
    const countdownSec = document.getElementById('elegant-countdown');
    if (countdownSec) countdownSec.style.display = 'none';
    
    // إخفاء قسم التشخيص
    const diagnosticCard = document.getElementById('diagnostic-card');
    if (diagnosticCard) {
        diagnosticCard.style.display = 'none';
    }
    
    // إظهار صندوق الترحيب
    const welcomeBox = document.getElementById('welcome-box');
    if (welcomeBox) {
        welcomeBox.style.display = 'block';
    }
    
    activeJointId = null;
    activeJointName = '';
    if (typeof updateStepIndicator === 'function') {
        updateStepIndicator(1);
    }
    if (typeof switchView === 'function') {
        switchView('front');
    }
    
    // التمرير إلى الأعلى
    window.scrollTo({ top: 0, behavior: 'smooth' });
}