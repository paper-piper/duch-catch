class Particle {
  constructor(x, y, bread_type) {
    this.x = x;
    this.y = y;
    this.size = ParticleConfig.MIN_SIZE + Math.random() * (ParticleConfig.MAX_SIZE - ParticleConfig.MIN_SIZE);
    const colors = bread_type === 'rotten' ? ParticleConfig.BREAD_ROTTEN_COLORS : ParticleConfig.BREAD_COLORS;
    this.color = colors[Math.floor(Math.random() * colors.length)];
    this.velocityX = (Math.random() - 0.5) * 2 * ParticleConfig.MAX_X_VELOCITY;
    this.velocityY = ParticleConfig.MIN_Y_VELOCITY + Math.random() * (ParticleConfig.MAX_Y_VELOCITY - ParticleConfig.MIN_Y_VELOCITY);
    this.timer = ParticleConfig.MIN_LIFETIME + Math.random() * (ParticleConfig.MAX_LIFETIME - ParticleConfig.MIN_LIFETIME);
  }
  
  tick_particle(dt) {
    this.velocityY += ParticleConfig.GRAVITY * dt;
    this.x += this.velocityX * dt;
    this.y += this.velocityY * dt;
    this.timer -= dt;
  }
}

function spawnParticlesBurst(breadX, BreadY, BreadType) {
    const particles = [];
    for (let i = 0; i < ParticleConfig.PARTICLES_PER_BURST; i++) {
        const particlX = breadX + (Math.random() - 0.5) * ParticleConfig.POSITION_VARIANCE;
        const particlY = BreadY + (Math.random() - 0.5) * ParticleConfig.POSITION_VARIANCE;
        particles.push(new Particle(particlX, particlY, BreadType));
    }
    return particles;
}
function ticks_all_particles(dt) {
  for (const p of gameState.particles) {
    p.tick_particle(dt);
  }
  gameState.particles = gameState.particles.filter(p => p.timer > 0);
}