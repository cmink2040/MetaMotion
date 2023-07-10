from django.db import models
import subprocess
import os

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
    oType = models.CharField(max_length=10 , default='png')
    file = models.FileField(upload_to='uploads/', null=True, blank=True)
    status = models.CharField(max_length=20 , default='NOT_STARTED')
    progress = models.IntegerField(default=0)

    def render(self):
        self.status = 'IN_PROGRESS'
        redis_conn = Redis(host=redis_url, port=redis_port)
        if 'mqs' in Queue.all(connection=redis_conn):
            queue = Queue('mqs', connection=redis_conn)
        else:
            queue = Queue('mqs', connection=redis_conn)
        render_command = [blender_executable, '-b',
                          blend_file, '-o',
                          output_path, '-F',
                          'PNG', '-x', '1']
        queue.enqueue(render_blender_job, render_command)

        self.save()
    def delete(self):
        self.file.delete()
        self.delete()

def render_blender_job(command):
    # Construct the command to render the scene using Blender's CLI
    # Execute the command using subprocess
    subprocess.Popen(command, stdout=subprocess.PIPE,
                                   stderr=subprocess.PIPE, universal_newlines=True)
    # Perform any additional cleanup or processing
    return 'Blender rendering completed successfully.'

# Connect to Redis

