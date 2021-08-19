"use strict";

import {
    getSpecie,
    getSpeciesList,
    getVariantList
} from "../data/DataHandler.js";
import {ViewController} from "../view/ViewController.js";
import {ColorService} from "./ColorService.js";
import {ExtrasController} from "./ExtrasController.js";
import ("../data/DataHandler.js");

/**
 * controller for species and variants
 * @author Gimli GloinsSon
 */


export class SpecieService {
    constructor() {
    }

    /**
     * add the species to the selection
     */
    populateSpecies() {
        (async () => {
            let exists = false;
            while (!exists) {
                exists = Object.keys(DataStore).length !== 0;
                if (!exists)
                    await new Promise(resolve => setTimeout(resolve, 100));
            }
            const viewController = new ViewController();
            const speciesList = getSpeciesList();

            const speciesLogos = document.getElementById("species");
            speciesLogos.innerText = null;
            for (const [speciesKey, specie] of Object.entries(speciesList)) {
                let logo = viewController.buildLogo(
                    "species",
                    speciesKey,
                    false,
                    speciesKey,
                    specie.logo,
                    0,
                    "");
                speciesLogos.innerHTML += logo;
            }

            let species = document.querySelector("input[name='species']");
            species.checked = true;
            this.changeSpecies();
        })();

    }

    /**
     * add variants to the selection
     * @param specieKey
     */
    populateVariants(specieKey) {
        (async () => {
            let exists = false;
            while (!exists) {
                if (DataStore.hasOwnProperty(specieKey) &&
                    Object.keys(DataStore[specieKey].variants).length !== 0) {
                    exists = true;
                }

                if (!exists)
                    await new Promise(resolve => setTimeout(resolve, 100));
            }
            const viewController = new ViewController();
            const variantList = getVariantList(specieKey);
            const variantLogos = document.getElementById("variants");
            const dice = document.getElementById("diceVariants").getAttribute("data-rarity");

            variantLogos.innerText = null;
            let variantsHTML = "";
            for (const [variantKey, variant] of Object.entries(variantList)) {
                let disabled = "disabled";
                if (dice >= variant.rarity) disabled = "";

                let logo = viewController.buildLogo(
                    "variant",
                    variantKey,
                    (variant.sub === variantKey),
                    specieKey,
                    variant.logo,
                    variant.rarity,
                    disabled);

                if (variant.sub === variantKey) {
                    if (variantsHTML !== "") {
                        variantsHTML += "</div></div>";
                    }
                    variantsHTML += "<div class='subrace'>" + logo + "<div class='colorVar'>";
                } else {
                    variantsHTML += logo;
                }
            }
            variantLogos.innerHTML += variantsHTML + "</div></div>"

            document.querySelector("input[name='variant']").checked = true;
            this.changeVariant();
        })();
    }

    /**
     * the user changed the specie
     */
    changeSpecies() {
        let specieKey = document.querySelector("input[name='species']:checked").value;
        const specie = getSpecie(specieKey);

        (async () => {
            let exists = false;
            while (!exists) {
                exists = DataStore[specieKey].humanoid.length !== 0;
                if (!exists)
                    await new Promise(resolve => setTimeout(resolve, 100));
            }
            let svgHuman = "";
            for (let i = 0; i < specie.humanoid.length; i++) {
                svgHuman += specie.humanoid[i];
            }
            document.getElementById("humanoid").innerHTML = svgHuman;
            const root = document.documentElement;
            root.style.setProperty("--bgColor", specie.bgcolor);
            root.style.setProperty("--formBgColor", "#fefefea0"); // specie.formBgColor);
            root.style.setProperty("--colorCommon", specie.rarityColors[0]);
            root.style.setProperty("--colorUncommon", specie.rarityColors[1]);
            root.style.setProperty("--colorRare", specie.rarityColors[2]);
            root.style.setProperty("--colorMythical", specie.rarityColors[3]);

            this.populateVariants(specieKey);

            let extrasController = new ExtrasController();
            extrasController.populateExtras();
        })();
    }

    /**
     * the user changed the variant
     */
    changeVariant() {
        let colorService = new ColorService();
        colorService.populateColors("skins");
        colorService.populateColors("eyes");
        colorService.populateColors("ears");

        colorService.changeColors();
    }
}