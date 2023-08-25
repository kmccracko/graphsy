import React from 'react';
import ace from 'ace-builds/src-noconflict/ace';
import AceEditor from 'react-ace';

// import 'ace-builds/webpack-resolver';
import 'ace-builds/src-noconflict/mode-javascript';
import 'ace-builds/src-noconflict/theme-tomorrow_night';
import 'ace-builds/src-noconflict/ext-language_tools';
import { addCompleter } from 'ace-builds/src-noconflict/ext-language_tools';
const snippetManager = ace.require('ace/snippets').snippetManager;

const addCompleters = (...arr) => {
  for (let el of arr) {
    let { name, value, caption, meta } = el;
    addCompleter({
      getCompletions: function (editor, session, pos, prefix, callback) {
        callback(null, [
          {
            name,
            value,
            caption,
            meta,
            score: 1000,
          },
        ]);
      },
    });
  }
};

snippetManager.register(
  [
    {
      name: 'updateScreen',
      scope: 'javascript',
      tabTrigger: 'updateScreen',
      trigger: 'updateScreen',
      content: 'await updateScreen({${1:key}:`${${2:r}}.${${3:c}}`})',
    },
  ],
  'javascript'
);

addCompleters(
  {
    name: 'discovered',
    value: 'discovered',
    caption: 'discovered',
    meta: 'green fill (set)',
    score: 1000,
  },
  {
    name: 'visited',
    value: 'visited',
    caption: 'visited',
    meta: 'gray fill (set)',
    score: 1000,
  },
  {
    name: 'potential',
    value: 'potential',
    caption: 'potential',
    meta: 'yellow outline (str)',
    score: 1000,
  },
  {
    name: 'current',
    value: 'current',
    caption: 'current',
    meta: 'red outline (str)',
    score: 1000,
  }
);

interface iCodeEditorProps {
  code: string;
  onChangeCode: any;
}

const CodeEditor = (props: iCodeEditorProps) => {
  return (
    <div className='text-editor'>
      <AceEditor
        style={{
          paddingTop: '10px',
          width: '100%',
          marginLeft: '0px',
          marginRight: '0px',
        }}
        readOnly={false}
        value={props.code}
        mode='javascript'
        theme='tomorrow_night'
        onChange={props.onChangeCode}
        name='code-editor'
        fontSize={18}
        tabSize={2}
        showGutter
        focus
        minLines={3}
        maxLines={20}
        wrapEnabled
        enableLiveAutocompletion
        enableBasicAutocompletion
        enableSnippets={true}
        setOptions={{
          useWorker: false, // <<----- USE THIS OPTION TO DISABLE THE SYNTAX CHECKER
        }}
      />
    </div>
  );
};

export default CodeEditor;
