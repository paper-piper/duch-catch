'use strict';

function drawCombo(dt) {
    // Dont draw anything if combo hasn't changed or timer animation ran out
    if (! gameState.combo_changed && gameState.combo_animation_timer <= 0 ) {
        return;
    }
    if (gameState.combo === 1) {
        return; // No need to show "Combo x1"
    }

    let comboStr = 'Combo x' + gameState.combo + '!';
    if (gameState.combo === 0) {
        comboStr = 'Combo broken!';
    }
    const textWidth = canvas2d.measureText(comboStr).width;
    
    if (gameState.combo_changed) {
        gameState.combo_animation_timer = AnimationConfig.COMBO_DURATION; // Show combo for a short duration
        gameState.combo_changed = false;
        gameState.combo_x = Math.floor(Math.random() * (CanvasConfig.W - textWidth)) + textWidth / 2;
        gameState.combo_y = Math.floor(Math.random() * 100) + 50;
        gameState.combo_rotation = (Math.random() - 0.5) * 30;
    }
    else {
        gameState.combo_animation_timer -= dt;
    }
    
    if (gameState.combo_animation_timer > 0) {

        canvas2d.save();
        canvas2d.translate(gameState.combo_x, gameState.combo_y);  
        canvas2d.rotate(gameState.combo_rotation * Math.PI / 180);    
        canvas2d.font = 'bold 16px Arial';
          canvas2d.fillStyle = '#f00';
        canvas2d.fillText(comboStr, 0, 0); // draw at origin
        canvas2d.restore();
    }
    
}