const CELLS_VERTICALLY = 67;
const CELLS_HORIZONTAL = 192;
tab = new Array(CELLS_VERTICALLY);

//Option 0-live 1-dead 
var option = 0;
//play or pause
var go = false;
//speed evolution
var speed = 250;
//loupe
var loupe = 3;
//show cells
var show_cells_vertical;
var show_cells_horizontal;

var net = false;

function print_cells(y,x)	{
	var cells = "";
	for(i=1; i<x-1;i++){
		for(j=1;j<y-1;j++){
			cells+='<div class="cell" id="cell_'+i+'_'+j+'" onclick="live_or_dead('+i+','+j+')"></div>';
		}
		cells+='<div style="clear: both"></div>';
	}
	document.getElementById("world").innerHTML = cells;
}

function print_cells_v2(w)	{
	var cell_size;
	if(loupe==1) cell_size=50;
	else if(loupe==2) cell_size=25;
	else if(loupe==3) cell_size=10;
	
	var cell_vertical = Math.floor((650)/cell_size);
	var y=Math.floor((CELLS_VERTICALLY-cell_vertical)/2);
	
	var cell_horizontal = Math.floor((w-20)/cell_size);
	var x=Math.floor((CELLS_HORIZONTAL-cell_horizontal)/2);
	
	var cells = "";
	for(i=y; i<y+cell_vertical;i++){
		for(j=x;j<x+cell_horizontal;j++){
			var classa = "cell_";
			if(net == false) classa+="no_net_";
			classa+=loupe;
			cells+='<div class="'+classa+'" id="cell_'+i+'_'+j+'" onclick="live_or_dead('+i+','+j+')"></div>';
			
		}
		cells+='<div style="clear: both"></div>';
	}
	document.getElementById("world").innerHTML = cells;
	for(i=y; i<y+cell_vertical;i++){
		for(j=x;j<x+cell_horizontal;j++){
			if(tab[i][j]==true){
				
					var div_name = 'cell_'+i+'_'+j;
					document.getElementById(div_name).style.backgroundColor = "#00FF00";
				
			}
		}
	}
}

window.onload = function create_world()	{
	change_option(0);
	
	for (i=0; i < CELLS_VERTICALLY; i++) {
		tab[i] = new Array(CELLS_HORIZONTAL);
		for (j=0; j < CELLS_HORIZONTAL; j++) {
			tab[i][j] = false;
		}
	}
	
	//print_cells(CELLS_HORIZONTAL,CELLS_VERTICALLY);
	document.getElementById("slider1").value = "4";
	change_speed();
	document.getElementById("slider2").value = "4";
	change_lopue();
	change_net();
	
	getDimensions();
}

function live_or_dead(y,x)	{
	var div_name = 'cell_'+y+'_'+x;
	if(option == 0){
		if(tab[y][x] == true){
			document.getElementById(div_name).style.backgroundColor = "#000000";
			tab[y][x]=false;
		}
		else if(tab[y][x] == false){
			document.getElementById(div_name).style.backgroundColor = "#00FF00";
			tab[y][x]=true;
		}
	}
	else if(option == 1){
		document.getElementById(div_name).style.backgroundColor = "#00FF00";
		tab[y][x]=true;
	}
	else if(option == 2){
		document.getElementById(div_name).style.backgroundColor = "#000000";
		tab[y][x]=false;
	}
}

function change_option(nr_button)	{
	var div_name = 'b'+option;
	document.getElementById(div_name).style.backgroundColor = "#000000";
	option = nr_button;
	var div_name = 'b'+option;
	document.getElementById(div_name).style.backgroundColor = "#FFFFFF";
}

function next_generation(){
	tab_next_generation = new Array(CELLS_VERTICALLY);
	
	for (i=0; i < CELLS_VERTICALLY; i++) {
		tab_next_generation[i] = new Array(CELLS_HORIZONTAL);
		for (j=0; j < CELLS_HORIZONTAL; j++) {
			tab_next_generation[i][j] = false;
		}
	}
	
	//regurly gry
	for (i=1; i < CELLS_VERTICALLY-1; i++) {
		for (j=1; j < CELLS_HORIZONTAL-1; j++) {
			var neighbors = 0;
			if(tab[i-1][j-1] == true) neighbors++;
			if(tab[i-1][j] == true) neighbors++;
			if(tab[i-1][j+1] == true) neighbors++;
			if(tab[i][j-1] == true) neighbors++;
			if(tab[i][j+1] == true) neighbors++;
			if(tab[i+1][j-1] == true) neighbors++;
			if(tab[i+1][j] == true) neighbors++;
			if(tab[i+1][j+1] == true) neighbors++;
			//zywa komorka
			if(tab[i][j] == true){
				//nadal zyje
				if(neighbors == 2 || neighbors == 3){
					tab_next_generation[i][j] = true;
				}
				//umiera z samotnoscie lub zatlczenia
				else {
					tab_next_generation[i][j] = false;
					var div_name = 'cell_'+i+'_'+j;
					if(document.getElementById( div_name)){
						document.getElementById(div_name).style.backgroundColor = "#000000";	
					}
				}
			}
			//martwa komorka
			else if(tab[i][j] == false){
				//rodzi sie
				if(neighbors == 3) {
					tab_next_generation[i][j] = true;
					var div_name = 'cell_'+i+'_'+j;
					if(document.getElementById(div_name)){
						document.getElementById(div_name).style.backgroundColor = "#00FF00";
					}
				}
				else tab_next_generation[i][j] = false;
			}
		}
	}
	
	//przepisanie
	for (i=1; i < CELLS_VERTICALLY-1; i++) {
		for (j=1; j < CELLS_HORIZONTAL-1; j++) {
			tab[i][j] = tab_next_generation[i][j];
		}
	}
	
	if(go == true) setTimeout("next_generation()",speed);
}

function step()	{
	//zatrzymanie evolucji
	if(go == true){
		play_or_pause();
	}
	next_generation();
}

function play_or_pause(){
	//zmiana obrazka
	if(go == true){
		document.getElementById("play").innerHTML = '<div id="play_sign"></div>';
		go = false;
	}
	else if(go == false){
		document.getElementById("play").innerHTML = '<div id="pause_sign"></div>';
		go = true;
		next_generation();
	}
}

function cls()	{
	//zatrzymanie evolucji
	if(go == true){
		play_or_pause();
	}
	//czyszczenie tabeli
	for (i=1; i < CELLS_VERTICALLY-1; i++) {
		for (j=1; j < CELLS_HORIZONTAL-1; j++) {
			tab[i][j] = false;
			var div_name = 'cell_'+i+'_'+j;
			if(document.getElementById(div_name)){
				document.getElementById(div_name).style.backgroundColor = "#000000";
			}
		}
	}
}

function change_speed()	{
	var x = document.getElementById("slider1").value;
    document.getElementById("speed_number").innerHTML = "x"+x;
	speed=1000/x;
}

function minus()	{
	document.getElementById("slider1").stepDown(1);
	change_speed();
}

function plus()	{
	document.getElementById("slider1").stepUp(1);
	change_speed();
}

function speed_range()	{
	change_speed();
}

function change_lopue()	{
	var x = document.getElementById("slider2").value;
    document.getElementById("loupe_number").innerHTML = "x"+x;
	loupe=x;
	getDimensions();
}

function minus_loupe()	{
	document.getElementById("slider2").stepDown(1);
	change_lopue();
}

function plus_loupe()	{
	document.getElementById("slider2").stepUp(1);
	change_lopue();
}

function loupe_range()	{
	change_lopue();
}

function change_net()	{
	if(net==true){
		net=false;
		document.getElementById("net").innerHTML= '<div id="table"><div class="empty_cell_top_leftY" ></div><div class="empty_cell_topY"style="background:#0F0"></div><div class="empty_cell_topY"style="background:#0F0"></div><div class="empty_cell_topY"></div><div style="clear: both"></div><div class="empty_cell_leftY"style="background:#0F0"></div><div class="empty_cellY"></div><div class="empty_cell"></div><div class="empty_cellY"style="background:#0F0"></div><div style="clear: both"></div><div class="empty_cell_leftY"style="background:#0F0"></div><div class="empty_cellY"></div><div class="empty_cellY"style="background:#0F0"></div><div class="empty_cellY"></div><div style="clear: both"></div><div class="empty_cell_leftY"></div><div class="empty_cellY"style="background:#0F0"></div><div class="empty_cellY"></div><div class="empty_cellY"></div><div style="clear: both"></div></div>';
		
		for (i=1; i < CELLS_VERTICALLY-1; i++) {
			for (j=1; j < CELLS_HORIZONTAL-1; j++) {
				var div_name = 'cell_'+i+'_'+j;
				if(document.getElementById(div_name)){
					document.getElementById(div_name).className = 'cell_no_net_'+loupe;
				}
			}
		}
	}
	else if(net==false){
		net=true;
		document.getElementById("net").innerHTML= '<div id="table"><div class="empty_cell_top_leftX" ></div><div class="empty_cell_topX"style="background:#0F0"></div><div class="empty_cell_topX"style="background:#0F0"></div><div class="empty_cell_topX"></div><div style="clear: both"></div><div class="empty_cell_leftX"style="background:#0F0"></div><div class="empty_cellX"></div><div class="empty_cellX"></div><div class="empty_cellX"style="background:#0F0"></div><div style="clear: both"></div><div class="empty_cell_leftX"style="background:#0F0"></div><div class="empty_cellX"></div><div class="empty_cellX"style="background:#0F0"></div><div class="empty_cellX"></div><div style="clear: both"></div><div class="empty_cell_leftX"></div><div class="empty_cellX"style="background:#0F0"></div><div class="empty_cellX"></div><div class="empty_cellX"></div><div style="clear: both"></div></div>';
		
		for (i=1; i < CELLS_VERTICALLY-1; i++) {
			for (j=1; j < CELLS_HORIZONTAL-1; j++) {
				var div_name = 'cell_'+i+'_'+j;
				if(document.getElementById( div_name)){
					document.getElementById(div_name).className = 'cell_'+loupe;
				}
			}
		}
	}
}
	
function getDimensions() {
  var w = window.innerWidth;
  var h = window.innerHeight;
  print_cells_v2(w);
}

window.addEventListener('resize', getDimensions);