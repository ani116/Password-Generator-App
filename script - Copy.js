const inputSlider = document.querySelector("[data-lengthSlider]");
const lengthDisplay = document.querySelector("[data-lengthNumber]");
const passwordDisplay =  document.querySelector("[data-passwordDisplay]");
const copyBtn = document.querySelector("[data-copy]");
const copyMsg = document.querySelector("[data-copyMsg]");
const uppercaseCheck = document.querySelector("#uppercase");
const lowercaseCheck = document.querySelector("#lowercase");
const numbersCheck = document.querySelector("#numbers");
const symbolCheck = document.querySelector("#symbols");
const indicator = document.querySelector("[data-indicator]");
const generateBtn = document.querySelector(".generateButton");
const allCheckBox = document.querySelectorAll("input[type=checkbox]");
const symbol = '~`!@#$%^&*()_-+={[}]|:;"<,>.?/';

let password = "";
let passwordLength = 10;
let checkCount = 0;
handleSlider();
// 

// set password length
function handleSlider(){
    inputSlider.value = passwordLength;
    lengthDisplay.innerText = passwordLength;
    const min=inputSlider.min;
    const max=inputSlider.max;
    inputSlider.style.backgroundSize = ( (passwordLength-min)*100/(max-min)  ) + "% 100%";
}

// set indicator
function setIndicator(color){
    indicator.style.backgroundColor = color;
    indicator.style.boxShadow=`0px 0px 12px 1px ${color}`;
}

function getRndInteger(min,max){
    return Math.floor(Math.random() * (max - min) ) + min;
}

function generateRandomNumber(){
    return getRndInteger(0,9);
}

function generateLowerCase(){
    return String.fromCharCode(getRndInteger(97,123));
}

function generateUpperCase(){
    return String.fromCharCode(getRndInteger(65,91));
}

function generateSymbol(){
    const randNum = getRndInteger(0, symbol.length);
    return symbol.charAt(randNum);
}

// calculate generate and display color
function calcStrength(){
    let hasUpper = false;
    let hasLower = false;
    let hasNum = false;
    let hasSym = false;

    if(uppercaseCheck.checked) hasUpper = true;

    if(lowercaseCheck.checked) hasLower = true;

    if(numbersCheck.checked)hasNum = true;

    if(symbolCheck.checked) hasSym = true;

    if(hasUpper && hasLower && (hasNum || hasSym) && passwordLength>=8){
        setIndicator("#0f0");
    }
    else if( (hasUpper || hasLower) && (hasNum || hasSym) && passwordLength>=6 ){
        setIndicator("#ff0");
    }
    else{
        setIndicator("#f00");
    }
}

// copying the content
async function copyContent(){
    try{
        await navigator.clipboard.writeText(passwordDisplay.value)  //it is Api used for copying the content
        copyMsg.innerText="Copied";
    }
    catch(e){
        copyMsg.innerHTML="Failed";
    }

    // to make copy wala msg visible
    copyMsg.classList.add("active");

    setTimeout( () => {
        copyMsg.classList.remove("active");
    }, 2000);
}

function shufflePassword(array){
    // fisher yates method
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        const temp = array[i];
        array[i] = array[j];
        array[j] = temp;
      }
    let str = "";
    array.forEach((el) => (str += el));
    return str;

}

function handlecheckboxcontent(){
    checkCount = 0;
    allCheckBox.forEach( (checkbox) => {
        if(checkbox.checked)
            checkCount++;
    } );

    // special condition
    if(passwordLength < checkCount){
        passwordLength = checkCount;
        handleSlider(); 
    }
}

allCheckBox.forEach( (checkbox) => {
    checkbox.addEventListener('change', handlecheckboxcontent);
}) 

// on sliding 
inputSlider.addEventListener('input',(e) => {
    passwordLength=e.target.value;
    handleSlider();
} )

copyBtn.addEventListener('click', () => {
    if(passwordDisplay.value){
        copyContent();
    }
})

generateBtn.addEventListener('click', () => {

    if(checkCount == 0)
        return;

    if(passwordLength < checkCount){
        passwordLength = checkCount;
        handleSlider();
    }

    // let's find new password
    console.log("starting the new journey")
    password = "";

    // let's put the stuff

    let funcarr=[];

    if(uppercaseCheck.checked)
        funcarr.push(generateUpperCase);
    

    if(lowercaseCheck.checked)
        funcarr.push(generateLowerCase);
    

    if(numbersCheck.checked)
        funcarr.push(generateRandomNumber);
    

    if(symbolCheck.checked)
        funcarr.push(generateSymbol);
    

    // compulsary addition
    for(let i=0; i<funcarr.length; i++){
        password += funcarr[i]();
    }
    console.log("COmpulsory adddition done");

    //remaining additionn
    for(let i=0; i<passwordLength-funcarr.length; i++){
        let randIndex = getRndInteger(0 , funcarr.length);
        password += funcarr[randIndex]();        
    }
    console.log("Remaining adddition done");

    // shuffle the password
    // password = shufflePassword(Array.from(password));
    // console.log("Shuffling done"); 

    //displaying the value
    passwordDisplay.value = password
    console.log("UI adddition done");

    // getting strength
    calcStrength();

});