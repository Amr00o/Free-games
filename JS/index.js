$(document).ready(function() {

    let allGames = [];
    let favoriteGames = JSON.parse(localStorage.getItem('favoriteGames')) || [];

// show loading

function showLoading(){
    if ($(".loading").length === 0) {
        $("body").append(`
            <div class="loading d-flex justify-content-center align-items-center">
                <div class="loader"></div>
            </div>`);
        $(".loading").css('display', 'block');
        $("body").css('overflow', 'hidden');
    }   
}

// hide loading

function hideLoading(){
    $(".loader").fadeOut(1000, function(){
        $(".loading").fadeOut(1000, function(){
            $("body").css('overflow', 'auto');
            $(".loading").remove();
        })
    })
}



// backgroundColor Nav, btnUp

let sectionOff = $("#home").offset().top;

$(window).scroll(function(){
    let windowScroll = $(window).scrollTop();
    if(windowScroll> sectionOff){
        $(".navbar").css("backgroundColor", "#141c31f6");
        $("#btnUp").fadeIn(500);
    }
    else{
        $(".navbar").css("backgroundColor", "transparent");
        $("#btnUp").fadeOut(500);
    }
});

$("#btnUp").click(function(){
    $("html, body").animate({scrollTop:0}, 300);
})


// category

$('#category').change(function() {
    showLoading();
    let selectedCategory = $(this).val();
    fetchGameData(selectedCategory);
    $("#textCat").empty();
    $("#textCat").text(selectedCategory);
    $('#search').addClass('d-none');
});
$('#moreCate').change(function() {
    showLoading();
    let selectedCategory2 = $(this).val();
    fetchMoreGame(selectedCategory2);
    $("#textCat").empty();
    $("#textCat").text(selectedCategory2);
    $('#search').addClass('d-none');
});


// API for all games

async function getAllGame() {
    const options = {
        method: 'GET',
        headers: {
            'x-rapidapi-key': 'e87702843emsh2e4e4232fdcf868p13c168jsn2790db320082',
            'x-rapidapi-host': 'free-to-play-games-database.p.rapidapi.com'
        }
    };
    const api = await fetch(`https://free-to-play-games-database.p.rapidapi.com/api/games`, options);
    const finalApi = await api.json();
    allGames = finalApi;
    addGames(allGames);
    hideLoading();
    $("#options").css("display", "block")
};
getAllGame();

function addGames(data) {
    let cartoona = "";

    for (let i = 0; i < data.length; i++) {

        let words = data[i].short_description.split(" ");
        let shortDescription = words.slice(0, 5).join(" ");
        if (words.length > 4) {
            shortDescription += "...";
        }

        const isFavorite = favoriteGames.some(game => game.id === data[i].id);
        const heartClass = isFavorite ? 'fa-solid' : 'fa-regular';

        cartoona += `
        <div class="col-md-3">
            <div class="allInformation" data-id="${data[i].id}">
                <img src="${data[i].thumbnail}" class="w-100" alt="">
                <div class="text p-3">
                    <h5>${data[i].title}</h5>
                    <p>${shortDescription}</p>
                    <div class="genre d-flex justify-content-between">
                        <p class="text-info fs-6">${data[i].genre}</p>
                        <i class="${heartClass} fa-heart text-info fs-4 favorite-icon" data-id="${data[i].id}"></i>
                    </div>
                </div>
            </div>
        </div>
        `;
    }

    $("#allData").html(cartoona);
};

 //favorites

 function updateFavorites() {
    localStorage.setItem('favoriteGames', JSON.stringify(favoriteGames));
}

$(document).on('click', '.favorite-icon', function(event) {
    event.stopPropagation(); 
    const gameId = $(this).data('id');
    const gameIndex = favoriteGames.findIndex(game => game.id === gameId);

    if (gameIndex === -1) {
        // Add game to favorites
        const gameData = allGames.find(game => game.id === gameId);
        favoriteGames.push(gameData);
        $(this).addClass('fa-solid').removeClass('fa-regular');
    } else {
        // Remove game from favorites
        favoriteGames.splice(gameIndex, 1);
        $(this).addClass('fa-regular').removeClass('fa-solid');
    }

    updateFavorites();

});


//favorites

function displayFavorites() {
    let cartoona = "";

    for (let i = 0; i < favoriteGames.length; i++) {
        let words = favoriteGames[i].short_description.split(" ");
        let shortDescription = words.slice(0, 5).join(" ");
        if (words.length > 4) {
            shortDescription += "...";
        }

        cartoona += `
        <div class="col-md-12 mt-3">
            <div class="allInformation d-flex p-1" data-id="${favoriteGames[i].id}">
                <img src="${favoriteGames[i].thumbnail}" alt="">
                <div class="text p-3 w-100">
                    <h5>${favoriteGames[i].title}</h5>
                    <p>${shortDescription}</p>
                    <div class="genre d-flex justify-content-between mt-5 p-3">
                        <p class="text-info fs-6">${favoriteGames[i].genre}</p> 
                        <i class="fa-solid fa-heart text-info fs-4 favorite-icon" data-id="${favoriteGames[i].id}"></i>
                    </div>
                </div>
            </div>
        </div>
        `;
    }

    if (cartoona === "") {
        cartoona = "<p class='text-center text-white'>No favorite games found.</p>";
    }
    $("#favoPageContent").html(cartoona); 
}


// Initialize
getAllGame();
displayFavorites();


// API for category games

async function fetchGameData(category) {
    const options = {
        method: 'GET',
        headers: {
            'x-rapidapi-key': 'e87702843emsh2e4e4232fdcf868p13c168jsn2790db320082',
            'x-rapidapi-host': 'free-to-play-games-database.p.rapidapi.com'
        }
    };
    const api = await fetch(`https://free-to-play-games-database.p.rapidapi.com/api/games?category=${category}`, options);
    const data = await api.json();
    $('#allData').empty();
    addGames(data);
    hideLoading();
};
async function fetchMoreGame(category2) {
    const options = {
        method: 'GET',
        headers: {
            'x-rapidapi-key': 'e87702843emsh2e4e4232fdcf868p13c168jsn2790db320082',
            'x-rapidapi-host': 'free-to-play-games-database.p.rapidapi.com'
        }
    };
    const api = await fetch(`https://free-to-play-games-database.p.rapidapi.com/api/games?category=${category2}`, options);
    const data = await api.json();
    $('#allData').empty();
    addGames(data);
    hideLoading();
};

$(document).on('click', '.allInformation', function() {
    showLoading();
    const gameId = $(this).data('id');
    detailsGames(gameId);
});

// API for detailsGames

async function detailsGames(gameId){
    const options = {
        method: 'GET',
        headers: {
            'x-rapidapi-key': 'e87702843emsh2e4e4232fdcf868p13c168jsn2790db320082',
            'x-rapidapi-host': 'free-to-play-games-database.p.rapidapi.com'
        }
    };

        const apiDet = await fetch(`https://free-to-play-games-database.p.rapidapi.com/api/game?id=${gameId}`, options);
        const gameDetails = await apiDet.json();
        displayGameDetails(gameDetails);
        hideLoading();
        $("#options").css("display", "none");
        $("#option").css("display", "none");
        $("#favorites").addClass("d-none");
};


// gameDetails

function displayGameDetails(gameDetails) {
    $("#imgDetails").attr("src", gameDetails.thumbnail);
    $("#titleDetails").text(gameDetails.title);
    $("#desDetails").text(gameDetails.description);

    let Detinformation = `
        <div class="col-md-4">
            <h6 class="text-white">Title</h6>
            <p>${gameDetails.title}</p>
        </div>
        <div class="col-md-4">
            <h6 class="text-white">Developer</h6>
            <p>${gameDetails.developer}</p>
        </div>
        <div class="col-md-4">
            <h6 class="text-white">Publisher</h6>
            <p>${gameDetails.publisher}</p>
        </div>
        <div class="col-md-4">
            <h6 class="text-white">Release Date</h6>
            <p>${gameDetails.release_date}</p>
        </div>
        <div class="col-md-4">
            <h6 class="text-white">Genre</h6>
            <p>${gameDetails.genre}</p>
        </div>
        <div class="col-md-4">
            <h6 class="text-white">Platform</h6>
            <p class="mb-3">${gameDetails.platform}</p>
        </div>
    `;

    Detinformation += `
        <div class="container">
            <div class="moreDetails mt-5">
                <h3 class="fs-4 ">${gameDetails.title} Screenshots</h3>
                <div id="Screenshots" class="row mt-5">
    `;

    gameDetails.screenshots.forEach(screenshot => {
        Detinformation += `
            <div class="col-md-4 mb-3">
                <img src="${screenshot.image}" class="w-100" alt="Screenshot">
            </div>
                
        `;
    });
    Detinformation += `
                </div>
            </div>
        </div>`;

    if (gameDetails.minimum_system_requirements) {
        Detinformation += `
        <div class="container mt-5">
        <h3 class="fs-4">Minimum System Requirements</h3>
        <div class="row mt-5">
            <div class="col-md-4">
                <h6 class="text-white">OS</h6>
                <p>${gameDetails.minimum_system_requirements.os}</p>
            </div>
            <div class="col-md-4">
                <h6 class="text-white">Processor</h6>
                <p>${gameDetails.minimum_system_requirements.processor}</p>
            </div>
            <div class="col-md-4">
                <h6 class="text-white">Memory</h6>
                <p>${gameDetails.minimum_system_requirements.memory}</p>
            </div>
            <div class="col-md-4">
                <h6 class="text-white">Graphics</h6>
                <p>${gameDetails.minimum_system_requirements.graphics}</p>
            </div>
            <div class="col-md-4">
                <h6 class="text-white">Storage</h6>
                <p>${gameDetails.minimum_system_requirements.storage}</p>
            </div>
        </div>
        </div>
    `;
    };

    $("#Detinformation").html(Detinformation);

    $("#home").addClass("d-none");
    $("#details").removeClass("d-none");

    $("#homePage").click(function(){
        $("#home").removeClass("d-none");
        $("#details").addClass("d-none");
    });
};

// click icon nav

$(".navbar-brand").click(function(){
    showLoading();
    $("#favorites").addClass("d-none");
    $("#details").addClass("d-none");
    $("#home").removeClass("d-none");
    $("#options").css("display", "block");
    $("#option").css("display", "block");
    $("#textCat").empty();
    $("#textCat").text(`Welcom in the best website for Gaming`);
    $('#search').removeClass('d-none');
    displayFavorites(); 
    getAllGame();
});

// ckick home

$('#homePage').click(function() {
    showLoading();
    $("#favorites").addClass("d-none");
    $("#details").addClass("d-none");
    $("#home").removeClass("d-none");
    $("#options").css("display", "block");
    $("#option").css("display", "block");
    $("#textCat").empty();
    $("#textCat").text(`Welcom in the best website for Gaming`);
    $('#search').removeClass('d-none');
    displayFavorites(); 
    getAllGame();
});


// click Favorites

$('#favoritePage').click(function() {
    showLoading();
    $("#home").addClass("d-none");
    $("#details").addClass("d-none");
    $("#options").css("display", "none");
    $("#option").css("display", "none");
    displayFavorites();
    $("#favorites").removeClass("d-none"); 
    hideLoading();
});



// Search

let search = document.getElementById("search");

search.addEventListener('input', function(){
    event.preventDefault(); 
    if ($("#home").is(":visible")) { 
        let searchQuery = search.value.toLowerCase();
        let filteredGames = allGames.filter(game => game.title.toLowerCase().includes(searchQuery));
        addGames(filteredGames);
    }   
}); 
    
});
