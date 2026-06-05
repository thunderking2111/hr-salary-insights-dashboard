import pytest

from employees.models import Employee


@pytest.mark.django_db
def test_employee_model_has_insights_indexes():
    index_fields = [tuple(index.fields) for index in Employee._meta.indexes]

    assert ("country",) in index_fields
    assert ("country", "job_title") in index_fields
