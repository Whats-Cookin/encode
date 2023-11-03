let bankCode = "";
let accountNo = "";
let name = {};

const banksDropdown = document.getElementById("banksDropdown");
const accountNumberInput = document.getElementById("id_Account_number");
const accountNameInput = document.getElementById("accountNameInput");

// Fetch banks on load
fetch("https://fitted-portal-api.herokuapp.com/api/v1/bank/banks")
  .then((response) => response.json())
  .then((data) => {
    const banks = data.data;
    banks.forEach((bank) => {
      const option = document.createElement("option");
      option.value = bank.code;
      option.textContent = bank.name;
      banksDropdown.appendChild(option);
    });
  });

banksDropdown.addEventListener("change", function (event) {
  bankCode = event.target.value;
});

accountNumberInput.addEventListener("input", function (event) {
  accountNo = event.target.value;
  if (accountNo.length === 10) {
    fetchAccountName();
  }
});

document
  .getElementById("detailsForm")
  .addEventListener("submit", function (event) {
    event.preventDefault();
  });

function fetchAccountName() {
  fetch("https://fitted-portal-api.herokuapp.com/api/v1/bank/resolveAccount", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      accountNo,
      bankCode,
    }),
  })
    .then((response) => response.json())
    .then((data) => {
      if (data && data.content && data.content.data) {
        name = data.content.data;
        accountNameInput.value = name.account_name;
      } else {
        console.warn("Unexpected data format:", data);
      }
    })
    .catch((error) => {
      console.log("Error fetching account name:", error);
    });
}

var selectElement = document.getElementById("mySelect");
var selectedOption = selectElement.options[selectElement.selectedIndex];
var optionValue = selectedOption.value;

// Create a hidden input field with the name "bank" and the selected option value
var hiddenField = document.createElement("input");
hiddenField.setAttribute("type", "hidden");
hiddenField.setAttribute("name", "bank");
hiddenField.setAttribute("value", optionValue);

// Append the hidden field to the form
this.appendChild(hiddenField);
