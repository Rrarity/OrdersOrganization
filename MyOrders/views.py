# -*- coding: utf-8 -*-

from django.shortcuts import render_to_response, HttpResponse
import json
from MyOrders.additionally.errors_code import *


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
        errors_list.append(e_convert)
        return HttpResponse(json.dumps({'errors_codes': errors_list}))

    if not isinstance(data, dict):
        errors_list.append(e_type)
        return HttpResponse(json.dumps({'errors_codes': errors_list}))

    return HttpResponse()

    #if not request.user.is_authenticated():

