const API_URL = 'https://api.moneta-system.hu';
const sessionId = new URLSearchParams(location.search).get('session_id');
const statusText = document.getElementById('status-text');
const download = document.getElementById('download');
const details = document.getElementById('details');

if (!sessionId) fail('Hiányzik a rendelés azonosítója.'); else poll(0);

async function poll(attempt) {
  try {
    const response = await fetch(`${API_URL}/api/order-status?session_id=${encodeURIComponent(sessionId)}`);
    const order = await response.json();
    if (order.status === 'paid') {
      statusText.textContent = 'A fizetés sikeres. A MonEta letölthető, a linket e-mailben is elküldtük.';
      download.href = order.downloadUrl;
      download.hidden = false;
      download.style.display = 'inline-block';
      details.textContent = `A link legfeljebb ${order.downloadLimit} letöltésre és a megadott lejárati időig használható.`;
      return;
    }
    if (['failed','expired','refunded'].includes(order.status)) return fail('A fizetés nem fejeződött be. Kérlek, próbáld újra.');
  } catch { /* Az átmeneti hálózati hibát újrapróbáljuk. */ }
  if (attempt < 20) setTimeout(() => poll(attempt + 1), 1500);
  else fail('A visszaigazolás tovább tart a szokásosnál. A letöltési linket e-mailben küldjük el.');
}
function fail(text){statusText.textContent=text;details.textContent='Segítség: info@moneta-system.hu';}
