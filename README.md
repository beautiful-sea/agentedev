# Lindomar · AgenteDev.ia

Site pessoal e portfólio de Lindomar, com foco em consultoria de IA e desenvolvimento pela AgenteDev.ia. HTML, CSS e JavaScript estáticos, preparado para GitHub Pages na raiz da branch `main`.

## Conteúdo

- Consultoria de IA: diagnóstico, prioridades e plano de aplicação.
- Apresentação de Lindomar e das áreas de atuação.
- Projeto Hashrate Manager.
- Quatro mensagens de usuários do Hashrate Manager, com dados de identificação preservados.
- Processo de trabalho e apresentação de Lindomar.

Os depoimentos se referem ao Hashrate Manager, e não a todos os serviços da agência. Os recortes foram renderizados a partir das mensagens originais no WhatsApp, preservando seu conteúdo e ocultando os elementos de identificação. Conversas completas, telefones dos remetentes, licenças e dados de pesquisa não fazem parte deste repositório.

## Atualizações

Edite `index.html`, `cinema.css` e `story.js`; `story.css` contém a base do restante da página. A abertura mobile first usa rolagem nativa para controlar retrato, tipografia em perspectiva, cartões espaciais e conexões em canvas. O canvas pausa fora da abertura e em abas ocultas. A preferência por movimento reduzido mantém uma abertura estática, com opção explícita de ativar a experiência. Nenhum evento de roda ou toque é bloqueado.

A foto fornecida por Lindomar está em `assets/lindomar.png`. `assets/lindomar-profissional.png` é a versão editada com IA, a pedido dele: blazer, fundo de estúdio e iluminação profissional, preservando os traços e os óculos da referência. `script.js` controla navegação, depoimentos e contatos; `site-config.js` define WhatsApp e e-mail.

## Prévia local

```sh
python -m http.server 8765 --bind 127.0.0.1
```

Abra `http://127.0.0.1:8765`. Não há instalação, backend, formulário de coleta ou analytics.
