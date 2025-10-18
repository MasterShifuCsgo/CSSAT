from django.shortcuts import render
from rest_framework.generics import CreateAPIView, UpdateAPIView, RetrieveAPIView, RetrieveUpdateDestroyAPIView
from rest_framework.permissions import AllowAny, IsAuthenticated
from rest_framework.response import Response
from rest_framework import status
from django.contrib.auth import login
from rest_framework.decorators import api_view
import json

from .models import SiteUser, KnowledgeDomain, UserManager, Task, TaskOption, TaskCompletion, ScenarioTable, Badge, UnlockEntry
from .serializers import BadgeSerializer, TaskSerializer, TaskOptionSerializer, TaskCompletionSerializer, KnowledgeDomainSerializer, UnlockEntrySerializer, CreateUserSerializer, UpdateUserSerializer

import logging

logging.basicConfig(level=logging.DEBUG)
logger = logging.getLogger(__name__)

class GetTasksAPI(RetrieveAPIView):
    permission_classes = (AllowAny, )
    queryset = Task.objects.none()

    def get(self, request, format=None):     
        
        tasks = Task.objects.all()

        data = []

        for task in tasks:
            task_json = {}

            task_json["id"] = task.id
            task_json["containerType"] = task.task_types[task.task_type]
            
            task_data = {}
            task_data["description"] = task.task_text
            match task.task_type:
                case 0:
                    pass
                case 1:
                    pass
                case 2:
                    pass         
                      
            
            
            

            valid_options = TaskOption.objects.filter(task=task)
            option_serializer = TaskOptionSerializer(valid_options, many=True)
            task_data["blocks"] = option_serializer.data
            task_json["data"] = task_data
            data.append(task_json)

        return Response(data, status=status.HTTP_200_OK)
    
#--------------- User API -----------------------
class CreateUserAPI(CreateAPIView):
    permission_classes = (AllowAny,)
    queryset = SiteUser.objects.all()
    serializer_class = CreateUserSerializer

class UpdateUserAPI(UpdateAPIView):
    permission_classes = (IsAuthenticated, )
    queryset = SiteUser.objects.all()
    serializer_class = UpdateUserSerializer
