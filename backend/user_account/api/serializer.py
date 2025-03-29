from rest_framework import serializers
from user_account.models import User,Education,Candidate,Employer
from django.contrib.auth.hashers import make_password
from .email import  *

class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        exclude = ('password',)
        
class CandidateSerializer(serializers.ModelSerializer):
    profile_pic = serializers.SerializerMethodField()

    class Meta:
        model = Candidate
        fields = '__all__'

    def get_profile_pic(self, obj):
        if obj.profile_pic:
            request = self.context.get('request')
            return request.build_absolute_uri(obj.profile_pic.url)
        return None

class EmployerSerializer(serializers.ModelSerializer):
    profile_pic = serializers.SerializerMethodField()

    class Meta:
        model = Employer
        fields = '__all__'

    def get_profile_pic(self, obj):
        if obj.profile_pic:
            request = self.context.get('request')
            return request.build_absolute_uri(obj.profile_pic.url)
        return None

class CandidateRegisterSerializer(serializers.ModelSerializer):
    class Meta:
        model=User
        fields=["id","full_name","email","password"]
        extra_kwargs={
            'password':{'write_only':True,
                        'required':True}
        }
    def create(self, validated_data):
        password = validated_data.pop('password', None)
        instance = self.Meta.model(**validated_data)

        if password is not None:
            instance.set_password(password)
            instance.user_type = "candidate"
            instance.save()  # Save the user first
            
            # Now send the OTP after the user is saved
            try:
                send_otp_via_mail(instance.email)
            except Exception as e:
                logger.error(f"Error sending OTP during registration: {e}")
                
            return instance
class EmployerRegisterSerializer(serializers.ModelSerializer):
    
    class Meta(CandidateRegisterSerializer.Meta):
        fields=CandidateRegisterSerializer.Meta.fields

    def create(self, validated_data):
        password = validated_data.pop('password', None)
        instance = self.Meta.model(**validated_data)

        if password is not None:
            instance.set_password(password)
            instance.user_type = "employer"
            instance.save()  # Save the user first
            
            # Now send the OTP after the user is saved
            try:
                send_otp_via_mail(instance.email)
            except Exception as e:
                logger.error(f"Error sending OTP during registration: {e}")
                
            return instance
        

class OtpVerificationSerializer(serializers.Serializer):
    email=serializers.EmailField()
    otp=serializers.CharField(max_length=6)

class EducationSerializer(serializers.ModelSerializer):
    class Meta:
        model = Education
        fields = ['education', 'college', 'specilization', 'completed', 'mark']

class CandidateProfileSerializer(serializers.ModelSerializer):
    
    class Meta:
        model = Candidate
        fields = ['phone','place', 'dob', 'Gender', 'profile_pic', 'skills', 'resume', 'linkedin', 'github']

    def update(self, instance, validated_data):
    
        # Update candidate instance with other validated data
        for attr, value in validated_data.items():
            setattr(instance, attr, value)

        instance.completed = True
        instance.save()

        return instance

class EmployerProfileSerializer(serializers.ModelSerializer):
    class Meta:
        model=Employer
        exclude = ('user','completed')
    
    def create(self,instance,validated_data):
        
        for attr,value in validated_data.items():
            setattr(instance,attr,value)
        
        instance.completed = True
        instance.save()

        return instance


class ResetPasswordSerializer(serializers.ModelSerializer):
    password = serializers.CharField(max_length=128)

    class Meta:
        model = User
        fields = ['password']

    def update(self, instance, validated_data):
        password = validated_data.get('password')
        id=validated_data.get('id')
        try:
            if password & id:
                instance.set_password(password)
                instance.save()
        except Exception as e:
            print("error",e)
        
        return instance