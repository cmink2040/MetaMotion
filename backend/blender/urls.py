from django.urls import path
from . import views

urlpatterns = [
    path('render/blender', views.RenderAPIView.as_view(), name='render-api'),
    path('render/interact',views.RenderInteractAPIView.as_view(), name='render-interact-api'),
]