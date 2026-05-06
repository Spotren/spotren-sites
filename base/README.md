# base-template

Template mínimo para sites estáticos da Spotren usando:

- `Astro`
- `TypeScript`
- `Zod`

## Estrutura

- `src/content/site/en.json`
- `src/content/site/pt-BR.json`
- `src/content/site/es.json`
  - dados versionados do site por idioma
- `src/lib/site-schema.ts`
  - schema Zod do conteúdo
- `src/lib/load-site-data.ts`
  - leitura e validação do JSON por idioma
- `src/styles/tokens.css`
  - tokens globais de tema
- `src/styles/global.css`
  - reset leve e base responsiva
- `src/pages/index.astro`
  - página inicial estática com `en` como default
- `src/pages/[locale].astro`
  - páginas estáticas para os demais idiomas suportados

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

O `title` da home é gerado a partir de `src/content/site/en.json`.

Idiomas suportados:

- `en`
- `pt`
- `es`

Valor inicial:

```json
{
  "title": "Spotren Sites",
  "seoTitle": "Spotren Sites | Static Site Template",
  "description": "Test English description for the default Spotren static site template.",
  "header": {
    "eyebrow": "Local SEO by Spotren™",
    "navAriaLabel": "Primary",
    "navItems": [
      { "href": "#testimonials", "label": "Testimonials" },
      { "href": "#mirror", "label": "Explanation" },
      { "href": "#contact", "label": "Contact" }
    ]
  },
  "faviconHref": "/favicon.ico",
  "faviconContentType": "image/x-icon"
}
```
