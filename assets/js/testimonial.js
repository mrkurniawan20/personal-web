// let numbers = [1, 2, 3, 4, 5, 6, 7];

// function showNumber(number) {
//   console.log(`${number}`);
//   return (number *= 2);
// }

// numbers.forEach(showNumber);

// const candidates = [
//   {
//     name: 'Rafli Kurniawan',
//     rating: 5,
//     caption: 'Sangat berguna!',
//     image: '/personal-web/assets/img/image1.jpg',
//   },
//   {
//     name: 'Dio Brando',
//     rating: 4,
//     caption: 'This is me. DIO!',
//     image: '/personal-web/assets/img/image2.jpg',
//   },
//   {
//     name: 'Joseph Joestar',
//     rating: 3,
//     caption: 'SIZA!',
//     image: '/personal-web/assets/img/image3.jpg',
//   },
//   {
//     name: 'Jonathan Joestar',
//     rating: 5,
//     caption: 'ded!',
//     image: '/personal-web/assets/img/image4.jpg',
//   },
// ];

// const criteria = {
//   score: 70,
//   expectedSalary: 1000,
//   prefferedPosition: 'Fullstack',
// };

// passCandidates = candidates.filter((candidates) => {
//   if (candidates.score > criteria.score) console.log(candidates);
// });
// console.log(passCandidates);

function fetchTestimonial() {
  return new Promise((resolve, reject) => {
    const xhr = new XMLHttpRequest();
    xhr.open('GET', 'https://api.npoint.io/3afc57bba2012a483de7', true);

    xhr.onload = function () {
      if (xhr.status === 200) {
        const respone = JSON.parse(xhr.responseText);
        resolve(respone.testimonials); //Testimonials ini array of object yang ada di link api
      } else {
        reject('Error', xhr.status);
      }
    };
    xhr.onerror = () => reject('network error');
    xhr.send();
  });
}

const testimonialsContainer = document.getElementById('testimonial-list');

const testimonialsHTML = (array) => {
  return array
    .map(
      (testimonial) => `
        <article>
          <img src="${testimonial.image}" alt="testimonial-image" />
          <p class="testimonial-item-caption pt-3"><i>"${testimonial.caption}"</i></p>
          <p class="text-end">- ${testimonial.author}</p>
          <p class="text-end" style="font-weight: bold">${testimonial.rating}★</p>
        </article>
        `
    )
    .join('');
};

async function showAllTestimonials() {
  const testimonials = await fetchTestimonial();
  console.log(testimonials);
  testimonialsContainer.innerHTML = testimonialsHTML(testimonials);
}
showAllTestimonials();

async function filterTestimonialsByStar(rating) {
  const testimonials = await fetchTestimonial();

  const filteredTestimonials = testimonials.filter((testimonials) => testimonials.rating === rating);

  console.log(filteredTestimonials);

  if (filteredTestimonials.length == 0) {
    return (testimonialsContainer.innerHTML = `<p>No testimonial</p>`);
  }
  testimonialsContainer.innerHTML = testimonialsHTML(filteredTestimonials);
}
