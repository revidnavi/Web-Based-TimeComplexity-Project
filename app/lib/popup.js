export function popupMessage(message = "...") {

  return new Promise((resolve) => {

    const existing = document.getElementById("dyci-popup");
    if (existing) existing.remove();

    const overlay = document.createElement("div"); 
    overlay.id = "dyci-popup";
    overlay.style =                                   // semi-transparent background
    `
      position: fixed;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      background: rgba(0,0,0,0.4);
      display: flex;
      align-items: center;
      justify-content: center;
      z-index: 9999;
    `;

    const popup = document.createElement("div"); 
    popup.style =                                      // the actual popup box
    `
      background: #fff;
      padding: 20px;
      border-radius: 6px;
      max-width: 400px;
      width: 90%;
      text-align: center;
      box-shadow: 0 4px 10px rgba(0,0,0,0.2);
    `; 
    popup.innerHTML =                                 // the content of the popup
    `
      <p style="margin-bottom: 15px;">${message}</p> 
      <button id="dyci-ok" style="
        padding: 6px 14px;
        border: none;
        background: #007bff;
        color: #fff;
        border-radius: 4px;
        cursor: pointer;
      ">
        OK
      </button>
    `;

    overlay.appendChild(popup);
    document.body.appendChild(overlay);

    function close() {
      overlay.remove();
      resolve();
    }

    popup.querySelector("#dyci-ok").onclick = close;

    overlay.onclick = (e) => {
      if (e.target === overlay) close();
    };

  });

}