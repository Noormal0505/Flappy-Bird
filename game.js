// game.js
import Phaser from 'phaser';

class FlappyBird extends Phaser.Scene {
  constructor() {
    super('FlappyBird');
  }

  preload() {
    this.load.image('bird', 'assets/bird.png');
    this.load.image('pipe', 'assets/pipe.png');
    this.load.image('ground', 'assets/ground.png');
  }

  create() {
    this.bird = this.add.sprite(100, 100, 'bird');
    this.bird.body = this.physics.add.body(this.bird);
    this.bird.body.gravity.y = 1000;

    this.pipes = this.add.group();
    this.ground = this.add.sprite(0, 400, 'ground');
    this.ground.body = this.physics.add.body(this.ground);
    this.ground.body.immovable = true;

    this.score = 0;
    this.scoreText = this.add.text(10, 10, 'Score: 0', { fontSize: 24 });

    this.input.on('pointerdown', this.flap, this);
  }

  update(time, delta) {
    if (this.bird.body.velocity.y < 0) {
      this.bird.body.velocity.y += 10;
    }

    this.checkCollision();
    this.generatePipes();
  }

  flap() {
    this.bird.body.velocity.y = -300;
  }

  checkCollision() {
    this.physics.collide(this.bird, this.ground, this.gameOver);
    this.physics.collide(this.bird, this.pipes, this.gameOver);
  }

  gameOver() {
    this.scene.start('GameOver');
  }

  generatePipes() {
    if (this.time.now > this.nextPipeTime) {
      this.nextPipeTime = this.time.now + 1500;

      const pipe = this.pipes.create(400, Phaser.Math.between(100, 300), 'pipe');
      pipe.body = this.physics.add.body(pipe);
      pipe.body.velocity.x = -200;
    }
  }
}

class GameOver extends Phaser.Scene {
  constructor() {
    super('GameOver');
  }

  create() {
    this.add.text(100, 100, 'Game Over!', { fontSize: 48 });
    this.add.text(100, 150, 'Tap to restart', { fontSize: 24 });

    this.input.on('pointerdown', () => {
      this.scene.start('FlappyBird');
    });
  }
}

const config = {
  type: Phaser.CANVAS,
  parent: 'game-container',
  width: 400,
  height: 400,
  scene: [FlappyBird, GameOver],
};

const game = new Phaser.Game(config);
