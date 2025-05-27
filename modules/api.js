const apiUrl = "https://wedev-api.sky.pro/api/v1/sergei-smirnov/comments";

//запостить коммент
export async function postComment(name, text, forceError = false) {
  try {
    const response = await fetch(apiUrl, {
      method: "POST",
      headers: {},
      body: JSON.stringify({
        name: name,
        text: text,
        ...(forceError ? { forceError: true } : {}),
      }),
    });
    if (response.status === 400) {
      const data = await response.json();
      throw new Error(
        data.message || "Имя и комментарий должны быть не короче 3 символов"
      );
    }
    if (response.status === 500) {
      throw new Error("Сервер сломался, попробуй позже");
    }
    if (response.status === 201) {
      return response.json();
    }
  } catch (error) {
    if (error instanceof TypeError) {
      throw new Error("Кажется, у вас сломался интернет, попробуйте позже");
    }
    throw error;
  }
}

//получить комменты с сервера
export async function fetchComments() {
  try {
    const response = await fetch(apiUrl);
    if (response.status === 500) {
      throw new Error("Сервер сломался, попробуй позже");
    }
    return response.json();
  } catch (error) {
    if (error instanceof TypeError) {
      throw new Error("Кажется, у вас сломался интернет, попробуйте позже");
    }
    throw error;
  }
}
