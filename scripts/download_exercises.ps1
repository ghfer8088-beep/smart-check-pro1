$outDir = 'assets\exercises'
if (!(Test-Path $outDir)) { New-Item -ItemType Directory -Force -Path $outDir | Out-Null }

$files = @{
    "wrist_extensor_stretch.png" = "https://upload.wikimedia.org/wikipedia/commons/4/48/Exercise_Wrist_Extensor_Stretch.png"
    "wrist_flexor_stretch.png" = "https://upload.wikimedia.org/wikipedia/commons/a/a7/Exercise_Wrist_Flexor_Stretch.png"
    "wrist_curls.png" = "https://upload.wikimedia.org/wikipedia/commons/2/29/Exercise_Wrist_Curls.png"
    "finger_extensions.png" = "https://upload.wikimedia.org/wikipedia/commons/7/72/Exercise_Finger_Extensions.png"
    "forearm_rotation.png" = "https://upload.wikimedia.org/wikipedia/commons/e/ee/Exercise_Forearm_Rotation.png"
    "pendulum_swings.png" = "https://upload.wikimedia.org/wikipedia/commons/4/47/Exercise_Pendulum_Swings.png"
    "neck_bends.png" = "https://upload.wikimedia.org/wikipedia/commons/7/7d/Exercise_Neck_Bends.png"
    "neck_flexion.png" = "https://upload.wikimedia.org/wikipedia/commons/f/fc/Exercise_Neck_Flexion.png"
    "neck_shrugs.png" = "https://upload.wikimedia.org/wikipedia/commons/6/6b/Exercise_Neck_Shrugs.png"
    "neck_glide.png" = "https://upload.wikimedia.org/wikipedia/commons/2/20/Exercise_NeckGlide.png"
    "quad_set.png" = "https://upload.wikimedia.org/wikipedia/commons/e/e1/Exercise_Quad_Set.png"
    "straight_leg_raises.png" = "https://upload.wikimedia.org/wikipedia/commons/f/f0/Exercise_Straight_Leg_Raises.png"
    "terminal_knee_extension.png" = "https://upload.wikimedia.org/wikipedia/commons/e/e7/Exercise_Terminal_Knee_Extension.png"
    "chair_squat.png" = "https://upload.wikimedia.org/wikipedia/commons/8/88/Exercise_Chair_Squat.png"
    "heel_raise_one_leg.png" = "https://upload.wikimedia.org/wikipedia/commons/5/52/Exercise_Heel_Raise_One_Leg.png"
    "heel_raise_two_legs.png" = "https://upload.wikimedia.org/wikipedia/commons/f/f8/Exercise_Heel_Raise_Two_Legs.png"
    "ankle_bends.png" = "https://upload.wikimedia.org/wikipedia/commons/3/38/Exercise_Ankle_Bends.png"
    "ankle_rotation.png" = "https://upload.wikimedia.org/wikipedia/commons/9/97/Exercise_Ankle_Rotation.png"
    "slant_board_stretch.png" = "https://upload.wikimedia.org/wikipedia/commons/a/a7/Exercise_Slant_Board_Stretch.png"
    "towel_slides.png" = "https://upload.wikimedia.org/wikipedia/commons/7/72/Exercise_Towel_Slides.png"
    "press_up.png" = "https://upload.wikimedia.org/wikipedia/commons/a/ae/Exercise_Press_Up.png"
    "lower_trunk_rotation.png" = "https://upload.wikimedia.org/wikipedia/commons/c/c4/Exercise_Lower_Trunk_Rotation.png"
    "buttocks_stretch.png" = "https://upload.wikimedia.org/wikipedia/commons/7/7d/Exercise_Buttocks_Stretch.png"
    "thigh_cross.png" = "https://upload.wikimedia.org/wikipedia/commons/8/89/Exercise_Thigh_Cross.png"
    "stork_stand.png" = "https://upload.wikimedia.org/wikipedia/commons/6/63/Exercise_Stork_Stand.png"
}

$wc = New-Object System.Net.WebClient
$wc.Headers.Add("User-Agent", "SmartCheckProMedicalExerciseBot/1.0 (Windows NT 10.0; Win64; x64)")

foreach ($pair in $files.GetEnumerator()) {
    $dest = Join-Path $outDir $pair.Key
    try {
        Write-Host "Downloading $($pair.Key)..."
        $wc.DownloadFile($pair.Value, $dest)
        Write-Host "Success: $dest"
    } catch {
        Write-Host "Error downloading $($pair.Key): $_"
    }
}
Write-Host "Done downloading all medical exercises!"
