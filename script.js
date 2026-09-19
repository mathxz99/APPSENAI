// script.js - Lógica de Elegibilidade

document.getElementById('vagaForm').addEventListener('submit', function(e) {
    e.preventDefault();

    const nome = document.getElementById('nome').value.trim();
    const idade = parseInt(document.getElementById('idade').value);
    
    // Tratamento para aceitar vírgula ou ponto
    let alturaInput = document.getElementById('altura').value.replace(',', '.');
    const altura = parseFloat(alturaInput);

    // CRITÉRIO: Altura >= 1.70 e Idade >= 18
    const eApto = (altura >= 1.70) && (idade >= 18);

    const modal = document.getElementById('popupModal');
    const modalTitle = document.getElementById('modalTitle');
    const modalMessage = document.getElementById('modalMessage');

    document.getElementById('resNome').innerText = nome;
    document.getElementById('resIdade').innerText = idade + " anos";
    document.getElementById('resAltura').innerText = altura.toFixed(2) + " m";

    if (eApto) {
        modalTitle.innerText = "Parabéns!";
        modalTitle.style.color = "#ffffff";
        modalMessage.innerText = "Parabéns! Você pode prosseguir no processo para a vaga!";
    } else {
        modalTitle.innerText = "Infelizmente";
        modalTitle.style.color = "#ff003c";
        modalMessage.innerText = "Infelizmente você não é apto à vaga";
    }

    modal.classList.remove('hidden');
});

function fecharModal() {
    document.getElementById('popupModal').classList.add('hidden');
}