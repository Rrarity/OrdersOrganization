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

        return HttpResponse(json.dumps({'error_codes': error_codes, 't_number': t_number, 'client': client_info,
                                        'addresses': addresses}), content_type='application/json')
    else:
        return HttpResponse(json.dumps({'error_codes': error_codes, 't_number': t_number,
                                        'client': {'id': 0, 'name': '', 'surname': '',
                                                   'patronymic': '', 'gender': None, 'birthday': ''},
                                        'addresses': []}), content_type='application/json')


def set_add_session_from_number(request):
    """
    Добавить заказ и (возможно) нового клиента
    """

    error_codes = []

    try:
        data = json.loads(request.body)
    except(ValueError, TypeError):
        error_codes.append(e_convert)
        return HttpResponse(json.dumps({'error_codes': error_codes}), content_type='application/json')

    if not isinstance(data, dict):
        error_codes.append(e_type)
        return HttpResponse(json.dumps({'error_codes': error_codes}), content_type='application/json')

    t_number = data.get('t_number')
    Clientid = data.get('Clientid')
    name = data.get('name')
    surname = data.get('surname')
    patronymic = data.get('patronymic')
    gender = data.get('gender')
    birthday = data.get('birthday')
    address = data.get('address')
    delivary_time = data.get('delivery_time')

    if not isinstance(Clientid, int):
        error_codes.append(e_type)
    elif Clientid and not get_or_none(models.Client, id=Clientid):
        error_codes.append(e_field_not_exist)

    if not isinstance(name, unicode):
        error_codes.append(e_type)

    if not isinstance(surname, unicode):
        error_codes.append(e_type)

    if not isinstance(patronymic, unicode):
        error_codes.append(e_type)

    if not isinstance(gender, bool) and not isinstance(gender, None):
        error_codes.append(e_type)

    if not isinstance(birthday, date):
        error_codes.append(e_type)

    if not isinstance(address, unicode):
        error_codes.append(e_type)

    if not isinstance(delivary_time, datetime):
        error_codes.append(e_type)

    if error_codes:
        return HttpResponse(json.dumps({'error_codes': error_codes}), content_type='application/json')

    if Clientid:
        client = get_or_none(models.Client, id=Clientid)

        models.Client.objects.filter(id=Clientid).update(name=name, surname=surname, patronymic=patronymic,
                                                         gender=gender, birthday=birthday)

        if address not in [address.address for address in models.Address.objects.filter(Clientid=Clientid)]:
            models.Address.objects.create(Clientid=client, address=address)

        models.Session.objects.create(Clientid=client, address=address, delivery_time=delivary_time)

    else:
        new_client = models.Client.objects.create(name=name, surname=surname, patronymic=patronymic, gender=gender,
                                                  birthday=birthday, t_number=t_number)
        models.Address.objects.create(Clientid=new_client, address=address)

        models.Session.objects.create(Clientid=new_client, address=address, delivary_time=delivary_time)

    return HttpResponse(json.dumps({'error_codes': error_codes}), content_type='application/json')


def get_sessions(request):
    """
    Отправить данные о сессиях
    """

    sessions = list(models.Session.objects.all().values('Clientid', 'order_time', 'address', 'delivery_time'))

    for session in sessions:
        client = get_or_none(models.Client, id=session.get('Clientid'))
        session['order_time'] = session.get('order_time').strftime('%d.%m.%Y %H:%M')
        session['delivery_time'] = session.get('delivery_time').strftime('%d.%m.%Y %H:%M')
        session['fio'] = '%s %s %s' % (client.surname, client.name, client.patronymic)
        session['t_number'] = client.t_number

    return HttpResponse(json.dumps({'sessions': sessions}), content_type='application/json')