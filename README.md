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

Abra `http://127.0.0.1:8765`. Não há instalação, backend ou formulário de coleta. A medição fica desativada em localhost.

## Métricas

`analytics.js` conecta a propriedade AgenteDev.ia — Site no GA4 (`G-1FFT3KXQY1`), somente no domínio público e após aceitar métricas. `analytics.css` apresenta a escolha e `privacidade.html` explica o uso. A preferência dura até 90 dias e pode ser alterada no rodapé. Google Signals e personalização publicitária ficam desativados; medição otimizada do fluxo desativada para não enviar URLs de contatos automaticamente.

Visitas usam `page_view`; botões do WhatsApp enviam `whatsapp_click`, com `button_location` igual a `intro` ou `footer`. Isso mede interesse, não mensagem enviada ou venda. Não enviamos telefone ou texto da mensagem nesses eventos. Consultas da URL são filtradas para campanhas conhecidas e o referenciador é limitado à origem.

Link para a bio: `https://beautiful-sea.github.io/agentedev/?utm_source=instagram&utm_medium=organic_social&utm_campaign=perfil&utm_content=bio`. Use `stories` ou `reels` em `utm_content` para distinguir outros pontos de entrada. No relatório Aquisição de tráfego, consulte Origem/mídia da sessão e campanha `perfil`. Compare sessões com cliques no WhatsApp; visitas e cliques da bio não são a mesma contagem. Recusas de métricas, bloqueadores e visitas que não carregam a página não entram na coleta.
