/* eslint-disable react-hooks/exhaustive-deps */
import EditorJS from "@editorjs/editorjs";
import Header from "@editorjs/header";
import Paragraph from "@editorjs/paragraph";
import DragDrop from "editorjs-drag-drop";
import Undo from "editorjs-undo";
import { Fragment, useCallback, useEffect } from "react";
import { toast } from "react-toastify";
import { persistNoCodeForm, useNoCodeForm } from "../../lib/noCodeForm";
import Loading from "../Loading";
import EmailQuestion from "./tools/EmailQuestion";
import PageTransition from "./tools/PageTransition";
import MultipleChoiceQuestion from "./tools/MultipleChoiceQuestion";
import TextQuestion from "./tools/TextQuestion";
import LikertScaleQuestion from "./tools/LikertScaleQuestion";
import WebsiteQuestion from "./tools/WebsiteQuestion";
import PhoneQuestion from "./tools/PhoneQuestion";
import NumberQuestion from "./tools/NumberQuestion";
import TextareaQuestion from "./tools/TextareaQuestion";
import ReactDOM from "react-dom";

class Summary {
  static get toolbox() {
    return {
      title: 'Summary',
      icon: '<svg xmlns="http://www.w3.org/2000/svg" class="ionicon" viewBox="0 0 512 512"><title>Stats Chart</title><rect x="64" y="320" width="48" height="160" rx="8" ry="8" fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="32"/><rect x="288" y="224" width="48" height="256" rx="8" ry="8" fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="32"/><rect x="400" y="112" width="48" height="368" rx="8" ry="8" fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="32"/><rect x="176" y="32" width="48" height="448" rx="8" ry="8" fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="32"/></svg>'
    };
  }

  render(){
    const div = document.createElement("div");
    const toolView = (
      <div className="pb-5">
        [summary_block]
      </div>
    );
    ReactDOM.render(toolView, div);
    return div;
  }

  save(blockContent){
    return {
      url: blockContent.value
    }
  }
}

interface EditorProps {
  id: string;
  autofocus: boolean;
  editorRef: { current: EditorJS | null };
  formId: string;
  initAction: (editor: EditorJS) => void;
}

const Editor = ({
  id,
  autofocus = false,
  editorRef,
  formId,
  initAction,
}: EditorProps) => {
  const { noCodeForm, isLoadingNoCodeForm, mutateNoCodeForm } =
    useNoCodeForm(formId);

  const keyPressListener = useCallback((e) => {
    if (e.key === "s" && (e.metaKey || e.ctrlKey)) {
      e.preventDefault();
      toast("snoopForms autosaves your work ✌️");
    }
  }, []);

  useEffect(() => {
    window.addEventListener("keydown", keyPressListener);
    // Remove event listeners on cleanup
    return () => {
      window.removeEventListener("keydown", keyPressListener);
    };
  }, [keyPressListener]);

  // This will run only once
  useEffect(() => {
    if (!isLoadingNoCodeForm) {
      if (!editorRef.current) {
        initEditor();
      }
    }
    return () => {
      destroyEditor();
    };
    async function destroyEditor() {
      await editorRef.current.isReady;
      editorRef.current.destroy();
      editorRef.current = null;
    }
  }, [isLoadingNoCodeForm]);

  const initEditor = () => {
    const editor = new EditorJS({
      minHeight: 0,
      holder: id,
      data: { blocks: noCodeForm.blocksDraft },
      onReady: () => {
        editorRef.current = editor;
        new DragDrop(editor);
        new Undo({ editor });
        if (editor.blocks.getBlocksCount() === 1) {
          initAction(editor);
        }
      },
      onChange: async () => {
        let content = await editor.saver.save();
        const newNoCodeForm = JSON.parse(JSON.stringify(noCodeForm));
        newNoCodeForm.blocksDraft = content.blocks;
        await persistNoCodeForm(newNoCodeForm);
        mutateNoCodeForm(newNoCodeForm);
      },
      autofocus: autofocus,
      defaultBlock: "paragraph",
      tools: {
        textQuestion: TextQuestion,
        textareaQuestion: TextareaQuestion,
        emailQuestion: EmailQuestion,
        multipleChoiceQuestion: MultipleChoiceQuestion,
        LikertScaleQuestion: LikertScaleQuestion,
        numberQuestion: NumberQuestion,
        phoneQuestion: PhoneQuestion,
        websiteQuestion: WebsiteQuestion,
        pageTransition: PageTransition,
        paragraph: {
          class: Paragraph,
          inlineToolbar: true,
          config: {
            placeholder:
              "Start with your content or hit tab key to insert block",
          },
        },
        header: {
          class: Header,
          config: {
            placeholder: "Enter a header",
            levels: [1, 2, 3],
            defaultLevel: 1,
          },
        },
        summary: {
          class: Summary,
          config: {
            placeholder: "Enter a header",
            levels: [1, 2, 3],
            defaultLevel: 1,
          },
        },
      },
    });
  };

  if (isLoadingNoCodeForm) {
    return <Loading />;
  }

  return (
    <Fragment>
      <div id={id}></div>
    </Fragment>
  );
};

export default Editor;
