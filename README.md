# Zesty Food - Food Info Site
1. Demo  link: https://react-food-info-git-main-realmastergods-projects.vercel.app/

# Table of Content

1. About The App
2. Problem Statement and Workarounds
3. Technologies
4. Prerequisites
5. Setup
6. Status/To-Do

# 1. About The App
Food Info site/store where you can search scroll through a list of food items. You can load more food items using the load more button which fetches data from 
open food facts API (Refer to https://world.openfoodfacts.org/files/api-documentation.html) which is great open source food database. You can search for products
in the list by typing their name or even barcode for global search through all products in database. You can also sort this data by product name or nutritional grade. You can apply category filter which fetches a new list from the api. You can again search or sort this or fetch more data. Click on a product's name will take you to single product page. Here you can see additional product info.
There is also a cart feature which persists so whatever you add to cart will stay (unless you delete it from the localStorage). The site is fully responsive for all
devices.

# 2. Problem Statement and Workarounds
1. Problem: Fetch Data from open food facts api.
  Solution: Used axios to fetch the data

2. Problem: Create a search by name and barcode functionality
   Solution: For Searching by name its easy I just created a state that changes when user type something (it has debounce time of 300ms though its not needed as we
   are not making any api call here). For Search By Barcode
   it's similar but here I am making api call for a global search through all products in database so it use a must have debounce time (500ms)
   so I dont overload the external api with requests for each letter that user types.
   Use lodash.debounce library for this.
   ```bash
   npm i lodash.debounce
   ```
3. Problem: Create a Sort filter
   Solution: Similar to search filter. Here I check if the sort state variable has a value other than undefined then sort the product list.
   (Note that there are two product lists one is the normal list where no category filter is applied and another is filtered products list where
   category filter is applied. Load more functionality works for both list as well as all search and sort filter. However normal list is permanant when you load more
   whereas filtered list changes again when you change the category.)
5. Problem: Load More functionality
   Solution: Created two states fpage for filtered products when category is applied so you can fetch more products of same category and page for normal products
   so you can fetch data when no category is applied. Either fpage or page increments when you click load more and make api call tp fetch data for next page.

6. Problem: Cart Feature
   Solution: This is easy just used redux and redux persist feature to add and remove products from cart. It check if a product is already in cart
   if it is then you cant add this product to cart again.

# 3. Technologies
I have used ReactJs, Vite to create the frontend and Redux Tookit for state management and to persist the cart in local Storage and manage the products. It uses
open food facts api (refer to https://world.openfoodfacts.org/files/api-documentation.html for more info).

## React + Vite

This template provides a minimal setup to get React working in Vite with HMR and some ESLint rules.

Currently, two official plugins are available:

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react/README.md) uses [Babel](https://babeljs.io/) for Fast Refresh
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react-swc) uses [SWC](https://swc.rs/) for Fast Refresh

### To create your own react + vite app run this command:
```bash
npm create vite@latest --your-app-name -- --template react
```
Or you may refer to https://vitejs.dev/guide/   for more details.

## Redux Tookit
Using this to manage the state of cart and products in the app
Learn more about redux toolkit
- https://redux-toolkit.js.org/
- To use redux in your projects just run the following commands:
  ```bash
  npm install react-redux @reduxjs/toolkit
  ```

## Material UI 
Material UI is easy to use and provides a ton of choices for each component/icon. Chances are if you are looking for 
an icon or a component, they have it.

Refer to the offical site to get started with material ui : https://mui.com/material-ui/getting-started/

## TailwindCSS
It's a great framework to build custom ui fast. The learning curve is also very small as it's just fancy css.

To set up tailwindCSS in react + vite app, run this command in working directory where you created the react vite app
```bash
npm install -D tailwindcss postcss autoprefixer
npx tailwindcss init -p
```
Now open the tailwind.config.js file and replace the code with the code below
```bash
/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {},
  },
  plugins: [],
}
```
In your project there must be an index.css or global.css. Paste these three lines of code at the top of that file
```bash
@tailwind base;
@tailwind components;
@tailwind utilities;
```
Now, just ren your react app.
Need more info? See here: https://tailwindcss.com/docs/guides/vite

## Open Food Facts API
You can use this api to get information about various food item. The database is huge and iss constantly getting bigger and bigger.
If you are looking for something do with food products and their various traits then you should definitely check it out.
Site: https://world.openfoodfacts.org/files/api-documentation.html

# 3. Prerequisites
## Install Node Package Manager
Refer to https://docs.npmjs.com/downloading-and-installing-node-js-and-npm

# 5. Setup To Run Locally
1. Clone this repo and go to this directory and open terminal here
2. type the following commands:
   ```bash
   npm install && npm run dev
   ```
3. Once it is completed. You'll see on console a url like htto://localhost:1573 or something similar. Just go to this url on your browser and now it will run.
4. NOTE: Since data is being fetched from external api sometimes it may not fetch data and show an error. In that case just reload. If it persists then contact me
   and I'll look into it if the problem is in the app.

# 6. Status/To-Do
- Create a About Page
- Create a Contact Page
- Create Login/SignIn features (You will see these buttons but they aren't working) 
