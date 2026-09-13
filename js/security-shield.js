/**
 * =================================================================================
 * 🛡️ SMART CHECK PRO - ADVANCED CYBER DEFENSE & ANTI-TAMPER SECURITY SHIELD
 * منظومة الأمان المتقدمة وحماية الملكية الفكرية وقفل النطاق
 * Developed for: smartchecktools.com | وداعاً للألم - د. جمال قبيعة
 * =================================================================================
 */

(function () {
    'use strict';

    // 1. قائمة النطاقات المعتمدة والمصرح لها بتشغيل المنظومة (Authorized Domains)
    const AUTHORIZED_DOMAINS = [
        'smartchecktools.com',
        'www.smartchecktools.com',
        'ghfer8088-beep.github.io',
        'localhost',
        '127.0.0.1',
        '[::1]',
        '' // للتشغيل المحلي عبر بروتوكول file://
    ];

    // 2. فحص قفل النطاق المشفر (Domain Lock Guard)
    function verifyDomainIntegrity() {
        // يسمح بالتشغيل عبر جميع النطاقات وعناوين الشبكة المحلية (Local IP / WiFi) والهواتف الذكية بسلاسة تامة
        return true;
    }

    // 3. منع أدوات المطورين والتفتيش (Anti-DevTools & Anti-Inspection Traps)
    function activateAntiInspectionShield() {
        // تعطيل النقر الأيمن لمنع خيارات Inspect Element و View Source
        document.addEventListener('contextmenu', function (e) {
            // السماح فقط في حقول الإدخال إذا لزم الأمر
            if (e.target.tagName !== 'INPUT' && e.target.tagName !== 'TEXTAREA') {
                e.preventDefault();
                return false;
            }
        }, { capture: true });

        // تعطيل اختصارات لوحة المفاتيح التفتيشية
        window.addEventListener('keydown', function (e) {
            const keyCode = e.keyCode || e.which;
            const isCtrl = e.ctrlKey || e.metaKey;
            const isShift = e.shiftKey;

            // F12
            if (keyCode === 123) {
                e.preventDefault();
                e.stopPropagation();
                return false;
            }

            // Ctrl+Shift+I (DevTools), Ctrl+Shift+J (Console), Ctrl+Shift+C (Inspect)
            if (isCtrl && isShift && (keyCode === 73 || keyCode === 74 || keyCode === 67)) {
                e.preventDefault();
                e.stopPropagation();
                return false;
            }

            // Ctrl+U (View Page Source)
            if (isCtrl && keyCode === 85) {
                e.preventDefault();
                e.stopPropagation();
                return false;
            }

            // Ctrl+S (Save Page)
            if (isCtrl && keyCode === 83) {
                e.preventDefault();
                e.stopPropagation();
                return false;
            }
        }, { capture: true });
    }

    // 4. حماية وتطهير الـ Console في بيئة الإنتاج (Console Shield)
    function sanitizeConsoleOutput() {
        const isProduction = window.location.hostname === 'smartchecktools.com' || window.location.hostname === 'www.smartchecktools.com';
        if (isProduction) {
            const noop = function () {};
            // تحييد دوال الاستعراض لمنع التلصص على خوارزميات العمليات
            window.console.log = noop;
            window.console.info = noop;
            window.console.dir = noop;
            window.console.table = noop;
        }

        // إشعار أمني دائم عند محاولة فتح الكونسول
        try {
            const styleTitle = 'color: #d4af37; font-size: 22px; font-weight: bold; text-shadow: 1px 1px 2px #000;';
            const styleDesc = 'color: #ef4444; font-size: 14px; font-weight: bold;';
            console.warn('%c🛡️ Smart Check Pro Security System', styleTitle);
            console.warn('%c⚠️ تنبيه أمني: هذه المنظومة محمية برمجياً وقانونياً. أي محاولة للهندسة العكسية أو فحص الأكواد غير مصرح بها.', styleDesc);
        } catch (e) {}
    }

    // 5. كشف فتح أدوات المطور (DevTools Detection Trap)
    function initDevToolsTrap() {
        // ✅ تعطيل الفخ على الهواتف والأجهزة اللمسية لتجنب إطلاق خاطئ عند تمدد واجهات Safari/iOS
        const isMobileDevice = /iPhone|iPad|iPod|Android/i.test(navigator.userAgent) || ('ontouchstart' in window);
        if (isMobileDevice) return;

        let devtoolsOpen = false;
        const threshold = 160;

        setInterval(function () {
            const widthThreshold = window.outerWidth - window.innerWidth > threshold;
            const heightThreshold = window.outerHeight - window.innerHeight > threshold;
            
            if (widthThreshold || heightThreshold) {
                if (!devtoolsOpen) {
                    devtoolsOpen = true;
                    // تفعيل فخ مصيدة مصحح الأخطاء (Debugger Loop) في حال كان في الإنتاج
                    if (window.location.hostname === 'smartchecktools.com' || window.location.hostname === 'www.smartchecktools.com') {
                        try {
                            const antiDebug = function () {
                                (function () {
                                    return false;
                                }['constructor']('debugger')());
                            };
                            antiDebug();
                        } catch (err) {}
                    }
                }
            } else {
                devtoolsOpen = false;
            }
        }, 1500);
    }

    // 6. منع سرقة المحتوى وتحديد النصوص السريرية غير الضرورية (Content Theft Defense)
    function protectClinicalContent() {
        const style = document.createElement('style');
        style.type = 'text/css';
        style.innerHTML = `
            /* منع السحب والتحديد على الأزرار والشعارات والمحتوى السريري */
            body, .clinical-card, .stepper-wrap, .banner, .report-summary-box, .btn {
                -webkit-user-select: none;
                -moz-user-select: none;
                -ms-user-select: none;
                user-select: none;
                -webkit-touch-callout: none;
            }
            /* السماح الكامل للمستخدم بالكتابة والتعديل داخل حقول الإدخال */
            input, textarea, select, [contenteditable="true"] {
                -webkit-user-select: text !important;
                -moz-user-select: text !important;
                -ms-user-select: text !important;
                user-select: text !important;
            }
            /* منع سحب وإفلات الصور الحساسة */
            img {
                -webkit-user-drag: none;
                user-drag: none;
                pointer-events: auto;
            }
        `;
        document.head.appendChild(style);
    }

    // 7. الحماية من الاختطاف داخل إطارات خارجية (Anti-Clickjacking / Frame Buster)
    function enforceTopWindow() {
        try {
            if (window.top && window.top !== window.self) {
                try {
                    // إذا كان من نفس النطاق، يوجه للنافذة الرئيسية
                    if (window.top.location.hostname === window.location.hostname) {
                        window.top.location = window.self.location.href;
                    }
                } catch (crossOriginErr) {
                    // متصفحات التطبيقات (مثل واتساب/تيليجرام/سفاري بريفيو) تعمل داخل Webview/iframe خارجي
                    // ✅ تم منع إخفاء body نهائياً لتفادي مشكلة الشاشة البيضاء على هواتف الآيفون
                    console.info('[Security] Embedded Webview/Frame detected, continuing execution.');
                }
            }
        } catch (e) {
            // لا يتم حظر أو إخفاء الصفحة مطلقاً لتجنب الشاشة البيضاء
        }
    }

    // 8. تشغيل جميع دروع الحماية بالترتيب الفوري
    verifyDomainIntegrity();
    activateAntiInspectionShield();
    sanitizeConsoleOutput();
    enforceTopWindow();

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', function () {
            protectClinicalContent();
            initDevToolsTrap();
        });
    } else {
        protectClinicalContent();
        initDevToolsTrap();
    }

    // تصدير واجهة آمنة ومجمدة لمنع العبث بها
    window.SmartSecurityShield = Object.freeze({
        isLocked: true,
        version: '2.0.0-PROD',
        domain: 'smartchecktools.com'
    });

})();
