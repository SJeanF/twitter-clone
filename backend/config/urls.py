"""
URL configuration for config project.

The `urlpatterns` list routes URLs to views. For more information please see:
    https://docs.djangoproject.com/en/6.1/topics/http/urls/
Examples:
Function views
    1. Add an import:  from my_app import views
    2. Add a URL to urlpatterns:  path('', views.home, name='home')
Class-based views
    1. Add an import:  from other_app.views import Home
    2. Add a URL to urlpatterns:  path('', Home.as_view(), name='home')
Including another URLconf
    1. Import the include() function: from django.urls import include, path
    2. Add a URL to urlpatterns:  path('blog/', include('blog.urls'))
"""
from django.conf import settings
from django.conf.urls.static import static
from django.contrib import admin
from django.urls import path, re_path, include
from django.views.generic import TemplateView

from accounts.views import (MyProfileView, UserListView, UserDetailView,
                            FollowView, FollowersListView, FollowingListView)

urlpatterns = [
    path('admin/', admin.site.urls),
    path('api/auth/', include('accounts.urls')),
    path('api/profile/me/', MyProfileView.as_view(), name='my-profile'),

    path('api/users/', UserListView.as_view(), name='user-list'),
    path('api/users/<str:username>/', UserDetailView.as_view(), name='user-detail'),
    path('api/users/<str:username>/follow/', FollowView.as_view(), name='user-follow'),
    path('api/users/<str:username>/followers/', FollowersListView.as_view(), name='user-followers'),
    path('api/users/<str:username>/following/', FollowingListView.as_view(), name='user-following'),

    path('api/', include('posts.urls')),
]

if settings.DEBUG:
    urlpatterns += static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)

# Qualquer outra rota (/login, /u/maria...) devolve o React, que cuida da navegação
urlpatterns += [
    re_path(r'^(?!api/|admin/|media/|static/).*$',
            TemplateView.as_view(template_name='index.html')),
]