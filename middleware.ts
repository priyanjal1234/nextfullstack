import withAuth from "next-auth/middleware";
import { NextResponse } from "next/server";

export default withAuth(
    function middleware() {
        return NextResponse.next()
    },
    {
        callbacks: {
            authorized({token,req}) {
                const {pathname} = req.nextUrl

                if(pathname.startsWith("/api/auth") || pathname === "/signIn" || pathname === "/register") {
                    return true
                }

                return !!token
            }
        }
    }
)


export const config = {
    matcher: ["/api/:path*", "/dashboard/:path*", "/profile/:path*"]
}