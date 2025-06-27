let squad = "manage.html"


function openManageScreen(x) {
    window.open(squad, self)
    viewOptions(x)
}

function openSquad() {
    openManageScreen("squad")
}

function openStorage() {
    openManageScreen("storage")
}

function openResearch() {
    openManageScreen("research")
}

function openSettings() {
    window.open("settings.html", self) //settings page here i guess man idk
}

function goBack() {
    window.open("battle.html", self)
}



function viewOptions(x) {
    console.log(x)
}