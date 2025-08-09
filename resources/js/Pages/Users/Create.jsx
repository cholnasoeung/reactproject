import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout"
import { Head, useForm } from "@inertiajs/react"
import { Card, CardContent, CardHeader, CardTitle } from "@/Components/ui/card"
import { Input } from "@/Components/ui/input"
import { Label } from "@/Components/ui/label"
import { Button } from "@/Components/ui/button"
import InputError from "@/Components/InputError"

export default function Create({ auth }) {
  const { data, setData, post, processing, errors } = useForm({
    name: "",
    email: "",
    password: "",
    password_confirmation: "",
  })

  const submit = (e) => {
    e.preventDefault()
    post(route("users.store"))
  }

  return (
    <AuthenticatedLayout user={auth.user}>
      <Head title="Add User" />
      <Card>
        <CardHeader>
          <CardTitle>Add a new user</CardTitle>
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
                  required
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
                  required
                />
                <InputError message={errors?.password_confirmation} />
              </div>
              <div className="flex justify-start">
                <Button className="hover:bg-gray-700 hover:shadow-lg" type="submit" disabled={processing}>
                  Create
                </Button>
              </div>
            </div>
          </form>
        </CardContent>
      </Card>
    </AuthenticatedLayout>
  )
}
