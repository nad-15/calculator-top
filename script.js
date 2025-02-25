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
const historyContainer = document.querySelector('.history-container');


let expressionArr = [];
let resultArr;

clearButton.addEventListener(`click`, () => {
    expressionArr = [];
    expressionDisplay.textContent = '';
    resultDisplay.textContent = '0';
});

backspaceButton.addEventListener(`click`, () => {
    let lastElement = expressionArr[expressionArr.length - 1];
    if (!lastElement) return;

    let charArr = lastElement.split(''); 

    for (let i = charArr.length - 1; i >= 0; i--) {
        if (/\d|%/.test(charArr[i])) { 
            charArr.splice(i, 1); 
            break;
        }
    }

    if (charArr.some(char => /\d/.test(char))) {
        expressionArr[expressionArr.length - 1] = charArr.join('');
    } else {
        expressionArr.pop();
    }

    updateExpression();
    updateAns();
});



equals.addEventListener(`click`, ()=>{
   
    const history = document.createElement(`div`);
    history.classList.add(`history`);

    const expressionHis = document.createElement(`div`);
    expressionHis.classList.add(`expression-h`);
    expressionHis.textContent = expressionArr.join(``);
    
    const equalsHis = document.createElement(`div`);
    equalsHis.classList.add(`equals-h`);
    equalsHis.textContent = "="; // If you want to display an equals sign
    
    const answerHis = document.createElement(`div`);
    answerHis.classList.add(`answer-h`);
    answerHis.textContent = resultArr.join(``);

    history.appendChild(expressionHis);
    history.appendChild(equalsHis);
    history.appendChild(answerHis);

    historyContainer.appendChild(history);
    

});
    


function updateAns() {
    evaluateExpression();
    let result = resultArr.join(``);
    if(!expressionArr.length) return;

    if(result==='NaN'){
        resultDisplay.textContent = 'Error';
    } else if (result==='Infinity') {
        if (expressionArr.join('').includes('÷0')) {
            resultDisplay.textContent = `Error:/0`;
        } else {
            resultDisplay.textContent = `E: Number too large.`;
        }

    } else {
        resultDisplay.textContent = result;
    }
}


numbers.forEach(number => { // 0-9
    number.addEventListener('click', getNumber);
});
operators.forEach(function (operator) { // +, -, *, /
    operator.addEventListener("click", getOperator);
});
modifiers.forEach(modifier => { // negate, %, decimal, , x^y, √, pi, 1/x maybe button ANS
    modifier.addEventListener(`click`, modifyNum);
});



function getOperator(e) { //+, -, *, /
    if (!expressionArr.length) return;


    const operator = e.target.dataset.value;
    let lastElement = expressionArr[expressionArr.length - 1];

    if (isNaN(cleanNumber(lastElement))) {
        expressionArr.pop(); 
    }

    expressionArr.push(operator);
    updateExpression();
}
function getNumber(e) {
    const number = e.target.dataset.value;
    let lastElement = expressionArr[expressionArr.length - 1];

    if (String(lastElement).endsWith(')') || String(lastElement).endsWith('%') || String(lastElement).endsWith('π')) {
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
            expressionArr.push(number);
        } else {
            expressionArr[expressionArr.length - 1] += number;
        }
    } else if (number === 'π') {

        if (!isNaN(cleanNumber(lastElement))) {
            const multiply = document.getElementById('multiply');
            const event = new Event('click', { bubbles: true });
            multiply.dispatchEvent(event);
        }
        expressionArr.push(number);


    } else { // Real numbers 1-9
        if (!isNaN(lastElement) && lastElement !== `0`) {
            expressionArr[expressionArr.length - 1] += number;
        } else {
            if (lastElement === `0`) {
                expressionArr.pop();
            }
            expressionArr.push(number);
        }
    }
    updateExpression();
    updateAns();
    console.log(expressionArr);
}



function modifyNum(e) {
    const modifier = e.target.dataset.value;
    let lastElement = expressionArr[expressionArr.length - 1];

    if ((String(lastElement).endsWith(')') || String(lastElement).endsWith('%') || String(lastElement).endsWith('π')) && (modifier !== `%` && modifier !== `±` && modifier !== `√`)) {
        const multiply = document.getElementById('multiply');
        const event = new Event('click', { bubbles: true });
        multiply.dispatchEvent(event);
    }

    if (modifier === `.`) {
        // Decimal logic
        if (isNaN(lastElement) || !lastElement) {
            expressionArr.push(`0.`);
        } else if (!lastElement.includes(`.`)) {
            expressionArr[expressionArr.length - 1] += modifier;
        }
        // updateExpression();
    } else if (modifier === `±`) {
        // Negation logic
        if (!expressionArr.length) return;

        if (lastElement.includes(`%`) && lastElement.startsWith('(-')) {
            expressionArr[expressionArr.length - 1] = (cleanNumber(lastElement) * -100).toString() + `%`;
            console.log(cleanNumber(lastElement));
        }
        else if (lastElement.startsWith('(-') && lastElement.endsWith(')')) {
            expressionArr[expressionArr.length - 1] = lastElement.slice(2, -1);
        } else if (!isNaN(cleanNumber(lastElement))) {
            expressionArr[expressionArr.length - 1] = `(-${lastElement})`;
        } else {
            return;
        }
        // updateExpression();

        console.log(`entered negation`);

    } else if (modifier === `%`) {
        if (isNaN(cleanNumber(lastElement)) || lastElement.includes(`%`)) {
            return;
        }
        console.log(`percent`);
        expressionArr[expressionArr.length - 1] += modifier;
        // updateExpression();
    } else if (modifier === `√`) {
        if (!expressionArr.length) return;
        if (cleanNumber(lastElement)<0) return;

        if (lastElement.startsWith('√(') && lastElement.endsWith(')')) {
            expressionArr[expressionArr.length - 1] = lastElement.slice(2, -1);
        } else if (!isNaN(cleanNumber(lastElement))) {
            // I need to force this display/ somehting wrong with values being number
            expressionArr[expressionArr.length - 1] = "√(" + lastElement + ")";
        } else {
            return;
        }
        // updateExpression();
    } else if (modifier === `squared`) {
        if (!expressionArr.length) return;
        const pow = document.getElementById('pow');
        const event = new Event('click', { bubbles: true });
        pow.dispatchEvent(event);

        expressionArr.push('2');
        // updateExpression();
    } else if (modifier === `reciprocal`) {
        if (!expressionArr.length) return;
        const pow = document.getElementById('pow');
        const event = new Event('click', { bubbles: true });
        pow.dispatchEvent(event);

        expressionArr.push('(-1)');
        // updateExpression();
    }

    updateExpression();
    updateAns();

}

function evaluateExpression() {
    //resultDisplay here
    resultArr = [...expressionArr];

    let i=1;
    while (i < resultArr.length) {
        if (resultArr[i] === '^') {
            let num1 = cleanNumber(resultArr[i - 1]);
            let operator = resultArr[i];
            let num2 = cleanNumber(resultArr[i + 1]);

            let result = performCalculation(num1, operator, num2);

            resultArr.splice(i - 1, 3, result);
            i -= 2;
        }
        i += 2;
    }


    i = 1;
    while (i < resultArr.length) {
        if (resultArr[i] === '×' || resultArr[i] === '÷') {
            let num1 = cleanNumber(resultArr[i - 1]);
            let operator = resultArr[i];
            let num2 = cleanNumber(resultArr[i + 1]);

            let result = performCalculation(num1, operator, num2);

            resultArr.splice(i - 1, 3, result);
            i -= 2;
        }
        i += 2;
    }

    console.log(resultArr);
    console.log(resultArr.length);
    i = 1;

    while (i < resultArr.length) {
        if (resultArr[i] === '+' || resultArr[i] === '-') {
            let num1 = cleanNumber(resultArr[i - 1]);
            let operator = resultArr[i];
            let num2 = cleanNumber(resultArr[i + 1]);

            let result = performCalculation(num1, operator, num2);

            // resultArr[i - 1] = result;
            resultArr.splice(i - 1, 3, result);
            i -= 2;
        }
        i += 2;
        console.log(`This ${i}`);
        console.log(`This ${resultArr}`);
        console.log(`This ${resultArr.length}`);
        // max=resultArr.length;
    }

    resultArr[0] = cleanNumber(resultArr[0]);
    // resultArr[0] = (-(-9)/100);

}


function performCalculation(num1, operator, num2) {
    if (operator === '×') return num1 * num2;
    if (operator === '÷') return num1 / num2;
    if (operator === '+') return num1 + num2;
    if (operator === '-') return num1 - num2;
    if (operator === '^') return Math.pow(num1, num2);
}


// removes %, (, ), spaces and ,
function cleanNumber(value) {
    let extractedNum = String(value).replace(/[\s,]/g, '').replace(/[π]/g, '3.1416');

    if((extractedNum.startsWith('(')) && extractedNum.endsWith(')')) {
        return cleanNumber(extractedNum.slice(1, -1))
    }

    if (extractedNum.startsWith('(-') && extractedNum.endsWith(')')) {
        return -cleanNumber(extractedNum.slice(2, -1));
    }

    if (extractedNum.startsWith('√(') && extractedNum.endsWith(')')) {
        let insideValue = cleanNumber(extractedNum.slice(2, -1));
        return Math.sqrt(insideValue); 
    }

    if (extractedNum.endsWith('%')) {
        return cleanNumber(extractedNum.slice(0, -1)) / 100;
    }

    let number = Number(extractedNum);
    return isNaN(number) ? NaN : number;
}



function updateExpression() {
    expressionDisplay.textContent = expressionArr.join(``);
}




//BUGSSSSSSSSS
// (-√(9)%)
// 7%(auto)x click 7 then divid will result to 7%x/
//9 % click negate result is 9%x
//check last element if number or no and if number check if % or . is existing