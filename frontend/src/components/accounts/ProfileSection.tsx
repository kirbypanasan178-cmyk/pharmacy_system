import { useEffect, useState } from "react"
import { Button } from "../ui/Button"
import { Input } from "../ui/Input"
import { Label } from "../ui/Label"
import { useGetUser } from "../../hooks/users/useGetUser"
import { useUser } from "../../hooks/useUser"
import { profileFormInitialState, type ProfileFormType } from "../../types/user"
import { useUpdateUser } from "../../hooks/users/useUpdateUser"
import { ErrorLabel } from "../ui/errorLabel"
import { profileValidation, type ValidationErrorsProfile } from "../../validators/profileValidation"

export const ProfileSection = () => {
    const [form, setForm] = useState<ProfileFormType>(profileFormInitialState);
    const [errors, setErrors] = useState<ValidationErrorsProfile>({})

    const { getUser } = useGetUser()
    const { updateUser } = useUpdateUser()
    
    const parsedUser = useUser()

  useEffect(() => {
    const fetchUser = async () => {
        const userAccountInfo = await getUser(parsedUser.user._id)
        if (userAccountInfo) {
            setForm((prev) => ({
                ...prev,
                ...userAccountInfo,
                birthdate: userAccountInfo.birthdate
                    ? userAccountInfo.birthdate.slice(0, 10)
                    : prev.birthdate,
                address: {
                    ...prev.address,
                    ...(userAccountInfo.address ?? {}),
                },
            }))
        }
    }
    fetchUser()
}, [parsedUser.user._id])

   const handleChange = (
      e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
    ) => {
        const { value, id } = e.target

        setForm((prev) => ({
            ...prev,
            [id]: value,
        }))
    }

    const handleAddressChange = (
      e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
    ) => {
        const { value, id } = e.target

        setForm((prev) => ({
            ...prev,
            address: {
                ...prev.address,
                [id]: value,
            },
        }))
    }

    const handleSubmit = async (e: React.FormEvent<HTMLButtonElement>) => {
    e.preventDefault()
    console.log("Submit clicked") // 👈 add this first
    
    const newErrors = profileValidation(form);
    console.log("Validation errors:", newErrors) // 👈 add this
    
    if (Object.keys(newErrors).length > 0) {
        setErrors(newErrors);
        return;
    }

    console.log("Calling updateUser with:", parsedUser.user._id, form) // 👈 add this
    const updatedUser = await updateUser(parsedUser.user._id, form)
    console.log("updateUser result:", updatedUser) // 👈 add this

    if (!updatedUser) {
        console.log("Cannot update user")
        return
    }
    console.log("Update user info: ", updatedUser)
    setErrors({})
}

    const handleCancel = async () => {
        const userAccountInfo = await getUser(parsedUser.user._id)
        if (userAccountInfo) {
            setForm((prev) => ({
                ...prev,
                ...userAccountInfo,
                birthdate: userAccountInfo.birthdate
                    ? userAccountInfo.birthdate.slice(0, 10)
                    : prev.birthdate,
                address: {
                    ...prev.address,
                    ...(userAccountInfo.address ?? {}),
                },
            }))
        }
        setErrors({})
    }

    return (
        <div style={{ width: "80vw", maxWidth: "100%" }}>
            <div className="card shadow-sm rounded-3 overflow-auto border-0">

                {/* Header */}
                <div className="px-4 pt-4 pb-3 border-bottom" style={{ background: "linear-gradient(135deg, #f8f9fa 0%, #e9ecef 100%)" }}>
                    <div className="d-flex align-items-center gap-3">
                        <div
                            className="rounded-circle bg-light d-flex align-items-center justify-content-center fw-semibold text-secondary flex-shrink-0"
                            style={{ width: 72, height: 72, fontSize: 26, border: "3px solid #fff", boxShadow: "0 0 0 2px #dee2e6" }}
                        >
                            JD
                        </div>
                        <div>
                            <h5 className="mb-0 fw-semibold">My Profile</h5>
                            <p className="text-muted mb-0 small">Manage and protect your account</p>
                        </div>
                        <div className="ms-auto">
                            <span className="badge rounded-pill px-3 py-2 bg-success bg-opacity-10 text-success">
                                ✓ Verified
                            </span>
                        </div>
                    </div>
                </div>

                <div className="card-body px-4 py-3">

                    {/* Personal Info */}
                    <div className="mb-3">
                        <span className="badge bg-primary bg-opacity-10 text-primary px-2 py-1 rounded-2"
                            style={{ fontSize: 11, letterSpacing: ".5px", textTransform: "uppercase", fontWeight: 600 }}>
                            Personal Info
                        </span>
                    </div>

                    <div className="row g-3 mb-3">
                        <div className="col-md-6">
                            <Label className="form-label small fw-medium">Full Name</Label>
                            <Input 
                                id="fullname"
                                value={form.fullname} 
                                onChange={handleChange}
                                inputSize="sm" className="w-100" placeholder="e.g. Juan Dela Cruz" />
                            {errors.fullname && (
                                <ErrorLabel message={errors.fullname} className="signup-error" />
                            )}
                        </div>
                        <div className="col-md-6">
                            <Label className="form-label small fw-medium">Email Address</Label>
                            <Input
                                id="email"
                                value={form.email} 
                                onChange={handleChange}
                                inputSize="sm" className="w-100" placeholder="you@example.com" />
                            {errors.email && (
                                <ErrorLabel message={errors.email} className="signup-error" />
                            )}
                        </div>
                    </div>

                    <div className="row g-3 mb-3">
                        <div className="col-md-6">
                            <Label className="form-label small fw-medium">Phone Number</Label>
                            <Input 
                                id="phone"
                                value={form.phone} 
                                onChange={handleChange}
                                inputSize="sm" className="w-100" placeholder="+63 9XX XXX XXXX" />
                            {errors.phone && (
                                <ErrorLabel message={errors.phone} className="signup-error" />
                            )}
                        </div>
                        <div className="col-md-6">
                            <Label className="form-label small fw-medium">Date of Birth</Label>
                            <input 
                                id="birthdate"
                                value={form.birthdate} 
                                onChange={handleChange}
                                type="date" className="form-control form-control-sm w-100" />
                            {errors.birthdate && (
                                <ErrorLabel message={errors.birthdate} className="signup-error" />
                            )}
                        </div>
                    </div>

                    <div className="row g-3 mb-3">
                        <div className="col-md-6">
                            <Label className="form-label small fw-medium">Age</Label>
                            <input
                                id="age"
                                value={form.age}
                                onChange={(e) =>
                                    setForm((prev) => ({
                                        ...prev,
                                        age: Number(e.target.value),
                                    }))
                                }
                                type="number" className="form-control form-control-sm w-100" placeholder="Age" />
                            {errors.age && (
                                <ErrorLabel message={errors.age} className="signup-error" />
                            )}
                        </div>
                        <div className="col-md-6">
                            <Label className="form-label small fw-medium">Birthplace</Label>
                            <Input
                                id="birthplace"
                                value={form.birthplace}
                                onChange={handleChange}
                                inputSize="sm" className="w-100" placeholder="Birthplace" />
                            {errors.birthplace && (
                                <ErrorLabel message={errors.birthplace} className="signup-error" />
                            )}
                        </div>
                    </div>

                    <div className="mb-3">
                        <Label className="form-label small fw-medium d-block mb-1">Gender</Label>
                        <div className="d-flex gap-3">
                            {(["male", "female", "other"] as const).map((g) => (
                                <div className="form-check" key={g}>
                                    <input
                                        type="radio"
                                        name="gender"
                                        id={g}
                                        value={g}
                                        checked={form.gender === g}
                                        onChange={() =>
                                            setForm((prev) => ({ ...prev, gender: g }))
                                        }
                                        className="form-check-input"
                                    />
                                    <label className="form-check-label small text-capitalize" htmlFor={g}>{g}</label>
                                </div>
                            ))}
                        </div>
                        {errors.gender && (
                            <ErrorLabel message={errors.gender} className="signup-error" />
                        )}
                    </div>

                    <hr className="my-3" />

                    {/* Address Info */}
                    <div className="mb-3">
                        <span className="badge bg-success bg-opacity-10 text-success px-2 py-1 rounded-2"
                            style={{ fontSize: 11, letterSpacing: ".5px", textTransform: "uppercase", fontWeight: 600 }}>
                            Address Info
                        </span>
                    </div>

                    <div className="mb-3">
                        <Label className="form-label small fw-medium">Street</Label>
                        <Input
                            id="street"
                            value={form.address.street}
                            onChange={handleAddressChange}
                            inputSize="sm" className="w-100" placeholder="House no. & street name" />
                        {errors.street && (
                            <ErrorLabel message={errors.street} className="signup-error" />
                        )}
                    </div>

                    <div className="row g-3 mb-3">
                        <div className="col-md-6">
                            <Label className="form-label small fw-medium">Barangay</Label>
                            <Input
                                id="barangay"
                                value={form.address.barangay}
                                onChange={handleAddressChange}
                                inputSize="sm" className="w-100" placeholder="Barangay" />
                            {errors.barangay && (
                                <ErrorLabel message={errors.barangay} className="signup-error" />
                            )}
                        </div>
                        <div className="col-md-6">
                            <Label className="form-label small fw-medium">City / Municipality</Label>
                            <Input
                                id="city"
                                value={form.address.city}
                                onChange={handleAddressChange}
                                inputSize="sm" className="w-100" placeholder="City" />
                            {errors.city && (
                                <ErrorLabel message={errors.city} className="signup-error" />
                            )}
                        </div>
                    </div>

                    <div className="row g-3 mb-3">
                        <div className="col-md-6">
                            <Label className="form-label small fw-medium">Province</Label>
                            <Input
                                id="province"
                                value={form.address.province}
                                onChange={handleAddressChange}
                                inputSize="sm" className="w-100" placeholder="Province" />
                            {errors.province && (
                                <ErrorLabel message={errors.province} className="signup-error" />
                            )}
                        </div>
                        <div className="col-md-6">
                            <Label className="form-label small fw-medium">ZIP Code</Label>
                            <Input
                                id="zipcode"
                                value={form.address.zipcode}
                                onChange={handleAddressChange}
                                inputSize="sm" className="w-100" placeholder="e.g. 1000" />
                            {errors.zipcode && (
                                <ErrorLabel message={errors.zipcode} className="signup-error" />
                            )}
                        </div>
                    </div>

                    <hr className="my-3" />

                    <div className="d-flex justify-content-end gap-2">
                        <Button 
                        onClick={handleCancel}
                        variant="secondary">Cancel</Button>
                        <Button 
                        onClick={handleSubmit}
                        variant="success">Save Changes</Button>
                    </div>

                </div>
            </div>
        </div>
    )
}