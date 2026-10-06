/* Opslag: aanmelden met Google + bewaren in Firestore.
   Zonder ingevulde Firebase-gegevens draait alles lokaal (demomodus). */
(function () {
  'use strict';
  var C = window.OEFENSITE_CONFIG || {};
  var fb = C.firebase || {};
  var demo = !fb.apiKey || /PLAK/i.test(fb.apiKey);
  var PF = C.prefix || 'oef';
  var COL = { ll: PF + '_leerlingen', res: PF + '_resultaten', inst: PF + '_instellingen', lk: PF + '_leerkrachten' };
  var FB_VERSIE = '10.12.2';
  var db = null, auth = null, user = null, luisteraars = [], laatsteFout = '';

  function laadScript(src) {
    return new Promise(function (ok, nok) {
      var s = document.createElement('script');
      s.src = src; s.onload = ok;
      s.onerror = function () { nok(new Error('Kon ' + src + ' niet laden.')); };
      document.head.appendChild(s);
    });
  }

  /* ---------- modules laden ---------- */
  window.MODULES = [];
  window.registreerModule = function (m) { window.MODULES.push(m); };
  window.laadModules = async function () {
    var lijst = window.MODULE_BESTANDEN || [];
    for (var i = 0; i < lijst.length; i++) {
      try { await laadScript('modules/' + lijst[i]); }
      catch (e) { console.error(e); }
    }
    window.MODULES.sort(function (a, b) { return (a.nummer || 0) - (b.nummer || 0); });
    return window.MODULES;
  };

  /* ---------- demomodus (localStorage) ---------- */
  var DEMO_KEY = 'oefensite_demo_' + PF;
  function demoLees() {
    try { return JSON.parse(localStorage.getItem(DEMO_KEY)) || {}; } catch (e) { return {}; }
  }
  function demoSchrijf(d) {
    try { localStorage.setItem(DEMO_KEY, JSON.stringify(d)); } catch (e) { /* geen opslag beschikbaar */ }
  }
  var DEMO_USER = { uid: 'demo', naam: 'Demo Leerling', email: 'demo.leerling@' + (C.domein || 'svsl.be') };

  function toegelaten(email) {
    return !!email && email.toLowerCase().endsWith('@' + (C.domein || '').toLowerCase());
  }
  function meld() { luisteraars.forEach(function (f) { f(user); }); }
  function nu() { return demo ? Date.now() : firebase.firestore.FieldValue.serverTimestamp(); }
  function resId(mid, uid) { return (uid || user.uid) + '_' + mid; }

  var O = {
    demo: demo,
    prefix: PF,
    get fout() { return laatsteFout; },

    init: async function () {
      if (demo) {
        var d = demoLees();
        user = d.aangemeld ? DEMO_USER : null;
        setTimeout(meld, 0);
        return;
      }
      var b = 'https://www.gstatic.com/firebasejs/' + FB_VERSIE + '/';
      await laadScript(b + 'firebase-app-compat.js');
      await laadScript(b + 'firebase-auth-compat.js');
      await laadScript(b + 'firebase-firestore-compat.js');
      firebase.initializeApp(fb);
      auth = firebase.auth(); db = firebase.firestore();
      auth.onAuthStateChanged(async function (u) {
        if (u && !toegelaten(u.email)) {
          laatsteFout = 'Meld je aan met je ' + C.domein + '-account. Het account ' + u.email + ' is niet toegelaten.';
          await auth.signOut();
          return;
        }
        user = u ? { uid: u.uid, naam: u.displayName || u.email, email: (u.email || '').toLowerCase() } : null;
        meld();
      });
    },

    onAuth: function (f) { luisteraars.push(f); },

    aanmelden: async function () {
      laatsteFout = '';
      if (demo) { var d = demoLees(); d.aangemeld = true; demoSchrijf(d); user = DEMO_USER; meld(); return; }
      var p = new firebase.auth.GoogleAuthProvider();
      p.setCustomParameters({ hd: C.domein, prompt: 'select_account' });
      try { await auth.signInWithPopup(p); }
      catch (e) {
        if (e.code === 'auth/popup-blocked') laatsteFout = 'Je browser blokkeert het aanmeldvenster. Sta pop-ups toe voor deze site en probeer opnieuw.';
        else if (e.code === 'auth/popup-closed-by-user' || e.code === 'auth/cancelled-popup-request') laatsteFout = '';
        else if (e.code === 'auth/unauthorized-domain') laatsteFout = 'Dit webadres is nog niet toegelaten in Firebase (Authentication > Instellingen > Geautoriseerde domeinen).';
        else laatsteFout = 'Aanmelden is niet gelukt. Probeer opnieuw.';
        meld();
      }
    },

    afmelden: async function () {
      if (demo) { var d = demoLees(); d.aangemeld = false; demoSchrijf(d); user = null; meld(); return; }
      await auth.signOut();
    },

    /* ---------- leerling ---------- */
    leesLeerling: async function () {
      if (demo) return demoLees().leerling || null;
      var s = await db.collection(COL.ll).doc(user.uid).get();
      return s.exists ? s.data() : null;
    },
    bewaarLeerling: async function (gegevens) {
      var data = Object.assign({ naam: user.naam, email: user.email, laatstActief: nu() }, gegevens);
      if (demo) { var d = demoLees(); d.leerling = Object.assign(d.leerling || {}, data); demoSchrijf(d); return; }
      await db.collection(COL.ll).doc(user.uid).set(data, { merge: true });
    },

    /* ---------- resultaten van de aangemelde leerling ---------- */
    leesResultaten: async function (mid) {
      if (demo) return ((demoLees().res || {})[mid]) || {};
      var s = await db.collection(COL.res).doc(resId(mid)).get();
      return s.exists ? (s.data().vragen || {}) : {};
    },
    bewaarVraag: async function (mid, sleutel, data) {
      if (demo) {
        var d = demoLees(); d.res = d.res || {}; d.res[mid] = d.res[mid] || {};
        d.res[mid][sleutel] = data; d.bijgewerkt = d.bijgewerkt || {}; d.bijgewerkt[mid] = Date.now();
        demoSchrijf(d); return;
      }
      var vragen = {}; vragen[sleutel] = data;
      await db.collection(COL.res).doc(resId(mid)).set({
        uid: user.uid, moduleId: mid, naam: user.naam, email: user.email,
        bijgewerkt: nu(), vragen: vragen
      }, { merge: true });
    },

    /* ---------- instellingen (welke modules staan aan) ---------- */
    leesInstellingen: async function () {
      if (demo) return demoLees().inst || {};
      try {
        var s = await db.collection(COL.inst).doc('modules').get();
        return s.exists ? s.data() : {};
      } catch (e) { return {}; }
    },
    bewaarInstellingen: async function (data) {
      if (demo) { var d = demoLees(); d.inst = data; demoSchrijf(d); return; }
      await db.collection(COL.inst).doc('modules').set(data);
    },

    /* ---------- leerkracht ---------- */
    isLeerkracht: async function () {
      if (demo) return true;
      try { return (await db.collection(COL.lk).doc(user.email).get()).exists; }
      catch (e) { return false; }
    },
    alleLeerlingen: async function () {
      if (demo) {
        var l = demoLees().leerling;
        return l ? [Object.assign({ uid: 'demo' }, l)] : [];
      }
      var s = await db.collection(COL.ll).get();
      return s.docs.map(function (d) { return Object.assign({ uid: d.id }, d.data()); });
    },
    resultatenVanModule: async function (mid) {
      if (demo) {
        var d = demoLees();
        var v = (d.res || {})[mid];
        return v ? [{ uid: 'demo', moduleId: mid, vragen: v, bijgewerkt: (d.bijgewerkt || {})[mid] }] : [];
      }
      var s = await db.collection(COL.res).where('moduleId', '==', mid).get();
      return s.docs.map(function (x) { return x.data(); });
    },
    leerkrachten: async function () {
      if (demo) return [{ email: DEMO_USER.email }];
      var s = await db.collection(COL.lk).get();
      return s.docs.map(function (d) { return { email: d.id }; });
    },
    voegLeerkrachtToe: async function (email) {
      if (demo) return;
      await db.collection(COL.lk).doc(email.toLowerCase().trim()).set({ toegevoegdDoor: user.email, op: nu() });
    },
    verwijderLeerkracht: async function (email) {
      if (demo) return;
      await db.collection(COL.lk).doc(email).delete();
    },

    tijd: function (x) {
      if (!x) return null;
      if (x.toDate) return x.toDate();
      return new Date(x);
    }
  };

  Object.defineProperty(O, 'user', { get: function () { return user; } });
  window.Opslag = O;
})();
