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
    document.getElementById("view-header").innerHTML = tag.toUpperCase().replace("_", " ")

    filtered_images.forEach(t => {
        let listEntry = document.createElement("img");
        listEntry.classList = ["view-image"];
        listEntry.src = t.path + "/" + t.filename;
        document.getElementById("view").append(listEntry);
    })
}

const load = () => {
    document.addEventListener("mousemove", e => {
        if(e.clientX < 30) document.getElementById("tag-list-o").classList.replace("hide", "unhide")
        else if(e.clientX >= (window.innerWidth / 100)*31) document.getElementById("tag-list-o").classList.replace("unhide", "hide")
    })
    
    document.getElementById("search").addEventListener("keydown", e => {
        document.getElementById("tag-list").innerHTML="";
        let tags_filtered = tags.filter(t => t.includes(e.target.value))
        tags_filtered.forEach(t => {
            let listEntry = document.createElement("div");
            listEntry.classList = ["tag-list-tag"];
            listEntry.innerHTML = t;
            listEntry.addEventListener("click", e => update_images(e));
            document.getElementById("tag-list").append(listEntry);
        })
    })
}