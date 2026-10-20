function getData() {
    return new Promise((resolve) => {
        resolve("Authentication API started!");
    });
}

async function showData() {
    const result = await getData();
    console.log(result);
}

showData();