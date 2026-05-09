// ===== Clock =====
function updateClock() {
    const now = new Date();
    document.getElementById('clock').textContent =
        now.toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit', second: '2-digit' });
}
updateClock();
setInterval(updateClock, 1000);

// ===== Theme Switcher =====
const themeBtns = document.querySelectorAll('.theme-btn');
const html = document.documentElement;

function setTheme(theme) {
    html.setAttribute('data-theme', theme);
    localStorage.setItem('theme', theme);
    themeBtns.forEach(btn => btn.classList.remove('active'));
    const active = document.querySelector(`.theme-btn[data-theme="${theme}"]`);
    if (active) active.classList.add('active');
}

const saved = localStorage.getItem('theme') || 'light';
setTheme(saved);

themeBtns.forEach(btn => btn.addEventListener('click', () => setTheme(btn.dataset.theme)));

// ===== Custom Cursor =====
const cursor = document.getElementById('cursor');
const cursorDot = document.getElementById('cursorDot');
let mouseX = 0, mouseY = 0, cursorX = 0, cursorY = 0;

document.addEventListener('mousemove', e => {
    mouseX = e.clientX; mouseY = e.clientY;
    cursorDot.style.left = (mouseX - 4) + 'px';
    cursorDot.style.top = (mouseY - 4) + 'px';
    createTrail(mouseX, mouseY);
});

function animateCursor() {
    cursorX += (mouseX - cursorX) * 0.15;
    cursorY += (mouseY - cursorY) * 0.15;
    cursor.style.left = (cursorX - 12) + 'px';
    cursor.style.top = (cursorY - 12) + 'px';
    requestAnimationFrame(animateCursor);
}
animateCursor();

let trailCount = 0;
function createTrail(x, y) {
    if (trailCount > 4) return;
    const trail = document.createElement('div');
    trail.className = 'cursor-trail';
    trail.style.left = (x - 5) + 'px';
    trail.style.top = (y - 5) + 'px';
    document.body.appendChild(trail);
    trailCount++;
    setTimeout(() => { trail.remove(); trailCount--; }, 600);
}

document.querySelectorAll('a, button, .tag, input, .social-link, .music-btn').forEach(el => {
    el.addEventListener('mouseenter', () => {
        cursor.style.transform = 'scale(1.6)';
        cursor.style.backgroundColor = 'rgba(108,92,231,0.2)';
    });
    el.addEventListener('mouseleave', () => {
        cursor.style.transform = 'scale(1)';
        cursor.style.backgroundColor = 'transparent';
    });
});

// ===== 3D Tilt =====
document.querySelectorAll('.tilt-element').forEach(el => {
    el.addEventListener('mousemove', e => {
        const rect = el.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        const rotateX = (y - rect.height/2) / 8;
        const rotateY = (rect.width/2 - x) / 8;
        el.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale(1.02)`;
    });
    el.addEventListener('mouseleave', () => {
        el.style.transform = 'perspective(1000px) rotateX(0) rotateY(0) scale(1)';
    });
});

// Avatar tilt mạnh hơn
const avatarImg = document.getElementById('avatarImg');
if (avatarImg) {
    avatarImg.addEventListener('mousemove', e => {
        const rect = avatarImg.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        avatarImg.style.transform = `perspective(600px) rotateX(${(y - rect.height/2)/4}deg) rotateY(${(rect.width/2 - x)/4}deg) scale(1.08)`;
    });
    avatarImg.addEventListener('mouseleave', () => {
        avatarImg.style.transform = 'perspective(600px) rotateX(0) rotateY(0) scale(1)';
    });
}

// ===== Particles Canvas =====
const canvas = document.getElementById('particlesCanvas');
const ctx = canvas.getContext('2d');
let particles = [];

function resizeCanvas() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
}
window.addEventListener('resize', resizeCanvas);
resizeCanvas();

class Particle {
    constructor() { this.reset(); }
    reset() {
        this.x = Math.random() * canvas.width;
        this.y = Math.random() * canvas.height;
        this.z = Math.random() * 500;
        this.size = Math.random() * 4 + 1;
        this.speedX = (Math.random() - 0.5) * 0.4;
        this.speedY = (Math.random() - 0.5) * 0.4;
        this.speedZ = (Math.random() - 0.5) * 0.3;
    }
    update() {
        this.x += this.speedX;
        this.y += this.speedY;
        this.z += this.speedZ;
        if (this.x < 0 || this.x > canvas.width || this.y < 0 || this.y > canvas.height || this.z < -200 || this.z > 700) this.reset();
    }
    draw() {
        const factor = (this.z + 200) / 900;
        const size = this.size * (1 - factor * 0.5);
        const opacity = 0.3 + factor * 0.7;
        const theme = html.getAttribute('data-theme') || 'light';
        let color;
        if (theme === 'cyberpunk') color = `rgba(255,0,255,${opacity})`;
        else if (theme === 'dark') color = `rgba(162,155,254,${opacity})`;
        else color = `rgba(108,92,231,${opacity})`;
        ctx.beginPath();
        ctx.arc(this.x, this.y, size, 0, Math.PI*2);
        ctx.fillStyle = color;
        ctx.fill();
    }
}
for (let i=0; i<70; i++) particles.push(new Particle());

function animateParticles() {
    ctx.clearRect(0,0,canvas.width,canvas.height);
    particles.forEach(p => { p.update(); p.draw(); });
    for (let i=0; i<particles.length; i++) {
        for (let j=i+1; j<particles.length; j++) {
            const dx = particles[i].x - particles[j].x;
            const dy = particles[i].y - particles[j].y;
            const dist = Math.sqrt(dx*dx+dy*dy);
            if (dist < 100) {
                ctx.beginPath();
                ctx.moveTo(particles[i].x, particles[i].y);
                ctx.lineTo(particles[j].x, particles[j].y);
                ctx.strokeStyle = `rgba(108,92,231,${0.2*(1-dist/100)})`;
                ctx.stroke();
            }
        }
    }
    requestAnimationFrame(animateParticles);
}
animateParticles();

// ===== Audio =====
const audio = document.getElementById('bgm');
let played = false;
function playMusic() {
    if (played) return;
    audio.play().then(() => { played = true; document.removeEventListener('click', playMusic); document.removeEventListener('touchstart', playMusic); }).catch(()=>{});
}
document.addEventListener('click', playMusic);
document.addEventListener('touchstart', playMusic);

const volumeSlider = document.getElementById('volumeSlider');
const volumeIcon = document.getElementById('volumeIcon');
let lastVolume = 50;
audio.volume = 0.5;

function updateVolIcon(vol) {
    volumeIcon.className = vol === 0 ? 'fas fa-volume-mute' : vol < 0.5 ? 'fas fa-volume-down' : 'fas fa-volume-up';
}

volumeSlider.addEventListener('input', e => {
    const vol = e.target.value / 100;
    audio.volume = vol;
    updateVolIcon(vol);
    if (vol > 0) lastVolume = e.target.value;
});

document.getElementById('muteBtn').addEventListener('click', e => {
    e.stopPropagation();
    if (audio.volume > 0) {
        lastVolume = volumeSlider.value;
        audio.volume = 0;
        volumeSlider.value = 0;
        updateVolIcon(0);
    } else {
        audio.volume = lastVolume / 100;
        volumeSlider.value = lastVolume;
        updateVolIcon(audio.volume);
    }
});

// ===== Mood =====
const moods = ['Coding... 💻', 'Gaming... 🎮', 'Listening to music... 🎧', 'Chilling... 😎', 'Learning AI... 🤖'];
let moodIdx = 0;
const moodEl = document.getElementById('moodDisplay');
setInterval(() => {
    moodIdx = (moodIdx + 1) % moods.length;
    moodEl.style.opacity = 0;
    setTimeout(() => { moodEl.textContent = moods[moodIdx]; moodEl.style.opacity = 1; }, 300);
}, 5000);

// ===== Quotes =====
const quotes = [
    { text: '"Yêu là chết ở trong lòng một ít, vì mấy khi yêu mà chắc được yêu."', author: 'Xuân Diệu' },
    { text: '"Sống là cho, đâu chỉ nhận riêng mình."', author: 'Tố Hữu' },
    { text: '"Hãy hướng về phía mặt trời, bóng tối sẽ ngả về sau bạn."', author: 'Heli' },
    { text: '"Đừng sống cùng một năm đến 75 lần và gọi đó là cuộc đời."', author: 'Robin Sharma' },
    { text: '"The only way to do great work is to love what you do."', author: 'Steve Jobs' },
    { text: '"Học, học nữa, học mãi."', author: 'Lenin' },
    { text: '"Tình yêu là điều kiện để tri thức được bắt đầu."', author: 'Leonardo da Vinci' },
    { text: '"Be the change that you wish to see in the world."', author: 'Mahatma Gandhi' },
    { text: '"Cái tôi và sự hiểu biết tỷ lệ nghịch với nhau."', author: 'Albert Einstein' },
    { text: '"Đời phải trải qua giông tố nhưng không được cúi đầu trước giông tố."', author: 'Đặng Thùy Trâm' },
    { text: '"Imagination is more important than knowledge."', author: 'Albert Einstein' },
    { text: '"Yêu tôi hay ghét tôi, cả hai đều có lợi cho tôi."', author: 'Baland Quandeel' },
    { text: '"Code is like humor. When you have to explain it, it\'s bad."', author: 'Cory House' },
    { text: '"Nếu bạn muốn đi nhanh, hãy đi một mình. Nếu bạn muốn đi xa, hãy đi cùng nhau."', author: 'Tục ngữ châu Phi' },
    { text: '"Happiness is not something ready made. It comes from your own actions."', author: 'Dalai Lama' }
];
let qIdx = 0;
const qText = document.getElementById('quoteText');
const qAuthor = document.getElementById('quoteAuthor');

function rotateQuote() {
    qText.style.opacity = 0; qAuthor.style.opacity = 0;
    setTimeout(() => {
        qIdx = (qIdx + 1) % quotes.length;
        qText.textContent = quotes[qIdx].text;
        qAuthor.textContent = '- ' + quotes[qIdx].author;
        qText.style.opacity = 1; qAuthor.style.opacity = 1;
    }, 500);
}
setInterval(rotateQuote, 8000);

// ===== Easter Egg: Gõ "love", "truc", "yeu" =====
const header = document.getElementById('headerTitle');
let buf = '', triggered = false;
document.addEventListener('keydown', e => {
    if (e.key.length === 1 && e.key.match(/[a-z]/i)) {
        buf += e.key.toLowerCase();
        if (buf.length > 10) buf = buf.slice(-10);
        if (!triggered && (buf.includes('love') || buf.includes('truc') || buf.includes('yeu'))) {
            triggered = true;
            header.textContent = '❤ Tôi Yêu Em Truc à ! ❤';
            header.style.color = '#ff6b9d';
            header.style.textShadow = '0 0 15px #ff6b9d, 0 0 30px #ff1493';
            header.style.webkitTextFillColor = '#ff6b9d';
            header.style.background = 'none';
        }
    }
});

console.log('%c🦆 Tienz 3D Portfolio Loaded!', 'color: #a29bfe; font-size: 20px;');
console.log('%c💡 Gõ "love", "truc" hoặc "yeu" để mở khóa bí mật...', 'color: #aaa;');'mouseenter', () => {
        card.style.boxShadow = '0 0 20px var(--glow-color)';
    });
    card.addEventListener('mouseleave', () => {
        card.style.boxShadow = '';
    });
});

// ===== Easter Egg: Konami Code =====
const konamiCode = ['ArrowUp', 'ArrowUp', 'ArrowDown', 'ArrowDown', 'ArrowLeft', 'ArrowRight', 'ArrowLeft', 'ArrowRight', 'b', 'a'];
let konamiIndex = 0;

document.addEventListener('keydown', (e) => {
    if (e.key === konamiCode[konamiIndex]) {
        konamiIndex++;
        if (konamiIndex === konamiCode.length) {
            activateEasterEgg();
            konamiIndex = 0;
        }
    } else {
        konamiIndex = 0;
    }
});

function activateEasterEgg() {
    document.body.style.animation = 'rainbow 2s linear infinite';

    const style = document.createElement('style');
    style.textContent = `
        @keyframes rainbow {
            0% { filter: hue-rotate(0deg); }
            100% { filter: hue-rotate(360deg); }
        }
    `;
    document.head.appendChild(style);

    setTimeout(() => {
        document.body.style.animation = '';
        style.remove();
    }, 5000);

    alert('🎉 You found the Easter Egg! 🎉');
}

console.log('%c🦆 Tienz Profile Loaded!', 'color: #6c5ce7; font-size: 20px; font-weight: bold;');
console.log('%cTry the Konami Code: ↑↑↓↓←→←→BA', 'color: #a29bfe; font-size: 14px;');

const quotes=[{text:"Không có áp lực, không có kim cương.",author:"Thomas Carlyle"},{text:"Hãy sống như thể ngày mai bạn sẽ chết.",author:"Mahatma Gandhi"},{text:"Love all, trust a few, do wrong to none.",author:"William Shakespeare"},{text:"人生は一度きり。",author:"Japanese Saying"},{text:"La vie est belle quand le cœur est libre.",author:"French Saying"},{text:"We accept the love we think we deserve.",author:"Stephen Chbosky"},{text:"Đừng để ai dập tắt ánh sáng của bạn.",author:"Việt Nam"},{text:"To live is the rarest thing in the world.",author:"Oscar Wilde"}];const quoteText=document.getElementById('quote-text');const quoteAuthor=document.getElementById('quote-author');function randomQuote(){const q=quotes[Math.floor(Math.random()*quotes.length)];quoteText.style.opacity=0;quoteAuthor.style.opacity=0;setTimeout(()=>{quoteText.textContent=`"${q.text}"`;quoteAuthor.textContent=`— ${q.author}`;quoteText.style.opacity=1;quoteAuthor.style.opacity=1},300)}setInterval(randomQuote,5000);document.querySelectorAll('.theme-chip').forEach(btn=>{btn.addEventListener('click',()=>{document.body.setAttribute('data-style',btn.dataset.themeStyle)})});const cube=document.querySelector('.floating-cube');document.addEventListener('mousemove',(e)=>{const x=(e.clientX/window.innerWidth-.5)*30;const y=(e.clientY/window.innerHeight-.5)*30;cube.style.transform=`rotateX(${60-y/2}deg) rotateZ(${25+x/2}deg)`});