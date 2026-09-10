// ============================================
// نظام الخبير الطبي الجديد - Expert Medical System
// ============================================

// تحميل بيانات المحركات
let expertSystemData = null;
let expertSystemInitialized = false;

// تحميل بيانات المحركات من ملفات JSON (مدمجة مباشرة في الكود)
async function loadExpertSystemData() {
    if (expertSystemData) return expertSystemData;
    
    try {
        // البيانات مدمجة مباشرة في الكود بدلاً من استخدام fetch
        const symptomsData = {
  "symptoms": [
    {
      "id": "pain_radiates_to_leg",
      "question": "هل يمتد الألم إلى الساق؟",
      "clinicalFeatures": ["radiatingPain", "nerveIrritation"],
      "weight": 3
    },
    {
      "id": "pain_worse_with_sitting",
      "question": "هل يزداد الألم مع الجلوس؟",
      "clinicalFeatures": ["worseWithSitting", "nerveCompression"],
      "weight": 2
    },
    {
      "id": "pain_better_with_walking",
      "question": "هل يتحسن الألم بالمشي؟",
      "clinicalFeatures": ["betterWithWalking", "mechanicalPain"],
      "weight": 2
    },
    {
      "id": "numbness_present",
      "question": "هل تشعر بتنميل أو خدر؟",
      "clinicalFeatures": ["numbness", "nerveInvolvement"],
      "weight": 3
    },
    {
      "id": "muscle_weakness",
      "question": "هل تشعر بضعف في العضلات؟",
      "clinicalFeatures": ["muscleWeakness", "nerveDamage"],
      "weight": 3
    },
    {
      "id": "stiffness_present",
      "question": "هل تشعر بتصلب أو تيبس؟",
      "clinicalFeatures": ["stiffness", "jointRestriction"],
      "weight": 2
    },
    {
      "id": "limited_movement",
      "question": "هل لديك محدودية في الحركة؟",
      "clinicalFeatures": ["limitedMovement", "jointRestriction"],
      "weight": 2
    },
    {
      "id": "inflammation_signs",
      "question": "هل هناك احمرار أو تورم أو حرارة؟",
      "clinicalFeatures": ["inflammation", "acuteInjury"],
      "weight": 2
    },
    {
      "id": "pain_with_exertion",
      "question": "هل يزداد الألم مع المجهود؟",
      "clinicalFeatures": ["exertionRelated", "mechanicalPain"],
      "weight": 2
    },
    {
      "id": "pain_with_bending",
      "question": "هل يزداد الألم مع الانحناء؟",
      "clinicalFeatures": ["bendingRelated", "mechanicalPain"],
      "weight": 2
    },
    {
      "id": "muscle_spasm",
      "question": "هل تشعر بتشنج عضلي؟",
      "clinicalFeatures": ["muscleSpasm", "acuteInjury"],
      "weight": 2
    },
    {
      "id": "night_pain",
      "question": "هل يزداد الألم في الليل؟",
      "clinicalFeatures": ["nightPain", "inflammatory"],
      "weight": 2
    },
    {
      "id": "morning_stiffness",
      "question": "هل تشعر بتصلب في الصباح؟",
      "clinicalFeatures": ["morningStiffness", "inflammatory"],
      "weight": 2
    },
    {
      "id": "pain_worse_with_rest",
      "question": "هل يزداد الألم مع الراحة؟",
      "clinicalFeatures": ["worseWithRest", "inflammatory"],
      "weight": 2
    },
    {
      "id": "pain_worse_with_activity",
      "question": "هل يزداد الألم مع النشاط؟",
      "clinicalFeatures": ["worseWithActivity", "mechanicalPain"],
      "weight": 2
    },
    {
      "id": "clicking_popping",
      "question": "هل تسمع صوت نقرة أو فرقعة؟",
      "clinicalFeatures": ["jointInstability", "mechanicalIssue"],
      "weight": 1
    },
    {
      "id": "giving_way",
      "question": "هل يشعر المفصل بأنه يعطي أو يفقد الثبات؟",
      "clinicalFeatures": ["jointInstability", "ligamentIssue"],
      "weight": 2
    },
    {
      "id": "swelling_present",
      "question": "هل هناك تورم؟",
      "clinicalFeatures": ["swelling", "inflammation"],
      "weight": 2
    },
    {
      "id": "redness_present",
      "question": "هل هناك احمرار؟",
      "clinicalFeatures": ["redness", "inflammation"],
      "weight": 2
    },
    {
      "id": "heat_present",
      "question": "هل هناك حرارة في المنطقة؟",
      "clinicalFeatures": ["heat", "inflammation"],
      "weight": 2
    }
  ],
  "clinicalFeatures": {
    "radiatingPain": {
      "name": "انتشار الألم",
      "description": "الألم يمتد من المنطقة الأصلية إلى مناطق أخرى"
    },
    "nerveIrritation": {
      "name": "تهيج عصبي",
      "description": "تهيج أو ضغط على الأعصاب"
    },
    "worseWithSitting": {
      "name": "زيادة الألم مع الجلوس",
      "description": "الألم يزداد عند الجلوس لفترات طويلة"
    },
    "betterWithWalking": {
      "name": "تحسن بالمشي",
      "description": "الألم يتحسن مع الحركة والمشي"
    },
    "nerveCompression": {
      "name": "ضغط عصبي",
      "description": "ضغط على الأعصاب يسبب أعراض عصبية"
    },
    "mechanicalPain": {
      "name": "ألم ميكانيكي",
      "description": "ألم مرتبط بالحركة والوضعية"
    },
    "numbness": {
      "name": "تنميل",
      "description": "شعور بالخدر أو فقدان الإحساس"
    },
    "nerveInvolvement": {
      "name": "تورط عصبي",
      "description": "تورط الأعصاب في المشكلة"
    },
    "muscleWeakness": {
      "name": "ضعف عضلي",
      "description": "ضعف في قوة العضلات"
    },
    "nerveDamage": {
      "name": "ضرر عصبي",
      "description": "ضرر فعلي في الأعصاب"
    },
    "stiffness": {
      "name": "تيبس",
      "description": "شعور بالصلابة وتقليل المرونة"
    },
    "jointRestriction": {
      "name": "محدودية مفصلية",
      "description": "محدودية في حركة المفاصل"
    },
    "limitedMovement": {
      "name": "محدودية الحركة",
      "description": "صعوبة في الحركة الطبيعية"
    },
    "inflammation": {
      "name": "التهاب",
      "description": "استجابة التهابية في الأنسجة"
    },
    "acuteInjury": {
      "name": "إصابة حادة",
      "description": "إصابة حديثة أو حادة"
    },
    "exertionRelated": {
      "name": "مرتبط بالمجهود",
      "description": "الألم يظهر مع المجهود البدني"
    },
    "bendingRelated": {
      "name": "مرتبط بالانحناء",
      "description": "الألم يزداد مع الانحناء"
    },
    "muscleSpasm": {
      "name": "تشنج عضلي",
      "description": "انقباض غير إرادي للعضلات"
    },
    "nightPain": {
      "name": "ألم ليلي",
      "description": "الألم يزداد في الليل"
    },
    "inflammatory": {
      "name": "التهابي",
      "description": "طبيعة التهابية للمشكلة"
    },
    "morningStiffness": {
      "name": "تيبس صباحي",
      "description": "تيبس يظهر في الصباح"
    },
    "worseWithRest": {
      "name": "زيادة مع الراحة",
      "description": "الألم يزداد عند الراحة"
    },
    "worseWithActivity": {
      "name": "زيادة مع النشاط",
      "description": "الألم يزداد مع النشاط البدني"
    },
    "jointInstability": {
      "name": "عدم ثبات المفصل",
      "description": "المفصل يشعر بعدم الثبات"
    },
    "mechanicalIssue": {
      "name": "مشكلة ميكانيكية",
      "description": "مشكلة في الميكانيكا الحيوية"
    },
    "ligamentIssue": {
      "name": "مشكلة رباطية",
      "description": "مشكلة في الأربطة"
    },
    "swelling": {
      "name": "تورم",
      "description": "تراكم السوائل في الأنسجة"
    },
    "redness": {
      "name": "احمرار",
      "description": "احمرار في المنطقة المصابة"
    },
    "heat": {
      "name": "حرارة",
      "description": "ارتفاع درجة حرارة المنطقة"
    }
  }
};
        
        const diagnosesData = {
  "diagnoses": [
    {
      "id": "herniated_disc",
      "name": "انزلاق غضروفي",
      "region": "lumbar",
      "supportingFactors": [
        {
          "clinicalFeature": "radiatingPain",
          "weight": 3,
          "reason": "الانزلاق الغضروفي يضغط على العصب ويسبب انتشار الألم للساق"
        },
        {
          "clinicalFeature": "numbness",
          "weight": 3,
          "reason": "الضغط على العصب يسبب تنميل في المنطقة المغذية"
        },
        {
          "clinicalFeature": "worseWithSitting",
          "weight": 2,
          "reason": "الجلوس يزيد الضغط على الغضروف والعصب"
        },
        {
          "clinicalFeature": "betterWithWalking",
          "weight": 2,
          "reason": "المشي يقلل الضغط على العصب"
        },
        {
          "clinicalFeature": "muscleWeakness",
          "weight": 3,
          "reason": "الضغط العصبي يسبب ضعفاً عضلياً"
        }
      ],
      "opposingFactors": [
        {
          "clinicalFeature": "worseWithRest",
          "weight": -2,
          "reason": "الانزلاق الغضروفي عادة يتحسن بالراحة"
        },
        {
          "clinicalFeature": "morningStiffness",
          "weight": -1,
          "reason": "التيبس الصباحي أكثر شيوعاً في الحالات الالتهابية"
        }
      ],
      "minConfidence": 60
    },
    {
      "id": "muscle_strain",
      "name": "إجهاد عضلي",
      "region": "lumbar",
      "supportingFactors": [
        {
          "clinicalFeature": "muscleSpasm",
          "weight": 3,
          "reason": "الإجهاد العضلي يسبب تشنجاً عضلياً"
        },
        {
          "clinicalFeature": "worseWithActivity",
          "weight": 2,
          "reason": "النشاط يزيد الإجهاد العضلي"
        },
        {
          "clinicalFeature": "betterWithRest",
          "weight": 2,
          "reason": "الراحة تساعد على شفاء العضلات"
        },
        {
          "clinicalFeature": "limitedMovement",
          "weight": 2,
          "reason": "الإجهاد يسبب محدودية في الحركة"
        },
        {
          "clinicalFeature": "acuteInjury",
          "weight": 2,
          "reason": "غالباً يحدث بعد إصابة حادة"
        }
      ],
      "opposingFactors": [
        {
          "clinicalFeature": "radiatingPain",
          "weight": -2,
          "reason": "الإجهاد العضلي نادراً ما يسبب انتشار الألم"
        },
        {
          "clinicalFeature": "numbness",
          "weight": -3,
          "reason": "الإجهاد العضلي لا يسبب تنميلاً"
        }
      ],
      "minConfidence": 50
    },
    {
      "id": "spinal_stenosis",
      "name": "تضيق العمود الفقري",
      "region": "lumbar",
      "supportingFactors": [
        {
          "clinicalFeature": "worseWithWalking",
          "weight": 3,
          "reason": "المشي يزيد الضغط على الأعصاب في التضيق"
        },
        {
          "clinicalFeature": "betterWithSitting",
          "weight": 3,
          "reason": "الجلوس يفتح القناة الفقرية ويقلل الضغط"
        },
        {
          "clinicalFeature": "radiatingPain",
          "weight": 2,
          "reason": "التضيق يضغط على الأعصاب ويسبب انتشار الألم"
        },
        {
          "clinicalFeature": "numbness",
          "weight": 2,
          "reason": "الضغط العصبي يسبب تنميلاً"
        }
      ],
      "opposingFactors": [
        {
          "clinicalFeature": "worseWithSitting",
          "weight": -3,
          "reason": "التضيق عادة يتحسن بالجلوس"
        },
        {
          "clinicalFeature": "muscleSpasm",
          "weight": -1,
          "reason": "التشنج العضلي ليس سمة رئيسية للتضيق"
        }
      ],
      "minConfidence": 60
    },
    {
      "id": "sciatica",
      "name": "عصب الورك",
      "region": "lumbar",
      "supportingFactors": [
        {
          "clinicalFeature": "radiatingPain",
          "weight": 3,
          "reason": "عصب الورك يسبب انتشار الألم من الظهر للساق"
        },
        {
          "clinicalFeature": "numbness",
          "weight": 2,
          "reason": "تهيج العصب يسبب تنميلاً"
        },
        {
          "clinicalFeature": "worseWithSitting",
          "weight": 2,
          "reason": "الجلوس يزيد الضغط على عصب الورك"
        },
        {
          "clinicalFeature": "nerveIrritation",
          "weight": 3,
          "reason": "تهيج واضح للعصب"
        }
      ],
      "opposingFactors": [
        {
          "clinicalFeature": "worseWithRest",
          "weight": -1,
          "reason": "عصب الورك عادة يتحسن بالراحة"
        }
      ],
      "minConfidence": 55
    },
    {
      "id": "facet_joint_arthritis",
      "name": "خشونة مفاصل الوجه",
      "region": "lumbar",
      "supportingFactors": [
        {
          "clinicalFeature": "worseWithActivity",
          "weight": 2,
          "reason": "النشاط يزيد الضغط على المفاصل"
        },
        {
          "clinicalFeature": "betterWithRest",
          "weight": 2,
          "reason": "الراحة تقلل الضغط على المفاصل"
        },
        {
          "clinicalFeature": "morningStiffness",
          "weight": 2,
          "reason": "الخشونة تسبب تيبساً صباحياً"
        },
        {
          "clinicalFeature": "stiffness",
          "weight": 2,
          "reason": "الخشونة تسبب تيبساً عاماً"
        },
        {
          "clinicalFeature": "limitedMovement",
          "weight": 2,
          "reason": "الخشونة تحد من الحركة"
        }
      ],
      "opposingFactors": [
        {
          "clinicalFeature": "radiatingPain",
          "weight": -2,
          "reason": "خشونة المفاصل نادراً ما تسبب انتشار الألم"
        },
        {
          "clinicalFeature": "numbness",
          "weight": -3,
          "reason": "خشونة المفاصل لا تسبب تنميلاً"
        }
      ],
      "minConfidence": 50
    },
    {
      "id": "sacroiliac_joint_dysfunction",
      "name": "خلل مفصل العجز الحرقفي",
      "region": "sacrum",
      "supportingFactors": [
        {
          "clinicalFeature": "worseWithActivity",
          "weight": 2,
          "reason": "النشاط يزيد الضغط على المفصل"
        },
        {
          "clinicalFeature": "betterWithRest",
          "weight": 2,
          "reason": "الراحة تقلل الضغط على المفصل"
        },
        {
          "clinicalFeature": "limitedMovement",
          "weight": 2,
          "reason": "الخلل يحد من الحركة"
        },
        {
          "clinicalFeature": "mechanicalPain",
          "weight": 2,
          "reason": "مشكلة ميكانيكية في المفصل"
        }
      ],
      "opposingFactors": [
        {
          "clinicalFeature": "radiatingPain",
          "weight": -1,
          "reason": "الخلل نادراً ما يسبب انتشار الألم للساق"
        },
        {
          "clinicalFeature": "numbness",
          "weight": -3,
          "reason": "الخلل لا يسبب تنميلاً"
        }
      ],
      "minConfidence": 45
    },
    {
      "id": "shoulder_impingement",
      "name": "انحشار الكتف",
      "region": "shoulder",
      "supportingFactors": [
        {
          "clinicalFeature": "worseWithActivity",
          "weight": 3,
          "reason": "رفع الذراع يزيد الانحشار"
        },
        {
          "clinicalFeature": "limitedMovement",
          "weight": 2,
          "reason": "الانحشار يحد من حركة الذراع"
        },
        {
          "clinicalFeature": "nightPain",
          "weight": 2,
          "reason": "الألم يزداد في الليل"
        },
        {
          "clinicalFeature": "mechanicalPain",
          "weight": 2,
          "reason": "مشكلة ميكانيكية في الكتف"
        }
      ],
      "opposingFactors": [
        {
          "clinicalFeature": "radiatingPain",
          "weight": -1,
          "reason": "الانحشار نادراً ما يسبب انتشار الألم"
        },
        {
          "clinicalFeature": "numbness",
          "weight": -3,
          "reason": "الانحشار لا يسبب تنميلاً"
        }
      ],
      "minConfidence": 55
    },
    {
      "id": "rotator_cuff_tendinitis",
      "name": "التهاب أوتار الكفة المدورة",
      "region": "shoulder",
      "supportingFactors": [
        {
          "clinicalFeature": "worseWithActivity",
          "weight": 3,
          "reason": "النشاط يزيد التهاب الأوتار"
        },
        {
          "clinicalFeature": "betterWithRest",
          "weight": 2,
          "reason": "الراحة تقلل الالتهاب"
        },
        {
          "clinicalFeature": "nightPain",
          "weight": 2,
          "reason": "الالتهاب يسبب ألماً ليلياً"
        },
        {
          "clinicalFeature": "inflammation",
          "weight": 2,
          "reason": "التهاب واضح في الأوتار"
        }
      ],
      "opposingFactors": [
        {
          "clinicalFeature": "radiatingPain",
          "weight": -1,
          "reason": "التهاب الأوتار نادراً ما يسبب انتشار الألم"
        },
        {
          "clinicalFeature": "numbness",
          "weight": -3,
          "reason": "التهاب الأوتار لا يسبب تنميلاً"
        }
      ],
      "minConfidence": 50
    },
    {
      "id": "frozen_shoulder",
      "name": "الكتف المتجمد",
      "region": "shoulder",
      "supportingFactors": [
        {
          "clinicalFeature": "stiffness",
          "weight": 3,
          "reason": "تيبس شديد في الكتف"
        },
        {
          "clinicalFeature": "limitedMovement",
          "weight": 3,
          "reason": "محدودية شديدة في الحركة"
        },
        {
          "clinicalFeature": "morningStiffness",
          "weight": 2,
          "reason": "تيبس صباحي واضح"
        },
        {
          "clinicalFeature": "worseWithRest",
          "weight": 1,
          "reason": "الراحة تزيد التيبس"
        }
      ],
      "opposingFactors": [
        {
          "clinicalFeature": "radiatingPain",
          "weight": -1,
          "reason": "الكتف المتجمد نادراً ما يسبب انتشار الألم"
        },
        {
          "clinicalFeature": "numbness",
          "weight": -3,
          "reason": "الكتف المتجمد لا يسبب تنميلاً"
        }
      ],
      "minConfidence": 60
    },
    {
      "id": "knee_osteoarthritis",
      "name": "خشونة الركبة",
      "region": "knee",
      "supportingFactors": [
        {
          "clinicalFeature": "worseWithActivity",
          "weight": 2,
          "reason": "النشاط يزيد الضغط على المفصل"
        },
        {
          "clinicalFeature": "betterWithRest",
          "weight": 2,
          "reason": "الراحة تقلل الضغط"
        },
        {
          "clinicalFeature": "morningStiffness",
          "weight": 2,
          "reason": "الخشونة تسبب تيبساً صباحياً"
        },
        {
          "clinicalFeature": "stiffness",
          "weight": 2,
          "reason": "تيبس عام في المفصل"
        },
        {
          "clinicalFeature": "limitedMovement",
          "weight": 2,
          "reason": "الخشونة تحد من الحركة"
        }
      ],
      "opposingFactors": [
        {
          "clinicalFeature": "radiatingPain",
          "weight": -2,
          "reason": "خشونة الركبة لا تسبب انتشار الألم"
        },
        {
          "clinicalFeature": "numbness",
          "weight": -3,
          "reason": "خشونة الركبة لا تسبب تنميلاً"
        }
      ],
      "minConfidence": 55
    },
    {
      "id": "meniscus_tear",
      "name": "تمزق الغضروف الهلالي",
      "region": "knee",
      "supportingFactors": [
        {
          "clinicalFeature": "jointInstability",
          "weight": 2,
          "reason": "التمزق يسبب عدم ثبات المفصل"
        },
        {
          "clinicalFeature": "givingWay",
          "weight": 3,
          "reason": "المفصل يعطي أو يفقد الثبات"
        },
        {
          "clinicalFeature": "clickingPopping",
          "weight": 2,
          "reason": "التمزق يسبب صوت نقرة"
        },
        {
          "clinicalFeature": "limitedMovement",
          "weight": 2,
          "reason": "التمزق يحد من الحركة"
        },
        {
          "clinicalFeature": "acuteInjury",
          "weight": 2,
          "reason": "غالباً يحدث بعد إصابة حادة"
        }
      ],
      "opposingFactors": [
        {
          "clinicalFeature": "morningStiffness",
          "weight": -1,
          "reason": "التيبس الصباحي ليس سمة رئيسية للتمزق"
        },
        {
          "clinicalFeature": "radiatingPain",
          "weight": -2,
          "reason": "التمزق لا يسبب انتشار الألم"
        }
      ],
      "minConfidence": 55
    }
  ]
};
        
        const treatmentGoalsData = {
  "treatmentGoals": [
    {
      "id": "reduce_nerve_pressure",
      "name": "تقليل الضغط العصبي",
      "description": "تقليل الضغط على الأعصاب لتخفيف الأعراض العصبية",
      "requiredClinicalFeatures": ["radiatingPain", "nerveIrritation", "numbness"],
      "optionalClinicalFeatures": ["muscleWeakness", "worseWithSitting"],
      "priority": "high",
      "estimatedDuration": "4-6 أسابيع"
    },
    {
      "id": "improve_range_of_motion",
      "name": "تحسين مدى الحركة",
      "description": "تحسين مرونة المفاصل وزيادة مدى الحركة",
      "requiredClinicalFeatures": ["stiffness", "limitedMovement"],
      "optionalClinicalFeatures": ["morningStiffness", "jointRestriction"],
      "priority": "high",
      "estimatedDuration": "3-4 أسابيع"
    },
    {
      "id": "reduce_muscle_spasm",
      "name": "تقليل التشنج العضلي",
      "description": "تقليل التشنج العضلي وتحسين استرخاء العضلات",
      "requiredClinicalFeatures": ["muscleSpasm"],
      "optionalClinicalFeatures": ["limitedMovement", "acuteInjury"],
      "priority": "high",
      "estimatedDuration": "1-2 أسابيع"
    },
    {
      "id": "improve_joint_stability",
      "name": "تحسين ثبات المفصل",
      "description": "تقوية العضلات المحيطة بالمفصل لتحسين الثبات",
      "requiredClinicalFeatures": ["jointInstability", "givingWay"],
      "optionalClinicalFeatures": ["limitedMovement", "muscleWeakness"],
      "priority": "high",
      "estimatedDuration": "6-8 أسابيع"
    },
    {
      "id": "improve_muscle_flexibility",
      "name": "تحسين مرونة العضلات",
      "description": "تحسين مرونة العضلات وتقليل التوتر",
      "requiredClinicalFeatures": ["stiffness"],
      "optionalClinicalFeatures": ["limitedMovement", "muscleSpasm"],
      "priority": "medium",
      "estimatedDuration": "3-4 أسابيع"
    },
    {
      "id": "reduce_mechanical_inflammation",
      "name": "تقليل الالتهاب الميكانيكي",
      "description": "تقليل الالتهاب الناتج عن الإجهاد الميكانيكي",
      "requiredClinicalFeatures": ["inflammation", "mechanicalPain"],
      "optionalClinicalFeatures": ["worseWithActivity", "swelling"],
      "priority": "medium",
      "estimatedDuration": "2-3 أسابيع"
    },
    {
      "id": "restore_normal_movement",
      "name": "استعادة الحركة الطبيعية",
      "description": "استعادة أنماط الحركة الطبيعية والصحيحة",
      "requiredClinicalFeatures": ["limitedMovement", "mechanicalIssue"],
      "optionalClinicalFeatures": ["stiffness", "jointRestriction"],
      "priority": "medium",
      "estimatedDuration": "4-6 أسابيع"
    },
    {
      "id": "reduce_acute_inflammation",
      "name": "تقليل الالتهاب الحاد",
      "description": "تقليل الالتهاب الحاد والتورم",
      "requiredClinicalFeatures": ["acuteInjury", "inflammation"],
      "optionalClinicalFeatures": ["swelling", "redness", "heat"],
      "priority": "high",
      "estimatedDuration": "1-2 أسابيع"
    },
    {
      "id": "improve_posture",
      "name": "تحسين الوضعية",
      "description": "تحسين الوضعية العامة لتقليل الضغط على المفاصل",
      "requiredClinicalFeatures": ["mechanicalPain", "worseWithActivity"],
      "optionalClinicalFeatures": ["stiffness", "limitedMovement"],
      "priority": "medium",
      "estimatedDuration": "4-6 أسابيع"
    },
    {
      "id": "strengthen_core_muscles",
      "name": "تقوية عضلات الجذع",
      "description": "تقوية عضلات الجذع لدعم العمود الفقري",
      "requiredClinicalFeatures": ["mechanicalPain", "limitedMovement"],
      "optionalClinicalFeatures": ["muscleWeakness", "stiffness"],
      "priority": "medium",
      "estimatedDuration": "6-8 أسابيع"
    },
    {
      "id": "reduce_nerve_irritation",
      "name": "تقليل تهيج العصب",
      "description": "تقليل تهيج العصب وتخفيف الأعراض العصبية",
      "requiredClinicalFeatures": ["nerveIrritation", "radiatingPain"],
      "optionalClinicalFeatures": ["numbness", "worseWithSitting"],
      "priority": "high",
      "estimatedDuration": "3-4 أسابيع"
    },
    {
      "id": "improve_circulation",
      "name": "تحسين الدورة الدموية",
      "description": "تحسين الدورة الدموية لتسريع الشفاء",
      "requiredClinicalFeatures": ["inflammation", "acuteInjury"],
      "optionalClinicalFeatures": ["swelling", "heat"],
      "priority": "low",
      "estimatedDuration": "2-3 أسابيع"
    },
    {
      "id": "reduce_pain_with_movement",
      "name": "تقليل الألم مع الحركة",
      "description": "تقليل الألم المرتبط بالحركة والنشاط",
      "requiredClinicalFeatures": ["worseWithActivity", "mechanicalPain"],
      "optionalClinicalFeatures": ["limitedMovement", "stiffness"],
      "priority": "medium",
      "estimatedDuration": "3-4 أسابيع"
    },
    {
      "id": "improve_functional_movement",
      "name": "تحسين الحركة الوظيفية",
      "description": "تحسين القدرة على أداء الأنشطة اليومية",
      "requiredClinicalFeatures": ["limitedMovement", "mechanicalIssue"],
      "optionalClinicalFeatures": ["stiffness", "jointRestriction"],
      "priority": "medium",
      "estimatedDuration": "4-6 أسابيع"
    },
    {
      "id": "reduce_chronic_pain",
      "name": "تقليل الألم المزمن",
      "description": "إدارة وتقليل الألم المزمن",
      "requiredClinicalFeatures": ["worseWithRest", "inflammatory"],
      "optionalClinicalFeatures": ["morningStiffness", "nightPain"],
      "priority": "high",
      "estimatedDuration": "8-12 أسابيع"
    }
  ]
};
        
        const exercisesData = {
  "exercises": [
    {
      "id": "nerve_flossing_lumbar",
      "title": "تمرين لتقليل الضغط الممتد من أسفل الظهر إلى الساق",
      "treatmentGoals": ["reduce_nerve_pressure", "reduce_nerve_irritation"],
      "difficultyLevel": "beginner",
      "region": "lumbar",
      "contraindications": ["severe_pain", "acute_injury", "muscle_weakness"],
      "instructions": {
        "why": "هذا التمرين يساعد على تقليل الضغط على العصب الممتد من أسفل الظهر إلى الساق عن طريق تحريك العصب بلطف داخل القناة العصبية",
        "steps": [
          "استلقِ على ظهرك على سطح مستوٍ",
          "اثنِ ركبتيك وضعهما على الأرض",
          "أمسك ركبتك اليمنى بكلتا يديك",
          "اسحب الركبة ببطء نحو صدرك حتى تشعر بتمدد خفيف",
          "أرجع الركبة ببطء إلى وضع البداية",
          "كرر التمرين مع الركبة اليسرى"
        ],
        "repetitions": "10-15 تكرار لكل ركبة",
        "sets": "2-3 جولات",
        "restDuration": "30 ثانية بين الجولات",
        "expectedSensation": "شعور بتمدد خفيف في أسفل الظهر والساق",
        "stopImmediately": "إذا شعرت بألم حاد أو تنميل شديد أو ضعف في الساق"
      }
    },
    {
      "id": "mckenzie_extension_lumbar",
      "title": "تمرين للمساعدة في تقليل الضغط الممتد من أسفل الظهر إلى الساق",
      "treatmentGoals": ["reduce_nerve_pressure", "reduce_nerve_irritation"],
      "difficultyLevel": "beginner",
      "region": "lumbar",
      "contraindications": ["severe_pain", "acute_injury", "muscle_weakness"],
      "instructions": {
        "why": "هذا التمرين يساعد على تقليل الضغط على الغضروف والعصب عن طريق إطالة العمود الفقري للخلف",
        "steps": [
          "استلقِ على بطنك على سطح مستوٍ",
          "ضع يديك تحت كتفيك",
          "اضغط على يديك لرفع الجزء العلوي من جسمك ببطء",
          "حافظ على حوضك على الأرض",
          "ارفع جسمك حتى تشعر بتمدد خفيف في أسفل الظهر",
          "احتفظ بالوضعية لمدة 2-3 ثواني",
          "أنزل جسمك ببطء إلى وضع البداية"
        ],
        "repetitions": "10-15 تكرار",
        "sets": "2-3 جولات",
        "restDuration": "30 ثانية بين الجولات",
        "expectedSensation": "شعور بتمدد خفيف في أسفل الظهر",
        "stopImmediately": "إذا شعرت بألم حاد أو زيادة في التنميل"
      }
    },
    {
      "id": "cat_cow_stretch",
      "title": "تمرين لتحسين مرونة العمود الفقري وتقليل التيبس",
      "treatmentGoals": ["improve_range_of_motion", "improve_muscle_flexibility", "restore_normal_movement"],
      "difficultyLevel": "beginner",
      "region": "lumbar",
      "contraindications": ["severe_pain", "acute_injury"],
      "instructions": {
        "why": "هذا التمرين يساعد على تحسين مرونة العمود الفقري وتقليل التيبس عن طريق تحريك العمود الفقري في اتجاهين مختلفين",
        "steps": [
          "ابدأ على أربع بوضعية اليدين والركبتين",
          "ضع يديك تحت كتفيك وركبتيك تحت وركيك",
          "أرخِ رأسك لأسفل واربط ظهرك للأعلى (وضعية القطة)",
          "احتفظ بالوضعية لمدة 2-3 ثواني",
          "ارفع رأسك للأعلى وانحنِ ظهرك للأسفل (وضعية البقرة)",
          "احتفظ بالوضعية لمدة 2-3 ثواني",
          "كرر الحركة ببطء وبشكل متكرر"
        ],
        "repetitions": "10-15 تكرار",
        "sets": "2-3 جولات",
        "restDuration": "30 ثانية بين الجولات",
        "expectedSensation": "شعور بتمدد خفيف في العمود الفقري",
        "stopImmediately": "إذا شعرت بألم حاد"
      }
    },
    {
      "id": "pelvic_tilt",
      "title": "تمرين لتقوية عضلات البطن وتحسين ثبات العمود الفقري",
      "treatmentGoals": ["improve_joint_stability", "strengthen_core_muscles", "improve_posture"],
      "difficultyLevel": "beginner",
      "region": "lumbar",
      "contraindications": ["severe_pain", "acute_injury"],
      "instructions": {
        "why": "هذا التمرين يساعد على تقوية عضلات البطن وتحسين ثبات العمود الفقري عن طريق تحريك الحوض",
        "steps": [
          "استلقِ على ظهرك مع ثني الركبتين",
          "ضع قدميك على الأرض بعرض الكتفين",
          "اضغط ظهرك على الأرض",
          "شد عضلات بطنك",
          "حرك حوضك للأعلى ببطء",
          "احتفظ بالوضعية لمدة 5-10 ثواني",
          "أرخِ الحوض ببطء إلى وضع البداية"
        ],
        "repetitions": "10-15 تكرار",
        "sets": "2-3 جولات",
        "restDuration": "30 ثانية بين الجولات",
        "expectedSensation": "شعور بتوتر خفيف في عضلات البطن",
        "stopImmediately": "إذا شعرت بألم حاد"
      }
    },
    {
      "id": "hamstring_stretch",
      "title": "تمرين لتحسين مرونة عضلات الفخذ الخلفية",
      "treatmentGoals": ["improve_muscle_flexibility", "improve_range_of_motion", "reduce_mechanical_inflammation"],
      "difficultyLevel": "beginner",
      "region": "lumbar",
      "contraindications": ["severe_pain", "acute_injury"],
      "instructions": {
        "why": "هذا التمرين يساعد على تحسين مرونة عضلات الفخذ الخلفية وتقليل الضغط على أسفل الظهر",
        "steps": [
          "استلقِ على ظهرك",
          "اثنِ ركبة واحدة وضعهما على الأرض",
          "ارفع الرجل الأخرى ببطء",
          "أمسك الرجل المرفوعة من خلف الركبة",
          "اسحب الرجل ببطء نحو صدرك",
          "احتفظ بالوضعية لمدة 20-30 ثانية",
          "أنزل الرجل ببطء إلى وضع البداية",
          "كرر مع الرجل الأخرى"
        ],
        "repetitions": "2-3 تكرار لكل رجل",
        "sets": "2-3 جولات",
        "restDuration": "30 ثانية بين الجولات",
        "expectedSensation": "شعور بتمدد خفيف في عضلات الفخذ الخلفية",
        "stopImmediately": "إذا شعرت بألم حاد"
      }
    },
    {
      "id": "shoulder_pendulum",
      "title": "تمرين لتحسين حركة الكتف وتقليل الألم",
      "treatmentGoals": ["improve_range_of_motion", "reduce_mechanical_inflammation", "restore_normal_movement"],
      "difficultyLevel": "beginner",
      "region": "shoulder",
      "contraindications": ["severe_pain", "acute_injury"],
      "instructions": {
        "why": "هذا التمرين يساعد على تحسين حركة الكتف وتقليل الألم عن طريق استخدام الجاذبية لتحريك الذراع",
        "steps": [
          "قف بجانب طاولة",
          "اتكأ على الطاولة بذراعك السليم",
          "دع الذراع المصابة تتدلى بحرية",
          "استخدم وزن جسمك فقط، لا تستخدم عضلاتك",
          "حرك الذراع في دوائر صغيرة (حجم طبق)",
          "حرك 10 مرات في اتجاه عقارب الساعة",
          "حرك 10 مرات في عكس اتجاه عقارب الساعة",
          "حرك الذراع للأمام والخلف 10 مرات",
          "حرك الذراع للجانبين 10 مرات"
        ],
        "repetitions": "10 مرات لكل اتجاه",
        "sets": "3 مرات يومياً",
        "restDuration": "لا حاجة للراحة",
        "expectedSensation": "شعور بحركة خفيفة في الكتف",
        "stopImmediately": "إذا شعرت بألم حاد"
      }
    },
    {
      "id": "shoulder_wall_walk",
      "title": "تمرين لتحسين مدى حركة رفع الذراع",
      "treatmentGoals": ["improve_range_of_motion", "restore_normal_movement"],
      "difficultyLevel": "intermediate",
      "region": "shoulder",
      "contraindications": ["severe_pain", "acute_injury"],
      "instructions": {
        "why": "هذا التمرين يساعد على تحسين مدى حركة رفع الذراع عن طريق استخدام الحائط كدعم",
        "steps": [
          "قف أمام حائط",
          "ضع يديك على الحائط عند مستوى الخصر",
          "امشِ بأصابعك ببطء على الحائط للأعلى",
          "استمر حتى مستوى الكتف أو حتى تشعر بألم",
          "أنزل يديك ببطء إلى وضع البداية",
          "كرر التمرين عدة مرات"
        ],
        "repetitions": "10-20 مرة",
        "sets": "2-3 جولات",
        "restDuration": "30 ثانية بين الجولات",
        "expectedSensation": "شعور بتمدد خفيف في الكتف",
        "stopImmediately": "إذا شعرت بألم حاد"
      }
    },
    {
      "id": "knee_straight_leg_raise",
      "title": "تمرين لتقوية عضلات الفخذ الأمامية",
      "treatmentGoals": ["improve_joint_stability", "strengthen_core_muscles"],
      "difficultyLevel": "beginner",
      "region": "knee",
      "contraindications": ["severe_pain", "acute_injury"],
      "instructions": {
        "why": "هذا التمرين يساعد على تقوية عضلات الفخذ الأمامية وتحسين ثبات الركبة",
        "steps": [
          "استلقِ على ظهرك",
          "اثنِ ركبة واحدة وضعهما على الأرض",
          "حافظ على الرجل الأخرى مستقيمة",
          "ارفع الرجل المستقيمة ببطء حتى مستوى الركبة الأخرى",
          "احتفظ بالوضعية لمدة 2-3 ثواني",
          "أنزل الرجل ببطء إلى وضع البداية",
          "كرر مع الرجل الأخرى"
        ],
        "repetitions": "10-15 تكرار لكل رجل",
        "sets": "2-3 جولات",
        "restDuration": "30 ثانية بين الجولات",
        "expectedSensation": "شعور بتوتر خفيف في عضلات الفخذ",
        "stopImmediately": "إذا شعرت بألم حاد"
      }
    },
    {
      "id": "knee_wall_sit",
      "title": "تمرين لتقوية عضلات الفخذ وتحسين ثبات الركبة",
      "treatmentGoals": ["improve_joint_stability", "strengthen_core_muscles"],
      "difficultyLevel": "intermediate",
      "region": "knee",
      "contraindications": ["severe_pain", "acute_injury"],
      "instructions": {
        "why": "هذا التمرين يساعد على تقوية عضلات الفخذ وتحسين ثبات الركبة",
        "steps": [
          "قف بظهرك ضد الحائط",
          "ضع قدميك على الأرض بعرض الكتفين",
          "انزل ببطء حتى تكون ركبتاك بزاوية 90 درجة",
          "احتفظ بالوضعية لمدة 10-30 ثانية",
          "ارفع ببطء إلى وضع البداية"
        ],
        "repetitions": "1-3 تكرار",
        "sets": "2-3 جولات",
        "restDuration": "30 ثانية بين الجولات",
        "expectedSensation": "شعور بتوتر في عضلات الفخذ",
        "stopImmediately": "إذا شعرت بألم حاد"
      }
    },
    {
      "id": "gentle_muscle_relaxation",
      "title": "تمرين للاسترخاء العضلي وتقليل التشنج",
      "treatmentGoals": ["reduce_muscle_spasm", "improve_muscle_flexibility"],
      "difficultyLevel": "beginner",
      "region": "general",
      "contraindications": ["severe_pain"],
      "instructions": {
        "why": "هذا التمرين يساعد على الاسترخاء العضلي وتقليل التشنج عن طريق التنفس العميق والاسترخاء التدريجي",
        "steps": [
          "اجلس أو استلقِ في وضعية مريحة",
          "أغلق عينيك",
          "خذ نفساً عميقاً ببطء",
          "احبس النفس لمدة 3 ثواني",
          "أخرج النفس ببطء",
          "كرر التنفس العميق لمدة 5-10 دقائق",
          "ركز على استرخاء كل عضلة في جسمك"
        ],
        "repetitions": "5-10 دقائق",
        "sets": "1-2 مرات يومياً",
        "restDuration": "لا حاجة للراحة",
        "expectedSensation": "شعور بالاسترخاء العام",
        "stopImmediately": "إذا شعرت بدوار أو ضيق في التنفس"
      }
    }
  ]
};
        
        const riskFactorsData = {
  "riskFactors": [
    {
      "id": "loss_of_bladder_control",
      "name": "فقدان السيطرة على البول",
      "severity": "critical",
      "question": "هل فقدت السيطرة على البول؟",
      "action": "immediate_medical_attention",
      "message": "⚠️ تحذير شديد: فقدان السيطرة على البول علامة خطيرة تتطلب عناية طبية فورية. يرجى استشارتنا لتأكيد التشخيص فوراً."
    },
    {
      "id": "loss_of_bowel_control",
      "name": "فقدان السيطرة على البراز",
      "severity": "critical",
      "question": "هل فقدت السيطرة على البراز؟",
      "action": "immediate_medical_attention",
      "message": "⚠️ تحذير شديد: فقدان السيطرة على البراز علامة خطيرة تتطلب عناية طبية فورية. يرجى استشارتنا لتأكيد التشخيص فوراً."
    },
    {
      "id": "sudden_severe_weakness",
      "name": "ضعف شديد مفاجئ",
      "severity": "critical",
      "question": "هل تعاني من ضعف شديد مفاجئ في الأطراف؟",
      "action": "immediate_medical_attention",
      "message": "⚠️ تحذير شديد: الضعف الشديد المفاجئ علامة خطيرة تتطلب عناية طبية فورية. يرجى استشارتنا لتأكيد التشخيص فوراً."
    },
    {
      "id": "fever_present",
      "name": "حمى",
      "severity": "high",
      "question": "هل تعاني من حمى (ارتفاع درجة الحرارة)؟",
      "action": "medical_consultation",
      "message": "⚠️ تحذير: الحمى مع ألم في الظهر قد تشير إلى عدوى. يرجى استشارتنا لتأكيد التشخيص في أقرب وقت."
    },
    {
      "id": "unexplained_weight_loss",
      "name": "فقدان وزن غير مفسر",
      "severity": "high",
      "question": "هل فقدت وزناً غير مفسر في الآونة الأخيرة؟",
      "action": "medical_consultation",
      "message": "⚠️ تحذير: فقدان الوزن غير المفسر مع ألم في الظهر قد يشير إلى مشكلة خطيرة. يرجى استشارتنا لتأكيد التشخيص في أقرب وقت."
    },
    {
      "id": "recent_severe_injury",
      "name": "إصابة قوية حديثة",
      "severity": "high",
      "question": "هل تعرضت لإصابة قوية حديثة (سقوط، حادث، إلخ)؟",
      "action": "medical_consultation",
      "message": "⚠️ تحذير: الإصابة القوية الحديثة تتطلب تقييماً طبياً. يرجى استشارتنا لتأكيد التشخيص في أقرب وقت."
    },
    {
      "id": "severe_night_pain",
      "name": "ألم ليلي شديد",
      "severity": "medium",
      "question": "هل تعاني من ألم ليلي شديد يمنعك من النوم؟",
      "action": "medical_consultation",
      "message": "⚠️ تحذير: الألم الليلي الشديد قد يشير إلى مشكلة خطيرة. يرجى استشارتنا لتأكيد التشخيص في أقرب وقت."
    },
    {
      "id": "progressive_weakness",
      "name": "ضعف تدريجي",
      "severity": "high",
      "question": "هل يزداد الضعف تدريجياً مع الوقت؟",
      "action": "medical_consultation",
      "message": "⚠️ تحذير: الضعف التدريجي علامة خطيرة تتطلب عناية طبية. يرجى استشارتنا لتأكيد التشخيص في أقرب وقت."
    },
    {
      "id": "numbness_in_groin_area",
      "name": "تنميل في منطقة العانة",
      "severity": "critical",
      "question": "هل تشعر بتنميل في منطقة العانة (منطقة الحساس)؟",
      "action": "immediate_medical_attention",
      "message": "⚠️ تحذير شديد: التنميل في منطقة العانة علامة خطيرة جداً (Cauda Equina Syndrome) تتطلب عناية طبية فورية. يرجى استشارتنا لتأكيد التشخيص فوراً."
    },
    {
      "id": "history_of_cancer",
      "name": "تاريخ من السرطان",
      "severity": "high",
      "question": "هل لديك تاريخ من السرطان؟",
      "action": "medical_consultation",
      "message": "⚠️ تحذير: تاريخ السرطان مع ألم في الظهر يتطلب تقييماً طبياً دقيقاً. يرجى استشارتنا لتأكيد التشخيص في أقرب وقت."
    },
    {
      "id": "recent_infection",
      "name": "عدوى حديثة",
      "severity": "medium",
      "question": "هل تعرضت لعدوى حديثة (عدوى بولية، عدوى جلدية، إلخ)؟",
      "action": "medical_consultation",
      "message": "⚠️ تحذير: العدوى الحديثة مع ألم في الظهر قد تشير إلى مشكلة خطيرة. يرجى استشارتنا لتأكيد التشخيص في أقرب وقت."
    },
    {
      "id": "prolonged_steroid_use",
      "name": "استخدام طويل للكورتيزون",
      "severity": "medium",
      "question": "هل تستخدم الكورتيزون لفترة طويلة؟",
      "action": "medical_consultation",
      "message": "⚠️ تحذير: الاستخدام الطويل للكورتيزون قد يزيد من خطر الإصابة. يرجى استشارتنا لتأكيد التشخيص في أقرب وقت."
    },
    {
      "id": "severe_abdominal_pain",
      "name": "ألم بطني شديد",
      "severity": "high",
      "question": "هل تعاني من ألم بطني شديد مع ألم الظهر؟",
      "action": "immediate_medical_attention",
      "message": "⚠️ تحذير شديد: الألم البطني الشديد مع ألم الظهر قد يشير إلى مشكلة خطيرة. يرجى استشارتنا لتأكيد التشخيص فوراً."
    },
    {
      "id": "difficulty_walking",
      "name": "صعوبة في المشي",
      "severity": "high",
      "question": "هل تعاني من صعوبة في المشي؟",
      "action": "medical_consultation",
      "message": "⚠️ تحذير: صعوبة المشي علامة خطيرة تتطلب عناية طبية. يرجى استشارتنا لتأكيد التشخيص في أقرب وقت."
    },
    {
      "id": "loss_of_sensation",
      "name": "فقدان الإحساس",
      "severity": "high",
      "question": "هل فقدت الإحساس في أي جزء من جسمك؟",
      "action": "medical_consultation",
      "message": "⚠️ تحذير: فقدان الإحساس علامة خطيرة تتطلب عناية طبية. يرجى استشارتنا لتأكيد التشخيص في أقرب وقت."
    }
  ]
};
        
        expertSystemData = {
            symptoms: symptomsData,
            diagnoses: diagnosesData,
            treatmentGoals: treatmentGoalsData,
            exercises: exercisesData,
            riskFactors: riskFactorsData
        };
        
        return expertSystemData;
    } catch (error) {
        console.error('خطأ في تحميل بيانات النظام الخبير:', error);
        return null;
    }
}

// Symptoms Engine - محرك تحليل الأعراض
class SymptomsEngine {
    constructor(symptomsData) {
        this.symptomsData = symptomsData;
        this.clinicalFeatures = new Map();
    }

    analyzeSymptoms(answers) {
        this.clinicalFeatures.clear();
        
        for (const [symptomId, answer] of Object.entries(answers)) {
            const symptom = this.symptomsData.symptoms.find(s => s.id === symptomId);
            
            if (!symptom) continue;
            
            if (answer === true || answer === 'yes' || answer === 1) {
                for (const feature of symptom.clinicalFeatures) {
                    this.addClinicalFeature(feature, symptom.weight);
                }
            }
        }
        
        return this.getClinicalFeatures();
    }

    addClinicalFeature(feature, weight) {
        if (!this.clinicalFeatures.has(feature)) {
            this.clinicalFeatures.set(feature, {
                name: feature,
                weight: 0,
                count: 0
            });
        }
        
        const featureData = this.clinicalFeatures.get(feature);
        featureData.weight += weight;
        featureData.count += 1;
    }

    getClinicalFeatures() {
        const features = {};
        
        for (const [key, value] of this.clinicalFeatures.entries()) {
            features[key] = {
                present: true,
                weight: value.weight,
                count: value.count,
                name: this.getFeatureName(key),
                description: this.getFeatureDescription(key)
            };
        }
        
        return features;
    }

    getFeatureName(feature) {
        const featureData = this.symptomsData.clinicalFeatures[feature];
        return featureData ? featureData.name : feature;
    }

    getFeatureDescription(feature) {
        const featureData = this.symptomsData.clinicalFeatures[feature];
        return featureData ? featureData.description : '';
    }

    reset() {
        this.clinicalFeatures.clear();
    }
}

// Risk Engine - محرك اكتشاف الحالات الخطرة
class RiskEngine {
    constructor(riskFactorsData) {
        this.riskFactorsData = riskFactorsData;
        this.detectedRisks = [];
    }

    analyzeRisks(answers) {
        this.detectedRisks = [];
        
        for (const [riskId, answer] of Object.entries(answers)) {
            const riskFactor = this.riskFactorsData.riskFactors.find(r => r.id === riskId);
            
            if (!riskFactor) continue;
            
            if (answer === true || answer === 'yes' || answer === 1) {
                this.detectedRisks.push({
                    id: riskFactor.id,
                    name: riskFactor.name,
                    severity: riskFactor.severity,
                    action: riskFactor.action,
                    message: riskFactor.message
                });
            }
        }
        
        return this.getRiskAssessment();
    }

    getRiskAssessment() {
        const sortedRisks = this.detectedRisks.sort((a, b) => {
            const severityOrder = { 'critical': 3, 'high': 2, 'medium': 1 };
            return severityOrder[b.severity] - severityOrder[a.severity];
        });
        
        const highestSeverity = this.getHighestSeverity();
        
        return {
            hasRisks: this.detectedRisks.length > 0,
            risks: sortedRisks,
            highestSeverity: highestSeverity,
            shouldStopDiagnosis: highestSeverity === 'critical' || highestSeverity === 'high',
            shouldStopExercises: highestSeverity === 'critical' || highestSeverity === 'high'
        };
    }

    getHighestSeverity() {
        if (this.detectedRisks.length === 0) return 'none';
        
        const severityOrder = { 'critical': 3, 'high': 2, 'medium': 1 };
        let highest = 'none';
        
        for (const risk of this.detectedRisks) {
            if (severityOrder[risk.severity] > severityOrder[highest]) {
                highest = risk.severity;
            }
        }
        
        return highest;
    }

    reset() {
        this.detectedRisks = [];
    }
}

// Diagnostic Engine - محرك التشخيص
class DiagnosticEngine {
    constructor(diagnosesData) {
        this.diagnosesData = diagnosesData;
        this.diagnosisScores = new Map();
    }

    analyzeDiagnoses(clinicalFeatures, region) {
        this.diagnosisScores.clear();
        
        const regionDiagnoses = this.diagnosesData.diagnoses.filter(d => d.region === region);
        
        for (const diagnosis of regionDiagnoses) {
            const score = this.calculateDiagnosisScore(diagnosis, clinicalFeatures);
            
            if (score.totalScore > 0) {
                this.diagnosisScores.set(diagnosis.id, {
                    diagnosis: diagnosis,
                    score: score.totalScore,
                    confidence: score.confidence,
                    supportingFactors: score.supportingFactors,
                    opposingFactors: score.opposingFactors
                });
            }
        }
        
        const sortedDiagnoses = this.getSortedDiagnoses();
        return sortedDiagnoses.slice(0, 5);
    }

    calculateDiagnosisScore(diagnosis, clinicalFeatures) {
        let totalScore = 0;
        let maxPossibleScore = 0;
        const supportingFactors = [];
        const opposingFactors = [];
        
        for (const factor of diagnosis.supportingFactors) {
            maxPossibleScore += Math.abs(factor.weight);
            
            if (clinicalFeatures[factor.clinicalFeature] && clinicalFeatures[factor.clinicalFeature].present) {
                totalScore += factor.weight;
                supportingFactors.push({
                    feature: factor.clinicalFeature,
                    weight: factor.weight,
                    reason: factor.reason,
                    featureName: clinicalFeatures[factor.clinicalFeature].name
                });
            }
        }
        
        for (const factor of diagnosis.opposingFactors) {
            maxPossibleScore += Math.abs(factor.weight);
            
            if (clinicalFeatures[factor.clinicalFeature] && clinicalFeatures[factor.clinicalFeature].present) {
                totalScore += factor.weight;
                opposingFactors.push({
                    feature: factor.clinicalFeature,
                    weight: factor.weight,
                    reason: factor.reason,
                    featureName: clinicalFeatures[factor.clinicalFeature].name
                });
            }
        }
        
        const confidence = maxPossibleScore > 0 ? (totalScore / maxPossibleScore) * 100 : 0;
        
        return {
            totalScore,
            confidence,
            supportingFactors,
            opposingFactors,
            maxPossibleScore
        };
    }

    getSortedDiagnoses() {
        const diagnoses = [];
        
        for (const [id, data] of this.diagnosisScores.entries()) {
            if (data.confidence >= data.diagnosis.minConfidence) {
                diagnoses.push(data);
            }
        }
        
        diagnoses.sort((a, b) => b.confidence - a.confidence);
        return diagnoses;
    }

    reset() {
        this.diagnosisScores.clear();
    }
}

// Treatment Goals Engine - محرك تحديد الأهداف العلاجية
class TreatmentGoalsEngine {
    constructor(treatmentGoalsData) {
        this.treatmentGoalsData = treatmentGoalsData;
        this.selectedGoals = [];
    }

    analyzeTreatmentGoals(clinicalFeatures) {
        this.selectedGoals = [];
        
        for (const goal of this.treatmentGoalsData.treatmentGoals) {
            const matchScore = this.calculateGoalMatchScore(goal, clinicalFeatures);
            
            if (matchScore > 0) {
                this.selectedGoals.push({
                    goal: goal,
                    matchScore: matchScore,
                    matchedFeatures: this.getMatchedFeatures(goal, clinicalFeatures)
                });
            }
        }
        
        const sortedGoals = this.getSortedGoals();
        return sortedGoals;
    }

    calculateGoalMatchScore(goal, clinicalFeatures) {
        let score = 0;
        
        for (const requiredFeature of goal.requiredClinicalFeatures) {
            if (clinicalFeatures[requiredFeature] && clinicalFeatures[requiredFeature].present) {
                score += 3;
            } else {
                return 0;
            }
        }
        
        for (const optionalFeature of goal.optionalClinicalFeatures) {
            if (clinicalFeatures[optionalFeature] && clinicalFeatures[optionalFeature].present) {
                score += 1;
            }
        }
        
        return score;
    }

    getMatchedFeatures(goal, clinicalFeatures) {
        const matched = [];
        
        for (const requiredFeature of goal.requiredClinicalFeatures) {
            if (clinicalFeatures[requiredFeature] && clinicalFeatures[requiredFeature].present) {
                matched.push({
                    feature: requiredFeature,
                    name: clinicalFeatures[requiredFeature].name,
                    required: true
                });
            }
        }
        
        for (const optionalFeature of goal.optionalClinicalFeatures) {
            if (clinicalFeatures[optionalFeature] && clinicalFeatures[optionalFeature].present) {
                matched.push({
                    feature: optionalFeature,
                    name: clinicalFeatures[optionalFeature].name,
                    required: false
                });
            }
        }
        
        return matched;
    }

    getSortedGoals() {
        const priorityOrder = { 'high': 3, 'medium': 2, 'low': 1 };
        
        this.selectedGoals.sort((a, b) => {
            const priorityDiff = priorityOrder[b.goal.priority] - priorityOrder[a.goal.priority];
            if (priorityDiff !== 0) return priorityDiff;
            return b.matchScore - a.matchScore;
        });
        
        return this.selectedGoals;
    }

    reset() {
        this.selectedGoals = [];
    }
}

// Exercise Engine - محرك اختيار التمارين
class ExerciseEngine {
    constructor(exercisesData) {
        this.exercisesData = exercisesData;
        this.selectedExercises = [];
    }

    selectExercises(treatmentGoals, clinicalFeatures, options = {}) {
        this.selectedExercises = [];
        
        const { severity = 'moderate', region = 'general', difficultyLevel = 'beginner' } = options;
        
        for (const exercise of this.exercisesData.exercises) {
            if (region !== 'general' && exercise.region !== region && exercise.region !== 'general') {
                continue;
            }
            
            const matchScore = this.calculateExerciseMatchScore(exercise, treatmentGoals, clinicalFeatures);
            
            if (matchScore > 0) {
                if (!this.hasContraindications(exercise, clinicalFeatures)) {
                    this.selectedExercises.push({
                        exercise: exercise,
                        matchScore: matchScore,
                        matchedGoals: this.getMatchedGoals(exercise, treatmentGoals)
                    });
                }
            }
        }
        
        const sortedExercises = this.getSortedExercises();
        const filteredByDifficulty = this.filterByDifficulty(sortedExercises, difficultyLevel);
        return filteredByDifficulty;
    }

    calculateExerciseMatchScore(exercise, treatmentGoals, clinicalFeatures) {
        let score = 0;
        
        for (const goal of treatmentGoals) {
            if (exercise.treatmentGoals.includes(goal.id)) {
                const priorityWeight = goal.priority === 'high' ? 3 : (goal.priority === 'medium' ? 2 : 1);
                score += priorityWeight;
            }
        }
        
        return score;
    }

    getMatchedGoals(exercise, treatmentGoals) {
        const matched = [];
        
        for (const goal of treatmentGoals) {
            if (exercise.treatmentGoals.includes(goal.id)) {
                matched.push(goal);
            }
        }
        
        return matched;
    }

    hasContraindications(exercise, clinicalFeatures) {
        for (const contraindication of exercise.contraindications) {
            const clinicalFeature = this.mapContraindicationToFeature(contraindication);
            
            if (clinicalFeature && clinicalFeatures[clinicalFeature] && clinicalFeatures[clinicalFeature].present) {
                return true;
            }
        }
        
        return false;
    }

    mapContraindicationToFeature(contraindication) {
        const mapping = {
            'severe_pain': 'mechanicalPain',
            'acute_injury': 'acuteInjury',
            'muscle_weakness': 'muscleWeakness',
            'nerve_damage': 'nerveDamage'
        };
        
        return mapping[contraindication] || null;
    }

    getSortedExercises() {
        this.selectedExercises.sort((a, b) => b.matchScore - a.matchScore);
        return this.selectedExercises;
    }

    filterByDifficulty(exercises, difficultyLevel) {
        if (difficultyLevel === 'all') {
            return exercises;
        }
        
        const difficultyOrder = { 'beginner': 1, 'intermediate': 2, 'advanced': 3 };
        const targetLevel = difficultyOrder[difficultyLevel];
        
        return exercises.filter(e => {
            const exerciseLevel = difficultyOrder[e.exercise.difficultyLevel];
            return exerciseLevel <= targetLevel;
        });
    }

    reset() {
        this.selectedExercises = [];
    }
}

// Expert System - المحرك الرئيسي
class ExpertSystem {
    constructor() {
        this.symptomsEngine = null;
        this.riskEngine = null;
        this.diagnosticEngine = null;
        this.treatmentGoalsEngine = null;
        this.exerciseEngine = null;
        
        this.currentSession = {
            answers: {},
            clinicalFeatures: {},
            riskAssessment: null,
            diagnoses: [],
            treatmentGoals: [],
            exercises: [],
            region: 'lumbar'
        };
    }

    initialize(data) {
        this.symptomsEngine = new SymptomsEngine(data.symptoms);
        this.riskEngine = new RiskEngine(data.riskFactors);
        this.diagnosticEngine = new DiagnosticEngine(data.diagnoses);
        this.treatmentGoalsEngine = new TreatmentGoalsEngine(data.treatmentGoals);
        this.exerciseEngine = new ExerciseEngine(data.exercises);
    }

    startSession(region = 'lumbar') {
        this.currentSession = {
            answers: {},
            clinicalFeatures: {},
            riskAssessment: null,
            diagnoses: [],
            treatmentGoals: [],
            exercises: [],
            region: region
        };
        
        this.symptomsEngine.reset();
        this.riskEngine.reset();
        this.diagnosticEngine.reset();
        this.treatmentGoalsEngine.reset();
        this.exerciseEngine.reset();
    }

    addAnswer(questionId, answer) {
        this.currentSession.answers[questionId] = answer;
    }

    runFullAnalysis(options = {}) {
        this.currentSession.clinicalFeatures = this.symptomsEngine.analyzeSymptoms(this.currentSession.answers);
        this.currentSession.riskAssessment = this.riskEngine.analyzeRisks(this.currentSession.answers);
        
        if (this.currentSession.riskAssessment.shouldStopDiagnosis) {
            return {
                status: 'stopped_due_to_risks',
                riskAssessment: this.currentSession.riskAssessment
            };
        }
        
        this.currentSession.diagnoses = this.diagnosticEngine.analyzeDiagnoses(
            this.currentSession.clinicalFeatures,
            this.currentSession.region
        );
        
        this.currentSession.treatmentGoals = this.treatmentGoalsEngine.analyzeTreatmentGoals(
            this.currentSession.clinicalFeatures
        );
        
        this.currentSession.exercises = this.exerciseEngine.selectExercises(
            this.currentSession.treatmentGoals.map(g => g.goal),
            this.currentSession.clinicalFeatures,
            {
                severity: options.severity || 'moderate',
                region: this.currentSession.region,
                difficultyLevel: options.difficultyLevel || 'beginner'
            }
        );
        
        return {
            status: 'completed',
            clinicalFeatures: this.currentSession.clinicalFeatures,
            riskAssessment: this.currentSession.riskAssessment,
            diagnoses: this.currentSession.diagnoses,
            treatmentGoals: this.currentSession.treatmentGoals,
            exercises: this.currentSession.exercises
        };
    }
}

// إنشاء مثيل النظام الخبير
let expertSystem = null;

// تهيئة النظام الخبير
async function initializeExpertSystem() {
    if (expertSystemInitialized) {
        console.log('✅ النظام الخبير مهيأ بالفعل');
        return expertSystem;
    }
    
    console.log('🔵 بدء تحميل بيانات النظام الخبير...');
    const data = await loadExpertSystemData();
    
    if (data) {
        console.log('✅ تم تحميل البيانات بنجاح');
        console.log('📊 عدد الأعراض:', data.symptoms?.symptoms?.length);
        console.log('📊 عدد التشخيصات:', data.diagnoses?.diagnoses?.length);
        console.log('📊 عدد الأهداف العلاجية:', data.treatmentGoals?.treatmentGoals?.length);
        console.log('📊 عدد التمارين:', data.exercises?.exercises?.length);
        console.log('📊 عدد عوامل الخطر:', data.riskFactors?.riskFactors?.length);
        
        expertSystem = new ExpertSystem();
        expertSystem.initialize(data);
        expertSystemInitialized = true;
        console.log('✅ تم تهيئة النظام الخبير بنجاح');
    } else {
        console.error('❌ فشل تحميل البيانات');
    }
    
    return expertSystem;
}

// ============================================
// نهاية نظام الخبير الطبي الجديد
// ============================================

// حساب BMI والوزن الزائد بالكيلو
function calculateBMI(w,h) { if(!w||!h||h<=0) return null; return w/((h/100)**2); }
function calculateWeightExcess(weight, height) {
    if(!weight||!height||height<=0) return null;
    const idealBMI = 22;
    const idealWeight = idealBMI * ((height/100)**2);
    const excess = weight - idealWeight;
    return { kg: Math.abs(excess).toFixed(1), direction: excess>0?'زائد':(excess<0?'ناقص':'طبيعي') };
}
function getBMICategoryAdvanced(bmi, weight, height) {
    const excess = calculateWeightExcess(weight, height);
    if(bmi<18.5) return { text:"نقص وزن", class:"bmi-underweight", desc:`الوزن أقل من الطبيعي بحوالي ${excess?.kg||'?'} كغم.`, excessKg:excess?.kg };
    if(bmi<25) return { text:"وزن طبيعي", class:"bmi-normal", desc:"وزن صحي، لا يزيد الضغط على المفاصل.", excessKg:"0" };
    if(bmi<30) return { text:"وزن زائد", class:"bmi-overweight", desc:`الوزن زائد بحوالي ${excess?.kg||'?'} كغم عن المثالي.`, excessKg:excess?.kg };
    return { text:"سمنة", class:"bmi-obese", desc:`الوزن زائد بحوالي ${excess?.kg||'?'} كغم.`, excessKg:excess?.kg };
}

// قاعدة بيانات التمارين مع رسومات توضيحية
const exercisesWithIllustrations = {
    'shoulder': {
        'impingement': [
            {
                name: '🏋️ تمرين البندول (Pendulum)',
                illustration: `<pre>
   🧍
    |
    O
   /|\\
   / \\
    |
    O  ← الذراع تتدلى
   /|\\
   / \\
        </pre>`,
                description: 'قف بجانب طاولة، دع الذراع تتدلى بحرية، حرك في دوائر صغيرة 10 مرات كل اتجاه، كرر 3 مرات يومياً'
            },
            {
                name: '🏋️ إطالة الصدر أمام الحائط',
                illustration: `<pre>
   🧍 ← الحائط
    |
    O
   /|\\
   / \\
    |
    O
   /|\\
   / \\
        </pre>`,
                description: 'قف أمام الحائط، ضع يديك على مستوى الكتف، انحنى للأمام حتى تشعر بتمدد، احتفظ 30 ثانية، كرر 3 مرات'
            },
            {
                name: '🏋️ سحب لوح الكتف للخلف',
                illustration: `<pre>
   🧍
    |
    O
   /|\\ ← اسحب للخلف
   / \\
    |
    O
   /|\\
   / \\
        </pre>`,
                description: 'اجلس بظهر مستقيم، اسحب لوح الكتف للخلف واضغطه للأسفل، احتفظ 10 ثواني، كرر 10 مرات'
            },
            {
                name: '❄️ كمادات باردة',
                illustration: `<pre>
   🧊
    |
    O
   /|\\
   / \\
        </pre>`,
                description: 'استخدم كيس ثلج لمدة 15 دقيقة بعد التمارين'
            }
        ],
        'tendonitis': [
            {
                name: '🏋️ إطالة المنشفة (Towel Stretch)',
                illustration: `<pre>
   🧍
    |
    O
   /|\\ ← يد سليمة تسحب
   / \\    المنشفة
    |
    O ← يد مصابة
   /|\\
   / \\
        </pre>`,
                description: 'أمسك منشفة خلف ظهرك، اسحب برفق لرفع الذراع، احتفظ 15-20 ثانية، كرر 10-20 مرة يومياً'
            },
            {
                name: '🏋️ إطالة الجسم (Cross-body)',
                illustration: `<pre>
   🧍
    |
    O
   /|\\ ← اسحب الذراع
   / \\    للجسم
    |
    O
   /|\\
   / \\
        </pre>`,
                description: 'استخدم يدك السليمة لرفع الذراع عند الكوع، اسحب نحو جسمك، احتفظ 15-20 ثانية، كرر 10-20 مرة يومياً'
            },
            {
                name: '🏋️ المشي على الحائط (Finger Walk)',
                illustration: `<pre>
   🧍 ← الحائط
    |
    O
   /|\\ ← امشِ أصابعك
   / \\    للأعلى
    |
    O
   /|\\
   / \\
        </pre>`,
                description: 'قف أمام الحائط، امشِ بأصابعك للأعلى، كرر 10-20 مرة يومياً'
            },
            {
                name: '🏋️ تمارين تقوية متساوية القياس',
                illustration: `<pre>
   🧍
    |
    O
   /|\\ ← مقاومة
   / \\    ثابتة
    |
    O
   /|\\
   / \\
        </pre>`,
                description: 'استخدم حزام مقاومة، الدوران الداخلي والخارجي، احتفظ 5 ثواني، كرر 15-20 مجموعة يومياً'
            }
        ],
        'tear': [
            {
                name: '🛏️ الراحة النسبية',
                illustration: `<pre>
   🛏️
    |
    O
   /|\\ ← راحة
   / \\
        </pre>`,
                description: 'تجنب الحركات المؤلمة تماماً، استمر في الحركات اليومية الخفيفة'
            },
            {
                name: '🏋️ تمارين مدى حركة خفيفة',
                illustration: `<pre>
   🧍
    |
    O
   /|\\ ← دوائر صغيرة
   / \\    فقط
    |
    O
   /|\\
   / \\
        </pre>`,
                description: 'تمرين البندول فقط في المرحلة الحادة، حرك الذراع في دوائر صغيرة 10 مرات، كرر 3 مرات يومياً'
            },
            {
                name: '⚠️ تقييم طبي ضروري',
                illustration: `<pre>
   🏥
    |
    O
   /|\\ ← استشرنا
   / \\
        </pre>`,
                description: 'قد يتطلب تقييماً بالرنين المغناطيسي، استشرنا قبل البدء بأي تمارين تقوية'
            }
        ],
        'frozen': [
            {
                name: '🔥 الحرارة الرطبة قبل التمارين',
                illustration: `<pre>
   🚿
    |
    O
   /|\\ ← حرارة
   / \\    رطبة
        </pre>`,
                description: 'استخدم دش دافئ أو وسادة حرارية قبل التمارين لمدة 10-15 دقيقة'
            },
            {
                name: '🏋️ تمارين مدى حركة مكثفة',
                illustration: `<pre>
   🧍
    |
    O
   /|\\ ← حركات مكثفة
   / \\    ومتكررة
    |
    O
   /|\\
   / \\
        </pre>`,
                description: 'يجب البدء تحت إشراف أخصائي علاج طبيعي، تمارين مكثفة ومتكررة'
            },
            {
                name: '🏋️ تمارين إطالة الكتف',
                illustration: `<pre>
   🧍
    |
    O
   /|\\ ← إطالات
   / \\    متعددة
        </pre>`,
                description: 'إطالة للكتف الأمامي والخلفي، احتفظ بكل إطالة 30 ثانية، كرر 3 مرات'
            }
        ]
    },
    'neck': {
        'herniated': [
            {
                name: '🏋️ إطالة الرقبة الجانبية',
                illustration: `<pre>
   🧍
    |
    O
   /|\\ ← اسحب الرأس
   / \\    للجانب
        </pre>`,
                description: 'اجلس على كرسي، ضع يدك على رأسك من الجانب، اسحب برفق نحو كتفك، احتفظ 30 ثانية، كرر 3 مرات'
            },
            {
                name: '🏋️ تقوية عضلات الرقبة',
                illustration: `<pre>
   🧍
    |
    O ← ضغط بيدك
   /|\\
   / \\
        </pre>`,
                description: 'اجلس، ضع يدك على جبهتك، ادفع رأسك برفق للأمام، استخدم عضلاتك للمقاومة، عد حتى 5، كرر 10 مرات'
            },
            {
                name: '🧘 تصحيح الوضعية',
                illustration: `<pre>
   💻
    |
    O
   /|\\ ← الشاشة
   / \\    على مستوى العين
        </pre>`,
                description: 'اجلس بوضعية صحيحة، ضبط ارتفاع الشاشة على مستوى العين، استخدم كرسي مريح، خذ استراحة كل 30 دقيقة'
            }
        ],
        'muscle_spasm': [
            {
                name: '🏋️ إطالة الرقبة',
                illustration: `<pre>
   🧍
    |
    O
   /|\\ ← إمالة
   / \\    برفق
        </pre>`,
                description: 'إمالة الرقبة برفق للجانبين، احتفظ بالوضعية 30 ثانية، كرر 3 مرات'
            },
            {
                name: '🔥 كمادات دافئة',
                illustration: `<pre>
   🔥
    |
    O
   /|\\
   / \\
        </pre>`,
                description: 'استخدم الحرارة قبل التمارين لمدة 10-15 دقيقة'
            }
        ],
        'postural': [
            {
                name: '🧘 تصحيح بيئة العمل',
                illustration: `<pre>
   💻
    |
    O
   /|\\ ← ضبط
   / \\    ارتفاع الشاشة
        </pre>`,
                description: 'ضبط ارتفاع الشاشة، ضبط ارتفاع الكرسي، استخدم دعم للظهر'
            },
            {
                name: '⏰ استراحات منتظمة',
                illustration: `<pre>
   ⏰
    |
    O
   /|\\ ← استراحة
   / \\    كل 30 دقيقة
        </pre>`,
                description: 'خذ استراحة كل 30 دقيقة، قم بتمارين إطالة بسيطة'
            }
        ]
    },
    'lumbar': {
        'herniated': [
            {
                name: '🏋️ تمارين ويليامز (Williams)',
                illustration: `<pre>
   🛏️
    |
    O ← اثنِ الركبتين
   /|\\ واسحبهما للصدر
   / \\
        </pre>`,
                description: 'استلقِ على ظهرك، اثنِ ركبتيك واسحبهما نحو صدرك ببطء، احتفظ 5 ثواني، كرر 10 مرات'
            },
            {
                name: '🚶 المشي الخفيف',
                illustration: `<pre>
   🚶
    |
    O
   /|\\
   / \\
        </pre>`,
                description: 'امشي 20-30 دقيقة يومياً على سطح مستوٍ'
            },
            {
                name: '🏋️ تقوية عضلات البطن',
                illustration: `<pre>
   🛏️
    |
    O ← ارفع الرأس
   /|\\ والكتفين
   / \\
        </pre>`,
                description: 'استلقِ على ظهرك، اثنِ ركبتيك، ارفع رأسك والكتفين ببطء، عد حتى 3، كرر 10 مرات'
            }
        ],
        'spinal_stenosis': [
            {
                name: '🚶 المشي مع انحناء',
                illustration: `<pre>
   🚶 ← انحناء خفيف
    |    للأمام
    O
   /|\\
   / \\
        </pre>`,
                description: 'امشي مع انحناء خفيف للأمام لمدة 20-30 دقيقة'
            },
            {
                name: '🏋️ إطالة أسفل الظهر',
                illustration: `<pre>
   🧍
    |
    O
   /|\\ ← انحناء
   / \\    خفيف
        </pre>`,
                description: 'إطالة خفيفة للظهر، احتفظ بالوضعية 30 ثانية'
            }
        ],
        'muscle_spasm': [
            {
                name: '🔥 كمادات دافئة',
                illustration: `<pre>
   🔥
    |
    O
   /|\\
   / \\
        </pre>`,
                description: 'استخدم الحرارة قبل التمارين لمدة 10-15 دقيقة'
            },
            {
                name: '🏋️ إطالة خفيفة',
                illustration: `<pre>
   🧍
    |
    O
   /|\\ ← إطالة
   / \\    خفيفة
        </pre>`,
                description: 'إطالة خفيفة للظهر، احتفظ بالوضعية 30 ثانية'
            }
        ]
    },
    'knee': {
        'patellofemoral': [
            {
                name: '🏋️ تقوية عضلات الفخذ الأمامية',
                illustration: `<pre>
   🧍
    |
    O
   /|\\ ← ارفع الساق
   / \\    للأمام
        </pre>`,
                description: 'اجلس، ارفع ساقك للأمام، احتفظ 5 ثواني، كرر 10 مرات'
            },
            {
                name: '🏋️ إطالة عضلات الفخذ',
                illustration: `<pre>
   🧍
    |
    O
   /|\\ ← اسحب القدم
   / \\    للخلف
        </pre>`,
                description: 'قف، اسحب قدمك للخلف بيدك، احتفظ 30 ثانية، كرر 3 مرات'
            }
        ],
        'meniscus': [
            {
                name: '🏋️ تمارين تقوية الرباط الصليبي',
                illustration: `<pre>
   🧍
    |
    O
   /|\\ ← ثني الركبة
   / \\    ببطء
        </pre>`,
                description: 'اجلس، اثنِ ركبتك ببطء، احتفظ 5 ثواني، كرر 10 مرات'
            },
            {
                name: '🚶 المشي الخفيف',
                illustration: `<pre>
   🚶
    |
    O
   /|\\
   / \\
        </pre>`,
                description: 'امشي 20-30 دقيقة يومياً على سطح مستوٍ'
            }
        ],
        'osteoarthritis': [
            {
                name: '🏋️ تقوية عضلات الفخذ',
                illustration: `<pre>
   🧍
    |
    O
   /|\\ ← تمارين
   / \\    تقوية
        </pre>`,
                description: 'تمارين تقوية خفيفة لعضلات الفخذ، كرر 10 مرات'
            },
            {
                name: '🚶 المشي الخفيف',
                illustration: `<pre>
   🚶
    |
    O
   /|\\
   / \\
        </pre>`,
                description: 'امشي 20-30 دقيقة يومياً على سطح مستوٍ'
            }
        ]
    },
    'ankle': {
        'sprain': [
            {
                name: '🏋️ إطالة الساق بالمنشفة',
                illustration: `<pre>
   🧍
    |
    O
   /|\\ ← اسحب المنشفة
   / \\    نحوك
        </pre>`,
                description: 'اجلس، لف منشفة حول قدمك، اسحب نحوك لتمديد عضلات الساق، احتفظ 30 ثانية، كرر 3-5 مرات'
            },
            {
                name: '🏋️ ضخ الكاحل',
                illustration: `<pre>
   🧍
    |
    O
   /|\\ ← اثنِ ومد
   / \\    الكاحل
        </pre>`,
                description: 'اجلس، اثنِ ومد الكاحل، حرك قدمك للأعلى والأسفل، كرر مجموعتين من 15 تكرار'
            },
            {
                name: '🏋️ دوائر الكاحل',
                illustration: `<pre>
   🧍
    |
    O
   /|\\ ← دوائر
   / \\    صغيرة
        </pre>`,
                description: 'اجلس، حرك الكاحل في حركة دائرية في اتجاه عقارب الساعة وعكسها، كرر مجموعتين من 15 تكرار'
            }
        ],
        'tendinitis': [
            {
                name: '🏋️ إطالة وتر الكاحل',
                illustration: `<pre>
   🧍
    |
    O
   /|\\ ← اضغط الكعب
   / \\    للأسفل
        </pre>`,
                description: 'قف، ضع قدمك المصابة خلف القدم السليمة، اضغط الكعب للأسفل، احتفظ 30 ثانية، كرر 3 مرات'
            },
            {
                name: '❄️ كمادات باردة',
                illustration: `<pre>
   🧊
    |
    O
   /|\\
   / \\
        </pre>`,
                description: 'استخدم كيس ثلج لمدة 15 دقيقة بعد التمارين'
            }
        ]
    }
};

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
    else if (jointId.includes('cervical')) jointKey = 'back-cervical';
    else if (jointId.includes('thoracic')) jointKey = 'back-thoracic';
    else if (jointId.includes('lumbar')) jointKey = 'back-lumbar';
    
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

// خوارزمية التشخيص المتقدمة والذكية
async function computeDiagnosis(jointId, answers, age, bmi, duration, severity, chronicDiseases, weight, height) {
    // محاولة استخدام النظام الخبير الجديد أولاً
    console.log('🔵 بدء التشخيص بالنظام الخبير الجديد');
    try {
        const system = await initializeExpertSystem();
        console.log('📊 النظام الخبير مهيأ:', !!system);
        
        if (system) {
            const result = await computeDiagnosisNew(jointId, answers, age, bmi, duration, severity, chronicDiseases, weight, height);
            console.log('📊 النتائج من النظام الجديد:', result);
            
            if (result && result.length > 0 && !result[0].error) {
                console.log('✅ النظام الخبير الجديد أرجع نتائج صحيحة');
                return result;
            } else {
                console.log('❌ النظام الخبير الجديد لم يُرجع نتائج صحيحة، استخدام النظام القديم');
            }
        } else {
            console.log('❌ النظام الخبير غير مهيأ، استخدام النظام القديم');
        }
    } catch (error) {
        console.error('❌ خطأ في النظام الخبير، استخدام النظام القديم:', error);
    }
    
    // النظام القديم كاحتياطي
    console.log('⚠️ استخدام النظام القديم كاحتياطي');
    return computeDiagnosisOld(jointId, answers, age, bmi, duration, severity, chronicDiseases, weight, height);
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
    if (age > 70) ageFactor = 1.4; // كبار السن أكثر عرضة للحالات التنكسية الشديدة
    else if (age > 60) ageFactor = 1.3;
    else if (age > 50) ageFactor = 1.2;
    else if (age > 40) ageFactor = 1.1;
    else if (age < 30) ageFactor = 0.9; // الشباب أقل عرضة لبعض الحالات التنكسية
    else if (age < 20) ageFactor = 0.85; // المراهقون أقل عرضة للحالات التنكسية
    
    let bmiFactor = 1;
    if (bmi > 40) bmiFactor = 1.5; // سمنة مفرطة جداً
    else if (bmi > 35) bmiFactor = 1.4; // سمنة مفرطة
    else if (bmi > 30) bmiFactor = 1.3; // سمنة
    else if (bmi > 25) bmiFactor = 1.15; // زيادة وزن
    else if (bmi < 18.5) bmiFactor = 1.1; // نقص الوزن قد يؤثر أيضاً
    
    let chronicFactor = 1;
    if (chronicDiseases.includes('diabetes')) chronicFactor = 1.25;
    if (chronicDiseases.includes('rheumatoid')) chronicFactor = 1.3;
    if (chronicDiseases.includes('osteoporosis')) chronicFactor = 1.2;
    if (chronicDiseases.includes('gout')) chronicFactor = 1.2;
    if (chronicDiseases.includes('fibromyalgia')) chronicFactor = 1.15;
    if (chronicDiseases.includes('hypertension')) chronicFactor = 1.1;
    if (chronicDiseases.includes('cancer_history')) chronicFactor = 1.4; // تاريخ سرطاني يزيد احتمالية النقائل
    
    // عامل شدة الألم
    let severityFactor = 1;
    if (severity >= 9) severityFactor = 1.3; // ألم شديد جداً
    else if (severity > 7) severityFactor = 1.2;
    else if (severity > 5) severityFactor = 1.1;
    else if (severity < 3) severityFactor = 0.9;
    else if (severity < 2) severityFactor = 0.85; // ألم خفيف جداً
    
    // عامل مدة الألم
    let durationFactor = 1;
    if (duration === 'chronic') durationFactor = 1.15;
    else if (duration === 'subacute') durationFactor = 1.05;
    else if (duration === 'acute') durationFactor = 1.0;
    
    // عامل جديد: عامل النشاط البدني
    let activityFactor = 1;
    if (answers.exercise_habit === 'no') activityFactor = 1.1; // قلة النشاط قد تزيد بعض الحالات
    if (answers.work_type === 'yes') activityFactor = 1.15; // العمل الشاق يزيد احتمالية الإصابات
    
    // عامل جديد: عامل الإصابات السابقة
    let injuryFactor = 1;
    if (answers.injury_history === 'yes') injuryFactor = 1.2; // إصابات سابقة تزيد احتمالية التكرار
    
    // تحليل النصوص المدخلة من textarea لاستخراج معلومات إضافية
    let textAnalysisScore = 0;
    let neuropathicIndicators = 0;
    let inflammatoryIndicators = 0;
    let mechanicalIndicators = 0;
    
    if (answers.pain_description) {
        const desc = answers.pain_description.toLowerCase();
        if (desc.includes('حارق') || desc.includes('نار') || desc.includes('لسع')) {
            textAnalysisScore += 10;
            neuropathicIndicators += 15;
        }
        if (desc.includes('تنميل') || desc.includes('خدر') || desc.includes('وخز')) {
            textAnalysisScore += 15;
            neuropathicIndicators += 20;
        }
        if (desc.includes('ضعف') || desc.includes('لا أستطيع')) {
            textAnalysisScore += 20;
            neuropathicIndicators += 15;
        }
        if (desc.includes('تشنج') || desc.includes('انقباض')) {
            textAnalysisScore += 10;
            mechanicalIndicators += 10;
        }
        if (desc.includes('طقطقة') || desc.includes('احتكاك')) {
            textAnalysisScore += 5;
            mechanicalIndicators += 15;
        }
        if (desc.includes('انتشار') || desc.includes('يمتد') || desc.includes('ينتقل')) {
            textAnalysisScore += 15;
            neuropathicIndicators += 10;
        }
        if (desc.includes('احمرار') || desc.includes('سخونة') || desc.includes('تورم')) {
            textAnalysisScore += 10;
            inflammatoryIndicators += 20;
        }
        if (desc.includes('صباحي') || desc.includes('تيبس صباحي')) {
            textAnalysisScore += 10;
            inflammatoryIndicators += 15;
        }
        if (desc.includes('تحسن مع الحركة') || desc.includes('يسوء مع الراحة')) {
            textAnalysisScore += 10;
            mechanicalIndicators += 15;
        }
        if (desc.includes('يسوء مع الحركة') || desc.includes('تحسن مع الراحة')) {
            textAnalysisScore += 10;
            inflammatoryIndicators += 15;
        }
    }
    if (answers.radiation_description) {
        const radDesc = answers.radiation_description.toLowerCase();
        if (radDesc.includes('ساق') || radDesc.includes('قدم') || radDesc.includes('ذراع') || radDesc.includes('يد')) {
            textAnalysisScore += 20;
            neuropathicIndicators += 25;
        }
        if (radDesc.includes('أصابع') || radDesc.includes('خنصر') || radDesc.includes('إبهام')) {
            textAnalysisScore += 15;
            neuropathicIndicators += 20;
        }
    }
    
    // تحديد نمط الألم بناءً على المؤشرات
    let painPattern = 'mechanical';
    if (neuropathicIndicators > inflammatoryIndicators && neuropathicIndicators > mechanicalIndicators) {
        painPattern = 'neuropathic';
    } else if (inflammatoryIndicators > neuropathicIndicators && inflammatoryIndicators > mechanicalIndicators) {
        painPattern = 'inflammatory';
    }
    
    // عامل نمط الألم
    let patternFactor = 1;
    if (painPattern === 'neuropathic') patternFactor = 1.2;
    else if (painPattern === 'inflammatory') patternFactor = 1.15;
    
    // تحديث pattern الكائن
    pattern.neuropathic = neuropathicIndicators > 15;
    pattern.inflammatory = inflammatoryIndicators > 15;
    pattern.mechanical = mechanicalIndicators > 15;
    pattern.type = painPattern;

    if (jointId.includes('shoulder')) {
        let imp=0, tend=0, tear=0, fro=0, adh=0, burs=0;

        // متلازمة الانحشار
        if(checkAnswer(answers, 'pain_trigger', "رفع الذراع جانباً")) imp+=40;
        if(checkAnswer(answers, 'pain_trigger', "رفع الذراع للأمام")) imp+=25;
        if(checkAnswer(answers, 'night_pain', "في أغلب الليالي")) imp+=45;
        if(checkAnswer(answers, 'night_pain', "أحياناً")) imp+=25;
        if(checkAnswer(answers, 'crepitus', "نعم مع ألم خفيف")) imp+=20;
        if(checkAnswer(answers, 'crepitus', "نعم مع ألم شديد")) imp+=30;
        if(checkAnswer(answers, 'pain_location', "مقدمة الكتف")) imp+=25;
        if(age > 40) imp+=15;
        // نقطة أساسية لضمان حد أدنى من النقاط
        if(checkAnswer(answers, 'pain_trigger', "لا يوجد محدد") && checkAnswer(answers, 'crepitus', "لا")) imp+=5;

        // التهاب الوتر
        if(checkAnswer(answers, 'repetitive_motion', "نعم بشكل مكثف")) tend+=35;
        if(checkAnswer(answers, 'repetitive_motion', "نعم بشكل متكرر")) tend+=25;
        if(checkAnswer(answers, 'pain_trigger', "حمل الأشياء الثقيلة")) tend+=30;
        if(checkAnswer(answers, 'night_pain', "في أغلب الليالي")) tend+=25;
        if(checkAnswer(answers, 'night_pain', "أحياناً")) tend+=15;
        if(checkAnswer(answers, 'crepitus', "نعم مع ألم شديد")) tend+=20;
        if(checkAnswer(answers, 'trauma_history', "نعم قبل أقل من شهر")) tend+=15;

        // تمزق الكفة المدورة
        if(checkAnswer(answers, 'weakness', "ضعف متوسط")) tear+=35;
        if(checkAnswer(answers, 'weakness', "ضعف شديد")) tear+=55;
        if(checkAnswer(answers, 'weakness', "ضعف بسيط")) tear+=15;
        if(checkAnswer(answers, 'night_pain', "في أغلب الليالي")) tear+=30;
        if(checkAnswer(answers, 'night_pain', "أحياناً")) tear+=20;
        if(checkAnswer(answers, 'pain_trigger', "رفع الذراع جانباً")) tear+=25;
        if(age > 50) tear+=20;
        if(age > 40) tear+=10;
        if(checkAnswer(answers, 'crepitus', "نعم مع ألم شديد")) tear+=15;
        // نقطة أساسية لضمان حد أدنى من النقاط
        if(checkAnswer(answers, 'weakness', "لا") && checkAnswer(answers, 'night_pain', "لا أبداً")) tear+=5;

        // التهاب كبسولة الكتف (Frozen Shoulder)
        if(checkAnswer(answers, 'stiffness_duration', "أكثر من ساعة")) fro+=40;
        if(checkAnswer(answers, 'stiffness_duration', "30 دقيقة - ساعة")) fro+=25;
        if(checkAnswer(answers, 'stiffness_duration', "أقل من 30 دقيقة")) fro+=10;
        if(checkAnswer(answers, 'range_motion', "قيود شديدة")) fro+=35;
        if(checkAnswer(answers, 'range_motion', "قيود متوسطة")) fro+=20;
        if(duration === 'chronic') fro+=20;
        if(age > 40 && age < 60) fro+=15;

        // التصاقات الكتف
        if(checkAnswer(answers, 'stiffness_duration', "أكثر من ساعة") && duration === 'chronic') adh+=30;
        if(checkAnswer(answers, 'pain_location', "مقدمة الكتف")) adh+=20;

        // التهاب الجراب
        if(checkAnswer(answers, 'pain_location', "جانب الكتف")) burs+=35;
        if(checkAnswer(answers, 'pain_trigger', "النوم على الكتف")) burs+=30;
        if(checkAnswer(answers, 'swelling', "تورم واضح")) burs+=25;
        if(checkAnswer(answers, 'swelling', "تورم متوسط")) burs+=15;
        // نقطة أساسية لضمان حد أدنى من النقاط
        if(checkAnswer(answers, 'pain_location', "مقدمة الكتف") && checkAnswer(answers, 'swelling', "لا")) burs+=5;
        
        // تطبيق عوامل التعديل الموسعة
        imp *= ageFactor * severityFactor * durationFactor * activityFactor * patternFactor;
        tend *= chronicFactor * severityFactor * activityFactor * injuryFactor;
        tear *= ageFactor * severityFactor * durationFactor * injuryFactor * patternFactor;
        fro *= ageFactor * durationFactor * activityFactor;
        adh *= ageFactor * durationFactor * activityFactor * injuryFactor;
        burs *= bmiFactor * severityFactor * inflammatoryIndicators > 10 ? 1.2 : 1;
        
        // إضافة نقاط تحليل النصوص للتشخيصات ذات الصلة بناءً على نمط الألم
        if (textAnalysisScore > 0) {
            if (painPattern === 'neuropathic') tear += textAnalysisScore * 0.6;
            if (painPattern === 'inflammatory') tend += textAnalysisScore * 0.4;
            if (painPattern === 'mechanical') imp += textAnalysisScore * 0.5;
            if (neuropathicIndicators > 20) tear += neuropathicIndicators * 0.3;
            if (inflammatoryIndicators > 20) tend += inflammatoryIndicators * 0.3;
            if (mechanicalIndicators > 20) imp += mechanicalIndicators * 0.3;
        }
        
        let total = imp+tend+tear+fro+adh+burs;
        if(total===0) total=1;
        
        scores.push({ name:"متلازمة انحشار الكتف (Impingement)", prob:Math.round(imp/total*100) });
        scores.push({ name:"التهاب وتر فوق الشوكة", prob:Math.round(tend/total*100) });
        scores.push({ name:"تمزق جزئي/كلي في الكفة المدورة", prob:Math.round(tear/total*100) });
        scores.push({ name:"التهاب كبسولة الكتف (Frozen Shoulder)", prob:Math.round(fro/total*100) });
        scores.push({ name:"التهاب الجراب تحت الأخرم", prob:Math.round(burs/total*100) });
        scores.push({ name:"تصاقات الكتف", prob:Math.round(adh/total*100) });
        
    } else if (jointId.includes('elbow')) {
        let lat=0, med=0, cub=0, tend=0, burs=0;

        // التهاب اللقيمة الخارجية (Tennis Elbow)
        if(checkAnswer(answers, 'pain_trigger', "مد الكوع")) lat+=45;
        if(checkAnswer(answers, 'pain_trigger', "تدوير الذراع")) lat+=35;
        if(checkAnswer(answers, 'tennis_golf', "رياضة الراحلة (تنس)")) lat+=40;
        if(checkAnswer(answers, 'tennis_golf', "عمل يدوي متكرر")) lat+=30;
        if(checkAnswer(answers, 'grip_weakness', "ضعف متوسط")) lat+=25;
        if(checkAnswer(answers, 'grip_weakness', "ضعف شديد")) lat+=35;
        if(checkAnswer(answers, 'grip_weakness', "ضعف بسيط")) lat+=15;
        // نقطة أساسية
        if(checkAnswer(answers, 'pain_trigger', "لا يوجد محدد") && checkAnswer(answers, 'grip_weakness', "لا")) lat+=5;

        // التهاب اللقيمة الداخلية (Golfer's Elbow)
        if(checkAnswer(answers, 'pain_trigger', "ثني الكوع")) med+=40;
        if(checkAnswer(answers, 'pain_trigger', "القبض القوي")) med+=35;
        if(checkAnswer(answers, 'tennis_golf', "جولف")) med+=45;
        if(checkAnswer(answers, 'grip_weakness', "ضعف متوسط")) med+=25;
        if(checkAnswer(answers, 'grip_weakness', "ضعف بسيط")) med+=15;

        // متلازمة النفق الكعبي
        if(checkAnswer(answers, 'numbness', "في الخنصر والبنصر")) cub+=50;
        if(checkAnswer(answers, 'numbness', "في جميع الأصابع")) cub+=30;
        if(checkAnswer(answers, 'night_symptoms', "توقظني من النوم")) cub+=35;
        if(checkAnswer(answers, 'night_symptoms', "نعم كثيراً")) cub+=25;
        if(checkAnswer(answers, 'weakness', "ضعف متوسط")) cub+=25;
        if(checkAnswer(answers, 'weakness', "ضعف خفيف")) cub+=15;

        // التهاب الأوتار
        if(checkAnswer(answers, 'repetitive_motion', "نعم بشكل مكثف")) tend+=30;
        if(checkAnswer(answers, 'repetitive_motion', "نعم بشكل متكرر")) tend+=20;
        if(checkAnswer(answers, 'swelling', "تورم واضح")) tend+=25;
        if(checkAnswer(answers, 'swelling', "تورم متوسط")) tend+=15;

        // التهاب الجراب
        if(checkAnswer(answers, 'swelling', "تورم واضح")) burs+=30;
        if(checkAnswer(answers, 'swelling', "تورم متوسط")) burs+=20;
        if(checkAnswer(answers, 'pain_location', "خلف الكوع")) burs+=35;
        
        // تطبيق عوامل التعديل الموسعة
        lat *= chronicFactor * severityFactor * activityFactor * injuryFactor;
        med *= chronicFactor * severityFactor * activityFactor * injuryFactor;
        cub *= ageFactor * severityFactor * patternFactor * neuropathicIndicators > 15 ? 1.3 : 1;
        tend *= chronicFactor * severityFactor * activityFactor * inflammatoryIndicators > 10 ? 1.2 : 1;
        burs *= bmiFactor * severityFactor * inflammatoryIndicators > 10 ? 1.2 : 1;
        
        // إضافة نقاط تحليل النصوص للتشخيصات ذات الصلة بناءً على نمط الألم
        if (textAnalysisScore > 0) {
            if (painPattern === 'neuropathic') cub += textAnalysisScore * 0.6;
            if (painPattern === 'inflammatory') tend += textAnalysisScore * 0.4;
            if (painPattern === 'mechanical') lat += textAnalysisScore * 0.5;
            if (neuropathicIndicators > 20) cub += neuropathicIndicators * 0.4;
            if (inflammatoryIndicators > 20) tend += inflammatoryIndicators * 0.3;
            if (mechanicalIndicators > 20) lat += mechanicalIndicators * 0.3;
        }
        
        let total = lat+med+cub+tend+burs;
        if(total===0) total=1;
        
        scores.push({ name:"التهاب اللقيمة الخارجية (Tennis Elbow)", prob:Math.round(lat/total*100) });
        scores.push({ name:"التهاب اللقيمة الداخلية (Golfer's Elbow)", prob:Math.round(med/total*100) });
        scores.push({ name:"متلازمة النفق الكعبي", prob:Math.round(cub/total*100) });
        scores.push({ name:"التهاب أوتار الكوع", prob:Math.round(tend/total*100) });
        scores.push({ name:"التهاب الجراب الكعبي", prob:Math.round(burs/total*100) });
        
    } else if (jointId.includes('wrist')) {
        let carpal=0, tend=0, deq=0, gang=0, arth=0;

        // متلازمة النفق الرسغي
        if(checkAnswer(answers, 'numbness_pattern', "في الإبهام والسبابة والوسطى")) carpal+=50;
        if(checkAnswer(answers, 'night_symptoms', "توقظني من النوم")) carpal+=45;
        if(checkAnswer(answers, 'night_symptoms', "نعم كثيراً")) carpal+=30;
        if(checkAnswer(answers, 'typing_computer', "أكثر من 4 ساعات يومياً")) carpal+=35;
        if(checkAnswer(answers, 'typing_computer', "2-4 ساعات يومياً")) carpal+=25;
        if(checkAnswer(answers, 'weakness', "ضعف متوسط")) carpal+=25;
        if(checkAnswer(answers, 'weakness', "ضعف شديد")) carpal+=35;
        if(checkAnswer(answers, 'weakness', "ضعف بسيط")) carpal+=15;
        if(checkAnswer(answers, 'pain_trigger', "الكتابة/استخدام الكمبيوتر")) carpal+=30;
        // نقطة أساسية
        if(checkAnswer(answers, 'numbness_pattern', "لا تنميل") && checkAnswer(answers, 'night_symptoms', "لا")) carpal+=5;

        // التهاب الأوتار
        if(checkAnswer(answers, 'pain_trigger', "التدوير")) tend+=35;
        if(checkAnswer(answers, 'pain_trigger', "القبض")) tend+=30;
        if(checkAnswer(answers, 'swelling', "تورم واضح")) tend+=25;
        if(checkAnswer(answers, 'swelling', "تورم متوسط")) tend+=15;

        // التهاب دي كيرفان
        if(checkAnswer(answers, 'pain_trigger', "القبض")) deq+=40;
        if(checkAnswer(answers, 'pain_location', "جانب الرسغ")) deq+=35;

        // الكيس الزليلي
        if(checkAnswer(answers, 'swelling', "تورم واضح")) gang+=40;
        if(checkAnswer(answers, 'swelling', "تورم متوسط")) gang+=25;
        if(checkAnswer(answers, 'pain_location', "ظهر الرسغ")) gang+=30;

        // خشونة الرسغ
        if(checkAnswer(answers, 'morning_stiffness', "أكثر من 30 دقيقة")) arth+=35;
        if(checkAnswer(answers, 'morning_stiffness', "15-30 دقيقة")) arth+=20;
        if(checkAnswer(answers, 'crepitus', "نعم مع ألم شديد")) arth+=30;
        if(checkAnswer(answers, 'crepitus', "نعم مع ألم خفيف")) arth+=20;
        if(age > 45) arth+=25;
        if(age > 35) arth+=15;
        // نقطة أساسية
        if(checkAnswer(answers, 'swelling', "لا") && age < 35) arth+=5;
        
        // تطبيق عوامل التعديل الموسعة
        carpal *= ageFactor * chronicFactor * severityFactor * patternFactor * neuropathicIndicators > 15 ? 1.3 : 1;
        tend *= chronicFactor * severityFactor * activityFactor * inflammatoryIndicators > 10 ? 1.2 : 1;
        deq *= chronicFactor * severityFactor * activityFactor * injuryFactor;
        gang *= bmiFactor * severityFactor * inflammatoryIndicators > 10 ? 1.2 : 1;
        arth *= ageFactor * bmiFactor * durationFactor * inflammatoryIndicators > 10 ? 1.2 : 1;
        
        // إضافة نقاط تحليل النصوص للتشخيصات ذات الصلة بناءً على نمط الألم
        if (textAnalysisScore > 0) {
            if (painPattern === 'neuropathic') carpal += textAnalysisScore * 0.6;
            if (painPattern === 'inflammatory') tend += textAnalysisScore * 0.4;
            if (painPattern === 'mechanical') deq += textAnalysisScore * 0.5;
            if (neuropathicIndicators > 20) carpal += neuropathicIndicators * 0.4;
            if (inflammatoryIndicators > 20) tend += inflammatoryIndicators * 0.3;
            if (mechanicalIndicators > 20) deq += mechanicalIndicators * 0.3;
        }
        
        let total = carpal+tend+deq+gang+arth;
        if(total===0) total=1;
        
        scores.push({ name:"متلازمة النفق الرسغي", prob:Math.round(carpal/total*100) });
        scores.push({ name:"التهاب أوتار الرسغ", prob:Math.round(tend/total*100) });
        scores.push({ name:"التهاب دي كيرفان", prob:Math.round(deq/total*100) });
        scores.push({ name:"الكيس الزليلي", prob:Math.round(gang/total*100) });
        scores.push({ name:"خشونة مفاصل الرسغ", prob:Math.round(arth/total*100) });
        
    } else if (jointId.includes('hip')) {
        let oa=0, bur=0, lab=0, troc=0, stress=0;

        // خشونة الورك
        if(checkAnswer(answers, 'pain_location', "الجانب الخارجي للفخذ")) oa+=35;
        if(checkAnswer(answers, 'pain_location', "المنطقة الإربية (الأربية)")) oa+=30;
        if(checkAnswer(answers, 'stiffness', "تيبس شديد")) oa+=35;
        if(checkAnswer(answers, 'stiffness', "تيبس متوسط")) oa+=25;
        if(checkAnswer(answers, 'morning_stiffness', "أكثر من 30 دقيقة")) oa+=30;
        if(checkAnswer(answers, 'morning_stiffness', "30 دقيقة - ساعة")) oa+=20;
        if(age > 50) oa+=35;
        if(age > 40) oa+=20;
        if(bmi > 27) oa+=30;
        if(checkAnswer(answers, 'range_motion', "قيود شديدة")) oa+=30;
        if(checkAnswer(answers, 'range_motion', "قيود متوسطة")) oa+=20;
        // نقطة أساسية
        if(checkAnswer(answers, 'stiffness', "لا") && age < 40) oa+=5;

        // التهاب الجراب المداري
        if(checkAnswer(answers, 'pain_location', "الجانب الخارجي للفخذ")) bur+=40;
        if(checkAnswer(answers, 'walking_pain', "بعد مسافة قصيرة")) bur+=35;
        if(checkAnswer(answers, 'walking_pain', "بعد مسافة متوسطة")) bur+=25;
        if(checkAnswer(answers, 'clicking', "نعم مع ألم")) bur+=25;
        if(checkAnswer(answers, 'clicking', "نعم بدون ألم")) bur+=15;

        // تمزق الشفة الوركية
        if(checkAnswer(answers, 'clicking', "نعم مع ألم")) lab+=35;
        if(checkAnswer(answers, 'pain_location', "المنطقة الإربية (الأربية)")) lab+=30;
        if(checkAnswer(answers, 'instability', "كثيراً")) lab+=25;
        if(checkAnswer(answers, 'instability', "أحياناً")) lab+=15;
        if(checkAnswer(answers, 'instability', "نادراً")) lab+=5;

        // التهاب الأوتار
        if(checkAnswer(answers, 'pain_location', "الجانب الخارجي للفخذ")) troc+=30;
        if(checkAnswer(answers, 'walking_pain', "بعد مسافة قصيرة")) troc+=25;
        if(checkAnswer(answers, 'walking_pain', "بعد مسافة متوسطة")) troc+=15;

        // إجهاد العظام
        if(checkAnswer(answers, 'walking_pain', "بعد مسافة قصيرة")) stress+=30;
        if(age < 30) stress+=20;
        if(age < 25) stress+=10;
        
        // تطبيق عوامل التعديل الموسعة
        oa *= ageFactor * bmiFactor * durationFactor * severityFactor * inflammatoryIndicators > 10 ? 1.2 : 1;
        bur *= bmiFactor * severityFactor * activityFactor * inflammatoryIndicators > 10 ? 1.2 : 1;
        lab *= ageFactor * severityFactor * activityFactor * injuryFactor;
        troc *= chronicFactor * severityFactor * activityFactor * injuryFactor;
        stress *= ageFactor * severityFactor * activityFactor * injuryFactor;
        
        // إضافة نقاط تحليل النصوص للتشخيصات ذات الصلة بناءً على نمط الألم
        if (textAnalysisScore > 0) {
            if (painPattern === 'inflammatory') oa += textAnalysisScore * 0.5;
            if (painPattern === 'mechanical') lab += textAnalysisScore * 0.4;
            if (painPattern === 'inflammatory') bur += textAnalysisScore * 0.3;
            if (inflammatoryIndicators > 20) oa += inflammatoryIndicators * 0.3;
            if (mechanicalIndicators > 20) lab += mechanicalIndicators * 0.3;
            if (inflammatoryIndicators > 20) bur += inflammatoryIndicators * 0.2;
        }
        
        let total = oa+bur+lab+troc+stress;
        if(total===0) total=1;
        
        scores.push({ name:"خشونة مفاصل الورك", prob:Math.round(oa/total*100) });
        scores.push({ name:"التهاب الجراب المداري", prob:Math.round(bur/total*100) });
        scores.push({ name:"تمزق الشفة الوركية", prob:Math.round(lab/total*100) });
        scores.push({ name:"التهاب أوتار الورك", prob:Math.round(troc/total*100) });
        scores.push({ name:"إجهاد العظام", prob:Math.round(stress/total*100) });
        
    } else if (jointId.includes('knee')) {
        let men=0, pat=0, oa=0, pfs=0, tend=0, burs=0, osg=0;

        // تمزق الغضروف الهلالي
        if(checkAnswer(answers, 'instability', "كثيراً")) men+=50;
        if(checkAnswer(answers, 'instability', "أحياناً")) men+=35;
        if(checkAnswer(answers, 'instability', "نادراً")) men+=15;
        if(checkAnswer(answers, 'giving_way', "كثيراً")) men+=45;
        if(checkAnswer(answers, 'giving_way', "أحياناً")) men+=30;
        if(checkAnswer(answers, 'catching', "نعم مع ألم شديد")) men+=40;
        if(checkAnswer(answers, 'catching', "نعم مع ألم خفيف")) men+=25;
        if(checkAnswer(answers, 'locking', "نعم كثيراً")) men+=45;
        if(checkAnswer(answers, 'locking', "نعم أحياناً")) men+=30;
        if(checkAnswer(answers, 'pain_location', "جانب الركبة الداخلي") || checkAnswer(answers, 'pain_location', "جانب الركبة الخارجي")) men+=30;
        if(checkAnswer(answers, 'trauma_history', "نعم حديثة")) men+=35;
        // نقطة أساسية
        if(checkAnswer(answers, 'instability', "لا أبداً") && checkAnswer(answers, 'giving_way', "لا")) men+=5;

        // خلل تتبع الصابونة
        if(checkAnswer(answers, 'stairs_pain', "بشدة")) pat+=45;
        if(checkAnswer(answers, 'stairs_pain', "بشكل واضح")) pat+=30;
        if(checkAnswer(answers, 'pain_location', "مقدمة الركبة")) pat+=40;
        if(checkAnswer(answers, 'sitting_pain', "نعم بشدة")) pat+=35;
        if(checkAnswer(answers, 'sitting_pain', "نعم قليلاً")) pat+=20;

        // خشونة الركبة
        if(checkAnswer(answers, 'morning_stiffness', "أكثر من 30 دقيقة")) oa+=40;
        if(checkAnswer(answers, 'morning_stiffness', "15-30 دقيقة")) oa+=25;
        if(checkAnswer(answers, 'crepitus', "نعم مع ألم شديد")) oa+=35;
        if(checkAnswer(answers, 'crepitus', "نعم مع ألم خفيف")) oa+=25;
        if(age > 50) oa+=40;
        if(age > 40) oa+=25;
        if(bmi > 27) oa+=40;
        if(checkAnswer(answers, 'swelling', "تورم واضح")) oa+=25;
        if(checkAnswer(answers, 'swelling', "تورم متوسط")) oa+=15;
        if(duration === 'chronic') oa+=30;
        // نقطة أساسية
        if(checkAnswer(answers, 'morning_stiffness', "لا") && age < 40) oa+=5;

        // متلازمة ألم الرضفة
        if(checkAnswer(answers, 'pain_location', "مقدمة الركبة")) pfs+=35;
        if(checkAnswer(answers, 'stairs_pain', "بشدة")) pfs+=30;
        if(checkAnswer(answers, 'stairs_pain', "قليلاً")) pfs+=15;
        if(age < 30) pfs+=20;
        if(age < 25) pfs+=10;
        
        // التهاب الأوتار
        if(checkAnswer(answers, 'pain_location', "مقدمة الركبة")) tend+=30;
        if(checkAnswer(answers, 'swelling', "تورم واضح")) tend+=25;
        if(checkAnswer(answers, 'swelling', "تورم متوسط")) tend+=15;

        // التهاب الجراب
        if(checkAnswer(answers, 'pain_location', "مقدمة الركبة")) burs+=30;
        if(checkAnswer(answers, 'swelling', "تورم واضح")) burs+=35;
        if(checkAnswer(answers, 'swelling', "تورم متوسط")) burs+=25;

        // مرض أوزغود-شلاتر
        if(checkAnswer(answers, 'pain_location', "مقدمة الركبة")) osg+=30;
        if(age < 18) osg+=40;
        if(age < 15) osg+=20;
        
        // تطبيق عوامل التعديل الموسعة
        men *= ageFactor * severityFactor * injuryFactor * patternFactor;
        pat *= bmiFactor * severityFactor * activityFactor * mechanicalIndicators > 10 ? 1.2 : 1;
        oa *= ageFactor * bmiFactor * durationFactor * severityFactor * inflammatoryIndicators > 10 ? 1.2 : 1;
        pfs *= bmiFactor * severityFactor * activityFactor * mechanicalIndicators > 10 ? 1.2 : 1;
        tend *= chronicFactor * severityFactor * activityFactor * injuryFactor;
        burs *= bmiFactor * severityFactor * inflammatoryIndicators > 10 ? 1.2 : 1;
        osg *= ageFactor * severityFactor * activityFactor * injuryFactor;
        
        // إضافة نقاط تحليل النصوص للتشخيصات ذات الصلة بناءً على نمط الألم
        if (textAnalysisScore > 0) {
            if (painPattern === 'mechanical') men += textAnalysisScore * 0.5;
            if (painPattern === 'inflammatory') oa += textAnalysisScore * 0.4;
            if (painPattern === 'mechanical') pat += textAnalysisScore * 0.4;
            if (mechanicalIndicators > 20) men += mechanicalIndicators * 0.3;
            if (inflammatoryIndicators > 20) oa += inflammatoryIndicators * 0.3;
            if (mechanicalIndicators > 20) pat += mechanicalIndicators * 0.3;
        }
        
        let total = men+pat+oa+pfs+tend+burs+osg;
        if(total===0) total=1;
        
        scores.push({ name:"تمزق الغضروف الهلالي", prob:Math.round(men/total*100) });
        scores.push({ name:"خلل تتبع الصابونة", prob:Math.round(pat/total*100) });
        scores.push({ name:"خشونة مفاصل الركبة", prob:Math.round(oa/total*100) });
        scores.push({ name:"متلازمة ألم الرضفة", prob:Math.round(pfs/total*100) });
        scores.push({ name:"التهاب أوتار الركبة", prob:Math.round(tend/total*100) });
        scores.push({ name:"التهاب الجراب الرضفي", prob:Math.round(burs/total*100) });
        scores.push({ name:"مرض أوزغود-شلاتر", prob:Math.round(osg/total*100) });
        
    } else if (jointId.includes('ankle')) {
        let sprain=0, inst=0, tend=0, arth=0, stress=0;

        // التواء الكاحل
        if(checkAnswer(answers, 'sprain_history', "مرة واحدة")) sprain+=45;
        if(checkAnswer(answers, 'sprain_history', "عدة مرات")) sprain+=35;
        if(checkAnswer(answers, 'sprain_history', "مزمن")) sprain+=25;
        if(checkAnswer(answers, 'trauma_history', "نعم حديثة")) sprain+=40;
        if(checkAnswer(answers, 'swelling', "تورم واضح")) sprain+=30;
        if(checkAnswer(answers, 'swelling', "تورم متوسط")) sprain+=20;
        // نقطة أساسية
        if(checkAnswer(answers, 'sprain_history', "لا") && checkAnswer(answers, 'swelling', "لا")) sprain+=5;

        // عدم استقرار الكاحل
        if(checkAnswer(answers, 'instability', "كثيراً")) inst+=50;
        if(checkAnswer(answers, 'instability', "أحياناً")) inst+=35;
        if(checkAnswer(answers, 'instability', "نادراً")) inst+=15;
        if(checkAnswer(answers, 'sprain_history', "مزمن")) inst+=45;
        if(checkAnswer(answers, 'sprain_history', "عدة مرات")) inst+=30;

        // التهاب الأوتار
        if(checkAnswer(answers, 'pain_trigger', "الصعود على الأصابع")) tend+=35;
        if(checkAnswer(answers, 'pain_trigger', "الدوران")) tend+=30;
        if(checkAnswer(answers, 'swelling', "تورم واضح")) tend+=25;
        if(checkAnswer(answers, 'swelling', "تورم متوسط")) tend+=15;

        // خشونة الكاحل
        if(checkAnswer(answers, 'crepitus', "نعم مع ألم شديد")) arth+=35;
        if(checkAnswer(answers, 'crepitus', "نعم مع ألم خفيف")) arth+=25;
        if(checkAnswer(answers, 'sprain_history', "مزمن")) arth+=30;
        if(age > 45) arth+=25;
        if(age > 35) arth+=15;

        // إجهاد العظام
        if(checkAnswer(answers, 'pain_trigger', "المشي")) stress+=30;
        if(checkAnswer(answers, 'pain_trigger', "الجري")) stress+=35;
        if(age < 30) stress+=20;
        if(checkAnswer(answers, 'pain_trigger', "الجري")) stress+=35;
        
        // تطبيق عوامل التعديل الموسعة
        sprain *= severityFactor * injuryFactor * activityFactor;
        inst *= ageFactor * severityFactor * injuryFactor * patternFactor;
        tend *= chronicFactor * severityFactor * activityFactor * injuryFactor;
        arth *= ageFactor * bmiFactor * durationFactor * inflammatoryIndicators > 10 ? 1.2 : 1;
        stress *= ageFactor * severityFactor * activityFactor * injuryFactor;
        
        // إضافة نقاط تحليل النصوص للتشخيصات ذات الصلة بناءً على نمط الألم
        if (textAnalysisScore > 0) {
            if (painPattern === 'mechanical') sprain += textAnalysisScore * 0.5;
            if (painPattern === 'mechanical') inst += textAnalysisScore * 0.5;
            if (painPattern === 'inflammatory') tend += textAnalysisScore * 0.4;
            if (mechanicalIndicators > 20) sprain += mechanicalIndicators * 0.3;
            if (mechanicalIndicators > 20) inst += mechanicalIndicators * 0.3;
            if (inflammatoryIndicators > 20) tend += inflammatoryIndicators * 0.3;
        }
        
        let total = sprain+inst+tend+arth+stress;
        if(total===0) total=1;
        
        scores.push({ name:"التواء الكاحل الحاد/المزمن", prob:Math.round(sprain/total*100) });
        scores.push({ name:"عدم استقرار الكاحل المزمن", prob:Math.round(inst/total*100) });
        scores.push({ name:"التهاب أوتار الكاحل", prob:Math.round(tend/total*100) });
        scores.push({ name:"خشونة مفاصل الكاحل", prob:Math.round(arth/total*100) });
        scores.push({ name:"إجهاد العظام", prob:Math.round(stress/total*100) });
        
    } else if (jointId.includes('calf')) {
        let strain=0, dvt=0, shin=0, tend=0;

        // إجهاد عضلة الساق
        if(checkAnswer(answers, 'pain_trigger', "الجري")) strain+=40;
        if(checkAnswer(answers, 'pain_trigger', "صعود الدرج")) strain+=35;
        if(checkAnswer(answers, 'pain_trigger', "المشي")) strain+=25;
        if(checkAnswer(answers, 'pain_trigger', "الوقوف الطويل")) strain+=15;
        if(checkAnswer(answers, 'cramps', "كثيراً")) strain+=30;
        if(checkAnswer(answers, 'cramps', "أحياناً")) strain+=20;
        if(checkAnswer(answers, 'swelling', "تورم واضح")) strain+=25;
        if(checkAnswer(answers, 'swelling', "تورم متوسط")) strain+=15;
        // نقطة أساسية
        if(checkAnswer(answers, 'pain_trigger', "لا يوجد محدد") && checkAnswer(answers, 'cramps', "لا")) strain+=5;

        // جلطة الأوردة العميقة
        if(checkAnswer(answers, 'dvt_risk', "نعم أكثر من واحد")) dvt+=50;
        if(checkAnswer(answers, 'dvt_risk', "نعم واحد")) dvt+=35;
        if(checkAnswer(answers, 'swelling', "تورم واضح")) dvt+=30;
        if(checkAnswer(answers, 'swelling', "تورم متوسط")) dvt+=20;
        
        // التهاب الغشاء المحيط بالعظم
        if(checkAnswer(answers, 'pain_trigger', "الجري")) shin+=35;
        if(checkAnswer(answers, 'pain_trigger', "المشي")) shin+=25;
        if(checkAnswer(answers, 'pain_trigger', "صعود الدرج")) shin+=20;

        // التهاب الأوتار
        if(checkAnswer(answers, 'pain_trigger', "صعود الدرج")) tend+=30;
        if(checkAnswer(answers, 'pain_trigger', "الجري")) tend+=25;
        if(checkAnswer(answers, 'swelling', "تورم واضح")) tend+=20;
        
        // تطبيق عوامل التعديل الموسعة
        strain *= chronicFactor * severityFactor * activityFactor * injuryFactor;
        dvt *= bmiFactor * chronicFactor * severityFactor * chronicDiseases.includes('diabetes') ? 1.3 : 1;
        shin *= ageFactor * severityFactor * activityFactor * mechanicalIndicators > 10 ? 1.2 : 1;
        tend *= chronicFactor * severityFactor * activityFactor * injuryFactor;
        
        // إضافة نقاط تحليل النصوص للتشخيصات ذات الصلة بناءً على نمط الألم
        if (textAnalysisScore > 0) {
            if (painPattern === 'inflammatory') dvt += textAnalysisScore * 0.5;
            if (painPattern === 'mechanical') strain += textAnalysisScore * 0.4;
            if (painPattern === 'mechanical') shin += textAnalysisScore * 0.4;
            if (inflammatoryIndicators > 20) dvt += inflammatoryIndicators * 0.3;
            if (mechanicalIndicators > 20) strain += mechanicalIndicators * 0.3;
            if (mechanicalIndicators > 20) shin += mechanicalIndicators * 0.3;
        }
        
        let total = strain+dvt+shin+tend;
        if(total===0) total=1;
        
        scores.push({ name:"إجهاد عضلة الساق", prob:Math.round(strain/total*100) });
        scores.push({ name:"احتمالية جلطة أوردة (DVT) - يتطلب فحصاً عاجلاً", prob:Math.round(dvt/total*100) });
        scores.push({ name:"التهاب الغشاء المحيط بالعظم", prob:Math.round(shin/total*100) });
        scores.push({ name:"التهاب أوتار الساق", prob:Math.round(tend/total*100) });
        
    } else if (jointId === 'back-cervical') {
        let disc=0, myof=0, radic=0, sten=0, post=0;

        // انزلاق غضروفي عنقي
        if(checkAnswer(answers, 'neck_radiation', "إلى الأصابع")) disc+=50;
        if(checkAnswer(answers, 'arm_weakness', "ضعف شديد")) disc+=45;
        if(checkAnswer(answers, 'arm_weakness', "ضعف متوسط")) disc+=30;
        if(checkAnswer(answers, 'finger_numbness', "في جميع الأصابع")) disc+=40;
        if(checkAnswer(answers, 'finger_numbness', "في الإبهام والسبابة والوسطى")) disc+=35;
        if(checkAnswer(answers, 'movement_worsens', "نعم بشدة")) disc+=30;
        if(age > 40) disc+=20;
        // نقطة أساسية لضمان حد أدنى من النقاط
        if(checkAnswer(answers, 'neck_radiation', "لا") && checkAnswer(answers, 'arm_weakness', "لا") && checkAnswer(answers, 'finger_numbness', "لا")) disc+=5;

        // تشنج عضلي ونقاط زناد
        if(checkAnswer(answers, 'dizziness', "كثيراً")) myof+=35;
        if(checkAnswer(answers, 'headache', "نعم كثيراً")) myof+=30;
        if(checkAnswer(answers, 'stiffness', "تيبس شديد")) myof+=30;
        if(checkAnswer(answers, 'stiffness', "تيبس متوسط")) myof+=20;
        if(checkAnswer(answers, 'stiffness', "تيبس خفيف")) myof+=10;
        if(checkAnswer(answers, 'posture', "نعم بشكل مكثف")) myof+=35;
        if(checkAnswer(answers, 'posture', "نعم بشكل متكرر")) myof+=25;
        if(checkAnswer(answers, 'posture', "نعم قليلاً")) myof+=15;
        if(checkAnswer(answers, 'work_sitting', "أكثر من 8 ساعات")) myof+=25;
        if(checkAnswer(answers, 'work_sitting', "4-8 ساعات")) myof+=15;
        if(checkAnswer(answers, 'typing_computer', "أكثر من 4 ساعات يومياً")) myof+=30;
        if(checkAnswer(answers, 'typing_computer', "2-4 ساعات يومياً")) myof+=20;
        // نقطة أساسية لضمان حد أدنى من النقاط
        if(checkAnswer(answers, 'stiffness', "لا") && checkAnswer(answers, 'posture', "لا")) myof+=10;

        // اعتلال الجذور العصبية
        if(checkAnswer(answers, 'neck_radiation', "إلى الذراع")) radic+=40;
        if(checkAnswer(answers, 'neck_radiation', "إلى الكتف فقط")) radic+=25;
        if(checkAnswer(answers, 'finger_numbness', "لا") === false) radic+=35;
        if(checkAnswer(answers, 'arm_weakness', "ضعف متوسط")) radic+=30;
        if(checkAnswer(answers, 'arm_weakness', "ضعف خفيف")) radic+=15;

        // تضيق القناة العنقية
        if(checkAnswer(answers, 'leg_numbness', "نعم شديد")) sten+=40;
        if(checkAnswer(answers, 'leg_numbness', "نعم متوسط")) sten+=25;
        if(checkAnswer(answers, 'walking_pain', "بشدة")) sten+=35;
        if(age > 60) sten+=30;
        if(age > 50) sten+=15;

        // مشاكل وضعية
        if(checkAnswer(answers, 'posture', "نعم بشكل مكثف")) post+=40;
        if(checkAnswer(answers, 'posture', "نعم بشكل متكرر")) post+=30;
        if(checkAnswer(answers, 'work_sitting', "أكثر من 8 ساعات")) post+=35;
        if(checkAnswer(answers, 'work_sitting', "4-8 ساعات")) post+=25;
        if(checkAnswer(answers, 'typing_computer', "أكثر من 4 ساعات يومياً")) post+=30;
        if(checkAnswer(answers, 'typing_computer', "2-4 ساعات يومياً")) post+=20;
        
        // تطبيق عوامل التعديل الموسعة
        disc *= ageFactor * severityFactor * durationFactor * patternFactor * neuropathicIndicators > 15 ? 1.3 : 1;
        myof *= chronicFactor * severityFactor * activityFactor * mechanicalIndicators > 10 ? 1.2 : 1;
        radic *= ageFactor * severityFactor * patternFactor * neuropathicIndicators > 15 ? 1.3 : 1;
        sten *= ageFactor * severityFactor * patternFactor * neuropathicIndicators > 15 ? 1.3 : 1;
        post *= chronicFactor * severityFactor * activityFactor * mechanicalIndicators > 10 ? 1.2 : 1;
        
        // إضافة نقاط تحليل النصوص للتشخيصات ذات الصلة بناءً على نمط الألم
        if (textAnalysisScore > 0) {
            if (painPattern === 'neuropathic') radic += textAnalysisScore * 0.6;
            if (painPattern === 'neuropathic') disc += textAnalysisScore * 0.5;
            if (painPattern === 'neuropathic') sten += textAnalysisScore * 0.5;
            if (painPattern === 'mechanical') myof += textAnalysisScore * 0.4;
            if (neuropathicIndicators > 20) radic += neuropathicIndicators * 0.4;
            if (neuropathicIndicators > 20) disc += neuropathicIndicators * 0.3;
            if (neuropathicIndicators > 20) sten += neuropathicIndicators * 0.3;
            if (mechanicalIndicators > 20) myof += mechanicalIndicators * 0.3;
        }
        
        let total = disc+myof+radic+sten+post;
        if(total===0) total=1;
        
        scores.push({ name:"انزلاق غضروفي عنقي (C5-C6 أو C6-C7)", prob:Math.round(disc/total*100) });
        scores.push({ name:"تشنج عضلي ونقاط زناد", prob:Math.round(myof/total*100) });
        scores.push({ name:"اعتلال الجذور العصبية العنقية", prob:Math.round(radic/total*100) });
        scores.push({ name:"تضيق القناة العنقية", prob:Math.round(sten/total*100) });
        scores.push({ name:"متلازمة الألم الوضعي", prob:Math.round(post/total*100) });
        
    } else if (jointId === 'back-thoracic') {
        let mus=0, disc=0, post=0, cost=0, scheu=0;

        // تشنج عضلي
        if(checkAnswer(answers, 'breathing_pain', "نعم بشدة")) mus+=35;
        if(checkAnswer(answers, 'breathing_pain', "نعم قليلاً")) mus+=20;
        if(checkAnswer(answers, 'posture', "انحناء واضح")) mus+=30;
        if(checkAnswer(answers, 'posture', "انحناء متوسط")) mus+=20;
        if(checkAnswer(answers, 'work_sitting', "أكثر من 8 ساعات")) mus+=25;
        if(checkAnswer(answers, 'work_sitting', "4-8 ساعات")) mus+=15;
        // نقطة أساسية
        if(checkAnswer(answers, 'breathing_pain', "لا") && checkAnswer(answers, 'posture', "لا")) mus+=10;

        // انزلاق غضروفي صدري (نادر)
        if(checkAnswer(answers, 'radiation', "للصدر من الأمام")) disc+=35;
        if(checkAnswer(answers, 'radiation', "للبطن")) disc+=30;
        if(checkAnswer(answers, 'radiation', "للأضلاع الجانبية")) disc+=25;
        
        // مشاكل وضعية
        if(checkAnswer(answers, 'posture', "انحناء واضح")) post+=40;
        if(checkAnswer(answers, 'posture', "انحناء متوسط")) post+=30;
        if(checkAnswer(answers, 'work_sitting', "أكثر من 8 ساعات")) post+=35;
        if(checkAnswer(answers, 'work_sitting', "4-8 ساعات")) post+=25;

        // التهاب الغضاريف الضلعية
        if(checkAnswer(answers, 'breathing_pain', "نعم بشدة")) cost+=40;
        if(checkAnswer(answers, 'breathing_pain', "نعم قليلاً")) cost+=25;
        if(checkAnswer(answers, 'pain_location', "جانب واحد")) cost+=35;

        // مرض شويرمان
        if(checkAnswer(answers, 'posture', "انحناء واضح") && age < 25) scheu+=35;
        
        // تطبيق عوامل التعديل الموسعة
        mus *= chronicFactor * severityFactor * activityFactor * mechanicalIndicators > 10 ? 1.2 : 1;
        disc *= ageFactor * severityFactor * durationFactor * patternFactor * neuropathicIndicators > 15 ? 1.3 : 1;
        post *= chronicFactor * severityFactor * activityFactor * mechanicalIndicators > 10 ? 1.2 : 1;
        cost *= ageFactor * severityFactor * inflammatoryIndicators > 10 ? 1.2 : 1;
        scheu *= ageFactor * severityFactor * activityFactor * mechanicalIndicators > 10 ? 1.2 : 1;
        
        // إضافة نقاط تحليل النصوص للتشخيصات ذات الصلة بناءً على نمط الألم
        if (textAnalysisScore > 0) {
            if (painPattern === 'neuropathic') disc += textAnalysisScore * 0.5;
            if (painPattern === 'mechanical') mus += textAnalysisScore * 0.4;
            if (painPattern === 'inflammatory') cost += textAnalysisScore * 0.4;
            if (neuropathicIndicators > 20) disc += neuropathicIndicators * 0.3;
            if (mechanicalIndicators > 20) mus += mechanicalIndicators * 0.3;
            if (inflammatoryIndicators > 20) cost += inflammatoryIndicators * 0.3;
        }
        
        let total = mus+disc+post+cost+scheu;
        if(total===0) total=1;
        
        scores.push({ name:"تشنج عضلي في منتصف الظهر", prob:Math.round(mus/total*100) });
        scores.push({ name:"انزلاق غضروفي صدري", prob:Math.round(disc/total*100) });
        scores.push({ name:"متلازمة الألم الوضعي", prob:Math.round(post/total*100) });
        scores.push({ name:"التهاب الغضاريف الضلعية", prob:Math.round(cost/total*100) });
        scores.push({ name:"مرض شويرمان (في الشباب)", prob:Math.round(scheu/total*100) });
        
    } else if (jointId === 'back-lumbar') {
        let disc=0, sten=0, mus=0, spond=0, facet=0, si=0;

        // انزلاق غضروفي قطني
        if(checkAnswer(answers, 'radiation', "إلى أسفل الساق والقدم")) disc+=55;
        if(checkAnswer(answers, 'cough_pain', "نعم بشدة")) disc+=40;
        if(checkAnswer(answers, 'cough_pain', "نعم قليلاً")) disc+=25;
        if(checkAnswer(answers, 'toe_weakness', "لا أستطيع الرفع")) disc+=50;
        if(checkAnswer(answers, 'toe_weakness', "ضعف متوسط")) disc+=35;
        if(checkAnswer(answers, 'toe_weakness', "ضعف خفيف")) disc+=20;
        if(checkAnswer(answers, 'leg_numbness', "نعم شديد")) disc+=40;
        if(checkAnswer(answers, 'leg_numbness', "نعم متوسط")) disc+=25;
        if(checkAnswer(answers, 'leg_numbness', "نعم خفيف")) disc+=15;
        if(checkAnswer(answers, 'trauma_history', "نعم حديثة")) disc+=30;
        if(age > 30 && age < 50) disc+=20;
        // نقطة أساسية
        if(checkAnswer(answers, 'radiation', "لا") && checkAnswer(answers, 'cough_pain', "لا") && checkAnswer(answers, 'toe_weakness', "لا")) disc+=5;

        // تضيق القناة العصبية
        if(checkAnswer(answers, 'sitting_pain', "نعم بشدة")) sten+=40;
        if(checkAnswer(answers, 'sitting_pain', "نعم قليلاً")) sten+=25;
        if(checkAnswer(answers, 'walking_relief', "نعم بشدة")) sten+=45;
        if(checkAnswer(answers, 'walking_relief', "نعم قليلاً")) sten+=30;
        if(checkAnswer(answers, 'flexion_relief', "نعم بشدة")) sten+=45;
        if(checkAnswer(answers, 'flexion_relief', "نعم قليلاً")) sten+=30;
        if(checkAnswer(answers, 'standing_pain', "نعم بشدة")) sten+=35;
        if(checkAnswer(answers, 'standing_pain', "نعم قليلاً")) sten+=20;
        if(age > 60) sten+=35;
        if(age > 50) sten+=20;

        // تشنج عضلي مزمن
        if(duration === 'chronic') mus+=35;
        if(duration === 'subacute') mus+=20;
        if(checkAnswer(answers, 'morning_stiffness', "أقل من 30 دقيقة")) mus+=25;
        if(checkAnswer(answers, 'morning_stiffness', "لا يوجد")) mus+=15;
        if(checkAnswer(answers, 'trauma_history', "نعم قديمة")) mus+=20;
        if(checkAnswer(answers, 'pain_location', "وسط أسفل الظهر")) mus+=25;
        if(checkAnswer(answers, 'pain_location', "جانب واحد")) mus+=15;
        // نقطة أساسية
        if(checkAnswer(answers, 'pain_location', "وسط أسفل الظهر") && duration === 'chronic') mus+=10;

        // انزلاق فقاري
        if(checkAnswer(answers, 'instability', "كثيراً")) spond+=40;
        if(checkAnswer(answers, 'instability', "أحياناً")) spond+=25;
        if(checkAnswer(answers, 'instability', "نادراً")) spond+=15;
        if(checkAnswer(answers, 'trauma_history', "نعم حديثة")) spond+=35;
        if(age > 50) spond+=25;

        // التهاب المفاصل الفقرية
        if(checkAnswer(answers, 'stiffness', "تيبس شديد")) facet+=35;
        if(checkAnswer(answers, 'stiffness', "تيبس متوسط")) facet+=25;
        if(checkAnswer(answers, 'stiffness', "تيبس خفيف")) facet+=15;
        if(checkAnswer(answers, 'morning_stiffness', "أكثر من 30 دقيقة")) facet+=30;
        if(checkAnswer(answers, 'morning_stiffness', "30 دقيقة - ساعة")) facet+=20;
        if(age > 45) facet+=25;
        if(age > 50) facet+=15;

        // التهاب مفصل الحرقفي العجزي
        if(checkAnswer(answers, 'pain_location', "جانب واحد")) si+=40;
        if(checkAnswer(answers, 'radiation', "إلى الأرداف فقط")) si+=35;
        if(checkAnswer(answers, 'radiation', "إلى الأرداف فقط") && checkAnswer(answers, 'pain_location', "جانب واحد")) si+=15;
        
        // تطبيق عوامل التعديل الموسعة
        disc *= ageFactor * severityFactor * durationFactor * patternFactor * neuropathicIndicators > 15 ? 1.3 : 1;
        sten *= ageFactor * severityFactor * patternFactor * neuropathicIndicators > 15 ? 1.3 : 1;
        mus *= chronicFactor * severityFactor * activityFactor * mechanicalIndicators > 10 ? 1.2 : 1;
        spond *= ageFactor * severityFactor * injuryFactor * patternFactor;
        facet *= ageFactor * bmiFactor * durationFactor * inflammatoryIndicators > 10 ? 1.2 : 1;
        si *= bmiFactor * severityFactor * inflammatoryIndicators > 10 ? 1.2 : 1;
        
        // إضافة نقاط تحليل النصوص للتشخيصات ذات الصلة بناءً على نمط الألم
        if (textAnalysisScore > 0) {
            if (painPattern === 'neuropathic') disc += textAnalysisScore * 0.6;
            if (painPattern === 'neuropathic') sten += textAnalysisScore * 0.5;
            if (painPattern === 'mechanical') mus += textAnalysisScore * 0.4;
            if (painPattern === 'inflammatory') facet += textAnalysisScore * 0.4;
            if (neuropathicIndicators > 20) disc += neuropathicIndicators * 0.4;
            if (neuropathicIndicators > 20) sten += neuropathicIndicators * 0.3;
            if (mechanicalIndicators > 20) mus += mechanicalIndicators * 0.3;
            if (inflammatoryIndicators > 20) facet += inflammatoryIndicators * 0.3;
        }
        
        let total = disc+sten+mus+spond+facet+si;
        if(total===0) total=1;
        
        scores.push({ name:"انزلاق غضروفي قطني (L4-L5 أو L5-S1)", prob:Math.round(disc/total*100) });
        scores.push({ name:"تضيق القناة العصبية القطنية", prob:Math.round(sten/total*100) });
        scores.push({ name:"تشنج عضلي مزمن", prob:Math.round(mus/total*100) });
        scores.push({ name:"انزلاق فقاري (Spondylolisthesis)", prob:Math.round(spond/total*100) });
        scores.push({ name:"التهاب المفاصل الفقرية (Facet Joint Arthritis)", prob:Math.round(facet/total*100) });
        scores.push({ name:"التهاب مفصل الحرقفي العجزي (SI Joint)", prob:Math.round(si/total*100) });
        
    } else if (jointId === 'back-coccyx') {
        let coc=0, pil=0, inj=0;

        // ألم العصعص
        if(checkAnswer(answers, 'sitting_pain', "لا أستطيع الجلوس")) coc+=50;
        if(checkAnswer(answers, 'sitting_pain', "نعم بشدة")) coc+=40;
        if(checkAnswer(answers, 'standing_relief', "نعم بشدة")) coc+=35;

        // كيس العصعص
        if(checkAnswer(answers, 'sitting_pain', "نعم بشدة")) pil+=35;
        if(checkAnswer(answers, 'bowel_pain', "نعم بشدة")) pil+=30;

        // إصابة
        if(checkAnswer(answers, 'trauma', "نعم حديثاً")) inj+=45;
        if(checkAnswer(answers, 'trauma', "نعم قديماً")) inj+=25;
        
        // تطبيق عوامل التعديل الموسعة
        coc *= severityFactor * injuryFactor * inflammatoryIndicators > 10 ? 1.2 : 1;
        pil *= bmiFactor * severityFactor * inflammatoryIndicators > 10 ? 1.2 : 1;
        inj *= severityFactor * injuryFactor * activityFactor;
        
        // إضافة نقاط تحليل النصوص للتشخيصات ذات الصلة بناءً على نمط الألم
        if (textAnalysisScore > 0) {
            if (painPattern === 'inflammatory') coc += textAnalysisScore * 0.5;
            if (painPattern === 'inflammatory') pil += textAnalysisScore * 0.4;
            if (painPattern === 'mechanical') inj += textAnalysisScore * 0.5;
            if (inflammatoryIndicators > 20) coc += inflammatoryIndicators * 0.3;
            if (inflammatoryIndicators > 20) pil += inflammatoryIndicators * 0.3;
            if (mechanicalIndicators > 20) inj += mechanicalIndicators * 0.3;
        }
        
        let total = coc+pil+inj;
        if(total===0) total=1;
        
        scores.push({ name:"ألم العصعص (Coccydynia)", prob:Math.round(coc/total*100) });
        scores.push({ name:"كيس العصعص", prob:Math.round(pil/total*100) });
        scores.push({ name:"إصابة العصعص", prob:Math.round(inj/total*100) });
        
    } else if (jointId.includes('neck-muscles')) {
        let myof=0, tens=0, post=0;

        // تشنج عضلي
        if(checkAnswer(answers, 'pain_trigger', "العمل الطويل")) myof+=35;
        if(checkAnswer(answers, 'stiffness', "تيبس شديد")) myof+=30;

        // توتر عضلي
        if(checkAnswer(answers, 'stress', "شديد")) tens+=40;
        if(checkAnswer(answers, 'headache', "نعم كثيراً")) tens+=35;

        // وضعية سيئة
        if(checkAnswer(answers, 'posture', "نعم بشكل مكثف")) post+=40;
        
        // تطبيق عوامل التعديل الموسعة
        myof *= chronicFactor * severityFactor * activityFactor * mechanicalIndicators > 10 ? 1.2 : 1;
        tens *= chronicFactor * severityFactor * activityFactor * mechanicalIndicators > 10 ? 1.2 : 1;
        post *= chronicFactor * severityFactor * activityFactor * mechanicalIndicators > 10 ? 1.2 : 1;
        
        // إضافة نقاط تحليل النصوص للتشخيصات ذات الصلة بناءً على نمط الألم
        if (textAnalysisScore > 0) {
            if (painPattern === 'mechanical') myof += textAnalysisScore * 0.4;
            if (painPattern === 'mechanical') tens += textAnalysisScore * 0.4;
            if (painPattern === 'mechanical') post += textAnalysisScore * 0.4;
            if (mechanicalIndicators > 20) myof += mechanicalIndicators * 0.3;
            if (mechanicalIndicators > 20) tens += mechanicalIndicators * 0.3;
            if (mechanicalIndicators > 20) post += mechanicalIndicators * 0.3;
        }
        
        let total = myof+tens+post;
        if(total===0) total=1;
        
        scores.push({ name:"تشنج عضلي في الرقبة", prob:Math.round(myof/total*100) });
        scores.push({ name:"متلازمة التوتر العضلي", prob:Math.round(tens/total*100) });
        scores.push({ name:"متلازمة الألم الوضعي", prob:Math.round(post/total*100) });
        
    } else if (jointId.includes('scapula')) {
        let myof=0, dys=0, sn=0;

        // تشنج عضلي
        if(checkAnswer(answers, 'pain_trigger', "العمل الطويل")) myof+=35;
        if(checkAnswer(answers, 'posture', "انحناء واضح")) myof+=30;

        // خلل وظيفي
        if(checkAnswer(answers, 'clicking', "نعم مع ألم")) dys+=35;
        if(checkAnswer(answers, 'weakness', "ضعف متوسط")) dys+=25;

        // متلازمة السناب
        if(checkAnswer(answers, 'clicking', "نعم بدون ألم")) sn+=30;
        if(checkAnswer(answers, 'pain_trigger', "رفع الذراع")) sn+=25;
        
        // تطبيق عوامل التعديل الموسعة
        myof *= chronicFactor * severityFactor * activityFactor * mechanicalIndicators > 10 ? 1.2 : 1;
        dys *= chronicFactor * severityFactor * activityFactor * injuryFactor;
        sn *= ageFactor * severityFactor * activityFactor * mechanicalIndicators > 10 ? 1.2 : 1;
        
        // إضافة نقاط تحليل النصوص للتشخيصات ذات الصلة بناءً على نمط الألم
        if (textAnalysisScore > 0) {
            if (painPattern === 'mechanical') myof += textAnalysisScore * 0.4;
            if (painPattern === 'mechanical') dys += textAnalysisScore * 0.5;
            if (painPattern === 'mechanical') sn += textAnalysisScore * 0.4;
            if (mechanicalIndicators > 20) myof += mechanicalIndicators * 0.3;
            if (mechanicalIndicators > 20) dys += mechanicalIndicators * 0.3;
            if (mechanicalIndicators > 20) sn += mechanicalIndicators * 0.3;
        }
        
        let total = myof+dys+sn;
        if(total===0) total=1;
        
        scores.push({ name:"تشنج عضلي حول لوح الكتف", prob:Math.round(myof/total*100) });
        scores.push({ name:"خلل وظيفي في الكتف", prob:Math.round(dys/total*100) });
        scores.push({ name:"متلازمة السناب (Snapping Scapula)", prob:Math.round(sn/total*100) });
        
    } else if (jointId.includes('gluteus')) {
        let pir=0, burs=0, myof=0;

        // متلازمة الكمثري
        if(checkAnswer(answers, 'piriformis', "نعم بشدة")) pir+=45;
        if(checkAnswer(answers, 'pain_location', "جانب واحد")) pir+=35;
        if(checkAnswer(answers, 'radiation', "ينتشر للساق")) pir+=30;

        // التهاب الجراب
        if(checkAnswer(answers, 'sitting_pain', "نعم بشدة")) burs+=35;
        if(checkAnswer(answers, 'pain_location', "وسط الأرداف")) burs+=30;

        // تشنج عضلي
        if(checkAnswer(answers, 'walking_pain', "بشدة")) myof+=30;
        
        // تطبيق عوامل التعديل الموسعة
        pir *= chronicFactor * severityFactor * activityFactor * neuropathicIndicators > 15 ? 1.3 : 1;
        burs *= bmiFactor * severityFactor * inflammatoryIndicators > 10 ? 1.2 : 1;
        myof *= chronicFactor * severityFactor * activityFactor * mechanicalIndicators > 10 ? 1.2 : 1;
        
        // إضافة نقاط تحليل النصوص للتشخيصات ذات الصلة بناءً على نمط الألم
        if (textAnalysisScore > 0) {
            if (painPattern === 'neuropathic') pir += textAnalysisScore * 0.6;
            if (painPattern === 'inflammatory') burs += textAnalysisScore * 0.4;
            if (painPattern === 'mechanical') myof += textAnalysisScore * 0.4;
            if (neuropathicIndicators > 20) pir += neuropathicIndicators * 0.4;
            if (inflammatoryIndicators > 20) burs += inflammatoryIndicators * 0.3;
            if (mechanicalIndicators > 20) myof += mechanicalIndicators * 0.3;
        }
        
        let total = pir+burs+myof;
        if(total===0) total=1;
        
        scores.push({ name:"متلازمة الكمثري (Piriformis Syndrome)", prob:Math.round(pir/total*100) });
        scores.push({ name:"التهاب الجراب الأردافي", prob:Math.round(burs/total*100) });
        scores.push({ name:"تشنج عضلي في الأرداف", prob:Math.round(myof/total*100) });
        
    } else if (jointId.includes('fingers')) {
        let trigger=0, arthritis=0, carpal=0, ganglion=0;

        // إصبع الزناد
        if(checkAnswer(answers, 'clicking', "نعم مع ألم")) trigger+=45;
        if(checkAnswer(answers, 'stiffness', "تيبس شديد")) trigger+=35;
        if(checkAnswer(answers, 'pain_trigger', "القبض")) trigger+=30;

        // التهاب المفاصل
        if(checkAnswer(answers, 'morning_stiffness', "أكثر من ساعة")) arthritis+=40;
        if(checkAnswer(answers, 'swelling', "تورم واضح")) arthritis+=35;
        if(checkAnswer(answers, 'pain_location', "جميع الأصابع")) arthritis+=30;

        // متلازمة النفق الرسغي
        if(checkAnswer(answers, 'numbness', "تنميل شديد")) carpal+=40;
        if(checkAnswer(answers, 'pain_location', "الإبهام") || checkAnswer(answers, 'pain_location', "السبابة والوسطى")) carpal+=35;
        if(checkAnswer(answers, 'pain_trigger', "الكتابة")) carpal+=30;

        // كيس زليلي
        if(checkAnswer(answers, 'swelling', "تورم واضح") && checkAnswer(answers, 'clicking', "لا")) ganglion+=35;
        
        // تطبيق عوامل التعديل الموسعة
        trigger *= chronicFactor * severityFactor * activityFactor * injuryFactor;
        arthritis *= ageFactor * bmiFactor * durationFactor * inflammatoryIndicators > 10 ? 1.2 : 1;
        carpal *= ageFactor * chronicFactor * severityFactor * neuropathicIndicators > 15 ? 1.3 : 1;
        ganglion *= bmiFactor * severityFactor * inflammatoryIndicators > 10 ? 1.2 : 1;
        
        // إضافة نقاط تحليل النصوص للتشخيصات ذات الصلة بناءً على نمط الألم
        if (textAnalysisScore > 0) {
            if (painPattern === 'inflammatory') arthritis += textAnalysisScore * 0.5;
            if (painPattern === 'mechanical') trigger += textAnalysisScore * 0.4;
            if (painPattern === 'neuropathic') carpal += textAnalysisScore * 0.5;
            if (inflammatoryIndicators > 20) arthritis += inflammatoryIndicators * 0.3;
            if (mechanicalIndicators > 20) trigger += mechanicalIndicators * 0.3;
            if (neuropathicIndicators > 20) carpal += neuropathicIndicators * 0.3;
        }
        
        let total = trigger+arthritis+carpal+ganglion;
        if(total===0) total=1;
        
        scores.push({ name:"إصبع الزناد (Trigger Finger)", prob:Math.round(trigger/total*100) });
        scores.push({ name:"التهاب المفاصل (Arthritis)", prob:Math.round(arthritis/total*100) });
        scores.push({ name:"متلازمة النفق الرسغي", prob:Math.round(carpal/total*100) });
        scores.push({ name:"كيس زليلي (Ganglion Cyst)", prob:Math.round(ganglion/total*100) });
        
    } else if (jointId.includes('foot')) {
        let plantar=0, fasciitis=0, stress=0, bunion=0;

        // التهاب اللفافة الأخمصية
        if(checkAnswer(answers, 'morning_pain', "نعم بشدة")) fasciitis+=45;
        if(checkAnswer(answers, 'pain_location', "الكعب")) fasciitis+=40;
        if(checkAnswer(answers, 'barefoot', "نعم بشدة")) fasciitis+=30;

        // التهاب اللفافة الأخمصية المزمن
        if(checkAnswer(answers, 'stiffness', "تيبس شديد")) plantar+=35;
        if(checkAnswer(answers, 'walking_pain', "بشدة")) plantar+=30;

        // كسر الإجهاد
        if(checkAnswer(answers, 'pain_trigger', "الجري")) stress+=40;
        if(checkAnswer(answers, 'swelling', "تورم واضح")) stress+=35;
        
        // تطبيق عوامل التعديل الموسعة
        plantar *= bmiFactor * severityFactor * activityFactor * inflammatoryIndicators > 10 ? 1.2 : 1;
        fasciitis *= bmiFactor * severityFactor * activityFactor * inflammatoryIndicators > 10 ? 1.2 : 1;
        stress *= ageFactor * severityFactor * activityFactor * injuryFactor;
        bunion *= bmiFactor * severityFactor * inflammatoryIndicators > 10 ? 1.2 : 1;
        
        // إضافة نقاط تحليل النصوص للتشخيصات ذات الصلة بناءً على نمط الألم
        if (textAnalysisScore > 0) {
            if (painPattern === 'inflammatory') fasciitis += textAnalysisScore * 0.5;
            if (painPattern === 'inflammatory') plantar += textAnalysisScore * 0.4;
            if (painPattern === 'mechanical') stress += textAnalysisScore * 0.4;
            if (inflammatoryIndicators > 20) fasciitis += inflammatoryIndicators * 0.3;
            if (inflammatoryIndicators > 20) plantar += inflammatoryIndicators * 0.3;
            if (mechanicalIndicators > 20) stress += mechanicalIndicators * 0.3;
        }
        
        // مسمار القدم
        if(checkAnswer(answers, 'pain_location', "مقدمة القدم")) bunion+=35;
        if(checkAnswer(answers, 'deformity', "نعم واضح")) bunion+=30;
        
        let total = plantar+fasciitis+stress+bunion;
        if(total===0) total=1;
        
        scores.push({ name:"التهاب اللفافة الأخمصية (Plantar Fasciitis)", prob:Math.round(fasciitis/total*100) });
        scores.push({ name:"التهاب اللفافة الأخمصية المزمن", prob:Math.round(plantar/total*100) });
        scores.push({ name:"كسر الإجهاد (Stress Fracture)", prob:Math.round(stress/total*100) });
        scores.push({ name:"مسمار القدم (Bunion)", prob:Math.round(bunion/total*100) });
        
    } else if (jointId.includes('toes')) {
        let gout=0, hammer=0, corn=0, ingrown=0;

        // النقرس
        if(checkAnswer(answers, 'redness', "نعم بشدة")) gout+=45;
        if(checkAnswer(answers, 'swelling', "تورم واضح")) gout+=40;
        if(checkAnswer(answers, 'pain_location', "إصبع القدم الكبير")) gout+=35;

        // إصبع المطرقة
        if(checkAnswer(answers, 'deformity', "نعم واضح")) hammer+=40;
        if(checkAnswer(answers, 'shoe_pressure', "نعم بشدة")) hammer+=35;

        // مسامير الجلد
        if(checkAnswer(answers, 'shoe_pressure', "نعم بشدة")) corn+=30;

        // ظفر القدم النامي
        if(checkAnswer(answers, 'pain_location', "إصبع القدم الكبير")) ingrown+=35;
        if(checkAnswer(answers, 'redness', "نعم بشدة")) ingrown+=30;
        
        // تطبيق عوامل التعديل الموسعة
        gout *= bmiFactor * chronicFactor * severityFactor * inflammatoryIndicators > 10 ? 1.2 : 1;
        hammer *= bmiFactor * severityFactor * mechanicalIndicators > 10 ? 1.2 : 1;
        corn *= bmiFactor * severityFactor * mechanicalIndicators > 10 ? 1.2 : 1;
        ingrown *= severityFactor * inflammatoryIndicators > 10 ? 1.2 : 1;
        
        // إضافة نقاط تحليل النصوص للتشخيصات ذات الصلة بناءً على نمط الألم
        if (textAnalysisScore > 0) {
            if (painPattern === 'inflammatory') gout += textAnalysisScore * 0.6;
            if (painPattern === 'mechanical') hammer += textAnalysisScore * 0.4;
            if (painPattern === 'inflammatory') ingrown += textAnalysisScore * 0.4;
            if (inflammatoryIndicators > 20) gout += inflammatoryIndicators * 0.4;
            if (mechanicalIndicators > 20) hammer += mechanicalIndicators * 0.3;
            if (inflammatoryIndicators > 20) ingrown += inflammatoryIndicators * 0.3;
        }
        
        let total = gout+hammer+corn+ingrown;
        if(total===0) total=1;
        
        scores.push({ name:"النقرس (Gout)", prob:Math.round(gout/total*100) });
        scores.push({ name:"إصبع المطرقة (Hammer Toe)", prob:Math.round(hammer/total*100) });
        scores.push({ name:"مسامير الجلد (Corns)", prob:Math.round(corn/total*100) });
        scores.push({ name:"ظفر القدم النامي (Ingrown Toenail)", prob:Math.round(ingrown/total*100) });
        
    } else if (jointId.includes('cervical')) {
        let disc=0, sten=0, myof=0, rad=0;
        
        // مشاكل الغضروف
        if(checkAnswer(answers, 'pain_worse_with', 'الحركة')) disc+=40;
        if(checkAnswer(answers, 'numbness', 'نعم')) disc+=35;
        if(checkAnswer(answers, 'weakness', 'نعم')) disc+=30;
        
        // تضيق القناة
        if(checkAnswer(answers, 'numbness', 'نعم بشدة')) sten+=45;
        if(checkAnswer(answers, 'walking_difficulty', 'نعم')) sten+=40;
        if(checkAnswer(answers, 'relief_with', 'الانحناء للأمام')) sten+=35;
        
        // تشنج عضلي
        if(checkAnswer(answers, 'pain_worse_with', 'الإجهاد')) myof+=35;
        if(checkAnswer(answers, 'stiffness', 'نعم')) myof+=30;
        
        // ألم عصبي
        if(checkAnswer(answers, 'radiating', 'نعم')) rad+=40;
        if(checkAnswer(answers, 'tingling', 'نعم')) rad+=35;
        
        disc *= ageFactor * chronicFactor * severityFactor * mechanicalIndicators > 10 ? 1.3 : 1;
        sten *= ageFactor * chronicFactor * severityFactor * neuropathicIndicators > 15 ? 1.4 : 1;
        myof *= chronicFactor * severityFactor * mechanicalIndicators > 10 ? 1.2 : 1;
        rad *= severityFactor * neuropathicIndicators > 15 ? 1.3 : 1;
        
        let total = disc+sten+myof+rad;
        if(total===0) total=1;
        
        scores.push({ name:"مشاكل غضروف الرقبة", prob:Math.round(disc/total*100) });
        scores.push({ name:"تضيق قناة الرقبة", prob:Math.round(sten/total*100) });
        scores.push({ name:"تشنج عضلي في الرقبة", prob:Math.round(myof/total*100) });
        scores.push({ name:"ألم عصبي في الرقبة", prob:Math.round(rad/total*100) });
        
    } else if (jointId.includes('thoracic')) {
        let disc=0, post=0, myof=0;
        
        // مشاكل الغضروف
        if(checkAnswer(answers, 'pain_worse_with', 'الحركة')) disc+=35;
        if(checkAnswer(answers, 'breathing_pain', 'نعم')) disc+=30;
        
        // مشاكل وضعية
        if(checkAnswer(answers, 'pain_worse_with', 'الجلوس الطويل')) post+=40;
        if(checkAnswer(answers, 'work_posture', 'منحني')) post+=35;
        
        // تشنج عضلي
        if(checkAnswer(answers, 'stiffness', 'نعم')) myof+=30;
        if(checkAnswer(answers, 'pain_worse_with', 'الإجهاد')) myof+=25;
        
        disc *= ageFactor * chronicFactor * severityFactor * mechanicalIndicators > 10 ? 1.2 : 1;
        post *= chronicFactor * severityFactor * mechanicalIndicators > 10 ? 1.3 : 1;
        myof *= chronicFactor * severityFactor * mechanicalIndicators > 10 ? 1.2 : 1;
        
        let total = disc+post+myof;
        if(total===0) total=1;
        
        scores.push({ name:"مشاكل غضروف منتصف الظهر", prob:Math.round(disc/total*100) });
        scores.push({ name:"مشاكل وضعية الظهر", prob:Math.round(post/total*100) });
        scores.push({ name:"تشنج عضلي في منتصف الظهر", prob:Math.round(myof/total*100) });
        
    } else if (jointId.includes('lumbar')) {
        let disc=0, sten=0, spond=0, myof=0;
        
        // مشاكل الغضروف
        if(checkAnswer(answers, 'radiating', 'نعم')) disc+=45;
        if(checkAnswer(answers, 'numbness', 'نعم')) disc+=40;
        if(checkAnswer(answers, 'pain_worse_with', 'الجلوس')) disc+=35;
        
        // تضيق القناة
        if(checkAnswer(answers, 'walking_difficulty', 'نعم')) sten+=45;
        if(checkAnswer(answers, 'relief_with', 'الانحناء للأمام')) sten+=40;
        if(checkAnswer(answers, 'numbness', 'نعم بشدة')) sten+=35;
        
        // انزلاق فقاري
        if(checkAnswer(answers, 'pain_worse_with', 'الوقوف')) spond+=40;
        if(checkAnswer(answers, 'relief_with', 'الجلوس')) spond+=35;
        
        // تشنج عضلي
        if(checkAnswer(answers, 'stiffness', 'نعم')) myof+=30;
        if(checkAnswer(answers, 'pain_worse_with', 'الإجهاد')) myof+=25;
        
        disc *= ageFactor * chronicFactor * severityFactor * neuropathicIndicators > 15 ? 1.4 : 1;
        sten *= ageFactor * chronicFactor * severityFactor * neuropathicIndicators > 15 ? 1.4 : 1;
        spond *= ageFactor * chronicFactor * severityFactor * mechanicalIndicators > 10 ? 1.3 : 1;
        myof *= chronicFactor * severityFactor * mechanicalIndicators > 10 ? 1.2 : 1;
        
        let total = disc+sten+spond+myof;
        if(total===0) total=1;
        
        scores.push({ name:"مشاكل غضروف أسفل الظهر", prob:Math.round(disc/total*100) });
        scores.push({ name:"تضيق قناة أسفل الظهر", prob:Math.round(sten/total*100) });
        scores.push({ name:"انزلاق فقاري", prob:Math.round(spond/total*100) });
        scores.push({ name:"تشنج عضلي في أسفل الظهر", prob:Math.round(myof/total*100) });
        
    } else if (jointId.includes('chest')) {
        let cardiac=0, muscular=0, costochondritis=0, gerd=0;

        // مشاكل قلبية
        if(checkAnswer(answers, 'chest_pressure', "نعم بشدة")) cardiac+=50;
        if(checkAnswer(answers, 'radiation', "للكتف الأيسر") || checkAnswer(answers, 'radiation', "للذراع")) cardiac+=45;
        if(checkAnswer(answers, 'exertion', "نعم بشدة")) cardiac+=40;

        // مشاكل عضلية
        if(checkAnswer(answers, 'pain_trigger', "الحركة")) muscular+=35;
        if(checkAnswer(answers, 'breathing_pain', "نعم بشدة")) muscular+=30;

        // التهاب الغضاريف الضلعية
        if(checkAnswer(answers, 'cough_pain', "نعم بشدة")) costochondritis+=40;
        if(checkAnswer(answers, 'pain_location', "جانب الصدر")) costochondritis+=35;

        // ارتجاع المريء
        if(checkAnswer(answers, 'pain_location', "وسط الصدر")) gerd+=30;
        if(checkAnswer(answers, 'pain_trigger', "الراحة")) gerd+=25;
        
        // تطبيق عوامل التعديل الموسعة
        cardiac *= ageFactor * chronicFactor * severityFactor * patternFactor * neuropathicIndicators > 15 ? 1.3 : 1;
        muscular *= chronicFactor * severityFactor * activityFactor * mechanicalIndicators > 10 ? 1.2 : 1;
        costochondritis *= ageFactor * severityFactor * inflammatoryIndicators > 10 ? 1.2 : 1;
        gerd *= bmiFactor * severityFactor * inflammatoryIndicators > 10 ? 1.2 : 1;
        
        // إضافة نقاط تحليل النصوص للتشخيصات ذات الصلة بناءً على نمط الألم
        if (textAnalysisScore > 0) {
            if (painPattern === 'neuropathic') cardiac += textAnalysisScore * 0.6;
            if (painPattern === 'mechanical') muscular += textAnalysisScore * 0.4;
            if (painPattern === 'inflammatory') costochondritis += textAnalysisScore * 0.4;
            if (neuropathicIndicators > 20) cardiac += neuropathicIndicators * 0.4;
            if (mechanicalIndicators > 20) muscular += mechanicalIndicators * 0.3;
            if (inflammatoryIndicators > 20) costochondritis += inflammatoryIndicators * 0.3;
        }
        
        let total = cardiac+muscular+costochondritis+gerd;
        if(total===0) total=1;
        
        scores.push({ name:"مشاكل قلبية محتملة", prob:Math.round(cardiac/total*100) });
        scores.push({ name:"ألم عضلي في الصدر", prob:Math.round(muscular/total*100) });
        scores.push({ name:"التهاب الغضاريف الضلعية", prob:Math.round(costochondritis/total*100) });
        scores.push({ name:"ارتجاع المريء (GERD)", prob:Math.round(gerd/total*100) });
        
    } else if (jointId.includes('abdomen')) {
        let gastritis=0, appendicitis=0, ibs=0, kidney=0;

        // التهاب المعدة
        if(checkAnswer(answers, 'pain_location', "أعلى البطن")) gastritis+=40;
        if(checkAnswer(answers, 'eating_trigger', "نعم بعد الأكل")) gastritis+=35;
        if(checkAnswer(answers, 'nausea', "نعم بشدة")) gastritis+=30;

        // التهاب الزائدة الدودية
        if(checkAnswer(answers, 'pain_location', "الجانب الأيمن")) appendicitis+=45;
        if(checkAnswer(answers, 'pain_type', "حاد")) appendicitis+=40;
        if(checkAnswer(answers, 'nausea', "نعم بشدة")) appendicitis+=35;

        // متلازمة القولون المتهيج
        if(checkAnswer(answers, 'bowel_changes', "لا") === false) ibs+=40;
        if(checkAnswer(answers, 'bloating', "نعم بشدة")) ibs+=35;
        if(checkAnswer(answers, 'pain_type', "مغص")) ibs+=30;

        // حصى الكلى
        if(checkAnswer(answers, 'urination_pain', "نعم بشدة")) kidney+=45;
        if(checkAnswer(answers, 'pain_location', "الجانب الأيمن") || checkAnswer(answers, 'pain_location', "الجانب الأيسر")) kidney+=40;
        if(checkAnswer(answers, 'pain_type', "حاد")) kidney+=35;
        
        // تطبيق عوامل التعديل الموسعة
        gastritis *= bmiFactor * chronicFactor * severityFactor * inflammatoryIndicators > 10 ? 1.2 : 1;
        appendicitis *= ageFactor * severityFactor * inflammatoryIndicators > 10 ? 1.2 : 1;
        ibs *= chronicFactor * severityFactor * inflammatoryIndicators > 10 ? 1.2 : 1;
        kidney *= bmiFactor * severityFactor * inflammatoryIndicators > 10 ? 1.2 : 1;
        
        // إضافة نقاط تحليل النصوص للتشخيصات ذات الصلة بناءً على نمط الألم
        if (textAnalysisScore > 0) {
            if (painPattern === 'inflammatory') appendicitis += textAnalysisScore * 0.6;
            if (painPattern === 'inflammatory') kidney += textAnalysisScore * 0.5;
            if (painPattern === 'inflammatory') gastritis += textAnalysisScore * 0.4;
            if (inflammatoryIndicators > 20) appendicitis += inflammatoryIndicators * 0.4;
            if (inflammatoryIndicators > 20) kidney += inflammatoryIndicators * 0.3;
            if (inflammatoryIndicators > 20) gastritis += inflammatoryIndicators * 0.3;
        }
        
        let total = gastritis+appendicitis+ibs+kidney;
        if(total===0) total=1;
        
        scores.push({ name:"التهاب المعدة (Gastritis)", prob:Math.round(gastritis/total*100) });
        scores.push({ name:"التهاب الزائدة الدودية", prob:Math.round(appendicitis/total*100) });
        scores.push({ name:"متلازمة القولون المتهيج (IBS)", prob:Math.round(ibs/total*100) });
        scores.push({ name:"حصى الكلى", prob:Math.round(kidney/total*100) });
        
    } else if (jointId.includes('jaw')) {
        let tmj=0, bruxism=0, dental=0, sinus=0;

        // اضطراب مفصل الفك الفكي الصدغي
        if(checkAnswer(answers, 'clicking', "نعم مع ألم")) tmj+=45;
        if(checkAnswer(answers, 'jaw_locking', "نعم كثيراً")) tmj+=40;
        if(checkAnswer(answers, 'mouth_opening', "قيود شديدة")) tmj+=35;

        // صرير الأسنان
        if(checkAnswer(answers, 'teeth_grinding', "نعم بشدة")) bruxism+=45;
        if(checkAnswer(answers, 'headache', "نعم كثيراً")) bruxism+=35;

        // مشاكل الأسنان
        if(checkAnswer(answers, 'pain_location', "الأسنان")) dental+=40;
        if(checkAnswer(answers, 'pain_trigger', "المضغ")) dental+=35;

        // التهاب الجيوب الأنفية
        if(checkAnswer(answers, 'ear_pain', "نعم بشدة")) sinus+=30;
        if(checkAnswer(answers, 'pain_location', "ينتشر للأذن")) sinus+=25;
        
        // تطبيق عوامل التعديل الموسعة
        tmj *= chronicFactor * severityFactor * activityFactor * mechanicalIndicators > 10 ? 1.2 : 1;
        bruxism *= chronicFactor * severityFactor * activityFactor * mechanicalIndicators > 10 ? 1.2 : 1;
        dental *= severityFactor * inflammatoryIndicators > 10 ? 1.2 : 1;
        sinus *= ageFactor * severityFactor * inflammatoryIndicators > 10 ? 1.2 : 1;
        
        // إضافة نقاط تحليل النصوص للتشخيصات ذات الصلة بناءً على نمط الألم
        if (textAnalysisScore > 0) {
            if (painPattern === 'mechanical') tmj += textAnalysisScore * 0.5;
            if (painPattern === 'mechanical') bruxism += textAnalysisScore * 0.4;
            if (painPattern === 'inflammatory') dental += textAnalysisScore * 0.4;
            if (mechanicalIndicators > 20) tmj += mechanicalIndicators * 0.3;
            if (mechanicalIndicators > 20) bruxism += mechanicalIndicators * 0.3;
            if (inflammatoryIndicators > 20) dental += inflammatoryIndicators * 0.3;
        }
        
        let total = tmj+bruxism+dental+sinus;
        if(total===0) total=1;
        
        scores.push({ name:"اضطراب مفصل الفك الفكي الصدغي (TMJ)", prob:Math.round(tmj/total*100) });
        scores.push({ name:"صرير الأسنان (Bruxism)", prob:Math.round(bruxism/total*100) });
        scores.push({ name:"مشاكل الأسنان", prob:Math.round(dental/total*100) });
        scores.push({ name:"التهاب الجيوب الأنفية", prob:Math.round(sinus/total*100) });
        
    } else {
        scores.push({ name:"اضطراب عضلي هيكلي وظيفي", prob:70 });
        scores.push({ name:"ينصح بفحص سريري متخصص", prob:30 });
    }
    
    scores.sort((a,b)=>b.prob - a.prob);
    
    // تطبيق نظام Bayesian لتحسين الدقة
    scores = calculateBayesianProbabilities(jointId, answers, scores);
    scores.sort((a,b)=>b.prob - a.prob);
    
    // حفظ البيانات المجهولة للتحليل (إذا وافق المستخدم)
    if (anonymousDataCollection.hasConsent()) {
        const primaryDiagnosis = scores.length > 0 ? scores[0].name : 'غير محدد';
        const severity = answers.severity || 'غير محدد';
        const duration = answers.duration || 'غير محدد';
        anonymousDataCollection.saveData(jointId, answers, primaryDiagnosis, severity, duration);
    }
    
    // التعامل مع الحالة التي يكون فيها جميع التشخيصات بنسبة 0% أو منخفضة جداً
    if(scores.length > 0 && scores[0].prob === 0) {
        // إضافة تشخيص افتراضي منطقي
        scores = [
            { name:"اضطراب عضلي هيكلي وظيفي", prob:40 },
            { name:"ينصح بفحص سريري متخصص لتأكيد التشخيص", prob:30 },
            { name:"تشنج عضلي أو إجهاد", prob:20 },
            { name:"مشاكل وضعية أو ميكانيكية", prob:10 }
        ];
    }
    
    // حساب مستوى الثقة بناءً على عدد الإجابات ودقة الأنماط
    let answeredCount = Object.values(answers).filter(v=>v && v!=="").length;
    let patternCount = Object.values(pattern).filter(v=>v===true).length;
    let confidence = 45 + (answeredCount * 4) + (patternCount * 3);
    if(confidence > 95) confidence = 95;
    
    // تحديد التحويلات الطبية
    let referral = null;
    let urgentReferral = false;
    
    if(pattern.weakness && pattern.neuropathic) {
        referral = "يوصى باستشارتنا لتأكيد التشخيص فوراً";
        urgentReferral = true;
    } else if(pattern.radiating && (jointId==='back-lumbar'||jointId==='back-cervical')) {
        referral = "يوصى باستشارتنا لتأكيد التشخيص";
    } else if(scores[0] && scores[0].prob < 60) {
        referral = "يوصى باستشارتنا لتأكيد التشخيص";
    }
    
    return { scores, confidence, referral, urgentReferral, pattern };
}

// قاعدة بيانات التمارين لكل حالة
const exercisesDB = {
    'shoulder': {
        'متلازمة انحشار الكتف': [
            'تمرين الدوران الداخلي (Internal Rotation): استخدم حزام مقاومة مثبت على باب عند مستوى الخصر، أمسك الحزام بيدك اليمنى مع إبهام للأعلى، اثنِ كوعك 90 درجة وضعه بجانب جسمك، اسحب الحزام نحو بطنك ببطء، عد حتى 3، ارجع ببطء للوضعية الأولية، كرر 10 مرات، افعل 3 مجموعات',
            'تمرين الدوران الخارجي (External Rotation): استخدم حزام مقاومة مثبت على باب عند مستوى الخصر، أمسك الحزام بيدك اليسرى عبر جسمك، اثنِ كوعك 90 درجة وضعه بجانب جسمك، اسحب الحزام للخارج ببطء كما لو تفتح باب، عد حتى 3، ارجع ببطء للوضعية الأولية، كرر 10 مرات، افعل 3 مجموعات',
            'تمرين إطالة الصدر عند الباب (Doorframe Stretch): قف بجانب باب، مد ذراعك اليمنى وضعه على حافة الباب أسفل مستوى الكتف قليلاً، راحة يدك للأمام ملامسة الباب، حافظ على كتفيك للأسفل والخلف، استدر جسمك ببطء لليسار بعيداً عن الباب، اشعر بتمدد في صدرك وكتفك، احتفظ بالوضعية 30 ثانية، كرر 3 مرات',
            'تمرين الصف الوقوف (Standing Row): استخدم حزام مقاومة مثبت على باب عند مستوى الصدر، أمسك الحزام بكلتا اليدين، قف بظهر مستقيم وكتفيك للأسفل والخلف، اسحب الحزام نحو صدرك، اضغط لوحي الكتف للخلف، عد حتى 3، ارجع ببطء للوضعية الأولية، كرر 10 مرات، افعل 3 مجموعات',
            'تمرين البندول (Pendulum Exercise): قف بجانب طاولة واتكأ عليها بذراعك السليم، دع ذراعك المصابة تتدلى بحرية، استخدم وزن جسمك فقط لا عضلاتك، حرك الذراع في دوائر صغيرة 10 مرات في كل اتجاه، حرك الذراع للأمام والخلف 10 مرات، حرك الذراع للجانبين 10 مرات، كرر 3 مرات يومياً',
            'وضعية النوم الصحيحة: نم على الجانب opposite للكتف المصاب، ضع وسادة تحت ذراعك لمنعها من السقوط عبر جسمك، أو نم على ظهرك مع وسادة تحت كوعك، هذا يحافظ على ذراعك في محاذاة طبيعية'
        ],
        'التهاب وتر فوق الشوكة': [
            'تمرين إطالة المنشفة (Towel Stretch): أمسك منشفة خلف ظهرك بيدك السليمة، أمسك الطرف الآخر بيدك المصابة، اسحب المنشفة برفق بيدك السليمة لرفع ذراعك المصابة، اشعر بتمدد في كتفك المصاب، احتفظ بالوضعية 15-20 ثانية، كرر 10-20 مرة يومياً',
            'تمرين إطالة الجسم (Cross-body Stretch): اجلس أو قف، استخدم يدك السليمة لرفع ذراعك المصابة عند الكوع، اسحب الذراع برفق نحو جسمك، اضغط برفق فوق الكوع، اشعر بتمدد في كتفك، احتفظ بالوضعية 15-20 ثانية، كرر 10-20 مرة يومياً',
            'تمرين المشي على الحائط (Finger Walk): قف أمام حائط على مسافة ثلاثة أرباع طول الذراع، استخدم ذراعك المصابة للمس الحائط عند مستوى الخصر، امشِ بأصابعك ببطء على الحائط للأعلى، استمر حتى مستوى الكتف أو حتى تشعر بألم، أنزل الذراع ببطء، كرر 10-20 مرة يومياً',
            'تمارين تقوية متساوية القياس (Isometric Exercises): الدوران الداخلي: استخدم حزام مقاومة، اسحب نحو بطنك، احتفظ 5 ثواني، الدوران الخارجي: استخدم حزام مقاومة، اسحب للخارج، احتفظ 5 ثواني، كرر 15-20 مجموعة يومياً',
            'كمادات باردة بعد التمارين: استخدم كيس ثلج لمدة 15 دقيقة بعد التمارين، إذا شعرت بألم حاد، توقف عن التمارين لبضعة أيام',
            'الحرارة قبل التمارين: استخدم دش دافئ أو وسادة حرارية قبل التمارين، يساعد على إرخاء العضلات'
        ],
        'تمزق الكفة المدورة': [
            'الراحة النسبية مع تجنب الألم: تجنب الحركات المؤلمة تماماً، استمر في الحركات اليومية الخفيفة التي لا تسبب ألماً',
            'تمارين مدى حركة خفيفة (Pendulum): تمرين البندول فقط في المرحلة الحادة، قف بجانب طاولة واتكأ عليها بذراعك السليم، دع ذراعك المصابة تتدلى بحرية، حرك الذراع في دوائر صغيرة 10 مرات، كرر 3 مرات يومياً',
            'تمارين تقوية تحت إشراف متخصص: يجب البدء تحت إشراف أخصائي علاج طبيعي، تجنب التمارين الثقيلة في البداية، تمارين تقوية الكفة المدورة فقط بعد شفاء الألم',
            'تجنب الحركات المؤلمة: لا تضغط على الكتف المصاب، لا ترفع الذراع فوق الرأس، لا تحمل أوزاناً ثقيلة',
            'تقييم طبي ضروري: قد يتطلب تقييماً بالرنين المغناطيسي، استشرنا قبل البدء بأي تمارين تقوية'
        ],
        'التهاب كبسولة الكتف': [
            'الحرارة الرطبة قبل التمارين: استخدم دش دافئ أو وسادة حرارية قبل التمارين، مدة 10-15 دقيقة، يساعد على إرخاء الكتف وتقليل الألم',
            'تمارين مدى حركة مكثفة (تحت إشراف): يجب البدء تحت إشراف أخصائي علاج طبيعي، تمارين مدى حركة مكثفة ومتكررة، تكرار التمارين عدة مرات يومياً',
            'تمارين إطالة الكتف: إطالة للكتف الأمامي (Anterior Stretch)، إطالة للكتف الخلفي (Posterior Stretch)، إطالة للعضلات المحيطة بالكتف، احتفظ بكل إطالة 30 ثانية، كرر 3 مرات لكل إطالة',
            'تمارين تقوية تدريجية: تقوية العضلات المحيطة بالكتف، تقوية لوحي الكتف (Scapular Stabilizers)، زيادة الشدة تدريجياً على مدى أسابيع',
            'تمارين المشي على الحائط: استخدم أصابعك للمشي على الحائط للأعلى، كرر عدة مرات يومياً، يساعد على استعادة مدى الحركة'
        ],
        'التهاب الجراب تحت الأخرم': [
            'تمارين إطالة عضلات الورك الجانبية: قف بجانب الحائط للدعم، ضع يدك على الحائط، انحنى للجانب حتى تشعر بتمدد في جانب الورك، عد حتى 30 ببطء، يجب أن تشعر بتمدد خفيف في عضلات الورك الجانبية، لا تتجاوز الألم، كرر 3 مرات لكل جانب، افعل هذا التمرين 3 مرات يومياً',
            'كمادات باردة: استخدم كيس ثلج أو كمادة باردة، لف الكيس بمنشفة رقيقة، ضع الكمادة على جانب الورك لمدة 15 دقيقة، كرر 3-4 مرات يومياً',
            'تجنب النوم على الجانب المصاب: نم على الجانب السليم، استخدم وسادة بين الساقين لتقليل الضغط',
            'تمارين تقوية خفيفة: تقوية العضلات المحيطة بالكتف بعد تحسن الألم'
        ]
    },
    'elbow': {
        'التهاب اللقيمة الخارجية': [
            'تمرين إطالة مد الرسغ (Wrist Extension Stretch): مد ذراعك المصاب للأمام مع راحة اليد للأسفل، استخدم يدك السليمة لسحب أصابعك برفق نحو الأرض، اشعر بتمدد في أعلى الساعد والجانب الخارجي للكوع، احتفظ بالوضعية 15-30 ثانية، كرر 1-3 مرات يومياً',
            'تمرين إطالة ثني الرسغ (Wrist Flexion Stretch): مد ذراعك المصاب للأمام مع راحة اليد للأعلى، استخدم يدك السليمة لسحب أصابعك برفق نحو الأرض، اشعر بتمدد في أسفل الساعد والجانب الداخلي للكوع، احتفظ بالوضعية 15-30 ثانية، كرر 1-3 مرات يومياً',
            'تمرين تقوية مد الرسغ (Wrist Extension Strengthening): اجلس على طاولة مع وضع ساعدك المصاب على الطاولة وراحة يدك للأسفل معلقة، أمسك وزناً خفيفاً (0.5-1 كجم)، ارفع رسغك برفق للأعلى، ثم أنزله ببطء على مدى 3-5 ثواني، كرر 10-15 مرة، افعل مجموعتين، كرر مرتين أسبوعياً',
            'تمرين تقوية ثني الرسغ (Wrist Flexion Strengthening): اجلس على طاولة مع وضع ساعدك المصاب على الطاولة وراحة يدك للأعلى معلقة، أمسك وزناً خفيفاً (0.5-1 كجم)، ارفع رسغك برفق للأعلى، ثم أنزله ببطء على مدى 3-5 ثواني، كرر 10-15 مرة، افعل مجموعتين، كرر مرتين أسبوعياً',
            'تمرين تقوية القبض (Grip Strengthening): استخدم كرة مطاطية أو قبضة اليد، اضغط الكرة برفق لمدة 5 ثواني، استرخِ لمدة 5 ثواني، كرر 10-15 مرة، افعل مجموعتين، كرر مرتين أسبوعياً',
            'تمرين دوران الساعد (Forearm Rotation): اجلس على طاولة مع وضع ساعدك المصاب على الطاولة، أمسك وزناً خفيفاً (0.5-1 كجم)، درّب الساعد للخارج والداخل، كرر 10 مرات في كل اتجاه، افعل مجموعتين، كرر مرتين أسبوعياً',
            'استخدام دعامة الكوع: استخدم دعامة للكوع لتقليل الضغط على الوتر، ارتدِ الدعامة أثناء النشاط الذي يسبب الألم، لا ترتدِها طوال اليوم - أرحِ الكوع بين الحين والآخر'
        ],
        'التهاب اللقيمة الداخلية': [
            'تمرين إطالة ثني الرسغ (Wrist Flexion Stretch): مد ذراعك المصاب للأمام مع راحة اليد للأعلى، استخدم يدك السليمة لسحب أصابعك برفق نحو الأرض، اشعر بتمدد في أسفل الساعد والجانب الداخلي للكوع، احتفظ بالوضعية 15-30 ثانية، كرر 1-3 مرات يومياً',
            'تمرين إطالة العضلات المثنية: إطالة خفيفة للعضلات المثنية للكوع، احتفظ بالوضعية 30 ثانية، كرر 3 مرات',
            'تمرين تقوية ثني الرسغ (Wrist Flexion Strengthening): اجلس على طاولة مع وضع ساعدك المصاب على الطاولة وراحة يدك للأعلى معلقة، أمسك وزناً خفيفاً (0.5-1 كجم)، ارفع رسغك برفق للأعلى، ثم أنزله ببطء على مدى 3-5 ثواني، كرر 10-15 مرة، افعل مجموعتين، كرر مرتين أسبوعياً',
            'تمرين تقوية القبض (Grip Strengthening): استخدم كرة مطاطية أو قبضة اليد، اضغط الكرة برفق لمدة 5 ثواني، استرخِ لمدة 5 ثواني، كرر 10-15 مرة، افعل مجموعتين، كرر مرتين أسبوعياً',
            'تجنب القبض القوي: تجنب حمل الأشياء الثقيلة، تجنب الحركات المؤلمة',
            'الراحة النسبية: تجنب الحركات المؤلمة، استمر في الحركات اليومية الخفيفة التي لا تسبب ألماً'
        ],
        'متلازمة النفق الكعبي': [
            'تمرين إطالة الرسغ: إطالة معصم اليد برفق لمدة 30 ثانية، كرر 3 مرات',
            'تجنب الضغط على المعصم: تجنب النوم على المعصم، تجنب الانحناء المطول للكوع',
            'تمارين الحركة: حركات خفيفة للمعصم، حركات دائرية للمعصم',
            'استشارتنا إذا استمر التنميل: إذا استمر التنميل أو الخدر، استشرنا',
            'استخدام دعامة ليلية: استخدم دعامة ليلية لتقليل الضغط على العصب'
        ]
    },
    'wrist': {
        'متلازمة النفق الرسغي': [
            'تمرين إطالة الرسغ (Wrist Extension Stretch): مد ذراعك المصاب للأمام مع راحة اليد للأسفل، استخدم يدك السليمة لسحب أصابعك برفق نحو الأرض، اشعر بتمدد في أعلى الساعد والرسغ، احتفظ بالوضعية 15-30 ثانية، كرر 3 مرات، افعل هذا التمرين 3-4 مرات يومياً',
            'تمرين إطالة ثني الرسغ (Wrist Flexion Stretch): مد ذراعك المصاب للأمام مع راحة اليد للأعلى، استخدم يدك السليمة لسحب أصابعك برفق نحو الأرض، اشعر بتمدد في أسفل الساعد والرسغ، احتفظ بالوضعية 15-30 ثانية، كرر 3 مرات، افعل هذا التمرين 3-4 مرات يومياً',
            'تمرين انحراف الرسغ (Wrist Radial/Ulnar Deviation): اجلس على كرسي بظهر مستقيم، ضع ذراعك المصاب على طاولة، انحرف الرسغ لليمين باستخدام يدك الأخرى، عد حتى 10، انحرف الرسغ لليسار باستخدام يدك الأخرى، عد حتى 10، كرر 10 مرات في كل اتجاه، افعل هذا التمرين 3 مرات يومياً',
            'تمرين حركة الأصابع (Finger Exercises): افتح وأغلق يدك عدة مرات، اضغط على أصابعك لفتحها ثم أرخِها، كرر 10 مرات، افعل هذا التمرين عدة مرات يومياً',
            'تمرين إطالة الإبهام (Thumb Stretch): استخدم يدك السليمة لسحب الإبهام برفق للخلف، اشعر بتمدد في قاعدة الإبهام، احتفظ بالوضعية 15-30 ثانية، كرر 3 مرات، افعل هذا التمرين 3 مرات يومياً',
            'استخدام دعامة ليلية: استخدم دعامة ليلية للحفاظ على الرسغ في وضعية محايدة، ارتدِ الدعامة أثناء النوم، لا ترتدِها طوال اليوم - أرحِ الرسغ بين الحين والآخر',
            'أخذ فترات راحة: خذ استراحة كل 30 دقيقة من العمل على الكمبيوتر، قم بتمارين إطالة بسيطة لمدة 1-2 دقيقة، حرك الرسغ في جميع الاتجاهات، افتح وأغلق يدك عدة مرات'
        ],
        'التهاب دي كيرفان': [
            'تمرين إطالة الإبهام (Thumb Stretch): اجلس على كرسي بظهر مستقيم، ضع يدك المصابة على طاولة، استخدم يدك الأخرى لسحب الإبهام برفق للخلف، اشعر بتمدد في قاعدة الإبهام، احتفظ بالوضعية 30 ثانية، كرر 3 مرات، افعل هذا التمرين 3 مرات يومياً',
            'تمرين إطالة العضلات المثنية للإبهام: إطالة خفيفة للعضلات المثنية للإبهام، احتفظ بالوضعية 30 ثانية، كرر 3 مرات',
            'تجنب القبض القوي: تجنب القبض القوي بالإبهام، تجنب رفع الأشياء الثقيلة بالإبهام، استخدم كامل اليد بدلاً من الإبهام فقط',
            'كمادات باردة: استخدم كيس ثلج أو كمادة باردة، لف الكيس بمنشفة رقيقة، ضع الكمادة على قاعدة الإبهام لمدة 15 دقيقة، كرر 3-4 مرات يومياً',
            'استخدام دعامة: استخدم دعامة لتقليل الضغط على الوتر، ارتدِ الدعامة أثناء النشاط الذي يسبب الألم'
        ]
    },
    'knee': {
        'تمزق الغضروف الهلالي': [
            'تمرين رفع الساق المستقيم (Straight Leg Raise): استلقِ على ظهرك مع ثني الركبة السليمة، ارفع الساق المصابة ببطء حتى مستوى الركبة السليمة، احتفظ بالوضعية 3-5 ثواني، أنزل الساق ببطء، كرر 10-15 مرة، افعل 3 مجموعات',
            'تمرين ثني الركبة (Knee Flexion): استلقِ على بطنك، اثنِ ركبتك المصابة ببطء حتى تشعر بتمدد خفيف في الفخذ، احتفظ بالوضعية 5 ثواني، أنزل الرجل ببطء، كرر 10-15 مرة، افعل 3 مجموعات',
            'تمرين تقوية العضلات الرباعية (Quad Sets): استلقِ على ظهرك مع ثني الركبة المصابة، اضغط على الركبة لأسفل لتقوية العضلات الرباعية، احتفظ بالوضعية 5-10 ثواني، استرخِ، كرر 10-15 مرة، افعل 3 مجموعات',
            'تمرين رفع الكعب (Heel Raise): قف بجانب حائط للدعم، ارفع كعبك ببطء عن الأرض، احتفظ بالوضعية 2-3 ثواني، أنزل الكعب ببطء، كرر 10-15 مرة، افعل 3 مجموعات',
            'تجنب الحركات المؤلمة: تجنب الدوران القوي للركبة، تجنب القرفصاء العميق، تجنب القفز والجري على الأسطح الصلبة',
            'استشارة: قد يحتاج لتقييم بالرنين المغناطيسي، استشرنا قبل البدء بأي تمارين تقوية'
        ],
        'خشونة مفاصل الركبة': [
            'تمرين رفع الساق المستقيم (Straight Leg Raise): استلقِ على ظهرك مع ثني الركبة السليمة، ارفع الساق المصابة ببطء حتى مستوى الركبة السليمة، احتفظ بالوضعية 3-5 ثواني، أنزل الساق ببطء، كرر 10-15 مرة، افعل 3 مجموعات',
            'تمرين تقوية العضلات الرباعية (Quad Sets): استلقِ على ظهرك مع ثني الركبة المصابة، اضغط على الركبة لأسفل لتقوية العضلات الرباعية، احتفظ بالوضعية 5-10 ثواني، استرخِ، كرر 10-15 مرة، افعل 3 مجموعات',
            'تمرين رفع الكعب (Heel Raise): قف بجانب حائط للدعم، ارفع كعبك ببطء عن الأرض، احتفظ بالوضعية 2-3 ثواني، أنزل الكعب ببطء، كرر 10-15 مرة، افعل 3 مجموعات',
            'تمرين المدى الحركي (Range of Motion): ثني ومد الركبة برفق، حركات دائرية للركبة، كرر 10 مرات في كل اتجاه، افعل هذا التمرين 3 مرات يومياً',
            'تجنب الحركات العنيفة: تجنب صعود ونزول الدرج، تجنب القرفصاء العميق، تجنب الجري على الأسطح الصلبة',
            'المشي الخفيف: المشي لمدة 20-30 دقيقة يومياً، المشي على الأسطح الناعمة، تجنب المشي على المنحدرات'
        ],
        'متلازمة ألم الرضفة': [
            'تمرين رفع الساق المستقيم (Straight Leg Raise): استلقِ على ظهرك مع ثني الركبة السليمة، ارفع الساق المصابة ببطء حتى مستوى الركبة السليمة، احتفظ بالوضعية 3-5 ثواني، أنزل الساق ببطء، كرر 10-15 مرة، افعل 3 مجموعات',
            'تمرين تقوية العضلات الرباعية (Quad Sets): استلقِ على ظهرك مع ثني الركبة المصابة، اضغط على الركبة لأسفل لتقوية العضلات الرباعية، احتفظ بالوضعية 5-10 ثواني، استرخِ، كرر 10-15 مرة، افعل 3 مجموعات',
            'تمرين إطالة العضلات الخلفية (Hamstring Stretch): اجلس على الأرض مع ثني ركبة واحدة، مد الساق الأخرى للأمام، انحنى للأمام ببطء حتى تشعر بتمدد خفيف في الفخذ الخلفي، احتفظ بالوضعية 30 ثانية، كرر 3 مرات لكل ساق',
            'تمرين إطالة عضلات الساق (Calf Stretch): قف أمام حائط، ضع قدمك المصابة خلفك، انحنى للأمام ببطء حتى تشعر بتمدد خفيف في عضلات الساق، احتفظ بالوضعية 30 ثانية، كرر 3 مرات لكل ساق',
            'تجنب صعود الدرج: تجنب صعود ونزول الدرج، تجنب القرفصاء العميق، تجنب الجري على الأسطح الصلبة',
            'استخدام دعامة الركبة: استخدم دعامة للركبة عند الحاجة، ارتدِ الدعامة أثناء النشاط الذي يسبب الألم'
        ]
    },
    'ankle': {
        'التواء الكاحل الحاد/المزمن': [
            'تمرين إطالة الساق بالمنشفة (Towel Stretch): اجلس على كرسي أو على الأرض مع ركبتك مستقيمة، لف منشفة حول كرة قدمك، اسحب المنشفة نحوك لتمديد عضلات الساق، احتفظ بالوضعية 30 ثانية، استرخِ، كرر 3-5 مرات',
            'تمرين ضخ الكاحل (Ankle Pumps): اجلس على كرسي مع ركبتك مستقيمة، اثنِ ومد الكاحل، حرك قدمك للأعلى والأسفل، افعل مجموعتين من 15 تكرار',
            'تمرين دوائر الكاحل (Ankle Circles): اجلس على كرسي مع ركبتك مستقيمة، حرك الكاحل في حركة دائرية في اتجاه عقارب الساعة وعكسها، افعل مجموعتين من 15 تكرار في كل اتجاه',
            'تمرين كتابة الحروف الأبجدية (Alphabet Exercise): اجلس على كرسي مع ركبتك مستقيمة، اكتب الحروف الأبجدية بأصابع قدمك، حرك الكاحل في جميع الاتجاهات، ابدأ بحركات صغيرة ثم زد الحجم تدريجياً، افعل مجموعتين',
            'تمرين إطالة الساق واقفاً (Standing Calf Stretch): قف أمام حائط، ضع قدمك المصابة خلف القدم السليمة مع الحفاظ على قدمك المصابة موجهة نحو الحائط، انحنى للأمام ببطء مع الحفاظ على الركبة الخلفية مستقيمة والكعب على الأرض، احتفظ بالوضعية 30 ثانية، استرخِ، كرر 3-5 مرات',
            'تمرين إطالة الأكيليس (Achilles Stretch): قف على كرة قدم واحدة على درج أو منصة مرتفعة، أنزل كعبك لأسفل حتى تشعر بتمدد في قوس القدم والساق، احتفظ بالوضعية 30 ثانية، استرخِ، كرر 3-5 مرات',
            'تمارين التوازن: الوقوف على قدم واحدة لتحسين التوازن، ابدأ بالوقوف على قدم واحدة لمدة 30 ثانية، زد الوقت تدريجياً، استخدم حائط للدعم في البداية'
        ],
        'عدم استقرار الكاحل المزمن': [
            'تمارين التوازن المتقدمة: الوقوف على وسط غير مستقر، استخدم وسادة أو لوحة توازن، قف على قدم واحدة لمدة 30-60 ثانية، كرر على كلا القدمين، زد الصعوبة تدريجياً',
            'تمارين التقوية: تقوية العضلات المحيطة بالكاحل، استخدام حزام مقاومة لتمارين تقوية الكاحل، تمارين رفع الكعب ورفع أصابع القدم',
            'تمارين الحركة: حركات دائرية للكاحل، حركات الكاحل في جميع الاتجاهات، تمارين المدى الحركي الكامل للكاحل',
            'استخدام دعامة: دعامة الكاحل أثناء الرياضة، استخدم دعامة للحماية من الإصابات المتكررة',
            'تمارين القوة: تمارين القوة للكاحل والساق، تمارين القرفصاء المستقرة، تمارين الر lunges المستقرة'
        ]
    },
    'back-cervical': {
        'انزلاق غضروفي عنقي': [
            'تمرين إطالة الرقبة الجانبية (Neck Side Stretch): اجلس على كرسي بظهر مستقيم، ضع يدك اليمنى على رأسك واسحب برفق نحو اليمين، اشعر بتمدد في الجانب الأيسر من الرقبة، احتفظ بالوضعية 15-30 ثانية، كرر على الجانب الآخر، افعل 3 مرات لكل جانب',
            'تمرين إطالة الرقبة الأمامية (Neck Flexion Stretch): اجلس على كرسي بظهر مستقيم، اثنِ رأسك برفق للأمام حتى تشعر بتمدد خفيف في مؤخرة الرقبة، احتفظ بالوضعية 15-30 ثانية، استرخِ، كرر 3 مرات',
            'تمرين إطالة الرقبة الخلفية (Neck Extension Stretch): اجلس على كرسي بظهر مستقيم، ضع يديك خلف رأسك، ارفع رأسك برفق للخلف حتى تشعر بتمدد خفيف في مقدمة الرقبة، احتفظ بالوضعية 15-30 ثانية، استرخِ، كرر 3 مرات',
            'تمرين تقوية العضلات المحيطة بالرقبة: تقوية العضلات المحيطة بالرقبة، تمارين إمالة الرقبة برفق، تمارين دوران الرقبة برفق',
            'تجنب الحركات العنيفة: تجنب إمالة الرقبة بقوة، تجنب الدوران السريع للرقبة، تجنب الحركات المفاجئة',
            'استشارة: قد يحتاج لتقييم بالرنين المغناطيسي، استشرنا قبل البدء بأي تمارين'
        ],
        'تشنج عضلي ونقاط زناد': [
            'تمرين إطالة الرقبة الجانبية (Neck Side Stretch): اجلس على كرسي بظهر مستقيم، ضع يدك اليمنى على رأسك واسحب برفق نحو اليمين، اشعر بتمدد في الجانب الأيسر من الرقبة، احتفظ بالوضعية 15-30 ثانية، كرر على الجانب الآخر، افعل 3 مرات لكل جانب',
            'تمرين إطالة الرقبة الأمامية (Neck Flexion Stretch): اجلس على كرسي بظهر مستقيم، اثنِ رأسك برفق للأمام حتى تشعر بتمدد خفيف في مؤخرة الرقبة، احتفظ بالوضعية 15-30 ثانية، استرخِ، كرر 3 مرات',
            'تمرين إطالة لوح الكتف (Scapular Stretch): اجلس على كرسي بظهر مستقيم، اسحب لوح الكتف للخلف واضغطه للأسفل، احتفظ بالوضعية 5-10 ثواني، استرخِ، كرر 10 مرات',
            'تمرين تقوية العضلات المحيطة بالرقبة: تقوية العضلات المحيطة بالرقبة، تمارين إمالة الرقبة برفق، تمارين دوران الرقبة برفق',
            'كمادات باردة/دافئة: استخدم كمادات باردة للالتهاب الحاد، استخدم كمادات دافئة للتيبس المزمن',
            'تجنب الحركات العنيفة: تجنب إمالة الرقبة بقوة، تجنب الدوران السريع للرقبة'
        ],
        'تضيق القناة العنقية': [
            'تمرين إطالة الرقبة الجانبية (Neck Side Stretch): اجلس على كرسي بظهر مستقيم، ضع يدك اليمنى على رأسك واسحب برفق نحو اليمين، اشعر بتمدد في الجانب الأيسر من الرقبة، احتفظ بالوضعية 15-30 ثانية، كرر على الجانب الآخر، افعل 3 مرات لكل جانب',
            'تمرين إطالة الرقبة الأمامية (Neck Flexion Stretch): اجلس على كرسي بظهر مستقيم، اثنِ رأسك برفق للأمام حتى تشعر بتمدد خفيف في مؤخرة الرقبة، احتفظ بالوضعية 15-30 ثانية، استرخِ، كرر 3 مرات',
            'تمرين تقوية العضلات المحيطة بالرقبة: تقوية العضلات المحيطة بالرقبة، تمارين إمالة الرقبة برفق، تمارين دوران الرقبة برفق',
            'تجنب إطالة الرقبة للخلف: تجنب إطالة الرقبة للخلف، تجنب الحركات التي تزيد الألم',
            'استشارة: قد يحتاج لتقييم بالرنين المغناطيسي، استشرنا قبل البدء بأي تمارين'
        ],
        'مشاكل وضعية': [
            'تمرين تصحيح الوضعية (Posture Correction): اجلس على كرسي بظهر مستقيم، حافظ على كتفيك للأسفل والخلف، حافظ على رأسك في محاذاة عمودية مع جسمك، احتفظ بالوضعية 30 ثانية، استرخِ، كرر عدة مرات يومياً',
            'تمرين إطالة الصدر (Chest Stretch): قف في باب، ضع يديك على حافة الباب، انحنى للأمام حتى تشعر بتمدد في الصدر، احتفظ بالوضعية 30 ثانية، كرر 3 مرات',
            'تمرين تقوية العضلات المحيطة بالرقبة: تقوية العضلات المحيطة بالرقبة، تمارين إمالة الرقبة برفق، تمارين دوران الرقبة برفق',
            'تجنب الوضعيات السيئة: تجنب الانحناء المطول، تجنب النظر للأسفل لفترات طويلة، تجنب استخدام الهاتف لفترات طويلة',
            'أخذ فترات راحة: خذ استراحة كل 30 دقيقة من العمل على الكمبيوتر، قم بتمارين إطالة بسيطة لمدة 1-2 دقيقة'
        ]
    },
    'back-lumbar': {
        'انزلاق غضروفي قطني': [
            'تمرين ويليامز (Williams exercises): استلقِ على ظهرك مع ثني الركبتين، ارفع الركبتين ببطء نحو صدرك، اشعر بتمدد خفيف في أسفل الظهر، احتفظ بالوضعية 5-10 ثواني، أنزل الركبتين ببطء، كرر 10 مرات، افعل 3 مجموعات',
            'تمرين تمديد الظهر (Prone Extension): استلقِ على بطنك مع وضع يديك تحت كتفيك، ارفع الجزء العلوي من جسمك برفق عن الأرض، احتفظ بالوضعية 2-3 ثواني، أنزل الجسم ببطء، كرر 10 مرات، افعل 3 مجموعات',
            'تمرين تقوية العضلات: تقوية عضلات البطن والظهر، تمارين البطن الخفيفة، تمارين الظهر الخفيفة',
            'تجنب الحركات العنيفة: تجنب الرفع الثقيل، تجنب الانحناء المطول، تجنب الدوران القوي للجذع',
            'استشارة: قد يحتاج لتقييم بالرنين المغناطيسي، استشرنا قبل البدء بأي تمارين'
        ],
        'تشنج عضلي مزمن': [
            'تمرين إطالة الظهر (Back Stretch): اجلس على كرسي بظهر مستقيم، انحنى للأمام ببطء حتى تشعر بتمدد خفيف في الظهر، احتفظ بالوضعية 15-30 ثانية، استرخِ، كرر 3 مرات',
            'تمرين إطالة الركبة (Knee to Chest): استلقِ على ظهرك، ارفع ركبة واحدة ببطء نحو صدرك، اشعر بتمدد خفيف في أسفل الظهر، احتفظ بالوضعية 15-30 ثانية، أنزل الرجل ببطء، كرر على الرجل الأخرى، افعل 3 مرات لكل رجل',
            'تمرين الاسترخاء (Relaxation): تمارين الاسترخاء العميق، تمارين التنفس العميق، تمارين الاسترخاء العضلي التدريجي',
            'المشي الخفيف: المشي لمدة 20-30 دقيقة يومياً، المشي على الأسطح الناعمة، تجنب المشي على المنحدرات',
            'تطبيق الحرارة: استخدام الحرارة للاسترخاء، استخدام دش دافئ، استخدام وسادة حرارية'
        ],
        'خشونة مفاصل الركبة': [
            'تمرين تقوية العضلات: تقوية عضلات البطن والظهر، تمارين البطن الخفيفة، تمارين الظهر الخفيفة',
            'تمرين المدى الحركي: حركات خفيفة للعمود الفقري، ثني ومد الظهر برفق، حركات دائرية للظهر',
            'المشي الخفيف: المشي لمدة 20-30 دقيقة يومياً، المشي على الأسطح الناعمة، تجنب المشي على المنحدرات',
            'تجنب الحركات العنيفة: تجنب الرفع الثقيل، تجنب الانحناء المطول، تجنب الدوران القوي للجذع'
        ]
    },
    'fingers': {
        'إصبع الزناد': [
            'تمارين الإطالة: إطالة إصبع الزناد برفق لمدة 30 ثانية',
            'تمارين الحركة: فتح وإغلاق الإصبع برفق',
            'تطبيق الحرارة: استخدام الحرارة قبل التمارين',
            'استشارة: إذا استمرت المشكلة'
        ],
        'التهاب المفاصل': [
            'تمارين الحركة: حركات خفيفة للأصابع',
            'تمارين الإطالة: إطالات خفيفة للأصابع',
            'تجنب الحركات المؤلمة: تجنب القبض القوي',
            'استشارة: قد يحتاج أدوية مضادة للالتهاب'
        ],
        'متلازمة النفق الرسغي': [
            'تمارين الإطالة: إطالة معصم اليد برفق لمدة 30 ثانية',
            'تمارين الحركة: حركات خفيفة للأصابع والمعصم',
            'تجنب النوم على المعصم: استخدام دعامة للنوم',
            'أخذ فترات راحة: راحة قصيرة كل ساعة من العمل'
        ],
        'كيس زليلي': [
            'تجنب الضغط: تجنب الضغط على الكيس',
            'تمارين الحركة: حركات خفيفة للرسغ',
            'استشارة: قد يحتاج إزالة الكيس',
            'تطبيق الثلج: عند الألم'
        ]
    },
    'foot': {
        'التهاب اللفافة الأخمصية': [
            'تمارين الإطالة: إطالة اللفافة الأخمصية برفق',
            'تمارين التقوية: تقوية عضلات الساق',
            'استخدام أحذية مريحة: أحذية مع دعم جيد للقوس',
            'تطبيق الثلج: بعد التمارين'
        ],
        'كسر الإجهاد': [
            'الراحة: تجنب الحركات المؤلمة',
            'استشارة: قد يحتاج صور أشعة',
            'تجنب الجري: حتى الشفاء',
            'استخدام دعامة: عند الحاجة'
        ],
        'مسمار القدم': [
            'استخدام أحذية واسعة: أحذية مع مساحة واسعة للأصابع',
            'تمارين الإطالة: إطالة أصابع القدم',
            'تجنب الكعب العالي: تجنب الأحذية ذات الكعب العالي',
            'استشارة: قد يحتاج جراحة'
        ]
    },
    'toes': {
        'النقرس': [
            'تجنب الأطعمة الغنية بالبورين: اللحوم الحمراء، المأكولات البحرية',
            'شرب الكثير من الماء: 8-10 أكواب يومياً',
            'تجنب الكحول: خاصة البيرة',
            'استشارة: قد يحتاج أدوية'
        ],
        'إصبع المطرقة': [
            'استخدام أحذية واسعة: أحذية مع مساحة واسعة للأصابع',
            'تمارين الإطالة: إطالة أصابع القدم',
            'استخدام وسادة: بين الأصابع',
            'استشارة: قد يحتاج جراحة'
        ],
        'ظفر القدم النامي': [
            'قص الظفر بشكل مستقيم: تجنب القص الزاوي',
            'نظافة القدم: الحفاظ على نظافة القدم',
            'استخدام أحذية واسعة: تجنب الأحذية الضيقة',
            'استشارة: إذا حدثت عدوى'
        ]
    },
    'chest': {
        'مشاكل قلبية محتملة': [
            '🚨 استشارة فوراً: هذه حالة خطيرة',
            'تجنب المجهود الشديد: حتى الفحص',
            'الراحة: في مكان هادئ',
            'اتصال بالطوارئ: إذا ساءت الأعراض'
        ],
        'ألم عضلي في الصدر': [
            'تمارين الإطالة: إطالة عضلات الصدر',
            'تمارين التقوية: تقوية عضلات الظهر',
            'تجنب الحركات المؤلمة: تجنب رفع الأشياء الثقيلة',
            'تطبيق الحرارة: عند الألم'
        ],
        'التهاب الغضاريف الضلعية': [
            'الراحة النسبية: تجنب الحركات المؤلمة',
            'تطبيق الحرارة: عند الألم',
            'تمارين الإطالة: إطالات خفيفة للصدر',
            'استشارة: إذا استمر الألم'
        ],
        'ارتجاع المريء': [
            'تجنب الأطعمة الحارة: والأطعمة الحمضية',
            'الأكل ببطء: مضغ الطعام جيداً',
            'تجنب الأكل قبل النوم: بـ 2-3 ساعات',
            'رفع الرأس أثناء النوم: باستخدام وسادة إضافية'
        ]
    },
    'abdomen': {
        'التهاب المعدة': [
            'تجنب الأطعمة الحارة: والأطعمة الحمضية',
            'الأكل ببطء: مضغ الطعام جيداً',
            'تجنب الكحول: والتدخين',
            'استشارة: قد يحتاج أدوية'
        ],
        'التهاب الزائدة الدودية': [
            '🚨 استشارة فوراً: هذه حالة خطيرة',
            'تجنب الأكل: حتى الفحص',
            'الراحة: في مكان هادئ',
            'اتصال بالطوارئ: إذا ساءت الأعراض'
        ],
        'متلازمة القولون المتهيج': [
            'تجنب الأطعمة المسببة: تحديد الأطعمة المسببة للأعراض',
            'الأكل بانتظام: وجبات صغيرة ومتكررة',
            'شرب الكثير من الماء: 8-10 أكواب يومياً',
            'التمارين الخفيفة: المشي لمدة 20-30 دقيقة يومياً'
        ],
        'حصى الكلى': [
            'شرب الكثير من الماء: 8-10 أكواب يومياً',
            'تجنب الأطعمة الغنية بالأكسالات: السبانخ، الشوكولاتة',
            'استشارة: قد يحتاج علاج طبي',
            'الراحة: إذا كان الألم شديداً'
        ]
    },
    'jaw': {
        'اضطراب مفصل الفك الفكي الصدغي': [
            'تمارين الإطالة: إطالة عضلات الفك برفق',
            'تجنب صرير الأسنان: استخدام حارس ليلي',
            'تجنب الأطعمة الصلبة: الأطعمة اللينة أفضل',
            'تطبيق الحرارة: عند الألم'
        ],
        'صرير الأسنان': [
            'استخدام حارس ليلي: حارس للأسنان أثناء النوم',
            'تمارين الاسترخاء: تمارين الاسترخاء قبل النوم',
            'تجنب الكافيين: خاصة قبل النوم',
            'استشارة: إذا استمرت المشكلة'
        ],
        'مشاكل الأسنان': [
            'نظافة الفم: تنظيف الأسنان بانتظام',
            'استشارة: فحص دوري',
            'تجنب الأطعمة السكرية: الأطعمة اللينة أفضل',
            'المضمضة بالماء المالح: عند الألم'
        ],
        'التهاب الجيوب الأنفية': [
            'استشارة: قد يحتاج مضادات حيوية',
            'استخدام بخار: استنشاق البخار',
            'شرب الكثير من الماء: 8-10 أكواب يومياً',
            'تجنب المهيجات: الدخان، الغبار'
        ]
    }
};

// دالة للحصول على التمارين المناسبة للتشخيص
function getExercisesForDiagnosis(diagnosisName, jointName) {
    // تحديد المفصل
    let jointKey = '';
    if (jointName.includes('الكتف')) jointKey = 'shoulder';
    else if (jointName.includes('الكوع')) jointKey = 'elbow';
    else if (jointName.includes('الرسغ')) jointKey = 'wrist';
    else if (jointName.includes('الركبة')) jointKey = 'knee';
    else if (jointName.includes('الكاحل')) jointKey = 'ankle';
    else if (jointName.includes('الرقبة')) jointKey = 'back-cervical';
    else if (jointName.includes('أسفل الظهر')) jointKey = 'back-lumbar';
    else if (jointName.includes('أصابع اليد')) jointKey = 'fingers';
    else if (jointName.includes('القدم')) jointKey = 'foot';
    else if (jointName.includes('أصابع القدم')) jointKey = 'toes';
    else if (jointName.includes('الصدر')) jointKey = 'chest';
    else if (jointName.includes('البطن')) jointKey = 'abdomen';
    else if (jointName.includes('الفك')) jointKey = 'jaw';
    
    if (!jointKey || !exercisesDB[jointKey]) {
        return ['استشارة مختص لتحديد التمارين المناسبة'];
    }
    
    // البحث عن التشخيص في قاعدة البيانات
    for (const [key, exercises] of Object.entries(exercisesDB[jointKey])) {
        if (diagnosisName.includes(key) || key.includes(diagnosisName)) {
            return exercises;
        }
    }
    
    // إذا لم يتم العثور على تشخيص محدد
    return ['استشارة مختص لتحديد التمارين المناسبة'];
}

// توليد التقرير النصي المفصل والشخصي
function generateDetailedReport(diagnosisList, jointName, answers, age, bmi, gender, patientName, severity, duration, chronicDiseases, pattern) {
    let primary = diagnosisList[0];
    let pronoun = gender === 'male' ? 'تعاني' : 'تعانين';
    let pronoun2 = gender === 'male' ? 'أنت' : 'أنتِ';
    let namePart = patientName ? (gender === 'male' ? `عزيزي ${patientName}` : `عزيزتي ${patientName}`) : pronoun2;
    
    // التعامل مع الحالة التي تكون فيها الاحتمالية 0% أو منخفضة جداً
    if(primary.prob === 0 || primary.prob < 10) {
        let report = `بناءً على تحليل شامل لأعراضك ${namePart}، لم يتمكن النظام من تحديد تشخيص محدد بنسبة عالية. `;
        report += `هذا يعني أن الأعراض غير كافية أو غير محددة للوصول إلى تشخيص دقيق. `;
        report += `**يوصى بإجراء فحص سريري متخصص لتقييم حالتك بدقة.**\n\n`;
        
        // إضافة تحليل عام للأعراض
        if(pattern.mechanical) report += `تشير الأعراض إلى طبيعة ميكانيكية (تزداد مع الحركات المحددة). `;
        if(pattern.inflammatory) report += `تشير الأعراض إلى طبيعة التهابية (تيبس صباحي، ألم مستمر). `;
        if(pattern.neuropathic) report += `تشير الأعراض إلى طبيعة عصبية (تنميل، امتداد الألم). `;
        if(pattern.weakness) report += `يوجد ضعف في العضلات يتطلب تقييماً عصبياً. `;
        
        report += `\n\n**توصيات عامة:** راجع مختصاً للفحص السريري الكامل. قد يحتاج الأمر إلى صور أشعة أو رنين مغناطيسي للتأكيد. `;
        
        return report;
    }
    
    let report = `بناءً على تحليل شامل لأعراضك ${namePart}، يبدو أنك ${pronoun} من **${primary.name}** بنسبة احتمالية ${primary.prob}%. `;
    
    // إضافة قسم المعايير السريرية
    const clinicalCriteriaMet = evaluateClinicalCriteria(jointName, answers);
    if (clinicalCriteriaMet.length > 0) {
        report += `\n\n**🔬 المعايير السريرية المستوفاة:**\n`;
        clinicalCriteriaMet.forEach(criteria => {
            report += `• ${criteria}\n`;
        });
        report += `هذه المعايير تزيد من دقة التشخيص.\n`;
    }
    
    // إضافة قسم تحليل نمط الأعراض بشكل منفصل
    report += `\n\n**📊 تحليل نمط الأعراض:**\n`;
    let patternFound = false;
    
    if (pattern.mechanical) {
        report += `• طبيعة ميكانيكية: الألم يزداد مع الحركات المحددة (مثل المشي، صعود الدرج، الحمل)\n`;
        patternFound = true;
    }
    if (pattern.inflammatory) {
        report += `• طبيعة التهابية: يوجد تيبس صباحي طويل، تورم، ألم مستمر\n`;
        patternFound = true;
    }
    if (pattern.neuropathic) {
        report += `• طبيعة عصبية: يوجد تنميل، امتداد الألم، ضعف في العضلات\n`;
        patternFound = true;
    }
    if (pattern.instability) {
        report += `• عدم استقرار: يوجد شعور بعدم الثبات أو انزلاق المفصل\n`;
        patternFound = true;
    }
    if (pattern.nightPain) {
        report += `• ألم ليلي: الألم يزداد أثناء الليل أو يوقظك من النوم\n`;
        patternFound = true;
    }
    if (pattern.radiating) {
        report += `• امتداد الألم: الألم يشع إلى مناطق أخرى (ذراع، ساق، إلخ)\n`;
        patternFound = true;
    }
    if (pattern.weakness) {
        report += `• ضعف عضلي: يوجد صعوبة في القوة أو رفع الأشياء\n`;
        patternFound = true;
    }
    if (pattern.postural) {
        report += `• وضعية سيئة: الأعراض مرتبطة بوضعية الجلوس أو العمل\n`;
        patternFound = true;
    }
    if (pattern.traumatic) {
        report += `• إصاباتية: تاريخ إصابة حديثة أو سقوط\n`;
        patternFound = true;
    }
    if (pattern.degenerative) {
        report += `• تنكسية: مرتبط بالتقدم في العمر والتآكل الطبيعي للمفاصل\n`;
        patternFound = true;
    }
    if (pattern.overuse) {
        report += `• إفراط في الاستخدام: مرتبط بالحركات المتكررة أو العمل الشاق\n`;
        patternFound = true;
    }
    
    if (!patternFound) {
        report += `• نمط الأعراض غير محدد بوضوح\n`;
    }
    
    report += `\n\n**شرح الحالة:** `;
    
    if (jointName.includes('الكتف')) {
        if(primary.name.includes("انحشار")) report += `متلازمة انحشار الكتف تحدث عندما تضيق المسافة تحت عظم الأخرم، مما يسبب احتكاكاً مستمراً على أوتار الكفة المدورة عند رفع الذراع. الألم الليلي والضعف عند رفع الذراع فوق مستوى الرأس من العلامات المميزة. الحركات المتكررة فوق الرأس تزيد المشكلة.`;
        else if(primary.name.includes("وتر")) report += `التهاب وتر فوق الشوكة (Supraspinatus Tendinitis) شائع جداً ويسبب ألماً عند رفع الذراع جانبية أو حمل الأشياء. غالباً نتيجة إفراط في الاستخدام أو إصابة. يستجيب جيداً للعلاج الطبيعي المحافظ.`;
        else if(primary.name.includes("تمزق")) report += `تمزق الكفة المدورة (Rotator Cuff Tear) قد يكون جزئياً أو كلياً. الضعف الشديد في رفع الذراع وصعوبة النوم على الجانب المصاب من العلامات المميزة. قد يتطلب تقييماً بالرنين المغناطيسي. تجنب حمل الأوزان الثقيلة ضروري.`;
        else if(primary.name.includes("Frozen")) report += `التهاب كبسولة الكتف (Frozen Shoulder) يتميز بتيبس شديد وتقيود في الحركة، خاصة في المراحل المبكرة. يحدث غالباً بعد 40-60 سنة وقد يرتبط بفترة راحة طويلة أو إصابة. العلاج المكثف ضروري لاستعادة الحركة.`;
        else if(primary.name.includes("الجراب")) report += `التهاب الجراب تحت الأخرم يسبب ألماً جانب الكتف، خاصة عند النوم على الجانب المصاب. غالباً يرتبط بإفراط في الاستخدام. يستجيب جيداً للراحة والعلاج المحافظ.`;
        else report += `الحالة تتطلب تقييماً سريرياً متخصصاً لتحديد السبب الدقيق.`;
    } else if (jointName.includes('الكوع')) {
        if(primary.name.includes("Tennis")) report += `التهاب اللقيمة الخارجية (Tennis Elbow) يصيب أوتار مد الذراع. الألم يزداد عند مد الكوع أو تدوير الذراع، خاصة عند حمل الأشياء. شائع في الرياضات والعمل اليدوي المتكرر. الراحة وتجنب الحركات المؤلمة ضرورية.`;
        else if(primary.name.includes("Golfer")) report += `التهاب اللقيمة الداخلية (Golfer's Elbow) يصيب الجانب الداخلي للكوع. الألم يزداد عند ثني الكوع أو القبض القوي. شائع في لاعبي الجولف والعمل اليدوي. العلاج المحافظ فعال غالباً.`;
        else if(primary.name.includes("النفق الكعبي")) report += `متلازمة النفق الكعبي تشبه متلازمة النفق الرسغي لكن في الكوع. تسبب تنميلاً في الخنصر والبنصر وقد تضعف القبض. الأعراض الليلية شائعة. قد تتطلب تقييماً عصبياً.`;
        else report += `الحالة تتطلب تقييماً سريرياً متخصصاً.`;
    } else if (jointName.includes('الرسغ')) {
        if(primary.name.includes("النفق الرسغي")) report += `متلازمة النفق الرسغي (Carpal Tunnel Syndrome) تحدث عند ضغط العصب المتوسط في الرسغ. التنميل في الإبهام والسبابة والوسطى، خاصة ليلاً، من العلامات المميزة. استخدام الكمبيوتر المفرط عامل مهم. قد تتطلب دعامة أو تدخلاً جراحياً.`;
        else if(primary.name.includes("دي كيرفان")) report += `التهاب دي كيرفان (De Quervain's) يصيب أوتار إبهام اليد. الألم في جانب الرسغ يزداد عند القبض أو رفع الإبهام. شائع في الأمهات الجدد ومن يستخدم الهاتف بكثرة. العلاج المحافظ فعال.`;
        else if(primary.name.includes("الكيس الزليلي")) report += `الكيس الزليلي (Ganglion Cyst) هو كيس مملوء بالسائل يظهر عادة في ظهر الرسغ. قد يسبب ألماً أو ضغطاً. قد يختفي تلقائياً أو يتطلب إزالته.`;
        else report += `الحالة تتطلب تقييماً سريرياً متخصصاً.`;
    } else if (jointName.includes('الورك')) {
        if(primary.name.includes("خشونة")) report += `خشونة مفاصل الورك (Hip Osteoarthritis) تتميز بتآكل الغضروف وتآكل العظام. الألم في الفخذ أو الأربية، تيبس صباحي، وتقيود في الحركة من العلامات المميزة. الوزن الزائد والعمر عوامل مهمة. فقدان الوزن والتمارين المناسبة تحسن الأعراض.`;
        else if(primary.name.includes("الجراب")) report += `التهاب الجراب المداري (Trochanteric Bursitis) يسبب ألماً في الجانب الخارجي للفخذ. الألم يزداد عند المشي أو النوم على الجانب المصاب. شائع في النساء ومن يعانون من عدم توازن عضلي. العلاج المحافظ فعال.`;
        else if(primary.name.includes("الشفة")) report += `تمزق الشفة الوركية (Labral Tear) قد يسبب ألماً في الأربية وطقطقة. شائع في الرياضيين والشباب. قد يتطلب تقييماً بالرنين المغناطيسي.`;
        else report += `الحالة تتطلب تقييماً سريرياً متخصصاً.`;
    } else if (jointName.includes('الركبة')) {
        if(primary.name.includes("تمزق الغضروف")) report += `تمزق الغضروف الهلالي (Meniscus Tear) يحدث غالباً نتيجة حركة فجائية مع التواء أو إصابة رضية. الإحساس بالتفلت أو الانغلاق، الطقطقة، والألم الجانبي من العلامات الكلاسيكية. قد يتطلب تقييماً بالرنين المغناطيسي.`;
        else if(primary.name.includes("تتبع الصابونة")) report += `خلل تتبع الصابونة (Patellofemoral Pain Syndrome) يسبب ألماً أمامياً في الركبة، خاصة مع صعود الدرج أو الجلوس الطويل. تقوية العضلة الرباعية وتحسين تتبع الصابونة تحسن الأعراض.`;
        else if(primary.name.includes("خشونة")) report += `خشونة مفاصل الركبة (Knee Osteoarthritis) مرتبطة بتآكل الغضروف مع تقدم العمر أو الوزن الزائد. الألم، التيبس الصباحي، والطقطقة من العلامات المميزة. فقدان الوزن وتمارين التقوية أساسيان.`;
        else if(primary.name.includes("ألم الرضفة")) report += `متلازمة ألم الرضفة شائعة في الشباب والرياضيين. الألم أمام الركبة يزداد مع النزول أو الجلوس. تقوية العضلات المحيطة بالركبة ضرورية.`;
        else if(primary.name.includes("أوزغود")) report += `مرض أوزغود-شلاتر (Osgood-Schlatter) يصيب المراهقين النشطين. نتوء مؤلم تحت الرضفة نتيجة إجهاد نمو العظام. غالباً يتحسن مع النضج والراحة النسبية.`;
        else report += `الحالة تتطلب تقييماً سريرياً متخصصاً.`;
    } else if (jointName.includes('الكاحل')) {
        if(primary.name.includes("التواء")) report += `التواء الكاحل قد يكون حاداً أو مزمناً. الالتواءات المتكررة تؤدي لعدم استقرار مزمن. التورم والألم خاصة عند الدوران من العلامات المميزة. التأهيل العضلي ضروري لمنع التكرار.`;
        else if(primary.name.includes("عدم استقرار")) report += `عدم استقرار الكاحل المزمن ينتج عن التواءات سابقة غير معالجة بشكل صحيح. الشعور بالتفلت أو الضعف عند المشي من العلامات المميزة. تقوية العضلات المحيطة ضرورية.`;
        else report += `الحالة تتطلب تقييماً سريرياً متخصصاً.`;
    } else if (jointName.includes('الساق')) {
        if(primary.name.includes("إجهاد عضلة")) report += `إجهاد عضلة الساق شائع في الرياضيين. الألم يزداد مع الجري أو المشي السريع. الراحة والتدرج في العودة للنشاط ضروريان.`;
        else if(primary.name.includes("DVT")) report += `احتمالية جلطة الأوردة العميقة (DVT) حالة خطيرة تتطلب فحصاً عاجلاً. التورم، الألم، وعوامل الخطر (سفر، جراحة) من المؤشرات. لا تنتظر - راجع الطوارئ فوراً.`;
        else report += `الحالة تتطلب تقييماً سريرياً متخصصاً.`;
    } else if (jointName.includes('الرقبة')) {
        if(primary.name.includes("انزلاق غضروفي")) report += `انزلاق غضروفي عنقي (غالباً C5-C6 أو C6-C7) يضغط على جذر العصب، مسبباً ألماً ينتشر إلى الذراع والتنميل في الأصابع. زيادة الأعراض مع حركة الرقبة أو العطس من العلامات المميزة. قد تحتاج إلى رنين مغناطيسي وتقييم عصبي.`;
        else if(primary.name.includes("تشنج عضلي")) report += `تشنج عضلات الرقبة ونقاط الزناد شائع جداً. التيبس، الدوخة المرتبطة بالحركة، والصداع التوتري من الأعراض. التوتر والوضعية السيئة عوامل مهمة. العلاج الطبيعي وتصحيح الوضعية مفيدان.`;
        else if(primary.name.includes("اعتلال الجذور")) report += `اعتلال الجذور العصبية العنقية يحدث عند ضغط الجذر العصبي (غالباً C5 أو C6 أو C7). الألم الممتد للذراع والتنميل من العلامات. يتطلب تقييماً عصبياً دقيقاً.`;
        else if(primary.name.includes("تضيق القناة")) report += `تضيق القناة العنقية شائع في كبار السن. تضيق القناة العصبية في الرقبة يسبب ألماً وضعفاً في الأطراف، خاصة عند المشي. قد يتطلب تقييماً متقدماً بالرنين المغناطيسي.`;
        else if(primary.name.includes("الوضضعي")) report += `متلازمة الألم الوضعي ناتجة عن وضعية سيئة طويلة (كمبيوتر، هاتف). الألم والتعب العضلي من الأعراض. تصحيح بيئة العمل والاستراحات المنتظمة ضرورية.`;
        else report += `الحالة تتطلب تقييماً سريرياً متخصصاً.`;
    } else if (jointName.includes('منتصف الظهر')) {
        if(primary.name.includes("تشنج عضلي")) report += `تشنج عضلي في منتصف الظهر (الفقرات الصدرية T1-T12) شائع. الألم يزداد مع التنفس العميق أو الوضعية السيئة. تصحيح بيئة العمل والتمارين الإطالة مفيدة.`;
        else if(primary.name.includes("الغضاريف الضلعية")) report += `التهاب الغضاريف الضلعية يسبب ألماً في جانب الصدر يزداد مع التنفس العميق أو الدوران. شائع بعد إصابة أو سعال شديد. العلاج المحافظ فعال.`;
        else if(primary.name.includes("انزلاق غضروفي")) report += `انزلاق غضروفي صدري (نادر جداً، غالباً T8-T12 أو T11-T12) يسبب ألماً يمتد للصدر أو البطن. يتطلب تقييماً بالرنين المغناطيسي.`;
        else report += `الحالة تتطلب تقييماً سريرياً متخصصاً.`;
    } else if (jointName.includes('أسفل الظهر')) {
        if(primary.name.includes("انزلاق غضروفي")) report += `انزلاق غضروفي قطني (غالباً L4-L5 أو L5-S1) يضغط على جذر العصب، مسبباً ألماً يمتد للساق (عرق النسا). زيادة الألم مع العطس أو السعال من العلامات المميزة. الراحة وتجنب الانحناء ضروريان. قد تحتاج إلى رنين مغناطيسي.`;
        else if(primary.name.includes("تضيق القناة")) report += `تضيق القناة العصبية القطنية شائع في كبار السن. تضيق القناة العصبية في الفقرات القطنية (L2-L5) يسبب ألماً وضعفاً في الساقين. الألم يزداد مع المشي ويخف عند الانحناء للأمام. العلاج المحافظ فعال غالباً.`;
        else if(primary.name.includes("تشنج عضلي")) report += `تشنج عضلي مزمن في الفقرات القطنية (L1-L5) غالباً نتيجة وضعيات خاطئة أو إجهاد. الألم يتحسن مع الحركة والراحة النسبية. تصحيح بيئة العمل والتمارين المناسبة مفيدة.`;
        else if(primary.name.includes("انزلاق فقاري")) report += `الانزلاق الفقاري (Spondylolisthesis) هو انزلاق فقرة فوق الأخرى (غالباً L5 على S1). قد يسبب عدم استقرار وألماً. يتطلب تقييماً بالأشعة السينية أو الرنين المغناطيسي.`;
        else if(primary.name.includes("المفاصل الفقرية")) report += `التهاب المفاصل الفقرية (Facet Joint Arthritis) يصيب المفاصل الفقرية الصغيرة في العمود الفقري (غالباً L4-L5 أو L5-S1). يسبب ألماً وتيبس. الألم يزداد مع الرجوع للخلف. العلاج المحافظ فعال.`;
        else if(primary.name.includes("الحرقفي العجزي")) report += `التهاب مفصل الحرقفي العجزي (SI Joint) يصيب المفصل بين العجز وعظم الحرقفي (L5-S1). يسبب ألماً في أسفل الظهر والأرداف. الألم يزداد عند الجلوس الطويل أو صعود الدرج. العلاج المحافظ فعال.`;
        else report += `الحالة تتطلب تقييماً سريرياً متخصصاً.`;
    } else if (jointName.includes('العصعص')) {
        if(primary.name.includes("Coccydynia")) report += `ألم العصعص (Coccydynia) يسبب ألماً شديداً عند الجلوس. قد ينتج عن إصابة أو ضغط مطول. استخدام وسادة ناعمة وتجنب الجلوس الطويل ضروري.`;
        else report += `الحالة تتطلب تقييماً سريرياً متخصصاً.`;
    } else if (jointName.includes('عضلات الرقبة')) {
        if(primary.name.includes("تشنج عضلي")) report += `تشنج عضلي في الرقبة شائع جداً. التوتر والوضعية السيئة عوامل مهمة. التمارين الإطالة وتصحيح الوضعية مفيدة.`;
        else if(primary.name.includes("التوتر")) report += `متلازمة التوتر العضلي تسبب ألماً وتعباً. التوتر النفسي عامل مهم. الاسترخاء والتمارين التنفسية مفيدة.`;
        else report += `الحالة تتطلب تقييماً سريرياً متخصصاً.`;
    } else if (jointName.includes('لوح الكتف')) {
        if(primary.name.includes("تشنج عضلي")) report += `تشنج عضلي حول لوح الكتف شائع. الوضعية السيئة والعمل الطويل عوامل مهمة. التمارين الإطالة مفيدة.`;
        else if(primary.name.includes("السناب")) report += `متلازمة السناب (Snapping Scapula) تسبب طقطقة عند حركة الكتف. قد تكون بدون ألم أو مع ألم. العلاج الطبيعي مفيد.`;
        else report += `الحالة تتطلب تقييماً سريرياً متخصصاً.`;
    } else if (jointName.includes('الأرداف')) {
        if(primary.name.includes("الكمثري")) report += `متلازمة الكمثري (Piriformis Syndrome) تسبب ألماً في الأرداف قد يمتد للساق. عضلة الكمثري تضغط على العصب الوركي. التمارين الإطالة مفيدة.`;
        else report += `الحالة تتطلب تقييماً سريرياً متخصصاً.`;
    } else if (jointName.includes('أصابع اليد')) {
        if(primary.name.includes("إصبع الزناد")) report += `إصبع الزناد (Trigger Finger) يحدث عندما تلتصق أوتار الإصبع بالغمد الوتري. الطقطقة عند ثني الإصبع من العلامات المميزة. شائع في من يستخدمون أيديهم بشكل مكثف. العلاج المحافظ فعال غالباً.`;
        else if(primary.name.includes("التهاب المفاصل")) report += `التهاب المفاصل (Arthritis) في الأصابع يسبب تيبساً صباحياً وتورماً. شائع في كبار السن. فقدان الوزن والتمارين المناسبة تحسن الأعراض.`;
        else if(primary.name.includes("النفق الرسغي")) report += `متلازمة النفق الرسغي (Carpal Tunnel Syndrome) تحدث عند ضغط العصب المتوسط في الرسغ. التنميل في الإبهام والسبابة والوسطى من العلامات المميزة. استخدام الكمبيوتر المفرط عامل مهم.`;
        else if(primary.name.includes("كيس زليلي")) report += `الكيس الزليلي (Ganglion Cyst) هو كيس مملوء بالسائل يظهر عادة في المفاصل. قد يسبب ألماً أو ضغطاً. قد يختفي تلقائياً أو يتطلب إزالته.`;
        else report += `الحالة تتطلب تقييماً سريرياً متخصصاً.`;
    } else if (jointName.includes('القدم')) {
        if(primary.name.includes("التهاب اللفافة الأخمصية")) report += `التهاب اللفافة الأخمصية (Plantar Fasciitis) شائع جداً. الألم في الكعب أسوأ في الصباح من العلامات المميزة. الوزن الزائد والوقوف الطويل عوامل مهمة. التمارين الإطالة مفيدة جداً.`;
        else if(primary.name.includes("كسر الإجهاد")) report += `كسر الإجهاد (Stress Fracture) يحدث نتيجة إجهاد متكرر على العظام. الألم يزداد مع النشاط. الراحة وتجنب الحركات المؤلمة ضروريان. قد يحتاج صور أشعة للتأكيد.`;
        else if(primary.name.includes("مسمار القدم")) report += `مسمار القدم (Bunion) هو نتوء عظمي في قاعدة إصبع القدم الكبير. الألم والتشوه من العلامات المميزة. شائع في النساء ومن يرتدون أحذية ضيقة. قد يتطلب جراحة في الحالات الشديدة.`;
        else report += `الحالة تتطلب تقييماً سريرياً متخصصاً.`;
    } else if (jointName.includes('أصابع القدم')) {
        if(primary.name.includes("النقرس")) report += `النقرس (Gout) هو التهاب ناتج عن تراكم حمض اليوريك. الألم الشديد والاحمرار في إصبع القدم الكبير من العلامات المميزة. تجنب الأطعمة الغنية بالبورين والكحول ضروري.`;
        else if(primary.name.includes("إصبع المطرقة")) report += `إصبع المطرقة (Hammer Toe) هو تشوه في إصبع القدم يجعله ينحني للأسفل. الألم عند ارتداء الأحذية من العلامات المميزة. استخدام أحذية واسعة والتمارين الإطالة مفيدة.`;
        else if(primary.name.includes("ظفر القدم النامي")) report += `ظفر القدم النامي (Ingrown Toenail) ينمو في الجلد المحيط. الألم والاحمرار والعدوى من العلامات المميزة. النظافة الجيدة والقص المستقيم للظفر ضروريان.`;
        else report += `الحالة تتطلب تقييماً سريرياً متخصصاً.`;
    } else if (jointName.includes('الصدر')) {
        if(primary.name.includes("مشاكل قلبية")) report += `🚨 مشاكل قلبية محتملة حالة خطيرة تتطلب تقييماً عاجلاً. ضغط الصدر وامتداد الألم للكتف الأيسر من العلامات المميزة. راجع الطوارئ فوراً إذا ساءت الأعراض.`;
        else if(primary.name.includes("ألم عضلي")) report += `ألم عضلي في الصدر ناتج عن إجهاد عضلات الصدر. الألم يزداد مع الحركة من العلامات المميزة. الراحة والتمارين الإطالة مفيدة.`;
        else if(primary.name.includes("التهاب الغضاريف الضلعية")) report += `التهاب الغضاريف الضلعية يسبب ألماً في جانب الصدر. الألم يزداد مع التنفس العميق من العلامات المميزة. العلاج المحافظ فعال غالباً.`;
        else if(primary.name.includes("ارتجاع المريء")) report += `ارتجاع المريء (GERD) يسبب ألماً حارقاً في الصدر. الألم يزداد عند الاستلقاء من العلامات المميزة. تجنب الأطعمة الحارة والأكل قبل النوم ضروري.`;
        else report += `الحالة تتطلب تقييماً سريرياً متخصصاً.`;
    } else if (jointName.includes('البطن')) {
        if(primary.name.includes("التهاب المعدة")) report += `التهاب المعدة (Gastritis) يسبب ألماً في أعلى البطن. الألم يزداد بعد الأكل من العلامات المميزة. تجنب الأطعمة الحارة والكحول ضروري.`;
        else if(primary.name.includes("التهاب الزائدة الدودية")) report += `🚨 التهاب الزائدة الدودية حالة خطيرة تتطلب تقييماً عاجلاً. الألم في الجانب الأيمن من الأسفل من العلامات المميزة. راجع الطوارئ فوراً إذا ساءت الأعراض.`;
        else if(primary.name.includes("متلازمة القولون المتهيج")) report += `متلازمة القولون المتهيج (IBS) يسبب ألماً مغصياً وتغيرات في عادات الأمعاء. التوتر والأطعمة المسببة عوامل مهمة. التمارين الخفيفة وتجنب المهيجات مفيدة.`;
        else if(primary.name.includes("حصى الكلى")) report += `حصى الكلى تسبب ألماً حاداً في الجانب. الألم يزداد مع التبول من العلامات المميزة. شرب الكثير من الماء ضروري. قد يحتاج علاج طبي.`;
        else report += `الحالة تتطلب تقييماً سريرياً متخصصاً.`;
    } else if (jointName.includes('الفك')) {
        if(primary.name.includes("TMJ")) report += `اضطراب مفصل الفك الفكي الصدغي (TMJ) يسبب ألماً في الفك وطقطقة عند فتح الفم. التوتر وصرير الأسنان عوامل مهمة. التمارين الإطالة وتجنب الأطعمة الصلبة مفيدة.`;
        else if(primary.name.includes("صرير الأسنان")) report += `صرير الأسنان (Bruxism) هو طحن الأسنان أثناء النوم. الصداع وتآكل الأسنان من العلامات المميزة. استخدام حارس ليلي والتمارين الاسترخاء ضروري.`;
        else if(primary.name.includes("مشاكل الأسنان")) report += `مشاكل الأسنان قد تشمل التسوس أو التهاب اللثة. الألم عند المضغ من العلامات المميزة. نظافة الفم والفحص الدوري ضروريان.`;
        else if(primary.name.includes("التهاب الجيوب الأنفية")) report += `التهاب الجيوب الأنفية يسبب ألماً في الوجه والرأس. الألم يزداد عند الانحناء من العلامات المميزة. الاستشارة الطبية قد تحتاج مضادات حيوية.`;
        else report += `الحالة تتطلب تقييماً سريرياً متخصصاً.`;
    } else {
        report += `الأعراض تتوافق مع ${primary.name}. يوصى بإجراء فحص سريري متخصص لتأكيد التشخيص.`;
    }
    
    // إضافة توصيات شخصية
    report += `\n\n**توصيات شخصية بناءً على حالتك:** `;
    
    if (bmi && bmi > 27) {
        report += `مؤشر كتلة الجسم (${bmi.toFixed(1)}) يشير إلى ${bmi>30?'سمنة':'وزن زائد'}. `;
        if (jointName.includes('الركبة')||jointName.includes('الورك')||jointName.includes('الكاحل')||jointName.includes('أسفل الظهر')) {
            report += `فقدان الوزن سيخفف الضغط على المفاصل ويحسن الأعراض بشكل ملحوظ. `;
        }
    }
    
    if (age > 50 && (jointName.includes('الركبة')||jointName.includes('الورك')||jointName.includes('الكتف'))) {
        report += `العمر (${age} سنة) عامل مهم في التشخيص. التدهور التنكسي الطبيعي قد يساهم في الأعراض. `;
    }
    
    if (chronicDiseases.includes('diabetes')) {
        report += `بما أنك تعاني من السكري، يجب مراقبة مستوى السكر لأنه يؤثر على الشفاء. `;
    }
    
    if (chronicDiseases.includes('rheumatoid')) {
        report += `الروماتويد عامل مهم يجب مراعاته في خطة العلاج. `;
    }
    
    if (duration === 'chronic') {
        report += `مدة الألم المزمنة (أكثر من شهر) تتطلب علاجاً متكاملاً وصبراً. `;
    }
    
    if (severity >= 8) {
        report += `شدة الألم العالية (${severity}/10) تستدعي تقييماً عاجلاً. `;
    }
    
    if (pattern.postural) {
        report += `تصحيح الوضعية والبيئة العملية ضروري لمنع تكرار الأعراض. `;
    }
    
    if (pattern.overuse) {
        report += `الإفراط في الاستخدام عامل مهم. الراحة النسبية وتعديل النشاط ضروريان. `;
    }
    
    // إضافة قسم التمارين المناسبة
    report += `\n\n**🏋️ التمارين المناسبة لحالتك:**\n`;
    const exercises = getExercisesForDiagnosis(primary.name, jointName);
    exercises.forEach((exercise, index) => {
        report += `${index + 1}. ${exercise}\n`;
    });
    
    // إضافة تحذيرات واضحة للحالات الخطيرة
    report += `\n\n**⚠️ تحذيرات مهمة:**\n`;
    let warningsAdded = false;
    
    if (pattern.neuropathic && pattern.weakness) {
        report += `🚨 وجود ضعف عضلي مع تنميل يتطلب تقييماً عصبياً عاجلاً. راجع مختصاً فوراً.\n`;
        warningsAdded = true;
    }
    
    if (pattern.radiating && (jointName.includes('أسفل الظهر') || jointName.includes('الرقبة'))) {
        report += `🚨 امتداد الألم للساق أو الذراع قد يشير لمشكلة في العمود الفقري. راجع أخصائي العمود الفقري.\n`;
        warningsAdded = true;
    }
    
    if (severity >= 8) {
        report += `🚨 شدة الألم العالية (${severity}/10) تستدعي تقييماً طبياً عاجلاً.\n`;
        warningsAdded = true;
    }
    
    if (duration === 'acute' && pattern.traumatic) {
        report += `🚨 الألم الحاد بعد إصابة يتطلب تقييماً طبياً فورياً لاستبعاد الكسور أو الإصابات الخطيرة.\n`;
        warningsAdded = true;
    }
    
    if (primary.prob < 50) {
        report += `⚠️ احتمالية التشخيص منخفضة (${primary.prob}%). يوصى بإجراء فحص سريري متخصص لتأكيد التشخيص.\n`;
        warningsAdded = true;
    }
    
    if (!warningsAdded) {
        report += `⚠️ هذه الأداة للإرشاد فقط ولا تغني عن الفحص الطبي السريري. راجع مختصاً للتأكيد.\n`;
    }
    
    return report;
}

// التمارين والتحذيرات الذكية والمخصصة
async function getHomeExercisesAndWarnings(diagnosisList, jointId, pattern, age, bmi, severity, duration) {
    // استخدام النظام القديم مباشرة لأنه يحتوي على جميع الشروط المحدثة
    return getHomeExercisesAndWarningsOld(diagnosisList, jointId, pattern, age, bmi, severity, duration);
}

// دالة النظام الخبير الجديد
async function getHomeExercisesAndWarningsNew(diagnosisList, jointId, pattern, age, bmi, severity, duration) {
    if (!expertSystem) {
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
    
    // تحويل إجابات النمط إلى إجابات النظام الجديد
    const answers = convertPatternToAnswers(pattern);
    
    // إضافة الإجابات إلى النظام
    for (const [key, value] of Object.entries(answers)) {
        expertSystem.addAnswer(key, value);
    }
    
    // تشغيل التحليل الكامل
    const result = expertSystem.runFullAnalysis({
        severity: severity >= 8 ? 'high' : (severity <= 3 ? 'low' : 'moderate'),
        difficultyLevel: severity >= 8 ? 'beginner' : 'intermediate'
    });
    
    // إذا كان هناك مخاطر، إرجاع رسالة تحذير
    if (result.status === 'stopped_due_to_risks') {
        return {
            exercises: result.riskAssessment.risks[0]?.message || '⚠️ يرجى استشارتنا فوراً',
            warnings: result.riskAssessment.risks.map(r => r.message)
        };
    }
    
    // تحويل التمارين إلى تنسيق النظام القديم
    let exercisesText = '';
    for (const item of result.exercises) {
        const exercise = item.exercise;
        exercisesText += `🏋️ **${exercise.title}**:\n`;
        exercisesText += `   لماذا: ${exercise.instructions.why}\n`;
        exercisesText += `   الخطوات:\n`;
        for (const step of exercise.instructions.steps) {
            exercisesText += `   - ${step}\n`;
        }
        exercisesText += `   التكرارات: ${exercise.instructions.repetitions}\n`;
        exercisesText += `   الجولات: ${exercise.instructions.sets}\n`;
        exercisesText += `   الراحة: ${exercise.instructions.restDuration}\n`;
        exercisesText += `   الشعور المتوقع: ${exercise.instructions.expectedSensation}\n`;
        exercisesText += `   التوقف عند: ${exercise.instructions.stopImmediately}\n\n`;
    }
    
    // إذا لم توجد تمارين، استخدم النظام القديم
    if (!exercisesText) {
        return null;
    }
    
    // تحويل التحذيرات
    const warnings = [];
    if (result.riskAssessment.hasRisks) {
        for (const risk of result.riskAssessment.risks) {
            warnings.push(risk.message);
        }
    }
    
    return {
        exercises: exercisesText,
        warnings: warnings
    };
}

// تحويل نمط الألم إلى إجابات النظام الجديد
function convertPatternToAnswers(pattern) {
    const answers = {};
    
    if (pattern.radiating) {
        answers['pain_radiates_to_leg'] = true;
    }
    
    if (pattern.neuropathic) {
        answers['numbness_present'] = true;
        answers['nerveIrritation'] = true;
    }
    
    if (pattern.inflammatory) {
        answers['inflammation_signs'] = true;
        answers['night_pain'] = true;
        answers['morning_stiffness'] = true;
    }
    
    if (pattern.mechanical) {
        answers['pain_worse_with_activity'] = true;
        answers['pain_better_with_rest'] = true;
    }
    
    if (pattern.traumatic) {
        answers['recent_severe_injury'] = true;
        answers['acute_injury'] = true;
    }
    
    return answers;
}

// النظام القديم كاحتياطي
function getHomeExercisesAndWarningsOld(diagnosisList, jointId, pattern, age, bmi, severity, duration) {
    console.log('getHomeExercisesAndWarningsOld - jointId:', jointId);
    
    // تحويل الاسم العربي إلى الكود الإنجليزي
    const arabicToEnglishMap = {
        'عضلات الرقبة اليمنى': 'back-neck-muscles-r',
        'عضلات الرقبة اليسرى': 'back-neck-muscles-l',
        'فقرات الرقبة': 'back-cervical',
        'منتصف الظهر': 'back-thoracic',
        'أسفل الظهر': 'back-lumbar',
        'العصعص': 'back-coccyx',
        'لوح الكتف الأيمن': 'back-scapula-r',
        'لوح الكتف الأيسر': 'back-scapula-l',
        'وسط الأرداف': 'back-gluteus',
        'الكتف الأيمن': 'front-shoulder-r',
        'الكتف الأيسر': 'front-shoulder-l',
        'الكوع الأيمن': 'front-elbow-r',
        'الكوع الأيسر': 'front-elbow-l',
        'الرسغ الأيمن': 'front-wrist-r',
        'الرسغ الأيسر': 'front-wrist-l',
        'الورك الأيمن': 'front-hip-r',
        'الورك الأيسر': 'front-hip-l',
        'الركبة اليمنى': 'front-knee-r',
        'الركبة اليسرى': 'front-knee-l',
        'الكاحل الأيمن': 'front-ankle-r',
        'الكاحل الأيسر': 'front-ankle-l'
    };
    
    // إذا كان jointId بالعربي، حوله للإنجليزي
    if (arabicToEnglishMap[jointId]) {
        jointId = arabicToEnglishMap[jointId];
        console.log('تحويل jointId من العربي للإنجليزي:', jointId);
    }
    
    let primary = diagnosisList[0];
    let exercises = "", warnings = [];
    
    // تحديد مرحلة الألم بناءً على الشدة والمدة
    let painPhase = 'moderate';
    if (severity >= 8 || duration === 'acute') {
        painPhase = 'acute';
    } else if (severity <= 3 || duration === 'chronic') {
        painPhase = 'chronic';
    }
    
    // تحديد نوع الألم بناءً على النمط
    let painType = 'mechanical';
    if (pattern.neuropathic) painType = 'neuropathic';
    else if (pattern.inflammatory) painType = 'inflammatory';
    else if (pattern.mechanical) painType = 'mechanical';
    
    if (jointId.includes('shoulder')) {
        if(primary.name.includes("انحشار")) {
            // تعديل التمارين حسب مرحلة الألم
            if (painPhase === 'acute') {
                exercises = "🛏️ **الراحة النسبية في المرحلة الحادة**:\n   - تجنب الحركات المؤلمة تماماً\n   - استمر في الحركات اليومية الخفيفة التي لا تسبب ألماً\n   - لا توقف الحركة تماماً - الحركة الخفيفة تساعد على الشفاء\n\n🏋️ **تمرين البندول الخفيف جداً (Pendulum Exercise)**:\n   - قف بجانب طاولة واتكأ عليها بذراعك السليم\n   - دع الذراع المصابة تتدلى بحرية تماماً\n   - استخدم وزن جسمك فقط، لا تستخدم عضلاتك\n   - حرك الذراع في دوائر صغيرة جداً (حجم كوب) 5 مرات فقط\n   - حرك الذراع للأمام والخلف 5 مرات فقط\n   - كرر مرتين يومياً فقط\n   - إذا شعرت بألم، توقف فوراً\n\n❄️ **كمادات باردة متكررة**:\n   - استخدم كيس ثلج أو كمادة باردة\n   - لف الكيس بمنشفة رقيقة (لا تضع الثلج مباشرة على الجلد)\n   - ضع الكمادة على الكتف لمدة 20 دقيقة\n   - كرر كل 2-3 ساعات\n\n🚫 **تجنب أي حركات فوق الرأس**:\n   - لا ترفع الذراع فوق مستوى الكتف\n   - لا تحمل أوزاناً ثقيلة\n   - تجنب الحركات المفاجئة";
                warnings = ["❌ لا تنم على الكتف المؤلم - استخدم وسادة إضافية", "❌ لا ترفع الذراع فوق مستوى الكتف في المرحلة الحادة", "❌ لا تحمل أوزاناً ثقيلة (أكثر من 1 كجم)", "❌ تجنب الحركات المفاجئة أو السريعة", "⚠️ راجعنا إذا استمر الألم لأكثر من أسبوع"];
            } else if (painPhase === 'chronic') {
                exercises = "🔥 **الحرارة قبل التمارين**:\n   - استخدم دش دافئ أو وسادة حرارية قبل التمارين\n   - مدة 10-15 دقيقة\n   - يساعد على إرخاء العضلات وتقليل الألم\n\n🏋️ **تمرين البندول (Pendulum Exercise)**:\n   - قف بجانب طاولة واتكأ عليها بذراعك السليم\n   - دع الذراع المصابة تتدلى بحرية تماماً\n   - استخدم وزن جسمك فقط، لا تستخدم عضلاتك\n   - حرك الذراع في دوائر صغيرة (حجم طبق) 10 مرات في اتجاه عقارب الساعة\n   - حرك الذراع 10 مرات في عكس اتجاه عقارب الساعة\n   - حرك الذراع للأمام والخلف 10 مرات\n   - حرك الذراع للجانبين 10 مرات\n   - كرر 3 مرات يومياً (صباحاً وظهراً ومساءً)\n\n🏋️ **تمارين إطالة الصدر أمام الحائط**:\n   - قف أمام الحائط على مسافة ذراع\n   - ضع يديك على الحائط على مستوى الكتف\n   - انحنى للأمام ببطء حتى تشعر بتمدد خفيف في الصدر والكتف\n   - احتفظ بالوضعية 30 ثانية\n   - لا تتنفس بحبس، تنفس بعمق وبطيء\n   - كرر 3 مرات\n\n🏋️ **سحب لوح الكتف للخلف**:\n   - اجلس على كرسي بظهر مستقيم\n   - ضع يديك على جانبيك\n   - اسحب لوح الكتف للخلف واضغطه للأسفل\n   - تخيل أنك تحاول جعل لوح الكتف يلمس كرسيك\n   - احتفظ بالوضعية 10 ثواني\n   - استرخِ لمدة 5 ثواني\n   - كرر 10 مرات\n   - افعل هذا التمرين عدة مرات في اليوم\n\n🏋️ **تمارين تقوية تدريجية**:\n   - تمارين تقوية العضلات المحيطة بالكتف\n   - تمارين تقوية لوحي الكتف\n   - زيادة الشدة تدريجياً على مدى أسابيع";
                warnings = ["❌ لا تنم على الكتف المؤلم - استخدم وسادة إضافية", "❌ تجنب الحركات المتكررة فوق الرأس", "❌ لا تحمل أوزاناً ثقيلة (أكثر من 3 كجم)", "❌ تجنب الحركات المفاجئة أو السريعة", "⚠️ العلاج المكثف ضروري للحالة المزمنة"];
            } else {
                exercises = "🏋️ **تمرين البندول (Pendulum Exercise)**:\n   - قف بجانب طاولة واتكأ عليها بذراعك السليم\n   - دع الذراع المصابة تتدلى بحرية تماماً\n   - استخدم وزن جسمك فقط، لا تستخدم عضلاتك\n   - حرك الذراع في دوائر صغيرة (حجم طبق) 10 مرات في اتجاه عقارب الساعة\n   - حرك الذراع 10 مرات في عكس اتجاه عقارب الساعة\n   - حرك الذراع للأمام والخلف 10 مرات\n   - حرك الذراع للجانبين 10 مرات\n   - كرر 3 مرات يومياً (صباحاً وظهراً ومساءً)\n   - إذا شعرت بألم، قلل مدى الحركة\n\n🏋️ **تمارين إطالة الصدر أمام الحائط**:\n   - قف أمام الحائط على مسافة ذراع\n   - ضع يديك على الحائط على مستوى الكتف\n   - انحنى للأمام ببطء حتى تشعر بتمدد خفيف في الصدر والكتف\n   - احتفظ بالوضعية 30 ثانية\n   - لا تتنفس بحبس، تنفس بعمق وبطيء\n   - كرر 3 مرات\n   - إذا شعرت بألم شديد، قلل زاوية الانحناء\n\n🏋️ **سحب لوح الكتف للخلف**:\n   - اجلس على كرسي بظهر مستقيم\n   - ضع يديك على جانبيك\n   - اسحب لوح الكتف للخلف واضغطه للأسفل\n   - تخيل أنك تحاول جعل لوح الكتف يلمس كرسيك\n   - احتفظ بالوضعية 10 ثواني\n   - استرخِ لمدة 5 ثواني\n   - كرر 10 مرات\n   - افعل هذا التمرين عدة مرات في اليوم\n\n❄️ **كمادات باردة للالتهاب الحاد**:\n   - استخدم كيس ثلج أو كمادة باردة\n   - لف الكيس بمنشفة رقيقة (لا تضع الثلج مباشرة على الجلد)\n   - ضع الكمادة على الكتف لمدة 15-20 دقيقة\n   - كرر 3-4 مرات يومياً\n   - أفضل الأوقات: بعد التمارين وقبل النوم\n   - إذا شعرت بتنميل أو برودة شديدة، أوقف الكمادة فوراً\n\n🏋️ **تمارين تقوية الكفة المدورة الخفيفة**:\n   - اجلس أو قف بظهر مستقيم\n   - ارفع الذراع للجانب حتى مستوى الكتف\n   - لا ترفع فوق مستوى الكتف في البداية\n   - احتفظ بالوضعية 2-3 ثواني\n   - أنزل الذراع ببطء\n   - كرر 10 مرات\n   - زد التكرار تدريجياً إلى 15 ثم 20 مرة\n   - إذا شعرت بألم، توقف فوراً";
                warnings = ["❌ لا تنم على الكتف المؤلم - استخدم وسادة إضافية", "❌ تجنب رفع الذراع فوق مستوى الكتف في المرحلة الحادة (أول 2-3 أسابيع)", "❌ لا تحمل أوزاناً ثقيلة (أكثر من 2 كجم)", "❌ تجنب الحركات المفاجئة أو السريعة", "⚠️ إذا استمر الألم لأكثر من أسبوعين، راجعنا"];
            }
        } else if(primary.name.includes("وتر")) {
            exercises = "🏋️ **تمرين إطالة المنشفة (Towel Stretch)**:\n   - أمسك منشفة خلف ظهرك بيدك السليمة\n   - أمسك الطرف الآخر بيدك المصابة\n   - اسحب المنشفة برفق بيدك السليمة لرفع ذراعك المصابة\n   - اشعر بتمدد في كتفك المصاب\n   - احتفظ بالوضعية 15-20 ثانية\n   - كرر 10-20 مرة يومياً\n\n🏋️ **تمرين إطالة الجسم (Cross-body Stretch)**:\n   - اجلس أو قف\n   - استخدم يدك السليمة لرفع ذراعك المصابة عند الكوع\n   - اسحب الذراع برفق نحو جسمك\n   - اضغط برفق فوق الكوع\n   - اشعر بتمدد في كتفك\n   - احتفظ بالوضعية 15-20 ثانية\n   - كرر 10-20 مرة يومياً\n\n🏋️ **تمرين المشي على الحائط (Finger Walk)**:\n   - قف أمام حائط على مسافة ثلاثة أرباع طول الذراع\n   - استخدم ذراعك المصابة للمس الحائط عند مستوى الخصر\n   - امشِ بأصابعك ببطء على الحائط للأعلى\n   - استمر حتى مستوى الكتف أو حتى تشعر بألم\n   - أنزل الذراع ببطء\n   - كرر 10-20 مرة يومياً\n\n🏋️ **تمارين تقوية متساوية القياس (Isometric Exercises)**:\n   - الدوران الداخلي: استخدم حزام مقاومة، اسحب نحو بطنك، احتفظ 5 ثواني\n   - الدوران الخارجي: استخدم حزام مقاومة، اسحب للخارج، احتفظ 5 ثواني\n   - كرر 15-20 مجموعة يومياً\n\n❄️ **كمادات باردة بعد التمارين**:\n   - استخدم كيس ثلج لمدة 15 دقيقة بعد التمارين\n   - إذا شعرت بألم حاد، توقف عن التمارين لبضعة أيام\n\n🔥 **الحرارة قبل التمارين**:\n   - استخدم دش دافئ أو وسادة حرارية قبل التمارين\n   - يساعد على إرخاء العضلات";
            warnings = ["❌ تجنب الحركات المتكررة فوق الرأس", "❌ لا تحمل أوزاناً ثقيلة (أكثر من 2 كجم)", "❌ تجنب الأنشطة التي تزيد الألم", "⚠️ العلاج المبكر يمنع المزمنة"];
        } else if(primary.name.includes("تمزق")) {
            exercises = "🛏️ **الراحة النسبية مع تجنب الألم**:\n   - تجنب الحركات المؤلمة تماماً\n   - استمر في الحركات اليومية الخفيفة التي لا تسبب ألماً\n\n🏋️ **تمارين مدى حركة خفيفة (Pendulum)**:\n   - تمرين البندول فقط في المرحلة الحادة\n   - قف بجانب طاولة واتكأ عليها بذراعك السليم\n   - دع ذراعك المصابة تتدلى بحرية\n   - حرك الذراع في دوائر صغيرة 10 مرات\n   - كرر 3 مرات يومياً\n\n🏋️ **تمارين تقوية تحت إشراف متخصص**:\n   - يجب البدء تحت إشراف أخصائي علاج طبيعي\n   - تجنب التمارين الثقيلة في البداية\n   - تمارين تقوية الكفة المدورة فقط بعد شفاء الألم\n\n🚫 **تجنب الحركات المؤلمة**:\n   - لا تضغط على الكتف المصاب\n   - لا ترفع الذراع فوق الرأس\n   - لا تحمل أوزاناً ثقيلة\n\n⚠️ **تقييم طبي ضروري**:\n   - قد يتطلب تقييماً بالرنين المغناطيسي\n   - استشر طبيبك قبل البدء بأي تمارين تقوية";
            warnings = ["❌ لا تحمل أوزاناً ثقيلة", "❌ تجنب رفع الذراع فوق الرأس", "❌ لا تنام على الجانب المصاب", "⚠️ قد يتطلب تقييماً بالرنين المغناطيسي"];
        } else if(primary.name.includes("Frozen")) {
            exercises = "🔥 **الحرارة الرطبة قبل التمارين**:\n   - استخدم دش دافئ أو وسادة حرارية قبل التمارين\n   - مدة 10-15 دقيقة\n   - يساعد على إرخاء الكتف وتقليل الألم\n\n🏋️ **تمارين مدى حركة مكثفة (تحت إشراف)**:\n   - يجب البدء تحت إشراف أخصائي علاج طبيعي\n   - تمارين مدى حركة مكثفة ومتكررة\n   - تكرار التمارين عدة مرات يومياً\n\n🏋️ **تمارين إطالة الكتف**:\n   - إطالة للكتف الأمامي (Anterior Stretch)\n   - إطالة للكتف الخلفي (Posterior Stretch)\n   - إطالة للعضلات المحيطة بالكتف\n   - احتفظ بكل إطالة 30 ثانية\n   - كرر 3 مرات لكل إطالة\n\n🏋️ **تمارين تقوية تدريجية**:\n   - تقوية العضلات المحيطة بالكتف\n   - تقوية لوحي الكتف (Scapular Stabilizers)\n   - زيادة الشدة تدريجياً على مدة أسابيع\n\n🏋️ **تمارين المشي على الحائط**:\n   - استخدم أصابعك للمشي على الحائط للأعلى\n   - كرر عدة مرات يومياً\n   - يساعد على استعادة مدى الحركة";
            warnings = ["❌ لا تتجاهل التيبس - العلاج المكثف ضروري", "❌ تجنب الراحة الطويلة المفرطة", "⚠️ يستغرق الشفاء عدة أشهر"];
        } else {
            exercises = "🏋️ **تمارين إطالة خفيفة**:\n   - إطالة بسيطة للكتف\n   - حركات مدى حركة خفيفة\n\n❄️/🔥 **كمادات باردة/دافئة حسب الحالة**:\n   - باردة للالتهاب الحاد\n   - دافئة للتيبس المزمن\n\n🚫 **تجنب الأنشطة المؤلمة**:\n   - تجنب الحركات التي تزيد الألم";
            warnings = ["❌ لا تهمل الألم المتزايد", "❌ لا تعتمد فقط على المسكنات"];
        }
    } else if (jointId.includes('elbow')) {
        if(primary.name.includes("Tennis") || primary.name.includes("Golfer")) {
            // تعديل التمارين حسب مرحلة الألم
            if (painPhase === 'acute') {
                exercises = "🛏️ **الراحة النسبية في المرحلة الحادة**:\n   - تجنب الحركات المؤلمة تماماً\n   - استمر في الحركات اليومية الخفيفة التي لا تسبب ألماً\n   - لا توقف الحركة تماماً - الحركة الخفيفة تساعد على الشفاء\n\n❄️ **كمادات باردة متكررة**:\n   - استخدم كيس ثلج أو كمادة باردة\n   - لف الكيس بمنشفة رقيقة\n   - ضع الكمادة على الكوع لمدة 20 دقيقة\n   - كرر كل 2-3 ساعات\n\n🚫 **تجنب الأنشطة المؤلمة**:\n   - تجنب القبض القوي\n   - تجنب رفع الأوزان\n   - تجنب الحركات المتكررة\n\n🩹 **استخدام دعامة كعبية إذا لزم الأمر**:\n   - استخدم دعامة للكوع لتقليل الضغط على الوتر\n   - ارتدِ الدعامة أثناء النشاط الذي يسبب الألم";
                warnings = ["❌ تجنب الحركات المتكررة المؤلمة", "❌ لا تحمل أوزاناً ثقيلة (أكثر من 1 كجم)", "❌ تجنب القبض القوي المؤلم", "❌ لا تهمل العلاج - قد يصبح مزمناً", "⚠️ راجعنا إذا استمر الألم لأكثر من أسبوع"];
            } else if (painPhase === 'chronic') {
                exercises = "🏋️ **تمارين إطالة أوتار الكوع (Eccentric exercises)**:\n   - اجلس على كرسي بظهر مستقيم\n   - ضع ذراعك المصاب على طاولة\n   - اثنِ الكوع ببطء مع مقاومة (استخدم وزن خفيف 0.5-1 كجم)\n   - عد حتى 3 أثناء الانحناء\n   - ارجع للوضعية الأولية بسرعة (في ثانية واحدة)\n   - كرر 10-15 مرة\n   - زد التكرار تدريجياً إلى 20 ثم 25 مرة\n   - افعل هذا التمرين مرتين يومياً\n   - إذا شعرت بألم شديد، قلل الوزن أو التكرار\n\n🏋️ **تمارين تقوية عضلات الساعد تدريجياً**:\n   - ابدأ بأوزان خفيفة جداً (0.5 كجم)\n   - تمارين ثني الكوع ومد الذراع\n   - تمارين تدوير الذراع للداخل والخارج\n   - كرر 10 مرات لكل تمرين\n   - زد الوزن تدريجياً على مدة عدة أسابيع\n   - لا تتجاوز 2-3 كجم في البداية\n\n🏋️ **تمارين تقوية متقدمة**:\n   - تمارين تقوية العضلات المحيطة بالكوع\n   - زيادة الشدة تدريجياً على مدة أسابيع\n   - تمارين مقاومة متقدمة\n\n🩹 **استخدام دعامة كعبية إذا لزم الأمر**:\n   - استخدم دعامة للكوع لتقليل الضغط على الوتر\n   - ارتدِ الدعامة أثناء النشاط الذي يسبب الألم\n   - لا ترتدِها طوال اليوم - أرحِ الكوع بين الحين والآخر";
                warnings = ["❌ تجنب الحركات المتكررة المؤلمة", "❌ لا تحمل أوزاناً ثقيلة (أكثر من 3 كجم)", "❌ تجنب القبض القوي المؤلم", "❌ لا تهمل العلاج - قد يصبح مزمناً", "⚠️ العلاج المكثف ضروري للحالة المزمنة"];
            } else {
                exercises = "🏋️ **تمارين إطالة أوتار الكوع (Eccentric exercises)**:\n   - اجلس على كرسي بظهر مستقيم\n   - ضع ذراعك المصاب على طاولة\n   - اثنِ الكوع ببطء مع مقاومة (استخدم وزن خفيف 0.5-1 كجم)\n   - عد حتى 3 أثناء الانحناء\n   - ارجع للوضعية الأولية بسرعة (في ثانية واحدة)\n   - كرر 10-15 مرة\n   - زد التكرار تدريجياً إلى 20 ثم 25 مرة\n   - افعل هذا التمرين مرتين يومياً\n   - إذا شعرت بألم شديد، قلل الوزن أو التكرار\n\n🏋️ **تمارين تقوية عضلات الساعد تدريجياً**:\n   - ابدأ بأوزان خفيفة جداً (0.5 كجم)\n   - تمارين ثني الكوع ومد الذراع\n   - تمارين تدوير الذراع للداخل والخارج\n   - كرر 10 مرات لكل تمرين\n   - زد الوزن تدريجياً على مدة عدة أسابيع\n   - لا تتجاوز 2-3 كجم في البداية\n\n❄️ **كمادات باردة بعد النشاط**:\n   - استخدم كيس ثلج أو كمادة باردة\n   - لف الكيس بمنشفة رقيقة\n   - ضع الكمادة على الكوع لمدة 15 دقيقة\n   - كرر بعد كل نشاط يؤدي إلى ألم\n   - أفضل الأوقات: بعد التمارين وبعد العمل\n\n🩹 **استخدام دعامة كعبية إذا لزم الأمر**:\n   - استخدم دعامة للكوع لتقليل الضغط على الوتر\n   - ارتدِ الدعامة أثناء النشاط الذي يسبب الألم\n   - لا ترتدِها طوال اليوم - أرحِ الكوع بين الحين والآخر";
                warnings = ["❌ تجنب الحركات المتكررة المؤلمة", "❌ لا تحمل أوزاناً ثقيلة (أكثر من 3 كجم)", "❌ تجنب القبض القوي المؤلم", "❌ لا تهمل العلاج - قد يصبح مزمناً", "⚠️ العلاج المبكر يمنع المزمنة"];
            }
        } else if(primary.name.includes("النفق الكعبي")) {
            exercises = "🚫 **تجنب الضغط على الكوع**:\n   - تجنب الانحناء المطول للكوع\n   - استخدم وسادة للدعم\n\n🏋️ **تمارين إطالة خفيفة**:\n   - إطالة خفيفة للكوع\n   - حركات مدى حركة بسيطة\n\n🩹 **استخدام دعامة ليلية إذا لزم الأمر**:\n   - استخدم دعامة ليلية لتقليل الضغط";
            warnings = ["❌ لا تضغط على الكوع لفترات طويلة", "❌ تجنب الانحناء المطول للكوع", "⚠️ قد يتطلب تقييماً عصبياً"];
        } else {
            exercises = "🏋️ **تمارين إطالة خفيفة**:\n   - إطالة بسيطة للكوع\n   - حركات مدى حركة خفيفة\n\n❄️ **كمادات باردة**:\n   - ضع كيس ثلج لمدة 15 دقيقة\n\n🚫 **تجنب الأنشطة المؤلمة**:\n   - تجنب الحركات التي تزيد الألم";
            warnings = ["❌ لا تهمل الألم المتزايد"];
        }
    } else if (jointId.includes('wrist')) {
        if(primary.name.includes("النفق الرسغي")) {
            // تعديل التمارين حسب مرحلة الألم
            if (painPhase === 'acute') {
                exercises = "🛏️ **الراحة النسبية في المرحلة الحادة**:\n   - تجنب الحركات المؤلمة تماماً\n   - استمر في الحركات اليومية الخفيفة التي لا تسبب ألماً\n   - لا توقف الحركة تماماً - الحركة الخفيفة تساعد على الشفاء\n\n🩹 **استخدام دعامة ليلية**:\n   - استخدم دعامة ليلية للحفاظ على الرسغ في وضعية محايدة\n   - ارتدِ الدعامة أثناء النوم\n   - لا ترتدِها طوال اليوم - أرحِ الرسغ بين الحين والآخر\n\n❄️ **كمادات باردة متكررة**:\n   - استخدم كيس ثلج أو كمادة باردة\n   - لف الكيس بمنشفة رقيقة\n   - ضع الكمادة على الرسغ لمدة 20 دقيقة\n   - كرر كل 2-3 ساعات\n\n💻 **استراحات متكررة من الكمبيوتر**:\n   - خذ استراحة كل 30 دقيقة من العمل على الكمبيوتر\n   - قم بتمارين إطالة بسيطة لمدة 1-2 دقيقة\n   - حرك الرسغ في جميع الاتجاهات";
                warnings = ["❌ لا تستخدم الكمبيوتر لفترات طويلة بدون استراحة", "❌ تجنب الانحناء المطول للرسغ", "❌ لا تهمل الأعراض الليلية", "⚠️ راجعنا إذا استمر الألم لأكثر من أسبوع"];
            } else if (painPhase === 'chronic') {
                exercises = "🏋️ **تمارين إطالة الرسغ واليد**:\n   - اجلس على كرسي بظهر مستقيم\n   - ضع ذراعك المصاب على طاولة\n   - اثنِ الرسغ برفق للخلف باستخدام اليد الأخرى\n   - عد حتى 30 ببطء\n   - يجب أن تشعر بتمدد خفيف في الرسغ والساعد\n   - لا تتجاوز الألم\n   - كرر 3 مرات\n   - افعل هذا التمرين 3-4 مرات يومياً\n\n🏋️ **تمارين انحراف الرسغ**:\n   - اجلس على كرسي بظهر مستقيم\n   - ضع ذراعك المصاب على طاولة\n   - انحرف الرسغ لليمين باستخدام اليد الأخرى\n   - عد حتى 10\n   - انحرف الرسغ لليسار باستخدام اليد الأخرى\n   - عد حتى 10\n   - كرر 10 مرات في كل اتجاه\n   - افعل هذا التمرين 3 مرات يومياً\n\n🏋️ **تمارين تقوية الساعد**:\n   - تمارين تقوية عضلات الساعد\n   - زيادة الشدة تدريجياً على مدى أسابيع\n   - تمارين مقاومة متقدمة\n\n🩹 **استخدام دعامة ليلية**:\n   - استخدم دعامة ليلية للحفاظ على الرسغ في وضعية محايدة\n   - ارتدِ الدعامة أثناء النوم\n   - لا ترتدِها طوال اليوم - أرحِ الرسغ بين الحين والآخر\n\n💻 **استراحات متكررة من الكمبيوتر**:\n   - خذ استراحة كل 30 دقيقة من العمل على الكمبيوتر\n   - قم بتمارين إطالة بسيطة لمدة 1-2 دقيقة\n   - حرك الرسغ في جميع الاتجاهات\n   - افتح وأغلق يدك عدة مرات\n   - اضغط على أصابعك لفتحها ثم أرخِها";
                warnings = ["❌ لا تستخدم الكمبيوتر لفترات طويلة بدون استراحة", "❌ تجنب الانحناء المطول للرسغ", "❌ لا تهمل الأعراض الليلية", "⚠️ العلاج المكثف ضروري للحالة المزمنة"];
            } else {
                exercises = "🏋️ **تمارين إطالة الرسغ واليد**:\n   - اجلس على كرسي بظهر مستقيم\n   - ضع ذراعك المصاب على طاولة\n   - اثنِ الرسغ برفق للخلف باستخدام اليد الأخرى\n   - عد حتى 30 ببطء\n   - يجب أن تشعر بتمدد خفيف في الرسغ والساعد\n   - لا تتجاوز الألم\n   - كرر 3 مرات\n   - افعل هذا التمرين 3-4 مرات يومياً\n\n🏋️ **تمارين انحراف الرسغ**:\n   - اجلس على كرسي بظهر مستقيم\n   - ضع ذراعك المصاب على طاولة\n   - انحرف الرسغ لليمين باستخدام اليد الأخرى\n   - عد حتى 10\n   - انحرف الرسغ لليسار باستخدام اليد الأخرى\n   - عد حتى 10\n   - كرر 10 مرات في كل اتجاه\n   - افعل هذا التمرين 3 مرات يومياً\n\n🩹 **استخدام دعامة ليلية**:\n   - استخدم دعامة ليلية للحفاظ على الرسغ في وضعية محايدة\n   - ارتدِ الدعامة أثناء النوم\n   - لا ترتدِها طوال اليوم - أرحِ الرسغ بين الحين والآخر\n\n💻 **استراحات متكررة من الكمبيوتر**:\n   - خذ استراحة كل 30 دقيقة من العمل على الكمبيوتر\n   - قم بتمارين إطالة بسيطة لمدة 1-2 دقيقة\n   - حرك الرسغ في جميع الاتجاهات\n   - افتح وأغلق يدك عدة مرات\n   - اضغط على أصابعك لفتحها ثم أرخِها";
                warnings = ["❌ لا تستخدم الكمبيوتر لفترات طويلة بدون استراحة", "❌ تجنب الانحناء المطول للرسغ", "❌ لا تهمل الأعراض الليلية", "⚠️ قد يتطلب تدخلاً جراحياً إذا استمر لأكثر من 6 أشهر", "⚠️ العلاج المبكر يمنع المزمنة"];
            }
        } else if(primary.name.includes("دي كيرفان")) {
            exercises = "🏋️ **تمارين إطالة إبهام اليد**:\n   - اجلس على كرسي بظهر مستقيم\n   - ضع يدك المصابة على طاولة\n   - استخدم يدك الأخرى لسحب الإبهام برفق للخلف\n   - عد حتى 30 ببطء\n   - يجب أن تشعر بتمدد خفيف في قاعدة الإبهام\n   - لا تتجاوز الألم\n   - كرر 3 مرات\n   - افعل هذا التمرين 3 مرات يومياً\n\n🚫 **تجنب القبض القوي**:\n   - تجنب القبض القوي بالإبهام\n   - تجنب رفع الأشياء الثقيلة بالإبهام\n   - استخدم كامل اليد بدلاً من الإبهام فقط\n\n❄️ **كمادات باردة**:\n   - استخدم كيس ثلج أو كمادة باردة\n   - لف الكيس بمنشفة رقيقة\n   - ضع الكمادة على قاعدة الإبهام لمدة 15 دقيقة\n   - كرر 3-4 مرات يومياً\n\n🩹 **استخدام دعامة إذا لزم الأمر**:\n   - استخدم دعامة لتقليل الضغط على الوتر\n   - ارتدِ الدعامة أثناء النشاط الذي يسبب الألم";
            warnings = ["❌ لا تقبض بإحكام", "❌ تجنب رفع الأشياء الثقيلة بالإبهام", "❌ لا تستخدم الهاتف بكثرة بيد واحدة", "⚠️ العلاج المبكر يمنع المزمنة"];
        } else {
            exercises = "🏋️ **تمارين إطالة خفيفة**:\n   - إطالة بسيطة للرسغ\n   - حركات مدى حركة خفيفة\n\n❄️ **كمادات باردة**:\n   - ضع كيس ثلج لمدة 15 دقيقة\n\n🚫 **تجنب الأنشطة المؤلمة**:\n   - تجنب الحركات التي تزيد الألم";
            warnings = ["❌ لا تضغط على الكيس"];
        }
    } else if (jointId.includes('hip')) {
        if(primary.name.includes("خشونة")) {
            // تعديل التمارين حسب مرحلة الألم
            if (painPhase === 'acute') {
                exercises = "🛏️ **الراحة النسبية في المرحلة الحادة**:\n   - تجنب الحركات المؤلمة تماماً\n   - استمر في الحركات اليومية الخفيفة التي لا تسبب ألماً\n   - لا توقف الحركة تماماً - الحركة الخفيفة تساعد على الشفاء\n\n🏋️ **تمارين تقوية خفيفة جداً**:\n   - تمارين تقوية العضلة الرباعية فقط\n   - اضغط الركبة للأسفل وشدد الفخذ\n   - احتفظ بالوضعية 3 ثواني\n   - كرر 5 مرات فقط\n   - افعل هذا التمرين مرة واحدة يومياً\n\n❄️ **كمادات باردة متكررة**:\n   - استخدم كيس ثلج أو كمادة باردة\n   - لف الكيس بمنشفة رقيقة\n   - ضع الكمادة على الورك لمدة 20 دقيقة\n   - كرر كل 2-3 ساعات\n\n🚫 **تجنب الأنشطة المؤلمة**:\n   - تجنب المشي لمسافات طويلة\n   - تجنب صعود الدرج\n   - تجنب الجري";
                warnings = ["❌ تجنب الجري على الأسطح الصلبة", "❌ لا تجلس لفترات طويلة بوضعية سيئة", "❌ تجنب صعود الدرج بكثرة", bmi > 27 ? "⚠️ فقدان الوزن ضروري جداً لتقليل الضغط على المفصل" : "⚠️ الحفاظ على وزن صحي مهم لتقليل الضغط على المفصل", "⚠️ راجعنا إذا استمر الألم لأكثر من أسبوع"];
            } else if (painPhase === 'chronic') {
                exercises = "🏋️ **تمارين تقوية عضلات الفخذ والردف**:\n   - استلقِ على ظهرك\n   - اثنِ ركبة واحدة واضغطها للأسفل\n   - ارفع الساق المستقيمة 30 درجة\n   - احتفظ بالوضعية 3 ثواني\n   - أنزل ببطء\n   - كرر 10 مرات لكل ساق\n   - زد التكرار تدريجياً إلى 15 ثم 20 مرة\n   - افعل هذا التمرين مرتين يومياً\n\n🏋️ **تمارين مدى حركة الورك الخفيفة**:\n   - استلقِ على ظهرك\n   - اسحب ركبة واحدة نحو صدرك ببطء\n   - احتفظ بالوضعية 5 ثواني\n   - أنزل ببطء\n   - كرر 10 مرات لكل ساق\n   - لا تتجاوز الألم\n\n🚶 **المشي على سطح مستوٍ**:\n   - امشي 20-30 دقيقة يومياً\n   - على سطح مستوٍ (مثل حديقة أو ممر مشي)\n   - تجنب الأسطح المائلة أو غير المستقرة\n   - المشي المنتظم يقوي العضلات ويحسن المرونة\n\n🏊 **السباحة (المشي في الماء)**:\n   - المشي في الماء يقلل الضغط على المفاصل\n   - مدة 20-30 دقيقة\n   - الماء يوفر مقاومة خفيفة تقوي العضلات\n   - درجة حرارة الماء المثالية: 28-30 درجة مئوية\n\n🏋️ **تمارين إطالة خفيفة**:\n   - إطالة خفيفة للورك والفخذ\n   - إطالة عضلات الفخذ الأمامية والخلفية\n   - احتفظ بكل إطالة 30 ثانية\n   - كرر 3 مرات لكل إطالة\n\n🏋️ **تمارين تقوية متقدمة**:\n   - تمارين تقوية العضلات المحيطة بالورك\n   - زيادة الشدة تدريجياً على مدى أسابيع\n   - تمارين مقاومة متقدمة";
                warnings = ["❌ تجنب الجري على الأسطح الصلبة", "❌ لا تجلس لفترات طويلة بوضعية سيئة", "❌ تجنب صعود الدرج بكثرة", bmi > 27 ? "⚠️ فقدان الوزن ضروري جداً لتقليل الضغط على المفصل" : "⚠️ الحفاظ على وزن صحي مهم لتقليل الضغط على المفصل", "⚠️ العلاج المكثف ضروري للحالة المزمنة"];
            } else {
                exercises = "🏋️ **تمارين تقوية عضلات الفخذ والردف**:\n   - استلقِ على ظهرك\n   - اثنِ ركبة واحدة واضغطها للأسفل\n   - ارفع الساق المستقيمة 30 درجة\n   - احتفظ بالوضعية 3 ثواني\n   - أنزل ببطء\n   - كرر 10 مرات لكل ساق\n   - زد التكرار تدريجياً إلى 15 ثم 20 مرة\n   - افعل هذا التمرين مرتين يومياً\n\n🏋️ **تمارين مدى حركة الورك الخفيفة**:\n   - استلقِ على ظهرك\n   - اسحب ركبة واحدة نحو صدرك ببطء\n   - احتفظ بالوضعية 5 ثواني\n   - أنزل ببطء\n   - كرر 10 مرات لكل ساق\n   - لا تتجاوز الألم\n\n🚶 **المشي على سطح مستوٍ**:\n   - امشي 20-30 دقيقة يومياً\n   - على سطح مستوٍ (مثل حديقة أو ممر مشي)\n   - تجنب الأسطح المائلة أو غير المستقرة\n   - المشي المنتظم يقوي العضلات ويحسن المرونة\n\n🏊 **السباحة (المشي في الماء)**:\n   - المشي في الماء يقلل الضغط على المفاصل\n   - مدة 20-30 دقيقة\n   - الماء يوفر مقاومة خفيفة تقوي العضلات\n   - درجة حرارة الماء المثالية: 28-30 درجة مئوية\n\n🏋️ **تمارين إطالة خفيفة**:\n   - إطالة خفيفة للورك والفخذ\n   - إطالة عضلات الفخذ الأمامية والخلفية\n   - احتفظ بكل إطالة 30 ثانية\n   - كرر 3 مرات لكل إطالة";
                warnings = ["❌ تجنب الجري على الأسطح الصلبة", "❌ لا تجلس لفترات طويلة بوضعية سيئة", "❌ تجنب صعود الدرج بكثرة", bmi > 27 ? "⚠️ فقدان الوزن ضروري جداً لتقليل الضغط على المفصل" : "⚠️ الحفاظ على وزن صحي مهم لتقليل الضغط على المفصل", "⚠️ العلاج المبكر يبطئ تطور الخشونة"];
            }
        } else if(primary.name.includes("الجراب")) {
            exercises = "🏋️ **تمارين إطالة عضلات الورك الجانبية**:\n   - قف بجانب الحائط للدعم\n   - ضع يدك على الحائط\n   - انحنى للجانب حتى تشعر بتمدد في جانب الورك\n   - عد حتى 30 ببطء\n   - يجب أن تشعر بتمدد خفيف في عضلات الورك الجانبية\n   - لا تتجاوز الألم\n   - كرر 3 مرات لكل جانب\n   - افعل هذا التمرين 3 مرات يومياً\n\n❄️ **كمادات باردة**:\n   - استخدم كيس ثلج أو كمادة باردة\n   - لف الكيس بمنشفة رقيقة\n   - ضع الكمادة على جانب الورك لمدة 15 دقيقة\n   - كرر 3-4 مرات يومياً\n\n🛏️ **تجنب النوم على الجانب المصاب**:\n   - نم على الجانب السليم\n   - استخدم وسادة بين الساقين لتقليل الضغط";
            warnings = ["❌ لا تنم على الجانب المصاب", "❌ تجنب المشي لمسافات طويلة في المرحلة الحادة", "⚠️ العلاج المبكر يمنع المزمنة"];
        } else {
            exercises = "🏋️ **تمارين إطالة خفيفة**:\n   - إطالة خفيفة للورك\n   - حركات مدى حركة بسيطة\n\n🚫 **تجنب الأنشطة المؤلمة**:\n   - تجنب الحركات التي تزيد الألم";
            warnings = ["❌ لا تهمل الألم المتزايد"];
        }
    } else if (jointId.includes('knee')) {
        if(primary.name.includes("تمزق الغضروف")) {
            // تعديل التمارين حسب مرحلة الألم
            if (painPhase === 'acute') {
                exercises = "🛏️ **الراحة النسبية في المرحلة الحادة**:\n   - تجنب الحركات المؤلمة تماماً\n   - استمر في الحركات اليومية الخفيفة التي لا تسبب ألماً\n   - لا توقف الحركة تماماً - الحركة الخفيفة تساعد على الشفاء\n\n🏋️ **تمارين تقوية خفيفة جداً**:\n   - تمارين تقوية العضلة الرباعية فقط\n   - اضغط الركبة للأسفل وشدد الفخذ\n   - احتفظ بالوضعية 3 ثواني\n   - كرر 5 مرات فقط\n   - افعل هذا التمرين مرة واحدة يومياً\n\n❄️ **كمادات باردة متكررة**:\n   - استخدم كيس ثلج أو كمادة باردة\n   - لف الكيس بمنشفة رقيقة\n   - ضع الكمادة على الركبة لمدة 20 دقيقة\n   - كرر كل 2-3 ساعات\n\n🚫 **تجنب الأنشطة المؤلمة**:\n   - تجنب القرفصاء تماماً\n   - تجنب صعود الدرج\n   - تجنب الجري";
                warnings = ["❌ تجنب القرفصاء العميق", "❌ لا تدور الركبة وهي مثنية", "❌ تجنب صعود الدرج بكثرة", "❌ لا تهمل الانغلاق المفاجئ", "⚠️ راجعنا إذا استمر الألم لأكثر من أسبوع"];
            } else if (painPhase === 'chronic') {
                exercises = "🏋️ **تمارين تقوية العضلة الرباعية (Quad sets)**:\n   - اجلس على الأرض مع ركبة مثنية\n   - اضغط الركبة للأسفل وشدد الفخذ\n   - تخيل أنك تحاول سحب الرضفة للأعلى\n   - احتفظ بالوضعية 5 ثواني\n   - استرخِ لمدة 2 ثانية\n   - كرر 10 مرات\n   - زد التكرار تدريجياً إلى 15 ثم 20 مرة\n   - افعل هذا التمرين مرتين يومياً\n\n🏋️ **رفع الساق المستقيمة**:\n   - استلقِ على ظهرك\n   - اثنِ الركبة السليمة واضغطها للأسفل\n   - ارفع الساق المستقيمة المصابة 30 درجة\n   - احتفظ بالوضعية 3 ثواني\n   - أنزل ببطء\n   - كرر 10 مرات\n   - زد التكرار تدريجياً إلى 15 مرة\n   - افعل هذا التمرين مرتين يومياً\n\n🏋️ **تمارين مدى حركة خفيفة**:\n   - استلقِ على ظهرك\n   - اسحب الركبة المصابة نحو صدرك ببطء\n   - احتفظ بالوضعية 5 ثواني\n   - أنزل ببطء\n   - كرر 10 مرات\n   - لا تتجاوز الألم\n\n🏋️ **تمارين تقوية متقدمة**:\n   - تمارين تقوية العضلات المحيطة بالركبة\n   - زيادة الشدة تدريجياً على مدى أسابيع\n   - تمارين مقاومة متقدمة";
                warnings = ["❌ تجنب القرفصاء العميق", "❌ لا تدور الركبة وهي مثنية", "❌ تجنب صعود الدرج بكثرة", "❌ لا تهمل الانغلاق المفاجئ", "⚠️ العلاج المكثف ضروري للحالة المزمنة"];
            } else {
                exercises = "🏋️ **تمارين تقوية العضلة الرباعية (Quad sets)**:\n   - اجلس على الأرض مع ركبة مثنية\n   - اضغط الركبة للأسفل وشدد الفخذ\n   - تخيل أنك تحاول سحب الرضفة للأعلى\n   - احتفظ بالوضعية 5 ثواني\n   - استرخِ لمدة 2 ثانية\n   - كرر 10 مرات\n   - زد التكرار تدريجياً إلى 15 ثم 20 مرة\n   - افعل هذا التمرين مرتين يومياً\n\n🏋️ **رفع الساق المستقيمة**:\n   - استلقِ على ظهرك\n   - اثنِ الركبة السليمة واضغطها للأسفل\n   - ارفع الساق المستقيمة المصابة 30 درجة\n   - احتفظ بالوضعية 3 ثواني\n   - أنزل ببطء\n   - كرر 10 مرات\n   - زد التكرار تدريجياً إلى 15 مرة\n   - افعل هذا التمرين مرتين يومياً\n\n🏋️ **تمارين مدى حركة خفيفة**:\n   - استلقِ على ظهرك\n   - اسحب الركبة المصابة نحو صدرك ببطء\n   - احتفظ بالوضعية 5 ثواني\n   - أنزل ببطء\n   - كرر 10 مرات\n   - لا تتجاوز الألم\n\n🚫 **تجنب القرفصاء العميق**:\n   - لا تنزل تحت 90 درجة\n   - تجنب القرفصاء تماماً في المرحلة الحادة\n   - إذا كنت مضطراً للقرفصاء، استخدم كرسي";
                warnings = ["❌ تجنب القرفصاء العميق", "❌ لا تدور الركبة وهي مثنية", "❌ تجنب صعود الدرج بكثرة", "❌ لا تهمل الانغلاق المفاجئ", "⚠️ قد يتطلب تقييماً بالرنين المغناطيسي", "⚠️ العلاج المبكر يمنع تفاقم المشكلة"];
            }
        } else if(primary.name.includes("تتبع الصابونة")) {
            exercises = "🏋️ **تمارين تقوية العضلة الرباعية**:\n   - تمارين تقوية الفخذ\n   - كرر 10 مرات\n\n🏋️ **تمارين إطالة أوتار الركبة**:\n   - إطالة خفيفة للركبة\n   - احتفظ بالوضعية 30 ثانية\n\n🏋️ **تمارين تتبع الصابونة**:\n   - حرك الركبة في دوائر\n   - كرر 10 مرات في كل اتجاه\n\n🚶 **المشي على سطح مستوٍ**:\n   - امشي 20-30 دقيقة يومياً";
            warnings = ["❌ تجنب صعود الدرج بكثرة", "❌ لا تجلس لفترات طويلة مع ركبة مثنية", "❌ تجنب الجري على الأسطح المائلة"];
        } else if(primary.name.includes("خشونة")) {
            exercises = "🏋️ **تمارين تقوية العضلة الرباعية**:\n   - تمارين تقوية الفخذ\n   - كرر 10 مرات\n\n🚶 **المشي على سطح مستوٍ**:\n   - امشي 20-30 دقيقة يومياً\n\n🏊 **السباحة أو ركوب الدراجة الثابتة**:\n   - السباحة تقلل الضغط على المفاصل\n   - ركوب الدراجة الثابتة مفيد\n\n🏋️ **تمارين إطالة خفيفة**:\n   - إطالة خفيفة للركبة";
            warnings = ["❌ تجنب القرفصاء العميق", "❌ لا تجلس لفترات طويلة بوضعية سيئة", "❌ تجنب الجري على الأسطح الصلبة", bmi > 27 ? "⚠️ فقدان الوزن ضروري جداً" : ""];
        } else if(primary.name.includes("ألم الرضفة")) {
            exercises = "🏋️ **تمارين تقوية العضلة الرباعية**:\n   - تمارين تقوية الفخذ\n   - كرر 10 مرات\n\n🏋️ **تمارين إطالة أوتار الركبة**:\n   - إطالة خفيفة للركبة\n   - احتفظ بالوضعية 30 ثانية\n\n🏋️ **تمارين تتبع الصابونة**:\n   - حرك الركبة في دوائر\n   - كرر 10 مرات\n\n🚫 **تجنب النزول العميق**:\n   - لا تنزل تحت 90 درجة";
            warnings = ["❌ تجنب النزول العميق", "❌ لا تجلس لفترات طويلة مع ركبة مثنية"];
        } else if(primary.name.includes("أوزغود")) {
            exercises = "🏋️ **تمارين إطالة أوتار الركبة**:\n   - إطالة خفيفة للركبة\n   - احتفظ بالوضعية 30 ثانية\n\n🏋️ **تمارين تقوية خفيفة**:\n   - تمارين خفيفة للفخذ\n   - كرر 10 مرات\n\n🛏️ **الراحة النسبية من الرياضة العنيفة**:\n   - تجنب الرياضة العنيفة مؤقتاً";
            warnings = ["❌ لا تقفز أو تركض بقوة", "❌ تجنب القرفصاء العميق", "⚠️ يتحسن غالباً مع النضج"];
        } else {
            exercises = "🏋️ **تمارين إطالة خفيفة**:\n   - إطالة خفيفة للركبة\n   - حركات مدى حركة بسيطة\n\n🚫 **تجنب الأنشطة المؤلمة**:\n   - تجنب الحركات التي تزيد الألم";
            warnings = ["❌ لا تهمل الألم المتزايد"];
        }
    } else if (jointId.includes('ankle')) {
        if(primary.name.includes("التواء")) {
            exercises = "🏋️ **تمارين مدى حركة الكاحل**:\n   - اجلس على كرسي بظهر مستقيم\n   - ارفع الكاحل المصاب عن الأرض\n   - حرك الكاحل للأعلى (باتجاه الركبة)\n   - عد حتى 3\n   - حرك الكاحل للأسفل (باتجاه الأرض)\n   - عد حتى 3\n   - كرر 10 مرات في كل اتجاه\n   - حرك الكاحل في دوائر ببطء\n   - كرر 10 مرات في اتجاه عقارب الساعة\n   - كرر 10 مرات في عكس اتجاه عقارب الساعة\n   - افعل هذا التمرين 3 مرات يومياً\n\n🏋️ **تمارين تقوية عضلات الساق**:\n   - قف بجانب حائط للدعم\n   - ارفع الكعب عن الأرض على أطراف أصابع القدم\n   - عد حتى 3\n   - أنزل الكعب ببطء\n   - كرر 10 مرات\n   - زد التكرار تدريجياً إلى 15 ثم 20 مرة\n   - افعل هذا التمرين مرتين يومياً\n\n🚶 **المشي تدريجياً**:\n   - ابدأ بالمشي القصير (5-10 دقائق)\n   - زد المسافة تدريجياً كل يوم\n   - المشي على سطح مستوٍ\n   - تجنب الأسطح غير المستقرة\n\n🧘 **تمارين التوازن**:\n   - قف بجانب حائط للدعم\n   - قف على قدم واحدة (القدم السليمة أولاً)\n   - احتفظ بالتوازن 30 ثانية\n   - قف على قدم المصابة\n   - احتفظ بالتوازن 30 ثانية\n   - كرر 3 مرات لكل قدم\n   - زد الوقت تدريجياً إلى 60 ثانية";
            warnings = ["❌ لا تجري قبل الشفاء الكامل", "❌ تجنب الدوران المفاجئ", "❌ لا تهمل التأهيل العضلي", "⚠️ التأهيل السليم يمنع تكرار التواء الكاحل"];
        } else if(primary.name.includes("عدم استقرار")) {
            exercises = "🏋️ **تمارين تقوية عضلات الساق المكثفة**:\n   - قف بجانب حائط للدعم\n   - ارفع الكعب عن الأرض على أطراف أصابع القدم\n   - عد حتى 5\n   - أنزل الكعب ببطء\n   - كرر 15-20 مرة\n   - افعل هذا التمرين 3 مرات يومياً\n\n🧘 **تمارين التوازن المتقدمة**:\n   - قف على وسادة غير مستقرة\n   - حافظ على التوازن 30-60 ثانية\n   - كرر 3 مرات\n   - زد الصعوبة تدريجياً\n\n🏋️ **تمارين مدى حركة الكاحل**:\n   - حرك الكاحل في جميع الاتجاهات\n   - كرر 10 مرات في كل اتجاه\n\n🩹 **استخدام دعامة كاحلية إذا لزم الأمر**:\n   - استخدم دعامة للدعم أثناء النشاط";
            warnings = ["❌ تجنب الأنشطة غير المستقرة", "❌ لا تهمل التأهيل العضلي", "⚠️ قد يتطلب تقييماً متقدماً"];
        } else if(primary.name.includes("التهاب")) {
            exercises = "🏋️ **تمارين مدى حركة خفيفة**:\n   - اجلس على كرسي بظهر مستقيم\n   - حرك الكاحل للأعلى والأسفل برفق\n   - كرر 10 مرات\n   - حرك الكاحل في دوائر صغيرة\n   - كرر 5 مرات في كل اتجاه\n\n❄️ **كمادات باردة**:\n   - استخدم كيس ثلج أو كمادة باردة\n   - لف الكيس بمنشفة رقيقة\n   - ضع الكمادة على الكاحل لمدة 15 دقيقة\n   - كرر 3-4 مرات يومياً\n\n🛏️ **الراحة ورفع القدم**:\n   - استلقِ وارفع القدم فوق مستوى القلب\n   - استخدم وسادات للدعم\n   - افعل هذا عدة مرات يومياً\n\n🚫 **تجنب الأنشطة المؤلمة**:\n   - تجنب المشي لمسافات طويلة\n   - تجنب الوقوف لفترات طويلة";
            warnings = ["❌ لا تجري لمسافات طويلة", "❌ تجنب القفز", "❌ لا تقف لفترات طويلة", "⚠️ الراحة مهمة للشفاء"];
        } else if(primary.name.includes("تمزق")) {
            exercises = "🛏️ **الراحة النسبية**:\n   - تجنب الأنشطة المؤلمة تماماً\n   - استمر في الحركات اليومية الخفيفة\n\n🏋️ **تمارين مدى حركة خفيفة جداً**:\n   - حرك الكاحل برفق للأعلى والأسفل\n   - كرر 5 مرات فقط\n   - لا تتجاوز الألم\n\n❄️ **كمادات باردة**:\n   - استخدم كيس ثلج لمدة 15 دقيقة\n   - كرر 3-4 مرات يومياً\n\n🩹 **استخدام دعامة أو جبس إذا لزم الأمر**:\n   - استخدم دعامة لتثبيت الكاحل\n   - اتبع تعليمات الطبيب\n\n⚠️ **تقييم طبي ضروري**:\n   - قد يتطلب تقييماً بالرنين المغناطيسي\n   - استشر طبيبك قبل البدء بأي تمارين تقوية";
            warnings = ["❌ لا تحمل أوزاناً ثقيلة", "❌ تجنب المشي لمسافات طويلة", "❌ لا تجري أو تقفز", "⚠️ قد يتطلب تقييماً بالرنين المغناطيسي"];
        } else {
            exercises = "🏋️ **تمارين مدى حركة الكاحل**:\n   - اجلس على كرسي بظهر مستقيم\n   - حرك الكاحل للأعلى والأسفل\n   - كرر 10 مرات\n   - حرك الكاحل في دوائر\n   - كرر 10 مرات في كل اتجاه\n\n🏋️ **تمارين تقوية عضلات الساق**:\n   - قف بجانب حائط للدعم\n   - ارفع الكعب عن الأرض\n   - كرر 10 مرات\n\n🧘 **تمارين التوازن**:\n   - قف على قدم واحدة\n   - احتفظ بالتوازن 30 ثانية\n\n❄️ **كمادات باردة/دافئة**:\n   - باردة للالتهاب الحاد\n   - دافئة للتيبس المزمن";
            warnings = ["❌ لا تهمل الألم المتزايد", "❌ تجنب الأنشطة المؤلمة"];
        }
    } else if (jointId.includes('calf')) {
        if(primary.name.includes("إجهاد عضلة")) {
            exercises = "🏋️ **تمارين إطالة عضلات الساق**:\n   - قف بجانب حائط للدعم\n   - ضع قدمك المصابة خلف القدم السليمة\n   - اضغط الكعب للأسفل\n   - احتفظ بالركبة الخلفية مستقيمة\n   - يجب أن تشعر بتمدد في عضلة الساق الخلفية\n   - احتفظ بالوضعية 30 ثانية\n   - استرخِ لمدة 10 ثواني\n   - كرر 3 مرات\n   - افعل هذا التمرين 3-4 مرات يومياً\n\n🛏️ **الراحة النسبية**:\n   - تجنب الأنشطة المؤلمة تماماً\n   - استمر في الحركات اليومية الخفيفة التي لا تسبب ألماً\n   - لا توقف الحركة تماماً - الحركة الخفيفة تساعد على الشفاء\n\n🚶 **التدرج في العودة للنشاط**:\n   - ابدأ بالمشي الخفيف (5-10 دقائق)\n   - زد النشاط تدريجياً كل يوم\n   - إذا شعرت بألم، قلل النشاط فوراً\n   - لا تعود للجري أو القفز قبل الشفاء الكامل";
            warnings = ["❌ لا تجري قبل الشفاء", "❌ تجنب القفز المفاجئ", "⚠️ الإجهاد المتكرر يؤدي إلى إصابة مزمنة", "⚠️ العلاج المبكر يمنع المزمنة"];
        } else if(primary.name.includes("DVT")) {
            exercises = "🚨 **لا تقوم بأي تمارين - راجع الطوارئ فوراً**:\n   - هذه حالة خطيرة جداً\n   - تتطلب عناية طبية فورية";
            warnings = ["🚨 هذه حالة خطيرة - راجع الطوارئ فوراً", "🚨 لا تنتظر", "🚨 لا تضغط على الساق"];
        } else {
            exercises = "🏋️ **تمارين إطالة عضلات الساق**:\n   - قف بجانب حائط للدعم\n   - ضع قدمك المصابة خلف القدم السليمة\n   - اضغط الكعب للأسفل\n   - احتفظ بالركبة الخلفية مستقيمة\n   - يجب أن تشعر بتمدد في عضلة الساق الخلفية\n   - احتفظ بالوضعية 30 ثانية\n   - كرر 3 مرات\n\n🏋️ **تمارين تقوية خفيفة**:\n   - رفع الكعب عن الأرض\n   - كرر 10 مرات\n\n🛏️ **الراحة النسبية**:\n   - تجنب الأنشطة المؤلمة\n   - استمر في الحركة الخفيفة";
            warnings = ["❌ لا تهمل الألم المتزايد", "❌ تجنب الجري قبل الشفاء"];
        }
    } else if (jointId.includes('cervical') || jointId.includes('back-cervical')) {
        if(primary.name.includes("انزلاق غضروفي")) {
            exercises = "🏋️ **تمارين إطالة الرقبة الخفيفة**:\n   - اجلس على كرسي بظهر مستقيم\n   - ضع يدك على رأسك من الجانب\n   - اسحب رأسك برفق نحو كتفك\n   - عد حتى 30 ببطء\n   - يجب أن تشعر بتمدد خفيف في جانب الرقبة\n   - لا تتجاوز الألم\n   - كرر 3 مرات لكل جانب\n   - افعل هذا التمرين 3 مرات يومياً\n\n🏋️ **تمارين تقوية عضلات الرقبة**:\n   - اجلس على كرسي بظهر مستقيم\n   - ضع يدك على جبهتك\n   - ادفع رأسك برفق نحو الأمام\n   - استخدم عضلات رقبتك للمقاومة\n   - عد حتى 5\n   - استرخِ لمدة 2 ثانية\n   - كرر 10 مرات\n   - افعل نفس التمرين لكل اتجاه (الخلف، اليمين، اليسار)\n\n🧘 **تصحيح الوضعية**:\n   - اجلس بوضعية صحيحة\n   - ضبط ارتفاع الشاشة على مستوى العين\n   - استخدم كرسي مريح مع دعم للظهر\n   - خذ استراحة كل 30 دقيقة من العمل\n\n🚫 **تجنب الحركات المؤلمة**:\n   - تجنب الحركات المفاجئة أو السريعة\n   - لا تميل رقبتك فجأة\n   - تجنب حمل الأوزان الثقيلة";
            warnings = ["❌ لا تميل رقبتك فجأة", "❌ تجنب حمل الأوزان الثقيلة", "❌ لا تهمل التنميل أو الضعف", "⚠️ قد يتطلب تقييماً بالرنين المغناطيسي", "⚠️ إذا شعرت بضعف في الذراع، راجعنا فوراً"];
        } else if(primary.name.includes("تشنج عضلي")) {
            exercises = "🔥 **كمادات دافئة قبل التمارين**:\n   - استخدم وسادة حرارية أو دش دافئ\n   - مدة 10-15 دقيقة\n   - يساعد على إرخاء العضلات المتشنجة\n\n🏋️ **تمرين إطالة الرقبة الجانبية (Lateral Neck Stretch)**:\n   - اجلس على كرسي بظهر مستقيم\n   - ضع يدك اليمنى على رأسك من الجانب الأيمن\n   - اسحب رأسك برفق نحو كتفك الأيمن\n   - يجب أن تشعر بتمدد خفيف في جانب الرقبة الأيسر\n   - احتفظ بالوضعية 20-30 ثانية\n   - لا تتجاوز الألم\n   - كرر 3 مرات لكل جانب\n   - افعل هذا التمرين 3 مرات يومياً\n\n🏋️ **تمرين إطالة الرقبة الأمامية (Front Neck Stretch)**:\n   - اجلس على كرسي بظهر مستقيم\n   - ضع يديك خلف رأسك\n   - اسحب رأسك برفق للخلف\n   - يجب أن تشعر بتمدد في عضلات الرقبة الأمامية\n   - احتفظ بالوضعية 10-15 ثانية\n   - لا تتجاوز الألم\n   - كرر 3 مرات\n\n🏋️ **تمرين تقوية عضلات الرقبة (Neck Isometric Exercises)**:\n   - اجلس على كرسي بظهر مستقيم\n   - ضع يدك اليمنى على جبهتك\n   - ادفع رأسك برفق نحو الأمام\n   - استخدم عضلات رقبتك للمقاومة (لا تحرك رأسك)\n   - احتفظ بالوضعية 5 ثواني\n   - استرخِ لمدة 2 ثانية\n   - كرر 10 مرات\n   - افعل نفس التمرين لكل اتجاه (الخلف، اليمين، اليسار)\n\n🧘 **تمرين الاسترخاء العضلي (Progressive Muscle Relaxation)**:\n   - اجلس على كرسي بظهر مستقيم\n   - أرخِ كتفيك ببطء مع التنفس العميق\n   - أرخِ رقبتك ببطء مع التنفس العميق\n   - تنفس بعمق وبطيء لمدة دقيقة\n   - كرر 5 مرات\n\n🧘 **تصحيح الوضعية أثناء العمل**:\n   - اجلس بوضعية صحيحة مع ظهر مستقيم\n   - استخدم كرسي مريح مع دعم للظهر\n   - ضبط ارتفاع الشاشة على مستوى العين\n   - خذ استراحة كل 30 دقيقة للوقوف والمشي";
            warnings = ["❌ تجنب الجلوس الطويل دون استراحة", "❌ لا تستخدم الهاتف لفترات طويلة", "❌ لا تجلس أمام الكمبيوتر بوضعية سيئة", "❌ تجنب إمالة الرقبة فجأة", "⚠️ الحرارة قبل التمارين تساعد على إرخاء العضلات"];
        } else if(primary.name.includes("الوضضعي")) {
            exercises = "🧘 **تصحيح بيئة العمل (Ergonomic Setup)**:\n   - ضبط ارتفاع الشاشة على مستوى العين\n   - ضبط ارتفاع الكرسي بحيث تكون القدمين على الأرض\n   - استخدم دعم للظهر للحفاظ على الوضعية الصحيحة\n   - ضبط ارتفاع لوحة المفاتيح بحيث تكون المرفقين بزاوية 90 درجة\n\n⏰ **استراحات منتظمة كل 30 دقيقة**:\n   - خذ استراحة كل 30 دقيقة\n   - قم بتمارين إطالة بسيطة لمدة دقيقة\n   - قف وامشي لمدة دقيقة\n\n🏋️ **تمرين إطالة الرقبة الجانبية (Lateral Neck Stretch)**:\n   - اجلس على كرسي بظهر مستقيم\n   - ضع يدك اليمنى على رأسك من الجانب الأيمن\n   - اسحب رأسك برفق نحو كتفك الأيمن\n   - يجب أن تشعر بتمدد خفيف في جانب الرقبة الأيسر\n   - احتفظ بالوضعية 20-30 ثانية\n   - كرر 3 مرات لكل جانب\n\n🏋️ **تمرين إطالة الكتفين والصدر (Shoulder and Chest Stretch)**:\n   - اجلس على كرسي بظهر مستقيم\n   - ضع يديك خلف رأسك مع تلامس الأصابع\n   - اسحب لوح الكتف للخلف واضغطه للأسفل\n   - يجب أن تشعر بتمدد في الصدر والكتفين\n   - احتفظ بالوضعية 10 ثواني\n   - كرر 3 مرات\n\n🖥️ **ضبط ارتفاع الشاشة**:\n   - يجب أن تكون الشاشة على مستوى العين\n   - المسافة بين العين والشاشة: 50-70 سم\n   - قمة الشاشة على مستوى العين أو أقل بقليل";
            warnings = ["❌ لا تجلس لفترات طويلة دون استراحة", "❌ لا تنحنى أمام الكمبيوتر", "❌ لا تستخدم الهاتف في السرير", "❌ تجنب إمالة الرقبة للأمام لفترات طويلة", "⚠️ الوضعية الصحيحة تمنع المشاكل المزمنة"];
        } else {
            exercises = "🏋️ **تمارين إطالة الرقبة الخفيفة**:\n   - اجلس على كرسي بظهر مستقيم\n   - ضع يدك على رأسك من الجانب\n   - اسحب رأسك برفق نحو كتفك\n   - عد حتى 30 ببطء\n   - كرر 3 مرات لكل جانب\n\n🏋️ **تمارين تقوية عضلات الرقبة**:\n   - اجلس على كرسي بظهر مستقيم\n   - ضع يدك على جبهتك\n   - ادفع رأسك برفق نحو الأمام\n   - استخدم عضلات رقبتك للمقاومة\n   - عد حتى 5\n   - كرر 10 مرات\n\n🧘 **تصحيح الوضعية**:\n   - اجلس بوضعية صحيحة\n   - استخدم كرسي مريح مع دعم للظهر\n   - ضبط ارتفاع الشاشة على مستوى العين\n   - خذ استراحة كل 30 دقيقة";
            warnings = ["❌ لا تهمل الألم المتزايد", "❌ تجنب الجلوس الطويل دون استراحة"];
        }
    } else if (jointId.includes('thoracic') || jointId.includes('back-thoracic')) {
        exercises = "🏋️ **تمرين إطالة الصدر أمام الحائط (Chest Stretch)**:\n   - قف أمام الحائط على مسافة ذراع واحد\n   - ضع يدك اليمنى على الحائط بارتفاع الكتف\n   - قم بتدوير جسمك للجهة اليسرى ببطء\n   - يجب أن تشعر بتمدد في عضلات الصدر الأمامية اليمنى\n   - احتفظ بالوضعية 30 ثانية\n   - تنفس بعمق وبطيء\n   - كرر 3 مرات لكل جانب\n\n🏋️ **تمرين إطالة منتصف الظهر بالكرسي (Seated Thoracic Extension)**:\n   - اجلس على كرسي بظهر مستقيم\n   - ضع يديك خلف رأسك مع تلامس الأصابع\n   - انحنى للخلف ببطء مع دفع صدرك للأمام\n   - يجب أن تشعر بتمدد في منتصف الظهر (المنطقة بين الكتفين)\n   - احتفظ بالوضعية 5-10 ثواني\n   - لا تتجاوز الألم\n   - كرر 10 مرات\n   - افعل هذا التمرين مرتين يومياً\n\n🏋️ **تمرين إطالة العمود الفقري بالكرة (Cat-Cow Stretch)**:\n   - انزل على الأربع (ركبتين ويديك على الأرض)\n   - اجعل ظهرك مستقيماً مثل الطاولة\n   - انحنى ظهرك للأعلى ببطء (مثل القطة الغاضبة)\n   - ارفع رأسك للأمام\n   - ثم انحنى ظهرك للأسفل ببطء\n   - اخفض رأسك للأسفل\n   - كرر هذه الحركة 10 مرات\n   - افعل هذا التمرين مرتين يومياً\n\n🧘 **تصحيح الوضعية أثناء الجلوس**:\n   - اجلس بوضعية صحيحة مع ظهر مستقيم\n   - استخدم كرسي مريح مع دعم للظهر\n   - ضبط ارتفاع الشاشة على مستوى العين\n   - خذ استراحة كل 30 دقيقة للوقوف والمشي\n\n🏋️ **تمرين تقوية عضلات الوسط (Prone Extension)**:\n   - استلقِ على بطنك على سجادة\n   - ضع يديك تحت كتفيك\n   - ارفع صدرك عن الأرض ببطء\n   - يجب أن تشعر بتقوية عضلات الوسط\n   - احتفظ بالوضعية 3 ثواني\n   - أنزل ببطء\n   - كرر 10 مرات\n   - زد التكرار تدريجياً إلى 15 مرة";
        warnings = ["❌ لا تجلس لفترات طويلة بوضعية منحنية", "❌ لا تحمل أوزاناً ثقيلة على كتف واحد", "❌ تجنب النوم على بطنك", "⚠️ الوضعية الصحيحة تمنع المشاكل المزمنة"];
    } else if (jointId.includes('lumbar') || jointId.includes('back-lumbar')) {
        if(primary.name.includes("انزلاق غضروفي")) {
            exercises = "🏋️ **تمارين ويليامز (Williams flexion exercises)**:\n   - استلقِ على ظهرك\n   - اثنِ ركبتيك واسحبهما نحو صدرك ببطء\n   - استخدم يديك لسحب الركبتين برفق\n   - عد حتى 5\n   - يجب أن تشعر بتمدد خفيف في أسفل الظهر\n   - لا تتجاوز الألم\n   - أنزل ببطء\n   - كرر 10 مرات\n   - افعل هذا التمرين مرتين يومياً\n\n🚶 **المشي الخفيف**:\n   - امشي 20-30 دقيقة يومياً\n   - المشي على سطح مستوٍ\n   - المشي المنتظم يقوي عضلات الظهر\n\n🚫 **تجنب الانحناء**:\n   - تجنب الانحناء للخلف (تمديد العمود الفقري)\n   - تجنب الحركات التي تزيد الألم\n\n🏋️ **تمارين تقوية عضلات البطن**:\n   - استلقِ على ظهرك\n   - اثنِ ركبتيك\n   - ارفع رأسك والكتفين ببطء\n   - عد حتى 3\n   - أنزل ببطء\n   - كرر 10 مرات\n   - زد التكرار تدريجياً إلى 15 مرة";
            warnings = ["❌ لا تجلس لفترات طويلة بوضعية منحنية", "❌ تجنب رفع الأشياء الثقيلة", "❌ لا تقم بحركات التواء مفاجئة", "❌ لا تنحنى مع دوران الجذع", "⚠️ قد يتطلب تقييماً بالرنين المغناطيسي", "⚠️ إذا شعرت بضعف في الساق، راجعنا فوراً"];
        } else if(primary.name.includes("تضيق القناة")) {
            exercises = "🚶 **المشي مع انحناء خفيف للأمام (Forward Leaning Walk)**:\n   - امشي مع انحناء خفيف للأمام (مثل دفع عربة تسوق)\n   - مدة 20-30 دقيقة\n   - المشي على سطح مستوٍ\n   - هذا الوضع يفتح القناة الشوكية ويقلل الضغط\n\n🏋️ **تمرين إطالة أسفل الظهر بالاستلقاء (Supine Lumbar Stretch)**:\n   - استلقِ على ظهرك على سجادة\n   - اثنِ ركبة واحدة واسحبها نحو صدرك ببطء\n   - يجب أن تشعر بتمدد في أسفل الظهر\n   - احتفظ بالوضعية 20-30 ثانية\n   - كرر 3 مرات لكل ساق\n   - افعل هذا التمرين مرتين يومياً\n\n🏋️ **تمرين إطالة الركبة للصدر (Knee-to-Chest Stretch)**:\n   - استلقِ على ظهرك\n   - اثنِ ركبتيك واسحبهما معاً نحو صدرك ببطء\n   - استخدم يديك لسحب الركبتين برفق\n   - يجب أن تشعر بتمدد في أسفل الظهر\n   - احتفظ بالوضعية 20-30 ثانية\n   - كرر 3 مرات\n   - افعل هذا التمرين مرتين يومياً\n\n🚫 **تجنب الجلوس الطويل**:\n   - خذ استراحات متكررة كل 20 دقيقة\n   - قم وامشي لمدة دقيقة أو دقيقتين";
            warnings = ["❌ لا تجلس لفترات طويلة", "❌ تجنب المشي لمسافات طويلة بوضعية مستقيمة", "❌ لا تميل للخلف", "⚠️ المشي مع انحناء للأمام يفتح القناة الشوكية"];
        } else if(primary.name.includes("تشنج عضلي")) {
            exercises = "🔥 **كمادات دافئة قبل التمارين**:\n   - استخدم وسادة حرارية أو دش دافئ\n   - مدة 10-15 دقيقة\n   - يساعد على إرخاء العضلات المتشنجة\n\n🏋️ **تمرين إطالة أسفل الظهر بالاستلقاء (Supine Lumbar Stretch)**:\n   - استلقِ على ظهرك على سجادة\n   - اثنِ ركبة واحدة واسحبها نحو صدرك ببطء\n   - يجب أن تشعر بتمدد في أسفل الظهر\n   - احتفظ بالوضعية 20-30 ثانية\n   - كرر 3 مرات لكل ساق\n   - افعل هذا التمرين مرتين يومياً\n\n🏋️ **تمرين إطالة الركبة للصدر (Knee-to-Chest Stretch)**:\n   - استلقِ على ظهرك\n   - اثنِ ركبتيك واسحبهما معاً نحو صدرك ببطء\n   - استخدم يديك لسحب الركبتين برفق\n   - يجب أن تشعر بتمدد في أسفل الظهر\n   - احتفظ بالوضعية 20-30 ثانية\n   - كرر 3 مرات\n   - افعل هذا التمرين مرتين يومياً\n\n🚶 **المشي الخفيف**:\n   - امشي 20-30 دقيقة يومياً\n   - المشي على سطح مستوٍ\n   - المشي المنتظم يساعد على إرخاء العضلات\n\n🏋️ **تمرين تقوية عضلات البطن (Abdominal Bracing)**:\n   - استلقِ على ظهرك\n   - اثنِ ركبتيك\n   - شد عضلات بطنك للداخل (مثل سحب السرة للداخل)\n   - احتفظ بالوضعية 5-10 ثواني\n   - استرخِ لمدة 5 ثواني\n   - كرر 10 مرات\n   - افعل هذا التمرين مرتين يومياً";
            warnings = ["❌ لا تجلس لفترات طويلة بوضعية منحنية", "❌ تجنب رفع الأشياء الثقيلة", "❌ لا تقم بحركات التواء مفاجئة", "⚠️ الحرارة قبل التمارين تساعد على إرخاء العضلات"];
        } else {
            exercises = "🏋️ **تمرين إطالة أسفل الظهر بالاستلقاء (Supine Lumbar Stretch)**:\n   - استلقِ على ظهرك على سجادة\n   - اثنِ ركبة واحدة واسحبها نحو صدرك ببطء\n   - يجب أن تشعر بتمدد في أسفل الظهر\n   - احتفظ بالوضعية 20-30 ثانية\n   - كرر 3 مرات لكل ساق\n   - افعل هذا التمرين مرتين يومياً\n\n🏋️ **تمرين إطالة الركبة للصدر (Knee-to-Chest Stretch)**:\n   - استلقِ على ظهرك\n   - اثنِ ركبتيك واسحبهما معاً نحو صدرك ببطء\n   - استخدم يديك لسحب الركبتين برفق\n   - يجب أن تشعر بتمدد في أسفل الظهر\n   - احتفظ بالوضعية 20-30 ثانية\n   - كرر 3 مرات\n   - افعل هذا التمرين مرتين يومياً\n\n🚶 **المشي الخفيف**:\n   - امشي 20-30 دقيقة يومياً\n   - المشي على سطح مستوٍ\n\n🚫 **تجنب الأنشطة المؤلمة**:\n   - تجنب الحركات التي تزيد الألم\n   - تجنب رفع الأشياء الثقيلة";
            warnings = ["❌ لا تهمل الألم المتزايد", "❌ تجنب رفع الأشياء الثقيلة"];
        }
    } else if (jointId.includes('coccyx')) {
        exercises = "🪑 **استخدام وسادة ناعمة عند الجلوس**:\n   - استخدم وسادة ناعمة أو كرسي مريح\n   - تجنب الأسطح الصلبة تماماً\n   - استخدم كرسي بفتحة في المنتصف إذا توفر\n\n🚫 **تجنب الجلوس الطويل**:\n   - خذ استراحات متكررة كل 20-30 دقيقة\n   - قم وامشي لمدة دقيقة أو دقيقتين\n   - لا تجلس في نفس الوضعية لفترات طويلة\n\n🔥 **كمادات دافئة**:\n   - استخدم الحرارة لتخفيف الألم\n   - استخدم وسادة دافئة أو حمام دافئ\n   - مدة 15-20 دقيقة\n   - افعل هذا قبل النوم\n\n🛏️ **تجنب النوم على الظهر**:\n   - نم على جانبك\n   - استخدم وسادة بين الساقين\n   - هذا يقلل الضغط على العصعص";
        warnings = ["❌ لا تجلس على أسطح صلبة", "❌ تجنب الجلوس لفترات طويلة", "❌ لا تنام على ظهرك في المرحلة الحادة", "⚠️ العصعص يستغرق وقتاً طويلاً للشفاء"];
    } else if (jointId.includes('neck-muscles') || jointId.includes('back-neck-muscles') || jointId.includes('back-neck-muscles-r') || jointId.includes('back-neck-muscles-l')) {
        exercises = "🏋️ **تمرين إطالة الرقبة الجانبية (Lateral Neck Stretch)**:\n   - اجلس على كرسي بظهر مستقيم\n   - ضع يدك اليمنى على رأسك من الجانب الأيمن\n   - اسحب رأسك برفق نحو كتفك الأيمن\n   - يجب أن تشعر بتمدد خفيف في جانب الرقبة الأيسر\n   - احتفظ بالوضعية 20-30 ثانية\n   - لا تتجاوز الألم\n   - كرر 3 مرات لكل جانب\n   - افعل هذا التمرين 3 مرات يومياً\n\n🏋️ **تمرين إطالة الرقبة الأمامية (Front Neck Stretch)**:\n   - اجلس على كرسي بظهر مستقيم\n   - ضع يديك خلف رأسك\n   - اسحب رأسك برفق للخلف\n   - يجب أن تشعر بتمدد في عضلات الرقبة الأمامية\n   - احتفظ بالوضعية 10-15 ثانية\n   - لا تتجاوز الألم\n   - كرر 3 مرات\n   - افعل هذا التمرين 3 مرات يومياً\n\n🏋️ **تمرين إطالة الرقبة بالدوران (Neck Rotation)**:\n   - اجلس على كرسي بظهر مستقيم\n   - أدر رأسك ببطء لليمين حتى تصل للحدود الطبيعية\n   - احتفظ بالوضعية 10 ثواني\n   - أدر رأسك ببطء لليسار حتى تصل للحدود الطبيعية\n   - احتفظ بالوضعية 10 ثواني\n   - كرر 3 مرات لكل جانب\n   - افعل هذا التمرين 3 مرات يومياً\n\n🧘 **تمرين الاسترخاء العضلي (Progressive Muscle Relaxation)**:\n   - اجلس على كرسي بظهر مستقيم\n   - أرخِ كتفيك ببطء مع التنفس العميق\n   - أرخِ رقبتك ببطء مع التنفس العميق\n   - تنفس بعمق وبطيء لمدة دقيقة\n   - كرر 5 مرات\n\n🧘 **تصحيح الوضعية أثناء العمل**:\n   - اجلس بوضعية صحيحة مع ظهر مستقيم\n   - استخدم كرسي مريح مع دعم للظهر\n   - ضبط ارتفاع الشاشة على مستوى العين\n   - خذ استراحة كل 30 دقيقة للوقوف والمشي";
        warnings = ["❌ لا تجلس لفترات طويلة دون استراحة", "❌ لا تضغط على الرقبة بالهاتف لفترات طويلة", "❌ لا تنام على بطنك", "❌ تجنب إمالة الرقبة فجأة", "⚠️ الوضعية الصحيحة تمنع المشاكل المزمنة"];
    } else if (jointId.includes('scapula') || jointId.includes('back-scapula')) {
        exercises = "🏋️ **تمرين إطالة الصدر أمام الحائط (Wall Chest Stretch)**:\n   - قف أمام الحائط على مسافة ذراع واحد\n   - ضع يدك اليمنى على الحائط بارتفاع الكتف\n   - قم بتدوير جسمك للجهة اليسرى ببطء\n   - يجب أن تشعر بتمدد في عضلات الصدر الأمامية اليمنى\n   - احتفظ بالوضعية 30 ثانية\n   - تنفس بعمق وبطيء\n   - كرر 3 مرات لكل جانب\n\n🏋️ **تمرين إطالة الصدر بالباب (Doorway Stretch)**:\n   - قف في باب مفتوح\n   - ضع يديك على إطار الباب بارتفاع الكتف\n   - انحنى للأمام ببطء حتى تشعر بتمدد في الصدر\n   - احتفظ بالوضعية 30 ثانية\n   - تنفس بعمق وبطيء\n   - كرر 3 مرات\n\n🏋️ **تمرين تقوية عضلات الكتف الخلفية (Scapular Retraction)**:\n   - اجلس على كرسي بظهر مستقيم\n   - ضع يديك خلف رأسك مع تلامس الأصابع\n   - اسحب لوح الكتف للخلف واضغطه للأسفل\n   - تخيل أنك تحاول جعل لوح الكتف يلمس كرسيك\n   - احتفظ بالوضعية 5 ثواني\n   - استرخِ لمدة 2 ثانية\n   - كرر 10 مرات\n   - زد التكرار تدريجياً إلى 15 مرة\n   - افعل هذا التمرين مرتين يومياً\n\n🏋️ **تمرين تقوية عضلات الكتف (Wall Angels)**:\n   - قف مع ظهرك على الحائط\n   - ضع يديك على الحائط بارتفاع الكتف\n   - حرك يديك للأعلى والأسفل ببطء مثل الملائكة\n   - حافظ على ظهرك ملاصقاً للحائط\n   - كرر 10 مرات\n   - افعل هذا التمرين مرتين يومياً\n\n🧘 **تصحيح الوضعية أثناء العمل**:\n   - اجلس بوضعية صحيحة مع ظهر مستقيم\n   - استخدم كرسي مريح مع دعم للظهر\n   - لا تنحنى للأمام أثناء العمل\n   - خذ استراحة كل 30 دقيقة للوقوف والمشي";
        warnings = ["❌ لا تجلس بوضعية منحنية", "❌ لا تحمل حقيبة ثقيلة على كتف واحد", "❌ تجنب الحركات المتكررة فوق الرأس", "❌ تجنب النوم على بطنك", "⚠️ الوضعية الصحيحة تمنع المشاكل المزمنة"];
    } else if (jointId.includes('gluteus')) {
        if(primary.name.includes("الكمثري")) {
            exercises = "🏋️ **تمرين إطالة عضلة الكمثري (Piriformis Stretch)**:\n   - استلقِ على ظهرك على سجادة\n   - اثنِ ركبة اليمنى واسحبها نحو صدرك ببطء\n   - ثم اسحبها نحو كتفك الأيسر ببطء\n   - يجب أن تشعر بتمدد عميق في الأرداف اليمنى\n   - احتفظ بالوضعية 30 ثانية\n   - تنفس بعمق وبطيء\n   - كرر 3 مرات لكل ساق\n   - افعل هذا التمرين مرتين يومياً\n\n🏋️ **تمرين إطالة الأرداف بالجلوس (Seated Gluteal Stretch)**:\n   - اجلس على كرسي بظهر مستقيم\n   - ضع ركبة اليمنى فوق ركبة اليسرى\n   - انحنى للأمام ببطء مع الحفاظ على الظهر مستقيماً\n   - يجب أن تشعر بتمدد في الأرداف اليمنى\n   - احتفظ بالوضعية 30 ثانية\n   - كرر 3 مرات لكل جانب\n\n🏋️ **تمرين تقوية عضلات الأرداف الجانبية (Side-Lying Leg Lift)**:\n   - استلقِ على جانبك الأيسر\n   - ارفع الساق اليمنى ببطء للأعلى\n   - يجب أن تشعر بتقوية في الأرداف الجانبية\n   - احتفظ بالوضعية 3 ثواني\n   - أنزل ببطء\n   - كرر 10 مرات لكل ساق\n   - زد التكرار تدريجياً إلى 15 مرة\n   - افعل هذا التمرين مرتين يومياً\n\n🏋️ **تمرين إطالة أوتار الركبة (Hamstring Stretch)**:\n   - قف بجانب حائط للدعم\n   - ضع قدمك اليمنى خلف القدم اليسرى\n   - اضغط الكعب اليمنى للأسفل\n   - احتفظ بالركبة اليمنى مستقيمة\n   - يجب أن تشعر بتمدد في أوتار الركبة الخلفية\n   - احتفظ بالوضعية 30 ثانية\n   - كرر 3 مرات لكل ساق";
            warnings = ["❌ لا تجلس لفترات طويلة", "❌ تجنب الجري لمسافات طويلة", "❌ تجنب الجلوس على أسطح صلبة", "❌ لا تجلس مع رجل واحدة فوق الأخرى لفترات طويلة", "⚠️ العلاج المبكر يمنع المزمنة"];
        } else {
            exercises = "🏋️ **تمرين إطالة عضلات الأرداف (Gluteal Stretch)**:\n   - استلقِ على ظهرك على سجادة\n   - اثنِ ركبة اليمنى واسحبها نحو صدرك ببطء\n   - ثم اسحبها نحو كتفك الأيسر ببطء\n   - يجب أن تشعر بتمدد في الأرداف اليمنى\n   - احتفظ بالوضعية 30 ثانية\n   - كرر 3 مرات لكل ساق\n   - افعل هذا التمرين مرتين يومياً\n\n🏋️ **تمرين تقوية عضلات الأرداف الجانبية (Side-Lying Leg Lift)**:\n   - استلقِ على جانبك الأيسر\n   - ارفع الساق اليمنى ببطء للأعلى\n   - يجب أن تشعر بتقوية في الأرداف الجانبية\n   - احتفظ بالوضعية 3 ثواني\n   - أنزل ببطء\n   - كرر 10 مرات لكل ساق\n   - زد التكرار تدريجياً إلى 15 مرة\n\n🏋️ **تمرين إطالة أوتار الركبة (Hamstring Stretch)**:\n   - قف بجانب حائط للدعم\n   - ضع قدمك اليمنى خلف القدم اليسرى\n   - اضغط الكعب اليمنى للأسفل\n   - احتفظ بالركبة اليمنى مستقيمة\n   - يجب أن تشعر بتمدد في أوتار الركبة الخلفية\n   - احتفظ بالوضعية 30 ثانية\n   - كرر 3 مرات لكل ساق";
            warnings = ["❌ لا تهمل الألم المتزايد", "❌ تجنب الجري لمسافات طويلة", "❌ تجنب الجلوس على أسطح صلبة"];
        }
    } else if (jointId.includes('chest')) {
        if(primary.name.includes("التهاب الغضروف")) {
            exercises = "🏋️ **تمرين إطالة الصدر أمام الحائط (Wall Chest Stretch)**:\n   - قف أمام الحائط على مسافة ذراع واحد\n   - ضع يدك اليمنى على الحائط بارتفاع الكتف\n   - قم بتدوير جسمك للجهة اليسرى ببطء\n   - يجب أن تشعر بتمدد في عضلات الصدر الأمامية اليمنى\n   - احتفظ بالوضعية 30 ثانية\n   - تنفس بعمق وبطيء\n   - كرر 3 مرات لكل جانب\n\n🏋️ **تمرين إطالة الصدر بالباب (Doorway Stretch)**:\n   - قف في باب مفتوح\n   - ضع يديك على إطار الباب بارتفاع الكتف\n   - انحنى للأمام ببطء حتى تشعر بتمدد في الصدر\n   - يجب أن تشعر بتمدد في عضلات الصدر الأمامية\n   - احتفظ بالوضعية 30 ثانية\n   - تنفس بعمق وبطيء\n   - كرر 3 مرات\n\n🏋️ **تمرين إطالة الصدر بالكرسي (Seated Chest Stretch)**:\n   - اجلس على كرسي بظهر مستقيم\n   - ضع يدك اليمنى خلف رأسك\n   - اسحب كوعك الأيمن برفق نحو الجانب الأيسر\n   - يجب أن تشعر بتمدد في الصدر الأيمن\n   - احتفظ بالوضعية 30 ثانية\n   - كرر 3 مرات لكل جانب\n\n🧘 **تصحيح الوضعية أثناء العمل**:\n   - اجلس بوضعية صحيحة مع ظهر مستقيم\n   - استخدم كرسي مريح مع دعم للظهر\n   - لا تنحنى للأمام أثناء العمل\n   - خذ استراحة كل 30 دقيقة للوقوف والمشي\n\n❄️ **كمادات باردة للالتهاب الحاد**:\n   - استخدم كيس ثلج أو كمادة باردة\n   - لف الكيس بمنشفة رقيقة\n   - ضع الكمادة على الصدر لمدة 15 دقيقة\n   - كرر 3-4 مرات يومياً";
            warnings = ["❌ لا تضغط على الصدر", "❌ تجنب الحركات المفاجئة", "❌ لا تحمل أوزاناً ثقيلة", "❌ تجنب رفع الذراع فوق الرأس", "⚠️ قد يتطلب تقييماً بالرنين المغناطيسي"];
        } else {
            exercises = "🏋️ **تمرين إطالة الصدر أمام الحائط (Wall Chest Stretch)**:\n   - قف أمام الحائط على مسافة ذراع واحد\n   - ضع يدك اليمنى على الحائط بارتفاع الكتف\n   - قم بتدوير جسمك للجهة اليسرى ببطء\n   - يجب أن تشعر بتمدد في عضلات الصدر الأمامية اليمنى\n   - احتفظ بالوضعية 30 ثانية\n   - تنفس بعمق وبطيء\n   - كرر 3 مرات لكل جانب\n\n🏋️ **تمرين إطالة الصدر بالباب (Doorway Stretch)**:\n   - قف في باب مفتوح\n   - ضع يديك على إطار الباب بارتفاع الكتف\n   - انحنى للأمام ببطء حتى تشعر بتمدد في الصدر\n   - احتفظ بالوضعية 30 ثانية\n   - كرر 3 مرات\n\n🧘 **تصحيح الوضعية أثناء العمل**:\n   - اجلس بوضعية صحيحة مع ظهر مستقيم\n   - استخدم كرسي مريح مع دعم للظهر\n   - لا تنحنى للأمام أثناء العمل\n   - خذ استراحة كل 30 دقيقة للوقوف والمشي";
            warnings = ["❌ لا تهمل الألم المتزايد", "❌ تجنب الحركات المفاجئة", "❌ تجنب رفع الذراع فوق الرأس"];
        }
    } else if (jointId.includes('abdomen')) {
        exercises = "🏋️ **تمرين تقوية عضلات البطن الخفيفة (Abdominal Bracing)**:\n   - استلقِ على ظهرك على سجادة\n   - اثنِ ركبتيك مع وضع القدمين على الأرض\n   - شد عضلات بطنك للداخل (مثل سحب السرة للداخل)\n   - يجب أن تشعر بتقوية في عضلات البطن\n   - احتفظ بالوضعية 5-10 ثواني\n   - استرخِ لمدة 5 ثواني\n   - كرر 10 مرات\n   - افعل هذا التمرين مرتين يومياً\n\n🏋️ **تمرين إطالة الظهر بالكرسي (Seated Back Extension)**:\n   - اجلس على كرسي بظهر مستقيم\n   - ضع يديك خلف رأسك مع تلامس الأصابع\n   - انحنى للخلف ببطء مع دفع صدرك للأمام\n   - يجب أن تشعر بتمدد خفيف في الظهر\n   - احتفظ بالوضعية 5 ثواني\n   - لا تتجاوز الألم\n   - كرر 10 مرات\n\n🏋️ **تمرين تقوية عضلات الجذع (Bird Dog)**:\n   - انزل على الأربع (ركبتين ويديك على الأرض)\n   - ارفع يدك اليمنى وساقك اليسرى ببطء\n   - يجب أن تشعر بتقوية في عضلات الجذع\n   - احتفظ بالوضعية 3 ثواني\n   - أنزل ببطء\n   - كرر 10 مرات لكل جانب\n\n🚫 **تجنب الحركات المؤلمة**:\n   - تجنب الحركات التي تزيد الألم في البطن\n   - تجنب رفع الأشياء الثقيلة";
        warnings = ["❌ لا تهمل الألم المتزايد", "❌ تجنب رفع الأشياء الثقيلة", "⚠️ ألم البطن قد يتطلب تقييماً متخصصاً"];
    } else if (jointId.includes('jaw')) {
        exercises = "🏋️ **تمرين إطالة عضلات الفك (Jaw Stretch)**:\n   - افتح فمك ببطء حتى تشعر بتمدد خفيف في الفك\n   - احتفظ بالوضعية 5 ثواني\n   - أغلق فمك ببطء\n   - كرر 10 مرات\n   - افعل هذا التمرين مرتين يومياً\n\n🏋️ **تمرين حركة الفك الجانبية (Jaw Side Movement)**:\n   - حرك فكك لليمين ببطء\n   - يجب أن تشعر بتمدد خفيف في الفك الأيمن\n   - احتفظ بالوضعية 5 ثواني\n   - حرك فكك لليسار ببطء\n   - يجب أن تشعر بتمدد خفيف في الفك الأيسر\n   - احتفظ بالوضعية 5 ثواني\n   - كرر 10 مرات لكل جانب\n   - افعل هذا التمرين مرتين يومياً\n\n🏋️ **تمرين حركة الفك الأمامية والخلفية (Jaw Protrusion/Retraction)**:\n   - ادفع فكك للأمام ببطء\n   - احتفظ بالوضعية 5 ثواني\n   - اسحب فكك للخلف ببطء\n   - احتفظ بالوضعية 5 ثواني\n   - كرر 10 مرات\n   - افعل هذا التمرين مرتين يومياً\n\n🧘 **تمرين الاسترخاء العضلي (Progressive Muscle Relaxation)**:\n   - استرخِ عضلات الفك ببطء\n   - لا تصرّ على أسنانك\n   - افصل بين أسنانك العلوي والسفلي\n   - اجعل لسانك في وضعية محايدة في فمك\n   - تنفس بعمق وبطيء لمدة دقيقة\n   - كرر 5 مرات\n\n🔥 **كمادات دافئة قبل التمارين**:\n   - استخدم وسادة حرارية أو منشفة دافئة\n   - ضع الكمادة على الفك لمدة 10-15 دقيقة\n   - يساعد على إرخاء العضلات المتشنجة\n\n🚫 **تجنب فتح الفم بشكل واسع**:\n   - لا تفتح فمك بشكل واسع (أكثر من عرض إصبعين)\n   - تجنب الأطعمة الصلبة والمقرمشة\n   - تجنب مضغ العلكة الصلبة\n   - تجنب التثاؤب الواسع (غطِ فمك بيدك)";
        warnings = ["❌ لا تفتح فمك بشكل واسع", "❌ لا تصرّ على أسنانك", "❌ تجنب مضغ العلكة الصلبة", "❌ تجنب الأطعمة الصلبة والمقرمشة", "⚠️ قد يتطلب تقييماً من أخصائي الفك"];
    } else {
        // منطقة غير محددة - إرشادات عامة
        exercises = "⚠️ **هذه المنطقة غير مدعومة حالياً بشكل كامل**:\n   - يرجى استشارتنا لتأكيد التشخيص\n   - تجنب الأنشطة المؤلمة\n   - استخدم كمادات باردة/دافئة حسب الحاجة\n\n🏋️ **إرشادات عامة**:\n   - اجلس بوضعية صحيحة\n   - استخدم كرسي مريح مع دعم للظهر\n   - خذ استراحات متكررة كل 30 دقيقة\n\n❄️ **كمادات باردة/دافئة**:\n   - استخدم كيس ثلج أو كمادة باردة للالتهاب الحاد\n   - استخدم الحرارة للتيبس المزمن\n   - مدة 15-20 دقيقة";
        warnings = ["⚠️ هذه المنطقة غير مدعومة حالياً بشكل كامل", "⚠️ يرجى استشارتنا لتأكيد التشخيص", "❌ لا تهمل الألم المتزايد"];
    }
    
    // إضافة تحذيرات إضافية بناءً على الأنماط
    if (pattern.neuropathic) {
        warnings.push("⚠️ العلامات العصبية تتطلب تقييماً متقدماً");
    }
    if (pattern.weakness) {
        warnings.push("⚠️ الضعف العضلي يتطلب تقييماً عاجلاً");
    }
    if (pattern.traumatic && age > 50) {
        warnings.push("⚠️ الإصابة في هذا العمر تتطلب حذراً شديداً");
    }
    
    // تصفية التحذيرات الفارغة
    warnings = warnings.filter(w => w !== "");
    
    return { exercises, warnings };
}
