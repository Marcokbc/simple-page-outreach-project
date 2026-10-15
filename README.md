# Empreendedorismo em Foco — Guia & Portal do Projeto de Extensão

Este repositório contém a aplicação web desenvolvida para o Projeto de Extensão Universitária (UNEX):
**"Empreendedorismo Feminino, Gestão e Segurança Jurídica para Microempreendedoras"** (Parceria Direito & Sistemas de Informação).

---

## 📁 Estrutura de Pastas e Arquivos

```text
Projeto Empreendedorismo/
│
├── index.html                   # Página principal (Single Page Application com seções claras)
│
├── assets/                      # Arquivos estáticos
│   ├── css/
│   │   ├── style.css            # Estilos gerais, layout, tipografia e design tokens
│   │   └── components.css       # Estilos específicos (cards, checklists, modal, estrelas de avaliação)
│   ├── js/
│   │   ├── app.js               # Lógica principal de navegação, busca, filtros e interatividade
│   │   ├── checklist.js         # Lógica dinâmica dos checklists interativos (com salvamento local)
│   │   └── rating.js            # Sistema interativo de feedback com estrelas (solicitado pelo grupo)
│   ├── img/                     # Imagens, ilustrações e favicons
│   │   └── logo.png
│   └── data/
│       └── content.json         # Base de dados estruturada do Guia Prático em 3 camadas
│
├── docs/                        # Documentos de apoio e referências enviadas pelo grupo
│   └── Guia Pratico Empreendedorismo em Foco.pdf
│
└── README.md                    # Documentação e instruções de execução/hospedagem (Vercel/GitHub Pages)
```

---

## 🎯 Pilares do Projeto (Baseado no Guia e Mensagens do Grupo)

1. **Abordagem Didática em 3 Camadas** (Conforme especificado pelo Direito):
   - 📜 **O que a Lei diz** (Base Legal: CDC, Código Civil, LGPD, ANVISA, Lei do Salão-Parceiro)
   - 💡 **O que isso significa na prática** (Linguagem acessível e sem juridiquês)
   - 🛡️ **Como evitar o problema** (Passo a passo preventivo)

2. **Categorias Principais**:
   - Regras Gerais & Vendas (Instagram / WhatsApp / Internet)
   - Contratos, Encomendas e Sinal
   - Cobranças & Golpes do Pix
   - Imagem, Fotos de Clientes e LGPD
   - Alimentos & Regras Sanitárias (Anvisa)
   - Beleza e Estética (Normas, Biossegurança e Responsabilidade)
   - Prestadoras de Serviços (Design, Costura, Fotografia, Social Media)

3. **Recursos Práticos Interativos**:
   - 📋 **Checklists Interativos** (Geral, Comida, Beleza, Imagem, Contratos)
   - 🔍 **"Situações do Dia a Dia" / FAQ Prático** (Dúvidas comuns rápidas)
   - ⭐ **Widget de Avaliação do Site com Estrelas** (Atendendo ao pedido expresso no WhatsApp)
   - 📝 **Link direto para o Formulário de Diagnóstico** (`https://forms.gle/CNi8nQm6ViK3J8j4A`)
   - ⚠️ **Disclaimer Jurídico** (Projeto educacional de extensão universitária)

---

## 🚀 Como Executar

Por ser um projeto em HTML, CSS e Vanilla JS puro, não requer dependências de build ou Node.js:
1. Abra o arquivo `index.html` em qualquer navegador web, ou
2. Utilize uma extensão como o *Live Server* no VS Code / IDE.
3. Para publicar, basta subir no **Vercel** ou **GitHub Pages** diretamente sem configuração adicional.
