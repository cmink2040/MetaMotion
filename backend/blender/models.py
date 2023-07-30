import shutil

from django.db import models
import subprocess
import os
import threading
import redis

from rq import Queue
from redis import Redis

redis_url = 'localhost'
redis_port = 6379

### Change this in productiont to backend directory
homedir = '/home/cmink/Software/server-infra-api/'


# Create your models here.

class RenderJob(models.Model):
    name = models.CharField(max_length=100)
    start_frame = models.IntegerField(default=0)
    end_frame = models.IntegerField(default=250)
    x_res = models.IntegerField(default=1920)
    y_res = models.IntegerField(default=1080)
    oType = models.CharField(max_length=10, default='PNG')
    file = models.FileField(upload_to='uploads/', null=True, blank=True)
    status = models.CharField(max_length=20, default='NOT_STARTED')
    progress = models.DecimalField(default=0.0, max_digits=5, decimal_places=2)

    def update(self, progress, status):
        if type(progress) is str:
            progress = float(progress)
        self.progress = progress
        self.status = status
        self.save()

    def render(self):
        directory = "uploads/" + self.name

        redis_host = 'localhost'
        redis_port = 6379
        redis_conn = redis.Redis(host=redis_host, port=redis_port)
        queue = Queue(connection=redis_conn)

        def run_blender_render():
            print(directory)
            self.status = 'IN_PROGRESS'
            try:
                os.mkdir(directory)
                print(f"Directory '{directory}' created successfully!")
            except FileExistsError:
                print(f"Directory '{directory}' already exists!")
            except OSError as e:
                print(f"Failed to create directory '{directory}': {e}")

            output_path = directory + '/render_'
            subprocess_args = ['blender', '-b', self.file.path, '-E', 'CYCLES', '-F',
                               self.oType, '-x', '1', '-o', output_path,
                               '-s', str(self.start_frame), '-e', str(self.end_frame), '-a']
            subprocess.run(subprocess_args)

        def run_watch():
            snd_sub_args = [
                'python', f'{homedir}/backend/blender/watch.py', '-nm', self.name, '-sc', directory, '-st',
                str(self.start_frame), '-en', str(self.end_frame)
            ]
            subprocess.run(snd_sub_args)

        thread = threading.Thread(target=run_blender_render, args=())
        thread2 = threading.Thread(target=run_watch, args=())
        thread.start()
        thread2.start()

        print("RENDERING BEGINNING")
        # Executes blender render command

        # Watches blender output and updates progress

    def delete_directory(self, directory_path):
        try:
            # Delete the directory and its contents
            shutil.rmtree(directory_path)
            print(f"Directory '{directory_path}' deleted successfully.")
        except Exception as e:
            print(f"Failed to delete directory '{directory_path}': {e}")

    def delete_file(self, file_path):
        try:
            # Delete the file
            os.remove(file_path)
            print(f"File '{file_path}' deleted successfully.")
        except Exception as e:
            print(f"Failed to delete file '{file_path}': {e}")

    def delete_self(self):
        # removes the directory and the upload name
        self.delete_directory("uploads/" + self.name)
        self.delete_file(self.file.__str__())
        self.delete()

# Connect to Redis
