# 🤝 Contribuindo para Runner Ranker

Obrigado por considerar contribuir para este projeto! Aqui estão as diretrizes.

## 📋 Código de Conduta

Seja respeitoso, inclusivo e profissional ao interagir com a comunidade.

## 🔄 Processo de Contribuição

### 1. Faça um Fork do Repositório

```bash
git clone https://github.com/sr-jalves/runner-ranker.git
cd runner-ranker
```

### 2. Crie uma Branch de Feature

```bash
git checkout -b feature/sua-feature-descritiva
# ou para bugfix
git checkout -b bugfix/descricao-do-bug
```

### 3. Faça Suas Mudanças

- Mantenha o código limpo e legível
- Siga o estilo do projeto (ESLint, Prettier)
- Adicione testes para novas funcionalidades
- Atualize a documentação conforme necessário

### 4. Commit com Mensagens Claras

```bash
git commit -m "feat: adiciona nova funcionalidade X"
# ou
git commit -m "fix: corrige bug em Y"
```

**Prefixos recomendados:**
- `feat:` - Nova funcionalidade
- `fix:` - Correção de bug
- `docs:` - Documentação
- `style:` - Formatação (sem mudanças lógicas)
- `refactor:` - Refatoração de código
- `test:` - Testes
- `chore:` - Manutenção

### 5. Push e Abra um Pull Request

```bash
git push origin feature/sua-feature
```

Abra um PR no GitHub com:
- Título descritivo
- Descrição clara do que foi mudado e por quê
- Referência a issues relacionadas (ex: "Closes #123")
- Checklist de testes

## 🧪 Padrões de Código

### TypeScript
- Use tipos explícitos
- Evite `any`
- Interfaces para objetos públicos

### Formatação
```bash
npm run lint      # Verifica código
npm run format    # Formata automaticamente
```

### Testes
Toda feature nova deve ter testes:
```bash
npm test
npm run test:coverage
```

## 📝 Checklist para PR

- [ ] Código segue o estilo do projeto
- [ ] Testes adicionados/atualizados
- [ ] Documentação atualizada
- [ ] Sem warnings ou erros no lint
- [ ] Commits com mensagens claras
- [ ] Branch atualizada com `main`

## ❓ Dúvidas?

- Abra uma [Discussion](https://github.com/sr-jalves/runner-ranker/discussions)
- Consulte a documentação
- Abra uma Issue se encontrar algo confuso

## 🙏 Agradecimentos

Obrigado por contribuir! Cada contribuição faz diferença! 🎉
