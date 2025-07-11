function quitGame() {
    let menu = "main.html"

    window.open(menu, "_self")
}

function advanceDay() {
    let day = Number(localStorage.getItem("GameDay"));
    let storedMap = JSON.parse(localStorage.getItem("MapData"));

    let capital_alive = localStorage.getItem("IsCapitalAlive?");
    let capital_defeated = localStorage.getItem("IsEnemyCapitalDead?");
    let current_turn = JSON.parse(localStorage.getItem("CurrentTurn"));

    if (capital_alive == "true" && capital_defeated == "false") {
        if (current_turn) {
            localStorage.setItem("CurrentTurn", JSON.stringify(false));
            current_turn = JSON.parse(localStorage.getItem("CurrentTurn"));
            currTurn(current_turn)

            if (day < day_limit - 1) {
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
        }
    } else {
        day = 30;
        localStorage.setItem("GameDay", day);
        gameOver()
    }
}

function currTurn(x) {
    let player_gold = Number(localStorage.getItem("PlayerGold"));
    let player_iron = Number(localStorage.getItem("PlayerIron"));
    let player_squad = JSON.parse(localStorage.getItem("PlayerSquad"));
    let enemy_gold = Number(localStorage.getItem("EnemyGold"));
    let enemy_iron = Number(localStorage.getItem("EnemyIron"));
    let enemy_squad = JSON.parse(localStorage.getItem("EnemySquad"));

    let storedMap = JSON.parse(localStorage.getItem("MapData"));


    for (let i = 0; i < player_squad.length; i++) {
        if (player_squad) {
            player_squad[i].exhausted = false;
        }
        if (player_squad[i].amount <= 0) {
            const index = player_squad.indexOf(player_squad[i]);
            if (index !== -1) {
                player_squad.splice(index, 1)
            }
        }

        if (enemy_squad) {
            enemy_squad[i].exhausted = false;
        }
        if (enemy_squad[i].amount <= 0) {
            const index = enemy_squad.indexOf(enemy_squad[i]);
            if (index !== -1) {
                enemy_squad.splice(index, 1)
            }
        }
    } 

    localStorage.setItem("PlayerSquad", JSON.stringify(player_squad));
    localStorage.setItem("EnemySquad", JSON.stringify(enemy_squad));


    if (!x) {
        for (let i = 0; i < storedMap.length; i++) {
            storedMap[i].occupants = [];
        } 
        localStorage.setItem("MapData", JSON.stringify(storedMap));

        for (let i = 0; i < storedMap.length; i++) {
            if (storedMap[i].belongsTo == "ally") {
                if (storedMap[i].isCapital == true) {
                    player_gold += Number(storedMap[i].amount);
                    player_iron += Number(storedMap[i].amount);
                } else {
                    if (storedMap[i].resource == "Gold") {
                        player_gold += Number(storedMap[i].amount);
                    } else if (storedMap[i].resource == "Iron") {
                        player_iron += Number(storedMap[i].amount);
                    }
                }
            }   
        }

        localStorage.setItem("PlayerGold", player_gold);
        localStorage.setItem("PlayerIron", player_iron);
        localStorage.setItem("CurrentTurn", JSON.stringify(true))

    } else {
        for (let i = 0; i < storedMap.length; i++) {
            if (storedMap[i].belongsTo == "enemy") {
                if (storedMap[i].isCapital == true) {
                    enemy_gold += Number(storedMap[i].amount);
                    enemy_iron += Number(storedMap[i].amount);
                } else {
                    if (storedMap[i].resource == "Gold") {
                        enemy_gold += Number(storedMap[i].amount);
                    } else if (storedMap[i].resource == "Iron") {
                        enemy_iron += Number(storedMap[i].amount);
                    }
                }
            }   
        }

        localStorage.setItem("EnemyGold", enemy_gold);
        localStorage.setItem("EnemyIron", enemy_iron);
    }
}



function gameOver() {
    let capital_alive = localStorage.getItem("IsCapitalAlive?");
    let capital_defeated = localStorage.getItem("IsEnemyCapitalDead?");
    let player_captures = Number(localStorage.getItem("PlayerCaptures"));

    if (capital_alive == "false") {
        console.log("you died!")
    } else {
        if (capital_defeated == "true") {
            console.log("You Win!")
        } else if (player_captures < (map_columns * map_rows) / 2) {
            console.log("the enemy conquered the whole continent!") 
        }
    }
}