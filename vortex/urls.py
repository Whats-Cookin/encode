
from django.contrib import admin
from django.views.static import serve
from django.urls import path, include, re_path
from django.conf import settings
from django.conf.urls.static import static

urlpatterns = [
    path('vortex-root/', admin.site.urls),
    path('accounts/', include('allauth.urls')),
    path("", include("exchange.urls")),
    re_path(r'^media/(?P<path>.*)$', serve,{'document_root':  settings.MEDIA_ROOT}),
    re_path(r'^static/(?P<path>.*)$', serve,{'document_root': settings.STATIC_ROOT}),
] +  static(settings.STATIC_URL, document_root=settings.STATIC_ROOT)

urlpatterns += static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)


handler404 = 'exchange.views.my_custom_page_not_found_view_404'
handler400 = 'exchange.views.my_custom_bad_request_view_400'
handler403 = 'exchange.views.my_custom_permission_denied_view_403'
handler500 = 'exchange.views.my_custom_error_view_500'