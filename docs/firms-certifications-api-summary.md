# Certifai App: Firms & Certifications API Endpoints Summary

This document provides a simple summary of the main API endpoints related to **firms** and **certifications** in the `certifai-app` project.

---


## Firms Endpoints

- **GET /api/public/firms/search**
  - **Description:** Search for firms. Used by public certification pages.
  - **Frontend Route:** `app/api/public/firms/search/route.ts` (Next.js API route)
  - **How it works:**
    - The React app calls this Next.js API route.
    - The route checks if the request is from a public certification page.
    - It then makes a backend call to `${NEXT_PUBLIC_SERVER_API_URL}/api/public/firms/search` with a custom JWT token in the Authorization header.
    - The backend validates the JWT before processing the request.
    - The backend responds with a list of firms matching the search criteria.
  - **Auth:** Protected by custom JWT token (required for all /api/public routes).
  - **UI Auth Check:** The app UI ensures a valid JWT is present before making the request. If not, the user is redirected or shown an error.
  - **Response:** List of firms matching search criteria.

- **GET /api/public/firms/:id**
  - **Description:** Get details of a specific firm by its ID.
  - **Frontend Route:** `app/api/public/firms/[id]/route.ts` (Next.js API route)
  - **How it works:**
    - The React app calls this API route with the firm ID.
    - The route forwards the request to the backend endpoint `${NEXT_PUBLIC_SERVER_API_URL}/api/public/firms/:id` with a custom JWT token in the Authorization header.
    - The backend validates the JWT before processing the request.
    - The backend responds with the firm details object.
  - **Auth:** Protected by custom JWT token (required for all /api/public routes).
  - **UI Auth Check:** The app UI ensures a valid JWT is present before making the request. If not, the user is redirected or shown an error.
  - **Response:** Firm details object.

- **GET /api/public/firms**
  - **Description:** List all firms.
  - **Frontend Route:** `app/api/public/firms/route.ts` (Next.js API route)
  - **How it works:**
    - The React app calls this API route.
    - The route forwards the request to the backend endpoint `${NEXT_PUBLIC_SERVER_API_URL}/api/public/firms` with a custom JWT token in the Authorization header.
    - The backend validates the JWT before processing the request.
    - The backend responds with a list of all firms.
  - **Auth:** Protected by custom JWT token (required for all /api/public routes).
  - **UI Auth Check:** The app UI ensures a valid JWT is present before making the request. If not, the user is redirected or shown an error.
  - **Response:** List of all firms.

- **GET /api/public/firms/:firm_id/certifications**
  - **Description:** Get all certifications for a specific firm by `firm_id`.
  - **Frontend Route:** `app/api/public/firms/[firm_id]/certifications/route.ts` (Next.js API route)
  - **How it works:**
    - The React app calls this API route with the firm ID.
    - The route forwards the request to the backend endpoint `${NEXT_PUBLIC_SERVER_API_URL}/api/public/firms/:firm_id/certifications` with a custom JWT token in the Authorization header.
    - The backend validates the JWT before processing the request.
    - The backend responds with a list of certifications for the firm.
  - **Auth:** Protected by custom JWT token (required for all /api/public routes).
  - **UI Auth Check:** The app UI ensures a valid JWT is present before making the request. If not, the user is redirected or shown an error.
  - **Response:** List of certifications belonging to the firm.

---


## Certifications Endpoints

- **GET /api/public/certifications/search**
  - **Description:** Search for certifications. Used for public access to certification data.
  - **Frontend Route:** `app/api/public/certifications/search/route.ts` (Next.js API route)
  - **How it works:**
    - The React app calls this API route.
    - The route forwards the request to the backend endpoint `${NEXT_PUBLIC_SERVER_API_URL}/api/public/certifications/search` with a custom JWT token in the Authorization header.
    - The backend validates the JWT before processing the request.
    - The backend responds with a list of certifications matching the search criteria.
  - **Auth:** Protected by custom JWT token (required for all /api/public routes).
  - **UI Auth Check:** The app UI ensures a valid JWT is present before making the request. If not, the user is redirected or shown an error.
  - **Response:** List of certifications matching search criteria.

- **GET /api/public/certifications/:id**
  - **Description:** Get details of a specific certification by its ID.
  - **Frontend Route:** `app/api/public/certifications/[id]/route.ts` (Next.js API route)
  - **How it works:**
    - The React app calls this API route with the certification ID.
    - The route forwards the request to the backend endpoint `${NEXT_PUBLIC_SERVER_API_URL}/api/public/certifications/:id` with a custom JWT token in the Authorization header.
    - The backend validates the JWT before processing the request.
    - The backend responds with the certification details object.
  - **Auth:** Protected by custom JWT token (required for all /api/public routes).
  - **UI Auth Check:** The app UI ensures a valid JWT is present before making the request. If not, the user is redirected or shown an error.
  - **Response:** Certification details object.

- **GET /api/public/certifications**
  - **Description:** List all certifications.
  - **Frontend Route:** `app/api/public/certifications/route.ts` (Next.js API route)
  - **How it works:**
    - The React app calls this API route.
    - The route forwards the request to the backend endpoint `${NEXT_PUBLIC_SERVER_API_URL}/api/public/certifications` with a custom JWT token in the Authorization header.
    - The backend validates the JWT before processing the request.
    - The backend responds with a list of all certifications.
  - **Auth:** Protected by custom JWT token (required for all /api/public routes).
  - **UI Auth Check:** The app UI ensures a valid JWT is present before making the request. If not, the user is redirected or shown an error.
  - **Response:** List of all certifications.

---

## Notes

- Endpoints are typically under `/api/public/` for public access.
- Authentication and access control are enforced for sensitive endpoints.
- For more details, refer to the implementation in the `app/api/public/firms/` and `app/api/public/certifications/` directories.

---

_This is a high-level summary. For request/response formats and advanced usage, see the code or API documentation._
