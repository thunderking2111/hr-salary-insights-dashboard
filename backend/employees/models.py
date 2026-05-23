from decimal import Decimal

from django.core.validators import MinValueValidator
from django.db import models


class Employee(models.Model):
    first_name = models.CharField(max_length=100)
    last_name = models.CharField(max_length=100)
    job_title = models.CharField(max_length=150)
    country = models.CharField(max_length=100)
    salary = models.DecimalField(
        max_digits=12,
        decimal_places=2,
        validators=[MinValueValidator(Decimal("0.01"))],
    )

    class Meta:
        ordering = ["first_name", "last_name", "pk"]

    def __str__(self) -> str:
        return f"{self.first_name} {self.last_name}"
