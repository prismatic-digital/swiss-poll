/* This example requires Tailwind CSS v2.0+ */
import { Dialog, Switch, Transition } from "@headlessui/react";
import { Fragment, useEffect, useState } from "react";
import { TailSpin } from "react-loader-spinner";
import { persistNoCodeForm, useNoCodeForm } from "../../lib/noCodeForm";
import Loading from "../Loading";
import { XMarkIcon } from "@heroicons/react/24/outline";
import { toast } from "react-toastify";
import { classNames } from "../../lib/utils";
import { Listbox } from "@headlessui/react";
import { CheckIcon, ChevronUpDownIcon } from "@heroicons/react/20/solid";

const colors = [
  "red",
  "green",
  "pink",
  "purple",
  "blue",
  "teal",
  "amber",
  "orange",
  "yellow",
  "gray",
  "black",
  "slate",
];
const variants = [50, 100, 200, 300, 400, 500, 600, 700, 800, 900];

export default function SettingsModal({ open, setOpen, formId }) {
  const { noCodeForm, isLoadingNoCodeForm, mutateNoCodeForm } =
    useNoCodeForm(formId);
  const [loading, setLoading] = useState(false);
  const [textColorLoading, setTextColorLoading] = useState(false);
  const [backgroundColorLoading, setBackgroundColorLoading] = useState(false);
  const [buttonsColorLoading, setButtonsColorLoading] = useState(false);
  const [selectedTextColor, setSelectedTextColor] = useState(
    noCodeForm.textColor
  );
  const [selectedBgColor, setSelectedBgColor] = useState(
    noCodeForm.backgroundColor
  );
  const [selectedButtonColor, setSelectedButtonColor] = useState(
    noCodeForm.buttonsColor
  );

  useEffect(() => {
    setTextColorLoading(true);
    setTimeout(async () => {
      const newNoCodeForm = JSON.parse(JSON.stringify(noCodeForm));
      newNoCodeForm.textColor = selectedTextColor;
      await persistNoCodeForm(newNoCodeForm);
      mutateNoCodeForm(newNoCodeForm);
      setTextColorLoading(false);
    }, 500);
  }, [selectedTextColor]);

  useEffect(() => {
    setBackgroundColorLoading(true);
    setTimeout(async () => {
      const newNoCodeForm = JSON.parse(JSON.stringify(noCodeForm));
      newNoCodeForm.backgroundColor = selectedBgColor;
      await persistNoCodeForm(newNoCodeForm);
      mutateNoCodeForm(newNoCodeForm);
      setBackgroundColorLoading(false);
    }, 500);
  }, [selectedBgColor]);

  useEffect(() => {
    setButtonsColorLoading(true);
    setTimeout(async () => {
      const newNoCodeForm = JSON.parse(JSON.stringify(noCodeForm));
      newNoCodeForm.buttonsColor = selectedButtonColor;
      await persistNoCodeForm(newNoCodeForm);
      mutateNoCodeForm(newNoCodeForm);
      setButtonsColorLoading(false);
    }, 500);
  }, [selectedButtonColor]);

  const toggleClose = async () => {
    setLoading(true);
    setTimeout(async () => {
      const newNoCodeForm = JSON.parse(JSON.stringify(noCodeForm));
      newNoCodeForm.closed = !noCodeForm.closed;
      await persistNoCodeForm(newNoCodeForm);
      mutateNoCodeForm(newNoCodeForm);
      setLoading(false);
      toast(
        newNoCodeForm.closed
          ? "Your form is now closed for submissions "
          : "Your form is now open for submissions 🎉"
      );
    }, 500);
  };

  if (isLoadingNoCodeForm) {
    return <Loading />;
  }

  return (
    <Transition.Root show={open} as={Fragment}>
      <Dialog as="div" className="relative z-10" onClose={setOpen}>
        <Transition.Child
          as={Fragment}
          enter="ease-out duration-300"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave="ease-in duration-200"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <div className="fixed inset-0 transition-opacity bg-gray-500 bg-opacity-75" />
        </Transition.Child>

        <div className="fixed inset-0 z-10 overflow-y-auto">
          <div className="flex items-end justify-center min-h-full p-4 text-center sm:items-center sm:p-0">
            <Transition.Child
              as={Fragment}
              enter="ease-out duration-300"
              enterFrom="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
              enterTo="opacity-100 translate-y-0 sm:scale-100"
              leave="ease-in duration-200"
              leaveFrom="opacity-100 translate-y-0 sm:scale-100"
              leaveTo="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
            >
              <Dialog.Panel className="relative px-4 pt-5 pb-4 overflow-hidden text-left transition-all transform bg-white rounded-lg shadow-xl sm:max-w-4xl sm:w-full sm:p-6 h-screen">
                <div className="absolute top-0 right-0 hidden pt-4 pr-4 sm:block">
                  <button
                    type="button"
                    className="text-gray-400 bg-white rounded-md hover:text-gray-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-ui-green-500"
                    onClick={() => setOpen(false)}
                  >
                    <span className="sr-only">Close</span>
                    <XMarkIcon className="w-6 h-6" aria-hidden="true" />
                  </button>
                </div>
                <div className="px-4 py-5 sm:p-6">
                  <div className="mb-4">
                    <h1 className="text-2xl font-medium leading-6 text-gray-900">
                      Settings
                    </h1>
                  </div>
                  <h3 className="text-lg font-medium leading-6 text-gray-900">
                    Access
                  </h3>
                  <div className="w-full mt-2 text-sm text-gray-500">
                    <Switch.Group
                      as="div"
                      className="flex items-center justify-between w-full"
                    >
                      <span className="flex flex-col flex-grow">
                        <Switch.Label
                          as="span"
                          className="text-sm font-medium text-gray-900"
                          passive={true}
                        >
                          Close form for new submissions?
                        </Switch.Label>
                        <Switch.Description
                          as="span"
                          className="text-sm text-gray-500"
                        >
                          Your form is currently{" "}
                          <span className="font-bold">
                            {noCodeForm.closed ? "closed" : "open"}
                          </span>{" "}
                          for submissions.
                        </Switch.Description>
                      </span>
                      {loading ? (
                        <TailSpin color="#1f2937" height={30} width={30} />
                      ) : (
                        <Switch
                          checked={noCodeForm.closed}
                          onChange={() => toggleClose()}
                          className={classNames(
                            noCodeForm.closed
                              ? "bg-ui-green-600"
                              : "bg-gray-200",
                            "relative inline-flex flex-shrink-0 h-6 w-11 border-2 border-transparent rounded-full cursor-pointer transition-colors ease-in-out duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-ui-green-500"
                          )}
                        >
                          <span
                            aria-hidden="true"
                            className={classNames(
                              noCodeForm.closed
                                ? "translate-x-5"
                                : "translate-x-0",
                              "pointer-events-none inline-block h-5 w-5 rounded-full bg-white shadow transform ring-0 transition ease-in-out duration-200"
                            )}
                          />
                        </Switch>
                      )}
                    </Switch.Group>
                  </div>
                  <h3 className="text-lg font-medium leading-6 text-gray-900 mt-5">
                    Custom colors
                  </h3>
                  <div className="w-full mt-2 text-sm text-gray-500 flex flex-col gap-3">
                    <Listbox
                      value={selectedTextColor}
                      onChange={setSelectedTextColor}
                    >
                      {({ open }) => (
                        <div className="flex items-center justify-between">
                          <Listbox.Label className="block text-sm font-medium leading-6 text-gray-900">
                            Text Color
                            <p className="text-gray-500 font-normal">
                              The color will be applied on all texts in the form
                            </p>
                          </Listbox.Label>
                          {textColorLoading ? (
                            <TailSpin color="#1f2937" height={30} width={30} />
                          ) : (
                            <div className="relative w-1/3">
                              <Listbox.Button className="relative w-full cursor-default rounded-md bg-white py-1.5 pl-3 pr-10 text-left text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 focus:outline-none focus:ring-2 focus:ring-indigo-500 sm:text-sm sm:leading-6">
                                <span className="flex items-center">
                                  <span
                                    className={classNames(
                                      `bg-${selectedTextColor}`,
                                      "h-5 w-5 flex-shrink-0 rounded-full"
                                    )}
                                  ></span>
                                  <span className="ml-3 block truncate">
                                    {selectedTextColor}
                                  </span>
                                </span>
                                <span className="pointer-events-none absolute inset-y-0 right-0 ml-3 flex items-center pr-2">
                                  <ChevronUpDownIcon
                                    className="h-5 w-5 text-gray-400"
                                    aria-hidden="true"
                                  />
                                </span>
                              </Listbox.Button>

                              <Transition
                                show={open}
                                as={Fragment}
                                leave="transition ease-in duration-100"
                                leaveFrom="opacity-100"
                                leaveTo="opacity-0"
                              >
                                <Listbox.Options className="absolute z-10 mt-1 max-h-56 w-full overflow-auto rounded-md bg-white py-1 text-base shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none sm:text-sm">
                                  {colors.map((color) =>
                                    variants.map((variant) => (
                                      <Listbox.Option
                                        key={`${color}-${variant}`}
                                        className={({ active }) =>
                                          classNames(
                                            active
                                              ? "bg-indigo-600 text-white"
                                              : "text-gray-900",
                                            "relative cursor-default select-none py-2 pl-3 pr-9"
                                          )
                                        }
                                        value={`${color}-${variant}`}
                                      >
                                        {({ selected, active }) => (
                                          <>
                                            <div className="flex items-center">
                                              <span
                                                className={classNames(
                                                  `bg-${color}-${variant}`,
                                                  "h-5 w-5 flex-shrink-0 rounded-full"
                                                )}
                                              ></span>
                                              <span
                                                className={classNames(
                                                  selected
                                                    ? "font-semibold"
                                                    : "font-normal",
                                                  "ml-3 block truncate"
                                                )}
                                              >
                                                {`${color}-${variant}`}
                                              </span>
                                            </div>

                                            {selected ? (
                                              <span
                                                className={classNames(
                                                  active
                                                    ? "text-white"
                                                    : "text-indigo-600",
                                                  "absolute inset-y-0 right-0 flex items-center pr-4"
                                                )}
                                              >
                                                <CheckIcon
                                                  className="h-5 w-5"
                                                  aria-hidden="true"
                                                />
                                              </span>
                                            ) : null}
                                          </>
                                        )}
                                      </Listbox.Option>
                                    ))
                                  )}
                                </Listbox.Options>
                              </Transition>
                            </div>
                          )}
                        </div>
                      )}
                    </Listbox>
                    <Listbox
                      value={selectedBgColor}
                      onChange={setSelectedBgColor}
                    >
                      {({ open }) => (
                        <div className="flex items-center justify-between">
                          <Listbox.Label className="block text-sm font-medium leading-6 text-gray-900">
                            Background Color
                            <p className="text-gray-500 font-normal">
                              The color will be applied on the background of the
                              form
                            </p>
                          </Listbox.Label>
                          {backgroundColorLoading ? (
                            <TailSpin color="#1f2937" height={30} width={30} />
                          ) : (
                            <div className="relative w-1/3">
                              <Listbox.Button className="relative w-full cursor-default rounded-md bg-white py-1.5 pl-3 pr-10 text-left text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 focus:outline-none focus:ring-2 focus:ring-indigo-500 sm:text-sm sm:leading-6">
                                <span className="flex items-center">
                                  <span
                                    className={classNames(
                                      `bg-${selectedBgColor}`,
                                      selectedBgColor === "white"
                                        ? "border border-gray-200"
                                        : null,
                                      "h-5 w-5 flex-shrink-0 rounded-full"
                                    )}
                                  ></span>
                                  <span className="ml-3 block truncate">
                                    {selectedBgColor}
                                  </span>
                                </span>
                                <span className="pointer-events-none absolute inset-y-0 right-0 ml-3 flex items-center pr-2">
                                  <ChevronUpDownIcon
                                    className="h-5 w-5 text-gray-400"
                                    aria-hidden="true"
                                  />
                                </span>
                              </Listbox.Button>

                              <Transition
                                show={open}
                                as={Fragment}
                                leave="transition ease-in duration-100"
                                leaveFrom="opacity-100"
                                leaveTo="opacity-0"
                              >
                                <Listbox.Options className="absolute z-10 mt-1 max-h-56 w-full overflow-auto rounded-md bg-white py-1 text-base shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none sm:text-sm">
                                  <Listbox.Option
                                    key={`white`}
                                    className={({ active }) =>
                                      classNames(
                                        active
                                          ? "bg-indigo-600 text-white"
                                          : "text-gray-900",
                                        "relative cursor-default select-none py-2 pl-3 pr-9"
                                      )
                                    }
                                    value={`white`}
                                  >
                                    {({ selected, active }) => (
                                      <>
                                        <div className="flex items-center">
                                          <span
                                            className={classNames(
                                              `bg-white`,
                                              "h-5 w-5 flex-shrink-0 rounded-full border border-gray-200"
                                            )}
                                          ></span>
                                          <span
                                            className={classNames(
                                              selected
                                                ? "font-semibold"
                                                : "font-normal",
                                              "ml-3 block truncate"
                                            )}
                                          >
                                            {`white`}
                                          </span>
                                        </div>

                                        {selected ? (
                                          <span
                                            className={classNames(
                                              active
                                                ? "text-white"
                                                : "text-indigo-600",
                                              "absolute inset-y-0 right-0 flex items-center pr-4"
                                            )}
                                          >
                                            <CheckIcon
                                              className="h-5 w-5"
                                              aria-hidden="true"
                                            />
                                          </span>
                                        ) : null}
                                      </>
                                    )}
                                  </Listbox.Option>
                                  {colors.map((color) =>
                                    variants.map((variant) => (
                                      <Listbox.Option
                                        key={`${color}-${variant}`}
                                        className={({ active }) =>
                                          classNames(
                                            active
                                              ? "bg-indigo-600 text-white"
                                              : "text-gray-900",
                                            "relative cursor-default select-none py-2 pl-3 pr-9"
                                          )
                                        }
                                        value={`${color}-${variant}`}
                                      >
                                        {({ selected, active }) => (
                                          <>
                                            <div className="flex items-center">
                                              <span
                                                className={classNames(
                                                  `bg-${color}-${variant}`,
                                                  "h-5 w-5 flex-shrink-0 rounded-full"
                                                )}
                                              ></span>
                                              <span
                                                className={classNames(
                                                  selected
                                                    ? "font-semibold"
                                                    : "font-normal",
                                                  "ml-3 block truncate"
                                                )}
                                              >
                                                {`${color}-${variant}`}
                                              </span>
                                            </div>

                                            {selected ? (
                                              <span
                                                className={classNames(
                                                  active
                                                    ? "text-white"
                                                    : "text-indigo-600",
                                                  "absolute inset-y-0 right-0 flex items-center pr-4"
                                                )}
                                              >
                                                <CheckIcon
                                                  className="h-5 w-5"
                                                  aria-hidden="true"
                                                />
                                              </span>
                                            ) : null}
                                          </>
                                        )}
                                      </Listbox.Option>
                                    ))
                                  )}
                                </Listbox.Options>
                              </Transition>
                            </div>
                          )}
                        </div>
                      )}
                    </Listbox>
                    <Listbox
                      value={selectedButtonColor}
                      onChange={setSelectedButtonColor}
                    >
                      {({ open }) => (
                        <div className="flex items-center justify-between">
                          <Listbox.Label className="block text-sm font-medium leading-6 text-gray-900">
                            Buttons Color
                            <p className="text-gray-500 font-normal">
                              The color will be applied on all buttons
                            </p>
                          </Listbox.Label>
                          {buttonsColorLoading ? (
                            <TailSpin color="#1f2937" height={30} width={30} />
                          ) : (<div className="relative w-1/3">
                          <Listbox.Button className="relative w-full cursor-default rounded-md bg-white py-1.5 pl-3 pr-10 text-left text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 focus:outline-none focus:ring-2 focus:ring-indigo-500 sm:text-sm sm:leading-6">
                            <span className="flex items-center">
                              <span
                                className={classNames(
                                  `bg-${selectedButtonColor}`,
                                  "h-5 w-5 flex-shrink-0 rounded-full"
                                )}
                              ></span>
                              <span className="ml-3 block truncate">
                                {selectedButtonColor}
                              </span>
                            </span>
                            <span className="pointer-events-none absolute inset-y-0 right-0 ml-3 flex items-center pr-2">
                              <ChevronUpDownIcon
                                className="h-5 w-5 text-gray-400"
                                aria-hidden="true"
                              />
                            </span>
                          </Listbox.Button>

                          <Transition
                            show={open}
                            as={Fragment}
                            leave="transition ease-in duration-100"
                            leaveFrom="opacity-100"
                            leaveTo="opacity-0"
                          >
                            <Listbox.Options className="absolute z-10 mt-1 max-h-56 w-full overflow-auto rounded-md bg-white py-1 text-base shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none sm:text-sm">
                              {colors.map((color) =>
                                variants.map((variant) => (
                                  <Listbox.Option
                                    key={`${color}-${variant}`}
                                    className={({ active }) =>
                                      classNames(
                                        active
                                          ? "bg-indigo-600 text-white"
                                          : "text-gray-900",
                                        "relative cursor-default select-none py-2 pl-3 pr-9"
                                      )
                                    }
                                    value={`${color}-${variant}`}
                                  >
                                    {({ selected, active }) => (
                                      <>
                                        <div className="flex items-center">
                                          <span
                                            className={classNames(
                                              `bg-${color}-${variant}`,
                                              "h-5 w-5 flex-shrink-0 rounded-full"
                                            )}
                                          ></span>
                                          <span
                                            className={classNames(
                                              selected
                                                ? "font-semibold"
                                                : "font-normal",
                                              "ml-3 block truncate"
                                            )}
                                          >
                                            {`${color}-${variant}`}
                                          </span>
                                        </div>

                                        {selected ? (
                                          <span
                                            className={classNames(
                                              active
                                                ? "text-white"
                                                : "text-indigo-600",
                                              "absolute inset-y-0 right-0 flex items-center pr-4"
                                            )}
                                          >
                                            <CheckIcon
                                              className="h-5 w-5"
                                              aria-hidden="true"
                                            />
                                          </span>
                                        ) : null}
                                      </>
                                    )}
                                  </Listbox.Option>
                                ))
                              )}
                            </Listbox.Options>
                          </Transition>
                        </div>)}
                          
                        </div>
                      )}
                    </Listbox>
                  </div>
                </div>
              </Dialog.Panel>
            </Transition.Child>
          </div>
        </div>
      </Dialog>
    </Transition.Root>
  );
}
