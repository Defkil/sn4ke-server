# Sn4ke
> A simple multiplayer snake game
>
> [![Live Demo](https://img.shields.io/badge/Live-Demo-success)](https://sn4ke.app)

Server is programmed to be run on passanger over plesk hosted on netcup.

## State of the project
Game Loop is not full implemented yet. Player, Maps and Rooms are implemented. Finishing is planned for 26.02.2023

## Installation

### Server Production
- Plesk Webspace with Node.js Plugin
- Clone the repository to the webspace via Git
- Initialize the Node.js plugin with the path to the repository
- Install the dependencies with `npm install`
- Start the server in the Node.js plugin

### Server Development
- Clone the repository
- Install the dependencies with `npm install`
- Start the server with `npm dev`

### Client
- Clone the repository
- Open the index.html in your browser
- Play the game
- Have fun

## Folder Structure
- `ui` -> User Interactions
  - `rest` -> REST bindings
  - `socket` -> Socket listeners
- `tools` -> Tools & npm modules
  - `dotenv` -> environment variables
  - `event-emitter` -> EventEmitter
  - `logger` -> Logger with pino
  - `server` -> express and socket.io server
- `model` -> Data models
  - `player` -> Player model with connection and game data
  - `room` -> available rooms
  - `game` -> game state
  - `game-map` -> game map
  - `game-loop` -> games which are running
- `controller` -> Controllers
  - `room` -> Room controller
  - `player` -> Player controller
  - `game` -> Game controller
  - `game-map` -> GameMap controller
  - `game-loop` -> GameLoop controller with game logic
  - `validator` -> Validator controller
  - `msg-coder` -> Message coder controller
  - `code-generator` -> random Code generator controller
