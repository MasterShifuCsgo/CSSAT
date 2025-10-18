from django.shortcuts import render
from rest_framework.generics import CreateAPIView, UpdateAPIView, RetrieveAPIView 
from rest_framework.permissions import AllowAny, IsAuthenticated
from rest_framework.response import Response
from rest_framework import status
from django.contrib.auth import login
from rest_framework.decorators import api_view
from knox import views as knox_views

import json
from random import randint

from .models import SiteUser, KnowledgeDomain, UserManager, Task, TaskOption, TaskCompletion, ScenarioTable, Badge, UnlockEntry, TaskDropFieldOption, TaskDropOption, TaskDropEvaluation
from .serializers import BadgeSerializer, TaskSerializer, TaskOptionSerializer, TaskCompletionSerializer, KnowledgeDomainSerializer, UnlockEntrySerializer, CreateUserSerializer, UpdateUserSerializer, LoginSerializer

import logging

logging.basicConfig(level=logging.DEBUG)
logger = logging.getLogger(__name__)

skill_margin = 3

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
                    valid_options = TaskOption.objects.filter(task=task)
                    option_serializer = TaskOptionSerializer(valid_options, many=True)
                    task_data["options"] = option_serializer.data
                case 1:
                    valid_drop_options = TaskDropOption.objects.filter(task=task)
                    valid_drop_fields = TaskDropFieldOption.objects.filter(task=task)
                    drop_option_serializer = TaskOptionSerializer(valid_drop_options, many=True)
                    drop_field_serializer = TaskOptionSerializer(valid_drop_fields, many=True)
                    task_data["items"] = drop_option_serializer.data
                    task_data["containers"] = drop_field_serializer.data
                case 2:
                    valid_options = TaskOption.objects.filter(task=task)
                    option_serializer = TaskOptionSerializer(valid_options, many=True)
                    task_data["blocks"] = option_serializer.data   
            
            task_json["data"] = task_data
            data.append(task_json)

        return Response(data, status=status.HTTP_200_OK)

class GetTaskAPI(RetrieveAPIView):
    permission_classes = (AllowAny, )
    queryset = Task.objects.none()

    def get(self, request, format=None):     
        user = SiteUser.objects.get(id=1)

        knowledge_domain_id = request.GET.get('knowledge_domain_id','-1')
        task_type_selected = request.GET.get('task-type', '-1')
        logger.debug(knowledge_domain_id)
        if int(knowledge_domain_id) < 0:
            Response([], status=status.HTTP_404_NOT_FOUND)
        if int(task_type_selected) < 0:
            Response([], status=status.HTTP_404_NOT_FOUND)
        
        user_task_completion = TaskCompletion.objects.filter(user=user)
        possible_tasks = Task.objects.filter(
            difficulty__lte=user.skill_rating, 
            difficulty__gte=user.skill_rating-skill_margin, 
            knowledge_domain=knowledge_domain_id,
            task_type=task_type_selected
            ).exclude(id__in=user_task_completion)
        
        max = len(possible_tasks)
        task_index = randint(0, max-1)

        task = possible_tasks[task_index]

        task_json = {}

        task_json["id"] = task.id
        task_json["containerType"] = task.task_types[task.task_type]
        
        task_data = {}
        task_data["description"] = task.task_text
        match task.task_type:
            case 0:
                valid_options = TaskOption.objects.filter(task=task)
                option_serializer = TaskOptionSerializer(valid_options, many=True)
                task_data["options"] = option_serializer.data
            case 1:
                valid_drop_options = TaskDropOption.objects.filter(task=task)
                valid_drop_fields = TaskDropFieldOption.objects.filter(task=task)
                drop_option_serializer = TaskOptionSerializer(valid_drop_options, many=True)
                drop_field_serializer = TaskOptionSerializer(valid_drop_fields, many=True)
                task_data["items"] = drop_option_serializer.data
                task_data["containers"] = drop_field_serializer.data
            case 2:
                valid_options = TaskOption.objects.filter(task=task)
                option_serializer = TaskOptionSerializer(valid_options, many=True)
                task_data["blocks"] = option_serializer.data   
        
        task_json["data"] = task_data

        return Response(task_json, status=status.HTTP_200_OK)
    
class GetKnowledgeDomainsAPI(RetrieveAPIView):
    permission_classes = (AllowAny, )
    queryset = KnowledgeDomain.objects.none()

    def get(self, request, format=None):     
        
        knowledge_domains = KnowledgeDomain.objects.all()
        knowledge_domain_serializer = KnowledgeDomainSerializer(knowledge_domains, many=True)
        return Response(knowledge_domain_serializer.data, status=status.HTTP_200_OK)

#--------------- User API -----------------------
class CreateUserAPI(CreateAPIView):
    permission_classes = (AllowAny,)
    queryset = SiteUser.objects.all()
    serializer_class = CreateUserSerializer

class UpdateUserAPI(UpdateAPIView):
    permission_classes = (IsAuthenticated, )
    queryset = SiteUser.objects.all()
    serializer_class = UpdateUserSerializer

class LoginAPIView(knox_views.LoginView):
    permission_classes = (AllowAny, )
    serializer_class = LoginSerializer

    def post(self, request, format=None):
        serializer = self.serializer_class(data=request.data)
        if serializer.is_valid(raise_exception=True):
            user = serializer.validated_data['user']
            login(request, user)
            response = super().post(request, format=None)
        else:
            return Response({'errors': serializer.errors}, status=status.HTTP_400_BAD_REQUEST)

        return Response(response.data, status=status.HTTP_200_OK)
