# Deployment till AWS

### 1. Installera dependencies
```bash
npm install
```

### 2. Skapa config.yml
Skapa filen `config.yml` i projektets rotmapp och lägg till:

```yaml
org: din-serverless-organisation
role: arn:aws:iam::123456789012:role/din-roll
```

- **org:** Din organisation i Serverless Framework.
- **role:** ARN till din IAM-roll i AWS.

### 3. Deploya
```bash
serverless deploy
```

Klart! Applikationen driftsätts nu till ditt AWS-konto.