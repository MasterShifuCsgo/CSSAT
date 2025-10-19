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

skill_margin = 30
task_completed_score_threshold = 70

# coeficients for skill 
correctness_coef = 10
time_coef = 10
max_time = 10

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
        task_type_selected = request.GET.get('task_type', '-1')
        logger.debug(knowledge_domain_id)
        if int(knowledge_domain_id) < 0:
            Response([], status=status.HTTP_404_NOT_FOUND)
        if int(task_type_selected) < 0:
            Response([], status=status.HTTP_404_NOT_FOUND)
        
        user_task_completion = TaskCompletion.objects.filter(user=user)
        done_task_ids = []
        for task_completion in user_task_completion:
            done_task_ids.append(task_completion.task.id)
        possible_tasks = Task.objects.filter(
            difficulty__lte=user.skill_rating, 
            difficulty__gte=user.skill_rating-skill_margin, 
            knowledge_domain=knowledge_domain_id,
            task_type=task_type_selected
            ).exclude(id__in=done_task_ids)
        
        max = len(possible_tasks)
        if max <= 1:
            task = possible_tasks[0]
        else:
            task_index = randint(0, max-1)
            task = possible_tasks[task_index]

        
        task_json = {}

        task_json["id"] = task.id
        task_json["containerType"] = task.task_types[task.task_type]
        
        task_data = {}
        match task.task_type:
            case 0:
                task_data["title"] = task.task_text
                valid_options = TaskOption.objects.filter(task=task)
                option_serializer = TaskOptionSerializer(valid_options, many=True)
                task_data["options"] = option_serializer.data
            case 1:
                task_data["description"] = task.task_text
                valid_drop_options = TaskDropOption.objects.filter(task=task)
                valid_drop_fields = TaskDropFieldOption.objects.filter(task=task)
                drop_option_serializer = TaskOptionSerializer(valid_drop_options, many=True)
                drop_field_serializer = TaskOptionSerializer(valid_drop_fields, many=True)
                task_data["items"] = drop_option_serializer.data
                task_data["containers"] = drop_field_serializer.data
            case 2:
                task_data["description"] = task.task_text
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
    
class DomainPerformanceAPI(RetrieveAPIView):
    permission_classes = (AllowAny, )
    queryset = KnowledgeDomain.objects.all()
   
    def get(self, request, format=None):
        user_id = 1
        user = SiteUser.objects.get(id=user_id)

        knowledge_domain_id = request.GET.get('knowledge_domain_id','-1')
        logger.debug(knowledge_domain_id)
        if int(knowledge_domain_id) < 0:
            return Response({"error":"wrong knowledge domain id"}, status=status.HTTP_404_NOT_FOUND)

        response_json = {}
        knowledge_domain = KnowledgeDomain.objects.get(id=knowledge_domain_id)
        response_json["domain_name"] = knowledge_domain.knowledge_domain_name

        domain_wide_correctness = 0
        domain_avg_correctness = 0
        tasks_done_in_knowledge_domain = TaskCompletion.objects.filter(user=user, task__knowledge_domain=knowledge_domain)
        for task_completion in tasks_done_in_knowledge_domain:
            domain_wide_correctness += task_completion.correctness_score

        if len(tasks_done_in_knowledge_domain) > 0:
            domain_avg_correctness = domain_wide_correctness/len(tasks_done_in_knowledge_domain)
        response_json["avg_correctness"] = domain_avg_correctness

        return Response(response_json, status=status.HTTP_200_OK)
    
class CreateTaskCompletionAPI(CreateAPIView):
    permission_classes = (AllowAny, )

    def post(self, request, format=None):
        response = {}
        data = request.data
        dict = data

        #userid = f'{request.user.id}'
        userid = 1
        user = SiteUser.objects.get(id=userid)
        dict['user'] = userid

        logger.debug(dict)
        task_id = dict["task"]

        task = Task.objects.get(id=task_id)

        task_answers = dict["answers"]

        overall_correctness_score = 0
        avg_correctness = 0
        match task.task_type:
            case 0:
                # multiple choice question
                for answer in task_answers:
                    answer_option_id = answer["answer_id"]
                    answer_option = TaskOption.objects.get(id=answer_option_id)
                    was_selected = answer["selected"]
                    if was_selected:
                        overall_correctness_score += answer_option
                avg_correctness = overall_correctness_score/len(task_answers)
            case 1:
                # drag and drop choice answer handling
                for answer in task_answers:
                    field_id = answer["field"]
                    drop_option_id = answer["drop_option"]
                    try:
                        evaluation = TaskDropEvaluation.objects.get(drop_field=field_id, drop_option=drop_option_id)
                    except TaskDropEvaluation.DoesNotExist:
                        evaluation = None

                    if evaluation is not None:
                        overall_correctness_score += evaluation.correctness
                        avg_correctness = overall_correctness_score/len(task_answers)
            case 2:
                answer_option_id = answer["answer_id"]
                answer_option = TaskOption.objects.get(id=answer_option_id)
                overall_correctness_score = answer_option.correctness

        time_taken = dict["response_time"]

        if avg_correctness >= task_completed_score_threshold:
            response["task_successful"]=True
        else:
            response["task_successful"]=False
        response["response_time"]=time_taken
        response["avg_correctness"]=avg_correctness

        new_task_completion = TaskCompletion(task=task, user=user, response_time=time_taken, correctness_score=avg_correctness)
        new_task_completion.save()

        skill_rating = avg_correctness/100 * correctness_coef + (max_time - time_taken)/max_time * time_coef
        user.skill_rating = user.skill_rating + skill_rating
        user.save()

        return Response(response, status=status.HTTP_200_OK)

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
