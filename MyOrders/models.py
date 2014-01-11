# -*- coding: utf-8 -*-

from django.db import models


class Client(models.Model):
    register_date = models.DateTimeField(auto_now_add=True)
    name = models.CharField(max_length=24, null=True)
    surname = models.CharField(max_length=32, null=True)
    patronymic = models.CharField(max_length=32, null=True)
    gender = models.NullBooleanField(null=True)
    birthday = models.DateField(null=True)
    t_number = models.CharField(max_length=16, null=False)

    def __unicode__(self):
        return '%s %s %s' % (self.surname, self.name, self.patronymic)


class Address(models.Model):
    Clientid = models.ForeignKey(Client, null=False)
    address = models.CharField(max_length=128, null=False)

class Session(models.Model):
    Clientid = models.ForeignKey(Client, null=False)
    order_time = models.DateTimeField(auto_now_add=True)
    address = models.CharField(max_length=128, null=False)
    delivery_time = models.DateTimeField(null=False)

    class Meta:
        ordering = ['-order_time']


class Restaurant(models.Model):
    name_id = models.CharField(max_length=128, null=False, unique=True)
    name = models.CharField(max_length=128, null=False)
    address = models.CharField(max_length=128, null=True)


class Meal(models.Model):
    name_id = models.CharField(max_length=64, null=False, unique=True)
    name = models.CharField(max_length=64, null=False)


#TODO Здесь должны быть связь many_to_many используя through для Meal и Restaurant


class Order(models.Model):
    Restaurantid = models.ForeignKey(Restaurant, null=False)
    Mealid = models.ForeignKey(Meal, null=False)
    Sessionid = models.ForeignKey(Session, null=False)