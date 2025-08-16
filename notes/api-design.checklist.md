# RESTful API Design Checklist

## RFC Compliance

- [ ] **HTTP Methods/Status Codes (RFC 7231)**: Use standard methods (`GET`, `POST`, etc.) and status codes (e.g., `200 OK`, `401 Unauthorized`).
  - [ ] Avoid non-standard status codes (e.g., use `503 Service Unavailable` instead of inventing a custom code).
- [ ] **URI Syntax (RFC 3986)**: Ensure hierarchical, lowercase URIs with hyphens (e.g., `/customers/123/orders`).
- [ ] **OAuth 2.0 (RFC 6749)**: Implement token-based authentication (`Bearer` tokens) for authorization.
- [ ] **Caching Headers (RFC 7234)**: Add `Cache-Control` (`max-age`, `no-cache`) and/or `ETag/Last-Modified`.
- [ ] **Error Format (RFC 7807)**: Return errors in `application/problem+json` format with `type`, `title`, and `detail`.
- [ ] **HTTPS (RFC 2818)**: Enforce TLS encryption for all endpoints.

---

## Core REST Principles

- [ ] **Client-Server**: Decouple client-server logic; avoid UI/business logic in the API.
- [ ] **Stateless**: No server-side session state; use tokens or cookies for authentication.
- [ ] **Cacheable**: Mark responses as cacheable where appropriate (`Cache-Control`).
- [ ] **Uniform Interface**: Use nouns (resources) and standard HTTP methods (avoid verb paths).

---

## URI Design

- [ ] Use plural nouns for resources (e.g., `/users` vs. `/user`).
- [ ] Avoid verbs in paths; use HTTP methods instead (e.g., `POST /orders` vs. `/create-order`).
- [ ] Include query parameters for filtering/sorting (e.g., `?page=2&sort=date`).
- [ ] Support optional fields via query parameters (e.g., `?fields=id,name`).

---

## HTTP Methods

- [ ] **GET**: Safe and idempotent (no side effects).
- [ ] **POST**: Non-idempotent for resource creation.
- [ ] **PUT**: Idempotent (full replacement of a resource).
- [ ] **PATCH**: For partial updates.
- [ ] **DELETE**: Idempotent (ensure no unintended side effects).

---

## Security

- [ ] Implement OAuth 2.0 scopes for access control (e.g., `read:orders`).
- [ ] Rate limit requests and include `Retry-After` headers.
- [ ] Sanitize all inputs to prevent injection attacks (SQLi, XSS).
- [ ] Configure CORS headers (`Access-Control-Allow-Origin`, etc.).

---

## Versioning & Evolution

- [ ] Use URL-based versioning (e.g., `/v1/users`) or header/API Gateway versions.
- [ ] Mark deprecated endpoints via headers (`Deprecation: true`).
- [ ] Avoid breaking changes; add backward-compatible fields first.

---

## Error Handling

- [ ] Return standardized `4xx` (client) and `5xx` (server) status codes.
- [ ] Include field-specific validation errors in responses.
- [ ] Use `Retry-After` for rate-limited requests (RFC 6585).

---

## Performance

- [ ] Enable compression (`Accept-Encoding: gzip`).
- [ ] Support conditional requests via `ETag` and `If-Modified-Since`.
- [ ] Add pagination with `page/limit` parameters and links (HATEOAS).

---

## Documentation

- [ ] Use OpenAPI/Swagger specs with examples and error scenarios.
- [ ] Document rate limits, authentication, and CORS policies.

---

## Advanced Practices (Optional)

- [ ] **HATEOAS**: Include hypermedia links in responses (`next`, `prev`, `self`).
- [ ] **Idempotency**: Add client-provided `Idempotency-Key` headers.
- [ ] **Circuit Breakers**: Implement retry logic for external service calls.

---

## Final Validation

- [ ] Audit compliance with RFCs previously mapped (7231, 6749, etc.).
- [ ] Load-test endpoints with `k6` or similar tools.
- [ ] Validate contracts via tools like Pact.
