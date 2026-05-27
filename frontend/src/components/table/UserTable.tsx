import "../../css/User.css"
import { useBlockUser } from "../../hooks/users/useBlockUser"
import { useUnBlockUser } from "../../hooks/users/useUnblockUser"

const formatDate = (dateStr: string) => {
  if (!dateStr) return "—"
  return new Date(dateStr).toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  })
}

const getInitials = (name: string) => {
  if (!name) return "?"
  return name
    .split(" ")
    .map((n) => n[0])
    .slice(0, 2)
    .join("")
    .toUpperCase()
}

export const UserTable = ({ filteredUsers }: { filteredUsers: any[] }) => {
    const { blockUser } = useBlockUser()
    const { unblockUser } = useUnBlockUser()

    const handleBlockUser = async (id: string) => {
        await blockUser(id)
    }
    const handleUnBlockUser = async (id: string) => {
        await unblockUser(id)
    }

  return (
    <div className="table-card">
      <div className="table-card__header">
        <h2 className="table-card__title">All Users</h2>
        <span className="table-card__count">{filteredUsers.length} total</span>
      </div>

      <div className="user-table-wrap">
        <table className="user-table">
          <thead>
            <tr>
              <th className="col-name">Name</th>
              <th className="col-email">Email</th>
              <th className="col-role">Role</th>
              <th className="col-status">Status</th>
              <th className="col-orders">Orders</th>
              <th className="col-joined">Joined</th>
              <th className="col-actions">Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredUsers.map((user) => (
              <tr key={user._id}>
                <td>
                  <div className="avatar-cell">
                    <div className="avatar">{getInitials(user.fullname)}</div>
                    <span className="cell-name">{user.fullname}</span>
                  </div>
                </td>
                <td>
                  <span className="cell-email">{user.email}</span>
                </td>
                <td>
                  <span className={`badge badge--${user.role === "admin" ? "admin" : "user"}`}>
                    {user.role}
                  </span>
                </td>
                <td>
                  <span className={`badge badge--${user.isActive ? "active" : "inactive"}`}>
                    <span className="badge__dot" />
                    {user.isActive ? "Active" : "Inactive"}
                  </span>
                </td>
                <td>
                  <span className="cell-orders">{user.totalOrders ?? 0}</span>
                </td>
                <td>
                  <span className="cell-date">{formatDate(user.createdAt)}</span>
                </td>
                <td>
                  {user.isActive ? (
                    <button 
                    className="btn-save"
                    onClick={() => handleBlockUser(user._id)}
                    >Block</button>
                  ) : (
                    <button 
                    className="btn-save"
                    onClick={() => handleUnBlockUser(user._id)}
                    >Unblock</button>
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