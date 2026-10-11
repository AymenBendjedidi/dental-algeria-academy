const quizData = [
  {
    category: 'Parodontologie',
    question: 'Quel élément est considéré comme un facteur de risque majeur pour la maladie parodontale ?',
    options: ['Le tabac', 'La vitamine C', 'L’eau minérale', 'La bonne hygiène'],
    correct: 0,
  },
  {
    category: 'Endodontie',
    question: 'La pulpite aiguë irréversible est généralement associée à :',
    options: ['Une douleur spontanée intense', 'Une éruption dentaire', 'Une mobilité excessive', 'Un edema gingival localisé'],
    correct: 0,
  },
  {
    category: 'Anatomie dentaire',
    question: 'Le nombre de racines du molaire inférieur est généralement :',
    options: ['1', '2', '3', '4'],
    correct: 1,
  },
  {
    category: 'Radiologie',
    question: 'La radiographie périapicale est utilisée principalement pour :',
    options: ['Visualiser le plan de traitement', 'Contrôler la présence des canaux et les lésions périapicales', 'Mesurer la mastication', 'Diagnostiquer l’orthodontie uniquement'],
    correct: 1,
  },
  {
    category: 'Prophylaxie',
    question: 'Le but principal du détartrage est de :',
    options: ['Éliminer les restaurations', 'Réduire le biofilm et le tartre', 'Augmenter la sensibilité', 'Détruire les tissus sains'],
    correct: 1,
  },
];

const elements = {
  loginBtn: document.getElementById('loginBtn'),
  loginModal: document.getElementById('loginModal'),
  loginForm: document.getElementById('loginForm'),
  studentName: document.getElementById('studentName'),
  studentLevel: document.getElementById('studentLevel'),
  dashboardTitle: document.getElementById('dashboardTitle'),
  themeToggle: document.getElementById('themeToggle'),
  quizCounter: document.getElementById('quizCounter'),
  quizCategory: document.getElementById('quizCategory'),
  questionText: document.getElementById('questionText'),
  answerList: document.getElementById('answerList'),
  prevBtn: document.getElementById('prevBtn'),
  nextBtn: document.getElementById('nextBtn'),
  scoreValue: document.getElementById('scoreValue'),
  goodAnswers: document.getElementById('goodAnswers'),
  badAnswers: document.getElementById('badAnswers'),
  resetQuiz: document.getElementById('resetQuiz'),
};

const state = {
  currentIndex: 0,
  selectedAnswers: Array(quizData.length).fill(null),
  score: 0,
};

function openModal() {
  elements.loginModal.classList.remove('hidden');
  elements.loginModal.setAttribute('aria-hidden', 'false');
}

function closeModal() {
  elements.loginModal.classList.add('hidden');
  elements.loginModal.setAttribute('aria-hidden', 'true');
}

function saveStudentSession(name, level) {
  localStorage.setItem('dentalStudent', JSON.stringify({ name, level }));
}

function loadStudentSession() {
  const saved = localStorage.getItem('dentalStudent');
  if (!saved) return null;
  return JSON.parse(saved);
}

function updateDashboardUser() {
  const user = loadStudentSession();
  if (!user && elements.dashboardTitle) {
    elements.dashboardTitle.textContent = 'Bienvenue étudiant';
    return;
  }
  if (elements.dashboardTitle) {
    elements.dashboardTitle.textContent = `Bienvenue ${user.name} • ${user.level}`;
  }
}

function setTheme(theme) {
  const isDark = theme === 'dark';
  document.body.classList.toggle('dark-theme', isDark);
  localStorage.setItem('dentalTheme', theme);
  elements.themeToggle.textContent = isDark ? 'Mode clair' : 'Mode nuit';
}

function initTheme() {
  const savedTheme = localStorage.getItem('dentalTheme') || 'light';
  setTheme(savedTheme);
}

function renderQuiz() {
  const current = quizData[state.currentIndex];

  elements.quizCounter.textContent = `Question ${state.currentIndex + 1} / ${quizData.length}`;
  elements.quizCategory.textContent = current.category;
  elements.questionText.textContent = current.question;

  elements.answerList.innerHTML = '';

  current.options.forEach((option, index) => {
    const button = document.createElement('button');
    button.type = 'button';
    button.className = 'answer-option';

    if (state.selectedAnswers[state.currentIndex] === index) {
      button.classList.add('selected');
    }

    button.textContent = option;
    button.addEventListener('click', () => {
      state.selectedAnswers[state.currentIndex] = index;
      renderQuiz();
    });
    elements.answerList.appendChild(button);
  });

  const selectedValue = state.selectedAnswers[state.currentIndex];
  if (selectedValue !== null) {
    const buttons = [...elements.answerList.children];
    buttons.forEach((button, index) => {
      if (index === current.correct) button.classList.add('correct');
      if (index === selectedValue && selectedValue !== current.correct) button.classList.add('wrong');
    });
  }

  elements.prevBtn.disabled = state.currentIndex === 0;
  elements.prevBtn.style.opacity = state.currentIndex === 0 ? '0.5' : '1';
  elements.nextBtn.textContent = state.currentIndex === quizData.length - 1 ? 'Terminer' : 'Suivant';

  updateScoreSummary();
}

function updateScoreSummary() {
  let correct = 0;
  let wrong = 0;

  state.selectedAnswers.forEach((answer, index) => {
    if (answer === null) return;
    if (answer === quizData[index].correct) correct += 1;
    else wrong += 1;
  });

  const percent = Math.round((correct / quizData.length) * 100);
  elements.goodAnswers.textContent = String(correct);
  elements.badAnswers.textContent = String(wrong);
  elements.scoreValue.textContent = `${percent}%`;
}

function handleNextQuestion() {
  if (state.selectedAnswers[state.currentIndex] === null) {
    alert('Veuillez choisir une réponse avant de continuer.');
    return;
  }

  if (state.currentIndex < quizData.length - 1) {
    state.currentIndex += 1;
    renderQuiz();
    return;
  }

  alert(`Quiz terminé ! Votre score est de ${Math.round((state.selectedAnswers.filter((answer, index) => answer === quizData[index].correct).length / quizData.length) * 100)}%.`);
}

function resetQuiz() {
  state.currentIndex = 0;
  state.selectedAnswers = Array(quizData.length).fill(null);
  renderQuiz();
}

if (elements.loginBtn) {
  elements.loginBtn.addEventListener('click', openModal);
}

if (elements.themeToggle) {
  elements.themeToggle.addEventListener('click', () => {
    const currentTheme = document.body.classList.contains('dark-theme') ? 'dark' : 'light';
    setTheme(currentTheme === 'dark' ? 'light' : 'dark');
  });
}

if (elements.loginForm) {
  elements.loginForm.addEventListener('submit', (event) => {
    event.preventDefault();
    const name = elements.studentName.value.trim();
    const level = elements.studentLevel.value;

    if (!name) return;

    saveStudentSession(name, level);
    updateDashboardUser();
    closeModal();
  });
}

['click'].forEach((eventName) => {
  document.addEventListener(eventName, (event) => {
    const target = event.target;
    if (!(target instanceof HTMLElement)) return;

    if (target.matches('[data-close="true"]')) {
      closeModal();
    }
  });
});

if (elements.prevBtn) {
  elements.prevBtn.addEventListener('click', () => {
    if (state.currentIndex > 0) {
      state.currentIndex -= 1;
      renderQuiz();
    }
  });
}

if (elements.nextBtn) {
  elements.nextBtn.addEventListener('click', handleNextQuestion);
}

if (elements.resetQuiz) {
  elements.resetQuiz.addEventListener('click', resetQuiz);
}

initTheme();
updateDashboardUser();
if (elements.quizCounter) {
  renderQuiz();
}

const savedStudent = loadStudentSession();
if (savedStudent) {
  elements.studentName.value = savedStudent.name;
  elements.studentLevel.value = savedStudent.level;
}




























