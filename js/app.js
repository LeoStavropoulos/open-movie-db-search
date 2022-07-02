//Listeners
$(document).ready(function () {
    var debounceTimeout = null;

    $("#searchField").on("input", function() {
        clearTimeout(debounceTimeout)
        debounceTimeout = setTimeout(() => getMoviesByTitle(this.value.trim()), 500);
    })

   $("body").on("click", hideMovieList);
});

//Services
function getMoviesByTitle(searchInput) {
    resetMovieList();
    fetchMovies(searchInput);
    showMovieList();
}

function getMovieById(selectedId) {
    resetMovieList();
    resetSearchField();
    fetchMovieById(selectedId);
}

//CRUD
function fetchMovies(searchInput) {
    let ajaxRequest = new XMLHttpRequest();
    let url = "https://www.omdbapi.com/?apikey=5ee61455&s=" + searchInput;

    ajaxRequest.open("GET", url, true);

    ajaxRequest.onreadystatechange = function() {
        if (ajaxRequest.readyState !== 4) return;
        
        handleResults(JSON.parse(ajaxRequest.response));
    }
    
    ajaxRequest.send();
}

function fetchMovieById(id) {
    let ajaxRequest = new XMLHttpRequest();
    let url = "https://www.omdbapi.com/?apikey=5ee61455&plot=full&i=" + id; 

    ajaxRequest.open("GET", url, true);

    ajaxRequest.onreadystatechange = function() {
        if (ajaxRequest.readyState !== 4) return;
        
        handleResults(JSON.parse(ajaxRequest.response));
    }
    
    ajaxRequest.send();
}

//Handlers
function handleResults(results) {
    
    if (results.Response === "False") {
        buildError(results.Error);
        return;
    }

    //If "Search" exists in response then its a list of movies
    if (results.Search) {
        buildMovieList(results.Search);
        return;
    }

    buildMainArea(results);
}

//Builders
function buildMovieList(movies) {
    movies.forEach(movie => {
        const item = `
            <li class="movie-list-item">
                <img src="${movie.Poster}" alt="${movie.Title} thumbnail" class="thumbnail">
                <div class="movie-info">
                    <p class="movie-title">${movie.Title}</p>
                    <p class="movie-year">${movie.Year}</p>
                    <p class="hidden">${movie.imdbID}</p>
                </div>
            </li>
        `
        $(item).appendTo(".movie-list");
    });

    $(".movie-list-item").on("click", function (e) {
        const id = $(this).find(".hidden").text();
        getMovieById(id);
    });
    
}

function buildMainArea(movie) {
    const element = `
    <img src="${movie.Poster}" alt="${movie.Title} poster" id="moviePoster">
    <div class="movie-details">
        <header id="title">${movie.Title}</header>
        <ul class="movie-basic-details">
            <li id="releaseDate"><strong>Released:</strong> ${movie.Released}</li>
            <li id="rating"><strong>Rating:</strong> ${movie.Rated}</li>
            <li id="year"><strong>Runtime:</strong> ${movie.Runtime}</li>
        </ul>
        <ul class="movie-misc-details">
            <li id="genre"><strong>Genre:</strong> ${movie.Genre}</li>
            <li id="scores">
                <a href="${getImdbLink(movie.imdbID)}" target="_blank">
                    <span class="imdb">
                        <svg style="height: 2em; width: 2em; color: rgb(222, 181, 34);" xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 32 32"><rect width="100%" height="100%" fill=""></rect> <path d="M19.078 12.786v0.005c-0.099-0.063-0.302-0.094-0.557-0.094v6.422c0.359 0 0.583-0.083 0.667-0.224 0.083-0.135 0.125-0.536 0.125-1.177v-3.823c0-0.438-0.005-0.719-0.042-0.839-0.031-0.13-0.089-0.219-0.188-0.271zM29.885 0h-27.724c-1.172 0.078-2.083 0.99-2.161 2.13v27.708c0.078 1.167 0.948 2.057 2.073 2.156 0.021 0.005 0.042 0.005 0.063 0.005h27.792c1.172-0.12 2.068-1.099 2.073-2.281v-27.438c0-1.188-0.927-2.188-2.115-2.281zM6.391 20.833h-2.542v-9.818h2.542zM15.109 20.833h-2.214v-6.63l-0.896 6.625h-1.583l-0.932-6.479-0.010 6.479h-2.219v-9.813h3.286c0.115 0.693 0.214 1.396 0.307 2.099l0.359 2.49 0.594-4.589h3.307zM21.745 17.927c0 0.87-0.057 1.458-0.141 1.76-0.078 0.292-0.224 0.531-0.432 0.693-0.198 0.172-0.453 0.292-0.76 0.354-0.297 0.057-0.76 0.099-1.359 0.099l-0.005-0.005h-3.073v-9.813h1.901c1.219 0 1.932 0.063 2.359 0.167 0.432 0.12 0.766 0.302 0.995 0.563 0.219 0.24 0.365 0.536 0.417 0.859 0.068 0.313 0.099 0.938 0.099 1.87zM28.339 18.557c0 0.599-0.063 1.021-0.12 1.323-0.083 0.297-0.26 0.536-0.542 0.755-0.302 0.224-0.641 0.323-1.042 0.323-0.292 0-0.667-0.083-0.906-0.182-0.25-0.125-0.474-0.318-0.688-0.573l-0.151 0.63h-2.292v-9.818l-0.026-0.005h2.401v3.198c0.198-0.234 0.422-0.411 0.677-0.531 0.266-0.109 0.625-0.172 0.922-0.172 0.302 0 0.599 0.047 0.88 0.156 0.229 0.094 0.427 0.245 0.583 0.438 0.12 0.167 0.198 0.359 0.24 0.563 0.036 0.182 0.057 0.573 0.057 1.156v2.74zM25.438 14.938c-0.156 0-0.255 0.057-0.297 0.161-0.042 0.109-0.078 0.385-0.078 0.833v2.594c0 0.432 0.036 0.714 0.078 0.833 0.052 0.115 0.172 0.182 0.302 0.177 0.156 0 0.359-0.063 0.401-0.188 0.036-0.13 0.057-0.427 0.057-0.896l0.042-0.005v-2.521c0-0.401-0.021-0.677-0.078-0.802-0.063-0.135-0.26-0.188-0.422-0.188z" fill="#deb522"></path> </svg>
                        <span>${movie.imdbRating}</span>
                    </span>
                </a>
                <a href="${getRTLink(movie.Title, movie.Type)}" target="_blank">
                    <span class="rt">
                        <svg style="height: 2em; width: 2em; color: rgb(250, 50, 10);" role="img" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><rect width="100%" height="100%" fill=""></rect><title>Rotten Tomatoes</title><path d="M5.866 0L4.335 1.262l2.082 1.8c-2.629-.989-4.842 1.4-5.012 2.338 1.384-.323 2.24-.422 3.344-.335-7.042 4.634-4.978 13.148-1.434 16.094 5.784 4.612 13.77 3.202 17.91-1.316C27.26 13.363 22.993.65 10.86 2.766c.107-1.17.633-1.503 1.243-1.602-.89-1.493-3.67-.734-4.556 1.374C7.52 2.602 5.866 0 5.866 0zM4.422 7.217H6.9c2.673 0 2.898.012 3.55.202 1.06.307 1.868.973 2.313 1.904.05.106.092.206.13.305l7.623.008.027 2.912-2.745-.024v7.549l-2.982-.016v-7.522l-2.127.016a2.92 2.92 0 0 1-1.056 1.134c-.287.176-.3.19-.254.264.127.2 2.125 3.642 2.125 3.659l-3.39.019-2.013-3.376c-.034-.047-.122-.068-.344-.084l-.297-.02.037 3.48-3.075-.038zm3.016 2.288l.024.338c.014.186.024.729.024 1.206v.867l.582-.025c.32-.013.695-.049.833-.078.694-.146 1.048-.478 1.087-1.018.027-.378-.063-.636-.303-.87-.318-.309-.761-.416-1.733-.418Z" fill="#fa320a"></path></svg>
                        <span>${getRTRating(movie)}</span>
                    </span>
                </a>
                <a href="${getMCLink(movie.Title, movie.Type)}" target="_blank">
                    <span class="mc">
                        <svg xmlns:dc="http://purl.org/dc/elements/1.1/" xmlns:cc="http://creativecommons.org/ns#" xmlns:rdf="http://www.w3.org/1999/02/22-rdf-syntax-ns#" xmlns:svg="http://www.w3.org/2000/svg" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" xmlns:sodipodi="http://sodipodi.sourceforge.net/DTD/sodipodi-0.dtd"xmlns:inkscape="http://www.inkscape.org/namespaces/inkscape" version="1.1" id="svg4518" width="2em" height="2em" viewBox="0 0 118 118" sodipodi:docname="metacritic.svg" inkscape:version="0.92.3 (2405546, 2018-03-11)"> <metadata id="metadata4524"> <rdf:RDF> <cc:Work rdf:about=""> <dc:format>image/svg+xml</dc:format> <dc:type rdf:resource="http://purl.org/dc/dcmitype/StillImage" /> <dc:title></dc:title> </cc:Work> </rdf:RDF> </metadata> <defs id="defs4522"> <linearGradient inkscape:collect="always" id="linearGradient910"> <stop style="stop-color:#3c638a;stop-opacity:1" offset="0" id="stop906" /> <stop id="stop857" offset="0.45437196" style="stop-color:#003366;stop-opacity:1" /> <stop style="stop-color:#00264b;stop-opacity:1" offset="1" id="stop908" /> </linearGradient> <linearGradient inkscape:collect="always" id="linearGradient4552"> <stop style="stop-color:#ffd739;stop-opacity:1;" offset="0" id="stop4548" /> <stop id="stop862" offset="0.49206755" style="stop-color:#f1c204;stop-opacity:1" /> <stop style="stop-color:#c49d00;stop-opacity:1" offset="1" id="stop4550" /> </linearGradient> <linearGradient inkscape:collect="always" xlink:href="#linearGradient4552" id="linearGradient4554" x1="-107.5547" y1="-34.348618" x2="-24.387714" y2="48.818363" gradientUnits="userSpaceOnUse" gradientTransform="translate(124.65509,51.960954)" /> <linearGradient inkscape:collect="always" xlink:href="#linearGradient910" id="linearGradient912" x1="23.37508" y1="22.186954" x2="95.517799" y2="94.329674" gradientUnits="userSpaceOnUse" /> </defs> <sodipodi:namedview pagecolor="#ffffff" bordercolor="#666666" borderopacity="1" objecttolerance="10" gridtolerance="10" guidetolerance="10" inkscape:pageopacity="0" inkscape:pageshadow="2" inkscape:window-width="1680" inkscape:window-height="1027" id="namedview4520" showgrid="false" inkscape:zoom="6.2511687" inkscape:cx="48.611599" inkscape:cy="63.293974" inkscape:window-x="-8" inkscape:window-y="-8" inkscape:window-maximized="1" inkscape:current-layer="layer2" /> <g inkscape:groupmode="layer" id="layer2" inkscape:label="vector" style="display:inline"> <circle style="opacity:1;fill:url(#linearGradient4554);fill-opacity:1;stroke:none;stroke-width:0.124;stroke-linejoin:miter;stroke-miterlimit:4;stroke-dasharray:none;stroke-opacity:0" id="path4528" cy="59" cx="59" r="59" /> <circle style="opacity:1;fill:#003366;fill-opacity:1;stroke:url(#linearGradient912);stroke-width:3.84905648;stroke-linejoin:miter;stroke-miterlimit:4;stroke-dasharray:none;stroke-opacity:1" id="path835" cx="59" cy="59" r="49.07547" /> <path style="display:inline;opacity:1;fill:#fffff5;fill-opacity:1;stroke:none;stroke-width:0.42215329;stroke-linejoin:miter;stroke-miterlimit:4;stroke-dasharray:none;stroke-opacity:1" d="M 46,37 C 34.538168,31.379754 22.640377,45.008915 25.5,56.5 l -5,-4.5 -9,9 34,34 L 56,84.5 36.5,65 C 28.014787,56.514787 37.515748,46.015748 46,54.5 L 66,74.5 76.5,64 57,44.5 C 48.513064,36.013064 58.016951,25.516951 66.5,34 L 86.5,54 97,43.5 73,19.5 C 60.302662,6.8026621 40.891805,23.280685 46,37 Z" id="path1518" inkscape:connector-curvature="0" sodipodi:nodetypes="cccccccccccccccc" /></g></svg>
                        <span>${movie.Metascore}</span>
                    </span>
                </a>
            </li>
            <li class="movie-details-text" id="director"><strong>Director:</strong> ${movie.Director}</li>
            <li class="movie-details-text" id="writer"><strong>Writer:</strong> ${movie.Writer}</li>
            <li class="movie-details-text" id="actors"><strong>Actors:</strong> ${movie.Actors}</li>
            <li class="movie-details-text" lang="en" id="plot"><strong>Plot:</strong> ${movie.Plot}</li>
            <li class="movie-details-text" id="language"><strong>Language:</strong> ${movie.Language}</li>
            <li class="movie-details-text" id="country"><strong>Country:</strong> ${movie.Country}</li>
            <li class="movie-details-text" id="awards">
                <svg style="height: 16px; width: 16px;" xmlns="http://www.w3.org/2000/svg" width="1em" height="1em" fill="currentColor" class="bi bi-award-fill" viewBox="0 0 16 16"> <path d="m8 0 1.669.864 1.858.282.842 1.68 1.337 1.32L13.4 6l.306 1.854-1.337 1.32-.842 1.68-1.858.282L8 12l-1.669-.864-1.858-.282-.842-1.68-1.337-1.32L2.6 6l-.306-1.854 1.337-1.32.842-1.68L6.331.864 8 0z" fill="inherit"></path> <path d="M4 11.794V16l4-1 4 1v-4.206l-2.018.306L8 13.126 6.018 12.1 4 11.794z" fill="inherit"></path></svg>
                <span>${movie.Awards}</span> 
            </li>
        </ul> 
    </div>       
    `;

    $(".main-area").html("");
    $(element).appendTo(".main-area");

}

function buildError(err) {
    const element = `
        <li id="errorMessage">${err}</li> 
    ` 
    $(element).appendTo(".movie-list");
}

//Helper Functions
function showMovieList() {
    $(".search-dropdown").removeClass("hidden");
}

function hideMovieList() {
    if (!$(".search-dropdown").hasClass("hidden")) $(".search-dropdown").addClass("hidden");
}

function resetMovieList() {
    $(".movie-list").html("");
}

function resetSearchField() {
    $("#searchField").val("");
}

function getRTRating(movie) {
    
    let rating = movie.Ratings.reduce(function(previousValue, currentValue){
        if (currentValue.Source === "Rotten Tomatoes") return currentValue.Value;
        
        return previousValue;
        
    }, "N/A");

    return rating;
    
}

function getImdbLink(id) {
    return "https://www.imdb.com/title/" + id + "/";
}

function getRTLink(title, type) {
    link = "https://www.rottentomatoes.com/"
    title = title.replace(/[- :]/g,"_").replace(/_+/g, "_").toLowerCase();
    if (type === "movie") {return link + "m/" + title + "/"}
    if (type === "series") {return link + "tv/" + title + "/"}
    return link
}

function getMCLink(title, type) {
    link = "https://www.metacritic.com/"
    title = title.replace(/[ :]/g,"-").toLowerCase();
    if (type === "movie") {return link + "movie/" + title + "/"}
    if (type === "series") {return link + "tv/" + title + "/"}
    return link
}
