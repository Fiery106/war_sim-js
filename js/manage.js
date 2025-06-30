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
    clearScreen() //if we don't clear the screen, we just keep adding more menus stacked on top of each other

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
    content.classList.add("content"); //flex

    flex.classList.add("button-field");
    back_button.classList.add("back-button");
    hire_button.classList.add("back-button"); //this might seem confusing, but we're just copy-pasting the border styling
    back.classList.add("button-text");
    hire.classList.add("button-text")

    back.textContent = "Back";
    hire.textContent = "Buy";
    //hire_button.onclick = ???
    back_button.onclick = function() {
        showMap()
    };
/* 
    I was going to write how the previous code I wrote ended up completely breaking the onclick functions,
    but that was using "innerHTML" and "outerHTML", which converts them into strings, making them useless
    This solution should not have any problems, although it is a little weird how that happened

    💖 I despise this language 💖
*/
    back_button.append(back)
    hire_button.append(hire)
    flex.append(hire_button, back_button)
    div.append(h1, content, flex)

    battle_screen.append(div) //actually makes all of this show up lmao

    viewOptions(x, h1, content) //
}



function openSquad() { //limits the manage screen selection to your homies <3
    openManageScreen(0)
}

function openStorage() { //here's where I would put my items, IF I HAD ANY
    openManageScreen(1)
}

function openResearch() { //WIP
    openManageScreen(2)
}


function openSettings() {
    window.open("settings.html", "_self") //settings page here i guess man idk
}



function viewOptions(x, y, z) {
    //x = show type, y = h1 text, z = content taken from localStorage

    if (x > -1) {
        y.textContent = content_names[x]
    }
}


function clearScreen() {
    battle_screen.innerHTML = ""
}