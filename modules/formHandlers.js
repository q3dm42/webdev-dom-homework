import { postComment, fetchComments } from "./api.js";
import { renderComments } from "./render.js";
import { formatComments, clearInputFields, checkFields, addFormEventListeners } from "./helpers.js";
import { sanitizeInput } from "./sanitize.js";
import { commentsArray, setComments } from "./commentsData.js";

// получение ссылок на элементы формы
const addButton = document.querySelector(".add-form-button");
const nameInput = document.querySelector(".add-form-name");
const textInput = document.querySelector(".add-form-text");
const addingMessage = document.querySelector(".adding-message");

// обработчики событий для ввода имени и текста комментария
export function initializeForm() {
  addFormEventListeners(nameInput, textInput, addButton, checkSubmit, updateButtonState);
}

// проверка и отправка формы
async function checkSubmit() {
  if (checkFields(nameInput, textInput)) {
    const inputValue = sanitizeInput(nameInput.value);
    const areaFormValue = sanitizeInput(textInput.value);

    addingMessage.classList.add("active");
    addButton.disabled = true;
    document.querySelector(".add-form").classList.add("hidden");

    try {
      // для теста 500 ошибки раскомментить true - третий параметр forceError
      await postComment(inputValue, areaFormValue /*, true*/);
      const data = await fetchComments();
      setComments(formatComments(data.comments));
      renderComments(commentsArray);
      clearInputFields(nameInput, textInput, updateButtonState);
    } catch (error) {
      alert(error.message);
    } finally {
      addingMessage.classList.remove("active");
      addButton.disabled = false;
      document.querySelector(".add-form").classList.remove("hidden");
    }
  } else {
    alert("Имя и комментарий должны быть не короче 3 символов");
  }
}

// обновление состояния кнопки отправки
export function updateButtonState() {
  addButton.disabled = !checkFields(nameInput, textInput);
}
