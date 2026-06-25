let activeJointId = null, activeJointName = "";

function createPoints(points, containerId) {
    const container = document.getElementById(containerId);
    if (!container) return;
    container.querySelectorAll('.pain-point').forEach(p=>p.remove());
    for(const[id,data] of Object.entries(points)) {
        const point = document.createElement('div');
        point.className = 'pain-point';
        point.setAttribute('data-joint', id);
        point.setAttribute('data-name', data.name);
        point.style.top = data.top;
        point.style.left = data.left;
        const tooltip = document.createElement('span');
        tooltip.className = 'tooltip-text';
        tooltip.innerText = data.name;
        point.appendChild(tooltip);
        point.addEventListener('click', () => selectRegion(point));
        container.appendChild(point);
    }
}

function renderQuestions(jointId) {
    const container = document.getElementById('dynamic-questions');
    if (!container) return;
    const qSet = getQuestionsForRegion(jointId);
    if (!qSet) { container.innerHTML = '<div class="dynamic-question-box"><p>سيتم إضافة أسئلة تفصيلية لهذه المنطقة قريباً.</p></div>'; return; }
    
    // حساب عدد الأسئلة
    const totalQuestions = qSet.fields.length;
    let html = `<div class="dynamic-question-box">
        <p>📋 ${qSet.title}</p>
        <div style="margin-bottom: 15px; background: #1e2633; border-radius: 8px; padding: 10px;">
            <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 5px;">
                <span style="color: #9ca3af; font-size: 0.9em;">تقدم الأسئلة</span>
                <span style="color: var(--primary-gold); font-weight: bold; font-size: 0.9em;">0 / ${totalQuestions}</span>
            </div>
            <div style="background: #374151; height: 8px; border-radius: 4px; overflow: hidden;">
                <div id="questions-progress-bar" style="background: var(--primary-gold); height: 100%; width: 0%; transition: width 0.3s;"></div>
            </div>
        </div>
    `;
    
    let questionIndex = 0;
    qSet.fields.forEach(f => {
        questionIndex++;
        // التحقق من الشرط إذا وجد
        if (f.conditional) {
            const conditionalField = document.querySelector(`select[name="${f.conditional.field}"]`);
            if (conditionalField && conditionalField.value) {
                if (!f.conditional.values.includes(conditionalField.value)) {
                    return; // تخطي هذا السؤال إذا لم يتحقق الشرط
                }
            }
        }
        
        html += `<div class="form-group conditional-question" data-name="${f.name}" data-index="${questionIndex}"`;
        if (f.conditional) {
            html += ` data-conditional-field="${f.conditional.field}" data-conditional-values="${f.conditional.values.join(',')}" style="display:none;"`;
        }
        html += `><label class="form-label">${f.label}</label>`;
        
        if (f.type === 'checkbox') {
            f.options.forEach(opt => html += `<label class="checkbox-label"><input type="checkbox" name="${f.name}" value="${opt}" onchange="updateQuestionsProgress()"> ${opt}</label>`);
        } else if (f.type === 'textarea') {
            html += `<textarea class="form-textarea" name="${f.name}" rows="3" placeholder="${f.placeholder || ''}" onchange="updateQuestionsProgress()"></textarea>`;
        } else {
            html += `<select class="form-select" name="${f.name}" onchange="checkConditionalQuestions(); updateQuestionsProgress()"><option value="">-- اختر --</option>`;
            f.options.forEach(opt => html += `<option value="${opt}">${opt}</option>`);
            html += `</select>`;
        }
        html += `</div>`;
    });
    
    html += `</div>`;
    container.innerHTML = html;
    
    // إظهار الأسئلة المشروطة التي لا تعتمد على أسئلة أخرى
    qSet.fields.forEach(f => {
        if (!f.conditional) {
            const questionDiv = container.querySelector(`[data-name="${f.name}"]`);
            if (questionDiv) questionDiv.style.display = 'block';
        }
    });
    
    // تحديث التقدم الأولي
    updateQuestionsProgress();
}

function checkConditionalQuestions() {
    const container = document.getElementById('dynamic-questions');
    if (!container) return;
    
    const allQuestions = container.querySelectorAll('.conditional-question');
    allQuestions.forEach(question => {
        const conditionalField = question.getAttribute('data-conditional-field');
        const conditionalValuesAttr = question.getAttribute('data-conditional-values');
        const conditionalValues = conditionalValuesAttr ? conditionalValuesAttr.split(',') : [];
        
        if (conditionalField) {
            // دعم أنواع مختلفة من الحقول كشروط (select, checkbox, textarea)
            const selectElement = container.querySelector(`select[name="${conditionalField}"]`);
            const checkboxElement = container.querySelector(`input[type="checkbox"][name="${conditionalField}"]`);
            const textareaElement = container.querySelector(`textarea[name="${conditionalField}"]`);
            
            let conditionMet = false;
            let fieldValue = null;
            
            // التحقق من select
            if (selectElement && selectElement.value) {
                fieldValue = selectElement.value;
                conditionMet = conditionalValues.includes(fieldValue);
            }
            // التحقق من checkbox
            else if (checkboxElement) {
                fieldValue = checkboxElement.checked ? 'true' : 'false';
                conditionMet = conditionalValues.includes(fieldValue);
            }
            // التحقق من textarea
            else if (textareaElement && textareaElement.value.trim()) {
                fieldValue = textareaElement.value.trim();
                // للـ textarea، نتحقق من وجود النص إذا كانت القيمة المشروطة 'any'
                conditionMet = conditionalValues.includes('any') || conditionalValues.includes(fieldValue);
            }
            
            if (conditionMet) {
                question.style.display = 'block';
            } else {
                question.style.display = 'none';
                // إعادة تعيين جميع الحقول في السؤال المخفي
                const questionSelect = question.querySelector('select');
                if (questionSelect) questionSelect.value = '';
                
                const questionTextarea = question.querySelector('textarea');
                if (questionTextarea) questionTextarea.value = '';
                
                const questionCheckboxes = question.querySelectorAll('input[type="checkbox"]');
                questionCheckboxes.forEach(cb => cb.checked = false);
            }
        }
    });
    
    // تحديث التقدم بعد تغيير الأسئلة المشروطة
    updateQuestionsProgress();
}

// تحديث تقدم الأسئلة
function updateQuestionsProgress() {
    const container = document.getElementById('dynamic-questions');
    if (!container) return;
    
    const allQuestions = container.querySelectorAll('.conditional-question');
    const visibleQuestions = Array.from(allQuestions).filter(q => q.style.display !== 'none');
    
    let answeredCount = 0;
    visibleQuestions.forEach(question => {
        const select = question.querySelector('select');
        const textarea = question.querySelector('textarea');
        const checkboxes = question.querySelectorAll('input[type="checkbox"]');
        
        if (select && select.value) {
            answeredCount++;
        } else if (textarea && textarea.value.trim()) {
            answeredCount++;
        } else if (checkboxes.length > 0) {
            const checked = Array.from(checkboxes).some(cb => cb.checked);
            if (checked) answeredCount++;
        }
    });
    
    const progressBar = document.getElementById('questions-progress-bar');
    const progressText = container.querySelector('.dynamic-question-box span[style*="var(--primary-gold)"]');
    
    if (progressBar && progressText) {
        const total = visibleQuestions.length;
        const percentage = total > 0 ? (answeredCount / total) * 100 : 0;
        progressBar.style.width = `${percentage}%`;
        progressText.textContent = `${answeredCount} / ${total}`;
        
        // تحديث مؤشر الخطوة 3 عند إكمال جميع الأسئلة
        if (answeredCount === total && total > 0) {
            updateStepIndicator(3);
        }
    }
}

function selectRegion(point) {
    document.querySelectorAll('.pain-point').forEach(p=>p.classList.remove('selected'));
    point.classList.add('selected');
    activeJointId = point.getAttribute('data-joint');
    activeJointName = point.getAttribute('data-name');
    document.getElementById('selected-status').innerHTML = `✓ تم اختيار: ${activeJointName} - الآن أدخل بياناتك الشخصية`;
    document.getElementById('selected-status').classList.add('selected-active');
    document.getElementById('welcome-box').style.display = 'none';
    document.getElementById('diagnostic-card').style.display = 'block';
    document.getElementById('region-title').innerHTML = `تشخيص ${activeJointName}`;
    renderQuestions(activeJointId);
    document.getElementById('progress-fill').style.width = "25%";
    
    // تحديث مؤشرات الخطوات
    updateStepIndicator(2);
    
    // إظهار رسالة توجيهية
    const diagnosticCard = document.getElementById('diagnostic-card');
    const existingMessage = diagnosticCard.querySelector('.step-guidance');
    if (existingMessage) existingMessage.remove();
    
    const guidanceMessage = document.createElement('div');
    guidanceMessage.className = 'step-guidance';
    guidanceMessage.style.cssText = 'background: linear-gradient(135deg, #10b981 0%, #059669 100%); padding: 15px; border-radius: 8px; margin-bottom: 20px; text-align: center;';
    guidanceMessage.innerHTML = `
        <div style="color: white; font-weight: bold; margin-bottom: 5px;">✨ الخطوة التالية</div>
        <div style="color: white; font-size: 0.9em;">أدخل بياناتك الشخصية (العمر، الجنس، الوزن، الطول) ثم أجب عن الأسئلة</div>
    `;
    diagnosticCard.insertBefore(guidanceMessage, diagnosticCard.firstChild);
    
    saveState();
}

function switchView(view) {
    if(view==='front') {
        document.getElementById('front-container').style.display='block';
        document.getElementById('back-container').style.display='none';
        document.getElementById('btn-front').classList.add('active');
        document.getElementById('btn-back').classList.remove('active');
    } else {
        document.getElementById('front-container').style.display='none';
        document.getElementById('back-container').style.display='block';
        document.getElementById('btn-back').classList.add('active');
        document.getElementById('btn-front').classList.remove('active');
    }
    document.querySelectorAll('.pain-point').forEach(p=>p.classList.remove('selected'));
    activeJointId=null;
    document.getElementById('diagnostic-card').style.display='none';
    document.getElementById('welcome-box').style.display='block';
    document.getElementById('report-section').style.display='none';
    document.getElementById('selected-status').innerHTML="🔍 اضغط على نقطة الألم";
    document.getElementById('selected-status').classList.remove('selected-active');
    
    // إعادة تعيين مؤشرات الخطوات
    updateStepIndicator(1);
    
    saveState();
}

function saveState() {
    const state = {
        activeJointId, activeJointName,
        patientName: document.getElementById('patient-name')?.value || '',
        patientPhone: document.getElementById('patient-phone')?.value || '',
        age: document.getElementById('age')?.value || '',
        gender: document.getElementById('gender')?.value || '',
        weight: document.getElementById('weight')?.value || '',
        height: document.getElementById('height')?.value || '',
        severity: document.getElementById('severity')?.value || '',
        duration: document.getElementById('duration')?.value || '',
        // حفظ إجابات الأسئلة الديناميكية
        dynamicAnswers: {}
    };
    
    // جمع إجابات الأسئلة الديناميكية
    const container = document.getElementById('dynamic-questions');
    if (container) {
        const selects = container.querySelectorAll('select');
        selects.forEach(select => {
            if (select.value) {
                state.dynamicAnswers[select.name] = select.value;
            }
        });
        
        const textareas = container.querySelectorAll('textarea');
        textareas.forEach(textarea => {
            if (textarea.value.trim()) {
                state.dynamicAnswers[textarea.name] = textarea.value.trim();
            }
        });
        
        const checkboxes = container.querySelectorAll('input[type="checkbox"]');
        checkboxes.forEach(checkbox => {
            if (checkbox.checked) {
                if (!state.dynamicAnswers[checkbox.name]) {
                    state.dynamicAnswers[checkbox.name] = [];
                }
                state.dynamicAnswers[checkbox.name].push(checkbox.value);
            }
        });
    }
    
    localStorage.setItem('smartProState', JSON.stringify(state));
}

function loadState() {
    const saved = localStorage.getItem('smartProState');
    if(!saved) return;
    try{
        const s = JSON.parse(saved);
        if(s.activeJointId) {
            setTimeout(()=>{
                const point = document.querySelector(`.pain-point[data-joint="${s.activeJointId}"]`);
                if(point) selectRegion(point);
            },200);
            document.getElementById('patient-name').value = s.patientName||'';
            document.getElementById('patient-phone').value = s.patientPhone||'';
            document.getElementById('age').value = s.age||'';
            document.getElementById('gender').value = s.gender||'';
            document.getElementById('weight').value = s.weight||'';
            document.getElementById('height').value = s.height||'';
            document.getElementById('severity').value = s.severity||5;
            document.getElementById('severity-value').innerText = s.severity||5;
            document.getElementById('duration').value = s.duration||'acute';
            
            // تحميل إجابات الأسئلة الديناميكية بعد تأخير إضافي لضمان تحميل الأسئلة
            setTimeout(() => {
                if (s.dynamicAnswers) {
                    const container = document.getElementById('dynamic-questions');
                    if (container) {
                        // تحميل قيم select
                        Object.keys(s.dynamicAnswers).forEach(name => {
                            const value = s.dynamicAnswers[name];
                            if (Array.isArray(value)) {
                                // checkbox values
                                value.forEach(val => {
                                    const checkbox = container.querySelector(`input[type="checkbox"][name="${name}"][value="${val}"]`);
                                    if (checkbox) checkbox.checked = true;
                                });
                            } else {
                                // select or textarea value
                                const select = container.querySelector(`select[name="${name}"]`);
                                if (select) {
                                    select.value = value;
                                } else {
                                    const textarea = container.querySelector(`textarea[name="${name}"]`);
                                    if (textarea) {
                                        textarea.value = value;
                                    }
                                }
                            }
                        });
                        
                        // تحديث الأسئلة المشروطة بعد تحميل القيم
                        checkConditionalQuestions();
                        updateQuestionsProgress();
                    }
                }
            }, 500);
        }
    } catch(e){}
}

function resetAll() { if(confirm("إعادة تعيين كل البيانات؟")){ localStorage.removeItem('smartProState'); location.reload(); } }
function printOrSaveAsPDF() { window.print(); }

// تحديث مؤشرات الخطوات
function updateStepIndicator(step) {
    // إعادة تعيين جميع الخطوات
    for (let i = 1; i <= 3; i++) {
        const stepEl = document.getElementById(`step-${i}`);
        if (stepEl) {
            stepEl.style.background = '#374151';
            stepEl.style.color = '#9ca3af';
            stepEl.classList.remove('active');
        }
    }
    
    // تفعيل الخطوة الحالية والسابقة
    for (let i = 1; i <= step; i++) {
        const stepEl = document.getElementById(`step-${i}`);
        if (stepEl) {
            stepEl.style.background = 'var(--primary-gold)';
            stepEl.style.color = 'black';
            if (i === step) {
                stepEl.classList.add('active');
            }
        }
    }
}

window.createPoints = createPoints;
window.selectRegion = selectRegion;
window.renderQuestions = renderQuestions;
window.checkConditionalQuestions = checkConditionalQuestions;
window.updateQuestionsProgress = updateQuestionsProgress;
window.switchView = switchView;
window.saveState = saveState;
window.loadState = loadState;
window.resetAll = resetAll;
window.printOrSaveAsPDF = printOrSaveAsPDF;
window.updateStepIndicator = updateStepIndicator;