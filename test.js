let Vue=require("./reactivity");
let o = new Vue({
    data: {
        test: "I am test."
    }
});
o._data.test = "hello,world.";