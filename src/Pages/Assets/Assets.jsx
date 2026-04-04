import React, { useEffect, useMemo, useState } from "react";
import styles from "./Assets.module.css";
import Modal from "../../components/Modal/Modal";

const initialAssets = [
  {
    id: "A001",
    name: "Laptop",
    location: "HR Office",
    status: "Active",
    lastMaintenance: "12/02/2026",
  },
  {
    id: "A002",
    name: "Printer",
    location: "Main Office",
    status: "Inactive",
    lastMaintenance: "10/02/2026",
  },
];

const STORAGE_KEY = "assets_data";

const emptyForm = {
  name: "",
  location: "",
  status: "Active",
  lastMaintenance: "",
};

const emptyErrors = {
  name: "",
  location: "",
  lastMaintenance: "",
};

const Assets = () => {
  const [assets, setAssets] = useState(() => {
    const saved = localStorage.getItem(STORAGE_KEY);
    return saved ? JSON.parse(saved) : initialAssets;
  });

  const [search, setSearch] = useState("");
  const [isOpen, setIsOpen] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [form, setForm] = useState(emptyForm);
  const [errors, setErrors] = useState(emptyErrors);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(assets));
  }, [assets]);

  const filtered = useMemo(() => {
    return assets.filter((item) => {
      const q = search.toLowerCase();
      return (
        item.name.toLowerCase().includes(q) ||
        item.location.toLowerCase().includes(q)
      );
    });
  }, [assets, search]);

  const openAdd = () => {
    setForm(emptyForm);
    setEditingId(null);
    setIsOpen(true);
  };

  const openEdit = (item) => {
    setForm(item);
    setEditingId(item.id);
    setIsOpen(true);
  };

  const closeModal = () => {
    setIsOpen(false);
    setForm(emptyForm);
    setEditingId(null);
  };

  const handleDelete = (id) => {
    setAssets(assets.filter((item) => item.id !== id));
  };

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const validate = () => {
    const newErrors = { ...emptyErrors };

    if (!form.name) newErrors.name = "Required";
    if (!form.location) newErrors.location = "Required";
    if (!form.lastMaintenance) newErrors.lastMaintenance = "Required";

    setErrors(newErrors);
    return Object.values(newErrors).every((v) => v === "");
  };

  const handleSave = () => {
    if (!validate()) return;

    if (editingId) {
      setAssets(
        assets.map((a) =>
          a.id === editingId ? { ...a, ...form } : a
        )
      );
    } else {
      const newAsset = {
        id: `A${Date.now()}`,
        ...form,
      };
      setAssets([newAsset, ...assets]);
    }

    closeModal();
  };

  const getStatusClass = (status) =>
    status === "Active" ? "ui-success" : "ui-danger";

  return (
    <div className="ui-page">
      <div className="ui-page-header">
        <div>
          <h2 className="ui-title">Assets</h2>
          <p className="ui-subtitle">Manage company assets</p>
        </div>

        <button className="ui-btn-primary" onClick={openAdd}>
          ➕ Add Asset
        </button>
      </div>

      <div className={styles.toolbar}>
        <input
          className="ui-input"
          placeholder="Search..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>

      <div className="ui-table-card">
        <table className="ui-table">
          <thead>
            <tr>
              <th>Name</th>
              <th>Location</th>
              <th>Status</th>
              <th>Last Maintenance</th>
              <th>Actions</th>
            </tr>
          </thead>

          <tbody>
            {filtered.map((item) => (
              <tr key={item.id}>
                <td>{item.name}</td>
                <td>{item.location}</td>
                <td>
                  <span className={`ui-badge ${getStatusClass(item.status)}`}>
                    {item.status}
                  </span>
                </td>
                <td>{item.lastMaintenance}</td>
                <td>
                  <div className={styles.actions}>
                    <button
                      className="ui-btn-icon"
                      onClick={() => openEdit(item)}
                    >
                      ✏️
                    </button>
                    <button
                      className="ui-btn-icon"
                      onClick={() => handleDelete(item.id)}
                    >
                      🗑️
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {isOpen && (
        <Modal
          title={editingId ? "Edit Asset" : "Add Asset"}
          onClose={closeModal}
        >
          <input
            className="ui-input"
            name="name"
            placeholder="Name"
            value={form.name}
            onChange={handleChange}
          />

          <input
            className="ui-input"
            name="location"
            placeholder="Location"
            value={form.location}
            onChange={handleChange}
          />

          <input
            className="ui-input"
            name="lastMaintenance"
            placeholder="DD/MM/YYYY"
            value={form.lastMaintenance}
            onChange={handleChange}
          />

          <select
            className="ui-input"
            name="status"
            value={form.status}
            onChange={handleChange}
          >
            <option>Active</option>
            <option>Inactive</option>
          </select>

          <button className="ui-btn-primary" onClick={handleSave}>
            Save
          </button>
        </Modal>
      )}
    </div>
  );
};

export default Assets;