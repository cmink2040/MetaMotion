import os
import re
import time
import argparse
import requests
from watchdog.observers import Observer
from watchdog.events import FileSystemEventHandler

url = 'http://localhost:8000/graphics/render/interact'
parser = argparse.ArgumentParser()
parser.add_argument('-nm', help='Name of the render task')
parser.add_argument('-sc', help='Source directory to watch')
parser.add_argument('-st', help='Start frame')
parser.add_argument('-en', help='End frame')

args = parser.parse_args()
name = args.nm
src = args.sc
start = args.st
end = args.en
keepgoing = True
print(src)
data = {
    'title': name,
    'progress': 0.0,
    'status': "IN_PROGRESS"
}
response = requests.patch(url, json=data)
print(response)

print("RENDERING TASKS STARTED")
class NewFileHandler(FileSystemEventHandler):
    def on_created(self, event):
        if not event.is_directory:
            print(f"New file created: {event.src_path}")
            currentFrame = re.findall(r'\d+', event.src_path)
            currentFrame = int(''.join(currentFrame))
            a = float(end)
            b = float(start)
            c = a-b
            progress = currentFrame/c
            framesMade = "IN_PROGRESS"
            if (currentFrame == end):
                global keepgoing
                keepgoing = False
                framesMade = "COMPLETE"

            data = {
                'title': name,
                'progress': progress,
                'status': framesMade
            }
            response = requests.patch(url, json=data)

    # Create an observer and attach the event handler
observer = Observer()
observer.schedule(NewFileHandler(), src, recursive=False)
# Start the observer
observer.start()
try:
        # Keep the script running until interrupted
        while keepgoing:
            time.sleep(1)
except KeyboardInterrupt:
        # Stop the observer if interrupted
        observer.stop()
observer.join()
print("RENDERING TASKS DONE")
# Define a custom event handler

