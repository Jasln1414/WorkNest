# account/api/urls.py
from django.urls import path
from .views import (
    EmployerRegisterView, OtpVarificationView, ResendOtpView, CurrentUser, EmpLoginView, EmployerProfileCreatView,
    CandidateRegisterView, AuthCandidateView, UserDetails, CandidateProfileCreation, CandidateLoginView,AdminLoginView,AuthCandidateView,
    AuthEmployerView,ForgotPassView,ResetPassword,ProfileDeleteView,ProfileUpdateView,
)

from rest_framework_simplejwt.views import (
    TokenObtainPairView,
    TokenRefreshView,
)

urlpatterns = [
    path('token/', TokenObtainPairView.as_view(), name='token_obtain_pair'),
    path('token/refresh/', TokenRefreshView.as_view(), name='token_refresh'),

    path('current_user/',CurrentUser.as_view(),name='current_user'),


    path('cand_register/', CandidateRegisterView.as_view(), name="cand_register"),
    path('candidatelogin/', CandidateLoginView.as_view(), name="login"),
    path('auth/candidate/', AuthCandidateView.as_view(), name="authcandidate"),

    path("user/profile_creation/", CandidateProfileCreation.as_view(), name='CandidateProfileCreation'),
    path("user/details", UserDetails.as_view(), name="user-details"),  # Correctly nested under `api/account/`

    path('Emplogin/', EmpLoginView.as_view(), name="login"),
    path('employer/register/', EmployerRegisterView.as_view(), name="emp_register"),
    path("user/emp_profile_creation/", EmployerProfileCreatView.as_view(), name="employerProfileCreation"),

    path('forgot_pass/', ForgotPassView.as_view(), name="forgot_pass"),
    path('verify-otp/', OtpVarificationView.as_view(), name="otp_verify"),
    path('reset_password/', ResetPassword.as_view(), name="reset_password"),
    path('resend-otp/', ResendOtpView.as_view(), name="resend_otp"),


    



    path('admin/login/',AdminLoginView.as_view(),name="adminlogin"),

    path('auth/candidate/',AuthCandidateView.as_view(),name="authcandidate"),
    path('auth/employer/',AuthEmployerView.as_view(),name="authemployer"),

     # Profile Update URL
    path('profile/update/', ProfileUpdateView.as_view(), name='profile-update'),

    # Profile Delete URL
    path('profile/delete/', ProfileDeleteView.as_view(), name='profile-delete'),
]