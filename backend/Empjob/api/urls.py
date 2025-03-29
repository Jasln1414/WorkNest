from django.urls import path
from . import views

urlpatterns = [
    # Job related endpoints
    path('postjob/', views.PostJob.as_view(), name="postjob"),
    path('editJob/', views.EditJob.as_view(), name="Editjob"),
    path('getjobs/', views.GetJob.as_view(), name="getjobs"),
    path('getAlljobs/', views.GetAllJob.as_view(), name="getAlljobs"),
    path('getjobs/detail/<int:job_id>/', views.GetJobDetail.as_view(), name="getjob_detail"),
    
    # Profile endpoints
    path('profile/', views.ProfileView.as_view(), name="profile"),
    
    # Application endpoints
    path('applyjob/<int:job_id>/', views.Applyjob.as_view(), name="applyjob"),
    path('getApplyedjobs/', views.GetApplyedjob.as_view(), name="getapplyedjob"),
    path('getApplicationjobs/', views.GetApplicationjob.as_view(), name="getApplicationjob"),
    
    # Question endpoints
    path('getjobs/questions/<int:job_id>/', views.GetQuestions.as_view(), name="getjob_questions"),
    
    # Status endpoints
    path('getjobs/status/<int:job_id>/', views.GetJobStatus.as_view(), name="job-status"),
    path('applicationStatus/<int:job_id>/', views.ApplicationStatusView.as_view(), name='applicationStatus'),
    
    # Saved jobs endpoints
    path('savedjobs/', views.SavedJobsView.as_view(), name="saved-jobs"),
    path('savejob/<int:job_id>/', views.SavejobStatus.as_view(), name="save-job"),  
    
    # Search endpoint
    path('search/', views.JobSearchView.as_view(), name='job-search'),
    
    # Utility endpoints
    path('api/get-csrf-token/', views.get_csrf_token, name='get-csrf-token'),
    path('check-application/<int:job_id>/', views.check_application, name='check_application'),
]