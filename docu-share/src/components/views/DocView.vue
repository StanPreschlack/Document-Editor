<script lang="ts">
import { defineComponent } from 'vue'
import { getAuth } from "firebase/auth"
import { saveDoc, getDataFromId, getNameFromId } from "/Users/spreschlack/Desktop/applied internet technology/homework/final-project-StanPreschlack/docu-share/src/firebase exposure functions/dataFetchingFunctions"
import StarterKit from '@tiptap/starter-kit'
import { Editor, EditorContent } from '@tiptap/vue-3'
import CharacterCount from '@tiptap/extension-character-count'
import Text from '@tiptap/extension-text'
import TextStyle from '@tiptap/extension-text-style'
import { Color } from '@tiptap/extension-color'
import Gapcursor from '@tiptap/extension-gapcursor'
import Paragraph from '@tiptap/extension-paragraph'
import Table from '@tiptap/extension-table'
import TableCell from '@tiptap/extension-table-cell'
import TableHeader from '@tiptap/extension-table-header'
import TableRow from '@tiptap/extension-table-row'
import Youtube from '@tiptap/extension-youtube'
import Underline from '@tiptap/extension-underline'
import Image from '@tiptap/extension-image'
import Subscript from '@tiptap/extension-subscript'
import Superscript from '@tiptap/extension-superscript'
import { lowlight } from 'lowlight/lib/core'
import CodeBlockLowlight from '@tiptap/extension-code-block-lowlight'
import TextAlign from '@tiptap/extension-text-align'
import FontFamily from '@tiptap/extension-font-family'

//code syntax highlighting
import css from 'highlight.js/lib/languages/css'
import js from 'highlight.js/lib/languages/javascript'
import ts from 'highlight.js/lib/languages/typescript'
import html from 'highlight.js/lib/languages/xml'

lowlight.registerLanguage('html', html)
lowlight.registerLanguage('css', css)
lowlight.registerLanguage('js', js)
lowlight.registerLanguage('ts', ts)


export default defineComponent({
  async beforeMount(){
    if(getAuth().currentUser === null) {
      this.$router.push({ name: 'login' });
    } else {
      let parse = this.$route.params.slug.split("~");
      this.id = parse[1];
      this.slug = this.$route.params.slug;
      this.user = getAuth().currentUser.uid;
      this.docName = await getNameFromId(this.user, this.id);
    }
  },
  data() {
    return {
      docName: null,
      editor: null,
      slug: null,
      value: null,
      user: null,
      id: null,
      lastSaved: 0,
      content: null,
    };
  },
  async mounted() {
    this.editor = new Editor({
      extensions: [
        StarterKit,
        CharacterCount,
        TextStyle,
        Color.configure({
          types: ['textStyle'],
        }),
        Gapcursor,
        Table.configure({
          resizable: true,
        }),
        TableRow,
        TableHeader,
        TableCell,
        Paragraph,
        Text,
        Document,
        Youtube.configure({
          controls: true,
        }),
        Underline,
        Image,
        Subscript,
        Superscript,
        CodeBlockLowlight.configure({
          lowlight,
        }),
        TextAlign.configure({
          types: ['heading', 'paragraph'],
        }),
        FontFamily,
      ],
      content: JSON.parse(await getDataFromId(this.user, this.id)),
    })
    //autosaves data on editor change!
    this.editor.on('update', async ({ editor }) => {
      console.log("saving...")
      if (!this.docName) {
        this.docName = "untitled document"
      }
      let newSlug = await saveDoc(this.user,  this.id, editor.getJSON(), this.docName);
      if (newSlug != this.slug) {
        this.$router.push({ name: "doc", params: {slug: newSlug}});
      } 
      this.lastSaved = 0
    })
    this.interval = setInterval(() => {
      this.lastSaved += 1
    }, 1000)
  },
  beforeUnmount() {
    this.editor.destroy()
  },
  components: {
    EditorContent,
  },
  methods: {
    async home() {
      console.log("saving...")
      if (!this.docName) {
        this.docName = "untitled document"
      }
      await saveDoc(this.user,  this.id, this.editor.getJSON(), this.docName);
      this.$router.push({ name: "docs"})
    },
    addVideo() {
      const url = prompt('Enter YouTube URL')
      this.editor.commands.setYoutubeVideo({
        src: url,
        width: Math.max(320, parseInt(this.width, 10)) || 640,
        height: Math.max(180, parseInt(this.height, 10)) || 480,
      })
    },
    addImage() {
      const url = window.prompt('Enter image URL')
      if (url) {
        this.editor.chain().focus().setImage({ src: url }).run()
      }
    },
  },
})

</script>

<template>
<p id="color_label">Color picker</p>
<div id="doc">
  <div class="head">
    <input type="text" v-model="docName" placeholder="untitled document">
      <div id="actions">
        <!-- <button>Share Document</button>
        <button>Download As PDF</button> -->
        <button @click="home" id="see-all">See all docs</button>
      </div>  
    </div>  
    <!-- editor html(open at your own risk) -->
    <div id="toolbar" v-if="editor">
     <input
      type="color"
      id="color"
      @input="editor.chain().focus().setColor($event.target.value).run()"
      :value="editor.getAttributes('textStyle').color"
      />
      <div class="dropdown">
        <button class="dropbtn">Fonts</button>
        <div class="dropdown-content">
          <button @click="editor.chain().focus().setFontFamily('Inter').run()" :class="{ 'is-active': editor.isActive('textStyle', { fontFamily: 'Inter' }) }">
            Inter
          </button>
          <button @click="editor.chain().focus().setFontFamily('Comic Sans MS, Comic Sans').run()" :class="{ 'is-active': editor.isActive('textStyle', { fontFamily: 'Comic Sans MS, Comic Sans' }) }">
            Comic Sans
          </button>
          <button @click="editor.chain().focus().setFontFamily('serif').run()" :class="{ 'is-active': editor.isActive('textStyle', { fontFamily: 'serif' }) }">
            serif
          </button>
          <button @click="editor.chain().focus().setFontFamily('monospace').run()" :class="{ 'is-active': editor.isActive('textStyle', { fontFamily: 'monospace' }) }">
            monospace
          </button>
          <button @click="editor.chain().focus().setFontFamily('cursive').run()" :class="{ 'is-active': editor.isActive('textStyle', { fontFamily: 'cursive' }) }">
            cursive
          </button>
        </div>
      </div>  
      <div class="dropdown"> 
        <button class="dropbtn">Text Styles</button>
          <div class="dropdown-content">
            <button @click="editor.chain().focus().toggleBold().run()" :disabled="!editor.can().chain().focus().toggleBold().run()" :class="{ 'is-active': editor.isActive('bold') }">
              bold
            </button>
            <button @click="editor.chain().focus().toggleItalic().run()" :disabled="!editor.can().chain().focus().toggleItalic().run()" :class="{ 'is-active': editor.isActive('italic') }">
              italic
            </button>
            <button @click="editor.chain().focus().toggleStrike().run()" :disabled="!editor.can().chain().focus().toggleStrike().run()" :class="{ 'is-active': editor.isActive('strike') }">
              strike
            </button>
            <button @click="editor.chain().focus().toggleUnderline().run()" :class="{ 'is-active': editor.isActive('underline') }">
              underline
            </button>
            <button @click="editor.chain().focus().toggleSubscript().run()" :class="{ 'is-active': editor.isActive('subscript') }">
              subscript
            </button>
            <button @click="editor.chain().focus().toggleSuperscript().run()" :class="{ 'is-active': editor.isActive('superscript') }">
              superscript
            </button>
          </div>
      </div>
      <div class="dropdown">
      <button class="dropbtn">List Styles</button>
        <div class="dropdown-content">
          <button @click="editor.chain().focus().toggleBulletList().run()" :class="{ 'is-active': editor.isActive('bulletList') }">
            bullet list
          </button>
          <button @click="editor.chain().focus().toggleOrderedList().run()" :class="{ 'is-active': editor.isActive('orderedList') }">
            ordered list
          </button>
        </div>
      </div>   
      <div class="dropdown">
        <button class="dropbtn">Formats</button>
          <div class="dropdown-content">
            <button @click="editor.chain().focus().toggleCode().run()" :disabled="!editor.can().chain().focus().toggleCode().run()" :class="{ 'is-active': editor.isActive('code') }">
              code
            </button>
            <button @click="editor.chain().focus().toggleBlockquote().run()" :class="{ 'is-active': editor.isActive('blockquote') }">
              blockquote
            </button>
            <button @click="editor.chain().focus().setParagraph().run()" :class="{ 'is-active': editor.isActive('paragraph') }">
              paragraph
            </button>
            <button @click="editor.chain().focus().setTextAlign('left').run()" :class="{ 'is-active': editor.isActive({ textAlign: 'left' }) }">
              align left
            </button>
            <button @click="editor.chain().focus().setTextAlign('center').run()" :class="{ 'is-active': editor.isActive({ textAlign: 'center' }) }">
              align center
            </button>
            <button @click="editor.chain().focus().setTextAlign('right').run()" :class="{ 'is-active': editor.isActive({ textAlign: 'right' }) }">
              align right
            </button>
          </div>
      </div>    
      <div class="dropdown">
        <button class="dropbtn">Insert</button>
          <div class="dropdown-content">
            <button @click="editor.chain().focus().setHorizontalRule().run()">
              horizontal rule
            </button>
            <button @click="editor.chain().focus().setHardBreak().run()">
              hard break
            </button>
            <button @click="editor.chain().focus().toggleCodeBlock().run()" :class="{ 'is-active': editor.isActive('codeBlock') }">
              code block
            </button>
            <button @click="addImage">
              image
            </button>
            <button id="add" @click="addVideo">
              YouTube video
            </button>
            <input
              id="width"
              type="number"
              v-model="width"
              placeholder="video width (default 640)"
              min="320"
              max="1024"
            >
            <input
              id="height"
              type="number"
              v-model="height"
              placeholder="video height (default 480)"
              min="180"
              max="720"
            >
          </div>
      </div>       
      <div class="dropdown">
        <button class="dropbtn">Clear</button>
          <div class="dropdown-content">
            <button id="undo" @click="editor.chain().focus().undo().run()" :disabled="!editor.can().chain().focus().undo().run()">
              undo
            </button>
            <button id="redo" @click="editor.chain().focus().redo().run()" :disabled="!editor.can().chain().focus().redo().run()">
              redo
            </button>
            <button @click="editor.chain().focus().unsetAllMarks().run()">
              clear marks
            </button>
            <button @click="editor.chain().focus().clearNodes().run()">
              clear nodes
            </button>
          </div>
      </div>    
      <div class="dropdown">
        <button class="dropbtn">Table</button>
        <div id="tableOptions" class="dropdown-content">
          <button @click="editor.chain().focus().insertTable({ rows: 3, cols: 3, withHeaderRow: true }).run()">
            Insert Table
          </button>
          <button @click="editor.chain().focus().addColumnBefore().run()">
            Add Column Before
          </button>
          <button @click="editor.chain().focus().addColumnAfter().run()">
            Add Column After
          </button>
          <button @click="editor.chain().focus().deleteColumn().run()">
            Delete Column
          </button>
          <button @click="editor.chain().focus().addRowBefore().run()">
            Add Row Before
          </button>
          <button @click="editor.chain().focus().addRowAfter().run()">
            Add Row After
          </button>
          <button @click="editor.chain().focus().deleteRow().run()">
            Delete Row
          </button>
          <button @click="editor.chain().focus().deleteTable().run()">
            Delete Table
          </button>
          <button @click="editor.chain().focus().mergeCells().run()">
            Merge Cells
          </button>
          <button @click="editor.chain().focus().splitCell().run()">
            Split Cell
          </button>
          <button @click="editor.chain().focus().toggleHeaderColumn().run()">
            Toggle Header Column
          </button>
          <button @click="editor.chain().focus().toggleHeaderRow().run()">
            Toggle Header Row
          </button>
          <button @click="editor.chain().focus().toggleHeaderCell().run()">
            Toggle Header Cell
          </button>
          <button @click="editor.chain().focus().mergeOrSplit().run()">
            Merge Or Split
          </button>
          <button @click="editor.chain().focus().setCellAttribute('colspan', 2).run()">
            Set Cell Attribute
          </button>
          <button @click="editor.chain().focus().fixTables().run()">
            Fix Tables
          </button>
          <button @click="editor.chain().focus().goToNextCell().run()">
            Go To Next Cell
          </button>
          <button @click="editor.chain().focus().goToPreviousCell().run()">
            Go To Previous Cell
          </button>
        </div>
      </div>    
   </div>      
  <editor-content id="editor" :editor="editor" />
  <div class="count" v-if="editor">
    <p>{{ this.editor.storage.characterCount.words() }} words</p><br />
    <p>{{ this.editor.storage.characterCount.characters() }} characters</p><br/>
    <p id="saved">last saved {{ this.lastSaved }} seconds ago</p>
  </div>
</div>
</template>

<style>

#tableOptions {
  height: 500px;
  overflow-y: scroll;
  background-color: white;
  box-shadow: rgba(0, 0, 0, 0.25) 0px 54px 55px, rgba(0, 0, 0, 0.12) 0px -12px 30px, rgba(0, 0, 0, 0.12) 0px 4px 6px, rgba(0, 0, 0, 0.17) 0px 12px 13px, rgba(0, 0, 0, 0.09) 0px -3px 5px;
}
#tableOptions button {
  box-shadow: none;
}

/* Dropdown button */
.dropdown .dropbtn {
  font-size: 16px;
  border: none;
  outline: none;
  color: white;
  padding: 14px 16px;
  background-color: inherit;
  font-family: inherit; /* Important for vertical align on mobile phones */
  margin: 0; /* Important for vertical align on mobile phones */
}

/* Dropdown content (hidden by default) */
.dropdown-content {
  display: none;
  position: absolute;
  min-width: 160px;
  z-index: 1;
}

.dropdown-content button {
  box-shadow: rgba(0, 0, 0, 0.25) 0px 54px 55px, rgba(0, 0, 0, 0.12) 0px -12px 30px, rgba(0, 0, 0, 0.12) 0px 4px 6px, rgba(0, 0, 0, 0.17) 0px 12px 13px, rgba(0, 0, 0, 0.09) 0px -3px 5px;
}

/* Show the dropdown menu on hover */
.dropdown:hover .dropdown-content {
  display: flex;
  flex-direction: column;
}

#color {
  position: absolute;
  width: 200px;
  height: 100px;
  padding: 10px;
  bottom: 50px;
  right: 50px;
  background-color: white;
  border: 5px solid black;
}

.count {
  position: absolute;
  bottom: 50px;
  left: 50px;
  opacity: 0.5;
}

#toolbar {
  overflow-x: scroll;
  display: flex;
  flex-direction: row;
  box-shadow: rgba(0, 0, 0, 0.45) 0px 25px 20px -20px;
  justify-content: center;
}

#twoEditor {
  position: absolute;
  bottom: 0;
}

body {
  background-color: white;
}

#toolbar button {
  width: 200px;
  margin: 10px;
  margin-right: 2px;
  margin-left: 2px;
  padding: 10px;
  height: fit-content;
  border: none;
  outline: none;
  color: #fff;
  background: #111;
  cursor: pointer;
  position: relative;
  z-index: 0;
  background-color: white;
}

#toolbar button:before {
  content: '';
  background: linear-gradient(45deg, #ff0000, #ff7300, #fffb00, #48ff00, #00ffd5, #002bff, #7a00ff, #ff00c8, #ff0000);
  position: absolute;
  top: -2px;
  left:-2px;
  background-size: 400%;
  z-index: -1;
  filter: blur(5px);
  width: calc(100% + 4px);
  height: calc(100% + 4px);
  animation: glowing 20s linear infinite;
  opacity: 0;
  transition: opacity .3s ease-in-out;
}

#toolbar button:active {
    color: #000
}

#toolbar button:active:after {
    background: transparent;
}

#toolbar  button:hover:before {
    opacity: 1;
}

#toolbar button:after {
    z-index: -1;
    content: '';
    position: absolute;
    width: 100%;
    height: 100%;
    background: #111;
    left: 0;
    top: 0;
}

@keyframes glowing {
  0% { background-position: 0 0; }
  50% { background-position: 400% 0; }
  100% { background-position: 0 0; }
}

#doc {
  position: absolute;
  width: 100vw;
  height: 100%;
  background-color: white;
}

#editor {
  position: absolute;
  left: 50%;
  transform: translateX(-50%);
  width: 90vw;
  max-width: 800px;
  height: fit-content;
  min-height: 60vh;
  padding: 7vw;
  background-color: white;
  border: none;
  box-shadow: rgba(0, 0, 0, 0.3) 0px 19px 38px, rgba(0, 0, 0, 0.22) 0px 15px 12px;
  transition: 0.5s;
  margin-top: 25px;
}
#editor:focus {
  background-color: red;
}
#editor:hover {
  box-shadow: rgba(0, 0, 0, 0.25) 0px 14px 28px, rgba(0, 0, 0, 0.22) 0px 10px 10px;
}
.head {
  position: relative;
  width: 100%;
  background-color: white;
  height: 5vh;
  min-height: 25px;
  font-size: 2rem;
}
.head input {
  border: none;
  font-size: 3rem;
  transition: 0.5s;
  padding-left: 10px;
  padding-right: 10px;
  width: 380px;
}
.head input:focus {
  outline: none;
  background-color: black;
  color: white;
}
#actions {
  position: absolute;
  right: 10px;
  top: 5px;
}
#actions button {
  height: 100%;
  padding: 5px;
  border: none;
  background-color: white;
  cursor: pointer; 
}
#actions button:hover {
  background-color: black;
  color: white;
}
.doc-name input[type="text"] {
  position: relative;
  width: fit-content;
  height: 5vh;
  border: none;
  font-size: 4vh;
  left: 1vh;
  min-height: 25px;
  background-color: white;
}

</style>

<style lang="scss">
/* Basic editor styles */
.ProseMirror {
  > * + * {
    margin-top: 0.75em;
  }

  ul,
  ol {
    padding: 0 1rem;
  }

  h1,
  h2,
  h3,
  h4,
  h5,
  h6 {
    line-height: 1.1;
  }

  code {
    background-color: rgba(#616161, 0.1);
    color: #616161;
  }

  pre {
    background: #0D0D0D;
    color: #FFF;
    font-family: 'JetBrainsMono', monospace;
    padding: 0.75rem 1rem;
    border-radius: 0.5rem;

    code {
      color: inherit;
      padding: 0;
      background: none;
      font-size: 0.8rem;
    }
  }

  img {
    max-width: 100%;
    height: auto;
  }

  blockquote {
    padding-left: 1rem;
    border-left: 2px solid rgba(#0D0D0D, 0.1);
  }

  hr {
    border: none;
    border-top: 2px solid rgba(#0D0D0D, 0.1);
    margin: 2rem 0;
  }
}


.ProseMirror {
  table {
    border-collapse: collapse;
    table-layout: fixed;
    width: 100%;
    margin: 0;
    overflow: hidden;

    td,
    th {
      min-width: 1em;
      border: 2px solid #ced4da;
      padding: 3px 5px;
      vertical-align: top;
      box-sizing: border-box;
      position: relative;

      > * {
        margin-bottom: 0;
      }
    }

    th {
      font-weight: bold;
      text-align: left;
      background-color: #f1f3f5;
    }

    .selectedCell:after {
      z-index: 2;
      position: absolute;
      content: "";
      left: 0; right: 0; top: 0; bottom: 0;
      background: rgba(200, 200, 255, 0.4);
      pointer-events: none;
    }

    .column-resize-handle {
      position: absolute;
      right: -2px;
      top: 0;
      bottom: -2px;
      width: 4px;
      background-color: #adf;
      pointer-events: none;
    }

    p {
      margin: 0;
    }
  }

  > * + * {
    margin-top: 0.75em;
  }

  pre {
    background: #0D0D0D;
    color: #FFF;
    font-family: 'JetBrainsMono', monospace;
    padding: 0.75rem 1rem;
    border-radius: 0.5rem;

    code {
      color: inherit;
      padding: 0;
      background: none;
      font-size: 0.8rem;
    }

    .hljs-comment,
    .hljs-quote {
      color: #616161;
    }

    .hljs-variable,
    .hljs-template-variable,
    .hljs-attribute,
    .hljs-tag,
    .hljs-name,
    .hljs-regexp,
    .hljs-link,
    .hljs-name,
    .hljs-selector-id,
    .hljs-selector-class {
      color: #F98181;
    }

    .hljs-number,
    .hljs-meta,
    .hljs-built_in,
    .hljs-builtin-name,
    .hljs-literal,
    .hljs-type,
    .hljs-params {
      color: #FBBC88;
    }

    .hljs-string,
    .hljs-symbol,
    .hljs-bullet {
      color: #B9F18D;
    }

    .hljs-title,
    .hljs-section {
      color: #FAF594;
    }

    .hljs-keyword,
    .hljs-selector-tag {
      color: #70CFF8;
    }

    .hljs-emphasis {
      font-style: italic;
    }

    .hljs-strong {
      font-weight: 700;
    }

  }
}

.tableWrapper {
  padding: 1rem 0;
  overflow-x: auto;
}

.resize-cursor {
  cursor: ew-resize;
  cursor: col-resize;
}

</style>
