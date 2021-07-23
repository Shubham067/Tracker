from django.shortcuts import render, redirect
import pyrebase
import json
import pickle
import time
from django.http import HttpResponse, StreamingHttpResponse
import os
from django.core.cache import cache
from django.conf import settings
from django.core.cache.backends.base import DEFAULT_TIMEOUT
from django_redis import get_redis_connection

conn = get_redis_connection("default")

CACHE_TTL = getattr(settings, 'CACHE_TTL', DEFAULT_TIMEOUT)

config = json.loads(os.getenv("firebase_config"))

firebase = pyrebase.initialize_app(config)

authe = firebase.auth()

db = firebase.database()


def signup(request):
    return render(request, "signup.html")


def post_signup(request):
    username = request.POST.get('username')
    email = request.POST.get('email')
    password = request.POST.get('password')
    confirm = request.POST.get('confirm')

    try:
        user = authe.create_user_with_email_and_password(email, password)
        user_id = user['localId']
        id_token = user['idToken']
        request.session['id_token'] = str(id_token)
        request.session['user_id'] = str(user_id)
        db.child('users').child(str(user_id)).update({"username": username, "email": email}, id_token)

        # remove users key from redis cache since new user got added
        cache.delete("users")
    except:
        return render(request, "signup.html")
    return redirect("login")


def login(request):
    return render(request, "login.html")


def post_login(request):
    email = request.POST.get('email')
    password = request.POST.get('password')

    try:
        # if there is no error then signin the user with given email and password
        user = authe.sign_in_with_email_and_password(email, password)
        user = authe.refresh(user['refreshToken'])
        print("User", user)
    except:
        message = "Invalid Credentials!! Please Check your Data!"
        return render(request, "login.html", {"message": message})
    id_token = user['idToken']
    user_id = user['userId']
    request.session['id_token'] = str(id_token)
    request.session['user_id'] = str(user_id)
    request.session['email'] = str(email)
    username = db.child('users').child(user_id).child('username').get(id_token).val()
    request.session['username'] = str(username)
    context = {"username": request.session['username']}
    return render(request, "postlogin.html", context)

def home(request):
    context = {"username": request.session['username']}
    return render(request, "home.html", context)


def users(request):
    users_list = []

    if "users" in cache:
        # get users from redis cache
        print("======CACHE HIT======")
        users = cache.get("users")
    else:
        print("======CACHE MISS======")
        users = db.child('users').get(request.session['id_token'])

        # add users key to redis cache
        cache.set("users", users, timeout=CACHE_TTL)

    for user in users.each():
        tracker = db.child('trackers').child(str(user.key())).child(request.session['user_id']).get(request.session['id_token']).val()
        # conn.hset("tracker", str(user.key()), json.dumps({request.session['user_id']: tracker}))
        print("Tracker", tracker)
        if not tracker:
            users_list.append((user.key(), user.val()['username'], user.val()['email'], "No"))
        elif tracker['allow']:
            users_list.append((user.key(), user.val()['username'], user.val()['email'], True))
        else:
            users_list.append((user.key(), user.val()['username'], user.val()['email'], False))

    context = {'users_list': users_list}
    print(users_list)
    return render(request, "users.html", context)


def logout(request):
    try:
        del request.session['user_id']
    except:
        pass
    return redirect("login")


def update_user_location(request):
    latitude = float(request.POST.get('latitude'))
    longitude = float(request.POST.get('longitude'))
    coordinates = {"coordinates": {"lat": latitude, "lon": longitude}}
    print(db.child('trackers').shallow().get(request.session['id_token']).val())
    if request.session['user_id'] not in db.child('trackers').shallow().get(request.session['id_token']).val():
        print("Called 1=====")
        db.child('trackers').child(str(request.session['user_id'])).set(coordinates, request.session['id_token'])
    else:
        print("Called 2=====")
        db.child('trackers').child(str(request.session['user_id'])).update(coordinates, request.session['id_token'])
    return HttpResponse('success')


def send_tracking_request(request):
    trackee_id = request.POST.get('trackee_id')
    trackee_id = trackee_id.strip()
    if trackee_id != "":
        tracker_info = {request.session['user_id']: {"allow": False, "username": request.session['username'], "email": request.session['email']}}
        db.child('trackers').child(str(trackee_id)).update(tracker_info, request.session['id_token'])

        # keep cache updated
        conn.hdel("trackers", str(trackee_id))
    return HttpResponse('success')


def get_tracking_request(request):
    tracking_requests = []
    if "trackers" in conn:
        # get trackers from redis cache
        print("======CACHE HIT======")
        trackers = pickle.loads(conn.hget("trackers", str(request.session['user_id'])))
    else:
        print("======CACHE MISS======")
        trackers = db.child("trackers").child(str(request.session['user_id'])).get(request.session['id_token'])

        # add trackers key to redis cache
        conn.hset("trackers", str(request.session['user_id']), pickle.dumps(trackers))
        conn.expire("trackers", 900) # setting TTL for trackers key in redis cache to 15 minutes(15 * 60 = 900 seconds)

    if trackers.val():
        for tracker in trackers.each():
            if 'allow' in tracker.val() and tracker.val()['allow']:
                tracking_requests.append((tracker.key(), tracker.val()['username'], tracker.val()['email'], True))
            elif 'allow' in tracker.val() and not tracker.val()['allow']:
                tracking_requests.append((tracker.key(), tracker.val()['username'], tracker.val()['email'], False))
    context = {'tracking_requests': tracking_requests}
    print("tracking_requests", tracking_requests)
    return render(request, "tracking_requests.html", context)


def allow_tracking_request(request):
    tracker_id = request.POST.get('tracker_id')
    tracker_id = tracker_id.strip()
    if tracker_id != "":
        tracker_info = {"allow": True}
        db.child("trackers").child(str(request.session['user_id'])).child(str(tracker_id)).update(tracker_info, request.session['id_token'])
        
        # keep cache updated
        conn.hdel("trackers", str(request.session['user_id']))
    return HttpResponse('success')


def revoke_tracking_request(request):
    tracker_id = request.POST.get('tracker_id')
    tracker_id = tracker_id.strip()
    if tracker_id != "":
        tracker_info = {"allow": False}
        db.child("trackers").child(str(request.session['user_id'])).child(str(tracker_id)).update(tracker_info, request.session['id_token'])
        
        # keep cache updated
        conn.hdel("trackers", str(request.session['user_id']))
    return HttpResponse('success')


def reject_tracking_request(request):
    tracker_id = request.POST.get('tracker_id')
    tracker_id = tracker_id.strip()
    db.child("trackers").child(str(request.session['user_id'])).child(str(tracker_id)).remove(request.session['id_token'])
    
    # keep cache updated
    conn.hdel("trackers", str(request.session['user_id']))
    return HttpResponse('success')


def track_user_location(request):
    trackee_id = request.POST.get('trackee_id')
    trackee_id = trackee_id.strip()
    location = {}
    if trackee_id != "":
        coordinates = db.child("trackers").child(str(trackee_id)).child('coordinates').get(request.session['id_token'])
        if coordinates.val():
            for coordinate in coordinates.each():
                location.update({coordinate.key(): coordinate.val()})
        request.session['trackee_id'] = trackee_id
        request.session['coord'] = location
    print("location", location)
    return HttpResponse('success')


def display_map(request):
    context = {}
    context.update({
        "latLng": request.session['coord'],
        "mapsApiKey": os.getenv("mapsApiKey")
    })
    return render(request, "google_maps.html", context)


def stream_location(request):
    if request.POST:
        stop = request.POST.get("stop")
        response = HttpResponse("success")
        response['Content-Type'] = 'text/plain'
        return response
    else:
        stop = False
    print("Stop", stop)

    def event_stream(stop):
        initial_data = ""
        while True:
            if stop:
                print("Stopped Tracking====")
                break
            print("Starting Stream====")
            coordinates = db.child("trackers").child(str(request.session['trackee_id'])).child('coordinates').get(request.session['id_token'])
            location = {}
            if coordinates.val():
                for coordinate in coordinates.each():
                    location.update({coordinate.key(): coordinate.val()})
            data = json.dumps(location)

            if initial_data != data:
                yield "\ndata: {}\n\n".format(data)
                initial_data = data
            time.sleep(1)

    response = StreamingHttpResponse(event_stream(stop))
    response['Content-Type'] = 'text/event-stream'
    response['Cache-Control'] = 'no-cache'
    # response['Connection'] = 'keep-alive' # hop-by-hop headers like "keep-alive" are not allowed by django wsgi

    return response