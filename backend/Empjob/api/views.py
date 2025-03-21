from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated,AllowAny
from rest_framework import status
from .serializer import *
from user_account.models import *



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
        



class Applyjob(APIView):
    permission_classes = [IsAuthenticated]  # Ensure the user is authenticated

    def post(self, request, job_id):
        print('Job ID:', job_id)  # Debugging
        print('Request Data:', request.data)  # Debugging

        user = request.user  # Get the authenticated user
        userid = user.id  # Get the user ID from the authenticated user

        print('User ID:', userid)  # Debugging

        try:
            job = Jobs.objects.get(id=job_id)
            candidate = Candidate.objects.get(user=user)  # Get candidate associated with the user
        except Jobs.DoesNotExist:
            return Response({'message': 'Job not found.'}, status=status.HTTP_404_NOT_FOUND)
        except Candidate.DoesNotExist:
            return Response({'message': 'Candidate not found.'}, status=status.HTTP_404_NOT_FOUND)
        except Exception as e:
            return Response({'message': str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

        if ApplyedJobs.objects.filter(candidate=candidate, job=job).exists():
            return Response({'message': 'You have already applied for this job.'}, status=status.HTTP_200_OK)

        ApplyedJobs.objects.create(candidate=candidate, job=job)
        return Response({'message': 'You have successfully applied for the job.'}, status=status.HTTP_200_OK)




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
from django_filters.rest_framework import DjangoFilterBackend, FilterSet, CharFilter, NumberFilter  # type: ignore # typo error



from rest_framework import generics


class JobFilter(FilterSet):
    search = CharFilter(method='filter_search', label='Search')
    location = CharFilter(lookup_expr='icontains')
    jobtype = CharFilter(lookup_expr='iexact')
    experience = NumberFilter(lookup_expr='exact')
    lpa = NumberFilter(lookup_expr='exact')
    employer = NumberFilter(field_name='employer__id')
    industry = CharFilter(lookup_expr='icontains')
    
    class Meta:
        model = Jobs
        fields = ['search', 'location', 'jobtype', 'experience', 'lpa', 'employer', 'industry']
    
    def filter_search(self, queryset, name, value):
        return queryset.filter(
            title__icontains=value
        ) | queryset.filter(
            about__icontains=value
        ) | queryset.filter(
            responsibility__icontains=value
        )
       
# JobSearchView for searching/filtering jobs
class JobSearchView(generics.ListAPIView):
    queryset = Jobs.objects.all().order_by('-posteDate')
    serializer_class = JobSerializer
    filter_backends = [DjangoFilterBackend]
    filterset_class = JobFilter  # Use the inline filter class




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
        

        

       
        

        
"""class ApplicationStatusView(APIView):
    permission_classes=[IsAuthenticated]
    def post(self,request,job_id):
        action = request.data.get('action')
        try:
            applyedjob=ApplyedJobs.objects.get(id=job_id)
            if applyedjob:
                applyedjob.status = action
                applyedjob.save()

                message = f'The status of your application for job {job_id} has been changed to {action}.'
                CandidateNotification.objects.create(
                    user=applyedjob.candidate,
                    message=message
                )

                channel_layer = get_channel_layer()
                async_to_sync(channel_layer.group_send)(
                    f'notifications_{applyedjob.candidate.id}',  
                    {
                        'type': 'send_notification',
                        'message': f'The status of your application for job {job_id} has been changed to {action}.'
                    }
                )

                return Response({"message":"Status changed"},status=status.HTTP_200_OK)
            else:
                return Response({"message":"no job available"},status=status.HTTP_203_NON_AUTHORITATIVE_INFORMATION)
        except Exception as e:
            return Response ({"error":str(e)},status=status.HTTP_404_NOT_FOUND)"""


