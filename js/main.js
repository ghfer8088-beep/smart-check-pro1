// تحويل التمارين إلى التنسيق الجديد مع أسماء واضحة
function formatExercisesNew(exercises) {
    if (!exercises) return '';
    
    // إذا كان التمرين بالفعل بتنسيق HTML الجديد، أرجعه كما هو
    if (exercises.includes('<div class="exercise-list">')) {
        return exercises;
    }
    
    // تحويل النص القديم إلى التنسيق الجديد
    const lines = exercises.split('\n');
    let html = '<div class="exercise-list">';
    let currentExercise = null;
    let description = [];
    
    for (let line of lines) {
        line = line.trim();
        if (!line) continue;
        
        // التحقق من أن السطر هو عنوان تمرين جديد
        if (line.match(/^[🏋️🛏️🧘🚶🏊❄️🔥🩹💻🚫⚠️]/) || line.includes('**')) {
            // إذا كان هناك تمرين سابق، أضفه
            if (currentExercise) {
                html += `
                <div class="exercise-item">
                    <div class="exercise-name">${currentExercise}</div>
                    <div class="exercise-desc">${description.join(' ').trim()}</div>
                </div>`;
            }
            
            // بدء تمرين جديد
            currentExercise = line.replace(/\*\*/g, '').trim();
            description = [];
        } else if (line.startsWith('-')) {
            // إضافة السطر إلى الوصف
            description.push(line.replace(/^-\s*/, '').trim());
        }
    }
    
    // إضافة التمرين الأخير
    if (currentExercise) {
        html += `
        <div class="exercise-item">
            <div class="exercise-name">${currentExercise}</div>
            <div class="exercise-desc">${description.join(' ').trim()}</div>
        </div>`;
    }
    
    html += '</div>';
    return html;
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
        
        if(!activeJointId) { alert("👆 يرجى اختيار نقطة الألم على المجسم أولاً للبدء في التشخيص"); loader.classList.remove('active'); return; }
        if(isNaN(age)||age<1) { alert("⚠️ يرجى إدخال عمر صحيح (يجب أن يكون رقماً أكبر من صفر)"); loader.classList.remove('active'); return; }
        if(!gender) { alert("⚠️ يرجى اختيار الجنس من القائمة المنسدلة"); loader.classList.remove('active'); return; }
        
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
        let whatsappMsg = `تقرير Smart Check Pro:\n• المنطقة: ${activeJointName}\n• التشخيص المحتمل: ${mainDx} (${mainProb}%)\n• العمر: ${age} سنة\n• BMI: ${bmi?bmi.toFixed(1):'غير مدخل'}\n• شدة الألم: ${severity}/10\n• مدة الألم: ${duration}\n• علامات خطر: ${redFlags.length>0?'نعم':'لا'}\n• مستوى الثقة: ${confidence}%`;
        document.getElementById('whatsapp-consult-btn').href = `https://wa.me/962700000000?text=${encodeURIComponent(whatsappMsg)}`;
        
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
            <a href="https://wa.me/962700000000?text=${encodeURIComponent(whatsappMsg)}" target="_blank" style="display: inline-block; background: white; color: #059669; padding: 10px 20px; border-radius: 8px; text-decoration: none; font-weight: bold;">💬 استشارة مجانية على واتساب</a>
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
        }
        
        // حفظ الملاحظات الشخصية في localStorage للاستخدام في التقرير
        localStorage.setItem('personalNotes', personalNotes);
    } catch (error) {
        console.error('خطأ في التشخيص:', error);
        loader.classList.remove('active');
        alert('😅 حدث خطأ أثناء التشخيص. يرجى التأكد من إدخال جميع البيانات المطلوبة والمحاولة مرة أخرى.');
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
        alert('⚠️ يرجى إدخال الاسم ورقم الهاتف للمتابعة مع خطة التعافي');
        return;
    }
    
    try {
        // تسجيل الدخول وحفظ البيانات
        const patient = await SmartCheckDB.login(phone, countryCode);
        
        // تحديث بيانات المريض
        await SmartCheckDB.updatePatientProfile(patient.patientId, {
            name: name,
            age: document.getElementById('age')?.value || null,
            gender: document.getElementById('gender')?.value || 'male',
            weight: document.getElementById('weight')?.value || null,
            height: document.getElementById('height')?.value || null
        });
        
        // حفظ التقييم الحالي
        const currentPatient = await SmartCheckDB.getCurrentPatient();
        if (currentPatient) {
            const assessmentData = {
                painArea: activeJointName || 'غير محدد',
                painScore: document.getElementById('severity')?.value || 5,
                clinicalFeatures: [],
                diagnoses: [],
                treatmentGoals: [],
                recoveryPlan: []
            };
            await SmartCheckDB.saveAssessment(currentPatient.patientId, assessmentData);
        }
        
        // إظهار رسالة النجاح
        alert('✅ تم حفظ بياناتك بنجاح! يمكنك الآن البدء في خطة التعافي.');
        
        // إظهار قسم المتابعة اليومية
        document.getElementById('save-data-section').style.display = 'none';
        document.getElementById('daily-tracking-section').style.display = 'block';
        
        // تحميل البيانات المحفوظة
        document.getElementById('patient-info-display').style.display = 'block';
        document.getElementById('patient-info-content').innerHTML = `
            <div style="color: white;">
                <p><strong>الاسم:</strong> ${name}</p>
                <p><strong>رقم الهاتف:</strong> ${phone}</p>
                <p><strong>الدولة:</strong> ${countryCode}</p>
            </div>
        `;
        
    } catch (error) {
        console.error('❌ خطأ في حفظ البيانات:', error);
        alert('😅 حدث خطأ في حفظ البيانات. يرجى المحاولة مرة أخرى.');
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
    
    const today = new Date().toISOString().split('T')[0];
    const messageDiv = document.getElementById('daily-tracking-message');
    const questionsContainer = document.getElementById('daily-log-form');
    const saveBtn = document.getElementById('save-daily-log-btn');
    const countdownDiv = document.getElementById('daily-countdown');
    
    // الحصول على آخر سجل للمريض
    const logs = await SmartCheckDB.getPatientDailyLogs(patient.patientId);
    const lastLog = logs.length > 0 ? logs[logs.length - 1] : null;
    
    // التحقق من مرور 24 ساعة منذ آخر سجل
    if (lastLog) {
        const lastLogDate = new Date(lastLog.date);
        const now = new Date();
        const hoursSinceLastLog = (now - lastLogDate) / (1000 * 60 * 60);
        
        if (hoursSinceLastLog < 24) {
            // لم تمر 24 ساعة بعد
            const hoursRemaining = 24 - hoursSinceLastLog;
            const hours = Math.floor(hoursRemaining);
            const minutes = Math.floor((hoursRemaining - hours) * 60);
            const seconds = Math.floor(((hoursRemaining - hours) * 60 - minutes) * 60);
            
            // حساب الجلسة التالية
            const currentSession = logs.length + 1;
            
            if (messageDiv) {
                messageDiv.innerHTML = `⏰ يجب الانتظار قبل الإدخال التالي`;
                messageDiv.style.color = '#f59e0b';
            }
            
            if (countdownDiv) {
                // تحديث العداد كل ثانية
                const updateCountdown = () => {
                    const now = new Date();
                    const elapsed = (now - lastLogDate) / (1000 * 60 * 60);
                    const remaining = 24 - elapsed;
                    const h = Math.floor(remaining);
                    const m = Math.floor((remaining - h) * 60);
                    const s = Math.floor(((remaining - h) * 60 - m) * 60);
                    
                    countdownDiv.innerHTML = `
                        <div style="background: linear-gradient(135deg, #1e2633 0%, #2d3748 100%); padding: 25px; border-radius: 16px; text-align: center; border: 2px solid #d4af37; box-shadow: 0 8px 32px rgba(212, 175, 55, 0.2);">
                            <div style="color: #d4af37; font-size: 1.2em; margin-bottom: 15px; font-weight: bold;">
                                🕐 الوقت المتبقي للجلسة ${currentSession}
                            </div>
                            <div style="display: flex; justify-content: center; gap: 20px; margin-bottom: 10px;">
                                <div style="background: #0a0e14; padding: 15px 25px; border-radius: 12px; min-width: 80px; border: 1px solid #d4af37;">
                                    <div id="countdown-hours" style="font-size: 2.5em; font-weight: bold; color: #fff;">${String(h).padStart(2, '0')}</div>
                                    <div style="color: #9ca3af; font-size: 0.9em;">ساعة</div>
                                </div>
                                <div style="background: #0a0e14; padding: 15px 25px; border-radius: 12px; min-width: 80px; border: 1px solid #d4af37;">
                                    <div id="countdown-minutes" style="font-size: 2.5em; font-weight: bold; color: #fff;">${String(m).padStart(2, '0')}</div>
                                    <div style="color: #9ca3af; font-size: 0.9em;">دقيقة</div>
                                </div>
                                <div style="background: #0a0e14; padding: 15px 25px; border-radius: 12px; min-width: 80px; border: 1px solid #d4af37;">
                                    <div id="countdown-seconds" style="font-size: 2.5em; font-weight: bold; color: #d4af37;">${String(s).padStart(2, '0')}</div>
                                    <div style="color: #9ca3af; font-size: 0.9em;">ثانية</div>
                                </div>
                            </div>
                            <div style="color: #ffffff; font-size: 1.1em; margin-top: 15px; font-weight: bold; display: flex; align-items: center; justify-content: center; gap: 10px;">
                                ⚠️ سيتم تفعيل الأسئلة تلقائياً عند انتهاء الوقت
                            </div>
                        </div>
                    `;
                };
                
                updateCountdown();
                countdownDiv.style.display = 'block';
                const countdownInterval = setInterval(updateCountdown, 1000);
                
                // حفظ interval ID لإيقافه عند الحاجة
                countdownDiv.dataset.intervalId = countdownInterval;
            }
            
            if (questionsContainer) {
                questionsContainer.style.display = 'none';
            }
            if (saveBtn) saveBtn.style.display = 'none';
            return false;
        }
    }
    
    // يمكن الإدخال
    if (messageDiv) {
        messageDiv.textContent = '✅ يمكنك إدخال بياناتك اليومية';
        messageDiv.style.color = '#10b981';
    }
    
    if (countdownDiv) {
        countdownDiv.style.display = 'none';
        // إيقاف أي countdown قيد التشغيل
        if (countdownDiv.dataset.intervalId) {
            clearInterval(parseInt(countdownDiv.dataset.intervalId));
        }
    }
    
    if (questionsContainer) {
        questionsContainer.style.display = 'block';
        questionsContainer.style.opacity = '1';
        questionsContainer.style.pointerEvents = 'auto';
        // تفعيل جميع الحقول
        const inputs = questionsContainer.querySelectorAll('input, select, textarea, button');
        inputs.forEach(input => {
            input.disabled = false;
        });
    }
    if (saveBtn) saveBtn.style.display = 'block';
    return true;
}

// تعديل saveDailyLog لاستخدام النظام الجديد
async function saveDailyLog() {
    const patient = await SmartCheckDB.getCurrentPatient();
    if (!patient) {
        alert('⚠️ يرجى حفظ بياناتك الشخصية أولاً قبل إضافة السجل اليومي');
        return;
    }
    
    // التحقق من إمكانية الإدخال
    if (!checkDailyLogAvailability()) {
        return;
    }
    
    // جمع البيانات
    const painScore = parseInt(document.getElementById('daily-pain-score').value);
    const movementScore = parseInt(document.getElementById('daily-movement-score').value);
    const walkingMinutes = parseInt(document.getElementById('daily-walking-minutes').value) || 0;
    const sleepQuality = parseInt(document.getElementById('daily-sleep-quality').value);
    
    const positiveBehaviors = [];
    if (document.getElementById('daily-exercise-completed').checked) positiveBehaviors.push('أداء التمارين');
    if (document.getElementById('daily-walking-done').checked) positiveBehaviors.push('المشي');
    if (document.getElementById('daily-stretching-done').checked) positiveBehaviors.push('الإطالة');
    if (document.getElementById('daily-heat-therapy').checked) positiveBehaviors.push('العلاج الحراري');
    if (document.getElementById('daily-good-posture').checked) positiveBehaviors.push('الحفاظ على وضعية جيدة');
    if (document.getElementById('daily-rest-enough').checked) positiveBehaviors.push('الحصول على راحة كافية');
    
    const negativeBehaviors = [];
    if (document.getElementById('daily-long-sitting').checked) negativeBehaviors.push('الجلوس الطويل');
    if (document.getElementById('daily-excessive-walking').checked) negativeBehaviors.push('المشي الزائد');
    if (document.getElementById('daily-heavy-lifting').checked) negativeBehaviors.push('رفع الأشياء الثقيلة');
    if (document.getElementById('daily-phone-usage').checked) negativeBehaviors.push('استخدام الهاتف لفترة طويلة');
    if (document.getElementById('daily-poor-sleep').checked) negativeBehaviors.push('النوم السيء');
    if (document.getElementById('daily-pain-radiation').checked) negativeBehaviors.push('انتشار الألم');
    
    const notes = document.getElementById('daily-notes').value.trim();
    
    // حفظ السجل
    const logData = {
        painScore: painScore,
        movementScore: movementScore,
        walkingMinutes: walkingMinutes,
        sleepQuality: sleepQuality,
        exerciseCompleted: positiveBehaviors.includes('أداء التمارين'),
        walkingDone: positiveBehaviors.includes('المشي'),
        stretchingDone: positiveBehaviors.includes('الإطالة'),
        heatTherapy: positiveBehaviors.includes('العلاج الحراري'),
        goodPosture: positiveBehaviors.includes('الحفاظ على وضعية جيدة'),
        restEnough: positiveBehaviors.includes('الحصول على راحة كافية'),
        painRadiation: negativeBehaviors.includes('انتشار الألم'),
        longSitting: negativeBehaviors.includes('الجلوس الطويل'),
        excessiveWalking: negativeBehaviors.includes('المشي الزائد'),
        heavyLifting: negativeBehaviors.includes('رفع الأشياء الثقيلة'),
        phoneUsage: negativeBehaviors.includes('استخدام الهاتف لفترة طويلة'),
        poorSleep: negativeBehaviors.includes('النوم السيء'),
        notes: notes
    };
    
    await SmartCheckDB.saveDailyLog(patient.patientId, logData);
    
    // تحديث وقت آخر تحديث لساعة التوقيت
    localStorage.setItem('lastDailyLogUpdate', new Date().toISOString());
    
    // بدء ساعة التوقيت
    startCountdown();
    
    // تحديث عدد الإدخالات
    const today = new Date().toISOString().split('T')[0];
    const entryCount = parseInt(localStorage.getItem(`entryCount_${today}`) || '0');
    localStorage.setItem(`entryCount_${today}`, entryCount + 1);
    localStorage.setItem('lastDailyLogDate', today);
    
    // تحديث مؤشر التعافي
    await updateRecoveryScore(patient.patientId);
    
    // الحصول على السجلات السابقة للتوصيات الذكية
    const allLogs = await SmartCheckDB.getPatientDailyLogs(patient.patientId);
    const previousLogs = allLogs.slice(0, -1); // كل السجلات ما عدا اليوم
    const recoveryScore = await SmartCheckDB.calculateRecoveryScore(patient.patientId);
    
    // الحصول على التوصيات الذكية
    const recommendations = getSmartRecommendations(logData, previousLogs, recoveryScore);
    
    // عرض التوصيات
    displaySmartRecommendations(recommendations);
    
    // الحصول على التمارين المتقدمة
    const assessments = await SmartCheckDB.getPatientAssessments(patient.patientId);
    let painArea = '';
    if (assessments.length > 0) {
        painArea = assessments[assessments.length - 1].painArea || '';
    }
    
    const dayNumber = allLogs.length;
    const progressiveExercisesList = getProgressiveExercises(painArea, recoveryScore, dayNumber);
    
    // عرض التمارين المتقدمة
    displayProgressiveExercises(progressiveExercisesList);
    
    // تحديث الواجهة
    alert('✅ تم حفظ السجل اليومي بنجاح');
    checkDailyLogAvailability();
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
        alert('⚠️ متصفحك لا يدعم الإشعارات');
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
                alert('✅ تم حفظ إعدادات التذكير بنجاح');
            } else {
                alert('⚠️ يرجى السماح بالإشعارات لتفعيل التذكير');
            }
        } else {
            disableReminder();
            alert('✅ تم إيقاف التذكير');
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
        
        // استخدام استعلام محسّن للمرضى الذين وافقوا على خطة التعافي
        const subscribedPatients = await SmartCheckDB.getPatientsWithRecoveryPlan();
        
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
        const patientsList = document.getElementById('patients-list');
        
        // استخدام استعلام محسّن للبحث
        let filteredPatients = searchTerm 
            ? await SmartCheckDB.searchPatients(searchTerm)
            : await SmartCheckDB.getAllData('patients');
        
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
        const patient = await SmartCheckDB.getPatientProfile(patientId);
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
        alert('⚠️ يرجى اختيار مريض أولاً');
        return;
    }
    
    try {
        await SmartCheckDB.exportPatientData(selectedPatientId);
        alert('✅ تم تصدير بيانات المريض بنجاح');
    } catch (error) {
        console.error('❌ خطأ في تصدير بيانات المريض:', error);
        alert('❌ حدث خطأ أثناء تصدير البيانات');
    }
}

// حذف المريض
async function deletePatient() {
    if (!selectedPatientId) {
        alert('⚠️ يرجى اختيار مريض أولاً');
        return;
    }
    
    if (!confirm('⚠️ هل أنت متأكد من حذف هذا المريض وجميع بياناته؟ هذا الإجراء لا يمكن التراجع عنه.')) {
        return;
    }
    
    try {
        await SmartCheckDB.deletePatientProfile(selectedPatientId);
        alert('✅ تم حذف المريض بنجاح');
        closeDoctorDashboard();
        openDoctorDashboard();
    } catch (error) {
        console.error('❌ خطأ في حذف المريض:', error);
        alert('❌ حدث خطأ أثناء حذف المريض');
    }
}

// دالة تحديث مؤشر التعافي
async function updateRecoveryScore(patientId) {
    try {
        const dailyLogs = await SmartCheckDB.getPatientDailyLogs(patientId);
        
        if (dailyLogs.length === 0) {
            document.getElementById('recovery-bar').style.width = '0%';
            document.getElementById('recovery-text').textContent = 'ابدأ بتسجيل تقدمك اليومي لحساب مؤشر التعافي';
            document.getElementById('recovery-score-badge').textContent = 'مؤشر التعافي: 0%';
            return;
        }
        
        // حساب مؤشر التعافي بناءً على السجلات اليومية
        let totalPainScore = 0;
        let totalMovementScore = 0;
        let positiveBehaviorsCount = 0;
        let negativeBehaviorsCount = 0;
        
        dailyLogs.forEach(log => {
            totalPainScore += log.painScore || 5;
            totalMovementScore += log.movementScore || 5;
            
            if (log.exerciseCompleted) positiveBehaviorsCount++;
            if (log.walkingDone) positiveBehaviorsCount++;
            if (log.stretchingDone) positiveBehaviorsCount++;
            if (log.heatTherapy) positiveBehaviorsCount++;
            if (log.goodPosture) positiveBehaviorsCount++;
            if (log.restEnough) positiveBehaviorsCount++;
            
            if (log.longSitting) negativeBehaviorsCount++;
            if (log.excessiveWalking) negativeBehaviorsCount++;
            if (log.heavyLifting) negativeBehaviorsCount++;
            if (log.phoneUsage) negativeBehaviorsCount++;
            if (log.poorSleep) negativeBehaviorsCount++;
            if (log.painRadiation) negativeBehaviorsCount++;
        });
        
        const avgPainScore = totalPainScore / dailyLogs.length;
        const avgMovementScore = totalMovementScore / dailyLogs.length;
        
        // حساب مؤشر التعافي (0-100)
        // الألم: كلما قل الألم، زاد مؤشر التعافي
        const painScore = Math.max(0, 100 - (avgPainScore * 10));
        // الحركة: كلما زادت الحركة، زاد مؤشر التعافي
        const movementScore = avgMovementScore * 10;
        // السلوكيات الإيجابية
        const behaviorScore = Math.min(100, (positiveBehaviorsCount / (dailyLogs.length * 6)) * 100);
        // السلوكيات السلبية
        const negativeScore = Math.max(0, 100 - (negativeBehaviorsCount / (dailyLogs.length * 6)) * 100);
        
        const recoveryScore = Math.round((painScore + movementScore + behaviorScore + negativeScore) / 4);
        
        // تحديث الواجهة
        document.getElementById('recovery-bar').style.width = `${recoveryScore}%`;
        document.getElementById('recovery-text').textContent = `مؤشر التعافي الحالي: ${recoveryScore}%`;
        document.getElementById('recovery-score-badge').textContent = `مؤشر التعافي: ${recoveryScore}%`;
        
        // تحديث لون المؤشر
        const recoveryBar = document.getElementById('recovery-bar');
        if (recoveryScore >= 70) {
            recoveryBar.style.background = '#10b981';
        } else if (recoveryScore >= 40) {
            recoveryBar.style.background = '#f59e0b';
        } else {
            recoveryBar.style.background = '#ef4444';
        }
    } catch (error) {
        console.error('❌ خطأ في تحديث مؤشر التعافي:', error);
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

// ربط الأحداث بعد تحميل الصفحة
document.addEventListener('DOMContentLoaded', () => {
    const severity = document.getElementById('severity');
    if (severity) {
        severity.addEventListener('input', function(){ 
            const severityValue = document.getElementById('severity-value');
            if (severityValue) severityValue.innerText = this.value; 
        });
    }
    
    const diagnoseBtn = document.getElementById('diagnose-btn');
    if (diagnoseBtn) diagnoseBtn.addEventListener('click', performDiagnosis);
    
    const resetBtn = document.getElementById('reset-btn');
    if (resetBtn) resetBtn.addEventListener('click', resetAll);
    
    const shareBtn = document.getElementById('share-btn');
    if (shareBtn) shareBtn.addEventListener('click', () => { if(navigator.share) navigator.share({title:'Smart Check Pro'}); else alert("📋 يرجى نسخ الرابط يدوياً من المتصفح للمشاركة"); });
    
    const btnFront = document.getElementById('btn-front');
    if (btnFront) btnFront.addEventListener('click', () => switchView('front'));
    
    const btnBack = document.getElementById('btn-back');
    if (btnBack) btnBack.addEventListener('click', () => switchView('back'));
    
    // ربط أزرار نافذة خطة التعافي
    const startRecoveryBtn = document.getElementById('start-recovery-btn');
    if (startRecoveryBtn) startRecoveryBtn.addEventListener('click', savePatientDataAndStartPlan);
    
    // زر إلغاء خطة التعافي (النافذة المنبثقة)
    const cancelRecoveryModalBtn = document.getElementById('cancel-recovery-btn');
    if (cancelRecoveryModalBtn) cancelRecoveryModalBtn.addEventListener('click', closeRecoveryPlanModal);
    
    // ربط زر حفظ السجل اليومي
    const saveDailyLogBtn = document.getElementById('save-daily-log-btn');
    if (saveDailyLogBtn) saveDailyLogBtn.addEventListener('click', saveDailyLog);
    
    // التحقق من الحساب الحالي وإظهار المتابعة اليومية إذا وافق على خطة التعافي
    SmartCheckDB.getCurrentPatient().then(patient => {
        if (patient && patient.acceptedRecoveryPlan) {
            document.getElementById('daily-tracking-section').style.display = 'block';
            checkDailyLogAvailability();
            updateRecoveryScore(patient.patientId);
        }
    });
    
    const printPdfBtn = document.getElementById('print-pdf-btn');
    if (printPdfBtn) printPdfBtn.addEventListener('click', printOrSaveAsPDF);
    
    const weight = document.getElementById('weight');
    if (weight) weight.addEventListener('input', updateBMIDisplay);
    
    const height = document.getElementById('height');
    if (height) height.addEventListener('input', updateBMIDisplay);
    
    const freeDescription = document.getElementById('free-description');
    if (freeDescription) freeDescription.addEventListener('input', analyzeFreeDescription);
    
    // التعامل مع الموافقة على جمع البيانات المجهولة
    const anonymousDataConsent = document.getElementById('anonymous-data-consent');
    if (anonymousDataConsent) {
        // استرجاع حالة الموافقة المحفوظة
        if (localStorage.getItem('anonymousDataConsent') === 'true') {
            anonymousDataConsent.checked = true;
            if (typeof anonymousDataCollection !== 'undefined') {
                anonymousDataCollection.enable();
            }
        }
        
        // حفظ حالة الموافقة عند التغيير
        anonymousDataConsent.addEventListener('change', function() {
            if (this.checked) {
                if (typeof anonymousDataCollection !== 'undefined') {
                    anonymousDataCollection.enable();
                }
                localStorage.setItem('anonymousDataConsent', 'true');
            } else {
                if (typeof anonymousDataCollection !== 'undefined') {
                    anonymousDataCollection.disable();
                }
                localStorage.setItem('anonymousDataConsent', 'false');
            }
        });
    }
    
    // أحداث الصفحة الترحيبية
    const welcomeBtn = document.getElementById('welcome-btn');
    if (welcomeBtn) {
        welcomeBtn.addEventListener('click', function() {
            document.getElementById('welcome-modal').style.display = 'none';
            document.getElementById('consent-modal').style.display = 'flex';
        });
    }
    
    const modal = document.getElementById('consent-modal');
    const consentBtn = document.getElementById('consent-btn');
    if (localStorage.getItem('smartConsent') === 'true') {
        modal.style.display = 'none';
        document.getElementById('welcome-modal').style.display = 'none';
        createPoints(frontPoints, 'front-container');
        createPoints(backPoints, 'back-container');
        loadState();
    } else {
        modal.style.display = 'none'; // إخفاء الموافقة المباشرة، إظهار الترحيب أولاً
        document.getElementById('welcome-modal').style.display = 'flex';
        consentBtn.onclick = () => {
            localStorage.setItem('smartConsent', 'true');
            modal.style.display = 'none';
            createPoints(frontPoints, 'front-container');
            createPoints(backPoints, 'back-container');
            loadState();
        };
    }
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
            }
            
            if (answer !== undefined && questionName) {
                answers[questionName] = answer;
            }
        });
        
        const assessmentData = {
            painArea: activeJointId,
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
            personalNotes: personalNotes
        };
        
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
        
        const registrationDate = new Date(patient.createdAt);
        const currentDate = new Date();
        const daysSinceRegistration = Math.floor((currentDate - registrationDate) / (1000 * 60 * 60 * 24));
        
        // حساب اليوم الحالي في خطة التعافي (حد أقصى 7 أيام)
        const currentDay = Math.min(daysSinceRegistration + 1, 7);
        
        // تحديث عداد الأيام
        const dayCounter = document.getElementById('day-counter');
        if (dayCounter) {
            dayCounter.textContent = `اليوم ${currentDay} من 7`;
        }
        
        // إظهار قسم المتابعة اليومية إذا كان المريض قد وافق على خطة التعافي أو في اليوم الثاني أو أكثر
        if (patient.acceptedRecoveryPlan || daysSinceRegistration >= 1) {
            document.getElementById('daily-tracking-section').style.display = 'block';
            
            // تحميل مؤشر التعافي
            const progress = await SmartCheckDB.getRecoveryProgress(patientId);
            if (progress) {
                updateRecoveryScoreDisplay(progress);
            }
            
            // تحميل السجلات اليومية
            if (logs.length > 0) {
                displayProgressChart(logs);
            }
            
            // التحقق من وجود سجل لليوم
            const today = new Date().toISOString().split('T')[0];
            const todayLog = await SmartCheckDB.getDailyLog(patientId, today);
            if (todayLog) {
                fillDailyLogForm(todayLog);
            }
            
            // التحقق من إمكانية الإدخال اليومي
            checkDailyLogAvailability();
        } else {
            // في اليوم الأول وبدون موافقة على خطة التعافي، إخفاء قسم المتابعة اليومية
            document.getElementById('daily-tracking-section').style.display = 'none';
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
    
    if (logs.length === 0) {
        progressData.innerHTML = '<p>لا توجد بيانات سابقة</p>';
        return;
    }
    
    let html = '';
    logs.forEach(log => {
        const date = SmartCheckDB.formatDate(log.date);
        html += `
        <div style="display: flex; justify-content: space-between; align-items: center; padding: 10px; background: #1e2633; border-radius: 5px;">
            <div>
                <strong>${date}</strong>
                <div style="font-size: 0.9em; color: #9ca3af;">الألم: ${log.painScore}/10 | الحركة: ${log.movementScore}/10</div>
            </div>
            <div style="text-align: left;">
                ${log.exerciseCompleted ? '✅ تمارين' : '❌ بدون تمارين'}
                <div style="font-size: 0.9em; color: #9ca3af;">المشي: ${log.walkingMinutes} دقيقة</div>
            </div>
        </div>`;
    });
    
    progressData.innerHTML = html;
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
            alert('⚠️ يرجى حفظ بياناتك الشخصية أولاً للوصول إلى هذه الميزة');
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
        
        // تفعيل القفل لمدة 24 ساعة
        activateLockMode();
        
        // إظهار رسائل بناءً على السلوكيات
        let message = '✅ تم حفظ السجل اليومي بنجاح. يمكنك تحديث البيانات مرة أخرى بعد 24 ساعة.';
        
        // التحقق من السلوكيات السلبية
        const negativeBehaviors = [];
        if (logData.longSitting) negativeBehaviors.push('جلست لفترة طويلة');
        if (logData.excessiveWalking) negativeBehaviors.push('مشيت مسافة طويلة');
        if (logData.heavyLifting) negativeBehaviors.push('بذلت جهد بدني متعب');
        if (logData.phoneUsage) negativeBehaviors.push('استخدمت الهاتف لفترة طويلة');
        if (logData.poorSleep) negativeBehaviors.push('نمت بشكل سيء');
        
        if (negativeBehaviors.length > 0) {
            message += '\n\n⚠️ لاحظت أنك قمت ببعض السلوكيات التي قد تؤثر على تعافيك:\n';
            message += negativeBehaviors.join('، ') + '\n';
            message += 'حاول تجنب هذه السلوكيات في المستقبل لتسريع عملية التعافي.';
        }
        
        // التحقق من السلوكيات الإيجابية
        const positiveBehaviors = [];
        if (logData.exerciseCompleted) positiveBehaviors.push('نفذت التمارين');
        if (logData.walkingDone) positiveBehaviors.push('مشيت لمدة كافية');
        if (logData.stretchingDone) positiveBehaviors.push('قمت بتمارين الإطالة');
        if (logData.heatTherapy) positiveBehaviors.push('استخدمت العلاج الحراري');
        if (logData.goodPosture) positiveBehaviors.push('حافظت على وضعية جيدة');
        if (logData.restEnough) positiveBehaviors.push('حصلت على قسط كافٍ من الراحة');
        
        if (positiveBehaviors.length >= 3) {
            message += '\n\n🎉 ممتاز! أنت تلتزم بخطة التعافي بشكل جيد. استمر في هذا الأداء!';
        }
        
        alert(message);
    } catch (error) {
        console.error('❌ خطأ في حفظ السجل اليومي:', error);
        alert('😅 حدث خطأ في حفظ السجل اليومي. يرجى المحاولة مرة أخرى.');
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
    
    if (!lastUpdate) {
        countdownElement.textContent = 'لا يوجد موعد محدد';
        return;
    }
    
    const lastUpdateTime = new Date(lastUpdate);
    const nextUpdateTime = new Date(lastUpdateTime.getTime() + 24 * 60 * 60 * 1000); // 24 ساعة
    
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
        // الحصول على المرضى الحديثين (آخر 30 يوم)
        const allPatients = await SmartCheckDB.getRecentPatients(30);
        
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
        alert('😅 حدث خطأ في عرض قائمة المرضى. يرجى المحاولة مرة أخرى.');
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
            
            alert(`✅ تم التبديل إلى ${patient.name || 'الحساب'} بنجاح`);
        } else {
            alert('⚠️ لم يتم العثور على الحساب المطلوب. يرجى التحقق من البيانات والمحاولة مرة أخرى.');
        }
    } catch (error) {
        console.error('❌ خطأ في التبديل إلى الحساب:', error);
        alert('😅 حدث خطأ في التبديل إلى الحساب. يرجى المحاولة مرة أخرى.');
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
        alert('⚠️ كلمة المرور غير صحيحة. يرجى التحقق والمحاولة مرة أخرى.');
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
        // استخدام استعلامات محسّنة
        const allPatients = searchTerm 
            ? await SmartCheckDB.searchPatients(searchTerm)
            : await SmartCheckDB.getAllData('patients');
        const allAssessments = await SmartCheckDB.getAllData('assessments');
        const allDailyLogs = await SmartCheckDB.getAllData('dailyLogs');
        
        // تحديث الإحصائيات العامة
        updateStatisticsDashboard(allPatients, allAssessments, allDailyLogs);
        
        // تصفية المرضى - تمت بالفعل في الاستعلام المحسّن
        const filteredPatients = allPatients;
        
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
                // تصحيح الشارة: من يملأ بياناته الشخصية يعني أنه اشترك في خطة التعافي
                const hasPersonalData = patient.name && patient.phone && patient.countryCode;
                const recoveryPlanBadge = hasPersonalData
                    ? '<span style="background: #10b981; color: white; padding: 2px 8px; border-radius: 4px; font-size: 0.8em; margin-right: 5px;">✓ خطة التعافي</span>'
                    : '<span style="background: #6b7280; color: white; padding: 2px 8px; border-radius: 4px; font-size: 0.8em; margin-right: 5px;">تشخيص فقط</span>';
                
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
        alert('😅 حدث خطأ في تحميل قائمة الحسابات. يرجى المحاولة مرة أخرى.');
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
            alert('⚠️ لم يتم العثور على بيانات المريض. قد يكون الحساب قد تم حذفه.');
            return;
        }
        
        if (patientName !== patient.name) {
            alert('⚠️ الاسم غير مطابق. تم إلغاء عملية الحذف لحماية البيانات.');
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
        
        alert('✅ تم حذف الحساب وجميع بياناته بنجاح');
    } catch (error) {
        console.error('❌ خطأ في حذف الحساب:', error);
        alert('😅 حدث خطأ أثناء حذف الحساب. يرجى المحاولة مرة أخرى.');
    }
}

// عرض تفاصيل الحساب في نافذة مستقلة
async function showAdminPatientDetails(patientId) {
    const detailsDiv = document.getElementById('admin-patient-details');
    const infoDiv = document.getElementById('admin-patient-info');
    const logsDiv = document.getElementById('admin-patient-logs');
    
    try {
        const patient = await SmartCheckDB.getPatientProfile(patientId);
        const assessments = await SmartCheckDB.getPatientAssessments(patientId);
        const dailyLogs = await SmartCheckDB.getPatientDailyLogs(patientId);
        
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
            
            detailsDiv.style.display = 'block';
            detailsDiv.scrollIntoView({ behavior: 'smooth' });
        }
    } catch (error) {
        console.error('❌ خطأ في عرض تفاصيل الحساب:', error);
        alert('😅 حدث خطأ في عرض تفاصيل الحساب. يرجى المحاولة مرة أخرى.');
    }
}

// تسجيل الخروج من لوحة الإدارة
function adminLogout() {
    document.getElementById('admin-content').style.display = 'none';
    document.getElementById('admin-password').parentElement.style.display = 'block';
    document.getElementById('admin-password').value = '';
    document.getElementById('admin-patient-details').style.display = 'none';
    document.getElementById('admin-panel-modal').style.display = 'none';
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

// حفظ البيانات
async function savePatientData() {
    try {
        const countryCode = document.getElementById('patient-country').value;
        const phone = document.getElementById('patient-phone-save').value.trim();
        const name = document.getElementById('patient-name-save').value.trim();
        
        // التحقق من صحة البيانات
        if (!name || name.length < 2) {
            alert('⚠️ يرجى إدخال اسم صحيح (حرفين على الأقل)');
            return;
        }
        
        if (!phone) {
            alert('⚠️ يرجى إدخال رقم الهاتف');
            return;
        }
        
        // التحقق من صحة رقم الهاتف
        if (!/^\d{7,15}$/.test(phone)) {
            alert('⚠️ رقم الهاتف غير صحيح. يجب أن يكون بين 7 و 15 رقم');
            return;
        }
        
        // التحقق من وضع المطور (الإدارة) - لا يوجد حد لمسح البيانات
        const isDeveloperMode = localStorage.getItem('isDeveloper') === 'true';
        
        if (!isDeveloperMode) {
            // التحقق من عدد مرات مسح البيانات
            const clearCount = parseInt(localStorage.getItem('dataClearCount') || '0');
            if (clearCount >= 2) {
                alert('⚠️ لقد قمت بمسح البيانات مرتين بالفعل. لا يمكن مسح البيانات أكثر من ذلك. إذا كنت بحاجة إلى مسح البيانات، يرجى التواصل مع الإدارة.');
                return;
            }
        }
        
        // تسجيل الدخول أو إنشاء ملف جديد
        const patient = await SmartCheckDB.login(phone, countryCode);
        
        // تحديث جميع البيانات الشخصية
        const age = parseInt(document.getElementById('age').value) || null;
        const gender = document.getElementById('gender').value || null;
        const weight = parseFloat(document.getElementById('weight').value) || null;
        const height = parseFloat(document.getElementById('height').value) || null;
        
        // التحقق من نطاق القيم
        if (age && (age < 1 || age > 120)) {
            alert('⚠️ العمر يجب أن يكون بين 1 و 120 سنة');
            return;
        }
        
        if (weight && (weight < 20 || weight > 300)) {
            alert('⚠️ الوزن يجب أن يكون بين 20 و 300 كجم');
            return;
        }
        
        if (height && (height < 50 || height > 250)) {
            alert('⚠️ الطول يجب أن يكون بين 50 و 250 سم');
            return;
        }
        
        const updateData = {
            name: name,
            age: age,
            gender: gender,
            weight: weight,
            height: height,
            acceptedRecoveryPlan: true,
            acceptedPlanDate: new Date().toISOString()
        };
        
        await SmartCheckDB.updatePatientProfile(patient.patientId, updateData);
        
        // حفظ بيانات التشخيص في التقييم
        const diagnosis = JSON.parse(localStorage.getItem('lastDiagnosis') || '[]');
        const pattern = localStorage.getItem('lastPattern') || '';
        const severity = localStorage.getItem('lastSeverity') || '';
        const duration = localStorage.getItem('lastDuration') || '';
        
        if (diagnosis.length > 0) {
            await saveAssessmentToDB(patient.patientId, diagnosis, pattern, severity, duration);
        }
        
        // إخفاء نموذج الحفظ
        const saveDataSection = document.getElementById('save-data-section');
        if (saveDataSection) {
            const formBlock = saveDataSection.querySelector('.report-block');
            if (formBlock) formBlock.style.display = 'none';
        }
        
        // عرض البيانات المحفوظة
        const patientInfoDisplay = document.getElementById('patient-info-display');
        const patientInfoContent = document.getElementById('patient-info-content');
        
        if (patientInfoDisplay && patientInfoContent) {
            const flag = getCountryFlag(countryCode);
            patientInfoContent.innerHTML = `
                <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 10px;">
                    <div><strong>الاسم:</strong> ${name || 'غير محدد'}</div>
                    <div><strong>الهاتف:</strong> ${flag} ${phone}</div>
                    <div><strong>الدولة:</strong> ${flag} ${countryCode?.toUpperCase() || 'غير محدد'}</div>
                    <div><strong>تاريخ التسجيل:</strong> ${SmartCheckDB.formatDate(patient.createdAt)}</div>
                </div>
            `;
            patientInfoDisplay.style.display = 'block';
        }
        
        // إخفاء قسم المتابعة اليومية في اليوم الأول
        document.getElementById('daily-tracking-section').style.display = "none";
        
        // عرض قسم التقرير (الذي يحتوي على التمارين) في اليوم الأول
        const reportSection = document.getElementById('report-section');
        if (reportSection) {
            reportSection.style.display = 'block';
        }
        
        // عرض قسم المتابعة اليومية
        document.getElementById('daily-tracking-section').style.display = 'block';
        checkDailyLogAvailability();
        updateRecoveryScore(patient.patientId);
        
        // إعادة تعيين عداد مسح البيانات
        localStorage.setItem('dataClearCount', '0');
        
        // عرض نافذة رسالة النجاح
        const successModal = document.getElementById('success-modal');
        const successMessage = document.getElementById('success-message');
        if (successModal && successMessage) {
            successMessage.textContent = 'في اليوم الأول، يرجى الالتزام بالتمارين المناسبة لحالتك. من اليوم الثاني، سيتم تفعيل المتابعة اليومية.';
            successModal.style.display = 'flex';
        }
    } catch (error) {
        console.error('❌ خطأ في حفظ بيانات المريض:', error);
        alert(error.message || 'حدث خطأ في حفظ البيانات');
    }
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

// ربط الأحداث الجديدة
document.addEventListener('DOMContentLoaded', () => {
    // أحداث السجل اليومي
    const dailyPainScore = document.getElementById('daily-pain-score');
    if (dailyPainScore) {
        dailyPainScore.addEventListener('input', function() {
            document.getElementById('daily-pain-value').textContent = this.value;
        });
    }
    
    const dailyMovementScore = document.getElementById('daily-movement-score');
    if (dailyMovementScore) {
        dailyMovementScore.addEventListener('input', function() {
            document.getElementById('daily-movement-value').textContent = this.value;
        });
    }
    
    const dailySleepQuality = document.getElementById('daily-sleep-quality');
    if (dailySleepQuality) {
        dailySleepQuality.addEventListener('input', function() {
            document.getElementById('daily-sleep-value').textContent = this.value;
        });
    }
    
    const saveDailyLogBtn = document.getElementById('save-daily-log-btn');
    if (saveDailyLogBtn) {
        saveDailyLogBtn.addEventListener('click', saveDailyLog);
    }
    
    const savePatientDataBtn = document.getElementById('save-patient-data-main-btn');
    if (savePatientDataBtn) {
        savePatientDataBtn.addEventListener('click', savePatientDataAndStartPlan);
    }
    
    // تغيير مثال رقم الهاتف بناءً على الدولة المختارة
    const patientCountry = document.getElementById('patient-country');
    const patientPhoneSave = document.getElementById('patient-phone-save');
    if (patientCountry && patientPhoneSave) {
        patientCountry.addEventListener('change', function() {
            const selectedOption = this.options[this.selectedIndex];
            const prefix = selectedOption.getAttribute('data-prefix');
            if (prefix) {
                patientPhoneSave.placeholder = `مثال: ${prefix}1234567`;
            } else {
                patientPhoneSave.placeholder = 'مثال: 0791234567';
            }
        });
    }
    
    const clearDataBtn = document.getElementById('clear-data-btn');
    if (clearDataBtn) {
        clearDataBtn.addEventListener('click', async function() {
            // التحقق من وضع المطور (الإدارة) - لا يوجد حد لمسح البيانات
            const isDeveloperMode = localStorage.getItem('isDeveloper') === 'true';
            
            if (!isDeveloperMode) {
                // التحقق من عدد مرات مسح البيانات
                const clearCount = parseInt(localStorage.getItem('dataClearCount') || '0');
                if (clearCount >= 2) {
                    alert('⚠️ لقد قمت بمسح البيانات مرتين بالفعل. لا يمكن مسح البيانات أكثر من ذلك. إذا كنت بحاجة إلى مسح البيانات، يرجى التواصل مع الإدارة.');
                    return;
                }
            }
            
            if (confirm('هل أنت متأكد من مسح جميع البيانات؟ هذا الإجراء لا يمكن التراجع عنه.')) {
                try {
                    // مسح جميع البيانات من IndexedDB
                    const db = await SmartCheckDB.openDatabase();
                    const transaction = db.transaction(['patients', 'assessments', 'dailyLogs'], 'readwrite');
                    transaction.objectStore('patients').clear();
                    transaction.objectStore('assessments').clear();
                    transaction.objectStore('dailyLogs').clear();
                    
                    // مسح localStorage
                    localStorage.removeItem('currentPatientId');
                    localStorage.removeItem('currentPatientPhone');
                    localStorage.removeItem('currentPatientCountry');
                    localStorage.removeItem('lastDailyLogUpdate');
                    localStorage.removeItem('isDeveloper');
                    
                    // زيادة عداد مسح البيانات (إذا لم يكن وضع المطور)
                    if (!isDeveloperMode) {
                        const newCount = parseInt(localStorage.getItem('dataClearCount') || '0') + 1;
                        localStorage.setItem('dataClearCount', newCount.toString());
                    }
                    
                    // إعادة تحميل الصفحة
                    alert('✅ تم مسح جميع البيانات بنجاح');
                    location.reload();
                } catch (error) {
                    console.error('❌ خطأ في مسح البيانات:', error);
                    alert('حدث خطأ في مسح البيانات');
                }
            }
        });
    }
    
    const exportDataBtn = document.getElementById('export-data-btn');
    if (exportDataBtn) {
        exportDataBtn.addEventListener('click', exportData);
    }
    
    const reminderSettingsBtn = document.getElementById('reminder-settings-btn');
    if (reminderSettingsBtn) {
        reminderSettingsBtn.addEventListener('click', showReminderSettings);
    }
    
    // أحداث التبديل بين المرضى
    const switchPatientBtn = document.getElementById('switch-patient-btn');
    if (switchPatientBtn) {
        switchPatientBtn.addEventListener('click', showPatientList);
    }
    
    const addNewPatientBtn = document.getElementById('add-new-patient-btn');
    if (addNewPatientBtn) {
        addNewPatientBtn.addEventListener('click', addNewPatient);
    }
    
    const cancelSwitchBtn = document.getElementById('cancel-switch-btn');
    if (cancelSwitchBtn) {
        cancelSwitchBtn.addEventListener('click', function() {
            document.getElementById('switch-patient-modal').style.display = 'none';
        });
    }
    
    // أحداث خطة التعافي المجانية (المدمجة في التقرير)
    const startRecoveryPlanBtn = document.getElementById('start-recovery-plan-btn');
    if (startRecoveryPlanBtn) {
        startRecoveryPlanBtn.addEventListener('click', function() {
            document.getElementById('recovery-plan-cta').style.display = 'none';
            document.getElementById('save-data-section').style.display = 'block';
            document.getElementById('save-data-section').scrollIntoView({ behavior: 'smooth' });
        });
    }
    
    const declineRecoveryPlanBtn = document.getElementById('decline-recovery-plan-btn');
    if (declineRecoveryPlanBtn) {
        declineRecoveryPlanBtn.addEventListener('click', function() {
            document.getElementById('recovery-plan-cta').style.display = 'none';
            alert('شكراً لاستخدامك Smart Check Pro. يمكنك العودة في أي وقت لبدء خطة التعافي.');
        });
    }
    
    // أحداث لوحة الإدارة
    const adminPanelBtn = document.getElementById('admin-panel-btn');
    if (adminPanelBtn) {
        adminPanelBtn.addEventListener('click', openAdminPanel);
    }
    
    // زر لوحة الطبيب
    const doctorDashboardBtn = document.getElementById('doctor-dashboard-btn');
    if (doctorDashboardBtn) {
        doctorDashboardBtn.addEventListener('click', openDoctorDashboard);
    }
    
    // أحداث لوحة التحكم المتقدمة للطبيب
    const closeDoctorDashboardBtn = document.getElementById('close-doctor-dashboard');
    if (closeDoctorDashboardBtn) {
        closeDoctorDashboardBtn.addEventListener('click', closeDoctorDashboard);
    }
    
    // البحث في لوحة الطبيب
    const doctorPatientSearch = document.getElementById('patient-search');
    if (doctorPatientSearch) {
        doctorPatientSearch.addEventListener('input', function() {
            loadPatientsList(this.value);
        });
    }
    
    const viewPatientAssessmentsBtn = document.getElementById('view-patient-assessments-btn');
    if (viewPatientAssessmentsBtn) {
        viewPatientAssessmentsBtn.addEventListener('click', function() {
            if (selectedPatientId) showPatientAssessments(selectedPatientId);
        });
    }
    
    const viewPatientLogsBtn = document.getElementById('view-patient-logs-btn');
    if (viewPatientLogsBtn) {
        viewPatientLogsBtn.addEventListener('click', function() {
            if (selectedPatientId) showPatientLogs(selectedPatientId);
        });
    }
    
    const exportPatientDataBtn = document.getElementById('export-patient-data-btn');
    if (exportPatientDataBtn) {
        exportPatientDataBtn.addEventListener('click', exportPatientData);
    }
    
    const deletePatientBtn = document.getElementById('delete-patient-btn');
    if (deletePatientBtn) {
        deletePatientBtn.addEventListener('click', deletePatient);
    }
    
    // زر تسجيل دخول الإدارة
    const adminLoginBtn = document.getElementById('admin-login-btn');
    if (adminLoginBtn) {
        adminLoginBtn.addEventListener('click', adminLogin);
    }
    
    // السماح بالدخول بضغط Enter في حقل كلمة المرور
    const adminPasswordInput = document.getElementById('admin-password');
    if (adminPasswordInput) {
        adminPasswordInput.addEventListener('keypress', function(e) {
            if (e.key === 'Enter') {
                adminLogin();
            }
        });
    }
    
    // زر تسجيل دخول المريض في الهيدر
    const patientLoginHeaderBtn = document.getElementById('patient-login-header-btn');
    if (patientLoginHeaderBtn) {
        patientLoginHeaderBtn.addEventListener('click', function() {
            document.getElementById('patient-login-modal').style.display = 'flex';
        });
    }
    
    // زر تسجيل خروج المريض
    const patientLogoutBtn = document.getElementById('patient-logout-btn');
    if (patientLogoutBtn) {
        patientLogoutBtn.addEventListener('click', async function() {
            if (confirm('هل تريد تسجيل الخروج؟')) {
                // تسجيل الخروج من Firebase
                SmartCheckDB.logout();
                
                // إزالة البيانات من localStorage
                localStorage.removeItem('currentPatientId');
                localStorage.removeItem('isNewDiagnosis');
                localStorage.removeItem('smartProState');
                localStorage.removeItem('personalNotes');
                
                // إعادة تعيين الأزرار
                document.getElementById('patient-logout-btn').style.display = 'none';
                document.getElementById('patient-login-header-btn').style.display = 'inline-block';
                
                // إخفاء الأقسام
                document.getElementById('daily-tracking-section').style.display = 'none';
                document.getElementById('report-section').style.display = 'none';
                document.getElementById('save-data-section').style.display = 'none';
                document.getElementById('patient-info-display').style.display = 'none';
                
                // إظهار الأقسام الأولية
                document.getElementById('welcome-box').style.display = 'block';
                document.getElementById('diagnostic-card').style.display = 'none';
                
                // إعادة تعيين النموذج بالكامل
                resetDiagnosticForm();
                
                // إعادة تعيين جميع الحقول
                document.getElementById('age').value = '';
                document.getElementById('gender').value = 'male';
                document.getElementById('weight').value = '';
                document.getElementById('height').value = '';
                document.getElementById('patient-name-save').value = '';
                document.getElementById('patient-phone-save').value = '';
                document.getElementById('patient-country').value = 'jo';
                
                // إعادة تعيين حقول الأسئلة الديناميكية
                const dynamicQuestions = document.getElementById('dynamic-questions');
                if (dynamicQuestions) {
                    const selects = dynamicQuestions.querySelectorAll('select');
                    selects.forEach(select => select.value = '');
                    
                    const textareas = dynamicQuestions.querySelectorAll('textarea');
                    textareas.forEach(textarea => textarea.value = '');
                    
                    const checkboxes = dynamicQuestions.querySelectorAll('input[type="checkbox"]');
                    checkboxes.forEach(checkbox => checkbox.checked = false);
                    
                    dynamicQuestions.innerHTML = '<div class="dynamic-question-box"><p>يرجى اختيار منطقة الألم للبدء</p></div>';
                }
                
                // إعادة تعيين نقاط الألم
                if (window.resetAll) {
                    window.resetAll();
                }
                
                // إعادة تعيين نقطة الألم المحددة
                document.querySelectorAll('.pain-point').forEach(point => {
                    point.classList.remove('selected');
                });
                
                // إعادة تعيين المتغيرات العامة
                if (typeof activeJointId !== 'undefined') activeJointId = null;
                if (typeof activeJointName !== 'undefined') activeJointName = '';
                
                console.log('✅ تم تسجيل الخروج وتفريغ جميع الحقول');
                
                alert('تم تسجيل الخروج بنجاح. يمكنك البدء بتشخيص جديد.');
            }
        });
    }
    
    const adminLogoutBtn = document.getElementById('admin-logout-btn');
    if (adminLogoutBtn) {
        adminLogoutBtn.addEventListener('click', adminLogout);
    }
    
    const closePatientDetailsBtn = document.getElementById('close-patient-details-btn');
    if (closePatientDetailsBtn) {
        closePatientDetailsBtn.addEventListener('click', function() {
            const modal = document.getElementById('patient-details-modal');
            if (modal) modal.style.display = 'none';
        });
    }
    
    const successModalOkBtn = document.getElementById('success-modal-ok-btn');
    if (successModalOkBtn) {
        successModalOkBtn.addEventListener('click', function() {
            document.getElementById('success-modal').style.display = 'none';
        });
    }
    
    // البحث في قائمة المرضى
    const patientSearchInput = document.getElementById('patient-search');
    if (patientSearchInput) {
        patientSearchInput.addEventListener('input', loadAdminPatientList);
    }
    
    const changePasswordBtn = document.getElementById('change-password-btn');
    if (changePasswordBtn) {
        changePasswordBtn.addEventListener('click', function() {
            document.getElementById('change-password-modal').style.display = 'flex';
        });
    }
    
    // زر تصدير بيانات المرضى
    const exportPatientsBtn = document.getElementById('export-patients-btn');
    if (exportPatientsBtn) {
        exportPatientsBtn.addEventListener('click', exportPatientsData);
    }
    
    // زر إغلاق تفاصيل المريض (لوحة الإدارة)
    const closeAdminPatientDetailsBtn = document.getElementById('close-patient-details-btn');
    if (closeAdminPatientDetailsBtn) {
        closeAdminPatientDetailsBtn.addEventListener('click', function() {
            document.getElementById('admin-patient-details').style.display = 'none';
        });
    }
    
    const addPatientBtn = document.getElementById('add-patient-btn');
    if (addPatientBtn) {
        addPatientBtn.addEventListener('click', function() {
            document.getElementById('add-patient-modal').style.display = 'flex';
        });
    }
    
    const cancelNewPatientBtn = document.getElementById('cancel-new-patient-btn');
    if (cancelNewPatientBtn) {
        cancelNewPatientBtn.addEventListener('click', function() {
            document.getElementById('add-patient-modal').style.display = 'none';
            document.getElementById('new-patient-name').value = '';
            document.getElementById('new-patient-phone').value = '';
        });
    }
    
    const saveNewPatientBtn = document.getElementById('save-new-patient-btn');
    if (saveNewPatientBtn) {
        saveNewPatientBtn.addEventListener('click', addNewPatient);
    }
    
    const cancelPasswordBtn = document.getElementById('cancel-password-btn');
    if (cancelPasswordBtn) {
        cancelPasswordBtn.addEventListener('click', function() {
            document.getElementById('change-password-modal').style.display = 'none';
            document.getElementById('current-password').value = '';
            document.getElementById('new-password').value = '';
            document.getElementById('confirm-password').value = '';
        });
    }
    
    const savePasswordBtn = document.getElementById('save-password-btn');
    if (savePasswordBtn) {
        savePasswordBtn.addEventListener('click', changeAdminPassword);
    }
    
    const toggleDeveloperModeBtn = document.getElementById('toggle-developer-mode-btn');
    if (toggleDeveloperModeBtn) {
        toggleDeveloperModeBtn.addEventListener('click', function() {
            const isDeveloper = localStorage.getItem('isDeveloper') === 'true';
            localStorage.setItem('isDeveloper', isDeveloper ? 'false' : 'true');
            this.textContent = isDeveloper ? '🔧 وضع المطور' : '🔧 وضع المطور (مفعل)';
            this.style.background = isDeveloper ? '#8b5cf6' : '#10b981';
            alert(isDeveloper ? 'تم إيقاف وضع المطور' : 'تم تفعيل وضع المطور - يمكنك الآن تجاوز القفل 24 ساعة');
        });
    }
    
    // زر وضع المطور السريع
    const quickDeveloperBtn = document.getElementById('quick-developer-btn');
    if (quickDeveloperBtn) {
        quickDeveloperBtn.addEventListener('click', function() {
            const isDeveloper = localStorage.getItem('isDeveloper') === 'true';
            localStorage.setItem('isDeveloper', isDeveloper ? 'false' : 'true');
            this.textContent = isDeveloper ? '🔧 وضع المطور' : '🔧 وضع المطور (مفعل)';
            this.style.background = isDeveloper ? '#8b5cf6' : '#10b981';
            alert(isDeveloper ? 'تم إيقاف وضع المطور' : 'تم تفعيل وضع المطور - يمكنك الآن تجاوز القفل 24 ساعة');
        });
    }
    
    // أحداث تسجيل دخول المريض
    const patientLoginBtn = document.getElementById('patient-login-btn');
    if (patientLoginBtn) {
        patientLoginBtn.addEventListener('click', patientLogin);
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
            // إعادة تعيين النموذج للبدء بتشخيص جديد
            resetDiagnosticForm();
        });
    }
    
    // التحقق من وجود مريض مسجل عند تحميل الصفحة
    // تأخير التحقق للتأكد من تحميل قاعدة البيانات
    setTimeout(async () => {
        await checkExistingPatient();
    }, 500);
});

// دالة تسجيل دخول المريض
async function patientLogin() {
    const countryCode = document.getElementById('login-country').value;
    const phone = document.getElementById('login-phone').value.trim();
    
    if (!phone) {
        alert('يرجى إدخال رقم الهاتف');
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
            
            // إظهار قسم المتابعة اليومية دائماً بعد تسجيل الدخول
            await loadDailyTrackingData(patient.patientId);
            document.getElementById('daily-tracking-section').style.display = 'block';
            
            // التحقق من إمكانية الإدخال اليومي
            await checkDailyLogAvailability();
            
            // التمرير إلى قسم المتابعة اليومية
            document.getElementById('daily-tracking-section').scrollIntoView({ behavior: 'smooth' });
        } else {
            alert('لم يتم العثور على حساب بهذا الرقم. يرجى التسجيل أولاً.');
        }
    } catch (error) {
        console.error('خطأ في تسجيل الدخول:', error);
        alert('حدث خطأ في تسجيل الدخول. يرجى المحاولة مرة أخرى.');
    }
}

// دالة التحقق من وجود مريض مسجل
async function checkExistingPatient() {
    const currentPatientId = localStorage.getItem('currentPatientId');
    console.log('🔍 التحقق من وجود مريض مسجل. currentPatientId:', currentPatientId);
    
    // التحقق من أن المستخدم ليس في وضع التشخيص الجديد
    const isNewDiagnosis = localStorage.getItem('isNewDiagnosis') === 'true';
    console.log('🔍 isNewDiagnosis:', isNewDiagnosis);
    
    if (currentPatientId && !isNewDiagnosis) {
        try {
            const patient = await SmartCheckDB.getPatientProfile(currentPatientId);
            console.log('📊 بيانات المريض من checkExistingPatient:', patient);
            
            if (patient) {
                // المريض مسجل بالفعل، تحميل بياناته
                await loadPatientData(currentPatientId);
                
                // التحقق من وجود خطة تعافي
                if (patient.acceptedRecoveryPlan) {
                    await loadDailyTrackingData(currentPatientId);
                    document.getElementById('daily-tracking-section').style.display = 'block';
                }
                return;
            }
        } catch (error) {
            console.error('خطأ في تحميل بيانات المريض:', error);
        }
    }
    
    // لا يوجد مريض مسجل أو تشخيص جديد، عدم إظهار نافذة تسجيل الدخول تلقائياً
    // المستخدم سيبدأ بتشخيص جديد
    console.log('بدء تشخيص جديد أو لا يوجد مريض مسجل');
}

// دالة عرض تاريخ التشخيصات السابقة
async function loadDiagnosisHistory(patientId) {
    try {
        const assessments = await SmartCheckDB.getPatientAssessments(patientId);
        const historySection = document.getElementById('diagnosis-history-section');
        const historyList = document.getElementById('diagnosis-history-list');
        
        if (!historySection || !historyList) return;
        
        if (assessments.length === 0) {
            historyList.innerHTML = '<p style="color: #9ca3af; text-align: center;">لا يوجد تشخيصات سابقة</p>';
            return;
        }
        
        // ترتيب التقييمات من الأحدث للأقدم
        const sortedAssessments = assessments.sort((a, b) => {
            const dateA = a.createdAt ? new Date(a.createdAt) : new Date(0);
            const dateB = b.createdAt ? new Date(b.createdAt) : new Date(0);
            return dateB - dateA;
        });
        
        let html = '<div style="display: flex; flex-direction: column; gap: 15px;">';
        
        sortedAssessments.forEach((assessment, index) => {
            const date = assessment.createdAt ? new Date(assessment.createdAt).toLocaleDateString('ar-SA') : 'غير محدد';
            const diagnoses = assessment.diagnoses || assessment.diagnosis || [];
            const painArea = assessment.painArea || 'غير محدد';
            const severity = assessment.severity || 0;
            
            const diagnosesList = diagnoses.map(d => 
                `<span style="background: #1e2633; padding: 5px 10px; border-radius: 5px; margin: 2px; font-size: 0.9em;">${d.name || d} (${d.prob || 0}%)</span>`
            ).join('');
            
            html += `
                <div style="background: #1e2633; padding: 20px; border-radius: 12px; border-right: 4px solid ${index === 0 ? '#d4af37' : '#374151'};">
                    <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 10px;">
                        <div style="font-weight: bold; color: #d4af37;">${index === 0 ? '🔥 أحدث تشخيص' : `التشخيص #${assessments.length - index}`}</div>
                        <div style="color: #9ca3af; font-size: 0.9em;">📅 ${date}</div>
                    </div>
                    <div style="margin-bottom: 10px;">
                        <span style="color: #9ca3af; font-size: 0.9em;">منطقة الألم:</span>
                        <span style="color: white; margin-right: 10px;">${painArea}</span>
                    </div>
                    <div style="margin-bottom: 10px;">
                        <span style="color: #9ca3af; font-size: 0.9em;">شدة الألم:</span>
                        <span style="color: white; margin-right: 10px;">${severity}/10</span>
                    </div>
                    <div style="margin-bottom: 10px;">
                        <span style="color: #9ca3af; font-size: 0.9em;">التشخيصات:</span>
                        <div style="display: flex; flex-wrap: wrap; margin-top: 5px;">
                            ${diagnosesList}
                        </div>
                    </div>
                </div>
            `;
        });
        
        html += '</div>';
        historyList.innerHTML = html;
        historySection.style.display = 'block';
        
        console.log('✅ تم تحميل تاريخ التشخيصات');
    } catch (error) {
        console.error('❌ خطأ في تحميل تاريخ التشخيصات:', error);
    }
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
            
            // تحميل بيانات الحفظ
            if (document.getElementById('patient-name-save')) document.getElementById('patient-name-save').value = patient.name || '';
            if (document.getElementById('patient-phone-save')) document.getElementById('patient-phone-save').value = patient.phone || '';
            if (document.getElementById('patient-country')) document.getElementById('patient-country').value = patient.countryCode || 'jo';
            
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
            }
            
            // تحميل آخر تقييم
            const assessments = await SmartCheckDB.getPatientAssessments(patientId);
            console.log('📋 عدد التقييمات:', assessments.length);
            
            // تحميل تاريخ التشخيصات السابقة
            await loadDiagnosisHistory(patientId);
            
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
                
                console.log('🎯 منطقة الألم:', painArea);
                console.log('❓ الإجابات:', answers);
                
                // استعادة الإجابات في الحقول
                if (answers && Object.keys(answers).length > 0) {
                    console.log('🔄 استعادة الإجابات في الحقول');
                    for (const [questionId, answer] of Object.entries(answers)) {
                        const inputElement = document.querySelector(`[name="${questionId}"]`);
                        if (inputElement) {
                            if (inputElement.type === 'radio' || inputElement.type === 'checkbox') {
                                const radioOrCheckbox = document.querySelector(`[name="${questionId}"][value="${answer}"]`);
                                if (radioOrCheckbox) {
                                    radioOrCheckbox.checked = true;
                                }
                            } else {
                                inputElement.value = answer;
                            }
                        }
                    }
                    console.log('✅ تم استعادة الإجابات');
                }
                
                // استعادة منطقة الألم المحددة
                if (painArea && window.selectRegion) {
                    console.log('🔄 استعادة منطقة الألم:', painArea);
                    window.selectRegion(painArea);
                }
                
                // عرض التشخيص في قسم التقرير
                if (diagnoses.length > 0) {
                    let dxHtml = "";
                    for(let d of diagnoses) if(d.prob>0) dxHtml += `<div><strong>${d.name}</strong> - احتمالية: ${d.prob}%<div style="background:#1e2633; height:6px; margin:5px 0;"><div style="background:#d4af37; width:${d.prob}%; height:6px;"></div></div></div>`;
                    
                    const differentialDx = document.getElementById('differential-dx');
                    if (differentialDx) differentialDx.innerHTML = dxHtml;
                    
                    // توليد التقرير التفصيلي
                    const bmi = patient.weight && patient.height ? (patient.weight / ((patient.height / 100) ** 2)) : null;
                    const detailedReport = generateDetailedReport(diagnoses, painArea, answers, patient.age, bmi, patient.gender, patient.name, severity, duration, [], pattern);
                    
                    const detailedAssessment = document.getElementById('detailed-assessment');
                    if (detailedAssessment) detailedAssessment.innerHTML = detailedReport;
                    
                    // إضافة العبارة الترويجية للعيادة
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
                        <a href="https://wa.me/962700000000" target="_blank" style="display: inline-block; background: white; color: #059669; padding: 10px 20px; border-radius: 8px; text-decoration: none; font-weight: bold;">💬 استشارة مجانية على واتساب</a>
                    `;
                    if (detailedAssessment) detailedAssessment.appendChild(clinicReferralDiv);
                    
                    // الحصول على التمارين والتحذيرات
                    const { exercises, warnings } = await getHomeExercisesAndWarnings(diagnoses, painArea, pattern, patient.age, bmi, severity, duration);
                    let formattedExercises = formatExercisesNew(exercises);
                    
                    const homeExercises = document.getElementById('home-exercises');
                    if (homeExercises) homeExercises.innerHTML = formattedExercises;
                    
                    let warnHtml = "<ul>";
                    warnings.forEach(w => warnHtml += `<li>${w}</li>`);
                    warnHtml += "</ul>";
                    
                    const warningList = document.getElementById('warning-list');
                    if (warningList) warningList.innerHTML = warnHtml;
                    
                    // إظهار قسم التقرير
                    const reportSection = document.getElementById('report-section');
                    if (reportSection) {
                        reportSection.style.display = 'block';
                        reportSection.scrollIntoView({ behavior: 'smooth' });
                    }
                    
                    console.log('✅ تم عرض التشخيص');
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
                        
                        // تعبئة الإجابات في الأسئلة بعد تأخير أطول لضمان تحميل الأسئلة الديناميكية
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
                                    const fields = document.querySelectorAll(`[name="${key}"]`);
                                    if (fields.length > 0) {
                                        if (fields.length === 1) {
                                            fields[0].value = value;
                                            console.log(`✅ تم تعبئة حقل واحد: ${key} = ${value}`);
                                            filledCount++;
                                        } else {
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
                        }, 1500); // زيادة التأخير إلى 1.5 ثانية
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

// حساب مؤشر كتلة الجسم (BMI)
function calculateBMI(weight, height) {
    if (!weight || !height || height <= 0) return null;
    // height is in cm, convert to meters
    const heightInMeters = height / 100;
    return weight / (heightInMeters * heightInMeters);
}

// تصنيف BMI المتقدم
function getBMICategoryAdvanced(bmi, weight, height) {
    if (!bmi) return null;
    
    let category = {
        text: '',
        class: '',
        desc: ''
    };
    
    if (bmi < 18.5) {
        category.text = 'نقص الوزن';
        category.class = 'bmi-underweight';
        category.desc = 'يُنصح بزيادة الوزن بشكل صحي';
    } else if (bmi >= 18.5 && bmi < 25) {
        category.text = 'وزن طبيعي';
        category.class = 'bmi-normal';
        category.desc = 'وزن صحي، حافظ عليه';
    } else if (bmi >= 25 && bmi < 30) {
        category.text = 'زيادة وزن';
        category.class = 'bmi-overweight';
        category.desc = 'يُنصح بزيادة النشاط البدني';
    } else if (bmi >= 30 && bmi < 35) {
        category.text = 'سمنة من الدرجة الأولى';
        category.class = 'bmi-obese-1';
        category.desc = 'يُنصح بمراجعة أخصائي تغذية';
    } else if (bmi >= 35 && bmi < 40) {
        category.text = 'سمنة من الدرجة الثانية';
        category.class = 'bmi-obese-2';
        category.desc = 'يُنصح ببرنامج خسارة وزن طبي';
    } else {
        category.text = 'سمنة مفرطة';
        category.class = 'bmi-obese-3';
        category.desc = 'يُنصح بتدخل طبي فوري';
    }
    
    return category;
}

// دالة إعادة تعيين نموذج التشخيص
function resetDiagnosticForm() {
    // إعادة تعيين جميع الحقول
    const formFields = ['age', 'gender', 'weight', 'height', 'pain-score', 'pain-duration', 'pain-pattern'];
    formFields.forEach(fieldId => {
        const field = document.getElementById(fieldId);
        if (field) field.value = '';
    });
    
    // إعادة تعيين الخيارات المتعددة
    const checkboxes = document.querySelectorAll('input[type="checkbox"]');
    checkboxes.forEach(checkbox => {
        checkbox.checked = false;
    });
    
    // إخفاء الأقسام
    document.getElementById('report-section').style.display = 'none';
    document.getElementById('daily-tracking-section').style.display = 'none';
    
    // التمرير إلى الأعلى
    window.scrollTo({ top: 0, behavior: 'smooth' });
}