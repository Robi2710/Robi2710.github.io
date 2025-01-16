const questions = [
    "If economic globalisation is inevitable, it should primarily serve humanity rather than the interests of trans-national corporations.",
    "Our race has many superior qualities, compared with other races.",
    "The freer the market, the freer the people.",
    "The rich are too highly taxed.",
    "It’s a sad reflection on our society that something as basic as drinking water is now a bottled, branded consumer product.",
    "Abortion, when the woman’s life is not threatened, should always be illegal.",
    "Schools should not make classroom attendance compulsory.",
    "There are no savage and civilised peoples; there are only different cultures.",
    "The death penalty should be an option for the most serious crimes.",
    "In criminal justice, punishment should be more important than rehabilitation.",
    "You cannot be moral without being religious.",
    "A same sex couple in a stable, loving relationship should not be excluded from the possibility of child adoption."
];

const answers = [
    { value: "strongly_disagree", label: "Strongly Disagree" },
    { value: "somewhat_disagree", label: "Somewhat Disagree" },
    { value: "neutral", label: "Neutral" },
    { value: "somewhat_agree", label: "Somewhat Agree" },
    { value: "strongly_agree", label: "Strongly Agree" }
];

const answerValues = {
    "strongly_disagree": -2,
    "somewhat_disagree": -1,
    "neutral": 0,
    "somewhat_agree": 1,
    "strongly_agree": 2
};

const economicQuestions = [0, 2, 3, 4];  
const socialQuestions = [1, 5, 6, 7, 8, 9, 10, 11];  
const invertedQuestions = [0,4,6,7,12]
let userAnswers = [];

const surveyContainer = document.getElementById("survey-container");
let questionIndex = 0;

function updateLoadingBar() {
    const progress = ((questionIndex + 1) / questions.length) * 100;
    document.getElementById("loading-bar").style.width = progress + "%";
}

function showQuestion(index) {
    surveyContainer.innerHTML = ""; 
    const questionDiv = document.createElement("div");
    questionDiv.classList.add("question-container");

    const questionText = document.createElement("p");
    questionText.innerText = (index + 1) + ". " + questions[index];
    questionDiv.appendChild(questionText);

    const answerContainer = document.createElement("div");
    answerContainer.classList.add("answer-container");

    answers.forEach(answer => {
        const answerDiv = document.createElement("div");
        answerDiv.classList.add("answer-box");

        const input = document.createElement("input");
        input.type = "radio";
        input.name = `question${index}`;
        input.value = answer.value;
        input.id = `${answer.value}_${index}`;

        const label = document.createElement("label");
        label.innerText = answer.label;
        label.htmlFor = `${answer.value}_${index}`;

        answerDiv.appendChild(input);
        answerDiv.appendChild(label);
        answerDiv.addEventListener("click", () => {
            input.checked = true;
            if (invertedQuestions.includes(questionIndex)) {
                userAnswers[questionIndex] = -1 * answerValues[answer.value];
            }
            else {
                userAnswers[questionIndex] = answerValues[answer.value];
            }
        });
        answerContainer.appendChild(answerDiv);
    });

    questionDiv.appendChild(answerContainer);
    surveyContainer.appendChild(questionDiv);

    const nextButton = document.createElement("button");
    nextButton.id = "next-button";
    nextButton.innerText = "Next";
    nextButton.addEventListener("click", goToNextQuestion);
    nextButton.style.display = "block"; 
    surveyContainer.appendChild(nextButton);

    questionDiv.style.display = "block";
}

function calculateResults() {
    let economicScore = 0;
    let socialScore = 0;

    economicQuestions.forEach(qIndex => {
        economicScore += userAnswers[qIndex] || 0;
    });

    socialQuestions.forEach(qIndex => {
        socialScore += userAnswers[qIndex] || 0;
    });

    // Normalizează scorurile la -10 până la 10
    economicScore = (economicScore / (economicQuestions.length * 2)) * 10;
    if (economicScore < -7) {
        economicScore = -7;
    }
    socialScore = (socialScore / (socialQuestions.length * 2)) * 10;
    return {
        economic: economicScore,
        social: socialScore
    };
    let quadrant;
    if (economicScore >= 0 && socialScore >= 0) {
        quadrant = 'auth-right';
    }
    else if (economicScore >= 0 && socialScore < 0) {
        quadrant = 'lib-right';
    }
    else if (economicScore < 0 && socialScore >= 0) {
        quadrant = 'auth-left';
    }
    else quadrant = 'lib-left';

    localStorage.setItem('politicalQuadrant', quadrant);
    localStorage.setItem('politicalResults', JSON.stringify(results));
}

function goToNextQuestion() {
    const nextButton = document.getElementById("next-button");
    const computedStyle = window.getComputedStyle(nextButton);
    
    // Check if button is visible and enabled
    if (computedStyle.display === 'none' || computedStyle.opacity === '0') {
        console.warn("Button is not visible or disabled");
        return;
    }

    // Verifică dacă s-a selectat un răspuns
    if (userAnswers[questionIndex] === undefined) {
        alert("Please select an answer before proceeding.");
        return;
    }

    if (questionIndex < questions.length - 1) {
        questionIndex++;
        showQuestion(questionIndex);
        updateLoadingBar();
    } else {
        const results = calculateResults();
        localStorage.setItem('politicalResults', JSON.stringify(results));
        window.location.href = 'results.html';
    }
}

document.addEventListener("DOMContentLoaded", function() {
    showQuestion(questionIndex);
    updateLoadingBar();
});
