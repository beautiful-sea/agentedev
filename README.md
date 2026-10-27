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

Edite `index.html`, `native-intro.css` e `native-intro.js`; `native-intro.html` preserva o fragmento da abertura. `cinema.css` mant?m a identidade visual e `story.css` contém a base do restante da página. A abertura mobile first usa rolagem nativa para controlar retrato, tipografia em perspectiva, cartões espaciais e conexões em canvas. O canvas pausa fora da abertura e em abas ocultas. Por solicitação de Lindomar, a experiência animada inicia ativa por padrão, inclusive em dispositivos com preferência de movimento reduzido, sem exigir botão de ativação. Nenhum evento de roda ou toque é bloqueado.

A foto fornecida por Lindomar está em `assets/lindomar.png`. `assets/lindomar-sorriso.png` é o retrato casual de camiseta, editado com IA para acrescentar um sorriso leve de boca fechada. As versões anteriores continuam disponíveis como alternativas. `script.js` controla navegação, depoimentos e contatos; `site-config.js` define WhatsApp e e-mail.

## Prévia local

```sh
python -m http.server 8765 --bind 127.0.0.1
```

Abra `http://127.0.0.1:8765`. Não há instalação, backend, formulário de coleta ou analytics.
