# Projeto 1 - Aplicação de Animes com React

Este projeto foi desenvolvido no âmbito da Unidade Curricular UC00610. Consiste numa aplicação web ("Single Page Application") que consome dados de uma API pública para apresentar informações sobre Animes.

## 📋 Funcionalidades
* **Listagem:** Apresentação dos "Top Animes" mais populares na página inicial.
* **Pesquisa:** Barra de pesquisa funcional que permite encontrar animes por nome.
* **Detalhes:** Página dedicada para cada anime com sinopse, imagem, pontuação, ano, episódios e géneros.
* **Navegação:** Utilização de rotas para navegar entre a lista e os detalhes sem recarregar a página.

## 🌐 API Escolhida
* **Nome:** Jikan API (Unofficial MyAnimeList API)
* **Documentação:** https://jikan.moe/
* **Justificação:** Escolhi esta API porque é pública, gratuita, não requer chaves de autenticação (API Keys) complexas e fornece dados ricos (imagens, descrições, classificações) ideais para demonstrar listagens e detalhes.

## 🛠️ Tecnologias Utilizadas
* **React + Vite:** Para construção da interface e gestão de estado.
* **Bootstrap 5:** Para estilização responsiva e componentes visuais (Cards, Navbar, Grelhas).
* **React Router Dom:** Para gestão da navegação entre páginas.

## 🚀 Como executar o projeto
Para correr este projeto localmente, siga os passos abaixo:

1. **Instalar dependências:**
   Abra o terminal na pasta do projeto e execute:
   ```bash
   npm install