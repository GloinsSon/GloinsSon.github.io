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
     * @param humanoid
     * @param logo
     */
    constructor(key, name, bgcolor, humanoid, logo) {
        this.key = key;
        this.name = name;
        this.bgcolor = bgcolor;
        this.humanoid = humanoid;
        this.logo = logo;
        this.extras = {};

        this.subspecies = {};
    }

}