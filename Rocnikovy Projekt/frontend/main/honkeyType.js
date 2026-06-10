// projekt
console.log("HonkeyType Hybrid JS loaded");

const wordList = [
  "moan", "arrogant", "messy", "mind", "fabulous", "polish", "foolish", "straw",
  "skate", "blue", "teaching", "coal", "blue-eyed", "ants", "short", "malicious",
  "gigantic", "disapprove", "uneven", "fantastic", "terrific", "feeble", "fat",
  "blade", "prick", "godly", "habitual", "argument", "sleepy", "crate",
  "motionless", "kiss", "screeching", "lonely", "industrious", "grouchy", "zippy",
  "cub", "volcano", "right", "uttermost", "tail", "fragile", "tip", "chew",
  "apologise", "pull", "report", "seashore", "planes", "momentous", "excuse",
  "gorgeous", "scold", "finicky", "flagrant", "pray", "bent", "surprise",
  "surround", "bump", "incandescent", "cooing", "belligerent", "tent", "scary",
  "salt", "nutritious", "alert", "board", "approve", "creature", "support",
  "basin", "coherent", "meek", "press", "railway", "happy", "place", "aware",
  "train", "light", "deer", "unhealthy", "wind", "existence", "shape", "sail",
  "flavor", "abiding", "aunt", "proud", "torpid", "money", "punishment", "copy",
  "mine", "allow", "perform", "rose", "drip", "bolt", "holiday", "tank", "things",
  "gifted", "advice", "flap", "dare", "collect", "phone", "pie", "itch", "slim",
  "self", "ultra", "chief", "political", "possess", "next", "sordid", "possible",
  "glamorous", "jail", "outstanding", "cherry", "haircut", "elated", "oceanic",
  "replace", "disagreeable", "undesirable", "wriggle", "meddle", "empty", "turkey",
  "hate", "wren", "cloudy", "steep", "key", "useful", "lie", "broken", "deceive",
  "zany", "temporary", "volatile", "bang", "roll", "pretend", "feeling", "rob",
  "well-to-do", "branch", "respect", "wacky", "groan", "evanescent", "friends",
  "deafening", "inquisitive", "repulsive", "expand", "raise", "hypnotic", "appear",
  "invention", "winter", "reply", "texture", "ubiquitous", "two", "anxious",
  "health", "bells", "fetch", "team", "skinny", "adhesive", "scintillating",
  "whistle", "blow", "tense", "prose", "decorate", "important", "town", "day",
  "change", "expansion", "naughty", "license", "arrive", "lying", "kettle",
  "building", "scarce", "retire",
];

let testduration = 60;     
let words = [];             // pole so slovami
let currentWordIndex = 0;   // index pisaneho slova
let currentInput = "";     
let startTime = null;      
let timeLeft = testduration;
let correctChars = 0;       
let totalChars = 0;         
let completedWordsStatus = [];
let timeInterval = null;  
const PLACEHOLDER = "\u200B"; 
let currentMode = "time";  
let wordLimit = 30;        

const typingInput = document.getElementById("typingInput");
const wordsDisplay = document.getElementById("wordsDisplay");
const timeDisplay = document.getElementById("timeDisplay");
const wpmDisplay = document.getElementById("wpmDisplay");
const accuracyDisplay = document.getElementById("accuracyDisplay");
const hint = document.getElementById("hint");
const resultsView = document.getElementById("resultsView");
const testView = document.getElementById("testView");
const container = document.getElementById("extended");
const timeBtn = document.getElementById("timeBtn");
const wordBtn = document.getElementById("wordBtn");
const settings = document.querySelector(".settings");
const colorBtn = document.getElementById("colorBtn");

function generateWords() { //generovanie slov
  words = [];
  completedWordsStatus = [];

  let pocetSlov = 200;

  if (currentMode === "words") {
    pocetSlov = wordLimit;
  }

  for (let i = 0; i < pocetSlov; i++) {
    let nahodneSlovo = wordList[Math.floor(Math.random() * wordList.length)];
    words.push(nahodneSlovo);
    completedWordsStatus.push(null);
  }

  renderWords();
}

function renderWords() {
  wordsDisplay.innerHTML = "";

  let start = currentWordIndex;
  let end = start + 40;

  if (end > words.length) {
    end = words.length;
  }

  let displayWords = words.slice(start, end);

  for (let i = 0; i < displayWords.length; i++) {
    let realIndex = start + i;
    let word = displayWords[i];
    let wordSpan = document.createElement("span");

    if (realIndex === currentWordIndex) {
      wordSpan.className = "word active";
      renderCurrentWord(wordSpan, word);

    } else if (realIndex < currentWordIndex) {
      if (completedWordsStatus[realIndex] === true) {
        wordSpan.className = "word correct-word";
      } else {
        wordSpan.className = "word incorrect-word";
      }
      wordSpan.textContent = word;

    } else {
      wordSpan.className = "word";
      wordSpan.textContent = word;
    }

    wordsDisplay.appendChild(wordSpan);
    wordsDisplay.appendChild(document.createTextNode(" "));
  }
}

function renderCurrentWord(wordSpan, word) {
  wordSpan.innerHTML = "";

  for (let i = 0; i < word.length; i++) {
    let charSpan = document.createElement("span");
    charSpan.className = "char";
    charSpan.textContent = word[i];

    if (i < currentInput.length) {
      if (currentInput[i] === word[i]) {
        charSpan.className = "char correct";
      } else {
        charSpan.className = "char incorrect";
      }
    }

    wordSpan.appendChild(charSpan);
  }

  if (currentInput.length > word.length) {
    for (let i = word.length; i < currentInput.length; i++) {
      let charSpan = document.createElement("span");
      charSpan.className = "char extra";
      charSpan.textContent = currentInput[i];
      wordSpan.appendChild(charSpan);
    }
  }
}

function updateStats() {
  let timeElapsed = (testduration - timeLeft) / 60;
  let wpm = 0;
  let accuracy = 100;

  if (timeElapsed > 0) {
    wpm = Math.round((correctChars / 5) / timeElapsed);
  }

  if (totalChars > 0) {
    accuracy = Math.round((correctChars / totalChars) * 100);
  }

  wpmDisplay.textContent = wpm;
  accuracyDisplay.textContent = accuracy + "%";
}

function startTimer() {
  if (timeInterval || currentMode === "words") return;

  timeInterval = setInterval(function() {
    timeLeft = timeLeft - 1;
    timeDisplay.textContent = timeLeft + "s";

    updateStats();

    if (timeLeft <= 0) {
      endTest();
    }
  }, 1000);
}

function updateModeLabel() {
  const modeLabel = document.getElementById("modeLabel");

  console.log("Aktuálny mód:", currentMode);

  if (currentMode === "words") {
    modeLabel.textContent = "words";
  } else {
    modeLabel.textContent = "time";
  }
}
function endTest() {
  clearInterval(timeInterval);
  typingInput.disabled = true;

  let timeElapsed = 0;
  if (currentMode === "words") {
    timeElapsed = (Date.now() - startTime) / 60000;
  } else {
    timeElapsed = (testduration - timeLeft) / 60;
  }

  let wpm = 0;
  let rawWpm = 0;
  let accuracy = 100;

  if (timeElapsed > 0) {
    wpm = Math.round((correctChars / 5) / timeElapsed);
    rawWpm = Math.round((totalChars / 5) / timeElapsed);
  }

  if (totalChars > 0) {
    accuracy = Math.round((correctChars / totalChars) * 100);
  }

  let ids = [
    "finalWpm", "resWpm", "finalAccuracy", "resAccuracy",
    "finalRawWpm", "resRaw", "finalChars", "resChars"
  ];

  let vals = [
    wpm, wpm, accuracy + "%", accuracy + "%",
    rawWpm, rawWpm, totalChars, totalChars
  ];

  for (let i = 0; i < ids.length; i++) {
    let el = document.getElementById(ids[i]);
    if (el) {
      el.textContent = vals[i];
    }
  }

  fetch("/api/test-finished", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "Authorization": `Bearer ${localStorage.getItem("token")}`
    },
    body: JSON.stringify({
      wpm: wpm,
      accuracy: accuracy,
      rawWpm: rawWpm,
      chars: totalChars
    })
  })
  .then(res => res.json())
  .then(data => {
    console.log("Test uložený do DB:", data);
  })
  .catch(err => {
    console.log("Chyba pri ukladaní testu:", err);
  });

  resultsView.classList.remove("hidden");
  testView.classList.add("hidden");
  if (settings) {
    settings.classList.add("hidden");
  }
}

function restartTest() {
  clearInterval(timeInterval);
  timeInterval = null;
  startTime = null;

  timeLeft = testduration;
  currentWordIndex = 0;
  currentInput = "";
  correctChars = 0;
  totalChars = 0;

  if (currentMode === "words") {
    timeDisplay.textContent = wordLimit + "w";
    document.getElementById("modeLabel").textContent = "words";
  } else {
    timeDisplay.textContent = timeLeft + "s";
    document.getElementById("modeLabel").textContent = "time";
  }

  wpmDisplay.textContent = 0;
  accuracyDisplay.textContent = "100%";
  hint.textContent = "Start typing...";

  resultsView.classList.add("hidden");
  testView.classList.remove("hidden");

  if (settings) {
    settings.classList.remove("hidden");
  }

  generateWords();

  typingInput.disabled = false;
  typingInput.value = PLACEHOLDER;
  typingInput.focus();
}

function setDuration(dur, e) {
  currentMode = "time";
  testduration = dur;

  updateModeLabel();

  let buttons = document.querySelectorAll(".submode-btn");
  for (let i = 0; i < buttons.length; i++) {
    buttons[i].classList.remove("active");
  }

  if (e && e.target) {
    e.target.classList.add("active");
  }

  restartTest();
}

function setWordCount(count, e) {
  currentMode = "words";
  wordLimit = count;

  updateModeLabel();

  clearInterval(timeInterval);
  timeInterval = null;

  timeDisplay.textContent = wordLimit + "w";
  document.getElementById("modeLabel").textContent = "words";

  restartTest();
}

typingInput.addEventListener("input", function(e) {
  if (!typingInput.value.startsWith(PLACEHOLDER)) {
    typingInput.value = PLACEHOLDER + typingInput.value;
  }

  let cleanValue = typingInput.value.substring(1);

  if (!startTime && cleanValue.length > 0) {
    startTime = Date.now();
    startTimer();
    hint.textContent = "";
  }

  if (cleanValue.endsWith(" ")) {
    let typedWord = cleanValue.trim();
    let targetWord = words[currentWordIndex];

    completedWordsStatus[currentWordIndex] = typedWord === targetWord;

    let correctCount = 0;
    for (let i = 0; i < Math.min(typedWord.length, targetWord.length); i++) {
      if (typedWord[i] === targetWord[i]) correctCount++;
    }

    correctChars += correctCount;
    if (typedWord === targetWord) correctChars++;
    totalChars += typedWord.length + 1;

    currentWordIndex++;

    if (currentMode === "words" && currentWordIndex === wordLimit) {
      endTest();
      return;
    }

    currentInput = "";
    typingInput.value = PLACEHOLDER;
    renderWords();
    updateStats();
    return;
  }

  currentInput = cleanValue;
  renderWords();
});

document.addEventListener("keydown", (e) => {
  if(e.key === " " && currentMode === "words"){
    let remaining = wordLimit - (currentWordIndex + 1);
    if(remaining >= 0) {
      timeDisplay.textContent = remaining + "w";
    }
  }
});

timeBtn.addEventListener("click", function() {
  currentMode = "time";
  timeBtn.classList.add("active");
  wordBtn.classList.remove("active");
  container.innerHTML = "";

  let times = [5, 30, 60];
  for (let i = 0; i < times.length; i++) {
    let t = times[i];
    let btn = document.createElement("button");
    btn.textContent = t + "s";
    btn.className = "submode-btn";
    if (t === testduration) {
      btn.classList.add("active");
    }
    btn.addEventListener("click", function(e) {
      setDuration(t, e);
    });
    container.appendChild(btn);
  }
  updateModeLabel();
});

wordBtn.addEventListener("click", function() {
  currentMode = "words";
  wordBtn.classList.add("active");
  timeBtn.classList.remove("active");
  container.innerHTML = "";

  let wordCounts = [30, 50, 100];
  for (let i = 0; i < wordCounts.length; i++) {
    let w = wordCounts[i];
    let btn = document.createElement("button");
    btn.textContent = w + "w";
    btn.className = "submode-btn";

    btn.addEventListener("click", function(e) {
      let buttons = document.querySelectorAll(".submode-btn");
      for (let j = 0; j < buttons.length; j++) {
        buttons[j].classList.remove("active");
      }
      e.target.classList.add("active");
      setWordCount(w, e);
    });

    container.appendChild(btn);
  }
  updateModeLabel();
});

document.getElementById("supportBtn").addEventListener("click", async (e) => {
  e.preventDefault();

  const res = await fetch("/api/support-click");
  const data = await res.json();

  console.log(data);

  alert(`Počet testov v DB: ${data.testsInDB}`);
});

// Inicializácia na začiatku
generateWords();
updateModeLabel();

// Auth hlavička
const username = localStorage.getItem("username");

if (username) {
  document.getElementById("sign-in-btn").style.display = "none";
  document.getElementById("user-menu").style.display = "flex";
  document.getElementById("profile-btn").textContent = username;
}