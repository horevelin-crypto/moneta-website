/* MonEta suti-hozzajarulas (consent) + Meta-keppont betoltes
   ------------------------------------------------------------------
   FONTOS: a Meta-keppont (Facebook Pixel) CSAK akkor tolt be, ha a
   latogato kifejezetten elfogadta. Hozzajarulas nelkul semmilyen
   marketing-koveto nem indul el. Ezt kimondja az Adatkezelesi
   tajekoztato is — ha a logikat modositod, azt is frissiteni kell.

   Kulon fajlban van (nem inline), hogy a szigorubb CSP-s oldalakon is
   fusson, ahol a script-src nem engedi az 'unsafe-inline'-t. */

(function () {
  'use strict';

  var TAROLO_KULCS = 'moneta-consent-marketing';
  var PIXEL_ID = '2420124218512351';

  function dontesBeolvas() {
    try {
      return window.localStorage.getItem(TAROLO_KULCS);
    } catch (e) {
      // Ha a tarolas nem elerheto (privat mod, letiltott sutik),
      // ugy tekintjuk, hogy nincs hozzajarulas.
      return null;
    }
  }

  function dontesMent(ertek) {
    try {
      window.localStorage.setItem(TAROLO_KULCS, ertek);
    } catch (e) {
      /* tarolas nem elerheto — a dontes csak erre a munkamenetre el */
    }
  }

  function pixelBetolt() {
    if (window.fbq) return;

    /* Meta-keppont alap-kodja (a Facebook hivatalos snippetje) */
    !(function (f, b, e, v, n, t, s) {
      if (f.fbq) return;
      n = f.fbq = function () {
        n.callMethod ? n.callMethod.apply(n, arguments) : n.queue.push(arguments);
      };
      if (!f._fbq) f._fbq = n;
      n.push = n;
      n.loaded = !0;
      n.version = '2.0';
      n.queue = [];
      t = b.createElement(e);
      t.async = !0;
      t.src = v;
      s = b.getElementsByTagName(e)[0];
      s.parentNode.insertBefore(t, s);
    })(window, document, 'script', 'https://connect.facebook.net/en_US/fbevents.js');

    window.fbq('init', PIXEL_ID);
    window.fbq('track', 'PageView');
  }

  function savEltavolit(sav) {
    if (sav && sav.parentNode) sav.parentNode.removeChild(sav);
  }

  function savMegjelenit() {
    var sav = document.createElement('div');
    sav.className = 'moneta-consent';
    sav.setAttribute('role', 'dialog');
    sav.setAttribute('aria-live', 'polite');
    sav.setAttribute('aria-label', 'Sütikkel kapcsolatos tájékoztatás');

    var belso = document.createElement('div');
    belso.className = 'moneta-consent-inner';

    var szoveg = document.createElement('p');
    szoveg.className = 'moneta-consent-text';

    var cim = document.createElement('strong');
    cim.textContent = 'Sütik a MonEta oldalán';
    szoveg.appendChild(cim);

    szoveg.appendChild(document.createTextNode(
      'A weboldal működéséhez szükséges sütiket mindig használjuk. ' +
      'Ezen felül szeretnénk mérni, hogy a hirdetéseinkből hányan jutnak el ide, ' +
      'ehhez a Meta (Facebook) mérőkódját használnánk. Ez csak a te ' +
      'hozzájárulásoddal indul el. Részletek az '
    ));

    var link = document.createElement('a');
    link.href = '/adatkezeles/';
    link.textContent = 'Adatkezelési tájékoztatóban';
    szoveg.appendChild(link);
    szoveg.appendChild(document.createTextNode('.'));

    var gombok = document.createElement('div');
    gombok.className = 'moneta-consent-actions';

    var elutasit = document.createElement('button');
    elutasit.type = 'button';
    elutasit.className = 'moneta-consent-btn moneta-consent-btn-reject';
    elutasit.textContent = 'Elutasítom';
    elutasit.addEventListener('click', function () {
      dontesMent('reject');
      savEltavolit(sav);
    });

    var elfogad = document.createElement('button');
    elfogad.type = 'button';
    elfogad.className = 'moneta-consent-btn moneta-consent-btn-accept';
    elfogad.textContent = 'Elfogadom';
    elfogad.addEventListener('click', function () {
      dontesMent('accept');
      savEltavolit(sav);
      pixelBetolt();
    });

    /* Az elutasitas all elol: nem nehezebb, mint az elfogadas. */
    gombok.appendChild(elutasit);
    gombok.appendChild(elfogad);

    belso.appendChild(szoveg);
    belso.appendChild(gombok);
    sav.appendChild(belso);
    document.body.appendChild(sav);
  }

  function indul() {
    var dontes = dontesBeolvas();

    if (dontes === 'accept') {
      pixelBetolt();
      return;
    }
    if (dontes === 'reject') {
      return;
    }
    savMegjelenit();
  }

  /* Visszavonhatosag: a latogato barmikor torolheti a dontest.
     Pl. az Adatkezelesi tajekoztatoban elhelyezheto egy gomb, ami ezt hivja. */
  window.monetaConsentVisszavon = function () {
    try {
      window.localStorage.removeItem(TAROLO_KULCS);
    } catch (e) {
      /* nem elerheto tarolas */
    }
    window.location.reload();
  };

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', indul);
  } else {
    indul();
  }
})();
