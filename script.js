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
// const equals = document.getElementById('equals');

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


clearButton.addEventListener(`click`, () => {
    expressionArr = [];
    isOperator = false;
    isDecimal = false;
    isPercent = false;
    expressionDisplay.textContent = '';
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
        //isNaN(expressionArr[expressionArr.length - 1])
        if (isOperator) { 
            // console.log(expressionArr);
            expressionArr.pop();
        }

        expressionArr.push(operator);
        expressionDisplay.textContent = expressionArr.join(``);
        isPercent=false;
        isOperator = true;
        isDecimal = false;
    });
});

function performOperation() {
    //resultDisplay here
}


numbers.forEach(number => {
    number.addEventListener('click', getNumber);
});

function getNumber(e) {
    const number = e.target.dataset.value;
    // console.log(number);
    if (number === `0`) {
        // do zero logic here
        if (isNaN(expressionArr[expressionArr.length - 1]) || expressionArr[expressionArr.length - 1] === `0`) {
            if ((expressionArr[expressionArr.length - 1]) === `0`) {
                expressionArr.pop();
            }
            expressionArr.push(number.toString());
        } else {
            expressionArr[expressionArr.length - 1] += number.toString();
        }
        expressionDisplay.textContent = expressionArr.join(``);

    } else if (number === `.`) {
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

        if(!expressionArr.length > 0) return;
        let lastElement = expressionArr[expressionArr.length - 1];

        // Toggle negation: If already negative, remove the parentheses
        if (lastElement.startsWith('(-') && lastElement.endsWith(')')) {
            expressionArr[expressionArr.length - 1] = lastElement.slice(2, -1);
        } else {
            expressionArr[expressionArr.length - 1] = `(-${lastElement})`;
        }
        expressionDisplay.textContent = expressionArr.join(``);
        console.log(`entered negation`);

    } else if (number === `%` ) {
        if(isPercent || isNaN(expressionArr[expressionArr.length - 1])){
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
            
            if ((expressionArr[expressionArr.length - 1]) === `%` || (expressionArr.length > 0 &&  String(expressionArr[expressionArr.length - 1]).endsWith(')'))) {
                expressionArr.push('x');
            }
            expressionArr.push(number.toString());
        }
        expressionDisplay.textContent = expressionArr.join(``);
        console.log(expressionArr);
    }

    isOperator = false;
}





