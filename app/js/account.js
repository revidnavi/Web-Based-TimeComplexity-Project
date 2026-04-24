import { API_URL } from '../conf/api.js';
import { loginRedirect } from '../lib/util.js';
import { popupMessage } from '../lib/popup.js';

document.getElementById("change-pass").addEventListener("click", openChangePasswordForm);
document.getElementById("cancel-button").addEventListener("click", closeChangePasswordForm);
document.getElementById("submit-pass").addEventListener("click", changePassword);
document.getElementById("logout").addEventListener("click", logout);

loginRedirect("account.html");
closeChangePasswordForm();
loadAccountInfo();

const MINIMUM_PASSWORD_LENGTH = 8;



function openChangePasswordForm() {
    document.getElementById("change-pass-form").style.display = "block";
}



function closeChangePasswordForm() {
    document.getElementById("change-pass-form").style.display = "none";
    document.getElementById("new-pass-0").value = "";
    document.getElementById("new-pass-1").value = "";
    document.getElementById("current-pass").value = "";
}



async function loadAccountInfo() {
    const result = await fetch(API_URL+"/account/info.php");
    const response = await result.json();
    console.log(response);
    if (response.success) {
        document.getElementById("email").value = response.data.email;
        document.getElementById("date").innerText = response.data.created_at;
    }
    else {
        window.location.href = "home.html";
    }
}



async function changePassword() {
    const currPass = document.getElementById("current-pass").value.trim();
    const pass0 =  document.getElementById("new-pass-0").value.trim();
    const pass1 =  document.getElementById("new-pass-1").value.trim();

    if (pass0 !== pass1) {
        popupMessage("Passwords do not match.");
        return;
    }
    if (pass0.length < MINIMUM_PASSWORD_LENGTH) {
        popupMessage(`Password must be at least ${MINIMUM_PASSWORD_LENGTH} characters long.`);
        return;
    }

    popupMessage("Changing password...<br><br>Please wait.");

    const result = await fetch(API_URL+"/account/change_pass.php", {
        method: "POST",
        headers: {
            "Content-Type":
            "application/json"
        },
        body: JSON.stringify({
            currPass, pass0
        })
    });
    const response = await result.json();
    console.log(response);
    
    if (response.success == true) {
        closeChangePasswordForm();
        popupMessage("Password changed successfully");
    }
    else if (response.message == "Incorrect password") { 
        popupMessage("Incorrect current password.");
    }
    else {
        popupMessage("Failed to change password.<br><br>Please try again.");
    }
}



async function logout() {
    const result = await fetch(API_URL+"/account/logout.php");
    const response = await result.json();
    if (response.success) {
        window.location.href = "auth.html";
    }
}