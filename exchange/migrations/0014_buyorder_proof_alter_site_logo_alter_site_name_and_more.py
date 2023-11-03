# Generated by Django 4.1.7 on 2023-08-22 22:03

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('exchange', '0013_buyorder_order_id_sellorder_order_id'),
    ]

    operations = [
        migrations.AddField(
            model_name='buyorder',
            name='proof',
            field=models.ImageField(blank=True, default='transfer-screenshot.png', null=True, upload_to='trades-screenshots'),
        ),
        migrations.AlterField(
            model_name='site',
            name='logo',
            field=models.ImageField(default='xendex-logo.png', upload_to='site_images'),
        ),
        migrations.AlterField(
            model_name='site',
            name='name',
            field=models.CharField(blank=True, default='xendex crypto exchange', max_length=50, null=True),
        ),
        migrations.AlterField(
            model_name='site',
            name='owned_by',
            field=models.CharField(blank=True, default='xendex', max_length=50, null=True),
        ),
    ]
