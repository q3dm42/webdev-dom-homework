const apiUrl = "https://wedev-api.sky.pro/api/v1/sergei-smirnov/comments";

//запостить коммент
export function postComment(name, text) {
  return fetch(apiUrl, {
    method: "POST",
    headers: {
      // 'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      name: name,
      text: text,
      //forceError: true
    }),
  }).then((response) => {
    if (response.status === 400) {
      return response.json().then((data) => {
        throw new Error(data.message || "Вы ввели имя короче 3-х символов");
      });
    }
    if (response.status === 500) {
      throw new Error("Ошибка сервера");
    }
    if (response.status === 201) {
      return response.json();
    }
  });
}

//получить комменты с сервера
export function fetchComments() {
  return fetch(apiUrl).then((response) => {
    if (response.status === 500) {
      throw new Error("Сервер поломался");
    }
    return response.json();
  });
}
