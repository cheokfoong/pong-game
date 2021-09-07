Firstly, I created two paddles, a ball and a stroke object using Elem class
with respective attributes.

Next, to move the AI paddle, it has to follow the ball's movement on y-axis.
So, it's y attribute will be the same as the ball's y movement minus the AI paddle's y position and divided by 8.
I added this calculation so that the paddle doesn't exceed the border lines when it follows the ball to the border lines.
I multiplied the AI paddle speed with 0.97 to cause the paddle to move slower so that the player has a chance to win againts the AI. 

For the ball's movement,  the ball will move in a random direction on y-axis and starts moving to the player paddle first 
but with a constant speed of 1 at the start.

By using the mousedown ID from MouseEvent, the player can move the player's paddle. for each movement from 
mousedown, it will track each movement on the y-axis until the player releases the mouse click.

As for deflection of the ball, filter was used here a few times because there is a few conditions we need to look at 
in order to cause the ball to bounce back from the paddle. conditions which are when the ball's position is in the range 
from the paddle's top to the bottom and also is it touching the paddle at the side.
After deflecting from the paddle, the ball will increase its speed by 0.05%.

I also created 13 blocks objects in the middle as an extra condition for the game, the space between each block will be 5 spaces.
The player has to hit the blocks to clear the path for the ball to pass through to the opposite paddle.
From here, I created an array to store the blocks and used forEach to check whether does the ball has hit on any of the blocks. 
Once hit on a block, the block will be moved out of the svg canvas, and the ball will bounce back as well.

To create the scoreboard, I created three new html text under pong.html, which are the left score, right score and the text to declare the winner.
the svg id will be canvas and the width, height, colour and font are set.
I used filter here again to check for the condition whether does the ball move out of the side borders of the svg canvas, 
once the ball is out of the range, it will reset the ball's postion to the middle and update the score of the winner and print out 
the score with innerHTML on the svg canvas.
Same goes to declare the winner text, if any player's score has reached to 11, it will print out the text using innerHTML too.



