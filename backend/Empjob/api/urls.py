from django.urls import path

from .import views
from .views import JobSearchView,get_csrf_token

urlpatterns = [
    path('postjob/',views.PostJob.as_view(),name="postjob"),
    path('editJob/',views.EditJob.as_view(),name="Editjob"),
    path('getjobs/',views.GetJob.as_view(),name="getjobs"),
    path('getAlljobs/',views.GetAllJob.as_view(),name="getAlljobs"),
    
    path('api/get-csrf-token/', get_csrf_token, name='get-csrf-token'),
    path('getjobs/detail/<int:job_id>/',views.GetJobDetail.as_view(),name="getjob_detail"),
    

    path('profile/',views.ProfileView.as_view(),name="profile"),
   

    path('applyjob/<int:job_id>/',views.Applyjob.as_view(),name="applyjob"),
    path('getApplyedjobs/',views.GetApplyedjob.as_view(),name="getapplyedjob"),
    path('getApplicationjobs/',views.GetApplicationjob.as_view(),name="getApplicationjob"),

   

    path('getjobs/questions/<int:job_id>/',views.GetQuestions.as_view(),name="getjob_detailS"),
    path('check-application/<int:job_id>/', views.check_application, name='check_application'),
    path('getjobs/status/<int:job_id>/',views.GetJobStatus.as_view(),name="getjob_detail"),
   
    path('savejob/<int:job_id>/',views.SavejobStatus.as_view(),name="savejob"),
    path('savedjobs/',views.SavedJobsView.as_view(),name="savedjobs"),
   # path('check-saved/<int:job_id>/', views.check_saved, name='check_saved'),
     path('applicationStatus/<int:job_id>/',views.ApplicationStatusView.as_view(),name='applicationStatus'),
   
    path('search/', JobSearchView.as_view(), name='job-search'),


    
]




