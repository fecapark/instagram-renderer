import { cl, getCSSVar, qs, qsAll, setCSSVar } from "./utils/doc.js";

window.onload = () => {
  (function () {
    const stageWidth = 1080;
    const stageHeight = 1080;
    let theme = "light";

    function renderNewItem(to) {
      const item = cl("div", { className: "item" });
      item.innerHTML = `
        <div class="text">
          <textarea spellcheck="false" placeholder="글을 작성해주세요"></textarea>
        </div>
        <div class="preview">
          <canvas></canvas>
        </div>
        <div class="setting">
          <div class="setters">
            <div class="setter size">
              <span>폰트 크기</span>
              <input type="range" min="32" max="200" step="1" value="64" />
            </div>

            <div class="setter weight">
              <span>폰트 굵기</span>
              <input type="range" min="100" max="900" step="100" value="400" />
            </div>

            <div class="setter height">
              <span>줄 간격</span>
              <input type="range" min="0" max="50" step="1" value="24" />
            </div>
          </div>

          <div class="remove">
            <svg stroke="currentColor" fill="currentColor" stroke-width="0" viewBox="0 0 512 512" height="1em" width="1em" xmlns="http://www.w3.org/2000/svg"><path d="M128 405.429C128 428.846 147.198 448 170.667 448h170.667C364.802 448 384 428.846 384 405.429V160H128v245.429zM416 96h-80l-26.785-32H202.786L176 96H96v32h320V96z"></path></svg>
          </div>
        </div>
      `;
      to.appendChild(item);

      addRemoveEvent(item);
      addRangeEvent(item);
      addWriteEventTo(item);
    }

    function addRemoveEvent(item) {
      qs(".remove", item).addEventListener("click", () => {
        item.remove();
      });
    }

    function addRangeEvent(item) {
      const onChange = () => {
        writeUpdate(ctx, textarea.value, {
          size: parseInt(sizeRange.value),
          weight: parseInt(weightRange.value),
          lineHeight: parseInt(lhRange.value),
        });
      };

      const textarea = qs("textarea", item);
      const sizeRange = qs(".setting > .setters > .size > input", item);
      const weightRange = qs(".setting > .setters > .weight > input", item);
      const lhRange = qs(".setting > .setters > .height > input", item);
      const ctx = qs("canvas", item).getContext("2d");

      sizeRange.addEventListener("input", onChange);
      weightRange.addEventListener("input", onChange);
      lhRange.addEventListener("input", onChange);
    }

    function addThemeEvent() {
      const onClick = (e) => {
        const { theme: dataTheme } = e.target.dataset;

        lightBtn.classList.remove("selected");
        darkBtn.classList.remove("selected");

        if (dataTheme === "light") {
          theme = "light";
          setCSSVar("--bg-theme", "#ffffff");
          setCSSVar("--font-color-theme", "#212121");
          lightBtn.classList.add("selected");
        } else if (dataTheme === "dark") {
          theme = "dark";
          setCSSVar("--bg-theme", "#121212");
          setCSSVar("--font-color-theme", "#ffffff");
          darkBtn.classList.add("selected");
        }

        qsAll(".item", qs("#item-container")).forEach((aItem) => {
          const sizeRange = qs(".setting > .setters > .size > input", aItem);
          const weightRange = qs(
            ".setting > .setters > .weight > input",
            aItem
          );
          const lhRange = qs(".setting > .setters > .height > input", aItem);
          const textarea = qs("textarea", aItem);
          const ctx = qs("canvas", aItem).getContext("2d");
          writeUpdate(ctx, textarea.value, {
            size: parseInt(sizeRange.value),
            weight: parseInt(weightRange.value),
            lineHeight: parseInt(lhRange.value),
          });
        });
      };

      const lightBtn = qs("#theme-picker > .theme[data-theme='light']");
      const darkBtn = qs("#theme-picker > .theme[data-theme='dark']");

      lightBtn.addEventListener("click", onClick);
      darkBtn.addEventListener("click", onClick);
    }

    function writeUpdate(ctx, text, { size, weight, lineHeight } = {}) {
      const textLines = [""];

      const FONT_WEIGHT = weight ?? 400;
      const FONT_SIZE = size ?? 64;
      const PADDING = 40;
      const LINE_HEIGHT = lineHeight ?? 24;

      console.log(LINE_HEIGHT);

      ctx.clearRect(0, 0, stageWidth, stageHeight);

      ctx.beginPath();
      ctx.fillStyle = getCSSVar("--bg-theme");
      ctx.fillRect(0, 0, stageWidth, stageHeight);

      ctx.beginPath();
      ctx.fillStyle = theme === "light" ? "#212121" : "#ffffff";
      ctx.font = `${FONT_WEIGHT} ${FONT_SIZE}px 'NanumSquare Neo'`;
      ctx.textBaseline = "top";

      for (let i = 0; i < text.length; i++) {
        const m = ctx.measureText(textLines[textLines.length - 1] + text[i]);

        if (m.width >= stageWidth - PADDING * 2 || text[i] === "\n") {
          textLines.push("");
        }

        if (text[i] !== "\n") {
          textLines[textLines.length - 1] += text[i];
        }
      }

      textLines.forEach((aLine, i) => {
        aLine = aLine.trim();

        const { width: textWidth } = ctx.measureText(aLine);
        const verticalSize =
          textLines.length * FONT_SIZE + (textLines.length - 1) * LINE_HEIGHT;
        const heightStartPos = (stageHeight - verticalSize) / 2;

        ctx.fillText(
          aLine,
          (stageWidth - textWidth) / 2,
          heightStartPos + i * (FONT_SIZE + LINE_HEIGHT)
        );
      });
    }

    function addWriteEventTo(item) {
      const initCanvas = () => {
        const pixelRatio = window.devicePixelRatio > 1 ? 2 : 1;

        canvas.width = stageWidth * pixelRatio;
        canvas.height = stageHeight * pixelRatio;

        ctx.scale(pixelRatio, pixelRatio);
      };

      const textarea = qs("textarea", item);
      const canvas = qs("canvas", item);
      const ctx = canvas.getContext("2d");
      const sizeRange = qs(".setting > .setters > .size > input", item);
      const weightRange = qs(".setting > .setters > .weight > input", item);
      const lhRange = qs(".setting > .setters > .height > input", item);

      initCanvas();
      textarea.addEventListener("input", (e) => {
        writeUpdate(ctx, e.target.value, {
          size: parseInt(sizeRange.value),
          weight: parseInt(weightRange.value),
          lineHeight: parseInt(lhRange.value),
        });
      });
    }

    function addRenderEvent() {
      qs("#add-item").addEventListener("click", () => {
        renderNewItem(qs("#item-container"));
      });
    }

    function setCopyrightYear() {
      qs("footer > span").textContent = new Date().getFullYear().toString();
    }

    function addDownloadEvent() {
      const downloadBtn = qs("#download");
      const modal = qs("#modal");
      const modalContent = qs("#modal-content");

      downloadBtn.addEventListener("click", () => {
        modal.classList.add("active");

        const canvases = qsAll("#item-container > .item canvas");

        canvases.forEach((aCanvas) => {
          const src = aCanvas.toDataURL("image/png");

          const img = new Image();
          img.src = src;
          img.width = 540;
          img.height = 540;

          modalContent.appendChild(img);
        });
      });
    }

    setCopyrightYear();
    addRenderEvent();
    addThemeEvent();
    addDownloadEvent();
    renderNewItem(qs("#item-container"));
  })();
};
