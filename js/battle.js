function quitGame() {
    let menu = "main.html"

    window.open(menu, "_self")
}

function advanceDay() {
    //

    let day = Number(localStorage.getItem("GameDay"));

    if (day < day_limit) {
        day++
        localStorage.setItem("GameDay", day);
        updateHUD()
    } else {
        gameOver()
    }
}



function gameOver() {
    let game_over = localStorage.getItem("IsCapitalAlive?")
    let player_captures = localStorage.getItem("PlayerCaptures")

    if (game_over) {
        console.log("you died!")
    } else if (player_captures < (map_columns * map_rows) / 2) {
        console.log("the enemy conquered the whole continent!")
    }
}