# Generated by Django 2.2.12 on 2020-05-27 04:16

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('game', '0004_auto_20200526_1445'),
    ]

    operations = [
        migrations.AddField(
            model_name='avatar',
            name='max_health',
            field=models.IntegerField(default=100),
        ),
        migrations.AddField(
            model_name='avatar',
            name='max_mana',
            field=models.IntegerField(default=100),
        ),
    ]
