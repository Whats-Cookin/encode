# Generated by Django 4.1.7 on 2023-08-09 21:02

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('exchange', '0003_profile_date_of_birth'),
    ]

    operations = [
        migrations.AlterField(
            model_name='buyorder',
            name='naira_amount',
            field=models.CharField(blank=True, max_length=100, null=True),
        ),
    ]
