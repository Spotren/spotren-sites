# Base Template Guidelines

Este template define o padrao base para projetos `spotren-sites`.

## Objetivo

Use este diretório como scaffold minimo para sites estaticos da Spotren em Astro.

Ele define:

- estrutura de paginas base
- contrato de conteudo por idioma
- layout e componentes semanticos iniciais
- metadados de SEO orientados por conteudo

## Fonte De Verdade

Para este template, a fonte de verdade do conteudo do site e:

- `src/content/site/en.json`
- `src/content/site/pt.json`
- `src/content/site/es.json`

O contrato tecnico desse conteudo e validado por:

- `src/lib/site-schema.ts`

Documentacao explicita do contrato:

- `docs/site-contract.md`

Se houver divergencia entre exemplos e implementacao, o schema em `src/lib/site-schema.ts` vence.

## Regras Do Template

- `en` e o idioma default da home `/`
- `/en`, `/pt` e `/es` devem continuar sendo rotas estaticas validas
- nao hardcode texto estrutural dentro de paginas ou componentes quando ele puder viver no conteudo versionado
- use componentes e layouts Astro para encapsular head, estrutura semantica e composicao de pagina
- mantenha SEO dirigido por dados do conteudo, nao por strings soltas nas paginas
- separe `seoTitle` de `title`: `seoTitle` e para metadata; `title` e para conteudo visivel
- preserve HTML semantico simples antes de introduzir CSS ou componentes visuais mais complexos

## Estrutura Esperada

- `src/layouts/BaseLayout.astro`
  - estrutura HTML base
- `src/components/SeoHead.astro`
  - metadados de SEO
- `src/components/SemanticPage.astro`
  - estrutura semantica da pagina
- `src/content/site/*.json`
  - conteudo localizado
- `src/pages/index.astro`
  - home default em `en`
- `src/pages/[locale].astro`
  - paginas localizadas

## Mudancas De Contrato

Quando o contrato de `site` mudar:

1. atualize `src/lib/site-schema.ts`
2. atualize todos os arquivos `src/content/site/*.json`
3. atualize `docs/site-contract.md`
4. valide com `npm run check`

## Escopo

Este arquivo documenta o padrao do template base.
Ele nao substitui a documentacao especifica de cada site derivado.
