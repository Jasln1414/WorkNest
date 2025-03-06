from django.urls import path
from .views import (
    EmployerRegisterView, OtpVarificationView, ResendOtpView,CurrentUser,EmpLoginView,EmployerProfileCreatView,
    CandidateRegisterView,AuthCandidateView,UserDetails,CandidateProfileCreation,CandidateLoginView,UserDetails,
)

from rest_framework_simplejwt.views import (
    TokenObtainPairView,
    TokenRefreshView,
)

urlpatterns = [

    path('token/', TokenObtainPairView.as_view(), name='token_obtain_pair'),
    path('token/refresh/', TokenRefreshView.as_view(), name='token_refresh'),
    

    path('cand_register/',CandidateRegisterView.as_view(),name="cand_register"),
    path('candidatelogin/',CandidateLoginView.as_view(),name="login"),
    path('auth/candidate/',AuthCandidateView.as_view(),name="authcandidate"),

    path("user/details/", UserDetails.as_view(), name="user-details"),
    path("user/profile_creation/",CandidateProfileCreation.as_view(),name='CandidateProfileCreation'),

    path('Emplogin/',EmpLoginView.as_view(),name="login"),
    path('employer/register/', EmployerRegisterView.as_view(), name="emp_register"),
    path("user/emp_profile_creation/",EmployerProfileCreatView.as_view(),name="employerProfileCreation"),
    
    
    
    path('verify-otp/', OtpVarificationView.as_view(), name="otp_verify"),
    path('resend-otp/', ResendOtpView.as_view(), name="resend_otp"),
    
    path('current-user/', CurrentUser.as_view(), name='current-user'),

    path("user/details/", UserDetails.as_view(), name="user-details"),
]


