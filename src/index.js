import axios from 'axios';

const moviesDiv = document.getElementById('movies');
const API_KEY = 'e74e5453a1c967b8e36b8763d65f06b9';

const popup = document.createElement('div');
popup.classList.add('popup');
document.body.appendChild(popup);

const overviewContainer = document.createElement('div');
overviewContainer.classList.add('overview-container');
popup.appendChild(overviewContainer);

axios.get(`https://api.themoviedb.org/3/movie/popular?api_key=${API_KEY}&language=en-US&page=1`)
    .then(({ data: { results: movies } }) => {
        movies.forEach(({ id, title, poster_path: posterPath, overview }, index) => {
            // Check if the movie element already exists in the moviesDiv
            const movieDiv = document.getElementById(`movie-${id}`);
            if (movieDiv) {
                return; // If the movie element exists, skip creating a new one
            }

            const newMovieDiv = document.createElement('div');
            newMovieDiv.classList.add('movies');
            newMovieDiv.id = `movie-${id}`; // create a unique ID for each movie element
            const posterUrl = posterPath ? `https://image.tmdb.org/t/p/w500${posterPath}` : 'https://via.placeholder.com/500x750.png?text=No+Image';
            newMovieDiv.innerHTML = `
        <h2>${title}</h2>
        <div class="movie-content">
          <img src="${posterUrl}" alt="${title} Poster">
          <button class="show-overview-button">Show Overview</button>
          <p class="overview">${overview}</p>
        </div>
      `;
            const showOverviewButton = newMovieDiv.querySelector('.show-overview-button');
            const overviewElement = newMovieDiv.querySelector('.overview');
            showOverviewButton.addEventListener('click', () => {
                overviewContainer.innerHTML = overview;
                popup.style.display = 'block';
                overviewContainer.classList.add('blur');
            });
            overviewElement.style.display = 'none';
            moviesDiv.appendChild(newMovieDiv);

            // check if the length of the movies array is greater than the current index plus 1
            if (movies.length <= index + 1) {
                return;
            }
        });
    })
    .catch((error) => {
        console.error(error);
    });

const styleElement = document.createElement('style');
styleElement.textContent = `
body {
  background-image: url('./pic.jpg');
  background-size: cover;
  background-position: center;
}
.movies {
    display: inline-block;
    width: 200px;
    margin: 1rem;
    box-shadow: 0px 0px 10px rgba(0, 0, 0, 0.3);
    border-radius: 5px;
    overflow: hidden;
    position: relative;
  }

  .movies img {
    width: 100%;
    height: 250px;
    object-fit: cover;
    margin-bottom: 60px;
  }

  .movies h2 {
    font-size: 1.2rem;
    margin: 1rem;
    color: white;
  }

  .movies p {
    margin: 1rem;
  }

  .movies h2,
.movies p {
  height: 3rem; /* Or any other fixed height you prefer */
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

  .movies .show-overview-button {
  position: absolute;
  bottom: 50px;
  left: 50%;
  transform: translateX(-50%);
  z-index: 0;
}

  .movie-content {
    position: relative;
  }

  .show-overview-button {
  position: absolute;
  bottom: 20px;
  left: 50%;
  transform: translateX(-50%);
  z-index: 1;
  margin-bottom: -35px;
}

  .popup {
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background-color: rgba(0, 0, 0, 0.5);
    display: none;
    justify-content: center;
    align-items: center;
    filter:none;
  }
 .popup .overview-container {
    position: fixed;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    width: 80%;
    max-height: 80%;
    padding: 2rem;
    background-color: white;
    border-radius: 5px;
    overflow: auto;
    display: flex;
    flex-direction: column;
    z-index: 3;
    box-shadow: 0px 0px 10px rgba(0, 0, 0, 0.3);

.popup .overview-container::-webkit-scrollbar {
    width: 5px;
}

.popup .overview-container::-webkit-scrollbar-track {
    background: #f1f1f1;
}

.popup .overview-container::-webkit-scrollbar-thumb {
    background-color: #888;
    border-radius: 20px;
    border: 2px solid white;
}

.overview-container.blur {
    filter: none;
    pointer-events: auto;
}

.overview-container .close-button {
    position: absolute;
    top: 10px;
    right: 10px;
    font-size: 1.2rem;
    background-color: transparent;
    border: none;
    color: #888;
    cursor: pointer;
}
`;
document.head.appendChild(styleElement);

popup.addEventListener('click', (event) => {
    if (event.target === popup) {
        popup.style.display = 'none';
        overviewContainer.innerHTML = '';
        overviewContainer.classList.remove('blur');
    }
});