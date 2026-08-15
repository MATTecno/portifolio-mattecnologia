# Analytics de conversão

O portfólio usa PostHog Cloud US em modo anônimo e cookieless. O carregamento é dinâmico e a integração fica silenciosamente desativada quando a configuração não existe, quando o visitante usa DNT ou quando o provedor está bloqueado.

## Ativação em produção

1. Crie um projeto no [PostHog Cloud US](https://us.posthog.com/).
2. Nas configurações do projeto, habilite **cookieless mode**. Sem essa opção no painel, o PostHog ignora eventos enviados com `cookieless_mode: "always"`.
3. Copie apenas o **Project API Key**, que é um token público próprio para o frontend.
4. No projeto da Vercel, cadastre somente no ambiente **Production**:

```dotenv
VITE_POSTHOG_ENABLED=true
VITE_POSTHOG_KEY=phc_project_token_publico
VITE_POSTHOG_HOST=https://us.i.posthog.com
```

5. Faça um novo deploy para incorporar as variáveis ao bundle do Vite.

Não use Personal API Key, chave administrativa ou outro segredo em variáveis que começam com `VITE_`.

## Links de compartilhamento

- LinkedIn: `https://www.mattecnologia.dev.br/recrutadores/?origem=linkedin`
- Gupy: `https://www.mattecnologia.dev.br/recrutadores/?origem=gupy`
- E-mail: `https://www.mattecnologia.dev.br/recrutadores/?origem=email`

A origem explícita mais recente vale durante a aba atual. O parâmetro é removido da URL e somente o slug validado fica no `sessionStorage`.

## Eventos

| Evento | Uso | Propriedades adicionais |
| --- | --- | --- |
| `page_viewed` | Abertura de página | — |
| `resume_download_clicked` | Intenção de baixar o PDF | `location` |
| `contact_clicked` | Abertura de canal de contato | `channel`, `location` |
| `profile_clicked` | Abertura do GitHub pessoal | `platform`, `location` |
| `project_clicked` | Abertura de case, produto ou repositório | `project_id`, `destination`, `location` |
| `contact_form_submitted` | EmailJS confirmou o envio | `location` |

Todos os eventos recebem apenas `page_path`, `page_type` e `source` como contexto próprio. Query strings, hashes, campos do formulário e conteúdo da estimativa não são adicionados.

## Dashboard `Portfólio — Conversão`

Crie um dashboard privado com período padrão de **Last 30 days** e adicione estes insights:

1. **Visitas por página** — tendência de `page_viewed`, breakdown por `page_path`.
2. **Origem das visitas** — total de `page_viewed`, breakdown por `source`.
3. **Intenções de contato por origem** — `contact_clicked` + `contact_form_submitted`, breakdown por `source`.
4. **Contatos por canal** — `contact_clicked`, breakdown por `channel`.
5. **Página que gerou contato** — `contact_clicked` + `contact_form_submitted`, breakdown por `page_path`.
6. **Downloads do currículo** — `resume_download_clicked`, breakdowns por `source` e `location`.
7. **Projetos mais acessados** — `project_clicked`, breakdowns por `project_id` e `destination`.

O dashboard permanece autenticado no PostHog e não deve receber link público.

## Verificação depois da ativação

Abra cada link de compartilhamento em uma aba nova, execute uma ação de contato e confira o **Live Events**. Verifique que:

- a origem está correta e persiste ao navegar para um case;
- a URL não contém `origem` depois do carregamento;
- não existem cookies do PostHog;
- não há chamadas de replay, surveys ou feature flags;
- os payloads não contêm valores do formulário, da estimativa ou query strings;
- cada clique produz apenas um evento e abre normalmente seu destino.
