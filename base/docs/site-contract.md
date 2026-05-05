# Site Contract

Este documento define o contrato de conteudo do template base de `spotren-sites`.

## Objetivo

O site e dirigido por conteudo versionado por idioma.
Cada locale precisa fornecer um payload compativel com o schema em `src/lib/site-schema.ts`.

## Idiomas Suportados

- `en`
- `pt`
- `es`

## Arquivos De Conteudo

- `src/content/site/en.json`
- `src/content/site/pt.json`
- `src/content/site/es.json`

## Regras De Resolucao

- `/` usa `en` como locale default
- `/en` usa `src/content/site/en.json`
- `/pt` usa `src/content/site/pt.json`
- `/es` usa `src/content/site/es.json`

## Contrato Atual

```json
{
  "title": "string",
  "seoTitle": "string",
  "description": "string",
  "faviconHref": "string",
  "faviconContentType": "string",
  "header": {
    "eyebrow": "string",
    "navAriaLabel": "string",
    "navItems": [
      {
        "href": "string",
        "label": "string"
      }
    ]
  },
  "sections": {
    "testimonials": {
      "id": "string",
      "title": "string",
      "articles": [
        {
          "title": "string",
          "body": "string"
        }
      ]
    },
    "mirror": {
      "id": "string",
      "title": "string",
      "body": "string"
    },
    "diagnosis": {
      "id": "string",
      "title": "string",
      "body": "string"
    },
    "howWorks": {
      "id": "string",
      "title": "string",
      "body": "string"
    },
    "deliverables": {
      "id": "string",
      "title": "string",
      "body": "string"
    },
    "icp": {
      "id": "string",
      "title": "string",
      "body": "string"
    },
    "anchorVal": {
      "id": "string",
      "title": "string",
      "body": "string"
    },
    "priceBuy": {
      "id": "string",
      "title": "string",
      "body": "string"
    },
    "costInaction": {
      "id": "string",
      "title": "string",
      "body": "string"
    },
    "creator": {
      "id": "string",
      "title": "string",
      "body": "string"
    },
    "faqCta": {
      "id": "string",
      "title": "string",
      "body": "string"
    },
    "contact": {
      "id": "string",
      "title": "string",
      "lines": [
        "string"
      ]
    }
  },
  "footer": {
    "text": "string"
  }
}
```

## Semantica De Campos

- `title`
  - titulo principal visivel do site, usado no `h1`
- `seoTitle`
  - titulo dedicado aos metadados de SEO, usado no `<title>` e em metadados sociais
- `description`
  - descricao usada nos metadados de SEO
- `faviconHref`
  - caminho publico do favicon
- `faviconContentType`
  - content type do favicon
- `header.eyebrow`
  - texto auxiliar do topo da pagina
- `header.navAriaLabel`
  - label acessivel da navegacao principal
- `header.navItems`
  - links internos usados no `nav`
- `sections.testimonials`
  - secao de depoimentos com lista de artigos
- `sections.mirror`
  - bloco explicativo principal da pagina
- `sections.diagnosis`
  - secao de diagnostico
- `sections.howWorks`
  - secao explicando como a oferta funciona
- `sections.deliverables`
  - secao com os entregaveis principais
- `sections.icp`
  - secao descrevendo o perfil ideal de cliente
- `sections.anchorVal`
  - secao de ancoragem de valor
- `sections.priceBuy`
  - secao de preco e compra
- `sections.costInaction`
  - secao sobre o custo da inacao
- `sections.creator`
  - secao sobre o criador ou responsavel pela oferta
- `sections.faqCta`
  - secao final de FAQ e chamada para acao
- `sections.contact`
  - secao de contato com linhas simples para renderizacao em `address`
- `footer.text`
  - texto simples do rodape

## Invariantes

- todo locale deve ter a mesma estrutura de chaves
- nao deixe texto estrutural hardcoded em `pages/`, `layouts/` ou `components/` se esse texto pertencer ao conteudo do site
- alteracoes no contrato exigem atualizacao simultanea de schema, exemplos e documentacao
- qualquer consumo de `site` deve depender de `SiteData`, nao de objetos ad hoc

## Implementacao Relacionada

- `src/lib/site-schema.ts`
- `src/lib/load-site-data.ts`
- `src/components/SeoHead.astro`
- `src/components/SemanticPage.astro`
- `src/layouts/BaseLayout.astro`
