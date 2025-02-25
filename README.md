# Race 3D: WebSocket-Connected Racing Game & Controller 🏎️

A 3D racing game with a dedicated mobile controller app, connected via WebSockets for real-time play.

https://github.com/user-attachments/assets/be750f72-3c32-43d8-b7d4-05d1c50889da

## What's In The Box

### Racing Game (Web)
- Complete 3D racing experience built with Three.js and JavaScript
- Racing track with environment elements, motion blur effects, and realistic physics
- Modular codebase with clean separation of concerns
- Real-time communication with the controller app

### Mobile Controller App
- React Native joystick app for iOS and Android
- Haptic feedback for an immersive experience
- Multi-directional controls with custom behavior for acceleration/braking
- Real-time WebSocket communication with the game

### WebSocket Server
- Connects the game and mobile controller
- Handles real-time communication between devices
- Lightweight and easy to deploy

## Getting Started

### Prerequisites
- Node.js 16+
- Yarn (preferred) or npm
- Expo CLI (for mobile app)

### Running the Game
```bash
# In the game directory
yarn install
yarn start
```

## Project Structure
### The project is organized into three main components:

- `/racer-web`: The game and WebSocket server
- `/racer-app`: The mobile controller application

### Links

- **Game & Server:** https://github.com/FilipiRafael/racer-web
- **Mobile Controller:** https://github.com/FilipiRafael/racer-app
