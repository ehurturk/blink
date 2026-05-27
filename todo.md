Todo for CI:
1) Install node v20 and npm
2) Create a vite project:
`npm create vite@latest`
- Pick React and TypeScript
- Run the Vite server with `npm un dev`

3) In package.json, add these:
```json
"typecheck": "tsc --noEmit",
"lint": "eslint ."
```

4) Push these and the project into a feature branch

5) Open PR into main and accept it

6) Watch the actions workflow

7) Once the action passes, add branch protection rule for the main branch by
going Settings -> Branches -> add a branch prot rule for main requiring the `test`
job to pass before merging to main


Once vite and react and actions are configured, we can add
Vitest for unit testing.


For continuous deployment, we can use Vercel to automatically deploy
to Vercel services, although we can also use Cloudflare pages to easily deploy
to cloudflare and host backend at Cloudflare serverless functions. Up to us i guess


One thing to note:
- WE may want to store the built website as an artefact, so we may uncomment that from the
  ci script.
