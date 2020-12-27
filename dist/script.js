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

const final_score = document.querySelector(".final-score");
const attempts = document.querySelector(".attempts");
const attempts_of = document.querySelector(".attemptsOf");
const wrong_answers_ = document.querySelector(".wrong-ans");
const correct_answers_ = document.querySelector(".correct-ans");
const end_of_quiz_background = document.querySelector(".end--quiz--image");


const quiz_container = document.querySelector(".quiz");
const settings_container = document.querySelector(".settings");
const final_container = document.querySelector(".end--quiz");

const q_num = document.getElementById("q-num");
const q_numOf = document.getElementById("q-numOf");
const q_cat = document.getElementById("q-cat");
const q_dif = document.getElementById("q-dif");

const progress = document.querySelector(".progress");
const start_button = document.querySelector(".start--button");
const play_again = document.querySelector(".play--again");

//--- variables for localestorage 
const LOCAL_STORAGE_SELECTED_DIFFICULTY = 'quiz.difficulty';
const LOCAL_STORAGE_SELECTED_CATEGORY = 'quiz.category';
const LOCAL_STORAGE_SELECTED_NUMBER_OF_QUESTIONS = 'quiz.numberOfQuestions';
const LOCAL_STORAGE_SELECTED_DIFFICULTY_RENDER = 'quiz.difficultyRender';
const LOCAL_STORAGE_SELECTED_CATEGORY_RENDER = 'quiz.categoryRender';
let selected_difficulty = localStorage.getItem(LOCAL_STORAGE_SELECTED_DIFFICULTY) || '&difficulty=easy';
let selected_category = localStorage.getItem(LOCAL_STORAGE_SELECTED_CATEGORY) || '&category=anytype';
let selected_number = localStorage.getItem(LOCAL_STORAGE_SELECTED_NUMBER_OF_QUESTIONS) || 10;
let render_difficulty = localStorage.getItem(LOCAL_STORAGE_SELECTED_DIFFICULTY_RENDER) || 'Easy';
let render_category = localStorage.getItem(LOCAL_STORAGE_SELECTED_CATEGORY_RENDER) || 'Any type';

user_dif.innerHTML = render_difficulty;
user_cat.innerHTML = render_category;
user_num.innerHTML = selected_number;

//---number of questions range selector functionality--- 
const setValue = () => {
    const newValue = Number((range.value - range.min)
        * 100 / (range.max - range.min)),
        newPostion = 1 - (newValue * 0.1);
    rangeValue.innerHTML = `<span>${range.value}</span>`;
    rangeValue.style.left = `calc(${newValue}% + 
    (${newPostion}px))`;
    user_num.innerHTML = range.value;
    selected_number = range.value;
    save();
}
document.addEventListener("DOMContentLoaded", setValue);
range.addEventListener('input', setValue);

for (let i = 0; i < category_radios.length; i++) {
    console.log(category_radios[i].dataset.text);
}

//--- user difficulty choice functionality ---
for (let i = 0; i < difficulty_radios.length; i += 1) {
    if (difficulty_radios[i].value === selected_difficulty) {
        difficulty_radios[i].checked = true;
    }
    difficulty_radios[i].addEventListener('click', () => {
        for (let i = 0; i < difficulty_radios.length; i += 1) {
            if (difficulty_radios[i].checked === true) {
                user_dif.innerHTML = getUserDifficultyChoice();
                render_difficulty = getUserDifficultyChoice();
                updateUserChoices();
                save();
            }
        }
    });
}



function getUserDifficultyChoice() {
    for (let i = 0; i < difficulty_radios.length; i += 1) {
        if (difficulty_radios[i].checked === true) {
            return difficulty_radios[i].dataset.text;
        }
    }
}

//--- user category choice functionality ---
for (let i = 0; i < category_radios.length; i += 1) {
    if (category_radios[i].value === selected_category) {
        category_radios[i].checked = true;
    }
    category_radios[i].addEventListener('click', () => {
        for (let j = 0; j < category_radios.length; j += 1) {
            if (category_radios[j].checked === true) {
                user_cat.innerHTML = getUserCategoryChoice();
                render_category = getUserCategoryChoice();
                updateUserChoices();
                save();
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


let questions_increment = 0;
const selected_choices = [];
let width = 0;


const fetchQuestions = async function (url) {
    const response = await fetch(url);
    if (response.status >= 200 && response.status <= 299) {
        const jsonResponse = await response.json();
        console.log(jsonResponse.results)
        const current_question = getCurrentQuestion(jsonResponse.results[questions_increment])
        setQuestion(current_question);

        setInterval(setProgress, 160, jsonResponse.results)

        question_container.addEventListener('click', event => {
            setTimeout(setUserChoices, 1500, event, jsonResponse.results);
        })

    } else {
        console.log(response.status, response.statusText);
    }
}


q_num.innerHTML = questions_increment + 1;
q_numOf.innerHTML = selected_number;

start_button.addEventListener('click', () => {
    const question_url = prepareURL(selected_number, selected_difficulty, selected_category);
    console.log(question_url);
    q_numOf.innerHTML = selected_number;
    q_cat.innerHTML = getUserCategoryChoice();
    q_dif.innerHTML = getUserDifficultyChoice();
    save();
    fetchQuestions(question_url);
    settings_container.style.display = 'none';
    quiz_container.style.display = 'block';
})

play_again.addEventListener('click', () => {
    location.reload();
})

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
            radio.id = answer.text;
            const label = each_answer.querySelector('label');
            label.className = "answer-label"
            label.htmlFor = radio.id;
            label.innerHTML = answer.text
            question_container.appendChild(each_answer);
            if (answer.correct === true) {
                label.classList.add('correct')
            } else {
                label.classList.add('wrong')
            }
        })
    } else {
        displayFinalScreen();
    }
}

function errorLoading(err) {
    resetState(question_container);
    question_element.innerHTML = `${err.status} ${err.statusText}`;
    question_container.appendChild(question_element);
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


function setUserChoices(event, response) {
    if (event.target.tagName.toLowerCase() === 'input') {
        let ans = event.target.id;
        console.log(ans)
        let current_question = getCurrentQuestion(response[questions_increment]);
        let user_choice = current_question.answers.find((answer) => answer.text === ans);
        selected_choices[questions_increment] = user_choice;
        console.log(user_choice);
        questions_increment++;
        current_question = getCurrentQuestion(response[questions_increment]);
        setQuestion(current_question);
        console.log(questions_increment);
        if (questions_increment == selected_number) {
            q_num.innerHTML = selected_number;
        } else {
            q_num.innerHTML = questions_increment + 1;
        }
        width = 0;
    }
}

function setProgress(response) {
    if (width < 100) {
        width++
        progress.style.width = `${width}%`;
    }
    if (width === 100) {
        width = 0
        progress.style.width = `${width}%`;
        const current_question = getCurrentQuestion(response[questions_increment + 1]);
        questions_increment++
        setQuestion(current_question);
        if (questions_increment == selected_number) {
            q_num.innerHTML = selected_number;
        } else {
            q_num.innerHTML = questions_increment + 1;
        }
    }
    if (questions_increment == selected_number) {
        clearInterval();
        width = 101;
        progress.style.width = `0`;
    }
}


function save() {
    localStorage.setItem(LOCAL_STORAGE_SELECTED_DIFFICULTY, selected_difficulty);
    localStorage.setItem(LOCAL_STORAGE_SELECTED_CATEGORY, selected_category);
    localStorage.setItem(LOCAL_STORAGE_SELECTED_NUMBER_OF_QUESTIONS, selected_number);
    localStorage.setItem(LOCAL_STORAGE_SELECTED_DIFFICULTY_RENDER, render_difficulty);
    localStorage.setItem(LOCAL_STORAGE_SELECTED_CATEGORY_RENDER, render_category);
}

function updateUserChoices() {
    selected_number = range.value;
    selected_difficulty = getUserDifficultyChoiceValue();
    selected_category = getUserCategoryChoiceValue();
}

function prepareURL(num, diff, cat) {
    if (diff === "&difficulty=anytype") {
        diff = "";
    }
    if (cat === "&category=anytype") {
        cat = ""
    }
    const url = `https://opentdb.com/api.php?amount=${num}${diff}&type=multiple${cat}`;
    return url;
}

function getScoreString(num) {
    const number = num === 1 ? "answer" : "answers";
    return number;
}



function displayFinalScreen() {
    quiz_container.style.display = 'none';
    final_container.style.display = 'block';
    const correct_answers = selected_choices.filter(choice => choice.correct === true);
    const percentage_score = (correct_answers.length / selected_number) * 100;
    if (percentage_score > 79) {
        end_of_quiz_background.style.backgroundImage = 'url("./images/026-medal.png")';
    }
    if (percentage_score <= 79) {
        end_of_quiz_background.style.backgroundImage = 'url("./images/019-medal.png")';
    }
    if (percentage_score <= 69 && percentage_score >= 50) {
        end_of_quiz_background.style.backgroundImage = 'url("./images/049-medal.png")';
    }
    if (percentage_score <= 49) {
        end_of_quiz_background.style.backgroundImage = `none`;
        end_of_quiz_background.style.padding = `0`;
    }
    const attempted = selected_choices.filter(choice => choice !== "");
    final_score.innerHTML = `${Math.floor(percentage_score)}`;
    attempts_of.innerHTML = `${selected_number}`;
    attempts.innerHTML = `${attempted.length}`;
    correct_answers_.innerHTML = `${correct_answers.length} correct ${getScoreString(correct_answers.length)}`;
    const wrong_answers = attempted.length - correct_answers.length;
    wrong_answers_.innerHTML = `${wrong_answers} wrong ${getScoreString(wrong_answers)}`;
}