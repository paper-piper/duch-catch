'use strict';

function updateCombo(dt) {
    if (!gameState.combo_changed && gameState.combo_animation_timer <= 0) {
        return;
    }
    if (gameState.combo === 1) {
        return;
    }

    if (gameState.combo_changed) {
        initComboProperties();
    } else {
        gameState.combo_animation_timer -= dt;
    }
}

function drawCombo() {
    if (gameState.combo_animation_timer <= 0) {
        return;
    }
    if (gameState.combo === 1) {
        return;
    }

    canvas2d.save();
    canvas2d.translate(gameState.combo_x, gameState.combo_y);
    canvas2d.rotate(gameState.combo_rotation * Math.PI / 180);
    canvas2d.font = 'bold 16px Arial';
    canvas2d.fillStyle = '#f00';
    canvas2d.fillText(gameState.combo_str, 0, 0);
    canvas2d.restore();
}

function initComboProperties(){
    if (gameState.combo === 0){
        gameState.combo_str = 'Combo broken!';
        const textWidth = canvas2d.measureText(gameState.combo_str).width;
        gameState.combo_x = (CanvasConfig.W / 2) - (textWidth / 2);
        gameState.combo_y = 70;
        gameState.combo_rotation = 0;
    } else {
        gameState.combo_str = 'Combo x' + gameState.combo + '!';
        const textWidth = canvas2d.measureText(gameState.combo_str).width;
        gameState.combo_x = Math.floor(Math.random() * (CanvasConfig.W - textWidth)) + textWidth / 2;
        gameState.combo_y = Math.floor(Math.random() * 100) + 50;
        gameState.combo_rotation = (Math.random() - 0.5) * 30;
    }

    gameState.combo_animation_timer = AnimationConfig.COMBO_DURATION; // Show combo for a short duration
    gameState.combo_changed = false;
    
}