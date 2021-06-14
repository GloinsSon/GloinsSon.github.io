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
        for (let i = 0; i < 3; i++) {
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
                for (let i = 0; i < extra.length; i++) {
                    selection += viewController.buildExtra(
                        "misc" + index,
                        specieKey,
                        i,
                        extra[i].filename
                    );

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
            loadJSON("./" + species + "/" + extras.filename, showExtra, extras);

        } else {
            extraRange.style.display = "none";
            extraLabel.style.display = "none";
        }

        /**
         * show the graphics for an extra element
         * @param svgElements
         */
        function showExtra(svgElements, extras) {
            document.getElementById("extraSVG" + index).innerHTML = svgElements;
            extraRange.style.display = "block";
            extraLabel.style.display = "block";

            let group = document.getElementById("extraSVG" + index);
            for (const [attrKey, attrValue] of Object.entries(extras.attrs)) {
                if (attrKey === "transform")
                    group.setAttribute(attrKey, attrValue);
                else {
                    let child = group.getElementsByTagName("svg")[0];
                    child.setAttribute(attrKey, attrValue);
                }

            }
        }
    }
}