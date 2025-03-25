from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from .serializer import *
from user_account.models import *
from chat.models import *
from rest_framework.permissions import IsAuthenticated,AllowAny
from channels.layers import get_channel_layer
from asgiref.sync import async_to_sync














from rest_framework import generics
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





class PostJob(APIView):
    permission_classes = [IsAuthenticated]
    def post(self,request):
        print(request)
        user=request.user
        employer=Employer.objects.get(user=user)
        jobs =Jobs.objects.create(employer=employer)
        data = request.data.dict()
        # questions_data = []

        # for key in list(data.keys()):
        #     if key.startswith('questions'):
        #         questions_data.append(data.pop(key))       
        print(request.data)
        print(data)
        # print(questions_data)
        serializer=PostJobSerializer(jobs,data=request.data)
        try:
            if serializer.is_valid():
                serializer.save()
                # if questions_data:
                #     for data in questions_data:
                #         Question.objects.create(job=jobs,text=data)
                return Response({"message": "job posted successfull."}, status=status.HTTP_200_OK)
        except:
            return Response({"message":"some thing went wrong pleas do it again"},status=status.HTTP_203_NON_AUTHORITATIVE_INFORMATION)
        
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

class GetJob(APIView):
    permission_classes = [IsAuthenticated]
    def get(self,request):
        print("ayyyyyyyyoooooooooooo")
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
            jobs=Jobs.objects.filter(active=True)
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
        
class GetQuestions(APIView):
    permission_classes = [IsAuthenticated]
    def get(self,request,job_id):
        print(job_id)
        try:
            questions=Question.objects.filter(job=job_id)
            print(questions)
            serializer=QuestionSerializer(questions, many=True)
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
        


class Applyjob(APIView):
    permission_classes=[AllowAny]
    def post(self,request,job_id):
        print(job_id)
        print(request.data)
        userId = request.data.get('userid')
        print(userId)
        try:
            job = Jobs.objects.get(id=job_id)
            candidate = Candidate.objects.get(id=userId)
        except:
            return Response(status=status.HTTP_404_NOT_FOUND)
        if ApplyedJobs.objects.filter(candidate=candidate, job=job).exists():
                return Response({"message": "You have already applied for this job"}, status=status.HTTP_200_OK)
        
        ApplyedJobs.objects.create(candidate=candidate, job=job)
        
        return Response({"message": "You have Successfully applyed the job"},status=status.HTTP_200_OK)
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
        

        
class ProfileView(APIView):
    permission_classes =[IsAuthenticated]
    def get(self,request):
        user = request.user
        try:
            candidate=Candidate.objects.get(user=user)
            serializer=CandidateSerializer(candidate)
            return Response({'data': serializer.data}, status=status.HTTP_200_OK)
        except:
            try:
                employer = Employer.objects.get(user=user)
                serializer = EmployerSerializer(employer)
                return Response({'data': serializer.data}, status=status.HTTP_200_OK)
            except:
                return Response({"message": "User not found"},  status=status.HTTP_203_NON_AUTHORITATIVE_INFORMATION)

        
       
        
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
        
class ApplicationStatusView(APIView):
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
            return Response ({"error":str(e)},status=status.HTTP_404_NOT_FOUND)


class AddRoles(APIView):
    permission_classes = [IsAuthenticated]
    def post(self, request):
        # Fetch the employer associated with the request user
        try:
            employer = Employer.objects.get(user=request.user)
        except Employer.DoesNotExist:
            return Response({"error": "Employer not found."}, status=status.HTTP_404_NOT_FOUND)

        
        roles_data = request.data.get('roles', [])
        
        if not roles_data:
            return Response({"error": "No roles data provided."}, status=status.HTTP_400_BAD_REQUEST)

        print("Received roles data:", roles_data) 

     
        errors = []
        for role_data in roles_data:
            serializer = RoleSerializer(data=role_data)
            if serializer.is_valid():
                Roles.objects.create(employer=employer, **serializer.validated_data)
            else:
                errors.append(serializer.errors)
        
        if errors:
            print("Validation errors:", errors)  
            return Response(errors, status=status.HTTP_400_BAD_REQUEST)

        return Response({"message": "Roles added successfully."}, status=status.HTTP_200_OK)
class PostJob(APIView):
    permission_classes = [IsAuthenticated]
    def post(self,request):
        print(request)
        user=request.user
        employer=Employer.objects.get(user=user)
        jobs =Jobs.objects.create(employer=employer)
        data = request.data.dict()
        # questions_data = []

        # for key in list(data.keys()):
        #     if key.startswith('questions'):
        #         questions_data.append(data.pop(key))       
        print(request.data)
        print(data)
        # print(questions_data)
        serializer=PostJobSerializer(jobs,data=request.data)
        try:
            if serializer.is_valid():
                serializer.save()
                # if questions_data:
                #     for data in questions_data:
                #         Question.objects.create(job=jobs,text=data)
                return Response({"message": "job posted successfull."}, status=status.HTTP_200_OK)
        except:
            return Response({"message":"some thing went wrong pleas do it again"},status=status.HTTP_203_NON_AUTHORITATIVE_INFORMATION)
        
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

class GetJob(APIView):
    permission_classes = [IsAuthenticated]
    def get(self,request):
        print("ayyyyyyyyoooooooooooo")
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
            jobs=Jobs.objects.filter(active=True)
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
        
class GetQuestions(APIView):
    permission_classes = [IsAuthenticated]
    def get(self,request,job_id):
        print(job_id)
        try:
            questions=Question.objects.filter(job=job_id)
            print(questions)
            serializer=QuestionSerializer(questions, many=True)
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
        


class Applyjob(APIView):
    permission_classes=[AllowAny]
    def post(self,request,job_id):
        print(job_id)
        print(request.data)
        userId = request.data.get('userid')
        print(userId)
        try:
            job = Jobs.objects.get(id=job_id)
            candidate = Candidate.objects.get(id=userId)
        except:
            return Response(status=status.HTTP_404_NOT_FOUND)
        if ApplyedJobs.objects.filter(candidate=candidate, job=job).exists():
                return Response({"message": "You have already applied for this job"}, status=status.HTTP_200_OK)
        
        ApplyedJobs.objects.create(candidate=candidate, job=job)
        
        return Response({"message": "You have Successfully applyed the job"},status=status.HTTP_200_OK)
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
        

        
class ProfileView(APIView):
    permission_classes =[IsAuthenticated]
    def get(self,request):
        user = request.user
        try:
            candidate=Candidate.objects.get(user=user)
            serializer=CandidateSerializer(candidate)
            return Response({'data': serializer.data}, status=status.HTTP_200_OK)
        except:
            try:
                employer = Employer.objects.get(user=user)
                serializer = EmployerSerializer(employer)
                return Response({'data': serializer.data}, status=status.HTTP_200_OK)
            except:
                return Response({"message": "User not found"},  status=status.HTTP_203_NON_AUTHORITATIVE_INFORMATION)

        
       
        
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
        
class ApplicationStatusView(APIView):
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
            return Response ({"error":str(e)},status=status.HTTP_404_NOT_FOUND)


