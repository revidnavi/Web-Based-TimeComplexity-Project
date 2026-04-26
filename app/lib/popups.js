let popupsLoaded = false

async function loadPopups() {
    if (popupsLoaded) return

    const res = await fetch("./assets/popups.html")
    const html = await res.text()

    document.body.insertAdjacentHTML("beforeend", html)

    popupsLoaded = true
}



export async function popupMessage(content = "...") {
    await loadPopups()

    const tpl = document.getElementById("popup-message")
    const node = tpl.content.cloneNode(true)

    const container = node.querySelector(".popup-container")  
    const ok = node.querySelector(".popup-confirm")

    node.querySelector(".popup-content-container").innerHTML = content

    ok.onclick = () => {
        container.remove()
    }

    document.body.appendChild(node)
}



export async function popupConfirm(content = "...") {
    await loadPopups()

    return new Promise((resolve) => {
        const tpl = document.getElementById("popup-confirm")
        const node = tpl.content.cloneNode(true)

        const container = node.querySelector(".popup-container")
        const text = node.querySelector(".popup-content-container")
        const ok = node.querySelector(".popup-confirm")       
        const cancel = node.querySelector(".popup-cancel")  

        text.innerHTML = content

        ok.onclick = () => {
            container.remove()
            resolve(true)
        }

        cancel.onclick = () => {
            container.remove()
            resolve(false)
        }

        document.body.appendChild(node)
    })
}



export function popupInput(content = "...") {

}