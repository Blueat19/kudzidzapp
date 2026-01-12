# Simple version of passenger_wsgi.py for cPanel
# Use this if the main version doesn't work

import sys
import os

sys.path.insert(0, os.path.dirname(__file__))

from server import app as application
