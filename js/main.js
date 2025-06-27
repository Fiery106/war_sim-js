function deleteFunc() {
    /*
    DELETE LOCALSTORAGE HERE!!
    */

    goBack()
}

function goBack() {
    let menu = "main.html"

    window.open(menu, self)
}


function playGame() {
    let game = "battle.html"

    /*
    If this is the first time playing, change some values for Localstorage. Otherwise, load up existing values.
    */

    window.open(game, self)
}

function showCredits() {
    let credits = "credits.html"

    window.open(credits, self)
}