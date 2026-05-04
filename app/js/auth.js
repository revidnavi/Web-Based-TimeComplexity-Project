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
        showToast('Warning', "Please fill out empty fields.", "warning");
        return;
    }

    // showToast("We’ve sent a verification link to your email. Please check your inbox.", 'success');

    const result = await fetch(API_URL+"/auth/signup_code.php", {
        method: "POST",
        credentials: "include",
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
        showToast('Success',"We’ve sent a verification link to your email. Please check your inbox.", 'success');
    } 
    else if (response.success == false) {
        showToast('Warning', "Email is already taken.", 'warning');
        return;
    }
    else {
        showToast('Error', "Failed to send verification code. Please try again later.", 'error');
        return;
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
        showToast('Warning', "Email cannot be empty.", 'warning');
        return;
    }
    if (pass0 !== pass1) {
        showToast('Warning', "Passwords do not match.", 'warning');
        return;
    }
    if (pass0.length < MINIMUM_PASSWORD_LENGTH) {
        showToast('Warning', "Password must be at least ${MINIMUM_PASSWORD_LENGTH} characters long.", 'warning');
        return;
    }

    // showToast('Success', "Verifying code and creating account...Please wait.", 'success');

    const result = await fetch(API_URL+"/auth/signup.php", {
        method: "POST",
        credentials: "include",
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
        showToast('Success', "Account created successfully! You can now log in with your new account.", 'success');
    }
    else if (response.message == "Already registered") { 
        showToast('Warning', "This email is already registered. Please use a different email to sign up.", 'warning');
        return;
    }
    else {
        showToast('Error', "Failed to create account. Please try again.", 'error');
        return;
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

    if (email === "" && pass === "") {
        showToast('Warning', "Please fill out empty fields.", 'warning');
        return;
    }
    else if (email.length < 10) {
        showToast('Warning', "Invalid email length", 'warning');
        return;
    }
    else if (pass.length < MINIMUM_PASSWORD_LENGTH) {
        showToast('Warning', "Invalid password length", 'warning');
        return;
    }
   
    const result = await fetch(API_URL+"/auth/login.php", {
        method: "POST",
        credentials: "include",
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
        showToast('Error', "Login failed ", 'error');
        return;
    }

    if (response.redirect) {
        window.location.href = response.redirect;
    }
}