import os
import shutil
import zipfile

from django.http import HttpResponse
from django.shortcuts import render
from rest_framework.decorators import api_view

from rest_framework.views import APIView
from rest_framework.response import Response
from .serializers import TasksSerial
from .models import RenderJob
from .serializers import TokenPost
from django.views.decorators.csrf import csrf_exempt
from django.core.files.storage import default_storage
from django.core.files.base import ContentFile


class RenderAPIView(APIView):
    def get(self, request):
        print("GET REQUEST")
        queryset = RenderJob.objects.all()
        qset1 = queryset.filter(status='NOT_STARTED')
        qsetP1 = TokenPost(qset1, many=True)
        qsetP1 = qsetP1.data

        qset2 = queryset.filter(status='IN_PROGRESS')
        qsetP2 = TokenPost(qset2, many=True)
        qsetP2 = qsetP2.data

        qset3 = queryset.filter(status='COMPLETED')
        qsetP3 = TokenPost(qset3, many=True)
        qsetP3 = qsetP3.data

        qset4 = queryset.filter(status='FAILED')
        qsetP4 = TokenPost(qset4, many=True)
        qsetP4 = qsetP4.data
        result_data = []
        result_data.append(qsetP1)
        result_data.append(qsetP2)
        result_data.append(qsetP3)
        result_data.append(qsetP4)

        return Response(result_data, status=200)

    @csrf_exempt
    def post(self, request):
        # Handle POST request
        title = request.data.get('title')
        xres = request.data.get('xres')
        yres = request.data.get('yres')
        startframe = request.data.get('startframe')
        endframe = request.data.get('endframe')
        otype = request.data.get('otype')
        rendernow = request.data.get('rendernow')
        file = request.FILES['file']
        file_path = default_storage.save('uploads/' + file.name, ContentFile(file.read()))

        queryset = RenderJob.objects.all()
        qset1 = queryset.filter(name=title)
        if qset1.count() > 0:
            qset1.first().delete_self()

        RenderJob(name=title, start_frame=startframe, end_frame=endframe, x_res=xres, y_res=yres,
                      oType=otype, file=file).save()
        return Response("Job was succesfully created. ", status=200)

class IPAPIView(APIView):
    def get(self, request):
        client_ip = request.META.get('REMOTE_ADDR')
        return Response(client_ip, status=200)

class RenderInteractAPIView(APIView):

    def get(self, request):
        return Response("GOOD", status=200)

    def patch(self, request):
        print("PATH RECIEVED: ")
        print(request.data)
        print('retarded mf')
        print(request.data['title'], request.data.get('progress'), request.data.get('status'), 'holly fuck')
        name = request.data.get('title')
        queryset = RenderJob.objects.all()
        qset1 = queryset.filter(name=name).first()
        print(qset1, ' bunch of mfs just to improve readablility', name)
        if qset1:
            print('not null')
            qset1.update(
                request.data.get('progress'), request.data.get('status'))
            return Response("Render Updated", status=200)
        else:
            return Response("FAILED NOT FOUND", status=404)

    def post(self, request):
        name = request.data.get('title')
        queryset = RenderJob.objects.all()
        qset1 = queryset.filter(name=name)
        if (qset1.count() > 0):
            qset1.first().render()
            return Response("Render Started", status=200)
        else:
            return Response("FAILED NOT FOUND", status=404)

    def delete(self, request):
        name = request.data.get('title')
        queryset = RenderJob.objects.all()
        qset1 = queryset.filter(name=name)
        if (qset1.count() > 0):
            qset1.first().delete_self()
            return Response("Render Deleted", status=200)
        else:
            return Response("FAILED NOT FOUND", status=404)

class DownloadAPI(APIView):
    def get(self, request, filename):
            # Replace 'uploads' with the name of your directory containing the files
            directory_path = os.path.join('uploads', filename)

            # Create a temporary directory to store the zip file
            temp_dir = 'temp_zip'
            os.makedirs(temp_dir, exist_ok=True)

            # Copy all files from the directory to the temporary directory
            for root, dirs, files in os.walk(directory_path):
                for file in files:
                    source_path = os.path.join(root, file)
                    destination_path = os.path.join(temp_dir, file)
                    shutil.copy2(source_path, destination_path)

            # Create a zip archive of the temporary directory
            zip_filename = f"{filename}.zip"
            with zipfile.ZipFile(zip_filename, 'w') as zip_file:
                for root, dirs, files in os.walk(temp_dir):
                    for file in files:
                        file_path = os.path.join(root, file)
                        zip_file.write(file_path, os.path.relpath(file_path, temp_dir))

            # Read the zip file data
            with open(zip_filename, 'rb') as f:
                file_data = f.read()

            # Delete the temporary directory and zip file
            shutil.rmtree(temp_dir)
            os.remove(zip_filename)

            # Set the appropriate response headers for download
            response = HttpResponse(file_data, content_type='application/zip')
            response['Content-Disposition'] = f'attachment; filename="{filename}.zip"'
            return response