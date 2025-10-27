// ===== VARIÁVEIS GLOBAIS =====
let currentDate = new Date();
let selectedDate = null;
let selectedTimeSlot = null;

// ===== INICIALIZAÇÃO =====
document.addEventListener('DOMContentLoaded', function() {
    renderCalendar();
    setupEventListeners();
});

// ===== RENDERIZAR CALENDÁRIO =====
function renderCalendar() {
    const year = currentDate.getFullYear();
    const month = currentDate.getMonth();
    
    // Atualizar título do mês
    const monthNames = [
        'Janeiro', 'Fevereiro', 'Março', 'Abril', 'Maio', 'Junho',
        'Julho', 'Agosto', 'Setembro', 'Outubro', 'Novembro', 'Dezembro'
    ];
    
    document.getElementById('monthYear').textContent = `${monthNames[month]}`;
    
    // Atualizar o título do calendário no topo (Janeiro)
    document.querySelector('.calendar-header-top h2').textContent = monthNames[month];
    
    // Limpar dias anteriores
    const calendarDays = document.getElementById('calendarDays');
    calendarDays.innerHTML = '';
    
    // Primeiro dia do mês
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const prevLastDay = new Date(year, month, 0);
    
    const firstDayOfWeek = firstDay.getDay();
    const lastDateOfMonth = lastDay.getDate();
    const prevLastDate = prevLastDay.getDate();
    
    // Adicionar dias do mês anterior
    for (let i = firstDayOfWeek - 1; i >= 0; i--) {
        const dayElement = createDayElement(prevLastDate - i, true);
        calendarDays.appendChild(dayElement);
    }
    
    // Adicionar dias do mês atual
    let firstDayElement = null;
    for (let i = 1; i <= lastDateOfMonth; i++) {
        const dayElement = createDayElement(i, false);
        calendarDays.appendChild(dayElement);
        if (i === 1) {
            firstDayElement = dayElement;
        }
    }
    
    // Adicionar dias do próximo mês
    const totalCells = calendarDays.children.length;
    const remainingCells = 42 - totalCells; // 6 linhas x 7 dias
    for (let i = 1; i <= remainingCells; i++) {
        const dayElement = createDayElement(i, true);
        calendarDays.appendChild(dayElement);
    }

    // Selecionar o primeiro dia do mês por padrão (se não houver seleção)
    if (!selectedDate && firstDayElement) {
        selectDay(firstDayElement, 1);
    }
}

// ===== CRIAR ELEMENTO DO DIA =====
function createDayElement(day, isOtherMonth) {
    const dayElement = document.createElement('div');
    dayElement.className = 'day';
    dayElement.textContent = day;
    
    if (isOtherMonth) {
        dayElement.classList.add('other-month');
    } else {
        dayElement.addEventListener('click', function() {
            selectDay(this, day);
        });
    }
    
    return dayElement;
}

// ===== SELECIONAR DIA =====
function selectDay(element, day) {
    // Remover seleção anterior
    const previousSelected = document.querySelector('.day.selected');
    if (previousSelected) {
        previousSelected.classList.remove('selected');
    }
    
    // Adicionar seleção ao novo dia
    element.classList.add('selected');
    
    // Atualizar data selecionada
    const year = currentDate.getFullYear();
    const month = currentDate.getMonth();
    selectedDate = new Date(year, month, day);
    
    // Atualizar título da data
    updateDateTitle();
    
    // Resetar seleção de horário
    resetTimeSlotSelection();
}

// ===== ATUALIZAR TÍTULO DA DATA =====
function updateDateTitle() {
    if (!selectedDate) return;
    
    const dayNames = ['Domingo', 'Segunda-Feira', 'Terça-Feira', 'Quarta-Feira', 'Quinta-Feira', 'Sexta-Feira', 'Sábado'];
    const monthNames = [
        'Janeiro', 'Fevereiro', 'Março', 'Abril', 'Maio', 'Junho',
        'Julho', 'Agosto', 'Setembro', 'Outubro', 'Novembro', 'Dezembro'
    ];
    
    const day = selectedDate.getDate();
    const month = monthNames[selectedDate.getMonth()];
    const dayName = dayNames[selectedDate.getDay()];
    
    document.getElementById('dateTitle').textContent = `${day} de ${month}, ${dayName}`;
}

// ===== RESETAR SELEÇÃO DE HORÁRIO =====
function resetTimeSlotSelection() {
    const allSlots = document.querySelectorAll('.time-slot');
    allSlots.forEach(slot => {
        slot.classList.remove('selected');
    });
    selectedTimeSlot = null;
}

// ===== CONFIGURAR EVENT LISTENERS =====
function setupEventListeners() {
    // Botões de navegação do calendário
    document.querySelector('.prev-btn').addEventListener('click', previousMonth);
    document.querySelector('.next-btn').addEventListener('click', nextMonth);
    
    // Time slots
    const timeSlots = document.querySelectorAll('.time-slot');
    timeSlots.forEach(slot => {
        slot.addEventListener('click', function() {
            selectTimeSlot(this);
        });
    });

    // Botão de confirmação
    document.getElementById('confirmButton').addEventListener('click', confirmAppointment);
}

// ===== MESES ANTERIORES =====
function previousMonth() {
    currentDate.setMonth(currentDate.getMonth() - 1);
    renderCalendar();
}

// ===== PRÓXIMOS MESES =====
function nextMonth() {
    currentDate.setMonth(currentDate.getMonth() + 1);
    renderCalendar();
}

// ===== SELECIONAR HORÁRIO =====
function selectTimeSlot(element) {
    // Remover seleção anterior
    if (selectedTimeSlot) {
        selectedTimeSlot.classList.remove('selected');
    }
    
    // Adicionar seleção ao novo slot
    element.classList.add('selected');
    selectedTimeSlot = element;
    
    // Para fins de demonstração, vamos atribuir um horário ao slot.
    // Em um cenário real, você precisaria calcular o horário baseado na posição do slot na grade.
    // O horário está agora no atributo data-time do próprio slot (ajustado no HTML)
    // No entanto, para garantir que o horário correto seja lido, vamos usar o atributo
    const time = element.getAttribute('data-time');
    
    // Se o horário não estiver no data-time do slot, podemos tentar buscar no cabeçalho
    if (!time) {
        const timeHeaders = document.querySelectorAll('.times-header');
        // O elemento pai é a div.time-slot-row. Os filhos são os slots.
        // O índice do slot dentro da linha corresponde ao índice do cabeçalho de horário.
        const slotIndex = Array.from(element.parentNode.children).indexOf(element);
        const headerTime = timeHeaders[slotIndex] ? timeHeaders[slotIndex].textContent : 'Horário Desconhecido';
        element.setAttribute('data-time', headerTime);
    }
    
    // Log para debug (opcional)
    console.log('Horário selecionado:', selectedTimeSlot);
}

// ===== CONFIRMAR AGENDAMENTO =====
function confirmAppointment() {
    if (!selectedDate) {
        alert('Por favor, selecione um dia no calendário.');
        return;
    }

    if (!selectedTimeSlot) {
        alert('Por favor, selecione um horário na grade de agendamento.');
        return;
    }

    const day = selectedDate.toLocaleDateString('pt-BR', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' });
    const time = selectedTimeSlot.getAttribute('data-time');
    
    // Para obter o nome do profissional/sala, subimos até o pai da linha
    const professionalRow = selectedTimeSlot.closest('.time-slot-row');
    const professionalName = professionalRow ? professionalRow.getAttribute('data-professional') : 'Não Identificado';

    alert(`Agendamento Confirmado!
Dia: ${day}
Horário: ${time}
Profissional/Sala: ${professionalName}`);
}