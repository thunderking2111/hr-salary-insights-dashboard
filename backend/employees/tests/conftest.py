from datetime import date
from decimal import Decimal


def employee_create_kwargs(**overrides):
    """Baseline kwargs for Employee.objects.create() in model tests."""
    kwargs = {
        "first_name": "Ada",
        "last_name": "Lovelace",
        "email": "ada.lovelace@example.com",
        "job_title": "Software Engineer",
        "department": "Engineering",
        "employment_type": "full_time",
        "country": "India",
        "salary": Decimal("1500000.00"),
        "currency": "INR",
        "date_of_joining": date(2020, 1, 15),
    }
    kwargs.update(overrides)
    return kwargs
