// script.js - Validação de Elegibilidade

document.getElementById('vagaForm').addEventListener('submit', function(e) {
    e.preventDefault();

    const nome = document.getElementById('nome').value.trim();
    const idade = parseInt(document.getElementById('idade').value);
    
    // Converte vírgula para ponto caso o usuário digite "1,75"
    let alturaInput = document.getElementById('altura').value.replace(',', '.');
    const altura = parseFloat(alturaInput);

    // CRITÉRIO EXAGIDO: Altura >= 1.70 E Idade >= 18
    const eApto = (altura >= 1.70) && (idade >= 18);

    const modal = document.getElementById('popupModal');
    const modalTitle = document.getElementById('modalTitle');
    const modalMessage = document.getElementById('modalMessage');

    document.getElementById('resNome').innerText = nome;
    document.getElementById('resIdade').innerText = idade + " anos";
    document.getElementById('resAltura').innerText = altura.toFixed(2) + " m";

    if (eApto) {
        modalTitle.innerText = "Aprovado!";
        modalMessage.innerText = "Parabéns! Você pode prosseguir no processo para a vaga!";
    } else {
        modalTitle.innerText = "Inapto";
        modalMessage.innerText = "Infelizmente você não é apto à vaga";
    }

    modal.classList.remove('hidden');
});

function fecharModal() {
    document.getElementById('popupModal').classList.add('hidden');
}