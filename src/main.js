import { PixabayApi } from './js/pixabay-api';
import { templateCards } from './js/render-functions';
import iziToast from 'izitoast';
import SimpleLightbox from 'simplelightbox';
import 'izitoast/dist/css/iziToast.min.css';
import 'simplelightbox/dist/simple-lightbox.min.css';

const pixabayApi = new PixabayApi();

const lightbox = new SimpleLightbox('.gallery a');

const form = document.querySelector('.search-form');
const gallery = document.querySelector('.gallery');
const loader = document.querySelector('.loader');
const btnLoadMore = document.querySelector('.load-btn');

// =======================================================

let query;
let page;
let maxPage;

form.addEventListener('submit', onSearchSubmit);
btnLoadMore.addEventListener('click', onLoadMoreClick);

async function onSearchSubmit(event) {
  event.preventDefault();
  gallery.innerHTML = '';
  query = event.target.query.value.trim();
  page = 1;
  showLoader();
  hideLoadBtn();

  try {
    const data = await pixabayApi.getImages(query);
    maxPage = Math.ceil(data.totalHits / pixabayApi.perPage);
    const images = data.hits;
    if (!images.length) {
      throw new Error(
        'Sorry, there are no images matching your search query. Please try again!'
      );
    }
    renderCards(images);
    checkBtnVisibleStatus();
  } catch (error) {
    showError(error.message);
  }
  hideLoader();
  event.target.reset();
}

async function onLoadMoreClick(event) {
  page += 1;
  hideLoadBtn();
  showLoader();
  const data = await pixabayApi.getImages(query, page);
  renderCards(data.hits);
  hideLoader();
  checkBtnVisibleStatus();

  const height = gallery.firstElementChild.getBoundingClientRect().height;
  scrollBy({
    behavior: 'smooth',
    top: height * 2,
  });
}

function showError(message) {
  iziToast.error({
    pauseOnHover: false,
    position: 'topRight',
    message,
  });
}

function toggleLoader() {
  loader.classList.toggle('hidden');
}

function showLoader() {
  loader.classList.remove('hidden');
}
function hideLoader() {
  loader.classList.add('hidden');
}

function showLoadBtn() {
  btnLoadMore.classList.remove('hidden');
}
function hideLoadBtn() {
  btnLoadMore.classList.add('hidden');
}

function checkBtnVisibleStatus() {
  if (page >= maxPage) {
    hideLoadBtn();
    showError("We're sorry, but you've reached the end of search results.");
  } else {
    showLoadBtn();
  }
}

function renderCards(images) {
  gallery.insertAdjacentHTML('beforeend', templateCards(images));
  lightbox.refresh();
}
