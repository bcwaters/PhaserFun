var config = {
    type: Phaser.AUTO,
    width: 800,
    height: 600,
    physics: {
        default: 'arcade',
        arcade: {
            gravity: {y: 20},
            debug: false
        }
    },
    scene: {
        preload: preload,
        create: create,
        update: update
    }
};

var game = new Phaser.Game(config);


function preload ()
{
    this.load.image('sky', 'assets/sky.png');
    this.load.image('ground', 'assets/platform.png');
    this.load.image('star', 'assets/star.png');
    this.load.image('bomb', 'assets/bomb.png');
    this.load.spritesheet('dude', 
        'assets/testSorloSprite.png',
        { frameWidth: 75, frameHeight: 75 }
    );
}

var platforms;
var player;
var cursors;
var stars;
var bombs;
var score = 0;
var scoreText;



function create ()
{
	
	createPlatforms(this);
    createPlayer(this);
	createStars(this);
	setCamera(this);
	this.physics.add.collider(player, platforms);
	this.physics.add.collider(stars, platforms);
	this.physics.add.overlap(player, stars, collectStar, null, this);
	scoreText = this.add.text(16, 16, 'score: 0', { fontSize: '32px', fill: '#000' });
	cursors = this.input.keyboard.createCursorKeys();
	bombs = this.physics.add.group();
	this.physics.add.collider(bombs, platforms);
	this.physics.add.collider(player, bombs, hitBomb, null, this);
	
}


function update ()
{
	checkControls();
}

function setCamera(scene)
{
	 scene.cameras.main.setBounds(0, 0, 720 * 4, 176);
	 scene.cameras.main.startFollow(player, true);
    scene.cameras.main.setZoom(1);
	if (scene.cameras.main.deadzone)
    {
        graphics = scene.add.graphics().setScrollFactor(0);
        graphics.lineStyle(2, 0x00ff00, 1);
        graphics.strokeRect(200, 200, scene.cameras.main.deadzone.width, scene.cameras.main.deadzone.height);
    }
}
function createPlatforms(scene){
	//scene.add.image(400, 300, 'sky');
    platforms = scene.physics.add.staticGroup();
    platforms.create(200, 568, 'ground').setScale(2).refreshBody();
	platforms.create(200*3, 568, 'ground').setScale(2).refreshBody();
	platforms.create(200 * 6, 568, 'ground').setScale(2).refreshBody();
	platforms.create(200 * 9, 568, 'ground').setScale(3).refreshBody();
    platforms.create(600, 400, 'ground');
    platforms.create(50, 250, 'ground');
    platforms.create(750, 220, 'ground');
};

function createPlayer(scene){
	player = scene.physics.add.sprite(100, 450, 'dude');
	player.setBounce(0.2);
	//player.setCollideWorldBounds(true);
	player.body.setGravityY(300);

	scene.anims.create({
		key: 'left',
		frames: scene.anims.generateFrameNumbers('dude', { start: 0, end	: 3 }),
		frameRate: 10,
		repeat: -1
	});

	scene.anims.create({
		key: 'turn',
		frames: [ { key: 'dude', frame: 4 } ],
		frameRate: 20
	});

	scene.anims.create({
		key: 'right',
		frames: scene.anims.generateFrameNumbers('dude', { start: 5, end	: 8 }),
		frameRate: 10,
		repeat: -1
	});
};

function collectStar (player, star)
{
   star.disableBody(true, true);

    score += 10;
    scoreText.setText('Score: ' + score);

    if (stars.countActive(true) === 0)
    {
        stars.children.iterate(function (child) {

            child.enableBody(true, child.x, 0, true, true);

        });

        var x = (player.x < 400) ? Phaser.Math.Between(400, 800) : Phaser.Math.Between(0, 400);

        var bomb = bombs.create(x, 16, 'bomb');
        bomb.setBounce(1);
        bomb.setCollideWorldBounds(true);
        bomb.setVelocity(Phaser.Math.Between(-200, 200), 20);
        bomb.allowGravity = false;

    }
}

function createStars(scene){
	stars = scene.physics.add.group({
    key: 'star',
    repeat: 11,
    setXY: { x: 12, y: 0, stepX: 70 }
	});

	stars.children.iterate(function (child) {
    child.setBounceY(Phaser.Math.FloatBetween(0.4, 0.8));
	});
};
function checkControls()
{
	if (cursors.left.isDown){
		player.setVelocityX(-160);
		player.anims.play('left', true);
	}
	else if (cursors.right.isDown){
		player.setVelocityX(160);
		//player.anims.play('right', true);
	}
	else{
		player.setVelocityX(0);
		//player.anims.play('turn');
	}

	if (cursors.up.isDown && player.body.touching.down){
		player.setVelocityY(-600);
	}
};

function hitBomb (player, bomb)
{
    this.physics.pause();

    player.setTint(0xff0000);
    player.anims.play('turn');
    gameOver = true;
}