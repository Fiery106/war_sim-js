function quitGame() {
    let menu = "main.html"

    window.open(menu, "_self")
}

function advanceDay() {
    let day = Number(localStorage.getItem("GameDay"));
    let gold = Number(localStorage.getItem("PlayerGold"));
    let iron = Number(localStorage.getItem("PlayerIron"));

    if (day < day_limit) {
        let map = JSON.parse(localStorage.getItem("MapData"));

        for (let i = 0; i < map.length; i++) {
            if (map[i].belongsTo == "ally") {
                if (map[i].resource == "Gold") {
                    gold += Number(map[i].amount);
                } else if (map[i].resource == "Iron") {
                    iron += Number(map[i].amount);
                }
            }   
        }

        localStorage.setItem("PlayerGold", gold);
        localStorage.setItem("PlayerIron", iron);

        day++
        localStorage.setItem("GameDay", day);
        updateHUD()
    } else {
        gameOver()
    }
}



function gameOver() {
    let game_over = localStorage.getItem("IsCapitalAlive?");
    let player_captures = Number(localStorage.getItem("PlayerCaptures"));

    if (game_over) {
        console.log("you died!")
    } else if (player_captures < (map_columns * map_rows) / 2) {
        console.log("the enemy conquered the whole continent!")
    }
}