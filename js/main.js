/**
 * main script to start execution
 * @author Gimli GloinsSon
 */
const SIDES = 20;
const INITIALSIDE = 1;
let LastFace;
let Reroll = false;
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

            document.getElementById("rollDice").addEventListener("click", rollAllDice);
            document.getElementById("rerollDice").addEventListener("click", reRollDice);
            document.getElementById("resetDice").addEventListener("click", resetDice);

            document.getElementById("selection").addEventListener("change", controller.changeSettings);
           // document.getElementById("selection").addEventListener("reset", controller.init);  TODO use reset on form or on dice, not both
            document.getElementById("random").addEventListener("click", randomBunker);
            document.getElementById("btnDownload").addEventListener("click", createDownload);

            const diceList = document.getElementsByClassName("die");
            for (let diece of diceList) {
                diece.addEventListener("dragstart", controller.dragDice);
                diece.addEventListener("drop", controller.dropDice);
                diece.addEventListener("dragover", controller.allowDrop);
            }
        });
});

/**
 * roll all dice
 */
function rollAllDice() {
    Reroll = false;
    roller();
}

/**
 * reroll dice with undefined faces
 */
function reRollDice() {
    Reroll = true;
    roller();
}

/**
 * rolling the dice
 */
function roller() {
    let dice = document.getElementsByClassName("die");
    const timeouts = [];
    let durations = [];
    for (let i = 0; i < dice.length; i++) {
        durations[i] = 1500 + i * 250;
    }
    shuffleArray(durations);

    setTimeout(function () {
        triggerUpdate();
    }, 1750 + dice.length * 250);

    const diceList = document.getElementsByClassName("die");
    let count = 0;
    for (const dice of diceList) {
        let rarity = dice.getAttribute("data-rarity");
        if (Reroll == false ||
            (rarity == 0)
        ) {
            rollDie(dice, timeouts[count], durations[count]);
        }
        count++;
    }
}

/**
 * pick a random face
 * @returns {number}
 */
function randomFace() {
    let face = Math.floor((Math.random() * SIDES)) + INITIALSIDE
    LastFace = face == LastFace ? randomFace() : face
    return face;
}

/**
 * roll the the specified face
 * @param die
 * @param face
 * @param timeoutId
 */
function rollTo(die, face, timeoutId) {
    clearTimeout(timeoutId);
    die.setAttribute("data-face", face);

    let rarity = 0;
    if (face >= 1 && face <= 8) rarity = 2;
    if (face >= 9 && face <= 12) rarity = 4;
    if (face >= 13 && face <= 14) rarity = 8;
    if (face == 20) rarity = 16;
    die.setAttribute("data-rarity", rarity);
}

/**
 * reset the dice
 */
function resetDice() {
    let dice = document.getElementsByClassName("die");
    for (let i = 0; i < dice.length; i++) {
        let die = dice[i];
        die.setAttribute("data-face", "20");
        die.setAttribute("data-rarity", "16");
        die.classList.remove("rolling");
    }
    triggerUpdate();
}

/**
 * roll animation for a dice
 * @param die
 * @param timeoutId
 * @param duration
 * @returns {boolean}
 */
function rollDie(die, timeoutId, duration) {
    die.classList.add("rolling");
    clearTimeout(timeoutId);

    timeoutId = setTimeout(function () {
        die.classList.remove("rolling");
        let randomVal = randomFace();
        if (randomVal >= 15 && randomVal <= 19)
            Reroll = true;
        rollTo(die, randomVal, timeoutId);

    }, duration);

    return false;
}

/* Randomize array in-place using Durstenfeld shuffle algorithm */
function shuffleArray(array) {
    for (let i = array.length - 1; i > 0; i--) {
        let j = Math.floor(Math.random() * (i + 1));
        let temp = array[i];
        array[i] = array[j];
        array[j] = temp;
    }
}

function triggerUpdate() {
    let element = document.getElementsByName("species")[0];
    element.dispatchEvent(
        new Event("change", { "bubbles": true})
    );
}

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
