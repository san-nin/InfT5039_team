1. Project Overview
The project consists of two primary components:

User Interface (UI): Built using HTML, CSS, and Bootstrap for structure and styling.
JavaScript Code: Implements the Dijkstra algorithm and handles user interactions, animations, and dynamic rendering of the grid.
2. File Breakdown
a. index.html
This file defines the webpage structure. Key elements include:

Canvas: The grid is rendered on an HTML <canvas> element.
Controls: Buttons and checkboxes allow users to interact with the grid, create walls, set start and endpoints, and trigger the algorithm.
Footer: A simple footer acknowledges the use of technologies.
Code Flow:

The <canvas> element serves as the primary visual aid for the maze grid.
Buttons and checkboxes are tied to JavaScript functions (via id attributes like findButton and resetButton) to enable interactive features.
Inline <style> defines the layout and appearance of the grid and controls.
b. index.js
This file handles the core logic of the program, including grid initialization, user interactions, and the implementation of Dijkstra's algorithm.

Key Sections:

1. Initialization
Canvas Setup: The canvas size and background color are defined. The grid is represented as a 2D array (array), where:
"-1" indicates unvisited cells.
"1" is the start point.
"2" is the end point.
"3" is a wall.
Icons and Assets: Images like the spider (bugIcon) and wall (wallIcon) are preloaded for visual representation.
2. Event Handling
Checkbox Interactions: Users can activate modes like creating walls, start points, or end points. The resetCheckBoxes() function ensures only one mode is active at a time.
Canvas Interaction:
mousedown event listens for clicks on the canvas. Depending on the active mode (start, end, or wall), the grid updates, and the respective icon is drawn.
Randomization Buttons:
randomWalls fills the grid with random wall placements.
randomStartPoint and randomEndPoint randomly set valid start and end points.
Reset Button: Resets the grid to its default state by reloading the page.
3. Dijkstra's Algorithm
The findShortestPath() function implements the algorithm:

Setup:
Initializes the dist matrix to track distances from the start point.
Initializes a prev matrix to store the previous cell for each visited cell (used for backtracking).
Uses a priority queue to process cells in the order of their distance from the start.
Traversal:
At each step, neighbors of the current cell are evaluated.
Distances are updated if a shorter path is found.
Path Found:
If the end point is reached, the prev array is used to backtrack and reconstruct the path.
The drawPathWithAnimation() function visualizes the path by iterating over the path array and rendering it on the canvas.
No Path Found:
If the queue is empty without finding the endpoint, the program alerts the user.
4. Animations
Spider-Web Animation: The showSpiderWebAnimation() function provides a visual effect when the start point is initialized.
Path Animation: The drawPathWithAnimation() function animates the traversal of the spider along the shortest path.
c. assets
Contains visual assets like the spider (spider.png), door/fly (fly.png), walls (wall.png), and street (spider-web-icon-png.webp). These enhance the UI by visually representing the grid elements.
3. Program Flow
Page Load:
The HTML structure is rendered, and the JavaScript file initializes the canvas and grid.
Users are prompted to set the start and end points and create walls.
User Interaction:
Users interact via buttons and checkboxes to configure the maze.
Valid inputs (start and end points) are required before running the algorithm.
Pathfinding:
Once configured, the user clicks the "Find Path" button, triggering the Dijkstra algorithm.
The grid updates dynamically, with the shortest path visualized on the canvas.
Output:
If a valid path exists, it is displayed.
If no path exists, an alert informs the user.
4. Key Features
Interactive Grid: Users can customize the maze layout by placing walls, start points, and end points.
Dynamic Visualization: Pathfinding is animated step-by-step for better comprehension.
Error Handling: Alerts guide users in case of incomplete or invalid inputs.
Responsive Design: The project uses Bootstrap for responsive controls.
5. Integration
The project integrates algorithmic functionality with a visually appealing interface, balancing complexity with usability. Durgesh focused on implementing the algorithm and ensuring efficient execution, while Swarn handled the UI/UX, creating animations and making the application engaging for users.

