// const zero = document.getElementById('zero');
// const one = document.getElementById('one');
// const two = document.getElementById('two');
// const three = document.getElementById('three');
// const four = document.getElementById('four');
// const five = document.getElementById('five');
// const six = document.getElementById('six');
// const seven = document.getElementById('seven');
// const eight = document.getElementById('eight');
// const nine = document.getElementById('nine');

// const addButton = document.getElementById('addButton');
// const minus = document.getElementById('minus'); // Fixed ID
// const multiply = document.getElementById('multiply');
// const divideButton = document.getElementById('divideButton');
// const percentButton = document.getElementById('percentButton');


// const negateButton = document.getElementById('negateButton');
// const decimalPoint = document.getElementById('decimal-point');





// TO DO
// store numbers and pseudo numbers e.g. 7%, (9) as elements
// do not use isOperator flag anymore-use last element
//create a regex function that evaluates (-9) as a number and also 9% etc

const equals = document.getElementById('equals');
const clearButton = document.getElementById('clearButton');
const backspaceButton = document.getElementById('backspaceButton');
const numbers = document.querySelectorAll('.numbers');
const operators = document.querySelectorAll(`.operators`);
const modifiers = document.querySelectorAll(`.modifiers`);
const expressionDisplay = document.querySelector('.expression-dis');
const resultDisplay = document.querySelector('.result-dis');



// let isOperator = false;
let isDecimal = false;
let isPercent = false;
let expressionArr = [];
let resultArr;

clearButton.addEventListener(`click`, () => {
    expressionArr = [];
    // isOperator = false;
    isDecimal = false;
    isPercent = false;
    expressionDisplay.textContent = '';
    resultDisplay.textContent='';
});

backspaceButton.addEventListener(`click`, () => {
    //get last element then manipulate then insert
    expressionArr.pop();
    expressionDisplay.textContent = expressionArr.join(``);

})

equals.addEventListener(`click`,()=> {
    evaluateExpression();
    resultDisplay.textContent = resultArr.join(``);
});


numbers.forEach(number => { // 0-9
    number.addEventListener('click', getNumber);
});
operators.forEach(function(operator) { // +, -, *, /
    operator.addEventListener("click", getOperator);
});
modifiers.forEach(modifier => { // negate, %, decimal, , x^y, √, pi, 1/x maybe button ANS
    modifier.addEventListener(`click`, modifyNum);
});



function getOperator(e) {
    if (!expressionArr.length) return; // Prevent operator if display is none

    const operator = e.target.dataset.value;
    let lastElement = expressionArr[expressionArr.length - 1];

    if (isNaN(cleanNumber(lastElement))) {
        expressionArr.pop(); // Remove last operator if exists
    }

    expressionArr.push(operator);
    expressionDisplay.textContent = expressionArr.join("");
    isPercent = false;
    isDecimal = false;
}


function getNumber(e) {
    const number = e.target.dataset.value;
    let lastElement = expressionArr[expressionArr.length - 1];

    if (String(lastElement).endsWith(')') || String(lastElement).endsWith('%')) {
        const multiply = document.getElementById('multiply');
        const event = new Event('click', { bubbles: true });
        multiply.dispatchEvent(event);
    }

    if (number === `0`) {
        // Zero logic
        if (isNaN(lastElement) || lastElement === `0`) {
            if (lastElement === `0`) {
                expressionArr.pop();
            }
            expressionArr.push(number.toString());
        } else {
            expressionArr[expressionArr.length - 1] += number.toString();
        }
    } else { // Real numbers 1-9
        if (!isNaN(lastElement) && lastElement !== `0`) {
            expressionArr[expressionArr.length - 1] += number.toString();
        } else {
            if (lastElement === `0`) {
                expressionArr.pop();
            }
            expressionArr.push(number.toString());
        }
    }

    expressionDisplay.textContent = expressionArr.join(``);
    console.log(expressionArr);
}



function modifyNum(e) {
    const modifier = e.target.dataset.value;
    let lastElement = expressionArr[expressionArr.length - 1];

    if ((String(lastElement).endsWith(')') || String(lastElement).endsWith('%')) && (modifier !== `%` && modifier !== `±`)) {
        const multiply = document.getElementById('multiply');
        const event = new Event('click', { bubbles: true });
        multiply.dispatchEvent(event);
    }

    if (modifier === `.`) {
        // Decimal logic
        if (!isDecimal) {
            if (isNaN(lastElement) || !expressionArr.length) {
                expressionArr.push(`0.`);
            } else {
                expressionArr[expressionArr.length - 1] += modifier.toString();
            }
        }
        expressionDisplay.textContent = expressionArr.join(``);
        isDecimal = true;

    } else if (modifier === `±`) { // Negation logic
        if (!expressionArr.length) return;

        if (lastElement.startsWith('(-') && lastElement.endsWith(')')) {
            expressionArr[expressionArr.length - 1] = lastElement.slice(2, -1);
        } else if (!isNaN(cleanNumber(lastElement))) {
            expressionArr[expressionArr.length - 1] = `(-${lastElement})`;
        } else {
            return;
        }
        expressionDisplay.textContent = expressionArr.join(``);
        console.log(`entered negation`);

    } else if (modifier === `%`) {
        if (isPercent || isNaN(cleanNumber(lastElement))) {
            return;
        }
        console.log(`percent`);
        isPercent = true;
        expressionArr[expressionArr.length - 1] += modifier.toString();
        expressionDisplay.textContent = expressionArr.join(``);
    }
}





function evaluateExpression() {
    //resultDisplay here
    resultArr = [...expressionArr];
    let i = 1;
    while (i < resultArr.length) {
        if (resultArr[i] === '×' || resultArr[i] === '÷') {
            let num1 = cleanNumber(resultArr[i - 1]);
            let operator = resultArr[i];
            let num2 = cleanNumber(resultArr[i + 1]);
    
            let result = performCalculation(num1, operator, num2);
    
            resultArr.splice(i - 1, 3, result); 
            i-=2;
        }
        i += 2;
    }
    
    console.log(resultArr);
    console.log( resultArr.length);
    i = 1;
    
    while (i < resultArr.length) {
        if (resultArr[i] === '+' || resultArr[i] === '-') {
            let num1 = cleanNumber(resultArr[i - 1]);
            let operator = resultArr[i];
            let num2 = cleanNumber(resultArr[i + 1]);
    
            let result = performCalculation(num1, operator, num2);
    
            // resultArr[i - 1] = result;
            resultArr.splice(i - 1, 3, result); 
            i-=2;
        }
        i += 2;
        console.log(`This ${i}`);
        console.log(`This ${resultArr}`);
        console.log( `This ${resultArr.length}`);
        // max=resultArr.length;
    }
    
}


function performCalculation(num1, operator, num2) {
    if (operator === '×') return num1 * num2;
    if (operator === '÷') return num1 / num2;
    if (operator === '+') return num1 + num2;
    if (operator === '-') return num1 - num2;
}



function cleanNumber(value) {
    let extractedNum = String(value).replace(/[()%]/g, '');

    if (String(value).includes('%')) {
        extractedNum = parseFloat(extractedNum) / 100;
    }

    return parseFloat(extractedNum);
}



//EDGE CASES
// 7%(auto)x click 7 then divid will result to 7%x/
//9 % click negate result is 9%x




//check last element if number or no and if number check if % or . is existing