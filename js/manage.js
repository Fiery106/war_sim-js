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
let max_resource = 20;
let max_power = 60;
let day_limit = 30;

let start_troop = 3;
let start_weapon = 0;
let start_gold = 100;
let start_iron = 100;
let enemy_troop = 3;
let enemy_weapon = 0;
let enemy_gold = 100;
let enemy_iron = 100;

let unit_price = 20; //how much should units cost per hire?
let price_increase = 20;
let weapon_price = 20; //how much should weapons cost?
let inventory_size = 8; //the max number of things you can hold at once

let turn_limit = 4;

let selected = 0;

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
            belongsTo: "none",
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
    let player_squad = [];
    let enemy_squad = [];
    let storage = [];
    let unit = await fetchUnitInfo();
    let weapon = await fetchWeaponInfo();

    for (let j = 0; j < start_troop; j++) {
        player_squad.push(unit[0]);
    }

    for (let j = 0; j < enemy_troop; j++) {
        enemy_squad.push(unit[0]);
    }

    for (let j = 0; j < start_weapon; j++) {
        storage.push(weapon[0]);
    }

    localStorage.setItem("PlayerSquad", JSON.stringify(player_squad));
    localStorage.setItem("EnemySquad", JSON.stringify(enemy_squad));
    localStorage.setItem("PlayerWeapon", JSON.stringify(weapon));
    localStorage.setItem("UnitPrice", unit_price);
    localStorage.setItem("EnemyPrice", unit_price);
    localStorage.setItem("WeaponPrice", weapon_price);
    localStorage.setItem("PlayerGold", start_gold);
    localStorage.setItem("PlayerIron", start_iron);
    localStorage.setItem("EnemyGold", enemy_gold);
    localStorage.setItem("EnemyIron", enemy_iron);
    localStorage.setItem("GameDay", 1);

    localStorage.setItem("TurnLimit", turn_limit);
    localStorage.setItem("IsCapitalAlive?", true);
    localStorage.setItem("IsEnemyCapitalDead?", false);
    localStorage.setItem("CurrentTurn", JSON.stringify(true));

    updateHUD()
}



function showMap() {
    clearScreen()

    let num = 0;
    let div = document.createElement("div"); //#map
    let storedMap = JSON.parse(localStorage.getItem('MapData')); //array

    console.log(storedMap)

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
            if (storedMap[num].occupants.length > 0) {
                power.textContent = storedMap[num].power + storedMap[num].occupants[0].power * storedMap[num].occupants[0].amount;
            }
            
            if (storedMap[num].occupants.length > 0) {
                if (storedMap[num].occupants.length == 1) {
                    unit1.src = "images/icons/soldier.png";
                } else if (storedMap[num].occupants.length == 2){
                    unit1.src = "images/icons/soldier.png";
                    unit2.src = "images/icons/soldier.png";
                }
            } 

            if (storedMap[num].resource == "Gold") {
                res.src = "images/icons/iron.png";
            } else if (storedMap[num].resource == "Iron") {
                res.src = "images/icons/money.png";
            }
            amount.textContent = storedMap[num].amount;


            let fix = storedMap[num];
            button.onclick = function() {
                checkLand(fix)
            };
            
            units.append(unit1, unit2) //show units on the tile
            info.append(power, units, amount, res) //
            button.append(name, type, info)
            div.append(button) //add the land tile to the map

            num++
        }
    }

    updateMapInfo(storedMap)
    localStorage.setItem("MapData", JSON.stringify(storedMap))
    battle_screen.append(div)
}

function checkLand(x) { //x is storedMap
    if (localStorage.getItem("IsEnemyCapitalDead?") == "false") {
        if (x.belongsTo == "ally") {
            showLand(x)
        } else { //+1, -1, +5, -5
            let storedMap = JSON.parse(localStorage.getItem("MapData"));
            let fix = x.id - 1
            if (storedMap[fix + 1] ||
                storedMap[fix - 1] ||
                storedMap[fix + 5] ||
                storedMap[fix - 5]) {
                if (storedMap[fix + 1].belongsTo == "ally" ||
                    storedMap[fix - 1].belongsTo == "ally" ||
                    storedMap[fix + 5].belongsTo == "ally" ||
                    storedMap[fix - 5].belongsTo == "ally") {
                        showLand(x)
                    }
            } else {
                //SHOW ERROR MESSA>GE 
            }
        }
    }
}

function showLand(x) {
    if (Number(localStorage.getItem("TurnLimit")) > 0) {
        clearScreen()

        let div = document.createElement("div");
        let h1 = document.createElement("h1");
        let content = document.createElement("div");

        let flex = document.createElement("div");
        let flex2 = document.createElement("div");
        let row = document.createElement("div");
        let back = document.createElement("p");
        let send = document.createElement("p");
        let back_button = document.createElement("button");
        let send_button = document.createElement("button");
        

        div.setAttribute("id", "content-header");
        row.setAttribute("id", "selected");
        h1.setAttribute("id", "content-head");
        content.setAttribute("id", "content"); 

        flex.setAttribute("id", "button-field");
        flex2.setAttribute("id", "button-field");
        back_button.classList.add("back-button");
        send_button.classList.add("back-button");
        back.classList.add("button-text");
        send.classList.add("button-text")

        back.textContent = "Back";
        h1.textContent = `Send units to ${x.name}. Power level: ${x.power}`;
        if (x.occupants.length > 0) {
            h1.textContent = `Send units to ${x.name}. Power level: ${x.power + x.occupants[0].power * x.occupants[0].amount}`;
        }

        send.textContent = `Select`;
        viewSquad(content, "", true, row, x.id - 1)
        

        back_button.onclick = function() {
            doUnits("back")
            showMap()
        };

        send_button.onclick = function() {
            doUnits("send", x.id - 1)
            showMap()
        }

        back_button.append(back)
        send_button.append(send)
        flex.append(back_button)
        flex2.append(send_button)
        div.append(h1, content, flex, row, flex2)

        battle_screen.append(div) 
    }
}

function fightLand(x, y) {
    let ally_power = y.power * y.amount;
    let enemy_power = x.power;
    if (x.occupants.length > 0) {
        enemy_power += x.occupants[0].power
    }
    let turns = localStorage.getItem("TurnLimit")

    if (x.belongsTo == "none") {
        ally_power *= 2;
    } else if (x.belongsTo == "ally") {
        x.occupants.push(y);
    }

    let range = ally_power + enemy_power;
    let random = Math.floor(Math.random() * range);

    if (x.belongsTo == "enemy" || x.belongsTo == "none") {
        if (random <= enemy_power) {
            x.occupants = x.occupants;

            y.amount -= 5;
            x.power -= y.power;
            if (x.isCapital) {
                x.power -= 1;
            }
        } else {
            x.belongsTo = "ally";
            if (x.isCapital) {
                localStorage.setItem("IsEnemyCapitalDead?", true);
                advanceDay()
            }
            x.occupants.push(y);
            y.amount -= 1;
        }
    }

    turns -= 1
    localStorage.setItem("TurnLimit", turns)
}

function doUnits(x, y = 0) {
    let squad = JSON.parse(localStorage.getItem("PlayerSquad"));
    let storedMap = JSON.parse(localStorage.getItem("MapData"));

    for (let i = 0; i < squad.length; i++) {
        if (x == "back") {
            squad[i].selected = false;
        } else if (x == "send") {
            if (storedMap[y].occupants.length < 1) {
                if (squad[i].selected) {
                    squad[i].exhausted = true;
                    squad[i].selected = false;

                    fightLand(storedMap[y], squad[i])
                }
            } else {
                squad[i].selected = false;
            }
        } else if (x == "fire") {
            const index = squad.indexOf(squad[i]);
            if (index !== -1) {
                squad.splice(index, 1)
            }
            squad[i].selected = false;
        }
    } 
    
    localStorage.setItem("MapData", JSON.stringify(storedMap))
    localStorage.setItem("PlayerSquad", JSON.stringify(squad))
    selected = 0;
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
    let iron = document.getElementById("troops-curr");
    let day = document.getElementById("day-curr");

    money.textContent = Number(localStorage.getItem("PlayerGold")).toFixed(2);
    iron.textContent = Number(localStorage.getItem("PlayerIron")).toFixed(2);
    day.textContent = `Day ${localStorage.getItem("GameDay")}/${day_limit}`;
}



async function enemyMove() {
    let enemy_gold = Number(localStorage.getItem("EnemyGold"));
    let enemy_iron = Number(localStorage.getItem("EnemyIron"));
    let enemy_squad = JSON.parse(localStorage.getItem("EnemySquad"));
    let enemy_price = Number(localStorage.getItem("EnemyPrice"));

    let unit = await fetchUnitInfo()

    let options = [
        "Protect",
        "Protect",
        "Attack",
        "Attack",
        "Attack"
    ]

    setTimeout(() => {
        if (enemy_price < enemy_gold) {
            enemy_squad.push(unit[Math.floor(Math.random() * unit.length)])

            enemy_gold -= enemy_price;
            enemy_price += price_increase;

            localStorage.setItem("EnemyGold", enemy_gold);
            localStorage.setItem("EnemyPrice", enemy_price);
            localStorage.setItem("EnemySquad", JSON.stringify(enemy_squad))
        }
        for (let i = 0; i < turn_limit; i++) {
            let random = Math.floor(Math.random() * options.length);
            //console.log(options[random])
        }

        console.log(enemy_squad)
    }, 1000);

}



async function openManageScreen(x) {
    if (localStorage.getItem("IsEnemyCapitalDead?") == "false") {
        clearScreen() //if we don't clear the screen, it will keep adding more menus stacked on top of each other
        doUnits("back")

        let unit_price = Number(localStorage.getItem("UnitPrice"));
        let weapon_price = Number(localStorage.getItem("WeaponPrice"));

        let div = document.createElement("div");
        let h1 = document.createElement("h1");
        let content = document.createElement("div");

        let flex2 = document.createElement("div");
        let row = document.createElement("div");
        let send = document.createElement("p");
        let send_button = document.createElement("button");

        let flex = document.createElement("div");
        let back = document.createElement("p");
        let hire = document.createElement("p");
        let back_button = document.createElement("button");
        let hire_button = document.createElement("button");
        

        div.setAttribute("id", "content-header");
        h1.setAttribute("id", "content-head");
        content.setAttribute("id", "content"); //flex

        row.setAttribute("id", "selected");
        flex2.setAttribute("id", "button-field");

        flex.setAttribute("id", "button-field");
        back_button.classList.add("back-button");
        hire_button.classList.add("back-button"); //this might seem confusing, but we're just copy-pasting the border styling
        back.classList.add("button-text");
        hire.classList.add("button-text");

        send_button.classList.add("back-button");
        send.classList.add("button-text");

        back.textContent = "Back";
        h1.textContent = content_names[x];
        send.textContent = `Fire`;

        if (x == 0) { //Manage your squad
            hire.textContent = `Hire (cost: ${unit_price})`;

            viewSquad(content, hire_button, false, row)
        } else if (x == 1) { //Store your items
            hire.textContent = `Buy (cost: ${weapon_price})`;

            viewStorage(content, hire_button)
        } else { //Research

        }
        

        back_button.onclick = function() {
            showMap()
        };

        send_button.onclick = function() {
            let squad = JSON.parse(localStorage.getItem("PlayerSquad"));
            let gold = Number(localStorage.getItem("PlayerGold"));

            for (let i = 0; i < squad.length; i++) {
                if (squad[i].selected) {
                    const index = squad.indexOf(squad[i]);
                    if (index !== -1) {
                        squad.splice(index, 1)
                        gold += price_increase;
                    }
                } localStorage.setItem("PlayerSquad", JSON.stringify(squad));
                localStorage.setItem("PlayerGold", gold);
            }
            showMap()
            updateHUD()
        }

    /* 
        I was going to write how the previous code I wrote ended up completely breaking the onclick functions,
        but that was using "innerHTML" and "outerHTML", which converts them into strings, making them useless
        This solution should not have any problems, although it is a little weird how that happened

        💖 I despise this language 💖
    */
        back_button.append(back)
        hire_button.append(hire)
        send_button.append(send)
        flex.append(hire_button, back_button)
        flex2.append(send_button)
        div.append(h1, content, flex, row, flex2)

        battle_screen.append(div) //actually makes all of this show up lmao
        }
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



async function viewSquad(x, y = "", z = false, k = "", l = 0) {
    let storedMap = JSON.parse(localStorage.getItem("MapData"));
    
    let squad = JSON.parse(localStorage.getItem("PlayerSquad"));
    let unit = await fetchUnitInfo();
    let unit_price = Number(localStorage.getItem("UnitPrice"));

    if (squad.length) {
        for (let i = 0; i < squad.length; i++) {
            let unit = document.createElement("button");
            let stats = document.createElement("div");
            let name = document.createElement("h1");
            let img = document.createElement("img");
            let amount = document.createElement("p");
            let power = document.createElement("p");

            unit.classList.add("icon-display");
            stats.classList.add("icon-stats");
            name.classList.add("icon-name", "icon-text");
            img.classList.add("icon-image");
            amount.classList.add("icon-amount", "icon-text");
            power.classList.add("icon-power", "icon-text");

            name.textContent = squad[i].name;
            img.src = "images/icons/soldier.png"
            amount.textContent = `x${squad[i].amount}`;
            power.textContent = squad[i].power * squad[i].amount;

            if (z == false) {
                if (squad[i].selected) {
                    stats.append(img, amount, power);
                    unit.append(name, stats)
                    k.append(unit)
                } else {
                    stats.append(img, amount, power);
                    unit.append(name, stats)
                    x.append(unit)
                }

                unit.onclick = function() {
                    squad[i].selected = true;
                    localStorage.setItem("PlayerSquad", JSON.stringify(squad));
                    //openManageScreen(0);
                }
            } else {
                if (!squad[i].selected && selected < 1) { 
                    unit.onclick = function() {
                        squad[i].selected = true;
                        selected++
                        localStorage.setItem("PlayerSquad", JSON.stringify(squad))
                        showLand(storedMap[l])
                    }
                } else if (squad[i].selected && selected > 0) {
                    unit.onclick = function() {
                        squad[i].selected = false;
                        selected--
                        localStorage.setItem("PlayerSquad", JSON.stringify(squad))
                        showLand(storedMap[l])
                    }
                }
            }

            if (z) {
                if (squad[i].selected) {
                    stats.append(img, amount, power);
                    unit.append(name, stats)
                    k.append(unit)
                } else if (!squad[i].exhausted) {
                    stats.append(img, amount, power);
                    unit.append(name, stats)
                    x.append(unit)
                }
            }
        }
    }

    y.onclick = function() {
        let gold = Number(localStorage.getItem("PlayerGold"));
        let new_squad = squad;

        if (gold >= unit_price) {
            if (squad.length < inventory_size) {
                new_squad.push(unit[Math.floor(Math.random() * unit.length)])
                    
                gold -= unit_price
                unit_price += price_increase

                localStorage.setItem("PlayerSquad", JSON.stringify(new_squad));
                localStorage.setItem("UnitPrice", unit_price);
                localStorage.setItem("PlayerGold", gold);

                updateHUD()
                openManageScreen(0)
            }
        }
    }
}


async function viewStorage(x, y) {
    let storage = JSON.parse(localStorage.getItem("PlayerWeapon"));
    let weapon = await fetchWeaponInfo();
    let weapon_price = Number(localStorage.getItem("WeaponPrice"));

    if (storage.length) {
        for (let i = 0; i < storage.length; i++) {
            let weapon = document.createElement("button");
            let stats = document.createElement("div");
            let name = document.createElement("h1");
            let img = document.createElement("img");
            let power = document.createElement("p");

            weapon.classList.add("icon-display");
            stats.classList.add("icon-stats");
            name.classList.add("icon-name", "icon-text");
            img.classList.add("icon-image");
            power.classList.add("icon-power", "icon-text");

            weapon.onclick = function() {
                //
            }

            name.textContent = storage[i].name;
            img.src = "images/icons/gun.png"
            power.textContent = storage[i].power;

            stats.append(img, power);
            weapon.append(name, stats)
            x.append(weapon)
        }
    } else {
        let text = document.createElement("h1");

        text.classList.add("icon-name", "icon-text");

        text.textContent = "There are no weapons to show here :("

        x.append(text)
    }

    y.onclick = function() {
        let iron = Number(localStorage.getItem("PlayerIron"));
        let new_weapon = storage;

        if (iron >= weapon_price) {
            if (storage.length < inventory_size) {
                new_weapon.push(weapon[Math.floor(Math.random() * weapon.length)])
                    
                iron -= weapon_price
                weapon_price += price_increase

                localStorage.setItem("PlayerWeapon", JSON.stringify(new_weapon));
                localStorage.setItem("WeaponPrice", weapon_price);
                localStorage.setItem("PlayerIron", iron);

                updateHUD()
                openManageScreen(1)
            }
        }
    }
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

async function fetchWeaponInfo() {
        let url = "json/weapon.json"
        let res = await fetch(url)
        let data = await res.json()
        return data.weapons
    }