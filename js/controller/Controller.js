"use strict";

import {SpecieService} from "./SpecieService.js";
import {ColorService} from "./ColorService.js";
import {ExtrasController} from "./ExtrasController.js";
import {getSpeciesList, getSubspeciesList, loadingProgress} from "../data/DataHandler.js";

/**
 * main controller
 * @author Gimli GloinsSon
 */
export default class Controller {
    constructor() {
        loadingProgress("init");
    }

    /**
     * initialize settings
     */
    init() {
        let speciesService = new SpecieService();
        speciesService.populateSpecies();
        document.getElementById("selection").className = "form-horizontal";
        setTimeout(createDownload, 2000);
    }

    /**
     * user changed a value in settings
     */
    changeSettings(element) {
        let fieldName = element.target.name;
        if (fieldName === "species") {
            let speciesService = new SpecieService();
            speciesService.changeSpecies();
            let extrasController = new ExtrasController();
            extrasController.populateExtras();
        } else if (fieldName === "subspecies") {
            let speciesService = new SpecieService();
            speciesService.changeSubSpecies();
        } else if (fieldName === "variant") {
            let speciesService = new SpecieService();
            speciesService.changeVariant();
        } else if (fieldName === "skins" ||
            fieldName === "ears" ||
            fieldName === "eyes") {
            let colorService = new ColorService();
            colorService.changeColors(fieldName);
        } else if (fieldName.startsWith("misc")) {
            let index = fieldName.substr(4, 1);
            let extrasController = new ExtrasController();
            extrasController.changeExtra(index);
        }
        createDownload();
    }

    /**
     * shows a randomized bunker
     */
    randomize() {
        let speciesService = new SpecieService();

        // choose a species
        let speciesKeys = Object.keys(getSpeciesList());
        let specieId = this.getRandomInt(0, speciesKeys.length);
        let specieKey = speciesKeys[specieId];
        document.querySelector("input[value='" + specieKey + "']").checked = true;
        speciesService.changeSpecies();

        // choose a subspecies
        let subSpecieKeys = Object.keys(getSubspeciesList(specieKey));
        let subSpecieId = this.getRandomInt(0, subSpecieKeys.length);
        let subSpecieKey = subSpecieKeys[subSpecieId];
        document.querySelector("input[value='" + subSpecieKey + "']").checked = true;
        document.querySelector("input[name='subspecies']")
            .dispatchEvent(new Event("change", {bubbles: true}));

        // choose a variant
        let variantKey = subSpecieKeys[subSpecieId];
        document.querySelector("input[value='" + variantKey + "']").checked = true;
        document.querySelector("input[name='variant']")
            .dispatchEvent(new Event("change", {bubbles: true}));

        // choose colors
        const colorArray = ["skins", "ears", "eyes"];
        for (const fieldName of colorArray) {
            let count = document.querySelectorAll("input[name='" + fieldName + "']").length;
            let randomVal = this.getRandomInt(0, count);
            document.getElementById(fieldName + randomVal).checked = true;
            document.getElementById(fieldName + randomVal).dispatchEvent(new Event("change", {bubbles: true}));
        }

        // choose extras
        const fieldArray = ["misc0", "misc1", "misc2"];
        for (const fieldName of fieldArray) {
            let elements = document.querySelectorAll("input[name='" + fieldName + "']");
            const count = elements.length;
            if (count > 0) {
                let randomVal = this.getRandomInt(0, count);
                elements[randomVal].checked = true;
                elements[randomVal].dispatchEvent(new Event("change", {bubbles: true}));
            }
        }
    }

    /**
     * get a random integer number
     * @param min  minimum (inclusive)
     * @param max  maximum (exclusive)
     * @returns {number}
     */
    getRandomInt(min, max) {
        min = Math.ceil(min);
        max = Math.floor(max);
        return Math.floor(Math.random() * (max - min) + min);
    }
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

}