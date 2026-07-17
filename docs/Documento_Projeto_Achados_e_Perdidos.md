# Sistema de Achados e Perdidos

**Versão:** 1.0\
**Desenvolvedor:** Jeferson Rodrigues da Silva

## Tecnologias

-   React
-   Vite
-   React Router
-   CSS
-   Firebase (futuramente)

------------------------------------------------------------------------

# 1. Objetivo

Desenvolver um sistema de Achados e Perdidos para substituir o controle
realizado atualmente por Google Planilhas e Google Sheets, tornando o
processo mais rápido, organizado e automatizado.

# 2. Problema Atual

Hoje o processo funciona da seguinte forma:

-   Os itens encontrados são recolhidos.
-   Todas as fotos são tiradas.
-   Cada item é lançado manualmente em uma planilha.
-   As fotos são enviadas para o Google Sheets.
-   A numeração é controlada manualmente.
-   Os associados consultam os itens disponíveis.

Esse processo exige muito trabalho manual e aumenta a chance de erros.

# 3. Objetivos do Sistema

O sistema deverá:

-   Centralizar todas as informações.
-   Automatizar a geração de códigos.
-   Facilitar o cadastro dos itens.
-   Disponibilizar os itens para consulta.
-   Controlar retiradas.
-   Controlar doações.
-   Reduzir o tempo gasto pelos funcionários.

# 4. Fluxo Operacional

``` text
Funcionário encontra objetos
        ↓
Leva todos para o setor
        ↓
Tira foto de todos
        ↓
Seleciona todas as fotos
        ↓
Confere/Reorganiza a ordem
        ↓
Inicia o cadastro
        ↓
Sistema gera os códigos automaticamente
        ↓
Itens Ativos
        ↓
Associado consulta
        ↓
Retirado ou Doado (após 60 dias)
```

# 5. Regras de Negócio

## Numeração

-   Reinicia no início de cada ano.
-   Sequência automática.
-   Nunca repetir código dentro do mesmo ano.

Exemplo:

    CAP-2026-001
    CAP-2026-002
    CAP-2026-003

Novo ano:

    CAP-2027-001
    CAP-2027-002

## Cadastro em lote

Fluxo:

1.  Selecionar todas as fotos.
2.  Conferir a ordem.
3.  Ajustar a ordem (caso necessário).
4.  Iniciar o cadastro.

Durante o cadastro:

-   Não será possível adicionar novas fotos.
-   Não será possível alterar a ordem.
-   O sistema seguirá exatamente a sequência definida.

# 6. Estrutura do Sistema

## Área Pública

-   Home
-   Categorias
-   Subcategorias
-   Itens
-   Visualizar foto

## Área Administrativa

-   Dashboard
-   Novo Cadastro
-   Itens Ativos
-   Itens Retirados
-   Itens para Doação
-   Configurações

# 7. Estrutura do Item

``` javascript
{
  id: "",
  codigo: "",
  numeroSequencial: "",
  ano: "",

  nome: "",

  categoria: "",
  subcategoria: "",

  fotoUrl: "",

  dataEncontrado: "",
  dataCadastro: "",

  observacoes: "",

  status: "",

  dataRetirada: null,
  dataDoacao: null
}
```

# 8. Status

-   ATIVO
-   RETIRADO
-   DOAÇÃO

# 9. Fluxo do Cadastro

``` text
Selecionar Fotos
        ↓
Conferir Ordem
        ↓
Começar Cadastro
        ↓
Foto 1 → CAP-2026-001
        ↓
Salvar e Próxima
        ↓
Foto 2 → CAP-2026-002
        ↓
...
        ↓
Última Foto
        ↓
Concluir Cadastro
```

# 10. Melhorias Futuras

-   Drag and Drop para reorganizar fotos.
-   Retomar cadastro interrompido.
-   Pesquisa por código.
-   Histórico de alterações.
-   Estatísticas.
-   Impressão de etiquetas.
-   QR Code.
-   Controle de permissões.
-   Backup automático.

# 11. Objetivo do Projeto

Este projeto será desenvolvido seguindo boas práticas de engenharia de
software, passando pelas etapas de planejamento, modelagem,
desenvolvimento, testes e melhorias contínuas.

Além de atender uma necessidade real de um clube, o sistema será
utilizado como projeto de portfólio, demonstrando conhecimentos em
React, arquitetura de componentes, modelagem de dados e desenvolvimento
de soluções para problemas reais.
