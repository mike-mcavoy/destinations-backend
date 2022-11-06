import { ActionFunction, redirect } from '@remix-run/node'

export const action: ActionFunction = async ({ request }) => {
    const formData = await request.formData()
    const parsedData = Object.fromEntries(formData)

    const res = await fetch('http://localhost:3001/api/auth/signin', {
        method: 'POST',
        headers: {
            Accept: 'application/json',
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(parsedData),
    })

    const data = await res.json()

    if (data.status !== 200) {
        return redirect('/login')
    }

    return redirect('/dashboard')
}

export default function Login() {
    return (
        <div>
            <h1>Login</h1>
            <form method="POST" action="/login">
                <label>
                    Email
                    <br />
                    <input name="email" type="text" />
                </label>
                <br />
                <label>
                    Password
                    <br />
                    <input name="password" type="password" />
                </label>
                <button type="submit">Login</button>
            </form>
        </div>
    )
}
