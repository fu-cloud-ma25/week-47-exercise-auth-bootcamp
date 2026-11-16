# Övning – Autentisering, auktorisering och validering

I den här övningen ska du bygga vidare på ett valfritt REST API som du redan har utvecklat under kursen. API:et behöver ha en resurs (ett *item*) som går att skapa och radera.

Har du inget tidigare API kan du använda startprojektet som du [hittar här](./auth-bootcamp-starting-template).

Använd **AWS Lambda, DynamoDB och Middy** samt de tekniker vi gått igenom på lektionerna. Anpassa namnen på resurser och endpoints efter ditt projekt.

## Steg 1 – Registrering och inloggning

Implementera två endpoints:

- `POST /register` – registrera en användare med e-postadress och lösenord.
- `POST /login` – logga in och returnera en **JWT i response body**.

**Krav:**
- Spara användare i DynamoDB.
- Hasha lösenord med `bcrypt` innan de sparas och använd `bcrypt.compare()` vid inloggning.
- Förhindra att samma e-postadress registreras flera gånger.
- Låt JWT innehålla användarens ID och en begränsad giltighetstid.
- Läs JWT-hemligheten från en miljövariabel.
- Returnera aldrig lösenord eller lösenordshashar till klienten.

**Testa:** Registrera en användare, logga in med rätt respektive fel lösenord och försök registrera samma e-postadress igen.

## Steg 2 – Autentiseringsmiddleware

Skapa en egen **Middy-middleware** som verifierar en JWT från headern:

`Authorization: Bearer <token>`

Skydda den endpoint som skapar ett nytt item, exempelvis `POST /items`.

**Krav:**
- Endast inloggade användare ska kunna skapa items.
- Saknad, ogiltig eller utgången JWT ska ge `401 Unauthorized`.
- När ett item skapas ska det sparas med ägarens `userId`, hämtat från den verifierade JWT:n – inte från request body.

**Testa:** Skapa ett item med och utan giltig JWT.

## Steg 3 – Auktoriseringsmiddleware

Skapa en egen **Middy-middleware** som kontrollerar att användaren äger det item som ska raderas.

Skydda exempelvis `DELETE /items/{id}` med **både autentiserings- och auktoriseringsmiddleware**.

**Krav:**
- Hämta itemet och jämför dess `userId` med användarens ID från JWT:n.
- Endast ägaren ska få radera itemet.
- Returnera `401` vid saknad/ogiltig JWT, `403 Forbidden` vid fel ägare och `404 Not Found` om itemet saknas.

**Testa:** Registrera två användare. Låt den ena skapa ett item och försök sedan radera det med båda användarnas JWT.

## Steg 4 – Valideringsmiddleware

Skapa en återanvändbar **Middy-middleware** som validerar request body med **Zod**.

Använd den för:

- `POST /register` – giltig e-postadress och lösenord med minst åtta tecken.
- `POST /login` – e-postadress och lösenord måste finnas och ha rätt datatyper.
- Endpointen som skapar ett item – validera de fält som krävs i ditt API.

**Krav:**
- Använd separata Zod-scheman för respektive endpoint.
- Felaktig request body ska ge `400 Bad Request` med ett tydligt felmeddelande.
- Ogiltig data ska inte sparas i databasen.

**Testa:** Skicka ofullständiga och felaktiga request bodies till alla tre endpoints.

## Klart?

När du är färdig ska du kunna demonstrera hela flödet: **registrera → logga in → skapa eget item → nekas att radera någon annans item → validera felaktig indata**.
