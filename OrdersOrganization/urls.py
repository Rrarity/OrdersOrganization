from django.conf.urls import patterns, include, url

# Uncomment the next two lines to enable the admin:
# from django.contrib import admin
# admin.autodiscover()
from OrdersOrganization.blind_stoppers import redirect_stopper as r_stopper

urlpatterns = patterns('',
                       url(r'^$', r_stopper),
                       url(r'^my_orders/', include('MyOrders.urls')),

                        # url(r'^OrdersOrganization/', include('OrdersOrganization.foo.urls')),

                        # Uncomment the admin/doc line below to enable admin documentation:
                        # url(r'^admin/doc/', include('django.contrib.admindocs.urls')),

                        # Uncomment the next line to enable the admin:
                        # url(r'^admin/', include(admin.site.urls)),
)
