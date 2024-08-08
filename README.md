# Tic Tac Toe Game

## Overview
This Tic Tac Toe game allows two players to join a game using a unique game ID. Once both players have joined, the first player to enter can start the game.

## Features
- Players are added and removed dynamically, If a player quits, they are removed from the game. If both players quit, the game is deleted.
- Players can only be in one game at a time. To join a new game, refresh the screen and create a new connection.
- Server ensures valid actions and provides feedback via the browser console.

## Game Entity
The game is managed by a `Game` class which:
- Stores the game board and players.
- Tracks the current turn.
- Includes functions to add/remove players, make moves, check for game end, and return the game state.

## Server-Side Validation
The server ensures all actions are valid and provides respective indications, which are displayed in the browser console.

## Game End Check
The game end check is pretty simple, efficient, and straight forward.
I check every possible win condition, diagonal, row or column with simple array positions.
If no player has won I check if all the cells are filled. If they are,
the game ended in a draw.

## Run Instructions

### Server
1. Install dependencies:
    ```sh
    npm install
    ```
2. Start the server:
    ```sh
    npm start
    ```
   or:
    ```sh
    npm run dev
    ```

### Client
1. Install dependencies:
    ```sh
    npm install
    ```
2. Start the client:
    ```sh
    npm run dev
    ```
