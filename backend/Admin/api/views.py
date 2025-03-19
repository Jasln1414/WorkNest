from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from rest_framework.permissions import AllowAny
from django.shortcuts import get_object_or_404
from user_account.models import User
from Empjob.models import Candidate, Employer, Jobs
from .serializer import CandidateDetailSerializer, EmployerDetailsSerializer, CandidateSerializer, EmployerSerializer, AdminJobSerializer

import logging

from Empjob.models import Jobs

logger = logging.getLogger(__name__)


from rest_framework import status
from rest_framework.permissions import IsAuthenticated
from django.core.cache import cache
from django.db import DatabaseError
import logging


logger = logging.getLogger(__name__)


class EmployerApprovalView(APIView):
    permission_classes = [AllowAny]  # Add proper permissions like IsAdminUser in production

    def post(self, request):
        employer_id = request.data.get('id')
        action = request.data.get('action')  # 'approve' or 'reject'

        try:
            employer = Employer.objects.get(id=employer_id)
            if action == 'approve':
                employer.is_approved_by_admin = True
            elif action == 'reject':
                employer.is_approved_by_admin = False
            else:
                return Response({"error": "Invalid action"}, status=status.HTTP_400_BAD_REQUEST)
            
            employer.save()
            return Response({"message": f"Employer {action}ed successfully!"}, status=status.HTTP_200_OK)
        except Employer.DoesNotExist:
            return Response({"error": "Employer not found"}, status=status.HTTP_404_NOT_FOUND)
class HomeView(APIView):
    permission_classes=[AllowAny]
    def get(self,request):
        candidates_count = Candidate.objects.count()
        employers_count = Employer.objects.count()
        jobs_count = Jobs.objects.filter(active=True).count()
        
        data = {
            'candidates_count': candidates_count,
            'employers_count': employers_count,
            'jobs_count': jobs_count,
            
        }
        return Response(data,status=status.HTTP_200_OK)

class CandidateListView(APIView):
    permission_classes = [AllowAny]

    def get(self, request):
        print("CandidateListView: Fetching all candidates...")
        candidates = Candidate.objects.all()
        serializer = CandidateSerializer(candidates, many=True)
        print(f"CandidateListView: Serialized data - {serializer.data}")
        return Response(serializer.data, status=status.HTTP_200_OK)


class EmployerListView(APIView):
    permission_classes = [AllowAny]

    def get(self, request):
        print("EmployerListView: Fetching all employers...")
        employers = Employer.objects.all()
        serializer = EmployerSerializer(employers, many=True)
        print(f"EmployerListView: Serialized data - {serializer.data}")
        return Response(serializer.data, status=status.HTTP_200_OK)


class CandidateView(APIView):
    permission_classes = [AllowAny]

    def get(self, request, id):
        print(f"CandidateView: Fetching candidate with id {id}...")
        print(f"Candidate ID: {id}")  # Check if this prints in the terminal
        try:
            candidate = Candidate.objects.get(id=id)
            print(f"CandidateView: Candidate found - {candidate}")
            serializer = CandidateDetailSerializer(candidate)
            print(f"CandidateView: Serialized data - {serializer.data}")
            return Response(serializer.data, status=status.HTTP_200_OK)
        except Candidate.DoesNotExist:
            logger.error(f"Candidate with id {id} not found")
            print(f"CandidateView: Candidate with id {id} not found")
            return Response({"error": "Candidate not found"}, status=status.HTTP_404_NOT_FOUND)


class EmployerView(APIView):
    permission_classes = [AllowAny]

    def get(self, request, id):
        print(f"EmployerView: Fetching employer with id {id}...")
        try:
            employer = Employer.objects.get(id=id)
            print(f"EmployerView: Employer found - {employer}")
            serializer = EmployerDetailsSerializer(employer)
            print(f"EmployerView: Serialized data - {serializer.data}")
            return Response(serializer.data, status=status.HTTP_200_OK)
        except Employer.DoesNotExist:
            logger.error(f"Employer with id {id} not found")
            print(f"EmployerView: Employer with id {id} not found")
            return Response({"error": "Employer not found"}, status=status.HTTP_404_NOT_FOUND)


class StatusView(APIView):
    permission_classes = [AllowAny]
    def post(self,request):
        print(request.data)
        id= request.data.get('id')
        action = request.data.get('action')
        try:
            candidate = Candidate.objects.get(id=id)
            user = User.objects.get(id=candidate.user.id)
        except:
            employe = Employer.objects.get(id=id)
            user = User.objects.get(id=employe.user.id)
        print(user)
        if user:
            if action == 'block':
                user.is_active = False
                user.save()
            else:
                user.is_active = True
                user.save()
            return Response({"message":"User Status Changed"},status=status.HTTP_200_OK)
        





class AdminGetAllJobs(APIView):
    permission_classes = [AllowAny]  # Adjust permissions as needed
    
    def get(self, request):
        try:
            # Get all jobs, with optional filters from query params
            jobs = Jobs.objects.all()
            
            # Allow filtering by active status if provided in query params
            active_status = request.query_params.get('active')
            if active_status is not None:
                active_status = active_status.lower() == 'true'
                jobs = jobs.filter(active=active_status)
                
            serializer = AdminJobSerializer(jobs, many=True)
            return Response(serializer.data, status=status.HTTP_200_OK)
        except Exception as e:
            print(e)
            return Response(
                {"error": str(e)}, 
                status=status.HTTP_500_INTERNAL_SERVER_ERROR
            )
class AdminGetJobDetail(APIView):
    permission_classes = [AllowAny]  # Adjust permissions as needed
    
    def get(self, request, job_id):
        try:    
            job = Jobs.objects.get(id=job_id)
            serializer = AdminJobSerializer(job)
            return Response(serializer.data, status=status.HTTP_200_OK)
        except Jobs.DoesNotExist:
            return Response(
                {"error": "Job not found"}, 
                status=status.HTTP_404_NOT_FOUND
            )
        except Exception as e:
            return Response(
                {"error": str(e)}, 
                status=status.HTTP_500_INTERNAL_SERVER_ERROR
            )
class AdminJobModeration(APIView):
    permission_classes = [AllowAny]  # Adjust permissions as needed
    
    def post(self, request, job_id):
        action = request.data.get('action')
        reason = request.data.get('reason', '')
        
        if action not in ['deactivate', 'activate', 'delete']:
            return Response(
                {"error": "Invalid action. Use 'activate', 'deactivate', or 'delete'."},
                status=status.HTTP_400_BAD_REQUEST
            )
            
        try:
            job = Jobs.objects.get(id=job_id)
            
            if action == 'deactivate':
                job.active = False
                job.moderation_note = reason
                job.save()
                message = "Job deactivated successfully"
            elif action == 'activate':
                job.active = True
                job.moderation_note = reason
                job.save()
                message = "Job activated successfully"
            elif action == 'delete':
                job.delete()
                message = "Job deleted successfully"
                
            # Return the updated job details (if not deleted)
            if action != 'delete':
                serializer = AdminJobSerializer(job)
                return Response({"message": message, "job": serializer.data}, status=status.HTTP_200_OK)
            else:
                return Response({"message": message}, status=status.HTTP_200_OK)
                
        except Jobs.DoesNotExist:
            return Response(
                {"error": "Job not found"},
                status=status.HTTP_404_NOT_FOUND
            )
        except Exception as e:
            return Response(
                {"error": str(e)},
                status=status.HTTP_500_INTERNAL_SERVER_ERROR
            )