# -*- coding: utf-8 -*-

from django.http import HttpResponseForbidden

__author__ = 'Заур'


class MiddleWareProcess(object):

    def process_request(self, request):
        if request.user.is_authenticated():
            return HttpResponseForbidden()