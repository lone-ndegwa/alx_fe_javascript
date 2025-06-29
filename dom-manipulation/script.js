let quotes = [];
const quoteDisplay = document.getElementById("quoteDisplay");
const categoryFilter = document.getElementById("categoryFilter");
const SERVER_URL = "https://jsonplaceholder.typicode.com/posts"; // Simulated server

// Initialize the application
document.addEventListener("DOMContentLoaded", () => {
  loadQuotes();
  populateCategories();
  restoreLastFilter();
  filterQuotes();
  setInterval(syncWithServer, 10000); // Sync every 10 seconds
});

// Show a random quote
function showRandomQuote() {
  const filteredQuotes = getFilteredQuotes();
  if (filteredQuotes.length > 0) {
    const randomIndex = Math.floor(Math.random() * filteredQuotes.length);
    quoteDisplay.innerHTML = filteredQuotes[randomIndex].text;
  } else {
    quoteDisplay.innerHTML = "No quotes available.";
  }
}

// Add a new quote
function addQuote() {
  const newQuoteText = document.getElementById("newQuoteText").value.trim();
  const newQuoteCategory = document.getElementById("newQuoteCategory").value.trim();

  if (newQuoteText && newQuoteCategory) {
    quotes.push({ text: newQuoteText, category: newQuoteCategory });
    saveQuotes();
    populateCategories();
    alert("Quote added!");
  } else {
    alert("Please fill in both fields.");
  }
}

// Load quotes from local storage
function loadQuotes() {
  const storedQuotes = JSON.parse(localStorage.getItem("quotes")) || [];
  quotes = storedQuotes;
}

// Save quotes to local storage
function saveQuotes() {
  localStorage.setItem("quotes", JSON.stringify(quotes));
}

// Populate categories in the dropdown
function populateCategories() {
  const uniqueCategories = [...new Set(quotes.map((q) => q.category))];
  categoryFilter.innerHTML = '<option value="all">All Categories</option>';
  uniqueCategories.forEach((category) => {
    const option = document.createElement("option");
    option.value = category;
    option.textContent = category;
    categoryFilter.appendChild(option);
  });
}

// Filter quotes based on the selected category
function filterQuotes() {
  const selectedCategory = categoryFilter.value;
  localStorage.setItem("selectedCategory", selectedCategory);
  const filteredQuotes = getFilteredQuotes();
  quoteDisplay.innerHTML = filteredQuotes.length
    ? filteredQuotes[0].text
    : "No quotes available.";
}

// Get filtered quotes based on the selected category
function getFilteredQuotes() {
  const selectedCategory = categoryFilter.value;
  if (selectedCategory === "all") {
    return quotes;
  }
  return quotes.filter((quote) => quote.category === selectedCategory);
}

// Restore the last selected filter
function restoreLastFilter() {
  const selectedCategory = localStorage.getItem("selectedCategory");
  if (selectedCategory) {
    categoryFilter.value = selectedCategory;
  }
}

// Sync with the server
async function syncWithServer() {
  try {
    const serverQuotes = await fetch(SERVER_URL).then((res) => res.json());
    const newQuotes = serverQuotes.map((sq) => ({
      text: sq.title,
      category: "General",
    }));
    const mergedQuotes = mergeQuotes(quotes, newQuotes);
    quotes = mergedQuotes;
    saveQuotes();
    alert("Synced with server. Quotes updated!");
    populateCategories();
    filterQuotes();
  } catch (error) {
    console.error("Failed to sync with server:", error);
  }
}

// Merge local quotes with server quotes (server takes precedence)
function mergeQuotes(local, server) {
  const localTexts = local.map((q) => q.text);
  const merged = [...local];
  server.forEach((sq) => {
    if (!localTexts.includes(sq.text)) {
      merged.push(sq);
    }
  });
  return merged;
}
