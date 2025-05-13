# Netlify Deployment Instructions

This project uses Vite for the client-side build and esbuild for the server-side build.

## Build the Project

Run the following command or use the provided `run-build.bat` script (Windows) to build the project:

```
npm run build
```

This will generate the client build output in the `dist/public` folder.

## Deploy to Netlify

1. Log in to your Netlify account.
2. Create a new site and connect your Git repository or choose manual deploy.
3. When configuring the deploy settings, set the **Publish directory** to:

```
dist/public
```

4. Deploy the site.

Your client-side app will be served from Netlify.

## Notes

- The server-side build is output to `dist` but is not needed for Netlify static hosting.
- Make sure your client app uses relative paths (the Vite config sets `base: './'` for this purpose).

If you have any questions, please ask.
