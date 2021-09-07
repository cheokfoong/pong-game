"use strict";
function pong() {
    const svg = document.getElementById("canvas"), middle_line = new Elem(svg, 'line')
        .attr('stroke-width', 3).attr('x1', 300).attr('y1', 0).attr('x2', 300).attr('y2', 600)
        .attr('stroke-dasharray', 10).attr('stroke', '#FFFFFF'), rect1 = new Elem(svg, 'rect')
        .attr('x', 50).attr('y', 250).attr('width', 14).attr('height', 80)
        .attr('fill', '#FFFFFF'), rect2 = new Elem(svg, 'rect')
        .attr('x', 510).attr('y', 250).attr('width', 14).attr('height', 80)
        .attr('fill', '#FFFFFF'), ball = new Elem(svg, 'ellipse')
        .attr("cx", 290).attr("cy", 300).attr("rx", 5).attr("ry", 5)
        .attr("fill", "#FFFFFF");
    let player_left = 0, player_right = 0;
    function objects_movement() {
        const mousemove = Observable.fromEvent(svg, 'mousemove'), mouseup = Observable.fromEvent(svg, 'mouseup');
        rect1.observe('mousedown')
            .map(({ clientY }) => ({ yOffset: Number(rect1.attr('y')) - clientY }))
            .flatMap(({ yOffset }) => mousemove
            .takeUntil(mouseup)
            .map(({ clientY }) => ({ y: clientY + yOffset })))
            .subscribe(({ y }) => rect1.attr('y', y));
        Observable.interval(10).subscribe(() => rect2.attr("y", (Number(ball.attr("cy")) - Number(rect2.attr("y")) / 8) * 0.97));
        let x = -1, y = Math.random() < 0.5 ? -1 : 1;
        Observable.interval(8)
            .filter(() => player_right < 11 && player_left < 11)
            .subscribe(() => ball.attr("cx", x + Number(ball.attr("cx")))
            .attr("cy", y + Number(ball.attr("cy"))));
        Observable.interval(8).filter(() => Number(ball.attr("cy")) + 5 >= 600 || Number(ball.attr("cy")) - 5 <= 0)
            .subscribe(() => y = -y);
        Observable.interval(8)
            .filter(_ => Number(ball.attr("cx")) + 2.5 >= Number(rect2.attr("x")))
            .filter(_ => Number(ball.attr("cy")) >= Number(rect2.attr("y")))
            .filter(_ => Number(ball.attr("cy")) - 2.5 <= Number(rect2.attr("y")) + 80)
            .subscribe(() => x = -x * 1.05);
        Observable.interval(8)
            .filter(_ => Number(ball.attr("cx")) - 2.5 <= Number(rect1.attr("x")) + 14)
            .filter(_ => Number(ball.attr("cy")) >= Number(rect1.attr("y")))
            .filter(_ => Number(ball.attr("cy")) - 2.5 <= Number(rect1.attr("y")) + 80)
            .subscribe(() => x = -x * 1.05);
        let arr_blocks = blocks(x, y);
        Observable.interval(8)
            .subscribe(() => arr_blocks.forEach(block => {
            if (Number(ball.attr("cx")) - 2.5 <= Number(block.attr("x")) + 10) {
                if (Number(ball.attr("cx")) + 2.5 >= Number(block.attr("x"))) {
                    if (Number(ball.attr("cy")) >= Number(block.attr("y"))) {
                        if (Number(ball.attr("cy")) - 2.5 <= Number(block.attr("y")) + 40) {
                            block.attr("y", 650);
                            x = -x;
                        }
                    }
                }
            }
        }));
    }
    function score() {
        let point_L = document.getElementById("left"), point_R = document.getElementById("right"), winner = document.getElementById("winner");
        Observable.interval(10).subscribe(() => {
            if (Number(ball.attr("cx")) > 600) {
                ball.attr("cx", 290)
                    .attr("cy", 300);
                player_left++;
                point_L.innerHTML = player_left.toString();
            }
            else if (Number(ball.attr("cx")) < 0) {
                ball.attr("cx", 290)
                    .attr("cy", 300);
                player_right++;
                point_R.innerHTML = player_right.toString();
            }
        });
        Observable.interval(10).subscribe(() => {
            if (player_right >= 11) {
                winner.innerHTML = "player 2 wins!";
            }
            else if (player_left >= 11) {
                winner.innerHTML = "player 1 wins!";
            }
        });
    }
    function blocks(x, y) {
        const arr = [];
        let a = 0;
        for (let i = 0; i < 13; i++) {
            const rects = new Elem(svg, 'rect')
                .attr('x', 295).attr('width', 10).attr('height', 40)
                .attr('fill', '#FFFFFF');
            rects.attr("y", a);
            a = a + 45;
            arr.push(rects);
        }
        return arr;
    }
    score();
    objects_movement();
}
if (typeof window != 'undefined')
    window.onload = () => {
        pong();
    };
//# sourceMappingURL=pong.js.map