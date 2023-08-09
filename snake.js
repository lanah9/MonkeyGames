let WIDTH = 1000, HEIGHT = 500;

let bg_image; 
let heart_image, banana_image, player_image, player;
let obstacle_image;

var game_state = "start", bananas = 0, high_bananas = 0, new_high = false;
var added_speed = 0;
var direction = "right", banana;
var body_array = [];

function preload() {
  bg_image = loadImage("images/large_images/bg.png");
  bg_image.resize(WIDTH, HEIGHT);
  player_image = loadImage("images/blown up images/cropped/blown up sprite.png");
  player_image_flash = loadImage("images/monkey plane game/cropped/plane_flash.png");
  heart_image = loadImage("images/blown up images/blown up heart.png");
  banana_image = loadImage("images/blown up images/cropped/blown up banana.png");
  banana_image_icon = loadImage("images/blown up images/cropped/blown up banana.png");
  obstacle_image = loadImage("images/blown up images/cropped/stick.png");
  lose_image = loadImage("images/large gifs/disapointed monkey transparent gif.gif");
  mc_font = loadFont("Minecraft.ttf");
}

class Segment {
    constructor(first_one, player) {
        if(first_one){
            this.previous_x = player.location.x;
            this.previous_y = player.location.y;
            this.previous = player;
        }
        else{
            this.previous_x = body_array[body_array.length - 1].location.x;
            this.previous_y = body_array[body_array.length - 1].location.y;
            this.previous = body_array[body_array.length - 1];
        }
        this.location = createVector(this.previous_x - 250, this.previous_y - 250);
        this.position = body_array.length;
        this.direction = direction;
    }
    draw(player){
        // if(this.position > 1){
        //     // this.location.x = body_array[this.position - 1].location.x - 50;
        //     // this.location.y = body_array[this.position - 1].location.y - 50;
        //     if(body_array[this.position - 2].direction == "down"){
        //         image(player_image_flash, body_array[this.position - 2].location.x, body_array[this.position - 2].location.y - 50);
        //     }
        //     else if(body_array[this.position - 2].direction == "up"){
        //         image(player_image_flash, body_array[this.position - 2].location.x, body_array[this.position - 2].location.y + 50);
        //     }
        //     else if(body_array[this.position - 2].direction == "right"){
        //         image(player_image_flash, body_array[this.position - 2].location.x - 50, body_array[this.position - 2].location.y);
        //     }
        //     else{
        //         image(player_image_flash, body_array[this.position - 2].location.x + 50, body_array[this.position - 2].location.y);
        //     }
        //     console.log(body_array);
        // }
        // else{
            if(direction == "down"){
                image(player_image_flash, player.location.x, player.location.y - (this.position * 50));
                this.direction = "down";
            }
            else if(direction == "up"){
                image(player_image_flash, player.location.x, player.location.y + (this.position * 50));
                this.direction = "up";
            }
            else if(direction == "right"){
                image(player_image_flash, player.location.x - (this.position * 50), player.location.y);
                this.direction = "right";
            }
            else{
                image(player_image_flash, player.location.x + (this.position * 50), player.location.y);
                this.direction = "left";
            }
        // }
        
    }
}

class Player {
    constructor() {
      this.width = 75;
      this.height = 75;
      this.location = createVector(150, 100);
      this.x = 5;
      this.y = 5;
      player_image.resize(this.width, this.height);
    }
  
    draw(hit) {
      if (!hit) {
        image(player_image, this.location.x, this.location.y);
      }
      else {
        image(player_image_flash, this.location.x, this.location.y);
      }
      if(this.location.x < 0) {
        this.location.x = 0;
      }
      if(this.location.x > WIDTH - this.width) {
        this.location.x = WIDTH - this.width;
      }
      if(this.location.y < 0) {
        this.location.y = 0;
      }
      if(this.location.y > HEIGHT - this.height) {
        this.location.y = HEIGHT - this.height;
      }
    }
  
    move() {
      if ((keyIsDown(LEFT_ARROW) || keyIsDown(65)) && direction != "right") {
        direction = "left";
      } 
      else if ((keyIsDown(RIGHT_ARROW) || keyIsDown(68))  && direction != "left") {
        direction = "right";
      }
      else if ((keyIsDown(UP_ARROW) || keyIsDown(87))  && direction != "down") {
        direction = "up";
      }
      else if ((keyIsDown(DOWN_ARROW) || keyIsDown(83)) && direction != "up") {
        direction = "down";
      }

      if(direction == "right"){
        this.location.x += (this.x + added_speed);
      }
      else if(direction == "left"){
        this.location.x -= (this.x + added_speed);
      }
      else if(direction == "up"){
        this.location.y -= (this.y + added_speed);
      }
      else if(direction == "down"){
        this.location.y += (this.y + added_speed);
      }
    }

    bananas() {
      banana_image_icon.resize(25, 25);
      image(banana_image_icon, 25, 25);
      textSize(25);
      textFont(mc_font);
      text(`x ${bananas}`, 60, 45);
    }
  }

class Banana {
  constructor(location) {
    this.location = location;
    this.width = 50;
    this.height = 50;
  }

  draw() {
    image(banana_image, this.location.x, this.location.y);
  }

  hit(player) {
    if(player.location.y - player.height <= this.location.y + this.height &&
      player.location.y + player.height >= this.location.y &&
      player.location.x + player.width >= this.location.x &&
      player.location.x - player.width <= this.location.x + this.width) {
        return true;
      }
  }
}

function setup() {
  canvas = createCanvas(WIDTH, HEIGHT);
  canvas.parent('sketch-holder');

  player = new Player();
  x = Math.floor(Math.random() * (WIDTH - 250));
  y = Math.floor(Math.random() * (HEIGHT - 250));
  banana = new Banana(createVector(x, y));

  banana_image.resize(50, 50);
  last_change = millis() - 10000;

}

function draw() {
  if(game_state == "play") {
    current_time = millis();
    background(bg_image);

    player.move();
    player.draw(false);
    player.bananas();

    banana.draw();

    if(banana.hit(player)){
        x = Math.floor(Math.random() * (WIDTH - 250));
        y = Math.floor(Math.random() * (HEIGHT - 250));
        banana = new Banana(createVector(x, y));
        bananas++;
        if (body_array.length > 0){
            body_array.push(new Segment(false, player));
        }
        else{
            body_array.push(new Segment(true, player));
        }
    }

    for(let i = 0; i < body_array.length; i++){
        body_array[i].draw(player);
    }

    current_time = millis();
    for(let i = 1; i < body_array.length; i++){
        if(body_array[i-1].direction != body_array[i].direction){
            if(current_time - last_change > 250){
                body_array[i].direction = body_array[i-1].direction;
                last_change = millis();
            }
        }
    }
    
    if (bananas > high_bananas) {
      high_bananas = bananas;
      new_high = true;
    }

    if(player.alive == false) {
      game_state = "lose";
      player = new Player();
      body_array.splice(0, body_array.length);
      added_speed = 0;
      banana_cooldown = 1500;
    }
  }
  else if(game_state == "start") {
    background(bg_image);
    textSize(75);
    textFont(mc_font);
    fill(0);
    text(`SNAKE GAME`, 250, HEIGHT - 200);
    text(`PRESS SPACE TO PLAY!`, 50, HEIGHT - 100);
    if (keyIsDown(32)) {
      game_state = "play"; 
    }
  }
  else if(game_state == "lose") {
    background(bg_image);
    image(lose_image, 400, 50);
    textSize(50);
    textFont(mc_font);
    fill(0);
    text(`YOU LOSE!`, 360, HEIGHT - 180);
    text(`PRESS SPACE TO TRY AGAIN.`, 120, HEIGHT - 120);
    text(`Score: ${bananas}`, WIDTH - 270, HEIGHT - 30);
    if(new_high) {
      fill(255, 0, 0);
      text(`*NEW* High Score: ${high_bananas}`, 50, HEIGHT - 30);
    }
    else{
      text(`High Score: ${high_bananas}`, 50, HEIGHT - 30);
    }
    fill(0);
    
    if (keyIsDown(32)) {
      game_state = "play"; 
      new_high = false;
      bananas = 0;
    }
  }
}