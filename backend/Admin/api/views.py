from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from rest_framework.permissions import AllowAny
from django.shortcuts import get_object_or_404
from account.models import User
from Empjob.models import Candidate, Employer, Jobs
from .serializer import CandidateDetailSerializer, EmployerDetailsSerializer, CandidateSerializer, EmployerSerializer
import logging

logger = logging.getLogger(__name__)


from rest_framework import status
from rest_framework.permissions import IsAuthenticated
from django.core.cache import cache
from django.db import DatabaseError
import logging


logger = logging.getLogger(__name__)

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