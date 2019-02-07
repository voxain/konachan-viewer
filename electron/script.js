const { ipcRenderer } = require("electron");
let images, tags;


ipcRenderer.on("tags", (event, e) => {
    console.log(e)
    e.forEach(t => {
        let listEntry = document.createElement("div");
        listEntry.classList = ["tag-list-tag"];
        listEntry.innerHTML = t;
        listEntry.addEventListener("click", e => update_images(e));
        document.getElementById("tag-list").append(listEntry);
    })
    tags = e;
})

ipcRenderer.on("images", (event, e) => {
    console.log(e)
    e.forEach(t => {
        let listEntry = document.createElement("img");
        listEntry.classList = ["view-image"];
        listEntry.src = t.path + "/" + t.filename;
        document.getElementById("view").append(listEntry);
    })
    images = e;
})

ipcRenderer.send("main_ready", true)

const update_images = tag => {
    tag = (tag != 'all' ? tag.target.innerHTML : tag)
    let filtered_images = (tag != 'all' ? images.filter(i => i.tags.includes(tag)) : images)
    document.getElementById("view").innerHTML = ""

    filtered_images.forEach(t => {
        let listEntry = document.createElement("img");
        listEntry.classList = ["view-image"];
        listEntry.src = t.path + "/" + t.filename;
        document.getElementById("view").append(listEntry);
    })
}