import sys
import os

# Add the application directory to the Python path
sys.path.insert(0, os.path.dirname(__file__))

# Import the FastAPI application
from server import app

# For ASGI support with Passenger (cPanel)
# This creates the WSGI-compatible application object
try:
    from asgiref.wsgi import WsgiToAsgi
    application = WsgiToAsgi(app)
except ImportError:
    # Fallback - direct app reference
    application = app
