"use strict";

import {getExtra, getExtrasList, loadJSON} from "../data/DataHandler.js";
import {ViewController} from "../view/ViewController.js";

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
        for (let i=0; i<3; i++) {
            document.getElementById("extraSVG" + i).innerHTML = "";
            document.getElementById("extra" + i).style.display = "none";
            document.getElementById("extraL" + i).style.display = "none";
        }

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
            const viewController = new ViewController();

            let index = 0;

            for (const [extraKey, extra] of Object.entries(extrasList)) {
                let selection = "";
                document.getElementById("extraL" + index).innerText = extraKey;
                for (let i=0; i<extra.length; i++) {
                    let elementId = extra[i].value.split('.')[0];
                    selection += viewController.buildExtra(
                        "misc" + index,
                        i,
                        elementId
                    );

                    loadJSON(
                        specieKey + "/" + extra[i].value,
                        this.showExtra,
                        elementId);
                }
                let fieldId = "extra" + index;
                document.getElementById(fieldId).innerHTML = selection;
                document.querySelector("input[name='misc" + index + "']").checked = true;


                this.changeExtra(index);
                index++;
            }


        })();
    }

    /**
     * shows the image for the misc. extra
     * @param xmlData
     * @param elementId
     */
    showExtra(xmlData, elementId) {
        let element = document.getElementById(elementId);
        document.getElementById(elementId).innerHTML = xmlData;
        let group = document.getElementById(elementId).getElementsByTagName("g")[0];
        group.removeAttribute("transform");
    }

    populateExtrasBak() {
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
        const extraValue = document.querySelector("input[name='misc" + index + "']:checked").value;
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