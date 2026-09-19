document.addEventListener('DOMContentLoaded', () => {
  // ELEMENTOS DO DOM
  const form = document.getElementById('candidate-form');
  const modalSuccess = document.getElementById('modal-success');
  const btnCloseSuccess = document.getElementById('btn-close-success');
  const successMessage = document.getElementById('success-message');

  const jumpscareOverlay = document.getElementById('jumpscare-overlay');
  const btnCloseJumpscare = document.getElementById('btn-close-jumpscare');
  const jumpscareText = document.getElementById('jumpscare-text');

  const zombieCursor = document.getElementById('zombie-cursor');
  const canvas = document.getElementById('bg-canvas');
  const ctx = canvas.getContext('2d');

  // AUDIO CONTEXT PARA SINTETIZAR O SOM DE JUMPSCARE (SEM DEPENDÊNCIAS EXTERNAS)
  let audioCtx = null;

  function playJumpscareSound() {
    try {
      if (!audioCtx) {
        audioCtx = new (window.AudioContext || window.webkitAudioContext)();
      }
      if (audioCtx.state === 'suspended') {
        audioCtx.resume();
      }

      // Ruído Branco (Screamer sound effect)
      const bufferSize = audioCtx.sampleRate * 1.2;
      const buffer = audioCtx.createBuffer(1, bufferSize, audioCtx.sampleRate);
      const output = buffer.getChannelData(0);
      for (let i = 0; i < bufferSize; i++) {
        output[i] = Math.random() * 2 - 1;
      }

      const whiteNoise = audioCtx.createBufferSource();
      whiteNoise.buffer = buffer;

      const filter = audioCtx.createBiquadFilter();
      filter.type = 'lowpass';
      filter.frequency.setValueAtTime(3000, audioCtx.currentTime);

      const gain = audioCtx.createGain();
      gain.gain.setValueAtTime(1, audioCtx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.01, audioCtx.currentTime + 1.2);

      whiteNoise.connect(filter);
      filter.connect(gain);
      gain.connect(audioCtx.destination);

      whiteNoise.start();
    } catch (e) {
      console.log('Audio Autoplay restrito pelo navegador:', e);
    }
  }

  // REGRA DE NEGÓCIO E VALIDAÇÃO
  form.addEventListener('submit', (e) => {
    e.preventDefault();

    const nome = document.getElementById('nome').value.trim();
    const idade = parseInt(document.getElementById('idade').value);
    const altura = parseFloat(document.getElementById('altura').value);

    // Critério: Idade >= 18 E Altura >= 1.70m
    if (idade >= 18 && altura >= 1.70) {
      // APTO
      successMessage.textContent = `Olá ${nome}, parabéns! Você pode prosseguir no processo para a vaga!`;
      modalSuccess.classList.remove('hidden');
    } else {
      // NÃO APTO -> JUMPSCARE
      jumpscareText.textContent = `Infelizmente você não é apto à vaga, ${nome}.`;
      jumpscareOverlay.classList.remove('hidden');
      playJumpscareSound();
    }
  });

  // BOTÕES PARA FECHAR MODAIS
  btnCloseSuccess.addEventListener('click', () => {
    modalSuccess.classList.add('hidden');
    form.reset();
  });

  btnCloseJumpscare.addEventListener('click', () => {
    jumpscareOverlay.classList.add('hidden');
    form.reset();
  });

  // SEGUIMENTO DO CURSOR DE ZUMBI
  window.addEventListener('mousemove', (e) => {
    zombieCursor.style.left = `${e.clientX}px`;
    zombieCursor.style.top = `${e.clientY}px`;
  });

  // ANIMAÇÃO DE FUNDO DO CANVAS (CEMITÉRIO NOTURNO & MORTOS-VIVOS)
  function resizeCanvas() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
  }
  window.addEventListener('resize', resizeCanvas);
  resizeCanvas();

  // Objetos do fundo
  const zombies = [
    { x: -50, speed: 0.8, scale: 0.8 },
    { x: -200, speed: 0.5, scale: 0.6 },
    { x: -350, speed: 1.1, scale: 1.0 }
  ];

  function drawScene() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Luar do Cemitério
    const moonX = canvas.width * 0.8;
    const moonY = 120;
    const moonGlow = ctx.createRadialGradient(moonX, moonY, 10, moonX, moonY, 200);
    moonGlow.addColorStop(0, 'rgba(255, 255, 220, 1)');
    moonGlow.addColorStop(0.2, 'rgba(200, 220, 255, 0.4)');
    moonGlow.addColorStop(1, 'rgba(0, 0, 0, 0)');
    ctx.fillStyle = moonGlow;
    ctx.beginPath();
    ctx.arc(moonX, moonY, 200, 0, Math.PI * 2);
    ctx.fill();

    // Lua
    ctx.fillStyle = '#fffde8';
    ctx.beginPath();
    ctx.arc(moonX, moonY, 45, 0, Math.PI * 2);
    ctx.fill();

    // Silhuetas do Horizonte / Lápides
    const groundY = canvas.height - 80;
    ctx.fillStyle = '#070b10';
    ctx.fillRect(0, groundY, canvas.width, 80);

    // Desenhar Lápides
    ctx.fillStyle = '#0a1017';
    for (let i = 50; i < canvas.width; i += 180) {
      ctx.fillRect(i, groundY - 30, 20, 30);
      ctx.beginPath();
      ctx.arc(i + 10, groundY - 30, 10, Math.PI, 0);
      ctx.fill();
    }

    // Desenhar Zumbis Caminhando
    zombies.forEach((z) => {
      z.x += z.speed;
      if (z.x > canvas.width + 50) z.x = -100;

      const zy = groundY - 40 * z.scale;

      ctx.fillStyle = '#000000';
      // Corpo
      ctx.fillRect(z.x, zy, 14 * z.scale, 35 * z.scale);
      // Cabeça
      ctx.beginPath();
      ctx.arc(z.x + 7 * z.scale, zy - 8 * z.scale, 8 * z.scale, 0, Math.PI * 2);
      ctx.fill();
      // Olhos Verdes Brilhantes
      ctx.fillStyle = '#00ff44';
      ctx.fillRect(z.x + 9 * z.scale, zy - 10 * z.scale, 2 * z.scale, 2 * z.scale);
    });

    requestAnimationFrame(drawScene);
  }

  drawScene();
});