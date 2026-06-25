// ============================================
// نظام الخبير الطبي الجديد - Expert Medical System
// ============================================

// تحميل بيانات المحركات
let expertSystemData = null;
let expertSystemInitialized = false;

// تحميل بيانات المحركات من ملفات JSON
async function loadExpertSystemData() {
    if (expertSystemData) return expertSystemData;
    
    try {
        // تحميل البيانات من ملفات JSON
        const [symptomsResponse, diagnosesResponse, exercisesResponse, riskFactorsResponse] = await Promise.all([
            fetch('data/symptoms.json'),
            fetch('data/diagnoses.json'),
            fetch('data/exercises.json'),
            fetch('data/riskFactors.json')
        ]);
        
        const symptomsData = await symptomsResponse.json();
        const diagnosesData = await diagnosesResponse.json();
        const exercisesData = await exercisesResponse.json();
        const riskFactorsData = await riskFactorsResponse.json();
        
        expertSystemData = {
            symptoms: symptomsData,
            diagnoses: diagnosesData,
            exercises: exercisesData,
            riskFactors: riskFactorsData
        };
        
        expertSystemInitialized = true;
        console.log('✅ Expert system data loaded from JSON files');
        return expertSystemData;
    } catch (error) {
        console.error('❌ Error loading expert system data:', error);
        throw error;
    }
}

// تهيئة النظام الخبير (اسم مستعار لـ loadExpertSystemData)
async function initializeExpertSystem() {
    return await loadExpertSystemData();
}

// ============================================
// دوال النظام الخبير الطبي
// ============================================

// دالة للحصول على التمارين مع الرسومات التوضيحية
function getExercisesWithIllustrations(jointId, diagnosisName) {
    const jointMap = {
        'الكتف': 'shoulder',
        'الرقبة': 'neck',
        'أسفل الظهر': 'lumbar',
        'الركبة': 'knee',
        'الكاحل': 'ankle'
    };
    
    const diagnosisMap = {
        'shoulder': {
            'انحشار': 'impingement',
            'وتر': 'tendonitis',
            'تمزق': 'tear',
            'Frozen': 'frozen'
        },
        'neck': {
            'انزلاق غضروفي': 'herniated',
            'تشنج عضلي': 'muscle_spasm',
            'الوضضعي': 'postural'
        },
        'lumbar': {
            'انزلاق غضروفي': 'herniated',
            'تضيق القناة': 'spinal_stenosis',
            'تشنج عضلي': 'muscle_spasm'
        },
        'knee': {
            'الرضفة': 'patellofemoral',
            'الغضروف': 'meniscus',
            'خشونة': 'osteoarthritis'
        },
        'ankle': {
            'التواء': 'sprain',
            'التهاب': 'tendinitis'
        }
    };
    
    const jointKey = Object.keys(jointMap).find(key => jointId.includes(key));
    if (!jointKey) return null;
    
    const joint = jointMap[jointKey];
    const diagnosisKey = Object.keys(diagnosisMap[joint]).find(key => diagnosisName.includes(key));
    if (!diagnosisKey) return null;
    
    const diagnosis = diagnosisMap[joint][diagnosisKey];
    return exercisesWithIllustrations[joint]?.[diagnosis] || null;
}

// معايير تشخيصية سريرية معترف بها
const clinicalCriteria = {
    'shoulder': {
        'neer': {
            name: 'معيار Neer',
            description: 'رفع الذراع بالتدوير الداخلي مع الاستقرار',
            positive: answers => answers.pain_trigger === 'رفع الذراع للأمام' && answers.weakness !== 'لا'
        },
        'hawkins': {
            name: 'معيار Hawkins-Kennedy',
            description: 'تدوير الذراع للداخل عند 90 درجة من الانثناء',
            positive: answers => answers.pain_trigger === 'تدوير الذراع للخارج' && answers.weakness !== 'لا'
        },
        'empty_can': {
            name: 'معيار Empty Can',
            description: 'رفع الذراع عند 90 درجة مع تدوير داخلي',
            positive: answers => answers.pain_trigger === 'رفع الذراع جانباً' && answers.weakness !== 'لا'
        }
    },
    'knee': {
        'mcmurray': {
            name: 'معيار McMurray',
            description: 'فحص تمزق الغضروف الهلالي',
            positive: answers => answers.locking === 'نعم كثيراً' || answers.catching === 'نعم مع ألم شديد'
        },
        'acl_lachman': {
            name: 'معيار Lachman',
            description: 'فحص تمزق الرباط الصليبي الأمامي',
            positive: answers => answers.instability === 'كثيراً' && answers.trauma_history === 'نعم حديثة'
        },
        'patellofemoral': {
            name: 'معيار Patellofemoral',
            description: 'فحص ألم الرضفة',
            positive: answers => answers.stairs_pain === 'بشدة' && answers.sitting_pain === 'نعم بشدة'
        }
    },
    'wrist': {
        'phalen': {
            name: 'معيار Phalen',
            description: 'فحص متلازمة النفق الرسغي',
            positive: answers => answers.night_symptoms === 'توقظني من النوم' && answers.numbness_pattern === 'في الإبهام والسبابة والوسطى'
        },
        'tinel': {
            name: 'معيار Tinel',
            description: 'فحص النفق الرسغي بالطرق',
            positive: answers => answers.numbness_pattern === 'في الإبهام والسبابة والوسطى' && answers.typing_computer === 'أكثر من 4 ساعات يومياً'
        },
        'finkelstein': {
            name: 'معيار Finkelstein',
            description: 'فحص التهاب دي كيرفان',
            positive: answers => answers.pain_trigger === 'تدوير الذراع' && answers.weakness !== 'لا'
        }
    },
    'hip': {
        'fabere': {
            name: 'معيار FABERE (Patrick)',
            description: 'فحص مفصل الحرقفي العجزي',
            positive: answers => answers.pain_location === 'ينتشر للركبة' && answers.sitting_pain === 'نعم بشدة'
        },
        'ober': {
            name: 'معيار Ober',
            description: 'فحص شد العضلة التوترية',
            positive: answers => answers.pain_location === 'الجانب الخارجي للفخذ' && answers.stiffness === 'تيبس شديد'
        }
    },
    'ankle': {
        'anterior_draw': {
            name: 'معيار Anterior Drawer',
            description: 'فحص عدم استقرار الكاحل الأمامي',
            positive: answers => answers.instability === 'كثيراً' && answers.sprain_history === 'مزمن'
        },
        'talar_tilt': {
            name: 'معيار Talar Tilt',
            description: 'فحص عدم استقرار الكاحل الجانبي',
            positive: answers => answers.instability === 'كثيراً' && answers.sprain_history === 'عدة مرات'
        }
    }
};

// دالة لتقييم المعايير السريرية
function evaluateClinicalCriteria(jointId, answers) {
    let criteriaMet = [];
    
    if (jointId.includes('shoulder')) {
        const shoulderCriteria = clinicalCriteria.shoulder;
        if (shoulderCriteria.neer.positive(answers)) criteriaMet.push(shoulderCriteria.neer.name);
        if (shoulderCriteria.hawkins.positive(answers)) criteriaMet.push(shoulderCriteria.hawkins.name);
        if (shoulderCriteria.empty_can.positive(answers)) criteriaMet.push(shoulderCriteria.empty_can.name);
    } else if (jointId.includes('knee')) {
        const kneeCriteria = clinicalCriteria.knee;
        if (kneeCriteria.mcmurray.positive(answers)) criteriaMet.push(kneeCriteria.mcmurray.name);
        if (kneeCriteria.acl_lachman.positive(answers)) criteriaMet.push(kneeCriteria.acl_lachman.name);
        if (kneeCriteria.patellofemoral.positive(answers)) criteriaMet.push(kneeCriteria.patellofemoral.name);
    } else if (jointId.includes('wrist')) {
        const wristCriteria = clinicalCriteria.wrist;
        if (wristCriteria.phalen.positive(answers)) criteriaMet.push(wristCriteria.phalen.name);
        if (wristCriteria.tinel.positive(answers)) criteriaMet.push(wristCriteria.tinel.name);
        if (wristCriteria.finkelstein.positive(answers)) criteriaMet.push(wristCriteria.finkelstein.name);
    } else if (jointId.includes('hip')) {
        const hipCriteria = clinicalCriteria.hip;
        if (hipCriteria.fabere.positive(answers)) criteriaMet.push(hipCriteria.fabere.name);
        if (hipCriteria.ober.positive(answers)) criteriaMet.push(hipCriteria.ober.name);
    } else if (jointId.includes('ankle')) {
        const ankleCriteria = clinicalCriteria.ankle;
        if (ankleCriteria.anterior_draw.positive(answers)) criteriaMet.push(ankleCriteria.anterior_draw.name);
        if (ankleCriteria.talar_tilt.positive(answers)) criteriaMet.push(ankleCriteria.talar_tilt.name);
    }
    
    return criteriaMet;
}

// نظام Bayesian لتحسين دقة التشخيص
const bayesianPriors = {
    'shoulder': {
        'impingement': 0.35,
        'rotator_cuff': 0.25,
        'frozen_shoulder': 0.15,
        'bursitis': 0.15,
        'instability': 0.10
    },
    'knee': {
        'meniscus': 0.30,
        'patellofemoral': 0.25,
        'osteoarthritis': 0.20,
        'acl_injury': 0.15,
        'bursitis': 0.10
    },
    'wrist': {
        'carpal_tunnel': 0.40,
        'de_quervain': 0.25,
        'ganglion': 0.15,
        'tendonitis': 0.20
    },
    'hip': {
        'osteoarthritis': 0.35,
        'bursitis': 0.25,
        'labral_tear': 0.20,
        'impingement': 0.20
    },
    'ankle': {
        'sprain': 0.40,
        'instability': 0.20,
        'tendonitis': 0.20,
        'fracture': 0.10,
        'arthritis': 0.10
    }
};

// دالة لحساب الاحتمالات باستخدام Bayesian
function calculateBayesianProbabilities(jointId, answers, scores) {
    let jointKey = '';
    if (jointId.includes('shoulder')) jointKey = 'shoulder';
    else if (jointId.includes('knee')) jointKey = 'knee';
    else if (jointId.includes('wrist')) jointKey = 'wrist';
    else if (jointId.includes('hip')) jointKey = 'hip';
    else if (jointId.includes('ankle')) jointKey = 'ankle';
    
    if (!jointKey || !bayesianPriors[jointKey]) {
        return scores; // العودة للنظام القديم إذا لم يكن هناك بيانات Bayesian
    }
    
    const priors = bayesianPriors[jointKey];
    let adjustedScores = [];
    
    // دمج الاحتمالات السابقة مع النتائج الحالية
    scores.forEach(score => {
        let prior = 0.20; // احتمال افتراضي موزع بالتساوي
        
        // البحث عن الاحتمال السابق المناسب
        for (const [diagnosis, priorProb] of Object.entries(priors)) {
            if (score.name.includes(diagnosis) || diagnosis.includes(score.name.split(' ')[0])) {
                prior = priorProb;
                break;
            }
        }
        
        // حساب الاحتمال المعدل باستخدام Bayesian
        // P(D|E) = P(E|D) * P(D) / P(E)
        // حيث P(E|D) هو الاحتمال الحالي من النظام القديم
        const likelihood = score.prob / 100;
        const posterior = (likelihood * prior) / (likelihood * prior + (1 - likelihood) * (1 - prior));
        
        adjustedScores.push({
            name: score.name,
            prob: Math.round(posterior * 100)
        });
    });
    
    // التأكد من أن المجموع 100%
    const total = adjustedScores.reduce((sum, s) => sum + s.prob, 0);
    if (total > 0) {
        adjustedScores = adjustedScores.map(s => ({
            name: s.name,
            prob: Math.round((s.prob / total) * 100)
        }));
    }
    
    return adjustedScores;
}

// نظام جمع البيانات المجهولة للتحليل
const anonymousDataCollection = {
    enabled: false,
    
    // دالة لتفعيل جمع البيانات
    enable: function() {
        this.enabled = true;
        localStorage.setItem('anonymousDataConsent', 'true');
    },
    
    // دالة لإيقاف جمع البيانات
    disable: function() {
        this.enabled = false;
        localStorage.setItem('anonymousDataConsent', 'false');
    },
    
    // دالة للتحقق من الموافقة
    hasConsent: function() {
        return localStorage.getItem('anonymousDataConsent') === 'true';
    },
    
    // دالة لحفظ البيانات المجهولة
    saveData: function(jointId, answers, diagnosis, severity, duration) {
        if (!this.enabled || !this.hasConsent()) return;
        
        try {
            // استرجاع البيانات الموجودة
            let existingData = JSON.parse(localStorage.getItem('anonymousDiagnosticData') || '[]');
            
            // إنشاء إدخال جديد مجهول
            const newEntry = {
                id: Date.now() + Math.random().toString(36).substr(2, 9),
                timestamp: new Date().toISOString(),
                jointId: jointId,
                answers: this.anonymizeAnswers(answers),
                diagnosis: diagnosis,
                severity: severity,
                duration: duration,
                // لا نحفظ أي معلومات تعريف شخصية
            };
            
            // إضافة الإدخال الجديد
            existingData.push(newEntry);
            
            // حفظ البيانات (محدودة بآخر 1000 إدخال)
            if (existingData.length > 1000) {
                existingData = existingData.slice(-1000);
            }
            
            localStorage.setItem('anonymousDiagnosticData', JSON.stringify(existingData));
        } catch (error) {
            console.error('Error saving anonymous data:', error);
        }
    },
    
    // دالة لإزالة المعلومات الشخصية من الإجابات
    anonymizeAnswers: function(answers) {
        const anonymized = {};
        for (const [key, value] of Object.entries(answers)) {
            // نحتفظ فقط بالإجابات المتعلقة بالأعراض
            if (!key.includes('name') && !key.includes('email') && !key.includes('phone')) {
                anonymized[key] = value;
            }
        }
        return anonymized;
    },
    
    // دالة للحصول على إحصائيات مجهولة
    getStatistics: function() {
        if (!this.hasConsent()) return null;
        
        try {
            const data = JSON.parse(localStorage.getItem('anonymousDiagnosticData') || '[]');
            
            const stats = {
                totalDiagnoses: data.length,
                byJoint: {},
                byDiagnosis: {},
                bySeverity: {}
            };
            
            data.forEach(entry => {
                // إحصائيات حسب المفصل
                if (!stats.byJoint[entry.jointId]) {
                    stats.byJoint[entry.jointId] = 0;
                }
                stats.byJoint[entry.jointId]++;
                
                // إحصائيات حسب التشخيص
                if (!stats.byDiagnosis[entry.diagnosis]) {
                    stats.byDiagnosis[entry.diagnosis] = 0;
                }
                stats.byDiagnosis[entry.diagnosis]++;
                
                // إحصائيات حسب الشدة
                if (!stats.bySeverity[entry.severity]) {
                    stats.bySeverity[entry.severity] = 0;
                }
                stats.bySeverity[entry.severity]++;
            });
            
            return stats;
        } catch (error) {
            console.error('Error getting statistics:', error);
            return null;
        }
    },
    
    // دالة لمسح البيانات المجهولة
    clearData: function() {
        localStorage.removeItem('anonymousDiagnosticData');
    }
};

// تحليل نمط الأعراض الموسع
function analyzeSymptomPattern(answers) {
    const pattern = {
        mechanical: false,
        inflammatory: false,
        neuropathic: false,
        instability: false,
        nightPain: false,
        radiating: false,
        weakness: false,
        postural: false,
        traumatic: false,
        degenerative: false,
        overuse: false
    };

    // تحليل الأنماط الميكانيكية
    if (answers.stairs_pain === "بشدة" || answers.walking_pain === "بشدة" || 
        answers.cough_pain === "نعم بشدة" || answers.flexion_relief === "نعم بشدة") {
        pattern.mechanical = true;
    }

    // تحليل الأنماط الالتهابية
    if (answers.morning_stiffness === "أكثر من 30 دقيقة" || 
        answers.stiffness_duration === "أكثر من ساعة" ||
        answers.swelling === "تورم واضح") {
        pattern.inflammatory = true;
    }

    // تحليل الأنماط العصبية
    if (answers.finger_numbness !== "لا" || answers.leg_numbness === "نعم شديد" ||
        answers.neck_radiation === "إلى الأصابع" || answers.radiation === "إلى أسفل الساق والقدم" ||
        answers.numbness_pattern !== "لا تنميل" || answers.numbness !== "لا") {
        pattern.neuropathic = true;
    }

    // تحليل عدم الاستقرار
    if (answers.instability === "كثيراً" || answers.giving_way === "كثيراً" || 
        answers.locking === "نعم كثيراً") {
        pattern.instability = true;
    }

    // تحليل الألم الليلي
    if (answers.night_pain === "في أغلب الليالي" || answers.night_symptoms === "توقظني من النوم") {
        pattern.nightPain = true;
    }

    // تحليل الألم الممتد
    if (answers.neck_radiation === "إلى الأصابع" || answers.radiation === "إلى أسفل الساق والقدم" ||
        answers.pain_location === "ينتشر للذراع" || answers.pain_location === "ينتشر للساق") {
        pattern.radiating = true;
    }

    // تحليل الضعف
    if (answers.arm_weakness === "شديد" || answers.toe_weakness === "لا أستطيع الرفع" ||
        answers.weakness === "ضعف شديد" || answers.grip_weakness === "ضعف شديد") {
        pattern.weakness = true;
    }

    // تحليل الأنماط الوضعية
    if (answers.posture === "نعم بشكل مكثف" || answers.work_sitting === "أكثر من 8 ساعات" ||
        answers.typing_computer === "أكثر من 4 ساعات يومياً" || answers.sitting_pain === "نعم بشدة") {
        pattern.postural = true;
    }

    // تحليل الأنماط الرضية
    if (answers.trauma_history === "نعم حديثة" || answers.trauma === "نعم حديثاً" ||
        answers.sprain_history === "مرة واحدة" || answers.trauma_history === "نعم قبل أقل من شهر") {
        pattern.traumatic = true;
    }

    // تحليل الأنماط التنكسية
    if (answers.morning_stiffness === "15-30 دقيقة" || answers.crepitus === "نعم مع ألم شديد" ||
        answers.clicking === "نعم مع ألم") {
        pattern.degenerative = true;
    }

    // تحليل الإفراط في الاستخدام
    if (answers.repetitive_motion === "نعم بشكل مكثف" || answers.tennis_golf === "عمل يدوي متكرر") {
        pattern.overuse = true;
    }

    return pattern;
}

// دالة مساعدة للتحقق من القيم في المصفوفات أو القيم العادية
function checkAnswer(answers, field, value) {
    const fieldValue = answers[field];
    if (Array.isArray(fieldValue)) {
        return fieldValue.includes(value);
    }
    return fieldValue === value;
}

// خوارزمية التشخيص المتقدمة والذكية - نظام موحد
async function computeDiagnosis(jointId, answers, age, bmi, duration, severity, chronicDiseases, weight, height) {
    console.log('🔵 بدء التشخيص بالنظام الموحد');
    
    try {
        // تحميل بيانات النظام الخبير
        const systemData = await initializeExpertSystem();
        console.log('📊 بيانات النظام الخبير محملة:', !!systemData);
        
        // استخدام النظام الموحد
        const result = computeDiagnosisUnified(jointId, answers, age, bmi, duration, severity, chronicDiseases, weight, height, systemData);
        console.log('📊 النتائج من النظام الموحد:', result);
        
        return result;
    } catch (error) {
        console.error('❌ خطأ في النظام الموحد، استخدام النظام الاحتياطي:', error);
        // النظام الاحتياطي
        return computeDiagnosisOld(jointId, answers, age, bmi, duration, severity, chronicDiseases, weight, height);
    }
}

// دالة التشخيص الموحدة - تستخدم البيانات من JSON مباشرة
function computeDiagnosisUnified(jointId, answers, age, bmi, duration, severity, chronicDiseases, weight, height, systemData) {
    let scores = [];
    const pattern = analyzeSymptomPattern(answers);
    
    // عوامل تعديل النقاط بناءً على العمر والوزن والأمراض المزمنة
    let ageFactor = 1;
    if (age > 70) ageFactor = 1.4;
    else if (age > 60) ageFactor = 1.3;
    else if (age > 50) ageFactor = 1.2;
    else if (age > 40) ageFactor = 1.1;
    else if (age < 30) ageFactor = 0.9;
    else if (age < 20) ageFactor = 0.85;
    
    let bmiFactor = 1;
    if (bmi > 40) bmiFactor = 1.5;
    else if (bmi > 35) bmiFactor = 1.4;
    else if (bmi > 30) bmiFactor = 1.3;
    else if (bmi > 25) bmiFactor = 1.15;
    else if (bmi < 18.5) bmiFactor = 1.1;
    
    let chronicFactor = 1;
    if (Array.isArray(chronicDiseases)) {
        if (chronicDiseases.includes('diabetes')) chronicFactor = 1.25;
        if (chronicDiseases.includes('hypertension')) chronicFactor = 1.15;
        if (chronicDiseases.includes('osteoporosis')) chronicFactor = 1.3;
        if (chronicDiseases.includes('rheumatoid')) chronicFactor = 1.4;
        if (chronicDiseases.includes('cancer_history')) chronicFactor = 1.5;
    }
    
    const combinedFactor = ageFactor * bmiFactor * chronicFactor;
    
    // استخدام البيانات من ملف JSON أو البيانات الاحتياطية
    let diagnoses = [];
    if (systemData && systemData.diagnoses) {
        diagnoses = systemData.diagnoses.diagnoses || [];
        console.log('✅ استخدام بيانات JSON للتشخيص');
    } else {
        // بيانات احتياطية
        diagnoses = [
            {
                name: 'ألم عضلي',
                region: 'shoulder',
                minConfidence: 40,
                supportingFactors: [
                    { clinicalFeature: 'pain_trigger', weight: 2 },
                    { clinicalFeature: 'swelling', weight: 1 }
                ],
                opposingFactors: []
            },
            {
                name: 'التهاب الأوتار',
                region: 'shoulder',
                minConfidence: 45,
                supportingFactors: [
                    { clinicalFeature: 'pain_trigger', weight: 3 },
                    { clinicalFeature: 'swelling', weight: 2 }
                ],
                opposingFactors: []
            },
            {
                name: 'تشنج عضلي',
                region: 'neck',
                minConfidence: 40,
                supportingFactors: [
                    { clinicalFeature: 'pain_trigger', weight: 2 }
                ],
                opposingFactors: []
            },
            {
                name: 'انزلاق غضروفي',
                region: 'lumbar',
                minConfidence: 50,
                supportingFactors: [
                    { clinicalFeature: 'pain_trigger', weight: 3 },
                    { clinicalFeature: 'swelling', weight: 1 }
                ],
                opposingFactors: []
            },
            {
                name: 'إجهاد الركبة',
                region: 'knee',
                minConfidence: 45,
                supportingFactors: [
                    { clinicalFeature: 'pain_trigger', weight: 2 },
                    { clinicalFeature: 'swelling', weight: 2 }
                ],
                opposingFactors: []
            },
            {
                name: 'التواء الكاحل',
                region: 'ankle',
                minConfidence: 50,
                supportingFactors: [
                    { clinicalFeature: 'pain_trigger', weight: 3 },
                    { clinicalFeature: 'swelling', weight: 2 }
                ],
                opposingFactors: []
            }
        ];
        console.log('⚠️ استخدام البيانات الاحتياطية للتشخيص');
    }
    
    // تحويل jointId إلى region
    const regionMap = {
        'الكتف': 'shoulder',
        'الرقبة': 'neck',
        'أسفل الظهر': 'lumbar',
        'الركبة': 'knee',
        'الكاحل': 'ankle'
    };
    
    const region = Object.keys(regionMap).find(key => jointId.includes(key)) 
        ? regionMap[Object.keys(regionMap).find(key => jointId.includes(key))]
        : 'lumbar';
    
    diagnoses.forEach(diagnosis => {
        if (diagnosis.region === region) {
            let score = 50; // نقاط أساسية
            let confidence = 50;
            
            // حساب النقاط بناءً على العوامل الداعمة
            if (diagnosis.supportingFactors) {
                diagnosis.supportingFactors.forEach(factor => {
                    const answerValue = answers[factor.clinicalFeature];
                    if (answerValue && (answerValue === 'نعم' || answerValue === 'أحياناً' || answerValue === 'حاضر' || answerValue === 'المشي' || answerValue === 'تورم خفيف' || answerValue === 'نادراً' || answerValue === 'حاد')) {
                        score += factor.weight * 5;
                        confidence += factor.weight * 3;
                    }
                });
            }
            
            // خصم النقاط بناءً على العوامل المعارضة
            if (diagnosis.opposingFactors) {
                diagnosis.opposingFactors.forEach(factor => {
                    const answerValue = answers[factor.clinicalFeature];
                    if (answerValue && (answerValue === 'نعم' || answerValue === 'أحياناً' || answerValue === 'حاضر')) {
                        score -= factor.weight * 5;
                        confidence -= factor.weight * 3;
                    }
                });
            }
            
            // تطبيق عامل التعديل المشترك
            score *= combinedFactor;
            confidence *= combinedFactor;
            
            // التأكد من الحد الأدنى للثقة
            const minConfidence = diagnosis.minConfidence || 60;
            if (confidence >= minConfidence) {
                scores.push({
                    name: diagnosis.name,
                    prob: Math.min(Math.round(confidence), 100),
                    confidence: Math.min(Math.round(confidence), 100),
                    region: diagnosis.region
                });
            }
        }
    });
    
    // إذا لم توجد نتائج، أضف تشخيص افتراضي
    if (scores.length === 0) {
        scores.push({
            name: 'ألم عام - يرجى استشارة الطبيب',
            prob: 30,
            confidence: 30,
            region: region
        });
    }
    
    // ترتيب النتائج حسب الاحتمالية
    scores.sort((a, b) => b.prob - a.prob);
    
    // إرجاع النتائج مع pattern
    return {
        scores: scores,
        confidence: scores.length > 0 ? scores[0].prob : 30,
        referral: scores.length > 0 && scores[0].prob > 70,
        urgentReferral: scores.length > 0 && scores[0].prob > 85,
        pattern: pattern
    };
}

// دالة النظام الخبير الجديد
async function computeDiagnosisNew(jointId, answers, age, bmi, duration, severity, chronicDiseases, weight, height) {
    console.log('🔵 استخدام النظام الخبير الجديد للتشخيص');
    if (!expertSystem) {
        console.log('❌ النظام الخبير غير مهيأ، استخدام النظام القديم');
        return null;
    }
    
    // تحويل معرف المفصل إلى منطقة النظام الجديد
    const regionMap = {
        'shoulder': 'shoulder',
        'elbow': 'shoulder',
        'wrist': 'shoulder',
        'lumbar': 'lumbar',
        'thoracic': 'lumbar',
        'cervical': 'lumbar',
        'hip': 'lumbar',
        'knee': 'knee',
        'ankle': 'knee',
        'foot': 'knee'
    };
    
    const region = regionMap[jointId] || 'lumbar';
    
    // بدء جلسة جديدة
    expertSystem.startSession(region);
    
    // تحويل إجابات المستخدم إلى إجابات النظام الجديد
    const newAnswers = convertAnswersToNew(answers);
    
    // إضافة الإجابات إلى النظام
    for (const [key, value] of Object.entries(newAnswers)) {
        expertSystem.addAnswer(key, value);
    }
    
    // تشغيل التحليل الكامل
    const result = expertSystem.runFullAnalysis({
        severity: severity >= 8 ? 'high' : (severity <= 3 ? 'low' : 'moderate'),
        difficultyLevel: severity >= 8 ? 'beginner' : 'intermediate'
    });
    
    // إذا كان هناك مخاطر، إرجاع تشخيص خاص
    if (result.status === 'stopped_due_to_risks') {
        return [{
            name: 'حالة طارئة - يرجى استشارتنا لتأكيد التشخيص فوراً',
            prob: 100,
            urgent: true
        }];
    }
    
    // تحويل التشخيصات إلى تنسيق النظام القديم
    const diagnoses = result.diagnoses.map(d => ({
        name: d.diagnosis.name,
        prob: Math.round(d.confidence),
        supportingFactors: d.supportingFactors,
        opposingFactors: d.opposingFactors
    }));
    
    // إذا لم توجد تشخيصات، استخدم النظام القديم
    if (diagnoses.length === 0) {
        return null;
    }
    
    return diagnoses;
}

// تحويل إجابات المستخدم من الأسئلة القديمة إلى الأسئلة الجديدة
function convertAnswersToNew(answers) {
    const newAnswers = {};
    
    // تحويل إجابات الامتداد للألم (من أسئلة مختلفة)
    if (answers.radiation && answers.radiation.includes('إلى الساق')) {
        newAnswers['pain_radiates_to_leg'] = true;
    }
    if (answers.neck_radiation && (answers.neck_radiation.includes('إلى الذراع') || answers.neck_radiation.includes('إلى الأصابع'))) {
        newAnswers['pain_radiates_to_leg'] = true;
    }
    if (answers.pain_location && answers.pain_location.includes('ينتشر للساق')) {
        newAnswers['pain_radiates_to_leg'] = true;
    }
    
    // تحويل إجابات الجلوس
    if (answers.sitting_pain === 'نعم بشدة' || answers.sitting_pain === 'نعم قليلاً') {
        newAnswers['pain_worse_with_sitting'] = true;
    }
    
    // تحويل إجابات المشي
    if (answers.walking_relief === 'نعم بشدة' || answers.walking_relief === 'نعم قليلاً') {
        newAnswers['pain_better_with_walking'] = true;
    }
    if (answers.walking_pain === 'نعم بشدة' || answers.walking_pain === 'نعم قليلاً') {
        newAnswers['pain_worse_with_activity'] = true;
    }
    
    // تحويل إجابات التنميل
    if (answers.leg_numbness && answers.leg_numbness !== 'لا') {
        newAnswers['numbness_present'] = true;
    }
    if (answers.finger_numbness && answers.finger_numbness !== 'لا') {
        newAnswers['numbness_present'] = true;
    }
    if (answers.numbness && answers.numbness.includes('في جميع الأصابع')) {
        newAnswers['numbness_present'] = true;
    }
    if (answers.numbness_pattern && answers.numbness_pattern !== 'لا تنميل') {
        newAnswers['numbness_present'] = true;
    }
    
    // تحويل إجابات الضعف
    if (answers.arm_weakness && answers.arm_weakness !== 'لا') {
        newAnswers['muscle_weakness'] = true;
    }
    if (answers.toe_weakness && answers.toe_weakness !== 'لا') {
        newAnswers['muscle_weakness'] = true;
    }
    if (answers.weakness && answers.weakness !== 'لا') {
        newAnswers['muscle_weakness'] = true;
    }
    if (answers.grip_weakness && answers.grip_weakness !== 'لا') {
        newAnswers['muscle_weakness'] = true;
    }
    
    // تحويل إجابات التيبس
    if (answers.stiffness && answers.stiffness !== 'لا') {
        newAnswers['stiffness_present'] = true;
    }
    if (answers.morning_stiffness && answers.morning_stiffness !== 'لا يوجد') {
        newAnswers['morning_stiffness'] = true;
        newAnswers['stiffness_present'] = true;
    }
    if (answers.stiffness_duration && answers.stiffness_duration !== 'لا يوجد') {
        newAnswers['morning_stiffness'] = true;
        newAnswers['stiffness_present'] = true;
    }
    
    // تحويل إجابات محدودية الحركة
    if (answers.range_motion && answers.range_motion !== 'لا') {
        newAnswers['limited_movement'] = true;
    }
    
    // تحويل إجابات التورم
    if (answers.swelling && answers.swelling !== 'لا') {
        newAnswers['swelling_present'] = true;
    }
    
    // تحويل إجابات الاحمرار
    if (answers.redness && answers.redness !== 'لا') {
        newAnswers['redness_present'] = true;
    }
    
    // تحويل إجابات الحرارة
    if (answers.heat_present === 'yes' || answers.heat_present === true) {
        newAnswers['heat_present'] = true;
    }
    
    // تحويل إجابات الطقطقة
    if (answers.crepitus && answers.crepitus !== 'لا') {
        newAnswers['clicking_popping'] = true;
    }
    if (answers.clicking && answers.clicking !== 'لا') {
        newAnswers['clicking_popping'] = true;
    }
    
    // تحويل إجابات عدم الاستقرار
    if (answers.instability && answers.instability !== 'لا' && answers.instability !== 'نادراً') {
        newAnswers['giving_way'] = true;
    }
    if (answers.giving_way && answers.giving_way !== 'لا' && answers.giving_way !== 'نادراً') {
        newAnswers['giving_way'] = true;
    }
    
    // تحويل إجابات الألم الليلي
    if (answers.night_pain && answers.night_pain !== 'لا أبداً') {
        newAnswers['night_pain'] = true;
    }
    if (answers.night_symptoms && answers.night_symptoms !== 'لا') {
        newAnswers['night_pain'] = true;
    }
    
    // تحويل إجابات الألم مع المجهود
    if (answers.pain_trigger && (answers.pain_trigger.includes('رفع الأشياء الثقيلة') || answers.pain_trigger.includes('القبض'))) {
        newAnswers['pain_with_exertion'] = true;
    }
    
    // تحويل إجابات الألم مع الانحناء
    if (answers.flexion_relief === 'نعم بشدة' || answers.flexion_relief === 'نعم قليلاً') {
        newAnswers['pain_with_bending'] = true;
    }
    
    // تحويل إجابات التشنج العضلي
    if (answers.cramps && answers.cramps !== 'لا') {
        newAnswers['muscle_spasm'] = true;
    }
    
    // تحويل إجابات الوقوف
    if (answers.standing_pain === 'نعم بشدة' || answers.standing_pain === 'نعم قليلاً') {
        newAnswers['pain_worse_with_activity'] = true;
    }
    
    // تحويل إجابات الراحة
    if (answers.standing_relief === 'نعم بشدة' || answers.standing_relief === 'نعم قليلاً') {
        newAnswers['pain_better_with_walking'] = true;
    }
    
    // تحليل النصوص المدخلة - تحسين شامل
    if (answers.pain_description) {
        const desc = answers.pain_description.toLowerCase();
        
        if (desc.includes('حارق') || desc.includes('نار') || desc.includes('لسع')) {
            newAnswers['nerveIrritation'] = true;
        }
        
        if (desc.includes('تنميل') || desc.includes('خدر') || desc.includes('وخز')) {
            newAnswers['numbness_present'] = true;
            newAnswers['nerveIrritation'] = true;
        }
        
        if (desc.includes('ضعف') || desc.includes('لا أستطيع')) {
            newAnswers['muscle_weakness'] = true;
        }
        
        if (desc.includes('تشنج') || desc.includes('انقباض')) {
            newAnswers['muscle_spasm'] = true;
        }
        
        if (desc.includes('انتشار') || desc.includes('يمتد') || desc.includes('ينتقل')) {
            newAnswers['pain_radiates_to_leg'] = true;
            newAnswers['nerveIrritation'] = true;
        }
        
        if (desc.includes('احمرار') || desc.includes('سخونة') || desc.includes('تورم')) {
            newAnswers['inflammation_signs'] = true;
        }
        
        if (desc.includes('صباحي') || desc.includes('تيبس صباحي')) {
            newAnswers['morning_stiffness'] = true;
        }
        
        if (desc.includes('تحسن مع الحركة') || desc.includes('يسوء مع الراحة')) {
            newAnswers['pain_better_with_walking'] = true;
            newAnswers['pain_worse_with_sitting'] = true;
        }
        
        if (desc.includes('يسوء مع الحركة') || desc.includes('تحسن مع الراحة')) {
            newAnswers['inflammation_signs'] = true;
            newAnswers['night_pain'] = true;
        }
    }
    
    // إضافة إجابات افتراضية إذا لم توجد أي إجابات
    if (Object.keys(newAnswers).length === 0) {
        console.log('⚠️ لم يتم تحويل أي إجابات، إضافة إجابات افتراضية للاختبار');
        console.log('📋 الإجابات الأصلية:', answers);
        // إضافة بعض الإجابات الافتراضية للاختبار
        newAnswers['limited_movement'] = true;
        newAnswers['stiffness_present'] = true;
    }
    
    console.log('📋 الإجابات المحولة:', newAnswers);
    return newAnswers;
}

// النظام القديم كاحتياطي
function computeDiagnosisOld(jointId, answers, age, bmi, duration, severity, chronicDiseases, weight, height) {
    let scores = [];
    const pattern = analyzeSymptomPattern(answers);
    
    // عوامل تعديل النقاط بناءً على العمر والوزن والأمراض المزمنة
    let ageFactor = 1;
    if (age > 70) ageFactor = 1.4;
    else if (age > 60) ageFactor = 1.3;
    else if (age > 50) ageFactor = 1.2;
    else if (age > 40) ageFactor = 1.1;
    else if (age < 30) ageFactor = 0.9;
    else if (age < 20) ageFactor = 0.85;
    
    let bmiFactor = 1;
    if (bmi > 40) bmiFactor = 1.5;
    else if (bmi > 35) bmiFactor = 1.4;
    else if (bmi > 30) bmiFactor = 1.3;
    else if (bmi > 25) bmiFactor = 1.15;
    else if (bmi < 18.5) bmiFactor = 1.1;
    
    let chronicFactor = 1;
    if (Array.isArray(chronicDiseases)) {
        if (chronicDiseases.includes('diabetes')) chronicFactor = 1.25;
        if (chronicDiseases.includes('hypertension')) chronicFactor = 1.15;
        if (chronicDiseases.includes('osteoporosis')) chronicFactor = 1.3;
        if (chronicDiseases.includes('rheumatoid')) chronicFactor = 1.4;
        if (chronicDiseases.includes('cancer_history')) chronicFactor = 1.5;
    }
    
    const combinedFactor = ageFactor * bmiFactor * chronicFactor;
    
    // بيانات احتياطية للتشخيصات (عندما يفشل تحميل JSON)
    const fallbackDiagnoses = [
        {
            name: 'ألم عضلي',
            region: 'shoulder',
            minConfidence: 40,
            supportingFactors: [
                { clinicalFeature: 'pain_trigger', weight: 2 },
                { clinicalFeature: 'swelling', weight: 1 }
            ],
            opposingFactors: []
        },
        {
            name: 'التهاب الأوتار',
            region: 'shoulder',
            minConfidence: 45,
            supportingFactors: [
                { clinicalFeature: 'pain_trigger', weight: 3 },
                { clinicalFeature: 'swelling', weight: 2 }
            ],
            opposingFactors: []
        },
        {
            name: 'تشنج عضلي',
            region: 'neck',
            minConfidence: 40,
            supportingFactors: [
                { clinicalFeature: 'pain_trigger', weight: 2 }
            ],
            opposingFactors: []
        },
        {
            name: 'انزلاق غضروفي',
            region: 'lumbar',
            minConfidence: 50,
            supportingFactors: [
                { clinicalFeature: 'pain_trigger', weight: 3 },
                { clinicalFeature: 'swelling', weight: 1 }
            ],
            opposingFactors: []
        },
        {
            name: 'إجهاد الركبة',
            region: 'knee',
            minConfidence: 45,
            supportingFactors: [
                { clinicalFeature: 'pain_trigger', weight: 2 },
                { clinicalFeature: 'swelling', weight: 2 }
            ],
            opposingFactors: []
        },
        {
            name: 'التواء الكاحل',
            region: 'ankle',
            minConfidence: 50,
            supportingFactors: [
                { clinicalFeature: 'pain_trigger', weight: 3 },
                { clinicalFeature: 'swelling', weight: 2 }
            ],
            opposingFactors: []
        }
    ];
    
    // استخدام البيانات من ملف JSON أو البيانات الاحتياطية
    let diagnoses = [];
    if (expertSystemData && expertSystemData.diagnoses) {
        diagnoses = expertSystemData.diagnoses.diagnoses || [];
    } else {
        diagnoses = fallbackDiagnoses;
        console.log('⚠️ استخدام البيانات الاحتياطية للتشخيص');
    }
    
    // تحويل jointId إلى region
    const regionMap = {
        'الكتف': 'shoulder',
        'الرقبة': 'neck',
        'أسفل الظهر': 'lumbar',
        'الركبة': 'knee',
        'الكاحل': 'ankle'
    };
    
    const region = Object.keys(regionMap).find(key => jointId.includes(key)) 
        ? regionMap[Object.keys(regionMap).find(key => jointId.includes(key))]
        : 'lumbar';
    
    diagnoses.forEach(diagnosis => {
        if (diagnosis.region === region) {
            let score = 50; // نقاط أساسية
            let confidence = 50;
            
            // حساب النقاط بناءً على العوامل الداعمة
            if (diagnosis.supportingFactors) {
                diagnosis.supportingFactors.forEach(factor => {
                    const answerValue = answers[factor.clinicalFeature];
                    if (answerValue && (answerValue === 'نعم' || answerValue === 'أحياناً' || answerValue === 'حاضر' || answerValue === 'المشي' || answerValue === 'تورم خفيف' || answerValue === 'نادراً')) {
                        score += factor.weight * 5;
                        confidence += factor.weight * 3;
                    }
                });
            }
            
            // خصم النقاط بناءً على العوامل المعارضة
            if (diagnosis.opposingFactors) {
                diagnosis.opposingFactors.forEach(factor => {
                    const answerValue = answers[factor.clinicalFeature];
                    if (answerValue && (answerValue === 'نعم' || answerValue === 'أحياناً' || answerValue === 'حاضر')) {
                        score -= factor.weight * 5;
                        confidence -= factor.weight * 3;
                    }
                });
            }
            
            // تطبيق عامل التعديل المشترك
            score *= combinedFactor;
            confidence *= combinedFactor;
            
            // التأكد من الحد الأدنى للثقة
            const minConfidence = diagnosis.minConfidence || 60;
            if (confidence >= minConfidence) {
                scores.push({
                    name: diagnosis.name,
                    prob: Math.min(Math.round(confidence), 100),
                    confidence: Math.min(Math.round(confidence), 100),
                    region: diagnosis.region
                });
            }
        }
    });
    
    // إذا لم توجد نتائج، أضف تشخيص افتراضي
    if (scores.length === 0) {
        scores.push({
            name: 'ألم عام - يرجى استشارة الطبيب',
            prob: 30,
            confidence: 30,
            region: region
        });
    }
    
    // ترتيب النتائج حسب الاحتمالية
    scores.sort((a, b) => b.prob - a.prob);
    
    // إرجاع النتائج مع pattern (نفس تنسيق النظام الموحد)
    return {
        scores: scores,
        confidence: scores.length > 0 ? scores[0].prob : 30,
        referral: scores.length > 0 && scores[0].prob > 70,
        urgentReferral: scores.length > 0 && scores[0].prob > 85,
        pattern: pattern
    };
}

// توليد التقرير النصي المفصل والشخصي
function generateDetailedReport(diagnosisList, jointName, answers, age, bmi, gender, patientName, severity, duration, chronicDiseases, pattern) {
    let primary = diagnosisList[0];
    let pronoun = gender === 'male' ? 'تعاني' : 'تعانين';
    let pronoun2 = gender === 'male' ? 'أنت' : 'أنتِ';
    let namePart = patientName ? (gender === 'male' ? `عزيزي ${patientName}` : `عزيزتي ${patientName}`) : pronoun2;
    
    // التعامل مع الحالة التي تكون فيها الاحتمالية 0% أو منخفضة جداً
    if(primary.prob === 0 || primary.prob < 10) {
        let report = `
            <div style="background: linear-gradient(135deg, #1e2633 0%, #2d3748 100%); padding: 25px; border-radius: 16px; border: 2px solid #f59e0b; margin-bottom: 20px;">
                <h3 style="color: #f59e0b; margin: 0 0 15px 0; font-size: 1.4em;">🔍 تحليل الأعراض</h3>
                <p style="color: #e5e7eb; line-height: 1.8; margin: 0;">بناءً على تحليل شامل لأعراضك ${namePart}، لم يتمكن النظام من تحديد تشخيص محدد بنسبة عالية. هذا يعني أن الأعراض غير كافية أو غير محددة للوصول إلى تشخيص دقيق.</p>
            </div>
            
            <div style="background: #1e2633; padding: 20px; border-radius: 12px; margin-bottom: 20px;">
                <h4 style="color: #d4af37; margin: 0 0 15px 0; font-size: 1.2em;">📊 تحليل نمط الأعراض</h4>
                <ul style="color: #e5e7eb; line-height: 1.8; margin: 0; padding-right: 20px;">
        `;
        
        if(pattern.mechanical) report += `<li>تشير الأعراض إلى طبيعة ميكانيكية (تزداد مع الحركات المحددة)</li>`;
        if(pattern.inflammatory) report += `<li>تشير الأعراض إلى طبيعة التهابية (تيبس صباحي، ألم مستمر)</li>`;
        if(pattern.neuropathic) report += `<li>تشير الأعراض إلى طبيعة عصبية (تنميل، امتداد الألم)</li>`;
        if(pattern.weakness) report += `<li>يوجد ضعف في العضلات يتطلب تقييماً عصبياً</li>`;
        
        report += `
                </ul>
            </div>
            
            <div style="background: linear-gradient(135deg, #dc2626 0%, #b91c1c 100%); padding: 20px; border-radius: 12px; margin-bottom: 20px;">
                <h4 style="color: white; margin: 0 0 10px 0; font-size: 1.2em;">⚠️ التوصية الطبية</h4>
                <p style="color: white; line-height: 1.8; margin: 0;">يوصى بإجراء فحص سريري متخصص لتقييم حالتك بدقة. قد يحتاج الأمر إلى صور أشعة أو رنين مغناطيسي للتأكيد.</p>
            </div>
        `;
        
        return report;
    }
    
    let report = `
        <div style="background: linear-gradient(135deg, #1e2633 0%, #2d3748 100%); padding: 25px; border-radius: 16px; border: 2px solid #10b981; margin-bottom: 20px;">
            <h3 style="color: #10b981; margin: 0 0 15px 0; font-size: 1.4em;">🏥 التشخيص المحتمل</h3>
            <p style="color: #e5e7eb; line-height: 1.8; margin: 0;">بناءً على تحليل شامل لأعراضك ${namePart}، يبدو أنك ${pronoun} من <strong style="color: #10b981; font-size: 1.2em;">${primary.name}</strong> بنسبة احتمالية <strong style="color: #10b981; font-size: 1.2em;">${primary.prob}%</strong>.</p>
        </div>
    `;
    
    // إضافة معلومات إضافية
    report += `
        <div style="background: #1e2633; padding: 20px; border-radius: 12px; margin-bottom: 20px;">
            <h4 style="color: #d4af37; margin: 0 0 15px 0; font-size: 1.2em;">📋 تفاصيل إضافية</h4>
            <p style="color: #e5e7eb; line-height: 1.8; margin: 0;">منطقة الألم: ${jointName}</p>
            <p style="color: #e5e7eb; line-height: 1.8; margin: 0;">شدة الألم: ${severity}/10</p>
            <p style="color: #e5e7eb; line-height: 1.8; margin: 0;">مدة الألم: ${duration}</p>
            ${bmi ? `<p style="color: #e5e7eb; line-height: 1.8; margin: 0;">مؤشر كتلة الجسم: ${bmi.toFixed(1)}</p>` : ''}
        </div>
    `;
    
    return report;
}

console.log('✅ Diagnostics module loaded');
