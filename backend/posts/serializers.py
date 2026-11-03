from rest_framework import serializers

from accounts.serializers import get_avatar_url
from .models import Post, Comment


def _display_name(user):
    profile = getattr(user, 'profile', None)
    return profile.display_name if profile and profile.display_name else user.username


class PostSerializer(serializers.ModelSerializer):
    author = serializers.CharField(source='author.username', read_only=True)
    author_name = serializers.SerializerMethodField()
    author_avatar = serializers.SerializerMethodField()
    likes_count = serializers.IntegerField(source='likes.count', read_only=True)
    comments_count = serializers.IntegerField(source='comments.count', read_only=True)
    liked_by_me = serializers.SerializerMethodField()

    class Meta:
        model = Post
        fields = ('id', 'author', 'author_name', 'author_avatar', 'content',
                  'created_at', 'updated_at', 'likes_count', 'comments_count',
                  'liked_by_me')
        read_only_fields = ('created_at', 'updated_at')

    def get_author_name(self, obj):
        return _display_name(obj.author)

    def get_author_avatar(self, obj):
        return get_avatar_url(obj.author, self.context.get('request'))

    def get_liked_by_me(self, obj):
        request = self.context.get('request')
        if not request or not request.user.is_authenticated:
            return False
        return obj.likes.filter(user=request.user).exists()


class CommentSerializer(serializers.ModelSerializer):
    user = serializers.CharField(source='user.username', read_only=True)
    user_name = serializers.SerializerMethodField()
    user_avatar = serializers.SerializerMethodField()

    class Meta:
        model = Comment
        fields = ('id', 'user', 'user_name', 'user_avatar', 'content', 'created_at')
        read_only_fields = ('created_at',)

    def get_user_name(self, obj):
        return _display_name(obj.user)

    def get_user_avatar(self, obj):
        return get_avatar_url(obj.user, self.context.get('request'))