# editonny

Edição local de vídeo por conversa. Uma skill reúne transcrição, cortes precisos, legendas, enquadramento, áudio e **145 cenas visuais** para **Codex** e **Claude Code**.

[English — documentação principal](README.md) · **Português** · [Español](README.es.md)

O projeto, os comandos, a interface, os arquivos e os prompts usam inglês. Este README é uma tradução da apresentação principal. A fala dos seus vídeos pode continuar no idioma original.

## O que faz

Você descreve o resultado e informa a pasta dos vídeos. A skill orienta o agente a examinar as gravações, selecionar tomadas completas, medir cortes pela onda do áudio, montar um projeto, revisar uma amostra e exportar um MP4 conferido.

A limpeza padrão remove pausas desnecessárias, respirações audíveis, erros, falsos começos e repetições redundantes. Preserva palavras completas, ritmo natural, pausas intencionais e sentido. Ajustes pontuais respeitam o trecho solicitado. Os originais são preservados.

O guia inclui **54 exemplos de edição**, gerador de prompts e catálogo de cenas. Todos os prompts de edição incluem a política padrão de limpeza. O guia não recebe arquivos nem edita vídeos no navegador.

## Abrir o guia

Abra [web/index.html](web/index.html) no navegador, mantendo a pasta `web/` completa. Não é necessário instalar dependências para navegar.

Alternativa, na raiz do repositório:

```sh
python3 editonny.py guide
```

Abre `http://127.0.0.1:4173`; encerre com `Ctrl+C`. Use `--port 0 --no-open` para escolher uma porta livre sem abrir o navegador.

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

## Fluxo de edição

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

## Autor e contato

Criado e mantido por **Matheus Gomes**.

- Instagram: [@matheusgomes](https://instagram.com/matheusgomes)
- Email: [eu@matheusgom.es](mailto:eu@matheusgom.es)
- GitHub: [soumatheusgomes/editonny](https://github.com/soumatheusgomes/editonny)

## Licença

Código e documentação próprios usam a [licença MIT](LICENSE.md). Bibliotecas, modelos, fontes, áudio e mídia de terceiros mantêm suas licenças e atribuições; a MIT não substitui esses termos. Consulte os [avisos de terceiros](skills/editonny/engine/THIRD_PARTY_NOTICES.md) e os avisos junto aos recursos antes de redistribuir.

[Produto](PRODUCT.md) · [Arquitetura](docs/architecture.md) · [Interface](docs/design.md) · [Integrações](docs/integrations.md) · [Setup de desenvolvimento](docs/setup.md)
