import { API_URL } from '../config/front.js';
import { bubbleSort, mergeSort, binarySearch, linearSearch, fibonacciRecursive, fibonacciDP } from '../lib/algorithms.js';

document.getElementById("runButton").addEventListener("click", runAlgorithm);
document.getElementById("logoutButton").addEventListener("click", logout);

function getComplexity(algorithm) {
    const map = {
        bubble: { time: "O(n^2)", space: "O(1)" },
        merge: { time: "O(n log n)", space: "O(n)" },
        binary: { time: "O(log n)", space: "O(1)" },
        linear: { time: "O(n)", space: "O(1)" },
        recursive: { time: "O(2^n)", space: "O(n)"},
        dp: {time: "O(n)", space: "O(n)"}
    };
    return map[algorithm];
}

function estimateSpace(arr) {
    // Rough estimation: number of elements * 8 bytes(JS number)
    return arr.length * 8;
}

async function runAlgorithm() {
    let size = document.getElementById("size").value;
    let algo = document.getElementById("algorithm").value;
    let arr = Array.from({ length: size }, () => Math.random());

    let start = performance.now();
    if (algo === "bubble") {
        bubbleSort(arr);
    }
    else if (algo === "merge") {
        mergeSort(arr);
    }
    else if (algo === "binary") {
        arr.sort((a, b)=> a - b);
        let target = arr[Math.floor(Math.random()* arr.length)];
        binarySearch(arr, target);
    }
    else if (algo === "linear") {
        let target = arr[Math.floor(Math.random() * arr.length)];
        linearSearch(arr, target);
    }
    else  if (algo === "recursive") {
        fibonacciRecursive(Math.min(size, 38));
    }
    else if (algo === "dp") {
        fibonacciDP(size);
    }
    let end = performance.now();

    let time = end - start;
    let complexity = getComplexity(algo);
    let space = estimateSpace(arr);

    document.getElementById("result").innerText = `
        Execution Time: ${time} ms | Time
        Complexity: ${complexity.time} | Space
        Complexity: ${complexity.space} | Estimated
        Space Used: ${space} bytes
    `;

    const result = await fetch(API_URL+"/save_result.php", {
        method: "POST",
        headers: {
            "Content-Type":
            "application/json"
        },
        body: JSON.stringify({
            size, time, algo, space
        })
    });
    const data = await result.json();

    if (data.redirect) {
        window.location.href = data.redirect;
    }

    console.log(data); // replace with popup (if successful or not)
}

async function logout() {
    const result = await fetch(API_URL+"/login.php");
    const data = await result.json();
    if (data.success) {
        window.location.href = "auth.html";
    }
}