import React, { useEffect, useMemo, useState } from "react";
import styles from "./Storage.module.css";
import Modal from "../../components/Modal/Modal";
import { authFetch } from "../../services/AuthService";
import Swal from "sweetalert2";

const Storage = () => {
  const [storages, setStorages] = useState([]);
  const [search, setSearch] = useState("");
  const [isOpen, setIsOpen] = useState(false);
  const [name, setName] = useState("");
  const [editingId, setEditingId] = useState(null);

  const swalButtons = {
    confirmButtonColor: "#c62828",
    cancelButtonColor: "#9e9e9e",
  };

  useEffect(() => {
    fetchStorages();
  }, []);

  const fetchStorages = async () => {
    try {
      const res = await authFetch("/api/Storage");
      const data = await res.json();
      setStorages(data);
    } catch (error) {
      console.error("Error fetching storages:", error);

      Swal.fire({
        title: "Error!",
        text: "Failed to load storages.",
        icon: "error",
        confirmButtonColor: "#c62828",
      });
    }
  };

  const filtered = useMemo(() => {
    return storages.filter((item) =>
      String(item.name ?? "").toLowerCase().includes(search.toLowerCase())
    );
  }, [storages, search]);

  const openAdd = () => {
    setName("");
    setEditingId(null);
    setIsOpen(true);
  };

  const openEdit = (item) => {
    setName(item.name);
    setEditingId(item.id);
    setIsOpen(true);
  };

  const closeModal = () => {
    setIsOpen(false);
    setName("");
    setEditingId(null);
  };

  const handleDelete = async (id) => {
    const result = await Swal.fire({
      title: "Are you sure?",
      text: "This storage will be deleted permanently!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Yes, delete it!",
      cancelButtonText: "Cancel",
      ...swalButtons,
    });

    if (!result.isConfirmed) return;

    try {
      await authFetch(`/api/Storage/${id}`, {
        method: "DELETE",
      });

      await fetchStorages();

      Swal.fire({
        title: "Deleted!",
        text: "Storage deleted successfully.",
        icon: "success",
        confirmButtonColor: "#c62828",
      });
    } catch (error) {
      console.error("Delete error:", error);

      Swal.fire({
        title: "Error!",
        text: "Something went wrong while deleting.",
        icon: "error",
        confirmButtonColor: "#c62828",
      });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!name.trim()) {
      return Swal.fire({
        title: "Validation",
        text: "Storage name is required.",
        icon: "warning",
        confirmButtonColor: "#c62828",
      });
    }

    const payload = { name };

    try {
      if (editingId) {
        await authFetch(`/api/Storage/${editingId}`, {
          method: "PUT",
          body: JSON.stringify(payload),
        });
      } else {
        await authFetch("/api/Storage", {
          method: "POST",
          body: JSON.stringify(payload),
        });
      }

      await fetchStorages();
      closeModal();

      Swal.fire({
        title: "Success!",
        text: editingId
          ? "Storage updated successfully."
          : "Storage added successfully.",
        icon: "success",
        confirmButtonColor: "#c62828",
      });
    } catch (error) {
      console.error("Save error:", error);

      Swal.fire({
        title: "Error!",
        text: "Something went wrong while saving.",
        icon: "error",
        confirmButtonColor: "#c62828",
      });
    }
  };

  return (
    <div className="ui-page">
      <div className="ui-page-header">
        <div>
          <h2 className="ui-title">Storage</h2>
          <p className="ui-subtitle">Manage and organize storage locations.</p>
        </div>

        <div className="ui-actions">
          <button className="ui-btn-primary" onClick={openAdd} type="button">
            ➕ Add Storage
          </button>
        </div>
      </div>

      <div className={styles.toolbar}>
        <input
          className={`ui-input ${styles.searchInput}`}
          placeholder="Search storage..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>

      <div className="ui-table-card">
        <table className="ui-table">
          <thead>
            <tr>
              <th>ID</th>
              <th>Name</th>
              <th>Actions</th>
            </tr>
          </thead>

          <tbody>
            {filtered.length > 0 ? (
              filtered.map((item) => (
                <tr key={item.id}>
                  <td>{item.id}</td>
                  <td>{item.name}</td>
                  <td>
                    <div className={styles.actions}>
                      <button
                        className="ui-btn-icon"
                        onClick={() => openEdit(item)}
                        type="button"
                        title="Edit"
                      >
                        ✏️
                      </button>

                      <button
                        className="ui-btn-icon"
                        onClick={() => handleDelete(item.id)}
                        type="button"
                        title="Delete"
                      >
                        🗑️
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="3" className="ui-empty">
                  No storage found
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {isOpen && (
        <Modal
          title={editingId ? "Edit Storage" : "Add Storage"}
          onClose={closeModal}
        >
          <form onSubmit={handleSubmit}>
            <div className={styles.modalGrid}>
              <div className={styles.formGroup}>
                <label>Storage Name</label>
                <input
                  className="ui-input"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Storage name"
                />
              </div>
            </div>

            <div className={styles.modalActions}>
              <button
                className="ui-btn-secondary"
                onClick={closeModal}
                type="button"
              >
                Cancel
              </button>

              <button className="ui-btn-primary" type="submit">
                {editingId ? "Update Storage" : "Save Storage"}
              </button>
            </div>
          </form>
        </Modal>
      )}
    </div>
  );
};

export default Storage;