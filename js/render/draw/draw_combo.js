'use strict';

function drawCombo(dt) {
    // Dont draw anything if combo hasn't changed or timer animation ran out
    if (! gameState.combo_changed && gameState.combo_animation_timer <= 0 ) {
        return;
    }
    if (gameState.combo === 1) {
        return; // No need to show "Combo x1"
    }

    canvas2d.font = '16px Arial';
    let comboStr = 'Combo x' + gameState.combo + '!';
    if (gameState.combo === 0) {
        comboStr = 'Combo broken!';
    }
    const textWidth = canvas2d.measureText(comboStr).width;
    const xCenter = (CanvasConfig.W - textWidth) / 2;
    
    if (gameState.combo_changed) {
        gameState.combo_animation_timer = AnimationConfig.COMBO_DURATION; // Show combo for a short duration
        gameState.combo_changed = false;
    }
    else {
        gameState.combo_animation_timer -= dt;
    }
    
    if (gameState.combo_animation_timer > 0) {
        canvas2d.fillStyle = 'rgba(255, 0, 0, ' + (gameState.combo_animation_timer * 2) + ')';
        canvas2d.fillText(comboStr, xCenter, 50);
    }
    
}