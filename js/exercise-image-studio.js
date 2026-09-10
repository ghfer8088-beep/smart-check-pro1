// ==========================================================================
// Smart Check Pro 2.0 - استوديو تخصيص وتكييف صور التمارين (Exercise Image Studio)
// محرك متكامل لإضافة وضبط وتكييف صور كروت التمارين تلقائياً (Auto-Fit & Auto-Size)
// مركز وداعاً للألم - دمج ذكي مع IndexedDB والـ Canvas الرسومي
// ==========================================================================

const ExerciseImageStudio = (function() {
    // ذاكرة وصول سريعة متزامنة للصور المخصصة
    let customImagesCache = {};
    let isInitialized = false;

    // الأبعاد القياسية المثالية المربعة لكروت التمارين (1:1 Square Ratio)
    const TARGET_CANVAS_WIDTH = 512;
    const TARGET_CANVAS_HEIGHT = 512;

    // حالة المحرر الحالي أثناء فتح النافذة المنبثقة
    let currentEditorState = {
        exerciseId: '',
        visualType: '',
        exerciseName: '',
        rawImage: null, // HTMLImageElement
        fitMode: 'cover', // 'cover' (ملء كامل تلقائي) أو 'contain' (احتواء كامل)
        zoom: 1.0,
        rotation: 0, // 0, 90, 180, 270
        bgColor: '#ffffff',
        activeDataUrl: null
    };

    // تهيئة الاستوديو وتحميل الصور من IndexedDB و LocalStorage
    async function init() {
        if (isInitialized) return;
        try {
            // محاولة التحميل من LocalStorage كطبقة فورية متزامنة
            const localSaved = localStorage.getItem('smart_custom_exercise_images');
            if (localSaved) {
                try {
                    customImagesCache = JSON.parse(localSaved) || {};
                } catch(e) {}
            }

            // التحميل الدائم من IndexedDB لضمان عدم فقدان أي صور كبيرة
            if (typeof SmartDB !== 'undefined' && typeof SmartDB.getSetting === 'function') {
                const dbSaved = await SmartDB.getSetting('custom_exercise_images', null);
                if (dbSaved && typeof dbSaved === 'object') {
                    customImagesCache = Object.assign({}, customImagesCache, dbSaved);

                    // تحديث الكروت المعروضة على الشاشة فور اكتمال القراءة من قاعدة البيانات
                    document.querySelectorAll('.exercise-illustration-frame').forEach(frame => {
                        const vt = frame.dataset.visualType;
                        const exId = frame.dataset.exerciseId;
                        const custom = getImage(vt, exId);
                        if (custom) {
                            updateCardFrameIllustration(frame, vt, exId, custom);
                        }
                    });
                }
            }
            isInitialized = true;
            console.log('✅ [ExerciseImageStudio] تم تهيئة استوديو الصور المخصصة بنجاح. عدد الصور المخصصة:', Object.keys(customImagesCache).length);
        } catch(e) {
            console.warn('[ExerciseImageStudio] تنبيه أثناء التهيئة:', e);
            isInitialized = true;
        }

        // الاستماع لأي لصق مباشر من الحافظة (Ctrl + V) إذا كان المودال مفتوحاً
        document.addEventListener('paste', handleGlobalPaste);
    }

    // جلب بيانات الصورة المخصصة إن وجدت
    function getImage(visualType, exerciseId = null) {
        // فحص بالمعرّف المباشر للتمرين أولاً، ثم بنوع الرسم visualType
        if (exerciseId && customImagesCache[exerciseId]) {
            return customImagesCache[exerciseId];
        }
        if (visualType && customImagesCache[visualType]) {
            return customImagesCache[visualType];
        }
        return null;
    }

    // حفظ صورة مخصصة في التخزين المؤقت والـ DB
    async function saveImage(key, dataUrl, fitMode = 'cover', extraMeta = {}) {
        if (!key || !dataUrl) return false;

        const payload = {
            url: dataUrl,
            fitMode: fitMode || 'cover',
            updatedAt: new Date().toISOString(),
            ...extraMeta
        };

        customImagesCache[key] = payload;

        // الحفظ في IndexedDB (يتسع لمئات الميجابايت بأمان تام)
        try {
            if (typeof SmartDB !== 'undefined' && typeof SmartDB.setSetting === 'function') {
                await SmartDB.setSetting('custom_exercise_images', customImagesCache);
            }
        } catch(e) {
            console.warn('[ExerciseImageStudio] خطأ في الحفظ في IndexedDB:', e);
        }

        // محاولة الحفظ في LocalStorage كنسخة احتياطية سريعة
        try {
            localStorage.setItem('smart_custom_exercise_images', JSON.stringify(customImagesCache));
        } catch(e) {
            console.warn('[ExerciseImageStudio] تم الحفظ في IndexedDB فقط لتجاوز قيود حجم LocalStorage');
        }

        // تحديث الكروت على الشاشة لحظياً
        notifyImageUpdated(key, payload);
        return true;
    }

    // إزالة صورة مخصصة واستعادة الرسم الأصلي
    async function removeImage(key) {
        if (!key) return false;
        delete customImagesCache[key];

        try {
            if (typeof SmartDB !== 'undefined' && typeof SmartDB.setSetting === 'function') {
                await SmartDB.setSetting('custom_exercise_images', customImagesCache);
            }
            localStorage.setItem('smart_custom_exercise_images', JSON.stringify(customImagesCache));
        } catch(e) {}

        // إشعار التطبيق لإعادة الرسم الافتراضي
        notifyImageUpdated(key, null);
        return true;
    }

    // استعادة كافة الصور الافتراضية
    async function resetAllImages() {
        if (!confirm('هل أنت متأكد من رغبتك في استعادة كافة الرسوم التوضيحية الأصلية لجميع التمارين؟')) return;
        customImagesCache = {};
        try {
            if (typeof SmartDB !== 'undefined' && typeof SmartDB.setSetting === 'function') {
                await SmartDB.setSetting('custom_exercise_images', {});
            }
            localStorage.removeItem('smart_custom_exercise_images');
        } catch(e) {}

        if (typeof showToast === 'function') {
            showToast('🔄 تم استعادة كافة الصور الأصلية لجميع التمارين', 'info');
        } else {
            alert('تم استعادة كافة الصور الأصلية');
        }

        // تحديث كافة الكروت على الصفحة
        document.querySelectorAll('.exercise-illustration-frame').forEach(frame => {
            const vt = frame.dataset.visualType;
            const exId = frame.dataset.exerciseId;
            updateCardFrameIllustration(frame, vt, exId, null);
        });
    }

    // إشعار فوري لتحديث الكروت المعروضة على الشاشة
    function notifyImageUpdated(key, payload) {
        document.querySelectorAll('.exercise-illustration-frame').forEach(frame => {
            const vt = frame.dataset.visualType;
            const exId = frame.dataset.exerciseId;
            if (exId === key || vt === key) {
                updateCardFrameIllustration(frame, vt, exId, payload);
            }
        });

        // إطلاق حدث عام في النافذة
        window.dispatchEvent(new CustomEvent('exerciseImageUpdated', { detail: { key, payload } }));
    }

    // تحديث إطار الكرت المعروض بالصورة الجديدة مباشرة
    function updateCardFrameIllustration(frame, visualType, exerciseId, payload) {
        if (!frame) return;
        const img = frame.querySelector('.exercise-illustration-img');
        const badge = frame.querySelector('.exercise-badge-pill');
        if (!img) return;

        if (payload && payload.url) {
            img.src = payload.url;
            img.style.objectFit = payload.fitMode === 'cover' ? 'cover' : 'contain';
        } else {
            // العودة للأصل
            const defaultUrl = (visualType && EXERCISE_IMAGES[visualType]) ? EXERCISE_IMAGES[visualType] : "assets/exercises/cat_cow.jpg";
            img.src = defaultUrl;
            img.style.objectFit = 'contain';
        }
    }

    // ==========================================================================
    // محرك التكييف الرسومي التلقائي (Canvas Auto-Fit Engine)
    // ==========================================================================

    // معالجة وتكييف الصورة على أبعاد الكرت بنسبة 100%
    function renderPreviewOnCanvas() {
        const canvas = document.getElementById('studio-preview-canvas');
        if (!canvas) return;
        const ctx = canvas.getContext('2d');

        canvas.width = TARGET_CANVAS_WIDTH;
        canvas.height = TARGET_CANVAS_HEIGHT;

        // 1. ملء الخلفية
        ctx.fillStyle = currentEditorState.bgColor || '#ffffff';
        ctx.fillRect(0, 0, canvas.width, canvas.height);

        const img = currentEditorState.rawImage;
        if (!img) {
            // رسم placeholder مريح
            ctx.fillStyle = '#64748b';
            ctx.font = 'bold 20px Cairo, sans-serif';
            ctx.textAlign = 'center';
            ctx.fillText('📷 اختر صورة أو اسحبها هنا أو الصقها (Ctrl+V)', canvas.width / 2, canvas.height / 2);
            return;
        }

        ctx.save();

        // 2. تطبيق التدوير إن وجد حول مركز الكانفاس
        ctx.translate(canvas.width / 2, canvas.height / 2);
        if (currentEditorState.rotation) {
            ctx.rotate((currentEditorState.rotation * Math.PI) / 180);
        }

        // أبعاد الصورة بعد التدوير لحساب التكييف السليم
        const isRotated90 = currentEditorState.rotation === 90 || currentEditorState.rotation === 270;
        const effectiveImgWidth = isRotated90 ? img.naturalHeight : img.naturalWidth;
        const effectiveImgHeight = isRotated90 ? img.naturalWidth : img.naturalHeight;

        let scale = 1;
        if (currentEditorState.fitMode === 'cover') {
            // ملء كامل الإطار تلقائياً دون أي حواف بيضاء (Auto-Cover & Fill)
            scale = Math.max(canvas.width / effectiveImgWidth, canvas.height / effectiveImgHeight);
        } else {
            // احتواء كامل للصورة دون اقتطاع أي جزء منها (Auto-Contain)
            scale = Math.min((canvas.width - 24) / effectiveImgWidth, (canvas.height - 24) / effectiveImgHeight);
        }

        // تطبيق زوم المستخدم
        scale = scale * (currentEditorState.zoom || 1.0);

        const drawW = img.naturalWidth * scale;
        const drawH = img.naturalHeight * scale;

        // رسم الصورة ممركزة في المنتصف
        ctx.drawImage(img, -drawW / 2, -drawH / 2, drawW, drawH);

        ctx.restore();

        // تحديث الـ DataURL المحفوظ للمعاينة
        try {
            currentEditorState.activeDataUrl = canvas.toDataURL('image/jpeg', 0.88);
        } catch(e) {
            console.error('خطأ في توليد DataURL:', e);
        }
    }

    // معالجة ملف صورة تم اختياره أو إسقاطه
    function loadFileIntoEditor(file) {
        if (!file || !file.type.startsWith('image/')) {
            alert('يرجى اختيار ملف صورة صالح (PNG, JPG, WEBP, SVG)');
            return;
        }

        const reader = new FileReader();
        reader.onload = (e) => {
            loadSourceUrlIntoEditor(e.target.result);
        };
        reader.readAsDataURL(file);
    }

    // تحميل رابط صورة (DataURL أو Web URL) في المحرر
    function loadSourceUrlIntoEditor(srcUrl) {
        const img = new Image();
        img.crossOrigin = 'anonymous';
        img.onload = () => {
            currentEditorState.rawImage = img;
            currentEditorState.rotation = 0;
            currentEditorState.zoom = 1.0;
            renderPreviewOnCanvas();

            const statusEl = document.getElementById('studio-status-note');
            if (statusEl) {
                statusEl.innerHTML = `✅ تم تكييف الصورة بنجاح! الأبعاد الأصلية: ${img.naturalWidth}×${img.naturalHeight}px`;
                statusEl.style.color = '#10b981';
            }
        };
        img.onerror = () => {
            alert('تعذر تحميل الصورة من الرابط أو المصدر المحدد. يرجى تجربة رفع الملف مباشرة من جهازك.');
        };
        img.src = srcUrl;
    }

    // استماع اللصق المباشر من الحافظة Ctrl + V
    function handleGlobalPaste(e) {
        const modal = document.getElementById('exercise-image-studio-modal');
        if (!modal || modal.style.display === 'none') return;

        const items = (e.clipboardData || e.originalEvent.clipboardData).items;
        for (let item of items) {
            if (item.type.indexOf('image') !== -1) {
                const blob = item.getAsFile();
                loadFileIntoEditor(blob);
                if (typeof showToast === 'function') {
                    showToast('📋 تم لصق الصورة من الحافظة بنجاح!', 'success');
                }
                break;
            }
        }
    }

    // ==========================================================================
    // واجهات المستخدم والمودال التفاعلي
    // ==========================================================================

    // فتح نافذة محرر صورة التمرين
    function openModal(exerciseId, visualType, exerciseName = '') {
        currentEditorState.exerciseId = exerciseId || visualType || '';
        currentEditorState.visualType = visualType || '';
        currentEditorState.exerciseName = exerciseName || (typeof MASTER_EXERCISES_CATALOG !== 'undefined' ? findExerciseNameById(exerciseId, visualType) : 'تمرين علاجي');
        currentEditorState.rawImage = null;
        currentEditorState.fitMode = 'cover';
        currentEditorState.zoom = 1.0;
        currentEditorState.rotation = 0;
        currentEditorState.bgColor = '#ffffff';

        ensureModalHTMLInDOM();

        const modal = document.getElementById('exercise-image-studio-modal');
        const titleEl = document.getElementById('studio-modal-title');
        const zoomSlider = document.getElementById('studio-zoom-slider');
        const statusEl = document.getElementById('studio-status-note');

        if (titleEl) {
            titleEl.textContent = `🖼️ تخصيص وتكييف صورة: ${currentEditorState.exerciseName}`;
        }
        if (zoomSlider) {
            zoomSlider.value = 1.0;
        }
        if (statusEl) {
            statusEl.textContent = 'جاهز لرفع أو لصق صورتك وتكييفها تلقائياً على الكرت.';
            statusEl.style.color = '#94a3b8';
        }

        // تحديث أزرار خيارات الـ Fit Mode
        updateFitModeButtonsUI('cover');

        // تحميل الصورة الحالية (سواء مخصصة أو الرسم الافتراضي) في الكانفاس كبداية
        const existingCustom = getImage(visualType, exerciseId);
        const initialSrc = existingCustom ? existingCustom.url : ((visualType && EXERCISE_IMAGES[visualType]) ? EXERCISE_IMAGES[visualType] : "assets/exercises/cat_cow.jpg");
        loadSourceUrlIntoEditor(initialSrc);

        modal.style.display = 'flex';
    }

    function closeModal() {
        const modal = document.getElementById('exercise-image-studio-modal');
        if (modal) modal.style.display = 'none';
    }

    function updateFitModeButtonsUI(mode) {
        currentEditorState.fitMode = mode;
        const btnCover = document.getElementById('studio-btn-mode-cover');
        const btnContain = document.getElementById('studio-btn-mode-contain');

        if (btnCover && btnContain) {
            if (mode === 'cover') {
                btnCover.style.background = 'var(--primary-gold)';
                btnCover.style.color = '#0a0e14';
                btnCover.style.borderColor = 'var(--primary-gold)';

                btnContain.style.background = '#1e293b';
                btnContain.style.color = '#cbd5e1';
                btnContain.style.borderColor = '#334155';
            } else {
                btnContain.style.background = 'var(--primary-gold)';
                btnContain.style.color = '#0a0e14';
                btnContain.style.borderColor = 'var(--primary-gold)';

                btnCover.style.background = '#1e293b';
                btnCover.style.color = '#cbd5e1';
                btnCover.style.borderColor = '#334155';
            }
        }
        renderPreviewOnCanvas();
    }

    function rotateImage90() {
        currentEditorState.rotation = (currentEditorState.rotation + 90) % 360;
        renderPreviewOnCanvas();
    }

    function setZoom(val) {
        currentEditorState.zoom = parseFloat(val) || 1.0;
        renderPreviewOnCanvas();
    }

    function setBgColor(color) {
        currentEditorState.bgColor = color;
        renderPreviewOnCanvas();
    }

    // حفظ وتطبيق الصورة على كرت التمرين
    async function applyAndSave() {
        if (!currentEditorState.activeDataUrl) {
            alert('يرجى اختيار صورة أولاً');
            return;
        }

        const key = currentEditorState.exerciseId || currentEditorState.visualType;
        const btnSave = document.getElementById('studio-btn-save');
        if (btnSave) {
            btnSave.disabled = true;
            btnSave.textContent = '⏳ جاري الحفظ والتكييف...';
        }

        await saveImage(key, currentEditorState.activeDataUrl, currentEditorState.fitMode, {
            exerciseName: currentEditorState.exerciseName,
            visualType: currentEditorState.visualType
        });

        if (btnSave) {
            btnSave.disabled = false;
            btnSave.textContent = '💾 حفظ وتطبيق الصورة في الكرت';
        }

        closeModal();

        if (typeof showToast === 'function') {
            showToast(`✅ تم حفظ وتكييف صورة [${currentEditorState.exerciseName}] بنجاح!`, 'success');
        } else {
            alert(`✅ تم حفظ وتكييف صورة [${currentEditorState.exerciseName}] بنجاح!`);
        }
    }

    // استعادة الصورة الافتراضية للتمرين الحالي
    async function resetCurrentExerciseImage() {
        const key = currentEditorState.exerciseId || currentEditorState.visualType;
        if (!confirm(`هل تريد استعادة الرسم الأصلي لتمرين [${currentEditorState.exerciseName}]؟`)) return;

        await removeImage(key);
        closeModal();

        if (typeof showToast === 'function') {
            showToast(`🔄 تم استعادة الرسم الأصلي لتمرين [${currentEditorState.exerciseName}]`, 'info');
        } else {
            alert('تم استعادة الرسم الأصلي.');
        }
    }

    // تصدير حزمة الصور المخصصة إلى ملف JSON كنسخة احتياطية
    function exportImagesJSON() {
        const keys = Object.keys(customImagesCache);
        if (keys.length === 0) {
            alert('لا توجد صور مخصصة حالياً لتصديرها.');
            return;
        }

        const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(customImagesCache, null, 2));
        const dlAnchor = document.createElement('a');
        dlAnchor.setAttribute("href", dataStr);
        dlAnchor.setAttribute("download", `Wada3an_Exercise_Images_Backup_${new Date().toISOString().slice(0,10)}.json`);
        document.body.appendChild(dlAnchor);
        dlAnchor.click();
        dlAnchor.remove();

        if (typeof showToast === 'function') {
            showToast(`💾 تم تصدير حزمة تضم ${keys.length} صورة مخصصة بنجاح!`, 'success');
        }
    }

    // استيراد حزمة صور مخصصة من ملف JSON
    function importImagesJSON(file) {
        if (!file) return;
        const reader = new FileReader();
        reader.onload = async (e) => {
            try {
                const imported = JSON.parse(e.target.result);
                if (typeof imported !== 'object') throw new Error('صيغة ملف غير صالحة');
                
                customImagesCache = Object.assign({}, customImagesCache, imported);
                
                if (typeof SmartDB !== 'undefined' && typeof SmartDB.setSetting === 'function') {
                    await SmartDB.setSetting('custom_exercise_images', customImagesCache);
                }
                try {
                    localStorage.setItem('smart_custom_exercise_images', JSON.stringify(customImagesCache));
                } catch(err) {}

                if (typeof showToast === 'function') {
                    showToast('✅ تم استيراد حزمة الصور بنجاح وتطبيقها على كافة الكروت!', 'success');
                } else {
                    alert('تم استيراد حزمة الصور بنجاح!');
                }

                // تحديث كافة الكروت على الصفحة
                document.querySelectorAll('.exercise-illustration-frame').forEach(frame => {
                    const vt = frame.dataset.visualType;
                    const exId = frame.dataset.exerciseId;
                    const custom = getImage(vt, exId);
                    updateCardFrameIllustration(frame, vt, exId, custom);
                });
            } catch(err) {
                alert('عذراً، حدث خطأ أثناء قراءة ملف النسخة الاحتياطية: ' + err.message);
            }
        };
        reader.readAsText(file);
    }

    // البحث عن اسم التمرين من الكتالوج
    function findExerciseNameById(exId, visualType) {
        if (typeof MASTER_EXERCISES_CATALOG === 'undefined') return 'تمرين علاجي';
        for (let cat of Object.values(MASTER_EXERCISES_CATALOG)) {
            const found = cat.find(x => x.id === exId || x.visualType === visualType);
            if (found) return found.name;
        }
        return 'تمرين علاجي';
    }

    // توليد وتأكيد وجود نافذة المودال في الصفحة
    function ensureModalHTMLInDOM() {
        if (document.getElementById('exercise-image-studio-modal')) return;

        const modalDiv = document.createElement('div');
        modalDiv.id = 'exercise-image-studio-modal';
        modalDiv.className = 'app-modal';
        modalDiv.style.cssText = 'display: none; position: fixed; top: 0; left: 0; width: 100vw; height: 100vh; background: rgba(5, 8, 15, 0.88); backdrop-filter: blur(8px); z-index: 100000; align-items: center; justify-content: center; padding: 15px; direction: rtl;';

        modalDiv.innerHTML = `
            <div class="modal-inner" style="background: #0f172a; border: 1.5px solid var(--primary-gold); border-radius: 16px; width: 100%; max-width: 780px; max-height: 92vh; overflow-y: auto; padding: 25px; box-shadow: 0 15px 50px rgba(0,0,0,0.8); color: #e2e8f0;">
                <!-- Header -->
                <div style="display: flex; justify-content: space-between; align-items: center; border-bottom: 1px solid rgba(212, 175, 55, 0.25); padding-bottom: 15px; margin-bottom: 20px;">
                    <div>
                        <h3 id="studio-modal-title" style="color: var(--primary-gold); margin: 0; font-size: 1.25em;">🖼️ تخصيص وتكييف صورة التمرين</h3>
                        <p style="color: #94a3b8; font-size: 0.82em; margin: 4px 0 0 0;">محرك التكييف التلقائي - تكييف أي صورة لتملأ الكادر المخصص للتمرين بالكامل</p>
                    </div>
                    <button type="button" onclick="ExerciseImageStudio.closeModal()" style="background: none; border: none; color: #94a3b8; font-size: 1.7em; cursor: pointer; line-height: 1;">&times;</button>
                </div>

                <!-- معاينة حية تفاعلية للكرت (Live Interactive Canvas Frame) -->
                <div style="margin-bottom: 20px;">
                    <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 10px;">
                        <span style="font-size: 0.88em; font-weight: bold; color: var(--primary-gold);">🎯 معاينة شكل الصورة الحية داخل كرت التمرين (أبعاد مربعة مطابقة):</span>
                        <span id="studio-status-note" style="font-size: 0.78em; color: #94a3b8;">جاهز لتكييف الصورة</span>
                    </div>

                    <div style="display: flex; justify-content: center; background: #080d1a; border-radius: 12px; padding: 16px; border: 1px dashed #334155;">
                        <div style="position: relative; width: 250px; height: 250px; aspect-ratio: 1 / 1; border-radius: 12px; overflow: hidden; background: #ffffff; border: 2px solid var(--primary-gold); box-shadow: 0 4px 20px rgba(0,0,0,0.5); display: flex; align-items: center; justify-content: center;">
                            <canvas id="studio-preview-canvas" style="width: 100%; height: 100%; object-fit: contain; display: block;"></canvas>
                        </div>
                    </div>
                </div>

                <!-- خيارات الحجم والتكييف التلقائي (Auto-Fit Controls) -->
                <div style="background: #111827; border: 1px solid #1e293b; border-radius: 12px; padding: 16px; margin-bottom: 20px;">
                    <div style="font-size: 0.88em; font-weight: bold; color: #cbd5e1; margin-bottom: 12px; display: flex; align-items: center; gap: 6px;">
                        <span>⚙️ خيارات التكييف والحجم التلقائي (Auto-Fit):</span>
                    </div>

                    <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 10px; margin-bottom: 15px;">
                        <button type="button" id="studio-btn-mode-cover" onclick="ExerciseImageStudio.updateFitMode('cover')" style="background: var(--primary-gold); color: #0a0e14; border: 1px solid var(--primary-gold); padding: 9px 12px; border-radius: 8px; font-size: 0.86em; font-weight: bold; cursor: pointer; display: flex; align-items: center; justify-content: center; gap: 6px; transition: all 0.2s;">
                            <span>🔲 ملء كامل الإطار (Auto-Cover)</span>
                        </button>
                        <button type="button" id="studio-btn-mode-contain" onclick="ExerciseImageStudio.updateFitMode('contain')" style="background: #1e293b; color: #cbd5e1; border: 1px solid #334155; padding: 9px 12px; border-radius: 8px; font-size: 0.86em; font-weight: bold; cursor: pointer; display: flex; align-items: center; justify-content: center; gap: 6px; transition: all 0.2s;">
                            <span>🔳 احتواء متناسق كامل (Contain)</span>
                        </button>
                    </div>

                    <!-- شريط الزوم والتدوير ولون الخلفية -->
                    <div style="display: flex; gap: 15px; align-items: center; flex-wrap: wrap; border-top: 1px solid rgba(255,255,255,0.06); padding-top: 12px;">
                        <div style="display: flex; align-items: center; gap: 8px; flex: 1; min-width: 180px;">
                            <span style="font-size: 0.82em; color: #94a3b8;">🔍 التكبير (Zoom):</span>
                            <input type="range" id="studio-zoom-slider" min="0.8" max="2.0" step="0.05" value="1.0" oninput="ExerciseImageStudio.setZoom(this.value)" style="flex: 1; accent-color: var(--primary-gold);">
                        </div>

                        <button type="button" onclick="ExerciseImageStudio.rotateImage90()" style="background: #1e293b; color: #93c5fd; border: 1px solid #3b82f6; padding: 6px 12px; border-radius: 6px; font-size: 0.82em; cursor: pointer; display: flex; align-items: center; gap: 4px;">
                            🔄 تدوير 90°
                        </button>

                        <div style="display: flex; align-items: center; gap: 6px;">
                            <span style="font-size: 0.82em; color: #94a3b8;">الخلفية:</span>
                            <button type="button" onclick="ExerciseImageStudio.setBgColor('#ffffff')" title="أبيض طبي" style="width: 22px; height: 22px; border-radius: 4px; background: #ffffff; border: 1px solid #94a3b8; cursor: pointer;"></button>
                            <button type="button" onclick="ExerciseImageStudio.setBgColor('#0f172a')" title="داكن طبي" style="width: 22px; height: 22px; border-radius: 4px; background: #0f172a; border: 1px solid #334155; cursor: pointer;"></button>
                        </div>
                    </div>
                </div>

                <!-- مصادر رفع وإضافة الصورة (Upload Sources) -->
                <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(280px, 1fr)); gap: 14px; margin-bottom: 25px;">
                    <!-- خيار 1: سحب وإفلات أو تصفح ملف -->
                    <div id="studio-dropzone" 
                         ondragover="event.preventDefault(); this.style.borderColor='var(--primary-gold)'; this.style.background='rgba(212,175,55,0.08)';"
                         ondragleave="event.preventDefault(); this.style.borderColor='#334155'; this.style.background='transparent';"
                         ondrop="event.preventDefault(); this.style.borderColor='#334155'; this.style.background='transparent'; if(event.dataTransfer.files.length) ExerciseImageStudio.handleFileSelect(event.dataTransfer.files[0]);"
                         style="border: 2px dashed #334155; border-radius: 12px; padding: 20px; text-align: center; cursor: pointer; transition: all 0.2s;"
                         onclick="document.getElementById('studio-file-input').click()">
                        <div style="font-size: 2em; margin-bottom: 6px;">📁</div>
                        <div style="font-weight: bold; color: #cbd5e1; font-size: 0.9em; margin-bottom: 4px;">انقر لاختيار ملف أو اسحب الصورة هنا</div>
                        <div style="font-size: 0.78em; color: #94a3b8;">يدعم PNG, JPG, WEBP, SVG وأي أبعاد</div>
                        <input type="file" id="studio-file-input" accept="image/*" style="display: none;" onchange="if(this.files.length) ExerciseImageStudio.handleFileSelect(this.files[0])">
                    </div>

                    <!-- خيار 2: رابط صورة مباشر أو لصق من الحافظة -->
                    <div style="background: #111827; border: 1px solid #1e293b; border-radius: 12px; padding: 18px; display: flex; flex-direction: column; justify-content: space-between;">
                        <div>
                            <label style="font-size: 0.85em; color: #cbd5e1; display: block; margin-bottom: 6px; font-weight: bold;">🔗 أو الصق رابط صورة مباشرة (URL):</label>
                            <div style="display: flex; gap: 6px;">
                                <input type="url" id="studio-url-input" placeholder="https://example.com/image.jpg" style="flex: 1; background: #0b1120; border: 1px solid #334155; border-radius: 6px; padding: 8px 10px; color: #fff; font-size: 0.84em;">
                                <button type="button" onclick="ExerciseImageStudio.loadFromUrlInput()" style="background: #1e293b; color: var(--primary-gold); border: 1px solid var(--primary-gold); padding: 8px 14px; border-radius: 6px; font-size: 0.84em; font-weight: bold; cursor: pointer;">تحميل</button>
                            </div>
                        </div>
                        <div style="margin-top: 10px; background: rgba(56, 189, 248, 0.08); border: 1px dashed #38bdf8; border-radius: 6px; padding: 7px 10px; font-size: 0.78em; color: #7dd3fc; display: flex; align-items: center; gap: 6px;">
                            <span>📋</span>
                            <span><strong>نصيحة ذكية:</strong> يمكنك نسخ أي صورة أو لقطة شاشة والضغط مباشرة على <strong>Ctrl + V</strong> للصقها فوراً!</span>
                        </div>
                    </div>
                </div>

                <!-- Footer Actions -->
                <div style="display: flex; justify-content: space-between; align-items: center; flex-wrap: wrap; gap: 12px; border-top: 1px solid rgba(212, 175, 55, 0.2); padding-top: 18px;">
                    <button type="button" onclick="ExerciseImageStudio.resetCurrentExerciseImage()" style="background: rgba(239, 68, 68, 0.15); color: #fca5a5; border: 1px solid #ef4444; padding: 10px 16px; border-radius: 8px; font-size: 0.88em; cursor: pointer; display: flex; align-items: center; gap: 6px;">
                        🔄 استعادة الرسم الأصلي
                    </button>

                    <div style="display: flex; gap: 10px;">
                        <button type="button" onclick="ExerciseImageStudio.closeModal()" style="background: #1e293b; color: #cbd5e1; border: 1px solid #334155; padding: 10px 18px; border-radius: 8px; font-size: 0.9em; cursor: pointer;">
                            إلغاء
                        </button>
                        <button type="button" id="studio-btn-save" onclick="ExerciseImageStudio.applyAndSave()" style="background: linear-gradient(135deg, #d4af37 0%, #aa820a 100%); color: #0a0e14; border: none; padding: 10px 24px; border-radius: 8px; font-weight: bold; font-size: 0.95em; cursor: pointer; display: flex; align-items: center; gap: 6px; box-shadow: 0 4px 15px rgba(212, 175, 55, 0.3);">
                            💾 حفظ وتطبيق الصورة في الكرت
                        </button>
                    </div>
                </div>
            </div>
        `;

        document.body.appendChild(modalDiv);
    }

    // ==========================================================================
    // نافذة مدير كافة صور التمارين (Exercise Gallery Manager Modal)
    // ==========================================================================

    function openGalleryManagerModal() {
        ensureGalleryManagerHTMLInDOM();
        const modal = document.getElementById('exercise-gallery-manager-modal');
        if (!modal) return;
        renderGalleryManagerGrid('all');
        modal.style.display = 'flex';
    }

    function closeGalleryManagerModal() {
        const modal = document.getElementById('exercise-gallery-manager-modal');
        if (modal) modal.style.display = 'none';
    }

    function renderGalleryManagerGrid(category = 'all', searchQuery = '') {
        const container = document.getElementById('gallery-manager-items-grid');
        const countCustomEl = document.getElementById('gallery-manager-custom-count');
        if (!container || typeof MASTER_EXERCISES_CATALOG === 'undefined') return;

        let list = [];
        if (category === 'all') {
            Object.entries(MASTER_EXERCISES_CATALOG).forEach(([catKey, exList]) => {
                exList.forEach(ex => list.push({ ...ex, categoryKey: catKey }));
            });
        } else if (MASTER_EXERCISES_CATALOG[category]) {
            list = MASTER_EXERCISES_CATALOG[category].map(ex => ({ ...ex, categoryKey: category }));
        }

        if (searchQuery) {
            const q = searchQuery.toLowerCase().trim();
            list = list.filter(ex => (ex.name && ex.name.toLowerCase().includes(q)) || (ex.scientificName && ex.scientificName.toLowerCase().includes(q)));
        }

        // إحصاء الصور المخصصة
        const totalCustom = Object.keys(customImagesCache).length;
        if (countCustomEl) {
            countCustomEl.textContent = `${totalCustom} صورة مخصصة محفوظة`;
        }

        container.innerHTML = list.map((ex, idx) => {
            const customData = getImage(ex.visualType, ex.id);
            const isCustom = !!customData;
            const imgUrl = isCustom ? customData.url : ((ex.visualType && EXERCISE_IMAGES[ex.visualType]) ? EXERCISE_IMAGES[ex.visualType] : "assets/exercises/cat_cow.jpg");
            const fitMode = (isCustom && customData.fitMode) ? customData.fitMode : 'contain';

            return `
                <div style="background: #111827; border: 1px solid ${isCustom ? '#10b981' : 'rgba(212, 175, 55, 0.3)'}; border-radius: 12px; padding: 12px; display: flex; flex-direction: column; justify-content: space-between; box-shadow: 0 4px 15px rgba(0,0,0,0.3);">
                    <div>
                        <div style="position: relative; width: 100%; height: 140px; border-radius: 8px; overflow: hidden; background: #ffffff; margin-bottom: 10px; display: flex; align-items: center; justify-content: center; border: 1px solid rgba(212, 175, 55, 0.25);">
                            <img src="${imgUrl}" alt="${ex.name}" style="width: 100%; height: 100%; object-fit: ${fitMode}; display: block;">
                            <span style="position: absolute; top: 6px; right: 6px; font-size: 0.72em; padding: 2px 6px; border-radius: 4px; font-weight: bold; ${isCustom ? 'background: rgba(16, 185, 129, 0.9); color: #fff;' : 'background: rgba(15, 23, 42, 0.85); color: var(--primary-gold); border: 1px solid rgba(212, 175, 55, 0.3);'}">
                                ${isCustom ? '✨ مخصصة' : 'أصلية'}
                            </span>
                        </div>
                        <div style="font-size: 0.76em; color: var(--primary-gold); font-weight: bold; margin-bottom: 4px;">#${idx+1} (${ex.id})</div>
                        <h4 style="color: #ffffff; margin: 0 0 4px 0; font-size: 0.92em; line-height: 1.4;">${ex.name}</h4>
                        <div style="font-size: 0.76em; color: #94a3b8; margin-bottom: 10px;">${ex.scientificName || ''}</div>
                    </div>

                    <div style="display: flex; gap: 6px;">
                        <button type="button" onclick="ExerciseImageStudio.openModal('${ex.id}', '${ex.visualType}', '${ex.name.replace(/'/g, "\\'")}')" style="flex: 1; background: var(--primary-gold); color: #0a0e14; border: none; padding: 7px 10px; border-radius: 6px; font-size: 0.82em; font-weight: bold; cursor: pointer;">
                            📷 تغيير الصورة
                        </button>
                        ${isCustom ? `
                            <button type="button" onclick="ExerciseImageStudio.removeImage('${ex.id}'); ExerciseImageStudio.renderGalleryManagerGrid();" title="استعادة الأصل" style="background: rgba(239, 68, 68, 0.2); color: #fca5a5; border: 1px solid #ef4444; padding: 7px 10px; border-radius: 6px; font-size: 0.82em; cursor: pointer;">
                                🔄
                            </button>
                        ` : ''}
                    </div>
                </div>
            `;
        }).join('');
    }

    function ensureGalleryManagerHTMLInDOM() {
        if (document.getElementById('exercise-gallery-manager-modal')) return;

        const modalDiv = document.createElement('div');
        modalDiv.id = 'exercise-gallery-manager-modal';
        modalDiv.className = 'app-modal';
        modalDiv.style.cssText = 'display: none; position: fixed; top: 0; left: 0; width: 100vw; height: 100vh; background: rgba(5, 8, 15, 0.9); backdrop-filter: blur(8px); z-index: 99999; align-items: center; justify-content: center; padding: 15px; direction: rtl;';

        modalDiv.innerHTML = `
            <div class="modal-inner" style="background: #0f172a; border: 1.5px solid var(--primary-gold); border-radius: 16px; width: 100%; max-width: 1150px; max-height: 94vh; overflow-y: auto; padding: 25px; box-shadow: 0 15px 50px rgba(0,0,0,0.8); color: #e2e8f0;">
                <!-- Header -->
                <div style="display: flex; justify-content: space-between; align-items: center; flex-wrap: wrap; gap: 12px; border-bottom: 1px solid rgba(212, 175, 55, 0.25); padding-bottom: 15px; margin-bottom: 20px;">
                    <div>
                        <h2 style="color: var(--primary-gold); margin: 0; font-size: 1.4em;">🖼️ مدير واستوديو صور مكتبة التمارين</h2>
                        <div style="color: #94a3b8; font-size: 0.84em; margin-top: 4px;">
                            استعراض وتعديل صور كافة الـ 42 تمريناً طبياً مع الحجم والتكييف التلقائي • <span id="gallery-manager-custom-count" style="color: #10b981; font-weight: bold;">0 صورة مخصصة</span>
                        </div>
                    </div>

                    <div style="display: flex; gap: 8px; flex-wrap: wrap; align-items: center;">
                        <button type="button" onclick="ExerciseImageStudio.exportImagesJSON()" class="btn-header" style="background: rgba(16, 185, 129, 0.15); border-color: #10b981; color: #6ee7b7; font-size: 0.84em; padding: 7px 14px;">
                            💾 تصدير نسخة احتياطية
                        </button>
                        <button type="button" onclick="document.getElementById('studio-import-file-input').click()" class="btn-header" style="background: rgba(59, 130, 246, 0.15); border-color: #3b82f6; color: #93c5fd; font-size: 0.84em; padding: 7px 14px;">
                            📂 استيراد حزمة صور
                        </button>
                        <input type="file" id="studio-import-file-input" accept=".json" style="display: none;" onchange="if(this.files.length) ExerciseImageStudio.importImagesJSON(this.files[0])">
                        <button type="button" onclick="ExerciseImageStudio.resetAllImages()" class="btn-header" style="background: rgba(239, 68, 68, 0.15); border-color: #ef4444; color: #fca5a5; font-size: 0.84em; padding: 7px 14px;">
                            🔄 استعادة الكل
                        </button>
                        <button type="button" onclick="ExerciseImageStudio.closeGalleryManagerModal()" style="background: none; border: none; color: #94a3b8; font-size: 1.8em; cursor: pointer; line-height: 1;">&times;</button>
                    </div>
                </div>

                <!-- البحث والتصفية -->
                <div style="display: flex; gap: 10px; margin-bottom: 20px; flex-wrap: wrap; align-items: center;">
                    <input type="text" id="gallery-manager-search" placeholder="🔍 ابحث عن تمرين بالاسم أو المنطقة..." oninput="ExerciseImageStudio.handleSearchInput(this.value)" style="flex: 1; min-width: 240px; background: #111827; border: 1px solid #334155; border-radius: 8px; padding: 10px 14px; color: #fff; font-size: 0.88em;">
                    
                    <select id="gallery-manager-category-select" onchange="ExerciseImageStudio.handleCategorySelect(this.value)" style="background: #111827; border: 1px solid #334155; border-radius: 8px; padding: 10px 14px; color: var(--primary-gold); font-size: 0.88em; cursor: pointer;">
                        <option value="all">🌟 كافة المناطق (الكل)</option>
                        <option value="cervical">الرقبة والرأس</option>
                        <option value="jaw">مفصل الفك (TMJ)</option>
                        <option value="thoracic_scapula">أعلى الظهر والأبهر</option>
                        <option value="chest_ribs">القفص الصدري</option>
                        <option value="shoulder">الكتف والكفة المدورة</option>
                        <option value="lumbar">أسفل الظهر والديسك</option>
                        <option value="si_joint">عرق النسا والحوض</option>
                        <option value="elbow">الكوع والساعد</option>
                        <option value="wrist">الرسغ واليد</option>
                        <option value="knee">الركبة والفخذ</option>
                        <option value="ankle">الكاحل والقدم</option>
                    </select>
                </div>

                <!-- الشبكة المعروضة -->
                <div id="gallery-manager-items-grid" style="display: grid; grid-template-columns: repeat(auto-fill, minmax(220px, 1fr)); gap: 14px; max-height: 60vh; overflow-y: auto; padding-right: 4px;"></div>
            </div>
        `;

        document.body.appendChild(modalDiv);
    }

    // دوال المساعدات العامة
    function handleFileSelect(file) {
        loadFileIntoEditor(file);
    }

    function loadFromUrlInput() {
        const input = document.getElementById('studio-url-input');
        const url = input ? input.value.trim() : '';
        if (!url) {
            alert('يرجى كتابة أو لصق رابط الصورة أولاً');
            return;
        }
        loadSourceUrlIntoEditor(url);
    }

    let activeFilterCat = 'all';
    let activeSearchQuery = '';

    function handleSearchInput(val) {
        activeSearchQuery = val;
        renderGalleryManagerGrid(activeFilterCat, activeSearchQuery);
    }

    function handleCategorySelect(val) {
        activeFilterCat = val;
        renderGalleryManagerGrid(activeFilterCat, activeSearchQuery);
    }

    // تشغيل التهيئة التلقائية عند تحميل السكربت
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }

    return {
        init,
        getImage,
        saveImage,
        removeImage,
        resetAllImages,
        exportImagesJSON,
        importImagesJSON,
        openModal,
        closeModal,
        openGalleryManagerModal,
        closeGalleryManagerModal,
        updateFitMode: updateFitModeButtonsUI,
        rotateImage90,
        setZoom,
        setBgColor,
        applyAndSave,
        resetCurrentExerciseImage,
        handleFileSelect,
        loadFromUrlInput,
        renderGalleryManagerGrid,
        handleSearchInput,
        handleCategorySelect
    };
})();
