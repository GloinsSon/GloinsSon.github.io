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
    }

    /**
     * user changed a value in settings
     */
    changeSettings(element) {
        let fieldId = element.target.id;
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

            let event = new Event("change", { 'bubbles': true });
            document.getElementById("skins0").dispatchEvent(event);
        } else if (fieldName === "skins" ||
            fieldName === "ears" ||
            fieldName === "eyes") {
            let colorService = new ColorService();
            colorService.changeColors(fieldName);
        } else if (fieldId.startsWith("extra")) {
            let index = fieldId.substr(5, 1);
            let extrasController = new ExtrasController();
            extrasController.changeExtra(index);
        }
        createDownload();

        /**
         * creates the data string to download the bunkers
         */
        function createDownload() {
            let link = document.getElementById("download");
            let svg = document.getElementById("svg");
            let serializer = new XMLSerializer();
            let source = serializer.serializeToString(svg);
            if(!source.match(/^<svg[^>]+xmlns="http\:\/\/www\.w3\.org\/2000\/svg"/)){
                source = source.replace(/^<svg/, '<svg xmlns="http://www.w3.org/2000/svg"');
            }
            if(!source.match(/^<svg[^>]+"http\:\/\/www\.w3\.org\/1999\/xlink"/)){
                source = source.replace(/^<svg/, '<svg xmlns:xlink="http://www.w3.org/1999/xlink"');
            }

            source = '<?xml version="1.0" standalone="no"?>\r\n' + source;
            link.href = "data:image/svg+xml;charset=utf-8," + encodeURIComponent(source);

        }
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
        for (let fieldId in colorArray) {
            let fieldName = colorArray[fieldId];
            let count = document.querySelectorAll("input[name='" + fieldName + "']").length;
            let randomVal = this.getRandomInt(0, count);
            document.getElementById(colorArray[fieldId] + randomVal).checked = true;

            document.getElementById(colorArray[fieldId]).
            dispatchEvent(new Event("change", {bubbles: true}));
        }

        // choose extras
        const fieldArray = ["extra0", "extra1", "extra2"];
        for (let fieldId in fieldArray) {
            let field = document.getElementById(fieldArray[fieldId]);
            field.value = this.getRandomInt(0, field.max);
            field.dispatchEvent(new Event("change", {bubbles: true}));
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