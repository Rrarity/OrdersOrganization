# -*- coding: utf-8 -*-

from django.shortcuts import render_to_response

__author__ = 'Заур'


class MiddleWareProcess(object):

    def process_request(self, request):
        if request.path.startswith('/my_orders/') and not request.user.is_authenticated():
            return render_to_response('login/login.html')

