import { fetchComments } from './api.js';
import { renderComments } from './render.js';
import { initializeForm, formatComments } from './form.js';

const loadingMessage = document.querySelector('.loading-message');

document.addEventListener('DOMContentLoaded', () => {
    let comments = [];
    loadingMessage.classList.add('active');

    //получаем комментарии и дату с сервера с последующим форматированием и сохранением в массив
    fetchComments()
        .then(data => {
            comments = formatComments(data.comments);
            renderComments(comments);
        })
        .finally(() => {
            loadingMessage.classList.remove('active');
        })
        .catch(error => {
            if (error.message === "Сервер поломался") {
                alert("Сервер поломался, попробуйте позже");
                document.querySelector('.loading-message').textContent = "Комментарии не загрузились";
            } else {
                alert("Ошибка при загрузке комментариев, попробуйте позже");
                console.error(error);
            }
        });

    initializeForm(comments);

});