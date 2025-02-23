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
let expressionArr = [];


clearButton.addEventListener(`click`, () => {
    expressionArr = [];
    isOperator = false;
    isDecimal = false;
    expressionDisplay.textContent = '0';
});

backspaceButton.addEventListener(`click`, ()=>{
    //get last element then manipulate then insert
    expressionArr.pop();
    expressionDisplay.textContent = expressionArr.join(``);

})


operators.forEach(operator => {
    operator.addEventListener(`click`, (e) => {
        const operator = e.target.textContent;
        isDecimal = false;
        if (!isOperator) {
            expressionArr.push(operator);
            expressionDisplay.textContent = expressionArr.join(``);
        } else if (isNaN(expressionArr[expressionArr.length-1])) {
            // console.log(expressionArr);
            expressionArr.pop();
            expressionArr.push(operator);
            expressionDisplay.textContent = expressionArr.join(``);
        }
        isOperator=true;
    });
});

function performOperation() {
    //resultDisplay here
}


numbers.forEach(number => {
    number.addEventListener('click', getNumber);
});

function getNumber(e) {
    const number = e.target.textContent;
    // console.log(number);
    if (number === `0`) {
        // do zero logic here
        if(isNaN(expressionArr[expressionArr.length - 1]) || expressionArr[expressionArr.length - 1] === `0`) {
            if((expressionArr[expressionArr.length - 1]) === `0`) {
                expressionArr.pop();
            }
            expressionArr.push(number.toString());
        } else {
            expressionArr[expressionArr.length - 1] += number.toString();
        }
        expressionDisplay.textContent = expressionArr.join(``);

    } else if (number === `.`){
        //decimal logic here   
        if(!isDecimal) {
            if(isNaN(expressionArr[expressionArr.length - 1]) || !expressionArr) {
                expressionArr.push(`0.`);
            } else {
                expressionArr[expressionArr.length - 1] += number.toString();
            }
        }
        expressionDisplay.textContent = expressionArr.join(``);
        isDecimal = true;

    } else{ //is `real` number
        if (!isNaN(expressionArr[expressionArr.length - 1]) && (expressionArr[expressionArr.length - 1]) !== `0`) {
            expressionArr[expressionArr.length - 1] += number.toString();
        } else {
            if((expressionArr[expressionArr.length - 1]) === `0`) {
                expressionArr.pop();
            }
            expressionArr.push(number.toString());
        }
        expressionDisplay.textContent = expressionArr.join(``);
        console.log(expressionArr);
    }

    isOperator = false;
}





