function itemTemplate(item) {
  return `
         <li class='list-group-item list-group-item-action d-flex align-items-center justify-content-between'>
           <span class='item-text'>${item.text}</span>
           <div>
             <button data-id ="${item._id}" class='edit-me btn btn-secondary btn-sm mr-1'>Edit</button>
             <button data-id = "${item._id}" class='delete-me btn btn-danger btn-sm'>Delete</button>
           </div>
         </li>
       `;
}
//inital render on page load
const ourHTML = items
  .map(function (item) {
    return itemTemplate(item);
  })
  .join('');
document.querySelector('#item-list').insertAdjacentHTML('beforeend', ourHTML);

//Create Feature
const createField = document.querySelector('#create-field');
document.querySelector('#create-form').addEventListener('submit', (e) => {
  e.preventDefault();
  axios
    .post('/create-item', {
      text: createField.value,
    })
    .then((response) => {
      document
        .querySelector('#item-list')
        .insertAdjacentHTML('beforeend', itemTemplate(response.data));
      createField.value = '';
      createField.focus();
    })
    .catch(() => {
      console.log('Please Try Again Later');
    });
});
document.addEventListener('click', function (e) {
  //delete feature
  if (e.target.classList.contains('delete-me')) {
    if (confirm('Permanenly delete this item from your list???')) {
      axios
        .post('/delete-item', {
          id: e.target.getAttribute('data-id'),
        })
        .then(() => {
          e.target.parentElement.parentElement.remove();
        })
        .catch(() => {
          console.log('Please Try Again Later');
        });
    }
  }
  //update feature
  if (e.target.classList.contains('edit-me')) {
    let userInput = prompt(
      'Edit your item here',
      e.target.parentElement.parentElement.querySelector('.item-text').innerHTML
    );
    if (userInput) {
      axios
        .post('/update-item', {
          text: userInput,
          id: e.target.getAttribute('data-id'),
        })
        .then(() => {
          e.target.parentElement.parentElement.querySelector(
            '.item-text'
          ).innerHTML = userInput;
        })
        .catch(() => {
          console.log('Please Try Again Later');
        });
    }
  }
});
