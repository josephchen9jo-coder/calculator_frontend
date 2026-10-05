const API_BASE = "https://calculator-backend-ocpm.onrender.com";

const expressionEl = document.getElementById("expression");
const resultEl = document.getElementById("result");
const buttonsEl = document.getElementById("buttons");
const historyListEl = document.getElementById("history-list");
const clearHistoryBtn = document.getElementById("clear-history");

let expression = "";

// 把内部的 * 和 / 显示成更好看的 × 和 ÷
function displayExpression(text) {
  return text.replace(/\*/g, "×").replace(/\//g, "÷");
}

function renderExpression() {
  expressionEl.textContent = expression ? displayExpression(expression) : "0";
}

function append(value) {
  expression += value;
  renderExpression();
}

function backspace() {
  expression = expression.slice(0, -1);
  renderExpression();
}

function clearExpression() {
  expression = "";
  resultEl.textContent = "0";
  renderExpression();
}

async function calculate() {
  if (!expression) {
    return;
  }
  resultEl.textContent = "Calculating…";
  try {
    const response = await fetch(API_BASE + "/api/calculate", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ expression: expression }),
    });
    const data = await response.json();
    if (data.success) {
      resultEl.textContent = "= " + data.result;
      expression = "";
      renderExpression();
      loadHistory();
    } else {
      resultEl.textContent = data.message || "Error";
    }
  } catch (error) {
    resultEl.textContent = "Cannot connect to the backend";
  }
}

buttonsEl.addEventListener("click", (event) => {
  const button = event.target.closest("button");
  if (!button) {
    return;
  }
  const action = button.dataset.action;
  const value = button.dataset.value;
  if (action === "append") {
    append(value);
  } else if (action === "clear") {
    clearExpression();
  } else if (action === "backspace") {
    backspace();
  } else if (action === "equals") {
    calculate();
  }
});

async function loadHistory() {
  try {
    const response = await fetch(API_BASE + "/api/history");
    const data = await response.json();
    historyListEl.innerHTML = "";
    if (data.success && data.history.length) {
      data.history.forEach((item) => {
        const li = document.createElement("li");
        li.className = "history-item";

        const expr = document.createElement("span");
        expr.className = "history-expr";
        expr.textContent = displayExpression(item.expression);

        const result = document.createElement("span");
        result.className = "history-result";
        result.textContent = "= " + item.result;

        const time = document.createElement("span");
        time.className = "history-time";
        time.textContent = item.created_at;

        const del = document.createElement("button");
        del.className = "history-delete";
        del.textContent = "Delete";
        del.addEventListener("click", () => deleteRecord(item.id));

        li.append(expr, result, time, del);
        historyListEl.appendChild(li);
      });
    } else {
      historyListEl.innerHTML = '<li class="empty">No history yet</li>';
    }
  } catch (error) {
    historyListEl.innerHTML = '<li class="empty">Failed to load history</li>';
  }
}

async function deleteRecord(id) {
  try {
    await fetch(API_BASE + "/api/history/" + id, { method: "DELETE" });
    loadHistory();
  } catch (error) {
    alert("Delete failed. Check if the backend is running.");
  }
}

async function clearAllHistory() {
  if (!confirm("Clear all calculation history?")) {
    return;
  }
  try {
    await fetch(API_BASE + "/api/history", { method: "DELETE" });
    loadHistory();
  } catch (error) {
    alert("Clear failed. Check if the backend is running.");
  }
}

clearHistoryBtn.addEventListener("click", clearAllHistory);

loadHistory();
renderExpression();