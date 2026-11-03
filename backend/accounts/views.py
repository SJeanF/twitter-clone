from django.contrib.auth.models import User
from rest_framework import generics
from rest_framework.permissions import AllowAny

from rest_framework.parsers import MultiPartParser, FormParser, JSONParser
from .models import Profile
from .serializers import RegisterSerializer, ProfileSerializer


class RegisterView(generics.CreateAPIView):
    queryset = User.objects.all()
    serializer_class = RegisterSerializer
    permission_classes = [AllowAny]

class MyProfileView(generics.RetrieveUpdateAPIView):
    serializer_class = ProfileSerializer
    parser_classes = [MultiPartParser, FormParser, JSONParser]

    def get_object(self):
        # get_or_create cobre usuários criados antes do signal existir
        profile, _ = Profile.objects.get_or_create(user=self.request.user)
        return profile