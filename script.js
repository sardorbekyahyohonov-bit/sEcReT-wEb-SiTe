// ========================================
// НАСТРОЙКИ
// ========================================

const RESULT_URL = "ТВОЯ_ССЫЛКА_APPS_SCRIPT";

// ========================================
// ЭЛЕМЕНТЫ
// ========================================

const intro = document.getElementById("intro");
const questionScreen = document.getElementById("questionScreen");
const finalScreen = document.getElementById("finalScreen");

const envelope = document.getElementById("envelope");
const introText = document.getElementById("introText");
const openBtn = document.getElementById("openBtn");

const yes = document.getElementById("yes");
const no = document.getElementById("no");

const message = document.getElementById("message");
const music = document.getElementById("music");
const musicBtn = document.getElementById("musicBtn");

// ========================================
// INTRO — ПЕЧАТЬ ТЕКСТА
// ========================================

const introMessage =
  "Я долго думал, как тебе это сказать... Поэтому решил сделать кое-что необычное.";

let textIndex = 0;

function typeText() {
  if (textIndex < introMessage.length) {
    introText.textContent += introMessage[textIndex];

    textIndex++;

    setTimeout(typeText, 45);
  } else {
    openBtn.classList.remove("hidden");
  }
}

typeText();

// ========================================
// ОТКРЫТИЕ КОНВЕРТА
// ========================================

function openQuestion() {
  intro.classList.remove("active");

  setTimeout(() => {
    questionScreen.classList.add("active");
  }, 400);
}

envelope.addEventListener("click", openQuestion);
openBtn.addEventListener("click", openQuestion);

// ========================================
// ОТПРАВКА ОТВЕТА В GOOGLE APPS SCRIPT
// ========================================

const RESULT_url =
  "https://script.google.com/macros/s/AKfycbzsPmVW_kvkL44Ky8t6HGZKYUQamJBCnlPEcmUjWIs9WeGD1vE_UAV_H072Ibv7P32VSg/exec";

function sendAnswer(answer) {
  fetch(RESULT_URL, {
    method: "POST",

    mode: "no-cors",

    headers: {
      "Content-Type": "application/x-www-form-urlencoded",
    },

    body: "answer=" + encodeURIComponent(answer),
  }).catch(() => {
    // Даже если браузер заблокирует запрос,
    // сайт продолжит работать нормально.
  });
}

// ========================================
// КНОПКА «НЕТ»
// ========================================

let noAttempts = 0;

function moveNoButton() {
  if (noAttempts >= 3) {
    return;
  }

  noAttempts++;

  const maxX = Math.min(120, window.innerWidth / 3);

  const maxY = Math.min(100, window.innerHeight / 5);

  const x = Math.random() * maxX * 2 - maxX;

  const y = Math.random() * maxY * 2 - maxY;

  no.style.transform = `translate(${x}px, ${y}px)`;

  if (noAttempts === 1) {
    message.textContent = "Эй 😭 попробуй ещё раз";
  } else if (noAttempts === 2) {
    message.textContent = "Ты уверена? 👀";
  } else {
    message.textContent = "Ладно... теперь можно нажать ❤️";

    no.style.transform = "translate(0, 0)";
  }
}

// Компьютер
no.addEventListener("mouseenter", () => {
  if (noAttempts < 3) {
    moveNoButton();
  }
});

// Телефон
no.addEventListener("touchstart", (event) => {
  if (noAttempts < 3) {
    event.preventDefault();

    moveNoButton();
  }
});

// ========================================
// ФИНАЛ ПОСЛЕ «НЕТ»
// ========================================

no.addEventListener("click", () => {
  if (noAttempts < 3) {
    return;
  }

  sendAnswer("Нет");

  showFinal("no");
});

// ========================================
// ФИНАЛ ПОСЛЕ «ДА»
// ========================================

yes.addEventListener("click", () => {
  sendAnswer("Да ❤️");

  // Вибрация телефона
  if (navigator.vibrate) {
    navigator.vibrate([100, 50, 150]);
  }

  // Конфетти
  createConfetti("left");
  createConfetti("right");

  showFinal("yes");
});

// ========================================
// ФИНАЛЬНЫЙ ЭКРАН
// ========================================

function showFinal(answer) {
  questionScreen.classList.remove("active");

  setTimeout(() => {
    finalScreen.classList.add("active");
  }, 400);

  const finalCard = finalScreen.querySelector(".final-card");

  if (answer === "yes") {
    finalCard.innerHTML = `

            <div class="final-heart">
                ❤️
            </div>

            <h1>
                Я так и знал 😭❤️
            </h1>

            <p>
                Кажется, этот сайт был создан не зря.
            </p>

            <p class="secret-message">
                🤫 И последнее...<br><br>

                Пусть всё, что произошло здесь,
                останется маленьким секретом
                между нами ❤️
            </p>

            <button id="musicBtn" class="music-btn">
                🎵 Включить музыку
            </button>

        `;
  } else {
    finalCard.innerHTML = `

            <div class="final-heart">
                ❤️
            </div>

            <h1>
                Спасибо за честный ответ ❤️
            </h1>

            <p>
                Я ценю твою честность.
            </p>

            <p class="secret-message">
                🤫 И последнее...<br><br>

                Пусть этот маленький разговор
                останется между нами.
            </p>

            <button id="musicBtn" class="music-btn">
                🎵 Включить музыку
            </button>

        `;
  }

  // Получаем новую кнопку после innerHTML
  const newMusicBtn = document.getElementById("musicBtn");

  newMusicBtn.addEventListener("click", toggleMusic);
}

// ========================================
// МУЗЫКА
// ========================================

function toggleMusic() {
  const currentMusicBtn = document.getElementById("musicBtn");

  if (music.paused) {
    music.play();

    currentMusicBtn.textContent = "⏸️ Выключить музыку";
  } else {
    music.pause();

    currentMusicBtn.textContent = "🎵 Включить музыку";
  }
}

// ========================================
// КОНФЕТТИ
// ========================================

function createConfetti(side) {
  for (let i = 0; i < 40; i++) {
    const confetti = document.createElement("div");

    confetti.className = "confetti";

    const colors = ["#ff3f7f", "#ff69b4", "#ffd166", "#ffffff", "#ff4d6d"];

    confetti.style.background =
      colors[Math.floor(Math.random() * colors.length)];

    confetti.style.top = Math.random() * 70 + "%";

    if (side === "left") {
      confetti.style.left = "-10px";
    } else {
      confetti.style.right = "-10px";
    }

    const x =
      side === "left"
        ? Math.random() * 300 + 100
        : -(Math.random() * 300 + 100);

    const y = Math.random() * 500 - 250;

    confetti.style.setProperty("--x", `${x}px`);

    confetti.style.setProperty("--y", `${y}px`);

    document.body.appendChild(confetti);

    setTimeout(() => {
      confetti.remove();
    }, 1800);
  }
}

// ========================================
// ПЛАВАЮЩИЕ СЕРДЕЧКИ
// ========================================

const heartsContainer = document.getElementById("hearts");

setInterval(() => {
  const heart = document.createElement("span");

  heart.textContent = "❤️";

  heart.style.left = Math.random() * 100 + "%";

  heart.style.animationDuration = 4 + Math.random() * 4 + "s";

  heart.style.fontSize = 12 + Math.random() * 18 + "px";

  heartsContainer.appendChild(heart);

  setTimeout(() => {
    heart.remove();
  }, 8000);
}, 800);

// ========================================
// ПАСХАЛКА
// ========================================

const bigHeart = document.querySelector(".big-heart");

const secret = document.getElementById("secret");

let heartClicks = 0;

if (bigHeart) {
  bigHeart.addEventListener("click", () => {
    heartClicks++;

    if (heartClicks >= 5) {
      secret.classList.add("show");

      setTimeout(() => {
        secret.classList.remove("show");
      }, 3000);

      heartClicks = 0;
    }
  });
}
