export default class Settings {
    year = 'first year';
    number_of_questions = 10;
    theme = 'light';

    constructor() {
        this.year;
        this.number_of_questions;
        this.theme;
    }

    set year(year) {
        if (year !== '') {
            this.year = year;
        } else {
            throw new Error('Choose a year');
        }
    }

    get year() {
        return this.year;
    }

    set number_of_questions(number) {
        if (number !== '') {
            this.number_of_questions = number;
        } else {
            throw new Error('Enter a number');
        }
    }

    get number_of_questions() {
        return this.number_of_questions;
    }

    set theme(theme) {
        if (theme !== '') {
            this.theme = theme;
        } else {
            throw new Error('Enter a number');
        }
    }

    get theme() {
        return this.theme;
    }


}