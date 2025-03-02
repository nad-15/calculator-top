const calcContainer = document.querySelector('.calc');
const yesBtn = document.querySelector('.heart-btn.yes');
const noBtn = document.querySelector('.heart-btn.no');
const heartImg = document.querySelector('.broken-heart-bg img');
const heartText = document.querySelector(`.heart-text`);
const heartOverlay = document.querySelector(`.heart-overlay`);

let roastInterval;
let sorryBtnShown = false;

const roastMessages = [
    "You can't even multiply!",
    "What's 9 x 8 again?",
    "Division by zero? Really?",
    "Are you even trying?",
    "Math dropout detected!",
    "Addition is hard, huh?",
    "Maybe try a real calculator!",
    "2 + 2 = 5, right?",
    "Calculators have feelings too!",
    "Please... just stop.",
    "Error 404: Brain not found!",
    "This is why we can't have nice things.",
    "Math isn’t for everyone... clearly.",
    "You just hurt my circuits.",
    "I'm filing a complaint.",
    "Arithmetic? Never heard of her.",
    "You're the reason I have trust issues.",
    "Ever heard of basic math?",
    "How did you mess that up?",
    "Is this your first time?",
    "I'm embarrassed for you.",
    "RIP to my processor.",
    "Numbers cried because of you.",
    "I'm overheating from disappointment.",
    "0 divided by you.",
    "Congratulations on being... wrong.",
    "This isn't how math works.",
    "Even a toaster is smarter.",
    "Your math teacher is crying.",
    "Consider going back to preschool.",
    "You missed kindergarten day, huh?",
    "I need a vacation from you.",
    "Try again... or don't.",
    "Math was never your friend.",
    "Well, that’s... something.",
    "Close, but not really.",
    "Oof. Just oof.",
    "Bruh. Really?",
    "I'm calling tech support."
];


noBtn.addEventListener('click', () => {
    noBtn.style.display = `none`;
    yesBtn.style.display = `none`;
    heartImg.style.transition = 'opacity 0.3s ease';
    heartImg.style.opacity = '0';
    heartText.style.transition = 'opacity 0.3s ease';
    heartText.style.opacity = '0';

    setTimeout(() => {
        heartText.innerHTML = 'You don\'t even know what <br> 1+1 is!!!';
        heartImg.src = 'crying-calc.png';
        heartImg.style.opacity = '1';
        heartText.style.opacity = '1';
    }, 300);


    setTimeout(() => {
        calcContainer.style.transition = 'transform 0.6s ease, opacity 0.6s ease';
        calcContainer.style.transform = 'scale(0)';
        calcContainer.style.opacity = '0';

        document.querySelectorAll('.heart-btn').forEach(btn => {
            btn.disabled = true;
        });
        heartOverlay.style.display = 'none';
    }, 3300);



    setTimeout(() => {
        roastInterval = setInterval(spawnRoastMessage, 1000);
    }, 3300);

    setTimeout(() => {
        document.body.addEventListener('click', showSorryButtonOnce);
    }, 7300);


});

yesBtn.addEventListener('click', () => {
    const allButtons = Array.from(document.querySelectorAll('.buttons'));
    resetButtons(allButtons);
    document.querySelectorAll('.heart-btn').forEach(btn => {
        btn.disabled = true;
        heartOverlay.style.display = 'none';
    });

});


function dropButtonsRandomly(buttons, callback) {
    heartOverlay.style.display = 'flex';
    const buttonsLeft = [...buttons];
    let totalDelay = 0;

    function dropNext() {
        if (buttonsLeft.length === 0) {
            if (callback) setTimeout(callback, 700); // Wait a bit for the last animation to finish
            return;
        }

        const randomIndex = Math.floor(Math.random() * buttonsLeft.length);
        const button = buttonsLeft.splice(randomIndex, 1)[0];

        button.classList.add('drop');

        const nextDelay = Math.random() * 200 + 100;
        totalDelay += nextDelay;

        setTimeout(dropNext, nextDelay);
    }

    dropNext();
}

function resetButtons(buttons) {
    buttons.forEach(button => {
        button.classList.remove('drop');
        button.style.transform = '';
        button.style.animation = '';
    });
}


function spawnRoastMessage() {
    
    const roast = document.createElement('div');
    roast.classList.add('roast-message');

    const roastImg = document.createElement('img');
    roastImg.src = 'talking-calc.png'; 
    roastImg.alt = 'Talking Calc';
    roastImg.classList.add('roast-avatar');

    const roastText = document.createElement('span');
    roastText.textContent = roastMessages[Math.floor(Math.random() * roastMessages.length)];

    roast.appendChild(roastImg);
    roast.appendChild(roastText);

    roast.style.left = Math.random() * (window.innerWidth - 200) + 'px';
    roast.style.top = Math.random() * (window.innerHeight - 50) + 'px';

    document.body.appendChild(roast);

    setTimeout(() => {
        roast.style.opacity = '0';
        roast.style.transform = 'scale(0.5)';
        setTimeout(() => roast.remove(), 500);
    }, 2000);
}

function showSorryButtonOnce() {
    if (sorryBtnShown) return;
    sorryBtnShown = true;
    const sorryPopup = document.createElement('div');
    sorryPopup.classList.add('sorry-popup');
    
    sorryPopup.innerHTML = `
        <img src="muscle-calc.png" alt="masculine calc">
        <div>Say sorry to continue!</div>
        <input type="text" placeholder="Type 'sorry'...">
        <button>Submit</button>
    `;

    document.body.appendChild(sorryPopup);
    const input = sorryPopup.querySelector('input');
    const submitBtn = sorryPopup.querySelector('button');

    submitBtn.addEventListener('click', () => {
        if (input.value.trim().toLowerCase() === 'sorry') {
            clearInterval(roastInterval);
            document.querySelectorAll('.roast-message').forEach(r => r.remove());
            sorryPopup.remove();

            bringBackCalc();
            const allButtons = Array.from(document.querySelectorAll('.buttons'));
            resetButtons(allButtons);

        } else {
            input.value = '';
            input.placeholder = 'Nope, say "sorry"...';
        }
    });
}

function bringBackCalc() {
    document.body.removeEventListener('click', showSorryButtonOnce);
    sorryBtnShown = false;
    heartText.innerHTML = `You broke my heart 💔.<br>Are you sorry?`;
    heartImg.src = 'broken-heart-calc.png';
    document.querySelectorAll('.heart-btn').forEach(btn => {
        btn.disabled = true;
        btn.style.display = 'inline-block';
    });
    heartOverlay.style.display = 'flex';
    calcContainer.style.transition = 'transform 0.6s ease, opacity 0.6s ease';
    calcContainer.style.transform = 'scale(1)';
    calcContainer.style.opacity = '1';
}
