import {
  GlobeAltIcon,
  EnvelopeIcon,
  PhoneIcon,
} from "@heroicons/react/24/solid";
import { SnoopElement, SnoopForm, SnoopPage } from "swisspoll-react";
import { useMemo, useRef, useState } from "react";
import { generateId, classNames } from "../../lib/utils";
import Loading from "../Loading";
import ResultsSummary from "../results/ResultsSummary";

export default function App({
  id = "",
  formId,
  blocks,
  localOnly = false,
  noCodeForm,
}) {
  const [loading, setLoading] = useState(false);
  const submitButton = useRef(null);
  const pages = useMemo(() => {
    const pages = [];
    let currentPage = {
      id: formId, // give the first page the formId as id by default
      blocks: [],
    };
    for (const block of blocks) {
      if (block.type !== "pageTransition") {
        currentPage.blocks.push(block);
      } else {
        currentPage.blocks.push({
          id: generateId(10),
          data: {
            label: block.data.submitLabel,
          },
          type: "submitButton",
        });
        pages.push(currentPage);
        currentPage = {
          id: block.id,
          blocks: [],
        };
      }
    }
    pages.push(currentPage);
    return pages;
  }, [blocks, formId]);

  if (!pages) return <Loading />;

  const handleSubmit = () => {
    setLoading(true);
    submitButton.current.click();
    setLoading(false);
  };

  const css = `:root {
    --hex-color-custom-text: ${noCodeForm.textColor};
    --hex-color-custom-background: ${noCodeForm.backgroundColor};
    --hex-color-custom-buttons: ${noCodeForm.buttonsColor};
  }`;

  return (
    <>
      <style>{css}</style>
      <div className="w-full px-5 py-5">
        <SnoopForm
          key={id} // used to reset form
          domain={window.location.host}
          protocol={window.location.protocol === "http:" ? "http" : "https"}
          formId={formId}
          localOnly={localOnly}
          className="w-full max-w-3xl mx-auto space-y-6"
        >
          {pages.map((page, pageIdx) => (
            <SnoopPage
              key={page.id}
              name={page.id}
              thankyou={pageIdx === pages.length - 1}
            >
              {page.blocks.map((block) => (
                <div key={block.id}>
                  {block.type === "paragraph" ? (
                    <p
                      className={classNames(`text-custom-text`, "ce-paragraph")}
                    >
                      {block.data.text}
                    </p>
                  ) : block.type === "header" ? (
                    block.data.level === 1 ? (
                      <h1
                        className={classNames(`text-custom-text`, "ce-header")}
                      >
                        {block.data.text}
                      </h1>
                    ) : block.data.level === 2 ? (
                      <h2
                        className={classNames(`text-custom-text`, "ce-header")}
                      >
                        {block.data.text}
                      </h2>
                    ) : block.data.level === 3 ? (
                      <h3
                        className={classNames(`text-custom-text`, "ce-header")}
                      >
                        {block.data.text}
                      </h3>
                    ) : (
                      block.data.level
                    )
                  ) : block.type === "textQuestion" ? (
                    <SnoopElement
                      type="text"
                      name={block.id}
                      label={block.data.label}
                      help={block.data.help}
                      placeholder={block.data.placeholder}
                      classNames={{
                        label: `mt-4 mb-2 block text-lg font-bold leading-7 text-custom-text`,
                      }}
                      required={block.data.required}
                      style="`--customPadding:${someDynamicValue}`"
                    />
                  ) : block.type === "textareaQuestion" ? (
                    <SnoopElement
                      type="textarea"
                      rowsNumber={4}
                      name={block.id}
                      label={block.data.label}
                      help={block.data.help}
                      placeholder={block.data.placeholder}
                      classNames={{
                        label: `mt-4 mb-2 block text-lg font-bold leading-7 text-custom-text`,
                      }}
                      required={block.data.required}
                    />
                  ) : block.type === "emailQuestion" ? (
                    <SnoopElement
                      type="email"
                      name={block.id}
                      label={block.data.label}
                      help={block.data.help}
                      placeholder={block.data.placeholder}
                      icon={<EnvelopeIcon className="w-5 h-5" />}
                      classNames={{
                        label: `mt-4 mb-2 block text-lg font-bold leading-7 text-custom-text`,
                      }}
                      required={block.data.required}
                    />
                  ) : block.type === "multipleChoiceQuestion" &&
                    block.data.multipleChoice ? (
                    <SnoopElement
                      type="checkbox"
                      name={block.id}
                      label={block.data.label}
                      help={block.data.help}
                      options={block.data.options.map((o) => o.label)}
                      classNames={{
                        label: `mt-4 mb-2 block text-lg font-bold leading-7 text-custom-text`,
                      }}
                      required={block.data.required}
                    />
                  ) : block.type === "multipleChoiceQuestion" &&
                    !block.data.multipleChoice ? (
                    <SnoopElement
                      type="radio"
                      name={block.id}
                      label={block.data.label}
                      help={block.data.help}
                      options={block.data.options.map((o) => o.label)}
                      classNames={{
                        label: `mt-4 mb-2 block text-lg font-bold leading-7 text-custom-text`,
                      }}
                      required={block.data.required}
                    />
                  ) : block.type === "LikertScaleQuestion" ? (
                    <SnoopElement
                      type="likert"
                      name={block.id}
                      label={block.data.label}
                      help={block.data.help}
                      rows={block.data.rows}
                      columns={block.data.columns}
                      classNames={{
                        label: `mt-4 mb-2 block text-lg font-bold leading-7 text-custom-text`,
                      }}
                      required={block.data.required}
                    />
                  ) : block.type === "numberQuestion" ? (
                    <SnoopElement
                      type="number"
                      name={block.id}
                      label={block.data.label}
                      help={block.data.help}
                      placeholder={block.data.placeholder}
                      classNames={{
                        label: `mt-4 mb-2 block text-lg font-bold leading-7 text-custom-text`,
                      }}
                      required={block.data.required}
                    />
                  ) : block.type === "phoneQuestion" ? (
                    <SnoopElement
                      type="phone"
                      name={block.id}
                      label={block.data.label}
                      help={block.data.help}
                      placeholder={block.data.placeholder}
                      icon={<PhoneIcon className="w-5 h-5" />}
                      classNames={{
                        label: `mt-4 mb-2 block text-lg font-bold leading-7 text-custom-text`,
                      }}
                      required={block.data.required}
                    />
                  ) : block.type === "submitButton" ? (
                    <SnoopElement
                      name="submit"
                      type="submit"
                      label={block.data.label}
                      classNames={{
                        button:
                          "inline-flex items-center px-4 py-3 text-sm font-medium text-white bg-gray-700 border border-transparent rounded-md shadow-sm hover:bg-gray-900 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500 focus:opacity-50 bg-custom-buttons hover:bg-custom-buttons focus:ring-custom-buttons",
                      }}
                    />
                    // <>
                    //   <button
                    //     ref={submitButton}
                    //     type="submit"
                    //     className="hidden"
                    //   >
                    //     Submit
                    //   </button>
                    //   <button
                    //     disabled={loading}
                    //     onClick={handleSubmit}
                    //     type="submit"
                    //     className={classNames(
                    //       `bg-custom-buttons hover:bg-custom-buttons focus:ring-custom-buttons`,
                    //       "inline-flex items-center px-4 py-3 text-sm font-medium leading-4 text-white border border-transparent rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-70"
                    //     )}
                    //   >
                    //     {loading && (
                    //       <svg
                    //         className="animate-spin -ml-1 mr-3 h-4 w-4 text-white"
                    //         xmlns="http://www.w3.org/2000/svg"
                    //         fill="none"
                    //         viewBox="0 0 24 24"
                    //       >
                    //         <circle
                    //           className="opacity-25"
                    //           cx="12"
                    //           cy="12"
                    //           r="10"
                    //           stroke="currentColor"
                    //           strokeWidth="4"
                    //         ></circle>
                    //         <path
                    //           className="opacity-75"
                    //           fill="currentColor"
                    //           d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                    //         ></path>
                    //       </svg>
                    //     )}
                    //     {block.data.label || "Submit"}
                    //   </button>
                    // </>
                  ) : block.type === "websiteQuestion" ? (
                    <SnoopElement
                      type="website"
                      name={block.id}
                      label={block.data.label}
                      help={block.data.help}
                      placeholder={block.data.placeholder}
                      icon={<GlobeAltIcon className="w-5 h-5" />}
                      classNames={{
                        label: `mt-4 mb-2 block text-lg font-bold leading-7 text-custom-text`,
                      }}
                      required={block.data.required}
                    />
                  ) : block.type === "summary" ? (
                    <ResultsSummary formId={formId} showCards={false} />
                  ) : null}
                </div>
              ))}
            </SnoopPage>
          ))}
        </SnoopForm>
        <div className="w-full max-w-3xl mx-auto text-[11px] text-slate-500 text-right mt-3">
          Questionnaire fourni par{" "}
          <a
            className="underline"
            href="https://www.swiss-poll.ch/"
            rel="noreferrer"
            target="_blank"
          >
            SwissPoll
          </a>
          , hébergé en Suisse
        </div>
      </div>
    </>
  );
}
