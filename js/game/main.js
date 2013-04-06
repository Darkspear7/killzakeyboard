(function () {
    var requestAnimationFrame = window.requestAnimationFrame ||
                                window.mozRequestAnimationFrame ||
                                window.webkitRequestAnimationFrame ||
                                window.msRequestAnimationFrame;
    window.requestAnimationFrame = requestAnimationFrame;
})();

var main = {
 "paused" : false,
 "restart" : false,
 "deltaTime" : 0,
 "prevTime" : 0,
 "prev_state" : false,
 "context" : undefined,
 "canvas" : undefined
};

// Game namespace stuff here
var Game = Game || {};

Game.restartLevel = function Main_restart() {
    main.restart = true;
    setTimeout( function(){
	Gui.clearUI();
	init( Game.currentLevel );
    }, 1000);
}
Game.replayLevel = function Main_replay(){
    Gui.clearUI();
    init( Game.currentLevel );
}
Game.playNextLevel = function Main_playNextLevel(){
    Gui.clearUI();
    init( Game.currentLevel + 1 );
}
Game.getContext = function Main_getContext() {
    if ( !main.context ) { throw "asked for context but there is none. :("; }
    return main.context;
}

Game.getCanvas = function Main_getCanvas() {
    if ( !main.canvas ) { throw "asked for canvas but there is none. :("; }
    return main.canvas;
}

Game.setPaused = function Main_setPaused( value ) {
    main.paused = value;
}

Game.isPaused = function Main_isPaused() {
    return main.paused;
}

// file specific stuff BELOW
function updatePause( context, canvas, value ) {
    if ( main.prev_state == false && value == true ) {
	main.paused = !main.paused;
	Gui.showPauseMenu();
	context.save();
	context.fillStyle = "rgba( 0, 0, 0, 0.2)"; 
	context.fillRect(0, 0, canvas.width, canvas.height );
	context.restore();
    }
    if( !main.paused ){
	Gui.clearUI();
    }
    main.prev_state = value;

}

function gameLoop(time){
    if (main.prevTime != 0) {
	main.deltaTime = time - main.prevTime;
    }
    main.prevTime = time;
    
    updatePause( this.context, this.canvas, this.input.checkKey(27) );

    if ( !Game.isPaused() ) {
	draw.call(this);
	process.call(this, main.deltaTime);
    }

    if ( this.level.isOver() ){
	document.getElementById("canvas").style.display = "none";
	document.getElementById("ProgressBar").style.display = "none";
	Gui.showScoreScreen();
	Sound.pauseMusic();
        Storage.setLevelCompletion(this.level.getId(),this.level.getCompletion());
    }
    else if ( main.restart ) {
	main.restart = false;
    } else {
	requestAnimationFrame(gameLoop.bind(this));
    }
}

// processing done for game logic
function process(deltaTime){
    var apple = this.player.update(this.input, deltaTime);
    if( apple != null){
        this.level.getEntityManager().addCollider(apple);
    }
    this.level.update(deltaTime);
    this.background.update(deltaTime);
}

// rendering frame
function draw() {
    var path = this.path;
    var context = this.context;
    
    context.clearRect(0, 0, this.canvas.width, this.canvas.height);
    this.background.render();
    this.level.render();
    this.player.render();
}

function loadModels() {
    PlayerModel = new Graphics.Model("assets/player_sprite.png", 191.25, 60, 24, 1, 1000/24);
    BirdModel = new Graphics.Model("assets/koocha_sprite_2.png", 88, 94, 23, 1, 1000/24);
    AppleModel = new Graphics.Model("assets/apple_sprite.png", 22, 27, 1, 1, 1000/24);
}

function init( level_id ) {
    Game.currentLevel = level_id;
    main.prevTime = 0;
    main.deltaTime = 0;
    main.paused = false;
    main.canvas = document.getElementById("canvas");
    main.canvas.width = gameWidth;
    main.canvas.height = gameHeight;
    document.getElementById("canvas").style.display = "inline";
    main.context = canvas.getContext("2d");

    loadModels();
    Sound.playMusic(Sound.MusicConst.music1);
    
    level = Storage.getLevel( level_id );

    var w = main.canvas.width;
    var h = main.canvas.height;
    
    player = new Game.Player(20, h / 2, main.context, w, h);
    Hud.refreshProgressBar(0);
    document.getElementById("ProgressBar").style.display = "block";
    var background = new Graphics.Background(main.context, "assets/background.png", 3840, 1080, w, h);
    var input = InputController();
    var extension = {"background": background,"input": input, "player": player, "canvas": main.canvas, "context": main.context, 'level': level };
    //console.profile();
    requestAnimationFrame(gameLoop.bind(extension));
}