let battle_screen = document.getElementById("battle-screen");

let content_names = [
    "Manage your squad", 
    "Organize your items", 
    "Develop research"
]

/*
ready()

function ready() {
    if (LOCALSTORAGE) {
        genMap()
    } else {
        showMap() 
    }
}

function genMap() {
    //CODE GOES HERE

    showMap()
}


            <div id="content-header">
                <h1 id="content-head"> <!-- Manage your squad -->
                    hello
                </h1>
                <p id="content-description">
                    Lorem ipsum dolor sit amet consectetur.
                </p>

            </div>
*/

function showMap() {
    battle_screen.innerHTML = ""
}

function openManageScreen(x) {
    clearScreen()

    let div = document.createElement("div");
    let h1 = document.createElement("h1");
    let content = document.createElement("div");

    let flex = document.createElement("div");
    let back = document.createElement("p");
    let hire = document.createElement("p");
    let back_button = document.createElement("button");
    let hire_button = document.createElement("button");
    

    div.classList.add("content-header");
    h1.classList.add("content-head");
    content.classList.add("content")

    flex.classList.add("button-field");
    back_button.classList.add("back-button");
    hire_button.classList.add("back-button");
    back.classList.add("button-text");
    hire.classList.add("button-text")

    h1.textContent = content_names[0];
    back.textContent = "Back";
    hire.textContent = "Buy";
    //hire_button.onclick = ???
    back_button.onclick = function() {
        showMap()
    };

    back_button.append(back)
    hire_button.append(hire)
    flex.append(hire_button, back_button)
    battle_screen.append(div)
    div.append(h1, content, flex)
    //battle_screen.innerHTML = div.outerHTML

    viewOptions(x, h1, content)
}

function openSquad() { //limits the manage screen selection to your homies <3
    openManageScreen(0)
}

function openStorage() {
    openManageScreen(1)
}

function openResearch() {
    openManageScreen(2)
}


function openSettings() {
    window.open("settings.html", "_self") //settings page here i guess man idk
}


function viewOptions(x, y, z) {
    //x = show type, y = h1 text, z = content taken from localStorage

    if (x) {
        y.textContent = content_names[x]
    }
}


function clearScreen() {
    battle_screen.innerHTML = ""
}