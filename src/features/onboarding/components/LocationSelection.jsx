import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { MapPin, ChevronDown } from "lucide-react";

// Pakistan states and cities data
const locationData = {
  Punjab: [
    "Lahore",
    "Karachi",
    "Faisalabad",
    "Rawalpindi",
    "Gujranwala",
    "Peshawar",
    "Multan",
    "Sialkot",
    "Sargodha",
    "Bahawalpur",
    "Jhang",
    "Sheikhupura",
    "Gujrat",
    "Sahiwal",
    "Kasur",
    "Okara",
    "Hafizabad",
    "Narowal",
    "Chiniot",
    "Mandi Bahauddin",
  ],
  Sindh: [
    "Karachi",
    "Hyderabad",
    "Sukkur",
    "Larkana",
    "Nawabshah",
    "Mirpur Khas",
    "Jacobabad",
    "Shikarpur",
    "Khairpur",
    "Dadu",
    "Badin",
    "Thatta",
    "Sanghar",
    "Tando Allahyar",
    "Tando Muhammad Khan",
    "Matiari",
    "Umerkot",
    "Tharparkar",
  ],
  "Khyber Pakhtunkhwa": [
    "Peshawar",
    "Mardan",
    "Abbottabad",
    "Kohat",
    "Bannu",
    "Swat",
    "Charsadda",
    "Nowshera",
    "Mansehra",
    "Dir",
    "Chitral",
    "Kurram",
    "Waziristan",
    "Karak",
    "Lakki Marwat",
    "Tank",
    "Hangu",
    "Orakzai",
  ],
  Balochistan: [
    "Quetta",
    "Gwadar",
    "Turbat",
    "Khuzdar",
    "Hub",
    "Chaman",
    "Zhob",
    "Sibi",
    "Loralai",
    "Mastung",
    "Kalat",
    "Pishin",
    "Killa Abdullah",
    "Nasirabad",
    "Jafarabad",
    "Dera Bugti",
    "Kohlu",
    "Barkhan",
  ],
  "Gilgit-Baltistan": [
    "Gilgit",
    "Skardu",
    "Hunza",
    "Ghanche",
    "Shigar",
    "Nagar",
    "Kharmang",
    "Roundu",
    "Gultari",
    "Danyore",
  ],
  "Azad Kashmir": [
    "Muzaffarabad",
    "Mirpur",
    "Rawalakot",
    "Palandri",
    "Kotli",
    "Bhimber",
    "Bagh",
    "Neelum",
    "Haveli",
    "Poonch",
  ],
};

const LocationSelection = ({
  selectedState,
  selectedCity,
  onStateSelect,
  onCitySelect,
}) => {
  const [availableCities, setAvailableCities] = useState([]);

  useEffect(() => {
    if (selectedState && locationData[selectedState]) {
      setAvailableCities(locationData[selectedState]);
      // Reset city selection when state changes
      if (selectedCity && !locationData[selectedState].includes(selectedCity)) {
        onCitySelect("");
      }
    } else {
      setAvailableCities([]);
    }
  }, [selectedState, selectedCity, onCitySelect]);

  return (
    <div className="space-y-8">
      <motion.div
        className="text-center"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        <h2 className="text-3xl font-bold text-gray-900 mb-4">
          Complete Your Profile
        </h2>
        <p className="text-lg text-gray-600 max-w-2xl mx-auto">
          Help us customize your experience by sharing your location
          information.
        </p>
      </motion.div>

      <div className="max-w-2xl mx-auto space-y-6">
        {/* State Selection */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
        >
          <label className="block text-sm font-medium text-gray-700 mb-2">
            <MapPin className="w-4 h-4 inline mr-2" />
            Select State/Province
          </label>
          <div className="relative">
            <select
              value={selectedState}
              onChange={(e) => onStateSelect(e.target.value)}
              className="input-field pr-10 appearance-none cursor-pointer"
            >
              <option value="">Choose your state/province</option>
              {Object.keys(locationData).map((state) => (
                <option key={state} value={state}>
                  {state}
                </option>
              ))}
            </select>
            <ChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5 pointer-events-none" />
          </div>
        </motion.div>

        {/* City Selection */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
        >
          <label className="block text-sm font-medium text-gray-700 mb-2">
            <MapPin className="w-4 h-4 inline mr-2" />
            Select City
          </label>
          <div className="relative">
            <select
              value={selectedCity}
              onChange={(e) => onCitySelect(e.target.value)}
              disabled={!selectedState}
              className={`input-field pr-10 appearance-none cursor-pointer ${
                !selectedState ? "bg-gray-100 cursor-not-allowed" : ""
              }`}
            >
              <option value="">
                {selectedState ? "Choose your city" : "Select state first"}
              </option>
              {availableCities.map((city) => (
                <option key={city} value={city}>
                  {city}
                </option>
              ))}
            </select>
            <ChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5 pointer-events-none" />
          </div>
        </motion.div>

        {/* Location Preview */}
        {selectedState && selectedCity && (
          <motion.div
            className="bg-primary-50 rounded-xl p-4 border border-primary-200"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.3 }}
          >
            <div className="flex items-center text-primary-700">
              <MapPin className="w-5 h-5 mr-2" />
              <span className="font-medium">
                {selectedCity}, {selectedState}, Pakistan
              </span>
            </div>
          </motion.div>
        )}
      </div>
    </div>
  );
};

export default LocationSelection;
