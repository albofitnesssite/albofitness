import React, { useState, useEffect } from "react";
import { supabase } from "../../services/supabase";
import { Trash2, Edit2, Check, X, Plus, Upload } from "lucide-react";

// ==========================================
// 🚨 CLOUDINARY CONFIGURATION (REQUIRED) 🚨
// ==========================================
const CLOUDINARY_CLOUD_NAME = "n5k5jptm"; 
const CLOUDINARY_UPLOAD_PRESET = "albofitness"; 

export default function TrainerManagement() {
  const emptyTrainer = {
    name: "",
    photo_url: "",
    specialization: "",
    experience_years: "",
    clients: "", // ✅ ADDED CLIENTS FIELD
    certifications: [""],
    bio: "",
  };

  const [trainers, setTrainers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [editUploading, setEditUploading] = useState(false);

  const [newTrainer, setNewTrainer] = useState(emptyTrainer);
  const [editingId, setEditingId] = useState(null);
  const [editingData, setEditingData] = useState(emptyTrainer);

  useEffect(() => {
    fetchTrainers();
  }, []);

  // ==========================================
  // CLOUDINARY UPLOAD LOGIC
  // ==========================================
  const uploadToCloudinary = async (file) => {
    const formData = new FormData();
    formData.append("file", file);
    formData.append("upload_preset", CLOUDINARY_UPLOAD_PRESET);

    try {
      const response = await fetch(
        `https://api.cloudinary.com/v1_1/${CLOUDINARY_CLOUD_NAME}/image/upload`,
        { method: "POST", body: formData }
      );
      const data = await response.json();
      if (data.secure_url) return data.secure_url;
      throw new Error(data.error?.message || "Upload failed");
    } catch (error) {
      alert("❌ Failed to upload image: " + error.message);
      return null;
    }
  };

  const handleFileChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setUploading(true);
    const url = await uploadToCloudinary(file);
    if (url) setNewTrainer({ ...newTrainer, photo_url: url });
    setUploading(false);
  };

  const handleEditFileChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setEditUploading(true);
    const url = await uploadToCloudinary(file);
    if (url) setEditingData({ ...editingData, photo_url: url });
    setEditUploading(false);
  };

  // ==========================================
  // DATABASE OPERATIONS
  // ==========================================
  async function fetchTrainers() {
    setLoading(true);
    const { data, error } = await supabase.from("trainers").select("*").order("id", { ascending: true });
    setLoading(false);
    if (error) { console.error(error); alert(error.message); return; }
    setTrainers(data || []);
  }

  async function addTrainer() {
    if (!newTrainer.name.trim()) { alert("Trainer name is required."); return; }
    setSaving(true);
    
    const payload = {
      name: newTrainer.name,
      photo_url: newTrainer.photo_url,
      specialization: newTrainer.specialization,
      experience_years: parseInt(newTrainer.experience_years) || 0,
      clients: newTrainer.clients || "0", // ✅ ADDED TO PAYLOAD
      certifications: newTrainer.certifications.filter((x) => x.trim() !== "").join(", "),
      bio: newTrainer.bio,
    };

    const { error } = await supabase.from("trainers").insert([payload]);
    setSaving(false);
    if (error) { alert(error.message); return; }
    
    setNewTrainer(emptyTrainer);
    fetchTrainers();
  }

  function startEdit(trainer) {
    setEditingId(trainer.id);
    setEditingData({
      name: trainer.name || "",
      photo_url: trainer.photo_url || "",
      specialization: trainer.specialization || "",
      experience_years: trainer.experience_years || "",
      clients: trainer.clients || "", // ✅ ADDED TO EDIT STATE
      bio: trainer.bio || "",
      certifications: trainer.certifications ? trainer.certifications.split(",").map((x) => x.trim()) : [""],
    });
  }

  async function saveEdit() {
    if (!editingId) { alert("⚠️ No trainer selected to edit."); return; }
    setSaving(true);

    const certsArray = Array.isArray(editingData.certifications) ? editingData.certifications : [];
    const payload = {
      name: editingData.name?.trim() || "",
      photo_url: editingData.photo_url?.trim() || "",
      specialization: editingData.specialization?.trim() || "",
      experience_years: parseInt(editingData.experience_years) || 0,
      clients: editingData.clients?.trim() || "0", // ✅ ADDED TO SAVE PAYLOAD
      certifications: certsArray.filter((x) => x && x.trim() !== "").join(", "),
      bio: editingData.bio?.trim() || "",
    };

    const { data, error } = await supabase.from("trainers").update(payload).eq("id", editingId).select();
    setSaving(false);

    if (error) { console.error("❌ Supabase Update Error:", error); alert("❌ Failed to save: " + error.message); return; }
    if (!data || data.length === 0) { alert("⚠️ Supabase blocked the update! Check RLS policies."); return; }

    alert("✅ Changes saved successfully!");
    setEditingId(null);
    setEditingData(emptyTrainer);
    fetchTrainers();
  }

  async function deleteTrainer(id) {
    if (!window.confirm("Delete this trainer?")) return;
    const { data, error } = await supabase.from("trainers").delete().eq("id", id).select();
    if (error) { alert("❌ Failed to delete: " + error.message); return; }
    if (!data || data.length === 0) { alert("⚠️ Supabase blocked the delete! Check RLS policies."); return; }
    alert("✅ Trainer deleted!");
    fetchTrainers();
  }

  // ==========================================
  // UI HELPERS
  // ==========================================
  function renderCertifications(data, setter) {
    return (
      <div className="col-span-2">
        <label className="block text-orange-500 font-bold mb-2">Certifications</label>
        {data.certifications.map((cert, index) => (
          <div key={index} className="flex gap-2 mb-2">
            <input
              value={cert}
              placeholder={`Certification ${index + 1}`}
              className="flex-1 p-3 bg-gray-800 border border-gray-700 rounded-lg text-white"
              onChange={(e) => {
                const arr = [...data.certifications];
                arr[index] = e.target.value;
                setter({ ...data, certifications: arr });
              }}
            />
            {index === data.certifications.length - 1 && (
              <button type="button" onClick={() => setter({ ...data, certifications: [...data.certifications, ""] })} className="bg-orange-500 text-black px-3 rounded-lg">
                <Plus size={18} />
              </button>
            )}
            {data.certifications.length > 1 && (
              <button type="button" onClick={() => {
                const arr = data.certifications.filter((_, i) => i !== index);
                setter({ ...data, certifications: arr });
              }} className="bg-red-600 text-white px-3 rounded-lg">
                <X size={18} />
              </button>
            )}
          </div>
        ))}
      </div>
    );
  }

  const renderImageUpload = (isEditing) => {
    const isUploading = isEditing ? editUploading : uploading;
    const photoUrl = isEditing ? editingData.photo_url : newTrainer.photo_url;
    const handleFile = isEditing ? handleEditFileChange : handleFileChange;
    const removePhoto = () => {
      if (isEditing) setEditingData({ ...editingData, photo_url: "" });
      else setNewTrainer({ ...newTrainer, photo_url: "" });
    };

    return (
      <div className="col-span-2">
        <label className="block text-orange-500 font-bold mb-2">Trainer Photo</label>
        <div className="flex items-center gap-4">
          <label className={`cursor-pointer px-4 py-3 rounded-lg flex items-center gap-2 transition font-bold ${isUploading ? "bg-gray-600 text-gray-400 cursor-not-allowed" : "bg-gray-700 hover:bg-gray-600 text-white"}`}>
            <Upload size={18} />
            {isUploading ? "Uploading..." : isEditing ? "Change Image" : "Choose Image"}
            <input type="file" accept="image/*" className="hidden" onChange={handleFile} disabled={isUploading} />
          </label>
          {photoUrl && (
            <div className="relative group">
              <img src={photoUrl} alt="Preview" className="w-16 h-16 rounded-lg object-cover border-2 border-orange-500" />
              <button type="button" onClick={removePhoto} className="absolute -top-2 -right-2 bg-red-600 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition">
                <X size={12} />
              </button>
            </div>
          )}
        </div>
      </div>
    );
  };

  return (
    <div className="space-y-8">
      {/* ================= ADD TRAINER ================= */}
      <div className="bg-gray-900 border-2 border-gray-800 rounded-xl p-6">
        <h2 className="text-2xl font-black text-orange-500 uppercase mb-6">Add Trainer</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <input type="text" placeholder="Trainer Name" className="p-3 rounded-lg bg-gray-800 text-white border border-gray-700" value={newTrainer.name} onChange={(e) => setNewTrainer({ ...newTrainer, name: e.target.value })} />
          <input type="text" placeholder="Specialization" className="p-3 rounded-lg bg-gray-800 text-white border border-gray-700" value={newTrainer.specialization} onChange={(e) => setNewTrainer({ ...newTrainer, specialization: e.target.value })} />
          <input type="text" placeholder="Experience (Years)" className="p-3 rounded-lg bg-gray-800 text-white border border-gray-700" value={newTrainer.experience_years} onChange={(e) => setNewTrainer({ ...newTrainer, experience_years: e.target.value })} />
          
          {/* ✅ ADDED CLIENTS INPUT */}
          <input type="text" placeholder="Total Clients (e.g., 500)" className="p-3 rounded-lg bg-gray-800 text-white border border-gray-700" value={newTrainer.clients} onChange={(e) => setNewTrainer({ ...newTrainer, clients: e.target.value })} />
          
          {renderImageUpload(false)}
          {renderCertifications(newTrainer, setNewTrainer)}
          <textarea rows="5" placeholder="Trainer Bio" className="col-span-2 p-3 rounded-lg bg-gray-800 text-white border border-gray-700" value={newTrainer.bio} onChange={(e) => setNewTrainer({ ...newTrainer, bio: e.target.value })} />
        </div>
        <button onClick={addTrainer} disabled={saving || uploading} className="w-full mt-6 bg-orange-500 hover:bg-orange-300 text-black font-black py-3 rounded-lg uppercase transition disabled:opacity-50">
          {saving ? "Saving..." : "Add Trainer"}
        </button>
      </div>

      {/* ================= TRAINER LIST ================= */}
      <div className="bg-gray-900 border-2 border-gray-800 rounded-xl p-6">
        <h2 className="text-2xl font-black text-orange-500 uppercase mb-6">Existing Trainers</h2>
        {loading ? (
          <div className="text-center py-10 text-gray-400">Loading Trainers...</div>
        ) : trainers.length === 0 ? (
          <div className="text-center py-10 text-gray-500">No Trainers Found</div>
        ) : (
          <div className="space-y-6">
            {trainers.map((trainer) => (
              <div key={trainer.id} className="bg-gray-800 border border-gray-700 rounded-xl p-6">
                {editingId === trainer.id ? (
                  // EDIT MODE
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <input className="p-3 rounded-lg bg-gray-700 text-white" placeholder="Trainer Name" value={editingData.name || ""} onChange={(e) => setEditingData({ ...editingData, name: e.target.value })} />
                    <input className="p-3 rounded-lg bg-gray-700 text-white" placeholder="Specialization" value={editingData.specialization || ""} onChange={(e) => setEditingData({ ...editingData, specialization: e.target.value })} />
                    <input type="text" className="p-3 rounded-lg bg-gray-700 text-white" placeholder="Experience (Years)" value={editingData.experience_years || ""} onChange={(e) => setEditingData({ ...editingData, experience_years: e.target.value })} />
                    
                    {/* ✅ ADDED CLIENTS INPUT TO EDIT MODE */}
                    <input type="text" className="p-3 rounded-lg bg-gray-700 text-white" placeholder="Total Clients (e.g., 500)" value={editingData.clients || ""} onChange={(e) => setEditingData({ ...editingData, clients: e.target.value })} />
                    
                    {renderImageUpload(true)}
                    {renderCertifications(editingData, setEditingData)}
                    <textarea rows="4" className="col-span-2 p-3 rounded-lg bg-gray-700 text-white" placeholder="Trainer Bio" value={editingData.bio || ""} onChange={(e) => setEditingData({ ...editingData, bio: e.target.value })} />
                    <div className="col-span-2 flex gap-3 mt-2">
                      <button onClick={saveEdit} disabled={saving} className="flex items-center gap-2 bg-green-600 hover:bg-green-500 px-5 py-2 rounded-lg font-bold disabled:opacity-50">
                        <Check size={18} /> {saving ? "Saving..." : "Save"}
                      </button>
                      <button onClick={() => setEditingId(null)} className="flex items-center gap-2 bg-gray-600 hover:bg-gray-500 px-5 py-2 rounded-lg font-bold">
                        <X size={18} /> Cancel
                      </button>
                    </div>
                  </div>
                ) : (
                  // VIEW MODE
                  <div className="flex flex-col md:flex-row md:justify-between md:items-start gap-6">
                    <div className="flex gap-5">
                      <img src={trainer.photo_url || "https://placehold.co/120x120"} alt={trainer.name} className="w-28 h-28 rounded-lg object-cover border-2 border-orange-500" />
                      <div>
                        <h3 className="text-2xl font-black text-orange-500">{trainer.name}</h3>
                        <p className="text-gray-300 mt-1">{trainer.specialization}</p>
                        <p className="text-gray-400">{trainer.experience_years} Years Experience</p>
                        <div className="mt-3">
                          <span className="font-bold text-white">Certifications:</span>
                          <div className="flex flex-wrap gap-2 mt-2">
                            {(trainer.certifications || "").split(",").map((cert, index) => (
                              <span key={index} className="bg-orange-500 text-black text-sm px-3 py-1 rounded-full font-semibold">{cert.trim()}</span>
                            ))}
                          </div>
                        </div>
                        <p className="mt-4 text-gray-300 whitespace-pre-wrap">{trainer.bio}</p>
                      </div>
                    </div>
                    <div className="flex gap-3">
                      <button onClick={() => startEdit(trainer)} className="bg-blue-600 hover:bg-blue-500 p-3 rounded-lg"><Edit2 size={18} /></button>
                      <button onClick={() => deleteTrainer(trainer.id)} className="bg-red-600 hover:bg-red-500 p-3 rounded-lg"><Trash2 size={18} /></button>
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}