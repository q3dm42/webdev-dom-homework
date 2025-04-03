export function formatComments(comments) {
  return comments.map((comment) => ({
    name: comment.author.name,
    date: new Date(comment.date).toLocaleString("ru-RU", {
      day: "2-digit",
      month: "2-digit",
      year: "2-digit",
      hour: "2-digit",
      minute: "2-digit",
    }),
    text: comment.text,
    likes: comment.likes,
    liked: comment.isLiked,
    id: comment.id,
  }));
}

// очистка полей ввода после добавления комментария
export function clearInputFields(nameInput, textInput, updateButtonState) {
  nameInput.value = "";
  textInput.value = "";
  updateButtonState();
}

// очистка от пробелов и проверка на количество символов
export function checkFields(nameInput, textInput) {
  const name = nameInput.value.trim();
  const text = textInput.value.trim();
  return name.length >= 3 && text !== "";
}
