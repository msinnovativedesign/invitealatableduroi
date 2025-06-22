// Chargement initial des données
let dailyContent = JSON.parse(localStorage.getItem("dailyContent") || "{}");
let adorationContent = JSON.parse(localStorage.getItem("adorationContent") || "{}");
let louangeContent = JSON.parse(localStorage.getItem("louangeContent") || "{}");
let calendarEvents = JSON.parse(localStorage.getItem("calendarEvents") || "[]");

document.addEventListener("DOMContentLoaded", () => {
  // Charger les événements archivés
  renderArchives();

  // Gestion des formulaires
  document.getElementById("dailyForm")?.addEventListener("submit", (e) => {
    e.preventDefault();
    addDailyEntry();
  });

  document.getElementById("adorationForm")?.addEventListener("submit", (e) => {
    e.preventDefault();
    addAdorationEntry();
  });

  document.getElementById("louangeForm")?.addEventListener("submit", (e) => {
    e.preventDefault();
    addLouangeEntry();
  });

  document.getElementById("calendarForm")?.addEventListener("submit", (e) => {
    e.preventDefault();
    addCalendarEvent();
  });
});

// Afficher une section
function showSection(sectionId) {
  document.querySelectorAll(".admin-section").forEach(sec => sec.classList.add("hidden"));
  document.getElementById(sectionId).classList.remove("hidden");
}

// Sauvegarder & afficher les archives
function renderArchives() {
  const archiveDiv = document.getElementById("archiveList");
  if (!archiveDiv) return;

  const allContent = { ...dailyContent, ...adorationContent, ...louangeContent };
  archiveDiv.innerHTML = "";

  Object.keys(allContent).sort().reverse().forEach(date => {
    const entry = allContent[date];
    const div = document.createElement("div");
    div.className = "archive-item";
    div.innerHTML = `<strong>${date}</strong>: ${entry.title} <small>[${entry.type}]</small>`;
    archiveDiv.appendChild(div);
  });

  const eventList = document.getElementById("archiveList");
  if (eventList && calendarEvents.length > 0) {
    calendarEvents.forEach(event => {
      const item = document.createElement("div");
      item.innerHTML = `<strong>${event.date}</strong>: ${event.title}`;
      eventList.appendChild(item);
    });
  }
}

// Fonctions d’ajout
function addDailyEntry() {
  const date = document.getElementById("dailyDate").value;
  const title = document.getElementById("dailyTitle").value;
  const content = document.getElementById("dailyContent").value;
  const audio = document.getElementById("dailyAudio").value;

  if (!date) return alert("Veuillez entrer une date.");

  dailyContent[date] = { type: "daily", title, content, audio };
  localStorage.setItem("dailyContent", JSON.stringify(dailyContent));
  alert("Pain Quotidien sauvegardé !");
  renderArchives();
}

function addAdorationEntry() {
  const date = document.getElementById("adorationDate").value;
  const title = document.getElementById("adorationTitle").value;
  const video = document.getElementById("adorationVideo").value;

  if (!date) return alert("Veuillez entrer une date.");

  adorationContent[date] = { type: "adoration", title, video };
  localStorage.setItem("adorationContent", JSON.stringify(adorationContent));
  alert("Adoration sauvegardée !");
  renderArchives();
}

function addLouangeEntry() {
  const date = document.getElementById("louangeDate").value;
  const title = document.getElementById("louangeTitle").value;
  const video = document.getElementById("louangeVideo").value;
  const audio = document.getElementById("louangeAudio").value;

  if (!date) return alert("Veuillez entrer une date.");

  louangeContent[date] = { type: "louange", title, video, audio };
  localStorage.setItem("louangeContent", JSON.stringify(louangeContent));
  alert("Louange sauvegardée !");
  renderArchives();
}

function addCalendarEvent() {
  const date = document.getElementById("eventDate").value;
  const title = document.getElementById("eventTitle").value;
  const time = document.getElementById("eventTime").value;
  const description = document.getElementById("eventDescription").value;

  const newEvent = {
    id: calendarEvents.length ? Math.max(...calendarEvents.map(e => e.id)) + 1 : 1,
    date,
    title,
    time,
    description
  };

  calendarEvents.push(newEvent);
  localStorage.setItem("calendarEvents", JSON.stringify(calendarEvents));
  alert("Événement ajouté !");
  renderArchives();
}