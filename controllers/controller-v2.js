const icon = {
  iconPath: '/img/icon.jpg',
  cssPath: '/css/style.css',
};

const { Sequelize } = require('sequelize');

const config = require('../config/config.json');
const { Blog } = require('../models');
const sequelize = new Sequelize(config.development);

async function renderBlog(req, res) {
  const blogs = await Blog.findAll({
    order: [['createdAt', 'DESC']],
  });
  //   console.log(blogs);
  res.render('blog', {
    blogs: blogs,
    ...icon,
  });
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

async function deleteBlog(req, res) {
  const { id } = req.params;
  const deleteResult = await Blog.destroy({
    where: {
      id: id,
    },
  });
  res.redirect('/blog');
}

module.exports = { renderBlog, renderBlogDetail };
