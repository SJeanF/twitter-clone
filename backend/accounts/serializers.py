from django.contrib.auth.models import User
from django.contrib.auth.password_validation import validate_password
from rest_framework import serializers
from .models import Profile, Follow

class RegisterSerializer(serializers.ModelSerializer):
    password = serializers.CharField(write_only=True, validators=[validate_password])
    email = serializers.EmailField(required=True)

    class Meta:
        model = User
        fields = ('id', 'username', 'email', 'password')

    def validate_email(self, value):
        if User.objects.filter(email__iexact=value).exists():
            raise serializers.ValidationError('Este e-mail já está em uso.')
        return value

    def create(self, validated_data):
        # create_user cuida de criptografar a senha
        return User.objects.create_user(**validated_data)

class ProfileSerializer(serializers.ModelSerializer):
    username = serializers.CharField(source='user.username', read_only=True)
    email = serializers.EmailField(source='user.email', read_only=True)
    current_password = serializers.CharField(write_only=True, required=False)
    new_password = serializers.CharField(write_only=True, required=False)

    class Meta:
        model = Profile
        fields = ('username', 'email', 'display_name', 'avatar',
                  'current_password', 'new_password')

    def validate(self, attrs):
        new_password = attrs.get('new_password')
        current_password = attrs.get('current_password')
        user = self.instance.user

        if new_password:
            if not current_password or not user.check_password(current_password):
                raise serializers.ValidationError(
                    {'current_password': 'Senha atual incorreta.'}
                )
            validate_password(new_password, user)
        return attrs

    def update(self, instance, validated_data):
        new_password = validated_data.pop('new_password', None)
        validated_data.pop('current_password', None)

        if new_password:
            instance.user.set_password(new_password)
            instance.user.save()

        return super().update(instance, validated_data)

def get_avatar_url(user, request):
    """Devolve a URL completa da foto de perfil, ou None se não tiver."""
    profile = getattr(user, 'profile', None)
    if profile and profile.avatar:
        url = profile.avatar.url
        return request.build_absolute_uri(url) if request else url
    return None


class PublicUserSerializer(serializers.ModelSerializer):
    display_name = serializers.SerializerMethodField()
    avatar = serializers.SerializerMethodField()
    followers_count = serializers.SerializerMethodField()
    following_count = serializers.SerializerMethodField()
    posts_count = serializers.SerializerMethodField()
    is_following = serializers.SerializerMethodField()

    class Meta:
        model = User
        fields = ('id', 'username', 'display_name', 'avatar',
                  'followers_count', 'following_count', 'posts_count', 'is_following')

    def get_display_name(self, obj):
        profile = getattr(obj, 'profile', None)
        return profile.display_name if profile and profile.display_name else obj.username

    def get_avatar(self, obj):
        return get_avatar_url(obj, self.context.get('request'))

    def get_followers_count(self, obj):
        return Follow.objects.filter(following=obj).count()

    def get_following_count(self, obj):
        return Follow.objects.filter(follower=obj).count()

    def get_posts_count(self, obj):
        return obj.posts.count()

    def get_is_following(self, obj):
        request = self.context.get('request')
        if not request or not request.user.is_authenticated:
            return False
        return Follow.objects.filter(follower=request.user, following=obj).exists()