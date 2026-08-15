import React, { useState } from 'react';
import { Search, Edit3, Trash2, Eye, Star, AlertTriangle, Shield, CheckCircle2 } from 'lucide-react';
import { Vehicle, VehicleStatus } from '../../types';

interface VehicleTableProps {
  vehicles: Vehicle[];
  onEdit: (vehicle: Vehicle) => void;
  onDelete: (id: string) => void;
  onStatusChange: (id: string, status: VehicleStatus) => void;
  onFeaturedToggle: (id: string, featured: boolean) => void;
  onViewPublic: (id: string) => void;
}

export const VehicleTable: React.FC<VehicleTableProps> = ({
  vehicles,
  onEdit,
  onDelete,
  onStatusChange,
  onFeaturedToggle,
  onViewPublic
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [deleteModalId, setDeleteModalId] = useState<string | null>(null);

  const filtered = vehicles.filter(v => {
    const q = searchTerm.toLowerCase();
    return (
      v.make.toLowerCase().includes(q) ||
      v.model.toLowerCase().includes(q) ||
      v.year.toString().includes(q) ||
      v.status.toLowerCase().includes(q)
    );
  });

  const targetDeleteVehicle = vehicles.find(v => v.id === deleteModalId);

  return (
    <div className="space-y-4" id="admin-vehicle-table-container">
      
      {/* Top Search & Count Bar */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 bg-neutral-900 border border-neutral-800 p-4 rounded-xl">
        <div className="relative w-full sm:max-w-md">
          <Search className="w-4 h-4 text-neutral-500 absolute left-3 top-3" />
          <input
            type="text"
            value={searchTerm}
            onChange={e => setSearchTerm(e.target.value)}
            placeholder="Search inventory by make, model, status..."
            className="w-full bg-neutral-950 border border-neutral-800 text-white rounded-lg pl-9 pr-4 py-2 text-xs focus:outline-none focus:border-red-600"
            id="admin-inventory-search-input"
          />
        </div>

        <span className="text-xs text-neutral-400 font-bold uppercase shrink-0">
          Total Inventory: <span className="text-white">{filtered.length}</span> vehicles
        </span>
      </div>

      {/* Table */}
      <div className="bg-neutral-900 border border-neutral-800 rounded-xl overflow-hidden shadow-xl">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-neutral-300">
            <thead className="bg-neutral-950 text-neutral-400 uppercase text-[10px] font-bold tracking-wider border-b border-neutral-800">
              <tr>
                <th className="p-4">Photo</th>
                <th className="p-4">Vehicle</th>
                <th className="p-4">Price (ETB)</th>
                <th className="p-4">Mileage</th>
                <th className="p-4">Status</th>
                <th className="p-4">Featured</th>
                <th className="p-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-neutral-800/80">
              {filtered.length === 0 ? (
                <tr>
                  <td colSpan={7} className="p-8 text-center text-neutral-500">
                    No matching vehicles found in inventory.
                  </td>
                </tr>
              ) : (
                filtered.map(v => (
                  <tr key={v.id} className="hover:bg-neutral-950/50 transition-colors">
                    
                    {/* Image */}
                    <td className="p-4">
                      <img
                        src={v.primaryImage || v.images?.[0]}
                        alt={`${v.make} ${v.model}`}
                        className="w-16 h-11 object-cover rounded-md bg-neutral-950 border border-neutral-800"
                      />
                    </td>

                    {/* Make & Model */}
                    <td className="p-4">
                      <div className="font-bold text-white text-sm">
                        {v.make} {v.model}
                      </div>
                      <span className="text-neutral-500 text-[11px]">
                        {v.year} • {v.fuelType} • {v.transmission}
                      </span>
                      <div className="mt-1">
                        <span
                          className={`text-[10px] font-bold uppercase rounded px-1.5 py-0.5 ${
                            v.published
                              ? 'bg-neutral-800 text-neutral-300'
                              : 'bg-amber-950 text-amber-400 border border-amber-800'
                          }`}
                        >
                          {v.published ? 'Published' : 'Draft'}
                        </span>
                      </div>
                    </td>

                    {/* Price */}
                    <td className="p-4 font-black text-white text-sm font-sans text-red-400">
                      ETB {v.price.toLocaleString()}
                    </td>

                    {/* Mileage */}
                    <td className="p-4 font-medium text-neutral-300">
                      {v.mileage.toLocaleString()} KM
                    </td>

                    {/* Status Select */}
                    <td className="p-4">
                      <select
                        value={v.status}
                        onChange={e => onStatusChange(v.id, e.target.value as VehicleStatus)}
                        className={`text-[11px] font-bold uppercase rounded px-2.5 py-1 border focus:outline-none ${
                          v.status === 'Available'
                            ? 'bg-emerald-950 text-emerald-400 border-emerald-800'
                            : v.status === 'Reserved'
                            ? 'bg-amber-950 text-amber-400 border-amber-800'
                            : 'bg-red-950 text-red-400 border-red-800'
                        }`}
                        id={`table-status-select-${v.id}`}
                      >
                        <option value="Available">Available</option>
                        <option value="Reserved">Reserved</option>
                        <option value="Sold">Sold</option>
                      </select>
                    </td>

                    {/* Featured Toggle */}
                    <td className="p-4">
                      <button
                        onClick={() => onFeaturedToggle(v.id, !v.featured)}
                        className={`p-1.5 rounded transition-colors ${
                          v.featured ? 'text-red-500 hover:text-red-400' : 'text-neutral-600 hover:text-neutral-400'
                        }`}
                        title={v.featured ? 'Featured on homepage' : 'Mark as featured'}
                        id={`table-featured-toggle-${v.id}`}
                      >
                        <Star className={`w-4 h-4 ${v.featured ? 'fill-current' : ''}`} />
                      </button>
                    </td>

                    {/* Actions */}
                    <td className="p-4 text-right space-x-2">
                      <button
                        onClick={() => onViewPublic(v.id)}
                        className="p-1.5 text-neutral-400 hover:text-white hover:bg-neutral-800 rounded transition-colors"
                        title="View Public Page"
                        id={`table-view-btn-${v.id}`}
                      >
                        <Eye className="w-4 h-4" />
                      </button>

                      <button
                        onClick={() => onEdit(v)}
                        className="p-1.5 text-neutral-400 hover:text-white hover:bg-neutral-800 rounded transition-colors"
                        title="Edit Vehicle"
                        id={`table-edit-btn-${v.id}`}
                      >
                        <Edit3 className="w-4 h-4" />
                      </button>

                      <button
                        onClick={() => setDeleteModalId(v.id)}
                        className="p-1.5 text-red-400 hover:text-red-300 hover:bg-red-950/50 rounded transition-colors"
                        title="Delete Vehicle"
                        id={`table-delete-btn-${v.id}`}
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </td>

                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Delete Confirmation Safeguard Modal */}
      {deleteModalId && (
        <div className="fixed inset-0 z-50 bg-neutral-950/85 backdrop-blur-md flex items-center justify-center p-4">
          <div className="bg-neutral-900 border border-neutral-800 rounded-2xl max-w-md w-full p-6 text-center space-y-4 shadow-2xl animate-fadeIn">
            <div className="w-12 h-12 rounded-full bg-red-950 border border-red-800 text-red-500 flex items-center justify-center mx-auto">
              <AlertTriangle className="w-6 h-6" />
            </div>

            <h3 className="text-xl font-black text-white uppercase font-sans">
              DELETE VEHICLE LISTING?
            </h3>

            <p className="text-neutral-300 text-xs leading-relaxed">
              Are you sure you want to delete <span className="text-white font-bold">{targetDeleteVehicle?.make} {targetDeleteVehicle?.model}</span>? This action will permanently remove the vehicle from the database.
            </p>

            <div className="flex items-center justify-center space-x-3 pt-2">
              <button
                onClick={() => setDeleteModalId(null)}
                className="bg-neutral-800 hover:bg-neutral-700 text-white text-xs font-bold uppercase px-4 py-2.5 rounded-lg border border-neutral-700"
                id="cancel-delete-btn"
              >
                Cancel
              </button>

              <button
                onClick={() => {
                  onDelete(deleteModalId);
                  setDeleteModalId(null);
                }}
                className="bg-red-600 hover:bg-red-700 text-white text-xs font-bold uppercase px-5 py-2.5 rounded-lg shadow-lg shadow-red-600/30"
                id="confirm-delete-btn"
              >
                DELETE VEHICLE
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};
