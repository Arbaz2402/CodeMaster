/* Quiz JS */

document.addEventListener('DOMContentLoaded', async () => {
    let quizData = [];
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
    const quizTitle = document.querySelector('.quiz-info h2');

    // Get courseId from URL params
    const urlParams = new URLSearchParams(window.location.search);
    const courseId = urlParams.get('courseId');

    // Load quiz data from backend
    const loadQuizData = async () => {
        try {
            if (courseId) {
                quizData = await quizzesApi.getByCourseId(courseId);
                if (quizTitle && quizData.length > 0) {
                    quizTitle.textContent = `${quizData[0].title} Quiz`;
                }
            } else {
                // Load all quizzes if no courseId, use first one
                const allQuizzes = await quizzesApi.getAll();
                quizData = allQuizzes[0]?.questions || [];
                if (quizTitle && allQuizzes[0]) {
                    quizTitle.textContent = `${allQuizzes[0].title} Quiz`;
                }
            }

            if (quizData.length === 0) {
                alert('No quiz found!');
                window.location.href = 'dashboard.html';
                return;
            }

            totalQText.textContent = quizData.length;
            loadQuestion();
            startTimer();
        } catch (error) {
            console.error('Failed to load quiz:', error);
            alert('Failed to load quiz');
            window.location.href = 'dashboard.html';
        }
    };

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
    loadQuizData();
});