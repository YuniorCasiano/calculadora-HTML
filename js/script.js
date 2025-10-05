var currentInput = '';
var currentOperator = '';
var firstOperand = '';
var operationComplete = false;

function updateDisplay() {
    var resultElement = document.getElementById('result');
    var operationElement = document.getElementById('operation');
    
    resultElement.textContent = currentInput || '0';
    
    if (firstOperand && currentOperator) {
        operationElement.textContent = firstOperand + ' ' + currentOperator;
    } else {
        operationElement.textContent = '';
    }
}

function appendNumber(number) {
    if (operationComplete) {
        currentInput = '';
        operationComplete = false;
    }
    
    if (number === '.' && currentInput.indexOf('.') !== -1) {
        return;
    }
    
    currentInput += number;
    updateDisplay();
}

function appendOperator(operator) {
    if (currentInput === '' && firstOperand === '') {
        return;
    }
    
    if (firstOperand && currentInput && currentOperator) {
        calculate();
    }
    
    if (currentInput) {
        firstOperand = currentInput;
    }
    currentOperator = operator;
    currentInput = '';
    operationComplete = false;
    updateDisplay();
}

function calculate() {
    if (!firstOperand || !currentOperator || !currentInput) {
        return;
    }
    
    var num1 = parseFloat(firstOperand);
    var num2 = parseFloat(currentInput);
    var result;
    var operatorSymbol = currentOperator;
    
    switch (currentOperator) {
        case '+':
            result = num1 + num2;
            break;
        case '-':
            result = num1 - num2;
            break;
        case '*':
            result = num1 * num2;
            operatorSymbol = '×';
            break;
        case '/':
            if (num2 === 0) {
                alert('No se puede dividir entre cero');
                clearDisplay();
                return;
            }
            result = num1 / num2;
            operatorSymbol = '÷';
            break;
        default:
            return;
    }
    
    result = Math.round(result * 100000000) / 100000000;
    
    var operation = firstOperand + ' ' + operatorSymbol + ' ' + currentInput + ' = ' + result;
    saveToHistory(operation);
    
    currentInput = result.toString();
    firstOperand = '';
    currentOperator = '';
    operationComplete = true;
    updateDisplay();
}

function clearDisplay() {
    currentInput = '';
    currentOperator = '';
    firstOperand = '';
    operationComplete = false;
    updateDisplay();
}

function deleteLastChar() {
    if (currentInput) {
        currentInput = currentInput.slice(0, -1);
        updateDisplay();
    }
}

function saveToHistory(operation) {
    var history = getHistory();
    history.unshift(operation);
    localStorage.setItem('calculatorHistory', JSON.stringify(history));
    displayHistory();
}

function getHistory() {
    var history = localStorage.getItem('calculatorHistory');
    return history ? JSON.parse(history) : [];
}

function displayHistory() {
    var history = getHistory();
    var historyList = document.getElementById('historyList');
    
    if (history.length === 0) {
        historyList.innerHTML = '<div class="empty-history">No hay operaciones aún</div>';
        return;
    }
    
    var html = '';
    for (var i = 0; i < history.length; i++) {
        var parts = history[i].split(' = ');
        html += '<div class="history-item">';
        html += '<div class="operation-text">' + parts[0] + '</div>';
        html += '<div class="result-text">= ' + parts[1] + '</div>';
        html += '</div>';
    }
    historyList.innerHTML = html;
}

function clearHistory() {
    if (confirm('¿Estás seguro de que quieres eliminar todo el historial?')) {
        localStorage.removeItem('calculatorHistory');
        displayHistory();
    }
}

displayHistory();