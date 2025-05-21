const apiUrl = "https://wedev-api.sky.pro/api/v1/sergei-smirnov/comments";

//запостить коммент
export async function postComment(name, text) {
  const response = await fetch(apiUrl, {
    method: "POST",
    headers: {},
    body: JSON.stringify({
      name: name,
      text: text,
    }),
  });
  if (response.status === 400) {
    const data = await response.json();
    throw new Error(data.message || "Вы ввели имя короче 3-х символов");
  }
  if (response.status === 500) {
    throw new Error("Ошибка сервера");
  }
  if (response.status === 201) {
    return response.json();
  }
}

//получить комменты с сервера
export async function fetchComments() {
  const response = await fetch(apiUrl);
  if (response.status === 500) {
    throw new Error("Сервер поломался");
  }
  return response.json();
}
