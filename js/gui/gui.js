var Gui = Gui || {};

var fullpage = true;
var sx = 1, sy = 1;
var gameWidth = 1920;
var gameHeight = 1080;

window.onresize = function(event) {
    scale();
}
window.onload = function(event) {
    scale();
}
function scale() {
    var tx = 0;
    if(fullpage){
        var h = window.innerHeight;
        var w = (h * 16) / 9;
        if(window.innerWidth < w)
        {
            w = window.innerWidth;
            h = (w * 9) / 16;
        }
        sx = w / gameWidth;
        sy = h / gameHeight;
        
        d1 = (gameWidth - w) / 2;
        d2 = window.innerWidth - d1 - w;
        d3 = Math.max(0, window.innerWidth - gameWidth);
        tx = (d1 - d2 + d3) / 2;
    }
    document.getElementById("GameHolder").style.transform="translate(-"+tx+"px) scale("+sx+","+sy+")";
    document.getElementById("GameHolder").style.webkitTransform="translate(-"+tx+"px) scale("+sx+","+sy+")";
    document.getElementById("GameHolder").style.OTransform="translate(-"+tx+"px) scale("+sx+","+sy+")";
    document.getElementById("GameHolder").style.msTransform="translate(-"+tx+"px) scale("+sx+","+sy+")";
    document.getElementById("GameHolder").style.MozTransform="translate(-"+tx+"px) scale("+sx+","+sy+")";
}

Gui.showLevelSelect = function showLevelSelect() {
    Gui.clearUI();
    document.getElementById("WrapsLevels").style.display = "block";
    var wrapsLevels = document.getElementById("WrapsLevels");
    var levels = Array();
    for (i = 1; i <= 12; i++) {
    	var completion = Storage.getLevelCompletion(i);
	var unlocked = Storage.isLevelUnlocked(i);
    	levels.push({ "order": i, "unlocked": unlocked, "completed": completion })
    }
    var levelRow;
    for (i = 0; i < levels.length; i++) {
        if (i % 6 == 0) {
            var levelRow = document.createElement("li")
            document.getElementById("Levels").appendChild(levelRow);
        }
        var level = document.createElement("a");
        levelRow.appendChild(level);
        if (levels[i].unlocked == 0) {
            level.setAttribute("class", "level disabled");
        }
        else {
            if (levels[i].completed == 0) {
                level.setAttribute("class", "level");
            }
            else {
                level.setAttribute("class", "level completed"+levels[i].completed);
            }
            level.onclick = (function (index){
		return function () {
		    	document.getElementById("canvas").style.display = "block";
                        Gui.clearUI();
                        init(index);};
                })(i+1);
        }
        level.innerHTML = levels[i].order;
    }
}
Gui.clearUI = function clearUI() {
    document.getElementById("Levels").innerHTML = "";
    document.getElementById("WrapsLevels").style.display = "none";
    document.getElementById("WrapsSettings").style.display = "none";
    document.getElementById("WrapsTitle").style.display = "none";
    document.getElementById("WrapsScoreScreen").style.display = "none";
    document.getElementById("WrapsPauseMenu").style.display = "none";
}
Gui.showTitleScreen = function showTitleScreen() {
    Gui.clearUI();
    document.getElementById("WrapsTitle").style.display = "block";
}
Gui.showPauseMenu = function showPauseMenu() {
    Gui.clearUI();
    document.getElementById("WrapsPauseMenu").style.display = "block";
    if(Storage.getSoundSettings("music") == 0){
        document.getElementById("PMToggleMusic").innerHTML = "Music is Off";
    } else {
        document.getElementById("PMToggleMusic").innerHTML = "Music is On";
    }
    
    if(Storage.getSoundSettings("sfx") == 0){
        document.getElementById("PMToggleSFX").innerHTML = "SFX is Off";
    } else {
        document.getElementById("PMToggleSFX").innerHTML = "SFX is On";
    }
}
Gui.showSettings = function showSettings() {
    Gui.clearUI();
    document.getElementById("WrapsSettings").style.display = "block";
    document.getElementById("Reset").setAttribute("class","title-button");
    
    if(Storage.getSoundSettings("music") == 0){
        document.getElementById("ToggleMusic").innerHTML = "Music is Off";
    } else {
        document.getElementById("ToggleMusic").innerHTML = "Music is On";
    }
    
    if(Storage.getSoundSettings("sfx") == 0){
        document.getElementById("ToggleSFX").innerHTML = "SFX is Off";
    } else {
        document.getElementById("ToggleSFX").innerHTML = "SFX is On";
    }
}
Gui.showScoreScreen = function showScoreScreen() {
    Gui.clearUI();
    devResetStats();
    document.getElementById("WrapsScoreScreen").style.display = "block";
    setTimeout(function(){Gui.showStats()},200);
}
Gui.showStats = function showStats(){
    setTimeout(function(){Gui.animateKillRate(100);},1300);
    document.getElementById("ScoreScreenTest").setAttribute("onclick","devResetStats();");
    document.getElementById("ScoreScreenTest").innerHTML = "RESET";
    Gui.animateStats("Conclusion");
    setTimeout(function(){Gui.animateStats("KilledStats")},400);
    setTimeout(function(){Gui.animateStats("MissedStats")},800);
} 
Gui.animateStats = function animateStats(statsId)
{
    setTimeout(function(){Sound.playSFX(Sound.SFXConst.stats);},300);
    document.getElementById(statsId).className = "stats-box show";
    document.getElementById(statsId).style.bottom = "" + (400 - 115 * parseInt(document.getElementById(statsId).getAttribute("data-order")) || 1) + "px";
}
Gui.animateKillRate = function animateKillRate(currentPercentage)
{
    currentPercentage = parseInt(currentPercentage);
    var actualPercentage = document.getElementById("KRPercentage").innerHTML;
    actualPercentage = parseInt(actualPercentage.substr(0,actualPercentage.indexOf("%")));
    var int = setInterval(function() { 
        if(actualPercentage < currentPercentage)
        {
            if(currentPercentage >= 50 && actualPercentage < 50)
            {
                actualPercentage = 50;
                Sound.playSFX(Sound.SFXConst.stats);
                document.getElementById("KRStars").className = "s1";
            }
            else if(currentPercentage >= 75 && actualPercentage < 75)
            {
                actualPercentage = 75;
                Sound.playSFX(Sound.SFXConst.stats);
                document.getElementById("KRStars").className = "s2";
            }
            else if(currentPercentage == 100 && actualPercentage < 100)
            {
                actualPercentage = 100;
                Sound.playSFX(Sound.SFXConst.stats);
                document.getElementById("KRStars").className = "s3";
            }
            else
            {
                actualPercentage = currentPercentage;
            }
            document.getElementById("KRPercentage").innerHTML = actualPercentage + "%";
        }
        else
        {
            Sound.playSFX(Sound.SFXConst.stats);
            document.getElementById("ScoreScreenNav").style.display = "block"
            document.getElementById("WrapsScoreScreen").className = "winner";
            clearInterval(int);
        }
    },400);
}
function devResetStats(){
    document.getElementById("ScoreScreenTest").setAttribute("onclick","showStats();");
    document.getElementById("ScoreScreenTest").innerHTML = "End Level";
    document.getElementById("KilledStats").style.bottom = "-80px";
    document.getElementById("KilledStats").className = "stats-box";
    document.getElementById("MissedStats").style.bottom = "-80px";
    document.getElementById("MissedStats").className = "stats-box";
    document.getElementById("Conclusion").style.bottom = "-80px";
    document.getElementById("Conclusion").className = "stats-box";
    document.getElementById("KRPercentage").innerHTML = "0%";
    document.getElementById("KRStars").className = "";
    document.getElementById("ScoreScreenNav").style.display = "none"
    document.getElementById("WrapsScoreScreen").className = "";
}
Gui.updateKilledStats = function updateKilledStats(value) {
    document.getElementById("KilledStats").innerHTML = "You killed " + value + " koochas.";
}
Gui.updateMissedStats = function updateMissedStats(value) {
    document.getElementById("MissedStats").innerHTML = "You missed " + value + " times.";
}