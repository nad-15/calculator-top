// TO DO
// store numbers and pseudo numbers e.g. 7%, (9) , sqrt9 as elements
// do not use isOperator flag anymore-use last element
//create a regex function that evaluates (-9) as a number and also 9% etc
//hide history using arrow
//splice the textCOntent into array,, find the operators then divide it

const equals = document.getElementById('equals');
const clearButton = document.getElementById('clearButton');
const backspaceButton = document.getElementById('backspaceButton');
const numbers = document.querySelectorAll('.numbers');
const operators = document.querySelectorAll(`.operators`);
const modifiers = document.querySelectorAll(`.modifiers`);
const expressionDisplay = document.querySelector('.expression-dis');
const resultDisplay = document.querySelector('.result-dis');
const historyContainer = document.querySelector('.history-container');
const toggleHis = document.querySelector(`.toggle-history`);

//removed right now
toggleHis.addEventListener(`click`, () => {
    historyContainer.classList.toggle(`toggle`);
    toggleHis.classList.toggle(`toggle`);
});

let expressionArr = [];
let resultArr;
let historyArr = [];
let historyIndex = 0;

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
        if (/\d|%|π/.test(charArr[i])) {
            charArr.splice(i, 1);
            break;
        }
    }

    if (charArr.some(char => /\d|π/.test(char))) {
        expressionArr[expressionArr.length - 1] = charArr.join('');
    } else {

        if (expressionArr[expressionArr.length - 2] === '%' && !expressionArr[expressionArr.length - 3].endsWith(`%`)) {
            // console.log(`backspace percent`);
            expressionArr.splice(-2, 1);
            expressionArr[expressionArr.length - 2] += `%`;
            // return;
        }
        expressionArr.pop();


    }


    updateExpression();
    updateAns();

    //will force for now will postion this later.. my headache is to much
    if (expressionArr.length === 0) {
        resultDisplay.textContent = '0';
    }
});



equals.addEventListener(`click`, () => {

    if (expressionArr.length === 0) return;

    historyArr[historyIndex] = [...expressionArr];

    const history = document.createElement(`div`);
    history.classList.add(`history`);
    history.dataset.historyIndex = historyIndex;
    historyIndex++;

    history.dataset.history = expressionArr;

    const expressionHis = document.createElement(`div`);
    expressionHis.classList.add(`expression-h`);
    expressionHis.textContent = expressionArr.join(``);

    const equalsHis = document.createElement(`div`);
    equalsHis.classList.add(`equals-h`);
    equalsHis.textContent = "=";

    const answerHis = document.createElement(`div`);
    answerHis.classList.add(`ans-h`);
    answerHis.textContent = resultArr.join(``);

    history.appendChild(expressionHis);
    history.appendChild(equalsHis);
    history.appendChild(answerHis);

    historyContainer.appendChild(history);
    historyContainer.scrollTop = historyContainer.scrollHeight;
    clearButton.click();
});

historyContainer.addEventListener('click', (e) => {
    const history = e.target.closest('.history');
    if (!history) return;

    const historyIndex = history.dataset.historyIndex;

    if (historyIndex !== undefined) {
        expressionArr = [...historyArr[historyIndex]];
        updateExpression();
        updateAns();
        // console.log("ARRAY NOW IS: " + expressionArr);

    }
});


function updateAns() {
    console.log("ARRAY NOW IS: " + expressionArr);

    evaluateExpression();
    let result = resultArr.join(``);



    if (result === 'NaN') {
        if (isNaN(expressionArr[expressionArr.length - 1])) {
            //write in alert div
            resultDisplay.textContent = '';
        } else {
            resultDisplay.textContent = 'E:Modulo by zero.';

            //put broken heart here IM confuse
            const allButtons = Array.from(document.querySelectorAll('.buttons'));

            dropButtonsRandomly(allButtons, () => {
                document.querySelectorAll('.heart-btn').forEach(btn => {
                    btn.disabled = false;
                });
            });

        }

    } else if (result === 'Infinity' || result === '-Infinity') {
        if (expressionArr.join('').includes('÷0')) {
            resultDisplay.textContent = `E:Division of zero.`;
            //put broken heart
            const allButtons = Array.from(document.querySelectorAll('.buttons'));

            dropButtonsRandomly(allButtons, () => {
                document.querySelectorAll('.heart-btn').forEach(btn => {
                    btn.disabled = false;
                });
            });
        } else {
            resultDisplay.textContent = `E:Number too large.`;

            // resultDisplay.scrollLeft = resultDisplay.scrollWidth;

            //put broken heart here Im getting fat!!!!
            const allButtons = Array.from(document.querySelectorAll('.buttons'));

            dropButtonsRandomly(allButtons, () => {
                document.querySelectorAll('.heart-btn').forEach(btn => {
                    btn.disabled = false;
                });
            });
        }

    } else if (result === "") {
        resultDisplay.textContent = '0';
        return;
    }

    else {
        resultDisplay.textContent = result;
        // resultDisplay.scrollLeft = resultDisplay.scrollWidth;
    }
}


function updateExpression() {
    const coloredExpression = expressionArr.map((element) => {
        if (
            element.length === 1 &&
            isNaN(element) &&
            element !== '.' &&
            element !== 'π'

        ) {
            // return `<span style="color: blue; font-weight: bold;">${element}</span>`;
            return `<span class = "operator-spacing">${element}</span>`;

        }
        return element;
    }).join('');

    expressionDisplay.innerHTML = coloredExpression;
    expressionDisplay.scrollLeft = expressionDisplay.scrollWidth;
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
    updateAns();
    // console.log(" ARRAY NOW IS:  " + expressionArr)
}
function getNumber(e) {
    const number = e.target.dataset.value;


    if (String(expressionArr[expressionArr.length - 1]).endsWith('%') && expressionArr[expressionArr.length - 1] !== `%`) {
        expressionArr[expressionArr.length - 1] = expressionArr[expressionArr.length - 1].slice(0, -1);
        expressionArr.push("%");
    }

    let lastElement = expressionArr[expressionArr.length - 1];

    if (String(lastElement).endsWith(')') || String(lastElement).endsWith('π')) {
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

            //repositioning will delete if found no bugs
            if (lastElement === `÷`) {

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
    // console.log(" ARRAY NOW IS:  " + expressionArr)
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

        //  ill let negative zero slide for now
        // if(lastElement === `0` || lastElement === `0.`) return;

        // if (lastElement.includes(`%`) && lastElement.startsWith('(-')) { //(-9%) forcing this
        //     expressionArr[expressionArr.length - 1] = (cleanNumber(lastElement) * -100).toString() + `%`;
        //     console.log(cleanNumber(lastElement));
        // }
        // else
        if (lastElement.startsWith('(-') && lastElement.endsWith(')')) {
            expressionArr[expressionArr.length - 1] = lastElement.slice(2, -1);
        } else if (!isNaN(cleanNumber(lastElement))) {
            expressionArr[expressionArr.length - 1] = `(-${lastElement})`;
        } else {
            return;
        }
        // updateExpression();

        // console.log(`entered negation`);

    } else if (modifier === `%`) {


        if (!expressionArr.length) return;

        if (isNaN(cleanNumber(lastElement)) && lastElement.length === 1) {
            expressionArr.pop();
            expressionArr.push(`%`);
            updateExpression();
            updateAns();
            return;
        }

        if (lastElement.endsWith(`%`)) {
            // console.log(`last element ends with %`);
            expressionArr.push('%');
            //fix later force now
            updateExpression();
            updateAns();
            return;
        }
        // console.log(`percent`);
        expressionArr[expressionArr.length - 1] += modifier;
        // updateExpression();
    } else if (modifier === `√`) {
        if (!expressionArr.length) return;
        //do not allow negative numbers inside square root for now/ cant handle imaginary numbers yet
        if (cleanNumber(lastElement) < 0) return;

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
    // console.log(" ARRAY NOW IS:  " + expressionArr)

}

function evaluateExpression() {
    //resultDisplay here
    resultArr = [...expressionArr];

    let i = 1;
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
        if (resultArr[i] === '×' || resultArr[i] === '÷' || resultArr[i] === `%`) {
            let num1 = cleanNumber(resultArr[i - 1]);
            let operator = resultArr[i];
            let num2 = cleanNumber(resultArr[i + 1]);

            let result = performCalculation(num1, operator, num2);

            resultArr.splice(i - 1, 3, result);
            i -= 2;
        }
        i += 2;
    }

    // console.log(resultArr);
    // console.log(resultArr.length);
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
        // console.log(`This ${i}`);
        // console.log(`This ${resultArr}`);
        // console.log(`This ${resultArr.length}`);
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
    if (operator === `%`) return num1 % num2;
}



function cleanNumber(value) {
    let extractedNum = String(value).replace(/[\s,]/g, '').replace(/[π]/g, Math.PI);
    //debugging
    // removes %, (, ), spaces and ,
    //BUGSSSSSSSSS
    // (-√(9)%)
    // 7%(auto)x click 7 then divid will result to 7%x/
    //9 % click negate result is 9%x
    //check last element if number or no and if number check if % or . is existing

    if (extractedNum.startsWith('(-') && extractedNum.endsWith(')')) {
        // console.log(`Entered negative` + extractedNum);
        return cleanNumber(extractedNum.slice(2, -1)) * -1;
    }

    if (extractedNum.startsWith('√(') && extractedNum.endsWith(')')) {
        // console.log(`Entered sqrt` + extractedNum);
        let insideValue = cleanNumber(extractedNum.slice(2, -1));
        return Math.sqrt(insideValue);
    }

    if (extractedNum.endsWith('%') && extractedNum !== `%`) {
        // console.log(`Entered percent` + extractedNum);
        return cleanNumber(extractedNum.slice(0, -1)) / 100;
    }

    let number = Number(extractedNum);
    return isNaN(number) ? NaN : number;
}

