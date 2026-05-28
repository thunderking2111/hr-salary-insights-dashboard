from django.core.management.base import BaseCommand

from employees.seeding import seed_employees_in_transaction


class Command(BaseCommand):
    help = "Seed employees from first_names.txt and last_names.txt using bulk_create."

    def add_arguments(self, parser):
        parser.add_argument(
            "--count",
            type=int,
            default=10000,
            help="Number of employees to create (default: 10000).",
        )
        parser.add_argument(
            "--seed",
            type=int,
            default=42,
            help="RNG seed for deterministic output (default: 42).",
        )
        parser.add_argument(
            "--clear",
            action="store_true",
            help="Delete existing employees before seeding.",
        )

    def handle(self, *_args, **options):
        created = seed_employees_in_transaction(
            count=options["count"],
            seed=options["seed"],
            clear=options["clear"],
        )
        self.stdout.write(self.style.SUCCESS(f"Seeded {created} employees."))
