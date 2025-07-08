function quitGame() {
    let menu = "main.html"

    window.open(menu, "_self")
}

function advanceDay() {
    let day = Number(localStorage.getItem("GameDay"));
    let gold = Number(localStorage.getItem("PlayerGold"));
    let iron = Number(localStorage.getItem("PlayerIron"));
    let squad = JSON.parse(localStorage.getItem("PlayerSquad"));
    let storedMap = JSON.parse(localStorage.getItem("MapData"));

    let capital_alive = localStorage.getItem("IsCapitalAlive?");
    let capital_defeated = localStorage.getItem("IsEnemyCapitalDead?");

    if (capital_alive && capital_defeated) {
        for (let i = 0; i < squad.length; i++) {
            squad[i].exhausted = false;
            if (squad[i].amount <= 0) {
                const index = squad.indexOf(squad[i]);
                if (index !== -1) {
                    squad.splice(index, 1)
                }
            }
        } localStorage.setItem("PlayerSquad", JSON.stringify(squad));

        for (let i = 0; i < storedMap.length; i++) {
            storedMap[i].occupants = [];
        } localStorage.setItem("MapData", JSON.stringify(storedMap));

        if (day < day_limit - 1) {
            let map = JSON.parse(localStorage.getItem("MapData"));

            for (let i = 0; i < map.length; i++) {
                if (map[i].belongsTo == "ally") {
                    if (map[i].isCapital == true) {
                        gold += Number(map[i].amount);
                        iron += Number(map[i].amount);
                    } else {
                        if (map[i].resource == "Gold") {
                            gold += Number(map[i].amount);
                        } else if (map[i].resource == "Iron") {
                            iron += Number(map[i].amount);
                        }
                    }
                }   
            }

            localStorage.setItem("PlayerGold", gold);
            localStorage.setItem("PlayerIron", iron);

            day++
            localStorage.setItem("GameDay", day);
            localStorage.setItem("TurnLimit", 4)
            updateHUD()
            updateMapInfo(storedMap)
            showMap()
        } else {
            day = 30;
            localStorage.setItem("GameDay", day);
            gameOver()
        }

    } else {
        day = 30;
        localStorage.setItem("GameDay", day);
        gameOver()
    }
}



function gameOver() {
    let capital_alive = localStorage.getItem("IsCapitalAlive?");
    let capital_defeated = localStorage.getItem("IsEnemyCapitalDead?");
    let player_captures = Number(localStorage.getItem("PlayerCaptures"));

    if (capital_alive == false) {
        console.log("you died!")
    } else {
        if (capital_defeated == false) {
            console.log("You Win!")
        } else if (player_captures < (map_columns * map_rows) / 2) {
            console.log("the enemy conquered the whole continent!") 
        }
    }
}