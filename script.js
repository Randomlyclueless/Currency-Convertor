const BASE_URL = "https://latest.currency-api.pages.dev/v1/currencies";

const dropdowns = document.querySelectorAll(".dropdown select");
const btn = document.querySelector(".formbtn");
const fromCurr = document.querySelector(".from select");
const toCurr = document.querySelector(".to select");
const msg = document.querySelector(".msg");

/* Populate dropdowns */
for (let select of dropdowns) {
  for (let currCode in countryList) {
    let option = document.createElement("option");
    option.value = currCode;
    option.innerText = currCode;

    if (select.name === "from" && currCode === "USD") option.selected = true;
    if (select.name === "to" && currCode === "INR") option.selected = true;

    select.append(option);
  }

  select.addEventListener("change", (e) => updateFlag(e.target));
}

/* Update flag */
function updateFlag(element) {
  const code = element.value;
  const countryCode = countryList[code];
  const img = element.parentElement.querySelector("img");
  img.src = `https://flagsapi.com/${countryCode}/flat/64.png`;
}

/* Convert currency */
async function updateExchangeRate() {
  const amountInput = document.querySelector(".amount input");
  let amount = Number(amountInput.value);

  if (!amount || amount <= 0) {
    amount = 1;
    amountInput.value = 1;
  }

  const from = fromCurr.value.toLowerCase();
  const to = toCurr.value.toLowerCase();

  try {
    // Fetch USD-based rates (single request)
    const response = await fetch(`${BASE_URL}/usd.json`);
    const data = await response.json();

    // Access the nested 'usd' object
    const rates = data.usd;
    
    const rateFrom = rates[from];
    const rateTo = rates[to];

    // Safety check
    if (!rateFrom || !rateTo) {
      msg.innerText = "Conversion not available.";
      return;
    }

    // Currency normalization
    const amountInUSD = amount / rateFrom;
    const finalAmount = (amountInUSD * rateTo).toFixed(2);

    msg.innerText = `${amount} ${from.toUpperCase()} = ${finalAmount} ${to.toUpperCase()}`;
  } catch (error) {
    console.error(error);
    msg.innerText = "Error fetching exchange rate.";
  }
}

/* Button click */
btn.addEventListener("click", (e) => {
  e.preventDefault();
  updateExchangeRate();
});

// Load initial exchange rate on page load
window.addEventListener("load", updateExchangeRate);