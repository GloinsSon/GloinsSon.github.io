"use strict";

import {getSpecie, getSpeciesList, getSubspeciesList, getVariant, getVariantList} from "../data/DataHandler.js";
import {ViewController} from "../view/ViewController.js";
import ("../data/DataHandler.js");

/**
 * controller for species and subspieces
 * @author Gimli GloinsSon
 */


export class SpecieService {
    constructor() {
    }

    /**
     * add the species to the selection
     */
    populateSpecies() {
        const viewController = new ViewController();
        const speciesList = getSpeciesList();

        const speciesLogos = document.getElementById("species");
        speciesLogos.innerText = null;
        for (const [speciesKey, specie] of Object.entries(speciesList)) {
            let logo = viewController.buildLogo("species", speciesKey, speciesKey, specie.logo);
            speciesLogos.innerHTML += logo;
        }

        document.querySelector("input[name='species']").checked = true;
        this.changeSpecies();
    }

    /**
     * add the subspiecies to the selection
     * @param specieKey
     */
    populateSubSpecies(specieKey) {
        const viewController = new ViewController();
        const subspeciesList = getSubspeciesList(specieKey);
        const subSpiecesLogos = document.getElementById("subspecies");
        subSpiecesLogos.innerText = null;

        for (const [key, subspecie] of Object.entries(subspeciesList)) {
            let logo = viewController.buildLogo("subspecies", key, specieKey, subspecie.logo);
            subSpiecesLogos.innerHTML += logo;
        }
        document.querySelector("input[name='subspecies']").checked = true;
        this.changeSubSpecies();
    }

    /**
     * add variants to the selection
     * @param specieKey
     * @param subspecieKey
     */
    populateVariants(specieKey, subspecieKey) {
        const viewController = new ViewController();
        const variantList = getVariantList(specieKey, subspecieKey);
        const variantLogos = document.getElementById("variants");

        variantLogos.innerText = null;
        for (const [variantKey, variant] of Object.entries(variantList)) {
            let logo = viewController.buildLogo("variant", variantKey, specieKey, variant.logo);
            variantLogos.innerHTML += logo;
        }
        document.querySelector("input[name='variant']").checked = true;
        this.changeVariant();
    }

    /**
     * the user changed the specie
     */
    changeSpecies() {
        let specieKey = document.querySelector("input[name='species']:checked").value;
        const specie = getSpecie(specieKey);

        document.body.style.backgroundColor = specie.bgcolor;
        this.populateSubSpecies(specieKey);

        let svgHuman = "";
        for (let i = 0; i < specie.humanoid.length; i++) {
            svgHuman += specie.humanoid[i];
        }
        document.getElementById("humanoid").innerHTML = svgHuman;
    }

    /**
     * the user changed the subSpecies
     */
    changeSubSpecies() {
        this.populateVariants(
            document.querySelector("input[name='species']:checked").value,
            document.querySelector("input[name='subspecies']:checked").value
        );
        document.querySelector("input[name='variant']").dispatchEvent(
            new Event("change", {bubbles: true})
        );
    }

    /**
     * the user changed the variant
     */
    changeVariant() {
        let variant = getVariant(
            document.querySelector("input[name='species']:checked").value,
            document.querySelector("input[name='subspecies']:checked").value,
            document.querySelector("input[name='variant']:checked").value
        );

        this.updateRange("skins", variant.skins.length - 1);
        this.updateRange("ears", variant.ears.length - 1);
        this.updateRange("eyes", variant.eyes.length - 1);
    }

    /**
     * update a range input field
     * @param fieldId
     * @param maxValue
     */
    updateRange(fieldId, maxValue) {
        let field = document.getElementById(fieldId);
        field.setAttribute("max", maxValue);
        field.value = 0;
    }

}