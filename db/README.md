## Making database changes with Prisma
If you change data modal by updating schema, you can run this in root to db push and generate types for app.

```zsh
pnpm prisma
```

If you need to see what SQL is generated for a potential schema change before applying it, you can run:

```zsh
pnpm dlx prisma migrate dev --create-only
```