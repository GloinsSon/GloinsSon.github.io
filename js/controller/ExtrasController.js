"use strict";

import {getExtra, getExtrasList, loadJSON} from "../data/DataHandler.js";

/**
 * controller for the extra attributes
 * @author Gimli GloinsSon
 */
export class ExtrasController {
    constructor() {};

    /**
     * show the input fields for extras
     */
    populateExtras() {
        const extrasList = getExtrasList(document.querySelector("input[name='species']:checked").value);

        let index = 0;
        for (const [extraKey, values] of Object.entries(extrasList)) {
            document.getElementById("extraL" + index).innerText = extraKey;
            let extraRange = document.getElementById("extra" + index);
            extraRange.setAttribute("max", (values.length - 1).toString());
            extraRange.value = 0;
            index++;
         }

        for (let i=0; i<3; i++ ) {
            document.getElementById("extraSVG" + i).innerHTML = "";
            this.changeExtra(i);
        }
    }

    /**
     * the user changed an extra
     * @param index  the index of the changed extra
     */
    changeExtra(index) {
        const species = document.querySelector("input[name='species']:checked").value;
        const extraRange = document.getElementById("extra"+index);
        const extraLabel = document.getElementById("extraL"+index);
        const extraValue = extraRange.value;
        const extras = getExtra(
            species,
            extraLabel.innerText
            )[extraValue];

        let svgElements = "";
        if (extras) {
            if (Array.isArray(extras.value)) {
                extras.value.forEach(function (extra) {
                    svgElements += extra;
                });
                showExtra(svgElements);
            } else {
                let filename = "./" + species + "/" + extras.value;
                loadJSON(filename, showExtra);
            }

        } else {
            extraRange.style.display = "none";
            extraLabel.style.display = "none";
        }

        /**
         * show the graphics for an extra element
         * @param svgElements
         */
        function showExtra(svgElements) {
            document.getElementById("extraSVG" + index).innerHTML = svgElements;
            extraRange.style.display = "block";
            extraLabel.style.display = "block";
        }

    }


}