function deleteFunc() {
    localStorage.clear()

    goBack()
}

function goBack() {
    let menu = "main.html"

    window.open(menu, "_self")
}


function playGame() {
    let game = "battle.html"
    let first_time = localStorage.getItem("IsFirstTime?");

    if(!first_time) {
        localStorage.setItem("IsFirstTime?", true)
        first_time = localStorage.getItem("IsFirstTime?");
    } else {
        localStorage.setItem("IsFirstTime?", false)
        first_time = localStorage.getItem("IsFirstTime?");
    }

    window.open(game, "_self")
}

function showCredits() {
    let credits = "credits.html"

    window.open(credits, "_self")
}