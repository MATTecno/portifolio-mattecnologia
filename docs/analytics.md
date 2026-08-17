# Analytics, consentimento e feedback

O portfólio usa PostHog Cloud US somente depois de uma decisão explícita do visitante. Sem consentimento para **Métricas e feedback**, o SDK não é importado, não há requisições ao PostHog e os eventos anteriores são descartados. O sinal DNT do navegador sempre prevalece.

## Configuração de produção

O frontend precisa apenas da Project API Key pública:

```dotenv
VITE_POSTHOG_ENABLED=true
VITE_POSTHOG_KEY=phc_project_token_publico
VITE_POSTHOG_HOST=https://us.i.posthog.com
```

Nunca exponha Personal API Keys ou chaves administrativas em variáveis `VITE_`.

No projeto **Default project** do PostHog, confirme antes do rollout:

- fuso horário `America/Sao_Paulo`;
- retenção de eventos de 12 meses e de replays de 30 dias;
- amostragem de replay em 100% e duração mínima de 10 segundos;
- gravação de console, headers e payloads de rede desativada;
- replay autorizado apenas em `www.mattecnologia.dev.br` e `mattecnologia.dev.br`;
- IP não anonimizado conforme a decisão registrada na política de privacidade.

O cliente inicia o Replay assim que há consentimento para as duas categorias. O PostHog mantém a gravação em buffer e descarta remotamente sessões com menos de 10 segundos, preservando o começo das sessões válidas. O cliente não captura console ou conteúdo de rede, mascara todos os inputs e bloqueia elementos `.ph-no-capture`.

## Consentimento

A decisão fica no cookie necessário `mat_consent_v1` por até 180 dias, usando `Secure`, `SameSite=Lax` e `Path=/`. As categorias são:

- **Necessários:** sempre ativos; armazenam somente a preferência.
- **Métricas e feedback:** eventos manuais, identificador anônimo persistente e survey.
- **Gravações:** Session Replay; depende obrigatoriamente de métricas.

O PostHog usa persistência `localStorage+cookie`, com validade de 180 dias e sem perfis de pessoa ou chamadas a `identify()`. Ao revogar métricas, o site interrompe o replay, faz opt-out, remove cookies e armazenamento local do PostHog, descarta a fila e recarrega a página.

## Links de compartilhamento

- LinkedIn: `https://www.mattecnologia.dev.br/recrutadores/?origem=linkedin`
- Gupy: `https://www.mattecnologia.dev.br/recrutadores/?origem=gupy`
- E-mail: `https://www.mattecnologia.dev.br/recrutadores/?origem=email`

A origem explícita mais recente vale durante a aba atual. `origem` é consumido e removido antes de carregar o analytics. Outros parâmetros são descartados, e somente hashes conhecidos do site permanecem na URL.

## Eventos

| Evento | Uso | Propriedades adicionais |
| --- | --- | --- |
| `page_viewed` | Início efetivo da coleta consentida | — |
| `resume_download_clicked` | Intenção de baixar o PDF | `location` |
| `contact_clicked` | Abertura de canal de contato | `channel`, `location` |
| `profile_clicked` | Abertura do GitHub pessoal | `platform`, `location` |
| `project_clicked` | Abertura de case, produto ou repositório | `project_id`, `destination`, `location` |
| `contact_form_submitted` | EmailJS confirmou o envio | `location` |

Todos recebem apenas `page_path`, `page_type` e `source` como contexto próprio. Autocapture, pageviews automáticos, heatmaps, performance, erros, dead clicks e rage clicks permanecem desativados. Query strings, hashes, valores do formulário e conteúdo da estimativa não são adicionados aos eventos.

## Survey de feedback

O survey **Portfólio — Feedback da página** está criado como rascunho:

- botão `Feedback`;
- nota obrigatória de 1 a 5 para “Esta página ajudou você a encontrar o que precisava?”;
- comentário opcional com aviso para não inserir dados pessoais ou confidenciais;
- oculto em `/privacidade/` e carregado apenas com consentimento para métricas.

Rascunho: <https://us.posthog.com/project/559357/surveys/01a00cd1-d2e7-0000-2077-a64b4ee27d72>

Não publique o survey antes da sessão consentida de validação em produção. Respostas só devem ser vinculadas a gravações quando o visitante também autorizar Replay.

## Dashboard `Portifólio - Conversão`

Os sete insights existentes foram preservados. Foram adicionados:

1. **Feedbacks enviados** — respostas ao longo do tempo.
2. **Avaliação do site — notas** — distribuição das notas.
3. **Funil — visita até contato** — `page_viewed` → `project_clicked` → `contact_clicked` ou `contact_form_submitted`.

Depois que houver dados, crie no painel as playlists privadas de replays com contato e com avaliações baixas; a integração disponível não expõe criação de playlists. O dashboard deve permanecer privado.

## Checklist de rollout

1. Publique o código mantendo o survey como rascunho.
2. Em uma sessão de produção, rejeite cookies e confirme ausência de requests, cookies e localStorage do PostHog.
3. Autorize somente métricas e confirme eventos e survey sem Replay.
4. Autorize Replay, permaneça mais de 10 segundos e teste navegação, formulário e comentário do survey.
5. Confirme que marcadores inseridos em nome, e-mail, telefone e mensagem não aparecem no vídeo nem nos payloads; o comentário deve existir apenas na resposta do survey.
6. Revogue o consentimento e valide o fim das chamadas e a remoção da persistência.
7. Revise manualmente o replay e os payloads e, se estiverem limpos, publique o survey.

## Validação local

```bash
npm test
npm run lint
npm run build
npm run preview
```

Referências: [persistência no JavaScript SDK](https://posthog.com/docs/libraries/js/persistence) e [privacidade do Session Replay](https://posthog.com/docs/session-replay/privacy).
