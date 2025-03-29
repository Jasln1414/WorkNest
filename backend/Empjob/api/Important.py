from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated,AllowAny
from rest_framework import status
from .serializer import *
from user_account.models import *
from Empjob.models import *
from payment.models import *



from django.middleware.csrf import get_token
from django.http import JsonResponse

def csrf_token_view(request):
    token = get_token(request)
    return JsonResponse({'csrfToken': token})

import razorpay
from django.conf import settings

# Initialize client correctly
razorpay_client = razorpay.Client(auth=(settings.RAZORPAY_KEY_ID, settings.RAZORPAY_KEY_SECRET))




import logging

logger = logging.getLogger(__name__)
razorpay_client = razorpay.Client(auth=(settings.RAZORPAY_KEY_ID, settings.RAZORPAY_KEY_SECRET))

import logging
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from rest_framework.permissions import IsAuthenticated
import razorpay

from django.conf import settings

logger = logging.getLogger(__name__)
razorpay_client = razorpay.Client(auth=(settings.RAZORPAY_KEY_ID, settings.RAZORPAY_KEY_SECRET))

import logging
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from rest_framework.permissions import IsAuthenticated
import razorpay

from django.conf import settings

logger = logging.getLogger(__name__)
razorpay_client = razorpay.Client(auth=(settings.RAZORPAY_KEY_ID, settings.RAZORPAY_KEY_SECRET))

class PostJob(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request):
        try:
            user = request.user
            if user.user_type != 'employer':
                return Response({"error": "Only employers can post jobs"}, status=status.HTTP_403_FORBIDDEN)

            employer = Employer.objects.get(user=user)
            job_count = Jobs.objects.filter(employer=employer).count()

            if job_count >= 2:
                # Check if a successful payment exists instead of re-verifying
                if 'razorpay_payment_id' not in request.data:
                    order = razorpay_client.order.create({
                        "amount": 200 * 100,
                        "currency": "INR",
                        "payment_capture": 1
                    })
                    return Response({
                        "payment_required": True,
                        "message": "Payment required for additional job postings",
                        "order_id": order['id'],
                        "amount": order['amount'],
                        "key": settings.RAZORPAY_KEY_ID
                    }, status=status.HTTP_402_PAYMENT_REQUIRED)

                # Check if payment is recorded
                payment_id = request.data['razorpay_payment_id']
                if not Payment.objects.filter(
                    transaction_id=payment_id,
                    employer=employer,
                    status='success'
                ).exists():
                    return Response({"error": "Invalid or unverified payment"}, status=status.HTTP_400_BAD_REQUEST)

            serializer = PostJobSerializer(data=request.data, context={'employer': employer})
            if serializer.is_valid():
                job = serializer.save()
                return Response({"message": "Job posted successfully"}, status=status.HTTP_201_CREATED)
            logger.error(f"Serializer errors: {serializer.errors}")
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

        except Employer.DoesNotExist:
            return Response({"error": "Employer profile not found"}, status=status.HTTP_404_NOT_FOUND)
        except Exception as e:
            logger.error(f"Unexpected error: {str(e)}")
            return Response({"error": "An unexpected error occurred"}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)




"""class PostJob(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request):
        try:
            user = request.user
            employer = Employer.objects.get(user=user)
            
            # Ensure request data is mutable
            request_data = request.data.copy()
            
            serializer = PostJobSerializer(
                data=request_data,
                context={'employer': employer}
            )
            
            if serializer.is_valid():
                serializer.save()
                return Response(
                    {"message": "Job posted successfully with questions."},
                    status=status.HTTP_201_CREATED
                )
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
            
        except Employer.DoesNotExist:
            return Response(
                {"message": "Employer not found for this user."},
                status=status.HTTP_404_NOT_FOUND
            )
        except Exception as e:
            return Response(
                {"message": f"An error occurred: {str(e)}"},
                status=status.HTTP_500_INTERNAL_SERVER_ERROR
            )"""
        
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
    permission_classes = [IsAuthenticated]

    def get(self, request):
        try:
            # Check if the user is an employer
            if request.user.user_type == "employer":
                # Fetch the employer instance linked to the user
                employer = Employer.objects.get(user=request.user)
                # Filter jobs by the employer
                jobs = Jobs.objects.filter(employer=employer)
            else:
                # User is a candidate or admin: return all jobs
                jobs = Jobs.objects.all()

            # Debugging: Print the jobs queryset
            print("Jobs Queryset:", jobs)

            serializer = JobSerializer(jobs, many=True)
            return Response(serializer.data, status=status.HTTP_200_OK)
        except Employer.DoesNotExist:
            return Response({"error": "Employer profile not found"}, status=status.HTTP_404_NOT_FOUND)
        except Exception as e:
            print("Error:", e)
            return Response({"error": str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
        



from django.views.decorators.csrf import ensure_csrf_cookie
from django.http import JsonResponse

@ensure_csrf_cookie
def get_csrf_token(request):
    return JsonResponse({'detail': 'CSRF cookie set'})


import os






class GetJobDetail(APIView):
    permission_classes = [IsAuthenticated]
    def get(self,request,job_id):
        try:    
            job=Jobs.objects.get(id=job_id)
            
            serializer=JobSerializer(job)
         
           
            return Response(serializer.data,status=status.HTTP_200_OK)
        except:
            return Response(status=status.HTTP_203_NON_AUTHORITATIVE_INFORMATION)
        








class GetApplyedjob(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        print("GetApplyedjob view called")  # Debugging line
        user = request.user
        print("User:", user)  # Debugging line
        try:
            candidate = Candidate.objects.get(user=user)
            print("Candidate:", candidate)  # Debugging line
            applied_jobs = ApplyedJobs.objects.filter(candidate=candidate)
            print("Applied Jobs:", applied_jobs)  # Debugging line
            serializer = ApplyedJobSerializer(applied_jobs, many=True)
            print("Serialized Data:", serializer.data)  # Debugging line
            return Response(serializer.data, status=status.HTTP_200_OK)
        except Candidate.DoesNotExist:
            print("Candidate not found")  # Debugging line
            return Response({"message": "Candidate not found"}, status=404)
        except Exception as e:
            print("Error:", str(e))  # Debugging line
            return Response({"message": str(e)}, status=500)






class GetApplicationjob(APIView):
    permission_classes=[IsAuthenticated]
    def get(self, request):
        user=request.user
        try:
            employer=Employer.objects.get(user=user)
            jobs = Jobs.objects.filter(employer=employer,active=True)  
            serializer = ApplicationSerializer(jobs, many=True)
            return Response({'data': serializer.data}, status=status.HTTP_200_OK)
        except Exception as e:
            return Response({'error': str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)    





        


from rest_framework import generics
from django_filters.rest_framework import DjangoFilterBackend, # type: ignore



from rest_framework import generics


from django_filters import rest_framework as filters # type: ignore

from django.db.models import Q




from django.db.models import Q
import logging

logger = logging.getLogger(__name__)

class JobFilter(filters.FilterSet):
    search = filters.CharFilter(method='filter_search', label='Search')
    location = filters.CharFilter(lookup_expr='icontains')
    jobtype = filters.CharFilter(lookup_expr='iexact')
    experience = filters.CharFilter(lookup_expr='iexact')  # Case-insensitive exact match
    lpa = filters.CharFilter(method='filter_lpa')
    employer = filters.NumberFilter(field_name='employer__id')
    industry = filters.CharFilter(lookup_expr='icontains')
    
    class Meta:
        model = Jobs
        fields = ['search', 'location', 'jobtype', 'experience', 'lpa', 'employer', 'industry']
    
    def filter_search(self, queryset, name, value):
        logger.info(f"Filtering search with value: {value}")
        return queryset.filter(
            Q(title__icontains=value) |
            Q(about__icontains=value) |
            Q(responsibility__icontains=value)
        )
    
    def filter_lpa(self, queryset, name, value):
        logger.info(f"Filtering LPA with value: {value}")
        if not value:
            return queryset
        try:
            min_lpa, max_lpa = map(int, value.split('-'))
            return queryset.filter(lpa=value)  # Temporary: exact match for debugging
        except ValueError:
            return queryset.filter(lpa=value)
    
    def filter_queryset(self, queryset):
        logger.info(f"Initial queryset count: {queryset.count()}")
        logger.info(f"Filter params: {self.form.data}")
        try:
            filtered_queryset = super().filter_queryset(queryset)
            logger.info(f"Filtered queryset count: {filtered_queryset.count()}")
            return filtered_queryset
        except Exception as e:
            logger.error(f"Filter error: {str(e)}")
            raise       
from rest_framework import generics, status
from rest_framework.response import Response
from django_filters.rest_framework import DjangoFilterBackend # type: ignore
from .models import Jobs # type: ignore

from .filters import JobFilter # type: ignore
import logging

logger = logging.getLogger(__name__)

class JobSearchView(generics.ListAPIView):
    queryset = Jobs.objects.all().order_by('-posteDate')
    serializer_class = JobSerializer
    filter_backends = [DjangoFilterBackend]
    filterset_class = JobFilter

    def list(self, request, *args, **kwargs):
        try:
            return super().list(request, *args, **kwargs)
        except Exception as e:
            logger.error(f"Error in JobSearchView: {str(e)}", exc_info=True)
            return Response({"detail": str(e)}, status=status.HTTP_400_BAD_REQUEST)

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






class SavejobStatus(APIView):
    permission_classes= [IsAuthenticated]
    def post(self,request,job_id):
        action = request.data.get('action')
        user = request.user
        try:
            job = Jobs.objects.get(id=job_id)
            candidate= Candidate.objects.get(user=user)
            if action == 'save':

                if not SavedJobs.objects.filter(candidate=candidate, job=job).exists():
                    SavedJobs.objects.create(candidate=candidate, job=job)
                    return Response({"message": "Job saved successfully"}, status=status.HTTP_201_CREATED)
                else:
                    return Response({"message": "Job is already saved"}, status=status.HTTP_200_OK)

            elif action == 'unsave':
                saved_job = SavedJobs.objects.filter(candidate=candidate, job=job).first()
                if saved_job:
                    saved_job.delete()
                    return Response({"message": "Job unsaved successfully"}, status=status.HTTP_200_OK)
                else:
                    return Response({"message": "Job is not saved"}, status=status.HTTP_404_NOT_FOUND)

            else:
                return Response({"message": "Invalid action"}, status=status.HTTP_400_BAD_REQUEST)

        except Jobs.DoesNotExist:
            return Response({"message": "Job not found"}, status=status.HTTP_404_NOT_FOUND)
        except Candidate.DoesNotExist:
            return Response({"message": "Candidate not found"}, status=status.HTTP_404_NOT_FOUND)
        except Exception as e:
            return Response({"message": str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)



class SavedJobsView(APIView):
    permission_classes=[IsAuthenticated]
    def get(self,request):
        user=request.user
        try:
            candidate=Candidate.objects.get(user=user)
            savedjobs=SavedJobs.objects.filter(candidate=candidate)
            serializer=SavedJobSerializer(savedjobs , many=True)
            if serializer.data:
                 return Response({'data': serializer.data}, status=status.HTTP_200_OK)
            else:
                return Response({'message':"no saved jobs"}, status=status.HTTP_203_NON_AUTHORITATIVE_INFORMATION)
        except Exception as e:
            return Response({"error": str(e)},status=status.HTTP_500_INTERNAL_SERVER_ERROR)


class GetApplyedjob(APIView):
    permission_classes=[IsAuthenticated]
    def get(self,request):
        user = request.user
        try:
            candidate = Candidate.objects.get(user=user)
            applied_jobs = ApplyedJobs.objects.filter(candidate=candidate)
            serializer = ApplyedJobSerializer(applied_jobs, many=True)
            return Response(serializer.data, status=status.HTTP_200_OK)
        except Candidate.DoesNotExist:
            return Response({"message": "Candidate not found"}, status=404)
        except Exception as e:
            return Response({"message": str(e)}, status=500)
        
class GetApplicationjob(APIView):
    permission_classes=[IsAuthenticated]
    def get(self, request):
        user=request.user
        try:
            employer=Employer.objects.get(user=user)
            jobs = Jobs.objects.filter(employer=employer,active=True)  
            serializer = ApplicationSerializer(jobs, many=True)
            return Response({'data': serializer.data}, status=status.HTTP_200_OK)
        except Exception as e:
            return Response({'error': str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)   
        
class ApplicationStatusView(APIView):
    permission_classes = [IsAuthenticated]
    def post(self, request, job_id):
        action = request.data.get('action')
        try:
            applied_job = ApplyedJobs.objects.get(id=job_id)
            if applied_job:
                applied_job.status = action  # e.g., "Accepted", "Rejected"
                applied_job.save()
                return Response({"message": "Status changed"}, status=status.HTTP_200_OK)
            else:
                return Response({"message": "No job available"}, status=status.HTTP_204_NO_CONTENT)
        except ApplyedJobs.DoesNotExist:
            return Response({"error": "Job application not found"}, status=status.HTTP_404_NOT_FOUND)
        except Exception as e:
            return Response({"error": str(e)}, status=status.HTTP_400_BAD_REQUEST)



"""class ApplicationStatusView(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request, job_id):
        action = request.data.get('action')
        try:
            applied_job = ApplyedJobs.objects.get(id=job_id)
            if applied_job:
                # Update the status based on the action
                applied_job.status = action
                applied_job.save()

                return Response({"message": "Status changed"}, status=status.HTTP_200_OK)
            else:
                return Response({"message": "No job available"}, status=status.HTTP_204_NO_CONTENT)
        except ApplyedJobs.DoesNotExist:
            return Response({"error": "Job application not found"}, status=status.HTTP_404_NOT_FOUND)
        except Exception as e:
            return Response({"error": str(e)}, status=status.HTTP_400_BAD_REQUEST)"""
        
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from rest_framework import status
from .serializer import *
from user_account.models import *
from Empjob.models import *

class GetQuestions(APIView):
    permission_classes = [IsAuthenticated]
    def get(self, request, job_id):
        print(job_id)
        try:
            questions = Question.objects.filter(job=job_id)
            print(questions)
            serializer = QuestionSerializer(questions, many=True)
            return Response(serializer.data, status=status.HTTP_200_OK)
        except:
            return Response(status=status.HTTP_203_NON_AUTHORITATIVE_INFORMATION)

class Applyjob(APIView):
    permission_classes = [IsAuthenticated]
    def post(self, request, job_id):
        print('Job ID:', job_id)
        print('Request Data:', request.data)
        user = request.user
        try:
            job = Jobs.objects.get(id=job_id)
            candidate = Candidate.objects.get(user=user)
            if ApplyedJobs.objects.filter(candidate=candidate, job=job).exists():
                return Response({'message': 'You have already applied for this job.'}, status=status.HTTP_200_OK)

            application = ApplyedJobs.objects.create(candidate=candidate, job=job)
            answers_data = request.data.get('answers', [])
            for answer in answers_data:
                question_id = answer.get('question')
                answer_text = answer.get('answer_text')
                try:
                    question = Question.objects.get(id=question_id, job=job)
                    Answer.objects.create(
                        candidate=candidate,
                        question=question,
                        answer_text=answer_text
                    )
                except Question.DoesNotExist:
                    return Response({'message': f'Question {question_id} not found.'}, status=status.HTTP_400_BAD_REQUEST)

            return Response({'message': 'You have successfully applied for the job.'}, status=status.HTTP_200_OK)
        except Jobs.DoesNotExist:
            return Response({'message': 'Job not found.'}, status=status.HTTP_404_NOT_FOUND)
        except Candidate.DoesNotExist:
            return Response({'message': 'Candidate not found.'}, status=status.HTTP_404_NOT_FOUND)
        except Exception as e:
            return Response({'message': str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)


# jobs/views.py
from rest_framework import status
from rest_framework.decorators import api_view, permission_classes


@api_view(['GET'])
@permission_classes([IsAuthenticated])
def check_application(request, job_id):
    # Check if the authenticated candidate has applied to the job
    has_applied = ApplyedJobs.objects.filter(job_id=job_id, candidate__user=request.user).exists()
    return Response({"has_applied": has_applied})




"""# jobs/views.py
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from rest_framework import status

from user_account.models import Candidate

@api_view(['GET'])
@permission_classes([IsAuthenticated])
def check_saved(request, job_id):
    try:
        if not Jobs.objects.filter(id=job_id).exists():
            return Response({"error": "Job not found"}, status=status.HTTP_404_NOT_FOUND)
        candidate = Candidate.objects.get(user=request.user)
        is_saved = SavedJobs.objects.filter(job_id=job_id, candidate=candidate).exists()
        return Response({"is_saved": is_saved}, status=status.HTTP_200_OK)
    except Candidate.DoesNotExist:
        return Response({"error": "Candidate profile not found for this user"}, status=status.HTTP_404_NOT_FOUND)
    except Exception as e:
        return Response({"error": f"An unexpected error occurred: {str(e)}"}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

# Debug: Confirm view is loaded
print("check_saved view loaded")"""