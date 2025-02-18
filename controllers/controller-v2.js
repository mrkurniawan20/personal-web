const icon = {
  iconPath: '/img/icon.jpg',
  cssPath: '/css/style.css',
};
// let blogs = []; kalo blogs:blogs ambil dari sini

const { Sequelize } = require('sequelize'); //pake sequlize biar ga pake raw query kaya di controller v1
const bcrypt = require('bcrypt'); //pake bcrypt buat enkripsi

const config = require('../config/config.json'); //ambil config
const { Blog, User } = require('../models'); //ambil Blog, sama User, ini table yang ada di sql

const saltRounds = 10; //Untuk hashing berapa kali, sebenernya gausah dikasih vairable juga bisa, langusng angka di function
// const { renderBlogEdit } = require('./controller-v1');
const sequelize = new Sequelize(config.development); //const sequelize buat masukin config ke function sequelize

async function renderIndex(req, res) {
  const user = await req.session.user;
  res.render('index', {
    currentPage: 'home',
    user: user,
    ...icon,
  });
}
async function renderLogin(req, res) {
  const user = await req.session.user;
  res.render('auth-login', {
    user: user,
    currentPage: 'login',
    ...icon,
  });
}
async function renderRegister(req, res) {
  res.render('auth-register', {
    currentPage: 'register',
    ...icon,
  });
}

async function authLogin(req, res) {
  const { email, password } = req.body;
  // console.log(req.body);
  const user = await User.findOne({
    where: {
      email: email,
    },
  });
  //check kalau usernya ada
  if (!user) {
    req.flash('error', 'User does not exist');
    return res.redirect('/login');
  }

  //check kalau password salah
  const isValidated = await bcrypt.compare(password, user.password);

  if (!isValidated) {
    req.flash('error', 'Password incorrect');
    return res.redirect('/login');
  }
  let loggedInUser = user.toJSON();
  console.log(loggedInUser);
  //hapus passowrd di session
  delete loggedInUser.password;
  console.log(loggedInUser);

  req.session.user = loggedInUser;
  req.flash('success', `Login Succeed, Welcome ${loggedInUser.name}`);
  res.redirect('/');
}

async function authRegister(req, res) {
  const { name, email, password, confirmPassword } = req.body;
  if (password != confirmPassword) {
    req.flash('error', 'Password is not the same');
    return res.redirect('/register');
  }
  const user = await User.findOne({
    where: {
      email: email,
    },
  });
  if (user) {
    req.flash('error', 'Email already exist');
    return res.redirect('/register');
  }

  const hashedPassword = await bcrypt.hash(password, saltRounds);
  const newUser = {
    name,
    email,
    password: hashedPassword,
  };

  const insertUser = await User.create(newUser);
  req.flash('success', 'Register succeed!');
  res.redirect('/login');
}

async function authLogout(req, res) {
  //hapus user dari session
  req.session.user = null;
  res.redirect('/login');
}

async function renderBlog(req, res) {
  const user = await req.session.user;
  const blogs = await Blog.findAll({
    order: [['createdAt', 'DESC']],
  });
  //   console.log(blogs);
  res.render('blog', {
    user: user,
    currentPage: 'blog',
    blogs: blogs,
    ...icon,
  });
}
async function renderCreateBlog(req, res) {
  const user = await req.session.user;
  //   console.log(blogs);
  res.render('blog-add', {
    user: user,
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
  const user = await req.session.user;
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
    user: user,
    blog: chosenBlog, //nampilin blog
    title: 'Blog Details',
    currentPage: 'blog',
    ...icon,
  });
}

async function renderBlogEdit(req, res) {
  const id = req.params.id;
  const user = await req.session.user;
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
    user: user,
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

async function renderProject(req, res) {
  const user = await req.session.user;
  res.render('myproject', {
    user: user,
    title: 'My Project',
    currentPage: 'myproject',
    ...icon,
  });
}

async function renderTestimonial(req, res) {
  const user = await req.session.user;
  res.render('testimonial', {
    user: user,
    title: 'Testimonials',
    currentPage: 'testimonial',
    ...icon,
  });
}

async function renderForm(req, res) {
  const user = await req.session.user;
  res.render('form', {
    user: user,
    title: 'Contact',
    currentPage: 'form',
    ...icon,
  });
}
module.exports = {
  renderIndex,
  renderLogin,
  renderRegister,
  authLogin,
  authRegister,
  authLogout,
  renderBlog,
  renderBlogDetail,
  renderBlogEdit,
  renderCreateBlog,
  renderProject,
  renderTestimonial,
  renderForm,
  createBlog,
  deleteBlog,
  updateBlog,
};
