import { Button } from "../ui/Button"
import { Input } from "../ui/Input"
import { Label } from "../ui/Label"

export const PasswordSection = () => {
    return (
        <div style={{ width: "80vw", maxWidth: "100%" }}>
            <div className="card shadow-sm rounded-3 overflow-hidden border-0">

                {/* Header */}
                <div className="px-4 pt-4 pb-3 border-bottom" style={{ background: "linear-gradient(135deg, #f8f9fa 0%, #e9ecef 100%)" }}>
                    <h5 className="mb-0 fw-semibold">Change Password</h5>
                    <p className="text-muted mb-0 small">Keep your account secure with a strong password</p>
                </div>

                <div className="card-body px-4 py-3">

                    <div className="mb-3">
                        <span className="badge bg-primary bg-opacity-10 text-primary px-2 py-1 rounded-2"
                            style={{ fontSize: 11, letterSpacing: ".5px", textTransform: "uppercase", fontWeight: 600 }}>
                            Password
                        </span>
                    </div>

                    <div className="mb-3">
                        <Label className="form-label small fw-medium">Current Password</Label>
                        <Input inputSize="sm" type="password" className="w-100" placeholder="Enter current password" />
                    </div>

                    <div className="mb-3">
                        <Label className="form-label small fw-medium">New Password</Label>
                        <Input inputSize="sm" type="password" className="w-100" placeholder="Enter new password" />
                        <p className="text-muted mt-1 mb-0" style={{ fontSize: 12 }}>
                            Must be at least 8 characters.
                        </p>
                    </div>

                    <div className="mb-3">
                        <Label className="form-label small fw-medium">Confirm New Password</Label>
                        <Input inputSize="sm" type="password" className="w-100" placeholder="Re-enter new password" />
                    </div>

                    <hr className="my-3" />

                    <div className="d-flex justify-content-end gap-2">
                        <Button variant="secondary">Cancel</Button>
                        <Button variant="success">Update Password</Button>
                    </div>

                </div>
            </div>
        </div>
    )
}