from django.urls import path
from .views import DeepSeekChatView

urlpatterns = [
    path('api/chat/', DeepSeekChatView.as_view(), name='chat'),
] 
