const electron      = require("electron");
const { ipcMain }   = require("electron");
const fs            = require("fs");

const config = require("./config.json")


let path = config.path;



let tags = []
let images = []

let favorites = (fs.existsSync("favorites.json") ? JSON.parse(fs.readFileSync("favorites.json")) : {images: [], tags: []})

class KonachanImage {
    constructor(filename, cpath){
        this.filename = filename;
        this.path = cpath || path;
        this.id = filename.split(" ")[2];
        this.tags = filename.split(" ");
        this.size = fs.statSync(this.path + "/" + filename).size / 1e+6;
        this.tags.pop();
        for(let i = 0; i < 3; i++) this.tags.shift();
        this.starred = (favorites.images.includes(this.id) ? true : false);
    }
}


let files = fs.readdirSync(path);

files = files.filter(e => e.startsWith("Konachan.com") && !e.includes("sample"));




files.forEach(e => {
    let image = new KonachanImage(e);
    if(!images.includes(image))images.push(image);
})
const scanSubdirs = path => {
    fs.readdirSync(path).forEach(dir => {
        if(fs.lstatSync(path + "/" + dir).isDirectory()) {
            let scan = fs.readdirSync(path + "/" + dir);
            scan = scan.filter(e => e.startsWith("Konachan.com") && !e.endsWith("sample.jpg"));
            
            scan.forEach(e => {
                let image = new KonachanImage(e, path + "/" + dir)
                if(!images.includes(image))images.push(image)
            })
            scanSubdirs(path + "/" + dir)
        }
    })
}
scanSubdirs(path)


images.forEach(e => {
    e.tags.forEach(t => {
        if(!tags.includes(t)) tags.push(t);
    })
})

tags.sort();
images.sort(i => i.id)



electron.app.on("ready", () => {
    let mainWindow = new electron.BrowserWindow({
        webPreferences: {
            experimentalFeatures: true
        }
    });
    mainWindow.loadFile("electron/index.html");

    ipcMain.on("main_ready", () => {
        mainWindow.webContents.send("images", images)
        mainWindow.webContents.send("tags", tags)
    })

    ipcMain.on("new_favorite", (e, id) => {
        favorites.images.push(id);
        fs.writeFileSync("favorites.json", JSON.stringify(favorites))
    })
})