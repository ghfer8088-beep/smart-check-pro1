// ==========================================================================
// Smart Check Pro 2.0 - محرك التنبيه والتوجيه الصوتي الطبي (Web Audio API)
// مركز وداعاً للألم - أصوات تنبيهية مريحة دون الحاجة لتحميل ملفات خارجية
// ==========================================================================

const ClinicalAudioPacer = (function() {
    let audioCtx = null;
    let isMuted = localStorage.getItem('scp_audio_muted') === 'true';

    function getAudioContext() {
        if (!audioCtx) {
            const AudioContext = window.AudioContext || window.webkitAudioContext;
            if (AudioContext) {
                audioCtx = new AudioContext();
            }
        }
        if (audioCtx && audioCtx.state === 'suspended') {
            audioCtx.resume();
        }
        return audioCtx;
    }

    function toggleMute() {
        isMuted = !isMuted;
        localStorage.setItem('scp_audio_muted', isMuted ? 'true' : 'false');
        return isMuted;
    }

    function getMuteStatus() {
        return isMuted;
    }

    // نغمة بدء التمرين (نغمتان صاعدتان لطيفتان)
    function playStartChime() {
        if (isMuted) return;
        try {
            const ctx = getAudioContext();
            if (!ctx) return;

            const now = ctx.currentTime;
            
            // النغمة الأولى 523.25 Hz (C5)
            const osc1 = ctx.createOscillator();
            const gain1 = ctx.createGain();
            osc1.type = 'sine';
            osc1.frequency.setValueAtTime(523.25, now);
            gain1.gain.setValueAtTime(0.12, now);
            gain1.gain.exponentialRampToValueAtTime(0.001, now + 0.3);
            osc1.connect(gain1);
            gain1.connect(ctx.destination);
            osc1.start(now);
            osc1.stop(now + 0.35);

            // النغمة الثانية 659.25 Hz (E5)
            const osc2 = ctx.createOscillator();
            const gain2 = ctx.createGain();
            osc2.type = 'sine';
            osc2.frequency.setValueAtTime(659.25, now + 0.15);
            gain2.gain.setValueAtTime(0.15, now + 0.15);
            gain2.gain.exponentialRampToValueAtTime(0.001, now + 0.6);
            osc2.connect(gain2);
            gain2.connect(ctx.destination);
            osc2.start(now + 0.15);
            osc2.stop(now + 0.65);
        } catch (e) {}
    }

    // نغمة منتصف التمرين أو التبديل
    function playHalfwayChime() {
        if (isMuted) return;
        try {
            const ctx = getAudioContext();
            if (!ctx) return;
            const now = ctx.currentTime;

            const osc = ctx.createOscillator();
            const gain = ctx.createGain();
            osc.type = 'sine';
            osc.frequency.setValueAtTime(440, now); // A4
            gain.gain.setValueAtTime(0.1, now);
            gain.gain.exponentialRampToValueAtTime(0.001, now + 0.4);
            osc.connect(gain);
            gain.connect(ctx.destination);
            osc.start(now);
            osc.stop(now + 0.45);
        } catch (e) {}
    }

    // نغمة اكتمال التمرين وإنجاز الجلسة (نغمات احتفالية هادئة)
    function playCompleteChime() {
        if (isMuted) return;
        try {
            const ctx = getAudioContext();
            if (!ctx) return;
            const now = ctx.currentTime;

            const notes = [523.25, 659.25, 783.99, 1046.50]; // C5, E5, G5, C6
            notes.forEach((freq, idx) => {
                const osc = ctx.createOscillator();
                const gain = ctx.createGain();
                const noteTime = now + idx * 0.12;

                osc.type = 'sine';
                osc.frequency.setValueAtTime(freq, noteTime);
                gain.gain.setValueAtTime(0.12, noteTime);
                gain.gain.exponentialRampToValueAtTime(0.001, noteTime + 0.5);

                osc.connect(gain);
                gain.connect(ctx.destination);
                osc.start(noteTime);
                osc.stop(noteTime + 0.55);
            });
        } catch (e) {}
    }

    // تكة إيقاعية لطيفة أثناء الثبات في التمرين (Soft Rhythm Tick)
    function playTickBeep(isFinalThree = false) {
        if (isMuted) return;
        try {
            const ctx = getAudioContext();
            if (!ctx) return;
            const now = ctx.currentTime;
            const osc = ctx.createOscillator();
            const gain = ctx.createGain();
            osc.type = 'sine';
            osc.frequency.setValueAtTime(isFinalThree ? 880 : 587.33, now); // A5 or D5
            gain.gain.setValueAtTime(isFinalThree ? 0.08 : 0.03, now);
            gain.gain.exponentialRampToValueAtTime(0.001, now + 0.08);
            osc.connect(gain);
            gain.connect(ctx.destination);
            osc.start(now);
            osc.stop(now + 0.09);
        } catch (e) {}
    }

    return {
        playStartChime,
        playHalfwayChime,
        playCompleteChime,
        playTickBeep,
        toggleMute,
        getMuteStatus
    };
})();
