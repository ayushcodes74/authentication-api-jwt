function greetUser(name, callback) {
        callback(name);
}

function sayHello(name) {
    console.log("Hello " + name);
}
function sayWelcome(name) {
    console.log("Welcome " + name)
}
greetUser("Ayush", sayHello);
greetUser("Rahul", sayHello);
greetUser("Ayush", sayWelcome);