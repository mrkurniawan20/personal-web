const icon = {
  iconPath: '/img/icon.jpg',
  cssPath: '/css/style.css',
};
// let blogs = []; kalo blogs:blogs ambil dari sini

const { Sequelize } = require('sequelize');

const config = require('../config/config.json');
const { Blog } = require('../models');
// const { renderBlogEdit } = require('./controller-v1');
const sequelize = new Sequelize(config.development);

async function renderBlog(req, res) {
  const blogs = await Blog.findAll({
    order: [['createdAt', 'DESC']],
  });
  //   console.log(blogs);
  res.render('blog', {
    currentPage: 'blog',
    blogs: blogs,
    ...icon,
  });
}
async function renderCreateBlog(req, res) {
  //   console.log(blogs);
  res.render('blog-add', {
    title: 'Add Blog',
    currentPage: 'addblog',
    blogs: Blog, //blog ambil dari models kalau ambil dari array(line 5) dia ambilnya "blogs" sama aja sebenernya
    ...icon,
  });
}

async function createBlog(req, res) {
  const { title, content } = req.body; //ngambil title sama content dari body, essentially "title = req.body.title"

  let dummyImage = 'https://i.redd.it/show-me-your-silly-cats-v0-wplu39sp6l1d1.jpg?width=4032&format=pjpg&auto=webp&s=9970c7152419d80629bc8a7e94ea556b9779f833';

  const newBlog = {
    title, //title : title
    content, //samme^, just using cleaner way
    image: dummyImage, //still using variable karena variable nya beda sama sql
  };
  const resultSubmit = await Blog.create(newBlog);
  console.log(resultSubmit);
  // let newBlog = {
  //   title: title,
  //   content: content,
  //   image: image,
  //   author: 'Rafli',
  //   postedAt: new Date(),
  // }; //newBlog ambil dari isi
  // blogs.push(newBlog); //method push buat masukin newBlog ke array blogs
  res.redirect('/blog'); //redirect, ke url /blog
}

async function renderBlogDetail(req, res) {
  const id = req.params.id; //params yang /:id di blog
  const chosenBlog = await Blog.findOne({
    where: {
      id: id,
    },
  });

  if (chosenBlog === null) {
    res.render('page-404');
  }
  // const chosenBlog = blogs[id]; //chosenBlog ngambil id dari blogs, misal index 0 = blog[0]
  res.render('blog-detail', {
    //UPDATE:  TIPE DATA TIDAK PERLU PAKE INDEX KAYA PAKE V1, KARENA TIPE DATANYA SUDAH OBJECT, BUKAN ARRAY
    blog: chosenBlog, //nampilin blog
    title: 'Blog Details',
    currentPage: 'blog',
    ...icon,
  });
}

async function renderBlogEdit(req, res) {
  const id = req.params.id;
  const chosenBlog = await Blog.findOne({
    where: {
      id: id,
    },
  });
  if (chosenBlog === null) {
    res.render('page-404');
  }
  // const chosenBlog = blogs[id]; //chosenBlog ngambil id dari blogs, misal index 0 = blog[0]
  res.render('blog-edit', {
    //UPDATE:  TIPE DATA TIDAK PERLU PAKE INDEX KAYA PAKE V1, KARENA TIPE DATANYA SUDAH OBJECT, BUKAN ARRAY
    blog: chosenBlog, //nampilin blog
    title: 'Blog Details',
    currentPage: 'blog',
    ...icon,
  });
}

async function deleteBlog(req, res) {
  const { id } = req.params;
  const deleteResult = await Blog.destroy({
    where: {
      id: id,
    },
  });
  res.redirect('/blog');
}

async function updateBlog(req, res) {
  const id = req.params.id;
  const { title, content } = req.body;

  const updateResult = await Blog.update(
    {
      title,
      content,
      updatedAt: sequelize.fn('NOW'),
    },
    {
      where: {
        id,
      },
    }
  );
  res.redirect('/blog');
}

module.exports = { renderBlog, renderBlogDetail, createBlog, renderCreateBlog, deleteBlog, updateBlog, renderBlogEdit };
