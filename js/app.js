// ============================================================
// JOKEUP - Lògica Principal de l'Aplicació
// Controlador de pantalles + 5 jocs complets
// ============================================================

const App = {
  players: [],
  currentMode: null,
  selectedCategory: null,
  selectedTheme: null,
  scores: {},
  usedQuestions: {},

  // ---- Navegació entre pantalles ----
  goTo(screenId) {
    document.querySelectorAll('.screen').forEach(s => s.classList.remove('active'));
    const target = document.getElementById(screenId);
    if (target) target.classList.add('active');
  },

  // ---- Gestió de jugadors ----
  addPlayer() {
    const input = document.getElementById('player-input');
    const name = input.value.trim();
    if (!name) return;
    if (this.players.length >= 20) return;
    if (this.players.includes(name)) {
      input.classList.add('shake');
      setTimeout(() => input.classList.remove('shake'), 500);
      return;
    }
    this.players.push(name);
    input.value = '';
    input.focus();
    this.renderPlayers();
  },

  removePlayer(index) {
    this.players.splice(index, 1);
    this.renderPlayers();
  },

  quickAddPlayers(count) {
    const names = ['Pau', 'Maria', 'Marc', 'Laia', 'Jordi', 'Anna', 'Pol', 'Nuria', 'Arnau', 'Carla'];
    this.players = [];
    for (let i = 0; i < count && i < names.length; i++) {
      this.players.push(names[i]);
    }
    this.renderPlayers();
  },

  renderPlayers() {
    const list = document.getElementById('player-list');
    list.innerHTML = this.players.map((p, i) =>
      `<div class="player-tag">
        <span>${p}</span>
        <span class="remove" onclick="App.removePlayer(${i})">&#10005;</span>
      </div>`
    ).join('');

    const btn = document.getElementById('btn-start-game');
    btn.disabled = this.players.length < 2;
  },

  // ---- Selecció de mode ----
  selectMode(mode) {
    this.currentMode = mode;
    this.selectedCategory = null;
    this.selectedTheme = null;

    // Impostor necessita mínim 3
    if (mode === 'impostor' && this.players.length < 3) {
      alert('L\'Impostor necessita mínim 3 jugadors!');
      return;
    }

    this.renderCategories();
    this.goTo('screen-categories');
  },

  renderCategories() {
    const list = document.getElementById('category-list');
    const impostorOpts = document.getElementById('impostor-options');
    const impostorThemes = document.getElementById('impostor-themes');
    const title = document.getElementById('cat-title');

    // Categories d'intensitat
    const categories = {
      'truth-dare': [
        { id: 'suau', icon: '🌱', name: 'Suau', desc: 'Per escalfar motors' },
        { id: 'normal', icon: '🔥', name: 'Normal', desc: 'El punt just' },
        { id: 'picant', icon: '🌶️', name: 'Picant', desc: 'Les coses es posen calentes' },
        { id: 'extrem', icon: '💀', name: 'Extrem', desc: 'Sense filtres ni limits' }
      ],
      'never-ever': [
        { id: 'suau', icon: '🌱', name: 'Suau', desc: 'Confessions lleugeres' },
        { id: 'festa', icon: '🎉', name: 'Festa', desc: 'Nits boges i alcohol' },
        { id: 'picant', icon: '🌶️', name: 'Picant', desc: 'Secrets íntims' },
        { id: 'extrem', icon: '💀', name: 'Extrem', desc: 'El que ningú vol admetre' }
      ],
      'most-likely': [
        { id: 'suau', icon: '🌱', name: 'Suau', desc: 'Situacions divertides' },
        { id: 'festa', icon: '🎉', name: 'Festa', desc: 'De festa i bogeria' },
        { id: 'picant', icon: '🌶️', name: 'Picant', desc: 'Secrets i tabús' }
      ],
      'would-rather': [
        { id: 'suau', icon: '🌱', name: 'Suau', desc: 'Dilemes clàssics' },
        { id: 'festa', icon: '🎉', name: 'Festa', desc: 'Dilemes de festa' },
        { id: 'picant', icon: '🌶️', name: 'Picant', desc: 'Dilemes comprometedors' }
      ],
      'impostor': [
        { id: 'all', icon: '🎲', name: 'Totes les temàtiques', desc: 'Mix de tot' }
      ]
    };

    const themes = [
      { id: 'animals', icon: '🐾', name: 'Animals' },
      { id: 'menjar', icon: '🍕', name: 'Menjar' },
      { id: 'llocs', icon: '📍', name: 'Llocs' },
      { id: 'pelis', icon: '🎬', name: 'Pelis i Sèries' },
      { id: 'professions', icon: '👔', name: 'Professions' },
      { id: 'objectes', icon: '🔑', name: 'Objectes' }
    ];

    const modeName = {
      'truth-dare': 'Veritat o Repte',
      'impostor': 'L\'Impostor',
      'never-ever': 'Jo Mai Mai',
      'most-likely': 'Qui és Més Probable?',
      'would-rather': 'Què Prefereixes?'
    };

    title.textContent = modeName[this.currentMode] || 'Intensitat';

    const cats = categories[this.currentMode] || [];
    list.innerHTML = cats.map(c =>
      `<button class="category-btn" data-cat="${c.id}" onclick="App.selectCategory('${c.id}')">
        <span class="cat-icon">${c.icon}</span>
        <span class="cat-info">
          <span class="cat-name">${c.name}</span>
          <span class="cat-desc">${c.desc}</span>
        </span>
      </button>`
    ).join('');

    // Impostor: mostrar temes
    if (this.currentMode === 'impostor') {
      impostorOpts.classList.remove('hidden');
      impostorThemes.innerHTML = themes.map(t =>
        `<button class="category-btn" data-theme="${t.id}" onclick="App.selectTheme('${t.id}')">
          <span class="cat-icon">${t.icon}</span>
          <span class="cat-info">
            <span class="cat-name">${t.name}</span>
          </span>
        </button>`
      ).join('');
      // Seleccionar "all" per defecte
      this.selectedCategory = 'all';
      list.querySelector('[data-cat="all"]').classList.add('selected');
    } else {
      impostorOpts.classList.add('hidden');
      // Seleccionar primera per defecte
      if (cats.length > 0) {
        this.selectedCategory = cats[0].id;
        list.querySelector(`[data-cat="${cats[0].id}"]`).classList.add('selected');
      }
    }
  },

  selectCategory(catId) {
    this.selectedCategory = catId;
    document.querySelectorAll('#category-list .category-btn').forEach(b => b.classList.remove('selected'));
    const btn = document.querySelector(`#category-list [data-cat="${catId}"]`);
    if (btn) btn.classList.add('selected');
  },

  selectTheme(themeId) {
    this.selectedTheme = themeId;
    document.querySelectorAll('#impostor-themes .category-btn').forEach(b => b.classList.remove('selected'));
    const btn = document.querySelector(`#impostor-themes [data-theme="${themeId}"]`);
    if (btn) btn.classList.add('selected');
  },

  // ---- Iniciar joc ----
  startGame() {
    if (!this.selectedCategory) return;

    // Inicialitzar puntuacions
    this.scores = {};
    this.players.forEach(p => this.scores[p] = 0);

    // Inicialitzar preguntes usades
    const key = this.currentMode + '-' + this.selectedCategory;
    if (!this.usedQuestions[key]) this.usedQuestions[key] = new Set();

    switch (this.currentMode) {
      case 'truth-dare':
        this.TruthDare.init();
        this.goTo('screen-truth-dare');
        break;
      case 'impostor':
        this.Impostor.init();
        this.goTo('screen-impostor');
        break;
      case 'never-ever':
        this.NeverEver.init();
        this.goTo('screen-never-ever');
        break;
      case 'most-likely':
        this.MostLikely.init();
        this.goTo('screen-most-likely');
        break;
      case 'would-rather':
        this.WouldRather.init();
        this.goTo('screen-would-rather');
        break;
    }
  },

  exitGame() {
    // Aturar timers si n'hi ha
    if (this.Impostor._timerInterval) clearInterval(this.Impostor._timerInterval);
    this.goTo('screen-modes');
  },

  // ---- Utilitats ----
  shuffle(arr) {
    const a = [...arr];
    for (let i = a.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [a[i], a[j]] = [a[j], a[i]];
    }
    return a;
  },

  getRandomItem(arr, usedSet) {
    const available = arr.filter((_, i) => !usedSet.has(i));
    if (available.length === 0) {
      // Reset si s'han usat totes
      usedSet.clear();
      return arr[Math.floor(Math.random() * arr.length)];
    }
    const idx = Math.floor(Math.random() * available.length);
    const originalIdx = arr.indexOf(available[idx]);
    usedSet.add(originalIdx);
    return available[idx];
  },

  vibrate(ms) {
    if (navigator.vibrate) navigator.vibrate(ms || 50);
  },

  confetti() {
    const colors = ['#ff6b6b', '#a855f7', '#3b82f6', '#22c55e', '#f59e0b', '#ec4899'];
    for (let i = 0; i < 30; i++) {
      const piece = document.createElement('div');
      piece.className = 'confetti-piece';
      piece.style.left = Math.random() * 100 + 'vw';
      piece.style.backgroundColor = colors[Math.floor(Math.random() * colors.length)];
      piece.style.animationDelay = Math.random() * 0.5 + 's';
      piece.style.borderRadius = Math.random() > 0.5 ? '50%' : '2px';
      piece.style.width = (Math.random() * 8 + 5) + 'px';
      piece.style.height = (Math.random() * 8 + 5) + 'px';
      document.body.appendChild(piece);
      setTimeout(() => piece.remove(), 3500);
    }
  },

  // ---- Scoreboard ----
  showScoreboard() {
    const overlay = document.getElementById('scoreboard-overlay');
    const list = document.getElementById('scoreboard-list');
    const sorted = Object.entries(this.scores).sort((a, b) => b[1] - a[1]);
    const medals = ['🥇', '🥈', '🥉'];
    list.innerHTML = sorted.map(([name, score], i) =>
      `<div class="score-row">
        <span class="score-name">${medals[i] || ''} ${name}</span>
        <span class="score-points">${score} pts</span>
      </div>`
    ).join('');
    overlay.classList.add('visible');
    overlay.classList.remove('hidden');
  },

  closeScoreboard() {
    const overlay = document.getElementById('scoreboard-overlay');
    overlay.classList.remove('visible');
    setTimeout(() => overlay.classList.add('hidden'), 300);
  },

  // ============================================================
  // JOC 1: VERITAT O REPTE
  // ============================================================
  TruthDare: {
    currentPlayerIndex: 0,
    round: 1,
    usedTruths: new Set(),
    usedDares: new Set(),

    init() {
      this.currentPlayerIndex = 0;
      this.round = 1;
      this.usedTruths = new Set();
      this.usedDares = new Set();
      this.showPlayer();
    },

    showPlayer() {
      const player = App.players[this.currentPlayerIndex];
      document.getElementById('td-player').textContent = player;
      document.getElementById('td-round').textContent = `Ronda ${this.round}`;
      document.getElementById('td-choice').classList.remove('hidden');
      document.getElementById('td-card').classList.add('hidden');
    },

    choose(type) {
      App.vibrate(30);
      const cat = App.selectedCategory;
      let pool, usedSet, typeName;

      if (type === 'truth') {
        pool = DATA.truthOrDare.truths[cat] || [];
        usedSet = this.usedTruths;
        typeName = '💬 Veritat';
      } else {
        pool = DATA.truthOrDare.dares[cat] || [];
        usedSet = this.usedDares;
        typeName = '⚡ Repte';
      }

      let text = App.getRandomItem(pool, usedSet);

      // Substituir [JUGADOR] per un jugador aleatori diferent
      const otherPlayers = App.players.filter((_, i) => i !== this.currentPlayerIndex);
      if (otherPlayers.length > 0) {
        const randomOther = otherPlayers[Math.floor(Math.random() * otherPlayers.length)];
        text = text.replace('[JUGADOR]', randomOther);
      }

      document.getElementById('td-card-type').textContent = typeName;
      document.getElementById('td-card-text').textContent = text;
      document.getElementById('td-choice').classList.add('hidden');
      document.getElementById('td-card').classList.remove('hidden');
    },

    next() {
      App.vibrate(20);
      this.currentPlayerIndex = (this.currentPlayerIndex + 1) % App.players.length;
      if (this.currentPlayerIndex === 0) this.round++;
      this.showPlayer();
    }
  },

  // ============================================================
  // JOC 2: L'IMPOSTOR
  // ============================================================
  Impostor: {
    impostorIndex: -1,
    word: '',
    similarWord: '',
    currentShowIndex: 0,
    votes: {},
    round: 1,
    _timerInterval: null,
    _timerSeconds: 120,
    _timerRunning: false,

    init() {
      this.round = 1;
      this.startRound();
    },

    startRound() {
      this.currentShowIndex = 0;
      this.votes = {};
      this._timerSeconds = 120;
      this._timerRunning = false;
      if (this._timerInterval) clearInterval(this._timerInterval);

      // Triar impostor aleatori
      this.impostorIndex = Math.floor(Math.random() * App.players.length);

      // Triar paraula
      const theme = App.selectedTheme;
      let allPairs = [];
      if (theme) {
        allPairs = DATA.impostor[theme] || [];
      } else {
        // Totes les temàtiques
        Object.values(DATA.impostor).forEach(pairs => {
          allPairs = allPairs.concat(pairs);
        });
      }

      const pair = allPairs[Math.floor(Math.random() * allPairs.length)];
      this.word = pair.word;
      this.similarWord = pair.similar;

      // Mostrar pantalles
      this.hideAllPhases();
      document.getElementById('imp-pass').classList.remove('hidden');
      document.getElementById('imp-round').textContent = `Ronda ${this.round}`;
      this.showPassScreen();
    },

    hideAllPhases() {
      ['imp-pass', 'imp-word', 'imp-discuss', 'imp-vote', 'imp-result'].forEach(id => {
        document.getElementById(id).classList.add('hidden');
      });
    },

    showPassScreen() {
      this.hideAllPhases();
      document.getElementById('imp-pass').classList.remove('hidden');
      document.getElementById('imp-pass-player').textContent = App.players[this.currentShowIndex];
    },

    showWord() {
      App.vibrate(30);
      this.hideAllPhases();
      document.getElementById('imp-word').classList.remove('hidden');

      const isImpostor = this.currentShowIndex === this.impostorIndex;
      const wordCard = document.getElementById('imp-word-card');
      const wordLabel = document.getElementById('imp-word-label');
      const wordHint = document.getElementById('imp-word-hint');

      if (isImpostor) {
        wordCard.textContent = '???';
        wordCard.className = 'word-card impostor-card';
        wordLabel.textContent = 'Ets L\'IMPOSTOR!';
        wordHint.textContent = 'No saps la paraula. Dissimula!';
      } else {
        wordCard.textContent = this.word;
        wordCard.className = 'word-card';
        wordLabel.textContent = 'La teva paraula:';
        wordHint.textContent = 'Recorda-la i no la diguis!';
      }
    },

    hideWord() {
      App.vibrate(20);
      this.currentShowIndex++;
      if (this.currentShowIndex < App.players.length) {
        this.showPassScreen();
      } else {
        this.showDiscussion();
      }
    },

    showDiscussion() {
      this.hideAllPhases();
      document.getElementById('imp-discuss').classList.remove('hidden');
      this.updateTimerDisplay();
      document.getElementById('imp-timer-btn').innerHTML = '&#9654;&#65039; Iniciar';
    },

    toggleTimer() {
      if (this._timerRunning) {
        clearInterval(this._timerInterval);
        this._timerRunning = false;
        document.getElementById('imp-timer-btn').innerHTML = '&#9654;&#65039; Continuar';
        document.getElementById('imp-timer-circle').classList.remove('running');
      } else {
        this._timerRunning = true;
        document.getElementById('imp-timer-btn').innerHTML = '&#9208;&#65039; Pausa';
        document.getElementById('imp-timer-circle').classList.add('running');
        this._timerInterval = setInterval(() => {
          this._timerSeconds--;
          this.updateTimerDisplay();
          if (this._timerSeconds <= 10) {
            document.getElementById('imp-timer-circle').classList.add('warning');
          }
          if (this._timerSeconds <= 0) {
            clearInterval(this._timerInterval);
            this._timerRunning = false;
            App.vibrate(200);
          }
        }, 1000);
      }
    },

    resetTimer() {
      clearInterval(this._timerInterval);
      this._timerRunning = false;
      this._timerSeconds = 120;
      this.updateTimerDisplay();
      document.getElementById('imp-timer-circle').classList.remove('running', 'warning');
      document.getElementById('imp-timer-btn').innerHTML = '&#9654;&#65039; Iniciar';
    },

    updateTimerDisplay() {
      const m = Math.floor(this._timerSeconds / 60);
      const s = this._timerSeconds % 60;
      document.getElementById('imp-timer').textContent =
        `${m}:${s.toString().padStart(2, '0')}`;
    },

    startVoting() {
      clearInterval(this._timerInterval);
      this._timerRunning = false;
      this.votes = {};
      this._currentVoterIndex = 0;
      this.showVoteForPlayer();
    },

    _currentVoterIndex: 0,

    showVoteForPlayer() {
      this.hideAllPhases();
      document.getElementById('imp-vote').classList.remove('hidden');

      const voter = App.players[this._currentVoterIndex];
      document.getElementById('imp-vote-text').textContent =
        `${voter}, qui creus que és l'impostor?`;

      const grid = document.getElementById('imp-vote-buttons');
      grid.innerHTML = App.players
        .filter((_, i) => i !== this._currentVoterIndex)
        .map(p =>
          `<button class="vote-btn" onclick="App.Impostor.castVote('${p}')">${p}</button>`
        ).join('');
    },

    castVote(votedPlayer) {
      App.vibrate(30);
      if (!this.votes[votedPlayer]) this.votes[votedPlayer] = 0;
      this.votes[votedPlayer]++;

      // Marcar botó votat
      document.querySelectorAll('.vote-btn').forEach(b => {
        b.classList.remove('voted');
        if (b.textContent === votedPlayer) b.classList.add('voted');
      });

      // Esperar i passar al següent
      setTimeout(() => {
        this._currentVoterIndex++;
        if (this._currentVoterIndex < App.players.length) {
          this.showVoteForPlayer();
        } else {
          this.showResults();
        }
      }, 500);
    },

    showResults() {
      this.hideAllPhases();
      document.getElementById('imp-result').classList.remove('hidden');

      // Trobar el més votat
      let maxVotes = 0;
      let mostVoted = '';
      Object.entries(this.votes).forEach(([player, votes]) => {
        if (votes > maxVotes) {
          maxVotes = votes;
          mostVoted = player;
        }
      });

      const impostorName = App.players[this.impostorIndex];
      const caught = mostVoted === impostorName;

      const resultIcon = document.getElementById('imp-result-icon');
      const resultTitle = document.getElementById('imp-result-title');
      const resultText = document.getElementById('imp-result-text');
      const guessSection = document.getElementById('imp-guess-section');
      const finalResult = document.getElementById('imp-final-result');

      finalResult.classList.add('hidden');

      // Mostrar vots
      const voteDetails = Object.entries(this.votes)
        .sort((a, b) => b[1] - a[1])
        .map(([p, v]) => `${p}: ${v} vot${v > 1 ? 's' : ''}`)
        .join(' | ');

      if (caught) {
        resultIcon.textContent = '🎉';
        resultTitle.textContent = `${impostorName} era l'impostor!`;
        resultText.textContent = `El grup l'ha enxampat amb ${maxVotes} vots!`;
        guessSection.classList.remove('hidden');
        document.getElementById('imp-guess-input').value = '';
        App.confetti();
      } else {
        resultIcon.textContent = '😈';
        resultTitle.textContent = `${mostVoted} NO era l'impostor!`;
        resultText.textContent = `L'impostor era ${impostorName}! Ha escapat!`;
        guessSection.classList.add('hidden');
        // Impostor guanya
        App.scores[impostorName] = (App.scores[impostorName] || 0) + 3;
      }

      document.getElementById('imp-result-words').innerHTML =
        `<strong>Paraula:</strong> ${this.word}<br>
         <strong>Paraula similar:</strong> ${this.similarWord}<br>
         <strong>Vots:</strong> ${voteDetails}`;
    },

    checkGuess() {
      const input = document.getElementById('imp-guess-input');
      const guess = input.value.trim().toLowerCase();
      const correct = this.word.toLowerCase();
      const finalResult = document.getElementById('imp-final-result');
      const finalText = document.getElementById('imp-final-text');
      const impostorName = App.players[this.impostorIndex];

      finalResult.classList.remove('hidden');
      document.getElementById('imp-guess-section').classList.add('hidden');

      if (guess === correct) {
        finalText.textContent = `${impostorName} ha endevinat la paraula! Guanya!`;
        finalText.className = 'final-result-text win';
        App.scores[impostorName] = (App.scores[impostorName] || 0) + 2;
        App.confetti();
      } else {
        finalText.textContent = `Incorrecte! "${this.word}" era la paraula. El grup guanya!`;
        finalText.className = 'final-result-text lose';
        // Punts per al grup
        App.players.forEach((p, i) => {
          if (i !== this.impostorIndex) {
            App.scores[p] = (App.scores[p] || 0) + 1;
          }
        });
      }
    },

    nextRound() {
      this.round++;
      this.startRound();
    }
  },

  // ============================================================
  // JOC 3: JO MAI MAI
  // ============================================================
  NeverEver: {
    round: 1,
    usedStatements: new Set(),
    guiltyCount: 0,

    init() {
      this.round = 1;
      this.usedStatements = new Set();
      this.showStatement();
    },

    showStatement() {
      const cat = App.selectedCategory;
      const pool = DATA.neverHaveIEver[cat] || [];
      const statement = App.getRandomItem(pool, this.usedStatements);

      document.getElementById('ne-statement').textContent = statement;
      document.getElementById('ne-round').textContent = `Ronda ${this.round}`;
      document.getElementById('ne-counter').textContent = '';
      this.guiltyCount = 0;
    },

    react(guilty) {
      App.vibrate(20);
      if (guilty) {
        this.guiltyCount++;
        document.getElementById('ne-counter').textContent =
          `${this.guiltyCount} persona/es ho ha/n fet! 🍺`;
      }
    },

    next() {
      App.vibrate(20);
      this.round++;
      this.showStatement();
    }
  },

  // ============================================================
  // JOC 4: QUI ÉS MÉS PROBABLE
  // ============================================================
  MostLikely: {
    round: 1,
    usedStatements: new Set(),
    countdownActive: false,

    init() {
      this.round = 1;
      this.usedStatements = new Set();
      this.showStatement();
    },

    showStatement() {
      const cat = App.selectedCategory;
      const pool = DATA.mostLikelyTo[cat] || [];
      const statement = App.getRandomItem(pool, this.usedStatements);

      document.getElementById('ml-statement').textContent = statement;
      document.getElementById('ml-round').textContent = `Ronda ${this.round}`;
      document.getElementById('ml-countdown').classList.add('hidden');
      document.getElementById('ml-count-btn').classList.remove('hidden');
      document.getElementById('ml-next-btn').classList.add('hidden');
      this.countdownActive = false;
    },

    countdown() {
      if (this.countdownActive) return;
      this.countdownActive = true;

      const display = document.getElementById('ml-countdown');
      const countBtn = document.getElementById('ml-count-btn');
      const nextBtn = document.getElementById('ml-next-btn');

      countBtn.classList.add('hidden');
      display.classList.remove('hidden');

      let count = 3;
      display.textContent = count;
      App.vibrate(50);

      const interval = setInterval(() => {
        count--;
        if (count > 0) {
          display.textContent = count;
          display.style.animation = 'none';
          display.offsetHeight; // force reflow
          display.style.animation = 'countPop 0.5s ease';
          App.vibrate(50);
        } else {
          clearInterval(interval);
          display.textContent = '👉';
          display.style.animation = 'none';
          display.offsetHeight;
          display.style.animation = 'countPop 0.5s ease';
          App.vibrate(200);
          nextBtn.classList.remove('hidden');
        }
      }, 1000);
    },

    next() {
      App.vibrate(20);
      this.round++;
      this.showStatement();
    }
  },

  // ============================================================
  // JOC 5: QUÈ PREFEREIXES?
  // ============================================================
  WouldRather: {
    round: 1,
    usedQuestions: new Set(),
    currentQuestion: null,
    _currentVoterIndex: 0,
    _votes: { a: [], b: [] },

    init() {
      this.round = 1;
      this.usedQuestions = new Set();
      this.showQuestion();
    },

    showQuestion() {
      const cat = App.selectedCategory;
      const pool = DATA.wouldYouRather[cat] || [];
      this.currentQuestion = App.getRandomItem(pool, this.usedQuestions);

      document.getElementById('wr-option-a').textContent = this.currentQuestion.a;
      document.getElementById('wr-option-b').textContent = this.currentQuestion.b;
      document.getElementById('wr-option-a').classList.remove('selected');
      document.getElementById('wr-option-b').classList.remove('selected');
      document.getElementById('wr-round').textContent = `Ronda ${this.round}`;
      document.getElementById('wr-result').classList.add('hidden');
      document.getElementById('wr-voting').classList.add('hidden');

      // Reiniciar votació
      this._votes = { a: [], b: [] };
      this._currentVoterIndex = 0;

      // Mode pass-and-play per votació
      this.showVoterTurn();
    },

    showVoterTurn() {
      if (this._currentVoterIndex >= App.players.length) {
        this.showResults();
        return;
      }

      const voter = App.players[this._currentVoterIndex];
      document.getElementById('wr-voter-name').textContent = voter;
      document.getElementById('wr-voting').classList.remove('hidden');

      // Mostrar opcions clicables
      document.getElementById('wr-option-a').classList.remove('selected');
      document.getElementById('wr-option-b').classList.remove('selected');
    },

    choose(option) {
      App.vibrate(30);
      const voter = App.players[this._currentVoterIndex];
      this._votes[option].push(voter);

      // Feedback visual
      if (option === 'a') {
        document.getElementById('wr-option-a').classList.add('selected');
      } else {
        document.getElementById('wr-option-b').classList.add('selected');
      }

      setTimeout(() => {
        this._currentVoterIndex++;
        this.showVoterTurn();
      }, 400);
    },

    showResults() {
      document.getElementById('wr-voting').classList.add('hidden');
      document.getElementById('wr-result').classList.remove('hidden');

      const totalA = this._votes.a.length;
      const totalB = this._votes.b.length;
      const total = totalA + totalB;

      if (total === 0) return;

      const pctA = Math.round((totalA / total) * 100);
      const pctB = 100 - pctA;

      document.getElementById('wr-bar-a').style.width = pctA + '%';
      document.getElementById('wr-bar-a').textContent = pctA > 15 ? pctA + '%' : '';
      document.getElementById('wr-bar-b').style.width = pctB + '%';
      document.getElementById('wr-bar-b').textContent = pctB > 15 ? pctB + '%' : '';

      const votersA = this._votes.a.join(', ') || 'Ningú';
      const votersB = this._votes.b.join(', ') || 'Ningú';
      document.getElementById('wr-voters').innerHTML =
        `<div style="margin-bottom:4px">🔵 ${votersA}</div>
         <div>🟡 ${votersB}</div>`;

      // Minoria beu
      const minority = totalA < totalB ? this._votes.a : totalB < totalA ? this._votes.b : [];
      if (minority.length > 0 && totalA !== totalB) {
        document.getElementById('wr-minority-text').textContent =
          `${minority.join(', ')} ${minority.length === 1 ? 'és' : 'són'} minoria... Beu! 🍺`;
      } else {
        document.getElementById('wr-minority-text').textContent = 'Empat! Tothom beu! 🍺';
      }
    },

    next() {
      App.vibrate(20);
      this.round++;
      this.showQuestion();
    }
  }
};

// ---- Inicialització ----
document.addEventListener('DOMContentLoaded', () => {
  // Prevenir scroll no desitjat
  document.body.addEventListener('touchmove', (e) => {
    const target = e.target.closest('.screen-body');
    if (!target) e.preventDefault();
  }, { passive: false });
});
