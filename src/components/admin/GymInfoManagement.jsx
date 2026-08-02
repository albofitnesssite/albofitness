import React, { useState, useEffect } from 'react';
import { supabase } from '../../services/supabase';
import { MapPin, Phone, Mail, Clock, Plus, Edit2, Trash2, Check, X, ExternalLink, Link as LinkIcon } from 'lucide-react';

export default function GymInfoManagement() {
  const [gymId, setGymId] = useState(null);
  const [locations, setLocations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  // Location form state
  const [editingLocationId, setEditingLocationId] = useState(null);
  const [locationForm, setLocationForm] = useState({
    name: '',
    address: '',
    phone: '',
    email: '',
    hours: '',
    maps_link: '',
    is_main: false
  });

  useEffect(() => {
    fetchGymInfo();
  }, []);

  // ==========================================
  // FETCH GYM INFO (to get gymId and locations array)
  // ==========================================
  const fetchGymInfo = async () => {
    setLoading(true);
    const { data, error } = await supabase.from('gym_info').select('*').limit(1);
    
    if (error) {
      console.error(error);
      setLoading(false);
      return;
    }
    
    if (data && data.length > 0) {
      const row = data[0];
      setGymId(row.id);
      setLocations(row.locations || []);
    }
    setLoading(false);
  };

  // ==========================================
  // LOCATION FORM HANDLERS
  // ==========================================
  const resetLocationForm = () => {
    setLocationForm({
      name: '', address: '', phone: '', email: '', hours: '', maps_link: '', is_main: false
    });
    setEditingLocationId(null);
  };

  const startEditLocation = (loc) => {
    setEditingLocationId(loc.id);
    setLocationForm({
      name: loc.name || '',
      address: loc.address || '',
      phone: loc.phone || '',
      email: loc.email || '',
      hours: loc.hours || '',
      maps_link: loc.maps_link || '',
      is_main: loc.is_main || false
    });
  };

  const saveLocation = async () => {
    if (!locationForm.name.trim()) return alert('⚠️ Location name is required');
    if (!locationForm.address.trim()) return alert('⚠️ Address is required');

    // Auto-generate Google Maps link if not provided
    let mapsLink = locationForm.maps_link.trim();
    if (!mapsLink) {
      mapsLink = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(locationForm.address.trim())}`;
    }

    const newLocation = {
      id: editingLocationId || Date.now(), // Use timestamp as unique ID for new locations
      name: locationForm.name.trim(),
      address: locationForm.address.trim(),
      phone: locationForm.phone.trim(),
      email: locationForm.email.trim(),
      hours: locationForm.hours.trim(),
      maps_link: mapsLink,
      is_main: locationForm.is_main
    };

    // Update the locations array
    let updatedLocations;
    if (editingLocationId) {
      updatedLocations = locations.map(loc => loc.id === editingLocationId ? newLocation : loc);
    } else {
      updatedLocations = [...locations, newLocation];
    }

    // Update local state immediately for responsive UI
    setLocations(updatedLocations);
    setSaving(true);

    const payload = {
      locations: updatedLocations,
      updated_at: new Date()
    };

    if (gymId) {
      // Update existing row
      const { error } = await supabase.from('gym_info').update(payload).eq('id', gymId);
      if (error) {
        alert('❌ Error saving location: ' + error.message);
        setSaving(false);
        return;
      }
      alert('✅ Location saved successfully!');
    } else {
      // Insert new row if it doesn't exist yet
      const { error, data } = await supabase.from('gym_info').insert([payload]).select();
      if (error) {
        alert('❌ Error: ' + error.message);
        setSaving(false);
        return;
      }
      if (data && data.length > 0) {
        setGymId(data[0].id); // Save the new ID for future updates
      }
      alert('✅ Location added successfully!');
    }

    setSaving(false);
    resetLocationForm();
  };

  const deleteLocation = async (locId) => {
    if (!window.confirm('🗑️ Delete this location?')) return;

    const updatedLocations = locations.filter(loc => loc.id !== locId);
    setLocations(updatedLocations);
    setSaving(true);

    const payload = {
      locations: updatedLocations,
      updated_at: new Date()
    };

    if (gymId) {
      const { error } = await supabase.from('gym_info').update(payload).eq('id', gymId);
      if (error) {
        alert('❌ Error: ' + error.message);
        setSaving(false);
        return;
      }
      alert('✅ Location deleted!');
    }
    setSaving(false);
  };

  const openInMaps = (loc) => {
    const url = loc.maps_link || `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(loc.address)}`;
    window.open(url, '_blank');
  };

  if (loading) {
    return <div className="text-center py-10 text-gray-400">Loading locations...</div>;
  }

  return (
    <div className="space-y-8">
      {/* ========================================== */}
      {/* ADD / EDIT LOCATION FORM                   */}
      {/* ========================================== */}
      <div className="bg-gray-900 p-6 rounded-lg border-2 border-orange-600/30">
        <h2 className="text-2xl font-black mb-6 text-orange-500 uppercase flex items-center gap-2">
          {editingLocationId ? <><Edit2 size={24} /> Edit Location</> : <><Plus size={24} /> Add New Location</>}
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <input
            type="text"
            placeholder="Location Name (e.g., Downtown Branch)"
            value={locationForm.name}
            onChange={(e) => setLocationForm({ ...locationForm, name: e.target.value })}
            className="p-3 bg-gray-800 text-white border-2 border-gray-700 rounded-lg focus:outline-none focus:border-orange-500 placeholder-gray-500 font-semibold"
          />
          <input
            type="text"
            placeholder="Full Address"
            value={locationForm.address}
            onChange={(e) => setLocationForm({ ...locationForm, address: e.target.value })}
            className="p-3 bg-gray-800 text-white border-2 border-gray-700 rounded-lg focus:outline-none focus:border-orange-500 placeholder-gray-500 font-semibold"
          />
          <input
            type="text"
            placeholder="Phone Number"
            value={locationForm.phone}
            onChange={(e) => setLocationForm({ ...locationForm, phone: e.target.value })}
            className="p-3 bg-gray-800 text-white border-2 border-gray-700 rounded-lg focus:outline-none focus:border-orange-500 placeholder-gray-500 font-semibold"
          />
          <input
            type="email"
            placeholder="Location Email"
            value={locationForm.email}
            onChange={(e) => setLocationForm({ ...locationForm, email: e.target.value })}
            className="p-3 bg-gray-800 text-white border-2 border-gray-700 rounded-lg focus:outline-none focus:border-orange-500 placeholder-gray-500 font-semibold"
          />
          <input
            type="text"
            placeholder="Opening Hours (e.g., Mon-Sat 6AM-10PM)"
            value={locationForm.hours}
            onChange={(e) => setLocationForm({ ...locationForm, hours: e.target.value })}
            className="p-3 bg-gray-800 text-white border-2 border-gray-700 rounded-lg focus:outline-none focus:border-orange-500 placeholder-gray-500 font-semibold"
          />
          <div className="relative">
            <LinkIcon className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" size={18} />
            <input
              type="text"
              placeholder="Google Maps Link (auto-generated if empty)"
              value={locationForm.maps_link}
              onChange={(e) => setLocationForm({ ...locationForm, maps_link: e.target.value })}
              className="p-3 pl-10 bg-gray-800 text-white border-2 border-gray-700 rounded-lg focus:outline-none focus:border-orange-500 placeholder-gray-500 font-semibold"
            />
          </div>
          
          <label className="flex items-center gap-3 cursor-pointer md:col-span-2 p-3 bg-gray-800 rounded-lg border-2 border-gray-700 hover:border-orange-500/50 transition">
            <input
              type="checkbox"
              checked={locationForm.is_main}
              onChange={(e) => setLocationForm({ ...locationForm, is_main: e.target.checked })}
              className="w-5 h-5 rounded bg-gray-700 border-gray-600 text-orange-500 focus:ring-orange-500"
            />
            <span className="text-white font-bold">Mark as Main/Headquarters Location</span>
          </label>
        </div>

        <div className="flex gap-3 mt-4">
          <button
            onClick={saveLocation}
            disabled={saving}
            className="flex-1 bg-orange-500 text-black py-3 rounded-lg hover:bg-orange-300 transition-all font-black uppercase flex items-center justify-center gap-2 disabled:opacity-50"
          >
            <Check size={18} />
            {saving ? 'Saving...' : (editingLocationId ? 'Update Location' : 'Add Location')}
          </button>
          {editingLocationId && (
            <button
              onClick={resetLocationForm}
              className="px-6 bg-gray-700 text-white py-3 rounded-lg hover:bg-gray-600 transition-all font-black uppercase flex items-center gap-2"
            >
              <X size={18} /> Cancel
            </button>
          )}
        </div>
      </div>

      {/* ========================================== */}
      {/* EXISTING LOCATIONS LIST                    */}
      {/* ========================================== */}
      <div className="bg-gray-900 p-6 rounded-lg border-2 border-gray-800">
        <h2 className="text-2xl font-black mb-6 text-orange-500 uppercase flex items-center gap-2">
          <MapPin size={24} /> All Locations ({locations.length})
        </h2>

        {locations.length === 0 ? (
          <div className="text-center py-10 text-gray-500">No locations added yet. Add your first location above!</div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {locations.map((loc) => (
              <div
                key={loc.id}
                className="relative bg-gradient-to-br from-gray-800 to-gray-900 rounded-xl border-2 border-gray-700 hover:border-orange-500/50 transition-all p-5 group"
              >
                {/* Main Badge */}
                {loc.is_main && (
                  <div className="absolute -top-2 -right-2 bg-orange-500 text-black text-[10px] font-black px-3 py-1 rounded-full uppercase tracking-wider shadow-lg">
                    Main
                  </div>
                )}

                <h3 className="text-xl font-black text-white mb-3 group-hover:text-orange-500 transition-colors">
                  {loc.name}
                </h3>

                <div className="space-y-2 mb-4">
                  {loc.address && (
                    <div className="flex items-start gap-2 text-sm">
                      <MapPin size={16} className="text-orange-500 mt-0.5 flex-shrink-0" />
                      <span className="text-gray-300">{loc.address}</span>
                    </div>
                  )}
                  {loc.phone && (
                    <div className="flex items-center gap-2 text-sm">
                      <Phone size={16} className="text-orange-500 flex-shrink-0" />
                      <span className="text-gray-300">{loc.phone}</span>
                    </div>
                  )}
                  {loc.email && (
                    <div className="flex items-center gap-2 text-sm">
                      <Mail size={16} className="text-orange-500 flex-shrink-0" />
                      <span className="text-gray-300 break-all">{loc.email}</span>
                    </div>
                  )}
                  {loc.hours && (
                    <div className="flex items-start gap-2 text-sm">
                      <Clock size={16} className="text-orange-500 mt-0.5 flex-shrink-0" />
                      <span className="text-gray-300">{loc.hours}</span>
                    </div>
                  )}
                </div>

                <div className="flex gap-2 pt-3 border-t border-gray-700">
                  <button
                    onClick={() => openInMaps(loc)}
                    className="flex-1 bg-orange-500 hover:bg-orange-300 text-black py-2 rounded-lg font-bold text-sm uppercase flex items-center justify-center gap-2 transition-all"
                  >
                    <ExternalLink size={16} />
                    Open in Maps
                  </button>
                  <button
                    onClick={() => startEditLocation(loc)}
                    className="bg-blue-600 hover:bg-blue-500 text-white p-2 rounded-lg transition-all"
                    title="Edit"
                  >
                    <Edit2 size={16} />
                  </button>
                  <button
                    onClick={() => deleteLocation(loc.id)}
                    className="bg-red-600 hover:bg-red-500 text-white p-2 rounded-lg transition-all"
                    title="Delete"
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}