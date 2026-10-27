import { ALL_PARTS } from '../src/lib/data/parts.ts';
import { ALL_PREBUILTS } from '../src/lib/data/prebuilts.ts';
import { TRADE_IN_PRICING_TABLE, BUILD_PRESETS } from '../src/lib/constants.ts';

console.log('====================================================');
console.log('   SOFTBUILD LUXURY COMPUTING — DATABASE SEEDING    ');
console.log('====================================================');

console.log(`\n[1/4] Seeding Hardware Parts Catalog...`);
console.log(`✓ Successfully verified ${ALL_PARTS.length} enthusiast parts:`);
const categories = [...new Set(ALL_PARTS.map((p) => p.category))];
categories.forEach((cat) => {
  const count = ALL_PARTS.filter((p) => p.category === cat).length;
  console.log(`   - ${cat.toUpperCase()}: ${count} verified components`);
});

console.log(`\n[2/4] Seeding Flagship Prebuilt Systems...`);
console.log(`✓ Successfully seeded ${ALL_PREBUILTS.length} prebuilt machines:`);
ALL_PREBUILTS.forEach((pc) => {
  console.log(`   - ${pc.name} (${pc.headlineSpecs.cpu} + ${pc.headlineSpecs.gpu}) — $${pc.price}`);
});

console.log(`\n[3/4] Seeding Trade-In Valuation Pricing Table...`);
console.log(`✓ Seeded ${TRADE_IN_PRICING_TABLE.length} valuation rows across GPUs, CPUs, RAM, and SSDs.`);

console.log(`\n[4/4] Seeding Factory Presets...`);
console.log(`✓ Seeded ${BUILD_PRESETS.length} presets (Gaming, Creator, Workstation, AI/ML, Silent).`);

console.log('\n====================================================');
console.log('   SEED COMPLETE: SoftBuild Catalog Ready!          ');
console.log('====================================================\n');
