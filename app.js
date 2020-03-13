  
const searchButton = document.querySelector('#search');;
const searchInput = document.querySelector('#searchValue');
const moviesContainer = document.querySelector('#movies-container');
const moviesSearchable = document.querySelector('#movies-searchable');

const MOVIE_DB_API = '36493cde35ec2a070eec55f2b62c7e97';
const MOVIE_DB_ENDPOINT = 'https://api.themoviedb.org';
const MOVIE_DB_IMAGE_ENDPOINT = 'https://image.tmdb.org/t/p/w500';
const DEFAULT_POST_IMAGE = 'https://via.placeholder.com/150';

function requestMovies(url, onComplete, onError) {
    fetch(url)
        .then((res) => res.json())
        .then(onComplete)
        .catch(onError);
}

function generateMovieDBUrl(path) {
    const url = `${MOVIE_DB_ENDPOINT}/3${path}?api_key=${MOVIE_DB_API}`;
    return url;
}


function getTrendingMovies() {
    const url = generateMovieDBUrl('/trending/movie/day');
    const render = renderMovies.bind({ title: 'Trending Movies' })
    requestMovies(url, render, handleGeneralError);
}

function getRecomendMovies(movieId){
    const url = MOVIE_DB_ENDPOINT + '/3/movie/' + movieId + '/recommendations?api_key=' +MOVIE_DB_API + '&language=en-US&page=1';
    const render = renderMovies.bind({ title: 'Recommended Movies' })
    requestMovies(url, render, handleGeneralError);
}


function getMovieDetails(movieId){
    //let maper = movies.map((movie)=>{}
    let getMovieURL = MOVIE_DB_ENDPOINT + '/3/movie/' + movieId + "?api_key=" +MOVIE_DB_API;
    fetch(getMovieURL)
        .then((res)=> res.json())
        .then((res)=> {
        if(res.poster_path){
        let output = `
        <h2><img src="${MOVIE_DB_IMAGE_ENDPOINT+ res.poster_path}"></h2>
        <h2>${res.title}</h2>
        <p>${res.overview}</p>
        <p>${getRecomendMovies(movieId)}</p>
`
        document.getElementById('movies-container').innerHTML = output;}
    })
}


function generateMoviesBlock(data) {
    const movies = data.results;
    const section = document.createElement('section');
    section.setAttribute('class', 'section');

    for (let i = 0; i < movies.length; i++) {
        const { title, id } = movies[i];

        if (title) {
            let imageContainer = document.createElement('p');
            imageContainer.setAttribute("class","sr-only");
            imageContainer.setAttribute("data-movie-id", id);
            imageContainer.appendChild(document.createTextNode(title));
            
            section.appendChild(imageContainer);
            
        }
    }

    const movieSectionAndContent = createMovieContainer(section);
    return movieSectionAndContent;
  
}

function eventList(){
    let elements = document.getElementsByClassName("sr-only");
    for(var i = 0; i < elements.length; i++) {
         elements[i].addEventListener("click", function(e){
            console.log(e.target.getAttribute('data-movie-id'));
             getMovieDetails(e.target.getAttribute('data-movie-id'));
             
        });
    }
    
}


// Invoke a different function for search movies
function searchMovie(value) {
    const url = generateMovieDBUrl('/search/movie') + '&query=' + value;
    requestMovies(url, renderSearchMovies, handleGeneralError);
}


const log = console.log;


function resetInput() {
    searchInput.value = '';
}

function handleGeneralError(error) {
    log('Error: ', error.message);
    alert(error.message || 'Internal Server');
}


function createSectionHeader(title) {
    const header = document.createElement('h2');
    header.innerHTML = title;

    return header;
}


function renderMovies(data) {
    const moviesBlock = generateMoviesBlock(data);
    const header = createSectionHeader(this.title);
    moviesBlock.insertBefore(header, moviesBlock.firstChild);
    moviesContainer.appendChild(moviesBlock);
    eventList();
}



function renderSearchMovies(data) {
    moviesSearchable.innerHTML = '';
    const moviesBlock = generateMoviesBlock(data);
    moviesSearchable.appendChild(moviesBlock);
    eventList();
}





// Inserting section before content element
function createMovieContainer(section) {
    const movieElement = document.createElement('div');
    movieElement.setAttribute('class', 'movie');

    const template = ``;

    movieElement.innerHTML = template;
    movieElement.insertBefore(section, movieElement.firstChild);
    return movieElement;
}

searchButton.onclick = function (event) {
    event.preventDefault();
    const value = searchInput.value

   if (value) {
    searchMovie(value);
   }
    resetInput();
}

getTrendingMovies();