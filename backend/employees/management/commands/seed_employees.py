from pathlib import Path

from django.core.management.base import BaseCommand, CommandError

from employees.seed import DEFAULT_BATCH_SIZE, DEFAULT_COUNT, seed_employees


class Command(BaseCommand):
    help = "Seed employees from data/first_names.txt and data/last_names.txt."

    def add_arguments(self, parser):
        parser.add_argument(
            "--count",
            type=int,
            default=DEFAULT_COUNT,
            help=f"Number of employees to create (default: {DEFAULT_COUNT}).",
        )
        parser.add_argument(
            "--batch-size",
            type=int,
            default=DEFAULT_BATCH_SIZE,
            help=f"Rows per bulk_create batch (default: {DEFAULT_BATCH_SIZE}).",
        )
        parser.add_argument(
            "--data-dir",
            type=str,
            default="",
            help="Directory containing first_names.txt and last_names.txt (default: project data/).",
        )
        parser.add_argument(
            "--no-clear",
            action="store_true",
            help="Do not delete existing employees before seeding.",
        )

    def handle(self, *args, **options):
        count = options["count"]
        if count < 1:
            raise CommandError("--count must be at least 1.")

        batch_size = options["batch_size"]
        if batch_size < 1:
            raise CommandError("--batch-size must be at least 1.")

        data_dir = Path(options["data_dir"]) if options["data_dir"] else None

        try:
            created = seed_employees(
                count=count,
                batch_size=batch_size,
                data_dir=data_dir,
                clear=not options["no_clear"],
            )
        except ValueError as exc:
            raise CommandError(str(exc)) from exc

        self.stdout.write(self.style.SUCCESS(f"Created {created} employees."))
