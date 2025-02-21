//variable buat dipanggil
const icon = {
  iconPath: '/assets/img/icon.jpg',
  cssPath: '/assets/css/style.css',
};

const { Sequelize, QueryTypes } = require('sequelize');
const config = require('../config/config.js');
const { Query } = require('pg');
require('dotenv').config();
const sequelize = new Sequelize(config[process.env.NODE_ENV]);

let blogs = [];

//array blogs awal
// let blogs = [
//   {
//     title: 'Pasar Coding Indonesia',
//     content:
//       "Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries,",
//     image: '/img/cars.jpg',
//     author: 'Rafli Kurniawan',
//     postedAt: new Date(),
//   },
// ];
// Function buat render index
function renderIndex(req, res) {
  res.render('index', {
    //^^ index ini nama hbs nya,
    title: 'Home', //ini variable yang dimasukin ke index ketika render
    currentPage: 'home', //ini variable yang dimasukin ke index ketika render
    ...icon, //ini masukin object yang isinya variable statis
  });
}

function renderProject(req, res) {
  res.render('myproject', {
    title: 'My Project',
    currentPage: 'myproject',
    ...icon,
  });
}

async function renderBlog(req, res) {
  // console.log(blogs); //console log di terminal server buat liat array blogs nya
  const blogs = await sequelize.query('SELECT * FROM "Blogs"', {
    type: QueryTypes.SELECT,
  });
  console.log(blogs);
  res.render('blog', {
    blogs: blogs,
    title: 'Blog',
    currentPage: 'blog',
    ...icon,
  });
}

function renderCreateBlog(req, res) {
  res.render('blog-add', {
    title: 'Add Blog',
    currentPage: 'addblog',
    ...icon,
  });
}

async function createBlog(req, res) {
  const { title, content } = req.body; //ngambil title sama content dari body, essentially "title = req.body.title"

  let image = 'https://i.redd.it/show-me-your-silly-cats-v0-wplu39sp6l1d1.jpg?width=4032&format=pjpg&auto=webp&s=9970c7152419d80629bc8a7e94ea556b9779f833';

  let query = `INSERT INTO "Blogs" (title, content, image)
              VALUES('${title}','${content}','${image}')
  `;

  const newBlog = await sequelize.query(query, {
    type: QueryTypes.INSERT,
  });

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
  const query = `SELECT * FROM "Blogs" WHERE id = ${id}`;
  const chosenBlog = await sequelize.query(query, { type: QueryTypes.SELECT });
  // const chosenBlog = blogs[id]; //chosenBlog ngambil id dari blogs, misal index 0 = blog[0]
  res.render('blog-detail', {
    blog: chosenBlog[0], //nampilin blog
    title: 'Blog Details',
    currentPage: 'blog',
    ...icon,
  });
}

async function deleteBlog(req, res) {
  const id = req.params.id; //params yang /:id di blog
  // const chosenBlog = blogs[id]
  // console.log(chosenBlog)
  // blogs.splice(id, 1); //method splice, id = index nya, 1 = berapa item yang didelete
  const query = `DELETE FROM "Blogs" WHERE id = ${id} `;
  const deleteResult = await sequelize.query(query, { type: QueryTypes.DELETE });
  res.redirect('/blog');
}

async function updateBlog(req, res) {
  const id = req.params.id; //params yang /:id di blog
  const { title, content } = req.body; //ngambil title sama content dari body, essentially "title = req.body.title"
  // let image = 'https://i.redd.it/show-me-your-silly-cats-v0-wplu39sp6l1d1.jpg?width=4032&format=pjpg&auto=webp&s=9970c7152419d80629bc8a7e94ea556b9779f833';
  // let updatedBlog = {
  //   title: title,
  //   content: content,
  //   image: image,
  //   author: 'Rafli',
  //   postedAt: new Date(),
  // };
  // blogs[id] = updatedBlog; // blogs[id] atau blog yang index nya lagi dibuka diupdate dengan object updatedBlog
  // parsedDate = newDate().toISOString()
  const query = `UPDATE "Blogs"
                SET title='${title}', content='${content}', "updatedAt"='${new Date().toISOString()}'
                WHERE id=${id};
  `;
  const updateResult = await sequelize.query(query, { type: QueryTypes.UPDATE });
  res.redirect('/blog');
}

async function renderBlogEdit(req, res) {
  const id = req.params.id; //params yang /:id di blog
  // const chosenBlog = blogs[id]; //blog yang dipilih = blogs[index] id nya dari params, params nya dari index, lempar lemparan pokoknya, tar juga lu ngerti 😌
  const query = `SELECT * FROM "Blogs" WHERE id = ${id}`;
  const chosenBlog = await sequelize.query(query, { type: QueryTypes.SELECT });
  res.render('blog-edit', {
    blog: chosenBlog[0],
    // index: id, // ga perlu karena udah ga make index dari array, melainkan ambil dari db
    title: 'Edit Blog',
    ...icon,
  });
}

function renderTestimonial(req, res) {
  res.render('testimonial', {
    title: 'Testimonials',
    currentPage: 'testimonial',
    ...icon,
  });
}

function renderForm(req, res) {
  res.render('form', {
    title: 'Contact',
    currentPage: 'form',
    ...icon,
  });
}

//cara exports modul yang sudah dibuat
module.exports = {
  renderIndex,
  renderProject,
  /*renderBlog, */
  /*renderBlogDetail,*/
  renderBlogEdit,
  renderCreateBlog,
  createBlog,
  deleteBlog,
  updateBlog,
  renderTestimonial,
  renderForm,
};
