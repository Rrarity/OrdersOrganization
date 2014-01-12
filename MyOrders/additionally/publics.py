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
    """
    Определит объект в базе данных или вернет None
    """
    try:
        object = model.objects.get(**kwargs)
    except:
        return None
    return object


def date_to_kendo(date):
    """
    преобразует дату в строку для kendo
    """

    str_date = list(date.strftime('%Y-%m-%d %H:%M'))
    str_date[str_date.index(' ')] = 'T'
    str_date = ''.join(str_date)
    str_date = '%s%s' % (str_date, ':00.000Z')

    return str_date