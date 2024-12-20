import { createStore } from "vuex";

export default createStore({
    state: {
        // Carrega o carrinho do Local Storage ou inicia vazio
        carrinho: JSON.parse(localStorage.getItem("carrinho")) || [],
    },
    mutations: {
        adicionarAoCarrinho(state, item) {
            // Verifica se o item com o mesmo nome e preço já está no carrinho
            const itemExistente = state.carrinho.find(
                (produto) => produto.nome === item.nome && produto.preco === item.preco
            );

            if (itemExistente) {
                // Incrementa a quantidade do item existente
                itemExistente.quantidade++;
            } else {
                // Adiciona o novo item com quantidade inicial 1
                state.carrinho.push({ ...item, quantidade: 1 });
            }

            // Atualiza o Local Storage
            localStorage.setItem("carrinho", JSON.stringify(state.carrinho));
        },

        aumentarQuantidade(state, item) {
            const produto = state.carrinho.find(
                (produto) => produto.nome === item.nome && produto.preco === item.preco
            );
            if (produto) {
                produto.quantidade++; // Aumenta a quantidade
            }
            // Atualiza o Local Storage
            localStorage.setItem("carrinho", JSON.stringify(state.carrinho));
        },


        diminuirQuantidade(state, item) {
            const itemExistente = state.carrinho.find((produto) => produto.nome === item.nome);
            if (itemExistente && itemExistente.quantidade > 1) {
                itemExistente.quantidade--;  // Decrementa a quantidade
            }
        },
        removerDoCarrinho(state, index) {
            state.carrinho.splice(index, 1);
            // Atualiza o Local Storage
            localStorage.setItem("carrinho", JSON.stringify(state.carrinho));
        },
    },
    getters: {
        // Total do carrinho (preço total)
        totalCarrinho: (state) => {
            return state.carrinho.reduce(
                (total, item) => total + item.preco * item.quantidade,
                0
            );
        },
        // Quantidade total de itens no carrinho
        quantidadeTotal: (state) => {
            return state.carrinho.reduce((total, item) => total + item.quantidade, 0);
        },
        // Carrinho formatado com contadores
        itensCarrinho: (state) => {
            return state.carrinho.map((item) => ({
                ...item,
                total: item.preco * item.quantidade,
            }));
        },
    },
});
