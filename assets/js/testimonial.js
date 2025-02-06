// let numbers = [1, 2, 3, 4, 5, 6, 7];

// function showNumber(number) {
//   console.log(`${number}`);
//   return (number *= 2);
// }

// numbers.forEach(showNumber);

const candidates = [
  {
    name: 'Rafli Kurniawan',
    rating: 5,
    caption: 'Sangat berguna!',
    image: '/personal-web/assets/img/image1.jpg',
  },
  {
    name: 'Dio Brando',
    rating: 4,
    caption: 'This is me. DIO!',
    image: '/personal-web/assets/img/image2.jpg',
  },
  {
    name: 'Joseph Joestar',
    rating: 3,
    caption: 'SIZA!',
    image: '/personal-web/assets/img/image3.jpg',
  },
  {
    name: 'Jonathan Joestar',
    rating: 5,
    caption: 'ded!',
    image: '/personal-web/assets/img/image4.jpg',
  },
];

const criteria = {
  score: 70,
  expectedSalary: 1000,
  prefferedPosition: 'Fullstack',
};

passCandidates = candidates.filter((candidates) => {
  if (candidates.score > criteria.score) console.log(candidates);
});
console.log(passCandidates);
