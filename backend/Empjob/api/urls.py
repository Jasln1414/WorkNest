from django.urls import path
from .views import *

urlpatterns = [
    # Job related endpoints
    path('postjob/', PostJob.as_view(), name="postjob"),
    path('editJob/', EditJob.as_view(), name="Editjob"),
    path('getjobs/', GetJob.as_view(), name="getjobs"),
    path('getAlljobs/', GetAllJob.as_view(), name="getAlljobs"),
    path('getjobs/detail/<int:job_id>/', GetJobDetail.as_view(), name="getjob_detail"),
    
    # Profile endpoints
    path('profile/', ProfileView.as_view(), name="profile"),
    
    # Application endpoints
    path('applyjob/<int:job_id>/', Applyjob.as_view(), name="applyjob"),
    path('getApplyedjobs/', GetApplyedjob.as_view(), name="getapplyedjob"),
    path('getApplicationjobs/', GetApplicationjob.as_view(), name="getApplicationjob"),
    
    # Question endpoints
    path('getjobs/questions/<int:job_id>/', GetQuestions.as_view(), name="getjob_detailS"),
    
    # Status endpoints
    path('getjobs/status/<int:job_id>/', GetJobStatus.as_view(), name="getjob_detail"),
    path('applicationStatus/<int:job_id>/', ApplicationStatusView.as_view(), name='applicationStatus'),
    
    # Saved jobs endpoints
    #path('savejob/<int:job_id>/', SavejobStatus.as_view(), name="savejob"),
    path('savedjobs/', SavedJobsView.as_view(), name="savedjobs"),
    
    # Search endpoint
    path('search/', JobSearchView.as_view(), name='job-search'),
    
    # Utility endpoints
    path('api/get-csrf-token/', get_csrf_token, name='get-csrf-token'),
    path('check-application/<int:job_id>/', check_application, name='check_application'),
]