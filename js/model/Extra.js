"use strict";

/**
 * an extra attribute of a species
 */

export class Extra {
    /**
     * constructor
     * @param rarity  the rarity of this extra
     * @param elements list of attributes
     */
    constructor(rarity, elements) {
        this.rarity = rarity;
        this.elements = elements;
    }

}