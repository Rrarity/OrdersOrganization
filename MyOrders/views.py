# -*- coding: utf-8 -*-

from django.shortcuts import render_to_response, HttpResponse
from django.contrib.auth import authenticate, login, logout
from MyOrders.additionally.errors_code import *
from django.http import HttpResponseForbidden
from datetime import *
import json



def get_home_page(request):
    """
    Функция отправляет главную страницу
    """

    return render_to_response('base/base.html')


def log_in(request):
    """
    Функция выполняет вход в профиль
    """

    errors_list = []

    try:
        data = json.loads(request.body)
    except (TypeError, ValueError):
        return HttpResponseForbidden()

    if not isinstance(data, dict):
        errors_list.append(e_type)
        return HttpResponseForbidden()

    username = data.get('username')
    password = data.get('password')

    if not isinstance(username, unicode):
        errors_list.append(e_type)

    if not isinstance(password, e_type):
        errors_list.append(e_type)

    if errors_list:
        return HttpResponseForbidden()

    user = authenticate(username=username, password=password)

    if user:
        login(request, user)
        request.session.set_expiry(timedelta(days=1).seconds)

        return HttpResponse(json.dumps({'errors_codes': errors_list}))

    return HttpResponseForbidden()


def log_out(request):
    """
    Функция выходит из профиля
    """

    logout(request)
    return HttpResponse(json.dumps({'errors_codes': []}))

