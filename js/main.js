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
            document.getElementById("btnDownload").addEventListener("click", createDownload);

            const diceList = document.getElementsByClassName("die");
            for (let diece of diceList) {
                diece.addEventListener("drop", controller.dragDice);
            }
            for (const elementId of ["diceSubspecies", "diceeyes", "diceears", "diceskins"]) {
                let element = document.getElementById(elementId);
                element.addEventListener("drop", controller.dropDice);
                element.addEventListener("dragover", controller.allowDrop);
            }
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

/**
 * creates the data string to download the bunkers
 */
function createDownload() {
    let link = document.getElementById("download");
    let svg = document.getElementById("modelSVG");
    let serializer = new XMLSerializer();
    let source = serializer.serializeToString(svg);
    if (!source.match(/^<svg[^>]+xmlns="http\:\/\/www\.w3\.org\/2000\/svg"/)) {
        source = source.replace(/^<svg/, '<svg xmlns="http://www.w3.org/2000/svg"');
    }
    if (!source.match(/^<svg[^>]+"http\:\/\/www\.w3\.org\/1999\/xlink"/)) {
        source = source.replace(/^<svg/, '<svg xmlns:xlink="http://www.w3.org/1999/xlink"');
    }

    source = '<?xml version="1.0" standalone="no"?>\r\n' + source;
    link.href = "data:image/svg+xml;charset=utf-8," + encodeURIComponent(source);
    document.getElementById("link").classList.remove("d-none");

}
