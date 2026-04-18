const STORAGE_KEYS = {
  data: "edumetrics:data",
  users: "edumetrics:users",
  user: "edumetrics:user",
  apiKey: "edumetrics:apiKey",
  savedTests: "edumetrics:savedTests",
  scheduledTests: "edumetrics:scheduledTests",
  testResults: "edumetrics:testResults"
};

/** 10 вопросов по информатике (автопроверка по индексу correct) */
const INFORMATICS_QUESTIONS = [
  {
    text: {
      kz: "Құрамдас бөліктер: процессор, жад, диск жинақталған құрылғы не?",
      ru: "Устройство, объединяющее процессор, память и накопители — это?"
    },
    options: [
      { kz: "Перифериялық құрылғы", ru: "Периферийное устройство" },
      { kz: "Жүйелік блок", ru: "Системный блок" },
      { kz: "Монитор", ru: "Монитор" },
      { kz: "Тінтуір", ru: "Мышь" }
    ],
    correct: 1
  },
  {
    text: { kz: "Екілік 101₂ сандар жүйесінде неге тең?", ru: "Чему равно двоичное число 101₂?" },
    options: [
      { kz: "5", ru: "5" },
      { kz: "7", ru: "7" },
      { kz: "3", ru: "3" },
      { kz: "6", ru: "6" }
    ],
    correct: 0
  },
  {
    text: { kz: "Операциялық жүйенің міндеті емес:", ru: "Что не является функцией операционной системы?" },
    options: [
      { kz: "Ресурстарды басқару", ru: "Управление ресурсами" },
      { kz: "Текстті форматтау (Word-та)", ru: "Форматирование текста в Word" },
      { kz: "Файлдармен жұмыс", ru: "Работа с файлами" },
      { kz: "Қолданбаларды іске қосу", ru: "Запуск программ" }
    ],
    correct: 1
  },
  {
    text: { kz: "HTTPS деген не?", ru: "Что означает HTTPS?" },
    options: [
      { kz: "Тек домен атағы", ru: "Только имя домена" },
      { kz: "Шифрланған HTTP", ru: "Защищённый HTTP" },
      { kz: "Файл кеңейтімі", ru: "Расширение файла" },
      { kz: "Пошта хаттамасы", ru: "Почтовый протокол" }
    ],
    correct: 1
  },
  {
    text: { kz: "Excel-де B2 деген не?", ru: "В Excel ячейка B2 — это?" },
    options: [
      { kz: "Формула", ru: "Формула" },
      { kz: "Баған B, 2-жол", ru: "Столбец B, строка 2" },
      { kz: "Тек қана сандар", ru: "Только числа" },
      { kz: "Кесте атауы", ru: "Имя таблицы" }
    ],
    correct: 1
  },
  {
    text: { kz: "Бағдарламалауда цикл не істейді:", ru: "Что не характерно для цикла как такового (в общем виде)?" },
    options: [
      { kz: "Әрекеттерді қайталауы мүмкін", ru: "Может повторять действия" },
      { kz: "Әрқашан тек бір рет орындау", ru: "Всегда выполняется только один раз" },
      { kz: "Шарт бойынша қайталай алады", ru: "Может повторяться по условию" },
      { kz: "Санауыш бойынша жүруі мүмкін", ru: "Может идти по счётчику" }
    ],
    correct: 1
  },
  {
    text: { kz: "Компьютерлік вирус деген не?", ru: "Компьютерный вирус — это?" },
    options: [
      { kz: "Антивирус бағдарламасы", ru: "Антивирусная программа" },
      { kz: "Өздігінен таралатын зиянды код", ru: "Вредоносный самовоспроизводящийся код" },
      { kz: "Жад түрі", ru: "Тип памяти" },
      { kz: "Принтер драйвері", ru: "Драйвер принтера" }
    ],
    correct: 1
  },
  {
    text: { kz: "Операциялық жүйеге мысал:", ru: "Пример операционной системы:" },
    options: [
      { kz: "Microsoft Word", ru: "Microsoft Word" },
      { kz: "Windows / Linux / macOS", ru: "Windows / Linux / macOS" },
      { kz: "JPEG", ru: "JPEG" },
      { kz: "HTML", ru: "HTML" }
    ],
    correct: 1
  },
  {
    text: { kz: "Логикалық AND: 1 AND 0 нәтижесі", ru: "Логическое AND: результат 1 AND 0" },
    options: [
      { kz: "1", ru: "1" },
      { kz: "0", ru: "0" },
      { kz: "2", ru: "2" },
      { kz: "10", ru: "10" }
    ],
    correct: 1
  },
  {
    text: { kz: ".docx кеңейтімі қай форматқа жатады?", ru: "Расширение .docx относится к:" },
    options: [
      { kz: "Кескін", ru: "Изображение" },
      { kz: "Мәтіндік құжат (Word)", ru: "Текстовый документ Word" },
      { kz: "Бейне", ru: "Видео" },
      { kz: "Кесте тек CSV", ru: "Только CSV" }
    ],
    correct: 1
  }
];

let authEscapeHandler = null;

const state = {
  lang: "kz",
  mobileMenuOpen: false,
  openDropdownIndex: null,
  cabinetMenuOpen: false,
  /** @type {null | "register" | "login"} */
  authModal: null,
  currentUser: null,
  chatSessionId: createSessionId(),
  chatMessages: [],
  sending: false,
  scheduleSelectedDate: "2026-04-18",
  resultsTab: "points",
  accountsFilter: { name: "", grade: "", letter: "" },
  scheduleDraft: {
    selectedGrades: [],
    selectedLetter: "",
    selectedStudentLogins: []
  },
  scheduleStartTime: "09:00",
  scheduleFormErrors: {}
};

/** Merged with cached/partial data so file:// localStorage never drops labels, duration options, or buttons. */
const DEFAULT_SCHEDULE_TEST = {
  title: { kz: "Тестті жоспарлаңыз", ru: "Запланируйте тест" },
  subscriptionBanner: {
    kz: "Сізде белсенді жазылым жоқ. Төлем жасау немесе келісімшартқа отырып, қызметті белсендіріңіз. Телефон: +7 705 837 02 03",
    ru: "У вас нет активной подписки. Оплатите или заключите договор для активации. Телефон: +7 705 837 02 03"
  },
  testTypePlaceholder: { kz: "Тест түрі", ru: "Тип теста" },
  description: {
    kz: "Пән бойынша тест: 10 сұрақ, автоматты тексеру. Қазіргі уақытта тек информатика. Таңдалған сынып пен оқушыларға жоспарлаңыз.",
    ru: "Тест по предмету: 10 вопросов, автопроверка. Сейчас доступна только информатика. Назначьте выбранным классам и ученикам."
  },
  showAllDesc: { kz: "Барлық сипаттаманы көрсету", ru: "Показать всё описание" },
  howItWorks: { kz: "Бұл қалай жұмыс істейді?", ru: "Как это работает?" },
  fields: {
    classes: { kz: "Бір немесе одан да көп сыныпты таңдаңыз...", ru: "Выберите один или несколько классов..." },
    letters: { kz: "Барлық литерлер", ru: "Все литеры" },
    students: { kz: "Барлық оқушылар", ru: "Все учащиеся" },
    language: { kz: "Тілі...", ru: "Язык..." },
    startTime: { kz: "Тест басталу уақыты", ru: "Время начала теста" },
    availability: { kz: "Тестілеу қол жетімді болады", ru: "Тестирование будет доступно" },
    subjectModeLabel: { kz: "Тест түрі", ru: "Тип теста" },
    subjectWithInformatics: { kz: "Пән бойынша — Информатика (10 сұрақ)", ru: "По предмету — Информатика (10 вопросов)" },
    informaticsOnlyHint: { kz: "Қазір тек информатика пәні қолжетімді.", ru: "Пока доступен только предмет «Информатика»." }
  },
  timeBlockTitle: { kz: "Өту уақытын тағайындау", ru: "Назначение времени прохождения" },
  timeBlockSubtitle: {
    kz: "Басталу уақыты және тест ашылу мерзімі",
    ru: "Время начала и срок доступности прохождения"
  },
  submit: { kz: "Жоспарлау", ru: "Запланировать" },
  calendarMonth: { kz: "Сәуір 2026", ru: "Апрель 2026" },
  selectAllStudents: { kz: "Барлық қолжетімді оқушыларды таңдау", ru: "Выбрать всех доступных учеников" },
  previewButton: { kz: "Өзіңіз көру (алдын ала қарау)", ru: "Попробовать самому (предпросмотр)" },
  gradesLabel: { kz: "Сынып", ru: "Класс" },
  lettersLabel: { kz: "Литер", ru: "Литера" },
  studentsLabel: { kz: "Оқушылар", ru: "Учащиеся" },
  durationOptions: [
    { hours: 1, label: { kz: "1 сағат", ru: "1 час" } },
    { hours: 6, label: { kz: "6 сағат", ru: "6 часов" } },
    { hours: 12, label: { kz: "12 сағат", ru: "12 часов" } },
    { hours: 24, label: { kz: "24 сағат", ru: "24 часа" } },
    { hours: 48, label: { kz: "48 сағат", ru: "48 часов" } }
  ],
  errors: {
    classesField: { kz: "Таңдау қажет «Классы».", ru: "Нужно выбрать «Классы»." },
    grades: { kz: "Кем дегенде бір сыныпты таңдаңыз.", ru: "Выберите хотя бы один класс." },
    students: { kz: "Кем дегенде бір оқушыны таңдаңыз.", ru: "Выберите хотя бы одного ученика." },
    language: { kz: "Таңдау қажет «Оқыту тілі».", ru: "Нужно выбрать язык обучения." },
    startTime: { kz: "Таңдау қажет «Тест басталу уақыты».", ru: "Нужно указать время начала теста." },
    duration: { kz: "Тестілеу мерзімін таңдаңыз.", ru: "Выберите срок доступности тестирования." }
  },
  hints: {
    students: {
      kz: "Тізім «Оқушылар құрамы» бөліміндегі оқушылардан сынып пен литер бойынша фильтрленеді.",
      ru: "Список берётся из раздела «Состав учащихся» и фильтруется по классу и литере."
    }
  }
};

function mergeScheduleTest(partial) {
  const o = partial && typeof partial === "object" ? partial : {};
  const merged = {
    ...DEFAULT_SCHEDULE_TEST,
    ...o,
    fields: { ...DEFAULT_SCHEDULE_TEST.fields, ...(o.fields || {}) },
    errors: { ...DEFAULT_SCHEDULE_TEST.errors, ...(o.errors || {}) },
    hints: {
      ...DEFAULT_SCHEDULE_TEST.hints,
      ...(o.hints || {}),
      students: { ...DEFAULT_SCHEDULE_TEST.hints.students, ...(o.hints?.students || {}) }
    },
    timeBlockTitle: o.timeBlockTitle ?? DEFAULT_SCHEDULE_TEST.timeBlockTitle,
    timeBlockSubtitle: o.timeBlockSubtitle ?? DEFAULT_SCHEDULE_TEST.timeBlockSubtitle,
    durationOptions:
      Array.isArray(o.durationOptions) && o.durationOptions.length > 0 ? o.durationOptions : DEFAULT_SCHEDULE_TEST.durationOptions
  };
  return merged;
}

const DEFAULT_TEST_BUILDER = {
  title: { kz: "Тест құрастыру", ru: "Создание теста" },
  subtitle: {
    kz: "Тақырып пен сұрақтар санын көрсетіңіз (демо нұсқа).",
    ru: "Укажите название и количество вопросов (демо-версия)."
  },
  fields: {
    title: { kz: "Тест атауы", ru: "Название теста" },
    subject: { kz: "Пән", ru: "Предмет" },
    questions: { kz: "Сұрақтар саны", ru: "Количество вопросов" },
    duration: { kz: "Уақыт (мин)", ru: "Время (мин)" }
  },
  submit: { kz: "Сақтау", ru: "Сохранить" }
};

function mergeTestBuilder(partial) {
  const o = partial && typeof partial === "object" ? partial : {};
  return { ...DEFAULT_TEST_BUILDER, ...o, fields: { ...DEFAULT_TEST_BUILDER.fields, ...(o.fields || {}) } };
}

const DEFAULT_ACCOUNTS_PAGE = {
  title: { kz: "Оқушылар құрамы", ru: "Состав учащихся" },
  exportExcel: { kz: "Excel", ru: "Excel" },
  filters: {
    name: { kz: "Толық аты-жөні", ru: "ФИО" },
    grade: { kz: "Сынып", ru: "Класс" },
    letter: { kz: "Литер", ru: "Литера" }
  },
  columns: {
    idx: "#",
    name: { kz: "Толық аты-жөні", ru: "ФИО" },
    grade: { kz: "Сынып", ru: "Класс" },
    letter: { kz: "Литер", ru: "Литера" },
    login: { kz: "Логин", ru: "Логин" },
    password: { kz: "Құпия сөз", ru: "Пароль" }
  }
};

function mergeAccountsPage(partial) {
  const o = partial && typeof partial === "object" ? partial : {};
  return {
    ...DEFAULT_ACCOUNTS_PAGE,
    ...o,
    filters: { ...DEFAULT_ACCOUNTS_PAGE.filters, ...(o.filters || {}) },
    columns: { ...DEFAULT_ACCOUNTS_PAGE.columns, ...(o.columns || {}) }
  };
}

function mergeSite(partial) {
  const base = {
    name: "EdooX.com",
    domain: "edoox.com",
    language: ["kz", "ru"],
    theme: { primaryColor: "#6C4CF1", secondaryColor: "#F5F6FA", font: "Inter, sans-serif" }
  };
  const o = partial && typeof partial === "object" ? partial : {};
  return { ...base, ...o, theme: { ...base.theme, ...(o.theme || {}) } };
}

function normalizeAppData(data) {
  if (!data || typeof data !== "object") return;
  data.site = mergeSite(data.site);
  data.scheduleTest = mergeScheduleTest(data.scheduleTest);
  data.testBuilder = mergeTestBuilder(data.testBuilder);
  data.accountsPage = mergeAccountsPage(data.accountsPage);
}

function createSessionId() {
  if (window.crypto?.randomUUID) return window.crypto.randomUUID();
  return `chat-${Date.now()}-${Math.random().toString(16).slice(2)}`;
}

function parseRoute() {
  const raw = window.location.hash.replace(/^#/, "") || "/";
  return raw.startsWith("/") ? raw : `/${raw}`;
}

function navigate(path) {
  window.location.hash = path.startsWith("#") ? path : `#${path.startsWith("/") ? path : `/${path}`}`;
}

function t(value) {
  if (value == null) return "";
  if (typeof value === "object" && (value.kz || value.ru)) return value[state.lang] ?? value.kz ?? value.ru ?? "";
  return String(value);
}

function setTheme(theme) {
  if (!theme) return;
  const root = document.documentElement;
  if (theme.primaryColor) root.style.setProperty("--primary", theme.primaryColor);
  if (theme.secondaryColor) root.style.setProperty("--secondary", theme.secondaryColor);
  if (theme.font) root.style.setProperty("--font", theme.font);
}

function hashPassword(value) {
  try {
    return btoa(unescape(encodeURIComponent(value)));
  } catch {
    return value;
  }
}

function getUsers() {
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.users);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

function saveUsers(users) {
  localStorage.setItem(STORAGE_KEYS.users, JSON.stringify(users));
}

function seedDefaultAdmin() {
  const users = getUsers();
  const admin = users.find((u) => u.login === "admin");
  if (!admin) {
    users.push({
      fullName: "Administrator",
      email: "admin@local",
      login: "admin",
      passwordHash: hashPassword("admin"),
      role: "admin"
    });
  } else if (!admin.role) {
    admin.role = "admin";
  }
  saveUsers(users);
}

function seedDemoStudents() {
  const demos = [
    {
      fullName: "test client 1",
      email: "test1@demo.local",
      login: "G8iF34902@school4902",
      plainPassword: "8177644",
      grade: "11",
      letter: "A"
    },
    {
      fullName: "test client 2",
      email: "test2@demo.local",
      login: "ddKGn4902@school4902",
      plainPassword: "9051943",
      grade: "11",
      letter: "A"
    },
    {
      fullName: "test client 3",
      email: "test3@demo.local",
      login: "Zxiqd4902@school4902",
      plainPassword: "3391902",
      grade: "11",
      letter: "A"
    },
    {
      fullName: "test client 4",
      email: "test4@demo.local",
      login: "CsPCK4902@school4902",
      plainPassword: "8931321",
      grade: "11",
      letter: "A"
    },
    {
      fullName: "test client 5",
      email: "test5@demo.local",
      login: "G8D34902@school4902",
      plainPassword: "5621840",
      grade: "10",
      letter: "A"
    }
  ];
  const users = getUsers();
  let changed = false;
  for (const d of demos) {
    if (users.some((u) => u.login === d.login)) continue;
    users.push({
      fullName: d.fullName,
      email: d.email,
      login: d.login,
      passwordHash: hashPassword(d.plainPassword),
      role: "student",
      grade: d.grade,
      letter: d.letter,
      plainPassword: d.plainPassword
    });
    changed = true;
  }
  if (changed) saveUsers(users);
}

function restoreSessionUser() {
  const raw = localStorage.getItem(STORAGE_KEYS.user);
  if (!raw) return null;
  try {
    return JSON.parse(raw);
  } catch {
    return null;
  }
}

function saveSessionUser(user) {
  state.currentUser = user;
  if (user) localStorage.setItem(STORAGE_KEYS.user, JSON.stringify(user));
  else localStorage.removeItem(STORAGE_KEYS.user);
}

function iconSvg(name) {
  const color = "currentColor";
  const map = {
    ai: `<path d="M8 3v3M16 3v3M4 8h16M6 8v12a2 2 0 0 0 2 2h8a2 2 0 0 0 2-2V8"/><path d="M9 14h6M10 17h4"/>`,
    library: `<path d="M6 4h10a2 2 0 0 1 2 2v14H8a2 2 0 0 0-2 2V4Z"/><path d="M8 20h10"/><path d="M10 8h6M10 12h6"/>`,
    exam: `<path d="M7 4h10v16H7z"/><path d="M9 8h6M9 12h6M9 16h4"/>`,
    image: `<path d="M4 6a2 2 0 0 1 2-2h12a2 2 0 0 1 2 2v12a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6Z"/><path d="M8.5 11a1.5 1.5 0 1 0 0-3 1.5 1.5 0 0 0 0 3Z"/><path d="M20 16l-5-5-7 7"/>`,
    translate: `<path d="M4 5h8v6H4V5Z"/><path d="M12 19h8v-6h-8v6Z"/><path d="M6 8h4M14 16h4"/><path d="M10 11l4 2M10 13l4-2"/>`,
    doc: `<path d="M7 3h7l3 3v15a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2Z"/><path d="M14 3v4a1 1 0 0 0 1 1h4"/><path d="M8 12h8M8 16h6"/>`,
    video: `<path d="M4 7a2 2 0 0 1 2-2h8a2 2 0 0 1 2 2v10a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V7Z"/><path d="M16 10l4-3v10l-4-3v-4Z"/>`,
    models: `<path d="M12 2l8 4v10l-8 4-8-4V6l8-4Z"/><path d="M12 22V12M4 6l8 4 8-4"/>` 
  };
  const content = map[name] ?? `<path d="M12 3v18M3 12h18"/>`;
  return `<svg viewBox="0 0 24 24" fill="none" aria-hidden="true" stroke="${color}" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">${content}</svg>`;
}

function caretSvg() {
  return `<svg class="caret" viewBox="0 0 12 12" fill="none" aria-hidden="true"><path d="M3 4.5l3 3 3-3" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"/></svg>`;
}

function renderHeaderActions(data) {
  return (data.header.actions ?? [])
    .map((a) => {
      if (a.id === "cabinet") {
        if (!state.currentUser) return "";
        const role = state.currentUser.role || "student";
        if (role === "admin") return `<a class="btn btn-primary" href="#/admin">${t(a.label)}</a>`;
        return `<a class="btn btn-primary" href="#/student">${t(a.label)}</a>`;
      }
      return `<button class="btn" type="button" data-action="${a.id}">${t(a.label)}</button>`;
    })
    .filter(Boolean)
    .join("");
}

function renderHeader(data) {
  const menuHtml = (data.header.menu ?? [])
    .map((item, idx) => {
      const hasDropdown = Boolean(item.dropdown && item.items?.length);
      if (!hasDropdown && item.scrollTarget) {
        return `<a class="nav-link" href="#" data-scroll="${escapeAttr(item.scrollTarget)}">${t(item.title)}</a>`;
      }
      if (!hasDropdown) return `<a class="nav-link" href="#" data-nav="${idx}">${t(item.title)}</a>`;
      const openClass = state.openDropdownIndex === idx ? "is-open" : "";
      const items = item.items.map((x, i) => `<a class="dropdown-item" href="#" data-nav="${idx}" data-sub="${i}">${t(x.title)}</a>`).join("");
      return `<div class="dropdown ${openClass}"><button class="nav-link" type="button" data-dropdown-toggle="${idx}">${t(item.title)} ${caretSvg()}</button><div class="dropdown-panel">${items}</div></div>`;
    })
    .join("");

  const actions = renderHeaderActions(data);
  const userBtn = state.currentUser
    ? `<button class="btn" type="button" data-logout title="Шығу">${escapeHtml(state.currentUser.login)} · ${state.lang === "kz" ? "шығу" : "выход"}</button>`
    : "";

  return `<header class="topbar"><div class="container"><div class="header-inner"><div class="header-row"><a class="logo" href="#/" data-action="logo"><span class="logo-badge" aria-hidden="true"></span><span>${t(data.header.logo)}</span></a><button class="burger" type="button" aria-label="Menu" aria-expanded="${state.mobileMenuOpen ? "true" : "false"}" data-burger><span class="burger-lines" aria-hidden="true"><span></span><span></span><span></span></span></button></div><nav class="nav ${state.mobileMenuOpen ? "mobile-open" : ""}" aria-label="Main navigation">${menuHtml}</nav><div class="actions">${actions}<button class="btn btn-ghost" type="button" data-lang-toggle>${t(data.header.languageToggle?.label ?? { kz: "Рус", ru: "Қаз" })}</button>${userBtn}</div></div></div></header>`;
}

function renderHero(data) {
  const buttons = (data.hero.buttons ?? []).map((b, i) => `<button class="${i === 0 ? "btn btn-primary" : "btn"}" type="button" data-hero-btn="${b.id}">${t(b.label)}</button>`).join("");
  const rebrand = data.hero?.rebrand ? `<p class="hero-rebrand">${escapeHtml(t(data.hero.rebrand))}</p>` : "";
  return `<section class="hero"><div class="container"><div class="hero-grid fade-in"><div class="hero-card">${rebrand}<h1 class="hero-title">${t(data.hero.title)}</h1><p class="hero-subtitle">${t(data.hero.subtitle)}</p><div class="hero-buttons">${buttons}</div></div><div class="hero-visual"><div class="blob"></div></div></div></div></section>`;
}

function renderFeatures(data) {
  const cards = (data.features ?? []).map((f, idx) => `<div class="card" role="button" tabindex="0" data-feature="${idx}"><div class="icon">${iconSvg(f.icon)}</div><div><div class="card-title">${t(f.title)}</div></div>${f.badge ? `<div class="badge ${String(f.badge).toLowerCase()}">${escapeHtml(String(f.badge))}</div>` : ""}</div>`).join("");
  const sec = data.featuresSectionTitle;
  const sectionHeading = sec && typeof sec === "object" && (sec.kz || sec.ru) ? t(sec) : data.site?.name ?? "EdooX";
  return `<section class="section" id="features"><div class="container"><div class="section-title">${escapeHtml(sectionHeading)}</div><div class="grid">${cards}</div></div></section>`;
}

function renderAuthModal(data) {
  if (!state.authModal) return "";
  const kz = state.lang === "kz";
  const regActive = state.authModal === "register";
  const loginActive = state.authModal === "login";
  return `<div class="auth-modal-overlay is-open" data-auth-modal-overlay tabindex="-1"><div class="auth-modal-dialog" role="dialog" aria-modal="true" aria-labelledby="auth-modal-title"><button type="button" class="auth-modal-close" data-auth-modal-close aria-label="${kz ? "Жабу" : "Закрыть"}">×</button><h3 class="auth-modal-title" id="auth-modal-title">${t(data.auth?.title)}</h3><p class="auth-modal-sub">${t(data.auth?.subtitle)}</p><p class="auth-modal-hint">${kz ? "Оқушы аккаунттары (мысал): G8iF34902@school4902 / 8177644" : "Пример ученика: G8iF34902@school4902 / 8177644"}</p><div class="auth-modal-tabs"><button type="button" class="auth-modal-tab ${regActive ? "is-active" : ""}" data-auth-tab="register">${kz ? "Тіркеу" : "Регистрация"}</button><button type="button" class="auth-modal-tab ${loginActive ? "is-active" : ""}" data-auth-tab="login">${kz ? "Кіру" : "Вход"}</button></div><div class="auth-modal-panels"><div class="auth-modal-panel ${regActive ? "is-active" : ""}" data-auth-panel="register"><form class="auth-form auth-form--modal" data-register-form><input class="input" name="fullName" placeholder="${kz ? "Аты-жөні" : "ФИО"}" required><input class="input" name="email" type="email" placeholder="Email" required><input class="input" name="login" placeholder="Login" required><input class="input" name="password" type="password" placeholder="Password" required><input class="input" name="confirm" type="password" placeholder="${kz ? "Құпиясөзді растау" : "Подтвердите пароль"}" required><button class="btn btn-primary" type="submit">${kz ? "Тіркелу" : "Зарегистрироваться"}</button></form></div><div class="auth-modal-panel ${loginActive ? "is-active" : ""}" data-auth-panel="login"><form class="auth-form auth-form--modal" data-login-form><input class="input" name="login" placeholder="Login" required><input class="input" name="password" type="password" placeholder="Password" required><button class="btn btn-primary" type="submit">${kz ? "Кіру" : "Войти"}</button><small>${kz ? "Әкімші: admin / admin" : "Админ: admin / admin"}</small></form></div></div></div></div>`;
}

function renderAiTutorSection(data) {
  const chat = state.chatMessages.map((m) => `<div class="chat-msg ${m.role}"><b>${m.role === "user" ? "You" : "AI"}:</b> ${escapeHtml(m.content)}</div>`).join("");
  return `<section class="section"><div class="container"><div class="chat-box fade-in" id="ai-tutor"><h3 class="section-title">${t(data.aiTutor?.title)}</h3><p class="hero-subtitle">${t(data.aiTutor?.subtitle)}</p><div class="chat-meta"><span>Session: ${escapeHtml(state.chatSessionId)}</span><button class="btn" type="button" data-new-chat>${state.lang === "kz" ? "Жаңа чат" : "Новый чат"}</button></div><div class="chat-window" id="chatWindow">${chat || `<div class="chat-empty">${state.lang === "kz" ? "Сұрақ қойыңыз..." : "Задайте вопрос..."}</div>`}</div><form class="chat-form" data-chat-form><input class="input" name="message" placeholder="${state.lang === "kz" ? "Сұрағыңызды жазыңыз" : "Напишите вопрос"}" ${!state.currentUser ? "disabled" : ""} required><button class="btn btn-primary" type="submit" ${!state.currentUser ? "disabled" : ""}>${state.sending ? "..." : state.lang === "kz" ? "Жіберу" : "Отправить"}</button></form>${!state.currentUser ? `<small>${state.lang === "kz" ? "Чатқа кіру үшін алдымен аккаунтқа кіріңіз." : "Войдите в аккаунт, чтобы использовать чат."}</small>` : ""}</div></div></section>`;
}

function renderFooter(data) {
  const c = data.footer?.contacts ?? {};
  const buttons = (data.footer?.buttons ?? []).map((b, i) => `<button class="${i === 0 ? "btn btn-primary" : "btn"}" type="button" data-footer-btn="${b.id}">${t(b.label)}</button>`).join("");
  const socials = (data.footer?.socials ?? []).map((s) => `<a class="pill" href="#" data-social="${s.id}">${escapeHtml(s.label)}</a>`).join("");
  return `<footer class="footer"><div class="container"><div class="footer-grid fade-in"><div><div class="footer-title">${t(data.footer?.contactsTitle)}</div><div class="contacts"><div><span>Phone:</span> ${escapeHtml(c.phone ?? "")}</div><div><span>Email:</span> ${escapeHtml(c.email ?? "")}</div><div><span>Work time:</span> ${escapeHtml(c.workTime ?? "")}</div></div></div><div><div class="footer-actions">${buttons}</div><div class="socials">${socials}</div></div></div><div class="fineprint">${escapeHtml(data.footer?.copyright ?? "")}</div></div></footer>`;
}

function parseAdminRoute(path) {
  const parts = path.split("/").filter(Boolean);
  if (parts[0] !== "admin") return { section: "dashboard", resultDetail: null };
  const s = parts[1] || "dashboard";
  if (s === "results" && parts[2] === "detail" && parts[3] != null && parts[4] != null) {
    return {
      section: "results",
      resultDetail: { scheduleId: decodeURIComponent(parts[3]), studentLogin: decodeURIComponent(parts[4]) }
    };
  }
  return { section: s, resultDetail: null };
}

function renderAdminSidebar(data, active) {
  const items = data.adminCabinet?.sidebar ?? [];
  return `<aside class="admin-sidebar"><div class="admin-sidebar-brand"><span class="logo-badge"></span><span>${escapeHtml(data.site?.name ?? "EdooX.com")}</span></div><nav class="admin-nav">${items
    .map((item) => {
      const href = item.id === "dashboard" ? "#/admin" : `#/admin/${item.id}`;
      const isActive = item.id === active || (active === "dashboard" && item.id === "dashboard");
      return `<a class="admin-nav-link ${isActive ? "is-active" : ""}" href="${href}">${t(item.label)}</a>`;
    })
    .join("")}</nav></aside>`;
}

function buildMonthCalendar(year, monthIndex) {
  const first = new Date(year, monthIndex, 1);
  const startWeekday = (first.getDay() + 6) % 7;
  const daysInMonth = new Date(year, monthIndex + 1, 0).getDate();
  const cells = [];
  for (let i = 0; i < startWeekday; i++) cells.push(null);
  for (let d = 1; d <= daysInMonth; d++) cells.push(d);
  return { cells, year, monthIndex };
}

function getScheduleFilteredStudentList() {
  const grades = state.scheduleDraft.selectedGrades.map(String);
  if (!grades.length) return [];
  let list = getStudentUsers().filter((u) => grades.includes(String(u.grade ?? "")));
  const letter = (state.scheduleDraft.selectedLetter || "").trim();
  if (letter) {
    list = list.filter((u) => String(u.letter ?? "").toUpperCase() === letter.toUpperCase());
  }
  return list.sort((a, b) =>
    String(a.fullName).localeCompare(String(b.fullName), state.lang === "kz" ? "kk" : "ru", { sensitivity: "base" })
  );
}

function getLettersForScheduleGrades(gradeList) {
  const grades = gradeList.map(String);
  if (!grades.length) return [];
  const set = new Set();
  getStudentUsers()
    .filter((u) => grades.includes(String(u.grade ?? "")))
    .forEach((u) => {
      const L = String(u.letter ?? "").trim();
      if (L) set.add(L);
    });
  return [...set].sort((a, b) => a.localeCompare(b, undefined, { numeric: true }));
}

function pruneScheduleStudentSelection() {
  const allowed = new Set(getScheduleFilteredStudentList().map((u) => u.login));
  state.scheduleDraft.selectedStudentLogins = state.scheduleDraft.selectedStudentLogins.filter((l) => allowed.has(l));
}

function pushScheduledTest(entry) {
  let arr = [];
  try {
    arr = JSON.parse(localStorage.getItem(STORAGE_KEYS.scheduledTests) || "[]");
  } catch {
    arr = [];
  }
  arr.push(entry);
  localStorage.setItem(STORAGE_KEYS.scheduledTests, JSON.stringify(arr));
}

function getScheduledTests() {
  try {
    return JSON.parse(localStorage.getItem(STORAGE_KEYS.scheduledTests) || "[]");
  } catch {
    return [];
  }
}

function getTestResultsList() {
  try {
    return JSON.parse(localStorage.getItem(STORAGE_KEYS.testResults) || "[]");
  } catch {
    return [];
  }
}

function saveTestResult(entry) {
  const list = getTestResultsList();
  if (list.some((x) => x.scheduleId === entry.scheduleId && x.studentLogin === entry.studentLogin)) return;
  list.push(entry);
  localStorage.setItem(STORAGE_KEYS.testResults, JSON.stringify(list));
}

function getResultByScheduleAndLogin(scheduleId, login) {
  return getTestResultsList().find((r) => r.scheduleId === scheduleId && r.studentLogin === login);
}

/** HTML: разбор ответов по вопросам (информатика). `result.answers` — массив { selected, correct }. */
function renderInformaticsResultBreakdownHTML(result, data) {
  const sc = data.studentCabinet ?? {};
  const answers = result?.answers;
  if (!Array.isArray(answers) || answers.length !== INFORMATICS_QUESTIONS.length) {
    return `<p class="hero-subtitle muted">${state.lang === "kz" ? "Сұрақ бойынша мәлімет жоқ (бұрынғы нәтиже)." : "Нет разбивки по вопросам (старый результат)."}</p>`;
  }
  return `<div class="result-breakdown">${INFORMATICS_QUESTIONS.map((q, i) => {
    const a = answers[i];
    const selected = a?.selected;
    const correct = typeof a?.correct === "number" ? a.correct : q.correct;
    const ok = selected != null && !Number.isNaN(Number(selected)) && Number(selected) === correct;
    const selText = selected == null || Number.isNaN(Number(selected)) ? "—" : t(q.options[Number(selected)] ?? { kz: "?", ru: "?" });
    const corText = t(q.options[correct] ?? { kz: "?", ru: "?" });
    const badge = ok
      ? `<span class="result-badge result-badge--ok">${t(sc.markCorrect ?? { kz: "Дұрыс", ru: "Верно" })}</span>`
      : `<span class="result-badge result-badge--bad">${t(sc.markWrong ?? { kz: "Қате", ru: "Ошибка" })}</span>`;
    return `<div class="result-breakdown-row ${ok ? "is-correct" : "is-wrong"}"><div class="result-breakdown-head"><span class="result-breakdown-n">${i + 1}</span>${badge}</div><div class="result-breakdown-q">${escapeHtml(t(q.text))}</div><div class="result-breakdown-answers"><div><span class="result-breakdown-label">${t(sc.yourAnswerLabel ?? { kz: "Сіздің жауабыңыз", ru: "Ваш ответ" })}:</span> ${escapeHtml(selText)}</div><div><span class="result-breakdown-label">${t(sc.correctAnswerLabel ?? { kz: "Дұрыс жауап", ru: "Верный ответ" })}:</span> ${escapeHtml(corText)}</div></div></div>`;
  }).join("")}</div>`;
}

function studentAssignedToSchedule(entry, user) {
  if (!user?.login || !entry?.studentLogins?.includes(user.login)) return false;
  return entry.testType === "subject" && entry.subject === "informatics";
}

function getScheduledTestsForStudent(user) {
  return getScheduledTests().filter((s) => studentAssignedToSchedule(s, user));
}

function scheduleGradeLabel(grade) {
  return `${grade} ${state.lang === "kz" ? "сынып" : "класс"}`;
}

function renderSchedulePage(data) {
  const st = data.scheduleTest ?? {};
  const err = state.scheduleFormErrors || {};
  const { cells } = buildMonthCalendar(2026, 3);
  const weekLabels = state.lang === "kz" ? ["Дс", "Сс", "Ср", "Бс", "Жм", "Сн", "Жк"] : ["Пн", "Вт", "Ср", "Чт", "Пт", "Сб", "Вс"];
  const grid = cells
    .map((d) => {
      if (d == null) return `<div class="cal-cell cal-empty"></div>`;
      const iso = `2026-04-${String(d).padStart(2, "0")}`;
      const sel = iso === state.scheduleSelectedDate ? "is-selected" : "";
      return `<button type="button" class="cal-cell cal-day ${sel}" data-cal-date="${iso}">${d}</button>`;
    })
    .join("");

  const studentsDisabled = !state.scheduleDraft.selectedGrades.length;
  const letters = getLettersForScheduleGrades(state.scheduleDraft.selectedGrades);

  const gradeTags = [...state.scheduleDraft.selectedGrades]
    .sort((a, b) => Number(a) - Number(b))
    .map(
      (v) =>
        `<span class="tag"><span class="tag-text">${escapeHtml(scheduleGradeLabel(v))}</span><button type="button" class="tag-remove" data-remove-grade="${escapeAttr(v)}" aria-label="remove">×</button></span>`
    )
    .join("");

  const availGrades = Array.from({ length: 11 }, (_, i) => String(i + 1)).filter((g) => !state.scheduleDraft.selectedGrades.includes(g));
  const addGradeOpts =
    `<option value="">${escapeHtml(t(st.fields?.classes))}</option>` +
    availGrades.map((g) => `<option value="${escapeAttr(g)}">${escapeHtml(scheduleGradeLabel(g))}</option>`).join("");

  let letterBlock = "";
  if (state.scheduleDraft.selectedLetter) {
    letterBlock = `<div class="tag-list"><span class="tag"><span class="tag-text">${escapeHtml(state.scheduleDraft.selectedLetter)}</span><button type="button" class="tag-remove" data-remove-letter aria-label="remove">×</button></span></div>`;
  } else {
    letterBlock = `<select class="input input--schedule" data-letter-pick ${studentsDisabled ? "disabled" : ""} title="${escapeAttr(t(st.fields?.letters))}"><option value="">${escapeHtml(t(st.fields?.letters))}</option>${letters
      .map((L) => `<option value="${escapeAttr(L)}">${escapeHtml(L)}</option>`)
      .join("")}</select>`;
  }

  const studs = getScheduleFilteredStudentList();
  const selectedUsers = getStudentUsers().filter((u) => state.scheduleDraft.selectedStudentLogins.includes(u.login));
  const studentTags = selectedUsers
    .map(
      (u) =>
        `<span class="tag"><span class="tag-text">${escapeHtml(u.fullName)}</span><button type="button" class="tag-remove" data-remove-student="${escapeAttr(u.login)}" aria-label="remove">×</button></span>`
    )
    .join("");

  const allInFilterSelected = studs.length > 0 && studs.every((u) => state.scheduleDraft.selectedStudentLogins.includes(u.login));
  const allRowClass = allInFilterSelected ? "student-list-row is-selected" : "student-list-row";
  const allRow = `<button type="button" class="${allRowClass}" data-student-all ${studentsDisabled ? "disabled" : ""}><span class="student-list-name">${escapeHtml(t(st.fields?.students))}</span></button>`;

  const studRows = studs.length
    ? studs
        .map((u) => {
          const sel = state.scheduleDraft.selectedStudentLogins.includes(u.login);
          return `<button type="button" class="student-list-row ${sel ? "is-selected" : ""}" data-student-row="${escapeAttr(u.login)}" ${studentsDisabled ? "disabled" : ""}><span class="student-list-name">${escapeHtml(u.fullName)}</span><span class="student-list-meta">${escapeHtml(`${u.grade || ""}${u.letter || ""}`)}</span></button>`;
        })
        .join("")
    : `<div class="student-list-empty">${state.lang === "kz" ? "Оқушылар жоқ" : "Нет учеников"}</div>`;

  const durations = st.durationOptions ?? [];
  const durOpts =
    `<option value="">${escapeHtml(t(st.fields?.availability))}</option>` +
    durations.map((d) => `<option value="${Number(d.hours)}">${escapeHtml(t(d.label))}</option>`).join("");

  const hint = studentsDisabled ? t(st.errors?.grades) : t(st.hints?.students);
  const eGrades = Boolean(err.grades);
  const eStudents = Boolean(err.students);
  const eLang = Boolean(err.language);
  const eTime = Boolean(err.startTime);
  const eDur = Boolean(err.duration);

  return `<div class="admin-page fade-in"><h1 class="admin-page-title">${t(st.title)}</h1><div class="subscription-banner">${t(st.subscriptionBanner)}</div><div class="schedule-layout"><div class="schedule-cal"><div class="cal-head">${t(st.calendarMonth)}</div><div class="cal-weekdays">${weekLabels.map((w) => `<span>${w}</span>`).join("")}</div><div class="cal-grid">${grid}</div></div><div class="schedule-form-wrap"><form data-schedule-form class="schedule-form-inner" novalidate><div class="schedule-field"><span class="field-label">${t(st.fields?.subjectModeLabel || st.testTypePlaceholder)}</span><div class="schedule-readonly input input--schedule">${escapeHtml(t(st.fields?.subjectWithInformatics))}</div><input type="hidden" name="testType" value="subject" /><input type="hidden" name="subject" value="informatics" /><p class="form-hint schedule-subject-hint">${escapeHtml(t(st.fields?.informaticsOnlyHint))}</p></div><p class="schedule-desc">${t(st.description)}</p><a href="#" class="schedule-link">${t(st.showAllDesc)} ${caretSvg()}</a><p class="schedule-how"><span class="play-ico">▶</span> ${t(st.howItWorks)}</p><div class="schedule-two-col schedule-pickers-row"><div class="schedule-field"><span class="field-label">${t(st.gradesLabel)}</span><div class="tag-field ${eGrades ? "is-invalid" : ""}"><div class="tag-list">${gradeTags}</div><select class="tag-field-add" data-add-grade aria-label="add-grade">${addGradeOpts}</select></div>${eGrades ? `<p class="field-error">${escapeHtml(t(st.errors?.classesField))}</p>` : ""}</div><div class="schedule-field"><span class="field-label">${t(st.lettersLabel)}</span><div class="tag-field tag-field--letter">${letterBlock}</div></div></div><div class="schedule-field schedule-field--block-students"><span class="field-label">${t(st.studentsLabel)}</span><div class="tag-field tag-field--tags-only ${eStudents ? "is-invalid" : ""}"><div class="tag-list">${studentTags || `<span class="tag-placeholder">${escapeHtml(t(st.fields?.students))}</span>`}</div></div>${eStudents ? `<p class="field-error">${escapeHtml(t(st.errors?.students))}</p>` : ""}<div class="student-list ${studentsDisabled ? "is-disabled" : ""}">${studs.length ? `${allRow}${studRows}` : studRows}</div><p class="form-hint">${escapeHtml(hint)}</p></div><div class="schedule-field"><label class="field-label" for="sched-lang">${t(st.fields?.language)}</label><select class="input input--schedule ${eLang ? "is-invalid" : ""}" id="sched-lang" name="language"><option value="">${escapeHtml(t(st.fields?.language))}</option><option value="kk">Қазақша</option><option value="ru">Орысша</option></select>${eLang ? `<p class="field-error">${escapeHtml(t(st.errors?.language))}</p>` : ""}</div><div class="schedule-time-section"><h3 class="schedule-section-heading">${escapeHtml(t(st.timeBlockTitle))}</h3><p class="schedule-section-sub">${escapeHtml(t(st.timeBlockSubtitle))}</p><div class="schedule-two-col schedule-two-col--bottom"><div class="schedule-field"><label class="field-label" for="sched-time">${t(st.fields?.startTime)}</label><input class="input input--schedule ${eTime ? "is-invalid" : ""}" id="sched-time" name="scheduleTime" type="time" value="${escapeAttr(state.scheduleStartTime)}" required />${eTime ? `<p class="field-error">${escapeHtml(t(st.errors?.startTime))}</p>` : ""}</div><div class="schedule-field"><label class="field-label" for="sched-dur">${t(st.fields?.availability)}</label><select class="input input--schedule ${eDur ? "is-invalid" : ""}" id="sched-dur" name="durationHours" aria-label="${escapeAttr(t(st.fields?.availability))}">${durOpts}</select>${eDur ? `<p class="field-error">${escapeHtml(t(st.errors?.duration))}</p>` : ""}</div></div></div><div class="schedule-actions"><button class="btn-schedule-cta" type="submit">${escapeHtml(t(st.submit) || (state.lang === "kz" ? "Жоспарлау" : "Запланировать"))}</button><button type="button" class="btn-schedule-preview" data-schedule-preview>${escapeHtml(
    t(st.previewButton) || (state.lang === "kz" ? "Өзіңіз көру (алдын ала қарау)" : "Попробовать самому (предпросмотр)")
  )}</button></div></form></div></div></div>`;
}

function renderTestBuilderPage(data) {
  const tb = data.testBuilder ?? {};
  return `<div class="admin-page fade-in"><h1 class="admin-page-title">${t(tb.title)}</h1><p class="hero-subtitle">${t(tb.subtitle)}</p><form class="test-builder-form" data-test-builder-form><input class="input" name="title" placeholder="${t(tb.fields?.title)}" required /><input class="input" name="subject" placeholder="${t(tb.fields?.subject)}" required /><input class="input" name="questions" type="number" min="1" value="10" placeholder="${t(tb.fields?.questions)}" /><input class="input" name="duration" type="number" min="5" value="45" placeholder="${t(tb.fields?.duration)}" /><button class="btn btn-primary" type="submit">${t(tb.submit)}</button></form><div id="savedTests" class="saved-tests"></div></div>`;
}

function getStudentUsers() {
  return getUsers().filter((u) => u.role === "student");
}

function renderAccountsPage(data) {
  const ap = data.accountsPage ?? {};
  let list = getStudentUsers();
  const f = state.accountsFilter;
  if (f.name) list = list.filter((u) => u.fullName.toLowerCase().includes(f.name.toLowerCase()));
  if (f.grade) list = list.filter((u) => String(u.grade || "") === f.grade);
  if (f.letter) list = list.filter((u) => String(u.letter || "").toLowerCase() === f.letter.toLowerCase());
  const rows = list
    .map((u, i) => {
      const pwd = u.plainPassword || "(localStorage)";
      return `<tr><td>${i + 1}</td><td>${escapeHtml(u.fullName)}</td><td>${escapeHtml(u.grade || "—")}</td><td>${escapeHtml(u.letter || "—")}</td><td><code>${escapeHtml(u.login)}</code></td><td><code>${escapeHtml(pwd)}</code></td></tr>`;
    })
    .join("");
  return `<div class="admin-page fade-in"><div class="accounts-head"><h1 class="admin-page-title">${t(ap.title)}</h1><button class="btn" type="button" data-export-excel>${t(ap.exportExcel)}</button></div><div class="accounts-filters"><input class="input" data-filter-name placeholder="${t(ap.filters?.name)}" value="${escapeAttr(f.name)}" /><input class="input" data-filter-grade placeholder="${t(ap.filters?.grade)}" value="${escapeAttr(f.grade)}" /><input class="input" data-filter-letter placeholder="${t(ap.filters?.letter)}" value="${escapeAttr(f.letter)}" /></div><div class="table-wrap"><table class="data-table"><thead><tr><th>${ap.columns?.idx ?? "#"}</th><th>${t(ap.columns?.name)}</th><th>${t(ap.columns?.grade)}</th><th>${t(ap.columns?.letter)}</th><th>${t(ap.columns?.login)}</th><th>${t(ap.columns?.password)}</th></tr></thead><tbody>${rows}</tbody></table></div></div>`;
}

function renderResultsPage(data) {
  const rp = data.resultsPage ?? {};
  const tabs = (rp.tabs ?? []).map((tab) => `<button type="button" class="results-tab ${state.resultsTab === tab.id ? "is-active" : ""}" data-results-tab="${tab.id}">${t(tab.label)}</button>`).join("");
  const stored = getTestResultsList();
  const detailLabel = t(rp.viewDetail ?? { kz: "Толығырақ", ru: "Подробнее" });
  const storedRows = stored
    .map((r) => {
      const statusText = state.lang === "kz" ? "Тапсырылды" : "Сдано";
      const href = `#/admin/results/detail/${encodeURIComponent(r.scheduleId)}/${encodeURIComponent(r.studentLogin)}`;
      return `<tr>
        <td>${escapeHtml(r.fullName)}</td>
        <td>${escapeHtml(state.lang === "kz" ? "Информатика" : "Информатика")}</td>
        <td>${escapeHtml(`${r.score}/${r.maxScore}`)}</td>
        <td>${escapeHtml(formatIsoDate(r.submittedAt))}</td>
        <td><a class="btn btn-primary results-detail-btn" href="${href}">${escapeHtml(detailLabel)}</a></td>
        <td class="muted">${statusText}</td>
      </tr>`;
    })
    .join("");
  const demoRows = (rp.rows ?? [])
    .map((row) => {
      const statusText = row.status === "not_started" ? t(rp.notStarted) : escapeHtml(row.status || "");
      return `<tr>
        <td>${escapeHtml(row.name)}</td>
        <td>${escapeHtml(String(row.subjectScore))}</td>
        <td>${escapeHtml(String(row.total))}</td>
        <td>${escapeHtml(row.submittedAt)}</td>
        <td><button type="button" class="link-btn" data-copy-link="${escapeAttr(row.courseUrl)}">${t(rp.copy)}</button> <button type="button" class="link-btn" data-open-link="${escapeAttr(row.courseUrl)}">${t(rp.view)}</button></td>
        <td class="muted">${statusText}</td>
      </tr>`;
    })
    .join("");
  const rows = stored.length ? storedRows : demoRows;
  const notice = stored.length
    ? `<p class="results-storage-note">${state.lang === "kz" ? "Кесте: информатика тестінің нақты нәтижелері (localStorage)." : "Таблица: реальные результаты теста по информатике (localStorage)."}</p>`
    : "";
  return `<div class="admin-page fade-in results-page"><div class="results-meta"><h1 class="results-meta-title">${t(rp.title)}</h1><div class="results-meta-sub">${t(rp.school)}</div><div class="results-meta-line"><span class="badge-grade">${t(rp.gradeLine)}</span></div><p class="results-meta-desc">${t(rp.details)}</p><p class="results-meta-time">🕐 ${escapeHtml(rp.scheduledAt)}</p></div>${notice}<div class="results-tabs">${tabs}</div><div class="table-wrap"><table class="data-table results-table"><thead><tr>
    <th>${t(rp.columns?.name)}</th>
    <th>${t(rp.columns?.subject)}</th>
    <th>${t(rp.columns?.total)}</th>
    <th>${t(rp.columns?.submitted)}</th>
    <th>${t(rp.columns?.link)}</th>
    <th>${t(rp.columns?.status)}</th>
  </tr></thead><tbody>${rows}</tbody></table></div></div>`;
}

function renderAdminDashboard(data) {
  const ac = data.adminCabinet ?? {};
  return `<div class="admin-page fade-in"><div class="admin-profile"><div class="admin-avatar"></div><div><div class="admin-org">${t(ac.orgLabel)}</div><h2 class="admin-school">${t(ac.schoolName)}</h2></div></div><p class="hero-subtitle">${state.lang === "kz" ? "Тестілеуді жоспарлау, тест құрастыру, оқушылар және қорытындылар бөлімдерін таңдаңыз." : "Выберите раздел: планирование теста, конструктор, учащиеся или результаты."}</p><div class="dashboard-cards"><a class="dashboard-card" href="#/admin/schedule"><h3>${t({ kz: "Тестті жоспарлау", ru: "Планирование теста" })}</h3></a><a class="dashboard-card" href="#/admin/testBuilder"><h3>${t({ kz: "Тест құрастырушы", ru: "Конструктор тестов" })}</h3></a><a class="dashboard-card" href="#/admin/accounts"><h3>${t({ kz: "Оқушылар", ru: "Учащиеся" })}</h3></a><a class="dashboard-card" href="#/admin/results"><h3>${t({ kz: "Қорытындылар", ru: "Результаты" })}</h3></a></div></div>`;
}

function renderAdminResultDetailPage(data, scheduleId, studentLogin) {
  const rp = data.resultsPage ?? {};
  const sc = data.studentCabinet ?? {};
  const result = getTestResultsList().find((r) => r.scheduleId === scheduleId && r.studentLogin === studentLogin);
  if (!result) {
    return `<div class="admin-page fade-in"><p class="hero-subtitle">${t(rp.resultNotFound ?? { kz: "Нәтиже табылмады.", ru: "Результат не найден." })}</p><p><a class="btn btn-primary" href="#/admin/results">${t(rp.backToList ?? { kz: "Тізімге", ru: "К списку" })}</a></p></div>`;
  }
  const schedule = getScheduledTests().find((s) => s.id === scheduleId);
  const dateLine = schedule?.calendarDate ? `${state.lang === "kz" ? "Күні: " : "Дата: "}${escapeHtml(schedule.calendarDate)}` : "";
  return `<div class="admin-page fade-in"><a class="student-test-back" href="#/admin/results">${t(rp.backToList ?? { kz: "← Қорытындылар", ru: "← К результатам" })}</a><h1 class="admin-page-title">${escapeHtml(result.fullName)}</h1><p class="hero-subtitle"><code>${escapeHtml(result.studentLogin)}</code>${dateLine ? ` · ${dateLine}` : ""}</p><p class="student-result-score">${t(sc.scoreLabel)}: <strong>${result.score}/${result.maxScore}</strong></p><p class="hero-subtitle muted">${escapeHtml(formatIsoDate(result.submittedAt))}</p><h2 class="student-tests-heading">${t(rp.detailAnswersHeading ?? { kz: "Жауаптар", ru: "Ответы по вопросам" })}</h2>${renderInformaticsResultBreakdownHTML(result, data)}</div>`;
}

function renderAdminMain(data, section, resultDetail) {
  if (section === "results" && resultDetail) {
    return renderAdminResultDetailPage(data, resultDetail.scheduleId, resultDetail.studentLogin);
  }
  switch (section) {
    case "schedule":
      return renderSchedulePage(data);
    case "testBuilder":
      return renderTestBuilderPage(data);
    case "accounts":
      return renderAccountsPage(data);
    case "results":
      return renderResultsPage(data);
    default:
      return renderAdminDashboard(data);
  }
}

function renderAdminShell(data) {
  const path = parseRoute();
  const { section, resultDetail } = parseAdminRoute(path);
  const bc = `${t(data.adminCabinet?.breadcrumbHome)} / ${t(data.adminCabinet?.sidebar?.find((s) => s.id === section)?.label ?? data.adminCabinet?.sidebar?.[0]?.label)}`;
  return `${renderHeader(data)}<div class="admin-layout"><div class="container admin-layout-inner">${renderAdminSidebar(data, section)}<main class="admin-main"><div class="breadcrumb">${bc}</div>${renderAdminMain(data, section, resultDetail)}</main></div></div>${renderFooter(data)}`;
}

function formatIsoDate(iso) {
  try {
    return new Date(iso).toLocaleString(state.lang === "kz" ? "kk-KZ" : "ru-RU");
  } catch {
    return String(iso || "");
  }
}

function renderStudentDashboardContent(data) {
  const sc = data.studentCabinet ?? {};
  const user = state.currentUser;
  const list = getScheduledTestsForStudent(user);
  const cards = list
    .map((s) => {
      const done = getResultByScheduleAndLogin(s.id, user.login);
      const meta = `${escapeHtml(s.calendarDate)} · ${done ? escapeHtml(t(sc.statusCompleted)) : escapeHtml(t(sc.statusPending))}`;
      const actions = done
        ? `<span class="student-test-score">${escapeHtml(t(sc.scoreShort))}: <strong>${done.score}/${done.maxScore}</strong></span> <a class="btn" href="#/student/test/${encodeURIComponent(s.id)}">${t(sc.viewResult)}</a>`
        : `<a class="btn btn-primary" href="#/student/test/${encodeURIComponent(s.id)}">${t(sc.openTest)}</a>`;
      return `<div class="student-test-card"><div class="student-test-card-head"><span class="student-test-card-title">${escapeHtml(t(sc.subjectInformatics))}</span>${meta}</div>${actions}</div>`;
    })
    .join("");

  return `<div class="admin-page fade-in"><h1 class="admin-page-title">${t(sc.title)}</h1><p class="hero-subtitle">${t(sc.welcome)}</p><p class="hero-subtitle"><strong>${escapeHtml(user?.fullName || "")}</strong> · ${escapeHtml(user?.login || "")}</p><h2 class="student-tests-heading">${t(sc.scheduledTestsHeading)}</h2>${
    cards ? `<div class="student-tests-grid">${cards}</div>` : `<p class="hero-subtitle muted">${t(sc.noScheduledTests)}</p>`
  }</div>`;
}

function renderStudentTestPage(data, scheduleId) {
  const sc = data.studentCabinet ?? {};
  const user = state.currentUser;
  const schedule = getScheduledTests().find((s) => s.id === scheduleId);
  if (!schedule) {
    return `<div class="admin-page fade-in"><p class="hero-subtitle">${t(sc.testNotFound)}</p><p><a class="btn btn-primary" href="#/student">${t(sc.back)}</a></p></div>`;
  }
  if (!studentAssignedToSchedule(schedule, user)) {
    return `<div class="admin-page fade-in"><p class="hero-subtitle">${t(sc.testAccessDenied)}</p><p><a class="btn btn-primary" href="#/student">${t(sc.back)}</a></p></div>`;
  }
  const existing = getResultByScheduleAndLogin(scheduleId, user.login);
  if (existing) {
    const breakdownTitle = t(sc.resultBreakdownHeading ?? { kz: "Сұрақтар бойынша", ru: "По вопросам" });
    return `<div class="admin-page fade-in"><a class="student-test-back" href="#/student">${t(sc.back)}</a><h1 class="admin-page-title">${t(sc.resultTitle)}</h1><p class="student-result-score">${t(sc.scoreLabel)}: <strong>${existing.score}/${existing.maxScore}</strong></p><p class="hero-subtitle">${escapeHtml(formatIsoDate(existing.submittedAt))}</p><h2 class="student-tests-heading">${escapeHtml(breakdownTitle)}</h2>${renderInformaticsResultBreakdownHTML(existing, data)}</div>`;
  }

  const qs = INFORMATICS_QUESTIONS.map((q, i) => {
    const opts = q.options
      .map(
        (opt, j) =>
          `<label class="student-test-opt"><input type="radio" name="q${i}" value="${j}" required /> <span>${escapeHtml(t(opt))}</span></label>`
      )
      .join("");
    return `<div class="student-test-q"><div class="student-test-qtext">${i + 1}. ${escapeHtml(t(q.text))}</div><div class="student-test-opts">${opts}</div></div>`;
  }).join("");

  return `<div class="admin-page fade-in"><a class="student-test-back" href="#/student">${t(sc.back)}</a><h1 class="admin-page-title">${t(sc.takeTestTitle)}</h1><p class="hero-subtitle">${t(sc.informaticsTen)}</p><form data-student-test-form data-schedule-id="${escapeAttr(scheduleId)}">${qs}<button class="btn btn-primary student-test-submit" type="submit">${t(sc.submitTest)}</button></form></div>`;
}

function renderStudentShell(data) {
  const path = parseRoute();
  const segs = path.split("/").filter(Boolean);
  const inner = segs[1] === "test" && segs[2] ? renderStudentTestPage(data, decodeURIComponent(segs[2])) : renderStudentDashboardContent(data);
  return `${renderHeader(data)}<div class="admin-layout"><div class="container admin-layout-inner"><main class="admin-main admin-main--full">${inner}</main></div></div>${renderFooter(data)}`;
}

function renderLanding(data) {
  return `${renderHeader(data)}<main>${renderHero(data)}${renderFeatures(data)}${renderAiTutorSection(data)}</main>${renderFooter(data)}${renderAuthModal(data)}`;
}

function renderApp(data) {
  normalizeAppData(data);
  setTheme(data.site?.theme);
  const app = document.getElementById("app");
  const path = parseRoute();
  const segments = path.split("/").filter(Boolean);

  if (!state.currentUser && (segments[0] === "admin" || segments[0] === "student")) {
    history.replaceState(null, "", `${window.location.pathname}${window.location.search}#/`);
  }

  if (state.currentUser?.role === "student" && segments[0] === "admin") {
    navigate("/student");
    return renderApp(data);
  }
  if (state.currentUser?.role === "admin" && segments[0] === "student") {
    navigate("/admin");
    return renderApp(data);
  }

  if (state.currentUser?.role === "admin" && segments[0] === "admin") {
    state.authModal = null;
    app.innerHTML = renderAdminShell(data);
  } else if (state.currentUser && state.currentUser.role === "student" && segments[0] === "student") {
    state.authModal = null;
    app.innerHTML = renderStudentShell(data);
  } else {
    app.innerHTML = renderLanding(data);
  }

  document.body.style.overflow = state.authModal ? "hidden" : "";
  document.documentElement.lang = state.lang === "kz" ? "kk" : "ru";
  attachEvents(data);
}

function scrollToId(id) {
  document.getElementById(id)?.scrollIntoView({ behavior: "smooth", block: "start" });
}

function formatOpenAIChatError(status, apiDetail) {
  const kz = state.lang === "kz";
  const detail = apiDetail ? String(apiDetail).trim() : "";
  const lines = {
    429: kz
      ? "OpenAI шегі (429): сұраулар тым жиі немесе айлық лимит/теңгерім таусылды. Кейінірек қайталаңыз; platform.openai.com → Usage / Billing бөлімін тексеріңіз."
      : "Лимит OpenAI (429): слишком частые запросы или исчерпана квота. Повторите позже; проверьте Usage / Billing на platform.openai.com.",
    401: kz
      ? "Кілт жарамсыз (401): API кілтін тексеріңіз."
      : "Неверный ключ (401): проверьте API key.",
    402: kz
      ? "Төлем қажет (402): шотта баланс жоқ болуы мүмкін."
      : "Требуется оплата (402): проверьте баланс на platform.openai.com.",
    403: kz
      ? "Қол жеткізу тыйым салынған (403)."
      : "Доступ запрещён (403).",
    503: kz
      ? "OpenAI уақытша қолжетімсіз (503). Кейінірек қайталаңыз."
      : "Сервис OpenAI временно недоступен (503). Повторите позже."
  };
  const head = lines[status];
  if (head) {
    return detail && !detail.includes(String(status)) ? `${head}\n\n${detail}` : head;
  }
  return kz
    ? `Сервер қатесі (${status})${detail ? `: ${detail}` : ""}`
    : `Ошибка сервера (${status})${detail ? `: ${detail}` : ""}`;
}

function getOpenAIApiKey(data) {
  const fromData = String(data?.aiTutor?.apiKey ?? "").trim();
  if (fromData) return fromData;
  return String(localStorage.getItem(STORAGE_KEYS.apiKey) ?? "").trim();
}

async function sendChatMessage(data, message) {
  const key = getOpenAIApiKey(data);
  if (!key) {
    alert(
      state.lang === "kz"
        ? "OpenAI API кілті жоқ: data.json → aiTutor.apiKey немесе localStorage (edumetrics:apiKey)."
        : "Нет ключа OpenAI: укажите data.json → aiTutor.apiKey или localStorage (edumetrics:apiKey)."
    );
    return;
  }
  state.sending = true;
  state.chatMessages.push({ role: "user", content: message });
  renderApp(data);
  try {
    const model = (data.aiTutor?.model || "gpt-4o-mini").trim();
    const endpoint = data.aiTutor?.endpoint || "https://api.openai.com/v1/chat/completions";
    const payload = {
      model,
      messages: [
        { role: "system", content: t(data.aiTutor?.systemPrompt) },
        ...state.chatMessages.map((x) => ({ role: x.role, content: x.content }))
      ]
    };
    const res = await fetch(endpoint, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${key}`
      },
      body: JSON.stringify(payload)
    });
    const raw = await res.text();
    let json = null;
    try {
      json = raw ? JSON.parse(raw) : null;
    } catch {
      json = null;
    }
    if (!res.ok) {
      const apiDetail = json?.error?.message || raw?.slice(0, 400) || "";
      state.chatMessages.push({ role: "assistant", content: formatOpenAIChatError(res.status, apiDetail) });
      return;
    }
    const answer =
      json?.choices?.[0]?.message?.content?.trim() ||
      (state.lang === "kz" ? "Жауап жоқ. Басқа модельді байқап көріңіз." : "Пустой ответ. Попробуйте другую модель.");
    state.chatMessages.push({ role: "assistant", content: answer });
  } catch (e) {
    const msg =
      e?.name === "TypeError" && String(e.message).includes("fetch")
        ? state.lang === "kz"
          ? "Желіге қосылу мүмкін емес (CORS немесе офлайн). Интернетті тексеріңіз."
          : "Не удалось выполнить запрос (сеть, CORS или офлайн)."
        : `Error: ${e?.message || e}`;
    state.chatMessages.push({ role: "assistant", content: msg });
  } finally {
    state.sending = false;
    renderApp(data);
  }
}

function attachEvents(data) {
  if (authEscapeHandler) {
    document.removeEventListener("keydown", authEscapeHandler);
    authEscapeHandler = null;
  }

  document.querySelector("[data-burger]")?.addEventListener("click", () => {
    state.mobileMenuOpen = !state.mobileMenuOpen;
    renderApp(data);
  });
  document.querySelector("[data-lang-toggle]")?.addEventListener("click", () => {
    state.lang = state.lang === "kz" ? "ru" : "kz";
    renderApp(data);
  });
  document.querySelector("[data-logout]")?.addEventListener("click", () => {
    saveSessionUser(null);
    navigate("/");
    renderApp(data);
  });

  document.querySelectorAll("[data-action]").forEach((el) => {
    el.addEventListener("click", (e) => {
      e.preventDefault();
      const id = el.getAttribute("data-action");
      if (id === "signup") {
        state.authModal = "register";
        state.mobileMenuOpen = false;
        return renderApp(data);
      }
      if (id === "login") {
        state.authModal = "login";
        state.mobileMenuOpen = false;
        return renderApp(data);
      }
      if (id === "home" || id === "logo") {
        state.authModal = null;
        navigate("/");
        return renderApp(data);
      }
      alert(`Action: ${id}`);
    });
  });

  document.querySelectorAll("[data-dropdown-toggle]").forEach((el) =>
    el.addEventListener("click", () => {
      const idx = Number(el.getAttribute("data-dropdown-toggle"));
      state.openDropdownIndex = state.openDropdownIndex === idx ? null : idx;
      renderApp(data);
    })
  );

  document.querySelectorAll("[data-scroll]").forEach((el) => {
    el.addEventListener("click", (e) => {
      e.preventDefault();
      const id = el.getAttribute("data-scroll");
      if (id) scrollToId(id);
    });
  });

  document.querySelectorAll("[data-hero-btn]").forEach((btn) => {
    btn.addEventListener("click", () => scrollToId("features"));
  });

  const closeAuthModal = () => {
    if (!state.authModal) return;
    state.authModal = null;
    renderApp(data);
  };

  document.querySelector("[data-auth-modal-overlay]")?.addEventListener("click", (e) => {
    if (e.target === e.currentTarget) closeAuthModal();
  });
  document.querySelector("[data-auth-modal-close]")?.addEventListener("click", () => closeAuthModal());
  document.querySelectorAll("[data-auth-tab]").forEach((el) => {
    el.addEventListener("click", () => {
      const tab = el.getAttribute("data-auth-tab");
      if (tab === "register" || tab === "login") {
        state.authModal = tab;
        renderApp(data);
      }
    });
  });

  if (state.authModal) {
    authEscapeHandler = (e) => {
      if (e.key !== "Escape") return;
      document.removeEventListener("keydown", authEscapeHandler);
      authEscapeHandler = null;
      closeAuthModal();
    };
    document.addEventListener("keydown", authEscapeHandler);
  }

  const demoFullProductMessage = (label) =>
    state.lang === "kz"
      ? `${label}\n\nБұл локалды демо. Толық тестілеу, тренажёрлар және аналитика: https://edoox.com`
      : `${label}\n\nЛокальная демо. Полное тестирование и аналитика: https://edoox.com`;

  document.querySelectorAll("[data-sub]").forEach((el) =>
    el.addEventListener("click", (e) => {
      e.preventDefault();
      const label = t(data.header?.menu?.[Number(el.getAttribute("data-nav"))]?.items?.[Number(el.getAttribute("data-sub"))]?.title);
      alert(demoFullProductMessage(label));
    })
  );

  document.querySelectorAll("[data-feature]").forEach((el) =>
    el.addEventListener("click", () => {
      const label = t(data.features?.[Number(el.getAttribute("data-feature"))]?.title);
      alert(demoFullProductMessage(label));
    })
  );

  document.querySelector("[data-register-form]")?.addEventListener("submit", (e) => {
    e.preventDefault();
    const form = e.currentTarget;
    const fullName = form.fullName.value.trim();
    const email = form.email.value.trim();
    const login = form.login.value.trim();
    const password = form.password.value;
    const confirm = form.confirm.value;
    if (password.length < 4) return alert("Password min 4");
    if (password !== confirm) return alert("Passwords do not match");
    const users = getUsers();
    if (users.some((u) => u.login === login)) return alert("Login already exists");
    users.push({
      fullName,
      email,
      login,
      passwordHash: hashPassword(password),
      role: "student",
      grade: "",
      letter: ""
    });
    saveUsers(users);
    alert(state.lang === "kz" ? "Тіркелу сәтті!" : "Регистрация успешна!");
    form.reset();
    state.authModal = null;
    renderApp(data);
  });

  document.querySelector("[data-login-form]")?.addEventListener("submit", (e) => {
    e.preventDefault();
    const form = e.currentTarget;
    const login = form.login.value.trim();
    const password = form.password.value;
    const found = getUsers().find((u) => u.login === login && u.passwordHash === hashPassword(password));
    if (!found) return alert(state.lang === "kz" ? "Логин немесе құпиясөз қате" : "Неверный логин или пароль");
    const role = found.role || (found.login === "admin" ? "admin" : "student");
    saveSessionUser({
      login: found.login,
      fullName: found.fullName,
      email: found.email,
      role,
      grade: found.grade,
      letter: found.letter
    });
    if (role === "admin") navigate("/admin");
    else navigate("/student");
    renderApp(data);
  });

  document.querySelector("[data-new-chat]")?.addEventListener("click", () => {
    state.chatSessionId = createSessionId();
    state.chatMessages = [];
    renderApp(data);
  });

  document.querySelector("[data-chat-form]")?.addEventListener("submit", async (e) => {
    e.preventDefault();
    const message = e.currentTarget.message.value.trim();
    if (!message) return;
    e.currentTarget.reset();
    await sendChatMessage(data, message);
  });

  document.querySelector("[data-student-test-form]")?.addEventListener("submit", (e) => {
    e.preventDefault();
    const form = e.currentTarget;
    const sid = form.getAttribute("data-schedule-id");
    const user = state.currentUser;
    if (!sid || !user || user.role !== "student") return;
    let score = 0;
    const fd = new FormData(form);
    const answers = INFORMATICS_QUESTIONS.map((q, i) => {
      const raw = fd.get(`q${i}`);
      const n = raw === null || raw === "" ? null : Number(raw);
      return {
        selected: Number.isNaN(n) ? null : n,
        correct: q.correct
      };
    });
    INFORMATICS_QUESTIONS.forEach((q, i) => {
      const v = answers[i].selected;
      if (v != null && !Number.isNaN(v) && v === q.correct) score++;
    });
    const maxScore = INFORMATICS_QUESTIONS.length;
    saveTestResult({
      scheduleId: sid,
      studentLogin: user.login,
      fullName: user.fullName || user.login,
      score,
      maxScore,
      submittedAt: new Date().toISOString(),
      answers
    });
    navigate(`/student/test/${encodeURIComponent(sid)}`);
    renderApp(data);
  });

  document.querySelectorAll("[data-cal-date]").forEach((btn) => {
    btn.addEventListener("click", () => {
      state.scheduleSelectedDate = btn.getAttribute("data-cal-date") || state.scheduleSelectedDate;
      renderApp(data);
    });
  });

  document.querySelector("[data-add-grade]")?.addEventListener("change", (e) => {
    const v = e.target.value;
    if (!v) return;
    if (!state.scheduleDraft.selectedGrades.includes(v)) state.scheduleDraft.selectedGrades.push(v);
    state.scheduleDraft.selectedGrades.sort((a, b) => Number(a) - Number(b));
    e.target.value = "";
    state.scheduleFormErrors.grades = false;
    pruneScheduleStudentSelection();
    renderApp(data);
  });

  document.querySelector("[data-letter-pick]")?.addEventListener("change", (e) => {
    state.scheduleDraft.selectedLetter = e.target.value || "";
    pruneScheduleStudentSelection();
    renderApp(data);
  });

  const schedForm = document.querySelector("[data-schedule-form]");
  schedForm?.addEventListener("input", (e) => {
    if (e.target.matches('input[name="scheduleTime"]')) {
      state.scheduleStartTime = e.target.value || "09:00";
      state.scheduleFormErrors.startTime = false;
    }
  });
  schedForm?.addEventListener("change", (e) => {
    if (e.target.matches('select[name="language"]')) state.scheduleFormErrors.language = false;
    if (e.target.matches('select[name="durationHours"]')) state.scheduleFormErrors.duration = false;
  });

  schedForm?.addEventListener("click", (e) => {
    const rmG = e.target.closest("[data-remove-grade]");
    if (rmG) {
      const v = rmG.getAttribute("data-remove-grade");
      state.scheduleDraft.selectedGrades = state.scheduleDraft.selectedGrades.filter((x) => x !== v);
      state.scheduleFormErrors.grades = false;
      const lettersNow = getLettersForScheduleGrades(state.scheduleDraft.selectedGrades);
      if (state.scheduleDraft.selectedLetter && !lettersNow.includes(state.scheduleDraft.selectedLetter)) {
        state.scheduleDraft.selectedLetter = "";
      }
      pruneScheduleStudentSelection();
      renderApp(data);
      return;
    }
    if (e.target.closest("[data-remove-letter]")) {
      state.scheduleDraft.selectedLetter = "";
      pruneScheduleStudentSelection();
      renderApp(data);
      return;
    }
    const rmS = e.target.closest("[data-remove-student]");
    if (rmS) {
      const login = rmS.getAttribute("data-remove-student");
      state.scheduleDraft.selectedStudentLogins = state.scheduleDraft.selectedStudentLogins.filter((l) => l !== login);
      state.scheduleFormErrors.students = false;
      renderApp(data);
      return;
    }
    const row = e.target.closest("[data-student-row]");
    if (row && !row.disabled) {
      const login = row.getAttribute("data-student-row");
      const arr = [...state.scheduleDraft.selectedStudentLogins];
      const ix = arr.indexOf(login);
      if (ix >= 0) arr.splice(ix, 1);
      else arr.push(login);
      state.scheduleDraft.selectedStudentLogins = arr;
      state.scheduleFormErrors.students = false;
      renderApp(data);
      return;
    }
    const allBtn = e.target.closest("[data-student-all]");
    if (allBtn && !allBtn.disabled) {
      const list = getScheduleFilteredStudentList();
      const allSel = list.length && list.every((u) => state.scheduleDraft.selectedStudentLogins.includes(u.login));
      state.scheduleDraft.selectedStudentLogins = allSel ? [] : list.map((u) => u.login);
      state.scheduleFormErrors.students = false;
      renderApp(data);
      return;
    }
    if (e.target.closest("[data-schedule-preview]")) {
      e.preventDefault();
      const st = data.scheduleTest ?? {};
      const preview =
        `${t({ kz: "Алдын ала қарау", ru: "Предпросмотр" })}\n\n` +
        `${t(st.fields?.subjectWithInformatics)}\n` +
        `${t({ kz: "Күн", ru: "Дата" })}: ${state.scheduleSelectedDate}\n` +
        `${t(st.gradesLabel)}: ${state.scheduleDraft.selectedGrades.map(scheduleGradeLabel).join(", ") || "—"}\n` +
        `${t(st.lettersLabel)}: ${state.scheduleDraft.selectedLetter || t(st.fields?.letters)}\n` +
        `${t(st.studentsLabel)}: ${state.scheduleDraft.selectedStudentLogins.length}\n` +
        `${t(st.fields?.language)}: ${String(document.getElementById("sched-lang")?.value || "—")}\n` +
        `${t(st.fields?.startTime)}: ${state.scheduleStartTime}\n` +
        `${t(st.fields?.availability)}: ${String(document.getElementById("sched-dur")?.selectedOptions?.[0]?.text || "—")}`;
      alert(preview);
    }
  });

  schedForm?.addEventListener("submit", (e) => {
    e.preventDefault();
    const st = data.scheduleTest ?? {};
    state.scheduleFormErrors = {};
    const fd = new FormData(e.currentTarget);
    if (!state.scheduleDraft.selectedGrades.length) state.scheduleFormErrors.grades = true;
    if (!state.scheduleDraft.selectedStudentLogins.length) state.scheduleFormErrors.students = true;
    if (!String(fd.get("language") || "")) state.scheduleFormErrors.language = true;
    const tm = String(fd.get("scheduleTime") || "");
    if (!tm) state.scheduleFormErrors.startTime = true;
    if (!String(fd.get("durationHours") || "")) state.scheduleFormErrors.duration = true;
    if (Object.keys(state.scheduleFormErrors).length) {
      renderApp(data);
      return;
    }
    const timePart = tm.length === 5 ? `${tm}:00` : tm;
    const startTime = `${state.scheduleSelectedDate}T${timePart}`;
    const selectedUsers = getStudentUsers().filter((u) => state.scheduleDraft.selectedStudentLogins.includes(u.login));
    const entry = {
      id: createSessionId(),
      createdAt: new Date().toISOString(),
      calendarDate: state.scheduleSelectedDate,
      testType: String(fd.get("testType") || "subject"),
      subject: String(fd.get("subject") || "informatics"),
      questionCount: INFORMATICS_QUESTIONS.length,
      grades: [...state.scheduleDraft.selectedGrades],
      letter: state.scheduleDraft.selectedLetter || null,
      studentLogins: [...state.scheduleDraft.selectedStudentLogins],
      studentsSnapshot: selectedUsers.map((u) => ({
        login: u.login,
        fullName: u.fullName,
        grade: u.grade,
        letter: u.letter
      })),
      language: String(fd.get("language") || ""),
      startTime,
      durationHours: Number(fd.get("durationHours"))
    };
    pushScheduledTest(entry);
    state.scheduleFormErrors = {};
    state.scheduleDraft.selectedStudentLogins = [];
    alert(state.lang === "kz" ? "Жоспар сақталды." : "План сохранён.");
    renderApp(data);
  });

  document.querySelector("[data-test-builder-form]")?.addEventListener("submit", (e) => {
    e.preventDefault();
    const fd = new FormData(e.currentTarget);
    const entry = {
      title: String(fd.get("title")),
      subject: String(fd.get("subject")),
      questions: Number(fd.get("questions")),
      duration: Number(fd.get("duration")),
      at: new Date().toISOString()
    };
    let list = [];
    try {
      list = JSON.parse(localStorage.getItem(STORAGE_KEYS.savedTests) || "[]");
    } catch {
      list = [];
    }
    list.push(entry);
    localStorage.setItem(STORAGE_KEYS.savedTests, JSON.stringify(list));
    alert(state.lang === "kz" ? "Тест сақталды!" : "Тест сохранён!");
    e.currentTarget.reset();
    renderApp(data);
  });

  document.querySelector("[data-filter-name]")?.addEventListener("input", (e) => {
    state.accountsFilter.name = e.target.value;
    renderApp(data);
  });
  document.querySelector("[data-filter-grade]")?.addEventListener("input", (e) => {
    state.accountsFilter.grade = e.target.value;
    renderApp(data);
  });
  document.querySelector("[data-filter-letter]")?.addEventListener("input", (e) => {
    state.accountsFilter.letter = e.target.value;
    renderApp(data);
  });

  document.querySelector(".schedule-link")?.addEventListener("click", (e) => e.preventDefault());

  document.querySelector("[data-export-excel]")?.addEventListener("click", () => {
    const list = getStudentUsers();
    const header = ["#", "ФИО", "Класс", "Литера", "Логин", "Пароль"];
    const lines = [header.join("\t"), ...list.map((u, i) => [i + 1, u.fullName, u.grade || "", u.letter || "", u.login, u.plainPassword || ""].join("\t"))];
    const blob = new Blob([lines.join("\n")], { type: "text/csv;charset=utf-8" });
    const a = document.createElement("a");
    a.href = URL.createObjectURL(blob);
    a.download = "students.csv";
    a.click();
  });

  document.querySelectorAll("[data-results-tab]").forEach((btn) => {
    btn.addEventListener("click", () => {
      state.resultsTab = btn.getAttribute("data-results-tab") || "points";
      renderApp(data);
    });
  });

  document.querySelectorAll("[data-copy-link]").forEach((btn) => {
    btn.addEventListener("click", async () => {
      const url = btn.getAttribute("data-copy-link") || "";
      try {
        await navigator.clipboard.writeText(url);
        alert(state.lang === "kz" ? "Көшірілді" : "Скопировано");
      } catch {
        prompt("Copy:", url);
      }
    });
  });

  document.querySelectorAll("[data-open-link]").forEach((btn) => {
    btn.addEventListener("click", () => {
      const url = btn.getAttribute("data-open-link");
      if (url) window.open(url, "_blank", "noopener");
    });
  });

  document.querySelectorAll("[data-footer-btn]").forEach((el) => {
    el.addEventListener("click", () => alert(`Footer: ${el.getAttribute("data-footer-btn")}`));
  });

  document.querySelectorAll("[data-social]").forEach((el) => {
    el.addEventListener("click", (e) => {
      e.preventDefault();
      alert(`Social: ${el.getAttribute("data-social")}`);
    });
  });
}

function escapeHtml(str) {
  return String(str).replaceAll("&", "&amp;").replaceAll("<", "&lt;").replaceAll(">", "&gt;").replaceAll('"', "&quot;").replaceAll("'", "&#039;");
}

function escapeAttr(str) {
  return escapeHtml(str).replaceAll("`", "&#096;");
}

function cacheData(data) {
  localStorage.setItem(STORAGE_KEYS.data, JSON.stringify(data));
}

function loadCachedData() {
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.data);
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
}

function renderFileModeLoader() {
  const app = document.getElementById("app");
  app.innerHTML = `<div style="padding:24px;font-family:Inter,system-ui,sans-serif;color:#0f172a;font-weight:800;line-height:1.45;"><div style="font-size:18px;letter-spacing:-0.02em;">File mode</div><div style="margin-top:8px;color:#344054;font-weight:700;">Select <code>data.json</code> manually.</div><div style="margin-top:14px;display:flex;gap:10px;flex-wrap:wrap;align-items:center;"><button id="pickDataBtn" style="border:0;cursor:pointer;border-radius:999px;padding:10px 14px;font-weight:900;background:linear-gradient(135deg, rgba(108, 76, 241, 1) 0%, rgba(161, 132, 255, 1) 100%);color:#fff;">Load data.json</button></div><input id="dataFileInput" type="file" accept="application/json,.json" style="display:none" /></div>`;
  const input = document.getElementById("dataFileInput");
  document.getElementById("pickDataBtn")?.addEventListener("click", () => input?.click());
  input?.addEventListener("change", async () => {
    const file = input.files?.[0];
    if (!file) return;
    const parsed = JSON.parse(await file.text());
    normalizeAppData(parsed);
    cacheData(parsed);
    renderApp(parsed);
  });
}

async function init() {
  seedDefaultAdmin();
  seedDemoStudents();
  state.currentUser = restoreSessionUser();
  const dataUrl = new URL("data.json", window.location.href);
  try {
    if (window.location.protocol === "file:") {
      const cached = loadCachedData();
      if (cached) return renderApp(cached);
      return renderFileModeLoader();
    }
    const res = await fetch(dataUrl, { cache: "no-store" });
    if (!res.ok) throw new Error(`Failed: ${res.status}`);
    const data = await res.json();
    normalizeAppData(data);
    cacheData(data);
    renderApp(data);
  } catch {
    renderFileModeLoader();
  }
}

window.addEventListener("hashchange", () => {
  const cached = loadCachedData();
  if (cached) renderApp(cached);
  else if (window.location.protocol !== "file:") {
    fetch(new URL("data.json", window.location.href), { cache: "no-store" })
      .then((r) => r.json())
      .then((d) => {
        normalizeAppData(d);
        cacheData(d);
        renderApp(d);
      })
      .catch(() => {});
  }
});

init();
