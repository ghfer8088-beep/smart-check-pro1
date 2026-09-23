// ==========================================================================
// Service Worker - وداعاً للألم (Smart Check Pro 2.0 PWA)
// استراتيجية Network-First لضمان وصول المريض لأحدث التحديثات فوراً
// ==========================================================================

const CACHE_NAME = 'wada3an-alam-v30.02';
const STATIC_ASSETS = [
    './',
    './index.html',
    './js/clinic-patients-data.js',
    './css/style.css',
    './manifest.json',
    './assets/logo.png',
    './assets/royal-excellence-medal.svg',
    './assets/royal-excellence-medal.png',
    './assets/royal-excellence-medal.jpg',
    './assets/icon-192.png',
    './assets/icon-512.png',
    './assets/skeleton-front.png',
    './assets/skeleton-back.png',
    './assets/audio/station_welcome.mp3',
    './assets/audio/station_transition.mp3',
    './assets/audio/station_recovery.mp3',
    './assets/audio/station_diagnosis_guide.mp3',
    './assets/audio/station_motivation.mp3',
    './assets/audio/station_chat_welcome_sarah.mp3',
    './assets/audio/station_chat_welcome_jamal.mp3',
    './assets/audio/station_exercise_start.mp3',
    './assets/audio/station_exercise_start.wav',
    './assets/audio/station_exercise_finish.mp3',
    './assets/audio/station_exercise_finish.wav',
    './assets/exercises/custom_cerv_1.jpg',
    './assets/exercises/custom_cerv_2.jpg',
    './assets/exercises/custom_cerv_3.jpg',
    './assets/exercises/custom_lu_1.jpg',
    './assets/exercises/custom_lu_2.jpg',
    './assets/exercises/custom_lu_3.jpg',
    './assets/exercises/custom_lu_4.jpg',
    './assets/exercises/custom_lu_5.jpg',
    './assets/exercises/custom_lu_6.jpg',
    './assets/exercises/custom_si_1.jpg',
    './assets/exercises/custom_si_2.jpg',
    './assets/exercises/custom_si_3.jpg',
    './assets/exercises/custom_si_4.jpg',
    './assets/exercises/custom_si_5.jpg',
    './assets/exercises/custom_sh_1.jpg',
    './assets/exercises/custom_sh_2.jpg',
    './assets/exercises/custom_sh_3.jpg',
    './assets/exercises/custom_sh_4.jpg',
    './assets/exercises/custom_th_1.jpg',
    './assets/exercises/custom_th_2.jpg',
    './assets/exercises/custom_th_3.jpg',
    './assets/exercises/custom_kn_1.jpg',
    './assets/exercises/custom_kn_2.jpg',
    './assets/exercises/custom_kn_3.jpg',
    './assets/exercises/custom_kn_4.jpg',
    './assets/exercises/custom_kn_5.jpg',
    './assets/exercises/custom_ank_1.jpg',
    './assets/exercises/custom_ank_2.jpg',
    './assets/exercises/custom_ank_3.jpg',
    './assets/exercises/custom_ank_4.jpg',
    './assets/exercises/custom_el_1.jpg',
    './assets/exercises/custom_el_2.jpg',
    './assets/exercises/custom_el_3.jpg',
    './assets/exercises/custom_wr_1.jpg',
    './assets/exercises/custom_wr_2.jpg',
    './assets/exercises/custom_wr_3.jpg',
    './assets/exercises/custom_ch_1.jpg',
    './assets/exercises/custom_ch_2.jpg',
    './assets/exercises/custom_ch_3.jpg',
    './assets/exercises/tmj_jaw_relief.svg',
    './assets/exercises/shoulder_cross_stretch.svg',
    './assets/exercises/cat_cow.jpg',
    './assets/exercises/chin_tuck.jpg',
    './assets/exercises/figure4_stretch.jpg',
    './assets/exercises/press_up.png',
    './assets/exercises/glute_bridge.png',
    './assets/exercises/bird_dog.png',
    './assets/exercises/quad_set.png',
    './assets/exercises/pendulum_swings.png',
    './assets/exercises/child_pose.jpg',
    './assets/exercises/char_neck_flexion.jpg',
    './assets/exercises/char_neck_shrugs.jpg',
    './assets/exercises/char_shoulder_cross.jpg',
    './assets/exercises/char_wall_slide.jpg',
    './assets/exercises/char_doorway_chest.jpg',
    './assets/exercises/char_lower_trunk_rot.jpg',
    './assets/exercises/char_sciatic_glide.jpg',
    './assets/exercises/char_clamshell.jpg',
    './assets/exercises/char_knee_chest.jpg',
    './assets/exercises/char_hamstring_str.jpg',
    './assets/exercises/char_straight_leg.jpg',
    './js/database.js',
    './js/system-watchdog.js',
    './js/exercise-image-studio.js',
    './js/exercises-db.js',
    './js/diagnostic-engine.js',
    './js/patient-flow.js',
    './js/admin-engine.js',
    './js/audio-pacer.js',
    './js/ai-config.js',
    './js/ai-engine.js',
    './js/app.js',
    './js/text-editor.js',
    './js/security-shield.js',
    './js/geo-tracker.js',
    './js/mqtt.min.js',
    './js/cloud-sync.js',
    './js/smart-guidance.js'
];

self.addEventListener('install', (event) => {
    self.skipWaiting();
    event.waitUntil(
        caches.open(CACHE_NAME).then(async (cache) => {
            // ✅ أولاً: ضمان تخزين الملفات الأساسية التي تُشغّل التطبيق بشكل مستقل
            // حتى لو فشل أي ملف صوتي أو صورة لن يتأثر تحميل الأداة
            const coreAssets = [
                './index.html',
                './css/style.css',
                './js/app.js',
                './js/smart-guidance.js',
                './js/database.js',
                './js/ai-engine.js',
                './js/diagnostic-engine.js',
                './js/cloud-sync.js',
                './js/admin-engine.js',
                './manifest.json',
            ];

            // تخزين الملفات الأساسية أولاً — أي فشل هنا يُسجَّل لكن لا يوقف العملية
            await Promise.all(
                coreAssets.map((url) =>
                    cache.add(url).catch((err) => console.warn('[SW] Core asset failed:', url, err))
                )
            );

            // تخزين باقي الأصول (صور، صوت، تمارين) بشكل احتياطي — الفشل مقبول
            const optionalAssets = STATIC_ASSETS.filter((a) => !coreAssets.includes(a));
            await Promise.all(
                optionalAssets.map((url) =>
                    cache.add(url).catch(() => {}) // الفشل الصامت مقبول للأصول الاختيارية
                )
            );
        })
    );
});


self.addEventListener('activate', (event) => {
    event.waitUntil(
        caches.keys().then((keys) => {
            return Promise.all(
                keys.map((key) => {
                    if (key !== CACHE_NAME) {
                        console.log('[SW] Deleting old cache:', key);
                        return caches.delete(key);
                    }
                })
            );
        }).then(() => self.clients.claim())
    );
});

// استراتيجية Network-First: جلب التحديث أولاً من الخادم/القرص ثم تحديث الكاش
self.addEventListener('fetch', (event) => {
    if (event.request.method !== 'GET') return;
    const reqUrl = event.request.url || '';
    if (!reqUrl.startsWith('http')) return;

    // ✅ عدم اعتراض لوحة التحكم أو المعايرة أو ملفات البيانات الثابتة لضمان تحميلها دائماً مباشرة ومحدثة من الخادم
    if (reqUrl.includes('admin.html') || reqUrl.includes('calibrator.html') || reqUrl.includes('data/')) {
        return;
    }

    // ✅ عدم اعتراض طلبات الذكاء الاصطناعي وجوجل الخارجية لتفادي أخطاء CORS والكاش في iOS Safari
    if (reqUrl.includes('generativelanguage.googleapis.com') || reqUrl.includes('googletagmanager.com') || reqUrl.includes('google-analytics.com')) {
        return;
    }

    event.respondWith(
        fetch(event.request)
            .then((networkResponse) => {
                if (networkResponse && networkResponse.status === 200) {
                    const responseClone = networkResponse.clone();
                    caches.open(CACHE_NAME).then((cache) => {
                        cache.put(event.request, responseClone);
                    });
                }
                return networkResponse;
            })
            .catch(() => {
                return caches.match(event.request).then((cachedResponse) => {
                    if (cachedResponse) return cachedResponse;
                    if (event.request.mode === 'navigate') {
                        return caches.match('./index.html');
                    }
                });
            })
    );
});
