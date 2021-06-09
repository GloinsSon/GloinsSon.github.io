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
     */
    constructor(key, name, logo) {
        this.key = key;
        this.name = name;
        this.logo = logo;
        this.variants = {};
    }
}