const STATES = {
  START: "START",
  NUMBER1: "NUMBER1",
  NUMBER2: "NUMBER2",
  OPERATOR: "OPERATOR",
  DECIMAL1: "DECIMAL1",
  DECIMAL2: "DECIMAL2",
  ALL_CLEAR: "ALL_CLEAR",
  OUTPUT: "OUTPUT",
  ERROR: "ERROR",
};

let currentInput = "";
let currentOperator = "";
let currentResult = 0;
let currentState = STATES.START;

const handleButtonClick = (value) => {
  try {
    checkInputTypeAndLength(value);
    processInput(value);
  } catch (error) {
    console.error(error);
  }
};

const checkInputTypeAndLength = (input) => {
  if (
    typeof input !== "string" ||
    input.length !== 1 ||
    /[^+\-*/0-9.=AC]/.test(input)
  ) {
    throw new Error("Invalid input");
  }
};

const isDigit = (input) => {
  return /[0-9]/.test(input);
};

const isDecimal = (input) => {
  return input === ".";
};

const isOperator = (input) => {
  return /[+\-*/]/.test(input);
};

const isEquals = (input) => {
  return input === "=";
};

const isAC = (input) => {
  return input === "A";
};

const isBackspace = (input) => {
  return input === "C";
};

const calculate = () => {
  const num = parseFloat(currentInput);
  let result = currentResult;
  if (!isNaN(num)) {
    switch (currentOperator) {
      case "+":
        result += num;
        break;
      case "-":
        result -= num;
        break;
      case "*":
        result *= num;
        break;
      case "/":
        result /= num;
        break;
      default:
        result = num;
        break;
    }
    currentResult = result;
    currentInput = "";
  }
};

const clear = () => {
  currentInput = "";
  currentOperator = "";
  currentState = STATES.START;
};

const allClear = () => {
  clear();
  currentResult = 0;
};

const processInput = (input) => {
  switch (currentState) {
    case STATES.START:
      if (isDigit(input)) {
        currentState = STATES.NUMBER1;
        currentInput += input;
      } else if (isDecimal(input)) {
        currentState = STATES.DECIMAL1;
        currentInput += input;
      } else if (isBackspace(input)) {
        currentState = STATES.START;
        // Perform backspace functionality here
        if (currentInput.length > 0) {
          currentInput = currentInput.slice(0, -1);
        }
      } else if (isAC(input)) {
        currentState = STATES.ALL_CLEAR;
        allClear();
      } else if (isOperator(input)) {
        currentState = STATES.OPERATOR;
        currentOperator = input;
      }
      break;

    case STATES.NUMBER1:
      if (isDigit(input)) {
        currentInput += input;
      } else if (isDecimal(input)) {
        currentState = STATES.DECIMAL1;
        currentInput += input;
      } else if (isOperator(input)) {
        calculate();
        currentOperator = input;
        currentState = STATES.OPERATOR;
      } else if (isEquals(input)) {
        // Handle error: Missing operator after the first number
        currentState = STATES.ERROR;
      } else if (isBackspace(input)) {
        if (currentInput.length === 1) {
          currentState = STATES.START;
          currentInput = "";
        } else if (currentInput.length >= 2) {
          if (isDecimal(currentInput[currentInput.length - 2])) {
            currentState = STATES.DECIMAL1;
          } else if (isOperator(currentInput[currentInput.length - 2])) {
            currentState = STATES.OPERATOR;
          } else {
            currentState = STATES.NUMBER1;
          }
          currentInput = currentInput.slice(0, -1);
        }
      } 
      break;

    case STATES.DECIMAL1:
      if (isDigit(input)) {
        currentState = STATES.NUMBER1;
        currentInput += input;
      } else if (isBackspace(input)) {
        if (currentInput.length === 1) {
          currentState = STATES.START;
          currentInput = "";
        } else if (currentInput.length >= 2) {
          if (isDigit(currentInput[currentInput.length - 2])) {
            currentState = STATES.NUMBER1;
          } else if (isOperator(currentInput[currentInput.length - 2])) {
            currentState = STATES.OPERATOR;
          }
          currentInput = currentInput.slice(0, -1);
        }
      } 
      break;

    case STATES.OPERATOR:
      if (isDigit(input)) {
        currentState = STATES.NUMBER2;
        currentInput += input;
      } else if (isDecimal(input)) {
        currentState = STATES.DECIMAL2;
        currentInput += input;
      } else if (isBackspace(input)) {
        currentState = STATES.START;
        currentOperator = "";
      } else if (isAC(input)) {
        currentState = STATES.ALL_CLEAR;
        allClear();
      }
      else if(isOperator(input)){
        currentInput = currentInput.slice(0, -1);
        currentInput +=input
        calculate()
      }
      break;

    case STATES.NUMBER2:
      if (isDigit(input)) {
        currentInput += input;
      } else if (isDecimal(input)) {
        currentState = STATES.DECIMAL2;
        currentInput += input;
      } else if (isOperator(input)) {
        calculate();
        currentOperator = input;
      } else if (isEquals(input)) {
        calculate();
        currentState = STATES.OUTPUT;
      } else if (isBackspace(input)) {
        if (currentInput.length > 0) {
          currentInput = currentInput.slice(0, -1);
        }
      } else if (isAC(input)) {
        currentState = STATES.ALL_CLEAR;
        allClear();
      } 
      break;

    case STATES.DECIMAL2:
      if (isDigit(input)) {
        currentState = STATES.NUMBER2;
        currentInput += input;
      } else if (isBackspace(input)) {
        if (currentInput.length === 1) {
          currentState = STATES.OPERATOR;
          currentInput = "";
        } else if (currentInput.length >= 2) {
          if (isDigit(currentInput[currentInput.length - 2])) {
            currentState = STATES.NUMBER2;
          } else if (isOperator(currentInput[currentInput.length - 2])) {
            currentState = STATES.OPERATOR;
          }
          currentInput = currentInput.slice(0, -1);
        }
      } 
      break;

    case STATES.ALL_CLEAR:
      if (isAC(input)) {
        currentState = STATES.START;
        allClear();
      } 
      break;

    case STATES.OUTPUT:
      if (isBackspace(input)) {
        currentState = STATES.START;
        clear();
      } else if (isAC(input)) {
        currentState = STATES.START;
        allClear();
      } 
      break;

    case STATES.ERROR:
      // Handle error state
      break;

    default:
      break;
  }
};

// Example usage:
// handleButtonClick("-");
// handleButtonClick("5");
// handleButtonClick("+");
// handleButtonClick("2");
// handleButtonClick("2");
// handleButtonClick("*");
// handleButtonClick("0");
// handleButtonClick("=");

// console.log(currentResult);

let testStrings = [
  "1+1=",
  "1+-12=",
  "12.-+13=",
  ".1.1+1="
]

function tokenwiseTest(inputString) {
  for (let i=0; i < inputString.length; i++) {
    handleButtonClick(inputString.charAt(i))
  }
  console.log(currentResult)
  handleButtonClick('A')
}


function runTest() {
  for (let i=0; i < testStrings.length; i++) {
    console.log(`Testing the string ${testStrings[i]}`)
    tokenwiseTest(testStrings[i])
  }
}

runTest()
