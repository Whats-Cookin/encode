# Generated by Django 4.1.7 on 2023-08-10 00:32

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('exchange', '0011_sellorder_naira_amount'),
    ]

    operations = [
        migrations.AddField(
            model_name='buyorder',
            name='failed',
            field=models.BooleanField(default=False),
        ),
    ]