import confetti from 'canvas-confetti';

export type CelebrationType = 
  | 'confetti' 
  | 'fireworks' 
  | 'sparkles' 
  | 'stars'
  | 'burst'
  | 'fountain'
  | 'spiral'
  | 'rainbow'
  | 'hearts'
  | 'balloons';

// Sound effect URLs
const SOUND_EFFECTS = {
  success: '/sounds/correct.mp3',
  failure: '/sounds/wrong.mp3',
  click: '/sounds/click.mp3'
};

export interface CelebrationPreferences {
  soundEnabled: boolean;
  celebrationsEnabled: boolean;
  volume: number;
}

export function getPreferences(): CelebrationPreferences {
  if (typeof window === 'undefined') {
    return { soundEnabled: true, celebrationsEnabled: true, volume: 0.3 };
  }
  
  const stored = localStorage.getItem('microbreak-preferences');
  if (stored) {
    try {
      return JSON.parse(stored);
    } catch {
      return { soundEnabled: true, celebrationsEnabled: true, volume: 0.3 };
    }
  }
  return { soundEnabled: true, celebrationsEnabled: true, volume: 0.3 };
}

export function setPreferences(prefs: CelebrationPreferences) {
  if (typeof window === 'undefined') return;
  localStorage.setItem('microbreak-preferences', JSON.stringify(prefs));
}

export function playSound(type: 'success' | 'failure', volumeOverride?: number) {
  const prefs = getPreferences();
  if (!prefs.soundEnabled) return;
  
  const sound = SOUND_EFFECTS[type];
  const volume = volumeOverride ?? prefs.volume;
  
  const audio = new Audio(sound);
  audio.volume = volume;
  audio.play().catch(err => {
    console.log('Audio play failed:', err.message);
  });
}

export function playClickSound(volumeOverride?: number) {
  const prefs = getPreferences();
  if (!prefs.soundEnabled) return;
  
  const audio = new Audio(SOUND_EFFECTS.click);
  audio.volume = volumeOverride ?? prefs.volume ?? 0.3;
  audio.play().catch(err => {
    console.log('Click sound failed:', err.message);
  });
}

export function triggerCelebration(type?: CelebrationType) {
  const prefs = getPreferences();
  if (!prefs.celebrationsEnabled) return;
  
  const celebrationType = type || getRandomCelebration();
  
  switch (celebrationType) {
    case 'confetti':
      triggerConfetti();
      break;
    case 'fireworks':
      triggerFireworks();
      break;
    case 'sparkles':
      triggerSparkles();
      break;
    case 'stars':
      triggerStars();
      break;
    case 'burst':
      triggerBurst();
      break;
    case 'fountain':
      triggerFountain();
      break;
    case 'spiral':
      triggerSpiral();
      break;
    case 'rainbow':
      triggerRainbow();
      break;
    case 'hearts':
      triggerHearts();
      break;
    case 'balloons':
      triggerBalloons();
      break;
  }
}

function getRandomCelebration(): CelebrationType {
  const types: CelebrationType[] = [
    'confetti', 'fireworks', 'sparkles', 'stars',
    'burst', 'fountain', 'spiral', 'rainbow', 'hearts', 'balloons'
  ];
  return types[Math.floor(Math.random() * types.length)];
}

function triggerConfetti() {
  confetti({
    particleCount: 100,
    spread: 70,
    origin: { y: 0.6 }
  });
}

function triggerFireworks() {
  const duration = 1000;
  const animationEnd = Date.now() + duration;
  
  const firework = () => {
    confetti({
      particleCount: 30,
      angle: 60,
      spread: 55,
      origin: { x: 0, y: 0.6 },
      colors: ['#ff0000', '#ffa500', '#ffff00']
    });
    confetti({
      particleCount: 30,
      angle: 120,
      spread: 55,
      origin: { x: 1, y: 0.6 },
      colors: ['#0000ff', '#00ff00', '#ff00ff']
    });
    
    if (Date.now() < animationEnd) {
      requestAnimationFrame(firework);
    }
  };
  
  firework();
}

function triggerSparkles() {
  const duration = 800;
  const animationEnd = Date.now() + duration;
  
  const sparkle = () => {
    confetti({
      particleCount: 3,
      angle: 60,
      spread: 360,
      origin: { x: Math.random(), y: Math.random() - 0.2 },
      colors: ['#FFD700', '#FFA500', '#FF69B4'],
      shapes: ['star'],
      scalar: 1.2
    });
    
    if (Date.now() < animationEnd) {
      requestAnimationFrame(sparkle);
    }
  };
  
  sparkle();
}

function triggerStars() {
  confetti({
    particleCount: 50,
    spread: 100,
    origin: { y: 0.5 },
    shapes: ['star'],
    colors: ['#FFD700', '#FFA500', '#FFFF00'],
    scalar: 1.5
  });
}

function triggerBurst() {
  confetti({
    particleCount: 150,
    spread: 180,
    origin: { y: 0.5 },
    startVelocity: 45,
    colors: ['#ff0000', '#00ff00', '#0000ff', '#ffff00', '#ff00ff', '#00ffff']
  });
}

function triggerFountain() {
  const duration = 1500;
  const animationEnd = Date.now() + duration;
  
  const fountain = () => {
    confetti({
      particleCount: 10,
      angle: 90,
      spread: 45,
      origin: { x: 0.5, y: 1 },
      colors: ['#26ccff', '#a25afd', '#ff5e7e', '#88ff5a', '#fcff42'],
      startVelocity: 55,
      gravity: 1.2
    });
    
    if (Date.now() < animationEnd) {
      requestAnimationFrame(fountain);
    }
  };
  
  fountain();
}

function triggerSpiral() {
  const duration = 1200;
  const animationEnd = Date.now() + duration;
  let angle = 0;
  
  const spiral = () => {
    confetti({
      particleCount: 5,
      angle: angle,
      spread: 30,
      origin: { x: 0.5, y: 0.5 },
      colors: ['#FFD700', '#FF69B4', '#00CED1'],
      scalar: 1.3
    });
    
    angle += 30;
    if (Date.now() < animationEnd) {
      requestAnimationFrame(spiral);
    }
  };
  
  spiral();
}

function triggerRainbow() {
  const colors = ['#ff0000', '#ff7f00', '#ffff00', '#00ff00', '#0000ff', '#4b0082', '#9400d3'];
  
  colors.forEach((color, i) => {
    setTimeout(() => {
      confetti({
        particleCount: 40,
        angle: 60 + (i * 10),
        spread: 55,
        origin: { x: 0.5, y: 0.6 },
        colors: [color]
      });
    }, i * 100);
  });
}

function triggerHearts() {
  confetti({
    particleCount: 60,
    spread: 100,
    origin: { y: 0.6 },
    shapes: ['circle'],
    colors: ['#ff1744', '#f50057', '#ff4081', '#ff80ab'],
    scalar: 1.5,
    flat: true
  });
}

function triggerBalloons() {
  const duration = 2000;
  const animationEnd = Date.now() + duration;
  
  const balloons = () => {
    confetti({
      particleCount: 3,
      angle: 90,
      spread: 50,
      origin: { x: Math.random(), y: 1 },
      colors: ['#ff6b6b', '#4ecdc4', '#45b7d1', '#f9ca24', '#6c5ce7'],
      shapes: ['circle'],
      scalar: 2,
      gravity: -0.3,
      drift: (Math.random() - 0.5) * 2
    });
    
    if (Date.now() < animationEnd) {
      setTimeout(balloons, 200);
    }
  };
  
  balloons();
}
