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
var divider = document.createElement("div");
divider.classList.add('openwebrx-section-divider');
divider.innerText = '▾ Doppler shift';
divider.setAttribute('onclick', 'UI.toggleSection(this);')
var section = document.createElement("div");
section.classList.add('openwebrx-section');
section.setAttribute('id', 'openwebrx-section-doppler')
var mi1 = document.createElement("input");
mi1.setAttribute('type', 'text');
mi1.setAttribute('value', '');
mi1.setAttribute('placeholder', 'SAT ID');
mi1.style.width  = '60px';
mi1.style.padding = '3px';
var mi2 = document.createElement("button");
mi2.innerText = 'SAT NAME';
mi2.style.width  = '120px';
mi2.style.height  = '27px';
mi2.style.marginLeft = '10px';
mi2.style.marginRight = '10px';
mi2.style.color = 'white';
mi2.style.borderRadius = '5px';
mi2.style.background = 'linear-gradient(#373737, #4F4F4F)';
mi2.style.border = 'none';
var mibutton = document.createElement('button')
mibutton.innerText = 'GO'
mibutton.classList.add('openwebrx-button');
mibutton.style.border = 'none';
mibutton.style.height = '27px';
mibutton.addEventListener('click', () => {
start_track();
})
document.getElementById(id="openwebrx-panel-receiver").appendChild(divider);
document.getElementById(id="openwebrx-panel-receiver").appendChild(section);
document.getElementById(id="openwebrx-section-doppler").appendChild(mi1);
document.getElementById(id="openwebrx-section-doppler").appendChild(mi2);
document.getElementById(id="openwebrx-section-doppler").appendChild(mibutton);
mi1.onclick = function() {mi1.value = "";}
function start_track()
{
if (is_tracking == false)
{
is_tracking = true;
var my_sat = mi1.value;
var sat_ID = mi1.value;
var receiver_GPS = Utils.getReceiverPos();
if ((receiver_GPS == undefined) || (receiver_GPS == null) )
{
var my_lat = 56.000000;
var my_lon = 38.000000;
alert("No GPS found. Using GPS from js file")
}
else
{
var my_lat = receiver_GPS.lat;
var my_lon = receiver_GPS.lon;
}
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
