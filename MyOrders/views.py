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
import re


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

        return HttpResponse(json.dumps({'error_codes': errors_list}), content_type='application/json')

    return HttpResponseForbidden()


def log_out(request):
    """
    Функция выходит из профиля
    """

    logout(request)
    return HttpResponse(json.dumps({'error_codes': []}), content_type='application/json')


def change_password(request):
    """
    Функция меняет пароль администратора
    """

    user = request.user
    password = id_generator()
    user.set_password(password)
    user.save()

    send_mail(u'My.Orders: вам назначен новый пароль !', 'Cистема My.Orders сообщает вам, '
                                                         'что %s в %s по Московскому времени ваш пароль в системе '
                                                         'был изменен. Новый пароль: %s. Пожалуйста, не теряйте его !'
                                                         % (datetime.now().strftime("%d.%m.%Y"),
                                                            datetime.now().strftime("%H:%M"), password),
              'noreply.my.orders@gmail.com', ['noreply.my.orders@gmail.com', user.email])

    return HttpResponse(json.dumps({'error_codes': [],
                                    'password': password}), content_type='application/json')


#TODO Использовать User.objects.create_user(username='admin', password='admin') для создания пользователя


def get_add_session_from_number(request):
    """
    Отправить данные на форму добавления заказа
    """
    error_codes = []

    try:
        data = json.loads(request.body)
    except(ValueError, TypeError):
        error_codes.append(e_convert)
        return HttpResponse(json.dumps({'error_codes': error_codes}),
                            content_type='application/json')

    if not isinstance(data, dict):
        error_codes.append(e_type)
        return HttpResponse(json.dumps({'error_codes': error_codes}),
                            content_type='application/json')

    t_number = data.get('t_number')


    if not isinstance(t_number, unicode):
        error_codes.append(e_type)
    else:
        reg_expr = re.compile('\+\d+')
        reg_expr.match(t_number)
        if not reg_expr:
            error_codes.append(e_string_form)
            return HttpResponse(json.dumps({'error_codes': error_codes}),
                                content_type='application/json')

    client = get_or_none(models.Client, t_number=t_number)

    if client:
        client_info = list(models.Client.objects.filter(t_number=t_number).values('id', 'name', 'surname',
                                                                                  'patronymic', 'gender', 'birthday'))[0]
        client_info['birthday'] = client_info.get('birthday').strftime('%d.%m.%Y')

        addresses = [address.address for address in models.Address.objects.filter(Clientid=client_info.get('id'))]

        return HttpResponse(json.dumps({'error_codes': error_codes, 'client': client_info,
                                        'addresses': addresses}), content_type='application/json')
    else:
        return HttpResponse(json.dumps({'error_codes': error_codes, 'client': {'id': 0},
                                        'addresses': []}), content_type='application/json')