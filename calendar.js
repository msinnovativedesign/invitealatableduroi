function initializeCalendar() {
  // Récupérer les événements depuis localStorage ou utiliser un tableau vide
  let events = JSON.parse(localStorage.getItem('calendarEvents') || '[]');


  // Éléments DOM (avec vérification)
  const calendarGrid = document.getElementById('calendarGrid');
  const eventsList = document.getElementById('eventsList');
  const currentMonthElement = document.getElementById('currentMonth');
  const prevMonthBtn = document.getElementById('prevMonth');
  const nextMonthBtn = document.getElementById('nextMonth');
  const addEventBtn = document.getElementById('addEventBtn');
  const eventModal = document.getElementById('eventModal');
  const closeBtn = document.querySelector('.close-btn');
  const eventForm = document.getElementById('eventForm');

  const loginForm = document.getElementById('loginForm');
  const loginPassword = document.getElementById('loginPassword');
  const adminLoginForm = document.getElementById('adminLoginForm');
  const adminDashboard = document.getElementById('adminDashboard');
  const logoutBtn = document.getElementById('logoutBtn');


// Gestion du clic sur "Ajouter un événement"
if (addEventBtn) {
  addEventBtn.addEventListener("click", () => {
    if (!isAdmin) {
      // Affiche la demande de mot de passe
      adminLoginForm.style.display = "block";
    } else {
      // Ouvre directement le modal d’ajout d’événement
      const eventModal = document.getElementById("eventModal");
      if (eventModal) eventModal.style.display = "block";
    }
  });
}

// Connexion admin

if (loginForm) {
  loginForm.addEventListener("submit", function (e) {
    e.preventDefault();
    const password = loginPassword.value;

    if (password === "mdp") {
      isAdmin = true;
      adminLoginForm.style.display = "none";
      adminDashboard.style.display = "block"; // Affiche le dashboard + le bouton
    } else {
      alert("Mot de passe incorrect !");
    }
  });
}

// Déconnexion
document.getElementById("logoutBtn")?.addEventListener("click", () => {
  isAdmin = false;
  adminDashboard.style.display = "none";
  adminLoginForm.style.display = "none";
  if (eventModal) eventModal.style.display = "none";
});

// Bouton "Ajouter un événement"
document.getElementById("addEventBtn")?.addEventListener("click", () => {
  if (isAdmin && eventModal) {
    eventModal.style.display = "block";
  }
});

// Gestion du formulaire d'ajout d'évènements
  if (eventForm) {
    eventForm.addEventListener("submit", (e) => {
      e.preventDefault();
      if (isAdmin) {
        alert("Événement enregistré !");
        eventModal.style.display = "none";
        // Ici, vous pouvez appeler addNewEvent() depuis calendar.js
      } else {
        alert("Accès refusé ! Connectez-vous comme administrateur.");
        eventModal.style.display = "none";
        adminLoginForm.style.display = "block";
      }
    });
  }




  // Variables d'état
  let currentDate = new Date(); //  Date actuelle
  let isAdmin = false;

  // Initialisation du calendrier
  function initCalendar() {
    renderCalendar();
    renderEventsList();

    // Gestion des rôles
    if (!isAdmin && addEventBtn) {
      addEventBtn.style.display = 'none';
    }
  }

  // Événements principaux
  if (prevMonthBtn) {
    prevMonthBtn.addEventListener('click', () => {
      currentDate.setMonth(currentDate.getMonth() - 1);
      renderCalendar();
    });
  }

  if (nextMonthBtn) {
    nextMonthBtn.addEventListener('click', () => {
      currentDate.setMonth(currentDate.getMonth() + 1);
      renderCalendar();
    });
  }

  if (addEventBtn) {
    addEventBtn.addEventListener('click', () => {
      if (!isAdmin) {
        // Afficher le formulaire de connexion si pas admin
        adminLoginForm.style.display = 'block';
        adminDashboard.style.display = 'none';
      } else {
        // Ouvrir le modal d'ajout
        if (eventModal) eventModal.style.display = 'block';
      }
    });
  }

  if (closeBtn) {
    closeBtn.addEventListener('click', () => {
      if (eventModal) eventModal.style.display = 'none';
    });
  }

  window.addEventListener('click', (e) => {
    if (eventModal && e.target === eventModal) {
      eventModal.style.display = 'none';
    }
  });

  if (eventForm) {
    eventForm.addEventListener('submit', (e) => {
      e.preventDefault();
      addNewEvent();
    });
  }

  if (loginForm) {
    loginForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const password = loginPassword.value;
      if (password === "mdp") { // Mot de passe admin
        isAdmin = true;
        adminLoginForm.style.display = 'none';
        adminDashboard.style.display = 'flex';
        if (addEventBtn) addEventBtn.style.display = 'inline-block';

        // Ouvrir directement le modal après connexion
        if (eventModal) eventModal.style.display = 'block';
      } else {
        alert("Mot de passe incorrect !");
      }
    });
  }

  if (logoutBtn) {
    logoutBtn.addEventListener('click', () => {
      isAdmin = false;
      if (adminDashboard) adminDashboard.style.display = 'none';
      if (adminLoginForm) adminLoginForm.style.display = 'none';
      if (addEventBtn) addEventBtn.style.display = 'none';
      if (eventModal) eventModal.style.display = 'none';
    });
  }

  // Fonction pour afficher le calendrier
  function renderCalendar() {
    if (!currentMonthElement) return;

    const monthNames = ["Janvier", "Février", "Mars", "Avril", "Mai", "Juin",
                        "Juillet", "Août", "Septembre", "Octobre", "Novembre", "Décembre"];
    currentMonthElement.textContent = `${monthNames[currentDate.getMonth()]} ${currentDate.getFullYear()}`;

    const firstDay = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1);
    const lastDay = new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 0);
    const daysInMonth = lastDay.getDate();
    const startingDay = firstDay.getDay();

    if (!calendarGrid) return;
    calendarGrid.innerHTML = '';

    const dayNames = ["Dim", "Lun", "Mar", "Mer", "Jeu", "Ven", "Sam"];
    dayNames.forEach(day => {
      const dayElement = document.createElement('div');
      dayElement.className = 'calendar-day-header';
      dayElement.textContent = day;
      calendarGrid.appendChild(dayElement);
    });

    for (let i = 0; i < startingDay; i++) {
      const emptyDay = document.createElement('div');
      emptyDay.className = 'calendar-day empty';
      calendarGrid.appendChild(emptyDay);
    }

    const today = new Date();
    for (let i = 1; i <= daysInMonth; i++) {
      const dayElement = document.createElement('div');
      dayElement.className = 'calendar-day';

      const dayNumber = document.createElement('div');
      dayNumber.className = 'calendar-day-number';
      dayNumber.textContent = i;
      dayElement.appendChild(dayNumber);

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

  // Fonction pour afficher la liste des événements
  function renderEventsList() {
    if (!eventsList) return;
    eventsList.innerHTML = '';
    
    const sortedEvents = [...events].sort((a, b) => new Date(a.date) - new Date(b.date));

    sortedEvents.forEach(event => {
      const eventElement = document.createElement('div');
      eventElement.className = 'event-item';

      const date = new Date(event.date);
      const dateStr = date.toLocaleDateString('fr-FR', { weekday: 'long', day: 'numeric', month: 'long' });

      eventElement.innerHTML = `
        <div class="event-date">${dateStr} ${event.time ? 'à ' + event.time : ''}</div>
        <div class="event-title">${event.title}</div>
        <div class="event-description">${event.description}</div>
        ${isAdmin ? `<button class="delete-btn" data-id="${event.id}"><i class="fas fa-trash"></i></button>` : ''}
      `;

      eventsList.appendChild(eventElement);

      const deleteBtn = eventElement.querySelector('.delete-btn');
      if (deleteBtn) {
        deleteBtn.addEventListener('click', (e) => {
          e.stopPropagation();
          deleteEvent(event.id);
        });
      }
    });
  }

  // Fonction pour afficher les détails d’un événement
  function showEventDetails(event) {
    alert(`${event.title}\n\nDate: ${event.date}\nHeure: ${event.time || 'Non spécifiée'}\n\n${event.description || 'Pas de description'}`);
  }

  // Ajouter un nouvel événement
  function addNewEvent() {
    const title = document.getElementById('eventTitle').value.trim();
    const date = document.getElementById('eventDate').value;
    const time = document.getElementById('eventTime').value;
    const description = document.getElementById('eventDescription').value;

    if (!title || !date) {
      alert("Veuillez remplir au moins le titre et la date !");
      return;
    }

    const newEvent = {
      id: events.length > 0 ? Math.max(...events.map(e => e.id)) + 1 : 1,
      title,
      date,
      time,
      description
    };

    events.push(newEvent);
    localStorage.setItem('calendarEvents', JSON.stringify(events));

    eventForm.reset();
    if (eventModal) eventModal.style.display = 'none';

    renderCalendar();
    renderEventsList();
  }

  // Supprimer un événement
  function deleteEvent(id) {
    if (confirm("Êtes-vous sûr de vouloir supprimer cet événement ?")) {
      events = events.filter(event => event.id !== id);
      localStorage.setItem('calendarEvents', JSON.stringify(events));
      renderCalendar();
      renderEventsList();
    }
  }

  // Gestion du swipe sur mobile
  function handleTouchEvents() {
    let touchStartX = 0;
    let touchEndX = 0;

    if (!calendarGrid) return;

    calendarGrid.addEventListener('touchstart', (e) => {
      touchStartX = e.changedTouches[0].screenX;
    }, false);

    calendarGrid.addEventListener('touchend', (e) => {
      touchEndX = e.changedTouches[0].screenX;
      handleSwipe();
    }, false);

    function handleSwipe() {
      if (touchEndX < touchStartX - 50) {
        currentDate.setMonth(currentDate.getMonth() + 1);
        renderCalendar();
      }
      if (touchEndX > touchStartX + 50) {
        currentDate.setMonth(currentDate.getMonth() - 1);
        renderCalendar();
      }
    }
  }

  // Démarrage
  initCalendar();
  handleTouchEvents();
}