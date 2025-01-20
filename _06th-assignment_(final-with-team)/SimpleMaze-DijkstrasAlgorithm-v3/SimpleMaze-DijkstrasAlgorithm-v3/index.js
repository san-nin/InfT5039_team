const BG_COLOR = "#d4f9d4";
const BG_SIZE = 600;
const squareSize = 30;
let width, height;
width = height = BG_SIZE / squareSize;

// Canvas setup
const canvas = document.getElementById("canvas");
canvas.width = canvas.height = BG_SIZE;
const ctx = canvas.getContext("2d");
ctx.fillStyle = BG_COLOR;
ctx.fillRect(0, 0, canvas.width, canvas.height);

// Load images
const bugIcon = new Image();
bugIcon.src = "./assets/spider.png";

const doorIcon = new Image();
doorIcon.src = "./assets/fly.png";

const wallIcon = new Image();
wallIcon.src = "./assets/wall.png";

const streetIcon = new Image();
streetIcon.src = "./assets/spider-web-icon-png.webp";

// Variables for grid and controls
let array = [];
let startPoint = { x: 0, y: 0 };
let endPoint = { x: 5, y: 5 };
let onlyOneStartPoint = false;
let onlyOneEndPoint = false;
let activeMode = null; // Active mode: 'start', 'end', or 'wall'

// Initialize grid
for (let i = 0; i < height; i++) {
  let smallArray = [];
  for (let j = 0; j < width; j++) {
    smallArray.push(-1); // -1 represents unvisited cells
  }
  array.push(smallArray);
}

// Utility functions
function getEventLocation(element, event) {
  const rect = element.getBoundingClientRect();
  return {
    x: Math.floor((event.clientX - rect.left) / squareSize),
    y: Math.floor((event.clientY - rect.top) / squareSize),
  };
}

function resetCheckBoxes() {
  document.getElementById("createStartPoint").checked = false;
  document.getElementById("createEndPoint").checked = false;
  document.getElementById("createWalls").checked = false;
  activeMode = null; // Reset active mode
}

// Add event listener to canvas for placing elements
canvas.addEventListener("mousedown", (e) => {
  const point = getEventLocation(canvas, e);

  if (activeMode === "start" && !onlyOneStartPoint) {
    // Place start point
    if (array[point.y][point.x] === -1) {
      startPoint = { x: point.x, y: point.y };
      array[point.y][point.x] = 1;
      onlyOneStartPoint = true;
      ctx.drawImage(
        bugIcon,
        squareSize * point.x,
        squareSize * point.y,
        squareSize,
        squareSize
      );
    }
  } else if (activeMode === "end" && !onlyOneEndPoint) {
    if (array[point.y][point.x] === -1) {
      endPoint = { x: point.x, y: point.y };
      array[point.y][point.x] = 2;
      onlyOneEndPoint = true;
      ctx.drawImage(
        doorIcon,
        squareSize * point.x,
        squareSize * point.y,
        squareSize,
        squareSize
      );
    }
  } else if (activeMode === "wall") {
    if (array[point.y][point.x] === -1) {
      array[point.y][point.x] = 3;
      ctx.drawImage(
        wallIcon,
        squareSize * point.x,
        squareSize * point.y,
        squareSize,
        squareSize
      );
    }
  }
});

document.getElementById("createStartPoint").addEventListener("change", (e) => {
  if (e.target.checked) {
    resetCheckBoxes();
    e.target.checked = true;
    activeMode = "start";
  } else {
    activeMode = null;
  }
});

document.getElementById("createEndPoint").addEventListener("change", (e) => {
  if (e.target.checked) {
    resetCheckBoxes();
    e.target.checked = true;
    activeMode = "end";
  } else {
    activeMode = null;
  }
});

document.getElementById("createWalls").addEventListener("change", (e) => {
  if (e.target.checked) {
    resetCheckBoxes();
    e.target.checked = true;
    activeMode = "wall";
  } else {
    activeMode = null;
  }
});

document.getElementById("randomWalls").onclick = () => {
  const wallCount = Math.floor((width * height) / 5);
  for (let i = 0; i < wallCount; i++) {
    let point = getRandomPosition();
    if (array[point.y][point.x] === -1) {
      array[point.y][point.x] = 3;
      ctx.drawImage(
        wallIcon,
        squareSize * point.x,
        squareSize * point.y,
        squareSize,
        squareSize
      );
    }
  }
};

function getRandomPosition() {
  return {
    x: Math.floor(Math.random() * width),
    y: Math.floor(Math.random() * height),
  };
}

document.getElementById("randomStartPoint").onclick = () => {
  if (!onlyOneStartPoint) {
    let point = getRandomPosition();
    while (array[point.y][point.x] !== -1) {
      point = getRandomPosition();
    }
    startPoint = { x: point.x, y: point.y };
    array[point.y][point.x] = 1;
    onlyOneStartPoint = true;
    ctx.drawImage(
      bugIcon,
      squareSize * point.x,
      squareSize * point.y,
      squareSize,
      squareSize
    );
  }
};

document.getElementById("randomEndPoint").onclick = () => {
  if (!onlyOneEndPoint) {
    let point = getRandomPosition();
    while (array[point.y][point.x] !== -1) {
      point = getRandomPosition();
    }
    endPoint = { x: point.x, y: point.y };
    array[point.y][point.x] = 2;
    onlyOneEndPoint = true;
    ctx.drawImage(
      doorIcon,
      squareSize * point.x,
      squareSize * point.y,
      squareSize,
      squareSize
    );
  }
};

document.getElementById("resetForm").onsubmit = (e) => {
  e.preventDefault();
  location.reload();
};

document.getElementById("findButton").onclick = findShortestPath;

// Dijkstra's Algorithm Implementation
function findShortestPath() {
  if (!onlyOneStartPoint || !onlyOneEndPoint) {
    alert("Please ensure both start and end points are set.");
    return;
  }

  let dist = Array(height)
    .fill()
    .map(() => Array(width).fill(Infinity)); // Distance matrix
  let prev = Array(height)
    .fill()
    .map(() => Array(width).fill(null)); // Previous nodes for backtracking

  dist[startPoint.y][startPoint.x] = 0; // Distance to start is 0

  const directions = [
    { x: 0, y: -1 }, // Up
    { x: 1, y: 0 }, // Right
    { x: 0, y: 1 }, // Down
    { x: -1, y: 0 }, // Left
  ];

  const priorityQueue = [{ x: startPoint.x, y: startPoint.y, cost: 0 }];

  while (priorityQueue.length > 0) {
    // Sort queue by cost (ascending) to mimic a priority queue
    priorityQueue.sort((a, b) => a.cost - b.cost);

    const current = priorityQueue.shift(); // Get node with lowest cost

    if (current.x === endPoint.x && current.y === endPoint.y) {
      // End point reached
      const path = [];
      let node = current;
      while (node) {
        path.unshift({ x: node.x, y: node.y });
        node = prev[node.y][node.x];
      }
      showSpiderWebAnimation(() => drawPathWithAnimation(path));
      return;
    }

    // Explore neighbors
    directions.forEach((dir) => {
      const newX = current.x + dir.x;
      const newY = current.y + dir.y;

      if (
        newX >= 0 &&
        newX < width &&
        newY >= 0 &&
        newY < height &&
        array[newY][newX] !== 3 // Check for walls
      ) {
        const newCost = dist[current.y][current.x] + 1; // Cost is always 1

        if (newCost < dist[newY][newX]) {
          dist[newY][newX] = newCost;
          prev[newY][newX] = current;
          priorityQueue.push({ x: newX, y: newY, cost: newCost });
        }
      }
    });
  }

  alert("No path found!");
}

function showSpiderWebAnimation(callback) {
  const centerX = startPoint.x * squareSize + squareSize / 2;
  const centerY = startPoint.y * squareSize + squareSize / 2;

  let size = 0; // Initial size
  const maxSize = squareSize * 2; // Maximum size for animation
  const duration = 800; // Total duration of animation in milliseconds
  const steps = 10; // Number of steps in the animation
  const stepDuration = duration / steps; // Duration for each step
  let growing = true; // Track if the web is growing or shrinking
  let currentStep = 0;

  function animate() {
    ctx.fillStyle = BG_COLOR;
    ctx.fillRect(
      startPoint.x * squareSize,
      startPoint.y * squareSize,
      squareSize,
      squareSize
    );

    // Draw the spider web
    ctx.drawImage(
      streetIcon,
      centerX - size / 2,
      centerY - size / 2,
      size,
      size
    );

    if (growing) {
      size += maxSize / (steps / 2); // Increase size
      if (size >= maxSize) growing = false; // Switch to shrinking
    } else {
      size -= maxSize / (steps / 2); // Decrease size
    }

    currentStep++;
    if (currentStep < steps) {
      setTimeout(animate, stepDuration);
    } else {
      ctx.fillStyle = BG_COLOR;
      ctx.fillRect(
        startPoint.x * squareSize,
        startPoint.y * squareSize,
        squareSize,
        squareSize
      );

      // Draw the spider at the start point after animation
      ctx.drawImage(
        bugIcon,
        startPoint.x * squareSize,
        startPoint.y * squareSize,
        squareSize,
        squareSize
      );

      if (callback) callback(); // Trigger the callback after animation
    }
  }

  animate();
}

function drawPathWithAnimation(path) {
  path.forEach((node, index) => {
    setTimeout(() => {
      // Draw street icon
      ctx.drawImage(
        streetIcon,
        node.x * squareSize,
        node.y * squareSize,
        squareSize,
        squareSize
      );

      // Move bug along the path
      if (index > 0) {
        const prevNode = path[index - 1];
        ctx.fillStyle = BG_COLOR; // Erase the bug's previous position
        ctx.fillRect(
          prevNode.x * squareSize,
          prevNode.y * squareSize,
          squareSize,
          squareSize
        );

        ctx.drawImage(
          streetIcon,
          prevNode.x * squareSize,
          prevNode.y * squareSize,
          squareSize,
          squareSize
        );
      }

      if (index < path.length) {
        ctx.drawImage(
          bugIcon,
          node.x * squareSize,
          node.y * squareSize,
          squareSize,
          squareSize
        );
      }
    }, 200 * index);
  });
}
