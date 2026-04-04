const LINK = 'http://localhost/Web-Based-TimeComplexity-Project';

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

function getComplexity(algorithm) {
    const map = {
        bubble: { time: "O(n^2)", space: "O(1)" },
        merge: { time: "O(n log n)", space: "O(n)" }
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
    if (algo === "bubble") bubbleSort(arr);
    if (algo === "merge") mergeSort(arr);
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

    const result = await fetch(`${LINK}/api/save_result.php`, {
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
    console.log(data);
}