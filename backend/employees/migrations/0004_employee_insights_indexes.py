from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ("employees", "0003_employee_country_currency_defaults"),
    ]

    operations = [
        migrations.AddIndex(
            model_name="employee",
            index=models.Index(fields=["country"], name="employee_country_idx"),
        ),
        migrations.AddIndex(
            model_name="employee",
            index=models.Index(
                fields=["country", "job_title"],
                name="employee_country_job_title_idx",
            ),
        ),
    ]
