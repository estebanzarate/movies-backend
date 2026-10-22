export const up = (pgm) => {
  pgm.createTable("users", {
    id: {
      type: "bigint",
      primaryKey: true,
      generated: { always: true, as: "identity" },
    },
    email: {
      type: "varchar(254)",
      notNull: true,
      unique: true,
    },
    password_hash: {
      type: "text",
      notNull: true,
    },
    created_at: {
      type: "timestamptz",
      notNull: true,
      default: pgm.func("CURRENT_TIMESTAMP"),
    },
    updated_at: {
      type: "timestamptz",
      notNull: true,
      default: pgm.func("CURRENT_TIMESTAMP"),
    },
  });

  pgm.addConstraint("users", "users_email_not_blank", {
    check: "length(trim(email)) > 0",
  });

  pgm.addConstraint("users", "users_password_hash_not_blank", {
    check: "length(trim(password_hash)) > 0",
  });
};

export const down = (pgm) => {
  pgm.dropTable("users");
};
