import { LoginForm } from "@/Components/login-form"
import GuestLayout from "@/Layouts/GuestLayout"
import { Head, useForm } from "@inertiajs/react"

export default function Login({ status, canResetPassword }) {
  const { data, setData, post, processing, errors, reset } = useForm({
    email: "",
    password: "",
    remember: false,
  })

  return (
    <GuestLayout>
      <Head title="Log in" />

      {status && (
        <div className="mb-4 text-sm font-medium text-green-600">{status}</div>
      )}

      <LoginForm
        data={data}
        setData={setData}
        post={post}
        processing={processing}
        errors={errors}
        reset={reset}
      />
    </GuestLayout>
  )
}
