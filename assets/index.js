var currentStack = '';
var overallStack = [];
var currentResult = '';
var isShiftDown = false;
var OPS = ['/', '*', '+', '-'];

document.body.addEventListener('mousedown', function() {
  document.body.classList.add('using-mouse');
});

document.body.addEventListener('keyup', function(event) {
  var keyCode = event.keyCode;

  if (keyCode === 16) {
    isShiftDown = false;
  }
});

document.body.addEventListener('keydown', function(event) {
	var keyCode = event.keyCode;
  if (keyCode === 9) {
    document.body.classList.remove('using-mouse');
  }

  if (keyCode === 16) {
    isShiftDown = true;
  }

  if ([48, 49, 50, 51, 52, 53, 54, 55, 56, 57].includes(keyCode)) {
  	numberPressed(keyCode - 48);
    var keyToHighlight = document.querySelector(`[data-value="${keyCode - 48}"]`);
    if (keyToHighlight) {
      keyToHighlight.classList.add('highlight');

      setTimeout(function() {
        keyToHighlight.classList.remove('highlight');
      }, 200);
    }
    displayResult();
  }

  if (keyCode === 67) {
    clearCurrent();
  }

  if (keyCode === 65) {
    clearAll();
  }

  if (keyCode === 187) {
    isShiftDown ? operationPressed('+') : operationPressed('=');
  }

  if (keyCode === 189) {
    isShiftDown ? operationPressed('+') : operationPressed('=');
  }
});

function operationPressed(op) {
  if (currentStack === '' && OPS.includes(overallStack[overallStack.length - 1])) {
    overallStack[overallStack.length - 1] = op;
  } else {
    overallStack.push(Number(currentStack));
    overallStack.push(op);
    currentStack = '';
  }
  setClear('clear');
}

function equalTo() {
  if (currentStack) {
    overallStack.push(Number(currentStack));
  }
  currentStack = '';
  var evalStack = overallStack.join('');
  document.getElementById('val').innerText = eval(overallStack);
  setClear('allclear');
}

function clearCurrent() {
	currentStack = '';
  setClear('allclear');
}

function clearAll() {
  overallStack = [];
  setClear('clear');
  document.getElementById('val').innerText = eval(overallStack.join('')) || 0;
}

function numberPressed(num) {
	if (num === '.' && currentStack.includes('.')) {
    return;
  }
  currentStack = currentStack + num;
  setClear('clear');
}

function displayResult() {
	document.getElementById('eval').innerText = (overallStack.map(function(item) {
    if (item === '/') {
      return '÷';
    }
    if (item === '*') {
      return '×';
    }
    return item;
  }).join(' ') + ' ' + currentStack);

  var container = document.getElementById('eval');
  if (container.scrollWidth > container.offsetWidth) {
    var textNode = container.firstChild;
    var value = '...' + textNode.nodeValue;
    do {
      value = '...' + value.substr(4);
      textNode.nodeValue = value;
    } while (container.scrollWidth > container.offsetWidth);
  }


  try {
    currentResult = eval(overallStack.join('') + currentStack);
  } catch (error) {
    return;
  }

  var MAX_LENGTH = 12;
  currentResult = currentResult || 0;
  var offset = MAX_LENGTH - (currentResult.toFixed(0) + '').length;

  currentResult = +(currentResult.toFixed(offset < 0 ? 0 : offset));

  if ((currentResult + '').length > MAX_LENGTH + 1) {
    currentResult = 'Out of bound';
  }

  document.getElementById('val').innerText = currentResult;
}


document.addEventListener('click', function(event) {
  var clickedButton = event.target.closest('.key-item');

  if (clickedButton) {
    var buttonType = clickedButton.dataset.action;

    if (buttonType === 'number') {
      numberPressed(clickedButton.dataset.value);
    }

    if (buttonType === 'action') {
      operationPressed(clickedButton.dataset.value);
    }

    if (buttonType === 'equal') {
      equalTo();
    }

    if (buttonType === 'percent') {
      return;
    }

    if (buttonType === 'clear') {
      clearCurrent();
    }

    if (buttonType === 'allclear') {
      clearAll();
    }

    displayResult();
  }
});

function setClear(prop) {
  var clearBtn = document.getElementById('clear');
  if (prop === 'allclear') {
    clearBtn.innerText = 'AC';
  } else {
    clearBtn.innerText = 'C';
  }

  clearBtn.dataset.action = prop;
}
