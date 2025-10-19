# Demo installation instructions
This react project requires 'npm', 'Node.js' and python 3.12+

Node.js can be downloaded from the [Node.Js](https://nodejs.org/en/download) website

Python can be downloaded from [Download Python](https://www.python.org/downloads/)

To download the latest version of npm, on the command line, run the following command: npm install -g npm

To run this demo you must first clone it and install its' dependencies on the command line

Navigate to the directory of the demo with: cd /demo/directory

Then install dependencies with: npm install

Install backend dependencies with: pip install -r ./Backend/CSSASiteBackend/requirements.txt

Once it is finished, you can run the demo frontend with: npm run dev

And run demo backend with: python ./Backend/CSSASiteBackend/manage.py runserver

Then simply enter 'localhost:5173' in your browser of choice

# Peer Dependencies
@radix-ui/react-navigation-menu: ^1.2.13  
@tailwindcss/vite: ^4.1.11  
class-variance-authority: ^0.7.1  
clsx: ^2.1.1  
jquery: ^3.7.1  
lodash: ^4.17.21  
lucide-react: ^0.535.0  
motion: ^12.23.12  
next: ^15.4.5  
nouislider: ^15.8.1  
plyr: ^3.7.8  
preline: ^3.2.3  
react: ^19.1.0  
react-dom: ^19.1.0  
react-icons: ^5.5.0  
react-router-dom: ^7.7.1  
tailwind-merge: ^3.3.1  
tailwindcss: ^4.1.11  
vanilla-calendar-pro: ^3.0.5  

# Dev Dependencies
@eslint/js: ^9.30.1  
@types/jquery: ^3.5.33  
@types/lodash: ^4.17.20  
@types/node: ^24.1.0  
@types/react: ^19.2.2  
@types/react-dom: ^19.1.6  
@vitejs/plugin-react-swc: ^3.10.2  
eslint: ^9.30.1  
eslint-plugin-react-hooks: ^5.2.0  
eslint-plugin-react-refresh: ^0.4.20  
globals: ^16.3.0  
tw-animate-css: ^1.3.6  
typescript: ~5.8.3  
typescript-eslint: ^8.35.1  
vite: ^7.0.4  

# Backend dependencies
Listed in Backend/CSSASiteBackend/requirements.txt:
asgiref==3.10.0
Django==5.2.7
django-rest-knox==5.0.2
djangorestframework==3.16.1
sqlparse==0.5.3
django-cors-headers==4.6.0

