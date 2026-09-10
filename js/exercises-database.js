// قاعدة بيانات التمارين العلاجية
// مرتبطة بنقاط الألم، التشخيصات، الأعراض، وتقدم العلاج

const EXERCISES_DATABASE = {
    // تمارين الفقرات العنقية (C1-C7)
    cervical: {
        // للألم العادي
        pain: {
            beginner: [
                {
                    id: 'cervical_gentle_rotation',
                    name: 'الدوران اللطيف للرقبة',
                    scientificName: 'Cervical Gentle Rotation',
                    description: 'قم بإدارة رأسك ببطء من جانب إلى آخر',
                    instructions: '1. اجلس بشكل مستقيم\n2. أدر رأسك ببطء إلى اليمين حتى تشعر بتمديد خفيف\n3. حافظ على الوضعية لمدة 5-10 ثواني\n4. أدر رأسك ببطء إلى اليسار\n5. كرر 5-10 مرات لكل جانب',
                    duration: '30 ثانية',
                    reps: '5-10 مرات لكل جانب',
                    warnings: 'توقف إذا شعرت بألم حاد أو دوخة',
                    benefits: 'يحسن مرونة الرقبة ويقلل التوتر'
                },
                {
                    id: 'cervical_chin_tucks',
                    name: 'سحب الذقن',
                    scientificName: 'Cervical Chin Tucks',
                    description: 'اسحب ذقنك للداخل ببطء كما لو كنت تريد صنع ذقن مزدوج',
                    instructions: '1. اجلس أو قف بشكل مستقيم\n2. اسحب ذقنك للداخل ببطء\n3. حافظ على الوضعية لمدة 5 ثواني\n4. أعد رأسك للوضع الطبيعي\n5. كرر 10-15 مرة',
                    duration: '20 ثانية',
                    reps: '10-15 مرة',
                    warnings: 'لا تضغط بقوة على الرقبة',
                    benefits: 'يقوي عضلات الرقبة الأمامية ويحسن الوضعية'
                }
            ],
            intermediate: [
                {
                    id: 'cervical_side_bend',
                    name: 'انحناء جانبي للرقبة',
                    scientificName: 'Cervical Lateral Flexion',
                    description: 'انحنِ برأسك ببطء إلى الجانب',
                    instructions: '1. اجلس بشكل مستقيم\n2. انحنِ برأسك ببطء إلى اليمين\n3. حافظ على الوضعية لمدة 10-15 ثانية\n4. انحنِ برأسك ببطء إلى اليسار\n5. كرر 5-8 مرات لكل جانب',
                    duration: '30 ثانية',
                    reps: '5-8 مرات لكل جانب',
                    warnings: 'لا تسحب الرأس بقوة',
                    benefits: 'يمدد عضلات جانبي الرقبة'
                },
                {
                    id: 'cervical_levator_stretch',
                    name: 'تمديد عضلة رافعة الكتف',
                    scientificName: 'Levator Scapulae Stretch',
                    description: 'تمديد عضلات الرقبة الجانبية العلوية',
                    instructions: '1. اجلس بشكل مستقيم\n2. أمسك بكرسي بيدك اليمنى\n3. انحنِ برأسك ببطء إلى اليسار\n4. حافظ على الوضعية لمدة 20-30 ثانية\n5. كرر على الجانب الآخر',
                    duration: '40 ثانية',
                    reps: '3 مرات لكل جانب',
                    warnings: 'لا تمدد بقوة شديدة',
                    benefits: 'يقلل التوتر في عضلات الرقبة العلوية'
                }
            ],
            advanced: [
                {
                    id: 'cervical_resistance',
                    name: 'تمارين المقاومة للرقبة',
                    scientificName: 'Cervical Isometric Exercises',
                    description: 'تمارين تقوية عضلات الرقبة باستخدام مقاومة يدك',
                    instructions: '1. ضع يدك على جبهتك\n2. ادفع برأسك ضد يدك\n3. حافظ على الوضعية لمدة 5-10 ثواني\n4. كرر في جميع الاتجاهات (الأمام، الخلف، الجوانب)\n5. كرر 5-10 مرات لكل اتجاه',
                    duration: '30 ثانية',
                    reps: '5-10 مرات لكل اتجاه',
                    warnings: 'استخدم مقاومة معتدلة فقط',
                    benefits: 'يقوي جميع عضلات الرقبة'
                }
            ]
        },
        // للخدر
        numbness: {
            beginner: [
                {
                    id: 'cervical_nerve_glide',
                    name: 'تمديد الأعصاب للرقبة',
                    scientificName: 'Cervical Nerve Gliding Exercises',
                    description: 'تمارين لتحسين حركة الأعصاب في الرقبة',
                    instructions: '1. اجلس بشكل مستقيم\n2. أدر رأسك لليمين\n3. مد ذراعك اليمنى للخلف\n4. حافظ على الوضعية لمدة 5 ثواني\n5. كرر على الجانب الآخر',
                    duration: '20 ثانية',
                    reps: '5 مرات لكل جانب',
                    warnings: 'توقف إذا شعرت بألم أو تنميل',
                    benefits: 'يحسن حركة الأعصاب ويقلل الخدر'
                },
                {
                    id: 'cervical_posture_correction',
                    name: 'تصحيح الوضعية',
                    scientificName: 'Cervical Posture Correction',
                    description: 'تمارين لتحسين وضعية الرقبة والكتفين',
                    instructions: '1. اجلس بشكل مستقيم\n2. اسحب كتفيك للخلف والأسفل\n3. حافظ على الوضعية لمدة 30 ثانية\n4. كرر عدة مرات خلال اليوم',
                    duration: '30 ثانية',
                    reps: 'عدة مرات يومياً',
                    warnings: 'لا تجهد عضلاتك',
                    benefits: 'يقلل الضغط على الأعصاب'
                }
            ],
            intermediate: [
                {
                    id: 'cervical_scalene_stretch',
                    name: 'تمديد عضلات القصية الترقوية',
                    scientificName: 'Scalene Muscle Stretch',
                    description: 'تمديد عضلات الرقبة الجانبية العميقة',
                    instructions: '1. اجلس بشكل مستقيم\n2. أمسك بكرسي بيدك اليمنى\n3. أدر رأسك لليسار وانحنِ قليلاً للخلف\n4. حافظ على الوضعية لمدة 30 ثانية\n5. كرر على الجانب الآخر',
                    duration: '45 ثانية',
                    reps: '3 مرات لكل جانب',
                    warnings: 'كن حذراً إذا كان لديك مشاكل في الأعصاب',
                    benefits: 'يقلل الضغط على الأعصاب العنقية'
                }
            ]
        }
    },

    // تمارين الفقرات الصدرية (T1-T12)
    thoracic: {
        pain: {
            beginner: [
                {
                    id: 'thoracic_cat_cow',
                    name: 'تمرين القطة والبقرة',
                    scientificName: 'Cat-Cow Stretch',
                    description: 'تمرين لتحسين مرونة العمود الفقري الصدري',
                    instructions: '1. انزل على أربع\n2. قوس ظهرك للأعلى (القطة)\n3. انحنِ ظهرك للأسفل (البقرة)\n4. حرك ببطء وبشكل متسق\n5. كرر 10-15 مرة',
                    duration: '30 ثانية',
                    reps: '10-15 مرة',
                    warnings: 'لا تفرط في الانحناء',
                    benefits: 'يحسن مرونة العمود الفقري'
                },
                {
                    id: 'thoracic_chest_opener',
                    name: 'فتح الصدر',
                    scientificName: 'Chest Opener Stretch',
                    description: 'تمرين لفتح الصدر وتحسين وضعية الجسم',
                    instructions: '1. قف بجانب حائط\n2. ضع يدك على الحائط\n3. أدر جسمك بعيداً عن الحائط\n4. حافظ على الوضعية لمدة 20-30 ثانية\n5. كرر على الجانب الآخر',
                    duration: '40 ثانية',
                    reps: '3 مرات لكل جانب',
                    warnings: 'لا تفرط في التمدد',
                    benefits: 'يفتح الصدر ويحسن الوضعية'
                }
            ],
            intermediate: [
                {
                    id: 'thoracic_rotation',
                    name: 'دوران العمود الفقري الصدري',
                    scientificName: 'Thoracic Rotation',
                    description: 'تمرين لتحسين دوران العمود الفقري الصدري',
                    instructions: '1. اجلس على كرسي\n2. ضع يدك اليمنى على كتفك الأيسر\n3. أدر جسمك لليسار\n4. حافظ على الوضعية لمدة 15-20 ثانية\n5. كرر على الجانب الآخر',
                    duration: '30 ثانية',
                    reps: '5 مرات لكل جانب',
                    warnings: 'لا تفرط في الدوران',
                    benefits: 'يحسن مرونة العمود الفقري الصدري'
                },
                {
                    id: 'thoracic_extension',
                    name: 'تمديد العمود الفقري الصدري',
                    scientificName: 'Thoracic Extension',
                    description: 'تمرين لتحسين امتداد العمود الفقري الصدري',
                    instructions: '1. استلقِ على ظهرك\n2. ضع وسادة تحت ظهرك\n3. استرخِ واسمح لظهرك بالانحناء\n4. حافظ على الوضعية لمدة 1-2 دقيقة\n5. كرر عدة مرات',
                    duration: '2 دقيقة',
                    reps: '3 مرات',
                    warnings: 'لا تستخدم وسادة عالية جداً',
                    benefits: 'يحسن امتداد العمود الفقري'
                }
            ],
            advanced: [
                {
                    id: 'thoracic_foam_roller',
                    name: 'تمديد بالأسطوانة الرغوية',
                    scientificName: 'Thoracic Foam Roller Stretch',
                    description: 'تمرين متقدم لتمديد العمود الفقري الصدري',
                    instructions: '1. استلقِ على أسطوانة رغوية\n2. ضع الأسطوانة تحت ظهرك\n3. قوس ظهرك ببطء\n4. حرك للأعلى والأسفل\n5. كرر لمدة 2-3 دقائق',
                    duration: '3 دقائق',
                    reps: 'مرة واحدة',
                    warnings: 'تجنب إذا كان لديك ألم حاد',
                    benefits: 'يمدد العمود الفقري الصدري بعمق'
                }
            ]
        },
        numbness: {
            beginner: [
                {
                    id: 'thoracic_nerve_glide',
                    name: 'تمديد أعصاب الصدر',
                    scientificName: 'Thoracic Nerve Gliding',
                    description: 'تمارين لتحسين حركة الأعصاب الصدرية',
                    instructions: '1. اجلس بشكل مستقيم\n2. ارفع ذراعك للأعلى\n3. أدر جسمك ببطء\n4. حافظ على الوضعية لمدة 5 ثواني\n5. كرر على الجانب الآخر',
                    duration: '20 ثانية',
                    reps: '5 مرات لكل جانب',
                    warnings: 'توقف إذا شعرت بألم',
                    benefits: 'يحسن حركة الأعصاب'
                }
            ]
        }
    },

    // تمارين الفقرات القطنية (L1-L5)
    lumbar: {
        pain: {
            beginner: [
                {
                    id: 'lumbar_pelvic_tilt',
                    name: 'إمالة الحوض',
                    scientificName: 'Pelvic Tilt',
                    description: 'تمرين لتحسين مرونة أسفل الظهر',
                    instructions: '1. استلقِ على ظهرك\n2. اثنِ ركبتيك\n3. اضغط ظهرك على الأرض\n4. حافظ على الوضعية لمدة 5-10 ثواني\n5. كرر 10-15 مرة',
                    duration: '30 ثانية',
                    reps: '10-15 مرة',
                    warnings: 'لا تفرط في الضغط',
                    benefits: 'يقوي عضلات أسفل الظهر'
                },
                {
                    id: 'lumbar_knee_to_chest',
                    name: 'جلب الركبة إلى الصدر',
                    scientificName: 'Knee-to-Chest Stretch',
                    description: 'تمرين لتمديد عضلات أسفل الظهر',
                    instructions: '1. استلقِ على ظهرك\n2. اثنِ ركبتيك\n3. اسحب ركبة واحدة إلى صدرك\n4. حافظ على الوضعية لمدة 15-20 ثانية\n5. كرر مع الركبة الأخرى',
                    duration: '40 ثانية',
                    reps: '3 مرات لكل ركبة',
                    warnings: 'لا تسحب بقوة شديدة',
                    benefits: 'يمدد عضلات أسفل الظهر'
                }
            ],
            intermediate: [
                {
                    id: 'lumbar_bridge',
                    name: 'تمرين الجسر',
                    scientificName: 'Bridge Exercise',
                    description: 'تمرين لتقوية عضلات الظهر والأرداف',
                    instructions: '1. استلقِ على ظهرك\n2. اثنِ ركبتيك\n3. ارفع وركيك للأعلى\n4. حافظ على الوضعية لمدة 5-10 ثواني\n5. أنزل ببطء\n6. كرر 10-15 مرة',
                    duration: '30 ثانية',
                    reps: '10-15 مرة',
                    warnings: 'لا ترفع وركيك عالياً جداً',
                    benefits: 'يقوي عضلات الظهر والأرداف'
                },
                {
                    id: 'lumbar_bird_dog',
                    name: 'تمرين الكلب والطائر',
                    scientificName: 'Bird Dog Exercise',
                    description: 'تمرين لتقوية عضلات الظهر والجذع',
                    instructions: '1. انزل على أربع\n2. ارفع ذراعك اليمنى وركبتك اليسرى\n3. حافظ على الوضعية لمدة 5-10 ثواني\n4. كرر على الجانب الآخر\n5. كرر 8-10 مرات لكل جانب',
                    duration: '40 ثانية',
                    reps: '8-10 مرات لكل جانب',
                    warnings: 'حافظ على استقامة ظهرك',
                    benefits: 'يقوي عضلات الظهر والجذع'
                }
            ],
            advanced: [
                {
                    id: 'lumbar_plank',
                    name: 'تمرين البلانك',
                    scientificName: 'Plank Exercise',
                    description: 'تمرين متقدم لتقوية عضلات الجذع',
                    instructions: '1. انزل على أربع\n2. مد ساقيك للخلف\n3. حافظ على جسمك في خط مستقيم\n4. حافظ على الوضعية لمدة 20-30 ثانية\n5. كرر 3 مرات',
                    duration: '30 ثانية',
                    reps: '3 مرات',
                    warnings: 'تجنب إذا كان لديك ألم حاد',
                    benefits: 'يقوي جميع عضلات الجذع'
                }
            ]
        },
        numbness: {
            beginner: [
                {
                    id: 'lumbar_nerve_glide',
                    name: 'تمديد أعصاب أسفل الظهر',
                    scientificName: 'Lumbar Nerve Gliding',
                    description: 'تمارين لتحسين حركة الأعصاب القطنية',
                    instructions: '1. استلقِ على ظهرك\n2. ارفع ركبتك اليمنى\n3. أمسك ركبتك بيدك\n4. مد ساقك ببطء\n5. حافظ على الوضعية لمدة 5 ثواني\n6. كرر على الجانب الآخر',
                    duration: '20 ثانية',
                    reps: '5 مرات لكل جانب',
                    warnings: 'توقف إذا شعرت بألم',
                    benefits: 'يحسن حركة الأعصاب القطنية'
                },
                {
                    id: 'lumbar_sciatic_stretch',
                    name: 'تمديد العصب الوركي',
                    scientificName: 'Sciatic Nerve Stretch',
                    description: 'تمرين لتمديد العصب الوركي',
                    instructions: '1. استلقِ على ظهرك\n2. ارفع ركبتك اليمنى\n3. أمسك ركبتك بيدك اليمنى\n4. اسحب ركبتك نحو صدرك\n5. حافظ على الوضعية لمدة 20-30 ثانية\n6. كرر على الجانب الآخر',
                    duration: '40 ثانية',
                    reps: '3 مرات لكل جانب',
                    warnings: 'كن حذراً إذا كان لديك ألم شديد',
                    benefits: 'يقلل الضغط على العصب الوركي'
                }
            ],
            intermediate: [
                {
                    id: 'lumbar_piriformis_stretch',
                    name: 'تمديد عضلة الكمثري',
                    scientificName: 'Piriformis Stretch',
                    description: 'تمرين لتمديد عضلة الكمثري في الأرداف',
                    instructions: '1. استلقِ على ظهرك\n2. ارفع ركبتك اليمنى\n3. ضع كاحلك الأيمن على ركبتك اليسرى\n4. اسحب ركبتك اليسرى نحو صدرك\n5. حافظ على الوضعية لمدة 30 ثانية\n6. كرر على الجانب الآخر',
                    duration: '45 ثانية',
                    reps: '3 مرات لكل جانب',
                    warnings: 'لا تفرط في التمدد',
                    benefits: 'يقلل الضغط على العصب الوركي'
                }
            ]
        }
    },

    // تمارين الكتف
    shoulder: {
        pain: {
            beginner: [
                {
                    id: 'shoulder_pendulum',
                    name: 'تمرين البندول',
                    scientificName: 'Shoulder Pendulum Exercise',
                    description: 'تمرين لتحسين مرونة الكتف',
                    instructions: '1. قف بجانب طاولة\n2. ضع يدك على الطاولة\n3. دع ذراعك الأخرى يتدلى\n4. حرك ذراعك في دوائر صغيرة\n5. كرر 10-15 مرة لكل اتجاه',
                    duration: '30 ثانية',
                    reps: '10-15 مرة لكل اتجاه',
                    warnings: 'لا تحرك بقوة شديدة',
                    benefits: 'يحسن مرونة الكتف'
                },
                {
                    id: 'shoulder_cross_body',
                    name: 'تمرين عبور الجسم',
                    scientificName: 'Cross-Body Shoulder Stretch',
                    description: 'تمرين لتمديد عضلات الكتف',
                    instructions: '1. قف بشكل مستقيم\n2. ارفع ذراعك اليمنى\n3. اسحبه ببطء عبر جسمك\n4. حافظ على الوضعية لمدة 15-20 ثانية\n5. كرر على الجانب الآخر',
                    duration: '30 ثانية',
                    reps: '3 مرات لكل جانب',
                    warnings: 'لا تسحب بقوة شديدة',
                    benefits: 'يمدد عضلات الكتف الخلفية'
                }
            ],
            intermediate: [
                {
                    id: 'shoulder_wall_slide',
                    name: 'انزلاق الحائط',
                    scientificName: 'Wall Slide Exercise',
                    description: 'تمرين لتحسين حركة الكتف',
                    instructions: '1. قف بجانب حائط\n2. ضع يدك على الحائط\n3. انزلق بذراعك للأعلى\n4. حافظ على الوضعية لمدة 5-10 ثواني\n5. كرر 10 مرات',
                    duration: '30 ثانية',
                    reps: '10 مرات',
                    warnings: 'لا ترفع ذراعك عالياً جداً',
                    benefits: 'يحسن حركة الكتف'
                }
            ]
        }
    },

    // تمارين الورك
    hip: {
        pain: {
            beginner: [
                {
                    id: 'hip_flexor_stretch',
                    name: 'تمديد عضلات ثني الورك',
                    scientificName: 'Hip Flexor Stretch',
                    description: 'تمرين لتمديد عضلات الورك الأمامية',
                    instructions: '1. انزل على ركبة واحدة\n2. اثنِ ركبتك الأمامية\n3. ادفع وركك للأمام\n4. حافظ على الوضعية لمدة 20-30 ثانية\n5. كرر على الجانب الآخر',
                    duration: '40 ثانية',
                    reps: '3 مرات لكل جانب',
                    warnings: 'لا تدفع بقوة شديدة',
                    benefits: 'يمدد عضلات ثني الورك'
                },
                {
                    id: 'hip_abduction',
                    name: 'تمرين تباعد الورك',
                    scientificName: 'Hip Abduction Exercise',
                    description: 'تمرين لتقوية عضلات الورك الجانبية',
                    instructions: '1. استلقِ على جانبك\n2. ارفع ركبتك العلوية\n3. حافظ على الوضعية لمدة 5 ثواني\n4. أنزل ببطء\n5. كرر 10-15 مرة\n6. كرر على الجانب الآخر',
                    duration: '30 ثانية',
                    reps: '10-15 مرة لكل جانب',
                    warnings: 'لا ترفع ركبتك عالياً جداً',
                    benefits: 'يقوي عضلات الورك الجانبية'
                }
            ]
        }
    },

    // تمارين الركبة
    knee: {
        pain: {
            beginner: [
                {
                    id: 'knee_quad_stretch',
                    name: 'تمديد عضلات الفخذ الأمامية',
                    scientificName: 'Quadriceps Stretch',
                    description: 'تمرين لتمديد عضلات الفخذ',
                    instructions: '1. قف بجانب حائط\n2. أمسك بقدمك اليمنى\n3. اسحب كاحلك نحو وركك\n4. حافظ على الوضعية لمدة 20-30 ثانية\n5. كرر على الجانب الآخر',
                    duration: '40 ثانية',
                    reps: '3 مرات لكل جانب',
                    warnings: 'لا تسحب كاحلك بقوة',
                    benefits: 'يمدد عضلات الفخذ'
                },
                {
                    id: 'knee_hamstring_stretch',
                    name: 'تمديد عضلات الفخذ الخلفية',
                    scientificName: 'Hamstring Stretch',
                    description: 'تمرين لتمديد عضلات الفخذ الخلفية',
                    instructions: '1. اجلس على الأرض\n2. مد ساقك اليمنى\n3. انحنِ ببطء نحو قدمك\n4. حافظ على الوضعية لمدة 15-20 ثانية\n5. كرر على الجانب الآخر',
                    duration: '30 ثانية',
                    reps: '3 مرات لكل جانب',
                    warnings: 'لا تنحنِ بقوة شديدة',
                    benefits: 'يمدد عضلات الفخذ الخلفية'
                }
            ],
            intermediate: [
                {
                    id: 'knee_wall_sit',
                    name: 'الجلوس على الحائط',
                    description: 'تمرين لتقوية عضلات الفخذ',
                    instructions: '1. قف بظهرك للحائط\n2. انزلق للأسفل حتى تكون ركبتك بزاوية 90 درجة\n3. حافظ على الوضعية لمدة 20-30 ثانية\n4. كرر 3 مرات',
                    duration: '30 ثانية',
                    reps: '3 مرات',
                    warnings: 'لا تنزل لزاوية أقل من 90 درجة',
                    benefits: 'يقوي عضلات الفخذ'
                }
            ]
        }
    }
};

// دالة للحصول على التمارين المناسبة بناءً على المعايير
function getExercisesForPatient(painArea, symptoms, diagnosis, recoveryStage) {
    const exercises = [];
    
    // تحديد منطقة الألم
    const areaExercises = EXERCISES_DATABASE[painArea];
    if (!areaExercises) {
        return exercises;
    }
    
    // تحديد نوع الأعراض (ألم أو خدر)
    const symptomType = symptoms.includes('خدر') || symptoms.includes('تنميل') ? 'numbness' : 'pain';
    const symptomExercises = areaExercises[symptomType] || areaExercises['pain'] || [];
    
    // تحديد مستوى التقدم
    let level = 'beginner';
    if (recoveryStage === 'improving' || recoveryStage === 'تحسن') {
        level = 'intermediate';
    } else if (recoveryStage === 'recovered' || recoveryStage === 'شفاء') {
        level = 'advanced';
    }
    
    const levelExercises = symptomExercises[level] || symptomExercises['beginner'] || [];
    
    // إضافة التمارين
    exercises.push(...levelExercises);
    
    // إذا كان هناك تشخيص محدد، أضف تمارين إضافية
    if (diagnosis && Array.isArray(diagnosis)) {
        diagnosis.forEach(diag => {
            // التحقق من نوع diag قبل استخدام includes
            const diagText = typeof diag === 'string' ? diag : (diag.name || diag.diagnosis || '');
            if (diagText.includes('انزلاق') || diagText.includes('ديسك')) {
                // إضافة تمارين خاصة بالانزلاق الغضروفي
                exercises.push({
                    id: 'disc_stability',
                    name: 'تمارين استقرار العمود الفقري',
                    description: 'تمارين لتقوية عضلات العمود الفقري',
                    instructions: '1. استلقِ على ظهرك\n2. اثنِ ركبتيك\n3. اضغط ظهرك على الأرض\n4. حافظ على الوضعية لمدة 10 ثواني\n5. كرر 10 مرات',
                    duration: '30 ثانية',
                    reps: '10 مرات',
                    warnings: 'تجنب الانحناءات العميقة',
                    benefits: 'يحسن استقرار العمود الفقري'
                });
            }
        });
    }
    
    return exercises;
}

// تصدير الدوال والبيانات
if (typeof module !== 'undefined' && module.exports) {
    module.exports = { EXERCISES_DATABASE, getExercisesForPatient };
}
