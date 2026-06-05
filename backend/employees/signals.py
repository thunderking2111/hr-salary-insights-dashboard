from django.db.models.signals import post_delete, post_save

from employees.models import Employee
from employees.services.insights_cache import invalidate_insights_cache


def _invalidate_insights_cache_on_employee_change(**_kwargs) -> None:
    invalidate_insights_cache()


post_save.connect(_invalidate_insights_cache_on_employee_change, sender=Employee)
post_delete.connect(_invalidate_insights_cache_on_employee_change, sender=Employee)
