/* This example requires Tailwind CSS v2.0+ */
import { Dialog, Switch, Transition } from "@headlessui/react";
import { Fragment, useEffect, useState } from "react";
import { TailSpin } from "react-loader-spinner";
import { persistNoCodeForm, useNoCodeForm } from "../../lib/noCodeForm";
import Loading from "../Loading";
import { XMarkIcon } from "@heroicons/react/24/outline";
import { toast } from "react-toastify";
import { classNames } from "../../lib/utils";
import ColorPicker from "./ColorPicker";
import React from "react";

export default function SettingsModal({ open, setOpen, formId }) {
  const { noCodeForm, isLoadingNoCodeForm, mutateNoCodeForm } =
    useNoCodeForm(formId);
  const [loading, setLoading] = useState(false);
  const [textColorLoading, setTextColorLoading] = useState(false);
  const [backgroundColorLoading, setBackgroundColorLoading] = useState(false);
  const [buttonsColorLoading, setButtonsColorLoading] = useState(false);
  const [chartColorsLoading, setChartColorsLoading] = useState(false);
  const [selectedTextColor, setSelectedTextColor] = useState(
    noCodeForm.textColor
  );
  const [selectedBgColor, setSelectedBgColor] = useState(
    noCodeForm.backgroundColor
  );
  const [selectedButtonColor, setSelectedButtonColor] = useState(
    noCodeForm.buttonsColor
  );

  const [chartColorsObject, setChartColorsObject] = useState(
    noCodeForm.chartColors.colors
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

  useEffect(() => {
    setChartColorsLoading(true);
    setTimeout(async () => {
      const newNoCodeForm = JSON.parse(JSON.stringify(noCodeForm));
      newNoCodeForm.chartColors = { colors: chartColorsObject };
      await persistNoCodeForm(newNoCodeForm);
      mutateNoCodeForm(newNoCodeForm);
      setChartColorsLoading(false);
    }, 500);
  }, [chartColorsObject]);

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

  const handleChartColorChanged = (color) => {
    const obj = color.split("-");
    let newChartColors = [...chartColorsObject];
    newChartColors[obj[1]] = obj[0];
    setChartColorsObject(newChartColors);
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
              <Dialog.Panel className="relative px-4 pt-5 pb-4 overflow-scroll text-left transition-all transform bg-white rounded-lg shadow-xl sm:max-w-4xl sm:w-full sm:p-6 h-screen">
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
                  <h3 className="text-xl mt-8 font-medium leading-6 text-gray-900">
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
                  <h3 className="text-xl mt-8 font-medium leading-6 text-gray-900">
                    Custom colors
                  </h3>
                  <div className="w-full mt-2 text-sm text-gray-500 flex flex-col gap-3">
                    <div className="flex items-center justify-between">
                      <div className="block text-sm font-medium leading-6 text-gray-900">
                        Text Color
                        <p className="text-gray-500 font-normal">
                          The color will be applied to all texts in the form
                        </p>
                      </div>
                      {textColorLoading ? (
                        <TailSpin color="#1f2937" height={30} width={30} />
                      ) : (
                        <ColorPicker
                          selectedColor={selectedTextColor}
                          setSelectedColor={setSelectedTextColor}
                        />
                      )}
                    </div>

                    <div className="flex items-center justify-between">
                      <div className="block text-sm font-medium leading-6 text-gray-900">
                        Background Color
                        <p className="text-gray-500 font-normal">
                          The color will be applied to the background of the
                          form
                        </p>
                      </div>
                      {backgroundColorLoading ? (
                        <TailSpin color="#1f2937" height={30} width={30} />
                      ) : (
                        <ColorPicker
                          selectedColor={selectedBgColor}
                          setSelectedColor={setSelectedBgColor}
                        />
                      )}
                    </div>

                    <div className="flex items-center justify-between">
                      <div className="block text-sm font-medium leading-6 text-gray-900">
                        Buttons Color
                        <p className="text-gray-500 font-normal">
                          The color will be applied to all buttons
                        </p>
                      </div>
                      {buttonsColorLoading ? (
                        <TailSpin color="#1f2937" height={30} width={30} />
                      ) : (
                        <ColorPicker
                          selectedColor={selectedButtonColor}
                          setSelectedColor={setSelectedButtonColor}
                        />
                      )}
                    </div>
                  </div>
                  <h3 className="text-xl mt-8 font-medium leading-6 text-gray-900">
                    Answers colors
                  </h3>
                  <div className="w-full mt-2 text-sm text-gray-500 flex flex-col gap-3">
                    {chartColorsObject.map((selectedColor, index) => (
                      <div
                        key={index}
                        className="flex items-center justify-between"
                      >
                        <div className="block text-sm font-medium leading-6 text-gray-900">
                          Answer {index + 1}
                        </div>
                        {chartColorsLoading ? (
                          <TailSpin color="#1f2937" height={30} width={30} />
                        ) : (
                          <ColorPicker
                            selectedColor={selectedColor}
                            setSelectedColor={handleChartColorChanged}
                            index={index}
                          />
                        )}
                      </div>
                    ))}
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
