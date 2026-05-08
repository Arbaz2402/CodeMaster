/* Quiz JS */

const quizData = [
    {
        question: "What is the primary purpose of the useState hook?",
        options: [
            "To handle side effects in functional components",
            "To add state to functional components",
            "To optimize performance",
            "To navigate between routes"
        ],
        correct: 1
    },
    {
        question: "Which hook would you use to perform a side effect like fetching data?",
        options: [
            "useState",
            "useContext",
            "useEffect",
            "useReducer"
        ],
        correct: 2
    },
    {
        question: "What must you pass as the second argument to useEffect to run it only once?",
        options: [
            "The component name",
            "An empty array []",
            "null",
            "The state variable"
        ],
        correct: 1
    },
    {
        question: "Can you use Hooks inside a class component?",
        options: [
            "Yes, always",
            "Yes, but only useState",
            "No, hooks are only for functional components",
            "Only in specific React versions"
        ],
        correct: 2
    },
    {
        question: "What is the correct way to update state using useState?",
        options: [
            "state = newValue",
            "setState(newValue)",
            "updateState(newValue)",
            "this.setState(newValue)"
        ],
        correct: 1
    }
];

document.addEventListener('DOMContentLoaded', () => {
    let currentQuestion = 0;
    let score = 0;
    let timer = 120;
    let timerInterval;

    const questionText = document.getElementById('question-text');
    const optionsContainer = document.getElementById('options-container');
    const nextBtn = document.getElementById('next-btn');
    const currentQText = document.getElementById('current-q');
    const totalQText = document.getElementById('total-q');
    const progressFill = document.getElementById('quiz-progress');
    const timerText = document.getElementById('timer');
    const quizScreen = document.getElementById('quiz-screen');
    const resultScreen = document.getElementById('result-screen');

    totalQText.textContent = quizData.length;

    function startTimer() {
        timerInterval = setInterval(() => {
            timer--;
            const minutes = Math.floor(timer / 60);
            const seconds = timer % 60;
            timerText.textContent = `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
            
            if (timer <= 0) {
                clearInterval(timerInterval);
                showResults();
            }
        }, 1000);
    }

    function loadQuestion() {
        const q = quizData[currentQuestion];
        questionText.textContent = q.question;
        optionsContainer.innerHTML = '';
        
        q.options.forEach((option, index) => {
            const div = document.createElement('div');
            div.className = 'option';
            div.innerHTML = `<span>${String.fromCharCode(65 + index)}.</span> ${option}`;
            div.onclick = () => selectOption(index);
            optionsContainer.appendChild(div);
        });

        currentQText.textContent = currentQuestion + 1;
        progressFill.style.width = `${((currentQuestion + 1) / quizData.length) * 100}%`;
    }

    function selectOption(index) {
        const options = document.querySelectorAll('.option');
        options.forEach(opt => opt.classList.remove('selected'));
        options[index].classList.add('selected');
        options[index].dataset.index = index;
    }

    nextBtn.onclick = () => {
        const selected = document.querySelector('.option.selected');
        if (!selected) {
            alert('Please select an option!');
            return;
        }

        const answerIndex = parseInt(selected.dataset.index);
        if (answerIndex === quizData[currentQuestion].correct) {
            score++;
        }

        currentQuestion++;
        if (currentQuestion < quizData.length) {
            loadQuestion();
        } else {
            showResults();
        }
    };

    function showResults() {
        clearInterval(timerInterval);
        quizScreen.style.display = 'none';
        resultScreen.style.display = 'block';
        
        document.getElementById('final-score').textContent = score;
        document.getElementById('final-total').textContent = quizData.length;
        document.getElementById('accuracy').textContent = `${Math.round((score / quizData.length) * 100)}%`;
        document.getElementById('time-taken').textContent = `${120 - timer}s`;
    }

    // Initialize
    loadQuestion();
    startTimer();
});
