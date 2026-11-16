const storageKey = "midnight-lost-found-solved-v1";
const home = document.querySelector("#home");
const caseView = document.querySelector("#case-view");
const caseList = document.querySelector("#case-list");
const caseContent = document.querySelector("#case-content");
const validIds = new Set(CASES.map(item => item.id));
const solved = loadProgress();

function loadProgress() {
  try {
    const stored = JSON.parse(localStorage.getItem(storageKey) || "[]");
    return new Set(Array.isArray(stored) ? stored.filter(id => validIds.has(id)) : []);
  } catch {
    return new Set();
  }
}

function saveProgress(id) {
  solved.add(id);
  try {
    localStorage.setItem(storageKey, JSON.stringify([...solved]));
  } catch {
    // 瀏覽器限制儲存時，仍保留這一頁的遊戲進度。
  }
}

function updateProgress() {
  document.querySelector("#progress-count").textContent = `已破案 ${solved.size} / ${CASES.length}`;
}

function caseNumber(index) {
  return String(index + 1).padStart(2, "0");
}

function setText(parent, selector, text) {
  parent.querySelector(selector).textContent = text;
}

function renderArchive() {
  setText(document, "#archive-count", `${CASES.length} 起案件`);
  caseList.replaceChildren();
  CASES.forEach((item, index) => {
    const card = document.querySelector("#card-template").content.cloneNode(true);
    const link = card.querySelector("a");
    link.href = `#case/${item.id}`;
    link.dataset.theme = item.theme;
    setText(card, ".card-number", `案件 ${caseNumber(index)}`);
    setText(card, ".card-state", solved.has(item.id) ? "✓ 已破案" : `約 ${item.duration} 分鐘`);
    setText(card, ".case-icon", item.icon);
    setText(card, "h3", item.title);
    setText(card, "p", item.summary);
    setText(card, ".card-type", item.type);
    caseList.append(card);
  });
}

function renderCase(item, index) {
  const detail = document.querySelector("#case-template").content.cloneNode(true);
  setText(detail, ".case-label", `案件 ${caseNumber(index)} / ${item.type}`);
  setText(detail, "h1", item.title);
  setText(detail, ".case-story", item.story);
  setText(detail, ".evidence-count", `${item.clues.length} 件`);
  setText(detail, "legend", item.question);
  setText(detail, ".hint", item.hint);

  const clues = detail.querySelector(".clues");
  item.clues.forEach((clue, clueIndex) => {
    const disclosure = document.createElement("details");
    const title = document.createElement("summary");
    const number = document.createElement("span");
    const text = document.createElement("p");
    number.className = "clue-number";
    number.textContent = caseNumber(clueIndex);
    title.append(number, clue.title);
    text.textContent = clue.text;
    disclosure.append(title, text);
    clues.append(disclosure);
  });

  const form = detail.querySelector("form");
  const options = form.querySelector(".options");
  const submit = form.querySelector('[type="submit"]');
  const hint = form.querySelector(".hint");
  const hintButton = form.querySelector(".hint-button");
  const feedback = form.querySelector(".feedback");
  const nextLink = form.querySelector(".next-link");

  item.choices.forEach((choice, choiceIndex) => {
    const option = document.createElement("label");
    const radio = document.createElement("input");
    const letter = document.createElement("span");
    option.className = "option";
    radio.type = "radio";
    radio.name = "choice";
    radio.value = choice.id;
    letter.className = "option-letter";
    letter.setAttribute("aria-hidden", "true");
    letter.textContent = String.fromCharCode(65 + choiceIndex);
    option.append(radio, letter, choice.text);
    options.append(option);
  });

  form.addEventListener("change", () => {
    submit.disabled = false;
    feedback.replaceChildren();
    delete feedback.dataset.result;
  });

  hintButton.addEventListener("click", () => {
    hint.hidden = !hint.hidden;
    hintButton.setAttribute("aria-expanded", String(!hint.hidden));
    hintButton.textContent = hint.hidden ? "看提示" : "收起提示";
  });

  form.addEventListener("submit", event => {
    event.preventDefault();
    const selected = new FormData(form).get("choice");
    if (!selected) return;
    if (selected !== item.answerId) {
      feedback.dataset.result = "retry";
      feedback.textContent = "這個推論與證物不符。再看看線索，然後重新選擇。";
      return;
    }

    saveProgress(item.id);
    updateProgress();
    form.querySelector("fieldset").disabled = true;
    submit.disabled = true;
    feedback.dataset.result = "solved";
    const title = document.createElement("strong");
    title.textContent = "✓ 案件已破解";
    const explanation = document.createElement("p");
    explanation.textContent = item.explanation;
    feedback.replaceChildren(title, explanation);

    const next = CASES.slice(index + 1).concat(CASES.slice(0, index)).find(other => !solved.has(other.id));
    nextLink.href = next ? `#case/${next.id}` : "#archive";
    nextLink.textContent = next ? "調查下一案 →" : "返回失物檔案 →";
    nextLink.hidden = false;
    nextLink.focus();
  });

  caseContent.replaceChildren(detail);
}

function renderRoute() {
  const hash = location.hash;
  const caseId = hash.startsWith("#case/") ? hash.slice(6) : null;
  const index = CASES.findIndex(item => item.id === caseId);
  const wasInCase = !caseView.hidden;
  updateProgress();

  if (index >= 0) {
    home.hidden = true;
    caseView.hidden = false;
    renderCase(CASES[index], index);
    document.title = `${CASES[index].title}｜午夜失物局`;
    window.scrollTo(0, 0);
    caseView.querySelector("h1").focus({ preventScroll: true });
    return;
  }

  renderArchive();
  caseView.hidden = true;
  home.hidden = false;
  document.title = "午夜失物局｜互動推理檔案";
  if (hash === "#archive" || caseId !== null) {
    document.querySelector("#archive").scrollIntoView();
    if (wasInCase) caseList.querySelector("a")?.focus({ preventScroll: true });
  } else if (wasInCase || !hash) {
    window.scrollTo(0, 0);
  }
}

window.addEventListener("hashchange", renderRoute);
renderRoute();
