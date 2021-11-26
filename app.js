const API_KEY = 'api_key=b5a98eab4da72cac6d6017bab86d8978';
const BASE_URL = 'https://api.themoviedb.org/3';
const API_URL = BASE_URL + '/discover/movie?sort_by=popularity.desc&'+ API_KEY;
const IMG_URL = 'https://image.tmdb.org/t/p/w500';
const searchURl = BASE_URL + '/search/movie?' + API_KEY;

const genres = [
    {
        "id": 28,
        "name": "Action"
    },
    {
        "id": 12,
        "name": "Adventure"
    },
    {
        "id": 16,
        "name": "Animation"
    },
    {
        "id": 35,
        "name": "Comedy"
    },
    {
        "id": 80,
        "name": "Crime"
    },
    {
        "id": 99,
        "name": "Documentary"
    },
    {
        "id": 18,
        "name": "Drama"
    },
    {
        "id": 10751,
        "name": "Family"
    },
    {
        "id": 14,
        "name": "Fantasy"
    },
    {
        "id": 36,
        "name": "History"
    },
    {
        "id": 27,
        "name": "Horror"
    },
    {
        "id": 10402,
        "name": "Music"
    },
    {
        "id": 9648,
        "name": "Mystery"
    },
    {
        "id": 10749,
        "name": "Romance"
    },
    {
        "id": 878,
        "name": "Science Fiction"
    },
    {
        "id": 10770,
        "name": "TV Movie"
    },
    {
        "id": 53,
        "name": "Thriller"
    },
    {
        "id": 10752,
        "name": "War"
    },
    {
        "id": 37,
        "name": "Western"
    }
]

const mainSection = document.getElementById('mainSection');
const form = document.getElementById('form');
const search = document.getElementById('search');
const tagsEl = document.getElementById('tags');

const previous = document.getElementById('previous');
const next = document.getElementById('next');
const current = document.getElementById('current');


let currentPage = 1;
let nextPage = 2;
let previousPage = 3;
let lastUrl = '';
let totalPages = 100;

let selectedGenre = [];
setGenre()
function setGenre() {
    tagsEl.innerHTML = '';
    genres.forEach(genre => {
        const newTag = document.createElement('div');
        newTag.classList.add('tag');
        newTag.id = genre.id;
        newTag.innerText = genre.name;
        newTag.addEventListener('click', () => {
            if(selectedGenre.length == 0) { 
                selectedGenre.push(genre.id);
            } else {
                if(selectedGenre.includes(genre.id)) {
                    selectedGenre.forEach((id, index) => {
                        if(id == genre.id) {
                            selectedGenre.splice(index, 1);
                        }
                    })
                } else {
                    selectedGenre.push(genre.id);
                }
            }
            console.log(selectedGenre)
            getMovies(API_URL + '&with_genres=' +encodeURI(selectedGenre.join(',')))
            highlightSelection()
        })
        tagsEl.append(newTag);
    })
};
 
function highlightSelection() {
    const tags = document.querySelectorAll('.tag') 

    tags.forEach(tag => {
         tag.classList.remove('highlight')
    })
    exitBtn() 
    if(selectedGenre.length != 0) {
        selectedGenre.forEach(id => {
            const highlightedTag = document.getElementById(id);
            highlightedTag.classList.add('highlight');
        })
    }
    
}

function exitBtn() { 
    let exitBtn = document.getElementById('exit');

    if(exitBtn){
        exitBtn.classList.add('highlight');
    } else{
        let exit = document.createElement('div');
        exit.classList.add('tag', 'highlight');
        exit.id = 'exit';
        exit.innerText = '<<<Exit'
        exit.addEventListener('click', () => {
            selectedGenre = [];
            setGenre();
            getMovies(API_URL);
        })
        tagsEl.append(exit);
    }
    
}


getMovies(API_URL);

function getMovies(url) {
    lastUrl = url;
    // axios.get(url)
    fetch(url)
    .then(res => res.json())
    .then(data => {
        console.log(data.results)
        if(data.results.length !== 0) {
            showMovies(data.results);
            currentPage = data.page;
            nextPage = currentPage + 1;
            previousPage = currentPage - 1;
            totalPages = data.total_pages;

            current.innerText = currentPage;

            if(currentPage <= 1){
                previous.classList.add('disabled');
                next.classList.remove('disabled');
            } else if(currentPage >= totalPages){
                previous.classList.remove('disabled');
                next.classList.add('disabled');
            } else{
                previous.classList.remove('disabled');
                next.classList.remove('disabled')
            }
        } else {
            console.log('not found')
            mainSection.innerHTML = `<h1 class= "no_results">No Results Found</h1>`
        }
        tagsEl.scrollIntoView({behavior : 'smooth'})
    })
    .catch(e => {
        console.log("Error")
    })
}

function showMovies(data) {
    mainSection.innerHTML = '';

    data.forEach(movie => {
        const {title, poster_path, vote_average, overview, id} = movie;
        const movieEl = document.createElement('div');
        movieEl.classList.add('movie');
        movieEl.innerHTML = `
            <div class="movie">
                <img src="${poster_path? IMG_URL+poster_path: "http://via.placeholder.com/1080x1580"}" alt="${title}">
                <div class="movie_info">
                <h3>${title}</h3>
                </div>
                <span class="${getcolor(vote_average)}">${vote_average}</span>
                <div class="overview">
                    <h3>Overview</h3>
                    ${overview}
                    <br/>
                    <button class="watch_trailer" id ="${id}"> <i class="fas fa-play"></i> WATCH TRAILER</button>
                </div>
            </div>
        `
        mainSection.appendChild(movieEl);

        document.getElementById(id).addEventListener('click', () => {
            console.log(id)
            openNav(movie)
        })
    })
};

const overlayContent = document.getElementById('overlay_content')

function openNav(movie) {
    let id = movie.id;
    fetch(BASE_URL +`/movie/`+id+`/videos?`+ API_KEY)
    .then(res => res.json())
    .then(videoData => {
        console.log(videoData)
        if(videoData){
            document.getElementById("myNav").style.width = "100%";

            if(videoData.results.length > 0){
                let embed = [];

                videoData.results.forEach(video => {
                    let {name, key, site} = video

                    if(site = 'Youtube') {
                        embed.push(`
                        <iframe width="90%" height="515" src="https://www.youtube.com/embed/${key}" title="${name}" class = "embed hide" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>
                    `)
                    }
                    
                })
                
                overlayContent.innerHTML = embed.join('');
                activeSlide = 0;
                showVideos();
            } else {
                overlayContent.innerHTML = `<h1 class= "no_ results">No Results Found</h1>`
            }
        }
    })
    
}
  
function closeNav() {
    document.getElementById("myNav").style.width = "0%";

    const iframe = document.getElementsByTagName('iframe');

    if (iframe !== null) {
      for (let i = 0; i < iframe.length; i++) {
        iframe[i].src = iframe[i].src; 
      }
    }


}

let activeSlide = 0;
function showVideos() {
    let embedClasses = document.querySelectorAll('.embed');

    embedClasses.forEach((embedTag, idx) => {
        if(activeSlide == idx) {
            embedTag.classList.add('show');
            embedTag.classList.remove('hide');
        } else{
            embedTag.classList.add('hide');
            embedTag.classList.remove('show');
        }
    })
}

function getcolor(vote) {
    if(vote >= 8) {
        return 'green'
    } else if (vote >= 5) {
        return 'orange'
    } else {
        return 'red'
    }
}

form.addEventListener('submit', (e) => {
    e.preventDefault();

    const searchTearm = search.value; 
    selectedGenre = []; 
    highlightSelection()

    if(searchTearm) {
        getMovies(searchURl+'&query='+searchTearm)
    } else{
        getMovies(API_URL);
    }
})


previous.addEventListener('click', () => {
    if(previousPage > 0){
        pageCall(previousPage);
    }
});

next.addEventListener('click', () => {
    if(nextPage <= totalPages){
        pageCall(nextPage);
    }
});

function pageCall(page) {
    let urlSplit = lastUrl.split('?');
    let queryParams = urlSplit[1].split('&');
    let key = queryParams[queryParams.length - 1].split('=');
    if(key[0] != 'page'){
        let url = lastUrl + '&page=' + page
        getMovies(url)
    } else{
        key[1] = page.toString();
        let a = key.join('=');
        queryParams[queryParams.length - 1] = a;
        let b = queryParams.join('&');
        let url = urlSplit[0] +`?` + b
        getMovies(url)
    }
}

