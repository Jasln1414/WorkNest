from django.contrib import admin
from .models import Jobs, SavedJobs, ApplyedJobs, Question, Answer

@admin.register(Jobs)
class JobsAdmin(admin.ModelAdmin):
    list_display = ('title', 'employer', 'location', 'lpa', 'jobtype', 'active', 'posteDate')
    list_filter = ('active', 'jobtype', 'jobmode', 'industry')
    search_fields = ('title', 'location', 'employer__user__username')
    date_hierarchy = 'posteDate'
    ordering = ('-posteDate',)

@admin.register(SavedJobs)
class SavedJobsAdmin(admin.ModelAdmin):
    list_display = ('candidate', 'job',)
    list_filter = ('candidate', 'job',)
    search_fields = ('candidate__user__username', 'job__title')

@admin.register(ApplyedJobs)
class ApplyedJobsAdmin(admin.ModelAdmin):
    list_display = ('candidate', 'job', 'status', 'applyed_on')
    list_filter = ('status', 'job', 'candidate')
    search_fields = ('candidate__user__username', 'job__title')
    date_hierarchy = 'applyed_on'
    ordering = ('-applyed_on',)

@admin.register(Question)
class QuestionAdmin(admin.ModelAdmin):
    list_display = ('job', 'text')
    list_filter = ('job',)
    search_fields = ('text', 'job__title')

@admin.register(Answer)
class AnswerAdmin(admin.ModelAdmin):
    list_display = ('candidate', 'question', 'answer_text')
    list_filter = ('candidate', 'question')
    search_fields = ('candidate__user__username', 'question__text', 'answer_text')