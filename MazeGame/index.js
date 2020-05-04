const { Engine, Render, Runner, World, Bodies } = Matter;

const width = 800;
const height = 800;
const cells = 3;

const engine = Engine.create();
const { world } = engine;
const render = Render.create({
  element: document.body,
  engine: engine,
  options: {
    wireframes: true,
    width: width,
    height: height,
  },
});
Render.run(render);
Runner.run(Runner.create(), engine);

// Creating & Adding Walls //

const walls = [
  Bodies.rectangle(width / 2, 0, width, 50, { isStatic: true }),
  Bodies.rectangle(width / 2, height, width, 50, { isStatic: true }),
  Bodies.rectangle(0, height / 2, 50, height, { isStatic: true }),
  Bodies.rectangle(width, height / 2, 50, height, { isStatic: true }),
];

World.add(world, walls);

// Generating Maze Grid, Verticals |, & Horizontals - //

const shuffle = (arr) => {
  let counter = arr.length;
  while (counter > 0) {
    const index = Math.floor(Math.random() * counter);
    counter--;

    const temp = arr[counter];
    arr[counter] = arr[index];
    arr[index] = temp;
  }
  return arr;
};

const grid = Array(cells)
  .fill(null)
  .map(() => Array(cells).fill(false));

const Verticals = Array(cells)
  .fill(null)
  .map(() => Array(cells - 1).fill(false));

const Horizontals = Array(cells - 1)
  .fill(null)
  .map(() => Array(cells).fill(false));

const startRow = Math.floor(Math.random() * cells);
const startCol = Math.floor(Math.random() * cells);

// Stepping Through Cells //

const stepThroughMaze = (row, col) => {
  // If Cell at [row, col] visited, return
  if (grid[row][col]) {
    return;
  }

  // Mark cell visited
  grid[row][col] = true;

  // Assemble randomly-ordered list of neighbors
  const neighbors = shuffle([
    [row - 1, col, "up"],
    [row, col + 1, "right"],
    [row + 1, col, "down"],
    [row, col - 1, "left"],
  ]);
  // For each neighbor....
  for (let neighbor of neighbors) {
    const [nextRow, nextCol, direction] = neighbor;
    // See if that neighbor is out of bounds
    if (nextRow < 0 || nextRow >= cells || nextCol < 0 || nextCol >= cells) {
      continue;
    }
    // If we have visited that neighbor, continue to next neighbor
    if (grid[nextRow][nextCol]) {
      continue;
    }
    // Remove a wall from either horizontals or verticals
    if (direction === "left") {
      Verticals[row][col - 1] = true;
    } else if (direction === "right") {
      Verticals[row][col] = true;
    } else if (direction === "up") {
      Horizontals[row - 1][col] = true;
    } else if (direction === "down") {
      Horizontals[row][col] = true;
    }
  }
  // Visit that next cell
};

stepThroughMaze(startRow, startCol);

console.log(grid);
