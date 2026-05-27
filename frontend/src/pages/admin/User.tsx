import { useEffect, useState } from "react"
import { useAppSelector } from "../../hooks/redux/reduxHooks"
import { useGetAllUsers } from "../../hooks/users/useGetAllUsers"
import { UserTable } from "../../components/table/UserTable"
import "../../css/User.css"

export const User = () => {
  const users = useAppSelector((state) => state.user.users)
  const { getAllUsers } = useGetAllUsers()

  const currentDate = new Date()

  const [search, setSearch] = useState<string>("")
  const [selectRole, setSelectRole] = useState<string>("")

  const filteredUsers = users.filter(
    (user) => {
        const matchesName  = user.fullname.toLowerCase()
        .includes(search.toLowerCase())
        const matchesRole = user.role === selectRole || selectRole === ""

        return matchesName && matchesRole
    }
        
  )

  const totalUsers        = users?.length || 0
  const totalAdmins       = users?.filter((u) => u.role === "admin").length || 0
  const totalActiveUsers  = users?.filter((u) => u.isActive === true).length || 0
  const newUsers          = users?.filter((u) => {
    const d = new Date(u.createdAt)
    return (
      d.getMonth()    === currentDate.getMonth() &&
      d.getFullYear() === currentDate.getFullYear()
    )
  }).length || 0

  useEffect(() => {
    getAllUsers()
  }, [])

  const stats = [
    {
      modifier:    "total",
      label:       "Total Users",
      value:       totalUsers.toLocaleString(),
      trend:       "+12% from last month",
      description: "All registered accounts",
    },
    {
      modifier:    "active",
      label:       "Active Users",
      value:       totalActiveUsers.toLocaleString(),
      trend:       "+8% from last month",
      description: "Currently active accounts",
    },
    {
      modifier:    "new",
      label:       "New This Month",
      value:       newUsers.toLocaleString(),
      trend:       "+5% from last month",
      description: "Joined in the current month",
    },
    {
      modifier:    "admin",
      label:       "Admin Accounts",
      value:       totalAdmins.toLocaleString(),
      trend:       "No change",
      description: "Users with admin privileges",
    },
  ]

  return (
    <div className="user-page">
      <div className="user-page__header">
        <h1 className="user-page__title">Users</h1>
        <p className="user-page__subtitle">
          {currentDate.toLocaleDateString("en-US", { month: "long", year: "numeric" })}
        </p>
      </div>

      <div className="stat-grid">
        {stats.map((s) => (
          <div key={s.modifier} className={`stat-card stat-card--${s.modifier}`}>
            <div className="stat-card__accent" aria-hidden="true" />
            <p className="stat-card__label">{s.label}</p>
            <p className="stat-card__value">{s.value}</p>
            <span className="stat-card__trend">{s.trend}</span>
            <p className="stat-card__desc">{s.description}</p>
          </div>
        ))}
      </div>

      <div className="order-controls">
                <div className="search-wrapper">
                    <svg className="search-icon" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/>
                    </svg>
                    <input
                        type="search"
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        className="search-input"
                        placeholder="Search orders by customer..."
                    />
                </div>

                <div className="filters-wrapper">
                    <div className="filter-group">
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polygon points="22 3 2 3 10 12.46 10 19 14 21 14 12.46 22 3"/></svg>
                        <select className="filter-select" value={selectRole} onChange={(e) => setSelectRole(e.target.value)}>
                            <option value="">all</option>
                            <option value="user">users</option>
                            <option value="admin">admins</option>
                        </select>
                    </div>
                </div>
            </div>

      <UserTable filteredUsers={filteredUsers ?? []} />
    </div>
  )
}