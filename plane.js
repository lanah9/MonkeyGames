let WIDTH = 1000, HEIGHT = 500;

let bg_image; 
let heart_image, banana_image, player_image, player;
let obstacle_image;

var game_state = "start", bananas = 0, high_bananas = 0, new_high = false;
var added_speed = 0;
let notAvplane = true;

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

class Player {
  constructor() {
    this.width = 125;
    this.height = 100;
    this.location = createVector(150, 100);
    this.x = 5;
    this.y = 10;
    this.gravity = 5 + added_speed;

    this.health_start = 5;
    this.health_remaining = this.health_start;

    // player_image.resize(this.width, this.height);
    // player_image_flash.resize(this.width, this.height);
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
    if(this.location.y < this.width * -1) {
      this.location.y = this.width * -1;
    }
    if(this.location.y > HEIGHT) {
      player.health_remaining--;
      player.last_hit = millis();
      this.location.y = HEIGHT - this.height;
    }
  }

  move() {
    if (keyIsDown(LEFT_ARROW) || keyIsDown(65)) {
      this.location.x -= (this.x + added_speed);
    } 
    else if (keyIsDown(RIGHT_ARROW) || keyIsDown(68)) {
      this.location.x += (this.x + added_speed);
    }
    if (keyIsDown(UP_ARROW) || keyIsDown(87)) {
      this.location.y -= (this.y + added_speed);
    }
    if((keyIsDown(70)) && notAvplane) {
      player_image = loadImage("images/blown up images/cropped/avplane.png");
      banana_image = loadImage("images/blown up images/cropped/gascan.png");
      banana_image_icon = loadImage("images/blown up images/cropped/gascan.png");
      // player_image.resize(this.width, this.height);
      // player_image_flash.resize(this.width, this.height);
      // banana_image.resize(50, 50);
      notAvplane = false;
    }
    else if((keyIsDown(70)) && !notAvplane) {
      player_image = loadImage("images/blown up images/cropped/blown up sprite.png");
      banana_image = loadImage("images/blown up images/cropped/blown up banana.png");
      banana_image_icon = loadImage("images/blown up images/cropped/blown up banana.png");
      // player_image.resize(this.width, this.height);
      // player_image_flash.resize(this.width, this.height);
      // banana_image.resize(50, 50);
      notAvplane = true;
    }
  }

  hearts() {
    heart_image.resize(100, 100);
    for (var i = 0; i < this.health_remaining; i++) {
      image(heart_image, WIDTH - 100 - (i * 50), 0);
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

class Obstacle {
  constructor(location) {
    this.location = location;
    this.width = 100;
    this.height = 200;
    this.speed = 5 + added_speed;
  }

  draw() {
    image(obstacle_image, this.location.x, this.location.y);
    this.location.x -= this.speed;
  }

  hit(player) {
    if(player.location.y - player.height <= this.location.y + this.width - 50 &&
      player.location.y + player.height >= this.location.y &&
      player.location.x + player.width >= this.location.x &&
      player.location.x - player.width <= this.location.x + this.width) {
        return true;
      }
  }
}

class Banana {
  constructor(location) {
    this.location = location;
    this.width = 50;
    this.height = 50;
    this.speed = 5 + added_speed;
  }

  draw() {
    image(banana_image, this.location.x, this.location.y);
    this.location.x -= this.speed;
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
  obstacle_array = [];
  banana_array = [];

  obstacle_image.resize(100, 200);
  banana_image.resize(50, 50);

  last_banana = millis() - 10000;
  last_obstacle = millis() - 10000;
  last_hit = millis() - 10000;

  banana_cooldown = 1500;
  obstacle_cooldown = 1500;
}

function draw() {
  if(game_state == "play") {
    current_time = millis();
    background(bg_image);

    player.move();
    player.location.y += player.gravity;
    if(current_time - last_hit > 100) {
      player.draw(false);
    }
    else {
      player.draw(true);
    }
    
    player.hearts();
    player.bananas();

    if(millis() - last_obstacle > obstacle_cooldown) {
      x = Math.floor(Math.random() * 50);
      y = Math.floor(Math.random() * HEIGHT - 100);
      let o2 = new Obstacle(createVector(WIDTH + x, y));
      obstacle_array.push(o2);
      last_obstacle = millis();
    }

    for (let i = obstacle_array.length - 1; i >= 0; i--) {
      const o = obstacle_array[i];
      o.draw();
      
      if(o.hit(player) && current_time - last_hit > 1000) {
        player.health_remaining--;
        last_hit = current_time;
        
      }
      if(o.location.x < -300) {
        obstacle_array.splice(i, 1);
      }
      
    }
    
    

    if(millis() - last_banana > banana_cooldown) {
      x = Math.floor(Math.random() * 50);
      y = Math.floor(Math.random() * HEIGHT - 100);
      let b2 = new Banana(createVector(WIDTH + x, y));
      banana_array.push(b2);
      last_banana = millis();
    }

    for (let i = banana_array.length - 1; i >= 0; i--) {
      const b = banana_array[i];
      b.draw();
      if(b.hit(player)) {
        bananas++;
        if(added_speed < 10) {
          added_speed += 0.25;
          banana_cooldown -= 25;
          obstacle_cooldown -= 25;
        }
        banana_array.splice(i, 1);
      }
      if(b.location.x < -300) {
        banana_array.splice(i, 1);
      }
    }
    

    if (bananas > high_bananas) {
      high_bananas = bananas;
      new_high = true;
    }

    if(player.health_remaining <= 0) {
      game_state = "lose";
      player = new Player();
      obstacle_array.splice(0, obstacle_array.length);
      banana_array.splice(0, banana_array.length);
      added_speed = 0;
      banana_cooldown = 1500;
      obstacle_cooldown = 1500;
    }
  }
  else if(game_state == "start") {
    background(bg_image);
    textSize(75);
    textFont(mc_font);
    fill(0);
    text(`PLANE GAME`, 250, HEIGHT - 200);
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