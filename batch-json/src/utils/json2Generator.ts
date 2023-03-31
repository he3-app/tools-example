export function json_generator(inputText: string) {
  const i = 0;
  let input;
  let final_output;
  try {
    input = JSON.parse(inputText);
  } catch (e) {
    final_output = e.toString();
  }
  if (Array.isArray(input)) {
    final_output = randomizeObject(createRepeatedArray(input));
  } else {
    final_output = generateJSON(input, {});
  }
  return final_output;
}

function randomizeObject(object, parse = null) {
  let randomObj = {};
  const inputkeys = Object.keys(object);
  if (Array.isArray(object)) {
    randomObj = object;
  } else if (
    inputkeys.length == 1 &&
    inputkeys[0] == 'createdRepeatedArray' &&
    object.createdRepeatedArray &&
    Array.isArray(object.createdRepeatedArray)
  ) {
    randomObj = object.createdRepeatedArray;
  } else {
    for (const e in object) {
      randomObj[e] = Array.isArray(object[e])
        ? randomValue(object[e])
        : object[e].createdRepeatedArray
        ? object[e].createdRepeatedArray
        : object[e];
    }
  }
  return parse ? randomObj : JSON.stringify(randomObj, null, 3);
}

function randomValue(set) {
  return set[Math.floor(Math.random() * set.length)];
}

function createRepeatedArray(inputArray) {
  const ArrayText = [];
  if (
    inputArray.length == 2 &&
    typeof inputArray[0] == 'string' &&
    inputArray[0].match(/repeat\[\d*\]/)
  ) {
    let repeatNum = Number.parseInt(inputArray[0].match(/repeat\[(\d*)\]/)[1]);
    while (repeatNum > 0) {
      ArrayText.push(
        typeof inputArray[1] == 'string'
          ? randomValue(getValuesArray(inputArray[1]))
          : generateJSON(inputArray[1], {}, true)
      );
      repeatNum--;
    }
    return {
      createdRepeatedArray: ArrayText,
    };
  } else if (inputArray.length == 1) {
    ArrayText.push(
      typeof inputArray[0] == 'string'
        ? randomValue(getValuesArray(inputArray[0]))
        : generateJSON(inputArray[0], {}, true)
    );
    return ArrayText;
  } else {
    return inputArray;
  }
}

function getValuesArray(command) {
  const intstrArray = command.match(/(?:int|string)\(.*?\)/);
  if (command == 'bool') {
    return Math.random() > 0.5;
  } else if (intstrArray && intstrArray[0] == command) {
    return command.match(/int\(.*?\)/) ? getIntArray(command) : getStringArray(command);
  } else if (command == 'int') {
    //No i18N
    return [0, 1, 2, 3, 4, 5, 6, 7, 8, 9];
  } else if (command == 'string') {
    //No i18N
    return [
      'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.',
      'Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur.',
      'Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.',
    ]; //No i18N
  } else {
    return command;
  }
}

function getIntArray(command) {
  let elementsArray = new Object();
  command = command.replace(/(\d+)\-(\d+)/g, (match, p1, p2) => {
    let elementsString = '';
    let lessItem =
      Number.parseInt(p1) < Number.parseInt(p2) ? Number.parseInt(p1) : Number.parseInt(p2);
    const moreItem =
      Number.parseInt(p1) < Number.parseInt(p2) ? Number.parseInt(p2) : Number.parseInt(p1);
    while (lessItem < moreItem) {
      elementsString += `${lessItem}, `;
      lessItem++;
    }
    elementsString += moreItem;
    return elementsString;
  });
  elementsArray = command.match(/\d+/g).map((e) => {
    return Number.parseInt(e);
  });
  return elementsArray;
}

function getStringArray(command) {
  let stringArray = [];
  stringArray = command.replace(/string\((.*?)\)/, '$1').match(/\w+/g);
  return stringArray;
}

function generateJSON(input, output, parse = null) {
  const indexVal = 0;
  for (const k in input) {
    if (typeof input[k] == 'object') {
      if (Array.isArray(input[k])) {
        output[k] = createRepeatedArray(input[k]);
      } else {
        output[k] = generateJSON(input[k], {}, true);
      }
    } else if (typeof input[k] == 'string') {
      output[k] = getValuesArray(input[k]);
    } else {
      output[k] = input[k];
    }
  }
  return randomizeObject(output, parse);
}
