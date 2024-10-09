from django.urls import path
from . import views

urlpatterns = [
    path('render/blender', views.RenderAPIView.as_view(), name='render-api'),
    path('render/interact',views.RenderInteractAPIView.as_view(), name='render-interact-api'),
    path('ip', views.IPAPIView.as_view(), name='ip-api'),
    path('download/<str:filename>', views.DownloadAPI.as_view(), name='download')
]