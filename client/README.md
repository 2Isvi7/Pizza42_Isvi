# 🍕 Pizza 42 - Auth0 Identity Secured App

Este proyecto es una demostración técnica de una arquitectura segura utilizando **React (Vite)** para el Frontend y **Node.js (Express)** para el Backend, orquestado completamente a través de **Auth0**.

El objetivo es demostrar la implementación de flujos de autenticación modernos, protección de APIs, comunicación Machine-to-Machine (M2M) y enriquecimiento de tokens mediante Auth0 Actions.

## 🚀 Características Implementadas

* **Autenticación Robusta:** Login/Logout utilizando Universal Login de Auth0.
* **Seguridad de API:** Protección de endpoints mediante validación de JWT (`access_token`).
* **Role Based Access Control (RBAC):** Uso de Scopes personalizados (`write:orders`).
* **Machine to Machine (M2M):** El Backend actúa como un cliente seguro para escribir en la `Auth0 Management API`.
* **User Metadata:** Persistencia de datos (pedidos) directamente en el perfil del usuario en la nube de Auth0.
* **Token Enrichment:** Inyección del historial de pedidos dentro del ID Token mediante **Auth0 Actions**.
* **UX Condicional:** Bloqueo de funcionalidad si el email del usuario no está verificado.

## 🛠 Tech Stack

* **Frontend:** React 18, Vite, Auth0 React SDK.
* **Backend:** Node.js, Express, Axios, Express OAuth2 JWT Bearer.
* **Identity Provider:** Auth0 (OIDC & OAuth 2.0).

## ⚙️ Prerrequisitos

* Node.js (v18 o superior).
* Una cuenta de Auth0 configurada (Tenant).
* Git.

## 📦 Instalación y Configuración

