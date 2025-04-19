from waitress import serve
from hardcoredancing import app

serve(app, server_name='hardcoredancing.nl:8080', host='0.0.0.0', port=8080)
