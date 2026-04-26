import { API_URL } from '../conf/api.js';
import { bubbleSort, mergeSort, binarySearch, linearSearch, fibonacciRecursive, fibonacciDP } from '../lib/algorithms.js';
import { loginRedirect } from '../lib/util.js';

let algos = [];

loginRedirect("home.html");
loadAlgorithms();
showAdminButton();

document.getElementById("runButton").addEventListener("click", runAlgorithm);
document.getElementById("algorithm").addEventListener("change", updateComplexity);

async function loadAlgorithms() {
    const select = document.getElementById("algorithm");
    const result = await fetch(API_URL+"/home/get_active_algos.php");
    const response = await result.json();
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
        document.getElementById("admin-nav").style.display = "inline";
    }
}