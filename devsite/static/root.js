var app;
window.onload = function () {
	app = new Vue({
		el: '#app',
		data: {
			metrics: [],
			readme_length: new Blob([$("#readme").val()]).size
		},

		delimiters: ['${', '}'],

		methods: {
			load_metrics: function () {
				$.getJSON('/api/metrics', function(data) {
					this.metrics = data;
				}.bind(this));
			},

			update_readme_length: function (evt) {
				this.readme_length = (new Blob([evt.target.value])).size;
			}
		},

		mounted: function () {
			this.load_metrics();

			setInterval(function () {
				this.load_metrics();
			}.bind(this), 1000); 
			
		}
	});
}


// Lemonade Tycoon
var lemonade = 0;
var lemonade_sold = 0;
var cash = 0;
var workers = 0;
var worker_cost = Math.floor(10 * Math.pow(1.1, workers));

function lt_update_labels(){
	$("#lt_lemonade").html(lemonade);
	$("#lt_workers").html(workers);
	$("#lt_cash").html("$"+cash);
	$("#lt_worker_cost").html("$"+worker_cost);
	$("#lt_sold_lemonade").html(lemonade_sold);
}

function lt_make_lemonade(number){
	lemonade += number;
	lt_update_labels();
}

function lt_sell_lemonade(sold){
	if(lemonade > 0) {
		lemonade -= sold;
		lemonade_sold += sold;
		
		if(workers > 1) {
			cash += 1.0 * sold;
		}
		else {
			cash += 1.0;
		}
	}
	lt_update_labels();
}

function lt_hire_worker() {
	if(cash >= worker_cost) {
		workers += 1;
		cash -= worker_cost;
	}
	var nextCost = Math.floor(10 * Math.pow(1.1, workers));
	worker_cost = nextCost;
	lt_update_labels()
}


function lt_save(){
	var saveData = {
		lemonade: lemonade,
		lemonade_sold: lemonade_sold,
		cash: cash,
		workers: workers,
		worker_cost: worker_cost
	};
	
	localStorage.setItem("save", JSON.stringify(saveData));
}

function lt_load(){
	var saveGame = JSON.parse(localStorage.getItem("save"));
	if(saveGame) {
		if(typeof saveGame.lemonade !== "undefined") lemonade = saveGame.lemonade;
		if(typeof saveGame.lemonade_sold !== "undefined") lemonade_sold = saveGame.lemonade_sold;
		if(typeof saveGame.cash !== "undefined") cash = saveGame.cash;
		if(typeof saveGame.workers !== "undefined") workers = saveGame.workers;
		if(typeof saveGame.worker_cost !== "undefined") worker_cost = saveGame.worker_cost;
		lt_update_labels();
	}
};

function lt_reset(){
	lemonade = 0;
	workers = 0;
	cash = 0;
	lemonade_sold = 0;
	lt_save()
	lt_update_labels();
}




// MOD PLAYER
var mp_audio = new Audio("/static/kapchiptune.ogg");

function mp_play() {
	if (mp_audio.paused) {
		mp_audio.play();
	}
}

function mp_pause() {
	mp_audio.pause();
}

function mp_stop() {
	mp_audio.pause();
	mp_audio.currentTime = 0;
}

$(document).ready(function() {
	lt_load();

	window.setInterval(function(){
		lt_make_lemonade(workers);
			
		if(workers > 2) {
			lt_sell_lemonade(Math.floor(workers / 2));
		}
		
		lt_update_labels();
	}, 1000);

	window.setInterval(() => {
		$("#mp_progress").css("width", mp_audio.currentTime / mp_audio.duration * 100 + "%");
		$("#mp_position").html("0x"+Math.floor(mp_audio.currentTime*100).toString(16))
	}, 50);

	lt_update_labels();
});