let state1 = [
  [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
  [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
  [0, 0, 0, 0, 0, 0, 0, 1, 1, 0],
  [0, 0, 0, 1, 1, 1, 0, 1, 1, 0],
  [0, 0, 0, 0, 0, 1, 0, 0, 0, 0],
  [0, 0, 0, 0, 0, 1, 0, 0, 0, 0],
  [0, 0, 1, 0, 0, 0, 0, 0, 0, 0],
  [0, 1, 1, 0, 0, 0, 0, 1, 0, 0],
  [0, 0, 1, 0, 0, 0, 1, 1, 1, 0],
  [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
]
let currentState = state1
// immutable data that will be updated (this will only run once and then currentState
// will be updated through nextState and then will be visualised, this will carry on to the next state)

const SIZE = 10

const generation = document.getElementById("generation")
const population = document.getElementById("population")
let updatedGeneration = 1
let currentPopulation = 0

const updGeneration = () => {
  generation.textContent = updatedGeneration++
}

const updPopulation = () => {
  let pop = currentState.reduce(populationSum, 0)
  population.textContent = pop
}

const populationSum = (acc, s) => {
  const newAcc = acc + s
  return acc + s.reduce((rowSum, num) => rowSum + num, 0)
}

// a new state for data, update with different arrays
// 2 dimensional arrays include columns and rows, includes 2 loops
function createNewEmptyState() {
  const result = []

  //   measures multiple numbers continuously in the array until it hits the "SIZE" of five
  //   reads horizontally and vertically, (sideways and downwards)
  for (let row = 0; row < SIZE; row++) {
    //      creates 5 row arrays for the result array
    const rowArray = []
    for (let col = 0; col < SIZE; col++) {
      //       push "0" as a number five times until it hits the "SIZE" 
      rowArray.push(0)
    }
    //     push the rowArray into the "result" to create a new empty state/array
    result.push(rowArray)
  }
  //   send value back
  return result
}

// referance col and row
function countLiveNeighbors(state, row, col) {
  //   add up numbers in the array to check if they match the rules
  //   adding up to find "neighbours" 
  let sum = 0
  // -1 is for the 1 in the cell already being counted
  for (let r = row - 1; r <= row + 1; r++) {
    for (let c = col - 1; c <= col + 1; c++) {
      if (r < 0 || r >= SIZE || c < 0 || c >= SIZE) {
        continue
      }

      if (r === row && c === col) {
        continue
      }

      const cellValue = state[r][c]
      if (cellValue === 1) {
        sum++
      }
    }
  }
  return sum
}

function generateNextState(state) {
  const nextState = createNewEmptyState()
  for (let row = 0; row < SIZE; row++) {
    for (let col = 0; col < SIZE; col++) {
      const cellValue = state[row][col]
      const numLiveNeighbors = countLiveNeighbors(state, row, col)
      // Any live cell with fewer than two live neighbours dies, as if by underpopulation.
      // Any live cell with two or three live neighbours lives on to the next generation.
      // Any live cell with more than three live neighbours dies, as if by overpopulation.
      if (cellValue === 1) {
        if (numLiveNeighbors === 2 || numLiveNeighbors === 3) {
          nextState[row][col] = 1
        }
      }

      // Any dead cell with exactly three live neighbours becomes a live cell, as if by reproduction.
      if (cellValue === 0) {
        if (numLiveNeighbors === 3) {
          nextState[row][col] = 1
        }
      }
    }
  }

  return nextState
}

const canvas = document.getElementById("gameCanvas")
canvas.id = canvas
const ctx = canvas.getContext("2d");
const CELL_SIZE = 10; // Pixel size of each cell in cavas

function drawGrid(state) {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  for (let row = 0; row < SIZE; row++) {
    for (let col = 0; col < SIZE; col++) {
      ctx.fillStyle = state[row][col] ? "black" : "white";
      ctx.fillRect(col * CELL_SIZE, row * CELL_SIZE, CELL_SIZE, CELL_SIZE);
      ctx.strokeRect(col * CELL_SIZE, row * CELL_SIZE, CELL_SIZE, CELL_SIZE);
    }
  }
}


function generateNextStateAndVisualize() {
  const newState = generateNextState(currentState)

  currentState = newState
  drawGrid(currentState)

  updGeneration()
  updPopulation()
}

// setInterval(generateNextStateAndVisualize, 100)
const runButton = document.getElementById("run")
const stopButton = document.getElementById("stop")
const repeatButton = document.getElementById("repeat")
let running = false

const checkIfRunning = () => {
  if (!running) {
    return
  } else {
    generateNextStateAndVisualize()
  }
}

runButton.addEventListener("click", () => {
  running = true
  checkIfRunning()
})

stopButton.addEventListener("click", () => {
  running = false
  checkIfRunning()
  setTimeout(generateNextStateAndVisualize, 0)
})

repeatButton.addEventListener("click", () => {
  running = true
  if (running) {
    setInterval(generateNextStateAndVisualize, 0)
  }
}) 
