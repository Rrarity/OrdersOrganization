# -*- coding: utf-8 -*-

__author__ = 'Заур'


import random
import string


def id_generator(size=6, chars=string.ascii_lowercase + string.digits):
    return ''.join(random.choice(chars) for x in range(size))