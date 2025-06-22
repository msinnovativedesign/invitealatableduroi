document.addEventListener("DOMContentLoaded", function () {
  const today = new Date().toISOString().split('T')[0];

  // Mettre à jour la date
  document.getElementById("date").innerText = "Lecture du " + today;

  // Contenu par date
  const dailyContent = {
    "2025-04-05": "<p>Vidéo du jour :<br><iframe width='100%' height='315' src='https://www.youtube.com/embed/YOUR_VIDEO_ID'  frameborder='0' allowfullscreen></iframe></p>",
    "2025-04-06": "<p>Texte du jour :<br><blockquote>« La parole de Dieu est vivante et efficace... » Hébreux 4:12</blockquote></p>",
    "2025-04-07": "<p>Louange :<br><audio controls><source src='https://example.com/audio-adoration.mp3'  type='audio/mp3'>Votre navigateur ne supporte pas l’audio.</audio></p>"
  };

  // Afficher le contenu
  const contentDiv = document.getElementById("content");
  if (contentDiv) {
    contentDiv.innerHTML = dailyContent[today] || "<p>Aucune lecture disponible aujourd'hui.</p>";
  } else {
    console.error("Élément #content introuvable !");
  }
});
document.addEventListener("DOMContentLoaded", function () {
  fetch('data.json')
    .then(response => response.json())
    .then(data => {
      const today = new Date().toISOString().split('T')[0];
      const content = data[today];

      if (content) {
        document.getElementById("daily-title").innerText = content.title;
        if (content.type === "audio") {
          document.getElementById("daily-content").innerHTML = `
            <audio controls>
              <source src="${content.url}" type="audio/mpeg">
              Votre navigateur ne supporte pas l'audio.
            </audio>`;
        } else if (content.type === "video") {
          document.getElementById("daily-content").innerHTML = `
            <iframe width="100%" height="315" src="${content.url}" frameborder="0" allowfullscreen></iframe>`;
        } else if (content.type === "event" || content.type === "louange") {
          document.getElementById("daily-content").innerHTML = content.content;
        }
      } else {
        document.getElementById("daily-title").innerText = "Aucun contenu disponible aujourd'hui";
        document.getElementById("daily-content").innerText = "Revenez demain !";
      }
    })
    .catch(error => {
      console.error("Erreur lors du chargement du JSON :", error);
      document.getElementById("daily-title").innerText = "Erreur de chargement";
      document.getElementById("daily-content").innerText = "Impossible de charger le contenu.";
    });
});
document.getElementById("contentForm").addEventListener("submit", function (e) {
  e.preventDefault();

  const date = document.getElementById("date").value;
  const type = document.getElementById("type").value;
  const title = document.getElementById("title").value;
  const url = document.getElementById("url").value;
  const content = document.getElementById("content").value;

  const newEntry = { [date]: { type, title } };

  if (type === "audio" || type === "video") {
    newEntry[date].url = url;
  } else {
    newEntry[date].content = content;
  }

  fetch('data.json')
    .then(response => response.json())
    .then(data => {
      const updatedData = { ...data, ...newEntry };
      const formattedJson = JSON.stringify(updatedData, null, 2);
      document.getElementById("output").textContent = formattedJson;

      // Ici, vous pouvez sauvegarder manuellement ou utiliser un backend plus tard
    });
});
// Sur chaque page :
// (Supprimé car la déclaration de currentPage existe plus bas avec une valeur par défaut)
document.querySelector(`.navbar a[href="${window.location.pathname.split('/').pop()}"]`).classList.add('active');

// pour le menu mobile

document.getElementById("contentForm").addEventListener("submit", function (e) {
  e.preventDefault();

  const dateInput = document.getElementById("date").value; // Renommé pour éviter la confusion avec la variable date globale
  const type = document.getElementById("type").value;
  const title = document.getElementById("title").value;
  const url = document.getElementById("url").value;
  const content = document.getElementById("content").value; // Renommé pour éviter la confusion

  const newEntry = { [dateInput]: { type, title } };

  if (type === "audio" || type === "video") {
    newEntry[dateInput].url = url;
  } else {
    newEntry[dateInput].content = content;
  }

  fetch('data.json')
    .then(response => response.json())
    .then(data => {
      const updatedData = { ...data, ...newEntry };
      const formattedJson = JSON.stringify(updatedData, null, 2);
      document.getElementById("output").textContent = formattedJson;

      // Ici, vous pouvez sauvegarder manuellement ou utiliser un backend plus tard
    });
});

// Sur chaque page :
const currentPage = window.location.pathname.split('/').pop() || 'index.html'; // Assurer une valeur par défaut
const navLinks = document.querySelectorAll('.navbar ul li a');
navLinks.forEach(link => {
  if (link.getAttribute('href') === currentPage) {
    link.classList.add('active');
  }
});

// Gestion du menu burger
document.addEventListener('DOMContentLoaded', () => {
  const menuToggle = document.querySelector('.menu-toggle');
  const navUl = document.querySelector('.navbar ul');

  if (menuToggle && navUl) {
    menuToggle.addEventListener('click', () => {
      navUl.classList.toggle('active');
    });
  }
});

// Fonction générique pour gérer les soumissions de formulaires
function setupForm(formId, successMessage) {
  const form = document.getElementById(formId);
  if (!form) return;

  form.addEventListener("submit", function (e) {
    e.preventDefault();
    // Ici, on pourrait envoyer les données à Google Forms ou API plus tard
    const responseDiv = document.getElementById("responseMessage");
    responseDiv.style.display = "block";
    responseDiv.textContent = successMessage;
    form.reset();
  });
}

// Activer les gestionnaires de formulaires
document.addEventListener("DOMContentLoaded", function () {
  setupForm("inscriptionForm", "Merci ! Votre inscription a été envoyée.");
  setupForm("priereForm", "Merci ! Votre intention a été reçue.");
  setupForm("temoignageForm", "Merci pour votre témoignage !");
});