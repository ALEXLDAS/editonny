[English — documentação principal](README.md) · **Português** · [Español](README.es.md)

<a id="top"></a>

<p align="center">
  <picture>
    <source media="(max-width: 640px)" srcset="docs/assets/readme/hero-mobile.svg" />
    <source media="(prefers-reduced-motion: reduce)" srcset="docs/assets/readme/hero-still.svg" />
    <img src="docs/assets/readme/hero.svg" alt="editonny: um estúdio editorial de vídeo local, com timeline animada de vídeo, voz e cenas visuais." width="1600" />
  </picture>
</p>

# editonny

**Sua história. Seu ritmo. Um fluxo completo de edição local.**

Edição local de vídeo por conversa. Uma skill reúne transcrição, cortes precisos, legendas, enquadramento, áudio e **145 cenas visuais** para **Codex** e **Claude Code**.

O projeto, os comandos, a interface, os arquivos e os prompts usam inglês. Este README é uma tradução da apresentação principal. A fala dos seus vídeos pode continuar no idioma original.

[Começar a editar](#instalar) · [Ver as animações](#motion) · [Explorar o guia](#abrir-o-guia) · [Histórico de estrelas](#community)

<p align="center">
  <a href="https://github.com/soumatheusgomes/editonny/stargazers"><img src="https://img.shields.io/github/stars/soumatheusgomes/editonny?style=flat&amp;label=Stars&amp;color=354935&amp;labelColor=242721" alt="GitHub stars" /></a>
  <a href="https://github.com/soumatheusgomes/editonny/actions/workflows/verify.yml"><img src="https://github.com/soumatheusgomes/editonny/actions/workflows/verify.yml/badge.svg?branch=main" alt="GitHub Actions verification" /></a>
  <a href="LICENSE.md"><img src="https://img.shields.io/badge/License-MIT-354935?labelColor=242721" alt="MIT license for first-party code" /></a>
</p>

| Cenas visuais | Exemplos de edição | Vídeos incluídos |
| :---: | :---: | :---: |
| **145** formas de explicar | **54** pontos de partida | **79** clipes originais |

## Comece com um pedido

Instale a skill, abra seu agente na pasta dos vídeos e descreva a edição. Você dirige o resultado; o editonny reúne ferramentas locais e biblioteca visual.

```text
$editonny
Edit a 45-second vertical video from /path/to/footage.
Keep complete takes, clean pauses, breaths, and mistakes, and add clear captions.
Use visual scenes only where they explain the story.
Verify an 8–15 second sample before finishing the export.
```

## Instalar

Prepare Python **3.9+** para o launcher, **uv**, **FFmpeg/ffprobe**, **Node.js 22.13+ ou 24+** e um agente configurado. O motor usa Python **>=3.10,<3.14**, selecionado pelo uv. As ferramentas precisam estar no `PATH`.

```sh
git clone https://github.com/soumatheusgomes/editonny.git
cd editonny
python3 install.py --target both
python3 ~/.local/share/editonny/scripts/editonny.py doctor
python3 ~/.local/share/editonny/scripts/editonny.py media status
```

Reinicie o agente. Use **`$editonny` no Codex** ou **`/editonny` no Claude Code**. Para somente um agente, use `--target codex` ou `--target claude`. A instalação compartilha uma cópia em `~/.local/share/editonny`, registrada por links.

O primeiro uso pode baixar dependências, modelos de transcrição ou o navegador de render. Transcrição e render locais não exigem chave de API de LLM; a assinatura do seu agente é separada. Geradores externos são opcionais e exigem autorização antes de gastos ou envio de mídia.

Detalhes, instalação isolada, atualizações e recuperação: [guia de instalação em inglês](docs/installation.md).

## Abrir o guia

Abra [web/index.html](web/index.html) no navegador, mantendo a pasta `web/` completa. Não é necessário instalar dependências para navegar.

Alternativa, na raiz do repositório:

```sh
python3 editonny.py guide
```

Abre `http://127.0.0.1:4173`; encerre com `Ctrl+C`. Use `--port 0 --no-open` para escolher uma porta livre sem abrir o navegador.

<a id="motion"></a>

## Palavras, ideias e objetos em movimento

Três cenas reais da biblioteca incluída. Os trechos são silenciosos e recortados, com texto sintético e conteúdo ilustrativo. São exemplos, não vídeos de clientes.

<p align="center">
  <a href="docs/assets/readme/captions.gif">
  <picture>
    <source media="(prefers-reduced-motion: reduce)" srcset="docs/assets/readme/captions-still.png" />
    <img src="docs/assets/readme/captions.gif" alt="Legendas cromáticas sincronizadas revelam “Your story. Your rhythm.”" width="280" loading="lazy" />
  </picture>
  </a>
  <a href="docs/assets/readme/explain.gif">
  <picture>
    <source media="(prefers-reduced-motion: reduce)" srcset="docs/assets/readme/explain-still.png" />
    <img src="docs/assets/readme/explain.gif" alt="Um edifício ilustrativo cresce andar por andar ao lado de um contador." width="280" loading="lazy" />
  </picture>
  </a>
  <a href="docs/assets/readme/motion.gif">
  <picture>
    <source media="(prefers-reduced-motion: reduce)" srcset="docs/assets/readme/motion-still.png" />
    <img src="docs/assets/readme/motion.gif" alt="Planetas orbitam um Sol em rotação na cena de sistema solar." width="280" loading="lazy" />
  </picture>
  </a>
</p>

[Legendas sincronizadas](skills/editonny/visuals/scenes/text-chromatic.html) · [Explicações visuais](skills/editonny/visuals/scenes/building-panel.html) · [Movimento espacial](skills/editonny/visuals/scenes/solar-system.html)

As prévias reproduzem uma vez por 4,5 segundos. A preferência por movimento reduzido seleciona imagens estáticas. Abra uma prévia para reproduzi-la novamente.

## O que faz

Você descreve o resultado e informa a pasta dos vídeos. A skill orienta o agente a examinar as gravações, selecionar tomadas completas, medir cortes pela onda do áudio, montar um projeto, revisar uma amostra e exportar um MP4 conferido.

A limpeza padrão remove pausas desnecessárias, respirações audíveis, erros, falsos começos e repetições redundantes. Preserva palavras completas, ritmo natural, pausas intencionais e sentido. Ajustes pontuais respeitam o trecho solicitado. Os originais são preservados.

O guia inclui **54 exemplos de edição**, gerador de prompts e catálogo de cenas. Todos os prompts de edição incluem a política padrão de limpeza. O guia não recebe arquivos nem edita vídeos no navegador.

## Fluxo de edição

<p align="center">
  <picture>
    <source media="(max-width: 640px)" srcset="docs/assets/readme/workflow-mobile.svg" />
    <source media="(prefers-reduced-motion: reduce)" srcset="docs/assets/readme/workflow-still.svg" />
    <img src="docs/assets/readme/workflow.svg" alt="Fluxo de edição local: descreva sua intenção, edite os vídeos, revise uma amostra de 8–15 segundos e exporte um MP4 conferido." width="1600" />
  </picture>
</p>

1. Escolha uma intenção no guia, informe a pasta e copie o pedido para o agente.
2. A skill confere o ambiente, examina a fala, seleciona tomadas e aplica a limpeza medida.
3. Revise uma amostra representativa de **8–15 segundos**, com fala, legenda e movimento. Se quiser que o agente aguarde sua aprovação, diga isso explicitamente.
4. Conclua o projeto, renderize pela versão fixa do HyperFrames e confira o MP4 final.

Mantenha vídeos, projetos e bibliotecas pessoais fora da skill. Números, ofertas, marcas e depoimentos de demonstração devem ser substituídos por fatos fornecidos. Imagens geradas não são provas.

## Estrutura

| Caminho | Função |
|---|---|
| `skills/editonny/` | Skill única e CLI |
| `skills/editonny/engine/` | Processamento local, preview e template de projeto |
| `skills/editonny/visuals/` | Cenas, catálogo, mídia incluída e receitas |
| `web/` | Guia independente e biblioteca de prompts |
| `docs/` | Referências técnicas canônicas em inglês |
| `scripts/`, `tests/` | Pacotes, verificações de render e testes |

Projetos novos usam `project.json`, campos, comandos e IDs em inglês. Formatos experimentais anteriores não são suportados.

<details>
<summary><strong>Desenvolvimento, verificação e distribuição</strong></summary>

## Desenvolver e validar

```sh
npm ci --ignore-scripts
uv sync --locked --directory skills/editonny/engine
npm run build
npm run check
python3 editonny.py doctor
npm run test:engine
npm run test:browser
npm run test:preview
npm run test:scenes
python3 scripts/smoke_engine.py
```

Os testes de navegador exigem `agent-browser` e seu navegador. O render exige FFmpeg e pode precisar de rede no primeiro uso. Confira as amostras antes de remover os temporários de `.work/`. [Resultados e limitações](docs/validation.md).

Edite os módulos `.mjs`; `npm run build` gera `web/app.js` e `web/catalog.json`. Não edite o bundle manualmente. `npm run check:web` detecta arquivos gerados desatualizados.

## Empacotar

```sh
python3 scripts/package.py
```

Gera ZIPs separados de site e plugin, com SHA-256, em `dist/`. O plugin contém o guia, a documentação técnica, a skill completa e **79 vídeos incluídos**. Cada edição recebe somente os clipes usados. O site contém apenas o guia público. Gerar pacotes não publica nada nem altera sua instalação global.

</details>

<a id="community"></a>

## Acompanhe a história

Se o editonny ajudar no seu próximo vídeo, deixe uma estrela no projeto. Acompanhe a evolução, relate um problema ou sugira uma cena.

<a href="https://www.star-history.com/?repos=soumatheusgomes%2Feditonny&amp;type=date">
  <picture>
    <source media="(prefers-color-scheme: dark)" srcset="https://api.star-history.com/chart?repos=soumatheusgomes/editonny&amp;type=date&amp;theme=dark" />
    <img src="https://api.star-history.com/chart?repos=soumatheusgomes/editonny&amp;type=date" alt="Star history for soumatheusgomes/editonny" width="1000" loading="lazy" />
  </picture>
</a>

[Dar uma estrela](https://github.com/soumatheusgomes/editonny/stargazers) · [Relatar um problema](https://github.com/soumatheusgomes/editonny/issues) · [Abrir histórico de estrelas](https://www.star-history.com/?repos=soumatheusgomes%2Feditonny&type=date)

O gráfico atualizado é fornecido pelo [Star History](https://www.star-history.com/blog/how-to-use-github-star-history/) e depende desse serviço. O selo no início mostra a contagem real de estrelas no GitHub.

## Autor e contato

Criado e mantido por **Matheus Gomes**.

- Instagram: [@matheusgomes](https://instagram.com/matheusgomes)
- Email: [eu@matheusgom.es](mailto:eu@matheusgom.es)
- GitHub: [soumatheusgomes/editonny](https://github.com/soumatheusgomes/editonny)

## Licença

Código e documentação próprios usam a [licença MIT](LICENSE.md). Bibliotecas, modelos, fontes, áudio e mídia de terceiros mantêm suas licenças e atribuições; a MIT não substitui esses termos. Consulte os [avisos de terceiros](skills/editonny/engine/THIRD_PARTY_NOTICES.md) e os avisos junto aos recursos antes de redistribuir.

[Produto](PRODUCT.md) · [Arquitetura](docs/architecture.md) · [Interface](docs/design.md) · [Integrações](docs/integrations.md) · [Setup de desenvolvimento](docs/setup.md)

<p align="center"><strong>YOUR STORY. ITS OWN RHYTHM.</strong><br /><a href="#top">Voltar ao início ↑</a></p>
