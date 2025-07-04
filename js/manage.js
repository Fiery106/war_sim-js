let battle_screen = document.getElementById("battle-screen");
let map_columns = 5;
let map_rows = 5;
let content_names = [
    "Manage your squad", 
    "Organize your items", 
    "Develop research"
];
let factions = [
    "enemy",
    "ally",
    "none"
]

//the following variables change how the game will function
let max_resource = 10;
let max_power = 50;
let day_limit = 30;

let start_troop = 3;
let start_gold = 100;
let start_iron = 100;
let unit_price = 50; //how much should units cost per hire?
let squad_size = 24; //the max number of units you can hold

ready()



function ready() {
    let first_time = localStorage.getItem("IsFirstTime?")

    if (first_time == "true") {
        genMap()
    } else {
        showMap() 
    }
}

async function genMap() {
    let src1 = await fetchLandNames()
    let src2 = await fetchLandInfo()
    let map = [];
    let id = 0;

    for (let i = 0; i < map_columns * map_rows; i++) {
        //Man, I love randomly generated content
        const land_name = src1[Math.floor(Math.random() * src1.length)];
        const index = src1.indexOf(land_name);
        if (index !== -1) {
            src1.splice(index, 1)
        }

        const land_type = src2.type[Math.floor(Math.random() * src2.type.length)];
        const land_resource = src2.resource[Math.floor(Math.random() * src2.resource.length)];
        const land_amount = (Math.floor((Math.random() * max_resource)) * (Math.random() * src2.multiplier) + 1).toFixed(2);
        const land_power = Math.floor(Math.random() * max_power) + 1; 
        id++

        const land = {
            id: id,
            name: land_name,
            type: land_type,
            resource: land_resource,
            amount: land_amount,
            belongsTo: "",
            power: land_power,
            occupants: [],
            isCapital: false
        }
        
        if (land.id % map_columns == 1) { //this piece of code sets the starting positions for both sides
            land.belongsTo = factions[0];
        } else if (land.id % map_columns == 0) {
            land.belongsTo = factions[1];
        } else {
            land.belongsTo = factions[2];
        }

        if (land.id == 11 || land.id == 15) {
            land.isCapital = true;
            land.type = "Capital";
            land.power *= 2;
            land.amount *= 2;
        }
        
        map.push(land);
    }

    startGame()
    localStorage.setItem("MapData", JSON.stringify(map));
    showMap()
}

async function startGame() {
    let squad = [];
    let unit = await fetchUnitInfo();

    for (let j = 0; j < start_troop; j++) {
        squad.push(unit.soldier1);
    }

    localStorage.setItem("PlayerSquad", JSON.stringify(squad));
    localStorage.setItem("UnitPrice", unit_price);
    localStorage.setItem("PlayerGold", start_gold);
    localStorage.setItem("PlayerIron", start_iron);
    localStorage.setItem("GameDay", 1);

    updateHUD()
}



function showMap() {
    clearScreen()

    let num = 0;
    let div = document.createElement("div"); //#map
    let storedMap = JSON.parse(localStorage.getItem('MapData')); //array

    div.setAttribute("id", "map");

    for (let i = 0; i < map_columns; i++) {
        for (let j = 0; j < map_rows; j++) {
            const button = document.createElement("button") //.land-tile
            const name = document.createElement("h1"); //.land-name
            const type = document.createElement("h2"); //.land-type
            const info = document.createElement("div"); //.land-info
            const power = document.createElement("h3"); //.land-power
            const units = document.createElement("div"); //.land-units
            const unit1 = document.createElement("img"); //.unit
            const unit2 = document.createElement("img"); //.unit
            const res = document.createElement("img"); //.land-resource
            const amount = document.createElement("p"); //.land-amount

            button.classList.add("land-tile");
            if (storedMap[num].belongsTo == factions[0]) { //enemy
                button.classList.add(factions[0]);
            } else if (storedMap[num].belongsTo == factions[1]) { //ally
                button.classList.add(factions[1]);
            } else { //none
                button.classList.add(factions[2]);
            }
            
            name.classList.add("land-name", "land-text");
            type.classList.add("land-type", "land-text");
            info.classList.add("land-info");
            power.classList.add("land-power", "land-text");
            units.classList.add("land-units");
            unit1.classList.add("unit");
            unit2.classList.add("unit");
            res.classList.add("land-resource");
            amount.classList.add("land-amount", "land-text");

            name.textContent = storedMap[num].name;
            type.textContent = storedMap[num].type;
            power.textContent = storedMap[num].power;
            /*
            if (storedMap[num].occupants) { //!!!
                unit1.src = "images/hhh-funny-cat-face-v0-aic7sbhrv8pb1.webp"
                unit2.src = "images/hhh-funny-cat-face-v0-aic7sbhrv8pb1.webp"
            } */
            res.src = "images/hhh-funny-cat-face-v0-aic7sbhrv8pb1.webp" //replace with resource img!!!
            amount.textContent = storedMap[num].amount;
            /*
            button.onclick = function() {
                ?????????????
            };
            */
            units.append(unit1, unit2) //show units on the tile
            info.append(power, units, amount, res) //
            button.append(name, type, info)
            div.append(button) //add the land tile to the map

            num++
        }
    }

    updateMapInfo(storedMap)
    localStorage.setItem("MapData", JSON.stringify(storedMap))
    console.log(JSON.parse(localStorage.getItem("MapData")))
    battle_screen.append(div)
}

function updateMapInfo(x) { //MapData
    let enemy_captures = 0;
    let player_captures = 0;

    for (let i = 0; i < x.length; i++) {
        if (x[i].belongsTo == factions[0]) {
            enemy_captures++
        } else if (x[i].belongsTo == factions[1]) {
            player_captures++
        }
    }

    localStorage.setItem("PlayerCaptures", player_captures)
    localStorage.setItem("EnemyCaptures", enemy_captures)
}

function updateHUD() {
    let money = document.getElementById("money-curr");
    let troops = document.getElementById("troops-curr");
    let day = document.getElementById("day-curr");

    money.textContent = localStorage.getItem("PlayerGold");
    troops.textContent = localStorage.getItem("PlayerIron");
    day.textContent = `Day ${localStorage.getItem("GameDay")}/${day_limit}`;
}



async function openManageScreen(x) {
    clearScreen() //if we don't clear the screen, it will keep adding more menus stacked on top of each other

    let squad = JSON.parse(localStorage.getItem("PlayerSquad"));
    let unit = await fetchUnitInfo();
    let unit_price = localStorage.getItem("UnitPrice");

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

    if (squad.length) {
        for (let i = 0; i < squad.length; i++) {
            let unit = document.createElement("button");
            let stats = document.createElement("div");
            let name = document.createElement("h1");
            let img = document.createElement("img");
            let amount = document.createElement("p");
            let power = document.createElement("p");

            unit.classList.add("unit-display");
            stats.classList.add("unit-stats");
            name.classList.add("unit-name", "unit-text");
            img.classList.add("unit-image");
            amount.classList.add("unit-amount", "unit-text");
            power.classList.add("unit-power", "unit-text");

            unit.onclick = function() {
                //
            }

            name.textContent = squad[i].name;
            img.src = "images/hhh-funny-cat-face-v0-aic7sbhrv8pb1.webp"
            amount.textContent = `x${squad[i].amount}`;
            power.textContent = squad[i].power * squad[i].amount;

            stats.append(img, amount, power);
            unit.append(name, stats)
            content.append(unit)
        }
    } else {
        let text = document.createElement("h1");

        text.classList.add("unit-name", "unit-text");

        text.textContent = "There are no units to show here :("

        content.append(text)
    }
    


    hire_button.onclick = function() {
        let gold = Number(localStorage.getItem("PlayerGold"));
        let new_squad = JSON.parse(localStorage.getItem("PlayerSquad"));

        if (gold >= unit_price) {
            if (squad.length < squad_size) {
                let random = Math.floor(Math.random() * 3);

                if (random == 1) {
                    new_squad.push(unit.soldier1)
                } else if (random == 2) {
                    new_squad.push(unit.soldier2)
                } else {
                    new_squad.push(unit.soldier3)
                }
                
                gold -= unit_price
                unit_price += unit_price

                localStorage.setItem("PlayerSquad", JSON.stringify(new_squad));
                localStorage.setItem("UnitPrice", unit_price);
                localStorage.setItem("PlayerGold", gold);

                updateHUD()
                openManageScreen(0)
            }
        }
    }
    
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

function viewOptions(x, y, z) {
    //x = show type, y = h1 text, z = content taken from localStorage

    y.textContent = content_names[x]
}



function openSettings() {
    window.open("settings.html", "_self") //settings page here i guess man idk
}

function clearScreen() {
    battle_screen.innerHTML = ""
}

async function fetchLandNames() {
        let url = "json/land_names.json"
        let res = await fetch(url)
        let data = await res.json()
        return data.names
    }

async function fetchLandInfo() {
        let url = "json/map.json"
        let res = await fetch(url)
        let data = await res.json()
        return data.tiles
    }

async function fetchUnitInfo() {
        let url = "json/unit.json"
        let res = await fetch(url)
        let data = await res.json()
        return data.units
    }