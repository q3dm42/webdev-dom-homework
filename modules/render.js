const commentsList = document.querySelector('.comments');

//рендеринг списка комментариев
export function renderComments(commentsArray) {
    commentsList.innerHTML = '';

    if (!commentsArray) return;

    commentsArray.forEach((comment, index) => {
        const li = document.createElement('li');
        li.classList.add('comment');
        li.innerHTML = `
            <div class="comment-header">
                <div>${comment.name}</div>
                <div>${comment.date}</div>
            </div>
            <div class="comment-body">
                <div class="comment-text">${comment.text}</div>
            </div>
            <div class="comment-footer">
                <div class="likes">
                    <span class="likes-counter">${comment.likes}</span>
                    <button class="like-button${comment.liked ? ' -active-like' : ''}" data-index="${index}"></button>
                </div>
            </div>
        `;
        commentsList.appendChild(li);

        const likeButton = li.querySelector('.like-button');
        likeButton.addEventListener('click', () => {
            toggleLike(index, commentsArray)
                .then(() => {
                    renderComments(commentsArray);
                })
                .catch(error => {
                    console.error('Ошибка при переключении лайка:', error);
                });
        });
    });
}

//имитация лайка с анимамацией
export function toggleLike(index, comments) {
    const comment = comments[index];
    comment.isLikeLoading = true;

    return new Promise(resolve => {
        const likeButton = document.querySelector(`.like-button[data-index="${index}"]`);
        likeButton.classList.add('rotating');

        setTimeout(() => {
            if (!comment.liked) {
                comment.likes++;
            } else {
                comment.likes--;
            }
            comment.liked = !comment.liked;
            comment.isLikeLoading = false;

            likeButton.classList.remove('rotating');
            resolve();
        }, 2000);
    });
}