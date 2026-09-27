const intro = document.getElementById("intro");
const questionScreen = document.getElementById("questionScreen");
const finalScreen = document.getElementById("finalScreen");

const envelope = document.getElementById("envelope");
const introText = document.getElementById("introText");
const openBtn = document.getElementById("openBtn");

const yes = document.getElementById("yes");
const no = document.getElementById("no");

const message = document.getElementById("message");

const secret = document.getElementById("secret");
const musicBtn = document.getElementById("musicBtn");


/* =========================
   INTRO ТЕКСТ
========================= */

const text =
    "Я долго думал, как тебе это сказать... Поэтому решил сделать кое-что необычное.";

let textIndex = 0;

function typeText() {

    if (textIndex < text.length) {

        introText.textContent += text[textIndex];

        textIndex++;

        setTimeout(typeText, 45);

    } else {

        setTimeout(() => {

            openBtn.classList.remove("hidden");

        }, 400);
    }
}

setTimeout(typeText, 700);


/* =========================
   ОТКРЫТИЕ
========================= */

function openQuestion() {

    intro.classList.remove("active");

    setTimeout(() => {

        questionScreen.classList.add("active");

    }, 400);
}

envelope.addEventListener("click", openQuestion);

openBtn.addEventListener("click", openQuestion);


/* =========================
   КНОПКА НЕТ
========================= */

let noAttempts = 0;

function moveNoButton() {

    noAttempts++;

    if (noAttempts === 1) {

        message.textContent =
            "Эй... ты точно хочешь нажать «Нет»? 👀";

    } else if (noAttempts === 2) {

        message.textContent =
            "Ну пожалуйста, подумай ещё раз 😭";

    } else {

        message.textContent =
            "Ладно 😭 можешь выбрать честно.";
    }

    /*
        На мобильном нет hover,
        поэтому после нескольких попыток
        кнопка перестаёт убегать.
    */

    if (noAttempts >= 3) {
        no.style.position = "static";
        return;
    }

    const maxX = Math.min(100, window.innerWidth / 3);
    const maxY = Math.min(100, window.innerHeight / 5);

    const x =
        Math.random() * (maxX * 2) - maxX;

    const y =
        Math.random() * (maxY * 2) - maxY;

    no.style.transform =
        `translate(${x}px, ${y}px)`;
}


/* Для мыши */

no.addEventListener("mouseenter", moveNoButton);


/* Для телефона */

no.addEventListener("touchstart", (event) => {

    if (noAttempts < 3) {
        event.preventDefault();

        moveNoButton();
    }

}, { passive: false });


/* Клик */

no.addEventListener("click", () => {

    sendAnswer("Нет");

    message.textContent = "Спасибо за честный ответ ❤️";
});


/* =========================
   ДА
========================= */

yes.addEventListener("click", () => {

    // Отправляем ответ
    sendAnswer("Да ❤️");

    // Вибрация
    navigator.vibrate?.([100, 50, 150]);

    // Конфетти
    createConfetti("left");
    createConfetti("right");

    // Переход на финальный экран
    questionScreen.classList.remove("active");
    finalScreen.classList.add("active");
});


/* =========================
   КОНФЕТТИ
========================= */

function createConfetti(side) {

    const colors = [
        "#ff3f7f",
        "#ff69b4",
        "#ffd166",
        "#ffffff",
        "#ff4d6d"
    ];

    for (let i = 0; i < 40; i++) {

        const confetti =
            document.createElement("div");

        confetti.className = "confetti";

        confetti.style.background =
            colors[
                Math.floor(
                    Math.random() * colors.length
                )
            ];

        confetti.style.left =
            side === "left"
                ? "0"
                : "100%";

        confetti.style.top =
            Math.random() * 60 + 20 + "%";

        const distance =
            Math.random() * 90 + 40;

        confetti.style.setProperty(
            "--x",
            side === "left"
                ? `${distance}vw`
                : `-${distance}vw`
        );

        confetti.style.animationDelay =
            Math.random() * 0.25 + "s";

        document.body.appendChild(confetti);

        setTimeout(() => {

            confetti.remove();

        }, 2000);
    }
}


/* =========================
   ФОНОВЫЕ СЕРДЦА
========================= */

function createBackgroundHeart() {

    const heart =
        document.createElement("div");

    heart.className = "heart-bg";

    heart.textContent =
        Math.random() > 0.5
            ? "❤️"
            : "💗";

    heart.style.left =
        Math.random() * 100 + "%";

    heart.style.fontSize =
        Math.random() * 20 + 15 + "px";

    heart.style.animationDuration =
        Math.random() * 5 + 6 + "s";

    document
        .getElementById("hearts")
        .appendChild(heart);

    setTimeout(() => {

        heart.remove();

    }, 12000);
}

setInterval(
    createBackgroundHeart,
    800
);


/* =========================
   ПАСХАЛКА
========================= */

let heartClicks = 0;

document
    .querySelector(".big-heart")
    .addEventListener("click", () => {

        heartClicks++;

        if (heartClicks >= 5) {

            secret.classList.add("show");

            setTimeout(() => {

                secret.classList.remove("show");

            }, 2500);

            heartClicks = 0;
        }
    });


// МУЗЫКА
const music = document.getElementById("music");
const musicbtn = document.getElementById("musicBtn");

musicBtn.addEventListener("click", () => {

    if (music.paused) {

        music.play();

        musicBtn.textContent = "⏸️ Выключить музыку";

    } else {

        music.pause();

        musicBtn.textContent = "🎵 Включить музыку";

    }

});

const RESULT_URL = "https://script.google.com/macros/s/AKfycbzsPmVW_kvkL44Ky8t6HGZKYUQamJBCnlPEcmUjWIs9WeGD1vE_UAV_H072Ibv7P32VSg/exec";

function sendAnswer(answer) {

    fetch(RESULT_URL, {
        method: "POST",
        mode: "no-cors",
        headers: {
            "Content-Type": "application/x-www-form-urlencoded"
        },
        body: "answer=" + encodeURIComponent(answer)
    });

}