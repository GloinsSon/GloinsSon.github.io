/**
 * reads the data from JSON and creates objects
 */
import {Specie} from "../model/Specie.js";
import {Variant} from "../model/Variant.js";
import {Extra} from "../model/Extra.js";

const jsonFiles = [
    {file: "species.json", callback: setSpecies},

    {file: "cubs/humanoid.xml", callback: setHumanoid},
    {file: "cubs/variants.json", callback: setVariants},
    {file: "cubs/extras.json", callback: setExtras} /*,

    {file: "fins/humanoid.xml", callback: setHumanoid},
    {file: "fins/variants.json", callback: setVariants},
    {file: "fins/extras.json", callback: setExtras},

    {file: "flappers/humanoid.xml", callback: setHumanoid},
    {file: "flappers/variants.json", callback: setVariants},
    {file: "flappers/extras.json", callback: setExtras},

    {file: "floofs/humanoid.xml", callback: setHumanoid},
    {file: "floofs/variants.json", callback: setVariants},
    {file: "floofs/extras.json", callback: setExtras},

    {file: "hoppers/humanoid.xml", callback: setHumanoid},
    {file: "hoppers/variants.json", callback: setVariants},
    {file: "hoppers/extras.json", callback: setExtras},

    {file: "prancers/humanoid.xml", callback: setHumanoid},
    {file: "prancers/variants.json", callback: setVariants},
    {file: "prancers/extras.json", callback: setExtras},

    {file: "smittens/humanoid.xml", callback: setHumanoid},
    {file: "smittens/variants.json", callback: setVariants},
    {file: "smittens/extras.json", callback: setExtras}*/

]

/**
 * loads all the json data-files
 */
export default function loadData() {
    for (let i = 0; i < jsonFiles.length; i++) {
        //setTimeout(() => {
        loadJSON(jsonFiles[i].file, jsonFiles[i].callback);
        //}, i*100);
    }
}

/**
 * fetches a JSON file
 * @param file  path withing "/js/data" and filename
 * @param callback  the callback function for success
 * @param elementId  the id of a DOM element (optional)
 */
export function loadJSON(file, callback, elementId) {
    fetch("./js/data/" + file)
        .then(function (response) {
            if (response.status !== 200) {
                console.log('Looks like there was a problem. Status Code: ' + response.status);
            } else {
                let parts = file.split(".", 2);
                if (parts[1] === "json")
                    response.json().then(callback);
                else {
                    response.text().then(
                        function (textData) {
                            if (elementId === undefined)
                                callback(textData);
                            else
                                callback(textData, elementId);
                        }
                    );
                }
            }
        });
}

/**
 * manage the loading progress
 * @param type
 * @returns {*}
 */
export function loadingProgress(type) {
    let progressBar = document.getElementById("progressBar");
    const valueMax = jsonFiles.length;
    if (type === "init") {
        Loading = valueMax;
        progressBar.setAttribute("aria-valuemax", valueMax.toString());
    }
    if (type === "decrease") {
        Loading--;
        if (Loading <= 0) {
            document.getElementById("progress").style.display = "none";
        }
    }
    let percent = Math.round((valueMax - Loading + 1) * 100 / valueMax);
    progressBar.setAttribute("aria-valuenow", (valueMax - Loading).toString());
    progressBar.innerText = "Loading " + percent + "% done";
    progressBar.style.width = percent + "%";

    return jsonFiles.length - Loading;
}

/**
 * gets one species
 * @param specieKey
 * @returns {*}
 */
export function getSpecie(specieKey) {
    return DataStore[specieKey];
}

/**
 * gets a list of all spiecies
 * @returns {*}
 */
export function getSpeciesList() {
    return DataStore;
}

/**
 * get a variant for a specie
 * @param specieKey
 * @param variantKey
 * @returns {*}
 */
export function getVariant(specieKey, variantKey) {
    return getVariantList(specieKey)[variantKey];
}

/**
 * gets a list of all variants for a specie
 * @param specieKey
 * @returns {*|{}}
 */
export function getVariantList(specieKey) {
    const speciesList = getSpeciesList();
    const specie = speciesList[specieKey];
    return specie.variants;
}

/**
 * gets one extra for a species
 * @param specieKey
 * @param extrasKey
 * @returns {*}
 */
export function getExtra(specieKey, extrasKey) {
    const extrasList = getExtrasList(specieKey);
    if (extrasList.hasOwnProperty(extrasKey))
        return getExtrasList(specieKey)[extrasKey];
    else
        return "";
}

/**
 * get a list of all extras for a specie
 * @param specieKey
 * @returns {*}
 */
export function getExtrasList(specieKey) {
    return getSpecie(specieKey).extras;
}

/**
 * gets one skin color
 * @param specieKey
 * @param variantKey
 * @param type
 * @param colorKey
 * @returns {*}
 */
export function getColors(specieKey, variantKey, type, colorKey) {
    let colors = getColorsList(specieKey, variantKey, type);
    return colors[colorKey];
}

/**
 * get a list of all extras for a specie
 * @param specieKey
 * @param variantKey
 * @param type
 * @returns {*}
 */
export function getColorsList(specieKey, variantKey, type) {
    let variant = getVariant(specieKey, variantKey);
    return variant[type];
}

/**
 * sets the vector data for the humanoid form
 * @param data
 */
function setHumanoid(data) {
    let lines = data.split(/\r?\n/);
    let specieKey = lines[0].substr(7, (lines[0].length - 9));

    (async () => {
        let exists = false;
        while (!exists) {
            if (DataStore.hasOwnProperty(specieKey)) {
                exists = true;
            }
            if (!exists)
                await new Promise(resolve => setTimeout(resolve, 100));
        }
        let species = getSpecie(specieKey);
        for (let i = 1; i < lines.length - 1; i++) {
            let line = lines[i].replace(/  +/g, ' ');
            species.humanoid.push(line);
        }
        loadingProgress("decrease");
    })();
}

/**
 * sets the species in DataStore
 * @param jsonData
 */
function setSpecies(jsonData) {
    let map = {};
    for (const [key, value] of Object.entries(jsonData)) {
        map[key] = new Specie(
            key,
            value.name,
            value.bgcolor,
            value.formBgColor,
            value.rarityColors,
            value.humanoid,
            value.logo
        );
    }
    DataStore = map;
    loadingProgress("decrease");
}


/**
 * sets the color variants in the DataStore
 * @param jsonData
 */
function setVariants(jsonData) {
    let parent;
    let species = jsonData.species;

    (async () => {
        let exists = false;
        while (!exists) {
            if (DataStore.hasOwnProperty(species)) {
                parent = DataStore[species];
                exists = parent.hasOwnProperty("variants");
            }
            if (!exists)
                await new Promise(resolve => setTimeout(resolve, 100));
        }


        for (const [key, value] of Object.entries(jsonData.variants)) {
            let variant = new Variant(
                key,
                key,
                value.logo,
                value.rarity,
                value.skins,
                value.ears,
                value.eyes
            );
            parent.variants[key] = variant;
        }
        loadingProgress("decrease");
    })();
}

/**
 * sets the extra attributes
 * @param jsonData
 */
function setExtras(jsonData) {
    let species = jsonData.species;
    let parent;

    (async () => {
        let exists = false;
        while (!exists) {
            if (DataStore.hasOwnProperty(species)) {
                parent = DataStore[species];
                exists = parent.hasOwnProperty("extras");
            }
            if (!exists)
                await new Promise(resolve => setTimeout(resolve, 100));
        }
        for (const [extraKey, values] of Object.entries(jsonData)) {
            if (extraKey !== "species") {
                parent.extras[extraKey] = [];
                let array = [];
                for (let i = 0; i < values.length; i++) {
                    let extra = new Extra(
                        values[i].rarity,
                        values[i].elements
                    );
                    array.push(extra);
                }

                parent.extras[extraKey] = array;
            }

        }

        loadingProgress("decrease");
    })();
}