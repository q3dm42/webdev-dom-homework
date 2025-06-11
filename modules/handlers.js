import { getToken, postComment } from "./api.js";
import { commentsArray } from "./commentsData.js";
import { renderComments } from "./render.js";


// добавляет обработчик лайков ко всем кнопкам .like-button
export function addLikeHandler({ isAuthorized }) {
  document.querySelectorAll(".like-button").forEach((btn) => {
    btn.onclick = async () => {
      if (!isAuthorized) {
        alert("Сначала авторизуйтесь, чтобы лайкать комментарии");
        return;
      }
      const index = btn.dataset.index;
      btn.classList.add("rotating");
      commentsArray[index].isLikeLoading = true;
      setTimeout(() => {
        if (!commentsArray[index].liked) {
          commentsArray[index].likes++;
        } else {
          commentsArray[index].likes--;
        }
        commentsArray[index].liked = !commentsArray[index].liked;
        commentsArray[index].isLikeLoading = false;
        btn.classList.remove("rotating");
        renderComments(commentsArray, { isAuthorized, onAuthClick: () => {} });
        addLikeHandler({ isAuthorized });
        addQuoteHandler();
      }, 2000);
    };
  });
}

// обработчик цитирования ко всем .comment-text
export function addQuoteHandler() {
  document.querySelectorAll(".comment-text").forEach((el, idx) => {
    el.onclick = () => {
      const addForm = document.querySelector(".add-form");
      if (!addForm) return;
      const textarea = addForm.querySelector(".add-form-text");
      if (!textarea) return;
      const comment = commentsArray[idx];
      textarea.value = `> ${comment.text.replace(/<br>/g, "\n")}\n${comment.name}, `;
      textarea.focus();
    };
  });
}

// обработчик формы добавления комментария
export function addCommentHandler(refreshComments) {
  const addForm = document.querySelector(".add-form");
  if (!addForm) return;
  // сбрасываем старые обработчики
  const newForm = addForm.cloneNode(true);
  addForm.parentNode.replaceChild(newForm, addForm);

  newForm.addEventListener("submit", async (e) => {
    e.preventDefault();
    const textInput = newForm.querySelector(".add-form-text");
    if (!getToken()) {
      alert("Сначала авторизуйтесь");
      return;
    }
    try {
      await postComment(textInput.value);
      textInput.value = "";
      refreshComments();
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
