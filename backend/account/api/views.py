from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from rest_framework.exceptions import ParseError,AuthenticationFailed
from .serializer import *
from .email import *
from account.models import *
from django.contrib.auth import authenticate
from rest_framework_simplejwt.tokens import RefreshToken
from rest_framework.permissions import IsAuthenticated
from rest_framework.permissions import AllowAny
from rest_framework.authentication import BasicAuthentication, SessionAuthentication
from google.oauth2 import id_token
from google.auth.transport import requests 
from django.views.decorators.csrf import csrf_exempt
from rest_framework.decorators import api_view
from django.core.validators import validate_email
from django.core.exceptions import ValidationError
from rest_framework_simplejwt.tokens import RefreshToken


#!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!EMPLOYER!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!

class EmployerRegisterView(APIView):
    permission_classes = [AllowAny]

    def post(self, request):
        email = request.data.get('email')
        if User.objects.filter(email=email).exists():
            return Response({"message": "User with this email already exists"}, status=status.HTTP_203_NON_AUTHORITATIVE_INFORMATION)

        serializer = EmployerRegisterSerializer(data=request.data)
        if serializer.is_valid():
            try:
                user = serializer.save(is_active=False)
                employer = Employer.objects.get_or_create(user=user)
                send_otp_via_mail(user.email, user.otp)
                return Response({"message": "OTP sent successfully.", "email": user.email}, status=status.HTTP_200_OK)
            except Exception as e:
                return Response({'error': 'Internal Server Error'}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
        else:
            return Response({"message": "error"}, status=status.HTTP_400_BAD_REQUEST)



class EmpLoginView(APIView):
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

        if not user.user_type == 'employer':
            return Response({"message": "Only employer can login!"}, status=status.HTTP_203_NON_AUTHORITATIVE_INFORMATION)

        user = authenticate(username=email, password=password)
        print(user)
        if user is None:
            return Response({"message": "Incorrect Password!"}, status=status.HTTP_203_NON_AUTHORITATIVE_INFORMATION)

       
        try:
            employer=Employer.objects.get(user=user)
            employer=EmployerSerializer(employer).data
            user_data=employer
        except Employer.DoesNotExist:
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
    

class CurrentUser(APIView):
    
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

class AuthCandidateView(APIView):
    permission_classes = [AllowAny]

    def post(self, request):
        print(request.data)
        GOOGLE_AUTH_API = "498624808618-bl2bhh4rao9n2it6dsvvp7ppvr3760b2.apps.googleusercontent.com"
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





class OtpVarificationView(APIView):
    permission_classes = []

    def post(self, request):
        serializer = OtpVerificationSerializer(data=request.data)
        if serializer.is_valid():
            email = serializer.validated_data.get('email')
            entered_otp = serializer.validated_data.get('otp')
            try:
                user = User.objects.get(email=email)
                if user.otp == entered_otp:
                    user.is_active = True
                    user.save()
                    response = {'message': 'User registered and verified successfully', 'email': email}
                    if user.user_type == 'candidate':
                        candidate=Candidate.objects.get(user=user)
                        response={
                            'message': 'User registered and verified successfully',
                            "email":email,
                            "username":user.full_name,
                            "completed":candidate.completed,
                            "usertype":user.user_type

                        }
                    if user.user_type == 'employer':
                        response={
                            'message': 'User registered and verified successfully',
                            "email":email,
                            "username":user.full_name,
                            "usertype":user.user_type

                        }
                    return Response(response, status=status.HTTP_200_OK)
                else:
                    return Response({'error': 'Invalid OTP, Please check your email and verify'}, status=status.HTTP_400_BAD_REQUEST)
            except User.DoesNotExist:
                return Response({'error': 'User not found or already verified'}, status=status.HTTP_404_NOT_FOUND)
            except Exception as e:
                return Response({'error': 'Internal Server Error'}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


class ResendOtpView(APIView):
    permission_classes = []

    def post(self, request):
        email = request.data.get('email')
        try:
            if email:
                resend_otp_via_mail(email)
                return Response({'message': 'OTP sent successfully.', 'email': email}, status=status.HTTP_200_OK)
        except Exception as e:
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


