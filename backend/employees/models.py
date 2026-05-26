from django.db import models


class Employee(models.Model):  # noqa: DJ008 — __str__ added in a later slice under its own test
    first_name = models.CharField(max_length=80)
    last_name = models.CharField(max_length=80)

    @property
    def full_name(self) -> str:
        return f"{self.first_name} {self.last_name}"
