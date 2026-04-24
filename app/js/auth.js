import { API_URL } from '../conf/api.js';
import { loginRedirect } from '../lib/util.js';
// import { popupMessage } from '../lib/popup.js';
import { showToast } from '../lib/toast.js';

loginRedirect("auth.html");
showLogin();

const MINIMUM_PASSWORD_LENGTH = 8;

document.getElementById("gotoLogin").addEventListener("click",showLogin);
document.getElementById("gotoSignup").addEventListener("click",showSignup);

document.getElementById("loginButton").addEventListener("click",login);
document.getElementById("sendCodeButton").addEventListener("click",requestEmailCode);
document.getElementById("signupButton").addEventListener("click",signup);
document.getElementById("changeEmailButton").addEventListener("click", changeEmail)


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

function changeEmail() {
    document.getElementById("sendCodeButton").classList.remove("hidden");
    document.getElementById("verifyPanel").style.display = "none";
    document.getElementById("signupEmail").value = "";
    document.getElementById("emailCode").value = "";
    document.getElementById("signupEmail").focus();
}

async function requestEmailCode() {
    const email =  document.getElementById("signupEmail").value.trim();
    
    if (email === "") {
        showToast("Email cannot be empty.", "error");
        return;
    }

    showToast("Generating verification code and sending email...Please wait.", 'success');

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
    const response = await result.json();
    console.log(response);

    if (response.success == true) {
        showToast("Verification code sent to your email. Please check your inbox and enter the code to complete signup.", 'success');
    }
    else {
        showToast("Failed to send verification code. Please try again later.", 'error');
    }

    document.getElementById("verifyEmailLabel").textContent = `Verification code sent to ${email}`;
    document.getElementById("verifyPanel").style.display = "flex";
    document.getElementById("sendCodeButton").classList.add("hidden");
}

async function signup() {
    const email =  document.getElementById("signupEmail").value.trim();
    const code =  document.getElementById("emailCode").value.trim();
    const pass0 =  document.getElementById("signupPass0").value.trim();
    const pass1 =  document.getElementById("signupPass1").value.trim();

    if (email === "") {
        showToast("Email cannot be empty.", 'error');
        return;
    }
    if (pass0 !== pass1) {
        showToast("Passwords do not match.", 'error');
        return;
    }
    if (pass0.length < MINIMUM_PASSWORD_LENGTH) {
        showToast(`Password must be at least ${MINIMUM_PASSWORD_LENGTH} characters long.`, 'error');
        return;
    }

    showToast("Verifying code and creating account...Please wait.", 'success');

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
    const response = await result.json();
    console.log(response); // replace with popup (if successful or not)
    
    if (response.success == true) {
        showToast("Account created successfully! You can now log in with your new account.", 'success');
    }
    else if (response.message == "Already registered") { 
        showToast("This email is already registered. Please use a different email to sign up.", 'error');
    }
    else {
        showToast("Failed to create account. Please try again.", 'error');
    }

    if (response.success === true) {
        document.getElementById("sendCodeButton").classList.remove("hidden");
        document.getElementById("signupEmail").value = "";
        document.getElementById("emailCode").value = "";
        document.getElementById("signupPass0").value = "";
        document.getElementById("signupPass1").value = "";
        document.getElementById("verifyPanel").style.display = "none";
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
    const response = await result.json();
    console.log(response);

    if (response.success == false) {
        showToast("Login failed. Please check your email and password and try again.", 'error');
    }

    if (response.redirect) {
        window.location.href = response.redirect;
    }
}