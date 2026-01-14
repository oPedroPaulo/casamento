// CONFIGURAÇÃO DA DATA DO CASAMENTO - 8 DE DEZEMBRO DE 2026
const weddingDate = new Date(2026, 11, 8, 15, 0, 0).getTime();

// Função para atualizar a contagem regressiva
function updateCountdown() {
    const now = new Date().getTime();
    const timeLeft = weddingDate - now;
    
    if (timeLeft < 0) {
        document.getElementById('days').textContent = '00';
        document.getElementById('hours').textContent = '00';
        document.getElementById('minutes').textContent = '00';
        document.getElementById('seconds').textContent = '00';
        return;
    }
    
    const days = Math.floor(timeLeft / (1000 * 60 * 60 * 24));
    const hours = Math.floor((timeLeft % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const minutes = Math.floor((timeLeft % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = Math.floor((timeLeft % (1000 * 60)) / 1000);
    
    document.getElementById('days').textContent = days.toString().padStart(2, '0');
    document.getElementById('hours').textContent = hours.toString().padStart(2, '0');
    document.getElementById('minutes').textContent = minutes.toString().padStart(2, '0');
    document.getElementById('seconds').textContent = seconds.toString().padStart(2, '0');
}

// Iniciar contagem regressiva
updateCountdown();
setInterval(updateCountdown, 1000);

// Variável para contar os membros da família
let memberCount = 1;

// Gerenciar membros da família no formulário
document.getElementById('add-member').addEventListener('click', function() {
    const membersContainer = document.getElementById('family-members');
    memberCount++;
    
    const memberDiv = document.createElement('div');
    memberDiv.className = 'member-item';
    memberDiv.innerHTML = `
        <input type="text" class="member-name" name="membro_${memberCount}" placeholder="Nome completo" required>
        <button type="button" class="remove-member"><i class="fas fa-minus"></i></button>
    `;
    membersContainer.appendChild(memberDiv);
    
    // Ativar botão de remover do primeiro membro se houver mais de um
    const removeButtons = document.querySelectorAll('.remove-member');
    if (removeButtons.length > 1) {
        removeButtons[0].disabled = false;
    }
    
    // Adicionar evento ao botão de remover
    memberDiv.querySelector('.remove-member').addEventListener('click', function() {
        memberDiv.remove();
        memberCount--;
        
        // Desativar botão de remover do primeiro membro se houver apenas um
        const remainingButtons = document.querySelectorAll('.remove-member');
        if (remainingButtons.length === 1) {
            remainingButtons[0].disabled = true;
        }
        
        // Renumerar os campos restantes
        renumberMembers();
    });
});

// Função para renumerar os campos de membros
function renumberMembers() {
    const memberInputs = document.querySelectorAll('.member-name');
    memberCount = 0;
    
    memberInputs.forEach((input, index) => {
        memberCount++;
        input.name = `membro_${memberCount}`;
    });
}

// Configuração do envio do formulário
document.getElementById('attendance-form').addEventListener('submit', async function(e) {
    e.preventDefault();
    
    // Validar se há pelo menos um membro
    const memberInputs = document.querySelectorAll('.member-name');
    const members = Array.from(memberInputs).map(input => input.value).filter(name => name.trim() !== '');
    
    if (members.length === 0) {
        showMessage('error', 'Por favor, adicione pelo menos um membro da família.');
        return;
    }
    
    // Mostrar mensagem de carregamento
    showMessage('loading', '');
    
    try {
        // Coletar todos os dados do formulário
        const formData = new FormData(this);
        
        // Adicionar todos os membros como uma string separada por vírgulas
        const membersString = members.join(', ');
        formData.append('membros_familia', membersString);
        
        // Enviar para o Formspree
        const response = await fetch(this.action, {
            method: 'POST',
            body: formData,
            headers: {
                'Accept': 'application/json'
            }
        });
        
        if (response.ok) {
            showMessage('success', 'Confirmação enviada com sucesso! Você receberá um e-mail de confirmação.');
            
            // Limpar formulário após envio bem-sucedido
            this.reset();
            
            // Resetar membros da família para apenas um campo
            const membersContainer = document.getElementById('family-members');
            membersContainer.innerHTML = `
                <div class="member-item">
                    <input type="text" class="member-name" name="membro_1" placeholder="Nome completo" required>
                    <button type="button" class="remove-member" disabled><i class="fas fa-minus"></i></button>
                </div>
            `;
            memberCount = 1;
            
            // Scroll para a mensagem de sucesso
            document.getElementById('success-message').scrollIntoView({ behavior: 'smooth' });
            
        } else {
            showMessage('error', 'Ocorreu um erro ao enviar. Por favor, tente novamente.');
        }
        
    } catch (error) {
        console.error('Erro:', error);
        showMessage('error', 'Erro de conexão. Verifique sua internet e tente novamente.');
    }
});

// Função para mostrar mensagens de status
function showMessage(type, customMessage) {
    // Esconder todas as mensagens primeiro
    document.getElementById('success-message').style.display = 'none';
    document.getElementById('error-message').style.display = 'none';
    document.getElementById('loading-message').style.display = 'none';
    
    if (type === 'success') {
        document.getElementById('success-message').style.display = 'block';
    } else if (type === 'error') {
        document.getElementById('error-message').style.display = 'block';
        if (customMessage) {
            document.getElementById('error-message').innerHTML = `<i class="fas fa-exclamation-circle"></i> ${customMessage}`;
        }
    } else if (type === 'loading') {
        document.getElementById('loading-message').style.display = 'block';
    }
}

// Navegação suave para as seções
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function(e) {
        e.preventDefault();
        
        const targetId = this.getAttribute('href');
        if (targetId === '#') return;
        
        const targetElement = document.querySelector(targetId);
        if (targetElement) {
            window.scrollTo({
                top: targetElement.offsetTop - 80,
                behavior: 'smooth'
            });
        }
    });
});