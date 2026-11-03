from django.contrib.auth.models import User
from django.shortcuts import get_object_or_404
from rest_framework import generics, status
from rest_framework.parsers import MultiPartParser, FormParser, JSONParser
from rest_framework.permissions import AllowAny
from rest_framework.response import Response
from rest_framework.views import APIView

from .models import Profile, Follow
from .serializers import RegisterSerializer, ProfileSerializer, PublicUserSerializer


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

class UserListView(generics.ListAPIView):
    """Lista usuários (com busca por ?search=) para descobrir quem seguir."""
    serializer_class = PublicUserSerializer

    def get_queryset(self):
        qs = User.objects.exclude(id=self.request.user.id).select_related('profile')
        search = self.request.query_params.get('search')
        if search:
            qs = qs.filter(username__icontains=search)
        return qs.order_by('username')


class UserDetailView(generics.RetrieveAPIView):
    serializer_class = PublicUserSerializer
    queryset = User.objects.select_related('profile')
    lookup_field = 'username'


class FollowView(APIView):
    def post(self, request, username):
        target = get_object_or_404(User, username=username)
        if target == request.user:
            return Response({'detail': 'Você não pode seguir a si mesmo.'},
                            status=status.HTTP_400_BAD_REQUEST)
        Follow.objects.get_or_create(follower=request.user, following=target)
        return Response({
            'following': True,
            'followers_count': Follow.objects.filter(following=target).count(),
        })

    def delete(self, request, username):
        target = get_object_or_404(User, username=username)
        Follow.objects.filter(follower=request.user, following=target).delete()
        return Response({
            'following': False,
            'followers_count': Follow.objects.filter(following=target).count(),
        })


class FollowersListView(generics.ListAPIView):
    """Quem segue o usuário <username>."""
    serializer_class = PublicUserSerializer

    def get_queryset(self):
        target = get_object_or_404(User, username=self.kwargs['username'])
        ids = Follow.objects.filter(following=target).values('follower')
        return User.objects.filter(id__in=ids).select_related('profile').order_by('username')


class FollowingListView(generics.ListAPIView):
    """Quem o usuário <username> segue."""
    serializer_class = PublicUserSerializer

    def get_queryset(self):
        target = get_object_or_404(User, username=self.kwargs['username'])
        ids = Follow.objects.filter(follower=target).values('following')
        return User.objects.filter(id__in=ids).select_related('profile').order_by('username')