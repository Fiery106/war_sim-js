function deleteFunc() {
    /*
    DELETE LOCALSTORAGE HERE!!
    */

    goBack()
}

function goBack() {
    let menu = "main.html"

    window.open(menu, "_self")
}


function playGame() {
    let game = "battle.html"

    /*
    If this is the first time playing, change some values for Localstorage. Otherwise, load up existing values.
    */

    window.open(game, "_self")
}

function showCredits() {
    let credits = "credits.html"

    window.open(credits, "_self")
}