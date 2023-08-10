let WIDTH = 1000, HEIGHT = 500;

let bg_image, win_image, lose_image;
let platform_image, platform_l, platform_r;
let ball_image, ball, user_difficulty = 1;
let winning_score = 10;

var name;
var added_speed = 0, game_state = "start", l_score = 0, r_score = 0;
var x_variability = 0;
var leaderboard = {};
var sorted_leaderboard;


function preload() {
  bg_image = loadImage("images/pong assets/bg.png");
  bg_image.resize(WIDTH, HEIGHT);
  win_image = loadImage("images/large gifs/dance gif.gif");
  red_win = loadImage("images/large gifs/red win gif.gif")
  blue_win = loadImage("images/large gifs/blue win gif.gif")
  lose_image = loadImage("images/large gifs/disapointed monkey transparent gif.gif");
  platform_image_l = loadImage("images/pong assets/bigLeft.png");
  platform_image_r = loadImage("images/pong assets/bigRight.png");
  ball_image = loadImage("images/blown up images/blown up ball.png");
  mc_font = loadFont("Minecraft.ttf");
}

class Platform {
  constructor(is_left) {
    this.width = 116;
    this.height = 160;
    if(is_left){
        console.log("here");
        this.location = createVector(5, HEIGHT / 2);
        this.platform_image = platform_image_l;
    }
    else{
        this.location = createVector(WIDTH - this.width - 5, HEIGHT / 2);
        this.platform_image = platform_image_r;
    }
    this.s = 7;
    this.speed = {
      up: createVector(0, this.s * -1), 
      down: createVector(0, this.s)
    };
    this.platform_image.resize(this.width, this.height);
  }

  draw() {
    image(this.platform_image, this.location.x, this.location.y);
  }

  move(direction) {
    this.location.add(this.speed[direction]);

    if(this.location.y < 10) {
      this.location.y = 10;
    }
    if(this.location.y > HEIGHT - this.height - 10) {
      this.location.y = HEIGHT - this.height - 10;
    }
  }
}

class Ball {
  constructor(platform_l, platform_r) {
    this.radius = 30;
    this.location = createVector(WIDTH / 2, HEIGHT / 2);
    this.s = 6;
    this.velocity = createVector(this.s, this.s * -1);
    this.platform_l = platform_l;
    this.platform_r = platform_r;
    ball_image.resize(this.radius, this.radius);
  }

  draw() {
    image(ball_image, this.location.x, this.location.y);
  }

  move() {
    console.log(this.s);
    if (this.location.x >= this.platform_l.width && this.location.x <= WIDTH - this.platform_l.width){
        if (this.location.x + this.radius >= this.platform_l.location.x && this.location.x <= this.platform_l.location.x + this.platform_l.width) {          
        if (this.location.y + this.radius >= this.platform_l.location.y && this.location.y - this.radius <= this.platform_l.location.y + this.platform_l.width) {
            this.velocity['x'] *= -1;
            // this.location.x = this.platform_l.location.x + this.radius + platform_l.width;
        }
        }

        if (this.location.x + this.radius >= this.platform_r.location.x && this.location.x <= this.platform_r.location.x + this.platform_r.width) {          
            if (this.location.y + this.radius >= this.platform_r.location.y && this.location.y - this.radius <= this.platform_r.location.y + this.platform_l.width) {
            this.velocity['x'] *= -1;
            //   this.location.x = this.platform_r.location.x - this.radius - platform_r.width;
            }
        }
    }

    if(this.location.y <= 10) { 
        this.velocity['y'] *= -1;
    }
    else if(this.location.y + this.radius >= HEIGHT - 10) {
        this.velocity['y'] *= -1;
    }

    if (this.location.x + this.radius >= WIDTH) { 
        l_score++;
        this.location = createVector(WIDTH / 2, HEIGHT / 2);
      } else if(this.location.x - this.radius <= 0) {
        r_score++;
        this.location = createVector(WIDTH / 2, HEIGHT / 2);
      } 

    this.location.add(this.velocity);
    
    if (this.location.x + this.radius >= width) { 
      return true;
    } else if(this.location.x - this.radius <= 0) {
      return true;
    } else { 
      return false;
    } 

  }
}

function setup() {
  canvas = createCanvas(WIDTH, HEIGHT);
  canvas.parent('sketch-holder');

  platform_l = new Platform(true);
  platform_r = new Platform(false);
  ball = new Ball(platform_l, platform_r);

}

function draw() {
  if(game_state == "play") {
    background(bg_image);
  
    if (keyIsDown(87)) {
      platform_l.move('up');
    } 
    else if (keyIsDown(83)) {
      platform_l.move('down');
    }
    platform_l.draw();

    if (keyIsDown(UP_ARROW)) {
        platform_r.move('up');
      } 
      else if (keyIsDown(DOWN_ARROW)) {
        platform_r.move('down');
      }
      platform_r.draw();


    ball.move();
    ball.draw();

    if (keyIsDown(49)){
        user_difficulty = 1;
    }
    else if(keyIsDown(50)){
        user_difficulty = 2;
    }
    else if(keyIsDown(51)){
        user_difficulty = 3;
    }

    if (l_score >= winning_score || r_score >= winning_score) {
       
      platform_l = new Platform(true);
      platform_r = new Platform(false);
      ball = new Ball(platform_l, platform_r);
      added_speed = 0;

      game_state = "win";
    }

    textSize(20);
    textFont(mc_font);
    fill(255);
    text(`Score: ${r_score}`, WIDTH - 100, HEIGHT - 25);
    text(`Score: ${l_score}`, 10, HEIGHT - 25);
  }
  else if(game_state == "start") {
      background(bg_image);
      textSize(75);
      textFont(mc_font);
      fill(255);
      text(`PONG GAME`, 260, HEIGHT - 200);
      text(`PRESS SPACE TO PLAY!`, 50, HEIGHT - 100);
      if (keyIsDown(32)) {
        game_state = "play"; //enter_name
      }
    }
  else if(game_state == "win") {
    // write_to_leaderboard();
    background(bg_image);
    
    textSize(50);
    textFont(mc_font);
    fill(255);
    if(l_score > r_score){
        fill(0, 0, 255);
        text(`LEFT WINS!`, 360, HEIGHT - 180);
        image(blue_win, 375, 25);
    }
    else{
        fill(255, 0, 0);
        text(`RIGHT WINS!`, 360, HEIGHT - 180);
        image(red_win, 375, 25);
    }
    fill(255);
    text(`PRESS SPACE TO PLAY AGAIN.`, 110, HEIGHT - 120);
    text(`Score: ${l_score} to ${r_score}`, 350 , HEIGHT - 30);
    if (keyIsDown(32)) {
      game_state = "play"; 
      l_score = 0;
      r_score = 0;
    }
  }
}