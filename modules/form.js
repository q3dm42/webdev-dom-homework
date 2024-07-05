import { postComment, fetchComments } from './api.js';
import { renderComments } from './render.js';

//получение ссылок на элементы формы
const commentForm = document.querySelector('.add-form');
const addButton = document.querySelector('.add-form-button');
const nameInput = document.querySelector('.add-form-name');
const textInput = document.querySelector('.add-form-text');
const addingMessage = document.querySelector('.adding-message');

//обработчики событий для ввода имени и текста комментария
export function initializeForm(comments) {
    nameInput.addEventListener('input', updateButtonState);
    textInput.addEventListener('input', updateButtonState);
    addButton.addEventListener('click', () => checkSubmit(comments));
    textInput.addEventListener('keyup', (event) => {
        if (event.key === 'Enter' && event.shiftKey) {
            checkSubmit(comments);
            event.preventDefault();
        }
    });
}

//проверка полей ввода
function checkSubmit(comments) {
    if (checkFields()) {
        const inputValue = sanitizeInput(nameInput.value);
        const areaFormValue = sanitizeInput(textInput.value);

        addingMessage.classList.add('active');
        addButton.disabled = true;
        postComment(inputValue, areaFormValue)
            .then(() => {
                clearInputFields();
                return fetchComments();
            })
            .then(data => {
                comments = formatComments(data.comments);
                renderComments(comments);
                addButton.disabled = false;
                addButton.textContent = "Написать";
            })
            .finally(() => {
                commentForm.classList.remove('hidden');
                addingMessage.classList.remove('active');
            })
            .catch(error => {
                console.error('Ошибка при добавлении комментария:', error);
                addButton.disabled = false;
                addButton.textContent = "Написать";
                alert(error.message);
            });
    } else {
        alert("Имя должно быть не короче 3-х символов и комментарий не должен быть пустым.");
    }
}

//форматирование даты и перебор массива
export function formatComments(comments) {
    return comments.map(comment => ({
        name: comment.author.name,
        date: new Date(comment.date).toLocaleString('ru-RU', {
            day: '2-digit',
            month: '2-digit',
            year: '2-digit',
            hour: '2-digit',
            minute: '2-digit'
        }),
        text: comment.text,
        likes: comment.likes,
        liked: comment.isLiked,
        id: comment.id,
    }));
}

//защита полей от использования тегов
function sanitizeInput(input) {
    return input.replaceAll('&', '&amp;')
        .replaceAll('<', '&lt;')
        .replaceAll('>', '&gt;')
        .replaceAll('"', '&quot;')
        .replaceAll('\n', '<br>');
}

//очистка полей ввода после успешного добавления комментария
function clearInputFields() {
    nameInput.value = '';
    textInput.value = '';
    updateButtonState();
}

//обновление состояния кнопки отправки 
function updateButtonState() {
    addButton.disabled = !checkFields();
}

//очистка от пробелов и проверка на количество символов
function checkFields() {
    const name = nameInput.value.trim();
    const text = textInput.value.trim();
    return name.length >= 3 && text !== '';
}