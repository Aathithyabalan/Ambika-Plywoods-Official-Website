# 🌲 Ambika Playwoods Official Website

> **Official web application for Ambika Playwoods & Hardwares (Dindigul, Tamil Nadu)**  
> Premium UV Glass Printing, Toughened Glass, Laminates, Waterproof Plywood, Hardware, Alangaram Interiors & Negizhi uPVC Solutions.

---

## 📌 Overview

**Ambika Playwoods** is a premier supplier of high-quality building materials, glass solutions, laminates, and interior hardware based in Dindigul, Tamil Nadu. Authorized dealer for industry-leading brands including **Saint-Gobain**, **Asian Paints**, **Kitply**, **Mikasa**, **Greenply**, **Hettich**, and **Häfele**.

This web application provides a modern, fully responsive, interactive showcase of products, custom glass work portfolios, dynamic pricing quotation calculators, client reviews, and an integrated Admin Management Panel.

---

## ✨ Key Features

- **🌐 Comprehensive Multi-Page Architecture**:
  - `index.html`: Landing page highlighting key services, featured products, brand partners, and quick inquiry.
  - `about.html`: Company history, directors (with light/dark adaptive profiles), vision, and certifications.
  - `products.html`: Searchable and filterable product catalog powered by `products.json`.
  - `services.html`: Detailed breakdown of glass processing, UV printing, 3D printing, hand colouring, and custom interior work.
  - `gallery.html` & `works.html`: Visual portfolio showcasing real project installations.
  - `quotation.html`: Interactive instant quotation calculator for material estimation.
  - `alangaram-interiors.html` & `negizhi-upvc.html`: Specialized landing pages for interior design and uPVC windows/doors.
  - `reviews.html`: Client testimonials with rating submissions.
  - `contact.html`: Contact details, business hours, and interactive Google Map location cards.
  - `admin.html`: Admin dashboard with custom theme dropdowns, deal managers, and dynamic catalog configuration.

- **🌓 Dynamic Light / Dark Theme System**:
  - Seamless theme toggle across all pages with custom CSS variables.
  - Context-aware image and vector swapping for directors' profiles and branding cards.

- **🧮 Interactive Quotation Calculator**:
  - Real-time price estimator for glass dimensions, plywood thickness, laminate finishes, and hardware fittings.

- **⚙️ Dynamic Data Architecture**:
  - Client-side rendering driven by decoupled JSON databases (`products.json`, `services.json`, `works.json`, `settings.json`).

- **📱 Mobile-First Responsive Design**:
  - Custom responsive navigation tabs, scrollable action buttons, and touch-friendly controls.

- **🔍 Advanced SEO & Schema Markup**:
  - Embedded JSON-LD structured data (`HomeAndConstructionBusiness`), Open Graph meta tags, canonical link tags, and `sitemap.xml`.

---

## 🛠️ Technology Stack

| Category | Technologies |
|---|---|
| **Frontend Core** | HTML5, JavaScript (ES6+ Native Modules) |
| **Styling & Design System** | Vanilla CSS3 (CSS Variables, Flexbox, CSS Grid, Glassmorphism, Micro-animations) |
| **Data Engine** | Native JSON (`data/*.json`) with dynamic JS fetching |
| **Typography & Assets** | Google Fonts (Inter / Outfit / Roboto), S3 Cloud-hosted high-resolution imagery |
| **SEO & Analytics** | JSON-LD Schema, Open Graph Protocol, Semantic HTML5 |

---

## 📁 Repository Structure

```
Ambika-Plywoods-Official-Website/
├── index.html                 # Main Landing Page
├── about.html                 # About Us & Directors Info
├── products.html              # Product Catalog
├── services.html              # Services & Glass Work Details
├── gallery.html               # Image & Project Gallery
├── works.html                 # Portfolio & Recent Works
├── quotation.html             # Interactive Quotation Estimator
├── reviews.html               # Customer Testimonials & Reviews
├── contact.html               # Contact Details & Locations
├── alangaram-interiors.html   # Alangaram Interiors Vertical
├── negizhi-upvc.html          # Negizhi uPVC Windows & Doors Vertical
├── admin.html                 # Admin Dashboard
├── css/
│   └── style.css              # Universal Design System & Theme Styles
├── js/
│   ├── main.js                # Core App Logic, Navbar & Theme Switching
│   ├── products.js            # Product Filtering & Search Logic
│   ├── services.js            # Services Renderer
│   └── works.js               # Portfolio & Gallery Renderer
├── data/
│   ├── products.json          # Products Database
│   ├── services.json          # Services Data
│   ├── works.json             # Portfolio Data
│   └── settings.json          # Global App Configuration
├── robots.txt                 # Search Engine Crawler Instructions
└── sitemap.xml                # Site Structure for Search Engines
```

---

## 🚀 Getting Started / Local Development

Since the website is built using modern standard HTML5, CSS3, and JavaScript with `fetch` requests for local JSON files, it is best served via a lightweight HTTP web server.

### Option 1: VS Code Live Server Extension
1. Open the workspace folder in VS Code.
2. Install the **Live Server** extension.
3. Click **Go Live** at the bottom status bar or right-click `index.html` and select **Open with Live Server**.

### Option 2: Python HTTP Server
Run the built-in HTTP server from your terminal:
```bash
# Python 3
python -m http.server 8000
```
Open your browser and navigate to `http://localhost:8000`.

### Option 3: Node.js `npx http-server` or `serve`
```bash
npx serve .
```

---

## 📍 Contact & Location

**Ambika Playwoods & Hardwares**  
- 🏢 **Address**: T.S. No. 1429/1A, Santhay Road, Mettupatty, Dindigul, Tamil Nadu - 624002  
- 📞 **Phone**: +91 97871 50990  
- 🌐 **Website**: [ambikaplywoods.com](https://ambikaplywoods.com/)  

---

© Ambika Playwoods. All rights reserved.
