"use strict";

import {getExtra, getExtrasList, loadJSON} from "../data/DataHandler.js";

/**
 * controller for the extra attributes
 * @author Gimli GloinsSon
 */
export class ExtrasController {
    constructor() {
    };

    /**
     * show the input fields for extras
     */
    populateExtras() {
        let specieKey = document.querySelector("input[name='species']:checked").value;
        (async () => {
            let exists = false;
            while (!exists) {
                if (DataStore.hasOwnProperty(specieKey) &&
                    Object.keys(DataStore[specieKey].extras).length !== 0) {

                    exists = Object.keys(DataStore[specieKey].extras).length !== 0;
                }

                if (!exists)
                    await new Promise(resolve => setTimeout(resolve, 100));
            }

            const extrasList = getExtrasList(document.querySelector("input[name='species']:checked").value);

            let index = 0;
            for (const [extraKey, values] of Object.entries(extrasList)) {
                document.getElementById("extraL" + index).innerText = extraKey;
                let extraRange = document.getElementById("extra" + index);
                extraRange.setAttribute("max", (values.length - 1).toString());
                extraRange.value = 0;
                index++;
            }

            for (let i = 0; i < 3; i++) {
                document.getElementById("extraSVG" + i).innerHTML = "";
                this.changeExtra(i);
            }
        })();
    }

    /**
     * the user changed an extra
     * @param index  the index of the changed extra
     */
    changeExtra(index) {
        const species = document.querySelector("input[name='species']:checked").value;
        const extraRange = document.getElementById("extra" + index);
        const extraLabel = document.getElementById("extraL" + index);
        const extraValue = extraRange.value;
        const extras = getExtra(
            species,
            extraLabel.innerText
        )[extraValue];

        if (extras) {
            loadJSON("./" + species + "/" + extras.value, showExtra);
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