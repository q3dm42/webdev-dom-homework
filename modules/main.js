// modules/main.js
import { fetchComments, getToken, postComment } from "./api.js";
import { renderComments } from "./render.js";
import { formatComments } from "./helpers.js";
import { setComments, commentsArray } from "./commentsData.js";
import { renderLogin } from "./renderLogin.js";
import { renderRegistration } from "./renderRegistration.js";

const loadingMessage = document.querySelector(".loading-message");
// функция setupAddFormHandler отвечает за обработку формы добавления комментария.
// она навешивает обработчик на submit формы, отправляет комментарий на сервер,
// очищает поле ввода и вызывает showCommentsPage для обновления ленты комментариев.
// функция нужна, чтобы при каждом рендере не создавать дублирующиеся обработчики submit на одной и той же форме.
function setupAddFormHandler() {
  const addForm = document.querySelector(".add-form");
  if (!addForm) return;

  // сброс старых обработчиков (если форма пересоздаётся)
  const newForm = addForm.cloneNode(true);
  addForm.parentNode.replaceChild(newForm, addForm);

  // обработка submit формы (единственное что нормально сработало по SPA-логике)
  newForm.addEventListener("submit", async (e) => {
    e.preventDefault();
    const textInput = newForm.querySelector(".add-form-text");
    if (!getToken()) {
      alert("сначала авторизуйтесь");
      return;
    }
    try {
      await postComment(textInput.value);
      textInput.value = "";
      showCommentsPage();
    } catch (err) {
      alert(err.message);
    }
  });

  // отправка комментария по Ctrl+Enter или Cmd+Enter
  const textInput = newForm.querySelector(".add-form-text");
  if (textInput) {
    textInput.addEventListener("keydown", (event) => {
      if ((event.ctrlKey || event.metaKey) && event.key === "Enter") {
        event.preventDefault();
        newForm.requestSubmit();
      }
    });
  }
}

// функция showCommentsPage отвечает за загрузку и отображение ленты комментариев.
// она показывает сообщение о загрузке, получает комментарии с сервера, вызывает рендер комментариев,
// показывает форму для добавления (если пользователь авторизован) и навешивает обработчик на форму.
function showCommentsPage() {
  loadingMessage.classList.add("active");
  fetchComments()
    .then((data) => {
      setComments(formatComments(data.comments));
      renderComments(commentsArray, {
        isAuthorized: !!getToken(),
        onAuthClick: showLoginPage,
      });
      if (getToken()) {
        const addForm = document.querySelector(".add-form");
        if (addForm) addForm.style.display = "";
      }
      setupAddFormHandler();
    })
    .catch((error) => {
      alert(error.message);
      console.error(error);
    })
    .finally(() => {
      loadingMessage.classList.remove("active");
    });
}

// функция showLoginPage отображает форму логина.
// после успешного входа вызывает showCommentsPage для отображения ленты комментариев.
function showLoginPage() {
  renderLogin({
    onLogin: () => {
      showCommentsPage();
    },
    onToRegister: showRegistrationPage,
    errorMessage: "",
  });
}

// функция showRegistrationPage отображает форму регистрации.
// после успешной регистрации вызывает showCommentsPage для отображения ленты комментариев.
function showRegistrationPage() {
  renderRegistration({
    onRegister: () => {
      showCommentsPage();
    },
    onToLogin: showLoginPage,
    errorMessage: "",
  });
}

// при загрузке страницы вызывается showCommentsPage для отображения ленты комментариев.
document.addEventListener("DOMContentLoaded", () => {
  showCommentsPage();
});
