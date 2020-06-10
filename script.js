
$.ajaxSetup({
    headers: {
        "X-API-KEY":"1f37da89-b5d9-49ed-9000-6cebbac196e2",
    },
});


$(function(){
    $( "#searchButton" ).click(function(){
        updateFilmsInfo();
    });    
});

function updateFilmsInfo(){
    
    $("#content").empty();
    console.log($("#search").val());
    $.ajax({
        url: 'https://kinopoiskapiunofficial.tech/api/v2.1/films/search-by-keyword?keyword=' + encodeURI($("#search").val()) + '&page=1',
        method: 'GET',
        success: function (data) {
            data.films.forEach((el, index) => {
                var c = el.countries.map((v) => {
                    return v.country;
                }).join(',');
                var g = el.genres.map((v) => {
                    return v.genre;
                }).join(',');
                data.films[index].countries = c;
                data.films[index].genres = g;
            });
            
            $('#itemTmpl').tmpl(data.films).appendTo('#content');
    
            data.films.forEach((el, index) => {
                $.ajax({
                    url: 'https://kinopoiskapiunofficial.tech/api/v2.1/films/' + el.filmId,
                    method: 'GET',
                    async: false,
                    success: function (data) {
                        console.log(data.data.filmId);
                        $("#"+ data.data.filmId).find(".desc p").text(data.data.description);
                    }
                });
            });
    
            
            
        }
    });
}

