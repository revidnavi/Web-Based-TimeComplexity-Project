import { SAVERESULT_LINK, AUTHENTICATION_LINK, LOGOUT_LINK } from '../config.js';
import { checklogin } from '../lib/authenticate.js';

checklogin(AUTHENTICATION_LINK);

document.getElementById("runButton").addEventListener("click", runAlgorithm);
document.getElementById("logoutButton").addEventListener("click", logout);

function bubbleSort(arr) {
    let n = arr.length;
    for (let i = 0; i < n; i++) {
        for (let j = 0; j < n - i - 1; j++) {
            if (arr[j] > arr[j + 1]) {
                [arr[j], arr[j + 1]] = [arr[j + 1], arr[j]];
            }
        }
    }
}

function mergeSort(arr) {
    let n = arr.length;
    if (n <= 1) return arr;

    const mid = Math.floor(n/2);
    const left = mergeSort(arr.slice(0, mid));
    const right = mergeSort(arr.slice(mid));

    let i = 0, j = 0;
    let result = []

    while (i < left.length && j < right.length) {
        if (left[i] <= right[j]) result.push(left[i++]);
        else result.push(right[j++]);
    }
    return result.concat(left.slice(i)).concat(right.slice(j));
}

function binarySearch(arr, target) {
    let n = arr.length;
    let left = 0;
    let right = n - 1;

    while (left <= right) {
        let mid = Math.floor((left + right) / 2);

        if(arr[mid] === target) return mid;  
        else if (arr[mid] < target) left = mid + 1;
        else right = mid - 1;
    }
    return -1;
}

function linearSearch(arr, target) {
    let n = arr.length;
    for (let i = 0; i < n; i++) {
        if(arr[i] === target) return i;
    }
    return -1;
}

function fibonacciRecursive(n) {
    if (n <= 1) return n;
    return fibonacciRecursive(n - 1) + fibonacciRecursive(n - 2);
}

function fibonacciDP(n){
    let dp =[0, 1];
    for (let i = 2; i <=n; i++) {
        dp[i] = dp[i - 1] + dp[i -2];
    }
    return dp[n];
}

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

function estimateSpace(arr, algo) {
    // Rough estimation: number of elements * 8 bytes(JS number)
    const size = arr.length;
    if (algo === "bubble" || algo === "binary" || algo === "linear") 
        return size * 8;
    else if (algo === "merge" || algo === "dp")
        return size * 8 * 2;
    else if (algo === "recursive")
        return size * 8 * size;

    return size * 8;
}

async function runAlgorithm() {
    let size = document.getElementById("size").value;
    let algo = document.getElementById("algorithm").value;
    let arr = Array.from({ length: size }, () => Math.random());

    let start = performance.now();
    if (algo === "bubble") bubbleSort(arr);
    if (algo === "merge") mergeSort(arr);
    if (algo === "binary") {
        arr.sort((a, b)=> a - b);
        let target = arr[Math.floor(Math.random()* arr.length)];
        binarySearch(arr, target);
    }
    if (algo === "linear") {
        let target = arr[Math.floor(Math.random() * arr.length)];
        linearSearch(arr, target);
    }
    if(algo === "recursive")  fibonacciRecursive(Math.min(size, 38));
    if(algo === "dp") fibonacciDP(size);
    let end = performance.now();

    let time = end - start;
    let complexity = getComplexity(algo);
    let space = estimateSpace(arr, algo);

    document.getElementById("result").innerText = `
        Execution Time: ${time} ms | Time
        Complexity: ${complexity.time} | Space
        Complexity: ${complexity.space} | Estimated
        Space Used: ${space} bytes
    `;

    const result = await fetch(SAVERESULT_LINK, {
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

    console.log(data);
}

async function logout() {
    const result = await fetch(LOGOUT_LINK);
    const data = await result.json();
    if (data.success) {
        window.location.href = "auth.html";
    }
}