from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from rest_framework.exceptions import ParseError,AuthenticationFailed
from .serializer import *
from .email import *
from Empjob.api.serializer import *
from user_account.models import *
from Empjob.models import *
from django.contrib.auth import authenticate
from rest_framework_simplejwt.tokens import RefreshToken
from rest_framework.permissions import IsAuthenticated
from rest_framework.permissions import AllowAny
from rest_framework.authentication import BasicAuthentication, SessionAuthentication
from google.oauth2 import id_token # type: ignore
from google.auth.transport import requests  # type: ignore
from django.views.decorators.csrf import csrf_exempt
from rest_framework.decorators import api_view
from django.core.validators import validate_email
from django.core.exceptions import ValidationError
from rest_framework_simplejwt.tokens import RefreshToken


#!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!EMPLOYER!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!


import logging 
from django.http import JsonResponse
from django.views.decorators.csrf import ensure_csrf_cookie

from django.middleware.csrf import get_token
from django.http import JsonResponse

def get_csrf_token(request):
    csrf_token = get_token(request)
    print("CSRF Token:", csrf_token)  # Debugging
    return JsonResponse({'csrfToken': csrf_token})

logger = logging.getLogger(__name__)

class EmployerRegisterView(APIView):
    permission_classes = []

    def post(self, request):
        
        print("hellooooooooo")  # Debugging step
        email = request.data.get('email')

        
        # Check if user exists
        if User.objects.filter(email=email).exists():
            print("User already exists")  # Debugging step
            return Response({"message": "User with this email already exists"},
                            status=status.HTTP_203_NON_AUTHORITATIVE_INFORMATION)

        # Check serializer validation
        serializer = EmployerRegisterSerializer(data=request.data)
        if not serializer.is_valid():
            print("Serializer errors:", serializer.errors)  # Debugging step
            return Response({"message": "Validation error", "errors": serializer.errors},
                            status=status.HTTP_400_BAD_REQUEST)

        try:
            print("Serializer is valid, saving user...")  # Debugging step
            user = serializer.save(is_active=False)
            print(f"User created: {user}")  # Debugging step
            
            # Create Employer profile
            employer, created = Employer.objects.get_or_create(user=user)
            print(f"Employer created: {created}")  # Debugging step

            # Check OTP before sending
            print(f"Sending OTP: {user.otp} to {user.email}")
            send_otp_via_mail(user.email, user.otp)

            response_data = {
                'message': 'OTP sent successfully.',
                'email': user.email
            }
            return Response(response_data, status=status.HTTP_200_OK)

        except Exception as e:
            logger.error(f"Error in EmployerRegisterView: {str(e)}")  # Log error
            print(f"Error: {str(e)}")  # Debugging step
            return Response({'error': str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)










logger = logging.getLogger(__name__)

class EmpLoginView(APIView):
    permission_classes = []

    def post(self, request):
        email = request.data.get('email')
        password = request.data.get('password')
        logger.info(f"Login attempt for email: {email}")

        try:
            user = User.objects.get(email=email)
            logger.info(f"User found: {user}")
        except User.DoesNotExist:
            logger.warning(f"User with email {email} does not exist")
            return Response({"message": "Invalid email address!"}, status=status.HTTP_404_NOT_FOUND)

        if not user.is_active:
            logger.warning(f"User {email} is inactive")
            return Response({"message": "Your account is inactive!"}, status=status.HTTP_403_FORBIDDEN)

        # Check if the user is an employer
        if user.user_type != 'employer':
            logger.warning(f"User {email} is not an employer")
            return Response({"message": "Only employers can login!"}, status=status.HTTP_403_FORBIDDEN)

        # Authenticate the user
        user = authenticate(username=email, password=password)
        if user is None:
            logger.warning(f"Invalid password for user {email}")
            return Response({"message": "Incorrect password!"}, status=status.HTTP_401_UNAUTHORIZED)

        try:
            employer = Employer.objects.get(user=user)
            logger.info(f"Employer found: {employer}")

            # Check if the employer is approved by admin
            if not employer.is_approved_by_admin:
                logger.warning(f"Employer {email} is not approved by admin")
                return Response(
                    {"message": "Your account is not approved by the admin!"},
                    status=status.HTTP_403_FORBIDDEN
                )

            # Serialize employer data
            employer_data = EmployerSerializer(employer).data
            user_data = employer_data
        except Employer.DoesNotExist:
            logger.error(f"Employer not found for user {email}")
            return Response(
                {"message": "Employer profile not found. Please contact support."},
                status=status.HTTP_500_INTERNAL_SERVER_ERROR
            )

        # Generate tokens
        refresh = RefreshToken.for_user(user)
        refresh["name"] = str(user.full_name)
        access_token = str(refresh.access_token)
        refresh_token = str(refresh)

        # Prepare response data
        content = {
            'email': user.email,
            'name': user.full_name,
            'access_token': access_token,
            'refresh_token': refresh_token,
            'isAdmin': user.is_superuser,
            'user_type': user.user_type,
            'is_verified': employer.is_verified,
            'is_approved_by_admin': employer.is_approved_by_admin,
            'user_data': user_data
        }

        logger.info(f"Login successful for user {email}")
        return Response(content, status=status.HTTP_200_OK)





class CurrentUser(APIView):
    # permission_classes=[]
    def get(self, request):
        user = request.user
        if not user.is_authenticated:
            return Response({"error": "User is not authenticated"}, status=status.HTTP_401_UNAUTHORIZED)
        
        try:
            candidate = Candidate.objects.get(user=user)
            serializer = CandidateSerializer(candidate)
            return Response(serializer.data, status=status.HTTP_200_OK)
        except Candidate.DoesNotExist:
            pass
        
        try:
            employer = Employer.objects.get(user=user)
            serializer = EmployerSerializer(employer)
            return Response(serializer.data, status=status.HTTP_200_OK)
        except Employer.DoesNotExist:
            pass
        
        return Response({"error": "User is not a candidate or an employer"}, status=status.HTTP_404_NOT_FOUND)












from django.views.decorators.csrf import csrf_exempt
from django.utils.decorators import method_decorator

@method_decorator(csrf_exempt, name='dispatch')
class EmployerProfileUpdateView(APIView):
    permission_classes = [AllowAny]
    
    def put(self, request):
        try:
            user = request.user
            employer = Employer.objects.get(user=user)
            
            # Update profile fields if provided in the request
            if 'phone' in request.data:
                employer.phone = request.data['phone']
            if 'industry' in request.data:
                employer.industry = request.data['industry']
            if 'headquarters' in request.data:
                employer.headquarters = request.data['headquarters']
            if 'address' in request.data:
                employer.address = request.data['address']
            if 'about' in request.data:
                employer.about = request.data['about']
            if 'website_link' in request.data:
                employer.website_link = request.data['website_link']
            
            # Handle profile picture update
            if 'profile_pic' in request.FILES:
                # Delete old profile picture if it exists
                if employer.profile_pic and os.path.isfile(employer.profile_pic.path):
                    os.remove(employer.profile_pic.path)
                employer.profile_pic = request.FILES['profile_pic']
            
            # Save the updated employer profile
            employer.save()
            
            return Response(
                {"status": "success", "message": "Profile updated successfully"},
                status=status.HTTP_200_OK
            )
        
        except Employer.DoesNotExist:
            return Response(
                {"status": "error", "message": "Employer profile not found"},
                status=status.HTTP_404_NOT_FOUND
            )
        except Exception as e:
            return Response(
                {"status": "error", "message": str(e)},
                status=status.HTTP_500_INTERNAL_SERVER_ERROR
            )
from django.views.decorators.csrf import csrf_exempt
from django.utils.decorators import method_decorator

@method_decorator(csrf_exempt, name='dispatch')
class EmployerProfileDeleteView(APIView):
    permission_classes = [AllowAny]
    
    def delete(self, request):
        try:
            user = request.user
            employer = Employer.objects.get(user=user)
            
            # Delete profile picture if it exists
            if employer.profile_pic and os.path.isfile(employer.profile_pic.path):
                os.remove(employer.profile_pic.path)
            
            # Delete the employer profile
            employer.delete()
            
            # Optionally, delete the user account as well
            # user.delete()
            
            return Response(
                {"status": "success", "message": "Profile deleted successfully"},
                status=status.HTTP_200_OK
            )
        
        except Employer.DoesNotExist:
            return Response(
                {"status": "error", "message": "Employer profile not found"},
                status=status.HTTP_404_NOT_FOUND
            )
        except Exception as e:
            return Response(
                {"status": "error", "message": str(e)},
                status=status.HTTP_500_INTERNAL_SERVER_ERROR
            )















    
class EmployerProfileCreatView(APIView):
    permission_classes = [IsAuthenticated]
    def post(self,request):
        user = request.user
        employer,created = Employer.objects.get_or_create(user=user)
        serializer = EmployerProfileSerializer(employer,data=request.data, partial=True)
        if serializer.is_valid():
            employer.completed=True
            employer.save()
            serializer.save()
            return Response({"message": "Profile updated successfully.","data":serializer.data}, status=status.HTTP_200_OK)
        else:
            print(serializer.errors)
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from rest_framework.permissions import IsAuthenticated

import os




class ProfileUpdateView(APIView):
    permission_classes = [IsAuthenticated]
    
    def put(self, request):
        try:
            user = request.user
            profile = Candidate.objects.get(user=user)
            
            # Use CandidateProfileSerializer to validate and update profile data
            profile_serializer = CandidateProfileSerializer(profile, data=request.data, partial=True)
            if profile_serializer.is_valid():
                profile_serializer.save()
            else:
                return Response(
                    {"status": "error", "message": profile_serializer.errors},
                    status=status.HTTP_400_BAD_REQUEST
                )
            
            # Handle profile pic update
            if 'profile_pic' in request.FILES:
                if profile.profile_pic and os.path.isfile(profile.profile_pic.path):
                    os.remove(profile.profile_pic.path)
                profile.profile_pic = request.FILES['profile_pic']
                profile.save()
            
            # Handle resume update
            if 'resume' in request.FILES:
                if profile.resume and os.path.isfile(profile.resume.path):
                    os.remove(profile.resume.path)
                profile.resume = request.FILES['resume']
                profile.save()
            
            # Update education details
            education_data = {
                'education': request.data.get('education'),
                'specilization': request.data.get('specilization'),
                'college': request.data.get('college'),
                'completed': request.data.get('completed'),
                'mark': request.data.get('mark')
            }
            
            # Get or create education record using the correct field (user)
            edu_record, created = Education.objects.get_or_create(
                user=user,  # Use 'user' instead of 'profile'
                defaults=education_data
            )
            
            # If record already exists, update it
            if not created:
                edu_serializer = EducationSerializer(edu_record, data=education_data, partial=True)
                if edu_serializer.is_valid():
                    edu_serializer.save()
                else:
                    return Response(
                        {"status": "error", "message": edu_serializer.errors},
                        status=status.HTTP_400_BAD_REQUEST
                    )
            
            return Response(
                {"status": "success", "message": "Profile updated successfully"},
                status=status.HTTP_200_OK
            )
        
        except Candidate.DoesNotExist:
            return Response(
                {"status": "error", "message": "Profile not found"},
                status=status.HTTP_404_NOT_FOUND
            )
        except Exception as e:
            return Response(
                {"status": "error", "message": str(e)},
                status=status.HTTP_500_INTERNAL_SERVER_ERROR
            )
            

class ProfileDeleteView(APIView):
    permission_classes = [IsAuthenticated]
    
    def delete(self, request):
        try:
            user = request.user
            profile = Candidate.objects.get(user=user)
            
            # Delete profile picture if exists
            if profile.profile_pic and os.path.isfile(profile.profile_pic.path):
                os.remove(profile.profile_pic.path)
            
            # Delete resume if exists
            if profile.resume and os.path.isfile(profile.resume.path):
                os.remove(profile.resume.path)
            
            # Delete education records
            Education.objects.filter(profile=profile).delete()
            
            # Delete profile
            profile.delete()
            
            # Optionally delete user account as well
            # user.delete()
            
            return Response(
                {"status": "success", "message": "Profile deleted successfully"},
                status=status.HTTP_200_OK
            )
        
        except Candidate.DoesNotExist:
            return Response(
                {"status": "error", "message": "Profile not found"},
                status=status.HTTP_404_NOT_FOUND
            )
        except Exception as e:
            return Response(
                {"status": "error", "message": str(e)},
                status=status.HTTP_500_INTERNAL_SERVER_ERROR
            )






#!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!CANDIDATE!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!

class UserDetails(APIView):
    permission_classes = [IsAuthenticated]
    def get(self, request):
        print("userdetail...............",request)
        user = User.objects.get(id=request.user.id)
        data = UserSerializer(user).data
        if user.user_type == 'candidate':
            candidate=Candidate.objects.get(user=user)
            candidate=CandidateSerializer(candidate).data
            user_data=candidate
            content ={
                'data':data,
                'user_data':user_data
            } 
        elif user.user_type == 'employer':
            employer=Employer.objects.get(user=user)
            employer=EmployerSerializer(employer).data
            print("employerdata.................",employer)
            user_data=employer
            content ={
                'data':data,
                'user_data':user_data
            } 
        else:
            content ={
                'data':data,
            } 
        print("dataaaaaaaaaaaaaaaaaaa",user_data)
        return Response(content)




class CandidateRegisterView(APIView):
    permission_classes = []
    def post(self,request):
       
        print(request.data)
        email = request.data.get('email')
        if User.objects.filter(email=email).exists():
            return Response({"message":"User with this email is already exist"},status=status.HTTP_203_NON_AUTHORITATIVE_INFORMATION)
        
        serializer=CandidateRegisterSerializer(data=request.data)
        if serializer.is_valid():
            print(serializer)
            try:
                user=serializer.save(is_active=False)
                candidate=Candidate.objects.get_or_create(user=user)
                Education.objects.get_or_create(user=user)
                send_otp_via_mail(user.email,user.otp)
                response_data = {
                    'message': 'OTP sent successfully.',
                    'email': user.email,
                }

                return Response(response_data, status=status.HTTP_200_OK)
            except Exception as e:
                print("error",e)
                return Response({'error': 'Internal Server Error'}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
        else:
            return Response({"message":"error"}, status=status.HTTP_400_BAD_REQUEST)



class CandidateLoginView(APIView):
    permission_classes = []
    def post(self, request):
        
        email = request.data.get('email')
        password = request.data.get('password')
        print(email,password)
    
        try:
            user = User.objects.get(email=email)
            print(user)
        except User.DoesNotExist:
            return Response({"message": "Invalid email address!"}, status=status.HTTP_203_NON_AUTHORITATIVE_INFORMATION)
        
        if not user.is_active:
            return Response({"message": "Your account is inactive!"}, status=status.HTTP_203_NON_AUTHORITATIVE_INFORMATION)

        if not user.user_type == 'candidate':
            return Response({"message": "Only candidates can login!"}, status=status.HTTP_203_NON_AUTHORITATIVE_INFORMATION)

        user = authenticate(username=email, password=password)
        if user is None:
            return Response({"message": "Incorrect Password!"}, status=status.HTTP_203_NON_AUTHORITATIVE_INFORMATION)

       
        try:
            candidate=Candidate.objects.get(user=user)
            candidate=CandidateSerializer(candidate).data
            user_data = candidate
        except Candidate.DoesNotExist:
            return Response({"message": "something went Wrong"}, status=status.HTTP_203_NON_AUTHORITATIVE_INFORMATION) 
        
        refresh = RefreshToken.for_user(user)
        refresh["name"]=str(user.full_name)
        access_token = str(refresh.access_token)
        refresh_token = str(refresh)
        content = {
            'email': user.email,
            'name':user.full_name,
            'access_token': access_token,
            'refresh_token': refresh_token,
            'isAdmin': user.is_superuser,
            'user_type':user.user_type,
            'user_data':user_data
        }
        return Response(content, status=status.HTTP_200_OK)



class AuthEmployerView(APIView):
    permission_classes = [AllowAny]
    def post(self, request):
        print(request.data)
        GOOGLE_AUTH_API = "718921547648-htg9q59o6ka7j7jsp45cc4dai6olfqs5.apps.googleusercontent.com"
        email = None
        user_info = None
        try:
            google_request = requests.Request()
            user_info = id_token.verify_oauth2_token(
                request.data['client_id'], google_request, GOOGLE_AUTH_API
            )
            email = user_info['email']
            print(user_info)
        except ValueError as e:
            print("Token verification failed:", str(e))
            return Response({"error": "Invalid token"}, status=status.HTTP_400_BAD_REQUEST)
        except KeyError:
            return Response({"error": "client_id not provided"}, status=status.HTTP_400_BAD_REQUEST)
        except Exception as e:
            print(f"Unexpected error: {e}")
            return Response({"error": "An unexpected error occurred"}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

        if not User.objects.filter(email=email).exists():
            try:
                username = user_info['name']
                first_name = user_info['given_name']
                last_name = user_info['family_name']
                profile_picture = user_info['picture']
                print(username, first_name, last_name, profile_picture)
                user = User.objects.create(full_name=username, email=email, user_type='employer', is_active=True, is_email_verified=True)
                employer = Employer.objects.create(user=user, profile_pic=profile_picture)
                user.save()
                employer.save()
            except Exception as e:
                print(f"User creation failed: {e}")
                return Response({"error": "Failed to create user"}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

        try:
            user = User.objects.get(email=email)
            if not user.is_active:
                return Response({"message": "Your account is inactive!"}, status=status.HTTP_203_NON_AUTHORITATIVE_INFORMATION)
            elif user.user_type != 'employer':
                return Response({"message": "Only employer can login!"}, status=status.HTTP_203_NON_AUTHORITATIVE_INFORMATION)
            else:
                try:
                    employer = Employer.objects.get(user=user)
                    employer_data = EmployerSerializer(employer).data
                except Employer.DoesNotExist:
                    return Response({"message": "Employer not found"}, status=status.HTTP_203_NON_AUTHORITATIVE_INFORMATION)

            refresh = RefreshToken.for_user(user)
            refresh["name"] = str(user.full_name)
            access_token = str(refresh.access_token)
            refresh_token = str(refresh)
            content = {
                'email': user.email,
                'name': user.full_name,
                'access_token': access_token,
                'refresh_token': refresh_token,
                'isAdmin': user.is_superuser,
                'user_type': user.user_type,
                'user_data': employer_data
            }

            return Response(content, status=status.HTTP_200_OK)
        except Exception as e:
            print(f"Unexpected error during authentication: {e}")
            return Response({"error": "An unexpected error occurred"}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)








from django.contrib.auth import get_user_model


logger = logging.getLogger(__name__)

User = get_user_model()

class AuthEmployerView(APIView):
    permission_classes = [AllowAny]

    def post(self, request):
        print("AuthEmployerView: Received request data -", request.data)

        GOOGLE_AUTH_API =  "718921547648-htg9q59o6ka7j7jsp45cc4dai6olfqs5.apps.googleusercontent.com"
        email = None
        user_info = None

        # Step 1: Verify Google ID token
        try:
            google_request = requests.Request()
            user_info = id_token.verify_oauth2_token(
                request.data.get('client_id'), google_request, GOOGLE_AUTH_API
            )
            email = user_info.get('email')
            print("AuthEmployerView: Google user info -", user_info)
        except ValueError as e:
            logger.error(f"Token verification failed: {e}")
            return Response({"error": "Invalid token"}, status=status.HTTP_400_BAD_REQUEST)
        except KeyError:
            logger.error("client_id not provided")
            return Response({"error": "client_id not provided"}, status=status.HTTP_400_BAD_REQUEST)
        except Exception as e:
            logger.error(f"Unexpected error during token verification: {e}")
            return Response({"error": "An unexpected error occurred"}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

        # Step 2: Create or retrieve user
        try:
            user, created = User.objects.get_or_create(
                email=email,
                defaults={
                    'full_name': user_info.get('name', ''),
                    'user_type': 'employer',
                    'is_active': True,
                    'is_email_verified': True,
                }
            )

            # If the user is newly created, create an associated Employer profile
            if created:
                profile_picture = user_info.get('picture', '')
                Employer.objects.create(user=user, profile_pic=profile_picture)
                print("AuthEmployerView: New employer created -", user.email)
            else:
                print("AuthEmployerView: Existing employer found -", user.email)
        except Exception as e:
            logger.error(f"User creation/retrieval failed: {e}")
            return Response({"error": "Failed to create or retrieve user"}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

        # Step 3: Validate user and employer
        if not user.is_active:
            return Response({"message": "Your account is inactive!"}, status=status.HTTP_403_FORBIDDEN)
        if user.user_type != 'employer':
            return Response({"message": "Only employers can login!"}, status=status.HTTP_403_FORBIDDEN)

        try:
            employer = Employer.objects.get(user=user)
            employer_data = EmployerSerializer(employer).data

            # Step 4: Check if the employer is approved by admin
            if not employer.is_approved_by_admin:
                return Response(
                    {"message": "Your account is not yet approved by the admin. Please wait for approval."},
                    status=status.HTTP_403_FORBIDDEN
                )
        except Employer.DoesNotExist:
            logger.error(f"Employer not found for user - {user.email}")
            return Response({"message": "Employer not found"}, status=status.HTTP_404_NOT_FOUND)

        # Step 5: Generate tokens
        try:
            refresh = RefreshToken.for_user(user)
            refresh["name"] = str(user.full_name)
            access_token = str(refresh.access_token)
            refresh_token = str(refresh)

            content = {
                'email': user.email,
                'name': user.full_name,
                'access_token': access_token,
                'refresh_token': refresh_token,
                'isAdmin': user.is_superuser,
                'user_type': user.user_type,
                'user_data': employer_data,
            }

            return Response(content, status=status.HTTP_200_OK)
        except Exception as e:
            logger.error(f"Token generation failed: {e}")
            return Response({"error": "Failed to generate tokens"}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)



class AuthCandidateView(APIView):
    permission_classes = [AllowAny]

    def post(self, request):
        print(request.data)
        GOOGLE_AUTH_API = "718921547648-htg9q59o6ka7j7jsp45cc4dai6olfqs5.apps.googleusercontent.com"
        email = None  
        try:
            google_request = requests.Request()
            user_info = id_token.verify_oauth2_token(
                request.data['client_id'], google_request, GOOGLE_AUTH_API
            )
            email = user_info['email']
            print("user infor..........",user_info)
        except Exception as e:
            print(e)
            return Response({"error": "Invalid token or user information"}, status=status.HTTP_400_BAD_REQUEST)
        
        if not User.objects.filter(email=email).exists():
            username = user_info['name']
            first_name = user_info['given_name']
            last_name = user_info['family_name']
            profile_picture = user_info['picture']
            print(username, first_name, last_name, profile_picture)
            user = User.objects.create(
                full_name=username,
                email=email,
                user_type='candidate',
                is_active=True,
                is_email_verified=True
            )
            candidate = Candidate.objects.create(user=user)
            user.save()
            candidate.save()
        
        user = User.objects.get(email=email)
        if not user.is_active:
            return Response({"message": "Your account is inactive!"}, status=status.HTTP_203_NON_AUTHORITATIVE_INFORMATION)
        elif user.user_type != 'candidate':
            return Response({"message": "Only candidates can login!"}, status=status.HTTP_203_NON_AUTHORITATIVE_INFORMATION)
        else:
            try:
                candidate = Candidate.objects.get(user=user)
                candidate = CandidateSerializer(candidate).data
                user_data = candidate
            except Candidate.DoesNotExist:
                return Response({"message": "Something went wrong"}, status=status.HTTP_203_NON_AUTHORITATIVE_INFORMATION)

        refresh = RefreshToken.for_user(user)
        refresh["name"] = str(user.full_name)
        access_token = str(refresh.access_token)
        refresh_token = str(refresh)
        content = {
            'email': user.email,
            'name': user.full_name,
            'access_token': access_token,
            'refresh_token': refresh_token,
            'isAdmin': user.is_superuser,
            'user_type': user.user_type,
            'user_data': user_data
        }
        return Response(content,status=status.HTTP_200_OK)
    

class CandidateProfileCreation(APIView):
    permission_classes = [AllowAny]

    def post(self, request):
        print(request.data)
        user = request.user  # Get the logged-in user
        candidate, created = Candidate.objects.get_or_create(user=user)

        serializer = CandidateProfileSerializer(candidate, data=request.data, partial=True)

        if serializer.is_valid():
            serializer.save()
            
            # Update or create Education instance
            education, created = Education.objects.get_or_create(user=user)
            education.education = request.data.get('education')
            education.college = request.data.get('college')
            education.specilization = request.data.get('specilization')
            education.completed = request.data.get('completed')
            education.mark = request.data.get('mark')
            education.save()

            return Response({"message": "Profile updated successfully.","data":serializer.data}, status=status.HTTP_200_OK)
        else:
            # Print serializer errors for debugging
            print(serializer.errors)
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


#!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!VERIFY OTP AND RESEND OTP!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
#!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!FORGOT RESET PASSWORD!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!


logger = logging.getLogger(__name__)

class ForgotPassView(APIView):
    permission_classes = []

    def post(self, request):
        email = request.data.get('email')
        if not email:
            return Response({"message": "Email is required."}, status=status.HTTP_400_BAD_REQUEST)

        try:
            logger.info(f"Received forgot password request for email: {email}")

            if not User.objects.filter(email=email).exists():
                logger.warning(f"User with email {email} does not exist.")
                return Response({"message": "Invalid email address."}, status=status.HTTP_203_NON_AUTHORITATIVE_INFORMATION)
            
            if not User.objects.filter(email=email, is_active=True).exists():
                logger.warning(f"User with email {email} is blocked.")
                return Response({"message": "Your account is blocked by the admin."}, status=status.HTTP_203_NON_AUTHORITATIVE_INFORMATION)
            
            send_otp_via_mail(email)  # Send OTP to the user's email
            logger.info(f"OTP sent to {email}.")
            return Response({"message": "OTP has been sent to your email.", "email": email}, status=status.HTTP_200_OK)
        
        except Exception as e:
            logger.error(f"Error processing forgot password request: {e}")
            return Response({"message": "Error processing your request."}, status=status.HTTP_400_BAD_REQUEST)
class ResetPassword(APIView):
    permission_classes = []

    def post(self, request):
        email = request.data.get('email')
        password = request.data.get('password')

        if not email or not password:
            return Response({"error": "Email and password are required."}, status=status.HTTP_400_BAD_REQUEST)

        try:
            user = User.objects.get(email=email)
            user.set_password(password)  # Set new password
            user.save()
            logger.info(f"Password reset successfully for user: {email}.")
            return Response({"message": "Password reset successfully."}, status=status.HTTP_200_OK)
        except User.DoesNotExist:
            logger.warning(f"User with email {email} not found.")
            return Response({"error": "User not found."}, status=status.HTTP_404_NOT_FOUND)
        except Exception as e:
            logger.error(f"Error resetting password: {e}")
            return Response({"error": "Internal Server Error."}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

from django.middleware.csrf import get_token
from django.http import JsonResponse

def get_csrf_token(request):
    csrf_token = get_token(request)
    return JsonResponse({'csrfToken': csrf_token})



class OtpVarificationView(APIView):
    permission_classes = []

    def post(self, request):
        serializer = OtpVerificationSerializer(data=request.data)
        if not serializer.is_valid():
            logger.warning(f"Invalid OTP verification request: {serializer.errors}")
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

        email = serializer.validated_data.get('email')
        entered_otp = serializer.validated_data.get('otp')

        try:
            user = User.objects.get(email=email)
            logger.info(f"Stored OTP: {user.otp}, Entered OTP: {entered_otp}")  # Debugging
            if user.otp == entered_otp:
                user.is_active = True
                user.save()
                logger.info(f"OTP verified successfully for user: {email}.")
                return Response({"message": "User registered and verified successfully", "email": email}, status=status.HTTP_200_OK)
            else:
                logger.warning(f"Invalid OTP for user: {email}.")
                return Response({'error': 'Invalid OTP, Please check your email and verify'}, status=status.HTTP_400_BAD_REQUEST)
        except User.DoesNotExist:
            logger.warning(f"User with email {email} not found.")
            return Response({'error': 'User not found or already verified'}, status=status.HTTP_404_NOT_FOUND)
        except Exception as e:
            logger.error(f"Error verifying OTP: {e}")
            return Response({'error': 'Internal Server Error'}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)





















class ResendOtpView(APIView):
    permission_classes = []

    def post(self, request):
        email = request.data.get('email')
        if not email:
            return Response({"error": "Email is required."}, status=status.HTTP_400_BAD_REQUEST)

        try:
            logger.info(f"Resending OTP to email: {email}.")
            resend_otp_via_mail(email)
            return Response({'message': 'OTP sent successfully.', 'email': email}, status=status.HTTP_200_OK)
        except Exception as e:
            logger.error(f"Error resending OTP: {e}")
            return Response({'error': 'Internal Server Error'}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)




























































class AdminLoginView(APIView):
    permission_classes = [AllowAny]
    def post(self,request):
        try:
            email = request.data.get('email')
            password = request.data.get('password')
            print(email,password)
            if not email or not password:
                raise ParseError("Both email and password are required.")
        except KeyError:
            raise ParseError("Both email and password are required.")
        
        try:
            user = User.objects.get(email=email)
            if not user:
                return Response({"message": "Invalid email address."}, status=status.HTTP_400_BAD_REQUEST)
        except User.DoesNotExist:
            return Response({"message": "Invalid email address."}, status=status.HTTP_400_BAD_REQUEST)
        if not user.is_superuser:
            
            return Response({"message": "Only Admin can login"}, status=status.HTTP_403_FORBIDDEN)
        
        user = authenticate(username=email, password=password)
        if user is None:
            return Response({"message": "Invalid email or password."}, status=status.HTTP_400_BAD_REQUEST)
        refresh = RefreshToken.for_user(user)
        refresh["name"]=str(user.full_name)
        access_token = str(refresh.access_token)
        refresh_token = str(refresh)

        content = {
            'email': user.email,
            'name':user.full_name,
            'access_token': access_token,
            'refresh_token': refresh_token,
            'isAdmin': user.is_superuser,
            'user_type':user.user_type,
        }
        return Response(content, status=status.HTTP_200_OK)

class UserDetails(APIView):
    permission_classes = [IsAuthenticated]
    def get(self, request):
        print("helloooooooooooooo",request)
        user = User.objects.get(id=request.user.id)
        data = UserSerializer(user).data
        if user.user_type == 'candidate':
            candidate=Candidate.objects.get(user=user)
            candidate=CandidateSerializer(candidate).data
            user_data=candidate
            content ={
                'data':data,
                'user_data':user_data
            } 
        elif user.user_type == 'employer':
            employer=Employer.objects.get(user=user)
            employer=EmployerSerializer(employer).data
            user_data=employer
            content ={
                'data':data,
                'user_data':user_data
            } 
        else:
            content ={
                'data':data,
            } 
       
        return Response(content)


