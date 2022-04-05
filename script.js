// Selectors

const resultContainer = document.querySelector("[data-result]");
const resultViewbox = document.querySelector("[data-result-viewbox]");
const copyInfo = document.querySelector("[data-result-info-right]");
const copiedInfo = document.querySelector("[data-result-info-left]");

const sliderRange = document.querySelector("[data-range-slider]");
const sliderValue = document.querySelector("[data-length-title]");
const slider = document.querySelector("[data-slider]");
const sliderStrength = document.querySelector("[data-strength-value]");

const generateBtn = document.querySelector("[data-btn-generate]");

const copyBtn = document.querySelector("[data-btn-copy]");

const upperElement = document.querySelector("[data-uppercase]");
const lowerElement = document.querySelector("[data-lowercase]");
const numbersElement = document.querySelector("[data-numbers]");
const symbolsElement = document.querySelector("[data-symbols]");

let generatedPassword = false;

//////////////////////////////////////////
const sliderProperties = {
  fill: "hsl(235, 70%, 63%)",
  background: "hsla(0, 0%, 100%, 0.214)",
};

////////////////////////////////
// copy btn
////////////////////////
let resultContainerBound = {
  left: resultContainer.getBoundingClientRect().left,
  top: resultContainer.getBoundingClientRect().top,
};

resultContainer.addEventListener("mousemove", (e) => {
  resultContainerBound = {
    left: resultContainer.getBoundingClientRect().left,
    top: resultContainer.getBoundingClientRect().top,
  };

  if (generatedPassword) {
    copyBtn.style.opacity = "1";
    copyBtn.style.pointerEvents = "all";
    copyBtn.style.setProperty("--x", `${e.x - resultContainerBound.left}px`);
    copyBtn.style.setProperty("--y", `${e.y - resultContainerBound.top}px`);
  } else {
    copyBtn.style.opacity = "0";
    copyBtn.style.pointerEvents = "none";
  }
});

window.addEventListener("resize", (e) => {
  resultContainerBound = {
    left: resultContainer.getBoundingClientRect().left,
    top: resultContainer.getBoundingClientRect().top,
  };
});

copyBtn.addEventListener("click", () => {
  const textArea = document.createElement("textarea");
  const password = resultViewbox.textContent;

  if (!password || password == "CLICK GENERATE") return;

  textArea.value = password;
  document.body.appendChild(textArea);
  textArea.select();
  document.execCommand("copy");
  textArea.remove();

  copyInfo.style.transform = "translateY(200%)";
  copyInfo.style.opacity = "0";
  copiedInfo.style.transform = "translateY(0%)";
  copiedInfo.style.opacity = "0.75";
});
////////////////////////////
// Events

slider.addEventListener("input", (e) => {
  sliderValue.setAttribute("data-length", e.target.value);
  applyStrength(e.target);
  applyFill(e.target);
});

applyStrength(slider);
applyFill(slider);

function applyFill(slider) {
  const percentage =
    (100 * (slider.value - slider.min)) / (slider.max - slider.min);
  slider.style.background = `linear-gradient(90deg, ${
    sliderProperties.fill
  } ${percentage}%, ${sliderProperties.background} ${percentage + 0.1}%)`;
  sliderValue.setAttribute("data-length", slider.value);
}

function applyStrength(slider) {
  if (slider.value <= 8) {
    sliderStrength.setAttribute("data-strength", "Weak");
  } else if (slider.value <= 16) {
    sliderStrength.setAttribute("data-strength", "Medium");
  } else if (slider.value >= 17) {
    sliderStrength.setAttribute("data-strength", "Strong");
  }
}

//////////////////////////////////
// password generator
const symbols = ["@", "#", "$", "%", "&"];
const numbers = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9];
const characterCodes = Array.from(Array(26)).map((_, i) => i + 97);
const lowerCaseLetters = characterCodes.map((code) =>
  String.fromCharCode(code)
);
const upperCaseLetters = lowerCaseLetters.map((letter) => letter.toUpperCase());

const passwordGenerator = (
  length,
  hasUpperCase,
  haslowerCase,
  hasNumbers,
  hasSymbols
) => {
  let availableCharacters = [
    ...(hasUpperCase ? upperCaseLetters : []),
    ...(haslowerCase ? lowerCaseLetters : []),
    ...(hasNumbers ? numbers : []),
    ...(hasSymbols ? symbols : []),
  ];

  let password = "";

  if (availableCharacters.length === 0) return "";

  for (let i = 0; i < length; i++) {
    const randomIndex = Math.floor(Math.random() * availableCharacters.length);
    password += availableCharacters[randomIndex];
  }
  return password;
};
/////////////////////////////////
generateBtn.addEventListener("click", () => {
  const length = slider.value;
  const hasUpper = upperElement.checked;
  const hasLower = lowerElement.checked;
  const hasNumbers = numbersElement.checked;
  const hasSymbols = symbolsElement.checked;
  generatedPassword = true;
  resultViewbox.textContent = passwordGenerator(
    length,
    hasUpper,
    hasLower,
    hasNumbers,
    hasSymbols
  );

  copyInfo.style.transform = "translateY(0%)";
  copyInfo.style.opacity = "0.75";
  copiedInfo.style.transform = "translateY(200%)";
  copiedInfo.style.opacity = "0";
});
///////////////////////////////////
function disableOnlyCheckbox() {
  let totalChecked = [
    upperElement,
    lowerElement,
    numbersElement,
    symbolsElement,
  ].filter((el) => el.checked);

  totalChecked.forEach((el) => {
    if (totalChecked.length == 1) {
      el.disabled = true;
    } else {
      el.disabled = false;
    }
  });
}

[upperElement, lowerElement, numbersElement, symbolsElement].forEach((el) => {
  el.addEventListener("click", () => {
    disableOnlyCheckbox();
  });
});
