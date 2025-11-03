// star rating
const stars = document.querySelectorAll("#starRating span");
let selectedRating = 0;

stars.forEach((star, index) => {
  star.addEventListener("click", () => {
    selectedRating = index + 1;
    stars.forEach((s, i) => s.classList.toggle("selected", i < selectedRating));
  });
});

async function submitReview(event) {
  event.preventDefault();
  const name = document.getElementById("reviewName").value.trim() || "Guest User";
  const review = document.getElementById("reviewText").value.trim();

  if (!review || selectedRating === 0) {
    alert("Please add rating and review!");
    return;
  }

  try {
    const response = await fetch("/api/reviews", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name, rating: selectedRating, review })
    });

    const result = await response.json();
    console.log("Server response:", result);

    if (response.ok) {
      alert(result.message || "✅ Review submitted!");
      loadReviews();
      document.getElementById("reviewForm").reset();
      selectedRating = 0;
      stars.forEach(s => s.classList.remove("selected"));
    } else {
      alert("❌ Server error: " + (result.error || "Unknown issue"));
    }
  } catch (err) {
    console.error("❌ Fetch error:", err);
    alert("❌ Cannot connect to the server!");
  }
}

async function loadReviews() {
  try {
    const res = await fetch("/api/reviews");
    const data = await res.json();
    const container = document.getElementById("reviewsList");
    container.innerHTML = data.map(r => `
      <div class="review-card">
        <h4>${r.name}</h4>
        <p>${r.review}</p>
        <span>⭐ ${r.rating}</span>
      </div>
    `).join('');
  } catch (err) {
    console.error("❌ Load error:", err);
  }
}

window.onload = loadReviews;
document.getElementById("reviewForm").addEventListener("submit", submitReview);
