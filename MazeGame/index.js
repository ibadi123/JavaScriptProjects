const { Engine, Render, Runner, World, Bodies, Body, Events } = Matter;

const width = window.innerWidth;
const height = window.innerHeight;
const cellsHorizontal = 12;
const cellsVertical = 8;

const unitLengthX = width / cellsHorizontal;
const unitLengthY = height / cellsVertical;

const engine = Engine.create();
engine.world.gravity.y = 0;
const { world } = engine;
const render = Render.create({
  element: document.body,
  engine: engine,
  options: {
    wireframes: false,
    width: width,
    height: height,
  },
});
Render.run(render);
Runner.run(Runner.create(), engine);

// Creating & Adding Walls //

const walls = [
  Bodies.rectangle(width / 2, 0, width, 2, { isStatic: true }),
  Bodies.rectangle(width / 2, height, width, 2, { isStatic: true }),
  Bodies.rectangle(0, height / 2, 2, height, { isStatic: true }),
  Bodies.rectangle(width, height / 2, 2, height, { isStatic: true }),
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

const grid = Array(cellsVertical)
  .fill(null)
  .map(() => Array(cellsHorizontal).fill(false));

const Verticals = Array(cellsVertical)
  .fill(null)
  .map(() => Array(cellsHorizontal - 1).fill(false));

const Horizontals = Array(cellsVertical - 1)
  .fill(null)
  .map(() => Array(cellsHorizontal).fill(false));

const startRow = Math.floor(Math.random() * cellsVertical);
const startCol = Math.floor(Math.random() * cellsHorizontal);

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
    if (
      nextRow < 0 ||
      nextRow >= cellsVertical ||
      nextCol < 0 ||
      nextCol >= cellsHorizontal
    ) {
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
    stepThroughMaze(nextRow, nextCol);
  }
  // Visit that next cell
};

stepThroughMaze(startRow, startCol);

// Adding Horizontal lines to the canvas //
Horizontals.forEach((row, rowIndex) => {
  row.forEach((open, colIndex) => {
    if (open) {
      return;
    }
    const wall = Bodies.rectangle(
      colIndex * unitLengthX + unitLengthX / 2,
      rowIndex * unitLengthY + unitLengthY,
      unitLengthX,
      5,
      {
        label: "danger",
        isStatic: true,
        render: {
          fillStyle: "red",
        },
      }
    );
    World.add(world, wall);
  });
});

// Adding Vertical lines to the canvas //
Verticals.forEach((row, rowIndex) => {
  row.forEach((open, colIndex) => {
    if (open) {
      return;
    }
    const wall = Bodies.rectangle(
      colIndex * unitLengthX + unitLengthX,
      rowIndex * unitLengthY + unitLengthY / 2,
      5,
      unitLengthY,
      {
        label: "safe",
        label: "wall",
        isStatic: true,
        render: {
          fillStyle: "blue",
        },
      }
    );
    World.add(world, wall);
  });
});

// Adding the Goal //
const goal = Bodies.rectangle(
  width - unitLengthX / 2,
  height - unitLengthY / 2,
  unitLengthX * 0.7,
  unitLengthY * 0.7,
  {
    label: "goal",
    isStatic: true,
    render: {
      fillStyle: "green",
    },
  }
);
World.add(world, goal);

// Adding the Ball //
const ballRadius = Math.min(unitLengthX, unitLengthY) / 4;
const ball = Bodies.circle(unitLengthX / 2, unitLengthY / 2, ballRadius, {
  label: "ball",
});
World.add(world, ball);

// Listening Key Press //
document.addEventListener("keydown", (event) => {
  const { x, y } = ball.velocity;
  if (event.keyCode === 87) {
    Body.setVelocity(ball, { x, y: y - 2 });
  }
  if (event.keyCode === 68) {
    Body.setVelocity(ball, { x: x + 2, y });
  }
  if (event.keyCode === 83) {
    Body.setVelocity(ball, { x, y: y + 2 });
  }
  if (event.keyCode === 65) {
    Body.setVelocity(ball, { x: x - 2, y });
  }
});
const winner = document.querySelector(".winner");

// Win Condition //
Events.on(engine, "collisionStart", (event) => {
  event.pairs.forEach((collision) => {
    const labels = ["ball", "goal"];
    const wallLabels = ["ball", "danger"];

    if (
      labels.includes(collision.bodyA.label) &&
      labels.includes(collision.bodyB.label)
    ) {
      winner.classList.remove("hidden");
      let value = getComputedStyle(winner).top.slice(0, -2);
      winner.style.top = parseInt(value) + 250 + "px";
      winner.style.top = parseInt(value) - 200 + "px";
      world.gravity.y = 1;
      world.bodies.forEach((body) => {
        if (body.label === "wall") {
          Body.setStatic(body, false);
        }
      });
      setTimeout(load, 3000);
    } else if (
      wallLabels.includes(collision.bodyA.label) &&
      wallLabels.includes(collision.bodyB.label)
    ) {
      world.gravity.y = 1;
      world.bodies.forEach((bodyE) => {
        if (bodyE.label === "danger") {
          world.bodies.forEach((body) => {
            Body.setStatic(body, false);
          });
        }
      });
      setTimeout(load, 5000);
    }
  });
});

const load = function () {
  window.location.href = window.location.href;
};
