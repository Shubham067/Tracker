"""Tracker URL Configuration

The `urlpatterns` list routes URLs to views. For more information please see:
    https://docs.djangoproject.com/en/3.2/topics/http/urls/
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
from django.contrib import admin
from django.urls import path

from webtracker import views
urlpatterns = [
    path('admin/', admin.site.urls),
    path('', views.signup, name="signup"),
    path('signup/', views.signup, name="signup"),
    path('postsignup/', views.post_signup, name="postsignup"),
    # path('postlogin/', views.post_login, name="postlogin"),
    path('home/', views.home, name="home"),
    path('login/', views.login, name="login"),
    path('logout/', views.logout, name="logout"),
    path('users/', views.users, name="users"),
    path('updateuserlocation/', views.update_user_location, name="updateuserlocation"),
    path('sendtrackingrequest/', views.send_tracking_request, name="sendtrackingrequest"),
    path('trackingrequest/', views.get_tracking_request, name="gettrackingrequest"),
    path('allowtrackingrequest/', views.allow_tracking_request, name="allowtrackingrequest"),
    path('revoketrackingrequest/', views.revoke_tracking_request, name="revoketrackingrequest"),
    path('rejecttrackingrequest/', views.reject_tracking_request, name="rejecttrackingrequest"),
    path('trackuserlocation/', views.track_user_location, name="trackuserlocation"),
    path('displaymap/', views.display_map, name="displaymap"),
    path('streamlocation/', views.stream_location, name="streamlocation")
]
