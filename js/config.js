// إحداثيات النقاط
const frontPoints = {
    'front-shoulder-r': { name: 'الكتف الأيمن', top: '21.939%', left: '35.6595%' },
    'front-shoulder-l': { name: 'الكتف الأيسر', top: '22.0894%', left: '63.8127%' },
    'front-elbow-r': { name: 'الكوع الأيمن', top: '39.3987%', left: '34.7528%' },
    'front-elbow-l': { name: 'الكوع الأيسر', top: '39.5491%', left: '65.4851%' },
    'front-wrist-r': { name: 'الرسغ الأيمن', top: '52.3283%', left: '30.8653%' },
    'front-wrist-l': { name: 'الرسغ الأيسر', top: '52.6903%', left: '69.4917%' },
    'front-fingers-r': { name: 'أصابع اليد اليمنى', top: '58%', left: '28%' },
    'front-fingers-l': { name: 'أصابع اليد اليسرى', top: '58%', left: '72%' },
    'front-hip-r': { name: 'الورك الأيمن', top: '53.6283%', left: '40.3282%' },
    'front-hip-l': { name: 'الورك الأيسر', top: '53.7787%', left: '60.1104%' },
    'front-knee-r': { name: 'الركبة اليمنى', top: '74.3462%', left: '44.5356%' },
    'front-knee-l': { name: 'الركبة اليسرى', top: '74.3462%', left: '56.3046%' },
    'front-ankle-r': { name: 'الكاحل الأيمن', top: '93.7618%', left: '44.3317%' },
    'front-ankle-l': { name: 'الكاحل الأيسر', top: '94.2132%', left: '56.9101%' },
    'front-foot-r': { name: 'القدم اليمنى', top: '98%', left: '45%' },
    'front-foot-l': { name: 'القدم اليسرى', top: '98%', left: '55%' },
    'front-toes-r': { name: 'أصابع القدم اليمنى', top: '100%', left: '42%' },
    'front-toes-l': { name: 'أصابع القدم اليسرى', top: '100%', left: '58%' },
    'front-calf-r': { name: 'عضلة الساق اليمنى', top: '83.4346%', left: '46.1295%' },
    'front-calf-l': { name: 'عضلة الساق اليسرى', top: '83.3735%', left: '53.2235%' },
    'front-chest': { name: 'الصدر', top: '30%', left: '50%' },
    'front-abdomen': { name: 'البطن', top: '45%', left: '50%' },
    'front-jaw-r': { name: 'الفك الأيمن', top: '12%', left: '40%' },
    'front-jaw-l': { name: 'الفك الأيسر', top: '12%', left: '60%' }
};
const backPoints = {
    'back-cervical': { name: 'فقرات الرقبة', top: '15.8503%', left: '49.7189%' },
    'back-thoracic': { name: 'منتصف الظهر', top: '28%', left: '50%' },
    'back-lumbar': { name: 'أسفل الظهر', top: '43.7265%', left: '50.1205%' },
    'back-coccyx': { name: 'العصعص', top: '53.6189%', left: '49.9197%' },
    'back-neck-muscles-r': { name: 'عضلات الرقبة اليمنى', top: '17.8955%', left: '42.8884%' },
    'back-neck-muscles-l': { name: 'عضلات الرقبة اليسرى', top: '18.408%', left: '57.2678%' },
    'back-scapula-r': { name: 'لوح الكتف الأيمن', top: '23.9842%', left: '43.472%' },
    'back-scapula-l': { name: 'لوح الكتف الأيسر', top: '24.8258%', left: '57.9267%' },
    'back-gluteus': { name: 'وسط الأرداف', top: '60.6479%', left: '49.5181%' }
};

// الأسئلة المشتركة (لتقليل التكرار)
const commonQuestions = {
    pain_description: {
        type: "textarea",
        name: "pain_description",
        label: "صف الألم بالتفصيل (نوع الألم، متى يزداد، ما الذي يخففه):",
        placeholder: "اكتب وصفاً تفصيلياً لألمك هنا..."
    },
    duration: {
        type: "select",
        name: "duration",
        label: "كم مدة الألم؟",
        options: ["أقل من أسبوع","أسبوع - شهر","شهر - 3 أشهر","أكثر من 3 أشهر"]
    },
    swelling: {
        type: "select",
        name: "swelling",
        label: "هل يوجد تورم؟",
        options: ["لا","تورم خفيف","تورم متوسط","تورم واضح"]
    },
    stiffness: {
        type: "select",
        name: "stiffness",
        label: "هل يوجد تيبس؟",
        options: ["لا","تيبس خفيف","تيبس متوسط","تيبس شديد"]
    },
    trauma_history: {
        type: "select",
        name: "trauma_history",
        label: "هل تعرضت لإصابة؟",
        options: ["لا","نعم حديثة","نعم قديمة"]
    }
};

// قاعدة الأسئلة الذكية الموسعة
const clinicalQuestionsDB = {
    'front-shoulder': {
        title: "تقييم الكتف",
        fields: [
            { type: "checkbox", name: "pain_trigger", label: "ما هي الحركات التي تزيد الألم؟ (اختر كل ما ينطبق)", options: ["رفع الذراع للأمام","رفع الذراع جانباً","تدوير الذراع للخارج","النوم على الكتف","حمل الأشياء الثقيلة","لا يوجد محدد"] },
            commonQuestions.pain_description,
            { type: "select", name: "night_pain", label: "هل الألم يوقظك من النوم؟", options: ["لا أبداً","نادراً","أحياناً","في أغلب الليالي"] },
            { type: "select", name: "weakness", label: "هل يوجد ضعف في رفع الذراع أو حمل الأشياء؟", options: ["لا","ضعف بسيط","ضعف متوسط","ضعف شديد"] },
            { type: "select", name: "crepitus", label: "هل تسمع صوت طقطقة أو احتكاك عند تحريك الكتف؟", options: ["لا","نعم بدون ألم","نعم مع ألم خفيف","نعم مع ألم شديد"] },
            { type: "select", name: "stiffness_duration", label: "كم مدة التيبس الصباحي للكتف؟", options: ["لا يوجد","أقل من 30 دقيقة","30 دقيقة - ساعة","أكثر من ساعة"] },
            { type: "select", name: "repetitive_motion", label: "هل تقوم بحركات متكررة للكتف (رياضة، عمل)؟", options: ["لا","نعم قليلاً","نعم بشكل متكرر","نعم بشكل مكثف"] },
            { type: "checkbox", name: "pain_location", label: "أين يتركز الألم؟ (اختر كل ما ينطبق)", options: ["مقدمة الكتف","جانب الكتف","خلف الكتف","ينتشر للذراع"] },
            { type: "textarea", name: "radiation_description", label: "إذا كان الألم يمتد لأماكن أخرى، صف ذلك بالتفصيل:", placeholder: "مثال: الألم يمتد من الكتف إلى الذراع حتى الكوع..." },
            { type: "select", name: "range_motion", label: "هل يوجد قيود في حركة الكتف؟", options: ["لا","قيود بسيطة","قيود متوسطة","قيود شديدة"] },
            { type: "select", name: "instability", label: "هل تشعر بعدم استقرار في الكتف؟", options: ["لا","نادراً","أحياناً","كثيراً"] },
            commonQuestions.swelling,
            commonQuestions.duration
        ]
    },
    'front-elbow': {
        title: "تقييم الكوع",
        fields: [
            { type: "checkbox", name: "pain_trigger", label: "ما الذي يزيد الألم؟ (اختر كل ما ينطبق)", options: ["ثني الكوع","مد الكوع","تدوير الذراع","القبض القوي","رفع الأشياء"] },
            commonQuestions.pain_description,
            { type: "select", name: "grip_weakness", label: "هل يوجد ضعف في القبض؟", options: ["لا","ضعف بسيط","ضعف متوسط","ضعف شديد"] },
            { type: "select", name: "tennis_golf", label: "نوع النشاط الرئيسي؟", options: ["لا نشاط خاص","رياضة الراحلة (تنس)","جولف","عمل يدوي متكرر"] },
            { type: "checkbox", name: "numbness", label: "هل هناك تنميل في الأصابع؟ (اختر كل ما ينطبق)", options: ["لا","في الإبهام والسبابة","في الخنصر والبنصر","في جميع الأصابع"] },
            commonQuestions.swelling,
            commonQuestions.stiffness,
            { type: "select", name: "instability", label: "هل تشعر بعدم استقرار في الكوع؟", options: ["لا","نادراً","أحياناً","كثيراً"] },
            commonQuestions.duration
        ]
    },
    'front-wrist': {
        title: "تقييم الرسغ",
        fields: [
            { type: "checkbox", name: "pain_trigger", label: "ما الذي يزيد الألم؟ (اختر كل ما ينطبق)", options: ["ثني الرسغ","مد الرسغ","التدوير","القبض","الكتابة/استخدام الكمبيوتر"] },
            commonQuestions.pain_description,
            { type: "checkbox", name: "numbness_pattern", label: "نمط التنميل في اليد؟ (اختر كل ما ينطبق)", options: ["لا تنميل","في الإبهام والسبابة والوسطى","في الخنصر والبنصر","في جميع الأصابع"] },
            { type: "textarea", name: "numbness_description", label: "صف التنميل بالتفصيل (إلى أين يمتد، متى يزداد):", placeholder: "مثال: التنميل يبدأ من الرسغ ويمتد إلى الإبهام والسبابة..." },
            { type: "select", name: "night_symptoms", label: "هل الأعراض تزداد ليلاً؟", options: ["لا","نعم أحياناً","نعم كثيراً","توقظني من النوم"] },
            { type: "select", name: "weakness", label: "هل يوجد ضعف في قبض اليد؟", options: ["لا","ضعف بسيط","ضعف متوسط","ضعف شديد"] },
            { type: "select", name: "typing_computer", label: "هل تستخدم الكمبيوتر بشكل مكثف؟", options: ["لا","أقل من 2 ساعة يومياً","2-4 ساعات يومياً","أكثر من 4 ساعات يومياً"] },
            commonQuestions.swelling,
            commonQuestions.stiffness,
            commonQuestions.duration
        ]
    },
    'front-hip': {
        title: "تقييم الورك",
        fields: [
            { type: "checkbox", name: "pain_location", label: "أين يتركز الألم؟ (اختر كل ما ينطبق)", options: ["منطقة الأرداف","الجانب الخارجي للفخذ","المنطقة الإربية (الأربية)","ينتشر للركبة"] },
            commonQuestions.pain_description,
            { type: "select", name: "walking_pain", label: "هل الألم يزداد عند المشي؟", options: ["لا","بعد مسافة قصيرة","بعد مسافة متوسطة","بعد مسافة طويلة"] },
            commonQuestions.stiffness,
            { type: "select", name: "range_motion", label: "هل يوجد قيود في حركة الورك؟", options: ["لا","قيود بسيطة","قيود متوسطة","قيود شديدة"] },
            { type: "select", name: "clicking", label: "هل تسمع طقطقة في الورك؟", options: ["لا","نعم بدون ألم","نعم مع ألم"] },
            { type: "select", name: "sitting_pain", label: "هل الألم يزداد عند الجلوس الطويل؟", options: ["لا","نعم قليلاً","نعم بشدة"] },
            { type: "select", name: "morning_stiffness", label: "كم مدة التيبس الصباحي؟", options: ["لا يوجد","أقل من 30 دقيقة","30 دقيقة - ساعة","أكثر من ساعة"] },
            { type: "select", name: "instability", label: "هل تشعر بعدم استقرار في الورك؟", options: ["لا","نادراً","أحياناً","كثيراً"] },
            commonQuestions.duration
        ]
    },
    'front-knee': {
        title: "تقييم الركبة",
        fields: [
            { type: "select", name: "instability", label: "هل تشعر أن الركبة تفلت أو تغلق فجأة؟", options: ["لا أبداً","نادراً","أحياناً","كثيراً"] },
            { type: "select", name: "catching", label: "هل هناك طقطقة أو احتكاك عند ثني وفرد الركبة؟", options: ["لا","نعم بدون ألم","نعم مع ألم خفيف","نعم مع ألم شديد"] },
            { type: "checkbox", name: "stairs_pain", label: "هل الألم يزداد عند صعود أو نزول الدرج؟ (اختر كل ما ينطبق)", options: ["لا","صعود الدرج","نزول الدرج"] },
            commonQuestions.pain_description,
            { type: "select", name: "morning_stiffness", label: "هل تعاني من تيبس في الركبة صباحاً؟", options: ["لا","أقل من 15 دقيقة","15-30 دقيقة","أكثر من 30 دقيقة"] },
            commonQuestions.swelling,
            { type: "select", name: "giving_way", label: "هل تعاني الركبة من الضعف المفاجئ؟", options: ["لا","نادراً","أحياناً","كثيراً"] },
            { type: "checkbox", name: "pain_location", label: "أين بالضبط يتركز الألم؟ (اختر كل ما ينطبق)", options: ["مقدمة الركبة","جانب الركبة الداخلي","جانب الركبة الخارجي","خلف الركبة"] },
            { type: "select", name: "locking", label: "هل الركبة تنغلق ولا تستطيع فردتها؟", options: ["لا","نعم أحياناً","نعم كثيراً"] },
            { type: "select", name: "sitting_pain", label: "هل الألم يزداد عند الجلوس الطويل؟", options: ["لا","نعم قليلاً","نعم بشدة"] },
            commonQuestions.trauma_history,
            commonQuestions.duration
        ]
    },
    'front-ankle': {
        title: "تقييم الكاحل",
        fields: [
            { type: "select", name: "instability", label: "هل تشعر أن الكاحل يفلت؟", options: ["لا","نادراً","أحياناً","كثيراً"] },
            commonQuestions.pain_description,
            commonQuestions.swelling,
            { type: "select", name: "pain_trigger", label: "ما الذي يزيد الألم؟", options: ["المشي","الجري","الصعود على الأصابع","الدوران"] },
            { type: "select", name: "sprain_history", label: "هل تعرضت لالتواء الكاحل من قبل؟", options: ["لا","مرة واحدة","عدة مرات","مزمن"] },
            commonQuestions.stiffness
        ]
    },
    'front-calf': {
        title: "تقييم عضلة الساق",
        fields: [
            { type: "select", name: "pain_trigger", label: "ما الذي يزيد الألم؟", options: ["المشي","الجري","صعود الدرج","الوقوف الطويل"] },
            commonQuestions.pain_description,
            commonQuestions.swelling,
            { type: "select", name: "cramps", label: "هل تعاني من تشنجات عضلية؟", options: ["لا","نادراً","أحياناً","كثيراً"] },
            { type: "select", name: "dvt_risk", label: "هل لديك عوامل خطر للجلطات (سفر طويل، جراحة، حبوب منع الحمل)؟", options: ["لا","نعم واحد","نعم أكثر من واحد"] }
        ]
    },
    'back-cervical': {
        title: "تقييم الرقبة",
        fields: [
            { type: "checkbox", name: "neck_radiation", label: "هل الألم يمتد إلى الكتف أو الذراع أو الأصابع؟ (اختر كل ما ينطبق)", options: ["لا","إلى الكتف فقط","إلى الذراع","إلى الأصابع"] },
            { type: "textarea", name: "radiation_description", label: "صف بالتفصيل كيف يمتد الألم (إلى أين بالضبط، متى يزداد):", placeholder: "مثال: الألم يمتد من الرقبة إلى الكتف الأيمن ثم إلى الذراع..." },
            { type: "select", name: "arm_weakness", label: "هل هناك ضعف في الذراع أو صعوبة في رفع الأشياء؟", options: ["لا","ضعف خفيف","ضعف متوسط","ضعف شديد"], conditional: { field: "neck_radiation", values: ["إلى الذراع", "إلى الأصابع"] } },
            { type: "select", name: "finger_numbness", label: "هل تشعر بتنميل أو وخز في الأصابع؟", options: ["لا","في الإبهام والسبابة والوسطى","في الخنصر والبنصر","في جميع الأصابع"], conditional: { field: "neck_radiation", values: ["إلى الذراع", "إلى الأصابع"] } },
            { type: "select", name: "movement_worsens", label: "هل تزداد الأعراض عند إمالة الرقبة أو تدويرها؟", options: ["لا","نعم قليلاً","نعم بشدة"] },
            { type: "select", name: "dizziness", label: "هل تعاني من دوخة أو صداع مرتبط بحركة الرقبة؟", options: ["لا","نادراً","أحياناً","كثيراً"] },
            { type: "select", name: "headache", label: "هل تعاني من صداع في مؤخرة الرأس؟", options: ["لا","نعم أحياناً","نعم كثيراً"] },
            { type: "select", name: "posture", label: "هل تعمل في وضعية سيئة (كمبيوتر، هاتف)؟", options: ["لا","نعم قليلاً","نعم بشكل متكرر","نعم بشكل مكثف"] },
            commonQuestions.stiffness,
            { type: "select", name: "work_sitting", label: "هل تجلس لفترات طويلة؟", options: ["لا","أقل من 4 ساعات","4-8 ساعات","أكثر من 8 ساعات"], conditional: { field: "posture", values: ["نعم قليلاً", "نعم بشكل متكرر", "نعم بشكل مكثف"] } },
            { type: "select", name: "typing_computer", label: "هل تستخدم الكمبيوتر بشكل مكثف؟", options: ["لا","أقل من 2 ساعة يومياً","2-4 ساعات يومياً","أكثر من 4 ساعات يومياً"], conditional: { field: "posture", values: ["نعم قليلاً", "نعم بشكل متكرر", "نعم بشكل مكثف"] } }
        ]
    },
    'back-thoracic': {
        title: "تقييم منتصف الظهر",
        fields: [
            { type: "checkbox", name: "pain_location", label: "أين يتركز الألم؟ (اختر كل ما ينطبق)", options: ["منتصف الظهر","جانب واحد","ينتشر للصدر","ينتشر للبطن","ينتشر للأضلاع"] },
            commonQuestions.pain_description,
            { type: "select", name: "breathing_pain", label: "هل الألم يزداد عند التنفس العميق؟", options: ["لا","نعم قليلاً","نعم بشدة"] },
            { type: "select", name: "posture", label: "هل تعاني من انحناء في الظهر؟", options: ["لا","انحناء بسيط","انحناء متوسط","انحناء واضح"] },
            { type: "select", name: "work_sitting", label: "هل تجلس لفترات طويلة؟", options: ["لا","أقل من 4 ساعات","4-8 ساعات","أكثر من 8 ساعات"] },
            { type: "checkbox", name: "radiation", label: "هل يمتد الألم لأماكن أخرى؟ (اختر كل ما ينطبق)", options: ["لا","للأضلاع الجانبية","للصدر من الأمام","للبطن"] },
            commonQuestions.trauma_history
        ]
    },
    'back-lumbar': {
        title: "تقييم أسفل الظهر",
        fields: [
            { type: "checkbox", name: "radiation", label: "هل يمتد الألم إلى الساق؟ (اختر كل ما ينطبق)", options: ["لا","إلى الأرداف فقط","إلى خلف الفخذ","إلى أسفل الساق والقدم"] },
            { type: "textarea", name: "radiation_description", label: "صف بالتفصيل كيف يمتد الألم (إلى أين بالضبط، متى يزداد، هل يصل للقدم):", placeholder: "مثال: الألم يمتد من أسفل الظهر إلى الساق اليمنى حتى الكعب..." },
            { type: "select", name: "cough_pain", label: "هل يزداد الألم عند العطس أو السعال؟", options: ["لا","نعم قليلاً","نعم بشدة"] },
            { type: "select", name: "toe_weakness", label: "هل يوجد ضعف في رفع إصبع القدم الكبير؟", options: ["لا","ضعف خفيف","ضعف متوسط","لا أستطيع الرفع"] },
            { type: "select", name: "leg_numbness", label: "هل هناك تنميل أو وخز في الساق أو القدم؟", options: ["لا","نعم خفيف","نعم متوسط","نعم شديد"] },
            { type: "select", name: "sitting_pain", label: "هل الألم يزداد عند الجلوس الطويل؟", options: ["لا","نعم قليلاً","نعم بشدة"] },
            { type: "select", name: "walking_relief", label: "هل يخف الألم عند المشي؟", options: ["لا","نعم قليلاً","نعم بشدة"] },
            { type: "select", name: "flexion_relief", label: "هل يخف الألم عند الانحناء للأمام؟", options: ["لا","نعم قليلاً","نعم بشدة"] },
            { type: "select", name: "standing_pain", label: "هل الألم يزداد عند الوقوف الطويل؟", options: ["لا","نعم قليلاً","نعم بشدة"] },
            { type: "select", name: "morning_stiffness", label: "كم مدة التيبس الصباحي؟", options: ["لا يوجد","أقل من 30 دقيقة","30 دقيقة - ساعة","أكثر من ساعة"] },
            { type: "select", name: "trauma_history", label: "هل تعرضت لإصابة في الظهر؟", options: ["لا","نعم حديثة","نعم قديمة","إصابات متكررة"] },
            { type: "select", name: "instability", label: "هل تشعر بعدم استقرار في الظهر؟", options: ["لا","نادراً","أحياناً","كثيراً"] },
            { type: "checkbox", name: "pain_location", label: "أين بالضبط يتركز الألم؟ (اختر كل ما ينطبق)", options: ["وسط أسفل الظهر","جانب واحد","ينتشر للأرداف","ينتشر للساق"] }
        ]
    },
    'back-coccyx': {
        title: "تقييم العصعص",
        fields: [
            { type: "select", name: "sitting_pain", label: "هل الألم يزداد عند الجلوس؟", options: ["لا","نعم قليلاً","نعم بشدة","لا أستطيع الجلوس"] },
            commonQuestions.pain_description,
            { type: "select", name: "trauma", label: "هل تعرضت لسقوط على المؤخرة؟", options: ["لا","نعم حديثاً","نعم قديماً"] },
            { type: "select", name: "standing_relief", label: "هل يخف الألم عند الوقوف؟", options: ["لا","نعم قليلاً","نعم بشدة"] },
            { type: "select", name: "bowel_pain", label: "هل الألم يزداد عند قضاء الحاجة؟", options: ["لا","نعم قليلاً","نعم بشدة"] }
        ]
    },
    'back-neck-muscles': {
        title: "تقييم عضلات الرقبة",
        fields: [
            { type: "select", name: "pain_trigger", label: "ما الذي يزيد الألم؟", options: ["إمالة الرقبة","تدوير الرقبة","النوم","العمل الطويل"] },
            commonQuestions.pain_description,
            { type: "select", name: "stress", label: "هل تعاني من التوتر والضغط النفسي؟", options: ["لا","قليل","متوسط","شديد"] },
            { type: "select", name: "posture", label: "هل تعاني من وضعية سيئة أثناء العمل (انحناء الرقبة للأمام، استخدام الهاتف، الجلوس الطويل)؟", options: ["لا","نعم قليلاً","نعم بشكل متكرر","نعم بشكل مكثف"] },
            { type: "select", name: "headache", label: "هل تعاني من صداع توتري؟", options: ["لا","نعم أحياناً","نعم كثيراً"] }
        ]
    },
    'back-scapula': {
        title: "تقييم لوح الكتف",
        fields: [
            { type: "select", name: "pain_trigger", label: "ما الذي يزيد الألم؟", options: ["رفع الذراع","النوم على الجانب","العمل الطويل","لا شيء محدد"] },
            commonQuestions.pain_description,
            { type: "select", name: "clicking", label: "هل تسمع طقطقة عند تحريك الكتف؟", options: ["لا","نعم بدون ألم","نعم مع ألم"] },
            { type: "select", name: "weakness", label: "هل يوجد ضعف في الكتف؟", options: ["لا","ضعف بسيط","ضعف متوسط","ضعف شديد"] },
            { type: "select", name: "posture", label: "هل تعاني من انحناء في الكتفين؟", options: ["لا","انحناء بسيط","انحناء متوسط","انحناء واضح"] }
        ]
    },
    'back-gluteus': {
        title: "تقييم الأرداف",
        fields: [
            { type: "select", name: "pain_location", label: "أين يتركز الألم؟", options: ["وسط الأرداف","جانب واحد","ينتشر للساق","ينتشر للظهر"] },
            commonQuestions.pain_description,
            { type: "select", name: "sitting_pain", label: "هل الألم يزداد عند الجلوس؟", options: ["لا","نعم قليلاً","نعم بشدة"] },
            { type: "select", name: "walking_pain", label: "هل الألم يزداد عند المشي؟", options: ["لا","نعم قليلاً","نعم بشدة"] },
            { type: "select", name: "piriformis", label: "هل الألم يزداد عند تدوير الساق للخارج؟", options: ["لا","نعم قليلاً","نعم بشدة"] }
        ]
    },
    'front-fingers': {
        title: "تقييم أصابع اليد",
        fields: [
            { type: "select", name: "pain_location", label: "أي أصابع تتأثر؟", options: ["الإبهام","السبابة والوسطى","الخنصر والبنصر","جميع الأصابع"] },
            commonQuestions.pain_description,
            { type: "select", name: "pain_trigger", label: "ما الذي يزيد الألم؟", options: ["القبض","الفتح","الكتابة","استخدام الهاتف"] },
            commonQuestions.stiffness,
            commonQuestions.swelling,
            { type: "select", name: "numbness", label: "هل يوجد تنميل في الأصابع؟", options: ["لا","تنميل خفيف","تنميل متوسط","تنميل شديد"] },
            { type: "select", name: "morning_stiffness", label: "كم مدة التيبس الصباحي؟", options: ["لا يوجد","أقل من 30 دقيقة","30 دقيقة - ساعة","أكثر من ساعة"] },
            { type: "select", name: "clicking", label: "هل تسمع طقطقة عند تحريك الأصابع؟", options: ["لا","نعم بدون ألم","نعم مع ألم"] }
        ]
    },
    'front-foot': {
        title: "تقييم القدم",
        fields: [
            { type: "select", name: "pain_location", label: "أين بالضبط يتركز الألم؟", options: ["الكعب","قوس القدم","مقدمة القدم","أعلى القدم"] },
            commonQuestions.pain_description,
            { type: "select", name: "pain_trigger", label: "ما الذي يزيد الألم؟", options: ["المشي","الجري","الوقوف الطويل","ارتداء أحذية معينة"] },
            { type: "select", name: "morning_pain", label: "هل الألم أسوأ في الصباح؟", options: ["لا","نعم قليلاً","نعم بشدة"] },
            commonQuestions.swelling,
            commonQuestions.stiffness,
            { type: "select", name: "walking_pain", label: "هل الألم يزداد عند المشي؟", options: ["لا","نعم قليلاً","نعم بشدة"] },
            { type: "select", name: "barefoot", label: "هل الألم يزداد عند المشي حافياً؟", options: ["لا","نعم قليلاً","نعم بشدة"] }
        ]
    },
    'front-toes': {
        title: "تقييم أصابع القدم",
        fields: [
            { type: "select", name: "pain_location", label: "أي أصابع تتأثر؟", options: ["إصبع القدم الكبير","الأصابع الأخرى","جميع الأصابع"] },
            commonQuestions.pain_description,
            { type: "select", name: "pain_trigger", label: "ما الذي يزيد الألم؟", options: ["المشي","ارتداء أحذية ضيقة","الوقوف","الجري"] },
            commonQuestions.swelling,
            { type: "select", name: "redness", label: "هل يوجد احمرار في الأصابع؟", options: ["لا","نعم قليلاً","نعم بشدة"] },
            { type: "select", name: "deformity", label: "هل يوجد تشوه في الأصابع؟", options: ["لا","نعم بسيط","نعم واضح"] },
            { type: "select", name: "shoe_pressure", label: "هل الألم يزداد بضغط الحذاء؟", options: ["لا","نعم قليلاً","نعم بشدة"] }
        ]
    },
    'front-chest': {
        title: "تقييم الصدر",
        fields: [
            { type: "checkbox", name: "pain_location", label: "أين بالضبط يتركز الألم؟ (اختر كل ما ينطبق)", options: ["وسط الصدر","جانب الصدر","خلف القص","ينتشر للذراع"] },
            commonQuestions.pain_description,
            { type: "select", name: "pain_trigger", label: "ما الذي يزيد الألم؟", options: ["التنفس العميق","الحركة","الضغط","الراحة"] },
            { type: "select", name: "breathing_pain", label: "هل الألم يزداد عند التنفس؟", options: ["لا","نعم قليلاً","نعم بشدة"] },
            { type: "select", name: "cough_pain", label: "هل الألم يزداد عند السعال؟", options: ["لا","نعم قليلاً","نعم بشدة"] },
            { type: "select", name: "chest_pressure", label: "هل تشعر بضغط أو ثقل في الصدر؟", options: ["لا","نعم قليلاً","نعم بشدة"] },
            { type: "checkbox", name: "radiation", label: "هل يمتد الألم لأماكن أخرى؟ (اختر كل ما ينطبق)", options: ["لا","للكتف الأيسر","للذراع","للرقبة","لالفك"] },
            { type: "select", name: "exertion", label: "هل الألم يزداد مع المجهود؟", options: ["لا","نعم قليلاً","نعم بشدة"] }
        ]
    },
    'front-abdomen': {
        title: "تقييم البطن",
        fields: [
            { type: "checkbox", name: "pain_location", label: "أين بالضبط يتركز الألم؟ (اختر كل ما ينطبق)", options: ["أعلى البطن","وسط البطن","أسفل البطن","الجانب الأيمن","الجانب الأيسر"] },
            commonQuestions.pain_description,
            { type: "select", name: "pain_type", label: "ما نوع الألم؟", options: ["حاد","مغص","حارق","ضاغط"] },
            { type: "select", name: "eating_trigger", label: "هل الألم يرتبط بالأكل؟", options: ["لا","نعم بعد الأكل","نعم قبل الأكل","نعم مع أطعمة معينة"] },
            { type: "select", name: "nausea", label: "هل تعاني من غثيان؟", options: ["لا","نعم قليلاً","نعم بشدة"] },
            { type: "select", name: "bloating", label: "هل تعاني من انتفاخ؟", options: ["لا","نعم قليلاً","نعم بشدة"] },
            { type: "select", name: "bowel_changes", label: "هل هناك تغير في عادات الأمعاء؟", options: ["لا","إمساك","إسهال","تبادل"] },
            { type: "select", name: "urination_pain", label: "هل الألم يرتبط بالتبول؟", options: ["لا","نعم قليلاً","نعم بشدة"] }
        ]
    },
    'front-jaw': {
        title: "تقييم الفك",
        fields: [
            { type: "checkbox", name: "pain_location", label: "أين بالضبط يتركز الألم؟ (اختر كل ما ينطبق)", options: ["مفصل الفك","العضلات","الأسنان","ينتشر للأذن"] },
            commonQuestions.pain_description,
            { type: "select", name: "pain_trigger", label: "ما الذي يزيد الألم؟", options: ["المضغ","فتح الفم","تدوير الفك","الراحة"] },
            { type: "select", name: "clicking", label: "هل تسمع طقطقة عند فتح الفم؟", options: ["لا","نعم بدون ألم","نعم مع ألم"] },
            { type: "select", name: "jaw_locking", label: "هل ينغلق الفك ولا تستطيع فتحه؟", options: ["لا","نعم أحياناً","نعم كثيراً"] },
            { type: "select", name: "mouth_opening", label: "هل يوجد قيود في فتح الفم؟", options: ["لا","قيود بسيطة","قيود متوسطة","قيود شديدة"] },
            { type: "select", name: "teeth_grinding", label: "هل تطحن أسنانك أثناء النوم؟", options: ["لا","نعم قليلاً","نعم بشدة"] },
            { type: "select", name: "headache", label: "هل تعاني من صداع؟", options: ["لا","نعم أحياناً","نعم كثيراً"] },
            { type: "select", name: "ear_pain", label: "هل تعاني من ألم في الأذن؟", options: ["لا","نعم قليلاً","نعم بشدة"] }
        ]
    }
};

function getQuestionsForRegion(jointId) {
    if (jointId.includes('shoulder')) return clinicalQuestionsDB['front-shoulder'];
    if (jointId.includes('elbow')) return clinicalQuestionsDB['front-elbow'];
    if (jointId.includes('wrist')) return clinicalQuestionsDB['front-wrist'];
    if (jointId.includes('hip')) return clinicalQuestionsDB['front-hip'];
    if (jointId.includes('knee')) return clinicalQuestionsDB['front-knee'];
    if (jointId.includes('ankle')) return clinicalQuestionsDB['front-ankle'];
    if (jointId.includes('calf')) return clinicalQuestionsDB['front-calf'];
    if (jointId.includes('fingers')) return clinicalQuestionsDB['front-fingers'];
    if (jointId.includes('foot')) return clinicalQuestionsDB['front-foot'];
    if (jointId.includes('toes')) return clinicalQuestionsDB['front-toes'];
    if (jointId.includes('chest')) return clinicalQuestionsDB['front-chest'];
    if (jointId.includes('abdomen')) return clinicalQuestionsDB['front-abdomen'];
    if (jointId.includes('jaw')) return clinicalQuestionsDB['front-jaw'];
    if (jointId === 'back-cervical') return clinicalQuestionsDB['back-cervical'];
    if (jointId === 'back-thoracic') return clinicalQuestionsDB['back-thoracic'];
    if (jointId === 'back-lumbar') return clinicalQuestionsDB['back-lumbar'];
    if (jointId === 'back-coccyx') return clinicalQuestionsDB['back-coccyx'];
    if (jointId.includes('neck-muscles')) return clinicalQuestionsDB['back-neck-muscles'];
    if (jointId.includes('scapula')) return clinicalQuestionsDB['back-scapula'];
    if (jointId.includes('gluteus')) return clinicalQuestionsDB['back-gluteus'];
    return null;
}

window.getQuestionsForRegion = getQuestionsForRegion;

// الأسئلة الاسترشادية اليومية للمتابعة
const dailyFollowUpQuestions = {
    title: "المتابعة اليومية",
    fields: [
        { type: "range", name: "pain_score", label: "كيف تقييم ألمك اليوم؟", min: 1, max: 10 },
        { type: "range", name: "movement_score", label: "كيف تقييم حركتك اليوم؟", min: 1, max: 10 },
        { type: "number", name: "walking_minutes", label: "كم دقيقة مشيت اليوم؟" },
        { type: "range", name: "sleep_quality", label: "كيف كانت جودة نومك؟", min: 1, max: 10 },
        { type: "checkbox", name: "positive_behaviors", label: "ما الذي قمت به اليوم؟", options: ["أداء التمارين", "المشي", "الإطالة", "العلاج الحراري", "الحفاظ على وضعية جيدة", "الحصول على راحة كافية"] },
        { type: "checkbox", name: "negative_behaviors", label: "ما الذي تجنبته اليوم؟", options: ["الجلوس الطويل", "المشي الزائد", "رفع الأشياء الثقيلة", "استخدام الهاتف لفترة طويلة", "النوم السيء", "انتشار الألم"] },
        { type: "textarea", name: "notes", label: "ملاحظات إضافية:", placeholder: "اكتب أي ملاحظات تود مشاركتها..." }
    ]
};

function getDailyFollowUpQuestions() {
    return dailyFollowUpQuestions;
}

// ============================================
// قاعدة بيانات التمارين المتقدمة للمتابعة اليومية
// ============================================
const progressiveExercises = {
    'neck': {
        beginner: [
            { name: 'إمالة الرقبة للأمام', description: 'إمالة الرقبة ببطء للأمام ثم العودة', duration: '10 ثواني', reps: 5 },
            { name: 'إمالة الرقبة للجانبين', description: 'إمالة الرقبة ببطء لليمين ثم اليسار', duration: '10 ثواني', reps: 5 },
            { name: 'تدوير الرقبة', description: 'تدوير الرقبة ببطء في اتجاه عقارب الساعة', duration: '10 ثواني', reps: 3 }
        ],
        intermediate: [
            { name: 'تمارين إطالة عضلات الرقبة', description: 'إطالة عضلات الرقبة بلطف', duration: '15 ثانية', reps: 5 },
            { name: 'تمارين تقوية عضلات الرقبة', description: 'ضغط خفيف ضد اليد', duration: '5 ثواني', reps: 10 },
            { name: 'تمارين استقرار الكتف', description: 'سحب لوحي الكتف للخلف', duration: '10 ثواني', reps: 5 }
        ],
        advanced: [
            { name: 'تمارين المقاومة للرقبة', description: 'مقاومة متوسطة للحركات', duration: '10 ثواني', reps: 10 },
            { name: 'تمارين التنسيق العصبي', description: 'حركات معقدة للرقبة والكتف', duration: '15 ثانية', reps: 5 },
            { name: 'تمارين الوضعية الصحيحة', description: 'تمارين لتصحيح وضعية الرأس', duration: '20 ثانية', reps: 3 }
        ]
    },
    'shoulder': {
        beginner: [
            { name: 'تأرجح الذراع', description: 'تأرجح الذراع بلطف للأمام والخلف', duration: '30 ثانية', reps: 10 },
            { name: 'تمارين البندول', description: 'تأرجح الذراع بحركة دائرية', duration: '30 ثانية', reps: 10 },
            { name: 'رفع الذراع للأمام', description: 'رفع الذراع ببطء للأمام', duration: '5 ثواني', reps: 10 }
        ],
        intermediate: [
            { name: 'تمارين الحائط', description: 'زحف الأصابع على الحائط', duration: '10 ثواني', reps: 5 },
            { name: 'تمارين المرونة', description: 'إطالة عضلات الكتف', duration: '15 ثانية', reps: 5 },
            { name: 'تمارين التقوية الخفيفة', description: 'رفع أوزان خفيفة', duration: '5 ثواني', reps: 10 }
        ],
        advanced: [
            { name: 'تمارين المقاومة', description: 'تمارين مع شريط مقاومة', duration: '10 ثواني', reps: 10 },
            { name: 'تمارين الاستقرار', description: 'تمارين لتحسين استقرار الكتف', duration: '15 ثانية', reps: 5 },
            { name: 'تمارين الوظيفية', description: 'حركات وظيفية للحياة اليومية', duration: '20 ثانية', reps: 5 }
        ]
    },
    'back': {
        beginner: [
            { name: 'تقوس الظهر', description: 'تقوس الظهر للخلف بلطف', duration: '5 ثواني', reps: 10 },
            { name: 'جلب الركبتين', description: 'جلب الركبتين للصدر', duration: '10 ثواني', reps: 5 },
            { name: 'الوضعية القط', description: 'رفع الظهر والوضعية المستقيمة', duration: '10 ثواني', reps: 5 }
        ],
        intermediate: [
            { name: 'جسر الورك', description: 'رفع الوركين للأعلى', duration: '5 ثواني', reps: 10 },
            { name: 'تمارين الطائر', description: 'رفع الذراعين والساقين', duration: '5 ثواني', reps: 10 },
            { name: 'تمارين الإطالة', description: 'إطالة عضلات الظهر', duration: '15 ثانية', reps: 5 }
        ],
        advanced: [
            { name: 'تمارين البلاك', description: 'تمارين البلاك لتحسين الاستقرار', duration: '30 ثانية', reps: 3 },
            { name: 'تمارين المقاومة', description: 'تمارين مع شريط مقاومة', duration: '10 ثواني', reps: 10 },
            { name: 'تمارين الوظيفية', description: 'حركات وظيفية للحياة اليومية', duration: '20 ثانية', reps: 5 }
        ]
    },
    'knee': {
        beginner: [
            { name: 'رفع الساق مستقيمة', description: 'رفع الساق مستقيمة للأعلى', duration: '5 ثواني', reps: 10 },
            { name: 'ثني الركبة', description: 'ثني الركبة ببطء', duration: '5 ثواني', reps: 10 },
            { name: 'تمارين الكاحل', description: 'تحريك الكاحل في اتجاهات مختلفة', duration: '10 ثواني', reps: 10 }
        ],
        intermediate: [
            { name: 'تمارين الجدار', description: 'الاستناد على الحائط وثني الركبة', duration: '10 ثواني', reps: 5 },
            { name: 'تمارين المقعد', description: 'الجلوس والوقوف من الكرسي', duration: '5 ثواني', reps: 10 },
            { name: 'تمارين الإطالة', description: 'إطالة عضلات الفخذ', duration: '15 ثانية', reps: 5 }
        ],
        advanced: [
            { name: 'تمارين السكوات', description: 'تمارين السكوات الخفيفة', duration: '5 ثواني', reps: 10 },
            { name: 'تمارين القفز', description: 'قفزات خفيفة', duration: '5 ثواني', reps: 5 },
            { name: 'تمارين التوازن', description: 'تمارين التوازن على ساق واحدة', duration: '10 ثواني', reps: 5 }
        ]
    },
    'ankle': {
        beginner: [
            { name: 'تحريك الكاحل', description: 'تحريك الكاحل في اتجاهات مختلفة', duration: '10 ثواني', reps: 10 },
            { name: 'كتابة الحروف', description: 'كتابة الحروف بالكاحل', duration: '30 ثانية', reps: 1 },
            { name: 'رفع الكعب', description: 'رفع الكعب عن الأرض', duration: '5 ثواني', reps: 10 }
        ],
        intermediate: [
            { name: 'تمارين التوازن', description: 'الوقوف على قدم واحدة', duration: '15 ثانية', reps: 5 },
            { name: 'تمارين المقاومة', description: 'مقاومة الحركة باليد', duration: '10 ثواني', reps: 10 },
            { name: 'تمارين الإطالة', description: 'إطالة عضلات الساق', duration: '15 ثانية', reps: 5 }
        ],
        advanced: [
            { name: 'تمارين القفز', description: 'قفزات خفيفة', duration: '5 ثواني', reps: 5 },
            { name: 'تمارين السباق', description: 'الجري الخفيف في المكان', duration: '10 ثواني', reps: 3 },
            { name: 'تمارين الوظيفية', description: 'حركات وظيفية للحياة اليومية', duration: '20 ثانية', reps: 5 }
        ]
    }
};

// دالة الحصول على التمارين المناسبة بناءً على التقدم
function getProgressiveExercises(region, recoveryScore, dayNumber) {
    // تحديد مستوى التمرين بناءً على مؤشر التعافي
    let level = 'beginner';
    if (recoveryScore >= 70) level = 'advanced';
    else if (recoveryScore >= 40) level = 'intermediate';
    
    // تحديد المنطقة العامة
    let generalRegion = 'back';
    if (region.includes('neck') || region.includes('cervical')) generalRegion = 'neck';
    else if (region.includes('shoulder')) generalRegion = 'shoulder';
    else if (region.includes('knee')) generalRegion = 'knee';
    else if (region.includes('ankle') || region.includes('foot') || region.includes('calf')) generalRegion = 'ankle';
    
    // الحصول على التمارين المناسبة
    const exercises = progressiveExercises[generalRegion]?.[level] || [];
    
    // إضافة تمارين إضافية بناءً على اليوم
    if (dayNumber >= 5 && level === 'beginner') {
        // إضافة تمارين متوسطة في اليوم الخامس
        const intermediateExercises = progressiveExercises[generalRegion]?.['intermediate']?.slice(0, 2) || [];
        exercises.push(...intermediateExercises);
    }
    
    return exercises;
}

// دالة الحصول على التوصيات الذكية بناءً على البيانات
function getSmartRecommendations(dailyLog, previousLogs, recoveryScore) {
    const recommendations = [];
    
    // تحليل الألم
    if (dailyLog.painScore > 7) {
        recommendations.push({
            type: 'warning',
            title: '⚠️ تنبيه: الألم مرتفع',
            message: 'الألم مرتفع اليوم. يُنصح بالراحة وتجنب الأنشطة الشاقة. إذا استمر الألم، تواصل مع الطبيب.'
        });
    } else if (dailyLog.painScore > 5) {
        recommendations.push({
            type: 'caution',
            title: '🔶 الألم متوسط',
            message: 'الألم متوسط. قلل من النشاط البدني وركز على التمارين الخفيفة والإطالة.'
        });
    } else if (dailyLog.painScore <= 3 && recoveryScore >= 50) {
        recommendations.push({
            type: 'success',
            title: '✨ تحسن ممتاز',
            message: 'الألم منخفض ومؤشر التعافي جيد. يمكنك زيادة شدة التمارين تدريجياً.'
        });
    }
    
    // تحليل السلوكيات السلبية
    if (dailyLog.longSitting) {
        recommendations.push({
            type: 'tip',
            title: '💡 نصيحة: الجلوس الطويل',
            message: 'حاول القيام كل 30 دقيقة وتمشى لمدة 5 دقائق لتحسين الدورة الدموية.'
        });
    }
    
    if (dailyLog.phoneUsage) {
        recommendations.push({
            type: 'tip',
            title: '💡 نصيحة: استخدام الهاتف',
            message: 'حاول تقليل استخدام الهاتف ورفعه لمستوى العين لتجنب ألم الرقبة.'
        });
    }
    
    if (dailyLog.poorSleep) {
        recommendations.push({
            type: 'tip',
            title: '💡 نصيحة: جودة النوم',
            message: 'حسن جودة نومك بتجنب الكافيين قبل النوم والحفاظ على جدول نوم منتظم.'
        });
    }
    
    // تحليل الالتزام بالتمارين
    if (!dailyLog.exerciseCompleted && recoveryScore < 50) {
        recommendations.push({
            type: 'reminder',
            title: '📌 تذكير: التمارين',
            message: 'لم تقم بالتمارين اليوم. الالتزام بالتمارين مهم لتحسين التعافي.'
        });
    }
    
    // مقارنة بالأيام السابقة
    if (previousLogs.length > 0) {
        const previousLog = previousLogs[previousLogs.length - 1];
        const painChange = dailyLog.painScore - previousLog.painScore;
        
        if (painChange > 2) {
            recommendations.push({
                type: 'warning',
                title: '📈 زيادة الألم',
                message: `الألم زاد بمقدار ${painChange} نقاط عن الأمس. راجع نشاطك اليوم وتجنب المجهود الزائد.`
            });
        } else if (painChange < -2) {
            recommendations.push({
                type: 'success',
                title: '📉 تحسن الألم',
                message: `الألم تحسن بمقدار ${Math.abs(painChange)} نقاط عن الأمس. استمر في العادات الجيدة!`
            });
        }
    }
    
    // توصيات بناءً على مؤشر التعافي
    if (recoveryScore >= 80) {
        recommendations.push({
            type: 'success',
            title: '🎉 تعافي ممتاز',
            message: 'مؤشر التعافي ممتاز! يمكنك البدء في العودة للأنشطة الطبيعية تدريجياً.'
        });
    } else if (recoveryScore >= 50) {
        recommendations.push({
            type: 'info',
            title: '📊 تقدم جيد',
            message: 'تقدمك جيد. استمر في الالتزام بالخطة العلاجية.'
        });
    } else if (recoveryScore < 30) {
        recommendations.push({
            type: 'warning',
            title: '📉 يحتاج تحسين',
            message: 'مؤشر التعافي منخفض. راجع التزامك بالتمارين وتواصل مع الطبيب إذا لزم الأمر.'
        });
    }
    
    return recommendations;
}

// دالة مقارنة الأسبوع الحالي بالأسبوع السابق
function compareWeeks(currentLogs, previousWeekLogs) {
    const comparison = {
        currentWeek: {
            avgPain: 0,
            avgMovement: 0,
            avgSleep: 0,
            exerciseCompliance: 0
        },
        previousWeek: {
            avgPain: 0,
            avgMovement: 0,
            avgSleep: 0,
            exerciseCompliance: 0
        },
        improvement: {
            pain: 0,
            movement: 0,
            sleep: 0,
            exerciseCompliance: 0
        }
    };
    
    // حساب متوسطات الأسبوع الحالي
    if (currentLogs.length > 0) {
        comparison.currentWeek.avgPain = currentLogs.reduce((sum, log) => sum + log.painScore, 0) / currentLogs.length;
        comparison.currentWeek.avgMovement = currentLogs.reduce((sum, log) => sum + (log.movementScore || 5), 0) / currentLogs.length;
        comparison.currentWeek.avgSleep = currentLogs.reduce((sum, log) => sum + (log.sleepQuality || 5), 0) / currentLogs.length;
        comparison.currentWeek.exerciseCompliance = (currentLogs.filter(log => log.exerciseCompleted).length / currentLogs.length) * 100;
    }
    
    // حساب متوسطات الأسبوع السابق
    if (previousWeekLogs.length > 0) {
        comparison.previousWeek.avgPain = previousWeekLogs.reduce((sum, log) => sum + log.painScore, 0) / previousWeekLogs.length;
        comparison.previousWeek.avgMovement = previousWeekLogs.reduce((sum, log) => sum + (log.movementScore || 5), 0) / previousWeekLogs.length;
        comparison.previousWeek.avgSleep = previousWeekLogs.reduce((sum, log) => sum + (log.sleepQuality || 5), 0) / previousWeekLogs.length;
        comparison.previousWeek.exerciseCompliance = (previousWeekLogs.filter(log => log.exerciseCompleted).length / previousWeekLogs.length) * 100;
    }
    
    // حساب نسبة التحسن
    comparison.improvement.pain = ((comparison.previousWeek.avgPain - comparison.currentWeek.avgPain) / comparison.previousWeek.avgPain) * 100;
    comparison.improvement.movement = ((comparison.currentWeek.avgMovement - comparison.previousWeek.avgMovement) / comparison.previousWeek.avgMovement) * 100;
    comparison.improvement.sleep = ((comparison.currentWeek.avgSleep - comparison.previousWeek.avgSleep) / comparison.previousWeek.avgSleep) * 100;
    comparison.improvement.exerciseCompliance = comparison.currentWeek.exerciseCompliance - comparison.previousWeek.exerciseCompliance;
    
    return comparison;
}