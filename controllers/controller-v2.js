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
  const user = await req.session.user; //untuk masukin session ke web page index
  res.render('index', {
    user: user, //deklarasi user nya biar kena detect function session di web page tsb
    currentPage: 'home',
    ...icon,
  });
}
async function renderLogin(req, res) {
  const user = await req.session.user; //untuk masukin session ke web page login
  if (user) {
    req.flash('warning', 'You already Logged In');
    res.redirect('/');
  } else {
    res.render('auth-login', {
      user: user, //deklarasi user nya biar kena detect function session di web page tsb
      currentPage: 'login',
      ...icon,
    });
  }
}
async function renderRegister(req, res) {
  const user = await req.session.user;
  if (user) {
    req.flash('success', 'You already Logged In');
    res.redirect('/');
  } else {
    res.render('auth-register', {
      user: user, //deklarasi user nya biar kena detect function session di web page tsb
      currentPage: 'register',
      ...icon,
    });
  }
}

async function authLogin(req, res) {
  const { email, password } = req.body;
  // console.log(req.body);
  const user = await User.findOne({
    //nyari email di db buat mastiin kalo email yang diregister tidak boleh sama persis kaya email yang udah terdaftar
    //mencari satu db, dengan condition WHERE di bawah
    where: {
      //condition WHERE untuk mencari db
      email: email,
    },
  });
  //check kalau usernya ada
  if (!user) {
    //if disini conditional nya false, karena (!user) kalo (user) jadi conditional nya true
    //if condition kalo email yang dimasukin gaada
    req.flash('error', 'User does not exist'); //error notif, string argumen yang pertama, buat ngasih tau kalo 'error'. itu assigned value, argumen string kedua itu kalimat yang mau dimasukin di error nya
    return res.redirect('/login');
  }

  //check kalau password salah
  const isValidated = await bcrypt.compare(password, user.password); //comparing password yang diinput di login page(password) sama password yang ada di db yang udah dihashing(user.password), pake bcrypt.compare karena passwordnya harus dihashing dulu

  if (!isValidated) {
    //const isValidated di atas itu hasilnya boolean, nah ini conditionnya jika TIDAK true atau jika false
    //kalo engga valid alias password ga sama
    req.flash('error', 'Password incorrect'); //error notif, string argumen yang pertama, buat ngasih tau kalo 'error'. itu assigned value, argumen string kedua itu kalimat yang mau dimasukin di error
    return res.redirect('/login');
  }
  let loggedInUser = user.toJSON(); //parsing user yang tadinya tipe data object ke JSON
  console.log(loggedInUser); //console log user semua
  //hapus passowrd di session
  delete loggedInUser.password; //delete ini assigned fucntion yang udh ada,
  console.log(loggedInUser); //console log user setelah password didelete

  req.session.user = loggedInUser; // JSON user yang ada diganti dengan user yang sudah login
  req.flash('success', `Login Succeed, Welcome ${user.name}`); //********butuh ditanya, karena yang dijelasin ka leo pake 'loggedInUser.name' tapi cuma pake 'user.name' bisa
  res.redirect('/');
}

async function authRegister(req, res) {
  const { name, email, password, confirmPassword } = req.body;
  if (password != confirmPassword) {
    //konfirmasi password
    req.flash('error', 'Password is not the same'); //error kalo password sala
    return res.redirect('/register');
  }
  const user = await User.findOne({
    //nyari email di db buat mastiin kalo email yang diregister tidak boleh sama persis kaya email yang udah terdaftar
    where: {
      //condition nyari jika email yang diregister sama dengan email di db
      email: email,
    },
  });
  if (user) {
    //if disini conditional nya true alias jika user yang dicari ditemukan maka req.flash error
    req.flash('error', 'Email already exist');
    return res.redirect('/register');
  }

  const hashedPassword = await bcrypt.hash(password, saltRounds); //declare const buat hashing, bcrypt.hash function hashing nya, argumen pertama password yang dimasukin, argumen kedua berapa kali hashing nya, di atas udah dipakein variable 10 di saltRounds
  const newUser = {
    //bikin user baru dengan password yang sudah di hashing
    name,
    email,
    password: hashedPassword, //assigning variable password pake hashedPassword diatas
  };

  const insertUser = await User.create(newUser); //User.create(newUser) artinya, database User create user baru dengan const object newUser diatas, jika create(User) tanpa pake newUser, maka yang dimasukin password yang belum dihashing
  req.flash('success', 'Register succeed!');
  res.redirect('/login');
}

async function authLogout(req, res) {
  //hapus user dari session
  req.session.user = null; //keluarin session
  res.redirect('/login');
}

async function renderBlog(req, res) {
  const user = await req.session.user;
  const blogs = await Blog.findAll({
    include: {
      model: User,
      as: 'user',
      attributes: { exclude: ['password'] }, //untuk exclude password just in case someone could see
    },
    order: [['createdAt', 'DESC']],
  });
  //   console.log(blogs);
  res.render('blog', {
    user: user, //deklarasi user nya biar kena detect function session di web page tsb
    currentPage: 'blog',
    blogs: blogs,
    ...icon,
  });
}
async function renderCreateBlog(req, res) {
  const user = await req.session.user;
  //   console.log(blogs);

  if (user) {
    res.render('blog-add', {
      user: user, //deklarasi user nya biar kena detect function session di web page tsb
      title: 'Add Blog',
      currentPage: 'addblog',
      blogs: Blog, //blog ambil dari models kalau ambil dari array(line 5) dia ambilnya "blogs" sama aja sebenernya
      ...icon,
    });
  } else {
    req.flash('error', 'You need to Sign In !');
    res.redirect('/login');
  }
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
    user: user, //deklarasi user nya biar kena detect function session di web page tsb
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
  if (!user) {
    req.flash('error', 'You need to Logged In');
    res.redirect('/login');
  } else {
    // const chosenBlog = blogs[id]; //chosenBlog ngambil id dari blogs, misal index 0 = blog[0]
    res.render('blog-edit', {
      //UPDATE:  TIPE DATA TIDAK PERLU PAKE INDEX KAYA PAKE V1, KARENA TIPE DATANYA SUDAH OBJECT, BUKAN ARRAY
      user: user, //deklarasi user nya biar kena detect function session di web page tsb
      blog: chosenBlog, //nampilin blog
      title: 'Blog Details',
      currentPage: 'blog',
      ...icon,
    });
  }
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
    user: user, //deklarasi user nya biar kena detect function session di web page tsb
    title: 'My Project',
    currentPage: 'myproject',
    ...icon,
  });
}

async function renderTestimonial(req, res) {
  const user = await req.session.user;
  res.render('testimonial', {
    user: user, //deklarasi user nya biar kena detect function session di web page tsb
    title: 'Testimonials',
    currentPage: 'testimonial',
    ...icon,
  });
}

async function renderForm(req, res) {
  const user = await req.session.user;
  res.render('form', {
    user: user, //deklarasi user nya biar kena detect function session di web page tsb
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
