## Making database changes with Prisma
**any migration files checked into the GitHub repo will be applied to the Preview database instance shared by all preview branches**.

Instead of creating migrations and applying them immediately with `pnpm dlx prisma migrate dev`, you should _always_ use `pnpm dlx prisma db push` to apply the schema changes without generating a migration. Once you are happy with your schema changes, you can generate a migration using `pnpm dlx prisma migrate dev`.

If you need to see what SQL is generated for a potential schema change before applying it, you can run:

```zsh
pnpm dlx prisma migrate dev --create-only
```