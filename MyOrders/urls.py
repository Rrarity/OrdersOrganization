# -*- coding: utf-8 -*-

__author__ = 'Заур'

from django.conf.urls import patterns, url

urlpatterns = patterns('MyOrders.views',
                       url(r'^$', 'get_home_page'),)
