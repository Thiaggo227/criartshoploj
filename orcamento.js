document.addEventListener('DOMContentLoaded', () => {
    const productsContainer = document.getElementById('products-container');
    const addProductBtn = document.getElementById('btn-add-product');
    const form = document.querySelector('form');

    // Elementos do Modal Customizado
    const customModal = document.getElementById('custom-modal');
    const modalMessage = document.getElementById('modal-message');
    const modalCloseBtn = document.getElementById('modal-close-btn');

    function showModal(message) {
        modalMessage.textContent = message;
        customModal.classList.add('active');
    }

    if (modalCloseBtn) {
        modalCloseBtn.addEventListener('click', () => {
            customModal.classList.remove('active');
        });
    }

    if (customModal) {
        customModal.addEventListener('click', (e) => {
            if (e.target === customModal) {
                customModal.classList.remove('active');
            }
        });
    }

    // Função para atualizar os números dos produtos (Produto 1, Produto 2, etc.)
    function updateProductNumbers() {
        const productItems = productsContainer.querySelectorAll('.product-item');
        productItems.forEach((item, index) => {
            const numberSpan = item.querySelector('.product-number');
            const titleTextSpan = item.querySelector('.product-title-text');
            
            const newIndex = index + 1;
            numberSpan.textContent = newIndex;
            titleTextSpan.textContent = `Produto ${newIndex}`;
        });
    }

    // Função para criar o HTML de um novo bloco de produto
    function createProductItem() {
        const productItem = document.createElement('div');
        productItem.className = 'product-item';

        productItem.innerHTML = `
            <div class="product-header-bar">
                <div class="product-title-area">
                    <span class="product-number">1</span>
                    <span class="product-title-text">Produto 1</span>
                </div>
                <button type="button" class="btn-delete" title="Remover produto">
                    <i class="fa-solid fa-trash-can"></i>
                </button>
            </div>

            <div class="product-grid">
                <!-- Produto -->
                <div class="form-group">
                    <label>Produto *</label>
                    <div class="input-wrapper">
                        <i class="fa-solid fa-box left-icon"></i>
                        <select required>
                            <option value="" disabled selected>Selecione o produto</option>
                            <option value="medalha">Medalha</option>
                            <option value="trofeu">Troféu</option>
                            <option value="placa">Placa</option>
                            <option value="pedra">Pedra</option>
                            <option value="brinde">Brinde</option>
                        </select>
                        <i class="fa-solid fa-chevron-down right-icon"></i>
                    </div>
                </div>

                <!-- Material -->
                <div class="form-group">
                    <label>Material *</label>
                    <div class="input-wrapper">
                        <i class="fa-solid fa-layer-group left-icon"></i>
                        <select required>
                            <option value="" disabled selected>Selecione o material</option>
                            <option value="acrilico">Acrílico</option>
                            <option value="acm">ACM</option>
                            <option value="mdf">MDF</option>
                            <option value="metal">Metal</option>
                            <option value="polimero">Polímero</option>
                            <option value="zamac">Zamac</option>
                        </select>
                        <i class="fa-solid fa-chevron-down right-icon"></i>
                    </div>
                </div>

                <!-- Quantidade -->
                <div class="form-group">
                    <label>Quantidade *</label>
                    <div class="input-wrapper">
                        <i class="fa-solid fa-hashtag left-icon"></i>
                        <input type="text" placeholder="Qtd." required>
                    </div>
                </div>

                <!-- Data -->
                <div class="form-group">
                    <label>Data *</label>
                    <div class="input-wrapper">
                        <i class="fa-regular fa-calendar left-icon"></i>
                        <input type="text" placeholder="dd/mm/aaaa" onfocus="(this.type='date')" onblur="(this.type='text')" required>
                        <i class="fa-regular fa-calendar right-icon"></i>
                    </div>
                </div>

                <!-- Observação -->
                <div class="form-group observation-group">
                    <label>Observação</label>
                    <div class="input-wrapper">
                        <i class="fa-regular fa-file-lines left-icon"></i>
                        <textarea placeholder="Informe detalhes, tamanho, personalizações, etc."></textarea>
                    </div>
                </div>
            </div>
        `;

        // Evento para o botão de deletar este bloco específico
        const deleteBtn = productItem.querySelector('.btn-delete');
        deleteBtn.addEventListener('click', () => {
            if (productsContainer.querySelectorAll('.product-item').length > 1) {
                productItem.remove();
                updateProductNumbers();
            } else {
                showModal('O orçamento precisa ter pelo menos um produto.');
            }
        });

        return productItem;
    }

    // Ação do botão "Adicionar produto"
    if (addProductBtn) {
        addProductBtn.addEventListener('click', () => {
            const newItem = createProductItem();
            productsContainer.appendChild(newItem);
            updateProductNumbers();
        });
    }

    // Inicializa o evento de remoção para o primeiro item estático
    const initialDeleteBtn = document.querySelector('.product-item .btn-delete');
    if (initialDeleteBtn) {
        initialDeleteBtn.addEventListener('click', (e) => {
            const item = e.target.closest('.product-item');
            if (productsContainer.querySelectorAll('.product-item').length > 1) {
                item.remove();
                updateProductNumbers();
            } else {
                showModal('O orçamento precisa ter pelo menos um produto.');
            }
        });
    }

    // Validação e Envio para o WhatsApp com o modelo exato
    if (form) {
        form.addEventListener('submit', (e) => {
            e.preventDefault(); // Impede o envio padrão do form

            const productItems = productsContainer.querySelectorAll('.product-item');
            let isValid = true;
            let errorMessage = '';
            let whatsappMessage = "Olá! Gostaria de solicitar um orçamento.\n\n";
            let totalUnidades = 0;

            productItems.forEach((item, index) => {
                const selects = item.querySelectorAll('select');
                const productSelect = selects[0];
                const materialSelect = selects[1];
                const qtyInput = item.querySelector('input[placeholder="Qtd."]');
                const dateInput = item.querySelector('input[type="date"], input[onfocus]');
                const obsTextarea = item.querySelector('textarea');

                const produtoVal = productSelect ? productSelect.value : '';
                const produtoText = productSelect && productSelect.selectedIndex > 0 ? productSelect.options[productSelect.selectedIndex].text : '';
                
                const materialVal = materialSelect ? materialSelect.value : '';
                const materialText = materialSelect && materialSelect.selectedIndex > 0 ? materialSelect.options[materialSelect.selectedIndex].text : '';
                
                const quantidade = qtyInput ? parseInt(qtyInput.value, 10) || 0 : 0;
                let data = dateInput ? dateInput.value : '';
                const observacao = obsTextarea ? obsTextarea.value.trim() : '';
                const numProduto = index + 1;

                // Regras de validação
                if (produtoVal === 'medalha') {
                    if (materialVal === 'acrilico') {
                        if (isNaN(quantidade) || quantidade < 10) {
                            isValid = false;
                            errorMessage = `Produto ${numProduto}: Para Medalha em Acrílico, a quantidade deve ser 10 ou acima.`;
                        }
                    } else if (materialVal === 'zamac') {
                        if (isNaN(quantidade) || quantidade < 70) {
                            isValid = false;
                            errorMessage = `Produto ${numProduto}: Para Medalha em Zamac, a quantidade deve ser 70 ou acima.`;
                        }
                    }
                }

                totalUnidades += quantidade;

                // Formata a data para dd/mm/aaaa caso venha no formato yyyy-mm-dd do input date
                if (data && data.includes('-')) {
                    const parts = data.split('-');
                    if (parts.length === 3) {
                        data = `${parts[2]}/${parts[1]}/${parts[0]}`;
                    }
                }

                // Numeração com zero à esquerda (01, 02...)
                const numStr = numProduto < 10 ? `0${numProduto}` : numProduto;

                // Montagem do texto seguindo exatamente o modelo solicitado
                whatsappMessage += `📦 PRODUTO ${numStr}\n`;
                whatsappMessage += `Produto: ${produtoText}\n`;
                whatsappMessage += `Quantidade: ${quantidade} unidades\n`;
                whatsappMessage += `Material: ${materialText}\n`;
                whatsappMessage += `Data necessária: ${data || 'Não informada'}\n`;
                whatsappMessage += `Observação: ${observacao || 'Nenhuma observação informada.'}\n\n`;
            });

            if (!isValid) {
                showModal(errorMessage);
                return;
            }

            // Bloco de Resumo da Solicitação
            whatsappMessage += `📋 RESUMO DA SOLICITAÇÃO\n`;
            whatsappMessage += `Total de produtos: ${productItems.length} tipos\n`;
            whatsappMessage += `Total de unidades: ${totalUnidades}\n`;
            whatsappMessage += `Aguardo o retorno. Obrigado!`;

            // Número do WhatsApp configurado: 43 98485-6043
            const telefone = "5543984856043";
            const url = `https://wa.me/${telefone}?text=${encodeURIComponent(whatsappMessage)}`;
            
            // Abre o WhatsApp com a mensagem formatada
            window.open(url, '_blank');
        });
    }
});