const range = document.getElementById('number');
const label = document.getElementById('label');
const container = document.getElementById('container');
const rangeValue = document.getElementById('rangeV');

const setValue = () => {
    const newValue = Number((range.value - range.min)
        * 100 / (range.max - range.min)),
        newPostion = 1 - (newValue * 0.1);
    rangeValue.innerHTML = `<span>${range.value}</span>`;
    rangeValue.style.left = `calc(${newValue}% + 
    (${newPostion}px))`;
}

document.addEventListener("DOMContentLoaded", setValue);
range.addEventListener('input', setValue);



const Choices = function (difficulty, number_of_questions, theme) {
    this.difficulty = "easy";
    this.number_of_questions = 10;
    this.theme = "light";
};

Choices.prototype.getDifficulty = function () {
    return this.difficulty;
}
Choices.prototype.numberOfQuestions = function () {
    return this.number_of_questions;
}
Choices.prototype.theme = function () {
    return this.difficulty;
}

const fetchQuestions = async function (url) {
    const response = await fetch(url);
    if (response.status >= 200 && response.status <= 299) {
        const jsonResponse = await response.json();
        console.log(jsonResponse.results)
    } else {
        console.log(response.status, response.statusText);
    }
}


const question_url = 'https://opentdb.com/api.php?amount=20&difficulty=easy&type=multiple';

fff = fetchQuestions(question_url);