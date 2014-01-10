# -*- coding: utf-8 -*-

__author__ = 'Заур'


import random
import string


def id_generator(size=6, chars=string.ascii_lowercase + string.digits):
    """
    Функция генерирует строку из 6 символов
    """
    return ''.join(random.choice(chars) for x in range(size))

def get_or_none(model, **kwargs):
    try:
        object = model.objects.get(**kwargs)
    except:
        return None
    return object
