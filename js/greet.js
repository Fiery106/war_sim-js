let greet = document.getElementById("greet");

getMessage()


async function getMessage() {
    let src = await fecthJson()

    //we get a random message from the array and display it on the screen
    //this way, we can just write whatever message we want displayed in the json and it'll likely show up
    let ms = Math.floor(Math.random() * src.length)

    greet.textContent = src[ms];
}

async function fecthJson() {
        let url = "json/greet.json"
        let res = await fetch(url)
        let data = await res.json()
        return data.greet
    }