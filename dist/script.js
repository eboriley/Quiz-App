//variables for range
const range = document.getElementById('number');
const label = document.getElementById('label');
const container = document.getElementById('container');
const rangeValue = document.getElementById('rangeV');

//variables for difficulty choice
const difficulty_form = document.forms.difficultyForm;
const difficulty_radios = difficulty_form.elements.difficulty;


//variables for category choice
const category_form = document.forms.categoryform;
const category_radios = category_form.elements.category;

//variables for the user choices rendering
const user_choices_container = document.querySelector("settings--user-preferences");
const user_dif = document.getElementById("span-dif");
const user_cat = document.getElementById("span-cat");
const user_num = document.getElementById("span-num");

//variables for rendering questions and answers
const question_container = document.querySelector(".quiz--questions")
const question_element = document.querySelector(".question");
const answers_container = document.querySelector(".radios--answers")
const answer_template = document.getElementById("answer-template");

const q_num = document.getElementById("q-num");
const q_numOf = document.getElementById("q-numOf");
const q_cat = document.getElementById("q-cat");
const q_dif = document.getElementById("q-dif");


const next_button = document.getElementById('next-button');

//---number of questions range selector functionality--- 
const setValue = () => {
    const newValue = Number((range.value - range.min)
        * 100 / (range.max - range.min)),
        newPostion = 1 - (newValue * 0.1);
    rangeValue.innerHTML = `<span>${range.value}</span>`;
    rangeValue.style.left = `calc(${newValue}% + 
    (${newPostion}px))`;
    user_num.innerHTML = range.value;
}
document.addEventListener("DOMContentLoaded", setValue);
range.addEventListener('input', setValue);


//--- user difficulty choice functionality ---
user_dif.innerHTML = getUserDifficultyChoice();
for (let i = 0; i < difficulty_radios.length; i += 1) {
    difficulty_radios[i].addEventListener('click', () => {
        for (let i = 0; i < difficulty_radios.length; i += 1) {
            if (difficulty_radios[i].checked === true) {
                user_dif.innerHTML = getUserDifficultyChoice();
            }
        }
    });
}


function getUserDifficultyChoice() {
    for (let i = 0; i < difficulty_radios.length; i += 1) {
        if (difficulty_radios[i].checked === true) {
            return difficulty_radios[i].id;
        }
    }
}

//--- user category choice functionality ---

user_cat.innerHTML = getUserCategoryChoice();
for (let i = 0; i < category_radios.length; i += 1) {
    category_radios[i].addEventListener('click', () => {
        for (let j = 0; j < category_radios.length; j += 1) {
            if (category_radios[j].checked === true) {
                user_cat.innerHTML = getUserCategoryChoice();
            }
        }
    });
}

function getUserCategoryChoice() {
    for (let i = 0; i < category_radios.length; i += 1) {
        if (category_radios[i].checked === true) {
            return category_radios[i].dataset.text;
        }
    }
}



const Choices = function (difficulty, number_of_questions, theme) {
    this.difficulty = "&difficulty=easy";
    this.number_of_questions = 10;
    this.category = "";
};

Choices.prototype.getDifficulty = function () {
    return this.difficulty;
}
Choices.prototype.getNumberOfQuestions = function () {
    return this.number_of_questions;
}
Choices.prototype.getCategory = function () {
    return this.category;
}



let questions_increment = 0;
const selected_choices = [];

const fetchQuestions = async function (url) {
    const response = await fetch(url);
    if (response.status >= 200 && response.status <= 299) {
        const jsonResponse = await response.json();
        console.log(jsonResponse.results)
        const current_question = getCurrentQuestion(jsonResponse.results[questions_increment])
        setQuestion(current_question);

        next_button.addEventListener('click', () => {
            if (questions_increment <= choice.number_of_questions - 1) {
                questions_increment += 1;
                console.log(questions_increment);
                const current_question =
                    getCurrentQuestion(jsonResponse
                        .results[questions_increment]);

                setQuestion(current_question);

                checkSelectedAnswer();
                q_num.innerHTML = questions_increment + 1;

            }
            if (questions_increment === choice.number_of_questions) {
                checkSelectedAnswer();
                console.log('done')
                let score = 0;
                const correct_choices = selected_choices.filter(selected_choice => selected_choice.correct === true);
                console.log(correct_choices);
            }
        })

        question_container.addEventListener('click', event => {
            let ans
            if (event.target.tagName.toLowerCase() === 'input') {
                ans = event.target.id;
                // console.log(ans);
                const current_question = getCurrentQuestion(jsonResponse.results[questions_increment]);
                let user_choice = current_question.answers.find((answer) => answer.text === ans);
                console.log(user_choice);
                selected_choices[questions_increment] = user_choice;
                console.log(selected_choices);
                // if (user_choice.correct) {
                //     alert('Correct choice')
                // }
            }

        })

    } else {
        console.log(response.status, response.statusText);
    }
}

let choice = new Choices();
choice.number_of_questions = range.value;
choice.difficulty = getUserDifficultyChoiceValue();
choice.category = getUserCategoryChoiceValue();

q_num.innerHTML = questions_increment + 1;
q_numOf.innerHTML = choice.number_of_questions;
q_cat.innerHTML = getUserCategoryChoice();
q_dif.innerHTML = getUserDifficultyChoice();


const question_url = `https://opentdb.com/api.php?amount=${choice.number_of_questions}
${choice.difficulty}&type=multiple${choice.category}`;

fetchQuestions(question_url);

function getCurrentQuestion(questions) {
    if (typeof questions !== 'undefined') {
        const temp_incorrect_ans = [...questions.incorrect_answers];
        const answers = [{
            text: questions.correct_answer,
            correct: true
        }, {
            text: temp_incorrect_ans[0],
            correct: false
        }, {
            text: temp_incorrect_ans[1],
            correct: false
        }, {
            text: temp_incorrect_ans[2],
            correct: false
        }];

        const shuffled_answers = answers.sort(() => Math.random() - .5);
        const current_set = {
            question: questions.question,
            answers: shuffled_answers
        }
        return current_set;
    }

}


function setQuestion(question) {
    resetState(question_container);
    if (typeof question !== 'undefined') {
        question_element.innerHTML = question.question;
        question_container.appendChild(question_element);
        question.answers.forEach(answer => {
            const each_answer = document.importNode(answer_template.content, true)
            const radio = each_answer.querySelector('input');
            radio.id = answer.text
            const label = each_answer.querySelector('label');
            label.className = "answer-label"
            label.htmlFor = radio.id;
            label.innerHTML = answer.text
            question_container.appendChild(each_answer);
        })
    } else {
        question_element.innerHTML = "Congratulations";
        question_container.appendChild(question_element);

    }
}


function resetState(questionElement) {
    while (questionElement.firstChild) {
        questionElement.removeChild(questionElement.firstChild)
    }
}

function getUserCategoryChoiceValue() {
    for (let i = 0; i < category_radios.length; i += 1) {
        if (category_radios[i].checked === true) {
            return category_radios[i].value;
        }
    }
}
function getUserDifficultyChoiceValue() {
    for (let i = 0; i < category_radios.length; i += 1) {
        if (difficulty_radios[i].checked === true) {
            return difficulty_radios[i].value;
        }
    }
}

function checkSelectedAnswer() {
    let nothing = selected_choices[questions_increment];
    if (typeof nothing !== 'undefined') {
        let selected_choice =
            document.getElementById(selected_choices[questions_increment].text);
        selected_choice.checked = true;
    }
}

