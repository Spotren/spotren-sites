# base-template

Template mínimo para sites estáticos da Spotren usando:

- `Astro`
- `TypeScript`
- `Zod`

## Estrutura

- `src/content/site.json`
  - dados versionados do site
- `src/lib/site-schema.ts`
  - schema Zod do conteúdo
- `src/lib/load-site-data.ts`
  - leitura e validação do JSON
- `src/pages/index.astro`
  - página inicial estática

## Build

1. Instale as dependências:

```bash
npm install
```

2. Rode a build:

```bash
npm run build
```

O output será gerado em `dist/`.

## Desenvolvimento

Para rodar localmente:

```bash
npm run dev
```

## Conteúdo atual

O `title` da home é gerado a partir de `src/content/site.json`.

Valor inicial:

```json
{
  "title": "Acme Inc. Los Angeles"
}
```
