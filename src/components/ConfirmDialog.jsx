import Modal from "./Modal";

export default function ConfirmDialog({ employee, busy, onCancel, onConfirm }) {
  return (
    <Modal
      title="Delete employee?"
      subtitle="This action cannot be undone."
      onClose={onCancel}
      width={440}
    >
      <p className="confirm-text">
        <strong>
          {employee.firstName} {employee.lastName}
        </strong>{" "}
        ({employee.position}) will be permanently removed from the directory.
      </p>
      <div className="form-actions">
        <button className="btn btn-ghost" onClick={onCancel} disabled={busy}>
          Cancel
        </button>
        <button className="btn btn-danger" onClick={onConfirm} disabled={busy}>
          {busy ? "Deleting…" : "Delete"}
        </button>
      </div>
    </Modal>
  );
}
