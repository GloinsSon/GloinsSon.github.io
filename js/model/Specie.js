"use strict";

/**
 * a species
 */

export class Specie {
    /**
     * constructor
     * @param key
     * @param name
     * @param bgcolor
     * @param formBgColor  background color for the form
     * @param diceColor    colors for the dice faces
     * @param humanoid
     * @param logo
     */
    constructor(key, name, bgcolor, formBgColor, diceColor, humanoid, logo) {
        this.key = key;
        this.name = name;
        this.bgcolor = bgcolor;
        this.formBgColor = formBgColor;
        this.diceColor = diceColor;
        this.humanoid = humanoid;
        this.logo = logo;
        this.extras = {};
        this.subspecies = {};
    }

}