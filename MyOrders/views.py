# -*- coding: utf-8 -*-

from django.shortcuts import render_to_response


def get_home_page(request):
    """
    Функция отправляет главную страницу
    """
    return render_to_response('base/base.html')
