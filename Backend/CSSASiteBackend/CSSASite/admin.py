from django.contrib import admin
from .models import SiteUser, KnowledgeDomain, Task, TaskOption, TaskCompletion, ScenarioTable, Badge, UnlockEntry, TaskDropFieldOption, TaskDropOption, TaskDropEvaluation
# Register your models here.

admin.site.register(SiteUser)
admin.site.register(KnowledgeDomain)
admin.site.register(Task)
admin.site.register(TaskOption)
admin.site.register(TaskDropFieldOption)
admin.site.register(TaskDropOption)
admin.site.register(TaskDropEvaluation)
admin.site.register(TaskCompletion)
admin.site.register(ScenarioTable)
admin.site.register(Badge)
admin.site.register(UnlockEntry)