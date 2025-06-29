let quotes = JSON.parse(localStorage.getItem("quotes")) || [
  { text: "The journey of a thousand miles begins with one step.", category: "Motivation" },
  { text: "Life is what happens when you're busy making other plans.", category: "Life" },
  { text: "You miss 100% of the shots you don't take.", category: "Inspiration" }
];

const quoteDisplay = document.getElementById("quoteDisplay");
const categoryFilter = document.getElementById("categoryFilter");

// Populate categories dynamically
function populateCategories() {
  const categories = ["all", ...new Set(quotes.map(quote => quote.category))];
  categoryFilter.innerHTML = categories
    .map(category => `<option value="${category}">${category}</option>`)
    .join("");
  const savedFilter = localStorage.getItem("selectedCategory") || "all";
  categoryFilter.value = savedFilter;
  filterQuotes();
}

// Show a random quote
function showRandomQuote() {
  const currentCategory = categoryFilter.value;
  const filteredQuotes =
    currentCategory === "all"
      ? quotes
      : quotes.filter(quote => quote.category === currentCategory);
  if (filteredQuotes.length === 0) {
    quoteDisplay.textContent = "No quotes available for this category.";
    return;
  }
  const randomQuote = filteredQuotes[Math.floor(Math.random() * filteredQuotes.length)];
  quoteDisplay.textContent = randomQuote.text;
}

// Add a new quote
function addQuote() {
  const newQuoteText = document.getElementById("newQuoteText").value.trim();
  const newQuoteCategory = document.getElementById("newQuoteCategory").value.trim();
  if (!newQuoteText || !newQuoteCategory) {
    alert("Please enter both a quote and a category.");
    return;
  }
  const newQuote = { text: newQuoteText, category: newQuoteCategory };
  quotes.push(newQuote);
  saveQuotes();
  populateCategories();
  alert("Quote added successfully!");
}

// Save quotes to local storage
function saveQuotes() {
  localStorage.setItem("quotes", JSON.stringify(quotes));
}

// Filter quotes by category
function filterQuotes() {
  const selectedCategory = categoryFilter.value;
  localStorage.setItem("selectedCategory", selectedCategory);
  showRandomQuote();
}

// Export quotes to a JSON file
function exportToJsonFile() {
  const dataStr = JSON.stringify(quotes, null, 2);
  const blob = new Blob([dataStr], { type: "application/json" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = "quotes.json";
  a.click();
}

// Import quotes from a JSON file
function importFromJsonFile(event) {
  const fileReader = new FileReader();
  fileReader.onload = function (e) {
    try {
      const importedQuotes = JSON.parse(e.target.result);
      quotes.push(...importedQuotes);
      saveQuotes();
      populateCategories();
      alert("Quotes imported successfully!");
    } catch {
      alert("Failed to import quotes. Ensure the file is in the correct JSON format.");
    }
  };
  fileReader.readAsText(event.target.files[0]);
}

// Initialize the app
document.getElementById("newQuote").addEventListener("click", showRandomQuote);
document.addEventListener("DOMContentLoaded", () => {
  populateCategories();
  filterQuotes();
});
