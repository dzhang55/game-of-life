Game of Life
=========

Game of Life is a Node.js multiplayer implementation of Conway's Game of Life automaton. Using Socket.io, Game of Life allows users to create/join game rooms, in which one player has the ability to click on cells in the board in real time to bring them to life. The other player can click on cells to kill them, with the goal of killing the entire board. 

![](/static/images/site.png)

##How it works

The Game object contains all of the logic for Conway's Game of Life, along with functions for changing cells while the game is running and pausing the game. It utilizes two 2D arrays in order to have one board of the current state and one board to freely modify with clicks and for the next tick of the simulation. 

##Status

Features
- Start/Pause
- Life vs. Death mechanic
- All game logic working

Features to add:
- Fix up interface (room selection is messy)
- Limit number of players in a room
- Add some fun new mechanics?
