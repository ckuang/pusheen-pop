# Pusheen Pop

A cat-themed bubble shooter game!

[Play the game here!](https://ckuang.github.io/pusheen-pop/)

## Preview
![Game Preview][welcome]

## How to Play
- Use **Left/Right Arrow Keys** to aim
- Press **Spacebar** to shoot bubbles
- Match 3+ bubbles of the same color to pop them
- Clear all bubbles to win
- Don't let bubbles reach the bottom!

## Technologies Used
- JavaScript
- HTML5 Canvas

## Technical Design Notes

### Bubble Storage & Removal
The game uses an efficient hash table data structure to store and manage bubbles, with unique IDs as keys. This enables two key removal scenarios:

1. **Color Matching**: When 3+ same-colored bubbles connect
   - Creates an array of neighboring bubbles matching the launched bubble's color
   - Removes matched bubbles if 3 or more are connected

2. **Gravity Effects**: When bubbles lose connection to the top
   - Uses a queue starting with top row bubbles
   - Processes neighbors and removes untethered bubbles
   - Remaining disconnected bubbles fall and are removed

### Future Enhancements
- [ ] Visual indicator for bubbles about to pop
- [ ] Animation delay before bubble removal
- [ ] Progressive difficulty with new bubble rows
- [ ] Countdown timer for row additions

[welcome]: ./assets/images/preview.png
