let blogs = [];

function addBlog(event) {
  event.preventDefault();

  let title = document.getElementById('title').value;
  let content = document.getElementById('content').value;
  let image = document.getElementById('image');

  let imageFileName = URL.createObjectURL(image.files[0]);

  let blog = {
    title: title,
    content: content,
    image: imageFileName,
    author: 'Rafli Kurniawan',
    postedAt: new Date(),
  };
  blogs.push(blog);

  console.log(blogs);

  renderBlog();
}

function renderBlog() {
  let blogListElement = document.getElementById('blogList');

  blogListElement.innerHTML = firstBlogContent();

  for (let index = 0; index < blogs.length; index++) {
    console.log(blogs[index]);

    blogListElement.innerHTML += `
            <article class="blog-item">
                <div class="blog-image">
                    <img src="/assets/${blogs[index].image}" width="100%" alt="">
                </div>
                <div class="blog-article">
                <div class="blog-item-button">
            <button class="edit">Edit Blog</button>
            <button class="push">Push Blog</button>   
          </div>
                    <h2>${blogs[index].title}</h2>
                    <p class='datetime'>${formatDateToWIB()} | ${blogs[index].author}</p>
                    <p>${blogs[index].content}</p>
                    <p class='relative-time-blog'>${getRelativeTime(blogs[index].postedAt)}</p>
                </div>
            </article>
        `;
  }
}
function firstBlogContent() {
  return `
        <article class="blog-item">
        <div class="blog-image">
          <img src="/assets/img/cars.jpg" width="100%" alt="" />
        </div>
        <div class="blog-article">
          <div class="blog-item-button">
            <button class="edit">Edit Blog</button>
            <button class="push">Push Blog</button>
          </div>
          <h2>Judul Baru</h2>
          <p class="datetime">30 Jan 2025 11:45 | Muhammad Rafli Kurniawan</p>
          <p>
            Lorem, ipsum dolor sit amet consectetur adipisicing elit. Magni, inventore? Similique atque aliquid veritatis pariatur repellendus. Magni illo autem harum molestiae fuga hic quas facere possimus dolorum dolor? Eligendi, quod
            dolores cumque placeat blanditiis ratione. Omnis necessitatibus excepturi deleniti? Pariatur excepturi quaerat magni! Maxime optio possimus eaque atque, corporis laudantium!
          </p>
          <p class="relative-time-blog">1 day ago</p>
        </div>
      </article>
    `;
}

renderBlog();

function formatDateToWIB() {
  let date = new Date();
  let monthList = ['Jan', 'Feb', 'Mar', 'Apr', 'Mei', 'Jun', 'Jul', 'Agu', 'Sep', 'Okt', 'Nov', 'Des'];
  let day = date.getDate().toString().padStart(2, '0');
  let month = monthList[date.getMonth()];
  let year = date.getFullYear();
  let hours = date.getHours().toString().padStart(2, '0');
  let minutes = date.getMinutes().toString().padStart(2, '0');

  formattedDate = `${day} ${month} ${year} ${hours}:${minutes}`;
  return formattedDate;
}

function getRelativeTime(postTime) {
  let now = new Date();
  console.log('Waktu Sekarang : ', now);
  console.log('Waktu User Post : ', postTime);

  let diffTime = now - postTime;
  console.log('selisih waktu : ', diffTime);

  let diffInSec = Math.floor((now - postTime) / 1000);
  console.log('selisih detik : ', diffInSec);
  if (diffInSec < 60) {
    // return `${diffInSec} seconds ago`;
    return `${diffInSec} second${diffInSec === 1 ? '' : 's'} ago`;
  }

  let diffInMin = Math.floor(diffInSec / 60);
  console.log('selisih menit ', diffInMin);
  if (diffInMin < 60) {
    // return `${diffInMin} minutes ago`;
    return `${diffInMin} minute${diffInMin === 1 ? '' : 's'} ago`;
  }

  let diffInHour = Math.floor(diffInMin / 60);
  console.log('selisih jam ', diffInHour);
  if (diffInHour < 24) {
    // return `${diffInHour} hours ago`;
    return `${diffInHour} hour${diffInHour === 1 ? '' : 's'} ago`;
  }

  let diffInDay = Math.floor(diffInHour / 24);
  console.log('selisih hari', diffInDay);
  if (diffInDay < 30) {
    // return `${diffInDay} days ago`;
    return `${diffInDay} day${diffInDay === 1 ? '' : 's'} ago`;
  }

  let diffInMonth = Math.floor(diffInDay / 30);
  return `${diffInMonth} month${diffInMonth === 1 ? '' : 's'} ago`;
}
