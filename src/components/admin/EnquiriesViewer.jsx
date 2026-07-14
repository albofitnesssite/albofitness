import React, { useEffect, useState } from 'react';
import { supabase } from '../../services/supabase';
import { Download, Loader2, Trash2 } from 'lucide-react';

export default function EnquiriesViewer() {
  const [enquiries, setEnquiries] = useState([]);
  const [selectedIds, setSelectedIds] = useState([]);
  const [deleting, setDeleting] = useState(false);

  useEffect(() => {
    fetchEnquiries();
  }, []);

  const fetchEnquiries = async () => {
    const { data, error } = await supabase
      .from('enquiries')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) {
      console.error(error);
      return;
    }

    setEnquiries(data || []);
    setSelectedIds([]);
  };

  const toggleEnquiry = (id) => {
    setSelectedIds((current) =>
      current.includes(id)
        ? current.filter((selectedId) => selectedId !== id)
        : [...current, id]
    );
  };

  const toggleAll = () => {
    setSelectedIds((current) =>
      current.length === enquiries.length
        ? []
        : enquiries.map((enquiry) => enquiry.id)
    );
  };

  const deleteSelected = async () => {
    if (!selectedIds.length || deleting) return;

    const confirmed = window.confirm(
      `Delete ${selectedIds.length} selected ${selectedIds.length === 1 ? 'enquiry' : 'enquiries'}? This cannot be undone.`
    );

    if (!confirmed) return;

    setDeleting(true);

    const { error } = await supabase
      .from('enquiries')
      .delete()
      .in('id', selectedIds);

    setDeleting(false);

    if (error) {
      console.error('Error deleting enquiries:', error);
      window.alert(`Unable to delete enquiries: ${error.message}`);
      return;
    }

    setEnquiries((current) =>
      current.filter((enquiry) => !selectedIds.includes(enquiry.id))
    );
    setSelectedIds([]);
  };

  const downloadCSV = () => {
    const csv = [
      ['Name', 'Email', 'Phone', 'Age', 'Gender', 'Goal', 'Height', 'Weight', 'Preferred Trainer', 'Date'],
      ...enquiries.map((e) => [
        e.name,
        e.email,
        e.phone,
        e.age || '',
        e.gender || '',
        e.goal_physique || '',
        e.height || '',
        e.weight || '',
        e.preferred_trainer || 'Not specified',
        new Date(e.created_at).toLocaleString(),
      ]),
    ]
      .map((row) => row.map((cell) => `"${String(cell ?? '').replaceAll('"', '""')}"`).join(','))
      .join('\n');

    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);

    link.setAttribute('href', url);
    link.setAttribute('download', `enquiries-${new Date().toISOString()}.csv`);
    link.style.visibility = 'hidden';

    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  const allSelected =
    enquiries.length > 0 && selectedIds.length === enquiries.length;

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <h2 className="text-2xl font-black uppercase text-orange-500">
            Enquiries
          </h2>
          <p className="mt-1 text-sm text-gray-500">
            {selectedIds.length} selected
          </p>
        </div>

        <div className="flex flex-wrap gap-3">
          {selectedIds.length > 0 && (
            <button
              onClick={deleteSelected}
              disabled={deleting}
              className="flex items-center gap-2 rounded-lg border border-red-500 bg-red-500/10 px-5 py-3 font-black uppercase text-red-400 transition-all hover:bg-red-500 hover:text-white disabled:opacity-50"
            >
              {deleting ? (
                <Loader2 size={20} className="animate-spin" />
              ) : (
                <Trash2 size={20} />
              )}
              Delete Selected ({selectedIds.length})
            </button>
          )}

          <button
            onClick={downloadCSV}
            className="flex items-center gap-2 rounded-lg bg-orange-500 px-6 py-3 font-black uppercase text-black transition-all hover:bg-orange-300"
          >
            <Download size={20} />
            Export CSV
          </button>
        </div>
      </div>

      {enquiries.length === 0 ? (
        <p className="py-8 text-center text-gray-400">No enquiries yet.</p>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full border-collapse">
            <thead>
              <tr className="border-2 border-orange-500 bg-gray-900">
                <th className="p-4 text-left">
                  <input
                    type="checkbox"
                    checked={allSelected}
                    onChange={toggleAll}
                    aria-label="Select all enquiries"
                    className="h-4 w-4 accent-orange-500"
                  />
                </th>
                <th className="p-4 text-left text-sm font-black uppercase text-white">Name</th>
                <th className="p-4 text-left text-sm font-black uppercase text-white">Email</th>
                <th className="p-4 text-left text-sm font-black uppercase text-white">Phone</th>
                <th className="p-4 text-left text-sm font-black uppercase text-white">Goal</th>
                <th className="p-4 text-left text-sm font-black uppercase text-white">Age</th>
                <th className="p-4 text-left text-sm font-black uppercase text-white">Gender</th>
                <th className="p-4 text-left text-sm font-black uppercase text-white">Height</th>
                <th className="p-4 text-left text-sm font-black uppercase text-white">Weight</th>
                <th className="p-4 text-left text-sm font-black uppercase text-white">Preferred Trainer</th>
                <th className="p-4 text-left text-sm font-black uppercase text-white">Date</th>
              </tr>
            </thead>

            <tbody>
              {enquiries.map((enquiry) => {
                const selected = selectedIds.includes(enquiry.id);

                return (
                  <tr
                    key={enquiry.id}
                    className={`border-2 transition ${
                      selected
                        ? 'border-orange-500 bg-orange-500/5'
                        : 'border-gray-800 hover:border-orange-500 hover:bg-gray-900'
                    }`}
                  >
                    <td className="p-4">
                      <input
                        type="checkbox"
                        checked={selected}
                        onChange={() => toggleEnquiry(enquiry.id)}
                        aria-label={`Select enquiry from ${enquiry.name}`}
                        className="h-4 w-4 accent-orange-500"
                      />
                    </td>
                    <td className="p-4 font-semibold text-gray-300">{enquiry.name}</td>
                    <td className="p-4 text-gray-300">{enquiry.email}</td>
                    <td className="p-4 text-gray-300">{enquiry.phone}</td>
                    <td className="p-4 text-gray-300">{enquiry.goal_physique || '-'}</td>
                    <td className="p-4 text-gray-300">{enquiry.age || '-'}</td>
                    <td className="p-4 text-gray-300">{enquiry.gender || '-'}</td>
                    <td className="p-4 whitespace-nowrap text-gray-300">
                      {enquiry.height !== null && enquiry.height !== undefined
                        ? `${enquiry.height} cm`
                        : '-'}
                    </td>
                    <td className="p-4 whitespace-nowrap text-gray-300">
                      {enquiry.weight !== null && enquiry.weight !== undefined
                        ? `${enquiry.weight} kg`
                        : '-'}
                    </td>
                    <td className="p-4 font-semibold text-orange-500">
                      {enquiry.preferred_trainer || 'Not specified'}
                    </td>
                    <td className="p-4 text-sm text-gray-400">
                      {new Date(enquiry.created_at).toLocaleDateString()}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
