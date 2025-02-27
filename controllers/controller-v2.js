const icon = {
  iconPath: '/assets/img/icon.jpg',
  cssPath: '/assets/css/style.css',
};
// let blogs = []; kalo blogs:blogs ambil dari sini

//untuk format value tanggal jadi yyyy-mm-dd
const { format } = require('date-fns');

const { Sequelize } = require('sequelize'); //pake sequlize biar ga pake raw query kaya di controller v1
const bcrypt = require('bcrypt'); //pake bcrypt buat enkripsi

const config = require('../config/config.js'); //ambil config
const { Blog, User, Project } = require('../models'); //ambil Blog, sama User, ini table yang ada di sql

//test create project
// async function createProject() {
//   try {
//     const newProject = await Project.create({
//       authorId: 1,
//       title: 'My First Project',
//       image: 'project.png',
//       content: 'This is the project content.',
//       skills: 'JavaScript,Node.js,Sequelize', // Assuming skills are stored as a comma-separated string
//     });
//     console.log(newProject);
//   } catch (err) {
//     console.error('Error creating project:', err);
//   }
// }

// createProject();

const saltRounds = 10; //Untuk hashing berapa kali, sebenernya gausah dikasih vairable juga bisa, langusng angka di function
// const { renderBlogEdit } = require('./controller-v1');
require('dotenv').config();
const sequelize = new Sequelize(config[process.env.NODE_ENV]); //const sequelize buat masukin config ke function sequelize

async function renderIndex(req, res) {
  const user = await req.session.user; //untuk masukin session ke web page index
  res.render('index', {
    user: user, //deklarasi user nya biar kena detect function session di web page tsb
    title: 'Home',
    currentPage: 'home',
    ...icon,
  });
}
async function renderLogin(req, res) {
  const user = await req.session.user; //untuk masukin session ke web page login
  if (user) {
    req.flash('success', 'You already Logged In');
    res.redirect('/');
  } else {
    res.render('auth-login', {
      user: user, //deklarasi user nya biar kena detect function session di web page tsb
      currentPage: 'login',
      title: 'Login',
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
      title: 'Register',
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
  // console.log(loggedInUser); //console log user semua
  //hapus passowrd di session
  delete loggedInUser.password; //delete ini assigned fucntion yang udh ada,
  // console.log(loggedInUser); //console log user setelah password didelete

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
      as: 'user', //manggil assosiates model user pake variable user. jadi bisa ambil blog.user.name (nama dari user, foreign key nya dari authorID)
      attributes: { exclude: ['password'] }, //untuk exclude password just in case someone could see
    },
    order: [['createdAt', 'DESC']],
  });
  //   console.log(blogs);
  res.render('blog', {
    user: user, //deklarasi user nya biar kena detect function session di web page tsb
    title: 'Blog',
    currentPage: 'blog',
    blogs: blogs,
    ...icon,
  });
}
async function renderCreateBlog(req, res) {
  const user = await req.session.user;
  //   console.log(blogs);

  res.render('blog-add', {
    user: user, //deklarasi user nya biar kena detect function session di web page tsb
    title: 'Add Blog',
    currentPage: 'addblog',
    blogs: Blog, //blog ambil dari models kalau ambil dari array(line 5) dia ambilnya "blogs" sama aja sebenernya
    ...icon,
  });
}

async function createBlog(req, res) {
  const user = await req.session.user;
  const { title, content } = req.body; //ngambil title sama content dari body, essentially "title = req.body.title"
  // let dummyImage = 'https://i.redd.it/show-me-your-silly-cats-v0-wplu39sp6l1d1.jpg?width=4032&format=pjpg&auto=webp&s=9970c7152419d80629bc8a7e94ea556b9779f833'; UDAH GAPAKE BROW

  const image = req.file.path; // req.file.path ini dari file.path yang diimport pake modul upload-file.js - kalo kaya gini doang, image harus diupload karena kalo engga nanti 'path' nya gaada
  // console.log(image);
  // console.log(req.body);
  const newBlog = {
    title, //title : title
    content, //samme^, just using cleaner way
    authorId: user.id,
    image: image, //still using variable karena variable nya beda sama sql
  };
  console.log(newBlog);
  const resultSubmit = await Blog.create(newBlog);
  // console.log(resultSubmit);
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
    include: {
      model: User,
      as: 'user',
      attributes: { exclude: ['password'] }, //untuk exclude password just in case someone could see
    },
    where: {
      id: id,
    },
  });

  if (chosenBlog === null) {
    res.render('page-404');
  }
  // const chosenBlog = blogs[id]; //chosenBlog ngambil id dari blogs, misal index 0 = blog[0]
  await res.render('blog-detail', {
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
    return res.render('page-404');
  }

  // const chosenBlog = blogs[id]; //chosenBlog ngambil id dari blogs, misal index 0 = blog[0]
  await res.render('blog-edit', {
    //UPDATE:  TIPE DATA TIDAK PERLU PAKE INDEX KAYA PAKE V1, KARENA TIPE DATANYA SUDAH OBJECT, BUKAN ARRAY
    user: user, //deklarasi user nya biar kena detect function session di web page tsb
    blog: chosenBlog, //nampilin blog
    title: 'Blog Edit',
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
  const image = req.file ? req.file.path : null; //ini kalo update begini karena jika edit blog dan ga masukin image, nanti dia error, 'path' undefined, jadi kalo misal ga upload image, diisinya 'null'
  const project = await Project.findByPk(id); //ini ambil project, berguna untuk bagian yang tidak di update/edit
  const updateResult = await Blog.update(
    {
      title,
      content,
      image: image ?? project.image, //ini conditional statement, jika image == null, maka ambil dari project.image, project nya sudah di declare di atas, ambil dari Project.findByPk(id)
      updatedAt: sequelize.fn('NOW'), //ini function sequelize 'NOW'
    },
    {
      where: {
        id, //ini buat tau update nya database yang mana
      },
    }
  );
  res.redirect('/blog');
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

async function renderProjects(req, res) {
  const user = await req.session.user;
  const projects = await Project.findAll({
    order: [['createdAt', 'DESC']],
  });
  // for (let i = 0; i < projects.length; i++) {
  //   skillSet = projects[i].skills.split(',');
  // }
  // const tech = projects.skills.split(',');
  const mappedProjects = projects.map((project) => {
    return {
      ...project.get({ plain: true }), // project(yang tadinya tipe datanya sequelize instance model) nya dijadiin object plain, isinya semuanya seperti biasa, dan nambahin key skillSet di bawah
      skillSet: project.skills ? project.skills.split(',') : [], // di mapped pake skillSet, jadi yang tadinya string, jadi array. dimasukin ke array kosong. map() basically looping. jadi dia ambil project skills. di split berdasarkan koma, lalu dimasukin ke array. jika skills tidak ada, dia akan return array kosong " :[]"
    };
  });
  res.render('projects', {
    user: user,
    title: 'My Projects',
    currentPage: 'projects',
    projects: mappedProjects,
    ...icon,
  });
}

async function renderCreateProject(req, res) {
  const user = await req.session.user;
  res.render('project-add', {
    user: user, //deklarasi user nya biar kena detect function session di web page tsb
    title: 'Create Project',
    currentPage: 'add-project',
    ...icon,
  });
}
async function createProject(req, res) {
  const user = await req.session.user;
  const { name, start, end, description, technologies } = req.body; //req.body ini ambil dari 'name' value yang ada di form, jadi 'name' value harus ada di form
  // const image = req.file.path
  const image = req.file.path;
  const newProject = {
    title: name,
    authorId: user.id,
    image: image,
    startDate: start,
    endDate: end,
    content: description,
    skills: technologies ? [].concat(technologies).join() : '', // concat disini berfungsi untuk jika skill yang dicheck cuma 1 atau null, karena kalo 1 dia tipe datanya jadinya string, dan dimasukin ke array kosong ([].concat(technologies)). yang artinya technologies disitu dijoin di dalam array kosong yang punya function concat. lalu jika sudah dia dipakein function join() buat balikin ke string, biar disimpen di db jadinya string, nah jika kosong, dia akan return string kosong saja (:'')
  };
  const resultSubmit = await Project.create(newProject);
  res.redirect('/projects');
  // console.log(newProject.technologies.split(','));
}
async function deleteProject(req, res) {
  const { id } = req.params;
  const delteResult = await Project.destroy({
    where: {
      id: id,
    },
  });
  res.redirect('/projects');
}

async function updateProject(req, res) {
  const id = req.params.id;
  const { title, content, technologies, start, end } = req.body;
  const image = req.file ? req.file.path : null; //req file bisa diisi bisa tidak,
  const project = await Project.findByPk(id); //declare/mengambil project yang sudah ada di db(untuk bagian image karena image menggunakan .path jadi harus diisi jika tidak maka hasilnya undefined)
  const updateResult = await Project.update(
    {
      title: title,
      content: content,
      skills: technologies ? [].concat(technologies).join() : '', //[].concat artinya tecnologies yang dichecked, dimasukin ke array kosong. lalu di join() dijadiin string
      startDate: start,
      endDate: end,
      image: image ?? project.image, //conditional statement, jika image nya ada(true) dia akan ambil image(dari req.file.path) jika tidak ada dia ambil dari project.image yang sudah dideclare
      updatedAt: sequelize.fn('NOW'),
    },
    {
      where: {
        id,
      },
    }
  );
  res.redirect('/projects');
}

async function renderProjectEdit(req, res) {
  const id = req.params.id;
  const user = await req.session.user;
  const chosenProject = await Project.findOne({
    where: {
      id: id,
    },
  });
  if (chosenProject === null) {
    //kalo id nya gaada, dia akan return page404
    return res.render('page-404');
  }

  const start = format(chosenProject.startDate, 'yyyy-MM-dd'); //method 'format' ini ddiambil dari import package 'date-fns' untuk nge format date jadi 'yyyy-mm-dd' karena di db ga kaya gitu
  const end = format(chosenProject.endDate, 'yyyy-MM-dd'); //sama kaya start
  const skillsArray = chosenProject.skills ? chosenProject.skills.split(',') : [];
  await res.render('project-edit', {
    //UPDATE:  TIPE DATA TIDAK PERLU PAKE INDEX KAYA PAKE V1, KARENA TIPE DATANYA SUDAH OBJECT, BUKAN ARRAY
    user: user, //deklarasi user nya biar kena detect function session di web page tsb
    project: {
      ...chosenProject.get({ plain: true }), //dijadiin plain object dengan isi key dan value yang sama kecuali yang di bawah
      startDate: start, //startDate sudah memakai format date-fns
      endDate: end, //endDate sudah memakai format date-fns
      skills: skillsArray, //skillSet menjadi array
    }, //nampilin blog
    title: 'Project Edit',
    currentPage: 'project',
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
  renderCreateProject,
  renderTestimonial,
  renderForm,
  createBlog,
  deleteBlog,
  updateBlog,
  renderProjects,
  renderProjectEdit,
  createProject,
  deleteProject,
  updateProject,
};
