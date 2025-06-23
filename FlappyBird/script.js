let canvas = document.getElementById("gameCanvas");
let ctx = canvas.getContext("2d");
let block = document.querySelector(".btns");
let logo = document.querySelector(".logo-block");
let end = document.querySelector(".end");
let count = 0;
let menu = document.querySelector(".endin");
let Scr = document.querySelector("#hatam");
let play  = document.querySelector("#play");

play.addEventListener("click" , () =>{
    block.style.display = "none";
    logo.style.display = "none";
    canvas.style.display = "block";
    gameLoop(); 

})
menu.addEventListener("click" , () =>{
    location.reload();
})

let birdImage = new Image();
birdImage.src = "bird.png";

let pipeImage = new Image();
pipeImage.src = "pipe.jpg";

let pipeDownImage = new Image();
pipeDownImage.src = "pipe.jpg";

let pipes = [];
let pipesBottom = [];

let bird = {
    birdPosX: 160,
    birdPosY: 300,
    birdWidth: 40,
    birdHeight: 40
};

function gameLoop() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  bird.birdPosY += 2;

  // Draw and update all pipes
  for (let i = 0; i < pipes.length; i++) {
    let top = pipes[i];
    let bottom = pipesBottom[i];

    // Move pipes
    top.posX -= 3;
    bottom.posX -= 3;

    // Draw pipes
    ctx.drawImage(pipeImage, top.posX, top.posY, top.pipeWidth, top.pipeHeight);
    ctx.drawImage(pipeDownImage, bottom.posX, bottom.posY, bottom.pipeWidth, bottom.pipeHeight);

    // ✅ Update score once per pipe
    if (!top.scored && bird.birdPosX > top.posX + top.pipeWidth) {
      count++;
      top.scored = true;
      console.log("Score:", count);
    }

    // ✅ Check collision
    if (checkCollision(bird, top, bottom)) {
        bird.birdPosY += 10;
        canvas.style.display = "none";
        logo.style.display = "flex";
        end.style.display = "block";
        Scr.innerText = "Your Score : " + count;
        return;
    }
  }

  // Draw bird
  ctx.drawImage(birdImage, bird.birdPosX, bird.birdPosY, bird.birdWidth, bird.birdHeight);

  // ✅ Draw score on screen
  ctx.fillStyle = "rgb(90, 3, 3)";
  ctx.font = "24px Arial";
  ctx.fillText("Score: " + count, 880, 40);

  requestAnimationFrame(gameLoop);
}

    


function generatePipe() {
  let gap = 150;
  let topHeight = Math.random() * 200 + 50;

  pipes.push({
    posX: 800,
    posY: 0,
    pipeWidth: 50,
    pipeHeight: topHeight,
    scored: false // ✅ track if score was added
  });

  pipesBottom.push({
    posX: 800,
    posY: topHeight + gap,
    pipeWidth: 50,
    pipeHeight: canvas.height - (topHeight + gap)
  });
}

setInterval(generatePipe, 1500);

document.addEventListener("keydown", (e) => {
  if (e.code === "Space" || e.code === "ArrowUp") {
    bird.birdPosY -= 50;
  }
});

function checkCollision(bird, topPipe, bottomPipe) {
  let bx = bird.birdPosX;
  let by = bird.birdPosY;
  let bw = bird.birdWidth;
  let bh = bird.birdHeight;

  let tx = topPipe.posX;
  let ty = topPipe.posY;
  let tw = topPipe.pipeWidth;
  let th = topPipe.pipeHeight;

  let bx2 = bottomPipe.posX;
  let by2 = bottomPipe.posY;
  let bw2 = bottomPipe.pipeWidth;
  let bh2 = bottomPipe.pipeHeight;

  let hitTop = bx < tx + tw &&
               bx + bw > tx &&
               by < ty + th &&
               by + bh > ty;

  let hitBottom = bx < bx2 + bw2 &&
                  bx + bw > bx2 &&
                  by < by2 + bh2 &&
                  by + bh > by2;

  let hitGround = by + bh >= canvas.height;
  let hitCeiling = by <= 0;

  return hitTop || hitBottom || hitGround || hitCeiling;
}
