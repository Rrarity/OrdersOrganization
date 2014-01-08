# -*- coding: utf-8 -*-

from django.shortcuts import render_to_response, HttpResponse
from django.contrib.auth import authenticate, login, logout
from MyOrders.additionally.errors_code import *
from django.http import HttpResponseForbidden
from django.contrib.auth.models import User
from MyOrders.additionally.publics import *
from django.core.validators import email_re
from django.core.mail import send_mail
import MyOrders.models as models
from datetime import *
import json


def get_home_page(request):
    """
    Функция отправляет главную страницу
    """

    return render_to_response('main/main.html')


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

    if not isinstance(password, unicode):
        errors_list.append(e_type)

    if errors_list:
        return HttpResponseForbidden()

    user = authenticate(username=username, password=password)

    if user:
        login(request, user)
        request.session.set_expiry(timedelta(days=1).seconds)

        return HttpResponse(json.dumps({'error_codes': errors_list}))

    return HttpResponseForbidden()


def log_out(request):
    """
    Функция выходит из профиля
    """

    logout(request)
    return HttpResponse(json.dumps({'error_codes': []}))


def change_password(request):
    """
    Функция меняет пароль администратора
    """

    send_mail(u'My.Orders: вам назначен новый пароль !', 'Ваш новый пароль - %s. Не теряйте его!' % ('12345',),
              'Kurbanismailov.92@gmail.com', ['Kurbanismailov.92@gmail.com'])

    return HttpResponse()


#TODO Использовать User.objects.create_user(username='admin', password='admin') для создания пользователя