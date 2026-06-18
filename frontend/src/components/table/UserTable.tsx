import { useBlockUser } from "../../hooks/users/useBlockUser"
import { useUnBlockUser } from "../../hooks/users/useUnblockUser"
import { getInitials } from "../../utils/getInitials"

const formatDate = (dateStr: string) => {
  if (!dateStr) return "—"
  return new Date(dateStr).toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  })
}

export const UserTable = ({ filteredUsers }: { filteredUsers: any[] }) => {
  const { blockUser }   = useBlockUser()
  const { unblockUser } = useUnBlockUser()

  return (
    <div className="card border-0 shadow-sm rounded-3 overflow-hidden">
      {/* Header */}
      <div className="card-header bg-white d-flex align-items-center justify-content-between py-3 px-4 border-bottom">
        <h2 className="fs-6 fw-bold text-dark mb-0">User List</h2>
        <span className="badge rounded-pill text-bg-success bg-opacity-10 text-success fw-semibold">
          {filteredUsers.length} users
        </span>
      </div>

      {/* Table */}
      <div className="table-responsive">
        <table className="table table-hover align-middle mb-0">
          <thead className="table-light">
            <tr>
              <th className="text-uppercase text-secondary fw-semibold small ps-4">Customer</th>
              <th className="text-uppercase text-secondary fw-semibold small">Email</th>
              <th className="text-uppercase text-secondary fw-semibold small">Role</th>
              <th className="text-uppercase text-secondary fw-semibold small">Status</th>
              <th className="text-uppercase text-secondary fw-semibold small">Orders</th>
              <th className="text-uppercase text-secondary fw-semibold small">Date Joined</th>
              <th className="text-uppercase text-secondary fw-semibold small">Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredUsers.map((user) => (
              <tr key={user._id}>
                {/* Customer */}
                <td className="ps-4">
                  <div className="d-flex align-items-center gap-2">
                    <div
                      className="rounded-circle d-flex align-items-center justify-content-center text-white fw-bold flex-shrink-0"
                      style={{ width: 34, height: 34, fontSize: "0.7rem", background: "#085a49" }}
                    >
                      {getInitials (user.fullname)}
                    </div>
                    <span className="fw-semibold text-dark">{user.fullname}</span>
                  </div>
                </td>

                {/* Email */}
                <td>
                  <span className="text-secondary small">{user.email}</span>
                </td>

                {/* Role */}
                <td>
                  {user.role === "admin" ? (
                    <span className="badge rounded-pill bg-warning bg-opacity-25 text-warning-emphasis border border-warning-subtle fw-semibold">
                      {user.role}
                    </span>
                  ) : (
                    <span className="badge rounded-pill bg-success bg-opacity-10 text-success border border-success-subtle fw-semibold">
                      {user.role}
                    </span>
                  )}
                </td>

                {/* Status */}
                <td>
                  {user.isActive ? (
                    <span className="badge rounded-pill bg-success bg-opacity-10 text-success border border-success-subtle fw-semibold d-inline-flex align-items-center gap-1">
                      <span
                        className="rounded-circle bg-success"
                        style={{ width: 6, height: 6, display: "inline-block" }}
                      />
                      Active
                    </span>
                  ) : (
                    <span className="badge rounded-pill bg-danger bg-opacity-10 text-danger border border-danger-subtle fw-semibold d-inline-flex align-items-center gap-1">
                      <span
                        className="rounded-circle bg-danger"
                        style={{ width: 6, height: 6, display: "inline-block" }}
                      />
                      Inactive
                    </span>
                  )}
                </td>

                {/* Orders */}
                <td>
                  <span className="fw-semibold text-dark">{user.totalOrders ?? 0}</span>
                </td>

                {/* Date Joined */}
                <td>
                  <span className="text-secondary small">{formatDate(user.createdAt)}</span>
                </td>

                {/* Actions */}
                <td>
                  {user.isActive ? (
                    <button
                      className="btn btn-sm btn-outline-danger fw-semibold"
                      onClick={() => blockUser(user._id)}
                    >
                      Block
                    </button>
                  ) : (
                    <button
                      className="btn btn-sm btn-outline-success fw-semibold"
                      onClick={() => unblockUser(user._id)}
                    >
                      Unblock
                    </button>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}