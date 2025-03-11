from django.urls import path

from .import views

urlpatterns = [
    path('postjob/',views.PostJob.as_view(),name="postjob"),
    path('editJob/',views.EditJob.as_view(),name="Editjob"),
    path('getjobs/',views.GetJob.as_view(),name="getjobs"),
    path('getAlljobs/',views.GetAllJob.as_view(),name="getAlljobs"),
   
    path('getjobs/detail/<int:job_id>/',views.GetJobDetail.as_view(),name="getjob_detail"),
     path('getjobs/status/<int:job_id>/',views.GetJobStatus.as_view(),name="getjob_detail"),

    path('profile/',views.ProfileView.as_view(),name="profile"),


    
]




