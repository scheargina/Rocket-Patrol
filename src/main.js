/*
Jingqi Huang
Mod title:Rocket Patrol Refactor!
The approximate time it took to complete the project：4h

Mods chose from the list above
Track a high score that persists across scenes and display it in the UI (5)
Implement the 'FIRE' UI text from the original game (5)
Add your own (copyright-free) background music to the Play scene (please be mindful of the volume) (5)
Implement the speed increase that happens after 30 seconds in the original game (5)
Create a new scrolling tile sprite for the background (5)
Allow the player to control the Rocket after it's fired (5)

Create 4 new explosion sound effects and randomize which one plays on impact (10)
Display the time remaining (in seconds) on the screen (10)
Using a texture atlas, create a new animated sprite for the Spaceship enemies (10)
Create a new title screen (e.g., new artwork, typography, layout) (10)

Create a new enemy Spaceship type (w/ new artwork) that's smaller, moves faster, and is worth more points (15)
Implement a new timing/scoring mechanism that adds time to the clock for successful hits (15)

citations for backgorund:
https://pixabay.com/ */

let config = {
    type: Phaser.AUTO,
    width: 640,
    height: 480,
    scene: [ Menu, Play ],
    bestpoint : 0
  }
let game = new Phaser.Game(config);
// set UI sizes
let borderUISize = game.config.height / 15;
let borderPadding = borderUISize / 3;
let keyF, keyR, keyLEFT, keyRIGHT;