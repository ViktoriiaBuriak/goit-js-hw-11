import iziToast from 'izitoast';
import 'izitoast/dist/css/iziToast.min.css';

import SimpleLightbox from 'simplelightbox';
import 'simplelightbox/dist/simple-lightbox.min.css';

document.addEventListener('DOMContentLoaded', function () {
  const galleryBox = new SimpleLightbox('.gallery a', {
    captionsData: 'alt',
    captionPosition: 'bottom',
    captionDelay: 250,
    enableKeyboard: true,
  });

  const galleryApiUrl = 'https://pixabay.com/api/';
  const form = document.querySelector('.search-container');
  const input = document.getElementById('search');
  const loader = document.querySelector('.loader');
  const gallery = document.querySelector('.gallery');

  form.addEventListener('submit', evt => {
    evt.preventDefault();

    const inputValue = input.value.trim().toLowerCase();

    loader.style.display = 'block';

    if (inputValue !== '') {
      const options = {
        key: '42070599-a2d44ee2a419d1b7eaf44145e',
        q: encodeURIComponent(inputValue),
        image_type: 'photo',
        orientation: 'horizontal',
        safesearch: true,
      };

      fetch(
        `${galleryApiUrl}?key=42070599-a2d44ee2a419d1b7eaf44145e&q=${inputValue}`,
        options
      )
        .then(response => response.json())
        .then(data => {
          const hits = data.hits;

          input.value = '';

          if (hits.length === 0) {
            iziToast.error({
              title: 'Error',
              message:
                'Sorry, there are no images matching your search query. Please try again!',
              position: 'topRight',
            });
            loader.style.display = 'none';

            return;
          }

          gallery.innerHTML = '';

          hits.forEach(hit => {
            const listItem = document.createElement('li');
            listItem.classList.add('gallery-item');

            const elementLink = document.createElement('a');
            elementLink.classList.add('gallery-link');
            elementLink.href = hit.largeImageURL;

            const imageElement = document.createElement('img');
            imageElement.classList.add('gallery-image');
            imageElement.src = hit.webformatURL;
            imageElement.alt = hit.tags;

            const captionList = document.createElement('ul');
            captionList.classList.add('caption-list');

            const likesItem = document.createElement('li');
            likesItem.innerHTML = 'Likes: <br>' + hit.likes;

            const viewsItem = document.createElement('li');
            viewsItem.innerHTML = 'Views: <br>' + hit.views;

            const commentsItem = document.createElement('li');
            commentsItem.innerHTML = 'Comments: <br>' + hit.comments;

            const downloadsItem = document.createElement('li');
            downloadsItem.innerHTML = 'Downloads: <br>' + hit.downloads;

            captionList.appendChild(likesItem);
            captionList.appendChild(viewsItem);
            captionList.appendChild(commentsItem);
            captionList.appendChild(downloadsItem);

            listItem.appendChild(elementLink);
            elementLink.appendChild(imageElement);
            listItem.appendChild(captionList);

            gallery.appendChild(listItem);
          });

          loader.style.display = 'none';

          input.value = '';

          galleryBox.refresh();
        })
        .catch(error => {
          console.error('There was a problem with the fetch operation:', error);
        });
    } else {
      input.reportValidity();

      loader.style.display = 'none';
    }
  });
});
