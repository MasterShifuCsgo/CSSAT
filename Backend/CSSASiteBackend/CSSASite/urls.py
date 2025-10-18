from django.urls import path
from . import views
from knox.views import LogoutView, LogoutAllView

urlpatterns = [
    # 
    path('tasks/', views.GetTasksAPI.as_view()),
    path('task/', views.GetTaskAPI.as_view()),
    path('knowledge-domains/', views.GetKnowledgeDomainsAPI.as_view()),
    # User and auth API
    path('create-user/', views.CreateUserAPI.as_view()),
    path('update-user/<int:pk>/', views.UpdateUserAPI.as_view()),
    path('login/', views.LoginAPIView.as_view()),
    path('logout/', LogoutView.as_view()),
    path('logout-all/', LogoutAllView.as_view()),
]