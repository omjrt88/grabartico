You are an expert full-stack software architect and senior developer. I need you to generate a comprehensive technical specification, database schema, and the foundational boilerplate code for a custom e-commerce web application tailored for a startup in Costa Rica that sells laser-engraved products.

The tech stack must be:
- Frontend: Angular (latest stable version)
- Backend: Node.js (Express or NestJS)
- Database: PostgreSQL

The entire user-facing interface, admin panel, and system messages must be in Spanish, and the currency used must be Costa Rican Colones (₡).

---

## 1. Core Features & Workflow

### A. Customer-Facing Storefront
1. **Dynamic Product Customization:** - Customers can view products (e.g., coasters) and select multiple characteristics: **Material** (cork, stone, wood, ceramic), **Color**, and **Shape**.
   - Each characteristic selection can dynamically modify the base price.
   - **Dynamic Image Carousel:** The product images must filter dynamically based on the selected characteristics (e.g., if "Stone" is selected, do not show "Wood" images).
2. **Engraving Options:**
   - **Custom Upload:** Customer can upload their own image/vector for engraving during the checkout process.
   - **Pre-defined Designs:** Customer can choose from a gallery of designs uploaded by the admin specifically for that product.
3. **Shopping Cart:** Standard CRUD functionality (add, update quantities, remove items).

### B. Custom Localized Checkout Workflow (No Payment Gateway)
Instead of a standard credit card payment gateway, the checkout follows a manual verification workflow typical in Costa Rica:
1. **Order Submission:** The user finalizes their cart.
2. **Voucher Upload Page:** The site prompts the user to upload a payment receipt/proof (PDF or image/screenshot only) showing they performed a bank transfer or **SINPE Móvil** payment.
3. **Delivery Address:** The user provides a shipping address. If they are logged into their customer profile, it should pull or save to their default address. Shipping is handled via **Correos de Costa Rica**.
4. **Initial Order State:** Upon submission, the order enters the **"Esperando Pago"** (Waiting Payment) state.

### C. Admin Panel & Order Lifecycle Management
The admin panel must manage the custom order states sequentially:
1. **"Esperando Pago"** (Waiting Payment) -> System automatically sets this when the user uploads a voucher.
2. **"Verificando Pago"** (Checking Payment) -> Set when an admin opens the order to review the uploaded PDF/image voucher against their bank records.
3. **"En Progreso"** (In Progress) -> Set when the admin confirms the payment is legit and begins laser-engraving the items.
4. **"Enviado por Correos de Costa Rica"** (Sent) -> Set when the admin ships the package and enters tracking information.
5. **"Entregado y Completado"** (Delivered & Completed) -> Set manually or via webhook when Correos de Costa Rica confirms delivery.

### D. Admin Configuration & Inventory Features
- **Product Management:** Full CRUD for products, prices, and stock.
- **Dynamic Image Mapping:** Ability to upload images and tag them with specific characteristic combinations (e.g., Tag: `Material: Wood, Shape: Round`) to drive the frontend carousel.
- **Stock Management:** Automatic stock deduction upon completed orders, with the ability for the admin to manually override/update stock levels.
- **Content Management:** Ability to configure system messages, order statuses, and customer information.

---

## 2. Technical Deliverables Required

Please provide:

### Step 1: Database Schema (PostgreSQL)
- Design a relational schema using SQL or a Prisma/Sequelize ORM structure. 
- Include tables for `Usuarios` (Admin/Customer roles), `Clientes` (with default addresses), `Productos`, `Atributos_Producto` (Materials, Colors, Shapes, Prices), `Imagenes_Producto` (with attribute mapping), `Disenos_Predeterminados`, `Pedidos` (Orders), `Detalles_Pedido` (Order Items, chosen attributes, custom engraving image URL), and `Historial_Estados` (Order state tracking).

### Step 2: Backend Architecture (Node.js)
- Outline the REST API endpoints required for both the client (Cart, Checkout, Upload) and Admin (Product management, Order status updates).
- Include file upload logic handling (using a local storage strategy or AWS S3/Cloudinary) restricted strictly to Images and PDFs for the payment vouchers and customer engravings.

### Step 3: Frontend Architecture (Angular)
- Define the application structure (Modules/Components for Store, Cart, Customizer, Checkout, Admin Dashboard).
- Explain the state management strategy for handling the dynamic image carousel filtering and real-time price calculations based on selected product characteristics.

Please start by generating the PostgreSQL Database Schema and the API route architecture.