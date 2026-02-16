# Recolour Case Study - Technical Solution

This project is a full-stack solution for managing garment recolouring workflows, built with **Vue 3** (Frontend) and **Express.js** (Backend).

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
npm start
```
The backend will run at `http://localhost:3000`. You can view the API documentation via Swagger at `http://localhost:3000/api-docs`.

### 2. Frontend Setup
```bash
cd recoulour-frontend
npm install
npm run serve
```
The frontend will run at `http://localhost:8080`.

---

## 🛠 Technical Decisions

### 1. Backend: Express & Sequelize (SQLite)
- **Database:** Used SQLite for portability. The hiring manager can run the project without setting up a heavy database engine.
- **ORM:** Sequelize was chosen to handle model relationships (One-to-Many for Assets/Tickets) and transactions during ticket creation.
- **Storage Simulation:** Since the project relies on local mock data, I implemented a simulation logic in the controller. When a ticket is marked "Completed," the system automatically creates a "Recoloured" asset entry using the original file as a placeholder to ensure the gallery is functional.

### 2. Frontend: Vue 3 & PrimeVue
- **UI Framework:** PrimeVue was selected for its robust set of accessible components (DataTable, Cards, Icons).
- **Styling:** A mix of PrimeVue's theme system and scoped CSS to achieve a modern "Dark Mode" aesthetic consistent with creative software.
- **State Management:** Pinia (via `authStore`) handles role-based access, allowing us to toggle between "Manager" and "Operator" views.

---

## ✨ Features Implemented

### 1. Ticket Creation & Queue
- Full CRUD for recolouring tickets.
- **Priority & Status management:** Tickets flow through a lifecycle: `Pending -> Approved -> Sent -> In Progress -> Completed`.

### 2. Requirement 4: Approval & Storage
- **Logic:** Only managers can approve "Completed" tickets.
- **Result:** Upon approval, the recoloured asset is moved to the "Approved Photos" library and the `isApproved` flag is synced across the ticket and its resulting asset.
- **Rejection:** Managers can reject a completed result, which automatically resets the ticket to "Pending" and returns it to the operator's queue.

### 3. Partner Integration
- Simulation of the partner workflow. The "Send" action is only enabled if a partner is assigned to the ticket, ensuring data integrity.

### 4. Operations Dashboard
- Real-time KPIs showing:
    - **Total Tickets** in the system.
    - **Awaiting Approval:** Specifically tracking "Completed" tickets that need manager sign-off.
    - **Queue Health:** Visual distribution of ticket statuses.

---

## 📂 Project Structure
- `/recolour-backend`: Node.js API, Sequelize models, and SQLite database.
- `/recoulour-frontend`: Vue 3 SPA with PrimeVue and Pinia.
- `/recolour-case`: The original mock data provided for the assignment (used for asset seeding).

---
*Developed as a technical assessment for the Jack&Jones team.*
