from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from rest_framework import status
from .serializer import *
from account.models import *

class PostJob(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request):
        try:
            # Get the authenticated user and employer
            user = request.user
            employer = Employer.objects.get(user=user)

            # Create a new job instance
            jobs = Jobs.objects.create(employer=employer)

            # Log the request data for debugging
            print("Request Data:", request.data)

            # Serialize and validate the data
            serializer = PostJobSerializer(jobs, data=request.data)
            if serializer.is_valid():
                serializer.save()
                return Response({"message": "Job posted successfully."}, status=status.HTTP_201_CREATED)
            else:
                # Return validation errors
                print("Validation Errors:", serializer.errors)
                return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

        except Employer.DoesNotExist:
            # Handle case where employer does not exist
            print("Validation Errors:", serializer.errors)
            return Response({"message": "Employer not found."}, status=status.HTTP_404_NOT_FOUND)

        except Exception as e:
            # Log the error for debugging
            print(f"Error: {e}")
            return Response({"message": "Something went wrong. Please try again."}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
        
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

