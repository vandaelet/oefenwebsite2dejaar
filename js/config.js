/* =====================================================================
   INSTELLINGEN VAN DE OEFENSITE
   Plak hieronder de gegevens van je Firebase-project
   (Firebase-console > Projectinstellingen > Je apps > SDK-configuratie).

   Zolang hier "PLAK-HIER" staat, werkt de site in DEMOMODUS:
   er is dan geen echte login en niets wordt op de server bewaard.
   ===================================================================== */
window.OEFENSITE_CONFIG = {
  firebase: {
    apiKey: "PLAK-HIER-JE-APIKEY",
    authDomain: "jouw-project.firebaseapp.com",
    projectId: "jouw-project",
    storageBucket: "jouw-project.appspot.com",
    messagingSenderId: "000000000000",
    appId: "PLAK-HIER-JE-APPID"
  },

  // Alleen Google-accounts van dit domein mogen aanmelden.
  domein: "svsl.be",

  // Niveaugroepen waaruit een leerling kiest bij het aanmelden.
  groepen: ["NG1", "NG2a", "NG2b", "NG2c", "NG2d", "NG2e", "NG3"],

  titel: "Oefensite wiskunde 2de jaar",

  // Voorvoegsel van de collecties in Firestore. Elke site heeft een eigen
  // voorvoegsel, zodat de site van het eerste jaar (oef) en die van het
  // tweede jaar (oef2) hetzelfde Firebase-project kunnen gebruiken.
  prefix: "oef2"
};
