from django.urls import path
from .views import CreatePaymentView, VerifyPaymentView

urlpatterns = [
    path("create-payment/", CreatePaymentView.as_view(), name="create_order"),
    path("verify-payment/", VerifyPaymentView.as_view(), name="verify-payment"),
]