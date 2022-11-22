import React, { useEffect } from 'react';
import AceEditor from 'react-ace';

import 'ace-builds/src-noconflict/mode-javascript';
import 'ace-builds/src-noconflict/mode-typescript';
import 'ace-builds/src-noconflict/theme-tomorrow_night';
import 'ace-builds/src-noconflict/ext-language_tools';
import { addCompleter } from 'ace-builds/src-noconflict/ext-language_tools';

// import { setCompleters } from 'ace-builds/src-noconflict/ext-language_tools';
// import { snippetCompleter } from 'ace-builds/src-noconflict/ext-language_tools';
// console.log(snippetCompleter);

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

addCompleters({
  name: 'updateScreen',
  value: 'await updateScreen({discovered:`${r}.${c}`})',
  caption: 'updateScreen',
  meta: 'async state update',
  score: 1000,
});

// var staticWordCompleter = {
//   getCompletions: function (editor, session, pos, prefix, callback) {
//     var wordList = ['foo', 'bar', 'baz'];
//     callback(
//       null,
//       wordList.map(function (word) {
//         return {
//           caption: word,
//           value: word,
//           meta: 'static',
//         };
//       })
//     );
//   },
// };

interface iCodeEditorProps {
  code: string;
  onChangeCode: any;
}

const CodeEditor = (props: iCodeEditorProps) => {
  //   useEffect(() => {
  //     const completer = {
  //       getCompletions: function (editor, session, pos, prefix, callback) {
  //         var completions = [
  //           {
  //             caption: 'snippet',
  //             snippet: `This is the way to implement
  //       snippets in the react ace editor
  //       And There is a bonus aswell 👌 .
  //       Do you see that customTheme.scss file
  //       you can customize the theme there
  //       by just customizing the css variables in it . `,
  //             type: 'snippet',
  //           },
  //           {
  //             caption: 'demo',
  //             snippet: `This is Another Snippet`,
  //             type: 'snippet2',
  //           },
  //         ];

  //         /* You Can get to know how to add more cool
  //             autocomplete features by seeing the ext-language-tools
  //             file in the ace-buils folder */

  //         completions.forEach((i) => {
  //           completions.push({
  //             caption: i.caption,
  //             snippet: i.snippet,
  //             type: i.type,
  //           });
  //         });
  //         callback(null, completions);
  //       },
  //     };

  //     /* You can even use addCompleters instead of setCompleters like this :
  //            `addCompleter(completer)`;
  //          */

  //     setCompleters([completer]);
  //   }, []);

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
        mode='typescript'
        theme='tomorrow_night'
        onChange={props.onChangeCode}
        name='code-editor'
        fontSize={20}
        tabSize={2}
        showGutter
        focus
        minLines={3}
        maxLines={18}
        wrapEnabled
        enableLiveAutocompletion
        enableBasicAutocompletion
        // enableSnippets
      />
    </div>
  );
};

export default CodeEditor;
