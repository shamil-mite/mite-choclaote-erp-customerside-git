# Heart of Chocolate Ecommerce Frontend

This app is a separate public ecommerce frontend built in `Next.js` and kept intentionally outside the ERP admin app.

## Why this structure

- `frontend/` stays the ERP admin
- `ecommerce-frontend/` becomes the customer-facing website
- Django remains the shared backend and system of record

This keeps:
- public SEO requirements separate from internal ERP UI
- customer auth and checkout flows isolated from admin logic
- future mobile app reuse clean, because the ecommerce APIs can be shared later

## Current implementation

Production-oriented foundation is in place for:

- homepage
- category pages
- product pages
- blog index and article pages
- cart
- checkout shell
- login
- register
- sitemap
- robots
- JSON-LD for organization, products, and blog content

## Current data source

The app currently uses local mock content from:

- `src/data/catalog.ts`

That is deliberate. It lets the website architecture, SEO metadata, and design system stabilize before wiring to live ERP APIs.

## Recommended next backend phase

Expose Django ecommerce APIs for:

1. categories
2. website-enabled active products
3. product detail
4. customer registration/login
5. cart validation
6. checkout
7. order creation into ERP sales order flow
8. customer account history
9. blog or CMS content, if blog remains backend-managed

## Suggested integration path

1. `GET /api/ecommerce/categories`
2. `GET /api/ecommerce/products`
3. `GET /api/ecommerce/products/:slug`
4. `POST /api/ecommerce/auth/register`
5. `POST /api/ecommerce/auth/login`
6. `POST /api/ecommerce/cart/validate`
7. `POST /api/ecommerce/checkout`
8. `GET /api/ecommerce/orders`
9. `GET /api/ecommerce/orders/:id`

## Notes

- This is the correct architecture for SEO, AEO, and AI-search discoverability.
- The public site should not be merged into the ERP admin frontend.
- The ERP remains the operational source of truth for product, stock, pricing, and sales processing.
