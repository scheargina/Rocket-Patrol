class Play extends Phaser.Scene {
    constructor() {
      super("playScene");
    }
    preload() {
      this.load.image('rocket', './assets/rocket.png');
      this.load.image('spaceship', './assets/spaceship.png');
      this.load.image('kaiwen01', './assets/kaiwen01.png');
      this.load.image('starfield', './assets/1starfield.png');
      this.load.spritesheet('aspaceship', './assets/aspaceship.png', {frameWidth: 64, frameHeight: 32, startFrame: 0, endFrame: 2});
      this.load.spritesheet('explosion', './assets/explosion.png', {frameWidth: 64, frameHeight: 32, startFrame: 0, endFrame: 9});
    }
    
    create() {
      this.starfield = this.add.tileSprite(0, 0, 640, 480, 'starfield').setOrigin(0, 0);
      this.add.rectangle(0, borderUISize + borderPadding, game.config.width, borderUISize * 2, 0x3131F3).setOrigin(0, 0);
      this.add.rectangle(0, 0, game.config.width, borderUISize, 0xFFFFFF).setOrigin(0, 0);
      this.add.rectangle(0, game.config.height - borderUISize, game.config.width, borderUISize, 0xFFFFFF).setOrigin(0, 0);
      this.add.rectangle(0, 0, borderUISize, game.config.height, 0xFFFFFF).setOrigin(0, 0);
      this.add.rectangle(game.config.width - borderUISize, 0, borderUISize, game.config.height, 0xFFFFFF).setOrigin(0, 0);
      this.p1Rocket = new Rocket(this, game.config.width/2, game.config.height - borderUISize - borderPadding, 'rocket').setOrigin(0.5, 0);
      this.anims.create({
        key: 'aspaceship',
        frames: this.anims.generateFrameNumbers('aspaceship', { start: 0, end: 2, first: 0}),
        frameRate: 5,
        repeat:-1
      });
      this.ship01 = new Spaceship(this, game.config.width + borderUISize*6, borderUISize*5, 'aspaceship', 0, 30).setOrigin(0, 0);
      this.ship02 = new Spaceship(this, game.config.width + borderUISize*3, borderUISize*6 + borderPadding*2, 'aspaceship', 0, 20).setOrigin(0,0);
      this.ship03 = new Spaceship(this, game.config.width, borderUISize*7 + borderPadding*4, 'aspaceship', 0, 10).setOrigin(0,0);
      this.ship04 = new liteSpaceship(this, game.config.width + borderUISize*9, borderUISize*4, 'kaiwen01', 0, 100).setOrigin(0, 0);
      this.ship01.anims.play('aspaceship');
      this.ship02.anims.play('aspaceship');
      this.ship03.anims.play('aspaceship');
      keyF = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.F);
      keyR = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.R);
      keyLEFT = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.LEFT);
      keyRIGHT = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.RIGHT);
      
      this.anims.create({
        key: 'explode',
        frames: this.anims.generateFrameNumbers('explosion', { start: 0, end: 9, first: 0}),
        frameRate: 30
      });
      
      this.p1Score = 0;
      let scoreConfig = {
        fontFamily: 'Courier',
        fontSize: '28px',
        backgroundColor: '#F3B141',
        color: '#843605',
        align: 'right',
        padding: {
          top: 5,
          bottom: 5,
        },
        fixedWidth: 100
      }
      this.scoreLeft = this.add.text(borderUISize + borderPadding, borderUISize + borderPadding*2, this.p1Score, scoreConfig);
      this.bestp = this.add.text(borderUISize + borderPadding + scoreConfig.fixedWidth *1.5 , borderUISize + borderPadding*2, config.bestpoint, scoreConfig);
      this.addtime = 0;
      this.clockRight = this.add.text(-borderUISize + game.config.width - borderPadding - scoreConfig.fixedWidth, borderUISize + borderPadding*2, this.p1Score, scoreConfig);
      this.gameOver = false;
      scoreConfig.fixedWidth = 0;
      this.clock = this.time.delayedCall(game.settings.gameTimer, () => {
          this.add.text(game.config.width/2, game.config.height/2, 'GAME OVER', scoreConfig).setOrigin(0.5);
          this.add.text(game.config.width/2, game.config.height/2 + 64, 'Press (R) to Restart or ← for Menu', scoreConfig).setOrigin(0.5);
          this.gameOver = true;
          if(config.bestpoint < this.p1Score){
            config.bestpoint = this.p1Score;
          }
      }, null, this);
      scoreConfig.backgroundColor = '#B81818';
      this.fire = this.add.text(game.config.width/2 - scoreConfig.fixedWidth/2, borderUISize + borderPadding*2, 'Fire!', scoreConfig);
      this.fire.visible = false;
    }
    update() {
      if (this.gameOver && Phaser.Input.Keyboard.JustDown(keyR)) {
        this.scene.restart();
      }
      if (this.gameOver && Phaser.Input.Keyboard.JustDown(keyLEFT)) {
        this.scene.start("menuScene");
      }

      if (!this.gameOver) {               
        this.p1Rocket.update();
        this.starfield.tilePositionX -= 4;
        this.ship01.update();            
        this.ship02.update();
        this.ship03.update();
        this.ship04.update();
        this.clockRight.text = Math.floor((game.settings.gameTimer - this.time.now + this.time.startTime)/1000 + this.addtime);
        if(this.time.now - this.time.startTime >=30000 && game.settings.spaceshipSpeed == this.ship01.moveSpeed){
          this.ship01.moveSpeed += 2;
          this.ship02.moveSpeed += 3;
          this.ship03.moveSpeed += 2;
        }
      }   

      if(this.checkCollision(this.p1Rocket, this.ship03)) {
        this.p1Rocket.reset();
        this.shipExplode(this.ship03); 
        this.addTime();  
      }
      if (this.checkCollision(this.p1Rocket, this.ship02)) {
        this.p1Rocket.reset();
        this.shipExplode(this.ship02);
        this.addTime();  
      }
      if (this.checkCollision(this.p1Rocket, this.ship01)) {
        this.p1Rocket.reset();
        this.shipExplode(this.ship01);
        this.addTime();  
      }
      if (this.checkCollision(this.p1Rocket, this.ship04)) {
        this.p1Rocket.reset();
        this.shipExplode(this.ship04);
        this.addTime();  
      }


      
    }
    checkCollision(rocket, ship) {
      if (rocket.x < ship.x + ship.width && 
        rocket.x + rocket.width > ship.x && 
        rocket.y < ship.y + ship.height &&
        rocket.height + rocket.y > ship. y) {
        return true;
      } else {
        return false;
      }
    }
    shipExplode(ship) {
      // temporarily hide ship
      ship.alpha = 0;
      // create explosion sprite at ship's position
      let boom = this.add.sprite(ship.x, ship.y, 'explosion').setOrigin(0, 0);
      boom.anims.play('explode');             // play explode animation
      boom.on('animationcomplete', () => {    // callback after anim completes
        ship.reset();                         // reset ship position
        ship.alpha = 1;                       // make ship visible again
        boom.destroy();                       // remove explosion sprite
      });      
      this.p1Score += ship.points;
      this.scoreLeft.text = this.p1Score;
      let index = Math.floor(Math.random()*5);
      let sound_dict = ['sfx_explosion','sfx_explosiona','sfx_explosionb','sfx_explosionc','sfx_explosiond'];
      this.sound.play(sound_dict[index]);     
    }
    addTime(){
      let scoreConfig = {
        fontFamily: 'Courier',
        fontSize: '28px',
        backgroundColor: '#F3B141',
        color: '#843605',
        align: 'right',
        padding: {
          top: 5,
          bottom: 5,
        },
        fixedWidth: 0
      }
      this.time.removeEvent(this.clock);
      this.addtime = this.addtime + 1;
      this.clock = this.time.delayedCall(game.settings.gameTimer - this.time.now + this.time.startTime + this.addtime*1000, () => {
        this.add.text(game.config.width/2, game.config.height/2, 'GAME OVER', scoreConfig).setOrigin(0.5);
        this.add.text(game.config.width/2, game.config.height/2 + 64, 'Press (R) to Restart or ← for Menu', scoreConfig).setOrigin(0.5);
        this.gameOver = true;
        if(config.bestpoint < this.p1Score){
          config.bestpoint = this.p1Score;
        }
      }, null, this);
    }

  }