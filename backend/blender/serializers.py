from rest_framework import serializers
from .models import RenderJob
from django.shortcuts import render



class TasksSerial(serializers.Serializer):
    name = serializers.CharField(max_length=100)
    start_frame = serializers.IntegerField()
    end_frame = serializers.IntegerField()
    x_res = serializers.IntegerField()
    y_res = serializers.IntegerField()
    oType = serializers.CharField(max_length=10)
    file = serializers.FileField()
    status = serializers.CharField(max_length=20)
    progress = serializers.IntegerField()


class TokenPost(serializers.ModelSerializer):
    class Meta:
        model = RenderJob
        fields = '__all__'  # Or specify the fields you want to include/exclude

    def __init__(self, *args, **kwargs):
        # Set many=True in the context to handle a QuerySet
        kwargs['context'] = {'many': True}
        super().__init__(*args, **kwargs)
