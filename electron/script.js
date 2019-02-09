const { ipcRenderer } = require("electron");
let images, tags;



ipcRenderer.on("tags", (event, e) => {
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
    images = e;
    update_images("all")

    $("#library_information").on("click", e => {
        let size = 0;
        images.map(i => size+=i.size)
        alert(`Your library consists of ${images.length} images, blocking ${Math.round(size)}MB of diskspace.`)
    })

})




const update_images = (tag, p) => {
    tag = (tag.target ? tag.target.innerHTML : tag)
    let filtered_images = (tag != 'all' ? images.filter(i => i.tags.includes(tag)) : images)
    if(p) filtered_images = images.filter(i => i[p])
    document.getElementById("view").innerHTML = ""
    document.getElementById("view-header").innerHTML = `(${filtered_images.length}) ` + tag.toUpperCase().replace(/_/g, " ")

    filtered_images.forEach(t => {
        let listEntry = document.createElement("div");
        listEntry.id = t.id;
        listEntry.setAttribute("style", "background: url('" + t.path + "/" + t.filename + "') no-repeat center") 
        listEntry.classList = ["view-image"];

        let textEntry = document.createElement("div");
        textEntry.classList = ["view-image-text"];
        textEntry.innerHTML = `<span id='info-${t.id}' class='text-icon mdi mdi-information-outline'></span>` + t.id + `<span id='star-${t.id}' class='text-icon mdi mdi-star${t.starred ? "" : "-outline"}'></span><span id='full-${t.id}' class='full-icon mdi mdi-arrow-expand'></span>`;

        listEntry.append(textEntry)
        document.getElementById("view").append(listEntry);
    })

    $(".mdi-star-outline").on("click", e => {
        $(e.target).toggleClass("mdi-star")
        $(e.target).toggleClass("mdi-star-outline")
        images.filter(i => i.id == e.target.id.split("-")[1])[0].starred = !images.filter(i => i.id == e.target.id.split("-")[1])[0].starred;
        ipcRenderer.send("new_favorite", e.target.id.split("-")[1])
    })

    $(".mdi-information-outline").on("click", e => {
        let stats = images.filter(i => i.id == e.target.id.split("-")[1])[0]
        alert("This images wastes " + stats.size.toFixed(2) + `MB of your diskspace.\n\nPath to this image: ${stats.path}\n\nTags:${stats.tags.map(t => "\n" + t)}`)
    })

    $(".mdi-arrow-expand").on("click", e => {
        let tag = images.filter(i => i.id == e.target.id.split("-")[1])[0]
        let fullView = document.createElement("div");
        fullView.classList = ["full-view"];
        fullView.setAttribute("style", "background: url('" + tag.path + "/" + tag.filename + "') no-repeat center") 
        document.body.append(fullView)
        $(fullView).on("mousemove", e => {
            fullView.setAttribute("style", `background: url('${ tag.path + "/" + tag.filename }') no-repeat center;background-position: ${50-(window.innerWidth/4-e.clientX/2)/2}% ${50-(window.innerHeight/4-e.clientY/2)/2}%`)
        })
        $(fullView).on("click", e => {
            document.body.removeChild(e.target)
        })
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

    ipcRenderer.send("main_ready", true)
}

