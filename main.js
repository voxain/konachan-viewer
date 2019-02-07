const electron      = require("electron");
const { ipcMain }   = require("electron");
const fs            = require("fs");

const config = require("./config.json")


let path = config.path;


let tags = []

class KonachanImage {
    constructor(filename){
        this.filename = filename;
        this.path = path;
        this.id = filename.split(" ")[2];
        this.tags = filename.replace(".jpg", "").split(" ");
        for(let i = 0; i < 3; i++) this.tags.shift();
    }
}


let files = fs.readdirSync(path);

files = files.filter(e => e.startsWith("Konachan.com") && !e.endsWith("sample.jpg"));

let images = []

files.forEach(e => {
    images.push(new KonachanImage(e))
})

images.forEach(e => {
    e.tags.forEach(t => {
        if(!tags.includes(t)) tags.push(t);
    })
})

tags.sort();


electron.app.on("ready", () => {
    let mainWindow = new electron.BrowserWindow();
    mainWindow.loadFile("electron/index.html");
    ipcMain.on("main_ready", () => {
        mainWindow.webContents.send("images", images)
        mainWindow.webContents.send("tags", tags)
    })
})