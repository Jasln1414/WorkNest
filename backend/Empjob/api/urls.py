from django.urls import path
from .import views

urlpatterns = [
    path('postjob/',views.PostJob.as_view(),name="postjob"),
    path('getjobs/',views.GetJob.as_view(),name="getjobs"),
    path('getAlljobs/',views.GetAllJob.as_view(),name="getAlljobs"),


    path('profile/',views.ProfileView.as_view(),name="profile"),


]