from django.db import models
from django.contrib.auth.models import AbstractBaseUser, BaseUserManager
# Create your models here.

class UserManager(BaseUserManager):
    def create_user(self, email, password, **extra_fields):
        if not email:
            raise ValueError("The email is not given.")
        email = self.normalize_email(email)
        user = self.model(email=email, **extra_fields)
        user.is_active = True
        user.set_password(password)
        user.save()
        return user

    def create_superuser(self, email, password, **extra_fields):
        extra_fields.setdefault('is_staff', True)
        extra_fields.setdefault('is_superuser', True)
        extra_fields.setdefault('is_active', True)

        if not extra_fields.get('is_staff'):
            raise ValueError("Superuser must have is_staff = True")

        if not extra_fields.get('is_superuser'):
            raise ValueError("Superuser must have is_superuser = True")
        return self.create_user(email, password, **extra_fields)


class SiteUser(AbstractBaseUser):
    email = models.EmailField(max_length=254, unique=True)
    password = models.CharField(max_length=128, null=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    is_staff = models.BooleanField(default=False)
    is_superuser = models.BooleanField(default=False)
    is_active = models.BooleanField(default=True)
    skill_rating = models.IntegerField(null=False, default=0, blank=False)

    USERNAME_FIELD = 'email'
    
    objects = UserManager()

    def __str__(self):
        return f'{self.id} {self.email}'

    def has_module_perms(self, app_label):
        return True

    def has_perm(self, perm, obj=None):
        return True
    

class KnowledgeDomain(models.Model):
    knowledge_domain_name = models.CharField(null=False, blank=False)
    prereq_skill_rating = models.IntegerField()
    
    def __str__(self):
        return f'{self.id} {self.knowledge_domain_name} {self.prereq_skill_rating}'

class Task(models.Model):
    task_types = {
        0: 'multipleChoice',
        1: 'dragAndDrop',
        2: 'scenario',
    }
    
    knowledge_domain = models.ForeignKey(
        KnowledgeDomain,
        on_delete=models.CASCADE,
        null=False,
        blank=False
    )

    task_text = models.TextField(null=False, blank=False)
    task_type = models.IntegerField(null=False, blank=False, choices=task_types)
    difficulty = models.IntegerField(null=False, default=0, blank=False)

    def __str__(self):
        return f'Task:{self.id} {self.knowledge_domain} {self.task_types[self.task_type]} {self.difficulty}'

class TaskDropFieldOption(models.Model):
    option = models.CharField(null=False, blank=False)
    task = models.ForeignKey(
        Task,
        on_delete=models.CASCADE,
        null=False,
        blank=False
    )

    def __str__(self):
        return f'{self.id} {self.option} {self.task}'

class TaskDropOption(models.Model):
    option = models.CharField(null=False, blank=False)
    task = models.ForeignKey(
        Task,
        on_delete=models.CASCADE,
        null=False,
        blank=False
    )

    def __str__(self):
        return f'{self.id} {self.option} {self.task}'

class TaskDropEvaluation(models.Model):
    drop_field = models.ForeignKey(
        TaskDropFieldOption,
        on_delete=models.CASCADE,
        null=False,
        blank=False
    )
    drop_option = models.ForeignKey(
        TaskDropOption,
        on_delete=models.CASCADE,
        null=False,
        blank=False
    )
    correctness = models.IntegerField(null=False, blank=False, default=0)

    def __str__(self):
        return f'{self.drop_field} {self.drop_option} {self.correctness}'

class TaskOption(models.Model):
    option = models.CharField(null=False, blank=False)
    correctness = models.IntegerField(null=False, blank=False, default=0)
    task = models.ForeignKey(
        Task,
        on_delete=models.CASCADE,
        null=False,
        blank=False
    )

    def __str__(self):
        return f'{self.id} {self.option} {self.correctness} {self.task}'

class TaskCompletion(models.Model):
    task = models.ForeignKey(
        Task,
        on_delete=models.CASCADE,
        null=False,
        blank=False
    )

    user = models.ForeignKey(
        SiteUser,
        on_delete=models.CASCADE,
        null=False,
        blank=False
    )

    response_time = models.TimeField(null=False, blank=False)

    overall_task_score = models.IntegerField(null=False, blank=False)

    correctness_score = models.FloatField(null=False, blank=False)

    def __str__(self):
        return f'{self.user} {self.task} {self.response_time} {self.overall_task_score} {self.correctness_score}'

class ScenarioTable(models.Model):
    task = models.ForeignKey(
        Task,
        on_delete=models.CASCADE,
        null=False,
        blank=False,
        related_name='task_done'
    )

    answer = models.ForeignKey(
        TaskOption,
        on_delete=models.CASCADE,
        null=False,
        blank=False
    )

    next_task = models.ForeignKey(
        Task,
        on_delete=models.CASCADE,
        null=False,
        blank=False,
        related_name='task_next'
    )

class Badge(models.Model):
    badge_text = models.CharField(null=False, blank=False)

class UnlockEntry(models.Model):
    user = models.ForeignKey(
        SiteUser,
        on_delete=models.CASCADE,
        null=False,
        blank=False
    )

    date_of_unlock = models.DateField(null=False, blank=False)

    # multi unlock foreign keys
    badge = models.ForeignKey(
        Badge,
        on_delete=models.CASCADE,
        null=True,
        blank=True
    )

    knowledge_domain = models.ForeignKey(
        KnowledgeDomain,
        on_delete=models.CASCADE,
        null=True,
        blank=True
    )

