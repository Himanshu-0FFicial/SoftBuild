import { BuildSelection, CompatibilityCheck, PartProduct } from './types';

export function checkBuildCompatibility(build: BuildSelection): CompatibilityCheck {
  const blockers: string[] = [];
  const warnings: string[] = [];

  // Calculate total wattage
  let totalPowerWatts = 75; // baseline motherboard, fans, chipset, pump
  if (build.cpu?.tdpWatts) totalPowerWatts += build.cpu.tdpWatts;
  if (build.gpu?.tdpWatts) totalPowerWatts += build.gpu.tdpWatts;
  if (build.ram?.tdpWatts) totalPowerWatts += build.ram.tdpWatts;
  if (build.storage?.tdpWatts) totalPowerWatts += build.storage.tdpWatts;
  if (build.cooler?.tdpWatts) totalPowerWatts += build.cooler.tdpWatts;

  // Recommended PSU adds 20% headroom
  const recommendedPsuWatts = Math.round(totalPowerWatts * 1.25);

  let psuHeadroomPercent = 0;
  if (build.psu?.wattageRating) {
    psuHeadroomPercent = Math.round(((build.psu.wattageRating - totalPowerWatts) / build.psu.wattageRating) * 100);
    if (build.psu.wattageRating < totalPowerWatts) {
      blockers.push(
        `PSU wattage (${build.psu.wattageRating}W) is insufficient for estimated system draw (${totalPowerWatts}W). Upgrade to at least ${recommendedPsuWatts}W.`
      );
    } else if (build.psu.wattageRating < recommendedPsuWatts) {
      warnings.push(
        `Low PSU headroom (${psuHeadroomPercent}%). We recommend at least 20% buffer (${recommendedPsuWatts}W) to handle transient power spikes safely.`
      );
    }
  }

  // 1. Socket compatibility (CPU vs Motherboard)
  if (build.cpu && build.motherboard) {
    if (build.cpu.socket && build.motherboard.socket && build.cpu.socket !== build.motherboard.socket) {
      blockers.push(
        `Socket mismatch: ${build.cpu.name} uses ${build.cpu.socket}, but ${build.motherboard.name} uses ${build.motherboard.socket}.`
      );
    }
  }

  // 2. RAM compatibility (RAM vs Motherboard)
  if (build.ram && build.motherboard) {
    const mbMem = build.motherboard.supportedMemory;
    const ramMem = build.ram.supportedMemory;
    if (mbMem && ramMem && mbMem !== 'Both' && ramMem !== 'Both' && mbMem !== ramMem) {
      blockers.push(
        `Memory type mismatch: Motherboard requires ${mbMem}, but selected RAM is ${ramMem}.`
      );
    }
  }

  // 3. Form factor compatibility (Motherboard vs Case)
  if (build.motherboard && build.case) {
    const mbForm = build.motherboard.formFactor;
    const caseForm = build.case.formFactor;
    if (caseForm === 'Mini-ITX' && mbForm !== 'Mini-ITX') {
      blockers.push(
        `Size conflict: Compact Mini-ITX case cannot fit a standard ${mbForm} motherboard.`
      );
    }
  }

  // 4. GPU length vs Case clearance
  if (build.gpu && build.case) {
    if (build.gpu.gpuLengthMm && build.case.maxGpuLengthMm) {
      if (build.gpu.gpuLengthMm > build.case.maxGpuLengthMm) {
        blockers.push(
          `GPU length clearance exceeded: ${build.gpu.name} is ${build.gpu.gpuLengthMm}mm, but case maximum is ${build.case.maxGpuLengthMm}mm.`
        );
      } else if (build.case.maxGpuLengthMm - build.gpu.gpuLengthMm < 15) {
        warnings.push(
          `Tight GPU clearance (${build.case.maxGpuLengthMm - build.gpu.gpuLengthMm}mm remaining). Front radiator placement might be restricted.`
        );
      }
    }
  }

  // 5. Cooler height vs Case clearance
  if (build.cooler && build.case) {
    if (build.cooler.coolerHeightMm && build.case.maxCoolerHeightMm) {
      if (build.cooler.coolerHeightMm > build.case.maxCoolerHeightMm) {
        blockers.push(
          `CPU cooler height (${build.cooler.coolerHeightMm}mm) exceeds case clearance (${build.case.maxCoolerHeightMm}mm). The side panel will not close.`
        );
      }
    }
  }

  // 6. Bottleneck warnings
  if (build.cpu && build.gpu) {
    if (build.gpu.id.includes('4090') && build.cpu.price < 300) {
      warnings.push(
        `Potential CPU bottleneck: Pairing an RTX 4090 with an entry processor may limit maximum frames in competitive 1080p/1440p titles.`
      );
    }
  }

  // Calculate synthetic performance scores (0 - 100)
  const cpuTier = build.cpu?.price ? Math.min(100, Math.round((build.cpu.price / 700) * 100)) : 40;
  const gpuTier = build.gpu?.price ? Math.min(100, Math.round((build.gpu.price / 2000) * 100)) : 30;
  const ramTier = build.ram?.price ? Math.min(100, Math.round((build.ram.price / 250) * 100)) : 50;

  const performanceScore = {
    gaming1080p: Math.min(100, Math.round(cpuTier * 0.5 + gpuTier * 0.5)),
    gaming1440p: Math.min(100, Math.round(cpuTier * 0.35 + gpuTier * 0.65)),
    gaming4k: Math.min(100, Math.round(cpuTier * 0.15 + gpuTier * 0.85)),
    creator: Math.min(100, Math.round(cpuTier * 0.45 + gpuTier * 0.35 + ramTier * 0.2)),
    aiWorkload: Math.min(100, Math.round(gpuTier * 0.8 + ramTier * 0.2)),
  };

  return {
    compatible: blockers.length === 0,
    blockers,
    warnings,
    totalPowerWatts,
    recommendedPsuWatts,
    psuHeadroomPercent,
    performanceScore,
  };
}

export function isPartCompatibleWithBuild(part: PartProduct, build: BuildSelection): { compatible: boolean; reason?: string } {
  // Check if testing this candidate part produces a blocker
  const tempBuild: BuildSelection = {
    ...build,
    [part.category]: part,
  };

  const result = checkBuildCompatibility(tempBuild);
  if (!result.compatible) {
    // Find blocker related to this part category
    const relevantBlocker = result.blockers.find(
      (b) => b.toLowerCase().includes(part.name.toLowerCase()) || b.toLowerCase().includes(part.category)
    );
    return {
      compatible: false,
      reason: relevantBlocker || result.blockers[0],
    };
  }

  return { compatible: true };
}
