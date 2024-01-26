import React from "react";
import { classNames } from "../../lib/utils";

interface NavItem {
  id: string;
  onClick: () => void;
  Icon?: React.ElementType;
  label?: string;
  disabled?: boolean;
}

interface Props {
  navItems: NavItem[];
  currentItemId?: string;
}

// button component, consuming props
const SecondNavBar: React.FC<Props> = ({ navItems, currentItemId }) => {
  return (
    <div className="flex items-center justify-center flex-shrink-0 border-b border-ui-gray-light bg-ui-gray-lighter">
      <nav className="flex space-x-10" aria-label="resultModes">
        {navItems.map((navItem) => (
          <button
            key={navItem.id}
            className={classNames(
              `h-16 text-xs border-b-2 border-transparent`,
              !navItem.disabled &&
                (navItem.id === currentItemId
                  ? "text-ui-green border-b-2 border-ui-green"
                  : "hover:border-gray-300 text-ui-gray-dark hover:text-ui-green bg-transparent"),
              navItem.disabled
                ? "text-ui-gray-medium"
                : "hover:border-b-2 hover:border-ui-green text-ui-gray-dark hover:text-ui-green"
            )}
            onClick={navItem.onClick}
            disabled={navItem.disabled}
          >
            {navItem.Icon && (
              <navItem.Icon className="w-6 h-6 mx-auto mb-1 stroke-1" />
            )}
            {navItem.label}
          </button>
        ))}
      </nav>
    </div>
  );
};

export default SecondNavBar;
