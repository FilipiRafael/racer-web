# Racing Game

A 3D racing game created with Three.js. Drive around a track in a 3D environment with realistic motion physics.

## Setup & Running the Game

### Prerequisites

- [Node.js](https://nodejs.org/)
- [Yarn](https://yarnpkg.com/) (preferred package manager)

### Installation

1. Clone or download this repository
2. Navigate to the project directory in your terminal
3. Install dependencies:

```bash
yarn install
```

### Running the Game

Start the development server:

```bash
yarn start
```

This will automatically open the game in your default web browser. If it doesn't open automatically, visit [http://localhost:8080](http://localhost:8080).

## Game Controls

- **W**: Accelerate
- **S**: Brake/Reverse
- **A**: Turn left
- **D**: Turn right

## Project Structure

```
/
├── index.html         # Main HTML file
├── RacingGameEngine.js # Game logic and Three.js implementation
├── styles.css         # Basic styling
└── assets/           # Game assets
    ├── car.glb       # 3D car model
    └── envmap.jpg    # Environment map for sky
```

## Technology

- Three.js
- WebGL
- JavaScript

## License

MIT
