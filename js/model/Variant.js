"use strict";

/**
 * a color variant of a subspieces
 */

export class Variant {
    /**
     * constructor
     * @param key
     * @param name
     * @param logo
     * @param rarity
     * @param skins
     * @param ears
     * @param eyes
     */
    constructor(key, name, logo, rarity, skins, ears, eyes) {
        this.key = key;
        this.name = name;
        this.logo = logo;
        this.rarity = rarity;
        this.skins = skins;
        this.ears = ears;
        this.eyes = eyes;
    }
}