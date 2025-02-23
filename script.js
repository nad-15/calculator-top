const zero = document.getElementById('zero');
const one = document.getElementById('one');
const two = document.getElementById('two');
const three = document.getElementById('three');
const four = document.getElementById('four');
const five = document.getElementById('five');
const six = document.getElementById('six');
const seven = document.getElementById('seven');
const eight = document.getElementById('eight');
const nine = document.getElementById('nine');

const addButton = document.getElementById('addButton');
const minus = document.getElementById('minus'); // Fixed ID
const multiply = document.getElementById('multiply');
const divideButton = document.getElementById('divideButton');
const percentButton = document.getElementById('percentButton');

const clearButton = document.getElementById('clearButton');
const backspaceButton = document.getElementById('backspaceButton');
const negateButton = document.getElementById('negateButton');
const decimalPoint = document.getElementById('decimal-point');
const equals = document.getElementById('equals');

const numbers = document.querySelectorAll('.numbers');

const expressionDisplay = document.querySelector('.expression-dis');
const resultDisplay = document.querySelector('.result-dis'); 


clearButton.addEventListener(`click`, ()=> {
    expressionDisplay.textContent = '0';
});

const operators = document.querySelectorAll(`.operators`);

operators.forEach(operator => {
    operator.addEventListener(`click`, performOperation);
});

function performOperation () {

}


numbers.forEach(number => {
    number.addEventListener('click', getNumber);
});

function getNumber(e) {
    const number = e.target.textContent;
    console.log(number);
    if (number !== `0`) {
        //do numbers here except 0
        // expressionDisplay.textContent+= number;
        expressionDisplay.textContent = expressionDisplay.textContent === '0' ? number : expressionDisplay.textContent + number;

    } else {
        // do zero logic here
    }
}





