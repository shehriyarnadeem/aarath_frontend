import React from "react";

const PersonalDetails = ({ data, onChange }) => (
  <div className="space-y-4">
    <label className="block text-sm font-medium text-gray-700">Name</label>
    <input
      className="w-full border rounded px-3 py-2"
      value={data.name || ""}
      onChange={(e) => onChange({ ...data, name: e.target.value })}
      required
    />
    <label className="block text-sm font-medium text-gray-700">Location</label>
    <input
      className="w-full border rounded px-3 py-2"
      value={data.location || ""}
      onChange={(e) => onChange({ ...data, location: e.target.value })}
      required
    />
    <label className="block text-sm font-medium text-gray-700">
      Profile Picture
    </label>
    <input
      type="file"
      accept="image/*"
      onChange={(e) => onChange({ ...data, profilePicture: e.target.files[0] })}
      required
    />
  </div>
);

export default PersonalDetails;
