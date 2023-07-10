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
        print(qsetP1, qsetP2, qsetP3, qsetP4)
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

        queryset = RenderJob.objects.all()
        qset1 = queryset.filter(name=title)
        if qset1.count() > 0:
            qset1.first().delete()
        else:
            RenderJob(name=title, start_frame=startframe, end_frame=endframe, x_res=xres, y_res=yres,
                                oType=otype, file=file).save()
            return Response("Job was succesfully created. ",status=200)

        file_path = default_storage.save('uploads/' + file.name, ContentFile(file.read()))

        return Response(status=200)

