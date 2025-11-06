// Tạo bài viết
function submitPost() {
  const title = document.getElementById('title').value;
  const content = document.getElementById('content').value;
  const imageInput = document.getElementById('image');
  const file = imageInput.files[0];

  if (title && content) {
    if (file) {
      const reader = new FileReader();
      reader.onload = function (e) {
        const imageData = e.target.result;
        savePost(title, content, imageData);
      };
      reader.readAsDataURL(file);
    } else {
      savePost(title, content, null);
    }
  } else {
    alert('Vui lòng nhập đầy đủ tiêu đề và nội dung!');
  }
}

function savePost(title, content, imageData) {
  const post = {
    id: Date.now(),
    title,
    content,
    image: imageData,
    comments: []
  };
  const posts = JSON.parse(localStorage.getItem('posts')) || [];
  posts.push(post);
  localStorage.setItem('posts', JSON.stringify(posts));
  window.location.href = 'posts.html';
}

// Hiển thị danh sách bài viết + nút Comment + nút Xóa
if (window.location.pathname.includes('posts.html')) {
  const postList = document.getElementById('post-list');
  let posts = JSON.parse(localStorage.getItem('posts')) || [];

  function renderPosts() {
    const postList = document.getElementById('post-list');
    const posts = JSON.parse(localStorage.getItem('posts')) || [];

    postList.innerHTML = '';

    if (posts.length === 0) {
      postList.innerHTML = `
        <div class="text-center text-muted mt-5">
          <p style="font-size: 1.2rem;">Không bài nào được đăng</p>
        </div>
      `;
      return;
    }


    posts.forEach(post => {
      const card = document.createElement('div');
      card.className = 'card mb-3';
      card.innerHTML = `
        <div class="card-body">
          <h5 class="card-title">${post.title}</h5>
          <p class="card-text">${post.content}</p>
          <a href="comment.html?id=${post.id}" class="btn btn-success me-2">Comment</a>
          <button class="btn btn-outline-danger" onclick="deletePost(${post.id})">Xóa</button>
        </div>
      `;

      if (post.image) {
        const img = document.createElement('img');
        img.src = post.image;
        img.alt = 'Ảnh bài viết';
        img.className = 'img-fluid mt-2';
        card.appendChild(img);
      }

      postList.appendChild(card);
    });
  }


  window.deletePost = function(id) {
    posts = posts.filter(post => post.id !== id);
    localStorage.setItem('posts', JSON.stringify(posts));
    renderPosts();
  };

  renderPosts();
}

// Trang chi tiết bài viết + bình luận
if (window.location.pathname.includes('comment.html')) {
  const urlParams = new URLSearchParams(window.location.search);
  const postId = parseInt(urlParams.get('id'));
  const posts = JSON.parse(localStorage.getItem('posts')) || [];
  const post = posts.find(p => p.id === postId);

  if (post) {
    document.getElementById('post-detail').innerHTML = `
      <div class="card">
        <div class="card-body">
          <h4>${post.title}</h4>
          <p>${post.content}</p>
        </div>
      </div>
    `;

    renderComments(post.comments);
  }

  window.submitComment = function () {
    const input = document.getElementById('comment-input');
    const text = input.value.trim();
    if (text) {
      post.comments.push(text);
      localStorage.setItem('posts', JSON.stringify(posts));
      input.value = '';
      renderComments(post.comments);
    }
  };

  function renderComments(comments) {
    const list = document.getElementById('comment-list');
    list.innerHTML = '';
    comments.forEach(comment => {
      const item = document.createElement('li');
      item.className = 'list-group-item';
      item.textContent = comment;
      list.appendChild(item);
    });
  }
}
