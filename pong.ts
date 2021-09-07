// FIT2102 2018 Assignment 1
// https://docs.google.com/document/d/1woMAgJVf1oL3M49Q8N3E1ykTuTu5_r28_MQPVS5QIVo/edit?usp=sharing

/*DOCUMENT:
Firstly, I created two paddles, a ball and a stroke object using Elem class
with respective attributes.

Next, to move the AI paddle, it has to follow the ball's movement on y-axis.
So, it's y attribute will be the same as the ball's y movement minus the AI paddle's y position and divided by 8, I added this calculation
so that the paddle doesn't exceed the border lines when it follows the ball to the border lines.
I multiplied the AI paddle speed with 0.97 to cause the paddle to move slower so that the player has a chance to win againts the AI. 
For the ball's movement,  the ball will move in a random direction on y-axis and starts moving to the player paddle first but with a constant speed of 1 at the start.

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
the svg ID will be canvas and the width, height, colour and font are set.
I used filter here again to check for the condition whether does the ball move out of the side borders of the svg canvas, 
once the ball is out of the range, it will reset the ball's postion to the middle and update the score of the winner and print out 
the score with innerHTML on the svg canvas.
Same goes to declare the winner text, if any player's score has reached to 11, it will print out the text using innerHTML too.

 */

function pong() {
  // Inside this function you will use the classes and functions 
  // defined in svgelement.ts and observable.ts
  // to add visuals to the svg element in pong.html, animate them, and make them interactive.
  // Study and complete the tasks in basicexamples.ts first to get ideas.

  // You will be marked on your functional programming style
  // as well as the functionality that you implement.
  // Document your code!  
  // Explain which ideas you have used ideas from the lectures to 
  // create reusable, generic functions.


  //create objects
  const
  svg:HTMLElement = document.getElementById("canvas")!,

  middle_line :Elem = new Elem(svg, 'line')   //stroke
    .attr('stroke-width',3).attr('x1',300) .attr('y1',0) .attr('x2',300) .attr('y2',600)
    .attr('stroke-dasharray', 10) .attr('stroke','#FFFFFF'),

  rect1 :Elem = new Elem(svg, 'rect')   //AI paddle (left side)
    .attr('x', 50).attr('y', 250).attr('width', 14).attr('height',80)
    .attr('fill', '#FFFFFF'),

  rect2 :Elem = new Elem(svg, 'rect') //player paddle (right side)
    .attr('x', 510).attr('y', 250) .attr('width', 14).attr('height',80)
    .attr('fill', '#FFFFFF'),
  
  ball :Elem = new Elem(svg, 'ellipse') //ball
    .attr("cx",290).attr("cy",300) .attr("rx",5).attr("ry",5)
    .attr("fill","#FFFFFF");  

  let  
    player_left:number= 0,            //counter score for AI 
    player_right: number= 0;          //counter score for player



  function objects_movement(){
    const     
      mousemove :Observable<MouseEvent> = Observable.fromEvent<MouseEvent>(svg, 'mousemove'),
      mouseup :Observable<MouseEvent>  = Observable.fromEvent<MouseEvent>(svg, 'mouseup');


    rect1.observe<MouseEvent>('mousedown')    //player paddle movement
        .map(({clientY}) => ({yOffset: Number(rect1.attr('y')) - clientY }))  
        .flatMap(({yOffset}) => mousemove 
        .takeUntil(mouseup)
        .map(({clientY}) => ({y: clientY + yOffset })))
        .subscribe(({y}) => rect1.attr('y', y));
      
    //the paddle's attribute y position is according to the ball's position but slightly slower 
    //which is why the speed has to multiply by 0.97, so its movement is 0.98 slower

    Observable.interval(10).subscribe(() =>   //AI paddle movement
        rect2.attr("y", (Number(ball.attr("cy")) - Number(rect2.attr("y"))/8) * 0.97)) 


    let 
    x:number= -1,  //speed of ball on x-axis
    y:number= Math.random()< 0.5 ? -1 :1;   //random speed and direction of ball on y-axis

    //ball movement
    //the ball will only continue to move if either score is less than 11 so I used filter to 
    //filter out all the possibilities of this condition in order to move the ball
    Observable.interval(8)  
      .filter(()=>player_right < 11 && player_left < 11)  
      .subscribe(() =>                                
        ball.attr("cx",x + Number(ball.attr("cx"))) 
        .attr("cy",y + Number(ball.attr("cy"))))   
    

    /////deflects ball//////////////////////////////////////////////////////
    
    //deflect on borders
    //filter out the possibilities of the ball to be out of the box range 
    Observable.interval(8).filter(()=>
      Number(ball.attr("cy"))+5  >= 600 ||  Number(ball.attr("cy"))-5  <= 0)
      .subscribe(() => y=-y)
 
  
    //deflects on AI paddle
    //filter was used here a few times because there is a few conditions we need to look at in order to cause the ball to deflect 
    //conditions which are when the ball's position is in the range from the paddle's top to the bottom and also is it touching the paddle  
    Observable.interval(8)
    .filter(_ => Number(ball.attr("cx")) +2.5 >= Number(rect2.attr("x")))
      .filter(_ => Number(ball.attr("cy")) >= Number(rect2.attr("y")))
        .filter(_ =>Number(ball.attr("cy"))-2.5 <= Number(rect2.attr("y")) + 80)
    .subscribe(()=>  x= -x  *1.05 ) //increase speed on x-axis

    
    //deflects on player paddle
    Observable.interval(8)
    .filter(_ =>Number(ball.attr("cx")) -2.5 <= Number(rect1.attr("x")) + 14)
      .filter(_ =>Number(ball.attr("cy")) >= Number(rect1.attr("y"))) 
        .filter(_ =>Number(ball.attr("cy"))-2.5 <= Number(rect1.attr("y")) + 80 )
    .subscribe(()=>  x= -x  *1.05 ) //increase speed on x-axis 
    

    
    //deflects on blocks
    let arr_blocks: Elem[]= blocks(x,y)  //creates a line of blocks in the middle

    //forEach is used here to look through each block from the array 
    //if the conditions are met then the block will be out of the box and the ball will deflect again
    Observable.interval(8)  
      .subscribe(()=> 
          arr_blocks.forEach(block=> {
            if(Number(ball.attr("cx")) -2.5 <= Number(block.attr("x")) + 10){
              if (Number(ball.attr("cx"))+2.5 >= Number(block.attr("x"))){
                if (Number(ball.attr("cy")) >= Number(block.attr("y"))){ 
                  if (Number(ball.attr("cy"))-2.5 <= Number(block.attr("y")) + 40){

                    block.attr("y",650) //move block out of svg canvas
                    x=-x    //bounce the ball back
                  }
                }
              }
            }
          })
        )

  }


  function score(){
    let
    point_L:HTMLElement = document.getElementById("left")!, //score's id for AI
    point_R:HTMLElement = document.getElementById("right")!,  //score's id for player
    winner:HTMLElement = document.getElementById("winner")!;  //winner's id to print out announcement of the winner

    
    Observable.interval(10)
    .filter(_=> Number(ball.attr("cx")) > 600)  //ball exceeds the border line on the right
      .subscribe(()=>{
        ball.attr("cx",290).attr("cy",300)   //reset the ball's position
        
        player_left ++;   //update score for AI 
        point_L.innerHTML= player_left.toString(); //print updated score  
        })

    Observable.interval(10)
    .filter(_=>Number(ball.attr("cx")) < 0 )  //ball exceeds the border line on the left
      .subscribe(()=>{
      ball.attr("cx",290) .attr("cy",300) 
        
      player_right++;   //update score for player
      point_R.innerHTML= player_right.toString();     
      }
      
    )

    //announce winner
    Observable.interval(10).subscribe(()=>{  
      if( player_right>= 11){winner.innerHTML= "player 2 wins!"}
      else if(player_left >= 11){winner.innerHTML= "player 1 wins!"}
    })
  }


  function blocks(x:number,y:number){
    const arr: Elem[] =[];  //array to store the blocks
    let a: number = 0
    for (let i=0; i<13; i++){ //creates 13 blocks in the middle
        const rects= new Elem(svg, 'rect') 
        .attr('x', 295).attr('width', 10).attr('height',40)
        .attr('fill', '#FFFFFF')

        rects.attr("y",a);
        a= a + 45 //the space between each block is 5 : height + 5 = 45
        arr.push(rects) //push the element into the array
    }

    return arr
  }


score()
objects_movement()
}


  
// the following simply runs your pong function on window load.  Make sure to leave it in place.
if (typeof window != 'undefined')
  window.onload = ()=>{
    pong();
  }
