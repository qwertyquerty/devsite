from devsite import app
from devsite.config import *

if __name__ == "__main__":
	app.run(port=PORT, debug=True)