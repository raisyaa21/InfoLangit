/* ── Tab switch ── */
function switchTab(name, btn) {
  document.querySelectorAll('.tab').forEach(t => t.classList.remove('active'));
  document.querySelectorAll('.panel').forEach(p => p.classList.remove('active'));
  btn.classList.add('active');
  document.getElementById('panel-' + name).classList.add('active');
}

/* ── Ripple ── */
function addRipple(e, el) {
  const r = document.createElement('span');
  r.className = 'ripple';
  const rect = el.getBoundingClientRect();
  const size = Math.max(rect.width, rect.height);
  r.style.cssText = `width:${size}px;height:${size}px;left:${e.clientX-rect.left-size/2}px;top:${e.clientY-rect.top-size/2}px`;
  el.appendChild(r);
  r.addEventListener('animationend', () => r.remove());
}

/* ── AQI count-up ── */
function countUp(el, target, decimals, delay) {
  setTimeout(() => {
    const dur = 1200, start = performance.now();
    function step(now) {
      const p = Math.min((now - start) / dur, 1);
      const ease = 1 - Math.pow(1 - p, 3);
      el.textContent = (target * ease).toFixed(decimals);
      if (p < 1) requestAnimationFrame(step);
      else el.textContent = target.toFixed(decimals);
    }
    requestAnimationFrame(step);
  }, delay);
}
countUp(document.getElementById('aqi-num'), 83, 0, 850);
countUp(document.getElementById('pm25'), 22.4, 1, 900);
countUp(document.getElementById('pm10'), 41.2, 1, 950);
countUp(document.getElementById('o3'),   68,   0, 1000);
countUp(document.getElementById('no2'),  31,   0, 1050);

/* ── Rain canvas ── */
const canvas = document.getElementById('rain');
const ctx = canvas.getContext('2d');
let drops = [];
let raining = false;

function resizeCanvas() {
  canvas.width  = window.innerWidth;
  canvas.height = window.innerHeight;
}
resizeCanvas();
window.addEventListener('resize', resizeCanvas);

function createDrop() {
  return {
    x: Math.random() * canvas.width,
    y: Math.random() * -canvas.height,
    len: Math.random() * 18 + 8,
    speed: Math.random() * 8 + 10,
    opacity: Math.random() * 0.4 + 0.15,
    width: Math.random() * 1.2 + 0.4
  };
}

function initRain(n) {
  drops = Array.from({length: n}, createDrop);
}

function drawRain() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  if (!raining) return;
  drops.forEach(d => {
    ctx.beginPath();
    ctx.moveTo(d.x, d.y);
    ctx.lineTo(d.x - d.len * 0.18, d.y + d.len);
    ctx.strokeStyle = `rgba(130,190,230,${d.opacity})`;
    ctx.lineWidth = d.width;
    ctx.lineCap = 'round';
    ctx.stroke();
    d.y += d.speed;
    if (d.y > canvas.height + d.len) {
      d.y = -d.len - Math.random() * 80;
      d.x = Math.random() * canvas.width;
    }
  });
  requestAnimationFrame(drawRain);
}

/* Start rain at 16:00 section (delayed a bit for drama) */
setTimeout(() => {
  raining = true;
  initRain(120);
  canvas.style.opacity = '0.7';
  drawRain();
  /* stop after 6s */
  setTimeout(() => {
    canvas.style.opacity = '0';
    setTimeout(() => { raining = false; }, 1500);
  }, 6000);
}, 3500);
