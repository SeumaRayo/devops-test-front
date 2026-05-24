# Endpoints del Panel Organizador / Admin

> Generado: 24 de mayo de 2026 | Total: **45 endpoints**

---

## 1. Eventos

### Listado de eventos

| Metodo | Endpoint | Rol | Uso |
|--------|----------|-----|-----|
| `GET` | `/api/v1/eventos?page=&size=&estadoEvento=...` | ADMIN | Lista global de todos los eventos con filtros |
| `GET` | `/api/v1/eventos/mis-eventos?page=&size=&...` | ORGANIZER, ADMIN | Lista de eventos del organizador autenticado |
| `POST` | `/api/v1/eventos` | ORGANIZER, ADMIN | Crear un nuevo evento |

### Detalle y transiciones de estado

| Metodo | Endpoint | Rol | Uso |
|--------|----------|-----|-----|
| `GET` | `/api/v1/eventos/{id}` | ORGANIZER (owner), ADMIN | Cargar detalle del evento |
| `GET` | `/api/v1/eventos/{id}/historial` | ORGANIZER (owner), ADMIN | Auditoria de cambios de estado |
| `PUT` | `/api/v1/eventos/{id}` | ORGANIZER (owner), ADMIN | Editar datos del evento (dispara correos) |
| `PATCH` | `/api/v1/eventos/{id}/publicar` | ORGANIZER (owner), ADMIN | Publicar evento (visible en catalogo) |
| `PATCH` | `/api/v1/eventos/{id}/cerrar` | ORGANIZER (owner), ADMIN | Cerrar evento |
| `PATCH` | `/api/v1/eventos/{id}/cancelar` | ORGANIZER (owner), ADMIN | Cancelar evento |
| `PATCH` | `/api/v1/eventos/{id}/activar` | ORGANIZER (owner), ADMIN | Activar evento |
| `PATCH` | `/api/v1/eventos/{id}/desactivar` | ORGANIZER (owner), ADMIN | Desactivar evento |

### Tickets del evento

| Metodo | Endpoint | Rol | Uso |
|--------|----------|-----|-----|
| `GET` | `/api/v1/eventos/{id}/tickets` | ORGANIZER (owner), ADMIN | Lista de inscritos al evento (tab Tickets) |

---

## 2. Staff

| Metodo | Endpoint | Rol | Uso |
|--------|----------|-----|-----|
| `GET` | `/api/v1/eventos/{id}/staff` | ORGANIZER (owner), ADMIN | Listar staff asignado al evento |
| `POST` | `/api/v1/eventos/{id}/staff` | ORGANIZER (owner), ADMIN | Asignar un usuario como staff |
| `PATCH` | `/api/v1/eventos/{id}/staff/{userId}/activar` | ORGANIZER (owner), ADMIN | Activar miembro del staff |
| `PATCH` | `/api/v1/eventos/{id}/staff/{userId}/desactivar` | ORGANIZER (owner), ADMIN | Desactivar miembro del staff |

---

## 3. Pagos

| Metodo | Endpoint | Rol | Uso |
|--------|----------|-----|-----|
| `GET` | `/api/v1/eventos/{eventoId}/pagos` | ORGANIZER (owner), ADMIN | Historial de transacciones del evento (tab Pagos) |

---

## 4. Reembolsos

| Metodo | Endpoint | Rol | Uso |
|--------|----------|-----|-----|
| `GET` | `/api/v1/eventos/{eventoId}/reembolsos` | ORGANIZER (owner), ADMIN | Listar solicitudes de reembolso del evento |
| `PATCH` | `/api/v1/eventos/{eventoId}/reembolsos/{id}/revisar` | ORGANIZER (owner), ADMIN | Poner solicitud en EN REVISION |
| `PATCH` | `/api/v1/eventos/{eventoId}/reembolsos/{id}/aprobar` | ORGANIZER (owner), ADMIN | Aprobar solicitud (100% del monto) |
| `PATCH` | `/api/v1/eventos/{eventoId}/reembolsos/{id}/rechazar` | ORGANIZER (owner), ADMIN | Rechazar solicitud (comentario obligatorio) |
| `PATCH` | `/api/v1/eventos/{eventoId}/reembolsos/{id}/marcar-reembolsado` | ORGANIZER (owner), ADMIN | Marcar como reembolsado (libera cupo, ticket → REEMBOLSADO) |

---

## 5. Check-in

| Metodo | Endpoint | Rol | Uso |
|--------|----------|-----|-----|
| `GET` | `/api/v1/eventos/{id}/check-in/estado` | STAFF, ORGANIZER, ADMIN | Consultar si el check-in esta habilitado (polling 30s) |
| `GET` | `/api/v1/eventos/{id}/check-in/resumen` | STAFF, ORGANIZER, ADMIN | Resumen de asistentes (ingresados, pendientes, %) |
| `POST` | `/api/v1/eventos/{id}/check-in` | STAFF, ORGANIZER, ADMIN | Validar ingreso con codigo QR |

---

## 6. Usuarios (ADMIN)

| Metodo | Endpoint | Rol | Uso |
|--------|----------|-----|-----|
| `GET` | `/api/v1/usuarios?page=&size=&...` | ADMIN | Listar usuarios con filtros y paginacion |
| `GET` | `/api/v1/usuarios/{id}` | ADMIN | Detalle de un usuario |
| `POST` | `/api/v1/usuarios` | ADMIN | Crear usuario |
| `PUT` | `/api/v1/usuarios/{id}/admin` | ADMIN | Editar usuario (admin) |
| `PATCH` | `/api/v1/usuarios/{id}/activar` | ADMIN | Activar usuario |
| `PATCH` | `/api/v1/usuarios/{id}/desactivar` | ADMIN | Desactivar usuario |
| `PATCH` | `/api/v1/usuarios/{id}/bloquear` | ADMIN | Bloquear usuario |

> Ademas, `GET /api/v1/usuarios/{id}` se usa en el tab de reembolsos para mostrar el nombre del usuario solicitante.

---

## 7. Accesos (ADMIN)

| Metodo | Endpoint | Rol | Uso |
|--------|----------|-----|-----|
| `GET` | `/api/v1/accesos` | ADMIN | Listar accesos de los usuarios |
| `PATCH` | `/api/v1/accesos/{idUsuario}/activar` | ADMIN | Activar acceso de un usuario |
| `PATCH` | `/api/v1/accesos/{idUsuario}/desactivar` | ADMIN | Desactivar acceso |
| `PATCH` | `/api/v1/accesos/{idUsuario}/bloquear` | ADMIN | Bloquear acceso |

---

## 8. Funcionalidades (ADMIN)

| Metodo | Endpoint | Rol | Uso |
|--------|----------|-----|-----|
| `GET` | `/api/v1/funcionalidad?status=&id_padre=` | ADMIN | Listar funcionalidades con filtros |
| `POST` | `/api/v1/funcionalidad` | ADMIN | Crear funcionalidad |
| `PATCH` | `/api/v1/funcionalidad/{id}/activar` | ADMIN | Activar funcionalidad |
| `PATCH` | `/api/v1/funcionalidad/{id}/desactivar` | ADMIN | Desactivar funcionalidad |

---

## 9. Sesiones (ADMIN)

| Metodo | Endpoint | Rol | Uso |
|--------|----------|-----|-----|
| `GET` | `/api/v1/sesiones?page=&size=&...` | ADMIN | Listar sesiones activas con filtros |
| `DELETE` | `/api/v1/sesiones/{idSesion}` | ADMIN | Forzar cierre de una sesion |

---

## Resumen por metodo HTTP

| Metodo | Cantidad |
|--------|----------|
| `GET` | 19 |
| `POST` | 6 |
| `PUT` | 2 |
| `PATCH` | 17 |
| `DELETE` | 1 |
| **Total** | **45** |

## Resumen por rol

| Rol | Endpoints exclusivos | Endpoints compartidos |
|-----|---------------------|----------------------|
| ADMIN | 21 (usuarios, accesos, funcionalidades, sesiones, eventos global) | — |
| ORGANIZER | — | 19 (eventos propios, staff, pagos, reembolsos) |
| STAFF | — | 3 (check-in) |
