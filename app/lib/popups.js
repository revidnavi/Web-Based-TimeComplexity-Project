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

        const containerPopup = node.querySelector(".popup-container")
        const textPopup = node.querySelector(".popup-content-container")
        const okButton = node.querySelector(".popup-confirm")       
        const cancelButton = node.querySelector(".popup-cancel")  

        textPopup.innerHTML = content

        okButton.onclick = () => {
            containerPopup.remove()
            resolve(true)
        }

        cancelButton.onclick = () => {
            containerPopup.remove()
            resolve(false)
        }

        document.body.appendChild(node)
    })
}



export function popupInput(content = "...") {

}