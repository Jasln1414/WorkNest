from django.urls import path
from .views import *

urlpatterns = [
    
    path('home/',HomeView.as_view(),name='home'),
    path('candidate/<int:id>', CandidateView.as_view(), name='candidate-detail'),
    path('employer/<int:id>',EmployerView.as_view(),name='employer'),
    path('clist/',CandidateListView.as_view(),name='candidatelist'),
    path('elist/',EmployerListView.as_view(),name='employerlist'),
   
    path('status/',StatusView.as_view(),name='status'),
    

]