async function form(event) {
  await Swal.fire({
    icon: 'success',
    title: 'Your work has been saved',
    showConfirmButton: false,
    timer: 1500,
  });
  let name = document.getElementById('name').value;
  let email = document.getElementById('email').value;
  let phoneno = document.getElementById('phoneno').value;
  let message = document.getElementById('message').value;
  let subject = document.getElementById('subject').value;
  let toEmail = 'luigiguido45@gmail.com';
  event.preventDefault();
  let a = document.createElement('a');
  a.href = `mailto:${toEmail}?subject=${subject}&body=${`Hello good sir, my name is ${name}, you can contact me at ${phoneno} or directly reply to this email, here's my message  : %0D%0A%0D%0A   ${message}`}`;
  a.click();
  //   alert(name);
}
