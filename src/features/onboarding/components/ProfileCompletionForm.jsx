import React from "react";

const ProfileCompletionForm = ({
  data,
  onChange,
  whatsapp,
  state,
  city,
  email,
}) => (
  <div className="space-y-4">
    <label className="block text-sm font-medium text-gray-700">
      Business Name
    </label>
    <input
      className="w-full border rounded px-3 py-2"
      value={data.businessName || ""}
      onChange={(e) => onChange({ ...data, businessName: e.target.value })}
      required
    />
    <label className="block text-sm font-medium text-gray-700">
      Mobile Number
    </label>
    <input
      className="w-full border rounded px-3 py-2 bg-gray-100"
      value={whatsapp}
      disabled
    />
    <label className="block text-sm font-medium text-gray-700">Location</label>
    <input
      className="w-full border rounded px-3 py-2 bg-gray-100"
      value={state + (city ? ", " + city : "")}
      disabled
    />
    <label className="block text-sm font-medium text-gray-700">
      Email Address
    </label>
    <input
      className="w-full border rounded px-3 py-2 bg-gray-100"
      value={email}
      disabled
    />
  </div>
);

export default ProfileCompletionForm;
