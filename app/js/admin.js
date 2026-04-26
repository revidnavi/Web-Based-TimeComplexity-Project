import { API_URL } from '../conf/api.js';
import { loginRedirect } from '../lib/util.js';
import { popupConfirm, popupMessage } from '../lib/popups.js';

loginRedirect("admin.html");
switchtoAlgoTab();

document.getElementById("dashboard-btn").addEventListener("click", switchtoDashboardTab);
document.getElementById("algorithms-btn").addEventListener("click", switchtoAlgoTab);
document.getElementById("new-algo-button").addEventListener("click", showAlgoForm);
document.getElementById("submit-algo").addEventListener("click", updateAlgo);

function switchtoAlgoTab() {
    loadAlgos();
    document.getElementById("dashboard").style.display = "none";
    document.getElementById("algos").style.display = "block"; 
}

function switchtoDashboardTab() {
    document.getElementById("algos").style.display = "none";
    document.getElementById("dashboard").style.display = "block"; 
}

function clearAlgoForm() {
    let algoForm = document.getElementById("algo-form");
    algoForm.querySelector("#algo-name").value = "";
    algoForm.querySelector("#category").value = "";
    algoForm.querySelector("#time-best").value = "";   
    algoForm.querySelector("#time-avg").value = "";   
    algoForm.querySelector("#time-worst").value = "";   
    algoForm.querySelector("#space-complexity").value = "";
    algoForm.querySelector("#algo-form-title").innerHTML = "Add new algorithm";
    algoForm.querySelector("#algo-id").value = "";
}

function showAlgoForm() {
    clearAlgoForm();
    document.getElementById("algo-form").style.display = "block"; 
}

function hideAlgoForm() {
    clearAlgoForm();
    document.getElementById("algo-form").style.display = "none"; 
}   

async function updateAlgo() {
    let algoName = document.getElementById("algo-name").value.trim();
    let category = document.getElementById("category").value.trim();   
    let timeBest = document.getElementById("time-best").value.trim();   
    let timeAvg = document.getElementById("time-avg").value.trim();   
    let timeWorst = document.getElementById("time-worst").value.trim();   
    let spaceComplexity = document.getElementById("space-complexity").value.trim();
    let algoID = document.getElementById("algo-id").value.trim();
    let active = document.getElementById("algo-active").checked;

    let result = await fetch(API_URL+"/admin/update_algo.php", {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({
            algoID,
            algoName,
            category,
            timeBest,
            timeAvg,
            timeWorst,
            spaceComplexity,
            active
        })
    });
    let response = await result.json();
    console.log(response);

    if (response.success) {
        popupMessage(response.message);
        hideAlgoForm();
        loadAlgos();
    }
}

async function loadAlgos() {
    const result = await fetch(API_URL+"/get_algos.php");
    const response = await result.json();
    console.log(response);

    let algos = response.data;

    let algosContainer = document.getElementById("algos-container");
    let algoCardTemplate = document.getElementById("algo-card-template");
    let algoForm = document.getElementById("algo-form");

    algosContainer.innerHTML = "";
    if (algos.length === 0) return;

    for (let i = 0; i < algos.length; i++) {

        let algo = algos[i];
        let algoCard = algoCardTemplate.content.cloneNode(true);

        algoCard.querySelector(".algo-name").textContent = algo.algo_name;
        algoCard.querySelector(".category").textContent = algo.category;
        algoCard.querySelector(".time-best").textContent = algo.time_best;
        algoCard.querySelector(".time-avg").textContent = algo.time_avg;
        algoCard.querySelector(".time-worst").textContent = algo.time_worst;
        algoCard.querySelector(".space-complexity").textContent = algo.space_complexity;
        algoCard.querySelector(".active").textContent = "Active:" + (algo.active == "1");

        algoCard.querySelector(".edit-algo").addEventListener("click", () => {

            showAlgoForm();

            algoForm.querySelector("#algo-form-title").innerHTML = "Edit algorithm";
            algoForm.querySelector("#algo-id").value = algo.id;
            algoForm.querySelector("#algo-name").value = algo.algo_name;
            algoForm.querySelector("#category").value = algo.category;
            algoForm.querySelector("#time-best").value = algo.time_best;
            algoForm.querySelector("#time-avg").value = algo.time_avg;
            algoForm.querySelector("#time-worst").value = algo.time_worst;
            algoForm.querySelector("#space-complexity").value = algo.space_complexity;
            algoForm.querySelector("#algo-active").checked = (algo.active == "1");
        });

        algoCard.querySelector(".delete-algo").addEventListener("click", async () => {
            let confirmedDelete = await popupConfirm("Are you sure you want to delete this algorithm?");

            if (!confirmedDelete) return;
            
            let result = await fetch(API_URL+"/admin/delete_algo.php", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    algoID: algo.id
                })
            });
            let response = await result.json();
            console.log(response);

            if (response.success) {
                popupMessage("Algorithm deleted");
                loadAlgos();
            }
        });

        algosContainer.appendChild(algoCard);
    }
}