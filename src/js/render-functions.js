function templateCard({
  webformatURL,
  largeImageURL,
  tags,
  likes,
  views,
  comments,
  downloads,
}) {
  return `      
      <li class="card">
        <a href ="${largeImageURL}">
        <img class="card-img" src="${webformatURL}" alt="${tags}" >
        <ul class="card-data">
          <li><h3>Likes</h3><p>${likes}</p></li>
          <li><h3>Views</h3><p>${views}</p></li>
          <li><h3>Comments</h3><p>${comments}</p></li>
          <li><h3>Downloads</h3><p>${downloads}</p></li>
        </ul>
      </li>`;
}

export function templateCards(images) {
  return images.map(templateCard).join('');
}
