#   ComUnidade - Global Solution FIAP 📱
## 👥 Integrantes

- **Nome:** Guilherme Francisco   
  **RM:** 554678 
- **Nome:** Larissa de Freitas
  **RM:** 555136
- **Nome:** João Victor Rebello de Santis  
  **RM:** 555287
## 📺 Link para o Vídeo de Demonstração no YouTube

(https://youtu.be/Am0JvEMA3nk)


## 💡 Descrição da Solução "ComUnidade"

O "ComUnidade" é uma aplicação móvel desenvolvida em React Native (com Expo) como parte da Global Solution da FIAP. O objetivo é fornecer uma ferramenta para mitigar os impactos de eventos extremos na população, facilitando a comunicação e o acesso a informações cruciais, com foco em funcionalidades que podem operar em cenários de conectividade limitada ou offline.

**Principais Funcionalidades Implementadas no Frontend:**

* **Interface de Utilizador Clara e Moderna:** Um design dark mode consistente em todas as telas.
* **Navegação Intuitiva:** Navegação por abas para as secções principais (Início, Canais, Boletins, SOS, Mapa) e navegação por pilha para telas internas.
* **Tela Inicial (Home):** Apresenta a logo da aplicação e acesso rápido às principais funcionalidades.
* **Boletins de Alerta e Informação (UI e CRUD Parcial):**
    * Interface para listar boletins.
    * Interface para criar novos boletins (com campos para título, local, descrição, severidade).
    * Interface para ver detalhes de um boletim.
    * Interface para editar boletins.
    * Lógica para interagir com um serviço (`bulletinService.js`) que deveria comunicar com a API backend para as operações CRUD.
* **Canais de Comunicação (Simulado Localmente):**
    * Tela que lista canais fixos (ex: Bombeiros, Defesa Civil).
    * Permite abrir um "chat" com esses canais, onde as mensagens enviadas pelo utilizador são guardadas localmente no dispositivo (`AsyncStorage`).
* **SOS com Localização:**
    * Botão SOS proeminente que tenta obter a geolocalização do utilizador.
    * Exibe a localização obtida e um alerta de confirmação.
    * Botão para tentar iniciar uma chamada para um número de emergência local.
* **Mapa e Recursos Offline:**
    * Permite ao utilizador selecionar uma imagem de mapa da galeria do seu dispositivo para servir como referência offline.
    * Funcionalidade para adicionar, visualizar e excluir pontos de interesse categorizados (ex: Abrigo, Água, Perigo), que são guardados localmente.

**Tecnologias Utilizadas no Frontend:**

* React Native (com Expo)
* JavaScript
* React Navigation (para navegação)
* Axios (para chamadas à API no `bulletinService.js`)
* AsyncStorage (para persistência local de dados do chat e mapa)
* Expo Image Picker (para selecionar imagem do mapa)
* Expo Location (para obter geolocalização na tela SOS)
* React Native Vector Icons (para iconografia)

---

## 🔗 Link do Repositório Backend (Java Spring Boot)

[[LINK_REPOSITORIO_BACKEND_GITHUB_CLASSROOM]](https://github.com/Gu1LhermeF5P/comunidade_java_v)

---

## ⚠️ Estado da Integração com o Backend Java

A API backend em Java Spring Boot foi desenvolvida para fornecer as funcionalidades CRUD para os Boletins, incluindo autenticação JWT e persistência em banco de dados Oracle. A API está funcional quando testada isoladamente (ex: via Postman, após configuração correta do ambiente e banco de dados).

**No entanto, no momento da gravação deste vídeo de demonstração, estamos a enfrentar um desafio de conectividade de rede (`[AxiosError: Network Error]`) entre a aplicação frontend React Native (a correr no emulador Android) e o servidor backend Java (a correr localmente no PC).**

Isto impede que a aplicação frontend busque ou envie dados para a API Java em tempo real na demonstração. As funcionalidades CRUD na aplicação estão implementadas no frontend para chamar o `bulletinService.js`, mas as chamadas a este serviço resultam no "Network Error" devido a este problema de conectividade.

**Causas Prováveis para o "Network Error" (em investigação):**
* Configurações de Firewall no PC que aloja o backend.
* Configurações de rede específicas do ambiente de desenvolvimento que impedem o emulador de aceder ao `localhost` do PC através do IP `10.0.2.2`.

Apesar deste impedimento na comunicação direta com a API durante esta demonstração, a estrutura do frontend para consumir os serviços CRUD está implementada.

---

## 📋 Instruções para Executar o Frontend Localmente

1.  **Pré-requisitos:**
    * Node.js (LTS)
    * npm ou yarn
    * Expo CLI (`npm install -g expo-cli` ou `yarn global add expo-cli`)
    * Aplicação Expo Go instalada no seu telemóvel Android ou iOS.

2.  **Clone o Repositório:**
    ```bash
    git clone [LINK_REPOSITORIO_FRONTEND_GITHUB_CLASSROOM]
    cd nome-da-pasta-do-frontend
    ```

3.  **Instale as Dependências:**
    ```bash
    npm install
    # ou
    yarn install
    ```

4.  **Execute a Aplicação:**
    ```bash
    npx expo start
    ```

5.  **Abra no Expo Go:**
    * Digitalize o QR Code exibido no terminal com a aplicação Expo Go no seu telemóvel.
    * Certifique-se de que o seu telemóvel e o computador estão na mesma rede Wi-Fi.

6.  **Para Testar com a API Backend (quando a conectividade for resolvida):**
    * Certifique-se de que o servidor backend Java Spring Boot está em execução.
    * No ficheiro `src/services/bulletinService.js` do frontend, ajuste a constante `API_BASE_URL` para o endereço correto do seu backend (ex: `http://10.0.2.2:8080/api` para emulador Android ou o IP da sua máquina na rede local).

---
