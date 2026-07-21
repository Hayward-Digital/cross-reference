# Hayward Cross-Reference Tool

An interactive React single-page application (SPA) that functions as a "Cross Reference" tool for displaying equivalent Hayward products and recommended upgrades. It integrates directly with Hayward's Magento REST API to fetch real-time catalog and product details.

---

## 📌 Deployment Architecture

The application uses relative routing controlled via React Router's `basename`. **You must configure `src/index.js` before running or building the application.**

### Environment Setup Matrix

| Environment | Router Basename (in `src/index.js`) | Target Magento Path / URL | Purpose |
| :--- | :--- | :--- | :--- |
| **Production** | `/support/resources/tools/cross-reference` | `https://hayward.com/support/resources/tools/cross-reference` | Public Production Environment |
| **Staging / QA** | `/support/resources/tools/cross-reference-2` | `https://hayward.com/support/resources/tools/cross-reference-2` | Sandbox/Test Environment |
| **Development** | `/support/resources/tools/cross-reference` | `http://localhost:3000/support/resources/tools/cross-reference` | Local testing (Requires full path) |

> [!WARNING]
> If you run the project locally with `npm start` and attempt to navigate to `http://localhost:3000/` directly without appending the configured `basename` (e.g. `/support/resources/tools/cross-reference`), the page **will render completely blank** because the router fails to match the root URL.

---

## 🚀 Step-by-Step Deployment Guide

Follow these steps to build and publish updates to Magento:

1. **Configure Environment**  
   Open `src/index.js` and set the correct `basename` string inside the `<BrowserRouter>` component matching your target environment.

2. **Generate Optimized Bundle**  
   Compile the React production build:
   ```bash
   npm run build
   ```
   This generates static assets in the `/build` directory.

3. **Deploy Assets**  
   Upload the compiled `/build` directory assets to the web server path mapping to `/cross-reference/` on the Magento server.

4. **Update Magento CMS Block / Page**  
   Integrate the application inside the target Magento page by embedding the following structure:
   * **HTML Container**:
     ```html
     <div id="root"></div>
     ```
   * **JS Script Tag** (Find the compiled JS filename from `build/static/js/`):
     ```html
     <script defer="defer" src="/cross-reference/static/js/main.[hash].js"></script>
     ```
   * **CSS Stylesheet Tag** (Find the compiled CSS filename from `build/static/css/`):
     ```html
     <link href="/cross-reference/static/css/main.[hash].css" rel="stylesheet">
     ```

---

## 🔑 Magento API Integration

The application pulls technical details and media (images, specifications) for recommended Hayward SKUs directly from the Magento V1 REST endpoint.

* **Configuration File**: `src/modules/models/Alternatives.js`
* **API Endpoint**: `https://www.hayward.com/rest/default/V1/products/${sku}`
* **Headers**:
  ```http
  Authorization: Bearer [YOUR_MAGENTO_API_TOKEN]
  ```

---

## 💻 Local Development

### Prerequisites
* **Node.js**: `v18.x` or higher (Recommended)
* **Package Manager**: `npm`

### Installation
Clone the repository and install project dependencies:
```bash
npm install
```

### Running the App
Start the local development server:
```bash
npm start
```
*The React development server runs on port `3000` by default. If port `3000` is already in use, you can bind it to a different port by running:*
```bash
PORT=3002 npm start
```
*Ensure you access the app with the basename prefix:* `http://localhost:3002/support/resources/tools/cross-reference`
