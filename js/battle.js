function quitGame() {
    let menu = "main.html"

    window.open(menu, "_self")
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