import { useEffect, useState } from "react";
import {
  Pencil,
  Plus,
  Save,
  Trash2,
  X,
} from "lucide-react";

import {
  addServiceToFacility,
  createFacility,
  createService,
  deleteFacility,
  deleteService,
  getMyFacilities,
  getMyServices,
  removeServiceFromFacility,
  updateFacility,
  updateService,
} from "../services/facilityApi";

const emptyFacility = {
  name: "",
  type: "Hospital",
  address: "",
  county: "",
  latitude: "",
  longitude: "",
  description: "",
  phone: "",
  openingHours: "",
  emergency: false,
  wheelchair: "",
  operator: "",
};

const emptyService = { name: "", description: "" };

const weeklyHours = (value) => {
  if (!value.trim()) return null;

  return Object.fromEntries(
    ["monday", "tuesday", "wednesday", "thursday", "friday", "saturday", "sunday"]
      .map((day) => [day, value.trim()])
  );
};

const facilityFormValue = (facility) => ({
  name: facility.name || "",
  type: facility.type || "Hospital",
  address: facility.address || "",
  county: facility.county || "",
  latitude: String(facility.latitude ?? ""),
  longitude: String(facility.longitude ?? ""),
  description: facility.description || "",
  phone: facility.phone || "",
  openingHours: typeof facility.opening_hours === "object"
    ? Object.values(facility.opening_hours)[0] || ""
    : facility.opening_hours || "",
  emergency: Boolean(facility.emergency),
  wheelchair: facility.wheelchair || "",
  operator: facility.operator || "",
});

export default function Manage() {
  const [facilities, setFacilities] = useState([]);
  const [services, setServices] = useState([]);
  const [facilityForm, setFacilityForm] = useState(emptyFacility);
  const [serviceForm, setServiceForm] = useState(emptyService);
  const [selectedServiceIds, setSelectedServiceIds] = useState([]);
  const [editingFacility, setEditingFacility] = useState(null);
  const [editingService, setEditingService] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [notice, setNotice] = useState("");

  const loadData = async () => {
    try {
      setLoading(true);
      setError("");
      const [facilityData, serviceData] = await Promise.all([
        getMyFacilities(),
        getMyServices(),
      ]);
      setFacilities(facilityData);
      setServices(serviceData);
    } catch (requestError) {
      setError(requestError.message || "Could not load management data.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const resetFacilityForm = () => {
    setFacilityForm(emptyFacility);
    setSelectedServiceIds([]);
    setEditingFacility(null);
  };

  const resetServiceForm = () => {
    setServiceForm(emptyService);
    setEditingService(null);
  };

  const syncFacilityServices = async (facility, desiredIds) => {
    const currentIds = new Set(
      (facility.services || []).map((service) => service.id)
    );
    const desired = new Set(desiredIds.map(Number));

    for (const id of desired) {
      if (!currentIds.has(id)) {
        await addServiceToFacility(facility.id, id);
      }
    }

    for (const id of currentIds) {
      if (!desired.has(id)) {
        await removeServiceFromFacility(facility.id, id);
      }
    }
  };

  const submitFacility = async (event) => {
    event.preventDefault();
    setSaving(true);
    setError("");
    setNotice("");

    const payload = {
      ...facilityForm,
      latitude: Number(facilityForm.latitude),
      longitude: Number(facilityForm.longitude),
      opening_hours: weeklyHours(facilityForm.openingHours),
    };
    delete payload.openingHours;

    try {
      const saved = editingFacility
        ? await updateFacility(editingFacility.id, payload)
        : await createFacility(payload);
      await syncFacilityServices(saved, selectedServiceIds);
      setNotice(`Facility ${editingFacility ? "updated" : "created"} successfully.`);
      resetFacilityForm();
      await loadData();
    } catch (requestError) {
      setError(requestError.message || "Could not save the facility.");
    } finally {
      setSaving(false);
    }
  };

  const submitService = async (event) => {
    event.preventDefault();
    setSaving(true);
    setError("");
    setNotice("");

    try {
      if (editingService) {
        await updateService(editingService.id, serviceForm);
      } else {
        await createService(serviceForm);
      }
      setNotice(`Service ${editingService ? "updated" : "created"} successfully.`);
      resetServiceForm();
      await loadData();
    } catch (requestError) {
      setError(requestError.message || "Could not save the service.");
    } finally {
      setSaving(false);
    }
  };

  const editFacility = (facility) => {
    setEditingFacility(facility);
    setFacilityForm(facilityFormValue(facility));
    setSelectedServiceIds((facility.services || []).map((service) => service.id));
    setNotice("");
  };

  const editService = (service) => {
    setEditingService(service);
    setServiceForm({ name: service.name, description: service.description || "" });
    setNotice("");
  };

  const removeFacility = async (facility) => {
    if (!window.confirm(`Delete ${facility.name}? This cannot be undone.`)) return;
    try {
      setError("");
      await deleteFacility(facility.id);
      if (editingFacility?.id === facility.id) resetFacilityForm();
      setNotice("Facility deleted successfully.");
      await loadData();
    } catch (requestError) {
      setError(requestError.message || "Could not delete the facility.");
    }
  };

  const removeService = async (service) => {
    if (!window.confirm(`Delete ${service.name}? This cannot be undone.`)) return;
    try {
      setError("");
      await deleteService(service.id);
      if (editingService?.id === service.id) resetServiceForm();
      setNotice("Service deleted successfully.");
      await loadData();
    } catch (requestError) {
      setError(requestError.message || "Could not delete the service.");
    }
  };

  const toggleService = (serviceId) => {
    setSelectedServiceIds((current) => current.includes(serviceId)
      ? current.filter((id) => id !== serviceId)
      : [...current, serviceId]);
  };

  return (
    <main className="mx-auto max-w-7xl px-6 py-12">
      <div className="max-w-3xl">
        <h1 className="text-3xl font-bold">Manage AfyaLink data</h1>
        <p className="mt-2 text-slate-500">Create, update, and remove only the facilities and healthcare services you own.</p>
      </div>

      {error && <p className="mt-6 rounded-xl bg-red-50 p-4 text-red-700">{error}</p>}
      {notice && <p className="mt-6 rounded-xl bg-green-50 p-4 text-green-700">{notice}</p>}

      <div className="mt-8 grid gap-8 xl:grid-cols-2">
        <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
          <div className="mb-6 flex items-center justify-between gap-4">
            <h2 className="text-xl font-bold">{editingFacility ? "Edit facility" : "New facility"}</h2>
            {editingFacility && <button type="button" onClick={resetFacilityForm} className="inline-flex items-center gap-1 text-sm font-medium text-slate-600"><X size={16} /> Cancel</button>}
          </div>
          <form onSubmit={submitFacility} className="grid gap-4 sm:grid-cols-2">
            <Input label="Name" value={facilityForm.name} required onChange={(value) => setFacilityForm({ ...facilityForm, name: value })} />
            <Input label="Type" value={facilityForm.type} required onChange={(value) => setFacilityForm({ ...facilityForm, type: value })} />
            <Input label="Address" value={facilityForm.address} required onChange={(value) => setFacilityForm({ ...facilityForm, address: value })} />
            <Input label="County" value={facilityForm.county} required onChange={(value) => setFacilityForm({ ...facilityForm, county: value })} />
            <Input label="Latitude" type="number" step="any" value={facilityForm.latitude} required onChange={(value) => setFacilityForm({ ...facilityForm, latitude: value })} />
            <Input label="Longitude" type="number" step="any" value={facilityForm.longitude} required onChange={(value) => setFacilityForm({ ...facilityForm, longitude: value })} />
            <Input label="Phone" value={facilityForm.phone} onChange={(value) => setFacilityForm({ ...facilityForm, phone: value })} />
            <Input label="Opening hours" value={facilityForm.openingHours} placeholder="Open 24 hours" onChange={(value) => setFacilityForm({ ...facilityForm, openingHours: value })} />
            <Input label="Operator" value={facilityForm.operator} onChange={(value) => setFacilityForm({ ...facilityForm, operator: value })} />
            <label className="grid gap-1 text-sm font-medium text-slate-700">Wheelchair access<select value={facilityForm.wheelchair} onChange={(event) => setFacilityForm({ ...facilityForm, wheelchair: event.target.value })} className="rounded-xl border border-slate-300 px-3 py-2.5 font-normal"><option value="">Unknown</option><option value="yes">Yes</option><option value="no">No</option></select></label>
            <label className="sm:col-span-2 grid gap-1 text-sm font-medium text-slate-700">Description<textarea value={facilityForm.description} onChange={(event) => setFacilityForm({ ...facilityForm, description: event.target.value })} rows="3" className="rounded-xl border border-slate-300 px-3 py-2.5 font-normal" /></label>
            <label className="sm:col-span-2 flex items-center gap-2 text-sm font-medium text-slate-700"><input type="checkbox" checked={facilityForm.emergency} onChange={(event) => setFacilityForm({ ...facilityForm, emergency: event.target.checked })} /> Emergency services available</label>
            <fieldset className="sm:col-span-2"><legend className="text-sm font-medium text-slate-700">Available services</legend><div className="mt-2 flex flex-wrap gap-3">{services.map((service) => <label key={service.id} className="flex items-center gap-2 text-sm"><input type="checkbox" checked={selectedServiceIds.includes(service.id)} onChange={() => toggleService(service.id)} /> {service.name}</label>)}</div></fieldset>
            <button disabled={saving} className="sm:col-span-2 inline-flex items-center justify-center gap-2 rounded-xl bg-blue-600 px-4 py-3 font-semibold text-white hover:bg-blue-700 disabled:opacity-60"><Save size={18} />{saving ? "Saving..." : editingFacility ? "Save facility" : "Create facility"}</button>
          </form>
        </section>

        <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
          <div className="mb-6 flex items-center justify-between gap-4"><h2 className="text-xl font-bold">{editingService ? "Edit service" : "New service"}</h2>{editingService && <button type="button" onClick={resetServiceForm} className="inline-flex items-center gap-1 text-sm font-medium text-slate-600"><X size={16} /> Cancel</button>}</div>
          <form onSubmit={submitService} className="grid gap-4"><Input label="Service name" value={serviceForm.name} required onChange={(value) => setServiceForm({ ...serviceForm, name: value })} /><label className="grid gap-1 text-sm font-medium text-slate-700">Description<textarea value={serviceForm.description} onChange={(event) => setServiceForm({ ...serviceForm, description: event.target.value })} rows="3" className="rounded-xl border border-slate-300 px-3 py-2.5 font-normal" /></label><button disabled={saving} className="inline-flex items-center justify-center gap-2 rounded-xl bg-blue-600 px-4 py-3 font-semibold text-white hover:bg-blue-700 disabled:opacity-60"><Plus size={18} />{saving ? "Saving..." : editingService ? "Save service" : "Create service"}</button></form>
        </section>
      </div>

      <section className="mt-10"><h2 className="text-2xl font-bold">Facilities</h2>{loading ? <p className="mt-4 text-slate-500">Loading...</p> : <div className="mt-4 overflow-x-auto rounded-2xl border border-slate-200 bg-white"><table className="w-full text-left text-sm"><thead className="bg-slate-50 text-slate-600"><tr><th className="px-4 py-3">Name</th><th className="px-4 py-3">Location</th><th className="px-4 py-3">Actions</th></tr></thead><tbody>{facilities.map((facility) => <tr key={facility.id} className="border-t"><td className="px-4 py-3 font-medium">{facility.name}<span className="block text-xs font-normal text-slate-500">{facility.type}</span></td><td className="px-4 py-3">{facility.county}</td><td className="px-4 py-3"><div className="flex gap-3"><button onClick={() => editFacility(facility)} className="inline-flex items-center gap-1 text-blue-600"><Pencil size={16} /> Edit</button><button onClick={() => removeFacility(facility)} className="inline-flex items-center gap-1 text-red-600"><Trash2 size={16} /> Delete</button></div></td></tr>)}</tbody></table></div>}</section>
      <section className="mt-10"><h2 className="text-2xl font-bold">Services</h2><div className="mt-4 overflow-x-auto rounded-2xl border border-slate-200 bg-white"><table className="w-full text-left text-sm"><thead className="bg-slate-50 text-slate-600"><tr><th className="px-4 py-3">Name</th><th className="px-4 py-3">Description</th><th className="px-4 py-3">Actions</th></tr></thead><tbody>{services.map((service) => <tr key={service.id} className="border-t"><td className="px-4 py-3 font-medium">{service.name}</td><td className="px-4 py-3 text-slate-600">{service.description || "—"}</td><td className="px-4 py-3"><div className="flex gap-3"><button onClick={() => editService(service)} className="inline-flex items-center gap-1 text-blue-600"><Pencil size={16} /> Edit</button><button onClick={() => removeService(service)} className="inline-flex items-center gap-1 text-red-600"><Trash2 size={16} /> Delete</button></div></td></tr>)}</tbody></table></div></section>
    </main>
  );
}

function Input({ label, onChange, ...props }) {
  return <label className="grid gap-1 text-sm font-medium text-slate-700">{label}<input {...props} onChange={(event) => onChange(event.target.value)} className="rounded-xl border border-slate-300 px-3 py-2.5 font-normal" /></label>;
}
