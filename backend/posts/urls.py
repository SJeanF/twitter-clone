from django.urls import path

from .views import (PostListCreateView, PostDetailView, FeedView,
                    LikeView, CommentListCreateView)

urlpatterns = [
    path('posts/', PostListCreateView.as_view(), name='post-list'),
    path('posts/<int:pk>/', PostDetailView.as_view(), name='post-detail'),
    path('posts/<int:pk>/like/', LikeView.as_view(), name='post-like'),
    path('posts/<int:pk>/comments/', CommentListCreateView.as_view(), name='post-comments'),
    path('feed/', FeedView.as_view(), name='feed'),
]