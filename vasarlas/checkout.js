const API_URL = 'https://api.moneta-system.hu';
const button = document.getElementById('start-checkout');
const message = document.getElementById('message');

loadAvailability();
button.addEventListener('click', startCheckout);

async function loadAvailability() {
  try {
    const response = await fetch(`${API_URL}/api/config`);
    if (!response.ok) return;
    const config = await response.json();
    if (!config.introAvailable) {
      document.getElementById('current-price').textContent = '29 900 Ft';
      document.querySelector('.price s').hidden = true;
      document.getElementById('intro-status').textContent = 'Egyszeri díj, előfizetés nélkül.';
    } else {
      document.getElementById('intro-status').textContent = `Bevezető ár - még ${config.introRemaining} vásárló veheti meg ennyiért.`;
    }
  } catch { /* Az ár statikus tartalékkal továbbra is látható. */ }
}

async function startCheckout() {
  if (!document.getElementById('terms').checked || !document.getElementById('digital').checked) {
    message.textContent = 'A folytatáshoz mindkét nyilatkozat elfogadása szükséges.';
    return;
  }
  button.disabled = true;
  message.textContent = '';
  try {
    const configResponse = await fetch(`${API_URL}/api/config`);
    const config = await configResponse.json();
    if (!configResponse.ok || !config.stripePublishableKey) throw new Error('A fizetés jelenleg nem indítható.');
    const sessionResponse = await fetch(`${API_URL}/api/checkout`, {
      method: 'POST', headers: {'content-type':'application/json'},
      body: JSON.stringify({termsAccepted:true, digitalDeliveryAccepted:true})
    });
    const session = await sessionResponse.json();
    if (!sessionResponse.ok) throw new Error(session.error || 'A fizetés nem indítható.');
    const stripe = Stripe(config.stripePublishableKey);
    // A Stripe 2026-03-25.dahlia verzioban atnevezte: initEmbeddedCheckout ->
    // createEmbeddedCheckoutPage. A regi nev IntegrationError-t dob.
    // A parameterek es a visszaadott objektum (mount) valtozatlanok.
    const checkout = await stripe.createEmbeddedCheckoutPage({clientSecret: session.clientSecret});
    document.getElementById('consents').hidden = true;
    const container = document.getElementById('checkout');
    container.hidden = false;
    checkout.mount('#checkout');
  } catch (error) {
    message.textContent = `${error.message} Kérlek, próbáld újra később, vagy írj az info@moneta-system.hu címre.`;
    button.disabled = false;
  }
}
