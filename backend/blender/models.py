from django.db import models
import subprocess
import os
import threading

from rq import Queue
from redis import Redis

redis_url = 'localhost'
redis_port = 6379
blender_executable = '/path/to/blender/executable'  # Path to Blender executable
blend_file = '/path/to/blend/file.blend'  # Path to Blender scene file
output_path = '/path/to/output'

# Create your models here.

class RenderJob(models.Model):
    name = models.CharField(max_length=100)
    start_frame = models.IntegerField(default=0)
    end_frame = models.IntegerField(default=250)
    x_res = models.IntegerField(default=1920)
    y_res = models.IntegerField(default=1080)
    oType = models.CharField(max_length=10 , default='PNG')
    file = models.FileField(upload_to='uploads/', null=True, blank=True)
    status = models.CharField(max_length=20 , default='NOT_STARTED')
    progress = models.IntegerField(default=0)

    def render(self):
        directory = "uploads/"+self.name
        print(directory)
        try:
            os.mkdir(directory)
            print(f"Directory '{directory}' created successfully!")
        except FileExistsError:
            print(f"Directory '{directory}' already exists!")
        except OSError as e:
            print(f"Failed to create directory '{directory}': {e}")

        output_path = directory + '/render_'
        print(output_path)
        redis_host = 'localhost'
        redis_port = 6379
        redis_conn = redis.Redis(host=redis_host, port=redis_port)
        queue = Queue(connection=redis_conn)

        def run_blender_render():
            subprocess_args = ['blender', '-b', self.file.path, '-E', 'CYCLES', '-F',
                               self.oType, '-x', '1', '-o', output_path,
                               '-s', str(self.start_frame), '-e', str(self.end_frame), '-a']
            subprocess.run(subprocess_args)
        def run_watch():
            snd_sub_args = [
                'python', 'blender/watch.py', '-nm', self.name, '-sc', directory, '-st',
                str(self.start_frame), '-en', str(self.end_frame)
            ]
            subprocess.run(snd_sub_args)
        
        
        queue.enqueue(run_blender_render)
        queue.enqueue(run_watch)
    
        print("RENDERING BEGINNING")
        # Executes blender render command


        # Watches blender output and updates progress


    def delete_self(self):
        self.file.delete()
        self.delete()

# Connect to Redis

