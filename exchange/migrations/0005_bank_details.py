# Generated by Django 4.1.7 on 2023-08-09 21:56

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('exchange', '0004_alter_buyorder_naira_amount'),
    ]

    operations = [
        migrations.CreateModel(
            name='Bank_Details',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('bank_name', models.CharField(blank=True, max_length=50, null=True)),
                ('account_number', models.CharField(blank=True, max_length=50, null=True)),
                ('account_name', models.CharField(blank=True, max_length=50, null=True)),
            ],
        ),
    ]
