This is a [Next.js](https://nextjs.org/) project bootstrapped with [`create-next-app`](https://github.com/vercel/next.js/tree/canary/packages/create-next-app).

# Overview of architecture

- Smart contracts for the "backend" (the Hydro and Tribute contracts)
- NextJS app for the front-end
- TailwindCSS for styles
- Cosmos-Kit for chain stuff
- Netlify for deployments
- Supabase for data storage

# Getting Started

Because we're hosted by Netlify, you can technically work two ways. I recommend using the Netlify CLI, but you can use the ol' fashioned way if you don't need to build any data:

```bash
npm install
npm run dev
```

That defaults to port 3000. Otherwise, using the Netlify CLI:

```bash
npm install
npm install -g netlify-cli
netlify dev
```

That will default to port 8888. You can start editing the page by modifying `app/page.tsx`. Visit http://localhost:8888 to see it running. The page auto-updates as you edit the file.

# Building data

Data is built with four scheduled cloud functions, found in the `/functions` directory, and written to Supbase files prefixed with `NEXT_PUBLIC_SUPABASE_DATA_NAMESPACE` and two dashes. For example, production's round data is at `../main--raw-hydro-round-data.json`. Make sure you set this env variable before executing any of the functions locally.

The app itself only reads from the static files on Supabase; the cloud functions do the writing.

| Function Name                                     | Description                                                                    |
| ------------------------------------------------- | ------------------------------------------------------------------------------ |
| `scheduled-build-hydro-meta-data`                 | Makes a couple queries for "top-level" metadata about the round, lockups, etc. |
| `scheduled-build-external-data`                   | Fetches data from github and other external data sources                       |
| `scheduled-build-hydro-round-data-in-background`  | Builds the core data for all bids from all rounds                              |
| `scheduled-build-staging-next-data-in-background` | Every 15 minutes, fetches `/api/build-data` endpoint on `staging-next`\*       |

\* The [`staging-next`](https://staging-next--hydro-staging.netlify.app) site is just a branch deployment, and **only the published production deploy will automatically run its scheduled functions.**

To build data for your own local development:

- Set `NEXT_PUBLIC_SUPABASE_DATA_NAMESPACE` to your name, your branch name, or anything. Just something that isn't `main` or `staging` :P Coverts whatever you give to a "kebab-cased-string-like-this"
- In one terminal, you must be running `netlify dev`
- Execute the command for whichever function you want to trigger:
  - `netlify functions:invoke function-name-goes-here --port 8888`
  - Look for the output message telling you it was written to Supabase
- Load the app and it will fetch the data assigned to your `NEXT_PUBLIC_SUPABASE_DATA_NAMESPACE`

Alternatively, you can just visit [`http://localhost:3000/api/build-data`](http://localhost:3000/api/build-data) in your browser while the dev server is running.

## To use production data:

- NEVER set `NEXT_PUBLIC_SUPABASE_DATA_NAMESPACE` to `main` and start executing functions unless you known what you're doing. That's production data and scheduled cloud functions are always writing to it anyway, so there's no real need to do this unless you're trying to jump the schedule and rebuild production data right now.
- Knowing that, you can set `NEXT_PUBLIC_SUPABASE_DATA_NAMESPACE` to `main` and the app will fetch the data for the `main` namespace on Supabase — the same data that production uses.

# Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js/) - your feedback and contributions are welcome!

# Deploy on Netlify

Every branch pushed to the repo will be auto-deployed by Netlify and can be accessed at `https://your-branch-name--hydro-staging.netlify.app`.

# Data on Supabase

The data is stored in our Supabase account's only bucket, "raw-backend-data". To get access, check the team's 1Password vault. You generally shouldn't need access to the bucket besides the reading + writing the app does for you though.
