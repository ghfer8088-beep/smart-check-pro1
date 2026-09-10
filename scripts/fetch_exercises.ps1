$headers = @{
    "User-Agent" = "SmartCheckProApp/1.0 (contact@smartcheckpro.org; medical physical therapy education tool)"
}

$urls = @{
    "wrist_extensor_stretch.png" = "https://upload.wikimedia.org/wikipedia/commons/thumb/4/48/Exercise_Wrist_Extensor_Stretch.png/500px-Exercise_Wrist_Extensor_Stretch.png"
    "wrist_flexor_stretch.png" = "https://upload.wikimedia.org/wikipedia/commons/thumb/a/a7/Exercise_Wrist_Flexor_Stretch.png/500px-Exercise_Wrist_Flexor_Stretch.png"
    "wrist_curls.png" = "https://upload.wikimedia.org/wikipedia/commons/thumb/2/29/Exercise_Wrist_Curls.png/500px-Exercise_Wrist_Curls.png"
    "finger_extensions.png" = "https://upload.wikimedia.org/wikipedia/commons/thumb/7/72/Exercise_Finger_Extensions.png/500px-Exercise_Finger_Extensions.png"
    "forearm_rotation.png" = "https://upload.wikimedia.org/wikipedia/commons/thumb/e/ee/Exercise_Forearm_Rotation.png/500px-Exercise_Forearm_Rotation.png"
    "pendulum_swings.png" = "https://upload.wikimedia.org/wikipedia/commons/thumb/4/47/Exercise_Pendulum_Swings.png/500px-Exercise_Pendulum_Swings.png"
    "neck_bends.png" = "https://upload.wikimedia.org/wikipedia/commons/thumb/7/7d/Exercise_Neck_Bends.png/500px-Exercise_Neck_Bends.png"
    "neck_flexion.png" = "https://upload.wikimedia.org/wikipedia/commons/thumb/f/fc/Exercise_Neck_Flexion.png/500px-Exercise_Neck_Flexion.png"
    "neck_shrugs.png" = "https://upload.wikimedia.org/wikipedia/commons/thumb/6/6b/Exercise_Neck_Shrugs.png/500px-Exercise_Neck_Shrugs.png"
    "neck_glide.png" = "https://upload.wikimedia.org/wikipedia/commons/thumb/2/20/Exercise_NeckGlide.png/500px-Exercise_NeckGlide.png"
    "quad_set.png" = "https://upload.wikimedia.org/wikipedia/commons/thumb/e/e1/Exercise_Quad_Set.png/500px-Exercise_Quad_Set.png"
    "straight_leg_raises.png" = "https://upload.wikimedia.org/wikipedia/commons/thumb/f/f0/Exercise_Straight_Leg_Raises.png/500px-Exercise_Straight_Leg_Raises.png"
    "terminal_knee_extension.png" = "https://upload.wikimedia.org/wikipedia/commons/thumb/e/e7/Exercise_Terminal_Knee_Extension.png/500px-Exercise_Terminal_Knee_Extension.png"
    "chair_squat.png" = "https://upload.wikimedia.org/wikipedia/commons/thumb/8/88/Exercise_Chair_Squat.png/500px-Exercise_Chair_Squat.png"
    "heel_raise_one_leg.png" = "https://upload.wikimedia.org/wikipedia/commons/thumb/5/52/Exercise_Heel_Raise_One_Leg.png/500px-Exercise_Heel_Raise_One_Leg.png"
    "heel_raise_two_legs.png" = "https://upload.wikimedia.org/wikipedia/commons/thumb/f/f8/Exercise_Heel_Raise_Two_Legs.png/500px-Exercise_Heel_Raise_Two_Legs.png"
    "ankle_bends.png" = "https://upload.wikimedia.org/wikipedia/commons/thumb/3/38/Exercise_Ankle_Bends.png/500px-Exercise_Ankle_Bends.png"
    "ankle_rotation.png" = "https://upload.wikimedia.org/wikipedia/commons/thumb/9/97/Exercise_Ankle_Rotation.png/500px-Exercise_Ankle_Rotation.png"
    "slant_board_stretch.png" = "https://upload.wikimedia.org/wikipedia/commons/thumb/a/a7/Exercise_Slant_Board_Stretch.png/500px-Exercise_Slant_Board_Stretch.png"
    "towel_slides.png" = "https://upload.wikimedia.org/wikipedia/commons/thumb/7/72/Exercise_Towel_Slides.png/500px-Exercise_Towel_Slides.png"
    "press_up.png" = "https://upload.wikimedia.org/wikipedia/commons/thumb/a/ae/Exercise_Press_Up.png/500px-Exercise_Press_Up.png"
    "lower_trunk_rotation.png" = "https://upload.wikimedia.org/wikipedia/commons/thumb/c/c4/Exercise_Lower_Trunk_Rotation.png/500px-Exercise_Lower_Trunk_Rotation.png"
    "buttocks_stretch.png" = "https://upload.wikimedia.org/wikipedia/commons/thumb/7/7d/Exercise_Buttocks_Stretch.png/500px-Exercise_Buttocks_Stretch.png"
    "thigh_cross.png" = "https://upload.wikimedia.org/wikipedia/commons/thumb/8/89/Exercise_Thigh_Cross.png/500px-Exercise_Thigh_Cross.png"
    "stork_stand.png" = "https://upload.wikimedia.org/wikipedia/commons/thumb/6/63/Exercise_Stork_Stand.png/500px-Exercise_Stork_Stand.png"
}

foreach ($key in $urls.Keys) {
    $dest = "assets\exercises\$key"
    try {
        Invoke-WebRequest -Uri $urls[$key] -Headers $headers -OutFile $dest
        Write-Host "Success: $key"
        Start-Sleep -Milliseconds 800
    } catch {
        Write-Host "Failed: $key - $_"
    }
}
