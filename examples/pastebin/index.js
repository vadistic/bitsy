// ────────────────────────────────────────────────────────────────────────────────
// dark mode

const darkStyles = /* css */ `
  body,
  select {
    background-color: #1e1e1e;
    color: #e0e0e0;
  }

  option,
  code {
    background-color: #181818;
    color: #d4d4d4;
  }
`;

function injectDarkStyles() {
  const css = document.createElement('style');
  css.type = 'text/css';
  css.id = 'dark-mode-styles';

  css.textContent = darkStyles;

  document.body.appendChild(css);
}

function clearDarkStyles() {
  const el = document.getElementById('dark-mode-styles');
  if (el) {
    document.body.removeChild(el);
  }
}

// ────────────────────────────────────────────────────────────────────────────────
// router

const MAIN_ROUTE = 'paste';

function getRouteParam() {
  const [, route, id] = window.location.pathname.split('/');

  if (route === MAIN_ROUTE && !!id) {
    return id;
  }
}

function setRouteParam(id) {
  window.history.pushState({}, `new pastebin "${id}"`, `/${MAIN_ROUTE}/${id}`);
}

function getLink(id) {
  const href = `https://` + window.location.host + '/' + MAIN_ROUTE + '/' + id;

  return href;
}

// ────────────────────────────────────────────────────────────────────────────────
// dom

const refs = {
  editor: document.getElementById('editor'),
  lang: document.getElementById('select-language'),
  theme: document.getElementById('select-theme'),
  status: document.getElementById('status'),
  link: document.getElementById('link'),
};

// ────────────────────────────────────────────────────────────────────────────────
// state & status

const STATUS = {
  NEW: 'NEW',
  CURRENT: 'CURRENT',
  BUSY: 'BUSY',
  DIRTY: 'DIRTY',
};

// temp state
const state = {
  status: STATUS.BUSY,
  identifier: getRouteParam(),
};

function getData() {
  return {
    content: _editor.getValue(),
    lang: refs.lang.value,
    theme: refs.theme.value,
  };
}

// fn to normalise state changes (but it still sucks)
function setState({ content, lang, theme, identifier, status }) {
  if (status) {
    refs.status.innerText = status;
    state.status = status;

    if (status === STATUS.NEW) {
      refs.link.innerText = `| edit to share`;
    } else if (status === STATUS.DIRTY) {
      refs.link.innerText = `| save to share (crtl+s)`;
    } else if (identifier || state.identifier) {
      const href = getLink(identifier || state.identifier);

      refs.link.innerHTML = `| <a href="${href}">LINK</a> <code><small>${href}</small></code>`;
    }
  }

  if (identifier) {
    state.identifier = identifier;
    setRouteParam(identifier);
  }

  if (content) {
    _editor.setValue(content);
  }

  if (lang) {
    refs.lang.value = lang;
    _monaco.editor.setModelLanguage(_editor.getModel(), lang);
  }

  if (theme) {
    refs.theme.value = theme;
    _monaco.editor.setTheme(theme);

    if (theme === 'vs-dark') {
      injectDarkStyles();
    } else {
      clearDarkStyles();
    }
  }
}

// ────────────────────────────────────────────────────────────────────────────────
// data

async function updateAsync() {
  setState({ status: STATUS.BUSY });

  const URL =
    `https://bitsy-nosql-bucket.herokuapp.com/api/buckets/` +
    (state.identifier || 'new');

  const res = await fetch(URL, {
    method: 'POST',
    body: JSON.stringify(getData()),
    headers: {
      'Content-Type': 'application/json',
    },
  });

  const { identifier } = await res.json();
  setState({ status: STATUS.CURRENT, identifier });
}

async function loadAsync() {
  if (!state.identifier) {
    setState({ content: 'Hello bitsy\n\n', status: STATUS.NEW });
    return;
  }

  setState({ status: STATUS.BUSY });
  const res = await fetch(
    `https://bitsy-nosql-bucket.herokuapp.com/api/buckets/${state.identifier}/last`,
  );

  const { value } = await res.json();
  setState({ ...value, status: STATUS.CURRENT });
}

// ────────────────────────────────────────────────────────────────────────────────
// main function

async function bootstrap() {
  // call load to fetch data
  await loadAsync();

  // event listeners
  refs.theme.addEventListener('change', (event) =>
    setState({ theme: event.target.value, status: STATUS.DIRTY }),
  );
  refs.lang.addEventListener('change', (event) =>
    setState({ lang: event.target.value, status: STATUS.DIRTY }),
  );

  _editor.onDidType(() => setState({ status: STATUS.DIRTY }));
  _editor.onDidPaste(() => setState({ status: STATUS.DIRTY }));

  // detect save
  // https://github.com/microsoft/monaco-editor/issues/25
  _editor.addCommand(monaco.KeyMod.CtrlCmd | monaco.KeyCode.KEY_S, () => {
    if (state.status === STATUS.DIRTY) {
      updateAsync();
    }
  });
}

// ────────────────────────────────────────────────────────────────────────────────
// it's magic copypaste
// https://github.com/microsoft/monaco-editor-samples

require.config({
  paths: { vs: 'https://unpkg.com/monaco-editor@latest/min/vs' },
});

window.MonacoEnvironment = { getWorkerUrl: () => proxy };

let proxy = URL.createObjectURL(
  new Blob(
    [
      `
  self.MonacoEnvironment = {
    baseUrl: 'https://unpkg.com/monaco-editor@latest/min/'
  };
  importScripts('https://unpkg.com/monaco-editor@latest/min/vs/base/worker/workerMain.js');
`,
    ],
    { type: 'text/javascript' },
  ),
);

// https://microsoft.github.io/monaco-editor/api/
require(['vs/editor/editor.main'], function () {
  const editor = monaco.editor.create(refs.editor, {
    language: 'plaintext',
    theme: 'vs-ligth',
  });

  // binding to global window & underscore because it's ugly
  window._monaco = monaco;
  window._editor = editor;

  // calling main function
  bootstrap();
});
