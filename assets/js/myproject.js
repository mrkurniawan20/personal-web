let projects = [];
function addProject(event) {
  event.preventDefault();

  let name = document.getElementById('name').value;
  let description = document.getElementById('description').value;
  let image = document.getElementById('image');
  let start = new Date(document.getElementById('start').value);
  let end = new Date(document.getElementById('end').value);

  let imageFileName = URL.createObjectURL(image.files[0]);

  let project = {
    name: name,
    description: description,
    image: imageFileName,
    start: start,
    end: end,
    relativeTime: new Date(),
  };
  projects.push(project);

  renderProject();

  // selisih = end - start;
  // diffDays = Math.floor(selisih / 1000 / 60 / 60 / 24);
  // console.log('selisih hari ', diffDays);
  // diffMonths = Math.floor(diffDays / 30);
  // console.log('selisih bulan ', diffMonths);
  // console.log(selisih);
  // if (diffDays < 30) {
  //   console.log(`${diffDays} hari`);
  // } else {
  //   // return `${diffMonths} months ago`;
  //   console.log(`${diffMonths} bulan`);
  // }
}

function getRelativeTime() {
  let start = new Date(document.getElementById('start').value);
  let end = new Date(document.getElementById('end').value);
  selisih = end - start;
  diffDays = Math.floor(selisih / 1000 / 60 / 60 / 24);
  console.log('selisih hari ', diffDays);
  diffMonths = Math.floor(diffDays / 30);
  console.log('selisih bulan ', diffMonths);
  console.log(selisih);
  if (diffDays < 30) {
    return diffDays;
    // console.log(`${diffDays} hari`);
  } else {
    return diffMonths;
    // console.log(`${diffMonths} bulan`);
  }
}

function renderProject() {
  let projectContainerElement = document.getElementById('project-container');

  projectContainerElement.innerHTML = firstProject();

  for (let i = 0; i < projects.length; i++) {
    projectContainerElement.innerHTML += `
        <article id="project" class="project">
          <div>
            <img src="${projects[i].image}" alt="" />
            <h4>${projects[i].name}</h4>
            <p class="relative-time">durasi : ${getRelativeTime(projects[i].relativeTime)} bulan</p>
            <p>${projects[i].description}</p>
          </div>
          
          
          <div>
            <ul class="skills">
              <img src="img/nodejs.png" alt="" />
              <img src="img/react.png" alt="" />
              <img src="img/express.png" alt="" />
            </ul>
            <ul class="button2">
              <button class="edit" id="edit">edit</button>
              <button class="delete" id="delete" onclick="deleteProject(${i})">delete</button>
            </ul>
          </div>
        </article>
        `;
  }
}
function firstProject() {
  return `
        <article id="project" class="project">
          <div>
            <img src="img/image1.jpg" alt="" />
            <h4>Dumbways Mobile App - 2021</h4>
            <p class="relative-time">durasi : 3 bulan</p>
            <p>Lorem ipsum dolor sit amet consectetur adipisicing elit. Eaque, atque.</p>
          </div>
          
          <div>
            <ul class="skills">
              <img src="img/nodejs.png" alt="" />
              <img src="img/react.png" alt="" />
              <img src="img/express.png" alt="" />
            </ul>
            <ul ul class="button2">
              <button class="edit" id="edit">edit</button>
              <button class="delete" id="delete" onclick="deleteProject()">delete</button>
            </ul>
          </div>
              </ul>
            </article>
          `;
}
renderProject();

function deleteProject(i) {
  projects.splice(i, 1);
  renderProject();
}
