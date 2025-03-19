from django.urls import path
from .views import *

urlpatterns = [
    
    path('home/',HomeView.as_view(),name='home'),
    path('candidate/<int:id>', CandidateView.as_view(), name='candidate-detail'),
    path('employer/<int:id>',EmployerView.as_view(),name='employer'),
    path('clist/',CandidateListView.as_view(),name='candidatelist'),
    path('elist/',EmployerListView.as_view(),name='employerlist'),
    path('api/employer/approval/', EmployerApprovalView.as_view(), name='employer-approval'),
    path('status/',StatusView.as_view(),name='status'),
    
    
    path('admin/jobs/', AdminGetAllJobs.as_view(), name='admin-get-all-jobs'),
    path('admin/jobs/<int:job_id>/', AdminGetJobDetail.as_view(), name='admin-get-job-detail'),
    path('admin/jobs/<int:job_id>/moderate/', AdminJobModeration.as_view(), name='admin-job-mode')
    

]