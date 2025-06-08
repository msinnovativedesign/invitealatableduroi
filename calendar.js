// calendar.js
function initializeCalendar() {
  // Données des événements (peut être remplacé par un appel API)
  let events = [
    { id: 1, title: "Jeûne et prière", date: "2025-04-05", time: "08:00", description: "Journée de jeûne collectif" },
    { id: 2, title: "Rencontre jeunesse", date: "2025-04-12", time: "18:30", description: "Soirée spéciale pour les jeunes" },
    { id: 3, title: "Louange & Adoration", date: "2025-04-19", time: "19:00", description: "Soirée de louange" },
    { id: 4, title: "Étude biblique", date: "2025-04-26", time: "10:00", description: "Étude de la parole" }
  ];

  // Éléments DOM
  const calendarGrid = document.getElementById('calendarGrid');
  const eventsList = document.getElementById('eventsList');
  const currentMonthElement = document.getElementById('currentMonth');
  const prevMonthBtn = document.getElementById('prevMonth');
  const nextMonthBtn = document.getElementById('nextMonth');
  const addEventBtn = document.getElementById('addEventBtn');
  const eventModal = document.getElementById('eventModal');
  const closeBtn = document.querySelector('.close-btn');
  const eventForm = document.getElementById('eventForm');

  // Variables d'état
  let currentDate = new Date(2025, 3, 1); // Avril 2025

  // Initialisation
  renderCalendar();
  renderEventsList();

  // Événements
  prevMonthBtn.addEventListener('click', () => {
    currentDate.setMonth(currentDate.getMonth() - 1);
    renderCalendar();
  });

  nextMonthBtn.addEventListener('click', () => {
    currentDate.setMonth(currentDate.getMonth() + 1);
    renderCalendar();
  });

  addEventBtn.addEventListener('click', () => {
    eventModal.style.display = 'block';
  });

  closeBtn.addEventListener('click', () => {
    eventModal.style.display = 'none';
  });

  window.addEventListener('click', (e) => {
    if (e.target === eventModal) {
      eventModal.style.display = 'none';
    }
  });

  eventForm.addEventListener('submit', (e) => {
    e.preventDefault();
    addNewEvent();
  });

  // Fonctions
  function renderCalendar() {
    // Mettre à jour le titre du mois
    const monthNames = ["Janvier", "Février", "Mars", "Avril", "Mai", "Juin", 
                       "Juillet", "Août", "Septembre", "Octobre", "Novembre", "Décembre"];
    currentMonthElement.textContent = `${monthNames[currentDate.getMonth()]} ${currentDate.getFullYear()}`;

    // Calculer les jours du mois
    const firstDay = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1);
    const lastDay = new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 0);
    const daysInMonth = lastDay.getDate();
    const startingDay = firstDay.getDay();

    // Vider le calendrier
    calendarGrid.innerHTML = '';

    // Ajouter les en-têtes des jours
    const dayNames = ["Dim", "Lun", "Mar", "Mer", "Jeu", "Ven", "Sam"];
    dayNames.forEach(day => {
      const dayElement = document.createElement('div');
      dayElement.className = 'calendar-day-header';
      dayElement.textContent = day;
      calendarGrid.appendChild(dayElement);
    });

    // Ajouter les jours vides au début
    for (let i = 0; i < startingDay; i++) {
      const emptyDay = document.createElement('div');
      emptyDay.className = 'calendar-day empty';
      calendarGrid.appendChild(emptyDay);
    }

    // Ajouter les jours du mois
    const today = new Date();
    for (let i = 1; i <= daysInMonth; i++) {
      const dayElement = document.createElement('div');
      dayElement.className = 'calendar-day';
      
      // Vérifier si c'est aujourd'hui
      if (currentDate.getFullYear() === today.getFullYear() && 
          currentDate.getMonth() === today.getMonth() && 
          i === today.getDate()) {
        dayElement.classList.add('today');
      }

      // Ajouter le numéro du jour
      const dayNumber = document.createElement('div');
      dayNumber.className = 'calendar-day-number';
      dayNumber.textContent = i;
      dayElement.appendChild(dayNumber);

      // Ajouter les événements de ce jour
      const currentDateStr = `${currentDate.getFullYear()}-${(currentDate.getMonth()+1).toString().padStart(2, '0')}-${i.toString().padStart(2, '0')}`;
      const dayEvents = events.filter(event => event.date === currentDateStr);

      dayEvents.forEach(event => {
        const eventElement = document.createElement('div');
        eventElement.className = 'calendar-event';
        eventElement.textContent = event.title;
        eventElement.addEventListener('click', () => showEventDetails(event));
        dayElement.appendChild(eventElement);
      });

      calendarGrid.appendChild(dayElement);
    }
  }

  function renderEventsList() {
    eventsList.innerHTML = '';
    
    // Trier les événements par date
    const sortedEvents = [...events].sort((a, b) => new Date(a.date) - new Date(b.date));
    
    sortedEvents.forEach(event => {
      const eventElement = document.createElement('div');
      eventElement.className = 'event-item';
      
      const date = new Date(event.date);
      const dateStr = date.toLocaleDateString('fr-FR', { weekday: 'long', day: 'numeric', month: 'long' });
      
      eventElement.innerHTML = `
        <div class="event-date">${dateStr} ${event.time ? 'à ' + event.time : ''}</div>
        <div class="event-title">${event.title}</div>
        <div class="event-actions">
          <button class="delete-btn" data-id="${event.id}"><i class="fas fa-trash"></i></button>
        </div>
      `;
      
      eventsList.appendChild(eventElement);
    });

    // Ajouter les événements pour les boutons de suppression
    document.querySelectorAll('.delete-btn').forEach(btn => {
      btn.addEventListener('click', (e) => {
        e.stopPropagation();
        deleteEvent(parseInt(btn.dataset.id));
      });
    });
  }

  function showEventDetails(event) {
    alert(`${event.title}\n\nDate: ${event.date}\nHeure: ${event.time || 'Non spécifiée'}\n\n${event.description || 'Pas de description'}`);
  }

  function addNewEvent() {
    const title = document.getElementById('eventTitle').value;
    const date = document.getElementById('eventDate').value;
    const time = document.getElementById('eventTime').value;
    const description = document.getElementById('eventDescription').value;
    
    const newEvent = {
      id: events.length > 0 ? Math.max(...events.map(e => e.id)) + 1 : 1,
      title,
      date,
      time,
      description
    };
    
    events.push(newEvent);
    eventForm.reset();
    eventModal.style.display = 'none';
    
    renderCalendar();
    renderEventsList();
  }

  function deleteEvent(id) {
    if (confirm("Êtes-vous sûr de vouloir supprimer cet événement ?")) {
      events = events.filter(event => event.id !== id);
      renderCalendar();
      renderEventsList();
    }
  }
}

// Initialiser le calendrier quand la page est prête
document.addEventListener('DOMContentLoaded', initializeCalendar);