// Покроковий обхід DOM-дерева з використанням callback-функцій
function processNode(nodes, index, onNext, onPrev, onExit) {
  if (index < 0 || index >= nodes.length) {
    onExit();
    return;
  }

  const currentNode = nodes[index];
  const isFirst = (index === 0);
  const isLast = (index === nodes.length - 1);

  // Зберігаємо початкові стилі елемента
  const originalOutline = currentNode.style.outline;
  const originalBg = currentNode.style.backgroundColor;

  // Підсвічуємо поточний вузол на сторінці
  currentNode.style.outline = "4px solid #c4472b";
  currentNode.style.backgroundColor = "rgba(196, 71, 43, 0.15)";
  currentNode.scrollIntoView({ behavior: "smooth", block: "center" });

  const tagName = currentNode.nodeName.toLowerCase();
  let textContent = currentNode.innerText || currentNode.textContent || "";
  textContent = textContent.trim().replace(/\s+/g, " ");
  const firstWord = textContent ? textContent.split(" ")[0] + "..." : "(пусто)";

  const info = `Вузол [${index + 1}/${nodes.length}]: <${tagName}>\nВміст: "${firstWord}"\n\n`;

  const cleanUpAndNext = (nextIdx) => {
    currentNode.style.outline = originalOutline;
    currentNode.style.backgroundColor = originalBg;
    onNext(nextIdx);
  };

  const cleanUpAndPrev = (prevIdx) => {
    currentNode.style.outline = originalOutline;
    currentNode.style.backgroundColor = originalBg;
    onPrev(prevIdx);
  };

  const cleanUpAndExit = () => {
    currentNode.style.outline = originalOutline;
    currentNode.style.backgroundColor = originalBg;
    onExit();
  };

  setTimeout(() => {
    if (isFirst) {
      const choice = confirm(info + "Перейти до наступного вузла?");
      if (choice) cleanUpAndNext(index + 1);
      else cleanUpAndExit();
    } else if (isLast) {
      const choice = confirm(info + "Ви досягли нижнього вузла!\nПовернутися назад?");
      if (choice) cleanUpAndPrev(index - 1);
      else cleanUpAndExit();
    } else {
      const action = prompt(
        info + "Виберіть дію:\n1 - Пройти далі\n2 - Повернутися назад\n0 - Завершити роботу",
        "1"
      );

      if (action === "1") cleanUpAndNext(index + 1);
      else if (action === "2") cleanUpAndPrev(index - 1);
      else cleanUpAndExit();
    }
  }, 50);
}

function startDOMNavigation() {
  const elements = Array.from(document.querySelectorAll("body, body *"));

  function navigateTo(idx) {
    processNode(
      elements,
      idx,
      function(nextIndex) { navigateTo(nextIndex); },
      function(prevIndex) { navigateTo(prevIndex); },
      function() { alert("Робота з DOM-деревом завершена."); }
    );
  }

  navigateTo(0);
}

window.addEventListener("DOMContentLoaded", function() {
  setTimeout(startDOMNavigation, 500);
});