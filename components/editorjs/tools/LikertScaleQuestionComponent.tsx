/* eslint-disable react-hooks/exhaustive-deps */
import { TrashIcon } from "@heroicons/react/24/solid";
import { default as React } from "react";
import { v4 as uuidv4 } from "uuid";
import { classNames } from "../../../lib/utils";

const DEFAULT_INITIAL_DATA = () => {
  return {
    label: "",
    help: "",
    required: false,
    columns: [
      {
        id: uuidv4(),
        label: "",
      },
    ],
    rows: [
      {
        id: uuidv4(),
        label: "",
      },
    ],
  };
};

const LikertScaleQuestion = (props) => {
  const [choiceData, setChoiceData] = React.useState(
    props.data.columns.length > 0 || props.data.rows.length > 0
      ? props.data
      : DEFAULT_INITIAL_DATA
  );

  const updateData = (newData) => {
    setChoiceData(newData);
    if (props.onDataChange) {
      // Inform editorjs about data change
      props.onDataChange(newData);
    }
  };

  const onAddColumn = () => {
    const newData = {
      ...choiceData,
    };
    newData.columns.push({
      id: uuidv4(),
      label: "",
    });
    updateData(newData);
  };

  const onAddRow = () => {
    const newData = {
      ...choiceData,
    };
    newData.rows.push({
      id: uuidv4(),
      label: "",
    });
    updateData(newData);
  };

  const onDeleteColumn = (optionIdx) => {
    const newData = {
      ...choiceData,
    };
    newData.columns.splice(optionIdx, 1);
    updateData(newData);
  };

  const onDeleteRow = (optionIdx) => {
    const newData = {
      ...choiceData,
    };
    newData.rows.splice(optionIdx, 1);
    updateData(newData);
  };

  const onInputChange = (fieldName) => {
    return (e) => {
      const newData = {
        ...choiceData,
      };
      newData[fieldName] = e.currentTarget.value;
      updateData(newData);
    };
  };

  const onColumnChange = (index, fieldName) => {
    return (e) => {
      const newData = {
        ...choiceData,
      };
      newData.columns[index][fieldName] = e.currentTarget.value;
      updateData(newData);
    };
  };

  const onRowChange = (index, fieldName) => {
    return (e) => {
      const newData = {
        ...choiceData,
      };
      newData.rows[index][fieldName] = e.currentTarget.value;
      updateData(newData);
    };
  };

  return (
    <div className="pb-5">
      <div className="relative font-bold leading-7 text-gray-800 text-md sm:truncate">
        <input
          type="text"
          id="label"
          defaultValue={choiceData.label}
          onBlur={onInputChange("label")}
          className="w-full p-0 border-0 border-transparent ring-0 focus:ring-0 placeholder:text-gray-300"
          placeholder="Your Question"
        />
        {choiceData.required && (
          <div className="absolute inset-y-0 right-0 flex items-center pr-3 text-ui-green-500 pointer-events-none">
            *
          </div>
        )}
      </div>
      <input
        type="text"
        id="help-text"
        defaultValue={choiceData.help}
        onBlur={onInputChange("help")}
        className="block w-full max-w-sm p-0 mt-2 text-sm font-light text-gray-500 border-0 border-transparent ring-0 focus:ring-0 placeholder:text-gray-300"
        placeholder="optional help text"
      />
      <div className="mt-2 space-y-2">
        <table className="min-w-full divide-y divide-gray-300">
          <thead>
            <tr>
              <th
                scope="col"
                className="py-3.5 pl-4 pr-3 text-left text-sm font-semibold text-gray-900 sm:pl-0"
              ></th>
              {choiceData.columns.map((column, columnIdx) => (
                <th
                  key={`${column.label}-${columnIdx}`}
                  scope="col"
                  className="group px-3 py-3.5 text-left text-sm font-semibold text-gray-900"
                >
                  <div className="flex justify-between items-center">
                    <input
                      type="text"
                      defaultValue={column.label}
                      onBlur={onColumnChange(columnIdx, "label")}
                      className="w-full p-0 ml-3 font-medium text-gray-900 bg-transparent border-0 border-transparent outline-none focus:ring-0 focus:outline-none placeholder:text-gray-300"
                      placeholder={`Column ${columnIdx + 1}`}
                    />
                    {columnIdx !== 0 && (
                      <button
                        onClick={() => onDeleteColumn(columnIdx)}
                        className="invisible group-hover:visible"
                      >
                        <TrashIcon
                          className="w-5 h-5 text-ui-gray-medium"
                          aria-hidden="true"
                        />
                      </button>
                    )}
                  </div>
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {choiceData.rows.map((row, rowIdx) => (
              <tr key={`${row.label}-${rowIdx}`}>
                <td className="group whitespace-nowrap py-4 pl-4 pr-3 text-sm font-medium text-gray-900 sm:pl-0">
                  <div className="flex justify-between items-center">
                    <input
                      type="text"
                      defaultValue={row.label}
                      onBlur={onRowChange(rowIdx, "label")}
                      className="w-full p-0 ml-3 font-medium text-gray-900 bg-transparent border-0 border-transparent outline-none focus:ring-0 focus:outline-none placeholder:text-gray-300"
                      placeholder={`Row ${rowIdx + 1}`}
                    />
                    {rowIdx !== 0 && (
                      <button
                        onClick={() => onDeleteRow(rowIdx)}
                        className="invisible group-hover:visible"
                      >
                        <TrashIcon
                          className="w-5 h-5 text-ui-gray-medium"
                          aria-hidden="true"
                        />
                      </button>
                    )}
                  </div>
                </td>
                {choiceData.columns.map((column, columnIdx) => (
                  <td key={`${column.label}-${columnIdx}-${row.label}-${rowIdx}`} className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                    <span
                      className={classNames(
                        "rounded-full",
                        "flex items-center justify-center w-4 h-4 border border-gray-300"
                      )}
                      aria-hidden="true"
                    >
                      <span className="rounded-full  w-1.5 h-1.5" />
                    </span>
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <div className="relative z-0 flex mt-2">
        <button
          className="mr-3 justify-center mt-2 inline-flex items-center px-2.5 py-1.5 border border-gray-300 shadow-sm text-xs font-medium rounded text-gray-700 bg-white hover:bg-gray-50 focus:outline-none"
          onClick={onAddColumn}
        >
          Add column
        </button>
        <button
          className="mr-3 pl-3 justify-center mt-2 inline-flex items-center px-2.5 py-1.5 border border-gray-300 shadow-sm text-xs font-medium rounded text-gray-700 bg-white hover:bg-gray-50 focus:outline-none"
          onClick={onAddRow}
        >
          Add row
        </button>
      </div>
    </div>
  );
};

export default LikertScaleQuestion;
