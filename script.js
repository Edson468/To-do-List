function adicionar() {
    const selecao = document.getElementById("tarefas-selecao");
    const descricao = document.getElementById("descricao");
    const hr = document.getElementById("hora");
    const dt = document.getElementById("data");
    const priori = document.getElementById("prioridade");
    const listaDeTarefas = document.querySelector(".lista-tarefas");

    const sel = selecao.options[selecao.selectedIndex].text;
    const tipo = selecao.value;
    const desc = descricao.value;
    const hora = hr.value;
    const data = dt.value;
    const prioridade = priori.options[priori.selectedIndex].text;

    const li = document.createElement("li");
    li.setAttribute("data-tipo", tipo);
    li.setAttribute("data-prioridade", prioridade);
    li.innerHTML = `Tarefa de ${sel} - Descrição: ${desc} - Hora: ${hora} - Data: ${data} - Prioridade: ${prioridade} 
        <button class="btn-remover" onclick="remover(this)">Remover</button> 
        <button class="btn-editar" onclick="editar(this)">Editar</button> 
        <button class="btn-concluida" onclick="concluida(this)">Concluída</button> 
        <button class="btn-pendente" onclick="pendente(this)">Pendente</button>`;
    li.classList.add("tarefa-item");
    listaDeTarefas.appendChild(li);

    selecao.selectedIndex = 0;
    descricao.value = "";
    hr.value = "";
    dt.value = "";
    priori.selectedIndex = 0;

    verificarAtrasadas();
}

// Função para remover tarefa
function remover(botao) {
    const li = botao.parentElement;
    removerDasCaixas(li.textContent);
    li.remove();
}

// Função para editar tarefa
function editar(botao) {
    const li = botao.parentElement;
    const texto = li.textContent;
    const tipo = texto.match(/Tarefa de (.*?) -/)[1];
    const descricao = texto.match(/Descrição: (.*?) - Hora:/)[1];
    const hora = texto.match(/Hora: (.*?) - Data:/)[1];
    const data = texto.match(/Data: (.*?) - Prioridade:/)[1];
    const prioridade = texto.match(/Prioridade: (.*)/)[1];

    document.getElementById("tarefas-selecao").value = tipo.toLowerCase();
    document.getElementById("descricao").value = descricao;
    document.getElementById("hora").value = hora;
    document.getElementById("data").value = data;
    document.getElementById("prioridade").value = prioridade.toLowerCase();

    removerDasCaixas(li.textContent);
    li.remove();
}

// Função para marcar como concluída
function concluida(botao) {
    const li = botao.parentElement;
    li.classList.add("concluida");
    li.classList.remove("atrasada1h", "atrasada2h");
    li.style.background = "#b9f6ca"; // verde claro

    removerDasCaixas(li.textContent);

    // Extrai dados para mostrar na caixa de concluídas
    const texto = li.textContent;
    const tarefa = texto.match(/Tarefa de (.*?) -/)[1];
    const descricao = texto.match(/Descrição: (.*?) - Hora:/)[1];
    const prioridade = texto.match(/Prioridade: (.*)/)[1];

    adicionarNaCaixaFormatada("lista-concluidas", tarefa, descricao, prioridade);
}

// Função para marcar como pendente
function pendente(botao) {
    const li = botao.parentElement;
    li.classList.remove("concluida", "atrasada1h", "atrasada2h");
    li.style.background = "";

    removerDasCaixas(li.textContent);

    // Extrai dados para mostrar na caixa de pendentes
    const texto = li.textContent;
    const tarefa = texto.match(/Tarefa de (.*?) -/)[1];
    const descricao = texto.match(/Descrição: (.*?) - Hora:/)[1];
    const prioridade = texto.match(/Prioridade: (.*)/)[1];

    adicionarNaCaixaFormatada("lista-pendentes", tarefa, descricao, prioridade);
}

// Função para verificar tarefas atrasadas
function verificarAtrasadas() {
    const agora = new Date();
    document.querySelectorAll('.lista-tarefas li').forEach(li => {
        if (!li.classList.contains("concluida")) {
            const texto = li.textContent;
            const horaMatch = texto.match(/Hora: (\d{2}:\d{2})/);
            const dataMatch = texto.match(/Data: (\d{4}-\d{2}-\d{2})/);
            if (horaMatch && dataMatch) {
                const dataHora = new Date(`${dataMatch[1]}T${horaMatch[1]}`);
                const diffMs = agora - dataHora;
                const diffH = diffMs / (1000 * 60 * 60);

                li.classList.remove("atrasada1h", "atrasada2h");
                li.style.background = "";

                removerDasCaixas(li.textContent);

                // Extrai dados para mostrar nas caixas
                const tarefa = texto.match(/Tarefa de (.*?) -/)[1];
                const descricao = texto.match(/Descrição: (.*?) - Hora:/)[1];
                const prioridade = texto.match(/Prioridade: (.*)/)[1];

                if (diffH >= 1 && diffH < 2) {
                    li.classList.add("atrasada1h");
                    li.style.background = "#ffd699"; // laranja claro
                    adicionarNaCaixaFormatada("lista-pendentes", tarefa, descricao, prioridade);
                } else if (diffH >= 2) {
                    li.classList.add("atrasada2h");
                    li.style.background = "#ffcdd2"; // vermelho claro
                    adicionarNaCaixaFormatada("lista-atrasadas", tarefa, descricao, prioridade);
                }
            }
        }
    });
}

// Adiciona tarefa formatada na caixa de status, evitando duplicidade e sem botões
function adicionarNaCaixaFormatada(caixaId, tarefa, descricao, prioridade) {
    const caixa = document.getElementById(caixaId);
    const textoFormatado = `Tarefa: ${tarefa} | Descrição: ${descricao} | Prioridade: ${prioridade}`;
    if (![...caixa.children].some(li => li.textContent === textoFormatado)) {
        const novoLi = document.createElement("li");
        novoLi.textContent = textoFormatado;
        caixa.appendChild(novoLi);
    }
}

// Remove tarefa das caixas de status
function removerDasCaixas(texto) {
    const descricaoMatch = texto.match(/Descrição: (.*?) - Hora:/);
    if (!descricaoMatch) return;
    const descricao = descricaoMatch[1];
    ["lista-concluidas", "lista-pendentes", "lista-atrasadas"].forEach(caixaId => {
        const caixa = document.getElementById(caixaId);
        [...caixa.children].forEach(item => {
            if (item.textContent.includes(descricao)) item.remove();
        });
    });
}

// FILTRO DOS LINKS DO MENU (opcional)
document.querySelectorAll('nav a').forEach(link => {
    link.addEventListener('click', function(e) {
        e.preventDefault();
        let tipo = this.getAttribute('href').replace('.html', '').toLowerCase();

        document.querySelectorAll('.lista-tarefas li').forEach(li => {
            if (tipo === 'home') {
                li.style.display = '';
            } else {
                li.style.display = (li.getAttribute('data-tipo') === tipo) ? '' : 'none';
            }
        });
    });
});