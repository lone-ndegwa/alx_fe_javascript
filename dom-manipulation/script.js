let quotes = [];
const quoteDisplay = document.getElementById("quoteDisplay");
const categoryFilter = document.getElementById("categoryFilter");
const SERVER_URL = "https://jsonplaceholder.typicode.com/posts";

document.addEventListener("DOMContentLoaded", () => {
  loadQuotes();
  populateCategories();
  restoreLastFilter();
  filterQuotes();
  setInterval(syncQuotes, 10000);
});

function showRandomQuote() {
  const filteredQuotes = getFilteredQuotes();
  if (filteredQuotes.length > 0) {
    const randomIndex = Math.floor(Math.random() * filteredQuotes.length);
    quoteDisplay.innerHTML = filteredQuotes[randomIndex].text;
  } else {
    quoteDisplay.innerHTML = "No quotes available.";
  }
}

function addQuote() {
  const newQuoteText = document.getElementById("newQuoteText").value.trim();
  const newQuoteCategory = document.getElementById("newQuoteCategory").value.trim();
  if (newQuoteText && newQuoteCategory) {
    const newQuote = { text: newQuoteText, category: newQuoteCategory };
    quotes.push(newQuote);
    saveQuotes();
    postQuoteToServer(newQuote);
    populateCategories();
    alert("Quote added!");
  } else {
    alert("Please fill in both fields.");
  }
}

function loadQuotes() {
  const storedQuotes = JSON.parse(localStorage.getItem("quotes")) || [];
  quotes = storedQuotes;
}

function saveQuotes() {
  localStorage.setItem("quotes", JSON.stringify(quotes));
}

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

function filterQuotes() {
  const selectedCategory = categoryFilter.value;
  localStorage.setItem("selectedCategory", selectedCategory);
  const filteredQuotes = getFilteredQuotes();
  quoteDisplay.innerHTML = filteredQuotes.length
    ? filteredQuotes[0].text
    : "No quotes available.";
}

function getFilteredQuotes() {
  const selectedCategory = categoryFilter.value;
  if (selectedCategory === "all") {
    return quotes;
  }
  return quotes.filter((quote) => quote.category === selectedCategory);
}

function restoreLastFilter() {
  const selectedCategory = localStorage.getItem("selectedCategory");
  if (selectedCategory) {
    categoryFilter.value = selectedCategory;
  }
}

async function fetchQuotesFromServer() {
  try {
    const response = await fetch(SERVER_URL);
    const serverQuotes = await response.json();
    return serverQuotes.map((sq) => ({
      text: sq.title,
      category: "General",
    }));
  } catch (error) {
    console.error("Failed to fetch quotes from server:", error);
    return [];
  }
}

async function postQuoteToServer(quote) {
  try {
    await fetch(SERVER_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(quote),
    });
  } catch (error) {
    console.error("Failed to post quote to server:", error);
  }
}

async function syncQuotes() {
  try {
    const serverQuotes = await fetchQuotesFromServer();
    const mergedQuotes = mergeQuotes(quotes, serverQuotes);
    quotes = mergedQuotes;
    saveQuotes();
    notifyUser("Quotes synced with the server!");
    populateCategories();
    filterQuotes();
  } catch (error) {
    console.error("Failed to sync quotes:", error);
  }
}

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

function notifyUser(message) {
  const notification = document.createElement("div");
  notification.textContent = message;
  notification.style.position = "fixed";
  notification.style.bottom = "20px";
  notification.style.right = "20px";
  notification.style.backgroundColor = "green";
  notification.style.color = "white";
  notification.style.padding = "10px";
  notification.style.borderRadius = "5px";
  document.body.appendChild(notification);
  setTimeout(() => {
    document.body.removeChild(notification);
  }, 3000);
}
