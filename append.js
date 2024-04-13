if (document.getElementById(id="openwebrx-panel-receiver") != undefined )
{
var IntervalID = setInterval(none, 10000);
clearInterval(IntervalID);
var calc_frq;
function none()
{
}
function Get_current_frq()
{
var ddd = $('#openwebrx-panel-receiver').demodulatorPanel().getDemodulator();
var fff = ddd.get_offset_frequency();
var current_frequency = fff + center_freq;
return (current_frequency);
}
var is_tracking = false;
var mi1 = document.createElement("input");
mi1.setAttribute('type', 'text');
mi1.setAttribute('value', 'SAT ID');
mi1.style.width  = '60px';
mi1.style.height  = '20px';
var mi2 = document.createElement("button");
//mi2.setAttribute('type', 'text');
mi2.innerText = 'SAT NAME';
mi2.style.textAlign = 'left';
mi2.style.width  = '130px';
mi2.style.height  = '20px';
var mibutton = document.createElement('button')
mibutton.innerText = 'GO!'
mibutton.style.width  = '50px';
mibutton.style.height  = '20px';
mibutton.addEventListener('click', () => {
start_track();
})
document.getElementById(id="openwebrx-panel-receiver").appendChild(mi1);
document.getElementById(id="openwebrx-panel-receiver").appendChild(mi2);
document.getElementById(id="openwebrx-panel-receiver").appendChild(mibutton);
mi1.onclick = function() {mi1.value = "";}
function start_track()
{
if (is_tracking == false)
{
is_tracking = true;
var my_sat = mi1.value;
var sat_ID = mi1.value;
var my_lat = 56.000000;
var my_lon = 38.000000;
var t_1, t_2;
var sat_freq = Get_current_frq();
console.log(sat_freq);
var sat_data; 
  fetch('https://tle.ivanstanojevic.me/api/tle/' + sat_ID)
  .then(response => response.json())
  .then(data => {
	sat_data = data;
	if (data.name == undefined)
	{
	alert("NO SATTELITE FOUND!!!");
	is_tracking = false;
	return
	}
	mibutton.innerText = 'STOP';
	mi2.innerText = sat_data.name;
	console.log("TLE sat Name: " + sat_data.name);
	t_1 = data.line1;
	t_2 = data.line2;
    IntervalID = setInterval( function() 
	{ 
	calc_frq = GetDoppler(t_1,t_2,my_lat, my_lon, sat_freq);
	var demodulator = $('#openwebrx-panel-receiver').demodulatorPanel().getDemodulator();
    demodulator.set_offset_frequency(calc_frq - center_freq);
	}, 1000 );
  })
  .catch(error => console.error(error))
}
else
{
is_tracking = false;
clearInterval(IntervalID);
mibutton.innerText = 'GO!';
}}}
