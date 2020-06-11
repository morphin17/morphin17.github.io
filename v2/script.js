$.ajaxSetup({
    headers: {
        "X-API-KEY":"1f37da89-b5d9-49ed-9000-6cebbac196e2",
    },
});

$(function(){

    $("#buttonSearch").click(
        function(){
            updateFilmsInfo();
        }
    );
    
});


function shablon(film){
    var test = "test";

    return `
        <div class="item">
        <h1>
            ${film.nameRu}
        </h1>
        <img class="poster" src="${film.posterUrl}" alt="Постер">
        <table>
            <tbody>
                <tr>
                    <td class="type">Год</td>
                    <td> ${film.year} </td>
                </tr>
                <tr>
                    <td class="type">длительность </td>
                    <td>  ${film.filmLength}</td>
                </tr>
                <tr>
                    <td class="type"> страна </td>
                    <td>  ${film.countries}</td>
                </tr>
                <tr>
                    <td class="type"> жанр</td>
                    <td>  ${film.genres}</td>
                </tr>
            </tbody>
        </table>
        <div class="desc">
            <h2>Описание</h2>
            <p>
                ${film.description}
             </p>
        </div>
    </div>
    `;
}

function updateFilmsInfo(){
    $('#content').empty();
    $('#content').text("Загрузка...");

    $.ajax({
        url: 'https://kinopoiskapiunofficial.tech/api/v2.1/films/search-by-keyword?keyword=' + encodeURI($("#search").val()) + '&page=1',
        method: 'GET',
        success: function (data) {
            
            
            data.films.forEach( (el, index) => {

                var c = el.countries.map( co => {
                    return co.country;
                }).join(',');

                var g = el.genres.map( ge => {
                    return ge.genre;
                }).join(',');

                data.films[index].countries = c;
                data.films[index].genres = g;
            });

            
            data.films.forEach( (el,index) => {
                console.log(el.filmId);
                $.ajax({
                    url: 'https://kinopoiskapiunofficial.tech/api/v2.1/films/' + el.filmId,
                    method: 'GET',
                    async: false,
                    success: function (filmData) {
                        data.films[index].description = filmData.data.description;
                    }

                    //TODO обработать fail 
                    //https://stackoverflow.com/questions/8918248/ajax-success-and-error-function-failure
                });
            });

            console.log(data.films);

            var a = data.films.map( el => {
                return shablon(el);
            });

            console.log(a);

            var stringItems = a.join(' ');
            
            console.log(stringItems);

            $('#content').empty();

            if (data.films.length == 0){
                $('#content').text("Результатов нет.");
            }else{
                $('#content').html(stringItems);
            }
            
        }
    });
}