from django.urls import path
from . import views

urlpatterns = [
    # 
    path('tasks/', views.GetTasksAPI.as_view()),
    path('task/', views.GetTaskAPI.as_view()),
    path('knowledge-domains/', views.GetKnowledgeDomainsAPI.as_view()),
    # User and auth API
    path('create-user/', views.CreateUserAPI.as_view()),
    path('update-user/<int:pk>/', views.UpdateUserAPI.as_view()),
]