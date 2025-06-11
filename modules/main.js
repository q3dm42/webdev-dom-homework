// modules/main.js
import { fetchComments, getToken } from "./api.js";
import { renderComments } from "./render.js";
import { formatComments } from "./helpers.js";
import { setComments, commentsArray } from "./commentsData.js";
import { renderLogin } from "./renderLogin.js";
import { renderRegistration } from "./renderRegistration.js";
import {
  addLikeHandler,
  addQuoteHandler,
  addCommentHandler,
} from "./handlers.js";

const loadingMessage = document.querySelector(".loading-message");

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
      // навешиваем обработчики событий
      addLikeHandler({ isAuthorized: !!getToken() });
      addQuoteHandler();
      addCommentHandler(showCommentsPage);
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
