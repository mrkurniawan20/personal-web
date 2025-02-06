// const janji = new Promise((resolve, reject) => {
//   setTimeout(() => {
//     let sukses = true;
//     if (sukses) {
//       resolve('Janji ditepati !');
//     } else {
//       reject('Tetot');
//     }
//   }, 1000);
// });

// const janjiMakan = new Promise((resolve, reject) => {
//   console.log('Mesen makan ...🍔');

//   setTimeout(() => {
//     let sukses = true;

//     if (sukses) {
//       resolve('Fatass ');
//     } else {
//       reject('LMFAO');
//     }
//   }, 2000);
// });

// janjiMakan.then((pes) => console.log('Berhasi : ', pes)).catch((ror) => console.log('Gagal : ', ror));

// const bangunTidur = new Promise((resolve) => {
//   setTimeout(() => resolve('Selamat pagi...'), 2000);
// });

// bangunTidur
//   .then((bangun) => {
//     console.log(bangun);
//     return new Promise((resolve, reject) => {
//       //   setTimeout(() => resolve('Mandi dulu ges...'), 2000);
//       setTimeout(() => reject('Waduh air mati bro...'), 2000);
//     }).catch((err) => {
//       console.log('Masalah di mandi ni:\n', err);
//       return 'Mandi diskip dlu';
//     });
//   })
//   .then((mandiDulu) => {
//     console.log(mandiDulu);
//     return new Promise((resolve) => {
//       setTimeout(() => resolve('Sarapan dulu ges...'), 2000);
//     });
//   })
//   .then((sarapanDulu) => {
//     console.log(sarapanDulu);
//     return new Promise((resolve) => {
//       setTimeout(() => resolve('Berangkatsss....'), 1000);
//     });
//   })
//   .then((berangkatKerja) => {
//     console.log(berangkatKerja);
//   })
//   .catch((error) => {
//     console.log('Eits error...');
//   });

// function getUser() {
//   fetch(`https://jsonplaceholder.typicode.com/users/`)
//     .then((response) => {
//       if (!response.ok) throw new Error('Gagal fetch data user');
//       return response.json();
//     })
//     .then((user) => console.log(user))
//     .catch((error) => console.log('Error :', error.essage));
// }
// getUser();
// console.log('test');

// sync
// console.log('start');
// console.log('process');
// console.log('end');

// function sayHello() {
//   console.log('Hi everyone');
// }

// function greeting(name, callback) {
//   console.log('Hai ', name);
//   callback()
// }
// async

// AJAX

// function loadDoc() {
//   var xhttp = new XMLHttpRequest();
//   xhttp.onreadystatechange = function() {
//     if (this.readyState == 4 && this.status == 200) {
//      document.getElementById("demo").innerHTML = this.responseText;
//     }
//   };
//   xhttp.open("GET", "ajax_info.txt", true);
//   xhttp.send();
// }

const xhr = new XMLHttpRequest();

xhr.open('GET', 'https://api.npoint.io/37b03059009dda95802a', true);

xhr.onload = function () {
  if (xhr.status == 200) {
    response = xhr.responseText;
    console.log('Response:', JSON.parse(response));
  } else {
    console.error('Error : ', xhr.status);
  }
};

xhr.send();
