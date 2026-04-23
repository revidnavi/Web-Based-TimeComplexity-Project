import { API_URL } from '../conf/api.js';
import { loginRedirect } from '../lib/util.js';

loginRedirect("auth.html");
showLogin();

const MINIMUM_PASSWORD_LENGTH = 8;

document.getElementById("gotoLogin").addEventListener("click",showLogin);
document.getElementById("gotoSignup").addEventListener("click",showSignup);

document.getElementById("loginButton").addEventListener("click",login);
document.getElementById("sendCodeButton").addEventListener("click",requestEmailCode);
document.getElementById("signupButton").addEventListener("click",signup);


function showSignup() {
    document.getElementById("loginForm").style.display = "none";
    document.getElementById("signupForm").style.display = "flex";
    document.getElementById("gotoLogin").classList.remove("active");
    document.getElementById("gotoSignup").classList.add("active");
}

function showLogin() {
    document.getElementById("signupForm").style.display = "none";
    document.getElementById("loginForm").style.display = "flex";
    document.getElementById("gotoSignup").classList.remove("active");
    document.getElementById("gotoLogin").classList.add("active");
}

async function requestEmailCode() {
    const email =  document.getElementById("signupEmail").value.trim();

    if (email === "") {
        console.log("empty email input"); // replace with popup
        return;
    }

    const result = await fetch(API_URL+"/auth/signup_code.php", {
        method: "POST",
        headers: {
            "Content-Type":
            "application/json"
        },
        body: JSON.stringify({
            email
        })
    });
    const data = await result.json();

    console.log(data);
}

async function signup() {
    const email =  document.getElementById("signupEmail").value.trim();
    const code =  document.getElementById("emailCode").value.trim();
    const pass0 =  document.getElementById("signupPass0").value.trim();
    const pass1 =  document.getElementById("signupPass1").value.trim();

    if (email === "") {
        console.log("empty email input"); // replace with popup
        return;
    }
    if (pass0 !== pass1) {
        console.log("mismatch password"); // replace with popup
        return;
    }
    if (pass0.length < MINIMUM_PASSWORD_LENGTH) {
        console.log("short password"); // replace with popup
        return;
    }

    const result = await fetch(API_URL+"/auth/signup.php", {
        method: "POST",
        headers: {
            "Content-Type":
            "application/json"
        },
        body: JSON.stringify({
            email, code, pass0
        })
    });
    const data = await result.json();

    console.log(data); // replace with popup (if successful or not)

    if (data.success === true) {
        document.getElementById("signupEmail").value = "";
        document.getElementById("emailCode").value = "";
        document.getElementById("signupPass0").value = "";
        document.getElementById("signupPass1").value = "";
    }
}

async function login() {
    const email =  document.getElementById("loginEmail").value.trim();
    const pass =  document.getElementById("loginPass").value.trim();

    const result = await fetch(API_URL+"/auth/login.php", {
        method: "POST",
        headers: {
            "Content-Type":
            "application/json"
        },
        body: JSON.stringify({
            email, pass
        })
    });
    const data = await result.json();

    console.log(data); // replace with popup (if successful or not)

    if (data.redirect) {
        window.location.href = data.redirect;
    }
}