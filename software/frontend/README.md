## 🧰 Tech Stack

- **React + Vite + TypeScript** — fast dev & production build
- **TailwindCSS** — modern styling with custom pink palette
- **Lucide Icons** — clean vector icon set
- **Web Bluetooth API** — connect to the custom foundation machine
- **IndexedDB (`idb`)** — local storage for user profiles and photos
- *(Optional)* **Supabase** — for cloud backup, image hosting, and multi-device sync

---

## 📦 Project Setup

```bash
# 1. Create the project
npm create vite@latest blush-connect-studio -- --template react-ts
cd blush-connect-studio

# 2. Install dependencies
npm install idb lucide-react react-router-dom
npm install -D tailwindcss postcss autoprefixer
npx tailwindcss init -p

# 3. Run the dev server
npm run dev



