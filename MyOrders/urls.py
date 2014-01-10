# -*- coding: utf-8 -*-

__author__ = 'Заур'

from django.conf.urls import patterns, url

urlpatterns = patterns('MyOrders.views',
                       url(r'^$', 'get_home_page'),
                       url(r'^login/$', 'log_in'),
                       url(r'^logout/$', 'log_out'),
                       url(r'^change_password/$', 'change_password'),
                       url(r'^get_add_session_from_number/$', 'get_add_session_from_number'),)
