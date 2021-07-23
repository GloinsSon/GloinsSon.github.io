"use strict";

/**
 * a subspecies
 */

export class SubSpecie {
    /**
     * constructor
     * @param key
     * @param name
     * @param logo
     * @param rarity
     */
    constructor(key, name, logo, rarity) {
        this.key = key;
        this.name = name;
        this.logo = logo;
        this.rarity = rarity;
        this.variants = {};
    }
}