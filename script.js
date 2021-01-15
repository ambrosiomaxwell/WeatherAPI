cities = []



retrieve = localStorage.getItem("cities")
if(retrieve != null){
cities = JSON.parse(retrieve)
}


//sets up history row from cities list

function addHistory(c){
    historyRow= $('<li>').text(c).addClass('history-row').attr('id', c)
    $('.history').append(historyRow)
}
function historySetup(){
    $('.history').empty()
    cities.forEach(e => {
        addHistory(e)
    });
}

historySetup()









$('#search-button').click(function(){
    currentCity = $('#search-value').val()
    currentCity = currentCity.toLowerCase()
    $('#search-value').val('')

    checkCity = cities.includes(currentCity)
    if(checkCity == true){
        console.log('already in history')
    }
    else{
    cities.push(currentCity)
    addHistory(currentCity)
    }
    historySetup()
    setUp(currentCity)


    localStorage.setItem('cities', JSON.stringify(cities))

    })

    $('.history-row').click(function(element){
        theCity = $(this).attr('id')
        

        setUp(theCity)

    })


function setUp(city){

    $('#today').empty()
    $('#forecast').empty()
    cityURL = 'https://api.openweathermap.org/data/2.5/weather?q=' + city +'&units=imperial&APPID=682c772d04578194ce0e0bb350754206';


    $.ajax({
        url: cityURL,
        method: 'GET'
    })
    .then(function(response){

    //grabs current city information and saves it as variables
    let curCity = city
    var latitude = response.coord.lat
    var longitude = response.coord.lon


    let curTemp = response.main.temp
    let curHumidity = response.main.humidity
    let curWind = response.wind.speed

    
    let curDate = dayjs.unix(response.dt).format('MM/DD/YYYY')

    
    var fiveDayURL = 'https://api.openweathermap.org/data/2.5/onecall?lat='+ latitude +'&lon='+longitude+'&exclude=minutely,hourly&units=imperial&appid=682c772d04578194ce0e0bb350754206'


    $.ajax({
        url: fiveDayURL,
        method: 'GET'
    })
    .then(function(response){
        let curUV = response.current.uvi


        //LOOP to set up daily forecast
        for(i=1; i<6; i++){
        
        let dailyDate = dayjs.unix(response.daily[i].dt).format('MM/DD/YYYY')
        
        console.log(dailyDate)
        let dailytemp = response.daily[i].temp.day
        let dailyHumidity = response.daily[i].humidity
        let dailyIcon = response.daily[i].weather[0].icon


        console.log(dailyIcon)
        
        dailyBox = $('<div>').addClass('col-lg-2 rounded bg-primary daily-box shadow')
        disDailyDate = $('<h4>').text(dailyDate)
        disDailyIcon = $('<img>').attr('src', 'http://openweathermap.org/img/wn/' + dailyIcon +'@2x.png')
        disDailytemp = $('<h5>').text('Temp: ' + dailytemp+ '°')
        disDailyHumidity = $('<h5>').text('Humidity: ' + dailyHumidity + '%')

            dailyBox.append(disDailyDate, disDailyIcon, disDailytemp, disDailyHumidity)
            $('#forecast').append(dailyBox)
        }




        displayCity = $('<h1>').text(city + ' ('+ curDate + ')' ).addClass('mt-3')
        displayTemp = $('<h4>').text('Temperature: ' + curTemp+ '°F').addClass('mt-3')
        displayHumidity = $('<h4>').text('Humidity: ' + curHumidity+ '%').addClass('mt-3')
        displayWind = $('<h4>').text('Wind Speed: ' + curWind + 'MPH').addClass('mt-3')
        displayUV = $('<h4>').text('UV index: ' + curUV).addClass('mt-3')
        $('#today').append(displayCity, displayTemp, displayHumidity,displayWind,displayUV)
    })
})



}








