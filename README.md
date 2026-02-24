# Drug Pricing Simulator

A full-stack application for simulating drug pricing models.

## Project Structure

```
drug_simulator/
├── web/          # React frontend (Vite + TypeScript + Tailwind)
├── api/          # Express backend API
└── README.md
```

## Getting Started

### Frontend (Web)

```bash
cd web
npm install
npm run dev
```

The frontend will run on `http://localhost:3000`

### Backend (API)

```bash
cd api
npm install
npm run dev
```

The API will run on `http://localhost:5000`

## Features

- **Pricing Models**: Initial Response and Fixed Discount
- **Real-time Calculations**: Debounced form updates
- **Form Validation**: Zod schema validation
- **Responsive Design**: Tailwind CSS with shadcn/ui-inspired styling

## Tech Stack

### Frontend
- React 19
- TypeScript
- Vite
- Tailwind CSS v4
- Formik + Zod

### Backend
- Node.js
- Express
- CORS enabled
