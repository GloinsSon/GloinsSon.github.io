/**
 * main script to start execution
 * @author Gimli GloinsSon
 */
let DataStore = {};  // main datastore
let Loading = 99;    // counter for loaded files


let controller;

/**
 * register listeners for all form elements
 */
document.addEventListener("DOMContentLoaded", () => {
    import("./controller/Controller.js")
        .then((module) => {
            import ("./data/DataHandler.js")
                .then((module) => {
                    module.default();
                });

            controller = new module.default;
            controller.init();

            document.getElementById("selection").addEventListener("change", controller.changeSettings);
            document.getElementById("selection").addEventListener("reset", controller.init);
            document.getElementById("random").addEventListener("click", randomBunker);
        });
});

/**
 * generate a random bunker
 */
function randomBunker() {
    import("./controller/Controller.js")
        .then((module) => {
            controller = new module.default;
            controller.randomize();
        });
}
