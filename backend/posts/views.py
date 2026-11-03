from django.shortcuts import get_object_or_404
from rest_framework import generics
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from rest_framework.views import APIView

from accounts.models import Follow
from .models import Post, Like, Comment
from .permissions import IsAuthorOrReadOnly
from .serializers import PostSerializer, CommentSerializer


class PostListCreateView(generics.ListCreateAPIView):
    """GET: todos os posts (filtre com ?author=username). POST: cria um post."""
    serializer_class = PostSerializer

    def get_queryset(self):
        qs = Post.objects.select_related('author__profile')
        author = self.request.query_params.get('author')
        if author:
            qs = qs.filter(author__username=author)
        return qs

    def perform_create(self, serializer):
        serializer.save(author=self.request.user)


class PostDetailView(generics.RetrieveUpdateDestroyAPIView):
    serializer_class = PostSerializer
    queryset = Post.objects.select_related('author__profile')
    permission_classes = [IsAuthenticated, IsAuthorOrReadOnly]


class FeedView(generics.ListAPIView):
    """Posts apenas das pessoas que o usuário segue."""
    serializer_class = PostSerializer

    def get_queryset(self):
        following_ids = Follow.objects.filter(
            follower=self.request.user
        ).values_list('following_id', flat=True)
        return Post.objects.filter(author_id__in=following_ids).select_related('author__profile')


class LikeView(APIView):
    def post(self, request, pk):
        post = get_object_or_404(Post, pk=pk)
        Like.objects.get_or_create(user=request.user, post=post)
        return Response({'liked': True, 'likes_count': post.likes.count()})

    def delete(self, request, pk):
        post = get_object_or_404(Post, pk=pk)
        Like.objects.filter(user=request.user, post=post).delete()
        return Response({'liked': False, 'likes_count': post.likes.count()})


class CommentListCreateView(generics.ListCreateAPIView):
    serializer_class = CommentSerializer

    def get_queryset(self):
        return Comment.objects.filter(post_id=self.kwargs['pk']).select_related('user__profile')

    def perform_create(self, serializer):
        post = get_object_or_404(Post, pk=self.kwargs['pk'])
        serializer.save(user=self.request.user, post=post)