<template>
  <!-- Navegação -->
  <div>
    <header>
      <nav class="navbar navbar-expand-lg bg-primary fixed-top">
        <div class="container-fluid">
          <router-link to="/" class="nav-link">
            <img class="logo me-" :src="require('@/assets/img/LogoLanche.jpg')" alt="logo" height="50">
          </router-link>
          <button
              class="navbar-toggler"
              type="button"
              data-bs-toggle="collapse"
              data-bs-target="#navbarNavDropdown"
              aria-controls="navbarNavDropdown"
              aria-expanded="false"
              aria-label="Toggle navigation"
          >
            <span class="navbar-toggler-icon"></span>
          </button>
          <div class="collapse navbar-collapse" id="navbarNavDropdown">

            <ul class="navbar-nav">
              <li class="nav-item">
                <router-link to="/" class="nav-link" aria-current="page">Home</router-link>
              </li>
              <li class="nav-item">
                <router-link to="/sobre" class="nav-link">Sobre</router-link>
              </li>
              <li class="nav-item">
                <router-link to="/servicos" class="nav-link">Cardápio</router-link>
              </li>
              <li class="nav-item dropdown">
                <a
                    class="nav-link dropdown-toggle"
                    href="#"
                    role="button"
                    data-bs-toggle="dropdown"
                    aria-expanded="false"
                >
                  Mais
                </a>
                <ul class="dropdown-menu">
                  <li><a class="dropdown-item" href="#">Contato</a></li>
                  <li><a class="dropdown-item" href="#">Localização</a></li>
                  <li><a class="dropdown-item" href="#">Sobre Nós</a></li>
                </ul>
              </li>
            </ul>
          </div>
        </div>


        <div class="rede-social">

          <ul>
            <li class="rede-social-icon">
              <a @click.prevent="irParaWhatsApp">
                <img src="https://cdn-icons-png.flaticon.com/512/733/733585.png" alt="WhatsApp" class="rede-icon" />
              </a>
            </li>

            <li class="rede-social-icon">
              <a href="https://www.instagram.com/pastelaria_flor_da_chapada?igsh=ZXFiMm82OW43dXV4" >
                <img src="https://cdn-icons-png.flaticon.com/512/174/174855.png" alt="Instagram" class="rede-icon" />
              </a>
            </li>
          </ul>


        </div>


        <div>
          <!-- Ícone do Carrinho -->
          <section>
            <div>
              <div @click="alternarPopup" class="icone-carrinho">
                <img src="https://cdn-icons-png.flaticon.com/512/3514/3514491.png" alt="Carrinho" class="carrinho-icon" />
                <span class="contador">{{ carrinho.length }}</span> <!-- Exibe a quantidade de itens -->
                <!-- Notificação -->
                <span class="contador" v-if="carrinho.length > 0">{{ carrinho.length }}</span>
              </div>

              <!-- Pop-up do Carrinho -->
              <div v-if="popupAberto" class="popup">
                <div class="popup-conteudo">
                  <!-- Botão "X" no canto superior esquerdo -->
                  <button @click="alternarPopup" class="fechar-btn">
                    &times;
                  </button>

                  <h3>Itens no Carrinho</h3>
                  <ul>
                    <!-- Exibe itens agrupados com quantidade -->
                    <li v-for="(item, index) in carrinho" :key="index" class="item-carrinho">
                      <div class="item-info">
                        <!-- Container para os ícones de aumentar e diminuir -->
                        <div class="quantidade-container">
                          <!-- Ícone de adicionar quantidade -->
                          <i class="fas fa-plus" @click="aumentarQuantidade(item)" title="Aumentar quantidade"></i>

                          <!-- Ícone para diminuir a quantidade -->
                          <i class="fas fa-minus" @click="diminuirQuantidade(item)" title="Diminuir quantidade"></i>
                        </div>

                             <span class="item-nome">
                                 <button class="indicador-btn">{{ item.quantidade }}</button>
                                <strong>{{ item.nome }}</strong>
                             </span>

                             <span class="item-preco">
                               R$ {{ (item.preco * item.quantidade).toFixed(2) }}
                              </span>
                        </div>

                      <!-- Ícone para remover o item -->
                      <i @click="removerCarrinho(index)" class="fas fa-trash btn-remover" title="Remover item"></i>
                    </li>
                  </ul>


                  <p><strong>Total: R$ {{ total ? total.toFixed(2) : "0.00" }}</strong></p>


                  <!-- Botão para Abrir Prévia do Comprovante -->
                  <button @click="abrirPreviaComprovante" class="btn btn-primary mt-3">Enviar pedido</button>
                </div>
              </div>

              <!-- Pop-up da Prévia do Comprovante -->
              <!-- Pop-up da Prévia do Comprovante -->
              <div v-if="popupPreviaAberto" class="popup">
                <div class="popup-conteudo">
                  <h3>Prévia do Comprovante</h3>

                  <!-- Mensagem de erro geral -->
                  <p v-if="erroMensagem" class="alert alert-danger">{{ erroMensagem }}</p>

                  <!-- Campo Nome -->
                  <label for="nomeUsuario">Digite seu nome:</label>
                  <input
                      id="nomeUsuario"
                      v-model="nomeUsuario"
                      type="text"
                      class="form-control"
                      placeholder="Seu Nome"
                  />
                  <p v-if="erroNome" class="text-danger">Por favor, preencha seu nome antes de continuar.</p>

                  <!-- Campo Endereço -->
                  <label for="enderecoUsuario">Digite seu endereço:</label>
                  <input
                      id="enderecoUsuario"
                      v-model="enderecoUsuario"
                      type="text"
                      class="form-control"
                      placeholder="Seu Endereço"
                  />
                  <p v-if="erroEndereco" class="text-danger">Por favor, preencha seu endereço antes de continuar.</p>

                  <!-- Exibição do Comprovante -->
                  <div id="comprovante-container" style="padding: 20px; border: 1px solid #ccc; margin-top: 20px;">
                    <h2>Comprovante de Pedido</h2>
                    <p><strong>Nome:</strong> {{ nomeUsuario || "Não informado" }}</p>
                    <p><strong>Endereço:</strong> {{ enderecoUsuario || "Não informado" }}</p>

                    <ul>
                      <li v-for="(item, index) in carrinho" :key="index">
                        <!-- Exibe o nome do item em uma linha -->
                        <div><strong> {{ item.quantidade }}{{ item.nome }}</strong></div>
                        <!-- Exibe a quantidade e o preço em outra linha -->
                        <div> R$ {{ (item.preco * item.quantidade).toFixed(2) }}</div>
                      </li>
                    </ul>

                    <!-- Exibe o total do carrinho -->
                    <p><strong>Total:</strong> R$ {{ total.toFixed(2) }}</p>

                    <!-- Exibe a data do pedido -->
                    <p><strong>Data:</strong> {{ new Date().toLocaleString() }}</p>
                  </div>


                  <!-- Botões de ação -->
                  <div class="botoes-acao mt-3">
                    <button @click="gerarComprovantePDF" class="btn btn-primary">Baixar PDF</button>
                    <button @click="gerarComprovanteImagem" class="btn btn-secondary">Baixar Imagem</button>
                  </div>

                  <!-- Botão para Enviar o Comprovante via WhatsApp -->
                  <button
                      @click="irParaWhatsAppComprovante"
                      class="btn btn-success mt-3"
                      :disabled="!comprovanteURL" > <!-- Desativa se nenhum comprovante foi gerado -->
                    Enviar Comprovante via WhatsApp
                  </button>

                  <button @click="fecharPreviaComprovante" class="btn btn-danger mt-3">Desistir do pedido</button>
                </div>
              </div>

            </div>
          </section>


        </div>
      </nav>
    </header>
    <router-view></router-view>




    <!-- Rodapé -->
    <footer class="footer">
      <div class="footer-container">
        <div class="footer-section sobre">
          <h3 class="footer-titulo">Flor da Chapada</h3>
          <p class="footer-descricao">
            Um lugar especial para saborear o melhor da Chapada Diamantina. Lanches frescos, ingredientes locais e um ambiente acolhedor.
          </p>
        </div>
        <div class="footer-section links">
          <h3 class="footer-titulo">Links Úteis</h3>
          <ul class="footer-links">
            <li> <router-link to="/sobre" class="nav-link">Sobre Nós</router-link></li>
            <li><router-link to="/servicos" class="nav-link">Cardápio</router-link></li>
            <li><a href="#opinions">Opiniões</a></li>
            <li><a href="#contact">Contato</a></li>
          </ul>
        </div>
        <div class="footer-section contato">
          <h3 class="footer-titulo">Fale Conosco</h3>
          <p><strong>Email:</strong> contato@flordachapada.com</p>
          <p><strong>Telefone:</strong> (71) 99290-1499</p>
          <div class="footer-redes">
            <a href="#" class="rede-link">
              <img src="https://cdn-icons-png.flaticon.com/512/733/733585.png" alt="WhatsApp" class="rede-icon" />
            </a>
            <a href="https://www.instagram.com/pastelaria_flor_da_chapada?igsh=ZXFiMm82OW43dXV4" class="rede-link">
              <img src="https://cdn-icons-png.flaticon.com/512/174/174855.png" alt="Instagram" class="rede-icon" />
            </a>
          </div>
        </div>
      </div>

      <div class="footer-creditos">
        <p>&copy; 2024 Flor da Chapada. Todos os direitos reservados.</p>
      </div>
    </footer>
  </div>
</template>
<script>
import jsPDF from "jspdf";
import html2canvas from "html2canvas";
import { mapState, mapMutations } from "vuex";

export default {
  name: "App",

  data() {
    return {
      popupAberto: false,
      popupPreviaAberto: false,
      nomeUsuario: "", // Nome do usuário
      erroNome: false, // Indica se há um erro no preenchimento do nome
      enderecoUsuario: "", // Endereço do usuário
      erroEndereco: false, // Indica erro no endereço
      comprovanteURL: "", // Variável para armazenar o URL do comprovante
    };
  },
  computed: {
    ...mapState(["carrinho"]),
    total() {
      // Garante que `reduce` sempre retorna um número
      const total = this.carrinho.reduce(
          (acc, item) => acc + (item.preco * (item.quantidade || 1)),
          0
      );
      return total; // Retorna o total cru (sem formatação)
    },
  },
  methods: {
    ...mapMutations(["removerDoCarrinho", "adicionarAoCarrinho", "aumentarQuantidade","diminuirQuantidade"]), // Mapeia mutations do Vuex

    removerCarrinho(index) {
      this.removerDoCarrinho(index); // Chama a mutation para remover o item
    },

    alternarPopup() {
      this.popupAberto = !this.popupAberto;  // Alterna entre verdadeiro e falso
    },
    aumentarQuantidade(item) {
      // Não chame a função diretamente dentro dela mesma. Em vez disso, chame a mutation do Vuex.
      this.aumentarQuantidadeMutation(item);
    },


    // Se necessário, adicione a mutation aqui:
    aumentarQuantidadeMutation(item) {
      this.$store.commit("aumentarQuantidade", item);  // Chama a mutation do Vuex
    },

    diminuirQuantidade(item) {
      this.diminuirQuantidadeMutation(item); // Chama a mutation para diminuir a quantidade
    },
    diminuirQuantidadeMutation(item) {
      this.$store.commit("diminuirQuantidade", item);
    },


    gerarMensagem() {
      const agora = new Date();
      const hora = agora.getHours();

      // Definir saudação com base no horário
      let saudacao;
      if (hora < 12) {
        saudacao = "Bom dia";
      } else if (hora < 18) {
        saudacao = "Boa tarde";
      } else {
        saudacao = "Boa noite";
      }

      // Criar a mensagem inicial
      const mensagem = `${saudacao}, gostaria de iniciar um pedido.\n`;
      return encodeURIComponent(mensagem); // Codificar para URL
    },

    gerarLinkWhatsApp() {
      const numeroWhatsApp = "557192901499";
      const mensagem = this.gerarMensagem();
      return `https://api.whatsapp.com/send?phone=${numeroWhatsApp}&text=${mensagem}`;
    },

    irParaWhatsApp() {
      const link = this.gerarLinkWhatsApp();
      window.open(link, "_blank");
    },

    // Método de envio do comprovante via WhatsApp
    gerarLinkWhatsAppComprovante() {
      const numeroWhatsApp = "557192901499"; // Substitua pelo número do WhatsApp
      const mensagem = encodeURIComponent(
          `Olá, segue as informações do meu pedido:\n\nLink para baixar: ${this.comprovanteURL}`
      );

      return `https://api.whatsapp.com/send?phone=${numeroWhatsApp}&text=${mensagem}`;
    },

    // Método que abre o link do WhatsApp
    irParaWhatsAppComprovante() {
      if (this.comprovanteURL) {
        const link = this.gerarLinkWhatsAppComprovante();
        window.open(link, "_blank"); // Abre o link em uma nova aba
      } else {
        alert("Comprovante não gerado. Por favor, gere o comprovante primeiro.");
      }
    },

    // Controle do pop-up da prévia do comprovante
    abrirPreviaComprovante() {
      if (this.carrinho.length === 0) {
        alert("Seu carrinho está vazio. Adicione itens antes de visualizar a prévia do comprovante.");
        return; // Impede a execução do código abaixo
      }
      this.popupPreviaAberto = true;
    },
    fecharPreviaComprovante() {
      this.popupPreviaAberto = false;
    },

    // Geração de PDF
    gerarComprovantePDF() {
      // Limpa mensagens de erro anteriores
      this.erroMensagem = "";

      // Valida o campo Nome
      if (!this.nomeUsuario.trim()) {
        this.erroNome = true;
        this.erroMensagem = "Por favor, preencha o nome antes de gerar o PDF.";
        return; // Sai da função se o nome não estiver preenchido
      } else {
        this.erroNome = false;
      }

      // Valida o campo Endereço
      if (!this.enderecoUsuario.trim()) {
        this.erroEndereco = true;
        this.erroMensagem = "Por favor, preencha o endereço antes de gerar o PDF.";
        return; // Sai da função se o endereço não estiver preenchido
      } else {
        this.erroEndereco = false;
      }

      // Gera o PDF se ambos os campos estiverem preenchidos
      this.erroMensagem = ""; // Limpa mensagens de erro para seguir

      const doc = new jsPDF();
      let linhaInicial = 20;

// Título do Comprovante
      doc.setFontSize(16);
      doc.text("Comprovante de Pedido", 10, linhaInicial);
      linhaInicial += 10;

// Informações do Usuário
      doc.setFontSize(14);
      doc.text(`Nome: ${this.nomeUsuario || "Não informado"}`, 10, linhaInicial);
      linhaInicial += 10;
      doc.text(`Endereço: ${this.enderecoUsuario || "Não informado"}`, 10, linhaInicial);
      linhaInicial += 10;

// Itens no Carrinho
      this.carrinho.forEach((item) => {
        const totalItem = (item.preco * item.quantidade).toFixed(2); // Calcula o total do item (quantidade * preço)
        doc.text(`${item.quantidade}x ${item.nome} - R$ ${totalItem}`, 10, linhaInicial);
        linhaInicial += 10;
      });

// Total
      linhaInicial += 10;
      doc.setFontSize(14);
      const totalFormatado = this.total.toFixed(2); // Formata o total
      doc.text(`Total: R$ ${totalFormatado}`, 10, linhaInicial);

// Data
      linhaInicial += 10;
      doc.setFontSize(10);
      doc.text(`Data: ${new Date().toLocaleString()}`, 10, linhaInicial);

// Salva o PDF
      doc.save("comprovante.pdf");



      // Atualiza a URL do comprovante com o link do arquivo gerado (para PDF, isso seria mais difícil sem um upload)
      // Como estamos gerando um PDF, não podemos ter uma URL simples como no caso da imagem.
      // Aqui, você pode precisar hospedar o arquivo em um servidor para obter um link de download público.
      this.comprovanteURL = "URL_do_comprovante_gerado"; // Substitua com o link do PDF hospedado ou outra solução
    },

    // Geração de Imagem
    gerarComprovanteImagem() {
      // Limpa mensagens de erro anteriores
      this.erroMensagem = "";

      // Valida o campo Nome
      if (!this.nomeUsuario.trim()) {
        this.erroNome = true;
        this.erroMensagem = "Por favor, preencha o nome antes de gerar a imagem.";
        return; // Sai da função se o nome não estiver preenchido
      } else {
        this.erroNome = false;
      }

      // Valida o campo Endereço
      if (!this.enderecoUsuario.trim()) {
        this.erroEndereco = true;
        this.erroMensagem = "Por favor, preencha o endereço antes de gerar a imagem.";
        return; // Sai da função se o endereço não estiver preenchido
      } else {
        this.erroEndereco = false;
      }

      // Gera a imagem se ambos os campos estiverem preenchidos
      this.erroMensagem = ""; // Limpa mensagens de erro para seguir

      const element = document.getElementById("comprovante-container");
      html2canvas(element).then((canvas) => {
        const imageURL = canvas.toDataURL("image/png"); // Gerando a URL base64

        // Atualiza a URL do comprovante com a URL base64 da imagem
        this.comprovanteURL = imageURL; // Agora a URL da imagem gerada será usada

        // Caso você queira fazer o download da imagem:
        const link = document.createElement("a");
        link.href = imageURL;
        link.download = "comprovante.png";
        link.click();
      });
    },
  },
};

</script>


<style>


.contador {
  position: absolute;
  top: 10px; /* Ajuste a posição */
  right: 10px; /* Ajuste a posição */
  background-color: red;
  color: white;
  font-size: 12px;
  font-weight: bold;
  border-radius: 50%;
  width: 20px;
  height: 20px;
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000; /* Garante que fica acima de outros elementos */
}

.popup {
  position: absolute; /* ou fixed, dependendo do comportamento desejado */
  top: 90px; /* Ajuste para posicionar abaixo da barra de navegação */
  right: 10px; /* Ajuste para alinhar na lateral */
  background-color: white;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
  padding: 20px;
  border-radius: 8px;
  z-index: 1000; /* Garante que ficará acima de outros elementos */
  width: 400px; /* Largura fixa para evitar alterações na interface */

  /* Adicionando limites e rolagem */
  max-height: 400px; /* Define uma altura máxima para o popup */
  overflow-y: auto; /* Adiciona rolagem vertical */
  overflow-x: scroll; /* Adiciona rolagem horizontal */
  word-wrap: break-word; /* Evita que palavras muito longas quebrem o layout */
}

.fechar-btn {
  position: absolute; /* Para ignorar o padding */
  top: -7px; /* Ajusta para sair do padding */
  left: 5px; /* Ajusta para sair do padding */
  background: none; /* Sem fundo */
  border: none; /* Sem borda */
  font-size: 30px; /* Tamanho do "X" */
  cursor: pointer; /* Cursor de botão */
  color: #333; /* Cor inicial */
  padding: 0; /* Sem preenchimento extra */
}

.fechar-btn:hover {
  color: #ff0000;
  background: none;
}

.fechar-btn::before {
  content: '';
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  width: 20px;
  height: 20px;
  border-radius: 50%;
  background-color: rgba(0, 0, 0, 0.1);
  z-index: -1; /* Mantém o fundo atrás do "X" */
  transition: background-color 0.3s ease;
}

.fechar-btn:hover::before {
  background-color: rgba(255, 0, 0, 0.2); /* Cor de fundo ao passar o mouse */
}


.btn-remover {
  color: #cd2222; /* Texto branco */
  border: none; /* Sem borda */
  border-radius: 20px; /* Borda arredondada */
  padding: 5px 15px; /* Tamanho pequeno */
  font-size: 14px; /* Tamanho da fonte pequeno */
  cursor: pointer; /* Mudar o cursor para indicar que é clicável */
  transition: background-color 0.3s, transform 0.2s; /* Efeito de transição suave */
}

.btn-remover:hover {
  transform: scale(1.5); /* Aumenta ligeiramente o tamanho do botão ao passar o mouse */
}

.btn-remover:active {
  transform: scale(0.95); /* Efeito de pressionamento */
}




  .indicador-btn {
    background-color: #4caf50; /* Cor de fundo verde */
    width: 15px; /* Largura igual à altura */
    height: 15px; /* Altura igual à largura */
    border-radius: 50%; /* Faz o botão ser perfeitamente circular */
    font-size: 10px; /* Tamanho do texto/ícone */
    display: flex; /* Centraliza o conteúdo */
    justify-content: center; /* Centraliza horizontalmente */
    align-items: center; /* Centraliza verticalmente */
    transition: transform 0.2s ease, background-color 0.3s ease; /* Suaviza no hover */
    padding: 0; /* Remove espaçamentos internos */
    border: none; /* Remove borda (caso algum estilo padrão a aplique) */
    box-sizing: border-box; /* Garante que padding/border não afete as dimensões */
    pointer-events: none; /* Desativa o clique do botão */
  }



/*  botão + ------------------------------------------------------*/
.item-carrinho {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 10px;
  padding: 0;
  border-bottom: 1px solid #ccc; /* Linha separadora entre os itens */
}

.item-info {
  display: flex;
  align-items: center;
  gap: 10px; /* Espaço entre os elementos */
  flex-grow: 1; /* Permite que o nome do item ocupe o espaço necessário */
}

.item-preco {
  white-space: nowrap; /* Impede a quebra de linha para o preço */
  font-weight: bold;
  margin-left: auto; /* Empurra o preço para o lado direito */
}
.fas.fa-plus,
.fas.fa-minus {
  cursor: pointer; /* Muda o cursor para indicar que é clicável */
  color: #007bff; /* Cor do ícone */

}

.fas.fa-plus:hover,
.fas.fa-minus:hover {
  color: #0056b3; /* Cor ao passar o mouse */
  transform: scale(1.5); /* Aumenta ligeiramente o tamanho do botão ao passar o mouse */
}

.fas.fa-plus:active,
.fas.fa-minus:active  {
  transform: scale(0.95); /* Efeito de pressionamento */
}

/*   ------------------------------------------------------*/

/* carrinho de compras */

.icone-carrinho{

  height: 50px;
  width: 50px;
  margin-right:20px ;
  align-items: center;
}


ul {
  list-style-type: none; /* Remove os pontos da lista */
  margin: 0 !important; /* Remove margem padrão */
  padding: 0 !important; /* Remove padding padrão */
}

/* Estilo básico para a navegação */
.logo {
  width: 70px;
}
.rede-link {
  display: inline-block;
  width: 30px;
  height: 30px;
}

.rede-icon {
  width: 30px; /* Tamanho do ícone */
  height: auto;
  filter: invert(100%); /* Inverte as cores para o modo claro */
  transition: transform 0.3s ease; /* Animação suave ao passar o mouse */
  cursor: pointer; /* Mostra que é clicável */
  transition: transform 0.3s ease; /* Animação suave */
  transform: translateY(-50%); /* Ajusta a centralização vertical */
}


.rede-social {
  position: absolute; /* Posiciona os ícones fora do fluxo normal da página */
  top: 60px; /* Distância do topo da barra de navegação */
  right: 100px; /* Distância da margem direita */
  display: flex; /* Alinha os itens horizontalmente */
  justify-content: flex-end; /* Alinha à direita */
  gap: 19px; /* Espaçamento entre os itens */
  z-index: 100; /* Garante que os ícones fiquem acima de outros elementos */
}

.rede-social ul {
  display: flex; /* Organiza os itens em linha */
  list-style: none; /* Remove os marcadores padrão da lista */
  padding: 0; /* Remove o padding padrão */
  margin: 0; /* Remove a margem padrão */
  gap: 15px; /* Espaçamento entre os itens */
}

.rede-social-icon {
  display: flex; /* Permite que o ícone se comporte como um bloco flexível */
  align-items: center; /* Centraliza verticalmente */
  justify-content: center; /* Centraliza horizontalmente */
  filter: invert(100%); /* Inverte as cores para destaque */
  transition: transform 0.4s ease; /* Animação suave */
  transform: translateY(-50%); /* Centraliza verticalmente */
}

.rede-social-icon:hover {
  transform: scale(1.2); /* Efeito de aumentar ao passar o mouse */
}


.rede-social-icon:hover {
  transform: scale(1.2); /* Aumenta o ícone ao passar o mouse */
}
.carrinho-icon {
  width: 50px; /* Tamanho do ícone */
  height: auto;
  filter: invert(100%); /* Inverte as cores */
  transition: transform 0.3s ease; /* Suaviza o efeito */
  position: absolute; /* Posiciona o ícone em relação ao contêiner pai */
  top: 20px; /* Distância do topo (ajuste conforme necessário) */
  right: 10px; /* Distância da direita (ajuste conforme necessário) */
  z-index: 9999; /* Coloca o ícone acima de outros elementos */
}


nav a {
  color: #333;
  text-decoration: none;
  font-weight: bold;
}

router-link-active {
  color: #4CAF50;
}


/* Estilo do Footer */
.footer {
  background-color: #321a02;
  color: #fff;
  padding: 30px 20px;
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
}

.footer-container {
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  gap: 40px;
  max-width: 1200px;
  width: 100%;
}

.footer-section {
  flex: 1;
  min-width: 250px;
}

.footer-titulo {
  font-size: 20px;
  margin-bottom: 10px;
  border-bottom: 2px solid #fff;
  display: inline-block;
}

.footer-descricao {
  font-size: 14px;
  line-height: 1.6;
}

.footer-links {
  list-style: none;
  padding: 0;
}

.footer-links li {
  margin-bottom: 8px;
}

.footer-links a {
  color: #eef6f2;
  text-decoration: none;
  font-size: 14px;
}

.footer-links a:hover {
  text-decoration: underline;
}

.footer-redes {
  display: flex;
  justify-content: center;
  gap: 10px;
  margin-top: 10px;
}

.rede-link:hover .rede-icon {
  transform: scale(1.1);
}

.footer-creditos {
  margin-top: 20px;
  font-size: 12px;
  border-top: 1px solid #fff;
  padding-top: 10px;
  width: 100%;
  max-width: 1200px;
  text-align: center;
}


/* Smartphones (até 600px) */
@media (max-width: 600px) {
  .popup {
    width: 90%; /* Pop-up ocupa quase toda a largura */
    right: 5%; /* Centraliza o pop-up em relação à tela */
  }

  .icone-carrinho {
    height: 40px;
    width: 40px;
  }

  .icones {
    top: 5px;
    right: 10px;
    gap: 15px;
  }

  .footer-container {
    gap: 20px; /* Menor espaçamento no rodapé */
  }

  .footer-section {
    min-width: 100%; /* Rodapé ocupa toda a largura */
  }

  .footer-titulo {
    font-size: 18px;
  }

  .footer-descricao {
    font-size: 12px;
  }
}

/* Tablets (601px a 1024px) */
@media (min-width: 601px) and (max-width: 1024px) {
  .popup {
    width: 70%; /* Reduz o tamanho do pop-up */
  }

  .icone-carrinho {
    height: 45px;
    width: 45px;
  }

  .icones {
    top: 10px;
    right: 20px;
    gap: 25px;
  }

  .footer-container {
    gap: 30px;
  }

  .footer-section {
    min-width: 45%; /* Duas colunas no rodapé */
  }

  .footer-titulo {
    font-size: 19px;
  }

  .footer-descricao {
    font-size: 13px;
  }
}

/* Desktops grandes (acima de 1024px) */
@media (min-width: 1025px) {
  .popup {
    width: 300px;
  }

  .footer-container {
    gap: 40px; /* Espaçamento maior entre seções */
  }

  .footer-section {
    min-width: 250px;
  }

  .footer-titulo {
    font-size: 20px;
  }

  .footer-descricao {
    font-size: 14px;
  }
}
</style>
