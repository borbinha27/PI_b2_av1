document.addEventListener('DOMContentLoaded', function () {
    const cepInput = document.getElementById('cep');
    const erroDiv = document.getElementById('erro');

    cepInput.addEventListener('input', function (e) {
        let value = e.target.value.replace(/\D/g, '');
        e.target.value = value;

        if (value.length === 8) {
            consultarCEP();
        }
    });

    cepInput.addEventListener('keypress', function (e) {
        if (e.key === 'Enter') {
            consultarCEP();
        }
    });
    

    function consultarCEP() {
        const cep = cepInput.value.trim();

        if (cep.length !== 8 || !/^\d+$/.test(cep)) {
            mostrarErro('Por favor, digite um CEP válido com 8 dígitos.');
            return;
        }

        erroDiv.style.display = 'none';

        fetch(`https://viacep.com.br/ws/${cep}/json/`)
            .then(response => {
                if (!response.ok) {
                    throw new Error('Erro na requisição');
                }
                return response.json();
            })
            .then(data => {
                if (data.erro) {
                    mostrarErro('CEP não encontrado.');
                } else {
                    preencherFormulario(data);
                }
            })
            .catch(error => {
                mostrarErro('Ocorreu um erro ao consultar o CEP. Por favor, tente novamente.');
                console.error('Erro:', error);
            });
    }

    function preencherFormulario(data) {
        document.getElementById('logradouro').value = data.logradouro || '';
        document.getElementById('bairro').value = data.bairro || '';
        document.getElementById('cidade').value = data.cidade || '';
        document.getElementById('uf').value = data.uf || '';
    }

    document.getElementById('cadastrar').addEventListener('click', function(){
        
        const campos = ['nome', 'cep', 'email', 'logradouro', 'bairro', 'cidade', 'uf', 'numero'];
        const dados = {};

        campos.forEach(id => {
            const input = document.getElementById(id);
            if (input) dados[id] = input.value;
        });

        const lista = JSON.parse(localStorage.getItem('listaCep')) || [];

        lista.push(dados);

        localStorage.setItem('listaCep', JSON.stringify(lista));

        var a = document.createElement('div').innerHTML = `
        <div class="card-body">
              <h5 class="card-title">${document.getElementById('nome')}</h5>
              <p class="card-text">💌${document.getElementById('email')},<br>📍${document.getElementById('logradouro')}, Nº${document.getElementById('numero')},<br>${document.getElementById('bairro')},${document.getElementById('cidade')} - ${document.getElementById('uf')}</p>
              <p class="cep_endereco_aluno"> CEP: ${document.getElementById('cep')} </p>
              <div class="buttons-container">
                  <button type="button" class="btn btn-primary">Editar</button>
                  <button type="button" class="btn btn-danger">Remover</button>
              </div>
          </div>
        `;

        document.getElementById('listaEnderecos').append(a);
        limparCampos();
    })

    function limparCampos() {
        const campos = ['nome', 'cep', 'email', 'logradouro', 'bairro', 'cidade', 'uf', 'numero'];
        campos.forEach(id => {
            const input = document.getElementById(id);
            if (input) input.value = '';
        });
    }

    function mostrarErro(mensagem) {
        erroDiv.textContent = mensagem;
        erroDiv.style.display = 'block';
        limparCampos();
    }
    
});
