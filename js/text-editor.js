// ==========================================================================
// أداة تعديل النصوص والكلمات الداخلية - عيادة وداعاً للألم
// Smart In-App Text Editor & Instant Replacer
// ==========================================================================

(function() {
    'use strict';

    const STORAGE_KEY = 'smart_check_text_replacements';
    let isLiveEditActive = false;
    let observer = null;
    let isReplacing = false;

    // جلب قائمة الاستبدالات المخزنة
    function getStoredReplacements() {
        try {
            const data = localStorage.getItem(STORAGE_KEY);
            return data ? JSON.parse(data) : [];
        } catch (e) {
            console.error('Error reading replacements:', e);
            return [];
        }
    }

    // حفظ قائمة الاستبدالات
    function saveStoredReplacements(replacements) {
        try {
            localStorage.setItem(STORAGE_KEY, JSON.stringify(replacements));
        } catch (e) {
            console.error('Error saving replacements:', e);
        }
    }

    // تطبيق جميع الاستبدالات على عقد النصوص في الصفحة
    function applyReplacementsToNode(rootNode) {
        const rules = getStoredReplacements();
        if (!rules || rules.length === 0) return 0;

        let totalReplacements = 0;
        isReplacing = true;

        function walk(node) {
            if (node.nodeType === Node.TEXT_NODE) {
                let text = node.nodeValue;
                let changed = false;

                rules.forEach(rule => {
                    if (rule.from && rule.to !== undefined && text.includes(rule.from)) {
                        // استبدال آمن لجميع التكرارات
                        const regex = new RegExp(escapeRegex(rule.from), 'g');
                        const count = (text.match(regex) || []).length;
                        if (count > 0) {
                            text = text.replace(regex, rule.to);
                            changed = true;
                            totalReplacements += count;
                        }
                    }
                });

                if (changed) {
                    node.nodeValue = text;
                }
            } else if (node.nodeType === Node.ELEMENT_NODE) {
                // تجاوز السكربتات والأنماط وحقول الإدخال والنافذة المنبثقة للأداة
                const tag = node.tagName.toLowerCase();
                if (['script', 'style', 'textarea', 'input', 'select'].includes(tag)) return;
                if (node.id === 'text-editor-modal' || node.id === 'live-edit-banner' || node.classList.contains('no-text-replace')) return;

                const children = Array.from(node.childNodes);
                for (let i = 0; i < children.length; i++) {
                    walk(children[i]);
                }
            }
        }

        walk(rootNode || document.body);
        isReplacing = false;
        return totalReplacements;
    }

    function escapeRegex(string) {
        return string.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    }

    // مراقبة أي تحديث في الصفحة (مثل الانتقال بين الخطوات) لتطبيق التعديلات عليها تلقائياً
    function setupDOMObserver() {
        let debounceTimer = null;
        observer = new MutationObserver(mutations => {
            if (isReplacing || isLiveEditActive) return;

            let shouldRun = false;
            for (let mutation of mutations) {
                if (mutation.target && (mutation.target.id === 'text-editor-modal' || mutation.target.id === 'live-edit-banner')) {
                    continue;
                }
                if (mutation.addedNodes.length > 0) {
                    shouldRun = true;
                    break;
                }
            }

            if (shouldRun) {
                clearTimeout(debounceTimer);
                debounceTimer = setTimeout(() => {
                    applyReplacementsToNode(document.body);
                }, 150);
            }
        });

        observer.observe(document.body, {
            childList: true,
            subtree: true
        });
    }

    // استبدال كلمة وحفظها
    window.executeWordReplacement = function() {
        const fromInput = document.getElementById('editor-from-text');
        const toInput = document.getElementById('editor-to-text');

        const fromText = fromInput ? fromInput.value.trim() : '';
        const toText = toInput ? toInput.value.trim() : '';

        if (!fromText) {
            alert('يرجى كتابة الكلمة الحالية المراد تغييرها');
            return;
        }

        const rules = getStoredReplacements();
        // إزالة أي قاعدة سابقة لنفس الكلمة
        const filtered = rules.filter(r => r.from !== fromText);
        filtered.push({
            from: fromText,
            to: toText,
            timestamp: Date.now()
        });

        saveStoredReplacements(filtered);

        const count = applyReplacementsToNode(document.body);

        renderActiveRulesList();
        fromInput.value = '';
        toInput.value = '';

        const feedback = document.getElementById('editor-feedback-msg');
        if (feedback) {
            feedback.style.display = 'block';
            feedback.innerHTML = `✅ تم استبدال الكلمة في (${count}) موضع بنجاح وحفظها تلقائياً!`;
            setTimeout(() => {
                feedback.style.display = 'none';
            }, 4000);
        }

        if (typeof showToast === 'function') {
            showToast(`تم استبدال "${fromText}" بنجاح!`, 'success');
        }
    };

    // حذف قاعدة استبدال معينة
    window.deleteReplacementRule = function(fromText) {
        if (!confirm(`هل تريد حذف استبدال الكلمة "${fromText}" واستعادة الأصل؟`)) return;
        const rules = getStoredReplacements();
        const filtered = rules.filter(r => r.from !== fromText);
        saveStoredReplacements(filtered);
        renderActiveRulesList();
        window.location.reload();
    };

    // استعادة كافة النصوص الأصلية
    window.resetAllReplacements = function() {
        if (!confirm('هل أنت متأكد من رغبتك في حذف جميع التعديلات النصية والعودة للنصوص الأصلية للبرنامج؟')) return;
        localStorage.removeItem(STORAGE_KEY);
        window.location.reload();
    };

    // تفعيل أو تعطيل وضع التحرير المباشر (Visual Live Edit)
    window.toggleLiveVisualEditing = function() {
        isLiveEditActive = !isLiveEditActive;
        const banner = document.getElementById('live-edit-banner');
        const btnToggle = document.getElementById('btn-toggle-live-edit');

        if (isLiveEditActive) {
            document.body.contentEditable = 'true';
            
            // حماية أدوات التحكم من التعديل
            const modal = document.getElementById('text-editor-modal');
            const floatingBtn = document.getElementById('btn-open-text-editor');
            if (modal) modal.contentEditable = 'false';
            if (floatingBtn) floatingBtn.contentEditable = 'false';

            if (!banner) {
                createLiveEditBanner();
            } else {
                banner.style.display = 'flex';
            }

            if (btnToggle) {
                btnToggle.innerHTML = '🛑 إيقاف التعديل المباشر';
                btnToggle.style.background = '#ef4444';
            }

            closeTextEditorModal();
            if (typeof showToast === 'function') {
                showToast('✏️ وضع التعديل المباشر مفعّل الآن! انقر على أي كلمة على الشاشة لتعديلها', 'info');
            }
        } else {
            document.body.contentEditable = 'false';
            if (banner) banner.style.display = 'none';
            if (btnToggle) {
                btnToggle.innerHTML = '✏️ تفعيل التعديل بالنقر المباشر';
                btnToggle.style.background = '#3b82f6';
            }
            if (typeof showToast === 'function') {
                showToast('💾 تم إيقاف وضع التعديل المباشر', 'success');
            }
        }
    };

    function createLiveEditBanner() {
        const banner = document.createElement('div');
        banner.id = 'live-edit-banner';
        banner.className = 'no-print no-text-replace';
        banner.style.cssText = `
            position: fixed;
            top: 0;
            left: 0;
            right: 0;
            background: linear-gradient(90deg, #0f172a 0%, #064e3b 50%, #0f172a 100%);
            color: #fef08a;
            padding: 10px 16px;
            text-align: center;
            z-index: 999999;
            border-bottom: 2px solid #d4af37;
            box-shadow: 0 4px 20px rgba(0,0,0,0.85);
            font-weight: bold;
            display: flex;
            justify-content: center;
            align-items: center;
            gap: 14px;
            font-family: 'Cairo', sans-serif;
            font-size: 0.9em;
        `;
        banner.contentEditable = 'false';
        banner.innerHTML = `
            <span>✏️ وضع التعديل المباشر نَشِط الآن: انقر واكتب فوق أي نص على الشاشة بحرية!</span>
            <button type="button" onclick="toggleLiveVisualEditing()" style="background: #10b981; color: #ffffff; border: 1.5px solid #fef08a; padding: 5px 14px; border-radius: 6px; cursor: pointer; font-weight: bold; font-family: inherit;">
                💾 حفظ وإنهاء التعديل
            </button>
            <button type="button" onclick="openTextEditorModal()" style="background: rgba(212, 175, 55, 0.25); color: #fef08a; border: 1px solid #d4af37; padding: 5px 12px; border-radius: 6px; cursor: pointer; font-family: inherit;">
                ⚙️ نافذة الأداة
            </button>
        `;
        document.body.appendChild(banner);
    }

    // نسخ قائمة التعديلات لإرسالها للمساعد الذكي لاعتمادها نهائياً بالكود
    window.copyReplacementsToClipboard = function() {
        const rules = getStoredReplacements();
        if (rules.length === 0) {
            alert('لا توجد تعديلات محفوظة حالياً لنسخها.');
            return;
        }

        let output = `التعديلات النصية المطلوبة لـ «وداعاً للألم»:\n`;
        rules.forEach((r, idx) => {
            output += `${idx + 1}. استبدال الكلمة: "${r.from}"  👈  بالكلمة: "${r.to}"\n`;
        });

        navigator.clipboard.writeText(output).then(() => {
            if (typeof showToast === 'function') {
                showToast('📋 تم نسخ التعديلات بنجاح! الصقها هنا في المحادثة وسأثبتها لك فوراً', 'success');
            } else {
                alert('تم نسخ قائمة التعديلات للحافظة بنجاح! يمكنك لصقها وإرسالها للمساعد.');
            }
        }).catch(() => {
            alert('تعذر النسخ التلقائي، يمكنك تحديد النص ونسخه:\n\n' + output);
        });
    };

    // عرض قائمة القواعد النشطة في النافذة
    function renderActiveRulesList() {
        const listEl = document.getElementById('editor-active-rules-list');
        if (!listEl) return;

        const rules = getStoredReplacements();
        if (rules.length === 0) {
            listEl.innerHTML = '<div style="color: #94a3b8; font-size: 0.85em; text-align: center; padding: 8px;">لا توجد كلمات معدلة حالياً (النصوص الأصلية تعمل بالكامل).</div>';
            return;
        }

        let html = '<div style="display: flex; flex-direction: column; gap: 6px;">';
        rules.forEach(rule => {
            html += `
                <div style="display: flex; justify-content: space-between; align-items: center; background: rgba(15, 23, 42, 0.7); border: 1px solid rgba(212, 175, 55, 0.3); border-radius: 8px; padding: 6px 12px; font-size: 0.85em;">
                    <div style="display: flex; align-items: center; gap: 8px;">
                        <span style="color: #ef4444; text-decoration: line-through;">${escapeHtml(rule.from)}</span>
                        <span style="color: #d4af37;">➔</span>
                        <span style="color: #10b981; font-weight: bold;">${escapeHtml(rule.to)}</span>
                    </div>
                    <button type="button" onclick="deleteReplacementRule('${escapeJs(rule.from)}')" title="حذف واستعادة الأصل" style="background: rgba(239, 68, 68, 0.2); border: 1px solid #ef4444; color: #fca5a5; width: 24px; height: 24px; border-radius: 50%; cursor: pointer; display: flex; align-items: center; justify-content: center; font-size: 0.8em;">✕</button>
                </div>
            `;
        });
        html += '</div>';
        listEl.innerHTML = html;
    }

    function escapeHtml(text) {
        if (!text) return '';
        return text.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");
    }

    function escapeJs(text) {
        if (!text) return '';
        return text.replace(/'/g, "\\'");
    }

    // بناء واجهة النافذة المنبثقة والزر العائم
    function injectEditorUI() {
        if (document.getElementById('text-editor-modal')) return;

        // الزر العائم في الزاوية السفلى (اليمين) - يظهر حصراً لحساب الأدمن والمدير العام
        const isAdmin = (typeof isUserAdmin === 'function' && isUserAdmin());
        if (isAdmin) {
            const floatingBtn = document.createElement('button');
            floatingBtn.id = 'btn-open-text-editor';
            floatingBtn.className = 'no-print no-text-replace';
            floatingBtn.type = 'button';
            floatingBtn.title = 'أداة تعديل النصوص السريعة (وداعاً للألم)';
            floatingBtn.onclick = window.openTextEditorModal;
            floatingBtn.style.cssText = `
                position: fixed;
                bottom: 22px;
                right: 22px;
                z-index: 998;
                background: linear-gradient(135deg, #0f172a 0%, #064e3b 100%);
                border: 1.8px solid var(--primary-gold);
                color: #fef08a;
                padding: 8px 16px;
                border-radius: 30px;
                font-family: 'Cairo', sans-serif;
                font-size: 0.88em;
                font-weight: 800;
                display: flex;
                align-items: center;
                gap: 8px;
                box-shadow: 0 6px 20px rgba(0,0,0,0.65), 0 0 12px rgba(212, 175, 55, 0.35);
                cursor: pointer;
                transition: transform 0.2s ease, box-shadow 0.2s ease;
            `;
            floatingBtn.onmouseover = () => floatingBtn.style.transform = 'scale(1.05)';
            floatingBtn.onmouseout = () => floatingBtn.style.transform = 'scale(1)';
            floatingBtn.innerHTML = `<span>✏️ تعديل النصوص</span>`;
            document.body.appendChild(floatingBtn);
        }

        // نافذة المحرر المنبثقة
        const modal = document.createElement('div');
        modal.id = 'text-editor-modal';
        modal.className = 'no-print no-text-replace';
        modal.style.cssText = `
            display: none;
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background: rgba(0, 0, 0, 0.75);
            backdrop-filter: blur(4px);
            z-index: 100000;
            align-items: center;
            justify-content: center;
            padding: 16px;
            box-sizing: border-box;
            font-family: 'Cairo', sans-serif;
        `;

        modal.innerHTML = `
            <div style="background: linear-gradient(135deg, #0b1322 0%, #17253d 100%); border: 2px solid var(--primary-gold); border-radius: 16px; width: 100%; max-width: 540px; box-shadow: 0 15px 40px rgba(0,0,0,0.9); overflow: hidden; display: flex; flex-direction: column; max-height: 90vh;">
                <!-- رأس النافذة -->
                <div style="display: flex; justify-content: space-between; align-items: center; padding: 14px 20px; border-bottom: 1px solid rgba(212, 175, 55, 0.3); background: rgba(15, 23, 42, 0.8);">
                    <div style="display: flex; align-items: center; gap: 8px;">
                        <span style="font-size: 1.3em;">✏️</span>
                        <h3 style="margin: 0; color: #fef08a; font-size: 1.1em; font-weight: 800;">أداة تعديل النصوص السريعة</h3>
                    </div>
                    <button type="button" onclick="closeTextEditorModal()" style="background: none; border: none; color: #94a3b8; font-size: 1.3em; cursor: pointer; padding: 4px;" title="إغلاق">✕</button>
                </div>

                <!-- جسم النافذة -->
                <div style="padding: 18px 20px; overflow-y: auto; display: flex; flex-direction: column; gap: 16px;">
                    <!-- رسالة التأكيد -->
                    <div id="editor-feedback-msg" style="display: none; background: rgba(16, 185, 129, 0.2); border: 1px solid #10b981; color: #6ee7b7; padding: 8px 12px; border-radius: 8px; font-size: 0.85em; text-align: center; font-weight: bold;"></div>

                    <!-- القسم الأول: استبدال الكلمات -->
                    <div style="background: rgba(15, 23, 42, 0.65); border: 1px solid rgba(212, 175, 55, 0.25); border-radius: 10px; padding: 14px;">
                        <h4 style="margin: 0 0 10px 0; color: #38bdf8; font-size: 0.95em; font-weight: 800; display: flex; align-items: center; gap: 6px;">
                            <span>🔄</span> استبدال كلمة أو عبارة في كامل التطبيق:
                        </h4>
                        <div style="display: flex; flex-direction: column; gap: 10px;">
                            <div>
                                <label style="display: block; color: #cbd5e1; font-size: 0.8em; margin-bottom: 4px; font-weight: 600;">الكلمة الحالية (التي تريد تغييرها):</label>
                                <input type="text" id="editor-from-text" placeholder="مثال: التقويم اليدوي" style="width: 100%; background: #080c14; border: 1px solid rgba(212, 175, 55, 0.4); color: #fff; padding: 8px 12px; border-radius: 8px; font-family: inherit; font-size: 0.9em; box-sizing: border-box;">
                            </div>
                            <div>
                                <label style="display: block; color: #cbd5e1; font-size: 0.8em; margin-bottom: 4px; font-weight: 600;">الكلمة الجديدة (البديلة):</label>
                                <input type="text" id="editor-to-text" placeholder="مثال: الكايروبراكتيك" style="width: 100%; background: #080c14; border: 1px solid rgba(212, 175, 55, 0.4); color: #fff; padding: 8px 12px; border-radius: 8px; font-family: inherit; font-size: 0.9em; box-sizing: border-box;">
                            </div>
                            <button type="button" onclick="executeWordReplacement()" style="background: linear-gradient(135deg, #10b981 0%, #059669 100%); border: 1px solid #34d399; color: #fff; padding: 9px; border-radius: 8px; font-family: inherit; font-size: 0.92em; font-weight: bold; cursor: pointer; box-shadow: 0 2px 8px rgba(16, 185, 129, 0.3); margin-top: 4px;">
                                ⚡ استبدال في كامل الصفحة وحفظ التعديل
                            </button>
                        </div>
                    </div>

                    <!-- القسم الثاني: وضع التحرير المباشر بالنقر -->
                    <div style="background: rgba(15, 23, 42, 0.65); border: 1px solid rgba(56, 189, 248, 0.25); border-radius: 10px; padding: 14px;">
                        <h4 style="margin: 0 0 6px 0; color: #fef08a; font-size: 0.95em; font-weight: 800; display: flex; align-items: center; gap: 6px;">
                            <span>✍️</span> وضع التحرير المرئي المباشر (مثل Word):
                        </h4>
                        <p style="margin: 0 0 10px 0; color: #94a3b8; font-size: 0.82em; line-height: 1.5;">
                            عند تفعيل هذا الوضع، تصبح كامل الشاشة قابلة للكتابة، يمكنك النقر على أي عنوان أو نص وتعديله مباشرة لتجربة مظهره.
                        </p>
                        <button type="button" id="btn-toggle-live-edit" onclick="toggleLiveVisualEditing()" style="background: #2563eb; border: 1px solid #60a5fa; color: #fff; padding: 8px 14px; border-radius: 8px; font-family: inherit; font-size: 0.88em; font-weight: bold; cursor: pointer; width: 100%;">
                            ✏️ تفعيل التعديل بالنقر المباشر
                        </button>
                    </div>

                    <!-- القسم الثالث: قائمة الكلمات المعدلة حالياً -->
                    <div style="background: rgba(15, 23, 42, 0.65); border: 1px solid rgba(212, 175, 55, 0.25); border-radius: 10px; padding: 14px;">
                        <h4 style="margin: 0 0 8px 0; color: #cbd5e1; font-size: 0.9em; font-weight: 700;">
                            📋 الكلمات المعدلة المحفوظة في التطبيق:
                        </h4>
                        <div id="editor-active-rules-list"></div>
                    </div>
                </div>

                <!-- تذييل النافذة: أزرار التصدير والإغلاق -->
                <div style="display: flex; justify-content: space-between; align-items: center; flex-wrap: wrap; gap: 10px; padding: 12px 20px; border-top: 1px solid rgba(212, 175, 55, 0.3); background: rgba(15, 23, 42, 0.9);">
                    <button type="button" onclick="copyReplacementsToClipboard()" style="background: linear-gradient(135deg, rgba(212, 175, 55, 0.3) 0%, rgba(16, 185, 129, 0.3) 100%); border: 1px solid var(--primary-gold); color: #fef08a; padding: 7px 14px; border-radius: 8px; font-family: inherit; font-size: 0.85em; font-weight: bold; cursor: pointer;">
                        📋 نسخ التعديلات لإرسالها للمساعد
                    </button>
                    <button type="button" onclick="resetAllReplacements()" style="background: rgba(239, 68, 68, 0.2); border: 1px solid #ef4444; color: #fca5a5; padding: 7px 12px; border-radius: 8px; font-family: inherit; font-size: 0.82em; cursor: pointer;">
                        🔄 استعادة النصوص الأصلية
                    </button>
                </div>
            </div>
        `;

        document.body.appendChild(modal);

        modal.addEventListener('click', (e) => {
            if (e.target === modal) {
                closeTextEditorModal();
            }
        });
    }

    window.openTextEditorModal = function() {
        const modal = document.getElementById('text-editor-modal');
        if (modal) {
            renderActiveRulesList();
            modal.style.display = 'flex';
        }
    };

    window.closeTextEditorModal = function() {
        const modal = document.getElementById('text-editor-modal');
        if (modal) {
            modal.style.display = 'none';
        }
    };

    // التشغيل التلقائي عند اكتمال تحميل الصفحة
    function init() {
        injectEditorUI();
        applyReplacementsToNode(document.body);
        setupDOMObserver();
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }

})();
