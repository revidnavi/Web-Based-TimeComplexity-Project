import { API_URL } from '../conf/api.js';
import { bubbleSort, mergeSort, binarySearch, linearSearch, fibonacciRecursive, fibonacciDP } from '../lib/algorithms.js';
import { loginRedirect } from '../lib/util.js';
import { popupConfirm } from '../lib/popups.js'

let algos = [];

let currentPage = 1;
let totalPages = 1;

document.addEventListener("DOMContentLoaded", async () => {   
    loginRedirect("home.html");
    await loadAlgorithms();
    showAdminButton();
    updateComplexity(); 
    document.getElementById("home-button").addEventListener("click", openHome);
    document.getElementById("profile-button").addEventListener("click", openProfile);
    document.getElementById("goToAnalyzer").addEventListener("click", showAnalyzer);
    document.getElementById("goToCharts").addEventListener("click", showCharts);
    document.getElementById("goToHistory").addEventListener("click", showHistory);
    document.getElementById("runButton").addEventListener("click", runAlgorithm);
    document.querySelector(".btn-clear").addEventListener("click", clearHistory);
    document.getElementById("algorithm").addEventListener("change", updateComplexity);

    initPagination();
});

showAnalyzer();

function openProfile() {
    window.location.href = 'account.html';
}

function openHome(){
    window.location.href = 'home.html';
}

function showAnalyzer() {
    document.getElementById("analyzer-page").style.display = "block";
    document.querySelector(".charts-page").style.display = "none";
    document.querySelector(".history-page").style.display = "none";
    document.getElementById("goToAnalyzer").classList.add("active");
    document.getElementById("goToCharts").classList.remove("active");
    document.getElementById("goToHistory").classList.remove("active");
}


function showCharts() {
    document.getElementById("analyzer-page").style.display = "none";
    document.querySelector(".charts-page").style.display = "block";
    document.querySelector(".history-page").style.display = "none";
    document.getElementById("goToAnalyzer").classList.remove("active");
    document.getElementById("goToCharts").classList.add("active");
    document.getElementById("goToHistory").classList.remove("active");
}

function initPagination() {
    document.getElementById("nextPage").addEventListener("click", () => {
        if (currentPage < totalPages) {
            loadHistory(currentPage + 1);
        }
    });

    document.getElementById("prevPage").addEventListener("click", () => {
        if (currentPage > 1) {
            loadHistory(currentPage - 1);
        }
    });
}

async function showHistory() {
    document.getElementById("analyzer-page").style.display = "none";
    document.querySelector(".charts-page").style.display = "none";
    document.querySelector(".history-page").style.display = "block";
    document.getElementById("goToAnalyzer").classList.remove("active");
    document.getElementById("goToCharts").classList.remove("active");
    document.getElementById("goToHistory").classList.add("active");


    currentPage = 1;
    await loadHistory(1);
}

async function loadHistory(page = 1) {
    const response = await fetch(`${API_URL}/home/get_result.php?page=${page}`);
    const result = await response.json();

    const tbody = document.getElementById("history-tbody");
    const count = document.getElementById("history-count");

    tbody.innerHTML = "";

    if (!result.success || !result.data.length) {
        tbody.innerHTML = `
            <tr>
                <td colspan="5" class="no-data">
                    No executions yet. Run Algorithm to see results.
                </td>
            </tr>
        `;
        count.textContent = 0;
        return;
    }

    currentPage = result.page;
    totalPages = result.pages;

    count.textContent = result.total;

    document.getElementById("pageNumber").innerText =
        `${currentPage} / ${totalPages}`;

    result.data.forEach(row => {
        const tr = document.createElement("tr");

        tr.innerHTML = `
            <td>${row.algo_name}</td>
            <td><span class="category-badge">${row.category}</span></td>
            <td>${row.input_size}</td>
            <td>${Number(row.execution_time).toFixed(3)} ms</td>
            <td>${new Date(row.created_at).toLocaleString()}</td>
        `;

        tbody.appendChild(tr);
    });

    document.getElementById("prevPage").disabled = currentPage === 1;
    document.getElementById("nextPage").disabled = currentPage === totalPages;
}

async function clearHistory() {
    const confirmed = await popupConfirm("Are you sure you want to clear all execution history?");
    console.log("Confirmed:", confirmed)
    if (!confirmed) return;


    const result = await fetch(API_URL + "/home/clear_result.php", {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        }
    });

    const data = await result.json();

    if (data.redirect) {
        window.location.href = data.redirect;
        return;
    }

    if (data.success) {
        await loadHistory(1);
    } else {
        console.log("Failed to clear history"); 
    }
}

async function loadAlgorithms() {
    const select = document.getElementById("algorithm");
    const result = await fetch(API_URL+"/home/get_active_algos.php");
    const response = await result.json();
    console.log(response);
    algos = response.data;
    if (algos.length === 0) return;

    for (let i = 0; i < algos.length; i++) {
        const option = document.createElement("option");
        option.value = i;
        option.textContent = algos[i].algo_name;
        select.appendChild(option);
    }
    document.getElementById("algoOptionPlaceholder").remove();
}

function updateComplexity() {
    let algoIndex = document.getElementById("algorithm").value;
    document.getElementById('complexityCard').style.display = "flex";
    document.getElementById('best-time').innerText = "Best: " + algos[algoIndex].time_best;
    document.getElementById('avg-time').innerText = "Average: " + algos[algoIndex].time_avg;
    document.getElementById('worst-time').innerText = "Worst: " + algos[algoIndex].time_worst;
    document.getElementById('space-complexity').innerText = algos[algoIndex].space_complexity;
}

async function runAlgorithm() {
    let algoIndex = document.getElementById("algorithm").value;
    
    let algoID = algos[algoIndex].id;
    let size = document.getElementById("size").value;
    let space = 0;
    let target = 0;

    let arr = Array.from({ length: size }, () => Math.random());
    let start = performance.now();

    switch (algos[algoIndex].algo_name) // IMPLEMENT ALGORITHMS AND THEIR SPACE ESTIMATE HERE IN SWITCH CASE ------------------------------------------
    {
    case "Bubble Sort":
        space = 1;
        bubbleSort(arr);
    break;
    case "Merge Sort":
        space = size;
        mergeSort(arr);
    break;
    case "Binary Search":
        space = 1;
        arr.sort((a, b)=> a - b);
        target = arr[Math.floor(Math.random()* arr.length)];
        binarySearch(arr, target);
    break;
    case "Linear Search":
        space = 1;
        target = arr[Math.floor(Math.random() * arr.length)];
        linearSearch(arr, target);
    break;
    case "Recursive Fibonacci":
        space = size;
        fibonacciRecursive(Math.min(size, 38));
    break;
    case "Dynamic Fibonacci":
        space = size;
        fibonacciDP(size);
    break;
    default:
        console.log("Algorithm not implented"); // replace with popup
    return;
    }

    let end = performance.now();
    let time = end - start;

    let resultd = `
        Space Complexity: ${algos[algoIndex].space_complexity}
        Time Complexity: ${algos[algoIndex].time_avg}

        Space Used: ${space * 8} bytes
        Execution Time: ${time} ms
    `;

    document.getElementById("resultsCard").style.display = "flex";

    document.getElementById("resultSize").innerText = size;
    document.getElementById("resultTime").innerText = time;
    document.getElementById("resultTimestamp").innerText = new Date().toLocaleString();

    const result = await fetch(API_URL+"/home/save_result.php", {
        method: "POST",
        headers: {
            "Content-Type":
            "application/json"
        },
        body: JSON.stringify({
            size, time, algoID, space
        })
    });
    const data = await result.json();

    if (data.redirect) {
        window.location.href = data.redirect;
    }

    console.log(data); // replace with popup (if successful or not)
}

async function showAdminButton() {
    const result = await fetch(API_URL+"/home/get_user_type.php");
    const response = await result.json();
    console.log(response);
    
    let data = response.data;

    if (data['user type'] == "admin") {
        const adminNav = document.getElementById("admin-nav");
        if (adminNav) {
            adminNav.style.display = "inline";
        }
    }
}