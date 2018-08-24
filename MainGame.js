
function preload ()
{
    this.load.image('sky', 'assets/GoldenKn.png');
    this.load.image('ground', 'assets/platform.png');
	this.load.image('column', 'assets/Column.png');
    this.load.image('star', 'assets/star.png');
    this.load.image('bomb', 'assets/bomb.png');
    this.load.spritesheet('dude', 
        'assets/GoldenKnight.png',
        { frameWidth: 30, frameHeight: 54 }
    );
}

var platforms;
var columns;
var player;
var cursors;
var score = 0;
var scoreText;



function create ()
{
	
	createPlatforms(this);
    createPlayer(this);
	createColumns(this)
	setCamera(this);
	this.physics.add.collider(player, platforms);
	this.physics.add.collider(player, columns);
	cursors = this.input.keyboard.createCursorKeys();
	bombs = this.physics.add.group();
	this.physics.world.setBounds(0,0,800*4,600,true,true,true,true);
	
}


function update ()
{
	checkControls(player, cursors);
}

function setCamera(scene)
{
	scene.cameras.main.setBounds(0, 0, 800 * 4, 176);
	//scene.cameras.main.startFollow(player, true);
    scene.cameras.main.setZoom(1);
	if (scene.cameras.main.deadzone)
    {
        graphics = scene.add.graphics().setScrollFactor(0);
        graphics.lineStyle(2, 0x00ff00, 1);
        graphics.strokeRect(200, 200, scene.cameras.main.deadzone.width, scene.cameras.main.deadzone.height);
    }
}
function createPlatforms(scene){
    platforms = scene.physics.add.staticGroup();
	createPlatformRow(3, 600, 0);
	createPlatformRow(3, 0, 0);
	
};

function createPlatformRow(amount, height, x){
	var i;
	for(i= 1; i <=amount; i++){
		platforms.create(x+(200 * i), height, 'ground').setScale(1).refreshBody();
	}
}

function createColumns(scene){
	columns = scene.physics.add.staticGroup();
	columns.create(10, 400, 'column').setScale(1).refreshBody();
	columns.create(10, 0, 'column').setScale(1).refreshBody();
	columns.create(800, 400, 'column').setScale(1).refreshBody();
	columns.create(800, 0, 'column').setScale(1).refreshBody();
}



function createPlayer(scene){
	player = scene.physics.add.sprite(100, 450, 'dude');
	player.setCollideWorldBounds(true);
	
	scene.anims.create({
		key: 'left',
		frames: scene.anims.generateFrameNumbers('dude', { start: 0, end	: 6 }),
		frameRate: 10,
		repeat: -1
	});

	scene.anims.create({
		key: 'turn',
		frames: [ { key: 'dude', frame: 14 } ],
		frameRate: 20
	});

	scene.anims.create({
		key: 'right',
		frames: scene.anims.generateFrameNumbers('dude', { start: 7, end	: 13 }),
		frameRate: 10,
		repeat: -1
	});
};


function checkControls()
{
	var keyPressed = false;
	if (cursors.left.isDown){
		player.setVelocityX(-160);
		player.anims.play('left', true);
		keyPressed = true;
	}
	if (cursors.right.isDown){
		player.setVelocityX(160);
		player.anims.play('right', true);
		keyPressed = true;
	}
	
	if (cursors.up.isDown){
		player.setVelocityY(-200);
		keyPressed = true;
	}
	if (cursors.down.isDown ){
		player.setVelocityY(200);
		keyPressed = true;
	}
	if(!keyPressed){
		player.setVelocityX(0);
		player.setVelocityY(0);
		player.anims.play('turn');
	}
}




var mainScene = new Phaser.Scene("MainScene")
	mainScene.preload = preload;
	mainScene.create = create;
	mainScene.update = update;




var hud = new Phaser.Scene("hud");
hud.active=true;
hud.preload = function (){};
hud.create = function(){scoreText = this.add.text(16, 16, 'PlayerHP: 10', { fontSize: '32px',});};
hud.update = function(){};

var config = {
    type: Phaser.AUTO,
    width: 800,
    height: 600,
	backgroundColor: Phaser.Display.Color.GetColor(75,200,100),
    physics: {
        default: 'arcade',
        arcade: {
            gravity: {y: 0},
            debug: false
        }
    },
    scene: [{hud},{mainScene}]
	
};
var game = new Phaser.Game(config);
game.scene.add('hud', hud, true, { x: 400, y: 300 })
game.scene.add('mainScene', mainScene, true)