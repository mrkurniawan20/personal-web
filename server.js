const express = require('express'); //import express sebagai variable
const hbs = require('hbs'); //import handlebars sebagai variable
const app = express(); //assigned semua function yang ada di express sebagai variable
const path = require('path'); //import modul path
const flash = require('express-flash'); //import modul flash untuk ngasih info error/success
const session = require('express-session'); //import modul session untuk kebutuhan session login/authentication
const methodOverride = require('method-override'); //import modul methodOverride (download dulu, dependencies ada di package json)
require('dotenv').config();

// const upload = require('./middlewares/upload-file');
const { formatDateToWIB, getRelativeTime, getDuration } = require('./utils/time'); //import modul dari js time
const {
  /*renderIndex,*/
  /*renderBlog,*/
  /*renderBlogDetail*/
  /*renderBlogEdit*/
  /*createBlog*/
  /*renderProject,*/
  /*renderTestimonial,*/
  /*renderCreateBlog,*/
  /*renderForm,*/
  /*deleteBlog*/
  /*updateBlog*/
} = require('./controllers/controller-v1'); //import modul dari js controller

const {
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
  renderTestimonial,
  renderForm,
  createBlog,
  deleteBlog,
  updateBlog,
  renderProjects,
  createProject,
  renderCreateProject,
  deleteProject,
  updateProject,
  renderProjectEdit,
} = require('./controllers/controller-v2'); //import modul dari js controller
const upload = require('./middlewares/upload-file'); //import middleware/module buat upload image
const checkUser = require('./middlewares/auth'); //import middleware/module buat authentication

const port = process.env.SERVER_PORT || 3000;
// const port = 3000; //port, angkanya assigned bebas, reccomended 4 digits diatas 3000

//bikin variable yang bisa dipanggil
const icon = {
  iconPath: '/assets/img/icon.jpg',
  cssPath: '/assets/css/style.css',
};
('nodemon server.js');

app.set('view engine', 'hbs'); //setting view engine, pake hbs

//modul yang dipake
// app.use(express.static('assets')); //ngasih tau kalo server menggunakan assigned static kaya css,image,js macem assets, di folder 'assets'

app.use('/assets', express.static(path.join(__dirname, './assets'))); //untuk ngasih tujuan direktori assets biar bisa akses semua yang ada disitu(mostyle css and image)
app.use('/uploads', express.static(path.join(__dirname, './uploads'))); //untuk ngasih tujuan direktori uploads yang ada di multer ke direktori uploads yang ada di folder server
app.use(express.json()); //ngasih tau kalo server menggunaka function json
app.use(express.urlencoded({ extended: true })); //ngasih tau kalo server menggunakan urlencoded function buat ambil data dari html method kaya post/get. extended:true buat bisa pake nested array object, crucial buat kalo mau pake method post/get
app.use(methodOverride('_method')); //ngasih tau kalo server menggunakan app(express) pake method patch/delete, pokoknya selain post/get karena html hanya bisa mencerna method post/get
app.use(flash()); //ngasih tau kalo server menggunakan flash setelah di import
app.use(
  session({
    //ngasih tau kalo server menggunakan session
    name: 'my-session', //nama
    secret: 'qwertyuiop', //secret key bebas(?)
    resave: false, //??
    saveUninitialized: true, //??
  })
);

app.set('views', path.join(__dirname, './views')); //setting folder view engine
hbs.registerPartials(__dirname + '/views/partials', function (err) {}); //__dirname buat ngasih tau folder yang mau dituju jadi, BASICALLY DIRNAME ITU FOLDER YANG DIBUKA ^^ YANG DI ATAS BROOOW
hbs.registerHelper('eq', (a, b) => a === b); //helper buat if statement, dipake di html
hbs.registerHelper('formatDateToWIB', formatDateToWIB); //assigned function helper buat dipake di html, '{namanya}', modulnya
hbs.registerHelper('getRelativeTime', getRelativeTime); //assigned function helper buat dipake di html
hbs.registerHelper('truncate', function (str, len) {
  //nama 'truncate' bebas bisa dipakein apa aja, jadi bukan assigned function
  //assigned function helper buat dipake di html, ini buat ngedikitin kalimat di blog atau project
  if (str.length > len) {
    return str.substring(0, len) + `<a href=/blog/${this.id}>....Read more</a>`; //jika isi content(str.length) lebih dari length(ditentuin di handlebars), dia akan return 50(misal len 10) pertama dan sisanya '....Read more'
  }
  return str;
});

//registerHelper durasi project
hbs.registerHelper('getDuration', getDuration);
//registerHelper contain skills
hbs.registerHelper('containsSkill', function (skillSet, skill) {
  if (Array.isArray(skillSet) && skill) {
    //Array.isArray berfungsi untuk ngecek apakah 'skillSet' array atau bukan, kalo misal kosong dia ngasih false, kalo array dia ngasih true, '&& skill' ini artinya buat ngecek juga kalo skill ada isinya maka return command dibawah
    return skillSet.includes(skill);
  }
  return false; //Ngasih false jika keduanya tidak terpenuhi(misal skillSet atau skill kosong)
});

// GET METHOD SEBELUM PAKAI MODUL

// app.get('/blog', (req, res) => {
//   // res.send('Lalalal'); //respone send string
//   console.log(blogs);
//   res.render('blog', {
//     blogs: blogs,
//     title: 'Blog',
//     currentPage: 'blog',
//     ...icon,
//   }); //respone render .hbs, gausah pake extenstion karena udah declare di line 5
// });

//GET METHOD SETELAH PAKAI MODUL

//RENDER INDEX
app.get('/', renderIndex);

//RENDER LOGIN
app.get('/login', renderLogin);
app.get('/register', renderRegister);
app.post('/auth-login', authLogin);
app.post('/auth-register', authRegister);
app.get('/logout', authLogout);

//RENDER BLOG
app.get('/blog', renderBlog);
//RENDER CREATE BLOG
app.get('/addblog', checkUser, renderCreateBlog);
//RENDER BLOG DETAIL
app.get('/blog/:id', renderBlogDetail);
//RENDER BLOT EDIT
app.get('/editblog/:id', checkUser, renderBlogEdit);
//SUBMIT ADD BLOG ^^
app.post('/addblog', checkUser, upload.single('image'), createBlog); //image ini korelasinya di upload file js bagian fieldname
//DELETE BLOG DI URL BLOG
app.delete('/blog/:id', deleteBlog);
//UNTUK EDIT BLOG
app.patch('/blog-update/:id', checkUser, upload.single('image'), updateBlog); //blog-update ini action yang dipanggil pada html, ada di blog-edit.hbs

//RENDER TESTIMONIAL
app.get('/testimonial', renderTestimonial);
//RENDER FORM CONTACT
app.get('/form', renderForm);

//RENDER MYPROJECT
app.get('/addproject', checkUser, renderCreateProject);
app.get('/projects', renderProjects);
app.post('/project-add', checkUser, upload.single('image'), createProject);
app.delete('/projects/:id', deleteProject);
app.get('/editproject/:id', checkUser, renderProjectEdit);
app.patch('/project-update/:id', checkUser, upload.single('image'), updateProject);

// app.get('/about/:id', (req, res) => {
//   const id = req.params.id;
//   res.send(`Hello World! ini ${id}`); //res send id, id nya dari line 11, declare di line 12
// });

// app.get('/blog/', (req, res) => {
//   const title = req.params.title;
//   // const author = req.params.author;
//   // const year = req.params.year;

//   // const { title, author, year } = req.params;
//   res.send(`Hello World! ini ${title} authornya ${author}, tahun ${year}`);
// });

app.get('*', (req, res) => {
  res.render('page-404');
});

//JALANIN PORT
app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});
