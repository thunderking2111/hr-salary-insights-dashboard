from django.db import models


class Employee(models.Model):
    first_name = models.CharField(max_length=100)
    last_name = models.CharField(max_length=100)
    job_title = models.CharField(max_length=150)
    country = models.CharField(max_length=100)
    salary = models.DecimalField(max_digits=12, decimal_places=2)
