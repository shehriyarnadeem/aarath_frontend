import React, { useState } from "react";
import Button from "../../../components/Button";

const COUNTRY_CODES = [
  { code: "+92", label: "🇵🇰 +92" },
  { code: "+91", label: "🇮🇳 +91" },
  { code: "+1", label: "🇺🇸 +1" },
  // Add more as needed
];

const WhatsappVerification = ({
  value,
  onChange,
  onVerify,
  verified,
  loading,
}) => {
  const [countryCode, setCountryCode] = useState(COUNTRY_CODES[0].code);
  const [input, setInput] = useState(value ? value.replace(/^\+\d+/, "") : "");

  const handleInputChange = (e) => {
    setInput(e.target.value);
    onChange && onChange(countryCode + e.target.value);
  };

  const handleCountryChange = (e) => {
    setCountryCode(e.target.value);
    onChange && onChange(e.target.value + input);
  };

  return (
    <div className="space-y-4">
      <label className="block text-sm font-medium text-gray-700">
        WhatsApp Number
      </label>
      <div className="flex space-x-2">
        <select
          className="border rounded px-2 py-2 bg-white"
          value={countryCode}
          onChange={handleCountryChange}
          disabled={verified}
        >
          {COUNTRY_CODES.map((c) => (
            <option key={c.code} value={c.code}>
              {c.label}
            </option>
          ))}
        </select>
        <input
          type="tel"
          className="flex-1 border rounded px-3 py-2"
          placeholder="Enter WhatsApp number"
          value={input}
          onChange={handleInputChange}
          disabled={verified}
          pattern="[0-9]{7,15}"
        />
      </div>
      <Button
        onClick={() => onVerify(countryCode + input)}
        disabled={verified || loading}
        loading={loading}
      >
        {verified ? "Verified" : "Verify"}
      </Button>
      {verified && (
        <div className="text-green-600 text-sm">Number verified!</div>
      )}
    </div>
  );
};

export default WhatsappVerification;
