from rest_framework import serializers

from employees.models import Employee


class EmployeeSerializer(serializers.ModelSerializer):
    full_name = serializers.CharField(read_only=True)

    class Meta:
        model = Employee
        fields = (
            "id",
            "first_name",
            "last_name",
            "full_name",
            "email",
            "job_title",
            "department",
            "employment_type",
            "country",
            "salary",
            "currency",
            "date_of_joining",
            "created_at",
            "updated_at",
        )
        read_only_fields = ("id", "full_name", "created_at", "updated_at")
