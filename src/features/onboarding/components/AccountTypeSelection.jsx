import React from "react";
import Button from "../../../components/Button";

const AccountTypeSelection = ({ value, onChange }) => {
  return (
    <div className="space-y-4">
      <label className="block text-sm font-medium text-gray-700">
        Register as
      </label>
      <div className="flex space-x-4">
        <Button
          variant={value === "personal" ? "primary" : "outline"}
          onClick={() => onChange("personal")}
        >
          Personal Account
        </Button>
        <Button
          variant={value === "company" ? "primary" : "outline"}
          onClick={() => onChange("company")}
        >
          Company
        </Button>
      </div>
    </div>
  );
};

export default AccountTypeSelection;
