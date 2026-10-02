// 后端的地址。如果你把后端部署到了公网，就把这里改成公网地址。
const API_BASE = "http://127.0.0.1:5000";

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
  resultEl.textContent = "计算中…";
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
      resultEl.textContent = data.message || "计算出错";
    }
  } catch (error) {
    resultEl.textContent = "无法连接后端服务";
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
        del.textContent = "删除";
        del.addEventListener("click", () => deleteRecord(item.id));

        li.append(expr, result, time, del);
        historyListEl.appendChild(li);
      });
    } else {
      historyListEl.innerHTML = '<li class="empty">暂无计算记录</li>';
    }
  } catch (error) {
    historyListEl.innerHTML = '<li class="empty">无法加载历史记录</li>';
  }
}

async function deleteRecord(id) {
  try {
    await fetch(API_BASE + "/api/history/" + id, { method: "DELETE" });
    loadHistory();
  } catch (error) {
    alert("删除失败，请检查后端是否启动");
  }
}

async function clearAllHistory() {
  if (!confirm("确定要清空全部计算历史吗？")) {
    return;
  }
  try {
    await fetch(API_BASE + "/api/history", { method: "DELETE" });
    loadHistory();
  } catch (error) {
    alert("清空失败，请检查后端是否启动");
  }
}

clearHistoryBtn.addEventListener("click", clearAllHistory);

loadHistory();
renderExpression();
