# Doorway Chest Stretch SVG
$doorwaySvg = @'
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 500 400" width="100%" height="100%">
  <rect width="100%" height="100%" fill="#ffffff"/>
  <!-- Door frame -->
  <rect x="80" y="30" width="25" height="340" fill="#cbd5e1" stroke="#94a3b8" stroke-width="2"/>
  <rect x="395" y="30" width="25" height="340" fill="#cbd5e1" stroke="#94a3b8" stroke-width="2"/>
  <rect x="80" y="30" width="340" height="20" fill="#cbd5e1" stroke="#94a3b8" stroke-width="2"/>
  
  <!-- Human figure in doorway -->
  <!-- Legs in lunge step -->
  <line x1="250" y1="240" x2="220" y2="360" stroke="#334155" stroke-width="16" stroke-linecap="round"/>
  <line x1="250" y1="240" x2="285" y2="355" stroke="#1e293b" stroke-width="16" stroke-linecap="round"/>
  <!-- Feet -->
  <path d="M 200 360 L 235 360" stroke="#0f172a" stroke-width="14" stroke-linecap="round"/>
  <path d="M 270 355 L 305 355" stroke="#0f172a" stroke-width="14" stroke-linecap="round"/>
  
  <!-- Torso stepping forward -->
  <line x1="250" y1="130" x2="250" y2="245" stroke="#475569" stroke-width="32" stroke-linecap="round"/>
  
  <!-- Arms on door frame (90 degrees) -->
  <!-- Left arm -->
  <path d="M 250 145 L 170 145 L 105 110" fill="none" stroke="#e2a07f" stroke-width="14" stroke-linecap="round" stroke-linejoin="round"/>
  <!-- Right arm -->
  <path d="M 250 145 L 330 145 L 395 110" fill="none" stroke="#e2a07f" stroke-width="14" stroke-linecap="round" stroke-linejoin="round"/>
  
  <!-- Hands on frame -->
  <circle cx="105" cy="110" r="10" fill="#d97706"/>
  <circle cx="395" cy="110" r="10" fill="#d97706"/>
  
  <!-- Head -->
  <circle cx="250" cy="85" r="28" fill="#fcd34d" stroke="#d97706" stroke-width="3"/>
  
  <!-- Motion arrows showing chest expansion forward -->
  <defs>
    <marker id="arrow" viewBox="0 0 10 10" refX="5" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse">
      <path d="M 0 1 L 10 5 L 0 9 z" fill="#ef4444" />
    </marker>
  </defs>
  <path d="M 250 185 L 250 215" stroke="#ef4444" stroke-width="5" marker-end="url(#arrow)"/>
  <path d="M 210 160 Q 180 180 150 165" fill="none" stroke="#ef4444" stroke-width="4" marker-end="url(#arrow)"/>
  <path d="M 290 160 Q 320 180 350 165" fill="none" stroke="#ef4444" stroke-width="4" marker-end="url(#arrow)"/>
  
  <!-- Label badge -->
  <rect x="130" y="360" width="240" height="28" rx="6" fill="#0f172a"/>
  <text x="250" y="379" font-family="sans-serif" font-size="13" font-weight="bold" fill="#d4af37" text-anchor="middle">Doorway Pectoral Stretch</text>
</svg>
'@
Set-Content -Path 'assets\exercises\doorway_chest_stretch.svg' -Value $doorwaySvg -Encoding utf8

# Shoulder Wall Slide SVG
$wallSlideSvg = @'
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 500 400" width="100%" height="100%">
  <rect width="100%" height="100%" fill="#ffffff"/>
  <!-- Wall line -->
  <line x1="380" y1="20" x2="380" y2="380" stroke="#64748b" stroke-width="8" stroke-linecap="round"/>
  
  <!-- Person facing wall -->
  <line x1="260" y1="250" x2="250" y2="365" stroke="#334155" stroke-width="16" stroke-linecap="round"/>
  <line x1="275" y1="250" x2="280" y2="365" stroke="#1e293b" stroke-width="16" stroke-linecap="round"/>
  
  <!-- Torso standing upright -->
  <line x1="270" y1="130" x2="265" y2="255" stroke="#475569" stroke-width="32" stroke-linecap="round"/>
  
  <!-- Arms reaching up along the wall -->
  <path d="M 270 145 L 330 110 L 375 60" fill="none" stroke="#e2a07f" stroke-width="14" stroke-linecap="round" stroke-linejoin="round"/>
  <!-- Forearms & hands sliding on wall -->
  <circle cx="375" cy="60" r="10" fill="#d97706"/>
  
  <!-- Head looking straight at wall -->
  <circle cx="270" cy="85" r="28" fill="#fcd34d" stroke="#d97706" stroke-width="3"/>
  
  <!-- Upward motion arrows -->
  <defs>
    <marker id="arrowUp" viewBox="0 0 10 10" refX="5" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse">
      <path d="M 0 1 L 10 5 L 0 9 z" fill="#ef4444" />
    </marker>
  </defs>
  <path d="M 350 140 L 370 75" stroke="#ef4444" stroke-width="5" marker-end="url(#arrowUp)"/>
  
  <!-- Label badge -->
  <rect x="130" y="360" width="240" height="28" rx="6" fill="#0f172a"/>
  <text x="250" y="379" font-family="sans-serif" font-size="13" font-weight="bold" fill="#d4af37" text-anchor="middle">Shoulder Wall Slide</text>
</svg>
'@
Set-Content -Path 'assets\exercises\shoulder_wall_slide.svg' -Value $wallSlideSvg -Encoding utf8

# Lateral Shift Correction for Lumbar Disc SVG
$lateralShiftSvg = @'
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 500 400" width="100%" height="100%">
  <rect width="100%" height="100%" fill="#ffffff"/>
  <!-- Wall on the side -->
  <line x1="80" y1="20" x2="80" y2="380" stroke="#64748b" stroke-width="8" stroke-linecap="round"/>
  
  <!-- Person standing sideways to wall -->
  <line x1="250" y1="250" x2="230" y2="365" stroke="#334155" stroke-width="16" stroke-linecap="round"/>
  <line x1="250" y1="250" x2="270" y2="365" stroke="#1e293b" stroke-width="16" stroke-linecap="round"/>
  
  <!-- Torso with lateral glide -->
  <line x1="230" y1="130" x2="260" y2="255" stroke="#475569" stroke-width="32" stroke-linecap="round"/>
  
  <!-- Elbow resting against wall -->
  <path d="M 230 145 L 140 160 L 85 170" fill="none" stroke="#e2a07f" stroke-width="14" stroke-linecap="round" stroke-linejoin="round"/>
  <!-- Other hand pushing pelvis toward wall -->
  <path d="M 230 145 L 300 180 L 275 220" fill="none" stroke="#e2a07f" stroke-width="14" stroke-linecap="round" stroke-linejoin="round"/>
  
  <!-- Head -->
  <circle cx="230" cy="85" r="28" fill="#fcd34d" stroke="#d97706" stroke-width="3"/>
  
  <!-- Arrow pushing hips toward wall to centralize disc -->
  <defs>
    <marker id="arrowLeft" viewBox="0 0 10 10" refX="5" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse">
      <path d="M 0 1 L 10 5 L 0 9 z" fill="#ef4444" />
    </marker>
  </defs>
  <path d="M 340 220 L 260 220" stroke="#ef4444" stroke-width="6" marker-end="url(#arrowLeft)"/>
  
  <!-- Label badge -->
  <rect x="110" y="360" width="280" height="28" rx="6" fill="#0f172a"/>
  <text x="250" y="379" font-family="sans-serif" font-size="13" font-weight="bold" fill="#d4af37" text-anchor="middle">McKenzie Lateral Shift Correction</text>
</svg>
'@
Set-Content -Path 'assets\exercises\lateral_shift_correction.svg' -Value $lateralShiftSvg -Encoding utf8

Write-Host "Created all specialized medical vector diagrams!"
