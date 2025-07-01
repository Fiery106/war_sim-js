let battle_screen = document.getElementById("battle-screen");
let map_columns = 5;
let map_rows = 5;

let content_names = [
    "Manage your squad", 
    "Organize your items", 
    "Develop research"
]

showMap()

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
*/

async function showMap() {
    clearScreen()

    let div = document.createElement("div"); //#map
    
    div.setAttribute("id", "map");

    for (let i = 0; i < map_columns; i++) {
        for (let j = 0; j < map_rows; j++) {
            let button = document.createElement("button") //.land-tile
            let name = document.createElement("h1"); //.land-name
            let type = document.createElement("h2"); //.land-type
            let info = document.createElement("div"); //.land-info
            let power = document.createElement("h3"); //.land-power
            let units = document.createElement("div"); //.land-units
            let unit1 = document.createElement("img"); //.unit
            let unit2 = document.createElement("img"); //.unit
            let res = document.createElement("img"); //.land-resource
            let src = await fecthJson()

            button.classList.add("land-tile");
            name.classList.add("land-name");
            type.classList.add("land-type");
            info.classList.add("land-info");
            power.classList.add("land-power");
            units.classList.add("land-units");
            unit1.classList.add("unit");
            unit2.classList.add("unit");
            res.classList.add("land-resource");

            name.textContent = src[Math.floor(Math.random() * src.length)];
            type.textContent = "Type";
            power.textContent = "99";
            unit1.src = "images/hhh-funny-cat-face-v0-aic7sbhrv8pb1.webp"
            unit2.src = "images/hhh-funny-cat-face-v0-aic7sbhrv8pb1.webp"
            res.src = "images/hhh-funny-cat-face-v0-aic7sbhrv8pb1.webp"
            /*
            button.onclick = function() {
                ?????????????
            };
            */
            units.append(unit1, unit2) //show units on the tile
            info.append(power, units, res) //
            button.append(name, type, info)
            div.append(button) //add the land tile to the map
        }
    }

    battle_screen.append(div)
}



function openManageScreen(x) {
    clearScreen() //if we don't clear the screen, it will keep adding more menus stacked on top of each other

    let div = document.createElement("div");
    let h1 = document.createElement("h1");
    let content = document.createElement("div");

    let flex = document.createElement("div");
    let back = document.createElement("p");
    let hire = document.createElement("p");
    let back_button = document.createElement("button");
    let hire_button = document.createElement("button");
    

    div.setAttribute("id", "content-header");
    h1.setAttribute("id", "content-head");
    content.setAttribute("id", "content"); //flex

    flex.setAttribute("id", "button-field");
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

    y.textContent = content_names[x]
    
    //
}


function clearScreen() {
    battle_screen.innerHTML = ""
}

async function fecthJson() {
        let url = "json/land_names.json"
        let res = await fetch(url)
        let data = await res.json()
        return data.names
    }