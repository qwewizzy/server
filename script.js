const terminal = document.getElementById('terminalBody');

const script = [
  { type: 'command', text: 'whoami' },
  { type: 'output', text: 'solo_developer' },
  { type: 'command', text: 'cat stack.json' },
  { type: 'output', html: '{ <span class="key">"platform"</span>: <span class="str">"Faceit"</span>, <span class="key">"type"</span>: <span class="str">"plugin"</span> }' },
  { type: 'command', text: 'status' },
  { type: 'output', html: '<span class="str">● online</span> — open for collaboration' }
];

const TYPING_SPEED = 55;
const PAUSE_AFTER_CMD = 350;
const PAUSE_AFTER_OUTPUT = 500;

function createCommandLine() {
  const line = document.createElement('div');
  line.className = 'line';
  line.innerHTML = `<span class="prompt">$</span><span class="cmd"></span>`;
  return line;
}

function typeText(element, text, speed = TYPING_SPEED) {
  return new Promise(resolve => {
    let i = 0;
    const interval = setInterval(() => {
      element.textContent += text.charAt(i);
      i++;
      if (i >= text.length) {
        clearInterval(interval);
        resolve();
      }
    }, speed);
  });
}

function addOutputLine(html) {
  const out = document.createElement('div');
  out.className = 'output';
  out.innerHTML = html;
  out.style.opacity = 0;
  out.style.transition = 'opacity 0.3s ease';
  terminal.appendChild(out);
  requestAnimationFrame(() => {
    out.style.opacity = 1;
  });
}

function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

async function runScript() {
  for (let step of script) {
    if (step.type === 'command') {
      const line = createCommandLine();
      terminal.appendChild(line);
      const cmdSpan = line.querySelector('.cmd');

      const cursor = document.createElement('span');
      cursor.className = 'cursor';
      line.appendChild(cursor);

      await typeText(cmdSpan, step.text);
      await sleep(PAUSE_AFTER_CMD);

      cursor.remove();
    } else {
      addOutputLine(step.html || step.text);
      await sleep(PAUSE_AFTER_OUTPUT);
    }
  }

  const finalLine = document.createElement('div');
  finalLine.className = 'line';
  finalLine.innerHTML = `<span class="prompt">$</span><span class="cursor"></span>`;
  terminal.appendChild(finalLine);
}

function fadeInOnLoad() {
  const elements = document.querySelectorAll('.dev-card, .links, .footer');
  elements.forEach((el, index) => {
    el.style.opacity = '0';
    el.style.transform = 'translateY(15px)';
    el.style.transition = 'opacity 0.5s ease, transform 0.5s ease';

    setTimeout(() => {
      el.style.opacity = '1';
      el.style.transform = 'translateY(0)';
    }, 300 + index * 120);
  });
}

document.addEventListener('DOMContentLoaded', () => {
  fadeInOnLoad();
  setTimeout(runScript, 500);
});
