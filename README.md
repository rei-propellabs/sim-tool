# Getting Started with Vite

This project was originally bootstrapped with [Create React App](https://github.com/facebook/create-react-app) and later migrated to [Vite](https://vitejs.dev/) for better performance and faster development experience.

## Available Scripts

In the project directory, you can run:

### `npm run dev`

Runs the app in development mode with hot module replacement.\
Open [http://localhost:3000](http://localhost:3000) to view it in the browser.

The page will reload instantly when you make edits.\
You will also see any lint errors in the console.

### `npm test`

Launches the test runner in the interactive watch mode.\
See the section about [running tests](https://vitest.dev/guide/) for more information.

### `npm run build:staging`
### `npm run build:prod`
Builds the app for production to the `dist` folder.\
It correctly bundles React in production mode and optimizes the build for the best performance.

The build is minified and the filenames include the hashes.\
Your app is ready to be deployed!

### `npm run preview`

Locally preview the production build.\
This serves the `dist` folder on a local server to test the production build.

## Environment Settings
Set the proper base urls in
.env
.env.staging
.env.prod

Example: VITE_API_BASE_URL=https://{base_url}

## Project Structure

This project uses absolute imports with the `@` alias:

## Learn More

You can learn more in the [Vite documentation](https://vitejs.dev/guide/).

To learn React, check out the [React documentation](https://reactjs.org/).

For build tool migration information, see the [Vite migration guide](https://vitejs.dev/guide/migration.html).