"""Change opening hours to JSONB

Revision ID: 4a19f966399f
Revises: 89c54d053f59
Create Date: 2026-08-28
"""

from alembic import op
import sqlalchemy as sa
from sqlalchemy.dialects import postgresql


revision = "4a19f966399f"
down_revision = "89c54d053f59"
branch_labels = None
depends_on = None


def upgrade():

    # Convert existing TEXT values into JSONB.
    #
    # Valid JSON strings are converted directly.
    # Existing values such as "24 hours" are converted
    # into a structured weekly schedule.

    op.execute("""
        ALTER TABLE facilities
        ALTER COLUMN opening_hours
        TYPE JSONB
        USING (
            CASE

                WHEN opening_hours IS NULL
                    THEN NULL

                WHEN trim(opening_hours) = ''
                    THEN NULL

                WHEN trim(opening_hours) = '24 hours'
                    THEN jsonb_build_object(
                        'monday', 'Open 24 hours',
                        'tuesday', 'Open 24 hours',
                        'wednesday', 'Open 24 hours',
                        'thursday', 'Open 24 hours',
                        'friday', 'Open 24 hours',
                        'saturday', 'Open 24 hours',
                        'sunday', 'Open 24 hours'
                    )

                WHEN left(trim(opening_hours), 1) = '{'
                    THEN opening_hours::jsonb

                ELSE
                    jsonb_build_object(
                        'monday', opening_hours,
                        'tuesday', opening_hours,
                        'wednesday', opening_hours,
                        'thursday', opening_hours,
                        'friday', opening_hours,
                        'saturday', opening_hours,
                        'sunday', opening_hours
                    )

            END
        );
    """)


def downgrade():

    op.execute("""
        ALTER TABLE facilities
        ALTER COLUMN opening_hours
        TYPE TEXT
        USING opening_hours::text;
    """)


    # ### end Alembic commands ##
