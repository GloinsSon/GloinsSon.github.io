"use strict";

/**
 * controller for the dice
 * @author Gimli GloinsSon
 */

export default class DiceController {
    constructor() {
        self = this;
        self.reRoll = true;
        self.SIDES = 20;
        self.INITIALSIDE = 1;
        self.LastFace = 20;
    }


    /**
     * rolling the dice
     */
    roller(rollAll) {
        if (rollAll !== false) rollAll = true;
        let dice = document.getElementsByClassName("die");
        const timeouts = [];
        let durations = [];
        for (let i = 0; i < dice.length; i++) {
            durations[i] = 1500 + i * 150;
        }
        self.shuffleArray(durations);

        this.reRoll = false;
        setTimeout(() => {
            if (self.reRoll) self.roller(false);
            else triggerUpdate();
        }, 1750 + dice.length * 150);

        const diceList = document.getElementsByClassName("die");
        let count = 0;
        for (const dice of diceList) {
            let rarity = dice.getAttribute("data-rarity");
            if (rollAll || rarity == 0) {
                self.rollDie(dice, timeouts[count], durations[count]);
            }
            count++;
        }
        return false;
    }


    /**
     * pick a random face
     * @returns {number}
     */
    randomFace() {
        let face = Math.floor((Math.random() * self.SIDES)) + self.INITIALSIDE
        self.LastFace = face == self.LastFace ? self.randomFace() : face
        return face;
    }

    /**
     * roll the the specified face
     * @param die
     * @param face
     * @param timeoutId
     */
    rollTo(die, face, timeoutId) {
        clearTimeout(timeoutId);
        die.setAttribute("data-face", face);

        let rarity = 0;
        if (face >= 1 && face <= 8) rarity = 2;
        if (face >= 9 && face <= 12) rarity = 4;
        if (face >= 13 && face <= 14) rarity = 8;
        if (face >= 15 && face <= 19) self.reRoll = true;
        if (face == 20) rarity = 16;
        die.setAttribute("data-rarity", rarity);
    }

    /**
     * reset the dice
     */
    resetDice() {
        let dice = document.getElementsByClassName("die");
        for (let i = 0; i < dice.length; i++) {
            let die = dice[i];
            die.setAttribute("data-face", "20");
            die.setAttribute("data-rarity", "16");
            die.classList.remove("rolling");
        }
        triggerUpdate();
    }

    /**
     * roll animation for a dice
     * @param die
     * @param timeoutId
     * @param duration
     * @returns {boolean}
     */
    rollDie(die, timeoutId, duration) {
        die.classList.add("rolling");
        clearTimeout(timeoutId);

        timeoutId = setTimeout(() => {
            die.classList.remove("rolling");
            let randomVal = self.randomFace();
            if (randomVal >= 15 && randomVal <= 19)
                self.Reroll = true;
            self.rollTo(die, randomVal, timeoutId);

        }, duration);

        return false;
    }

    /* Randomize array in-place using Durstenfeld shuffle algorithm */
    shuffleArray(array) {
        for (let i = array.length - 1; i > 0; i--) {
            let j = Math.floor(Math.random() * (i + 1));
            let temp = array[i];
            array[i] = array[j];
            array[j] = temp;
        }
    }
}