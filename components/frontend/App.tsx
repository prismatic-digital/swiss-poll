import {
  GlobeAltIcon,
  EnvelopeIcon,
  PhoneIcon,
} from "@heroicons/react/24/solid";
import { SnoopElement, SnoopForm, SnoopPage } from "@snoopforms/react";
import { useMemo, useRef, useState } from "react";
import { generateId } from "../../lib/utils";
import Loading from "../Loading";
import ResultsSummary from "../results/ResultsSummary";

export default function App({ id = "", formId, blocks, localOnly = false }) {
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
  };

  return (
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
                  <p className="ce-paragraph">{block.data.text}</p>
                ) : block.type === "header" ? (
                  block.data.level === 1 ? (
                    <h1 className="ce-header">{block.data.text}</h1>
                  ) : block.level === 2 ? (
                    <h2 className="ce-header">{block.data.text}</h2>
                  ) : block.data.level === 3 ? (
                    <h3 className="ce-header">{block.data.text}</h3>
                  ) : null
                ) : block.type === "textQuestion" ? (
                  <SnoopElement
                    type="text"
                    name={block.id}
                    label={block.data.label}
                    help={block.data.help}
                    placeholder={block.data.placeholder}
                    classNames={{
                      label:
                        "mt-4 mb-2 block text-lg font-bold leading-7 text-gray-800",
                    }}
                    required={block.data.required}
                  />
                ) : block.type === "textareaQuestion" ? (
                  <SnoopElement
                    type="textarea"
                    rows={4}
                    name={block.id}
                    label={block.data.label}
                    help={block.data.help}
                    placeholder={block.data.placeholder}
                    classNames={{
                      label:
                        "mt-4 mb-2 block text-lg font-bold leading-7 text-gray-800",
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
                      label:
                        "mt-4 mb-2 block text-lg font-bold leading-7 text-gray-800",
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
                      label:
                        "mt-4 mb-2 block text-lg font-bold leading-7 text-gray-800",
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
                      label:
                        "mt-4 mb-2 block text-lg font-bold leading-7 text-gray-800",
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
                      label:
                        "mt-4 mb-2 block text-lg font-bold leading-7 text-gray-800",
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
                      label:
                        "mt-4 mb-2 block text-lg font-bold leading-7 text-gray-800",
                    }}
                    required={block.data.required}
                  />
                ) : block.type === "submitButton" ? (
                  // <SnoopElement
                  //   name="submit"
                  //   type="submit"
                  //   label={block.data.label}
                  //   classNames={{
                  //     button:
                  //       "inline-flex items-center px-4 py-3 text-sm font-medium text-white bg-gray-700 border border-transparent rounded-md shadow-sm hover:bg-gray-900 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500 focus:opacity-50",
                  //   }}
                  //   onClick={}
                  // />
                  <>
                    <button ref={submitButton} type="submit" className="hidden">Submit</button>
                    <button
                      disabled={loading}
                      onClick={handleSubmit}
                      type="submit"
                      className="inline-flex items-center px-4 py-3 text-sm font-medium leading-4 text-white border border-transparent rounded-md shadow-sm bg-slate-600 hover:bg-slate-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-slate-500 disabled:opacity-70"
                    >
                      {loading && (
                        <svg
                          className="animate-spin -ml-1 mr-3 h-4 w-4 text-white"
                          xmlns="http://www.w3.org/2000/svg"
                          fill="none"
                          viewBox="0 0 24 24"
                        >
                          <circle
                            className="opacity-25"
                            cx="12"
                            cy="12"
                            r="10"
                            stroke="currentColor"
                            strokeWidth="4"
                          ></circle>
                          <path
                            className="opacity-75"
                            fill="currentColor"
                            d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                          ></path>
                        </svg>
                      )}
                      {block.data.label || "Submit"}
                    </button>
                  </>
                ) : block.type === "websiteQuestion" ? (
                  <SnoopElement
                    type="website"
                    name={block.id}
                    label={block.data.label}
                    help={block.data.help}
                    placeholder={block.data.placeholder}
                    icon={<GlobeAltIcon className="w-5 h-5" />}
                    classNames={{
                      label:
                        "mt-4 mb-2 block text-lg font-bold leading-7 text-gray-800",
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
    </div>
  );
}
