// Automated Test Suite for SmartCheckTools Marketing Attribution (v33.73)
const assert = require('assert');
const fs = require('fs');
const path = require('path');
const vm = require('vm');
const SmartAttribution = require('../js/attribution-tracker.js');

function createMockStorage() {
    const map = new Map();
    return {
        getItem: (k) => (map.has(k) ? map.get(k) : null),
        setItem: (k, v) => map.set(k, String(v)),
        removeItem: (k) => map.delete(k)
    };
}

let passed = 0;
function test(name, fn) {
    fn();
    passed++;
    console.log(`PASS: ${name}`);
}

// 1. Facebook Ads link
test('1. Facebook Ads UTM tracking', () => {
    const st = createMockStorage();
    SmartAttribution.captureFromUrl('?utm_source=facebook&utm_medium=paid_social&utm_campaign=jordan_launch', '2026-11-25T10:00:00Z', st);
    const snap = SmartAttribution.getAttributionSnapshot(st);
    assert.strictEqual(snap.firstSource, 'Facebook Ads');
    assert.strictEqual(snap.lastSource, 'Facebook Ads');
    assert.strictEqual(snap.channelType, 'paid_ads');
    assert.strictEqual(snap.campaignName, 'jordan_launch');
});

// 2. Medical Page link
test('2. Facebook Medical Page UTM tracking', () => {
    const st = createMockStorage();
    SmartAttribution.captureFromUrl('?utm_source=facebook_page&utm_medium=organic_social&utm_campaign=jordan_launch', '2026-11-25T10:05:00Z', st);
    const snap = SmartAttribution.getAttributionSnapshot(st);
    assert.strictEqual(snap.firstSource, 'Facebook Page');
    assert.strictEqual(snap.channelType, 'medical_page');
});

// 3. Facebook Groups link
test('3. Facebook Groups UTM tracking', () => {
    const st = createMockStorage();
    SmartAttribution.captureFromUrl('?utm_source=facebook_groups&utm_medium=community&utm_campaign=jordan_launch', '2026-11-25T10:10:00Z', st);
    const snap = SmartAttribution.getAttributionSnapshot(st);
    assert.strictEqual(snap.firstSource, 'Facebook Groups');
    assert.strictEqual(snap.channelType, 'facebook_groups');
});

// 4. Provisional Direct -> Promoted to Known First Touch -> Subsequent Last Touch -> Direct does NOT overwrite
test('4. Direct provisional promotion and First/Last Touch persistence', () => {
    const st = createMockStorage();
    SmartAttribution.captureFromUrl('', '2026-11-25T09:00:00Z', st);
    assert.strictEqual(SmartAttribution.getAttributionSnapshot(st).firstSource, 'Direct');

    // Return via Facebook Ads -> promotes Direct to Facebook Ads
    SmartAttribution.captureFromUrl('?utm_source=facebook&utm_medium=paid_social&utm_campaign=jordan_launch', '2026-11-25T10:00:00Z', st);
    let snap = SmartAttribution.getAttributionSnapshot(st);
    assert.strictEqual(snap.firstSource, 'Facebook Ads');
    assert.strictEqual(snap.lastSource, 'Facebook Ads');

    // Return via Facebook Groups -> First stays Facebook Ads, Last updates to Facebook Groups
    SmartAttribution.captureFromUrl('?utm_source=facebook_groups&utm_medium=community&utm_campaign=jordan_launch', '2026-11-25T11:00:00Z', st);
    snap = SmartAttribution.getAttributionSnapshot(st);
    assert.strictEqual(snap.firstSource, 'Facebook Ads');
    assert.strictEqual(snap.lastSource, 'Facebook Groups');

    // Return Direct again -> neither First nor Last is overwritten
    SmartAttribution.captureFromUrl('', '2026-11-25T12:00:00Z', st);
    snap = SmartAttribution.getAttributionSnapshot(st);
    assert.strictEqual(snap.firstSource, 'Facebook Ads');
    assert.strictEqual(snap.lastSource, 'Facebook Groups');
});

// 5. UTM Sanitization against XSS / malicious characters
test('5. UTM parameter sanitization blocks XSS payloads', () => {
    const clean = SmartAttribution.sanitizeUtmValue('<script>alert(1)</script>facebook"onerror=alert(1)');
    assert.strictEqual(clean.includes('<'), false);
    assert.strictEqual(clean.includes('>'), false);
    assert.strictEqual(clean.includes('"'), false);
    assert.strictEqual(clean.includes('onerror='), false);
});

// 6. Merge attribution across registration & login without losing First Touch
test('6. Attribution survives registration/login merge', () => {
    const st1 = createMockStorage();
    SmartAttribution.captureFromUrl('?utm_source=facebook&utm_medium=paid_social&utm_campaign=jordan_launch', '2026-11-25T09:00:00Z', st1);
    const existing = SmartAttribution.getAttributionSnapshot(st1);

    const st2 = createMockStorage();
    SmartAttribution.captureFromUrl('', '2026-11-26T09:00:00Z', st2);
    const directNew = SmartAttribution.getAttributionSnapshot(st2);

    const merged = SmartAttribution.mergeAttributionSnapshots(existing, directNew);
    assert.strictEqual(merged.firstSource, 'Facebook Ads');
    assert.strictEqual(merged.campaignName, 'jordan_launch');
});

// 7 & 8. Verify admin.html analytics & accounting rules (unpaid excluded, legacy Unknown, CAC/ARPU/ROAS with 0.709)
test('7. Admin analytics excludes unpaid, defaults legacy to Unknown, and computes CAC/ARPU/ROAS at 0.709', () => {
    const adminHtml = fs.readFileSync(path.join(__dirname, '..', 'admin.html'), 'utf8');
    const normalizeMatch = adminHtml.match(/function normalizeAttributionForRecord[\s\S]*?return \{ firstSource, lastSource, channelType, campaignName, firstTouchAt, lastTouchAt \};\s*\}/);
    const calcMatch = adminHtml.match(/function calculateAccountingTotals\(recordsList\)[\s\S]*?return \{\s*totalRevenue[\s\S]*?\};\s*\}/);
    const analyticsMatch = adminHtml.match(/function computeAttributionAnalytics\(recordsList, spendList, usdToJod\)[\s\S]*?return \{\s*totalPaid[\s\S]*?\};\s*\}/);
    assert.ok(normalizeMatch && calcMatch && analyticsMatch, 'Admin functions must exist');

    const sandbox = {};
    vm.runInNewContext(normalizeMatch[0] + '\n' + calcMatch[0] + '\n' + analyticsMatch[0], sandbox);

    // Legacy record without attribution -> Unknown
    const legacyNorm = sandbox.normalizeAttributionForRecord({ id: 'OLD-1', amount: 3 });
    assert.strictEqual(legacyNorm.firstSource, 'Unknown');

    // Mix of confirmed paid, unpaid pending, and humanitarian
    const records = [
        ...Array.from({ length: 10 }, (_, i) => ({
            id: 'PAID-' + i,
            tier: i < 5 ? 'single' : 'pack5',
            amount: i < 5 ? 5 : 10, // 5*5 + 5*10 = 75 JOD
            status: 'مفعّل ومعتمد',
            isUnlocked: true,
            firstSource: 'Facebook Ads',
            channelType: 'paid_ads',
            campaignName: 'jordan_launch'
        })),
        { id: 'PENDING-1', tier: 'pack10', amount: 15, status: 'بانتظار التأكيد', isUnlocked: false, firstSource: 'Facebook Ads', campaignName: 'jordan_launch' },
        { id: 'HUM-1', tier: 'humanitarian', amount: 0, status: 'مفعّل ومعتمد', isUnlocked: true, firstSource: 'Facebook Groups', campaignName: 'jordan_launch' }
    ];

    const totals = sandbox.calculateAccountingTotals(records);
    assert.strictEqual(totals.totalOrders, 10);
    assert.strictEqual(totals.totalRevenue, 75);
    assert.strictEqual(totals.humCount, 1);

    const spendList = [{ campaign: 'jordan_launch', source: 'Facebook Ads', amount: 35, currency: 'USD' }];
    const stats = sandbox.computeAttributionAnalytics(records, spendList, 0.709);
    assert.strictEqual(stats.totalPaid, 10);
    assert.strictEqual(stats.totalRevenue, 75);
    const camp = stats.campaignRows[0];
    // 35 USD * 0.709 = 24.815 JOD
    assert.ok(Math.abs(camp.spendJod - 24.815) < 0.001);
    assert.ok(Math.abs(camp.cac - 2.4815) < 0.001);
    assert.ok(Math.abs(camp.arpu - 7.5) < 0.001);
    assert.ok(Math.abs(camp.roas - (75 / 24.815)) < 0.001);
});

console.log(`\nALL ${passed} ATTRIBUTION TESTS PASSED!`);
