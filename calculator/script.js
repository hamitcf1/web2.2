class Calculator {
    constructor() {
        this.currentOperand = '0';
        this.previousOperand = '';
        this.operation = undefined;
        this.shouldResetScreen = false;
        
        this.init();
    }

    init() {
        this.currentOperandDisplay = document.getElementById('current-operand');
        this.previousOperandDisplay = document.getElementById('previous-operand');
        
        // Add event listeners for keyboard input
        document.addEventListener('keydown', (e) => {
            if (e.key >= '0' && e.key <= '9' || e.key === '.') {
                this.appendNumber(e.key);
                this.animateKey(`[data-number="${e.key}"]`);
            }
            if (e.key === '+' || e.key === '-' || e.key === '*' || e.key === '/') {
                const operatorMap = { '/': '÷', '*': '×' };
                const operator = operatorMap[e.key] || e.key;
                this.setOperation(operator);
                this.animateKey(`[data-operator="${operator}"]`);
            }
            if (e.key === 'Enter' || e.key === '=') {
                this.calculate();
                this.animateKey('[data-operator="="]');
            }
            if (e.key === 'Escape') {
                this.clear();
                this.animateKey('[data-action="clear"]');
            }
            if (e.key === 'Backspace') {
                this.delete();
            }
        });

        // Add event listeners for button clicks
        document.querySelectorAll('.key').forEach(key => {
            key.addEventListener('click', () => {
                if (key.dataset.number !== undefined) {
                    this.appendNumber(key.dataset.number);
                } else if (key.dataset.operator !== undefined) {
                    if (key.dataset.operator === '=') {
                        this.calculate();
                    } else {
                        this.setOperation(key.dataset.operator);
                    }
                } else if (key.dataset.action !== undefined) {
                    switch (key.dataset.action) {
                        case 'clear':
                            this.clear();
                            break;
                        case 'toggle-sign':
                            this.toggleSign();
                            break;
                        case 'percentage':
                            this.percentage();
                            break;
                    }
                }

                // Add haptic feedback
                if (window.navigator.vibrate) {
                    window.navigator.vibrate(50);
                }
            });
        });
    }

    appendNumber(number) {
        if (this.shouldResetScreen) {
            this.currentOperand = '';
            this.shouldResetScreen = false;
        }
        
        if (number === '.' && this.currentOperand.includes('.')) return;
        if (this.currentOperand === '0' && number !== '.') {
            this.currentOperand = number;
        } else {
            this.currentOperand += number;
        }
        this.updateDisplay();
    }

    setOperation(operator) {
        if (this.operation !== undefined) {
            this.calculate();
        }
        this.operation = operator;
        this.previousOperand = this.currentOperand;
        this.shouldResetScreen = true;
        this.updateDisplay();
    }

    calculate() {
        let computation;
        const prev = parseFloat(this.previousOperand);
        const current = parseFloat(this.currentOperand);
        
        if (isNaN(prev) || isNaN(current)) return;
        
        switch (this.operation) {
            case '+':
                computation = prev + current;
                break;
            case '-':
                computation = prev - current;
                break;
            case '×':
                computation = prev * current;
                break;
            case '÷':
                if (current === 0) {
                    this.currentOperand = 'Error';
                    this.operation = undefined;
                    this.previousOperand = '';
                    this.updateDisplay();
                    return;
                }
                computation = prev / current;
                break;
            default:
                return;
        }
        
        this.currentOperand = computation.toString();
        this.operation = undefined;
        this.previousOperand = '';
        this.updateDisplay();
    }

    clear() {
        this.currentOperand = '0';
        this.previousOperand = '';
        this.operation = undefined;
        this.updateDisplay();
    }

    delete() {
        if (this.currentOperand.length === 1) {
            this.currentOperand = '0';
        } else {
            this.currentOperand = this.currentOperand.slice(0, -1);
        }
        this.updateDisplay();
    }

    toggleSign() {
        this.currentOperand = (parseFloat(this.currentOperand) * -1).toString();
        this.updateDisplay();
    }

    percentage() {
        this.currentOperand = (parseFloat(this.currentOperand) / 100).toString();
        this.updateDisplay();
    }

    updateDisplay() {
        this.currentOperandDisplay.textContent = this.formatNumber(this.currentOperand);
        if (this.operation) {
            this.previousOperandDisplay.textContent = 
                `${this.formatNumber(this.previousOperand)} ${this.operation}`;
        } else {
            this.previousOperandDisplay.textContent = '';
        }
    }

    formatNumber(number) {
        if (number === 'Error') return number;
        
        const stringNumber = number.toString();
        const integerDigits = parseFloat(stringNumber.split('.')[0]);
        const decimalDigits = stringNumber.split('.')[1];
        
        let integerDisplay;
        if (isNaN(integerDigits)) {
            integerDisplay = '';
        } else {
            integerDisplay = integerDigits.toLocaleString('en', {
                maximumFractionDigits: 0
            });
        }
        
        if (decimalDigits != null) {
            return `${integerDisplay}.${decimalDigits}`;
        } else {
            return integerDisplay;
        }
    }

    animateKey(selector) {
        const key = document.querySelector(selector);
        if (key) {
            key.classList.add('pressed');
            setTimeout(() => key.classList.remove('pressed'), 100);
        }
    }
}

const calculator = new Calculator(); 