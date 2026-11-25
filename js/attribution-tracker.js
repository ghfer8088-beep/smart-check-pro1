// ==========================================================================
// SmartCheckTools - First-Party Marketing Attribution Tracker (v33.74)
// Tracks First Touch & Last Touch UTM parameters securely in 1st-party storage.
// Privacy-safe: Never sends health, symptom, diagnosis, or PII data to ad platforms.
// ==========================================================================

(function (root) {
    'use strict';

    const STORAGE_KEY = 'smart_attribution_v1';
    const COOKIE_NAME = 'scp_attr_v1';
    const COOKIE_MAX_AGE = 90 * 24 * 60 * 60; // 90 days

    function sanitizeUtmValue(raw) {
        if (raw === null || raw === undefined) return '';
        let val = String(raw).trim();
        if (!val) return '';
        // Strip dangerous protocols/tags/events
        val = val
            .replace(/<[^>]*>/g, '')
            .replace(/javascript\s*:/gi, '')
            .replace(/data\s*:/gi, '')
            .replace(/vbscript\s*:/gi, '')
            .replace(/on\w+\s*=/gi, '')
            .replace(/["'`;\\<>()]/g, '')
            .replace(/[\x00-\x1F\x7F]/g, '');
        // Allow only safe characters (alphanumeric, -, _, ., /, :, space, Arabic)
        val = val.replace(/[^a-zA-Z0-9_\-./:\u0600-\u06FF ]/g, '').trim();
        if (val.length > 120) val = val.slice(0, 120);
        return val;
    }

    function resolveChannelInfo(utmSource, utmMedium) {
        const src = String(utmSource || '').toLowerCase().trim();
        const med = String(utmMedium || '').toLowerCase().trim();

        if (!src || src === 'unknown') {
            return { sourceLabel: 'Unknown', channelType: 'unknown' };
        }
        if (src === 'direct' || src === '(direct)') {
            return { sourceLabel: 'Direct', channelType: 'direct' };
        }
        if (src === 'facebook_groups' || src === 'fb_groups' || med === 'community' || med === 'group' || med === 'groups') {
            return { sourceLabel: 'Facebook Groups', channelType: 'facebook_groups' };
        }
        if (src === 'facebook_page' || src === 'fb_page' || (src.includes('facebook') && (med === 'organic_social' || med === 'page'))) {
            return { sourceLabel: 'Facebook Page', channelType: 'medical_page' };
        }
        if (src === 'facebook' || src === 'fb' || src === 'facebook_ads' || src === 'meta') {
            if (med === 'organic_social' || med === 'organic') {
                return { sourceLabel: 'Facebook Page', channelType: 'medical_page' };
            }
            return { sourceLabel: 'Facebook Ads', channelType: 'paid_ads' };
        }
        if (src === 'instagram' || src === 'ig') {
            const isPaid = med === 'paid_social' || med === 'cpc' || med === 'paid' || med === 'ads';
            return { sourceLabel: 'Instagram', channelType: isPaid ? 'paid_ads' : 'organic_social' };
        }
        if (src === 'google' || src === 'google_ads' || src === 'adwords') {
            const isPaid = med === 'cpc' || med === 'ppc' || med === 'paid' || med === 'paid_search';
            return { sourceLabel: 'Google', channelType: isPaid ? 'paid_ads' : 'organic_search' };
        }
        if (src === 'tiktok' || src === 'tt') {
            const isPaid = med === 'paid_social' || med === 'cpc' || med === 'paid' || med === 'ads';
            return { sourceLabel: 'TikTok', channelType: isPaid ? 'paid_ads' : 'organic_social' };
        }
        if (src === 'whatsapp' || src === 'wa') {
            return { sourceLabel: 'WhatsApp', channelType: 'messaging' };
        }

        // Fallback for custom sources: capitalize cleanly
        const pretty = src.replace(/[_-]+/g, ' ').replace(/\b\w/g, c => c.toUpperCase());
        const isPaidOther = med === 'paid_social' || med === 'cpc' || med === 'paid' || med === 'ads';
        return { sourceLabel: pretty, channelType: isPaidOther ? 'paid_ads' : 'other' };
    }

    function hasStorageConsent() {
        try {
            if (typeof localStorage !== 'undefined') {
                const consent = localStorage.getItem('smart_privacy_consent');
                if (consent === 'denied' || consent === 'false') return false;
            }
        } catch (e) {}
        return true;
    }

    function readCookie(name) {
        try {
            if (typeof document === 'undefined' || !document.cookie) return null;
            const prefix = name + '=';
            const parts = document.cookie.split(';');
            for (let i = 0; i < parts.length; i++) {
                const part = parts[i].trim();
                if (part.indexOf(prefix) === 0) {
                    return decodeURIComponent(part.slice(prefix.length));
                }
            }
        } catch (e) {}
        return null;
    }

    function writeCookie(name, value, maxAgeSec) {
        try {
            if (typeof document === 'undefined') return;
            const encoded = encodeURIComponent(value);
            const secureFlag = (typeof location !== 'undefined' && location.protocol === 'https:') ? '; Secure' : '';
            document.cookie = `${name}=${encoded}; path=/; max-age=${maxAgeSec}; SameSite=Lax${secureFlag}`;
        } catch (e) {}
    }

    function loadState(storageBackend) {
        if (!hasStorageConsent()) return null;
        try {
            if (storageBackend && typeof storageBackend.getItem === 'function') {
                const raw = storageBackend.getItem(STORAGE_KEY);
                if (raw) return JSON.parse(raw);
            }
            if (typeof localStorage !== 'undefined') {
                const rawLs = localStorage.getItem(STORAGE_KEY);
                if (rawLs) return JSON.parse(rawLs);
            }
            const rawCk = readCookie(COOKIE_NAME);
            if (rawCk) return JSON.parse(rawCk);
            if (typeof sessionStorage !== 'undefined') {
                const rawSs = sessionStorage.getItem(STORAGE_KEY);
                if (rawSs) return JSON.parse(rawSs);
            }
        } catch (e) {}
        return null;
    }

    function saveState(state, storageBackend) {
        if (!hasStorageConsent() || !state) return;
        const json = JSON.stringify(state);
        try {
            if (storageBackend && typeof storageBackend.setItem === 'function') {
                storageBackend.setItem(STORAGE_KEY, json);
            }
        } catch (e) {}
        try {
            if (typeof localStorage !== 'undefined') {
                localStorage.setItem(STORAGE_KEY, json);
            }
        } catch (e) {}
        try {
            if (typeof sessionStorage !== 'undefined') {
                sessionStorage.setItem(STORAGE_KEY, json);
            }
        } catch (e) {}
        writeCookie(COOKIE_NAME, json, COOKIE_MAX_AGE);
    }

    function parseUtmFromSearch(searchStr) {
        const query = String(searchStr || '').replace(/^\?/, '');
        if (!query) return null;
        const params = new URLSearchParams(query);
        const utm_source = sanitizeUtmValue(params.get('utm_source'));
        const utm_medium = sanitizeUtmValue(params.get('utm_medium'));
        const utm_campaign = sanitizeUtmValue(params.get('utm_campaign'));
        const utm_content = sanitizeUtmValue(params.get('utm_content'));

        if (!utm_source && !utm_medium && !utm_campaign && !utm_content) {
            return null;
        }
        const resolved = resolveChannelInfo(utm_source || 'unknown', utm_medium);
        return {
            utm_source: utm_source || '',
            utm_medium: utm_medium || '',
            utm_campaign: utm_campaign || '',
            utm_content: utm_content || '',
            sourceLabel: resolved.sourceLabel,
            channelType: resolved.channelType
        };
    }

    function captureFromUrl(searchStr, nowIso, storageBackend) {
        const ts = nowIso || new Date().toISOString();
        const existing = loadState(storageBackend);
        const parsed = parseUtmFromSearch(
            searchStr !== undefined
                ? searchStr
                : (typeof window !== 'undefined' && window.location ? window.location.search : '')
        );

        if (parsed) {
            const touch = {
                utm_source: parsed.utm_source,
                utm_medium: parsed.utm_medium,
                utm_campaign: parsed.utm_campaign,
                utm_content: parsed.utm_content,
                sourceLabel: parsed.sourceLabel,
                channelType: parsed.channelType,
                visitedAt: ts,
                isProvisionalDirect: false
            };

            let nextFirst = existing && existing.firstTouch ? existing.firstTouch : null;
            // If no firstTouch OR existing firstTouch was provisional Direct/Unknown, promote this known marketing source
            if (
                !nextFirst ||
                nextFirst.isProvisionalDirect === true ||
                nextFirst.sourceLabel === 'Direct' ||
                nextFirst.sourceLabel === 'Unknown'
            ) {
                nextFirst = { ...touch };
            }

            const nextState = {
                version: 1,
                firstTouch: nextFirst,
                lastTouch: touch,
                updatedAt: ts
            };
            saveState(nextState, storageBackend);
            return nextState;
        }

        // Direct visit (no UTM in URL)
        if (!existing || !existing.firstTouch) {
            const directTouch = {
                utm_source: 'direct',
                utm_medium: 'none',
                utm_campaign: '',
                utm_content: '',
                sourceLabel: 'Direct',
                channelType: 'direct',
                visitedAt: ts,
                isProvisionalDirect: true
            };
            const nextState = {
                version: 1,
                firstTouch: directTouch,
                lastTouch: { ...directTouch },
                updatedAt: ts
            };
            saveState(nextState, storageBackend);
            return nextState;
        }

        // Existing known or provisional source: preserve it without overwriting!
        return existing;
    }

    function getAttributionSnapshot(storageBackend) {
        const state = loadState(storageBackend);
        if (!state || !state.firstTouch) {
            return {
                firstSource: 'Unknown',
                lastSource: 'Unknown',
                channelType: 'unknown',
                firstChannelType: 'unknown',
                campaignName: '',
                utm_source: '',
                utm_medium: '',
                utm_campaign: '',
                utm_content: '',
                firstTouchAt: '',
                lastTouchAt: '',
                firstTouch: null,
                lastTouch: null
            };
        }
        const ft = state.firstTouch;
        const lt = state.lastTouch || ft;
        return {
            firstSource: ft.sourceLabel || 'Unknown',
            lastSource: lt.sourceLabel || ft.sourceLabel || 'Unknown',
            channelType: lt.channelType || ft.channelType || 'unknown',
            firstChannelType: ft.channelType || 'unknown',
            campaignName: lt.utm_campaign || ft.utm_campaign || '',
            utm_source: lt.utm_source || ft.utm_source || '',
            utm_medium: lt.utm_medium || ft.utm_medium || '',
            utm_campaign: lt.utm_campaign || ft.utm_campaign || '',
            utm_content: lt.utm_content || ft.utm_content || '',
            firstTouchAt: ft.visitedAt || '',
            lastTouchAt: lt.visitedAt || ft.visitedAt || '',
            firstTouch: ft,
            lastTouch: lt
        };
    }

    function mergeAttributionSnapshots(primary, secondary) {
        const a = primary || {};
        const b = secondary || {};
        const aKnown = a.firstSource && a.firstSource !== 'Unknown' && a.firstSource !== 'Direct';
        const bKnown = b.firstSource && b.firstSource !== 'Unknown' && b.firstSource !== 'Direct';

        const chosenFirst = aKnown ? a : (bKnown ? b : (a.firstSource && a.firstSource !== 'Unknown' ? a : b));
        const chosenLast = (b.lastTouchAt && (!a.lastTouchAt || new Date(b.lastTouchAt) > new Date(a.lastTouchAt)))
            ? b
            : (a.lastSource && a.lastSource !== 'Unknown' ? a : b);

        if (!chosenFirst?.firstSource && !chosenLast?.lastSource) {
            return getAttributionSnapshot({ getItem: () => null });
        }

        return {
            firstSource: chosenFirst.firstSource || 'Unknown',
            lastSource: chosenLast.lastSource || chosenFirst.firstSource || 'Unknown',
            channelType: chosenLast.channelType || chosenFirst.channelType || 'unknown',
            firstChannelType: chosenFirst.firstChannelType || chosenFirst.channelType || 'unknown',
            campaignName: chosenLast.campaignName || chosenFirst.campaignName || '',
            utm_source: chosenLast.utm_source || chosenFirst.utm_source || '',
            utm_medium: chosenLast.utm_medium || chosenFirst.utm_medium || '',
            utm_campaign: chosenLast.utm_campaign || chosenFirst.utm_campaign || '',
            utm_content: chosenLast.utm_content || chosenFirst.utm_content || '',
            firstTouchAt: chosenFirst.firstTouchAt || '',
            lastTouchAt: chosenLast.lastTouchAt || chosenFirst.firstTouchAt || '',
            firstTouch: chosenFirst.firstTouch || null,
            lastTouch: chosenLast.lastTouch || chosenFirst.firstTouch || null
        };
    }

    // Auto-capture immediately on load in browser
    if (typeof window !== 'undefined' && window.location) {
        try {
            captureFromUrl(window.location.search);
        } catch (e) {}
    }

    const api = {
        STORAGE_KEY,
        COOKIE_NAME,
        sanitizeUtmValue,
        resolveChannelInfo,
        parseUtmFromSearch,
        captureFromUrl,
        getAttributionSnapshot,
        mergeAttributionSnapshots
    };

    if (typeof module !== 'undefined' && module.exports) {
        module.exports = api;
    }
    if (root) {
        root.SmartAttribution = api;
    }
})(typeof window !== 'undefined' ? window : globalThis);
