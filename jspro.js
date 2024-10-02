
const inputSlider = document.querySelector("[data-sliderLength]");
const inputPasswordLength = document.querySelector("[password-lengthNumber]");
const symbols = '~`!@#$%^&*()_-+={[}]|:;"<,>.?/';
const indicator = document.querySelector("[data-indicator]");
const upperCaseCheck = document.querySelector("#uppercase");
const lowerCaseCheck = document.querySelector("#lowercase");
const numbersCheck = document.querySelector("#numbers");
const symbolsCheck = document.querySelector("#symbols");
const copyMsg = document.querySelector("[data-copyMsg]");
const copyBtn = document.querySelector("[data-copy]");
const allCheckBox = document.querySelectorAll("input[type=checkbox]");
const gButton = document.querySelector(".generateButton");
const passwordDisplay = document.querySelector("[data-passwordDisplay]");

let password = "";
let passwordLength = 10;
let checkCount  = 0;
handleSlider();
setIndicator("#ccc");

// SETTING PASSWORD LENGTH ACCORDING TO THE INPUT SLIDER ON UI
function handleSlider() {
    inputSlider.value = passwordLength;
    inputPasswordLength.innerText = passwordLength;
}

// GENERATING RANDOM INTEGER
function getRandomInteger(min, max) {
    return Math.floor(Math.random() * (max-min)) + min;
}

// GENERATING RANDOM CHECKBOX VALUES
function generateNumbers() {
    return getRandomInteger(0, 9);
}

function generateLowerCase() {
    return String.fromCharCode(getRandomInteger(97, 122));
}

function generateUpperCase() {
    return String.fromCharCode(getRandomInteger(65, 90));
}

function generateSymbols() {
    const randNum = getRandomInteger(0, symbols.length);
    return symbols.charAt(randNum);
}

// VALUE OF PASSWORD LENGTH ACCORDING TO THE INPUT SLIDER
inputSlider.addEventListener('input', (e) => {
    passwordLength = e.target.value;
    handleSlider();
})

// COLOR INDICATOR FOR STRENGTH OF THE PASSWORD
function setIndicator(color) {
    indicator.style.backgroundColor = color;
    indicator.style.boxShadow = `0px 0px 12px 1px ${color}`;
}

// STRENGTH OF THE PASSWORD
console.log('hi 3');
function calcStrength() {
    let isUpper = false;
    let isLower = false;
    let isNum = false;
    let isSym = false;
    if(upperCaseCheck.checked)
        isUpper = true;
    if(lowerCaseCheck.checked)
        isLower = true;
    if(numbersCheck.checked)
        isNum = true;
    if(symbolsCheck.checked)
        isSym = true;

    if (isUpper && isLower && (isNum || isSym) && passwordLength >= 8) {
        setIndicator("#0f0");
    } 
    else if ((isLower || isUpper) && (isNum || isSym) && passwordLength >= 6) {
        setIndicator("#ff0");
    } 
    else {
        setIndicator("#f00");
    }
}


// COPY CONTENT OF THE GENERATED PASSWORD
async function copyContent() {
    try {
        await navigator.clipboard.writeText(passwordDisplay.value);
        copyMsg.innerText = "copied";
    }
    catch(e) {
        copyMsg.innerText = "Failed";
    }
    //TO MAKE COPY SPAN VISIBLE
    copyMsg.classList.add("active");

    setTimeout( () => {
        copyMsg.classList.remove("active");
    },2000);

}

// ALLOWANCE TO COPY IF THE PASSWORD LENGTH > 0
copyBtn.addEventListener('click', () => {
    if(passwordDisplay.value)
        copyContent();
});

// SHUFFLING OF THE PASSWORD FROM THE BEGINNING
function shufflePassword(array) {
    for(let i = array.length-1; i>0; i--){
        const j = Math.floor(Math.random() * (i+1));
        const temp = array[i];
        array[i] = array[j];
        array[j] = temp;
    }

    let str = "";
    array.forEach((element) => (str += element));
    return str;
}

// HANDLING TICK/UNTICK OF THE CHECKBOXES
function handleCheckBoxChange() {
    checkCount = 0;
    allCheckBox.forEach( (checkbox) => {
        if(checkbox.checked)
            checkCount++;
    });

    // SPECIAL CONDITION
    if(passwordLength < checkCount){
        passwordLength = checkCount;
        handleSlider();
    }
}
allCheckBox.forEach( (checkbox) => {
    checkbox.addEventListener('change', handleCheckBoxChange);
})


// WORKING OF THE GENERATE BUTTON
gButton.addEventListener('click', () => {

    if(passwordLength < checkCount){
        passwordLength = checkCount;
        handleSlider();
    }

    password = "";

    let funcArr = [];

    if(upperCaseCheck.checked)
        funcArr.push(generateUpperCase);

    if(lowerCaseCheck.checked)
        funcArr.push(generateLowerCase);

    if(numbersCheck.checked)
        funcArr.push(generateNumbers);

    if(symbolsCheck.checked)
        funcArr.push(generateSymbols);

    // COMPULSORY ADDITION
    for(let i=0; i<funcArr.length; i++){
        password += funcArr[i]();
    }


    // REMAINING ADDITION 
    for(let i=0; i<passwordLength-funcArr.length; i++){
        let randIndex = getRandomInteger(0, funcArr.length);
        password += funcArr[randIndex]();
    }
    password = shufflePassword(Array.from(password));
    passwordDisplay.value = password;
    calcStrength();

});
