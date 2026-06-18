import { useEffect, useState } from "react"
import { useAppSelector } from "../../hooks/redux/reduxHooks"
import { UserTable } from "../../components/table/UserTable"
import "../../css/User.css"
import { useGetAllUsers } from "../../hooks/users/useGetAllUsers"

interface StatCardProps {
  title: string
  value: string | number
  description: string
  icon: string
  accentColor: string
  iconBg: string
  iconColor: string
}

const StatCard = ({
  title,
  value,
  description,
  icon,
  accentColor,
  iconBg,
  iconColor,
}: StatCardProps) => (
  <div className="u-stat-card" style={{ borderTopColor: accentColor }}>
    <div className="u-stat-card__top">
      <div className="u-stat-card__text">
        <p className="u-stat-card__label">{title}</p>
        <p className="u-stat-card__value">{value}</p>
      </div>
      <div className="u-stat-card__icon-wrap" style={{ background: iconBg }}>
        <i className={`ti ${icon}`} style={{ fontSize: 22, color: iconColor }} />
      </div>
    </div>
    <div className="u-stat-card__footer">
      <i className="ti ti-info-circle u-stat-card__footer-icon" />
      <span className="u-stat-card__description">{description}</span>
    </div>
  </div>
)

export const User = () => {
  const users = useAppSelector((state) => state.user.users)
  const currentDate = new Date()

  const { getAllUsers } = useGetAllUsers()

  const [search, setSearch]         = useState<string>("")
  const [selectRole, setSelectRole] = useState<string>("")

  const filteredUsers = users.filter((user) => {
    const matchesName = user.fullname.toLowerCase().includes(search.toLowerCase())
    const matchesRole = user.role === selectRole || selectRole === ""
    return matchesName && matchesRole
  })

  const totalUsers       = users?.length || 0
  const totalAdmins      = users?.filter((u) => u.role === "admin").length || 0
  const totalActiveUsers = users?.filter((u) => u.isActive === true).length || 0
  const newUsers         = users?.filter((u) => {
    const d = new Date(u.createdAt)
    return (
      d.getMonth()    === currentDate.getMonth() &&
      d.getFullYear() === currentDate.getFullYear()
    )
  }).length || 0

  useEffect(() => {
    getAllUsers()
  }, [])

  return (
    <div className="user-page">
      <div className="user-page__header">
        <div>
          <h1 className="user-page__title">Users</h1>
          <p className="user-page__subtitle">Manage and monitor all registered accounts</p>
        </div>
        <div className="user-page__badge">
          <i className="ti ti-users" />
          {totalUsers} total
        </div>
      </div>

      <div className="u-stat-grid">
        <StatCard
          title="TOTAL USERS"
          value={totalUsers}
          description="All registered accounts"
          icon="ti-users"
          accentColor="#085a49"
          iconBg="rgba(8,90,73,0.09)"
          iconColor="#085a49"
        />
        <StatCard
          title="ACTIVE USERS"
          value={totalActiveUsers}
          description="Currently active accounts"
          icon="ti-user-check"
          accentColor="#2563eb"
          iconBg="rgba(37,99,235,0.09)"
          iconColor="#2563eb"
        />
        <StatCard
          title="NEW THIS MONTH"
          value={newUsers}
          description="Joined in the current month"
          icon="ti-user-plus"
          accentColor="#7c3aed"
          iconBg="rgba(124,58,237,0.09)"
          iconColor="#7c3aed"
        />
        <StatCard
          title="ADMIN ACCOUNTS"
          value={totalAdmins}
          description="Users with admin privileges"
          icon="ti-shield-check"
          accentColor="#d97706"
          iconBg="rgba(217,119,6,0.09)"
          iconColor="#d97706"
        />
      </div>

      <div className="u-controls">
        <div className="u-search-wrap">
          <svg className="u-search-icon" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <circle cx="11" cy="11" r="8" /><line x1="21" y1="21" x2="16.65" y2="16.65" />
          </svg>
          <input
            type="search"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="u-search-input"
            placeholder="Search by customer name..."
          />
        </div>

        <div className="u-filter-wrap">
          <div className="u-filter-group">
            <i className="ti ti-filter" style={{ fontSize: 14, color: "#6b7b75" }} />
            <select
              className="u-filter-select"
              value={selectRole}
              onChange={(e) => setSelectRole(e.target.value)}
            >
              <option value="">All Roles</option>
              <option value="user">Users</option>
              <option value="admin">Admins</option>
            </select>
          </div>
        </div>
      </div>

      <p className="u-showing">
        Showing <strong>{filteredUsers.length}</strong> of <strong>{totalUsers}</strong> users
      </p>

      <UserTable filteredUsers={filteredUsers ?? []} />
    </div>
  )
}