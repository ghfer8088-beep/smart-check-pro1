// ==========================================================================
// Smart Check Pro 2.0 - محرك التشخيص السريري والاستدلال الطبي فائق الدقة
// مركز وداعاً للألم - تقنية الكايروبراكتيك 30 دقيقة
// ==========================================================================

const ClinicalEngine = (function() {

    // 🛡️ فحص حماية المحرك السريري وقفل النطاق
    (function _validateEngineHost() {
        // يسمح بالتشغيل عبر جميع النطاقات والشبكات المحلية والهواتف بسلاسة تامة
        return true;
    })();

    // 1. قاعدة المعرفة السريرية المتفرعة ومتعددة الطبقات لكل نقطة تشريحية
    const ADVANCED_CLINICAL_KNOWLEDGE = {
        // =====================================================================
        // أ. الفقرات القطنية وأسفل الظهر (Lumbar Spine)
        // =====================================================================
        lumbar_spine: {
            regionName: "الفقرات القطنية وأسفل الظهر",
            category: "lumbar",
            tier1_quality: {
                title: "1. ما هو التوصيف السريري الأقرب لطبيعة الألم في أسفل الظهر؟",
                options: [
                    {
                        value: "disc_radicular",
                        label: "ألم حاد كلسعة كهربائية أو نار يمتد من أسفل الظهر نحو الأرداف ونزولاً للساق/القدم",
                        indicates: "انزلاق غضروفي قطني وانضغاط جذري (Lumbar Radiculopathy)",
                        baseScore: { diagKey: "lumbar_disc_herniation", prob: 95 }
                    },
                    {
                        value: "facet_extension",
                        label: "ألم عميق موضعي وتصلب حاد يشتد عند الوقوف المستقيم أو المشي أو إرجاع الظهر للخلف",
                        indicates: "متلازمة مفاصل الفقرات القطنية (Facet Syndrome / Spondylolisthesis)",
                        baseScore: { diagKey: "lumbar_facet_spondylolisthesis", prob: 93 }
                    },
                    {
                        value: "stenosis_neurogenic",
                        label: "ثقل وتخشب وخدر في الساقين معاً يظهر بعد المشي لمسافة قصيرة ويجبرك على الجلوس والانحناء للراحة",
                        indicates: "تضيق القناة العصبية الشوكية والعرج العصبي (Spinal Stenosis & Neurogenic Claudication)",
                        baseScore: { diagKey: "lumbar_facet_spondylolisthesis", prob: 94 }
                    },
                    {
                        value: "muscular_postural",
                        label: "شد وتشنج عضلي مزعج كالحزام أسفل الظهر يزداد مع التعب والجلوس المكتبي الطويل",
                        indicates: "إجهاد ميكانيكي وتشنج العضلات الموازية للفقرات (Mechanical Lumbar Strain)",
                        baseScore: { diagKey: "lumbar_mechanical_strain", prob: 92 }
                    }
                ]
            },
            tier2_mechanical: {
                title: "2. الاستجابة الاتجاهية والمحفزات البيوميكانيكية (Directional Preference):",
                options: [
                    {
                        value: "flexion_aggravates",
                        label: "يزداد الألم بشدة عند الانحناء للأمام، الجلوس الطويل، أو السعال والعطاس (Flexion Intolerant)",
                        pointsTo: "disc"
                    },
                    {
                        value: "extension_aggravates",
                        label: "يزداد الألم عند الوقوف الطويل، فرد الظهر للخلف، أو النزول من السرير مستقيماً (Extension Intolerant)",
                        pointsTo: "facet_stenosis"
                    },
                    {
                        value: "rotation_sitting",
                        label: "يزداد الألم مع الالتفاف المفاجئ أو النهوض من الكرسي المنخفض",
                        pointsTo: "si_muscular"
                    }
                ]
            },
            tier3_neuro_mapping: {
                title: "3. خريطة المسار العصبي والأعراض الحسية الحركية المرافقة (Dermatomes & Myotomes):",
                options: [
                    { id: "s1_path", label: "يمتد التنميل/الألم لخلف الفخذ وبطة الساق حتى كعب وباطن القدم (جذر العصب S1)", weight: 15, root: "S1" },
                    { id: "l5_path", label: "يمتد التنميل/الألم لجانب الفخذ والساق الخارجي حتى إصبع القدم الكبير (جذر العصب L5)", weight: 15, root: "L5" },
                    { id: "l4_path", label: "يمتد الألم لمقدمة الفخذ ونحو الركبة (جذر العصب L3-L4)", weight: 12, root: "L4" },
                    { id: "foot_weak", label: "ضعف في رفع مشط القدم للأعلى أو التعثر بأطراف السجاد (Foot Drop / L5 Motor Deficit)", weight: 20, isWarning: true },
                    { id: "morning_lock", label: "تيبس وتصلب شديد في الظهر يحتاج أكثر من 20 دقيقة حركة ليلين", weight: 10 },
                    { id: "lateral_tilt", label: "ميلان وانحراف لا إرادي في الجذع لليمين أو اليسار للهروب من الألم (Antalgic Lateral Shift)", weight: 14 }
                ]
            },
            tier4_provocation: {
                title: "4. الاختبار السريري الاستدلالي (Clinical Self-Assessment Provocation):",
                question: "عند الاستلقاء على الظهر ورفع الساق المصابة مستقيمة للأعلى (اختبار لاسيج Lasègue / SLR):",
                options: [
                    { value: "slr_positive_sharp", label: "يحدث ألم كهربائي حاد يمتد لأسفل الركبة عند زاوية بين 30 إلى 70 درجة (إيجابي لانضغاط الديسك)", scoreShift: { disc: +15, facet: -10 } },
                    { value: "slr_tight_only", label: "أشعر فقط بشد وإطالة خلف الفخذ بدون ألم كهربائي (شد عضلات الهامسترينغ)", scoreShift: { disc: -10, muscular: +15 } },
                    { value: "slr_back_pain", label: "يزداد ألم وسط الظهر فقط دون امتداد للساق", scoreShift: { facet: +15, disc: 0 } }
                ]
            }
        },

        // =====================================================================
        // ب. الفقرات العنقية والرقبة الخلفية (Cervical Spine)
        // =====================================================================
        cervical_back: {
            regionName: "الفقرات العنقية وقاعدة الرقبة",
            category: "cervical",
            tier1_quality: {
                title: "1. ما هو التوصيف السريري الدقيق لألم الرقبة؟",
                options: [
                    {
                        value: "cerv_disc_radicular",
                        label: "ألم حارق أو كهرباء تمتد من الرقبة والكتف نزولاً للذراع والساعد والأصابع",
                        indicates: "انزلاق غضروفي عنقي واعتلال الجذور العصبية C5-C7 (Cervical Radiculopathy)",
                        baseScore: { diagKey: "cervical_disc_radiculopathy", prob: 95 }
                    },
                    {
                        value: "cerv_facet_lock",
                        label: "تصلب وانحباس حاد مفاجئ في حركة الرقبة يمنع الالتفات لجهة معينة مع نغزة حادة",
                        indicates: "انحباس ميكانيكي لمفاصل الفقرات العنقية (Cervical Facet Lock & Torticollis)",
                        baseScore: { diagKey: "cervical_strain_facet", prob: 93 }
                    },
                    {
                        value: "cerv_postural_strain",
                        label: "ثقل وشد عضلي حارق بين الرقبة وأعلى الأكتاف يزداد مع العمل المكتبي واستخدام الهاتف",
                        indicates: "متلازمة الرقبة الإلكترونية والإجهاد العضلي الوضعي (Text-Neck Postural Syndrome)",
                        baseScore: { diagKey: "cervical_strain_facet", prob: 92 }
                    }
                ]
            },
            tier2_mechanical: {
                title: "2. المحفزات الميكانيكية لآلام الرقبة:",
                options: [
                    { value: "looking_down_phone", label: "النظر المستمر لأسفل نحو الهاتف أو شاشة اللابتوب (Flexion Load)", pointsTo: "posture_disc" },
                    { value: "looking_up_extension", label: "إرجاع الرأس للخلف والالتفات لجهة الألم (Spurling Extension Load)", pointsTo: "facet_radicular" },
                    { value: "driving_morning", label: "الاستيقاظ من النوم أو القيادة الطويلة دون سند الرأس", pointsTo: "facet_strain" }
                ]
            },
            tier3_neuro_mapping: {
                title: "3. الأعراض المصاحبة والتفرعات العصبية:",
                options: [
                    { id: "c6_thumb", label: "تنميل أو خدر في الإبهام والسبابة (جذر العصب C6)", weight: 15 },
                    { id: "c7_middle", label: "تنميل في الإصبع الأوسط وخلف الذراع (جذر العصب C7)", weight: 15 },
                    { id: "c8_pinky", label: "تنميل في الخنصر والبنصر وبطن الساعد (جذر العصب C8)", weight: 15 },
                    { id: "c_headache", label: "صداع يبدأ من قاعدة الجمجمة ويمتد فوق الرأس نحو العين (Cervicogenic)", weight: 12 },
                    { id: "c_grip_weak", label: "ضعف مفاجئ في قبضة اليد وسقوط الأشياء الخفيفة", weight: 18, isWarning: true },
                    { id: "c_dizziness", label: "شعور خفيف بعدم الاتزان أو الدوار الوضعي عند تحريك الرقبة", weight: 10 }
                ]
            },
            tier4_provocation: {
                title: "4. الاختبار السريري الاستدلالي للرقبة (Spurling Correlate):",
                question: "عند إمالة الرأس قليلاً لجهة الألم وإرجاعه للخلف بلطف:",
                options: [
                    { value: "spurl_arm_electric", label: "يحدث وخز حارق أو كهرباء تسري فوراً في الذراع (إيجابي للضغط الجذري)", scoreShift: { disc: +15, facet: 0 } },
                    { value: "spurl_local_pinch", label: "نغزة موضعية محصورة في جانب الرقبة فقط دون نزول للذراع", scoreShift: { facet: +15, disc: -10 } },
                    { value: "spurl_no_change", label: "لا يتغير الألم بشكل ملحوظ", scoreShift: { muscular: +10 } }
                ]
            }
        },

        // =====================================================================
        // ج. الحوض وعضلات الأرداف وعرق النسا (Sacroiliac & Piriformis)
        // =====================================================================
        sacroiliac_right: {
            regionName: "المفصل العجزي الحوضي والأرداف",
            category: "si_joint",
            tier1_quality: {
                title: "1. ما هو التوصيف الدقيق لألم الحوض والأرداف؟",
                options: [
                    {
                        value: "piriformis_sciatica",
                        label: "ألم عميق في منتصف الأرداف ينضغط بشدة عند الجلوس ويمتد كعرق نسا عضلي لخلف الفخذ",
                        indicates: "متلازمة العضلة الكمثرية وعرق النسا العضلي (Piriformis Syndrome)",
                        baseScore: { diagKey: "si_joint_piriformis", prob: 94 }
                    },
                    {
                        value: "si_joint_lock",
                        label: "ألم في نقطة عظمية محددة بجانب عظم العجز يشتد عند الوقوف على ساق واحدة أو التقلب بالسرير",
                        indicates: "خلل واعتلال المفصل العجزي الحوضي (Sacroiliac Joint Dysfunction)",
                        baseScore: { diagKey: "si_joint_piriformis", prob: 93 }
                    },
                    {
                        value: "trochanteric_bursa",
                        label: "ألم على البروز العظمي الخارجي للورك يمنع النوم على هذا الجانب ويزداد مع المشي",
                        indicates: "التهاب أوتار الأرداف وجراب الورك (Greater Trochanteric Pain Syndrome)",
                        baseScore: { diagKey: "si_joint_piriformis", prob: 91 }
                    }
                ]
            },
            tier2_mechanical: {
                title: "2. المحفزات الميكانيكية للحوض:",
                options: [
                    { value: "sitting_cross_legged", label: "الجلوس بوضعية تقاطع الساقين أو الجلوس على محفظة جيب خلفية" },
                    { value: "bed_turn_stairs", label: "التقلب في السرير، صعود الدرج، أو ارتداء البنطال واقفاً" },
                    { value: "direct_pressure", label: "الضغط المباشر أو النوم على جانب الورك المصاب" }
                ]
            },
            tier3_neuro_mapping: {
                title: "3. الأعراض المرافقة في الحوض والأرداف:",
                options: [
                    { id: "si_pelvic_tilt", label: "إحساس بعدم استواء الحوض أو أن إحدى الساقين أقصر وظيفياً", weight: 14 },
                    { id: "si_groin_spread", label: "امتداد الألم نحو المغبن ومقدمة الفخذ", weight: 12 },
                    { id: "si_buttock_numb", label: "خدر وتنميل متقطع في خلف الفخذ حتى مستوى الركبة فقط", weight: 12 }
                ]
            },
            tier4_provocation: {
                title: "4. الاختبار السريري الاستدلالي (Figure-4 / Patrick FABER Test):",
                question: "عند الاستلقاء ووضع كاحل الساق المصابة فوق ركبة الساق الأخرى (شكل 4) وإنزال الركبة للجانب:",
                options: [
                    { value: "faber_deep_buttock", label: "ألم وشد عميق يشتد في منطقة الأرداف والمفصل العجزي الحوضي", scoreShift: { si_joint: +15 } },
                    { value: "faber_groin_pinch", label: "قرصة حادة في مقدمة مفصل الورك والمغبن", scoreShift: { hip_joint: +15 } },
                    { value: "faber_normal", label: "مرونة طبيعية بدون ألم حاد", scoreShift: {} }
                ]
            }
        },

        // =====================================================================
        // د. مفصل الكتف والكفة المدورة (Shoulder)
        // =====================================================================
        shoulder_right_f: {
            regionName: "مفصل الكتف والكفة المدورة",
            category: "shoulder",
            tier1_quality: {
                title: "1. ما هو التوصيف السريري لألم الكتف؟",
                options: [
                    {
                        value: "subacromial_impingement",
                        label: "قرصة حادة عند رفع الذراع جانباً للأعلى (قوس ألم مؤلم بين 60-120 درجة) مع صعوبة إنزالها ببطء",
                        indicates: "متلازمة انحشار الكتف واعتلال أوتار الكفة المدورة (Subacromial Impingement)",
                        baseScore: { diagKey: "shoulder_rotator_impingement", prob: 94 }
                    },
                    {
                        value: "adhesive_capsulitis",
                        label: "تصلب وتجمد شديد يمنع حركة الكتف في جميع الاتجاهات (رفع، تدوير، وخلف الظهر) مع ألم ليلي",
                        indicates: "الكتف المتجمد والتهاب المحفظة اللاصق (Adhesive Capsulitis - Frozen Shoulder)",
                        baseScore: { diagKey: "shoulder_rotator_impingement", prob: 93 }
                    },
                    {
                        value: "biceps_tendon",
                        label: "ألم في مقدمة الكتف يشتد عند ثني الكوع أو حمل الأكياس للأمام",
                        indicates: "التهاب وتر العضلة ذات الرأسين العضدية (Biceps Tendinitis)",
                        baseScore: { diagKey: "shoulder_rotator_impingement", prob: 91 }
                    }
                ]
            },
            tier2_mechanical: {
                title: "2. الحركات الأكثر إيلاماً ومحدودية:",
                options: [
                    { value: "overhead_reaching", label: "الوصول للأرفف المرتفعة أو تمشيط الشعر وارتداء القميص" },
                    { value: "hand_behind_back", label: "وضع اليد خلف الظهر لربط الحزام أو حك الظهر" },
                    { value: "night_side_sleep", label: "النوم المباشر على جهة الكتف المصاب والاستيقاظ من الألم" }
                ]
            },
            tier3_neuro_mapping: {
                title: "3. الأعراض المصاحبة للكتف:",
                options: [
                    { id: "s_clicking_pop", label: "طقطقة واحتكاك خشن مسموع عند تدوير المفصل", weight: 12 },
                    { id: "s_sudden_drop", label: "ضعف مفاجئ وسقوط الذراع عند محاولة تثبيتها جانباً (Drop Arm)", weight: 18 },
                    { id: "s_neck_referred", label: "امتداد الألم للأعلى نحو الرقبة ولوح الكتف", weight: 10 }
                ]
            },
            tier4_provocation: {
                title: "4. الاختبار الاستدلالي (Hawkins-Kennedy Correlate):",
                question: "عند رفع الذراع للأمام بزاوية 90 درجة مع ثني الكوع وتدوير الساعد لأسفل نحو البطن:",
                options: [
                    { value: "hawkins_sharp_pinch", label: "تحدث قرصة حادة ومؤلمة جداً تحت عظمة الكتف الأخرمية", scoreShift: { impingement: +15 } },
                    { value: "hawkins_stiff_only", label: "صعوبة ومقاومة تيبس دون قرصة حادة", scoreShift: { frozen_shoulder: +15 } },
                    { value: "hawkins_clear", label: "حركة حرة بدون ألم انحشاري", scoreShift: {} }
                ]
            }
        },

        // =====================================================================
        // هـ. مفصل الكوع والساعد (Elbow)
        // =====================================================================
        elbow_right_f: {
            regionName: "مفصل الكوع والساعد",
            category: "elbow",
            tier1_quality: {
                title: "1. ما هو التوصيف السريري لألم الكوع؟",
                options: [
                    {
                        value: "lateral_epicondylitis",
                        label: "ألم حاد في البروز العظمي الخارجي للكوع يشتد عند المصافحة، حمل إبريق الشاي، أو استخدام الفأرة",
                        indicates: "مرفق لاعب التنس والتهاب أوتار الكوع الخارجية (Lateral Epicondylitis)",
                        baseScore: { diagKey: "elbow_epicondylitis", prob: 95 }
                    },
                    {
                        value: "medial_epicondylitis",
                        label: "ألم في البروز الداخلي للكوع عند ثني المعصم لأسفل أو حمل حقائب ثقيلة",
                        indicates: "مرفق لاعب الجولف والتهاب الأوتار القابضة (Medial Epicondylitis)",
                        baseScore: { diagKey: "elbow_epicondylitis", prob: 93 }
                    },
                    {
                        value: "cubital_tunnel",
                        label: "تنميل ووخز كهربائي يمتد على طول الساعد الداخلي نحو الخنصر والبنصر",
                        indicates: "متلازمة النفق المرفقي وانضغاط العصب الزندي (Cubital Tunnel Syndrome)",
                        baseScore: { diagKey: "elbow_epicondylitis", prob: 92 }
                    }
                ]
            },
            tier2_mechanical: {
                title: "2. الأنشطة المحفزة لألم الكوع:",
                options: [
                    { value: "gripping_twisting", label: "عصر الملابس، فتح الأغطية، أو تدوير مقبض الباب والمفتاح" },
                    { value: "sustained_elbow_bend", label: "ثني الكوع المستمر (مثل وضع الهاتف على الأذن أو ثني الذراع أثناء النوم)" },
                    { value: "typing_clicking", label: "النقر المتكرر على الفأرة ولوحة المفاتيح" }
                ]
            },
            tier3_neuro_mapping: {
                title: "3. الأعراض المصاحبة في الكوع:",
                options: [
                    { id: "e_pinky_numb", label: "خدر وتنميل مستمر في إصبع الخنصر والبنصر", weight: 15 },
                    { id: "e_grip_weakness", label: "ضعف في عزم اليد وصعوبة فتح البرطمانات", weight: 14 },
                    { id: "e_tender_bone", label: "ألم شديد جداً عند لمس البروز العظمي للكوع بالإصبع", weight: 14 }
                ]
            },
            tier4_provocation: {
                title: "4. الاختبار الاستدلالي (Cozen's Tennis Elbow Correlate):",
                question: "عند مد الكوع بالكامل وجعل قبضة اليد لأسفل ثم محاولة رفع المعصم لأعلى ضد مقاومة باليد الأخرى:",
                options: [
                    { value: "cozen_sharp_bone", label: "يحدث ألم حاد ومفاجئ في عظمة الكوع الخارجية فوراً (إيجابي لمرفق التنس)", scoreShift: { tennis_elbow: +15 } },
                    { value: "cozen_negative", label: "لا يثير هذا الاختبار ألم عظمة الكوع", scoreShift: { tennis_elbow: -10 } }
                ]
            }
        },

        // =====================================================================
        // و. مفصل الرسغ واليد ونفق الرسغ (Wrist & Hand)
        // =====================================================================
        wrist_right_f: {
            regionName: "الرسغ واليد ونفق الرسغ",
            category: "wrist",
            tier1_quality: {
                title: "1. ما هو التوصيف السريري لألم الرسغ واليد؟",
                options: [
                    {
                        value: "carpal_tunnel_median",
                        label: "تنميل وخدر وحرارة كهربائية في الإبهام والسبابة والوسطى تشتد ليلاً وتوقظك من النوم",
                        indicates: "متلازمة النفق الرسغي وانضغاط العصب الأوسط (Carpal Tunnel Syndrome)",
                        baseScore: { diagKey: "wrist_carpal_tunnel", prob: 95 }
                    },
                    {
                        value: "dequervain_thumb",
                        label: "ألم حاد في قاعدة الإبهام وجانب الرسغ عند ثني الإبهام داخل الكف أو حمل الهاتف",
                        indicates: "متلازمة دي كورفان والتهاب غمد أوتار الإبهام (De Quervain's Tenosynovitis)",
                        baseScore: { diagKey: "wrist_carpal_tunnel", prob: 93 }
                    },
                    {
                        value: "wrist_ligament_sprain",
                        label: "ألم وتيبس عميق عند الاتكاء على راحة اليد (مثل تمرين الضغط أو النهوض من السرير)",
                        indicates: "إجهاد أربطة الرسغ وانحشار العظام الهلالية (Wrist Sprain & Impingement)",
                        baseScore: { diagKey: "wrist_carpal_tunnel", prob: 90 }
                    }
                ]
            },
            tier2_mechanical: {
                title: "2. المحفزات الميكانيكية للرسغ:",
                options: [
                    { value: "night_wrist_bend", label: "أثناء النوم مع ثني المعصم دون وعي، والاستيقاظ مع خدر في الأصابع" },
                    { value: "typing_scrolling", label: "الطباعة الطويلة أو استخدام الفأرة وتصفح الهاتف بالإبهام" },
                    { value: "weight_on_palm", label: "الاتكاء بوزن الجسم على راحة اليد المفرودة" }
                ]
            },
            tier3_neuro_mapping: {
                title: "3. الأعراض المصاحبة للرسغ واليد:",
                options: [
                    { id: "w_drop_cups", label: "ضعف مفاجئ في مسك الأكواب وسقوط الأشياء من اليد", weight: 16 },
                    { id: "w_shake_relief", label: "الاضطرار إلى 'نفض' أو هز اليد بالهواء لتخفيف التنميل (Flick Sign)", weight: 15 },
                    { id: "w_morning_stiff", label: "تيبس في مفاصل الأصابع عند الاستيقاظ صباحاً", weight: 10 }
                ]
            },
            tier4_provocation: {
                title: "4. الاختبار السريري الاستدلالي (Phalen's Wrist Flexion Test):",
                question: "عند ضم ظهر الكفين لبعضهما مع ثني المعصمين لأسفل بزاوية 90 درجة لمدة 60 ثانية:",
                options: [
                    { value: "phalen_numb_fingers", label: "يبدأ التنميل والوخز في الإبهام والسبابة خلال أقل من دقيقة (إيجابي للنفق الرسغي)", scoreShift: { carpal_tunnel: +18 } },
                    { value: "phalen_clear", label: "لا يحدث تنميل إضافي في الأصابع", scoreShift: { carpal_tunnel: -10 } }
                ]
            }
        },

        // =====================================================================
        // ز. مفصل الركبة والصابونة (Knee Joint)
        // =====================================================================
        knee_right_f: {
            regionName: "مفصل الركبة والصابونة",
            category: "knee",
            tier1_quality: {
                title: "1. ما هو التوصيف السريري لألم الركبة؟",
                options: [
                    {
                        value: "patellofemoral_tracking",
                        label: "ألم أمامي حول وخلف صابونة الركبة يشتد بشكل خاص عند نزول الدرج أو القرفصاء والجلوس الطويل",
                        indicates: "متلازمة الألم الرضفي الفخذي واحتكاك الصابونة (Patellofemoral Pain Syndrome)",
                        baseScore: { diagKey: "knee_patellofemoral", prob: 94 }
                    },
                    {
                        value: "meniscal_strain",
                        label: "ألم حاد في خط المفصل الجانبي مع إحساس بالتعليق أو 'القفل' الميكانيكي عند ثني أو فرد المفصل",
                        indicates: "إجهاد واعتلال الغضروف الهلالي للركبة (Meniscal Tear / Strain)",
                        baseScore: { diagKey: "knee_patellofemoral", prob: 93 }
                    },
                    {
                        value: "knee_osteoarthritis",
                        label: "تيبس واحتكاك مزمن وخشونة عند القيام صباحاً يلين تدريجياً بعد المشي لبضع دقائق",
                        indicates: "خشونة واحتكاك مفصل الركبة الميكانيكي (Knee Osteoarthritis)",
                        baseScore: { diagKey: "knee_patellofemoral", prob: 92 }
                    }
                ]
            },
            tier2_mechanical: {
                title: "2. الأنشطة والمحفزات الأكثر ألماً للركبة:",
                options: [
                    { value: "downstairs_squat", label: "نزول الدرج، القرفصاء، الركوع، أو الجلوس على الأرض (Patellofemoral Load)" },
                    { value: "twisting_pivot", label: "الالتفاف المفاجئ على الركبة أثناء المشي أو تغيير الاتجاه (Meniscal Shear)" },
                    { value: "prolonged_standing", label: "الوقوف الطويل أو المشي لمسافات طويلة على أسطح صلبة (Axial Joint Load)" }
                ]
            },
            tier3_neuro_mapping: {
                title: "3. الأعراض المصاحبة للركبة:",
                options: [
                    { id: "k_giving_way", label: "شعور بأن الركبة تفلت أو 'تخون' فجأة أثناء المشي (Instability)", weight: 16 },
                    { id: "k_clicking_crepitus", label: "طقطقة وفرقعة خشنة واضحة عند ثني ومد الركبة (Crepitus)", weight: 12 },
                    { id: "k_mild_swelling", label: "انتفاخ أو تجمع سوائل خفيف بعد النشاط والمشي", weight: 12 }
                ]
            },
            tier4_provocation: {
                title: "4. الاختبار الاستدلالي (Patellar Compression & Clarke Correlate):",
                question: "عند الجلوس مع فرد الساق والضغط الخفيف على صابونة الركبة أثناء شد عضلة الفخذ:",
                options: [
                    { value: "patellar_grind_pain", label: "يحدث احتكاك وألم موضعي حاد تحت الصابونة مباشرة (إيجابي لاحتكاك الصابونة)", scoreShift: { patellofemoral: +15 } },
                    { value: "patellar_clear", label: "لا يوجد ألم موضعي تحت الصابونة بل في جوانب المفصل", scoreShift: { meniscus_oa: +15 } }
                ]
            }
        },

        // =====================================================================
        // ح. الكاحل ومفصل القدم ووتر أكيليس (Ankle & Foot)
        // =====================================================================
        ankle_right_f: {
            regionName: "الكاحل ومفصل القدم واللفافة الأخمصية",
            category: "ankle",
            tier1_quality: {
                title: "1. ما هو التوصيف السريري لألم القدم والكاحل؟",
                options: [
                    {
                        value: "plantar_fasciitis_heel",
                        label: "ألم حاد كالمسمار في كعب القدم مع الخطوات الأولى عند الاستيقاظ صباحاً يقل تدريجياً مع المشي",
                        indicates: "التهاب اللفافة الأخمصية ومسمار العظم (Plantar Fasciitis)",
                        baseScore: { diagKey: "ankle_plantar_achilles", prob: 95 }
                    },
                    {
                        value: "achilles_tendinopathy",
                        label: "ألم وتيبس خلف الكاحل في وتر العرقوب (أكيليس) يشتد بعد المشي أو صعود المرتفعات",
                        indicates: "اعتلال والتهاب وتر أكيليس (Achilles Tendinopathy)",
                        baseScore: { diagKey: "ankle_plantar_achilles", prob: 93 }
                    },
                    {
                        value: "ankle_ligament_sprain",
                        label: "ألم وتورم على الجانب الخارجي للكاحل بعد التواء في القدم أو السير على أرض غير مستوية",
                        indicates: "التواء وتمطط أربطة الكاحل الخارجية (Lateral Ankle Sprain)",
                        baseScore: { diagKey: "ankle_plantar_achilles", prob: 92 }
                    }
                ]
            },
            tier2_mechanical: {
                title: "2. المحفزات الميكانيكية للقدم والكاحل:",
                options: [
                    { value: "morning_first_steps", label: "أول خطوة عند النهوض من السرير صباحاً (First-Step Pain)" },
                    { value: "barefoot_hard_floor", label: "المشي حافي القدمين على السيراميك أو الأسطح الصلبة" },
                    { value: "pushing_off_running", label: "دفع القدم للأمام بقوة عند الجري أو صعود المرتفعات" }
                ]
            },
            tier3_neuro_mapping: {
                title: "3. الأعراض المصاحبة للقدم والكاحل:",
                options: [
                    { id: "a_calf_tightness", label: "شد وتشنج قوي في عضلات السمانة الخلفية", weight: 12 },
                    { id: "a_burning_sole", label: "حرارة أو وخز حارق في باطن القدم والأصابع", weight: 12 },
                    { id: "a_flatfoot_collapse", label: "تسطح في باطن القدم (فلات فوت) وميلان الكاحل للداخل", weight: 14 }
                ]
            },
            tier4_provocation: {
                title: "4. الاختبار السريري الاستدلالي (Windlass Plantar Test):",
                question: "عند الوقوف أو الجلوس ورفع وثني إصبع القدم الكبير للأعلى لأقصى مدى بيدك:",
                options: [
                    { value: "windlass_sharp_heel", label: "يشتد ألم الشد كالمسمار في قاع كعب القدم فوراً (إيجابي لالتهاب اللفافة الأخمصية)", scoreShift: { plantar: +18 } },
                    { value: "windlass_clear", label: "لا يؤثر رفع إصبع القدم على ألم الكاحل", scoreShift: { achilles: +15 } }
                ]
            }
        }
    };

    // تعيين التماثل للنقاط اليسرى والنقاط المشتركة
    ADVANCED_CLINICAL_KNOWLEDGE.cervical_front = ADVANCED_CLINICAL_KNOWLEDGE.cervical_back;
    ADVANCED_CLINICAL_KNOWLEDGE.trapezius_right = ADVANCED_CLINICAL_KNOWLEDGE.cervical_back;
    ADVANCED_CLINICAL_KNOWLEDGE.trapezius_left = ADVANCED_CLINICAL_KNOWLEDGE.cervical_back;
    ADVANCED_CLINICAL_KNOWLEDGE.scapula_right = ADVANCED_CLINICAL_KNOWLEDGE.cervical_back;
    ADVANCED_CLINICAL_KNOWLEDGE.scapula_left = ADVANCED_CLINICAL_KNOWLEDGE.cervical_back;

    // =====================================================================
    // ط. الفقرات الصدرية وأعلى الظهر (Thoracic Spine & Mid-Back)
    // =====================================================================
    ADVANCED_CLINICAL_KNOWLEDGE.thoracic_spine = {
        regionName: "الفقرات الصدرية وأعلى وسط الظهر",
        category: "thoracic",
        tier1_quality: {
            title: "1. ما هو التوصيف السريري لألم وسط وأعلى الظهر؟",
            options: [
                {
                    value: "thoracic_facet",
                    label: "نغزة أو طعنة حادة بين لوحي الكتف تشتد عند التنفس العميق أو الالتفاف المفاجئ",
                    indicates: "خلل وانحباس مفاصل الفقرات الصدرية (Thoracic Facet Dysfunction)",
                    baseScore: { diagKey: "thoracic_facet_dysfunction", prob: 93 }
                },
                {
                    value: "rhomboid_trigger",
                    label: "شد وتشنج مؤلم وعقد صلبة بين الكتف والعمود الفقري تزداد مع الجلوس المكتبي الطويل",
                    indicates: "عقد زنادية تشنجية في العضلات المعينية والأبهر (Rhomboid Myofascial Trigger Points)",
                    baseScore: { diagKey: "thoracic_scapular_strain", prob: 94 }
                },
                {
                    value: "thoracic_disc",
                    label: "ألم طوقي يدور حول الصدر كالحزام مع تنميل خفيف في جانب الجذع",
                    indicates: "ضغط على الأعصاب الوربية في الفقرات الصدرية (Thoracic Disc & Intercostal Neuralgia)",
                    baseScore: { diagKey: "thoracic_facet_dysfunction", prob: 91 }
                }
            ]
        },
        tier2_mechanical: {
            title: "2. الأنشطة التي تزيد ألم وسط الظهر:",
            options: [
                { value: "prolonged_sitting_desk", label: "الجلوس الطويل أمام الكمبيوتر مع انحناء الظهر للأمام" },
                { value: "deep_breath_twist", label: "أخذ نفس عميق جداً أو الالتفاف المفاجئ للجذع" },
                { value: "heavy_bag_one_side", label: "حمل حقيبة ثقيلة على جهة واحدة أو العمل المنحني" }
            ]
        },
        tier3_neuro_mapping: {
            title: "3. الأعراض المصاحبة لألم وسط الظهر:",
            options: [
                { id: "t_breath_pain", label: "تزايد واضح للألم عند أخذ نفس عميق أو السعال", weight: 14 },
                { id: "t_rib_wrap", label: "إحساس بألم يلتف من الظهر للأمام نحو الصدر على نفس المستوى (كالحزام)", weight: 14 },
                { id: "t_scapula_click", label: "صوت طقطقة أو احتكاك عند تحريك الكتف أو لوح الكتف", weight: 10 }
            ]
        },
        tier4_provocation: {
            title: "4. الاختبار الاستدلالي (Thoracic Rotation Test):",
            question: "عند الجلوس والتفاف الجذع ببطء لليمين ثم لليسار:",
            options: [
                { value: "t_rotation_sharp", label: "تحدث نغزة حادة موضعية في نقطة محددة بالظهر تمنع الاكتمال (إيجابي للمفاصل الصدرية)", scoreShift: { facet: +15 } },
                { value: "t_rotation_stiff", label: "تيبس وصعوبة للوصول للمدى الكامل مع شد عضلي منتشر", scoreShift: { muscular: +15 } },
                { value: "t_rotation_clear", label: "حركة دوران مقبولة لكن ألم واضح عند التنفس العميق فقط", scoreShift: { disc_nerve: +12 } }
            ]
        }
    };

    // =====================================================================
    // ي. القفص الصدري وعظم القص والأضلاع (Chest & Sternum)
    // =====================================================================
    ADVANCED_CLINICAL_KNOWLEDGE.chest_sternum = {
        regionName: "القفص الصدري وعظم القص والأضلاع",
        category: "chest_ribs",
        tier1_quality: {
            title: "1. ما هو التوصيف السريري لألم الصدر الميكانيكي؟",
            options: [
                {
                    value: "costochondritis_pain",
                    label: "ألم وضغط أمام الصدر بجانب عظمة القص يشتد بالضغط المباشر أو التنفس العميق أو السعال",
                    indicates: "التهاب الغضاريف الضلعية الميكانيكي (Costochondritis)",
                    baseScore: { diagKey: "costochondritis_rib", prob: 93 }
                },
                {
                    value: "rib_dysfunction",
                    label: "نغزة حادة كالإبرة في جانب الضلع أو الخاصرة تزداد مع التقلب والانحناء المفاجئ",
                    indicates: "خلل حركي في مفاصل الأضلاع الفقرية (Rib Head Dysfunction)",
                    baseScore: { diagKey: "costochondritis_rib", prob: 91 }
                },
                {
                    value: "intercostal_strain",
                    label: "شد وإجهاد عضلي مؤلم بين الأضلاع يشتد عند الحركة أو الضحك القوي أو الانحناء للجانب",
                    indicates: "إجهاد العضلات الوربية بين الأضلاع (Intercostal Muscle Strain)",
                    baseScore: { diagKey: "costochondritis_rib", prob: 90 }
                }
            ]
        },
        tier2_mechanical: {
            title: "2. المحفزات الميكانيكية لألم الصدر:",
            options: [
                { value: "deep_breath_cough", label: "التنفس العميق أو السعال أو العطاس المفاجئ" },
                { value: "press_on_chest", label: "الضغط المباشر باليد على الصدر أو النوم على البطن" },
                { value: "arms_overhead", label: "مد الذراعين للأعلى أو الالتواء المفاجئ للجذع" }
            ]
        },
        tier3_neuro_mapping: {
            title: "3. الأعراض المصاحبة لألم الصدر الميكانيكي:",
            options: [
                { id: "c_tender_press", label: "ألم حاد عند الضغط بالإصبع على نقطة محددة بجانب عظمة القص", weight: 16 },
                { id: "c_belt_wrap", label: "إحساس بألم يلتف كالحزام من الأمام للخلف على نفس مستوى الضلع", weight: 12 },
                { id: "c_arm_raise_worse", label: "تزايد الألم عند رفع الذراع للأعلى أو مد اليدين للجانبين", weight: 10 }
            ]
        },
        tier4_provocation: {
            title: "4. الاختبار الاستدلالي (Sternocostal Pressure Test):",
            question: "عند الضغط الخفيف بأطراف أصابعك على منطقة الألم بجانب عظمة القص:",
            options: [
                { value: "sternum_sharp_press", label: "يحدث ألم حاد ومباشر عند الضغط على نقطة محددة (إيجابي لالتهاب الغضاريف الضلعية)", scoreShift: { costochondritis: +18 } },
                { value: "sternum_diffuse", label: "ألم منتشر غير محدد مع صعوبة في تحديد المنطقة بالضبط", scoreShift: { muscular: +12 } },
                { value: "sternum_breath_only", label: "لا يُثير الضغط ألماً ولكن حركة الالتفاف أو التنفس مؤلمة فقط", scoreShift: { rib_facet: +15 } }
            ]
        }
    };

    // =====================================================================
    // ك. الرأس والصداع (Head & Headache)
    // =====================================================================
    const headache_knowledge = {
        regionName: "الرأس والصداع",
        category: "headache",
        tier1_quality: {
            title: "1. ما هو التوصيف السريري الأقرب لصداعك؟",
            options: [
                {
                    value: "tension_headache",
                    label: "ضغط وشد كالحزام حول الرأس بالكامل مع ثقل في المؤخرة وتصلب الرقبة، يزداد مع التوتر والعمل الطويل",
                    indicates: "صداع التوتر العضلي والرقبة (Tension-Type & Cervicogenic Headache)",
                    baseScore: { diagKey: "tension_cervicogenic_headache", prob: 93 }
                },
                {
                    value: "cervicogenic_headache",
                    label: "صداع يبدأ من قاعدة الجمجمة ويمتد كالموجة فوق الرأس نحو العين أو الجبهة مع تصلب العنق",
                    indicates: "الصداع عنقي المنشأ من الفقرات العنقية العلوية C1-C3 (Cervicogenic Headache)",
                    baseScore: { diagKey: "tension_cervicogenic_headache", prob: 94 }
                },
                {
                    value: "migraine_like",
                    label: "صداع نابض في نصف الرأس مع حساسية للضوء والصوت وغثيان، يجبرك على الراحة في الهدوء والظلام",
                    indicates: "صداع نصفي — يُنصح بمراجعة طبيب متخصص (Migraine-Type Headache)",
                    baseScore: { diagKey: "tension_cervicogenic_headache", prob: 85 }
                }
            ]
        },
        tier2_mechanical: {
            title: "2. المحفزات الأكثر شيوعاً لصداعك:",
            options: [
                { value: "stress_screen", label: "الإجهاد الذهني والعمل المكتبي الطويل والتحديق في الشاشات" },
                { value: "neck_position", label: "وضعية معينة للرأس (الانحناء للشاشة، أو النوم على وسادة غير ملائمة)" },
                { value: "sleep_jaw", label: "قلة النوم أو صرير الأسنان اللاإرادي أثناء النوم (Bruxism)" }
            ]
        },
        tier3_neuro_mapping: {
            title: "3. الأعراض المصاحبة لصداعك:",
            options: [
                { id: "h_neck_stiff", label: "تصلب وتيبس ملحوظ في الرقبة مرتبط ببداية الصداع أو يسبقه", weight: 14 },
                { id: "h_eye_pressure", label: "ضغط وثقل حول العين أو الجبهة أو الصدغ من جانب الصداع", weight: 12 },
                { id: "h_scalp_tender", label: "حساسية وألم عند تمشيط الشعر أو لمس فروة الرأس", weight: 10 }
            ]
        },
        tier4_provocation: {
            title: "4. الاختبار الاستدلالي (Suboccipital Pressure Test):",
            question: "عند الضغط بلطف بإصبعيك على قاعدة الجمجمة (أسفل الرأس مباشرة فوق الرقبة) لمدة 20 ثانية:",
            options: [
                { value: "h_suboccipital_trigger", label: "يبدأ أو يشتد الصداع المعتاد أو يمتد من الخلف للأمام نحو العين (إيجابي للمنشأ العنقي)", scoreShift: { cervicogenic: +18 } },
                { value: "h_pressure_relief", label: "الضغط يُخفف الصداع قليلاً أو يُشعر بارتخاء في قاعدة الجمجمة", scoreShift: { tension_muscle: +12 } },
                { value: "h_no_change", label: "لا يتغير الصداع بالضغط على قاعدة الجمجمة", scoreShift: { migraine: +10 } }
            ]
        }
    };

    // ✅ إصلاح: head_back و head_forehead تحصل الآن على أسئلة الصداع المخصصة
    ADVANCED_CLINICAL_KNOWLEDGE.head_back = headache_knowledge;
    ADVANCED_CLINICAL_KNOWLEDGE.head_forehead = headache_knowledge;

    ADVANCED_CLINICAL_KNOWLEDGE.shoulder_left_f = ADVANCED_CLINICAL_KNOWLEDGE.shoulder_right_f;
    ADVANCED_CLINICAL_KNOWLEDGE.elbow_left_f = ADVANCED_CLINICAL_KNOWLEDGE.elbow_right_f;
    ADVANCED_CLINICAL_KNOWLEDGE.wrist_left_f = ADVANCED_CLINICAL_KNOWLEDGE.wrist_right_f;
    ADVANCED_CLINICAL_KNOWLEDGE.knee_left_f = ADVANCED_CLINICAL_KNOWLEDGE.knee_right_f;
    ADVANCED_CLINICAL_KNOWLEDGE.ankle_left_f = ADVANCED_CLINICAL_KNOWLEDGE.ankle_right_f;
    ADVANCED_CLINICAL_KNOWLEDGE.achilles_calf = ADVANCED_CLINICAL_KNOWLEDGE.ankle_right_f;
    ADVANCED_CLINICAL_KNOWLEDGE.point_37515 = ADVANCED_CLINICAL_KNOWLEDGE.ankle_right_f;
    ADVANCED_CLINICAL_KNOWLEDGE.hamstring_back = ADVANCED_CLINICAL_KNOWLEDGE.knee_right_f;
    ADVANCED_CLINICAL_KNOWLEDGE.sacroiliac_left = ADVANCED_CLINICAL_KNOWLEDGE.sacroiliac_right;
    ADVANCED_CLINICAL_KNOWLEDGE.gluteal_right = ADVANCED_CLINICAL_KNOWLEDGE.sacroiliac_right;
    ADVANCED_CLINICAL_KNOWLEDGE.gluteal_left = ADVANCED_CLINICAL_KNOWLEDGE.sacroiliac_right;
    ADVANCED_CLINICAL_KNOWLEDGE.pelvis_groin = ADVANCED_CLINICAL_KNOWLEDGE.sacroiliac_right;
    ADVANCED_CLINICAL_KNOWLEDGE.hip_right_f = ADVANCED_CLINICAL_KNOWLEDGE.sacroiliac_right;
    ADVANCED_CLINICAL_KNOWLEDGE.hip_left_f = ADVANCED_CLINICAL_KNOWLEDGE.sacroiliac_right;

    // معايير الأعلام الحمراء للسلامة السريرية
    const RED_FLAGS_CRITERIA = [
        { id: "fever_weight", label: "ارتفاع حرارة غير مبرر أو نزول مفاجئ حاد في الوزن مصاحب للألم" },
        { id: "sphincter_loss", label: "فقدان مفاجئ للتحكم في الإخراج أو التبول (متلازمة ذيل الفرس)" },
        { id: "severe_trauma", label: "حدوث الألم مباشرة إثر حادث سير أو سقوط قوي مباشر على العظم" },
        { id: "rapid_drop_foot", label: "ضعف عضلي حاد وسريع مع عدم القدرة على رفع مشط القدم (سقوط القدم)" },
        { id: "cancer_history", label: "تاريخ طبي سابق لأورام خبيثة أو علاج كيميائي نشط" }
    ];

    // جلب بيانات الفحص للنقطة
    function getQuestionsForPoint(pointId) {
        let pData = ADVANCED_CLINICAL_KNOWLEDGE[pointId];
        if (!pData) {
            if (pointId.includes("wrist")) pData = ADVANCED_CLINICAL_KNOWLEDGE.wrist_right_f;
            else if (pointId.includes("elbow")) pData = ADVANCED_CLINICAL_KNOWLEDGE.elbow_right_f;
            else if (pointId.includes("shoulder")) pData = ADVANCED_CLINICAL_KNOWLEDGE.shoulder_right_f;
            // ✅ إصلاح: head يحول للصداع، ليس للرقبة
            else if (pointId.includes("head") || pointId.includes("forehead")) pData = ADVANCED_CLINICAL_KNOWLEDGE.head_back;
            else if (pointId.includes("cervical") || pointId.includes("neck") || pointId.includes("trapezius")) pData = ADVANCED_CLINICAL_KNOWLEDGE.cervical_back;
            // ✅ إصلاح: thoracic و chest لهما قواعد مستقلة
            else if (pointId.includes("thoracic")) pData = ADVANCED_CLINICAL_KNOWLEDGE.thoracic_spine;
            else if (pointId.includes("chest") || pointId.includes("sternum") || pointId.includes("rib")) pData = ADVANCED_CLINICAL_KNOWLEDGE.chest_sternum;
            else if (pointId.includes("knee")) pData = ADVANCED_CLINICAL_KNOWLEDGE.knee_right_f;
            else if (pointId.includes("ankle") || pointId.includes("foot") || pointId.includes("achilles") || pointId.includes("calf") || pointId.includes("37515")) pData = ADVANCED_CLINICAL_KNOWLEDGE.ankle_right_f;
            else if (pointId.includes("sacroiliac") || pointId.includes("gluteal") || pointId.includes("hip")) pData = ADVANCED_CLINICAL_KNOWLEDGE.sacroiliac_right;
            else pData = ADVANCED_CLINICAL_KNOWLEDGE.lumbar_spine;
        }
        return pData;
    }

    // خوارزمية التشخيص السريري والاستدلال البيوميكانيكي
    function analyzeAssessment({ pointId, painArea, painSeverity, painDuration, answers = {}, redFlagsSelected = [], chronicDiseases = [], patientVitals = {}, userNotes = "" }) {
        if (redFlagsSelected.length > 0) {
            return {
                isRedFlag: true,
                title: "🚨 تنبيه طبي عاجل - يتطلب كشفاً سريرياً مباشراً",
                summary: "بناءً على وجود علامات تحذيرية تستدعي الحيطة السريرية المباشرة، نوصي بمراجعة المعالج المختص لإجراء الفحوصات التشخيصية قبل البدء بالتمارين.",
                recommendations: [
                    "التواصل المباشر مع المعالج لإجراء الفحص السريري.",
                    "تجنب حمل الأوزان الثقيلة أو الحركات المفاجئة.",
                    "إجراء صورة تشخيصية مناسبة حسب توجيه المعالج."
                ]
            };
        }

        const pointData = getQuestionsForPoint(pointId || painArea);
        const q1Val = answers.q1 || "";
        const q2Val = answers.q2 || "";
        const q4Val = answers.q4 || "";
        const notes = (userNotes || "").toLowerCase();

        const matchedQ1 = pointData?.tier1_quality?.options?.find(o => o.value === q1Val);

        let primaryDiagnosis = "";
        let secondaryDiagnosis = "";
        let primaryDiagnosisKey = "lumbar_mechanical_strain";
        let probability = 92;
        let confidenceScore = 96;
        let biomechanicalMechanism = "";
        let rootLevel = "";
        let aggravatingFactors = [];
        let relievingFactors = [];
        let chiropracticProtocol = "";

        const hasAnyClinicalData = Boolean(
            q1Val || q2Val || q4Val ||
            (answers.allSelectedSymptoms && answers.allSelectedSymptoms.length > 0) ||
            (notes && /ألم|وجع|خدر|تنميل|حرارة|حرقان|لسعة|كهربا|شد|تشنج|عصب|ديسك|فقرات|ظهر|رقبة|ركبة|كتف|ساق|رجل|صداع/i.test(notes))
        );

        let isPreliminary = !hasAnyClinicalData;

        // في حال عدم توفير أي أعراض أو وصف، توليد تقرير استرشادي وقائي عام
        if (isPreliminary) {
            const regName = pointData?.regionName || "المنطقة المحددة";
            primaryDiagnosis = `تقرير استرشادي وتأهيلي عام لمنطقة (${regName})`;
            primaryDiagnosisKey = "preliminary_guidance";
            secondaryDiagnosis = "فحص وقائي أولي استرشادي - بانتظار استكمال الأعراض الدقيقة";
            probability = 70;
            confidenceScore = 65;
            rootLevel = "تقييم ميكانيكي حركي أولي";
            biomechanicalMechanism = `تم إعداد هذا التقرير كدليل وقائي وتأهيلي أولي استناداً لنقطة الألم المختارة على المجسم (${regName}). لتحديد التشخيص السريري الدقيق والتحقق من وجود انزلاق غضروفي أو ضغط عصبي بنسبة دقة عالية، يُرجى وصف طبيعة ألمك للطبيب الافتراضي أو الإجابة على أسئلة الفحص السريع المباشرة.`;
            aggravatingFactors = ["الجلوس أو الوقوف المتواصل لأكثر من 35 دقيقة", "الحركات المفاجئة أو حمل الأوزان دون انحناء الركبتين", "إجهاد المفصل دون استراحة"];
            relievingFactors = ["أداء التمارين التأهيلية الآمنة الموضحة أدناه بانتظام", "المشي الخفيف وتنشيط الدورة الدموية", "تطبيق الكمادات المعتدلة والاسترخاء"];
            chiropracticProtocol = "فحص سريري يدوي متقدم في مركز «وداعاً للألم» لتقييم مدى حركة المفاصل ومحاذاة الفقرات بدقة متناهية وتحديد خطة علاجية مخصصة.";
        }
        // تحليل متقدم لحالات أسفل الظهر عند توفر بيانات
        else if ((pointId || "").includes("lumbar") || (pointId || "").includes("back")) {
            if (q1Val === "disc_radicular" || notes.includes("ديسك") || notes.includes("غضروف") || notes.includes("عرق النسا") || q4Val.includes("sharp")) {
                primaryDiagnosis = "انزلاق غضروفي قطني خلفي مع اعتلال الجذور العصبية L4-S1 (Lumbar Disc Herniation & Radiculopathy)";
                primaryDiagnosisKey = "lumbar_disc_herniation";
                secondaryDiagnosis = "تشنج العضلة الكمثرية وعرق النسا العضلي الثانوي";
                probability = 96;
                rootLevel = "L4-L5 / L5-S1";
                biomechanicalMechanism = "بروز نواة الغضروف الفقرية (Nucleus Pulposus) نحو الخلف والجانب مسببة ضغطاً انضغاطياً والتهابياً مباشراً على جذور العصب الوركي، مما يفسر امتداد الألم الكهربائي والخدر على طول مسار الساق والقدم.";
                aggravatingFactors = ["الانحناء للأمام وحمل الأوزان", "الجلوس المتواصل الطويل في السيارة أو المكتب", "السعال أو العطاس المفاجئ"];
                relievingFactors = ["تمديد الفقرات القطنية للخلف (McKenzie)", "المشي القصير على أرض مستوية", "الاستلقاء مع دعم خفيف لأسفل الظهر"];
                chiropracticProtocol = "تقويم وتفريغ الضغط الغضروفي يدوياً (Manual Decompression & Cox Flexion-Distraction) لفتح المخارج العصبية وتوجيه الغضروف للمركز خلال جلسة 30 دقيقة.";
            } else if (q1Val === "facet_extension" || q1Val === "stenosis_neurogenic" || notes.includes("انزلاق فقاري") || notes.includes("احتكاك") || notes.includes("تضيق")) {
                primaryDiagnosis = "متلازمة مفاصل الفقرات القطنية والانزلاق الفقاري الوظيفي (Lumbar Facet Syndrome & Spondylolisthesis)";
                primaryDiagnosisKey = "lumbar_facet_spondylolisthesis";
                secondaryDiagnosis = "تضيق نسبي في المخارج العصبية الشوكية مع إجهاد الأربطة القطنية";
                probability = 94;
                rootLevel = "L3-L4 / L4-L5 Facet Joints";
                biomechanicalMechanism = "احتكاك ميكانيكي وتآكل في المحفظة الزلالية لمفاصل الفقرات الخلفية (Facet Joints) ناتج عن انخفاض ارتفاع الغضاريف أو انزلاق فقاري طفيف، مما يسبب انحباساً مؤلماً عند فرد الظهر للخلف والوقوف المديد.";
                aggravatingFactors = ["الوقوف المستقيم المديد", "إرجاع الظهر للخلف (Extension)", "المشي لمسافات طويلة دون استراحة"];
                relievingFactors = ["الجلوس وثني الجذع للأمام قليلاً", "سحب الركبتين نحو الصدر (Williams Flexion)", "الاستلقاء بوضعية الجنين"];
                chiropracticProtocol = "إعادة موازنة محاذاة مفاصل الفقرات القطنية وتليين المحفظة المفصلية لتوسيع المخارج العصبية وتفريغ التشنج العضلي العكسي.";
            } else {
                primaryDiagnosis = "إجهاد ميكانيكي قطني وتشنج العضلات الموازية للفقرات (Mechanical Lumbar Strain & Core Imbalance)";
                primaryDiagnosisKey = "lumbar_mechanical_strain";
                secondaryDiagnosis = "قصور ثبات عضلات الجذع العميقة وتيبس الأربطة القطنية الحرقفية";
                probability = 93;
                rootLevel = "L1-S1 Musculoligamentous";
                biomechanicalMechanism = "إرهاق مزمن وتشنج دفاعي في عضلات نصب الفقرات (Erector Spinae) نتيجة ضعف ثبات عضلات الجذع والجلوس الوضعي الخاطئ.";
                aggravatingFactors = ["الجلوس المنحني لأكثر من 45 دقيقة", "الحركات المفاجئة دون إحماء", "التوتر والتعرض لتيارات الهواء البارد"];
                relievingFactors = ["تطبيق الكمادات الدافئة", "تمرين القطة والبقرة", "المشي الخفيف وتنشيط الدورة الدموية"];
                chiropracticProtocol = "إطلاق نقاط الزناد العضلية (Myofascial Trigger Point Release) وتعديل ميكانيكا الحوض والفقرات لاستعادة التوازن العضلي الطبيعي.";
            }
        }
        // تحليل حالات الصداع والرأس
        else if ((pointId || "").includes("head") || (pointId || "").includes("forehead")) {
            if (q1Val === "migraine_like" || notes.includes("شقيقة") || notes.includes("نصفي") || notes.includes("نبض")) {
                primaryDiagnosis = "صداع وعائي نصفي / شقيقة مع حساسية حسية (Migraine-Type Headache)";
                primaryDiagnosisKey = "tension_cervicogenic_headache";
                secondaryDiagnosis = "تشنج العضلات الصدغية والقفوية المصاحب";
                probability = 88;
                rootLevel = "Trigeminovascular & C1-C2";
                biomechanicalMechanism = "فرط استثارة في المسارات العصبية الوعائية للرأس تسبب تمدداً نابضاً في الأوعية الدموية مع تشنج ثانوي في عضلات الرقبة وفروة الرأس.";
                aggravatingFactors = ["الأضواء الساطعة والضوضاء القوية", "قلة النوم وتخطي الوجبات", "الإجهاد الذهني والتوتر العصبي"];
                relievingFactors = ["الراحة التامة في غرفة مظلمة وهادئة", "الكمادات الباردة على الجبهة وقاعدة الرأس", "شرب الماء بكميات وافرة والابتعاد عن الشاشات"];
                chiropracticProtocol = "تخفيف الشد الانقباضي عن عضلات قاعدة الجمجمة والتوصية بالمتابعة الطبية التخصصية عند تكرار النوبات.";
            } else if (q1Val === "cervicogenic_headache" || q4Val.includes("suboccipital") || notes.includes("عنق") || notes.includes("رقب")) {
                primaryDiagnosis = "الصداع عنقي المنشأ واعتلال مفاصل الفقرات العنقية العلوية (Cervicogenic Headache C1-C3)";
                primaryDiagnosisKey = "tension_cervicogenic_headache";
                secondaryDiagnosis = "انحباس مفاصل الفقرات العنقية العلوية وتشنج العضلات تحت القذالية";
                probability = 95;
                rootLevel = "C1-C3 Suboccipital Complex";
                biomechanicalMechanism = "انحباس وتيبس في حركة مفاصل الفقرات العنقية العلوية C1-C3 يرسل إشارات ألم انعكاسية عبر العصب القذالي نحو قمة الرأس وخلف العين.";
                aggravatingFactors = ["انحناء الرأس المستمر للشاشات", "الالتفات المفاجئ أو وضعيات النوم الخاطئة", "الضغط العصبي مع شد الأكتاف"];
                relievingFactors = ["تمرين تراجع الذقن (Chin Tuck)", "تدليك قاعدة الجمجمة برفق", "تطبيق كمادة دافئة على أعلى الرقبة"];
                chiropracticProtocol = "تحرير وانزلاق الفقرات العنقية العلوية C1-C2 يدوياً وفك الالتصاقات في العضلات القذالية لتسكين الصداع فوراً.";
            } else {
                primaryDiagnosis = "صداع التوتر العضلي والإجهاد الوضعي (Tension-Type Headache & Postural Strain)";
                primaryDiagnosisKey = "tension_cervicogenic_headache";
                secondaryDiagnosis = "تشنج عضلات الفروة والفك والكتفين";
                probability = 93;
                rootLevel = "Pericranial & Trapezius Musculature";
                biomechanicalMechanism = "انقباض مزمن ومستمر في عضلات الفروة والصدغين والعضلة شبه المنحرفة ناتج عن الإرهاق الذهني والوضعية المكتبية المنحنية.";
                aggravatingFactors = ["التحديق الطويل في الشاشات دون راحة", "التوتر وضغوط العمل", "صرير الأسنان اللاإرادي أثناء النوم"];
                relievingFactors = ["تمارين استرخاء الفك وتدليك الصدغين", "أخذ فترات راحة بصرية منتظمة", "شرب السوائل وممارسة التنفس العميق"];
                chiropracticProtocol = "إطلاق نقاط الزناد العضلية في الأكتاف وقاعدة الجمجمة وموازنة محاذاة فقرات الرقبة.";
            }
        }
        // تحليل حالات الرقبة
        else if ((pointId || "").includes("cervical") || (pointId || "").includes("neck")) {
            if (q1Val === "cerv_disc_radicular" || notes.includes("ديسك") || notes.includes("تنميل") || notes.includes("خدر") || q4Val.includes("arm")) {
                primaryDiagnosis = "انزلاق غضروفي عنقي واعتلال الجذور العصبية C5-C7 (Cervical Disc Herniation & Radiculopathy)";
                primaryDiagnosisKey = "cervical_disc_radiculopathy";
                secondaryDiagnosis = "تضيق المخارج العصبية العنقية وتشنج العضلة شبه المنحرفة";
                probability = 95;
                rootLevel = "C5-C6 / C6-C7";
                biomechanicalMechanism = "انضغاط جذور الأعصاب العنقية بفعل بروز الديسك مما يرسل إشارات ألم كهربائي وتنميل على طول مسار العصب إلى الكتف والذراع والأصابع.";
                aggravatingFactors = ["النظر لأسفل نحو الشاشات", "إرجاع الرأس للخلف والالتفات", "حمل الحقائب الثقيلة على الكتف"];
                relievingFactors = ["تراجع الذقن أفقياً للخلف (Chin Tuck)", "سند الرقبة بوسادة طبية", "إراحة الذراع على وسادة"];
                chiropracticProtocol = "سحب وتفريغ الفقرات العنقية يدوياً (Cervical Decompression) لإعادة اصطفاف الفقرات C5-C7 وإزالة الضغط العصبي فوراً.";
            } else {
                primaryDiagnosis = "متلازمة الرقبة الإلكترونية وانحباس مفاصل الفقرات العنقية (Text-Neck & Cervical Facet Lock)";
                primaryDiagnosisKey = "cervical_strain_facet";
                secondaryDiagnosis = "صداع عنقي المنشأ وتشنج العضلة الرافعة للوح الكتف (الأبهر)";
                probability = 94;
                rootLevel = "C1-C4 Facets & Suboccipital";
                biomechanicalMechanism = "حمل انضغاطي مضاعف على عضلات وقاعدة الجمجمة ناتج عن ميلان الرأس للأمام بمقدار 45-60 درجة أثناء استخدام الهواتف، مما يسبب تشنجاً ليفياً وصداعاً عنقياً.";
                aggravatingFactors = ["العمل المكتبي الطويل", "انحناء الرأس للشاشات", "النوم على وسادة غير ملائمة"];
                relievingFactors = ["إطالة الرقبة الجانبية", "رفع مستوى الشاشة لمستوى العينين", "هز ورفع الأكتاف"];
                chiropracticProtocol = "إعادة ضبط ميكانيكية الفقرات العنقية العلوية C1-C2 وفك العقد العضلية بين الرقبة ولوح الكتف.";
            }
        }
        // تحليل حالات أعلى الظهر ولوح الكتف وعضلات الأبهر
        else if ((pointId || "").includes("trapezius") || (pointId || "").includes("scapula")) {
            primaryDiagnosis = "متلازمة تشنج العضلات المعينية واللوحية وعقد الأبهر التوترية (Rhomboid & Scapular Myofascial Trigger Points)";
            primaryDiagnosisKey = "thoracic_scapular_strain";
            secondaryDiagnosis = "خلل وظيفي في حركة لوح الكتف وتيبس العضلة الرافعة للوح الكتف";
            probability = 95;
            rootLevel = "T1-T6 & Levator Scapulae";
            biomechanicalMechanism = "انكماش ليفي وعقد زنادية مؤلمة (Trigger Points) في عضلات ما بين لوحي الكتف نتيجة انحناء الظهر المستمر وضعف ثبات اللوح، مما يسبب إحساساً بطعنة حادة عند التنفس العميق أو تدوير الرقبة.";
            aggravatingFactors = ["الجلوس المنحني أمام الكمبيوتر", "حمل الحقائب الثقيلة على جهة واحدة", "التعرض لتيارات التكييف الباردة"];
            relievingFactors = ["تمرين ضم لوحي الكتف", "إطالة عضلات الصدر على المدخل", "تدليك نقاط الزناد بالكرة الموضعية"];
            chiropracticProtocol = "تحرير عقد الأبهر الليفية وتعديل مفاصل الفقرات الصدرية والأضلاع يدوياً لإعادة التوازن للوح الكتف.";
        }
        // تحليل حالات الفقرات الصدرية وأعلى وسط الظهر
        else if ((pointId || "").includes("thoracic")) {
            if (q1Val === "thoracic_facet" || q4Val.includes("rotation_sharp")) {
                primaryDiagnosis = "متلازمة انحباس مفاصل الفقرات الصدرية الخلفية (Thoracic Facet Joint Dysfunction)";
                primaryDiagnosisKey = "thoracic_facet_dysfunction";
                secondaryDiagnosis = "تشنج الأربطة الفقرية الصدرية والتهاب المفصل الضلعي الفقري";
                probability = 94;
                rootLevel = "T3-T8 Facet Joints";
                biomechanicalMechanism = "انحباس ميكانيكي واحتكاك في مفاصل الفقرات الصدرية والأضلاع ناتج عن الالتواء المفاجئ أو الجلوس المائل، يسبب ألماً طاعناً يشتد مع الشهيق والالتفاف.";
                aggravatingFactors = ["أخذ نفس عميق جداً أو السعال", "الالتفاف المفاجئ للجذع", "الجلوس المترهل الطويل"];
                relievingFactors = ["تمرين فتح وتدوير الفقرات الصدرية (Open-Book)", "التنفس الحجابي الهادئ", "تمديد أعلى الظهر على مسند الكرسي"];
                chiropracticProtocol = "تعديل محاذاة مفاصل الفقرات الصدرية يدوياً وتفريغ الانحباس الضلعي الفقري لاستعادة حرية التنفس.";
            } else {
                primaryDiagnosis = "إجهاد ميكانيكي للفقرات الصدرية وتشنج عضلات ما بين الأضلاع (Thoracic Mechanical Strain)";
                primaryDiagnosisKey = "thoracic_scapular_strain";
                secondaryDiagnosis = "تيبس حركي في القفص الصدري وضعف ثبات الجذع";
                probability = 93;
                rootLevel = "T1-T12 Musculoligamentous";
                biomechanicalMechanism = "إجهاد الألياف العضلية والأربطة الداعمة للفقرات الصدرية بسبب الجلوس المكتبي غير المتوازن وحمل الأوزان على جانب واحد.";
                aggravatingFactors = ["العمل المكتبي الطويل بدون استراحة", "حمل أوزان ثقيلة دون ثبات", "التعرض للهواء البارد المباشر"];
                relievingFactors = ["تمارين الإطالة والتنفس المهدئ", "تطبيق الحرارة الموضعية", "المشي الخفيف مع فرد الظهر"];
                chiropracticProtocol = "إعادة ضبط التوازن العضلي الصدري وفك الالتصاقات المحيطة بالعمود الفقري خلال جلسة 30 دقيقة.";
            }
        }
        // تحليل حالات القفص الصدري وعظم القص
        else if ((pointId || "").includes("chest") || (pointId || "").includes("sternum") || (pointId || "").includes("rib")) {
            primaryDiagnosis = "التهاب الغضاريف الضلعية والخلل الميكانيكي للقفص الصدري (Costochondritis & Rib Dysfunction)";
            primaryDiagnosisKey = "costochondritis_rib";
            secondaryDiagnosis = "تشنج العضلات الوربية بين الأضلاع وإجهاد عضلات الصدر";
            probability = 93;
            rootLevel = "Costochondral Junctions & Intercostals";
            biomechanicalMechanism = "التهاب موضعي ميكانيكي غير جرثومي في المفاصل التي تربط الأضلاع بعظم القص ناتج عن إجهاد السعال أو التواء ميكانيكي مفاجئ في الضلوع، مما يسبب نغزات تزداد مع التنفس العميق.";
            aggravatingFactors = ["أخذ نفس عميق جداً", "الضغط المباشر على منتصف الصدر", "الالتفاف المفاجئ للجذع"];
            relievingFactors = ["التنفس الهادئ الحجابي", "تمديد القفص الصدري بلطف على المدخل", "وضعية الطفل المريحة"];
            chiropracticProtocol = "تعديل المفاصل الضلعية الفقرية الخلفية بلطف لتخفيف الضغط الانضغاطي عن مقدمة القفص الصدري وعظم القص.";
        }
        // تحليل حالات الحوض وعرق النسا
        else if ((pointId || "").includes("sacroiliac") || (pointId || "").includes("gluteal") || (pointId || "").includes("hip") || (pointId || "").includes("pelvis")) {
            primaryDiagnosis = "متلازمة العضلة الكمثرية واعتلال المفصل العجزي الحوضي (Piriformis Syndrome & SI Joint Dysfunction)";
            primaryDiagnosisKey = "si_joint_piriformis";
            secondaryDiagnosis = "عرق النسا العضلي الانضغاطي وانحراف توازن الحوض الوظيفي";
            probability = 94;
            rootLevel = "Sacroiliac Joint & Piriformis";
            biomechanicalMechanism = "انضغاط العصب الوركي تحت بطن العضلة الكمثرية المتشنجة في عمق الأرداف، مصحوباً باعتلال ميكانيكي في حركة المفصل العجزي الحوضي.";
            aggravatingFactors = ["الجلوس الطويل وتقاطع الساقين", "الجلوس على محفظة خلفية", "التقلب في السرير وصعود الدرج"];
            relievingFactors = ["إطالة الكمثرية شكل 4 (Figure-4)", "تحريك العصب على الكرسي", "تفريغ نقاط الشد بالكرة"];
            chiropracticProtocol = "تعديل وموازنة حزام الحوض والمفصل العجزي الحوضي يدوياً وإطلاق تشنج العضلة الكمثرية.";
        }
        // تحليل حالات الكتف
        else if ((pointId || "").includes("shoulder")) {
            primaryDiagnosis = "متلازمة انحشار الكتف واعتلال أوتار الكفة المدورة (Subacromial Impingement & Rotator Cuff Tendinopathy)";
            primaryDiagnosisKey = "shoulder_rotator_impingement";
            secondaryDiagnosis = "التهاب الجراب تحت الأخرمي ومحدودية حركة محفظة المفصل";
            probability = 94;
            rootLevel = "Glenohumeral & Supraspinatus Tendon";
            biomechanicalMechanism = "انحشار واحتكاك وتر العضلة فوق الشوكية (Supraspinatus) تحت البروز الأخرمي العظمي عند رفع الذراع، ناتج عن ضعف ثبات لوح الكتف.";
            aggravatingFactors = ["رفع الذراع فوق مستوى الرأس", "النوم على جهة الكتف المصاب", "الوصول السريع للخلف"];
            relievingFactors = ["تمرين بندول كودمان المهدئ", "الانزلاق على الجدار", "تجنب الحركات المفاجئة"];
            chiropracticProtocol = "إعادة ضبط تموضع رأس عظمة العضد داخل التجويف الحقاني وتحرير انحشار الأوتار يدوياً.";
        }
        // تحليل حالات الكوع
        else if ((pointId || "").includes("elbow")) {
            primaryDiagnosis = "مرفق لاعب التنس والتهاب أوتار الكوع الخارجية (Lateral Epicondylitis & Extensor Tendinopathy)";
            primaryDiagnosisKey = "elbow_epicondylitis";
            secondaryDiagnosis = "إجهاد أوتار الساعد الباسطة وتيبس المفصل الكعبري الزندي";
            probability = 95;
            rootLevel = "Lateral Epicondyle & Radial Head";
            biomechanicalMechanism = "تمزقات مجهرية متكررة والتهاب في منشأ أوتار الساعد الباسطة على البروز العظمي الخارجي للكوع بفعل حركات الإمساك والتدوير المتكررة.";
            aggravatingFactors = ["المصافحة القوية وعصر الملابس", "استخدام الفأرة المفرط", "حمل الأوزان مع فرد الكوع"];
            relievingFactors = ["الإطالة اللامتراكزة للساعد", "ارتداء دعامة الكوع الموضعية", "إراحة اليد من المقابض الصلبة"];
            chiropracticProtocol = "تحريك وتليين رأس عظمة الكعبرة (Radial Head Mobilization) وإطلاق الأنسجة الليفية للساعد.";
        }
        // تحليل حالات الرسغ
        else if ((pointId || "").includes("wrist")) {
            primaryDiagnosis = "متلازمة النفق الرسغي وانضغاط العصب الأوسط (Carpal Tunnel Syndrome)";
            primaryDiagnosisKey = "wrist_carpal_tunnel";
            secondaryDiagnosis = "التهاب أغمدة أوتار الرسغ القابضة واحتقان النفق الليفي";
            probability = 95;
            rootLevel = "Median Nerve & Carpal Tunnel";
            biomechanicalMechanism = "ارتفاع الضغط الميكانيكي داخل النفق الرسغي مما يؤدي إلى خنق العصب الأوسط ونقص ترويته الدموية، متسبباً بالتنميل الليلي المميز في الأصابع.";
            aggravatingFactors = ["ثني المعصم أثناء النوم", "الطباعة والعمل المكتبي الطويل", "الاتكاء على راحة اليد"];
            relievingFactors = ["إطالة وتمديد الأصابع", "تثبيت الرسغ بدعامة ليلية مستقيمة", "تمارين انزلاق الأوتار"];
            chiropracticProtocol = "تعديل وموازنة عظام الرسغ الثمانية وتوسيع مسار النفق الرسغي يدوياً لتخفيف الخنق العصبي.";
        }
        // تحليل حالات الركبة
        else if ((pointId || "").includes("knee") || (pointId || "").includes("hamstring")) {
            primaryDiagnosis = "متلازمة الألم الرضفي الفخذي واحتكاك صابونة الركبة (Patellofemoral Pain Syndrome)";
            primaryDiagnosisKey = "knee_patellofemoral";
            secondaryDiagnosis = "إجهاد الغضروف الهلالي الإنسي وضعف العضلة المتسعة الإنسية VMO";
            probability = 94;
            rootLevel = "Patellofemoral Joint & Quadriceps";
            biomechanicalMechanism = "خلل في مسار انزلاق صابونة الركبة داخل مجراها الفخذي (Patellar Maltracking) مما يسبب احتكاكاً وتآكلاً في السطح الخلفي الغضروفي للصابونة عند ثني المفصل.";
            aggravatingFactors = ["نزول الدرج والمنحدرات", "القرفصاء والجلوس على الأرض", "الجلوس الطويل وثني الركبة 90 درجة"];
            relievingFactors = ["الشد الثابت للعضلة الرباعية (Quad Set)", "فرد الركبة التام", "تقوية عضلات الحوض والورك"];
            chiropracticProtocol = "إعادة ضبط محاذاة صابونة الركبة وموازنة ميكانيكية مفصل الركبة والحوض والقدم.";
        }
        // تحليل حالات السمانة ووتر أكيليس (اليمنى واليسرى)
        else if ((pointId || "").includes("achilles") || (pointId || "").includes("calf") || (pointId || "").includes("37515")) {
            primaryDiagnosis = "اعتلال وإجهاد وتر أكيليس وتشنج عضلة السمانة (Achilles Tendinopathy & Calf Strain)";
            primaryDiagnosisKey = "ankle_plantar_achilles";
            secondaryDiagnosis = "التهاب اللفافة الأخمصية وتيبس الحركة العكسية لمفصل الكاحل";
            probability = 95;
            rootLevel = "Achilles Tendon & Gastrocnemius-Soleus Complex";
            biomechanicalMechanism = "إجهاد انقباضي متكرر وقصر في ألياف عضلة بطة الساق (السمانة) مع انضغاط في وتر أكيليس عند نقطة اتصاله بالكعب، مما يسبب تيبساً وألماً حاداً عند صعود المرتفعات أو الخطوات الأولى.";
            aggravatingFactors = ["المشي أو الجري وصعود المرتفعات", "الوقوف الطويل بأحذية غير ممتصة للصدمات", "المشي حافي القدمين على أرض صلبة"];
            relievingFactors = ["إطالة السمانة على لوح مائل/حائط", "تمارين رفع الكعبين اللامتراكزة", "تدليك باطن القدم وأسفل الساق"];
            chiropracticProtocol = "تعديل محاذاة مفصل الكاحل (Talocrural Joint) وتفريغ تشنج ألياف السمانة ووتر أكيليس يدوياً.";
        }
        // تحليل حالات الكاحل ومفصل القدم المستقلة
        else if ((pointId || "").includes("ankle") && !notes.includes("كعب") && !notes.includes("مسمار") && !notes.includes("أخمص") && q1Val !== "plantar_fasciitis_heel") {
            primaryDiagnosis = "إجهاد وتمطط أربطة الكاحل وعدم استقرار المفصل الكاحلي (Ankle Ligament Strain & Talocrural Instability)";
            primaryDiagnosisKey = "ankle_sprain_instability";
            secondaryDiagnosis = "تشنج الأوتار الشظوية ومحدودية مرونة الثني لمفصل الكاحل";
            probability = 95;
            rootLevel = "Talocrural Joint & Lateral Collateral Ligaments (ATFL/CFL)";
            biomechanicalMechanism = "تمطط مفرط في محفظة وأربطة مفصل الكاحل مع انحراف ميكانيكي دقيق في حركة عظمة القعب (Talus)، مما يقلل الثبات الحركي ويولد ألماً موضعياً وتورماً عند الارتكاز أو المشي على أسطح غير مستوية.";
            aggravatingFactors = ["المشي على أسطح غير مستوية أو الركض", "ثني والتواء الكاحل للداخل أو الخارج", "الوقوف الطويل بدون دعم أو حذاء ثابت"];
            relievingFactors = ["تمارين ثني وبسط وتدوير الكاحل (Ankle Pumps & Circles)", "تثبيت ودعم الكاحل برباط ضاغط خفيف", "الراحة والكمادات الباردة بعد المشي"];
            chiropracticProtocol = "إعادة ضبط ومحاذاة عظام الكاحل (Talocrural & Subtalar Joints) وتفريغ التشنج العضلي في بطة الساق لتحقيق ثبات حركي متوازن.";
        }
        // تحليل حالات القدم واللفافة الأخمصية ومسمار الكعب
        else if ((pointId || "").includes("plantar") || (pointId || "").includes("foot") || (pointId || "").includes("heel") || notes.includes("كعب") || notes.includes("مسمار") || notes.includes("أخمص") || q1Val === "plantar_fasciitis_heel") {
            primaryDiagnosis = "التهاب اللفافة الأخمصية ومسمار العظم (Plantar Fasciitis & Calcaneal Spur)";
            primaryDiagnosisKey = "ankle_plantar_achilles";
            secondaryDiagnosis = "اعتلال وتيبس وتر أكيليس وانهيار القوس الأخمصي";
            probability = 95;
            rootLevel = "Plantar Fascia & Achilles Tendon";
            biomechanicalMechanism = "شد وتمطط مفرط في الألياف الكولاجينية الممتدة من الكعب إلى الأصابع مع قصر في وتر أكيليس، مما يسبب التهاباً حاداً وألماً وخزياً مع الخطوات الصباحية الأولى.";
            aggravatingFactors = ["الخطوة الأولى صباحاً من السرير", "المشي حافي القدمين على السيراميك", "الوقوف الطويل بأحذية مسطحة"];
            relievingFactors = ["إطالة اللفافة على لوح مائل/حائط", "تدليك باطن القدم بكرة صلبة", "ارتداء أحذية ذات دعم للقوس"];
            chiropracticProtocol = "تعديل عظام الكاحل والقدم (Talus & Navicular) وإطالة اللفافة الأخمصية يدوياً لتوزيع وزن الجسم بشكل متوازن.";
        }
        else {
            primaryDiagnosis = matchedQ1?.score?.diag || "إجهاد مفصلي حركي واضطراب ميكانيكي وظيفي";
            primaryDiagnosisKey = "lumbar_mechanical_strain";
            secondaryDiagnosis = "تشنج الأنسجة والأوتار المحيطة";
            probability = 90;
            biomechanicalMechanism = "خلل ميكانيكي وظيفي في توزيع الأحمال الحركية على المفاصل والأنسجة المجاورة.";
            aggravatingFactors = ["النشاط المفرط دون راحة", "الوضعيات الخاطئة"];
            relievingFactors = ["الراحة المعتدلة والتمارين التأهيلية المخصصة"];
            chiropracticProtocol = "تقييم سريري وإعادة ضبط محاذاة المفاصل والفقرات خلال جلسة 30 دقيقة.";
        }

        // حساب دقة التشخيص والاحتمالية الديناميكية بناءً على اكتمال الأدلة
        let evidenceCount = 0;
        if (q1Val) evidenceCount++;
        if (q2Val) evidenceCount++;
        if (q4Val) evidenceCount++;
        if (answers.associatedLabels && answers.associatedLabels.length > 0) evidenceCount++;
        if (patientVitals.weight && patientVitals.height) evidenceCount++;
        if (patientVitals.age) evidenceCount++;
        if (notes.length > 3) evidenceCount++;

        // حساب درجة الموثوقية (Confidence Score) بناءً على اكتمال المعطيات
        if (isPreliminary) {
            confidenceScore = 65;
            probability = 70;
        } else {
            confidenceScore = Math.min(99, Math.max(82, 78 + (evidenceCount * 3)));
        }

        // ضبط الاحتمالية ديناميكياً بناءً على توافق المحفز الميكانيكي (Q2) والاختبار الاستدلالي (Q4)
        if (pointData?.tier4_provocation?.options) {
            const matchedQ4 = pointData.tier4_provocation.options.find(o => o.value === q4Val);
            if (matchedQ4?.scoreShift) {
                // إذا كان الاختبار إيجابياً للتشخيص المطابق
                const shiftKeys = Object.keys(matchedQ4.scoreShift);
                const isReinforcing = shiftKeys.some(k => 
                    primaryDiagnosisKey.toLowerCase().includes(k.toLowerCase()) || 
                    (k === 'disc' && primaryDiagnosisKey.includes('disc')) ||
                    (k === 'facet' && primaryDiagnosisKey.includes('facet')) ||
                    (k === 'cervicogenic' && primaryDiagnosisKey.includes('tension_cervicogenic')) ||
                    (k === 'costochondritis' && primaryDiagnosisKey.includes('costochondritis')) ||
                    (k === 'plantar' && primaryDiagnosisKey.includes('plantar')) ||
                    (k === 'carpal_tunnel' && primaryDiagnosisKey.includes('carpal'))
                );
                if (isReinforcing) {
                    probability = Math.min(98, probability + 2);
                }
            }
        }
        if (answers.associatedLabels && answers.associatedLabels.length >= 2) {
            probability = Math.min(98, probability + 1);
        }

        // تجميع الأدلة السريرية الشاملة
        const clinicalEvidence = [];
        if (matchedQ1 && matchedQ1.label) {
            clinicalEvidence.push(`طبيعة العرض السريري: ${matchedQ1.label}`);
        } else if (primaryDiagnosis && primaryDiagnosis.title) {
            clinicalEvidence.push(`طبيعة العرض والنمط السريري: ${primaryDiagnosis.title}`);
        }

        if (answers.painSeverity !== undefined && answers.painSeverity !== null && answers.painSeverity !== '') {
            const sev = Number(answers.painSeverity);
            const sevLabel = sev >= 8 ? 'ألم شديد حاد' : (sev >= 5 ? 'ألم متوسط إلى ملحوظ' : 'ألم خفيف إلى معتدل');
            clinicalEvidence.push(`مؤشر شدة الألم المسجل: ${sev}/10 (${sevLabel})`);
        }

        if (answers.painDuration) {
            clinicalEvidence.push(`المدى الزمني ومرحلة الإصابة: ${answers.painDuration}`);
        }

        if (answers.q2Text) {
            clinicalEvidence.push(`المحفز الميكانيكي الحركي: ${answers.q2Text}`);
        }

        if (answers.q4Text) {
            clinicalEvidence.push(`الاستجابة للاختبار الاستدلالي: ${answers.q4Text}`);
        }

        if (answers.associatedLabels && answers.associatedLabels.length > 0) {
            clinicalEvidence.push(`الأعراض العصبية والمفصلية المرافقة: ${answers.associatedLabels.join("، ")}`);
        } else if (answers.associatedSymptoms && answers.associatedSymptoms.length > 0) {
            clinicalEvidence.push(`الأعراض المرافقة المرصودة: ${answers.associatedSymptoms.join("، ")}`);
        }

        const pointTitle = pointData?.regionName || (typeof currentSelectedPoint !== 'undefined' && currentSelectedPoint?.title) || painArea || 'المنطقة المحددة';
        if (pointTitle) {
            clinicalEvidence.push(`الموضع التشريحي المستهدف: فحص وتأكيد الارتباط الميكانيكي بنطاق (${pointTitle})`);
        }

        // ضمان عدم بقاء قائمة الأدلة فارغة تحت أي ظرف
        if (clinicalEvidence.length === 0) {
            clinicalEvidence.push(`الفحص الميكانيكي الموضعي: رصد إجهاد وتشنج موضعي في نطاق (${pointTitle})`);
            clinicalEvidence.push(`النمط الوظيفي: تأثر النطاق الحركي وانضغاط أنسجة المفصل مع الحركة والجهد اليومي`);
        }

        // تحليل الأمراض المزمنة والاحتياطات الخاصة
        const chronicPrecautions = [];
        if (chronicDiseases && chronicDiseases.length > 0) {
            if (chronicDiseases.includes('diabetes')) {
                clinicalEvidence.push("داء السكري: بطء استشفاء الأوتار والألياف وحساسية التروية الدموية للأعصاب الطرفية.");
                chronicPrecautions.push("مراعاة داء السكري: التدرج المعتدل في الجهد ومراقبة أي شعور بالتنميل الطرفي.");
            }
            if (chronicDiseases.includes('hypertension')) {
                clinicalEvidence.push("ضغط الدم: تجنب كتم النفس أثناء الشد العضلي لمنع ارتفاع الضغط داخل الصدر (Valsalva).");
                chronicPrecautions.push("مراعاة ضغط الدم: التنفس المستمر بهدوء أثناء أداء التمارين وتجنب الحركات المفاجئة.");
            }
            if (chronicDiseases.includes('osteoporosis')) {
                clinicalEvidence.push("هشاشة العظام: تجنب الثني الالتوائي القوي أو الحركات المحورية العنيفة للعمود الفقري.");
                chronicPrecautions.push("مراعاة هشاشة العظام: التركيز على تمارين الثبات متساوية القياس (Isometric) بدون ضغط عنيف.");
            }
            if (chronicDiseases.includes('rheumatoid')) {
                clinicalEvidence.push("الروماتويد/أمراض مناعية: مراعاة فترات النشاط الالتهابي وتجنب الإجهاد في الطور الحاد.");
                chronicPrecautions.push("التهاب المفاصل الروماتويدي: أداء الحركات بلطف فائق وإراحة المفصل عند التورم أو السخونة.");
            }
            if (chronicDiseases.includes('spine_surgery')) {
                clinicalEvidence.push("جراحة سابقة للظهر/المفاصل: الالتزام الصارم بالمدى الحركي غير المؤلم.");
                chronicPrecautions.push("تاريخ جراحي سابق: عدم التمدد لما بعد حدود الراحة التامة ومراجعة المعالج المختص للتوجيه.");
            }
        }

        // حساب مؤشر كتلة الجسم والحمولة الميكانيكية المحورية والوزن الزائد/الناقص بدقة
        let bmiInfo = null;
        let bmiPoints = 15;

        if (patientVitals.weight && patientVitals.height) {
            const hM = patientVitals.height / 100;
            const w = patientVitals.weight;
            const bmiVal = parseFloat((w / (hM * hM)).toFixed(1));
            
            const minHealthyW = parseFloat((18.5 * hM * hM).toFixed(1));
            const maxHealthyW = parseFloat((24.9 * hM * hM).toFixed(1));
            const idealW = parseFloat((22.0 * hM * hM).toFixed(1));

            let bmiStatus = "وزن طبيعي متوازن";
            let bmiColor = "#10b981";
            let deltaType = "ideal";
            let deltaKg = 0;
            let deltaText = `✅ وزنك ضمن النطاق الصحي المثالي (${minHealthyW} - ${maxHealthyW} كجم)`;
            let impact = "وزنك متناسق ولا يشكل حمولة ضغط إضافية على الغضاريف والفقرات.";

            if (bmiVal < 18.5) {
                deltaType = "deficit";
                deltaKg = parseFloat((minHealthyW - w).toFixed(1));
                bmiStatus = "نحافة / نقص في الكتلة العضلية";
                bmiColor = "#38bdf8";
                deltaText = `⚠️ نقص في الوزن بمقدار -${deltaKg} كجم عن الحد الأدنى للوزن الصحي (${minHealthyW} كجم)`;
                impact = "نقص الكتلة العضلية يقلل من الثبات الميكانيكي للمفاصل ويجعل الفقرات عرضة للإجهاد السريع.";
                bmiPoints = 18;
            } else if (bmiVal >= 25 && bmiVal < 30) {
                deltaType = "excess";
                deltaKg = parseFloat((w - maxHealthyW).toFixed(1));
                const excessVsIdeal = parseFloat((w - idealW).toFixed(1));
                const addedLoad = parseFloat((deltaKg * 4).toFixed(1));
                bmiStatus = "زيادة وزن (Overweight)";
                bmiColor = "#f59e0b";
                deltaText = `⚠️ وزن زائد بمقدار +${deltaKg} كجم عن الحد الصحي الأعلى (+${excessVsIdeal} كجم عن الوزن المثالي ${idealW} كجم)`;
                impact = `الوزن الزائد يضاعف الحمل الانضغاطي على الفقرات والمفاصل ويضيف حوالي ${addedLoad} كجم ضغطاً ميكانيكياً إضافياً على الركبتين وأسفل الظهر أثناء الحركة.`;
                bmiPoints = 26;
            } else if (bmiVal >= 30) {
                deltaType = "excess";
                deltaKg = parseFloat((w - maxHealthyW).toFixed(1));
                const excessVsIdeal = parseFloat((w - idealW).toFixed(1));
                const addedLoad = parseFloat((deltaKg * 4).toFixed(1));
                bmiStatus = "سمنة مفرطة / حمولة ميكانيكية حرجة";
                bmiColor = "#ef4444";
                deltaText = `🚨 وزن زائد حرج بمقدار +${deltaKg} كجم (+${excessVsIdeal} كجم عن الوزن المثالي ${idealW} كجم)`;
                impact = `كل 1 كجم زيادة يضاعف الحمل على الغضاريف 4 أضعاف، مما يشكل حمولة ضغط فائقة تصل إلى +${addedLoad} كجم على مفاصلك وفقراتك، مسبباً تسارع تآكل الديسك.`;
                bmiPoints = 35;
            }

            bmiInfo = {
                value: bmiVal,
                status: bmiStatus,
                color: bmiColor,
                minHealthyW,
                maxHealthyW,
                idealW,
                deltaType,
                deltaKg,
                deltaText,
                impact
            };
        }

        // حساب المؤشر المركب دائماً بناءً على الألم والعمر والمدة والوزن
        const painPoints = ((painSeverity || 7) / 10) * 35;
        const agePoints = Math.min(20, ((patientVitals.age || 35) / 70) * 20);
        let durationPoints = 12;
        if (painDuration === '1_month' || painDuration === '3_months') durationPoints = 22;
        else if (painDuration === 'chronic') durationPoints = 28;

        const biomechanicalStrainScore = Math.min(98, Math.max(25, Math.round(bmiPoints + painPoints + agePoints + durationPoints)));

        let strainLevel = "معتدل وقابل للتعافي السريع";
        let strainColor = "#10b981";
        let strainAnalysis = "الحمولة الميكانيكية تحت السيطرة، الاستجابة للبروتوكول التأهيلي ستكون سريعة وممتازة.";

        if (biomechanicalStrainScore >= 75) {
            strainLevel = "حرج / مرتفع جداً";
            strainColor = "#ef4444";
            strainAnalysis = "الفقرات والمفاصل تخضع لضغط محوري هائل يتطلب تفريغاً يدوياً عاجلاً (Decompression) لمنع تفاقم وتآكل الغضاريف.";
        } else if (biomechanicalStrainScore >= 55) {
            strainLevel = "متوسط إلى مرتفع";
            strainColor = "#f59e0b";
            strainAnalysis = "يوجد إجهاد مستمر على الأنسجة والمفاصل، تقويم الفقرات والتمارين التأهيلية ستحدث فرقاً جوهرياً في التسكين.";
        }

        const biomechanicalIndex = {
            score: biomechanicalStrainScore,
            level: strainLevel,
            color: strainColor,
            analysis: strainAnalysis
        };

        return {
            isRedFlag: false,
            isPreliminary,
            primaryDiagnosis,
            primaryDiagnosisKey,
            secondaryDiagnosis,
            probability,
            confidenceScore,
            rootLevel,
            biomechanicalMechanism,
            aggravatingFactors,
            relievingFactors,
            chiropracticProtocol,
            clinicalEvidence,
            bmiInfo,
            biomechanicalIndex,
            painSeverity,
            painDuration,
            chronicDiseases,
            chronicPrecautions,
            patientVitals,
            userNotes
        };
    }

    return {
        getQuestionsForPoint,
        RED_FLAGS_CRITERIA,
        analyzeAssessment
    };
})();
