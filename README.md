# Recolour Case Study - Full-Stack Solution

A comprehensive workflow management system for garment recolouring, built with **Vue 3** and **Express.js**. This project fulfills all requirements specified in the technical assessment, including advanced status workflows and management dashboards.

## 🚀 Getting Started

### Prerequisites
- Node.js (v18+)
- npm

### 1. Backend Setup
```bash
cd recolour-backend
npm install
# Seed the database with initial assets from the recolour-case folder
node src/database/seed.js
# Start the server
node src/app.js
```
The backend runs at `http://localhost:3000`. API documentation is available at `/api-docs`.

### 2. Frontend Setup
```bash
cd recoulour-frontend
npm install
npm run serve
```
The frontend runs at `http://localhost:8080`.

---

## ✨ Requirements Fulfilled

### 1. Recolour Ticket Creation
- **Dynamic Form:** Allows users to create tickets by selecting multiple base photos from the library.
- **Data Capture:** Supports style names, priority levels, reference codes, target colors, and partner assignments.

### 2. Ticket Queue & Lifecycle
- **Advanced Table:** A high-performance `DataTable` with global search, status filtering, and sorting.
- **Workflow Transitions:** Implements the full lifecycle: `Pending -> Approved -> Sent -> In Progress -> Completed`.
- **Contextual Actions:** Action buttons appear dynamically based on the ticket's current status and the user's role.

### 3. Partner Integration
- **Simulated Workflow:** Includes a "Partners" view and integration within the queue.
- **Validation:** The "Send to Partner" action is intelligently disabled unless a partner is assigned to the ticket, preventing workflow errors.

### 4. Approval & Storage
- **Two-Step Approval:** Final recoloured results must be approved by a Manager before being stored.
- **Automated Storage:** Approved photos are automatically categorized and displayed in the **Approved Library**.
- **Rejection Loop:** Rejection of a completed photo automatically resets the ticket to `Pending`, returning it to the work queue for correction.

### 5. Navigation & UX
- **Sidebar & Navbar:** Full navigation system including Dashboard, Create Ticket, Queue, Approved Library, and Partner Overview.
- **Visual Feedback:** Real-time toast notifications for all status changes and operations.

### 6. "Nice to Have" Features (Bonus)
- **Role-Based Access (RBAC):** Integrated a simulated Auth system. "Operators" can create and view tickets, while "Managers" have exclusive rights to approve, reject, and send tickets.
- **Operations Dashboard:** A rich KPI dashboard providing real-time metrics on queue health, awaiting approvals, and recent activity.

---

## 🛠 Technical Stack & Decisions

- **Frontend:** Vue 3 (Composition API) + PrimeVue 4. The theme uses a custom dark-mode aesthetic for a professional creative-tools feel.
- **State:** Pinia is used for auth and global state management.
- **Backend:** Node.js/Express with Sequelize ORM.
- **Database:** SQLite was selected for the "Boss" move of providing a zero-config, portable database that works immediately upon seeding.
- **Simulation Logic:** To ensure the library feels "alive" without a real image processing engine, the backend automatically generates simulated "Recoloured" asset records when tickets are completed.

---
*Developed as a comprehensive technical solution for the Recolour assessment.*
