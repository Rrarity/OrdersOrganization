# -*- coding: utf-8 -*-

__author__ = 'Заур'

from django.http import HttpResponseRedirect


def blind_stopper(request):
    """
    Заглушка для перехода по localhost:8000 - перенаправляет на localhost:8000/my_orders/
    """

    return HttpResponseRedirect('my_orders/')