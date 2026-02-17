# swap 📝

Linux Society's portal for managing subcommittee applications.

## Developing

Install dependencies with `pnpm install`.

Afterwards you can start a development server:

```sh
npm run dev

# or start the server and open the app in a new browser tab
npm run dev -- --open
```

## Building

To create a production version of your app:

```sh
npm run build
```

You can preview the production build with `npm run preview`.

## CI/CD

The `main` branch is automatically deployed to Cloudflare Workers.
