const myPromise = new Promise((resolve, reject) => {
    reject("Something went wrong!");
});

myPromise
    .then((result) => {
        console.log(result);
    })
    .catch((error) => {
        console.log(error);
    });