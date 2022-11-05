import { LoaderFunction, redirect } from '@remix-run/node'
import { accessTokenCookie } from '~/cookies'

export const loader: LoaderFunction = async ({ request }) => {
    const cookieHeader = request.headers.get('Cookie')
    const cookie = await accessTokenCookie.parse(cookieHeader)

    if (!cookie) {
        return redirect('/login')
    }

    return true
}

export default function Dashboard() {
    return (
        <div>
            <h1>Dashboard</h1>
        </div>
    )
}
