# App structure

This folder contains the three main segments of the application:

- **(customer)** – Public site. Routes at `/`, `/cont`, `/galerie`, `/programare`, `/contact`, `/servicii`, `/cere-oferta`, `/testimoniale`. The `(customer)` group does not add a URL segment.
- **admin** – Admin panel. Routes at `/admin`, `/admin/login`, `/admin/clients`, etc.
- **api** – API route handlers. All under `/api/*`.

Public URLs stay as above; no segment is added for the customer site.
