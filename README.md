# Pusheen Pop

Pusheen Pop is a cat-themed bubble shooter game.

Check it out at [http://charleskuang.com/pusheen-pop/](http://charleskuang.com/pusheen-pop/)

###Preview:
![welcome]

###Instructions  
* Use the left and right arrows on your keyboard to aim.
* Press the spacebar to launch the bubble.
* Group three bubbles of the same color to pop them.
* Clear all the bubbles to win!
* Don't let bubbles get to the bottom or you lose!

###Technologies
* Javascript
* HTML5 Canvas

###Technical Implementation Details
I struggled to pick an appropriate data structure to store the bubbles to allow for efficient removal. There are two scenarios where a bubble needs to be removed: when there are three or more bubbles grouped together of the same color and when a bubble has no neighbor that is tethered to the top row. I originally planned on using Node Trees with every bubble in the top row acting as a root. However, data duplication and redundancy posed a problem. I then thought of organizing the bubbles into a graph and ultimately settled with storing the bubbles in a hash table with unique id numbers as their keys. I wrote a fetchNeighbors function that organized the bubbles into a pseudo graph of sorts.
* Three or more bubbles of the same color: creates an array of neighboring bubbles of the same color of the ball in motion and removes the bubbles in the array from the general population if the array length >= 3
* NonTethered bubbles: top row bubbles are placed in a queue, neighbors of the first element is added to the queue and removed from the general population of bubbles, first element of queue is removed, continues until the queue is empty, any bubbles left in the general population is consider nontethered and dropped from the game  


###TODO
- [ ] Indicate which bubbles are going to pop
- [ ] Implement a short time delay before bubbles pop
- [ ] Add rows of bubbles as game progresses to increase difficulty
- [ ] Add timer to count down to when a new row will be added

[welcome]: ./assets/images/preview.png
