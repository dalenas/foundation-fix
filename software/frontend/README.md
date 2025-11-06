# 💄 Blush Connect Studio  
*A Bluetooth-powered foundation mixing and profile platform*



> **Blush Connect Studio** is a minimalist, soft-pink web app that connects directly to a **custom foundation mixing machine** via Bluetooth.  
> Users can create personal beauty profiles, record their perfect formulas, attach photos, and automatically mix their ideal foundation tone every time.

---

## ✨ Features

| Area | Description |
|------|--------------|
| 🧠 **Profiles** | Create, customize, and manage user profiles with preferences, tone, and finish. |
| 🎨 **Formula Library** | Save, browse, and recall custom foundation shades for each profile. |
| 🔗 **Bluetooth Device Link** | Pair your foundation machine, monitor connection, and send mix commands in real time. |
| 📸 **Photo & Note Storage** | Attach reference photos, skin conditions, and notes to each formula. |
| 💾 **Local-First Storage** | Uses IndexedDB for offline persistence; optional Supabase backend for cloud sync. |
| 🪞 **Minimalist UI** | Elegant blush palette, gentle shadows, rounded edges, smooth transitions. |

---

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



