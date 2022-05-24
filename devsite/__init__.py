from flask import Flask, render_template, send_from_directory, jsonify
import psutil

app = Flask(__name__)

@app.route("/")
def page_root():
	return render_template("root.html", debug=True)

@app.route("/contact")
def page_contact():
	return render_template("contact.html", debug=True)

@app.route("/static/<path:path>")
def send_static_content(path):
    return send_from_directory("static", path)

@app.route("/api/metrics")
def page_api_metrics():
	response = {
		"cpu": psutil.cpu_percent(percpu=True),
		"ram": psutil.virtual_memory().percent,
		"disk": psutil.disk_usage("/").percent
	}

	return jsonify(response)

@app.route("/player/<path:song>")
def page_song_player(song):
	return render_template("player.html", song=song)