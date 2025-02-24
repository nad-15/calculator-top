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
const equals = document.getElementById('equals');




// TO DO
// store numbers and pseudo numbers e.g. 7%, (9) as elements
// do not use isOperator anymore-use last element
//create a regex function that evaluates (-9) as a number and also 9%


const clearButton = document.getElementById('clearButton');
const backspaceButton = document.getElementById('backspaceButton');
const numbers = document.querySelectorAll('.numbers');
const operators = document.querySelectorAll(`.operators`);
const expressionDisplay = document.querySelector('.expression-dis');
const resultDisplay = document.querySelector('.result-dis');




let isOperator = false;
let isDecimal = false;
let isPercent = false;
let expressionArr = [];
let resultArr;

clearButton.addEventListener(`click`, () => {
    expressionArr = [];
    isOperator = false;
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


operators.forEach(operator => {
    operator.addEventListener(`click`, (e) => {
        if (!expressionArr.length) return; //empty array
        const operator = e.target.dataset.value;
        let lastElement = expressionArr[expressionArr.length - 1];

        if (isNaN(cleanNumber(lastElement))) {
            // console.log(expressionArr);
            expressionArr.pop();
        }

        expressionArr.push(operator);
        expressionDisplay.textContent = expressionArr.join(``);
        isPercent = false;
        isOperator = true;
        isDecimal = false;
    });
});


function performCalculation(num1, operator, num2) {
    if (operator === '×') return num1 * num2;
    if (operator === '÷') return num1 / num2;
    if (operator === '+') return num1 + num2;
    if (operator === '-') return num1 - num2;
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
    
            resultArr[i - 1] = result;
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

equals.addEventListener(`click`,()=> {
    evaluateExpression();
    resultDisplay.textContent = resultArr.join(``);
});


numbers.forEach(number => {
    number.addEventListener('click', getNumber);
});

function getNumber(e) {
    const number = e.target.dataset.value;
    if ((String(expressionArr[expressionArr.length - 1]).endsWith(')') || String(expressionArr[expressionArr.length - 1]).endsWith('%')) && (number !== `%` && number !== `±`)) {
        const multiply = document.getElementById('multiply');
        const event = new Event('click', { bubbles: true });
        multiply.dispatchEvent(event);
    } //
    // console.log(number);
    if (number === `0`) {
        // do zero logic here
        if (isNaN(expressionArr[expressionArr.length - 1]) || expressionArr[expressionArr.length - 1] === `0`) {
            if ((expressionArr[expressionArr.length - 1]) === `0`) {
                expressionArr.pop();
            }
            // if(String(expressionArr[expressionArr.length - 1]).endsWith(')') || String(expressionArr[expressionArr.length - 1]).endsWith('%')){
            //     const multiply = document.getElementById('multiply');
            //     const event = new Event('click', { bubbles: true });
            //     multiply.dispatchEvent(event);
            // }
            expressionArr.push(number.toString());
        } else {
            expressionArr[expressionArr.length - 1] += number.toString();
        }
        expressionDisplay.textContent = expressionArr.join(``);

    } else if (number === `.`) {

        // if(String(expressionArr[expressionArr.length - 1]).endsWith(')') || String(expressionArr[expressionArr.length - 1]).endsWith('%')){
        //     const multiply = document.getElementById('multiply');
        //     const event = new Event('click', { bubbles: true });
        //     multiply.dispatchEvent(event);

        // }
        //decimal logic here   
        if (!isDecimal) {
            if (isNaN(expressionArr[expressionArr.length - 1]) || !expressionArr) {
                expressionArr.push(`0.`);
            } else {
                expressionArr[expressionArr.length - 1] += number.toString();
            }
        }
        expressionDisplay.textContent = expressionArr.join(``);
        isDecimal = true;

    } else if (number === `±`) { // except operator here
        // if(String(expressionArr[expressionArr.length - 1]).endsWith(')') || String(expressionArr[expressionArr.length - 1]).endsWith('%')){
        //     const multiply = document.getElementById('multiply');
        //     const event = new Event('click', { bubbles: true });
        //     multiply.dispatchEvent(event);
        // }

        if (!expressionArr.length > 0) return;

        let lastElement = expressionArr[expressionArr.length - 1];

        if (lastElement.startsWith('(-') && lastElement.endsWith(')')) {
            expressionArr[expressionArr.length - 1] = lastElement.slice(2, -1);
        } else if (!isNaN(cleanNumber(lastElement))) {
            expressionArr[expressionArr.length - 1] = `(-${lastElement})`;
        } else {
            return;
        }
        expressionDisplay.textContent = expressionArr.join(``);
        console.log(`entered negation`);

    } else if (number === `%`) {
        // if(String(expressionArr[expressionArr.length - 1]).endsWith(')')){
        //     const multiply = document.getElementById('multiply');
        //     const event = new Event('click', { bubbles: true });
        //     multiply.dispatchEvent(event);
        //     // isOperator = true; //(-2)x0x-41
        //     // return;

        // }
        if (isPercent || isNaN(cleanNumber(expressionArr[expressionArr.length - 1]))) {
            return;
        }
        console.log(`percent`);
        isPercent = true;
        expressionArr[expressionArr.length - 1] += number.toString();
        expressionDisplay.textContent = expressionArr.join(``);
    } else { //is `real` number 0-9


        if (!isNaN(expressionArr[expressionArr.length - 1]) && (expressionArr[expressionArr.length - 1]) !== `0`) {
            expressionArr[expressionArr.length - 1] += number.toString();
        } else {
            if ((expressionArr[expressionArr.length - 1]) === `0`) {
                expressionArr.pop();
            }

            // if (String(expressionArr[expressionArr.length - 1]).endsWith('%') || (expressionArr.length > 0 &&  String(expressionArr[expressionArr.length - 1]).endsWith(')'))) {
            //     // expressionArr.push('x'); // if 0 is next not working (-6)0. also if force multiply operator gets 65%x+ 9%6
            //     const multiply = document.getElementById('multiply');
            //     const event = new Event('click', { bubbles: true });
            //     multiply.dispatchEvent(event); 
            // }
            expressionArr.push(number.toString());
            // expressionDisplay.textContent = expressionArr.join(``);
            // return;
        }
        expressionDisplay.textContent = expressionArr.join(``);
        console.log(expressionArr);
    }

    isOperator = false;
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


//add square root and 1/x xsquared