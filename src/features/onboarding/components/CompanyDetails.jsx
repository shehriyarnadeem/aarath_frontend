import React from "react";

const CompanyDetails = ({ data, onChange }) => (
  <div className="space-y-4">
    <label className="block text-sm font-medium text-gray-700">
      Company Name
    </label>
    <input
      className="w-full border rounded px-3 py-2"
      value={data.companyName || ""}
      onChange={(e) => onChange({ ...data, companyName: e.target.value })}
      required
    />
    <label className="block text-sm font-medium text-gray-700">
      Business Address
    </label>
    <input
      className="w-full border rounded px-3 py-2"
      value={data.businessAddress || ""}
      onChange={(e) => onChange({ ...data, businessAddress: e.target.value })}
      required
    />
    <label className="block text-sm font-medium text-gray-700">
      Business Role
    </label>
    <input
      className="w-full border rounded px-3 py-2"
      value={data.businessRole || ""}
      onChange={(e) => onChange({ ...data, businessRole: e.target.value })}
      required
    />
    <label className="block text-sm font-medium text-gray-700">
      Company Picture
    </label>
    <input
      type="file"
      accept="image/*"
      onChange={(e) => onChange({ ...data, companyPicture: e.target.files[0] })}
      required
    />
  </div>
);

export default CompanyDetails;
