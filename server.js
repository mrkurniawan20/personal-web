const express = require('express');
const hbs = require('hbs');
const app = express();
const port = 3000;
const path = require('path');

const { formatDateToWIB, getRelativeTime } = require('./utils/time');

app.set('view engine', 'hbs'); //setting view engine, pake hbs
app.use(express.static('assets'));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.set('views', path.join(__dirname, './views'));
hbs.registerPartials(__dirname + '/views/partials', function (err) {}); //__dirname buat ngasih tau folder yang mau dituju jadi, BASICALLY DIRNAME ITU FOLDER YANG DIBUKA ^^ YANG DI ATAS BROOOW
hbs.registerHelper('eq', (a, b) => a === b);
hbs.registerHelper('formatDateToWIB', formatDateToWIB);
hbs.registerHelper('getRelativeTime', getRelativeTime);

const icon = {
  iconPath: '/img/icon.jpg',
  cssPath: '/css/style.css',
};

let blogs = [];

app.get('/', (req, res) => {
  // res.send('Lalalal'); //respone send string
  res.render('index', {
    title: 'Home',
    currentPage: 'home',
    ...icon,
  }); //respone render .hbs, gausah pake extenstion karena udah declare di line 5
});

app.get('/myproject', (req, res) => {
  // res.send('Lalalal'); //respone send string
  res.render('myproject', {
    title: 'My Project',
    currentPage: 'myproject',
    ...icon,
  }); //respone render .hbs, gausah pake extenstion karena udah declare di line 5
});

app.get('/blog', (req, res) => {
  // res.send('Lalalal'); //respone send string
  console.log(blogs);
  res.render('blog', {
    blogs: blogs,
    title: 'Blog',
    currentPage: 'blog',
    ...icon,
  }); //respone render .hbs, gausah pake extenstion karena udah declare di line 5
});

app.get('/addblog', (req, res) => {
  // res.send('Lalalal'); //respone send string
  res.render('blog-add', {
    title: 'Add Blog',
    currentPage: 'addblog',
    ...icon,
  }); //respone render .hbs, gausah pake extenstion karena udah declare di line 5
});

//SUBMIT ADD BLOG ^^
app.post('/addblog', (req, res) => {
  // console.log('otw bikin blog');
  const title = req.body.title;
  const content = req.body.content;
  console.log(`judluunya adalah ${title}`);
  res.redirect('/blog');

  let image = 'https://i.redd.it/show-me-your-silly-cats-v0-wplu39sp6l1d1.jpg?width=4032&format=pjpg&auto=webp&s=9970c7152419d80629bc8a7e94ea556b9779f833';

  let newBlog = {
    title: title,
    content: content,
    image: image,
    author: 'Rafli',
    postedAt: new Date(),
  };
  blogs.push(newBlog);
});

app.get('/testimonial', (req, res) => {
  // res.send('Lalalal'); //respone send string
  res.render('testimonial', {
    title: 'Testimonials',
    currentPage: 'tesetimonial',
    ...icon,
  }); //respone render .hbs, gausah pake extenstion karena udah declare di line 5
});

app.get('/form', (req, res) => {
  // res.send('Lalalal'); //respone send string
  res.render('form', {
    title: 'Contact',
    currentPage: 'form',
    ...icon,
  }); //respone render .hbs, gausah pake extenstion karena udah declare di line 5
});

app.get('/about/:id', (req, res) => {
  const id = req.params.id;
  res.send(`Hello World! ini ${id}`); //res send id, id nya dari line 11, declare di line 12
});

// app.get('/blog/', (req, res) => {
//   const title = req.params.title;
//   // const author = req.params.author;
//   // const year = req.params.year;

//   // const { title, author, year } = req.params;
//   res.send(`Hello World! ini ${title} authornya ${author}, tahun ${year}`);
// });

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});
