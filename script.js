const dropzone = document.getElementById('dropzone');
const canvas = document.getElementById('canvas');
const ctx = canvas.getContext('2d');
const resultsTable = document.getElementById('results');
const resultsBody = resultsTable.querySelector('tbody');
const progressContainer = document.getElementById('progress-container');
const progressBar = document.getElementById('progress');
const progressText = document.getElementById('progress-text');
const zipBtn = document.getElementById('zip-btn');
const themeToggle = document.getElementById('theme-toggle');

const totalOrigEl = document.getElementById('total-orig');
const totalNewEl = document.getElementById('total-new');
const totalDiffEl = document.getElementById('total-diff');
const totalPercentEl = document.getElementById('total-percent');

let totalOrig = 0;
let totalNew = 0;
let convertedFiles = [];
let fileCounter = 0;

// 初期テーマをOS設定から取得
const prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
document.documentElement.setAttribute("data-bs-theme", prefersDark ? "dark" : "light");
themeToggle.textContent = prefersDark ? "☀️ Light" : "🌙 Dark";

// ダークモード切り替え
themeToggle.addEventListener('click', () => {
  const html = document.documentElement;
  if (html.getAttribute("data-bs-theme") === "light") {
    html.setAttribute("data-bs-theme", "dark");
    themeToggle.textContent = "☀️ Light";
  } else {
    html.setAttribute("data-bs-theme", "light");
    themeToggle.textContent = "🌙 Dark";
  }
});

function formatSize(bytes) {
  if (bytes < 1024) return bytes + " B";
  else if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + " KB";
  else return (bytes / (1024 * 1024)).toFixed(2) + " MB";
}

dropzone.addEventListener('dragover', (e) => {
  e.preventDefault();
  dropzone.classList.add('dragover');
});

dropzone.addEventListener('dragleave', () => {
  dropzone.classList.remove('dragover');
});

dropzone.addEventListener('drop', async (e) => {
  e.preventDefault();
  dropzone.classList.remove('dragover');
  resultsTable.style.display = "table";

  const files = [...e.dataTransfer.files].filter(f =>
    ["image/webp", "image/png", "image/jpeg"].includes(f.type)
  );
  if (files.length === 0) {
    alert("PNG / JPG / WebP 画像をドロップしてください。");
    return;
  }

  progressContainer.style.display = "block";
  progressBar.style.width = "0%";
  progressText.textContent = `処理中... (0 / ${files.length})`;

  let count = 0;

  for (let file of files) {
    await new Promise((resolve) => {
      const img = new Image();
      img.src = URL.createObjectURL(file);
      img.onload = () => {
        canvas.width = img.width;
        canvas.height = img.height;
        ctx.drawImage(img, 0, 0);
        canvas.toBlob((blob) => {
          const origSize = file.size;
          const newSize = blob.size;
          const diff = newSize - origSize;
          const percent = ((diff / origSize) * 100).toFixed(1);

          totalOrig += origSize;
          totalNew += newSize;

          const baseName = file.name.replace(/\.[^.]+$/, '');
          const cleanName = `${baseName}_${++fileCounter}.webp`;

          convertedFiles.push({ name: cleanName, blob });

          const tr = document.createElement("tr");
          tr.innerHTML = `
            <td>${file.name}</td>
            <td>${formatSize(origSize)}</td>
            <td>${formatSize(newSize)}</td>
            <td class="${diff <= 0 ? 'smaller' : 'larger'}">
              ${diff > 0 ? '+' : ''}${formatSize(diff)}
            </td>
            <td class="${diff <= 0 ? 'smaller' : 'larger'}">
              ${percent > 0 ? '+' : ''}${percent} %
            </td>
            <td><a class="btn btn-sm btn-outline-success" href="${URL.createObjectURL(blob)}" download="${cleanName}">DL</a></td>
          `;
          resultsBody.appendChild(tr);

          count++;
          const progressVal = (count / files.length) * 100;
          progressBar.style.width = progressVal + "%";
          progressText.textContent = `処理中... (${count} / ${files.length})`;
          resolve();
        }, 'image/webp', 0.8);
      };
    });
  }

  const totalDiff = totalNew - totalOrig;
  const totalPercent = ((totalDiff / totalOrig) * 100).toFixed(1);

  totalOrigEl.textContent = formatSize(totalOrig);
  totalNewEl.textContent = formatSize(totalNew);
  totalDiffEl.textContent = (totalDiff > 0 ? '+' : '') + formatSize(totalDiff);
  totalDiffEl.className = totalDiff <= 0 ? 'smaller' : 'larger';
  totalPercentEl.textContent = (totalPercent > 0 ? '+' : '') + totalPercent + " %";
  totalPercentEl.className = totalDiff <= 0 ? 'smaller' : 'larger';

  progressText.textContent = `完了しました！ (${files.length} / ${files.length})`;

  if (convertedFiles.length > 0) {
    zipBtn.disabled = false;
  }
});

// ZIPダウンロード
zipBtn.addEventListener('click', async () => {
  const zip = new JSZip();
  convertedFiles.forEach(f => {
    zip.file(f.name, f.blob);
  });

  const now = new Date();
  const y = now.getFullYear();
  const m = String(now.getMonth() + 1).padStart(2, '0');
  const d = String(now.getDate()).padStart(2, '0');
  const dateStr = `${y}${m}${d}`;

  const content = await zip.generateAsync({ type: "blob" });
  saveAs(content, `converted_${dateStr}.zip`);
});
