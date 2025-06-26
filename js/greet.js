let greet = document.getElementById("greet");

getMessage()


async function getMessage() {
    let src = await fecthJson()
    let ms = Math.floor(Math.random() * src.length)

    greet.textContent = src[ms];
}

async function fecthJson() {
        let url = "json/greet.json"
        let res = await fetch(url)
        let data = await res.json()
        return data.greet
    }