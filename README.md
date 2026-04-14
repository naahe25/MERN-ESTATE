 Vite Client Setup
____________________
npm create vite@latest client
cd client
npm install

 TailwindCSS Setup
____________________
npm install tailwindcss @tailwindcss/vite
npm install -D tailwindcss postcss autoprefixer

 React Plugin (if missing)
____________________________
npm install @vitejs/plugin-react

 Tailwind Config (optional for v3, skip for v4)
_________________________________________________
npx tailwindcss init -p

 Run Development Server
_________________________
npm run dev