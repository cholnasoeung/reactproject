import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout"
import { Head, useForm } from "@inertiajs/react"
import { Card, CardContent, CardHeader, CardTitle } from "@/Components/ui/card"
import { Input } from "@/Components/ui/input"
import { Label } from "@/Components/ui/label"
import { Button } from "@/Components/ui/button"
import InputError from "@/Components/InputError"

export default function Edit({ user }) {
    const { data, setData, put, processing, errors } = useForm({
        name: user.name,
        email: user.email,
        password: "",
        password_confirmation: "",
    })

    const submit = (e) => {
        e.preventDefault()
        put(route("users.update", user.id))
    }

    return (
        <AuthenticatedLayout user={user}>
            <Head title="Edit User" />
            <Card>
                <CardHeader>
                    <CardTitle>Edit User</CardTitle>
                </CardHeader>
                <CardContent>
                    <form onSubmit={submit}>
                        <div className="grid gap-4">
                            <div className="grid gap-2">
                                <Label htmlFor="name">Name</Label>
                                <Input
                                    id="name"
                                    type="text"
                                    value={data.name}
                                    onChange={(e) => setData("name", e.target.value)}
                                    required
                                />
                                <InputError message={errors?.name} />
                            </div>
                            <div className="grid gap-2">
                                <Label htmlFor="email">Email</Label>
                                <Input
                                    id="email"
                                    type="email"
                                    value={data.email}
                                    onChange={(e) => setData("email", e.target.value)}
                                    required
                                />
                                <InputError message={errors?.email} />
                            </div>
                            <div className="grid gap-2">
                                <Label htmlFor="password">Password</Label>
                                <Input
                                    id="password"
                                    type="password"
                                    value={data.password}
                                    onChange={(e) => setData("password", e.target.value)}
                                />
                                <InputError message={errors?.password} />
                            </div>
                            <div className="grid gap-2">
                                <Label htmlFor="password_confirmation">Confirm Password</Label>
                                <Input
                                    id="password_confirmation"
                                    type="password"
                                    value={data.password_confirmation}
                                    onChange={(e) =>
                                        setData("password_confirmation", e.target.value)
                                    }
                                />
                                <InputError message={errors?.password_confirmation} />
                            </div>
                            <div className="flex justify-start">
                                <Button type="submit" disabled={processing}>
                                    Save
                                </Button>
                            </div>
                        </div>
                    </form>
                </CardContent>
            </Card>
        </AuthenticatedLayout>
    )
}
