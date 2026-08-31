"""Add users and resource ownership.

Revision ID: b9c2d7e4f1a0
Revises: 4a19f966399f
Create Date: 2026-08-30
"""

from alembic import op
import sqlalchemy as sa


revision = "b9c2d7e4f1a0"
down_revision = "4a19f966399f"
branch_labels = None
depends_on = None


def upgrade():
    op.create_table(
        "users",
        sa.Column("id", sa.Integer(), nullable=False),
        sa.Column("email", sa.String(length=254), nullable=False),
        sa.Column("password_hash", sa.String(length=255), nullable=False),
        sa.Column("token_version", sa.Integer(), nullable=False, server_default="0"),
        sa.Column("created_at", sa.DateTime(), nullable=False),
        sa.PrimaryKeyConstraint("id"),
        sa.UniqueConstraint("email"),
    )
    op.create_index("ix_users_email", "users", ["email"], unique=False)

    # Existing catalogue records are intentionally left unowned and therefore
    # read-only. Records created through the API always receive an owner.
    op.add_column("facilities", sa.Column("owner_id", sa.Integer(), nullable=True))
    op.add_column("services", sa.Column("owner_id", sa.Integer(), nullable=True))
    op.create_foreign_key("fk_facilities_owner", "facilities", "users", ["owner_id"], ["id"], ondelete="RESTRICT")
    op.create_foreign_key("fk_services_owner", "services", "users", ["owner_id"], ["id"], ondelete="RESTRICT")
    op.create_index("ix_facilities_owner_id", "facilities", ["owner_id"], unique=False)
    op.create_index("ix_services_owner_id", "services", ["owner_id"], unique=False)

    op.drop_constraint("services_name_key", "services", type_="unique")
    op.create_unique_constraint("uq_services_owner_name", "services", ["owner_id", "name"])


def downgrade():
    op.drop_constraint("uq_services_owner_name", "services", type_="unique")
    op.create_unique_constraint("services_name_key", "services", ["name"])
    op.drop_index("ix_services_owner_id", table_name="services")
    op.drop_index("ix_facilities_owner_id", table_name="facilities")
    op.drop_constraint("fk_services_owner", "services", type_="foreignkey")
    op.drop_constraint("fk_facilities_owner", "facilities", type_="foreignkey")
    op.drop_column("services", "owner_id")
    op.drop_column("facilities", "owner_id")
    op.drop_index("ix_users_email", table_name="users")
    op.drop_table("users")
