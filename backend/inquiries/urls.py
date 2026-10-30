from django.urls import path
from .views import *

urlpatterns = [
    path("submit/", submit_inquiry, name="submit_inquiry"),
    path("admin/login/", admin_login, name="admin_login"),
    path("admin/inquiries/", get_inquiries, name="get_inquiries"),
    path(
        "admin/inquiries/<int:inquiry_id>/status/",
        update_inquiry_status,
        name="update_inquiry_status"
    ),
]