const inputSlider = document.querySelector("[data-lenSlider]");
const lengthDisplay = document.querySelector("[data-lengthNumber]");
let passwordLength =10;

handleSlider();

function handleSlider(){
    inputSlider.value=passwordLength;
    lengthDisplay.innerText= passwordLength;
}

inputSlider.addEventListener('input',(e) => {
    passwordLength = e.target.value;
    handleSlider();
})


// slider-checkbox relation -- checked before click on Generate
const allCheckBox = document.querySelectorAll("input[type=checkbox]");
let checkCount = 0;

function handleCheckBoxChange() {
    checkCount = 0;
    // check count on checkbox
    allCheckBox.forEach( (checkbox) => {
        if(checkbox.checked)
            checkCount++;
    });
    // if slider is less than checked than slider will become equal to checked
    if(passwordLength < checkCount ) {
        passwordLength = checkCount;
        handleSlider();
    }
}
// check count on each checkbox
allCheckBox.forEach( (checkbox) => {
    checkbox.addEventListener('change', handleCheckBoxChange);
})


const uppercaseCheck = document.querySelector("#uppercase");
const lowercaseCheck = document.querySelector("#lowercase");
const numbersCheck = document.querySelector("#numbers");
const symbolsCheck = document.querySelector("#symbols");
const symbols = '~`!@#$%^&*()_-+={[}]|:;"<,>.?/';

function getRndInteger(min, max) {
    return Math.floor(Math.random() * (max - min)) + min;
}
function generateUpperCase() {  
    return String.fromCharCode(getRndInteger(65,91))
}
function generateLowerCase() {  
    return String.fromCharCode(getRndInteger(97,123))
}
function generateRandomNumber() {
    return getRndInteger(0,9);
}
function generateSymbol() {
    const randNum = getRndInteger(0, symbols.length);
    return symbols.charAt(randNum);
}

const generateBtn = document.querySelector(".generateButton");
const passwordDisplay = document.querySelector("[data-passwordDisplay]");

generateBtn.addEventListener('click', () => {
    // slider 2, check 3-- slider will become 3 by handleCheckBox - again change slider 3 to 2, 
    // handle this make slider 3 again
    if(passwordLength < checkCount) {
        passwordLength = checkCount;
        handleSlider();
    }
    
    password = "";
    let funcArr = [];

    // Multiple compulsory addition
    if(uppercaseCheck.checked)
        funcArr.push(generateUpperCase);
    if(lowercaseCheck.checked)
        funcArr.push(generateLowerCase);
    if(numbersCheck.checked)
        funcArr.push(generateRandomNumber);
    if(symbolsCheck.checked)
        funcArr.push(generateSymbol);

    // Multiple checked
    for(let i=0; i<funcArr.length; i++) {
        password += funcArr[i]();
    }

    // only first letter updated
    // if(uppercaseCheck.checked) {
    //     password += generateUpperCase();
    // }
    for(let i=0; i<passwordLength-funcArr.length; i++) {
        let randIndex = getRndInteger(0 , funcArr.length);
        password += funcArr[randIndex]();
    }
    password = shufflePassword(Array.from(password));
    passwordDisplay.value = password; 
    calcStrength();
})

function shufflePassword(array) {
    //Fisher Yates Method
    for (let i = array.length - 1; i > 0; i--) {
        //random J, find out using random function
        const j = Math.floor(Math.random() * (i + 1));
        //swap number at i index and j index
        const temp = array[i];
        array[i] = array[j];
        array[j] = temp;
      }
    let str = "";
    array.forEach((el) => (str += el));
    return str;
}

const indicator = document.querySelector("[data-indicator]");

function setIndicator(color) {
    indicator.style.backgroundColor = color;
    indicator.style.boxShadow = `0px 0px 12px 1px ${color}`;
}
setIndicator("#ccc");
function calcStrength() {
    let hasUpper = false;
    let hasLower = false;
    let hasNum = false;
    let hasSym = false;
    if (uppercaseCheck.checked) hasUpper = true;
    if (lowercaseCheck.checked) hasLower = true;
    if (numbersCheck.checked) hasNum = true;
    if (symbolsCheck.checked) hasSym = true;
  
    if (hasUpper && hasLower && (hasNum || hasSym) && passwordLength >= 8) {
      setIndicator("#0f0");
    } else if (
      (hasLower || hasUpper) &&
      (hasNum || hasSym) &&
      passwordLength >= 6
    ) {
      setIndicator("#ff0");
    } else {
      setIndicator("#f00");
    }
}

const copyBtn = document.querySelector("[data-copy]");
const copyMsg = document.querySelector("[data-copyMsg]");
async function copyContent() {
    try {
        await navigator.clipboard.writeText(passwordDisplay.value);
        copyMsg.innerText = "copied";
    }
    catch(e) {
        copyMsg.innerText = "Failed";
    }
    //to make copy span visible
    copyMsg.classList.add("active");

    setTimeout( () => {
        copyMsg.classList.remove("active");
    },2000);
}
copyBtn.addEventListener('click', () => {
    if(passwordDisplay.value)
        copyContent();
})