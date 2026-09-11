// ==========================================================================
// محرك الذكاء الاصطناعي السريري (Gemini Clinical AI Engine)
// عيادة وداعاً للألم للكايروبراكتيك والمعالجة اليدوية
// ==========================================================================

const Wada3anAiEngine = {

    // العثور التلقائي على النموذج المتاح والمتوافق مع المفتاح
    async discoverWorkingModel(key) {
        // أولاً: محاولة استعلام قائمة النماذج المتاحة لهذا المفتاح
        const listUrls = [
            `https://generativelanguage.googleapis.com/v1beta/models?key=${key}`,
            `https://generativelanguage.googleapis.com/v1/models?key=${key}`
        ];

        for (const listUrl of listUrls) {
            try {
                const res = await fetch(listUrl);
                if (res.ok) {
                    const data = await res.json();
                    const models = (data.models || [])
                        .filter(m => m.supportedGenerationMethods && m.supportedGenerationMethods.includes('generateContent'))
                        .map(m => m.name.replace(/^models\//, ''));
                    
                    if (models.length > 0) {
                        // تفضيل نماذج flash إن وجدت
                        const preferred = models.find(m => m.includes('flash') || m.includes('pro')) || models[0];
                        const apiVer = listUrl.includes('/v1/') ? 'v1' : 'v1beta';
                        return { model: preferred, version: apiVer, availableModels: models };
                    }
                }
            } catch (e) {
                console.warn('Model list query failed:', e);
            }
        }

        // ثانياً: فحص النماذج المرشحة واحداً تلو الآخر إن لم تنجح قائمة النماذج
        const candidates = [
            { model: 'gemini-3.6-flash', version: 'v1beta' },
            { model: 'gemini-flash-latest', version: 'v1beta' },
            { model: 'gemini-2.5-flash-lite', version: 'v1beta' },
            { model: 'gemini-3.5-flash', version: 'v1beta' },
            { model: 'gemini-3-flash-preview', version: 'v1beta' },
            { model: 'gemini-pro-latest', version: 'v1beta' }
        ];

        for (const cand of candidates) {
            try {
                const testUrl = `https://generativelanguage.googleapis.com/${cand.version}/models/${cand.model}:generateContent?key=${key}`;
                const res = await fetch(testUrl, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ contents: [{ parts: [{ text: '1' }] }] })
                });
                if (res.ok) {
                    return { model: cand.model, version: cand.version };
                }
            } catch (e) {}
        }

        return null;
    },

    // اختبار الاتصال بالمفتاح للتأكد من صلاحيته وتحديد النموذج المناسب
    async testConnection(testKey) {
        const key = testKey || WADA3AN_AI_CONFIG.getApiKey();
        if (!key) {
            return { success: false, message: 'يرجى إدخال مفتاح API أولاً' };
        }

        try {
            const discovery = await this.discoverWorkingModel(key);
            if (discovery) {
                // حفظ النموذج والإصدار الناجح
                localStorage.setItem('wada3an_active_ai_model', discovery.model);
                localStorage.setItem('wada3an_active_ai_version', discovery.version);
                return {
                    success: true,
                    message: `الاتصال ناجح تماماً! تم ربط النموذج النشط بنجاح: (${discovery.model}) على إصدار (${discovery.version}).`,
                    model: discovery.model
                };
            } else {
                return {
                    success: false,
                    message: 'تم استقبال المفتاح، ولكن لم يستجب أي من نماذج Gemini المتاحة. يرجى التأكد من تفعيل "Gemini API" في مشروع Google Cloud الخاص بك.'
                };
            }
        } catch (e) {
            return { success: false, message: `خطأ أثناء الاتصال بالإنترنت أو الخادم: ${e.message}` };
        }
    },

    // توليد التحليل السريري المخصص للمراجع بناءً على بياناته وأعراضه
    // توليد التحليل السريري المخصص للمراجع بناءً على بياناته وأعراضه
    async generateClinicalInsight(patientData) {
        const key = WADA3AN_AI_CONFIG.getApiKey();
        
        // مفتاح كاش ديناميكي يرتبط باسم المراجع ومحتوى ملاحظاته لمنع الكاش القديم المبتور
        const pNameClean = (patientData.patientName || '').trim().replace(/^يا\s+/i, '');
        const hasRealName = pNameClean && pNameClean !== 'المراجع الكريم' && pNameClean !== 'المراجع' && pNameClean !== 'المراجع المحترم';
        const patientName = hasRealName ? pNameClean : '';
        const notesSummary = (patientData.userNotes || '').slice(0, 40);
        const cacheKey = `ai_insight_v104_${patientName || 'anon'}_${patientData.probableCondition || 'cond'}_${notesSummary}`;
        try {
            const cached = sessionStorage.getItem(cacheKey);
            // لا نستخدم الكاش إلا إذا كان يحتوي على اسم المراجع ومكتملاً
            if (cached && (!patientName || cached.includes(patientName))) {
                return cached;
            }
        } catch (e) {}

        // إذا لم يكن المفتاح مدخلاً، تقديم التحليل السريري الاحتياطي الذكي
        if (!key || !WADA3AN_AI_CONFIG.isConfigured()) {
            return this.generateOfflineClinicalFallback(patientData);
        }

        const painArea = patientData.painAreaTitle || patientData.title || 'منطقة الألم';
        let condition = patientData.primaryDiagnosis || patientData.probableCondition || patientData.conditionName || '';
        const pointId = (patientData.pointId || patientData.painAreaKey || '').toLowerCase();
        const painAreaLower = painArea.toLowerCase();

        // استنتاج التشخيص التشريحي الدقيق للمنطقة إن كان المدخل عاماً أو مفقوداً لمنع التعميم نهائياً
        if (!condition || condition === 'إجهاد ميكانيكي حركي' || condition.includes('تقرير استرشادي') || condition.includes('استرشادي')) {
            if (pointId.includes('knee') || painAreaLower.includes('ركب') || painAreaLower.includes('صابون')) {
                condition = 'متلازمة الألم الرضفي الفخذي واحتكاك صابونة الركبة (Patellofemoral Pain Syndrome)';
            } else if (pointId.includes('lumbar') || painAreaLower.includes('قطني') || painAreaLower.includes('أسفل الظهر')) {
                condition = 'انزلاق غضروفي قطني واعتلال الجذور العصبية L4-S1 (Lumbar Disc Herniation & Radiculopathy)';
            } else if (pointId.includes('cervical') || painAreaLower.includes('عنق') || painAreaLower.includes('رقب')) {
                condition = 'انزلاق غضروفي عنقي وانحباس مفاصل الفقرات C5-C7 (Cervical Disc & Facet Syndrome)';
            } else if (pointId.includes('scapula') || pointId.includes('trapezius') || painAreaLower.includes('أبهر') || painAreaLower.includes('كتف')) {
                condition = 'متلازمة عقد الأبهر الليفية وتشنج العضلات المعينية واللوحية (Rhomboid & Scapular Trigger Points)';
            } else if (pointId.includes('sacroiliac') || pointId.includes('gluteal') || painAreaLower.includes('حوض') || painAreaLower.includes('عرق النسا')) {
                condition = 'متلازمة العضلة الكمثرية وعرق النسا الانضغاطي (Piriformis Syndrome & Sciatica)';
            } else if (pointId.includes('shoulder') || painAreaLower.includes('كتف')) {
                condition = 'متلازمة ضغط واحتكاك أوتار الكفة المدورة وتيبس مفصل الكتف (Rotator Cuff Impingement)';
            } else if (pointId.includes('plantar') || pointId.includes('ankle') || painAreaLower.includes('كعب') || painAreaLower.includes('قدم')) {
                condition = 'التهاب اللفافة الأخمصية ومسمار العظم وإجهاد وتر أكيليس (Plantar Fasciitis)';
            } else {
                condition = 'اضطراب ميكانيكي حركي وتشنج وظيفي في المفاصل والأوتار';
            }
        }
        const probability = patientData.probability || 85;
        const duration = patientData.painDurationText || patientData.painDuration || 'ألم مستمر';
        const hasExplicitPain = !!patientData.hasExplicitPain && patientData.painSeverity !== null && patientData.painSeverity !== undefined;
        const severity = hasExplicitPain 
            ? `${patientData.painSeverity} من 10` 
            : 'تقييم سريري مستند لوصف الأعراض الحركية المباشرة (لم يحدد المراجع مقياساً رقمياً للألم)';
        const userNotes = patientData.userNotes || '';
        const allSymptoms = (patientData.allSymptoms || []).join('، ') || 'أعراض موضعية';
        const lifeImpact = (patientData.lifeImpact || []).join('، ') || '';

        const greetingInstruction = patientName
            ? `ابدأ السطر الأول صراحة بـ: "أهلاً بك يا ${patientName} في «وداعاً للألم».."`
            : `ابدأ السطر الأول بـ: "أهلاً بك في «وداعاً للألم».." (ممنوع منعاً باتاً كتابة "يا المراجع الكريم" أو أي صيغة مناداة ركيكة).`;

        const secondaryDiag = patientData.secondaryDiagnosis ? `\n- التشخيص التفريقي الثانوي: ${patientData.secondaryDiagnosis}` : '';
        const rootLevel = patientData.rootLevel ? `\n- المستوى التشريحي المتأثر: ${patientData.rootLevel}` : '';
        const bioMechanism = patientData.biomechanicalMechanism ? `\n- الآلية الميكانيكية المعتمدة للحالة: ${patientData.biomechanicalMechanism}` : '';

        // صياغة التوجيه السريري الموجه فائق الدقة (Clinical Biomechanical System Prompt)
        const systemPrompt = `
أنت الاستشاري الطبي الذكي في منظومة «وداعاً للألم» (المتخصصة في تقويم الكايروبراكتيك والمعالجة اليدوية الشاملة للعمود الفقري والمفاصل والعضلات والأعصاب والأوتار).
المطلوب منك: صياغة التفسير السريري والبيوميكانيكي الدقيق لحالة المراجع بلغة عربية طبية واضحة ومبسطة ومريحة يفهمها المراجع، مخصصة 100% لموضع ألمه وشكواه الحقيقية دون أي تعميم:
- اسم المراجع: ${patientName || 'غير محدد (خاطبه بالترحاب الدافئ دون ذكر اسم)'}
- موضع الشكوى الحقيقي: ${painArea}
- التشخيص السريري المرجح: ${condition} (بنسبة اشتباه سريري ${probability}%)${secondaryDiag}${rootLevel}${bioMechanism}
- شدة الألم: ${severity} | فترة المعاناة: ${duration}
- تفاصيل ما قاله ووصفه المراجع في حواره السريري: "${userNotes || 'ألم موضعي مع انحراف وتيبس حركي'}"
- الأعراض والعلامات الإضافية المحددة: ${allSymptoms}
${lifeImpact ? `- الأنشطة اليومية المتأثرة: ${lifeImpact}` : ''}

⚠️ قواعد حاسمة لمنع الهلوسة والافتراضات الخاطئة:
1. ${!hasExplicitPain ? 'المراجع لم يحدد أي رقم لشدة الألم (مثل 7 من 10 أو غيره). ممنوع منعاً باتاً أن تفترض أو تذكر أي تقييم رقمي مثل (7 من 10) أو (8 من 10) أو غيرها. صف شدة الألم وتأثيره استناداً لأعراض المراجع وما كتبه فقط.' : 'المراجع حدد شدة الألم صراحة بـ ' + patientData.painSeverity + ' من 10.'}
2. ممنوع منعاً باتاً حصر ألم المراجع أو صعوبة حركته عند الثني (Flexion) إلا إذا كان المراجع قد ذكر كلمة "ثني" أو "انحناء" صراحة في وصفه. صف حركة المفصل والألم بدقة حسب كلام المراجع فقط.
3. التوجيه اللغوي والاصطلاحي السريري:
- اعتمد لغة عربية فصيحة ومبسطة ومصطلحات شائعة ودارجة يفهمها الجميع: (ديسك، فتق، انزلاق غضروفي، شد وتشنج عضلي، عرق النسا، خدر وتنميل، ضغط على العصب، إجهاد أوتار).
- تجنب تماماً الألفاظ المعقدة أو الصعبة مثل (انحشار) أو (المحاذاة والاصطفاف).
- احرص على كتابة المصطلح الطبي اللاتيني/الإنجليزي الدقيق بين قوسين لتعزيز الوقار السريري (مثل: Manual Decompression, Disc Herniation, Nerve Entrapment, Muscle Spasm, Sciatica).

الهيكل الإلزامي للتقرير:

### 🩺 التفسير الميكانيكي والسريري الدقيق للخلل
${greetingInstruction}
اشرح للمراجع بدقة أصل المشكلة في منطقة (${painArea}) بناءً على حالته (${condition}) وتفاصيل حواره ووصفه الفعلي.
ادمج المصطلحات الطبية اللاتينية الخاصة بمشكلته ومفصله حصراً بين قوسين (مثل مفاصل الفقرات أو الأوتار المعنية أو تفريغ الضغط اليدوي Manual Decompression).
ممنوع منعاً باتاً ذكر تشخيصات أو مناطق تشريحية أخرى لا علاقة لها بشكواه (مثلاً: لا تذكر عرق النسا إن كانت الشكوى في الرقبة أو الكتف أو الركبة أو الرسغ، ولا تذكر فقرات الظهر إن كان الفحص لليد أو الكوع).
قم بضبط الكلمات التي قد يلتبس نطقها لتسهيل قراءتها: (الظَّهْر - الفَقَرَات - الغُضْرُوف - المَفَاصِل - تَشَنُّج).
ضابط تشكيل صارم: الكلمة الأخيرة في أي جملة أو فقرة قبل النقطة يجب أن تكون خالية من التشكيل لضمان الوقف الطبيعي بالسكون.

### ⚡ دور الكايروبراكتيك في الحل الجذري والنهائي
وضّح للمراجع بلغة مقنعة كيف تعمل جلسات الكايروبراكتيك اليدوية في «وداعاً للألم» على معالجة الخلل الميكانيكي في (${painArea}) وإعادة التوازن الطبيعي للمفاصل وتحرير الضغط عن الأعصاب والأوتار والعضلات بأمان تام 100% وبدون أي مسكنات كيميائية أو جراحة.
أبرز للمراجع أن الكايروبراكتيك في «وداعاً للألم» تخصص شامل لعلاج المفاصل، وفك تشنج العضلات والأوتار، وتحرير مسارات الأعصاب وتخفيف الخدر والتنميل، والتأهيل الحركي لحالات ضعف الحركة وإعادة تأهيل الجلطات، وليس مقتصراً فقط على فقرات العمود الفقري.
اذكر صراحة توفر خدمة الزيارات المنزلية داخل الأردن، والاستشارات المرئية وقراءة تقارير الرنين عن بُعد مجاناً للمراجعين المغتربين حول العالم عبر الواتساب الدولي.

ضوابط صارمة لا تقبل الاستثناء:
1. التحدث باسم مؤسسة «وداعاً للألم» للكايروبراكتيك.
2. استخدام المصطلحات التشريحية اللائقة والراقية والمفهومة.
3. ممنوع منعاً باتاً استخدام الكلمات: "عيادة"، "مركز"، "فريقنا"، "كوادرنا".
4. ممنوع منعاً باتاً وصف أي مسكنات كيميائية أو أدوية أو اقتراح جراحة.
5. لا تقم بتضمين أقسام إضافية للهدايا أو النصائح لأنها معروضة بالتفصيل أسفل التقرير.
6. اختم بفقرة ختامية دافئة تتمنى للمراجع السلامة والعافية التامة.
`;

        try {
            const rawText = await this.callRawGemini(systemPrompt, { maxTokens: 3072, temperature: 0.6 });
            if (rawText && rawText.trim()) {
                const formattedHtml = this.formatMarkdownToHtml(rawText);
                try { sessionStorage.setItem(cacheKey, formattedHtml); } catch (e) {}
                return formattedHtml;
            }
        } catch (e) {
            console.warn('Gemini clinical analysis call failed, using offline fallback:', e);
        }

        return this.generateOfflineClinicalFallback(patientData);
    },

    // تنسيق الـ Markdown إلى HTML سريري احترافي بمحاذاة متقنة وعزل تام للمصطلحات الإنجليزية
    formatMarkdownToHtml(text) {
        if (!text) return '';

        // 1. تنظيف فواصل الأسطر
        let raw = text.replace(/\r\n/g, '\n').trim();

        // 2. عزل وإصلاح المصطلحات الطبية واللاتينية بين أقواس لمنع انقلاب الأقواس وتشوه الكلمات (BiDi Isolation)
        raw = raw.replace(/[\(（]\s*([A-Za-z0-9\s\-_/.,+*&]+)\s*[\)）]/g, (match, term) => {
            let cleanTerm = term.trim().replace(/^[&+،,\s]+/, '').replace(/[&+،,\s]+$/, '').trim();
            if (!cleanTerm) return match;
            if (/[A-Za-z]/.test(cleanTerm)) {
                return ` <span class="medical-latin-badge" dir="ltr">(${cleanTerm})</span> `;
            }
            return ` (${cleanTerm}) `;
        });

        // 3. معالجة العناوين
        raw = raw.replace(/^###\s*(.*?)$/gm, '<h4 class="ai-report-subheading">$1</h4>');
        raw = raw.replace(/^##\s*(.*?)$/gm, '<h3 class="ai-report-mainheading">$1</h3>');

        // 4. معالجة النصوص العريضة والمائلة
        raw = raw.replace(/\*\*(.*?)\*\*/g, '<strong class="ai-bold-highlight">$1</strong>');
        raw = raw.replace(/\*(.*?)\*/g, '<em>$1</em>');

        // 5. معالجة القوائم المرقمة والنقطية والفقرات بذكاء سطر بسطر
        const lines = raw.split('\n');
        const formattedLines = [];
        let inUl = false;
        let inOl = false;

        for (let i = 0; i < lines.length; i++) {
            const line = lines[i].trim();
            if (!line) {
                if (inUl) { formattedLines.push('</ul>'); inUl = false; }
                if (inOl) { formattedLines.push('</ol>'); inOl = false; }
                continue;
            }

            const bulletMatch = line.match(/^[-*•]\s+(.*)$/);
            const numMatch = line.match(/^(\d+)[\.\)]\s+(.*)$/);

            if (bulletMatch) {
                if (inOl) { formattedLines.push('</ol>'); inOl = false; }
                if (!inUl) { formattedLines.push('<ul class="ai-styled-list">'); inUl = true; }
                formattedLines.push(`<li class="ai-list-item">${bulletMatch[1]}</li>`);
            } else if (numMatch) {
                if (inUl) { formattedLines.push('</ul>'); inUl = false; }
                if (!inOl) { formattedLines.push('<ol class="ai-styled-num-list">'); inOl = true; }
                formattedLines.push(`<li class="ai-list-num-item">${numMatch[2]}</li>`);
            } else {
                if (inUl) { formattedLines.push('</ul>'); inUl = false; }
                if (inOl) { formattedLines.push('</ol>'); inOl = false; }

                if (line.startsWith('<h3') || line.startsWith('<h4')) {
                    formattedLines.push(line);
                } else {
                    formattedLines.push(`<p class="ai-report-paragraph">${line}</p>`);
                }
            }
        }

        if (inUl) formattedLines.push('</ul>');
        if (inOl) formattedLines.push('</ol>');

        return `<div class="ai-insight-formatted-content">${formattedLines.join('\n')}</div>`;
    },

    // التفسير السريري والبيوميكانيكي الاحتياطي الفوري في حال عدم توفر النت
    generateOfflineClinicalFallback(patientData) {
        const pNameClean = (patientData.patientName || '').trim().replace(/^يا\s+/i, '');
        const hasRealName = pNameClean && pNameClean !== 'المراجع الكريم' && pNameClean !== 'المراجع' && pNameClean !== 'المراجع المحترم';
        const greetingText = hasRealName ? `أهلاً بك يا <strong style="color: #fef08a;">${pNameClean}</strong> في «وداعاً للألم»..` : `أهلاً بك في «وداعاً للألم»..`;
        const painArea = patientData.painAreaTitle || patientData.title || 'المنطقة المحددة';
        let condition = patientData.primaryDiagnosis || patientData.probableCondition || patientData.conditionName || '';
        const pointId = (patientData.pointId || patientData.painAreaKey || '').toLowerCase();
        const painAreaLower = painArea.toLowerCase();

        // استنتاج التشخيص التشريحي الدقيق للمنطقة إن كان المدخل عاماً
        if (!condition || condition === 'إجهاد ميكانيكي حركي' || condition.includes('تقرير استرشادي')) {
            if (pointId.includes('knee') || painAreaLower.includes('ركب') || painAreaLower.includes('صابون')) {
                condition = 'متلازمة الألم الرضفي الفخذي واحتكاك صابونة الركبة (Patellofemoral Pain Syndrome)';
            } else if (pointId.includes('lumbar') || painAreaLower.includes('قطني') || painAreaLower.includes('أسفل الظهر')) {
                condition = 'انزلاق غضروفي قطني واعتلال الجذور العصبية L4-S1 (Lumbar Disc Herniation & Radiculopathy)';
            } else if (pointId.includes('cervical') || painAreaLower.includes('عنق') || painAreaLower.includes('رقب')) {
                condition = 'انزلاق غضروفي عنقي وانحباس مفاصل الفقرات C5-C7 (Cervical Disc & Facet Syndrome)';
            } else if (pointId.includes('scapula') || pointId.includes('trapezius') || painAreaLower.includes('أبهر') || painAreaLower.includes('كتف')) {
                condition = 'متلازمة عقد الأبهر الليفية وتشنج العضلات المعينية واللوحية (Rhomboid & Scapular Trigger Points)';
            } else if (pointId.includes('sacroiliac') || pointId.includes('gluteal') || painAreaLower.includes('حوض') || painAreaLower.includes('عرق النسا')) {
                condition = 'متلازمة العضلة الكمثرية وعرق النسا الانضغاطي (Piriformis Syndrome & Sciatica)';
            } else if (pointId.includes('shoulder') || painAreaLower.includes('كتف')) {
                condition = 'متلازمة ضغط واحتكاك أوتار الكفة المدورة وتيبس مفصل الكتف (Rotator Cuff Impingement)';
            } else if (pointId.includes('plantar') || pointId.includes('ankle') || painAreaLower.includes('كعب') || painAreaLower.includes('قدم')) {
                condition = 'التهاب اللفافة الأخمصية ومسمار العظم وإجهاد وتر أكيليس (Plantar Fasciitis)';
            } else {
                condition = 'اضطراب ميكانيكي حركي وتشنج وظيفي في المفاصل والأوتار';
            }
        }

        // استنتاج الآلية الميكانيكية الدقيقة للحالة
        let mechanism = patientData.biomechanicalMechanism || '';
        if (!mechanism || mechanism.length < 30) {
            if (pointId.includes('knee') || painAreaLower.includes('ركب') || painAreaLower.includes('صابون')) {
                mechanism = 'خلل في مسار انزلاق صابونة الركبة داخل مجراها الفخذي (Patellar Maltracking) مع ضعف نسبي في العضلة المتسعة الإنسية VMO، مما يسبب احتكاكاً ميكانيكياً في السطح الخلفي الغضروفي للصابونة وتيبساً عند الثني ونزول الدرج.';
            } else if (pointId.includes('lumbar') || painAreaLower.includes('قطني') || painAreaLower.includes('أسفل الظهر')) {
                mechanism = 'بروز جزئي في نواة القرص الغضروفي القطني مسبباً ضغطاً والتهاباً ميكانيكياً على الجذور العصبية للعصب الوركي، مصحوباً بتشنج وقائي انقباضي في عضلات نصب الفقرات لتقييد الحركة.';
            } else if (pointId.includes('cervical') || painAreaLower.includes('عنق') || painAreaLower.includes('رقب')) {
                mechanism = 'انحناء مستمر للرأس للأمام يضاعف الحمل البيوميكانيكي على فقرات الرقبة C5-C7 بنسبة تفوق 300%، مما يؤدي لانحباس مفاصل الفقرات وانضغاط جذور الأعصاب الممتدة للكتف والذراع.';
            } else if (pointId.includes('scapula') || pointId.includes('trapezius') || painAreaLower.includes('أبهر')) {
                mechanism = 'تشكل عقد عضلية ليفية زنادية شديدة الحساسية (Myofascial Trigger Points) في عضلات ما بين لوحي الكتف ناتجة عن إجهاد الجلوس المكتبي المترهل وضعف عضلات التثبيت.';
            } else {
                mechanism = 'اختلال في المحاذاة الوظيفية للمفاصل والفقرات ناتج عن توزيع غير متكافئ للأحمال الميكانيكية، مما يدفع العضلات المحيطة لانقباض دفاعي مستمر مسبباً انحباس الحركة وتفاقم الألم.';
            }
        }

        const userNotes = patientData.userNotes ? `<div style="background: rgba(15,23,42,0.6); padding: 10px 14px; border-radius: 8px; border-right: 3px solid #38bdf8; margin: 10px 0; color: #93c5fd; font-size: 0.88em;">📝 <strong>تفاصيل إضافية من وصفك:</strong> ${patientData.userNotes}</div>` : '';
        const rootInfo = patientData.rootLevel ? `<div style="color: #38bdf8; font-size: 0.88em; font-weight: bold; margin-top: 5px;">🎯 المستوى التشريحي المستهدف: ${patientData.rootLevel}</div>` : '';
        const secInfo = patientData.secondaryDiagnosis ? `<div style="color: #cbd5e1; font-size: 0.85em; margin-top: 4px;">• <strong>التشخيص التفريقي المصاحب:</strong> ${patientData.secondaryDiagnosis}</div>` : '';

        return `
            <div class="ai-insight-formatted-content" style="line-height: 1.85; color: #e2e8f0; font-size: 0.95em; direction: rtl; text-align: justify; text-justify: inter-word; text-align-last: right;">
                <p class="ai-report-paragraph" style="margin-bottom: 12px;">
                    ${greetingText} بناءً على الفحص السريري المباشر لموضع <strong style="color: var(--primary-gold);">${painArea}</strong> وتفاصيل استشارتك ومؤشراتك الحيوية، فإن حالتك مصنفة سريرياً كـ: <strong style="color: #38bdf8;">${condition}</strong>.
                </p>
                ${rootInfo}
                ${secInfo}
                ${userNotes}
                <div style="background: rgba(17, 24, 39, 0.8); border: 1px solid rgba(212, 175, 55, 0.25); border-radius: 10px; padding: 14px 18px; margin: 14px 0; text-align: justify; text-justify: inter-word; text-align-last: right;">
                    <div style="color: var(--primary-gold); font-weight: bold; font-size: 0.98em; margin-bottom: 6px; display: flex; align-items: center; gap: 6px; text-align: right; text-align-last: right;">
                        <span>🔬</span> التفسير الميكانيكي والتشريحي لأصل المشكلة:
                    </div>
                    <div style="color: #cbd5e1; font-size: 0.92em; line-height: 1.75; text-align: justify; text-justify: inter-word; text-align-last: right;">
                        ${mechanism}
                    </div>
                </div>

                <div style="background: rgba(16, 185, 129, 0.08); border: 1px solid rgba(16, 185, 129, 0.3); border-radius: 10px; padding: 14px 18px; margin: 14px 0; text-align: justify; text-justify: inter-word; text-align-last: right;">
                    <div style="color: #6ee7b7; font-weight: bold; font-size: 0.98em; margin-bottom: 6px; display: flex; align-items: center; gap: 6px; text-align: right; text-align-last: right;">
                        <span>⚡</span> دور الكايروبراكتيك في الحل الجذري والنهائي:
                    </div>
                    <div style="color: #cbd5e1; font-size: 0.9em; line-height: 1.75; text-align: justify; text-justify: inter-word; text-align-last: right;">
                        ${patientData.chiropracticProtocol ? patientData.chiropracticProtocol + ' ' : ''}الحل الجذري يكمن في جلسات تقويم الكايروبراكتيك وتفريغ الضغط اليدوي <span class="medical-latin-badge" dir="ltr">(Manual Decompression)</span> في «وداعاً للألم»، حيث يتم إعادة الفقرات والمفاصل لمحاذاتها التشريحية الصحيحة لتحرير جذور الأعصاب بأمان تام 100% وبدون مسكنات كيميائية أو جراحة. ونود إعلامك بتوفر <strong>خدمة زيارات منزلية</strong> داخل الأردن، و<strong>استشارات مرئية وقراءة رنين عن بُعد</strong> لجميع مراجعينا المغتربين حول العالم.
                    </div>
                </div>
            </div>
        `;
    },

    // =========================================================================
    // محرك الطبيب الافتراضي والمحادثة السريرية الحية (Conversational Intake)
    // =========================================================================

    // بدء الحوار السريري الترحيبي بناءً على نقطة الألم
    async startClinicalDialogue(painPointTitle, region) {
        const key = WADA3AN_AI_CONFIG.getApiKey();
        const fallbackWelcome = {
            message: `أهلاً بك في «وداعاً للألم» للكايروبراكتيك.. سلامتك أولاً. أنا طبيبك ومساعدك السريري الذكي في «وداعاً للألم».\n\nنحن هنا لمساعدتك في علاج الحالات الست الرئيسية: (الديسك، عرق النسا، الأبهر، الصداع والرقبة، مشاكل الكتف، وآلام الركبة والمفاصل) بتقويم الكايروبراكتيك الطبيعي الآمن وبدون جراحة أو مسكنات.\n\nيسعدني ويشرفني أولاً التعرف على اسمك الكريم، وعمرك، ووزنك، وطولك التقريبي، وبماذا تشعر تحديداً في **${painPointTitle}**؟ (هذه البيانات الحيوية أساسية لحساب مؤشر الأحمال البيوميكانيكية على المفاصل وتحديد سبب المشكلة بدقة).`,
            quickReplies: [],
            step: 'vitals',
            fieldPrompt: 'الاسم والعمر والوزن والطول وطبيعة الألم'
        };

        if (!key || !WADA3AN_AI_CONFIG.isConfigured()) {
            return fallbackWelcome;
        }

        const prompt = `
أنت الطبيب والمساعد السريري الذكي في «وداعاً للألم» (المتخصصة في تقويم الكايروبراكتيك والمعالجة اليدوية).
المراجع اختار للتو موضع ألمه: (${painPointTitle} - منطقة ${region}).
المطلوب:
صياغة رسالة ترحيب سريرية موجزة ومباشرة ودافئة جداً:
1. الترحيب به في «وداعاً للألم» وطمأنته بأننا متخصصون في علاج الحالات الست الرئيسية: (الديسك، عرق النسا، الأبهر، الصداع والرقبة، الكتف، الركبة والمفاصل) بتقويم الكايروبراكتيك اليدوي الآمن دون جراحة أو أدوية.
2. اطلب منه بلطف تزويدك باسمه الكريم، وعمره، ووزنه، وطوله، وما الذي يشعر به في (${painPointTitle}).
3. وضح له باختصار أن هذه المعلومات الحيوية ضرورية لحساب مؤشر الأحمال البيوميكانيكية على المفاصل ودقة التشخيص.
ضوابط صارمة:
- ممنوع منعاً باتاً استخدام الكلمات: "عيادة"، "مركز"، "فريقنا"، "كوادرنا"! الجهة هي: في «وداعاً للألم».
- لا تضع أي خيارات أو أزرار.
`;

        try {
            const reply = await this.callRawGemini(prompt);
            if (reply && reply.trim()) {
                return {
                    message: reply.trim(),
                    quickReplies: [],
                    step: 'vitals'
                };
            }
        } catch (e) {
            console.warn('Dialogue welcome error:', e);
        }
        return fallbackWelcome;
    },

    // معالجة رد المريض وتوليد السؤال السريري التالي المناسب لحالته
    // معالجة رد المريض وتوليد رد تفاعلي طبي وإنساني فائق الذكاء (Conversational Clinical Agent)
    async advanceClinicalDialogue(context) {
        const key = WADA3AN_AI_CONFIG.getApiKey();
        const { currentStep, history, painPointTitle, patientName, patientVitals, lastUserMessage } = context;

        // في حال عدم توفر مفتاح أو تعذر الاتصال، الرد بذكاء تفاعلي يعالج ما قاله المراجع فعلياً
        if (!key || !WADA3AN_AI_CONFIG.isConfigured()) {
            return this.generateFallbackDialogueStep(context);
        }

        const systemPrompt = `
أنت الاستشاري الذكي في «وداعاً للألم».
أنت وكيل ذكاء اصطناعي تفاعلي سريري فائق الذكاء وحيوي 100% (Clinical AI Agent)، لست آلة ولا تكرر قوالب مسبقة!

المراجع اختار موضع الشكوى على المجسم: [${painPointTitle || 'العمود الفقري والمفاصل'}].
بيانات المريض المعروفة حتى الآن:
- الاسم: ${patientName || 'لم يُذكر بعد'}
- المؤشرات الحيوية: العمر [${patientVitals?.age || 'غير محدد'}] | الوزن [${patientVitals?.weight || 'غير محدد'}] | الطول [${patientVitals?.height || 'غير محدد'}]
- سجل الحوار حتى الآن:
${history.map(h => `${h.sender === 'bot' ? 'الطبيب' : 'المريض'}: ${h.text}`).join('\n')}
- رسالة المريض الأخيرة: "${lastUserMessage}"

معلومات واختصاصات «وداعاً للألم» التي يجب أن تعرفها وتجيب بناءً عليها:
- نطاق الحالات والتخصصات السريرية المعتمدة التي نعالجها ونؤهلها بتقنية الكايروبراكتيك اليدوية في «وداعاً للألم»:
  1. مشاكل العمود الفقري والمفاصل: الديسك والانزلاق الغضروفي (القطني والرقبي)، تضيق القناة الشوكية، خشونة واحتكاك الركبتين والحوض والفقرات، ومسمار القدم.
  2. مشاكل العضلات والأوتار: متلازمة الأبهر (بين لوحي الكتف)، التشنج والإجهاد العضلي المزمن، تجمد الكتف ومشاكل أوتار الكفة المدورة، ونقاط الزناد العضلية المؤلمة.
  3. مشاكل الخدر والتنميل: عرق النسا (سياتيكا)، متلازمة العصب الوركي والكمثرية، متلازمة النفق الرسغي، وانضغاط الأعصاب الطرفية.
  4. التأهيل الحركي السريري: برامج التأهيل لمرضى الجلطات الدماغية، ومن يعانون من صعوبات ومشاكل حركية، عدم اتزان، أو ضعف حركي عصبي.
- خدماتنا المعتمدة:
  * جلسات الكايروبراكتيك اليدوية المتخصصة (إعادة اصطفاف الفقرات وتفريغ الضغط عن الأعصاب).
  * خدمة الزيارات المنزلية المتكاملة داخل الأردن (عمان والزرقاء) لمن يتعذر عليهم الحركة أو يفضلون الراحة ببيوتهم.
  * رعاية شاملة للمغتربين والمرضى الدوليين حول العالم: قراءة مجانية لصور وتقارير الرنين المغناطيسي (MRI) عبر الواتساب الدولي، استشارات سريرية وتأهيلية مرئية عن بُعد، وتنسيق برامج سياحة علاجية مكثفة عند زيارة الأردن.
  * خطة التأهيل والراحة المنزلية الذكية (7 أيام مجاناً بالكامل لجميع المراجعين في العالم).
- الفارق الجوهري السريري: التمارين المنزلية تقدم تسكيناً وراحة مؤقتة، بينما الحل الجذري والنهائي يتطلب جلسة تقويم الكايروبراكتيك اليدوية لإعادة محاذاة المفاصل وتفريغ الضغط الميكانيكي.

قواعد الحوار والتعامل الطبي بذكاء ومرونة تامة:
1. الإيجاز والوضوح والمباشرة:
   - اكتب بإيجاز ومباشرة ودفء كطبيب سريري خبير (فقرة أو فقرتين قصيرتين بحدود 30-45 كلمة).
   - تجنب الإطالة والحشو الإنشائي؛ أجب على كلام المراجع فوراً ثم وجه خطوتك السريرية التالية.

2. ضابط مخاطبة المراجع وعدم تكرار الألقاب:
   - ممنوع منعاً باتاً تكرار الألقاب والنداءات مثل (يا أستاذ / أهلاً يا أستاذ / يا أخ / يا عزيزي) في كل رد!
   - إذا عرفت اسمه، ناده باسمه الأول فقط بلطف في بداية الحوار مرة واحدة، ثم خاطبه بأسلوب مباشر وطبيعي ومريح دون إعادة المناداة في كل جملة.

3. طلب وتأكيد البيانات الحيوية (الاسم، العمر، الوزن، الطول):
   - إذا سأل المراجع أو حيّاك بود ("كيف حالك"، "مرحبا"): رد عليه بترحيب ودود ومريح، وأكد أنك بخير وسعيد لخدمته، ثم اسأله بلطف عن اسمه وعمره ووزنه وما يشعر به. ممنوع نهائياً افتراض أن "كيف" أو كلمات التحية هي اسم المريض!
   - إذا زوّدك المريض باسمه وعمره ووزنه أو طوله: أكد استلامها بدفء في أول ردك (مثال: "أهلاً بك يا [الاسم]، تم تسجيل بياناتك: العمر .. سنة والوزن .. كغم، وهي مؤشرات مهمة لمعايرة الأحمال البيوميكانيكية").
   - إذا لم يذكر المريض اسمه أو عمره أو وزنه أو طوله: اطلبها بلطف وبحزم سريري.
   - إذا سأل المراجع: "هل الاسم ضروري؟" أو "ليش بدك الاسم أو الوزن؟":
     أجبه بوضوح وثقة: "نعم يا طيب، لا يمكننا طبياً فتح ملف سريري أو حساب مؤشر الأحمال البيوميكانيكية على المفاصل بدقة وأمان دون معرفة اسمك الكريم وعمرك ووزنك وطولك. تفضل بتزويدي بها لنبدأ استشارتك بشكل سليم."
   - ممنوع التنازل عن طلب الاسم والمؤشرات الحيوية.

4. الأسلوب الطبي الطبيعي والتركيز على «وداعاً للألم»:
   - تحدث كطبيب واقعي مريح ولا تبدُ أبداً كإعلان تجاري مكرر.
   - التركيز يكون على مؤسسة «وداعاً للألم» للكايروبراكتيك؛ لا تذكر اسم المعالج في طلب الهاتف أو بشكل ترويجي فاقع. هدفنا تقديم قيمة طبية حقيقية للمراجع، والمعالج جمال يُذكر لاحقاً وبشكل وقور في التقرير فقط كأخصائي معتمد.

5. التعامل الراقي والشامل مع المغتربين والمرضى خارج الأردن (حول العالم):
   - الأداة مفتوحة وتخدم كل مراجع في أي دولة بالعالم بكفاءة تامة 100%.
   - إذا ذكر المراجع أنه يقيم خارج الأردن أو أنه مغترب، رحب به بدفء: "أهلاً بك وبأهلنا وأحبتنا المغتربين في كل مكان؛ تقريرك وخطة تمارينك متاحة لك مجاناً بالكامل أينما كنت، كما يمكنك إرسال صور الرنين المغناطيسي (MRI) لقراءتها مجاناً عبر الواتساب الدولي، وحجز استشارة مرئية عن بُعد لتوجيهك، مع ترتيب برنامج سياحة علاجية مكثف عند زيارتك للأردن."
   - لا تشعره أبداً أن الخدمة مقتصرة على الأردن فقط.

6. ضابط الحياء والمصطلحات التشريحية الطبية (مهم جداً):
   - إذا ذكر المراجع كلمات عامية مثل (المؤخرة) لوصف مكان ألمه، ممنوع منعاً باتاً تكرار هذه الكلمة نهائياً في ردك! بل يجب استخدام المصطلح الطبي الوقور المناسب: "منطقة الإلية" أو "العضلة الكمثرية" أو "أسفل الحوض ومفصل الورك خلفياً".

7. ممنوع منعاً باتاً تدريب المريض على التمارين داخل الشات:
   - الشات مخصص فقط لأخذ السيرة المرضية والأعراض وطلب رقم الهاتف. التمارين مكانها تقرير الحالة وخطة التأهيل في الخطوة التالية.

8. الاستجواب السريري العميق والتدقيق الطبي التام قبل طلب رقم الهاتف (شرط أساسي حاسم):
   - لا تطلب رقم الهاتف في بداية الحوار أو بعد رد واحد أو اثنين فقط!
   - استجوب المراجع بشكل متسلسل ومتأنٍ عن:
     أ) التوصيف الدقيق للألم (كهرباء ولسعة تمتد للأطراف، أم شد وتشنج وثقل، أم انحباس مفصلي؟).
     ب) المحفزات الحركية (الجلوس، الانحناء، المشي، الوقوف، السعال؟).
     ج) الأعراض العصبية المرافقة (خدر، تنميل، ضعف عضلات؟).
     د) مدة استمرار الشكوى وتأثيرها على النوم والحركة.
   - فقط عندما تتجمع لديك أركان التشخيص بالكامل:
     * لخص له التشخيص البيوميكانيكي لحالته بوضوح واطمئنان في سطرين.
      * اطلب رقم هاتفه بوضوح واطمئنان:
        "اكتمل الآن تقييمك السريري الشامل وتحددت طبيعة المشكلة بدقة! أدخل رقم هاتفك لفتح التقرير السريري الخاص بك ولربط ملفك بالخطة العلاجية والتأهيلية بإشراف المعالج جمال:"
    - عند استلام رقم هاتف محمول صالح بعد اكتمال الفحص، اختم بـ [READY_FOR_DIAGNOSIS].

9. التعامل مع الحالات والأسئلة خارج نطاق الاختصاص والشفافية الطبية (Out-of-Scope Handling):
   - إذا سأل المراجع عن أمراض خارج اختصاصنا كلياً (مثل السكري، الضغط، القلب، الكلى، الجلدية، العيون):
     رد عليه بلبقة ولطف شديد بأن هذا الموضوع خارج نطاق اختصاصنا السريري في «وداعاً للألم»، وانصحه بمراجعة الطبيب المختص للاطمئنان.
   - إذا سأل المراجع عن عَرَض أو شكوى قد يرتبط حلها أو سببها بأحد المشاكل التي نعالجها (مثل: صداع أو دوخة ناجمة عن تيبس الرقبة، أو ألم بالصدر أو بين الأضلاع ناجم عن الأبهر، أو تنميل وضعف أطراف ناجم عن انضغاط عصبي، أو صعوبة حركة وضعف ناجم عن جلطة سابقة):
     اشرح له بشفافية ووضوح تام: "هذه الشكوى كعرض مباشر تقع خارج اختصاصنا الرئيسي ونوصي دائماً بالفحص الطبي العام، لكننا قد نساعدك في التخلص منها أو تخفيفها بشكل كبير إن كان المسبب الفعلي لها ناتجاً عن ضغط فقري أو شد عضلي أو انضغاط عصبي أو حاجة لتأهيل حركي ضمن اختصاصنا في «وداعاً للألم»."

10. استخراج البيانات (بدقة متناهية):
   - إذا ذكر المريض اسمه صراحة: [EXTRACTED_NAME: الاسم الأول فقط]. (ممنوع منعاً باتاً استخراج كلمات التحية مثل 'كيف' أو 'مرحبا' أو 'أهلا' أو أدوات السؤال كاسم، وإذا لم يذكر اسمه فاكتب: غير محدد).
   - إذا كتب المريض رقم هاتفه: [EXTRACTED_PHONE: الرقم]
   - إذا اكتمل الفحص السريري تماماً وتوفر رقم الهاتف: [READY_FOR_DIAGNOSIS]

11. ضوابط صارمة جداً:
   - ممنوع منعاً باتاً استخدام الكلمات: "عيادة"، "مركز"، "فريقنا"، "كوادرنا"! الجهة هي: في «وداعاً للألم».
   - ممنوع منعاً باتاً ترقيم الكلمات أو وضع أقواس أرقام مثل (1) (2).
   - لا تضع أي أزرار أو خيارات جاهزة.
`;

        try {
            const rawReply = await this.callRawGemini(systemPrompt, { maxTokens: 800, temperature: 0.6 });
            if (rawReply && rawReply.trim()) {
                const isReady = rawReply.includes('[READY_FOR_DIAGNOSIS]');
                
                let extractedName = null;
                const nameM = rawReply.match(/\[EXTRACTED_NAME:\s*([^\]]+)\]/);
                if (nameM && nameM[1]) {
                    const cand = nameM[1].trim().replace(/^يا\s+/i, '').split(/\s+/)[0];
                    const forbiddenNames = ['كيف', 'كيفك', 'مرحبا', 'أهلا', 'اهلا', 'سلام', 'تعبان', 'مريض', 'دكتور', 'طبيب', 'المريض', 'شو', 'ايش', 'عندي', 'وجع', 'الم', 'ظهر', 'ديسك', 'غير', 'غير محدد', 'لا يوجد', 'لم يذكر'];
                    if (!forbiddenNames.includes(cand.toLowerCase()) && cand.length >= 2) {
                        extractedName = cand;
                    }
                }

                let extractedPhone = null;
                const phoneM = rawReply.match(/\[EXTRACTED_PHONE:\s*([^\]]+)\]/);
                if (phoneM && phoneM[1]) {
                    extractedPhone = phoneM[1].trim();
                }

                let message = rawReply
                    .replace(/\[READY_FOR_DIAGNOSIS\]/g, '')
                    .replace(/\[QUICK_REPLIES:.*?\]/g, '')
                    .replace(/\[TRANSCRIPTION:.*?\]/g, '')
                    .replace(/\[EXTRACTED_NAME:.*?\]/g, '')
                    .replace(/\[EXTRACTED_PHONE:.*?\]/g, '')
                    .trim();

                const nextStep = isReady ? 'ask_phone' : 'chatting';
                return { message, quickReplies: [], nextStep, isReady, extractedName, extractedPhone };
            }
        } catch (e) {
            console.warn('Dialogue advance error:', e);
        }

        return this.generateFallbackDialogueStep(context);
    },

    // استدعاء مباشر لـ Gemini مع محاولة تلقائية عبر النماذج وتدوير حوض المفاتيح عند بلوغ الحصة (Key Rotation)
    async callRawGemini(promptText, options = {}) {
        const { maxTokens = 1024, temperature = 0.6 } = options;

        // النماذج المعتمدة والنشطة حالياً في Google Generative Language API
        const candidateModels = [
            'gemini-3-flash-preview',
            'gemini-3.6-flash',
            'gemini-3.5-flash',
            'gemini-flash-latest'
        ];

        const uniqueModels = [...new Set(candidateModels)];

        const payload = {
            contents: [{ parts: [{ text: promptText }] }],
            generationConfig: {
                temperature,
                maxOutputTokens: 1200,
                thinkingConfig: {
                    thinkingBudget: 0
                }
            }
        };


        let lastError = null;
        const pool = WADA3AN_AI_CONFIG.getPoolKeys();
        const now = Date.now();

        // إنشاء قائمة المفاتيح المتاحة (غير المستنفدة) بدءاً من المؤشر الحالي
        const startIdx = WADA3AN_AI_CONFIG._currentPoolIndex;
        const availableKeys = [];
        for (let i = 0; i < pool.length; i++) {
            const idx = (startIdx + i) % pool.length;
            const k = pool[idx];
            if (!k) continue;
            const cd = WADA3AN_AI_CONFIG._exhaustedKeys.get(k);
            if (!cd || now > cd) availableKeys.push({ key: k, idx });
        }

        // إذا لم تتوفر مفاتيح، نحاول بأفضل مفتاح متاح (أقرب وقت انتهاء cooldown)
        if (availableKeys.length === 0) {
            const bestKey = WADA3AN_AI_CONFIG.getApiKey();
            if (bestKey) availableKeys.push({ key: bestKey, idx: WADA3AN_AI_CONFIG._currentPoolIndex });
        }

        console.log(`[AI] المفاتيح المتاحة: ${availableKeys.length}/${pool.length}`);

        for (const { key, idx } of availableKeys) {
            for (const model of uniqueModels) {
                try {
                    const url = `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${key}`;
                    const controller = new AbortController();
                    const timeoutId = setTimeout(() => controller.abort(), 7000); // مهلة 7 ثوانٍ

                    const response = await fetch(url, {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify(payload),
                        signal: controller.signal
                    });
                    clearTimeout(timeoutId);

                    if (response.ok) {
                        const data = await response.json();
                        const reply = data?.candidates?.[0]?.content?.parts?.[0]?.text;
                        if (reply && reply.trim()) {
                            localStorage.setItem('wada3an_active_ai_model', model);
                            WADA3AN_AI_CONFIG._currentPoolIndex = idx;
                            console.log(`[AI] ✅ نجح المفتاح [${idx}] مع ${model}`);
                            return reply;
                        }
                    } else if (response.status === 404) {
                        console.warn(`[AI] نموذج ${model} غير متاح للمفتاح [${idx}] (404)`);
                        continue; // تجربة النموذج التالي فوراً
                    } else if (response.status === 429) {
                        WADA3AN_AI_CONFIG.rotateKey(key);
                        console.warn(`[AI] 429 على المفتاح [${idx}] - انتقال للتالي`);
                        break; // الانتقال للمفتاح التالي
                    } else {
                        const errData = await response.json().catch(() => ({}));
                        lastError = new Error(`Status ${response.status}`);
                    }
                } catch (err) {
                    lastError = err;
                    if (err.name === 'AbortError') {
                        console.warn(`[AI] انتهاء مهلة النموذج ${model} على المفتاح [${idx}]`);
                        continue;
                    }
                }
            }
        }

        throw lastError || new Error('All API keys failed');
    },

    // ردود تفاعلية سريرية ذكية تستجيب لمحتوى كلام المراجع الفعلي بمرونة إنسانية عالية
    generateFallbackDialogueStep(context) {
        const { currentStep, painPointTitle, patientName, patientVitals, lastUserMessage, history } = context;
        // تنظيف الاسم لمنع تكرار كلمة (يا يا) واستبعاد الكلمات غير الاسمية وأدوات الاستفهام والتحية
        const cleanName = (patientName || '')
            .replace(/^يا\s+/i, '')
            .replace(/^(?:أنت|انت|دكتور|طبيب|ما حكيتلك|حكيتلك|مش|مو|لا|تعبان|كيف|كيفك|شلونك|أخبارك|اخبارك|شو|ايش|إيش|وين|مين|ليش|لماذا|هل|مرحبا|أهلا|اهلا|سلام)$/i, '')
            .trim();
        const userTurnCount = (history || []).filter(h => h.sender === 'user').length;
        // مخاطبة المراجع باسمه بلطف في البداية فقط، دون تكراره المزعج في كل رد
        const shouldGreetByName = cleanName && userTurnCount <= 1;
        const nameSuffix = shouldGreetByName ? (' يا ' + cleanName) : '';
        const userText = (lastUserMessage || '').trim();
        const title = painPointTitle || 'موضع الألم';

        // 0. التحقق من التحية أو السؤال عن الحال ("كيف حالك", "شلونك", "أخبارك", "مرحبا", "سلام")
        if (/^(?:كيف\s*حالك|كيفك|شلونك|أخبارك|اخبارك|شخبارك|عساك\s*بخير|شو\s*أخبارك|أهلاً|اهلا|مرحبا|صباح\s*الخير|مساء\s*الخير|السلام\s*عليكم|سلام\s*عليكم)/i.test(userText)) {
            return {
                message: `أهلاً وسهلاً بك يا طيب، الحمد لله بأتم صحة وعافية ويسعدني جداً الاطمئنان عليك وخدمتك! 😊\n\nنحن هنا في «وداعاً للألم» لمساعدتك في علاج وتأهيل **${title}** بتقنية الكايروبراكتيك المعتمدة وبأمان تام.\n\nللبدء في تقييمك السريري، يسعدني التعرف على اسمك الكريم، وعمرك، ووزنك، وما الذي تشعر به تحديداً في **${title}**؟`,
                quickReplies: [],
                nextStep: 'chatting'
            };
        }

        // 0.0 تأكيد استلام البيانات الحيوية فور تزويدها (العمر، الوزن، الطول)
        const hasVitalsInText = /(?:عمري|عمر|سن|سنة|سنه|وزني|وزن|طولي|طول)\s*[:=]?\s*\d+/i.test(userText);
        if (hasVitalsInText) {
            const ageInfo = patientVitals?.age ? ` (العمر: ${patientVitals.age} سنة)` : '';
            const weightInfo = patientVitals?.weight ? ` (الوزن: ${patientVitals.weight} كغم)` : '';
            return {
                message: `أهلاً بك${nameSuffix}، تم تسجيل بياناتك الحيوية بنجاح${ageInfo}${weightInfo}. هذه المؤشرات بالغة الأهمية لمعايرة الأحمال البيوميكانيكية على المفاصل بدقة وأمان.\n\nطمني الآن: كيف تصف ألمك في **${title}**؟ هل هو شد وتشنج، أم لسعة وخدر يمتد للأطراف، أم ألم موضعي في المفصل؟`,
                quickReplies: [],
                nextStep: 'chatting'
            };
        }

        // 0.1 التحقق من نفي أو تصحيح المراجع للطبيب (مثل: "ما حكيتلك عندي خدر"، "ما عندي كهربا")
        const isExplicitCorrection = /(?:ما\s*(?:عندي|حكيت|قلت|ذكرت|أعاني)|ما\s*حكيتلك|مش\s*(?:هيك|صحيح)|أنا\s*قلت|انا\s*حكيت)/i.test(userText);
        if (isExplicitCorrection) {
            return {
                message: `أعتذر منك${nameSuffix}، وشكراً جزيلاً على توضيحك وتصحيحي الدقيق، فهذا يوجهنا للمسار السريري الصحيح تماماً.\n\nطالما أن الألم موضعي وبدون خدر، أخبرني: هل تزداد حدة الألم عند حركة معينة في **${title}**، وهل تشعر بضعف في قوة القبضة أو الحركة؟`,
                quickReplies: [],
                nextStep: 'chatting'
            };
        }


        // 0.1 أعراض قد ترتبط أسبابها باختصاصنا السريري (دوخة، طنين، ألم صدر وضيق تنفس، تأهيل جلطات، صعوبة حركة)
        const isRelatedOutScope = /دوخة|دوار|طنين|أذن|صدر|قفص\s*صدري|جلطة|جلطه|شلل|تأهيل\s*حركي|صعوبة\s*مشي|توازن/i.test(userText);
        if (isRelatedOutScope && !/ديسك|فقرات|ظهر|رقبة|ركبة|كتف|ساق|رجل/i.test(userText)) {
            return {
                message: `سلامتك ألف سلامة${nameSuffix}. نود التوضيح بشفافية تامة: هذه الشكوى كتشخيص عام تقع خارج اختصاصنا المباشر وننصح دوماً بالفحص الطبي العام للاطمئنان؛ لكن من واقع خبرتنا السريرية في «وداعاً للألم»، قد نساعدك في التخلص منها أو تخفيفها كثيراً إذا كان المسبب الحقيقي لها ناتجاً عن تيبس فقرات الرقبة، أو شد عضلي مزمن، أو انضغاط عصبي، أو الحاجة لتأهيل حركي وتقويم يدوي.\n\nطمني، هل ترافق هذه الشكوى أي آلام أو شد في الرقبة أو أعلى الظهر أو الأطراف؟`,
                quickReplies: [],
                nextStep: 'chatting'
            };
        }

        // 0.2 استفسار عن أمراض خارج نطاق الاختصاص كلياً (سكري، ضغط، قلب، كلى، كبد، جلدية، أسنان، عيون)
        const isPureOutOfScope = /سكري|سكر|ضغط\s*الدم|قلب|شرايين|كلى|كبد|معدة|قولون|حساسية|جلدية|حبوب|أسنان|اسنان|عيون|نظر/i.test(userText);
        if (isPureOutOfScope && !/ألم|وجع|خدر|تنميل|عصب|ديسك|فقرات|شد/i.test(userText)) {
            return {
                message: `شفاك الله وعافاك${nameSuffix}؛ نود إعلامك بلبقة بأن هذه الحالة تقع خارج نطاق اختصاصنا السريري في «وداعاً للألم»؛ حيث ينصب تخصصنا على العمود الفقري والمفاصل، العضلات والأوتار، الخدر والتنميل، والتأهيل الحركي بتقنية الكايروبراكتيك.\n\nننصحك بمراجعة الطبيب المختص لإجراء الفحوصات اللازمة. وإذا كان لديك أي ألم في المفاصل أو الفقرات في **${title}**، يسعدنا جداً مساعدتك.`,
                quickReplies: [],
                nextStep: 'chatting'
            };
        }

        // 0.1 السؤال عما إذا كان الاسم أو البيانات الحيوية ضرورية ("هل الاسم ضروري؟", "ليش بدك الاسم؟", "ضروري الاسم؟")
        if (/(?:هل|ليش|لماذا|شو\s*دخل|ايش\s*دخل)?\s*(?:الاسم|اسم|عمري|وزني|طولي|المعلومات|البيانات)\s*(?:ضروري|لازم|مهم|اجباري|إجباري|شو\s*بفيد|ليش|لماذا)/i.test(userText)) {
            return {
                message: `نعم يا غالي، معرفة اسمك الكريم وعمرك ووزنك وطولك أمر أساسي وسريري بالغ الأهمية؛ لأنها تمكننا من فتح ملف طبي خاص بك، وحساب مؤشر الأحمال البيوميكانيكية على المفاصل بدقة وأمان، وتحديد سبب ألمك في **${title}**.\n\nتفضل بتزويدي باسمك الكريم وعمرك ووزنك وطولك لنبدأ استشارتك بشكل سليم.`,
                quickReplies: [],
                nextStep: 'chatting'
            };
        }

        // 1. السؤال عن العمر أو تاريخ الميلاد
        if (/كم\s*عمرك|عمرك|سنة|تاريخ\s*ميلادك|قديش\s*عمرك/i.test(userText)) {
            return {
                message: `أنا طبيبك ومساعدك السريري الذكي في «وداعاً للألم» للكايروبراكتيك؛ تم تدريبي على خبرات سريرية عميقة في تقويم العمود الفقري والمفاصل يدوياً.\n\nالأهم لصحتك هو أنت${nameSuffix}: كم عمرك ووزنك وطولك، وما هي طبيعة الشكوى التي تشعر بها في **${title}**؟`,
                quickReplies: [],
                nextStep: 'chatting'
            };
        }

        // 1.1 التعامل الراقي مع المغتربين والمرضى خارج الأردن
        if (/مغترب|خارج\s*الأردن|مش\s*بالأردن|مو\s*بالأردن|لست\s*في\s*الأردن|السعودية|الإمارات|الكويت|قطر|البحرين|مصر|العراق|فلسطين|ألمانيا|امريكا|أمريكا|كندا|بريطانيا|تركيا|أوروبا/i.test(userText)) {
            return {
                message: `أهلاً بك وبأهلنا وأحبتنا المغتربين في كل مكان${nameSuffix}! يسعدنا جداً خدمتك؛ الأداة السريرية وخطة التمارين التأهيلية تعمل معك بكفاءة تامة أينما كنت حول العالم.\n\nكما نوفر لمراجعينا المغتربين خدمة قراءة صور وتقارير الرنين المغناطيسي (MRI) مجاناً عبر الواتساب الدولي، واستشارات مرئية عن بُعد.\n\nطمني، هل الألم في **${title}** يعيق حركتك أو عملك، ومُنذ متى بدأ معك؟`,
                quickReplies: [],
                nextStep: 'chatting'
            };
        }

        // 2. السؤال عن التخصص أو الوظيفة أو طبيعة العمل
        if (/تخصصك|شو\s*بتشتغل|ايش\s*بتشتغل|شو\s*بتعمل|ايش\s*بتعمل|وظيفتك|طبيعة\s*عملك|شو\s*تخصصك/i.test(userText)) {
            return {
                message: `أنا الاستشاري السريري الذكي في «وداعاً للألم»؛ أعمل بتقنيات التشخيص الحركي السريري وإرشادك لأفضل الحلول في تقويم الكايروبراكتيك للعمود الفقري والمفاصل بدون جراحة أو أدوية، مع توفر خدمة الزيارات المنزلية لراحتك.\n\nأخبرني${nameSuffix}، هل مشكلتك في **${title}** تعيق حركتك أو عملك اليومي؟`,
                quickReplies: [],
                nextStep: 'chatting'
            };
        }

        // 3. استفسارات جانبية أو أسئلة تقنية وتصميمية (مثل: مواقع تصميم مجانية، ذكاء اصطناعي، برامج)
        if (/تصميم|موقع|مواقع|برنامج|كانفا|فوتوشوب|كمبيوتر|لابتوب|شاشة|شاشات/i.test(userText)) {
            return {
                message: `بكل سرور${nameSuffix}! مواقع مثل Canva و Figma ممتازة وتوفر خيارات مجانية رائعة.\n\nولكن كاستشارك الذكي: الجلوس الطويل أمام الشاشات يضاعف الضغط على **${title}**! طمني، كم ساعة تجلس يومياً؟ وهل يشتد ألمك أثناء الجلوس أم عند الوقوف؟`,
                quickReplies: [],
                nextStep: 'chatting'
            };
        }

        // 4. طلب الإذن بسؤال أو طلب مساعدة عامة
        if (/ممكن\s*سؤال|بدي\s*اسالك|بدي\s*أسألك|عندي\s*سؤال|استفسار|حاب\s*اسال|حاب\s*أسأل/i.test(userText)) {
            return {
                message: `بكل سرور وسعة صدر${nameSuffix}! أنا متواجد لأسمع منك وأجيبك بكل دقة. تفضل واطرح سؤالك، وما الذي تشعر به في **${title}**؟`,
                quickReplies: [],
                nextStep: 'chatting'
            };
        }

        if (/ممكن\s*تساعدني|ساعدني|محتاج\s*مساعدة|بدي\s*مساعدة|بتقدر\s*تساعدني|تقدر\s*تساعدني/i.test(userText)) {
            return {
                message: `أنا هنا بكل اهتمام لمساعدتك والوصول للراحة التامة بإذن الله${nameSuffix}. صف لي ما الذي يزعجك في **${title}** تحديداً، ومتى بدأ هذا الشعور؟`,
                quickReplies: [],
                nextStep: 'chatting'
            };
        }

        // 5. إذا كان المراجع يسأل هل أنت دكتور أو من أنت أو كيف عرفت
        if (/دكتور|طبيب|مين\s*انت|من\s*أنت|من\s*انت|مين\s*حضرتك|عرف\s*عنك|ايش\s*انت|شو\s*انت|روبوت|ذكاء|بوت/i.test(userText)) {
            return {
                message: `أهلاً بك${nameSuffix}. نعم، أنا الاستشاري الذكي في «وداعاً للألم». مهمتي الاستماع لشكواك وتشخيص طبيعة الألم في **${title}** وتقديم خطة تمارين موجهة ومساعدتك بالتنسيق مع المعالج جمال متخصص الكايروبراكتيك.\n\nأخبرني، كيف بدأ هذا الألم معك؟ وما هي الحركة التي تثيره أكثر شيء؟`,
                quickReplies: [],
                nextStep: 'chatting'
            };
        }

        // 6. التحيات والسلام
        if (/كيف\s*الحال|شلونك|كيفك|شخبارك|أخبارك|اخبارك|مرحبا|مرحباً|أهلا|أهلاً|السلام عليكم|صباح|مساء|هاي|هلا/i.test(userText)) {
            const nameAsk = !cleanName ? ' يشرفني معرفة اسمك الكريم وعمرك أولاً لنخاطبك به وتكون استشارتك خاصة بك؟' : '';
            return {
                message: `أهلاً وسهلاً بك${nameSuffix}، الحمد لله بكل خير وسلامتك أولويتنا دائماً!${nameAsk} طمني كيف تشعر في **${title}** اليوم؟`,
                quickReplies: [],
                nextStep: 'chatting'
            };
        }

        // 7. الشكر والامتنان
        if (/شكر|تسلم|مشكور|يسلمو|يعطيك\s*العافية|الله\s*يعافيك|جزاك\s*الله/i.test(userText)) {
            return {
                message: `العفو من كل قلبي${nameSuffix}، سلامتك وراحتك هي غايتنا دائماً! هل هناك أي حركة معينة تجعلك تشعر بالألم أكثر في **${title}**؟`,
                quickReplies: [],
                nextStep: 'chatting'
            };
        }

        // 8. الاستفسار عن الموقع أو التكلفة أو الحجز
        if (/وين|مكان|عنوان|موقع|سعر|تكلفة|جلسة|علاج|مركزكم|عيادتكم|حجز/i.test(userText)) {
            return {
                message: `نحن في «وداعاً للألم» متواجدون في الأردن (عمان والزرقاء) مع المعالج جمال المتخصص في الكايروبراكتيك وتقويم الفقرات بدون جراحة أو أدوية، مع توفر خدمة زيارات منزلية لمن يتعذر عليه الحضور. خطة التمارين المرفقة هنا مجانية 100% لمساعدتك فوراً.\n\nطمني، هل يمتد الألم في **${title}** للأطراف أم يتركز في موضع الألم فقط؟`,
                quickReplies: [],
                nextStep: 'chatting'
            };
        }

        // 9. المشي الجانبي / الميلان / مشكلة الردف / الانحناء الوقائي (Antalgic Tilt / Scoliosis)
        if (/ردف|مايل|مفتول|مشلول|جانبي|عوجاج|اعوجاج|بمشي|المشي|مشيتي|عرجة|بعرج/i.test(userText)) {
            return {
                message: `سلامتك ألف سلامة${nameSuffix}. هذا المشي المفتول أو المائل يسمى طبياً «الانحناء الوقائي Antalgic Tilt»، وهو رد فعل دفاعي لا إرادي من عضلات الجذع لتفريغ الضغط عن المفصل أو العصب المتأثر في **${title}** وتجنب الألم الحاد.\n\nطمني، هل يمتد الألم من الردف إلى الفخذ، أم يتركز في الردف وأسفل الظهر فقط؟ وهل تجد صعوبة أكبر عند الجلوس أم عند الوقوف والمشي؟`,
                quickReplies: [],
                nextStep: 'chatting'
            };
        }

        // 10. الأعراض العصبية المحددة (إذا ذكرها المراجع صراحة ودون نفي)
        if (!isNegating && /خدر|تنميل|حرارة|حرقان|لسعة|كهربا|كهرباء/i.test(userText)) {
            return {
                message: `سلامتك${nameSuffix}. هذا النوع من الأعراض يشير إلى وجود تهيج ميكانيكي في المسار العصبي المرتبط بـ **${title}**.\n\nهل يشتد هذا الشعور عند الجلوس المطول أو السعال، وهل يخف عند المشي وتغيير الوضعية؟`,
                quickReplies: [],
                nextStep: 'chatting'
            };
        }

        // 11. أعراض عضلية وميكانيكية: شد، تشنج، ثقل، تيبس
        if (/شد|تشنج|عضل|ثقل|تيبس|واقف|انحناء|حمل|جلوس|مكتب|سيارة/i.test(userText)) {
            return {
                message: `يبدو أن هناك إجهاداً بيوميكانيكياً وتشنجاً تعويضياً في العضلات المحيطة بـ **${title}** لحماية المفصل المتأثر.\n\nهل تشعر بتحسن عند الاستلقاء وتطبيق كمادات دافئة، أم يبقى التيبس موجوداً حتى أثناء الراحة؟`,
                quickReplies: [],
                nextStep: 'chatting'
            };
        }

        // 12. معالجة الردود المتقدمة والسريعة (نعم / لا / تفاصيل إضافية) وضمان عدم تكرار أي سؤال سابق إطلاقاً
        const norm = (s) => (s || '')
            .replace(/[أإآ]/g, 'ا')
            .replace(/ة/g, 'ه')
            .replace(/[ى]/g, 'ي')
            .replace(/[\u064B-\u0652]/g, '')
            .trim();

        const userTextNorm = norm(userText);
        const userMessagesNorm = norm((history || []).filter(h => h.sender === 'user').map(m => m.text).join(' '));

        const isAffirmative = /^(?:نعم|ايوه|اي|اه|صحيح|بالضبط|اكيد|مضبوط|تمام|طبعا|فعلا|صح|بصير|بحس)$/i.test(userTextNorm);
        const isSimpleNegative = /^(?:لا|كلا|ما في|ما عندي|ابدا|مش موجود|مو موجود|ما بحس)$/i.test(userTextNorm);

        // إذا كان المراجع يجيب بنعم
        if (isAffirmative) {
            if (userTurnCount <= 2) {
                return {
                    message: `فهمتك تماماً${nameSuffix}. طالما أن الحركة تزيد الألم، فهل يمتد هذا الشعور في **${title}** على شكل خدر أو تنميل أو لسعة كهربائية نحو الأصابع أو الأطراف؟`,
                    quickReplies: [],
                    nextStep: 'chatting'
                };
            } else if (userTurnCount <= 4) {
                return {
                    message: `واضح ومهم جداً${nameSuffix}. هذا التأثر يؤكد وجود إجهاد ميكانيكي وضغط على مسار الحركة. كم المدة التقريبية التي تعاني منها من هذه المشكلة، وهل يوقظك الألم من النوم؟`,
                    quickReplies: [],
                    nextStep: 'chatting'
                };
            } else {
                return {
                    message: `اكتمل الآن تقييمك السريري الشامل لحالتك وتحددت ميكانيكية الخلل في **${title}** بدقة${nameSuffix || ' يا غالي'}!\n\nأدخل رقم هاتفك لفتح التقرير السريري الخاص بك ولربط ملفك بالخطة العلاجية والتأهيلية بإشراف المعالج جمال:`,
                    quickReplies: [],
                    nextStep: 'ask_phone',
                    isPhonePrompt: true,
                    isReady: false
                };
            }
        }

        // إذا كان المراجع يجيب بلا
        if (isSimpleNegative) {
            if (userTurnCount <= 2) {
                return {
                    message: `ممتاز، استبعاد الخدر والتنميل مؤشر سريري طيب يؤكد أن المشكلة تتركز في مفاصل وأوتار **${title}**. أخبرني، ما هي الحركات أو الوضعيات التي تجد فيها صعوبة أكبر؟`,
                    quickReplies: [],
                    nextStep: 'chatting'
                };
            } else if (userTurnCount <= 4) {
                return {
                    message: `سلامتك ألف سلامة${nameSuffix}. منذ متى بدأت هذه المشكلة معك تحديداً، وهل تؤثر على أدائك اليومي أو عملك؟`,
                    quickReplies: [],
                    nextStep: 'chatting'
                };
            } else {
                return {
                    message: `اكتمل الآن تقييمك السريري الشامل لحالتك وتحددت ميكانيكية الخلل في **${title}** بدقة${nameSuffix || ' يا غالي'}!\n\nأدخل رقم هاتفك لفتح التقرير السريري الخاص بك ولربط ملفك بالخطة العلاجية والتأهيلية بإشراف المعالج جمال:`,
                    quickReplies: [],
                    nextStep: 'ask_phone',
                    isPhonePrompt: true,
                    isReady: false
                };
            }
        }

        // استجواب متسلسل للأمام دائماً يمنع الرجوع لنقطة الصفر إطلاقاً
        if (userTurnCount <= 2) {
            return {
                message: `فهمت وصفك بدقة${nameSuffix}. كطبيبك السريري، هل تشعر بأن هذا الألم في **${title}** يمتد كخدر أو لسعة نحو الأصابع أو الأطراف، أم هو محصور موضعياً في المفصل؟`,
                quickReplies: [],
                nextStep: 'chatting'
            };
        } else if (userTurnCount <= 4) {
            return {
                message: `سلامتك وراحتك هي غايتنا${nameSuffix}. منذ متى بدأت تشعر بهذه الشكوى في **${title}**؟ وهل يوقظك الألم من النوم أثناء الليل أو يمنعك من الحركة الطبيعية؟`,
                quickReplies: [],
                nextStep: 'chatting'
            };
        } else {
            return {
                message: `اكتمل الآن تقييمك السريري الشامل لحالتك وتحددت ميكانيكية الخلل في **${title}** بدقة${nameSuffix || ' يا غالي'}!\n\nأدخل رقم هاتفك لفتح التقرير السريري الخاص بك ولربط ملفك بالخطة العلاجية والتأهيلية بإشراف المعالج جمال:`,
                quickReplies: [],
                nextStep: 'ask_phone',
                isPhonePrompt: true,
                isReady: false
            };
        }
    },


    // =========================================================================
    // محرك الصوت البشري الحقيقي 100% وتحليل التسجيلات الصوتية (Neural Voice AI Engine)
    // =========================================================================
    currentAudio: null,
    isSpeaking: false,
    _speechSessionToken: 0,
    _audioCache: {},
    _currentSessionStudioVoice: null,

    // شخصيات الأطباء المعتمدة لكل نبرة صوت استوديو (الاسم الأول فقط مع صفة الاستشاري الذكي)
    DOCTOR_PERSONAS: {
        'Aoede': { name: 'د. سارة', title: 'استشارية «وداعاً للألم» الذكية', gender: 'female' },
        'Kore': { name: 'د. مريم', title: 'استشارية «وداعاً للألم» الذكية', gender: 'female' },
        'Puck': { name: 'د. عمر', title: 'استشاري «وداعاً للألم» الذكي', gender: 'male' },
        'Fenrir': { name: 'د. خالد', title: 'استشاري «وداعاً للألم» الذكي', gender: 'male' },
        'Charon': { name: 'د. جمال', title: 'استشاري «وداعاً للألم» الذكي', gender: 'male' }
    },

    // اختيار شخصية الطبيب يدوياً وبشكل فوري للجلسة
    selectDoctorPersona(voiceKey) {
        if (!this.DOCTOR_PERSONAS[voiceKey]) return this.getSessionDoctorPersona();
        this._currentSessionStudioVoice = voiceKey;
        try {
            localStorage.setItem('wada3an_gemini_voice_name', voiceKey);
            localStorage.setItem('wada3an_voice_rotation_mode', 'fixed');
            sessionStorage.setItem('wada3an_session_doctor_voice', voiceKey);
        } catch (e) {}
        return this.DOCTOR_PERSONAS[voiceKey];
    },

    // الحصول على شخصية الطبيب الحالية للجلسة (الافتراضي هو د. سارة العبادي)
    getSessionDoctorPersona() {
        const voice = this.getStudioVoiceForSession();
        return this.DOCTOR_PERSONAS[voice] || this.DOCTOR_PERSONAS['Aoede'];
    },

    // الحصول على صوت الاستوديو البشري وتثبيت الطبيب طوال زيارة المراجع (Session Persistence)
    getStudioVoiceForSession() {
        if (this._currentSessionStudioVoice && this.DOCTOR_PERSONAS[this._currentSessionStudioVoice]) {
            return this._currentSessionStudioVoice;
        }
        try {
            const savedVoice = localStorage.getItem('wada3an_gemini_voice_name') || sessionStorage.getItem('wada3an_session_doctor_voice');
            if (savedVoice && this.DOCTOR_PERSONAS[savedVoice]) {
                this._currentSessionStudioVoice = savedVoice;
                return savedVoice;
            }
        } catch (e) {}
        // الافتراضي الدائم والمفضل هو د. سارة (Aoede)
        this._currentSessionStudioVoice = 'Aoede';
        try {
            sessionStorage.setItem('wada3an_session_doctor_voice', 'Aoede');
        } catch (e) {}
        return this._currentSessionStudioVoice;
    },

    // إظهار بطاقة التحكم الصوتي العائمة للمراجع مع اسم الطبيب وزر الإيقاف الفوري
    showLiveAudioPill() {
        try {
            if (typeof document === 'undefined') return;
            const persona = this.getSessionDoctorPersona();
            let pill = document.getElementById('ai-live-audio-pill');
            if (!pill) {
                pill = document.createElement('div');
                pill.id = 'ai-live-audio-pill';
                pill.className = 'ai-live-audio-pill';
                pill.style.cssText = 'position: fixed; bottom: 85px; left: 50%; transform: translateX(-50%); z-index: 99999; background: linear-gradient(135deg, rgba(15, 23, 42, 0.96) 0%, rgba(30, 41, 59, 0.98) 100%); border: 1.5px solid #38bdf8; border-radius: 30px; padding: 8px 18px; display: flex; align-items: center; gap: 12px; box-shadow: 0 8px 30px rgba(0, 0, 0, 0.6), 0 0 15px rgba(56, 189, 248, 0.35); backdrop-filter: blur(10px); direction: rtl;';
                pill.innerHTML = `
                    <div style="display: flex; align-items: center; gap: 3px; height: 18px;">
                        <span style="width: 3px; background: #38bdf8; border-radius: 3px; animation: liveSoundWave 0.8s ease-in-out infinite alternate;"></span>
                        <span style="width: 3px; background: #38bdf8; border-radius: 3px; animation: liveSoundWave 0.9s ease-in-out infinite alternate 0.2s;"></span>
                        <span style="width: 3px; background: #38bdf8; border-radius: 3px; animation: liveSoundWave 0.7s ease-in-out infinite alternate 0.4s;"></span>
                        <span style="width: 3px; background: #38bdf8; border-radius: 3px; animation: liveSoundWave 1s ease-in-out infinite alternate 0.1s;"></span>
                    </div>
                    <span id="ai-live-pill-text" style="color: #f1f5f9; font-size: 0.88em; font-weight: bold; white-space: nowrap;">🔊 ${persona.name} يتحدث الآن...</span>
                    <button type="button" onclick="Wada3anAiEngine.stopSpeaking();" style="background: rgba(239, 68, 68, 0.2); border: 1px solid #ef4444; color: #fca5a5; border-radius: 20px; padding: 4px 12px; font-size: 0.8em; font-weight: bold; cursor: pointer; display: flex; align-items: center; gap: 5px; transition: all 0.2s ease;">
                        ⏹️ إيقاف الصوت
                    </button>
                `;
                document.body.appendChild(pill);
            } else {
                const textEl = document.getElementById('ai-live-pill-text');
                if (textEl) textEl.textContent = `🔊 ${persona.name} يتحدث الآن...`;
                pill.style.display = 'flex';
            }
        } catch (e) {
            console.warn('Live audio pill display notice:', e);
        }
    },

    // إخفاء بطاقة التحكم الصوتي العائمة
    hideLiveAudioPill() {
        try {
            if (typeof document === 'undefined') return;
            const pill = document.getElementById('ai-live-audio-pill');
            if (pill) {
                pill.style.display = 'none';
            }
        } catch (e) {}
    },

    // تحويل دفق الصوت الخام (PCM 24kHz) القادم من الذكاء الاصطناعي إلى ملف WAV حقيقي
    pcmToWavBlob(base64Pcm, sampleRate = 24000) {
        try {
            const binary = atob(base64Pcm);
            const len = binary.length;
            const pcmBytes = new Uint8Array(len);
            for (let i = 0; i < len; i++) {
                pcmBytes[i] = binary.charCodeAt(i);
            }

            const wavHeader = new ArrayBuffer(44);
            const view = new DataView(wavHeader);

            // RIFF chunk descriptor
            view.setUint32(0, 0x52494646, false); // "RIFF"
            view.setUint32(4, 36 + len, true);    // ChunkSize
            view.setUint32(8, 0x57415645, false); // "WAVE"

            // "fmt " sub-chunk
            view.setUint32(12, 0x666d7420, false); // "fmt "
            view.setUint32(16, 16, true);          // Subchunk1Size (16 for PCM)
            view.setUint16(20, 1, true);           // AudioFormat (1 for PCM)
            view.setUint16(22, 1, true);           // NumChannels (1 mono)
            view.setUint32(24, sampleRate, true);  // SampleRate
            view.setUint32(28, sampleRate * 2, true); // ByteRate
            view.setUint16(32, 2, true);           // BlockAlign
            view.setUint16(34, 16, true);          // BitsPerSample (16 bits)

            // "data" sub-chunk
            view.setUint32(36, 0x64617461, false); // "data"
            view.setUint32(40, len, true);         // Subchunk2Size

            return new Blob([wavHeader, pcmBytes], { type: 'audio/wav' });
        } catch (e) {
            console.warn('PCM to WAV conversion error:', e);
            return null;
        }
    },

    // توليد صوت بشري طبيعي 100% لنص رد الطبيب
    async generateHumanVoiceAudio(text) {
        if (!text) return null;

        // تجهيز النص الصوتي بنظام "التشكيل المخفي الفائق" وحذف الإنجليزي واللاتيني والرموز
        let cleanText = this.sanitizeSpeechArabicText(text);

        // طبقة التشكيل الصوتي المخفي الفونيمي للكلمات الطبية الملتبسة (خاص بالقراءة فقط ولا يراه المراجع)
        cleanText = cleanText
            .replace(/\bالظهر\b/g, 'الظَّهْر')
            .replace(/\bظهرك\b/g, 'ظَهْرِك')
            .replace(/\bبالظهر\b/g, 'بالظَّهْر')
            .replace(/\bاسفل الظهر\b/g, 'أَسْفَل الظَّهْر')
            .replace(/\bأسفل الظهر\b/g, 'أَسْفَل الظَّهْر')
            .replace(/عرق\s+النسا/g, 'عِرْق النَّسَا')
            .replace(/الكايروبراكتيك/g, 'الكايْروبْراكْتِك')
            .replace(/كايروبراكتيك/g, 'كايْروبْراكْتِك')
            .replace(/العضلة الكمثرية/g, 'العَضَلَة الكُمَّثْرِيَّة')
            .replace(/الكمثرية/g, 'الكُمَّثْرِيَّة')
            .replace(/الأبهر/g, 'الأَبْهَر')
            .replace(/المؤخرة/g, 'مَنْطِقَة الإِلْيَة')
            .replace(/تشنج/g, 'تَشَنُّج')
            .replace(/التشنج/g, 'التَّشَنُّج')
            .replace(/غضروف/g, 'غُضْرُوف')
            .replace(/الغضروف/g, 'الغُضْرُوف')
            .replace(/غضاريف/g, 'غَضَارِيف')
            .replace(/فقرات/g, 'فَقَرَات')
            .replace(/الفقرات/g, 'الفَقَرَات')
            .replace(/مفصل/g, 'مَفْصِل')
            .replace(/المفاصل/g, 'المَفَاصِل')
            .replace(/لوحي\s+الكتف/g, 'لَوْحَيِ الكَتِف')
            .replace(/بيوميكانيكي/g, 'بَيُومِيكَانِيكِي')
            .replace(/البيوميكانيكي/g, 'البَيُومِيكَانِيكِي')
            .replace(/العمود\s+الفقري/g, 'العَمُود الفَقَرِي');

        // تسكين نهايات الجمل قبل علامات الترقيم (السكون العربي الطبيعي)
        cleanText = cleanText.replace(/[\u064B-\u0652]+(?=[\s]*[.!?؛؟\n]|$)/g, '');

        if (!cleanText || cleanText.length < 3) return null;

        const voiceName = this.getStudioVoiceForSession();
        const cacheKey = `${voiceName}_${cleanText}`;
        if (this._audioCache && this._audioCache[cacheKey]) {
            return this._audioCache[cacheKey];
        }

        try {
            const audioUrl = await this.generateGeminiNeuralAudioDirect(cleanText, voiceName);
            if (audioUrl) {
                if (!this._audioCache) this._audioCache = {};
                this._audioCache[cacheKey] = audioUrl;
                return audioUrl;
            }
        } catch (err) {
            console.warn('Gemini neural audio generation notice:', err);
        }

        return null;
    },

    // دالة التوليد الصوتي البشري المباشر فائق الجودة من Google Gemini مع تدوير المفاتيح الـ 11
    async generateGeminiNeuralAudioDirect(text, voiceName = 'Aoede', returnDetails = false) {
        if (!text) return returnDetails ? { audioUrl: null, error: 'النص فارغ' } : null;

        // تجهيز النص بنظام التشكيل الفونيمي المخفي للفظ السليم
        let cleanText = this.sanitizeSpeechArabicText(text);
        cleanText = cleanText
            .replace(/\bالظهر\b/g, 'الظَّهْر')
            .replace(/\bظهرك\b/g, 'ظَهْرِك')
            .replace(/\bبالظهر\b/g, 'بالظَّهْر')
            .replace(/\bاسفل الظهر\b/g, 'أَسْفَل الظَّهْر')
            .replace(/\bأسفل الظهر\b/g, 'أَسْفَل الظَّهْر')
            .replace(/عرق\s+النسا/g, 'عِرْق النَّسَا')
            .replace(/الكايروبراكتيك/g, 'الكايْروبْراكْتِك')
            .replace(/العضلة الكمثرية/g, 'العَضَلَة الكُمَّثْرِيَّة')
            .replace(/الكمثرية/g, 'الكُمَّثْرِيَّة')
            .replace(/الأبهر/g, 'الأَبْهَر')
            .replace(/المؤخرة/g, 'مَنْطِقَة الإِلْيَة')
            .replace(/تشنج/g, 'تَشَنُّج')
            .replace(/غضروف/g, 'غُضْرُوف')
            .replace(/الغضروف/g, 'الغُضْرُوف')
            .replace(/فقرات/g, 'فَقَرَات')
            .replace(/الفقرات/g, 'الفَقَرَات')
            .replace(/مفصل/g, 'مَفْصِل')
            .replace(/المفاصل/g, 'المَفَاصِل');

        cleanText = cleanText.replace(/[\u064B-\u0652]+(?=[\s]*[.!?؛؟\n]|$)/g, '');

        const cacheKey = `${voiceName || 'Aoede'}_${cleanText}`;
        if (this._audioCache && this._audioCache[cacheKey]) {
            return returnDetails ? { audioUrl: this._audioCache[cacheKey], error: null } : this._audioCache[cacheKey];
        }

        // النموذج الرئيسي المؤكد العمل - نجرب المفاتيح بالترتيب من المؤشر الحالي
        // النموذج الثاني كاحتياطي فقط عند فشل الأول بخطأ غير 429
        const primaryModel   = 'gemini-2.5-flash-preview-tts';
        const secondaryModel = 'gemini-2.5-pro-preview-tts'; // احتياطي

        const pool = WADA3AN_AI_CONFIG.getPoolKeys();
        let lastErrorMsg = '';
        const now = Date.now();

        // إنشاء قائمة المفاتيح المتاحة (غير المستنفدة) بدءاً من المؤشر الحالي
        const startIdx = WADA3AN_AI_CONFIG._currentPoolIndex;
        const availableKeys = [];
        for (let i = 0; i < pool.length; i++) {
            const idx = (startIdx + i) % pool.length;
            const key = pool[idx];
            if (!key) continue;
            const cd = WADA3AN_AI_CONFIG._exhaustedKeys.get(key);
            if (!cd || now > cd) {
                availableKeys.push({ key, idx });
            }
        }

        console.log(`[TTS] المفاتيح المتاحة: ${availableKeys.length} من ${pool.length} - الطلب: ${cleanText.substring(0, 30)}...`);

        // دالة مساعدة لإرسال طلب TTS لمفتاح ونموذج محددين
        const tryTtsRequest = async (apiKey, modelName) => {
            const url = `https://generativelanguage.googleapis.com/v1beta/models/${modelName}:generateContent?key=${apiKey}`;
            const payload = {
                contents: [{ parts: [{ text: cleanText }] }],
                generationConfig: {
                    responseModalities: ['AUDIO'],
                    speechConfig: {
                        voiceConfig: {
                            prebuiltVoiceConfig: { voiceName: voiceName || 'Aoede' }
                        }
                    }
                }
            };
            const controller = new AbortController();
            const timeoutId = setTimeout(() => controller.abort(), 4000);
            try {
                const res = await fetch(url, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(payload),
                    signal: controller.signal
                });
                clearTimeout(timeoutId);
                return res;
            } catch (e) {
                clearTimeout(timeoutId);
                throw e;
            }
        };

        // المرور على المفاتيح المتاحة بالترتيب
        for (const { key: activeKey, idx } of availableKeys) {
            console.log(`[TTS] جاري تجربة المفتاح [${idx}]...`);
            try {
                // جرب النموذج الأساسي أولاً
                const res = await tryTtsRequest(activeKey, primaryModel);

                if (res.ok) {
                    const data = await res.json();
                    const part = data?.candidates?.[0]?.content?.parts?.[0];
                    if (part?.inlineData?.data) {
                        const wavBlob = this.pcmToWavBlob(part.inlineData.data, 24000);
                        if (wavBlob) {
                            const blobUrl = URL.createObjectURL(wavBlob);
                            if (!this._audioCache) this._audioCache = {};
                            this._audioCache[cacheKey] = blobUrl;
                            // تحديث المؤشر للبدء من هذا المفتاح الناجح في المرة القادمة
                            WADA3AN_AI_CONFIG._currentPoolIndex = idx;
                            console.log(`[TTS] ✅ نجح المفتاح [${idx}] مع ${primaryModel}`);
                            return returnDetails ? { audioUrl: blobUrl, error: null } : blobUrl;
                        }
                    }
                    // استجابة ناجحة لكن بدون بيانات صوتية - جرب النموذج الاحتياطي
                    lastErrorMsg = 'لا توجد بيانات صوتية في الاستجابة';
                } else if (res.status === 429) {
                    // مفتاح مستنفد - سجّله وانتقل للتالي
                    WADA3AN_AI_CONFIG.rotateKey(activeKey);
                    lastErrorMsg = `429 - مفتاح [${idx}] مستنفد`;
                    console.warn(`[TTS] 429 على المفتاح [${idx}] - انتقال للتالي`);
                    continue; // الانتقال للمفتاح التالي
                } else if (res.status === 404) {
                    // النموذج غير موجود - جرب الاحتياطي
                    lastErrorMsg = `404 - ${primaryModel} غير متاح`;
                    try {
                        const res2 = await tryTtsRequest(activeKey, secondaryModel);
                        if (res2.ok) {
                            const data2 = await res2.json();
                            const part2 = data2?.candidates?.[0]?.content?.parts?.[0];
                            if (part2?.inlineData?.data) {
                                const wavBlob2 = this.pcmToWavBlob(part2.inlineData.data, 24000);
                                if (wavBlob2) {
                                    const blobUrl2 = URL.createObjectURL(wavBlob2);
                                    if (!this._audioCache) this._audioCache = {};
                                    this._audioCache[cacheKey] = blobUrl2;
                                    WADA3AN_AI_CONFIG._currentPoolIndex = idx;
                                    console.log(`[TTS] ✅ نجح المفتاح [${idx}] مع ${secondaryModel}`);
                                    return returnDetails ? { audioUrl: blobUrl2, error: null } : blobUrl2;
                                }
                            }
                        } else if (res2.status === 429) {
                            WADA3AN_AI_CONFIG.rotateKey(activeKey);
                            continue;
                        }
                    } catch (e2) {
                        lastErrorMsg = e2.message;
                    }
                } else {
                    const errObj = await res.json().catch(() => ({}));
                    lastErrorMsg = errObj?.error?.message || `كود ${res.status}`;
                    console.warn(`[TTS] خطأ ${res.status} على المفتاح [${idx}]:`, lastErrorMsg);
                }
            } catch (e) {
                lastErrorMsg = e.name === 'AbortError' ? 'timeout 4s' : e.message;
                console.warn(`[TTS] استثناء على المفتاح [${idx}]:`, lastErrorMsg);
            }
        }

        console.warn(`[TTS] ❌ فشلت كل المفاتيح المتاحة. السبب: ${lastErrorMsg}`);
        return returnDetails ? { audioUrl: null, error: lastErrorMsg || 'تعذر توليد الصوت البشري' } : null;
    },


    _globalAudio: null,
    _audioUnlocked: false,

    // تنشيط نظام الصوت فور تفاعل المستخدم (لتخطي قيود autoplay على الهواتف والمتصفحات)
    unlockAudio() {
        try {
            if (typeof window === 'undefined') return;

            // 1. إنشاء وتهيئة عنصر Audio دائم ومثبت لتخطي حظر متصفحات الهواتف
            if (!this._globalAudio) {
                this._globalAudio = new Audio();
                this._globalAudio.preload = 'auto';
                this._globalAudio.setAttribute('playsinline', '');
                this._globalAudio.setAttribute('webkit-playsinline', '');
            }

            // 2. فك حظر التشغيل بنغمة صامتة قصيرة جداً (Base64 WAV) أثناء حدث اللمس المباشر
            if (!this._audioUnlocked) {
                try {
                    const dummy = new Audio('data:audio/wav;base64,UklGRigAAABXQVZFZm10IBIAAAABAAEARKwAAIhYAQACABAAAABkYXRhAgAAAAEA');
                    const p = dummy.play();
                    if (p && typeof p.then === 'function') {
                        p.then(() => {
                            this._audioUnlocked = true;
                        }).catch(() => {});
                    }
                } catch (e) {}
            }

            // 3. تنشيط Web Audio API Context
            const AudioCtx = window.AudioContext || window.webkitAudioContext;
            if (AudioCtx) {
                if (!this._audioCtx) {
                    this._audioCtx = new AudioCtx();
                }
                if (this._audioCtx.state === 'suspended') {
                    this._audioCtx.resume().catch(() => {});
                }
            }
        } catch (e) {
            console.warn('AudioContext unlock notice:', e);
        }
    },

    // تحضير وتنشيط مسار الصوت فور ضغط المستخدم زر الإرسال أو اللمس
    primeMobileAudio() {
        this.unlockAudio();
    },

    // تشغيل ملف الصوت البشري الطبيعي مع ضمان عمله التام على هواتف الآيفون والأندرويد
    playHumanAudio(audioUrl, onEndCallback) {
        this.stopSpeaking();
        if (!audioUrl) {
            if (onEndCallback) onEndCallback();
            return;
        }

        try {
            this.unlockAudio();

            const audio = new Audio();
            audio.preload = 'auto';
            audio.setAttribute('playsinline', '');
            audio.setAttribute('webkit-playsinline', '');
            audio.src = audioUrl;
            this.currentAudio = audio;
            this._globalAudio = audio;
            this.isSpeaking = true;
            this.showLiveAudioPill();

            audio.onended = () => {
                this.isSpeaking = false;
                this.hideLiveAudioPill();
                if (this.currentAudio === audio) this.currentAudio = null;
                if (onEndCallback) onEndCallback();
            };
            audio.onerror = (err) => {
                console.warn('Audio play error event:', err);
                this.isSpeaking = false;
                this.hideLiveAudioPill();
                if (this.currentAudio === audio) this.currentAudio = null;
                if (onEndCallback) onEndCallback();
            };

            const playPromise = audio.play();
            if (playPromise && typeof playPromise.then === 'function') {
                playPromise.then(() => {
                    this._audioUnlocked = true;
                }).catch(e => {
                    console.warn('Human audio play blocked or interrupted:', e);
                    this.isSpeaking = false;
                    this.hideLiveAudioPill();
                    if (this.currentAudio === audio) this.currentAudio = null;
                    if (onEndCallback) onEndCallback();
                });
            }
        } catch (e) {
            console.warn('Audio play error:', e);
            this.isSpeaking = false;
            this.hideLiveAudioPill();
            if (onEndCallback) onEndCallback();
        }
    },

    // معالجة تسجيل صوتي حقيقي مرسل من المراجع بواسطة ميكروفون الهاتف (Voice Note Intake)
    async advanceClinicalDialogueWithAudio(options) {
        const { audioBlob, mimeType, painPointTitle, currentStep, history, patientName } = options;
        if (!audioBlob) return null;

        const base64Data = await new Promise((resolve) => {
            const reader = new FileReader();
            reader.onloadend = () => {
                const res = reader.result || '';
                resolve(res.includes(',') ? res.split(',')[1] : res);
            };
            reader.readAsDataURL(audioBlob);
        });

        const key = WADA3AN_AI_CONFIG.getApiKey();
        const activeModel = localStorage.getItem('wada3an_active_ai_model') || 'gemini-2.0-flash';
        const url = `https://generativelanguage.googleapis.com/v1beta/models/${activeModel}:generateContent?key=${key}`;

        const promptText = `
أنت الاستشاري الذكي في «وداعاً للألم».
المراجع أرسل للتو تسجيلاً صوتياً لشكواه في منطقة (${painPointTitle}).
الخطوة السريرية الحالية: [${currentStep}].
اسم المراجع المعروف: [${patientName || 'غير محدد بعد'}].

سجل المحادثة السابق:
${(history || []).map(h => `${h.sender === 'bot' ? 'الطبيب' : 'المراجع'}: ${h.text}`).join('\n')}

المطلوب منك بدقة:
1. استمع للتسجيل الصوتي بدقة، وافهم لهجته العربية وما قاله المراجع بصوته.
2. استخرج المعلومات المذكورة في التسجيل (الاسم، العمر، الوزن، الطول، طبيعة الألم، رقم الهاتف).
3. اكتب رداً سريرياً دافئاً كطبيب حقيقي:
   - إذا لم يذكر الاسم أو العمر أو الوزن أو الطول بعد: اطلبها منه بلطف وبيّن أهميتها لحساب الإجهاد البيوميكانيكي ودقة التشخيص.
   - إذا وصف الألم، استجوب الحركات والوضعيات المؤلمة ومدى تأثيرها على نومه وحركته.
   - إذا اكتملت الصورة السريرية، اطلب منه تزويدك برقم هاتفه لربط ملفه وفتح تقرير الحالة وخطة التمارين المخصصة له بإشراف المعالج جمال.
4. يجب أن يكون الرد السريري في حدود 35 إلى 60 كلمة فقط بلهجة طبية فصيحة ومريحة.
5. ممنوع منعاً باتاً استخدام الكلمات: "عيادة"، "مركز"، "فريقنا"، "كوادرنا"! المعالج الوحيد هو المعالج جمال، والجهة هي: في «وداعاً للألم».
6. لا تقترح أي خيارات أو أزرار جاهزة للمراجع.
7. ضع في أسطر مستقلة في نهاية ردك بدقة:
[TRANSCRIPTION: ملخص ما قاله المراجع بصوته]
[EXTRACTED_NAME: الاسم إن ذكره المراجع]
[EXTRACTED_PHONE: رقم الهاتف إن ذكره المراجع]
`;

        const payload = {
            contents: [{
                role: "user",
                parts: [
                    {
                        inlineData: {
                            mimeType: (mimeType || 'audio/webm').split(';')[0],
                            data: base64Data
                        }
                    },
                    {
                        text: promptText
                    }
                ]
            }],
            generationConfig: { temperature: 0.7, maxOutputTokens: 600 }
        };

        const totalPoolKeys = WADA3AN_AI_CONFIG.getPoolKeys().length || 1;
        const maxKeyRotations = Math.min(3, totalPoolKeys);
        const candidateAudioModels = ['gemini-2.5-flash', 'gemini-2.0-flash', 'gemini-3.5-flash'];

        for (let keyAttempt = 0; keyAttempt < maxKeyRotations; keyAttempt++) {
            const key = WADA3AN_AI_CONFIG.getApiKey();
            if (!key) break;

            for (const model of candidateAudioModels) {
                try {
                    const url = `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${key}`;
                    const controller = new AbortController();
                    const timeoutId = setTimeout(() => controller.abort(), 7500);

                    const res = await fetch(url, {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify(payload),
                        signal: controller.signal
                    });
                    clearTimeout(timeoutId);

                    if (res.ok) {
                        const data = await res.json();
                        const rawReply = data?.candidates?.[0]?.content?.parts?.[0]?.text || '';
                        
                        let message = rawReply;
                        let transcription = '';
                        let extractedName = '';
                        let extractedPhone = '';

                        const trMatch = rawReply.match(/\[TRANSCRIPTION:\s*(.*?)\]/);
                        if (trMatch) transcription = trMatch[1].trim();

                        const nameMatch = rawReply.match(/\[EXTRACTED_NAME:\s*(.*?)\]/);
                        if (nameMatch && nameMatch[1].trim() && nameMatch[1].trim() !== 'غير محدد') {
                            const candName = nameMatch[1].trim().replace(/^يا\s+/i, '').split(/\s+/)[0];
                            const invalidNameWords = ['كيف', 'كيفك', 'مرحبا', 'أهلا', 'اهلا', 'سلام', 'تعبان', 'مريض', 'دكتور', 'طبيب', 'المريض', 'شو', 'ايش', 'عندي', 'وجع', 'الم', 'ظهر', 'ديسك', 'غير'];
                            if (!invalidNameWords.includes(candName.toLowerCase())) {
                                extractedName = candName;
                            }
                        }

                        const phoneMatch = rawReply.match(/\[EXTRACTED_PHONE:\s*(.*?)\]/);
                        if (phoneMatch && phoneMatch[1].trim() && phoneMatch[1].trim() !== 'غير محدد') {
                            extractedPhone = phoneMatch[1].trim();
                        }

                        message = rawReply
                            .replace(/\[TRANSCRIPTION:.*?\]/g, '')
                            .replace(/\[QUICK_REPLIES:.*?\]/g, '')
                            .replace(/\[EXTRACTED_NAME:.*?\]/g, '')
                            .replace(/\[EXTRACTED_PHONE:.*?\]/g, '')
                            .trim();

                        // التدرج السريري المنضبط: استجواب سريري عميق متعدد الخطوات قبل طلب الهاتف
                        let nextStep = 'question_1';
                        if (currentStep === 'vitals') {
                            nextStep = 'question_1';
                        } else if (currentStep === 'question_1') {
                            nextStep = 'question_2';
                        } else if (currentStep === 'question_2') {
                            nextStep = 'question_3';
                        } else if (currentStep === 'question_3') {
                            nextStep = 'ask_phone';
                        } else if (currentStep === 'ask_phone' || currentStep === 'completed') {
                            nextStep = (extractedPhone && typeof isValidPhoneNumber === 'function' && isValidPhoneNumber(extractedPhone)) ? 'completed' : 'ask_phone';
                        }

                        // الرد الفوري بدون أي انتظار للصوت السحابي (لتوفير سرعة فائقة في أجزاء من الثانية)
                        return {
                            message,
                            transcription,
                            quickReplies: [],
                            nextStep,
                            extractedName,
                            extractedPhone,
                            audioUrl: null
                        };
                    } else if (res.status === 429) {
                        WADA3AN_AI_CONFIG.rotateKey(key);
                        break;
                    }
                } catch (err) {
                    console.warn(`Audio model ${model} error:`, err.message);
                }
            }
        }

        // في حال تعذر الاتصال السحابي: رد احتياطي ذكي وفوري
        return {
            message: `أهلاً بك، تم استلام رسالتك الصوتية المسجلة بنجاح. أرجو أن تصف لي هل الألم حاد ويمتد للأطراف أم هو تشنج موضعي مستمر؟ وما أكثر حركة تزيد من حدته؟`,
            transcription: 'رسالة صوتية واردة من المراجع',
            quickReplies: [],
            nextStep: 'question_1',
            audioUrl: null
        };
    },

    ttsQueue: [],
    ttsCurrentIndex: 0,
    ttsActiveCallback: null,

    // تحويل الأرقام إلى كلمات عربية فصيحة مفهومة للقارئ الصوتي البشري
    convertNumbersToArabicWords(text) {
        if (!text) return '';
        let str = text.toString();

        // 1. تحويل أرقام الهواتف (مثل 079xxxxxxx أو 078xxxxxxx) إلى أرقام منفردة منطوقة
        str = str.replace(/(?:\+?962|0)?(7[789]\d{7})\b/g, (match) => {
            const digits = match.split('');
            const arabicDigitNames = {
                '0': 'صفر', '1': 'واحد', '2': 'اثنين', '3': 'ثلاثة', '4': 'أربعة',
                '5': 'خمسة', '6': 'ستة', '7': 'سبعة', '8': 'ثمانية', '9': 'تسعة'
            };
            return digits.map(d => arabicDigitNames[d] || d).join(' ');
        });

        // 2. تحويل النسب المئوية مثل 90% أو 50%
        str = str.replace(/(\d+)\s*%/g, (m, n) => {
            return this.numberToArabic(parseInt(n, 10)) + ' بالمئة';
        });

        // 3. تحويل الكسور مثل 1/10 أو 7/10
        str = str.replace(/(\d+)\s*\/\s*(\d+)/g, (m, num, den) => {
            return this.numberToArabic(parseInt(num, 10)) + ' من ' + this.numberToArabic(parseInt(den, 10));
        });

        // 4. تحويل النطاقات مثل 1-10 أو 3-5
        str = str.replace(/(\d+)\s*[-–—]\s*(\d+)/g, (m, from, to) => {
            return 'من ' + this.numberToArabic(parseInt(from, 10)) + ' إلى ' + this.numberToArabic(parseInt(to, 10));
        });

        // 5. تحويل أي أرقام مفردة أو مركبة متبقية (مثل 35 سنة، 80 كيلو، 175 سم)
        str = str.replace(/\b\d+\b/g, (match) => {
            const num = parseInt(match, 10);
            if (isNaN(num)) return match;
            return this.numberToArabic(num);
        });

        return str;
    },

    // تحويل عدد صحيح (0 إلى 10000) إلى كلمات عربية فصيحة
    numberToArabic(n) {
        if (n === 0) return 'صفر';
        if (n < 0) return 'سالب ' + this.numberToArabic(Math.abs(n));

        const ones = ['', 'واحد', 'اثنين', 'ثلاثة', 'أربعة', 'خمسة', 'ستة', 'سبعة', 'ثمانية', 'تسعة', 'عشرة',
            'أحد عشر', 'اثنا عشر', 'ثلاثة عشر', 'أربعة عشر', 'خمسة عشر', 'ستة عشر', 'سبعة عشر', 'ثمانية عشر', 'تسعة عشر'];
        const tens = ['', '', 'عشرين', 'ثلاثين', 'أربعين', 'خمسين', 'ستين', 'سبعين', 'ثمانين', 'تسعين'];
        const hundreds = ['', 'مئة', 'مئتين', 'ثلاثمائة', 'أربعمائة', 'خمسمائة', 'ستمائة', 'سبعمائة', 'ثمانمائة', 'تسعمائة'];

        if (n < 20) return ones[n];
        if (n < 100) {
            const rem = n % 10;
            const ten = Math.floor(n / 10);
            return rem > 0 ? (ones[rem] + ' و' + tens[ten]) : tens[ten];
        }
        if (n < 1000) {
            const rem = n % 100;
            const h = Math.floor(n / 100);
            return rem > 0 ? (hundreds[h] + ' و' + this.numberToArabic(rem)) : hundreds[h];
        }
        if (n < 10000) {
            const rem = n % 1000;
            const th = Math.floor(n / 1000);
            const thWord = th === 1 ? 'ألف' : (th === 2 ? 'ألفين' : (th <= 10 ? ones[th] + ' آلاف' : this.numberToArabic(th) + ' ألف'));
            return rem > 0 ? (thWord + ' و' + this.numberToArabic(rem)) : thWord;
        }
        return n.toString();
    },

    // تنظيف وضبط النص العربي للنطق الصوتي الفائق والواضح
    sanitizeSpeechArabicText(raw) {
        if (!raw) return '';
        let s = raw;

        // 0. تحويل كل الأرقام إلى نطق عربي فصيح أولاً قبل تنظيف الرموز
        s = this.convertNumbersToArabicWords(s);

        // 1. إزالة الكلمات والمصطلحات الإنجليزية/اللاتينية بالأقواس تماماً (حتى لا ينطقها القارئ الصوتي العربي بتشويه)
        s = s.replace(/\([A-Za-z0-9\s\-_/.,+*]+\)/g, ' ');
        s = s.replace(/[A-Za-z_#$@%&]+/g, ' ');

        // 2. إزالة الإيموجيات والرموز الخاصة بمختلف نطاقاتها
        s = s.replace(/[\u{1F300}-\u{1F9FF}\u{1FA00}-\u{1FAFF}\u{2600}-\u{27BF}\u{1F000}-\u{1F02F}\u{1F0A0}-\u{1F0FF}\u{1F100}-\u{1F1FF}\u{1F200}-\u{1F2FF}\u{2300}-\u{23FF}\u{2B50}\u{2B55}\u{2934}\u{2935}]/gu, ' ');
        // إزالة الأقواس والرموز التعبيرية والماركداون
        s = s.replace(/[-—–_•·*~#^+=<>|/\\`"'\(\)\[\]\{\}]/g, ' ');

        // 3. صون الكرامة والوقار التشريحي (استبدال أي لفظ دارج بلفظ طبي مهيب إن وجد)
        s = s.replace(/\bالمؤخرة\b/g, 'منطقة الإلية');

        // 4. تصحيح النطق الصوتي للكلمات العربية المشتركة والمتشابهة لغوياً (Phonetic Diacritics)
        s = s.replace(/\bالظهر\b/g, 'الظَّهْر')
             .replace(/\bظهرك\b/g, 'ظَهْرِك')
             .replace(/\bبالظهر\b/g, 'بالظَّهْر')
             .replace(/\bاسفل الظهر\b/g, 'أَسْفَل الظَّهْر')
             .replace(/\bأسفل الظهر\b/g, 'أَسْفَل الظَّهْر')
             .replace(/عرق\s+النسا/g, 'عِرْق النَّسَا')
             .replace(/الكايروبراكتيك/g, 'الكايْروبْراكْتِكْ')
             .replace(/كايروبراكتيك/g, 'كايْروبْراكْتِكْ')
             .replace(/بيوميكانيكي/g, 'بَيُومِيكَانِيكِي')
             .replace(/البيوميكانيكي/g, 'البَيُومِيكَانِيكِي')
             .replace(/الأبهر/g, 'الأَبْهَر')
             .replace(/الكمثرية/g, 'الكُمَّثْرِيَّة')
             .replace(/العضلة الكمثرية/g, 'العَضَلَة الكُمَّثْرِيَّة')
             .replace(/تشنج/g, 'تَشَنُّج')
             .replace(/التشنج/g, 'التَّشَنُّج')
             .replace(/غضروف/g, 'غُضْرُوف')
             .replace(/الغضروف/g, 'الغُضْرُوف')
             .replace(/غضاريف/g, 'غَضَارِيف')
             .replace(/لوحي\s+الكتف/g, 'لَوْحَيِ الكَتِف')
             .replace(/فقرات/g, 'فَقَرَات')
             .replace(/الفقرات/g, 'الفَقَرَات')
             .replace(/مفصل/g, 'مَفْصِل')
             .replace(/المفاصل/g, 'المَفَاصِل');

        // 5. إزالة أي تشكيل على الحرف الأخير من الكلمة التي تسبق علامات الوقف أو نهاية الفقرة (لتسكين نهايات الجمل كالقراءة العربية الطبيعية)
        s = s.replace(/[\u064B-\u0652]+(?=[\s]*[.!?؛؟\n]|$)/g, '');

        // إزالة المسافات المتكررة
        return s.replace(/\s+/g, ' ').trim();
    },

    // رسالة الترحيب والدليل الصوتي الشامل عند أول فتح الأداة
    async playIntroAudioGuide(onEndCallback) {
        if (typeof playStationAudio === 'function') {
            playStationAudio('welcome', onEndCallback);
            return;
        }
        const persona = this.getSessionDoctorPersona();
        const introText = `مرحباً بكم في «وداعاً للألم»، أول منظومة سريرية ذكية عالمياً متخصصة في فحص وتأهيل العمود الفقري والمفاصل، ومشاكل العضلات والأوتار، والخدر والتنميل، والتأهيل الحركي لمرضى الجلطات وصعوبات الحركة، بتقنية الكايروبراكتيك المعتمدة. أنا ${persona.name}، دليلك الطبي الافتراضي، للبدء يرجى النقر على موضع الألم أو الشكوى التي تشعر بها على المجسم البشري أمامك.`;
        try {
            this.unlockAudio();
            const voicePromise = this.generateHumanVoiceAudio(introText);
            const timeoutPromise = new Promise(resolve => setTimeout(() => resolve(null), 1500));
            const audioUrl = await Promise.race([voicePromise, timeoutPromise]);
            if (audioUrl) {
                this.playHumanAudio(audioUrl, onEndCallback);
                return audioUrl;
            }
        } catch (e) {
            console.warn('Intro audio guide notice:', e);
        }
        if (onEndCallback) onEndCallback();
        return null;
    },

    // نطق نص تقرير الطبيب بصوت استوديو بشري حقيقي فائق النقاء
    // استرجاع أفضل صوت عربي طبيعي متوفر في المتصفح مع تفضيل الأصوات البشرية السلسة
    getBestArabicVoice(isFemale) {
        if (typeof window === 'undefined' || !('speechSynthesis' in window)) return null;
        const voices = window.speechSynthesis.getVoices() || [];
        if (!voices || voices.length === 0) return null;

        const arVoices = voices.filter(v => (v.lang && v.lang.toLowerCase().startsWith('ar')) || (v.name && /arabic|عربي|عربية/i.test(v.name)));
        if (arVoices.length === 0) return null;

        if (isFemale) {
            const prefFemale = arVoices.find(v => /salma|laila|zeina|zariyah|mariam|hoda|fatima|female/i.test(v.name));
            if (prefFemale) return prefFemale;
        } else {
            const prefMale = arVoices.find(v => /shakir|naayf|maged|tarik|hamed|male/i.test(v.name));
            if (prefMale) return prefMale;
        }

        const naturalAr = arVoices.find(v => /natural|online|neural|google|apple|microsoft/i.test(v.name));
        if (naturalAr) return naturalAr;

        return arVoices[0];
    },

    // تشغيل نطق صوتي فوري بنظام المتصفح الصوتي العربي المتقدم كشبكة أمان دائمة تضمن عدم الصمت إطلاقاً
    speakWithNaturalSystemVoice(text, onEndCallback) {
        if (typeof window === 'undefined' || !('speechSynthesis' in window) || !text) {
            if (onEndCallback) onEndCallback();
            return;
        }

        try {
            window.speechSynthesis.cancel();
            const cleanText = this.sanitizeSpeechArabicText(text);
            if (!cleanText || cleanText.length < 2) {
                if (onEndCallback) onEndCallback();
                return;
            }

            const persona = this.getSessionDoctorPersona();
            const isFemale = (persona.id === 'sarah' || (persona.name && persona.name.includes('سارة')));
            const bestVoice = this.getBestArabicVoice(isFemale);

            const utterance = new SpeechSynthesisUtterance(cleanText);
            if (bestVoice) {
                utterance.voice = bestVoice;
                utterance.lang = bestVoice.lang;
            } else {
                utterance.lang = 'ar-SA';
            }

            utterance.rate = 0.95; // وتيرة هادئة وطبيعية غير متسرعة
            utterance.pitch = isFemale ? 1.05 : 0.95;

            this.isSpeaking = true;
            this.showLiveAudioPill();

            let hasEnded = false;
            const endHandler = () => {
                if (hasEnded) return;
                hasEnded = true;
                this.isSpeaking = false;
                this.hideLiveAudioPill();
                if (onEndCallback) onEndCallback();
            };

            utterance.onend = endHandler;
            utterance.onerror = (err) => {
                console.warn('System voice playback event:', err);
                endHandler();
            };

            // صمام أمان لإلغاء التعليق في بعض المتصفحات
            const safetyDuration = Math.max(8000, cleanText.length * 100);
            setTimeout(() => {
                if (this.isSpeaking && !hasEnded) {
                    endHandler();
                }
            }, safetyDuration);

            window.speechSynthesis.speak(utterance);
        } catch (e) {
            console.warn('speakWithNaturalSystemVoice failed:', e);
            this.isSpeaking = false;
            this.hideLiveAudioPill();
            if (onEndCallback) onEndCallback();
        }
    },

    // نطق نص تقرير الطبيب بصوت استوديو بشري حقيقي فائق النقاء أو الصوت العربي الطبيعي الفوري
    async speakText(text, onEndCallback) {
        this.stopSpeaking();
        if (!text) {
            if (onEndCallback) onEndCallback();
            return;
        }

        try {
            this.unlockAudio();
            const chosenVoice = this.getStudioVoiceForSession();
            // استخدام النص السريري مع تنظيف الرموز
            let clean = this.sanitizeSpeechArabicText(text);
            const sentences = clean.split(/(?<=[.!?؛؟\n])\s+/);
            if (sentences.length > 2 && clean.split(/\s+/).length > 35) {
                clean = sentences.slice(0, 2).join(' ');
            }
            const audioUrl = await this.generateGeminiNeuralAudioDirect(clean, chosenVoice);
            if (audioUrl) {
                this.playHumanAudio(audioUrl, onEndCallback);
                return;
            }
        } catch (e) {
            console.warn('Gemini studio neural voice notice:', e);
        }

        // إذا فشل TTS البشري: إكمال بصمت - لا صوت آلي
        console.info('[TTS] تعذر توليد الصوت البشري - إكمال بصمت');
        this.isSpeaking = false;
        this.hideLiveAudioPill();
        if (onEndCallback) onEndCallback();
    },

    // تشغيل نطق رسالة الشات بصوت الاستوديو الطبيعي
    async speakMessageHuman(text, btnEl) {
        if (this.isSpeaking) {
            this.stopSpeaking();
            if (btnEl) btnEl.textContent = '▶️';
            return;
        }
        if (btnEl) btnEl.textContent = '⏳';
        try {
            this.unlockAudio();
            const audioUrl = await this.generateHumanVoiceAudio(text);
            if (audioUrl) {
                if (btnEl) btnEl.textContent = '⏹️';
                this.playHumanAudio(audioUrl, () => {
                    if (btnEl) btnEl.textContent = '▶️';
                });
                return;
            }
        } catch (e) {
            console.warn('Speak message notice:', e);
        }

        // إذا فشل TTS البشري: إكمال بصمت - لا صوت آلي
        if (btnEl) btnEl.textContent = '▶️';
        console.info('[TTS] تعذر توليد الصوت البشري - إكمال بصمت');
    },

    // تم إيقاف التوليد الصوتي التفاعلي في الشات تماماً للاكتفاء بحوار نصي فائق السرعة
    async speakDoctorResponse(text, expectedToken, onEndCallback) {
        if (onEndCallback) onEndCallback();
        return;
    },




    // تشغيل الصوت العربي الطبيعي الفوري
    speakWithSystemVoice(text, onEndCallback) {
        this.speakWithNaturalSystemVoice(text, onEndCallback);
    },

    stopSpeaking() {
        this._speechSessionToken = (this._speechSessionToken || 0) + 1;
        this.hideLiveAudioPill();
        this.ttsQueue = [];
        this.ttsCurrentIndex = 0;
        this.ttsActiveCallback = null;
        if (this.currentAudio) {
            try {
                this.currentAudio.pause();
                this.currentAudio.currentTime = 0;
            } catch (e) {}
            this.currentAudio = null;
        }
        if (this._globalAudio) {
            try {
                this._globalAudio.pause();
                this._globalAudio.currentTime = 0;
            } catch (e) {}
        }
        if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
            try {
                window.speechSynthesis.cancel();
            } catch (e) {}
        }
        this.isSpeaking = false;
    }
};

if (typeof window !== 'undefined') {
    window.Wada3anAiEngine = Wada3anAiEngine;
}

