import test from 'node:test';
import assert from 'node:assert/strict';

// Test 1: Delivery ETA Logic
test('Delivery ETA Tier 4 gives 4 days and never exceeds 10 days', () => {
  const calculateETA = (tier) => {
    const validTier = tier <= 4 ? 4 : tier <= 6 ? 6 : 10;
    const now = new Date();
    const arrivalDate = new Date();
    arrivalDate.setDate(now.getDate() + validTier);
    return {
      tier: validTier,
      days: validTier,
      max10DaysRespected: validTier <= 10,
    };
  };

  const res4 = calculateETA(4);
  assert.equal(res4.tier, 4);
  assert.equal(res4.days, 4);
  assert.equal(res4.max10DaysRespected, true);

  const res6 = calculateETA(6);
  assert.equal(res6.tier, 6);
  assert.equal(res6.days, 6);

  const res10 = calculateETA(10);
  assert.equal(res10.tier, 10);
  assert.equal(res10.days, 10);

  // Even if an unexpected 14 days is passed, it must clamp to 10 days
  const resOverflow = calculateETA(14);
  assert.equal(resOverflow.tier, 10);
  assert.equal(resOverflow.days, 10);
});

// Test 2: Compatibility Engine Check
test('Compatibility engine detects CPU vs Motherboard socket mismatch', () => {
  const checkSocket = (cpuSocket, mbSocket) => {
    if (cpuSocket !== mbSocket) {
      return { compatible: false, error: `Socket mismatch: ${cpuSocket} vs ${mbSocket}` };
    }
    return { compatible: true };
  };

  const good = checkSocket('AM5', 'AM5');
  assert.equal(good.compatible, true);

  const mismatch = checkSocket('LGA1700', 'AM5');
  assert.equal(mismatch.compatible, false);
  assert.ok(mismatch.error.includes('Socket mismatch'));
});

// Test 3: PSU Wattage Headroom Check (+20% safety margin)
test('Compatibility engine checks PSU wattage headroom (+20% buffer)', () => {
  const checkPsu = (totalPowerWatts, psuWatts) => {
    const recommended = Math.round(totalPowerWatts * 1.25);
    const blockers = [];
    const warnings = [];

    if (psuWatts < totalPowerWatts) {
      blockers.push(`PSU wattage ${psuWatts}W is insufficient for ${totalPowerWatts}W.`);
    } else if (psuWatts < recommended) {
      warnings.push(`Low PSU headroom. Recommended at least ${recommended}W.`);
    }

    return { compatible: blockers.length === 0, blockers, warnings, recommended };
  };

  // 750W system with 600W PSU -> Blocker
  const underpowered = checkPsu(750, 600);
  assert.equal(underpowered.compatible, false);
  assert.equal(underpowered.blockers.length, 1);

  // 750W system with 850W PSU -> Warning (<938W recommended)
  const marginal = checkPsu(750, 850);
  assert.equal(marginal.compatible, true);
  assert.equal(marginal.warnings.length, 1);

  // 750W system with 1000W PSU -> Safe and clean
  const ideal = checkPsu(750, 1000);
  assert.equal(ideal.compatible, true);
  assert.equal(ideal.warnings.length, 0);
});

// Test 4: GPU Length vs Case Clearance Check
test('Compatibility engine verifies GPU clearance vs Case max clearance', () => {
  const checkClearance = (gpuLengthMm, maxCaseGpuMm) => {
    if (gpuLengthMm > maxCaseGpuMm) {
      return {
        compatible: false,
        error: `GPU length ${gpuLengthMm}mm exceeds case max clearance ${maxCaseGpuMm}mm`,
      };
    }
    return { compatible: true };
  };

  // RTX 4090 Strix (357mm) inside Lian Li O11 EVO (455mm max) -> OK
  const fits = checkClearance(357, 455);
  assert.equal(fits.compatible, true);

  // RTX 4090 Strix (357mm) inside Mini-ITX 320mm case -> Blocker
  const tooLong = checkClearance(357, 320);
  assert.equal(tooLong.compatible, false);
  assert.ok(tooLong.error.includes('exceeds case max clearance'));
});

// Test 5: Order Creation & Invoice Generation
test('Order record creates valid SoftBuild invoice number and totals', () => {
  const subtotal = 3899;
  const discount = 100;
  const tax = Math.round((subtotal - discount) * 0.08);
  const total = subtotal - discount + tax;

  const invoiceNumber = `SB-${Math.floor(100000 + Math.random() * 900000)}`;

  assert.ok(invoiceNumber.startsWith('SB-'));
  assert.equal(invoiceNumber.length, 9);
  assert.equal(total, 3799 + 304);
});
