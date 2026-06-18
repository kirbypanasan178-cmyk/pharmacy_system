import { Button } from "../ui/Button"

export const PrivacySection = () => {
    return (
        <div style={{ width: "80vw", maxWidth: "100%" }}>
            <div className="card shadow-sm rounded-3 overflow-hidden border-0">

                {/* Header */}
                <div className="px-4 pt-4 pb-3 border-bottom" style={{ background: "linear-gradient(135deg, #f8f9fa 0%, #e9ecef 100%)" }}>
                    <h5 className="mb-0 fw-semibold">Privacy Settings</h5>
                    <p className="text-muted mb-0 small">Manage your data and account privacy</p>
                </div>

                <div className="card-body px-4 py-3">

                    <div className="mb-3">
                        <span className="badge bg-danger bg-opacity-10 text-danger px-2 py-1 rounded-2"
                            style={{ fontSize: 11, letterSpacing: ".5px", textTransform: "uppercase", fontWeight: 600 }}>
                            Danger Zone
                        </span>
                    </div>

                    <div className="rounded-3 p-3 d-flex align-items-center justify-content-between gap-3"
                        style={{ border: "1px solid #f5c2c7", background: "#fff5f5" }}>
                        <div>
                            <p className="mb-0 fw-medium small">Request Account Deletion</p>
                            <p className="mb-0 text-muted" style={{ fontSize: 12 }}>
                                Permanently delete your account and all associated data. This action cannot be undone.
                            </p>
                        </div>
                        <Button variant="danger" className="flex-shrink-0">
                            Delete Account
                        </Button>
                    </div>

                </div>
            </div>
        </div>
    )
}