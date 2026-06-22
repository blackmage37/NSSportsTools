/**
 * standardises creation of keys by concatenating two values
 */
function getMatchKey(a, b) {
  return [String(a).trim(), String(b).trim()].sort().join('-');
}

/**
 * Simulates a coin flip by generating a random number
 *
 * @return A string of either 'Heads' or 'Tails'
 * @customfunction
 */
function coinFlip() {
  return Math.random() < 0.5 ? 'Heads' : 'Tails';
}

/**
 * Randomly selects one element from the passed array and returns it
 *
 * @param {Array<*>} arrayOfItems An array of items of any data type
 * @return One randomly selected element from the passed array
 * @customfunction
 */
function getRandomElement(arrayOfItems) {
  return arrayOfItems[Math.floor(Math.random() * arrayOfItems.length)];
}

/**
 * Shuffles an array using the Fisher-Yates shuffle algorithm
 *
 * @param {Array<Array<string|number>>} array The array to be shuffled
 * @return The original array, with the order of its elements shuffled
 * @customfunction
 */
function shuffleArray(array) {
  let currentIndex = array.length, randomIndex;

  // While there remain elements to shuffle.
  while (currentIndex !== 0) {
    // Pick a remaining element.
    randomIndex = Math.floor(Math.random() * currentIndex);
    currentIndex--;

    // And swap it with the current element.
    [array[currentIndex], array[randomIndex]] = [array[randomIndex], array[currentIndex]];
  }
}

/**
 * Shuffles an array using the Fisher-Yates shuffle algorithm
 *
 * @param {Array<Array<string|number>>} array The array to be shuffled
 * @return A new array, with the order of elements from the original one, but shuffled
 * @customfunction
 */
function shuffleArrayCopy(array) {
  let currentIndex = array.length, randomIndex;

  // While there remain elements to shuffle.
  while (currentIndex !== 0) {
    // Pick a remaining element.
    randomIndex = Math.floor(Math.random() * currentIndex);
    currentIndex--;

    // And swap it with the current element.
    [array[currentIndex], array[randomIndex]] = [array[randomIndex], array[currentIndex]];
  }

  return array;
  
}

/**
 * Flips home/away in a given matchup of Team A v Team B
 *
 * @param {string} match The matchup to be flipped, in the format XXX v YYY (required)
 * @return The original matchup with the order of participants flipped
 * @customfunction
 */
function flip(match) {
  let components = match.split(" v ");
  return components[1] + " v " + components[0];
}

/**
 * Generates a psuedorandom number within a given range
 *
 * @param {number} min The minimum value to be generated
 * @param {number} max The maximum value to be generated
 * @param {boolean} allowNonIntegers Allow non integer results. Defaults to false.
 * @return The original matchup with the order of participants flipped
 * @customfunction
 */
function randBetween(min, max, allowNonIntegers) {
    if (allowNonIntegers === undefined) {
      return Math.floor(Math.random() * (max - min + 1)) + min;
    } else {
      return Math.random() * (max - min + 1) + min;
    }
}

/**
 * Calculates the Greatest Common Divisor (GCD) of two numbers.
 * @param {number} a The first number.
 * @param {number} b The second number.
 * @return {number} The GCD of a and b.
 */
function gcd(a, b) {
  while (b) {
    [a, b] = [b, a % b];
  }
  return a;
}

/**
 * Extracts a single column from a 2D array.
 * @param {Array<Array<any>>} range The 2D array representing a range of cells.
 * @param {number} colIndex The zero-based index of the column to extract.
 * @return {Array<any>} A new array containing all values from the specified column.
 * @customfunction
 */
function extractColumn(range, colIndex) {
  if (!range || range.length === 0) {
    throw new Error("Input range is empty or invalid.");
  }
  
  const columnData = [];
  
  for (let i = 0; i < range.length; i++) {
    // add the value from the specified column to the new array
    if (range[i].length > colIndex) {
      columnData.push(range[i][colIndex]);
    } else {
      // handle cases where a row might not have the specified column
      columnData.push(null);
    }
  }
  
  return columnData;
}

/**
 * Calculates the steepness (k) and midpoint (x0) for a sigmoid function using two data points.
 *
 * @param {number} x1 The number of incidents for your first known probability.
 * @param {number} p1 The first probability (between 0 and 1).
 * @param {number} x2 The number of incidents for your second known probability.
 * @param {number} p2 The second probability (between 0 and 1).
 * @return {object} An object containing the calculated k and x0 values.
 * @customfunction
 */
function calculateSigmoidParameters(x1, p1, x2, p2) {
  if (p1 <= 0 || p1 >= 1 || p2 <= 0 || p2 >= 1) {
    throw new Error("Probabilities must be between 0 and 1 (exclusive).");
  }
  if (x1 === x2) {
    throw new Error("The number of incidents for the two points must be different.");
  }

  // intermediate values for easier calculation
  const v1 = Math.log((1 / p1) - 1);
  const v2 = Math.log((1 / p2) - 1);

  // solve for k (steepness)
  const k = (v1 - v2) / (x2 - x1);

  // solve for x0 (the midpoint)
  const x0 = x1 + (v1 / k);
  
  return { k: k, midpoint: x0 };
}

/**
 * Calculates the factorial of a given number, including non-integers.
 * Uses the Gamma function via Lanczos approximation.
 *
 * @param {number} n A number to calculate the factorial of, i.e. (n * (n-1) * (n-2) ... etc). 
 * @return {number} The factorial of n
 * @customfunction
 */
function factorial(n) {
  // factorial(n) is gamma(n + 1)
  return gamma(n + 1);
}

/**
 * Implements the Gamma function via Lanczos approximation.
 *
 * @param {number} z The number to calculate gamma function of
 * @return {number} Approximate gamma of z. Accurate to 14 decimal places or so.
 * @customfunction
 */
function gamma(z) {
  // Lanczos approximation coefficients for g=7, n=9
  const p = [
    0.99999999999980993, 676.5203681218851, -1259.1392167224028,
    771.32342877765313, -176.61502916214059, 12.507343278686905,
    -0.13857109526572012, 9.9843695780195716e-6, 1.5056327351493116e-7
  ];
  const g = 7;

  // calculation is unstable at lower numbers or negatives
  // but we know this is a sine wave, so we can apply reflection formula
  // calculates against the positive reflection, then corrects back to negative using sin(pi * x)
  if (z < 0.5) {
    return Math.PI / (Math.sin(Math.PI * z) * gamma(1 - z));
  }

  z -= 1;
  let x = p[0];
  for (let i = 1; i < p.length; i++) {
    x += p[i] / (z + i);
  }

  const t = z + g + 0.5;
  return Math.sqrt(2 * Math.PI) * Math.pow(t, z + 0.5) * Math.exp(-t) * x;
}

/**
 * Counts the number of fields in an object
 *
 * @param {object} obj An object
 * @return {number} The number of fields in the object
 * @customfunction
 */
// count the number of fields in an object
function countAllFields(obj) {
    let count = 0;

    // iterate over the object's own properties
    for (const key in obj) {
        // only counting own properties (not inherited ones)
        if (Object.prototype.hasOwnProperty.call(obj, key)) {
            count++;
            // if the value is an object (and not null or an array) call the function again to get sub-fields
            if (typeof obj[key] === 'object' && obj[key] !== null && !Array.isArray(obj[key])) {
                // add the result to the total count
                count += countAllFields(obj[key]);
            }
        }
    }
    return count;
}