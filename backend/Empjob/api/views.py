from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated,AllowAny
from rest_framework import status
from .serializer import *
from account.models import *



from django.middleware.csrf import get_token
from django.http import JsonResponse

def csrf_token_view(request):
    token = get_token(request)
    return JsonResponse({'csrfToken': token})


class PostJob(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request):
        try:
            # Get the authenticated user and employer
            user = request.user
            employer = Employer.objects.get(user=user)

            # Log the request data for debugging
            print("Request Data:", request.data)

            # Serialize and validate the data
            serializer = PostJobSerializer(data=request.data)
            if serializer.is_valid():
                # Save the job with the associated employer
                serializer.save(employer=employer)
                return Response({"message": "Job posted successfully."}, status=status.HTTP_201_CREATED)
            else:
                # Return validation errors
                print("Validation Errors:", serializer.errors)
                return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

        except Employer.DoesNotExist:
            # Handle case where employer does not exist
            print("Error: Employer not found for the authenticated user.")
            return Response({"message": "Employer not found."}, status=status.HTTP_404_NOT_FOUND)

        except Exception as e:
            # Log the error for debugging
            print(f"Unexpected Error: {e}")
            return Response({"message": "Something went wrong. Please try again."}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
        
class EditJob(APIView):
    permission_classes=[AllowAny]
    def post(self,request):
        print(request.data)
        jobId = request.data.get("jobId")
        try:
            job = Jobs.objects.get(id = jobId)
        except Jobs.DoesNotExist:
            return Response({"message":"something went wrong"},status=status.HTTP_203_NON_AUTHORITATIVE_INFORMATION)
        
        serializer = PostJobSerializer(instance=job, data=request.data, partial=True)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_200_OK)
        return Response(status=status.HTTP_400_BAD_REQUEST)
        
class ProfileView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        user = request.user
        print("user...........................", user)

        # Check if the user is a Candidate
        candidate = Candidate.objects.filter(user=user).first()
        if candidate:
            serializer = CandidateSerializer(candidate)
            skills = request.data.get('skills', '')
            print("Skills received:", skills)  # Log the skills field
            print("...............",serializer.data)
            return Response({'data': serializer.data}, status=status.HTTP_200_OK)

        # Check if the user is an Employer
        employer = Employer.objects.filter(user=user).first()
        if employer:
            serializer = EmployerSerializer(employer)
            return Response({'data': serializer.data}, status=status.HTTP_200_OK)

        # If neither Candidate nor Employer exists, return 404
        return Response({"message": "User profile not found"}, status=status.HTTP_404_NOT_FOUND)
class GetJob(APIView):
    permission_classes = [IsAuthenticated]
    def get(self,request):
       
        user=request.user
        print(user)
        try:
            employer = Employer.objects.get(user=user)
            print(employer)
            print("job details........")
            jobs = Jobs.objects.filter(employer=employer)
            print(jobs)
            serializer = JobSerializer(jobs, many=True)
            data = {
                "data": serializer.data
            }
            return Response(data, status=status.HTTP_200_OK)
        except Employer.DoesNotExist:
            return Response({"error": "Employer not found"}, status=status.HTTP_404_NOT_FOUND)
        except Exception as e:
            print(e)
            return Response(status=status.HTTP_500_INTERNAL_SERVER_ERROR)


class GetAllJob(APIView):
    permission_classes=[IsAuthenticated]
    def get(self,request):
        try:
            #jobs=Jobs.objects.filter(active=True)
            jobs=Jobs.objects.all()
            print("jobssssssssssssssss",jobs)
            serializer=JobSerializer(jobs,many=True)
            return Response(serializer.data, status=status.HTTP_200_OK)
        except Exception as e:
            print(e)
            return Response(status=status.HTTP_500_INTERNAL_SERVER_ERROR)

class GetJobDetail(APIView):
    permission_classes = [IsAuthenticated]
    def get(self,request,job_id):
        try:    
            job=Jobs.objects.get(id=job_id)
            
            serializer=JobSerializer(job)
         
           
            return Response(serializer.data,status=status.HTTP_200_OK)
        except:
            return Response(status=status.HTTP_203_NON_AUTHORITATIVE_INFORMATION)
        
class GetJobStatus(APIView):
    permission_classes= [IsAuthenticated]
    def post(self,request,job_id):
        print(request.headers)
        action = request.data.get('action')
        try:
            job=Jobs.objects.get(id=job_id)
            if action == 'deactivate':
                job.active = False
            elif action == 'activate':
                job.active = True
            job.save()
            return Response({"message","job Status change"},status=status.HTTP_200_OK)
        except:
             return Response(status=status.HTTP_203_NON_AUTHORITATIVE_INFORMATION)

