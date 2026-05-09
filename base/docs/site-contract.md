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
  "successPage": {
    "image": {
      "src": "string",
      "alt": "string"
    },
    "title": "string",
    "body": "string",
    "button": {
      "label": "string",
      "href": "string"
    }
  },
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
      "reviewCount": 1,
      "items": [
        {
          "headline": "string",
          "quote": "string",
          "avatar": "string",
          "name": "string",
          "role": "string",
          "rating": 5
        }
      ]
    },
    "mirror": {
      "id": "string",
      "title": "string",
      "body": "string",
      "listTitle": "string",
      "result": {
        "value": "string",
        "body": "string"
      },
      "speaker": {
        "name": "string",
        "role": "string",
        "avatar": "string"
      },
      "items": ["string"]
    },
    "diagnosis": {
      "id": "string",
      "title": "string",
      "body": "string",
      "afterList": "string",
      "items": ["string"],
      "opportunity": {
        "title": "string",
        "paragraphs": ["string", "string"]
      }
    },
    "howWorks": {
      "id": "string",
      "title": "string",
      "body": "string",
      "callout": {
        "title": "string",
        "body": "string"
      },
      "items": [
        {
          "title": "string",
          "body": "string"
        }
      ]
    },
    "deliverables": {
      "id": "string",
      "title": "string",
      "body": "string",
      "callout": {
        "title": "string",
        "body": "string"
      },
      "items": ["string"]
    },
    "icp": {
      "id": "string",
      "title": "string",
      "body": "string",
      "figure": {
        "src": "string",
        "alt": "string"
      },
      "items": [
        {
          "text": "string",
          "className": "string"
        }
      ]
    },
    "anchorVal": {
      "id": "string",
      "title": "string",
      "body": "string",
      "items": ["string"]
    },
    "priceBuy": {
      "id": "string",
      "title": "string",
      "body": "string",
      "listTitle": "string",
      "speaker": {
        "name": "string",
        "role": "string",
        "avatar": "string"
      },
      "paymentLabels": {
        "pixLabel": "string",
        "cardLabel": "string",
        "secureLabel": "string"
      },
      "economyLabel": "string",
      "plans": [
        {
          "id": "string",
          "cardClass": "string",
          "label": "string",
          "currency": "string",
          "amount": "string",
          "period": "string",
          "items": ["string"],
          "ctaLabel": "string",
          "ctaHref": "string"
        }
      ],
      "items": ["string"]
    },
    "costInaction": {
      "id": "string",
      "title": "string",
      "bodyTitle": "string",
      "body": "string",
      "items": ["string"]
    },
    "creator": {
      "id": "string",
      "title": "string",
      "body": "string",
      "figure": {
        "src": "string",
        "alt": "string",
        "caption": "string"
      },
      "profile": {
        "name": "string",
        "figure": {
          "src": "string",
          "alt": "string",
          "caption": "string"
        },
        "paragraphs": [
          "string",
          "string"
        ]
      },
      "entity": {
        "name": "string",
        "description": "string",
        "image": "string"
      },
      "items": ["string"]
    },
    "faqCta": {
      "id": "string",
      "title": "string",
      "body": "string",
      "items": [
        {
          "question": "string",
          "answer": "string"
        }
      ]
    }
  },
  "footer": {
    "text": "string",
    "lines": [
      "string"
    ]
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
- `successPage`
  - conteudo da rota estatica `/pt/sucesso`, incluindo imagem, titulo, paragrafo e CTA
- `header.eyebrow`
  - texto auxiliar do topo da pagina
- `header.navAriaLabel`
  - label acessivel da navegacao principal
- `header.navItems`
  - links internos usados no `nav`
- `header.offer`
  - card promocional abaixo do `h1`
- `header.offer.price`
  - valor principal do card promocional, incluindo `currency` e `period`
- `sections.testimonials`
  - secao de depoimentos com lista de cards contendo titulo, depoimento, avatar, nome e nota
- `sections.mirror`
  - bloco explicativo principal da pagina
- `sections.*.items`
  - lista opcional de pontos de apoio para secoes textuais
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
  - `items` usa pares de `question` e `answer`
- `footer.text`
  - texto simples do rodape
- `footer.lines`
  - linhas simples para renderizacao em `address`

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
