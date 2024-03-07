# chat-web

## Data base

### Install Turso CLI

Seguir los pasos de la documentación oficial de [Turso](https://docs.turso.tech/cli/installation).

### Create a new database

```bash
turso db create chat-web
```

### Initial steps

Start an interactive SQL shell with:

```bash
turso db shell chat-web
```

To see information about the database, including a connection URL, run:

```bash
turso db show chat-web
```

To get an authentication token for the database, run:

```bash
turso db tokens create chat-web
```

### Install the necessary dependencies

```bash
npm install @libsql/client dotenv
```
