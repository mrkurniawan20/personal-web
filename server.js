const express = require('express');
const app = express();
const port = 3000;

app.set('view engine', 'hbs'); //setting view engine, pake hbs
app.use(express.static('assets'));

const icon = {
  iconPath: '/img/icon.jpg',
  cssPath: '/css/style.css',
};

app.get('/', (req, res) => {
  // res.send('Lalalal'); //respone send string
  res.render('index', {
    ...icon,
  }); //respone render .hbs, gausah pake extenstion karena udah declare di line 5
});

app.get('/myproject', (req, res) => {
  // res.send('Lalalal'); //respone send string
  res.render('myproject', {
    ...icon,
  }); //respone render .hbs, gausah pake extenstion karena udah declare di line 5
});

app.get('/blog', (req, res) => {
  // res.send('Lalalal'); //respone send string
  res.render('blog', {
    ...icon,
  }); //respone render .hbs, gausah pake extenstion karena udah declare di line 5
});

app.get('/testimonial', (req, res) => {
  // res.send('Lalalal'); //respone send string
  res.render('testimonial', {
    ...icon,
  }); //respone render .hbs, gausah pake extenstion karena udah declare di line 5
});

app.get('/form', (req, res) => {
  // res.send('Lalalal'); //respone send string
  res.render('form', {
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
