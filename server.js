const express = require('express'); //import express sebagai variable
const hbs = require('hbs'); //import handlebars sebagai variable
const app = express(); //assigned semua function yang ada di express sebagai variable
const path = require('path'); //import modul path
const flash = require('express-flash'); //import modul flash untuk ngasih info error/success
const session = require('express-session'); //import modul session untuk kebutuhan session login/authentication
const methodOverride = require('method-override'); //import modul methodOverride (download dulu, dependencies ada di package json)
require('dotenv').config();

// const upload = require('./middlewares/upload-file');
const { formatDateToWIB, getRelativeTime } = require('./utils/time'); //import modul dari js time
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
  renderProject,
  renderTestimonial,
  renderForm,
  createBlog,
  deleteBlog,
  updateBlog,
} = require('./controllers/controller-v2'); //import modul dari js controller
const upload = require('./middlewares/upload-file');
const checkUser = require('./middlewares/auth');

const port = process.env.SERVER_PORT || 3000;
// const port = 3000; //port, angkanya assigned bebas, reccomended 4 digits diatas 3000

const icon = {
  iconPath: '/img/icon.jpg',
  cssPath: '/css/style.css',
};

app.set('view engine', 'hbs'); //setting view engine, pake hbs

//modul yang dipake
app.use(express.static('assets')); //ngasih tau kalo server menggunakan assigned static kaya css,image,js macem assets, di folder 'assets'
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
  //assigned function helper buat dipake di html, ini buat ngedikitin kalimat di blog atau project
  if (str.length > len) {
    return str.substring(0, len) + `....<a href=/blog/${this.id}>Read more</a>`;
  }
  return str;
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

//RENDER MYPROJECT
app.get('/myproject', renderProject);
//RENDER BLOG
app.get('/blog', renderBlog);
//RENDER CREATE BLOG
app.get('/addblog', checkUser, renderCreateBlog);
//RENDER BLOG DETAIL
app.get('/blog/:id', renderBlogDetail);
//RENDER BLOT EDIT
app.get('/editblog/:id', checkUser, renderBlogEdit);
//RENDER TESTIMONIAL
app.get('/testimonial', renderTestimonial);
//RENDER FORM CONTACT
app.get('/form', renderForm);

//SUBMIT ADD BLOG ^^
app.post('/addblog', checkUser, upload.single('image'), createBlog); //image ini korelasinya di upload file js bagian fieldname

//DELETE BLOG DI URL BLOG
app.delete('/blog/:id', deleteBlog);
//UNTUK EDIT BLOG
app.patch('/blog-update/:id', updateBlog); //blog-update ini action yang dipanggil pada html, ada di blog-edit.hbs

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
