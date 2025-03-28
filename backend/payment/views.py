from django.shortcuts import render
from django.conf import settings
from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt
from django.utils.decorators import method_decorator
import json
import razorpay
from rest_framework.views import APIView
from rest_framework.permissions import IsAuthenticated
from .models import Payment
from user_account.models import Employer
from Empjob.models import Jobs

# Initialize Razorpay client
razorpay_client = razorpay.Client(auth=(settings.RAZORPAY_KEY_ID, settings.RAZORPAY_KEY_SECRET))

class CreatePaymentView(APIView):
    permission_classes = [IsAuthenticated]
    
    def post(self, request):
        try:
            # Verify user is an employer
            if request.user.user_type != 'employer':
                return JsonResponse({"success": False, "message": "Only employers can post jobs"}, status=403)
                
            data = request.data
            amount = 200 * 100  # Fixed amount of ₹200 in paisa
            employer_id = data.get("employer_id")
            
            if not employer_id:
                return JsonResponse({"success": False, "message": "Missing employer ID"}, status=400)
            
            try:
                employer = Employer.objects.get(user=request.user)
            except Employer.DoesNotExist:
                return JsonResponse({"success": False, "message": "Employer profile not found"}, status=404)
            
            print(f"Creating order for Employer: {employer_id}, Amount: {amount}")
            
            order_data = {
                "amount": amount,
                "currency": "INR",
                "payment_capture": "1",
                "notes": {
                    "employer_id": employer_id,
                    "purpose": "job_post_payment"
                }
            }
            
            order = razorpay_client.order.create(order_data)
            return JsonResponse(order)
        
        except Exception as e:
            print(f"Error creating order: {e}")
            return JsonResponse({"success": False, "error": str(e)}, status=500)

class VerifyPaymentView(APIView):
    permission_classes = [IsAuthenticated]
    
    def post(self, request):
        try:
            # Verify user is an employer
            if request.user.user_type != 'employer':
                return JsonResponse({"success": False, "message": "Only employers can post jobs"}, status=403)
                
            data = request.data
            payment_id = data.get("payment_id")
            order_id = data.get("order_id")
            signature = data.get("signature")
            job_id = data.get("job_id", None)  # Optional for future job reference
            transaction_id = data.get("transaction_id")
            payment_method = data.get("method")
            
            print(f"Verifying payment for Employer: {request.user.id}, Method: {payment_method}")
            
            if not payment_id or not order_id or not signature:
                return JsonResponse({"success": False, "message": "Missing payment details"}, status=400)
            
            params_dict = {
                "razorpay_order_id": order_id,
                "razorpay_payment_id": payment_id,
                "razorpay_signature": signature,
            }
            
            try:
                razorpay_client.utility.verify_payment_signature(params_dict)
                payment_verified = True
            except razorpay.errors.SignatureVerificationError as e:
                print(f"Payment verification failed: {e}")
                return JsonResponse({"success": False, "message": "Invalid payment signature"}, status=400)
            
            if payment_verified:
                employer = Employer.objects.get(user=request.user)
                job = None
                if job_id:
                    try:
                        job = Jobs.objects.get(id=job_id, employer=employer)
                    except Jobs.DoesNotExist:
                        pass
                
                # Save payment details in the database
                payment = Payment.objects.create(
                    user=request.user,
                    employer=employer,
                    job=job,
                    amount=200,  # Fixed amount of ₹200
                    method=payment_method or "unknown",
                    transaction_id=transaction_id,
                    status="success",
                )
                
                return JsonResponse({
                    "success": True, 
                    "message": "Payment verified successfully!",
                    "payment_id": payment.id
                })
        
        except Exception as e:
            print(f"Error in payment verification: {e}")
            return JsonResponse({"success": False, "error": str(e)}, status=500)
        
        return JsonResponse({"success": False, "message": "Invalid request"}, status=400)