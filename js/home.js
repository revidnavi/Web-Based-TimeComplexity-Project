import { API_URL } from '../config/frontend.js';
import { bubbleSort, mergeSort, binarySearch, linearSearch, fibonacciRecursive, fibonacciDP } from '../lib/algorithms.js';

document.getElementById("runButton").addEventListener("click", runAlgorithm);
document.getElementById("logoutButton").addEventListener("click", logout);

let algos = [];

loadAlgorithms();

async function loadAlgorithms() {
    const select = document.getElementById("algorithm");
    const result = await fetch(API_URL+"/get_algos.php");
    const data = await result.json();
    algos = data.data;
    if (algos.length === 0) return;

    for (let i = 0; i < algos.length; i++) {
        const option = document.createElement("option");
        option.value = i;
        option.textContent = algos[i].algo_name;
        select.appendChild(option);
    }
    document.getElementById("algoOptionPlaceholder").remove();
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

    document.getElementById("result").innerText = `
        Space Complexity: ${algos[algoIndex].space_complexity}
        Time Complexity: ${algos[algoIndex].time_avg}

        Space Used: ${space * 8} bytes
        Execution Time: ${time} ms
    `;

    const result = await fetch(API_URL+"/save_result.php", {
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

async function logout() {
    const result = await fetch(API_URL+"/logout.php");
    const data = await result.json();
    if (data.success) {
        window.location.href = "auth.html";
    }
}