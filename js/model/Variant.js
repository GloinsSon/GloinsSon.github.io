"use strict";

/**
 * a color variant of a subspieces
 */

export class Variant {
    /**
     * constructor
     * @param name the name of the variants
     * @param sub  the subspecies this variant belongs to
     * @param logo the logo for the variant
     * @param rarity  the rarity of the variant
     * @param skins  all skin colors
     * @param ears  all ear colors
     * @param eyes  all eye colors
     */
    constructor(name, sub, logo, rarity, skins, ears, eyes) {
        this.name = name;
        this.sub = sub;
        this.logo = logo;
        this.rarity = rarity;
        this.skins = skins;
        this.ears = ears;
        this.eyes = eyes;
    }
}