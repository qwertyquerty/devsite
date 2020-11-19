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
				this.readme_length = (new Blob([evt.target.value.getBytes()])).size;
				console.log("a");
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